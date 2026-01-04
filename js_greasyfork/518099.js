// ==UserScript==
// @name         CS 7. Semestar
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Remove outdated courses from cs
// @author       Aleksadar Prokopovic
// @match        https://cs.elfak.ni.ac.rs/nastava/course/index.php?categoryid=6
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.rs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518099/CS%207%20Semestar.user.js
// @updateURL https://update.greasyfork.org/scripts/518099/CS%207%20Semestar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ids = [155, 138, 118, 117, 104, 73, 72, 71, 63, 60, 42, 35, 115, 34];
    let parrent = document.querySelector("[data-courseid='" + ids[0] + "']").parentElement;
    parrent.firstChild.remove()
    parrent.lastChild.remove()
    parrent.innerHTML += '<div class="coursebox clearfix even collapsed" data-courseid="13" data-type="1" id="yui_3_17_2_1_1732033283397_30"><div class="info"><div class="coursename"><a class="aalink" href="https://cs.elfak.ni.ac.rs/nastava/course/view.php?id=13">Veštačka inteligencija</a></div><div class="moreinfo"><a title="Summary" href="https://cs.elfak.ni.ac.rs/nastava/course/info.php?id=13"><i class="icon fa fa-info fa-fw " title="Summary" aria-label="Summary"></i></a></div></div><div class="content"></div></div>'
    ids.forEach(id => {
        document.querySelector("[data-courseid='" + id + "']").remove();
    });
})();