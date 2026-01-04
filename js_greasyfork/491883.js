// ==UserScript==
// @name         Snake Game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Snake on any webpage by pressing 'S'
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let snakeInterval;
    let snake;
    let food;
    let direction;
    let score;

    function initSnake() {
        snake = [{x: 10, y: 10}];
        food = getRandomPosition();
        direction = 'right';
        score = 0;
        snakeInterval = setInterval(moveSnake, 100);
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || isSnakeCollided(head)) {
            clearInterval(snakeInterval);
            alert('Game Over! Score: ' + score);
            initSnake();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = getRandomPosition();
        } else {
            snake.pop();
        }

        drawSnake();
    }

    function isSnakeCollided(head) {
        return snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    function drawSnake() {
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.forEach(segment => {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        });

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    }

    function handleKeydown(event) {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 's':
            case 'S':
                if (!snakeInterval) {
                    initSnake();
                }
                break;
        }
    }

    function createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'snakeCanvas';
        canvas.width = 400;
        canvas.height = 400;
        canvas.style.border = '1px solid black';
        canvas.style.position = 'fixed';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }

    createCanvas();
    document.addEventListener('keydown', handleKeydown);

})();
