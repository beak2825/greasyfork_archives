// ==UserScript==
// @name         镜像网站
// @name:en         Mirror-image-of-page
// @name:zh         镜像网站
// @name:zh-CN      镜像网站
// @namespace    https://github.com/modochear/Mirror-image-of-page/
// @supportURL       https://github.com/modochear/Mirror-image-of-page/
// @home-url        https://greasyfork.org/zh-CN/scripts/407242
// @version      0.1.1
// @description  try to take over the world!
// @description:en  try to take over the world!
// @author       modochear
// @include      /.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407242/%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/407242/%E9%95%9C%E5%83%8F%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html = document.getElementsByTagName("html")[0];
    html.setAttribute("style", "-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-o-transform:scaleX(-1);transform:scaleX(-1);/*IE*/filter:FlipH;")
})();
