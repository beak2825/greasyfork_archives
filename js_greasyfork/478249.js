// ==UserScript==
// @name        Treat counter
// @description Adds treat counter to torn
// @namespace   m0tch.torn.treats
// @match       https://www.torn.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @version     0.4
// @author      m0tch, Grizh, Silmaril
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/478249/Treat%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/478249/Treat%20counter.meta.js
// ==/UserScript==


const viewPortWidthPx = window.innerWidth;
const isMobileView = viewPortWidthPx <= 784;

var now = new Date();
var start = new Date((new Date()).getFullYear().toString() + "-10-25T12:00:00Z");
var end = new Date((new Date()).getFullYear().toString() + "-11-01T12:00:00Z");

if (now > start && now < end){
    console.log("Treat counter initialized");
    localStorage.treatCount = localStorage.treatCount ?? 0;

    function getTreatsIcon() {
        return `<defs>
            <linearGradient id="TreatsGradient1" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop stop-color="#FDA766" stop-opacity="1" offset="0%"></stop>
                <stop stop-color="#FD7F2C" stop-opacity="1" offset="98.8889%"></stop>
            </linearGradient>
            <linearGradient id="TreatsGradient2" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop stop-color="#FD7F2C" stop-opacity="1" offset="0%"></stop>
                <stop stop-color="#FF6200" stop-opacity="1" offset="97.7778%"></stop>
            </linearGradient>
            <filter id="TreatsFilter1" x="-100%" y="-100%" width="300%" height="300%">
                <feOffset result="out" in="SourceGraphic" dx="0" dy="1"></feOffset>
                <feColorMatrix result="out" in="out" type="matrix" values="0 0 0 0.0118 0  0 0 0 0.2863 0  0 0 0 0.5647 0  0 0 0 0.651 0"></feColorMatrix>
                <feGaussianBlur result="out" in="out" stdDeviation="1"></feGaussianBlur>
                <feBlend in="SourceGraphic" in2="out" mode="normal" result="Drop_Shadow1"></feBlend>
            </filter>
            <linearGradient id="TreatsGradient3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop stop-color="#ffffff" stop-opacity="0" offset="0%"></stop>
                <stop stop-color="#ffffff" stop-opacity="0.298" offset="100%"></stop>
            </linearGradient>
        </defs>
        <g>
            <!-- Base circle -->
            <path d="M 0.189 9.5 C 0.189 4.3579 4.3577 0.189 9.5 0.189 C 14.6423 0.189 18.811 4.3579 18.811 9.5 C 18.811 14.6421 14.6423 18.811 9.5 18.811 C 4.3577 18.811 0.189 14.6421 0.189 9.5 Z" fill="url(#TreatsGradient1)"></path>
            <path d="M 2.075 9.5 C 2.075 5.3994 5.3992 2.075 9.5 2.075 C 13.6008 2.075 16.925 5.3994 16.925 9.5 C 16.925 13.6006 13.6008 16.925 9.5 16.925 C 5.3992 16.925 2.075 13.6006 2.075 9.5 Z" fill="url(#TreatsGradient2)"></path>

            <!-- Extra large jack-o'-lantern features -->
            <path d="M 4 4 L 8 4 L 6 8 L 4 4 Z" fill="#000000"/>
            <path d="M 11 4 L 15 4 L 13 8 L 11 4 Z" fill="#000000"/>
            <path d="M 6 9 Q 9.5 13 13 9" stroke="#000000" stroke-width="2.5" fill="none"/>

            <!-- White T overlay -->
            <g filter="url(#TreatsFilter1)">
                <path d="m 14 4 c -4 0 -4 0 -9 0 c 0 0 0 0 0 1 c 0 0 3 0 4 0 l 0 10 l 1 0 l 0 -10 l 4 0 z" fill="#ffffff"></path>
            </g>

            <!-- Top highlight -->
            <path d="M 2.9451 5.5898 C 2.8486 8.2603 5.9707 10 9.5 10 C 13.0293 10 16.1514 8.2603 18.0549 5.5898 C 16.5706 2.3484 13.2986 0.095 9.5 0.095 C 5.7014 0.095 2.4294 2.3484 0.9451 5.5898 Z" fill="url(#TreatsGradient3)"></path>
        </g>`;
    }

    function createTooltip(rect, count) {
        // Find the tt-overlay div
        const ttOverlay = document.querySelector('.tt-overlay');
        if (!ttOverlay) return;

        // Remove any existing tooltip
        const existingTooltip = document.querySelector('[data-floating-ui-portal]');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create the tooltip structure
        const tooltipContainer = document.createElement('div');
        tooltipContainer.setAttribute('data-floating-ui-portal', '');
        tooltipContainer.setAttribute('data-treat-tooltip-id', 'true');
        tooltipContainer.id = ':rt' + Math.random().toString(36).substr(2, 1) + ':';

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip___aWICR tooltipCustomClass___gbI4V';
        tooltip.setAttribute('tabindex', '-1');
        tooltip.setAttribute('role', 'tooltip');
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.transitionProperty = 'opacity';
        tooltip.style.transitionDuration = '200ms';

        const content = document.createElement('p');
        content.textContent = `You have ${count} treats`;

        const arrow = document.createElement('div');
        arrow.className = 'arrow___yUDKb bottom___mz2Ax';
        arrow.style.left = '40px';

        const arrowIcon = document.createElement('div');
        arrowIcon.className = 'arrowIcon___KHyjw';

        arrow.appendChild(arrowIcon);
        tooltip.appendChild(content);
        tooltip.appendChild(arrow);
        tooltipContainer.appendChild(tooltip);

        // Insert after tt-overlay
        ttOverlay.parentNode.insertBefore(tooltipContainer, ttOverlay.nextSibling);
    }

    function createTreatsElement() {
        const container = document.createElement('p');
        container.id = "treatCounter";
        container.className = "point-block___rQyUK";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.cursor = "pointer";

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 19 19");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.innerHTML = getTreatsIcon();

        const countSpan = document.createElement('span');
        countSpan.id = "treatCountDisplay";
        countSpan.textContent = localStorage.treatCount;

        const txtLabel = document.createElement('span');
        txtLabel.className = "name___ChDL3";
        txtLabel.textContent = "Treats: ";

        if(window.innerWidth > 984) {
            container.style.margin = "0px";
            container.style.gap = "0px";
            container.appendChild(txtLabel);
        } else {
            container.style.gap = "4px";
            container.appendChild(svg);
        }
        container.appendChild(countSpan);

        // Handle hover events
        container.addEventListener('mouseenter', function(e) {
            const rect = container.getBoundingClientRect();
            createTooltip(rect, localStorage.treatCount);
        });

        container.addEventListener('mouseleave', function(e) {
            // Only remove if we're not moving to the tooltip itself
            const tooltip = document.querySelector('[data-floating-ui-portal]');
            const rect = tooltip?.getBoundingClientRect();
            if (rect && e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                return;
            }
            if (tooltip) tooltip.remove();
        });

        // Handle touch events for mobile
        container.addEventListener('touchstart', function(e) {
            const rect = container.getBoundingClientRect();
            createTooltip(rect, localStorage.treatCount);
        });

        return container;
    }

    function addTreatsDisplay(node) {
        if (!node) return;

        // Check if counter already exists
        if (document.getElementById("treatCounter")) {
            return;
        }

        // Create and append the treats counter
        const treatsElement = createTreatsElement();
        node.appendChild(treatsElement);
    }

    function updateTreatsDisplay() {
        var node = document.getElementById("sidebarroot")?.querySelectorAll("div[class^='points']")[0];
        if (!node) return;

        var treatCounter = document.getElementById("treatCounter");
        if (!treatCounter) {
            addTreatsDisplay(node);
            return;
        }

        // Update only the count span
        const countDisplay = document.getElementById('treatCountDisplay');
        if (countDisplay) {
            countDisplay.textContent = localStorage.treatCount;
        }
    }

    function updateTreatCount() {
        var availableTreatsNodes = document.querySelectorAll(".available-treats");
        if(availableTreatsNodes.length == 0) {
            return;
        }
        var treatText = document.querySelectorAll(".available-treats")[0].querySelector(".halloween-text").innerText;
        var treats = treatText.substr(0, treatText.indexOf(" "));
        localStorage.treatCount = treats;
        console.log("Available treats read, updating count to: " + treats);
        updateTreatsDisplay();
    }

    function getAttackReward() {
        var treatNode = document.querySelector(".dialog-title__halloween");
        if (!treatNode) {
            return;
        }
        var treatText = document.querySelector(".dialog-title__halloween").innerText;
        var treatGain = treatText.substr(1, treatText.indexOf(" ") -1);
        localStorage.treatCount = Number(localStorage.treatCount) + Number(treatGain);
    }

    // Add CSS styles
    GM_addStyle(`
        #treatCounter {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-left: 8px;
            margin-right: 8px;
        }
        #treatCounter svg {
            width: 16px !important;
            height: 16px !important;
        }
        #treatCounter span {
            margin: 0 !important;
        }
     /* Force tooltip visibility in mobile/app views */
        [data-treat-tooltip-id] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `);

    // Initial setup
    const setupTreatCounter = () => {
        const pointsDiv = document.getElementById("sidebarroot")?.querySelectorAll("div[class^='points']")[0];
        if (pointsDiv) {
            addTreatsDisplay(pointsDiv);
        }
    };

    // Try immediate setup
    setupTreatCounter();

    // Retry after a delay in case the sidebar loads late
    setTimeout(setupTreatCounter, 5000);

    // Regular updates
    setInterval(() => updateTreatsDisplay(), 3000);

    // Item page observer
    if (document.location.pathname.indexOf("item.php") > -1) {
        new MutationObserver(mutations => {
            updateTreatCount();
        }).observe(document.getElementById("category-wrap"), {childList: true, subtree: true});
    }

    // Attack page observer
    if (document.location.href.indexOf("loader.php?sid=attack&") > -1) {
        setTimeout(() => {
            new MutationObserver(mutations => {
                getAttackReward();
            }).observe(isMobileView ?
                       document.querySelectorAll("[class^=playersModelWrap___] [class^=playerArea___]")[0] :
                       document.querySelectorAll("[class^=playersModelWrap___] [class^=players___] [class^=player___]")[1], {childList: true, subtree: true});
        }, 2000);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}