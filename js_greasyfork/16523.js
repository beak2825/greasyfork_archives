// ==UserScript==
// @name         Webman Redirect
// @namespace    http://rit.edu/
// @version      0.1
// @description  Automatic Redirect from Old Webman to New Webhosting Application
// @author       Kirk Bater <kxbtwc@rit.edu>
// @match        *://webman.rit.edu/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16523/Webman%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/16523/Webman%20Redirect.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

location.href = "https://claws.rit.edu/webhosting/index.php";