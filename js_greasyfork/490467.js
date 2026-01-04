// ==UserScript==
// @name         Show Wordle stats while logged out
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Basic script to show Wordle stats while logged out
// @author       Bill Rockwood
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/490467/Show%20Wordle%20stats%20while%20logged%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/490467/Show%20Wordle%20stats%20while%20logged%20out.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cat = JSON.parse(localStorage.getItem("wordle-legacy-stats-ANON"));
    const {gamesWon, gamesPlayed, guesses, currentStreak, maxStreak} = cat;
    var styles = document.createElement("style");
    styles.innerHTML=`
      .entry p {
        margin-bottom: 8px;
      }
      .entry>div>div {
        margin-bottom: 8px;
        margin-left: 16px;
      }
       .wrapper {
         display: flex;
         justify-content: center;
       }
    `;
    var div = document.createElement('div');
    div.style.cssText = 'position: absolute; z-index: 999; bottom: 50px; right: 16px';
    document.body.appendChild(styles);
    document.body.appendChild(div);

    div.innerHTML =
    `<div class="entry">
      <div>
        <p><b>Games Played: </b>${gamesPlayed}</p>
        <p><b>Games Won: </b>${gamesWon} (${Math.round((100 * gamesWon)/gamesPlayed)}%)</p>
        <p><b>Guesses: </b></p>
        <div>
          <p><b>1: </b>${guesses[1]}</p>
          <p><b>2: </b>${guesses[2]}</p>
          <p><b>3: </b>${guesses[3]}</p>
          <p><b>4: </b>${guesses[4]}</p>
          <p><b>5: </b>${guesses[5]}</p>
          <p><b>6: </b>${guesses[6]}</p>
          <p><b>Lost: </b>${guesses.fail}</p>
        </div>
        <p><b>Current Streak: </b>${currentStreak}</p>
        <p><b>Longest Streak: </b>${maxStreak}</p>
      </div>
    </div>`;
})();