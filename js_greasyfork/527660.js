// ==UserScript==
// @name                YouTube focus player
// @description         YouTube focus player when an arrow key is pressed(exclude"textarea")
// @name:zh-TW          YT永遠聚焦在播放器
// @description:zh-TW   YT上下鍵強制聚焦在播放器(文字輸入區除外)
// @version      2.0
// @namespace    https://greasyfork.org/zh-TW/users/4839
// @author       merkantilizm,hzhbest
// @license MIT
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527660/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527660/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define video element
    var video;

    // Add event listener for keydown
    window.addEventListener('keydown', function(e) {
      //文字輸入時無效
        if (checkTextArea(e.target)) return;
      // Check if arrow keys are pressed
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {

            // Get video element (has to be done inside of the function or it doesnt work for some reason)
            video = document.querySelector('video');

            // Prevent default action of arrow keys (e.g., scrolling the page)
            e.preventDefault();
            // Focus the video player
            video.focus();
        }
    });

  function checkTextArea(node) {
    var name = node.localName.toLowerCase();
    if (name == "textarea" || name == "input" || name == "select") {
		return true;
	}
    if (name == "div" && (node.id.toLowerCase().indexOf("textarea") != -1 || node.contentEditable !== false)) {
        return true;
	}
    return false;
}

})();
