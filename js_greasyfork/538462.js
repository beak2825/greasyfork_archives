// ==UserScript==
// @name         The West - Custom World Order (Lightning Fast + UI Input)
// @namespace    https://www.the-west.ro/
// @author honeydew (Texas)
// @version      3.1
// @description  Arrange worlds in custom order within "Lumile tale" section + add editable input in corner
// @match        https://www.the-west.ro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538462/The%20West%20-%20Custom%20World%20Order%20%28Lightning%20Fast%20%2B%20UI%20Input%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538462/The%20West%20-%20Custom%20World%20Order%20%28Lightning%20Fast%20%2B%20UI%20Input%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🎯 Load from localStorage or default to empty
    let PREFERRED_ORDER = JSON.parse(localStorage.getItem("preferredWorldOrder") || "[]");

    const ALL_WORLDS_ID = "allWorlds";
    const LUMILE_TALE_TEXT = "Lumile tale";

    let isProcessing = false;

    function getWorldNumber(worldElement) {
        const match = worldElement.id?.match(/world_(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    function arrangeWorldsInOrder() {
        if (isProcessing) return false;
        isProcessing = true;

        try {
            const allWorlds = document.getElementById(ALL_WORLDS_ID);
            if (!allWorlds || allWorlds.offsetParent === null) return false;

            const lumileTaleRow = Array.from(allWorlds.querySelectorAll(".worlds-row"))
                .find(row => row.querySelector("h2")?.textContent?.includes(LUMILE_TALE_TEXT));

            if (!lumileTaleRow) return false;

            const content = lumileTaleRow.querySelector(".row-content");
            if (!content) return false;

            const worldElements = Array.from(content.querySelectorAll('[id^="world_"]'));
            if (worldElements.length === 0) return false;

            const orderedWorlds = [];
            const remainingWorlds = [];
            const worldMap = new Map();

            worldElements.forEach(element => {
                const worldNum = getWorldNumber(element);
                if (worldNum !== null) {
                    worldMap.set(worldNum, element);
                }
            });

            PREFERRED_ORDER.forEach(worldNum => {
                if (worldMap.has(worldNum)) {
                    orderedWorlds.push(worldMap.get(worldNum));
                    worldMap.delete(worldNum);
                }
            });

            worldElements.forEach(element => {
                const worldNum = getWorldNumber(element);
                if (worldNum !== null && worldMap.has(worldNum)) {
                    remainingWorlds.push(element);
                }
            });

            const newOrder = [...orderedWorlds, ...remainingWorlds];
            const currentOrder = Array.from(content.children).filter(child =>
                child.id && child.id.startsWith('world_')
            );

            let needsReordering = false;
            if (newOrder.length === currentOrder.length) {
                for (let i = 0; i < newOrder.length; i++) {
                    if (newOrder[i] !== currentOrder[i]) {
                        needsReordering = true;
                        break;
                    }
                }
            } else {
                needsReordering = true;
            }

            if (needsReordering) {
                const referenceElement = Array.from(content.children)
                    .find(child => !child.id || !child.id.startsWith('world_'));

                newOrder.forEach((worldElement, index) => {
                    if (index === 0) {
                        content.insertBefore(worldElement, referenceElement || content.firstChild);
                    } else {
                        const previousWorld = newOrder[index - 1];
                        content.insertBefore(worldElement, previousWorld.nextSibling);
                    }
                });

                const orderedNumbers = orderedWorlds.map(el => getWorldNumber(el)).filter(n => n !== null);
                const remainingNumbers = remainingWorlds.map(el => getWorldNumber(el)).filter(n => n !== null);

                console.log(`[⚡] Worlds reordered! Priority: [${orderedNumbers.join(', ')}], Others: [${remainingNumbers.join(', ')}]`);
                return true;
            }

            return false;
        } finally {
            isProcessing = false;
        }
    }

    function instantArrangeWorlds() {
        requestAnimationFrame(() => {
            arrangeWorldsInOrder();
        });
    }

    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.id === ALL_WORLDS_ID ||
                            node.querySelector?.(`#${ALL_WORLDS_ID}`) ||
                            node.id?.startsWith('world_') ||
                            node.querySelector?.('[id^="world_"]') ||
                            node.classList?.contains('worlds-row') ||
                            node.classList?.contains('row-content')) {
                            shouldCheck = true;
                            break;
                        }
                    }
                }
            } else if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.id === ALL_WORLDS_ID ||
                    target.querySelector?.(`#${ALL_WORLDS_ID}`) ||
                    (mutation.attributeName === 'style' && target.style?.display !== 'none')) {
                    shouldCheck = true;
                }
            }

            if (shouldCheck) break;
        }

        if (shouldCheck) {
            instantArrangeWorlds();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    const events = ['click', 'keydown', 'focus', 'mousedown'];
    events.forEach(eventType => {
        document.addEventListener(eventType, (e) => {
            const target = e.target;
            if (target.closest?.('.menulink') ||
                target.closest?.('[data-menu]') ||
                target.closest?.('.ui-dialog') ||
                target.id?.includes('world') ||
                target.className?.includes('world')) {
                setTimeout(instantArrangeWorlds, 50);
                setTimeout(instantArrangeWorlds, 150);
            }
        }, true);
    });

    let checkCount = 0;
    const periodicCheck = () => {
        checkCount++;
        const allWorlds = document.getElementById(ALL_WORLDS_ID);
        if (allWorlds && allWorlds.offsetParent !== null) {
            const content = allWorlds.querySelector('.worlds-row h2')?.textContent?.includes(LUMILE_TALE_TEXT)
                ? allWorlds.querySelector('.worlds-row .row-content')
                : null;

            if (content) {
                const firstWorldElement = content.querySelector('[id^="world_"]');
                if (firstWorldElement) {
                    const firstWorldNum = getWorldNumber(firstWorldElement);
                    if (PREFERRED_ORDER.length > 0 &&
                        (!PREFERRED_ORDER.includes(firstWorldNum) || firstWorldNum !== PREFERRED_ORDER[0])) {
                        const hasPriorityWorlds = PREFERRED_ORDER.some(num =>
                            content.querySelector(`#world_${num}`)
                        );
                        if (hasPriorityWorlds) {
                            instantArrangeWorlds();
                        }
                    }
                }
            }
        }

        const delay = Math.min(100 + (checkCount * 10), 500);
        setTimeout(periodicCheck, delay);
    };

    function createCornerInputUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '10px';
        wrapper.style.right = '10px';
        wrapper.style.background = 'rgba(0,0,0,0.75)';
        wrapper.style.padding = '8px';
        wrapper.style.borderRadius = '6px';
        wrapper.style.zIndex = '9999';
        wrapper.style.fontSize = '12px';
        wrapper.style.color = 'white';
        wrapper.style.fontFamily = 'monospace';

        const label = document.createElement('label');
        label.textContent = 'World order:';
        label.style.marginRight = '4px';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = PREFERRED_ORDER.join(', ');
        input.style.width = '160px';
        input.style.marginRight = '4px';
        input.style.borderRadius = '4px';
        input.style.border = 'none';
        input.style.padding = '2px 4px';

        const button = document.createElement('button');
        button.textContent = 'Save';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.padding = '2px 6px';
        button.style.borderRadius = '4px';
        button.style.background = '#4CAF50';
        button.style.color = 'white';

        button.onclick = () => {
            const newValue = input.value.trim();
            updatePreferredOrder(newValue);
            localStorage.setItem("preferredWorldOrder", JSON.stringify(PREFERRED_ORDER));
            instantArrangeWorlds();
        };

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        document.body.appendChild(wrapper);
    }

    function updatePreferredOrder(input) {
        const list = input.split(',')
            .map(str => parseInt(str.trim(), 10))
            .filter(num => !isNaN(num));

        if (list.length > 0) {
            PREFERRED_ORDER = list;
            console.log(`[⚙️] Updated preferred world order: [${PREFERRED_ORDER.join(', ')}]`);
        } else {
            console.warn('[⚠️] Invalid input. Could not update world order.');
        }
    }

    function initialize() {
        console.log(`[⚡] Custom World Order script loaded! Priority order: [${PREFERRED_ORDER.join(', ')}]`);
        setTimeout(instantArrangeWorlds, 100);
        setTimeout(periodicCheck, 200);
        createCornerInputUI();

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(instantArrangeWorlds, 300);
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    setTimeout(initialize, 50);
})();
