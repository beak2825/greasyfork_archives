// ==UserScript==
// @name         [GC] - Tax Trophy Calculator
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/games/highscores/?game_id=23
// @match        https://www.grundos.cafe/games/highscores/?game_id=24
// @match        https://www.grundos.cafe/games/highscores/?game_id=25
// @match        https://www.grundos.cafe/games/highscores/?game_id=37
// @match        https://www.grundos.cafe/games/highscores/?game_id=38
// @version      86
// @license      MIT
// @description  Display minimum NP you should have on hand to be eligible for a trophy.
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/496521/%5BGC%5D%20-%20Tax%20Trophy%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/496521/%5BGC%5D%20-%20Tax%20Trophy%20Calculator.meta.js
// ==/UserScript==


if (!localStorage.getItem('scriptAlert-496521')) {
    alert("Tax Trophy Calculator script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-496521', 'true');
}