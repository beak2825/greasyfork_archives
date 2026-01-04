// ==UserScript==
// @name         Snake Game!
// @version      3.6
// @description  плохое настроение? сыграйте в меня!
// @autor        Minish
// @namespace    drawaria.snake.game
// @match        drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521546/Snake%20Game%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521546/Snake%20Game%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the game canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800; // Increased width
    canvas.height = 600; // Increased height
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Load images
    const appleImage = new Image();
    appleImage.src = 'https://w7.pngwing.com/pngs/381/179/png-transparent-apple-green-apple-green-apple-food-granny-smith-asian-pear-thumbnail.png'; // Transparent background apple

    const goldenAppleImage = new Image();
    goldenAppleImage.src = 'https://w7.pngwing.com/pngs/534/248/png-transparent-minecraft-computer-icons-golden-apple-golden-orange-fruit-apple-thumbnail.png'; // Transparent background golden apple

    const backgroundImage = new Image();
    backgroundImage.src = 'https://avatars.mds.yandex.net/i?id=d7ddea51bc660760175ae06837721008ec22c13e3c0bd198-10786048-images-thumbs&n=13'; // Указанная текстура фона

    // Game variables
    const box = 40; // Increased size of apples
    const initialPosition = { x: 9 * box, y: 9 * box }; // Initial spawn position
    let snake = [initialPosition]; // Start with initial snake position
    let direction = null;
    let apple = spawnApple();
    let goldenApple = null; // Variable for golden apple
    let score = 0;
    let skins = ['green', 'blue', 'red', 'yellow', 'purple'];
    let currentSkin = 0; // Index for the current skin
    let isPaused = false; // Game pause state
    let appleCount = 0; // Count of regular apples collected

    // Load sound
    const soundEffect = new Audio('https://www.myinstants.com/en/instant/snake-game-food-65186/?utm_source=copy&utm_medium=share'); // URL to sound effect

    // Create skin selection section
    const shopContainer = document.createElement('div');
    shopContainer.style.margin = '20px';
    shopContainer.style.textAlign = 'center';
    shopContainer.style.backgroundColor = 'lightgray';
    shopContainer.style.padding = '10px';
    shopContainer.style.borderRadius = '5px';

    const title = document.createElement('h2');
    title.innerHTML = 'Shop - Choose Your Skin';
    shopContainer.appendChild(title);

    skins.forEach((color, index) => {
        const button = document.createElement('button');
        button.innerHTML = `Buy ${color} Skin`;
        button.style.margin = '5px';
        button.onclick = () => {
            currentSkin = index; // Change skin index
        };
        shopContainer.appendChild(button);
    });

    document.body.appendChild(shopContainer);

    // Control the snake with arrow keys
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' && direction !== 'DOWN') {
            direction = 'UP';
            soundEffect.play(); // Play sound on key press
        }
        else if (event.key === 'ArrowDown' && direction !== 'UP') {
            direction = 'DOWN';
            soundEffect.play(); // Play sound on key press
        }
        else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
            direction = 'LEFT';
            soundEffect.play(); // Play sound on key press
        }
        else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
            direction = 'RIGHT';
            soundEffect.play(); // Play sound on key press
        }
        else if (event.key === ' ') {
            isPaused = !isPaused; // Toggle pause on space
            soundEffect.play(); // Play sound on key press
        }
    });

    // Game loop
    function game() {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing
            
            // Draw the background texture
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // Draw the snake
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0) ? skins[currentSkin] : 'lightgreen'; // Change head color based on current skin
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = 'darkgreen';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            // Draw the apple
            ctx.drawImage(appleImage, apple.x, apple.y, box, box);

            // Draw the golden apple if it exists
            if (goldenApple) {
                ctx.drawImage(goldenAppleImage, goldenApple.x, goldenApple.y, box, box);
            }

            // Move the snake
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (direction === 'LEFT') snakeX -= box;
            if (direction === 'UP') snakeY -= box;
            if (direction === 'RIGHT') snakeX += box;
            if (direction === 'DOWN') snakeY += box;

            // Check if the snake eats the apple
            if (snakeX === apple.x && snakeY === apple.y) {
                score++;
                appleCount++; // Increment apple count
                apple = spawnApple(); // Spawn a new apple
                
                // Check if the apple count reached 100
                if (appleCount === 100) {
                    goldenApple = spawnGoldenApple(); // Spawn golden apple
                }
            } else {
                snake.pop();
            }

            // Check if the snake eats the golden apple
            if (goldenApple && snakeX === goldenApple.x && snakeY === goldenApple.y) {
                score += 500; // Add 500 points for golden apple
                goldenApple = null; // Remove golden apple after eaten
                appleCount = 0; // Reset apple count after golden apple
            }

            // Add the new head
            const newHead = { x: snakeX, y: snakeY };

            // Check for collisions with walls or itself
            if (collision(newHead, snake) || snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
                alert('Game Over! Your score: ' + score + '. Click OK to respawn.');
                teleportToSpawn(); // Teleport to spawn
            } else {
                snake.unshift(newHead);
            }

            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('Score: ' + score, box, box);
            ctx.fillText('Apples Collected: ' + appleCount, box, box + 20); // Display collected apples
        } else {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Paused', canvas.width / 2 - 70, canvas.height / 2);
        }
    }

    // Check for collision with the snake itself
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    // Teleport to spawn position
    function teleportToSpawn() {
        snake = [initialPosition]; // Reset snake to spawn position
        direction = null; // Reset direction
        apple = spawnApple(); // Spawn a new apple
        goldenApple = null; // Remove golden apple if it exists
        appleCount = 0; // Reset apple count
    }

    // Function to spawn apple in a valid location
    function spawnApple() {
        let newApple;
        let isValidPosition = false;

        while (!isValidPosition) {
            newApple = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };

            // Check if the apple spawns on the snake
            isValidPosition = !collision(newApple, snake);
        }

        return newApple;
    }

    // Function to spawn golden apple in a valid location
    function spawnGoldenApple() {
        let newGoldenApple;
        let isValidPosition = false;

        while (!isValidPosition) {
            newGoldenApple = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };

            // Check if the golden apple spawns on the snake or regular apple
            isValidPosition = !collision(newGoldenApple, snake) && !(newGoldenApple.x === apple.x && newGoldenApple.y === apple.y);
        }

        return newGoldenApple;
    }

    // Start the game loop
    setInterval(game, 100);
})();
