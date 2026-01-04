// ==UserScript==
// @name         Kavita增强
// @name:zh-CN   Kavita增强
// @name:zh-TW   Kavita增强
// @name:en      Kavita enhancement
// @version      0.9
// @author       ethan
// @description  更改Kavita用户设置
// @description:zh-tw  更改Kavita用户设置
// @description:en modify the reader settings of Kavita
// @match        *://127.0.0.1:5000/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-idle
// @namespace https://greasyfork.org/users/829453
// @downloadURL https://update.greasyfork.org/scripts/477059/Kavita%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477059/Kavita%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

'use strict';

(function() {
    setTimeout(function(){
        const select = document.getElementById('library-type');
        select.options[3].selected = true;
        select.dispatchEvent(new Event('change'));
        const rangeInput = document.querySelector("#fontsize");
        rangeInput.value = 200;
        rangeInput.dispatchEvent(new Event('change'));
        const button = document.querySelector("#ngb-accordion-item-2-collapse > div > div > button:nth-child(4)");
        button.click();
    }, 3000);
})();
