// ==UserScript==
// @name         Snow Wars Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Helps with snow wars
// @author       Shiba
// @match        https://www.grundos.cafe/games/snowwars/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535540/Snow%20Wars%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535540/Snow%20Wars%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const BOARD_WIDTH = 8;                      

    const cellNumberRegex = /submitSnowWarsAttack\(event,\s*'(\d+)'\)/;

    const OBJECTS = [
        {
            name: 'SNOWMAN',
            gifs: ['2_1.gif', '2_2.gif', '2_3.gif', '2_4.gif'],
            offsets: [[0, 1, 8, 9]],             
        },
        {
            name: 'CANNON',
            gifs: ['5_1.gif', '5_2.gif'],
            offsets: [[0, 8]],                   
        },
        {
            name: 'SNOWBALL',
            gifs: ['6_1.gif', '6_2.gif'],
            offsets: [[0, 8]],                   
        },
        {
            name: 'SLED',
            gifs: ['7_1.gif', '7_2.gif', '7_3.gif'],
            offsets: [[0, 1, 2]],                
        },
        {
            name: 'CASTLE',
            gifs: ['8_1.gif', '8_2.gif', '8_3.gif', '8_4.gif'],
            offsets: [[0, 1, 8, 9]],             
        },
    ];


    main();

    function main() {
        const clickableAnchors = getClickableAnchors();
        if (!clickableAnchors.length) return;

        const squares = getTopBoardSquares();

        const partialCell = findPartialTarget(squares, clickableAnchors);
        if (partialCell !== null) {
            highlightPartial(partialCell, squares);
            return;
        }

        highlightHeatmap(clickableAnchors, squares);
    }


    function getClickableAnchors() {
        const anchors = document.querySelectorAll('.snowwars-board-container a[href="#"]');
        return Array.from(anchors)
            .map((a) => {
            const m = (a.getAttribute('onclick') || '').match(cellNumberRegex);
            return m ? { anchor: a, cell: parseInt(m[1], 10) } : null;
        })
            .filter(Boolean);
    }

    function getTopBoardSquares() {
        const top = document.querySelector('.snowwars-board-container.flex.flex-column.margin-auto');
        if (!top) return [];

        const squares = [];
        top.querySelectorAll('.flex').forEach((row) => {
            Array.from(row.querySelectorAll('.snowwars-spot'))
                .filter((s) => !s.classList.contains('snowwars-axis'))
                .forEach((s) => {
                const bg = s.style.backgroundImage || '';
                const hasAnchor = !!s.querySelector('a[href="#"]');
                if (!bg && !hasAnchor) return;
                s.style.backgroundColor = '';
                squares.push(s);
            });
        });
        return squares;
    }


    function findPartialTarget(squares, clickableAnchors) {
        for (const { gifs, offsets } of OBJECTS) {
            const shape = offsets[0];

            const foundCount = shape.filter((off, i) =>
                                            squares.some((s) => (s.style.backgroundImage || '').includes(gifs[i])),
                                           ).length;
            if (foundCount === shape.length) continue;

            for (let i = 0; i < gifs.length; i++) {
                const idx = squares.findIndex((s) => (s.style.backgroundImage || '').includes(gifs[i]));
                if (idx === -1) continue;

                const anchorIdx = idx - shape[i];          
                const shapeCells = shape.map((off) => anchorIdx + off);
                const missing = findMissingCell(shapeCells, squares, gifs);

                if (missing !== null && clickableAnchors.some((c) => c.cell === missing)) {
                    return missing;                        
                }
            }
        }
        return null;
    }

    function findMissingCell(indices, squares, objectGifs) {
        for (const i of indices) {
            if (i < 0 || i >= squares.length) continue;
            const bg = squares[i].style.backgroundImage || '';
            if (!objectGifs.some((g) => bg.includes(g))) return i;
        }
        return null;
    }

    function highlightPartial(cell, squares) {
        squares[cell].style.backgroundColor = 'rgba(255,0,0,1)';
    }


    function isSunk(obj, squares) {
        return obj.gifs.every((gif) =>
                              squares.some((sq) => (sq.style.backgroundImage || '').includes(gif)),
                             );
    }

    function highlightHeatmap(clickableAnchors, squares) {
        const remainingObjects = OBJECTS.filter((o) => !isSunk(o, squares));
        if (remainingObjects.length === 0) {
            return;
        }

        const N = squares.length;                         
        const heat = new Array(N).fill(0);
        const unknown = new Set(clickableAnchors.map((c) => c.cell));

        const isUnknown = (i) => unknown.has(i);
        const isHit = (i) => {
            const bg = squares[i].style.backgroundImage || '';
            return OBJECTS.some((o) => o.gifs.some((g) => bg.includes(g)));
        };

        for (const { gifs, offsets } of remainingObjects) {
            const shape = offsets[0];
            const deltas = shape.map((o) => ({
                off: o,
                dr: Math.floor(o / BOARD_WIDTH),
                dc: o % BOARD_WIDTH,
            }));

            for (let anchor = 0; anchor < N; anchor++) {
                let fits = true;

                for (const { off, dr, dc } of deltas) {
                    const idx = anchor + off;
                    if (idx < 0 || idx >= N) {
                        fits = false;
                        break;
                    }
                    const r0 = Math.floor(anchor / BOARD_WIDTH),
                          c0 = anchor % BOARD_WIDTH;
                    const r1 = Math.floor(idx / BOARD_WIDTH),
                          c1 = idx % BOARD_WIDTH;
                    if (r1 - r0 !== dr || c1 - c0 !== dc) {
                        fits = false;
                        break;
                    }
                    if (!(isHit(idx) || isUnknown(idx))) {
                        fits = false;
                        break;
                    }
                    if (isHit(idx)) {
                        const bg = squares[idx].style.backgroundImage;
                        if (!gifs.some((g) => bg.includes(g))) {
                            fits = false;
                            break;
                        }
                    }
                }

                if (!fits) continue;

                deltas.forEach(({ off }) => {
                    const i = anchor + off;
                    if (isUnknown(i)) heat[i]++;
                });
            }
        }

        const maxH = Math.max(...heat);
        if (maxH === 0) {
            return;
        }

        clickableAnchors.forEach(({ cell }) => {
            const score = heat[cell];
            if (score === 0) return;                       

            const alpha = 0.2 + 0.6 * (score / maxH);     
            squares[cell].style.backgroundColor = `rgba(255,0,0,${alpha})`;
        });

    }
})();
