// ==UserScript==
// @name        TVMaze: add "Watched" button to calendar
// @description Add "Mark as watched" button to calendar entries at TVMaze
// @namespace   BlackNullerNS
// @include     http*://www.tvmaze.com/calendar*
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/26875/TVMaze%3A%20add%20%22Watched%22%20button%20to%20calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/26875/TVMaze%3A%20add%20%22Watched%22%20button%20to%20calendar.meta.js
// ==/UserScript==

var btn = document.createElement('button');
btn.innerHTML = '&#10003;';
btn.style.fontWeight = 'bold';
btn.style.border = 0;
btn.style.padding = '2px 4px';
btn.style.background = 'transparent';
btn.style.color = '#3C948B';
btn.style.cursor = 'pointer';
btn.setAttribute('title', 'Mark as watched');

var handler = function (e) {
    e.preventDefault();

    var self = this,
        entry = this.parentNode.parentNode,
        link = entry.querySelector('a[href*="episodes/"]');

    if (!link) {
        return false;
    }

    var eid = link.getAttribute('href').split('episodes/')[1].split('/')[0];
    var url = '/watch/set?episode_id=' + eid;
    var csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('X-CSRF-Token', csrf);

    xhr.addEventListener('load', function () {
        entry.classList.add('watched');
        self.remove();
    });

    xhr.send("type=0");
};

var mouseover = function () {
    this.style.color = '#cc0000';
};

var mouseout = function () {
    this.style.color = '#3C948B';
};

var cloned;
var episodes = document.querySelectorAll(".entry:not(.watched)");

for (var i = 0, l = episodes.length; i < l; i++) {
    cloned = btn.cloneNode(true);
    cloned.addEventListener('click', handler);
    cloned.addEventListener('mouseover', mouseover);
    cloned.addEventListener('mouseout', mouseout);

    episodes.item(i).firstElementChild.appendChild(cloned);
}