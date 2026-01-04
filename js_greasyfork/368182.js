// ==UserScript==
// @name         is.gd/v.gd auto pronouncable
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      4.0
// @description  auto selects 'lowercase pronouncable'
// @author       Alistair1231
// @match        https://is.gd/
// @match        https://is.gd/create.php
// @match        https://is.gd/index.php
// @match        https://v.gd/
// @match        https://v.gd/create.php
// @match        https://v.gd/index.php
// @license      MIT
// @copyright 2020, Alistair1231 (https://openuserjs.org/users/Alistair1231)
// @downloadURL https://update.greasyfork.org/scripts/368182/isgdvgd%20auto%20pronouncable.user.js
// @updateURL https://update.greasyfork.org/scripts/368182/isgdvgd%20auto%20pronouncable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // click more options (technically not necessary)
    document.getElementById("shorturllabel").children[0].click();
    // select lower-case pronouncable
    document.getElementById("options").children[4].checked=true;

    var page = window.location.pathname.split('/')[1];
    // if on create.php highlight shorted url
    if(page === "create.php"){
        document.getElementById("short_url").select();
    }
    // If on main page highlight long url input
    else if(page == "index.php" || page === ""){
        document.getElementById("urlboxcontainer").children[0].select();
    }
})();