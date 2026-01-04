// ==UserScript==
// @name         Draggable Youtube Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script allows you to drag the video apart and read comments while watching video.
// @author       DKing
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31673/Draggable%20Youtube%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/31673/Draggable%20Youtube%20Video.meta.js
// ==/UserScript==

(function(){

var selected = null,
x_pos = 0, y_pos = 0,
x_elem = 0, y_elem = 0;

document.onmousemove = function (e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
};

document.onmouseup = function(){selected = null;};

document.getElementById('player-api').style.position = 'fixed';
document.getElementById('player-api').onmousedown = function () {
    selected = this;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
    return false;
};
})();
