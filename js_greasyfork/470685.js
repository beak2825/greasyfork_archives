// ==UserScript==
// @name         人才呀刷课
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  该脚本可完成人才呀视频刷课，只针对人才啊有用，打开人才呀平台再启动脚本
// @icon         http://103.8.33.231/favicon.ico
// @author       chenyi
// @match        *://rencaiya.vip/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/470685/%E4%BA%BA%E6%89%8D%E5%91%80%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470685/%E4%BA%BA%E6%89%8D%E5%91%80%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    $().ready(function () {
        alert("人才呀脚本已启用")
        setInterval(function () {
            let video = window.document.querySelector('video');
            let divAll = window.document.querySelectorAll('.ant-drawer-body>div>div>div>span>div>div');
            let totalTime = video.duration;
            let currentTime = video.currentTime;
            let cancelBtn =document.querySelector('.ant-btn');
            if(cancelBtn!=null){
                cancelBtn.click();
                currentTime=totalTime;
            }

            if (currentTime >= totalTime - 1) {
                video.currentTime = 0
                for (let index = 0; index < divAll.length; index++) {
                    if (divAll[index].children[1].children[0].attributes[1].value === 'periodI') {
                        divAll[index + 1].children[1].children[0].click();
                        break
                    }
                }
            }
        }, 3000);
    })
})();