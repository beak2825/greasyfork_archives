// ==UserScript==
// @name         Github - Open External Link of Wiki in New Tab
// @namespace    https://github.com/y-muen
// @license      MIT
// @version      0.1
// @description  Open external link fo Github wiki in new tab.
// @author       Yoiduki <y-muen>
// @match        *://github.com/*/*/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @supportURL   https://gist.github.com/y-muen/1a09a062485ecdde8f58644040f522c4
// @downloadURL https://update.greasyfork.org/scripts/456810/Github%20-%20Open%20External%20Link%20of%20Wiki%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/456810/Github%20-%20Open%20External%20Link%20of%20Wiki%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a').each(function () {
        var a = new RegExp('/' + window.location.host + '/');
        if (!a.test(this.href)) {
            $(this).attr({ 'target': '_blank', 'rel': 'noopener noreferrer' });
        }
    });
})();