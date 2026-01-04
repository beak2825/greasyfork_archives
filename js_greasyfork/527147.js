// ==UserScript==
// @name         Drawaria.online Canvas Effects
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An ADVANCED effects menu for Drawaria.online Canvas, with many options and libraries!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
// @require      https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js
// @require      https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FontLoader.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527147/Drawariaonline%20Canvas%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/527147/Drawariaonline%20Canvas%20Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---  LIBRARY SETUP  ---

    // Three.js: Scene, camera, renderer, and a container for 3D objects.
    let scene, camera, renderer, threeContainer;
    let threeObjects = []; // Array to keep track of Three.js objects

    // GSAP: Global timeline to control animations (optional, but useful).
    // const tl = gsap.timeline({ paused: true }); // A global timeline is not used in this example

    // Matter.js: Physics engine.
    let engine, world;
    let canvas; // Reference to the Drawaria canvas.


    // ---  UTILITY FUNCTIONS (MODIFIED) ---

    function initThreeJS() {
        if (scene) return; // Avoid re-initializing if it already exists.

        if (!threeContainer) { // Check if threeContainer exists before trying to append
            threeContainer = document.createElement('div');
            threeContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none; /*  VERY IMPORTANT: Allows clicks to "pass through" to the Drawaria canvas. */
                z-index: 500; /*  Above the Drawaria canvas, but below the menu. */
            `;
            document.body.appendChild(threeContainer);
        }


        if (!scene) {
            scene = new THREE.Scene();
        }
        if (!camera) {
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5; // Adjust as needed.
        }
        if (!renderer) {
            renderer = new THREE.WebGLRenderer({ alpha: true }); //  alpha: true is CRUCIAL for transparency.
            renderer.setSize(window.innerWidth, window.innerHeight);
            threeContainer.appendChild(renderer.domElement);
        }


        // Basic ambient light (so objects are not completely black).
        if (!scene.getObjectByName('ambientLight')) { // Check if ambient light already exists
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            ambientLight.name = 'ambientLight'; // Name it for easy checking
            scene.add(ambientLight);
        }

         // Directional light.
         if (!scene.getObjectByName('directionalLight')) { // Check if directional light already exists
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1); // Direction of light.
            directionalLight.name = 'directionalLight'; // Name it
            scene.add(directionalLight);
        }


        // Resize Three.js when the window is resized.
        window.addEventListener('resize', onWindowResize, false);

        animateThreeJS(); // Start the rendering loop.
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);
        // Basic rotation of *all* Three.js objects (to demonstrate it's working).
        threeObjects.forEach(obj => {
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }

    function initMatterJS() {
        if (engine) return;

        engine = Matter.Engine.create();
        world = engine.world;

         // Gravity settings (you can modify)
         engine.world.gravity.y = 1; // Gravity downwards

        Matter.Engine.run(engine);
    }

    function getCanvas(){
        if(!canvas) {
            canvas = document.querySelector('canvas');
        }
        return canvas;
    }



    // ---  EFFECTS (IMPLEMENTATIONS) ---
     function createText3D(text, options = {}) {
        initThreeJS(); // Make sure Three.js is initialized.
        const loader = new THREE.FontLoader();

        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: options.size || 0.5,
                height: options.height || 0.1,
                curveSegments: options.curveSegments || 12,
                bevelEnabled: options.bevelEnabled || false,
                bevelThickness: options.bevelThickness || 0.03,
                bevelSize: options.bevelSize || 0.02,
                bevelOffset: options.bevelOffset || 0,
                bevelSegments: options.bevelSegments || 5
            });

            const textMaterial = new THREE.MeshPhongMaterial({ color: options.color || 0xff0000 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Position, rotation, etc., using options.
            textMesh.position.x = options.x || 0;
            textMesh.position.y = options.y || 0;
            textMesh.position.z = options.z || 0;

            if (options.rotationX) textMesh.rotation.x = options.rotationX;
            if (options.rotationY) textMesh.rotation.y = options.rotationY;
            if (options.rotationZ) textMesh.rotation.z = options.rotationZ;


            scene.add(textMesh);
            threeObjects.push(textMesh); // Add to the array for global animation.

            // Animation with GSAP (optional, but recommended).
            if(options.animate){
                 gsap.to(textMesh.position, {
                    duration: options.duration || 2,
                    y: options.toY || 2,
                    repeat: options.repeat || -1,
                    yoyo: options.yoyo !== undefined ? options.yoyo : true, // Control yoyo with options.
                    ease: options.ease || "power2.inOut"
                 });
            }
        });
    }


    let movingTexts = []; // Array to store references to moving texts
    let movingGraphicsInterval; // For moving graphics animation interval
    let graphics3DObjects = []; // Array for 3D graphics objects

    function createMovingText(text, options = {}) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.cssText = `
            position: absolute;
            top: ${options.y || '50%'};
            left: ${options.x || '50%'};
            transform: translate(-50%, -50%);
            color: ${options.color || 'white'};
            font-size: ${options.fontSize || '24px'};
            pointer-events: none; /*  Important so that it doesn't interfere with drawing. */
            z-index: 500;
        `;
        document.body.appendChild(textElement);

        // Store a reference to the GSAP timeline to be able to control it later.
        const tl = gsap.to(textElement, {
            duration: options.duration || 3,
            x: options.toX || '+=200',  // Move 200px to the right (relative).
            y: options.toY || '+=0', // You can move in Y as well.
            rotation: options.rotation || 360,
            repeat: options.repeat || -1, // Repeat infinitely.
            yoyo: options.yoyo !== undefined ? options.yoyo : true, // Control yoyo with options.
            ease: options.ease || "power1.inOut",
            onComplete: () => {
                if (options.removeOnComplete) {
                    textElement.remove(); // Remove the element on completion (optional).
                }
                 // Remove the reference from the array when the animation completes.
                movingTexts = movingTexts.filter(item => item.element !== textElement);
            }
        });

        // Save the reference to the element and the timeline.
        movingTexts.push({ element: textElement, timeline: tl });
    }


    function createParticleExplosion(options = {}) {
      initThreeJS(); // Make sure Three.js is ready.
      initMatterJS();

      const numParticles = options.numParticles || 50;
      const particleSize = options.size || 0.05;
      const color = options.color || 0xffffff;
      const duration = options.duration || 2;
      const spread = options.spread || 1; // Controls how much particles spread out.

        const particles = [];

       for (let i = 0; i < numParticles; i++) {
        // Geometry and material for each particle (Three.js).
          const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
          const material = new THREE.MeshBasicMaterial({ color: color });
          const particle = new THREE.Mesh(geometry, material);

          // Initial position (center of the explosion).
           particle.position.set(
                (options.x || 0),
                (options.y || 0),
                (options.z || 0)
           );

          scene.add(particle);
          threeObjects.push(particle);  // For global rotation in animateThreeJS.
          particles.push(particle);

        // Matter.js
         const body = Matter.Bodies.circle(
            (options.x || 0) *100 , // Adjust the scale to the Matter.js world
            -(options.y || 0)* 100, // Adjust the scale to the Matter.js world
             particleSize * 100,
             {restitution: 0.6, friction: 0.1}
         );

          // Apply an initial force (explosion).
          const force = (options.force || 0.5) * spread;
          const angle = Math.random() * Math.PI * 2;
          Matter.Body.applyForce(body, body.position, {
              x: Math.cos(angle) * force,
              y: Math.sin(angle) * force
          });

           Matter.World.add(world, body);


           // Animation with GSAP to fade out and scale down.
            gsap.to(particle.scale, {
                duration: duration,
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
               onUpdate: () => {
                // Synchronize the Three.js position with Matter.js.
                particle.position.x = body.position.x / 100;
                particle.position.y = -body.position.y / 100;
                particle.position.z = (options.z || 0);
                },
                onComplete: () => {
                    // Clean up the particle from Three.js and Matter.js.
                    scene.remove(particle);
                     threeObjects.splice(threeObjects.indexOf(particle), 1);
                    Matter.World.remove(world, body);

                }
            });
      }
    }


    function applyFilterEffect(effectId, isActive) {
        const canvas = getCanvas(); //Get the canvas safely
        if (!canvas) return;

        if (isActive) {
            canvas.classList.add(effectId); // Add the class
        } else {
            canvas.classList.remove(effectId); // Remove the class
        }
    }

    // --- Placeholder Effects (Implement basic alerts or console logs for unimplemented effects) ---
    function applyPlaceholderEffect(effectId, isActive) {
        if (isActive) {
            console.log(`Effect ${effectId} ACTIVATED (Placeholder)`); // Or alert(`Efecto ${effectId} ACTIVATED (Placeholder)`);
            const canvas = getCanvas();
            if(canvas) canvas.classList.add('placeholder-effect-indicator'); // Add visual indicator
        } else {
            console.log(`Effect ${effectId} DEACTIVATED (Placeholder)`); // Or alert(`Efecto ${effectId} DESACTIVADO (Placeholder)`);
            const canvas = getCanvas();
            if(canvas) canvas.classList.remove('placeholder-effect-indicator'); // Remove visual indicator
        }
    }

    function createMovingGraphics(isActive) {
        if (isActive) {
            initThreeJS();
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            threeObjects.push(cube);
            graphics3DObjects.push(cube); // Add to separate array for graphics

            // Basic animation using setInterval (can be replaced with GSAP for smoother animation)
            movingGraphicsInterval = setInterval(() => {
                cube.position.x = Math.sin(Date.now() * 0.001) * 2; // Move horizontally
                cube.position.y = Math.cos(Date.now() * 0.001) * 1.5; // Move vertically
            }, 16); // Roughly 60 FPS
        } else {
            clearInterval(movingGraphicsInterval);
            graphics3DObjects.forEach(obj => {
                scene.remove(obj);
                threeObjects.splice(threeObjects.indexOf(obj), 1);
            });
            graphics3DObjects = [];
        }
    }

    function createGraphics3D(isActive) {
        if (isActive) {
            initThreeJS();
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0xff8800, metalness: 0.5, roughness: 0.1 }); // More interesting material
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            threeObjects.push(sphere);
            graphics3DObjects.push(sphere); // Add to graphics objects array

            sphere.position.set(2, 0, 0); // Position it to the side
        } else {
            graphics3DObjects.forEach(obj => {
                scene.remove(obj);
                threeObjects.splice(threeObjects.indexOf(obj), 1);
            });
            graphics3DObjects = [];
        }
    }

    function createCharacterAnimation(isActive) {
        applyPlaceholderEffect("character-animation", isActive); // Placeholder for now. Complex to implement without assets/models
    }

    function createObjectAnimation(isActive) {
        applyPlaceholderEffect("object-animation", isActive); // Placeholder, could be animations on existing 3D objects
    }

    function createTextAnimation(isActive) {
        applyPlaceholderEffect("text-animation", isActive); // Placeholder, could be more complex text animations than moving text
    }

    function createGraphicsAnimation(isActive) {
        applyPlaceholderEffect("graphics-animation", isActive); // Placeholder, could be animations of 3D graphics objects
    }

    function applyARGeneral(isActive) {
        applyPlaceholderEffect("ar-general", isActive); // AR General Placeholder - very complex, needs device access and tracking
    }

    function applyARText(isActive) {
        applyPlaceholderEffect("ar-text", isActive); // AR Text Placeholder - requires AR setup
    }

    function applyARGraphics(isActive) {
        applyPlaceholderEffect("ar-graphics", isActive); // AR Graphics Placeholder - requires AR setup
    }


     // --- Menu Structure (HTML) ---
    const menuHTML = `
    <div id="effects-menu" style="position: fixed; top: 10px; left: 10px; z-index: 1000; background-color: #222; color: #fff; border-radius: 5px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); display: none;">
        <div id="menu-header" style="cursor: move; padding-bottom: 5px; border-bottom: 1px solid #444; margin-bottom: 5px; user-select: none;">
            <span style="font-weight: bold;">Enhanced Effects</span>
            <button id="close-menu" style="float: right; background: none; border: none; color: #fff; font-size: 1.2em; cursor: pointer;">×</button>
        </div>
        <div id="menu-content" style="overflow-y: auto; max-height: 80vh; padding-right: 5px;">  <!-- Container with scroll -->
            <div class="category">
                <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Filters and Adjustments</summary>
                    ${createEffectGroup("Filters", [
                        { name: "Blur", id: "blur" },
                        { name: "Focus", id: "focus" },
                        { name: "Color Change", id: "color-change" },
                        { name: "Brightness", id: "brightness" },
                        { name: "Contrast", id: "contrast" },
                        { name: "Saturation", id: "saturation" },
                        { name: "Temperature", id: "temperature" },
                        { name: "Fog Adjust", id: "fog-adjust" }
                    ])}
                </details>
            </div>

              <div class="category">
                <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Weather Effects</summary>
                    ${createEffectGroup("Weather", [
                         { name: "Snow", id: "snow-change" },
                         { name: "Rain", id: "rain-change" },
                         { name: "Wind", id: "wind-change"},
                         { name: "Fog", id: "fog-change" }
                    ])}
                </details>
            </div>

            <div class="category">
                <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Elemental Effects</summary>
                    ${createEffectGroup("Elemental", [
                        {name: "Water", id: "water-change"},
                        {name: "Fire", id: "fire-change"},
                        {name: "Explosion", id:"explosion-change"},
                        { name: "Impact", id: "impact-change" },
                        { name: "Shock", id: "shock-change" }
                    ])}

                </details>
            </div>

             <div class="category">
                <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Explosion Effects (Combined)</summary>
                   ${createEffectGroup("Combined Explosions", [
                        { name: "Water", id: "explosion-water" },
                        { name: "Fire", id: "explosion-fire" },
                        { name: "Fog", id: "explosion-fog" },
                        { name: "Snow", id: "explosion-snow" },
                        { name: "Rain", id: "explosion-rain" },
                        { name: "Wind", id: "explosion-wind" }
                   ])}
                </details>
            </div>

            <div class="category">
                <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Light and Shadow Effects</summary>
                      ${createEffectGroup("Light and Shadow", [
                        {name: "Light Effects", id:"light-effects"},
                        {name: "Shadow Effects", id: "shadow-effects"}
                    ])}

                </details>
            </div>
              <div class="category">
                <details>
                  <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Text and Graphics</summary>

                    ${createEffectGroup("Text and Graphics", [
                        {name: "Moving Text", id: "moving-text"},
                        {name: "Moving Graphics", id: "moving-graphics"},
                        {name: "3D Text", id: "text-3d"},
                        {name: "3D Graphics", id: "graphics-3d"}
                    ])}
                </details>
            </div>

            <div class="category">
                <details>
                  <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Animations (Advanced)</summary>
                    ${createEffectGroup("Animations", [
                        {name: "Character Animation", id: "character-animation"},
                        {name: "Object Animation", id: "object-animation"},
                        {name: "Text Animation", id: "text-animation"},
                        {name: "Graphics Animation", id: "graphics-animation"}
                    ])}
                </details>
            </div>

            <div class="category">
               <details>
                    <summary style="cursor: pointer; font-weight: bold; margin-bottom: 5px; outline: none;">Augmented Reality (Experimental)</summary>
                    ${createEffectGroup("Augmented Reality", [
                        {name: "AR General", id: "ar-general"},
                        {name: "AR Text", id:"ar-text"},
                        {name: "AR Graphics", id: "ar-graphics"}
                    ])}
              </details>
            </div>

        </div>
    </div>`;



    // --- Utility Functions ---

    // Creates a group of checkboxes for an effects category.
    function createEffectGroup(categoryName, effects) {
        let groupHTML = `<div style="padding-left: 10px;">`;
        effects.forEach(effect => {
            groupHTML += `
                <label style="display: block; margin-bottom: 2px;">
                    <input type="checkbox" id="${effect.id}-checkbox" class="effect-toggle" data-effect="${effect.id}">
                    ${effect.name}
                </label>`;
        });
        groupHTML += `</div>`;
        return groupHTML;
    }

    // --- INITIALIZATION (MODIFIED) ---

    document.body.insertAdjacentHTML('beforeend', menuHTML);
    const menu = document.getElementById('effects-menu');
    const closeButton = document.getElementById('close-menu');

    const toggleButton = document.createElement('button');
    toggleButton.id = "menu-toggle";
    toggleButton.innerHTML = '☰';
    toggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1001;
        background-color: #444;
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 5px 8px;
        cursor: pointer;
    `;
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
       menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    closeButton.addEventListener('click', () => {
        menu.style.display = 'none';
    });

     // ---  EVENT HANDLING (MODIFIED) ---

    menu.addEventListener('change', (event) => {
        if (event.target.classList.contains('effect-toggle')) {
            const effectId = event.target.dataset.effect;
            const isActive = event.target.checked;

             // CSS Filters (simple).
            if ([
                "blur", "focus", "color-change", "brightness", "contrast",
                "saturation", "temperature", "fog-adjust", "snow-change",
                "rain-change", "wind-change", "fog-change", "water-change",
                "fire-change",  "impact-change", "shock-change",
                "explosion-water", "explosion-fire", "explosion-fog",
                "explosion-snow", "explosion-rain", "explosion-wind",
                "light-effects", "shadow-effects"
            ].includes(effectId)) {
                applyFilterEffect(effectId, isActive);
            }
            else if (effectId === "moving-text") {
                if (isActive) {
                   // Example of use. You can customize this from the menu.
                    createMovingText("Drawaria!", {
                        x: '50%',
                        y: '20%',
                        toX: '+=300',
                        duration: 5,
                        repeat: -1,
                        yoyo: true,
                        color: 'orange',
                         fontSize: '36px'
                    });
                } else {
                     // Stop all moving text animations.
                    movingTexts.forEach(item => {
                        item.timeline.kill(); // Stop the animation.
                        item.element.remove(); // Remove the element from the DOM.
                    });
                    movingTexts = []; // Empty the array.
                }
            }
            else if (effectId === "text-3d") {
                if (isActive) {
                    createText3D("3D Effect", {
                        x: -1,
                        y: 1,
                        z: 0,
                        size: 0.8,
                        color: 0x00ff00,
                        animate: true,
                        duration: 3,
                        toY: 2,
                        yoyo: false,
                        rotationX: 0.5,
                        rotationY: 0.8
                    });
                } else {
                    // Clear 3D objects.
                    threeObjects.forEach(obj => {
                       scene.remove(obj);
                    });
                    threeObjects = []; // Empty the array.
                }
            }

            else if(effectId === "explosion-change"){
                if(isActive){
                    createParticleExplosion({
                       x: 0,  // Coordinates relative to the canvas (0, 0 is the center).
                       y: 0,
                       numParticles: 100,
                       size: 0.1,
                       color: 0xffa500, // Orange.
                       duration: 1.5,
                       spread: 1.5,
                       force: 0.8
                    });
                } //No else, since the explosion self-destructs
            }
            // Combined explosions - reuse explosion effect with different colors if needed, or keep the same effect for simplicity
            else if (["explosion-water", "explosion-fire", "explosion-fog", "explosion-snow", "explosion-rain", "explosion-wind"].includes(effectId)) {
                if (isActive) {
                    let color;
                    switch (effectId) {
                        case "explosion-water": color = 0x00aaff; break; // Blue
                        case "explosion-fire": color = 0xff4500; break; // Red-Orange
                        case "explosion-fog": color = 0xdddddd; break; // Light Grey
                        case "explosion-snow": color = 0xffffff; break; // White
                        case "explosion-rain": color = 0x87cefa; break; // Light Blue
                        case "explosion-wind": color = 0xadff2f; break; // Green-Yellow
                        default: color = 0xffa500; // Default Orange
                    }
                    createParticleExplosion({
                        x: 0,
                        y: 0,
                        numParticles: 100,
                        size: 0.1,
                        color: color,
                        duration: 1.5,
                        spread: 1.5,
                        force: 0.8
                    });
                }
            }
            // Placeholder effects implementations:
            else if (effectId === "focus") { applyPlaceholderEffect("focus", isActive); } // Focus - can be complex, placeholder for now
            else if (effectId === "wind-change") { applyPlaceholderEffect("wind-change", isActive); } // Wind Change - CSS is limited, placeholder
            else if (effectId === "water-change") { applyPlaceholderEffect("water-change", isActive); } // Water Change - complex, placeholder
            else if (effectId === "fire-change") { applyPlaceholderEffect("fire-change", isActive); } // Fire Change - complex, placeholder
            else if (effectId === "impact-change") { applyPlaceholderEffect("impact-change", isActive); } // Impact - placeholder
            else if (effectId === "shock-change") { applyPlaceholderEffect("shock-change", isActive); } // Shock - placeholder
            else if (effectId === "light-effects") { applyPlaceholderEffect("light-effects", isActive); } // Light Effects - CSS limited, placeholder
            else if (effectId === "shadow-effects") { applyPlaceholderEffect("shadow-effects", isActive); } // Shadow Effects - CSS limited, placeholder
            else if (effectId === "moving-graphics") { createMovingGraphics(isActive); }
            else if (effectId === "graphics-3d") { createGraphics3D(isActive); }
            else if (effectId === "character-animation") { createCharacterAnimation(isActive); }
            else if (effectId === "object-animation") { createObjectAnimation(isActive); }
            else if (effectId === "text-animation") { createTextAnimation(isActive); }
            else if (effectId === "graphics-animation") { createGraphicsAnimation(isActive); }
            else if (effectId === "ar-general") { applyARGeneral(isActive); }
            else if (effectId === "ar-text") { applyARText(isActive); }
            else if (effectId === "ar-graphics") { applyARGraphics(isActive); }


        }
    });



    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const menuHeader = document.getElementById('menu-header');

    menuHeader.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragOffsetX = event.clientX - menu.offsetLeft;
        dragOffsetY = event.clientY - menu.offsetTop;
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            menu.style.left = (event.clientX - dragOffsetX) + 'px';
            menu.style.top = (event.clientY - dragOffsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // --- CSS Styles (within the script) ---
     const style = document.createElement('style');
    style.textContent = `
        /* General styles for checkboxes (optional, but improves appearance) */
        .effect-toggle {
            margin-right: 5px;
        }
        /* Classes for effects. This is where the "magic" happens! (Or at least, the simulation) */
        .blur { filter: blur(5px); }
        .focus {  filter: contrast(120%) brightness(90%); /* Basic sharpen-like effect using contrast and brightness */ } /* You could use a sharpen filter here, but it's more complex */
        .color-change { filter: hue-rotate(90deg); } /* Example: Rotates colors */
        .brightness { filter: brightness(150%); }
        .contrast { filter: contrast(150%); }
        .saturation { filter: saturate(200%); }
        .temperature { filter: sepia(60%); }  /* Sepia gives a "warm" effect */
        .fog-adjust { filter: grayscale(50%) brightness(120%) opacity: 0.8; } /* Simulates basic fog */
        /*Weather*/
        /*Snow example*/
        .snow-change {
            animation: snowfall 10s linear infinite;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAHVJREFUKFNjZCARMILX/7+DLIAANSMRxgZGRkeMWB4wMDD8p8FjFQMDP8YmBga/GOjrwMC/4Y8KCBg+/MFRQvP/D4LRC4jEBgMDAx/GRgYGT4xMDD8Z2Bg+A8jIYgMDAx/GRgY/jEwMPxnYGD4w5ABbBYWlFvCNAAAAABJRU5ErkJggg==");
            background-repeat: repeat; /* Important to cover the canvas */
        }
          @keyframes snowfall {
            0% {
              background-position: 0 0;
            }
            100% {
               background-position: 100px 400px; /* Adjust for speed/direction */
             }
          }
        /*Rain*/
        .rain-change{
            animation: rain 0.2s linear infinite;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAICAYAAADeM14FAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAABNJREFUKFNjZCARLID/h3h8YPhPBQMDPxpDphAANgcEDpL1NqIAAAAASUVORK5CYII=");
            background-repeat: repeat;
        }
         @keyframes rain {
              from {
                background-position: 0 0;
              }
              to {
                background-position: 20px 100vh; /* Adjust speed */
              }
         }
        /*Wind*/
         .wind-change {
            /* There is no direct CSS filter for wind. The best simulation would be with animations and transformations */
            /* You could use something like this with JavaScript and GSAP: */
            /* gsap.to(canvas, {duration: 1, x: "+=10", yoyo: true, repeat: -1}); */
            /* But that requires GSAP (or another animation library). */
              filter: blur(1px); /* A slight blur can give a *little* sense of movement */

          }
         /*Fog*/
          .fog-change {
            filter: blur(3px) opacity(0.7); /* A stronger blur and reduced opacity */
           }
        /*Water*/
         .water-change {
            /* Water is *extremely* difficult to simulate with just CSS. The best would be to use a WebGL shader. */
             filter:  contrast(110%) brightness(110%); /* Very basic adjustments */
          }

        /*Fire*/
        .fire-change {
          /* Similar to water, realistic fire requires shaders or complex animations. */
          filter: contrast(150%) brightness(120%) hue-rotate(-20deg); /* A basic attempt to simulate warm colors. */
        }
        /*Explosion*/
        .explosion-change {
          /* Without an animation or library, this is VERY limited. */
          filter: brightness(200%) contrast(150%); /* A very basic "flash" */
        }
        /*Impact and Shock: Similar to explosion - need real animation.*/
          .impact-change, .shock-change {
            transform: scale(1.1);  /* A slight increase in size (temporary, ideally animated) */
          }
       /*Combined explosions*/
        .explosion-water, .explosion-fire, .explosion-fog,
        .explosion-snow, .explosion-rain, .explosion-wind {
          filter: brightness(200%) contrast(150%);  /* Common "flash" base */
        }
         /*Light and shadow effects*/
          .light-effects {
            /* VERY basic simulation with an overlaid gradient */
            /* This should be done with JavaScript for real control. */
            background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(0,0,0,0));
          }
          .shadow-effects {
            /* VERY basic simulation with an overlaid gradient */
            background-image: radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4), rgba(0,0,0,0));
            /* Again, JavaScript is needed for something realistic. */
          }
           /* Placeholder effect indicator style */
           .placeholder-effect-indicator {
               border: 3px dashed orange; /* Visual cue for placeholder effects */
           }
         .moving-graphics, .graphics-3d, .character-animation, .object-animation, .text-animation, .graphics-animation, .ar-general, .ar-text, .ar-graphics {
              /* Placeholder: These WILL NOT WORK without external libraries. */
              /* border: 1px dashed red; Removed, using placeholder indicator class instead */
         }
    `;

    document.head.appendChild(style);
})();