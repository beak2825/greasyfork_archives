// ==UserScript==
// @name        gog-games.to buttons on GOG game page
// @namespace   https://cbass92.org
// @match       https://www.gog.com/en/game/*
// @grant       none
// @version     1.01
// @author      Cbass92
// @description Yo ho ho and a bottle of rum matey
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510485/gog-gamesto%20buttons%20on%20GOG%20game%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/510485/gog-gamesto%20buttons%20on%20GOG%20game%20page.meta.js
// ==/UserScript==
var parts = window.location.href.split('/');
var lastSegment = parts.pop() || parts.pop();
const button = document.createElement('button');
button.classList.add('button', 'button--big', 'buy-now-button');
button.onclick = function() {window.location.href = 'https://gog-games.to/game/' + lastSegment;};
button.textContent = 'Get on gog-games.to';
document.querySelector('[main-button-decider]').appendChild(button);