// ==UserScript==
// @name         SiteBlocker
// @namespace    https://github.com/asmagaa/SiteBlock
// @version      1.2
// @description  Block sites you want with your own description! 
// @author       asmagaa
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540251/SiteBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540251/SiteBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCK_LIST_KEY = 'siteblocker_blocklist';
    const TEMP_UNBLOCK_KEY = 'siteblocker_temp_unblock';
    const TEMP_UNBLOCK_DURATION = 15 * 60 * 1000;

    const currentHost = window.location.hostname.replace(/^www\./, '');

    const blockList = GM_getValue(BLOCK_LIST_KEY, {});
    const tempUnblockTime = GM_getValue(TEMP_UNBLOCK_KEY, 0);

    const isTempUnblocked = tempUnblockTime && Date.now() < tempUnblockTime;

    if (blockList[currentHost] && !isTempUnblocked) {
        renderBlockPage(blockList[currentHost]);
    } else {
        setTimeout(renderControlPanel, 3000);
    }

    GM_registerMenuCommand('Manage Blocked Sites', openBlockListManager);
    GM_registerMenuCommand('Clear All Blocks', clearAllBlocks);

    function renderBlockPage(message) {
        const scrollPosition = window.scrollY;

        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
                text-align: center;
            ">
                <div style="max-width: 600px;">
                    <h1 style="color: #e74c3c; font-size: 2.5rem; margin-bottom: 20px;">
                        <span style="font-size: 3rem;">🚫</span> Site Blocked
                    </h1>
                    <div style="
                        background: #f9f9f9;
                        border-left: 4px solid #e74c3c;
                        padding: 15px;
                        margin: 20px 0;
                        text-align: left;
                    ">
                        <p style="margin: 0; font-size: 1.2rem;">${message || 'You blocked this site using SiteBlocker'}</p>
                    </div>
                    
                    <div style="margin: 30px 0; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                        <button id="siteblock-unblock-btn" style="
                            padding: 12px 25px;
                            font-size: 1rem;
                            background: #2ecc71;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                            Unblock for 15 Minutes
                        </button>
                        
                        <button id="siteblock-manage-btn" style="
                            padding: 12px 25px;
                            font-size: 1rem;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">
                            Manage Blocked Sites
                        </button>
                    </div>
                    
                    <div style="margin-top: 30px; color: #7f8c8d; font-size: 0.9rem;">
                        <p>SiteBlocker is preventing you from accessing this site.</p>
                        <p>You can temporarily unblock or manage your blocked sites.</p>
                    </div>
                </div>
            </div>
        `;

        window.scrollTo(0, scrollPosition);

        document.getElementById('siteblock-unblock-btn').addEventListener('click', tempUnblock);
        document.getElementById('siteblock-manage-btn').addEventListener('click', openBlockListManager);
    }

    function renderControlPanel() {
        if (document.getElementById('siteblock-control-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'siteblock-control-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            padding: 20px;
            width: 300px;
            font-family: Arial, sans-serif;
            transition: transform 0.3s ease;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #2c3e50;">SiteBlocker</h3>
                <button id="siteblock-close-btn" style="
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #7f8c8d;
                ">×</button>
            </div>
            
            <p style="margin-top: 0; margin-bottom: 15px;">
                Current site: <strong>${currentHost}</strong>
            </p>
            
            <textarea id="siteblock-reason" placeholder="Why do you want to block this site?" 
                style="width: 100%; height: 80px; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            
            <div style="display: flex; gap: 10px;">
                <button id="siteblock-block-btn" style="
                    flex: 1;
                    padding: 10px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">Block This Site</button>
            </div>
            
            <div style="margin-top: 15px; text-align: center;">
                <button id="siteblock-manage-link" style="
                    background: none;
                    border: none;
                    color: #3498db;
                    cursor: pointer;
                    font-size: 0.9rem;
                    text-decoration: underline;
                ">Manage Blocked Sites</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('siteblock-close-btn').addEventListener('click', () => {
            panel.style.transform = 'translateY(150%)';
            setTimeout(() => panel.remove(), 300);
        });

        document.getElementById('siteblock-block-btn').addEventListener('click', blockCurrentSite);
        document.getElementById('siteblock-manage-link').addEventListener('click', openBlockListManager);
    }

    function blockCurrentSite() {
        const reason = document.getElementById('siteblock-reason').value || "Blocked by SiteBlocker";
        const blockList = GM_getValue(BLOCK_LIST_KEY, {});

        blockList[currentHost] = reason;
        GM_setValue(BLOCK_LIST_KEY, blockList);

        const panel = document.getElementById('siteblock-control-panel');
        if (panel) {
            panel.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 3rem; color: #2ecc71;">✓</div>
                    <h3 style="color: #2ecc71;">Site Blocked!</h3>
                    <p>${currentHost} has been added to your block list.</p>
                    <p>Refresh the page to activate blocking.</p>
                </div>
            `;
            setTimeout(() => {
                if (panel.parentNode) panel.parentNode.removeChild(panel);
            }, 3000);
        } 
    }

    function tempUnblock() {
        const unblockTime = Date.now() + TEMP_UNBLOCK_DURATION;
        GM_setValue(TEMP_UNBLOCK_KEY, unblockTime);
        window.location.reload();
    }

    function openBlockListManager() {
        const blockList = GM_getValue(BLOCK_LIST_KEY, {});

        const existingManager = document.getElementById('siteblock-manager');
        if (existingManager) existingManager.remove();
        
        const manager = document.createElement('div');
        manager.id = 'siteblock-manager';
        manager.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;

        const sites = Object.entries(blockList);

        manager.innerHTML = `
            <div style="
                background: white;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div style="padding: 20px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0; color: #2c3e50;">Blocked Sites Manager</h2>
                </div>
                
                <div style="flex: 1; overflow-y: auto; padding: 20px;">
                    ${sites.length ? `
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Site</th>
                                    <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Reason</th>
                                    <th style="width: 100px; border-bottom: 1px solid #eee;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sites.map(([site, reason]) => `
                                    <tr>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${site}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${reason}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                                            <button data-site="${site}" class="siteblock-remove-btn" style="
                                                background: #e74c3c;
                                                color: white;
                                                border: none;
                                                border-radius: 4px;
                                                padding: 5px 10px;
                                                cursor: pointer;
                                            ">Remove</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div style="text-align: center; padding: 40px 20px; color: #7f8c8d;">
                            <p style="font-size: 1.2rem;">No sites blocked yet</p>
                            <p>Add sites using the control panel</p>
                        </div>
                    `}
                </div>
                
                <div style="padding: 20px; display: flex; justify-content: space-between; border-top: 1px solid #eee;">
                    <button id="siteblock-manager-close" style="
                        padding: 10px 20px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Close</button>
                    
                    <button id="siteblock-clear-all" style="
                        padding: 10px 20px;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Clear All</button>
                </div>
            </div>
        `;

        document.body.appendChild(manager);

        document.getElementById('siteblock-manager-close').addEventListener('click', () => manager.remove());
        document.getElementById('siteblock-clear-all').addEventListener('click', clearAllBlocks);

        document.querySelectorAll('.siteblock-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const site = e.target.dataset.site;
                const blockList = GM_getValue(BLOCK_LIST_KEY, {});
                delete blockList[site];
                GM_setValue(BLOCK_LIST_KEY, blockList);
                e.target.closest('tr').remove();

                if (Object.keys(blockList).length === 0) {
                    const tbody = manager.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = `
                            <tr>
                                <td colspan="3" style="text-align: center; padding: 20px; color: #7f8c8d;">
                                    No blocked sites
                                </td>
                            </tr>
                        `;
                    }
                }
            });
        });
    }

    function clearAllBlocks() {
        if (confirm('Are you sure you want to remove ALL blocked sites?')) {
            GM_setValue(BLOCK_LIST_KEY, {});
            const manager = document.getElementById('siteblock-manager');
            if (manager) manager.remove();
            alert('All blocked sites have been removed.');
        }
    }
})();