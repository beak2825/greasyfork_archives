// ==UserScript==
// @name         Drawaria Advanced Particles Generator With Menu
// @namespace    http://tampermonkey.net/
// @version      2025-02-23
// @description  Advanced particle generator with draggable menu for Drawaria, using multiple techniques
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @require      https://unpkg.com/draggabilly@3.0.0/dist/draggabilly.pkgd.min.js
// @require      https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/527788/Drawaria%20Advanced%20Particles%20Generator%20With%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/527788/Drawaria%20Advanced%20Particles%20Generator%20With%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .particle-menu {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(40, 44, 52, 0.9);
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            min-width: 250px; /* Increased width */
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none; /* Prevent text selection */
        }
        .particle-menu h3 {
            color: #fff;
            margin: 0 0 15px 0; /* Increased bottom margin */
            text-align: center;
            cursor: move;
            font-size: 1.2em; /* Larger font */
        }
        .particle-button {
            display: block;
            width: 100%;
            margin: 8px 0; /* Increased vertical margin */
            padding: 10px; /* Increased padding */
            border: none;
            border-radius: 5px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            cursor: pointer;
            transition: 0.3s;
            font-size: 1em; /* Standardized font size */
        }
        .particle-button:hover {
            transform: scale(1.05);
            background: linear-gradient(45deg, #45a049, #4CAF50);
        }
        #particles-js, #canvas-particles, #threejs-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        #threejs-particles {
            z-index: 2; /* Ensure Three.js is above particles.js */
        }

    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Particle Containers ---
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles-js';
    document.body.appendChild(particleContainer);

    const canvasContainer = document.createElement('canvas');
    canvasContainer.id = 'canvas-particles';
    document.body.appendChild(canvasContainer);

    const threejsContainer = document.createElement('div');
    threejsContainer.id = 'threejs-particles';
    document.body.appendChild(threejsContainer);

    // --- Menu ---
    const menu = document.createElement('div');
    menu.className = 'particle-menu';
    menu.innerHTML = `
        <h3>Particle Generator</h3>
        <button class="particle-button" data-type="constellation">✨ Constellation</button>
        <button class="particle-button" data-type="dna">🧬 DNA Helix</button>
        <button class="particle-button" data-type="fireflies">🌟 Fireflies</button>
        <button class="particle-button" data-type="rain">🌧️ Rain</button>
        <button class="particle-button" data-type="atoms">⚛️ Atoms</button>
        <button class="particle-button" data-type="bubbles">🫧 Magic Bubbles</button>
        <button class="particle-button" data-type="matrix">👾 Matrix Rain</button>
        <button class="particle-button" data-type="clear">🧹 Clear</button>
    `;
    document.body.appendChild(menu);

    new Draggabilly(menu, { handle: 'h3' });

    // --- Particle.js Configs (Improved) ---
    const particleConfigs = {
      constellation: {
          particles: {
            number: { value: 150, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "star", polygon: { nb_sides: 5 } },
            opacity: { value: 0.7, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 4, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
          },
          interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
          retina_detect: true
      },
        fireflies: {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 800 } },
                color: { value: "#ffeb3b" },
                shape: { type: "circle" },
                opacity: { value: 0.9, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
            retina_detect: true
        },

        //Basic config for the other systems, just for not get an error
        dna:{},
        rain:{},
        atoms:{},
        bubbles:{},
        matrix:{},
    };




    // --- Canvas-Based Rain (Improved) ---
    let rainParticles = [];
    function initRain() {
        const canvas = document.getElementById('canvas-particles');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        rainParticles = []; // Clear previous particles
        for (let i = 0; i < 200; i++) {
            rainParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 10 + 5,
                speed: Math.random() * 5 + 2,
            });
        }

        function drawRain() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(135, 206, 235, 0.8)'; // Light blue
            ctx.lineWidth = 1;

            for (const particle of rainParticles) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x, particle.y + particle.length);
                ctx.stroke();

                particle.y += particle.speed;
                if (particle.y > canvas.height) {
                    particle.y = Math.random() * -20; // Reset above the screen
                    particle.x = Math.random() * canvas.width; // New random x
                }
            }
            requestAnimationFrame(drawRain);
        }

      drawRain()
    }


    // --- Three.js DNA Helix ---
    let dnaScene, dnaCamera, dnaRenderer, dnaParticles, dnaGroup;

    function initDNA() {
      if (!dnaScene) { // Only initialize once
          dnaScene = new THREE.Scene();
          dnaCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          dnaRenderer = new THREE.WebGLRenderer({ alpha: true }); // Use alpha for transparency
          dnaRenderer.setSize(window.innerWidth, window.innerHeight);
          document.getElementById('threejs-particles').appendChild(dnaRenderer.domElement);
          dnaCamera.position.z = 100;

          // Create a group to hold the particles (for rotation)
          dnaGroup = new THREE.Group();
          dnaScene.add(dnaGroup);

           const particleCount = 200; // More particles for a denser helix
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const helixRadius = 20;
            const angle = (i / particleCount) * Math.PI * 8; // 4 full turns

            // Distribute along the helix
            positions[i3 + 0] = Math.sin(angle) * helixRadius; // X
            positions[i3 + 1] = (i / particleCount) * 80 - 40; // Y (spread along the height)
            positions[i3 + 2] = Math.cos(angle) * helixRadius; // Z
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: 2.5, // Slightly larger
            color: 0xFF4444, // More vibrant red
            transparent: true,
            opacity: 0.7,
        });
        dnaParticles = new THREE.Points(geometry, material);
        dnaGroup.add(dnaParticles);


          // --- Create connecting lines ---
          const lineGeometry = new THREE.BufferGeometry();
          const linePositions = new Float32Array(particleCount * 2 * 3); // * 2 for start/end points
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000, opacity: 0.3, transparent: true });


        // Connect particles along the helix
          for (let i = 0; i < particleCount - 1; i++) { // -1 to avoid connecting the last to the first
            const i6 = i * 6; // * 6 because we have two 3D points per line segment
              linePositions[i6 + 0] = positions[i * 3 + 0];
              linePositions[i6 + 1] = positions[i * 3 + 1];
              linePositions[i6 + 2] = positions[i * 3 + 2];

              linePositions[i6 + 3] = positions[(i + 1) * 3 + 0];
              linePositions[i6 + 4] = positions[(i + 1) * 3 + 1];
              linePositions[i6 + 5] = positions[(i + 1) * 3 + 2];
          }


          lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
          const dnaLines = new THREE.LineSegments(lineGeometry, lineMaterial); //Use LineSegments
          dnaGroup.add(dnaLines);


          // --- Animation Loop ---
          function animateDNA() {
            if (dnaScene) {
                requestAnimationFrame(animateDNA);
                // Rotate the entire group
                dnaGroup.rotation.y += 0.005;  // Rotate around the Y-axis
                dnaGroup.rotation.x += 0.002; // Slight rotation on X for a more dynamic look

                dnaRenderer.render(dnaScene, dnaCamera);
            }
          }
            animateDNA();
        }
    }


   // --- Three.js Atoms ---
let atomsScene, atomsCamera, atomsRenderer, atomParticles, nucleus;

function initAtoms() {
    if (!atomsScene) {
        atomsScene = new THREE.Scene();
        atomsCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        atomsRenderer = new THREE.WebGLRenderer({ alpha: true });
        atomsRenderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('threejs-particles').appendChild(atomsRenderer.domElement);
        atomsCamera.position.z = 100;

        // Nucleus
        const nucleusGeometry = new THREE.SphereGeometry(10, 32, 32);
        const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
        nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        atomsScene.add(nucleus);

        // Electrons (Particles)
        const electronCount = 8; // Fewer electrons
        const electronGeometry = new THREE.BufferGeometry();
        const electronPositions = new Float32Array(electronCount * 3);
        const electronOrbits = []; // Store orbit data (radius, speed)

        for (let i = 0; i < electronCount; i++) {
            const i3 = i * 3;
            // Initial positions (will be updated in animation)
            electronPositions[i3 + 0] = 0;
            electronPositions[i3 + 1] = 0;
            electronPositions[i3 + 2] = 0;

            // Randomize orbit radius and speed
            electronOrbits.push({
                radius: 20 + Math.random() * 30,  // Varying radii
                speed: 0.01 + Math.random() * 0.02, // Varying speeds
                angle: Math.random() * Math.PI * 2, // Start at random angle
            });
        }

        electronGeometry.setAttribute('position', new THREE.BufferAttribute(electronPositions, 3));
        const electronMaterial = new THREE.PointsMaterial({ size: 4, color: 0xffffff });
        atomParticles = new THREE.Points(electronGeometry, electronMaterial);
        atomsScene.add(atomParticles);


        // --- Animation ---
          function animateAtoms() {
              if (atomsScene) {
                  requestAnimationFrame(animateAtoms);

                  // Update electron positions
                  const positions = atomParticles.geometry.attributes.position.array;
                  for (let i = 0; i < electronCount; i++) {
                    const i3 = i * 3;
                    const orbit = electronOrbits[i];

                    // Circular motion
                    orbit.angle += orbit.speed;
                    positions[i3 + 0] = Math.cos(orbit.angle) * orbit.radius; // x
                    positions[i3 + 1] = Math.sin(orbit.angle) * orbit.radius; // y
                    positions[i3 + 2] = 0; // Keep in the same plane (for simplicity)
                   }

                  atomParticles.geometry.attributes.position.needsUpdate = true;

                  // Rotate the nucleus slightly for a more dynamic look.
                  nucleus.rotation.y += 0.005;
                  nucleus.rotation.x += 0.003;

                  atomsRenderer.render(atomsScene, atomsCamera);
              }
            }
        animateAtoms();
    }
}


// --- Three.js Bubbles ---
let bubblesScene, bubblesCamera, bubblesRenderer, bubbleParticles;

function initBubbles() {
    if (!bubblesScene) {
        bubblesScene = new THREE.Scene();
        bubblesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        bubblesRenderer = new THREE.WebGLRenderer({ alpha: true });
        bubblesRenderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('threejs-particles').appendChild(bubblesRenderer.domElement);
        bubblesCamera.position.z = 200; // Further away

        const bubbleCount = 40; // More bubbles
        const bubbleGeometry = new THREE.BufferGeometry();
        const bubblePositions = new Float32Array(bubbleCount * 3);
        const bubbleSizes = new Float32Array(bubbleCount); // Store sizes
        const bubbleSpeeds = new Float32Array(bubbleCount); // Store speeds
        const bubbleColors = []; // Array to store colors

      const colorPalette = [
          new THREE.Color(0x87ceeb), // Sky Blue
          new THREE.Color(0x00bfff), // Deep Sky Blue
          new THREE.Color(0x1e90ff)  // Dodger Blue
      ];


        for (let i = 0; i < bubbleCount; i++) {
            const i3 = i * 3;
            // Random positions within a range
            bubblePositions[i3 + 0] = (Math.random() - 0.5) * 200; // x
            bubblePositions[i3 + 1] = (Math.random() - 0.5) * 200; // y
            bubblePositions[i3 + 2] = (Math.random() - 0.5) * 200; // z

            // Random sizes
            bubbleSizes[i] = 5 + Math.random() * 15;
            //Random Speeds
            bubbleSpeeds[i] = 0.5 + Math.random() * 1.5; // Slower speeds

          // Randomly select a color from the palette
          bubbleColors.push(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
        }

        bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
        bubbleGeometry.setAttribute('size', new THREE.BufferAttribute(bubbleSizes, 1));

        // Shader Material for custom appearance (including varied colors)
        const bubbleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) }, // Default color (will be overridden)
              colors: { value: bubbleColors}
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor; // Pass color to fragment shader
                uniform vec3 colors[${bubbleCount}];
                void main() {
                    vColor = colors[gl_VertexID];
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z); // Scale with distance
                    gl_Position = projectionMatrix * mvPosition;

                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vColor;
                void main() {

                  float distance = length(gl_PointCoord - vec2(0.5, 0.5));
                    if (distance > 0.5) discard; // Make it a circle

                    gl_FragColor = vec4(vColor, 0.5 + (0.5 * (1.0-distance*2.0))); // Use varied color, add gradient
                }
            `,
            transparent: true,
            //blending: THREE.AdditiveBlending // Optional: For a brighter, additive effect
        });


        bubbleParticles = new THREE.Points(bubbleGeometry, bubbleMaterial);
        bubblesScene.add(bubbleParticles);

        function animateBubbles() {
            if(bubblesScene) {
                requestAnimationFrame(animateBubbles);

                const positions = bubbleParticles.geometry.attributes.position.array;
                for (let i = 0; i < bubbleCount; i++) {
                    const i3 = i * 3;
                    positions[i3 + 1] += bubbleSpeeds[i]; // Move upwards

                    // Reset if out of bounds
                    if (positions[i3 + 1] > window.innerHeight / 2) {
                        positions[i3 + 0] = (Math.random() - 0.5) * 200;
                        positions[i3 + 1] = -window.innerHeight / 2;
                        positions[i3 + 2] = (Math.random() - 0.5) * 200;
                    }
                }
                bubbleParticles.geometry.attributes.position.needsUpdate = true;

                bubblesRenderer.render(bubblesScene, bubblesCamera);
            }
        }
        animateBubbles();
    }
}


// --- Canvas Matrix Rain (Working Version) ---
function initMatrix() {
    const canvas = document.getElementById('canvas-particles'); // Use the existing canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // More characters
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'; // More transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green color
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

      function animateMatrix() {
        if (canvas.style.display !== 'none') { // Check if canvas is visible
           drawMatrix();
           requestAnimationFrame(animateMatrix);
        }
    }
    animateMatrix()
}



    // --- Clear Function ---
function clearParticles() {
    // particles.js clear
    particlesJS('particles-js', { particles: { number: { value: 0 } } });

    // Canvas clear
    const canvas = document.getElementById('canvas-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    rainParticles = []; // Reset rain particles array

     // Three.js clear (DNA)
    if (dnaScene) {
      while (dnaScene.children.length > 0) {
        dnaScene.remove(dnaScene.children[0]);
      }
      dnaRenderer.dispose(); // Dispose of resources
      document.getElementById('threejs-particles').innerHTML = ''; // Clear container
    }
    dnaScene = null; // Set to null so it can be reinitialized

     // Three.js clear (Atoms)
    if (atomsScene) {
        while(atomsScene.children.length > 0){
            atomsScene.remove(atomsScene.children[0]);
        }
        atomsRenderer.dispose();
        document.getElementById('threejs-particles').innerHTML = '';
    }
    atomsScene = null;

    // Three.js clear (Bubbles)
    if (bubblesScene) {
        while(bubblesScene.children.length > 0){
            bubblesScene.remove(bubblesScene.children[0]);
        }
        bubblesRenderer.dispose();
        document.getElementById('threejs-particles').innerHTML = '';
    }
    bubblesScene = null;

}


    // --- Event Listener (with improved logic) ---
menu.addEventListener('click', (e) => {
    if (e.target.classList.contains('particle-button')) {
        const type = e.target.dataset.type;
        clearParticles(); // Clear previous effects before starting a new one

        //Hide all canvas
        document.getElementById('particles-js').style.display = 'none';
        document.getElementById('canvas-particles').style.display = 'none';
        document.getElementById('threejs-particles').style.display = 'none';

        switch (type) {
            case 'constellation':
                document.getElementById('particles-js').style.display = 'block';
                particlesJS('particles-js', particleConfigs.constellation);
                break;
            case 'dna':
                document.getElementById('threejs-particles').style.display = 'block';
                initDNA();
                break;
            case 'fireflies':
                document.getElementById('particles-js').style.display = 'block';
                particlesJS('particles-js', particleConfigs.fireflies);
                break;
            case 'rain':
                document.getElementById('canvas-particles').style.display = 'block';
                initRain();
                break;
            case 'atoms':
                document.getElementById('threejs-particles').style.display = 'block';
                initAtoms();
                break;
            case 'bubbles':
                document.getElementById('threejs-particles').style.display = 'block';
                initBubbles();
                break;
            case 'matrix':
                document.getElementById('canvas-particles').style.display = 'block'; // Show canvas
                initMatrix();
                break;
            case 'clear': // Clear is already handled by clearParticles()
                break;
        }
    }
});


    // --- Resize Handling ---
function handleResize() {
    const canvas = document.getElementById('canvas-particles');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //For Rain
        if(rainParticles.length > 0) initRain(); // Re-initialize rain on resize
    }


    // Three.js resize handling (DNA)
    if (dnaRenderer) {
        dnaCamera.aspect = window.innerWidth / window.innerHeight;
        dnaCamera.updateProjectionMatrix();
        dnaRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    // Three.js resize handling (Atoms)
     if (atomsRenderer) {
        atomsCamera.aspect = window.innerWidth / window.innerHeight;
        atomsCamera.updateProjectionMatrix();
        atomsRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    // Three.js resize handling (Bubbles)
    if (bubblesRenderer) {
        bubblesCamera.aspect = window.innerWidth / window.innerHeight;
        bubblesCamera.updateProjectionMatrix();
        bubblesRenderer.setSize(window.innerWidth, window.innerHeight);
    }

}

window.addEventListener('resize', handleResize);


})();