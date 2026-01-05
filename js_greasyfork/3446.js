// ==UserScript==
// @name       WebStagram Popup Remover
// @version    1.1
// @namespace    Learning2Program
// @author       Learning2Program
// @homepage https://greasyfork.org/scripts/3446-webstagram-popup-remover 
// @description  Removes popups from webstagram.
// @include      *web.stagram.com/*
// @include *websta.me/*
// @run-at document-end
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/3446/WebStagram%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/3446/WebStagram%20Popup%20Remover.meta.js
// ==/UserScript==

if ($('#cboxOverlay').length === 1){
document.getElementById('cboxOverlay').remove();
document.getElementById('colorbox').remove();}