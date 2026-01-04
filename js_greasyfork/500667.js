// ==UserScript==
// @name         BCM Safe
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  编程猫安全防护
// @author       VarTheta
// @match        https://shequ.codemao.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500667/BCM%20Safe.user.js
// @updateURL https://update.greasyfork.org/scripts/500667/BCM%20Safe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list = ['https://codemao123.pythonanywhere.com/'];
    // XML
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            var judge = false;
            for (let i = 0; i < list.length; i++){
                if(url.startsWith(list[i])){
                    judge = true;
                }
            }
            if(judge){
                alert('您的Token已经泄漏，请重新登录刷新token!');
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    // Fetch
    (function(fetch) {
        window.fetch = function(url, options) {
            var judge = true;
            for (let i = 0; i < list.length; i++){
                if(url.startsWith(list[i]) == false){
                    judge = false;
                }
            }
            if(judge){
                alert('您的Token已经泄漏，请重新登录刷新token!');
            }
            return fetch.apply(this, arguments);
        };
    })(window.fetch);

    function removeIframesAndEmbeds() {
        var iframes = Array.from(document.getElementsByTagName('iframe'));
        var embeds = Array.from(document.getElementsByTagName('embed'));
        var allFrames = iframes.concat(embeds);
        for(var a=0;a<allFrames.length;a++){
            if(allFrames[a].id !== 'react-tinymce-0_ifr' && allFrames[a].src.startsWith("https://player.codemao.cn/new/") == false){
                allFrames[a].remove();
                console.log('Delete');
            }
        }
     }

    setInterval(removeIframesAndEmbeds, 300);
})();