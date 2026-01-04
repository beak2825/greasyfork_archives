// ==UserScript==
// @name         NovelAI Image Generator Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Enhancements for NovelAI image generator: A1111->NovelAI syntax button, Reference Strength slider patch, and more.
// @author       OpenAI
// @match        https://novelai.net/image*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535979/NovelAI%20Image%20Generator%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/535979/NovelAI%20Image%20Generator%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[NovelAI Enhancer] Script loaded');

    // --- A1111 to NovelAI Syntax Button ---
    function a1111ToNovelAI(text) {
        text = text.replace(/\(([^:()]+):([0-9.]+)\)/g, '$2::$1::');
        text = text.replace(/\\\(/g, '(').replace(/\\\)/g, ')');
        text = text.replace(/_/g, ' ');
        return text;
    }

    // --- Updated Syntax Button Insertion (robust, no compiled class) ---
    function insertSyntaxButton() {
        // Find the prompt input box (anchor)
        const promptBox = document.querySelector('.prompt-input-box-prompt');
        if (!promptBox) return;
        // Get its previous sibling (the container with the buttons)
        const container = promptBox.previousElementSibling;
        if (!container) return;
        // Find the settings row: flex row with gap: 10px and align-items: center
        const settingsRow = Array.from(container.querySelectorAll('div[style*="flex-direction: row"]')).find(div =>
            div.style.gap === '10px' && div.style.alignItems === 'center'
        );
        if (!settingsRow) return;
        // Find the settings icon container robustly
        const settingsIconDiv = Array.from(settingsRow.children).find(child => {
            if (!child.querySelector) return false;
            const btn = child.querySelector('button');
            if (!btn) return false;
            const iconDiv = btn.querySelector('div');
            if (!iconDiv) return false;
            const style = window.getComputedStyle(iconDiv);
            return style.height === '16px' && style.width === '16px' && iconDiv.className.includes('htrggD');
        });
        if (!settingsIconDiv) return;
        // Avoid double-inserting
        if (settingsRow.querySelector('.syntax-convert-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'syntax-convert-btn';
        btn.style.height = '32px';
        btn.style.width = '32px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '0';
        btn.style.marginRight = '5px';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.innerHTML = `
            <i class="fa-solid fa-right-left" style="color: #ebdab2; font-size: 16px; background-color: none;"></i>
        `;
        btn.title = 'Convert from A1111 to NovelAI syntax';
        btn.onclick = function() {
            document.querySelectorAll('.ProseMirror').forEach(editor => {
                const ps = Array.from(editor.querySelectorAll('p'));
                ps.forEach(p => {
                    if (!p.textContent.trim()) return;
                    p.textContent = a1111ToNovelAI(p.textContent);
                });
            });
        };
        btn.style.cursor = 'pointer';
        settingsRow.insertBefore(btn, settingsIconDiv); // Insert before the settings icon
        // Inject Font Awesome if needed
        if (!document.getElementById('fa-cdn')) {
            const link = document.createElement('link');
            link.id = 'fa-cdn';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }
        // Add tooltip CSS if not present
        if (!document.getElementById('syntax-tooltip-style')) {
            const style = document.createElement('style');
            style.id = 'syntax-tooltip-style';
            style.textContent = `
            .syntax-tooltip-popper {
                background: rgb(60, 56, 54);
                color: rgb(235, 218, 178);
                font-size: 14.4px;
                font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                font-weight: 400;
                line-height: 21.6px;
                max-width: 300px;
                padding: 8px;
                border: 2px solid rgb(60, 56, 54);
                border-radius: 1px;
                box-sizing: border-box;
                text-align: center;
                word-break: break-word;
                z-index: 9999;
                pointer-events: none;
                opacity: 1;
                transition: none;
            }
            .syntax-tooltip-fade {
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
            }
            .syntax-tooltip-fade.syntax-tooltip-visible {
                opacity: 1;
            }
            .syntax-tooltip-popper p {
                margin: 5px;
            }
            .syntax-tooltip-arrow {
                position: absolute;
                left: 50%;
                bottom: -8px;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                pointer-events: none;
            }
            .syntax-tooltip-arrow-border {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                border-left: 9px solid transparent;
                border-right: 9px solid transparent;
                border-top: 9px solid rgb(60,56,54);
                bottom: 0;
                width: 0;
                height: 0;
            }
            .syntax-tooltip-arrow-bg {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid #222;
                bottom: 1px;
                width: 0;
                height: 0;
            }
            `;
            document.head.appendChild(style);
        }
        // Add beautiful tooltip on hover (like settings button)
        btn.addEventListener('mouseenter', function() {
            // Remove any existing tooltip
            let old = document.getElementById('syntax-tooltip');
            if (old) old.remove();
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'syntax-tooltip-popper syntax-tooltip-fade';
            tooltip.id = 'syntax-tooltip';
            tooltip.style.position = 'fixed';
            tooltip.style.visibility = 'hidden';
            tooltip.innerHTML = '<p>Convert A1111 prompt to NovelAI syntax</p>' +
                '<div class="syntax-tooltip-arrow"><div class="syntax-tooltip-arrow-border" style="border-top-color: rgb(60,56,54);"></div><div class="syntax-tooltip-arrow-bg" style="border-top-color: rgb(60,56,54);"></div></div>';
            document.body.appendChild(tooltip);
            // Position above the inner icon div
            const icon = btn.querySelector('div');
            const rect = icon ? icon.getBoundingClientRect() : btn.getBoundingClientRect();
            const tooltipHeight = tooltip.offsetHeight;
            tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 8}px`;
            tooltip.style.visibility = 'visible';
            setTimeout(() => { tooltip.classList.add('syntax-tooltip-visible'); }, 10);
        });
        btn.addEventListener('mouseleave', function() {
            let old = document.getElementById('syntax-tooltip');
            if (old) old.remove();
        });
    }

    function observeSyntaxButton() {
        const observer = new MutationObserver(() => {
            insertSyntaxButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        insertSyntaxButton();
    }

    // --- Reference Strength Slider Patch ---
    // New: Find the Reference Strength sliders by traversing from the 'Normalize Reference Strength Values' label
    function findRefStrengthSliders() {
        // Find the span with the exact text 'Normalize Reference Strength Values'
        const labelSpan = Array.from(document.querySelectorAll('span')).find(
            span => span.textContent.trim() === 'Normalize Reference Strength Values'
        );
        if (!labelSpan) return [];
        // Go up to the label, then to the container div
        let container = labelSpan.closest('div');
        // Go up to the nearest parent that contains both the label and the sliders (likely 2-3 levels up)
        for (let i = 0; i < 4 && container; ++i) {
            // Heuristic: look for a container with at least one input[type="range"]
            if (container.querySelector('input[type="range"]')) break;
            container = container.parentElement;
        }
        if (!container) return [];
        // Find all input[type="range"] inside this container
        return Array.from(container.querySelectorAll('input[type="range"]'));
    }

    function patchRefStrengthSlider(slider) {
        slider.min   = -1;
        slider.max   =  1;
        slider.step  =  0.01;
        let val = parseFloat(slider.value);
        if (val > slider.max) slider.value = slider.max;
        if (val < slider.min) slider.value = slider.min;
    }

    function patchAllRefStrengthSliders() {
        findRefStrengthSliders().forEach(slider => patchRefStrengthSlider(slider));
    }

    function observeRefStrengthSliders() {
        new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    // If the node is a slider in the right container, patch it
                    if (node.matches && node.matches('input[type="range"]')) {
                        if (findRefStrengthSliders().includes(node)) patchRefStrengthSlider(node);
                    }
                    // Or if it contains sliders, patch them
                    node.querySelectorAll && node.querySelectorAll('input[type="range"]').forEach(slider => {
                        if (findRefStrengthSliders().includes(slider)) patchRefStrengthSlider(slider);
                    });
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
        patchAllRefStrengthSliders();
    }

    // --- Smart Weight-Enhancer Module (Global Delegation Debug) ---
    function setupWeightEnhancer() {
        console.log('[NovelAI Enhancer] setupWeightEnhancer called');
        try {
            // Regex for weight::tag
            const WEIGHT_TAG_REGEX = /^(\d+(?:\.\d+)?)::([^:]+)$/;
            // Helper: is intensity span
            function isIntensitySpan(span) {
                if (!span || span.nodeType !== 1) return false;
                return Array.from(span.classList).some(cls => cls.includes('intensity-color-'));
            }
            // Helper: is mid-intensity '::' span
            function isMidIntensityColonSpan(span) {
                return span && span.nodeType === 1 && Array.from(span.classList).some(cls => cls === 'mid-intensity-color-20') && span.textContent === '::';
            }
            const proseMirrors = document.querySelectorAll('.ProseMirror');
            console.log('[NovelAI Enhancer] Found .ProseMirror elements:', proseMirrors);
            let tooltip = null;
            let current = null;
            function cleanup() {
                if (tooltip) { tooltip.remove(); tooltip = null; }
                current = null;
            }
            document.body.addEventListener('mouseover', function(e) {
                try {
                    let proseMirror = e.target.closest && e.target.closest('.ProseMirror');
                    if (!proseMirror) return;
                    cleanup();
                    let node = e.target;
                    if (node.nodeType === 1 && node.tagName === 'SPAN') {
                        let text = node.textContent;
                        let match = text.match(/^(\d+(?:\.\d+)?)(::)(.*)$/);
                        if (match) {
                            let weight = match[1];
                            let after = match[3];
                            let tag = after;
                            let tagEndNode = node;
                            if (!after) {
                                let p = node.closest ? node.closest('p') : node.parentElement.closest('p');
                                if (p) {
                                    let nodes = Array.from(p.childNodes);
                                    let idx = nodes.indexOf(node);
                                    let j = idx + 1;
                                    while (j < nodes.length && nodes[j].nodeType === 3 && !nodes[j].textContent.trim()) ++j;
                                    if (j < nodes.length && nodes[j].nodeType === 3) {
                                        tag = nodes[j].textContent;
                                        tagEndNode = nodes[j];
                                    }
                                }
                            }
                            // Show tooltip
                            tooltip = document.createElement('div');
                            tooltip.className = 'syntax-tooltip-popper';
                            tooltip.id = 'syntax-tooltip';
                            tooltip.style.position = 'fixed';
                            tooltip.style.visibility = 'hidden';
                            tooltip.style.background = '#222';
                            tooltip.style.border = '2px solid rgb(60, 56, 54)';
                            tooltip.style.color = 'rgb(235, 218, 178)';
                            tooltip.innerHTML = `<span>Weight: ${weight}</span><div class="syntax-tooltip-arrow"><div class="syntax-tooltip-arrow-border"></div><div class="syntax-tooltip-arrow-bg"></div></div>`;
                            document.body.appendChild(tooltip);
                            let rect = node.getBoundingClientRect();
                            tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2}px`;
                            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 8}px`;
                            tooltip.style.visibility = 'visible';
                            current = { node, tagEndNode, weight, tag, match, isSplit: !after };
                            return;
                        }
                    } else if (node.nodeType === 3 && (node.parentElement && (node.parentElement.tagName === 'SPAN' || node.parentElement.tagName === 'P'))) {
                        let text = node.textContent.trim();
                        if (!text) return;
                        let match = text.match(/^(\d+(?:\.\d+)?)(::)(.*)$/);
                        if (match) {
                            let weight = match[1];
                            let after = match[3];
                            let tag = after;
                            let tagEndNode = node;
                            if (!after) {
                                let p = node.parentElement.closest('p');
                                if (p) {
                                    let nodes = Array.from(p.childNodes);
                                    let idx = nodes.indexOf(node);
                                    let j = idx + 1;
                                    while (j < nodes.length && nodes[j].nodeType === 3 && !nodes[j].textContent.trim()) ++j;
                                    if (j < nodes.length && nodes[j].nodeType === 3) {
                                        tag = nodes[j].textContent;
                                        tagEndNode = nodes[j];
                                    }
                                }
                            }
                            // Show tooltip
                            tooltip = document.createElement('div');
                            tooltip.className = 'syntax-tooltip-popper';
                            tooltip.id = 'syntax-tooltip';
                            tooltip.style.position = 'fixed';
                            tooltip.style.visibility = 'hidden';
                            tooltip.style.background = '#222';
                            tooltip.style.border = '2px solid rgb(60, 56, 54)';
                            tooltip.style.color = 'rgb(235, 218, 178)';
                            tooltip.innerHTML = `<span>Weight: ${weight}</span><div class="syntax-tooltip-arrow"><div class="syntax-tooltip-arrow-border"></div><div class="syntax-tooltip-arrow-bg"></div></div>`;
                            document.body.appendChild(tooltip);
                            let rect = node.parentElement.getBoundingClientRect();
                            tooltip.style.left = `${rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2}px`;
                            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 8}px`;
                            tooltip.style.visibility = 'visible';
                            current = { node, tagEndNode, weight, tag, match, isSplit: !after };
                            return;
                        }
                    }
                    cleanup();
                } catch (err) {
                    // Fail silently in production
                }
            });
            document.body.addEventListener('mousemove', function(e) {
                try {
                    if (!current) return;
                    let over = (e.target === current.node || e.target === current.tagEndNode);
                    if (!over) cleanup();
                } catch (err) {
                    console.error('[NovelAI Enhancer] Error in mousemove handler:', err);
                }
            });
            document.body.addEventListener('mouseleave', cleanup);
            document.body.addEventListener('wheel', function(e) {
                try {
                    if (!current) return;
                    e.preventDefault();
                    let delta = e.shiftKey ? 0.01 : 0.05;
                    if (e.ctrlKey) delta = 1; // Snap to whole numbers
                    if (e.deltaY > 0) delta = -delta;
                    let newWeight;
                    if (e.ctrlKey) {
                        // Snap to nearest whole number
                        newWeight = Math.max(0, Math.round(parseFloat(current.weight) + delta));
                    } else {
                        newWeight = Math.max(0, Math.round((parseFloat(current.weight) + delta) * 100) / 100);
                    }
                    if (newWeight === parseFloat(current.weight)) return;
                    // Update the node(s)
                    if (!current.isSplit) {
                        // Simple case: update textContent
                        let newText = current.node.textContent.replace(/^\d+(?:\.\d+)?/, newWeight.toFixed(2).replace(/\.00$/, ''));
                        current.node.textContent = newText;
                    } else {
                        // Split case: update number:: in node, tag in tagEndNode
                        current.node.textContent = newWeight.toFixed(2).replace(/\.00$/, '') + '::';
                    }
                    if (tooltip) { tooltip.remove(); tooltip = null; }
                    current = null;
                } catch (err) {
                    console.error('[NovelAI Enhancer] Error in wheel handler:', err);
                }
            }, { passive: false });
        } catch (err) {
            console.error('[NovelAI Enhancer] Error in setupWeightEnhancer:', err);
        }
    }

    // --- Main ---
    function main() {
        observeSyntaxButton();
        observeRefStrengthSliders();
        setupWeightEnhancer();
    }

    main();
})();