// ==UserScript==
// @name             Rule34.XXX High Resolution Images
// @namespace   tuktuk3103@gmail.com
// @description   High Resolution Images
// @include          https://rule34.xxx/*
// @version          1
// @grant              none
// @icon                https://rule34.xxx/favicon.ico?v=2
// @downloadURL https://update.greasyfork.org/scripts/448919/Rule34XXX%20High%20Resolution%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/448919/Rule34XXX%20High%20Resolution%20Images.meta.js
// ==/UserScript==

var sImg = document.getElementById("image").src;

if(sImg.includes("/samples")) window.Function('"use strict";Post.highres();')();
