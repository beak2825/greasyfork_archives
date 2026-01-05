// ==UserScript==
// @name         Fix Collapse Button on /r/DoctorWho (old Reddit)
// @version      0.2
// @namespace    https://greasyfork.org/en/users/105361-randomusername404
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @description  Move the collapse button back where it's supposed to be on /r/DoctorWho.
// @author       RandomUsername404
// @match        https://old.reddit.com/r/doctorwho/comments/*/*/
// @grant        none
// @icon         https://b.thumbs.redditmedia.com/L9ZqY1Wmvy9qDCcxhQuoVMGlCjD6Vgfqht-5xE5NGCk.png
// @downloadURL https://update.greasyfork.org/scripts/29373/Fix%20Collapse%20Button%20on%20rDoctorWho%20%28old%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29373/Fix%20Collapse%20Button%20on%20rDoctorWho%20%28old%20Reddit%29.meta.js
// ==/UserScript==

$(document).ready(function() {   
    $('.commentarea .comment a.expand').css('position', 'unset');
})();