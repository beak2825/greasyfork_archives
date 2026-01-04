// ==UserScript==
// @name         Change clicked link's color
// @license      MIT
// @namespace    http://tampermonkey.net/
// @author       ngtuan.vn28@gmail.com
// @homepageURL  https://greasyfork.org/vi/scripts/501244-change-clicked-link-s-color
// @version      1.2.6
// @description  Change color of clicked links in body with color presets and custom hex input
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         https://cdn-icons-png.flaticon.com/512/4906/4906292.png
// @downloadURL https://update.greasyfork.org/scripts/501244/Change%20clicked%20link%27s%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/501244/Change%20clicked%20link%27s%20color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config
    let p_color_clicked = GM_getValue('colorClicked', '#800080');
    let p_apply_all = GM_getValue('applyAll', true);
    let p_apply_domains = GM_getValue('applyDomains', '');

    // Variables
    const style_id = "clicked-link-color-style";
    const css_a_clicked = `
        a:visited:not(nav a):not(.nav a):not(.navbar a):not(.menu a):not(.navigation a),
        a:visited:not(nav a):not(.nav a):not(.navbar a):not(.menu a):not(.navigation a) *,
        a.custom-visited,
        a.custom-visited * {
            color: %COLOR% !important;
        }`;
    const colorPresets = {
        'Purple': '#800080',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Orange': '#FFA500',
        'Pink': '#FFC0CB',
        'Brown': '#A52A2A',
        'Gray': '#808080',
        'Cyan': '#00FFFF',
        'Magenta': '#FF00FF',
        'Lime': '#00FF00'
    };

    // Functions
    function isDomainApplied(domains, site) {
        if (p_apply_all) return true;
        if (domains.trim() === '') return false;
        let domainList = domains.split(",");
        return domainList.some(domain => site.includes(domain.trim()));
    }

    function addStyle(css) {
        let style = document.getElementById(style_id);
        if (style === null) {
            let head = document.getElementsByTagName("head")[0];
            style = document.createElement("style");
            style.setAttribute("id", style_id);
            style.setAttribute("type", "text/css");
            head.appendChild(style);
        }
        style.textContent = css;
    }

    function assignColor(css, color) {
        return css.replace(/%COLOR%/ig, color);
    }

    function main() {
        let url = document.documentURI;
        let css = assignColor(css_a_clicked, p_color_clicked);
        if (isDomainApplied(p_apply_domains, url)) {
            addStyle(css);
            addClickListener();
        }
    }

    function addClickListener() {
        document.body.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.target.classList.add('custom-visited');
            }
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    main();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createDialog(id, content) {
        const dialog = document.createElement('dialog');
        dialog.className = 'custom-dialog';
        dialog.id = id;
        dialog.innerHTML = `
            <form method="dialog">
                ${content}
            </form>
        `;
        document.body.appendChild(dialog);

        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '90%';
        dialog.style.border = '2px solid #007bff';
        dialog.style.borderRadius = '8px';
        dialog.style.padding = '16px';
        dialog.style.backgroundColor = '#fff';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.overflow = 'hidden';
        dialog.showModal();
        return dialog;
    }

    function showColorSelector() {
        const content = `
            <h3>Change Clicked Link's Color</h3>
            <div class="section">
                <label for="colorPreset">Choose a preset color:</label>
                <select id="colorPreset" style="width: 100%;">
                    <option value="">-- Choose a preset color --</option>
                    ${Object.entries(colorPresets).map(([name, value]) =>
                        `<option value="${value}" style="background-color: ${value}; color: white;">${name} (${value})</option>`
                    ).join('')}
                </select>
            </div>
            <div class="section">
                <label for="customColor">Or enter a custom hex color:</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="text" id="customColor" placeholder="#RRGGBB" pattern="^#[0-9A-Fa-f]{6}$" style="flex: 1; height: 2em; border: 2px solid #007bff; border-radius: 4px;">
                    <input type="color" id="colorPicker" value="${p_color_clicked}" style="height: 2em; border: 2px solid #007bff; border-radius: 4px;">
                </div>
            </div>
            <div class="button-container" style="margin-top: 20px;">
                <button type="submit" id="applyBtn" style="background-color: #007bff; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; margin-right: 10px;">Apply</button>
                <button type="button" id="cancelBtn" style="background-color: #ccc; color: #000; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Cancel</button>
            </div>
        `;

        const dialog = createDialog('colorDialog', content);
        const colorPreset = dialog.querySelector('#colorPreset');
        const customColor = dialog.querySelector('#customColor');
        const colorPicker = dialog.querySelector('#colorPicker');
        const applyBtn = dialog.querySelector('#applyBtn');
        const cancelBtn = dialog.querySelector('#cancelBtn');

        colorPreset.value = p_color_clicked;
        customColor.value = p_color_clicked;
        colorPicker.value = p_color_clicked;

        colorPreset.addEventListener('change', function() {
            if (this.value) {
                customColor.value = this.value;
                colorPicker.value = this.value;
            }
        });

        colorPicker.addEventListener('input', function() {
            customColor.value = this.value;
        });

        cancelBtn.addEventListener('click', () => dialog.close());

        dialog.addEventListener('close', () => {
            if (dialog.returnValue !== 'cancel') {
                const newColor = customColor.value;
                if (/^#[0-9A-Fa-f]{6}$/i.test(newColor)) {
                    p_color_clicked = newColor;
                    GM_setValue('colorClicked', p_color_clicked);
                    main();
                } else {
                    alert("Invalid color code. Please use hex format (e.g., #800080).");
                }
            }
        });
    }

    function showDomainSettings() {
        const content = `
            <h3>Manage Enabled Domains</h3>
            <div class="section">
                <label for="enabledSites">Enable on these sites (one per line):</label>
                <textarea id="enabledSites" rows="10" style="width: 100%; border: 2px solid #007bff; border-radius: 4px; padding: 8px; box-sizing: border-box;">${p_apply_domains.replace(/,/g, '\n')}</textarea>
            </div>
            <div class="section" style="margin-top: 10px;">
                <label>
                    <input type="checkbox" id="enableAllSites" ${p_apply_all ? 'checked' : ''}> Apply to all websites
                </label>
            </div>
            <div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">
                <button type="button" id="addThisSite" style="background-color: #28a745; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Add this site</button>
                <div class="button-group" style="display: flex; gap: 10px;">
                    <button type="submit" style="background-color: #007bff; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Save</button>
                    <button type="button" id="cancelBtn" style="background-color: #ccc; color: #000; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;

        const dialog = createDialog('domainDialog', content);
        const enabledSitesTextarea = dialog.querySelector('#enabledSites');
        const addThisSiteBtn = dialog.querySelector('#addThisSite');
        const saveBtn = dialog.querySelector('button[type="submit"]');
        const cancelBtn = dialog.querySelector('#cancelBtn');
        const enableAllSitesCheckbox = dialog.querySelector('#enableAllSites');

        addThisSiteBtn.addEventListener('click', () => {
            const currentDomain = window.location.hostname.replace(/^www\./, '');
            const domainList = enabledSitesTextarea.value.split('\n').map(site => site.trim()).filter(Boolean);

            if (!domainList.includes(currentDomain)) {
                domainList.push(currentDomain);
                enabledSitesTextarea.value = domainList.join('\n');
            }
        });

        cancelBtn.addEventListener('click', () => dialog.close('cancel'));

        dialog.addEventListener('close', () => {
            if (dialog.returnValue !== 'cancel') {
                const newEnabledSites = enabledSitesTextarea.value.split('\n').map(site => site.trim()).filter(Boolean);
                const newEnableAllSites = enableAllSitesCheckbox.checked;

                if (JSON.stringify(newEnabledSites) !== JSON.stringify(p_apply_domains.split(',')) ||
                    newEnableAllSites !== p_apply_all) {
                    p_apply_domains = newEnabledSites.join(',');
                    p_apply_all = newEnableAllSites;
                    GM_setValue('applyDomains', p_apply_domains);
                    GM_setValue('applyAll', p_apply_all);
                    main();
                }
            }
        });
    }

    // Menu commands
    GM_registerMenuCommand("🎨 Change clicked link's color", showColorSelector, "C");
    GM_registerMenuCommand("🌐 Domain settings", showDomainSettings, "D");

    // Run main function immediately
    main();

    // Observe DOM changes
    observeDOMChanges();
})();