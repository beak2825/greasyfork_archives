// ==UserScript==
// @name         MusicBrainz: Auto login MusicBrainz ISRC importers
// @namespace    https://musicbrainz.org/user/chaban
// @version      2.1.2
// @description  Attempts to login on MusicBrainz ISRC submission sites like ISRC Hunt or MagicISRC and automatically handle OAuth authorization
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        https://*.musicbrainz.org/oauth2/authorize*
// @match        https://magicisrc.kepstin.ca/*
// @match        https://magicisrc-beta.kepstin.ca/
// @match        https://isrchunt.com/*
// @exclude      https://magicisrc.kepstin.ca/?code=*
// @exclude      https://magicisrc.kepstin.ca/?state=*
// @exclude      https://magicisrc-beta.kepstin.ca/?code=*
// @exclude      https://magicisrc-beta.kepstin.ca/?state=*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536881/MusicBrainz%3A%20Auto%20login%20MusicBrainz%20ISRC%20importers.user.js
// @updateURL https://update.greasyfork.org/scripts/536881/MusicBrainz%3A%20Auto%20login%20MusicBrainz%20ISRC%20importers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function for logging messages to the console, useful for debugging.
    function log(message) {
        console.log(`[MusicBrainz Auto Login] ${message}`);
    }

    // --- Configuration for Trusted Clients ---
    // Defines trusted client IDs, their associated redirect URI base URLs, and expected OAuth scopes for validation.
    const trustedClients = {
        'oxqZoCJWy9BQXgS7UTikeA': { // MagicISRC main site
            redirectUriBase: 'https://magicisrc.kepstin.ca',
            expectedScopes: ['profile', 'submit_isrc'],
            name: 'MagicISRC (main)'
        },
        'flI-ayzX2u2pzMWosH27FQ': { // MagicISRC beta site
            redirectUriBase: 'https://magicisrc-beta.kepstin.ca',
            expectedScopes: ['profile', 'submit_isrc'],
            name: 'MagicISRC (beta)'
        },
        'BzRD1-z1sMBfKVnOaJiMLIFL6_7WSaL5': { // ISRC Hunt
            redirectUriBase: 'https://isrchunt.com',
            expectedScopes: ['profile', 'submit_isrc'],
            name: 'ISRCHunt'
        }
    };

    // --- Derived Configuration for Importer Pages ---
    // Extract the unique origins of the trusted ISRC importer sites.
    const trustedImporterOrigins = Object.values(trustedClients)
        .map(client => new URL(client.redirectUriBase).origin + '/')
        .filter((value, index, self) => self.indexOf(value) === index)

    // --- Helper function for Scope Validation ---
    // Checks if the requested scopes exactly match the expected scopes, ignoring order.
    function isValidScope(requestedScopeString, expectedScopes) {
        if (!requestedScopeString) {
            log("Scope validation FAILED: No 'scope' parameter found in URL.");
            return false;
        }

        const requestedScopes = requestedScopeString.split(/[\s+]/).filter(s => s).sort();
        const sortedExpectedScopes = [...expectedScopes].sort(); // Create a copy to avoid modifying original

        if (requestedScopes.length !== sortedExpectedScopes.length) {
            log(`Scope validation FAILED: Length mismatch. Requested: ${requestedScopes.length}, Expected: ${sortedExpectedScopes.length}`);
            return false;
        }

        const allMatch = requestedScopes.every((scope, index) => scope === sortedExpectedScopes[index]);
        if (!allMatch) {
            log(`Scope validation FAILED: Content mismatch. Requested: [${requestedScopes.join(', ')}], Expected: [${sortedExpectedScopes.join(', ')}]`);
        }
        return allMatch;
    }

    // --- Function to handle the MusicBrainz OAuth Authorization Page ---
    // This function attempts to auto-click the 'Allow Access' or 'Confirm' button
    // after validating the requesting client's redirect URI, client ID, and scopes.
    function handleOAuthAuthorizationPage() {
        log('Detected MusicBrainz OAuth authorization page.');

        const urlParams = new URLSearchParams(window.location.search);
        const redirectUri = urlParams.get('redirect_uri');
        const clientId = urlParams.get('client_id');
        const requestedScopeString = urlParams.get('scope');

        let isTrustedClient = false;
        let clientName = 'Unknown';
        let redirectUriOrigin = null;

        try {
            redirectUriOrigin = redirectUri ? new URL(redirectUri).origin : null;

            for (const id in trustedClients) {
                const clientInfo = trustedClients[id];
                const trustedOrigin = new URL(clientInfo.redirectUriBase).origin;

                // Step 1: Validate Client ID and Redirect URI Origin
                if (clientId === id && redirectUriOrigin && redirectUriOrigin === trustedOrigin) {
                    clientName = clientInfo.name;
                    log(`Client ID and Redirect URI Origin matched for: ${clientName}`);

                    // Step 2: Validate Scopes
                    if (isValidScope(requestedScopeString, clientInfo.expectedScopes)) {
                        isTrustedClient = true;
                        log(`Scope validation passed for ${clientName}.`);
                    } else {
                        log(`Final validation FAILED: Scopes did not match for ${clientName}.`);
                    }
                    break;
                }
            }
        } catch (e) {
            log(`Error during OAuth validation: ${e.message}. Script will not auto-confirm.`);
            return;
        }

        if (isTrustedClient) {
            log(`OAuth request is fully validated for trusted client: ${clientName}
                 (Redirect URI Origin: ${redirectUriOrigin}, Client ID: ${clientId || 'N/A'})`);

            const confirmButton = document.querySelector('button[name="confirm.submit"]');
            if (confirmButton) {
                  log(`OAuth confirmation button. Clicking it...`);
                  confirmButton.click();
              } else {
                  log('OAuth confirmation button not found.');
            }
        } else {
            log(`OAuth request is NOT fully validated for auto-confirmation.
                 Detected Redirect URI: ${redirectUri}, Detected Client ID: ${clientId}, Detected Scopes: ${requestedScopeString || 'N/A'}`);
        }
    }

    // --- Function to handle ISRC Importer Login Pages ---
    // This function attempts to automatically initiate the login process
    // on ISRC Hunt or MagicISRC sites.
    function handleISRCImporterLoginPage() {
        log('Detected ISRC importer page.');

        // Attempt to click the login button specific to MagicISRC.
        const magicisrcLoginButton = document.querySelector('button[onclick^="doLogin();"]');
        if (magicisrcLoginButton) {
            log('Found MagicISRC login button with doLogin(). Clicking it...');
            magicisrcLoginButton.click();
        } else {
            log('MagicISRC login button not found.');
        }

        // Attempt to click the login link specific to ISRC Hunt.
        const isrchuntLoginLink = document.querySelector('a[href^="https://musicbrainz.org/oauth2/authorize"]');
        if (isrchuntLoginLink) {
            log(`Found ISRC Hunt login link. Clicking it...`);
            isrchuntLoginLink.click();
        } else {
              log('ISRC Hunt login link not found.');
        }
    }

    // --- Main Execution Flow ---
    // Determines which handler function to call based on the current URL.
    const currentUrl = window.location.href;

    if (currentUrl.includes('musicbrainz.org/oauth2/authorize')) {
        handleOAuthAuthorizationPage();
    } else if (trustedImporterOrigins.some(origin => currentUrl.startsWith(origin))) {
        handleISRCImporterLoginPage();
    } else {
        log('Current URL does not match any known handler.');
    }

})();
