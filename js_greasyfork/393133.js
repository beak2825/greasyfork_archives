// ==UserScript==
// @name NGA Auto Refresh
// @version 0.2.0
// @description Refresh NGA post automatically.
// @license MIT
// @author eight04 <eight04@gmail.com> (https://github.com/eight04)
// @homepageURL https://github.com/eight04/nga-auto-refresh
// @supportURL https://github.com/eight04/nga-auto-refresh/issues
// @namespace https://github.com/eight04
// @match *://bbs.nga.cn/read.php?*
// @match *://bbs.nga.cn/thread.php?*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/393133/NGA%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/393133/NGA%20Auto%20Refresh.meta.js
// ==/UserScript==

/* eslint-env browser */
(async () => {
  // https://github.com/Tampermonkey/tampermonkey/issues/705
  const setTimeout = window.setTimeout.bind(window);
  const fetch = window.fetch.bind(window);
  const updater = createUpdater({
    interval: 60 * 1000
  });
  updater.start();
  new MutationObserver(updater.maybeRestart).observe(document.querySelector("#mc"), {childList: true});
  
  function createUpdater({interval}) {
    let status = "COMPLETE";
    let lastUpdate = Date.now();
    let checkTimer;
    let abortController;
    
    const el = document.createElement("div");
    el.className = "nga-auto-refresh-status";
    el.style.margin = "10px";
    el.style.textAlign = "center";
    
    // FIXME: only activate updateCounter if status === "WAITING"
    setInterval(updateCounter, 1000);
    
    return {start, maybeRestart};
    
    function insertEl() {
      const posts = document.querySelector("#m_posts");
      if (!posts) return false;
      posts.parentNode.insertBefore(el, posts.nextSibling);
      return true;
    }
    
    function start() {
      if (insertEl()) {
        check(false);
      }
    }
    
    function maybeRestart() {
      if (document.body.contains(el)) {
        return;
      }
      clearTimeout(checkTimer);
      if (abortController) {
        abortController.abort();
      }
      start();
    }
    
    async function check(refresh = true) {
      status = "CHECKING";
      if (document.querySelector("[title=加载下一页]")) {
        status = "COMPLETE";
        return;
      }
      if (refresh) {
        abortController = new AbortController();
        const {signal} = abortController;
        try {
          await fetchAndRefresh(signal);
        } catch (err) {
          console.warn(err);
          if (signal.aborted) {
            return;
          }
        }
      }
      lastUpdate = Date.now();
      status = "WAITING";
      checkTimer = setTimeout(check, interval);
    }
    
    function updateCounter() {
      if (status === "COMPLETE") {
        el.textContent = "current page completed";
      } else if (status === "WAITING") {
        el.textContent = Math.round((interval - (Date.now() - lastUpdate)) / 1000);
      } else if (status === "CHECKING") {
        el.textContent = "loading";
      }
    }
  }
  
  async function fetchAndRefresh(signal) {
    const r = await fetch(location.href, {signal});
    if (!r.ok) {
      throw new Error("connection error");
    }
    const buffer = await r.arrayBuffer();
    const parser = new DOMParser;
    const root = parser.parseFromString(await decodeGBK(buffer, signal), "text/html");
    const loadedIds = getLoadedIds();

    const nodes = root.querySelector("#m_posts_c").children;
    const posts = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const id = nodes[i].firstElementChild.firstElementChild.id;
      if (loadedIds.has(id)) {
        continue;
      }
      posts.push({
        table: nodes[i],
        js: createScript(nodes[i + 1])
      });
    }
    
    if (posts.length) {
      // update userinfo
      for (const script of root.querySelectorAll("script")) {
        if (script.textContent.includes("userinfostart")) {
          document.head.appendChild(createScript(script));
          break;
        }
      }
      
      // update post
      const container = document.querySelector("#m_posts_c");
      for (const post of posts) {
        container.append(post.table, post.js);
      }

    }
    // update pagination
    const buttonBar = document.querySelector("#pagebbtm");
    const newButtonBar = root.querySelector("#pagebbtm");
    buttonBar.parentNode.replaceChild(newButtonBar, buttonBar);
    refreshScripts(newButtonBar);
  }

  function getLoadedIds() {
    const s = new Set;
    const rows = document.querySelectorAll(".postrow");
    for (const row of rows) {
      s.add(row.id);
    }
    return s;
  }

  function decodeGBK(buffer, signal) {
    const decoder = new TextDecoder("gbk");
    return Promise.race([
      decoder.decode(buffer),
      waitAbort(signal)
    ]);
  }
  
  function waitAbort(signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        doReject();
        return;
      }
      signal.addEventListener("abort", doReject, {once: true});
      
      function doReject() {
        reject(new Error("aborted"));
      }
    });
  }
  
  function createScript(script) {
    const newScript = document.createElement("script");
    newScript.textContent = script.textContent;
    return newScript;
  }
  
  function refreshScripts(el) {
    const scripts = el.querySelectorAll("script");
    for (const script of scripts) {
      const newScript = createScript(script);
      script.parentNode.replaceChild(newScript, script);
    }
  }
})();
