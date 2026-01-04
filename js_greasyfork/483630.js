// ==UserScript==
// @name         Remove Annoying Comments in Refactoring Guru Examples
// @namespace    http://tampermonkey.net/
// @version      2024-01-01
// @description  Moves long code-explanatory comments under the hoverable raccoon icon, also removes unnecessary empty lines
// @author       CXCVI
// @license      GPLv3
// @match        https://refactoring.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=refactoring.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483630/Remove%20Annoying%20Comments%20in%20Refactoring%20Guru%20Examples.user.js
// @updateURL https://update.greasyfork.org/scripts/483630/Remove%20Annoying%20Comments%20in%20Refactoring%20Guru%20Examples.meta.js
// ==/UserScript==

const COMMENT_REGEX = /\n?( *<span class=\"cm-comment\">.*<\/span>\n)+\n?/gm;
const COMMENT_TAGS_REGEX =
  /\n?( *<span class=\"cm-comment\">\s*)("""|#\s*)?|(\s*<\/span>\n\n?)/gm;
const NEW_LINE_REGEX = /(?<=[^\n])\n\n(?=[^\n])/gm;
const MULTI_NEW_LINE_REGEX = /\n\n+/gm;
const TOOLTIP_COMMENT_REGEX = /%s/g;
const INFO_CARD_REGEX = /%s/g;

const codeBlocks = document.querySelectorAll("figure.code");

// Markup building 'MU'

const switchHTML = `
<label class="x-label x-vars">
    <input class="x-switch x-toggle" type="checkbox" checked="true">
    <span class="x-slider"></span>
    <span><!-- Do _not_ remove this --></span>
</label>
<span class="x-sign x-vars">Comments and empty lines</span>
`;

for (let codeBlock of codeBlocks) {
  const switchContainer = document.createElement("div");
  switchContainer.innerHTML = switchHTML;
  codeBlock.style.textAlign = "left"; // TODO check is it needed
  codeBlock.prepend(switchContainer);
}

const info = document.createElement("div");
info.classList.add("x-info-container");
info.id = "x-info";
document.body.prepend(info);

const tooltipHTML = `
<div class="x-tooltip x-vars">🦝💬
	<div class="x-tooltiptext">
		<div class="x-card">
			<div class="x-title">🧠</div>
			<div class="x-description">%s</div>
		</div>
	</div>
</div>
`;

const infoHTML = `
<div class="x-card x-info-message x-vars">
    <div class="x-title">⚠️</div>
    <div class="x-description">%s</div>
</div>
`;

const varsCSS = `
.x-vars {
    --x-main-color: #444;
    --x-input-focus: #e74c3c;
    --x-bg-color: #f8dcbe;
    --x-fg-color: #fff;
    --x-font-color: var(--x-input-focus);
}
`;

const switchCSS = `
.x-label {
    position: relative;
    gap: 30px;
    width: 50px;
    height: 20px;
    margin-top: -20px;
    line-height: 24px;
    text-align: left;
    text-size-adjust: 100%;
}

.x-sign {
    font-family: "PT Sans", "Helvetica Neue", Arial, sans-serif;
	font-size: 1.125rem;
	font-weight: 900;
    color: var(--x-font-color);
    margin-left: 5px;
}

.x-toggle {
    opacity: 0;
    width: 0;
    height: 0;
}
.x-slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--x-main-color);
    box-shadow: 4px 4px var(--x-main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-color);
    transition: 0.3s;
}
.x-slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--x-main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--x-fg-color);
    box-shadow: 0 3px 0 var(--x-main-color);
    transition: 0.3s;
}
.x-toggle:checked + .x-slider {
    background-color: var(--x-input-focus);
}

.x-toggle + .x-slider {
    background-color: var(--x-bg-color);
}
.x-toggle:checked + .x-slider:before {
    transform: translateX(30px);
}
`;

const tooltipCSS = `
.x-tooltip {
	position: relative;
	display: inline-block;
	white-space: normal;
}

.x-tooltip .x-tooltiptext {
	visibility: hidden;
	width: 500px;
	position: absolute;
	z-index: 1;
}

.x-tooltip:hover .x-tooltiptext {
	visibility: visible;
}

.x-card {
	display: flex;
	flex-direction: row;
    align-items: center;
	width: 30em;
	margin-left: 15px;
	background-color: var(--x-bg-color);
	border-radius: 1em;
	border-color: var(--x-main-color);
	border-style: solid;
	border-width: 0.25em;
	box-shadow: 0.25em 0.25em var(--x-main-color);
}

.x-card > * {
	font-family: "PT Sans", "Helvetica Neue", Arial, sans-serif;
    margin-top: 0.15em;
    margin-bottom: 0.15em;
}

.x-title {
	font-size: 1.125rem;
	font-weight: 900;
    margin-left: 0.25em;
    margin-right: 0.15em;
    paddinng-top: 0.25em;
}

.x-description {
	font-size: 0.725rem;
	font-weight: 400;
    margin-left: 0.15em;
    margin-right: 0.25em;
}
`;

const infoCSS = `
.x-info-container {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    padding: 5px;
    width: 50vw;
    height: 100vh;
    position: fixed;
    bottom: 1em;
    right: 1em;
    z-index: 161;
    pointer-events: none;
}
.x-card.x-info-message {
    color: var(--x-fg-color);
    background-color: var(--x-input-focus);
}
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = varsCSS + switchCSS + tooltipCSS + infoCSS;
document.head.appendChild(styleElement);

// Main management function 'MAIN': MU -> MAIN -> P,UI

const switches = document.querySelectorAll(".x-switch");

for (let [key, sw] of Object.entries(switches)) {
  const loader = sw.parentNode.parentNode.lastElementChild;
  sw.onclick = async (event) => {
    const sw = event.target;
    const pre = sw.parentNode.parentNode.nextElementSibling;
    const loaderID = showLoader(loader);
    let result = pre.innerHTML;
    try {
      result = await processingCode(sw.checked, pre.innerHTML, () => {
        return pre.classList.contains("cm-s-default");
      }, key);
    } catch (error) {
      showInfo(error.message, info);
      hideLoader(loaderID);
      sw.checked = !sw.checked; // optimistic interface
    }
    hideLoader(loaderID);
    pre.innerHTML = result;
    switch (sw.checked) {
      case false:
        showInfo("🦝🪄Comments hidden, empty lines compressed", info);
        break;
      case true:
        showInfo("🦝🪄Comments inlined, empty lines placed", info);
    }
  };
}

// UI-display functions 'UI'

function showLoader(container) {
  const initInner = container.innerHTML;
  const timerID = setInterval(() => {
    container.innerHTML = incrementLoader(container.innerHTML);
  }, 200);
  return { timerID, container, initInner };
}

function hideLoader({ timerID, container, initInner }) {
  clearInterval(timerID);
  container.innerHTML = initInner;
}

function showInfo(message, container) {
  const infoCard = createCard(message);
  container.appendChild(infoCard);
  setTimeout(() => {
    infoCard.remove();
  }, 3000);
}

function createCard(message) {
  const infoCard = document.createElement("div");
  infoCard.innerHTML = infoHTML.replace(INFO_CARD_REGEX, message);
  return infoCard;
}

function incrementLoader(line) {
  if (line === "") return "";
  const regex = /(?<text>.+?)(?<dots>\.*)$/g;
  const dict = [...line.matchAll(regex)][0].groups;
  let a = dict.dots.length;
  a = (a + 1) % 4;
  return dict.text + ".".repeat(a);
}

// Building Processing function 'P': P = HO(AS)

const processes = {};

async function processingCode(flag, code, check, key) {
  if (!processes[key]) {
    processes[key] = backuping(
        caching(
          intervaling(
            conditioning(
              check,
              modifyComments,
            ),
            1500,
          ),
        ),
      );
  }
  if (!flag) {
    return processes[key](code);
  } else {
    return processes[key].backup[0];
  }
}

// Application-Specific functions 'AS'

async function modifyComments(sample) {
  let immutant = sample;
  immutant = immutant.replace(COMMENT_REGEX, sanitizeComment);
  immutant = immutant.replace(NEW_LINE_REGEX, "\n");
  immutant = immutant.replace(MULTI_NEW_LINE_REGEX, "\n\n");
  return immutant;
}

function sanitizeComment(comment, ...rest) {
  const sanitizedComment = comment.replace(COMMENT_TAGS_REGEX, "");
  const tooltip = tooltipHTML.replace(TOOLTIP_COMMENT_REGEX, sanitizedComment);
  return tooltip;
}

async function waitCodeMirror() {
  console.warn(`Waiting for CodeMirror to load`);
}

// Highter-Order Functions 'HO'

function conditioning(check, callback) {
  return async (...args) => {
    if (check()) {
      return await callback(...args);
    } else {
      return false;
    }
  };
}

function intervaling(callback, delay) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const intervalID = setInterval(async () => {
        try {
          const result = await callback(...args);
          if (result) {
            clearInterval(intervalID);
            resolve(result);
          }
        } catch (error) {
          clearInterval(intervalID);
          reject(error);
        }
      }, delay);
    });
  };
}

function caching(func) {
  return async function cacheWrapper(...args) {
    if (cacheWrapper.cache === undefined) {
      console.log(`Cache miss`);
      cacheWrapper.cache = await func(...args);
      return cacheWrapper.cache;
    } else {
      console.log(`Cache hit`);
      return cacheWrapper.cache;
    }
  };
}

function backuping(func) {
  return async function backupWrapper(...args) {
    console.log(`Backing up before finction call`);
    backupWrapper.backup = args;
    return await func(...args);
  };
}
