// ==UserScript==
// @name        8chan.moe reverse imeji search
// @namespace   wappispace
// @match       https://8chan.moe/*/res/*.html
// @match       https://8chan.st/*/res/*.html
// @match       https://8chan.se/*/res/*.html
// @match       https://8chan.cc/*/res/*.html
// @match       https://8chan.moe/*/last/*.html
// @match       https://8chan.st/*/last/*.html
// @match       https://8chan.se/*/last/*.html
// @match       https://8chan.cc/*/last/*.html
// @match       https://node1.8chan.moe/*/res/*.html
// @match       https://node2.8chan.moe/*/res/*.html
// @match       https://node3.8chan.moe/*/res/*.html
// @match       https://node4.8chan.moe/*/res/*.html
// @match       https://node1.8chan.moe/*/last/*.html
// @match       https://node2.8chan.moe/*/last/*.html
// @match       https://node3.8chan.moe/*/last/*.html
// @match       https://node4.8chan.moe/*/last/*.html
// @match       https://ascii2d.net/
// @match       https://trace.moe/
// @grant       GM.xmlHttpRequest
// @grant       GM.getValues
// @grant       GM.setValues
// @grant       GM_addValueChangeListener
// @grant       GM.registerMenuCommand
// @version     2.2.11
// @author      anonator
// @description Adds reverse search links above images on 8chan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533047/8chanmoe%20reverse%20imeji%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/533047/8chanmoe%20reverse%20imeji%20search.meta.js
// ==/UserScript==

// You can access settings by clicking your userscript extension's icon in the
// browser toolbar while on 8chan, there you should see a settings button under
// the userscript.
//
// If the script is broken please give me feedback on greasyfork with what is
// wrong and all the userscripts you are running and which browser and userscript
// extension you are using, I am unable to reproduce the few reported cases

// Recent changes
// 2.2.11:
//  - Fix site-update breakage
// 2.2.8:
//  - Fix pixiv regex for downscaled "master" files and add some extensions
// 2.2.7:
//  - Apparently thumbnail threshold is 220x220 but it seems inconsistent
// 2.2.6:
//  - Add flag to all uploads to prevent adding links multiple times
// 2.2.5:
//  - Fix resolution check, split on both x and ×
// 2.2.4:
//  - Fix links being added twice when using Fullchan X
// 2.2.3:
//  - Use full image instead of thumbnail for images smaller than 200x200px
//    (8chan doesn't generate thumbnails for images that small)
// 2.2.2:
//  - Add links to existing posts only when they scroll into view
// 2.2.1:
//  - Add pixiv links regardless of filetype support
// 2.2.0:
//  - Added trace.moe, enable in settings
//  - Don't add links for unsupported filetypes

(async () => {
  const DEFAULT_CFG = {
    pixiv: true,
    iqdb: true,
    saucenao: false,
    ascii2d: true,
    tracemoe: false,
    google: true,
    useThumbnails: false,
  };

  /** @type {DEFAULT_CFG} */
  const cfg = await GM.getValues(DEFAULT_CFG);

  // pretend to care about backwards compatibility
  if (typeof GM_addValueChangeListener === "function") {
    for (const key in cfg) {
      GM_addValueChangeListener(key, (name, _oldValue, newValue, remote) => {
        if (remote) {
          cfg[name] = newValue ?? false;
        }
      });
    }
  }

  // receive imeji using message across tabs
  if (
    window.opener &&
    ((cfg.ascii2d && window.location.origin === "https://ascii2d.net") ||
      (cfg.tracemoe && window.location.origin === "https://trace.moe"))
  ) {
    const parent = window.location.hash.substring(1);
    if (!parent.includes("8chan")) return;

    window.addEventListener("message", async (e) => {
      if (e.origin !== parent) return;

      console.log("Received imeji from 8chan, submitting form...");

      if (window.location.origin === "https://ascii2d.net") {
        const input = document.getElementById("file-form");
        sendFileToInput(e.data, input);
        const submit = document.querySelector(
          "form#file_upload button[type=submit]",
        );
        submit.focus();
        submit.click();

        for (const btn of document.querySelectorAll(
          "form button[type=submit]",
        )) {
          btn.setAttribute("disabled", "disabled");
        }
      }

      if (window.location.origin === "https://trace.moe") {
        const interval = setInterval(() => {
          const droptarget = document.querySelector('div[class*="dropTarget"]');
          if (droptarget) {
            clearInterval(interval);
            dropFile(e.data, droptarget);
          }
        }, 100);
      }

      console.log("Sending 'done' to 8chan...");
      window.opener.postMessage("done", parent);
    });

    console.log("Initialized, sending 'ready' to 8chan...");
    window.opener.postMessage("ready", parent);
    return;
  }

  function dropFile(file, target) {
    const dt = new DataTransfer();
    dt.items.add(file);
    const event = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
    });
    target.dispatchEvent(event);
  }

  function sendFileToInput(file, input) {
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);
  }

  async function addImejiFile(url, input) {
    const imeji = await getImeji(url);
    sendFileToInput(imeji, input);
  }

  const mimeToExt = {
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/bmp": ".bmp",
  };

  async function getImeji(url, backup = null) {
    let response = await fetch(url);
    if (!response.ok && backup) {
      response = await fetch(backup);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const data = await response.blob();
    const metadata = {};
    let name = url.split("/").filter(Boolean).pop();
    if (response.headers.has("content-type")) {
      metadata.type = response.headers.get("content-type");
      if (!name.endsWith(mimeToExt[metadata.type])) {
        name = `${name}.${mimeToExt[metadata.type]}`;
      }
    }
    return new File([data], name, metadata);
  }

  async function iqdbSubmit(url) {
    // using a form to bypass anti-hotlinking
    const form = document.createElement("form");
    form.target = "_blank";
    form.enctype = "multipart/form-data";
    form.action = "https://iqdb.org/";
    form.method = "post";
    form.style = "display: none";

    for (const n of [1, 2, 3, 4, 5, 6, 11, 13]) {
      const s = document.createElement("input");
      s.type = "checkbox";
      s.name = "service[]";
      s.value = n;
      s.checked = true;
      form.appendChild(s);
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "file";
    form.appendChild(fileInput);

    const ig = document.createElement("input");
    ig.type = "checkbox";
    ig.name = "forcegray";
    ig.checked = false;
    form.appendChild(ig);

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "submit";
    form.appendChild(submit);

    document.body.appendChild(form);

    await addImejiFile(url, fileInput);
    submit.click();

    setTimeout(() => form.remove(), 60000);
  }

  async function saucenaoSubmit(url) {
    const form = document.createElement("form");
    form.target = "_blank";
    form.enctype = "multipart/form-data";
    form.action = "https://saucenao.com/search.php";
    form.method = "post";
    form.style = "display: none";
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "file";
    form.appendChild(fileInput);
    document.body.appendChild(form);

    await addImejiFile(url, fileInput);
    form.submit();
    setTimeout(() => form.remove(), 60000);
  }

  function urlToThumb(url) {
    return `${location.origin}/.media/t_${url.split("/")[4].split(".")[0]}`;
  }

  const msgData = {
    ascii2d: {
      imeji: null,
      win: null,
    },
    tracemoe: {
      imeji: null,
      win: null,
    },
  };

  window.addEventListener("message", (e) => {
    let key = "";
    if (e.origin === "https://ascii2d.net") {
      key = "ascii2d";
    } else if (e.origin === "https://trace.moe") {
      key = "tracemoe";
    } else {
      return;
    }

    switch (e.data) {
      case "ready":
        console.log(`${key} ready, sending image...`);
        msgData[key].win.postMessage(msgData[key].imeji, e.origin);
        msgData[key] = { imeji: null, win: null };
        break;
      case "done":
        console.log(`${key} done`);
        break;
    }
  });

  function getImejiFileSize(link) {
    const sizeLabel = link.parentElement.querySelector("span.sizeLabel");
    const split = sizeLabel.textContent.split(" ");
    let unit = 0;
    switch (split[1]) {
      case "KB":
        unit = 1024;
        break;
      case "MB":
        unit = 1024 * 1024;
        break;
    }
    return Number.parseFloat(split[0]) * unit;
  }

  function imageBelowThumbGenThreshold(link) {
    const img = link.parentElement.parentElement.querySelector("a.imgLink");
    const dimensions = link.parentElement
      .querySelector("span.dimensionLabel")
      .textContent.split(/[x×]/i)
      .map((i) => Number.parseInt(i));
    return (
      img.dataset.filemime.startsWith("image/") &&
      dimensions[0] <= 220 &&
      dimensions[1] <= 220
    );
  }

  async function googleListener(e) {
    e.preventDefault();
    t = e.currentTarget;
    t.style.pointerEvents = "none";
    t.textContent = "[google...]";
    try {
      let url = t.parentElement.querySelector("a.originalNameLink").href;
      if (
        !imageBelowThumbGenThreshold(t) &&
        (cfg.useThumbnails ||
          getImejiFileSize(t) > 20971520 || // 20 MiB limit
          url.endsWith(".mp4") ||
          url.endsWith(".webm"))
      ) {
        url = urlToThumb(url);
      }
      url = await catbox(url);
      window.open(
        `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}&safe=off`,
      );
    } catch (e) {
      console.error(e);
    }
    t.style.pointerEvents = "";
    t.textContent = "[google]";
  }

  const RE_UNSUPPORTED =
    /.(weba|m4a|mp3|og[ag]|opus|flac|wav|te?xt|m3u|pdf|sw[fl]|epub|json|gpg|svgz?)$/i;
  const RE_VIDEO = /.(webm|m4v|mp4|og[mv]|avi|asx|mpe?g)$/i;

  function isUnsupported(url) {
    return RE_UNSUPPORTED.test(url);
  }

  function isVideo(url) {
    return RE_VIDEO.test(url);
  }

  function hDisableAndGetUrl(t, name) {
    t.style.pointerEvents = "none";
    t.textContent = `[${name}...]`;
    return t.parentElement.querySelector("a.originalNameLink").href;
  }

  function hEnable(t, name) {
    t.style.pointerEvents = "";
    t.textContent = `[${name}]`;
  }

  async function tracemoeListener(e) {
    e.preventDefault();
    if (msgData.tracemoe.win !== null) return;
    t = e.currentTarget;
    let url = hDisableAndGetUrl(t, "trace");
    try {
      // 25 MiB limit
      if (
        !imageBelowThumbGenThreshold(t) &&
        (cfg.useThumbnails || getImejiFileSize(t) > 26214400 || isVideo(url))
      ) {
        url = urlToThumb(url);
      }
      console.log("opening trace.moe tab...");
      msgData.tracemoe = {
        imeji: await getImeji(url),
        win: window.open(`https://trace.moe/#${window.location.origin}`),
      };
    } catch (e) {
      console.error(e);
    }
    hEnable(t, "trace");
  }

  async function ascii2dListener(e) {
    e.preventDefault();
    if (msgData.ascii2d.win !== null) return;
    t = e.currentTarget;
    let url = hDisableAndGetUrl(t, "ascii2d");
    try {
      // 10 MiB limit
      if (
        !imageBelowThumbGenThreshold(t) &&
        (cfg.useThumbnails || getImejiFileSize(t) > 10485760 || isVideo(url))
      ) {
        url = urlToThumb(url);
      }
      console.log("opening ascii2d tab...");
      msgData.ascii2d = {
        imeji: await getImeji(url),
        win: window.open(`https://ascii2d.net/#${window.location.origin}`),
      };
    } catch (e) {
      console.error(e);
    }
    hEnable(t, "ascii2d");
  }

  async function iqdbListener(e) {
    e.preventDefault();
    t = e.currentTarget;
    let url = hDisableAndGetUrl(t, "iqdb");
    try {
      // 8 MiB limit
      if (
        !imageBelowThumbGenThreshold(t) &&
        (cfg.useThumbnails ||
          getImejiFileSize(t) > 8388608 ||
          isVideo(url) ||
          url.endsWith(".webp"))
      ) {
        url = urlToThumb(url);
      }
      await iqdbSubmit(url);
    } catch (e) {
      console.error(e);
    }
    hEnable(t, "iqdb");
  }

  async function saucenaoListener(e) {
    e.preventDefault();
    t = e.currentTarget;
    let url = hDisableAndGetUrl(t, "sauce");
    try {
      // 15 MiB limit
      if (
        !imageBelowThumbGenThreshold(t) &&
        (cfg.useThumbnails ||
          getImejiFileSize(t) > 15728640 ||
          isVideo(url) ||
          url.endsWith(".bmp"))
      ) {
        url = urlToThumb(url);
      }
      await saucenaoSubmit(url);
    } catch (e) {
      console.error(e);
    }
    hEnable(t, "sauce");
  }

  const reLinkStyle =
    "margin-right: 0.5ch; margin-bottom: 0.75ch; display: inline-block;";

  function addReverseLink(link, name, listener) {
    const a = document.createElement("a");
    a.textContent = `[${name}]`;
    a.style = reLinkStyle;
    a.addEventListener("click", listener);
    link.parentElement.parentElement.insertAdjacentElement("afterend", a);
  }

  const rePixiv = /(\d+)_p\d+(_master\d+)?\.(jpg|png|webp|gif|webm)/;

  async function addReverseLinks(link) {
    if (!isUnsupported(link.href)) {
      if (cfg.google) {
        addReverseLink(link, "google", googleListener);
      }

      if (cfg.tracemoe) {
        addReverseLink(link, "trace", tracemoeListener);
      }

      if (cfg.ascii2d) {
        addReverseLink(link, "ascii2d", ascii2dListener);
      }

      if (cfg.saucenao) {
        addReverseLink(link, "sauce", saucenaoListener);
      }

      if (cfg.iqdb) {
        addReverseLink(link, "iqdb", iqdbListener);
      }
    }

    // filetype support doesn't matter for pixiv, just goes by filename
    if (cfg.pixiv) {
      const match = link.download.match(rePixiv);
      if (match) {
        const pixiv = document.createElement("a");
        pixiv.style = reLinkStyle;
        pixiv.target = "_blank";
        pixiv.textContent = "[pixiv]";
        pixiv.href = `https://www.pixiv.net/artworks/${match[1]}`;
        link.parentElement.parentElement.insertAdjacentElement(
          "afterend",
          pixiv,
        );
      }
    }
  }

  function handleObservedPost(post) {
    if (post.dataset.risAdded) return;
    post.dataset.risAdded = "true";

    for (const uploadCell of post.querySelectorAll("figure.uploadCell")) {
      if (uploadCell.dataset.risAdded) return;
      uploadCell.dataset.risAdded = true;

      addReverseLinks(
        uploadCell.querySelector("a.originalNameLink:not(.file-ext)"),
      );
    }
  }

  const thread = document.getElementById("divThreads");
  const obs = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (
          node.tagName === "DIV" &&
          (node.classList.contains("postCell") ||
            node.classList.contains("inlineQuote"))
        ) {
          handleObservedPost(node);
        }
      }
    }
  });
  obs.observe(thread, { childList: true, subtree: true });

  // instead of adding all links at once, wait for existing posts to scroll
  // into view, hopefully lessens freezing on my garbage laptop
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const post = entry.target;
        observer.unobserve(post);
        handleObservedPost(post);
      }
    }
  });
  observer.observe(thread.querySelector("div.innerOP"));
  for (const post of thread.querySelectorAll("div.postCell")) {
    observer.observe(post);
  }

  const CATBOX_CACHE = {};
  const RE_CATBOX_URL =
    /^https?:\/\/(files|litter)\.catbox\.moe\/([a-z0-9]+\.\w+)$/i;

  async function catbox(url) {
    if (url in CATBOX_CACHE && CATBOX_CACHE[url].ttl > Date.now())
      return CATBOX_CACHE[url].url;
    const file = await getImeji(url);
    const data = new FormData();
    data.set("reqtype", "fileupload");
    data.set("time", "1h");
    data.set("fileToUpload", file);
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        url: "https://litterbox.catbox.moe/resources/internals/api.php",
        timeout: 60000,
        data,
        onload: (resp) => {
          const match = resp.responseText.match(RE_CATBOX_URL);
          if (resp.status === 200 && match) {
            CATBOX_CACHE[url] = {
              url: resp.responseText,
              ttl: Date.now() + 3600000,
            };
            console.log(`${url} uploaded to litterbox: ${resp.responseText}`);
            resolve(resp.responseText);
          } else {
            console.error(resp.status, resp.responseText);
            reject("Response is not a catbox url");
          }
        },
        onerror: (error) => {
          console.error(resp.status, resp.responseText);
          reject(error);
        },
      });
    });
  }

  GM.registerMenuCommand("Settings", () => {
    if (document.getElementById("revImejiSettings")) return;

    // ChatGPT styling, hope you like
    const menu = document.createElement("dialog");
    menu.id = "revImejiSettings";
    menu.style =
      "background-color: #1e1e1e; color: #fff; border: none; border-radius: 8px; padding: 0; width: 360px;";
    menu.insertAdjacentHTML(
      "afterbegin",
      `
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background-color: #2a2a2a;">
    <span style="font-weight: bold;">Reverse Imeji Settings</span>
    <button id="revImejiSettingsClose" style="background: none; border: none; color: #fff; font-size: 18px; cursor: pointer;">&times;</button>
  </div>

  <!-- Divider -->
  <div style="height: 1px; background-color: #444;"></div>

  <!-- Content -->
  <form id="revImejiSettingsForm" style="padding: 8px 16px; display: flex; flex-direction: column; gap: 10px;">

    <label style="cursor: pointer;"><input type="checkbox" name="pixiv"> Pixiv</label>
    <label style="cursor: pointer;"><input type="checkbox" name="iqdb"> IQDB</label>
    <label style="cursor: pointer;"><input type="checkbox" name="saucenao"> SauceNao</label>
    <label style="cursor: pointer;"><input type="checkbox" name="ascii2d"> Ascii2d</label>
    <label style="cursor: pointer;"><input type="checkbox" name="tracemoe"> Trace.moe</label>
    <label style="cursor: pointer;"><input type="checkbox" name="google"> Google Lens</label>

    <hr />

    <label style="cursor: pointer;"><input type="checkbox" name="useThumbnails"> Always use thumbnails (saves bandwidth)</label>

    <!-- Buttons -->
    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
      <button id="revImejiSettingsDefault" type="button" style="background-color: #333; color: #fff; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Default</button>
      <button type="submit" style="background-color: #4caf50; color: #fff; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Save</button>
    </div>

  </form>
`,
    );
    menu
      .querySelector("#revImejiSettingsClose")
      .addEventListener("click", () => {
        menu.close();
      });

    function setCheckboxes(config) {
      for (const cb of menu.querySelectorAll("input[type=checkbox]")) {
        cb.checked = config[cb.name];
      }
    }

    setCheckboxes(cfg);

    menu
      .querySelector("#revImejiSettingsDefault")
      .addEventListener("click", () => {
        setCheckboxes(DEFAULT_CFG);
      });

    menu
      .querySelector("#revImejiSettingsForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();

        for (const cb of menu.querySelectorAll("input[type=checkbox]")) {
          cfg[cb.name] = cb.checked;
        }
        GM.setValues(cfg);

        menu.close();
      });

    menu.addEventListener("close", () => {
      menu.remove();
    });

    document.body.appendChild(menu);
    menu.showModal();
  });
})();
