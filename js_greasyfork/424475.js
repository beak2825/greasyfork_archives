// ==UserScript==
// @name         hidden baidu recommend
// @namespace    http://tampermonkey.net/hidden_baidu_recommend
// @version      0.1
// @description  关闭百度左侧的推荐
// @author       宏斌
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424475/hidden%20baidu%20recommend.user.js
// @updateURL https://update.greasyfork.org/scripts/424475/hidden%20baidu%20recommend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Hello hidden baidu recommend 👏");
    const content_right = document.getElementById('content_right');
    if (content_right){
        content_right.parentNode.removeChild(content_right);
        //    content_right.innerHTML = '<h1>Hello</h1>'

        const Live = document.createElement('script');
        Live.src = "https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js";
        Live.onload = function () {
            L2Dwidget.init({
                "model": {
                    jsonPath: "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
                    "scale": 1
                },
                "display": {
                    "position": "right",
                    "width": 120,
                    "height": 240,
                    "hOffset": 0,
                    "vOffset": -20
                },
                "mobile": {
                    "show": true,
                    "scale": 0.5
                },
                "react": {
                    "opacityDefault": 0.7,
                    "opacityOnHover": 0.2
                }
            });
        };

        document.body.appendChild(Live);
        }
})();