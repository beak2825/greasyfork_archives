// ==UserScript==
// @name        Bilibili跳过充电只连播分P
// @namespace   https://store.steampowered.com/curator/42409748
// @author      GOKURAKU
// @description Bilibili跳过充电自动连播:只会连播分P,不会连播跳转推荐视频.
// @include     https://www.bilibili.com/video/*
// @version     1.0
// @icon        https://i0.hdslb.com/bfs/emote/f85c354995bd99e28fc76c869bfe42ba6438eff4.png
// @connect     hdslb.com
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447840/Bilibili%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E5%8F%AA%E8%BF%9E%E6%92%AD%E5%88%86P.user.js
// @updateURL https://update.greasyfork.org/scripts/447840/Bilibili%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E5%8F%AA%E8%BF%9E%E6%92%AD%E5%88%86P.meta.js
// ==/UserScript==

(function () {
    var jumpButton = '.bilibili-player-electric-panel-jump';
    console.log(`[${GM_info.script.name}]: 开始`);
    setInterval(() => {
        if($(jumpButton).length > 0) {
            $(jumpButton).trigger('click')
        }
    }, 200)
})();

function addScript(text) {
    var pattern = ",i.prototype.canPlayerRecommend=function(){";
    text = text.replace(pattern, pattern + "return null;");
    var newScript = document.createElement('script');
    newScript.type = "text/javascript";
    newScript.textContent = text;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(newScript);
    console.log("Bilibili跳过充电只连播分P：hooked JS");
}

(function() {
    var oldAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(...args) {
        // console.log("appendChild: ", args);
        if (args[0].src != undefined && args[0].src.search(/jsc-player\.[a-z0-9]+\.js/) != -1) {
            // found file to hook
            Node.prototype.appendChild = oldAppendChild;
            var src = args[0].src;
            // console.log("hooking...", src);
            GM_xmlhttpRequest({
                method: "GET",
                url: src,
                onload: function(response) {
                    addScript(response.responseText);
                }
            });
        } else {
            return oldAppendChild.apply(this, args);
        }
    }
})();
