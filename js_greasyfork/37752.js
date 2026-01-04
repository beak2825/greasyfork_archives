// ==UserScript==
// @name           Omni - Hide Sponsors
// @namespace      johantiden
// @description    Hides sponsored content.
// @include        http://omni.se*
// @include        https://omni.se*
// @version 0.0.1
// @downloadURL https://update.greasyfork.org/scripts/37752/Omni%20-%20Hide%20Sponsors.user.js
// @updateURL https://update.greasyfork.org/scripts/37752/Omni%20-%20Hide%20Sponsors.meta.js
// ==/UserScript==

var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'data:text/css,' +
            '.article--sponsored { display: none;';
document.getElementsByTagName("HEAD")[0].appendChild(link);