// ==UserScript==
// @name         GGather Bookmark Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept and log URL bookmark requests in GGather
// @author       dudematthew
// @match        https://web.ggather.com/*
// @match        https://core.ggather.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523032/GGather%20Bookmark%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/523032/GGather%20Bookmark%20Fixer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Styling for console logs
    const logStyle = {
        main: 'font-size: 16px; color: #4CAF50; font-weight: bold; padding: 5px; background: #f0f0f0;',
        url: 'font-size: 14px; color: #2196F3; padding: 3px; background: #f8f8f8;',
        warning: 'font-size: 14px; color: #FF5722; font-weight: bold; padding: 3px;',
        error: 'font-size: 14px; color: #FF0000; font-weight: bold; padding: 3px;',
        debug: 'font-size: 13px; color: #9C27B0; padding: 2px;'
    };

    function debugLog(title, data = null, style = logStyle.debug) {
        console.log('%c[DEBUG] ' + title, style);
        if (data) {
            console.log('Data:', data);
            if (data instanceof Error) {
                console.log('Stack:', data.stack);
            }
        }
    }

    // Store original XHR methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Track request URLs, methods and metadata
    const requestUrls = new WeakMap();
    const requestMethods = new WeakMap();

    // Function to extract metadata
    async function extractMetadata(targetUrl) {
        debugLog('Fetching metadata for', targetUrl);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: targetUrl,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'User-Agent': navigator.userAgent
                },
                onload: function (response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // 1. Find best thumbnail first
                        let thumbnail =
                            doc.querySelector('meta[property="og:image"]')?.content ||
                            doc.querySelector('meta[name="twitter:image"]')?.content ||
                            doc.querySelector('link[rel*="icon"][sizes="192x192"]')?.href ||
                            doc.querySelector('link[rel*="icon"][sizes="128x128"]')?.href ||
                            Array.from(doc.querySelectorAll('img'))
                                .find(img => img.width > 100 && img.height > 100)?.src ||
                            null;

                        // 2. Get title
                        const title = doc.querySelector('title')?.textContent ||
                            doc.querySelector('meta[property="og:title"]')?.content ||
                            null;

                        // 3. Get description
                        const description = doc.querySelector('meta[name="description"]')?.content ||
                            doc.querySelector('meta[property="og:description"]')?.content ||
                            null;

                        // Collect additional metadata
                        const html_images = Array.from(doc.querySelectorAll('img')).map(img => ({
                            src: img.src,
                            width: img.width,
                            height: img.height,
                            alt: img.alt
                        }));

                        const html_icons = Array.from(doc.querySelectorAll('link[rel*="icon"]')).map(icon => ({
                            href: icon.href,
                            rel: icon.rel,
                            sizes: icon.sizes?.value
                        }));

                        const html_og = Array.from(doc.querySelectorAll('meta[property^="og:"]')).map(og => ({
                            property: og.getAttribute('property'),
                            content: og.content
                        }));

                        const html_meta = Array.from(doc.querySelectorAll('meta')).map(meta => ({
                            name: meta.name,
                            content: meta.content
                        }));

                        const metadata = {
                            url: targetUrl,
                            thumbnail: thumbnail,  // Thumbnail first
                            title: title,         // Title second
                            description: description,  // Description third
                            html_images: html_images,
                            html_icons: html_icons,
                            html_og: html_og,
                            html_meta: html_meta,
                            headers: response.responseHeaders,
                            is_webpage: true
                        };

                        debugLog('Extracted metadata', metadata);
                        resolve(metadata);
                    } catch (e) {
                        debugLog('Failed to extract metadata', e);
                        reject(e);
                    }
                },
                onerror: function (error) {
                    debugLog('Failed to fetch URL', error);
                    reject(error);
                }
            });
        });
    }

    // Add this at the top with other constants
    let lastSuccessfulEditRequest = null;

    // Remove the CSRF token capture from XHR since we can't access those headers
    XMLHttpRequest.prototype.open = function (method, url) {
        requestUrls.set(this, url);
        requestMethods.set(this, method);
        debugLog('XHR Open', {
            method,
            url,
            isBookmark: url.includes('urlbookmark'),
            isAuth: url.includes('auth') || url.includes('login')
        });
        return originalOpen.apply(this, arguments);
    };

    // Function to find Vue instance root
    function findVueRoot() {
        // Look for Vue instance in common root element IDs
        const rootElements = ['#app', '#__nuxt', '#__layout', '#root'];
        for (const selector of rootElements) {
            const el = document.querySelector(selector);
            if (el && el.__vue__) {
                return el.__vue__.$root;
            }
        }

        // Fallback: search all elements for Vue instance
        const elements = document.getElementsByTagName('*');
        for (const el of elements) {
            if (el.__vue__) {
                return el.__vue__.$root;
            }
        }

        return null;
    }

    // Modify the callOriginalUpdate function to handle thumbnails
    async function callOriginalUpdate(bookmarkId, metadata) {
        debugLog('🎯 Starting update attempt', { bookmarkId, metadata }, logStyle.warning);

        const saveurl = Array.from(document.querySelectorAll('*'))
            .find(el => el.__vue__?.$options?.name === 'saveurl')?.__vue__;

        if (!saveurl) {
            debugLog('❌ Could not find saveurl component', null, logStyle.error);
            return;
        }

        // Extract metadata from our fetch
        const urldata = await extractMetadata(metadata.url);
        debugLog('Extracted metadata for update', urldata);

        try {
            // First set the URL and trigger validation
            saveurl.url = metadata.url;
            await saveurl.validateBasicURL();

            // Update thumbnail first
            if (urldata.thumbnail) {
                debugLog('Updating thumbnail...');
                try {
                    await saveurl.$axios({
                        url: saveurl.$store.state.api + "/edit-urlbookmark-thumb/",
                        method: "post",
                        data: {
                            url: metadata.url,
                            image_url: urldata.thumbnail,
                            thumbnail_worn: 'self'
                        }
                    });

                    // Update the store after successful upload
                    saveurl.$store.commit("eventSaveThumbChange", {
                        thumbnail: urldata.thumbnail,
                        thumbnail_worn: 'self'
                    });

                    debugLog('✅ Thumbnail update completed');
                    // Add a small delay after thumbnail update
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (e) {
                    debugLog('❌ Failed to update thumbnail', e, logStyle.error);
                }
            }

            // Then update title
            if (urldata.title) {
                debugLog('Updating title...');
                // Set title in urlbookmark
                saveurl.urlbookmark = {
                    pk: bookmarkId,
                    url: metadata.url,
                    title: urldata.title,
                    rating: metadata.rating,
                    owner_notes: metadata.owner_notes
                };
                await saveurl.editURLBookmark('title');
                await new Promise(resolve => setTimeout(resolve, 1000));
                debugLog('Title update completed');
            }

            // Finally update description
            if (urldata.description) {
                debugLog('Updating description...');
                // Set description in urlbookmark
                saveurl.urlbookmark = {
                    ...saveurl.urlbookmark,  // Keep previous data
                    description: urldata.description
                };
                await saveurl.editURLBookmark('description');
                debugLog('Description update completed');
            }

            debugLog('✅ All updates completed', {
                thumbnail: urldata.thumbnail,
                title: urldata.title,
                description: urldata.description
            }, logStyle.success);

        } catch (e) {
            debugLog('❌ Update failed', e, logStyle.error);
            debugLog('Component state at failure', {
                url: saveurl.url,
                urlbookmark: saveurl.urlbookmark,
                methods: Object.keys(saveurl.$options.methods)
            });
        }
    }

    // Update the bookmark creation handler to use the original update function
    XMLHttpRequest.prototype.send = async function (data) {
        const url = requestUrls.get(this);
        const method = requestMethods.get(this);

        if (url.includes('edit-urlbookmark-thumb')) {
            debugLog('🖼️ Thumbnail request intercepted', {
                url,
                method,
                data: data instanceof FormData ?
                    Object.fromEntries(data.entries()) :
                    data,
                stack: new Error().stack  // This will show us the call stack
            }, logStyle.warning);
        }

        // Detailed logging for thumbnail requests
        if (url.includes('thumb')) {
            debugLog('🖼️ Thumbnail request intercepted', {
                url,
                method,
                data: data instanceof FormData ?
                    Object.fromEntries(data.entries()) :
                    data,
                headers: Array.from(arguments)
            });

            // Store successful thumbnail requests for analysis
            this.addEventListener('load', function () {
                if (this.status === 200) {
                    debugLog('🖼️ Successful thumbnail request', {
                        response: this.responseText,
                        response: this.responseText,
                        headers: this.getAllResponseHeaders()
                    });
                }
            });
        }

        // Log all requests related to thumbnails or bookmarks
        if (url.includes('thumb') || url.includes('bookmark')) {
            debugLog('Request intercepted', {
                url,
                method,
                data,
                headers: this.getAllResponseHeaders?.(),
                requestHeaders: Array.from(arguments)
            });
        }

        try {
            const urlObj = new URL(url);

            // Handle metadata requests (keep this part)
            if (urlObj.pathname === '/api/get-urldata/') {
                const targetUrl = urlObj.searchParams.get('url');
                debugLog('URL data request for', targetUrl);

                // Extract metadata
                const urldata = await extractMetadata(targetUrl);
                debugLog('Extracted metadata', urldata);

                // Create response
                const mockResponse = {
                    urldata: urldata
                };

                debugLog('Sending URL data response', mockResponse);

                // Set response properties
                Object.defineProperties(this, {
                    'status': { value: 200, writable: true },
                    'statusText': { value: 'OK', writable: true },
                    'responseText': { value: JSON.stringify(mockResponse), writable: true },
                    'readyState': { value: 4, writable: true },
                    'response': { value: JSON.stringify(mockResponse), writable: true }
                });

                // Set headers
                this.getAllResponseHeaders = () => 'content-type: application/json';
                this.getResponseHeader = (name) => name.toLowerCase() === 'content-type' ? 'application/json' : null;

                // Trigger events
                setTimeout(() => {
                    const readyStateEvent = new Event('readystatechange');
                    const loadEvent = new Event('load');
                    this.dispatchEvent(readyStateEvent);
                    this.dispatchEvent(loadEvent);
                    debugLog('URL data response sent');
                }, 0);

                return;
            }

            // Handle successful bookmark creation
            if (urlObj.pathname === '/api/add-urlbookmark/') {
                this.addEventListener('load', function () {
                    if (this.status === 200) {
                        try {
                            const response = JSON.parse(this.responseText);
                            debugLog('Bookmark saved', response);
                            // Use original update function instead of our own
                            callOriginalUpdate(response.pk, response);
                        } catch (e) {
                            debugLog('Failed to handle save response', e);
                        }
                    }
                });
            }

            // Capture edit requests only
            if (url.includes('edit-urlbookmark') || url.includes('urlbookmark') && (method === 'PATCH' || method === 'PUT')) {
                const headers = {};
                const originalSetRequestHeader = this.setRequestHeader;

                // Capture headers being set
                this.setRequestHeader = function (name, value) {
                    headers[name] = value;
                    return originalSetRequestHeader.apply(this, arguments);
                };

                debugLog('Edit request detected', {
                    url,
                    method,
                    headers,
                    data
                });

                // Add response handler
                this.addEventListener('load', function () {
                    if (this.status === 200) {
                        lastSuccessfulEditRequest = {
                            url,
                            method,
                            headers,
                            data,
                            response: this.responseText
                        };
                        debugLog('Captured successful edit request', lastSuccessfulEditRequest);
                    }
                });
            }

            return originalSend.apply(this, arguments);
        } catch (e) {
            debugLog('Error in send override', e);
            return originalSend.apply(this, arguments);
        }
    };

    // Also intercept fetch for auth requests
    const originalFetch = window.fetch;
    window.fetch = async function (url, options) {
        if (typeof url === 'string' && (url.includes('auth') || url.includes('login'))) {
            debugLog('Fetch auth request intercepted', {
                url,
                options
            });

            const response = await originalFetch.apply(this, arguments);
            const clonedResponse = response.clone();

            try {
                const data = await clonedResponse.json();
                debugLog('Fetch auth response', {
                    url,
                    data,
                    headers: Array.from(response.headers.entries())
                });
            } catch (e) {
                debugLog('Failed to parse fetch auth response', e);
            }

            return response;
        }
        return originalFetch.apply(this, arguments);
    };

    debugLog('GGather Bookmark Fixer is active', {
        version: GM_info.script.version,
        lastUpdate: new Date().toISOString()
    }, logStyle.main);

    // Add this function to find Nuxt/Axios config
    function findAxiosConfig() {
        // Try to find Nuxt instance
        const nuxtApp = window?.__NUXT__ || window?.$nuxt;
        if (nuxtApp) {
            debugLog('Found Nuxt app', nuxtApp);

            // Try to find Axios config
            const axiosConfig = nuxtApp?.$axios?.defaults ||
                nuxtApp?.context?.$axios?.defaults ||
                window?.$axios?.defaults;

            if (axiosConfig) {
                debugLog('Found Axios config', axiosConfig);
                return axiosConfig;
            }
        }

        // Try to find Vue instance and its Axios config
        const vueRoot = findVueRoot();
        if (vueRoot) {
            const axiosConfig = vueRoot?.$axios?.defaults ||
                vueRoot?.$options?.axios?.defaults;
            if (axiosConfig) {
                debugLog('Found Axios config in Vue root', axiosConfig);
                return axiosConfig;
            }
        }

        return null;
    }

    // Call this when page loads
    document.addEventListener('DOMContentLoaded', () => {
        const axiosConfig = findAxiosConfig();
        if (axiosConfig) {
            debugLog('Will use these Axios defaults for our requests', axiosConfig);
        }
    });

})();
