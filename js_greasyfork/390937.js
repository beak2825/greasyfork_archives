// ==UserScript==
// @name         默认关闭哔哩哔哩弹幕
// @namespace    https://greasyfork.org/zh-CN/users/4330
// @version      2.0
// @description  关闭哔哩哔哩弹幕，默认开启字幕太烦了
// @author       x2009again
// @match        http*://www.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/390937/%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/390937/%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var autochangurl=0;
    var maxcount=30;
    function closedanmuku(count)
    {
        window.timer = setInterval(function() {
            var divfordanmakuswitch=document.querySelector(".bilibili-player-video-danmaku-switch");
            if(divfordanmakuswitch!=null)
            {
                var inputdanmaku= divfordanmakuswitch.firstChild;
                if (inputdanmaku!=null&&inputdanmaku.click!=null){
                    if(autochangurl==1)
                    {
                        autochangurl=0;
                        clearInterval(window.timer);
                    }
                    else
                    {
                        inputdanmaku.click();
                        clearInterval(window.timer);
                    }
                }
                else if(count<maxcount)
                {
                    count++;
                }
                else
                {
                    clearInterval(window.timer);
                }
            }
            else if(count<maxcount)
            {
                count++;
            }
            else
            {
                clearInterval(window.timer);
            }
        }, 100);
    }
    closedanmuku(0,0);
    var _wr = function(type) {
        var orig = history[type];
        return function() {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            if(e.explicitOriginalTarget==null)
            {
                autochangurl=1;
            }
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    window.addEventListener('replaceState', function(e) {
        window.timer&&clearInterval(window.timer);
        closedanmuku(0);
    });
    window.addEventListener('pushState', function(e) {
        window.timer&&clearInterval(window.timer);
        closedanmuku(0);
    });
})();