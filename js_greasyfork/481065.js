// ==UserScript==
// @name         镇江网课助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解放双手
// @author       You
// @match       *://*.zjrspc.zjhrca.cn:58000/*
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481065/%E9%95%87%E6%B1%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481065/%E9%95%87%E6%B1%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    /**
 * 休眠
 * @param time    休眠时间，单位秒
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsSleep(time, desc = 'obsSleep') {
        return new Promise(resolve => {
            //sleep
            setTimeout(() => {
                console.log(desc, time, 's')
                resolve(time)
                document.querySelector("#app > div > div.layout-content > div > div > div.video-box > div.video-player > div.action").click();
            }, Math.floor(Math.abs(time) * 1000))
        });

    }
    function myrefresh()
    {
        window.location.reload();
    }

    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="font-size: 1.5rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 30%;left: 50%;width: 200px;text-align: center;";
        document.body.appendChild(m);
        setTimeout(function() {
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, duration);
        }, duration);
    }
    (function () {
        //指定5-20秒刷新一次
        var STARTNUMBER = 240;
        var ENDNUMBER = 280;
        let time = (Math.floor(Math.random()*(STARTNUMBER-ENDNUMBER+1))+ENDNUMBER)*1000;
        setTimeout(function() {
            setTimeout(window.location.reload(),time);
        }, time);
        obsSleep(3);
        Toast('已开启自动刷新脚本！（240-280秒）',5000);
    })();
})();