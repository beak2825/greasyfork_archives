// ==UserScript==
// @name         2048 Script AutoWin
// @namespace    https://www.youtube.com/channel/UCgZDJZnndc9LNcVzhD85csw
// @version      1.0
// @description  This script gives you an instant victory in game 2048, and gives you an infinite score, it basically changes the gaming saved data, so whenever you restart the page it will restart the hacker
// @author       KramosHacks
// @match        https://play2048.co
// @icon         https://d30womf5coomej.cloudfront.net/ua/70/c4c0d733-10db-476d-818f-24c8ed5ad197.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427400/2048%20Script%20AutoWin.user.js
// @updateURL https://update.greasyfork.org/scripts/427400/2048%20Script%20AutoWin.meta.js
// ==/UserScript==

localStorage.setItem("gameState",'{"grid":{"size":4,"cells":[[{"position":{"x":0,"y":0},"value":2048},{"position":{"x":0,"y":1},"value":2048},{"position":{"x":0,"y":2},"value":2048},{"position":{"x":0,"y":3},"value":2048}],[{"position":{"x":1,"y":0},"value":2048},{"position":{"x":1,"y":1},"value":2048},{"position":{"x":1,"y":2},"value":2048},{"position":{"x":1,"y":3},"value":2048}],[{"position":{"x":2,"y":0},"value":2048},{"position":{"x":2,"y":1},"value":2048},{"position":{"x":2,"y":2},"value":2048},{"position":{"x":2,"y":3},"value":2048}],[{"position":{"x":3,"y":0},"value":2048},{"position":{"x":3,"y":1},"value":2048},{"position":{"x":3,"y":2},"value":2048},{"position":{"x":3,"y":3},"value":2048}]]},"score":"By:KramosHacks","over":false,"won":true,"keepPlaying":false}')
localStorage.setItem("bestScore",'0')