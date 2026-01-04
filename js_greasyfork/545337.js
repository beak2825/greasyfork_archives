// ==UserScript==
// @name         Symmetry
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Ensure settings container, dropdowns, Ink Brush, and Symmetry functionality remain visible and functional
// @author       Infinite
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/545337/Symmetry.user.js
// @updateURL https://update.greasyfork.org/scripts/545337/Symmetry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The large marker. (1)
    document.getElementById('drawwidthrange').min=-9999

    let symmetryMode = null; // Store the selected symmetry mode
    let currentBrushType = 0; // Default to marker brush (antialiased)


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
        // Query all the brush buttons using their data attributes
        const markerButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="line"]');
        const aliasedMarkerButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="aliasedline"]');
        const inkBrushButton = document.querySelector('.drawcontrols-popupbutton[data-buttonid="brush"]');

        // Add click event listeners to update the currentBrushType variable
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

                // Constrain button within canvas boundaries
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

    function applyLocalSymmetry(ctx, x, y, symmetryMode, canvas, originalLineWidth) {
        const width = canvas.width;
        const height = canvas.height;

        // Retrieve updated center offsets from the canvas attributes
        const centerX = (parseFloat(canvas.getAttribute("data-center-x")) || 0.5) * canvas.width;
        const centerY = (parseFloat(canvas.getAttribute("data-center-y")) || 0.5) * canvas.height;

        // Map symmetry modes to the number of sectors
        const symmetryMap = {
            102: 2, 103: 3, 104: 4, 105: 5, 106: 6, 107: 7, 108: 8, 109: 9, // Radial
            202: 2, 203: 3, 204: 4, 205: 5, 206: 6, 207: 7, 208: 8, 209: 9, // Radial + Mirror
            1: "horizontal", // Horizontal mirroring
            2: "vertical", // Vertical mirroring
            3: "diagonal" // Diagonal mirroring
        };

        const numSectors = symmetryMap[symmetryMode];
        ctx.imageSmoothingEnabled = currentBrushType === 0; // Antialiased for type 0, off for others

        if (typeof numSectors === "number") {
            const dx = x - centerX;
            const dy = y - centerY;

            for (let i = 0; i < numSectors; i++) {
                const angle = (Math.PI * 2 * i) / numSectors;

                // Compute coordinates for the rotated sector
                const rotatedX = Math.round(centerX + dx * Math.cos(angle) - dy * Math.sin(angle));
                const rotatedY = Math.round(centerY + dx * Math.sin(angle) + dy * Math.cos(angle));

                if (currentBrushType === 0) {
                    ctx.imageSmoothingEnabled = true;
                    // Marker 0 logic (antialiased)
                    ctx.beginPath();
                    ctx.moveTo(rotatedX, rotatedY);
                    ctx.lineTo(rotatedX, rotatedY);
                    ctx.stroke();

                    if (symmetryMode >= 202 && symmetryMode <= 209) {
                        const isOddSector = numSectors % 2 !== 0;
                        const offsetAngle = isOddSector ? Math.PI / numSectors : 0;

                        const mirroredX = Math.round(centerX + dx * Math.cos(angle + offsetAngle) + dy * Math.sin(angle + offsetAngle));
                        const mirroredY = Math.round(centerY + dx * Math.sin(angle + offsetAngle) - dy * Math.cos(angle + offsetAngle));

                        ctx.beginPath();
                        ctx.moveTo(mirroredX, mirroredY);
                        ctx.lineTo(mirroredX, mirroredY);
                        ctx.stroke();
                    }
                } else if (currentBrushType === 1) {
                    ctx.imageSmoothingEnabled = false;
                    const adjustedLineWidth = Math.max(1, originalLineWidth * 0.5); // Use original line width with 50% reduction
                    const radius = Math.round(adjustedLineWidth);
                    const snappedX = Math.round(rotatedX);
                    const snappedY = Math.round(rotatedY);

                    // Draw polygon for this sector
                    drawPolygon(ctx, snappedX, snappedY, radius, 20);

                    // If mirror symmetry is also enabled
                    if (symmetryMode >= 202 && symmetryMode <= 209) {
                        const isOddSector = numSectors % 2 !== 0;
                        const offsetAngle = isOddSector ? Math.PI / numSectors : 0;

                        const mirroredX = Math.round(centerX + dx * Math.cos(angle + offsetAngle) + dy * Math.sin(angle + offsetAngle));
                        const mirroredY = Math.round(centerY + dx * Math.sin(angle + offsetAngle) - dy * Math.cos(angle + offsetAngle));

                        drawPolygon(ctx, mirroredX, mirroredY, radius, 20);
                    }
                } else if (currentBrushType === 2) {
                    ctx.imageSmoothingEnabled = false;
                    const adjustedLineWidth = Math.max(1, originalLineWidth * 0.8);
                    const radius = Math.round(adjustedLineWidth);
                    const snappedX = Math.round(rotatedX);
                    const snappedY = Math.round(rotatedY);

                    // Draw polygon for this sector
                    drawPolygon(ctx, snappedX, snappedY, radius, 1000);

                    // If mirror symmetry is also enabled
                    if (symmetryMode >= 202 && symmetryMode <= 209) {
                        const isOddSector = numSectors % 2 !== 0;
                        const offsetAngle = isOddSector ? Math.PI / numSectors : 0;

                        const mirroredX = Math.round(centerX + dx * Math.cos(angle + offsetAngle) + dy * Math.sin(angle + offsetAngle));
                        const mirroredY = Math.round(centerY + dx * Math.sin(angle + offsetAngle) - dy * Math.cos(angle + offsetAngle));

                        drawPolygon(ctx, mirroredX, mirroredY, radius, 1000);
                    }
                }
            }
        } else if (typeof numSectors === "string") {
            const adjustedLineWidth = Math.max(1, originalLineWidth * 0.5); // Use original line width with 50% reduction
            const radius = Math.round(adjustedLineWidth);
            const snappedX = Math.round(x);
            const snappedY = Math.round(y);

            // Handle mirroring symmetries
            if (numSectors === "vertical") {
                const mirroredY = Math.round(centerY + (centerY - snappedY));
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
                    ctx.imageSmoothingEnabled = false;
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, snappedX, mirroredY, radius, 20);
                } else if (currentBrushType === 2) {
                    ctx.imageSmoothingEnabled = false;
                    const adjustedLineWidth = Math.max(1, originalLineWidth);
                    const radius = Math.round(adjustedLineWidth);
                    drawPolygon(ctx, snappedX, snappedY, radius, 1000);
                    drawPolygon(ctx, snappedX, mirroredY, radius, 1000);
                }
            } else if (numSectors === "horizontal") {
                const mirroredX = Math.round(centerX + (centerX - snappedX));
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
                    ctx.imageSmoothingEnabled = false;
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, mirroredX, snappedY, radius, 20);
                } else if (currentBrushType === 2) {
                    ctx.imageSmoothingEnabled = false;
                    const adjustedLineWidth = Math.max(1, originalLineWidth);
                    const radius = Math.round(adjustedLineWidth);
                    drawPolygon(ctx, snappedX, snappedY, radius, 1000);
                    drawPolygon(ctx, mirroredX, snappedY, radius, 1000);
                }
            } else if (numSectors === "diagonal") {
                const mirroredX = Math.round(centerX + (centerX - snappedX));
                const mirroredY = Math.round(centerY + (centerY - snappedY));
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
                    ctx.imageSmoothingEnabled = false;
                    drawPolygon(ctx, snappedX, snappedY, radius, 20); // Draw 20-sided polygon
                    drawPolygon(ctx, mirroredX, mirroredY, radius, 20);
                } else if (currentBrushType === 2) {
                    ctx.imageSmoothingEnabled = false;
                    const adjustedLineWidth = Math.max(1, originalLineWidth);
                    const radius = Math.round(adjustedLineWidth);
                    drawPolygon(ctx, snappedX, snappedY, radius, 1000);
                    drawPolygon(ctx, mirroredX, mirroredY, radius, 1000);
                }
            }
        } else {
            console.warn("Unsupported symmetry mode:", symmetryMode);
        }
    }

    // Function to interpolate points between last and current positions
    function interpolatePoints(lastX, lastY, currentX, currentY, steps) {
        const points = [];
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const interpolatedX = lastX + (currentX - lastX) * t;
            const interpolatedY = lastY + (currentY - lastY) * t;
            points.push([interpolatedX, interpolatedY]); // Collect the interpolated points
        }
        return points; // Return the array of points
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
        let hasStartedInsideCanvas = false; // Tracks if the drawing started inside the canvas
        let lastX = null;
        let lastY = null;

        // Helper function to check if the cursor is within canvas bounds
        function isWithinCanvasBounds(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            return x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;
        }

        canvas.addEventListener("mousedown", (event) => {
            if (event.button === 2) {
                // Skip right-click (secondary mouse button)
                return;
            }
            if (isWithinCanvasBounds(event)) {
                isDrawing = true;
                hasStartedInsideCanvas = true; // Mark that drawing started inside the canvas
                lastX = event.offsetX;
                lastY = event.offsetY;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY); // Start at the initial point

                // Disable pointer events for the symmetry button dynamically
                const moveButton = document.querySelector("#canvasoverlays-movebutton");
                if (moveButton) {
                    moveButton.style.pointerEvents = "none";
                } else {
                    console.warn("Move button not found.");
                }
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            if (!isDrawing || !hasStartedInsideCanvas) return; // Prevent drawing if not started inside

            // Ensure drawing only occurs if within canvas bounds
            if (!isWithinCanvasBounds(event)) {
                lastX = null;
                lastY = null;
                return; // Prevent drawing or broadcasting outside the canvas
            }

            const x = event.offsetX;
            const y = event.offsetY;
            const symmetryMode = parseInt(canvas.getAttribute("data-symmetry"), 10);

            // Handle color flow and symmetry for brush type 1 (not antialiased) and ink brush
            if (colorFlowInput && currentBrushType === 1 || currentBrushType === 2) {
                const colorFlowValue = parseFloat(colorFlowInput.value);
                if (colorFlowValue >= 0) {
                    const gradient = ctx.createLinearGradient(lastX, lastY, x, y);
                    ctx.strokeStyle = gradient; // Apply the gradient dynamically
                }
            }

            // Apply symmetry if active
            if (symmetryMode) {
                const originalLineWidth = ctx.lineWidth; // Save original line width
                if (lastX !== null && lastY !== null) {
                    const interpolatedPoints = interpolatePoints(lastX, lastY, x, y, 2);
                    interpolatedPoints.forEach(([interpX, interpY]) => {
                        applyLocalSymmetry(ctx, interpX, interpY, symmetryMode, canvas, originalLineWidth);
                    });
                } else {
                    applyLocalSymmetry(ctx, x, y, symmetryMode, canvas, originalLineWidth);
                }
            } else {
                // Default line rendering
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            lastX = x;
            lastY = y;
        });

        document.addEventListener("mouseup", (event) => {
            if (!isWithinCanvasBounds(event) && isDrawing) {
                // Simulate a mouse down and up to re-enable interactions if released outside
                const evtDown = new MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    buttons: 1,
                    clientX: canvas.getBoundingClientRect().left + 1, // Position inside canvas
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
            hasStartedInsideCanvas = false; // Reset flag when mouse is released
            ctx.closePath();

            // Re-enable pointer events for the symmetry button dynamically
            const moveButton = document.querySelector("#canvasoverlays-movebutton");
            if (moveButton) {
                moveButton.style.pointerEvents = "auto";
            }
        });

        canvas.addEventListener("mouseout", () => {
            if (isDrawing) {
                // Allow continuing drawing if already started inside canvas
                return;
            }
            isDrawing = false;
            hasStartedInsideCanvas = false; // Reset if mouse leaves canvas before starting
            ctx.closePath();

            // Re-enable pointer events for the symmetry button dynamically
            const moveButton = document.querySelector("#canvasoverlays-movebutton");
            if (moveButton) {
                moveButton.style.pointerEvents = "auto";
            }
        });

        canvas.addEventListener("mouseenter", (event) => {
            if (event.buttons === 1) { // Left mouse button is still pressed
                isDrawing = true;

                // Reset the path to prevent phantom lines
                ctx.beginPath();
                lastX = event.offsetX;
                lastY = event.offsetY;
                ctx.moveTo(lastX, lastY); // Restart path from new position
            }
        });

        canvas.addEventListener('mousewheel', function (event) {
            ctx.lineWidth += event.deltaY * 0.1; // Adjust the multiplier as necessary
            event.preventDefault(); // Prevent the page from scrolling
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

        // Timer to manage blocking state
        let blockTimer;

        function setBlockDrawingCommands(block) {
            clearTimeout(blockTimer); // Clear existing timer
            blockDrawingCommands = block;

            if (block) {
                // Set timeout to automatically unblock after 1 second
                blockTimer = setTimeout(() => {
                    blockDrawingCommands = false;
                }, 500);
            }
        }

        // Update cursor position
        canvas.addEventListener("mouseenter", () => {
            isCursorInsideCanvas = true;
            setBlockDrawingCommands(false); // Immediately allow drawing when cursor is inside
        });

        canvas.addEventListener("mouseleave", () => {
            isCursorInsideCanvas = false;
            setBlockDrawingCommands(true); // Block drawing commands for 5 seconds
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
                    const parsedData = JSON.parse(args[0].slice(2)); // Remove "42" prefix and parse JSON
                    const command = parsedData[0];

                    if (command === "drawcmd" && Array.isArray(parsedData[2])) {
                        // Prevent drawing commands if cursor is outside the canvas and blocking is active
                        if (!isCursorInsideCanvas && blockDrawingCommands) {
                            console.warn("Blocked drawcmd WebSocket command because cursor is outside the canvas and within block period.");
                            return; // Do not send the message
                        }

                        // Otherwise, modify the message as needed and send
                        const subcommand = parsedData[1];
                        const payload = parsedData[2];
                        const centerX = parseFloat(canvas.getAttribute("data-center-x")) || 0.5;
                        const centerY = parseFloat(canvas.getAttribute("data-center-y")) || 0.5;

                        if (symmetryMode !== null) {
                            const symmetryData = {
                                "2": symmetryMode, // Symmetry type
                                "3": centerX, // Updated X offset
                                "4": centerY, // Updated Y offset
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
            // Ensure the settings container is visible
            if (container.style.display === 'none') {
                container.style.display = ''; // Make sure the container is visible
            }

            const dropdowns = container.querySelectorAll('select');
            dropdowns.forEach(dropdown => {
                // Ensure dropdowns are visible and interactable
                dropdown.style.pointerEvents = 'auto';
                dropdown.style.display = 'block';
                dropdown.style.position = 'relative';
                dropdown.style.zIndex = '1000';

                // Handle click events to maintain visibility
                dropdown.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default behavior that might hide the dropdown
                    event.stopPropagation(); // Stop the event from bubbling up
                    setTimeout(() => { // Apply visibility again after other scripts might have executed
                        dropdown.style.display = 'block';
                    }, 10);
                }, true);
            });
        });

        // Ensure the Ink Brush button is visible
        const buttons = document.querySelectorAll('.drawcontrols-button');
        buttons.forEach(button => {
            const popupButtons = button.querySelectorAll('.drawcontrols-popupbutton');
            popupButtons.forEach(popupButton => {
                popupButton.style.display = ''; // Ensure all tool buttons are visible

                // Attach click event to handle class updates
                popupButton.addEventListener('click', () => {
                    // Remove the active class from all buttons in the group
                    popupButtons.forEach(btn => btn.classList.remove('drawcontrols-popupbutton-active'));
                    // Add the active class to the clicked button
                    popupButton.classList.add('drawcontrols-popupbutton-active');
                });
            });
        });

        // Initialize symmetry dropdown functionality
        initializeSymmetryDropdown();
    }

    window.addEventListener('load', function() {
        enforceVisibilityAndFunctionality(); // Apply settings once the window has loaded
        enableMoveButtonDragging(); // Enable dragging for the move button

        // Set up an observer to monitor DOM changes and reapply settings as needed
        const observer = new MutationObserver(() => {
            enforceVisibilityAndFunctionality(); // Reapply settings upon any DOM changes
            enableMoveButtonDragging(); // Reapply dragging in case the button gets recreated
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });

        // Track brush selection
        trackBrushSelection();

        // Intercept WebSocket messages for symmetry functionality
        interceptWebSocketMessages();

        // Apply local symmetry rendering
        forceLocalSymmetryRendering();
    });
})();
