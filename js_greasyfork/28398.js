// ==UserScript==
// @name         Netflix: Click to Play/Pause
// @description  Play/Pause when clicking the video.
// @author       Zren
// @icon         https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2015.ico
// @namespace    http://github.com/Zren
// @version      5
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28398/Netflix%3A%20Click%20to%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/28398/Netflix%3A%20Click%20to%20PlayPause.meta.js
// ==/UserScript==

window.addEventListener('click', function(e) {
    console.log('click', e.target)
	if (e.target.matches('.nf-player-container *')
        && !e.target.matches('.PlayerControls--main-controls *')
        && !e.target.matches('.skip-credits *')
        && document.querySelector('video').offsetWidth >= window.innerWidth // Don't pause when when returning to credits at the postplay screen.
    ) {
        var button = document.querySelector('.button-nfplayerPause') || document.querySelector('.button-nfplayerPlay')
		button.click()
	}
})
