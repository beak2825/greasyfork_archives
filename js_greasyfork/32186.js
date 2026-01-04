// ==UserScript==
// @name         No HIT Reloader
// @namespace    http://kadauchi.com/
// @version      2.0.1
// @description  Reloads pages automatically if no HIT is loaded for provided GroupIds
// @author       Kadauchi
// @include      /^https://www\.mturk\.com/mturk/(accept|preview|previewandaccept)/
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/32186/No%20HIT%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/32186/No%20HIT%20Reloader.meta.js
// ==/UserScript==

const GROUP_IDS = JSON.parse(localStorage.getItem(`GROUP_IDS`)) || {};
const group_id = window.location.href.split(`groupId=`)[1].split(`&`)[0];

function RELOAD () {
  if (GROUP_IDS[group_id] && !document.getElementsByName(`isAccepted`)[0]) setTimeout(function () { window.location.reload(); }, 500);
}

if (!document.getElementById(`alertBox`)) return RELOAD();

document.getElementById(document.getElementsByClassName(`message success`)[0] ? `alertboxMessage` : `alertboxHeader`).insertAdjacentHTML(
  `beforebegin`,
  `<span style="float: right">` +
  `  <label><b>Auto Reload If No HIT?</b> <input id="auto_reload" type="checkbox" ${GROUP_IDS[group_id] ? `checked` : ``}></label>` +
  `</span>`
);

document.getElementById(`auto_reload`).addEventListener(`change`, function () {
  GROUP_IDS[group_id] = document.getElementById(`auto_reload`).checked;
  localStorage.setItem(`GROUP_IDS`, JSON.stringify(GROUP_IDS));

  RELOAD();
});

RELOAD();
