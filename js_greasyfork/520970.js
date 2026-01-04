// ==UserScript==
// @name         Drawaria online Monster Scape - The Game
// @namespace    http://tampermonkey.net/
// @version      2024-12-16
// @description  Be Ready for the challenge, Kick the enemies, the game will turn scary!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520970/Drawaria%20online%20Monster%20Scape%20-%20The%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/520970/Drawaria%20online%20Monster%20Scape%20-%20The%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let overlay;
    let bossHealth = 20;
    let boss;
    let healthBar;
    let scoreBar;
    let score = 0;
    let audio;
    let musicPlaying = false;
    let punchSound;
    let boneCrackSound;
    let logoShown = false;

            showLogo();
            darkenEnvironment();
            createBoss();
            createHealthBar();
            createScoreBar();
            loadSounds();

    // Función para hacer que todo se vea más oscuro
    function darkenEnvironment() {
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(100, 0, 0, 1)';
        overlay.style.zIndex = '0';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
    }

    // Inicializar el entorno de terror
    function initTerrorEnvironment() {
        if (!logoShown) {

            logoShown = true;
        } else {
            darkenEnvironment();
            createBoss();
            createHealthBar();
            createScoreBar();
            loadSounds();
        }
    }

    // Crear el jefe (boss)
    function createBoss() {
        boss = document.createElement('img');
        boss.src = 'https://wiki.xilero.net/images/b/b2/3076m.gif';
        boss.style.position = 'absolute';
        boss.style.width = '150px';
        boss.style.height = '150px';
        boss.style.top = Math.random() * window.innerHeight + 'px';
        boss.style.left = Math.random() * window.innerWidth + 'px';
        boss.style.zIndex = '1002';
        boss.style.pointerEvents = 'auto';
        boss.style.cursor = 'pointer';
        document.body.appendChild(boss);

        // Mover el jefe de manera inteligente
        moveBoss();

        // Manejar clics en el jefe
        boss.addEventListener('click', () => {
            if (!musicPlaying) {
                playBackgroundMusic();
                musicPlaying = true;
            }
            punchSound.play();
            bossHealth--;
            updateHealthBar();
            updateScore(100);
            if (bossHealth > 0) {
                // Simular que el jefe fue golpeado
                boss.style.left = Math.random() * window.innerWidth + 'px';
                boss.style.top = Math.random() * window.innerHeight + 'px';
            } else {
                // El jefe ha sido derrotado
                alert('YOU WIN! THANKS FOR PLAYING.');
                restoreGame();
            }
        });
    }

    // Mover el jefe de manera inteligente
    function moveBoss() {
        const bossX = parseInt(boss.style.left);
        const bossY = parseInt(boss.style.top);

        // Generar una nueva posición objetivo aleatoria dentro de los límites de la pantalla
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;

        // Calcular la dirección hacia el objetivo
        const deltaX = targetX - bossX;
        const deltaY = targetY - bossY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Velocidad de movimiento del jefe
        const speed = 1;

        // Mover el jefe hacia el objetivo
        if (distance > speed) {
            const moveX = (deltaX / distance) * speed;
            const moveY = (deltaY / distance) * speed;
            boss.style.left = (bossX + moveX) + 'px';
            boss.style.top = (bossY + moveY) + 'px';
        } else {
            // Si el jefe está muy cerca del objetivo, generar una nueva posición objetivo
            boss.style.left = targetX + 'px';
            boss.style.top = targetY + 'px';
        }

        requestAnimationFrame(moveBoss);
    }

    // Crear la barra de vida del jefe
    function createHealthBar() {
        healthBar = document.createElement('div');
        healthBar.style.position = 'fixed';
        healthBar.style.top = '20px';
        healthBar.style.left = '20px';
        healthBar.style.width = '200px';
        healthBar.style.height = '40px';
        healthBar.style.backgroundColor = 'red';
        healthBar.style.zIndex = '1003';
        healthBar.style.border = '4px solid black';
        document.body.appendChild(healthBar);


        const health = document.createElement('div');
        health.style.width = '100%';
        health.style.height = '100%';
        health.style.backgroundColor = 'green';
        healthBar.appendChild(health);
    }

    // Actualizar la barra de vida del jefe
    function updateHealthBar() {
        const health = healthBar.firstChild;
        health.style.width = (bossHealth / 20) * 100 + '%';

    }

    // Crear la barra de puntuación
    function createScoreBar() {
        scoreBar = document.createElement('div');
        scoreBar.style.position = 'fixed';
        scoreBar.style.top = '80px';
        scoreBar.style.left = '20px';
        scoreBar.style.width = '200px';
        scoreBar.style.height = '40px';
        scoreBar.style.backgroundColor = 'blue';
        scoreBar.style.zIndex = '1003';
        scoreBar.style.border = '4px solid black';
        scoreBar.style.color = 'white';
        scoreBar.style.textAlign = 'center';
        scoreBar.style.lineHeight = '40px';
        scoreBar.style.fontSize = '20px';
        scoreBar.textContent = 'Score: 0';
        document.body.appendChild(scoreBar);
    }

    // Actualizar la puntuación
    function updateScore(points) {
        score += points;
        scoreBar.textContent = 'Score: ' + score;
    }

    // Reproducir música de fondo en bucle
    function playBackgroundMusic() {
        audio = new Audio('https://www.mariowiki.com/images/0/06/SM3DL-World_8_%28Part_2%29.oga');
        audio.loop = true;
        audio.play();
    }

    // Cargar sonidos
    function loadSounds() {
        punchSound = new Audio('https://www.myinstants.com/media/sounds/punch_u4LmMsr.mp3');
        boneCrackSound = new Audio('https://www.myinstants.com/media/sounds/punch_u4LmMsr.mp3');
    }

    // Restaurar el juego a la normalidad
    function restoreGame() {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        if (overlay) {
            overlay.remove();
        }
        if (boss) {
            boss.remove();
        }
        if (healthBar) {
            healthBar.remove();
        }
        if (scoreBar) {
            scoreBar.remove();
        }
        if (audio) {
            audio.pause();
        }
        // Eliminar otros elementos (fuego, zombies, llave)
        const fireContainer = document.querySelector('.fire-container');
        const zombieContainer = document.querySelector('.zombie-container');
        const key = document.querySelector('.key');
        if (fireContainer) {
            fireContainer.remove();
        }
        if (zombieContainer) {
            zombieContainer.remove();
        }
        if (key) {
            key.remove();
        }
    }

    // Esperar a que la página esté completamente cargadboa
    window.addEventListener('load', initTerrorEnvironment);

    // Crear un ambiente oscuro
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'red';

    // Crear fuego en pequeñas partes por toda la pantalla
    const fireContainer = document.createElement('div');
    fireContainer.className = 'fire-container';
    fireContainer.style.position = 'fixed';
    fireContainer.style.top = '0';
    fireContainer.style.left = '0';
    fireContainer.style.width = '100%';
    fireContainer.style.height = '100%';
    fireContainer.style.zIndex = '1000';
    fireContainer.style.pointerEvents = 'none';
    document.body.appendChild(fireContainer);

    for (let i = 0; i < 50; i++) {
        const fire = document.createElement('img');
        fire.src = 'https://th.bing.com/th/id/R.85ea5080fc533cf2ad8d68dcce5fe4a4?rik=nKZUhv6pwxYEPA&pid=ImgRaw&r=0';
        fire.style.position = 'absolute';
        fire.style.width = '50px';
        fire.style.height = '50px';
        fire.style.top = Math.random() * window.innerHeight + 'px';
        fire.style.left = Math.random() * window.innerWidth + 'px';
        fireContainer.appendChild(fire);
    }

    // Crear zombies que caminan alrededor de la pantalla
    const zombieContainer = document.createElement('div');
    zombieContainer.className = 'zombie-container';
    zombieContainer.style.position = 'fixed';
    zombieContainer.style.top = '0';
    zombieContainer.style.left = '0';
    zombieContainer.style.width = '100%';
    zombieContainer.style.height = '100%';
    zombieContainer.style.zIndex = '999';
    zombieContainer.style.pointerEvents = 'none';
    document.body.appendChild(zombieContainer);

    const zombies = [];
    for (let i = 0; i < 10; i++) {
        const zombie = document.createElement('img');
        zombie.src = 'https://www.gifss.com/terror/demonios/11.gif';
        zombie.style.position = 'absolute';
        zombie.style.width = '100px';
        zombie.style.height = '100px';
        zombie.style.top = Math.random() * window.innerHeight + 'px';
        zombie.style.left = Math.random() * window.innerWidth + 'px';
        zombie.style.pointerEvents = 'auto';
        zombie.style.cursor = 'pointer';
        zombieContainer.appendChild(zombie);
        zombies.push(zombie);

        // Manejar clics en los zombies
        zombie.addEventListener('click', () => {
            boneCrackSound.play();
            updateScore(100);
            // Hacer que el zombie huya corriendo
            const originalSpeed = 2;
            const fleeSpeed = 10;
            const fleeDuration = 3000; // 3 segundos

            function flee() {
                const zombieX = parseInt(zombie.style.left);
                const zombieY = parseInt(zombie.style.top);

                // Generar una nueva posición objetivo aleatoria dentro de los límites de la pantalla
                const targetX = Math.random() * window.innerWidth;
                const targetY = Math.random() * window.innerHeight;

                // Calcular la dirección hacia el objetivo
                const deltaX = targetX - zombieX;
                const deltaY = targetY - zombieY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // Mover el zombie hacia el objetivo
                if (distance > fleeSpeed) {
                    const moveX = (deltaX / distance) * fleeSpeed;
                    const moveY = (deltaY / distance) * fleeSpeed;
                    zombie.style.left = (zombieX + moveX) + 'px';
                    zombie.style.top = (zombieY + moveY) + 'px';
                } else {
                    // Si el zombie está muy cerca del objetivo, generar una nueva posición objetivo
                    zombie.style.left = targetX + 'px';
                    zombie.style.top = targetY + 'px';
                }

                if (distance > fleeSpeed) {
                    requestAnimationFrame(flee);
                } else {
                    // Volver al movimiento normal después de 3 segundos
                    setTimeout(() => {
                        moveZombies();
                    }, fleeDuration);
                }
            }

            flee();
        });
    }

    // Hacer que los zombies caminen alrededor de la pantalla de manera inteligente
    function moveZombies() {
        zombies.forEach(zombie => {
            const zombieX = parseInt(zombie.style.left);
            const zombieY = parseInt(zombie.style.top);

            // Generar una nueva posición objetivo aleatoria dentro de los límites de la pantalla
            const targetX = Math.random() * window.innerWidth;
            const targetY = Math.random() * window.innerHeight;

            // Calcular la dirección hacia el objetivo
            const deltaX = targetX - zombieX;
            const deltaY = targetY - zombieY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Velocidad de movimiento del zombie
            const speed = 2;

            // Mover el zombie hacia el objetivo
            if (distance > speed) {
                const moveX = (deltaX / distance) * speed;
                const moveY = (deltaY / distance) * speed;
                zombie.style.left = (zombieX + moveX) + 'px';
                zombie.style.top = (zombieY + moveY) + 'px';
            } else {
                // Si el zombie está muy cerca del objetivo, generar una nueva posición objetivo
                zombie.style.left = targetX + 'px';
                zombie.style.top = targetY + 'px';
            }
        });

        requestAnimationFrame(moveZombies);
    }

    moveZombies();

    // Crear una llave escondida con movimiento inteligente
    const key = document.createElement('img');
    key.className = 'key';
    key.src = 'https://www.gifss.com/herramientas/llaves/100.gif';
    key.style.position = 'absolute';
    key.style.width = '5px';
    key.style.height = '0px';
    key.style.top = Math.random() * window.innerHeight + 'px';
    key.style.left = Math.random() * window.innerWidth + 'px';
    key.style.zIndex = '1001';
    key.style.pointerEvents = 'auto';
    key.style.cursor = 'pointer';
    document.body.appendChild(key);

    // Hacer que la llave se mueva de manera inteligente
    function moveKey() {
        const keyX = parseInt(key.style.left);
        const keyY = parseInt(key.style.top);

        // Generar una nueva posición objetivo aleatoria dentro de los límites de la pantalla
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;

        // Calcular la dirección hacia el objetivo
        const deltaX = targetX - keyX;
        const deltaY = targetY - keyY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Velocidad de movimiento de la llave
        const speed = 1;

        // Mover la llave hacia el objetivo
        if (distance > speed) {
            const moveX = (deltaX / distance) * speed;
            const moveY = (deltaY / distance) * speed;
            key.style.left = (keyX + moveX) + 'px';
            key.style.top = (keyY + moveY) + 'px';
        } else {
            // Si la llave está muy cerca del objetivo, generar una nueva posición objetivo
            key.style.left = targetX + 'px';
            key.style.top = targetY + 'px';
        }

        requestAnimationFrame(moveKey);
    }

    moveKey();

    // Cuando el jugador encuentra la llave, todo vuelve a la normalidad
    key.addEventListener('click', () => {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        if (overlay) {
            overlay.remove();
        }
        if (boss) {
            boss.remove();
        }
        if (healthBar) {
            healthBar.remove();
        }
        if (scoreBar) {
            scoreBar.remove();
        }
        if (audio) {
            audio.pause();
        }
        fireContainer.remove();
        zombieContainer.remove();
        key.remove();
        alert('');
    });

    // Mostrar el logo al iniciar el juego
    function showLogo() {
        const logo = document.createElement('img');
        logo.src = 'https://i.ibb.co/jrbbV93/logo3-fw.png';
        logo.style.position = 'fixed';
        logo.style.top = '50%';
        logo.style.left = '50%';
        logo.style.transform = 'translate(-50%, -50%) scale(1)';
        logo.style.zIndex = '1004';
        logo.style.transition = 'opacity 6s ease-in-out, transform 6s ease-in-out';
        document.body.appendChild(logo);

        setTimeout(() => {
            logo.style.opacity = '0';
            logo.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }, 100);

        setTimeout(() => {
            logo.remove();
        }, 6000);
    }

})();
