// ==UserScript==
// @name         war-intercept
// @namespace    seintz.torn.war-intercept
// @version      6.2.1
// @author       seintz [2460991], finally [2060206]
// @description  add link on attack page for intercept
// @license      GNU GPLv3
// @source       https://update.greasyfork.org/scripts/429606/war-intercept.user.js
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429606/war-intercept.user.js
// @updateURL https://update.greasyfork.org/scripts/429606/war-intercept.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const r=document.createElement("style");r.textContent=t,document.head.append(r)})(" *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.finally-ap-link{color:var(--default-color)}.visible{visibility:visible}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.m-2{margin:.5rem}.block{display:block}.table{display:table}.table-cell{display:table-cell}.table-row{display:table-row}.hidden{display:none}.h-4{height:1rem}.w-4{width:1rem}.resize{resize:both}.border{border-width:1px}.bg-nstmain{--tw-bg-opacity: 1;background-color:rgb(66 140 165 / var(--tw-bg-opacity, 1))}.bg-nstred{--tw-bg-opacity: 1;background-color:rgb(185 70 45 / var(--tw-bg-opacity, 1))}.bg-nstyellow{--tw-bg-opacity: 1;background-color:rgb(252 196 25 / var(--tw-bg-opacity, 1))}.text-center{text-align:center}.text-base{font-size:1rem;line-height:1.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.text-black{--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.text-nstgreen{--tw-text-opacity: 1;color:rgb(108 173 43 / var(--tw-text-opacity, 1))}.text-nstmain{--tw-text-opacity: 1;color:rgb(66 140 165 / var(--tw-text-opacity, 1))}.text-nstred{--tw-text-opacity: 1;color:rgb(185 70 45 / var(--tw-text-opacity, 1))}.text-nsttorntext{color:var(--default-color)}.text-nstyellow{--tw-text-opacity: 1;color:rgb(252 196 25 / var(--tw-text-opacity, 1))}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)} ");

(function () {
  'use strict';

  const isPDA = () => {
    return window.flutter_inappwebview !== void 0;
  };
  const actionLogNode = "ul[class^='list']";
  const logNode = "span[class^='message'] > span";
  const participantsNode = "ul[class^='participants']";
  const participantNode = "div[class^='playerWrap'] > span[class^='playername']";
  function addProfileLink(node, name) {
    if (!node || node.querySelector("a")) return;
    const targetBlank = isPDA() ? "" : ' target="_blank"';
    node.innerHTML = `<a class="finally-ap-link"${targetBlank} href="profiles.php?NID=${name}">${name}</a>`;
  }
  function addLogLinks(node) {
    if (!node || node.querySelector("a")) return;
    const targetBlank = isPDA() ? "" : ' target="_blank" ';
    node.innerHTML = node.innerHTML.replace(/^([^\s]+)/i, `<a class="finally-ap-link"${targetBlank}href="profiles.php?NID=$1">$1</a>`).replace(
      /(\s(?:from|hit(?:ting)?|defeated|stalemated\swith|near|against|puncturing|at|damaged|miss(?:ed|ing)|left|mugged|hospitalized|lost\sto)\s)([^\s,]+)/i,
      '$1<a class="finally-ap-link" href="profiles.php?NID=$2">$2</a>'
    ).replace(/(\s(?:in)\s)([^\s,]+)('s\sface)/i, '$1<a class="finally-ap-link" href="profiles.php?NID=$2">$2</a>$3');
  }
  function observeActionLog(root) {
    if (!root) return;
    root.querySelectorAll(logNode).forEach(addLogLinks);
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof Element)) continue;
          node.querySelectorAll(logNode).forEach(addLogLinks);
        }
      }
    }).observe(root, { childList: true, subtree: true });
  }
  function observeParticipants(root) {
    if (!root) return;
    root.querySelectorAll(participantNode).forEach((node) => {
      addProfileLink(node, node.innerText);
    });
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof Element)) continue;
          node.querySelectorAll(participantNode).forEach((child) => {
            addProfileLink(child, child.innerText);
          });
        }
      }
    }).observe(root, { childList: true, subtree: true });
  }
  observeActionLog(document.querySelector(actionLogNode));
  if (!isPDA()) observeParticipants(document.querySelector(participantsNode));
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (!(node instanceof Element)) continue;
        observeActionLog(node.querySelector(actionLogNode));
        if (!isPDA()) observeParticipants(node.querySelector(participantsNode));
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

})();