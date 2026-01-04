// ==UserScript==
// @name         Slither.io AI Bot
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  AI bot for Slither.io with toggle key (Z)
// @author       You
// @match        *://slither.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531782/Slitherio%20AI%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/531782/Slitherio%20AI%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let botRunning = false;
    let player = { x: innerWidth / 2, y: innerHeight / 2 };
    let foodList = [];

    console.log('Script loaded');

    document.addEventListener('keydown', function(event) {
        console.log('Key pressed:', event.key);
        if (event.key === 'z') {
            botRunning = !botRunning;
            console.log(`Bot ${botRunning ? 'enabled' : 'disabled'}`);
        }
    });

    function findFood() {
        foodList = document.querySelectorAll('.nsi'); // Slither.io food class
        if (foodList.length === 0) return null;

        let closestFood = Array.from(foodList).reduce((prev, curr) => {
            let prevDist = getDistance(prev);
            let currDist = getDistance(curr);
            return currDist < prevDist ? curr : prev;
        });

        return { x: closestFood.offsetLeft, y: closestFood.offsetTop };
    }

    function getDistance(food) {
        return Math.sqrt(Math.pow(food.offsetLeft - player.x, 2) + Math.pow(food.offsetTop - player.y, 2));
    }

    function moveToTarget(target) {
        let event = new MouseEvent('mousemove', {
            clientX: target.x,
            clientY: target.y,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    function updatePlayerPosition() {
        let snake = document.querySelector('.snake');
        if (snake) {
            let rect = snake.getBoundingClientRect();
            player.x = rect.left + rect.width / 2;
            player.y = rect.top + rect.height / 2;
        } else {
            console.log('Snake element not found');
        }
    }

    function gameLoop() {
        if (botRunning) {
            updatePlayerPosition();
            let food = findFood();
            if (food) {
                moveToTarget(food);
                console.log('Moving to food at:', food);
            } else {
                console.log('No food found');
            }
        }
        requestAnimationFrame(gameLoop);
    }

    console.log('Game loop started');
    gameLoop();
})();