// ==UserScript==
// @name         steam探索队列
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://store.steampowered.com/app/*
// @match        http://store.steampowered.com/explore/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31100/steam%E6%8E%A2%E7%B4%A2%E9%98%9F%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/31100/steam%E6%8E%A2%E7%B4%A2%E9%98%9F%E5%88%97.meta.js
// ==/UserScript==

(function() {
    var Count = 0;
    var NextGameDelay = 1500;  //下一个游戏的延迟
    
    setInterval(function(){
        if(++Count >= 3){
            Count = 0;
            var StartBtn = document.getElementsByClassName("btn_green_white_innerfade btn_medium");
            if(StartBtn[0]){
                StartBtn[0].click();
            }
        }
    }, 1000);
    
    var NewQueue = document.getElementById("refresh_queue_btn");
    if(NewQueue){
        var SubText = document.getElementsByClassName("subtext");
        if(SubText[0]){
            for(var i = 0; SubText[i]; i++){
                var StrMatch = SubText[i].innerHTML.match("明日再来");
                if(!StrMatch){
                    ShowConfirmDialog('提示', '是否开始进行探索队列(3秒后自动确认)！', '是', '否').done(function StartNewQueue() {NewQueue.click();});
                }
                else{
                    alert("今日探索队列已无卡牌掉落！");
                }
            }
            
        }
    }
    
    GoToNextGame(NextGameDelay);
    
    function GoToNextGame (Delay)
    {
        window.setTimeout(function() { 
            var NextGame = document.getElementsByClassName("btn_next_in_queue btn_next_in_queue_trigger");
            if(NextGame[0]){
                NextGame[0].click();
            }},
            Delay);
    }
})();