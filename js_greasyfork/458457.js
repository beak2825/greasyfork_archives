// ==UserScript==
// @name         Canvas Markdown
// @namespace    https://theusaf.org
// @version      3.0.2
// @description  Adds a markdown editor to Canvas
// @author       theusaf
// @supportURL   https://github.com/theusaf/canvas-markdown/issues
// @copyright    (c) 2023-2024 theusaf
// @homepage     https://github.com/theusaf/canvas-markdown
// @license      MIT
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458457/Canvas%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/458457/Canvas%20Markdown.meta.js
// ==/UserScript==
let highlight, languages;
try {
    if (new URL(document.querySelector("#global_nav_help_link")
        ?.href ?? "")?.hostname === "help.instructure.com") {
        console.log("[Canvas Markdown] Detected Canvas page, loading...");
        (async () => {
            console.log("[Canvas Markdown] Importing dependencies...");
            await import("https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/codemirror/codemirror.js");
            await import("https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/codemirror/mode/markdown/markdown.js");
            highlight = (await import("https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/highlight/es/core.min.js")).default;
            languages = (await import("https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/highlight/languages.js")).default;
            const s = document.createElement("script");
            s.src =
                "https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js";
            document.head.append(s);
            const showdownKatex = document.createElement("script");
            showdownKatex.src =
                "https://cdn.jsdelivr.net/npm/showdown-katex@0.8.0/dist/showdown-katex.min.js";
            document.head.append(showdownKatex);
            const codemirrorCSS = document.createElement("link");
            codemirrorCSS.rel = "stylesheet";
            codemirrorCSS.href =
                "https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/codemirror/codemirror.css";
            const highlightCSS = document.createElement("link");
            highlightCSS.rel = "stylesheet";
            highlightCSS.href =
                "https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/highlight/styles/github-dark.min.css";
            document.head.append(highlightCSS);
            document.head.append(codemirrorCSS);
            console.log("[Canvas Markdown] Setting up...");
            setupWatcher();
            console.log("[Canvas Markdown] Done.");
        })();
    }
    else {
        console.log("[Canvas Markdown] Not a Canvas page, skipping...");
    }
}
catch (e) {
    /* ignore */
}
function getEditorElements() {
    return [
        ...document.querySelectorAll(".ic-RichContentEditor:not([md-id=canvas-container])"),
    ];
}
function setupWatcher() {
    setInterval(() => {
        const potentialEditorElements = getEditorElements();
        if (potentialEditorElements.length) {
            for (const editorElement of potentialEditorElements) {
                const markdownEditor = new MarkdownEditor(editorElement);
                markdownEditor.setup();
            }
        }
    }, 1e3);
}
var MarkdownEditorMode;
(function (MarkdownEditorMode) {
    MarkdownEditorMode[MarkdownEditorMode["RAW"] = 0] = "RAW";
    MarkdownEditorMode[MarkdownEditorMode["PRETTY"] = 1] = "PRETTY";
})(MarkdownEditorMode || (MarkdownEditorMode = {}));
// https://developer.mozilla.org/en-US/docs/Web/API/btoa#unicode_strings
function toBinary(str) {
    const codeUnits = Uint16Array.from({ length: str.length }, (_, index) => str.charCodeAt(index)), charCodes = new Uint8Array(codeUnits.buffer);
    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}
function fromBinary(binary) {
    const bytes = Uint8Array.from({ length: binary.length }, (element, index) => binary.charCodeAt(index)), charCodes = new Uint16Array(bytes.buffer);
    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}
// From https://github.com/halbgut/showdown-footnotes
function showdownFootnotes(options) {
    const { prefix } = options ?? { prefix: "footnote" };
    return [
        // Bottom footnotes
        {
            type: "lang",
            filter: (text, converter) => {
                const regex = /^\[\^([\w]+)\]:[^\S\r\n]*(.*(\n[^\S\r\n]{2,}.*)*)$/gm, regex2 = new RegExp(`\n${regex.source}`, "gm"), footnotes = text.match(regex), footnotesOutput = [];
                if (footnotes) {
                    for (const footnote of footnotes) {
                        const name = footnote.match(/^\[\^([\w]+)\]/)[1], footnoteContent = footnote.replace(/^\[\^([\w]+)\]:[^\S\r\n]*/, "");
                        let content = converter.makeHtml(footnoteContent.replace(/[^\S\r\n]{2}/gm, ""));
                        if (content.startsWith("<p>") &&
                            content.endsWith("</p>") &&
                            !footnoteContent.startsWith("<p>")) {
                            content = content.slice(3, -4);
                        }
                        footnotesOutput.push(`<li class="footnote" value="${name}" id="${prefix}-ref-${name}">${content}</li>`);
                    }
                }
                text = text.replace(regex2, "").trim();
                if (footnotesOutput.length) {
                    text += `<hr id="showdown-footnote-seperator"><ol class="footnotes">${footnotesOutput.join("\n")}</ol>`;
                }
                return text;
            },
        },
        // Inline footnotes
        {
            type: "lang",
            filter: (text) => text.replace(/\[\^([\w]+)\]/gm, (str, name) => `<a href="#${prefix}-ref-${name}"><sup>[${name}]</sup></a>`),
        },
    ];
}
function showdownSpecialBlocks() {
    function createImage(icon) {
        return `<span style="font-size: 1.25rem; width: 1.25rem">${icon}</span>`;
    }
    function replacer(prefix, svg, type) {
        return `${prefix}<p class="cm-alert-${type}" style="display: flex; align-items: center; color: ${specialBlockColors[type]}">${createImage(svg)}<span style="margin-left: 0.5rem;">${type[0].toUpperCase() + type.slice(1)}</span></p>`;
    }
    const specialBlockColors = {
        note: "#1f6fec",
        tip: "#228636",
        caution: "#da3333",
        warning: "#9e6a00",
        important: "#8957e0",
    };
    return [
        {
            type: "lang",
            regex: /(>\s*)\[!NOTE]/,
            replace: (_, prefix) => replacer(prefix, "🛈", "note"),
        },
        {
            type: "lang",
            regex: /(>\s*)\[!TIP]/,
            replace: (_, prefix) => replacer(prefix, "💡", "tip"),
        },
        {
            type: "lang",
            regex: /(>\s*)\[!CAUTION]/,
            replace: (_, prefix) => replacer(prefix, "🛑", "caution"),
        },
        {
            type: "lang",
            regex: /(>\s*)\[!WARNING]/,
            replace: (_, prefix) => replacer(prefix, "⚠", "warning"),
        },
        {
            type: "lang",
            regex: /(>\s*)\[!IMPORTANT]/,
            replace: (_, prefix) => replacer(prefix, "🗪", "important"),
        },
        {
            type: "output",
            regex: /<blockquote>\s*<p class="cm-alert-(\w+)"/gm,
            replace(text, type) {
                const color = specialBlockColors[type];
                if (!color)
                    return text;
                return `<blockquote style="border-left-color: ${color};"><p class="cm-alert-${type}"`;
            },
        },
    ];
}
class MarkdownEditor {
    editorContainer;
    canvasTextArea;
    canvasResizeHandle;
    canvasSwitchEditorButton;
    canvasFullScreenButton;
    markdownTextContainer;
    markdownPrettyContainer;
    markdownTextArea;
    markdownEditor;
    markdownSettingsButton;
    markdownSwitchButton;
    markdownSwitchTypeButton;
    markdownSettingsExistingContainer;
    encodedOutput;
    showdownConverter;
    active = false;
    mode = MarkdownEditorMode.PRETTY;
    activating = false;
    uniqueId = Date.now().toString();
    constructor(editor) {
        this.editorContainer = editor;
    }
    setup() {
        this.editorContainer.setAttribute("md-id", "canvas-container");
        if (this.isReady()) {
            this.canvasTextArea = this.getCanvasTextArea();
            this.canvasResizeHandle = this.getCanvasResizeHandle();
            this.canvasSwitchEditorButton = this.getCanvasSwitchEditorButton();
            this.canvasFullScreenButton = this.getCanvasFullScreenButton();
            this.injectMarkdownEditor();
            this.setupShowdown();
            this.injectMarkdownSettingsButton();
            this.injectMarkdownUI();
            this.applyEventListeners();
        }
        else {
            setTimeout(() => this.setup(), 1e3);
        }
    }
    isReady() {
        return !!(this.getCanvasTextArea() &&
            this.getCanvasResizeHandle() &&
            this.getCanvasSwitchEditorButton() &&
            this.getCanvasFullScreenButton());
    }
    getCanvasFullScreenButton() {
        return this.editorContainer.querySelector("[data-btn-id=rce-fullscreen-btn]");
    }
    setupShowdown() {
        showdown.setFlavor("github");
        this.showdownConverter = new showdown.Converter({
            ghMentions: false,
            parseImgDimensions: true,
            underline: true,
            extensions: [
                window.showdownKatex({}),
                showdownFootnotes({
                    prefix: this.uniqueId,
                }),
                showdownSpecialBlocks(),
            ],
        });
    }
    getCanvasResizeHandle() {
        return this.editorContainer.querySelector("[data-btn-id=rce-resize-handle]");
    }
    getCanvasTextArea() {
        return this.editorContainer.querySelector("textarea[data-rich_text=true]");
    }
    getCanvasSwitchEditorButton() {
        return this.editorContainer.querySelector("[data-btn-id=rce-edit-btn]");
    }
    isCanvasInTextMode() {
        return /rich text/i.test(this.canvasSwitchEditorButton.title);
    }
    getCanvasSwitchTypeButton() {
        return this.editorContainer.querySelector("[data-btn-id=rce-editormessage-btn]");
    }
    isCanvasInPlainTextMode() {
        return /pretty html/i.test(this.getCanvasSwitchTypeButton().textContent);
    }
    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    injectMarkdownEditor() {
        const editorContent = document.createElement("template");
        editorContent.innerHTML = `
      <div md-id="markdown-editor-text-container" style="display: none;">
        <textarea md-id="markdown-editor" style="height: 400px; resize: none;"></textarea>
      </div>
      <div md-id="markdown-editor-pretty-container">
        <div class="RceHtmlEditor">
          <div>
            <label style="display: block">
              <span></span>
              <div class="react-codemirror2" md-id="markdown-editor-codemirror-container">
                <!-- Insert CodeMirror editor here -->
              </div>
            </label>
          </div>
        </div>
      </div>
    `;
        this.editorContainer
            .querySelector(".rce-wrapper")
            .prepend(editorContent.content.cloneNode(true));
        this.markdownTextContainer = this.editorContainer.querySelector("[md-id=markdown-editor-text-container]");
        this.markdownTextArea = this.editorContainer.querySelector("[md-id=markdown-editor]");
        this.markdownPrettyContainer = this.editorContainer.querySelector("[md-id=markdown-editor-pretty-container]");
        this.markdownEditor = CodeMirror(this.markdownPrettyContainer.querySelector("[md-id=markdown-editor-codemirror-container]"), {
            mode: "markdown",
            lineNumbers: true,
            lineWrapping: true,
        });
        const codeMirrorEditor = this.markdownEditor.getWrapperElement();
        codeMirrorEditor.style.height = "400px";
        codeMirrorEditor.setAttribute("md-id", "markdown-editor-codemirror");
        // Hide the markdown editor. By doing it here, it also allows CodeMirror to
        // properly render when the editor is shown.
        this.markdownPrettyContainer.style.display = "none";
    }
    displaySettings() {
        const settingsUI = document.createElement("template");
        settingsUI.innerHTML = `
      <div md-id="settings-container">
        <style>
          [md-id=settings-container] {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgb(0, 0, 0, 0.5);
            z-index: 999;
            display: flex;
          }
          [md-id=settings-container] > div {
            width: 90%;
            height: 90%;
            margin: auto;
            overflow-y: auto;
            background-color: white;
            padding: 1rem;
            position: relative;
            border-radius: 0.5rem;
          }
          [md-id=settings-container] h2 {
            margin-top: 1rem;
          }
          [md-id=close-button] {
            position: fixed;
            top: 2%;
            right: 4%;
            padding: 0.5rem;
            cursor: pointer;
            width: 1rem;
            height: 1rem;
            color: black;
            font-size: 1.5rem;
            text-align: center;
            margin: 0.5rem;
            text-shadow: black 0 0 0.2rem;
          }
          [md-id=settings-form-container]
          [md-id=settings-existing-container] {
            display: flex;
            flex-direction: column;
            margin-top: 1rem;
          }
          [md-id=settings-form-label-container] {
            display: flex;
            flex-direction: row;
            margin-bottom: 0.5rem;
          }
          [md-id=settings-form-label-container] > * {
            font-weight: bold;
            flex: 1;
            padding: 0.5rem;
            font-size: 1.2rem;
          }
          [md-id=settings-existing-input-container] {
            margin-top: 1rem;
          }
          [md-id=settings-existing-container] {
            margin-top: 1rem;
            border-top: 0.15rem solid #ccc;
          }
          [md-id=settings-form-input-container],
          [md-id=settings-existing-input-container] {
            display: flex;
            flex-direction: row;
          }
          [md-id=settings-form-input-container] > *,
          [md-id=settings-existing-input-container] > * {
            flex: 1;
            padding: 0.5rem;
            display: flex;
          }
          [md-id=settings-form-input-container] > * > input,
          [md-id=settings-form-input-container] > * > textarea,
          [md-id=settings-existing-input-container] > * > input,
          [md-id=settings-existing-input-container] > * > textarea {
            flex: 1;
          }
          [md-id=settings-form-label-container] > :nth-child(2n + 1),
          [md-id=settings-form-input-container] > :nth-child(2n + 1),
          [md-id=settings-existing-input-container] > :nth-child(2n + 1) {
            background-color: #eee;
          }
          [md-id="settings-download-button-container"] > * {
            padding: 0.5rem;
            background-color: #eee;
            border: 0.15rem solid #ccc;
            border-radius: 0.5rem;
            margin: 0.5rem;
            cursor: pointer;
          }
          [md-id="settings-form-save-button"] {
            height: 2rem;
          }
          [md-id="settings-form-save-tooltip"] {
            position: absolute;
            top: -4.25rem;
            left: -25%;
            width: 4rem;
            height: 4rem;
            pointer-events: none;
            background-color: black;
            text-align: center;
            border-radius: 0.5rem;
            align-items: center;
            justify-content: center;
            display: flex;
            color: white;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          [md-id="settings-remove-backup-label"] {
            display: flex;
            align-items: center;
          }
          [md-id="settings-remove-backup-label"] input {
            display: none;
          }
          [md-id="settings-remove-backup-label"] span {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
            border: 0.15rem solid #ccc;
            margin-right: 0.5rem;
            cursor: pointer;
          }
          [md-id="settings-remove-backup-label"] input:checked + span {
            background-color: blue;
          }
        </style>
        <div>
          <span md-id="close-button">X</span>
          <h2>Canvas Markdown Settings</h2>
          <h3>Custom Styles</h3>
          <p>
            You can use these settings to customize the default styles of HTML elements in the output.
            In the form below, input a tag or CSS selector to target in the first section. In the second section,
            input the CSS properties you want to apply to the element as you would in a style attribute.
          </p>
          <div md-id="settings-form-container">
            <!-- Insert form here -->
            <div md-id="settings-form-label-container">
              <label for="cm-settings-selector">Selector</label>
              <label for="cm-settings-style">Style</label>
              <span>Style Preview</span>
            </div>
            <div md-id="settings-form-input-container">
              <!-- Insert form inputs here -->
            </div>
          </div>
          <div md-id="settings-existing-container" style="">
            <!-- Insert existing settings here -->
          </div>
          <h3>Remove Markdown Backup</h3>
          <div>
            <p>
              By default, Canvas Markdown will save a backup of the raw markdown code in an invisible element at the end of the HTML output.
              This is to allow you to edit the markdown code later. If you do not want this backup, you can disable it here. This may be done
              to reduce the size of the HTML output and stay within
              <a href="https://community.canvaslms.com/t5/Canvas-Resource-Documents/Canvas-Character-Limits/ta-p/529365">character limits</a>.
            </p>
            <p>
              When this option is enabled, the original markdown source will be lost after submission or page refresh. Attempting to edit
              the markdown code later will result in a blank editor.
            </p>
            </p>
            <label for="cm-settings-remove-backup" md-id="settings-remove-backup-label">
              <input type="checkbox" id="cm-settings-remove-backup" />
              <span></span>
              Remove Markdown Backup
            </label>
          </div>
          <h3>Import/Export Settings</h3>
          <div md-id="settings-download-container">
            <!-- Insert download/load settings here -->
            <div md-id="settings-download-button-container">
              <label md-id="settings-download-button">Download Settings</label>
              <label for="cm-settings-upload-input" md-id="settings-upload-button">
                Upload Settings
              </label>
              <input
                type="file"
                accept=".json"
                id="cm-settings-upload-input"
                md-id="settings-upload-input"
                style="display: none;" />
            </div>
          </div>
        </div>
      </div>
    `;
        document.body.append(settingsUI.content.cloneNode(true));
        const settingsContainer = document.querySelector("[md-id=settings-container]"), closeButton = document.querySelector("[md-id=close-button]"), downloadButton = document.querySelector("[md-id=settings-download-button]"), uploadButton = document.querySelector("[md-id=settings-upload-button]"), removeBackupCheckbox = document.querySelector("#cm-settings-remove-backup");
        closeButton.addEventListener("click", () => {
            settingsContainer.remove();
        });
        downloadButton.addEventListener("click", () => {
            const settings = this.loadSettings();
            const blob = new Blob([JSON.stringify(settings)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "canvas-markdown-settings.json";
            a.click();
            URL.revokeObjectURL(url);
        });
        uploadButton.addEventListener("click", () => {
            const input = document.querySelector("[md-id=settings-upload-input]");
            input.onchange = () => {
                const file = input.files[0];
                if (file.type !== "application/json") {
                    alert("Invalid file type");
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const settings = JSON.parse(reader.result);
                        this.saveSettings(settings);
                        settingsContainer.remove();
                        this.displaySettings();
                    }
                    catch (e) {
                        alert("Invalid file");
                    }
                };
                reader.readAsText(file);
            };
        });
        removeBackupCheckbox.addEventListener("change", () => {
            this.saveSettings({
                removeMarkdownBackup: removeBackupCheckbox.checked,
            });
        });
        this.markdownSettingsExistingContainer = document.querySelector("[md-id=settings-existing-container]");
        const settings = this.loadSettings();
        removeBackupCheckbox.checked = settings.removeMarkdownBackup;
        for (const setting of settings.customStyles) {
            const container = this.createExistingSettingsContainer();
            this.markdownSettingsExistingContainer.append(container);
            this.addSettingsForm(container, setting, true);
        }
        this.addSettingsForm(document.querySelector("[md-id=settings-form-input-container]"), null, false);
    }
    addSettingsForm(formContainer, setting = null, isExisting = true) {
        const formInputTemplate = document.createElement("template");
        formInputTemplate.innerHTML = `
      <span>
        <input
          type="text" id="cm-settings-selector"
          md-id="settings-form-selector"
          placeholder="e.g. h1, .header, #header" />
      </span>
      <span>
        <textarea
          id="cm-settings-style"
          md-id="settings-form-style"
          placeholder="e.g. color: red; font-weight: bold;"></textarea>
      </span>
      <span style="justify-content: space-between; display: flex;">
        <div>
          <span md-id="settings-form-style-preview">Hello World</span>
        </div>
        <div>
          <span style="position: relative">
            <span md-id="settings-form-save-tooltip"></span>
            <button md-id="settings-form-save-button">Save</button>
          </span>
          <button md-id="settings-form-delete-button" style="margin-left: 0.5rem">Delete</button>
        </div>
      </span>
    `;
        formContainer.append(formInputTemplate.content.cloneNode(true));
        const saveButton = formContainer.querySelector("[md-id=settings-form-save-button]"), deleteButton = formContainer.querySelector("[md-id=settings-form-delete-button]"), stylePreview = formContainer.querySelector("[md-id=settings-form-style-preview]"), saveTooltip = formContainer.querySelector("[md-id=settings-form-save-tooltip]"), selectorInput = formContainer.querySelector("[md-id=settings-form-selector]"), styleInput = formContainer.querySelector("[md-id=settings-form-style]");
        if (!isExisting) {
            deleteButton.style.display = "none";
        }
        if (setting) {
            selectorInput.value = setting.target;
            styleInput.value = setting.style;
            stylePreview.style.cssText = setting.style;
        }
        // Add event listeners
        deleteButton.addEventListener("click", () => {
            formContainer.remove();
            this.saveSettingsFromForm();
        });
        saveButton.addEventListener("click", () => {
            const isValid = this.isSettingsValid({
                target: selectorInput.value,
                style: styleInput.value,
            });
            if (isValid !== true) {
                saveTooltip.style.opacity = "1";
                saveTooltip.textContent = isValid;
                saveTooltip.style.backgroundColor = "red";
                setTimeout(() => {
                    saveTooltip.style.opacity = "0";
                }, 500);
            }
            else {
                if (!isExisting) {
                    const container = this.createExistingSettingsContainer();
                    this.markdownSettingsExistingContainer.append(container);
                    this.addSettingsForm(container, {
                        target: selectorInput.value,
                        style: styleInput.value,
                    }, true);
                    selectorInput.value = "";
                    styleInput.value = "";
                    stylePreview.style.cssText = "";
                }
                this.saveSettingsFromForm();
                saveTooltip.style.opacity = "1";
                saveTooltip.textContent = "Saved!";
                saveTooltip.style.backgroundColor = "green";
                setTimeout(() => {
                    saveTooltip.style.opacity = "0";
                }, 500);
            }
        });
        styleInput.addEventListener("input", () => {
            stylePreview.style.cssText = styleInput.value;
        });
    }
    createExistingSettingsContainer() {
        const existingSettingsContainer = document.createElement("div");
        existingSettingsContainer.setAttribute("md-id", "settings-existing-input-container");
        return existingSettingsContainer;
    }
    isSettingsValid(settings) {
        const { target, style } = settings;
        if (!target.trim() || !style.trim())
            return "Empty inputs";
        try {
            document.querySelector(target);
        }
        catch (e) {
            return "Invalid selector";
        }
        return true;
    }
    saveSettingsFromForm() {
        const settings = this.getSettingsFromForm();
        this.saveSettings({
            customStyles: settings,
        });
    }
    getSettingsFromForm() {
        const formContainers = [
            ...this.markdownSettingsExistingContainer.querySelectorAll("[md-id=settings-existing-input-container]"),
        ], settings = [];
        for (const formContainer of formContainers) {
            const selectorInput = formContainer.querySelector("[md-id=settings-form-selector]"), styleInput = formContainer.querySelector("[md-id=settings-form-style]"), setting = {
                target: selectorInput.value,
                style: styleInput.value,
            };
            if (this.isSettingsValid(setting) === true)
                settings.push(setting);
        }
        return settings;
    }
    loadSettings() {
        const defaultSettings = {
            customStyles: [],
            removeMarkdownBackup: false,
        };
        const settings = JSON.parse(window.localStorage.getItem("canvas-markdown-settings") ?? "{}");
        return {
            ...defaultSettings,
            ...settings,
        };
    }
    saveSettings(settings) {
        const existingSettings = this.loadSettings();
        window.localStorage.setItem("canvas-markdown-settings", JSON.stringify({
            ...existingSettings,
            ...settings,
        }));
    }
    applyEventListeners() {
        let updateTimeout;
        const updateData = () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                this.updateCanvasData();
            }, 500);
        };
        this.markdownTextArea.addEventListener("input", () => updateData());
        this.markdownEditor.on("change", () => {
            this.markdownTextArea.value = this.markdownEditor.getValue();
            updateData();
        });
        const switchButton = this.canvasSwitchEditorButton;
        switchButton.onclick = () => {
            if (this.activating)
                return;
            if (this.active)
                this.deactivate();
        };
        this.markdownSwitchButton.addEventListener("click", () => {
            if (this.active) {
                this.deactivate();
                switchButton.click();
            }
            else {
                this.activate();
            }
        });
        this.markdownSettingsButton.addEventListener("click", () => {
            this.displaySettings();
        });
        this.canvasFullScreenButton.onclick = () => {
            setTimeout(() => {
                this.applyCanvasResizeHandleEventListeners();
                this.updateEditorHeight();
            }, 500);
        };
        this.applyCanvasResizeHandleEventListeners();
    }
    applyCanvasResizeHandleEventListeners() {
        if (!this.getCanvasResizeHandle())
            return;
        this.canvasResizeHandle = this.getCanvasResizeHandle();
        this.canvasResizeHandle.onmousemove = () => this.updateEditorHeight();
        this.canvasResizeHandle.onkeydown = () => this.updateEditorHeight();
    }
    updateEditorHeight() {
        const height = this.canvasTextArea.style.height;
        this.markdownTextArea.style.height = height;
        this.markdownEditor.getWrapperElement().style.height = height;
    }
    activate() {
        this.active = true;
        this.activating = true;
        this.markdownTextContainer.style.display = "none";
        this.markdownPrettyContainer.style.display = "block";
        if (!this.isCanvasInTextMode()) {
            this.canvasSwitchEditorButton.click();
        }
        this.injectMarkdownSwitchTypeButton();
        this.mode = MarkdownEditorMode.PRETTY;
        if (this.markdownSwitchTypeButton) {
            this.markdownSwitchTypeButton.style.display = "block";
            this.markdownSwitchTypeButton.textContent =
                "Switch to Raw Markdown editor";
        }
        this.getCanvasSwitchTypeButton().style.display = "none";
        if (!this.isCanvasInPlainTextMode()) {
            this.getCanvasSwitchTypeButton().click();
        }
        const markdownCode = this.extractMarkdown(this.canvasTextArea.value);
        this.markdownTextArea.value = markdownCode;
        this.markdownEditor.setValue(markdownCode);
        this.canvasTextArea.parentElement.style.display = "none";
        this.markdownEditor.focus();
        this.activating = false;
    }
    deactivate() {
        this.active = false;
        this.markdownTextContainer.style.display = "none";
        this.markdownPrettyContainer.style.display = "none";
        if (this.markdownSwitchTypeButton) {
            this.markdownSwitchTypeButton.style.display = "none";
        }
        if (this.getCanvasSwitchTypeButton()) {
            this.getCanvasSwitchTypeButton().style.display = "block";
        }
        this.canvasTextArea.parentElement.style.display = "block";
    }
    async updateCanvasData() {
        const markdownCode = this.markdownTextArea.value, output = await this.generateOutput(markdownCode);
        this.canvasTextArea.value = output;
        this.activateCanvasCallbacks();
    }
    activateCanvasCallbacks() {
        const customEvent = new Event("input");
        customEvent.keyCode = 13;
        customEvent.which = 13;
        customEvent.location = 0;
        customEvent.code = "Enter";
        customEvent.key = "Enter";
        this.canvasTextArea.dispatchEvent(customEvent);
    }
    injectMarkdownUI() {
        const markdownSwitchButton = document.createElement("button"), switchButton = this.canvasSwitchEditorButton;
        markdownSwitchButton.setAttribute("type", "button");
        markdownSwitchButton.setAttribute("title", "Switch to Markdown editor");
        markdownSwitchButton.className = switchButton.className;
        markdownSwitchButton.setAttribute("style", switchButton.style.cssText);
        const markdownSwitchButtonContent = document.createElement("template");
        markdownSwitchButtonContent.innerHTML = `
    <span class="${switchButton.firstElementChild.className}">
      <span class="${switchButton.firstElementChild.firstElementChild.className}" style="${switchButton.firstElementChild.firstElementChild.style
            .cssText} direction="row" wrap="no-wrap">
        <span class="${switchButton.firstElementChild.firstElementChild.firstElementChild
            .className}">
          <span>M🠗</span>
        </span>
      </span>
    </span>
    `;
        markdownSwitchButton.append(markdownSwitchButtonContent.content.cloneNode(true));
        this.markdownSwitchButton = markdownSwitchButton;
        this.insertAfter(markdownSwitchButton, switchButton);
    }
    injectMarkdownSettingsButton() {
        const settingsButton = document.createElement("button"), settingsButtonContent = document.createElement("template"), switchButton = this.canvasSwitchEditorButton;
        settingsButton.setAttribute("type", "button");
        settingsButton.setAttribute("title", "Markdown settings");
        settingsButton.className = switchButton.className;
        settingsButton.setAttribute("style", switchButton.style.cssText);
        settingsButtonContent.innerHTML = `
    <span class="${switchButton.firstElementChild.className}">
      <span class="${switchButton.firstElementChild.firstElementChild.className}" style="${switchButton.firstElementChild.firstElementChild.style
            .cssText} direction="row" wrap="no-wrap">
        <span class="${switchButton.firstElementChild.firstElementChild.firstElementChild
            .className}">
          <span>M⚙</span>
        </span>
      </span>
    </span>
    `;
        settingsButton.append(settingsButtonContent.content.cloneNode(true));
        this.markdownSettingsButton = settingsButton;
        this.insertAfter(settingsButton, switchButton);
    }
    injectMarkdownSwitchTypeButton() {
        if (this.markdownSwitchTypeButton?.isConnected)
            return;
        const button = document.createElement("button"), switchButton = this.getCanvasSwitchTypeButton();
        button.setAttribute("type", "button");
        button.className = switchButton.className;
        button.setAttribute("style", switchButton.style.cssText);
        const buttonContent = document.createElement("template");
        buttonContent.innerHTML = `
    <span class="${switchButton.firstElementChild.className}">
      <span class="${switchButton.firstElementChild.firstElementChild.className}" md-id="md-switch-type-button">
        Switch to raw Markdown editor
      </span>
    </span>
    `;
        button.append(buttonContent.content.cloneNode(true));
        this.markdownSwitchTypeButton = button;
        this.insertAfter(button, switchButton);
        this.markdownSwitchTypeButton.addEventListener("click", () => {
            if (!this.active)
                return;
            if (this.mode === MarkdownEditorMode.PRETTY) {
                this.mode = MarkdownEditorMode.RAW;
                this.markdownPrettyContainer.style.display = "none";
                this.markdownTextContainer.style.display = "block";
                this.markdownSwitchTypeButton.textContent =
                    "Switch to Pretty Markdown editor";
            }
            else {
                this.mode = MarkdownEditorMode.PRETTY;
                this.markdownPrettyContainer.style.display = "block";
                this.markdownTextContainer.style.display = "none";
                this.markdownSwitchTypeButton.textContent =
                    "Switch to Raw Markdown editor";
            }
        });
    }
    /**
     * Extracts the markdown code from the html comment.
     */
    extractMarkdown(html) {
        let match = html.match(/<span class="canvas-markdown-code"[^\n]*?>\s*([\w+./=]*)\s*<\/span>/)?.[1];
        if (this.encodedOutput) {
            match = this.encodedOutput;
        }
        if (!match)
            return "";
        const decoded = atob(match);
        if (/\u0000/.test(decoded))
            return fromBinary(decoded);
        else
            return decoded;
    }
    async generateOutput(markdown) {
        const initialHTML = this.showdownConverter.makeHtml(markdown), outputHTML = await this.highlightCode(initialHTML), settings = this.loadSettings();
        let encoded;
        try {
            encoded = btoa(markdown);
        }
        catch (e) {
            encoded = btoa(toBinary(markdown));
        }
        this.encodedOutput = encoded;
        if (settings.removeMarkdownBackup) {
            return outputHTML;
        }
        else {
            return `${outputHTML}
      <span class="canvas-markdown-code" style="display: none;">${encoded}</span>`;
        }
    }
    async highlightCode(html) {
        const template = document.createElement("template");
        template.innerHTML = html;
        const codeBlocks = [
            ...template.content.querySelectorAll("pre code"),
        ];
        await this.extractLanguages(codeBlocks);
        for (const codeBlock of codeBlocks) {
            highlight.highlightElement(codeBlock);
        }
        // Remove katex-html
        const katexHTMLElements = template.content.querySelectorAll(".katex-html");
        for (const element of katexHTMLElements) {
            element.remove();
        }
        // handle tasklists
        const taskListItems = template.content.querySelectorAll(".task-list-item");
        for (const item of taskListItems) {
            const checkbox = item.querySelector("input[type=checkbox]"), checked = checkbox.checked, replacement = document.createElement("span");
            replacement.style.cssText = checkbox.style.cssText;
            replacement.style.display = "inline-block";
            replacement.style.width = "1rem";
            replacement.style.height = "1rem";
            replacement.style.border = "2px solid #ccc";
            replacement.style.borderRadius = "25%";
            if (checked) {
                replacement.style.backgroundColor = "#0099ff";
                replacement.className = "task-list-item-checked";
            }
            replacement.innerHTML = "&nbsp;";
            item.insertBefore(replacement, checkbox);
            checkbox.remove();
        }
        // Extract styles from custom settings
        const settings = this.loadSettings();
        for (const setting of settings.customStyles) {
            const { target, style } = setting;
            const targetElements = template.content.querySelectorAll(target);
            for (const targetElement of targetElements) {
                targetElement.style.cssText += style;
            }
        }
        return this.extractStyles(template);
    }
    extractStyles(template) {
        const tempDiv = document.createElement("pre"), tempCode = document.createElement("code");
        tempCode.className = "hljs";
        tempDiv.append(tempCode);
        tempDiv.style.display = "none";
        document.body.append(tempDiv);
        const hljsElements = [
            ...template.content.querySelectorAll("pre [class*=hljs]"),
        ];
        for (const element of hljsElements) {
            let hasOnErrorAttribute = false, onErrorValue = null;
            if (element.hasAttribute("onerror")) {
                hasOnErrorAttribute = true;
                onErrorValue = element.getAttribute("onerror");
                element.removeAttribute("onerror");
            }
            const testElement = tempCode.appendChild(element.cloneNode(false));
            if (hasOnErrorAttribute) {
                testElement.setAttribute("onerror", onErrorValue);
            }
            if (element.tagName === "CODE") {
                tempDiv.append(testElement);
                element.parentElement.style.backgroundColor =
                    getComputedStyle(testElement).backgroundColor;
                element.style.textShadow = "none";
                element.style.display = "block";
                element.style.overflowX = "auto";
                element.style.padding = "1em";
            }
            const computedStyle = getComputedStyle(testElement), specialClasses = {
                "hljs-deletion": "background-color",
                "hljs-addition": "background-color",
                "hljs-emphasis": "font-style",
                "hljs-strong": "font-weight",
                "hljs-section": "font-weight",
            };
            element.style.color = computedStyle.color;
            for (const [className, style] of Object.entries(specialClasses)) {
                if (testElement.classList.contains(className)) {
                    element.style.setProperty(style, computedStyle.getPropertyValue(style));
                }
            }
            testElement.remove();
        }
        const output = template.innerHTML;
        tempDiv.remove();
        return output;
    }
    async extractLanguages(codeBlocks) {
        for (const block of codeBlocks) {
            const language = block.className.match(/language-([^\s]*)/)?.[1];
            if (language && !highlight.getLanguage(language) && languages[language]) {
                const languageData = (await import(`https://cdn.jsdelivr.net/gh/theusaf/canvas-markdown@5216c569489b9aa2caa6aee49ef8aadabb1f1794/lib/highlight/es/languages/${languages[language]}.min.js`).catch(() => ({}))).default;
                if (languageData) {
                    highlight.registerLanguage(language, languageData);
                }
            }
        }
    }
}
