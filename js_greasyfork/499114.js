// ==UserScript==
// @name         MemTrace
// @namespace    Violentmonkey Scripts
// @version      0.6
// @description  trace browsing history and preserve tables (HTML passthrough)
// @author       fankaidev
// @match        *://*/*
// @exclude      *://cubox.pro/*
// @exclude      *://localhost:*/*
// @exclude      *://127.0.0.1:*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.1/turndown.min.js
// @require      https://unpkg.com/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.1.5/dist/purify.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499114/MemTrace.user.js
// @updateURL https://update.greasyfork.org/scripts/499114/MemTrace.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
  function md5(input) {
    return CryptoJS.MD5(input).toString();
  }
  let hrefHistory = [];
 
  // Function to get or initialize global state
  function getGlobalState(key, defaultValue) {
    return GM_getValue(key, defaultValue);
  }
 
  // Function to update global state
  function updateGlobalState(key, value) {
    GM_setValue(key, value);
  }
 
  // Function to get the endpoint
  function getEndpoint() {
    let endpoint = getGlobalState("endpoint", null);
    if (!endpoint) {
      endpoint = prompt("[MemTrace] Please enter the endpoint URL:", "https://api.example.com/endpoint");
      if (endpoint) {
        updateGlobalState("endpoint", endpoint);
      } else {
        console.error("[MemTrace] No endpoint provided. Script will not function correctly.");
      }
    }
    return endpoint;
  }
 
  // Function to change the endpoint
  function changeEndpoint() {
    let newEndpoint = prompt("[MemTrace] Enter new endpoint URL:", getGlobalState("endpoint", ""));
    if (newEndpoint) {
      updateGlobalState("endpoint", newEndpoint);
      console.log("[MemTrace] Endpoint updated to", newEndpoint);
    }
  }
 
  // Register menu command to change endpoint
  GM_registerMenuCommand("Change MemTrace Endpoint", changeEndpoint);
 
  function processPage() {
    const article = new Readability(document.cloneNode(true)).parse().content;
    // console.log("article", article);
 
    const turndownService = new TurndownService({
      keepReplacement: function (content, node) {
        return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
      },
    });
 
    // Add a rule to keep tables
    turndownService.addRule("tables", {
      filter: ["table"],
      replacement: function (content, node) {
        return node.outerHTML;
      },
    });
 
    // Uncomment the following line if you want to use the GFM table plugin instead
    // turndownService.use(turndownPluginGfm.tables);
 
    return turndownService.turndown(article);
  }
 
  function savePage(markdown) {
    const url = window.location.href.split("#")[0];
    let data = {
      title: document.title,
      source: "chrome",
      id: md5(url),
      markdown: markdown,
      url: url,
    };
    console.log("[MemTrace] saving page", data);
    GM_xmlhttpRequest({
      method: "POST",
      url: getEndpoint(),
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        if (response.status === 200) {
          console.log("[MemTrace] saved page");
        } else {
          console.error("Failed to save to MemTrace", response.responseText);
        }
      },
      onerror: function (error) {
        console.error("Request failed:", error);
      },
    });
  }
 
  function parseRedditReply(reply, depth) {
    let replyText = "";
    replyText += "\n---\n";
    const ts = new Date(reply.data.created * 1000).toISOString();
    replyText += ">".repeat(depth) + ` **${reply.data.author}** - ${ts}\n`;
    replyText += ">".repeat(depth) + "\n";
    const lines = reply.data.body.split("\n");
    for (const line of lines) {
      replyText += ">".repeat(depth) + " " + line + "\n";
    }
 
    if (!reply.data.replies) {
      return replyText;
    }
    for (const child of reply.data.replies.data.children) {
      replyText += parseRedditReply(child, depth + 1);
    }
    return replyText;
  }
 
  function processRedditPage() {
    console.log("[MemTrace] processing reddit page");
    fetch(window.location.href + ".json")
      .then((response) => response.json())
      .then((responseJson) => {
        const page = responseJson;
        const post = page[0].data.children[0].data;
 
        const ts = new Date(post.created * 1000).toISOString();
        let markdown = `*${post.subreddit_name_prefixed}*\n\n`;
        markdown += `**${post.author}** - ${ts}\n\n`;
        markdown += `${post.selftext}\n\n`;
        for (const reply of page[1].data.children) {
          markdown += parseRedditReply(reply, 1);
        }
        savePage(markdown);
      });
  }
 
  function process() {
    const url = window.location.href.split("#")[0];
    if (hrefHistory.includes(url)) {
      console.log("[MemTrace] skip processed url", url);
      return;
    }
    console.log("[MemTrace] processing url", url);
    hrefHistory.push(url);
 
    if (/reddit.com\/r\/[^/]+\/comments/.test(url)) {
      processRedditPage();
    } else {
      const markdown = processPage();
      if (markdown.length < 100) {
        console.log("[MemTrace] fail to parse page");
        return;
      }
      savePage(markdown);
    }
  }
  function scheduleProcess() {
    if (document.contentType != "text/html") {
      return;
    }
    if (window.self === window.top) {
      console.log(`[MemTrace] type=${document.contentType} href=${window.location.href}`);
      setTimeout(() => {
        process();
      }, 5000);
    }
  }
  // Intercept pushState and replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    scheduleProcess();
  };
 
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    scheduleProcess();
  };
  window.addEventListener("load", function () {
    scheduleProcess();
  });
  window.addEventListener("popstate", function (event) {
    scheduleProcess();
  });
})();