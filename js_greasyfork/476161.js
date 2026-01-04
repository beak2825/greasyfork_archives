// ==UserScript==
// @name         Remixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto remixes a project!
// @author       You
// @match        https://studio.code.org/projects/*/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476161/Remixer.user.js
// @updateURL https://update.greasyfork.org/scripts/476161/Remixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function q(s) {
        return document.querySelector(s);
    }
    var int = setInterval(function() {
        if (q(".project_share") != null) {
            clearInterval(int);
            q(".project_share").click();
            setTimeout(function() {
                q("#share-dialog-publish-button").click();
                setTimeout(function() {
                    q("#publish-dialog-publish-button").click();
                    var int = setInterval(function() {
                        if (q("#publish-dialog-publish-button") == null) {
                            clearInterval(int);
                            q(".project_remix").click();
                        }
                    }, 100);
                });
            }, 500);
        }
    }, 100);
})();