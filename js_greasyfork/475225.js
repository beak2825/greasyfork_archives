// ==UserScript==
// @name         MB Auto-retry on upload to CAA error
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.04
// @match        https://musicbrainz.org/release/*/add-cover-art
// @match        https://musicbrainz.org/release/*/add-cover-art?*
// @iconURL      https://coverartarchive.org/img/big_logo.svg
// @run-at       document-end
// @author       Anakunda
// @copyright    2023, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @grant        GM_notification
// @grant        GM_getValue
// @description  Just autoretry
// @downloadURL https://update.greasyfork.org/scripts/475225/MB%20Auto-retry%20on%20upload%20to%20CAA%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/475225/MB%20Auto-retry%20on%20upload%20to%20CAA%20error.meta.js
// ==/UserScript==

{

'use strict';

function clearTimers() {
	if (timer != undefined) { clearTimeout(timer); timer = undefined; }
	if (countdownTimer != undefined) { clearInterval(countdownTimer); countdownTimer = undefined; }
	if (controls != null) countdown.textContent = '--';
}

const btnSubmit = document.body.querySelector('button#add-cover-art-submit');
if (btnSubmit == null) throw 'Submit button not found';
let haveErrors = false, active = true, timer, controls = null;
let counter, countdownTimer, countdownTime, countdown, countdownWrapper;
let retryCounter = 0, retryDelay = GM_getValue('retry_delay', 5);
const caption = (state = 0) => ['Suspend', 'Resume'][state] + ' autoretry';
new MutationObserver(function(ml, mo) {
	for (let mutation of ml) if (!mutation.target.disabled)
		if (Array.prototype.some.call(document.querySelectorAll('form#add-cover-art > table > tbody > tr > td > span.msg.error'),
				span => span.style.display != 'none' && /^⚠ (?:Server busy|Error)\b/.test(span.textContent.trim()))) {
			haveErrors = true;
			if (controls == null) {
				controls = Object.assign(document.createElement('span'), {
					style: `
position: fixed; right: 10px; bottom: 10px; padding: 10px; background-color: white;
border: solid black thin; box-shadow: 1pt 1pt 2pt gray;
display: inline-flex; flex-flow: row; column-gap: 1em; z-index: 999;`,
					className: 'autoretry-control',
				});
				const infoWrapper = Object.assign(document.createElement('div'), {
					style: 'padding: 5pt 0;',
				});
				countdownWrapper = document.createElement('span');
				countdownWrapper.append(' in ', countdown = Object.assign(document.createElement('span'), {
					style: 'font-weight: bold; display: inline-block; min-width: 2em; text-align: right;',
					id: 'autoretry-countdown',
				}), ' s');
				infoWrapper.append('Retry #', counter = Object.assign(document.createElement('span'), {
					style: 'font-weight: bold; color: red;',
					id: 'retry-counter',
				}), countdownWrapper);
				controls.append(Object.assign(document.createElement('button'), {
					textContent: caption(),
					style: 'padding: 5px 10px; cursor: pointer; border: 1px solid #CCC; border-top: 1px solid #EEE; border-left: 1px solid #EEE;',
					id: 'autoretry',
					onclick: function(evt) {
						if (active) clearTimers();
						if ((active = !active) && !btnSubmit.disabled) btnSubmit.click();
						evt.currentTarget.textContent = caption(active ? 0 : 1);
						countdownWrapper.style.opacity = active ? 1 : 0.3;
						return false;
					},
				}), infoWrapper);
				document.body.append(controls);
			}
			const log10 = Math.log10(retryCounter);
			counter.textContent = ++retryCounter;
			if (log10 > 0 && log10 % 1 == 0 && retryDelay > 0) retryDelay *= log10 + 1;
			if (active) timer = setTimeout(function(elem) {
				clearTimers();
				if (active && elem instanceof HTMLElement && !elem.disabled) elem.click();
			}, retryDelay * 1000 || 0, btnSubmit); else continue;
			if ((countdownTime = retryDelay) > 0) {
				countdown.textContent = countdownTime;
				countdownTimer = setInterval(elem => { elem.textContent = --countdownTime }, 1000, countdown);
			}
		} else if (haveErrors) {
			mo.disconnect();
			if (controls != null) controls.remove();
			GM_notification({ text: 'Cover art upload successfully completed', title: 'MusicBrainz', highlight: false });
			document.location.assign(document.location.origin + document.location.pathname
				.replace(/\/(?:add-cover-art)\/?$/i, '/cover-art'));
		}
	else clearTimers();
}).observe(btnSubmit, { attributes: true, attributeFilter: ['disabled'] });

}
