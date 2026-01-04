// ==UserScript==
// @name         Connect 4 Board Evaluation for papergames
// @namespace    https://github.com/longkidkoolstar
// @version      0.4.1
// @description  Visually shows you the best moves for both teams. Now works at the same time as the AI script I made.
// @author       longkidkoolstar
// @license      none
// @match        https://papergames.io/*
// @icon         https://i.imgur.com/IQi878N.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/499815/Connect%204%20Board%20Evaluation%20for%20papergames.user.js
// @updateURL https://update.greasyfork.org/scripts/499815/Connect%204%20Board%20Evaluation%20for%20papergames.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var username = await GM.getValue('username');
    var moveHistory = [];
    var lastBoardState = [];

    if (!username) {
        username = prompt('Please enter your Papergames username (case-sensitive):');
       await GM.setValue('username', username);
    }

    function getBoardState() {
        const boardContainer = document.querySelector(".grid.size6x7");
        if (!boardContainer) {
            console.error("Board container not found");
            return [];
        }
    
        let boardState = [];
    
        // Iterate over cells in a more flexible way
        for (let row = 1; row <= 6; row++) {
            let rowState = [];
            for (let col = 1; col <= 7; col++) {
                // Use a selector that matches the class names correctly
                const cellSelector = `.grid-item.cell-${row}-${col}`;
                const cell = boardContainer.querySelector(cellSelector);
                if (cell) {
                    // Check the circle class names to determine the cell's state
                    const circle = cell.querySelector("circle");
                    if (circle) {
                        if (circle.classList.contains("circle-dark")) {
                            rowState.push("R");
                        } else if (circle.classList.contains("circle-light")) {
                            rowState.push("Y");
                        } else {
                            rowState.push("E");
                        }
                    } else {
                        rowState.push("E");
                    }
                } else {
                    console.error(`Cell not found: ${cellSelector}`);
                    rowState.push("E");
                }
            }
            boardState.push(rowState);
        }
    
        return boardState;
    }
    
    function detectNewMove() {
        const currentBoardState = getBoardState();
        let newMove = false;
    
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (lastBoardState[row] && lastBoardState[row][col] === 'E' && currentBoardState[row][col] !== 'E') {
                    moveHistory.push(col + 1);
                    newMove = true;
                }
            }
        }
    
        lastBoardState = currentBoardState;
        return newMove;
    }
    

    function getAPIEvaluation() {
        if (!detectNewMove()) return;

        let pos = moveHistory.join("");
        const apiUrl = `https://connect4.gamesolver.org/solve?pos=${pos}`;

        GM.xmlHttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                displayEvaluations(data.score);
            },
            onerror: function(error) {
                console.error("API request failed:", error);
            }
        });
    }

function displayEvaluations(scores) {
    const boardContainer = document.querySelector(".grid.size6x7");
    let evalContainer = document.querySelector("#evaluation-container");

    if (!evalContainer) {
        evalContainer = document.createElement("div");
        evalContainer.id = "evaluation-container";
        evalContainer.style.display = "flex";
        evalContainer.style.justifyContent = "space-around";
        evalContainer.style.marginTop = "10px";
        boardContainer.parentNode.insertBefore(evalContainer, boardContainer.nextSibling);
    }

    // Clear existing evaluation cells
    evalContainer.innerHTML = '';

    scores.forEach((score, index) => {
        const evalCell = document.createElement("div");
        evalCell.textContent = score;
        evalCell.style.textAlign = 'center';
        evalCell.style.fontWeight = 'bold';
        evalCell.style.color = score > 0 ? 'green' : (score < 0 ? 'red' : 'black');
        evalCell.style.flexGrow = '1';
        evalCell.style.padding = '5px';
        evalContainer.appendChild(evalCell);
    });
}

function simulateCellClick(column) {
    console.log(`Attempting to click on column ${column}`);
    const boardContainer = document.querySelector(".grid.size6x7");
    if (!boardContainer) {
        console.error("Board container not found");
        return;
    }

    for (let row = 5; row >= 0; row--) {
        const cellSelector = `.cell-${row}-${column}`;
        const cell = boardContainer.querySelector(cellSelector);
        if (cell && cell.classList.contains('selectable')) {
            console.log(`Found selectable cell at row ${row}, column ${column}`);
            console.log(`Dispatching click event on row ${row}, column ${column}`);
            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });
            cell.dispatchEvent(event);
            console.log(`Click event dispatched on row ${row}, column ${column}`);
            return;
        }
    }
    console.log(`No selectable cell found in column ${column}`);
}

    function resetVariables() {
        moveHistory = [];
        lastBoardState = [];
        console.log("Variables reset to default states");
    }
    function checkForResetButtons() {
        var playOnlineButton = document.querySelector("button.btn-secondary.flex-grow-1");
        var leaveRoomButton = document.querySelector("button.btn-light.ng-tns-c189-7");
        var customResetButton = document.querySelector("button.btn.btn-outline-dark.ng-tns-c497539356-18.ng-star-inserted");
    
        if (playOnlineButton || leaveRoomButton || customResetButton) {
            resetVariables();
        }
    }

    //Checking If the game is over so it can reset variables
setInterval(function() {
    checkForResetButtons();
}, 500);
    setInterval(getAPIEvaluation, 10);

    console.log("Modified Connect 4 script loaded and running");



function logout() {
    GM.setValue('username', '');
    location.reload();
}

function createLogoutButton() {
    $('<button>')
        .text('Logout')
        .addClass('btn btn-secondary mb-2 ng-star-inserted')
        .css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            color: 'white'
        })
        .on('click', logout)
        .on('mouseover', function() { $(this).css('opacity', '0.5'); })
        .on('mouseout', function() { $(this).css('opacity', '1'); })
        .appendTo('body');
}

$(function() {
    createLogoutButton();

    var $dropdownContainer = $('<div>')
        .css({
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: '9998',
            backgroundColor: '#1b2837',
            border: '1px solid #18bc9c',
            borderRadius: '5px'
        })
        .appendTo('body');

    var $toggleButton = $('<button>')
        .text('Settings')
        .addClass('btn btn-secondary mb-2 ng-star-inserted')
        .css({
            padding: '5px 10px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px'
        })
        .on('mouseover', function() { $(this).css('opacity', '0.5'); })
        .on('mouseout', function() { $(this).css('opacity', '1'); })
        .appendTo($dropdownContainer);

    var $dropdownContent = $('<div>')
        .css({
            display: 'none',
            padding: '8px'
        })
        .appendTo($dropdownContainer);

    var $autoQueueTab = $('<div>')
        .text('Auto Queue')
        .css({
            padding: '5px 0',
            cursor: 'pointer'
        })
        .appendTo($dropdownContent);

    var $autoQueueSettings = $('<div>')
        .css('padding', '10px')
        .appendTo($dropdownContent);

    var isAutoQueueOn = false;

    var $autoQueueToggleButton = $('<button>')
        .text('Auto Queue Off')
        .addClass('btn btn-secondary mb-2 ng-star-inserted')
        .css({
            marginTop: '10px',
            backgroundColor: 'red',
            color: 'white'
        })
        .on('click', toggleAutoQueue)
        .appendTo($autoQueueSettings);

    function toggleAutoQueue() {
        isAutoQueueOn = !isAutoQueueOn;
        localStorage.setItem('isToggled', isAutoQueueOn);
        $autoQueueToggleButton.text(isAutoQueueOn ? 'Auto Queue On' : 'Auto Queue Off')
            .css('backgroundColor', isAutoQueueOn ? 'green' : 'red');
    }

    function clickLeaveRoomButton() {
        $("button.btn-light.ng-tns-c189-7").click();
    }

    function clickPlayOnlineButton() {
        $("button.btn-secondary.flex-grow-1").click();
    }

    function checkButtonsPeriodically() {
        if (isAutoQueueOn) {
            clickLeaveRoomButton();
            clickPlayOnlineButton();
        }
    }

    setInterval(checkButtonsPeriodically, 1000);

    let previousNumber = null;

    function trackAndClickIfDifferent() {
        const $spanElement = $('app-count-down span');
        if ($spanElement.length) {
            const number = parseInt($spanElement.text(), 10);
            if (!isNaN(number) && previousNumber !== null && number !== previousNumber && isAutoQueueOn) {
                $spanElement.click();
            }
            previousNumber = number;
        }
    }

    setInterval(trackAndClickIfDifferent, 1000);

    $toggleButton.on('click', function() {
        $dropdownContent.toggle();
    });
});

//---GUI
})();