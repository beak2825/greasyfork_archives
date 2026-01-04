// ==UserScript==
// @name         Google Meet Auto Admit
// @namespace    https://naeembolchhi.github.io/
// @version      0.2
// @description  Automatically admit everyone trying to join your Google Meet session.
// @author       NaeemBolchhi
// @match        http*://meet.google.com/*
// @license      GPL-3.0-or-later
// @icon         data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" viewBox="0 0 300 300"><path d="m169.7 150 29.2 33.4 39.3 25.1 6.8-58.3-6.8-57-40.1 22.1-28.4 34.7z" fill=" %2300832d"/><path d="M0 203.1v49.7c0 11.4 9.2 20.6 20.6 20.6h49.7l10.3-37.6-10.3-32.7-34.1-10.3L0 203.1z" fill=" %230066da"/><path d="M70.3 26.6 0 96.9l36.2 10.3 34.1-10.3 10.1-32.3-10.1-38z" fill=" %23e94235"/><path d="M0 96.9h70.3v106.3H0V96.9z" fill=" %232684fc"/><path d="m283.2 56.3-44.9 36.8v115.4l45.1 37c6.7 5.3 16.6.5 16.6-8.1V64.3c0-8.7-10.1-13.5-16.8-8zM169.7 150v53.1H70.3v70.3h147.4c11.4 0 20.6-9.2 20.6-20.6v-44.3L169.7 150z" fill=" %2300ac47"/><path d="M217.7 26.6H70.3v70.3h99.4V150l68.6-56.8v-46c0-11.4-9.2-20.6-20.6-20.6z" fill=" %23ffba00"/></svg>
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520857/Google%20Meet%20Auto%20Admit.user.js
// @updateURL https://update.greasyfork.org/scripts/520857/Google%20Meet%20Auto%20Admit.meta.js
// ==/UserScript==

function admitall() {
  let allSpan = document.querySelectorAll('button > span');

  for (let x = 0; x < allSpan.length; x++) {
    if (allSpan[x].textContent.match(/^admit$/i)) {
      allSpan[x].parentNode.click();
    }
  }
}

setInterval(admitall, 1000);