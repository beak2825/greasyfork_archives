// ==UserScript==
// @name          Google Gemini Mod (Toolbar, Folders & Download)
// @namespace     http://tampermonkey.net/
// @version       0.0.11
// @description   Enhances Google Gemini with a configurable toolbar and sidebar folders to organize conversations.
// @description[de] Verbessert Google Gemini mit einer konfigurierbaren Symbolleiste und Ordnern in der Seitenleiste, um Konversationen zu organisieren.
// @author        Adromir
// @license       MIT
// @match         https://gemini.google.com/*
// @icon          data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQoJPGRlZnM+DQoJCTwhLS0gRGllIE1hc2tlLCBkaWUgZGFzIFBsdXN6ZWljaGVuIGRlZmluaWVydCAtLT4NCgkJPG1hc2sgaWQ9InBsdXMtbWFzayI+DQoJCQk8IS0tIERlciB3ZWnDn2UgQmVyZWljaCBkZXIgTWFza2UgbMOkc3N0IGRpZSBkYXJ1bnRlciBsaWVnZW5kZW4gRm9ybWVuIHNpY2h0YmFyIC0tPg0KCQkJPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIi8+DQoJCQk8IS0tIERhcyBzY2h3YXJ6ZSBQbHVzemVpY2hlbiB3aXJkIGF1cyBkZW4gRm9ybWVuIGF1c2dlc2Nobml0dGVuIChqZXR6dCBrbGVpbmVyKSAtLT4NCgkJCTxwYXRoIGQ9Ik00NSwzNSBMNTUsMzUgTDU1LDQ1IEw2NSw0NSBMNjUsNTUgTDU1LDU1IEw1NSw2NSBMNDUsNjUgTDQ1LDU1IEwzNSw1NSBMMzUsNDUgTDQ1LDQ1IFoiIGZpbGw9ImJsYWNrIi8+DQoJCTwvbWFzaz4NCg0KCQk8IS0tIEZhcmJ2ZXJsw6R1ZmUgLS0+DQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iYmx1ZUdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4NCgkJCTxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDUyRDQ7Ii8+DQoJCQk8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2RkIxRkM7Ii8+DQoJCTwvbGluZWFyR3JhZGllbnQ+DQoJCTxsaW5lYXJHcmFkaWVudCBpZD0ieWVsbG93R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KCQkJPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZEQzgzMDsiLz4NCgkJCTxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0YzNzMzNTsiLz4NCgkJPC9saW5lYXJHcmFkaWVudD4NCgkJPGxpbmVhckdyYWRpZW50IGlkPSJyZWRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjEwMCUiIHkyPSIwJSI+DQoJCQk8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjEyNzExOyIvPg0KCQkJPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjVhZjE5OyIvPg0KCQk8L2xpbmVhckdyYWRpZW50Pg0KCQk8bGluZWFyR3JhZGllbnQgaWQ9ImdyZWVuR3JhZGllbnQiIHgxPSIxMDAlIiB5MT0iMTAwJSIgeDI9IjAlIiB5Mj0iMCUiPg0KCQkJPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwOTI0NTsiLz4NCgkJCTxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhEQzYzRjsiLz4NCgkJPC9saW5lYXJHcmFkaWVudD4NCgk8L2RlZnM+DQoNCgk8IS0tIEVpbmUgR3J1cHBlIGbDvHIgZGllIGtvcnJla3RlbiBTdGVybmZvcm1lbiwgYXVmIGRpZSBkaWUgTWFza2UgYW5nZXdlbmRldCB3aXJkIC0tPg0KCTxnIG1hc2s9InVybCgjcGx1cy1tYXNrKSI+DQoJCTwhLS0gRGllIHZpZXIgUGZhZGUsIGRpZSBkaWUga29ycmVrdGUgU3Rlcm5mb3JtIGJpbGRlbiAtLT4NCgkJPHBhdGggZD0iTSA1MCAwIEMgNTAgMjUsIDI1IDUwLCAwIDUwIEwgNDUgNTAgTCA0NSA0NSBMIDUwIDQ1IEwgNTAgMCBaIiBmaWxsPSJ1cmwoI2JsdWVHcmFkaWVudCkiLz4NCgkJPHBhdGggZD0iTSA1MCAwIEMgNTAgMjUsIDc1IDUwLCAxMDAgNTAgTCA1NSA1MCBMIDU1IDQ1IEwgNTAgNDUgTCA1MCAwIFoiIGZpbGw9InVybCgjeWVsbG93R3JhZGllbnQpIi8+DQoJCTxwYXRoIGQ9Ik0gMTAwIDUwIEMgNzUgNTAsIDUwIDc1LCA1MCAxMDAgTCA1MCA1NSBMIDU1IDU1IEwgNTUgNTAgTCAxMDAgNTAgWiIgZmlsbD0idXJsKCNyZWRHcmFkaWVudCkiLz4NCgkJPHBhdGggZD0iTSAwIDUwIEMgMjUgNTAsIDUwIDc1LCA1MCAxMDAgTCA1MCA1NSBMIDQ1IDU1IEwgNDUgNTAgTCAwIDUwIFoiIGZpbGw9InVybCgjZ3JlZW5HcmFkaWVudCkiLz4NCgk8L2c+DQo8L3N2Zz4NCg==
// @homepageURL   https://github.com/adromir/scripts/tree/main/userscripts/gemini-snippets
// @supportURL    https://github.com/adromir/scripts/issues
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         unsafeWindow
// @require       https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/536192/Google%20Gemini%20Mod%20%28Toolbar%2C%20Folders%20%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536192/Google%20Gemini%20Mod%20%28Toolbar%2C%20Folders%20%20Download%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ===================================================================================
	// I. CONFIGURATION SECTION
	// ===================================================================================

	// --- Storage Keys ---
	const STORAGE_KEY_TOOLBAR_ITEMS = "geminiModToolbarItems_v2";
	const STORAGE_KEY_FOLDERS = 'gemini_folders';
	const STORAGE_KEY_CONVO_FOLDERS = 'gemini_convo_folders';

	// --- Toolbar UI Labels ---
	const SETTINGS_BUTTON_LABEL = "⚙️ Settings";

	// --- CSS Selectors ---
	const GEMINI_CODE_CANVAS_TITLE_SELECTOR = "code-immersive-panel h2.title-text";
	const GEMINI_CODE_CANVAS_PANEL_SELECTOR = 'code-immersive-panel';
	const GEMINI_CODE_CANVAS_SHARE_BUTTON_SELECTOR = "toolbar div.action-buttons share-button > button";
	const GEMINI_CODE_CANVAS_COPY_BUTTON_SELECTOR = "copy-button[data-test-id='copy-button'] > button.copy-button";
	const GEMINI_DOC_CANVAS_PANEL_SELECTOR = "immersive-panel";
	const GEMINI_DOC_CANVAS_EDITOR_SELECTOR = ".ProseMirror";
	const GEMINI_DOC_CANVAS_TITLE_SELECTOR = "h2.title-text";
	const GEMINI_INPUT_FIELD_SELECTORS = ['div[role="textbox"]', '.ql-editor p', '.ql-editor', 'div[contenteditable="true"]'];
	const FOLDER_CHAT_ITEM_SELECTOR = 'div[data-test-id="conversation"]';
	const FOLDER_CHAT_CONTAINER_SELECTOR = '.conversation-items-container';
	const FOLDER_CHAT_LIST_CONTAINER_SELECTOR = 'conversations-list .conversations-container';
	const FOLDER_INJECTION_POINT_SELECTOR = 'div.chat-history-list';


	// --- Download Feature Configuration ---
	const DEFAULT_DOWNLOAD_EXTENSION = "txt";

	// --- Filename Sanitization Regex ---
	// eslint-disable-next-line no-control-regex
	const INVALID_FILENAME_CHARS_REGEX = /[<>:"/\\|?*\x00-\x1F]/g;
	const RESERVED_WINDOWS_NAMES_REGEX = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
	const FILENAME_WITH_EXT_REGEX = /^(.+)\.([a-zA-Z0-9]{1,8})$/;

	// ===================================================================================
	// II. DEFAULT DEFINITIONS (Used if no custom config is saved)
	// ===================================================================================

	const defaultToolbarItems = [
		{ type: 'button', label: "Greeting", text: "Hello Gemini!" },
		{ type: 'button', label: "Explain", text: "Could you please explain ... in more detail?" },
		{
			type: 'dropdown',
			placeholder: "Actions...",
			options: [
				{ label: "Summarize", text: "Please summarize the following text:\n" },
				{ label: "Ideas", text: "Give me 5 ideas for ..." },
			]
		},
		{ type: 'action', action: 'paste', label: "📋 Paste", title: "Paste from Clipboard" },
		{ type: 'action', action: 'copy', label: "📄 Copy", title: "Copy active canvas content" },
		{ type: 'action', action: 'download', label: "💾 Download", title: "Download active canvas content" },
		{ type: 'action', action: 'pdf', label: "📑 PDF", title: "Export active canvas content as PDF" }
	];

	// ===================================================================================
	// III. SCRIPT LOGIC
	// ===================================================================================

	// --- Global State ---
	let toolbarItems = [];
	let folders = [];
	let conversationFolders = {};
	const FOLDER_COLORS = ['#370000', '#0D3800', '#001B38', '#383200', '#380031', '#7DAC89', '#7A82AF', '#AC7D98', '#7AA7AF', '#9CA881'];


	// --- Styles ---
	const embeddedCSS = `
		/* --- Toolbar Styles --- */
		#gemini-snippet-toolbar-userscript {
			position: fixed !important; top: 0 !important; left: 50% !important;
			transform: translateX(-50%) !important;
			width: auto !important; max-width: 80% !important;
			padding: 10px 15px !important; z-index: 999998 !important; /* Below settings panel */
			display: flex !important; flex-wrap: wrap !important;
			gap: 8px !important; align-items: center !important; font-family: 'Roboto', 'Arial', sans-serif !important;
			box-sizing: border-box !important; background-color: rgba(40, 42, 44, 0.95) !important;
			border-radius: 0 0 16px 16px !important;
			box-shadow: 0 4px 12px rgba(0,0,0,0.25);
		}
		#gemini-snippet-toolbar-userscript button,
		#gemini-snippet-toolbar-userscript select {
			padding: 4px 10px !important; cursor: pointer !important; background-color: #202122 !important;
			color: #e3e3e3 !important; border-radius: 16px !important; font-size: 13px !important;
			font-family: inherit !important; font-weight: 500 !important; height: 28px !important;
			box-sizing: border-box !important; vertical-align: middle !important;
			transition: background-color 0.2s ease, transform 0.1s ease !important;
			border: none !important; flex-shrink: 0;
		}
		#gemini-snippet-toolbar-userscript select {
			padding-right: 25px !important; appearance: none !important;
			background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23e3e3e3" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>') !important;
			background-repeat: no-repeat !important; background-position: right 8px center !important; background-size: 12px 12px !important;
		}
		#gemini-snippet-toolbar-userscript option {
			background-color: #2a2a2a !important; color: #e3e3e3 !important;
			font-weight: normal !important; padding: 5px 10px !important;
		}
		#gemini-snippet-toolbar-userscript button:hover,
		#gemini-snippet-toolbar-userscript select:hover { background-color: #4a4e51 !important; }
		#gemini-snippet-toolbar-userscript button:active { background-color: #5f6368 !important; transform: scale(0.98) !important; }
		.userscript-toolbar-spacer { margin-left: auto !important; }

		/* --- Settings Panel & Modal Styles --- */
		#gemini-mod-settings-overlay, #gemini-mod-type-modal-overlay {
			display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
			background-color: rgba(0,0,0,0.6); z-index: 999999;
		}
		#gemini-mod-settings-panel, #gemini-mod-type-modal {
			position: fixed; top: 50%; left: 50%;
			transform: translate(-50%, -50%);
			background-color: #282a2c; color: #e3e3e3; border-radius: 16px;
			padding: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
			font-family: 'Roboto', 'Arial', sans-serif !important;
		}
		#gemini-mod-settings-panel {
			width: 90vw; max-width: 800px; max-height: 80vh; overflow-y: auto;
		}
		#gemini-mod-type-modal {
		    text-align: center;
		}
		#gemini-mod-type-modal h3 { margin-top: 0; }
		#gemini-mod-type-modal button { margin: 0 10px; }
		#gemini-mod-settings-panel h2 { margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 10px; }
        #gemini-mod-settings-panel h3 { margin-top: 20px; border-bottom: 1px solid #444; padding-bottom: 8px; }
		#gemini-mod-settings-panel label { display: block; margin: 10px 0 5px; font-weight: 500; }
		#gemini-mod-settings-panel input[type="text"], #gemini-mod-settings-panel textarea {
			width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #5f6368;
			background-color: #202122; color: #e3e3e3; box-sizing: border-box;
		}
		#gemini-mod-settings-panel textarea { min-height: 80px; resize: vertical; }
		#gemini-mod-settings-panel .item-group {
			border: 1px solid #444; border-radius: 8px; padding: 15px; margin-bottom: 10px;
			display: flex; gap: 10px; align-items: flex-start;
            cursor: grab;
		}
		#gemini-mod-settings-panel .item-content { flex-grow: 1; }
		#gemini-mod-settings-panel .dropdown-options-container { margin-left: 20px; margin-top: 10px; }
		#gemini-mod-settings-panel .option-item { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; margin-bottom: 5px; }
		#gemini-mod-settings-panel button {
			 padding: 4px 10px !important; cursor: pointer !important; background-color: #3c4043 !important;
			 color: #e3e3e3 !important; border-radius: 16px !important; font-size: 13px !important;
			 border: none !important; transition: background-color 0.2s ease;
		}
		#gemini-mod-settings-panel button:hover { background-color: #4a4e51 !important; }
		#gemini-mod-settings-panel .remove-btn, .dialog-btn-delete { background-color: #5c2b2b !important; color: white !important; }
		#gemini-mod-settings-panel .remove-btn:hover, .dialog-btn-delete:hover { background-color: #7d3a3a !important; }
		#gemini-mod-settings-panel .settings-actions {
			margin-top: 20px; display: flex; justify-content: flex-end; gap: 8px;
		}

		/* --- Folder UI Styles --- */
		#folder-ui-container { padding: 0 8px; }
		#folder-container { padding-bottom: 8px; border-bottom: 1px solid var(--surface-3); }
		.folder { margin-bottom: 5px; border-radius: 8px; overflow: hidden; }
		.folder-header { display: flex; align-items: center; padding: 10px; cursor: pointer; background-color: var(--surface-2); position: relative; }
		.folder-header:hover { background-color: var(--surface-3); }
		
        /* Folder Icon Styles */
        .folder-icon-wrapper { margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
        .folder-icon { width: 20px; height: 20px; transition: transform 0.2s ease; }
        .folder.closed .icon-open { display: none; }
        .folder:not(.closed) .icon-closed { display: none; }
        
		.folder-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Roboto', Arial, sans-serif !important; font-weight: 500; }
		.folder-controls { display: flex; align-items: center; margin-left: 5px; }
		.folder-toggle-icon { transition: transform 0.2s; margin-right: 5px; font-size: 0.8em; opacity: 0.7; }
		.folder.closed .folder-toggle-icon { transform: rotate(-90deg); }
		.folder-options-btn { background: none; border: none; color: inherit; cursor: pointer; padding: 2px 4px; border-radius: 4px; margin-left: 4px; font-size: 1.2em; line-height: 1; }
		.folder-options-btn:hover { background-color: rgba(255,255,255,0.1); }
		
        /* List View Styles for Content */
		.folder-content { 
            max-height: 500px; 
            overflow-y: auto; 
            transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out; 
            background-color: transparent; /* Transparent to let items stand out */
            min-height: 10px; 
            display: flex;
            flex-direction: column;
            gap: 4px; /* Gap between items */
            padding: 4px 0;
        }
		.folder.closed .folder-content { max-height: 0; padding-top: 0; padding-bottom: 0; min-height: 0; overflow: hidden; }
        
        /* Style the conversation items within the folder to look like list items */
        .folder-content .conversation-items-container {
            background-color: var(--surface-1);
            border-radius: 6px;
            margin: 0 4px;
            padding: 2px 0;
            border: 1px solid var(--surface-4);
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
        }
        .folder-content .conversation-items-container::before {
            content: "•";
            margin: 0 6px 0 10px;
            color: var(--on-surface);
            font-size: 1.2em;
            line-height: 1;
        }
        .folder-content .conversation-items-container:hover {
            background-color: var(--surface-2);
            border-color: var(--surface-5);
        }

		#add-folder-btn { width: 100%; margin: 8px 0; padding: 10px; border: none; background-color: var(--primary-surface); color: var(--on-primary-surface); border-radius: 8px; cursor: pointer; font-weight: 500; }
		#add-folder-btn:hover { opacity: 0.9; }
		.conversation-items-container { cursor: grab; }
		.folder-context-menu { position: absolute; z-index: 10000; background-color: #333333; border: 1px solid var(--surface-4); border-radius: 8px; padding: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); display: none; }
		.folder-context-menu-item { padding: 8px 12px; cursor: pointer; border-radius: 4px; white-space: nowrap; font-family: 'Roboto', Arial, sans-serif !important; color: #FFFFFF; }
		.folder-context-menu-item:hover { background-color: var(--surface-4); }
		.folder-context-menu-item.delete { color: #DB4437; }
        .sortable-ghost { opacity: 0.4; background: var(--primary-surface-hover); }
        .item-group.sortable-ghost { background-color: #555 !important; }


		/* --- Dialog & Color Picker Styles --- */
		.custom-dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(34, 34, 34, 0.75); z-index: 1000000; display: flex; align-items: center; justify-content: center; }
		.custom-dialog-box { background-color: #333333; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; max-width: 400px; border: 1px solid var(--surface-4); }
		.custom-dialog-box p, .custom-dialog-box h2 { margin: 0 0 20px; font-family: 'Roboto', Arial, sans-serif; color: #FFFFFF; }
		.custom-dialog-btn { border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer; font-weight: 500; margin: 0 10px; }
		.dialog-btn-confirm { background-color: #8ab4f8; color: #202124; }
		.dialog-btn-cancel { background-color: var(--surface-4); color: var(--on-surface); }
		.custom-dialog-input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--surface-4); background-color: var(--surface-1); color: var(--on-surface); font-size: 16px; margin-bottom: 20px; }
		.color-picker-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
		.color-picker-dialog .color-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; position: relative; }
		.color-picker-dialog .color-swatch:hover { border: 2px solid var(--on-primary-surface); }
		.color-picker-dialog .color-swatch.selected::after { content: ""; position: absolute; inset: 0; border: 3px solid #fff; border-radius: 50%; box-sizing: border-box; pointer-events: none; }
	`;

	// --- Core Functions ---

	function injectCustomCSS() {
		try {
			GM_addStyle(embeddedCSS);
		} catch (error) {
			console.error("Gemini Mod Userscript: Failed to inject custom CSS:", error);
			const style = document.createElement('style');
			style.textContent = embeddedCSS;
			document.head.appendChild(style);
		}
	}

	function displayUserscriptMessage(message, isError = true) {
		const prefix = "Gemini Mod Userscript: ";
		if (isError) console.error(prefix + message);
		else console.log(prefix + message);
		alert(prefix + message);
	}

	function clearElement(element) {
		if (element) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
	}

	// --- Text Insertion Logic ---

	function findTargetInputElement() {
		for (const selector of GEMINI_INPUT_FIELD_SELECTORS) {
			const element = document.querySelector(selector);
			if (element) {
				return element.classList.contains('ql-editor') ? (element.querySelector('p') || element) : element;
			}
		}
		return null;
	}

	function insertSnippetText(textToInsert) {
		const target = findTargetInputElement();
		if (!target) {
			displayUserscriptMessage("Could not find Gemini input field.");
			return;
		}
		target.focus();

		// Force cursor to the end if no valid selection exists within the target
		const selection = window.getSelection();
		if (selection.rangeCount === 0 || !target.contains(selection.anchorNode)) {
			const range = document.createRange();
			range.selectNodeContents(target);
			range.collapse(false); // Collapse to end
			selection.removeAllRanges();
			selection.addRange(range);
		}

		setTimeout(() => {
			try {
				document.execCommand('insertText', false, textToInsert);
			} catch (e) {
				console.warn("Gemini Mod: execCommand failed, falling back to textContent.", e);
				target.textContent += textToInsert;
			}
			target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
		}, 50);
	}


	// --- Configuration Management ---

	async function loadConfiguration() {
		try {
			// Toolbar items
			const savedToolbarItems = await GM_getValue(STORAGE_KEY_TOOLBAR_ITEMS);
			if (savedToolbarItems) {
				toolbarItems = JSON.parse(savedToolbarItems);
				// Migration: Check if actions are missing and append them if so (for existing users)
				const hasAction = (act) => toolbarItems.some(item => item.type === 'action' && item.action === act);
				if (!hasAction('paste')) toolbarItems.push({ type: 'action', action: 'paste', label: "📋 Paste", title: "Paste from Clipboard" });
				if (!hasAction('copy')) toolbarItems.push({ type: 'action', action: 'copy', label: "📄 Copy", title: "Copy active canvas content" });
				if (!hasAction('download')) toolbarItems.push({ type: 'action', action: 'download', label: "💾 Download", title: "Download active canvas content" });
				if (!hasAction('pdf')) toolbarItems.push({ type: 'action', action: 'pdf', label: "📑 PDF", title: "Export active canvas content as PDF" });
			} else {
				toolbarItems = defaultToolbarItems;
			}
			// Folder items
			folders = await GM_getValue(STORAGE_KEY_FOLDERS, []);
			conversationFolders = await GM_getValue(STORAGE_KEY_CONVO_FOLDERS, {});
		} catch (e) {
			console.error("Gemini Mod: Error loading configuration, using defaults.", e);
			toolbarItems = defaultToolbarItems;
			folders = [];
			conversationFolders = {};
		}
	}

	async function saveToolbarConfiguration() {
		const settingsPanel = document.getElementById('gemini-mod-settings-panel');
		if (!settingsPanel) return;

		const newItems = [];
		settingsPanel.querySelectorAll('#toolbar-items-container > .item-group').forEach(group => {
			const type = group.dataset.type;
			const visible = group.querySelector('.visible-checkbox').checked;

			if (type === 'button') {
				const label = group.querySelector('.label-input').value.trim();
				const text = group.querySelector('.text-input').value;
				if (label) newItems.push({ type, label, text, visible });
			} else if (type === 'dropdown') {
				const placeholder = group.querySelector('.placeholder-input').value.trim();
				const options = [];
				group.querySelectorAll('.option-item').forEach(opt => {
					const label = opt.querySelector('.label-input').value.trim();
					const text = opt.querySelector('.text-input').value;
					if (label) options.push({ label, text });
				});
				if (placeholder && options.length > 0) {
					newItems.push({ type, placeholder, options, visible });
				}
			} else if (type === 'action') {
				const action = group.dataset.action;
				const label = group.querySelector('.label-input').value.trim();
				const title = group.dataset.title;
				if (label) newItems.push({ type, action, label, title, visible });
			}
		});

		try {
			await GM_setValue(STORAGE_KEY_TOOLBAR_ITEMS, JSON.stringify(newItems));
			await loadConfiguration(); // Reload all configs
			rebuildToolbar();
			toggleSettingsPanel(false);
		} catch (e) {
			displayUserscriptMessage("Failed to save settings. See console for details.");
			console.error("Gemini Mod: Error saving settings:", e);
		}
	}

	async function saveFolderConfiguration() {
		await GM_setValue(STORAGE_KEY_FOLDERS, folders);
		await GM_setValue(STORAGE_KEY_CONVO_FOLDERS, conversationFolders);
	}


	// --- Toolbar Creation ---

	function createToolbar() {
		const toolbarId = 'gemini-snippet-toolbar-userscript';
		let toolbar = document.getElementById(toolbarId);
		if (toolbar) {
			clearElement(toolbar);
		} else {
			toolbar = document.createElement('div');
			toolbar.id = toolbarId;
			document.body.insertBefore(toolbar, document.body.firstChild);
		}

		toolbarItems.forEach(item => {
			if (item.visible === false) return; // Skip hidden items

			if (item.type === 'button') {
				const button = document.createElement('button');
				button.textContent = item.label;
				button.title = item.text;
				button.addEventListener('click', () => insertSnippetText(item.text));
				toolbar.appendChild(button);
			} else if (item.type === 'dropdown') {
				const select = document.createElement('select');
				select.title = item.placeholder;
				const defaultOption = new Option(item.placeholder, "", true, true);
				defaultOption.disabled = true;
				select.appendChild(defaultOption);
				item.options.forEach(opt => select.appendChild(new Option(opt.label, opt.text)));
				select.addEventListener('change', (e) => {
					if (e.target.value) {
						insertSnippetText(e.target.value);
						e.target.selectedIndex = 0;
					}
				});
				toolbar.appendChild(select);
			} else if (item.type === 'action') {
				const button = document.createElement('button');
				button.textContent = item.label;
				button.title = item.title;
				if (item.action === 'paste') {
					button.addEventListener('click', async () => {
						try {
							const text = await navigator.clipboard.readText();
							if (text) insertSnippetText(text);
						} catch (err) {
							displayUserscriptMessage('Failed to read clipboard: ' + err.message);
						}
					});
				} else if (item.action === 'download') {
					button.addEventListener('click', handleGlobalCanvasDownload);
				} else if (item.action === 'pdf') {
					button.addEventListener('click', handlePDFExport);
				} else if (item.action === 'copy') {
					button.addEventListener('click', handleCopy);
				}
				toolbar.appendChild(button);
			}
		});

		const spacer = document.createElement('div');
		spacer.className = 'userscript-toolbar-spacer';
		toolbar.appendChild(spacer);

		const settingsButton = document.createElement('button');
		settingsButton.textContent = SETTINGS_BUTTON_LABEL;
		settingsButton.title = "Open Userscript Settings";
		settingsButton.addEventListener('click', () => toggleSettingsPanel());
		toolbar.appendChild(settingsButton);
	}

	function rebuildToolbar() {
		const toolbar = document.getElementById('gemini-snippet-toolbar-userscript');
		if (toolbar) createToolbar();
	}


	// --- Folder UI and Logic ---

	function getIdentifierFromElement(el) {
		if (!el) return null;
		if (el.matches(FOLDER_CHAT_CONTAINER_SELECTOR)) {
			el = el.querySelector(FOLDER_CHAT_ITEM_SELECTOR) || el;
		}
		const anchor = el.closest('a');
		if (anchor) {
			const href = anchor.getAttribute('href') || '';
			const m = href.match(/\/conversation\/([A-Za-z0-9_-]+)/);
			if (m) return m[1];
		}
		const jslog = el.getAttribute('jslog') || '';
		let m = jslog.match(/"c_([A-Za-z0-9_-]+)"/);
		if (!m) m = jslog.match(/c_([A-Za-z0-9_-]+)/);
		if (m) return m[1];
		const t = el.querySelector('.conversation-title');
		if (t) return `title:${t.textContent.trim()}`;
		console.warn('[Gemini Folders] Could not find ID for element:', el);
		return null;
	}

	function renderFolders() {
		const container = document.getElementById('folder-container');
		if (!container) return;

		// Move all conversation items back to the main list before clearing folders
		// This prevents them from being deleted from the DOM
		const chatListContainer = document.querySelector(FOLDER_CHAT_LIST_CONTAINER_SELECTOR);
		if (chatListContainer) {
			container.querySelectorAll(FOLDER_CHAT_CONTAINER_SELECTOR).forEach(item => {
				chatListContainer.appendChild(item);
			});
		}

		clearElement(container);

		folders.forEach(folder => {
			const folderEl = document.createElement('div');
			folderEl.className = 'folder';
			folderEl.dataset.folderId = folder.id;
			if (folder.isClosed) folderEl.classList.add('closed');

			const headerEl = document.createElement('div');
			headerEl.className = 'folder-header';
			headerEl.addEventListener('click', (e) => {
				if (!e.target.closest('.folder-options-btn')) toggleFolder(folder.id);
			});

			// Icon Wrapper
			const iconWrapper = document.createElement('div');
			iconWrapper.className = 'folder-icon-wrapper';

			// SVG for Closed Folder
			const iconClosed = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			iconClosed.setAttribute("viewBox", "0 0 24 24");
			iconClosed.setAttribute("class", "folder-icon icon-closed");
			iconClosed.innerHTML = `<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="${folder.color}"/>`;

			// SVG for Open Folder
			const iconOpen = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			iconOpen.setAttribute("viewBox", "0 0 24 24");
			iconOpen.setAttribute("class", "folder-icon icon-open");
			iconOpen.innerHTML = `<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="${folder.color}"/>`;

			iconWrapper.appendChild(iconClosed);
			iconWrapper.appendChild(iconOpen);

			const nameEl = document.createElement('span');
			nameEl.className = 'folder-name';
			nameEl.textContent = folder.name;

			const controlsEl = document.createElement('div');
			controlsEl.className = 'folder-controls';

			const toggleIcon = document.createElement('span');
			toggleIcon.className = 'folder-toggle-icon';
			toggleIcon.textContent = '▼';

			const optionsBtn = document.createElement('button');
			optionsBtn.className = 'folder-options-btn';
			optionsBtn.textContent = '⋮';
			optionsBtn.addEventListener('click', (e) => showContextMenu(e, folder.id));

			controlsEl.appendChild(toggleIcon);
			controlsEl.appendChild(optionsBtn);

			headerEl.appendChild(iconWrapper);
			headerEl.appendChild(nameEl);
			headerEl.appendChild(controlsEl);

			const contentEl = document.createElement('div');
			contentEl.className = 'folder-content';

			folderEl.appendChild(headerEl);
			folderEl.appendChild(contentEl);
			container.appendChild(folderEl);
		});

		organizeConversations();
		setupDragAndDrop();
	}

	function organizeConversations() {
		const chatListContainer = document.querySelector(FOLDER_CHAT_LIST_CONTAINER_SELECTOR);
		if (!chatListContainer) return;

		const folderIds = new Set(folders.map(f => f.id));
		let dataWasCorrected = false;

		document.querySelectorAll('.folder-content ' + FOLDER_CHAT_CONTAINER_SELECTOR).forEach(item => {
			const convoEl = item.querySelector(FOLDER_CHAT_ITEM_SELECTOR);
			const identifier = getIdentifierFromElement(convoEl);
			if (!identifier || !conversationFolders[identifier] || !folderIds.has(conversationFolders[identifier])) {
				chatListContainer.appendChild(item);
			}
		});

		Array.from(chatListContainer.children).forEach(itemToMove => {
			const convoEl = itemToMove.querySelector(FOLDER_CHAT_ITEM_SELECTOR);
			const identifier = getIdentifierFromElement(convoEl);
			if (!identifier) return;

			let folderId = conversationFolders[identifier];

			if (folderId && !folderIds.has(folderId)) {
				delete conversationFolders[identifier];
				folderId = null;
				dataWasCorrected = true;
			}

			if (folderId) {
				const folderContent = document.querySelector(`.folder[data-folder-id="${folderId}"] .folder-content`);
				if (folderContent && !folderContent.contains(itemToMove)) {
					folderContent.appendChild(itemToMove);
				}
			}
		});

		if (dataWasCorrected) saveFolderConfiguration();
	}

	function createNewFolder() {
		showCustomPromptDialog("Enter New Folder Name", "", "Create", (name) => {
			if (name) {
				const newFolder = { id: `folder_${Date.now()}`, name, color: '#808080', isClosed: false };
				folders.push(newFolder);
				saveFolderConfiguration().then(renderFolders);
			}
		});
	}

	function updateFolderHeader(folderId) {
		const folder = folders.find(f => f.id === folderId);
		const folderEl = document.querySelector(`.folder[data-folder-id="${folderId}"]`);
		if (!folder || !folderEl) return;
		folderEl.querySelector('.folder-name').textContent = folder.name;
		// Update icon colors
		folderEl.querySelectorAll('.folder-icon path').forEach(path => {
			path.setAttribute('fill', folder.color);
		});
	}

	function renameFolder(folderId) {
		const folder = folders.find(f => f.id === folderId);
		if (!folder) return;
		showCustomPromptDialog("Rename Folder", folder.name, "Save", (newName) => {
			if (newName && newName !== folder.name) {
				folder.name = newName;
				saveFolderConfiguration().then(() => updateFolderHeader(folderId));
			}
		});
	}

	async function deleteFolder(folderId) {
		Object.keys(conversationFolders).forEach(id => {
			if (conversationFolders[id] === folderId) delete conversationFolders[id];
		});
		folders = folders.filter(f => f.id !== folderId);
		await saveFolderConfiguration();
		renderFolders();
	}

	function toggleFolder(folderId) {
		const folder = folders.find(f => f.id === folderId);
		if (folder) {
			folder.isClosed = !folder.isClosed;
			const folderEl = document.querySelector(`.folder[data-folder-id="${folderId}"]`);
			if (folderEl) folderEl.classList.toggle('closed');
			saveFolderConfiguration();
		}
	}

	// --- Context Menus & Dialogs ---

	function showContextMenu(event, folderId) {
		event.preventDefault();
		event.stopPropagation();
		closeContextMenu();

		const btn = event.currentTarget;
		const rect = btn.getBoundingClientRect();

		const menu = document.createElement('div');
		menu.className = 'folder-context-menu';
		menu.id = 'folder-context-menu-active';

		const items = {
			'Rename': () => renameFolder(folderId),
			'Change Color': () => showColorPickerDialog(folderId),
			'Delete Folder': () => showConfirmationDialog("Are you sure you want to delete this folder?", () => deleteFolder(folderId), "Delete", "dialog-btn-delete")
		};

		for (const [text, action] of Object.entries(items)) {
			const itemEl = document.createElement('div');
			itemEl.className = 'folder-context-menu-item';
			if (text === 'Delete Folder') itemEl.classList.add('delete');
			itemEl.textContent = text;
			itemEl.onclick = (e) => {
				e.stopPropagation();
				closeContextMenu();
				action(e);
			};
			menu.appendChild(itemEl);
		}

		document.body.appendChild(menu);
		menu.style.display = 'block';
		menu.style.top = `${rect.bottom + window.scrollY}px`;
		menu.style.left = `${rect.right + window.scrollX - menu.offsetWidth}px`;
		setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
	}

	function closeContextMenu() {
		const menu = document.getElementById('folder-context-menu-active');
		if (menu) menu.remove();
	}

	function showColorPickerDialog(folderId) {
		const folder = folders.find(f => f.id === folderId);
		if (!folder) return;

		const overlay = document.createElement('div');
		overlay.className = 'custom-dialog-overlay';
		const dialogBox = document.createElement('div');
		dialogBox.className = 'custom-dialog-box color-picker-dialog';
		const titleH2 = document.createElement('h2');
		titleH2.textContent = 'Change Folder Color';
		const grid = document.createElement('div');
		grid.className = 'color-picker-grid';

		let selectedColor = folder.color;

		FOLDER_COLORS.forEach(color => {
			const swatch = document.createElement('div');
			swatch.className = 'color-swatch';
			if (color.toLowerCase() === selectedColor.toLowerCase()) swatch.classList.add('selected');
			swatch.style.backgroundColor = color;
			swatch.onclick = () => {
				selectedColor = color;
				hexInput.value = color;
				grid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
				swatch.classList.add('selected');
			};
			grid.appendChild(swatch);
		});

		const hexInput = document.createElement('input');
		hexInput.className = 'custom-dialog-input';
		hexInput.type = 'text';
		hexInput.placeholder = 'Or enter a hex value, e.g. #C0FFEE';
		hexInput.value = selectedColor;

		const btnYes = document.createElement('button');
		btnYes.className = 'custom-dialog-btn dialog-btn-confirm';
		btnYes.textContent = 'Save';
		const btnNo = document.createElement('button');
		btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
		btnNo.textContent = 'Cancel';

		const btnReset = document.createElement('button');
		btnReset.className = 'custom-dialog-btn';
		btnReset.style.backgroundColor = '#5f6368';
		btnReset.style.color = '#ffffff';
		btnReset.textContent = 'Reset';

		dialogBox.appendChild(titleH2);
		dialogBox.appendChild(grid);
		dialogBox.appendChild(hexInput);

		const buttonContainer = document.createElement('div');
		buttonContainer.style.display = 'flex';
		buttonContainer.style.justifyContent = 'center';
		buttonContainer.style.marginTop = '20px';

		buttonContainer.appendChild(btnYes);
		buttonContainer.appendChild(btnNo);
		buttonContainer.appendChild(btnReset);

		dialogBox.appendChild(buttonContainer);

		overlay.appendChild(dialogBox);
		document.body.appendChild(overlay);

		btnYes.onclick = () => {
			const newColor = hexInput.value.trim();
			if (/^#[0-9A-F]{6}$/i.test(newColor)) {
				folder.color = newColor;
				saveFolderConfiguration().then(() => updateFolderHeader(folderId));
				overlay.remove();
			} else {
				hexInput.style.border = "1px solid red";
				hexInput.value = "Invalid Hex Code";
				setTimeout(() => {
					hexInput.style.border = "";
					hexInput.value = selectedColor;
				}, 2000);
			}
		};
		btnNo.onclick = () => { overlay.remove(); };
		btnReset.onclick = () => {
			selectedColor = '#808080';
			hexInput.value = selectedColor;
			grid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
		};
	}

	function showConfirmationDialog(message, onConfirm, confirmText = "Confirm", confirmClass = "dialog-btn-confirm") {
		const overlay = document.createElement('div');
		overlay.className = 'custom-dialog-overlay';
		const dialogBox = document.createElement('div');
		dialogBox.className = 'custom-dialog-box';
		const messageP = document.createElement('p');
		messageP.textContent = message;
		const btnYes = document.createElement('button');
		btnYes.className = `custom-dialog-btn ${confirmClass}`;
		btnYes.textContent = confirmText;
		const btnNo = document.createElement('button');
		btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
		btnNo.textContent = 'Cancel';
		dialogBox.appendChild(messageP);
		dialogBox.appendChild(btnYes);
		dialogBox.appendChild(btnNo);
		overlay.appendChild(dialogBox);
		document.body.appendChild(overlay);
		btnYes.onclick = () => { onConfirm(); overlay.remove(); };
		btnNo.onclick = () => { overlay.remove(); };
	}

	function showCustomPromptDialog(title, defaultValue, confirmText, onConfirm) {
		const overlay = document.createElement('div');
		overlay.className = 'custom-dialog-overlay';
		const dialogBox = document.createElement('div');
		dialogBox.className = 'custom-dialog-box';
		const titleH2 = document.createElement('h2');
		titleH2.textContent = title;
		const input = document.createElement('input');
		input.className = 'custom-dialog-input';
		input.type = 'text';
		input.value = defaultValue;
		const btnYes = document.createElement('button');
		btnYes.className = 'custom-dialog-btn dialog-btn-confirm';
		btnYes.textContent = confirmText;
		const btnNo = document.createElement('button');
		btnNo.className = 'custom-dialog-btn dialog-btn-cancel';
		btnNo.textContent = 'Cancel';
		dialogBox.appendChild(titleH2);
		dialogBox.appendChild(input);
		dialogBox.appendChild(btnYes);
		dialogBox.appendChild(btnNo);
		overlay.appendChild(dialogBox);
		document.body.appendChild(overlay);
		input.focus();
		input.select();
		btnYes.onclick = () => { onConfirm(input.value); overlay.remove(); };
		btnNo.onclick = () => { overlay.remove(); };
		input.onkeydown = (e) => { if (e.key === 'Enter') btnYes.click(); };
	}

	// --- Drag and Drop ---
	function setupDragAndDrop() {
		// For conversation folders
		const chatListContainer = document.querySelector(FOLDER_CHAT_LIST_CONTAINER_SELECTOR);
		if (chatListContainer) {
			new Sortable(chatListContainer, {
				group: 'shared',
				animation: 150,
				onEnd: rebuildAndSaveState,
			});
		}

		document.querySelectorAll('.folder-content').forEach(folderContentEl => {
			new Sortable(folderContentEl, {
				group: 'shared',
				animation: 150,
				onEnd: rebuildAndSaveState,
			});
		});

		// For toolbar items in settings
		const toolbarItemsContainer = document.getElementById('toolbar-items-container');
		if (toolbarItemsContainer) {
			new Sortable(toolbarItemsContainer, {
				animation: 150,
				ghostClass: 'sortable-ghost',
				// No onEnd needed as saving is manual via the "Save" button
			});
		}
	}

	function rebuildAndSaveState() {
		const newConversationFolders = {};
		document.querySelectorAll('.folder').forEach(folderEl => {
			const folderId = folderEl.dataset.folderId;
			folderEl.querySelectorAll(FOLDER_CHAT_CONTAINER_SELECTOR).forEach(item => {
				const id = getIdentifierFromElement(item.querySelector(FOLDER_CHAT_ITEM_SELECTOR));
				if (id) {
					newConversationFolders[id] = folderId;
				}
			});
		});
		conversationFolders = newConversationFolders;
		saveFolderConfiguration();
	}

	function initializeFolders() {
		const injectionPoint = document.querySelector(FOLDER_INJECTION_POINT_SELECTOR);
		if (!injectionPoint) return false;

		if (document.getElementById('folder-ui-container')) {
			organizeConversations();
			return true;
		}

		const uiContainer = document.createElement('div');
		uiContainer.id = 'folder-ui-container';
		const addButton = document.createElement('button');
		addButton.id = 'add-folder-btn';
		addButton.textContent = '＋ New Folder';
		addButton.onclick = createNewFolder;
		const folderContainer = document.createElement('div');
		folderContainer.id = 'folder-container';
		uiContainer.appendChild(addButton);
		uiContainer.appendChild(folderContainer);
		injectionPoint.prepend(uiContainer);
		renderFolders();
		return true;
	}


	// --- Settings Panel UI ---
	function createSettingsPanel() {
		if (document.getElementById('gemini-mod-settings-overlay')) return;

		const overlay = document.createElement('div');
		overlay.id = 'gemini-mod-settings-overlay';

		const panel = document.createElement('div');
		panel.id = 'gemini-mod-settings-panel';
		overlay.appendChild(panel);

		panel.appendChild(document.createElement('h2')).textContent = 'Gemini Mod Settings';

		// Toolbar Section
		panel.appendChild(document.createElement('h3')).textContent = 'Toolbar Items';
		const dragDropHint = document.createElement('p');
		dragDropHint.textContent = 'The order of the items can be changed via Drag & Drop.';
		dragDropHint.style.fontSize = '12px';
		dragDropHint.style.color = '#aaa';
		dragDropHint.style.margin = '-5px 0 10px 0';
		panel.appendChild(dragDropHint);

		const itemsContainer = document.createElement('div');
		itemsContainer.id = 'toolbar-items-container';
		panel.appendChild(itemsContainer);

		const addItemBtn = document.createElement('button');
		addItemBtn.textContent = 'Add Toolbar Item';
		addItemBtn.addEventListener('click', showToolbarItemTypeModal);
		panel.appendChild(addItemBtn);

		// Folder Section
		panel.appendChild(document.createElement('h3')).textContent = 'Reset Settings';

		const resetContainer = document.createElement('div');
		resetContainer.style.display = 'flex';
		resetContainer.style.gap = '10px';
		resetContainer.style.flexWrap = 'wrap';

		const resetFoldersBtn = document.createElement('button');
		resetFoldersBtn.textContent = 'Reset Folders';
		resetFoldersBtn.className = 'remove-btn';
		resetFoldersBtn.addEventListener('click', () => {
			showConfirmationDialog('Are you sure you want to delete all folder data? This cannot be undone.', async () => {
				await GM_deleteValue(STORAGE_KEY_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_CONVO_FOLDERS);
				location.reload();
			}, 'Reset', 'dialog-btn-delete');
		});

		const resetEverythingBtn = document.createElement('button');
		resetEverythingBtn.textContent = 'Reset Everything';
		resetEverythingBtn.className = 'remove-btn';
		resetEverythingBtn.addEventListener('click', () => {
			showConfirmationDialog('Are you sure you want to delete ALL data (Folders, Toolbar, Settings)? This cannot be undone.', async () => {
				await GM_deleteValue(STORAGE_KEY_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_CONVO_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_TOOLBAR_ITEMS);
				location.reload();
			}, 'Reset Everything', 'dialog-btn-delete');
		});

		resetContainer.appendChild(resetFoldersBtn);
		resetContainer.appendChild(resetEverythingBtn);
		panel.appendChild(resetContainer);


		const actionsDiv = document.createElement('div');
		actionsDiv.className = 'settings-actions';
		const saveBtn = document.createElement('button');
		saveBtn.textContent = 'Save & Close';
		saveBtn.addEventListener('click', saveToolbarConfiguration);
		actionsDiv.appendChild(saveBtn);

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = 'Cancel';
		cancelBtn.addEventListener('click', () => toggleSettingsPanel(false));
		actionsDiv.appendChild(cancelBtn);
		panel.appendChild(actionsDiv);

		document.body.appendChild(overlay);
	}

	function showToolbarItemTypeModal() {
		let modal = document.getElementById('gemini-mod-type-modal-overlay');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = 'gemini-mod-type-modal-overlay';
			const modalContent = document.createElement('div');
			modalContent.id = 'gemini-mod-type-modal';
			const h3 = document.createElement('h3');
			h3.textContent = 'Select Toolbar Item Type';
			modalContent.appendChild(h3);

			const btnButton = document.createElement('button');
			btnButton.textContent = 'Button';
			btnButton.addEventListener('click', () => {
				addItemToPanel({ type: 'button' });
				modal.style.display = 'none';
			});

			const btnDropdown = document.createElement('button');
			btnDropdown.textContent = 'Dropdown';
			btnDropdown.addEventListener('click', () => {
				addItemToPanel({ type: 'dropdown' });
				modal.style.display = 'none';
			});

			const btnAction = document.createElement('button');
			btnAction.textContent = 'Predefined Action';
			btnAction.addEventListener('click', () => {
				showActionSelectionModal();
				modal.style.display = 'none';
			});

			modalContent.appendChild(btnButton);
			modalContent.appendChild(btnDropdown);
			modalContent.appendChild(btnAction);
			modal.appendChild(modalContent);
			document.body.appendChild(modal);
		}
		modal.style.display = 'block';
	}

	function showActionSelectionModal() {
		const actions = [
			{ action: 'paste', label: "📋 Paste", title: "Paste from Clipboard" },
			{ action: 'copy', label: "📄 Copy", title: "Copy active canvas content" },
			{ action: 'download', label: "💾 Download", title: "Download active canvas content" },
			{ action: 'pdf', label: "📑 PDF", title: "Export active canvas content as PDF" }
		];

		// Simple prompt or small modal to pick action
		// For simplicity, let's reuse the modal structure or create a quick one
		let modal = document.getElementById('gemini-mod-action-modal-overlay');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = 'gemini-mod-action-modal-overlay';
			modal.className = 'custom-dialog-overlay'; // Reuse class

			const modalContent = document.createElement('div');
			modalContent.className = 'custom-dialog-box';

			const h3 = document.createElement('h3');
			h3.textContent = 'Select Action';
			modalContent.appendChild(h3);

			actions.forEach(act => {
				const btn = document.createElement('button');
				btn.className = 'custom-dialog-btn';
				btn.textContent = act.label;
				btn.style.margin = '5px';
				btn.addEventListener('click', () => {
					addItemToPanel({ type: 'action', ...act });
					modal.style.display = 'none';
				});
				modalContent.appendChild(btn);
			});

			const cancelBtn = document.createElement('button');
			cancelBtn.className = 'custom-dialog-btn dialog-btn-cancel';
			cancelBtn.textContent = 'Cancel';
			cancelBtn.style.marginTop = '10px';
			cancelBtn.addEventListener('click', () => modal.style.display = 'none');
			modalContent.appendChild(cancelBtn);

			modal.appendChild(modalContent);
			document.body.appendChild(modal);
		}
		modal.style.display = 'flex';
	}

	function populateSettingsPanel() {
		const container = document.getElementById('toolbar-items-container');
		clearElement(container);
		toolbarItems.forEach(item => addItemToPanel(item));
	}

	function addItemToPanel(item) {
		const container = document.getElementById('toolbar-items-container');
		const group = document.createElement('div');
		group.className = 'item-group';
		group.dataset.type = item.type;

		// Visibility Checkbox
		const visibleLabel = document.createElement('label');
		visibleLabel.style.display = 'flex';
		visibleLabel.style.alignItems = 'center';
		visibleLabel.style.marginBottom = '0';
		visibleLabel.style.marginRight = '10px';
		visibleLabel.style.cursor = 'pointer';

		const visibleCheckbox = document.createElement('input');
		visibleCheckbox.type = 'checkbox';
		visibleCheckbox.className = 'visible-checkbox';
		visibleCheckbox.checked = item.visible !== false;
		visibleCheckbox.style.width = 'auto';
		visibleCheckbox.style.marginRight = '5px';

		visibleLabel.appendChild(visibleCheckbox);
		visibleLabel.appendChild(document.createTextNode('Show'));
		group.appendChild(visibleLabel);

		// Item Content
		const contentDiv = document.createElement('div');
		contentDiv.className = 'item-content';

		if (item.type === 'button') {
			const button = item || { label: '', text: '' };
			const labelLabel = document.createElement('label');
			labelLabel.textContent = 'Button Label';
			contentDiv.appendChild(labelLabel);

			const labelInput = document.createElement('input');
			labelInput.type = 'text';
			labelInput.className = 'label-input';
			labelInput.value = button.label || '';
			contentDiv.appendChild(labelInput);

			const textLabel = document.createElement('label');
			textLabel.textContent = 'Snippet Text';
			contentDiv.appendChild(textLabel);

			const textInput = document.createElement('textarea');
			textInput.className = 'text-input';
			textInput.value = button.text || '';
			contentDiv.appendChild(textInput);
		} else if (item.type === 'dropdown') {
			const dropdown = item || { placeholder: '', options: [] };
			const placeholderLabel = document.createElement('label');
			placeholderLabel.textContent = 'Dropdown Placeholder';
			contentDiv.appendChild(placeholderLabel);

			const placeholderInput = document.createElement('input');
			placeholderInput.type = 'text';
			placeholderInput.className = 'placeholder-input';
			placeholderInput.value = dropdown.placeholder || '';
			contentDiv.appendChild(placeholderInput);

			const optionsContainer = document.createElement('div');
			optionsContainer.className = 'dropdown-options-container';
			optionsContainer.appendChild(document.createElement('label')).textContent = 'Options';
			contentDiv.appendChild(optionsContainer);

			const addOptionBtn = document.createElement('button');
			addOptionBtn.textContent = 'Add Option';
			addOptionBtn.addEventListener('click', () => addOptionToDropdownPanel(optionsContainer));
			contentDiv.appendChild(addOptionBtn);

			if (dropdown.options && dropdown.options.length > 0) {
				dropdown.options.forEach(opt => addOptionToDropdownPanel(optionsContainer, opt));
			} else {
				addOptionToDropdownPanel(optionsContainer);
			}
		} else if (item.type === 'action') {
			group.dataset.action = item.action;
			group.dataset.title = item.title;

			const labelLabel = document.createElement('label');
			labelLabel.textContent = `Action: ${item.action.toUpperCase()}`;
			contentDiv.appendChild(labelLabel);

			const labelInput = document.createElement('input');
			labelInput.type = 'text';
			labelInput.className = 'label-input';
			labelInput.value = item.label || '';
			contentDiv.appendChild(labelInput);
		}
		group.appendChild(contentDiv);

		// Remove Button (Only for non-action items)
		if (item.type !== 'action') {
			const removeBtn = document.createElement('button');
			removeBtn.className = 'remove-btn';
			removeBtn.textContent = 'Remove';
			removeBtn.addEventListener('click', () => {
				group.remove();
			});
			group.appendChild(removeBtn);
		}

		container.appendChild(group);
	}

	function addOptionToDropdownPanel(container, option = { label: '', text: '' }) {
		const item = document.createElement('div');
		item.className = 'option-item';

		const labelInput = document.createElement('input');
		labelInput.type = 'text';
		labelInput.className = 'label-input';
		labelInput.placeholder = 'Option Label';
		labelInput.value = option.label;
		item.appendChild(labelInput);

		const textInput = document.createElement('textarea');
		textInput.className = 'text-input';
		textInput.placeholder = 'Snippet Text';
		textInput.value = option.text;
		item.appendChild(textInput);

		const removeBtn = document.createElement('button');
		removeBtn.className = 'remove-btn';
		removeBtn.textContent = 'X';
		removeBtn.addEventListener('click', () => item.remove());
		item.appendChild(removeBtn);

		container.appendChild(item);
	}


	function toggleSettingsPanel(forceState) {
		const overlay = document.getElementById('gemini-mod-settings-overlay');
		if (!overlay) return;
		const isVisible = overlay.style.display === 'block';
		const show = typeof forceState === 'boolean' ? forceState : !isVisible;

		if (show) {
			populateSettingsPanel();
			// This needs to be called after population to init Sortable
			setupDragAndDrop();
			overlay.style.display = 'block';
		} else {
			overlay.style.display = 'none';
		}
	}


	// --- Download Logic ---

	function sanitizeBasename(baseName) {
		if (typeof baseName !== 'string' || baseName.trim() === "") return "downloaded_document";
		let sanitized = baseName.trim()
			.replace(INVALID_FILENAME_CHARS_REGEX, '_')
			.replace(/\s+/g, '_')
			.replace(/__+/g, '_')
			.replace(/^[_.-]+|[_.-]+$/g, '');
		if (!sanitized || RESERVED_WINDOWS_NAMES_REGEX.test(sanitized)) {
			sanitized = `_${sanitized || "file"}_`;
		}
		return sanitized || "downloaded_document";
	}

	function determineFilename(title) {
		if (!title || typeof title !== 'string' || title.trim() === "") {
			return `downloaded_document.${DEFAULT_DOWNLOAD_EXTENSION}`;
		}
		const match = title.trim().match(FILENAME_WITH_EXT_REGEX);
		if (match) {
			return `${sanitizeBasename(match[1])}.${match[2].toLowerCase()}`;
		}
		return `${sanitizeBasename(title)}.${DEFAULT_DOWNLOAD_EXTENSION}`;
	}

	function triggerDownload(filename, content) {
		try {
			const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			displayUserscriptMessage(`Failed to download: ${error.message}`);
		}
	}

	function waitForElement(selector, timeout = 3000) {
		return new Promise((resolve, reject) => {
			const element = document.querySelector(selector);
			if (element) return resolve(element);

			const observer = new MutationObserver((mutations) => {
				const element = document.querySelector(selector);
				if (element) {
					resolve(element);
					observer.disconnect();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});

			setTimeout(() => {
				observer.disconnect();
				reject(new Error(`Element ${selector} not found within ${timeout}ms`));
			}, timeout);
		});
	}

	async function handleGlobalCanvasDownload() {
		// --- METHOD 1: Monaco Editor Direct Access (Preferred) ---
		try {
			if (typeof unsafeWindow !== 'undefined' && unsafeWindow.monaco) {
				const editors = unsafeWindow.monaco.editor.getEditors();
				// Find the editor that is currently visible/attached
				const activeEditor = editors.find(e => {
					const node = e.getContainerDomNode();
					return document.body.contains(node) && node.offsetParent !== null;
				});

				if (activeEditor) {
					const model = activeEditor.getModel();
					if (model) {
						console.log("Gemini Mod: Found active Monaco editor.");
						const content = model.getValue();
						const titleEl = document.querySelector(GEMINI_CODE_CANVAS_TITLE_SELECTOR);
						const title = titleEl ? titleEl.textContent : "code_snippet";
						triggerDownload(determineFilename(title), content);
						return;
					}
				}
			}
		} catch (e) {
			console.warn("Gemini Mod: Monaco access failed", e);
		}

		// --- METHOD 2: Code Canvas "Share -> Copy" Automation (Fallback) ---
		const codeTitleEl = document.querySelector(GEMINI_CODE_CANVAS_TITLE_SELECTOR);

		if (codeTitleEl) {
			console.log("Gemini Mod: Code canvas detected. Using clipboard fallback.");
			const panelEl = codeTitleEl.closest(GEMINI_CODE_CANVAS_PANEL_SELECTOR);
			const shareButton = panelEl?.querySelector(GEMINI_CODE_CANVAS_SHARE_BUTTON_SELECTOR);
			if (!shareButton) return displayUserscriptMessage("Could not find the 'Share' button in the code canvas.");

			shareButton.click();

			try {
				const copyButton = await waitForElement(GEMINI_CODE_CANVAS_COPY_BUTTON_SELECTOR, 2000);
				copyButton.click();

				// Wait a bit for clipboard write
				setTimeout(async () => {
					try {
						const content = await navigator.clipboard.readText();
						if (!content) return displayUserscriptMessage("Clipboard empty. Nothing to download.");
						const filename = determineFilename(codeTitleEl.textContent);
						triggerDownload(filename, content);
					} catch (err) {
						displayUserscriptMessage('Clipboard permission denied or failed to read.');
					}
				}, 300);

			} catch (err) {
				displayUserscriptMessage("Could not find 'Copy' button after sharing.");
			}
			return;
		}

		// --- METHOD 3: Fallback logic for Document/Immersive Canvases ---
		const immersivePanel = document.querySelector(GEMINI_DOC_CANVAS_PANEL_SELECTOR);
		const editorContent = immersivePanel?.querySelector(GEMINI_DOC_CANVAS_EDITOR_SELECTOR);

		if (editorContent) {
			console.log("Gemini Mod: Document canvas detected. Using direct extraction method.");
			const content = editorContent.innerText;
			if (!content || content.trim() === "") {
				return displayUserscriptMessage("Document canvas is empty. Nothing to download.");
			}

			let title = "document_canvas";
			// Query title from the panel (toolbar), not the editor content
			const titleEl = immersivePanel.querySelector(GEMINI_DOC_CANVAS_TITLE_SELECTOR);
			if (titleEl && titleEl.innerText.trim() !== "") {
				title = titleEl.innerText.trim();
			}

			const filename = determineFilename(title);
			triggerDownload(filename, content);
			return; // Stop execution if successful
		}

		displayUserscriptMessage("No active or supported canvas found to download.");
	}

	async function handleCopy() {
		// --- METHOD 1: Monaco Editor Direct Access ---
		try {
			if (typeof unsafeWindow !== 'undefined' && unsafeWindow.monaco) {
				const editors = unsafeWindow.monaco.editor.getEditors();
				const activeEditor = editors.find(e => {
					const node = e.getContainerDomNode();
					return document.body.contains(node) && node.offsetParent !== null;
				});
				if (activeEditor) {
					const model = activeEditor.getModel();
					if (model) {
						const content = model.getValue();
						await navigator.clipboard.writeText(content);
						displayUserscriptMessage("Code copied to clipboard!", false);
						return;
					}
				}
			}
		} catch (e) { console.warn("Gemini Mod: Monaco access failed for copy", e); }

		// --- METHOD 2: Code Canvas "Share -> Copy" Automation ---
		const codeTitleEl = document.querySelector(GEMINI_CODE_CANVAS_TITLE_SELECTOR);
		if (codeTitleEl) {
			const panelEl = codeTitleEl.closest(GEMINI_CODE_CANVAS_PANEL_SELECTOR);
			const shareButton = panelEl?.querySelector(GEMINI_CODE_CANVAS_SHARE_BUTTON_SELECTOR);
			if (shareButton) {
				shareButton.click();
				try {
					const copyButton = await waitForElement(GEMINI_CODE_CANVAS_COPY_BUTTON_SELECTOR, 2000);
					copyButton.click();
					displayUserscriptMessage("Code copied to clipboard!", false);
				} catch (err) {
					displayUserscriptMessage("Could not find 'Copy' button.");
				}
				return;
			}
		}

		// --- METHOD 3: Document Canvas ---
		const immersivePanel = document.querySelector(GEMINI_DOC_CANVAS_PANEL_SELECTOR);
		const editorContent = immersivePanel?.querySelector(GEMINI_DOC_CANVAS_EDITOR_SELECTOR);
		if (editorContent) {
			const content = editorContent.innerText;
			if (content) {
				await navigator.clipboard.writeText(content);
				displayUserscriptMessage("Document copied to clipboard!", false);
				return;
			}
		}

		// --- METHOD 4: Last Model Response (Fallback) ---
		// Try to find the last model response in the chat
		const modelResponses = document.querySelectorAll('.model-response-text'); // This selector might need adjustment based on Gemini's DOM
		if (modelResponses.length > 0) {
			const lastResponse = modelResponses[modelResponses.length - 1];
			const text = lastResponse.innerText;
			if (text) {
				await navigator.clipboard.writeText(text);
				displayUserscriptMessage("Last response copied to clipboard!", false);
				return;
			}
		}

		displayUserscriptMessage("No content found to copy.");
	}

	async function handlePDFExport() {
		const { jsPDF } = window.jspdf;
		if (!jsPDF) {
			displayUserscriptMessage("jsPDF library not loaded.");
			return;
		}

		let content = "";
		let title = "document";

		// Reuse extraction logic (similar to download)
		// --- METHOD 1: Monaco Editor ---
		try {
			if (typeof unsafeWindow !== 'undefined' && unsafeWindow.monaco) {
				const editors = unsafeWindow.monaco.editor.getEditors();
				const activeEditor = editors.find(e => {
					const node = e.getContainerDomNode();
					return document.body.contains(node) && node.offsetParent !== null;
				});
				if (activeEditor) {
					const model = activeEditor.getModel();
					if (model) {
						content = model.getValue();
						const titleEl = document.querySelector(GEMINI_CODE_CANVAS_TITLE_SELECTOR);
						title = titleEl ? titleEl.textContent : "code_snippet";
					}
				}
			}
		} catch (e) { console.warn("Gemini Mod: Monaco access failed", e); }

		// --- METHOD 2: Document Canvas ---
		if (!content) {
			const immersivePanel = document.querySelector(GEMINI_DOC_CANVAS_PANEL_SELECTOR);
			const editorContent = immersivePanel?.querySelector(GEMINI_DOC_CANVAS_EDITOR_SELECTOR);
			if (editorContent) {
				content = editorContent.innerText;
				const titleEl = immersivePanel.querySelector(GEMINI_DOC_CANVAS_TITLE_SELECTOR);
				if (titleEl && titleEl.innerText.trim() !== "") {
					title = titleEl.innerText.trim();
				} else {
					title = "document_canvas";
				}
			}
		}

		if (!content || content.trim() === "") {
			displayUserscriptMessage("No active canvas content found to export.");
			return;
		}

		// --- Content Sanitization ---
		// 1. Replace Tabs with 4 spaces (jsPDF calculation often ignores tabs)
		content = content.replace(/\t/g, '    ');
		// 2. Replace non-breaking spaces with normal spaces
		content = content.replace(/\u00A0/g, ' ');

		try {
			// User Request: Use fixed A4 format with pt units to ensure correct wrapping
			const doc = new jsPDF({
				unit: 'pt',
				format: 'a4'
			});

			// A4 Size in pt is approx 595.28 x 841.89
			// We can use doc.internal.pageSize.getWidth() to be sure
			const pageWidth = doc.internal.pageSize.getWidth();
			const pageHeight = doc.internal.pageSize.getHeight();

			const margin = 40; // 40pt margin
			const maxLineWidth = pageWidth - (margin * 2);
			const lineHeight = 14; // pt line height for readability with courier
			let cursorY = margin;

			// Add Title
			doc.setFontSize(14);
			doc.setFont("helvetica", "bold");
			doc.text(title, margin, cursorY);
			cursorY += 20;

			// Add Content
			doc.setFontSize(10);
			doc.setFont("courier", "normal"); // Monospace for code/text

			// Split text to fit width
			const lines = doc.splitTextToSize(content, maxLineWidth);

			lines.forEach(line => {
				if (cursorY > pageHeight - margin) {
					doc.addPage();
					cursorY = margin;
				}
				doc.text(line, margin, cursorY);
				cursorY += lineHeight;
			});

			// Force Download via Blob
			const pdfBlob = doc.output('blob');
			const blobUrl = URL.createObjectURL(pdfBlob);
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = `${determineFilename(title).replace(/\.[^/.]+$/, "")}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);

		} catch (err) {
			console.error("Gemini Mod: PDF Generation Error", err);
			displayUserscriptMessage("Failed to generate PDF: " + err.message);
		}
	}


	// --- Initialization ---

	async function init() {
		console.log("Gemini Mod Userscript: Initializing...");
		injectCustomCSS();
		await loadConfiguration();
		setTimeout(() => {
			try {
				createToolbar();
				createSettingsPanel();
				// Start folder initialization loop
				const folderInitInterval = setInterval(() => {
					if (initializeFolders()) {
						clearInterval(folderInitInterval);
					}
				}, 500);
			} catch (e) {
				console.error("Gemini Mod: Error during delayed initialization:", e);
				displayUserscriptMessage("Error initializing toolbar. See console.");
			}
		}, 1500);
	}

	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();