// ==UserScript==
// @name         Prevent Image Scaling
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Force full-size gallery viewer to display images at their native resolution, with scaling options.
// @author       Taka_Sakagami
// @match        https://bsky.app/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531498/Prevent%20Image%20Scaling.user.js
// @updateURL https://update.greasyfork.org/scripts/531498/Prevent%20Image%20Scaling.meta.js
// ==/UserScript==

GM_addStyle(`
    .image-zoom-active div[style*="background-image"] {
        background-size: auto !important;
        background-repeat: no-repeat !important;
        transform: scale(var(--zoom-scale, 1)) translate(var(--translate-x, 0px), var(--translate-y, 0px)) !important;
        cursor: grab;
        image-rendering: var(--image-scaling, auto) !important;
        height: 1000%;
        width: 1000%;
        left: -450%;
        top: -450%;
    }

    .image-zoom-active .css-9pa8cd {
        object-fit: none !important;
        transform: scale(var(--zoom-scale, 1)) translate(var(--translate-x, 0px), var(--translate-y, 0px)) !important;
        cursor: grab;
        image-rendering: var(--image-scaling, auto) !important;
    }

    .zoom-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        user-select: none;
    }

    .zoom-button {
        width: 32px;
        height: 32px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        user-select: none;
    }

    .zoom-button:hover {
        background-color: #0056b3;
    }

    .zoom-label {
        width: 50px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        user-select: none;
        display: inline-block;
    }
`);


(function() {
    let zoomLevel = 1;
    let zooming = 0;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;
    let isNearestNeighbor = false;

    function updateZoom(scale) {
        if (zooming !== 0) {
            zoomLevel = scale;
            document.documentElement.style.setProperty("--zoom-scale", zoomLevel);
            document.getElementById("zoom-label").textContent = `${Math.round(zoomLevel * 100)}%`;
        }
    }
    function updatePosition(x, y) {
        if (zooming !== 0) {
            translateX = x;
            translateY = y;
            document.documentElement.style.setProperty("--translate-x", `${translateX}px`);
            document.documentElement.style.setProperty("--translate-y", `${translateY}px`);
        }
    }

    function startDrag(event) {
        if (event.button !== 0) {
            isDragging = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
        }
        else {
            if (zooming === 0) {
                translateX = 0;
                translateY = 0;
                startX = 0;
                startY = 0;
                document.documentElement.style.setProperty("--translate-x", `${translateX}px`);
                document.documentElement.style.setProperty("--translate-y", `${translateY}px`);
                zoomLevel = 1;
                document.documentElement.style.setProperty("--zoom-scale", zoomLevel);
                document.getElementById("zoom-label").textContent = `${Math.round(zoomLevel * 100)}%`;
            }
            zooming = 0;
        }
    }

    function dragImage(event) {
        if (isDragging) {
            updatePosition(event.clientX - startX, event.clientY - startY);
        }
    }

    function stopDrag() {
        isDragging = false;
    }

    document.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", dragImage);
    document.addEventListener("mouseup", stopDrag);

    function toggleScaling() {
        zooming = 1;
        isNearestNeighbor = !isNearestNeighbor;
        document.documentElement.style.setProperty("--image-scaling", isNearestNeighbor ? "pixelated" : "auto");
        document.getElementById("scaling-toggle").textContent = isNearestNeighbor ? "O" : "ロ";
    }

    const container = document.createElement("div");
    container.className = "zoom-controls";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.className = "zoom-button";
    zoomOutButton.textContent = "-";
    zoomOutButton.addEventListener("click", function() {
        zooming = 1; updateZoom(zoomLevel - 0.25);
    });

    const zoomLabel = document.createElement("span");
    zoomLabel.className = "zoom-label";
    zoomLabel.id = "zoom-label";
    zoomLabel.textContent = `100%`;

    const zoomInButton = document.createElement("button");
    zoomInButton.className = "zoom-button";
    zoomInButton.textContent = "+";
    zoomInButton.addEventListener("click", function() {
        zooming = 1; updateZoom(zoomLevel + 0.25);
    });

    const scalingToggle = document.createElement("button");
    scalingToggle.className = "zoom-button";
    scalingToggle.id = "scaling-toggle";
    scalingToggle.textContent = "ロ";
    scalingToggle.addEventListener("click", toggleScaling);

    container.appendChild(zoomOutButton);
    container.appendChild(zoomLabel);
    container.appendChild(zoomInButton);
    container.appendChild(scalingToggle);
    document.body.appendChild(container);

    const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-scroll-locked"
        ) {
            const scrollLocked = document.body.getAttribute("data-scroll-locked") === "1";

            if (!scrollLocked) {
                document.documentElement.classList.remove("image-zoom-active");
                container.style.display = "none";
                zooming = 0;
            } else {
                document.documentElement.classList.add("image-zoom-active");
                container.style.display = "flex";
                zooming = 1;
            }
        }
    }
});

    observer.observe(document.body, { attributes: true });
    const initialState = document.body.getAttribute("data-scroll-locked") === "1";
    container.style.display = initialState ? "flex" : "none";
    zooming = initialState ? 1 : 0;

})();