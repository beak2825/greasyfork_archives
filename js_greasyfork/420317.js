// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420317/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/420317/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var speed = 6;//设置速度
	var vdo = document.getElementById("videoFrame_video_html5_api");//获取id
	vdo.playbackRate = speed;//改变速度
    // Your code here...
})();