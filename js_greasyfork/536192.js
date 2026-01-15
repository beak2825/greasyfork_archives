// ==UserScript==
// @name          Google Gemini Mod (Toolbar, Folders & Download)
// @namespace     http://tampermonkey.net/
// @version       0.0.19
// @description   Enhances Google Gemini with a configurable toolbar and sidebar folders to organize conversations.
// @description[de] Verbessert Google Gemini mit einer konfigurierbaren Symbolleiste und Ordnern in der Seitenleiste, um Konversationen zu organisieren.
// @author        Adromir
// @license       MIT
// @match         https://gemini.google.com/*
// @icon          https://raw.githubusercontent.com/adromir/google-gemini-mod/refs/heads/main/icon.svg
// @supportURL    https://github.com/adromir/scripts/issues
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// @grant         unsafeWindow
// @require       https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require       https://cdn.jsdelivr.net/gh/adromir/scripts@ef4eeb9853f8d32d5cff2f37133fe8bddfb19972/userscripts/gemini-snippets/gemini_mod_styles.js#sha256-bXQDm5Zj7+t4jYaFvTGvx/jUgo08EQmLdHve9CIRVoQ=
// @require       https://cdn.jsdelivr.net/gh/adromir/scripts@ef4eeb9853f8d32d5cff2f37133fe8bddfb19972/userscripts/gemini-snippets/gemini_mod_utils.js#sha256-fuVgPZwMZpc70L35bG2B9oVdzD7YYYnQQp3xyJ/C/IM=
// @require       https://cdn.jsdelivr.net/gh/adromir/scripts@ef4eeb9853f8d32d5cff2f37133fe8bddfb19972/userscripts/gemini-snippets/gemini_mod_drive.js#sha256-Sf+ByWwt60J4l8gAbxP7jzBd004RVfvwpWhkeyWUcmg=
// @downloadURL https://update.greasyfork.org/scripts/536192/Google%20Gemini%20Mod%20%28Toolbar%2C%20Folders%20%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536192/Google%20Gemini%20Mod%20%28Toolbar%2C%20Folders%20%20Download%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Ensure Namespace exists
	window.GeminiMod = window.GeminiMod || {};

	// ===================================================================================
	// I. CONFIGURATION SECTION
	// ===================================================================================

	// --- Storage Keys ---
	const STORAGE_KEY_TOOLBAR_ITEMS = "geminiModToolbarItems_v2";
	const STORAGE_KEY_FOLDERS = 'gemini_folders';
	const STORAGE_KEY_CONVO_FOLDERS = 'gemini_convo_folders';
	const STORAGE_KEY_GDRIVE_TOKEN = 'gemini_gdrive_token';             // Kept for reference, used by Drive module
	const STORAGE_KEY_GDRIVE_CLIENT_ID = 'gemini_gdrive_client_id';     // Kept for reference, used by Drive module

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

	// --- Core Aliases (Helpers) ---
	const displayMessage = GeminiMod.utils.displayUserscriptMessage;
	const clearEl = GeminiMod.utils.clearElement;
	const showConfirm = GeminiMod.utils.showConfirmationDialog;
	const showPrompt = GeminiMod.utils.showCustomPromptDialog;
	const showColorPicker = GeminiMod.utils.showColorPickerDialog;
	const injectCSS = GeminiMod.utils.injectCustomCSS;

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
			displayMessage("Could not find Gemini input field.");
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
			displayMessage("Failed to save settings. See console for details.");
			console.error("Gemini Mod: Error saving settings:", e);
		}
	}

	async function saveFolderConfiguration() {
		await GM_setValue(STORAGE_KEY_FOLDERS, folders);
		await GM_setValue(STORAGE_KEY_CONVO_FOLDERS, conversationFolders);
	}

	// --- Setup Guide Modal ---


	function showSetupGuide() {
		const overlay = document.createElement('div');
		overlay.className = 'custom-dialog-overlay';
		overlay.id = 'setup-guide-overlay';

		const dialogBox = document.createElement('div');
		dialogBox.className = 'custom-dialog-box';
		dialogBox.style.maxWidth = '600px';

		const h3 = document.createElement('h3');
		h3.textContent = 'Google Drive Sync Setup';
		dialogBox.appendChild(h3);

		const p1 = document.createElement('p');
		p1.innerHTML = ''; // Clear just in case, though new element is empty
		p1.appendChild(document.createTextNode('To sync explicitly via Google Drive, you need a '));
		const b1 = document.createElement('b');
		b1.textContent = 'Google Cloud Client ID';
		p1.appendChild(b1);
		p1.appendChild(document.createTextNode('. This is required because this script runs privately in your browser.'));
		dialogBox.appendChild(p1);

		const ol = document.createElement('ol');
		const steps = [
			{ html: false, text: 'Go to ', link: { href: 'https://console.cloud.google.com/apis/credentials', text: 'Google Cloud Console' } },
			{ html: false, text: 'Create a new project (or use existing).' },
			{ html: false, parts: [{ text: 'Enable the ' }, { tag: 'b', text: 'Google Drive API' }, { text: '.' }] },
			{ html: false, text: 'Create Credentials -> OAuth client ID.' },
			{ html: false, parts: [{ text: 'Application type: ' }, { tag: 'b', text: 'Web application' }, { text: '.' }] },
			{ html: false, parts: [{ text: 'Add authorized origins: ' }, { tag: 'code', text: 'https://gemini.google.com' }] },
			{ html: false, parts: [{ text: 'Copy the ' }, { tag: 'b', text: 'Client ID' }, { text: ' and paste it in the settings here.' }] }
		];

		const createStep = (step) => {
			const li = document.createElement('li');
			if (step.link) {
				li.appendChild(document.createTextNode(step.text));
				const a = document.createElement('a');
				a.href = step.link.href;
				a.target = '_blank';
				a.textContent = step.link.text;
				li.appendChild(a);
				li.appendChild(document.createTextNode('.'));
			} else if (step.parts) {
				step.parts.forEach(part => {
					if (part.tag) {
						const tag = document.createElement(part.tag);
						tag.textContent = part.text;
						li.appendChild(tag);
					} else {
						li.appendChild(document.createTextNode(part.text));
					}
				});
			} else {
				li.textContent = step.text;
			}
			return li;
		};

		steps.forEach(step => ol.appendChild(createStep(step)));
		dialogBox.appendChild(ol);

		const p2 = document.createElement('p');
		const i = document.createElement('i');
		i.appendChild(document.createTextNode('Alternatively, use the '));
		const b2 = document.createElement('b');
		b2.textContent = 'File Backup';
		i.appendChild(b2);
		i.appendChild(document.createTextNode(' option below to save/restore manually without setup.'));
		p2.appendChild(i);
		dialogBox.appendChild(p2);


		const closeBtn = document.createElement('button');
		closeBtn.className = 'custom-dialog-btn dialog-btn-cancel';
		closeBtn.textContent = 'Close';
		closeBtn.onclick = () => overlay.remove();
		closeBtn.style.marginTop = '20px';

		dialogBox.appendChild(closeBtn);
		overlay.appendChild(dialogBox);
		document.body.appendChild(overlay);
	}

	// --- Toolbar Creation ---

	function createToolbar() {
		const toolbarId = 'gemini-snippet-toolbar-userscript';
		let toolbar = document.getElementById(toolbarId);
		if (toolbar) {
			clearEl(toolbar);
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
							displayMessage('Failed to read clipboard: ' + err.message);
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


	// --- Settings Panel ---

	function toggleSettingsPanel(show = true) {
		let overlay = document.getElementById('gemini-mod-settings-overlay');
		let panel = document.getElementById('gemini-mod-settings-panel');

		if (!overlay) {
			createSettingsPanel();
			overlay = document.getElementById('gemini-mod-settings-overlay');
			panel = document.getElementById('gemini-mod-settings-panel');
		}

		if (show) {
			populateSettingsPanel(panel);
			overlay.style.display = 'block';
		} else {
			overlay.style.display = 'none';
		}
	}

	async function updateSettingsPanelDriveStatus() {
		const statusText = document.getElementById('gdrive-status-text');
		const connectBtn = document.getElementById('gdrive-connect-btn');
		const saveBtn = document.getElementById('gdrive-save-btn');
		const loadBtn = document.getElementById('gdrive-load-btn');
		const backupContainer = document.getElementById('gdrive-backup-container');

		if (statusText && connectBtn) {
			const token = await GeminiMod.drive.getGoogleDriveToken();
			if (token) {
				statusText.textContent = "Status: Connected ✅";
				statusText.style.color = "#8ab4f8";
				connectBtn.style.display = 'none';
				backupContainer.style.display = 'block';
			} else {
				statusText.textContent = "Status: Not Connected";
				statusText.style.color = "#aaa";
				connectBtn.style.display = 'inline-block';
				backupContainer.style.display = 'none';
			}
		}
	}

	function createSettingsPanel() {
		if (document.getElementById('gemini-mod-settings-overlay')) return;

		const overlay = document.createElement('div');
		overlay.id = 'gemini-mod-settings-overlay';

		const panel = document.createElement('div');
		panel.id = 'gemini-mod-settings-panel';
		overlay.appendChild(panel);

		panel.appendChild(document.createElement('h2')).textContent = 'Gemini Mod Settings';

		// Create Container for Tabbed Layout
		const container = document.createElement('div');
		container.className = 'settings-container';

		// --- SIDEBAR ---
		const sidebar = document.createElement('div');
		sidebar.className = 'settings-sidebar';

		const tabs = [
			{ id: 'tab-toolbar', label: '🛠️ Toolbar' },
			{ id: 'tab-drive', label: '☁️ Google Drive' },
			{ id: 'tab-reset', label: '⚠️ Danger Zone' }
		];

		tabs.forEach((tab, index) => {
			const btn = document.createElement('button');
			btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
			btn.textContent = tab.label;
			btn.dataset.target = tab.id;
			btn.onclick = () => {
				document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
				document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
				btn.classList.add('active');
				document.getElementById(tab.id).classList.add('active');
			};
			sidebar.appendChild(btn);
		});

		// Footer Buttons Container
		const sidebarFooter = document.createElement('div');
		sidebarFooter.style.marginTop = 'auto'; // Pushes to bottom
		sidebarFooter.style.display = 'flex';
		sidebarFooter.style.flexDirection = 'column';
		sidebarFooter.style.gap = '10px';
		sidebarFooter.style.width = '100%';

		// Close Button
		const closeButton = document.createElement('button');
		closeButton.textContent = 'Close';
		closeButton.className = 'custom-dialog-btn dialog-btn-cancel';
		closeButton.style.width = '100%';
		closeButton.style.boxSizing = 'border-box'; // Ensure padding handles correctly
		closeButton.style.margin = '0'; // Override default class margin
		closeButton.addEventListener('click', () => toggleSettingsPanel(false));
		sidebarFooter.appendChild(closeButton);

		// Save Button
		const saveBtnClose = document.createElement('button');
		saveBtnClose.textContent = 'Save & Close';
		saveBtnClose.className = 'custom-dialog-btn dialog-btn-confirm';
		saveBtnClose.style.width = '100%';
		saveBtnClose.style.boxSizing = 'border-box';
		saveBtnClose.style.margin = '0'; // Override default class margin
		saveBtnClose.addEventListener('click', saveToolbarConfiguration); // Logic handles closing
		sidebarFooter.appendChild(saveBtnClose);

		sidebar.appendChild(sidebarFooter);

		container.appendChild(sidebar);

		// Content Area
		const content = document.createElement('div');
		content.className = 'settings-content';

		// --- TAB 1: TOOLBAR ---
		const tabToolbar = document.createElement('div');
		tabToolbar.id = 'tab-toolbar';
		tabToolbar.className = 'tab-pane active';

		// Add Item Button
		const addItemBtn = document.createElement('button');
		addItemBtn.textContent = '+ Add New Item';
		addItemBtn.className = 'custom-dialog-btn dialog-btn-confirm';
		addItemBtn.style.marginBottom = '20px';
		addItemBtn.addEventListener('click', showAddItemModal);
		tabToolbar.appendChild(addItemBtn);

		const itemsContainer = document.createElement('div');
		itemsContainer.id = 'toolbar-items-container';
		tabToolbar.appendChild(itemsContainer);

		content.appendChild(tabToolbar);


		// --- TAB 2: GOOGLE DRIVE ---
		const tabDrive = document.createElement('div');
		tabDrive.id = 'tab-drive';
		tabDrive.className = 'tab-pane';

		const driveHeader = document.createElement('h3');
		driveHeader.textContent = 'Google Drive Sync';
		driveHeader.style.marginTop = '0';

		// Help Icon/Button
		const helpBtn = document.createElement('button');
		helpBtn.textContent = '📖'; // Book icon
		helpBtn.title = "Show Setup Instructions";
		helpBtn.style.marginLeft = '10px';
		helpBtn.style.background = 'transparent';
		helpBtn.style.border = '1px solid #5f6368';
		helpBtn.onclick = showSetupGuide;
		driveHeader.appendChild(helpBtn);

		tabDrive.appendChild(driveHeader);

		// Client ID Input
		const clientIdLabel = document.createElement('label');
		clientIdLabel.textContent = "Google Cloud Client ID:";
		tabDrive.appendChild(clientIdLabel);

		const clientIdContainer = document.createElement('div');
		clientIdContainer.style.display = 'flex';
		clientIdContainer.style.alignItems = 'center';
		clientIdContainer.style.gap = '5px';

		const clientIdInput = document.createElement('input');
		clientIdInput.id = 'gdrive-client-id-input';
		clientIdInput.type = 'password';
		clientIdInput.placeholder = "Enter your OAuth 2.0 Client ID";
		clientIdInput.style.flexGrow = '1';
		clientIdInput.value = ""; // Will be populated

		// Toggle Visibility
		const toggleVisBtn = document.createElement('button');
		toggleVisBtn.textContent = '👁️';
		toggleVisBtn.title = "Toggle Visibility";
		toggleVisBtn.onclick = () => {
			clientIdInput.type = clientIdInput.type === 'password' ? 'text' : 'password';
		};

		// Help Link
		const helpLink = document.createElement('a');
		helpLink.href = "https://console.cloud.google.com/apis/credentials";
		helpLink.target = "_blank";
		helpLink.textContent = "❓ Get ID";
		helpLink.className = 'help-link';

		clientIdContainer.appendChild(clientIdInput);
		clientIdContainer.appendChild(toggleVisBtn);
		clientIdContainer.appendChild(helpLink);
		tabDrive.appendChild(clientIdContainer);

		const saveClientIdBtn = document.createElement('button');
		saveClientIdBtn.textContent = "Save Client ID";
		saveClientIdBtn.style.marginTop = "10px";
		saveClientIdBtn.addEventListener('click', async () => {
			const val = clientIdInput.value.trim();
			if (val) {
				await GM_setValue(STORAGE_KEY_GDRIVE_CLIENT_ID, val);
				displayMessage("Client ID saved!", false);
				updateSettingsPanelDriveStatus();
			} else {
				displayMessage("Please enter a Client ID.");
			}
		});
		tabDrive.appendChild(saveClientIdBtn);

		// Connection Status
		const statusText = document.createElement('p');
		statusText.id = 'gdrive-status-text';
		statusText.textContent = "Status: Checking...";
		statusText.style.marginTop = "20px";
		statusText.style.fontWeight = "bold";
		tabDrive.appendChild(statusText);

		// Connect Button
		const connectBtn = document.createElement('button');
		connectBtn.id = 'gdrive-connect-btn';
		connectBtn.textContent = "Connect Google Drive";
		connectBtn.className = 'custom-dialog-btn dialog-btn-confirm';
		connectBtn.style.display = 'none';
		connectBtn.addEventListener('click', () => GeminiMod.drive.initiateGoogleDriveAuth());
		tabDrive.appendChild(connectBtn);

		// Backup Controls (Hidden until connected)
		const backupContainer = document.createElement('div');
		backupContainer.id = 'gdrive-backup-container';
		backupContainer.style.display = 'none';
		backupContainer.style.marginTop = '15px';
		backupContainer.style.borderTop = '1px solid #444';
		backupContainer.style.paddingTop = '15px';

		const backupTitle = document.createElement('h4');
		backupTitle.textContent = "Synchronization";
		backupTitle.style.marginTop = '0';
		backupContainer.appendChild(backupTitle);

		const saveBtn = document.createElement('button');
		saveBtn.id = 'gdrive-save-btn';
		saveBtn.textContent = "☁️ Save to Drive";
		saveBtn.className = 'custom-dialog-btn';
		saveBtn.style.marginRight = '10px';
		saveBtn.title = "Overwrite the backup file on Google Drive with current settings";
		saveBtn.onclick = () => {
			GeminiMod.drive.saveToDrive({
				toolbarItems,
				folders,
				conversationFolders
			});
		};
		backupContainer.appendChild(saveBtn);

		const loadBtn = document.createElement('button');
		loadBtn.id = 'gdrive-load-btn';
		loadBtn.textContent = "☁️ Load from Drive";
		loadBtn.className = 'custom-dialog-btn';
		loadBtn.title = "Overwrite local settings with data from Google Drive";
		loadBtn.onclick = () => {
			GeminiMod.drive.loadFromDrive(async (data) => {
				if (data && data.toolbarItems && data.folders) {
					await GM_setValue(STORAGE_KEY_TOOLBAR_ITEMS, JSON.stringify(data.toolbarItems));
					await GM_setValue(STORAGE_KEY_FOLDERS, data.folders);
					await GM_setValue(STORAGE_KEY_CONVO_FOLDERS, data.conversationFolders || {});
					displayMessage("Settings loaded from Drive! Reloading page...", false);
					setTimeout(() => location.reload(), 1500);
				} else {
					displayMessage("Invalid file format downloaded from Drive.");
				}
			});
		};
		backupContainer.appendChild(loadBtn);

		tabDrive.appendChild(backupContainer);

		// --- Manual Backup Section ---
		const manualBackupHeader = document.createElement('h3');
		manualBackupHeader.textContent = 'Manual File Backup';
		tabDrive.appendChild(manualBackupHeader);

		const manualDesc = document.createElement('p');
		manualDesc.textContent = "No setup required. Save your settings to a local file.";
		manualDesc.style.fontSize = '0.9em';
		manualDesc.style.color = '#aaa';
		tabDrive.appendChild(manualDesc);

		const exportBtn = document.createElement('button');
		exportBtn.textContent = "⬇️ Export to File";
		exportBtn.className = 'custom-dialog-btn';
		exportBtn.style.marginRight = '10px';
		exportBtn.onclick = () => GeminiMod.drive.exportSettingsToFile({
			toolbarItems,
			folders,
			conversationFolders
		});
		tabDrive.appendChild(exportBtn);

		const importInput = document.createElement('input');
		importInput.type = 'file';
		importInput.accept = '.json';
		importInput.style.display = 'none';
		importInput.onchange = (e) => {
			if (e.target.files.length > 0) {
				GeminiMod.drive.importSettingsFromFile(e.target.files[0], async (data) => {
					await GM_setValue(STORAGE_KEY_TOOLBAR_ITEMS, JSON.stringify(data.toolbarItems));
					await GM_setValue(STORAGE_KEY_FOLDERS, data.folders);
					await GM_setValue(STORAGE_KEY_CONVO_FOLDERS, data.conversationFolders || {});
					if (data.gdriveClientId) await GM_setValue(STORAGE_KEY_GDRIVE_CLIENT_ID, data.gdriveClientId);

					displayMessage("Settings imported successfully! Reloading...", false);
					setTimeout(() => location.reload(), 1500);
				});
			}
		};

		const importBtn = document.createElement('button');
		importBtn.textContent = "⬆️ Import from File";
		importBtn.className = 'custom-dialog-btn';
		importBtn.onclick = () => importInput.click();
		tabDrive.appendChild(importBtn);
		tabDrive.appendChild(importInput);


		content.appendChild(tabDrive);


		// --- TAB 3: RESET ---
		const tabReset = document.createElement('div');
		tabReset.id = 'tab-reset';
		tabReset.className = 'tab-pane';

		tabReset.appendChild(document.createElement('h3')).textContent = 'Danger Zone';

		const resetFoldersBtn = document.createElement('button');
		resetFoldersBtn.textContent = 'Reset Folders Only';
		resetFoldersBtn.className = 'custom-dialog-btn dialog-btn-delete';
		resetFoldersBtn.style.display = 'block';
		resetFoldersBtn.style.marginBottom = '15px';
		resetFoldersBtn.addEventListener('click', () => {
			showConfirm("Are you sure you want to delete all folders?", async () => {
				await GM_deleteValue(STORAGE_KEY_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_CONVO_FOLDERS);
				location.reload();
			}, "Delete Folders", "dialog-btn-delete");
		});
		tabReset.appendChild(resetFoldersBtn);

		const resetAllBtn = document.createElement('button');
		resetAllBtn.textContent = 'Reset EVERYTHING (Factory Reset)';
		resetAllBtn.className = 'custom-dialog-btn dialog-btn-delete';
		resetAllBtn.style.backgroundColor = '#cc2929'; // Redder
		resetAllBtn.addEventListener('click', () => {
			showConfirm("Are you sure? This will execute a full factory reset of the userscript, including Toolbar items, Folders, and Google Drive connection.", async () => {
				await GM_deleteValue(STORAGE_KEY_TOOLBAR_ITEMS);
				await GM_deleteValue(STORAGE_KEY_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_CONVO_FOLDERS);
				await GM_deleteValue(STORAGE_KEY_GDRIVE_TOKEN);
				await GM_deleteValue(STORAGE_KEY_GDRIVE_CLIENT_ID);
				location.reload();
			}, "FACTORY RESET", "dialog-btn-delete");
		});
		tabReset.appendChild(resetAllBtn);

		content.appendChild(tabReset);

		container.appendChild(content);
		panel.appendChild(container);

		document.body.appendChild(overlay);

		// Initialize Sortable on the items container
		new Sortable(itemsContainer, {
			animation: 150,
			handle: '.item-group',
			ghostClass: 'sortable-ghost'
		});
	}

	function populateSettingsPanel(panel) {
		const container = panel.querySelector('#toolbar-items-container');
		if (!container) return; // Should not happen
		clearEl(container);

		toolbarItems.forEach(item => addItemToPanel(container, item));

		// Populate Client ID if exists
		const clientIdInput = document.getElementById('gdrive-client-id-input');
		if (clientIdInput) {
			GeminiMod.drive.getGoogleDriveClientId().then(id => {
				if (id) clientIdInput.value = id;
			});
		}
		// Update Status
		updateSettingsPanelDriveStatus();
	}

	function addItemToPanel(container, item) {
		const group = document.createElement('div');
		group.className = 'item-group';
		group.dataset.type = item.type;
		if (item.action) group.dataset.action = item.action;
		if (item.title) group.dataset.title = item.title;

		const visibleCheck = document.createElement('input');
		visibleCheck.type = 'checkbox';
		visibleCheck.className = 'visible-checkbox';
		visibleCheck.checked = item.visible !== false;
		visibleCheck.title = 'Show in toolbar';
		group.appendChild(visibleCheck);

		const contentDiv = document.createElement('div');
		contentDiv.className = 'item-content';

		const typeLabel = document.createElement('strong');
		typeLabel.textContent = item.type.toUpperCase() + (item.action ? ` (${item.action})` : '');
		typeLabel.style.display = 'block';
		typeLabel.style.marginBottom = '5px';
		typeLabel.style.fontSize = '0.7em';
		typeLabel.style.color = '#888';
		contentDiv.appendChild(typeLabel);

		// Dynamic fields based on type
		if (item.type === 'button') {
			contentDiv.appendChild(createInputRow("Label:", item.label, "label-input"));
			contentDiv.appendChild(createInputRow("Snippet:", item.text, "text-input", "textarea"));
		} else if (item.type === 'dropdown') {
			contentDiv.appendChild(createInputRow("Placeholder:", item.placeholder, "placeholder-input"));
			const optionsContainer = document.createElement('div');
			optionsContainer.className = 'dropdown-options-container';
			optionsContainer.appendChild(document.createElement('h4')).textContent = "Options:";

			item.options.forEach(opt => addOptionToContainer(optionsContainer, opt));

			const addOptBtn = document.createElement('button');
			addOptBtn.textContent = '+ Add Option';
			addOptBtn.style.marginTop = '5px';
			addOptBtn.addEventListener('click', () => addOptionToContainer(optionsContainer, { label: '', text: '' }));
			optionsContainer.appendChild(addOptBtn);
			contentDiv.appendChild(optionsContainer);
		} else if (item.type === 'action') {
			contentDiv.appendChild(createInputRow("Label:", item.label, "label-input"));
			const descInfo = document.createElement('div');
			descInfo.style.fontSize = '0.8em';
			descInfo.style.color = '#aaa';
			descInfo.textContent = "Functionality is built-in.";
			contentDiv.appendChild(descInfo);
		}

		group.appendChild(contentDiv);

		// Delete Button
		const deleteBtn = document.createElement('button');
		deleteBtn.textContent = '🗑️';
		deleteBtn.className = 'remove-btn';
		deleteBtn.title = 'Remove Item';
		deleteBtn.addEventListener('click', () => group.remove());
		group.appendChild(deleteBtn);

		container.appendChild(group);
	}

	function createInputRow(labelText, value, className, inputType = 'text') {
		const wrapper = document.createElement('div');
		wrapper.style.marginBottom = '5px';
		const label = document.createElement('label');
		label.textContent = labelText;
		let input;
		if (inputType === 'textarea') {
			input = document.createElement('textarea');
		} else {
			input = document.createElement('input');
			input.type = 'text';
		}
		input.value = value || '';
		input.className = className;
		wrapper.appendChild(label);
		wrapper.appendChild(input);
		return wrapper;
	}

	function addOptionToContainer(container, optionData) {
		const row = document.createElement('div');
		row.className = 'option-item';

		const labelInput = document.createElement('input');
		labelInput.type = 'text';
		labelInput.placeholder = 'Label';
		labelInput.value = optionData.label;
		labelInput.className = 'custom-dialog-input label-input';
		labelInput.style.marginBottom = '0';

		const textInput = document.createElement('textarea');
		textInput.placeholder = 'Snippet Text';
		textInput.value = optionData.text;
		textInput.className = 'custom-dialog-input text-input';
		textInput.style.marginBottom = '0';
		textInput.style.minHeight = '40px';


		const delBtn = document.createElement('button');
		delBtn.textContent = 'x';
		delBtn.className = 'remove-btn';
		delBtn.addEventListener('click', () => row.remove());

		row.appendChild(labelInput);
		row.appendChild(textInput);
		row.appendChild(delBtn);

		// Insert before the "Add Option" button
		container.insertBefore(row, container.lastElementChild);
	}

	function showAddItemModal() {
		// reuse existing modal if possible or create simple one
		const overlay = document.createElement('div');
		overlay.className = 'custom-dialog-overlay';
		overlay.id = 'gemini-mod-type-modal-overlay';

		const modal = document.createElement('div');
		modal.id = 'gemini-mod-type-modal';
		modal.className = 'custom-dialog-box';

		const h3 = document.createElement('h3');
		h3.textContent = 'Select Item Type';
		modal.appendChild(h3);

		const createTypeBtn = (type, label) => {
			const btn = document.createElement('button');
			btn.textContent = label;
			btn.className = 'custom-dialog-btn dialog-btn-confirm';
			btn.addEventListener('click', () => {
				let newItem;
				if (type === 'button') newItem = { type: 'button', label: 'New Button', text: '' };
				else if (type === 'dropdown') newItem = { type: 'dropdown', placeholder: 'Select...', options: [] };

				const container = document.getElementById('toolbar-items-container');
				addItemToPanel(container, newItem);
				document.body.removeChild(overlay);
			});
			return btn;
		};

		modal.appendChild(createTypeBtn('button', 'Button'));
		modal.appendChild(createTypeBtn('dropdown', 'Dropdown'));

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = 'Cancel';
		cancelBtn.className = 'custom-dialog-btn dialog-btn-cancel';
		cancelBtn.style.marginTop = '15px';
		cancelBtn.addEventListener('click', () => document.body.removeChild(overlay));
		modal.appendChild(cancelBtn);

		overlay.appendChild(modal);
		document.body.appendChild(overlay);
	}


	// --- Folder Logic ---

	function initializeFolders() {
		const chatHistoryList = document.querySelector(FOLDER_INJECTION_POINT_SELECTOR);
		if (!chatHistoryList) return false;

		const foldersContainerId = 'folder-ui-container';
		if (!document.getElementById(foldersContainerId)) {
			const container = document.createElement('div');
			container.id = foldersContainerId;
			chatHistoryList.parentNode.insertBefore(container, chatHistoryList);
			renderFolders();
		}

		// Observe chat list changes to identify new conversations
		const observer = new MutationObserver(() => {
			processConversationItems(chatHistoryList);
		});
		observer.observe(chatHistoryList, { childList: true, subtree: true });

		// Initial process
		processConversationItems(chatHistoryList);
		return true;
	}

	function renderFolders() {
		const container = document.getElementById('folder-ui-container');
		if (!container) return;

		// Remove existing folder-container if exists to re-render
		let folderWrapper = document.getElementById('folder-container');
		if (folderWrapper) folderWrapper.remove();

		folderWrapper = document.createElement('div');
		folderWrapper.id = 'folder-container';
		container.appendChild(folderWrapper);

		folders.forEach(folder => {
			folderWrapper.appendChild(createFolderElement(folder));
		});

		const addBtn = document.createElement('button');
		addBtn.id = 'add-folder-btn';
		addBtn.textContent = '+ New Folder';
		addBtn.addEventListener('click', () => {
			showPrompt("New Folder Name:", "", async (name) => {
				if (name) {
					folders.push({ id: Date.now().toString(), name: name, color: FOLDER_COLORS[0], isOpen: true });
					await saveFolderConfiguration();
					renderFolders();
				}
			});
		});
		folderWrapper.appendChild(addBtn);

		// Initialize Sortable for folders
		new Sortable(folderWrapper, {
			animation: 150,
			handle: '.folder-header',
			onEnd: async () => {
				const newOrder = [];
				folderWrapper.querySelectorAll('.folder').forEach(el => {
					const id = el.dataset.id;
					const folder = folders.find(f => f.id === id);
					if (folder) newOrder.push(folder);
				});
				folders = newOrder;
				await saveFolderConfiguration();
			}
		});
	}

	function createFolderElement(folder) {
		const folderDiv = document.createElement('div');
		folderDiv.className = `folder ${folder.isOpen ? '' : 'closed'}`;
		folderDiv.dataset.id = folder.id;

		const header = document.createElement('div');
		header.className = 'folder-header';
		header.style.borderLeft = `4px solid ${folder.color}`;

		// Folder Icon (Open/Closed)
		const iconWrapper = document.createElement('div');
		iconWrapper.className = 'folder-icon-wrapper';

		const createIcon = (isOpen, color) => {
			const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.classList.add("folder-icon", isOpen ? "icon-open" : "icon-closed");
			svg.setAttribute("viewBox", "0 0 24 24");
			svg.setAttribute("fill", color);
			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", isOpen
				? "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
				: "M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z");
			svg.appendChild(path);
			return svg;
		};

		iconWrapper.appendChild(createIcon(true, folder.color));
		iconWrapper.appendChild(createIcon(false, folder.color));
		header.appendChild(iconWrapper);

		const nameSpan = document.createElement('span');
		nameSpan.className = 'folder-name';
		nameSpan.textContent = folder.name;
		header.appendChild(nameSpan);

		const controls = document.createElement('div');
		controls.className = 'folder-controls';

		const settingsBtn = document.createElement('button');
		settingsBtn.className = 'folder-options-btn';
		settingsBtn.textContent = '⋮';
		settingsBtn.title = "Folder Options";
		settingsBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			showFolderContextMenu(e, folder);
		});
		controls.appendChild(settingsBtn);

		const toggleIcon = document.createElement('span');
		toggleIcon.className = 'folder-toggle-icon';
		toggleIcon.textContent = '▼';
		controls.appendChild(toggleIcon);

		header.appendChild(controls);

		header.addEventListener('click', () => {
			folder.isOpen = !folder.isOpen;
			folderDiv.classList.toggle('closed', !folder.isOpen);
			saveFolderConfiguration();
		});

		folderDiv.appendChild(header);

		const contentDiv = document.createElement('div');
		contentDiv.className = 'folder-content';
		// Populate content
		const convoIds = Object.keys(conversationFolders).filter(k => conversationFolders[k] === folder.id);
		// Note: Actual conversation DOM elements are moved here by processConversationItems logic
		// We set a data attributes to help the processor know this is a drop target
		contentDiv.dataset.folderId = folder.id;

		folderDiv.appendChild(contentDiv);

		// Initialize Sortable for dragging conversations INTO this folder
		new Sortable(contentDiv, {
			group: 'conversations', // Share group with main list if possible, or just other folders
			animation: 150,
			onAdd: async (evt) => {
				const item = evt.item;
				const convoId = getConversationId(item);
				if (convoId) {
					conversationFolders[convoId] = folder.id;
					await saveFolderConfiguration();
				}
			}
		});

		return folderDiv;
	}

	function getConversationId(element) {
		// Extract ID from Gemini's DOM. Needs to be robust.
		// Usually in the link href or data-test-id
		const link = element.querySelector('a');
		if (link) {
			const match = link.href.match(/\/app\/([a-zA-Z0-9]+)/);
			if (match) return match[1];
		}
		return null;
	}

	function showFolderContextMenu(e, folder) {
		const existingMenu = document.getElementById('folder-context-menu');
		if (existingMenu) existingMenu.remove();

		const menu = document.createElement('div');
		menu.id = 'folder-context-menu';
		menu.className = 'folder-context-menu';

		const renameItem = document.createElement('div');
		renameItem.className = 'folder-context-menu-item';
		renameItem.textContent = '✏️ Rename';
		renameItem.onclick = () => {
			showPrompt("Rename Folder:", folder.name, async (newName) => {
				folder.name = newName;
				await saveFolderConfiguration();
				renderFolders();
			});
			menu.remove();
		};
		menu.appendChild(renameItem);

		const colorItem = document.createElement('div');
		colorItem.className = 'folder-context-menu-item';
		colorItem.textContent = '🎨 Change Color';
		colorItem.onclick = () => {
			showColorPicker(folder.color, async (newColor) => {
				folder.color = newColor;
				await saveFolderConfiguration();
				renderFolders();
			});
			menu.remove();
		};
		menu.appendChild(colorItem);

		const deleteItem = document.createElement('div');
		deleteItem.className = 'folder-context-menu-item delete';
		deleteItem.textContent = '🗑️ Delete';
		deleteItem.onclick = () => {
			showConfirm(`Delete folder "${folder.name}"? Conversations will return to the main list.`, async () => {
				folders = folders.filter(f => f.id !== folder.id);
				// Remove folder assignments for convos in this folder
				Object.keys(conversationFolders).forEach(k => {
					if (conversationFolders[k] === folder.id) delete conversationFolders[k];
				});
				await saveFolderConfiguration();
				renderFolders();
				// Trigger reprocessing of lists to move items back
				processConversationItems(document.querySelector(FOLDER_INJECTION_POINT_SELECTOR));
			}, "Delete", "dialog-btn-delete");
			menu.remove();
		};
		menu.appendChild(deleteItem);

		document.body.appendChild(menu);
		menu.style.display = 'block';
		menu.style.left = e.pageX + 'px';
		menu.style.top = e.pageY + 'px';

		const closeMenu = () => {
			menu.remove();
			document.removeEventListener('click', closeMenu);
		};
		setTimeout(() => document.addEventListener('click', closeMenu), 0);
	}

	function processConversationItems(chatHistoryList) {
		if (!chatHistoryList) return;

		// 1. Identify Main Conversation Container (Gemini's list)
		// Usually it's a specific container inside chatHistoryList
		const mainList = chatHistoryList.querySelector(FOLDER_CHAT_LIST_CONTAINER_SELECTOR) || chatHistoryList;

		// 2. Find all conversation items
		const items = Array.from(document.querySelectorAll(FOLDER_CHAT_ITEM_SELECTOR)).filter(el => {
			// Filter out items that are already inside our folders to update them if state changed,
			// or items in the main list.
			return listContains(chatHistoryList, el) || listContains(document.getElementById('folder-container'), el);
		});

		items.forEach(item => {
			// Ensure it has the sortable class/structure
			if (!item.parentNode.classList.contains('conversation-items-container')) {
				// Wrap if necessary or apply class (Gemini structure varies)
				// Note: Gemini usually has items directly in a container.
				// We might need to make sure the ITEM itself is draggable.
				item.classList.add('conversation-items-container'); // reuse class for styling
			}

			const convoId = getConversationId(item);
			if (!convoId) return;

			const assignedFolderId = conversationFolders[convoId];

			if (assignedFolderId) {
				// Should be in a folder
				const folderContent = document.querySelector(`.folder-content[data-folder-id="${assignedFolderId}"]`);
				if (folderContent && !folderContent.contains(item)) {
					folderContent.appendChild(item);
				}
			} else {
				// Should be in the main list
				// This is tricky because Gemini renders this list dynamically.
				// If we moved it out, we might need to move it back to a specific place or just 'unhide' it if we hid it.
				// For now, appending to the main chat list container if found.
				if (mainList && !mainList.contains(item)) {
					// Try to place it back roughly where it belongs by date? Hard.
					// Just append to top or bottom?
					mainList.appendChild(item);
				}
			}
		});

		// 3. Ensure Main List is Sortable (so items can be dragged FROM it)
		if (mainList && !mainList.classList.contains('gemini-mod-sortable-init')) {
			mainList.classList.add('gemini-mod-sortable-init');
			new Sortable(mainList, {
				group: 'conversations',
				animation: 150,
				onAdd: async (evt) => {
					// Item dragged BACK to main list
					const item = evt.item;
					const convoId = getConversationId(item);
					if (convoId && conversationFolders[convoId]) {
						delete conversationFolders[convoId];
						await saveFolderConfiguration();
					}
				}
			});
		}
	}

	function listContains(list, node) {
		return list && list.contains(node);
	}


	// --- Core Actions (Download, PDF, Copy) ---
	// kept as is, but ensuring they use displayUserscriptMessage via helper

	function getCanvasContent() {
		// More robust detection of the panel
		const panels = document.querySelectorAll('code-immersive-panel, immersive-panel, .immersive-panel-container');

		for (const panel of panels) {
			// Helper to check a root (Light or Shadow)
			const checkRoot = (root) => {
				if (!root) return null;

				const titleEl = root.querySelector('h2.title-text, .title, span[data-test-id="title"]');
				const title = titleEl ? titleEl.textContent.trim() : "gemini_artifact";

				// 1. Try Monaco Editor (Gemini Canvas Code)
				// Monaco uses virtualized rendering, but usually puts lines in .view-lines.
				// This selector tries to find the main content area of monaco.
				const monacoEditor = root.querySelector('.monaco-editor');
				if (monacoEditor) {
					const viewLines = monacoEditor.querySelector('.view-lines');
					if (viewLines) {
						// innerText of view-lines usually preserves formatting reasonably well for copy
						return { type: 'code', text: viewLines.innerText, title: title };
					}
				}

				// 2. Try Standard Code Extraction (pre/code)
				const codeBlock = root.querySelector('code, pre');
				if (codeBlock) {
					return { type: 'code', text: codeBlock.textContent, title: title };
				}

				// 3. Try Document Extraction (ProseMirror / ContentEditable)
				// Use the constant if available in scope, ensuring we match the defined selectors
				const editor = root.querySelector(GEMINI_DOC_CANVAS_EDITOR_SELECTOR) || root.querySelector('[contenteditable="true"]');
				if (editor) {
					const docTitle = title === "gemini_artifact" ? "GEMINI_DOCUMENT" : title;
					return { type: 'text', text: editor.innerText, title: docTitle };
				}
				return null;
			};

			// Check Shadow DOM first (most likely for custom elements)
			if (panel.shadowRoot) {
				const shadowResult = checkRoot(panel.shadowRoot);
				if (shadowResult) return shadowResult;
			}

			// Check Light DOM
			const lightResult = checkRoot(panel);
			if (lightResult) return lightResult;
		}

		return null;
	}

	async function handleCopy() {
		const content = getCanvasContent();
		if (content) {
			try {
				await navigator.clipboard.writeText(content.text);
				displayMessage("Content copied to clipboard!", false);
			} catch (err) {
				displayMessage("Failed to copy: " + err.message);
			}
		} else {
			displayMessage("No active canvas content found to copy.");
		}
	}

	function handleGlobalCanvasDownload() {
		const content = getCanvasContent();
		if (content) {
			let filename = (content.title || "gemini_export").replace(INVALID_FILENAME_CHARS_REGEX, "_");

			// Only append extension if it doesn't look like a filename already
			if (!FILENAME_WITH_EXT_REGEX.test(filename)) {
				filename += "." + DEFAULT_DOWNLOAD_EXTENSION;
			}

			downloadString(content.text, filename);
		} else {
			displayMessage("No active canvas content found to download.");
		}
	}

	function downloadString(text, filename) {
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function handlePDFExport() {
		const content = getCanvasContent();
		if (!content) {
			displayMessage("No content to export.");
			return;
		}

		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		const margins = { top: 20, bottom: 20, left: 20, right: 20 };
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const maxLineWidth = pageWidth - margins.left - margins.right;

		doc.setFont("courier", "normal");
		doc.setFontSize(10);

		let y = margins.top;
		if (content.title) {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(14);
			doc.text(content.title, margins.left, y);
			y += 10;
			doc.setFont("courier", "normal");
			doc.setFontSize(10);
		}

		const lines = doc.splitTextToSize(content.text, maxLineWidth);

		lines.forEach(line => {
			if (y + 10 > pageHeight - margins.bottom) {
				doc.addPage();
				y = margins.top;
			}
			doc.text(line, margins.left, y);
			y += 5; // Line height
		});

		const filename = (content.title || "gemini_export").replace(INVALID_FILENAME_CHARS_REGEX, "_") + ".pdf";
		doc.save(filename);
	}


	// --- Initialization ---

	async function init() {
		console.log("Gemini Mod Userscript: Initializing (Modular Version)...");

		// Inject Styles (Using Module)
		injectCSS();

		// Handle Drive Auth Callback (if this is a popup)
		GeminiMod.drive.handleAuthCallback();

		// Setup Drive Message Listener (for main window)
		// Pass a callback to update UI if settings panel is open
		GeminiMod.drive.setupAuthMessageListener(() => {
			updateSettingsPanelDriveStatus();
		});


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
				displayMessage("Error initializing toolbar. See console.");
			}
		}, 1500);
	}

	// Run Init
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();