// ==UserScript==
// @name         CNPatentFetcherClient
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  try to take over the world!
// @author       webee.yw@gmail.com
// @match        http://epub.sipo.gov.cn/patentoutline.action

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/387043/CNPatentFetcherClient.user.js
// @updateURL https://update.greasyfork.org/scripts/387043/CNPatentFetcherClient.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchData(startDate, endDate, page, serverURL) {
        let url = "http://epub.sipo.gov.cn/patentoutline.action";
        let params = {
            "credentials":"include",
            "headers":{
                "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-language":"zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6,ja;q=0.5,la;q=0.4",
                "cache-control":"max-age=0",
                "content-type":"application/x-www-form-urlencoded",
                "upgrade-insecure-requests":"1"
            },
            "referrer":"http://epub.sipo.gov.cn/patentoutline.action",
            "referrerPolicy":"no-referrer-when-downgrade",
            "body":`showType=1&strSources=pip&strWhere=AD%3DBETWEEN%5B%27${startDate}%27%2C%27${endDate}%27%5D&numSortMethod=2&strLicenseCode=&numIp=0&numIpc=0&numIg=0&numIgc=0&numIgd=0&numUg=0&numUgc=0&numUgd=&numDg=0&numDgc=0&pageSize=10&pageNow=${page+1}`,
            "method":"POST",
            "mode":"cors"
        }
        try {
            let resp = await fetch(url, params)
            let text = await resp.text()
            let p = new DOMParser()
            let d = p.parseFromString(text, "text/html")
            let cpLinrs = d.getElementsByClassName("cp_linr")
            let content = ""
            for (let i = 0; i < cpLinrs.length; i++) {
                let cpLinr = cpLinrs[i]
                cpLinr.removeChild(cpLinr.getElementsByClassName("cp_botsm")[0])
                content = content.concat(cpLinr.outerHTML, "\n")
            }
            let result = {
                startDate: startDate,
                endDate: endDate,
                page: page,
                content:content
            }
            await fetch(`${serverURL}/result`,{method:"POST",
                                               headers:{"content-type":"application/json"},
                                               body:JSON.stringify(result)}
                       )
            if (cpLinrs.length < 1) {
                taskInfoBoard.append(`请求失败= ${startDate}-${endDate} #${page}`)
                return 1
            } else {
                taskInfoBoard.append(`请求成功< ${startDate}-${endDate} #${page}`)
            }
            return 0
        } catch(err) {
            taskInfoBoard.append(`请求失败= ${startDate}-${endDate} #${page}: ${err}`)
            return 1
        }
    }

    let started = false
    let timeout = 0
    async function startExecute() {
        if (started) {
            // 已经开始
            started = false
            clearTimeout(timeout)
            document.getElementById("startExecute").disabled = true;
            return
        }

        // 开始
        started = true
        document.getElementById("startExecute").value = "停止执行";
        document.getElementById("startExecute").disabled = false;
        //taskInfoBoard.clear()
        let serverURL = document.getElementById("serverURL").value
        let applyTaskURL = `${serverURL}/task`

        let errCount = 0
        let stopped = false
        while (!stopped && started) {
            clearTimeout(timeout)
            // 45秒没有响应，则stop, 并启动另一个执行过程
            timeout = setTimeout(function(){
                taskExceptionBoard.append("执行超时")
                stopped = true
            }, 45000)
            try {
                let task = await fetch(applyTaskURL).then(resp=>resp.json())
                if (task.pages.length == 0) {
                    break
                }

                let startAt = new Date()
                let responses = []
                task.pages.forEach(page => {
                    taskInfoBoard.append(`开始请求> ${task.startDate}-${task.endDate} #${page}`)
                    responses = responses.concat(fetchData(task.startDate, task.endDate, page, serverURL))
                })
                taskInfoBoard.append(`>>>>>>>`)
                for (let i=0;i<responses.length;i++) {
                    let ec = await responses[i]
                    if (ec == 0) {
                        errCount = 0
                    } else {
                        errCount += ec
                    }
                }
                let endAt = new Date()
                taskInfoBoard.append(`>>>>>>>>>>>> ${endAt-startAt}ms`)
            } catch(err) {
                taskInfoBoard.append(`执行异常= ${err}`)
            }
            if (errCount>20) {
                taskExceptionBoard.append(`连续执行失败= ${errCount}次`)
                stopped = true
                await sleep(10000)
            }
        }
        if (started) {
            started=false
            startExecute()
        } else {
            started=false
            taskInfoBoard.append(`执行结束`)
            document.getElementById("startExecute").value = "开始执行";
            document.getElementById("startExecute").disabled = false;
        }
    }

    let taskInfoBoard = null
    let taskExceptionBoard = null
    function insertControlBox() {
        let p = new DOMParser()
        let d = p.parseFromString(`<div id="controlBox" style="border:1px solid red;">
<h3>爬取中国专利公告任务执行前端<h3>
server: <input type="text" id="serverURL" value="http://localhost:6789" size="96"><br/>
<input type="button" id="startExecute" value="开始执行">
<p id="taskInfoBoard" style="border:1px solid green"></p>
<p id="taskExceptionBoard" style="color:red;border:1px solid black"></p>
</div>`, "text/html")
        let controlBox = d.getElementById("controlBox")
        let content = document.getElementsByClassName("w790 right")[0]
        content.insertBefore(controlBox, content.children[0])

        taskExceptionBoard = document.getElementById("taskExceptionBoard")
        taskExceptionBoard.lines = 0
        taskExceptionBoard.append = function(t) {
            this.innerText = this.innerText.concat((new Date()).toISOString(), " ", t, "\n")
            this.lines += 1
            if (this.lines > 10) {
                this.removeChild(this.childNodes[0])
                this.removeChild(this.childNodes[0])
            }
        }

        taskInfoBoard = document.getElementById("taskInfoBoard")
        taskInfoBoard.lines = 0
        taskInfoBoard.clear = function() {
            this.innerText = ""
        }
        taskInfoBoard.append = function(t) {
            this.innerText = this.innerText.concat((new Date()).toISOString(), " ", t, "\n")
            this.lines += 1
            if (this.lines > 15) {
                this.removeChild(this.childNodes[0])
                this.removeChild(this.childNodes[0])
            }
        }
        // action
        document.getElementById("startExecute").addEventListener("click", startExecute, false)
    }
    insertControlBox()
})();