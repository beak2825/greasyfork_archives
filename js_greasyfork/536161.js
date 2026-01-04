// ==UserScript==
// @name         Drawaria Harmony Unlocked: Pro!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Harmony Unlocked Pro!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536161/Drawaria%20Harmony%20Unlocked%3A%20Pro%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536161/Drawaria%20Harmony%20Unlocked%3A%20Pro%21.meta.js
// ==/UserScript==

(function() {
    'use strict';


// (function() { /*
//   'use strict';

    // Function to get the user's language
    function getUserLanguage() {
        const navigatorLanguage = navigator.language || navigator.userLanguage;
        return navigatorLanguage.split('-')[0]; // Get the primary language code
    }

    // Translations for the warning message and character's speech
    const translations = {
        en: {
            title: 'Everything is blocked',
            message: 'You should not play right now, you have important things to do.',
            characterSpeech: 'Hey! Go outside.'
        },
        es: {
            title: 'Todo está bloqueado',
            message: 'No debes jugar en este momento, tienes cosas importantes que hacer ahora mismo.',
            characterSpeech: '¡Oye! Sal afuera.'
        },
        fr: {
            title: 'Tout est bloqué',
            message: 'Vous ne devriez pas jouer en ce moment, vous avez des choses importantes à faire.',
            characterSpeech: 'Hé ! Sors dehors.'
        },
        de: {
            title: 'Alles ist blockiert',
            message: 'Du solltest im Moment nicht spielen, du hast wichtige Dinge zu tun.',
            characterSpeech: 'Hey! Geh nach draußen.'
        },
        it: {
            title: 'Tutto è bloccato',
            message: 'Non dovresti giocare in questo momento, hai cose importanti da fare.',
            characterSpeech: 'Ehi! Esci fuori.'
        },
        pt: {
            title: 'Tudo está bloqueado',
            message: 'Você não deveria jogar agora, você tem coisas importantes para fazer.',
            characterSpeech: 'Ei! Vá para fora.'
        },
        ru: {
            title: 'Все заблокировано',
            message: 'Вы не должны играть сейчас, у вас есть важные дела.',
            characterSpeech: 'Эй! Иди на улицу.'
        },
        ja: {
            title: 'すべてブロックされています',
            message: '今はプレイすべきではありません。重要なことがあります。',
            characterSpeech: 'ねえ！外に出ようよ。'
        },
        zh: {
            title: '一切都被阻止了',
            message: '您现在不应该玩，您有重要的事情要做。',
            characterSpeech: '嘿！出去外面。'
        },
        // Add more languages as needed
    };
//*







































    // The large marker
    document.getElementById('drawwidthrange').min=-9999

    let symmetryMode = null;
    let currentBrushType = 0;


    function initializeSymmetryDropdown() {
        const symmetryDropdown = document.querySelector('#option-symmetry select');
        const canvas = document.querySelector('canvas');

        if (symmetryDropdown) {
            symmetryDropdown.style.pointerEvents = 'auto';
            symmetryDropdown.style.display = 'block';

            symmetryDropdown.addEventListener('change', function () {
                symmetryMode = parseInt(symmetryDropdown.value, 10);

                if (canvas) {
                    canvas.setAttribute('data-symmetry', symmetryMode);
                }
            });
        }
    }

    function trackBrushSelection() {
        const markerButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="line"]');
        const aliasedMarkerButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="aliasedline"]');
        const inkBrushButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="brush"]');

        if (markerButton) {
            markerButton.addEventListener('click', () => {
                currentBrushType = 0; // Marker (antialiased)
            });
        }

        if (aliasedMarkerButton) {
            aliasedMarkerButton.addEventListener('click', () => {
                currentBrushType = 1; // Marker (not antialiased)
            });
        }

        if (inkBrushButton) {
            inkBrushButton.addEventListener('click', () => {
                currentBrushType = 2; // Ink Brush
            });
        }
    }

    function enableMoveButtonDragging() {
        const moveButton = document.querySelector("#canvasoverlays-movebutton");
        const canvas = document.querySelector("canvas");

        if (!moveButton || !canvas) {
            return;
        }

        let isDragging = false;
        let initialOffsetX = 0;
        let initialOffsetY = 0;

        moveButton.addEventListener("mousedown", (event) => {
            isDragging = true;

            initialOffsetX = event.clientX - (moveButton.offsetLeft + moveButton.offsetWidth / 2);
            initialOffsetY = event.clientY - (moveButton.offsetTop + moveButton.offsetHeight / 2);

            moveButton.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const newLeft = event.clientX - initialOffsetX - moveButton.offsetWidth / 2;
                const newTop = event.clientY - initialOffsetY - moveButton.offsetHeight / 2;

                const constrainedLeft = Math.max(0, Math.min(newLeft, canvas.offsetWidth - moveButton.offsetWidth));
                const constrainedTop = Math.max(0, Math.min(newTop, canvas.offsetHeight - moveButton.offsetHeight));

                moveButton.style.left = `${constrainedLeft}px`;
                moveButton.style.top = `${constrainedTop}px`;

                const normalizedX = (constrainedLeft + moveButton.offsetWidth / 2) / canvas.width;
                const normalizedY = (constrainedTop + moveButton.offsetHeight / 2) / canvas.height;

                canvas.setAttribute("data-center-x", normalizedX.toFixed(5));
                canvas.setAttribute("data-center-y", normalizedY.toFixed(5));

            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                moveButton.style.cursor = "grab";
            }
        });

    }

    function drawPolygon(ctx, x, y, radius, sides) {
        const angleIncrement = (2 * Math.PI) / sides;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = i * angleIncrement;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    function applyLocalSymmetry(ctx, x, y, symmetryMode, canvas) {
        const width = canvas.width;
        const height = canvas.height;

        const centerX = (parseFloat(canvas.getAttribute("data-center-x")) || 0.5) * canvas.width;
        const centerY = (parseFloat(canvas.getAttribute("data-center-y")) || 0.5) * canvas.height;

        const symmetryMap = {
            102: 2, 103: 3, 104: 4, 105: 5, 106: 6, 107: 7, 108: 8, 109: 9, // Radial
            202: 2, 203: 3, 204: 4, 205: 5, 206: 6, 207: 7, 208: 8, 209: 9, // Radial + Mirror
            1: "horizontal", // Horizontal mirroring
            2: "vertical", // Vertical mirroring
            3: "diagonal" // Diagonal mirroring
        };

        const numSectors = symmetryMap[symmetryMode];
        ctx.imageSmoothingEnabled = currentBrushType === 0;


        if (typeof numSectors === "number") {
            const dx = x - centerX;
            const dy = y - centerY;

            for (let i = 0; i < numSectors; i++) {
                const angle = (Math.PI * 2 * i) / numSectors;

                // Compute coordinates for the rotated sector
                const rotatedX = Math.round(centerX + dx * Math.cos(angle) - dy * Math.sin(angle));
                const rotatedY = Math.round(centerY + dx * Math.sin(angle) + dy * Math.cos(angle));

                if (currentBrushType === 0) {
                    // Marker 0 logic (antialiased)
                    ctx.beginPath();
                    ctx.moveTo(rotatedX, rotatedY);
                    ctx.lineTo(rotatedX, rotatedY);
                    ctx.stroke();

                    if (symmetryMode >= 202 && symmetryMode <= 209) {
                        const isOddSector = numSectors % 2 !== 0;
                        const offsetAngle = isOddSector ? Math.PI / numSectors : 0;

                        const mirroredX = centerX + dx * Math.cos(angle + offsetAngle) + dy * Math.sin(angle + offsetAngle);
                        const mirroredY = centerY + dx * Math.sin(angle + offsetAngle) - dy * Math.cos(angle + offsetAngle);

                        ctx.beginPath();
                        ctx.moveTo(mirroredX, mirroredY);
                        ctx.lineTo(mirroredX, mirroredY);
                        ctx.stroke();
                    }

                } else if (currentBrushType === 1) {
                    const radius = Math.round(ctx.lineWidth / 2); // Use a pixel-perfect radius
                    ctx.imageSmoothingEnabled = false;
                    // Marker 1 logic (not antialiased)
                    const cornerRadius = Math.min(radius * 0.9, radius); // Adjust the corner radius
                    drawPolygon(ctx, rotatedX, rotatedY, radius, 20);


                    if (symmetryMode >= 202 && symmetryMode <= 209) {
                        const isOddSector = numSectors % 2 !== 0;
                        const offsetAngle = isOddSector ? Math.PI / numSectors : 0;

                        const mirroredX = centerX + dx * Math.cos(angle + offsetAngle) + dy * Math.sin(angle + offsetAngle);
                        const mirroredY = centerY + dx * Math.sin(angle + offsetAngle) - dy * Math.cos(angle + offsetAngle);

                        drawPolygon(ctx, mirroredX, mirroredY, radius, 20);
                    }
                }
            }

        } else if (typeof numSectors === "string") {
            const radius = Math.round(ctx.lineWidth / 2); // Use pixel-perfect radius
            const snappedX = Math.round(x);
            const snappedY = Math.round(y);

            if (numSectors === "vertical") {
                const mirroredY = centerY + (centerY - snappedY);
                if (currentBrushType === 0) {
                    ctx.beginPath();
                    ctx.moveTo(snappedX, snappedY);
                    ctx.lineTo(snappedX, snappedY);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(snappedX, mirroredY);
                    ctx.lineTo(snappedX, mirroredY);
                    ctx.stroke();
                } else if (currentBrushType === 1) {
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, snappedX, mirroredY, radius, 20);
                }

            } else if (numSectors === "horizontal") {
                const mirroredX = centerX + (centerX - snappedX);
                if (currentBrushType === 0) {
                    ctx.beginPath();
                    ctx.moveTo(snappedX, snappedY);
                    ctx.lineTo(snappedX, snappedY);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(mirroredX, snappedY);
                    ctx.lineTo(mirroredX, snappedY);
                    ctx.stroke();
                } else if (currentBrushType === 1) {
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, mirroredX, snappedY, radius, 20);
                }

            } else if (numSectors === "diagonal") {
                const mirroredX = centerX + (centerX - snappedX);
                const mirroredY = centerY + (centerY - snappedY);
                if (currentBrushType === 0) {
                    ctx.beginPath();
                    ctx.moveTo(snappedX, snappedY);
                    ctx.lineTo(snappedX, snappedY);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(mirroredX, mirroredY);
                    ctx.lineTo(mirroredX, mirroredY);
                    ctx.stroke();
                } else if (currentBrushType === 1) {
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, mirroredX, mirroredY, radius, 20);
                }
            }
        } else {
            console.warn("Unsupported symmetry mode:", symmetryMode);
        }
    }

    function interpolatePoints(lastX, lastY, currentX, currentY, steps) {
        const points = [];
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const interpolatedX = lastX + (currentX - lastX) * t;
            const interpolatedY = lastY + (currentY - lastY) * t;
            points.push([interpolatedX, interpolatedY]);
        }
        return points;
    }

    function forceLocalSymmetryRendering() {
        const canvas = document.querySelector("canvas");
        const colorFlowInput = document.querySelector('[data-localprop="colorflow"]');
        if (!canvas) {
            console.warn("Canvas not found.");
            return;
        }

        const ctx = canvas.getContext("2d");
        let isDrawing = false;
        let hasStartedInsideCanvas = false;
        let lastX = null;
        let lastY = null;

        function isWithinCanvasBounds(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            return x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;
        }

        canvas.addEventListener("mousedown", (event) => {
            if (event.button === 2) {
                return;
            }
            if (isWithinCanvasBounds(event)) {
                isDrawing = true;
                hasStartedInsideCanvas = true;
                lastX = event.offsetX;
                lastY = event.offsetY;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);

                const moveButton = document.querySelector("#canvasoverlays-movebutton");
                if (moveButton) {
                    moveButton.style.pointerEvents = "none";
                } else {
                    console.warn("Move button not found.");
                }
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            if (!isDrawing || !hasStartedInsideCanvas) return;

            if (!isWithinCanvasBounds(event)) {
                lastX = null;
                lastY = null;
                return;
            }

            const x = event.offsetX;
            const y = event.offsetY;
            const symmetryMode = parseInt(canvas.getAttribute("data-symmetry"), 10);

            // Handle color flow and symmetry for brush type 1 (not antialiased)
            if (colorFlowInput && currentBrushType === 1) {
                const colorFlowValue = parseFloat(colorFlowInput.value);
                if (colorFlowValue > 0) {
                    const gradient = ctx.createLinearGradient(lastX, lastY, x, y);
                    ctx.strokeStyle = gradient;
                }
            }

            if (symmetryMode) {
                if (lastX !== null && lastY !== null) {
                    const interpolatedPoints = interpolatePoints(lastX, lastY, x, y, 10);
                    interpolatedPoints.forEach(([interpX, interpY]) => {
                        applyLocalSymmetry(ctx, interpX, interpY, symmetryMode, canvas);
                    });
                } else {
                    applyLocalSymmetry(ctx, x, y, symmetryMode, canvas);
                }
            } else {
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            lastX = x;
            lastY = y;
        });

        document.addEventListener("mouseup", (event) => {
            if (!isWithinCanvasBounds(event) && isDrawing) {
                const evtDown = new MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    buttons: 1,
                    clientX: canvas.getBoundingClientRect().left + 1,
                    clientY: canvas.getBoundingClientRect().top + 1
                });
                const evtUp = new MouseEvent("mouseup", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    buttons: 0,
                    clientX: canvas.getBoundingClientRect().left + 1,
                    clientY: canvas.getBoundingClientRect().top + 1
                });
                canvas.dispatchEvent(evtDown);
                canvas.dispatchEvent(evtUp);
            }

            isDrawing = false;
            hasStartedInsideCanvas = false;
            ctx.closePath();

            const moveButton = document.querySelector("#canvasoverlays-movebutton");
            if (moveButton) {
                moveButton.style.pointerEvents = "auto";
            }
        });

        canvas.addEventListener("mouseout", () => {
            if (isDrawing) {
                return;
            }
            isDrawing = false;
            hasStartedInsideCanvas = false;
            ctx.closePath();

            const moveButton = document.querySelector("#canvasoverlays-movebutton");
            if (moveButton) {
                moveButton.style.pointerEvents = "auto";
            }
        });

        canvas.addEventListener("mouseenter", (event) => {
            if (event.buttons === 1) {
                isDrawing = true;

                ctx.beginPath();
                lastX = event.offsetX;
                lastY = event.offsetY;
                ctx.moveTo(lastX, lastY);
            }
        });

        canvas.addEventListener('mousewheel', function (event) {
            ctx.lineWidth += event.deltaY * 0.07; // Adjust the multiplier as necessary
            event.preventDefault();
        });
    }

    function interceptWebSocketMessages() {
        let socket;

        const originalSend = WebSocket.prototype.send;
        let isCursorInsideCanvas = true;
        let blockDrawingCommands = false;

        const canvas = document.querySelector("canvas");
        if (!canvas) {
            console.warn("Canvas not found.");
            return;
        }


        let blockTimer;

        function setBlockDrawingCommands(block) {
            clearTimeout(blockTimer); // Clear existing timer
            blockDrawingCommands = block;

            if (block) {
                // Set timeout to automatically unblock after 0.5 second
                blockTimer = setTimeout(() => {
                    blockDrawingCommands = false;
                }, 500);
            }
        }

        // Update cursor position
        canvas.addEventListener("mouseenter", () => {
            isCursorInsideCanvas = true;
            setBlockDrawingCommands(false);
        });

        canvas.addEventListener("mouseleave", () => {
            isCursorInsideCanvas = false;
            setBlockDrawingCommands(true);
        });

        WebSocket.prototype.send = function (...args) {
            if (!socket) {
                socket = this;
                socket.addEventListener("open", () => {
                    console.log("WebSocket connection successfully established.");
                });
            }

            try {
                if (typeof args[0] === "string" && args[0].startsWith("42")) {
                    const parsedData = JSON.parse(args[0].slice(2));
                    const command = parsedData[0];

                    if (command === "drawcmd" && Array.isArray(parsedData[2])) {
                        if (!isCursorInsideCanvas && blockDrawingCommands) {
                            console.warn("Blocked drawcmd WebSocket command because cursor is outside the canvas and within block period.");
                            return;
                        }

                        const subcommand = parsedData[1];
                        const payload = parsedData[2];
                        const centerX = parseFloat(canvas.getAttribute("data-center-x")) || 0.5;
                        const centerY = parseFloat(canvas.getAttribute("data-center-y")) || 0.5;

                        if (symmetryMode !== null) {
                            const symmetryData = {
                                "2": symmetryMode,
                                "3": centerX,
                                "4": centerY,
                            };

                            payload[8] = currentBrushType;
                            payload[9] = symmetryData;
                        }

                        const modifiedMessage = `42${JSON.stringify(["drawcmd", subcommand, payload])}`;
                        args[0] = modifiedMessage;
                    }
                }
            } catch (error) {
                console.error("Error intercepting WebSocket message:", error);
            }

            originalSend.apply(this, args);
        };
    }

    function enforceVisibilityAndFunctionality() {
        const settingsContainers = document.querySelectorAll('.drawcontrols-settingscontainer');
        settingsContainers.forEach(container => {
            if (container.style.display === 'none') {
                container.style.display = '';
            }

            const dropdowns = container.querySelectorAll('select');
            dropdowns.forEach(dropdown => {

                dropdown.style.pointerEvents = 'auto';
                dropdown.style.display = 'block';
                dropdown.style.position = 'relative';
                dropdown.style.zIndex = '1000';

                dropdown.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    setTimeout(() => {
                        dropdown.style.display = 'block';
                    }, 10);
                }, true);
            });
        });

        const buttons = document.querySelectorAll('.drawcontrols-button');
        buttons.forEach(button => {
            const popupButtons = button.querySelectorAll('.drawcontrols-popupbutton');
            popupButtons.forEach(popupButton => {
                popupButton.style.display = '';


                popupButton.addEventListener('click', () => {
                    popupButtons.forEach(btn => btn.classList.remove('drawcontrols-popupbutton-active'));
                    popupButton.classList.add('drawcontrols-popupbutton-active');
                });
            });
        });

        initializeSymmetryDropdown();
    }

    window.addEventListener('load', function() {
        enforceVisibilityAndFunctionality();
        enableMoveButtonDragging();

        const observer = new MutationObserver(() => {
            enforceVisibilityAndFunctionality();
            enableMoveButtonDragging();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });

        trackBrushSelection();

        interceptWebSocketMessages();

        forceLocalSymmetryRendering();
    });
})();

