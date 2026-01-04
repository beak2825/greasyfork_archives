// ==UserScript==
// @name         Cryzen.io - Phinally Menu
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fixed -No Recoil, ESP, Bunny Hop, a custom crosshair, and much more!.
// @author       ZeR
// @match        *://cryzen.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528167/Cryzenio%20-%20Phinally%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528167/Cryzenio%20-%20Phinally%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newScopeURL = 'https://i.postimg.cc/fT1kw2Md/cross2.webp'; // Mets ici ton viseur

    let originalMaterialDescriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'material');
    let isLoggedIn = false;
    let autoBunnyHopInterval = null;
    let originalRandom = Math.random;
    let scope = null;
    let optimizationEnabled = true;
    let lowResolutionEnabled = false;
    const FPS_THRESHOLD_LOW = 30;
    const FPS_THRESHOLD_HIGH = 50;
    const OPTIMIZATION_INTERVAL = 3000;

    let lastCheck = performance.now();
    let fps = 0;
    let lastTime = performance.now();
    let fpsInterval;

        const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'fixed';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.right = '10px';
    fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.padding = '5px';
    fpsDisplay.style.zIndex = '1000';
    document.body.appendChild(fpsDisplay);

    function adjustCanvasResolution(scaleFactor) {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const devicePixelRatio = window.devicePixelRatio * scaleFactor;
            canvas.width = window.innerWidth * devicePixelRatio;
            canvas.height = window.innerHeight * devicePixelRatio;
            console.log(`Canvas resolution adjusted. Scale Factor: ${scaleFactor}`);
        }
    }

function optimizeGame() {
    if (!optimizationEnabled) return;
    document.querySelectorAll('.high-detail').forEach(element => {
        element.style.display = 'none';
    });
}


function countFrames() {
    fps++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        fpsDisplay.innerText = `FPS: ${fps}`;
        adjustResolutionBasedOnFPS(fps);
        fps = 0;
        lastTime = now;
    }
    requestAnimationFrame(countFrames);
}

function adjustResolutionBasedOnFPS(fps) {
    if (fps < FPS_THRESHOLD_LOW && !lowResolutionEnabled) {
        lowResolutionEnabled = true;
        adjustCanvasResolution(0.5);
    } else if (fps > FPS_THRESHOLD_HIGH && lowResolutionEnabled) {
        lowResolutionEnabled = false;
        adjustCanvasResolution(1);
    }
}


    countFrames();
    const menuCSS = `
    #mod-menu {
    position: fixed;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    background: rgba(20, 20, 20, 0.95);
    color: white;
    padding: 15px;
    border-radius: 15px;
    border: 2px solid blue;
    font-family: Arial, sans-serif;
    width: 300px;
    height: auto;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    cursor: grab;
    z-index: 9999; /* Assure que le menu est au-dessus des autres éléments */
}

#mod-menu.show {
    display: block;
    opacity: 1;
}

#mod-menu:hover {
    opacity: 1; /* Garde le menu visible au survol */
}

        .menu-header {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            cursor: move;
        }

        .menu-category {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-top: 10px;
            cursor: pointer;
        }

         .menu-section {
    display: none;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

        .menu-button {
            background: #333;
            border: 1px solid #555;
            color: white;
            padding: 8px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
        }

        .menu-button:hover {
            background: #444;
        }

        .menu-button.active {
            background: #4CAF50;
            transform: scale(1.05);
        }

        .menu-footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }

        #login-screen {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            color: white;
            text-align: center;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #login-screen.show {
            display: block;
            opacity: 1;
        }

        h2 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .login-input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #555;
            color: white;
            background: #333;
            box-sizing: border-box;
        }
        .menu-section.active {
    display: flex;
    opacity: 1;
}

        .login-button {
            background: #4CAF50;
            border: none;
            color: white;
            padding: 12px;
            width: 100%;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }

        .login-button:hover {
            background: #45a049;
        }


    `;

    function injectCSS(css) {
        let style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

function createModMenu() {
    let menu = document.createElement("div");
    menu.id = "mod-menu";
    menu.innerHTML = `
        <div class="menu-header">PHINALLY MENU</div>

        <!-- AIM Section -->
        <div class="menu-category" data-section="aim-section">AIM</div>
        <div class="menu-section" id="aim-section">
            <div class="menu-button" id="no-recoil-button" data-action="toggle-recoil">No Recoil</div>
        </div>

        <!-- MOVEMENT Section -->
        <div class="menu-category" data-section="movement-section">MOUVEMENT</div>
        <div class="menu-section" id="movement-section">
            <div class="menu-button" id="bunnyhop-button" data-action="toggle-bunnyhop">Bunny Hop</div>
        </div>

        <!-- VISUAL Section -->
        <div class="menu-category" data-section="visual-section">VISUAL</div>
        <div class="menu-section" id="visual-section">
            <div class="menu-button" id="esp-button" data-action="toggle-esp">ESP</div>
            <div class="menu-button" id="view-button" data-action="toggle-view">Better View</div>
        </div>

        <!-- HACK Section -->
        <div class="menu-category" data-section="hack-section">HACK</div>
        <div class="menu-section" id="hack-section">
            <div class="menu-button" id="adblock-button" data-action="toggle-adblock">Ad Block</div>
            <div class="menu-button" id="cross-button" data-action="toggle-cross">Crosshair</div>
        </div>

        <div class="menu-footer">ZeR©</div>
    `;
    document.body.appendChild(menu);
    addMenuEventListeners();
    makeMenuDraggable(menu);

    document.querySelectorAll('.menu-category').forEach(category => {
        category.addEventListener('click', (event) => {
            const sectionId = event.target.getAttribute('data-section');
            const section = document.getElementById(sectionId);

            if (section.classList.contains('active')) {
                section.classList.remove('active');
            } else {
                document.querySelectorAll('.menu-section').forEach(sec => sec.classList.remove('active'));
                section.classList.add('active');
            }
        });
    });
}


    // Crée l'écran de login
    function createLoginScreen() {
        let loginScreen = document.createElement("div");
        loginScreen.id = "login-screen";
        loginScreen.innerHTML = `
            <h2>Phinally Login</h2>
            <input type="text" id="username" class="login-input" placeholder="Username" />
            <input type="password" id="password" class="login-input" placeholder="Password" />
            <button class="login-button" id="login-button">Login</button>
            <div class="menu-footer">ZeR©</div>
        `;
        document.body.appendChild(loginScreen);
        document.getElementById("login-button").addEventListener("click", function() {
        let loginSound = new Audio("https://files.catbox.moe/m1ru9s.mp3"); // Remplace par ton lien
        loginSound.play(); // Joue le son
        handleLogin(); // Exécute la fonction de connexion
       });
    }

    const usernameDisplay = document.createElement('div');
    usernameDisplay.style.position = 'fixed';
    usernameDisplay.style.top = '40px';
    usernameDisplay.style.right = '10px';
    usernameDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    usernameDisplay.style.padding = '5px';
    usernameDisplay.style.zIndex = '1000';

    const loginText = document.createElement('span');
    loginText.style.color = 'white';
    loginText.textContent = 'Login as ';

    const usernameText = document.createElement('span');
    usernameText.style.color = 'green';
    usernameText.textContent = 'username';

    usernameDisplay.appendChild(loginText);
    usernameDisplay.appendChild(usernameText);
    document.body.appendChild(usernameDisplay);

    function updateUsername(username) {
        usernameText.textContent = username;
    }


const users = [
    { username: 'admin', password: 'admin' },
    { username: 'Xeno', password: 'Xeno' }
];

function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        isLoggedIn = true;
        document.getElementById("login-screen").classList.remove("show");
        updateUsername(username);
        setTimeout(() => toggleModMenu(), 300);
    } else {
        alert("Nom d'utilisateur ou mot de passe incorrect.");
    }
}

    function makeMenuDraggable(menu) {
        let isDragging = false, startX, startY;

        menu.querySelector(".menu-header").addEventListener("mousedown", (event) => {
            isDragging = true;
            startX = event.clientX - menu.offsetLeft;
            startY = event.clientY - menu.offsetTop;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                menu.style.left = event.clientX - startX + "px";
                menu.style.top = event.clientY - startY + "px";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    function toggleModMenu() {
        if (isLoggedIn) {
            let menu = document.getElementById("mod-menu");
            menu.classList.toggle("show");
        } else {
            document.getElementById("login-screen").classList.add("show");
        }
    }

    //////////////////////////////////////////////////
    ///                                            ///
    ///            BUTTON ACTIVATION               ///
    ///                                            ///
    //////////////////////////////////////////////////

function addMenuEventListeners() {
    let clickSound = new Audio("https://files.catbox.moe/26rojk.mp3"); // Remplace par ton lien
    clickSound.volume = 1.0;

    function playSound() {
        clickSound.currentTime = 0; // Réinitialise le son pour éviter les retards
        clickSound.play();
    }

    document.getElementById("no-recoil-button").addEventListener("click", () => {
        playSound();
        toggleFeature("no-recoil");
    });

    document.getElementById("bunnyhop-button").addEventListener("click", () => {
        playSound();
        toggleFeature("bunnyhop");
    });

    document.getElementById("esp-button").addEventListener("click", () => {
        playSound();
        toggleFeature("esp");
    });

    document.getElementById("view-button").addEventListener("click", () => {
        playSound();
        toggleFeature("view");
    });

    document.getElementById("adblock-button").addEventListener("click", () => {
        playSound();
        toggleFeature("adblock");
    });

    document.getElementById("cross-button").addEventListener("click", () => {
        playSound();
        toggleFeature("cross");
    });
}


    // Fonction pour activer/désactiver les fonctionnalités
    function toggleFeature(feature) {
        switch (feature) {
            case "no-recoil":
                if (document.getElementById("no-recoil-button").classList.contains("active")) {
                    disableNoRecoil();
                } else {
                    enableNoRecoil();
                }
                document.getElementById("no-recoil-button").classList.toggle("active");
                break;
            case "bunnyhop":
                if (document.getElementById("bunnyhop-button").classList.contains("active")) {
                    disableUP();
                } else {
                    enableUP();
                }
                document.getElementById("bunnyhop-button").classList.toggle("active");
                break;
            case "esp":
                if (document.getElementById("esp-button").classList.contains("active")) {
                    disableESP();
                } else {
                    enableESP();
                }
                document.getElementById("esp-button").classList.toggle("active");
                break;
            case "view":
                if (document.getElementById("view-button").classList.contains("active")) {
                    disableVIEW();
                } else {
                    enableVIEW();
                }
                document.getElementById("view-button").classList.toggle("active");
                break;
            case "cross":
                if (document.getElementById("cross-button").classList.contains("active")) {
                    disableCROSS();
                } else {
                    enableCROSS();
                }
                document.getElementById("cross-button").classList.toggle("active");
                break;
            case "adblock":
                if (document.getElementById("adblock-button").classList.contains("active")) {
                    disableAdBlock();
                } else {
                    enableAdBlock();
                }
                document.getElementById("adblock-button").classList.toggle("active");
                break;
            default:
                break;
        }
    }


function disableFeature(feature) {
    switch (feature) {
        case "no-recoil":
            disableNoRecoil();
            break;
        case "bunnyhop":
            disableUP();
            break;
        case "esp":
            disableESP();
            break;
        case "view":
            disableVIEW();
            break;
        case "cross":
            disableCROSS();
            break;
        case "adblock":
            disableAdBlock();
            break;
        default:
            break;
    }
}


    //////////////////////////////////////////////////
    ///                                            ///
    ///            BUTTON FUNCTION                 ///
    ///                                            ///
    //////////////////////////////////////////////////

   function enableNoRecoil() {
    console.log("No Recoil activé !");
    const _random = Math.random;
    Object.defineProperty(Math, 'random', {
        get() {
            try {
                throw new Error();
            } catch (error) {
                const stack = error.stack;
                if (stack.includes('shoot')) {
                    return () => 0.5;
                }
            }
            return _random;
        }
    });
}

   function disableNoRecoil() {
    console.log("No Recoil désactivé !");
    Object.defineProperty(Math, 'random', {
        get() {
            return originalRandom;
        }
    });
}

function enableAdBlock() {
    return new Promise(resolve => {
        resolve(true);
    });
}

Object.defineProperties(Object.prototype, {
    'rewardedBreak': {
        get() {
            return enableAdBlock.bind(this);
        },
        set() {},
        enumerable: false,
        }
    });
    function disableAdBlock() {
        console.log("Ad Blocker désactivé !");
    }

function disableESP() {
    console.log("ESP désactivé !");

    if (originalMaterialDescriptor) {
        Object.defineProperty(Object.prototype, 'material', originalMaterialDescriptor);
    } else {
        delete Object.prototype.material;
    }
}

function enableESP() {
    console.log("ESP activé !");

Object.defineProperty(Object.prototype, 'material', {
    get() { return this._material; },
    set(v) {
        if (this.type === 'SkinnedMesh' && this?.skeleton) {
            Object.defineProperties(v, {
                'depthTest': {
                    get() { return false; },
                    set(v) {},
                },
                'transparent': {
                    get() { return true; },
                    set(v) {},
                }
            });
            v.wireframe = true;
            v.opacity = 1;
        }
        this._material = v;
    }
});
}

    function getSqareDataURL(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    const dataURL = canvas.toDataURL();
    return dataURL;
}

    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
    const srcset = originalSrcDescriptor.set;

    function enableVIEW() {
    console.log("Vue modifiée activée !");

    Object.defineProperty(Image.prototype, 'src', {
        set(value) {
            this._src = value;
            if (typeof value !== 'string') {
                return srcset.call(this, value);
            }
            if (value.includes('colorMap')) {
                if (value.toLowerCase().includes('red')) {
                    value = getSqareDataURL(1000, 1000, '#FF7373');
                } else if (value.toLowerCase().includes('blue')) {
                    value = getSqareDataURL(1000, 1000, '#00FFFF');
                } else {
                    value = getSqareDataURL(1000, 1000, '#73FF73');
                }
            }
            if (value.includes('map-')) {
                value = getSqareDataURL(4096, 2048, '#AAAAAA');
            }
            srcset.call(this, value);
        },
        get() {
            return this._src;
        }
    });
}

function disableVIEW() {
    console.log("Vue modifiée désactivée !");

    Object.defineProperty(Image.prototype, 'src', originalSrcDescriptor);
}

function enableUP() {
    console.log("Auto Bunny Hop activé !");

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && autoBunnyHopInterval === null) {
            autoBunnyHopInterval = setInterval(() => {
                const event = new KeyboardEvent('keydown', { key: ' ' });
                document.dispatchEvent(event);
            }, 3000);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === ' ') {
            clearInterval(autoBunnyHopInterval);
            autoBunnyHopInterval = null;
        }
    });
}
function disableUP() {
    console.log("Auto Bunny Hop activé !");
}

    function createScopeOverlay() {
        scope = document.createElement("img");
        scope.src = newScopeURL;
        scope.id = "custom-sniper-scope";
        scope.style.position = "fixed";
        scope.style.top = "50%";
        scope.style.left = "50%";
        scope.style.transform = "translate(-50%, -50%)";
        scope.style.pointerEvents = "none";
        scope.style.maxWidth = "100vw";
        scope.style.maxHeight = "100vh";
        scope.style.zIndex = "99999";
        document.body.appendChild(scope);
    }

    function enableCROSS() {
        if (!scope) {
            createScopeOverlay();
        } else {
            scope.style.display = "block";
        }
    }

    function disableCROSS() {
        if (scope) {
            scope.style.display = "none";
        }
    }



    function updateFPS() {
        const now = performance.now();
        const delta = now - lastTime;

        if (delta > 100) {
            const fps = Math.round(1000 / delta);
            fpsDisplay.textContent = `FPS: ${fps}`;
            lastTime = now;
        }
    }

    function enableFPS() {
        fpsInterval = setInterval(updateFPS, 100);
        fpsDisplay.style.display = 'block';
    }

    function disableFPS() {
        clearInterval(fpsInterval);
        fpsDisplay.style.display = 'none';
    }


    //////////////////////////////////////////////////
    ///                                            ///
    ///        END    BUTTON FUNCTION              ///
    ///                                            ///
    //////////////////////////////////////////////////


    injectCSS(menuCSS);

    createLoginScreen();

    createModMenu();

    document.addEventListener("keydown", function(event) {
        if (event.key === "Insert") {
            if (isLoggedIn) {
                toggleModMenu();
            } else {
                document.getElementById("login-screen").classList.add("show");
            }
        }
    });
})();

