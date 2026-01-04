// ==UserScript==
// @name         iCodeReviewHelperAuto
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  try to take over the world!
// @author       You
// @match        https://console.cloud.baidu-int.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387857/iCodeReviewHelperAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/387857/iCodeReviewHelperAuto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 支持从hi直接跳进来唤起
    if(!location.href.includes('/reviews/')&&!location.href.includes('/myreview/')) return;
    let timer;
    const btnNode = document.createElement ('div');
    btnNode.id="btns";

    btnNode.innerHTML=`
<style>
#btns{
position:fixed;
display:flex;
z-index:999;
top:10px;
left:50%;
transform:translateX(-50%);
}
button{
display:block;height:30px;
color:black;
width:110px;
border:none;
outline:none;
}
#p2{
background: #c0dc91;
}
#p1{
background: #eaffee;

}
#r1{
background: #fdeff0;

}
#r2{
background: #f39ea2;
}
</style>
<button id="r2" >-2（有错误）</button>
<button id="r1" >-1（可读性差）</button>
<button id="p1" >+1（可以更好）</button>
<button id="p2" >+2（完美）</button>
`



    // const goodBtnEl = document.querySelector('[ant-click-animating-without-extra-node]');
      const getRandomWord = (dict)=>dict[Math.floor(Math.random()*(dict.length))];
    const PREFIX = ["这个提交","你的代码"];

    const PART1 = {
        r2:["存在错误"],
        r1:["可读性不佳"],
        p1: ["基本OK"],
        p2:["完美的解决了这个问题", "思路清晰，算法精妙", "让我很有启发", "质量很高"]
    }



    const CONNECTION = ["，请"];

    const PART2 = {
        r2:["修复后再提交"],
        r1:["改进一下可读性"],
        p1: ["其他同学再看一看吧"],
        p2:["继续加油","再接再厉"]}


    document.body.appendChild (btnNode);
    const bindEvents = ()=>{
        const btnEl = document.querySelector('#btns');
        btnEl.addEventListener('click',(e)=>{
            console.log(e.target.id);
            let buttonId = e.target.id;

            const panelEl = document.querySelector('[class*="score-score-"]');
            panelEl&&panelEl.click();
            setTimeout(()=>{
                const scoreList = document.querySelectorAll(".ant-popover-inner-content>div>div>div>span")
                if(scoreList){
                    let scoreIndex;
                    if(buttonId==="p2") {scoreIndex = 4}
                    else if(buttonId==="p1") {scoreIndex = 3}
                    else if(buttonId==="r1") {scoreIndex = 1}
                    else {scoreIndex = 0}

                    const scoreEl = scoreList[scoreIndex];
                    scoreEl&&scoreEl.click(); // +2
                    setTimeout(()=>{
                        const comBoxEl = document.querySelector('[placeholder="在此输入评论"]');
                        if(comBoxEl){
                            comBoxEl.value = getRandomWord(PREFIX)+getRandomWord(PART1[buttonId])+getRandomWord(CONNECTION)+getRandomWord(PART2[buttonId]); // 评论
                            comBoxEl.value&&timer&&clearInterval(timer); // 成功填入，取消自动点
                        }
                    },0)
                }
            },0)

        })
    }

    bindEvents();




    // 自动点击
    const auto =()=>{
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                console.log('ready!');
                timer = setInterval(()=>{
                    btnEl.click();
                },1000);
            }
        }}
    })();

