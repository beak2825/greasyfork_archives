// ==UserScript==
// @name         MAMA 2019 GFriend
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto vote/click script for GFriend in MAMA 2019
// @author       Fray
// @match        http://mama.mwave.me/en/vote
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391956/MAMA%202019%20GFriend.user.js
// @updateURL https://update.greasyfork.org/scripts/391956/MAMA%202019%20GFriend.meta.js
// ==/UserScript==


(window.onload = function() {
    //'use strict';
    var ids = ["candidate_25",
               "section2",
               "candidate_64",
               "section3",
               "candidate_121",
               "section7",
               "candidate_156",
               "section12",
               "candidate_183"
              ];
    var i = 0;
    function vote() {
        setTimeout(function() {
            document.getElementById(ids[i]).click();
            i++;
            if (i < ids.length) {
                vote();
            }
        }, 350);
    }
    function start() {
        vote();
        setTimeout(function() { document.getElementsByClassName('btn_vote_complete')[0].click();}, 3500);
        setTimeout(function() {
            var confirm = document.getElementById('voteConfirm');
            confirm.getElementsByClassName('btn_y')[0].click();
        }, 4000);
    }
    if (document.getElementsByClassName('btn_vote_complete')[0].innerText=="Voting Complete") {
        start();
    } else return false;
})();