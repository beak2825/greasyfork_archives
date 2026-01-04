// ==UserScript==
// @name         VK Delete HotKey
// @namespace    PhysicSpaceWtf
// @version      1.1
// @description  try to take over the world!
// @author       © Рhysic
// @match        vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372503/VK%20Delete%20HotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/372503/VK%20Delete%20HotKey.meta.js
// ==/UserScript==

(function() {
    'use strict';

var isReplying = false;

window.onkeydown = function(e) {
    if (e.key == "Delete" && e.altKey == true) {
        if (confirm("Точно удалить?")) {
            document.getElementsByClassName("im-mess_editable")[document.getElementsByClassName("im-mess_editable").length - 1].click();
            document.getElementsByClassName("im-page-action_delete")[0].click();
            if (document.getElementsByClassName("im-delete-forall-checkbox")[0].getAttribute("aria-checked") != "true") {
                document.getElementsByClassName("im-delete-forall-checkbox")[0].click();
            }
            document.getElementsByClassName("box_controls")[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].click();
        }
    }
    if (e.key == "ArrowDown") {
        if (isReplying) {
            document.getElementsByClassName("im-fwd--close")[0].click();
            isReplying = false;
        } else {
            document.getElementsByClassName("im-mess--reply")[document.getElementsByClassName("im-mess--reply").length - 1].click();
            isReplying = true;
        }
    }
}
    // Your code here...
})();

/*(function() {
    'use strict';

window.onkeydown = function(e) {
    if (e.key == "Delete" && e.altKey == true) {
        if (confirm("Точно удалить?")) {
            document.getElementsByClassName("im-mess_editable")[document.getElementsByClassName("im-mess_editable").length - 1].click();
            document.getElementsByClassName("im-page-action_delete")[0].click();
            if (document.getElementsByClassName("im-delete-forall-checkbox")[0].getAttribute("aria-checked") != "true") {
                document.getElementsByClassName("im-delete-forall-checkbox")[0].click();
            }
            document.getElementsByClassName("box_controls")[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].click();
        }
    }
    if (e.key == "ArrowDown" && e.altKey == true) {
        document.getElementsByClassName("im-fwd--close")[0].click();
    }
    else if (e.key == "ArrowDown") {
        document.getElementsByClassName("im-mess--reply")[document.getElementsByClassName("im-mess--reply").length - 1].click();
    }
}
    // Your code here...
})();*/