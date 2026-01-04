// ==UserScript==
// @name         Display Team stats on Phonetool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://phonetool.amazon.com/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386583/Display%20Team%20stats%20on%20Phonetool.user.js
// @updateURL https://update.greasyfork.org/scripts/386583/Display%20Team%20stats%20on%20Phonetool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var el = document.getElementsByClassName("UserLinks")[0];
    var user = window.location.href.split("/").pop();
    var link = 'https://code.amazon.com/cr_stats/team-view/' + user + '?time=month';
    var htm = '<a href="' + link + '">Team Stats</a>';
    var div = document.createElement('span');
    div.className = "optional-wrapper";
    div.innerHTML = htm;
    el.firstElementChild.firstElementChild.firstElementChild.parentNode.appendChild(div);
})();