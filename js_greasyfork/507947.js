// ==UserScript==
// @name         Disable double-tap on The West
// @version      2024-09-11-3
// @description  Allows to double-tap on Pretzel and similar buttons without zooming the page on mobile.
// @author       Mr. Purple
// @namespace https://the-west.net
// @license MIT
// @include	https://*.the-west.*/game.php*
// @include	https://*.the-west.com.*/game.php*
// @include	https://*.the-west.*.com/game.php*
// @include	https://*.tw.innogames.*/game.php*
// @exclude https://classic.the-west.net*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507947/Disable%20double-tap%20on%20The%20West.user.js
// @updateURL https://update.greasyfork.org/scripts/507947/Disable%20double-tap%20on%20The%20West.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('* { touch-action:manipulation; }');
})();