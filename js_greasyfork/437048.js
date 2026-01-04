// ==UserScript==
// @name         Galaxy Table ESXX
// @namespace    http://tampermonkey.net/
// @version      8.5.1
// @description  Fixes galaxy table since 8.5 update
// @author       Dopamine
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437048/Galaxy%20Table%20ESXX.user.js
// @updateURL https://update.greasyfork.org/scripts/437048/Galaxy%20Table%20ESXX.meta.js
// ==/UserScript==
class GalaxyTableESXX {

    static #enormousDebrisLowerSize = 1e6;
    static #imgInformationDebris = 'debris_1';
    static #galaxyRequestParams = 'action=fetchGalaxyContent&ajax=1';
    static #enormousDebrisColor = '#D43635';
    static #enormousDebrisBackground = 'rgba(0, 0, 0, .65)';
    static #selector = {
        DEBRIS_CELLS: '[rel^="debris"]',
        EXPEDITION_DEBRIS_PANE: '#expeditionDebris',
        PLAYER_PANES: '[rel^="player"]',
        MOON_DIVS: '.micromoon.moon_a.tooltipRight',
    };

    static #moonsData = new Map();

    static run() {
        GalaxyTableESXX.#reorderFlexColumns();
        GalaxyTableESXX.#readMoonData();
        // Workaround to init xhr request
        $('form[name="galaform"] .btn_blue')?.first()?.click();
        $(document).ajaxComplete((event, xhr, settings) => {
            if (!settings.url?.includes(GalaxyTableESXX.#galaxyRequestParams)) return;
            const response = JSON.parse(xhr.responseText);
            const planetDebrisData = GalaxyTableESXX.#getPlanetDebrisData(response);
            const expoDebrisData = GalaxyTableESXX.#getExpoDebrisData(response);
            const playerData = GalaxyTableESXX.#getPlayerData(response);
            GalaxyTableESXX.#rerenderPlanetDebris(planetDebrisData);
            GalaxyTableESXX.#rerenderExpoDebris(expoDebrisData);
            GalaxyTableESXX.#rerenderMoons();
            GalaxyTableESXX.#renderPlayerPositions(playerData);
        });
    }

    static #reorderFlexColumns() {
        GalaxyTableESXX.#addGlobalStyle(
            `
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(1) { order: 2; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(2) { order: 1; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(3) { order: 3; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(4) { order: 4; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(5) { order: 5; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(6) { order: 6; }
            .galaxyTable .galaxyRow.ctGalaxyHead.headBold :nth-child(7) { order: 7; }
            
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(1) { order: 1; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(2) { order: 3; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(3) { order: 2; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(4) { order: 4; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(5) { order: 5; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(6) { order: 6; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(7) { order: 7; }
            .galaxyTable .galaxyRow.ctContentRow[id^="galaxyRow"] > :nth-child(8) { order: 8; }
            `
        );
    }

    static #readMoonData() {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            [...this.responseXML.getElementsByTagName('moon')].forEach(moon => {
                GalaxyTableESXX.#moonsData.set(moon.id, moon.attributes.size.value);
            });
        };
        xhr.open('GET', `https://${location.host}/api/universe.xml`);
        xhr.responseType = 'document';
        xhr.send();
    }

    static #addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    static #getPlanetDebrisData = response => response.system.galaxyContent
        ?.filter(content => content.position !== 16 && content.planets?.some(GalaxyTableESXX.#isPlanetDebris))
        .map((content) => {
            const debris = content.planets.find(GalaxyTableESXX.#isPlanetDebris);
            const { metal, crystal } = debris.resources;
            return {
                position: content.position,
                resources: GalaxyTableESXX.#format([metal.amount, crystal.amount]),
                sum: metal.amount + crystal.amount,
            };
        })

    static #getExpoDebrisData = (response) => {
        const expoDebris = response.system.galaxyContent?.find(GalaxyTableESXX.#isExpoDebris);
        let expoDebrisData;
        if (expoDebris) {
            const { metal, crystal } = expoDebris.planets.resources;
            expoDebrisData = {
                resources: GalaxyTableESXX.#format([metal.amount, crystal.amount]),
                sum: metal.amount + crystal.amount,
            };
        }
        return expoDebrisData;
    }

    static #getPlayerData = response => response.system.galaxyContent
        ?.filter(GalaxyTableESXX.#isPlayerData)
        .map(content => ({
            playerId: content.player.playerId,
            position: content.player.highscorePositionPlayer,
        }));

    static #isPlayerData = content => content.player?.playerId ?? 99999 !== 99999;

    static #isExpoDebris = content => content.position === 16;

    static #isPlanetDebris = planet => planet?.imageInformation === GalaxyTableESXX.#imgInformationDebris;

    static #findAllDebrisCells = () => document.querySelectorAll(GalaxyTableESXX.#selector.DEBRIS_CELLS);

    static #findPane = () => document.querySelector(GalaxyTableESXX.#selector.EXPEDITION_DEBRIS_PANE);

    static #format = (debrisAmounts) => {
        const numberFormat = Intl.NumberFormat('en', { notation: 'compact' });
        return debrisAmounts.map(debrisInt => numberFormat.format(debrisInt));
    };

    static #rerenderPlanetDebris = (planetDebrisData) => {
        if (planetDebrisData?.length) {
            const debrisCells = GalaxyTableESXX.#findAllDebrisCells();
            planetDebrisData.forEach(debris => {
                const debrisCell = [...debrisCells].find(cell => cell.getAttribute('rel').endsWith(debris.position));
                GalaxyTableESXX.#rerenderCell(debrisCell, debris.resources, debris.sum);
            });
        }
    }

    static #rerenderExpoDebris = (expoDebrisData) => {
        if (expoDebrisData) {
            const pane = GalaxyTableESXX.#findPane();
            GalaxyTableESXX.#rerenderPane(pane, expoDebrisData.resources, expoDebrisData.sum);
        }
    }

    static #rerenderMoons = () => {
        const moonsDivs = document.querySelectorAll(GalaxyTableESXX.#selector.MOON_DIVS);
        moonsDivs.forEach(div => {
            const moonSize = parseInt(GalaxyTableESXX.#moonsData.get(div.dataset.moonId), 10) || 8944;
            const width = parseInt(moonSize / 8944 * 30, 10);
            div.style['background-size'] = `${width}px`;
        });
    }

    static #renderPlayerPositions = (playerData) => {
        if (playerData?.length) {
            const spans = document.querySelectorAll(GalaxyTableESXX.#selector.PLAYER_PANES);
            spans.forEach((span) => {
                const { position } = playerData.find(player => span.getAttribute('rel') === `player${player.playerId}`);
                if (position) {
                    const p = document.createElement('p');
                    p.innerHTML = position;
                    p.style['padding-left'] = '4px';
                    span.parentElement.insertAdjacentElement('beforeend', p);
                }
            });
        }
    }

    static #rerenderPane = (div, debris, sum) => {
        div.innerHTML = `<p>${debris[0]}</p><p>${debris[1]}</p>`;
        div.style['background'] = 'none';
        div.style['cursor'] = 'pointer';
        if (sum > GalaxyTableESXX.#enormousDebrisLowerSize) {
            GalaxyTableESXX.#styleAsEnormous(div);
        }
    };

    static #rerenderCell = (div, debris, sum) => {
        div.parentElement.style['text-decoration'] = 'none';
        const d = document.createElement('div');
        d.innerHTML = `<p>${debris[0]}</p><p>${debris[1]}</p>`;
        d.style['text-align'] = 'center';
        d.style['color'] = 'white';
        div.insertAdjacentElement('afterbegin', d);
        div.style['background'] = 'none';
        if (sum > GalaxyTableESXX.#enormousDebrisLowerSize) {
            GalaxyTableESXX.#styleAsEnormous(d);
        }
    };

    static #styleAsEnormous(div) {
        div.style['color'] = GalaxyTableESXX.#enormousDebrisColor;
        div.style['background'] = GalaxyTableESXX.#enormousDebrisBackground;
    }

}

GalaxyTableESXX.run();
