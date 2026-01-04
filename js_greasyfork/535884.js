// ==UserScript==
// @name         GTM Workspace Checklist
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Displays a fixed checklist on GTM workspace pages
// @author       You
// @match        https://tagmanager.google.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535884/GTM%20Workspace%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/535884/GTM%20Workspace%20Checklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // CONFIGURATION
    // ======================
    const CONFIG = {
        elementId: 'gtm-workspace-checklist',
        width: '200px',
        bgColor: 'rgba(160, 160, 160, 0.6)',
        textColor: 'white',
        position: {
            bottom: '80px',
            left: '20px'
        },
        checklistStyle: {
            padding: '10px',
            borderRadius: '5px',
            zIndex: '9999',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            lineHeight: '1.5',
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif'
        }
    };

    // ======================
    // CONTENT
    // ======================
    const CHECKLIST_ITEMS = [
        "Google Consent Mode aktiviert?",
        "Sind Notizen in den Variablen und Tags?",
        "DPD: Englische Bezeichnungen und Notizen?",
        "Blockingtrigger?"
    ];

    // ======================
    // FUNCTIONS
    // ======================
    function isWorkspaceUrl() {
        return window.location.href.includes('/workspaces/');
    }

    function createChecklistElement() {
        const checklistDiv = document.createElement('div');
        checklistDiv.id = CONFIG.elementId;

        // Apply styles
        Object.assign(checklistDiv.style, {
            position: 'fixed',
            bottom: CONFIG.position.bottom,
            left: CONFIG.position.left,
            width: CONFIG.width,
            backgroundColor: CONFIG.bgColor,
            color: CONFIG.textColor,
            ...CONFIG.checklistStyle
        });

        // Create checklist content with better spacing
        checklistDiv.innerHTML = CHECKLIST_ITEMS
            .map(item => `<div style="margin-bottom: 8px;">• ${item}</div>`)
            .join('');

        return checklistDiv;
    }

    function manageChecklist() {
        const elementExists = !!document.getElementById(CONFIG.elementId);

        if (isWorkspaceUrl()) {
            if (!elementExists) {
                document.body.appendChild(createChecklistElement());
            }
        } else if (elementExists) {
            document.getElementById(CONFIG.elementId).remove();
        }
    }

    // ======================
    // INITIALIZATION
    // ======================
    function init() {
        // Initial setup
        manageChecklist();

        // Optimized observer for SPA navigation
        const observer = new MutationObserver(() => {
            manageChecklist();
        });

        observer.observe(document, {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: false
        });

        // Periodic check as fallback (every 3 seconds)
        setInterval(manageChecklist, 3000);
    }

    // Start with slight delay to ensure DOM is ready
    window.addEventListener('load', () => {
        setTimeout(init, 500);
    });
})();