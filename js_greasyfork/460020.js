// ==UserScript==
// @name         bilibili视频显示时间
// @namespace    tonyu_balabala_03e6ea
// @version      0.3
// @description  bilibili视频窗口显示当前时间
// @author       Tony
// @icon          data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0iemh1emhhbi1pY29uIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNzMyNTIgMi42NzA5NEMzLjMzMjI5IDIuMjg0ODQgMy4zMzIyOSAxLjY0MzczIDMuNzMyNTIgMS4yNTc2NEM0LjExMjkxIDAuODkwNjg0IDQuNzE1NTIgMC44OTA2ODQgNS4wOTU5MSAxLjI1NzY0TDcuMjE3MjMgMy4zMDQwM0M3LjI3NzQ5IDMuMzYyMTggNy4zMjg2OSAzLjQyNjEgNy4zNzA4MSAzLjQ5NDA3SDEwLjU3ODlDMTAuNjIxMSAzLjQyNjEgMTAuNjcyMyAzLjM2MjE4IDEwLjczMjUgMy4zMDQwM0wxMi44NTM4IDEuMjU3NjRDMTMuMjM0MiAwLjg5MDY4NCAxMy44MzY4IDAuODkwNjg0IDE0LjIxNzIgMS4yNTc2NEMxNC42MTc1IDEuNjQzNzMgMTQuNjE3NSAyLjI4NDg0IDE0LjIxNzIgMi42NzA5NEwxMy4zNjQgMy40OTQwN0gxNEMxNi4yMDkxIDMuNDk0MDcgMTggNS4yODQ5MyAxOCA3LjQ5NDA3VjEyLjk5OTZDMTggMTUuMjA4NyAxNi4yMDkxIDE2Ljk5OTYgMTQgMTYuOTk5Nkg0QzEuNzkwODYgMTYuOTk5NiAwIDE1LjIwODcgMCAxMi45OTk2VjcuNDk0MDZDMCA1LjI4NDkyIDEuNzkwODYgMy40OTQwNyA0IDMuNDk0MDdINC41ODU3OUwzLjczMjUyIDIuNjcwOTRaTTQgNS40MjM0M0MyLjg5NTQzIDUuNDIzNDMgMiA2LjMxODg2IDIgNy40MjM0M1YxMy4wNzAyQzIgMTQuMTc0OCAyLjg5NTQzIDE1LjA3MDIgNCAxNS4wNzAySDE0QzE1LjEwNDYgMTUuMDcwMiAxNiAxNC4xNzQ4IDE2IDEzLjA3MDJWNy40MjM0M0MxNiA2LjMxODg2IDE1LjEwNDYgNS40MjM0MyAxNCA1LjQyMzQzSDRaTTUgOS4zMTc0N0M1IDguNzY1MTkgNS40NDc3MiA4LjMxNzQ3IDYgOC4zMTc0N0M2LjU1MjI4IDguMzE3NDcgNyA4Ljc2NTE5IDcgOS4zMTc0N1YxMC4yMTE1QzcgMTAuNzYzOCA2LjU1MjI4IDExLjIxMTUgNiAxMS4yMTE1QzUuNDQ3NzIgMTEuMjExNSA1IDEwLjc2MzggNSAxMC4yMTE1VjkuMzE3NDdaTTEyIDguMzE3NDdDMTEuNDQ3NyA4LjMxNzQ3IDExIDguNzY1MTkgMTEgOS4zMTc0N1YxMC4yMTE1QzExIDEwLjc2MzggMTEuNDQ3NyAxMS4yMTE1IDEyIDExLjIxMTVDMTIuNTUyMyAxMS4yMTE1IDEzIDEwLjc2MzggMTMgMTAuMjExNVY5LjMxNzQ3QzEzIDguNzY1MTkgMTIuNTUyMyA4LjMxNzQ3IDEyIDguMzE3NDdaIiBmaWxsPSIjMDBhZWVjIj48L3BhdGg+PC9zdmc+
// @license       MIT
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460020/bilibili%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/460020/bilibili%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timeBox
    let bpxPlayerTopWraps = document.getElementsByClassName("bpx-player-top-wrap")
    let bpxPlayerTopIssues = document.getElementsByClassName("bpx-player-top-issue")
    let count = 0
    let pageTBox = document.getElementsByClassName('tony-time-box-03e6ea')
    function initial() {
        if(pageTBox.length===0 && bpxPlayerTopWraps.length>0 && bpxPlayerTopIssues.length>0) {
            timeBox = document.createElement('div')
            timeBox.className = 'tony-time-box-03e6ea'
            timeBox.setAttribute('style','font-size:18px;line-height:18px;height:18px;background-color:rgba(0,0,0,0.3);color:white;border-radius:6px;padding:4px 6px;margin:18px 2px 0;')
            let bpxPlayerTopWrap = bpxPlayerTopWraps[0]
            let bpxPlayerTopIssue = bpxPlayerTopIssues[0]
            bpxPlayerTopWrap.insertBefore(timeBox,bpxPlayerTopIssue)
            getCurTime()
            //setInterval(getCurTime,1000) 改为此方法时应将getCurTime方法中的定时任务删除
        }
        count++
        if(count<=20 && pageTBox.length === 0) setTimeout(initial,1000)
    }
    initial()

    function getCurTime(){
        let today = new Date()
        let hh = today.getHours()
        let mm = today.getMinutes()
        let ss = today.getSeconds()
        hh = complementZero(hh)
        mm = complementZero(mm)
        //ss = complementZero(ss)
        timeBox.innerText = hh+':'+mm
        setTimeout(getCurTime,60010-ss*1000)
    }

    function complementZero(t) {
        if(t<10) return '0'+t
        return t
    }

})();