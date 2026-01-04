// ==UserScript==
// @name         Add hide button
// @author       Rolandas Valantinas
// @description  Add hide button to video blocks in subscriptions feed
// @match        https://www.youtube.com/feed/subscriptions
// @namespace    https://greasyfork.org/users/157178
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.2
// @downloadURL https://update.greasyfork.org/scripts/406106/Add%20hide%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/406106/Add%20hide%20button.meta.js
// ==/UserScript==

// Helper functions
function getTarget(e) {
	e = e || window.event;
	return e.target || e.srcElement;
}

// Hide videos when clicked
function autoHideClicked (e) {
	var target = getTarget(e).parentNode.parentNode;

    var hideMenuButton = target.getElementsByTagName('button')[0];
    hideMenuButton.click();

    setTimeout(function() {
        // Hide the video via the youtube menus, because 1) lazy, 2) easier to update in future
        var hideMenu = document.getElementsByTagName('ytd-popup-container')[0];
        var hideButton = hideMenu.getElementsByTagName('yt-formatted-string');
        hideButton[hideButton.length-1].click();
    }, 4);
}

(function () {
    setTimeout(() => {
        var i;
        var videos = document.getElementsByTagName("ytd-grid-video-renderer");

        for (i = 0; i < videos.length; i++) {
            var link = document.createElement('div');
            link.innerHTML = '<a class="hide-button" href="javascript:;">hide</a>';

            videos[i].appendChild(link);
        }

        var hideButtons = document.getElementsByClassName('hide-button');

        for (i = 0; i < hideButtons.length; i++) {
            hideButtons[i].addEventListener('click', autoHideClicked, false);
        }
    }, 3000);

})();
