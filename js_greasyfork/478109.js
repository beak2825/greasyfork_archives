// ==UserScript==
// @name         [AO3] Mark for Later - Skip the Click
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      0.8
// @description  Adds a button to listed works to mark them for later without needing to open the work first.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478109/%5BAO3%5D%20Mark%20for%20Later%20-%20Skip%20the%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/478109/%5BAO3%5D%20Mark%20for%20Later%20-%20Skip%20the%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var domainRe = /https?:\/\/archiveofourown\.org\/(works|tags|users).*/i;
    if (domainRe.test(document.URL)) {
        var worksList = document.querySelectorAll("ol.work.index.group, ul.index.group, #user-series > ol.index.group");
        for (let section of worksList) {
            for (let work of section.children) {
                let heading = work.querySelector("h4.heading");
                let container = work.querySelector("p.datetime");
                let button = document.createElement("a");
                button.innerHTML = "⏲";
                button.href = `${heading.firstElementChild.href}/mark_for_later`;
                //button.target = "_blank";
                button.title = "Mark for Later";
                button.style.borderBottom = "none";
                button.style.paddingLeft = "0.5em";
                button.style.fontSize = "2em";
                button.style.verticalAlign = "middle";
                container.append(button);
            }
        }
    }
})();