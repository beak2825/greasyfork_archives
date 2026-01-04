// ==UserScript==
// @name     YouTube continue playing
// @version  1.0
// @author   Pascal
// @description automatically clicks confirm in youtube
// @match    https://youtube.com/watch*
// @match    https://www.youtube.com/watch*
// @grant    none
// @namespace https://greasyfork.org/users/767993
// @downloadURL https://update.greasyfork.org/scripts/542577/YouTube%20continue%20playing.user.js
// @updateURL https://update.greasyfork.org/scripts/542577/YouTube%20continue%20playing.meta.js
// ==/UserScript==

(function() {
  window.addEventListener('load', function() {
    window.setInterval(function(){
        document.getElementById("confirm-button").click();
    }, 5000);
	}, false);
})();