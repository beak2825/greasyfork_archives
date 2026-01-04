// ==UserScript==
// @name         Draw on Page
// @version      1.3
// @description  Allows you to draw directly on webpages when you press Shift+Alt+D
// @author       someRandomGuy2
// @match        *://*/*
// @grant        none
// @license      Apache-2.0
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/461397/Draw%20on%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/461397/Draw%20on%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container;
    let drawingCanvas;
    let contextMenuContainer;
    let contextMenu;
    let enabled = false;
    let color = "#ff0000";

    const prerenderCanvas = document.createElement("canvas");
    const prerenderCanvasX = prerenderCanvas.getContext("2d");

    const brushes = {
        pen: function(X, startX, startY, endX, endY, pressure) {
            const movementX = endX - startX;
            const movementY = endY - startY;
            const step = 2;
            const distance = Math.sqrt(movementX * movementX + movementY * movementY);
            const size = 4 * pressure;
            const halfSize = size / 2;
            const distanceStep = Math.max(0.2, size * 0.3);
            const softness = 0.4; // = 1 - hardness
            const prerenderCanvasSize = Math.ceil(size + 12);

            if (prerenderCanvasSize == 0) { return; }

            prerenderCanvas.width = prerenderCanvasSize;
            prerenderCanvas.height = prerenderCanvasSize;
            prerenderCanvasX.fillStyle = color;
            prerenderCanvasX.beginPath();
            prerenderCanvasX.filter = `blur(0.5px)`;
            prerenderCanvasX.arc(prerenderCanvasSize / 2, prerenderCanvasSize / 2, halfSize, 0, 2 * Math.PI);
            prerenderCanvasX.fill();

            for (let i = 0; i < distance; i += distanceStep) {
                const x = startX * (1 - i / distance) + endX * (i / distance);
                const y = startY * (1 - i / distance) + endY * (i / distance);
                X.drawImage(prerenderCanvas, x - prerenderCanvasSize / 2, y - prerenderCanvasSize / 2);
            }
            X.drawImage(prerenderCanvas, endX - prerenderCanvasSize / 2, endY - prerenderCanvasSize / 2);
        },

        eraser: function(X, startX, startY, endX, endY, pressure) {
            const movementX = endX - startX;
            const movementY = endY - startY;
            const step = 2;
            const distance = Math.sqrt(movementX * movementX + movementY * movementY);
            const size = 50 * pressure;
            const halfSize = size / 2;
            const distanceStep = Math.max(0.2, size * 0.2);

            for (let i = 0; i < distance; i += distanceStep) {
                const x = startX * (1 - i / distance) + endX * (i / distance);
                const y = startY * (1 - i / distance) + endY * (i / distance);
                X.clearRect(x - halfSize, y - halfSize, size, size);
            }
            X.clearRect(endX - halfSize, endY - halfSize, size, size);
        },
    };

    function toggleDrawable() {
        initIfNotAlready();
        if (enabled) {
            enabled = false;
            container.classList.add("tm-drawing-canvas-fallthrough");
        } else {
            enabled = true;
            container.classList.remove("tm-drawing-canvas-fallthrough");
        }
    }

    function initIfNotAlready() {
        if (container) { return; }
        container = document.createElement("div");
        container.classList.add("tm-drawing-canvas-container");

        drawingCanvas = document.createElement("canvas");
        drawingCanvas.classList.add("tm-drawing-canvas");
        container.appendChild(drawingCanvas);
        drawingCanvas.width = innerWidth * devicePixelRatio;
        drawingCanvas.height = innerHeight * devicePixelRatio;

        const X = drawingCanvas.getContext("2d");

        contextMenuContainer = document.createElement("div");
        contextMenuContainer.classList.add("tm-drawing-canvas-context-menu-container");

        contextMenu = document.createElement("div");
        contextMenuContainer.appendChild(contextMenu);
        contextMenu.classList.add("tm-drawing-canvas-context-menu");

        const clearCanvasOption = document.createElement("div");
        clearCanvasOption.innerText = "Clear canvas";
        contextMenu.appendChild(clearCanvasOption);

        const saveCanvasOption = document.createElement("div");
        saveCanvasOption.innerText = "Save canvas";
        contextMenu.appendChild(saveCanvasOption);

        const changeColor = document.createElement("div");
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.value = color;
        changeColor.appendChild(colorPicker);
        contextMenu.appendChild(changeColor);

        const dropShadowToggle = document.createElement("div");
        dropShadowToggle.innerText = "Toggle drop shadow";
        contextMenu.appendChild(dropShadowToggle);

        let mouseDown = false;

        drawingCanvas.addEventListener("pointerdown", function() { mouseDown = true; });
        drawingCanvas.addEventListener("pointerup", function() { mouseDown = false; });

        drawingCanvas.addEventListener("pointermove", function(event) {
            if (!mouseDown) { return; }
            const brush = event.shiftKey ? brushes.eraser : brushes.pen;
            const scaleX = drawingCanvas.width / innerWidth;
            const scaleY = drawingCanvas.height / innerHeight;
            const startX = (event.x - event.movementX) * scaleX;
            const startY = (event.y - event.movementY) * scaleY;
            const endX = event.x * scaleX;
            const endY = event.y * scaleY;

            brush(X, startX, startY, endX, endY, event.pressure);
        });

        drawingCanvas.addEventListener("contextmenu", function(event) {
            contextMenu.style.top = event.clientY + "px";
            contextMenu.style.left = event.clientX + "px";
            container.appendChild(contextMenuContainer);
            event.preventDefault();
        });

        function addContextMenuItemClickListener(elm, func) {
            elm.addEventListener("click", func);
            elm.addEventListener("mouseup", ev => func(ev, true));
        }

        function closeContextMenu() {
            container.removeChild(contextMenuContainer);
        }

        addContextMenuItemClickListener(contextMenuContainer, function(event, mouseupShortcutClick) {
            if (mouseupShortcutClick) {
                if (event.target != contextMenuContainer && event.target != contextMenu) {
                    closeContextMenu();
                }
            } else {
                closeContextMenu();
            }
        });

        addContextMenuItemClickListener(clearCanvasOption, function() {
            // clear canvas
            X.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawingCanvas.width = innerWidth * devicePixelRatio;
            drawingCanvas.height = innerHeight * devicePixelRatio;
        });

        addContextMenuItemClickListener(saveCanvasOption, function() {
            drawingCanvas.toBlob(blob => open(URL.createObjectURL(blob)))
        });

        addContextMenuItemClickListener(dropShadowToggle, function() {
            drawingCanvas.classList.toggle("no-drop-shadow");
        });

        addContextMenuItemClickListener(changeColor, function(event, mouseupShortcutClick) {
            if (event.target == changeColor || mouseupShortcutClick) {
                colorPicker.click();
            }
            event.stopPropagation();
        });

        colorPicker.addEventListener("change", function() {
            color = colorPicker.value;
            closeContextMenu();
        });

        drawingCanvas.addEventListener("touchmove", function(event) { });

        const style = document.createElement("style");
        style.innerHTML = `
        .tm-drawing-canvas-container {
          z-index: 99999;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          font-size: 14px;
          font-family: sans;
          line-height: 1.15;
          color: #000;
        }

        .tm-drawing-canvas-container.tm-drawing-canvas-fallthrough {
          pointer-events: none;
        }

        .tm-drawing-canvas {
          position: aboslute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          filter: drop-shadow(0px 0px 8px background);
        }

        .tm-drawing-canvas.no-drop-shadow {
          filter: none;
        }

        .tm-drawing-canvas-context-menu-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .tm-drawing-canvas-context-menu {
          position: absolute;
          display: inline-block;
          background-color: #fff;
          padding-top: 4px;
          padding-bottom: 4px;
          margin-top: 1px;
          border: 1px solid #00000040;
          box-shadow: #00000038 0px 1px 16px, #0000002e 0px 1px 8px;
        }

        .tm-drawing-canvas-context-menu div {
          padding: 4px;
          cursor: pointer;
        }

        .tm-drawing-canvas-context-menu div:hover {
          background-color: #ccc;
        }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);
    }

    addEventListener("keydown", function(event) {
        if (event.code == "KeyD" && event.altKey && event.shiftKey) {
            toggleDrawable();
        }
    });
})();