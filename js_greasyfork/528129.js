// ==UserScript==
// @name         Bonk.io Skin Sclee
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Better Skin Editor
// @author       Silly One
// @match        https://*.bonk.io/*
// @match        https://*.bonkisback.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528129/Bonkio%20Skin%20Sclee.user.js
// @updateURL https://update.greasyfork.org/scripts/528129/Bonkio%20Skin%20Sclee.meta.js
// ==/UserScript==

const injectorName = "Skin Sclee";

function injector(src) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #skineditor_reset, #skineditor_undo, #skineditor_redo,
        #skineditor_move, #skineditor_rotate,
        #skineditor_scale, #skineditor_flipX, #skineditor_flipY,
        #skineditor_invertcolors,
        #skineditor_loadbutton, #skineditor_randombutton {
            position: absolute;
            width: 25px;
            height: 25px;
            line-height: 30px;
        }

        #skineditor_reset { top: 45px; left: 15px; }
        #skineditor_undo { top: 45px; left: 45px; }
        #skineditor_redo { top: 45px; left: 75px; }
        #skineditor_move { top: 75px; right: 15px; }
        #skineditor_rotate { top: 105px; right: 15px; }
        #skineditor_inputrotate { position: absolute; top: 105px; left: -33px; width: 42px; height: 25px; }
        #skineditor_scale { top: 135px; right: 15px; }
        #skineditor_inputscale { position: absolute; top: 135px; left: -33px; width: 42px; height: 25px; }
        #skineditor_flipX { top: 165px; right: 15px; }
        #skineditor_flipY { top: 195px; right: 15px; }
        #skineditor_invertcolors { top: 255px; left: 15px; }
        #skineditor_loadbutton { bottom: -30px; right: 30px; width: 100px; height: 30px; }
        #skineditor_inputload { position: absolute; bottom: -60px; right: 30px; width: 100px; height: 30px; }
        #skineditor_randombutton { bottom: -90px; right: 30px; width: 100px; height: 30px; }
        #skineditor_checkbox { bottom: -90px; right: 0px; width: 20px; height: 20px; }
    `;
    document.head.appendChild(style);

    let newSrc = src;

    const GetSkinOnEdit = /O7P\[6]\[j1y\[1]\[642]]\(t\$e\[61]\[j1y\[1]\[1014]]\[O7P\[2]]\);/;
    newSrc = newSrc.replace(GetSkinOnEdit, `
    O7P[6][j1y[1][642]](t$e[61][j1y[1][1014]][O7P[2]]);
    t$e[61]["avatar"] = t$e[61][j1y[1][1014]][O7P[2]];
    `);
    const EditSkin = /u6B\(k7V\.w65\(2781\),s*N7I\[1]\)\;\};/;
    newSrc = newSrc.replace(EditSkin, `
    inputload.value = JSON.stringify(N7I[1]);
    u6B(k7V.w65(2781), N7I[1]);
    };

    let skineditor_previewbox_skincontainer = document.getElementById("skineditor_previewbox_skincontainer");

    let resetButton = document.createElement("div");
    resetButton.id = "skineditor_reset";
    resetButton.className = "brownButton brownButton_classic buttonShadow";
    resetButton.textContent = "⭮";
    document.getElementById("skineditor_previewbox").appendChild(resetButton);

    let undoButton = document.createElement("div");
    undoButton.id = "skineditor_undo";
    undoButton.className = "brownButton brownButton_classic buttonShadow";
    undoButton.textContent = "⤺";
    document.getElementById("skineditor_previewbox").appendChild(undoButton);

    let redoButton = document.createElement("div");
    redoButton.id = "skineditor_redo";
    redoButton.className = "brownButton brownButton_classic buttonShadow";
    redoButton.textContent = "⤻";
    document.getElementById("skineditor_previewbox").appendChild(redoButton);

    let buttonMove = document.createElement("div");
    buttonMove.id = "skineditor_move";
    buttonMove.className = "brownButton brownButton_classic buttonShadow";
    buttonMove.textContent = "↔";
    document.getElementById("skineditor_previewbox").appendChild(buttonMove);

    let buttonRotate = document.createElement("div");
    buttonRotate.id = "skineditor_rotate";
    buttonRotate.className = "brownButton brownButton_classic buttonShadow";
    buttonRotate.textContent = "⟳";
    document.getElementById("skineditor_previewbox").appendChild(buttonRotate);

    let rotateInputField = document.createElement("input");
    rotateInputField.id = "skineditor_inputrotate";
    rotateInputField.type = "text";
    rotateInputField.placeholder = "Angle";
    document.getElementById("skineditor_propertiesbox").appendChild(rotateInputField);

    let buttonScale = document.createElement("div");
    buttonScale.id = "skineditor_scale";
    buttonScale.className = "brownButton brownButton_classic buttonShadow";
    buttonScale.textContent = "⤢";
    document.getElementById("skineditor_previewbox").appendChild(buttonScale);

    let scaleInputField = document.createElement("input");
    scaleInputField.id = "skineditor_inputscale";
    scaleInputField.type = "text";
    scaleInputField.placeholder = "Scale";
    document.getElementById("skineditor_propertiesbox").appendChild(scaleInputField);

    let flipXButton = document.createElement("div");
    flipXButton.id = "skineditor_flipX";
    flipXButton.className = "brownButton brownButton_classic buttonShadow";
    flipXButton.textContent = "⭾";
    document.getElementById("skineditor_previewbox").appendChild(flipXButton);

    let flipYButton = document.createElement("div");
    flipYButton.id = "skineditor_flipY";
    flipYButton.className = "brownButton brownButton_classic buttonShadow";
    flipYButton.textContent = "⭿";
    document.getElementById("skineditor_previewbox").appendChild(flipYButton);

    let invertColors = document.createElement("div");
    invertColors.id = "skineditor_invertcolors";
    invertColors.className = "brownButton brownButton_classic buttonShadow";
    invertColors.textContent = "☯";
    document.getElementById("skineditor_previewbox").appendChild(invertColors);

    let butload = document.createElement("div");
    butload.id = "skineditor_loadbutton";
    butload.className = "brownButton brownButton_classic buttonShadow";
    butload.textContent = "Load";
    t$e[61].setButtonSounds([butload]);
    document.getElementById("skineditor_previewbox").appendChild(butload);

    let inputload = document.createElement("input");
    inputload.id = "skineditor_inputload";
    inputload.type = "text";
    document.getElementById("skineditor_previewbox").appendChild(inputload);
    inputload.value = '{"layers":[],"bc":0}';

    let butrandom = document.createElement("div");
    butrandom.id = "skineditor_randombutton";
    butrandom.className = "brownButton brownButton_classic buttonShadow";
    butrandom.textContent = "Random";
    t$e[61].setButtonSounds([butrandom]);
    document.getElementById("skineditor_previewbox").appendChild(butrandom);

    let avatarbefore;

    function updateAvatar() {
        let previewUpdater = new C_();
        previewUpdater.completeRedraw(N7I[1]);
    }

    function initializeAvatar() {
        let avatar = new t$e[80]();
        avatar.fromObject(N7I[1]);
        N7I[1] = avatar;
        updateAvatar();
        saveState();
    }

    document.getElementById('skinmanager_edit').addEventListener('click', function() {
    let avatar = new t$e[80]();
    avatar.fromObject(t$e[61]["allAvatars"][t$e[61]["activeAvatarNumber"]]);
    inputload.value = JSON.stringify(t$e[61]["allAvatars"][t$e[61]["activeAvatarNumber"]]);
    avatarbefore = avatar;
    setTimeout(function() {
        initializeAvatar();
        }, 300);
    });

    let history = [];
    let historyIndex = -1;

    function saveState() {
        history = history.slice(0, historyIndex + 1);
        history.push(JSON.stringify(N7I[1].layers));
        historyIndex++;
    }

    resetButton.onclick = function() {
        N7I[1] = avatarbefore;
        initializeAvatar();
    };

    undoButton.onclick = function() {
        undo();
    };

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            N7I[1].layers = JSON.parse(history[historyIndex]);
            updateAvatar();
        }
    }

    redoButton.onclick = function() {
        redo();
    };

    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            N7I[1].layers = JSON.parse(history[historyIndex]);
            updateAvatar();
        }
    }

    let initialDistance, initialMousePos, initialLayerData = [];
    let activeButton = null;

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    const debounceUpdate = debounce(() => S_z(), 300);

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        activeButton = null;
        debounceUpdate();
    }

    function onMouseMove(e) {
        let layers = N7I[1].layers;
        if (activeButton === 'scale') {
            let containerRect = skineditor_previewbox_skincontainer.getBoundingClientRect();
            let cursorDistance = Math.sqrt(Math.pow(e.clientX - (containerRect.left + containerRect.width / 2), 2) + Math.pow(e.clientY - (containerRect.top + containerRect.height / 2), 2));
            let scaleChange = cursorDistance / initialDistance;
            layers.forEach((layer, index) => {
                layer.scale = initialLayerData[index].scale * scaleChange;
                layer.x = initialLayerData[index].x * scaleChange;
                layer.y = initialLayerData[index].y * scaleChange;
            });
        }
        if (activeButton === 'move') {
            let deltaX = e.clientX - initialMousePos.x;
            let deltaY = e.clientY - initialMousePos.y;
            layers.forEach((layer, index) => {
                layer.x = initialLayerData[index].x + deltaX * 0.1;
                layer.y = initialLayerData[index].y + deltaY * 0.1;
            });
        }
        if (activeButton === 'rotate') {
            let containerRect = skineditor_previewbox_skincontainer.getBoundingClientRect();
            let centerX = containerRect.left + containerRect.width / 2;
            let centerY = containerRect.top + containerRect.height / 2;
            let angleChange = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            layers.forEach((layer, index) => {
                let initialAngle = initialLayerData[index].angle;
                layer.angle = initialAngle + angleChange;

                let initialX = initialLayerData[index].x;
                let initialY = initialLayerData[index].y;
                let radius = Math.sqrt(Math.pow(initialX, 2) + Math.pow(initialY, 2));
                let initialAngleRadians = Math.atan2(initialY, initialX);
                let newAngleRadians = initialAngleRadians + (angleChange * Math.PI / 180);
                layer.x = radius * Math.cos(newAngleRadians);
                layer.y = radius * Math.sin(newAngleRadians);
            });
        }
        updateAvatar();
    }

    buttonMove.addEventListener('mousedown', (e) => {
        activeButton = 'move';
        initialMousePos = { x: e.clientX, y: e.clientY };
        initialLayerData = N7I[1].layers.map(layer => ({
            x: layer.x,
            y: layer.y,
            scale: layer.scale,
            angle: layer.angle
        }));
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        saveState();
    });

    buttonRotate.onclick = function() {
        let rotateAngle = parseFloat(rotateInputField.value) || 22.5;
        let layers = N7I[1].layers;

        let containerRect = skineditor_previewbox_skincontainer.getBoundingClientRect();
        let centerX = containerRect.left + containerRect.width / 2;
        let centerY = containerRect.top + containerRect.height / 2;

        layers.forEach((layer, index) => {
            layer.angle += rotateAngle;
            let initialX = layer.x;
            let initialY = layer.y;
            let radius = Math.sqrt(Math.pow(initialX, 2) + Math.pow(initialY, 2));
            let initialAngleRadians = Math.atan2(initialY, initialX);
            let newAngleRadians = initialAngleRadians + (rotateAngle * Math.PI / 180);
            layer.x = radius * Math.cos(newAngleRadians);
            layer.y = radius * Math.sin(newAngleRadians);
        });

        updateAvatar();
        saveState();
    };

    buttonRotate.addEventListener('mousedown', (e) => {
        activeButton = 'rotate';
        initialMousePos = { x: e.clientX, y: e.clientY };
        initialLayerData = N7I[1].layers.map(layer => ({
            x: layer.x,
            y: layer.y,
            scale: layer.scale,
            angle: layer.angle
        }));
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        saveState();
    });

    buttonScale.onclick = function() {
        let scaleInputValue = parseFloat(scaleInputField.value);
        let scaleFactor = parseFloat(scaleInputField.value) || 2;
        let layers = N7I[1].layers;
        layers.forEach((layer, index) => {
            layer.scale *= scaleFactor;
            layer.x *= scaleFactor;
            layer.y *= scaleFactor;
        });

        updateAvatar();
        saveState();
    };

    buttonScale.addEventListener('mousedown', (e) => {
        activeButton = 'scale';
        let containerRect = skineditor_previewbox_skincontainer.getBoundingClientRect();
        initialDistance = Math.sqrt(Math.pow(e.clientX - (containerRect.left + containerRect.width / 2), 2) + Math.pow(e.clientY - (containerRect.top + containerRect.height / 2), 2));
        initialMousePos = { x: e.clientX, y: e.clientY };
        initialLayerData = N7I[1].layers.map(layer => ({
            x: layer.x,
            y: layer.y,
            scale: layer.scale,
            angle: layer.angle
        }));
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        saveState();
    });

    flipXButton.onclick = function() {
        N7I[1].layers.forEach(layer => {
            layer.flipX = !layer.flipX;
            layer.x = -layer.x;
            layer.angle = -layer.angle;
        });
        updateAvatar();
        saveState();
    };

    flipYButton.onclick = function() {
        N7I[1].layers.forEach(layer => {
            layer.flipY = !layer.flipY;
            layer.y = -layer.y;
            layer.angle = -layer.angle;
        });
        updateAvatar();
        saveState();
    };

    function invertColor(color) {
        return 0xFFFFFF - color;
    }

    invertColors.onclick = function() {
        let layers = N7I[1].layers;
        layers.forEach(layer => {
            layer.color = invertColor(layer.color);
        });
        N7I[1].bc = invertColor(N7I[1].bc);
        updateAvatar();
        S_z()
    };

    butload.onclick = function() {
        let parsedData = JSON.parse(inputload.value);
        let avatar = new t$e[80]();
        avatar.fromObject(parsedData);
        N7I[1] = avatar;
        console.log("N7I[1] after load:", N7I[1]);
        updateAvatar();
        S_z()
    };

    inputload.onchange = function() {
        try {
            let parsedData = JSON.parse(inputload.value);
            let avatar = new t$e[80]();
            avatar.fromObject(parsedData);
            N7I[1] = avatar;
            inputload.value = JSON.stringify(N7I[1]);
            console.log("Avatar updated from input:", N7I[1]);
        } catch (error) {
            console.error("Invalid JSON in input field:", error);
        }
    };
    inputload.onkeydown = function(event) {
    if (event.key === 'Enter' && inputload.value.trim() === '') {
        inputload.value = '{"layers":[],"bc":0}';
        }
    };

    function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
    }

    function getRandomBool() {
        return Math.random() < 0.5;
    }

    function getRandomLayer() {
        return {
            id: getRandomInt(1, 115), // 1, 115
            scale: getRandomFloat(0, 2),
            angle: getRandomFloat(0, 360),
            x: getRandomFloat(-25, 25),
            y: getRandomFloat(-25, 25),
            flipX: getRandomBool(),
            flipY: getRandomBool(),
            color: getRandomInt(0, 16777215) // 0, 16777215
        };
    }

    function generateRandomAvatar() {
        let layers = [];
        let numLayers = getRandomInt(16, 16);
        for (let i = 0; i < numLayers; i++) {
            layers.push(getRandomLayer());
        }
        return { layers: layers, bc: getRandomInt(0, 16777215) };
    }

    let autoAvatarCheckbox = document.createElement("input");
    autoAvatarCheckbox.type = "checkbox";
    autoAvatarCheckbox.id = "skineditor_checkbox";
    document.getElementById("skineditor_previewbox").appendChild(autoAvatarCheckbox);
    function setRandomAvatar() {
        let randomAvatar = generateRandomAvatar();
        let avatar = new t$e[80]();
        avatar.fromObject(randomAvatar);
        t$e[61].avatar = avatar;
        console.log("New random avatar set:", randomAvatar);
        initializeAvatar();
    }

    let avatarInterval;
    autoAvatarCheckbox.onchange = function() {
        if (autoAvatarCheckbox.checked) {
            console.log("Auto avatar change is enabled.");
            avatarInterval = setInterval(setRandomAvatar, 2000);
        } else {
            console.log("Auto avatar change is disabled.");
            clearInterval(avatarInterval);
        }
    };

    butrandom.onclick = function() {
        let randomAvatar = generateRandomAvatar();
        inputload.value = JSON.stringify(randomAvatar);
        let parsedData = JSON.parse(inputload.value);
        let avatar = new t$e[80]();
        avatar.fromObject(parsedData);
        console.log("Random avatar generated:", randomAvatar);
        N7I[1] = avatar;
        updateAvatar();
    };
    `);
    if (src === newSrc) throw "Injection failed!";
    console.log(injectorName + " injector run");
    return newSrc;
}

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(`Whoops! ${injectorName} was unable to load.`);
        throw error;
    }
});

console.log(injectorName + " injector loaded");