// ==UserScript==
// @name         Enroll TSU
// @description  Disable waiting page Enroll TSU
// @version      1.1.1
// @author       KangRio
// @match        https://enroll.tsu.ac.th/wait.jsp*
// @namespace https://greasyfork.org/th/users/393223-kangrio
// @downloadURL https://update.greasyfork.org/scripts/391744/Enroll%20TSU.user.js
// @updateURL https://update.greasyfork.org/scripts/391744/Enroll%20TSU.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){


        window.location.replace(window.location.origin+"/public/newslist.jsp");

    }, 1000);
})();