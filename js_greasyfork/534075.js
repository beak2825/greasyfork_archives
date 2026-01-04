// ==UserScript==
// @name         🌸 Hello Kitty FA Unlocker ~ Ultimate Kawaii Edition 🌸
// @namespace    http://tampermonkey.net/
// @version      1.4.1b
// @description  Unlock All Skins, Fake Your Stats, Spoof Roles, Flash Clan Tags & Maybe a chance to meet a real Hello Kitty! So cute it might just crash your enemies.
// @author       pug
// @match        https://forward-assault.game-files.crazygames.com/*
// @icon         https://www.google.com/s2/favicons?domain=crazygames.com
// @grant        none
// @license      Proprietary © 2025 pug - All rights reserved.
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534075/%F0%9F%8C%B8%20Hello%20Kitty%20FA%20Unlocker%20~%20Ultimate%20Kawaii%20Edition%20%F0%9F%8C%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/534075/%F0%9F%8C%B8%20Hello%20Kitty%20FA%20Unlocker%20~%20Ultimate%20Kawaii%20Edition%20%F0%9F%8C%B8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ======================= CONFIGURATION =======================
    let introShown = false;
    let unlockAllEnabled = 'yes';    // 'yes' or 'no'
    let clanTagEnabled = 'yes';      // 'yes' or 'no'
    let glovesEnabled = 'yes';       // 'yes' or 'no'
    let charactersEnabled = 'yes';   // 'yes' or 'no'

    // Player Stats
    let statsSpoofEnabled = 'yes';   // 'yes' or 'no'

    // Player Roles
    let roleSpoofEnabled = 'yes';    // 'yes' or 'no'
    const roleStatus = 6;            // 1-10 (see status-tag map below)

    /* Status-to-Tag Map:
       1=[T][C][M], 2=[C][M], 3=[T][M], 4=[T][C],
       5=[M], 6=[C], 9=[DEV] */

    const yourClanData = {
        clanId: 69420666,
        tagName: "PUG",     // CHANGE THIS TO YOUR DESIRED TAG
        tagColor: "00FFCC", // CHANGE THIS TO YOUR PREFERRED HEX COLOR
        clanDescription: "We ragequit professionally.",
        isClanLeader: 1,
    };
    // ===================== END CONFIGURATION =====================

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const input = args[0];

        // Handle role spoofing
        if (roleSpoofEnabled === 'yes' &&
            typeof input === "string" &&
            input.includes("get-account-roles.php")) {
            return new Response(JSON.stringify({
                status: roleStatus,
                msg: "Pug"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Original fetch logic
        if (!input.includes("getaccountinfoWebgl.php")) {
            return originalFetch(...args);
        }

        const response = await originalFetch(...args);
        const cloned = response.clone();
        const text = await cloned.text();

        try {
            const xmlStart = text.indexOf("<?xml");
            const xmlEnd = text.lastIndexOf(">") + 1;
            if (xmlStart === -1 || xmlEnd === -1) return response;

            const xmlContent = text.substring(xmlStart, xmlEnd);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

            // Inject clan data if enabled
            if (clanTagEnabled.toLowerCase() === 'yes') {
                const root = xmlDoc.getElementsByTagName("mainAccountInfo")[0];
                const createTag = (tag, value) => {
                    const el = xmlDoc.createElement(tag);
                    el.textContent = value;
                    return el;
                };

                root.appendChild(createTag("cID", yourClanData.clanId));
                root.appendChild(createTag("cTag", yourClanData.tagName));
                root.appendChild(createTag("cName", yourClanData.clanDescription));
                root.appendChild(createTag("cTagCol", yourClanData.tagColor));
                root.appendChild(createTag("cLeader", yourClanData.isClanLeader));
            }

            // Unlock system
            if (unlockAllEnabled.toLowerCase() === 'yes') {
                // Main item unlocks
                Array.from(xmlDoc.getElementsByTagName("unlocked")).forEach(tag => {
                    tag.textContent = "1";
                });

                // Glove unlocks
                if (glovesEnabled.toLowerCase() === 'yes') {
                    updateTag(xmlDoc, "glovesCamos", Array.from({ length: 66 }, (_, i) => i + 1).join(","));
                }

                // Character skin unlocks
                if (charactersEnabled.toLowerCase() === 'yes') {
                    updateTag(xmlDoc, "characterCamos", Array.from({ length: 9 }, (_, i) => i + 1).join(","));
                }
            }

            // Player stats spoofing
            if (statsSpoofEnabled.toLowerCase() === 'yes') {
                // Currency Spoofing
                updateTag(xmlDoc, "credits", "999999999");
                updateTag(xmlDoc, "gold", "999999");
                updateTag(xmlDoc, "ccTicket", "999");

                // Player Stats Spoofing
                updateTag(xmlDoc, "accountLevel", "150");
                updateTag(xmlDoc, "kills", "9999");
                updateTag(xmlDoc, "deaths", "0");
                updateTag(xmlDoc, "headshots", "5000");
                updateTag(xmlDoc, "assists", "2500");
                updateTag(xmlDoc, "totalWins", "999");
                updateTag(xmlDoc, "totalLosses", "0");
                updateTag(xmlDoc, "competitiveRank", "50");
                updateTag(xmlDoc, "version", "999");
            }

            // Show intro if any feature is enabled
            const enabledSettings = [
                unlockAllEnabled, clanTagEnabled, glovesEnabled,
                charactersEnabled, roleSpoofEnabled, statsSpoofEnabled
            ];
            if (!introShown && enabledSettings.some(setting => setting.toLowerCase() === 'yes')) {
                showHelloKittyIntro();
                introShown = true;
            }

            const modifiedXml = new XMLSerializer().serializeToString(xmlDoc);
            const finalText = text.substring(0, xmlStart) + modifiedXml + text.substring(xmlEnd);

            return new Response(finalText, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        } catch (e) {
            console.error("[Hack] Error:", e);
            return response;
        }
    };

    // Intercept XMLHttpRequest
    if (roleSpoofEnabled === 'yes') {
        const originalXHR = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes("get-account-roles.php")) {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        const fakeResponse = JSON.stringify({
                            status: roleStatus,
                            msg: "Pug"
                        });
                        Object.defineProperty(this, "responseText", { get: () => fakeResponse });
                        Object.defineProperty(this, "response", { get: () => fakeResponse });
                    }
                });
            }
            return originalXHR.apply(this, arguments);
        };
    }

    function updateTag(xmlDoc, tag, value) {
        let el = xmlDoc.getElementsByTagName(tag)[0];
        if (!el) {
            el = xmlDoc.createElement(tag);
            xmlDoc.documentElement.querySelector("mainAccountInfo")?.appendChild(el);
        }
        el.textContent = value;
    }

    // ======================== HELLO KITTY INTRO ========================
    function showHelloKittyIntro() {
        const initIntro = () => {
            // Hello Kitty Color Scheme
            const themeColors = {
                pink: "#FF99CC",
                white: "#FFFFFF",
                accent: "#FF3366",
                background: "linear-gradient(135deg, #FF99CC 0%, #FFFFFF 50%, #FF99CC 100%)"
            };

            // Create Intro overlay
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: 999999,
                background: themeColors.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.8s ease-out forwards'
            });

            // Main content container
            const content = document.createElement('div');
            Object.assign(content.style, {
                position: 'relative',
                padding: '40px',
                background: themeColors.white,
                borderRadius: '30px',
                boxShadow: `0 0 40px ${themeColors.pink}80`,
                textAlign: 'center',
                transform: 'scale(0.9)',
                animation: 'popIn 0.5s 0.3s ease-out forwards'
            });

            // Animated title
            const title = document.createElement('div');
            title.innerHTML = `
                <div class="hello-kitty-theme">
                    <div class="title-container">
                        <h1 class="main-title">HelloKitty Cheat Injected! ★</h1>
                        <div class="subtitle">~ Kawaii Mods Activated ~</div>
                        <div class="kitty-divider">♡⋆⁺₊⋆ ♡⋆⁺₊⋆ ♡</div>
                        ${roleSpoofEnabled === 'yes' ? `
                        <div class="role-status">
                            Kawaii Tag: [${getTagFromStatus(roleStatus)}]
                            <span class="status-indicator">♡⁺</span>
                        </div>` : ''}
                        ${statsSpoofEnabled === 'yes' ? `
                        <div class="stats-status">
                            ♡⁺₊⋆ ~ Cute Stats ~ ♡⋆⁺₊
                        </div>` : ''}
                        <div class="tag-display">
                            [ ${yourClanData.tagName} ]
                            <span class="bow-icon">🎀</span>
                        </div>
                        <div class="unlock-message">(っ◕‿◕)っ ♥ All Cute Items Unlocked! ♥</div>
                    </div>
                </div>
            `;

            // Continue button
            const continueBtn = document.createElement('button');
            continueBtn.innerHTML = 'CLICK TO START ～(´▽｀)';
            Object.assign(continueBtn.style, {
                padding: '15px 40px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: themeColors.pink,
                color: themeColors.white,
                border: `4px solid ${themeColors.accent}`,
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                marginTop: '30px'
            });

            // Button hover effects
            continueBtn.addEventListener('mouseenter', () => {
                continueBtn.style.transform = 'scale(1.1) rotate(3deg)';
                continueBtn.style.background = themeColors.accent;
                continueBtn.style.boxShadow = `0 0 30px ${themeColors.pink}`;
            });

            continueBtn.addEventListener('mouseleave', () => {
                continueBtn.style.transform = 'scale(1) rotate(0deg)';
                continueBtn.style.background = themeColors.pink;
                continueBtn.style.boxShadow = 'none';
            });

            // Button click handler
            continueBtn.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.8s ease-out forwards';
                setTimeout(() => {
                    overlay.remove();
                    style.remove();
                }, 800);
            });

            // Animated hearts
            const createHearts = () => {
                const heartContainer = document.createElement('div');
                heartContainer.style.position = 'absolute';
                heartContainer.style.width = '100%';
                heartContainer.style.height = '100%';
                heartContainer.style.top = '0';
                heartContainer.style.left = '0';
                heartContainer.style.pointerEvents = 'none';

                for (let i = 0; i < 12; i++) {
                    const heart = document.createElement('div');
                    heart.innerHTML = '♡';
                    heart.style.position = 'absolute';
                    heart.style.animation = `floatHeart ${2 + i/2}s infinite`;
                    heart.style.fontSize = `${20 + i}px`;
                    heart.style.opacity = '0.7';
                    heartContainer.appendChild(heart);
                }
                return heartContainer;
            };

            // Style injection
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                @keyframes fadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; transform: scale(1.2); }
                }

                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes floatHeart {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }

                .hello-kitty-theme {
                    padding: 30px;
                    border-radius: 20px;
                }

                .main-title {
                    font: 900 3rem 'Comic Sans MS', cursive;
                    color: ${themeColors.accent};
                    margin: 0 0 15px 0;
                    text-shadow: 2px 2px 0 ${themeColors.white};
                    animation: titleBounce 1s infinite;
                }

                @keyframes titleBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .subtitle {
                    font: italic 1.2em 'Comic Sans MS', cursive;
                    color: ${themeColors.pink};
                    margin-bottom: 20px;
                }

                .kitty-divider {
                    font-size: 1.5em;
                    color: ${themeColors.accent};
                    margin: 20px 0;
                    animation: sparkle 1s infinite;
                }

                @keyframes sparkle {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; text-shadow: 0 0 10px ${themeColors.white}; }
                    100% { opacity: 0.8; }
                }

                .role-status {
                    font: bold 1.4em 'Comic Sans MS', cursive;
                    color: ${themeColors.accent};
                    margin: 15px 0;
                    padding: 10px;
                    background: ${themeColors.white}90;
                    border-radius: 10px;
                }

                .status-indicator {
                    animation: spin 1s infinite linear;
                }

                .stats-status {
                    font: bold 1.2em 'Comic Sans MS', cursive;
                    color: ${themeColors.accent};
                    margin: 15px 0;
                    padding: 8px;
                    background: ${themeColors.white}90;
                    border-radius: 8px;
                    animation: glow 1s infinite alternate;
                }

                @keyframes glow {
                    from { text-shadow: 0 0 5px ${themeColors.accent}; }
                    to { text-shadow: 0 0 15px ${themeColors.accent}; }
                }

                .tag-display {
                    font: 900 2em 'Comic Sans MS', cursive;
                    color: ${themeColors.accent};
                    padding: 15px;
                    margin: 20px 0;
                    background: ${themeColors.white};
                    border: 3px dashed ${themeColors.pink};
                    border-radius: 15px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }

                .bow-icon {
                    font-size: 1.5em;
                    animation: spin 3s infinite linear;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .unlock-message {
                    font: 1.1em 'Comic Sans MS', cursive;
                    color: ${themeColors.accent};
                    margin-top: 20px;
                }
            `;

            // Assemble components
            content.appendChild(title);
            content.appendChild(continueBtn);
            overlay.appendChild(createHearts());
            overlay.appendChild(content);
            document.head.appendChild(style);
            document.body.appendChild(overlay);
        };

        // Helper function for status mapping
        function getTagFromStatus(status) {
            const tagMap = {
                1: 'T C M', 2: 'C M', 3: 'T M',
                4: 'T C', 5: 'M', 6: 'C', 9: 'DEV'
            };
            return tagMap[status] || 'Unknown';
        }

        // DOM readiness check
        if (document.body) initIntro();
        else document.addEventListener('DOMContentLoaded', initIntro);
    }
})();