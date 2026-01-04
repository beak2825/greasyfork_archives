// ==UserScript==
// @name         Communauto Token Bridge
// @namespace    https://example.com
// @version      1.2
// @description  Extract Communauto tokens and provide them to the Flexfinder page
// @match        https://*.client.reservauto.net/*
// @match        https://*.reservauto.net/*
// @match        file:///*
// @match        http://localhost:*/*
// @match        https://your-future-domain.com/*
// @match        https://*.flexfinder.ca
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530915/Communauto%20Token%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/530915/Communauto%20Token%20Bridge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Script version - IMPORTANT: update this when making changes to match REQUIRED_VERSION in AuthManager.js
    const SCRIPT_VERSION = '1.2';
    
    const OIDC_KEY = 'oidc.user:https://foidentityprovider.reservauto.net:CustomerSpaceClient';
    const isCommunautoDomain = /(^|\.)reservauto\.net$/i.test(window.location.hostname);

    // When on Communauto site
    if (isCommunautoDomain) {
        window.addEventListener('load', () => {
            try {
                const tokens = localStorage.getItem(OIDC_KEY);
                if (tokens) {
                    GM_setValue('communautoTokens', tokens);

                    // Store refresh token separately for easier access
                    try {
                        const parsedTokens = JSON.parse(tokens);
                        if (parsedTokens.refresh_token) {
                            GM_setValue('communautoRefreshToken', parsedTokens.refresh_token);
                            console.log('[Communauto Bridge] Refresh token saved');
                        }
                    } catch (e) {
                        console.error('[Communauto Bridge] Error parsing tokens:', e);
                    }

                    console.log("Tokens found", tokens);
                    console.log('[Communauto Bridge] Tokens saved');

                    // Start polling for acknowledgment
                    const checkAcknowledgment = setInterval(() => {
                        const acknowledged = GM_getValue('tokensAcknowledged', false);
                        if (acknowledged) {
                            console.log('[Communauto Bridge] Tokens acknowledged by Flexfinder');

                            // Show success message
                            const message = document.createElement('div');
                            message.style.cssText = `
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                background: #4CAF50;
                                color: white;
                                padding: 15px;
                                border-radius: 4px;
                                z-index: 9999;
                            `;
                            message.textContent = 'Tokens successfully received by Flexfinder!';
                            document.body.appendChild(message);

                            // Clear the acknowledgment
                            GM_setValue('tokensAcknowledged', false);

                            // Close after delay
                            setTimeout(() => {
                                window.close();
                            }, 3000);

                            clearInterval(checkAcknowledgment);
                        }
                    }, 1000);
                }
            } catch (e) {
                console.error('[Communauto Bridge] Error:', e);
            }
        });
    }
    // When on Flexfinder page
    else {
        // Expose script version to the host application
        unsafeWindow.getBridgeVersion = function() {
            return SCRIPT_VERSION;
        };
        
        unsafeWindow.retrieveCommunautoTokens = async function() {
            try {
                const raw = await GM_getValue('communautoTokens', null);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                console.error('[Communauto Bridge] Error:', e);
                return null;
            }
        };

        // Add function to acknowledge token receipt
        unsafeWindow.acknowledgeCommunautoTokens = function() {
            GM_setValue('tokensAcknowledged', true);
        };

        // Add function to get refresh token
        unsafeWindow.getRefreshToken = async function() {
            return GM_getValue('communautoRefreshToken', null);
        };

        // Add function to update stored tokens after a refresh
        unsafeWindow.updateCommunautoTokens = function(newTokens) {
            try {
                if (newTokens) {
                    // Store full token object
                    GM_setValue('communautoTokens', JSON.stringify(newTokens));

                    // Store refresh token separately
                    if (newTokens.refresh_token) {
                        GM_setValue('communautoRefreshToken', newTokens.refresh_token);
                    }

                    console.log('[Communauto Bridge] Tokens updated after refresh');
                    return true;
                }
            } catch (e) {
                console.error('[Communauto Bridge] Error updating tokens:', e);
            }
            return false;
        };
    }
})();
