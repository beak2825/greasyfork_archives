// ==UserScript==
// @name         SNH48公演直播（live48）HTML5播放器
// @namespace    live48_html5_player
// @version      0.2
// @description  把live48的Flash播放器替换为HTML5播放器（dplayer ver 1.25）
// @author       SUZEMEF
// @match        https://live.48.cn/*
// @run-at       document-body
// @grant        none
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/382316/SNH48%E5%85%AC%E6%BC%94%E7%9B%B4%E6%92%AD%EF%BC%88live48%EF%BC%89HTML5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/382316/SNH48%E5%85%AC%E6%BC%94%E7%9B%B4%E6%92%AD%EF%BC%88live48%EF%BC%89HTML5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {

    function loadScriptOrCSS(src, callback){
        const isStyle = src.slice(-4) ==='.css';
        let dom = document.createElement(isStyle?'link':"script");
        if(isStyle){
            dom.rel = "stylesheet";
            dom.href = src;
        } else {
            dom.src = src;
            dom.async = true;
        }
        if(callback){
            dom.onload = callback
        }
        document.body.appendChild(dom);
        return dom;
    }

    // 引用类库
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js');
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.25.0/DPlayer.min.css');
    loadScriptOrCSS('https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.25.0/DPlayer.min.js');
        
	// 样式	
    GM_addStyle('body{display:block!important;} .dplayer {max-width:100%;height:100%;}');

    // 页面加载完毕后运行播放器
    window.onload= function(){

        // 找到原播放器
        let playerWrap = document.getElementsByClassName("videoplay")[0];
        let videoSrc;

        if(!playerWrap){
            return
        }

        // 默认高清
        videoSrc = document.getElementById("gao_url").value;
        var index = videoSrc.indexOf('p');
        
		// 需要https
		function insertStr(soure, start, newStr){
            return soure.slice(0, start) + newStr + soure.slice(start);
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
    };
})();