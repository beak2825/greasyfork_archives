// ==UserScript==
// @name         Neopets - Cellblock Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This tool is designed to help you NOT make the BAD moves and DO make the GOOD moves! by ko_neo
// @author       You
// @match        http://www.neopets.com/games/cellblock/cellblock_main.phtml
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/390165/Neopets%20-%20Cellblock%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390165/Neopets%20-%20Cellblock%20Helper.meta.js
// ==/UserScript==

const blockImg1 = 'http://images.neopets.com/games/cellblock/block1.gif';
const blockImg2 = 'http://images.neopets.com/games/cellblock/block2.gif';
const blockImg3 = 'http://images.neopets.com/games/cellblock/block3.gif';
const blockImg4 = 'http://images.neopets.com/games/cellblock/block4.gif';
const myBlock = 'http://images.neopets.com/games/cellblock/merridell-small.gif';
const enemyBlock = 'http://images.neopets.com/games/cellblock/darigan-small.gif';
const openBlock = 'http://images.neopets.com/games/cellblock/blank.gif';

var coords = [];
var right = [];
var left = [];
var down = [];
var up = [];
var upRight = [];
var upLeft = [];
var downRight = [];
var downLeft = [];
var iter = -1;
var lock = false;
var lock2 = false;
var min=1;
var max=1.5;
var random = Math.random() * (+max - +min) + +min;

function storeCoordinates(xVal, yVal, tag, array, origTag, iter) {
    array.push({x: xVal, y: yVal, tag: tag, orig: origTag, iter: iter});
}

function getGridRef(x, y) {
    return $( '#neopost > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(' + x + ') > td:nth-child(' + y + ')' );
}

setTimeout(function(){
    // Load grid
    for (let i = 1; i < 11; i++) {
        for (let j = 1; j < 11; j++) {
            let currentBlock = getGridRef(i, j);
            if (currentBlock.find('img')[0].src === blockImg1) {
                storeCoordinates(j, i, 'block', coords);
            }
            if (currentBlock.find('img')[0].src === blockImg2) {
                storeCoordinates(j, i, 'block', coords);
            }
            if (currentBlock.find('img')[0].src === blockImg3) {
                storeCoordinates(j, i, 'block', coords);
            }
            if (currentBlock.find('img')[0].src === blockImg4) {
                storeCoordinates(j, i, 'block', coords);
            }
            if (currentBlock.find('img')[0].src === myBlock) {
                storeCoordinates(j, i, 'me', coords);
            }
            if (currentBlock.find('img')[0].src === enemyBlock) {
                storeCoordinates(j, i, 'enemy', coords);
            }
            if (currentBlock.find('img')[0].src === openBlock) {
                storeCoordinates(j, i, 'open', coords);
            }
        }
    }
    // Load combos
    for (let i = 0; i < coords.length; i++) {
        if (coords[i].tag === 'me' || coords[i].tag === 'enemy') {
            iter++;
            for (let d = 1; d < 5; d++) {
                // Right
                if (i + d > -1 && i + d < 100) {
                    if (coords[i + d].y === coords[i].y) {
                        storeCoordinates(coords[i + d].x, coords[i + d].y, coords[i + d].tag, right, coords[i].tag, iter);
                    }
                }
                // Left
                if (i - d > -1 && i - d < 100) {
                    if (coords[i - d].y === coords[i].y) {
                        storeCoordinates(coords[i - d].x, coords[i - d].y, coords[i - d].tag, left, coords[i].tag, iter);
                    }
                }
                // Down
                if (i + d * 10 > -1 && i + d * 10 < 100) {
                    storeCoordinates(coords[i + d * 10].x, coords[i + d * 10].y, coords[i + d * 10].tag, down, coords[i].tag, iter);
                }
                // Up
                if (i - d * 10 > -1 && i - d * 10 < 100) {
                    storeCoordinates(coords[i - d * 10].x, coords[i - d * 10].y, coords[i - d * 10].tag, up, coords[i].tag, iter);
                }
                // Up-Right
                if (i - d * 9 > -1 && i - d * 9 < 100) {
                    if (coords[i].x < coords[i - d * 9].x) {
                        storeCoordinates(coords[i - d * 9].x, coords[i - d * 9].y, coords[i - d * 9].tag, upRight, coords[i].tag, iter);
                    }
                }
                // Up-Left
                if (i - d * 11 > -1 && i - d * 11 < 100) {
                    if (coords[i].x > coords[i - d * 11].x) {
                        storeCoordinates(coords[i - d * 11].x, coords[i - d * 11].y, coords[i - d * 11].tag, upLeft, coords[i].tag, iter);
                    }
                }
                // Down-Right
                if (i + d * 11 > -1 && i + d * 11 < 100) {
                    if (coords[i].x < coords[i + d * 11].x) {
                        storeCoordinates(coords[i + d * 11].x, coords[i + d * 11].y, coords[i + d * 11].tag, downRight, coords[i].tag, iter);
                    }
                }
                // Down-Left
                if (i + d * 9 > -1 && i + d * 9 < 100) {
                    if (coords[i].x > coords[i + d * 9].x) {
                        storeCoordinates(coords[i + d * 9].x, coords[i + d * 9].y, coords[i + d * 9].tag, downLeft, coords[i].tag, iter);
                    }
                }
            }
        }
    }
    checkCombo(right);
    checkCombo(left);
    checkCombo(up);
    checkCombo(down);
    checkCombo(upRight);
    checkCombo(upLeft);
    checkCombo(downRight);
    checkCombo(downLeft);
}, random*100);
function checkCombo(thisArray) {
    lock = false;
    lock2 = false;
    for (let i = 0; i < iter + 1; i++) {
        let thisCombo = [];
        let meCount = 0;
        let enemyCount = 0;
        let openCount = 0;
        // Load combo arrays
        thisArray.forEach(element => {
            if (element.iter === i) {
                storeCoordinates(element.x, element.y, element.tag, thisCombo, element.orig);
            }
        });
        // Get count of blocks
        thisCombo.forEach(element => {
            if (element.tag === 'me') {
                meCount++;
            }
            if (element.tag === 'enemy') {
                enemyCount++;
            }
            if (element.tag === 'open') {
                openCount++;
            }
        });
        thisCombo.forEach(element => {
            console.log(element);
            // Set up for win
            if (lock === false) {
                if (meCount === 2 && openCount === 2) {
                    if (element.tag !== 'me') {
                        if (element.tag === 'open' && element.orig === 'me') {
                            if (getGridRef(element.y, element.x)[0].style.backgroundColor !== 'darkgreen') {
                                getGridRef(element.y, element.x)[0].style.backgroundColor = 'limegreen';
                                lock = true;
                            }
                        }
                    }
                }
            }
            // Winning move
            if (meCount === 3) {
                if (element.tag !== 'me') {
                    if (element.tag === 'open' && element.orig === 'me') {
                        getGridRef(element.y, element.x)[0].style.backgroundColor = 'darkgreen';
                        getGridRef(element.y, element.x)[0].style.border = '1px darkgreen solid';
                    }
                }
            }
            // Set up for loss
            if (lock2 === false) {
                if (enemyCount === 2 && openCount === 2) {
                    if (element.tag !== 'enemy') {
                        if (element.tag === 'open' && element.orig === 'enemy') {
                            if (getGridRef(element.y, element.x)[0].style.backgroundColor !== 'darkred') {
                                getGridRef(element.y, element.x)[0].style.backgroundColor = 'yellow';
                                lock2 = true;
                            }
                        }
                    }
                }
            }
            // Losing move
            if (enemyCount === 3) {
                if (element.tag !== 'enemy') {
                    if (element.tag === 'open' && element.orig === 'enemy') {
                        getGridRef(element.y, element.x)[0].style.backgroundColor = 'darkred';
                        getGridRef(element.y, element.x)[0].style.border = '1px darkred solid';
                    }
                }
            }
        });
    }
}