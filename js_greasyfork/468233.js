// ==UserScript==
// @name         CAI Token
// @namespace    http://tampermonkey.net/
// @version      1
// @description  shows the user's token in the account settings
// @author       kramcat
// @license MIT
// @match        https://beta.character.ai/settings*
// @icon         https://i.imgur.com/unIzTZO.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468233/CAI%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/468233/CAI%20Token.meta.js
// ==/UserScript==

const char_token = localStorage.getItem('char_token');
const token = JSON.parse(char_token).value;

const TokenText = document.createElement('p');

TokenText.textContent = token;

TokenText.style.position = "bottom";
TokenText.style.marginTop = '64px';
TokenText.style.color = 'rgb(159, 151, 136)';
TokenText.style.textAlign = "center";

document.body.appendChild(TokenText);