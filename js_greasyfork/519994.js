// ==UserScript==
// @name         Nice
// @version      1
// @author       qloha
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @namespace https://greasyfork.org/users/1407549-qloha
// @description  Nice.
// @license GPLv3
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/519994/Nice.user.js
// @updateURL https://update.greasyfork.org/scripts/519994/Nice.meta.js
// ==/UserScript==

(function() {
    let shadowRadius = 50;
    let shadowDirection = 1;
    let canShadow = true;
    const gameNameElement = document.getElementById("gameName");

    setInterval(() => {
        if (canShadow) {
            shadowRadius = shadowDirection === 1 ? shadowRadius - 5 : shadowRadius + 5;
            if (shadowRadius >= 50 || shadowRadius <= 0) {
                shadowDirection = shadowRadius >= 50 ? 1 : 0;
                canShadow = false;
                setTimeout(() => { canShadow = true; }, 100);
            }
        }
        gameNameElement.style.textShadow = `0px 0px ${shadowRadius + 20}px #cccccc`;
    }, 100);

    const enterGameButton = document.getElementById('enterGame');
    enterGameButton.innerText = "⇛ ‍ ‍ ‍𝐉𝐨𝐢𝐧 𝐠𝐚𝐦𝐞 ‍ ‍ ‍⇚";

    enterGameButton.addEventListener("mouseenter", function() {
        enterGameButton.innerText = "⇛ 𝐉𝐨𝐢𝐧 𝐠𝐚𝐦𝐞 ‍⇚";
    });

    enterGameButton.addEventListener("mouseleave", function() {
        enterGameButton.innerText = "⇛ ‍  ‍  ‍𝐉𝐨𝐢𝐧 𝐠𝐚𝐦𝐞 ‍ ‍   ‍⇚";
    });

    $('#itemInfoHolder').css({
        'text-align': 'center',
        'top': '25px',
        'left': '440px',
        'right': '350px',
        'max-width': '350px'
    });

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = 'Hello there.';

    const animationSteps = [
        '𝐍.',
        '𝐍𝐢',
        '𝐍𝐢𝐜',
        '𝐍𝐢𝐜𝐞',
        '𝐍𝐢𝐜𝐞!',
        '𝐍𝐢𝐜𝐞',
        '𝐍𝐢𝐜𝐞.'
    ];

    let currentStep = 0;
    const animationInterval = 150;

    const animateGameName = () => {
        if (currentStep < animationSteps.length) {
            gameNameElement.innerHTML = animationSteps[currentStep];
            currentStep++;
            let timeoutDuration = 150;

            if (currentStep === 4) timeoutDuration = 140;
            if (currentStep === 5) timeoutDuration = 150;
            if (currentStep === 6) timeoutDuration = 140;
            if (currentStep === 7) timeoutDuration = 150;
            if (currentStep === 8) timeoutDuration = 200;

            setTimeout(animateGameName, timeoutDuration);
        } else {
            setupHoverEffect();
        }
    };

    animateGameName();

    const setupHoverEffect = () => {
        const normalText = '𝐍𝐢𝐜𝐞.';
        const boldText = '𝓝𝓲𝓬𝓮.';

        gameNameElement.addEventListener("mouseenter", function() {
            gameNameElement.innerHTML = boldText;
        });

        gameNameElement.addEventListener("mouseleave", function() {
            gameNameElement.innerHTML = normalText;
        });
    };

    const loadingText = document.getElementById('loadingText');
    loadingText.innerHTML = 'Loading game...';
    setTimeout(() => {
        loadingText.innerHTML = 'Successfully loaded!';
    }, 710);

    $('#gameName').css({
        'color': '#ff6637',
        'text-shadow': 'rgba(255, 194, 175, 1)',
        'text-align': 'center',
        'font-size': '80px',
        'margin-bottom': '20px',
        'transition': 'all 0.3s ease-in-out'
    });

    const menu = document.createElement("div");
    menu.id = "customMenu";
    menu.style.position = "absolute";
    menu.style.top = "100px";
    menu.style.left = "100px";
    menu.style.width = "300px";
    menu.style.background = "rgba(50, 50, 50, 0.9)";
    menu.style.color = "white";
    menu.style.border = "2px solid #ffffff";
    menu.style.borderRadius = "10px";
    menu.style.padding = "10px";
    menu.style.zIndex = "10000"; // Ensure it appears above the game
    menu.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.4)";
    menu.style.display = "none"; // Initially hidden

    // Add content to the menu
    menu.innerHTML = `
        <div id="menuHeader" style="padding: 5px; background: rgba(70, 70, 70, 1); border-bottom: 1px solid #aaa; border-radius: 10px 10px 0 0; cursor: move;">
            <strong>𝐍𝐢𝐜𝐞.</strong>
        </div>
        <div style="padding: 10px; cursor: default;">
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 5px 0;">
                    <button class="menuOption" data-option="Auto Heal" style="width: 100%; padding: 10px; background: #ff6637; border: none; color: white; border-radius: 5px; cursor: pointer;">Auto Heal</button>
                </li>
                <li style="margin: 5px 0;">
                    <button class="menuOption" data-option="Anti Invis" style="width: 100%; padding: 10px; background: #3377ff; border: none; color: white; border-radius: 5px; cursor: pointer;">Anti Invis</button>
                </li>
            </ul>
        </div>
    `;

    // Append the menu to the document body
    document.body.appendChild(menu);

    // Add a key listener for Right Shift
    document.addEventListener("keydown", (event) => {
        if (event.code === "ShiftRight") {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        }
    });

    // Drag-and-Drop functionality
    let isDragging = false;
    let offsetX, offsetY;

    const header = document.getElementById("menuHeader");

    header.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - menu.getBoundingClientRect().left;
        offsetY = event.clientY - menu.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            menu.style.left = `${event.clientX - offsetX}px`;
            menu.style.top = `${event.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Create the notification container
    const notificationContainer = document.createElement("div");
    notificationContainer.id = "notificationContainer";
    notificationContainer.style.position = "fixed";
    notificationContainer.style.bottom = "10px";
    notificationContainer.style.right = "10px";
    notificationContainer.style.zIndex = "10001"; // Above the menu
    notificationContainer.style.display = "flex";
    notificationContainer.style.flexDirection = "column-reverse"; // Stack from bottom to top
    document.body.appendChild(notificationContainer);

    // Add functionality to menu options
    document.querySelectorAll(".menuOption").forEach(button => {
        button.addEventListener("click", () => {
            const option = button.dataset.option;
            const isToggledOn = button.dataset.toggled === "true";
            button.dataset.toggled = !isToggledOn;

            if (option === "Auto Heal") {
                isAutoHealEnabled = !isAutoHealEnabled;
                if (isAutoHealEnabled) setupAutoHeal();
            }

            const notification = document.createElement("div");
            notification.innerText = `Toggled ${option} ${isToggledOn ? "Off" : "On"}`;
            console.log(`Toggled ${option} ${isToggledOn ? "Off" : "On"}`);
            notification.style.background = isToggledOn ? "#ff4c4c" : "#4caf50"; // Red for off, green for on
            notification.style.color = "white";
            notification.style.padding = "10px";
            notification.style.marginTop = "5px";
            notification.style.borderRadius = "5px";
            notification.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";
            notification.style.transition = "opacity 0.5s ease, transform 0.5s ease";

            // Add the notification to the container
            notificationContainer.appendChild(notification);

            // Automatically remove the notification after 2 seconds
            setTimeout(() => {
                notification.style.opacity = "0";
                notification.style.transform = "translateY(20px)";
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        });
    });

    let isAutoHealEnabled = false;
    let isAntiInvisEnabled = false;

    // Auto Heal Logic
    let mouseX, mouseY, width, height, foodType, ws;
    const myPlayer = { id: null };
    const msgpack5 = msgpack;

    const sendws = (id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) => {
        if (!ws) return;
        ws.send(new Uint8Array(Array.from(msgpack5.encode(["5", [id, null]]))));
        ws.send(new Uint8Array(Array.from(msgpack5.encode(["c", [1, angle]]))));
        ws.send(new Uint8Array(Array.from(msgpack5.encode(["c", [0, angle]]))));
    };

    const setupAutoHeal = () => {
        WebSocket.prototype.oldSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(m) {
            if (!ws) {
                ws = this;
                ws.addEventListener("message", function(event) {
                    const data = msgpack5.decode(new Uint8Array(event.data));
                    if (data[0] === "1" && myPlayer.id === null) myPlayer.id = data[1];
                    if (data[0] === "h" && data[1] === myPlayer.id) {
                        if (data[2] < 100 && data[2] > 0 && isAutoHealEnabled) {
                            sendws(foodType, null);
                        }
                    }
                });
            }
            this.oldSend(m);
        };
    };

    // Anti-Invis Logic
    const setupAntiInvis = () => {
        CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate;
        CanvasRenderingContext2D.prototype.rotate = function(e) {
            if (isAntiInvisEnabled && Math.abs(e) > 1e300) {
                e = Math.atan2(Math.cos(e), Math.sin(e));
                this.globalAlpha = 0.5;
                this.rotatef(e);
            } else {
                this.rotatef(e);
            }
        };
    };
})();