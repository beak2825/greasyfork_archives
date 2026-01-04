// ==UserScript==
// @name         DS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽芋道弹窗
// @author       DS
// @match        https://doc.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @icon         https://www.bing.com/th/id/OGC.1466b92464c7e6a48acbe514eb768fe3?pid=1.7&rurl=https%3a%2f%2fc-ssl.duitang.com%2fuploads%2fblog%2f202107%2f19%2f20210719183302_705f3.gif&ehk=xeth2cwIVoE63LZxWhFygZrE%2bCu84kMtz8NB%2bcYrQDU%3d
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513037/DS.user.js
// @updateURL https://update.greasyfork.org/scripts/513037/DS.meta.js
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