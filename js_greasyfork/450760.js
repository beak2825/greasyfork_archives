// ==UserScript==
// @name         GC Restock timer
// @namespace    https://github.com/windupbird144/
// @version      0.5
// @description  Displays the time it took you to restock an item on grundos.cafe
// @author       github.com/windupbird144/
// @match        https://www.grundos.cafe/*
// @match        http://www.grundos.cafe/*
// @grant        none
// @license      https://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/450760/GC%20Restock%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/450760/GC%20Restock%20timer.meta.js
// ==/UserScript==

(function() {
    /**
     * Displays a timer to show how long it took you to restock an item on grundos.cafe.
     * The timer is shown on the page that says "<Item> has been added to your inventory" page.
     * Limitation: The exact time when your restock is confirmed is only known on the grundos.cafe
     * server. We can only approximate it here.
     */
    "use strict";
	// If you change the way time is measured, update the version
	const timingVersion = "0";
	const newTimer = () => ({ start: Date.now(), stop: -1 });
	const stopTimer = (t) => ({ start: t.start, stop: Date.now() });
	const durationMs = (t) => t.stop - t.start;
	const save = (t) => localStorage.setItem('timer', JSON.stringify(t));
	const load = () => JSON.parse(localStorage.getItem('timer'));
	// Reset the timer and saves it. Only runs when you visit or refresh a shop
	function resetTimer() {
	    const path = window.location.pathname;
	    if (path.includes('viewshop')) {
	        save(newTimer());
	        return true;
	    }
	}
	// Stops the timer and displays the duration on the page
	function stopAndDisplayTimer() {
	    const target = document.querySelector(`button[onclick*='viewshop']`);
	    if (!target) {
	        return;
	    }
	    let timer = load();
	    if (!timer) {
	        return;
	    }
	    timer = stopTimer(timer);
	    const seconds = (durationMs(timer) / 1000).toFixed(3);
	    const msg = `You restocked this item in ${seconds} seconds.`;
	    const html = `<div title="timing version ${timingVersion}"><br><b>${msg}</b></div>`;
	    target.insertAdjacentHTML('afterend', html);
	}
	// If you run resetTimer, do not run stopAndDisplayTimer and vice verse
	resetTimer() || stopAndDisplayTimer();

})();