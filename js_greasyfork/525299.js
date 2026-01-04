// ==UserScript==
// @name         3D Game for Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  3D Game on drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @grant        none
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525299/3D%20Game%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/525299/3D%20Game%20for%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Clear existing content
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    // Create game container with high z-index
    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.zIndex = '9999';
    gameContainer.style.overflow = 'hidden';
    gameContainer.tabIndex = 0;
    document.body.appendChild(gameContainer);
    gameContainer.focus();

    // Main screen container
    const mainScreenContainer = document.createElement('div');
    mainScreenContainer.style.position = 'absolute';
    mainScreenContainer.style.top = '40%';
    mainScreenContainer.style.left = '50%';
    mainScreenContainer.style.transform = 'translate(-50%, -50%)';
    mainScreenContainer.style.textAlign = 'center';
    mainScreenContainer.innerHTML = `
        <div style="display: inline-block; text-align: center;">
            <img id="logo" src="https://i.ibb.co/mrtyK2Z8/3dgame-fw.png" alt="3D Game Logo" style="width: 500px; margin-bottom: 50px;">
            <br><br>
            <button id="startButton" style="padding: 30px 60px; font-size: 30px; cursor: pointer; background: linear-gradient(45deg, #FFD700, #FFA500); color: white; border: none; border-radius: 15px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s, transform 0.3s;">Start Game</button>
        </div>
    `;
    gameContainer.appendChild(mainScreenContainer);

    // Game elements
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.style.position = 'absolute';
    scoreDiv.style.top = '20px';
    scoreDiv.style.left = '20px';
    scoreDiv.style.color = 'white';
    scoreDiv.style.fontFamily = 'Arial';
    scoreDiv.style.fontSize = '24px';
    scoreDiv.textContent = 'Score: 0';
    scoreDiv.style.display = 'none';
    gameContainer.appendChild(scoreDiv);

    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOver';
    gameOverDiv.style.display = 'none';
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.background = 'rgba(0,0,0,0.8)';
    gameOverDiv.style.color = 'white';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.fontFamily = 'Arial';
    gameOverDiv.style.zIndex = '10000';
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p>Final Score: <span id="finalScore">0</span></p>
<button onclick="window.restartGame()" style="padding: 20px 40px; font-size: 24px; cursor: pointer; background: linear-gradient(45deg, #FFD700, #FFA500); color: white; border: none; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s, transform 0.3s;">Play Again</button>
<br><br>
        <button onclick="window.location.reload()" style="padding: 20px 40px; font-size: 24px; cursor: pointer; background: linear-gradient(45deg, #FF4500, #FF8C00); color: white; border: none; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s, transform 0.3s; margin-bottom: 20px;">Restart Page</button>
    `;
    gameContainer.appendChild(gameOverDiv);

    let scene, camera, renderer, car;
    let moveLeft = false, moveRight = false;
    let obstacles = [];
    let score = 0;
    let gameActive = false;
    let audio, crashAudio;
    const gameSpeed = 0.1; // Constant game speed

    function initThreeJS() {
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.display = 'none';
        gameContainer.appendChild(renderer.domElement);

        // Car
        const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const carMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.y = 0.5;
        scene.add(car);

        // Road
        const roadGeometry = new THREE.PlaneGeometry(8, 1000);
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = -0.1;
        scene.add(road);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        scene.add(directionalLight);

        camera.position.set(0, 5, 5);
        camera.lookAt(0, 0, 0);
    }

    function onKeyDown(event) {
        if (!gameActive) return;
        if (event.key === 'ArrowLeft') moveLeft = true;
        if (event.key === 'ArrowRight') moveRight = true;
    }

    function onKeyUp(event) {
        if (event.key === 'ArrowLeft') moveLeft = false;
        if (event.key === 'ArrowRight') moveRight = false;
    }

    function createObstacle() {
        const obstacleGeometry = new THREE.BoxGeometry(1, 0.5, 1);
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.y = 0.5;
        obstacle.position.x = (Math.random() - 0.5) * 6;
        obstacle.position.z = -20;
        scene.add(obstacle);
        obstacles.push(obstacle);
    }

    function checkCollision(obstacle) {
        const carBox = new THREE.Box3().setFromObject(car);
        const obstacleBox = new THREE.Box3().setFromObject(obstacle);
        return carBox.intersectsBox(obstacleBox);
    }

    function update() {
        if (!gameActive) return;

        // Move car (constant speed)
        if (moveLeft && car.position.x > -3) car.position.x -= gameSpeed;
        if (moveRight && car.position.x < 3) car.position.x += gameSpeed;

        // Move obstacles (constant speed)
        obstacles.forEach((obstacle, index) => {
            obstacle.position.z += gameSpeed;
            if (obstacle.position.z > 5) {
                scene.remove(obstacle);
                obstacles.splice(index, 1);
            }
            if (checkCollision(obstacle)) {
                gameActive = false;
                gameOverDiv.style.display = 'block';
                document.getElementById('finalScore').textContent = Math.floor(score/10);
                audio.pause();
                crashAudio.play().catch(error => {
                    console.error('Error playing crash audio:', error);
                });
            }
        });

        // Create new obstacles
        if (Math.random() < 0.02) {
            createObstacle();
        }

        // Update score
        score++;
        scoreDiv.textContent = `Score: ${Math.floor(score/10)}`;

        // Update camera
        camera.position.x = car.position.x;
        camera.position.z = car.position.z + 5;
        camera.lookAt(car.position);
    }

    function animate() {
        requestAnimationFrame(animate);
        update();
        renderer.render(scene, camera);
    }

    window.restartGame = function() {
        gameActive = true;
        score = 0;
        car.position.x = 0;
        obstacles.forEach(obstacle => scene.remove(obstacle));
        obstacles = [];
        gameOverDiv.style.display = 'none';
        scoreDiv.style.display = 'block';
        renderer.domElement.style.display = 'block';
        gameContainer.focus();
        animate();

        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    };

    window.startGame = function() {
        mainScreenContainer.style.display = 'none';
        gameActive = true;
        score = 0;
        car.position.x = 0;
        obstacles = [];
        scoreDiv.style.display = 'block';
        renderer.domElement.style.display = 'block';
        gameContainer.focus();
        animate();

        audio = new Audio('https://www.myinstants.com/media/sounds/dr-livesey.mp3');
        audio.loop = true;
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });

        crashAudio = new Audio('https://www.myinstants.com/media/sounds/super-mario-bros_1.mp3');
    };

    // Initialize game
    initThreeJS();

    // Event listeners
    gameContainer.addEventListener('keydown', onKeyDown);
    gameContainer.addEventListener('keyup', onKeyUp);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Pulsating logo effect
    const logo = document.getElementById('logo');
    let pulsing = true;
    function pulseLogo() {
        if (pulsing) {
            logo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                logo.style.transform = 'scale(1)';
                setTimeout(pulseLogo, 1000);
            }, 1000);
        }
    }
    pulseLogo();

    // Start button event listener
    document.getElementById('startButton').addEventListener('click', window.startGame);
})();
