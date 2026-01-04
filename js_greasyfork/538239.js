// ==UserScript==
// @name         Amazon to eBay Sidebar Enhancer Ultimate
// @namespace    Eliminater74
// @version      1.4.0
// @description  Show eBay matches on Amazon product pages with inline or floating UI, sorting, persistent manual search, drag+snap gear, theme toggle, and optional copy button and styling cleanup for maximum polish and tweakability.
// @author       Eliminater74
// @license      MIT
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.ebay.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538239/Amazon%20to%20eBay%20Sidebar%20Enhancer%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/538239/Amazon%20to%20eBay%20Sidebar%20Enhancer%20Ultimate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SETTINGS_KEY = 'amazonEbayEnhancerSettings';
    const POSITION_KEY = 'amazonEbayEnhancerPositions';
    const SEARCH_KEY = 'amazonEbayManualSearch';
    const defaultSettings = {
        showPanel: true,
        showImages: true,
        theme: 'auto',
        maxResults: 5,
        sortMode: 'relevance',
        injectInline: false,
        manualSearch: false,
        showCopyButton: true
    };

    let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || defaultSettings;
    let positions = JSON.parse(localStorage.getItem(POSITION_KEY)) || {};
    let manualSearchText = localStorage.getItem(SEARCH_KEY) || '';

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function savePositions() {
        localStorage.setItem(POSITION_KEY, JSON.stringify(positions));
    }

    function saveSearchOverride(text) {
        localStorage.setItem(SEARCH_KEY, text);
    }

    function getTheme() {
        return settings.theme === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : settings.theme;
    }

    function applyTheme(el) {
        const theme = getTheme();
        el.classList.add(`ebay-enhancer-${theme}`);
    }

    function waitForTitle(cb) {
        const el = document.querySelector('#productTitle');
        if (el) cb(el.textContent.trim());
        else setTimeout(() => waitForTitle(cb), 400);
    }

    function fetchEbayResults(query, callback) {
        showLoadingBox();
        const sort = settings.sortMode === 'price' ? '&_sop=15' : '&_sop=12';
        const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}${sort}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: res => {
                const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                const items = [...doc.querySelectorAll('.s-item')].slice(0, settings.maxResults).map(el => ({
                    title: el.querySelector('.s-item__title')?.textContent || 'No Title',
                    price: el.querySelector('.s-item__price')?.textContent || 'N/A',
                    link: el.querySelector('a.s-item__link')?.href || '#',
                    image: el.querySelector('.s-item__image-img')?.src || null
                }));
                hideLoadingBox();
                callback(items);
            }
        });
    }

    function showLoadingBox() {
        const box = document.createElement('div');
        box.id = 'ebay-loading-box';
        box.className = 'ebay-enhancer-box';
        box.textContent = '🔍 Searching eBay for matches...';
        document.body.appendChild(box);
    }

    function hideLoadingBox() {
        const box = document.getElementById('ebay-loading-box');
        if (box) box.remove();
    }

    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .ebay-enhancer-light { background: #f9f9f9; color: #000; }
            .ebay-enhancer-dark  { background: #1e1e1e; color: #f0f0f0; }
            .ebay-enhancer-panel {
                position: fixed;
                width: 330px;
                max-height: 70vh;
                overflow-y: auto;
                border: 2px solid #999;
                padding: 10px;
                border-radius: 6px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 99999;
                cursor: move;
            }
            .ebay-enhancer-gear {
                position: fixed;
                width: 40px;
                height: 40px;
                font-size: 22px;
                background: #222;
                color: #fff;
                border: 2px solid #888;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: move;
                z-index: 2147483647;
            }
            .ebay-enhancer-config {
                position: fixed;
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 8px;
                display: none;
                z-index: 999999;
            }
            .ebay-enhancer-box {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 12px 16px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px;
                border: 2px solid #ccc;
                z-index: 999999;
            }
        `;
        document.head.appendChild(style);
    }

    function makeDraggable(el, id) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        el.addEventListener('mousedown', e => {
            isDragging = true;
            el.dataset.dragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const left = e.clientX - offsetX;
            const top = e.clientY - offsetY;
            const width = window.innerWidth, height = window.innerHeight;

            if (left < width / 2) {
                el.style.left = '10px'; el.style.right = 'unset';
                positions[`${id}Left`] = '10px'; delete positions[`${id}Right`];
            } else {
                el.style.right = '10px'; el.style.left = 'unset';
                positions[`${id}Right`] = '10px'; delete positions[`${id}Left`];
            }

            if (top < height / 2) {
                el.style.top = '10px'; el.style.bottom = 'unset';
                positions[`${id}Top`] = '10px'; delete positions[`${id}Bottom`];
            } else {
                el.style.bottom = '10px'; el.style.top = 'unset';
                positions[`${id}Bottom`] = '10px'; delete positions[`${id}Top`];
            }

            savePositions();
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            delete el.dataset.dragging;
        });
    }

    function buildResultHTML(results) {
        return results.map(r => `
            <div style="margin-bottom:12px;">
                <a href="${r.link}" target="_blank" style="font-weight:bold; color:#0073e6; text-decoration:none;">${r.title}</a><br/>
                <span>${r.price}</span><br/>
                ${settings.showImages && r.image ? `<img src="${r.image}" style="width:100px; margin-top:4px;" />` : ''}
            </div>`).join('');
    }

    function createResultsPanel(results) {
        const wrapper = document.createElement('div');
        wrapper.id = 'ebay-enhancer-panel';
        wrapper.innerHTML = `<h3 style="margin-top:0;">🛒 eBay Matches</h3>` + buildResultHTML(results);

        if (settings.showCopyButton) {
            const btn = document.createElement('button');
            btn.textContent = '📋 Copy All to Clipboard';
            btn.style.cssText = 'margin-top:10px;padding:5px;font-size:13px;';
            btn.onclick = () => {
                const text = results.map(r => `${r.title}\n${r.price}\n${r.link}\n`).join('\n');
                navigator.clipboard.writeText(text).then(() => alert("Copied!"));
            };
            wrapper.appendChild(btn);
        }

        if (settings.injectInline) {
            const target = document.getElementById('productTitle');
            if (target) {
                const box = document.createElement('div');
                box.style.marginTop = '20px';
                box.style.border = '1px solid #ccc';
                box.style.padding = '10px';
                applyTheme(box);
                box.appendChild(wrapper);
                target.parentNode.appendChild(box);
            }
        } else {
            applyTheme(wrapper);
            wrapper.classList.add('ebay-enhancer-panel');
            wrapper.style.top = positions.panelTop || '80px';
            wrapper.style.left = positions.panelLeft || 'unset';
            wrapper.style.right = positions.panelRight || '10px';
            makeDraggable(wrapper, 'panel');
            document.body.appendChild(wrapper);
        }
    }

    function createGearIcon() {
        const gear = document.createElement('div');
        gear.className = 'ebay-enhancer-gear';
        gear.textContent = '⚙️';
        gear.style.top = positions.gearTop || 'unset';
        gear.style.left = positions.gearLeft || 'unset';
        gear.style.bottom = positions.gearBottom || '20px';
        gear.style.right = positions.gearRight || '20px';

        const panel = document.createElement('div');
        panel.className = 'ebay-enhancer-config';
        panel.style.bottom = '70px';
        panel.style.right = '20px';

        panel.innerHTML = `
            <label><input type="checkbox" id="ebayToggle" ${settings.showPanel ? 'checked' : ''}/> Show Panel</label><br/>
            <label><input type="checkbox" id="imageToggle" ${settings.showImages ? 'checked' : ''}/> Show Images</label><br/>
            <label><input type="checkbox" id="inlineToggle" ${settings.injectInline ? 'checked' : ''}/> Inject Inline</label><br/>
            <label><input type="checkbox" id="manualToggle" ${settings.manualSearch ? 'checked' : ''}/> Manual Search</label><br/>
            <label><input type="checkbox" id="copyToggle" ${settings.showCopyButton ? 'checked' : ''}/> Show Copy Button</label><br/>
            <label>Sort:
                <select id="sortMode">
                    <option value="relevance" ${settings.sortMode === 'relevance' ? 'selected' : ''}>Relevance</option>
                    <option value="price" ${settings.sortMode === 'price' ? 'selected' : ''}>Price ↑</option>
                </select>
            </label><br/>
            <label>Theme:
                <select id="themeSelect">
                    <option value="auto" ${settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
                    <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                    <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                </select>
            </label><br/>
            <label>Max Results: <input type="number" id="maxResults" value="${settings.maxResults}" style="width:50px"/></label><br/>
            <input type="text" id="manualInput" placeholder="Search override..." value="${manualSearchText}" style="width:100%;margin-top:5px;"/>
        `;

        gear.addEventListener('click', () => {
            if (!gear.dataset.dragging)
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        const idMap = {
            ebayToggle: 'showPanel',
            imageToggle: 'showImages',
            inlineToggle: 'injectInline',
            manualToggle: 'manualSearch',
            copyToggle: 'showCopyButton'
        };

        for (const id in idMap) {
            panel.querySelector(`#${id}`).addEventListener('change', e => {
                settings[idMap[id]] = e.target.checked;
                saveSettings();
                location.reload();
            });
        }

        panel.querySelector('#sortMode').addEventListener('change', e => {
            settings.sortMode = e.target.value;
            saveSettings();
            location.reload();
        });

        panel.querySelector('#themeSelect').addEventListener('change', e => {
            settings.theme = e.target.value;
            saveSettings();
            location.reload();
        });

        panel.querySelector('#maxResults').addEventListener('change', e => {
            settings.maxResults = parseInt(e.target.value) || 5;
            saveSettings();
            location.reload();
        });

        panel.querySelector('#manualInput').addEventListener('input', e => {
            saveSearchOverride(e.target.value);
        });

        makeDraggable(gear, 'gear');
        document.body.appendChild(gear);
        document.body.appendChild(panel);
    }

    createStyle();
    waitForTitle(title => {
        const query = settings.manualSearch ? manualSearchText || title : title;
        if (settings.showPanel) {
            fetchEbayResults(query, createResultsPanel);
        }
        createGearIcon();
    });
})();
