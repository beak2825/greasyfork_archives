// ==UserScript==
// @name         fix insert classical works
// @namespace    https://greasyfork.org/users/2653
// @version      0.2
// @description  fix inserting works into tracklist when work has apostrophe in title
// @author       thought_house
// @match        https://rateyourmusic.com/releases/ac*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373358/fix%20insert%20classical%20works.user.js
// @updateURL https://update.greasyfork.org/scripts/373358/fix%20insert%20classical%20works.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchFrame = document.getElementById("shortcutsearchframe");

    searchFrame.onload = function() {

        var infoboxes = document.getElementById("shortcutsearchframe").contentDocument.getElementsByClassName("infobox");

        for (var i = 0; i < infoboxes.length; i++) {
            var infobox = infoboxes[i];
            var workTitle = infobox.getElementsByClassName('infobox_title')[0].innerHTML;

            if (workTitle.indexOf("'") >= 0) {
                if (infobox.getAttribute('class').indexOf('child') >= 0) {
                    workTitle = workTitle.replace(/^\d+\. /, '');
                }

                var onclickcode = infobox.children[0].children[0].getAttribute('onclick');
                onclickcode = onclickcode.replace(workTitle, workTitle.replace(/'/g, "\\'"));
                infobox.children[0].children[0].setAttribute('onclick', onclickcode);
            }
        }
    }
})();