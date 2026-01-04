// ==UserScript==
// @name         CodePen AI Helper (Gemini - Agent Fix)
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  Fixes ReferenceError in getActiveEditor, focuses on integration for Agent mode.
// @author       Webusta LLC - https://webusta.org
// @match        https://codepen.io/*/pen/*
// @match        https://codepen.io/pen*
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQyODVGNCI+PHBhdGggZD0iTTEyIDIuNUM2Ljc1IDIuNSAyLjUgNi47NSAyLjUgMTJzNC4yNSA5LjUgOS41IDkuNSA5LjUtNC4yNSA5LjUtOS41UzE3LjI1IDIuNSAxMiAyLjV6bTcgOS40OWMtLjA4LjIzLS4xOS40NS0uMzIuNjZsLTEuNzUgMi44OWMtLjIuMzMtLjUxLjUzLS44Ni41M2gtNi4xNGMtLjM1IDAtLjY2LS4yLS44Ni0uNTNsLTEuNzUtMi44OWEtMS43MSAxLjcxIDAgMCAxLS4zMi0uNjZjLS4wOS0uMjYtLjE0LS41My0uMTQtLjgxIDAtMS4xMS45LTIuMDEgMi4wMS0yLjAxaDIuMTNsLjk0LTEuNTdjLjIxLS4zNC41NC0uNTUuOTEtLjU1czEuMy42MyAxLjMgMS40MnYyLjEyaDIuMTNjMS4xMSAwIDIuMDEuOSAyLjAxIDIuMDEgMCAuMjgtLjA1LjU1LS4xNC44MXptLTcuMDItNi4xMmMtLjM0LS4yMS0uNTUtLjU0LS41NS0uOTEgMC0uMi4wNC0uNC4xMi0uNTlsMS4wOS0xLjgxYy4yMS0uMzQuNTUtLjU0LjkyLS41NWgyLjFsLjEzLS4yMmMuMjItLjM0LjU1LS41NC45Mi0uNTRoMy43MmMuMzcgMCAuNy4yLjkxLjU1bDEuMDkgMS44MWMuMDguMTkuMTMuMzkuMTMuNmwtMi4zNSA5LjM4aC01Ljc5bDIuMzYtOS4zOHptNi41MiAxMi4yNWMtLjE1LjMtLjM5LjU1LS42Ni43MS0uMjcuMTYtLjU2LjI4LS44NC4yOGgtNS4zNGMtLjI4IDAtLjU3LS4wOC0uODQtLjI4LS4yNy0uMTYtLjUxLS40MS0uNjYtLjcxTDYuNSA5LjY4aDExbC0yLjk4IDUuOTV6Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/534812/CodePen%20AI%20Helper%20%28Gemini%20-%20Agent%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534812/CodePen%20AI%20Helper%20%28Gemini%20-%20Agent%20Fix%29.meta.js
// ==/UserScript==

/* globals marked */

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'cpaih_gemini_';
    const API_KEY_STORAGE_KEY = SCRIPT_PREFIX + 'api_key';
    const MODE_STORAGE_KEY = SCRIPT_PREFIX + 'mode';
    const MODEL_STORAGE_KEY = SCRIPT_PREFIX + 'model';
    const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';
    const CONTEXT_CHAR_LIMIT = 1200;

    const AVAILABLE_MODELS = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-pro', 'gemini-2.0-flash', 'gemini-2.5-flash-preview-04-17', 'gemini-2.5-pro-preview-03-25'];
    const DEFAULT_MODEL = AVAILABLE_MODELS[0];

    // --- State Variables ---
    let apiKey = GM_getValue(API_KEY_STORAGE_KEY, null);
    let currentMode = GM_getValue(MODE_STORAGE_KEY, 'chat');
    let selectedModel = GM_getValue(MODEL_STORAGE_KEY, DEFAULT_MODEL);
    if (!AVAILABLE_MODELS.includes(selectedModel)) selectedModel = DEFAULT_MODEL;

    let modalVisible = false;
    let isDragging = false;
    let offsetX, offsetY;
    let modal, chatBox, inputBox, modalHeader, modeSelector, modelSelectorElement;
    let editors = { html: null, css: null, js: null };
    let lastRequestContext = { selection: null, editorType: null, cursorPos: null, surroundingLines: null, userPrompt: "" };

    // --- Editor Interaction ---
    function findEditors() {
        try {
            const htmlBox = document.getElementById('box-html');
            const cssBox = document.getElementById('box-css');
            const jsBox = document.getElementById('box-js');
            if (htmlBox?.querySelector('.CodeMirror')) editors.html = htmlBox.querySelector('.CodeMirror').CodeMirror;
            if (cssBox?.querySelector('.CodeMirror')) editors.css = cssBox.querySelector('.CodeMirror').CodeMirror;
            if (jsBox?.querySelector('.CodeMirror')) editors.js = jsBox.querySelector('.CodeMirror').CodeMirror;
        } catch (error) { console.error(`${SCRIPT_PREFIX}Error finding editors:`, error); }
    }

    // **FIXED getActiveEditor**
    function getActiveEditor() {
        findEditors(); // Ensure editors are fresh
        for (const type in editors) {
            if (editors[type] && editors[type].hasFocus()) {
                return { type: type, instance: editors[type] };
            }
        }
        // Fallback: Check if only one editor is visible
        let visibleEditorType = null;
        let visibleCount = 0;
        ['html', 'css', 'js'].forEach(t => { // Use 't' as the loop variable
            const b = document.getElementById(`box-${t}`);
            if (b && window.getComputedStyle(b).display !== 'none' && editors[t]) {
                visibleEditorType = t; // ***** CORRECTED: Use 't' here *****
                visibleCount++;
            }
        });
         if (visibleCount === 1 && visibleEditorType) {
             console.log(`${SCRIPT_PREFIX}Fallback: Detected single visible editor: ${visibleEditorType}`);
             return { type: visibleEditorType, instance: editors[visibleEditorType] };
         }

        console.log(`${SCRIPT_PREFIX}No active editor detected.`);
        return null;
    }

    function getEditorContext() {
        const activeEditorInfo = getActiveEditor();
        if (!activeEditorInfo) return null;

        const editor = activeEditorInfo.instance;
        const selection = editor.getSelection();
        const cursorPos = editor.getCursor();
        let surroundingLines = '';

        if (!selection) {
            const lineNum = cursorPos.line;
            const startLine = Math.max(0, lineNum - 2);
            const endLine = Math.min(editor.lineCount() - 1, lineNum + 2);
             try {
                 surroundingLines = editor.getRange({ line: startLine, ch: 0 }, { line: endLine, ch: editor.getLine(endLine)?.length ?? 0 });
             } catch (e) {
                  console.warn(`${SCRIPT_PREFIX}Could not get surrounding lines:`, e);
                 surroundingLines = editor.getLine(lineNum) || '';
             }
        }

        return {
            editorType: activeEditorInfo.type,
            selection: selection || null,
            cursorPos: selection ? null : cursorPos,
            surroundingLines: selection ? null : surroundingLines
        };
    }

    function getCode(editorType) {
        findEditors();
        const editor = editors[editorType.toLowerCase()];
        return editor ? editor.getValue() : "";
    }

    function setCode(editorType, newCode, isFullReplaceIntent = false) {
        if (currentMode !== 'agent'){ addChatMessage(`(${editorType.toUpperCase()} code provided, Chat mode active. No changes.)`, 'system'); return; }
        findEditors();
        const editor = editors[editorType.toLowerCase()];
        if (editor && typeof newCode === 'string') {
            try {
                const trimmedCode = newCode.trim();
                const promptLower = lastRequestContext.userPrompt.toLowerCase();
                 // Display warning logic remains
                if (isFullReplaceIntent && !promptLower.includes('replace all') && !promptLower.includes('rewrite entire') && !promptLower.includes('full example')) {
                    addChatMessage(`⚠️ **Agent:** Replacing all ${editorType.toUpperCase()} code based on AI suggestion... (Use 'replace all' in prompt for intent).`, 'system');
                    console.warn(`${SCRIPT_PREFIX}Applying full replace for ${editorType} without explicit user command.`);
                }
                editor.setValue(trimmedCode);
                addChatMessage(`Code **updated/replaced** in ${editorType.toUpperCase()} (Agent Mode).`, 'system');
            } catch (e) { console.error(`${SCRIPT_PREFIX}Set code error ${editorType}:`, e); addChatMessage(`Error updating ${editorType} editor.`, 'error'); }
        } else if (!editor) { addChatMessage(`${editorType.toUpperCase()} editor not found.`, 'error'); }
    }

    function insertCode(editorType, codeToInsert) {
        if (currentMode !== 'agent'){ addChatMessage(`(${editorType.toUpperCase()} snippet, Chat mode active. No changes.)`, 'system'); return; }
        findEditors();
        const editor = editors[editorType.toLowerCase()];
        if (editor && typeof codeToInsert === 'string' && codeToInsert.trim() !== '') {
            try {
                const doc = editor.getDoc();
                let insertPos = editor.getCursor();
                 if (lastRequestContext.selection && lastRequestContext.editorType === editorType) {
                     console.log(`${SCRIPT_PREFIX}Selection existed, inserting at current cursor for ${editorType}.`);
                 } else if (lastRequestContext.cursorPos && lastRequestContext.editorType === editorType) {
                    insertPos = lastRequestContext.cursorPos;
                 }
                doc.replaceRange(codeToInsert.trim() + '\n', insertPos);
                addChatMessage(`Snippet **inserted** into ${editorType.toUpperCase()} (Agent Mode).`, 'system');
            } catch (e) { console.error(`${SCRIPT_PREFIX}Insert code error ${editorType}:`, e); addChatMessage(`Error inserting code in ${editorType}.`, 'error'); }
        } else if (!editor) { addChatMessage(`${editorType.toUpperCase()} editor not found.`, 'error'); }
    }

    function replaceSelection(editorType, replacementCode) {
         if (currentMode !== 'agent'){ addChatMessage(`(${editorType.toUpperCase()} mod proposed, Chat mode active. No changes.)`, 'system'); return false; }
         if (!lastRequestContext.selection || lastRequestContext.editorType !== editorType) { addChatMessage(`Cannot replace selection: No prior selection context for ${editorType}.`, 'error'); return false; }
         findEditors();
         const editor = editors[editorType.toLowerCase()];
         if (editor && typeof replacementCode === 'string') {
             try {
                 const currentSelection = editor.getSelection();
                 if (currentSelection) {
                     editor.replaceSelection(replacementCode.trim());
                     addChatMessage(`Selection **replaced** in ${editorType.toUpperCase()} (Agent Mode).`, 'system');
                     return true;
                 } else {
                     addChatMessage(`Cannot replace selection: No text currently selected in ${editorType}. Inserting instead...`, 'system');
                     insertCode(editorType, replacementCode); // Fallback
                     return false;
                 }
             } catch (e) { console.error(`${SCRIPT_PREFIX}Replace selection error ${editorType}:`, e); addChatMessage(`Error replacing selection in ${editorType}.`, 'error'); return false; }
         } else if (!editor) { addChatMessage(`${editorType.toUpperCase()} editor not found.`, 'error'); return false; }
         return false;
     }

    function parseAndDistributeCode(fullCode) {
        if (currentMode !== 'agent'){ addChatMessage(`(Combined code detected, Chat mode active. No changes.)`, 'system'); return; }
        console.log(`${SCRIPT_PREFIX}Parsing combined code (Agent)...`);
        let htmlContent = fullCode, cssContent = '', jsContent = '';
        let distributed = { html: false, css: false, js: false };
        const styleRegex = /<style.*?>([\s\S]*?)<\/style>/gi;
        htmlContent = htmlContent.replace(styleRegex, (match, css) => { cssContent += css.trim() + '\n\n'; distributed.css = true; return ''; });
        const scriptRegex = /<script(?!\s*src)[^>]*?>([\s\S]*?)<\/script>/gi;
        htmlContent = htmlContent.replace(scriptRegex, (match, js) => { jsContent += js.trim() + '\n\n'; distributed.js = true; return ''; });
        const bodyRegex = /<body.*?>([\s\S]*?)<\/body>/i;
        const bodyMatch = htmlContent.match(bodyRegex);
        if (bodyMatch && bodyMatch[1]) { htmlContent = bodyMatch[1].trim(); }
        else { htmlContent = htmlContent.replace(/<head.*?>[\s\S]*?<\/head>/i, '').replace(/<html.*?>/i, '').replace(/<\/html>/i, '').trim(); }
        distributed.html = !!htmlContent;
        addChatMessage("Distributing parsed code (Agent Mode)...", 'system');
        if (distributed.css) setCode('css', cssContent, true);
        if (distributed.js) setCode('js', jsContent, true);
        if (distributed.html) setCode('html', htmlContent, true);
        if (!distributed.html && !distributed.css && !distributed.js) addChatMessage("Could not parse sections.", 'system');
    }

    // --- Helper Functions ---
    function getApiKey() { /* ... (Unchanged) ... */ if(!apiKey){apiKey=prompt('Enter Google AI Studio Gemini API Key:'); if(apiKey){GM_setValue(API_KEY_STORAGE_KEY,apiKey);addChatMessage('API Key saved.','system');}else{addChatMessage('API Key needed.','error');return null;}} return apiKey;}
    function addChatMessage(message, sender = 'user', isCodeBlock = false) { /* ... (Unchanged from v0.7 - Uses Markdown) ... */ if (!chatBox || typeof message !== 'string') return; const d = document.createElement('div'); d.className = `chat-message message-${sender}`; if (isCodeBlock) { const p = document.createElement('pre'), c = document.createElement('code'); const cleanMsg = message.replace(/^```(?:\w+)?\s*?\n?/, '').replace(/\n?\s*?```$/, ''); c.textContent = cleanMsg; p.appendChild(c); d.appendChild(p); } else { try { marked.setOptions({ gfm: true, breaks: true, sanitize: false, smartypants: true }); const h = marked.parse(message.trim()); d.innerHTML = h; d.querySelectorAll('a').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; }); } catch (e) { console.error(`${SCRIPT_PREFIX}Markdown error:`, e); const f = document.createElement('p'); f.textContent = message.trim(); d.appendChild(f); addChatMessage(`(Error rendering formatting)`, 'system'); } } chatBox.appendChild(d); chatBox.scrollTop = chatBox.scrollHeight; }

    // --- AI Communication (Unchanged prompt logic from v0.8) ---
    async function callGemini() { /* ... (Uses CONTEXT_CHAR_LIMIT, sends refined prompt based on mode/context) ... */
        const currentApiKey = getApiKey(); if (!currentApiKey || !lastRequestContext.userPrompt) return; addChatMessage('Thinking...', 'ai-thinking'); const htmlCode = getCode('html'); const cssCode = getCode('css'); const jsCode = getCode('js'); let contextInfo = "\n"; if (lastRequestContext.editorType) { contextInfo += `User focus/cursor is in ${lastRequestContext.editorType.toUpperCase()}.\n`; } if (lastRequestContext.selection) { contextInfo += `User Selected (in ${lastRequestContext.editorType.toUpperCase()}):\n\`\`\`${lastRequestContext.editorType}\n${lastRequestContext.selection.substring(0, 300)}...\n\`\`\`\n`; addChatMessage(`(Context: Selected ${lastRequestContext.editorType.toUpperCase()} code)`, 'system'); } else if (lastRequestContext.cursorPos && lastRequestContext.surroundingLines) { contextInfo += `Cursor Near (in ${lastRequestContext.editorType.toUpperCase()}, line ${lastRequestContext.cursorPos.line + 1}):\n\`\`\`${lastRequestContext.editorType}\n${lastRequestContext.surroundingLines.substring(0, 300)}...\n\`\`\`\n`; addChatMessage(`(Context: Code near cursor in ${lastRequestContext.editorType.toUpperCase()})`, 'system'); } else { addChatMessage(`(Context: Full code)`, 'system'); } const instructions = `You are an AI assistant for CodePen editor (HTML, CSS, JS panels).\nCurrent Mode: ${currentMode.toUpperCase()}.${contextInfo}\nFull Code Context (truncated):\nHTML:\n\`\`\`html\n${htmlCode.substring(0, CONTEXT_CHAR_LIMIT)}...\n\`\`\`\nCSS:\n\`\`\`css\n${cssCode.substring(0, CONTEXT_CHAR_LIMIT)}...\n\`\`\`\nJS:\n\`\`\`javascript\n${jsCode.substring(0, CONTEXT_CHAR_LIMIT)}...\n\`\`\`\n*** MODE INSTRUCTIONS (VERY IMPORTANT!) ***\nIF MODE IS 'CHAT': Explain, suggest, analyze, plan. Discuss the code. Provide short example snippets if needed, but NO code meant to replace editor content.\nIF MODE IS 'AGENT': **PRIORITY: SAFE, INCREMENTAL EDITS.** Adhere strictly: If user selected code, Respond with ONLY the modified version of the selected code section in ONE appropriate markdown block. PRESERVE ALL OTHER CODE. Do NOT output the entire file. If user asks to ADD/INSERT/CREATE code (no selection), Respond with ONLY the new code snippet(s) needed, in separate, language-labeled markdown blocks. If user asks to MODIFY/CHANGE/FIX code (no selection), Return the COMPLETE, UPDATED CODE for the ENTIRE PANEL(S) affected by the change. Integrate the change correctly. Use separate, language-labeled markdown blocks. Make clear if modifying multiple panels. ONLY if user explicitly asks 'REPLACE ALL'/'REWRITE ENTIRE'/'FULL EXAMPLE', provide COMPLETE code for relevant panels in separate blocks (HTML body, CSS rules, JS code). **NEVER rewrite the entire content of an editor unless explicitly asked.** Respond ONLY with code (per rules) or brief explanation. NO conversational fluff.\nUser Request: ${lastRequestContext.userPrompt}`; const requestBody = { contents: [{ parts: [{ text: instructions }] }] }; const apiUrl = `${GEMINI_API_BASE_URL}${selectedModel}:generateContent?key=${currentApiKey}`; GM_xmlhttpRequest({ method: "POST", url: apiUrl, headers: { "Content-Type": "application/json" }, data: JSON.stringify(requestBody), onload: function(response) { const thinkingMsg = chatBox?.querySelector('.message-ai-thinking'); if (thinkingMsg) thinkingMsg.remove(); if (response.status >= 200 && response.status < 300) { try { const data = JSON.parse(response.responseText); let aiResponseText = "Error: No response text."; let isBlocked = false; if (data.candidates?.length > 0) { if (data.candidates[0].finishReason === 'SAFETY') { aiResponseText = "Response blocked by safety filter."; isBlocked = true; } else if (data.candidates[0].content?.parts?.[0]?.text) { aiResponseText = data.candidates[0].content.parts[0].text; } } else if (data.promptFeedback?.blockReason) { aiResponseText = `Prompt blocked: ${data.promptFeedback.blockReason}`; isBlocked = true; } if (isBlocked) { addChatMessage(aiResponseText, 'error'); console.warn(`${SCRIPT_PREFIX}AI block:`, data); } else { processAIResponse(aiResponseText); } } catch (e) { console.error(`${SCRIPT_PREFIX}Parse response error:`, e, response.responseText); addChatMessage('Error parsing AI response.', 'error'); } } else { console.error(`${SCRIPT_PREFIX}API Error:`, response.status, response.statusText, response.responseText); let errorMsg = `Error: ${response.status} ${response.statusText}`; try { const errorData = JSON.parse(response.responseText); if (errorData.error?.message) errorMsg += ` - ${errorData.error.message}`; } catch (e) { /* ignore */ } addChatMessage(errorMsg, 'error'); if ([400, 401, 403].includes(response.status)) { apiKey = null; GM_setValue(API_KEY_STORAGE_KEY, null); addChatMessage('API Key invalid/expired or lacks permission.', 'system'); } } }, onerror: function(error) { const thinkingMsg = chatBox?.querySelector('.message-ai-thinking'); if (thinkingMsg) thinkingMsg.remove(); console.error(`${SCRIPT_PREFIX}Network error:`, error); addChatMessage('Network error.', 'error'); } });
    }

    // --- Response Processing (Unchanged logic from v0.8) ---
    function processAIResponse(response) { /* ... */ const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g; let match; let codeBlocks = []; let nonCodeText = response; while ((match = codeBlockRegex.exec(response)) !== null) { const language = (match[1] || '').toLowerCase().trim(); const code = match[2].trim(); codeBlocks.push({ language, code, raw: match[0] }); nonCodeText = nonCodeText.replace(match[0], `%%CODEBLOCK_${codeBlocks.length - 1}%%`); } const textParts = nonCodeText.split(/%%CODEBLOCK_\d+%%/); textParts.forEach((textPart, index) => { const trimmedPart = textPart.trim(); if (trimmedPart) addChatMessage(trimmedPart, 'ai', false); if (codeBlocks[index]) addChatMessage(codeBlocks[index].raw, 'ai', true); }); if (currentMode === 'agent' && codeBlocks.length > 0) { addChatMessage("Processing code blocks (Agent Mode)...", 'system'); let appliedAction = false; if (lastRequestContext.selection && codeBlocks.length === 1) { const block = codeBlocks[0]; const editorType = (block.language === 'javascript' || block.language === 'js') ? 'js' : block.language; if (editorType === lastRequestContext.editorType) { addChatMessage(`Attempting to replace selection in ${editorType.toUpperCase()}...`, 'system'); if (replaceSelection(editorType, block.code)) { appliedAction = true; console.log(`${SCRIPT_PREFIX}Agent replaced selection in ${editorType}.`); } else { addChatMessage(`Failed to replace selection automatically. Code displayed above.`, 'system'); appliedAction = true; } } else { addChatMessage(`AI returned code for '${block.language || 'unknown'}' but selection was in '${lastRequestContext.editorType}'. Displaying only.`, 'system'); appliedAction = true; } } if (!appliedAction) { const isLikelyFullPage = codeBlocks.length === 1 && (codeBlocks[0].language === 'html' || !codeBlocks[0].language) && /<(html|head|body|style|script)/i.test(codeBlocks[0].code); const promptLower = lastRequestContext.userPrompt.toLowerCase(); const isExplicitReplace = promptLower.includes('replace all') || promptLower.includes('rewrite entire') || promptLower.includes('full example'); if (isLikelyFullPage) { addChatMessage("Combined structure detected. Parsing and distributing...", 'system'); parseAndDistributeCode(codeBlocks[0].code); appliedAction = true; } else if (codeBlocks.length > 0) { addChatMessage(`Applying ${codeBlocks.length} code block(s) via replace...`, 'system'); codeBlocks.forEach(block => { const lang = block.language; const editorType = (lang === 'javascript' || lang === 'js') ? 'js' : (lang === 'css' ? 'css' : (lang === 'html' ? 'html' : null)); if (editorType) { setCode(editorType, block.code, true); } else if(block.code) { addChatMessage(`(Block lang '${lang || 'unknown'}' not matched)`, 'system'); } }); appliedAction = true; } } if (!appliedAction && codeBlocks.length > 0) { addChatMessage("Could not automatically apply code changes based on context. Review code above.", 'system'); } } else if (currentMode === 'chat' && codeBlocks.length > 0) { addChatMessage("(Chat Mode: Code received but not applied.)", 'system'); } }


    // --- UI Creation & Event Handlers (Unchanged from v0.8) ---
    function createUI() { /* ... */ const hB=document.createElement('button'); hB.id=SCRIPT_PREFIX+'toggle_button'; hB.title='Toggle AI Helper (Gemini)'; hB.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#4285F4"><path d="M12 2.5C6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5S17.25 2.5 12 2.5zm4.99 9.49c-.08.23-.19.45-.32.66l-1.75 2.89c-.2.33-.51.53-.86.53h-6.14c-.35 0-.66-.2-.86-.53l-1.75-2.89a1.71 1.71 0 0 1-.32-.66c-.09-.26-.14-.53-.14-.81 0-1.11.9-2.01 2.01-2.01h2.13l.94-1.57c.21-.34.54-.55.91-.55s1.3.63 1.3 1.42v2.12h2.13c1.11 0 2.01.9 2.01 2.01 0 .28-.05.55-.14.81zM11.98 5.87c-.34-.21-.55-.54-.55-.91 0-.2.04-.4.12-.59l1.09-1.81c.21-.34.55-.54.92-.55h2.1l.13-.22c.22-.34.55-.54.92-.54h3.72c.37 0 .7.2.91.55l1.09 1.81c.08.19.13.39.13.6l-2.35 9.38h-5.79l2.36-9.38zm6.52 12.25c-.15.3-.39.55-.66.71-.27.16-.56.24-.84.24h-5.34c-.28 0-.57-.08-.84-.24-.27-.16-.51-.41-.66-.71L6.5 9.68h11l-2.98 5.95z"/></svg>`; hB.addEventListener('click', toggleModal); modal = document.createElement('div'); modal.id = SCRIPT_PREFIX + 'modal'; modal.style.display = 'none'; modalHeader = document.createElement('div'); modalHeader.id = SCRIPT_PREFIX + 'modal_header'; modalHeader.innerHTML = `<span>AI Helper (Gemini v${GM_info.script.version})</span><button id="${SCRIPT_PREFIX}close_button" title="Close">X</button>`; modalHeader.addEventListener('mousedown', startDrag); chatBox = document.createElement('div'); chatBox.id = SCRIPT_PREFIX + 'chatbox'; const sA=document.createElement('div'); sA.id=SCRIPT_PREFIX+'settings_area'; modeSelector=document.createElement('div'); modeSelector.id=SCRIPT_PREFIX+'mode_selector'; modeSelector.innerHTML=`<span class="setting-label">Mode:</span><label><input type="radio" name="${SCRIPT_PREFIX}mode" value="chat" ${currentMode==='chat'?'checked':''}> Chat</label><label><input type="radio" name="${SCRIPT_PREFIX}mode" value="agent" ${currentMode==='agent'?'checked':''}> Agent</label>`; modeSelector.addEventListener('change',(e)=>{if(e.target.type==='radio'){currentMode=e.target.value; GM_setValue(MODE_STORAGE_KEY,currentMode); addChatMessage(`Switched to ${currentMode.toUpperCase()} mode.`,'system'); inputBox.placeholder=`Ask Gemini (${currentMode} mode)...`; console.log(`${SCRIPT_PREFIX}Mode: ${currentMode}`);}}); const mSC=document.createElement('div'); mSC.id=SCRIPT_PREFIX+'model_selector_container'; mSC.innerHTML=`<span class="setting-label">Model:</span>`; modelSelectorElement=document.createElement('select'); modelSelectorElement.id=SCRIPT_PREFIX+'model_selector'; AVAILABLE_MODELS.forEach(mN=>{const o=document.createElement('option');o.value=mN; o.textContent=mN.replace(/-latest$/,'').replace(/^gemini-/,''); if(mN===selectedModel)o.selected=true; modelSelectorElement.appendChild(o);}); modelSelectorElement.addEventListener('change',(e)=>{selectedModel=e.target.value; GM_setValue(MODEL_STORAGE_KEY,selectedModel); addChatMessage(`Model set to ${selectedModel}.`,'system'); console.log(`${SCRIPT_PREFIX}Model: ${selectedModel}`);}); mSC.appendChild(modelSelectorElement); sA.appendChild(modeSelector); sA.appendChild(mSC); const iA=document.createElement('div'); iA.id=SCRIPT_PREFIX+'input_area'; inputBox=document.createElement('textarea'); inputBox.id=SCRIPT_PREFIX+'input'; inputBox.placeholder=`Ask Gemini (${currentMode} mode)...`; inputBox.rows=2; inputBox.addEventListener('keydown',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); handleSend();}}); const sB=document.createElement('button'); sB.id=SCRIPT_PREFIX+'send_button'; sB.textContent='Send'; sB.addEventListener('click',handleSend); iA.appendChild(inputBox); iA.appendChild(sB); modal.appendChild(modalHeader); modal.appendChild(chatBox); modal.appendChild(sA); modal.appendChild(iA); document.body.appendChild(modal); document.getElementById(SCRIPT_PREFIX+'close_button').addEventListener('click',toggleModal); const fT=document.querySelector('.footer-actions')||document.querySelector('#react-pen-footer .footer-left'); if(fT){fT.insertBefore(hB,fT.firstChild);}else{console.warn(`${SCRIPT_PREFIX}Footer target not found.`); hB.style.cssText='position:fixed;bottom:15px;right:150px;z-index:9998;'; document.body.appendChild(hB);} document.addEventListener('mousemove',drag); document.addEventListener('mouseup',stopDrag); addChatMessage(`Gemini AI Helper ready (Mode: ${currentMode.toUpperCase()}). v${GM_info.script.version}`,'system'); if(!apiKey)addChatMessage('Tip: Provide Google API key.','system'); }
    function handleSend() { /* ... */ const t=inputBox.value.trim(); if(!t)return; if(!apiKey){addChatMessage('API Key needed.','error'); getApiKey(); return;} addChatMessage(t,'user'); const c=getEditorContext(); lastRequestContext={selection:c?.selection||null, editorType:c?.type||null, cursorPos:c?.cursorPos||null, surroundingLines:c?.surroundingLines||null, userPrompt:t}; console.log(`${SCRIPT_PREFIX}Request Ctx:`,lastRequestContext); callGemini(); inputBox.value=''; inputBox.style.height='auto'; inputBox.rows=2; }
    function toggleModal() { /* ... */ modalVisible=!modalVisible; modal.style.display=modalVisible?'flex':'none'; if(modalVisible){findEditors();inputBox.placeholder=`Ask Gemini (${currentMode} mode)...`;} }
    function startDrag(e) { /* ... */ if(e.target.closest(`#${SCRIPT_PREFIX}close_button`))return; const h=e.target.closest(`#${SCRIPT_PREFIX}modal_header`); if(!h)return; isDragging=true; offsetX=e.clientX-modal.offsetLeft; offsetY=e.clientY-modal.offsetTop; modal.style.cursor='grabbing'; e.preventDefault(); }
    function drag(e) { /* ... */ if(!isDragging)return; let nX=e.clientX-offsetX, nY=e.clientY-offsetY; const mX=window.innerWidth-modal.offsetWidth, mY=window.innerHeight-modal.offsetHeight; nX=Math.max(0,Math.min(nX,mX)); nY=Math.max(0,Math.min(nY,mY)); modal.style.left=nX+'px'; modal.style.top=nY+'px'; }
    function stopDrag() { /* ... */ if(isDragging){isDragging=false; modal.style.cursor='grab';} }
    function addStyles() { /* ... (Unchanged from v0.7) ... */ GM_addStyle(` /* Base, Modal, Header, Chat, Input, Send Button etc. - same as v0.7 */ #${SCRIPT_PREFIX}toggle_button { background: #e8f0fe; color: #1a73e8; border: 1px solid #dadce0; padding: 5px 8px; cursor: pointer; border-radius: 4px; font-size: 12px; margin-left: 5px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; transition: background-color 0.2s ease, border-color 0.2s ease; } #${SCRIPT_PREFIX}toggle_button:hover { background: #d2e3fc; border-color: #c6c6c6; } #${SCRIPT_PREFIX}toggle_button svg { fill: #1a73e8; } #${SCRIPT_PREFIX}modal { position: fixed; bottom: 50px; right: 20px; width: 400px; height: 600px; background-color: #2a2a2a; border: 1px solid #444; box-shadow: 0 5px 15px rgba(0,0,0,0.4); z-index: 10000; display: flex; flex-direction: column; border-radius: 6px; color: #ccc; font-family: 'Lato', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, sans-serif; font-size: 14px; resize: both; overflow: hidden; min-width: 320px; min-height: 300px; } #${SCRIPT_PREFIX}modal_header { background-color: #383838; padding: 8px 12px; cursor: grab; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; font-weight: bold; user-select: none; } #${SCRIPT_PREFIX}modal_header span { color: #e0e0e0; font-size: 13px;} #${SCRIPT_PREFIX}close_button { background: none; border: none; color: #ccc; font-size: 16px; cursor: pointer; padding: 2px 5px; line-height: 1; } #${SCRIPT_PREFIX}close_button:hover { color: #fff; } #${SCRIPT_PREFIX}chatbox { flex-grow: 1; overflow-y: auto; padding: 10px; background-color: #1e1e1e; word-wrap: break-word; } .chat-message { margin-bottom: 10px; padding: 8px 12px; border-radius: 6px; line-height: 1.5; max-width: 95%; word-wrap: break-word; } .message-user { background-color: #3a4a5a; color: #e0e0e0; margin-left: auto; float: right; clear: both; } .message-ai, .message-ai-thinking { background-color: #404040; color: #d0d0d0; margin-right: auto; float: left; clear: both; } .message-ai-thinking { font-style: italic; color: #999; } .message-system { font-style: italic; color: #888; text-align: center; font-size: 12px; padding: 4px; background: none; max-width: 100%; clear: both; } .message-error { color: #ff8a8a; background-color: #5c3030; font-weight: bold; text-align: center; max-width: 100%; clear: both;} .chat-message pre { background-color: #111; padding: 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; margin: 8px 0; text-align: left; font-size: 13px; border: 1px solid #333; } .chat-message pre code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; color: #c5c8c6; background: none; padding: 0; border: none; font-size: inherit; } .message-ai p { margin: 0.5em 0; } .message-ai strong { color: #fff; font-weight: bold; } .message-ai em { color: #ddd; font-style: italic; } .message-ai a { color: #87ceff; text-decoration: underline; } .message-ai a:hover { color: #a0dfff; } .message-ai code { background-color: #333; color: #f0a0a0; padding: 2px 5px; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.9em; border: 1px solid #444; } .message-ai pre code { background-color: transparent; color: #c5c8c6; padding: 0; border-radius: 0; font-family: inherit; font-size: inherit; border: none; } .message-ai ul, .message-ai ol { margin: 0.5em 0 0.5em 1em; padding-left: 1.5em; } .message-ai li { margin-bottom: 0.3em; } .message-ai blockquote { border-left: 3px solid #555; padding-left: 10px; margin-left: 5px; color: #aaa; font-style: italic; } .message-ai h1, .message-ai h2, .message-ai h3, .message-ai h4, .message-ai h5, .message-ai h6 { margin-top: 0.8em; margin-bottom: 0.4em; font-weight: bold; color: #eee; } .message-ai h1 { font-size: 1.4em; } .message-ai h2 { font-size: 1.3em; } .message-ai h3 { font-size: 1.2em; } #${SCRIPT_PREFIX}settings_area { padding: 8px 12px; background-color: #303030; border-top: 1px solid #444; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; font-size: 12px; flex-wrap: wrap; gap: 10px; } #${SCRIPT_PREFIX}mode_selector label, #${SCRIPT_PREFIX}model_selector_container span { margin-right: 8px; cursor: pointer; color: #bbb; } #${SCRIPT_PREFIX}mode_selector input[type="radio"] { margin-right: 3px; vertical-align: middle; accent-color: #4a90e2; } .setting-label { color: #aaa; margin-right: 5px; font-weight: bold; } #${SCRIPT_PREFIX}model_selector { background-color: #383838; color: #ccc; border: 1px solid #444; border-radius: 3px; padding: 2px 4px; font-size: 11px; max-width: 150px; } #${SCRIPT_PREFIX}input_area { display: flex; padding: 8px; background-color: #303030; } #${SCRIPT_PREFIX}input { flex-grow: 1; padding: 6px 8px; border: 1px solid #444; border-radius: 4px; background-color: #383838; color: #ccc; resize: none; margin-right: 5px; font-family: inherit; font-size: 14px; line-height: 1.4; max-height: 100px; overflow-y: auto; } #${SCRIPT_PREFIX}send_button { padding: 6px 12px; border: 1px solid #555; background-color: #4a90e2; color: white; border-radius: 4px; cursor: pointer; transition: background-color 0.2s ease; } #${SCRIPT_PREFIX}send_button:hover { background-color: #357abd; } `);}

    // --- Initialization ---
    function init() { console.log(`${SCRIPT_PREFIX}Initializing v${GM_info.script.version}...`); addStyles(); createUI(); findEditors(); setTimeout(findEditors, 1500); }
    if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(init, 500); } else { window.addEventListener('load', init); }

})();