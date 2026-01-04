// ==UserScript==
// @name         Neopets - Karla's Mysterious Negg Cave Autosolver 100%
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.5
// @description  Automatically solves the mysterious negg cave! Even when puzzle has multiple solutions
// @author       Karla
// @match        *://*.neopets.com/shenkuu/neggcave*
// @homepage     https://neopointskarla.com
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543162/Neopets%20-%20Karla%27s%20Mysterious%20Negg%20Cave%20Autosolver%20100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/543162/Neopets%20-%20Karla%27s%20Mysterious%20Negg%20Cave%20Autosolver%20100%25.meta.js
// ==/UserScript==

const sleep = (time) =>
new Promise((resolve) => setTimeout(resolve, time));

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

(async function() {
    'use strict';

    // Your code here...
    let autoplaying = GM_getValue('status');

    const section = document.querySelector('.content');
    const controlPanel = document.createElement('div');
    controlPanel.style.textAlign = 'center';
    controlPanel.innerHTML = `<div>Autoplayer</div>
    <button id="start" style="margin-top: 10px;">${autoplaying ? 'Stop' : 'Start'}</button>`;
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

    try {
        if (!autoplaying || !(document.querySelector(".mnc_clue_table"))) {
            return;
        }
        try {
            document.querySelector("#mnc_popup_generic_wrongdate .mnc_popup_generic.close").click();
        } catch {}
        const defaultCell = { shape: "X", color: "X" };
        let possiblePuzzles = [
            [
                [
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                ],
                [
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                ],
                [
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                    JSON.parse(JSON.stringify(defaultCell)),
                ],
            ],
        ];

        const clues = [];
        const tables = document.querySelectorAll(".mnc_clue_table");
        for (let i = 0; i < tables.length; i += 1) {
            const table = tables[i];
            const clue = [];
            clues.push(clue);
            const rows = table.querySelectorAll("tr");
            for (let j = 0; j < rows.length; j += 1) {
                const row = rows[j];
                const clueRow = [];
                clue.push(clueRow);
                const cells = row.querySelectorAll("td");
                for (let k = 0; k < cells.length; k += 1) {
                    const cell = cells[k];
                    if (cell.className === "empty") {
                        clueRow.push({ shape: "X", color: "X" });
                    } else {
                        const [, shape, color] = cell
                        .querySelector("div")
                        .className.match(/s([\dx]+)c([\dx]+)$/i);
                        clueRow.push({ shape, color });
                    }
                }
            }
        }

        // get possible solutions by filling in clues
        for (let i = 0; i < clues.length; i += 1) {
            const clue = clues[i];
            const clueColLength = clue.length;
            let newPossiblePuzzles = [];
            for (let x = 0; x < possiblePuzzles.length; x += 1) {
                const puzzle = JSON.parse(JSON.stringify(possiblePuzzles[x]));
                for (let colOffset = 0; colOffset <= 3 - clueColLength; colOffset += 1) {
                    const clueRowLength = clue[0].length;
                    outer: for (
                        let rowOffset = 0;
                        rowOffset <= 3 - clueRowLength;
                        rowOffset += 1
                    ) {
                        const puzzleCopy = JSON.parse(JSON.stringify(puzzle));
                        for (let j = 0; j < clueColLength; j += 1) {
                            const clueRow = clue[j];
                            for (let k = 0; k < clueRowLength; k += 1) {
                                const { shape, color } = clueRow[k];
                                if (shape !== "X") {
                                    if (
                                        puzzleCopy[colOffset + j][rowOffset + k].shape !== "X" &&
                                        puzzleCopy[colOffset + j][rowOffset + k].shape !== shape
                                    ) {
                                        continue outer;
                                    }
                                    puzzleCopy[colOffset + j][rowOffset + k].shape = shape;
                                }
                                if (color !== "X") {
                                    if (
                                        puzzleCopy[colOffset + j][rowOffset + k].color !== "X" &&
                                        puzzleCopy[colOffset + j][rowOffset + k].color !== color
                                    ) {
                                        continue outer;
                                    }
                                    puzzleCopy[colOffset + j][rowOffset + k].color = color;
                                }
                            }
                        }
                        newPossiblePuzzles.push(puzzleCopy);
                    }
                }
            }
            possiblePuzzles = newPossiblePuzzles;
        }

        const solutions = [];

        possiblePuzzles = possiblePuzzles.filter((puzzle) => {
            const shapeCount = {
                0: 0,
                1: 0,
                2: 0,
            };
            const colorCount = {
                0: 0,
                1: 0,
                2: 0,
            };
            for (let j = 0; j < puzzle.length; j += 1) {
                for (let k = 0; k < puzzle[j].length; k += 1) {
                    const { shape, color } = puzzle[j][k];
                    if (shape !== "X") {
                        shapeCount[shape] += 1;
                        if (shapeCount[shape] > 3) {
                            return false;
                        }
                    }
                    if (color !== "X") {
                        colorCount[color] += 1;
                        if (colorCount[color] > 3) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });

        // fill rest of the board
        for (let i = 0; i < possiblePuzzles.length; i += 1) {
            const puzzle = possiblePuzzles[i];
            const unknownCells = [];
            for (let j = 0; j < puzzle.length; j += 1) {
                for (let k = 0; k < puzzle[j].length; k += 1) {
                    const { shape, color } = puzzle[j][k];
                    if (shape === "X" || color === "X") {
                        unknownCells.push(puzzle[j][k]);
                    }
                }
            }
            let x = 0;
            while (unknownCells.length > 0) {
                const unknownCell = unknownCells.pop();
                const { shape: targetShape, color: targetColor } = unknownCell;
                const possibleCombinations = [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1],
                ];
                if (targetShape !== "X") {
                    for (let i = 0; i < 3; i += 1) {
                        if (i.toString() !== targetShape) {
                            possibleCombinations[i].fill(0);
                        }
                    }
                }
                if (targetColor !== "X") {
                    for (let i = 0; i < 3; i += 1) {
                        for (let j = 0; j < 3; j += 1) {
                            if (j.toString() !== targetColor) {
                                possibleCombinations[i][j] = 0;
                            }
                        }
                    }
                }

                for (let j = 0; j < puzzle.length; j += 1) {
                    for (let k = 0; k < puzzle[j].length; k += 1) {
                        const { shape, color } = puzzle[j][k];
                        if (shape !== "X" && color !== "X") {
                            possibleCombinations[shape][color] = 0;
                        }
                    }
                }
                let shapeSolution = -1;
                let colorSolution = -1;
                for (let i = 0; i < possibleCombinations.length; i += 1) {
                    for (let j = 0; j < possibleCombinations[i].length; j += 1) {
                        if (possibleCombinations[i][j] === 1) {
                            if (shapeSolution === -1 && colorSolution === -1) {
                                shapeSolution = i;
                                colorSolution = j;
                            } else {
                                shapeSolution = -2;
                                colorSolution = -2;
                            }
                        }
                    }
                }

                if (shapeSolution > -1 && colorSolution > -1) {
                    unknownCell.shape = shapeSolution;
                    unknownCell.color = colorSolution;
                } else {
                    unknownCells.unshift(unknownCell);
                }
                if (++x === 100) {
                    break;
                }
            }
            if (unknownCells.length === 0) {
                solutions.push(puzzle);
            }
        }

        if (solutions.length < 1) {
            return "";
        }
        console.log(solutions);
        for (let i = 0; i < solutions.length; i += 1) {
            const puzzle = solutions[i];
            for (let i = 0; i < puzzle.length; i += 1) {
                const puzzleRow = puzzle[i];
                for (let j = 0; j < puzzleRow.length; j += 1) {
                    const { shape, color } = puzzleRow[j];
                    document.querySelector("#mnc_parch_ui_clear_text");
                    await sleep(random_in_range(600, 900));
                    if (shape !== "X" && NeggCave.selectedSymbol !== Number(shape)) {
                        NeggCave.clickSymbol(Number(shape));
                        await sleep(random_in_range(600, 900));
                    }
                    if (shape !== "X" && NeggCave.selectedColor !== Number(color)) {
                        NeggCave.clickColor(Number(color));
                        await sleep(random_in_range(600, 900));
                    }
                    NeggCave.colorCell(Number(i), Number(j));
                    await sleep(random_in_range(600, 900));
                }
            }
        }
        await sleep(random_in_range(1000, 2000));
        document.querySelector('#mnc_negg_submit_text').click();
    } catch (e) {
        console.log(e);
    }
})();