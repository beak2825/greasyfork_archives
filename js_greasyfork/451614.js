// ==UserScript==
// @name         sunshine logs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  sunshine logs load all.
// @author       You
// @match        https://app.smooch.io/apps/611e523b75e02100d33da72b/logs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smooch.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451614/sunshine%20logs.user.js
// @updateURL https://update.greasyfork.org/scripts/451614/sunshine%20logs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // sleep function def, only can be sync when use async function
    const sleep = (delay) => new Promise((resolve) => {
        if (delay < 1000) {
            delay = 1000
        }
        console.log("start sleep")
        setTimeout(resolve, delay);
        console.log("end sleep => time = " + delay)
    })

    // always be 10 am
    const getDate = () => {
        let date = new Date()
        if (date.getDay() === 1) {
            date =  new Date(date.setDate(date.getDate() - 3));
        } else {
            date =  new Date(date.setDate(date.getDate() - 1));
        }
        date.setHours(10)
        date.setMinutes(0)
        date.setSeconds(0)
    
        console.log(date)
        return date
    }

    const lastDateTime = getDate()

    // add a btn abusolut
    waitElementLoaded("mount", absoluteBtn);

    function absoluteBtn(el) {
        console.log("run absoluteBtn")
        var btn = document.createElement("button");
        btn.setAttribute("id", "absoluteBtn");
        btn.setAttribute("style", "position: absolute; color: #ff502c;right: 18px;bottom: 140px;background-color: bisque;");
        btn.addEventListener("click", loadAll);
        btn.innerText = "load-all"
        if (el.parentNode) {
            el.parentNode.appendChild(btn);
        }
    }
    // click info
    async function loadAll() {
        // 循环点击按钮
        let count = 1;

        while (1) {
            // if (count > 2) {
            //     return
            // }
            let els = document.getElementById("events-table").childNodes
            let length = document.getElementById("events-table").childNodes.length
            console.log("logs size => " + length)
            // 判断时间
            let lastOne = els[length - 3];
            let lastDate = new Date(lastOne.childNodes[1].childNodes[0].childNodes[1].childNodes[0].innerHTML)
            console.log(lastDate)
            if (lastDateTime > lastDate) {
                break;
            }
            let aTag = els[length - 2];
            console.log(aTag.tagName == 'A' ? "found and click" : "wait page loading")
            if (aTag.tagName == 'A') {
                aTag.click()
            }
            await sleep((count++ % 5) * 1000)
        }
        download()
    }

    function waitElementLoaded(id, func) {
        var count = 0;
        let timer = setInterval(() => {
            count++;
            if (count > 50) {
                clearInterval(timer);
            }
            let element = document.getElementById(id);
            console.log("run loading")
            if (element) {
                clearInterval(timer);
                func(element);
            }
        }, 1500);
    }

    function download() {
        var elementA = document.createElement('a');
        //文件的名称为时间戳加文件名后缀
        elementA.download = "logs-" + timeFormat() + ".json";
        elementA.style.display = 'none';
        let arr = new Array(1);
        arr[0] = allLogs();
        let result = arr.join("\r\n");
        //生成一个blob二进制数据，内容为json数据      
        var blob = new Blob([result]);
        //生成一个指向blob的URL地址，并赋值给a标签的href属性
        elementA.href = URL.createObjectURL(blob);
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA);
    }

    function allLogs() {
        let arr = [];

        // 拼接日志
        let nodes = document.getElementById("events-table").childNodes;
        for (let i = 1; i < nodes.length-2; i++) {
            let el = nodes[i];
            // 时间
            let time = el.childNodes[1].childNodes[0].childNodes[1].childNodes[0].innerHTML
            // status
            let deliveryStatus = el.childNodes[2].childNodes[0].childNodes[1].childNodes[0].innerHTML
            // details
            let detail = detailLog(el.childNodes[3].childNodes)

            arr.push({
                "time": time,
                "delivery_status": deliveryStatus,
                "detail": detail
            })
        }
        return JSON.stringify(arr);
    }

    function detailLog(els) {
        const list = []
        els.forEach(el => {
             let title = el.innerHTML.split(":")[0];
            let value = el.childNodes[1].innerHTML;
            list.push({
                [title]: value
            })
        });
        return list
    }

    function timeFormat() {
        let date = new Date();
        let format = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        return format
    }
})();