// ==UserScript==
// @name         IMDb Reelgood link
// @version      0.1
// @description  Provides link to Reelgood for the title
// @author       Aviem Zur
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @license MIT
// @namespace https://greasyfork.org/users/14514
// @downloadURL https://update.greasyfork.org/scripts/454802/IMDb%20Reelgood%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/454802/IMDb%20Reelgood%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title = document.getElementsByTagName("h1")[0].innerText
    var url = "https://reelgood.com/search?q=" + title
    var parent = document.getElementsByClassName("sc-84b7a243-5 jBGMjh")[0]
    var btn = document.createElement("a")
    btn.href = url
    btn.innerHTML = '<a data-testid="tm-box-pwo-btn" class="ipc-button ipc-button--full-width ipc-button--center-align-content ipc-button--large-height ipc-button--core-accent1 ipc-button--theme-baseAlt sc-84b7a243-0 eurwCU" role="button" tabindex="0" aria-disabled="false" target="_blank" href="' + url + '" style="!text-align: left;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--play-circle-outline ipc-button__icon ipc-button__icon--pre" id="iconContext-play-circle-outline" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M10.8 15.9l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1a.5.5 0 0 0-.8.4v7c0 .41.47.65.8.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg><div class="ipc-button__text"><div class="sc-84b7a243-1 eHbJlt">Stream now!<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--launch ipc-icon--inline sc-84b7a243-2 fDVyCm" id="iconContext-launch" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M16 16.667H8A.669.669 0 0 1 7.333 16V8c0-.367.3-.667.667-.667h3.333c.367 0 .667-.3.667-.666C12 6.3 11.7 6 11.333 6h-4C6.593 6 6 6.6 6 7.333v9.334C6 17.4 6.6 18 7.333 18h9.334C17.4 18 18 17.4 18 16.667v-4c0-.367-.3-.667-.667-.667-.366 0-.666.3-.666.667V16c0 .367-.3.667-.667.667zm-2.667-10c0 .366.3.666.667.666h1.727L9.64 13.42a.664.664 0 1 0 .94.94l6.087-6.087V10c0 .367.3.667.666.667.367 0 .667-.3.667-.667V6h-4c-.367 0-.667.3-.667.667z"></path></svg></div>'
    parent.insertBefore(btn, parent.firstChild)
})();