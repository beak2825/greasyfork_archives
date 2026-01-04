// ==UserScript==
// @name         图片拉高
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  列表图片拉高
// @author       You
// @match         https://www.touchgal.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle

// @include      https://www.touchgal.io/*
// @downloadURL https://update.greasyfork.org/scripts/519343/%E5%9B%BE%E7%89%87%E6%8B%89%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/519343/%E5%9B%BE%E7%89%87%E6%8B%89%E9%AB%98.meta.js
// ==/UserScript==

(function() {
// 代码内部
var dropBox = document.createElement('div');
dropBox.setAttribute('id', 'dropbox');
GM_addStyle('.post_cover{height:280px !important}');
})();