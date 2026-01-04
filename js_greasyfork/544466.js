// ==UserScript==
// @name         Torn - Quick Vault (Ghost Trade)
// @namespace    quick.vault
// @version      0.1
// @description  Adds a button below your name that will vault all of your on-hand cash when clicked, and plays a ding sound effect when your life decreases. 
// @author       Baccy / mitza
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544466/Torn%20-%20Quick%20Vault%20%28Ghost%20Trade%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544466/Torn%20-%20Quick%20Vault%20%28Ghost%20Trade%29.meta.js
// ==/UserScript==

/*
PARTS OF SCRIPT COPIED FROM MITZA'S GHOST TRADE AUTO DESPOIT SCRIPT
https://gist.githubusercontent.com/mitza0505/f400d1c33df959a9d31c8597a54f4e86/raw/8436ea3f6bf565347fb255cedca8ca061352bf83/bank.js
*/

(function() {
    'use strict';



    GM_addStyle(`

.quick-btn-restyled {
    color: #f0f0f0; /* Light gray text */
    background-color: #1e1e1e; /* Dark gray background */
    border: 1px solid #333; /* Subtle border */
    border-radius: 8px; /* Soft rounded corners */
    padding: 25px 0px;
    font-size: 30px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    box-sizing: border-box;
    width: 150px;
    margin: auto;
    position: relative;
    line-height: 16px;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.quick-btn-restyled:hover {
    background-color: #2a2a2a;
    border-color: #444;
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.quick-btn-restyled:active {
    background-color: #111;
    transform: scale(0.98);
}


`);

    let audioContext = null;

    function playDing() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    }

    let lifeWatcherEnabled = false;

    function lifeWatcher() {
        const elem = document.querySelector(`[class="bar___Bv5Ho life___PlnzK bar-desktop___p5Cas"]`).children[1].children[1];
        let previousLife = parseFloat(elem.style.width);

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                const newLife = parseFloat(elem.style.width);
                if (newLife < previousLife) playDing();
                previousLife = newLife;
            }
        };

        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(callback);
        observer.observe(elem, config);
    }

    let bankAllButton = null;

    function addButton() {
        if (document.querySelector('.duckwowow')) return;

        if (!lifeWatcherEnabled) {
            lifeWatcherEnabled = true;
            lifeWatcher();
        }

        const id = Array.from(document.querySelectorAll('a'))
        .map(a => a.href.match(/p=properties&ID=(\d+)/))
        .find(match => match)?.[1];
        if (!id || !/^\d+$/.test(id)) return;

        const rfcv = getRFC();
        if (!rfcv) return;

        let container = document.querySelector('[class*="point-block"]');
        if(!container) container = document.querySelector(`[class="points-mobile___gpalH"]`).children[0];
        bankAllButton = document.createElement("button");
        bankAllButton.className = "quick-btn-restyled duckwowow";
        bankAllButton.innerHTML = "<strong>&emsp;Bank&emsp;</strong>";
        bankAllButton.style = "top: 3px";
        bankAllButton.style = "display:block";
        bankAllButton.id="customTradeBtn";
        bankAllButton.addEventListener('click', () => {
            const deposit = document.querySelector('#user-money').getAttribute('data-money');
            if (!deposit || deposit === '0') return;

            fetch(`https://www.torn.com/properties.php?rfcv=${rfcv}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: `step=vaultProperty&deposit=${deposit}&ID=${id}`
            })
                .then(response => response.json())
                .then(data => {
                console.log(data);
            });
        });

        container.parentElement.insertBefore(bankAllButton, container);
    }

    function getRFC() {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].split("=");
            if (name === "rfc_v") {
                return value;
            }
        }
        return null;
    }


    const observer = new MutationObserver(() => {
        if (window.location.href.includes("tab=vault") && document.querySelector(`[class="bar___Bv5Ho life___PlnzK bar-desktop___p5Cas"]`)) addButton();
        if (bankAllButton && document.querySelector('.vault-opt')?.style.display === 'none') bankAllButton.style.display = 'none';
        else if (bankAllButton && document.querySelector('.vault-opt')?.style.display !== 'none') bankAllButton.style.display = 'block';
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.href.includes("tab=vault") && document.querySelector(`[class="bar___Bv5Ho life___PlnzK bar-desktop___p5Cas"]`)) addButton();
})();