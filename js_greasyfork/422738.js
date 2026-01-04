// ==UserScript==
// @name         我們的浮游城 ㄊㄓ
// @namespace    https://itiscaleb.com/
// @version      1.2
// @description  當動作完成時給你一個ㄊㄓ
// @author       ItisCaleb
// @match        https://ourfloatingcastle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422738/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E3%84%8A%E3%84%93.user.js
// @updateURL https://update.greasyfork.org/scripts/422738/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E3%84%8A%E3%84%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timeComplete
    var completed = true
    var token = window.localStorage.getItem('token2')
    function calTime(){
        fetch("https://api.ourfloatingcastle.com/api/profile", {
            "headers": {
                "token": token
            },
            "referrer": "https://ourfloatingcastle.com/",
            "body": null,
            "method": "GET",
        })
        .then(res=>res.json())
        .then(data=>{
            timeComplete = data.actionUntil
            completed=false
        });
    }
    function checkDone(){
        var done = document.getElementsByClassName("css-1nwj029")[0].innerText
        if(done=='閒置' || done.includes('完成') || done.includes('抵達') || done=='已死亡'){
            return
        }
        else if(completed) {
            calTime()
        }
    }
    function init(){
        if (Notification.permission === 'default' || Notification.permission === 'undefined') {
            Notification.requestPermission();
        }
        if (Notification.permission === 'denied'){
            console.log("請開啟通知才能作用")
            return
        }
        checkDone()
    }
    setTimeout(init,2000)
    setInterval(()=>{
        checkDone()
        if(!timeComplete || completed) return
        let timeLeft = timeComplete-Date.now()
        console.log(timeComplete)
        if(timeLeft<=0){
           new Notification('你的浮游城已經完成動作!')
           completed = true
        }
    },2000)
})();