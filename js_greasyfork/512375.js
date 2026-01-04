// ==UserScript==
// @name         New YuDao
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  YuDao New Hook
// @author       kkwafz
// @match        https://doc.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iocoder.cn
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512375/New%20YuDao.user.js
// @updateURL https://update.greasyfork.org/scripts/512375/New%20YuDao.meta.js
// ==/UserScript==

(function() {
    function hookJquery(){
        if("$" in window){
            let o_html = window.$.fn.html;
            window.$.fn.html = function(text){
                if(text.includes("仅 VIP 可见！")){
                    return this;
                }
                return o_html(text);
            }
        }else{
            setTimeout(hookJquery, 100);
        }
    }

    function hookJqueryAlert(){
        if('jqueryAlert' in window){
            window.jqueryAlert = function(opts) {
                return {
                    show: () => true,
                };
            }
        }else{
            setTimeout(hookJqueryAlert, 100);
        }
    }
    hookJquery();
    hookJqueryAlert();
})();