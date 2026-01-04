// ==UserScript==
// @license      MIT
// @name         CodeforcesRankParse
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  用于OJ的排名解析，传递至后台处理
// @author       chenyyy28
// @match        https://codeforces.com/*/standings/*
// @match        https://codeforces.com/*/standings
// @match        https://codeforc.es/*/standings/*
// @match        https://codeforc.es/*/standings
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/534383/CodeforcesRankParse.user.js
// @updateURL https://update.greasyfork.org/scripts/534383/CodeforcesRankParse.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "解析排名"; //按钮内容
    //button.style.width = "50px"; //按钮宽度
    button.style.height = "17px"; //按钮高度
    button.style.align = "center"; //文本居中
    //button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid black"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.style.cursor = "pointer"
    button.addEventListener("click", getRank) //监听按钮点击事件

    let testNode = document.createElement("div")
    testNode.style.height = "100%"
    testNode.style.backgroundColor = "green"
    testNode.innerHTML = "<h1>测试标题</h1>"
    function getRank(){
        let standings = document.querySelector(".standings tbody")
        let problemNum = document.querySelector(".standings tr:nth-child(1)").children.length-4
        let rank = []
        let account = []
        let accept = []
        let accountMap = new Map()
        for(let i = 1;i<standings.children.length-1;i++){
            let row = standings.children[i]
            rank.push(parseInt(row.querySelector("td:nth-child(1)").innerText))
            account.push(row.querySelector("td:nth-child(2) a").innerText)
            accept.push(parseInt(row.querySelector("td:nth-child(3)").innerText))
        }
        let participantNum = 0
        for(let i = 0;i<rank.length;i++){
            if(typeof rank[i] === 'number' && !isNaN(rank[i])){
                participantNum++
            }else {
                break
            }
        }
        let standingDetails = new Map()
        let supplementNum = new Map()
        let supplement = []
        for(let i = 1;i <= participantNum;i++){
            let row = standings.children[i]
            accountMap.set(account[i-1],1)
            let nowSolve = 0;
            for(let j = 5;j<=4+problemNum;j++){
                let cssSelector = "td:nth-child("+j.toString()+")"
                let text =row.querySelector(cssSelector).innerText
                if(text.includes("+")){
                    nowSolve = nowSolve+(1<<(j-5))
                }
            }
            standingDetails.set(account[i-1],nowSolve)
        }
        for(let i = participantNum+1;i < standings.children.length-1;i++){
            let row = standings.children[i]
            let weight = standingDetails.get(account[i-1])
            let res = 0
            if(weight==undefined){
                weight = 0
            }
            for(let j = 5;j<=4+problemNum;j++){
                let cssSelector = "td:nth-child("+j.toString()+")"
                let text =row.querySelector(cssSelector).innerText
                if(text.includes("+")&&((weight&(1<<(j-5)))==0)){
                    res++
                }
            }

            supplementNum.set(account[i-1],res)
        }
        for(let i = 0;i<participantNum;i++){
            let num = supplementNum.get(account[i])
            if(num==undefined){
                supplement.push(0)
            }else{
                supplement.push(num)
            }
        }

        let msg = "本次获取结果：\n"
        let res = []
        for(let i = 0;i<participantNum;i++){
            let addMsg = account[i]+"\t：排名 "+rank[i].toString()+ "\t过题数 "+accept[i]+ "\t补题数 " +supplement[i]
            msg = msg+addMsg+"\n"
            let el = {
                account: account[i],
                rank: rank[i],
                accept: accept[i],
                supplement: supplement[i]
            }
            res.push(el)
        }
        let cnt = participantNum+1
        for(let i = participantNum;i<account.length;i++){
            if(accountMap.get(account[i])==undefined){
                let addMsg = account[i]+"\t：排名 "+cnt+ "\t过题数 "+0+ "\t补题数 " +accept[i]
                msg = msg+addMsg+"\n"
                let el = {
                    account:account[i],
                    rank:cnt,
                    accept:0,
                    supplement:accept[i]
                }
                res.push(el)
                cnt++;
            }
        }
        console.log(res)
        msg = msg + "请输入本次训练id\n 如果不清楚id，可以在管理系统查询"
        let id = prompt(msg)
        if(id!=null&&id!=""){
            let url = prompt("请输入数据目标地址")
            let req = {
                id: id,
                platform: "codeforces",
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
    var like_comment = document.querySelector('.datatable div:nth-child(5)'); //getElementsByClassName 返回的是数组，所以要用[] 下标
    like_comment.appendChild(button); //把按钮加入到 x 的子节点中


})();