// ==UserScript==
// @name         B站视频页 - UP主名字标签样式
// @namespace    mscststs
// @version      1.1
// @license      ISC
// @description  修改新版视频页的UP主名字标签样式
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499186/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%20-%20UP%E4%B8%BB%E5%90%8D%E5%AD%97%E6%A0%87%E7%AD%BE%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499186/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%20-%20UP%E4%B8%BB%E5%90%8D%E5%AD%97%E6%A0%87%E7%AD%BE%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(StartUpName());
    setTimeout(StartUpcardName());

    async function StartUpName(){
        await mscststs.wait(".up-info-container .up-detail-top .up-name")
        var upName = document.querySelector(".up-info-container .up-detail-top .up-name");
        var control = 0;

        function setUpName() {
            //alert(upName.style.color);
            //console.log("UP主名字标签样式：" + upName.style.color);
            if(upName.style.color == "" && control == 0) {
                //upName.style.color = "#565a60"; //#61666d
                control = 1;
                const style = document.createElement('style');
                style.innerHTML = `
                    .up-detail .up-detail-top .up-name {
                        color: #565a60 !important;
                    }
                    .up-detail .up-detail-top .up-name:hover {
                        color: #00AEEC !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        var upAvatar = document.querySelector(".up-info-container .up-avatar-wrap .up-avatar");
        MouseoverUpUserName(upName, upAvatar);

        var options = { 'childList': true, 'subtree':true };
        const callback = function(mutationsList, observer) {
            setUpName();
        };
        const observer = new MutationObserver(callback);
        var article = document.querySelector("body");
        observer.observe(article, options);
        setUpName();
    }

    async function StartUpcardName(){
        await mscststs.wait(".membersinfo-upcard .staff-info .staff-name")
        var upcardNames = document.querySelectorAll(".membersinfo-upcard .staff-info .staff-name");
        var upcardAvatars = document.querySelectorAll(".membersinfo-upcard .avatar");
        for(var i = 0; i < upcardNames.length; i++) {
            MouseoverUpUserName(upcardNames[i], upcardAvatars[i]);
        }
    }

    function MouseoverUpUserName(upName, upAvatar) {
        upName.addEventListener('mouseover',function() {
            upUserNameCSS();
        });
        upAvatar.addEventListener('mouseover',function() {
            upUserNameCSS();
        });

        async function upUserNameCSS() {
            /*await mscststs.wait(".usercard-wrap .user-card-m-exp")//.user-card-m-exp
            var userCard = document.querySelector(".usercard-wrap .user-card-m-exp");
            userCard.style.width = "366px";*/

            await mscststs.wait(".usercard-wrap .user-info-wrapper .info .user .name")
            var userName = document.querySelector(".usercard-wrap .user-info-wrapper .info .user .name");
            userName.style.fontFamily = "-apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif";
            userName.style.fontWeight = "bold";
            userName.style.maxWidth = "160px";
            /*var computedStyle = document.defaultView.getComputedStyle(userName, null);
            //alert(computedStyle.maxWidth);
            var size = computedStyle.maxWidth.replaceAll(/[a-zA-Z]/g, "");
            userName.style.maxWidth = size + 4 + "px";*/
        }
    }
})();