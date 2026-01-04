// ==UserScript==
// @name        Save Page
// @name:en     Save Page
// @name:zh-CN  保存页面
// @description Save page as single HTML file.
// @description:en Save page as single HTML file.
// @description:zh-CN 将页面保存为单个 HTML 文件。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.7
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @grant       GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/430398/Save%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/430398/Save%20Page.meta.js
// ==/UserScript==
"use strict";

const { addFloatButton, fetchex } = {
  addFloatButton(text, onclick) /* 20220509-1936 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:0 1em;margin:4px;font-size:14px;line-height:2em;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{filter:brightness(1.1);transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>&zwj;</label>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
  fetchex(url, type) /* 20220509-1838 */ {
    // @grant       GM_xmlhttpRequest
    if (self.GM_xmlhttpRequest)
      return new Promise((resolve, onerror) => {
        const onload = (e) => resolve(e.response);
        GM_xmlhttpRequest({ url, responseType: type, onload, onerror });
      });
    else return fetch(url).then((v) => v[type]());
  },
};

// TODO: Content Security Policy. Example: https://github.com/kkocdko/kblog

addFloatButton("Remove images", async function () {
  const placeholder = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>`;
  document.querySelectorAll("img").forEach((el) => {
    el.src = placeholder;
  });
  this.textContent = "Images removed";
  this.style.background = "#4caf50";
});

addFloatButton("Save page", async function () {
  console.time("save page");
  this.style.background = "#ff9800";
  const interval = setInterval((o) => {
    const suffix = ".".padStart((++o.i % 3) + 1, " ").padEnd(3, " ");
    this.innerHTML = "Saving " + suffix.replace(/\s/g, "&nbsp;");
  }, ...[333, { i: 0 }]); // 茴回囘囬

  const /** @type {Document} */ dom = document.cloneNode(true);

  const removeList = `script, style, source, title, link`;
  dom.querySelectorAll(removeList).forEach((el) => el.remove());

  const qsam = (s, f) => [...document.querySelectorAll(s)].map(f);

  const imgs = dom.querySelectorAll("img");
  const imgTasks = qsam("img", async (el, i) => {
    const reader = new FileReader();
    reader.readAsDataURL(await fetchex(el.currentSrc, "blob"));
    await new Promise((r) => (reader.onload = reader.onerror = r));
    imgs[i].src = reader.result;
    imgs[i].srcset = "";
  });

  const css = []; // Keep order
  const cssTasks = qsam("style, link[rel=stylesheet]", async (el, i) => {
    if (el.tagName === "STYLE") css[i] = el.textContent;
    else css[i] = await fetchex(el.href, "text");
  });

  await Promise.allSettled([...imgTasks, ...cssTasks]);

  // [TODO:Limitation] `url()` and `image-set()` in css will not be save
  // Avoid the long-loading issue
  const cssStr = css
    .filter((v) => !v.slice(0, 128).includes("<!DOCTYPE")) // exclude some invalid resources
    .join("\n\n")
    .replace(/(url|image-set)(.+?)/g, "url()");
  dom.head.appendChild(dom.createElement("style")).textContent = cssStr;
  console.log({ cssStr });

  dom.querySelectorAll("a").forEach((el) => {
    // "a:not([href^='http']):not([href^='//'])"
    el.setAttribute("href", el.href); // make links absolute
  });

  // [TODO:Limitation] breaked some no-doctype / xhtml / html4 pages
  const result = "<!DOCTYPE html>" + dom.documentElement.outerHTML;

  console.timeEnd("save page");

  clearInterval(interval);

  const link = document.createElement("a"); // Using `dom` will cause failure
  link.download = `${document.title}_${Date.now()}.html`;
  link.href = "data:text/html," + encodeURIComponent(result);
  link.click();

  this.textContent = "Page saved";
  this.style.background = "#4caf50";
});
