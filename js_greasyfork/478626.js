// ==UserScript==
// @name         pixiv历史记录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  p站历史记录白色部分改为跳转链接
// @author       2222234
// @match        https://www.pixiv.net/history.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license      114514
// @downloadURL https://update.greasyfork.org/scripts/478626/pixiv%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478626/pixiv%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    function waitElement(callback) {
        var s = document.getElementsByClassName("_history-items")[0];
        if (s.children.length != 0) {
            callback(s);
        } else {
            setTimeout(() => {
                waitElement(callback);
            }, 100);
        }
    }

    waitElement((s) => {
        var length = s.children.length;
        for(var i = 0;i < length ;i++){
            if(s.children[i].nodeName != "SPAN"){
                continue;
            }
            var a = document.createElement('a');
            var url = getComputedStyle(s.children[i], null)['background-image'];
            var param1 = url.split('/')[13];
            var param2 = param1.split('_')[0];
            a.setAttribute('href', '/artworks/'+param2);
            a.setAttribute('target', '_blank');
            a.setAttribute('class', '_history-item show-detail list-item');
            a.setAttribute('rel','noreferrer');
            a.setAttribute('style', 'background-image:'+url);
            var d = document.createElement('div');
            a.appendChild(d);
            d.setAttribute('class', 'status');
            s.replaceChild(a,s.children[i]);
        }
    });
})();