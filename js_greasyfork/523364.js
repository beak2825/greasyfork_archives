// ==UserScript==
// @name         ChatGPT Rate Limit - Frontend
// @namespace    http://terase.cn
// @license      MIT
// @version      4.1
// @description  A tool to know your ChatGPT Rate Limit.
// @author       Terrasse
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @sandbox      RAW
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523364/ChatGPT%20Rate%20Limit%20-%20Frontend.user.js
// @updateURL https://update.greasyfork.org/scripts/523364/ChatGPT%20Rate%20Limit%20-%20Frontend.meta.js
// ==/UserScript==


(function() {
    'use strict';

window.model_status = {
    "o3": -1,
    // "o4-mini-high": -1,
    "o4-mini": -1,
    // "GPT-4.5": -1,
    "GPT-5": -1,
    "GPT-5-Thinking": -1,
}
window.devarious = {
    // names in API
    "gpt-5": "GPT-5",
    "gpt-5.1": "GPT-5",
    "gpt-5.2": "GPT-5",
    "gpt-5-instant": "GPT-5",
    "gpt-5-1-instant": "GPT-5",
    "gpt-5-2-instant": "GPT-5",
    "gpt-5-thinking": "GPT-5-Thinking",
    "gpt-5-1-thinking": "GPT-5-Thinking",
    "gpt-5-2-thinking": "GPT-5-Thinking",

    // names in switch bar
    "5": "GPT-5",
    "5.1": "GPT-5",
    "5.2": "GPT-5",
    "5 Instant": "GPT-5",
    "5.1 Instant": "GPT-5",
    "5.2 Instant": "GPT-5",
    "5 Thinking": "GPT-5-Thinking",
    "5.1 Thinking": "GPT-5-Thinking",
    "5.2 Thinking": "GPT-5-Thinking",

    // names in switch panel
    "Auto": "GPT-5",
    "Instant": "Instant", // a standalone mode
    "Thinking": "GPT-5-Thinking",
}
// names after devarious: [GPT-5, GPT-5-Thinking]

function createTooltipHTML() {
    // Management section
    const managementItems = `
        <dt class="text-token-text-tertiary col-span-2">Management</dt>
        <dt>Remove API key</dt>
        <dd class="text-token-text-secondary justify-self-end">Click Me 5x</dd>
    `;
    
    // Model switching section
    const shortcuts = [];
    for (const [key, model] of Object.entries(mapping)) {
        let description;
        if (Array.isArray(model)) {
            description = `Switch in ${model.join('/')}`;
        } else {
            description = `Switch to ${model}`;
        }
        shortcuts.push({ key: `Ctrl+Alt+${key}`, description });
    }
    
    let shortcutItems = '<dt class="text-token-text-tertiary col-span-2">Model Switching</dt>';
    shortcuts.forEach(shortcut => {
        const keyParts = shortcut.key.split('+');
        const kbdElements = keyParts.map(part => 
            `<kbd><span class="min-w-[1em]">${part}</span></kbd>`
        ).join('');
        
        shortcutItems += `
            <dt>${shortcut.description}</dt>
            <dd class="text-token-text-secondary justify-self-end">
                <div class="inline-flex whitespace-pre *:inline-flex *:font-sans *:not-last:after:px-0.5 *:not-last:after:content-['+']">
                    ${kbdElements}
                </div>
            </dd>
        `;
    });
    
    // Combine all sections
    const header = `
        <div class="ms-2.5 flex h-9 items-center font-semibold">
            <h2 class="text-sm">ChatGPT Rate Limit</h2>
        </div>
    `;
    
    const contentList = `
        <dl class="grid [grid-template-columns:minmax(0,1fr)_max-content] gap-x-6 gap-y-3 px-2.5 pb-2">
            ${managementItems}
            ${shortcutItems}
        </dl>
    `;
    
    const tooltipClasses = "z-50 max-w-xs rounded-2xl popover bg-token-main-surface-primary dark:bg-[#353535] shadow-long py-1.5 px-1.5 select-none text-sm";
    
    return `
        <div id="crl_tooltip" class="${tooltipClasses}" style="position: fixed;">
            ${header}
            ${contentList}
        </div>
    `.replace(/\s+/g, ' ').trim();
}

function getCurrentModel() {
    var bar = document.getElementById("crl_bar");
    var model = bar.previousElementSibling.innerText;
    if (model in window.devarious) {
        model = window.devarious[model];
    }
    return model;
}

function updateStatusText() {
    var status = window.model_status;
    // var text = "";
    // for (const model in status) {
    //     text += `${model}: ${status[model]}; `;
    // }
    // text = text.slice(0, -2);

    var model = getCurrentModel();
    var remain = "∞";
    if (model in status) {
        remain = `${status[model]}`;
    }
    var text = ` [${remain}]`;
    
    var bar = document.getElementById("crl_bar");
    if (bar) {
        bar.innerText = text;
    }
}

(function(fetch) {
    window.fetch = function(input, init) {
        var method = 'GET';
        var url = '';
        var payload = null;

        if (typeof input === 'string') {
            url = input;
        } else if (input instanceof Request) {
            url = input.url;
            method = input.method || method;
            payload = input.body || null;
        } else {
            console.log(`Unexpected input of type ${typeof input}: ${input}`);
        }

        if (init) {
            method = init.method || method;
            payload = init.body || payload;
        }

        // console.log(`Request: ${method} ${url}`);

        if (method.toUpperCase() === 'POST') {
            if (url.endsWith("/backend-api/f/conversation")) {
                // console.log("Conversation Request");
                payload = JSON.parse(payload);
                var model = payload.model;
                if (model in window.devarious) {
                    model = window.devarious[model];
                }

                window.postMessage({ model: model, type: "put" }, window.location.origin);
            }
        }

        return fetch.apply(this, arguments);
    };
})(window.fetch);

function receiveMessage(event) { // Accept: type="status"
    if (event.origin !== window.location.origin) return;
    if (event.data.type !== "status") return;

    var msg = event.data;
    // console.log('MAIN_WORLD 收到消息:', msg);
    var status = window.model_status;
    if (msg.model in status) {
        status[msg.model] = msg.remain;
        updateStatusText();
    } else {
        console.log(`Unknown model from backend: ${msg.model}, msg: ${msg}, event: ${event}`, event);
    }
}

window.addEventListener('message', receiveMessage, false);

function updateAll() {
    // console.log("Update All");
    for (const model in window.model_status) {
        window.postMessage({ model: model, type: "get" }, window.location.origin);
    }
}

// Display & Refresh Button
function htmlToNode(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}
function getModelBarFlexible() {
    // there are 2 model bar (responsive), we need the visible one
    const model_bars = document.querySelectorAll("button[data-testid='model-switcher-dropdown-button']");
    for (const model_bar of model_bars) {
        // if (window.getComputedStyle(model_bar).display !== 'none') { // not working
        if (model_bar.offsetParent) { // equivalent to visible
            return model_bar;
        }
    }
    console.log("No visible model bar found", model_bars);
    return null;
}
function addFrontendItems() { // return true if freshly added
    var crl_bar = document.getElementById("crl_bar");
    if (crl_bar) {
        if (crl_bar.offsetParent === null) { // not visible
            crl_bar.remove();
            return false; // add back next time
        }
        updateStatusText();
        return false;
    }
    // var avatar = document.querySelector('button[data-testid="profile-button"]');
    // if (!avatar) return false;
    // var avatarContainer = avatar.parentElement;

    var model_bar = getModelBarFlexible();
    if (!model_bar) return false;
    model_bar = model_bar.querySelector('div');

    var displayBar = htmlToNode('<span id="crl_bar" class="text-token-text-tertiary"> [...]</span>')
    // var refreshButton = htmlToNode('<button onclick="updateAll();"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/></svg></button>')
    
    // Add hover tooltip
    addHoverTooltip(displayBar);
    
    model_bar.append(displayBar);
    return true;
}
function showTooltip(targetElement) {
    // Hide existing tooltip first
    hideTooltip();
    
    const tooltipHTML = createTooltipHTML();
    const tooltip = htmlToNode(tooltipHTML);
    
    if (!tooltip) {
        console.error('Failed to create tooltip');
        return;
    }
    
    // Position tooltip
    const rect = targetElement.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
    
    document.body.appendChild(tooltip);
    console.log('Tooltip shown');
}

function hideTooltip() {
    const tooltip = document.getElementById('crl_tooltip');
    if (tooltip) {
        tooltip.remove();
        console.log('Tooltip hidden');
    }
}

// Global click handler for tooltip
function handleGlobalClick(event) {
    const tooltip = document.getElementById('crl_tooltip');
    if (tooltip && !tooltip.contains(event.target)) {
        hideTooltip();
    }
}

function addHoverTooltip(element) {
    let hoverTimer = null;

    element.addEventListener('mouseenter', function() {
        hoverTimer = setTimeout(() => {
            showTooltip(element);
        }, 1000);
    });
    
    element.addEventListener('mouseleave', function() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
        hideTooltip();
    });
}

function tryAddFrontendItems() {
    if (addFrontendItems()) {
        // console.log("Frontend items added");
        updateAll();
    }
}

setInterval(updateAll, 60000); // Refresh every 60s
setTimeout(() => {
    setInterval(tryAddFrontendItems, 200); // Make sure the bar is always there
}, 3000); // Wait for the page to load


// ====== Model Switcher ======

var mapping = {
    '1': 'GPT-4.1', // 1
    '3': 'o3', // 3
    '4': 'o4-mini', // 4
    '5': ['GPT-5', 'GPT-5-Thinking'], // 5, use name after devarious
    // '5': [
    //     ['GPT-5', 'Auto'],
    //     ['GPT-5 Thinking', 'Thinking'],
    // ],
    'f': 'Instant',
    'm': 'GPT-5 Thinking mini',
};

function simulateClick(element) {
    const ev = new PointerEvent('pointerdown', { bubbles: true });
    element.dispatchEvent(ev);
    const ev2 = new PointerEvent('pointerup', { bubbles: true });
    element.dispatchEvent(ev2);
}
function simulateArrowRight(element) {
    element.focus();

    const ev = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        which: 39,
        bubbles: true,
    });
    element.dispatchEvent(ev);
}

function getModelTargets() {
    // document.querySelectorAll("div[role=menuitem]")[0].querySelector("span").textContent
    const menuItems = document.querySelectorAll('div[role=menuitem]');
    const targets = {};
    for (const item of menuItems) {
        const span = item.querySelector('span');
        if (span) {
            let text = span.textContent;
            if (text in window.devarious) {
                text = window.devarious[text];
            }
            targets[text] = item;
        }
    }
    return targets;
}

function switchModel(target) {
    window.switch_state = 'DOING';

    // expand the model switcher
    const model_bar = getModelBarFlexible();
    simulateClick(model_bar);
    
    // try to switch
    const do_switch = setInterval(() => {
        if (window.switch_state !== 'DOING') {
            clearInterval(do_switch);
            return;
        }
        const targets = getModelTargets();
        // console.log(`do_switch: ${targets}`);
        if (target in targets) {
            // simulateClick(targets[target]);
            targets[target].click();
            console.log(`Switched to ${target}`);
            window.switch_state = 'DONE';
            clearInterval(do_switch);
        }
    }, 100);

    // try to expand the submenu
    const do_expand = setInterval(() => {
        if (window.switch_state !== 'DOING') {
            clearInterval(do_expand);
            return;
        }
        const submenu = document.querySelector('div[role=menuitem][data-has-submenu] div.grow');
        // console.log(`do_expand: ${submenu.textContent}`);
        if (submenu) {
            // simulateClick(submenu);
            // submenu.click();
            simulateArrowRight(submenu);
            clearInterval(do_expand);
        }
    }, 100);

    // after 1s, if not done, fail
    setTimeout(() => {
        if (window.switch_state !== 'DONE') {
            console.log(`Failed to switch to ${target}`);
            window.switch_state = 'DONE';
        }
    }, 1000);
}

function decideTarget(key) {
    const model = mapping[key];
    // if model is a list, toggle along with the list
    if (Array.isArray(model)) {
        // find the next
        const current_model = getCurrentModel();
        const index = model.indexOf(current_model);
        return model[(index + 1) % model.length];
    }
    return model;
}

// monitor Ctrl+Shift+number and Ctrl+/
window.addEventListener('keydown', function(e) {
    // console.log(e);
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key in mapping) {
        e.preventDefault();
        e.stopPropagation();

        const target = decideTarget(e.key);
        console.log(`Switching to ${target}`);
        switchModel(target);
    }
    
    // Show tooltip on Ctrl+/
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        
        const crlBar = document.getElementById('crl_bar');
        if (crlBar) {
            const existingTooltip = document.getElementById('crl_tooltip');
            if (existingTooltip) {
                hideTooltip();
            } else {
                showTooltip(crlBar);
            }
        }
    }
});

// Add global click listener for tooltip
document.addEventListener('click', handleGlobalClick, true);

// debugging tools
function debugModelBar() {
    // expand the model switcher
    const model_bar = getModelBarFlexible();
    // simulateClick(model_bar);
    const ev = new PointerEvent('pointerdown', { bubbles: true });
    model_bar.dispatchEvent(ev);
    // no pointerup event to keep it expanded
}
window.debugModelBar = debugModelBar;

})();
