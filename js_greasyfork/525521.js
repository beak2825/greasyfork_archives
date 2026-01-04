// ==UserScript==
// @name         3D Solar System Simulation with Avatar for drawaria.online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remake of Cosmic Galaxy this one Injects a 3D solar system simulation with your avatar
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525521/3D%20Solar%20System%20Simulation%20with%20Avatar%20for%20drawariaonline.user.js
// @updateURL https://update.greasyfork.org/scripts/525521/3D%20Solar%20System%20Simulation%20with%20Avatar%20for%20drawariaonline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the canvas
    const container = document.createElement('div');
    container.id = 'canvas-container';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '9999'; // You may adjust z-index depending on Drawaria's layout
    document.body.appendChild(container);

    // Create an info div
    const info = document.createElement('div');
    info.className = 'info';
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.left = '10px';
    info.style.color = '#fff';
    info.style.fontFamily = 'sans-serif';
    info.style.zIndex = '10000';
    info.textContent = '3D Solar System Simulation';
    document.body.appendChild(info);

    // Include Three.js library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    script.onload = function() {
        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 100, 250);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add ambient light and a point light to simulate the sun's light
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 2, 1500);
        scene.add(sunLight);

        // Utility function to create a planet mesh
        function createPlanet(radius, segments, color, textureUrl) {
            const geometry = new THREE.SphereGeometry(radius, segments, segments);
            const materialOptions = { color: color };
            if (textureUrl) {
                const texture = new THREE.TextureLoader().load(textureUrl);
                materialOptions.map = texture;
            }
            const material = new THREE.MeshStandardMaterial(materialOptions);
            const mesh = new THREE.Mesh(geometry, material);
            return mesh;
        }

        // Create the Sun
        const sunGeometry = new THREE.SphereGeometry(16, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);
        sunLight.position.copy(sun.position);

        // Array to hold each planet's pivot and orbital speed
        const planets = [];

        // Define planet parameters: name, distance from sun, radius, color, and orbital speed
        const planetData = [
            { name: "Mercury", distance: 30, radius: 3, color: 0x888888, speed: 0.04 },
            { name: "Venus",   distance: 45, radius: 4, color: 0xEEDC82, speed: 0.03 },
            { name: "Earth",   distance: 60, radius: 4.2, color: 0x2A75B3, speed: 0.02 },
            { name: "Mars",    distance: 75, radius: 3.5, color: 0xB22222, speed: 0.017 }
        ];

        planetData.forEach(data => {
            // Create a pivot object at the sun's position to simulate orbital rotation
            const pivot = new THREE.Object3D();
            scene.add(pivot);

            // Create the planet mesh and position it along the x-axis
            const planet = createPlanet(data.radius, 32, data.color);
            planet.position.x = data.distance;
            pivot.add(planet);

            // Save the pivot and orbital speed for animation
            planets.push({ pivot: pivot, speed: data.speed });

            // (Optional) Create a visual orbit path as a thin ring
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);
        });

        // Create a starry background using a particle system
        function addStars() {
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 10000;
            const starVertices = [];
            for (let i = 0; i < starCount; i++) {
                const x = THREE.MathUtils.randFloatSpread(2000);
                const y = THREE.MathUtils.randFloatSpread(2000);
                const z = THREE.MathUtils.randFloatSpread(2000);
                starVertices.push(x, y, z);
            }
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);
        }
        addStars();

        // Handle responsiveness: resize renderer and update camera aspect ratio
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Avatar Properties
        const avatar = {
            position: { x: 0, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            maxSpeed: 15,
            acceleration: 0.25,
            friction: 0.985,
            angle: 0,
            element: createAvatarElement()
        };

        function createAvatarElement() {
            const img = new Image();
            img.style.position = 'absolute';
            img.style.width = '60px';
            img.style.height = '60px';
            img.style.transformOrigin = 'center';
            img.style.zIndex = '10000'; // High z-index to ensure it's above other elements
            document.body.appendChild(img);
            return img;
        }

        // Fetch the real avatar URL
        function fetchAvatarURL() {
            const avatarImageElement = document.querySelector('#selfavatarimage');
            if (avatarImageElement) {
                avatar.element.src = avatarImageElement.src;
            } else {
                console.error('Avatar image element not found.');
            }
        }

        // Call the function to fetch the avatar URL
        fetchAvatarURL();

        // Movement System
        const keys = {};
        window.addEventListener('keydown', e => keys[e.key] = true);
        window.addEventListener('keyup', e => keys[e.key] = false);

        function handleMovement() {
            // Acceleration
            if (keys.ArrowRight) avatar.velocity.x += avatar.acceleration;
            if (keys.ArrowLeft) avatar.velocity.x -= avatar.acceleration;
            if (keys.ArrowDown) avatar.velocity.y += avatar.acceleration;
            if (keys.ArrowUp) avatar.velocity.y -= avatar.acceleration;

            // Velocity limits
            avatar.velocity.x = Math.max(-avatar.maxSpeed, Math.min(avatar.velocity.x, avatar.maxSpeed));
            avatar.velocity.y = Math.max(-avatar.maxSpeed, Math.min(avatar.velocity.y, avatar.maxSpeed));

            // Apply friction
            avatar.velocity.x *= avatar.friction;
            avatar.velocity.y *= avatar.friction;

            // Update position
            avatar.position.x += avatar.velocity.x;
            avatar.position.y += avatar.velocity.y;

            // Update avatar display
            avatar.element.style.left = `${avatar.position.x}px`;
            avatar.element.style.top = `${avatar.position.y}px`;

            // Calculate rotation angle
            avatar.angle = Math.atan2(avatar.velocity.y, avatar.velocity.x);
            avatar.element.style.transform = `rotate(${avatar.angle}rad)`;
        }

        // Animation loop to render the scene and update orbital movements
        function animate() {
            requestAnimationFrame(animate);

            // Rotate each planet's pivot to simulate orbiting around the sun
            planets.forEach(item => {
                item.pivot.rotation.y += item.speed;
            });

            // Optional: slowly rotate the sun
            sun.rotation.y += 0.002;

            // Handle avatar movement
            handleMovement();

            renderer.render(scene, camera);
        }
        animate();
    };
    document.head.appendChild(script);
})();
