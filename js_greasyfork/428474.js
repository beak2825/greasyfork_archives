// ==UserScript==
// @name         Wider Trello
// @namespace    https://rvnovae.com
// @version      0.1
// @description  Widens the Trello editor if the screen size allows
// @author       Oliver Kogel
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?domain=trello.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428474/Wider%20Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/428474/Wider%20Trello.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver

var maxWidth        = 1300
var sidebarWidth    = 200
var margin          = 100

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs

    var windowWidth = window.innerWidth
    var descriptionHeight = window.innerHeight - (margin * 4)

    var fullDesiredWidth = Math.min((windowWidth - margin), maxWidth)
    var mainColWidth = (fullDesiredWidth - sidebarWidth) * 0.9

    document.getElementsByClassName("window-main-col")[0].style.width = mainColWidth + "px"
    document.getElementsByClassName("window-sidebar")[0].style.width = sidebarWidth + "px"
    document.getElementsByClassName("window")[0].style.width = fullDesiredWidth + "px"

    document.getElementsByClassName("description-edit")[0].getElementsByTagName("textarea")[0].style.height = descriptionHeight + "px"
});

(function() {
    'use strict';

    observer.observe((document.getElementsByClassName("window")[0]), {
        subtree: true,
        attributes: true
    })
})();