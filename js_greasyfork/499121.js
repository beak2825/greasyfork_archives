// ==UserScript==
// @name         Sudoku King
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Cheat for Sodoku.com
// @author       November2246
// @match        *://sudoku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sudoku.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/499121/Sudoku%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/499121/Sudoku%20King.meta.js
// ==/UserScript==

const console = window.console;
const log = (...args) => console.log('%c[👑 Sudoku King 👑]%c[Info]', 'background-color: #900aff; color: #FFFFFF; padding: 2px; border-radius: 4px;', 'background-color: #00a6ed; color: #FFFFFF; padding: 2px; border-radius: 6px; margin-left: 4px;', ...args);
const warn = (...args) => console.warn('%c[👑 Sudoku King 👑]%c[Warn]', 'background-color: #900aff; color: #FFFFFF; padding: 2px; border-radius: 4px;', 'background-color: #e7a333; color: #FFFFFF; padding: 2px; border-radius: 6px; margin-left: 4px;', ...args);
const error = (...args) => console.error('%c[👑 Sudoku King 👑]%c[Error]', 'background-color: #900aff; color: #FFFFFF; padding: 2px; border-radius: 4px;', 'background-color: #fc3a47; color: #FFFFFF; padding: 2px; border-radius: 6px; margin-left: 4px;', ...args);

const cheatKey = (Math.random() + 1).toString(36).substring(2);

const _create = Object.create;
Object.create = function create() {
    if (!arguments[0]) return {};
    return _create.apply(this, arguments);
}

Object.defineProperty(Object.prototype, 'store', {
    get() {
        return this._store;
    },
    set(v) {
        this._store = v;
        window.game = v;
    },
});

const utils = {
    getGame: () => {
        try {
            if (!window.game) {
                return warn('Failed to hook game...');
            }

            return game;
        } catch (err) {
            return error(err);
        }
    },
    updateGame: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "updateGame" without game object...');
        }

        try {
            game.actions.updateBoard(game, {
                type: 'select',
                value: game?.state?.selectedCell || 0,
            });
        } catch (err) {
            return error(err);
        }
    },
};

const cheats = {
    solveGame: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "solveGame" without game object...');
        }

        try {
            const oldNotesMode = game.state.notesMode;

            game.actions.updateBoard(game, {
                type: 'note',
                value: false,
            });

            game.state.currentGame.solution.forEach((x, i) => {
                if (!game.state.currentGame.values[i].editable || game.state.currentGame.values[i].val === x) return;

                game.actions.updateBoard(game, {
                    type: 'select',
                    value: i,
                });

                game.actions.updateBoard(game, {
                    type: 'value',
                    value: x,
                });
            });

            game.actions.updateBoard(game, {
                type: 'note',
                value: oldNotesMode,
            });
        } catch (err) {
            return error(err);
        }
    },
    noteSolution: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "noteSolution" without game object...');
        }

        try {
            game.state.currentGame.notes = [];
            game.state.currentGame.solution.forEach((x, i) => {
                if (!game.state.currentGame.values[i].editable || game.state.currentGame.values[i].val === x) return;
                game.state.currentGame.notes[i] = new Array(9).fill(undefined);
                game.state.currentGame.notes[i][x - 1] = x;
            });

            utils.updateGame();
        } catch (err) {
            return error(err);
        }
    },
    solveSelectedCell: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "solveSelectedCell" without game object...');
        }

        try {
            const currentCell = game.state.currentGame.values[game.state.selectedCell];
            const correctValue = game.state.currentGame.solution[game.state.selectedCell];

            if (!currentCell.editable) {
                return warn('Unable to solve selected cell, you must select a cell that is editable...');
            }

            if (currentCell.val === correctValue) {
                return warn('Unable to solve selected cell, this cell is already solved...');
            }

            const oldNotesMode = game.state.notesMode;

            game.actions.updateBoard(game, {
                type: 'note',
                value: false,
            });

            game.actions.updateBoard(game, {
                type: 'value',
                value: correctValue,
            });

            game.actions.updateBoard(game, {
                type: 'note',
                value: oldNotesMode,
            });
        } catch (err) {
            return error(err);
        }
    },
    removeMistakes: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "removeMistakes" without game object...');
        }

        try {
            game.state.currentGame.mistakes = 0;

            const mistakesCounter = document.getElementById('mistakesCounterCurrent');
            if (mistakesCounter) {
                mistakesCounter.textContent = game.state.currentGame.mistakes;
            }

            utils.updateGame();
        } catch (err) {
            return error(err);
        }
    },
    freeHint: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "freeHint" without game object...');
        }

        try {
            game.state.currentGame.hints++;
            game.actions.makeHint(game);
        } catch (err) {
            return error(err);
        }
    },
    freezeTimer: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "freezeTimer" without game object...');
        }

        try {
            if (!game.actions.oldUpdateTimer) {
                game.actions.oldUpdateTimer = game.actions.updateTimer;
            }

            let frozenVal = false;
            game.actions.updateTimer = new Proxy(game.actions.oldUpdateTimer, {
                apply(target, thisArg, argArr) {
                    if (frozenVal === false) {
                        frozenVal = Math.max(arguments[2][1] - 1000, 0);
                    }

                    arguments[2][1] = frozenVal;
                    return Reflect.apply(...arguments);
                }
            });
        } catch (err) {
            return error(err);
        }
    },
    resetTimer: () => {
        const game = utils.getGame();
        if (!game) {
            return warn('Unable to run "resetTimer" without game object...');
        }

        try {
            if (!game.actions.oldUpdateTimer) {
                game.actions.oldUpdateTimer = game.actions.updateTimer;
            }

            let reset = false;
            game.actions.updateTimer = new Proxy(game.actions.oldUpdateTimer, {
                apply(target, thisArg, argArr) {
                    if (reset === false) {
                        arguments[2][1] = 0;
                        reset = true;
                    }

                    return Reflect.apply(...arguments);
                }
            });
        } catch (err) {
            return error(err);
        }
    },
};

window[cheatKey] = [ ...Object.values(cheats) ];

let cheatIndex = 0;
const getButtonHTML = (name = '', transparentFill = true, fillRule = '', viewBox = '', d = '') => {
    return `
          <div ontouchstart="" class="game-controls-item-wrap" onclick="window['${cheatKey}'][${cheatIndex++}]()">
            <div class="game-controls-item game-controls-undo">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-game-control icon-game-rise" viewBox="${viewBox}">
                <path fill="${transparentFill ? '#eaeef400' : '#325aaf'}" ${fillRule ? `fill-rule="${fillRule}"` : 'stroke="#325aaf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'} d="${d}"/>
              </svg>
            </div>
            <div class="game-controls-label">${name}</div>
          </div>
    `;
};

const getMultipathButtonHTML = (name = '', transparentFill = true, viewBox = '', g = '', d = []) => {
    return `
          <div ontouchstart="" class="game-controls-item-wrap" onclick="window['${cheatKey}'][${cheatIndex++}]()">
            <div class="game-controls-item game-controls-undo">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-game-control icon-game-rise" viewBox="${viewBox}">
                ${g}
                  ${d.map(d => `<path fill="${transparentFill ? '#eaeef400' : '#325aaf'}" stroke="#325aaf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`).join('')}
                ${g ? '</g>' : ''}
              </svg>
            </div>
            <div class="game-controls-label">${name}</div>
          </div>
    `;
};

let wrapperInterval = setInterval(() => {
    let wrapper = document.getElementById('sudoku-wrapper');
    if (wrapper) {
        clearInterval(wrapperInterval);
        wrapper.insertAdjacentHTML('afterEnd', `
          <div style="user-select:none">
            <div class="game-controls">
              ${getButtonHTML('Solve Game', true, false, '2 2 20 20', `M4 19H20M11.2929 5.70711L8.70711 8.2929C8.31658 8.68342 7.68342 8.68342 7.29289 8.2929L5.70711 6.70711C5.07714 6.07714 4 6.52331 4 7.41422V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V7.41421C20 6.52331 18.9229 6.07714 18.2929 6.70711L16.7071 8.2929C16.3166 8.68342 15.6834 8.68342 15.2929 8.2929L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711Z`)}
              ${getButtonHTML('Note Solution', false, false, '0 0 445.049 445.049', `M56.507,73.548c-3.393-3.632-3.2-9.327,0.433-12.72l26.938-25.166c2.619-2.447,6.44-3.106,9.729-1.679
	c3.288,1.428,5.415,4.67,5.415,8.255v70.863c0,4.971-4.029,9-9,9s-9-4.029-9-9V62.963L69.228,73.98
	C65.595,77.374,59.9,77.181,56.507,73.548z M437.533,9v170.012c0,4.971-4.029,9-9,9s-9-4.029-9-9v-23.673H300.193v119.338h25.329
	c4.971,0,9,4.029,9,9s-4.029,9-9,9h-25.329v119.338h25.329c4.971,0,9,4.029,9,9s-4.029,9-9,9h-34.138
	c-0.063,0.001-0.127,0.002-0.191,0.002c-0.063,0-0.127-0.001-0.191-0.002H154.048c-0.125,0.003-0.254,0.003-0.382,0H16.546
	c-4.97,0-9-4.029-9-8.999L7.536,284.28c-0.013-0.2-0.02-0.4-0.02-0.604c0-0.202,0.007-0.402,0.02-0.602l-0.01-136.31
	c-0.006-0.142-0.01-0.283-0.01-0.427c0-0.143,0.003-0.284,0.01-0.426L7.516,9.001c0-2.388,0.948-4.677,2.636-6.364
	C11.84,0.948,14.129,0,16.516,0h412.017C433.503,0,437.533,4.029,437.533,9z M144.857,292.677H25.537l0.009,119.338h119.312V292.677
	z M144.857,155.339H25.527l0.008,119.338h119.322V155.339z M144.857,18H25.517l0.009,119.339h119.332V18z M282.193,292.677H162.857
	v119.338h119.336V292.677z M282.193,155.339H162.857v119.338h119.336V155.339z M282.193,18H162.857v119.339h119.336V18z M419.533,18
	H300.193v119.339h119.339V18z M435.378,231.685c1.39,1.629,2.154,3.701,2.154,5.843v198.521c0,4.971-4.029,9-9,9H371.8
	c-4.971,0-9-4.029-9-9V237.527c0-2.142,0.764-4.214,2.154-5.843l28.366-33.234c1.71-2.004,4.212-3.157,6.846-3.157
	s5.136,1.153,6.846,3.157L435.378,231.685z M419.533,408.026H380.8v19.022h38.733V408.026z M419.533,261.238H380.8v128.788h38.733
	V261.238z M419.533,240.846l-19.367-22.689L380.8,240.846v2.393h38.733V240.846z M238.798,238.695H189.91c-4.971,0-9,4.029-9,9
	s4.029,9,9,9h48.888c13.974,0,25.342-11.369,25.342-25.344c0-6.223-2.254-11.928-5.988-16.344
	c3.734-4.416,5.988-10.121,5.988-16.344c0-13.975-11.369-25.344-25.342-25.344H189.91c-4.971,0-9,4.029-9,9s4.029,9,9,9h48.888
	c4.048,0,7.342,3.295,7.342,7.345c0,4.049-3.294,7.343-7.342,7.343h-28.77c-4.971,0-9,4.029-9,9s4.029,9,9,9h28.77
	c4.048,0,7.342,3.295,7.342,7.345C246.14,235.401,242.846,238.695,238.798,238.695z`)}
              ${getButtonHTML('Solve Selected', false, false, '0 0 541.911 541.911', `M533.13,467.826h-47.451V74.091h47.451c4.604,0,8.334-3.735,8.334-8.334c0-4.607-3.729-8.337-8.334-8.337h-49.065V8.334
c0-4.599-3.735-8.334-8.334-8.334c-4.61,0-8.334,3.736-8.334,8.334v49.08H74.529V8.334C74.529,3.736,70.796,0,66.195,0
c-4.61,0-8.334,3.736-8.334,8.334v49.08H8.781c-4.607,0-8.334,3.73-8.334,8.337c0,4.599,3.727,8.334,8.334,8.334h49.08v393.74
H8.781c-4.607,0-8.334,3.735-8.334,8.334c0,4.61,3.727,8.334,8.334,8.334h49.08v49.083c0,4.599,3.724,8.334,8.334,8.334
c4.602,0,8.334-3.735,8.334-8.334v-48.339h392.868v48.339c0,4.599,3.724,8.334,8.334,8.334c4.599,0,8.334-3.735,8.334-8.334
v-49.083h49.065c4.604,0,8.334-3.724,8.334-8.334C541.464,471.561,537.735,467.826,533.13,467.826z M201.386,468.204H74.529
V340.413h126.857V468.204z M201.386,334.857H74.529V207.435h126.857V334.857z M201.386,201.504H74.529V74.091h126.857V201.504z
	M334.736,468.204H206.942V340.413h127.794V468.204z M334.736,334.857H206.942V207.435h127.794V334.857z M334.736,201.504H206.942
V74.091h127.794V201.504z M468.083,468.204H340.292V340.413h127.791V468.204z M468.083,334.857H340.292V207.435h127.791V334.857z
	M468.083,201.504H340.292V74.091h127.791V201.504z M323.411,323.414H218.503V218.5h104.907V323.414z`)}
              ${getButtonHTML('No Mistakes', false, 'evenodd', '0 0 30 31', 'M27.13 25.11a1 1 0 01.12 2h-6.9a1 1 0 01-.11-2H27.13zM21.48 4.08l.17.14.16.15 3.76 3.76a4 4 0 01.15 5.5l-.15.16-11.32 11.32h2.04a1 1 0 011 .89v.11a1 1 0 01-.88 1H6.52a3 3 0 01-1.98-.74l-.14-.14-2.23-2.22a4 4 0 01-.15-5.5l.15-.16L16.15 4.37a4 4 0 015.33-.29zm-11.52 9.3l-6.38 6.38a2 2 0 00-.11 2.7l.11.13 2.23 2.23a1 1 0 00.58.28l.13.01h4.9l5.13-5.13-6.59-6.6zm7.87-7.82l-.14.1-.13.13-6.18 6.18 6.59 6.6 6.19-6.2a2 2 0 00.11-2.7l-.11-.12-3.77-3.76a2 2 0 00-2.56-.22z')}
              ${getButtonHTML('Free Hint', true, false, '0 0 24 24', 'M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z')}
              ${getButtonHTML('Freeze Timer', false, 'evenodd', '0 0 25 25', 'M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4ZM12 5C12.5523 5 13 5.44772 13 6V11.5858L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V6C11 5.44772 11.4477 5 12 5ZM16.7071 15.2929C16.3166 14.9024 15.6834 14.9024 15.2929 15.2929C14.9024 15.6834 14.9024 16.3166 15.2929 16.7071L17.5858 19L15.2929 21.2929C14.9024 21.6834 14.9024 22.3166 15.2929 22.7071C15.6834 23.0976 16.3166 23.0976 16.7071 22.7071L19 20.4142L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.4142 19L22.7071 16.7071C23.0976 16.3166 23.0976 15.6834 22.7071 15.2929C22.3166 14.9024 21.6834 14.9024 21.2929 15.2929L19 17.5858L16.7071 15.2929Z" fill="#000000')}
              ${getMultipathButtonHTML('Reset Timer', true, '0 0 21 21', `<g fill="none" fill-rule="evenodd" transform="matrix(0 1 1 0 0 2)">`, [`m8.54949429 2.5c-2.77910025-.01404818-5.48733216 1.42226095-6.97636172 4.0013358-2.209139 3.826341-.89813776 8.7190642 2.92820323 10.9282032s8.7190642.8981378 10.9282032-2.9282032.8981378-8.71906423-2.9282032-10.92820323`, `m11.5 2.5-3 2.5v-5z`, `m4.5 10.5h5v3`])}
            </div>
          </div>
        `)
    }
}, 50);