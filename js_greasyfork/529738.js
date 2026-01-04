// ==UserScript==
// @name         Make Forocoches Great Again
// @version      2025/03/10
// @author       Sticky
// @description  elimina temas y mensajes de ignorados y bloque de publi
// @match        https://forocoches.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forocoches.com
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/708524
// @downloadURL https://update.greasyfork.org/scripts/529738/Make%20Forocoches%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/529738/Make%20Forocoches%20Great%20Again.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        if(window.location.href.includes('forumdisplay.php')) {
            $('[id*="td_threadtitle_"][title=""]').parent().remove();
        }
        if(window.location.href.includes('showthread.php')) {
            $('a[href="profile.php?do=ignorelist"]').closest('div[align="center"]').remove();
        }
        $('#vbnotices').remove();
    });
})();