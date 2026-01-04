// ==UserScript==
// @name         Keycloak cross-domain impersonation
// @namespace    http://tampermonkey.net/
// @version      2025-06-11+2
// @description  Automates the cookie transfer for Keycloak impersonation across admin and public domains.
// @author       bugy (Yaroslav Shepilov)
// @match        https://search-auth.holidu.cloud/admin/master/console/*
// @match        https://auth.holidu.com/realms/guest/account
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539082/Keycloak%20cross-domain%20impersonation.user.js
// @updateURL https://update.greasyfork.org/scripts/539082/Keycloak%20cross-domain%20impersonation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cookieStorageKey = 'keycloakImpersonationCookies';
    const publicHost = 'auth.holidu.com';
    const debugEnabled = true;

    function debugLog(text, args) {
        if (debugEnabled) {
            if (args) {
                console.log('DEBUG ' + text, args);
            } else {
                console.log('DEBUG ' + text);
            }
        }
    }

    function deleteCookie(name, callback) {
        GM_cookie.delete({ name: name }, function(error) {
            if (error) {
                console.error('Cannot delete cookie ' + name, error);
            } else {
                debugLog(`Cookie ${name} deleted successfully`);
            }

            if (callback) {
                callback()
            }
        })
    }

    // On the public domain, check for the stored impersonation cookie
    if (window.location.hostname === publicHost) {
        const storedCookies = GM_getValue(cookieStorageKey);

        if (storedCookies) {
            debugLog('Some impersonation cookies are found')

            // let's make cookies expire soon not to get leaked
            const expirationDate = (new Date().getTime() / 1000) + 60

            deleteCookie('AUTH_SESSION_ID_LEGACY')
            deleteCookie('AUTH_SESSION_ID')


            const cookiesToSet = JSON.parse(storedCookies);
            const finishedCookies = []
            cookiesToSet.forEach(cookie => {
                const { name, value, path, secure, httpOnly } = cookie;

                deleteCookie('AUTH_SESSION_ID', () => {
                    GM_cookie('set', {
                        name,
                        value,
                        path,
                        domain: publicHost,
                        secure,
                        httpOnly,
                        expirationDate
                    }, function(error) {
                        finishedCookies.push(name)
                        if (error) {
                            console.error('Error setting cookie '+name+':', error);
                        } else {
                            debugLog('Set cookie', cookie);
                        }

                        if (finishedCookies.length  === cookiesToSet.length) {
                            debugLog('Reloading page')
                            window.location.reload();
                        }
                    });
                })

            });

            // Clean up the stored cookie to prevent reuse
            GM_deleteValue(cookieStorageKey);
        }
    }

    function parseHeadersString(headersString) {
        const headers = [];
        if (!headersString) {
            return headers;
        }
        // Split by newline and filter out empty lines
        headersString.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                // Find the first colon to separate name and value
                const separatorIndex = trimmedLine.indexOf(':');
                if (separatorIndex > -1) {
                    const name = trimmedLine.substring(0, separatorIndex).trim();
                    const value = trimmedLine.substring(separatorIndex + 1).trim();
                    headers.push([name, value]);
                }
            }
        });
        return headers;
    }

    function parseSetCookie(setCookieString) {
        const cookie = {
            name: '',
            value: '',
            path: '/', // Default value as per RFC 6265
            secure: false,
            httpOnly: false,
            expirationDate: null // Default to no expiration
        };

        if (!setCookieString || typeof setCookieString !== 'string') {
            console.warn("Invalid setCookieString provided:", setCookieString);
            return cookie;
        }

        const parts = setCookieString.split(';');

        // The first part is always 'name=value'
        const nameValuePart = parts[0].trim();
        const eqIndex = nameValuePart.indexOf('=');

        if (eqIndex > -1) {
            cookie.name = nameValuePart.substring(0, eqIndex);
            cookie.value = nameValuePart.substring(eqIndex + 1);
        } else {
            // Handle cases where there might be a malformed cookie or just a name (uncommon)
            cookie.name = nameValuePart;
            cookie.value = '';
        }

        // Process other attributes
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i].trim();
            const lowerCasePart = part.toLowerCase();

            if (lowerCasePart === 'secure') {
                cookie.secure = true;
            } else if (lowerCasePart === 'httponly') {
                cookie.httpOnly = true;
            } else if (lowerCasePart.startsWith('path=')) {
                cookie.path = part.substring('path='.length);
            } else if (lowerCasePart.startsWith('expires=')) {
                try {
                    // 'Expires' attribute defines an absolute expiration date
                    cookie.expirationDate = new Date(part.substring('expires='.length));
                } catch (e) {
                    console.warn(`[parseSetCookie] Error parsing Expires date: ${part.substring('expires='.length)}`, e);
                }
            }
        }

        return cookie;
    }

    const originalFetch = window.fetch;
    const root = unsafeWindow || window;
    root.fetch = function(...args) {
        const [url, options] = args;

        // Check if the URL matches your pattern for interception
        if ((url instanceof URL) && url.href.endsWith('/impersonation') && options.method === 'POST') {
            debugLog(`[Fetch Interceptor] Intercepted fetch call for: ${url}`);

            // Extract headers and body from 'options'
            const method = options?.method || 'GET';
            const headers = options?.headers || {};
            const body = options?.body || null;

            // You would then use GM_xmlhttpRequest here
            // Note: Converting fetch options to GM_xmlhttpRequest parameters can be complex
            // for all edge cases (e.g., streaming bodies, different responseTypes).
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    //method: method,
                    //url: url, // Or a different URL if forwarding
                    headers: Object.fromEntries(headers.entries()),
                    //data: body,
                    // responseType and other GM options would need to be considered based on original fetch options
                    method: method,
                    url: url,
                    data: {"user":"20652dce-ca11-4629-abb9-e25c43011688","realm":"guest"},
                    // Synchronous mode is deprecated and should not be used.
                    responseType: 'json', // Can be 'json', 'blob', 'arraybuffer' etc.

                    onload: (gmResponse) => {
                        debugLog(`[Fetch Interceptor] GM_xmlhttpRequest finished for fetched URL: ${url}`);
                        // Reconstruct a Response object to return to the original fetch caller
                        // This is a simplified reconstruction.

                        const parsedHeaders = parseHeadersString(gmResponse.responseHeaders);

                        const response = new Response(gmResponse.responseText, {
                            status: gmResponse.status,
                            statusText: gmResponse.statusText,
                            headers: new Headers(parsedHeaders)
                        });

                        const cookies = []

                        parsedHeaders.forEach(cookieEntry => {
                            if (cookieEntry[0] === 'set-cookie') {
                                const cookie = parseSetCookie(cookieEntry[1] )
                                debugLog('Saved impersonation cookie', cookie)
                                cookies.push(cookie);
                            }
                        })

                        if (cookies.length > 0) {
                            debugLog("[Fetch Interceptor] GM Response Set-Cookie from fetch:", cookies);
                        } else {
                            debugLog("[Fetch Interceptor] No 'Set-Cookie' headers found in GM fetch response.");
                        }
                        GM_setValue(cookieStorageKey, JSON.stringify(cookies));

                        resolve(response);

                    },
                    onerror: (gmError) => {
                        console.error(`[Fetch Interceptor] GM_xmlhttpRequest error for fetch ${url}:`, gmError);
                        reject(new TypeError('Network request failed via interceptor'));
                    },
                    ontimeout: (gmTimeout) => {
                        console.warn(`[Fetch Interceptor] GM_xmlhttpRequest timeout for fetch ${url}:`, gmTimeout);
                        reject(new TypeError('Network request timed out via interceptor'));
                    }
                });
            });
        } else {
            // If not intercepted, call the original fetch
            return originalFetch.apply(this, args);
        }
    };


})();