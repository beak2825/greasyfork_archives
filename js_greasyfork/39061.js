// ==UserScript==
// @name         Abload image redirect
// @description  redirect Abload pages directly to the images
// @match        http://abload.de/image.php?img=*
// @version 0.0.1.20180302223851
// @namespace https://greasyfork.org/users/40027
// @downloadURL https://update.greasyfork.org/scripts/39061/Abload%20image%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/39061/Abload%20image%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.location = document.getElementById("image").getAttribute("src");
})();