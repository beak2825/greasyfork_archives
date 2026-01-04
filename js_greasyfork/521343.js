// ==UserScript==
// @name         Drawaria Clothing Shop - The Game
// @namespace    http://tampermonkey.net/
// @version      2024-12-20
// @description  Shop now in drawaria with this new shopping game!
// @author       YouTube
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521343/Drawaria%20Clothing%20Shop%20-%20The%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/521343/Drawaria%20Clothing%20Shop%20-%20The%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Datos de la tienda
    const store = {
        name: "My Online Store",
        products: [
            { id: 1, name: "T-Shirt", price: 20, image: "https://www.pngall.com/wp-content/uploads/5/Shirt.png", category: "Clothing", x: 150, y: 150 },
            { id: 2, name: "Pants", price: 30, image: "https://www.pngall.com/wp-content/uploads/5/Cotton-Pant-PNG-Images.png", category: "Clothing", x: 300, y: 150 },
            { id: 3, name: "Shoes", price: 50, image: "https://i.ibb.co/nRqPnQ6/Shirt-fw2-fw.png", category: "Footwear", x: 450, y: 150 }
        ],
        customers: [
            { id: 1, name: "Customer 1", preferences: ["Clothing"], satisfaction: 0, image: "https://media0.giphy.com/media/6GdnEOYPA8JDsxAKg9/source.gif", x: 100, y: 100, holding: null, orientation: 'right', missions: [] }
        ],
        points: 0,
        cart: []
    };

    // Función para inicializar el juego
    function initGame() {
        createStartScreen();
    }

    // Función para crear la pantalla de inicio
    function createStartScreen() {
        const startScreen = document.createElement('div');
        startScreen.id = 'start-screen';
        startScreen.style.position = 'absolute';
        startScreen.style.top = '0';
        startScreen.style.left = '0';
        startScreen.style.width = '100%';
        startScreen.style.height = '100%';
        startScreen.style.background = 'rgb(255,171,0)';
        startScreen.style.background = 'linear-gradient(0deg, rgba(255,171,0,1) 0%, rgba(253,90,45,1) 100%)';
        startScreen.style.zIndex = '0';
        document.body.appendChild(startScreen);

        const logo = document.createElement('img');
        logo.src = 'https://i.ibb.co/5KgYzfQ/logo5-fw.png';
        logo.style.position = 'absolute';
        logo.style.top = '20%';
        logo.style.left = '50%';
        logo.style.transform = 'translateX(-50%)';
        logo.style.width = '600px';
        logo.style.animation = 'pulse 5s infinite';
        document.body.appendChild(logo);

        const startButton = document.createElement('button');
        startButton.innerText = 'Start Game';
        startButton.style.position = 'absolute';
        startButton.style.top = '50%';
        startButton.style.left = '50%';
        startButton.style.transform = 'translate(-50%, -50%)';
        startButton.style.padding = '20px 40px';
        startButton.style.fontSize = '24px';
        startButton.style.background = 'linear-gradient(0deg, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%)';
        startButton.style.color = 'black';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '10px';
        startButton.style.cursor = 'pointer';
        startButton.onclick = startGame;
        document.body.appendChild(startButton);
    }

    // Función para iniciar el juego
    function startGame() {
        // Ocultar todos los elementos de la página
        document.querySelectorAll('body > *').forEach(element => {
            element.style.display = 'none';
        });

        // Mostrar solo el juego
        createGameInterface();
        playBackgroundMusic();
        addEventListeners();
        generateMissions();
    }

    // Función para crear la interfaz del juego
    function createGameInterface() {
        const background = document.createElement('div');
        background.id = 'store-background';
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundImage = 'url("https://png.pngtree.com/background/20211215/original/pngtree-childrens-clothing-store-shopping-mall-photography-map-with-map-picture-image_1485289.jpg")';
        background.style.backgroundSize = 'cover';
        background.style.backgroundPosition = 'center';
        background.style.zIndex = '-1';
        document.body.appendChild(background);

        displayProducts();
        displayCustomers();
        displayCashier();
        displayPoints();
        displayMissions();
        applyStyles();
    }

    // Función para mostrar los productos
    function displayProducts() {
        store.products.forEach(product => {
            const productElement = document.createElement('img');
            productElement.src = product.image;
            productElement.style.position = 'absolute';
            productElement.style.width = '350px';
            productElement.style.top = `${product.y}px`;
            productElement.style.left = `${product.x}px`;
            productElement.id = `product-${product.id}`;
            productElement.dataset.productId = product.id;
            productElement.style.transition = 'transform 0.2s';
            document.body.appendChild(productElement);
        });
    }

    // Función para mostrar los clientes
    function displayCustomers() {
        store.customers.forEach(customer => {
            const customerElement = document.createElement('img');
            customerElement.src = customer.image;
            customerElement.style.position = 'absolute';
            customerElement.style.width = '400px';
            customerElement.style.top = `${customer.y}px`;
            customerElement.style.left = `${customer.x}px`;
            customerElement.id = `customer-${customer.id}`;
            customerElement.dataset.customerId = customer.id;
            customerElement.style.transform = customer.orientation === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
            customerElement.style.transition = 'transform 0.2s, top 0.2s, left 0.2s';
            document.body.appendChild(customerElement);
        });
    }

    // Función para mostrar el cajero
    function displayCashier() {
        const cashier = document.createElement('img');
        cashier.src = "https://app.giz.ai/api/tempFiles/local+seGFKncKYoIrp6CNjcRLt.webp";
        cashier.style.position = 'absolute';
        cashier.style.width = '400px';
        cashier.style.bottom = '10px';
        cashier.style.left = '10px';
        cashier.id = 'cashier';
        document.body.appendChild(cashier);

        const arrow = document.createElement('img');
        arrow.src = "https://clipart-library.com/images/6Tr6R9aac.gif";
        arrow.style.position = 'absolute';
        arrow.style.width = '100px';
        arrow.style.bottom = '120px';
        arrow.style.left = '150px';
        arrow.id = 'arrow';
        document.body.appendChild(arrow);
    }

    // Función para mostrar los puntos
    function displayPoints() {
        const pointsContainer = document.createElement('div');
        pointsContainer.id = 'points-container';
        pointsContainer.style.position = 'absolute';
        pointsContainer.style.top = '10px';
        pointsContainer.style.left = '10px';
        pointsContainer.style.backgroundColor = 'white';
        pointsContainer.style.padding = '10px';
        pointsContainer.style.borderRadius = '5px';
        pointsContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        pointsContainer.innerText = `Points: ${store.points}`;
        document.body.appendChild(pointsContainer);

        const logoBelowPoints = document.createElement('img');
        logoBelowPoints.src = 'https://i.ibb.co/5KgYzfQ/logo5-fw.png';
        logoBelowPoints.style.position = 'absolute';
        logoBelowPoints.style.top = '60px';
        logoBelowPoints.style.left = '700px';
        logoBelowPoints.style.width = '300px';
        logoBelowPoints.style.animation = 'pulse 5s infinite';
        document.body.appendChild(logoBelowPoints);
    }

    // Función para mostrar las misiones
    function displayMissions() {
        const missionsContainer = document.createElement('div');
        missionsContainer.id = 'what-container';
        missionsContainer.style.position = 'absolute';
        missionsContainer.style.top = '10px';
        missionsContainer.style.right = '10px';
        missionsContainer.style.backgroundColor = 'white';
        missionsContainer.style.padding = '10px';
        missionsContainer.style.borderRadius = '5px';
        missionsContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        missionsContainer.innerText = '';
        document.body.appendChild(missionsContainer);

        store.customers[0].missions.forEach((mission, index) => {
            const missionElement = document.createElement('div');
            missionElement.innerText = `${index + 1}. ${mission.description} - Reward: ${mission.reward} points`;
            missionsContainer.appendChild(missionElement);
        });
    }

    // Función para actualizar los puntos
    function updatePoints() {
        const pointsContainer = document.getElementById('points-container');
        pointsContainer.innerText = `Points: ${store.points}`;
    }

    // Función para reproducir la música de fondo
    function playBackgroundMusic() {
        const audio = new Audio('https://www.myinstants.com/media/sounds/money_2.mp3');
        audio.loop = true;
        audio.play();
    }

    // Función para aplicar estilos
    function applyStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            #store-background {
                background-image: url('https://png.pngtree.com/background/20211215/original/pngtree-childrens-clothing-store-shopping-mall-photography-map-with-map-picture-image_1485289.jpg');
                background-size: cover;
                background-position: center;
            }
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }
            .purchase-effect {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                opacity: 0;
                transform: scale(0);
                animation: purchase-animation 0.5s forwards;
            }
            @keyframes purchase-animation {
                0% {
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(1.5);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Función para agregar event listeners
    function addEventListeners() {
        document.addEventListener('keydown', moveCustomer);
        document.addEventListener('keyup', stopCustomer);
    }

    // Variables para el movimiento del cliente
    let currentCustomer = store.customers[0];
    let moveInterval = null;

    // Función para mover al cliente
    function moveCustomer(event) {
        if (currentCustomer) {
            const customerElement = document.getElementById(`customer-${currentCustomer.id}`);
            const speed = 20; // Aumentar la velocidad de movimiento
            let newX = currentCustomer.x;
            let newY = currentCustomer.y;

            if (event.key === 'ArrowUp') newY -= speed;
            if (event.key === 'ArrowDown') newY += speed;
            if (event.key === 'ArrowLeft') {
                newX -= speed;
                currentCustomer.orientation = 'left';
            }
            if (event.key === 'ArrowRight') {
                newX += speed;
                currentCustomer.orientation = 'right';
            }

            // Restringir el movimiento dentro de los límites de la pantalla
            newX = Math.max(0, Math.min(window.innerWidth - 400, newX));
            newY = Math.max(0, Math.min(window.innerHeight - 400, newY));

            currentCustomer.x = newX;
            currentCustomer.y = newY;
            customerElement.style.top = `${newY}px`;
            customerElement.style.left = `${newX}px`;
            customerElement.style.transform = currentCustomer.orientation === 'left' ? 'scaleX(-1)' : 'scaleX(1)';

            checkCollision(currentCustomer);
        }
    }

    // Función para detener el movimiento del cliente
    function stopCustomer(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            clearInterval(moveInterval);
            moveInterval = null;
        }
    }

    // Función para verificar colisiones
    function checkCollision(customer) {
        const customerElement = document.getElementById(`customer-${customer.id}`);
        const cashierElement = document.getElementById('cashier');

        store.products.forEach(product => {
            const productElement = document.getElementById(`product-${product.id}`);
            if (productElement && isColliding(customerElement, productElement)) {
                customer.holding = product;
                productElement.style.display = 'none';
                playPickupSound();
            }
        });

        if (customer.holding && isColliding(customerElement, cashierElement)) {
            completePurchase(customer);
        }
    }

    // Función para verificar si dos elementos están colisionando
    function isColliding(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    // Función para completar la compra
    function completePurchase(customer) {
        if (customer.holding) {
            store.points += customer.holding.price;
            updatePoints();
            const product = customer.holding;
            customer.holding = null;
            customer.satisfaction += 1;
            alert(`${customer.name} has purchased a product. Satisfaction: ${customer.satisfaction}`);
            respawnProduct(product);
            createPurchaseEffect(customerElement);
            checkMissions(customer);
            checkLevelUp();
        }
    }

    // Función para reaparecer el producto en otra parte de la pantalla
    function respawnProduct(product) {
        product.x = Math.floor(Math.random() * (window.innerWidth - 200)) + 100;
        product.y = Math.floor(Math.random() * (window.innerHeight - 200)) + 100;
        const productElement = document.getElementById(`product-${product.id}`);
        productElement.style.top = `${product.y}px`;
        productElement.style.left = `${product.x}px`;
        productElement.style.display = 'block';
    }

    // Función para reproducir el sonido de recogida
    function playPickupSound() {
        const audio = new Audio('https://www.myinstants.com/media/sounds/money-soundfx.mp3');
        audio.play();
    }

    // Función para crear un efecto de compra
    function createPurchaseEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'purchase-effect';
        effect.style.top = `${element.offsetTop}px`;
        effect.style.left = `${element.offsetLeft}px`;
        effect.style.width = '100px';
        effect.style.height = '100px';
        document.body.appendChild(effect);
        setTimeout(() => document.body.removeChild(effect), 500);
    }

    // Función para generar misiones
    function generateMissions() {
        store.customers[0].missions = [
            { description: "Buy 5 T-Shirts", completed: false, reward: 50 },
            { description: "Buy 3 Pants", completed: false, reward: 30 }
        ];
    }

    // Función para verificar misiones
    function checkMissions(customer) {
        customer.missions.forEach(mission => {
            if (!mission.completed) {
                const productCount = store.products.filter(product => product.name === mission.description.split(' ')[1]).length;
                if (productCount >= parseInt(mission.description.split(' ')[1])) {
                    mission.completed = true;
                    store.points += mission.reward;
                    updatePoints();
                    alert(`Mission completed: ${mission.description}. Reward: ${mission.reward} points`);
                }
            }
        });
    }

    // Función para verificar si el jugador sube de nivel
    function checkLevelUp() {
        const pointsNeeded = 100; // Puntos necesarios para subir de nivel
        if (store.points >= pointsNeeded) {
            store.points -= pointsNeeded;
            updatePoints();
            alert(`You Level Up! Now you have ${store.points} points.`);
        }
    }

    // Inicializar el juego
    initGame();

})();
