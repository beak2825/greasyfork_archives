// ==UserScript==
// @name         上海交大网课快进快退快捷键
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  交大网课快进快退快捷键用方向键以及空格键控制
// @author       pulse456
// @match        https://vshare.sjtu.edu.cn/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sjtu.edu.cn
// @grant        none
// @run-at       document-end
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/453490/%E4%B8%8A%E6%B5%B7%E4%BA%A4%E5%A4%A7%E7%BD%91%E8%AF%BE%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/453490/%E4%B8%8A%E6%B5%B7%E4%BA%A4%E5%A4%A7%E7%BD%91%E8%AF%BE%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){document.querySelector("#video-share_html5_api").playbackRate=2;
                         document.querySelector("#video-share_html5_api").volumne=1;}, 1000);
    document.onkeydown = function (event) {
        var e = event || window.event ;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        if (e && e.keyCode == 32) {
          // 按 Space
          //要做的事情
            if(document.querySelector("#video-share > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused"))
            {document.querySelector("#video-share > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused").click();}
                else
                {document.querySelector("#video-share > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-playing").click();}
        }
        if (e && e.keyCode == 37) {
          // 按 left
          //要做的事情
          document.querySelector("#video-share > div.vjs-control-bar > button.vjs-seek-button.skip-back.skip-5.vjs-control.vjs-button").click()
        }
        if (e && e.keyCode == 39) {
          // enter 键
          //要做的事情
          document.querySelector("#video-share > div.vjs-control-bar > button.vjs-seek-button.skip-forward.skip-5.vjs-control.vjs-button").click()
        }
      };
})();