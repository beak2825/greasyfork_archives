// ==UserScript==
// @name         Play with MPV (Enhanced)
// @namespace    play-with-mpv-enhanced
// @version      2025.07.18.10
// @description  Combines a floating button, thumbnail clicks, and a Shift+Click fallback context menu to play videos in MPV.
// @author       Akatsuki Rui, nSinister (Merged by Gabreek)
// @license      MIT License
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@06f2015c04db3aaab9717298394ca4f025802873/gm_config.js
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-idle
// @noframes
// @match        *://*.youtube.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.crunchyroll.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.kick.com/*
// @match        *://vimeo.com/*
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/542145/Play%20with%20MPV%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542145/Play%20with%20MPV%20%28Enhanced%29.meta.js
// ==/UserScript==

"use strict";

// --- METADATA AND CONSTANTS ---

const MPV_HANDLER_VERSION = "v0.3.15";

const ICON_MPV =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0\
PSI2NCIgdmVyc2lvbj0iMSI+CiA8Y2lyY2xlIHN0eWxlPSJvcGFjaXR5Oi4yIiBjeD0iMzIiIGN5\
PSIzMyIgcj0iMjgiLz4KIDxjaXJjbGUgc3R5bGU9ImZpbGw6IzhkMzQ4ZSIgY3g9IjMyIiBjeT0i\
MzIiIHI9IjI4Ii8+CiA8Y2lyY2xlIHN0eWxlPSJvcGFjaXR5Oi4zIiBjeD0iMzQuNSIgY3k9IjI5\
LjUiIHI9IjIwLjUiLz4KIDxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6LjIiIGN4PSIzMiIgY3k9IjMz\
IiByPSIxNCIvPgogPGNpcmNsZSBzdHlsZT0iZmlsbDojZmZmZmZmIiBjeD0iMzIiIGN5PSIzMiIg\
cj0iMTQiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiM2OTFmNjkiIHRyYW5zZm9ybT0ibWF0cml4KDEu\
NTE1NTQ0NSwwLDAsMS41LC0zLjY1Mzg3OSwtNC45ODczODQ4KSIgZD0ibTI3LjE1NDUxNyAyNC42\
NTgyNTctMy40NjQxMDEgMi0zLjQ2NDEwMiAxLjk5OTk5OXYtNC0zLjk5OTk5OWwzLjQ2NDEwMiAy\
eiIvPgogPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjtvcGFjaXR5Oi4xIiBkPSJNIDMyIDQgQSAy\
OCAyOCAwIDAgMCA0IDMyIEEgMjggMjggMCAwIDAgNC4wMjE0ODQ0IDMyLjU4NTkzOCBBIDI4IDI4\
IDAgMCAxIDMyIDUgQSAyOCAyOCAwIDAgMSA1OS45Nzg1MTYgMzIuNDE0MDYyIEEgMjggMjggMCAw\
IDAgNjAgMzIgQSAyOCAyOCAwIDAgMCAzMiA0IHoiLz4KPC9zdmc+Cg==";

const ICON_SETTINGS =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0\
PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KIDxkZWZzPgogIDxzdHlsZSBpZD0iY3VycmVudC1j\
b2xvci1zY2hlbWUiIHR5cGU9InRleHQvY3NzIj4KICAgLkNvbG9yU2NoZW1lLVRleHQgeyBjb2xv\
cjojNDQ0NDQ0OyB9IC5Db2xvclNjaGVtZS1IaWdobGlnaHQgeyBjb2xvcjojNDI4NWY0OyB9CiAg\
PC9zdHlsZT4KIDwvZGVmcz4KIDxwYXRoIHN0eWxlPSJmaWxsOmN1cnJlbnRDb2xvciIgY2xhc3M9\
IkNvbG9yU2NoZW1lLVRleHQiIGQ9Ik0gNi4yNSAxIEwgNi4wOTU3MDMxIDIuODQzNzUgQSA1LjUg\
NS41IDAgMCAwIDQuNDg4MjgxMiAzLjc3MzQzNzUgTCAyLjgxMjUgMi45ODQzNzUgTCAxLjA2MjUg\
Ni4wMTU2MjUgTCAyLjU4Mzk4NDQgNy4wNzIyNjU2IEEgNS41IDUuNSAwIDAgMCAyLjUgOCBBIDUu\
NSA1LjUgMCAwIDAgMi41ODAwNzgxIDguOTMxNjQwNiBMIDEuMDYyNSA5Ljk4NDM3NSBMIDIuODEy\
NSAxMy4wMTU2MjUgTCA0LjQ4NDM3NSAxMi4yMjg1MTYgQSA1LjUgNS41IDAgMCAwIDYuMDk1NzAz\
MSAxMy4xNTIzNDQgTCA2LjI0NjA5MzggMTUuMDAxOTUzIEwgOS43NDYwOTM4IDE1LjAwMTk1MyBM\
IDkuOTAwMzkwNiAxMy4xNTgyMDMgQSA1LjUgNS41IDAgMCAwIDExLjUwNzgxMiAxMi4yMjg1MTYg\
TCAxMy4xODM1OTQgMTMuMDE3NTc4IEwgMTQuOTMzNTk0IDkuOTg2MzI4MSBMIDEzLjQxMjEwOSA4\
LjkyOTY4NzUgQSA1LjUgNS41IDAgMCAwIDEzLjQ5NjA5NCA4LjAwMTk1MzEgQSA1LjUgNS41IDAg\
MCAwIDEzLjQxNjAxNiA3LjA3MDMxMjUgTCAxNC45MzM1OTQgNi4wMTc1NzgxIEwgMTMuMTgzNTk0\
IDIuOTg2MzI4MSBMIDExLjUxMTcxOSAzLjc3MzQzNzUgQSA1LjUgNS41IDAgMCAwIDkuOTAwMzkw\
NiAyLjg0OTYwOTQgTCA5Ljc1IDEgTCA2LjI1IDEgeiBNIDggNiBBIDIgMiAwIDAgMSAxMCA4IEEg\
MiAyIDAgMCAxIDggMTAgQSAyIDIgMCAwIDEgNiA4IEEgMiAyIDAgMCAxIDggNiB6IiB0cmFuc2Zv\
cm09InRyYW5zbGF0ZSg0IDQpIi8+Cjwvc3ZnPgo=";

// Unified configuration for supported sites
const SITES = {
  "www.youtube.com": {
    watchPaths: { mode: true, list: ["/watch", "/playlist", "/shorts"] },
    // Este seletor universal encontra qualquer link para um vídeo que contenha uma imagem (uma thumbnail).
    thumbSelector: 'a[href*="/watch?v="]:has(img)',
    thumbNeedsFullUrl: true,
  },
  "m.youtube.com": {
    watchPaths: { mode: true, list: ["/watch", "/playlist", "/shorts"] },
    thumbSelector: "a.media-item-thumbnail-container",
    thumbNeedsFullUrl: true,
  },
  "www.twitch.tv": {
    watchPaths: { mode: false, list: ["/directory", "/downloads", "/jobs", "/p", "/turbo"] },
  },
  "www.crunchyroll.com": {
    watchPaths: { mode: true, list: ["/watch"] },
  },
  "www.bilibili.com": {
    watchPaths: { mode: true, list: ["/bangumi/play", "/video"] },
    thumbSelector: "a.bili-video-card__image--link",
    thumbNeedsFullUrl: false,
  },
  "live.bilibili.com": {
    watchPaths: { mode: false, list: ["/p"] },
  },
  "kick.com": {
    watchPaths: { mode: false, list: ["/browse", "/category"] },
    thumbSelector: "a.card-thumbnail",
    thumbNeedsFullUrl: true,
  },
  "vimeo.com": {
    watchPaths: { mode: true, list: ["/"] },
    thumbSelector: "a.iris_video-vital__overlay",
    thumbNeedsFullUrl: false,
  },
};

// --- CSS ---

const css = String.raw;

const MPV_CSS = css`
  .play-with-mpv { z-index: 99999; position: fixed; left: 8px; bottom: 8px; width: 48px; height: 48px; }
  .pwm-play { width: 48px; height: 48px; border: 0; border-radius: 50%; background-size: 48px; background-image: url(data:image/svg+xml;base64,${ICON_MPV}); background-repeat: no-repeat; display: block; cursor: pointer; }
  .pwm-settings { opacity: 0; visibility: hidden; transition: all 0.2s ease-in-out; display: block; position: absolute; top: -32px; left: 8px; width: 32px; height: 32px; border: 0; border-radius: 50%; background-size: 32px; background-color: #eeeeee; background-image: url(data:image/svg+xml;base64,${ICON_SETTINGS}); background-repeat: no-repeat; cursor: pointer; }
  .play-with-mpv:hover .pwm-settings { opacity: 1; visibility: visible; }
`;

const CONTEXT_MENU_CSS = css`
  #pwm-context-menu { position: fixed; z-index: 100000; display: none; background-color: #ffffff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 5px 0; min-width: 180px; }
  #pwm-context-menu-item { padding: 8px 15px; font-size: 14px; color: #333; cursor: pointer; display: flex; align-items: center; gap: 10px; }
  #pwm-context-menu-item:hover { background-color: #f0f0f0; }
  #pwm-context-menu-item img { width: 16px; height: 16px; }
`;

const CONFIG_ID = "play-with-mpv";

const CONFIG_CSS = css`
  body { display: flex; justify-content: center; background-color: #f0f0f0; }
  #${CONFIG_ID}_wrapper { display: flex; flex-direction: column; justify-content: center; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  #${CONFIG_ID} .config_header { display: flex; align-items: center; padding: 12px; font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; margin-bottom: 15px; }
  #${CONFIG_ID} .config_var { margin: 0 0 12px 0; display: flex; align-items: center; justify-content: space-between; }
  #${CONFIG_ID} .field_label { display: inline-block; width: 150px; font-size: 14px; color: #555; }
  #${CONFIG_ID}_field_cookies, #${CONFIG_ID}_field_profile, #${CONFIG_ID}_field_quality, #${CONFIG_ID}_field_v_codec, #${CONFIG_ID}_field_console, #${CONFIG_ID}_field_enqueue { width: 100px; height: 28px; font-size: 14px; text-align: center; border: 1px solid #ccc; border-radius: 4px; }
  #${CONFIG_ID}_field_profile { text-align: left; padding-left: 5px; }
  #${CONFIG_ID}_buttons_holder { display: flex; flex-direction: column; margin-top: 10px; }
  #${CONFIG_ID} .saveclose_buttons { margin: 2px; padding: 8px 0; border-radius: 5px; border: none; cursor: pointer; font-size: 14px; background-color: #4285f4; color: white; }
  #${CONFIG_ID} .reset_holder { padding-top: 4px; text-align: center; }
  #${CONFIG_ID}_reset{ color: #777; font-size: 12px; cursor: pointer; }
`;

const CONFIG_IFRAME_CSS = css`
  position: fixed; z-index: 99999; width: 340px; height: 420px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); top: 50%; left: 50%; transform: translate(-50%, -50%);
`;

const CONFIG_FIELDS = {
  cookies: { label: "Try to Pass Cookies", type: "select", options: ["yes", "no"], default: "no" },
  profile: { label: "MPV Profile", type: "text", default: "default" },
  quality: { label: "Video Quality", type: "select", options: ["default", "2160p", "1440p", "1080p", "720p", "480p", "360p"], default: "default" },
  v_codec: { label: "Video Codec", type: "select", options: ["default", "av01", "vp9", "h265", "h264"], default: "default" },
  console: { label: "Run With Console", type: "select", options: ["yes", "no"], default: "no" },
  enqueue: { label: "Enqueue Mode", type: "select", options: ["on", "off"], default: "on" },
};

// --- GM_CONFIG INITIALIZATION ---

GM_config.init({
  id: CONFIG_ID,
  title: GM_info.script.name,
  fields: CONFIG_FIELDS,
  events: {
    init: () => {
      let quality = GM_config.get("quality").toLowerCase();
      let v_codec = GM_config.get("v_codec").toLowerCase();
      let enqueue = GM_config.get("enqueue").toLowerCase();
      if (!CONFIG_FIELDS.quality.options.includes(quality)) GM_config.set("quality", "default");
      if (!CONFIG_FIELDS.v_codec.options.includes(v_codec)) GM_config.set("v_codec", "default");
      if (!CONFIG_FIELDS.enqueue.options.includes(enqueue)) GM_config.set("enqueue", "on");
    },
    save: () => {
      let profile = GM_config.get("profile").trim();
      GM_config.set("profile", profile === "" ? "default" : profile);
      updatePlayButton();
      GM_config.close();
    },
    reset: () => { GM_config.save(); },
  },
  css: CONFIG_CSS.trim(),
});

// --- CORE FUNCTIONS ---

function btoaUrl(url) {
  return btoa(url).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}

function generateProto(url) {
  const config = {
    cookies: GM_config.get("cookies").toLowerCase(),
    profile: GM_config.get("profile").trim(),
    quality: GM_config.get("quality").toLowerCase(),
    v_codec: GM_config.get("v_codec").toLowerCase(),
    console: GM_config.get("console").toLowerCase(),
    enqueue: GM_config.get("enqueue").toLowerCase(),
  };
  let proto = config.console === "yes" ? "mpv-debug://play/" : "mpv://play/";
  proto += btoaUrl(url);
  const options = [];
  if (config.cookies === "yes") options.push("cookies=" + document.location.hostname + ".txt");
  if (config.profile !== "default" && config.profile !== "") options.push("profile=" + config.profile);
  if (config.quality !== "default") options.push("quality=" + config.quality);
  if (config.v_codec !== "default") options.push("v_codec=" + config.v_codec);
  if (config.enqueue === "on") options.push("enqueue=true");
  else if (config.enqueue === "off") options.push("enqueue=false");
  if (options.length > 0) proto += "/?" + options.join("&");
  return proto;
}

function isWatchPage() {
  const siteConfig = SITES[location.hostname];
  if (siteConfig && siteConfig.watchPaths) {
    const { mode, list } = siteConfig.watchPaths;
    const path = location.pathname;
    for (const item of list) {
      if (path.startsWith(item) && (path.length === item.length || path.charAt(item.length) === "/")) {
        return mode;
      }
    }
    if (path !== "/") return !mode;
  }
  return false;
}

function updatePlayButton() {
    const button = document.querySelector(".pwm-play");
    if (!button) return;

    const shouldShow = isWatchPage() && !document.fullscreenElement;
    button.style.display = shouldShow ? "block" : "none";

    if (shouldShow) {
        // Usa location.href diretamente. É a fonte mais confiável durante
        // a navegação dinâmica do YouTube, garantindo que o link seja sempre o do vídeo atual.
        const videoUrl = location.href;

        // Gera o link somente se uma URL válida foi encontrada.
        if (videoUrl && videoUrl.includes("http")) {
            button.href = generateProto(videoUrl);
        }
    }
}

function createControls() {
  const style = document.createElement("style");
  style.textContent = MPV_CSS.trim();
  document.head.appendChild(style);
  const container = document.createElement("div");
  container.className = "play-with-mpv";
  const buttonPlay = document.createElement("a");
  buttonPlay.className = "pwm-play";
  buttonPlay.addEventListener("click", (e) => {
    const video = document.querySelector("video");
    if (video) video.pause();
    if (e.stopPropagation) e.stopPropagation();
  });
  const buttonSettings = document.createElement("button");
  buttonSettings.className = "pwm-settings";
  buttonSettings.addEventListener("click", () => {
    if (!GM_config.isOpen) {
      GM_config.open();
      GM_config.frame.style = CONFIG_IFRAME_CSS.trim();
    }
  });
  container.appendChild(buttonPlay);
  container.appendChild(buttonSettings);
  document.body.appendChild(container);
  document.addEventListener("fullscreenchange", updatePlayButton);
}

function processThumbnails() {
    const siteConfig = SITES[location.hostname];
    if (!siteConfig || !siteConfig.thumbSelector) return;
    const elements = document.querySelectorAll(siteConfig.thumbSelector);
    elements.forEach(el => {
        if (el.dataset.mpvReady) return;
        el.dataset.mpvReady = "true";
        el.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            let href = el.getAttribute('href');
            if (!href) return;
            let fullUrl = siteConfig.thumbNeedsFullUrl ? (new URL(href, location.origin)).href : href;
            location.href = generateProto(fullUrl);
        }, true);
    });
}

// --- CONTEXT MENU FUNCTIONS ---

function createContextMenu() {
    const style = document.createElement("style");
    style.textContent = CONTEXT_MENU_CSS.trim();
    document.head.appendChild(style);
    const menu = document.createElement("div");
    menu.id = "pwm-context-menu";
    const item = document.createElement("div");
    item.id = "pwm-context-menu-item";
    item.innerHTML = `<img src="data:image/svg+xml;base64,${ICON_MPV}" alt="MPV Icon"> <span>Play with MPV</span>`;
    menu.appendChild(item);
    document.body.appendChild(menu);
    item.addEventListener('click', () => {
        const url = menu.dataset.url;
        if (url) location.href = generateProto(url);
        hideContextMenu();
    });
}

function hideContextMenu() {
    const menu = document.getElementById('pwm-context-menu');
    if (menu) menu.style.display = 'none';
}

function showContextMenu(event) {
    // The line 'if (SITES[location.hostname]) { return; }' has been removed.
    if (!event.shiftKey) { return; }
    const linkElement = event.target.closest('a[href]');
    if (!linkElement || !linkElement.href) {
        hideContextMenu();
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const menu = document.getElementById('pwm-context-menu');
    menu.dataset.url = linkElement.href;
    const x = Math.min(event.clientX, window.innerWidth - menu.offsetWidth - 10);
    const y = Math.min(event.clientY, window.innerHeight - menu.offsetHeight - 10);
    menu.style.top = `${y}px`;
    menu.style.left = `${x}px`;
    menu.style.display = 'block';
}

// --- OBSERVERS AND INITIALIZATION ---

function notifyUpdate() {
  if (GM_getValue("mpvHandlerVersion") !== MPV_HANDLER_VERSION) {
    GM_notification({
      title: GM_info.script.name,
      text: `mpv-handler has been updated to ${MPV_HANDLER_VERSION}\n\nClick to see the news.`,
      onclick: () => window.open("https://github.com/akiirui/mpv-handler/releases/latest"),
    });
    GM_setValue("mpvHandlerVersion", MPV_HANDLER_VERSION);
  }
}

function startObservers() {
    if (!SITES[location.hostname]) return;

    // Esta função inicia uma sequência de tentativas para pausar o vídeo.
    const initiatePauseSequence = () => {
        let attempts = 0;
        const maxAttempts = 20; // Tenta 20 vezes (20 * 250ms = 5 segundos)

        const pauseInterval = setInterval(() => {
            // A cada tentativa, procura pelo elemento de vídeo.
            const video = document.querySelector('video.html5-main-video');

            // SE o vídeo existe E não está pausado...
            if (video && !video.paused) {
                video.pause(); // Pausa!
                clearInterval(pauseInterval); // E para de tentar. Missão cumprida.
                return;
            }

            // Incrementa o contador de tentativas e para se exceder o limite.
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(pauseInterval);
            }
        }, 250); // Intervalo entre as tentativas
    };

    let lastUrl = location.href;
    const observerCallback = () => {
        updatePlayButton();
        processThumbnails();

        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Ao detectar uma nova página, verifica se é uma página de vídeo.
            if (isWatchPage()) {
                // Se for, inicia a sequência de tentativas de pausa.
                initiatePauseSequence();
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });

    // Inicia a sequência de pausa também no carregamento inicial da página.
    if (isWatchPage()) {
        initiatePauseSequence();
    }
}

// --- EXECUTION ---

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy("default", { createHTML: (string) => string });
}

document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideContextMenu(); });

if (SITES[location.hostname]) {
    notifyUpdate();
    createControls();
    // Roda a função de atualização várias vezes nos primeiros segundos para garantir que pegue a URL correta.
    // Esta é a forma mais simples de garantir que funcione no carregamento direto.
    setTimeout(updatePlayButton, 100);
    setTimeout(updatePlayButton, 500);
    setTimeout(updatePlayButton, 1000);
    processThumbnails();
    startObservers();
}

createContextMenu();
