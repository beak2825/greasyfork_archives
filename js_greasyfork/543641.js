// ==UserScript==
// @name         -PopZ- Quick Assist
// @namespace    https://torn.com/
// @version      2.04
// @description  Request for backup in Torn City fights. Property of -PopZ-
// @author       Jimskylark
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/page.php?sid=travel*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      discord.com
// @connect      popz-gangsta-cvcyddavfvbjfmf8.centralus-01.azurewebsites.net
// @downloadURL https://update.greasyfork.org/scripts/543641/-PopZ-%20Quick%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/543641/-PopZ-%20Quick%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1398418112482906254/isREtk1IlcXSq8jlDlr7ajTID05ZUQmdkedScDIOHOixzmc3Cw7i5eEEYH0jVf0pniJH';
    const AZURE_FUNCTION_URL = 'https://popz-gangsta-cvcyddavfvbjfmf8.centralus-01.azurewebsites.net/api/Gangsta-Push-Notification?';
    const POLLING_INTERVAL = 5000;

    // --- State variable to track if the panel has been closed by the user ---
    let isPanelDismissed = false;

    // --- STYLING FOR THE PANEL & FORMS ---
    GM_addStyle(`
        #assist-panel{position:fixed;top:80px;right:15px;width:330px;background:#2f3136;border-radius:8px;z-index:99999;font-family:Arial,sans-serif;box-shadow:0 5px 20px rgba(0,0,0,0.4);transition:opacity .3s,transform .3s;transform:translateX(120%);opacity:0}
        #assist-panel.visible{transform:translateX(0);opacity:1}
        #assist-panel-header{position:relative;padding:10px 15px;background-color:#202225;color:white;font-size:15px;font-weight:bold;border-top-left-radius:8px;border-top-right-radius:8px}
        #assist-panel-close-btn{position:absolute;top:50%;right:15px;transform:translateY(-50%);font-size:22px;color:#b9bbbe;cursor:pointer;font-weight:bold;line-height:1}
        #assist-panel-close-btn:hover{color:white}
        #assist-panel-list{max-height:400px;overflow-y:auto;padding:5px}
        .assist-item{background:#36393f;margin:5px;padding:10px;border-radius:5px;border-left:4px solid #ff4757;color:#dcddde}
        .assist-item p{margin:0 0 8px 0;font-size:13px;line-height:1.5}
        .assist-item-target b{color:#ff4757}
        .assist-details{background-color:rgba(0,0,0,0.2);padding:8px;border-radius:4px;margin-bottom:10px;font-size:12px;white-space:pre-wrap;line-height:1.5}
        .assist-item a.join-button{display:block;padding:7px;background-color:#5865f2;color:white !important;text-align:center;border-radius:5px;font-weight:bold;text-decoration:none;transition:background-color 0.2s;font-size:13px}
        .assist-item a.join-button:hover{background-color:#4752c4}
        #custom-assist-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:100000;display:flex;justify-content:center;align-items:center}
    `);

    // --- POLLING AND PANEL LOGIC ---
    function checkForAlerts() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: AZURE_FUNCTION_URL,
            onload: function(response) {
                if (response.status !== 200) return;
                try {
                    const activeAlerts = JSON.parse(response.responseText);
                    updateAssistPanel(activeAlerts);
                } catch (e) { console.error('-PopZ- Assist: Failed to parse alert list.', e); }
            }
        });
    }

    function updateAssistPanel(alerts) {
        // --- If user has dismissed the panel, do nothing further ---
        if (isPanelDismissed) {
            return;
        }

        let panel = document.getElementById('assist-panel');
        if (!alerts || alerts.length === 0) {
            if (panel) panel.classList.remove('visible');
            return;
        }

        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'assist-panel';
            panel.innerHTML = `<div id="assist-panel-header">Active Assists <span id="assist-panel-close-btn">&times;</span></div><div id="assist-panel-list"></div>`;
            document.body.appendChild(panel);

            // --- The close button sets our dismissed flag ---
            panel.querySelector('#assist-panel-close-btn').onclick = () => {
                panel.classList.remove('visible');
                isPanelDismissed = true;
            };
        }

        const list = panel.querySelector('#assist-panel-list');
        list.innerHTML = '';
        const currentUser = getFighterInfo();

        for (const alert of alerts) {
            if (currentUser && alert.data.attacker.includes(currentUser.playername)) {
                continue;
            }
            const item = document.createElement('div');
            item.className = 'assist-item';
            let detailsHtml = '';
            if (alert.data.details) {
                detailsHtml = `<div class="assist-details">${alert.data.details}</div>`;
            }
            item.innerHTML = `
                ${detailsHtml}
                <p>
                    <b class="assist-item-attacker">${alert.data.attacker}</b><br>
                    vs. <b class="assist-item-target">${alert.data.target}</b>
                </p>
                <a href="${alert.data.fightUrl}" target="_blank" class="join-button">JOIN FIGHT</a>
            `;
            list.appendChild(item);
        }

        if (list.children.length > 0) {
            panel.classList.add('visible');
        } else {
            panel.classList.remove('visible');
        }
    }

    // --- HELPER FUNCTIONS ---
    function getFighterInfo() {
        const tornUserInput = document.getElementById('torn-user');
        if (tornUserInput) {
            try { return JSON.parse(tornUserInput.value); } catch (e) {}
        }
        return null;
    }

    function getTargetInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const targetId = urlParams.get('user2ID');
        if (!targetId) return null;
        const pageTitleMatch = document.title.match(/^([A-Za-z0-9_]+)\s*\|/);
        return { id: targetId, name: pageTitleMatch ? pageTitleMatch[1] : 'Unknown' };
    }

    function getFightUrl(targetId) {
        return `https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`;
    }

    function sendToDiscord(payload, successMessage) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(payload),
            onload: (res) => showNotification(res.status === 204 || res.status === 200 ? `✅ Assist request sent! ${successMessage}` : '❌ Discord Error', 'success'),
            onerror: () => showNotification('❌ Connection Error', 'error')
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `position: fixed; top: 40px; right: 1%; padding: 15px 20px; background: ${type === 'success' ? '#4CAF50' : '#f44336'}; color: white; border-radius: 8px; z-index: 10000; font-weight: bold;`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    function sendQuickAssistRequest() {
        const fighter = getFighterInfo();
        const target = getTargetInfo();
        if (!fighter || !target) return showNotification('Unable to detect fight information.', 'error');
        const payload = {
            embeds: [{
                title: `BACKUP HAS BEEN REQUESTED BY ${fighter.playername}`,
                color: 0xFFFF00,
                fields: [
                    { name: 'Faction Member', value: `${fighter.playername} [${fighter.id}]`, inline: true },
                    { name: 'Target (Enemy)', value: `${target.name} [${target.id}]`, inline: true },
                    { name: '🔥 Quick Access', value: `[**JOIN FIGHT NOW**](${getFightUrl(target.id)})`, inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: '-PopZ- Quick Assist' }
            }]
        };
        sendToDiscord(payload, `Fighting ${target.name}`);
    }

    function generateCustomTitle(smoke, tears, heavies) {
        const items = [];
        if (smoke > 0) items.push(`SMOKE GRENADE${smoke > 1 ? 'S' : ''}`);
        if (tears > 0) items.push(`TEAR GAS`);
        if (heavies > 0) items.push(`HEAVY HITTER${heavies > 1 ? 'S' : ''}`);
        if (items.length === 0) return 'BACKUP REQUESTED';
        return items.join(' AND ') + ' NEEDED';
    }

    function sendCustomAssistRequest() {
        const fighter = getFighterInfo();
        const target = getTargetInfo();
        if (!fighter || !target) return showNotification('Unable to detect fight information.', 'error');
        const formHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 400px;">
                <h3 style="margin-top: 0; color: #333; text-align: center;">Custom Assist Request</h3>
                <p style="color: #666; text-align: center; margin-bottom: 20px;">Specify the assistance you need:</p>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">💨 Smoke Grenades:</label>
                    <input type="number" id="smoke-count" min="0" max="99" value="0" style="width: 90%; padding: 8px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">😢 Tear Gas:</label>
                    <input type="number" id="tears-count" min="0" max="99" value="0" style="width: 90%; padding: 8px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">💪 Heavy Hitters:</label>
                    <input type="number" id="heavies-count" min="0" max="99" value="0" style="width: 90%; padding: 8px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px;">
                </div>
                <div style="text-align: center;">
                    <button id="send-custom-request" style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 10px;">Send Request</button>
                    <button id="cancel-custom-request" style="background: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">Cancel</button>
                </div>
            </div>`;
        const overlay = document.createElement('div');
        overlay.id = 'custom-assist-overlay';
        overlay.innerHTML = formHTML;
        document.body.appendChild(overlay);
        document.getElementById('send-custom-request').onclick = function() {
            const smoke = parseInt(document.getElementById('smoke-count').value) || 0;
            const tears = parseInt(document.getElementById('tears-count').value) || 0;
            const heavies = parseInt(document.getElementById('heavies-count').value) || 0;
            const customTitle = generateCustomTitle(smoke, tears, heavies);
            const payload = {
                content: `**${fighter.playername}** is hollering for specific backups!`,
                embeds: [{
                    title: `🎯 ${customTitle}`,
                    color: 0xFF6600,
                    fields: [
                        { name: 'Faction Member', value: `${fighter.playername} [${fighter.id}]`, inline: true },
                        { name: 'Target (Enemy)', value: `${target.name} [${target.id}]`, inline: true },
                        {
                            name: 'Assistance Needed',
                            value: smoke > 0 || tears > 0 || heavies > 0 ?
                                `${smoke > 0 ? `💨 ${smoke} Smoke Grenades\n` : ''}${tears > 0 ? `😢 ${tears} Tear Gas\n` : ''}${heavies > 0 ? `💪 ${heavies} Heavy Hitters\n` : ''}`.trim() :
                                'General backup needed',
                            inline: false
                        },
                        { name: '🔥 Quick Access', value: `[**JOIN FIGHT NOW**](${getFightUrl(target.id)})`, inline: false }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: '-PopZ- Custom Assist' }
                }]
            };
            sendToDiscord(payload, `Fighting ${target.name}`);
            overlay.remove();
        };
        document.getElementById('cancel-custom-request').onclick = function() { overlay.remove(); };
    }

    function addAssistButtons() {
        if (document.getElementById('assist-buttons-container')) return;

        const container = document.createElement('div');
        container.id = 'assist-buttons-container';
        container.style.cssText = 'position: relative; width: 100%; display: flex; justify-content: center; gap: 10px; margin: 0; padding: 0;';

        const quickButton = document.createElement('button');
        quickButton.innerHTML = '🆘 Quick Assist';
        quickButton.style.cssText = 'padding: 4px 0; background: #5865f2; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; min-width: 140px;';
        quickButton.onclick = function() {
            this.disabled = true; this.innerHTML = '⏳ Sending...';
            sendQuickAssistRequest();
            setTimeout(() => { this.disabled = false; this.innerHTML = '🆘 Quick Assist'; }, 5000);
        };

        const customButton = document.createElement('button');
        customButton.innerHTML = '🎯 Custom Assist';
        customButton.style.cssText = 'padding: 4px 0; background: #FF6B35; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; min-width: 140px;';
        customButton.onclick = sendCustomAssistRequest;

        container.appendChild(quickButton);
        container.appendChild(customButton);

        const targetElement = document.querySelector('.content-wrapper') || document.body;
        targetElement.insertBefore(container, targetElement.firstChild);
    }

    function initialize() {
        console.log('-PopZ- Assist: Initializing multi-request panel...');
        setInterval(checkForAlerts, POLLING_INTERVAL);
        setTimeout(checkForAlerts, 1000);
        if (window.location.href.includes('sid=attack')) {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.content-wrapper')) {
                    addAssistButtons();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    initialize();
})();