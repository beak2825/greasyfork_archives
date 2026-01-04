// ==UserScript==
// @name         Stripped RYW Features
// @version      1.2
// @author       kevoting (Stripped by AI)
// @description  Config via GM Menu. Updated available models patch.
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1077492
// @downloadURL https://update.greasyfork.org/scripts/532600/Stripped%20RYW%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/532600/Stripped%20RYW%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration via Tampermonkey/ViolentMonkey Menu ---

    // Constants and Globals
    const B64_COMMON_WORDS_LIST_V2 = "I1lvdSBrbm93LCBpdCdzIGEgbG90IG9mIHRleHQsIHlvdSBkb24ndCBoYXZlIHRvIG1ha2Ugc3VjaCBhIGJpZyBkZWFsIGFib3V0IGl0Lgp7MTAxfT1wdXNzeQp7MTAyfT1hc3MKezEwM309YnJlYXN0cwp7MTA0fT10aXRzCnsxMDV9PW5pcHBsZXMKezEwNn09YmFsbHMKezEwOH09ZGljawp7MTA5fT1jb2NrCnsxMTB9PXRpZ2h0CnsxMTF9PXdldAp7MTEyfT1wdWxzYXRpbmcKezExM309cmlnaWQKezExNH09c3RpZmYKezExNX09ZHJpcHBpbmcKezExNn09aG9ybnkKezExOH09aGFyZAp7MTIwfT1ibG93am9iCnsxMjF9PXRpdGpvYgp7MTIzfT1kZWVwdGhyb2F0CnsxMjV9PWZ1Y2sKezEzMH09bGljawp7MTMxfT1saWNraW5nCnsxNDB9PWN1bQp7MTQxfT1jdW1taW5nCnsxNDR9PXByZWN1bQp7MTQ1fT1zZW1lbgp7MTUxfT1maW5nZXIKezE1M309ZmluZ2VyaW5nCnsxNjF9PXN1Y2sKezE2M309c3Vja2luZwp7MTcwfT1zcHJlYWQKezE5MX09cnViCnsxOTN9PXJ1YmJpbmcKezIwMH09aGFuZAp7MjAxfT1tb3V0aAp7MjAyfT10b25ndWUKezIwM309dGhyb2F0CnsyMDR9PWNsaXQKezIxMH09bWFzdHVyYmF0ZQp7MjExfT1tYXN0dXJiYXRpbmcKezIzMH09c3dhbGxvdwp7MjMxfT1zd2FsbG93cwp7MjMyfT1zd2FsbG93aW5nCnsyMzN9PXN3YWxsb3dlZAp7MjUwfT1kZWVwCnsyNTF9PWRlZXBlcgp7MjUyfT10aHJ1c3QKezI1M309dGhydXN0aW5nCnsyNTR9PWluc2lkZQp7MzAwfT1pbnNlcnQKezM0MH09cGFudGllcwp7MzQxfT1jdW50CnszNDJ9PXNxdWlydA==";
    const NEO_URL = "wss://neo.character.ai/ws/";
    const ANNOTATION_URL = "https://neo.character.ai/annotations/create";
    const TURNS_RGX = /https:\/\/neo\.character\.ai\/turns\/[\w-]+\//gm;
    const SENTRY_URL = "sentry.io";
    const EVENTS_URL = "events.character.ai";
    const CLOUD_MONITORING_NAME = "datadoghq";

    const ENABLE_TURN_CHANGER = true;
    const NO_ERROR_REPORTING = true;
    const NO_TRACKING = true;
    const NO_MONITORING = true;

    const fetchFn = window.fetch;
    const websocketFn = window.WebSocket;
    const sendSocketfn = window.WebSocket.prototype.send;
    const open_prototype = XMLHttpRequest.prototype.open;

    let neo_socket = null;
    let neo_payload_origin = null;
    let injected_last = null;
    let turns_since_last_inject = 0;
    let pending_payload = null;
    let waiting_request_id = null;
    let currentConfuserLevel;

    const kvp = new Map();
    const references = new Map();
    const references_compare = new Map();
    const rgx_str_v2 = /\{(\d+)}/;

    // --- Menu Command Functions ---

    function setConfuserLevel(level) {
        level = parseFloat(level);
        if (isNaN(level) || level < 0 || level > 2) {
            console.error("[RYW Stripped] Invalid confuser level:", level);
            return;
        }
        currentConfuserLevel = level;
        GM_setValue("ryw_confuserLevel", level);
        console.log(`[RYW Stripped] Confuser level set to: ${level}. Reload page to see menu indicator update.`);
    }

    function setLevel0() { setConfuserLevel(0); }
    function setLevel018() { setConfuserLevel(0.18); }
    function setLevel025() { setConfuserLevel(0.25); }
    function setLevel05() { setConfuserLevel(0.5); }
    function setLevel1() { setConfuserLevel(1); }
    function setLevel2() { setConfuserLevel(2); }

    function registerCommands() {
        GM_registerMenuCommand(`${currentConfuserLevel === 0 ? '[*]' : '[ ]'} Set Confuser: Off`, setLevel0);
        GM_registerMenuCommand(`${currentConfuserLevel === 0.18 ? '[*]' : '[ ]'} Set Confuser: Super Low (Narrow No-Break Space)`, setLevel018);
        GM_registerMenuCommand(`${currentConfuserLevel === 0.25 ? '[*]' : '[ ]'} Set Confuser: Ultra Low (Thin Space)`, setLevel025);
        GM_registerMenuCommand(`${currentConfuserLevel === 0.5 ? '[*]' : '[ ]'} Set Confuser: Very Low (Word-End ZW)`, setLevel05);
        GM_registerMenuCommand(`${currentConfuserLevel === 1 ? '[*]' : '[ ]'} Set Confuser: Low (Zero-Width)`, setLevel1);
        GM_registerMenuCommand(`${currentConfuserLevel === 2 ? '[*]' : '[ ]'} Set Confuser: Medium (Word Replace)`, setLevel2);
    }

    // --- Utility Functions ---

    function decodeBase64(base64) {
        try {
            const text = atob(base64);
            const length = text.length;
            const bytes = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                bytes[i] = text.charCodeAt(i);
            }
            const decoder = new TextDecoder();
            return decoder.decode(bytes);
        } catch (e) { console.error("Failed to decode base64 string:", e); return ""; }
    }

    function loadWords() {
        kvp.clear();
        const str = decodeBase64(B64_COMMON_WORDS_LIST_V2);
        const regex_v2 = /(\{\d+\})=(.+)/gm;
        let m;
        while ((m = regex_v2.exec(str)) !== null) {
            if (m.index === regex_v2.lastIndex) { regex_v2.lastIndex++; }
            if (m[1] && m[2]) { kvp.set(m[2].trim(), m[1]); }
        }
        console.log(`[RYW Stripped] Loaded ${kvp.size} words for obfuscation.`);
    }

    function uuidV4() {
        const uuid = new Array(36);
        for (let i = 0; i < 36; i++) { uuid[i] = Math.floor(Math.random() * 16); }
        uuid[14] = 4; uuid[19] = (uuid[19] & 0x3) | 0x8;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        return uuid.map((x) => x.toString(16)).join('');
    }

    function getThinSpaceText(text) {
        return text.split(" ").join("\u2009");
    }

    function getNarrowNoBreakSpaceText(text) {
        return text.split(" ").join("\u202F"); // U+202F: Narrow No-Break Space
    }

    function getWordEndZeroWidthText(text) {
        const zSpace = "\u200b";
        return text.split(" ").map(word => word + zSpace).join(" ").trim();
    }

    function getZeroWidthText(text) {
        const zSpace = "\u200b";
        return text.split(" ").map(word => {
            if (!word) return "";
            return word.split('').join(zSpace);
        }).join(" ");
    }

    function normalizeNarrowNoBreakSpaces(text) {
        return text.replaceAll("\u202F", " ");
    }

    function hasRefValid(word) { return references.has(word); }

    function areMapsEqual(map1, map2) {
        if (map1.size !== map2.size) return false;
        for (let [key, value] of map1) {
            if (!map2.has(key) || map2.get(key) !== value) return false;
        }
        return true;
    }

    function parseAndFindCoincidences(txt, inverse = false) {
        if (typeof txt !== 'string') return { newtext: '', coincidences: new Map() };
        txt = txt.replaceAll("\u200b", "").replaceAll("\u2009", " ");
        const words = txt.split(/(\s+)/);
        const newParts = [];
        const coincidences = new Map();
        const wordEnders = ".,!?;:)]\"'*~=";
        words.forEach(part => {
            if (part.match(/^\s+$/)) { newParts.push(part); return; }
            if (!part) { return; }
            let currentWord = part;
            if (inverse) {
                const match = currentWord.match(/^(\{\d+\})(.*)$/);
                if (match) {
                    const code = match[1]; const suffix = match[2] || ""; let foundWord = null;
                    for (let [wordKey, codeValue] of kvp) { if (codeValue === code) { foundWord = wordKey; break; } }
                    if (foundWord) { currentWord = foundWord + suffix; }
                }
            } else {
                kvp.forEach((codeValue, wordKey) => {
                    if (currentWord === wordKey || (currentWord.startsWith(wordKey) && (currentWord.length === wordKey.length || wordEnders.includes(currentWord[wordKey.length])))) {
                        const suffix = currentWord.substring(wordKey.length); currentWord = codeValue + suffix;
                        coincidences.set(wordKey, codeValue);
                    }
                });
            }
            newParts.push(currentWord);
        });
        return { newtext: newParts.join(""), coincidences: coincidences };
    }

    // --- Core Logic ---

    function tryPreProcess(json) {
        if (currentConfuserLevel < 2) return false;
        turns_since_last_inject++;
        if (turns_since_last_inject >= 10) { references.clear(); }
        const original_payload = JSON.parse(JSON.stringify(json));
        let raw_text = json.payload.turn.candidates[0].raw_content;
        if (!raw_text) return false;
        const obj = parseAndFindCoincidences(raw_text, false);
        if (obj.coincidences.size > 0) {
            console.log("[RYW Stripped] Found words to obfuscate (Level 2):", Array.from(obj.coincidences.keys()));
            json.payload.turn.candidates[0].raw_content = obj.newtext;
            pending_payload = json;
            obj.coincidences.forEach((value, key) => { if (!hasRefValid(key)) { references.set(key, value); } });
            let helper_text = "<!-- RYW Helper -->\n";
            references.forEach((value, key) => { helper_text += `${value}=${key}\n`; });
            helper_text += "<!-- End RYW Helper -->";
            if (injected_last == null || turns_since_last_inject >= 10 || !areMapsEqual(references, references_compare)) {
                console.log("[RYW Stripped] Injecting/Updating helper message (Level 2).");
                references_compare.clear(); references.forEach((v, k) => references_compare.set(k, v));
                if (injected_last?.turn_key && injected_last?.candidates?.[0]?.candidate_id) {
                    try {
                        const editPayload = { command: "edit_turn_candidate", request_id: uuidV4(), payload: { new_candidate_raw_content: helper_text, turn_key: injected_last.turn_key, candidate_id: injected_last.candidates[0].candidate_id }, origin_id: neo_payload_origin };
                        sendSocketfn.call(neo_socket, JSON.stringify(editPayload)); return true;
                    } catch (editError) { console.error("[RYW Stripped] Failed to edit helper message, will create new:", editError); injected_last = null; }
                }
                const helper_payload = JSON.parse(JSON.stringify(original_payload));
                helper_payload.request_id = uuidV4(); helper_payload.command = "create_turn";
                helper_payload.payload.turn.turn_key = { turn_id: uuidV4(), chat_id: json.payload.turn.turn_key.chat_id };
                const newCandidateId = uuidV4();
                helper_payload.payload.turn.candidates = [{ candidate_id: newCandidateId, raw_content: helper_text, vendor_score: 0, create_time: new Date().toISOString(), }];
                helper_payload.payload.turn.primary_candidate_id = newCandidateId;
                helper_payload.payload.turn.author = { author_id: "user", is_human: true, name: "You" };
                waiting_request_id = helper_payload.request_id;
                sendSocketfn.call(neo_socket, JSON.stringify(helper_payload)); return true;
            } else {
                console.log("[RYW Stripped] Helper message up-to-date, sending user message directly (Level 2).");
                sendSocketfn.call(neo_socket, JSON.stringify(pending_payload)); pending_payload = null; return true;
            }
        }
        return false;
    }

    // --- Network Interception ---

    function patchedSend(...args) {
        if (!this.url || !this.url.startsWith(NEO_URL)) { return sendSocketfn.call(this, ...args); }
        if (neo_socket !== this) { if (neo_socket) { neo_socket.removeEventListener("message", neoSocketMessage); } neo_socket = this; neo_socket.addEventListener("message", neoSocketMessage); }
        try {
            const json = JSON.parse(args[0]);
            if (json.origin_id && !neo_payload_origin) { neo_payload_origin = json.origin_id; }
            if (json.command === "create_and_generate_turn") {
                if (currentConfuserLevel === 0.18 && json?.payload?.turn?.candidates?.[0]?.raw_content) {
                    console.log("[RYW Stripped] Applying Level 0.18 Obfuscation (Narrow No-Break Space)");
                    json.payload.turn.candidates[0].raw_content = getNarrowNoBreakSpaceText(json.payload.turn.candidates[0].raw_content);
                    args[0] = JSON.stringify(json);
                } else if (currentConfuserLevel === 0.25 && json?.payload?.turn?.candidates?.[0]?.raw_content) {
                    console.log("[RYW Stripped] Applying Level 0.25 Obfuscation (Thin Space)");
                    json.payload.turn.candidates[0].raw_content = getThinSpaceText(json.payload.turn.candidates[0].raw_content);
                    args[0] = JSON.stringify(json);
                } else if (currentConfuserLevel === 0.5 && json?.payload?.turn?.candidates?.[0]?.raw_content) {
                    console.log("[RYW Stripped] Applying Level 0.5 Obfuscation (Word-End Zero-Width)");
                    json.payload.turn.candidates[0].raw_content = getWordEndZeroWidthText(json.payload.turn.candidates[0].raw_content);
                    args[0] = JSON.stringify(json);
                } else if (currentConfuserLevel === 1 && json?.payload?.turn?.candidates?.[0]?.raw_content) {
                    console.log("[RYW Stripped] Applying Level 1 Obfuscation (Zero-Width)");
                    json.payload.turn.candidates[0].raw_content = getZeroWidthText(json.payload.turn.candidates[0].raw_content);
                    args[0] = JSON.stringify(json);
                } else if (currentConfuserLevel === 2 && json?.payload?.turn?.candidates?.[0]?.raw_content) {
                    if (tryPreProcess(json)) { return; }
                    if (pending_payload) { console.warn("[RYW Stripped] Pending payload exists but tryPreProcess returned false. Sending pending."); args[0] = JSON.stringify(pending_payload); pending_payload = null; }
                }
                return sendSocketfn.call(this, args[0]);
            }
        } catch (e) { /* console.error("[RYW Stripped] Error processing WebSocket send:", e, args[0]); */ }
        return sendSocketfn.call(this, ...args);
    }

    function neoSocketMessage(event) {
        try {
            const json = JSON.parse(event.data);
            if (waiting_request_id && json.request_id === waiting_request_id && json.command === "add_turn") {
                console.log("[RYW Stripped] Helper message turn added (Level 2).");
                injected_last = json.turn; turns_since_last_inject = 0; waiting_request_id = null;
                if (pending_payload) { console.log("[RYW Stripped] Sending pending user message (Level 2)."); sendSocketfn.call(neo_socket, JSON.stringify(pending_payload)); pending_payload = null; }
            } else if (waiting_request_id && json.request_id === waiting_request_id && json.command === "neo_error") {
                console.error("[RYW Stripped] Error creating helper message (Level 2):", json.comment);
                waiting_request_id = null; injected_last = null;
                if (pending_payload) { console.warn("[RYW Stripped] Sending pending user message after helper creation failed (Level 2)."); sendSocketfn.call(neo_socket, JSON.stringify(pending_payload)); pending_payload = null; }
            }
        } catch (e) { /* console.error("[RYW Stripped] Error processing WebSocket message:", e, event.data); */ }
    }

    function PatchedWebSocket(url, protocols) {
        const ws = new websocketFn(url, protocols);
        if (url === NEO_URL) { if (neo_socket !== ws) { if (neo_socket) { neo_socket.removeEventListener("message", neoSocketMessage); } neo_socket = ws; neo_socket.addEventListener("message", neoSocketMessage); } }
        return ws;
    }
    PatchedWebSocket.prototype = websocketFn.prototype; PatchedWebSocket.prototype.constructor = PatchedWebSocket;

    function patchedOpen(...args) {
        const url = args[1];
        if (url && (url.includes(ANNOTATION_URL) || url.includes("neo.character.ai/annotations"))) { this.send = function() {}; return; }

        // --- UPDATED MODEL PATCH LOGIC (for XMLHttpRequest) ---
        if (url && url.includes("https://neo.character.ai/get-available-models")) {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const originalJson = JSON.parse(this.responseText);
                        const known_models = ["MODEL_TYPE_FAST", "MODEL_TYPE_SMART", "MODEL_TYPE_BALANCED", "MODEL_TYPE_ROMANTIC", "MODEL_TYPE_FAMILY_FRIENDLY", "MODEL_TYPE_MEMORY_OPTIMIZED", "MODEL_TYPE_MULTILINGUAL", "MODEL_TYPE_THINKING", "MODEL_TYPE_FRENCH", "MODEL_TYPE_CHINESE"];

                        const combined_models = [...new Set([...originalJson.available_models, ...known_models])];
                        originalJson.available_models = combined_models;

                        const modifiedResponse = JSON.stringify(originalJson);

                        Object.defineProperty(this, 'responseText', { value: modifiedResponse, writable: true });
                        Object.defineProperty(this, 'response', { value: modifiedResponse, writable: true });
                    } catch (e) {
                        console.error("[RYW Stripped] Error modifying available models XHR response:", e);
                    }
                }
            });
        }

        if (ENABLE_TURN_CHANGER && url && url.match(TURNS_RGX)) {
            this.addEventListener('load', function() { if (this.readyState === 4 && this.status === 200 && this.responseText) { try { let json = JSON.parse(this.responseText); let changed = false; if (json?.turns?.length > 0) { json.turns.forEach(turn => { turn?.candidates?.forEach(candidate => { if (candidate?.raw_content) { const original = candidate.raw_content; candidate.raw_content = parseAndFindCoincidences(original, true).newtext; candidate.raw_content = normalizeNarrowNoBreakSpaces(candidate.raw_content); if (original !== candidate.raw_content) changed = true; } }); }); } if (changed) { const modifiedResponse = JSON.stringify(json); Object.defineProperty(this, 'responseText', { value: modifiedResponse, writable: false }); Object.defineProperty(this, 'response', { value: modifiedResponse, writable: false }); } } catch (e) { /* Error */ } } });
        }
        return open_prototype.apply(this, args);
    }

    async function patchedFetch(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if ((url.includes(SENTRY_URL) && NO_ERROR_REPORTING) || (url.includes(EVENTS_URL) && NO_TRACKING) || (url.includes(CLOUD_MONITORING_NAME) && NO_MONITORING) || url.includes(ANNOTATION_URL) || url.includes("neo.character.ai/annotations")) { return Promise.reject(new Error("Blocked by RYW Stripped")); }

        // --- UPDATED MODEL PATCH LOGIC (for Fetch) ---
        if (url && url.includes("https://neo.character.ai/get-available-models")) {
            return fetchFn(...args).then(async response => {
                if (!response.ok) return response; // Pass through non-2xx responses
                try {
                    const originalJson = await response.clone().json();
                    const known_models = ["MODEL_TYPE_FAST", "MODEL_TYPE_SMART", "MODEL_TYPE_BALANCED", "MODEL_TYPE_ROMANTIC", "MODEL_TYPE_FAMILY_FRIENDLY", "MODEL_TYPE_MEMORY_OPTIMIZED", "MODEL_TYPE_MULTILINGUAL", "MODEL_TYPE_THINKING", "MODEL_TYPE_FRENCH", "MODEL_TYPE_CHINESE"];

                    const combined_models = [...new Set([...originalJson.available_models, ...known_models])];
                    originalJson.available_models = combined_models;

                    const modifiedBody = JSON.stringify(originalJson);
                    return new Response(modifiedBody, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                } catch (e) {
                    console.error("[RYW Stripped] Error modifying available models fetch response:", e);
                    return response; // Return original response on error
                }
            });
        }

        if (ENABLE_TURN_CHANGER && url && url.match(TURNS_RGX)) {
            return fetchFn(...args).then(async response => { if (!response.ok || !response.body) return response; try { const clonedResponse = response.clone(); let json = await clonedResponse.json(); let changed = false; if (json?.turns?.length > 0) { json.turns.forEach(turn => { turn?.candidates?.forEach(candidate => { if (candidate?.raw_content) { const original = candidate.raw_content; candidate.raw_content = parseAndFindCoincidences(original, true).newtext; candidate.raw_content = normalizeNarrowNoBreakSpaces(candidate.raw_content); if (original !== candidate.raw_content) changed = true; } }); }); } if (changed) { const modifiedBody = JSON.stringify(json); return new Response(modifiedBody, { status: response.status, statusText: response.statusText, headers: response.headers }); } } catch (e) { /* Error */ } return response; });
        }
        return fetchFn(...args);
    }

    // --- Initialization ---

    function applyNetworkPatches() {
        if (!window._rywNetworkPatched) {
            console.log("[RYW Stripped] Applying network patches.");
            window.WebSocket = PatchedWebSocket;
            window.WebSocket.prototype.send = patchedSend;
            XMLHttpRequest.prototype.open = patchedOpen; // Enabled patch
            window.fetch = patchedFetch;               // Enabled patch
            window._rywNetworkPatched = true;
            loadWords();
        }
    }

    function initialize() {
        currentConfuserLevel = GM_getValue("ryw_confuserLevel", 0);
        console.log(`[RYW Stripped] Initializing Menu. Loaded Level: ${currentConfuserLevel}`);
        registerCommands();
        applyNetworkPatches();
        console.log(`[RYW Stripped] Initialized.`);
    }

    initialize();
    window.addEventListener("DOMContentLoaded", applyNetworkPatches, { once: true });

})();