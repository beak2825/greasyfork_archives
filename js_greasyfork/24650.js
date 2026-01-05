// ==UserScript==
// @name         Mturk Radio Keybinds
// @namespace    https://gist.github.com/Kadauchi
// @version      2.1.4
// @description  Keybinds to select radios
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/24650/Mturk%20Radio%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/24650/Mturk%20Radio%20Keybinds.meta.js
// ==/UserScript==

if (document.querySelector(`[type="radio"]`).length === 0) return;

document.body.insertAdjacentHTML(
  `afterbegin`,

  `<div style="background-color: lightgreen;">` +
  `<label style="color: black; margin-left: 10px;">Script: Mturk Radio Keybinds</label>` +
  `<span style="margin-left: 3px;cursor:help" title="Press 1 through 9 or z through / to select the radio you want. (0 is 10th) \n\nPress Enter to submit the HIT. \n\nCheck auto submit to have the HIT submit after you press your keybind.">&#10068;</span>` +

  `<label style="color: black; float: right; margin-right: 10px;">Auto Submit: ` +
  `<input id="autosubmit" type="checkbox" ${GM_getValue(`autosubmit`) ? `checked` : ``}></input>` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Use [z-/]: ` +
  `<input id="letters" type="checkbox" ${GM_getValue(`letters`) ? `checked` : ``}></input>` +
  `</label>` +

  `<label style="color: black; float: right; margin-right: 10px;">Use [0-9]: ` +
  `<input id="numbers" type="checkbox" ${GM_getValue(`numbers`) ? `checked` : ``}></input>` +
  `</label>` +

  `</div>`
);

const numbers = document.getElementById(`numbers`);
const letters = document.getElementById(`letters`);
const autosubmit = document.getElementById(`autosubmit`);

numbers.addEventListener(`change`, e => GM_setValue(`numbers`, numbers.checked));
letters.addEventListener(`change`, e => GM_setValue(`letters`, letters.checked));
autosubmit.addEventListener(`change`, e => GM_setValue(`autosubmit`, autosubmit.checked));

window.addEventListener(`keydown`, e => {
  const key = e.key;

  if (key.length === 1) {
	if (numbers.checked && key.match(/[0-9]/)) {
	  const radio = document.querySelectorAll(`[type="radio"]`)[key !== 0 ? key - 1 : 9];

	  if (radio) radio.click();
	  if (autosubmit.checked) document.querySelector(`[type="submit"]`).click();
	}

	if (letters.checked && key.match(/z|x|c|v|b|n|m|,|\.|\//)) {
	  const convert = { 'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6, ',': 7, '.': 8, '/': 9 };
	  const radio = document.querySelectorAll(`[type="radio"]`)[convert[key]];

	  if (radio) radio.click();
	  if (autosubmit.checked) document.querySelector(`[type="submit"]`).click();
	}
  }

  if (key === `Enter`) {
	document.querySelector(`[type="submit"]`).click();
  }
});

window.focus();