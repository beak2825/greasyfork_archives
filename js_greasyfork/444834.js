// ==UserScript==
// @name         txkt-automation
// @namespace    http://meethigher.top/blog/2020/txkt-automation/
// @version      12.5
// @description  有小伙伴提到这个功能，正好我自己也会用到，就整了。用于腾讯课堂的自动签到
// @author       Kit Chen
// @match        https://ke.qq.com/webcourse/index.html
// @grant        none
// @提示          如果使用过程中出现问题，清除一下cookie就行，不用清除浏览器的所有数据，清除cookie就行
// @license zhengtongxue
// @downloadURL https://update.greasyfork.org/scripts/444834/txkt-automation.user.js
// @updateURL https://update.greasyfork.org/scripts/444834/txkt-automation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function autoAttend() {
        let btns;
        let attend = setInterval(function() {
            btns = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
            if (btns.length > 0) {
                console.log(new Date().toLocaleTimeString() + "--完成-->" + btns[0].innerText);
                btns[0].click();
            }
        }, 10000);
    }
    function showBtn() {
        let $switch = document.createElement("span");
        let $body = document.querySelector(".web");
        let show = true;
        $switch.innerText = "显示/隐藏";
        $switch.style = "position:absolute;top:21px;right:520px;color:#AAAAAA;border-radius:10px;cursor:pointer;z-index:3000";
        $switch.onclick = function() {
            if (show) {
                document.querySelector(".study-body.mr").style = "right:0;z-index:999";
                show = false;
            } else {
                document.querySelector(".study-body.mr").style = "right:300px;z-index:0";
                show = true;
            }
        }
        $body.appendChild($switch);
    }
    function clearRefresh() {
        window.localStorage.removeItem("refresh");
    }
    function autoRefresh() {
        window.localStorage.setItem("refresh", "no");
        let response = prompt("请输入上课时间的前2分钟，并点击确定按钮开始执行自动刷新！", "13:28");
        if (response !== null) {
            let arr = response.trim().split(":");
            let date;
            let timid = setInterval(function() {
                date = new Date();
                if (date.getHours() == parseInt(arr[0]) && date.getMinutes() == parseInt(arr[1])) {
                    window.location.reload();
                }
            }, 1000);
        } else {
            clearRefresh();
        }
    }
    function isRefresh() {
        let isRefresh = window.localStorage.getItem("refresh") || "yes";
        console.log(isRefresh);
        if (isRefresh == "yes") {
            autoRefresh();
        } else {
            clearRefresh();
        }
    }
    isRefresh();
    autoAttend();
    showBtn();
})();
