// ==UserScript==
// @name         Display Wordle Stats
// @namespace    http://tampermonkey.net/
// @version      2024-05-08
// @description  Shows the worlde stats without needing an NYT account.
// @author       int
// @match        *://www.nytimes.com/games/wordle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com/games/wordle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493893/Display%20Wordle%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/493893/Display%20Wordle%20Stats.meta.js
// ==/UserScript==
setTimeout(function() {
    (function() {
        'use strict';
        var total;
        var amount;
        function myFunction(item, index) {
            if(index<6){
                total += (index+1)*item;
                amount += item;
            }
        }
        function displayStats(){
            if(document.getElementById('jsonDisplay')) document.getElementById('jsonDisplay').remove();
            const divElement = document.createElement('div');
            divElement.setAttribute('id', 'jsonDisplay');
            document.getElementById("wordle-app-game").appendChild(divElement);
            const jsonString = JSON.stringify(JSON.parse(localStorage.getItem("wordle-legacy-stats-ANON")), null, 2);
            if(localStorage.getItem("nyt-wordle-darkmode")=="true" ){
                document.getElementById('jsonDisplay').style.color = "white";
            }
            // Display JSON in the div element
            document.getElementById('jsonDisplay').innerText = 'Games Played: ' + JSON.parse(jsonString).gamesPlayed + '\n';
            document.getElementById('jsonDisplay').innerText += 'Games Won: ' + JSON.parse(jsonString).gamesWon + '\n';
            document.getElementById('jsonDisplay').innerText += 'Current Streak: ' + JSON.parse(jsonString).currentStreak + (JSON.parse(jsonString).currentStreak>0 ? '🔥' : '😢') + '\n';
            document.getElementById('jsonDisplay').innerText += 'Max Streak: ' + JSON.parse(jsonString).maxStreak + '\n';
            const guesses = Object.values(JSON.parse(jsonString).guesses);
            total = 0;
            amount = 0;
            guesses.forEach(myFunction);
            document.getElementById('jsonDisplay').innerText += 'Average Guesses: ' + total/amount + '\n';
            document.getElementById('jsonDisplay').innerText += 'Win Percentage: ' + JSON.parse(jsonString).gamesWon/JSON.parse(jsonString).gamesPlayed*100 + '%\n';
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guesses Graph</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <canvas id="guessesChart" width="400" height="200"></canvas>
  <script>
    const data = ` + jsonString + `

    const guessesData = Object.values(data.guesses);

    const ctx = document.getElementById('guessesChart').getContext('2d');
    const guessesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data.guesses),
        datasets: [{
          label: 'Guesses',
          data: guessesData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  </script>
</body>
</html>
`;
        const iframe = document.createElement('iframe');
        iframe.id = 'frame'
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        document.getElementById('jsonDisplay').appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(htmlContent);
        iframe.contentWindow.document.close();
        window.dispatchEvent(new Event('resize'));
    }
    if(inIframe()) return;
    var x = document.createElement("BUTTON");
    var t = document.createTextNode("Display Stats");
    x.appendChild(t);
    x.onclick = displayStats;
    x.className = "statsButton";
    x.style="z-index: 99 !important; " + `    --inter-ad-skip-button-height: 52px;
    --inter-ad-top-bar-height: 34px;
    --inter-ad-bottom-bar-height: 24px;
    --green: #6aaa64;
    --green-4: #538d4e;
    --beta-blue: #4f85e5;
    --wordle-high-contrast-green: #58a351;
    --spellingBeeYellow: #f7da21;
    --miniCrosswordBlue: #95befa;
    --connectionsPeriwinkle: #b4a8ff;
    --sudoku-orange: #fb9b00;
    --tiles-green: #b5e352;
    --dailyCrosswordBlue: #6493e6;
    --yellow-3: #c9b458;
    --yellow-4: #b59f3b;
    --newsGray-10: #dfdfdf;
    --newsGray-100: #121212;
    --newsGray-85: #363636;
    --gray-3: #ccc;
    --gray-4: #dcdcdc;
    --gray-6: #f4f4f4;
    --gray-13: #d3d6da;
    --gray-18: #787c7e;
    --gray-19: #878a8c;
    --gray-20: #edeff1;
    --gray-21: #f6f7f8;
    --gray-22: #e3e3e1;
    --gray-23: #a6a6a6;
    --gray-24: #818384;
    --gray-25: #565758;
    --gray-26: #3a3a3c;
    --gray-27: #424242;
    --gray-28: #59595a;
    --gray-29: #afafaf;
    --black: #000;
    --white: #fff;
    --newsDarkContentPrimary: #f8f8f8;
    --wordleBlack: #212121;
    --wordleBlack-2: #272729;
    --wordleBlack-3: #1a1a1b;
    --wordleBlack-4: #121213;
    --wordleBlack-5: #2f2f31;
    --linkBlue: #346eb7;
    --linkDarkBlue: #6ba1dd;
    --orange: #f5793a;
    --blue: #85c0f9;
    --outlineBlue: #2671dc;
    --svg-arrow-fill: var(--white);
    --svg-arrow-stroke: var(--black);
    --svg-arrow-fill-hover: var(--black);
    --svg-arrow-stroke-hover: var(--white);
    --color-tone-1: var(--black);
    --color-tone-2: var(--gray-18);
    --color-tone-3: var(--gray-19);
    --color-tone-4: var(--gray-13);
    --color-tone-5: var(--gray-20);
    --color-tone-6: var(--gray-21);
    --color-tone-7: var(--white);
    --color-tone-8: var(--newsGray-100);
    --color-tone-9: var(--newsGray-10);
    --color-tone-10: var(--black);
    --color-tone-11: var(--gray-18);
    --color-tone-12: var(--newsGray-85);
    --color-nav-hover: var(--gray-6);
    --opacity-50: rgba(255, 255, 255, 0.5);
    --error-background: var(--gray-22);
    --icon-disabled: var(--gray-23);
    --background-gray: var(--gray-29);
    --inline-links: var(--linkBlue);
    --warning-red: #d0021b;
    --color-background: var(--color-tone-7);
    --color-present: var(--yellow-3);
    --color-correct: var(--green);
    --color-absent: var(--color-tone-2);
    --tile-text-color: var(--color-tone-7);
    --key-text-color: var(--color-tone-1);
    --key-bg: var(--color-tone-4);
    --key-bg-present: var(--color-present);
    --key-bg-correct: var(--color-correct);
    --key-bg-absent: var(--color-absent);
    --key-evaluated-text-color: var(--color-tone-7);
    --key-evaluated-text-color-absent: var(--white);
    --modal-content-bg: var(--color-tone-7);
    --outline-focus: var(--outlineBlue);
    --color-correct-high-contrast: var(--wordle-high-contrast-green);
    --keyboard-height: 200px;
    --game-max-width: 500px;
    --error-z-index: 500;
    --toast-z-index: 1000;
    --modal-z-index: 2000;
    --page-z-index: 3000;
    --system-toast-z-index: 4000;
    --horizontal-warning-z-index: 5000;
    --spelling-bee: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/SpellingBee-Icon-Normalized.svg");
    --daily: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Crossword-Icon-Normalized.svg");
    --mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Mini-Icon-Normalized.svg");
    --tiles: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Tiles-Icon-Normalized.svg");
    --sudoku: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Sudoku-Icon-Normalized.svg");
    --vertex: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Vertex-Icon-Normalized.svg");
    --letter-boxed: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/LetterBoxed-Icon-Normalized.svg");
    --strands: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Strands-Icon-Normalized.svg");
    --connections: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Connections-Icon.svg");
    --nyt: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/NYT-Icon-Normalized.svg");
    --wirecutter: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Wirecutter-Icon-Normalized.svg");
    --cooking: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Cooking-Icon-Normalized.svg");
    --athletic: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/Athletic-Icon-Normalized.svg");
    --stats-auth: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/stats-auth-cta.svg");
    --wordlebot: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/WordleBot-Icon-Normalized.svg");
    --wordlebot-walking-icon: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/WordleBot-Walking-Icon-Normalized.svg");
    --wordle-icon: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/wordle-icon.svg");
    --wordle-star: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/wordle-green-star.svg");
    --wordle-progress-1: url("https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_progress_1.svg");
    --wordle-progress-2: url("https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_progress_2.svg");
    --wordle-progress-3: url("https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_progress_3.svg");
    --wordle-progress-4: url("https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_progress_4.svg");
    --wordle-progress-5: url("https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_progress_5.svg");
    --gameslogo: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/gameslogo.svg");
    --stats-problem: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/transparent-wordle-issue.svg");
    --link-info: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/transparent-wordle-link.svg");
    --badge-confirm: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-badge-confirm.svg");
    --badge-fail: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-badge-fail.svg");
    --large-stats: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-large-stats.svg");
    --wordle-sb-mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-sb.svg");
    --wordle-share-mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-share.svg");
    --wordle-stats-confirm-mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-stats-confirm.svg");
    --wordle-stats-loaded-mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-stats-loaded.svg");
    --wordle-stats-mini: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-stats.svg");
    --wordle-stats-mini-check: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-mini-stats-check.svg");
    --wordlebot-walking: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/WordleBot-walking.svg");
    --nyt-logo: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/nyt-logo.svg");
    --hybrid-back: url("https://www.nytimes.com/games-assets/v2/assets/hybrid-back-light-mode.svg");
    --hybrid-back-dark-mode: url("https://www.nytimes.com/games-assets/v2/assets/hybrid-back-dark-mode.svg");
    --icon-rotate-wordle: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/icon-rotate-wordle.svg");
    --california-privacy-icon: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/california-privacy-default.svg");
    --connections-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Connections-Icon-np.svg");
    --spelling-bee-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Spelling-Bee-Icon-np.svg");
    --mini-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Mini-Icon-np.svg");
    --sudoku-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Sudoku-Icon-np.svg");
    --tiles-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Tiles-Icon-np.svg");
    --daily-np: url("https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Crossword-Icon-np.svg");
    --promo-icon-height: 40px;
    --promo-icon-width: 40px;
    --promo-icon-padding: 0px;
    --spelling-bee-promo: url("https://www.nytimes.com/games-assets/v2/assets/wordle/nav-icons/SpellingBee-Icon-Normalized.svg");
    --header-height: 65px;
    --header-padding-x: 20px;
    -webkit-font-smoothing: antialiased;
    align-items: center;
    cursor: pointer !important;
    overflow: visible;
    text-transform: none;
    -webkit-appearance: button;
    position: relative;
    border: none;
    height: 3em;
    border-radius: 1.5em;
    align-content: center;
    letter-spacing: .05em;
    font-size: 16px;
    font-family: "nyt-franklin";
    line-height: 28px;
    padding: 0 2em;
    background: #000;
    color: #fff;
    margin: 0 10px 8px;
    font-weight: 400;
    width: 180px;`;
    x.style.position = "relative";
    x.style.left = "5%";
    x.style.top = "1%";
    document.body.appendChild(x);
})();
}, 2000);
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}