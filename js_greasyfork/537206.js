// ==UserScript==
// @name         JanitorAI Character Card Scraper
// @version      5.3
// @description  Extract character card with "T" key (WHILE IN CHAT PAGE) and save as .txt, .png, or .json (proxy required)
// @match        https://janitorai.com/*
// @icon         https://images.dwncdn.net/images/t_app-icon-l/p/46413ec0-e1d8-4eab-a0bc-67eadabb2604/3920235030/janitor-ai-logo
// @grant        none
// @namespace    https://sleazyfork.org/en/scripts/537206-janitorai-character-card-scraper
// @inject-into  auto
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537206/JanitorAI%20Character%20Card%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/537206/JanitorAI%20Character%20Card%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runInPageContext() {

        "use strict";

        /* ============================
           ==      VARIABLES        ==
           ============================ */
        let hasInitialized = false;
        let viewActive = false;
        let shouldInterceptNext = false;
        let networkInterceptActive = false;
        let exportFormat = null;
        let chatData = null;
        let currentTab = sessionStorage.getItem("lastActiveTab") || "export";
        let useChatNameForName;
        if (localStorage.getItem("useChatNameForName") === null) {
            useChatNameForName = true; // default for first-time users
            localStorage.setItem("useChatNameForName", "true");
        } else {
            useChatNameForName = localStorage.getItem("useChatNameForName") === "true";
        }

        let applyCharToken;
        if (localStorage.getItem("applyCharToken") === null) {
            applyCharToken = false; // default for first-time users
            localStorage.setItem("applyCharToken", "false");
        } else {
            applyCharToken = localStorage.getItem("applyCharToken") !== "false";
        }

        let alwaysShowOpenerOnDesktop;
        if (localStorage.getItem("alwaysShowOpenerOnDesktop") === null) {
            alwaysShowOpenerOnDesktop = true; // default for first-time users
            localStorage.setItem("alwaysShowOpenerOnDesktop", "true");
        } else {
            alwaysShowOpenerOnDesktop = localStorage.getItem("alwaysShowOpenerOnDesktop") === "true";
        }

        let triggerKey = localStorage.getItem("triggerKey") || "t";
        let filenameTemplate =
            localStorage.getItem("filenameTemplateDraft") ||
            localStorage.getItem("filenameTemplate") ||
            "{name}";
        // Migration: Update old default for existing users
        const storedSavePath = localStorage.getItem("savePathTemplate");
        if (storedSavePath === "images/{creator}") {
            localStorage.setItem("savePathTemplate", "cards/{creator}");
        }

        // Simple boolean: false = show prefill, true = user has applied changes
        // Default to false for fresh installs, only true if user explicitly applied changes
        let userChangedSavePath =
            localStorage.getItem("userChangedSavePath") === "true";

        let savePathTemplate = userChangedSavePath ?
            localStorage.getItem("savePathTemplate") || "" :
            "cards/{creator}";
        let animationTimeouts = [];
        let currentActiveTab = "export"; // Track current tab state
        let restorationInProgress = false; // Prevent multiple simultaneous restorations
        let guiElement = null;
        let settingsScrollbar = null;
        let cachedUserName = "";
        let cachedProxyUrl = "";
        sessionStorage.removeItem("char_export_scroll");
        sessionStorage.removeItem("char_settings_scroll");
        const ANIMATION_DURATION = 150; // Animation duration for modal open/close in ms
        const TAB_ANIMATION_DURATION = 300; // Animation duration for tab switching in ms
        const TAB_BUTTON_DURATION = 250; // Animation duration for tab button effects
        const BUTTON_ANIMATION = 200; // Animation duration for format buttons
        const TOGGLE_ANIMATION = 350; // Animation duration for toggle switch
        const ACTIVE_TAB_COLOR = "#0080ff"; // Color for active tab indicator
        const INACTIVE_TAB_COLOR = "transparent"; // Color for inactive tab indicator
        const BUTTON_COLOR = "#3a3a3a"; // Base color for buttons
        const BUTTON_HOVER_COLOR = "#4a4a4a"; // Hover color for buttons
        const BUTTON_ACTIVE_COLOR = "#0070dd"; // Active color for buttons when clicked
        const TOOLTIP_SLIDE_FROM_RIGHT = true; // true = slide towards right (default). Set false for slide-left variant.
        const TOOLTIP_SLIDE_OFFSET = 10; // px the tooltip travels during slide animation

        const blankMeta = {
            creatorUrl: "",
            characterVersion: "",
            characterCardUrl: "",
            name: "",
            creatorNotes: "",
            personality: "",
            scenario: "",
            firstMessage: "",
            exampleDialogs: "",
            definitionExposed: false,
        };

        const characterMetaCache = {
            id: null,
            useChatNameForName: false,
            ...blankMeta,
        };

        let jaiStateObserver;

        /**
         * @param {HTMLScriptElement} scriptNode
         */
        function extractAndCacheInitialData(scriptNode) {
            if (cachedUserName && cachedProxyUrl) {
                if (jaiStateObserver) {
                    jaiStateObserver.disconnect();
                }
                return;
            }

            try {
                const match = scriptNode.textContent.match(/JSON\.parse\("([\s\S]*?)"\)/);
                if (match && match[1]) {
                    const storeState = JSON.parse(JSON.parse(`"${match[1]}"`));

                    const profile = storeState?.user?.profile;
                    if (profile?.name && !cachedUserName) {
                        cachedUserName = profile.name.trim();
                    }

                    const config = storeState?.user?.config;
                    if (config?.open_ai_reverse_proxy && !cachedProxyUrl) {
                        cachedProxyUrl = config.open_ai_reverse_proxy;
                    }

                    if (cachedUserName && cachedProxyUrl && jaiStateObserver) {
                        jaiStateObserver.disconnect();
                    }
                }
            } catch (e) {}
        }

        // STRATEGY 1: Immediate Scan
        // Look for the data right away in case it's already on the page.
        document.querySelectorAll('script').forEach(script => {
            if (script.textContent.includes('window._storeState_')) {
                extractAndCacheInitialData(script);
            }
        });

        // STRATEGY 2: Asynchronous Watcher
        // Set up an observer to catch the data if it's added to the page later.
        jaiStateObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && node.textContent.includes('window._storeState_')) {
                        extractAndCacheInitialData(node);
                    }
                }
            }
        });

        // Start observing the entire page. The helper function will handle disconnecting.
        jaiStateObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        interceptNetwork();

        /* ============================
           ==      UTILITIES        ==
           ============================ */
        function debugLog(...args) {
            if (localStorage.getItem("showDebugLogs") === "true") {
                console.log(...args);
            }
        }

        function debugWarn(...args) {
            if (localStorage.getItem("showDebugLogs") === "true") {
                console.warn(...args);
            }
        }

        function debugError(...args) {
            // Always show errors in the console (not gated by the debug toggle)
            try {
                console.error(...args);
            } catch (_) {}
        }

        function makeElement(tag, attrs = {}, styles = {}) {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => (el[key] = value));

            if (styles) {
                Object.entries(styles).forEach(([key, value]) => (el.style[key] = value));
            }
            return el;
        }

        /**
         * Extract creator profile URL from fetched character page document.
         * Looks for the profile anchor used across pages.
         * @param {Document} doc – HTML document parsed from character page.
         * @returns {string} Absolute URL or empty string.
         */
        function getCreatorUrlFromDoc(doc) {
            const link = doc.querySelector("a.chakra-link.css-15sl5jl");
            if (link) {
                const href = link.getAttribute("href");
                if (href) return `https://janitorai.com${href}`;
            }
            return "";
        }

        async function saveFile(filename, blob) {
            const useFileSystemAPI =
                localStorage.getItem("useFileSystemAccess") === "true";

            if (useFileSystemAPI && "showDirectoryPicker" in window) {
                try {
                    const directoryHandle = window.selectedDirectoryHandle;

                    if (directoryHandle) {
                        const userChangedSavePath =
                            localStorage.getItem("userChangedSavePath") === "true";
                        const savePathTemplate = userChangedSavePath ?
                            localStorage.getItem("savePathTemplate") || "" :
                            "cards/{creator}";

                        let savePath = savePathTemplate;

                        debugLog("[DEBUG] Original save path template:", savePathTemplate);
                        debugLog("[DEBUG] Available chatData:", chatData);

                        const meta = await getCharacterMeta();
                        const tokens = await getFilenameTokens(meta);

                        debugLog("[DEBUG] Available tokens:", tokens);

                        Object.entries(tokens).forEach(([tokenKey, tokenValue]) => {
                            if (tokenValue && String(tokenValue).trim() !== "") {
                                const regex = new RegExp(`\\{${escapeRegExp(tokenKey)}\\}`, "g");
                                const oldSavePath = savePath;
                                savePath = savePath.replace(regex, String(tokenValue));
                                if (oldSavePath !== savePath) {
                                    debugLog(`[DEBUG] Replaced {${tokenKey}} with:`, tokenValue);
                                }
                            }
                        });

                        debugLog("[DEBUG] Final save path:", savePath);

                        savePath = savePath.replace(/^\/+|\/+$/g, "");
                        const pathSegments = savePath ?
                            savePath.split("/").filter((segment) => segment.length > 0) : [];

                        let currentDir = directoryHandle;
                        for (const segment of pathSegments) {
                            try {
                                currentDir = await currentDir.getDirectoryHandle(segment, {
                                    create: true,
                                });
                            } catch (error) {
                                debugError(
                                    `Failed to create/access directory ${segment}:`,
                                    error,
                                );
                                regularDownload(filename, blob);
                                return;
                            }
                        }

                        let finalFilename = filename;
                        let counter = 1;
                        let fileHandle;

                        while (true) {
                            try {
                                await currentDir.getFileHandle(finalFilename);
                                const lastDot = filename.lastIndexOf(".");
                                if (lastDot === -1) {
                                    finalFilename = `${filename} (${counter})`;
                                } else {
                                    const nameWithoutExt = filename.substring(0, lastDot);
                                    const extension = filename.substring(lastDot);
                                    finalFilename = `${nameWithoutExt} (${counter})${extension}`;
                                }
                                counter++;
                            } catch (error) {
                                break;
                            }
                        }

                        fileHandle = await currentDir.getFileHandle(finalFilename, {
                            create: true,
                        });
                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();

                        const successMessage = `Saved to: ${pathSegments.length > 0 ? pathSegments.join("/") + "/" : ""}${finalFilename}`;
                        debugLog(successMessage);

                        const notification = document.createElement("div");
                        notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #4CAF50;
              color: white;
              padding: 12px 20px;
              border-radius: 6px;
              z-index: 10001;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              font-size: 14px;
              font-weight: bold;
              opacity: 0;
              transform: translateX(100%);
              transition: all 300ms ease;
            `;
                        notification.textContent = `✓ ${successMessage}`;
                        document.body.appendChild(notification);

                        requestAnimationFrame(() => {
                            notification.style.opacity = "1";
                            notification.style.transform = "translateX(0)";
                        });

                        setTimeout(() => {
                            notification.style.opacity = "0";
                            notification.style.transform = "translateX(100%)";
                            setTimeout(() => notification.remove(), 300);
                        }, 3000);

                        return;
                    }
                } catch (error) {
                    debugError("FileSystemAccess API failed:", error);
                    const errorNotification = document.createElement("div");
                    errorNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transform: translateX(100%);
            transition: all 300ms ease;
          `;
                    errorNotification.textContent = `⚠ FileSystem save failed, using download instead`;
                    document.body.appendChild(errorNotification);

                    requestAnimationFrame(() => {
                        errorNotification.style.opacity = "1";
                        errorNotification.style.transform = "translateX(0)";
                    });

                    setTimeout(() => {
                        errorNotification.style.opacity = "0";
                        errorNotification.style.transform = "translateX(100%)";
                        setTimeout(() => errorNotification.remove(), 300);
                    }, 3000);
                }
            }

            regularDownload(filename, blob);
        }

        function regularDownload(filename, blob) {
            const url = URL.createObjectURL(blob);
            const a = makeElement("a", {
                href: url,
                download: filename,
            });
            a.addEventListener("click", (e) => {
                e.stopPropagation();
            });
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }

        function getCharacterCardUrl(id) {
            return `https://janitorai.com/characters/${id}`;
        }

        function escapeRegExp(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        function extractTagContent(sys, charName) {
            if (!charName || !sys) return "";
            const variants = [];
            const trimmed = charName.trim();
            variants.push(trimmed);
            const collapsed = trimmed.replace(/\s+/g, " ");
            if (collapsed !== trimmed) variants.push(collapsed);
            if (trimmed.includes(" ")) variants.push(trimmed.replace(/\s+/g, "_"));

            for (const name of variants) {
                const escName = escapeRegExp(name);
                const regex = new RegExp(
                    `<${escName}(?:\\s[^>]*)?\\s*>([\\s\\S]*?)<\\/${escName}\\s*>`,
                    "i",
                );
                const m = sys.match(regex);
                if (m && m[1] != null) {
                    return m[1].trim();
                }
                const openTagRx = new RegExp(`<${escName}(?:\\s[^>]*)?\\s*>`, "i");
                const closeTagRx = new RegExp(`<\\/${escName}\\s*>`, "i");
                const openMatch = openTagRx.exec(sys);
                const closeMatch = closeTagRx.exec(sys);
                if (openMatch && closeMatch && closeMatch.index > openMatch.index) {
                    const start = openMatch.index + openMatch[0].length;
                    const end = closeMatch.index;
                    return sys.substring(start, end).trim();
                }
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                        `<root>${sys}</root>`,
                        "application/xml",
                    );
                    const elems = doc.getElementsByTagName(name);
                    if (elems.length) {
                        return elems[0].textContent.trim();
                    }
                } catch (_) {}
            }
            return "";
        }

        function stripWatermark(text) {
            if (!text) return "";
            const lines = text.split(/\r?\n/);
            const filtered = lines.filter((l) => {
                const t = l.trim();
                return !(/^created/i.test(t) && /janitorai\.com"?$/i.test(t));
            });
            return filtered.join("\n").trim();
        }

        // === Early Chat Data Prefetch ===
        function findChatId() {
            const direct = window.location.href.match(/\/chats\/(\d+)/);
            if (direct) return direct[1];
            const scripts = document.querySelectorAll("script");
            for (const s of scripts) {
                const txt = s.textContent;
                if (!txt || !txt.includes("window._storeState_")) continue;
                const m = txt.match(/JSON\.parse\("([\s\S]*?)"\)/);
                if (m && m[1]) {
                    try {
                        const decoded = JSON.parse(`"${m[1]}"`); // unescape
                        const obj = JSON.parse(decoded);
                        let cid = null;
                        const walk = (o) => {
                            if (!o || typeof o !== "object" || cid) return;
                            if (
                                Object.prototype.hasOwnProperty.call(o, "chatId") &&
                                typeof o.chatId === "number"
                            ) {
                                cid = o.chatId;
                                return;
                            }
                            for (const k in o) walk(o[k]);
                        };
                        walk(obj);
                        if (cid) return cid;
                    } catch (_) {}
                }
            }
            return null;
        }

        function getAuthHeader() {
            const matches = document.cookie.match(/sb-auth-auth-token\.[^=]+=([^;]+)/g);
            if (matches && matches.length) {
                for (const seg of matches) {
                    const rawVal = seg.substring(seg.indexOf("=") + 1);
                    const hdr = extractBearer(rawVal);
                    if (hdr) return hdr;
                }
            }
            return null;

            function extractBearer(val) {
                let raw = decodeURIComponent(val);
                if (raw.startsWith("base64-")) raw = raw.slice(7);
                if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(raw)) {
                    debugLog("[getAuthHeader] using raw JWT");
                    return `Bearer ${raw}`;
                }
                try {
                    const json = JSON.parse(atob(raw));
                    if (json && json.access_token) {
                        debugLog("[getAuthHeader] using access_token from JSON");
                        return `Bearer ${json.access_token}`;
                    }
                } catch (err) {
                    /* ignore */
                }
                return null;
            }
            const m = document.cookie.match(/sb-auth-auth-token\.\d+=([^;]+)/);
            if (!m) return null;
            let raw = decodeURIComponent(m[1]);
            if (raw.startsWith("base64-")) raw = raw.slice(7);
            try {
                const json = JSON.parse(atob(raw));
                if (json.access_token) return `Bearer ${json.access_token}`;
            } catch (err) {
                if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(raw)) {
                    return `Bearer ${raw}`;
                }
            }
            return null;
        }

        function getAppVersion() {
            const scr = [...document.querySelectorAll("script[src]")].find((s) =>
                /\bv=([\w.-]+)/.test(s.src),
            );
            if (scr) {
                const m = scr.src.match(/\bv=([\w.-]+)/);
                if (m) return m[1];
            }
            return "2025-06-24.81a918c33";
        }

        async function prefetchChatData() {
            if (chatData) return;
            const chatId = findChatId();
            if (!chatId) return;
            const endpoint = `https://janitorai.com/hampter/chats/${chatId}`;
            const appVer = getAppVersion();
            const auth = getAuthHeader();
            debugLog("[prefetchChatData] auth:", auth);
            const baseHeaders = {
                "x-app-version": appVer,
                accept: "application/json, text/plain, */*",
            };
            if (auth) baseHeaders["Authorization"] = auth;
            debugLog("[prefetchChatData] request headers", baseHeaders);
            // First try with cookies + headers
            try {
                let res = await fetch(endpoint, {
                    method: "GET",
                    credentials: "include",
                    headers: baseHeaders,
                });
                if (res.status === 401) {
                    // Retry with Authorization header if available
                    const auth = getAuthHeader();
                    if (auth) {
                        res = await fetch(endpoint, {
                            method: "GET",
                            credentials: "include",
                            headers: {
                                ...baseHeaders,
                                Authorization: auth,
                            },
                        });
                    }
                }
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.character) {
                        chatData = json;
                        debugLog("[prefetchChatData] chatData pre-fetched");
                    }
                }
            } catch (err) {
                debugWarn("[prefetchChatData] failed:", err);
            }
        }

        function tokenizeNames(text, charName, userName) {
            if (!text) return text;
            const parts = text.split("\n\n");
            const [cRx, uRx] = [charName, userName].map((n) =>
                n ? escapeRegExp(n) : "",
            );

            for (let i = 0, l = parts.length; i < l; ++i) {
                if (
                    !/^==== (Name|Chat Name|Initial Message|Character Card|Creator) ====/.test(
                        parts[i],
                    )
                ) {
                    // Always tokenize {{user}} with the corrected regex
                    if (uRx) {
                        const userRegex = new RegExp(`\\b${uRx}('s?)?(?!\\w)`, "gi");
                        parts[i] = parts[i].replace(userRegex, (match, suffix) => {
                            return `{{user}}${suffix || ""}`;
                        });
                    }

                    // Conditionally tokenize {{char}} based on current setting (read live from localStorage)
                    if (localStorage.getItem("applyCharToken") === "true") {
                        if (cRx) {
                            const charRegex = new RegExp(`\\b${cRx}('s?)?(?!\\w)`, "gi");
                            parts[i] = parts[i].replace(charRegex, (match, suffix) => {
                                return `{{char}}${suffix || ""}`;
                            });
                        }
                    } else if (charName) {
                        parts[i] = parts[i].replace(/\{\{char\}\}/gi, charName);
                    }
                }
            }
            return parts.join("\n\n");
        }

        function tokenizeField(text, charName, userName) {
            if (!text) return text;
            let out = text;
            const esc = (n) => escapeRegExp(n);

            // Always apply {{user}} tokenization with the corrected regex
            if (userName) {
                const userRegex = new RegExp(`\\b${esc(userName)}('s?)?(?!\\w)`, "gi");
                out = out.replace(userRegex, (match, suffix) => `{{user}}${suffix || ""}`);
            }

            // Conditionally apply {{char}} tokenization (read live from localStorage)
            if (localStorage.getItem("applyCharToken") === "true" && charName) {
                const charRegex = new RegExp(`\\b${esc(charName)}('s?)?(?!\\w)`, "gi");
                out = out.replace(charRegex, (match, suffix) => `{{char}}${suffix || ""}`);
            } else if (charName) {
                // De-tokenize if setting is off
                out = out.replace(/\{\{char\}\}/gi, charName);
            }

            return out;
        }

        // ===== Shared Creator Notes Utilities (for GUI and Exports) =====
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        function isImageUrl(url) {
            try {
                const clean = url.split('#')[0];
                const path = clean.split('?')[0];
                return /\.(webp|png|jpe?g|gif)$/i.test(path);
            } catch (_) {
                return false;
            }
        }

        function classifyUrl(url) {
            try {
                const u = new URL(url);
                const host = u.hostname.replace(/^www\./, "");
                const isImg = isImageUrl(url);
                let kind = isImg ? "IMG" : "LINK";
                if (/discord\.gg|discord\.com/i.test(host)) kind = isImg ? "IMG" : "DISCORD";
                if (/janitorai\.com/i.test(host)) kind = isImg ? "IMG" : "JAI";
                return {
                    kind,
                    host
                };
            } catch (_) {
                return {
                    kind: isImageUrl(url) ? "IMG" : "LINK",
                    host: ""
                };
            }
        }

        function buildCreatorNotesHtml(raw, autoImg) {
            if (!raw) return "";
            const baseName = (url) => {
                try {
                    const u = new URL(url);
                    const path = (u.pathname || '').split('/').filter(Boolean).pop() || url;
                    return decodeURIComponent(path);
                } catch (_) {
                    return url;
                }
            };

            function markdownToHtml(text) {
                if (!text) return "";
                // Images: ![alt](url)
                text = text.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi, (m, alt, url) => {
                    if (autoImg && isImageUrl(url)) {
                        return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}">`;
                    }
                    const label = alt && alt.trim() ? alt : url;
                    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
                });
                // Links: [text](url)
                text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, (m, label, url) => {
                    if (autoImg && isImageUrl(url)) {
                        return `<img src="${escapeHtml(url)}" alt="${escapeHtml(label)}">`;
                    }
                    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
                });
                return text;
            }

            function sanitizeAndProcessHtmlShared(input) {
                const container = document.createElement('div');
                container.innerHTML = markdownToHtml(String(input));

                // Remove dangerous tags early
                container.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el => el.remove());

                // Convert bare URLs in text nodes to <a> or <img>
                (function linkifyTextNodes(root) {
                    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                    const toProcess = [];
                    let node;
                    while ((node = walker.nextNode())) {
                        const parent = node.parentElement;
                        if (!parent) continue;
                        const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
                        if ([
                                'a', 'script', 'style', 'textarea', 'code', 'pre'
                            ].includes(tag)) continue;
                        if (!node.nodeValue || !/https?:\/\//i.test(node.nodeValue)) continue;
                        toProcess.push(node);
                    }
                    const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
                    toProcess.forEach((textNode) => {
                        const text = textNode.nodeValue || '';
                        let lastIndex = 0;
                        let match;
                        const frag = document.createDocumentFragment();
                        while ((match = urlRegex.exec(text)) !== null) {
                            const start = match.index;
                            const rawUrl = match[1];
                            // Append preceding text
                            if (start > lastIndex) {
                                frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
                            }
                            // Trim trailing punctuation
                            let url = rawUrl.replace(/[).,;:!?]+$/g, '');
                            const trailing = rawUrl.slice(url.length);
                            if (autoImg && isImageUrl(url)) {
                                const img = document.createElement('img');
                                img.src = url;
                                img.alt = baseName(url);
                                img.style.maxWidth = '100%';
                                img.style.height = 'auto';
                                img.style.display = 'block';
                                img.style.margin = '8px auto';
                                img.setAttribute('draggable', 'true');
                                frag.appendChild(img);
                            } else {
                                const a = document.createElement('a');
                                a.href = url;
                                a.textContent = baseName(url);
                                a.target = '_blank';
                                a.rel = 'noopener noreferrer';
                                frag.appendChild(a);
                            }
                            if (trailing) frag.appendChild(document.createTextNode(trailing));
                            lastIndex = match.index + rawUrl.length;
                        }
                        // Append remaining text
                        if (lastIndex < text.length) {
                            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                        }
                        textNode.replaceWith(frag);
                    });
                })(container);

                // Clean attributes; normalize or convert <img> depending on toggle; process anchors
                const all = container.getElementsByTagName('*');
                for (let i = all.length - 1; i >= 0; i--) {
                    const el = all[i];
                    // Strip inline handlers and srcdoc
                    [...el.attributes].forEach(attr => {
                        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
                        if (attr.name === 'srcdoc') el.removeAttribute('srcdoc');
                    });

                    const tag = el.tagName.toLowerCase();
                    if (tag === 'a') {
                        const href = el.getAttribute('href') || '';
                        if (/^\s*javascript:/i.test(href)) {
                            el.removeAttribute('href');
                            continue;
                        }
                        el.setAttribute('target', '_blank');
                        el.setAttribute('rel', 'noopener noreferrer');
                        if (autoImg && isImageUrl(href)) {
                            // Replace anchor contents with an inline image
                            const alt = (el.textContent || '').trim();
                            el.textContent = '';
                            const img = document.createElement('img');
                            img.src = href;
                            img.alt = alt || baseName(href);
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.display = 'block';
                            img.style.margin = '8px auto';
                            img.setAttribute('draggable', 'true');
                            el.appendChild(img);
                        } else if (!el.textContent || !el.textContent.trim()) {
                            el.textContent = baseName(href);
                        }
                    } else if (tag === 'img') {
                        const src = el.getAttribute('src') || '';
                        if (!/^https?:\/\//i.test(src)) {
                            // Drop non-http(s) sources for safety
                            const alt = el.getAttribute('alt');
                            if (alt) {
                                el.replaceWith(document.createTextNode(alt));
                            } else {
                                el.remove();
                            }
                            continue;
                        }
                        if (!autoImg) {
                            // Convert image to a link instead of rendering inline
                            const a = document.createElement('a');
                            a.href = src;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            a.textContent = el.getAttribute('alt')?.trim() || baseName(src);
                            el.replaceWith(a);
                            continue;
                        }
                        // Normalize inline image presentation
                        el.style.maxWidth = '100%';
                        el.style.height = 'auto';
                        el.style.display = 'block';
                        el.style.margin = '8px auto';
                        el.setAttribute('draggable', 'true');
                    }
                }
                return container.innerHTML;
            }
            return sanitizeAndProcessHtmlShared(raw);
        }

        function collectUrlsFromNotes(raw) {
            if (!raw) return [];
            const text = String(raw);
            const urls = new Set();
            // Markdown images
            text.replace(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/gi, (_, url) => {
                urls.add(url);
                return _;
            });
            // Markdown links
            text.replace(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi, (_, url) => {
                urls.add(url);
                return _;
            });
            // Raw HTML tags
            try {
                const tmp = document.createElement('div');
                tmp.innerHTML = text;
                tmp.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href');
                    if (/^https?:\/\//i.test(href)) urls.add(href);
                });
                tmp.querySelectorAll('img[src]').forEach(img => {
                    const src = img.getAttribute('src');
                    if (/^https?:\/\//i.test(src)) urls.add(src);
                });
            } catch (_) {}
            // Bare URLs
            (text.match(/https?:\/\/[^\s<>"]+/gi) || []).forEach((rawUrl) => {
                const url = rawUrl.replace(/[).,;:!?]+$/g, '');
                urls.add(url);
            });
            return Array.from(urls);
        }

        function creatorNotesToPlainText(raw, autoImg) {
            const html = buildCreatorNotesHtml(String(raw || ''), !!autoImg);
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            // Convert images to their src
            tmp.querySelectorAll('img').forEach(img => {
                const src = img.getAttribute('src') || '';
                const alt = (img.getAttribute('alt') || '').trim();
                const rep = src || alt;
                img.replaceWith(document.createTextNode(rep));
            });
            // Convert anchors to "text (href)" or href
            tmp.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href') || '';
                const text = (a.textContent || '').trim();
                let rep = href;
                if (text && text !== href) rep = `${text} (${href})`;
                a.replaceWith(document.createTextNode(rep));
            });
            // Remove dangerous tags
            tmp.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el => el.remove());
            return (tmp.textContent || '').trim();
        }

        /**
         * Adds a token value to the filename template input field
         * @param {string} token - Token to add (e.g., "id", "name", etc.)
         * @param {HTMLInputElement} inputField - The template input field
         */
        function addTokenToTemplate(token, inputField) {
            if (!inputField || !token) return;

            const currentValue = inputField.value || "";
            const cursorPos = inputField.selectionStart || currentValue.length;

            // Add space before token if there's content and no trailing space or slash
            const needsSpace =
                currentValue &&
                !currentValue.endsWith(" ") &&
                !currentValue.endsWith("/") &&
                cursorPos === currentValue.length;
            const tokenToAdd = needsSpace ? ` {${token}}` : `{${token}}`;

            const newValue =
                currentValue.slice(0, cursorPos) +
                tokenToAdd +
                currentValue.slice(cursorPos);
            inputField.value = newValue;

            // Update cursor position
            const newCursorPos = cursorPos + tokenToAdd.length;
            inputField.setSelectionRange(newCursorPos, newCursorPos);
            inputField.focus();

            // Trigger change event
            inputField.dispatchEvent(new Event("input", {
                bubbles: true
            }));
        }

        /**
         * Creates a token button for the filename template UI
         * @param {string} token - Token name
         * @param {string} label - Display label for the button
         * @param {HTMLInputElement} inputField - Template input field
         * @returns {HTMLElement} - Button element
         */
        function createTokenButton(token, label, inputElement, isSavePath = false) {
            const button = makeElement(
                "button", {
                    textContent: label,
                    type: "button",
                }, {
                    background: "#3a3a3a",
                    border: "1px solid #555",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    transition: "all 150ms ease",
                    margin: "2px",
                },
            );

            button.addEventListener("mouseover", () => {
                button.style.background = "#4a4a4a";
                button.style.borderColor = "#666";
            });

            button.addEventListener("mouseout", () => {
                button.style.background = "#3a3a3a";
                button.style.borderColor = "#555";
            });

            button.addEventListener("mousedown", (e) => {
                // Only trigger on left mouse button
                if (e.button !== 0) return;

                e.preventDefault();
                addTokenToTemplate(token, inputElement);

                // Green flash and pulse animation for left click
                button.style.background = "#4CAF50";
                button.style.borderColor = "#66BB6A";
                button.style.transform = "scale(1.1)";
                button.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.6)";

                setTimeout(() => {
                    button.style.background = "#3a3a3a";
                    button.style.borderColor = "#555";
                    button.style.transform = "scale(1)";
                    button.style.boxShadow = "none";
                }, 100);
            });

            // Right mousedown for immediate removal
            button.addEventListener("mousedown", (e) => {
                // Only trigger on right mouse button
                if (e.button !== 2) return;

                e.preventDefault();
                e.stopPropagation();

                const currentValue = inputElement.value;
                const tokenPattern = `{${token}}`;

                if (currentValue.includes(tokenPattern)) {
                    // Find the first occurrence and remove only one instance with intelligent spacing
                    let newValue = currentValue;
                    const tokenRegex = new RegExp(`\\{${token}\\}`, "");

                    // Check if token has a space before it
                    const tokenWithSpaceRegex = new RegExp(` \\{${token}\\}`, "");

                    if (tokenWithSpaceRegex.test(newValue)) {
                        // Remove token with preceding space
                        newValue = newValue.replace(tokenWithSpaceRegex, "");
                    } else {
                        // Remove just the token
                        newValue = newValue.replace(tokenRegex, "");
                    }

                    // Clean up any double spaces that might result
                    newValue = newValue.replace(/\s+/g, " ").trim();

                    inputElement.value = newValue;

                    // Trigger input event to update state
                    if (isSavePath) {
                        savePathTemplate = newValue;
                    } else {
                        filenameTemplate = newValue;
                        localStorage.setItem("filenameTemplateDraft", filenameTemplate);
                    }

                    inputElement.dispatchEvent(new Event("input", {
                        bubbles: true
                    }));

                    // Immediate red flash and pulse animation
                    button.style.background = "#f44336";
                    button.style.borderColor = "#ff6666";
                    button.style.transform = "scale(1.1)";
                    button.style.boxShadow = "0 0 10px rgba(244, 67, 54, 0.6)";

                    setTimeout(() => {
                        button.style.background = "#3a3a3a";
                        button.style.borderColor = "#555";
                        button.style.transform = "scale(1)";
                        button.style.boxShadow = "none";
                    }, 100);
                } else {
                    // Budge animation when token not found
                    button.style.transform = "translateX(-3px)";
                    setTimeout(() => {
                        button.style.transform = "translateX(3px)";
                        setTimeout(() => {
                            button.style.transform = "translateX(0)";
                        }, 100);
                    }, 100);
                }
            });

            // Prevent context menu from appearing
            button.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            return button;
        }

        /**
         * Creates a standardized toggle component
         * @param {string} key - localStorage key
         * @param {string} label - Display label
         * @param {string} tooltip - Tooltip text
         * @param {boolean} defaultValue - Default checked state
         * @returns {Object} - Object containing container and input elements
         */
        function createToggle(key, label, tooltip, defaultValue = false) {
            // Get the actual value from localStorage, with defaultValue as fallback
            let storedValue = localStorage.getItem(key);
            // Persist default on first run so other code paths that read localStorage see it immediately
            if (storedValue === null) {
                localStorage.setItem(key, String(defaultValue));
                storedValue = String(defaultValue);
            }
            const actualValue = storedValue !== null ? storedValue === "true" : defaultValue;

            const container = makeElement(
                "div", {
                    className: "toggle-container"
                }, {
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    marginTop: "10px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    gap: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    isolation: "isolate",
                    contain: "layout style paint",
                    border: "1px solid #444",
                    background: "linear-gradient(135deg, #2a2a2a 0%, #2e2e2e 100%)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    position: "relative",
                },
            );

            const wrapper = makeElement(
                "div", {
                    className: "toggle-wrapper",
                }, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    cursor: "pointer",
                    position: "relative",
                    isolation: "isolate",
                    transition: "all 0.2s ease",
                },
            );

            const labelElement = makeElement(
                "span", {
                    textContent: label,
                }, {
                    fontSize: "13px",
                    color: "#fff",
                    order: "2",
                    textAlign: "left",
                    flex: "1",
                    paddingLeft: "10px",
                    paddingRight: "28px", // ensure space so text doesn't run under reset button
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                },
            );

            const toggle = makeElement(
                "label", {
                    className: "switch",
                }, {
                    position: "relative",
                    display: "inline-block",
                    width: "40px",
                    height: "24px",
                    order: "1",
                    margin: "0",
                    flexShrink: "0",
                    borderRadius: "24px",
                    // Remove inner inset shadow to avoid "inner border" effect on hover
                    boxShadow: "none",
                    transition: `all ${TOGGLE_ANIMATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    cursor: "pointer",
                },
            );

            const slider = makeElement(
                "span", {
                    className: "slider round",
                }, {
                    position: "absolute",
                    cursor: "pointer",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    backgroundColor: actualValue ? ACTIVE_TAB_COLOR : "#ccc",
                    transition: `all ${TOGGLE_ANIMATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    borderRadius: "24px",
                    overflow: "hidden",
                    // Remove any glow/inner border on the track entirely
                    boxShadow: "none",
                },
            );

            const sliderShine = makeElement(
                "div", {}, {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
                    opacity: "0.5",
                    transition: `opacity ${TOGGLE_ANIMATION}ms ease`,
                },
            );
            slider.appendChild(sliderShine);

            const sliderBefore = makeElement(
                "span", {
                    className: "slider-before",
                }, {
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: "4px",
                    bottom: "4px",
                    backgroundColor: "white",
                    transition: `transform ${TOGGLE_ANIMATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    borderRadius: "50%",
                    transform: actualValue ? "translateX(16px)" : "translateX(0)",
                    // Remove glow/inner border from the knob entirely
                    boxShadow: "none",
                },
            );

            const input = makeElement(
                "input", {
                    type: "checkbox",
                    checked: actualValue,
                    "data-key": key, // Store key for easy access
                }, {
                    opacity: "0",
                    width: "0",
                    height: "0",
                    position: "absolute",
                },
            );

            input.addEventListener("change", (e) => {
                const isChecked = e.target.checked;
                localStorage.setItem(key, isChecked);

                slider.style.backgroundColor = isChecked ? ACTIVE_TAB_COLOR : "#ccc";
                // Keep track and knob free of any glow/border regardless of state
                slider.style.boxShadow = "none";
                sliderBefore.style.transform = isChecked ?
                    "translateX(16px)" :
                    "translateX(0)";
                sliderBefore.style.boxShadow = "none";

                wrapper.classList.toggle("active", isChecked);

                container.style.transform = "scale(1.02)";
                container.style.borderColor = isChecked ?
                    "rgba(0, 128, 255, 0.4)" :
                    "#444";
                container.style.boxShadow = isChecked ?
                    "0 4px 12px rgba(0, 128, 255, 0.15)" :
                    "0 2px 4px rgba(0,0,0,0.1)";

                setTimeout(() => {
                    container.style.transform = "";
                }, 150);
            });

            slider.appendChild(sliderBefore);
            toggle.appendChild(input);
            toggle.appendChild(slider);

            // Set initial visual state based on actualValue
            if (actualValue) {
                wrapper.classList.add("active");
                container.style.borderColor = "rgba(0, 128, 255, 0.4)";
                container.style.boxShadow = "0 4px 12px rgba(0, 128, 255, 0.15)";
            }


            wrapper.addEventListener("click", (e) => {
                e.preventDefault();
                input.checked = !input.checked;
                const event = new Event("change");
                input.dispatchEvent(event);
                document.body.focus();
            });

            wrapper.appendChild(labelElement);
            labelElement.setAttribute("data-tooltip", tooltip);
            wrapper.appendChild(toggle);
            container.appendChild(wrapper);

            // Add reset icon
            const resetButton = makeElement(
                "button", {
                    innerHTML: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>`,
                    title: "Reset to default",
                }, {
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    transition: "all 200ms ease",
                    opacity: "0.5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            );

            resetButton.addEventListener("mouseenter", () => {
                resetButton.style.opacity = "1";
                resetButton.style.color = "#fff";
                resetButton.style.background = "rgba(255, 255, 255, 0.1)";
            });

            resetButton.addEventListener("mouseleave", () => {
                resetButton.style.opacity = "0.5";
                resetButton.style.color = "#666";
                resetButton.style.background = "transparent";
            });

            resetButton.addEventListener("click", (e) => {
                e.stopPropagation();

                // Set to default value - special case for alwaysShowFab
                const resetValue = key === "alwaysShowFab" ? true : defaultValue;
                input.checked = resetValue;
                localStorage.setItem(key, resetValue);

                // Fire change so external listeners react (e.g., re-render panels)
                input.dispatchEvent(new Event("change"));

                // Update visual state
                slider.style.backgroundColor = resetValue ? ACTIVE_TAB_COLOR : "#ccc";
                slider.style.boxShadow = "none";
                sliderBefore.style.transform = resetValue ?
                    "translateX(16px)" :
                    "translateX(0)";
                sliderBefore.style.boxShadow = "none";

                wrapper.classList.toggle("active", resetValue);

                // Flash effect
                resetButton.style.transform = "translateY(-50%) rotate(360deg)";
                resetButton.style.color = "#4CAF50";
                setTimeout(() => {
                    resetButton.style.transform = "translateY(-50%) rotate(0deg)";
                    resetButton.style.color = "#666";
                }, 400);
            });

            container.appendChild(resetButton);

            return {
                container,
                input,
                wrapper
            };
        }

        /* ============================
           ==          UI           ==
           ============================ */
        function createUI() {
            if (guiElement && document.body.contains(guiElement)) {
                return;
            }

            animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            animationTimeouts = [];

            viewActive = true;

            const gui = makeElement(
                "div", {
                    id: "char-export-gui",
                }, {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.95)",
                    background: "#222",
                    color: "white",
                    padding: "15px 20px 7px",
                    borderRadius: "8px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                    zIndex: "10000",
                    textAlign: "center",
                    width: "min(480px, 90vw)",
                    minHeight: "400px",
                    maxHeight: "85vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    opacity: "0",
                    transition: `opacity ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                },
            );

            guiElement = gui;
            const closeBtn = makeElement(
                "button", {
                    ariaLabel: "Close",
                    innerHTML: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
                    className: "no-lift"
                }, {
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "28px",
                    height: "28px",
                    textAlign: "center",
                    background: "transparent",
                    color: "#aaa",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "10001"
                }
            );
            closeBtn.addEventListener("mouseenter", () => {
                closeBtn.style.color = "#fff";
                closeBtn.style.borderColor = "#777";
                closeBtn.style.background = "rgba(255,255,255,0.06)";
            });
            closeBtn.addEventListener("mouseleave", () => {
                closeBtn.style.color = "#aaa";
                closeBtn.style.borderColor = "#555";
                closeBtn.style.background = "transparent";
            });
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                closeV();
            });
            gui.appendChild(closeBtn);
            const unselectStyle = document.createElement("style");
            unselectStyle.textContent = `#char-export-gui, #char-export-gui * {
    user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
  }
  #char-export-gui {
    backdrop-filter: blur(6px);
    background: rgba(34,34,34,0.92);
    border: none;
    border-radius: 8px;
  }
  #char-export-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 9998;
  }
  #char-export-gui #char-export-tooltip {
    font-size: 12px; background: #222; color: #fff;
    padding: 6px 10px; border-radius: 4px; pointer-events: none;
  }
  #char-export-gui button {
    background: #333; color: #fff; border: none;
    border-radius: 4px; padding: 8px 12px;
    transition: background 200ms ease, transform 200ms ease;
  }
  #char-export-gui button:hover:not(:disabled):not(.no-lift) {
    background: #444; transform: translateY(-1px);
  }
  /* Disable lift on close button */
  #char-export-gui .no-lift,
  #char-export-gui .no-lift:hover {
    transform: none !important;
  }
  #char-export-gui button:disabled {
    opacity: 0.6; cursor: not-allowed;
  }
  #char-export-gui button:focus {
    outline: none;
  }

  /* Enhanced input field styling */
  #char-export-gui input[type="text"] {
    transition: border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    border-radius: 6px !important;
  }

  #char-export-gui input[type="text"]:not(.applying-changes):hover {
    border-color: #777 !important;
  }

  #char-export-gui input[type="text"]:not(.applying-changes):focus {
    border-color: #888 !important;
  }

  /* Ensure apply animation takes priority */
  #char-export-gui input.applying-changes {
    border-color: #4CAF50 !important;
  }

  /* Disable all browser tooltips */
  #char-export-gui input,
  #char-export-gui input:hover,
  #char-export-gui input:focus,
  #char-export-gui textarea,
  #char-export-gui textarea:hover,
  #char-export-gui textarea:focus {
    title: "" !important;
  }

  #char-export-gui input[title],
  #char-export-gui textarea[title] {
    title: "" !important;
  }

/* Enhanced toggle container styling */
.toggle-wrapper {
  position: relative !important;
  border-radius: 8px !important;
  transition: transform 150ms ease !important; /* animate only transform for perf */
  will-change: transform;
}

  /* Smooth lift only; no shadow here to avoid paint thrash */
  .toggle-wrapper:hover {
    transform: translateY(-1px) scale(1.005) !important;
  }

  /* Dedicated, pre-trimmed glow layer */
  .toggle-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    pointer-events: none;

    /* Put the glow on the pseudo-element, not the wrapper */
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);

    /* Permanently trim the right side; tweak 56px to taste */
    clip-path: inset(0 56px 0 0 round 8px);

    /* Fade in on hover for smoothness */
    opacity: 0;
    transition: opacity 150ms ease;
    will-change: opacity;
  }

  .toggle-wrapper:hover::before,
  .toggle-wrapper.active:hover::before {
    opacity: 1;
  }

  /* Container hover lift (no !important to avoid overriding click pulse) */
  .toggle-container:hover {
    transform: translateY(-1px) scale(1.005);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

.toggle-wrapper.active {
  border-color: rgba(0, 128, 255, 0.4) !important;
}

/* Persistent, trimmed glow when enabled (non-hover) */
.toggle-wrapper.active::before {
  opacity: 1;
  box-shadow: 0 3px 10px rgba(0,0,0,0.18);
}

  /* Token button styling */
  #char-export-gui button[type="button"] {
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Exclude no-lift buttons (e.g., Links panel copy buttons) from hover lift */
  #char-export-gui button[type="button"]:not(.no-lift):hover {
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
  }

  /* Directory button styling */
  .directory-button {
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .directory-button:hover {
    box-shadow: 0 0 8px rgba(74, 144, 226, 0.4) !important;
    background: #4a90e2 !important;
  }

  .directory-button:active {
    transform: scale(0.98) !important;
  }


  /* Custom scrollbar overlay container */
  .custom-scrollbar-container {
    position: relative;
  }

  .custom-scrollbar-track {
    position: absolute;
    top: 0;
    right: -6px;
    width: 4px;
    height: 100%;
    background: rgba(68, 68, 68, 0.1);
    border-radius: 2px;
    opacity: 0.6;
    visibility: visible;
    transition: opacity 50ms ease, box-shadow 100ms ease;
    z-index: 1000;
    pointer-events: auto;
  }

  .custom-scrollbar-track.visible {
    opacity: 0.6;
    visibility: visible;
  }

  .custom-scrollbar-track:hover {
    opacity: 1;
    background: rgba(68, 68, 68, 0.2);
    box-shadow: 0 0 2px rgba(136, 136, 136, 0.2);
  }

  .custom-scrollbar-track.expanded {
    opacity: 1;
    background: rgba(68, 68, 68, 0.2);
    box-shadow: 0 0 4px rgba(136, 136, 136, 0.3);
  }

  .custom-scrollbar-thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(136, 136, 136, 0.7);
    border-radius: 2px;
    border: none;
    transition: background 50ms ease;
    cursor: pointer;
    min-height: 20px;
  }

  .custom-scrollbar-thumb:hover {
    background: rgba(170, 170, 170, 0.8);
  }

  .custom-scrollbar-thumb:active,
  .custom-scrollbar-thumb.dragging {
    background: rgba(200, 200, 200, 0.9);
  }
  }`;
            document.head.appendChild(unselectStyle);

            const tabContainer = makeElement(
                "div", {}, {
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                    borderBottom: "1px solid #444",
                    paddingBottom: "12px",
                    width: "100%",
                },
            );

            const tabsWrapper = makeElement(
                "div", {}, {
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: "min(400px, 100%)",
                    margin: "0 auto",
                },
            );

            const createTabButton = (text, isActive) => {
                const button = makeElement(
                    "button", {
                        textContent: text,
                    }, {
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        padding: "8px 20px",
                        cursor: "pointer",
                        margin: "0 5px",
                        fontWeight: "bold",
                        flex: "1",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition: `opacity ${TAB_BUTTON_DURATION}ms ease, transform ${TAB_BUTTON_DURATION}ms ease, color ${TAB_BUTTON_DURATION}ms ease`,
                    },
                );

                const indicator = makeElement(
                    "div", {}, {
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        background: isActive ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
                        transition: `transform ${TAB_BUTTON_DURATION}ms ease, background-color ${TAB_BUTTON_DURATION}ms ease`,
                    },
                );

                if (!isActive) {
                    button.style.opacity = "0.7";
                    indicator.style.transform = "scaleX(0.5)";
                }

                button.appendChild(indicator);
                return {
                    button,
                    indicator,
                };
            };

            const {
                button: exportTab,
                indicator: exportIndicator
            } = createTabButton(
                "Export",
                true,
            );
            const {
                button: settingsTab,
                indicator: settingsIndicator
            } =
            createTabButton("Settings", false);

            exportTab.onmouseover = () => {
                if (currentTab !== "export") {
                    exportTab.style.opacity = "1";
                    exportTab.style.transform = "translateY(-2px)";
                    exportIndicator.style.transform = "scaleX(0.8)";
                }
            };
            exportTab.onmouseout = () => {
                if (currentTab !== "export") {
                    exportTab.style.opacity = "0.7";
                    exportTab.style.transform = "";
                    exportIndicator.style.transform = "scaleX(0.5)";
                }
            };

            settingsTab.onmouseover = () => {
                if (currentTab !== "settings") {
                    settingsTab.style.opacity = "1";
                    settingsTab.style.transform = "translateY(-2px)";
                    settingsIndicator.style.transform = "scaleX(0.8)";
                }
            };
            settingsTab.onmouseout = () => {
                if (currentTab !== "settings") {
                    settingsTab.style.opacity = "0.7";
                    settingsTab.style.transform = "";
                    settingsIndicator.style.transform = "scaleX(0.5)";
                }
            };

            tabsWrapper.appendChild(exportTab);
            tabsWrapper.appendChild(settingsTab);
            tabContainer.appendChild(tabsWrapper);
            gui.appendChild(tabContainer);
            /* ========= Dynamic Tooltip ========= */
            (() => {
                let tEl;
                let tCurrentTarget = null;
                const show = (target) => {
                    const msg = target.getAttribute("data-tooltip");
                    if (!msg) return;
                    if (!tEl) {
                        tEl = document.createElement("div");
                        tEl.id = "char-export-tooltip";
                        tEl.id = "char-export-tooltip";
                        tEl.style.cssText = [
                            "position:fixed",
                            "padding:8px 10px",
                            "font-size:12px",
                            "background:#1f1f1f",
                            "color:#fff",
                            "border:1px solid #444",
                            "border-radius:8px",
                            "max-width:min(60vw, 380px)",
                            "white-space:normal",
                            "word-break:break-word",
                            "line-height:1.35",
                            "text-align:left",
                            "pointer-events:none",
                            "box-shadow:0 4px 12px rgba(0,0,0,0.4)",
                            "opacity:0",
                            "transition:opacity 200ms ease,transform 200ms ease",
                            "z-index:10002"
                        ].join(";") + ";";
                        const offset = TOOLTIP_SLIDE_FROM_RIGHT ?
                            -TOOLTIP_SLIDE_OFFSET :
                            TOOLTIP_SLIDE_OFFSET;
                        tEl.style.transform = `translateX(${offset}px)`;
                        document.body.appendChild(tEl);
                    }
                    tEl.textContent = msg;

                    // Positioning with viewport clamping
                    const guiRect = gui.getBoundingClientRect();
                    const tgtRect = target.getBoundingClientRect();

                    // Initial placement to the right of the modal
                    let left = guiRect.right + 10;
                    let top = tgtRect.top + tgtRect.height / 2;

                    // Fresh animation if switching targets
                    const switching = tCurrentTarget && tCurrentTarget !== target;
                    tCurrentTarget = target;

                    // Measure and clamp within viewport
                    const measureAndPlace = () => {
                        const tipRect = tEl.getBoundingClientRect();
                        // If overflows right edge, place to the left of modal
                        if (left + tipRect.width > window.innerWidth - 8) {
                            left = Math.max(8, guiRect.left - 10 - tipRect.width);
                        }
                        // Clamp left min
                        if (left < 8) left = 8;
                        // Center vertically on target, then clamp to viewport
                        let finalTop = Math.round(top - tipRect.height / 2);
                        const maxTop = Math.max(8, window.innerHeight - tipRect.height - 8);
                        if (finalTop < 8) finalTop = 8;
                        if (finalTop > maxTop) finalTop = maxTop;
                        tEl.style.top = `${finalTop}px`;
                        tEl.style.left = `${Math.round(left)}px`;

                        // Prepare animation start (fresh if switching)
                        const offset = TOOLTIP_SLIDE_FROM_RIGHT ? -TOOLTIP_SLIDE_OFFSET : TOOLTIP_SLIDE_OFFSET;
                        const cs = getComputedStyle(tEl);
                        const wasVisible = parseFloat(cs.opacity) > 0.01 && tEl.style.transform && tEl.style.transform !== 'none';
                        const continueFromCurrent = wasVisible && !switching;

                        tEl.style.transition = 'none';
                        tEl.style.opacity = continueFromCurrent ? cs.opacity : '0';
                        tEl.style.transform = continueFromCurrent ? cs.transform : `translateX(${offset}px)`;
                        void tEl.offsetWidth;
                        tEl.style.transition = 'opacity 200ms ease, transform 200ms ease';

                        requestAnimationFrame(() => {
                            tEl.style.opacity = "1";
                            tEl.style.transform = "translateX(0)";
                        });
                    };

                    // Wait one frame so styles/text apply, then measure for accurate wrap size
                    requestAnimationFrame(measureAndPlace);
                };
                const hide = () => {
                    if (!tEl) return;
                    tEl.style.opacity = "0";
                    const offsetHide = TOOLTIP_SLIDE_FROM_RIGHT ?
                        -TOOLTIP_SLIDE_OFFSET :
                        TOOLTIP_SLIDE_OFFSET;
                    tEl.style.transform = `translateX(${offsetHide}px)`;
                    // Clear current target shortly after hide completes
                    setTimeout(() => {
                        tCurrentTarget = null;
                    }, 220);
                };
                gui.addEventListener("mouseover", (e) => {
                    const tgt = e.target.closest("[data-tooltip]");
                    if (tgt) show(tgt);
                });
                gui.addEventListener("mouseout", (e) => {
                    const from = e.target.closest("[data-tooltip]");
                    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("[data-tooltip]");
                    if (from && (!to || !from.contains(e.relatedTarget))) {
                        hide();
                    }
                });
                // Ensure tooltip always hides when leaving the modal or clicking elsewhere
                gui.addEventListener("mouseleave", () => hide());
                document.addEventListener("pointerdown", () => hide());
                window.addEventListener("keydown", (ev) => {
                    hide();
                    if ((ev.key === "t" || ev.key === "T") && tEl) {
                        tEl.style.opacity = "0";
                        const offsetHide = TOOLTIP_SLIDE_FROM_RIGHT ?
                            -TOOLTIP_SLIDE_OFFSET :
                            TOOLTIP_SLIDE_OFFSET;
                        tEl.style.transform = `translateX(${offsetHide}px)`;
                    }
                });
            })();

            const exportContent = makeElement(
                "div", {
                    id: "export-tab",
                }, {
                    maxHeight: "60vh",
                    overflowY: "auto",
                    padding: "0 5px 10px 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                },
            );

            const title = makeElement(
                "h1", {
                    textContent: "Export Character Card",
                }, {
                    margin: "-10px 0 25px 0",
                    fontSize: "24px",
                    paddingTop: "0px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                    borderBottom: "2px solid #444",
                    paddingBottom: "8px",
                },
            );
            exportContent.appendChild(title);

            const buttonContainer = makeElement(
                "div", {}, {
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    marginBottom: "8px",
                    marginTop: "12px",
                },
            );

            ["TXT", "PNG", "JSON"].forEach((format) => {
                const type = format.toLowerCase();

                const button = makeElement(
                    "button", {
                        textContent: format,
                    }, {
                        background: BUTTON_COLOR,
                        border: "none",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        position: "relative",
                        overflow: "hidden",
                        flex: "1",
                        maxWidth: "min(120px, 30%)",
                        transition: `all ${BUTTON_ANIMATION}ms ease`,
                        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                        transform: "translateY(0)",
                        fontSize: "14px",
                    },
                );

                const shine = makeElement(
                    "div", {}, {
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)",
                        transform: "translateX(-100%)",
                        transition: `transform ${BUTTON_ANIMATION * 1.5}ms ease-out`,
                        pointerEvents: "none",
                    },
                );
                button.appendChild(shine);

                button.onmouseover = () => {
                    button.style.background = BUTTON_HOVER_COLOR;
                    button.style.transform = "translateY(-3px) scale(1.02)";
                    button.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
                    button.style.filter = "brightness(1.1)";
                    shine.style.transform = "translateX(100%)";
                };

                button.onmouseout = () => {
                    button.style.background = BUTTON_COLOR;
                    button.style.transform = "translateY(0) scale(1)";
                    button.style.boxShadow = "0 3px 6px rgba(0,0,0,0.15)";
                    button.style.filter = "brightness(1)";
                    shine.style.transform = "translateX(-100%)";
                };

                button.onmousedown = () => {
                    button.style.transform = "translateY(0) scale(0.98)";
                    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
                    button.style.background = BUTTON_ACTIVE_COLOR;
                    button.style.filter = "brightness(1.2)";
                };

                button.onmouseup = () => {
                    button.style.transform = "translateY(-3px) scale(1.02)";
                    button.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
                    button.style.background = BUTTON_HOVER_COLOR;
                    button.style.filter = "brightness(1.1)";
                };

                button.onclick = (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const ripple = makeElement(
                        "div", {}, {
                            position: "absolute",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.4)",
                            width: "5px",
                            height: "5px",
                            transform: "scale(1)",
                            opacity: "1",
                            animation: "ripple 600ms linear",
                            pointerEvents: "none",
                            top: `${y}px`,
                            left: `${x}px`,
                            marginLeft: "-2.5px",
                            marginTop: "-2.5px",
                        },
                    );

                    button.appendChild(ripple);

                    exportFormat = type;
                    closeV();
                    extraction();

                    setTimeout(() => ripple.remove(), 600);
                };

                buttonContainer.appendChild(button);
            });

            if (!document.getElementById("char-export-style")) {
                const style = document.createElement("style");
                style.id = "char-export-style";
                style.textContent = `
            @keyframes ripple {
              to {
                transform: scale(30);
                opacity: 0; pointer-events: none;
              }
            }
          `;
                document.head.appendChild(style);
            }

            if (!document.getElementById("char-export-responsive")) {
                const responsiveStyle = document.createElement("style");
                responsiveStyle.id = "char-export-responsive";
                responsiveStyle.textContent = `
      @media (max-width: 600px) {
        #char-export-gui {
          width: 95vw !important;
          height: 90vh !important;
          max-height: 90vh !important;
          padding: 10px 15px 5px !important;
        }

        #content-wrapper {
          min-height: 280px !important;
        }

        #export-tab, #settings-tab {
          padding: 10px !important;
        }

        .toggle-wrapper {
          flex-direction: column;
          align-items: flex-start !important;
          gap: 8px !important;
        }

        .toggle-wrapper span {
          order: 1 !important;
          padding-left: 0 !important;
          text-align: left !important;
        }

        .toggle-wrapper label {
          order: 2 !important;
          align-self: flex-end;
        }
      }

      @media (max-height: 600px) {
        #char-export-gui {
          max-height: 95vh !important;
        }
      }
        `;
                document.head.appendChild(responsiveStyle);
            }



            exportContent.appendChild(buttonContainer);

            // Character Preview Section (for showdefinition=true)

            const previewSection = makeElement(
                "div", {
                    id: "character-preview",
                }, {
                    marginTop: "20px",
                    padding: "20px",
                    background: "linear-gradient(135deg, #2a2a2a 0%, #2e2e2e 100%)",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    border: "1px solid #444",
                    display: "block",
                    opacity: "1",
                    transform: "translateY(0)",
                    transition: "all 300ms ease",
                },
            );

            const previewTitle = makeElement(
                "h3", {
                    textContent: "CHARACTER PREVIEW",
                }, {
                    margin: "0 0 20px 0",
                    fontSize: "18px",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    borderBottom: "2px solid #0080ff",
                    paddingBottom: "10px",
                },
            );
            previewSection.appendChild(previewTitle);

            // Character Info Header
            const characterHeader = makeElement(
                "div", {}, {
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                    marginBottom: "25px",
                    padding: "15px",
                    background: "rgba(0, 128, 255, 0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 128, 255, 0.3)",
                },
            );

            // Avatar Section
            const avatarFrame = makeElement(
                "div", {}, {
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "linear-gradient(145deg, #333, #1a1a1a)",
                    border: "2px solid #555",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    position: "relative",
                    flexShrink: "0",
                },
            );

            const avatarImg = makeElement(
                "img", {
                    id: "preview-avatar",
                    alt: "Character Avatar",
                }, {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                },
            );

            avatarFrame.appendChild(avatarImg);

            // Character Info
            const characterInfo = makeElement(
                "div", {}, {
                    flex: "1",
                    minWidth: "0",
                },
            );

            const characterName = makeElement(
                "h4", {
                    id: "preview-character-name",
                }, {
                    margin: "0 0 8px 0",
                    fontSize: "20px",
                    color: "#fff",
                    fontWeight: "bold",
                    wordBreak: "break-word",
                },
            );

            const characterChatName = makeElement(
                "div", {
                    id: "preview-chat-name",
                }, {
                    fontSize: "14px",
                    color: "#4CAF50",
                    marginBottom: "8px",
                    display: "none",
                },
            );

            const characterCreator = makeElement(
                "div", {
                    id: "preview-creator-info",
                }, {
                    fontSize: "13px",
                    color: "#888",
                    marginBottom: "5px",
                },
            );

            const characterTokens = makeElement(
                "div", {
                    id: "preview-tokens",
                }, {
                    fontSize: "12px",
                    color: "#4CAF50",
                    fontWeight: "bold",
                },
            );

            const characterStats = makeElement(
                "div", {
                    id: "preview-stats",
                }, {
                    fontSize: "12px",
                    color: "#66BB6A",
                    fontWeight: "normal",
                    marginTop: "4px",
                },
            );

            characterInfo.appendChild(characterName);
            characterInfo.appendChild(characterChatName);
            characterInfo.appendChild(characterCreator);
            characterInfo.appendChild(characterTokens);
            characterInfo.appendChild(characterStats);

            characterHeader.appendChild(avatarFrame);
            characterHeader.appendChild(characterInfo);
            previewSection.appendChild(characterHeader);

            // Collapsible sections container
            const sectionsContainer = makeElement(
                "div", {
                    id: "collapsible-sections",
                }, {
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                },
            );

            // Custom SVG Icons
            const customIcons = {
                description: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>`,
                scenario: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                <path d="M12 8v4l-2-1"/>
                            </svg>`,
                firstMessage: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                <path d="M8 10h8"/>
                                <path d="M8 14h4"/>
                            </svg>`,
                examples: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                <path d="M13 8H7"/>
                                <path d="M17 12H7"/>
                                <circle cx="17" cy="8" r="1"/>
                            </svg>`,
                creatorNotes: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5V5a2 2 0 0 1 2-2h9l5 5v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5z"/>
                                <path d="M14 3v5h5"/>
                                <line x1="8" y1="13" x2="16" y2="13"/>
                                <line x1="8" y1="17" x2="16" y2="17"/>
                            </svg>`
            };

            // Dynamic theme variables with enhanced color palette
            let currentTheme = {
                primary: '#0080ff',
                secondary: '#4CAF50',
                accent: '#ff6b6b',
                tertiary: '#9c27b0',
                quaternary: '#ff9800',
                background: 'linear-gradient(135deg, #2a2a2a 0%, #2e2e2e 100%)',
                headerBorder: 'linear-gradient(90deg, #0080ff 0%, #4CAF50 50%, #ff6b6b 100%)',
                panelBorder: 'linear-gradient(90deg, #0080ff 0%, #4CAF50 50%, #ff6b6b 100%)'
            };

            // Enhanced color analysis function using ColorThief
            // Lightweight color extraction with CORS bypass
            function analyzeImageColors(imageElement) {
                return new Promise((resolve) => {
                    try {
                        // Fetch the image as a blob to bypass CORS
                        fetch(imageElement.src)
                            .then(response => response.blob())
                            .then(blob => {
                                const blobUrl = URL.createObjectURL(blob);
                                extractColorsFromBlob(blobUrl, resolve);
                            })
                            .catch(error => {
                                console.warn('Failed to fetch image:', error);
                                resolve(getDefaultTheme());
                            });
                    } catch (error) {
                        console.warn('Color extraction setup failed:', error);
                        resolve(getDefaultTheme());
                    }
                });
            }

            function extractColorsFromBlob(blobUrl, resolve) {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    // Set canvas size (smaller for performance)
                    canvas.width = 150;
                    canvas.height = 150;

                    img.onload = () => {
                        try {
                            // Draw image to canvas
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            // Get image data
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imageData.data;

                            // Color quantization - group similar colors
                            const colorMap = new Map();
                            const step = 4; // Sample every pixel

                            for (let i = 0; i < data.length; i += step * 4) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                const alpha = data[i + 3];

                                // Skip transparent pixels
                                if (alpha < 128) continue;

                                // Quantize colors to reduce similar shades
                                const qr = Math.floor(r / 16) * 16;
                                const qg = Math.floor(g / 16) * 16;
                                const qb = Math.floor(b / 16) * 16;

                                const key = `${qr},${qg},${qb}`;

                                if (colorMap.has(key)) {
                                    const existing = colorMap.get(key);
                                    existing.count++;
                                    existing.totalR += r;
                                    existing.totalG += g;
                                    existing.totalB += b;
                                } else {
                                    colorMap.set(key, {
                                        count: 1,
                                        totalR: r,
                                        totalG: g,
                                        totalB: b
                                    });
                                }
                            }

                            // Convert to array and calculate averages
                            const colors = Array.from(colorMap.values())
                                .map(color => ({
                                    r: Math.round(color.totalR / color.count),
                                    g: Math.round(color.totalG / color.count),
                                    b: Math.round(color.totalB / color.count),
                                    count: color.count
                                }))
                                .filter(color => {
                                    // Filter out very dark, very light, or very gray colors
                                    const brightness = (color.r + color.g + color.b) / 3;
                                    const saturation = Math.abs(Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b));
                                    return brightness > 30 && brightness < 220 && saturation > 25;
                                })
                                .sort((a, b) => b.count - a.count) // Sort by frequency
                                .slice(0, 8); // Take top 8 colors

                            if (colors.length === 0) {
                                // If no colors pass the filter, use less strict filtering
                                const fallbackColors = Array.from(colorMap.values())
                                    .map(color => ({
                                        r: Math.round(color.totalR / color.count),
                                        g: Math.round(color.totalG / color.count),
                                        b: Math.round(color.totalB / color.count),
                                        count: color.count
                                    }))
                                    .filter(color => {
                                        const brightness = (color.r + color.g + color.b) / 3;
                                        return brightness > 20 && brightness < 235;
                                    })
                                    .sort((a, b) => b.count - a.count)
                                    .slice(0, 6);

                                resolve(generateThemeFromColors(fallbackColors));
                            } else {
                                resolve(generateThemeFromColors(colors));
                            }

                        } catch (error) {
                            console.warn('Color extraction failed:', error);
                            resolve(getDefaultTheme());
                        } finally {
                            // Clean up blob URL
                            URL.revokeObjectURL(blobUrl);
                        }
                    };

                    img.onerror = () => {
                        console.warn('Image loading failed for blob URL');
                        resolve(getDefaultTheme());
                        URL.revokeObjectURL(blobUrl);
                    };

                    // Load the blob URL
                    img.src = blobUrl;

                } catch (error) {
                    console.warn('Blob color extraction failed:', error);
                    resolve(getDefaultTheme());
                    URL.revokeObjectURL(blobUrl);
                }
            }

            function generateThemeFromColors(colors) {
                if (!colors || colors.length === 0) {
                    return getDefaultTheme();
                }

                // Convert RGB to hex
                const toHex = (r, g, b) => `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`;

                // Create gradient from multiple colors
                const createGradient = (colorArray, direction = '90deg') => {
                    if (colorArray.length === 1) {
                        return toHex(colorArray[0].r, colorArray[0].g, colorArray[0].b);
                    }

                    const colorStops = colorArray.slice(0, 6).map((color, index) => {
                        const percentage = (index / Math.max(1, colorArray.length - 1)) * 100;
                        return `${toHex(color.r, color.g, color.b)} ${percentage}%`;
                    }).join(', ');

                    return `linear-gradient(${direction}, ${colorStops})`;
                };

                // Calculate color vibrancy (saturation * brightness)
                const calculateVibrancy = (color) => {
                    const max = Math.max(color.r, color.g, color.b);
                    const min = Math.min(color.r, color.g, color.b);
                    const saturation = max === 0 ? 0 : (max - min) / max;
                    const brightness = (color.r + color.g + color.b) / (3 * 255);
                    return saturation * brightness;
                };

                // Sort colors by vibrancy for better theme selection
                const sortedColors = colors.slice().sort((a, b) => {
                    const vibrancyA = calculateVibrancy(a);
                    const vibrancyB = calculateVibrancy(b);
                    return vibrancyB - vibrancyA;
                });

                // Select diverse colors for theme roles
                const themeColors = [];

                // Primary: Most vibrant color
                if (sortedColors[0]) {
                    themeColors.push(toHex(sortedColors[0].r, sortedColors[0].g, sortedColors[0].b));
                }

                // Secondary: Find a contrasting color
                let secondaryIndex = 1;
                if (sortedColors.length > 2) {
                    for (let i = 1; i < Math.min(sortedColors.length, 4); i++) {
                        const colorDiff = Math.abs(sortedColors[0].r - sortedColors[i].r) +
                            Math.abs(sortedColors[0].g - sortedColors[i].g) +
                            Math.abs(sortedColors[0].b - sortedColors[i].b);
                        if (colorDiff > 80) {
                            secondaryIndex = i;
                            break;
                        }
                    }
                }
                if (sortedColors[secondaryIndex]) {
                    themeColors.push(toHex(sortedColors[secondaryIndex].r, sortedColors[secondaryIndex].g, sortedColors[secondaryIndex].b));
                }

                // Add remaining colors for accent, tertiary, quaternary
                for (let i = 0; i < sortedColors.length && themeColors.length < 5; i++) {
                    const hex = toHex(sortedColors[i].r, sortedColors[i].g, sortedColors[i].b);
                    if (!themeColors.includes(hex)) {
                        themeColors.push(hex);
                    }
                }

                // Fill with defaults if needed
                const defaults = ['#0080ff', '#4CAF50', '#ff6b6b', '#9c27b0', '#ff9800'];
                while (themeColors.length < 5) {
                    themeColors.push(defaults[themeColors.length]);
                }

                // Create background gradient using darker versions of the colors
                const darkenColor = (hex, amount = 0.7) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);

                    const newR = Math.round(r * (1 - amount));
                    const newG = Math.round(g * (1 - amount));
                    const newB = Math.round(b * (1 - amount));

                    return `#${[newR, newG, newB].map(x => Math.max(0, x).toString(16).padStart(2, '0')).join('')}`;
                };

                const theme = {
                    name: 'dynamic',
                    primary: themeColors[0],
                    secondary: themeColors[1] || '#4CAF50',
                    accent: themeColors[2] || '#ff6b6b',
                    tertiary: themeColors[3] || '#9c27b0',
                    quaternary: themeColors[4] || '#ff9800',
                    background: `linear-gradient(135deg, ${darkenColor(themeColors[0], 0.8)} 0%, ${darkenColor(themeColors[1] || themeColors[0], 0.8)} 100%)`,
                    headerBorder: createGradient(sortedColors.slice(0, 4), '90deg'),
                    panelBorder: createGradient(sortedColors.slice().reverse().slice(0, 4), '90deg')
                };

                return [theme];
            }

            // Helper to return the default theme
            function getDefaultTheme() {
                return [{
                    name: 'default',
                    primary: '#0080ff',
                    secondary: '#4CAF50',
                    accent: '#ff6b6b',
                    tertiary: '#9c27b0',
                    quaternary: '#ff9800',
                    background: 'linear-gradient(135deg, #2a2a2a 0%, #2e2e2e 100%)',
                    headerBorder: 'linear-gradient(90deg, #0080ff 0%, #4CAF50 50%, #ff6b6b 100%)',
                    panelBorder: 'linear-gradient(90deg, #0080ff 0%, #4CAF50 50%, #ff6b6b 100%)'
                }];
            }


            function updatePlaceholderColors() {
                const sections = ['description', 'scenario', 'firstMessage', 'examples', 'creatorNotes'];

                sections.forEach(sectionId => {
                    const contentText = document.getElementById(`content-${sectionId}`);
                    if (contentText) {
                        const displayText = contentText.textContent;

                        // Only update if it's a placeholder text
                        if (isPlaceholderText(displayText)) {
                            let placeholderColor, placeholderBg, placeholderBorder;

                            if (displayText.includes("Definition not exposed")) {
                                // Use secondary color for hidden definitions
                                placeholderColor = currentTheme.secondary;
                                placeholderBg = `${currentTheme.secondary}15`;
                                placeholderBorder = `${currentTheme.secondary}40`;
                            } else if (displayText.includes("No") && displayText.includes("available")) {
                                // Use primary color for missing content
                                placeholderColor = currentTheme.primary;
                                placeholderBg = `${currentTheme.primary}15`;
                                placeholderBorder = `${currentTheme.primary}40`;
                            } else {
                                // Default to accent color
                                placeholderColor = currentTheme.accent;
                                placeholderBg = `${currentTheme.accent}15`;
                                placeholderBorder = `${currentTheme.accent}40`;
                            }

                            contentText.style.color = placeholderColor;
                            contentText.style.background = `linear-gradient(135deg, ${placeholderBg} 0%, transparent 100%)`;
                            contentText.style.border = `1px dashed ${placeholderBorder}`;
                        }
                    }
                });
            }

            function applyTheme(theme) {
                currentTheme = theme;

                // Update preview section background and border
                previewSection.style.background = theme.background;
                previewSection.style.border = `2px solid transparent`;
                previewSection.style.backgroundImage = `${theme.background}, ${theme.panelBorder}`;
                previewSection.style.backgroundOrigin = 'border-box';
                previewSection.style.backgroundClip = 'padding-box, border-box';

                // Calculate brightness of primary color to determine theme approach
                const primaryRgb = hexToRgb(theme.primary);
                const brightness = (primaryRgb.r * 299 + primaryRgb.g * 587 + primaryRgb.b * 114) / 1000;
                const isVeryBright = brightness > 180;

                // Enhanced header with dual approach: vibrant vs readable
                const secondaryRgb = hexToRgb(theme.secondary);
                const accentRgb = hexToRgb(theme.accent);

                if (isVeryBright) {
                    // For bright colors: Use vibrant background with strong text contrast
                    const vibrantGradient = `linear-gradient(135deg,
                        rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.85) 0%,
                        rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.75) 50%,
                        rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.85) 100%)`;

                    characterHeader.style.background = vibrantGradient;
                    characterHeader.style.border = `3px solid ${theme.primary}`;
                    characterHeader.style.boxShadow = `
                        0 6px 25px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4),
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 0 rgba(0,0,0,0.3)`;

                    // Strong text contrast for bright backgrounds
                    applyTextStyles('#000000', '0 1px 2px rgba(255,255,255,0.8)', '#1a5d1a', '#1a5d1a');

                } else {
                    // For darker colors: Use subtle overlay with good contrast
                    const subtleGradient = `linear-gradient(135deg,
                        rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.25) 0%,
                        rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.20) 50%,
                        rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.25) 100%)`;

                    const patternOverlay = `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
                                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`;

                    characterHeader.style.background = `${subtleGradient}, ${patternOverlay}, rgba(0,0,0,0.7)`;
                    characterHeader.style.border = `2px solid transparent`;
                    characterHeader.style.backgroundImage = `${subtleGradient}, ${patternOverlay}, rgba(0,0,0,0.7), ${theme.headerBorder}`;
                    characterHeader.style.backgroundOrigin = 'border-box';
                    characterHeader.style.backgroundClip = 'padding-box, border-box';
                    characterHeader.style.boxShadow = `
                        0 4px 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3),
                        inset 0 1px 0 rgba(255,255,255,0.1),
                        inset 0 -1px 0 rgba(0,0,0,0.2)`;

                    // Light text for darker backgrounds
                    applyTextStyles('#ffffff', '0 2px 4px rgba(0,0,0,0.8)', '#4CAF50', '#4CAF50');
                }

                // Update title border and background
                previewTitle.style.borderBottomColor = theme.primary;
                previewTitle.style.background = `linear-gradient(90deg, ${theme.primary}20, ${theme.secondary}20, ${theme.accent}20)`;
                previewTitle.style.borderRadius = '4px';
                previewTitle.style.padding = '10px';

                // Update section icons to use primary color
                const sectionIcons = document.querySelectorAll('.collapsible-section svg');
                sectionIcons.forEach(icon => {
                    icon.style.color = theme.primary;
                });

                // Update all copy button colors to match new theme
                const copyButtons = document.querySelectorAll('.copy-btn');
                copyButtons.forEach(button => {
                    button.style.borderColor = `${theme.primary}40`;
                    button.style.color = theme.primary;
                    button.style.boxShadow = `0 2px 8px ${theme.primary}20`;
                    // Update SVG stroke color
                    const svg = button.querySelector('svg');
                    if (svg) svg.setAttribute('stroke', theme.primary);
                });
                updatePlaceholderColors();
            }

            function applyTextStyles(nameColor, textShadow, tokenColor) {
                const nameElement = document.getElementById('preview-character-name');
                const creatorElement = document.getElementById('preview-creator-info');
                const tokensElement = document.getElementById('preview-tokens');
                const chatNameElement = document.getElementById('preview-chat-name');

                if (nameElement) {
                    nameElement.style.color = nameColor;
                    nameElement.style.textShadow = textShadow;
                    nameElement.style.fontWeight = 'bold';
                }

                if (creatorElement) {
                    creatorElement.style.color = nameColor === '#000000' ? '#333333' : '#e0e0e0';
                    creatorElement.style.textShadow = textShadow;
                    creatorElement.style.fontWeight = 'bold';
                }

                if (tokensElement) {
                    // Check if showing warning icon - if so, preserve the yellow color
                    const hasWarningIcon = tokensElement.innerHTML.includes('⚠️');
                    // Check if showing exposed definition green color - if so, preserve it
                    const hasExposedDefinitionColor = tokensElement.style.color === 'rgb(48, 255, 55)' || tokensElement.style.color === '#30ff37ff';

                    if (!hasWarningIcon && !hasExposedDefinitionColor) {
                        tokensElement.style.color = tokenColor;
                    }
                    // Reduce text shadow stroke
                    tokensElement.style.textShadow = '0 1px 2px rgba(0,0,0,0.7)';
                    tokensElement.style.fontWeight = 'bold';
                }

                if (chatNameElement) {
                    chatNameElement.style.color = '#ff9800';
                    chatNameElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 1)';
                    chatNameElement.style.fontWeight = 'bold';
                }
            }

            // Helper function to convert hex to RGB
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : {
                    r: 0,
                    g: 128,
                    b: 255
                }; // fallback to blue
            }

            // Function to create collapsible section with enhanced bars and copy functionality (NO BOTTOM BARS)
            function createCollapsibleSection(id, title, iconSvg) {
                const sectionWrapper = makeElement(
                    "div", {
                        id: `section-${id}`,
                        className: "collapsible-section",
                    }, {
                        marginBottom: "12px",
                    },
                );

                // --- FIX: State management for copy button to prevent hover/click bugs ---
                let revertIconTimeout = null;
                let isSuccessState = false;
                let copyButtonAnimationTimeout = null;

                // Title above the panel (centered)
                const sectionTitle = makeElement(
                    "div", {}, {
                        textAlign: "center",
                        marginBottom: "8px",
                    },
                );

                const titleContent = makeElement(
                    "div", {}, {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                    },
                );

                const titleIcon = makeElement(
                    "div", {
                        innerHTML: iconSvg,
                    }, {
                        display: "flex",
                        alignItems: "center",
                        color: currentTheme.primary,
                    },
                );

                const titleText = makeElement(
                    "span", {
                        textContent: title,
                    }, {},
                );

                titleContent.appendChild(titleIcon);
                titleContent.appendChild(titleText);
                sectionTitle.appendChild(titleContent);
                sectionWrapper.appendChild(sectionTitle);

                // Panel container
                const panelContainer = makeElement(
                    "div", {
                        className: "panel-container",
                    }, {
                        background: "#1a1a1a",
                        borderRadius: "6px",
                        border: "1px solid #444",
                        overflow: "hidden",
                        transition: "all 200ms ease",
                        position: "relative",
                    },
                );

                // Top bar (clickable) - enhanced with better gradient
                const topBar = makeElement(
                    "div", {
                        className: "panel-bar top-bar",
                    }, {
                        height: "12px",
                        background: "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)",
                        cursor: "pointer",
                        transition: "all 200ms ease",
                        position: "relative",
                    },
                );

                // Content area
                const contentArea = makeElement(
                    "div", {
                        className: "content-area",
                    }, {
                        maxHeight: "0px",
                        overflow: "hidden",
                        transition: "max-height 350ms cubic-bezier(0.4, 0, 0.2, 1)",
                        background: "#222",
                        position: "relative", // Important for copy button positioning
                    },
                );

                const contentText = makeElement(
                    "div", {
                        className: "content-text",
                        id: `content-${id}`,
                    }, {
                        padding: "16px 50px 16px 20px", // Extra right padding for copy button
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#ddd",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        position: "relative",
                        userSelect: "text", // Make text selectable
                        cursor: "text", // Show text cursor
                    },
                );

                // Copy button - positioned as proper overlay with theme colors
                const copyButton = makeElement(
                    "button", {
                        className: "copy-btn",
                        innerHTML: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"/></svg>',
                        title: "Copy to clipboard",
                    }, {
                        position: "absolute",
                        top: "8px", // Moved down from top bar
                        right: "8px",
                        background: "transparent",
                        border: `1px solid ${currentTheme.primary}40`, // Use theme with opacity
                        borderRadius: "6px",
                        color: currentTheme.primary, // Use theme color
                        padding: "6px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        opacity: "0.6", // More subtle idle state
                        transform: "scale(1)",
                        transition: "all 200ms ease",
                        zIndex: "1000", // High z-index for overlay
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "28px",
                        minHeight: "28px",
                        boxShadow: `0 2px 8px ${currentTheme.primary}20`, // Theme-based shadow
                    },
                );

                // --- FIXED: Hover listeners now check the success state ---
                copyButton.addEventListener('mouseenter', () => {
                    if (isSuccessState) return; // Do nothing if in success state
                    copyButton.style.opacity = "1";
                    copyButton.style.transform = "scale(1.05)";
                    copyButton.style.borderColor = currentTheme.secondary;
                    copyButton.style.boxShadow = `0 4px 12px ${currentTheme.primary}40, 0 0 0 2px ${currentTheme.accent}30`;
                    copyButton.style.color = currentTheme.secondary;
                    const svg = copyButton.querySelector('svg');
                    if (svg) svg.setAttribute('stroke', currentTheme.secondary);
                });

                copyButton.addEventListener('mouseleave', () => {
                    if (isSuccessState) return; // Do nothing if in success state
                    copyButton.style.opacity = "0.6";
                    copyButton.style.transform = "scale(1)";
                    copyButton.style.borderColor = `${currentTheme.primary}40`;
                    copyButton.style.boxShadow = `0 2px 8px ${currentTheme.primary}20`;
                    copyButton.style.color = currentTheme.primary;
                    const svg = copyButton.querySelector('svg');
                    if (svg) svg.setAttribute('stroke', currentTheme.primary);
                });

                copyButton.addEventListener('click', (e) => {
                    e.stopPropagation();

                    clearTimeout(revertIconTimeout);
                    isSuccessState = false;

                    const content = contentText.textContent;
                    const placeholders = ["No description available", "No scenario available", "No first message available", "No examples available", "Definition not exposed"];
                    const isPlaceholder = placeholders.some(placeholder => content && content.trim() === placeholder);

                    if (content && content.trim() !== "" && !isPlaceholder) {
                        navigator.clipboard.writeText(content).then(() => {
                            showCopyNotification();
                            isSuccessState = true; // Enter success state

                            copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
                            copyButton.style.background = currentTheme.secondary || "#4CAF50";
                            copyButton.style.borderColor = currentTheme.secondary || "#66BB6A";
                            copyButton.style.color = "white";

                            revertIconTimeout = setTimeout(() => {
                                isSuccessState = false; // Exit success state
                                copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"/></svg>';
                                copyButton.style.background = "transparent";
                                copyButton.style.borderColor = `${currentTheme.primary}40`;
                                copyButton.style.color = currentTheme.primary;
                                copyButton.style.boxShadow = `0 2px 8px ${currentTheme.primary}20`;
                                const svg = copyButton.querySelector('svg');
                                if (svg) svg.setAttribute('stroke', currentTheme.primary);
                            }, 1500);
                        }).catch((err) => {
                            debugError("Clipboard write failed:", err);
                        });
                    }
                });


                panelContainer.appendChild(topBar);
                panelContainer.appendChild(contentArea);
                panelContainer.appendChild(copyButton);

                contentArea.appendChild(contentText);
                contentArea.appendChild(copyButton);

                let isExpanded = sessionStorage.getItem(`section-${id}-expanded`) === "true";

                // This is the animated toggle for user clicks
                function toggleSection() {
                    clearTimeout(copyButtonAnimationTimeout);
                    isExpanded = !isExpanded;
                    sessionStorage.setItem(`section-${id}-expanded`, isExpanded);

                    if (isExpanded) {
                        const scrollHeight = contentText.scrollHeight + 20;
                        contentArea.style.maxHeight = scrollHeight + "px";
                        panelContainer.style.borderColor = currentTheme.primary;
                        topBar.style.background = `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`;
                        const hasValidContent = contentText.textContent && !isPlaceholderText(contentText.textContent.trim());
                        if (hasValidContent) {
                            copyButton.style.display = "flex";
                            requestAnimationFrame(() => {
                                copyButton.style.opacity = "0.6";
                                copyButton.style.transform = "scale(1)";
                            });
                        }
                    } else {
                        contentArea.style.maxHeight = "0px";
                        panelContainer.style.borderColor = "#444";
                        topBar.style.background = "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)";

                        // Fade out copy button before hiding it
                        copyButton.style.opacity = "0";
                        copyButton.style.transform = "scale(0.8)";
                        copyButtonAnimationTimeout = setTimeout(() => {
                            copyButton.style.display = "none";
                        }, 200); // Match the fade transition duration
                    }

                }

                // --- FIXED: Set initial state ONCE on load, without animation ---
                // We wait for the DOM to settle to get the correct scrollHeight
                setTimeout(() => {
                    if (isExpanded) {
                        contentArea.style.transition = 'none'; // Temporarily disable animation

                        const scrollHeight = contentText.scrollHeight + 20;
                        contentArea.style.maxHeight = scrollHeight + "px";
                        panelContainer.style.borderColor = currentTheme.primary;
                        topBar.style.background = `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`;

                        const hasValidContent = contentText.textContent && !isPlaceholderText(contentText.textContent.trim());
                        if (hasValidContent) {
                            copyButton.style.display = "flex";
                            copyButton.style.opacity = "0.6";
                        }

                        // Re-enable animation for subsequent user clicks
                        requestAnimationFrame(() => {
                            contentArea.style.transition = 'max-height 350ms cubic-bezier(0.4, 0, 0.2, 1)';

                            // Restore scroll position after collapsibles are ready
                            if (typeof restoreScrollPosition === 'function') {
                                restoreScrollPosition();
                            }
                        });
                    } else {
                        // Also restore scroll for non-expanded sections
                        requestAnimationFrame(() => {
                            if (typeof restoreScrollPosition === 'function') {
                                restoreScrollPosition();
                            }
                        });
                    }
                }, 100);

                topBar.addEventListener('mouseenter', () => {
                    if (!isExpanded) {
                        topBar.style.background = "linear-gradient(90deg, #555 0%, #666 50%, #555 100%)";
                    }
                });
                topBar.addEventListener('mouseleave', () => {
                    if (!isExpanded) {
                        topBar.style.background = "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)";
                    }
                });

                topBar.addEventListener('click', toggleSection);

                sectionWrapper.appendChild(panelContainer);

                return {
                    element: sectionWrapper,
                    setContent: (text) => {
                        const hasContent = text && text.trim() !== "" && !isPlaceholderText(text.trim());

                        if (hasContent) {
                            contentText.textContent = text;
                            contentText.style.color = "#ddd";
                            contentText.style.fontStyle = "normal";
                            contentText.style.textAlign = "center";
                            contentText.style.background = "transparent";
                            contentText.style.border = "none";
                            contentText.style.opacity = "1";
                            contentText.style.userSelect = "text";
                            contentText.style.cursor = "text";
                            contentText.style.padding = "16px 50px 16px 20px";
                        } else {
                            const displayText = text && text.trim() !== "" ? text : "No content available";
                            contentText.textContent = displayText;

                            // Use primary/secondary colors from image palette for all placeholders
                            let placeholderColor, placeholderBg, placeholderBorder;

                            if (displayText.includes("Definition not exposed")) {
                                // Use secondary color for hidden definitions
                                placeholderColor = currentTheme.secondary;
                                placeholderBg = `${currentTheme.secondary}15`;
                                placeholderBorder = `${currentTheme.secondary}40`;
                            } else if (displayText.includes("No") && displayText.includes("available")) {
                                // Use primary color for missing content
                                placeholderColor = currentTheme.primary;
                                placeholderBg = `${currentTheme.primary}15`;
                                placeholderBorder = `${currentTheme.primary}40`;
                            } else {
                                // Default to accent color
                                placeholderColor = currentTheme.accent;
                                placeholderBg = `${currentTheme.accent}15`;
                                placeholderBorder = `${currentTheme.accent}40`;
                            }

                            contentText.style.color = placeholderColor;
                            contentText.style.fontStyle = "italic";
                            contentText.style.opacity = "0.8";
                            contentText.style.textAlign = "center";
                            contentText.style.background = `linear-gradient(135deg, ${placeholderBg} 0%, transparent 100%)`;
                            contentText.style.borderRadius = "4px";
                            contentText.style.border = `1px dashed ${placeholderBorder}`;
                            contentText.style.fontSize = "12px";
                            contentText.style.userSelect = "none";
                            contentText.style.cursor = "default";
                            contentText.style.padding = "16px 20px";
                        }

                        // This part is for when content is set AFTER initial render.
                        // It helps update the state correctly.
                        if (isExpanded) {
                            if (hasContent) {
                                copyButton.style.display = "flex";
                            } else {
                                copyButton.style.display = "none";
                            }
                            // A small delay to ensure `scrollHeight` is updated in the DOM
                            setTimeout(() => {
                                contentArea.style.maxHeight = (contentText.scrollHeight + 20) + "px";
                            }, 50);
                            // Re-measure after images load (toggle may add/remove images)
                            const imgs = contentText.querySelectorAll('img');
                            const adjust = () => {
                                if (isExpanded) {
                                    contentArea.style.maxHeight = (contentText.scrollHeight + 20) + "px";
                                }
                            };
                            imgs.forEach(img => {
                                if (img.complete) {
                                    adjust();
                                } else {
                                    img.addEventListener('load', adjust, {
                                        once: true
                                    });
                                    img.addEventListener('error', adjust, {
                                        once: true
                                    });
                                }
                            });
                        }
                    }
                };
            }

            // HTML-capable collapsible section specifically for Creator's Notes
            function createHtmlCollapsibleSection(id, title, iconSvg) {
                const sectionWrapper = makeElement(
                    "div", {
                        id: `section-${id}`,
                        className: "collapsible-section",
                    }, {
                        marginBottom: "12px",
                    },
                );

                let revertIconTimeout = null;
                let isSuccessState = false;
                let copyButtonAnimationTimeout = null;

                const sectionTitle = makeElement(
                    "div", {}, {
                        textAlign: "center",
                        marginBottom: "8px",
                    },
                );

                const titleContent = makeElement(
                    "div", {}, {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                    },
                );

                const titleIcon = makeElement(
                    "div", {
                        innerHTML: iconSvg
                    }, {
                        display: "flex",
                        alignItems: "center",
                        color: currentTheme.primary,
                    },
                );

                const titleText = makeElement("span", {
                    textContent: title
                }, {});
                titleContent.appendChild(titleIcon);
                titleContent.appendChild(titleText);
                sectionTitle.appendChild(titleContent);
                sectionWrapper.appendChild(sectionTitle);

                const panelContainer = makeElement(
                    "div", {
                        className: "panel-container"
                    }, {
                        background: "#1a1a1a",
                        borderRadius: "6px",
                        border: "1px solid #444",
                        overflow: "hidden",
                        transition: "all 200ms ease",
                        position: "relative",
                    },
                );

                const topBar = makeElement(
                    "div", {
                        className: "panel-bar top-bar"
                    }, {
                        height: "12px",
                        background: "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)",
                        cursor: "pointer",
                        transition: "all 200ms ease",
                        position: "relative",
                    },
                );

                const contentArea = makeElement(
                    "div", {
                        className: "content-area"
                    }, {
                        maxHeight: "0px",
                        overflow: "hidden",
                        transition: "max-height 350ms cubic-bezier(0.4, 0, 0.2, 1)",
                        background: "#222",
                        position: "relative",
                    },
                );

                const contentText = makeElement(
                    "div", {
                        className: "content-text",
                        id: `content-${id}`
                    }, {
                        padding: "16px 50px 16px 20px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#ddd",
                        whiteSpace: "normal", // allow HTML to wrap naturally
                        wordBreak: "break-word",
                        position: "relative",
                        userSelect: "text",
                        cursor: "text",
                    },
                );

                const copyButton = makeElement(
                    "button", {
                        className: "copy-btn",
                        innerHTML: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"/></svg>',
                        title: "Copy to clipboard",
                    }, {
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "transparent",
                        border: `1px solid ${currentTheme.primary}40`,
                        borderRadius: "6px",
                        color: currentTheme.primary,
                        padding: "6px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        opacity: "0.6",
                        transform: "scale(1)",
                        transition: "all 200ms ease",
                        zIndex: "1000",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "28px",
                        minHeight: "28px",
                        boxShadow: `0 2px 8px ${currentTheme.primary}20`,
                    },
                );

                copyButton.addEventListener('mouseenter', () => {
                    if (isSuccessState) return;
                    copyButton.style.opacity = "1";
                    copyButton.style.transform = "scale(1.05)";
                    copyButton.style.borderColor = currentTheme.secondary;
                    copyButton.style.boxShadow = `0 4px 12px ${currentTheme.primary}40, 0 0 0 2px ${currentTheme.accent}30`;
                    copyButton.style.color = currentTheme.secondary;
                    const svg = copyButton.querySelector('svg');
                    if (svg) svg.setAttribute('stroke', currentTheme.secondary);
                });
                copyButton.addEventListener('mouseleave', () => {
                    if (isSuccessState) return;
                    copyButton.style.opacity = "0.6";
                    copyButton.style.transform = "scale(1)";
                    copyButton.style.borderColor = `${currentTheme.primary}40`;
                    copyButton.style.boxShadow = `0 2px 8px ${currentTheme.primary}20`;
                    copyButton.style.color = currentTheme.primary;
                    const svg = copyButton.querySelector('svg');
                    if (svg) svg.setAttribute('stroke', currentTheme.primary);
                });
                copyButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    clearTimeout(revertIconTimeout);
                    isSuccessState = false;
                    const content = contentText.textContent;
                    const placeholders = ["No content available"]; // minimal for notes
                    const isPlaceholder = placeholders.some(p => content && content.trim() === p);
                    if (content && content.trim() !== "" && !isPlaceholder) {
                        navigator.clipboard.writeText(content).then(() => {
                            showCopyNotification();
                            isSuccessState = true;
                            copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
                            copyButton.style.background = currentTheme.secondary || "#4CAF50";
                            copyButton.style.borderColor = currentTheme.secondary || "#66BB6A";
                            copyButton.style.color = "white";
                            revertIconTimeout = setTimeout(() => {
                                isSuccessState = false;
                                copyButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"/></svg>';
                                copyButton.style.background = "transparent";
                                copyButton.style.borderColor = `${currentTheme.primary}40`;
                                copyButton.style.color = currentTheme.primary;
                                copyButton.style.boxShadow = `0 2px 8px ${currentTheme.primary}20`;
                                const svg = copyButton.querySelector('svg');
                                if (svg) svg.setAttribute('stroke', currentTheme.primary);
                            }, 1500);
                        }).catch(() => {});
                    }
                });

                panelContainer.appendChild(topBar);
                panelContainer.appendChild(contentArea);
                panelContainer.appendChild(copyButton);
                contentArea.appendChild(contentText);
                contentArea.appendChild(copyButton);

                let isExpanded = sessionStorage.getItem(`section-${id}-expanded`) === "true";

                function toggleSection() {
                    clearTimeout(copyButtonAnimationTimeout);
                    isExpanded = !isExpanded;
                    sessionStorage.setItem(`section-${id}-expanded`, isExpanded);
                    if (isExpanded) {
                        const scrollHeight = contentText.scrollHeight + 20;
                        contentArea.style.maxHeight = scrollHeight + "px";
                        panelContainer.style.borderColor = currentTheme.primary;
                        topBar.style.background = `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`;
                        const hasValid = contentText.textContent && !isPlaceholderText(contentText.textContent.trim());
                        if (hasValid) {
                            copyButton.style.display = "flex";
                            requestAnimationFrame(() => {
                                copyButton.style.opacity = "0.6";
                                copyButton.style.transform = "scale(1)";
                            });
                        }
                    } else {
                        contentArea.style.maxHeight = "0px";
                        panelContainer.style.borderColor = "#444";
                        topBar.style.background = "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)";
                        copyButton.style.opacity = "0";
                        copyButton.style.transform = "scale(0.8)";
                        copyButtonAnimationTimeout = setTimeout(() => {
                            copyButton.style.display = "none";
                        }, 200);
                    }
                }

                setTimeout(() => {
                    if (isExpanded) {
                        contentArea.style.transition = 'none';
                        const scrollHeight = contentText.scrollHeight + 20;
                        contentArea.style.maxHeight = scrollHeight + "px";
                        panelContainer.style.borderColor = currentTheme.primary;
                        topBar.style.background = `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`;
                        const hasValid = contentText.textContent && !isPlaceholderText(contentText.textContent.trim());
                        if (hasValid) {
                            copyButton.style.display = "flex";
                            copyButton.style.opacity = "0.6";
                        }
                        requestAnimationFrame(() => {
                            contentArea.style.transition = 'max-height 350ms cubic-bezier(0.4, 0, 0.2, 1)';
                            if (typeof restoreScrollPosition === 'function') {
                                restoreScrollPosition();
                            }
                        });
                    } else {
                        requestAnimationFrame(() => {
                            if (typeof restoreScrollPosition === 'function') {
                                restoreScrollPosition();
                            }
                        });
                    }
                }, 100);

                topBar.addEventListener('mouseenter', () => {
                    if (!isExpanded) {
                        topBar.style.background = "linear-gradient(90deg, #555 0%, #666 50%, #555 100%)";
                    }
                });
                topBar.addEventListener('mouseleave', () => {
                    if (!isExpanded) {
                        topBar.style.background = "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)";
                    }
                });
                topBar.addEventListener('click', toggleSection);

                sectionWrapper.appendChild(panelContainer);


                return {
                    element: sectionWrapper,
                    setContent: (raw) => {
                        const hasContent = raw && String(raw).trim() !== "" && !isPlaceholderText(String(raw).trim());
                        if (hasContent) {
                            const autoImg = localStorage.getItem("renderNotesImages") === "true";
                            const html = buildCreatorNotesHtml(String(raw), autoImg);
                            if (html && html.trim() !== "") {
                                contentText.innerHTML = html;
                                contentText.style.color = "#ddd";
                                contentText.style.fontStyle = "normal";
                                contentText.style.background = "transparent";
                                contentText.style.border = "none";
                                contentText.style.opacity = "1";
                                contentText.style.userSelect = "text";
                                contentText.style.cursor = "text";
                                contentText.style.padding = "16px 50px 16px 20px";
                            } else {
                                contentText.textContent = "No content available";
                            }
                        } else {
                            contentText.textContent = "No content available";
                            // placeholder style
                            contentText.style.color = currentTheme.primary;
                            contentText.style.fontStyle = "italic";
                            contentText.style.opacity = "0.8";
                            contentText.style.textAlign = "center";
                            contentText.style.background = `${currentTheme.primary}15`;
                            contentText.style.borderRadius = "4px";
                            contentText.style.border = `1px dashed ${currentTheme.primary}40`;
                            contentText.style.fontSize = "12px";
                            contentText.style.userSelect = "none";
                            contentText.style.cursor = "default";
                            contentText.style.padding = "16px 20px";
                        }
                        if (isExpanded) {
                            const showCopy = contentText.textContent && !isPlaceholderText(contentText.textContent.trim());
                            copyButton.style.display = showCopy ? "flex" : "none";
                            setTimeout(() => {
                                contentArea.style.maxHeight = (contentText.scrollHeight + 20) + "px";
                            }, 50);
                        }
                    }
                };
            }

            // Simplified notification system - no queue, just replace
            let notificationTimeout = null;

            function showCopyNotification(message = "Copied to clipboard!") {
                // Clear any existing timeout
                if (notificationTimeout) {
                    clearTimeout(notificationTimeout);
                }

                // Remove any existing notification immediately
                const existingNotification = document.getElementById('copy-notification');
                if (existingNotification) {
                    existingNotification.remove();
                }

                const notification = makeElement(
                    "div", {
                        id: "copy-notification",
                        textContent: message,
                    }, {
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        background: `linear-gradient(135deg, ${currentTheme.primary}dd, ${currentTheme.secondary}dd)`,
                        color: "white",
                        padding: "12px 20px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        zIndex: "99999",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transform: "translateX(100%)",
                        transition: "transform 300ms ease",
                        border: `2px solid ${currentTheme.accent}`,
                        maxWidth: "300px",
                        wordBreak: "break-word",
                    },
                );

                document.body.appendChild(notification);

                // Animate in
                setTimeout(() => {
                    notification.style.transform = "translateX(0)";
                }, 10);

                // Animate out and remove
                notificationTimeout = setTimeout(() => {
                    notification.style.transform = "translateX(100%)";
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }, 2500);
            }

            // Create sections with custom SVG icons (NO FontAwesome)
            const descriptionSection = createCollapsibleSection('description', 'Description', customIcons.description);
            const scenarioSection = createCollapsibleSection('scenario', 'Scenario', customIcons.scenario);
            const firstMessageSection = createCollapsibleSection('firstMessage', 'First Message', customIcons.firstMessage);
            const examplesSection = createCollapsibleSection('examples', 'Examples', customIcons.examples);

            sectionsContainer.appendChild(descriptionSection.element);
            sectionsContainer.appendChild(scenarioSection.element);
            sectionsContainer.appendChild(firstMessageSection.element);
            sectionsContainer.appendChild(examplesSection.element);

            // Minimalist separator before Creator's Notes
            const notesSeparator = makeElement("div", {}, {
                height: "1px",
                background: "linear-gradient(90deg, transparent, #666, transparent)",
                margin: "8px 0 4px 0",
                opacity: "0.6",
            });

            const creatorNotesSection = createHtmlCollapsibleSection('creatorNotes', "Creator's Notes", customIcons.creatorNotes);
            sectionsContainer.appendChild(notesSeparator);
            sectionsContainer.appendChild(creatorNotesSection.element);

            previewSection.appendChild(sectionsContainer);

            // Links panel (clickable list with Open/Copy)
            const linksPanel = makeElement(
                "div", {
                    id: "links-found-panel"
                }, {
                    display: "none",
                    marginTop: "10px",
                    padding: "10px",
                    background: "#1e1e1e",
                    border: "1px solid #444",
                    borderRadius: "8px",
                }
            );

            // Minimalist tooltip for full URLs in Links panel (with continue-from-leftover animation)
            let linkTipEl = null;
            let linkTipHideTimer = null;
            let linkTipVisible = false;
            let linkTipCurrentAnchor = null; // track the anchor to decide fresh animation per-link
            function positionLinkTooltip(anchorEl) {
                if (!linkTipEl) return;
                const rect = anchorEl.getBoundingClientRect();
                const gap = 8;
                // Ensure we can measure current size
                const prevDisplay = linkTipEl.style.display;
                if (linkTipEl.style.display === 'none') linkTipEl.style.display = 'block';
                const tipRect = linkTipEl.getBoundingClientRect();
                let left = rect.left + (rect.width - tipRect.width) / 2;
                let top = rect.top - tipRect.height - gap;
                left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
                if (top < 8) top = rect.bottom + gap;
                linkTipEl.style.left = `${Math.round(left)}px`;
                linkTipEl.style.top = `${Math.round(top)}px`;
                // Restore display if we changed it just to measure
                if (prevDisplay === 'none') linkTipEl.style.display = 'none';
            }

            // Tooltip animation state token to cancel stale hides
            let linkTipStateToken = 0;

            function ensureLinkTip() {
                if (linkTipEl) return;
                linkTipEl = document.createElement('div');
                linkTipEl.id = 'links-hover-tooltip';
                linkTipEl.style.cssText = [
                    'position: fixed',
                    'z-index: 10003',
                    'max-width: min(80vw, 800px)',
                    'background: rgba(20,20,20,0.95)',
                    'color: #eaeaea',
                    'border: 1px solid #444',
                    'border-radius: 6px',
                    'padding: 6px 8px',
                    'font-size: 12px',
                    'line-height: 1.25',
                    'box-shadow: 0 4px 12px rgba(0,0,0,0.35)',
                    'pointer-events: none',
                    'opacity: 0',
                    'transform: translateY(-6px)',
                    'transition: opacity 160ms ease, transform 160ms ease'
                ].join(';');
                document.body.appendChild(linkTipEl);
            }

            function showLinkTooltip(anchorEl, url) {
                ensureLinkTip();

                // Cancel any pending hide so it doesn't fight with show
                if (linkTipHideTimer) {
                    clearTimeout(linkTipHideTimer);
                    linkTipHideTimer = null;
                }
                // Invalidate any previous hide callbacks
                linkTipStateToken++;
                const myToken = linkTipStateToken;

                // Determine if we're switching to a different anchor (force a fresh animation)
                const prevAnchor = linkTipCurrentAnchor;
                const switchingAnchor = !!(prevAnchor && prevAnchor !== anchorEl);
                linkTipCurrentAnchor = anchorEl;

                linkTipEl.textContent = url;
                positionLinkTooltip(anchorEl);

                // Continue-from-last-animation logic:
                // If tooltip is already visible or animating AND we're on the same anchor, continue from its current state.
                // If hidden OR switching to a different anchor, start slightly above and slide down while fading in.
                const cs = getComputedStyle(linkTipEl);
                const prevTransition = linkTipEl.style.transition;

                const wasVisible = linkTipVisible || (parseFloat(cs.opacity) > 0.01 && linkTipEl.style.display !== 'none');
                const continueFromCurrent = wasVisible && !switchingAnchor;

                const startOpacity = continueFromCurrent ? cs.opacity : '0';
                const startTransform = continueFromCurrent ? (cs.transform === 'none' ? 'translateY(0)' : cs.transform) : 'translateY(-8px)';

                linkTipEl.style.display = 'block';
                linkTipEl.style.transition = 'none';
                linkTipEl.style.opacity = startOpacity;
                linkTipEl.style.transform = startTransform;
                // Force reflow to lock the starting state
                void linkTipEl.offsetWidth;
                // Restore transition and animate to target
                linkTipEl.style.transition = prevTransition || 'opacity 160ms ease, transform 160ms ease';
                requestAnimationFrame(() => {
                    if (myToken !== linkTipStateToken) return; // canceled by a newer call
                    linkTipEl.style.opacity = '1';
                    linkTipEl.style.transform = 'translateY(0)';
                    linkTipVisible = true;
                });
            }

            function hideLinkTooltip() {
                if (!linkTipEl) return;
                if (linkTipHideTimer) clearTimeout(linkTipHideTimer);

                // Token to cancel stale hides if a new show occurs
                const myToken = ++linkTipStateToken;

                // Small delay to allow moving between links without flicker
                linkTipHideTimer = setTimeout(() => {
                    if (myToken !== linkTipStateToken) return; // A newer show occurred
                    linkTipEl.style.opacity = '0';
                    linkTipEl.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        if (myToken !== linkTipStateToken) return; // A newer show occurred
                        if (linkTipEl) {
                            linkTipEl.style.display = 'none';
                            linkTipVisible = false;
                            linkTipCurrentAnchor = null;
                        }
                    }, 160);
                }, 100);
            }
            const linksTitle = makeElement(
                "div", {
                    textContent: "Links"
                }, {
                    textAlign: "center",
                    fontWeight: "700",
                    marginBottom: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    letterSpacing: "0.5px",
                }
            );
            const linksList = makeElement(
                "div", {
                    id: "links-found-list"
                }, {
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    textAlign: "left",
                }
            );
            linksPanel.appendChild(linksTitle);
            linksPanel.appendChild(linksList);
            previewSection.appendChild(linksPanel);

            function renderLinksPanel(urls) {
                linksList.innerHTML = "";
                const showPanel = localStorage.getItem("showLinksPanel") === null ? false : localStorage.getItem("showLinksPanel") === "true";
                if (!showPanel) {
                    linksPanel.style.display = "none";
                    return;
                }

                // Empty state when no links are present
                if (!urls || urls.length === 0) {
                    const empty = makeElement(
                        "div", {
                            textContent: "No Links"
                        }, {
                            color: "#aaa",
                            fontSize: "12px",
                            textAlign: "center",
                            padding: "6px 0",
                            opacity: "0.8",
                        }
                    );
                    linksList.appendChild(empty);
                    linksPanel.style.display = "block";
                    return;
                }

                // Render rows for each URL
                urls.forEach((u) => {
                    const {
                        kind
                    } = classifyUrl(u);
                    const row = makeElement(
                        "div", {}, {
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            alignItems: "center",
                            gap: "8px"
                        }
                    );
                    // Hard-disable any row hover transform/transition just in case
                    row.setAttribute('data-link-row', '1');
                    row.style.transform = 'none';
                    row.style.transition = 'none';

                    const label = makeElement(
                        "span", {
                            textContent: `[${kind}]`
                        }, {
                            opacity: "0.7",
                            color: "#ddd",
                            fontSize: "12px",
                            whiteSpace: "nowrap"
                        }
                    );
                    const anchor = makeElement(
                        "a", {
                            href: u,
                            textContent: u,
                            target: "_blank",
                            rel: "noopener noreferrer"
                        }, {
                            color: "#4aa3ff",
                            textDecoration: "none",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }
                    );
                    anchor.addEventListener("mouseenter", () => {
                        anchor.style.textDecoration = "underline";
                        showLinkTooltip(anchor, u);
                    });
                    anchor.addEventListener("mouseleave", () => {
                        anchor.style.textDecoration = "none";
                        hideLinkTooltip();
                    });

                    const btnBase = {
                        background: "#2a2a2a",
                        border: "1px solid #555",
                        color: "#fff",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        whiteSpace: "nowrap"
                    };
                    const copyBtn = makeElement("button", {
                        type: "button",
                        textContent: "Copy"
                    }, btnBase);
                    copyBtn.classList.add('no-lift');

                    // Allow subtle glow on hover and minimal press motion (no lift)
                    copyBtn.style.transition = 'background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 60ms ease';
                    copyBtn.addEventListener('mouseenter', () => {
                        // Lit up effect (no aura)
                        copyBtn.style.background = '#333';
                        copyBtn.style.borderColor = '#777';
                        copyBtn.style.boxShadow = 'none';
                        copyBtn.style.color = '#fff';
                        // No transform on hover
                        copyBtn.style.transform = 'none';
                    });
                    copyBtn.addEventListener('mouseleave', () => {
                        copyBtn.style.background = '#2a2a2a';
                        copyBtn.style.borderColor = '#555';
                        copyBtn.style.boxShadow = 'none';
                        copyBtn.style.color = '#fff';
                        copyBtn.style.transform = 'none';
                    });
                    copyBtn.addEventListener('mousedown', () => {
                        // Much stronger bump on press
                        copyBtn.style.transition = 'transform 60ms ease-out';
                        copyBtn.style.transform = 'scale(0.88)';
                    });
                    copyBtn.addEventListener('mouseup', () => {
                        // Bigger overshoot and settle
                        copyBtn.style.transition = 'transform 140ms ease-out';
                        copyBtn.style.transform = 'scale(1.12)';
                        setTimeout(() => {
                            copyBtn.style.transition = 'transform 120ms ease-out';
                            copyBtn.style.transform = 'none';
                        }, 130);
                    });

                    copyBtn.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        try {
                            await navigator.clipboard.writeText(u);
                            showCopyNotification("Link copied");
                            // Trigger scoped click animation
                            copyBtn.classList.add('copied');
                            setTimeout(() => copyBtn.classList.remove('copied'), 260);
                        } catch (_) {}
                    });

                    row.appendChild(label);
                    row.appendChild(anchor);
                    row.appendChild(copyBtn);
                    linksList.appendChild(row);
                });
                linksPanel.style.display = "block";
            }


            // Cache for character preview data
            let previewDataCache = {
                characterId: null,
                data: null,
                avatarUrl: null,
                themeApplied: false
            };
            let lastLinksUrlsGui = [];

            // Function to calculate approximate token count
            function calculateTokenCount(text) {
                if (!text) return 0;
                // Rough estimation: 1 token ≈ 4 characters for English text
                return Math.round(text.length / 4);
            }

            // Function to modify avatar URL to use width=200
            function modifyAvatarUrl(originalUrl) {
                if (!originalUrl) return null;
                return originalUrl.replace(/width=\d+/, 'width=200');
            }

            // Enhanced stats extraction function - FINALIZED AND STREAMLINED
            async function getEnhancedCharacterStats(characterId, characterCardUrl) {
                // Initialize stats object with only the fields we can reliably fetch.
                const stats = {
                    totalChats: "0",
                    totalMessages: "0",
                    tokenInfo: null
                };

                try {
                    // Use the simple, reliable fetch method for static content.
                    const response = await fetch(characterCardUrl);
                    const html = await response.text();
                    const doc = new DOMParser().parseFromString(html, "text/html");

                    // Extract token info for hidden definitions
                    // Extract token info for hidden definitions
                    try {
                        const tokenHeaders = doc.querySelectorAll('h4[class*="characterInfoHeader"]');
                        for (const header of tokenHeaders) {
                            const headerText = header.textContent || '';
                            if (headerText.includes('Character Definition') && headerText.includes('Total') && headerText.includes('tokens')) {
                                const tokenMatch = headerText.match(/Total (\d+(?:,\d+)*) tokens/i);
                                if (tokenMatch) {
                                    const tokenCount = tokenMatch[1].replace(/,/g, '');
                                    stats.tokenInfo = `${parseInt(tokenCount).toLocaleString()} tokens`;
                                }
                                break;
                            }
                        }
                    } catch (error) {
                        debugError("Error extracting token info:", error);
                    }

                    // Extract total chats and messages
                    try {
                        // This selector has proven to be reliable for the static content.
                        const statsContainer = doc.querySelector('div.chakra-stack.css-1qoq49l');
                        if (statsContainer) {
                            const statElements = statsContainer.querySelectorAll('p.chakra-text.css-0');
                            if (statElements.length >= 2) {
                                stats.totalChats = statElements[0].textContent.trim();
                                stats.totalMessages = statElements[1].textContent.trim();
                                debugLog(`Successfully fetched Total Chats: ${stats.totalChats}, Total Messages: ${stats.totalMessages}`);
                            }
                        } else {
                            debugWarn("Could not find the container for Total Chats/Messages.");
                        }
                    } catch (error) {
                        debugError("Error extracting chat/message stats:", error);
                    }

                } catch (error) {
                    debugError("An error occurred while fetching character page stats:", error);
                }

                return stats;
            }

            // Function to update character preview with proper data retrieval and caching
            // Function to update character preview with proper data retrieval and caching
            async function updateCharacterPreview() {
                if (!chatData || !chatData.character) {
                    debugLog("Preview update stopped: No character data available.");
                    return;
                }

                const characterId = chatData.character.id;
                const cacheKey = `char_preview_cache_${characterId}`;

                // --- MODIFIED: Check sessionStorage for cached data first ---
                try {
                    const cachedDataJSON = sessionStorage.getItem(cacheKey);
                    if (cachedDataJSON) {
                        debugLog("Using cached character preview data from sessionStorage for ID:", characterId);
                        const cachedData = JSON.parse(cachedDataJSON);
                        updatePreviewUI(cachedData); // Update UI from cache
                        return; // Stop execution, we don't need to fetch again
                    }
                } catch (e) {
                    debugWarn("Could not parse cached preview data, fetching fresh.", e);
                    sessionStorage.removeItem(cacheKey); // Clear corrupted data
                }

                debugLog("No cached data found. Fetching fresh character data for ID:", characterId);

                try {
                    const meta = await getCharacterMeta();
                    const tokens = await getFilenameTokens(meta);

                    const charAvatar = document.querySelector('img[src*="/bot-avatars/"]');
                    const avatarUrl = charAvatar ? modifyAvatarUrl(charAvatar.src) : null;

                    const enhancedStats = await getEnhancedCharacterStats(characterId, meta.characterCardUrl);

                    // Compile all data into one object
                    const characterData = {
                        id: characterId,
                        name: meta.name || chatData.character.name || "Unknown",
                        chatName: chatData.character.chat_name,
                        creator: tokens.creator || "Unknown",
                        definitionExposed: meta.definitionExposed,
                        avatarUrl: avatarUrl,
                        meta: meta,
                        description: meta.definitionExposed ? (meta.personality || chatData.character.description || "No description available") : "Definition not exposed",
                        scenario: meta.definitionExposed ? (meta.scenario || "No scenario available") : "Definition not exposed",
                        firstMessage: chatData.chatMessages?.findLast(m => m.is_bot === true)?.message || "No first message available",
                        examples: meta.definitionExposed ? (meta.exampleDialogs || "No examples available") : "Definition not exposed",
                        tokenCount: meta.definitionExposed ? calculateTokenCount([meta.personality, meta.scenario, meta.firstMessage, meta.exampleDialogs].filter(Boolean).join(" ")) : 0,
                        ...enhancedStats // Add stats from the fetched data
                    };

                    // --- MODIFIED: Save the freshly fetched data to sessionStorage ---
                    try {
                        sessionStorage.setItem(cacheKey, JSON.stringify(characterData));
                        debugLog("Character data cached in sessionStorage for ID:", characterId);
                    } catch (e) {
                        debugWarn("Could not save character data to sessionStorage, it may be too large.", e);
                    }


                    // Update the UI with the new data
                    updatePreviewUI(characterData);

                } catch (err) {
                    debugError("Failed to fetch and update character preview:", err);
                }
            }

            // Function to update the preview UI with character data
            function updatePreviewUI(characterData) {
                // Update basic info
                const displayName = characterData.name;

                // Make character name clickable to character page
                const characterUrl = characterData.meta?.characterCardUrl || '';
                if (characterUrl) {
                    characterName.innerHTML = `<a href="${characterUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; cursor: pointer; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${displayName}</a>`;
                } else {
                    characterName.textContent = displayName;
                }

                // Show chat name if different from display name
                if (characterData.chatName &&
                    characterData.chatName !== displayName &&
                    characterData.chatName !== characterData.name) {
                    characterChatName.textContent = `Chat Name: ${characterData.chatName}`;
                    characterChatName.style.display = 'block';
                    characterChatName.style.color = '#ff9800'; // Changed to orange color for chat name
                } else {
                    characterChatName.style.display = 'none';
                }

                // Update creator info with clickable link
                const creatorUrl = characterData.meta?.creatorUrl || '';
                if (creatorUrl) {
                    characterCreator.innerHTML = `Creator: <a href="${creatorUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; cursor: pointer; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${characterData.creator}</a>`;
                } else {
                    characterCreator.textContent = `Creator: ${characterData.creator}`;
                }

                // Prepare stats for display
                const statsHTML = [];
                if (characterData.totalChats && characterData.totalChats !== "0") {
                    statsHTML.push(`💬 ${characterData.totalChats} chats`);
                }
                if (characterData.totalMessages && characterData.totalMessages !== "0") {
                    statsHTML.push(`📧 ${characterData.totalMessages} messages`);
                }

                // Update avatar with modified URL (width=200) and apply theme
                if (characterData.avatarUrl) {
                    avatarImg.src = characterData.avatarUrl;

                    // Apply dynamic theme based on avatar (only once per character)
                    if (!previewDataCache.themeApplied) {
                        avatarImg.onload = async () => {
                            try {
                                const themes = await analyzeImageColors(avatarImg);
                                const selectedTheme = themes[0];
                                applyTheme(selectedTheme);
                                previewDataCache.themeApplied = true;
                            } catch (error) {
                                console.warn("Theme analysis failed:", error);
                            }
                        };
                    }
                }

                // Update token count and status
                // Also compute and render Links panel from Creator's Notes
                try {
                    const notesRaw = characterData.meta?.creatorNotes || chatData?.character?.description || "";
                    const urlsGUI = collectUrlsFromNotes(String(notesRaw));
                    lastLinksUrlsGui = urlsGUI;
                    renderLinksPanel(urlsGUI);
                } catch (_) {
                    lastLinksUrlsGui = [];
                    renderLinksPanel([]);
                }

                if (characterData.definitionExposed && characterData.tokenCount !== null) {
                    characterTokens.innerHTML = `~${characterData.tokenCount.toLocaleString()} tokens`;
                    characterTokens.style.color = "#30ff37ff";
                    characterTokens.style.fontWeight = 'bold';
                    characterTokens.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.7)';

                    // Show stats below
                    if (statsHTML.length > 0) {
                        characterStats.innerHTML = statsHTML.join(' • ');
                        characterStats.style.display = 'block';
                        characterStats.style.color = "#50ff55ff";
                        characterStats.style.fontWeight = 'bold';
                        characterStats.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.7)';
                    } else {
                        characterStats.style.display = 'none';
                    }

                    // Update section content with actual data
                    descriptionSection.setContent(characterData.description);
                    scenarioSection.setContent(characterData.scenario);
                    firstMessageSection.setContent(characterData.firstMessage);
                    examplesSection.setContent(characterData.examples);
                    // Creator's Notes (HTML-rendered)
                    creatorNotesSection.setContent(characterData.meta?.creatorNotes || chatData?.character?.description || "");
                } else {
                    // Show warning with token info if available
                    let warningText = "⚠️";
                    if (characterData.tokenInfo) {
                        warningText = `⚠️ ${characterData.tokenInfo}`;
                    }
                    characterTokens.innerHTML = warningText;
                    characterTokens.style.fontWeight = 'bold';
                    characterTokens.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.7)';
                    characterTokens.style.color = "#ffeb3b"; // Yellow color

                    // Show stats below in different color
                    if (statsHTML.length > 0) {
                        characterStats.innerHTML = statsHTML.join(' • ');
                        characterStats.style.display = 'block';
                        characterStats.style.color = "#50ff55ff"; // Lighter green for hidden definition
                        characterStats.style.fontWeight = 'bold';
                        characterStats.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.7)';
                    } else {
                        characterStats.style.display = 'none';
                    }

                    // Use limited data
                    descriptionSection.setContent(characterData.description);
                    scenarioSection.setContent(characterData.scenario);
                    firstMessageSection.setContent(characterData.firstMessage);
                    examplesSection.setContent(characterData.examples);
                    // Creator's Notes (HTML-rendered)
                    creatorNotesSection.setContent(characterData.meta?.creatorNotes || chatData?.character?.description || "");
                }

                // Show preview section with animation
                previewSection.style.display = "block";
                requestAnimationFrame(() => {
                    previewSection.style.opacity = "1";
                    previewSection.style.transform = "translateY(0)";
                });
            }

            // Function to collapse all collapsible sections (global scope)
            window.collapseAllSections = function() {
                const sections = ['description', 'scenario', 'firstMessage', 'examples', 'creatorNotes'];
                sections.forEach(sectionId => {
                    sessionStorage.setItem(`section-${sectionId}-expanded`, 'false');

                    // Also update UI if sections exist
                    const contentArea = document.querySelector(`#section-${sectionId} .content-area`);
                    const panelContainer = document.querySelector(`#section-${sectionId} .panel-container`);
                    const topBar = document.querySelector(`#section-${sectionId} .top-bar`);
                    const copyButton = document.querySelector(`#section-${sectionId} .copy-btn`);

                    if (contentArea && panelContainer && topBar) {
                        contentArea.style.maxHeight = "0px";
                        panelContainer.style.borderColor = "#444";
                        topBar.style.background = "linear-gradient(90deg, #444 0%, #555 50%, #444 100%)";

                        if (copyButton) {
                            copyButton.style.display = "none";
                        }
                    }
                });
            };

            // Helper function to check if text is a placeholder
            function isPlaceholderText(text) {
                const placeholders = [
                    "No description available",
                    "No scenario available",
                    "No first message available",
                    "No examples available",
                    "Definition not exposed",
                    "No content available"
                ];
                return placeholders.includes(text);
            }

            // Add the preview section to the export content
            exportContent.appendChild(previewSection);

            // Add scroll memory for export tab
            exportContent.addEventListener("scroll", () => {
                sessionStorage.setItem("char_export_scroll", exportContent.scrollTop);
            });

            // // Function to restore scroll position after collapsibles are ready
            // function restoreScrollPosition() {
            //     const savedExportScroll = parseInt(
            //         sessionStorage.getItem("char_export_scroll") || "0",
            //         10,
            //     );
            //     if (savedExportScroll > 0) {
            //         exportContent.scrollTop = savedExportScroll;
            //     }
            // }


            // Initialize preview update - only call once when UI is created
            if (chatData && chatData.character && viewActive) {
                updateCharacterPreview();
            }

            // // Restore export tab scroll on tab switch
            // function switchTab(tabKey) {
            //     if (tabKey === "export") {
            //         // Restore export tab scroll position
            //         requestAnimationFrame(() => {
            //             const savedExportScroll = parseInt(
            //                 sessionStorage.getItem("char_export_scroll") || "0",
            //                 10,
            //             );
            //             exportContent.scrollTop = savedExportScroll;
            //         });
            //     }
            // }

            // Add CSS styles for the enhanced collapsible sections
            if (!document.getElementById("char-preview-styles")) {
                const previewStyle = document.createElement("style");
                previewStyle.id = "char-preview-styles";
                // --- MODIFIED: Removed the 'background' property from the .copy-btn:hover rule ---
                previewStyle.textContent = `
                    .collapsible-section .panel-container:hover {
                        border-color: #666;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    }

                    .panel-bar {
                        position: relative;
                    }

                    .panel-bar:hover::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255,255,255,0.1);
                        pointer-events: none;
                    }

                    .content-area {
                        background: linear-gradient(135deg, #222 0%, #1a1a1a 100%);
                    }

                    .content-text:empty::before {
                        content: "No content available";
                        color: #666;
                        font-style: italic;
                    }

                    .copy-btn:hover {
                        /* The blue background color has been removed from this rule. */
                        transform: scale(1.1) !important;
                    }

                    .copy-btn:active {
                        transform: scale(0.95) !important;
                    }
                `;
                document.head.appendChild(previewStyle);

                // Ensure Creator's Notes content remains selectable despite global UI unselectable rule
                if (!document.getElementById('creator-notes-selectable')) {
                    const sel = document.createElement('style');
                    sel.id = 'creator-notes-selectable';
                    sel.textContent = `
                    #char-export-gui #section-creatorNotes .content-text,
                    #char-export-gui #section-creatorNotes .content-text * {
                        user-select: text !important;
                        -webkit-user-select: text !important;
                        -moz-user-select: text !important;
                        -ms-user-select: text !important;
                        cursor: text !important;
                    }
                `;
                    document.head.appendChild(sel);
                }
            }

            // Suppress lift on hover for buttons in Links panel explicitly (but allow glow and press motion)
            if (!document.getElementById('links-panel-no-lift')) {
                const lp = document.createElement('style');
                lp.id = 'links-panel-no-lift';
                lp.textContent = `
                    /* Prevent any unintended vertical lift while allowing visual glow */
                    #links-found-panel [data-link-row],
                    #links-found-panel [data-link-row]:hover {
                        transform: none !important;
                    }

                    /* Base styles for copy buttons in Links panel */
                    #links-found-panel button.no-lift {
                        transition: background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 60ms ease !important;
                        will-change: background, color, border-color, box-shadow, transform !important;
                        background: #2a2a2a !important;
                        border-color: #555 !important;
                        color: #fff !important;
                        outline: 0 !important;
                        height: 24px !important;
                        line-height: 22px !important;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }

                    /* Hover: light up (no lift) */
                    #links-found-panel button.no-lift:hover {
                        transform: none !important; /* ensure no lift */
                        filter: brightness(1.07) !important;
                        background: #333 !important;
                        border-color: #777 !important;
                        box-shadow: none !important; /* no aura */
                    }

                    /* Active: do not force a transform; allow JS-driven bump to take effect */
                    #links-found-panel button.no-lift:active {
                        box-shadow: none !important; /* no aura */
                    }

                    /* Click success pop animation (scoped to Links panel only) */
                    @keyframes lp-pop {
                        0% { transform: scale(1); }
                        40% { transform: scale(1.12); }
                        70% { transform: scale(0.96); }
                        100% { transform: scale(1); }
                    }
                    #links-found-panel button.no-lift.copied {
                        animation: lp-pop 260ms ease-out;
                    }
                `
                document.head.appendChild(lp);
            }

            // Add content border and alignment fixes
            if (!document.getElementById("char-content-border-fix")) {
                const contentBorderStyle = document.createElement("style");
                contentBorderStyle.id = "char-content-border-fix";
                // --- FIXED: Removed the 'border-right: none' rules ---
                contentBorderStyle.textContent = `
                    .content-text {
                        text-align: center !important;
                        padding: 16px 50px 16px 20px;
                    }
                `;
                document.head.appendChild(contentBorderStyle);
            }

            const contentWrapper = makeElement(
                "div", {
                    id: "content-wrapper",
                }, {
                    minHeight: "320px",
                    width: "100%",
                    overflow: "visible",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    position: "relative",
                    flex: "1",
                },
            );
            gui.appendChild(contentWrapper);

            const tabContentStyles = {
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "15px",
                paddingTop: "10px",
                position: "absolute",
                top: "0",
                left: "0",
                opacity: "1",
                transform: "scale(1)",
                transition: `opacity ${TAB_ANIMATION_DURATION}ms ease, transform ${TAB_ANIMATION_DURATION}ms ease`,
                boxSizing: "border-box",
            };

            Object.assign(exportContent.style, tabContentStyles);
            exportContent.style.overflowY = "visible";
            exportContent.style.overflowX = "hidden";
            exportContent.style.display = "flex";
            exportContent.style.flexDirection = "column";
            exportContent.style.alignItems = "center";

            const settingsContent = makeElement(
                "div", {
                    id: "settings-tab",
                    style: "display: none;",
                },
                tabContentStyles,
            );

            contentWrapper.appendChild(exportContent);
            contentWrapper.appendChild(settingsContent);
            const savedExportScroll = parseInt(
                sessionStorage.getItem("char_export_scroll") || "0",
                10,
            );
            exportContent.scrollTop = savedExportScroll;
            const savedSettingsScroll = parseInt(
                sessionStorage.getItem("char_settings_scroll") || "0",
                10,
            );
            settingsContent.scrollTop = savedSettingsScroll;
            settingsContent.addEventListener("scroll", () =>
                sessionStorage.setItem("char_settings_scroll", settingsContent.scrollTop),
            );

            requestAnimationFrame(() => {
                exportContent.scrollTop = savedExportScroll;
                settingsContent.scrollTop = savedSettingsScroll;
            });

            const settingsTitle = makeElement(
                "h1", {
                    textContent: "Export Settings",
                }, {
                    margin: "-10px 0 25px 0",
                    fontSize: "24px",
                    paddingTop: "0px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                    borderBottom: "2px solid #444",
                    paddingBottom: "12px",
                },
            );
            settingsContent.appendChild(settingsTitle);


            // Filename Template Section
            const templateSection = makeElement(
                "div", {}, {
                    marginTop: "20px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease",
                    cursor: "default",
                },
            );

            const templateTitle = makeElement(
                "h3", {
                    textContent: "Filename",
                }, {
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            );
            templateSection.appendChild(templateTitle);

            const templateInputContainer = makeElement(
                "div", {
                    className: "template-input-container",
                }, {
                    marginBottom: "12px",
                    position: "relative",
                    overflow: "hidden",
                },
            );

            const templateInput = makeElement(
                "input", {
                    type: "text",
                    value: filenameTemplate,
                    placeholder: "Enter filename template",
                }, {
                    width: "100%",
                    padding: "10px 55px 10px 12px",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    background: "#1a1a1a",
                    color: "#fff",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    transition: "border-color 200ms ease, box-shadow 200ms ease",
                    outline: "none",
                },
            );

            // Disable tooltips completely
            templateInput.setAttribute("title", "");
            templateInput.setAttribute("data-tooltip-disabled", "true");
            templateInput.removeAttribute("title");
            templateInput.addEventListener("mouseenter", (e) => {
                e.target.removeAttribute("title");
                e.target.title = "";
            });

            // Override browser tooltip styles
            templateInput.style.setProperty("pointer-events", "auto", "important");
            templateInput.addEventListener("mouseover", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            let hasChanges =
                filenameTemplate !== "" &&
                filenameTemplate !==
                (localStorage.getItem("filenameTemplate") || "{name}");
            let originalTemplate = localStorage.getItem("filenameTemplate") || "{name}";

            // Auto-restore functionality
            const restoreTemplate = () => {
                const savedDraft = localStorage.getItem("filenameTemplateDraft");
                if (savedDraft && savedDraft !== templateInput.value) {
                    templateInput.value = savedDraft;
                    filenameTemplate = savedDraft;
                    hasChanges =
                        filenameTemplate !== "" &&
                        filenameTemplate !==
                        (localStorage.getItem("filenameTemplate") || "{name}");

                    // Update apply button state
                    const applyBtn = templateSection.querySelector(".template-apply-btn");
                    if (applyBtn && hasChanges) {
                        applyBtn.style.opacity = "1";
                        applyBtn.style.color = "#4CAF50";
                        applyBtn.style.filter = "drop-shadow(0 0 4px rgba(76, 175, 80, 0.6))";
                    }
                }
            };

            templateInput.addEventListener("input", (e) => {
                filenameTemplate = e.target.value;
                localStorage.setItem("filenameTemplateDraft", filenameTemplate);
                hasChanges =
                    filenameTemplate !== "" &&
                    filenameTemplate !==
                    (localStorage.getItem("filenameTemplate") || "{name}");

                // Update apply button state with smooth animation
                const applyBtn = templateSection.querySelector(".template-apply-btn");
                if (applyBtn && !isAnimating) {
                    applyBtn.style.transition = "all 200ms ease";
                    if (hasChanges) {
                        applyBtn.style.opacity = "1";
                        applyBtn.style.color = "#4CAF50";
                        applyBtn.style.filter = "drop-shadow(0 0 4px rgba(76, 175, 80, 0.6))";
                    } else {
                        applyBtn.style.opacity = "0.5";
                        applyBtn.style.color = "#666";
                        applyBtn.style.filter = "none";
                    }
                }
            });

            // Restore on tab switch and UI open
            restoreTemplate();

            let isEnterHeld = false;
            let isMouseHeld = false;

            templateInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !isEnterHeld) {
                    isEnterHeld = true;
                    e.preventDefault();
                    if (hasChanges && !isAnimating) {
                        performApplyAction();
                    } else if (!hasChanges && !isAnimating) {
                        startGrayHold();
                    }
                }
            });

            templateInput.addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    isEnterHeld = false;
                    if (!hasChanges && !isAnimating) {
                        endGrayHold();
                    }
                }
            });

            templateInput.addEventListener("mouseover", () => {
                if (
                    !isAnimating &&
                    document.activeElement !== templateInput &&
                    templateInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    templateInput.style.borderColor = "#777";
                }
            });

            templateInput.addEventListener("mouseout", () => {
                if (
                    !isAnimating &&
                    document.activeElement !== templateInput &&
                    templateInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    templateInput.style.borderColor = "#555";
                }
            });

            templateInput.addEventListener("focus", () => {
                if (
                    !isAnimating &&
                    templateInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    templateInput.style.borderColor = "#888";
                }
            });

            templateInput.addEventListener("blur", () => {
                if (
                    !isAnimating &&
                    templateInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    templateInput.style.borderColor = "#555";
                }
            });

            templateInputContainer.appendChild(templateInput);

            const applyButton = makeElement(
                "button", {
                    textContent: "✓",
                    className: "template-apply-btn",
                }, {
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#666",
                    fontSize: "14px",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "3px",
                    opacity: "0.5",
                    transition: "all 200ms ease",
                },
            );

            let isAnimating = false;

            const performApplyAction = () => {
                if (!hasChanges || isAnimating) return;
                isAnimating = true;

                // Green glow for input box (slightly thicker but subtle)
                templateInput.classList.add("applying-changes");
                templateInput.style.borderColor = "#4CAF50";
                templateInput.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";

                // Show bright green glow before animation
                applyButton.style.color = "#2ecc71";
                applyButton.style.filter = "drop-shadow(0 0 8px rgba(46, 204, 113, 0.8))";
                applyButton.style.textShadow = "0 0 12px rgba(46, 204, 113, 0.9)";

                setTimeout(() => {
                    // Save current template
                    localStorage.setItem("filenameTemplate", filenameTemplate);
                    originalTemplate = filenameTemplate;
                    hasChanges = false;

                    // Slot machine animation sequence with proper overflow clipping

                    // Phase 1: Checkmark slides up with fast acceleration (like slot reel)
                    applyButton.style.transition =
                        "all 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                    applyButton.style.transform = "translateY(-50%) translateY(-30px)";
                    applyButton.style.filter = "blur(4px)";
                    applyButton.style.opacity = "0";

                    setTimeout(() => {
                        // Phase 2: Applied! slides up from bottom (like slot winning symbol)
                        const appliedText = makeElement(
                            "span", {
                                textContent: "Applied!",
                            }, {
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%) translateY(25px)",
                                color: "#4CAF50",
                                fontSize: "11px",
                                fontWeight: "bold",
                                opacity: "0",
                                transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                            },
                        );

                        templateInputContainer.appendChild(appliedText);

                        // Applied! slides into view with deceleration
                        requestAnimationFrame(() => {
                            appliedText.style.opacity = "1";
                            appliedText.style.transform = "translateY(-50%) translateY(0px)";
                            appliedText.style.filter = "blur(0px)";
                        });

                        // Phase 3: Applied! slides up and disappears (faster stay time)
                        setTimeout(() => {
                            appliedText.style.transition =
                                "all 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                            appliedText.style.transform = "translateY(-50%) translateY(-25px)";
                            appliedText.style.filter = "blur(3px)";
                            appliedText.style.opacity = "0";

                            // Phase 4: New checkmark slides up from bottom with glow
                            setTimeout(() => {
                                // Position new checkmark below input box ready to slide up
                                applyButton.style.transition = "none";
                                applyButton.style.transform = "translateY(-50%) translateY(25px)";
                                applyButton.style.opacity = "0";
                                applyButton.style.color = "#aaa";
                                applyButton.style.filter = "blur(1px)";

                                requestAnimationFrame(() => {
                                    // Slide up with glow effect and color mixing
                                    applyButton.style.transition =
                                        "all 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                                    applyButton.style.transform =
                                        "translateY(-50%) translateY(-2px)";
                                    applyButton.style.opacity = "0.9";
                                    applyButton.style.color = "#999";
                                    applyButton.style.filter =
                                        "blur(0px) drop-shadow(0 0 6px rgba(153, 153, 153, 0.8)) hue-rotate(20deg)";
                                    applyButton.style.textShadow =
                                        "0 0 10px rgba(200, 200, 200, 0.9)";

                                    // Phase 5: Settle with subtle bounce and color normalization
                                    setTimeout(() => {
                                        // Check if user made changes during animation
                                        const currentChanges =
                                            filenameTemplate !== "" &&
                                            filenameTemplate !==
                                            (localStorage.getItem("filenameTemplate") || "{name}");

                                        applyButton.style.transition = "all 150ms ease-out";
                                        applyButton.style.transform =
                                            "translateY(-50%) translateY(0px)";

                                        if (currentChanges) {
                                            // Show green if changes exist
                                            applyButton.style.opacity = "1";
                                            applyButton.style.color = "#4CAF50";
                                            applyButton.style.filter =
                                                "drop-shadow(0 0 4px rgba(76, 175, 80, 0.6))";
                                        } else {
                                            // Show gray if no changes
                                            applyButton.style.opacity = "0.5";
                                            applyButton.style.color = "#666";
                                            applyButton.style.filter = "none";
                                        }
                                        applyButton.style.textShadow = "none";

                                        // Reset input box border after delay
                                        setTimeout(() => {
                                            templateInput.classList.remove("applying-changes");
                                            if (document.activeElement === templateInput) {
                                                templateInput.style.borderColor = "#888";
                                                templateInput.style.boxShadow =
                                                    "inset 0 0 0 1px rgba(136, 136, 136, 0.3)";
                                            } else {
                                                templateInput.style.borderColor = "#555";
                                                templateInput.style.boxShadow = "none";
                                            }
                                        }, 100);

                                        // Clean up Applied! text
                                        appliedText.remove();
                                        isAnimating = false;
                                    }, 250);
                                });
                            }, 100);
                        }, 500); // Shorter stay time for snappier feel
                    }, 120);
                }, 50);
            };

            const startGrayHold = () => {
                if (!hasChanges && !isAnimating) {
                    // Hold down effect for gray checkmark
                    applyButton.style.transition = "all 100ms ease";
                    applyButton.style.transform = "translateY(-50%) scale(0.9)";
                    applyButton.style.opacity = "0.3";
                }
            };

            const endGrayHold = () => {
                if (!hasChanges && !isAnimating) {
                    // Release effect for gray checkmark
                    applyButton.style.transition = "all 100ms ease";
                    applyButton.style.transform = "translateY(-50%) scale(1)";
                    applyButton.style.opacity = "0.5";
                }
            };

            const handleGrayClick = () => {
                if (!hasChanges && !isAnimating) {
                    startGrayHold();
                    setTimeout(() => endGrayHold(), 100);
                }
            };

            applyButton.addEventListener("mousedown", () => {
                if (hasChanges && !isAnimating) {
                    // Green glow for input box on click too (slightly thicker but subtle)
                    templateInput.classList.add("applying-changes");
                    templateInput.style.borderColor = "#4CAF50";
                    templateInput.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";
                    performApplyAction();
                } else if (!hasChanges && !isAnimating) {
                    isMouseHeld = true;
                    startGrayHold();
                }
            });

            applyButton.addEventListener("mouseup", () => {
                if (isMouseHeld) {
                    isMouseHeld = false;
                    endGrayHold();
                }
            });

            applyButton.addEventListener("mouseleave", () => {
                if (isMouseHeld) {
                    isMouseHeld = false;
                    endGrayHold();
                }
            });

            // Set initial apply button state
            if (hasChanges) {
                applyButton.style.opacity = "1";
                applyButton.style.color = "#4CAF50";
            }

            templateInputContainer.appendChild(applyButton);
            templateSection.appendChild(templateInputContainer);

            const tokenButtonsContainer = makeElement(
                "div", {}, {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "8px",
                    alignItems: "center",
                },
            );

            // Create token buttons
            const tokens = [{
                    token: "id",
                    label: "ID"
                },
                {
                    token: "creator",
                    label: "Creator"
                },
                {
                    token: "name",
                    label: "Name"
                },
                {
                    token: "chat_name",
                    label: "Chat Name"
                },
                {
                    token: "created",
                    label: "Created"
                },
                {
                    token: "updated",
                    label: "Updated"
                },
                {
                    token: "tags",
                    label: "Tags"
                },
            ];

            tokens.forEach(({
                token,
                label
            }) => {
                const button = createTokenButton(token, label, templateInput, false);
                tokenButtonsContainer.appendChild(button);
            });

            templateSection.appendChild(tokenButtonsContainer);

            // Save Path Section
            const savePathSection = makeElement(
                "div", {}, {
                    marginTop: "20px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease",
                    cursor: "default",
                },
            );

            const savePathTitle = makeElement(
                "h3", {
                    textContent: "Save Path",
                }, {
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            );
            savePathSection.appendChild(savePathTitle);

            const savePathInputContainer = makeElement(
                "div", {
                    className: "savepath-input-container",
                }, {
                    marginBottom: "12px",
                    position: "relative",
                    overflow: "hidden",
                },
            );

            // Update userChangedSavePath to current state
            userChangedSavePath =
                localStorage.getItem("userChangedSavePath") === "true";

            // Always use default prefill if user hasn't applied changes yet
            let savePathTemplate = userChangedSavePath ?
                localStorage.getItem("savePathTemplate") || "" :
                "cards/{creator}";
            const savePathInput = makeElement(
                "input", {
                    type: "text",
                    value: savePathTemplate,
                    placeholder: "Leave empty to save to the root directory",
                }, {
                    width: "100%",
                    padding: "10px 55px 10px 12px",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    background: "#1a1a1a",
                    color: "#fff",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    transition: "border-color 200ms ease, box-shadow 200ms ease",
                    outline: "none",
                },
            );

            // Disable tooltips
            savePathInput.setAttribute("title", "");
            savePathInput.setAttribute("data-tooltip-disabled", "true");
            savePathInput.removeAttribute("title");
            savePathInput.addEventListener("mouseenter", (e) => {
                e.target.removeAttribute("title");
                e.target.title = "";
            });

            // Override browser tooltip styles
            savePathInput.style.setProperty("pointer-events", "auto", "important");
            savePathInput.addEventListener("mouseover", (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            let originalSavePathTemplate = userChangedSavePath ?
                localStorage.getItem("savePathTemplate") || "" :
                "cards/{creator}";
            let savePathHasChanges = savePathTemplate !== originalSavePathTemplate;

            // Auto-restore functionality removed for Save Path

            savePathInput.addEventListener("input", (e) => {
                savePathTemplate = e.target.value;
                // Update userChangedSavePath state
                userChangedSavePath =
                    localStorage.getItem("userChangedSavePath") === "true";
                const currentOriginal = userChangedSavePath ?
                    localStorage.getItem("savePathTemplate") || "" :
                    "cards/{creator}";
                savePathHasChanges = savePathTemplate !== currentOriginal;

                // Update apply button state
                const applyBtn = savePathSection.querySelector(".savepath-apply-btn");
                if (applyBtn && !savePathIsAnimating) {
                    applyBtn.style.transition = "all 200ms ease";
                    if (savePathHasChanges) {
                        applyBtn.style.opacity = "1";
                        applyBtn.style.color = "#4CAF50";
                        applyBtn.style.filter = "drop-shadow(0 0 4px rgba(76, 175, 80, 0.6))";
                    } else {
                        applyBtn.style.opacity = "0.5";
                        applyBtn.style.color = "#666";
                        applyBtn.style.filter = "none";
                    }
                }
            });

            // restoreSavePath(); // Removed auto-restore for Save Path

            let savePathIsEnterHeld = false;
            let savePathIsMouseHeld = false;
            let savePathIsAnimating = false;

            savePathInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !savePathIsEnterHeld) {
                    savePathIsEnterHeld = true;
                    e.preventDefault();
                    if (savePathHasChanges && !savePathIsAnimating) {
                        performSavePathApplyAction();
                    } else if (!savePathHasChanges && !savePathIsAnimating) {
                        startSavePathGrayHold();
                    }
                }
            });

            savePathInput.addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    savePathIsEnterHeld = false;
                    if (!savePathHasChanges && !savePathIsAnimating) {
                        endSavePathGrayHold();
                    }
                }
            });

            savePathInput.addEventListener("mouseover", () => {
                if (
                    !savePathIsAnimating &&
                    document.activeElement !== savePathInput &&
                    savePathInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    savePathInput.style.borderColor = "#777";
                }
            });

            savePathInput.addEventListener("mouseout", () => {
                if (
                    !savePathIsAnimating &&
                    document.activeElement !== savePathInput &&
                    savePathInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    savePathInput.style.borderColor = "#555";
                }
            });

            savePathInput.addEventListener("focus", () => {
                if (
                    !savePathIsAnimating &&
                    savePathInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    savePathInput.style.borderColor = "#888";
                }
            });

            savePathInput.addEventListener("blur", () => {
                if (
                    !savePathIsAnimating &&
                    savePathInput.style.borderColor !== "rgb(76, 175, 80)"
                ) {
                    savePathInput.style.borderColor = "#555";
                }
            });

            savePathInputContainer.appendChild(savePathInput);

            const savePathApplyButton = makeElement(
                "button", {
                    textContent: "✓",
                    className: "savepath-apply-btn",
                }, {
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#666",
                    fontSize: "14px",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "3px",
                    opacity: "0.5",
                    transition: "all 200ms ease",
                },
            );

            const performSavePathApplyAction = () => {
                if (!savePathHasChanges || savePathIsAnimating) return;
                savePathIsAnimating = true;

                savePathInput.classList.add("applying-changes");
                savePathInput.style.borderColor = "#4CAF50";
                savePathInput.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";

                savePathApplyButton.style.color = "#2ecc71";
                savePathApplyButton.style.filter =
                    "drop-shadow(0 0 8px rgba(46, 204, 113, 0.8))";
                savePathApplyButton.style.textShadow = "0 0 12px rgba(46, 204, 113, 0.9)";

                setTimeout(() => {
                    localStorage.setItem("savePathTemplate", savePathTemplate);
                    // Set boolean to true when user applies any changes to save path
                    localStorage.setItem("userChangedSavePath", "true");
                    userChangedSavePath = true; // Update the variable immediately
                    originalSavePathTemplate = savePathTemplate;
                    savePathHasChanges = false;

                    savePathApplyButton.style.transition =
                        "all 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                    savePathApplyButton.style.transform =
                        "translateY(-50%) translateY(-30px)";
                    savePathApplyButton.style.filter = "blur(4px)";
                    savePathApplyButton.style.opacity = "0";

                    setTimeout(() => {
                        const appliedText = makeElement(
                            "span", {
                                textContent: "Applied!",
                            }, {
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%) translateY(25px)",
                                color: "#4CAF50",
                                fontSize: "11px",
                                fontWeight: "bold",
                                opacity: "0",
                                transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                            },
                        );

                        savePathInputContainer.appendChild(appliedText);

                        requestAnimationFrame(() => {
                            appliedText.style.opacity = "1";
                            appliedText.style.transform = "translateY(-50%) translateY(0px)";
                            appliedText.style.filter = "blur(0px)";
                        });

                        setTimeout(() => {
                            appliedText.style.transition =
                                "all 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                            appliedText.style.transform = "translateY(-50%) translateY(-25px)";
                            appliedText.style.filter = "blur(3px)";
                            appliedText.style.opacity = "0";

                            setTimeout(() => {
                                savePathApplyButton.style.transition = "none";
                                savePathApplyButton.style.transform =
                                    "translateY(-50%) translateY(25px)";
                                savePathApplyButton.style.opacity = "0";
                                savePathApplyButton.style.color = "#aaa";
                                savePathApplyButton.style.filter = "blur(1px)";

                                requestAnimationFrame(() => {
                                    savePathApplyButton.style.transition =
                                        "all 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                                    savePathApplyButton.style.transform =
                                        "translateY(-50%) translateY(-2px)";
                                    savePathApplyButton.style.opacity = "0.9";
                                    savePathApplyButton.style.color = "#999";
                                    savePathApplyButton.style.filter =
                                        "blur(0px) drop-shadow(0 0 6px rgba(153, 153, 153, 0.8)) hue-rotate(20deg)";
                                    savePathApplyButton.style.textShadow =
                                        "0 0 10px rgba(200, 200, 200, 0.9)";

                                    setTimeout(() => {
                                        // Always set to gray state after applying since changes are now saved
                                        savePathApplyButton.style.transition = "all 150ms ease-out";
                                        savePathApplyButton.style.transform =
                                            "translateY(-50%) translateY(0px)";
                                        savePathApplyButton.style.opacity = "0.5";
                                        savePathApplyButton.style.color = "#666";
                                        savePathApplyButton.style.filter = "none";
                                        savePathApplyButton.style.textShadow = "none";

                                        setTimeout(() => {
                                            savePathInput.classList.remove("applying-changes");
                                            if (document.activeElement === savePathInput) {
                                                savePathInput.style.borderColor = "#888";
                                                savePathInput.style.boxShadow =
                                                    "inset 0 0 0 1px rgba(136, 136, 136, 0.3)";
                                            } else {
                                                savePathInput.style.borderColor = "#555";
                                                savePathInput.style.boxShadow = "none";
                                            }
                                        }, 100);

                                        appliedText.remove();
                                        savePathIsAnimating = false;
                                    }, 250);
                                });
                            }, 100);
                        }, 500);
                    }, 120);
                }, 50);
            };

            const startSavePathGrayHold = () => {
                if (!savePathHasChanges && !savePathIsAnimating) {
                    savePathApplyButton.style.transition = "all 100ms ease";
                    savePathApplyButton.style.transform = "translateY(-50%) scale(0.9)";
                    savePathApplyButton.style.opacity = "0.3";
                }
            };

            const endSavePathGrayHold = () => {
                if (!savePathHasChanges && !savePathIsAnimating) {
                    savePathApplyButton.style.transition = "all 100ms ease";
                    savePathApplyButton.style.transform = "translateY(-50%) scale(1)";
                    savePathApplyButton.style.opacity = "0.5";
                }
            };

            savePathApplyButton.addEventListener("mousedown", () => {
                if (savePathHasChanges && !savePathIsAnimating) {
                    savePathInput.classList.add("applying-changes");
                    savePathInput.style.borderColor = "#4CAF50";
                    savePathInput.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";
                    performSavePathApplyAction();
                } else if (!savePathHasChanges && !savePathIsAnimating) {
                    savePathIsMouseHeld = true;
                    startSavePathGrayHold();
                }
            });

            savePathApplyButton.addEventListener("mouseup", () => {
                if (savePathIsMouseHeld) {
                    savePathIsMouseHeld = false;
                    endSavePathGrayHold();
                }
            });

            savePathApplyButton.addEventListener("mouseleave", () => {
                if (savePathIsMouseHeld) {
                    savePathIsMouseHeld = false;
                    endSavePathGrayHold();
                }
            });

            if (savePathHasChanges) {
                savePathApplyButton.style.opacity = "1";
                savePathApplyButton.style.color = "#4CAF50";
            }

            savePathInputContainer.appendChild(savePathApplyButton);
            savePathSection.appendChild(savePathInputContainer);

            const savePathTokenButtonsContainer = makeElement(
                "div", {}, {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "8px",
                    alignItems: "center",
                },
            );

            tokens.forEach(({
                token,
                label
            }) => {
                const button = createTokenButton(token, label, savePathInput, true);
                savePathTokenButtonsContainer.appendChild(button);
            });

            savePathSection.appendChild(savePathTokenButtonsContainer);

            // FileSystemAccess API Toggle
            const useFileSystemToggle = createToggle(
                "useFileSystemAccess",
                "Use FileSystemAccess API",
                "Enable to use save path with directory picker. Disable for regular downloads.",
                localStorage.getItem("useFileSystemAccess") === null ? false : localStorage.getItem("useFileSystemAccess") === "true",
            );

            useFileSystemToggle.input.addEventListener("change", (e) => {
                const isEnabled = e.target.checked;
                localStorage.setItem("useFileSystemAccess", isEnabled);

                // Smooth animation with resume logic
                directorySection.style.transition =
                    "all 400ms cubic-bezier(0.4, 0, 0.2, 1)";

                if (isEnabled) {
                    // Slide down animation
                    directorySection.style.maxHeight = "35px";
                    directorySection.style.opacity = "1";
                    directorySection.style.paddingTop = "5px";
                    directorySection.style.paddingBottom = "5px";
                    directorySection.style.marginBottom = "5px";
                    directorySection.style.transform = "translateY(0)";
                } else {
                    // Slide up animation
                    directorySection.style.maxHeight = "0";
                    directorySection.style.opacity = "0";
                    directorySection.style.paddingTop = "0";
                    directorySection.style.paddingBottom = "0";
                    directorySection.style.marginBottom = "0";
                    directorySection.style.transform = "translateY(-10px)";
                }
            });

            savePathSection.appendChild(useFileSystemToggle.container);

            // Directory Picker with smooth animation support
            const directorySection = makeElement(
                "div", {}, {
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    overflow: "hidden",
                    transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                    maxHeight: localStorage.getItem("useFileSystemAccess") === "true" ? "35px" : "0",
                    opacity: localStorage.getItem("useFileSystemAccess") === "true" ? "1" : "0",
                    paddingTop: localStorage.getItem("useFileSystemAccess") === "true" ? "5px" : "0",
                    paddingBottom: localStorage.getItem("useFileSystemAccess") === "true" ? "5px" : "0",
                    marginBottom: localStorage.getItem("useFileSystemAccess") === "true" ? "5px" : "0",
                },
            );

            const directoryLabel = makeElement(
                "span", {
                    textContent: "Directory",
                }, {
                    fontSize: "13px",
                    color: "#fff",
                    fontWeight: "bold",
                },
            );

            const directoryRightSection = makeElement(
                "div", {}, {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                },
            );

            const directoryName = makeElement(
                "span", {
                    textContent: "Not selected",
                }, {
                    fontSize: "12px",
                    color: "#aaa",
                    fontStyle: "italic",
                },
            );

            const directoryButton = makeElement(
                "button", {
                    textContent: "Browse",
                    className: "directory-button",
                }, {
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "12px",
                    transition: "all 200ms ease",
                },
            );

            let selectedDirectory = null;

            // IndexedDB functions for directory handle persistence
            const DB_NAME = "DirectoryHandles";
            const DB_VERSION = 1;
            const STORE_NAME = "handles";

            async function storeDirectoryHandle(handle) {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(DB_NAME, DB_VERSION);

                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains(STORE_NAME)) {
                            db.createObjectStore(STORE_NAME);
                        }
                    };

                    request.onsuccess = (e) => {
                        const db = e.target.result;
                        const transaction = db.transaction([STORE_NAME], "readwrite");
                        const store = transaction.objectStore(STORE_NAME);

                        const putRequest = store.put(handle, "selectedDirectory");
                        putRequest.onsuccess = () => resolve();
                        putRequest.onerror = () => reject(putRequest.error);
                    };

                    request.onerror = () => reject(request.error);
                });
            }

            async function getDirectoryHandle() {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(DB_NAME, DB_VERSION);

                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains(STORE_NAME)) {
                            db.createObjectStore(STORE_NAME);
                        }
                    };

                    request.onsuccess = (e) => {
                        const db = e.target.result;
                        const transaction = db.transaction([STORE_NAME], "readonly");
                        const store = transaction.objectStore(STORE_NAME);

                        const getRequest = store.get("selectedDirectory");
                        getRequest.onsuccess = () => resolve(getRequest.result);
                        getRequest.onerror = () => reject(getRequest.error);
                    };

                    request.onerror = () => reject(request.error);
                });
            }

            // Restore directory selection on page load
            directoryName.textContent = "Not selected";
            directoryName.style.color = "#aaa";
            directoryName.style.fontStyle = "italic";

            // Async function to restore directory handle
            (async () => {
                try {
                    const storedHandle = await getDirectoryHandle();
                    if (storedHandle) {
                        // Test if the handle is still valid
                        try {
                            const permission = await storedHandle.queryPermission({
                                mode: "readwrite",
                            });
                            if (permission === "granted" || permission === "prompt") {
                                selectedDirectory = storedHandle;
                                window.selectedDirectoryHandle = storedHandle;
                                directoryName.textContent = storedHandle.name;
                                directoryName.style.color = "#4CAF50";
                                directoryName.style.fontStyle = "normal";
                                debugLog(
                                    "[Directory] Restored from IndexedDB:",
                                    storedHandle.name,
                                );
                            } else {
                                debugLog("[Directory] Handle exists but permission denied");
                            }
                        } catch (error) {
                            debugLog("[Directory] Handle invalid, removing from storage");
                            // Handle is invalid, remove it
                            const request = indexedDB.open(DB_NAME, DB_VERSION);
                            request.onsuccess = (e) => {
                                const db = e.target.result;
                                const transaction = db.transaction([STORE_NAME], "readwrite");
                                const store = transaction.objectStore(STORE_NAME);
                                store.delete("selectedDirectory");
                            };
                        }
                    }
                } catch (error) {
                    console.warn("[Directory] Error restoring from IndexedDB:", error);
                }
            })();

            directoryButton.addEventListener("click", async () => {
                if ("showDirectoryPicker" in window) {
                    try {
                        selectedDirectory = await window.showDirectoryPicker();
                        window.selectedDirectoryHandle = selectedDirectory; // Store globally for save function
                        directoryName.textContent = selectedDirectory.name;
                        directoryName.style.color = "#4CAF50";
                        directoryName.style.fontStyle = "normal";

                        // Persist directory handle in IndexedDB
                        storeDirectoryHandle(selectedDirectory)
                            .then(() => {
                                debugLog(
                                    "[Directory] Stored in IndexedDB:",
                                    selectedDirectory.name,
                                );
                            })
                            .catch((error) => {
                                console.warn("[Directory] Failed to store in IndexedDB:", error);
                            });
                    } catch (err) {
                        console.warn("Directory picker was cancelled or failed:", err);
                    }
                } else {
                    alert("FileSystemAccess API is not supported in this browser.");
                }
            });

            directoryRightSection.appendChild(directoryName);
            directoryRightSection.appendChild(directoryButton);
            directorySection.appendChild(directoryLabel);
            directorySection.appendChild(directoryRightSection);
            savePathSection.appendChild(directorySection);

            settingsContent.appendChild(savePathSection);
            settingsContent.appendChild(templateSection);

            // Export Options Section
            const exportOptionsSection = makeElement(
                "div", {}, {
                    marginTop: "20px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease",
                    cursor: "default",
                },
            );

            const exportOptionsTitle = makeElement(
                "h3", {
                    textContent: "Export Options",
                }, {
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                },
            );
            exportOptionsSection.appendChild(exportOptionsTitle);
            const exportOptionsGrid = makeElement("div", {}, {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px"
            });
            exportOptionsSection.appendChild(exportOptionsGrid);

            // Use character's chat name toggle
            const chatNameToggle = createToggle(
                "useChatNameForName",
                "Use chat name",
                "Uses chat name for the character name instead of the card's main name.",
                useChatNameForName,
            );
            chatNameToggle.input.addEventListener("change", (e) => {
                useChatNameForName = e.target.checked;
            });
            exportOptionsGrid.appendChild(chatNameToggle.container);

            // Apply {{char}} tokenization toggle
            const charTokenToggle = createToggle(
                "applyCharToken",
                "Tokenize char name",
                "Replaces the character's name with {{char}}.",
                localStorage.getItem("applyCharToken") === "true",
            );
            charTokenToggle.input.addEventListener("change", (e) => {
                applyCharToken = e.target.checked;
            });
            exportOptionsGrid.appendChild(charTokenToggle.container);

            // Always send a message before export (even if definition is public)
            const preSendToggle = createToggle(
                "preSendBeforeExport",
                "Send extract message (RECOMMENDED)",
                "Send 'extract-char' message before exporting regardless of whether the character card's definition is public or hidden.",
                localStorage.getItem("preSendBeforeExport") === null ? true : localStorage.getItem("preSendBeforeExport") === "true",
            );
            exportOptionsGrid.appendChild(preSendToggle.container);

            // Include Creator Notes toggle
            const creatorNotesToggle = createToggle(
                "includeCreatorNotes",
                "Include creator notes",
                "Include the creator's notes in exported files.",
                localStorage.getItem("includeCreatorNotes") === null ? true : localStorage.getItem("includeCreatorNotes") !== "false",
            );
            exportOptionsGrid.appendChild(creatorNotesToggle.container);

            // Render image links inside Creator's Notes
            const renderNotesImagesToggle = createToggle(
                "renderNotesImages",
                "Inline images in Notes",
                "Show image URLs as inline images in Creator's Notes.",
                localStorage.getItem("renderNotesImages") === null ? false : localStorage.getItem("renderNotesImages") === "true",
            );
            exportOptionsGrid.appendChild(renderNotesImagesToggle.container);
            // Re-render notes preview when this setting changes
            renderNotesImagesToggle.input.addEventListener("change", () => {
                try {
                    updateCharacterPreview();
                } catch (_) {}
                // If the notes section is open, re-measure after content changes and image loads
                setTimeout(() => {
                    const area = document.querySelector('#section-creatorNotes .content-area');
                    const text = document.getElementById('content-creatorNotes');
                    if (area && text) {
                        area.style.maxHeight = (text.scrollHeight + 20) + 'px';
                        const imgs = area.querySelectorAll('img');
                        const adjust = () => {
                            area.style.maxHeight = (text.scrollHeight + 20) + 'px';
                        };
                        imgs.forEach(img => {
                            if (!img.complete) {
                                img.addEventListener('load', adjust, {
                                    once: true
                                });
                                img.addEventListener('error', adjust, {
                                    once: true
                                });
                            }
                        });
                    }
                }, 150);
            });

            // Include Tags toggle
            const includeTagsToggle = createToggle(
                "includeTags",
                "Include tags",
                "Include character tags in exported files (PNG/JSON only). Emojis will be removed.",
                localStorage.getItem("includeTags") === null ? false : localStorage.getItem("includeTags") !== "false",
            );
            exportOptionsGrid.appendChild(includeTagsToggle.container);

            // Include Link List toggle (append URLs found in Creator's Notes to exports)
            const includeLinkListToggle = createToggle(
                "includeLinkList",
                "Include link list",
                "Append URLs from Creator's Notes to exports (TXT/PNG/JSON).",
                false,
            );
            // Update Links panel immediately when this changes or is reset
            includeLinkListToggle.input.addEventListener("change", () => {
                renderLinksPanel(lastLinksUrlsGui);
            });
            exportOptionsGrid.appendChild(includeLinkListToggle.container);

            // Parse HTML to readable text for all exports
            const parseHtmlForTxtToggle = createToggle(
                "parseHtmlForTxt",
                "Plain notes",
                "Convert Creator's Notes to plain text (no HTML) in all exports.",
                localStorage.getItem("parseHtmlForTxt") === null ? false : localStorage.getItem("parseHtmlForTxt") === "true",
            );
            exportOptionsGrid.appendChild(parseHtmlForTxtToggle.container);

            settingsContent.appendChild(exportOptionsSection);

            // Advanced Section
            const advancedSection = makeElement(
                "div", {}, {
                    marginTop: "20px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease",
                    cursor: "default",
                },
            );

            const advancedTitle = makeElement(
                "h3", {
                    textContent: "Advanced",
                }, {
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                },
            );
            advancedSection.appendChild(advancedTitle);

            // Show Debug Logs toggle
            const debugLogsToggle = createToggle(
                "showDebugLogs",
                "Debug logs",
                "Show verbose console logging for debugging",
                localStorage.getItem("showDebugLogs") === null ? false : localStorage.getItem("showDebugLogs") === "true",
            );
            advancedSection.appendChild(debugLogsToggle.container);

            settingsContent.appendChild(advancedSection);

            // UI & Access Section
            const uiAccessSection = makeElement(
                "div", {}, {
                    marginTop: "20px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 200ms ease",
                    cursor: "default",
                },
            );
            const uiAccessTitle = makeElement(
                "h3", {
                    textContent: "UI"
                }, {
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                }
            );
            uiAccessSection.appendChild(uiAccessTitle);

            const alwaysShowFabToggle = createToggle(
                "alwaysShowFab",
                "Always show opener on desktop",
                "Also show the opener on desktop (in addition to T).",
                localStorage.getItem("alwaysShowFab") === null ? true : localStorage.getItem("alwaysShowFab") === "true",
            );

            uiAccessSection.appendChild(alwaysShowFabToggle.container);

            alwaysShowFabToggle.input.addEventListener("change", () => {
                if (typeof window.updateFloatingOpener === "function") {
                    window.updateFloatingOpener();
                }
            });

            // Toggle: Show Links panel
            const showLinksPanelToggle = createToggle(
                "showLinksPanel",
                "Show Links panel",
                "Toggle the visibility of the Links panel under the preview.",
                false,
            );
            showLinksPanelToggle.input.addEventListener("change", () => {
                // Re-render the panel according to new visibility state
                renderLinksPanel(lastLinksUrlsGui);
            });
            uiAccessSection.appendChild(showLinksPanelToggle.container);

            // Trigger Key Setting
            const triggerKeyContainer = makeElement("div", {}, {
                marginBottom: "12px",
                padding: "15px",
                background: "#2a2a2a",
                borderRadius: "10px",
                border: "1px solid #444"
            });

            const triggerKeyLabel = makeElement("label", {
                textContent: "Trigger Key:"
            }, {
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                color: "#fff",
                fontWeight: "500"
            });

            const triggerKeyInput = makeElement("div", {
                textContent: triggerKey.toUpperCase(),
                tabIndex: "0"
            }, {
                width: "60px",
                padding: "8px 12px",
                background: "#333",
                border: "1px solid #555",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "14px",
                textAlign: "center",
                cursor: "pointer",
                outline: "none",
                userSelect: "none",
                display: "inline-block",
                minHeight: "16px",
                lineHeight: "16px"
            });

            // Add data attribute to identify this as a keybind input
            triggerKeyInput.setAttribute('data-keybind-input', 'true');

            const triggerKeyHelp = makeElement("div", {
                textContent: "Click to change the trigger key"
            }, {
                fontSize: "11px",
                color: "#aaa",
                marginTop: "4px"
            });

            let isListening = false;

            // Handle focus - show listening state
            triggerKeyInput.addEventListener("focus", (e) => {
                if (!isListening) {
                    isListening = true;
                    e.target.textContent = "...";
                    e.target.style.color = "#fff";
                    triggerKeyHelp.textContent = "Press any key...";
                }
            });

            // Handle blur - reset to normal state if no key was pressed
            triggerKeyInput.addEventListener("blur", (e) => {
                if (isListening) {
                    isListening = false;
                    e.target.textContent = triggerKey.toUpperCase();
                    e.target.style.color = "#fff";
                    triggerKeyHelp.textContent = "Click to change the trigger key";
                }
            });

            // Handle keydown to capture key press
            triggerKeyInput.addEventListener("keydown", (e) => {
                if (isListening && e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event from bubbling to global handler
                    const newKey = e.key.toLowerCase();
                    triggerKey = newKey;
                    localStorage.setItem("triggerKey", newKey);

                    // Update display
                    e.target.textContent = newKey.toUpperCase();
                    e.target.style.color = "#fff";
                    triggerKeyHelp.textContent = "Click to change the trigger key";

                    // Exit listening mode and just unfocus
                    isListening = false;
                    e.target.blur();
                } else if (isListening) {
                    e.preventDefault(); // Prevent other keys from doing anything
                    e.stopPropagation(); // Prevent event from bubbling to global handler
                }
            });

            // Handle click to enter listening mode
            triggerKeyInput.addEventListener("click", (e) => {
                e.target.focus();
            });

            // Handle click to enter listening mode
            triggerKeyInput.addEventListener("click", (e) => {
                e.target.focus();
            });

            triggerKeyContainer.appendChild(triggerKeyLabel);
            triggerKeyContainer.appendChild(triggerKeyInput);
            triggerKeyContainer.appendChild(triggerKeyHelp);
            uiAccessSection.appendChild(triggerKeyContainer);

            settingsContent.appendChild(uiAccessSection);

            const tabs = {
                export: {
                    content: exportContent,
                    tab: exportTab,
                    active: true,
                },
                settings: {
                    content: settingsContent,
                    tab: settingsTab,
                    active: false,
                },
            };

            function switchTab(tabKey) {
                const previousTab = currentActiveTab;
                currentActiveTab = tabKey;

                // Save filename draft and clean up toggle states when switching AWAY from settings
                if (previousTab === "settings" && tabKey !== "settings") {
                    const templateInput = document.querySelector(
                        'input[placeholder="Enter filename template"]',
                    );
                    if (templateInput && templateInput.value) {
                        localStorage.setItem("filenameTemplateDraft", templateInput.value);
                    }
                }


                // Only restore when switching TO settings (not from settings)
                if (tabKey === "settings" && previousTab !== "settings") {
                    // Immediate restoration before settings tab loads
                    inputStateManager.restoreAll(false);

                    // Use requestAnimationFrame to ensure DOM is ready for draft restoration
                    requestAnimationFrame(() => {
                        const templateInput = document.querySelector(
                            'input[placeholder="Enter filename template"]',
                        );
                        if (templateInput) {
                            const savedDraft = localStorage.getItem("filenameTemplateDraft");
                            if (savedDraft && savedDraft !== templateInput.value) {
                                templateInput.value = savedDraft;
                                filenameTemplate = savedDraft;
                                templateInput.dispatchEvent(
                                    new Event("input", {
                                        bubbles: true
                                    }),
                                );
                            }
                        }

                        // Auto-restore removed for Save Path input
                    });
                }

                // // Clean up scrollbar when switching AWAY from settings
                // if (previousTab === "settings" && tabKey !== "settings") {
                //     if (settingsScrollbar && settingsScrollbar.destroy) {
                //         settingsScrollbar.destroy();
                //         settingsScrollbar = null;
                //     }
                //     // Clean up any remaining scrollbar elements
                //     const existingTrack = settingsContent.parentElement?.querySelector(
                //         ".custom-scrollbar-track",
                //     );
                //     if (existingTrack) {
                //         existingTrack.remove();
                //     }
                // }

                animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
                animationTimeouts = [];

                Object.entries(tabs).forEach(([key, {
                    content,
                    tab
                }]) => {
                    const isActive = key === tabKey;

                    tab.style.opacity = isActive ? "1" : "0.7";
                    tab.style.transform = isActive ? "translateY(-2px)" : "";

                    const indicator = tab.lastChild;
                    if (indicator) {
                        if (isActive) {
                            indicator.style.background = ACTIVE_TAB_COLOR;
                            indicator.style.transform = "scaleX(1)";
                        } else {
                            indicator.style.background = INACTIVE_TAB_COLOR;
                            indicator.style.transform = "scaleX(0.5)";
                        }
                    }

                    content.style.display = "block";
                    content.style.pointerEvents = isActive ? "auto" : "none";

                    if (isActive) {
                        content.style.opacity = "0";
                        content.style.transform = "scale(0.95)";

                        void content.offsetWidth;

                        requestAnimationFrame(() => {
                            content.style.opacity = "1";
                            content.style.transform = "scale(1)";

                        });
                    } else {
                        requestAnimationFrame(() => {
                            content.style.opacity = "0";
                            content.style.transform = "scale(0.95)";

                        });


                        const hideTimeout = setTimeout(() => {
                            if (!tabs[key].active) {
                                content.style.display = "none";
                            }
                        }, TAB_ANIMATION_DURATION);


                        animationTimeouts.push(hideTimeout);
                    }

                    tabs[key].active = isActive;
                });

                currentTab = tabKey;
                try {
                    sessionStorage.setItem("lastActiveTab", tabKey);
                } catch (e) {
                    debugWarn("Failed to save tab state to sessionStorage", e);
                }
            }

            const handleTabClick = (e) => {
                const tt = document.getElementById("char-export-tooltip");
                if (tt) {
                    tt.style.opacity = "0";
                    const offsetHide = TOOLTIP_SLIDE_FROM_RIGHT ?
                        -TOOLTIP_SLIDE_OFFSET :
                        TOOLTIP_SLIDE_OFFSET;
                    tt.style.transform = `translateX(${offsetHide}px)`;
                }
                const tabKey = e.target === exportTab ? "export" : "settings";
                if (!tabs[tabKey].active) {
                    switchTab(tabKey);
                }
            };

            exportTab.onclick = handleTabClick;
            settingsTab.onclick = handleTabClick;

            Object.entries(tabs).forEach(([key, {
                content
            }]) => {
                const isActive = key === currentTab;

                content.style.display = isActive ? "block" : "none";
                content.style.opacity = isActive ? "1" : "0";
                content.style.transform = isActive ? "scale(1)" : "scale(0.95)";
            });

            switchTab(currentTab);

            document.body.appendChild(gui);

            // Add backdrop with smooth linear animation
            const backdrop = makeElement(
                "div", {
                    id: "char-export-backdrop",
                }, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0)",
                    backdropFilter: "blur(0px)",
                    zIndex: "9999",
                    opacity: "0",
                    transition: "all 150ms ease-out",
                },
            );

            document.body.insertBefore(backdrop, gui);

            // Set initial modal state
            gui.style.opacity = "0";
            gui.style.transform = "translate(-50%, -50%) scale(0.95)";
            gui.style.filter = "blur(3px)";
            gui.style.transition = "all 150ms ease-out";

            // Start backdrop animation smoothly - no instant fill
            requestAnimationFrame(() => {
                backdrop.style.opacity = "1";
                backdrop.style.background = "rgba(0, 0, 0, 0.4)";
                backdrop.style.backdropFilter = "blur(3px)";

                gui.style.opacity = "1";
                gui.style.transform = "translate(-50%, -50%) scale(1)";
                gui.style.filter = "blur(0px) drop-shadow(0 15px 35px rgba(0,0,0,0.3))";
            });

            document.addEventListener("mousedown", handleDialogOutsideClick);
            document.addEventListener("mouseup", handleDialogOutsideClick);
        }

        function toggleUIState() {
            debugLog('[Debug] toggleUIState called, viewActive:', viewActive);
            animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            animationTimeouts = [];

            if (guiElement && document.body.contains(guiElement)) {
                debugLog('[Debug] GUI element exists in document');
                if (viewActive) {
                    const backdrop = document.getElementById("char-export-backdrop");
                    const currentGuiOpacity =
                        parseFloat(getComputedStyle(guiElement).opacity) || 0;
                    const currentBackdropOpacity = backdrop ?
                        parseFloat(getComputedStyle(backdrop).opacity) || 0 :
                        0;

                    guiElement.style.display = "flex";

                    void guiElement.offsetHeight;

                    requestAnimationFrame(() => {
                        guiElement.style.transition = "all 150ms ease-out";
                        guiElement.style.opacity = "1";
                        guiElement.style.transform = "translate(-50%, -50%) scale(1)";
                        guiElement.style.filter =
                            "blur(0px) drop-shadow(0 15px 35px rgba(0,0,0,0.3))";

                        if (backdrop) {
                            backdrop.style.transition = "all 150ms ease-out";
                            backdrop.style.opacity = "1";
                            backdrop.style.background = "rgba(0, 0, 0, 0.4)";
                            backdrop.style.backdropFilter = "blur(3px)";
                        }
                    });
                } else {
                    const backdrop = document.getElementById("char-export-backdrop");

                    const currentGuiOpacity =
                        parseFloat(getComputedStyle(guiElement).opacity) || 1;
                    const currentBackdropOpacity = backdrop ?
                        parseFloat(getComputedStyle(backdrop).opacity) || 1 :
                        0;

                    const transformMatrix = getComputedStyle(guiElement).transform;
                    let currentScale = 1;
                    if (transformMatrix !== "none") {
                        const values = transformMatrix.match(/-?\d+\.?\d*/g);
                        if (values && values.length >= 6) {
                            currentScale = parseFloat(values[0]);
                        }
                    }

                    requestAnimationFrame(() => {
                        guiElement.style.transition = "all 120ms ease-in";
                        guiElement.style.opacity = "0";
                        guiElement.style.transform = "translate(-50%, -50%) scale(0.9)";
                        guiElement.style.filter = "blur(4px)";

                        if (backdrop) {
                            backdrop.style.transition = "all 120ms ease-in";
                            backdrop.style.opacity = "0";
                            backdrop.style.background = "rgba(0, 0, 0, 0)";
                            backdrop.style.backdropFilter = "blur(0px)";
                        }
                    });

                    // Force-remove any lingering tooltips (e.g., Links panel tooltip)
                    try {
                        const linkTip = document.getElementById('links-hover-tooltip');
                        if (linkTip) linkTip.remove();
                        const dynTip = document.getElementById('char-export-tooltip');
                        if (dynTip) dynTip.remove();
                    } catch (_) {}

                    const removeTimeout = setTimeout(() => {
                        if (!viewActive && guiElement && document.body.contains(guiElement)) {
                            document.body.removeChild(guiElement);
                            const backdrop = document.getElementById("char-export-backdrop");
                            if (backdrop) backdrop.remove();
                            document.removeEventListener("mousedown", handleDialogOutsideClick);
                            document.removeEventListener("mouseup", handleDialogOutsideClick);
                            guiElement = null;
                        }
                    }, 140);
                    animationTimeouts.push(removeTimeout);
                }
            } else if (viewActive) {
                createUI();
            }
            // Update floating opener visibility whenever UI state changes
            if (typeof window.updateFloatingOpener === "function") {
                try {
                    window.updateFloatingOpener();
                } catch (_) {}
            }
        }

        /**
         * Centralized input state manager with immediate restoration
         * Handles DOM queries, variable sync, and immediate updates with retry logic
         * @param {boolean} force - Force restoration regardless of current value
         * @param {number} retryCount - Internal retry counter for DOM queries
         */
        function createInputStateManager() {
            const SELECTORS = {
                filename: 'input[placeholder="Enter filename template"]',
            };

            const DEFAULTS = {
                filename: "{name}",
            };

            const STATE_KEYS = {
                filename: "filenameTemplate",
            };

            function restoreInput(type, force = false, retryCount = 0) {
                const input = document.querySelector(SELECTORS[type]);

                if (!input) {
                    if (retryCount < 5) {
                        requestAnimationFrame(() =>
                            restoreInput(type, force, retryCount + 1),
                        );
                    }
                    return;
                }

                const savedValue =
                    localStorage.getItem(STATE_KEYS[type]) || DEFAULTS[type];
                const needsRestore = force || input.value.trim() === "";

                if (needsRestore) {
                    input.value = savedValue;
                    if (type === "filename") {
                        window.filenameTemplate = savedValue;
                        filenameTemplate = savedValue;
                    }

                    input.dispatchEvent(new Event("input", {
                        bubbles: true
                    }));
                }
            }

            return {
                restoreAll: (force = false) => {
                    if (restorationInProgress) return;
                    restorationInProgress = true;

                    restoreInput("filename", force);

                    setTimeout(() => {
                        restorationInProgress = false;
                    }, 50);
                },
                restoreFilename: (force = false) => restoreInput("filename", force),
            };
        }

        const inputStateManager = createInputStateManager();

        function closeV() {
            if (!viewActive) return;

            const templateInput = document.querySelector(
                'input[placeholder="Enter filename template"]',
            );
            debugLog('[Debug] Current chatData state:', {
                exists: !!chatData,
                character: chatData?.character,
                messages: chatData?.chatMessages?.length
            });

            if (templateInput && templateInput.value) {
                localStorage.setItem("filenameTemplateDraft", templateInput.value);
            }


            inputStateManager.restoreAll(false);

            // Ensure any transient tooltips are removed immediately on close
            try {
                const linkTip = document.getElementById('links-hover-tooltip');
                if (linkTip) linkTip.remove();
                const dynTip = document.getElementById('char-export-tooltip');
                if (dynTip) dynTip.remove();
            } catch (_) {}

            requestAnimationFrame(() => {
                viewActive = false;
                toggleUIState();
            });
        }

        let isMouseDownInside = false;

        function handleDialogOutsideClick(e) {
            const gui = document.getElementById("char-export-gui");
            const backdrop = document.getElementById("char-export-backdrop");

            if (e.type === "mousedown") {
                isMouseDownInside = gui && gui.contains(e.target);
            } else if (e.type === "mouseup") {
                const isMouseUpOutside = !gui || !gui.contains(e.target);
                if (!isMouseDownInside && isMouseUpOutside) {
                    closeV();
                }
                isMouseDownInside = false;
            }
        }

        /* ============================
           ==      INTERCEPTORS     ==
           ============================ */
        function interceptNetwork() {
            debugLog('[Debug] interceptNetwork called, networkInterceptActive:', networkInterceptActive);
            if (networkInterceptActive) {
                debugLog('[Debug] Network intercept already active, returning');
                return;
            }
            networkInterceptActive = true;

            const origXHR = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                this.addEventListener("load", () => {
                    if (url.includes("generateAlpha")) modifyResponse(this.responseText);
                    if (url.includes("/hampter/chats/"))
                        modifyChatResponse(this.responseText);
                });
                return origXHR.apply(this, arguments);
            };

            const origFetch = window.fetch;
            window.fetch = async function(...args) {
                const requestUrl = typeof args[0] === 'string' ? args[0] : args[0]?.url;

                if (shouldInterceptNext && cachedProxyUrl && requestUrl === cachedProxyUrl) {
                    return new Response('{"choices":[]}', {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }

                try {
                    const res = await origFetch(...args);
                    if (res.ok) {
                        if (res.url?.includes("generateAlpha")) {
                            res.clone().text().then(modifyResponse).catch(() => {});
                        }
                        if (res.url?.includes("/hampter/chats/")) {
                            res.clone().text().then(modifyChatResponse).catch(() => {});
                        }
                    }
                    return res;
                } catch (error) {
                    return new Response(null, {
                        status: 500,
                        statusText: "Userscript Handled Fetch"
                    });
                }
            };
        }

        function modifyResponse(text) {
            debugLog('[Debug] modifyResponse called, shouldInterceptNext:', shouldInterceptNext);
            if (!shouldInterceptNext) {
                debugLog('[Debug] shouldInterceptNext is false, returning');
                return;
            }
            shouldInterceptNext = false;
            try {
                debugLog('[Debug] Attempting to parse response');
                const json = JSON.parse(text);
                const sys = json.messages.find((m) => m.role === "system")?.content || "";
                let initMsg = chatData.chatMessages?.findLast(m => m.is_bot === true)?.message || "";
                const header = document.querySelector("p.chakra-text.css-1nj33dt");
                const headerName = header?.textContent
                    .match(/Chat with\s+(.*)$/)?.[1]
                    ?.trim();
                const fullName = (
                    chatData?.character?.chat_name ||
                    chatData?.character?.name ||
                    ""
                ).trim();
                const nameFirst = (chatData?.character?.name || "")
                    .trim()
                    .split(/\s+/)[0];
                const charName = fullName || nameFirst || headerName || "char";

                let charBlock = "";
                let scen = "";
                let persona = "";
                let exampleDialogs = "";

                // Strip system note at the beginning
                let content = typeof sys === "string" ? sys : "";
                content = content.replace(/^\s*\[System note:[\s\S]*?\]\s*/, "");

                // Check what format we're dealing with
                const botPersonaMatch = content.match(/<(?!UserPersona\b)([^>]*?Persona)>([\s\S]*?)<\/\1>/i);
                const scenarioMatch = content.match(/<Scenario>([\s\S]*?)<\/Scenario>/i);
                const userPersonaMatch = content.match(/<UserPersona>([\s\S]*?)<\/UserPersona>/i);
                const exampleDialogsMatch = content.match(/<example_dialogs>([\s\S]*?)<\/example_dialogs>/i);

                /*
                Format detection and parsing:
                1. Old format: Has <CharName's Persona> AND <Scenario> tags
                2. Hybrid format: Has <CharName's Persona> but NO <Scenario> tag
                3. New format: No <CharName's Persona> tag at all
                */

                /*
                Old format - Both persona and scenario tags:
                [System note: ...] <- Stripped
                <Character's Persona>
                  Character description here
                </Character's Persona> <- Extracted as charBlock
                <Scenario>
                  Scenario text here
                </Scenario> <- Extracted as scen
                <UserPersona>
                  Hi
                </UserPersona> <- Ignored
                <example_dialogs>
                  test example dialogs
                </example_dialogs> <- Extracted as exampleDialogs
                */

                /*
                Hybrid format - Persona tag but no scenario tag:
                [System note: ...] <- Stripped
                <Character's Persona>
                  Character description here
                </Character's Persona> <- Extracted as charBlock (base)
                Some scenario text here <- Added to charBlock
                <UserPersona>
                  Hi
                </UserPersona> <- Ignored
                <example_dialogs>
                  test example dialogs
                </example_dialogs> <- Extracted as exampleDialogs
                */

                /*
                New format - No persona tag:
                [System note: ...] <- Stripped
                test personality
                test scenario <- All extracted as charBlock
                <UserPersona>
                  Hi
                </UserPersona> <- Ignored
                <example_dialogs>
                  test example dialogs
                </example_dialogs> <- Extracted as exampleDialogs
                */

                if (botPersonaMatch && scenarioMatch) {
                    // Old format with both tags
                    charBlock = botPersonaMatch[2].trim();
                    scen = scenarioMatch[1].trim();
                } else if (botPersonaMatch && !scenarioMatch) {
                    // Hybrid format: has persona tag but no scenario tag
                    charBlock = botPersonaMatch[2].trim();

                    // Extract content between persona closing tag and UserPersona as scenario
                    const personaEndIndex = content.indexOf(botPersonaMatch[0]) + botPersonaMatch[0].length;
                    const afterPersona = content.substring(personaEndIndex);
                    const beforeUserPersona = afterPersona.match(/^([\s\S]*?)(?:<UserPersona>|<example_dialogs>|$)/i);

                    if (beforeUserPersona && beforeUserPersona[1].trim()) {
                        // Include this as part of description since no scenario tag exists
                        charBlock = charBlock + "\n" + beforeUserPersona[1].trim();
                    }
                } else {
                    // New format: no persona tag, everything before UserPersona is description
                    const beforeUserPersona = content.match(/^([\s\S]*?)(?:<UserPersona>|<example_dialogs>|$)/i);
                    if (beforeUserPersona) {
                        charBlock = beforeUserPersona[1].trim();
                    }
                }

                // Extract UserPersona (for parsing completeness, though ignored)
                if (userPersonaMatch) {
                    persona = userPersonaMatch[1].trim();
                }

                // Extract example dialogs
                if (exampleDialogsMatch) {
                    exampleDialogs = exampleDialogsMatch[1].trim();
                }

                // Export logic based on the format
                const rawExs = extractTagContent(sys, "example_dialogs");
                const exs = rawExs.replace(
                    /^\s*Example conversations between[^:]*:\s*/,
                    "",
                );
                const userName = cachedUserName;
                switch (exportFormat) {
                    case "txt":
                        saveAsTxt(charBlock, scen, initMsg, exs, charName, userName);
                        break;
                    case "png":
                        saveAsPng(charName, charBlock, scen, initMsg, exs, userName);
                        break;
                    case "json":
                        saveAsJson(charName, charBlock, scen, initMsg, exs, userName);
                        break;
                }
                exportFormat = null;
            } catch (err) {
                debugError("Error processing response:", err);
            }
        }

        function modifyChatResponse(text) {
            try {
                if (!text || typeof text !== "string" || !text.trim()) return;

                const data = JSON.parse(text);
                if (data && data.character) {
                    chatData = data;
                }
            } catch (err) {
                // ignore parsing errors
            }
        }

        /* ============================
           ==      CORE LOGIC       ==
           ============================ */
        async function getCharacterMeta() {
            // ---------- BEGIN Method 1 helpers ----------
            const findCharacter = (obj, visited = new Set()) => {
                // Base case: If obj is not a searchable object or has already been visited, stop.
                if (!obj || typeof obj !== 'object' || visited.has(obj)) {
                    return null;
                }
                // Add the current object to the visited set to prevent infinite recursion.
                visited.add(obj);

                // Success condition: Check if the current object looks like a valid character object.
                // We use a combination of keys that are highly likely to be unique to the character definition.
                const isCharacterObject =
                    Object.prototype.hasOwnProperty.call(obj, "showdefinition") &&
                    Object.prototype.hasOwnProperty.call(obj, "id") &&
                    Object.prototype.hasOwnProperty.call(obj, "name") &&
                    Object.prototype.hasOwnProperty.call(obj, "personality") &&
                    Object.prototype.hasOwnProperty.call(obj, "first_message");

                if (isCharacterObject) {
                    return obj; // Found it!
                }

                // Recursive step: Iterate over all properties of the current object.
                for (const key in obj) {
                    // We only check own properties whose values are also objects.
                    if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'object') {
                        const result = findCharacter(obj[key], visited);
                        // If a nested call finds the character, propagate the result up immediately.
                        if (result) {
                            return result;
                        }
                    }
                }

                // Not found in this branch of the JSON tree.
                return null;
            };

            const extractFromJson = (json) => {
                if (!json) return null;
                const charObj = findCharacter(json);
                if (!charObj) {
                    if (localStorage.getItem("showDebugLogs") === "true") {
                        debugLog("[getCharacterMeta] Method 1: no character object found");
                    }
                    return null;
                }
                if (localStorage.getItem("showDebugLogs") === "true") {
                    debugLog(
                        "[getCharacterMeta] Method 1: character object located, showdefinition=",
                        charObj.showdefinition,
                    );
                }

                const {
                    name: rawName = "",
                    chat_name: chatName = "",
                    description: creatorNotesRaw = "",
                    personality: personalityRaw = "",
                    scenario: scenarioRaw = "",
                    first_message: firstMsgRaw = "",
                    example_dialogs: exDialogsRaw = "",
                    showdefinition = false,
                    id = "",
                } = charObj;

                if (!showdefinition) return null;

                const name = (rawName || chatName).trim();

                let characterVersion = getCharacterCardUrl(id);
                if (chatName && !useChatNameForName) {
                    characterVersion += `\nChat Name: ${chatName.trim()}`;
                }

                // Verbose logging for Method 1 (JSON.parse when showdefinition=true)
                if (localStorage.getItem("showDebugLogs") === "true") {
                    const src = "JSON.parse (showdefinition=true)";
                    debugLog("[getCharacterMeta] name", name, `<= ${src}`);
                    debugLog(
                        "[getCharacterMeta] personality",
                        personalityRaw,
                        `<= ${src}`,
                    );
                    debugLog("[getCharacterMeta] scenario", scenarioRaw, `<= ${src}`);
                    debugLog(
                        "[getCharacterMeta] first_message",
                        firstMsgRaw,
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] example_dialogs",
                        exDialogsRaw,
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] creator_notes",
                        creatorNotesRaw,
                        `<= ${src}`,
                    );
                }
                return {
                    characterVersion,
                    characterCardUrl: getCharacterCardUrl(id),
                    name,
                    creatorNotes: creatorNotesRaw,
                    personality: stripWatermark(personalityRaw),
                    scenario: stripWatermark(scenarioRaw),
                    firstMessage: stripWatermark(firstMsgRaw),
                    exampleDialogs: stripWatermark(exDialogsRaw),
                    definitionExposed: true,
                };
            };
            // ---------- END Method 1 helpers ----------
            // ---------- BEGIN Method 2 helpers (chatData fallback) ----------
            // Method 2 (showdefinition false) reads directly from chatData for character information.
            // ---------- END Method 2 helpers ----------
            const charId = chatData?.character?.id;
            if (!charId)
                return {
                    creatorUrl: "",
                    characterVersion: "",
                    characterCardUrl: "",
                    name: "",
                    creatorNotes: "",
                    personality: "",
                    scenario: "",
                    firstMessage: "",
                    exampleDialogs: "",
                    definitionExposed: false,
                };

            // Check cache first - return cached values unless debug logging is enabled
            const skipCache = localStorage.getItem("showDebugLogs") === "true";
            if (
                !skipCache &&
                characterMetaCache.id === charId &&
                characterMetaCache.useChatNameForName === useChatNameForName
            ) {
                if (localStorage.getItem("showDebugLogs") === "true") {
                    debugLog(
                        "[getCharacterMeta] Returning cached result for character:",
                        charId,
                    );
                }
                return {
                    creatorUrl: characterMetaCache.creatorUrl || "",
                    characterVersion: characterMetaCache.characterVersion || "",
                    characterCardUrl: characterMetaCache.characterCardUrl || "",
                    name: characterMetaCache.name || "",
                    creatorNotes: characterMetaCache.creatorNotes || "",
                    personality: characterMetaCache.personality || "",
                    scenario: characterMetaCache.scenario || "",
                    firstMessage: characterMetaCache.firstMessage || "",
                    exampleDialogs: characterMetaCache.exampleDialogs || "",
                    definitionExposed: characterMetaCache.definitionExposed || false,
                };
            }

            const characterCardUrl = getCharacterCardUrl(charId);
            let meta = {
                ...blankMeta,
                characterVersion: characterCardUrl,
                characterCardUrl,
            };
            try {
                const response = await fetch(characterCardUrl);
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
                // ---------- BEGIN Method 1 execution ----------
                let metaFromJson = null;
                try {
                    if (localStorage.getItem("showDebugLogs") === "true") {
                        debugLog("[getCharacterMeta] Method 1: scanning <script> tags");
                    }
                    const scripts = Array.from(doc.querySelectorAll("script"));
                    for (const s of scripts) {
                        const txt = s.textContent || "";
                        if (!txt.includes("window.mbxM.push(JSON.parse(")) continue;

                        // Start searching after the "JSON.parse(" part of the string.
                        const startIndex = txt.indexOf("JSON.parse(") + "JSON.parse(".length;
                        if (startIndex === "JSON.parse(".length - 1) continue;

                        let openParenCount = 1;
                        let endIndex = -1;

                        // Manually scan for the matching closing parenthesis to correctly
                        // capture the entire argument, even with nested structures.
                        for (let i = startIndex; i < txt.length; i++) {
                            if (txt[i] === '(') {
                                openParenCount++;
                            } else if (txt[i] === ')') {
                                openParenCount--;
                                if (openParenCount === 0) {
                                    endIndex = i;
                                    break;
                                }
                            }
                        }

                        if (endIndex === -1) continue;

                        // Extract the full argument string, e.g., '"{\\"key\\":\\"value\\"}"'
                        const jsonArgString = txt.substring(startIndex, endIndex).trim();

                        try {
                            // The site uses a double-encoded JSON string. We must parse it twice.
                            // 1. Parse the JavaScript string literal to get the raw JSON content.
                            const jsonContent = JSON.parse(jsonArgString);
                            // 2. Parse the raw JSON content to get the final JavaScript object.
                            const dataObject = JSON.parse(jsonContent);

                            // Now, search for the character object within the parsed data.
                            metaFromJson = extractFromJson(dataObject);
                            if (metaFromJson) {
                                break; // Success! Exit the loop.
                            }
                        } catch (e) {
                            if (localStorage.getItem("showDebugLogs") === "true") {
                                debugWarn("[getCharacterMeta] Failed to parse JSON from a script tag. Skipping.");
                            }
                            continue; // This JSON wasn't what we wanted, try the next script.
                        }
                    }
                } catch (parseErr) {
                    debugError(
                        "[getCharacterMeta] JSON parse error (Method 1):",
                        parseErr,
                    );
                }
                // ---------- END Method 1 execution ----------

                Object.assign(meta, metaFromJson || {}, {
                    creatorUrl: getCreatorUrlFromDoc(doc),
                    creatorNotes: chatData?.character?.description || "",
                });
            } catch (_) {}

            // Debug logging before cache assignment (shows every time when enabled)
            if (localStorage.getItem("showDebugLogs") === "true") {
                debugLog(
                    "[getCharacterMeta] creator_url",
                    meta.creatorUrl,
                    "<= getCreatorUrlFromDoc",
                );

                if (!meta.definitionExposed) {
                    const src = "generateAlpha/chatData (showdefinition=false)";
                    debugLog(
                        "[getCharacterMeta] name",
                        meta.name ||
                        chatData?.character?.name ||
                        chatData?.character?.chat_name,
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] personality",
                        chatData?.character?.personality || "extracted from generateAlpha",
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] scenario",
                        chatData?.character?.scenario || "extracted from generateAlpha",
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] first_message",
                        chatData?.character?.first_message || "extracted from generateAlpha",
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] example_dialogs",
                        chatData?.character?.example_dialogs ||
                        "extracted from generateAlpha",
                        `<= ${src}`,
                    );
                    debugLog(
                        "[getCharacterMeta] creator_notes",
                        chatData?.character?.description,
                        `<= ${src}`,
                    );
                }
            }

            Object.assign(characterMetaCache, {
                id: charId,
                useChatNameForName,
                ...meta,
            });

            return meta;
        }

        async function buildTemplate(charBlock, scen, initMsg, exs) {
            const sections = [];
            const {
                creatorUrl,
                characterCardUrl,
                creatorNotes
            } =
            await getCharacterMeta();
            const includeCreatorNotes =
                localStorage.getItem("includeCreatorNotes") === null ? true : localStorage.getItem("includeCreatorNotes") !== "false";

            const realName = chatData.character.name.trim();
            sections.push(`==== Name ====\n${realName}`);
            const chatName = (chatData.character.chat_name || realName).trim();
            sections.push(`==== Chat Name ====\n${chatName}`);
            if (charBlock) sections.push(`==== Description ====\n${charBlock.trim()}`);
            if (scen) sections.push(`==== Scenario ====\n${scen.trim()}`);
            if (initMsg) sections.push(`==== Initial Message ====\n${initMsg.trim()}`);

            // Add alternate greetings from first_messages array
            // JanitorAI now supports multiple greeting messages
            // Note: The API sometimes includes the first_message in the first_messages array as a duplicate
            if (chatData?.character?.first_messages && Array.isArray(chatData.character.first_messages)) {
                // Get the canonical first message for comparison (prefer chatData.character.first_message)
                const firstMessageNormalized = stripWatermark(chatData?.character?.first_message || initMsg || '').trim();

                const alternateGreetings = chatData.character.first_messages
                    .map(msg => typeof msg === 'string' ? stripWatermark(msg.trim()) : '')
                    .filter(msg => msg !== '')
                    // Filter out any message that's identical to the first message
                    .filter(msg => msg !== firstMessageNormalized);

                if (alternateGreetings.length > 0) {
                    const numbered = alternateGreetings.map((msg, idx) => `${idx + 2}. ${msg}`).join('\n\n');
                    sections.push(`==== Alternate Greetings ====\n${numbered}`);
                }
            }

            if (exs) sections.push(`==== Example Dialogs ====\n${exs.trim()}`);
            sections.push(`==== Character Card ====\n${characterCardUrl}`);
            sections.push(`==== Creator ====\n${creatorUrl}`);
            if (includeCreatorNotes && creatorNotes) {
                const parseHtmlForTxt = localStorage.getItem("parseHtmlForTxt") === "true";
                let notesText = String(creatorNotes);
                if (parseHtmlForTxt) {
                    const autoImg = localStorage.getItem("renderNotesImages") === "true";
                    notesText = creatorNotesToPlainText(creatorNotes, autoImg);
                }
                sections.push(`==== Creator Notes ====\n${notesText}`);
                const includeList = localStorage.getItem("includeLinkList") === "true";
                if (includeList) {
                    const urls = collectUrlsFromNotes(String(creatorNotes));
                    if (urls.length > 0) {
                        const annotated = urls.map(u => {
                            const {
                                kind
                            } = classifyUrl(u);
                            return `[${kind}] ${u}`;
                        }).join("\n");
                        sections.push(`==== Links ====\n${annotated}`);
                    }
                }
            }
            return sections.join("\n\n");
        }

        /**
         * Builds filename from template using available tokens
         * @param {string} template - Template string with tokens like {id}, {name}, etc.
         * @param {Object} tokens - Available token values
         * @returns {string} - Processed filename
         */
        function buildFilenameFromTemplate(template, tokens = {}) {
            if (!template || typeof template !== "string") {
                return tokens.name || tokens.chat_name || "card";
            }

            if (!template || template.trim() === "") {
                return "";
            }

            let result = template;

            // Step 1: Create unique placeholders for double brackets to prevent interference
            const placeholders = {};
            Object.entries(tokens).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {
                    const placeholder = `__TEMP_DOUBLE_${key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}__`;
                    placeholders[placeholder] = `{${String(value)}}`;
                    const doubleBracketRegex = new RegExp(
                        `\\{\\{${escapeRegExp(key)}\\}\\}`,
                        "g",
                    );
                    result = result.replace(doubleBracketRegex, placeholder);
                }
            });

            // Step 2: Handle single brackets normally
            Object.entries(tokens).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {
                    const singleBracketRegex = new RegExp(
                        `\\{${escapeRegExp(key)}\\}`,
                        "g",
                    );
                    result = result.replace(singleBracketRegex, String(value));
                }
            });

            // Step 3: Replace placeholders with final double bracket values
            Object.entries(placeholders).forEach(([placeholder, finalValue]) => {
                result = result.replace(
                    new RegExp(escapeRegExp(placeholder), "g"),
                    finalValue,
                );
            });

            // Clean up any remaining unreplaced tokens only if they don't have values
            result = result.replace(/\{\{[^}]+\}\}/g, "");
            result = result.replace(/\{[^}]+\}/g, "");

            // Clean up multiple spaces and trim
            result = result.replace(/\s+/g, " ").trim();

            // Strip all double quotes from the final filename to ensure compatibility
            result = result.replace(/"/g, '');

            // Return actual result or fallback to "export" only if completely empty
            return result || "export";
        }

        /**
         * Gets all available tokens for filename template
         * @param {Object} meta - Character metadata from getCharacterMeta
         * @returns {Object} - Object with all available tokens
         */
        async function getFilenameTokens(meta) {
            const charId = chatData?.character?.id || "";
            let creatorName = meta?.creatorUrl ?
                meta.creatorUrl.split("/").pop() || "" :
                "";

            let updatedDate = "";
            let createdDate = "";
            let tagsForCard = [];
            let tagsString = "";
            const isDebug = localStorage.getItem("showDebugLogs") === "true";

            try {
                if (isDebug) debugLog(`[getFilenameTokens] Fetching character page: ${meta.characterCardUrl}`);
                const response = await fetch(meta.characterCardUrl);
                const html = await response.text();
                if (isDebug) debugLog(`[getFilenameTokens] Successfully fetched HTML content.`);

                const match = html.match(/window\.mbxM\.push\(JSON\.parse\("([\s\S]*?)"\)\)/);

                if (isDebug) debugLog(`[getFilenameTokens] Regex search for 'window.mbxM.push' was ${match ? 'SUCCESSFUL' : 'FAILED'}.`);

                if (match && match[1]) {
                    try {
                        if (isDebug) debugLog(`[getFilenameTokens] Match found. Attempting to parse JSON...`);
                        const decoded = JSON.parse(`"${match[1]}"`);
                        const storeState = JSON.parse(decoded);
                        if (isDebug) debugLog(`[getFilenameTokens] Successfully parsed storeState object.`);

                        let characterData = null;
                        for (const key in storeState) {
                            if (storeState[key]?.character?.tags) {
                                characterData = storeState[key].character;
                                if (isDebug) debugLog(`[getFilenameTokens] Found character data object under key: ${key}`);
                                break;
                            }
                        }

                        if (characterData) {
                            const allTags = [];

                            if (characterData?.tags) {
                                const regularTags = characterData.tags
                                    .filter((tag) => typeof tag.id === "number" && tag.id >= 2)
                                    .map((tag) => tag.name);
                                allTags.push(...regularTags);
                            }

                            if (characterData?.custom_tags) {
                                allTags.push(...characterData.custom_tags);
                            }

                            const rawUniqueTags = [...new Set(allTags)];
                            if (isDebug) debugLog(`[getFilenameTokens] Found raw unique tags with filtering:`, rawUniqueTags);

                            tagsForCard = rawUniqueTags
                                .map((tag) =>
                                    tag
                                    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
                                    .trim(),
                                )
                                .filter((tag) => tag.length > 0)
                                .filter((name, index, arr) => arr.indexOf(name) === index);

                            const tagsForFilename = rawUniqueTags
                                .map((tag) => {
                                    let cleanTag = tag
                                        .replace(/🦰/g, "")
                                        .replace(/_{2,}/g, "_")
                                        .replace(/\s{2,}/g, " ")
                                        .trim();
                                    if (/^[\p{Emoji}]/u.test(cleanTag)) {
                                        cleanTag = cleanTag.replace(
                                            /([\p{Emoji}\uFE0F]+)\s+([\p{Emoji}\uFE0F]+)/gu,
                                            "$1$2",
                                        );
                                        cleanTag = cleanTag.replace(
                                            /([\p{Emoji}\uFE0F]+)\s+/u,
                                            "$1_",
                                        );
                                        cleanTag = cleanTag.replace(/\s/g, "");
                                    } else {
                                        cleanTag = cleanTag.replace(/\s/g, "");
                                    }
                                    return cleanTag;
                                })
                                .filter((tag) => tag.length > 0);

                            tagsString = tagsForFilename.join(" ");

                            if (isDebug) {
                                debugLog("[getFilenameTokens] Extracted tags for card:", tagsForCard);
                                debugLog("[getFilenameTokens] Extracted tags for filename:", tagsString);
                            }

                            if (characterData.created_at) {
                                const [year, month, day] = characterData.created_at.split("T")[0].split("-");
                                createdDate = `${parseInt(month)}-${parseInt(day)}-${year}`;
                            }
                            if (characterData.updated_at) {
                                const [year, month, day] = characterData.updated_at.split("T")[0].split("-");
                                updatedDate = `${parseInt(month)}-${parseInt(day)}-${year}`;
                            }
                            if (characterData.creator_name) {
                                creatorName = characterData.creator_name;
                            }
                        } else {
                            if (isDebug) debugWarn(`[getFilenameTokens] Could not find character data object within the parsed storeState.`);
                        }
                    } catch (parseError) {
                        debugError("[getFilenameTokens] JSON parse error:", parseError);
                    }
                }
            } catch (err) {
                debugError("[getFilenameTokens] Failed to fetch or process character page:", err);
            }

            return {
                id: charId,
                creator: creatorName,
                name: meta?.name || chatData?.character?.name || "",
                chat_name: chatData?.character?.chat_name || "",
                created: createdDate,
                updated: updatedDate,
                tags: tagsString,
                tagsArray: tagsForCard,
            };
        }

        async function saveAsTxt(charBlock, scen, initMsg, exs, charName, userName) {
            debugLog('[Debug] saveAsTxt called with:', {
                charBlock,
                scen,
                initMsg,
                exs,
                charName,
                userName
            });
            const template = await buildTemplate(charBlock, scen, initMsg, exs);
            debugLog('[Debug] Template built:', template);
            const tokenized = tokenizeNames(template, charName, userName);

            // Use filename template system
            const meta = await getCharacterMeta();
            const tokens = await getFilenameTokens(meta);
            const currentTemplate =
                localStorage.getItem("filenameTemplate") || "{name}";
            const fileName =
                buildFilenameFromTemplate(currentTemplate, tokens) || "export";

            saveFile(
                `${fileName}.txt`,
                new Blob([tokenized], {
                    type: "text/plain",
                }),
            );
        }

        /* ============================
           ==      INTERCEPTORS     ==
           ============================ */
        function extraction() {
            debugLog('[Debug] extraction() called, exportFormat:', exportFormat);
            if (!exportFormat) {
                debugLog('[Debug] No exportFormat set, returning');
                return;
            }

            // Debug current page state
            debugLog('[Debug] Checking page elements:', {
                chatData: chatData,
                hasCharacter: !!chatData?.character,
                characterName: chatData?.character?.name,
                bodyContent: document.body.innerHTML.substring(0, 200) // First 200 chars for debugging
            });

            // Proceed even if chatData hasn't been captured yet; we'll use the
            // generateAlpha interception fallback. Only block when we explicitly
            // know proxy is disabled for this character.
            if (chatData && chatData.character && chatData.character.allow_proxy === false) {
                alert("Proxy disabled — extraction aborted.");
                return;
            }

            (async () => {
                const meta = await getCharacterMeta();

                // Check user setting: force pre-send even when definition is public
                const forcePreSend = localStorage.getItem("preSendBeforeExport") === "true";

                // If definition is exposed and user does not want pre-send, export directly
                if (meta.definitionExposed && !forcePreSend) {
                    const charName = meta.name;
                    const userName = cachedUserName;
                    switch (exportFormat) {
                        case "txt":
                            saveAsTxt(
                                meta.personality,
                                meta.scenario,
                                meta.firstMessage,
                                meta.exampleDialogs,
                                charName,
                                userName,
                            );
                            break;
                        case "png":
                            saveAsPng(
                                charName,
                                meta.personality,
                                meta.scenario,
                                meta.firstMessage,
                                meta.exampleDialogs,
                                userName,
                            );
                            break;
                        case "json":
                            saveAsJson(
                                charName,
                                meta.personality,
                                meta.scenario,
                                meta.firstMessage,
                                meta.exampleDialogs,
                                userName,
                            );
                            break;
                    }
                    exportFormat = null;
                    return;
                }

                // Otherwise, pre-send a message and intercept generateAlpha
                shouldInterceptNext = true;
                interceptNetwork();
                callApi();
            })();
        }

        function callApi() {
            debugLog('[Debug] callApi called');
            try {
                const textarea = document.querySelector("textarea");
                if (!textarea) {
                    debugLog('[Debug] No textarea found');
                    return;
                }
                debugLog('[Debug] Found textarea:', textarea.value);

                Object.getOwnPropertyDescriptor(
                    HTMLTextAreaElement.prototype,
                    "value",
                ).set.call(textarea, "extract-char");
                textarea.dispatchEvent(
                    new Event("input", {
                        bubbles: true,
                    }),
                );

                ["keydown", "keyup"].forEach((type) =>
                    textarea.dispatchEvent(
                        new KeyboardEvent(type, {
                            key: "Enter",
                            code: "Enter",
                            bubbles: true,
                        }),
                    ),
                );
            } catch (err) {
                // ignore errors
            }
        }

        /* ============================
           ==  CREATOR NOTES EXPORT ==
           ============================ */
        function prepareCreatorNotesForExport(raw, inlineImages) {
            // Use shared parser so export matches GUI rendering exactly
            return buildCreatorNotesHtml(String(raw || ""), !!inlineImages);
        }

        // Save extra file directly into the selected directory (FileSystemAccess only)
        async function createFileInSelectedDir(relPath, blob) {
            try {
                const base = window.selectedDirectoryHandle;
                if (!base) return false;
                const segments = String(relPath).replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                const fileName = segments.pop();
                let dir = base;
                for (const seg of segments) {
                    dir = await dir.getDirectoryHandle(seg, {
                        create: true
                    });
                }
                const handle = await dir.getFileHandle(fileName, {
                    create: true
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return true;
            } catch (_) {
                return false;
            }
        }

        function buildLinksHtmlDocument(urls) {
            const rows = urls.map(u => {
                const {
                    kind
                } = classifyUrl(u);
                const safe = escapeHtml(u);
                return `<li><span style=\"opacity:.7;margin-right:6px\">[${escapeHtml(kind)}]</span><a href=\"${safe}\" target=\"_blank\" rel=\"noopener\">${safe}</a></li>`;
            }).join("");
            return `<!doctype html><html><head><meta charset=\"utf-8\"><title>Links</title></head><body style=\"background:#111;color:#ddd;font-family:system-ui,Segoe UI,Arial,sans-serif;\"><h2 style=\"text-align:center\">Links</h2><ul>${rows}</ul></body></html>`;
        }

        /* ============================
           ==    CHARA CARD V2      ==
           ============================ */
        async function buildCharaCardV2(
            charName,
            charBlock,
            scen,
            initMsg,
            exs,
            userName,
            tagsArray,
            avatarUrl,
        ) {
            const {
                creatorUrl,
                characterVersion,
                name: metaName,
                creatorNotes
            } = await getCharacterMeta();

            const tokenizedDesc = tokenizeField(charBlock, charName, userName);
            const tokenizedScen = tokenizeField(scen, charName, userName);
            const tokenizedExs = tokenizeField(exs, charName, userName);

            let displayName;
            if (useChatNameForName) {
                displayName =
                    (
                        chatData?.character?.chat_name ||
                        metaName ||
                        chatData?.character?.name ||
                        ""
                    ).trim();
            } else {
                displayName =
                    (
                        metaName ||
                        chatData?.character?.name ||
                        chatData?.character?.chat_name ||
                        ""
                    ).trim();
            }

            if (displayName) {
                // Remove double quotes to avoid issues in consumers
                displayName = displayName.replace(/"/g, '');
                // Automatically remove special letters (e.g., pipe "|") from the name field
                // This applies ONLY to the chara card template name, not filenames
                displayName = displayName.replace(/[|]/g, '');
            }

            if (!displayName) displayName = "Unknown";

            const originalLength = displayName.length;
            const wasNameTruncated = originalLength > 235;
            if (wasNameTruncated) {
                displayName = displayName.substring(0, 235);
            }

            /* --------------------
                     Build version text
                  -------------------- */
            let versionText = characterVersion;
            if (useChatNameForName) {
                const canonicalName = (
                    metaName ||
                    chatData?.character?.name ||
                    ""
                ).trim();
                if (canonicalName && canonicalName !== displayName) {
                    versionText = `${characterVersion}\nName: ${canonicalName}`;
                }
            }

            let includeCreatorNotes;
            if (localStorage.getItem("includeCreatorNotes") === null) {
                includeCreatorNotes = true; // default for first-time users
                localStorage.setItem("includeCreatorNotes", "true");
            } else {
                includeCreatorNotes = localStorage.getItem("includeCreatorNotes") !== "false";
            }

            let includeTags;
            if (localStorage.getItem("includeTags") === null) {
                includeTags = false; // default for first-time users
                localStorage.setItem("includeTags", "false");
            } else {
                includeTags = localStorage.getItem("includeTags") !== "false";
            }

            // Build creator_notes output using shared parser
            let preparedNotes = "";
            if (includeCreatorNotes) {
                const parseHtmlForTxt = localStorage.getItem("parseHtmlForTxt") === "true";
                const autoImg = localStorage.getItem("renderNotesImages") === "true";

                // Apply plain text conversion if setting is enabled
                if (parseHtmlForTxt) {
                    preparedNotes = creatorNotesToPlainText(creatorNotes, autoImg);
                } else {
                    preparedNotes = buildCreatorNotesHtml(String(creatorNotes || ""), autoImg);
                }

                const includeList = localStorage.getItem("includeLinkList") === "true";
                if (includeList) {
                    const urls = collectUrlsFromNotes(String(creatorNotes || ""));
                    if (urls.length > 0) {
                        if (parseHtmlForTxt) {
                            // Plain notes: use Markdown-style links specifically for PNG/JSON exports
                            const items = urls.map(u => {
                                const {
                                    kind
                                } = classifyUrl(u);
                                return `- [${kind}] ${u}`;
                            }).join("\n");
                            preparedNotes += `\n\n---\n\n### Links\n${items}`;
                        } else {
                            // Build a valid, safe HTML block with a larger Links heading and clickable links
                            const items = urls.map(u => {
                                const {
                                    kind
                                } = classifyUrl(u);
                                const safe = escapeHtml(u);
                                return `<div><span style=\"opacity:.7;margin-right:6px\">[${escapeHtml(kind)}]</span><a href=\"${safe}\" target=\"_blank\" rel=\"noopener\">${safe}</a></div>`;
                            }).join("\n");
                            preparedNotes += `\n\n---\n<div style=\"text-align:center;font-weight:700;font-size:16px;margin:8px 0\">Links</div>\n${items}`;
                        }
                    }
                }
            }

            // Build alternate_greetings from first_messages array
            // JanitorAI now supports multiple greeting messages:
            // - first_message is always the first greeting
            // - first_messages array contains additional greetings (2nd, 3rd, etc.)
            // Note: The API sometimes includes the first_message in the first_messages array as a duplicate
            let alternateGreetings = [];
            if (chatData?.character?.first_messages && Array.isArray(chatData.character.first_messages)) {
                // Get the canonical first message for comparison
                const firstMessageNormalized = stripWatermark(chatData?.character?.first_message || '').trim();

                // Process each alternate greeting with tokenization and watermark removal
                alternateGreetings = chatData.character.first_messages
                    .map(msg => {
                        if (typeof msg === 'string' && msg.trim()) {
                            const cleaned = stripWatermark(msg);
                            return cleaned.trim();
                        }
                        return null;
                    })
                    .filter(msg => msg !== null && msg !== '')
                    // Filter out any message that's identical to the first_message
                    .filter(msg => msg !== firstMessageNormalized)
                    // Apply tokenization after filtering
                    .map(msg => tokenizeField(msg, charName, userName).trim());
            }

            return {
                spec: "chara_card_v2",
                spec_version: "2.0",
                data: {
                    name: displayName,
                    description: tokenizedDesc.trim(),
                    personality: "",
                    scenario: tokenizedScen.trim(),
                    first_mes: initMsg.trim(),
                    mes_example: tokenizedExs.trim(),
                    creator_notes: preparedNotes,
                    system_prompt: "",
                    post_history_instructions: "",
                    alternate_greetings: alternateGreetings,
                    character_book: null,
                    tags: includeTags ? tagsArray || [] : [],
                    creator: creatorUrl,
                    character_version: versionText,
                    avatar: avatarUrl,
                    extensions: {},
                },
                _nameInfo: {
                    wasNameTruncated,
                    originalLength,
                    hasChatName: !!(chatData?.character?.chat_name && chatData.character.chat_name.trim()),
                    chatNameDifferent: !!(chatData?.character?.chat_name &&
                        chatData.character.chat_name.trim() !==
                        (metaName || chatData?.character?.name || "").trim())
                }
            };
        }

        // Function to show name truncation notification
        function showNameTruncationNotification(nameInfo) {
            if (!nameInfo.wasNameTruncated) return;

            let message = `Character name was shortened from ${nameInfo.originalLength} to 235 characters for compatibility.`;

            if (nameInfo.hasChatName && nameInfo.chatNameDifferent) {
                message += ` You can toggle "Use chat name" in Settings to use the chat name instead.`;
            } else {
                message += ` Some letters were removed to fit the character limit.`;
            }

            // Remove any existing notification
            const existingNotification = document.getElementById('name-truncation-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = makeElement(
                "div", {
                    id: "name-truncation-notification",
                    textContent: message,
                }, {
                    position: "fixed",
                    top: "80px", // Below the copy notification
                    right: "20px",
                    background: "linear-gradient(135deg, #2c3e50dd, #34495edd)", // Darker blue gradient
                    color: "#ffffff", // Bright white text
                    padding: "12px 20px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    zIndex: "99999",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transform: "translateX(100%)",
                    transition: "transform 300ms ease",
                    border: "2px solid #3498db", // Bright blue border
                    maxWidth: "350px",
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                },
            );

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = "translateX(0)";
            }, 10);

            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = "translateX(100%)";
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 7000); // Show for 7 seconds
        }

        /* ============================
           ==       EXPORTERS       ==
           ============================ */
        async function saveAsJson(charName, charBlock, scen, initMsg, exs, userName) {
            const meta = await getCharacterMeta();
            const tokens = await getFilenameTokens(meta);

            const avatarImg = document.querySelector('img[src*="/bot-avatars/"]');
            const avatarUrl = avatarImg ? avatarImg.src : 'none';

            const result = await buildCharaCardV2(
                charName,
                charBlock,
                scen,
                initMsg,
                exs,
                userName,
                tokens.tagsArray
                // avatarUrl,
            );

            const jsonData = result;
            const nameInfo = result._nameInfo;

            // Remove the internal nameInfo before saving
            delete jsonData._nameInfo;

            // Use filename template system
            const currentTemplate =
                localStorage.getItem("filenameTemplate") || "{name}";
            const fileName =
                buildFilenameFromTemplate(currentTemplate, tokens) || "export";

            saveFile(
                `${fileName}.json`,
                new Blob([JSON.stringify(jsonData, null, 2)], {
                    type: "application/json",
                }),
            );

            // Do not create any companion .links.html or .url files during export
            try {
                /* disabled */
            } catch (_) {}

            // Show name truncation notification after a brief delay
            setTimeout(() => {
                showNameTruncationNotification(nameInfo);
            }, 500);
        }

        async function saveAsPng(charName, charBlock, scen, initMsg, exs, userName) {
            try {
                const avatarImg = document.querySelector('img[src*="/bot-avatars/"]');
                if (!avatarImg) {
                    alert("Character avatar not found.");
                    return;
                }

                const meta = await getCharacterMeta();
                const tokens = await getFilenameTokens(meta);

                const result = await buildCharaCardV2(
                    charName,
                    charBlock,
                    scen,
                    initMsg,
                    exs,
                    userName,
                    tokens.tagsArray,
                );

                const cardData = result;
                const nameInfo = result._nameInfo;

                // Remove the internal nameInfo before saving
                delete cardData._nameInfo;

                const avatarResponse = await fetch(avatarImg.src);
                const avatarBlob = await avatarResponse.blob();

                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(async (blob) => {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const pngData = new Uint8Array(arrayBuffer);

                            const jsonString = JSON.stringify(cardData);

                            const base64Data = btoa(unescape(encodeURIComponent(jsonString)));

                            const keyword = "chara";
                            const keywordBytes = new TextEncoder().encode(keyword);
                            const nullByte = new Uint8Array([0]);
                            const textBytes = new TextEncoder().encode(base64Data);

                            const chunkType = new Uint8Array([116, 69, 88, 116]); // "tEXt" in ASCII
                            const dataLength =
                                keywordBytes.length + nullByte.length + textBytes.length;

                            const lengthBytes = new Uint8Array(4);
                            lengthBytes[0] = (dataLength >>> 24) & 0xff;
                            lengthBytes[1] = (dataLength >>> 16) & 0xff;
                            lengthBytes[2] = (dataLength >>> 8) & 0xff;
                            lengthBytes[3] = dataLength & 0xff;

                            const crcData = new Uint8Array(
                                chunkType.length +
                                keywordBytes.length +
                                nullByte.length +
                                textBytes.length,
                            );
                            crcData.set(chunkType, 0);
                            crcData.set(keywordBytes, chunkType.length);
                            crcData.set(nullByte, chunkType.length + keywordBytes.length);
                            crcData.set(
                                textBytes,
                                chunkType.length + keywordBytes.length + nullByte.length,
                            );

                            const crc = computeCrc32(crcData, 0, crcData.length);
                            const crcBytes = new Uint8Array(4);
                            crcBytes[0] = (crc >>> 24) & 0xff;
                            crcBytes[1] = (crc >>> 16) & 0xff;
                            crcBytes[2] = (crc >>> 8) & 0xff;
                            crcBytes[3] = crc & 0xff;

                            let pos = 8; // Skip PNG signature
                            while (pos < pngData.length - 12) {
                                const length =
                                    (pngData[pos] << 24) |
                                    (pngData[pos + 1] << 16) |
                                    (pngData[pos + 2] << 8) |
                                    pngData[pos + 3];

                                const type = String.fromCharCode(
                                    pngData[pos + 4],
                                    pngData[pos + 5],
                                    pngData[pos + 6],
                                    pngData[pos + 7],
                                );

                                if (type === "IEND") break;
                                pos += 12 + length; // 4 (length) + 4 (type) + length + 4 (CRC)
                            }

                            const finalSize =
                                pngData.length +
                                lengthBytes.length +
                                chunkType.length +
                                dataLength +
                                crcBytes.length;
                            const finalPNG = new Uint8Array(finalSize);

                            finalPNG.set(pngData.subarray(0, pos));
                            let writePos = pos;

                            finalPNG.set(lengthBytes, writePos);
                            writePos += lengthBytes.length;
                            finalPNG.set(chunkType, writePos);
                            writePos += chunkType.length;
                            finalPNG.set(keywordBytes, writePos);
                            writePos += keywordBytes.length;
                            finalPNG.set(nullByte, writePos);
                            writePos += nullByte.length;
                            finalPNG.set(textBytes, writePos);
                            writePos += textBytes.length;
                            finalPNG.set(crcBytes, writePos);
                            writePos += crcBytes.length;

                            finalPNG.set(pngData.subarray(pos), writePos);

                            // Use filename template system
                            const currentTemplate =
                                localStorage.getItem("filenameTemplate") || "{name}";
                            const fileName =
                                buildFilenameFromTemplate(currentTemplate, tokens) || "export";

                            saveFile(
                                `${fileName}.png`,
                                new Blob([finalPNG], {
                                    type: "image/png",
                                }),
                            );

                            // Do not create any companion .links.html or .url files during export
                            try {
                                /* disabled */
                            } catch (_) {}

                            debugLog("Character card created successfully!");

                            // Show name truncation notification after a brief delay
                            setTimeout(() => {
                                showNameTruncationNotification(nameInfo);
                            }, 500);
                        } catch (err) {
                            debugError("Error creating PNG:", err);
                            alert("Failed to create PNG: " + err.message);
                        }
                    }, "image/png");
                };

                img.src = URL.createObjectURL(avatarBlob);
            } catch (err) {
                debugError("Error creating PNG:", err);
                alert("Failed to create PNG: " + err.message);
            }
        }

        function computeCrc32(data, start, length) {
            let crc = 0xffffffff;

            for (let i = 0; i < length; i++) {
                const byte = data[start + i];
                crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xff];
            }

            return ~crc >>> 0; // Invert and cast to unsigned 32-bit
        }

        const crc32Table = (() => {
            const table = new Uint32Array(256);

            for (let i = 0; i < 256; i++) {
                let crc = i;
                for (let j = 0; j < 8; j++) {
                    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
                }
                table[i] = crc;
            }

            return table;
        })();

        /* ============================
           ==       ROUTING         ==
           ============================ */
        function inChats() {
            const isInChat = /^\/chats\/\d+/.test(window.location.pathname);
            return isInChat;
        }

        function isMobileViewport() {
            return (window.matchMedia && window.matchMedia('(max-width: 820px)').matches) || (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0);
        }

        let fabInitialized = false;

        function shouldShowFloatingOpener() {
            const always = localStorage.getItem("alwaysShowFab") === null ? true : localStorage.getItem("alwaysShowFab") === "true";
            // Always enabled on mobile; hide FAB when GUI is open
            return inChats() && !viewActive && (always || isMobileViewport());
        }

        function setupFloatingOpener() {
            try {
                if (!shouldShowFloatingOpener()) {
                    removeFloatingOpener();
                    return;
                }
                if (document.getElementById('char-export-fab')) return;
                const btn = document.createElement('button');
                btn.id = 'char-export-fab';
                btn.type = 'button';
                btn.textContent = 'Card';
                btn.setAttribute('aria-label', 'Open character export');
                Object.assign(btn.style, {
                    position: 'fixed',
                    right: '16px',
                    bottom: '16px',
                    zIndex: '9998',
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '9999px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    opacity: '0.6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(2px)'
                });
                btn.addEventListener('mouseenter', () => btn.style.opacity = '0.95');
                btn.addEventListener('mouseleave', () => btn.style.opacity = '0.6');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewActive = !viewActive;
                    toggleUIState();
                });
                document.body.appendChild(btn);
            } catch (_) {}
        }

        function removeFloatingOpener() {
            const btn = document.getElementById('char-export-fab');
            if (btn) btn.remove();
        }
        // Back-compat wrappers
        function setupMobileOpener() {
            setupFloatingOpener();
        }

        function removeMobileOpener() {
            removeFloatingOpener();
        }
        window.updateFloatingOpener = function() {
            setupFloatingOpener();
        };

        function initialize() {
            if (hasInitialized || !inChats()) return;
            hasInitialized = true;
            shouldInterceptNext = false;
            networkInterceptActive = false;
            exportFormat = null;
            chatData = null;

            document.removeEventListener("keydown", handleKeyDown);
            document.addEventListener("keydown", handleKeyDown);

            interceptNetwork();
            setupFloatingOpener();
            if (typeof window.updateFloatingOpener !== "function") {
                window.updateFloatingOpener = () => setupFloatingOpener();
            }
            window.addEventListener("resize", window.updateFloatingOpener);
        }

        function handleKeyDown(e) {
            debugLog('[Debug] handleKeyDown called', e.key);
            if (!inChats()) {
                debugLog('[Debug] Not in chats, returning');
                return;
            }
            if (
                e.key.toLowerCase() !== triggerKey.toLowerCase() ||
                e.ctrlKey ||
                e.metaKey ||
                e.altKey ||
                e.shiftKey
            ) {
                debugLog('[Debug] Key combination not matched');
                return;
            }
            if (
                ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) ||
                document.activeElement.isContentEditable ||
                document.activeElement.hasAttribute('data-keybind-input')
            ) {
                debugLog('[Debug] Active element is input/textarea, returning');
                return;
            }

            // Open/close the UI regardless of whether chatData is available.
            // Export flows will validate proxy/chatData when needed.
            viewActive = !viewActive;
            debugLog('[Debug] viewActive toggled to:', viewActive);
            toggleUIState();
        }

        function cleanup() {
            hasInitialized = false;
            const gui = document.getElementById("char-export-gui");
            if (gui) gui.remove();

            const backdrop = document.getElementById("char-export-backdrop");
            if (backdrop) backdrop.remove();

            removeFloatingOpener();
            if (typeof window.updateFloatingOpener === "function") {
                window.removeEventListener("resize", window.updateFloatingOpener);
            }

            document.removeEventListener("keydown", handleKeyDown);
            viewActive = false;
            animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            animationTimeouts = [];
            if (typeof window.collapseAllSections === 'function') {
                window.collapseAllSections();
            }
        }

        function handleRoute() {
            if (inChats()) {
                initialize();
            } else {
                cleanup();
            }
        }

        /* ============================
           ==    EVENT LISTENERS    ==
           ============================ */

        // Initialize unified auto-restore system
        function initializeAutoRestore() {
            // Debounced restoration for window events to prevent conflicts
            const debouncedRestore = () => {
                if (!restorationInProgress) {
                    inputStateManager.restoreAll(false);
                }
            };

            // Multiple event listeners for comprehensive coverage
            ["beforeunload", "pagehide"].forEach((event) => {
                window.addEventListener(event, debouncedRestore);
            });

            // Separate handler for visibility changes
            window.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "hidden") {
                    debouncedRestore();
                }
            });
        }

        // Initialize the auto-restore system
        initializeAutoRestore();

        document.addEventListener("DOMContentLoaded", () => {
            const style = document.createElement("style");
            style.textContent = `
        /* Disable all browser tooltips inside the UI */
        #char-export-gui input,
        #char-export-gui input:hover,
        #char-export-gui input:focus,
        #char-export-gui textarea,
        #char-export-gui textarea:hover,
        #char-export-gui textarea:focus {
          title: "" !important;
        }

        #char-export-gui input[title],
        #char-export-gui textarea[title] {
          title: "" !important;
        }

        /* Enhanced toggle animations (stutter-free) */
        .toggle-wrapper {
          position: relative !important;
          border-radius: 8px !important;
          transition: transform 150ms ease !important; /* animate only transform */
          will-change: transform;
        }

        /* Lift only; no shadow here */
        .toggle-wrapper:hover {
          transform: translateY(-1px) scale(1.005) !important;
        }

        /* Glow lives on a pre-trimmed pseudo-element */
        .toggle-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          pointer-events: none;
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          clip-path: inset(0 56px 0 0 round 8px); /* trim right side */
          opacity: 0;
          transition: opacity 150ms ease;
          will-change: opacity;
        }

        .toggle-wrapper:hover::before,
        .toggle-wrapper.active:hover::before {
          opacity: 1;
        }

        .toggle-wrapper.active {
          border-color: rgba(0, 128, 255, 0.4) !important;
        }
        .toggle-wrapper.active::before {
          opacity: 1;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
        }
p subtle glow while enabled */
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
        }
      `;
            document.head.appendChild(style);
        });

        /* ============================
           ==      ENTRYPOINT       ==
           ============================ */
        window.addEventListener(
            "load",
            () => {
                handleRoute();
            }, {
                once: true,
            },
        );
        window.addEventListener("popstate", () => {
            handleRoute();
        });

        ["pushState", "replaceState"].forEach((fn) => {
            const orig = history[fn];
            history[fn] = function(...args) {
                const res = orig.apply(this, args);
                setTimeout(handleRoute, 50);
                return res;
            };
        });
        handleRoute();
    }
    try {
        if (typeof unsafeWindow === 'undefined' || unsafeWindow === window) {
            runInPageContext();
        } else {
            const s = document.createElement('script');
            s.textContent = '(' + runInPageContext.toString() + ')();';
            document.documentElement.appendChild(s);
            s.remove();
        }
    } catch (e) {
        const s = document.createElement('script');
        s.textContent = '(' + runInPageContext.toString() + ')();';
        document.documentElement.appendChild(s);
        s.remove();
    }
})();