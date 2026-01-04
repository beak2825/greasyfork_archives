// ==UserScript==
// @name         【通信量削減】TypingTube 最低画質に固定【144p】
// @version      0.2
// @description  TypingTube 画質固定
// @author       Toshi
// @match  https://www.youtube.com/embed/*typing-tube.net*
// @namespace https://greasyfork.org/users/302934
// @downloadURL https://update.greasyfork.org/scripts/434406/%E3%80%90%E9%80%9A%E4%BF%A1%E9%87%8F%E5%89%8A%E6%B8%9B%E3%80%91TypingTube%20%E6%9C%80%E4%BD%8E%E7%94%BB%E8%B3%AA%E3%81%AB%E5%9B%BA%E5%AE%9A%E3%80%90144p%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434406/%E3%80%90%E9%80%9A%E4%BF%A1%E9%87%8F%E5%89%8A%E6%B8%9B%E3%80%91TypingTube%20%E6%9C%80%E4%BD%8E%E7%94%BB%E8%B3%AA%E3%81%AB%E5%9B%BA%E5%AE%9A%E3%80%90144p%E3%80%91.meta.js
// ==/UserScript==
if(document.getElementById("movie_player") != null && document.getElementById("movie_player").setPlaybackQualityRange){
document.getElementById("movie_player").setPlaybackQualityRange("tiny")
}