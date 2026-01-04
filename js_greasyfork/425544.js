// ==UserScript==
// @name        NPM - More Install Button
// @namespace   armagan.rest
// @match       http*://www.npmjs.com/*
// @grant       none
// @version     0.2.1
// @author      Kıraç Armağan Önal
// @description Allows you to add more install buttons.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/425544/NPM%20-%20More%20Install%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/425544/NPM%20-%20More%20Install%20Button.meta.js
// ==/UserScript==

(() => {

  // Add your buttons to here!
  const buttons = Object.freeze(
    [
      ({moduleName, moduleVersion})=>{
        return `yarn add ${moduleName}@${moduleVersion}`;
      },
      ({moduleName, moduleVersion})=>{
        return `yarn add --dev ${moduleName}@${moduleVersion}`;
      },
      ({moduleName, moduleVersion})=>{
        return `yarn global add ${moduleName}@${moduleVersion}`;
      },
      ({ moduleName, hasDeclarations, declarationsModuleName, moduleVersion }) => {
        if (moduleName.startsWith("@types/")) return;
        return hasDeclarations ? `yarn add --dev @types/${declarationsModuleName}@${moduleVersion}` : null;
      },
      ({ moduleName, hasDeclarations, declarationsModuleName, moduleVersion }) => {
        if (moduleName.startsWith("@types/")) return;
        return hasDeclarations ? `yarn add ${moduleName} && yarn add --dev @types/${declarationsModuleName}@${moduleVersion}` : null;
      }
    ].reverse()
  );

  function appendStyle(style = "") {
    let element = document.createElement("style");
    element.innerHTML = style;
    document.head.appendChild(element);
  }

  function copyToClipboard(text = "") {
    let element = document.createElement("textarea");
    element.value = text;
    element.setAttribute("style", `position:absolute;top:0;left:0;opacity:0;z-index:9999999999;`);
    document.body.prepend(element);
    element.focus({ preventScroll: true });
    element.select();
    document.execCommand("copy", false, false);
    element.remove();
  }

  function createCopyElement(text = "") {
    let element = document.createElement("p");
    element.className = "d767adf4 lh-copy truncate ph0 mb3 black-80 b5be2af6 f6 flex flex-row mib-container";
    element.innerHTML = `
    <svg viewBox="0 0 12.32 9.33">
      <g>
        <line class="st1" x1="7.6" y1="8.9" x2="7.6" y2="6.9"></line>
        <rect width="1.9" height="1.9"></rect>
        <rect x="1.9" y="1.9" width="1.9" height="1.9"></rect>
        <rect x="3.7" y="3.7" width="1.9" height="1.9"></rect>
        <rect x="1.9" y="5.6" width="1.9" height="1.9"></rect>
        <rect y="7.5" width="1.9" height="1.9"></rect>
      </g>
    </svg>
      <code class="flex-auto truncate db" title="Copy Command to Clipboard">
        <span>${text}</span>
      </code>
    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
    </svg>
  `
    element.addEventListener("click", () => {
      copyToClipboard(text);
      element.classList.add("mib-copied");
      setTimeout(() => {
        element.classList.remove("mib-copied");
      }, 100);
    });
    return element;
  }

  appendStyle(`
  .mib-container span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .mib-container svg {
    transition: transform 100ms ease-in-out !important;
  }
  
  .mib-copied svg {
    transform: scale(1.5) !important;
  }
  `);

  window.createCopyElement = createCopyElement;

  let mem = { _moduleName: null };

  setInterval(() => {
    let moduleName = document.querySelector("#top h2.no-underline [title]")?.title;
    let moduleVersion = document.querySelector("span.f6.dib.ph0.pv2.mb2-ns.black-80.nowrap.f5.fw4.lh-copy")?.textContent?.split(" ")?.[0];

    if (`${moduleName}@${moduleVersion}` != mem._moduleName) {
      console.log(moduleName)
      mem._moduleName = `${moduleName}@${moduleVersion}`;
      let originalButton = document.querySelector(`[title*="Copy Command"]`);
      let buttonContainer = originalButton?.parentNode?.parentNode;
      originalButton.remove();
      if (!buttonContainer) return;
      console.log(buttonContainer);
      let locationSplitted = window.location.href.split("/");
      let hasDeclarations = !!document.querySelector(`#top h2.no-underline [title*="This package has TypeScript"]`);
      let declarationsModuleName = hasDeclarations ? moduleName.replace("@","").replace("/","__") : null;
      
      buttons.forEach(buttonTextFunction => {
        let text = buttonTextFunction({ moduleName, hasDeclarations, declarationsModuleName, moduleVersion });
        if (!text) return;
        console.log(text)
        let element = createCopyElement(text);
        console.log(element);
        buttonContainer.insertBefore(element, buttonContainer.children[1]);
      });
    }
  }, 250);

})();