// ==UserScript==
// @name         2dwife
// @namespace    https://www.cnblogs.com/cczlovexw/p/12214618.html
// @icon         https://absx.pages.dev/favicon.ico
// @version      1.0.0
// @description  在所有网页生成 2D 动态看板娘
// @author       lxl66566
// @include      *
// @grant        none
// @require      https://blog-static.cnblogs.com/files/liuzhou1/L2Dwidget.min.js#md5=ae2e72d55d0c1bb66c3b7e593911188b
// @require      https://blog-static.cnblogs.com/files/liuzhou1/L2Dwidget.0.min.js#md5=dfbfc8bfd1e4b1f3a7f6202ec6ac1648
// @downloadURL https://update.greasyfork.org/scripts/474603/2dwife.user.js
// @updateURL https://update.greasyfork.org/scripts/474603/2dwife.meta.js
// ==/UserScript==

(function() {
    'use strict';
    L2Dwidget.init({
        "model": {
            jsonPath: "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",//这是插件模型，可以任意选择想要添加的2d动画
            "scale": 1
        },
        "display": {
            "position": "left", //看板娘的表现位置
            "superSample": 2,
            "width": 150,  //小萝莉的宽度
            "height": 300, //小萝莉的高度
            "hOffset": 0,
            "vOffset": 0
        },
        "mobile": {
            "show": true,
            "scale": 0.5
        },
        "react": {
            "opacityDefault": 1,
            "opacityOnHover": 0.5
        }
    });
})();