// ==UserScript==
// @name         dilidili flash to html5 fix
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  把dilidili的Flash播放器替换为HTML5播放器
// @author       niphor
// @match        http*://*.dilidili.com/watch*
// @match        http*://*.dilidili.wang/watch*
// @match        http*://*.dilidili.name/watch*
// @run-at       document-body
// @grant        none
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/378188/dilidili%20flash%20to%20html5%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/378188/dilidili%20flash%20to%20html5%20fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*(function(){
        const scripts = document.body.getElementsByTagName("script");
        for (var i=0;i<scripts.length;i++) {
            if (!scripts[i].src && scripts[i].innerHTML.indexOf('xiajiafanju.html')){
                document.body.removeChild(scripts[i]);
                break;
            }
        }
    })();*/
    // hijack jQuery.ready
    (function($){
        const _ready = $.fn.ready;
        const homeStr = 'home.html';
        $.fn.ready = function(fn){
            const fnStr = fn.toString();
            // 下架提示
            if(fnStr.indexOf('xiajiafanju')>=0){
                return
            }
            // 豆瓣跳转
            if(fnStr.indexOf('douban.com')>=0){
                // 跳转实际播放页
                if(fnStr.indexOf(homeStr)&&location.href.slice(-9) !== 'home.html'){
                    location.href = location.href + homeStr;
                }
                return
            }
            _ready.apply(this,Array.prototype.slice.call( arguments));
        }
    })(window.jQuery);

    function loadScriptOrCSS(src, callback){
        const isStyle = src.slice(-4) ==='.css';
        let dom = document.createElement(isStyle?'link':"script");
        if(isStyle){
            dom.rel = "stylesheet";
            dom.href = src;
        } else {
            dom.src = src;
        }
        if(callback){
            dom.onload = callback
        }
        document.head.appendChild(dom);
        return dom;
    }

    // 引用类库
    // 引用类库
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js');
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.25.0/DPlayer.min.css');
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.25.0/DPlayer.min.js');

    // 避免播放器太大
    GM_addStyle('body{display:block!important;} .dplayer {max-width:100%;height:100%;}');

    // 页面加载完毕后运行播放器
    document.addEventListener("DOMContentLoaded", function(){

        // 找到原播放器
        let playerWrap = document.getElementsByClassName("player_main")[0];
        let videoSrc;

        if(!playerWrap){
            return
        }

        videoSrc = playerWrap.children[0].src.split("=")[1];

        // 不是m3u8的就不改
        if (videoSrc.slice(-4) != "m3u8") {
            return
        }

        // 新的video
        let player = document.createElement("div");
        player.setAttribute("id", "dplayer");

        // 替换播放器
        while (playerWrap.firstChild) {
            playerWrap.removeChild(playerWrap.firstChild);
        }
        playerWrap.appendChild(player);

        new window.DPlayer({
            container: document.getElementById('dplayer'),
            autoplay: true,
            video: {
                url: videoSrc,
                type:'hls'
            }
        });
    });
})();
