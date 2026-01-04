// ==UserScript==
// @name         toggle
// @namespace    https://github.com/iugastefan
// @homepage     https://github.com/iugastefan/readtoggle/raw/master/toggle.user.js
// @version      0.4
// @description  Toggles chapter's read state
// @author       Iuga Stefan
// @match        https://mangadex.org/title/*
// @grant        none
// @license      BSD 3-Clause "New" or "Revised" License
// @downloadURL https://update.greasyfork.org/scripts/387335/toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/387335/toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var but = document.createElement("button");
    but.className="btn btn-primary";
    var sp = document.createElement("span");
    sp.className = "fas fa-eye fa-fw";
    but.appendChild(sp);
    var t = document.createTextNode(" Toggle read status for all chapters");
    if(document.getElementsByClassName("chapter_mark_read_button").length === 0 && document.getElementsByClassName("chapter_mark_unread_button").length === 0) {
        t.textContent=" You need to follow to read";
        but.disabled=true;
    }
    but.appendChild(t);
    but.style.cursor = "pointer";
    but.onclick = function() {
        var x = document.getElementsByClassName("chapter_mark_read_button");
        if (x.length !== 0) {
            Array.from(x).forEach(function(item) {
                item.click();
            });
            but.disabled=true;
            t.textContent = " Refresh to toggle again";
        } else {
            x = document.getElementsByClassName("chapter_mark_unread_button");
            if (x.length !== 0) {
                Array.from(x).forEach(function(item) {
                    item.click();
                    but.disabled=true;
                    t.textContent = " Refresh to toggle again";
                });
            } else {
                console.log("Nothing to click");
            }
        }
    };
    document.getElementsByClassName("col-lg-9 col-xl-10")[document.getElementsByClassName("col-lg-9 col-xl-10").length-1].appendChild(but);
})();
