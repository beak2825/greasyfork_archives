// ==UserScript==
// @name          Filter people on a punBB board
// @description   Filters people on a punBB board
// @author        Jixun
// @version       1.0
// @namespace     org.jixun.hide.punbb.user

// @include       http://abcdrduson.com/forum/*
// @include       http://www.abcdrduson.com/forum/*

// @run-at        document-start
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/5294/Filter%20people%20on%20a%20punBB%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/5294/Filter%20people%20on%20a%20punBB%20board.meta.js
// ==/UserScript==

var listOfUsers = ['Hype'];

addEventListener ('DOMContentLoaded', function () {
    [].forEach.call (document.querySelectorAll ('#punviewtopic td > .blockpost'), function (post) {
        var user = post.querySelector('.postleft a').textContent;
        if (listOfUsers.indexOf (user) != -1) {
            post.style.display = 'none';
        }
    });
}, false);