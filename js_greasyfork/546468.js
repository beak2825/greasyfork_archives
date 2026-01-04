// ==UserScript==
// @name         Neopets - Karla's Dice-A-Roo Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.2
// @description  Automatically plays dice-a-roo
// @author       Karla
// @match        *://*.neopets.com/games/dicearoo.phtml*
// @match        *://*.neopets.com/games/play_dicearoo.phtml*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546468/Neopets%20-%20Karla%27s%20Dice-A-Roo%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/546468/Neopets%20-%20Karla%27s%20Dice-A-Roo%20Autoplayer.meta.js
// ==/UserScript==

let jackpotStop = GM_getValue('jackpot_stop') || false;
let autoplay = GM_getValue('autoplay_dar') || false;

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

function mainLoop() {
    if (document.querySelector('[value="Lets Play! (Costs 5 NP)"]')) {
        document.querySelector('[value="Lets Play! (Costs 5 NP)"]').click();
    } else if (document.querySelector('[value="Play Dice-A-Roo"]')) {
        document.querySelector('[value="Play Dice-A-Roo"]').click();
    } else if (document.querySelector('[value="Roll Again"]')) {
        document.querySelector('[value="Roll Again"]').click();
    } else if (document.querySelector('[value="Play Again!"]')) {
        if (jackpotStop && document.querySelector('[bgcolor="#ffffcc"] b').textContent === 'JACKPOT!') {
            alert('JACKPOT! Stopped');
        } else {
            document.querySelector('[value="Play Again!"]').click();
        }
    } else if (document.querySelector('[value="Press Me"]')) {
        document.querySelector('[value="Press Me"]').click();
    }
}

(function() {
    'use strict';

    // Your code here...
    if (document.body.innerHTML.includes("Im SO BORED of Dice-A-Roo... let's play something else!")) {
        return;
    }
    if (document.querySelector('h1')?.innerHTML?.includes('Internal Server Error')) {
        setTimeout(function() { window.location.reload() }, 1000);
    }
    let timeout;
    const anchor = document.querySelector('.contentModuleHeader');
    const settingHTML = `
<div style="text-align: center">
  <div><b>-- Karla's Dice-A-Roo Autoplayer --</b></div>
  ${autoplay ? '<button style="margin-top: 10px">Stop</button>': `<div style="margin-top: 10px"><label>Stop on jackpot <input type="checkbox" /></label></div>
  <button style="margin-top: 10px">Start</button>`}
</div>
`
    const div = document.createElement('div');
    div.innerHTML = settingHTML;

    if (div.querySelector('input')) {
        div.querySelector('input').checked = jackpotStop;
        div.querySelector('input').addEventListener('change', function(event) {
            jackpotStop = event.target.checked;
            GM_setValue('jackpot_stop', jackpotStop);
        });
    }
    div.querySelector('button').addEventListener('click', function(event) {
        autoplay = !autoplay;
        GM_setValue('autoplay_dar', autoplay);
        event.target.value = autoplay ? 'Stop' : 'Start';
        if (autoplay) {
            setTimeout(function() { window.location.reload() }, 1000);
        } else {
            clearTimeout(timeout);
        }
    });

    anchor.parentNode.insertBefore(div, anchor.nextSibling);

    if (autoplay) {
        timeout = setTimeout(mainLoop, random_in_range(500, 1000));
        setTimeout(function() { window.location.reload() }, 5000);
    }
})();