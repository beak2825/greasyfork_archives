// ==UserScript==
// @name         Neopets - Karla's Kiss The Mortog Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.2
// @description  Automatically plays kiss the mortog
// @author       Karla
// @match        *://*.neopets.com/medieval/kissthemortog.phtml*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/547695/Neopets%20-%20Karla%27s%20Kiss%20The%20Mortog%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/547695/Neopets%20-%20Karla%27s%20Kiss%20The%20Mortog%20Autoplayer.meta.js
// ==/UserScript==

let playing = GM_getValue('playing_ktm') || false;
let target = GM_getValue('target_ktm') || '100';
let timeout;

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

function loop() {
    timeout = setTimeout(function() {
        if (document.querySelector('[href^="process_kissthemortog.phtml"]')) {
            const anchors = document.querySelectorAll('[href^="process_kissthemortog.phtml"]');
            anchors[random_in_range(0, anchors.length - 1)].click();
        } else if (document.querySelector('[value^="Collect Your Winnings"]')) {
            const currentScore = document.querySelector('[value^="Collect Your Winnings"]').value.replace(/[^0-9]+/g, '');
            if (Number(currentScore) >= Number(target)) {
                document.querySelector('[value^="Collect Your Winnings"]').click();
            } else {
                document.querySelector('[value="Continue"]').click();
            }
        } else if (document.querySelector('[value="Leave this place"]')) {
            document.querySelector('[value="Try again..."]').click();
        }

    }, random_in_range(1200, 1800));
}

(function() {
    'use strict';

    // Your code here...
    try {
        const anchor = Array.from(document.querySelectorAll('p b')).find((n) => n.textContent = 'Select your Mortog : ')?.parentNode
        || document.querySelector('center')
        || Array.from(document.querySelectorAll('b')).find((n) => n.textContent === 'Uh oh...')
        ;

        const section = document.createElement('div');
        section.style.textAlign = 'center';
        section.style.margin = '10px';
        section.innerHTML = `
        <div style="margin-bottom: 10px">-- Kiss the Mortog Autoplayer --</div>
        <label>Stop at score <select>
          <option value="100">100</option>
          <option value="300">300</option>
          <option value="1150">1150</option>
          <option value="5900">5900</option>
          <option value="35000">35000 (staff review)</option>
          <option value="250000">250000 (staff review)</option>
          <option value="2000000">2000000 (staff review)</option>
          <option value="18000000">18000000 (staff review)</option>
        </select>
        </label>
        <button>${playing ? 'Stop' : 'Start'}</button>
        `;
        anchor.after(section);
        section.querySelector('button').addEventListener('click', function(event) {
            playing = !playing;
            section.querySelector('select').disabled = playing;
            event.target.innerHTML = playing ? 'Stop' : 'Start';
            if (!playing) {
                clearTimeout(timeout);
            } else {
                loop();
            }
            GM_setValue('playing_ktm', playing);
        });
        section.querySelector('select').value = target;
        section.querySelector('select').addEventListener('change', function(event) {
            target = event.target.value;
            GM_setValue('target_ktm', target);
        });
        section.querySelector('select').disabled = playing;
        if (playing) {
            loop();
        }
    } catch (e) {
        console.log(e);
    }
})();
