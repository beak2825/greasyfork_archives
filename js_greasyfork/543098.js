// ==UserScript==
// @name         Neopets - Karla's Neggsweeper Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.4
// @description  Auto plays neggsweeper, for Neopoints, trophy, and random events!
// @author       Karla
// @match        *://*.neopets.com/games/neggsweeper/neggsweeper.phtml*
// @homepage     https://neopointskarla.com
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543098/Neopets%20-%20Karla%27s%20Neggsweeper%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/543098/Neopets%20-%20Karla%27s%20Neggsweeper%20Autoplayer.meta.js
// ==/UserScript==

const random_in_range = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function getCombinations(arr, n) {
    const result = [];

    function helper(start, combo) {
        if (combo.length === n) {
            result.push([...combo]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            helper(i + 1, combo);
            combo.pop();
        }
    }

    helper(0, []);
    return result;
}

function buildGameboard() {
    const gameboard = [];
    const trs = document.querySelectorAll('[bgcolor="white"]');
    for (let i = 1; i < trs.length; i += 1) {
        const tr = trs[i];
        const tds = tr.querySelectorAll('td');
        const row = [];
        for (let j = 0; j < tds.length; j += 1) {
            if (tds[j].querySelector('img[src="//images.neopets.com/x/gn.gif"], img[src="//images.neopets.com/games/neggsweeper/old/badnegg.gif"]')) {
                row.push('?');
            } else if (tds[j].querySelector('img[src="//images.neopets.com/games/neggsweeper/old/flagnegg.gif"]')) {
                row.push('x');
            } else {
                row.push(tds[j].textContent.replace(/\xA0/g, '') || '0');
            }
        }
        gameboard.push(row);
    }
    for (let i = 0; i < gameboard.length; i += 1) {
        const row = gameboard[i];
        for (let j = 0; j < row.length; j += 1) {
            const item = row[j];
            if (item === 'x') {
                for (let x = 0; x < directions1.length; x += 1) {
                    if (/^\d+$/g.test(gameboard[i + directions1[x]]?.[j + directions2[x]])) {
                        gameboard[i + directions1[x]][j + directions2[x]] -= 1;
                    }
                }
            }
        }
    }
    return gameboard;
}

const directions1 = [-1, -1, -1, 0, 0, 1, 1, 1];
const directions2 = [-1, 0, 1, -1, 1, -1, 0, 1];

const totalMines = {
    9: 10,
    12: 25,
    14: 40
}

function scanGameboard(gameboard) {
    const globalPositions = [];
    for (let i = 0; i < gameboard.length; i += 1) {
        for (let j = 0; j < gameboard[i].length; j += 1) {
            if (gameboard[i][j] === '?') {
                globalPositions.push(`${i},${j}`);
            }
        }
    }
    // let minesLeft = totalMines[gameboard.length];
    let mineGroups = [];
    for (let i = 0; i < gameboard.length; i += 1) {
        const row = gameboard[i];
        for (let j = 0; j < row.length; j += 1) {
            const item = row[j];
            if (item !== '?' && item !== 'x' && item !== 'b' && item !== '0') {
                const count = Number(item);
                const arr = [count];
                for (let x = 0; x < directions1.length; x += 1) {
                    if (gameboard[i + directions1[x]]?.[j + directions2[x]] === '?') {
                        arr.push(`${i + directions1[x]},${j + directions2[x]}`);
                        const globalIndex = globalPositions.indexOf(`${i + directions1[x]},${j + directions2[x]}`);
                        if (globalIndex > -1) {
                            globalPositions.splice(globalIndex, 1);
                        }
                    }
                }
                if (arr.length > 1) {
                    mineGroups.push(arr);
                }
            }
        }
    }

    let pointer = 0;
    let changed = false;
    while (pointer < mineGroups.length) {
        mineGroups = mineGroups.filter(n => n.length > 1);
        const mineCell = mineGroups.find((mg) => mg.length - 1 === mg[0]);
        if (mineCell) {
            return { pos: mineCell[1], mine: true };
        }

        const safeCell = mineGroups.find((mg) => mg[0] <= 0);
        if (safeCell) {
            return { pos: safeCell[1], mine: false };
        }

        const mineGroup = mineGroups[pointer];
        for (let i = mineGroups.length - 1; i >= 0; i -= 1) {
            if (i === pointer) {
                continue;
            }
            const otherMineGroup = mineGroups[i];

            if (
                mineGroup
                .slice(1)
                .reduce((acc, mg) => acc || otherMineGroup.indexOf(mg) > -1, false)
            ) {
                const unionCells = mineGroup.slice(1).filter((c) => otherMineGroup.indexOf(c) >= 0);
                const groupALeft = mineGroup.slice(1).filter(c => unionCells.indexOf(c) < 0);
                const groupBLeft = otherMineGroup.slice(1).filter(c => unionCells.indexOf(c) < 0);
                const mineSpaces = new Set(Array.from(new Set([...mineGroup.slice(1), ...otherMineGroup.slice(1)])).filter(c => unionCells.indexOf(c) < 0));
                const safeSpaces = new Set(Array.from(new Set([...mineGroup.slice(1), ...otherMineGroup.slice(1)])).filter(c => unionCells.indexOf(c) < 0));
                for (let x = groupALeft.length > 0 && groupBLeft.length > 0 ? 0 : 1; x <= Math.min(unionCells.length, mineGroup[0], otherMineGroup[0]); x += 1) {
                    const possibleMines = getCombinations(unionCells, x);
                    for (let y = 0; y < possibleMines.length; y += 1) {
                        const minesLeftInGroupA = mineGroup[0] - x;
                        const minesLeftInGroupB = otherMineGroup[0] - x;
                        if (minesLeftInGroupA > groupALeft.length || minesLeftInGroupB > groupBLeft.length) {
                            continue;
                        }
                        groupALeft.forEach(n => {
                            if (minesLeftInGroupA === 0) {
                                mineSpaces.delete(n)
                            } else if (minesLeftInGroupA === groupALeft.length) {
                                safeSpaces.delete(n);
                            } else {
                                mineSpaces.delete(n);
                                safeSpaces.delete(n);
                            }
                        });
                        groupBLeft.forEach(n => {
                            if (minesLeftInGroupB === 0) {
                                mineSpaces.delete(n)
                            } else if (minesLeftInGroupB === groupBLeft.length) {
                                safeSpaces.delete(n);
                            } else {
                                mineSpaces.delete(n);
                                safeSpaces.delete(n);
                            }
                        });
                    }
                }
                const mines = Array.from(mineSpaces);
                const safes = Array.from(safeSpaces);
                if (mines.length > 0) {
                    mineGroups.push([mines.length, ...mines]);
                }
                if (safes.length > 0) {
                    mineGroups.push([0, ...safes]);
                }
            }
        }
        pointer += 1;
    }

    if (globalPositions.length > 0) {
        shuffle(globalPositions);
        return { pos: globalPositions[0], mine: false };
    }
    const bestChancePositions = mineGroups.reduce((acc, n) => n[0] / (n.length - 1) < acc[0] / (acc.length - 1) ? n : acc);
    return { pos: bestChancePositions[1], mine: false };
}

(function() {
    'use strict';

    // Your code here...
    let autoplaying = GM_getValue('status');
    let loseCounter = GM_getValue('lose') || 0;
    let winCounter = GM_getValue('win') || 0;
    let difficulty = GM_getValue('difficulty') || 3;
    let delay = GM_getValue('delay') || 1000;

    const section = document.querySelector('[action="neggsweeper.phtml"] [style="padding:7px;"]');
    const controlPanel = document.createElement('div');
    controlPanel.innerHTML = `<div>Autoplayer</div>
    <button id="start" style="margin-top: 10px;">${autoplaying ? 'Stop' : 'Start'}</button><button id="reset">Reset</button>
    <div>
    <select id="difficulty"><option value="1">Easy</option><option value="2">Medium</option><option value="3">Hard</option></select>
    <label title="don't set this too low">Click Delay (ms)<input value="${delay}" type="number" /></label>
    </div>
    <div>Win ${winCounter}</div>
    <div>Lose ${loseCounter}</div>`;
    section.prepend(controlPanel);
    controlPanel.querySelector('#start').addEventListener('click', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        if (autoplaying) {
            evt.currentTarget.innerText = 'Start';
            GM_setValue('status', false);
            autoplaying = false;
        } else {
            evt.currentTarget.innerText = 'Stop';
            GM_setValue('status', true);
            autoplaying = true;
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });
    controlPanel.querySelector('#reset').addEventListener('click', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        GM_setValue('lose', 0);
        GM_setValue('win', 0);
    });
    controlPanel.querySelector('select').selectedIndex = difficulty - 1;
    controlPanel.querySelector('select').addEventListener('change', function (evt) {
        difficulty = Number(evt.target.value);
        GM_setValue('difficulty', difficulty);
    });
    controlPanel.querySelector('input').addEventListener('change', function (evt) {
        delay = Number(evt.target.value);
        GM_setValue('delay', delay);
    });

    try {
        if (document.querySelector('[name="game_level"]')) {
            if (document.querySelector('[action="neggsweeper.phtml"]').innerText.includes('You Lose!!!')) {
                GM_setValue('lose', Number(loseCounter) + 1);
            } else {
                GM_setValue('win', Number(winCounter) + 1);
            }
            document.querySelector('[name="game_level"]').selectedIndex = difficulty || 3;

            setTimeout(() => {
                document.querySelector('[value="Play Again!!!"]').click();
            }, 300);
        } else if (document.querySelector('[src="//images.neopets.com/x/gn.gif"]') && autoplaying) {
            const gameboard = buildGameboard();
            const { pos, mine } = scanGameboard(gameboard);
            const [x, y] = pos.split(',');

            document.querySelectorAll('[bgcolor="white"]')[+x + 1].querySelectorAll('td')[y].style.border = mine ? '3px solid red' : '3px solid green';

            setTimeout(() => {
                do_move(`${y}-${x}`, { ctrlKey: mine });
            }, random_in_range(delay, delay + 500));
        } else if (document.querySelector('body').innerText.includes('Internal Server Error')) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (e) {
        console.log(e);
    }
})();
