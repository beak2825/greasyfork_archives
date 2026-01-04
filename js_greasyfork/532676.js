// ==UserScript==
// @name        luvnotes ♡ AO3 comment notepad
// @author      luvwich
// @description another floating comment box for ao3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @include     *://archiveofourown.org/*works/*
// @include     *://archiveofourown.org/*chapters/*
// @exclude     *://archiveofourown.org/*new/*
// @exclude     *://archiveofourown.org/*edit/*
// @exclude     *://archiveofourown.org/works/new*
// @namespace   https://greasyfork.org/en/scripts/532676-luvnotes-ao3-comment-notepad/
// @version     0.1.4
// @run-at      document-end
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/532676/luvnotes%20%E2%99%A1%20AO3%20comment%20notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/532676/luvnotes%20%E2%99%A1%20AO3%20comment%20notepad.meta.js
// ==/UserScript==

const VERSION = "0.1.4";
const URL =
  "https://greasyfork.org/en/scripts/532676-luvnotes-ao3-comment-notepad";
const primary = "#0275d8";
const success = "rgba(0,150,0,0.6)";
const danger = "rgba(255,0,0,0.6)";
const MAX_CHAR_LIMIT = 10000;
const MAX_WIDTH = 500;
const PLACEHOLDER_PROMPTS = [
  "I really loved when...",
  "My absolute favorite part was...",
  "This made me feel...",
  "The way you described...",
  "I really connected with...",
  "I was really impressed by...",
  "I laughed when...",
  "I cried when...",
  "Your writing style is...",
  "It was so relatable when...",
];

const FONT_FAMILY_SANS =
  "system-ui, 'Lucida Grande', 'Lucida Sans Unicode', 'GNU Unifont', Verdana, Helvetica, sans-serif";
const COMMENT_BOX_POSITION_KEY = "commentBoxPosition";
const HIDE_ANNOUNCEMENTS_ENABLED_KEY = "hideAnnouncementsEnabled";
const HIDE_ANNOUNCEMENTS_TIMESTAMP_KEY = "hideAnnouncementsTimestamp";
const ENABLE_HOVER_QUOTE_KEY = "enableHoverQuote";
const ICON_COLOR_KEY = "iconColor";
const css = `
:root {
  --full-width: 100%;
  --fill-width: -webkit-fill-available;
  --full-height: 100%;  
  --fill-height: 100%;
  --color-primary: ${primary};
  --color-success: ${success};
  --color-danger: ${danger};
  --icon-color: ${primary};
  --icon-text-color: white;
  --icon-border-color: white;
}

@supports (-moz-appearance: none) {
  :root {
    --fill-width: -moz-available;
    --fill-height: -moz-available;
  }
}

@media (min-width: 1375px) {
  .float-cmt-btn {
    font-size: 1em;
  }

  #openCmtBtn {
    font-size: 1.15em;
    padding: 2px 4px;
  }
}

@media (min-width: 1575px) {
  .float-cmt-btn {
    font-size: 1em;
  }

  #openCmtBtn {
    font-size: 1.3em;
    padding: 4px 8px;
  }
}

@media (min-width: 1850px) {
  .float-cmt-btn {
    font-size: 1.5em;
  }

  #openCmtBtn {
    padding: 5px 10px;
  }
}

#LN-commentBox [type='radio'] {
  box-shadow: none;
}

#openCmtBtn {
  cursor: pointer;
}

#LN-commentBox .tab-button {
  box-shadow: none !important;
}

#LN-commentBox #hoverQuoteBtn {
  box-shadow: none !important;
}

#LN-commentBox button {
  box-shadow: none !important;
}

#LN-commentBox #addCmtBtn {
  font-size: 1em;
  color: currentColor !important;
}

#openCmtBtn svg {
  stroke: var(--icon-text-color) !important;
}

#formatLinkBtn svg {
  width: 1em;
  height: 1em;
  stroke: currentColor !important;
}

#LN-commentBox {
  user-select: none;
  min-width: 250px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 100;
  top: 0px;
  bottom: auto;
  left: 10px;
  right: auto;
  width: 300px;
  height: 45%;
  background-color: var(--comment-bg-color);
  overflow-y: hidden;
  overflow-x: hidden;
  border-radius: 4px;
  border: 1px solid var(--comment-main-border-color);
  font-size: 0.8em;
  max-width: ${MAX_WIDTH}px;
  padding-top: 0px;
  color: var(--comment-fg-color);
}

#LN-commentBox .formatting-controls button {
  font-size: 1em;
  width: 1.2em;
  height: 1.2em;
  text-align: center;
  min-width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

#LN-commentBox input[type="radio"] + label,
#LN-commentBox input[type="checkbox"] + label {
  padding-left: 0.5em !important;
  font-size: 0.8em !important;
}

#LN-commentBox #previewPanel {
  font-size: 1em;
  height: var(--fill-height, 100%);
  padding: 0.5em;
}

#LN-commentBox .comment-box-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: var(--fill-width, 100%);
  justify-content: space-between;
  position: relative;
  border-top: 1px solid var(--comment-main-border-color);
  padding: 0.5em;
}

#LN-commentBox .resize-handle {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 101;
  border-radius: 0 4px 0 0;
  opacity: 0.7;
  cursor: nesw-resize;
}

#LN-commentBox #commentBoxTitle {
  cursor: move;
}

#LN-commentBox .top-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 98%;
  user-select: none;
  padding: 3px;
  border-radius: 3px;
  margin: 0 0 2px 0;
}

#LN-commentBox .char-count {
  font-size: .8em;
  margin: 2px 0;
}

#LN-commentBox #draftsPanel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: var(--fill-width, 100%);
  padding: 0.25em;
}

#LN-commentBox .drafts-list-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: var(--fill-width, 100%);
  max-height: calc(var(--fill-height, 100%) - 50px);
  margin: 0.5em;
  overflow-y: auto;
}

#LN-commentBox .float-box {
  min-height: 40%;
  max-height: 60%;
  width: var(--fill-width, 98%);
  max-width: 98%;
  cursor: text;
  margin: 0 0 2px 0;
  background: var(--comment-box-bg-color);
  color: var(--comment-fg-color);
  border: 1px solid var(--comment-border-color);
  resize: none;
  flex: 1;
}

#LN-commentBox button {
  color: var(--comment-fg-color) !important;
}

#LN-commentBox button:hover {
  cursor: pointer;
}

#LN-commentBox .float-box a:hover {
  color: var(--link-hover-color) !important;
}

.float-cmt-btn {
  margin: 0 2px;
  font-size: 0.8em;
}

.float-cmt-btn, .hover-quote-button {
  padding: 2px 4px;
  background: var(--comment-button-bg-color);
  color: var(--comment-button-fg-color);
  border: 1px solid var(--comment-border-color);
  transition: background-color 0.15s ease-in-out;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.float-cmt-btn:hover, .hover-quote-button:hover {
  filter: brightness(1.2);
}

.float-cmt-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(0,0,0,0.1);
  border-color: rgba(0,0,0,0.1);
}

.float-cmt-btn:disabled:hover {
  cursor: not-allowed;
}

#LN-commentBox button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(0,0,0,0.1);
  border-color: rgba(0,0,0,0.1);
}

#LN-commentBox .radio-div {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 5px;
}

#LN-commentBox .radio-div label {
  margin: 0 3px 0 1px;
  color: var(--comment-fg-color);
}

#LN-commentBox .radio-div input[type="radio"] {
  margin: 0 2px;
  padding: 0;
}

#LN-commentBox {
  font-family: ${FONT_FAMILY_SANS} !important;
}

#LN-commentBox .preview-area {
  height: var(--fill-height, 100%);
  background-color: var(--comment-box-bg-color);
  color: var(--comment-fg-color);
  padding: 10px;
  border-radius: 3px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: scroll;
  border: 1px solid var(--comment-border-color);
  font-family: system-ui, "Lucida Grande", "Lucida Sans Unicode", "GNU Unifont", Verdana, Helvetica, sans-serif;
  line-height: 1.5;
  font-size: 0.875em;
  width: var(--fill-width, 100%);
}

#LN-commentBox .preview-area blockquote {
  border-left: 2px solid #ccc;
  margin-left: 0;
  padding-left: 0.5em;
}

#LN-commentBox .preview-area a {
  color: var(--color-danger);
  text-decoration: none;
}

#LN-commentBox .preview-area a:hover {
  text-decoration: underline;
}

#LN-commentBox .window-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  flex-shrink: 0;
}

#LN-commentBox .close-btn {
  position: absolute;
  border-radius: 3px;
  padding: 3px 5px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: bold;
  background: var(--comment-button-bg-color);
  color: var(--comment-button-fg-color);
  border: 1px solid var(--comment-border-color);
  margin: 4px;
}

#LN-commentBox .close-btn:hover {
  background: var(--comment-button-hover-bg-color);
}

#LN-commentBox #insCmtBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

#LN-commentBox #insCmtBtn svg {
  display: inline-block;
  width: 14px;
  height: 14px;
  fill: var(--comment-button-fg-color) !important;
  margin-bottom: -2px;
}

#insCmtBtn:disabled svg {
  opacity: 0.5;
  fill: var(--comment-button-fg-color);
  vertical-align: middle;
}

#openCmtBtn svg {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.close-btn svg {
  display: inline-block;
  width: 14px;
  height: 14px;
  fill: var(--comment-button-fg-color);
  vertical-align: middle;
}

#openCmtBtn, #hoverQuoteBtn {
  background: var(--icon-color);
  border: 1px solid var(--icon-border-color);
  transition: opacity 0.15s ease-in-out;
  color: var(--icon-text-color);
}

#openCmtBtn:hover {
  opacity: 0.8;
}

#LN-commentBox .float-box:focus {
  color: var(--comment-fg-color) !important;
  background-color: var(--comment-box-bg-color) !important;
  border-color: #0275d8;
  outline: none;
  box-shadow: 0 0 0 1px #0275d8;
}

#LN-commentBox .status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 3px;
}

#LN-commentBox #colorsDiv {
  display: flex;
  gap: 1em;
  justify-content: flex-start;
}

#LN-commentBox .theme-controls {
  display: flex;
  flex-direction: column;
}

#LN-commentBox .theme-controls span {
  margin-left: 5px;
}

.theme-select {
  margin-left: 5px;
  background-color: var(--comment-button-bg-color);
  color: var(--comment-button-fg-color);
  border: 1px solid var(--comment-border-color);
  border-radius: 3px;
  padding: 2px;
}

.theme-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
  background-color: var(--comment-button-hover-bg-color);
}

#LN-commentBox #draftsListArea {
  display: none;
  max-height: 70%;
  overflow: auto;
  border: 1px solid var(--comment-border-color);
  background-color: var(--comment-box-bg-color);
  color: var(--comment-fg-color);
  padding: 10px;
  margin-top: 5px;
  border-radius: 3px;
  font-size: 0.9em;
  width: var(--fill-width, 100%);
  flex: 1;
}

#LN-commentBox .draft-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--comment-border-color);
  padding: 5px 0;
  margin-bottom: 5px;
}

#LN-commentBox .draft-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

#LN-commentBox .draft-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 10px;
  overflow: hidden;
  text-decoration: none;
}

#LN-commentBox .draft-info a {
  color: var(--comment-fg-color);
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  border-bottom: none;
  overflow: hidden;
  display: block;
}

#LN-commentBox .draft-info .draft-date {
  font-size: 0.8em;
  opacity: 0.8;
  margin-top: 2px;
}

#LN-commentBox .draft-delete-btn {
  padding: 3px 6px;
  font-size: 0.8em;
  cursor: pointer;
  background-color: rgba(200, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 3px;
  flex: 0 0 auto;
}

#LN-commentBox .draft-delete-btn:hover {
  background-color: rgba(220, 0, 0, 0.8);
}

#LN-commentBox .tab-container {
  display: flex;
  margin-bottom: 5px;
  border-bottom: 1px solid var(--comment-border-color);
}

#LN-commentBox .tab-button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--comment-fg-color);
  margin-right: 2px;
  font-size: 0.9em;
  transition: border-color 0.2s ease-in-out;
}

#LN-commentBox .tab-button:hover {
  background-color: var(--comment-button-hover-bg-color);
}

#LN-commentBox .tab-button.active {
  border-bottom: 2px solid var(--comment-fg-color);
  font-weight: bold;
}

#LN-commentBox .edit-controls-div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

#LN-commentBox .edit-controls-div > div {
  display: flex;
  align-items: center;
}

#LN-commentBox #internalQuoteBtn {
  margin-right: 5px;
}

#LN-commentBox .button-success {
  background: ${success} !important;
}

#LN-commentBox #settingsArea {
  display: none;
  overflow: auto;
  border: 1px solid var(--comment-border-color);
  background-color: var(--comment-box-bg-color);
  color: var(--comment-fg-color);
  margin-top: 1em;
  padding: 0.5em;
  border-radius: 3px;
  font-size: 0.9em;
  width: var(--fill-width, 100%);
  flex: 1;
}

#LN-commentBox #settingsPanel {
  height: var(--fill-height, 100%);
  margin-top: 5px;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.draft-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  border: 1px solid white;
  z-index: 1;
}

#LN-commentBox .hover-quote-button {
  z-index: 9999 !important;
  padding: 5px 10px !important;
  font-size: 1em !important;
  cursor: pointer !important;
  color: white !important;
  border: 2px solid black !important;
  border-radius: 3px !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) !important;
  white-space: nowrap !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: bold !important;
  top: 50px !important;
  left: 50px !important;
}

#LN-commentBox .hover-quote-button:hover {
  background-color: var(--comment-button-hover-bg-color) !important;
}

#LN-commentBox .hover-quote-button svg {
  display: inline-block !important;
  width: 14px !important;
  height: 14px !important;
  fill: var(--comment-button-fg-color) !important;
  vertical-align: middle !important;
  margin-bottom: -2px !important;
}

#LN-commentBox .theme-dynamic .hover-quote-button {
  background: var(--icon-color) !important;
  color: var(--comment-button-fg-color) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

#LN-commentBox .theme-dynamic .hover-quote-button:hover {
  background: rgba(2, 117, 216, 0.8) !important;
  color: white !important;
}

#LN-commentBox .theme-dynamic-dark .hover-quote-button {
  background: var(--comment-button-bg-color) !important; 
  color: var(--comment-button-fg-color) !important; 
  border-color: var(--comment-border-color) !important; 
}

#workskin {
  position: relative !important;
}

.quote-icon {
  width: 0.8em;
  height: 0.8em;
  fill: currentColor;
  stroke: none;
}
`;

// SVG icons from https://lucide.dev
const quoteSvg = () => {
  return `<svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote-icon lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>`;
};

const linkSvg = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
};

const openIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-heart-icon lucide-message-circle-heart"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7"/></svg>
    `;

(function () {
  "use strict";

  /* ---- THEME-RELATED CODE ---- */

  /* you could add a custom theme here if you like!
   by default the script will attempt to create a theme based on the page's background, 
   so it will match your AO3 site skin */
  const ThemeManager = (() => {
    const themes = {
      light: {
        bg: "rgba(248, 248, 248, 1)",
        fg: "rgba(30, 30, 30, 1)",
        border: "rgba(200, 200, 200, 1)",
        boxBg: "rgba(255, 255, 255, 1)",
        headerBg: "rgba(230, 230, 230, 1)",
        titleBarBg: "rgba(230, 230, 230, 1)",
        buttonHoverBg: "rgba(220, 220, 220, 1)",
        buttonBg: "rgba(235, 235, 235, 1)",
        buttonFg: "rgba(30, 30, 30, 1)",
        mainBorder: "rgba(0,0,0,0.3)",
        linkHoverColor: "rgba(30, 30, 30, 0.2)",
        iconColor: "rgba(30, 30, 30, 1)",
      },
      dark: {
        bg: "rgba(45, 45, 45, 1)",
        fg: "rgba(235, 235, 235, 1)",
        border: "rgba(70, 70, 70, 1)",
        boxBg: "rgba(55, 55, 55, 1)",
        headerBg: "rgba(60, 60, 60, 1)",
        titleBarBg: "rgba(40, 40, 40, 1)",
        buttonHoverBg: "rgba(80, 80, 80, 1)",
        buttonBg: "rgba(65, 65, 65, 1)",
        buttonFg: "rgba(235, 235, 235, 1)",
        mainBorder: "rgba(255,255,255,0.3)",
        linkHoverColor: "rgba(235, 235, 235, 0.2)",
        iconColor: "rgba(235, 235, 235, 1)",
      },
    };
    let currentThemeColors = {};

    const parseRgba = (rgbaString) => {
      if (!rgbaString) return null;
      const match = rgbaString.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (!match) return null;
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1,
      };
    };

    const toRgbaString = (rgbaObject) => {
      if (!rgbaObject) return null;
      return `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`;
    };

    const adjustLightness = (value, factor) => {
      return Math.max(0, Math.min(255, Math.round(value * factor)));
    };

    const adjustRgbColor = (rgbObject, factor) => {
      if (!rgbObject) return null;
      return {
        r: adjustLightness(rgbObject.r, factor),
        g: adjustLightness(rgbObject.g, factor),
        b: adjustLightness(rgbObject.b, factor),
      };
    };

    const isColorLight = (rgbObject) => {
      if (!rgbObject) return true;
      const luminance =
        (0.299 * rgbObject.r + 0.587 * rgbObject.g + 0.114 * rgbObject.b) / 255;
      return luminance > 0.5;
    };

    const getContrastColor = (colorString) => {
      if (colorString.startsWith("#")) {
        const r = parseInt(colorString.substring(1, 3), 16);
        const g = parseInt(colorString.substring(3, 5), 16);
        const b = parseInt(colorString.substring(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
      }
      const parsedColor = parseRgba(colorString);
      if (parsedColor) {
        return isColorLight(parsedColor)
          ? "rgba(0, 0, 0, 1)"
          : "rgba(255, 255, 255, 1)";
      }
      return "rgba(255, 255, 255, 1)";
    };

    const parseHex = (hexString) => {
      const r = parseInt(hexString.substring(1, 3), 16);
      const g = parseInt(hexString.substring(3, 5), 16);
      const b = parseInt(hexString.substring(5, 7), 16);
      return { r, g, b };
    };

    const parseColorString = (colorString) => {
      if (colorString.startsWith("#")) {
        return parseHex(colorString);
      }
      return parseRgba(colorString);
    };

    const getBorderColor = (colorString) => {
      const parsedColor = parseColorString(colorString);
      const isLight = isColorLight(parsedColor);
      const rgb = isLight
        ? adjustRgbColor(parsedColor, 0.5)
        : adjustRgbColor(parsedColor, 1.2);
      return toRgbaString({ ...rgb, a: 1 });
    };

    const generateDynamicTheme = (baseBgString, baseFgString) => {
      const baseBg = parseRgba(baseBgString);
      const baseFg = parseRgba(baseFgString);

      if (!baseBg || !baseFg) {
        return themes.dark;
      }

      const isBgLight = isColorLight(baseBg);

      const bgFactor = isBgLight ? 0.98 : 1.5;
      const borderFactor = isBgLight ? 0.85 : 1.6;
      const headerFactor = isBgLight ? 0.9 : 1.6;
      const buttonFactor = isBgLight ? 0.92 : 1.3;
      const hoverFactor = isBgLight ? 0.88 : 1.4;

      const dynamicTheme = {
        bg: toRgbaString({
          ...adjustRgbColor(baseBg, isBgLight ? 0.95 : 1.2),
          a: 1,
        }),
        fg: toRgbaString({ ...baseFg, a: 1 }),
        border: toRgbaString({ ...adjustRgbColor(baseBg, borderFactor), a: 1 }),
        boxBg: toRgbaString({ ...adjustRgbColor(baseBg, bgFactor), a: 1 }),
        headerBg: toRgbaString({
          ...adjustRgbColor(baseBg, headerFactor),
          a: 1,
        }),
        titleBarBg: toRgbaString({
          ...adjustRgbColor(baseBg, headerFactor),
          a: 1,
        }),
        buttonBg: toRgbaString({
          ...adjustRgbColor(baseBg, buttonFactor),
          a: 1,
        }),
        buttonHoverBg: toRgbaString({
          ...adjustRgbColor(baseBg, hoverFactor),
          a: 1,
        }),
        buttonFg: toRgbaString({ ...baseFg, a: 1 }),
        linkHoverColor: toRgbaString({ ...baseFg, a: 1 }),
        mainBorder: isBgLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)",
        iconColor: primary,
      };

      return dynamicTheme;
    };

    const getPageBaseColors = () => {
      const mainElement = document.querySelector("#main");
      const bodyElement = document.querySelector("body");

      if (mainElement && bodyElement) {
        const mainStyles = window.getComputedStyle(mainElement);
        const bodyStyles = window.getComputedStyle(bodyElement);

        let bgColor = mainStyles.backgroundColor;
        const fgColor = bodyStyles.color;

        const parsedMainBg = parseRgba(bgColor);

        if (parsedMainBg && parsedMainBg.a < 0.1) {
          bgColor = bodyStyles.backgroundColor;
          const parsedBodyBg = parseRgba(bgColor);
          if (parsedBodyBg && parsedBodyBg.a < 0.1) {
            bgColor = "rgba(255, 255, 255, 1)";
          }
        }

        return { bgColor, fgColor };
      } else {
        console.error("#main or body element not found.");

        return {
          bgColor: "rgba(255, 255, 255, 1)",
          fgColor: "rgba(0, 0, 0, 1)",
        };
      }
    };

    const updateThemeStyles = (
      theme,
      themeName,
      iconColor,
      isBgLight = null
    ) => {
      currentThemeColors = theme;

      const root = document.documentElement;
      root.style.setProperty("--comment-bg-color", currentThemeColors.bg);
      root.style.setProperty("--comment-fg-color", currentThemeColors.fg);
      root.style.setProperty(
        "--comment-border-color",
        currentThemeColors.border
      );
      root.style.setProperty(
        "--comment-box-bg-color",
        currentThemeColors.boxBg
      );
      root.style.setProperty(
        "--comment-header-bg-color",
        currentThemeColors.headerBg
      );
      root.style.setProperty(
        "--comment-title-bar-bg-color",
        currentThemeColors.titleBarBg
      );
      root.style.setProperty(
        "--comment-button-hover-bg-color",
        currentThemeColors.buttonHoverBg
      );
      root.style.setProperty(
        "--comment-button-bg-color",
        currentThemeColors.buttonBg
      );
      root.style.setProperty(
        "--comment-button-fg-color",
        currentThemeColors.buttonFg
      );

      root.style.setProperty(
        "--comment-main-border-color",
        currentThemeColors.mainBorder || themes.dark.mainBorder
      );

      root.style.setProperty(
        "--link-hover-color",
        currentThemeColors.linkHoverColor || themes.dark.linkHoverColor
      );

      root.style.setProperty("--icon-color", iconColor);

      const iconTextColor = getContrastColor(iconColor);
      root.style.setProperty("--icon-text-color", iconTextColor);

      const iconBorderColor = getBorderColor(iconColor);
      root.style.setProperty("--icon-border-color", iconBorderColor);

      const mainDiv = document.getElementById("LN-commentBox");
      if (mainDiv) {
        mainDiv.classList.remove(
          "theme-light",
          "theme-dark",
          "theme-dynamic",
          "theme-dynamic-light",
          "theme-dynamic-dark"
        );
        mainDiv.classList.add(`theme-${themeName}`);
        if (themeName === "dynamic" && isBgLight !== null) {
          mainDiv.classList.add(
            isBgLight ? "theme-dynamic-light" : "theme-dynamic-dark"
          );
        }
      }
    };

    const applyTheme = async () => {
      const manualPref = await GM.getValue("manualThemePreference", "dynamic");
      const iconPref = await GM.getValue(ICON_COLOR_KEY, primary);
      let themeToApply;
      let themeName;
      let appliedPreference = manualPref;
      let isBgLight = null;

      if (manualPref === "dynamic") {
        const { bgColor, fgColor } = getPageBaseColors();
        if (bgColor && fgColor) {
          const baseBg = parseRgba(bgColor);
          if (baseBg) {
            isBgLight = isColorLight(baseBg);
          }
          themeToApply = generateDynamicTheme(bgColor, fgColor);
          themeName = "dynamic";
        } else {
          const useDarkSystem =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
          themeToApply = useDarkSystem ? themes.dark : themes.light;
          themeName = useDarkSystem ? "dark" : "light";
          appliedPreference = null;
        }
      } else if (manualPref === "dark") {
        themeToApply = themes.dark;
        themeName = "dark";
        isBgLight = false;
      } else if (manualPref === "light") {
        themeToApply = themes.light;
        themeName = "light";
        isBgLight = true;
      } else {
        const useDarkSystem =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        themeToApply = useDarkSystem ? themes.dark : themes.light;
        themeName = useDarkSystem ? "dark" : "light";
        appliedPreference = null;
        isBgLight = !useDarkSystem;
      }

      updateThemeStyles(themeToApply, themeName, iconPref, isBgLight);

      const themeSelect = document.getElementById("themeSelectDropdown");
      if (themeSelect) {
        if (appliedPreference) {
          themeSelect.value = appliedPreference;
        } else {
          themeSelect.value = themeName;
        }
      }
    };

    const setThemeManually = async (themeName) => {
      const iconPref = await GM.getValue(ICON_COLOR_KEY, primary);
      let themeToApply;
      if (themeName === "light") {
        themeToApply = themes.light;
        await GM.setValue("manualThemePreference", "light");
      } else if (themeName === "dark") {
        themeToApply = themes.dark;
        await GM.setValue("manualThemePreference", "dark");
      } else if (themeName === "dynamic") {
        const { bgColor, fgColor } = getPageBaseColors();
        if (bgColor && fgColor) {
          themeToApply = generateDynamicTheme(bgColor, fgColor);
          await GM.setValue("manualThemePreference", "dynamic");
        } else {
          applyTheme();
          return;
        }
      } else {
        return;
      }
      updateThemeStyles(themeToApply, themeName, iconPref);
    };

    return {
      applyTheme,
      setThemeManually,
      getContrastColor,
      getBorderColor,
      getCurrentThemeColors: () => currentThemeColors,
    };
  })();

  async function applySavedCommentBoxPosition(element) {
    const savedPosition = await GM.getValue(COMMENT_BOX_POSITION_KEY, null);
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        if (position.top) element.style.top = position.top;
        if (position.left) element.style.left = position.left;

        if (position.left && position.left !== "auto") {
          element.style.right = "auto";
        } else if (position.right && position.right !== "auto") {
          element.style.left = "auto";
          element.style.right = position.right;
        }

        if (position.top && position.top !== "auto") {
          element.style.bottom = "auto";
        } else if (position.bottom && position.bottom !== "auto") {
          element.style.top = "auto";
          element.style.bottom = position.bottom;
        }
      } catch (e) {
        console.error("Error applying saved comment box position:", e);
      }
    } else {
      element.style.top = "10px";
      element.style.left = "10px";
      element.style.right = "auto";
      element.style.bottom = "auto";
    }
  }
  let curURL = document.URL;
  if (curURL.includes("#")) {
    curURL = document.URL.slice(0, document.URL.indexOf("#"));
  }
  let newURL = curURL;

  const DRAFTS_STORAGE_KEY = "allCommentDrafts";

  let currentWorkId = null;

  async function checkWorkDraftExists(workId) {
    if (!workId) return false;
    const drafts = await getAllDrafts();

    for (const url in drafts) {
      const draftUrlMatch =
        url.match(/\/works\/(\d+)/) || url.match(/\/chapters\/(\d+)/);
      if (
        draftUrlMatch &&
        draftUrlMatch[1] === workId &&
        drafts[url]?.text?.trim()
      ) {
        return true;
      }
    }
    return false;
  }

  async function updateOpenButtonBadge() {
    if (typeof currentWorkId === "undefined" || !currentWorkId) return;

    const openBtn = document.getElementById("openCmtBtn");
    if (!openBtn) return;

    const badgeId = "openCmtBtnBadge";
    let badge = openBtn.querySelector(`#${badgeId}`);
    const draftExists = await checkWorkDraftExists(currentWorkId);

    if (draftExists) {
      if (!badge) {
        badge = document.createElement("span");
        badge.id = badgeId;
        badge.className = "draft-badge";

        openBtn.appendChild(badge);

        openBtn.style.overflow = "visible";
      }
    } else {
      if (badge) {
        badge.remove();
      }
    }
  }

  const addStyles = () => {
    const styles = document.createElement("style");
    styles.id = "comment-box-styles";

    styles.innerHTML = css + "\n" + addMediaStyles();

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", async () => {
        const manualPref = await GM.getValue("manualThemePreference", null);
        if (!manualPref) {
          ThemeManager.applyTheme();
        }
      });

    return styles;
  };

  const addMediaStyles = () => {
    const mediaCssString = Object.entries(mediaStyles)
      .map(([mediaQuery, selectors]) => {
        const selectorRules = Object.entries(selectors)
          .map(([selector, properties]) => {
            const propertyRules = Object.entries(properties)
              .map(([key, value]) => `  ${key}: ${value};`)
              .join("\n");
            return `${selector} {\n${propertyRules}\n}`;
          })
          .join("\n\n");
        return `${mediaQuery} {\n${selectorRules}\n}`;
      })
      .join("\n\n");

    return mediaCssString;
  };

  const mediaStyles = {
    "@media (min-width: 1375px)": {
      ".float-cmt-btn": {
        "font-size": "1em",
      },
      "#openCmtBtn": {
        "font-size": "1.15em",
        padding: "2px 4px",
      },
    },
    "@media (min-width: 1575px)": {
      ".float-cmt-btn": {
        "font-size": "1em",
      },
      "#openCmtBtn": {
        "font-size": "1.3em",
        padding: "4px 8px",
      },
    },
    "@media (min-width: 1850px)": {
      ".float-cmt-btn": {
        "font-size": "1.1em",
      },
      "#openCmtBtn": {
        padding: "5px 10px",
      },
    },
  };

  /* DRAFT STORAGE */

  async function getAllDrafts() {
    try {
      const draftsJson = await GM.getValue(DRAFTS_STORAGE_KEY, "{}");
      return JSON.parse(draftsJson);
    } catch (e) {
      console.error("Error parsing drafts JSON:", e);
      return {};
    }
  }

  async function saveDraft(url, text) {
    if (!url) return;
    try {
      const drafts = await getAllDrafts();

      const titleElement = document.querySelector("h2.title.heading");
      const authorElement = document.querySelector("h3.byline");

      const chapterTitleElement = document.querySelector(
        "div#chapters h3.title"
      );
      const workTitle = titleElement
        ? titleElement.textContent.trim()
        : "Unknown Title";
      const workAuthor = authorElement
        ? authorElement.textContent.trim()
        : "Unknown Author";
      const chapterTitle = chapterTitleElement
        ? chapterTitleElement.textContent.trim()
        : null;

      let scope = "full";
      const chapterRadio = document.getElementById("chapterCmt");

      if (url.includes("chapters") && chapterRadio && chapterRadio.checked) {
        scope = "chapter";
      } else if (!url.includes("chapters")) {
        scope = "full";
      }

      const chapterId = url.match(/\/chapters\/(\d+)/)?.[1];
      const workId = url.match(/\/works\/(\d+)/)?.[1];

      const urlToUse =
        chapterId && !workId
          ? url.replace(
              /\/chapters\/(\d+)/,
              `/works/${currentWorkId}/chapters/${chapterId}`
            )
          : url;

      drafts[urlToUse] = {
        text: text,
        lastEdited: Date.now(),
        title: workTitle,
        author: workAuthor,
        chapterTitle: chapterTitle,
        scope: scope,
      };
      await GM.setValue(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }

  async function getDraft(url) {
    if (!url) return null;
    const drafts = await getAllDrafts();
    return drafts[url] || null;
  }

  async function deleteDraft(url) {
    if (!url) return;
    try {
      const drafts = await getAllDrafts();
      if (drafts[url]) {
        delete drafts[url];
        await GM.setValue(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  }

  const createBox = () => {
    const textBox = document.createElement("textarea");
    textBox.placeholder =
      PLACEHOLDER_PROMPTS[
        Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)
      ];
    textBox.className = "float-box";
    textBox.rows = 10;

    textBox.addEventListener("keyup", async () => {
      const text = textBox.value;
      await saveDraft(newURL, text);
      const addBtn = document.querySelector("#addCmtBtn");

      if (addBtn) {
        addBtn.disabled = text.trim().length === 0;

        if (!addBtn.classList.contains("button-success") && !addBtn.disabled) {
          addBtn.textContent = "Add to comment ⇲";
          addBtn.title = "Add to AO3's comment box";
        }
      }

      updateCharacterCount();
      await updateOpenButtonBadge();
    });

    textBox.addEventListener("input", () => {
      const addBtn = document.querySelector("#addCmtBtn");
      if (addBtn) {
        addBtn.disabled = textBox.value.trim().length === 0;
      }
    });

    return textBox;
  };

  /* ---- UI ELEMENTS ---- */

  let wasDragged = false;
  const DRAG_COOLDOWN = 200;

  const createStyledButton = ({
    id,
    className,
    text,
    title,
    innerHTML,
    onClick,
    disabled = false,
    styles = {},
    attributes = {},
  }) => {
    const button = document.createElement("button");

    Object.assign(button, {
      id,
      className,
      textContent: text,
      disabled,
    });

    if (title) button.title = title;

    if (innerHTML) button.innerHTML = innerHTML;

    if (onClick) button.addEventListener("click", onClick);

    Object.assign(button.style, styles);

    Object.entries(attributes).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });

    return button;
  };

  const createHoverQuoteButton = ({ id, styles = {} }) => {
    const quoteButton = createStyledButton({
      id,
      className: "hover-quote-button",
      innerHTML: quoteSvg() + '<span style="margin-left: 4px;">Quote</span>',
      title: "Add selection as blockquote",
      attributes: { "aria-label": "Quote selected text" },
      styles: { display: "none", ...styles },
      onClick: async () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString()?.trim();

        if (selectedText) {
          const quotedTextContent = `<blockquote>${selectedText}</blockquote>`;
          const textToInsertWithNewlines = quotedTextContent + "\n\n";

          const draggableBox = document.getElementById("LN-commentBox");
          const openBtn = document.getElementById("openCmtBtn");

          if (!draggableBox) {
            if (openBtn) {
              openBtn.click();
            }

            await new Promise((resolve) => setTimeout(resolve, 50));
          } else if (draggableBox.style.display === "none") {
            draggableBox.style.display = "flex";
            if (openBtn) openBtn.style.display = "none";
          }

          switchToEditTab();

          setTimeout(async () => {
            const floatBox = document.querySelector(".float-box");
            if (floatBox) {
              const currentTextInBox = floatBox.value;
              const prefix = currentTextInBox.trim() ? "\n" : "";

              floatBox.focus();

              const selectionStartBeforeInsert = floatBox.selectionStart;
              const textValueBeforeInsert = floatBox.value;
              const selectionEndBeforeInsert = floatBox.selectionEnd;

              const finalContentForInsertion =
                prefix + textToInsertWithNewlines;

              if (
                !document.execCommand(
                  "insertText",
                  false,
                  finalContentForInsertion
                )
              ) {
                const textBeforeCursor = textValueBeforeInsert.substring(
                  0,
                  selectionStartBeforeInsert
                );
                const textAfterCursor = textValueBeforeInsert.substring(
                  selectionEndBeforeInsert
                );
                floatBox.value =
                  textBeforeCursor + finalContentForInsertion + textAfterCursor;
              }

              await saveDraft(newURL, floatBox.value);
              updateCharacterCount();
              await updateOpenButtonBadge();
              triggerInputEvent(floatBox);

              const newCursorPosition =
                selectionStartBeforeInsert + finalContentForInsertion.length;

              floatBox.focus();
              floatBox.setSelectionRange(newCursorPosition, newCursorPosition);
            }
          }, 50);

          quoteButton.style.setProperty("display", "none", "important");
          selection?.removeAllRanges();
        }
      },
    });
    return quoteButton;
  };

  const createButton = () => {
    const newButton = createStyledButton({
      id: "openCmtBtn",
      innerHTML: openIconSvg,
      title: "Open comment box",
      styles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: "1",
      },
      onClick: () => {
        if (wasDragged) {
          return;
        }

        const div = document.getElementById("LN-commentBox");
        if (!div) return;

        div.style.display = "flex";
        newButton.style.display = "none";

        const textBox = div.querySelector(".float-box");
        if (textBox) {
          textBox.focus();
          textBox.scrollTop = textBox.scrollHeight;
        }
      },
    });

    return newButton;
  };

  const createThemeControls = () => {
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "theme-controls";

    const themeLabel = document.createElement("span");
    themeLabel.textContent = "Theme:";
    themeLabel.style.marginRight = "3px";

    const themeSelect = document.createElement("select");
    themeSelect.id = "themeSelectDropdown";
    themeSelect.className = "theme-select";

    const themesToCreate = {
      light: "Light",
      dark: "Dark",
      dynamic: "Match page",
    };

    Object.entries(themesToCreate).forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      themeSelect.appendChild(option);
    });

    themeSelect.addEventListener("change", async (event) => {
      await ThemeManager.setThemeManually(event.target.value);
    });

    controlsDiv.appendChild(themeLabel);
    controlsDiv.appendChild(themeSelect);

    return controlsDiv;
  };

  const closeCommentBox = async (mainDiv) => {
    mainDiv.style.display = "none";
    const openBtn = document.querySelector("#openCmtBtn");
    if (openBtn) {
      openBtn.style.display = "block";
    }
    await updateOpenButtonBadge();
  };

  const createWindowHeader = (mainDiv) => {
    const windowHeader = document.createElement("div");
    windowHeader.className = "window-header";
    windowHeader.id = "commentBoxHeader";

    const closeButton = createStyledButton({
      className: "close-btn",
      text: "✕",
      title: "Close window",
      attributes: { "aria-label": "Close comment box" },
      onClick: async () => {
        await closeCommentBox(mainDiv);
      },
    });

    const headerTitle = document.createElement("div");
    headerTitle.textContent = "Comment drafts";
    headerTitle.style.fontWeight = "bold";
    headerTitle.style.textAlign = "center";
    headerTitle.style.lineHeight = "24px";
    headerTitle.style.userSelect = "none";
    headerTitle.style.margin = "4px";
    headerTitle.style.flexBasis = "100%";
    headerTitle.id = "commentBoxTitle";

    windowHeader.appendChild(closeButton);
    windowHeader.appendChild(headerTitle);

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";
    windowHeader.appendChild(resizeHandle);

    return windowHeader;
  };

  const createTopControlsBar = () => {
    const topControls = document.createElement("div");
    topControls.className = "top-controls";
    topControls.appendChild(chapterRadio());
    return topControls;
  };

  const createTabNavigation = () => {
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";
    tabContainer.setAttribute("role", "tablist");
    tabContainer.setAttribute("aria-labelledby", "commentBoxTitle");

    const editTabButton = createStyledButton({
      text: "Edit",
      className: "tab-button active",
      id: "editTab",
      attributes: {
        role: "tab",
        "aria-selected": "true",
        "aria-controls": "editPanel",
      },
    });

    const previewTabButton = createStyledButton({
      text: "Preview",
      className: "tab-button",
      id: "previewTab",
      attributes: {
        role: "tab",
        "aria-selected": "false",
        "aria-controls": "previewPanel",
      },
    });

    const draftsTabButton = createStyledButton({
      text: "Drafts",
      className: "tab-button",
      id: "draftsTab",
      styles: { marginLeft: "auto" },
      attributes: {
        role: "tab",
        "aria-selected": "false",
        "aria-controls": "draftsPanel",
      },
    });

    const settingsTabButton = createStyledButton({
      text: "Settings",
      className: "tab-button",
      id: "settingsTab",
      attributes: {
        role: "tab",
        "aria-selected": "false",
        "aria-controls": "settingsPanel",
      },
    });

    tabContainer.appendChild(editTabButton);
    tabContainer.appendChild(previewTabButton);
    tabContainer.appendChild(draftsTabButton);
    tabContainer.appendChild(settingsTabButton);

    return {
      tabContainer,
      editTabButton,
      previewTabButton,
      draftsTabButton,
      settingsTabButton,
    };
  };

  const createEditControlsBar = (textBox) => {
    const editControlsDiv = document.createElement("div");
    editControlsDiv.className = "edit-controls-div";
    editControlsDiv.id = "editControls";
    editControlsDiv.style.display = "flex";
    editControlsDiv.style.justifyContent = "space-between";

    const leftControls = document.createElement("div");
    leftControls.style.display = "flex";
    leftControls.style.alignItems = "center";

    const internalQuoteButton = createInternalQuoteButton(textBox);
    leftControls.appendChild(internalQuoteButton);

    const rightControls = document.createElement("div");
    rightControls.appendChild(addButton());

    editControlsDiv.appendChild(leftControls);
    editControlsDiv.appendChild(rightControls);

    return editControlsDiv;
  };

  const createStatusBar = (formattingControls) => {
    const charCountElement = document.createElement("div");
    charCountElement.className = "char-count";
    charCountElement.textContent = `Characters left: ${MAX_CHAR_LIMIT}`;
    charCountElement.setAttribute("aria-live", "polite");

    const statusBar = document.createElement("div");
    statusBar.className = "status-bar";
    statusBar.appendChild(formattingControls);

    return { statusBar, charCountElement };
  };

  function switchToEditTab() {
    const editTabButton = document.getElementById("editTab");
    if (!editTabButton) return false;

    if (!editTabButton.classList.contains("active")) {
      editTabButton.click();
    }
    return true;
  }

  function triggerInputEvent(element) {
    if (!element) return;

    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  }

  function setupHoverQuoteButton() {
    const workskinElement = document.getElementById("workskin");
    if (!workskinElement) {
      console.error("Could not find #workskin for hover quote button setup!");
      return null;
    }

    const hoverQuoteButton = createHoverQuoteButton({
      id: "hoverQuoteBtn",
      styles: { padding: "4px 6px !important" },
      onClick: async () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString()?.trim();

        if (selectedText) {
          const quotedText = `<blockquote>${selectedText}</blockquote>`;

          const draggableBox = document.getElementById("LN-commentBox");
          const openBtn = document.getElementById("openCmtBtn");

          if (!draggableBox) {
            if (openBtn) {
              openBtn.click();
            }

            await new Promise((resolve) => setTimeout(resolve, 50));
          } else if (draggableBox.style.display === "none") {
            draggableBox.style.display = "flex";
            if (openBtn) openBtn.style.display = "none";
          }

          switchToEditTab();

          setTimeout(async () => {
            const floatBox = document.querySelector(".float-box");
            if (floatBox) {
              const currentText = floatBox.value;
              const separator = currentText && currentText.trim() ? "\n\n" : "";
              const newText = `${currentText}${separator}${quotedText}`;

              floatBox.value = newText;
              await saveDraft(newURL, newText);
              updateCharacterCount();
              await updateOpenButtonBadge();

              triggerInputEvent(floatBox);

              floatBox.focus();
              floatBox.setSelectionRange(newText.length, newText.length);
            }
          }, 50);

          hoverQuoteButton.style.setProperty("display", "none", "important");
          selection?.removeAllRanges();
        }
      },
    });

    hoverQuoteButton.style.display = "none";
    hoverQuoteButton.style.position = "absolute";
    hoverQuoteButton.style.zIndex = "9999";

    document.body.appendChild(hoverQuoteButton);

    let currentSelectionRange = null;

    document.addEventListener("mouseup", async () => {
      const enableHoverQuote = await GM.getValue(ENABLE_HOVER_QUOTE_KEY, true);

      if (!enableHoverQuote) {
        hoverQuoteButton.style.setProperty("display", "none", "important");
        return;
      }

      const currentSelection = window.getSelection();
      const selectionText = currentSelection?.toString()?.trim();

      if (
        !currentSelection ||
        currentSelection.isCollapsed ||
        currentSelection.rangeCount === 0 ||
        !selectionText
      ) {
        hoverQuoteButton.style.setProperty("display", "none", "important");
        currentSelectionRange = null;
        return;
      }

      let container = currentSelection.getRangeAt(0).commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }

      const isInWorkskin = workskinElement.contains(container);

      if (!isInWorkskin) {
        hoverQuoteButton.style.setProperty("display", "none", "important");
        currentSelectionRange = null;
        return;
      }

      currentSelectionRange = currentSelection.getRangeAt(0);

      positionHoverQuoteButton(currentSelectionRange, hoverQuoteButton);

      setTimeout(() => {
        if (window.getSelection().toString().trim()) {
          hoverQuoteButton.style.setProperty(
            "display",
            "inline-flex",
            "important"
          );
          hoverQuoteButton.style.setProperty("opacity", "1", "important");
          hoverQuoteButton.style.setProperty(
            "visibility",
            "visible",
            "important"
          );
        }
      }, 10);
    });

    window.addEventListener(
      "scroll",
      () => {
        if (
          currentSelectionRange &&
          hoverQuoteButton.style.display !== "none"
        ) {
          positionHoverQuoteButton(currentSelectionRange, hoverQuoteButton);
        }
      },
      { passive: true }
    );

    function positionHoverQuoteButton(range, button) {
      const rect = range.getBoundingClientRect();
      const offset = 16;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const buttonTop = Math.min(
        Math.max(
          rect.bottom + window.pageYOffset + offset,
          window.pageYOffset + 50
        ),
        window.pageYOffset + viewportHeight - 50
      );

      const buttonLeft = Math.min(
        Math.max(
          rect.left + window.pageXOffset + offset,
          window.pageXOffset + 50
        ),
        window.pageXOffset + viewportWidth - 150
      );

      button.style.top = `${buttonTop}px`;
      button.style.left = `${buttonLeft}px`;
    }

    document.addEventListener("mousedown", (event) => {
      if (
        hoverQuoteButton.style.display === "inline-flex" &&
        !hoverQuoteButton.contains(event.target)
      ) {
        const selection = window.getSelection();
        if (!selection.isCollapsed && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const MARGIN = 10;
          if (
            event.clientX < rect.left - MARGIN ||
            event.clientX > rect.right + MARGIN ||
            event.clientY < rect.top - MARGIN ||
            event.clientY > rect.bottom + MARGIN
          ) {
            if (!workskinElement.contains(event.target)) {
              hoverQuoteButton.style.setProperty(
                "display",
                "none",
                "important"
              );
              currentSelectionRange = null;
            }
          }
        } else {
          hoverQuoteButton.style.setProperty("display", "none", "important");
          currentSelectionRange = null;
        }
      }
    });

    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      const selectionText = selection?.toString()?.trim();

      if (!selectionText) {
        hoverQuoteButton.style.setProperty("display", "none", "important");
        currentSelectionRange = null;
      }
    });

    return hoverQuoteButton;
  }

  const createInternalQuoteButton = (textBox) => {
    const isValidSelection = (selection) => {
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        return false;
      }

      let container = selection.getRangeAt(0).commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }

      const userStuff = document.getElementById("workskin");
      return (
        userStuff &&
        userStuff.contains(container) &&
        selection.toString().trim().length > 0
      );
    };

    const quoteButton = createStyledButton({
      id: "internalQuoteBtn",
      className: "float-cmt-btn format-btn internal-quote-btn",
      innerHTML: quoteSvg() + '<span style="margin-left: 4px;">Quote</span>',
      title: "Add selection as blockquote (Ctrl+Q - Not implemented)",
      attributes: { "aria-label": "Quote selected text from formatting bar" },
      onClick: async () => {
        const selection = window.getSelection();
        if (!isValidSelection(selection)) {
          return;
        }

        switchToEditTab();

        const selectedText = selection.toString().trim();
        const quotedTextContent = `<blockquote>${selectedText}</blockquote>`;
        const textToInsertWithNewlines = quotedTextContent + "\n\n";

        setTimeout(async () => {
          const currentTextInBox = textBox.value;
          const prefix = currentTextInBox.trim() ? "\n\n" : "";

          textBox.focus();

          const selectionStartBeforeInsert = textBox.selectionStart;
          const textValueBeforeInsert = textBox.value;
          const selectionEndBeforeInsert = textBox.selectionEnd;

          const finalContentForInsertion = prefix + textToInsertWithNewlines;

          if (
            !document.execCommand("insertText", false, finalContentForInsertion)
          ) {
            const textBeforeCursor = textValueBeforeInsert.substring(
              0,
              selectionStartBeforeInsert
            );
            const textAfterCursor = textValueBeforeInsert.substring(
              selectionEndBeforeInsert
            );
            textBox.value =
              textBeforeCursor + finalContentForInsertion + textAfterCursor;
          }

          await saveDraft(newURL, textBox.value);
          updateCharacterCount();
          await updateOpenButtonBadge();

          triggerInputEvent(textBox);

          const newCursorPosition =
            selectionStartBeforeInsert + finalContentForInsertion.length;

          textBox.focus();
          textBox.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 50);

        selection.removeAllRanges();
      },
    });

    const checkInternalQuoteSelection = () => {
      const internalQuoteButton = document.getElementById("internalQuoteBtn");
      if (
        !internalQuoteButton ||
        internalQuoteButton.style.display === "none"
      ) {
        return;
      }

      internalQuoteButton.disabled = !isValidSelection(window.getSelection());
    };

    document.addEventListener("mouseup", checkInternalQuoteSelection);
    document.addEventListener("keyup", checkInternalQuoteSelection);
    textBox.addEventListener("focus", checkInternalQuoteSelection);
    document.addEventListener("selectionchange", checkInternalQuoteSelection);

    setTimeout(() => {
      const settingsCheckbox = document.getElementById(
        "disableHoverQuoteCheckbox"
      );
      if (settingsCheckbox) {
        settingsCheckbox.removeEventListener(
          "change",
          checkInternalQuoteSelection
        );
        settingsCheckbox.addEventListener(
          "change",
          checkInternalQuoteSelection
        );
      }
    }, 0);

    checkInternalQuoteSelection();
    return quoteButton;
  };

  const createFormattingControls = (textBox) => {
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "formatting-controls";

    const formatButtons = {};

    const applyFormat = async (tag) => {
      const start = textBox.selectionStart;
      const end = textBox.selectionEnd;
      const isEmptySelection = start === end;
      const selectedText = isEmptySelection
        ? ""
        : textBox.value.substring(start, end);

      const formattedText = isEmptySelection
        ? `<${tag}></${tag}>`
        : `<${tag}>${selectedText}</${tag}>`;

      textBox.focus();
      if (!document.execCommand("insertText", false, formattedText)) {
        const beforeText = textBox.value.substring(0, start);
        const afterText = textBox.value.substring(end);
        textBox.value = beforeText + formattedText + afterText;
      }

      const newStartPos = start + tag.length + 2;
      const newEndPos = isEmptySelection
        ? newStartPos
        : end + tag.length * 2 + 5;
      textBox.setSelectionRange(newStartPos, newEndPos);

      await saveDraft(newURL, textBox.value);
      updateCharacterCount();
      await updateOpenButtonBadge();
    };

    formatButtons.bold = createStyledButton({
      id: "formatBoldBtn",
      className: "float-cmt-btn format-btn",
      innerHTML:
        "<span style='font-weight: bold; font-family: serif;'>B</span>",
      title: "Bold (Ctrl+B)",
      styles: { fontWeight: "bold", fontFamily: "serif" },
      onClick: () => applyFormat("strong"),
    });

    formatButtons.italic = createStyledButton({
      id: "formatItalicBtn",
      className: "float-cmt-btn format-btn",
      innerHTML:
        "<span style='font-style: italic; font-family: serif;'>I</span>",
      title: "Italic (Ctrl+I)",
      styles: { fontStyle: "italic", fontFamily: "serif" },
      onClick: () => applyFormat("em"),
    });

    formatButtons.strike = createStyledButton({
      id: "formatStrikeBtn",
      className: "float-cmt-btn format-btn",
      innerHTML:
        "<span style='text-decoration: line-through; font-family: serif;'>S</span>",
      title: "Strikethrough (Ctrl+S)",
      styles: { textDecoration: "line-through", fontFamily: "serif" },
      onClick: () => applyFormat("del"),
    });

    formatButtons.link = createStyledButton({
      id: "formatLinkBtn",
      className: "float-cmt-btn format-btn",
      innerHTML: linkSvg(),
      title: "Add link (Ctrl+L)",
      onClick: async () => {
        const start = textBox.selectionStart;
        const end = textBox.selectionEnd;
        const selectedText = textBox.value.substring(start, end);

        const url = prompt("Enter URL:", "https://");
        if (!url) return;

        const linkText = selectedText || "link text";
        const linkHtml = `<a href="${url}">${linkText}</a>`;

        textBox.focus();
        if (!document.execCommand("insertText", false, linkHtml)) {
          const beforeText = textBox.value.substring(0, start);
          const afterText = textBox.value.substring(end);
          textBox.value = beforeText + linkHtml + afterText;
        }

        await saveDraft(newURL, textBox.value);
        updateCharacterCount();
        await updateOpenButtonBadge();
      },
    });

    controlsDiv.style.marginTop = "5px";
    controlsDiv.appendChild(formatButtons.bold);
    controlsDiv.appendChild(formatButtons.italic);
    controlsDiv.appendChild(formatButtons.strike);

    controlsDiv.appendChild(formatButtons.link);

    textBox.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b" || e.key === "B") {
          e.preventDefault();

          formatButtons.bold.click();
        } else if (e.key === "i" || e.key === "I") {
          e.preventDefault();

          formatButtons.italic.click();
        } else if (e.key === "s" || e.key === "S") {
          e.preventDefault();

          formatButtons.strike.click();
        } else if (e.key === "l" || e.key === "L") {
          e.preventDefault();

          formatButtons.link.click();
        }
      }
    });

    return controlsDiv;
  };

  const createSettingsArea = () => {
    const settingsArea = document.createElement("div");
    createButtonColorSelector().then((selector) => {
      settingsArea.id = "settingsArea";
      settingsArea.style.display = "none";
      settingsArea.id = "settingsPanel";
      settingsArea.setAttribute("role", "tabpanel");
      settingsArea.setAttribute("aria-labelledby", "settingsTab");
      const colorsDiv = document.createElement("div");
      colorsDiv.id = "colorsDiv";
      const themeControlsElement = createThemeControls();
      colorsDiv.appendChild(themeControlsElement);
      colorsDiv.appendChild(selector);
      settingsArea.appendChild(colorsDiv);

      const enableHoverQuoteSettingElement = createEnableHoverQuoteSetting();
      settingsArea.appendChild(enableHoverQuoteSettingElement);
      const hideAnnouncementsSettingElement = createHideAnnouncementsSetting();
      settingsArea.appendChild(hideAnnouncementsSettingElement);

      const versionInfo = createVersionInfo();
      settingsArea.appendChild(versionInfo);
    });

    return settingsArea;
  };

  const switchTab = (
    targetTabId,
    textBox,
    previewArea,
    draftsListArea,
    settingsArea,
    editControlsDiv,
    charCountElement,
    editTabButton,
    previewTabButton,
    draftsTabButton,
    settingsTabButton,
    topControls
  ) => {
    [textBox, previewArea, draftsListArea, settingsArea].forEach(
      (panel) => (panel.style.display = "none")
    );

    editControlsDiv.style.display = "none";
    charCountElement.style.display = "block";
    topControls.style.display = "flex";

    const formattingControls = document.querySelector(".formatting-controls");
    if (formattingControls) formattingControls.style.display = "none";

    const internalQuoteBtn = document.getElementById("internalQuoteBtn");
    if (internalQuoteBtn) internalQuoteBtn.style.display = "none";

    const tabButtons = [
      editTabButton,
      previewTabButton,
      draftsTabButton,
      settingsTabButton,
    ];
    tabButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    const chapterToggles = document.querySelectorAll(".chapter-toggle");
    chapterToggles.forEach((radio) => (radio.disabled = false));

    const radioDiv = document.querySelector(".radio-div");
    if (radioDiv) {
      if (!curURL.includes("chapters")) {
        radioDiv.style.width = "0px";
        radioDiv.style.overflow = "hidden";
        chapterToggles.forEach((radio) => (radio.disabled = true));
      } else {
        radioDiv.style.width = "fit-content";
        radioDiv.style.overflow = "visible";
      }
    }

    const tabConfig = {
      editTab: {
        button: editTabButton,
        setup: () => {
          textBox.style.display = "block";
          editControlsDiv.style.display = "flex";
          if (formattingControls) formattingControls.style.display = "flex";
          if (internalQuoteBtn) {
            GM.getValue(ENABLE_HOVER_QUOTE_KEY, true).then((isEnabled) => {
              internalQuoteBtn.style.display = isEnabled
                ? "none"
                : "inline-flex";
            });
          }
        },
      },
      previewTab: {
        button: previewTabButton,
        setup: () => {
          renderPreview(textBox.value);
          previewArea.style.display = "block";
          editControlsDiv.style.display = "flex";
          topControls.style.display = "none";
          charCountElement.style.display = "none";
          chapterToggles.forEach((radio) => (radio.disabled = true));
        },
      },
      draftsTab: {
        button: draftsTabButton,
        setup: () => {
          displayDraftsList();
          draftsListArea.style.display = "flex";
          topControls.style.display = "none";
          charCountElement.style.display = "none";
          chapterToggles.forEach((radio) => (radio.disabled = true));
        },
      },
      settingsTab: {
        button: settingsTabButton,
        setup: () => {
          settingsArea.style.display = "block";
          charCountElement.style.display = "none";
          topControls.style.display = "none";
          chapterToggles.forEach((radio) => (radio.disabled = true));

          refreshSettingsCheckboxes();
        },
      },
    };

    if (tabConfig[targetTabId]) {
      const { button, setup } = tabConfig[targetTabId];
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      setup();
    }
  };

  const getInitialBoxStyleProps = () => {
    const MIN_WIDTH = 300;
    const DEFAULT_HEIGHT = "45%";
    const DEFAULT_TOP = "10px";
    const DEFAULT_LEFT = "10px";

    return {
      top: DEFAULT_TOP,
      left: DEFAULT_LEFT,
      width: MIN_WIDTH + "px",
      height: DEFAULT_HEIGHT,
      bottom: "auto",
      right: "auto",
      transform: "none",
    };
  };

  const createMainDiv = () => {
    const newDiv = document.createElement("div");
    newDiv.className = "float-div";
    newDiv.id = "LN-commentBox";
    newDiv.setAttribute("role", "dialog");
    newDiv.setAttribute("aria-modal", "false");
    newDiv.setAttribute("aria-labelledby", "commentBoxTitle");

    const initialStyles = getInitialBoxStyleProps();
    Object.assign(newDiv.style, initialStyles);

    const innerContainer = document.createElement("div");
    innerContainer.className = "comment-box-container";

    const windowHeader = createWindowHeader(newDiv);
    const {
      tabContainer,
      editTabButton,
      previewTabButton,
      draftsTabButton,
      settingsTabButton,
    } = createTabNavigation();

    const textBox = createBox();
    const previewArea = document.createElement("div");
    previewArea.className = "preview-area";
    const draftsListArea = document.createElement("div");
    draftsListArea.id = "draftsListArea";

    textBox.id = "editPanel";
    textBox.setAttribute("role", "tabpanel");
    textBox.setAttribute("aria-labelledby", "editTab");

    previewArea.id = "previewPanel";
    previewArea.setAttribute("role", "tabpanel");
    previewArea.setAttribute("aria-labelledby", "previewTab");

    draftsListArea.id = "draftsPanel";
    draftsListArea.setAttribute("role", "tabpanel");
    draftsListArea.setAttribute("aria-labelledby", "draftsTab");

    const editControlsDiv = createEditControlsBar(textBox);
    const formattingControls = createFormattingControls(textBox);
    const { statusBar, charCountElement } = createStatusBar(formattingControls);

    const topControls = createTopControlsBar();
    const settingsArea = createSettingsArea();

    statusBar.appendChild(charCountElement);
    innerContainer.appendChild(tabContainer);
    innerContainer.appendChild(topControls);
    innerContainer.appendChild(textBox);
    innerContainer.appendChild(previewArea);
    innerContainer.appendChild(draftsListArea);
    innerContainer.appendChild(settingsArea);
    innerContainer.appendChild(statusBar);
    innerContainer.appendChild(editControlsDiv);

    newDiv.appendChild(windowHeader);
    newDiv.appendChild(innerContainer);

    const switchArgs = [
      textBox,
      previewArea,
      draftsListArea,
      settingsArea,
      editControlsDiv,
      charCountElement,
      editTabButton,
      previewTabButton,
      draftsTabButton,
      settingsTabButton,
      topControls,
    ];

    editTabButton.addEventListener("click", () =>
      switchTab("editTab", ...switchArgs)
    );
    previewTabButton.addEventListener("click", () =>
      switchTab("previewTab", ...switchArgs)
    );
    draftsTabButton.addEventListener("click", () =>
      switchTab("draftsTab", ...switchArgs)
    );
    settingsTabButton.addEventListener("click", () =>
      switchTab("settingsTab", ...switchArgs)
    );

    tabContainer.addEventListener("keydown", (e) => {
      const tabs = Array.from(tabContainer.querySelectorAll('[role="tab"]'));
      let currentTab = document.activeElement;
      let currentIndex = tabs.indexOf(currentTab);

      if (currentIndex === -1) return;

      let nextIndex;

      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }

      e.preventDefault();
      const nextTab = tabs[nextIndex];
      nextTab.focus();
      switchTab(nextTab.id, ...switchArgs);
    });

    switchTab("editTab", ...switchArgs);

    return newDiv;
  };

  const chapterRadio = () => {
    const radioDiv = document.createElement("div");
    radioDiv.className = "radio-div";

    const radioFull = document.createElement("input");
    const radioChapter = document.createElement("input");

    [radioFull, radioChapter].forEach((radio) => {
      radio.type = "radio";
      radio.name = "chapters";
      radio.className = "chapter-toggle";
    });

    radioFull.id = "entireCmt";
    radioChapter.id = "chapterCmt";

    const labelFull = document.createElement("label");
    const labelChapter = document.createElement("label");

    labelFull.setAttribute("for", "entireCmt");
    labelFull.textContent = "Full Work";

    labelChapter.setAttribute("for", "chapterCmt");
    labelChapter.textContent = "Chapter";

    if (curURL.includes("chapters")) {
      radioFull.checked = false;
      radioChapter.checked = true;
      radioDiv.style.width = "fit-content";
      radioDiv.style.overflow = "visible";
    } else {
      radioDiv.style.width = "0px";
      radioDiv.style.overflow = "hidden";
      radioFull.disabled = true;
      radioChapter.disabled = true;
    }

    radioFull.addEventListener("click", () => {
      if (newURL.includes("chapters")) {
        newURL = curURL.slice(0, curURL.indexOf("/chapters"));
        addStoredText();
      }
    });

    radioChapter.addEventListener("click", () => {
      if (!newURL.includes("chapters")) {
        newURL = curURL;
        addStoredText();
      }
    });

    radioDiv.appendChild(radioFull);
    radioDiv.appendChild(labelFull);
    radioDiv.appendChild(radioChapter);
    radioDiv.appendChild(labelChapter);

    return radioDiv;
  };

  const addButton = () => {
    const realCmtBox = document.querySelector(
      "textarea[id^='comment_content_for']"
    );

    const newButton = createStyledButton({
      id: "addCmtBtn",
      className: "float-cmt-btn",
      text: "Add to comment ⇲",
      title: "Add to AO3's comment box",
      onClick: async () => {
        if (newButton.classList.contains("button-success")) {
          return;
        }
        realCmtBox.value = document.querySelector(".float-box").value;
        realCmtBox.scrollIntoView({ behavior: "smooth", block: "center" });

        newButton.classList.add("button-success");
        newButton.textContent = "Added!";
        newButton.setAttribute(
          "aria-label",
          "Add draft content to main AO3 comment box"
        );

        if (document.getElementById("deleteDraftBtn")) {
          return;
        }
        const deleteConfirmDiv = document.createElement("div");
        deleteConfirmDiv.id = "deleteDraftBtn";
        deleteConfirmDiv.style.display = "flex";
        deleteConfirmDiv.style.alignItems = "center";
        deleteConfirmDiv.style.marginLeft = "8px";

        const deleteText = document.createElement("span");
        deleteText.textContent = "Delete draft?";
        deleteText.style.marginRight = "4px";

        const yesButton = document.createElement("button");
        yesButton.className = "float-cmt-btn";
        yesButton.textContent = "Yes";
        yesButton.style.marginRight = "4px";

        const noButton = document.createElement("button");
        noButton.className = "float-cmt-btn";
        noButton.textContent = "No";

        deleteConfirmDiv.appendChild(deleteText);
        deleteConfirmDiv.appendChild(yesButton);
        deleteConfirmDiv.appendChild(noButton);

        const editControlsDiv = document.getElementById("editControls");
        editControlsDiv.insertBefore(
          deleteConfirmDiv,
          document.getElementById("delCmtBtn")
        );

        yesButton.addEventListener("click", async () => {
          const draft = await getDraft(newURL);
          if (draft) {
            await deleteDraft(newURL);
            document.querySelector(".float-box").value = "";
            updateCharacterCount();

            newButton.disabled = true;
            await updateOpenButtonBadge();
            deleteConfirmDiv.remove();

            switchToEditTab();

            setTimeout(() => {
              const commentBox = document.getElementById("LN-commentBox");
              if (commentBox) {
                commentBox.style.display = "none";
                const openBtn = document.getElementById("openCmtBtn");
                if (openBtn) {
                  openBtn.style.display = "block";
                }
              }
            }, 50);
          }
        });

        noButton.addEventListener("click", () => {
          deleteConfirmDiv.remove();
        });

        setTimeout(() => {
          newButton.classList.remove("button-success");

          if (!newButton.disabled) {
            newButton.textContent = "Add to comment ⇲";
          }

          if (document.contains(deleteConfirmDiv)) {
            deleteConfirmDiv.remove();
          }
        }, 5000);
      },

      disabled: true,
    });

    return newButton;
  };

  function renderPreview(text) {
    const previewArea = document.querySelector(".preview-area");
    if (!previewArea) return;

    previewArea.innerHTML = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    while (tempDiv.firstChild) {
      previewArea.appendChild(tempDiv.firstChild);
    }
  }

  const addStoredText = async () => {
    const textBox = document.querySelector(".float-box");

    if (curURL.includes("full")) {
      newURL = curURL.slice(0, curURL.indexOf("?"));
    }

    const storedDraft = await getDraft(newURL);
    const storedText = storedDraft ? storedDraft.text : "";
    textBox.value = storedText;

    renderPreview(storedText);

    updateCharacterCount();

    const addBtn = document.querySelector("#addCmtBtn");
    if (addBtn) {
      const hasText = textBox.value.trim().length > 0;
      addBtn.disabled = !hasText;

      if (hasText) {
        addBtn.textContent = "Add to comment ⇲";
        addBtn.title = "Add to AO3's comment box";
      }
    }
  };

  const updateCharacterCount = () => {
    const charCount = document.querySelector(".char-count");
    const textBox = document.querySelector(".float-box");

    if (charCount && textBox) {
      const text = textBox.value || "";
      const remainingChars = MAX_CHAR_LIMIT - text.length;
      charCount.textContent = `Characters left: ${remainingChars}`;
    }
  };

  const OPEN_BUTTON_POSITION_KEY = "openButtonPosition";

  async function applySavedOpenButtonPosition(element) {
    const savedPosition = await GM.getValue(OPEN_BUTTON_POSITION_KEY, null);
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        if (position.top) element.style.top = position.top;
        if (position.left) element.style.left = position.left;

        if (position.left && position.left !== "auto") {
          element.style.right = "auto";
        } else if (position.right && position.right !== "auto") {
          element.style.left = "auto";
          element.style.right = position.right;
        }

        if (position.top && position.top !== "auto") {
          element.style.bottom = "auto";
        } else if (position.bottom && position.bottom !== "auto") {
          element.style.top = "auto";
          element.style.bottom = position.bottom;
        }
      } catch (e) {
        console.error("Error applying saved open button position:", e);
      }
    } else {
      element.style.top = "10px";
      element.style.left = "10px";
      element.style.right = "auto";
      element.style.bottom = "auto";
    }
  }

  function resizeElement(element) {
    const resizeHandle = element.querySelector(".resize-handle");
    const textBox = element.querySelector(".float-box");

    textBox.addEventListener("mousedown", function (e) {
      e.stopPropagation();
    });

    resizeHandle.addEventListener("mousedown", initResize);

    let startX, startY, startWidth, startHeight, startTop;

    function initResize(e) {
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      const computedStyle = document.defaultView.getComputedStyle(element);
      startWidth = parseInt(computedStyle.width, 10);
      startHeight = parseInt(computedStyle.height, 10);
      startTop = parseInt(computedStyle.top, 10);
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }

    function resize(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newWidth = startWidth + dx;
      const newHeight = startHeight - dy;
      const newTop = startTop + dy;

      if (newWidth > 100) {
        element.style.width = newWidth + "px";
      }

      if (newHeight > 100) {
        element.style.height = newHeight + "px";
        element.style.top = newTop + "px";
      }
    }

    async function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);

      try {
        const position = {
          top: element.style.top,
          left: element.style.left,
          right: element.style.right,
          bottom: element.style.bottom,
          width: element.style.width,
          height: element.style.height,
        };
        await GM.setValue(COMMENT_BOX_POSITION_KEY, JSON.stringify(position));
      } catch (e) {
        console.error("Error saving resized position/size:", e);
      }
    }
  }

  function dragElement(elmnt, targetToMove, storageKey) {
    const elementToMove = targetToMove || elmnt;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let hasMoved = false;
    const moveThreshold = 7;

    elmnt.addEventListener("mousedown", startDrag);

    function startDrag(e) {
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "LABEL" ||
        e.target.className === "resize-handle" ||
        e.target.className === "close-btn" ||
        e.target.tagName === "SELECT" ||
        e.target.type === "radio"
      ) {
        return;
      }

      e.preventDefault();

      startX = e.clientX;
      startY = e.clientY;

      const computedStyle = window.getComputedStyle(elementToMove);
      initialLeft = parseInt(computedStyle.left, 10) || 0;
      initialTop = parseInt(computedStyle.top, 10) || 0;

      isDragging = true;
      hasMoved = false;

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    }

    function drag(e) {
      if (!isDragging) return;

      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (
        !hasMoved &&
        (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold)
      ) {
        hasMoved = true;
      }

      elementToMove.style.left = initialLeft + dx + "px";
      elementToMove.style.top = initialTop + dy + "px";

      elementToMove.style.right = "auto";
      elementToMove.style.bottom = "auto";
    }

    async function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);

      if (hasMoved) {
        wasDragged = true;
        setTimeout(() => {
          wasDragged = false;
        }, DRAG_COOLDOWN);
      }

      if (storageKey === OPEN_BUTTON_POSITION_KEY) {
        try {
          const position = {
            top: elementToMove.style.top,
            left: elementToMove.style.left,
            right: elementToMove.style.right,
            bottom: elementToMove.style.bottom,
          };
          await GM.setValue(storageKey, JSON.stringify(position));
        } catch (e) {
          console.error("Error saving dragged position:", e);
        }
      }
    }
  }

  async function displayDraftsList() {
    const draftsArea = document.getElementById("draftsPanel");
    if (!draftsArea) {
      console.error("Drafts area element (draftsPanel) not found!");
      return;
    }

    draftsArea.innerHTML = "";

    const draftsListWrapper = document.createElement("div");
    draftsListWrapper.className = "drafts-list-wrapper";
    draftsListWrapper.id = "draftsListWrapper";

    draftsArea.appendChild(draftsListWrapper);

    const drafts = await getAllDrafts();

    const draftEntries = Object.entries(drafts);

    if (draftEntries.length === 0) {
      draftsListWrapper.innerHTML = "<p>No saved drafts found.</p>";
    } else {
      draftEntries.sort(([, a], [, b]) => b.lastEdited - a.lastEdited);

      draftEntries.forEach(([url, draftData]) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "draft-item";
        itemDiv.dataset.url = url;

        const infoDiv = document.createElement("div");
        infoDiv.className = "draft-info";

        const titleLink = document.createElement("a");
        titleLink.href = url;
        titleLink.textContent = draftData.title || "Unknown Title";
        titleLink.style.fontWeight = "bold";
        titleLink.title = `Go to: ${draftData.title || "Unknown Title"} by ${
          draftData.author || "Unknown Author"
        }`;

        titleLink.style.color = "var(--comment-fg-color)";
        titleLink.style.textDecoration = "underline";
        titleLink.style.marginRight = "5px";

        const authorSpan = document.createElement("span");
        authorSpan.innerHTML = `<small>by ${
          draftData.author || "Unknown Author"
        }</small>`;
        authorSpan.style.fontSize = "0.9em";

        const scopeChapterSpan = document.createElement("span");
        scopeChapterSpan.style.fontSize = "0.9em";
        scopeChapterSpan.style.fontStyle = "italic";
        let scopeText = "";
        if (draftData.scope === "full") {
          scopeText = "(Full Work)";
        } else if (draftData.scope === "chapter" && draftData.chapterTitle) {
          scopeText = ` ${draftData.chapterTitle}`;
        } else if (draftData.scope === "chapter") {
          scopeText = "(Chapter)";
        }
        scopeChapterSpan.textContent = scopeText;

        const titleContainer = document.createElement("div");
        titleContainer.style.overflow = "hidden";
        titleContainer.style.textOverflow = "ellipsis";
        titleContainer.style.marginBottom = "3px";
        titleContainer.style.display = "flex";
        titleContainer.style.flexWrap = "wrap";
        titleContainer.style.alignItems = "baseline";

        titleContainer.appendChild(titleLink);
        titleContainer.appendChild(authorSpan);

        const chapterContainer = document.createElement("div");
        chapterContainer.style.marginBottom = "3px";
        if (scopeText) {
          chapterContainer.appendChild(scopeChapterSpan);
        }

        const dateSpan = document.createElement("span");
        dateSpan.className = "draft-date";
        const date = new Date(draftData.lastEdited);
        dateSpan.textContent = `Last edited: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        infoDiv.appendChild(titleContainer);
        infoDiv.appendChild(chapterContainer);
        infoDiv.appendChild(dateSpan);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "draft-delete-btn";
        deleteBtn.title = "Delete this draft";
        deleteBtn.addEventListener("click", async () => {
          const confirmMsg = `Delete draft for "${
            draftData.title || "Unknown Title"
          }" by ${draftData.author || "Unknown Author"}?`;
          if (confirm(confirmMsg)) {
            await deleteDraft(url);

            itemDiv.remove();

            const textBox = document.querySelector(".float-box");
            if (url === newURL && textBox) {
              textBox.value = "";
              updateCharacterCount();
              await saveDraft(newURL, "");

              const addBtn = document.querySelector("#addCmtBtn");
              if (addBtn) addBtn.disabled = true;
            }

            if (
              draftsListWrapper.querySelectorAll(".draft-item").length === 0
            ) {
              draftsListWrapper.innerHTML = "<p>No saved drafts found.</p>";

              const deleteAllContainer = draftsArea.querySelector(
                ".delete-all-container"
              );
              if (deleteAllContainer) deleteAllContainer.style.display = "none";
            }
            await updateOpenButtonBadge();
          }
        });

        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(deleteBtn);
        draftsListWrapper.appendChild(itemDiv);
      });
    }

    if (draftEntries.length > 0) {
      const deleteAllContainer = document.createElement("div");

      deleteAllContainer.className = "delete-all-container";
      deleteAllContainer.style.textAlign = "right";
      deleteAllContainer.style.marginTop = "5px";

      if (draftEntries.length > 1) {
        const deleteAllBtn = createStyledButton({
          text: "Delete all",
          className: "float-cmt-btn",
          styles: {
            backgroundColor: danger,
            color: "white",
            borderColor: "rgba(150,0,0,0.8)",
          },
          title: "Delete all saved drafts",
          attributes: { "aria-label": "Delete all saved comment drafts" },
          onClick: async () => {
            if (
              confirm(
                "Are you sure you want to delete ALL saved drafts? This action cannot be undone."
              )
            ) {
              const draftsBeforeDelete = await getAllDrafts();
              try {
                await GM.setValue(DRAFTS_STORAGE_KEY, "{}");

                await displayDraftsList();

                const textBox = document.querySelector(".float-box");
                if (textBox && draftsBeforeDelete[newURL]) {
                  textBox.value = "";
                  updateCharacterCount();

                  const addBtn = document.querySelector("#addCmtBtn");
                  if (addBtn) addBtn.disabled = true;
                }

                await updateOpenButtonBadge();
              } catch (error) {
                console.error("Error deleting all drafts:", error);
                alert(
                  "Failed to delete all drafts. Check the console for errors."
                );
              }
            }
          },
        });

        deleteAllBtn.addEventListener("mouseenter", () => {
          deleteAllBtn.style.backgroundColor = danger;
        });
        deleteAllBtn.addEventListener("mouseleave", () => {
          deleteAllBtn.style.backgroundColor = danger;
        });

        deleteAllContainer.appendChild(deleteAllBtn);

        draftsArea.appendChild(deleteAllContainer);
      } else {
        deleteAllContainer.style.display = "none";
        draftsArea.appendChild(deleteAllContainer);
      }
    }
  }

  const init = async () => {
    const workUrlMatch = curURL.match(/\/works\/(\d+)/);
    const chapterUrlMatch = curURL.match(/\/chapters\/(\d+)/);
    if (workUrlMatch) {
      currentWorkId = workUrlMatch[1];
    }
    if (chapterUrlMatch) {
      const title = document.querySelector("h3.title a");
      if (title) {
        const urlMatch = title.href.match(/\/works\/(\d+)/);
        if (urlMatch) {
          currentWorkId = urlMatch[1];
        }
      }
    }

    const body = document.body;

    const openButton = createButton();
    openButton.style.position = "fixed";
    openButton.style.zIndex = "102";
    openButton.style.padding = "5px 8px";

    body.appendChild(openButton);

    await applySavedOpenButtonPosition(openButton);
    dragElement(openButton, openButton, OPEN_BUTTON_POSITION_KEY);

    body.appendChild(addStyles());

    await ThemeManager.applyTheme();
    await checkAndApplyHideAnnouncements();
    await checkAndApplyEnableHoverQuote();

    setupHoverQuoteButton();

    const mainDiv = createMainDiv();
    mainDiv.style.display = "none";
    body.appendChild(mainDiv);

    await addStoredText();

    await updateOpenButtonBadge();

    const windowHeader = mainDiv.querySelector(".window-header");

    if (windowHeader) {
      dragElement(windowHeader, mainDiv);
    }

    resizeElement(mainDiv);

    await applySavedCommentBoxPosition(mainDiv);

    document.addEventListener("keydown", async (event) => {
      if (event.key === "Escape") {
        const commentBox = document.getElementById("LN-commentBox");
        if (commentBox && commentBox.style.display !== "none") {
          await closeCommentBox(commentBox);
        }
      }
    });
  };

  function removeAnnouncements() {
    const announcements = document.querySelectorAll("div.event.announcement");
    if (announcements.length > 0) {
      announcements.forEach((announcement) => announcement.remove());
    }
  }

  async function handleHideAnnouncementsChange(event) {
    const isChecked = event.target.checked;
    await GM.setValue(HIDE_ANNOUNCEMENTS_ENABLED_KEY, isChecked);
    if (isChecked) {
      await GM.setValue(HIDE_ANNOUNCEMENTS_TIMESTAMP_KEY, Date.now());
      removeAnnouncements();
    } else {
      await GM.setValue(HIDE_ANNOUNCEMENTS_TIMESTAMP_KEY, 0);
    }
  }

  function createHideAnnouncementsSetting() {
    const settingDiv = document.createElement("div");
    settingDiv.style.marginTop = "10px";
    settingDiv.style.display = "flex";
    settingDiv.style.alignItems = "center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "hideAnnouncementsCheckbox";
    checkbox.style.marginRight = "5px";
    checkbox.style.boxShadow = "none";

    const label = document.createElement("label");
    label.textContent = "Hide AO3 announcement banner";
    const smallText = document.createElement("small");
    smallText.textContent = " (expires in 1 week)";
    smallText.style.color = "var(--link-color)";
    smallText.style.fontSize = "0.8em";
    smallText.style.marginLeft = "5px";
    label.appendChild(smallText);
    label.htmlFor = "hideAnnouncementsCheckbox";
    label.style.cursor = "pointer";

    checkbox.addEventListener("change", handleHideAnnouncementsChange);

    settingDiv.appendChild(checkbox);
    settingDiv.appendChild(label);

    return settingDiv;
  }

  async function checkAndApplyHideAnnouncements() {
    const isEnabled = await GM.getValue(HIDE_ANNOUNCEMENTS_ENABLED_KEY, false);
    const enabledTimestamp = await GM.getValue(
      HIDE_ANNOUNCEMENTS_TIMESTAMP_KEY,
      0
    );
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    let shouldBeEnabled = isEnabled;

    if (
      isEnabled &&
      enabledTimestamp > 0 &&
      now - enabledTimestamp > oneWeekMs
    ) {
      await GM.setValue(HIDE_ANNOUNCEMENTS_ENABLED_KEY, false);
      await GM.setValue(HIDE_ANNOUNCEMENTS_TIMESTAMP_KEY, 0);
      shouldBeEnabled = false;
    }

    const checkbox = document.getElementById("hideAnnouncementsCheckbox");
    if (checkbox) {
      checkbox.checked = shouldBeEnabled;
    }

    if (shouldBeEnabled) {
      requestAnimationFrame(removeAnnouncements);
    }
  }

  async function handleEnableHoverQuoteChange(event) {
    const isChecked = event.target.checked;
    await GM.setValue(ENABLE_HOVER_QUOTE_KEY, isChecked);
    const internalQuoteButton = document.getElementById("internalQuoteBtn");
    const hoverQuoteButton = document.getElementById("hoverQuoteBtn");

    if (!isChecked) {
      if (internalQuoteButton) {
        internalQuoteButton.style.display = "inline-flex";
      }
      if (hoverQuoteButton)
        hoverQuoteButton.style.setProperty("display", "none", "important");
    } else {
      if (internalQuoteButton) {
        internalQuoteButton.style.display = "none";
      }
    }
  }

  function createEnableHoverQuoteSetting() {
    const settingDiv = document.createElement("div");
    settingDiv.style.marginTop = "10px";
    settingDiv.style.display = "flex";
    settingDiv.style.alignItems = "center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "enableHoverQuoteCheckbox";
    checkbox.style.marginRight = "5px";
    checkbox.style.boxShadow = "none";

    GM.getValue(ENABLE_HOVER_QUOTE_KEY, true).then((isEnabled) => {
      checkbox.checked = isEnabled;
    });

    const label = document.createElement("label");
    label.textContent = "Show inline quote button on highlight";
    label.htmlFor = "enableHoverQuoteCheckbox";
    label.style.cursor = "pointer";

    checkbox.addEventListener("change", handleEnableHoverQuoteChange);

    settingDiv.appendChild(checkbox);
    settingDiv.appendChild(label);

    return settingDiv;
  }

  async function createButtonColorSelector() {
    const handleButtonColorChange = async (event) => {
      const newColor = event.target.value;
      GM.setValue(ICON_COLOR_KEY, newColor);
      await ThemeManager.applyTheme();
    };
    const iconPref = await GM.getValue(ICON_COLOR_KEY, primary);
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = iconPref;
    colorInput.addEventListener("change", handleButtonColorChange);

    const settingDiv = document.createElement("div");
    settingDiv.style.display = "flex";
    settingDiv.style.flexDirection = "column";
    settingDiv.style.alignItems = "center";

    const label = document.createElement("label");
    label.textContent = "Button color";
    settingDiv.appendChild(label);
    settingDiv.appendChild(colorInput);

    return settingDiv;
  }

  async function checkAndApplyEnableHoverQuote() {
    const isEnabled = await GM.getValue(ENABLE_HOVER_QUOTE_KEY, true);
    const checkbox = document.getElementById("enableHoverQuoteCheckbox");
    const internalQuoteButton = document.getElementById("internalQuoteBtn");
    const hoverQuoteButton = document.getElementById("hoverQuoteBtn");

    if (checkbox) {
      checkbox.checked = isEnabled;
    }

    if (!isEnabled) {
      if (internalQuoteButton) {
        internalQuoteButton.style.display = "inline-flex";
      }
      if (hoverQuoteButton)
        hoverQuoteButton.style.setProperty("display", "none", "important");
    } else {
      if (internalQuoteButton) internalQuoteButton.style.display = "none";
    }
  }

  async function refreshSettingsCheckboxes() {
    const enableHoverQuoteCheckbox = document.getElementById(
      "enableHoverQuoteCheckbox"
    );
    if (enableHoverQuoteCheckbox) {
      const isHoverQuoteEnabled = await GM.getValue(
        ENABLE_HOVER_QUOTE_KEY,
        true
      );
      enableHoverQuoteCheckbox.checked = isHoverQuoteEnabled;
    }

    const hideAnnouncementsCheckbox = document.getElementById(
      "hideAnnouncementsCheckbox"
    );
    if (hideAnnouncementsCheckbox) {
      const isHideAnnouncementsEnabled = await GM.getValue(
        HIDE_ANNOUNCEMENTS_ENABLED_KEY,
        false
      );
      hideAnnouncementsCheckbox.checked = isHideAnnouncementsEnabled;
    }

    const themeSelect = document.getElementById("themeSelectDropdown");
    if (themeSelect) {
      const savedTheme = await GM.getValue("manualThemePreference", "dynamic");
      themeSelect.value = savedTheme;
    }
  }

  const createVersionInfo = () => {
    const versionDiv = document.createElement("div");
    const versionSpan = document.createElement("span");
    const link = document.createElement("a");
    link.href = URL;
    link.target = "_blank";
    link.textContent = `luvnotes v${VERSION} ♡`;
    link.style.fontSize = "0.8em";
    link.style.color = "var(--link-color)";
    link.style.textDecoration = "underline";
    link.style.border = "none";
    link.style.cursor = "pointer";
    versionDiv.appendChild(versionSpan);
    versionDiv.appendChild(link);
    versionDiv.style.position = "absolute";
    versionDiv.style.bottom = "1em";
    versionDiv.style.right = "1em";
    return versionDiv;
  };
  init();
})();
