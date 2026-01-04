// ==UserScript==
// @name         Quick Open FFA and TDMs Diep.io Lobby
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opens ffa and tdm links based on lobby data.  (12 Tabs)
// @author       Discord: anuryx. (Github: XyrenTheCoder)
// @match        https://dieplobbypicker.io/
// @match        *://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543184/Quick%20Open%20FFA%20and%20TDMs%20Diepio%20Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/543184/Quick%20Open%20FFA%20and%20TDMs%20Diepio%20Lobby.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ffalinks = [];
    let tdm2links = [];
    let tdm4links = [];

    fetch('https://lb.diep.io/api/lb/pc')
        .then(response => response.json())
        .then(data => {
            // Process fetched data
            data.regions.forEach(region => {
                region.lobbies.forEach(lobby => {
                    const baseUrl = `https://diep.io/?lobby=${region.region}_${lobby.gamemode}_${lobby.ip}`;
                    if (lobby.gamemode === "ffa") {
                        ffalinks.push(baseUrl);
                    } else if (lobby.gamemode === "teams") {
                        tdm2links.push(baseUrl);
                    } else if (lobby.gamemode === "4teams") {
                        tdm4links.push(baseUrl);
                    }
                });
            });

            createButtons();
        })
        .catch(error => console.error('Error fetching lobby data:', error));

    function createButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.padding = '10px';
        container.style.zIndex = 1000;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.backgroundColor = '#061017';
        container.style.border = '1px solid #696969';

        const ffaButton = document.createElement('button');
        ffaButton.innerText = 'Open FFA Links';
        ffaButton.style.padding = '10px';
        ffaButton.style.backgroundColor = 'black';
        ffaButton.style.color = 'white';
        ffaButton.style.border = '1px solid blue';
        ffaButton.style.borderRadius = '5px';
        ffaButton.style.cursor = 'pointer';

        ffaButton.onclick = function() {
            ffalinks.forEach((link, index) => {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, index * 100);
            });
        };

        const tdm2Button = document.createElement('button');
        tdm2Button.innerText = 'Open 2TDM Links';
        tdm2Button.style.padding = '10px';
        tdm2Button.style.backgroundColor = 'black';
        tdm2Button.style.color = 'white';
        tdm2Button.style.border = '1px solid green';
        tdm2Button.style.borderRadius = '5px';
        tdm2Button.style.cursor = 'pointer';

        tdm2Button.onclick = function() {
            tdm2links.forEach((link, index) => {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, index * 100);
            });
        };

        const tdm4Button = document.createElement('button');
        tdm4Button.innerText = 'Open 4TDM Links';
        tdm4Button.style.padding = '10px';
        tdm4Button.style.backgroundColor = 'black';
        tdm4Button.style.color = 'white';
        tdm4Button.style.border = '1px solid red';
        tdm4Button.style.borderRadius = '5px';
        tdm4Button.style.cursor = 'pointer';

        tdm4Button.onclick = function() {
            tdm4links.forEach((link, index) => {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, index * 100);
            });
        };

        container.appendChild(ffaButton);
        container.appendChild(tdm2Button);
        container.appendChild(tdm4Button);
        document.body.appendChild(container);
    }
})();
