// ==UserScript==
// @name         Syntax Highlighting - UserStyles.world
// @namespace    https://github.com/pabli24
// @version      0.4
// @description  Syntax Highlighting for the Source Code. Additional features: load full code, theme switch, wrap code, copy code
// @author       Pabli
// @license      MIT
// @match        https://userstyles.world/style/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.world
// @require      https://greasyfork.org/scripts/469422-highlight-js-css-less-scss-stylus/code/Highlightjs%20CSS%20Less%20SCSS%20Stylus.js?version=1210677
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469444/Syntax%20Highlighting%20-%20UserStylesworld.user.js
// @updateURL https://update.greasyfork.org/scripts/469444/Syntax%20Highlighting%20-%20UserStylesworld.meta.js
// ==/UserScript==

(function() {
"use strict";
/*global hljs*/

const codeSection = document.querySelector("#code");
const h2 = codeSection.querySelector("h2");
const pre = codeSection.querySelector("pre");
const code = codeSection.querySelector("code");
const mark = codeSection.querySelector("mark");

const spanOptions = `
<span style="display: flex; justify-content: space-between; align-items: baseline">
  ${h2.outerHTML}
  <span style="margin-bottom: 0.5em">
  <input type="checkbox" id="code-full" style="opacity: 1; box-shadow: unset"><label for="code-full" style="margin-right: 0.5rem" data-tooltip="Don't trunace source code if it has over 10K characters">Full code</label>
  <input type="checkbox" id="code-wrap" style="opacity: 1; box-shadow: unset"><label for="code-wrap" style="margin-right: 0.5rem">Code wrap</label>
  <select id="theme-select" style="margin-right: 0.5rem">
    <optgroup label="Dark Theme">
      <option value="a11y-dark">a11y dark</option>
      <option value="atom-one-dark">Atom one dark</option>
      <option value="stackoverflow-dark">StackOverflow dark</option>
      <option value="github-dark">GitHub dark</option>
      <option value="tokyo-night-dark">Tokyo night dark</option>
      <option value="tomorrow-night-bright">Tomorrow night bright</option>
      <option value="vs2015">Visual Studio 2015 dark</option>
    </optgroup>
    <optgroup label="Light Theme">
      <option value="a11y-light">a11y light</option>
      <option value="atom-one-light">Atom one light</option>
      <option value="stackoverflow-light">StackOverflow light</option>
      <option value="github">GitHub</option>
      <option value="tokyo-night-light">Tokyo night light</option>
      <option value="vs">Visual Studio</option>
    </optgroup>
  </select>
  <button id="code-copy" data-tooltip="Copy source code" style="width: 18px; height: 18px; min-height: auto; vertical-align: middle; background: none; padding: 0; margin: 0; border: 0; cursor: pointer; box-shadow: unset">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
    </svg>
  </button>
  </span>
</span>
`;

h2.remove();
codeSection.insertAdjacentHTML("afterbegin", spanOptions);

highlight();
codeFull();
codeWrap();
codeTheme()
codeCopy();

function highlight() {
	if (/@preprocessor\s+stylus/.test(code.innerText)) {
		code.classList.add("language-stylus");
	} else if (/@preprocessor\s+less/.test(code.innerText)) {
		code.classList.add("language-less");
	} else {
		code.classList.add("language-css");
	}

	hljs.highlightElement(code);
}

async function loadFullCode() {
	const installBtn = document.querySelector("#install").href;

	try {
		mark.remove();
		const response = await fetch(installBtn);
		const css = await response.text();
		code.textContent = css;
		hljs.highlightElement(code);
	} catch (error) {
		code.textContent = error;
	}
}

function codeFull() {
	const boxFull = document.querySelector("#code-full");

	if (localStorage.getItem("codeFull") === "true") {
		if (mark) loadFullCode();
		boxFull.checked = true;
	} else if (mark) {
		mark.innerHTML += `<a id="fullcode" style="margin: 0 5px;cursor: pointer;font-weight: bold"> Load full code anyway</a>`;
		document.querySelector("#fullcode").onclick = () => loadFullCode();
	}

	boxFull.addEventListener("click", () => {
		if (mark) loadFullCode();
		localStorage.setItem("codeFull", boxFull.checked);
	});
}

function codeWrap() {
	const boxWrap = document.querySelector("#code-wrap");

	if (localStorage.getItem("codeWrap") === "true") {
		pre.classList.add("prewrap");
		boxWrap.checked = true;
	} else {
		pre.classList.remove("prewrap");
	}

	boxWrap.addEventListener("click", () => {
		pre.classList.toggle("prewrap");
		localStorage.setItem("codeWrap", boxWrap.checked);
	});
}

function codeTheme() {
	const themeSelect = document.querySelector("#theme-select");
	const themeLs = localStorage.getItem("codeTheme");
	pre.classList.add("hljs");

	if (themeLs) {
		themeSelect.value = themeLs;
		codeSection.className = "theme-" + themeLs;
	} else {
		codeSection.className = "theme-a11y-dark";
	}

	themeSelect.addEventListener('change', () => {
		const val = themeSelect.value;

		codeSection.className = "theme-" + val;
		localStorage.setItem("codeTheme", val);
	});
}

function codeCopy() {
	const copy = document.querySelector("#code-copy");

	copy.addEventListener("click", () => {
		navigator.clipboard.writeText(code.textContent);
		copy.setAttribute("data-tooltip", "Source code has been copied to your clipboard");
	});
}

GM_addStyle(`
.prewrap {white-space: pre-wrap; overflow-wrap: break-word}
@media screen and (max-width: 1250px) {#code > span {flex-flow: row wrap}}
#code-copy::before {width: auto}

/* a11y-dark - Author @ericwbailey - Maintainer @ericwbailey */
.theme-a11y-dark pre code.hljs{display:block;padding:1em}.theme-a11y-dark code.hljs{padding:3px 5px}.theme-a11y-dark .hljs{background:#2b2b2b;color:#f8f8f2}.theme-a11y-dark .hljs-comment,.theme-a11y-dark .hljs-quote{color:#d4d0ab}.theme-a11y-dark .hljs-deletion,.theme-a11y-dark .hljs-name,.theme-a11y-dark .hljs-regexp,.theme-a11y-dark .hljs-selector-class,.theme-a11y-dark .hljs-selector-id,.theme-a11y-dark .hljs-tag,.theme-a11y-dark .hljs-template-variable,.theme-a11y-dark .hljs-variable{color:#ffa07a}.theme-a11y-dark .hljs-built_in,.theme-a11y-dark .hljs-link,.theme-a11y-dark .hljs-literal,.theme-a11y-dark .hljs-meta,.theme-a11y-dark .hljs-number,.theme-a11y-dark .hljs-params,.theme-a11y-dark .hljs-type{color:#f5ab35}.theme-a11y-dark .hljs-attribute{color:gold}.theme-a11y-dark .hljs-addition,.theme-a11y-dark .hljs-bullet,.theme-a11y-dark .hljs-string,.theme-a11y-dark .hljs-symbol{color:#abe338}.theme-a11y-dark .hljs-section,.theme-a11y-dark .hljs-title{color:#00e0e0}.theme-a11y-dark .hljs-keyword,.theme-a11y-dark .hljs-selector-tag{color:#dcc6e0}.theme-a11y-dark .hljs-emphasis{font-style:italic}.theme-a11y-dark .hljs-strong{font-weight:700}@media screen and (-ms-high-contrast: active){.theme-a11y-dark .hljs-addition,.theme-a11y-dark .hljs-attribute,.theme-a11y-dark .hljs-built_in,.theme-a11y-dark .hljs-bullet,.theme-a11y-dark .hljs-comment,.theme-a11y-dark .hljs-link,.theme-a11y-dark .hljs-literal,.theme-a11y-dark .hljs-meta,.theme-a11y-dark .hljs-number,.theme-a11y-dark .hljs-params,.theme-a11y-dark .hljs-quote,.theme-a11y-dark .hljs-string,.theme-a11y-dark .hljs-symbol,.theme-a11y-dark .hljs-type{color:highlight}.theme-a11y-dark .hljs-keyword,.theme-a11y-dark .hljs-selector-tag{font-weight:700}}
/* a11y-light - Author @ericwbailey - Maintainer @ericwbailey */
.theme-a11y-light pre code.hljs{display:block;padding:1em}.theme-a11y-light code.hljs{padding:3px 5px}.theme-a11y-light .hljs{background:#fefefe;color:#545454}.theme-a11y-light .hljs-comment,.theme-a11y-light .hljs-quote{color:dimgray}.theme-a11y-light .hljs-deletion,.theme-a11y-light .hljs-name,.theme-a11y-light .hljs-regexp,.theme-a11y-light .hljs-selector-class,.theme-a11y-light .hljs-selector-id,.theme-a11y-light .hljs-tag,.theme-a11y-light .hljs-template-variable,.theme-a11y-light .hljs-variable{color:#d91e18}.theme-a11y-light .hljs-attribute,.theme-a11y-light .hljs-built_in,.theme-a11y-light .hljs-link,.theme-a11y-light .hljs-literal,.theme-a11y-light .hljs-meta,.theme-a11y-light .hljs-number,.theme-a11y-light .hljs-params,.theme-a11y-light .hljs-type{color:#aa5d00}.theme-a11y-light .hljs-addition,.theme-a11y-light .hljs-bullet,.theme-a11y-light .hljs-string,.theme-a11y-light .hljs-symbol{color:green}.theme-a11y-light .hljs-section,.theme-a11y-light .hljs-title{color:#007faa}.theme-a11y-light .hljs-keyword,.theme-a11y-light .hljs-selector-tag{color:#7928a1}.theme-a11y-light .hljs-emphasis{font-style:italic}.theme-a11y-light .hljs-strong{font-weight:700}@media screen and (-ms-high-contrast: active){.theme-a11y-light .hljs-addition,.theme-a11y-light .hljs-attribute,.theme-a11y-light .hljs-built_in,.theme-a11y-light .hljs-bullet,.theme-a11y-light .hljs-comment,.theme-a11y-light .hljs-link,.theme-a11y-light .hljs-literal,.theme-a11y-light .hljs-meta,.theme-a11y-light .hljs-number,.theme-a11y-light .hljs-params,.theme-a11y-light .hljs-quote,.theme-a11y-light .hljs-string,.theme-a11y-light .hljs-symbol,.theme-a11y-light .hljs-type{color:highlight}.theme-a11y-light .hljs-keyword,.theme-a11y-light .hljs-selector-tag{font-weight:700}}
/* Atom-one-dark */
.theme-atom-one-dark pre code.hljs{display:block;padding:1em}.theme-atom-one-dark code.hljs{padding:3px 5px}.theme-atom-one-dark .hljs{color:#abb2bf;background:#282c34}.theme-atom-one-dark .hljs-comment,.theme-atom-one-dark .hljs-quote{color:#5c6370;font-style:italic}.theme-atom-one-dark .hljs-doctag,.theme-atom-one-dark .hljs-formula,.theme-atom-one-dark .hljs-keyword{color:#c678dd}.theme-atom-one-dark .hljs-deletion,.theme-atom-one-dark .hljs-name,.theme-atom-one-dark .hljs-section,.theme-atom-one-dark .hljs-selector-tag,.theme-atom-one-dark .hljs-subst{color:#e06c75}.theme-atom-one-dark .hljs-literal{color:#56b6c2}.theme-atom-one-dark .hljs-addition,.theme-atom-one-dark .hljs-attribute,.theme-atom-one-dark .hljs-meta .hljs-string,.theme-atom-one-dark .hljs-regexp,.theme-atom-one-dark .hljs-string{color:#98c379}.theme-atom-one-dark .hljs-attr,.theme-atom-one-dark .hljs-number,.theme-atom-one-dark .hljs-selector-attr,.theme-atom-one-dark .hljs-selector-class,.theme-atom-one-dark .hljs-selector-pseudo,.theme-atom-one-dark .hljs-template-variable,.theme-atom-one-dark .hljs-type,.theme-atom-one-dark .hljs-variable{color:#d19a66}.theme-atom-one-dark .hljs-bullet,.theme-atom-one-dark .hljs-link,.theme-atom-one-dark .hljs-meta,.theme-atom-one-dark .hljs-selector-id,.theme-atom-one-dark .hljs-symbol,.theme-atom-one-dark .hljs-title{color:#61aeee}.theme-atom-one-dark .hljs-built_in,.theme-atom-one-dark .hljs-class .hljs-title,.theme-atom-one-dark .hljs-title.class_{color:#e6c07b}.theme-atom-one-dark .hljs-emphasis{font-style:italic}.theme-atom-one-dark .hljs-strong{font-weight:700}.theme-atom-one-dark .hljs-link{text-decoration:underline}
/* Atom-one-light */
.theme-atom-one-light pre code.hljs{display:block;padding:1em}.theme-atom-one-light code.hljs{padding:3px 5px}.theme-atom-one-light .hljs{color:#383a42;background:#fafafa}.theme-atom-one-light .hljs-comment,.theme-atom-one-light .hljs-quote{color:#a0a1a7;font-style:italic}.theme-atom-one-light .hljs-doctag,.theme-atom-one-light .hljs-formula,.theme-atom-one-light .hljs-keyword{color:#a626a4}.theme-atom-one-light .hljs-deletion,.theme-atom-one-light .hljs-name,.theme-atom-one-light .hljs-section,.theme-atom-one-light .hljs-selector-tag,.theme-atom-one-light .hljs-subst{color:#e45649}.theme-atom-one-light .hljs-literal{color:#0184bb}.theme-atom-one-light .hljs-addition,.theme-atom-one-light .hljs-attribute,.theme-atom-one-light .hljs-meta .hljs-string,.theme-atom-one-light .hljs-regexp,.theme-atom-one-light .hljs-string{color:#50a14f}.theme-atom-one-light .hljs-attr,.theme-atom-one-light .hljs-number,.theme-atom-one-light .hljs-selector-attr,.theme-atom-one-light .hljs-selector-class,.theme-atom-one-light .hljs-selector-pseudo,.theme-atom-one-light .hljs-template-variable,.theme-atom-one-light .hljs-type,.theme-atom-one-light .hljs-variable{color:#986801}.theme-atom-one-light .hljs-bullet,.theme-atom-one-light .hljs-link,.theme-atom-one-light .hljs-meta,.theme-atom-one-light .hljs-selector-id,.theme-atom-one-light .hljs-symbol,.theme-atom-one-light .hljs-title{color:#4078f2}.theme-atom-one-light .hljs-built_in,.theme-atom-one-light .hljs-class .hljs-title,.theme-atom-one-light .hljs-title.class_{color:#c18401}.theme-atom-one-light .hljs-emphasis{font-style:italic}.theme-atom-one-light .hljs-strong{font-weight:700}.theme-atom-one-light .hljs-link{text-decoration:underline}
/* StackOverflow Dark - License MIT - Author stackoverflow.com - Maintainer @Hirse - Website https://github.com/StackExchange/Stacks */
.theme-stackoverflow-dark pre code.hljs{display:block;padding:1em}.theme-stackoverflow-dark code.hljs{padding:3px 5px}.theme-stackoverflow-dark .hljs{color:#fff;background:#1c1b1b}.theme-stackoverflow-dark .hljs-subst{color:#fff}.theme-stackoverflow-dark .hljs-comment{color:#999}.theme-stackoverflow-dark .hljs-attr,.theme-stackoverflow-dark .hljs-doctag,.theme-stackoverflow-dark .hljs-keyword,.theme-stackoverflow-dark .hljs-meta .hljs-keyword,.theme-stackoverflow-dark .hljs-section,.theme-stackoverflow-dark .hljs-selector-tag{color:#88aece}.theme-stackoverflow-dark .hljs-attribute{color:#c59bc1}.theme-stackoverflow-dark .hljs-name,.theme-stackoverflow-dark .hljs-number,.theme-stackoverflow-dark .hljs-quote,.theme-stackoverflow-dark .hljs-selector-id,.theme-stackoverflow-dark .hljs-template-tag,.theme-stackoverflow-dark .hljs-type{color:#f08d49}.theme-stackoverflow-dark .hljs-selector-class{color:#88aece}.theme-stackoverflow-dark .hljs-link,.theme-stackoverflow-dark .hljs-regexp,.theme-stackoverflow-dark .hljs-selector-attr,.theme-stackoverflow-dark .hljs-string,.theme-stackoverflow-dark .hljs-symbol,.theme-stackoverflow-dark .hljs-template-variable,.theme-stackoverflow-dark .hljs-variable{color:#b5bd68}.theme-stackoverflow-dark .hljs-meta,.theme-stackoverflow-dark .hljs-selector-pseudo{color:#88aece}.theme-stackoverflow-dark .hljs-built_in,.theme-stackoverflow-dark .hljs-literal,.theme-stackoverflow-dark .hljs-title{color:#f08d49}.theme-stackoverflow-dark .hljs-bullet,.theme-stackoverflow-dark .hljs-code{color:#ccc}.theme-stackoverflow-dark .hljs-meta .hljs-string{color:#b5bd68}.theme-stackoverflow-dark .hljs-deletion{color:#de7176}.theme-stackoverflow-dark .hljs-addition{color:#76c490}.theme-stackoverflow-dark .hljs-emphasis{font-style:italic}.theme-stackoverflow-dark .hljs-strong{font-weight:700}
/* StackOverflow Light - License MIT - Author stackoverflow.com - Maintainer @Hirse - Website https://github.com/StackExchange/Stacks */
.theme-stackoverflow-light pre code.hljs{display:block;padding:1em}.theme-stackoverflow-light code.hljs{padding:3px 5px}.theme-stackoverflow-light .hljs{color:#2f3337;background:#f6f6f6}.theme-stackoverflow-light .hljs-subst{color:#2f3337}.theme-stackoverflow-light .hljs-comment{color:#656e77}.theme-stackoverflow-light .hljs-attr,.theme-stackoverflow-light .hljs-doctag,.theme-stackoverflow-light .hljs-keyword,.theme-stackoverflow-light .hljs-meta .hljs-keyword,.theme-stackoverflow-light .hljs-section,.theme-stackoverflow-light .hljs-selector-tag{color:#015692}.theme-stackoverflow-light .hljs-attribute{color:#803378}.theme-stackoverflow-light .hljs-name,.theme-stackoverflow-light .hljs-number,.theme-stackoverflow-light .hljs-quote,.theme-stackoverflow-light .hljs-selector-id,.theme-stackoverflow-light .hljs-template-tag,.theme-stackoverflow-light .hljs-type{color:#b75501}.theme-stackoverflow-light .hljs-selector-class{color:#015692}.theme-stackoverflow-light .hljs-link,.theme-stackoverflow-light .hljs-regexp,.theme-stackoverflow-light .hljs-selector-attr,.theme-stackoverflow-light .hljs-string,.theme-stackoverflow-light .hljs-symbol,.theme-stackoverflow-light .hljs-template-variable,.theme-stackoverflow-light .hljs-variable{color:#54790d}.theme-stackoverflow-light .hljs-meta,.theme-stackoverflow-light .hljs-selector-pseudo{color:#015692}.theme-stackoverflow-light .hljs-built_in,.theme-stackoverflow-light .hljs-literal,.theme-stackoverflow-light .hljs-title{color:#b75501}.theme-stackoverflow-light .hljs-bullet,.theme-stackoverflow-light .hljs-code{color:#535a60}.theme-stackoverflow-light .hljs-meta .hljs-string{color:#54790d}.theme-stackoverflow-light .hljs-deletion{color:#c02d2e}.theme-stackoverflow-light .hljs-addition{color:#2f6f44}.theme-stackoverflow-light .hljs-emphasis{font-style:italic}.theme-stackoverflow-light .hljs-strong{font-weight:700}.theme-sunburst pre code.hljs{display:block;overflow-x:auto;padding:1em}.theme-sunburst code.hljs{padding:3px 5px}.theme-sunburst .hljs{background:#000;color:#f8f8f8}.theme-sunburst .hljs-comment,.theme-sunburst .hljs-quote{color:#aeaeae;font-style:italic}.theme-sunburst .hljs-keyword,.theme-sunburst .hljs-selector-tag,.theme-sunburst .hljs-type{color:#e28964}.theme-sunburst .hljs-string{color:#65b042}.theme-sunburst .hljs-subst{color:#daefa3}.theme-sunburst .hljs-link,.theme-sunburst .hljs-regexp{color:#e9c062}.theme-sunburst .hljs-name,.theme-sunburst .hljs-section,.theme-sunburst .hljs-tag,.theme-sunburst .hljs-title{color:#89bdff}.theme-sunburst .hljs-class .hljs-title,.theme-sunburst .hljs-doctag,.theme-sunburst .hljs-title.class_{text-decoration:underline}.theme-sunburst .hljs-bullet,.theme-sunburst .hljs-number,.theme-sunburst .hljs-symbol{color:#3387cc}.theme-sunburst .hljs-params,.theme-sunburst .hljs-template-variable,.theme-sunburst .hljs-variable{color:#3e87e3}.theme-sunburst .hljs-attribute{color:#cda869}.theme-sunburst .hljs-meta{color:#8996a8}.theme-sunburst .hljs-formula{background-color:#0e2231;color:#f8f8f8;font-style:italic}.theme-sunburst .hljs-addition{background-color:#253b22;color:#f8f8f8}.theme-sunburst .hljs-deletion{background-color:#420e09;color:#f8f8f8}.theme-sunburst .hljs-selector-class{color:#9b703f}.theme-sunburst .hljs-selector-id{color:#8b98ab}.theme-sunburst .hljs-emphasis{font-style:italic}.theme-sunburst .hljs-strong{font-weight:700}
/* GitHub Dark - Author github.com - Maintainer @Hirse */
.theme-github-dark pre code.hljs{display:block;padding:1em}.theme-github-dark code.hljs{padding:3px 5px}.theme-github-dark .hljs{color:#c9d1d9;background:#0d1117}.theme-github-dark .hljs-doctag,.theme-github-dark .hljs-keyword,.theme-github-dark .hljs-meta .hljs-keyword,.theme-github-dark .hljs-template-tag,.theme-github-dark .hljs-template-variable,.theme-github-dark .hljs-type,.theme-github-dark .hljs-variable.language_{color:#ff7b72}.theme-github-dark .hljs-title,.theme-github-dark .hljs-title.class_,.theme-github-dark .hljs-title.class_.inherited__,.theme-github-dark .hljs-title.function_{color:#d2a8ff}.theme-github-dark .hljs-attr,.theme-github-dark .hljs-attribute,.theme-github-dark .hljs-literal,.theme-github-dark .hljs-meta,.theme-github-dark .hljs-number,.theme-github-dark .hljs-operator,.theme-github-dark .hljs-selector-attr,.theme-github-dark .hljs-selector-class,.theme-github-dark .hljs-selector-id,.theme-github-dark .hljs-variable{color:#79c0ff}.theme-github-dark .hljs-meta .hljs-string,.theme-github-dark .hljs-regexp,.theme-github-dark .hljs-string{color:#a5d6ff}.theme-github-dark .hljs-built_in,.theme-github-dark .hljs-symbol{color:#ffa657}.theme-github-dark .hljs-code,.theme-github-dark .hljs-comment,.theme-github-dark .hljs-formula{color:#8b949e}.theme-github-dark .hljs-name,.theme-github-dark .hljs-quote,.theme-github-dark .hljs-selector-pseudo,.theme-github-dark .hljs-selector-tag{color:#7ee787}.theme-github-dark .hljs-subst{color:#c9d1d9}.theme-github-dark .hljs-section{color:#1f6feb;font-weight:700}.theme-github-dark .hljs-bullet{color:#f2cc60}.theme-github-dark .hljs-emphasis{color:#c9d1d9;font-style:italic}.theme-github-dark .hljs-strong{color:#c9d1d9;font-weight:700}.theme-github-dark .hljs-addition{color:#aff5b4;background-color:#033a16}.theme-github-dark .hljs-deletion{color:#ffdcd7;background-color:#67060c}
/* GitHub - Author github.com - Maintainer @Hirse */
.theme-github pre code.hljs{display:block;padding:1em}.theme-github code.hljs{padding:3px 5px}.theme-github .hljs{color:#24292e;background:#fff}.theme-github .hljs-doctag,.theme-github .hljs-keyword,.theme-github .hljs-meta .hljs-keyword,.theme-github .hljs-template-tag,.theme-github .hljs-template-variable,.theme-github .hljs-type,.theme-github .hljs-variable.language_{color:#d73a49}.theme-github .hljs-title,.theme-github .hljs-title.class_,.theme-github .hljs-title.class_.inherited__,.theme-github .hljs-title.function_{color:#6f42c1}.theme-github .hljs-attr,.theme-github .hljs-attribute,.theme-github .hljs-literal,.theme-github .hljs-meta,.theme-github .hljs-number,.theme-github .hljs-operator,.theme-github .hljs-selector-attr,.theme-github .hljs-selector-class,.theme-github .hljs-selector-id,.theme-github .hljs-variable{color:#005cc5}.theme-github .hljs-meta .hljs-string,.theme-github .hljs-regexp,.theme-github .hljs-string{color:#032f62}.theme-github .hljs-built_in,.theme-github .hljs-symbol{color:#e36209}.theme-github .hljs-code,.theme-github .hljs-comment,.theme-github .hljs-formula{color:#6a737d}.theme-github .hljs-name,.theme-github .hljs-quote,.theme-github .hljs-selector-pseudo,.theme-github .hljs-selector-tag{color:#22863a}.theme-github .hljs-subst{color:#24292e}.theme-github .hljs-section{color:#005cc5;font-weight:700}.theme-github .hljs-bullet{color:#735c0f}.theme-github .hljs-emphasis{color:#24292e;font-style:italic}.theme-github .hljs-strong{color:#24292e;font-weight:700}.theme-github .hljs-addition{color:#22863a;background-color:#f0fff4}.theme-github .hljs-deletion{color:#b31d28;background-color:#ffeef0}
/* Tokyo-night-Dark - License MIT - Author (c) Henri Vandersleyen <hvandersleyen@gmail.com> */
.theme-tokyo-night-dark pre code.hljs{display:block;padding:1em}.theme-tokyo-night-dark code.hljs{padding:3px 5px}.theme-tokyo-night-dark .hljs-comment,.theme-tokyo-night-dark .hljs-meta{color:#565f89}.theme-tokyo-night-dark .hljs-deletion,.theme-tokyo-night-dark .hljs-doctag,.theme-tokyo-night-dark .hljs-regexp,.theme-tokyo-night-dark .hljs-selector-attr,.theme-tokyo-night-dark .hljs-selector-class,.theme-tokyo-night-dark .hljs-selector-id,.theme-tokyo-night-dark .hljs-selector-pseudo,.theme-tokyo-night-dark .hljs-tag,.theme-tokyo-night-dark .hljs-template-tag,.theme-tokyo-night-dark .hljs-variable.language_{color:#f7768e}.theme-tokyo-night-dark .hljs-link,.theme-tokyo-night-dark .hljs-literal,.theme-tokyo-night-dark .hljs-number,.theme-tokyo-night-dark .hljs-params,.theme-tokyo-night-dark .hljs-template-variable,.theme-tokyo-night-dark .hljs-type,.theme-tokyo-night-dark .hljs-variable{color:#ff9e64}.theme-tokyo-night-dark .hljs-attribute,.theme-tokyo-night-dark .hljs-built_in{color:#e0af68}.theme-tokyo-night-dark .hljs-keyword,.theme-tokyo-night-dark .hljs-property,.theme-tokyo-night-dark .hljs-subst,.theme-tokyo-night-dark .hljs-title,.theme-tokyo-night-dark .hljs-title.class_,.theme-tokyo-night-dark .hljs-title.class_.inherited__,.theme-tokyo-night-dark .hljs-title.function_{color:#7dcfff}.theme-tokyo-night-dark .hljs-selector-tag{color:#73daca}.theme-tokyo-night-dark .hljs-addition,.theme-tokyo-night-dark .hljs-bullet,.theme-tokyo-night-dark .hljs-quote,.theme-tokyo-night-dark .hljs-string,.theme-tokyo-night-dark .hljs-symbol{color:#9ece6a}.theme-tokyo-night-dark .hljs-code,.theme-tokyo-night-dark .hljs-formula,.theme-tokyo-night-dark .hljs-section{color:#7aa2f7}.theme-tokyo-night-dark .hljs-attr,.theme-tokyo-night-dark .hljs-char.escape_,.theme-tokyo-night-dark .hljs-keyword,.theme-tokyo-night-dark .hljs-name,.theme-tokyo-night-dark .hljs-operator{color:#bb9af7}.theme-tokyo-night-dark .hljs-punctuation{color:#c0caf5}.theme-tokyo-night-dark .hljs{background:#1a1b26;color:#9aa5ce}.theme-tokyo-night-dark .hljs-emphasis{font-style:italic}.theme-tokyo-night-dark .hljs-strong{font-weight:700}
/* Tokyo-night-light - License MIT - Author (c) Henri Vandersleyen <hvandersleyen@gmail.com> */
.theme-tokyo-night-light pre code.hljs{display:block;padding:1em}.theme-tokyo-night-light code.hljs{padding:3px 5px}.theme-tokyo-night-light .hljs-comment,.theme-tokyo-night-light .hljs-meta{color:#9699a3}.theme-tokyo-night-light .hljs-deletion,.theme-tokyo-night-light .hljs-doctag,.theme-tokyo-night-light .hljs-regexp,.theme-tokyo-night-light .hljs-selector-attr,.theme-tokyo-night-light .hljs-selector-class,.theme-tokyo-night-light .hljs-selector-id,.theme-tokyo-night-light .hljs-selector-pseudo,.theme-tokyo-night-light .hljs-tag,.theme-tokyo-night-light .hljs-template-tag,.theme-tokyo-night-light .hljs-variable.language_{color:#8c4351}.theme-tokyo-night-light .hljs-link,.theme-tokyo-night-light .hljs-literal,.theme-tokyo-night-light .hljs-number,.theme-tokyo-night-light .hljs-params,.theme-tokyo-night-light .hljs-template-variable,.theme-tokyo-night-light .hljs-type,.theme-tokyo-night-light .hljs-variable{color:#965027}.theme-tokyo-night-light .hljs-attribute,.theme-tokyo-night-light .hljs-built_in{color:#8f5e15}.theme-tokyo-night-light .hljs-keyword,.theme-tokyo-night-light .hljs-property,.theme-tokyo-night-light .hljs-subst,.theme-tokyo-night-light .hljs-title,.theme-tokyo-night-light .hljs-title.class_,.theme-tokyo-night-light .hljs-title.class_.inherited__,.theme-tokyo-night-light .hljs-title.function_{color:#0f4b6e}.theme-tokyo-night-light .hljs-selector-tag{color:#33635c}.theme-tokyo-night-light .hljs-addition,.theme-tokyo-night-light .hljs-bullet,.theme-tokyo-night-light .hljs-quote,.theme-tokyo-night-light .hljs-string,.theme-tokyo-night-light .hljs-symbol{color:#485e30}.theme-tokyo-night-light .hljs-code,.theme-tokyo-night-light .hljs-formula,.theme-tokyo-night-light .hljs-section{color:#34548a}.theme-tokyo-night-light .hljs-attr,.theme-tokyo-night-light .hljs-char.escape_,.theme-tokyo-night-light .hljs-keyword,.theme-tokyo-night-light .hljs-name,.theme-tokyo-night-light .hljs-operator{color:#5a4a78}.theme-tokyo-night-light .hljs-punctuation{color:#343b58}.theme-tokyo-night-light .hljs{background:#d5d6db;color:#565a6e}.theme-tokyo-night-light .hljs-emphasis{font-style:italic}.theme-tokyo-night-light .hljs-strong{font-weight:700}
/* Tomorrow-night-bright */
.theme-tomorrow-night-bright pre code.hljs{display:block;padding:1em}.theme-tomorrow-night-bright code.hljs{padding:3px 5px}.theme-tomorrow-night-bright .hljs-comment,.theme-tomorrow-night-bright .hljs-quote{color:#969896}.theme-tomorrow-night-bright .hljs-deletion,.theme-tomorrow-night-bright .hljs-name,.theme-tomorrow-night-bright .hljs-regexp,.theme-tomorrow-night-bright .hljs-selector-class,.theme-tomorrow-night-bright .hljs-selector-id,.theme-tomorrow-night-bright .hljs-tag,.theme-tomorrow-night-bright .hljs-template-variable,.theme-tomorrow-night-bright .hljs-variable{color:#d54e53}.theme-tomorrow-night-bright .hljs-built_in,.theme-tomorrow-night-bright .hljs-link,.theme-tomorrow-night-bright .hljs-literal,.theme-tomorrow-night-bright .hljs-meta,.theme-tomorrow-night-bright .hljs-number,.theme-tomorrow-night-bright .hljs-params,.theme-tomorrow-night-bright .hljs-type{color:#e78c45}.theme-tomorrow-night-bright .hljs-attribute{color:#e7c547}.theme-tomorrow-night-bright .hljs-addition,.theme-tomorrow-night-bright .hljs-bullet,.theme-tomorrow-night-bright .hljs-string,.theme-tomorrow-night-bright .hljs-symbol{color:#b9ca4a}.theme-tomorrow-night-bright .hljs-section,.theme-tomorrow-night-bright .hljs-title{color:#7aa6da}.theme-tomorrow-night-bright .hljs-keyword,.theme-tomorrow-night-bright .hljs-selector-tag{color:#c397d8}.theme-tomorrow-night-bright .hljs{background:#000;color:#eaeaea}.theme-tomorrow-night-bright .hljs-emphasis{font-style:italic}.theme-tomorrow-night-bright .hljs-strong{font-weight:700}
/* vs */
.theme-vs pre code.hljs{display:block;padding:1em}.theme-vs code.hljs{padding:3px 5px}.theme-vs .hljs{background:#fff;color:#000}.theme-vs .hljs-comment,.theme-vs .hljs-quote,.theme-vs .hljs-variable{color:green}.theme-vs .hljs-built_in,.theme-vs .hljs-keyword,.theme-vs .hljs-name,.theme-vs .hljs-selector-tag,.theme-vs .hljs-tag{color:blue}.theme-vs .hljs-addition,.theme-vs .hljs-attribute,.theme-vs .hljs-literal,.theme-vs .hljs-section,.theme-vs .hljs-string,.theme-vs .hljs-template-tag,.theme-vs .hljs-template-variable,.theme-vs .hljs-title,.theme-vs .hljs-type{color:#a31515}.theme-vs .hljs-deletion,.theme-vs .hljs-meta,.theme-vs .hljs-selector-attr,.theme-vs .hljs-selector-pseudo{color:#2b91af}.theme-vs .hljs-doctag{color:gray}.theme-vs .hljs-attr{color:red}.theme-vs .hljs-bullet,.theme-vs .hljs-link,.theme-vs .hljs-symbol{color:#00b0e8}.theme-vs .hljs-emphasis{font-style:italic}.theme-vs .hljs-strong{font-weight:700}
/* vs2015 */
.theme-vs2015 pre code.hljs{display:block;padding:1em}.theme-vs2015 code.hljs{padding:3px 5px}.theme-vs2015 .hljs{background:#1e1e1e;color:#dcdcdc}.theme-vs2015 .hljs-keyword,.theme-vs2015 .hljs-literal,.theme-vs2015 .hljs-name,.theme-vs2015 .hljs-symbol{color:#569cd6}.theme-vs2015 .hljs-link{color:#569cd6;text-decoration:underline}.theme-vs2015 .hljs-built_in,.theme-vs2015 .hljs-type{color:#4ec9b0}.theme-vs2015 .hljs-class,.theme-vs2015 .hljs-number{color:#b8d7a3}.theme-vs2015 .hljs-meta .hljs-string,.theme-vs2015 .hljs-string{color:#d69d85}.theme-vs2015 .hljs-regexp,.theme-vs2015 .hljs-template-tag{color:#9a5334}.theme-vs2015 .hljs-formula,.theme-vs2015 .hljs-function,.theme-vs2015 .hljs-params,.theme-vs2015 .hljs-subst,.theme-vs2015 .hljs-title{color:#dcdcdc}.theme-vs2015 .hljs-comment,.theme-vs2015 .hljs-quote{color:#57a64a;font-style:italic}.theme-vs2015 .hljs-doctag{color:#608b4e}.theme-vs2015 .hljs-meta,.theme-vs2015 .hljs-meta .hljs-keyword,.theme-vs2015 .hljs-tag{color:#9b9b9b}.theme-vs2015 .hljs-template-variable,.theme-vs2015 .hljs-variable{color:#bd63c5}.theme-vs2015 .hljs-attr,.theme-vs2015 .hljs-attribute{color:#9cdcfe}.theme-vs2015 .hljs-section{color:gold}.theme-vs2015 .hljs-emphasis{font-style:italic}.theme-vs2015 .hljs-strong{font-weight:700}.theme-vs2015 .hljs-bullet,.theme-vs2015 .hljs-selector-attr,.theme-vs2015 .hljs-selector-class,.theme-vs2015 .hljs-selector-id,.theme-vs2015 .hljs-selector-pseudo,.theme-vs2015 .hljs-selector-tag{color:#d7ba7d}.theme-vs2015 .hljs-addition{background-color:#144212;display:inline-block;width:100%}.theme-vs2015 .hljs-deletion{background-color:#600;display:inline-block;width:100%}
`);

})();