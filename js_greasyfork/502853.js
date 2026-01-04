// ==UserScript==
// @name        Keno Race
// @namespace   Violentmonkey Scripts
// @match       https://stake*/*
// @grant       none
// @version     2.0
// @author      ConnorMcLeod
// @description 07/08/2024 14:00:00
// @license		MIT
// @downloadURL https://update.greasyfork.org/scripts/502853/Keno%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/502853/Keno%20Race.meta.js
// ==/UserScript==

let lastTextArea = null;

setInterval(function() {
    let textarea = document.querySelector("#right-sidebar > div > div.footer.svelte-1g9csv6 > div.chat-input.svelte-15zhun5 > div > textarea");
    if (textarea && textarea !== lastTextArea) {
        textarea.onkeyup = null;
        lastTextArea = textarea;
        textarea.onkeyup = (() => {
            if (location.href.includes('/casino/games/keno') && textarea.value.toLowerCase().startsWith("/race")) {
                textarea.value = "";
                createBtn();
            }
        });
    }
}, 200);

function createBtn() {
    const btnTest = document.querySelector('button[ninouche="keno-race"]');
    if (btnTest) {
        btnTest.remove();
    } else {
        let gameSideBars = document.getElementsByClassName("game-sidebar");
        if (gameSideBars.length) {
            const gameSideBar = gameSideBars[0];
            const btn = Array.from(gameSideBar.getElementsByTagName('button')).at(-2).cloneNode(true);
            btn.setAttribute('ninouche', 'keno-race');
            btn.textContent = "Keno Race";
            btn.onclick = initKeno;
            gameSideBar.appendChild(btn);
        }
    }
}

let betButton = null;
let observers = [];
let szWinner = "";

function initKeno() {
    this.remove();
	szWinner = "";
    document.querySelector('button[data-testid="clear-table-button"]').click();
    let names = [];
    do {
        szInput = prompt('Vérifie le montant du bet et tape les noms des joueurs (entre 2 et 5) séparés par des espaces\n\nNe rien écrire pour annuler');
        if (!szInput.trim().length) {
            return;
        }
        if (szInput.startsWith('Winners: ')) {
            szInput = szInput.slice('Winners: '.length);
        } else if (szInput.startsWith('Congratulations ')) {
            szInput = szInput.slice('Congratulations '.length);
            szInput = szInput.split('! You won the')[0];
        }
        szInput = szInput.replace(/\s\s/g, ' ');
        szInput = szInput.replace(/[@,]/g, '');
        names = szInput.split(' ');
    } while (names.length < 2 || names.length > 5);

    let tiles = Array.from(document.getElementsByClassName('tile'));
    let tilesNumbers = Array.from(document.getElementsByClassName('tile-number'));
    tilesNumbers.forEach((t, i) => {
        t.textContent = Math.floor(i / 2) + 1;
    });
    const startTilesDefault = [0, 8, 16, 24, 32];
    const startTiles = startTilesDefault.slice(0, names.length);
    const endTiles = [7, 15, 23, 31, 39];

    const covers = Array.from(document.getElementsByClassName('cover'));

    startTiles.forEach((e, i) => {
        covers[e].click();
        tilesNumbers[2 * e].textContent = names[i];
        tilesNumbers[2 * e + 1].textContent = names[i];
    });

    betButton = document.querySelector('button[data-test="bet-button"]');
	
	const onTileChange = function (mutationsList) {
		matchingTiles = tiles.filter(e => e.classList.contains('is-match') && endTiles.includes( parseInt(e.getAttribute('data-index') ) ));
		if (matchingTiles.length === 1) {
			szWinner = matchingTiles[0].children[2].textContent;
			observers.forEach(e => e.disconnect());
		}
	};

	const onButtonChange = function (mutationsList) {
		if (betButton.getAttribute("data-test-action-enabled") === 'true') {
			let bPrinted = false;
            if (endTiles.some((e) => tiles[e].classList.contains('is-match'))) {
				observer.disconnect();
				const speechSound = `Le gagnant est ${szWinner}`;
				const speechSoundSynthesis = new SpeechSynthesisUtterance(speechSound);
				speechSynthesis.speak(speechSoundSynthesis);
				alert(speechSound);
            } else {
                for (let l = 0; l < names.length; l++) {
                    for (let i = 0; i <= 6; i++) {
                        const index = l * 8 + i;
                        if (tiles[index].classList.contains('is-match')) {
                            tiles[index].click();
                            tilesNumbers[index * 2].textContent = index + 1;
                            tilesNumbers[index * 2 + 1].textContent = index + 1;

                            tiles[index + 1].click();
                            tilesNumbers[2 * (index + 1)].textContent = names[l];
                            tilesNumbers[2 * (index + 1) + 1].textContent = names[l];
							if (i === 6) {
								const obs = new MutationObserver(onTileChange);
								observers.push(obs);
								const config = { attributeFilter: ["class"] };
								obs.observe(tiles[index + 1], config);
							}
                            break;
                        }
                    }
                }

                betButton.click();
            }
        }
	};
	betButton.click();
	const observer = new MutationObserver(onButtonChange);
	const config = { attributeFilter: ["data-test-action-enabled"] };
	observer.observe(betButton, config);
}