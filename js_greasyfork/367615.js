// ==UserScript==
// @name         Mturk Radio Keybinds - MTS Donation - backup
// @namespace    https://gist.github.com/Kadauchi
// @version      2.1.8
// @description  Keybinds to select radios
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @include     https://worker.mturk.com/projects*
// @include     https://www.google.com*
// @include    https://www.gethybrid.io/workers/tasks*
// @include     https://sofia.pinadmin.com*
// @include     https://jobspotter.indeed.com*
// @include      https://portal.alegion.com*
// @include     https://backend.ibotta.com/*
// @include     https://www.photofeeler*
// @include     *qualtrics.com*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/367615/Mturk%20Radio%20Keybinds%20-%20MTS%20Donation%20-%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/367615/Mturk%20Radio%20Keybinds%20-%20MTS%20Donation%20-%20backup.meta.js
// ==/UserScript==

if (document.querySelector(`[type="radio"]`).length === 0) return;

document.body.insertAdjacentHTML(
  `afterbegin`,

  `<div style="background-color: lightgreen;">` +
  `<label style="color: black; margin-left: 10px;">Script: Mturk Radio Keybinds</label>` +
  `<span style="margin-left: 3px;cursor:help" title="Press 0 through 9 or z through / to select the radio you want. (0 is 10th) \n\nPress Enter to submit the HIT. \n\n\Check Focus Next to focus and scroll to the next radio. \n\nCheck auto submit to have the HIT submit after you press your keybind.">&#10068;</span>` +

  `<label style="color: black; float: right; margin-right: 10px;">Auto Submit: ` +
  `<input id="autosubmit" type="checkbox" ${GM_getValue(`autosubmit`) ? `checked` : ``}></input>` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Focus Next: ` +
  `<input id="focusnext" type="checkbox" ${GM_getValue(`focusnext`) ? `checked` : ``}></input>` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Use [z-/]: ` +
  `<input id="letters" type="checkbox" ${GM_getValue(`letters`) ? `checked` : ``}></input>` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Use [0-9]: ` +
  `<input id="numbers" type="checkbox" ${GM_getValue(`numbers`) ? `checked` : ``}></input>` +
  `</label>` +

  `</div>`
);

const names = [];
const numbers = document.getElementById(`numbers`);
const letters = document.getElementById(`letters`);
const focusnext = document.getElementById(`focusnext`);
const autosubmit = document.getElementById(`autosubmit`);

for (const el of document.querySelectorAll(`[type="radio"]`)) {
  if (names.indexOf(el.name) === -1) {
	names.push(el.name);
  }
}

numbers.addEventListener(`change`, e => GM_setValue(`numbers`, numbers.checked));
letters.addEventListener(`change`, e => GM_setValue(`letters`, letters.checked));
focusnext.addEventListener(`change`, e => GM_setValue(`focusnext`, focusnext.checked));
autosubmit.addEventListener(`change`, e => GM_setValue(`autosubmit`, autosubmit.checked));

document.addEventListener(`keydown`, e => {
  const key = e.key;

  if (key.length === 1) {
	if (numbers.checked && key.match(/[0-9]/)) {
	  const radio = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`)[key !== 0 ? key - 1 : 9];

	  if (radio) {
		radio.click();
		names.shift();
	  }

	  if (names.length) {
		if (focusnext) {
		  const next = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`);
		  next[next.length - 1].focus();
		  next[0].scrollIntoView();
		}
	  }
	  else if (autosubmit.checked) {
		document.querySelector(`[type="submit"]`).click();
	  }
	}

	if (letters.checked && key.match(/z|x|c|v|b|n|m|,|\.|\//)) {
	  const convert = { 'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6, ',': 7, '.': 8, '/': 9 };
	  const radio = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`)[convert[key]];

	  if (radio) {
		radio.click();
		names.shift();
	  }

	  if (names.length) {
		if (focusnext) {
		  const next = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`);
		  next[next.length - 1].focus();
		  next[0].scrollIntoView();
		}
	  }
	  else if (autosubmit.checked) {
		document.querySelector(`[type="submit"]`).click();
	  }
	}
  }

  if (key.match(/Enter/) && !names.length) {
	document.querySelector(`[type="submit"]`).click();
  }
});

window.focus();

