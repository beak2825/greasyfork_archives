// ==UserScript==
// @name         百度翻译
// @namespace    http://tampermonkey.net/
// @version      5.2.1
// @description  小庄的脚本园
// @author       zjazn
// @match        *://*.fanyi.baidu.com/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @run-at       document-start
// @match        <$URL$>
// @downloadURL https://update.greasyfork.org/scripts/428622/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/428622/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    //用于等待资源传输完成
    setTimeout(function(){
        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        function start() {
            if(document.querySelector('.operate-btn')) {
                document.querySelector('.operate-btn')?document.querySelector('.operate-btn').click():''
                var timing = setTimeout(function(){
                    console.log("字符长度：",document.getElementById("baidu_translate_input").value.length);
                    sleep(500).then(() => {
                        // 这里写sleep之后需要去做的事情
                        start();
                    })
                },document.getElementById("baidu_translate_input").value.length*300 )
            }
        }
        start();

    },500)




})();