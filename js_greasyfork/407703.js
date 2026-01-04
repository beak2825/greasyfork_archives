// ==UserScript==
// @name        developer.android.com 访问
// @namespace   https://github.com/XanderWang
// @match       *://*/*
// @grant       none
// @version     1.0
// @icon        https://i.loli.net/2020/05/29/DxSmHAy2o53FdUY.png
// @author      XanderWang
// @description 2020/7/25 下午3:59:45
// @downloadURL https://update.greasyfork.org/scripts/407703/developerandroidcom%20%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/407703/developerandroidcom%20%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...

    function jumpUrl() {
        /// 获取所有 a 标签
        var documents = document.getElementsByTagName("a");
        for (var i = 0; i < documents.length; i++) {
            var _href = decodeURIComponent(documents[i].href)
            if(_href.indexOf("developer.android.com") != -1) {
                documents[i].href = _href.replace(".android.com",".android.google.cn")
                // console.log('ori', _href, 'real', documents[i].href)
            }
        }
    }
    jumpUrl();
    window.onscroll = function() { 
        setTimeout(function() { 
            jumpUrl()
        }, 500)
    }
    
})();