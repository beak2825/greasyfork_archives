// ==UserScript==
// @name         Snake Battle: Human vs AI on Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play a Snake Battle game (Human vs AI) on drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525597/Snake%20Battle%3A%20Human%20vs%20AI%20on%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/525597/Snake%20Battle%3A%20Human%20vs%20AI%20on%20Drawaria.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '20px';
    gameContainer.style.right = '20px';
    gameContainer.style.zIndex = '10000';
    gameContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameContainer.style.padding = '10px';
    gameContainer.style.borderRadius = '10px';
    gameContainer.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';

    // Add game title
    const title = document.createElement('h3');
    title.textContent = 'Snake Battle 🐍';
    title.style.color = '#00ffff';
    title.style.textAlign = 'center';
    title.style.margin = '0 0 10px 0';
    gameContainer.appendChild(title);

    // Add score display
    const score = document.createElement('div');
    score.id = 'score';
    score.textContent = '🚀 PLAYER: 0 | 🤖 AI: 0';
    score.style.color = '#ffffff';
    score.style.fontSize = '16px';
    score.style.marginBottom = '10px';


    // Add canvas for the game
    const canvas = document.createElement('canvas');
    canvas.id = 'gameBoard';
    canvas.width = 400;
    canvas.height = 300;
    canvas.style.border = '2px solid #00ffff';
    canvas.style.borderRadius = '10px';
    canvas.style.backgroundColor = '#000000';
    gameContainer.appendChild(canvas);

    // Add restart button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = '🔄 NEW BATTLE';
    restartBtn.style.display = 'block';
    restartBtn.style.margin = '10px auto 0';
    restartBtn.style.padding = '8px 16px';
    restartBtn.style.backgroundColor = '#00ffff';
    restartBtn.style.color = '#000000';
    restartBtn.style.border = 'none';
    restartBtn.style.borderRadius = '20px';
    restartBtn.style.cursor = 'pointer';
    restartBtn.style.fontWeight = 'bold';
    restartBtn.onclick = resetGame;
    gameContainer.appendChild(restartBtn);

    // Append game container to the body
    document.body.appendChild(gameContainer);

    // Game logic
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 20;
    const CELL_SIZE = canvas.width / GRID_SIZE;

    let particles = [];
    let playerScore = 0;
    let aiScore = 0;
    let gameSpeed = 100;
    let gameLoop;

    let obstacles = [];
    let playerSnake = [{ x: 5, y: 5 }];
    let aiSnake = [{ x: GRID_SIZE - 5, y: GRID_SIZE - 5 }];
    let playerDirection = 'right';
    let aiDirection = 'left';
    let food = generateFood();

    function generateObstacles() {
        const obstacles = [];
        for (let i = 2; i < GRID_SIZE - 2; i += 4) {
            for (let j = 2; j < GRID_SIZE - 2; j += 4) {
                if (Math.random() > 0.5) {
                    obstacles.push({ x: i, y: j });
                    obstacles.push({ x: i + 1, y: j });
                    obstacles.push({ x: i, y: j + 1 });
                }
            }
        }
        return obstacles;
    }

    function generateFood() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
                y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
            };
        } while ([...playerSnake, ...aiSnake, ...obstacles].some(item =>
            item.x === position.x && item.y === position.y));
        return position;
    }

    function aiPathfinding() {
        const head = aiSnake[0];
        const queue = [{ pos: head, path: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.pos.x === food.x && current.pos.y === food.y) {
                return current.path[0] || aiDirection;
            }

            const directions = [
                { dir: 'up', x: 0, y: -1 },
                { dir: 'down', x: 0, y: 1 },
                { dir: 'left', x: -1, y: 0 },
                { dir: 'right', x: 1, y: 0 }
            ];

            for (const d of directions) {
                const newPos = {
                    x: current.pos.x + d.x,
                    y: current.pos.y + d.y
                };
                const posKey = `${newPos.x},${newPos.y}`;

                if (!visited.has(posKey) &&
                    newPos.x >= 0 && newPos.x < GRID_SIZE &&
                    newPos.y >= 0 && newPos.y < GRID_SIZE &&
                    !obstacles.some(o => o.x === newPos.x && o.y === newPos.y) &&
                    !aiSnake.some(s => s.x === newPos.x && s.y === newPos.y)) {
                    visited.add(posKey);
                    queue.push({
                        pos: newPos,
                        path: [...current.path, d.dir]
                    });
                }
            }
        }
        return aiDirection;
    }

    function updateParticles() {
        particles = particles.filter(p => {
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.life -= 0.02;
            return p.life > 0;
        });
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        for (let i = 0; i < GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(canvas.width, i * CELL_SIZE);
            ctx.stroke();
        }

        ctx.fillStyle = '#2a2a2a';
        obstacles.forEach(obs => {
            ctx.beginPath();
            ctx.roundRect(obs.x * CELL_SIZE, obs.y * CELL_SIZE, CELL_SIZE, CELL_SIZE, 5);
            ctx.fill();
        });

        ctx.fillStyle = '#ff006e';
        ctx.shadowColor = '#ff006e';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(
            (food.x + 0.5) * CELL_SIZE,
            (food.y + 0.5) * CELL_SIZE,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        playerSnake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                (segment.x + 1) * CELL_SIZE,
                (segment.y + 1) * CELL_SIZE
            );
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00ff00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(
                segment.x * CELL_SIZE + 2,
                segment.y * CELL_SIZE + 2,
                CELL_SIZE - 4,
                CELL_SIZE - 4,
                8
            );
            ctx.fill();
        });

        aiSnake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                (segment.x + 1) * CELL_SIZE,
                (segment.y + 1) * CELL_SIZE
            );
            gradient.addColorStop(0, '#ff6600');
            gradient.addColorStop(1, '#ff0000');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(
                segment.x * CELL_SIZE + 2,
                segment.y * CELL_SIZE + 2,
                CELL_SIZE - 4,
                CELL_SIZE - 4,
                8
            );
            ctx.fill();
        });

        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    function gameOver() {
        clearInterval(gameLoop);
        setTimeout(() => {
            alert(`GAME OVER\nPlayer: ${playerScore}\nAI: ${aiScore}`);
            resetGame();
        }, 1000);
    }

    function resetGame() {
        playerSnake = [{ x: 5, y: 5 }];
        aiSnake = [{ x: GRID_SIZE - 5, y: GRID_SIZE - 5 }];
        playerDirection = 'right';
        aiDirection = 'left';
        playerScore = aiScore = 0;
        food = generateFood();
        obstacles = generateObstacles();
        particles = [];
        score.textContent = '🚀 PLAYER: 0 | 🤖 AI: 0';
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': if (playerDirection !== 'down') playerDirection = 'up'; break;
            case 'ArrowDown': if (playerDirection !== 'up') playerDirection = 'down'; break;
            case 'ArrowLeft': if (playerDirection !== 'right') playerDirection = 'left'; break;
            case 'ArrowRight': if (playerDirection !== 'left') playerDirection = 'right'; break;
        }
    });

    function update() {
        aiDirection = aiPathfinding();

        const playerHead = { ...playerSnake[0] };
        const aiHead = { ...aiSnake[0] };

        switch (playerDirection) {
            case 'up': playerHead.y--; break;
            case 'down': playerHead.y++; break;
            case 'left': playerHead.x--; break;
            case 'right': playerHead.x++; break;
        }

        switch (aiDirection) {
            case 'up': aiHead.y--; break;
            case 'down': aiHead.y++; break;
            case 'left': aiHead.x--; break;
            case 'right': aiHead.x++; break;
        }

        const playerCollision = checkCollision(playerHead, playerSnake);
        const aiCollision = checkCollision(aiHead, aiSnake);

        if (playerCollision || aiCollision) {
            gameOver();
            return;
        }

        playerSnake.unshift(playerHead);
        aiSnake.unshift(aiHead);

        if (playerHead.x === food.x && playerHead.y === food.y) {
            playerScore++;
            food = generateFood();
        } else {
            playerSnake.pop();
        }

        if (aiHead.x === food.x && aiHead.y === food.y) {
            aiScore++;
            food = generateFood();
        } else {
            aiSnake.pop();
        }

        score.textContent = `🚀 PLAYER: ${playerScore} | 🤖 AI: ${aiScore}`;
        updateParticles();
        draw();
    }

    function checkCollision(head, snake) {
        return head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            obstacles.some(o => o.x === head.x && o.y === head.y) ||
            snake.slice(1).some(s => s.x === head.x && s.y === head.y) ||
            (snake === playerSnake ? aiSnake : playerSnake).some(s =>
                s.x === head.x && s.y === head.y);
    }

    resetGame();
})();