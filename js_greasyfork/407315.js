// ==UserScript==
// @name         自动补全磁力链接前缀与百度盘前缀
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  在你复制神秘代码时自动补全
// @author       cvisoa
// @include      *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407315/%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%89%8D%E7%BC%80%E4%B8%8E%E7%99%BE%E5%BA%A6%E7%9B%98%E5%89%8D%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/407315/%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%89%8D%E7%BC%80%E4%B8%8E%E7%99%BE%E5%BA%A6%E7%9B%98%E5%89%8D%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener('copy', function(e) {
    	var selectedText = window.getSelection().toString().trim();
        var find=false;
        var res;
        var regPanType1 = /^[0-9a-zA-Z]{8}$|^[0-9a-zA-Z-_]{23}$/;
        var regPanType2 = /^\/s\/[0-9a-zA-Z]{8}$|^\/s\/[0-9a-zA-Z-_]{23}$/;
        var regMagnet = /^[0-9a-zA-Z]{40}$/;
        if(regMagnet.test(selectedText)){res = 'magnet:?xt=urn:btih:' + selectedText;find=true;}
        if(regPanType1.test(selectedText)){res = 'https://pan.baidu.com/s/' + selectedText;find=true;}
        if(regPanType2.test(selectedText)){res = 'https://pan.baidu.com' + selectedText;find=true;}
        if(find){
            e.clipboardData.setData('text/plain', res);
    		e.preventDefault();
    		return;
        }
    });
})();