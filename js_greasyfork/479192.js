// ==UserScript==
// @name Travian Kingdoms Tools
// @description Travian Kingdoms Tools:  Recherche d'oasis et d'emplacements céréaliers
// @include https://*.kingdoms.com/*
// @version 1.0.1
// @license MIT
// @namespace https://github.com/Gabriel-VANROY
// @downloadURL https://update.greasyfork.org/scripts/479192/Travian%20Kingdoms%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/479192/Travian%20Kingdoms%20Tools.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    let session = undefined;
    let searching = false;

    (function(request) {
        XMLHttpRequest.prototype.send = function() {
            const argument = arguments[0];

            if (typeof argument === 'string' || argument instanceof String) {
                if (argument.includes('session')) {
                    session = JSON.parse(argument).session;
                }
            }

            request.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.send);

    setInterval(async () => {
        const node = document.querySelector('.travian-kingdoms-tools');

        if (window.location.href.includes('page:map')) {
            if (!node) {
                const { text, node, nodeOne, nodeTwo } = createFooter();

                node.addEventListener('click', async () => {
                    const timestamp = new Date();

                    if (searching) {
                        text.innerText = 'Lancer la recherche';
                        nodeOne.style.display = 'none';
                        nodeTwo.style.display = 'none';
                    } else {
                        text.innerText = 'Veuillez patienter un moment...';

                        const { valleys: mapValleys, oases: mapOases, names } = await processMap();
                        const { valleys: oasesValleys, oases } = await processOases(session, mapValleys, mapOases, names);
                        const valleys = await processValleys(oasesValleys, oases);

                        const { valleyTable, oasisTable } = createTables();
                        oases.map((oasis, index) => createRow(oasisTable, index + 1, createOasisContent(oasis)));
                        valleys.map((valley, index) => createRow(valleyTable, index + 1, createValleyContent(valley)));

                        text.innerText = `Recherche terminée en ${parseInt(((new Date() - timestamp) / 1000).toString())} secondes!`;
                        nodeOne.appendChild(valleyTable);
                        nodeTwo.appendChild(oasisTable);
                        nodeOne.style.display = 'block';
                        nodeTwo.style.display = 'block';
                    }

                    searching = !searching;
                });
            }
        } else {
            if (node) {
                node.remove();
                document.querySelector('.travian-kingdoms-tools-table-one').remove();
                document.querySelector('.travian-kingdoms-tools-table-two').remove();
            }
        }
    }, 1000);
})();

const processMap = async () => {
    const mapVillageId = /villId:(\d+)/.exec(window.location.toString());
    const { response: { privateApiKey } } = await (await fetch(`https://${window.location.hostname}/api/external.php?action=requestApiKey&email=email@example.com&siteName=Example&siteUrl=https://example.com&public=0`)).json();
    const { response: { map: { cells }, players } } = await (await fetch(`https://${window.location.hostname}/api/external.php?action=getMapData&privateApiKey=${privateApiKey}`)).json();
    const valleys = [];
    const oases = [];
    let villageX = 0;
    let villageY = 0;

    if (mapVillageId) {
        players.map(({ villages }) => {
            villages.map(({ villageId, x, y }) => {
                if (villageX === 0 && villageY === 0 && villageId === mapVillageId[1]) {
                    villageX = parseInt(x);
                    villageY = parseInt(y);
                }
            });
        });
    }

    const names = (await Promise.all(cells.map(async ({ id, x, y, resType, oasis }) => {
        if (['10', '11', '20', '21', '30', '31', '40', '41'].includes(oasis)) {
            oases.push({
                externalId: parseInt(id),
                type: parseInt(oasis),
                x: parseInt(x),
                y: parseInt(y),
                distance: parseInt(Math.sqrt(Math.pow(x - villageX, 2) + Math.pow(y - villageY, 2)).toString()),
                elephant: 0,
                tiger: 0,
                crocodile: 0,
                bear: 0,
                wolf: 0,
                boar: 0,
                bat: 0,
                snake: 0,
                spider: 0,
                rat: 0,
            });

            return `MapDetails:${id}`;
        }

        if (['11115', '3339'].includes(resType)) {
            valleys.push({
                externalId: parseInt(id),
                type: parseInt(resType),
                x: parseInt(x),
                y: parseInt(y),
                bonus: 0,
                distance: parseInt(Math.sqrt(Math.pow(x - villageX, 2) + Math.pow(y - villageY, 2)).toString()),
                occupied: false,
                oases: [],
            });

            return `MapDetails:${id}`;
        }
    }))).filter(content => content !== undefined);

    return { valleys, oases, names };
};

const processOases = async (session, valleys, oases, names) => {
    const maximum = 999;
    const { cache } = await (await fetch(`https://${window.location.hostname}/api/?c=cache&a=get`, {
        method: 'POST',
        body: JSON.stringify({ controller: 'cache', action: 'get', params: { names, session } }),
    })).json();

    cache.map(({ name, data: { isOasis, isHabitable, oasisStatus, hasVillage, hasNPC, troops: { units } = { units: {} } } }) => {
        const innerExternalId = parseInt(name.split(':')[1]);

        if (isHabitable) {
            const valley = valleys.filter(({ externalId }) => externalId === innerExternalId)[0];
            valley.occupied = parseInt(hasVillage) === 1 || parseInt(hasNPC) === 1;
        }

        if (isOasis && !['1'].includes(oasisStatus)) {
            const oasis = oases.filter(({ externalId }) => externalId === innerExternalId)[0];

            if (units[10]) {
                oasis.elephant = parseInt(units[10]);
                oasis.elephant = oasis.elephant > maximum ? maximum : oasis.elephant;
            }

            if (units[9]) {
                oasis.tiger = parseInt(units[9]);
                oasis.tiger = oasis.tiger > maximum ? maximum : oasis.tiger;
            }

            if (units[8]) {
                oasis.crocodile = parseInt(units[8]);
                oasis.crocodile = oasis.crocodile > maximum ? maximum : oasis.crocodile;
            }

            if (units[7]) {
                oasis.bear = parseInt(units[7]);
                oasis.bear = oasis.bear > maximum ? maximum : oasis.bear;
            }

            if (units[6]) {
                oasis.wolf = parseInt(units[6]);
                oasis.wolf = oasis.wolf > maximum ? maximum : oasis.wolf;
            }

            if (units[5]) {
                oasis.boar = parseInt(units[5]);
                oasis.boar = oasis.boar > maximum ? maximum : oasis.boar;
            }

            if (units[4]) {
                oasis.bat = parseInt(units[4]);
                oasis.bat = oasis.bat > maximum ? maximum : oasis.bat;
            }

            if (units[3]) {
                oasis.snake = parseInt(units[3]);
                oasis.snake = oasis.snake > maximum ? maximum : oasis.snake;
            }

            if (units[2]) {
                oasis.spider = parseInt(units[2]);
                oasis.spider = oasis.spider > maximum ? maximum : oasis.spider;
            }

            if (units[1]) {
                oasis.rat = parseInt(units[1]);
                oasis.rat = oasis.rat > maximum ? maximum : oasis.rat;
            }
        }
    });

    oases.sort((one, two) => {
        let sortation = undefined;

        ['elephant', 'tiger', 'crocodile', 'bear', 'wolf', 'boar', 'bat', 'snake', 'spider', 'rat'].map(animal => {
            if (one[animal] !== two[animal] && !sortation) {
                sortation = one[animal] > two[animal] ? -1 : 1;
            }
        });

        return sortation ? sortation : one.distance > two.distance ? 1 : -1;
    });

    return { valleys, oases };
};

const processValleys = (valleys, oases) => {
    const innerValleys = valleys.map(valley => {
        const bonuses = [];

        oases
            .filter(({ x, y }) => x > valley.x - 4 && x < valley.x + 4 && y > valley.y - 4 && y < valley.y + 4)
            .map(({ type }) => {
                switch (type) {
                    case 41:
                        bonuses.push(50);
                        break;
                    case 40:
                    case 31:
                    case 21:
                    case 11:
                        bonuses.push(25);
                        break;
                    default:
                        bonuses.push(0);
                        break;
                }

                valley.oases.push({ type });
            });

        bonuses.sort((one, two) => two - one);
        valley.oases.sort(({ type: oneType }, { type: twoType }) => {
            if ([41, 31, 21, 11].includes(twoType)) {
                return [41, 31, 21, 11].includes(oneType) ? twoType - oneType : 1;
            } else {
                return [41, 31, 21, 11].includes(oneType) ? -1 : twoType - oneType;
            }
        });

        return { ...valley, bonus: bonuses.slice(0, 3).reduce((accumulator, bonus) => accumulator + bonus, 0) };
    });

    innerValleys.sort((
        { type: oneType, bonus: oneBonus, distance: oneDistance, occupied: oneOccupied },
        { type: twoType, bonus: twoBonus, distance: twoDistance, occupied: twoOccupied },
        ) => {
            if (oneOccupied !== twoOccupied) {
                return oneOccupied - twoOccupied;
            } else {
                if (oneType !== twoType) {
                    return twoType - oneType;
                } else {
                    return oneBonus !== twoBonus ? twoBonus - oneBonus : oneDistance - twoDistance;
                }
            }
        },
    );

    return innerValleys;
};

const createFooter = () => {
    const body = document.querySelector('body');

    const text = document.createElement('div');
    text.innerText = 'Lancer la recherche';

    const node = document.createElement('div');
    node.style.position = 'fixed';
    node.style.bottom = '0';
    node.style.right = '0';
    node.style.left = '0';
    node.style.backgroundColor = '#000000';
    node.style.color = '#FFFFFF';
    node.style.lineHeight = '25px';
    node.style.textAlign = 'center';
    node.style.cursor = 'pointer';
    node.style.zIndex = '10000';
    node.classList.add('travian-kingdoms-tools');

    const nodeOne = document.createElement('div');
    nodeOne.style.display = 'none';
    nodeOne.style.float = 'left';
    nodeOne.style.width = '50%';
    nodeOne.style.position = 'fixed';
    nodeOne.style.bottom = '25px';
    nodeOne.style.right = '50%';
    nodeOne.style.left = '0';
    nodeOne.style.height = '279px';
    nodeOne.style.maxHeight = '279px';
    nodeOne.style.backgroundColor = '#000000';
    nodeOne.style.color = '#FFFFFF';
    nodeOne.style.lineHeight = '25px';
    nodeOne.style.textAlign = 'center';
    nodeOne.style.cursor = 'pointer';
    nodeOne.style.zIndex = '10000';
    nodeOne.style.border = '1px solid #000000';
    nodeOne.style.overflowY = 'scroll';
    nodeOne.classList.add('travian-kingdoms-tools-table-one');

    const nodeTwo = document.createElement('div');
    nodeTwo.style.display = 'none';
    nodeTwo.style.float = 'right';
    nodeTwo.style.width = '50%';
    nodeTwo.style.position = 'fixed';
    nodeTwo.style.bottom = '25px';
    nodeTwo.style.right = '0';
    nodeTwo.style.left = '50%';
    nodeTwo.style.height = '279px';
    nodeTwo.style.maxHeight = '279px';
    nodeTwo.style.backgroundColor = '#000000';
    nodeTwo.style.color = '#FFFFFF';
    nodeTwo.style.lineHeight = '25px';
    nodeTwo.style.textAlign = 'center';
    nodeTwo.style.cursor = 'pointer';
    nodeTwo.style.zIndex = '10000';
    nodeTwo.style.border = '1px solid #000000';
    nodeTwo.style.overflowY = 'scroll';
    nodeTwo.classList.add('travian-kingdoms-tools-table-two');

    node.appendChild(text);
    body.appendChild(node);
    body.appendChild(nodeOne);
    body.appendChild(nodeTwo);

    return { text, node, nodeOne, nodeTwo };
};

const createTables = () => {
    const valleyTable = document.createElement('table');
    valleyTable.style.color = '#000000';
    valleyTable.style.border = '0';
    valleyTable.style.cursor = 'default';

    const oasisTable = document.createElement('table');
    oasisTable.style.color = '#000000';
    oasisTable.style.border = '0';
    oasisTable.style.cursor = 'default';

    return { valleyTable, oasisTable };
};

const createRow = (table, contentOne, contentTwo) => {
    const row = table.insertRow();

    const cellOne = row.insertCell();
    cellOne.style.width = '25px';
    cellOne.style.borderRight = '1px solid #000000';
    cellOne.style.borderBottom = '1px solid #000000';
    cellOne.style.textAlign = 'center';
    cellOne.innerHTML = contentOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');

    const cellTwo = row.insertCell();
    cellTwo.style.height = '25px';
    cellTwo.style.borderRight = '1px solid #000000';
    cellTwo.style.borderBottom = '1px solid #000000';
    cellTwo.innerHTML = contentTwo;
};

const createValleyContent = ({ externalId, type, oases, bonus, distance, occupied }) => {
    const mapper = {
        41: { name: '50%', position: '-387px -132px', opacity: '1.0' },
        40: { name: '25%', position: '-387px -132px', opacity: '0.5' },
        31: { name: '25% + 25%', position: '-264px -360px', opacity: '1.0' },
        30: { name: '25%', position: '-264px -360px', opacity: '0.5' },
        21: { name: '25% + 25%', position: '-198px -360px', opacity: '1.0' },
        20: { name: '25%', position: '-198px -360px', opacity: '0.5' },
        11: { name: '25% + 25%', position: '-387px -88px', opacity: '1.0' },
        10: { name: '25%', position: '-387px -88px', opacity: '0.5' },
    };

    const content = oases.map(oasis => {
        const { name, position, opacity } = mapper[oasis.type];

        return `<div title='${name}' style='display: inline-block; width: 22px; height: 22px; margin: 0 auto; vertical-align: -4px; background-image: url("https://cdn.traviantools.net/game/0.95/layout/images/sprites/general.png"); background-position: ${position}; opacity: ${opacity}'></div>`;
    }).join('&nbsp');

    return `<a href="https://${window.location.hostname}/#/page:map/window:mapCellDetails/cellId:${externalId}/centerId:${externalId}" style="color: ${occupied ? '#FF0000' : '#008800'}">Le
            ${type.toString().padStart(5, '0').replace('111', '').replace('333', '')} CC</a> à
            ${distance.toString().padStart(3, '0')} cases de distance est à
            ${bonus.toString().padStart(3, '0')}% de bonus CC ${content}`;
};

const createOasisContent = oasis => {
    const { externalId, distance } = oasis;

    const content = [
        { key: 'elephant', value: 'Elephant', position: '-40px -80px' },
        { key: 'tiger', value: 'Tiger', position: '-20px -100px' },
        { key: 'crocodile', value: 'Crocodile', position: '0 -100px' },
        { key: 'bear', value: 'Bear', position: '-100px -80px' },
        { key: 'wolf', value: 'Wolf', position: '-100px -60px' },
        { key: 'boar', value: 'Boar', position: '-100px -40px' },
        { key: 'bat', value: 'Bat', position: '0 0' },
        { key: 'snake', value: 'Snake', position: '-100px 0' },
        { key: 'spider', value: 'Spider', position: '-80px -80px' },
        { key: 'rat', value: 'Rat', position: '-60px -80px' },
    ].map(({ key, value, position }) => oasis[key] ? `
        <div title='${value}' style='display: inline-block; width: 20px; height: 20px; margin: 0 auto; vertical-align: -4px; background-image: url("https://cdn.traviantools.net/game/0.95/layout/images/sprites/unit/small/unit/small.png"); background-position: ${position};'></div> x ${oasis[key].toString().padStart(3, '0')} ` : undefined,
    ).filter(content => content !== undefined).join('&nbsp;');

    return `<a href="https://${window.location.hostname}/#/page:map/window:mapCellDetails/cellId:${externalId}/centerId:${externalId}" style="color: ${content ? '#008800' : '#FF0000'}">L'oasis</a> à
        ${distance.toString().padStart(3, '0')} 
        cases de distance contient ${content ? `${content}` : ''}`;
};
