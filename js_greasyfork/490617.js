// ==UserScript==
// @name         [Working] linkvertise and krnl bypasser
// @namespace    http://tampermonkey.net/
// @homepageURL  https://bypass.city
// @description  just waits 15 seconds for krnl and works fine with the other stuff 2 (it waits no time for other stuff) :)
// @author       Discord: varram#6209
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @match        *://bypass.city/*
// @match        http://localhost:3000/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://linkvertise.com
// @exclude      *://linkvertise.com/search*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      https://linkvertise.com/assets/vendor/thinksuggest.html
// @exclude      https://linkvertise.com/assets/vendor/*
// @exclude      https://publisher.linkvertise.com/*
// @exclude      *://link-mutation.linkvertise.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.deleteValue
// @version      11.0.6
// @author       varram
// @connect      bypass.city
// @icon         https://bypass.city/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/490617/%5BWorking%5D%20linkvertise%20and%20krnl%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490617/%5BWorking%5D%20linkvertise%20and%20krnl%20bypasser.meta.js
// ==/UserScript==


/* 
release: 11.0.6 (5c96a51), 11/9/2023, 7:39:06 PM
Discord: https://discord.gg/tX8G9G5BMV
additional copyright/license info:
© All Rights Reserved

Linkvertise Bypass © 2023 by varram#6209, suspect & bypass.city team
*/

(() => {
  // src/bypass-city.ts
  var bypassCityListener = async () => {
    if (window.location.hostname !== "bypass.city" && window.location.hostname !== "localhost") {
      return;
    }
    injectScriptInfo();
    window.addEventListener("bypassComplete", async (event) => {
      const data = event.detail;
      console.log("bypassMessage", data);
      GM_setValue("bypass.data", data);
      window.open(data.url, "_self", "noopener,noreferrer");
    });
  };
  var injectScriptInfo = () => {
    const injectJs = `
    window.scriptInfo = {
        version: "${"11.0.6"}",
        buildTime: "${"11/9/2023, 7:39:06 PM"}",
        branch: "${"release"}",
        release: "${"5c96a51"}",
        installed: true,
    }`;
    const script = document.createElement("script");
    script.textContent = injectJs;
    document.body.appendChild(script);
  };

  // src/notify.scss
  var notify_default = `.notification {
  position: fixed;
  top: 10px;
  right: 10px;
  margin: 10px;
  padding: 10px;
  padding-right: 20px;
  background-color: #25262b;
  color: white;
  transition: opacity 0.6s; /* 600ms to fade out */
  z-index: 4000000;
  border-radius: 10px; /* Rounded border */
  border: 2px solid #3b5bdb;
  animation: glow 1s ease-in-out infinite alternate;
}

.notification .grid-container {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
}

.notification .links {
  display: flex;
  justify-content: right;
  align-items: center;
}

.notification .links span {
  padding-bottom: 4px;
  opacity: 0.7;
}

.notification .links a, .notification .links span {
  display: block;
  color: white;
  font-size: 0.8rem;
  padding: 5px;
  margin-bottom: 5px;
}

.grid-item img {
  margin-top: 15px;
  margin-right: 5px;
  width: 32px;
}

.grid-item h3 {
  padding-top: 10px;
  padding-bottom: 3px;
  font-size: 1.5rem;
  color: white;
}

.grid-item p {
  font-style: italic;
  font-size: 1rem;
  color: white;
}
.grid-item p a {
  opacity: 1;
  font-weight: 600;
  text-decoration: underline !important;
  margin-bottom: 8px;
  display: inline-block;
}

.grid-item h3, .grid-item p {
  margin: 0;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px #3b5bdb;
  }
  to {
    box-shadow: 0 0 20px #3b5bdb;
  }
}`;

  // src/notify-element.html
  var notify_element_default = '<div id="bypass-notification" class="notification">\n    <div class="grid-container">\n      <div class="grid-item">\n        <img height="32" src="https://bypass.city/images/android-chrome-192x192.png" alt="Notification">\n      </div>\n      <div class="grid-item">\n        <h3 id="title"></h3>\n        <p>\n            <span id="text"></span>\n            <a id="help" href="https://discord.gg/tX8G9G5BMV">Get Support on our Discord</a>\n        </p>\n      </div>\n    </div>\n   \n      <div id="links" class="links">\n        <span id="version">Release</span>\n        <span>&#8226;</span>\n        <a  href="https://discord.gg/tX8G9G5BMV">Get Support</a>\n        <span>&#8226;</span>\n        <a href="https://bypass.city/privacy">Privacy Policy</a>\n      \n      </div>\n  </div>\n  ';

  // src/notify.ts
  var BypassElement = class extends HTMLElement {
    static get observedAttributes() {
      return ["text", "title", "is-help"];
    }
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = notify_default;
      const div = document.createElement("div");
      div.innerHTML = notify_element_default;
      shadow.appendChild(style);
      shadow.appendChild(div);
      shadow.getElementById("version").innerText = "11.0.6 (5c96a51)";
    }
    connectedCallback() {
      this.updateContent();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this.updateContent();
    }
    updateContent() {
      const text = this.getAttribute("text") || "";
      const title = this.getAttribute("title") || "";
      const isHelp = this.hasAttribute("is-help");
      if (isHelp) {
        this.shadowRoot.getElementById("links").remove();
      }
      this.shadowRoot.getElementById("help").style.display = isHelp ? "block" : "none";
      this.shadowRoot.querySelector("#title").textContent = title;
      this.shadowRoot.querySelector("#text").textContent = text;
    }
  };
  customElements.define("bypass-notification", BypassElement);
  var notify = ({ text, title, isHelp }) => {
    const titleContent = title || "Bypass in progress...";
    const textContent = text || "Please wait while we redirect you";
    const notificationElement = document.createElement("bypass-notification");
    notificationElement.setAttribute("title", titleContent);
    notificationElement.setAttribute("text", textContent);
    if (isHelp) {
      notificationElement.setAttribute("is-help", "true");
    }
    document.body.appendChild(notificationElement);
  };

  // src/fetch.ts
  var jsonFetch = async (url, options) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method,
        data: options.data ? JSON.stringify(options.data) : void 0,
        headers: options.headers,
        url,
        onload: (response) => {
          if (response.responseText && typeof response.responseText === "string") {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject();
            }
          } else {
            reject();
          }
        },
        onerror: reject,
        ontimeout: reject,
        onabort: reject,
        timeout: 5e3
      });
    });
  };

  // src/ping.ts
  var ping = async () => {
    try {
      const data = await jsonFetch(`${"https://bypass.city"}/.well-known/ping.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      return data.ping;
    } catch (e) {
      notify({
        title: "Server unreachable",
        isHelp: true
      });
      return false;
    }
  };

  // src/utils.ts
  var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // src/linkvertise.ts
  var linkvertiseListener = async () => {
    if (!matchLinkvertise(window.location.href)) {
      return;
    }
    const bypassData = GM_getValue("bypass.data");
    if (bypassData) {
      if (window.location.href.includes("linkvertise.com/48193/")) {
        notify({
          title: "KRNL DETECTED!",
          text: "Bypassing krnl please wait 15 seconds\n  to avoid getting blacklisted!"
        });
        await sleep(15e3);
      } else {
        notify({});
        await sleep(2e3);
      }
      const targetUrl = bypassData.bypassData;
      GM_deleteValue("bypass.data");
      window.open(targetUrl, "_self");
    } else {
      const testConnectivity = await ping();
      if (testConnectivity) {
        notify({});
        await sleep(2e3);
        const bypassCityUrl = new URL(`${"https://bypass.city"}/bypass`);
        bypassCityUrl.searchParams.set("bypass", encodeURIComponent(window.location.href));
        bypassCityUrl.searchParams.set("userscript", "true");
        bypassCityUrl.searchParams.set("userscript-version", "11.0.6");
        window.open(bypassCityUrl.href, "_self");
      }
    }
  };
  var matchLinkvertise = (url) => {
    const regex = /https?:\/\/(linkvertise\.(com|download)|(link-(center|target|hub|to)|direct-link|file-link)\.net)/i;
    return regex.test(url) && !url.startsWith("https://linkvertise.com/profile") && !url.startsWith("https://linkvertise.com/login");
  };

  // src/main.ts
  (async () => {
    console.info("Linkvertise Userscript", "11.0.6 (5c96a51)", window.location.href);
    await bypassCityListener();
    await linkvertiseListener();
  })();
})();