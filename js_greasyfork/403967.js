// ==UserScript==
// @name         使易语言TV切换到H5播放器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       逍遥一仙
// @match        https://www.eyuyan.tv/*.html
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403967/%E4%BD%BF%E6%98%93%E8%AF%AD%E8%A8%80TV%E5%88%87%E6%8D%A2%E5%88%B0H5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/403967/%E4%BD%BF%E6%98%93%E8%AF%AD%E8%A8%80TV%E5%88%87%E6%8D%A2%E5%88%B0H5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

$.getJSON(decodeURIComponent(player.vars.video).substring(8),function(response){var videoObject = {
container: '#playshow',
variable: 'player',
flashplayer:false,
video:response.video[0].video[0].file
};
var player = new ckplayer(videoObject);})