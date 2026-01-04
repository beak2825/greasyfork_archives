// ==UserScript==
// @name		next-episode notification remover
// @version		0.3
// @description	removes the blocking notification if you have adblockers installed
// @author		Sarusei
// @match		https://next-episode.net/*
// @icon		data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant		none
// @license MIT
// @namespace https://greasyfork.org/users/4493
// @downloadURL https://update.greasyfork.org/scripts/464574/next-episode%20notification%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/464574/next-episode%20notification%20remover.meta.js
// ==/UserScript==

(function () {
	'use strict';

    function getAllBannerElements() {
        var toDelete = Array.from(document.querySelectorAll('#bannerclass'));
        if (toDelete) {
			return toDelete;
		} else {
			return 0;
		}
    }

	function deleteNuisances() {
        var toDelete = getAllBannerElements();
        console.log("toDelete: " + toDelete.length);
        if (toDelete) {
            toDelete.forEach((ele, index) => {
                ele.parentElement.remove();
            });
        }
    }

	function stopTimer() {
		window.clearTimeout(_timer)
	}

	var _timer = window.setInterval(deleteNuisances, 50)
	
	//uncomment the following line if you want to stop the script after 5 seconds
	//window.setTimeout(stopTimer, 5000)


})();