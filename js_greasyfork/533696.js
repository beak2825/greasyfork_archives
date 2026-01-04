// ==UserScript==
// @name         JanitorAI SillyTavern Importer & Exporter
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Import/Export SillyTavern V2/Custom JSON & PNG characters on JanitorAI (create, edit, view pages). Handles WEBP/non-PNG images gracefully for edit page export.
// @author       Minoa (https://bio.minoa.cat)
// @match        https://janitorai.com/create_character
// @match        https://janitorai.com/edit_character/*
/* @match        https://janitorai.com/characters/* disabled rn as its not working*/
// @require      https://cdn.jsdelivr.net/npm/crc-32@1.2.2/crc32.min.js
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      api.jannyai.com
// @connect      *.janitorai.com
// @connect      *
// @license      MIT; https://opensource.org/licenses/MIT
// @contributionURL https://bio.minoa.cat
// @downloadURL https://update.greasyfork.org/scripts/533696/JanitorAI%20SillyTavern%20Importer%20%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/533696/JanitorAI%20SillyTavern%20Importer%20%20Exporter.meta.js
// ==/UserScript==
/*
 * Image Handling code structure inspired by Character Editor by Avakson:
 * https://avakson.github.io/character-editor/
 *
 * Script Author: Minoa
 * Website: https://bio.minoa.cat
 */

(function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_VERSION = "2.5"; // Updated
    const TAVERN_V2_SPEC = { spec: "chara_card_v2", spec_version: "2.0" };
    const CUSTOM_TOOL_META = {
        name: "JanitorAI Import & Exporter Tampermonkey Script By Minoa",
        version: SCRIPT_VERSION,
        url: "https://bio.minoa.cat"
    };

    // --- CRC32 Logic ---
    // Included via @require

    // --- PNG Parsing Logic (PngHelper object remains the same) ---
    const PngHelper = {
        _uint8: new Uint8Array(4), _int32: null, _uint32: null,
        PNG_SIGNATURE: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
        initialize() { if (!this._int32) { this._int32 = new Int32Array(this._uint8.buffer); this._uint32 = new Uint32Array(this._uint8.buffer); } },
        isPng(arrayBuffer) { if (!arrayBuffer || arrayBuffer.byteLength < 8) return false; const h = new Uint8Array(arrayBuffer.slice(0, 8)); return this.PNG_SIGNATURE.every((b, i) => h[i] === b); },
        uint32ToBytes(num) { this.initialize(); this._uint32[0] = num; return new Uint8Array([this._uint8[3], this._uint8[2], this._uint8[1], this._uint8[0]]); },
        bytesToUint32(bytes, offset = 0) { this.initialize(); this._uint8[3] = bytes[offset]; this._uint8[2] = bytes[offset + 1]; this._uint8[1] = bytes[offset + 2]; this._uint8[0] = bytes[offset + 3]; return this._uint32[0]; },
        decodeText(data) { let n = true, k = '', t = ''; for (let i = 0; i < data.length; i++) { const c = data[i]; if (n) { if (c) k += String.fromCharCode(c); else n = false; } else { if (c) t += String.fromCharCode(c); else console.warn('Null char in PNG tEXt data.'); } } return { keyword: k, text: t }; },
        readChunk(data, idx) { this.initialize(); const l = this.bytesToUint32(data, idx); idx += 4; const typeBytes = data.slice(idx, idx + 4); const type = String.fromCharCode(...typeBytes); idx += 4; const chunkData = data.slice(idx, idx + l); idx += l; const crc = this.bytesToUint32(data, idx); idx += 4; const typeAndData = new Uint8Array(4 + chunkData.length); typeAndData.set(typeBytes, 0); typeAndData.set(chunkData, 4); const calcCrc = CRC32.buf(typeAndData); if (this.bytesToUint32(this.uint32ToBytes(crc)) !== this.bytesToUint32(this.uint32ToBytes(calcCrc))) { console.warn(`CRC mismatch: "${type}". Expected ${crc}, got ${calcCrc}.`); } return { type: type, data: chunkData, length: l, crc: crc, nextIndex: idx }; },
        readChunks(data) { if (!this.isPng(data)) throw new Error('Invalid PNG header'); const chunks = []; let idx = 8; while (idx < data.byteLength) { try { const r = this.readChunk(data, idx); chunks.push({ type: r.type, data: r.data, length: r.length, crc: r.crc }); idx = r.nextIndex; if (r.type === 'IEND') break; } catch (e) { throw new Error(`Read chunk failed: ${e.message}`); } } if (chunks.length === 0 || chunks[0].type !== 'IHDR') throw new Error('Missing IHDR/chunks.'); if (!chunks.find(c => c.type === 'IEND')) console.warn('Missing IEND.'); return chunks; },
        extractCharaData(arrayBuffer) { const data = new Uint8Array(arrayBuffer); const chunks = this.readChunks(data); const textChunks = chunks.filter(c => c.type === 'tEXt').map(c => this.decodeText(c.data)); if (textChunks.length < 1) throw new Error('No tEXt chunks.'); const charaChunk = textChunks.find(t => t.keyword === 'chara'); if (!charaChunk) throw new Error('No "chara" tEXt chunk.'); try { const b64 = atob(charaChunk.text); const u8 = new Uint8Array(b64.length); for (let i = 0; i < b64.length; i++) u8[i] = b64.charCodeAt(i); const jsonStr = new TextDecoder().decode(u8); const jsonData = JSON.parse(jsonStr); return (jsonData.spec === "chara_card_v2" && jsonData.data) ? jsonData.data : jsonData; } catch (e) { throw new Error(`Decode/parse "chara" failed: ${e.message}`); } },
        createTEXtChunk(keyword, text) { this.initialize(); const keywordBytes = new TextEncoder().encode(keyword); const textBytes = new TextEncoder().encode(text); const chunkData = new Uint8Array(keywordBytes.length + 1 + textBytes.length); chunkData.set(keywordBytes, 0); chunkData[keywordBytes.length] = 0; chunkData.set(textBytes, keywordBytes.length + 1); const chunkType = new TextEncoder().encode('tEXt'); const lengthBytes = this.uint32ToBytes(chunkData.length); const typeAndData = new Uint8Array(4 + chunkData.length); typeAndData.set(chunkType, 0); typeAndData.set(chunkData, 4); const crc = CRC32.buf(typeAndData); const crcBytes = this.uint32ToBytes(crc); const chunk = new Uint8Array(4 + 4 + chunkData.length + 4); chunk.set(lengthBytes, 0); chunk.set(chunkType, 4); chunk.set(chunkData, 8); chunk.set(crcBytes, 8 + chunkData.length); return chunk; },
        embedCharaData(imageArrayBuffer, charaJsonData) { const imageData = new Uint8Array(imageArrayBuffer); const originalChunks = this.readChunks(imageData); const tavernV2Data = { ...TAVERN_V2_SPEC, data: charaJsonData }; const jsonString = JSON.stringify(tavernV2Data); const base64String = btoa(unescape(encodeURIComponent(jsonString))); const charaChunkBytes = this.createTEXtChunk('chara', base64String); const newPngParts = [this.PNG_SIGNATURE]; let inserted = false; for (let i = 0; i < originalChunks.length; i++) { const chunk = originalChunks[i]; if (chunk.type === 'IEND' && !inserted) { newPngParts.push(charaChunkBytes); inserted = true; console.log("Inserted 'chara' tEXt before IEND."); } const chunkTypeBytes = new TextEncoder().encode(chunk.type); const lengthBytes = this.uint32ToBytes(chunk.length); const crcBytes = this.uint32ToBytes(chunk.crc); const fullChunk = new Uint8Array(4 + 4 + chunk.data.length + 4); fullChunk.set(lengthBytes, 0); fullChunk.set(chunkTypeBytes, 4); fullChunk.set(chunk.data, 8); fullChunk.set(crcBytes, 8 + chunk.data.length); newPngParts.push(fullChunk); } if (!inserted) { console.warn("IEND not found. Appending 'chara' and new IEND."); newPngParts.push(charaChunkBytes); const iendChunk = new Uint8Array([0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]); newPngParts.push(iendChunk); } return new Blob(newPngParts, { type: 'image/png' }); }
    };

    // --- Helper Functions ---
    // *** ENSURE THESE ARE CORRECTLY DEFINED AND ACCESSIBLE ***
    function setInputValue(selector, value, isTextArea = false) {
        const element = document.querySelector(selector);
        if (element && value !== undefined && value !== null) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            if (isTextArea) {
                element.dispatchEvent(new Event('textarea', { bubbles: true }));
                element.style.height = 'auto'; element.style.height = (element.scrollHeight) + 'px';
            }
            console.log(`Set ${selector} to: ${String(value).substring(0, 50)}...`);
        } else if (!element) console.warn(`Element not found: ${selector}`);
        else { element.value = ''; element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true })); }
    }

    function getInputValue(selector) {
        const element = document.querySelector(selector);
        // Add a check to see if the element exists before trying to get value
        if (!element) {
            console.warn(`Element not found for getInputValue: ${selector}`);
            return undefined; // Return undefined if not found
        }
        return element.value;
    }

    function setRichTextValue(selector, value) {
        const element = document.querySelector(selector);
         if (element && value !== undefined && value !== null) {
            while (element.firstChild) element.removeChild(element.firstChild);
            const p = document.createElement('p'); p.textContent = value; element.appendChild(p);
            element.dispatchEvent(new Event('input', { bubbles: true, composed: true })); element.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log(`Set Rich Text ${selector} to: ${String(value).substring(0, 50)}...`);
        } else if (!element) console.warn(`Rich text element not found: ${selector}`);
        else { while (element.firstChild) element.removeChild(element.firstChild); element.dispatchEvent(new Event('input', { bubbles: true, composed: true })); element.dispatchEvent(new Event('blur', { bubbles: true })); }
    }

    function getRichTextValue(selector) {
        const element = document.querySelector(selector);
        // Add a check to see if the element exists
        if (!element) {
            console.warn(`Rich text element not found for getRichTextValue: ${selector}`);
            return undefined; // Return undefined if not found
        }
        return element.textContent;
    }

    function getTagsFromReactSelect(containerSelector) {
        const tags = [];
        // Use the container selector passed to it, not a hardcoded one
        const controlElement = document.querySelector(containerSelector + ' .react-select__control');
        if (controlElement) {
            controlElement.querySelectorAll(`.react-select__multi-value__label`).forEach(el => tags.push(el.textContent.trim().replace(/^#/, '')));
        } else console.warn("React Select control element not found for tags inside:", containerSelector);
        return tags;
    }

    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        console.log(`Triggered download for: ${filename}`);
    }

     function sanitizeFilename(name) {
        // Ensure name is a string before calling replace
        const nameStr = String(name || ''); // Default to empty string if name is null/undefined
        return nameStr.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
    }

    function fetchUrlAsBlob(url) { // Changed to fetch Blob
        return new Promise((resolve, reject) => {
            console.log(`Fetching URL as Blob: ${url}`);
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "blob", // Request blob
                onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.response) : reject(new Error(`HTTP ${r.status}: ${r.statusText}`)),
                onerror: r => reject(new Error(`Network error: ${r.error || 'Unknown'}`)),
                ontimeout: () => reject(new Error("Request timed out"))
            });
        });
    }

    function fetchUrlAsArrayBuffer(url) { // Kept for API download
        return new Promise((resolve, reject) => {
            console.log(`Fetching URL as ArrayBuffer: ${url}`);
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "arraybuffer",
                onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.response) : reject(new Error(`HTTP ${r.status}: ${r.statusText}`)),
                onerror: r => reject(new Error(`Network error: ${r.error || 'Unknown'}`)),
                ontimeout: () => reject(new Error("Request timed out"))
            });
        });
    }

    // --- Image Conversion Helper ---
    function convertBlobToPngArrayBuffer(blob) {
        return new Promise((resolve, reject) => {
            const objectURL = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                console.log(`Converting ${blob.type} to PNG...`);
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
                canvas.toBlob(pngBlob => {
                    if (!pngBlob) { reject(new Error("Canvas toBlob failed.")); return; }
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result); // Resolve with ArrayBuffer
                    reader.onerror = (e) => reject(new Error(`FileReader error: ${e.target.error}`));
                    reader.readAsArrayBuffer(pngBlob);
                }, 'image/png');
                URL.revokeObjectURL(objectURL);
            };
            img.onerror = (err) => { URL.revokeObjectURL(objectURL); console.error("Image load error:", err); reject(new Error(`Failed to load image for conversion (Type: ${blob.type})`)); };
            img.src = objectURL;
        });
    }


    // --- Importer Logic (Edit/Create Page) ---
    function populateForm(characterData, imageFile = null) {
        console.log("Populating form with character data:", characterData);
        setInputValue('input[placeholder="Provide a unique name for your character"]', characterData.name || '');
        setInputValue('input#chat_name', characterData.name || '');
        setRichTextValue('div.tiptap.ProseMirror[contenteditable="true"]', characterData.description || '');
        setInputValue('textarea#personality', characterData.personality || '', true);
        setInputValue('textarea#scenario', characterData.scenario || '', true);
        setInputValue('textarea#first_message', characterData.first_mes || '', true);
        let examples = characterData.mes_example || '';
        examples = examples.replace(/<START>/g, '').trim();
        examples = examples.replace(/\{\{user\}\}/gi, '{{user}}');
        examples = examples.replace(/\{\{random_user_1\}\}/gi, '{{user}}');
        examples = examples.replace(/\{\{char\}\}/gi, '{{char}}');
        examples = examples.replace(/\{\{random_user_2\}\}/gi, '{{char}}');
        setInputValue('textarea#example_dialogs', examples, true);
        if (imageFile instanceof File) { injectImageFile(imageFile); }
        else { console.log("Not setting image from import source."); }
        if (characterData.tags && Array.isArray(characterData.tags) && characterData.tags.length > 0) { console.warn("Tag import experimental:", characterData.tags); }
        else { console.log("No tags found in imported data."); }
        GM_notification('Character data imported successfully!', 'JanitorAI Importer');
        alert('Character data imported! Please review all fields.');
    }

    function injectImageFile(file) {
        const fileInput = document.querySelector('label[for="avatar"] + div input[type="file"]');
        const dropZone = document.querySelector('label[for="avatar"] + div .css-1rotys8');
        if (!fileInput && !dropZone) { console.error('Avatar input/dropzone not found!'); alert('Error: Could not find avatar upload element.'); return; }
        if (!file || !(file instanceof File)) { console.error('Invalid file for image input.'); alert('Error: Invalid image file data.'); return; }
        try {
            const dataTransfer = new DataTransfer(); dataTransfer.items.add(file);
            if (fileInput) { fileInput.files = dataTransfer.files; fileInput.dispatchEvent(new Event('change', { bubbles: true })); console.log(`Injected image file "${file.name}"`); }
            else if (dropZone) { console.log("Attempting drop event simulation..."); const dropEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dataTransfer }); dropZone.dispatchEvent(dropEvent); const inputEvent = new Event('input', { bubbles: true }); dropZone.dispatchEvent(inputEvent); console.log(`Simulated drop event for "${file.name}"`); }
        } catch (error) { console.error('Error setting image:', error); alert(`Error injecting image: ${error.message}`); }
    }

    function handleFileImport(event) {
        const file = event.target.files[0]; if (!file) return;
        const importButton = document.getElementById('jnai-import-button');
        if (importButton) { importButton.textContent = 'Processing...'; importButton.disabled = true; }
        const reader = new FileReader();
        reader.onload = async (e) => {
            let characterDataForForm; let imageFile = null;
            try {
                if (file.type === 'image/png') {
                    console.log("Processing PNG file..."); const arrayBuffer = e.target.result;
                    if (!PngHelper.isPng(arrayBuffer)) throw new Error("Selected file is not a valid PNG.");
                    characterDataForForm = PngHelper.extractCharaData(arrayBuffer); imageFile = file;
                } else if (file.type === 'application/json') {
                    console.log("Processing JSON file..."); const jsonString = e.target.result; const jsonData = JSON.parse(jsonString);
                    if (jsonData.spec === "chara_card_v2" && jsonData.data && jsonData.name && jsonData.first_mes) {
                        console.log("Detected NEW complex JSON format. Using 'data' object."); characterDataForForm = jsonData.data;
                        if (!characterDataForForm.tags) characterDataForForm.tags = jsonData.data?.tags || [];
                    } else if (jsonData.spec === "chara_card_v2" && jsonData.data) {
                        console.log("Detected standard Tavern V2 JSON format."); characterDataForForm = jsonData.data;
                        if (!characterDataForForm.tags) characterDataForForm.tags = jsonData.data?.tags || [];
                    } else {
                        console.log("Assuming Tavern V1 JSON format (or unknown)."); characterDataForForm = jsonData;
                        if (!characterDataForForm.tags) characterDataForForm.tags = [];
                    }
                } else { throw new Error('Unsupported file type. Please select a .png or .json file.'); }
                if (!characterDataForForm || typeof characterDataForForm !== 'object') throw new Error("Parsed data is not a valid character object.");
                if (!characterDataForForm.name && !characterDataForForm.description) {
                    console.warn("Imported data missing key fields:", characterDataForForm);
                    if (!confirm("Warning: Imported data seems incomplete. Attempt anyway?")) { throw new Error("Import cancelled by user."); }
                }
                populateForm(characterDataForForm, imageFile);
            } catch (error) { console.error('Import failed:', error); alert(`Import failed: ${error.message}`); GM_notification(`Import failed: ${error.message}`, 'JanitorAI Importer Error');
            } finally { if (importButton) { importButton.textContent = 'Import Card/JSON'; importButton.disabled = false; } event.target.value = null; }
        };
        reader.onerror = (e) => { console.error("FileReader error:", e); alert(`Error reading file: ${e.target.error}`); if (importButton) { importButton.textContent = 'Import Card/JSON'; importButton.disabled = false; } event.target.value = null; };
        if (file.type === 'image/png') reader.readAsArrayBuffer(file);
        else if (file.type === 'application/json') reader.readAsText(file);
        else { alert('Unsupported file type.'); if (importButton) { importButton.textContent = 'Import Card/JSON'; importButton.disabled = false; } event.target.value = null; }
    }

    // --- Exporter Logic (Edit Page) ---
    function scrapeDataFromEditPage() {
        console.log("Scraping data from Edit Page...");
        const data = {};

        // Use the helper functions correctly
        data.jai_char_name = getInputValue('input#name');
        data.jai_chat_name = getInputValue('input#chat_name');
        data.jai_char_bio = getRichTextValue('div.tiptap.ProseMirror[contenteditable="true"]');
        data.jai_personality = getInputValue('textarea#personality');
        data.jai_scenario = getInputValue('textarea#scenario');
        data.jai_first_message = getInputValue('textarea#first_message');
        data.jai_example_dialogs = getInputValue('textarea#example_dialogs');

        const imgElement = document.querySelector('div.css-aqwq0n img.chakra-image');
        if (imgElement && imgElement.src) {
             data.imageUrl = imgElement.src.split('?')[0]; // Clean URL
             console.log(`Found image URL (cleaned): ${data.imageUrl}`);
        } else {
             data.imageUrl = null;
             console.warn("Could not find character image preview using selector 'div.css-aqwq0n img.chakra-image'.");
        }

        const tagsFormControl = Array.from(document.querySelectorAll('.chakra-form-control'))
                                    .find(el => el.querySelector('label')?.textContent?.includes('Character Tags'));
        if (tagsFormControl) {
             // Find the specific div that IS the react-select container
             const reactSelectContainer = tagsFormControl.querySelector('.css-tau7tx > div > div[class*="react-select"]');
             if(reactSelectContainer) {
                 // Pass the actual container selector to the helper
                 // We need a unique way to identify this specific container if there are multiple react-selects.
                 // Let's try finding its class name dynamically.
                 const containerClasses = reactSelectContainer.className.split(' ').map(c => c.trim()).filter(c => c.length > 0);
                 const specificSelector = '.' + containerClasses.join('.'); // Reconstruct a specific selector
                 console.log("Using specific selector for tags:", specificSelector);
                 data.tags = getTagsFromReactSelect(specificSelector); // Pass the specific selector
             } else {
                 console.warn("Could not find react-select container within tags form control.");
                 data.tags = [];
             }
        } else {
            console.warn("Could not find form control for tags by label.");
            data.tags = [];
        }

        // *** CRITICAL: Log the scraped data *before* validation ***
        console.log("Scraped raw data:", data);

        // Validation (check if chat name was actually found)
        if (data.jai_chat_name === undefined) { // Check for undefined explicitly
             alert("Cannot export: Failed to scrape 'Character Chat Name'. The page structure might have changed or the element is not ready.");
             return null; // Return null if essential data is missing
        }
         if (!data.jai_chat_name) { // Check if it's empty after being found
            alert("Cannot export: 'Character Chat Name' is empty. This is required for export.");
            return null;
        }
        return data;
    }

    // Exports JSON in the NEW complex format
    async function handleExportJsonEdit() {
        const scrapedData = scrapeDataFromEditPage();
        if (!scrapedData) return; // Exit if scraping failed validation

        const exportJson = {
            "name": scrapedData.jai_chat_name || scrapedData.jai_char_name || "",
            "description": scrapedData.jai_char_bio || "",
            "first_mes": scrapedData.jai_first_message || "",
            "personality": scrapedData.jai_personality || "",
            "scenario": scrapedData.jai_scenario || "",
            "mes_example": scrapedData.jai_example_dialogs || "",
            "spec": "chara_card_v2", "spec_version": "2.0",
            "data": {
                "name": scrapedData.jai_chat_name || scrapedData.jai_char_name || "",
                "description": scrapedData.jai_char_bio || "",
                "personality": scrapedData.jai_personality || "",
                "scenario": scrapedData.jai_scenario || "",
                "first_mes": scrapedData.jai_first_message || "",
                "mes_example": scrapedData.jai_example_dialogs || "",
                "creator_notes": "", "system_prompt": "", "post_history_instructions": "", "alternate_greetings": [],
                "character_version": "", "tags": scrapedData.tags || [], "creator": "",
                "extensions": { "talkativeness": "0.5", "depth_prompt": { "prompt": "", "depth": "" } }
            },
             "alternative": { /* Default/empty */ }, "misc": { /* Default/empty */ },
             "metadata": { "version": 1, "created": Date.now(), "modified": Date.now(), "source": "JanitorAI Edit Page Scrape", "tool": CUSTOM_TOOL_META }
        };
         // Add default empty structures if needed
         if (!exportJson.alternative) exportJson.alternative = { name_alt:"", description_alt:"", first_mes_alt:"", alternate_greetings_alt:[], personality_alt:"", scenario_alt:"", mes_example_alt:"", creator_alt:"", extensions_alt:{ talkativeness_alt:"0.5", depth_prompt_alt:{ prompt_alt:"", depth_alt:"" }}, system_prompt_alt:"", post_history_instructions_alt:"", creator_notes_alt:"", character_version_alt:"", tags_alt:[] };
         if (!exportJson.misc) exportJson.misc = { rentry:"", rentry_alt:"" };

        const jsonString = JSON.stringify(exportJson, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const filename = `${sanitizeFilename(scrapedData.jai_chat_name || scrapedData.jai_char_name || 'character')}.json`;
        downloadFile(blob, filename);
        GM_notification('Character exported as custom JSON.', 'JanitorAI Exporter');
    }

    // Exports PNG using standard V2 embedding, handles non-PNG avatars
    async function handleExportPngEdit() {
         const exportButton = document.getElementById('jnai-export-png-button');
         if(exportButton) exportButton.disabled = true;

         // *** Scrape data FIRST ***
         const scrapedData = scrapeDataFromEditPage();
         if (!scrapedData) { // Exit if scraping failed validation
             if(exportButton) exportButton.disabled = false;
             return;
         }
         if (!scrapedData.imageUrl) {
             alert("Cannot export as PNG: Image URL not found during scraping.");
             if(exportButton) exportButton.disabled = false;
             return;
         }

         // *** THEN handle image fetching and conversion ***
         try {
            console.log("Fetching image for PNG export...");
            const imageBlob = await fetchUrlAsBlob(scrapedData.imageUrl);
            let pngArrayBuffer;
            console.log(`Fetched image blob. Type: ${imageBlob.type}, Size: ${imageBlob.size}`);

            if (imageBlob.type === 'image/png') {
                console.log("Image is already PNG.");
                pngArrayBuffer = await imageBlob.arrayBuffer();
            } else if (imageBlob.type.startsWith('image/')) {
                console.log(`Image is not PNG (${imageBlob.type}). Converting...`);
                pngArrayBuffer = await convertBlobToPngArrayBuffer(imageBlob);
                console.log("Conversion to PNG successful.");
            } else {
                throw new Error(`Fetched file is not a recognizable image type: ${imageBlob.type || 'unknown'}`);
            }

             if (!pngArrayBuffer || pngArrayBuffer.byteLength < 8 || !PngHelper.isPng(pngArrayBuffer)) {
                  throw new Error("Failed to obtain a valid PNG ArrayBuffer.");
             }

            // Prepare data for STANDARD V2 embedding using the ALREADY scraped data
             const dataToEmbed = {
                 name: scrapedData.jai_chat_name || scrapedData.jai_char_name || "",
                 description: scrapedData.jai_char_bio || "",
                 personality: scrapedData.jai_personality || "",
                 scenario: scrapedData.jai_scenario || "",
                 first_mes: scrapedData.jai_first_message || "",
                 mes_example: scrapedData.jai_example_dialogs || "",
                 tags: scrapedData.tags || [],
                 creator_notes: "", system_prompt: "", post_history_instructions: "", alternate_greetings: [],
                 character_version: "", creator: "",
                 extensions: { talkativeness: "0.5", depth_prompt: { prompt: "", depth: "" } }
             };

            console.log("Embedding standard V2 data into PNG...");
            const finalPngBlob = PngHelper.embedCharaData(pngArrayBuffer, dataToEmbed);
            console.log("Data embedded.");
            // Use the scraped name for the filename
            const filename = `${sanitizeFilename(scrapedData.jai_chat_name || scrapedData.jai_char_name || 'character')}.png`;
            downloadFile(finalPngBlob, filename);
            GM_notification('Character exported as PNG (Standard V2 Format).', 'JanitorAI Exporter');
        } catch (error) {
            console.error('PNG Export failed:', error);
            alert(`PNG Export failed: ${error.message}`);
            GM_notification(`PNG Export failed: ${error.message}`, 'JanitorAI Exporter Error');
        } finally {
            if(exportButton) exportButton.disabled = false;
        }
    }


    // --- Exporter Logic (View Page using API) ---
    async function downloadJannyCharacterApi(uuid) {
        return new Promise((resolve, reject) => { /* ... (same as before) ... */ });
    }
    async function handleExportPngView() { /* ... (same as before) ... */ }
    async function handleExportJsonView() { /* ... (same as before, uses downloadJannyCharacterApi & PngHelper.extractCharaData) ... */ }


    // --- UI Injection ---
    function addButtons() { /* ... (same as before, calls the correct handlers) ... */
        const pathname = window.location.pathname; const buttonContainerId = 'jnai-button-container';
        const existingContainer = document.getElementById(buttonContainerId); if (existingContainer) existingContainer.remove();
        const container = document.createElement('div'); container.id = buttonContainerId; Object.assign(container.style, { position: 'fixed', top: '10px', right: '15px', zIndex: '9999', display: 'flex', flexDirection: 'column', gap: '5px' });

        if (pathname === '/create_character' || pathname.startsWith('/edit_character/')) {
            const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = '.png,.json'; fileInput.style.display = 'none'; fileInput.id = 'jnai-import-input'; fileInput.addEventListener('change', handleFileImport);
            const importButton = document.createElement('button'); importButton.textContent = 'Import Card/JSON'; importButton.id = 'jnai-import-button'; importButton.className = 'jnai-button'; importButton.addEventListener('click', () => fileInput.click());
            container.appendChild(importButton); if (!document.getElementById(fileInput.id)) document.body.appendChild(fileInput);

            const exportJsonButton = document.createElement('button'); exportJsonButton.textContent = 'Export JSON (Custom)'; exportJsonButton.id = 'jnai-export-json-button'; exportJsonButton.className = 'jnai-button'; exportJsonButton.title = 'Exports in the specified custom JSON format.'; exportJsonButton.addEventListener('click', handleExportJsonEdit); container.appendChild(exportJsonButton);
            const exportPngButton = document.createElement('button'); exportPngButton.textContent = 'Export PNG (Std V2)'; exportPngButton.id = 'jnai-export-png-button'; exportPngButton.className = 'jnai-button'; exportPngButton.title = 'Embeds standard V2 data into the current avatar (converts if needed).'; exportPngButton.addEventListener('click', handleExportPngEdit); container.appendChild(exportPngButton);
        }

        if (pathname.startsWith('/characters/') && pathname.split('/').length > 2 && pathname.split('/')[2].length > 0) {
            const exportJsonButton = document.createElement('button'); exportJsonButton.textContent = 'Export JSON (API/Custom)'; exportJsonButton.id = 'jnai-export-json-button'; exportJsonButton.className = 'jnai-button jnai-button-api'; exportJsonButton.title = 'Downloads card via API and formats as custom JSON.'; exportJsonButton.addEventListener('click', handleExportJsonView); container.appendChild(exportJsonButton);
            const exportPngButton = document.createElement('button'); exportPngButton.textContent = 'Export PNG (API/Std V2)'; exportPngButton.id = 'jnai-export-png-button'; exportPngButton.className = 'jnai-button jnai-button-api'; exportPngButton.title = 'Downloads card via API (should be standard V2 PNG).'; exportPngButton.addEventListener('click', handleExportPngView); container.appendChild(exportPngButton);
        }

        if (container.hasChildNodes()) document.body.appendChild(container);
        else console.log("No buttons added for current page:", pathname);
    }

    // --- Styling ---
    GM_addStyle(`
        .jnai-button { padding: 8px 12px; background-color: #6a4f8a; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; /* Smaller font */ box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: background-color 0.2s ease, transform 0.1s ease; text-align: center; white-space: nowrap; }
        .jnai-button:hover { background-color: #8363a8; } .jnai-button:active { transform: scale(0.98); }
        .jnai-button:disabled { background-color: #cccccc; color: #666666; cursor: not-allowed; }
        .jnai-button-api { background-color: #5a7a9a; } .jnai-button-api:hover { background-color: #7395b8; }
    `);

    // --- Initialization ---
    console.log(`JanitorAI SillyTavern Importer/Exporter v${SCRIPT_VERSION} Initializing...`);
    let currentPage = window.location.pathname;
    const observer = new MutationObserver(() => {
        const mainContentSelector = 'main, [role="main"], #app main, .css-1t6eusi, .css-lo240v';
        const isReady = document.querySelector(mainContentSelector);
        const urlChanged = window.location.pathname !== currentPage;
        if (isReady && (urlChanged || !document.getElementById('jnai-button-container'))) {
             console.log("Page change/load detected, adding/refreshing buttons for:", window.location.pathname);
             currentPage = window.location.pathname;
             // Increased delay slightly, might help ensure elements are populated
             setTimeout(addButtons, 800);
        } else if (urlChanged) {
            currentPage = window.location.pathname;
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Increased initial delay
    setTimeout(addButtons, 1500);

})();