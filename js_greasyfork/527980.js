// ==UserScript==
// @name        Better DGG Kick Embed
// @namespace   yuniDev.kickembed
// @match       https://kick.com/*
// @match       https://www.destiny.gg/bigscreen*
// @match       https://destiny.gg/bigscreen*
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.addStyle
// @version     1.11
// @license     MIT
// @author      yuniDev
// @run-at      document-idle
// @description Slightly hacky solution to embed full kick site instead of the embed. You can toggle kick chat on and off next to the script toggle in your userscript host extension.
// @downloadURL https://update.greasyfork.org/scripts/527980/Better%20DGG%20Kick%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/527980/Better%20DGG%20Kick%20Embed.meta.js
// ==/UserScript==

let showChat = false;
GM.getValue("show-chat", "false").then(value => showChat = value === "true");

let lastPath = "";

let insertedPlayer = null;

// We need to hide the embed from querySelector("iframe")
class iFrameWrapper extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<iframe is="x-frame-bypass" style="width:100%;height:100%;border:none;" class="embed-frame" src="" allow="fullscreen; autoplay; encrypted-media; picture-in-picture; web-share"></iframe>`;
    this.iframe = shadowRoot.querySelector('iframe');
  }

  static get observedAttributes() { return ['src'] };

  connectedCallback() { this.updateSrc(); }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') this.updateSrc();
  }

  updateSrc() {
    const src = this.getAttribute('src');
    if (src && this.iframe) this.iframe.src = src;
  }
}
customElements.define('kick-embed-iframe-wrapper', iFrameWrapper);

function htmlToNode(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}

function hideFunc(el) {
  el.style.display = 'none';
}

function addObserver(selector, func = hideFunc) {
  function checkAndHide(obs) {
    const elToHide = document.querySelector(selector);
    if (elToHide) {
      func(elToHide);
      obs.disconnect();
    }
  }
  const observer = new MutationObserver((_, obs) => checkAndHide(obs));
  observer.observe(document.body, { childList: true, subtree: true });
  checkAndHide(observer);
}

function hideSurroundings() {
  addObserver("[data-sidebar]", el => {
    el.setAttribute("data-sidebar", false);
    el.setAttribute("data-theatre", true);
    el.setAttribute("data-chat", showChat);
  });

  addObserver(".z-controls.hidden button", el => el.parentNode.style.display = 'none');
  addObserver("#channel-chatroom > div:first-child", el => el.style.display = 'none');

  addObserver(".z-modal:has(button[data-testid='accept-cookies'])");
}

function updateEmbed() {
    if (insertedPlayer) return;
  const iframe = document.querySelector("iframe.embed-frame");
  if (!iframe) return;
  const iframeLocation = iframe.src;
  let channel = null;
  if (iframeLocation.includes("player.kick")) {
    channel = iframeLocation.split('/').pop();
  } else if (window.location.hash.startsWith("#kick/")) {
    channel = window.location.hash.split('/')[1];
  }
  if (!channel) return;
  insertedPlayer = htmlToNode(`<kick-embed-iframe-wrapper class="embed-frame" style="display:block" src="https://kick.com/${channel}"></kick-embed-iframe-wrapper>`);
  iframe.parentNode.appendChild(insertedPlayer);
}



function loadDGG(channel) {
  document.body.appendChild(htmlToNode(`<script type="module" src="https://unpkg.com/x-frame-bypass"></script>`));

  function embedObserver(list, obs) {
    for (const mutation of list) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE &&
              node.tagName === 'IFRAME' &&
              node.classList.contains('embed-frame'))
            updateEmbed();
        }
      }
    }
  }
  const observer = new MutationObserver((obj, obs) => embedObserver(obj, obs));
  observer.observe(document.getElementById("embed"), { childList: true, subtree: true });
  const srcUpdater = new MutationObserver((list, obs) => {
    const iframe = document.querySelector("iframe.embed-frame");
    if (lastPath !== window.location.href) { // Changed url
      lastPath = window.location.href;
      return;
    }
    if (iframe.src !== "about:blank?player.kick" && iframe.src.includes("player.kick")) iframe.src = "about:blank?player.kick";
  });
  srcUpdater.observe(document.getElementById("embed"), { childList: true, subtree: true, attributes: true });
  updateEmbed();

  function clearObserver() {
    observer.disconnect();
    srcUpdater.disconnect();
    removeEventListener('hashchange', clearObserver);
  }
  return clearObserver;
}

async function toggleKickChat() {
  let showChat = (await GM.getValue("show-chat", "false")) === "true";
  showChat = !showChat;
  await GM.setValue("show-chat", String(showChat));
  if (!insertedPlayer) return;
  insertedPlayer.iframe.contentWindow.postMessage({ type: "yuniDev.kickembed.show-chat", value: showChat }, "*");
}

function setupChatToggleCallback() {
  window.addEventListener("message", ({ data }) => {
    const { type, value } = data;
    if (type == "yuniDev.kickembed.show-chat") {
      showChat = value;
      document.body.querySelector("[data-sidebar]").setAttribute("data-chat", value);
    }
  });
}

if (window.location.hostname === "kick.com" && window.self !== window.top) { // Kick inside of iframe
  hideSurroundings();
  setInterval(() => {
    if (![...document.querySelectorAll("nav")].find(el => el.getAttribute("style") && el.getAttribute("style").indexOf("display: none") > -1)) hideSurroundings();
  }, 200);
  setupChatToggleCallback();
} else if (window.location.pathname.startsWith("/bigscreen")) {
  let disconnect = loadDGG();
  lastPath = window.location.href;
  addEventListener('hashchange', () => {
    setTimeout(() => {
      disconnect();
      insertedPlayer?.remove();
      insertedPlayer = null;
      disconnect = loadDGG();
    }, 1);
  });

  GM.registerMenuCommand("Toggle Kick Chat", toggleKickChat);

  GM.addStyle(`iframe[src*="player.kick"].embed-frame { display:none !important; }`);
}