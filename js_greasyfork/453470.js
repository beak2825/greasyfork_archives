// ==UserScript==
// @name         NitroType Auto Reload for windows 7, XP, and more (Older PC's that don't load instantly
// @author       Ray Adams / TheGoatJack1
// @namespace    https://github.com/Ray-Adams
// @description  Automatically reloads the page at the end of each race.
// @version      2.1.0
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @homepageURL  https://github.com/Ray-Adams/NitroType-Archive
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453470/NitroType%20Auto%20Reload%20for%20windows%207%2C%20XP%2C%20and%20more%20%28Older%20PC%27s%20that%20don%27t%20load%20instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/453470/NitroType%20Auto%20Reload%20for%20windows%207%2C%20XP%2C%20and%20more%20%28Older%20PC%27s%20that%20don%27t%20load%20instantly.meta.js
// ==/UserScript==

const options = {
	timerMs: 400, // slight delay to make sure the race gets logged
	reloadWhenDisqualified: true
};

const returnToGarageBtn = document.querySelector('.btn--secondary[href="/garage"]');
const raceContainer = document.getElementById('raceContainer');
const dashCenter = document.querySelector('.dash-center');

// Watch for error modal
const dqObserver = new MutationObserver((mutationList, observer) => {
	mutationList.forEach(mutation => {
		mutation.addedNodes.forEach(node => {
			if (!node.classList.contains('modal--error')) return;

			observer.disconnect();
			location.reload();
		});
	});
});

if (options.reloadWhenDisqualified) {
	dqObserver.observe(raceContainer, { childList: true });
}

// Prevent button from firing the dqObserver (bug fix)
returnToGarageBtn.addEventListener('click', () => {
	dqObserver.disconnect();
});

// Watch for class changes on the last letter
const lastLetterObserver = new MutationObserver(mutationList => {
	mutationList.forEach(mutation => {
		if (!mutation.target.classList.contains('is-correct')) return;

		lastLetterObserver.disconnect();
		setTimeout(() => location.reload(), options.timerMs);
	});
});

// Wait for the dashboard to load before observing the lesson text
const lessonObserver = new MutationObserver((mutationList) => {
	mutationList.forEach(mutation => {
		mutation.addedNodes.forEach(node => {
			if (node.className !== 'dash-copyContainer') return;

			const letters = document.querySelectorAll('.dash-letter');
			const lastLetter = letters[letters.length - 2];

			lessonObserver.disconnect();
			lastLetterObserver.observe(lastLetter, { attributes: true });
		});
	});
});
lessonObserver.observe(dashCenter, { childList: true });

console.info('\'NitroType Auto Reload\' is no longer maintained, see https://github.com/Ray-Adams/NitroType-Archive for more info.');
