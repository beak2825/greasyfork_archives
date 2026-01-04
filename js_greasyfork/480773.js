// ==UserScript==
// @name         WhatsApp Hide Chat List
// @namespace    http://tampermonkey.net/
// @version      0.8
// @license      MIT
// @description  Hide WhatsApp Web chat list
// @author       Guilherme Franco (9uifranco)
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/480773/WhatsApp%20Hide%20Chat%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/480773/WhatsApp%20Hide%20Chat%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let overlayButton, customToolbar;
    let hasInitialized = false;
    let hideThreshold = 400;
    let chatWidth = 400;
    let chatOpenThreshold = 400;
    let chatClosedThreshold = 80;

    // store last mouse coords so non-event callers can still decide
    let lastMouse = { x: null, y: null };

    /* TOOLBAR */
    function createToolbar() {
        const toolbar = document.createElement("div");
        toolbar.innerHTML = `
    <nav id="customToolbar">
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <button title="Blur Screen" id="overlayButton" class="eye">
                <i class="fas fa-eye-slash fa-xs"></i>
            </button>
            <label style="color:white; font-size:0.75rem;">Chat Width
                <input type="number" id="inputChatWidth" style="width:4rem;" value="${chatWidth}">
            </label>
            <label style="color:white; font-size:0.75rem;">Open Threshold
                <input type="number" id="inputOpenThreshold" style="width:4rem;" value="${chatOpenThreshold}">
            </label>
            <label style="color:white; font-size:0.75rem;">Closed Threshold
                <input type="number" id="inputClosedThreshold" style="width:4rem;" value="${chatClosedThreshold}">
            </label>
        </div>
        <a title="GitHub Repo" id="githubLink"
           href="https://github.com/9uifranco/whatsapp-hide-chat-list#whatsapp-hide-chat-list"
           target="_blank" style="margin-top:auto;">
           <i class="fa-brands fa-github fa-xs"></i>
        </a>
    </nav>`;
        document.body.prepend(toolbar);

        overlayButton = document.getElementById("overlayButton");
        customToolbar = document.getElementById("customToolbar");

        if (overlayButton) overlayButton.addEventListener("click", toggleOverlay);

        // Listen for input changes
        const inputChatWidth = document.getElementById("inputChatWidth");
        const inputOpen = document.getElementById("inputOpenThreshold");
        const inputClosed = document.getElementById("inputClosedThreshold");

        inputChatWidth.addEventListener("input", (e) => {
            chatWidth = parseInt(e.target.value) || 400;
        });
        inputOpen.addEventListener("input", (e) => {
            chatOpenThreshold = parseInt(e.target.value) || 400;
        });
        inputClosed.addEventListener("input", (e) => {
            chatClosedThreshold = parseInt(e.target.value) || 80;
        });
    }

    /* OVERLAY */
    function toggleOverlay() {
        const overlay = document.getElementById("overlay") || createOverlay();
        overlay.classList.toggle("visible");
        overlayButton.innerHTML = overlay.classList.contains("visible")
            ? '<i class="fas fa-eye fa-xs"></i>'
            : '<i class="fas fa-eye-slash fa-xs"></i>';
    }

    function createOverlay() {
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        document.body.appendChild(overlay);
        return overlay;
    }

    /* HELPERS */
    // isMouseOver now falls back to lastMouse if evt is missing
    function isMouseOver(el, evt) {
        if (!el) return false;

        // use provided event coords if available, otherwise fallback to lastMouse
        const x = evt && typeof evt.clientX === "number" ? evt.clientX : lastMouse.x;
        const y = evt && typeof evt.clientY === "number" ? evt.clientY : lastMouse.y;

        if (typeof x !== "number" || typeof y !== "number") return false;

        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    function getChatListElement() {
        return document.querySelector("#app > div > div > div:nth-of-type(3) > div > div:nth-of-type(4)");
    }

    /* CHAT LIST VISIBILITY */
    function updateChatListVisibility(evt) {
        // store mouse coords
        if (evt && typeof evt.clientX === "number") {
            lastMouse.x = evt.clientX;
            lastMouse.y = evt.clientY;
        }

        const chatList = getChatListElement();
        if (!chatList) return;

        // initialize styles once
        if (!hasInitialized) {
            chatList.style.display = "flex";
            chatList.style.maxWidth = `${chatWidth}px`;
            chatList.style.width = "100%";
            chatList.style.transition = "max-width 0.35s ease-out, opacity 0.35s ease-out";
            chatList.style.overflow = "hidden";

            // header inside chat list
            const header = chatList.querySelector("header");
            if (header) {
                header.style.transition = "opacity 0.35s ease-out";
            }

            hasInitialized = true;
        }

        // choose threshold dynamically
        const mouseX = (evt && typeof evt.clientX === "number") ? evt.clientX : (typeof lastMouse.x === "number" ? lastMouse.x : Infinity);

        if (mouseX <= hideThreshold) {
            chatList.style.maxWidth = `${chatWidth}px`;
            chatList.style.width = "100%";
            hideThreshold = chatOpenThreshold;
            const header = chatList.querySelector("header");
            if (header) header.style.opacity = "1";
        } else {
            chatList.style.maxWidth = "0";
            hideThreshold = chatClosedThreshold;
            const header = chatList.querySelector("header");
            if (header) header.style.opacity = "0";
        }
    }

    /* GALLERY VISIBILITY */
    function updateGalleryVisibility(evt) {
        // store mouse coords
        if (evt && typeof evt.clientY === "number") {
            lastMouse.x = evt.clientX;
            lastMouse.y = evt.clientY;
        }

        // select gallery by role
        const gallery = document.querySelector("[role='list'][aria-label='Lista de mídias']");
        if (!gallery) return;

        gallery.style.transition = "height .25s ease, opacity .25s ease";
        gallery.style.overflow = "hidden"; // ensure it hides smoothly

        const bottomThreshold = window.innerHeight - hideThreshold;
        const mouseY = (evt && typeof evt.clientY === "number")
            ? evt.clientY
            : (typeof lastMouse.y === "number" ? lastMouse.y : -Infinity);
        const isOver = isMouseOver(gallery, evt);

        if (isOver || mouseY >= bottomThreshold) {
            gallery.style.height = "6.25rem"; // show
            gallery.style.opacity = "1";
        } else {
            gallery.style.height = "0"; // hide
            gallery.style.opacity = "0";
        }
    }

    /* TOOLBAR POSITION */
    function adjustToolbarPosition(evt) {
        // update lastMouse
        if (evt && typeof evt.clientX === "number") {
            lastMouse.x = evt.clientX;
            lastMouse.y = evt.clientY;
        }

        const mouseX = (evt && typeof evt.clientX === "number") ? evt.clientX : (typeof lastMouse.x === "number" ? lastMouse.x : Infinity);
        if (mouseX > window.innerWidth - 20 || isMouseOver(customToolbar, evt)) {
            if (customToolbar) customToolbar.style.right = "0";
        } else {
            if (customToolbar) customToolbar.style.right = "-200px";
        }
    }

    /* MUTATION OBSERVER (lightweight) */
    const observer = new MutationObserver(() => {
        // if chatList appears after load, initialize
        const chatList = getChatListElement();
        if (chatList && !hasInitialized) {
            updateChatListVisibility(); // no event — uses lastMouse fallback
        }
        // always try gallery update (uses lastMouse fallback)
        updateGalleryVisibility();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /* EVENTS - single mousemove listener updates lastMouse + UI */
    document.addEventListener("mousemove", evt => {
        // store mouse coords right away
        lastMouse.x = evt.clientX;
        lastMouse.y = evt.clientY;

        adjustToolbarPosition(evt);
        updateChatListVisibility(evt);
        updateGalleryVisibility(evt);
    });

    // when mouse leaves window, force update using last known coords
    document.addEventListener("mouseleave", () => {
        updateChatListVisibility();
        updateGalleryVisibility();
    });

    /* INIT */
    function init() {
        createToolbar();
        // try initial run (will use lastMouse if not set)
        updateChatListVisibility();
        updateGalleryVisibility();
    }

    // inject small styling for toolbar & overlay
    const baseStyles = `
        #customToolbar {
            background-color: #333;
            color: white;
            padding: 10px;
            position: fixed;
            height: 100%;
            width: 3rem;
            right: -200px;
            top: 0;
            z-index: 9999999;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: .5rem;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
        }
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: none;
            z-index: 9999998;
            backdrop-filter: blur(10px);
        }
        #overlay.visible { display: block; }
        #overlayButton.eye { font-size: 1.5rem; background: none; border: none; cursor: pointer; color: white; }
        #githubLink { font-size: 1.5rem; background: none; border: none; cursor: pointer; color: white; text-decoration: none; }
    `;
    const styleElement = document.createElement("style");
    styleElement.textContent = baseStyles;
    document.head.appendChild(styleElement);

    init();

})();
