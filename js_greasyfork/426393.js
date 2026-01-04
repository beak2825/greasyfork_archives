// ==UserScript==
// @name         liangliang
// @namespace    http://www.csgxcf.com/
// @version      1.0.1
// @description  liangliangjiayou.
// @author       nkg
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @match        https://*.magicmirror.sankuai.com/*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/426393/liangliang.user.js
// @updateURL https://update.greasyfork.org/scripts/426393/liangliang.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth()
    if(year != 2021 || month > 5){
        alert("The wrong version")
    }else{
        setInterval(() => {
            let idArr =  document.getElementsByName("compPoiId");
            for (let i = 0; i < idArr.length; i++) {
                if (idArr[i]!="" && document.activeElement==idArr[i]){
                    $(idArr[i]).keydown(function(event){
                        if(event.keyCode == 13){
                            window.open("https://hotels.ctrip.com/hotels/"+idArr[i].value+".html#ctm_ref=www_hp_bs_lst");
                        }
                    });
                }

            }
        }, 300);
    }
})();