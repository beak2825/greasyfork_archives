// ==UserScript==
// @license      MIT
// @name         VjudgeRankParse
// @namespace    http://tampermonkey.net
// @version      v1.0
// @description  用于爬取vjudge的排名情况
// @author       chenyyy28
// @match        https://vjudge.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/534384/VjudgeRankParse.user.js
// @updateURL https://update.greasyfork.org/scripts/534384/VjudgeRankParse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement("li")
    button.classList.add("nav-item")
    button.innerText = "解析排名"
    //button.style.lineHeight = "38px"
    button.style.padding = "8px 16px"
    button.style.cursor = "pointer"
    let title = document.querySelector(".nav.nav-tabs")
    title.insertBefore(button,title.querySelector(".text-xs-right"))
    button.onclick = parse
    function parse(){
        let time = prompt("请输入训练截止时间（小时），允许小数")
        if(time!=null||time!=""){
            let timeInt = parseFloat(time)
            let ddl_H = parseInt(timeInt)
            let ddl_M = parseInt(60*(timeInt-parseInt(timeInt)))
            let ddl = ddl_H.toString()+":"+ddl_M.toString().padStart(2,'0')+":00"
            let rankTable = document.querySelector("#contest-rank-table tbody")
            let account = []
            let ranking = []
            let accept = []
            let supplement = []
            for(let i = 1;i<=rankTable.children.length; i++){
                let cssSelector = "tr:nth-child("+i.toString()+")"
                let data = rankTable.querySelector(cssSelector)
                let accountData = data.querySelector("td:nth-child(2) div a").text;
                if(accountData.indexOf(" ") != -1){
                    accountData = accountData.split(" ")[0]
                }
                account.push(accountData)
                ranking.push(parseInt(data.querySelector("td:nth-child(1)").innerText))
                accept.push(0)
                supplement.push(0)
                for(let j = 5;j<=data.children.length;j++){
                    let passData = data.querySelector(".accepted:nth-child("+j.toString()+")");
                    if(passData!=null){
                        let passTime = passData.innerText.split('\n')[0]
                        if(passTime>ddl||passTime.length>ddl.length){
                            supplement[i-1]++;
                        }else{
                            accept[i-1]++;
                        }
                    }
                }
            }
            console.log(account)
            console.log(ranking)
            console.log(accept)
            console.log(supplement)
            let res = []
            for(let i = 0;i<rankTable.children.length;i++){
                let el = {
                    account: account[i],
                    rank: ranking[i],
                    accept: accept[i],
                    supplement: supplement[i]
                }
                res.push(el)
            }
            res.sort((a,b)=>{
                if(a.accept!==b.accpet){
                    return b.accept-a.accept
                }else{
                    if(a.accept==0){
                        if(a.supplement>b.supplment){
                            b.supplement-a.supplement
                        }else{
                            return 0;
                        }
                    }else{
                        return 0
                    }
                }
            })
            let msg = "本次获取结果：\n"
            for(let i = 1;i<=rankTable.children.length;i++){
                res[i-1].rank = i;
                let addMsg = res[i-1].account+"\t：排名 "+res[i-1].rank+ "\t过题数 "+res[i-1].accept+ "\t补题数 " +res[i-1].supplement
                msg = msg+addMsg +'\n'
            }
            msg = msg + "请输入本次训练id\n 如果不清楚id，可以在管理系统查询"
            let id = prompt(msg)
            if(id!=null&&id!=""){
                let url = prompt("请输入数据目标地址")
                let req = {
                    id: id,
                    platform: "vjudge",
                    data:res
                }
                console.log(JSON.stringify(req))
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify(req),
                    onload: function(response){
                        console.log("请求成功");
                        console.log(response.responseText);
                    },
                    onerror: function(response){
                        console.log(response);
                    }
                });
            }
        }
    }
})();