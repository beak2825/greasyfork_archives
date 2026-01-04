// ==UserScript==
// @name         zhihuPostCopy
// @namespace    http://tampermonkey.net/
// @version      2024-08-04
// @description  zhihu Post Copy
// @author       You
// @match        https://zhuanlan.zhihu.com/write
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://baijiahao.baidu.com/builder/rc/edit*
// @match        https://creator.xiaohongshu.com/publish/publish
// @match        https://cp.11467.com/home/personal/news_add.html
// @match        https://cp.11467.com/home/personal/product_add.html
// @match        https://member.bilibili.com/platform/upload/text/edit
// @match        https://member.bilibili.com/article-text/home*
// @match        https://mp.sohu.com/mpfe/v4/contentManagement/news/addarticle*
// @match        http://mp.163.com/subscribe_v4/index.html#/article-publish
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant GM.setValue
// @grant GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502599/zhihuPostCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/502599/zhihuPostCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';


// article-copy.tsx
var tips = function(msg) {
  document.querySelectorAll(".article-tips-span").forEach((span2) => {
    span2.remove();
  });
  const span = document.createElement("span");
  span.textContent = msg;
  span.className = "article-tips-span";
  span.style.cssText = `position: fixed;width: fit-content;padding: 0.5em 1em;background: #000;box-shadow: 0 6px 12px -6px #222;border-radius: 6px;left: 0;right: 0;top: 20vh;margin: auto;color: #fff;z-index: 99;font-size: 13px;`;
  setTimeout(() => {
    span.remove();
  }, 3000);
  document.body.appendChild(span);
};
var fetchArticle = function() {
  const url = /^https:\/\/zhuanlan.zhihu.com\/p\/\d+$/;
  const { href } = window.location;
  if (!url.test(href)) {
    return;
  }
  const title = document.title.split(/\s+/).filter((s) => s.trim())[0] || "";
  const h1 = document.querySelector("h1")?.innerText.trim();
  const realy_title = title || h1 || "";
  const container = document.querySelector(".Post-RichTextContainer .RichText");
  const content = container?.innerHTML || "";
  const data = { title: realy_title, content };
  document.querySelectorAll(".article-copy").forEach((e) => {
    e.remove();
  });
  const div = document.createElement("div");
  div.className = "article-copy";
  div.style.cssText = "position:fixed;top:3em;right:2em;border-radius:6px;z-index:999;background:#222;color:#fff;cursor:pointer;padding:0.5em 1em;box-shadow:0 6px 12px -6px #222;";
  div.textContent = "\u590D\u5236\u6587\u7AE0";
  div.addEventListener("click", () => {
    globalThis.GM.setValue("ARTICLE_CACHE", JSON.stringify(data));
    tips("\u590D\u5236\u5B8C\u6210");
  });
  document.body.appendChild(div);
};
var entry = function(data) {
  const url = /^https:\/\/zhuanlan.zhihu.com\/p\/\d+$/;
  const { href } = window.location;
  if (url.test(href)) {
    return;
  }
  if (!data) {
    return;
  }

  class WebComponentExt extends HTMLElement {
    constructor() {
      super(...arguments);
    }
    html_content(html) {
      const doc = new DOMParser().parseFromString(`<html><body>${html}</body></html>`, "text/html");
      const text = doc.body.innerText;
      return text;
    }
    html_images(html) {
      const container = document.createElement("div");
      container.innerHTML = html;
      const images = [];
      container.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        const original = img.getAttribute("data-original");
        if (original && original.startsWith("http")) {
          images.push(original);
        } else if (src && src.startsWith("http")) {
          images.push(src);
        }
      });
      return images;
    }
    copy_image(e) {
      const src = e.getAttribute("src");
      if (src) {
        this.imgToBlob(src).then((blob) => {
          navigator.clipboard.writeText(src);
          const buff = new ClipboardItem({
            "image/png": blob
          });
          navigator.clipboard.write([buff]).then(() => {
            tips("\u590D\u5236\u6210\u529F");
          });
        });
      }
    }
    copy(text, html) {
      this.async_copy(text, html).then(() => {
        tips("\u590D\u5236\u6210\u529F");
      });
    }
    insert(item) {
      this.insert_xiaohongshu(item);
      this.insert_baijiahao(item);
    }
    insert_xiaohongshu(item) {
      if (!/xiaohongshu\.com/.test(window.location.hostname)) {
        return;
      }
      if (!window.location.pathname.endsWith("/publish/publish")) {
        return;
      }
      const title = document.querySelector(".titleInput input");
      if (!title) {
        return;
      }
      this.setNativeValue(title, item.title);
      this.fireInputEvent(title);
      const content = document.querySelector("#post-textarea");
      const text = this.html_content(item.content);
      const html = text.replace(/\n{2}/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/\n/g, "<br>");
      if (content) {
        content.innerHTML = html;
        this.fireInputEvent(content);
      }
    }
    insert_baijiahao(item) {
      if (!/baidu\.com/.test(window.location.hostname)) {
        return;
      }
      if (!window.location.pathname.endsWith("/builder/rc/edit")) {
        return;
      }
      const title = document.querySelector(".client_pages_edit_components_titleInput textarea");
      if (!title) {
        console.log("title input not found");
        return;
      }
      this.setNativeValue(title, item.title);
      this.fireInputEvent(title);
    }
    insert_bilibili(item) {
      const url2 = "https://member.bilibili.com//article-text/home";
      if (!window.location.href.startsWith(url2)) {
        return;
      }
      const title = document.querySelector(".bre-title-input textarea");
      if (!title) {
        return;
      }
      this.setNativeValue(title, item.title);
      this.fireInputEvent(title);
    }
    render_style() {
      const style = document.createElement("style");
      style.innerHTML = `
        .hidden .item, .hidden .images{
          display: none;
        }
        .item{
          display: flex;
          flex-direction: row;
          font-size: 12px;
          cursor:pointer;
        }
        .item span:first-child{
          flex: 1;
        }
        .item .copy{
          padding-left: 1em;
          color:#2c2;
        }
        .item *{
          pointer-events: none;
        }
        .images{
          align-items: center;
          padding-top: 6px;
        }
        .images span{
          padding-top: 100%;
          position: relative;
          background: #fff2;
          border-radius: 3px;
        }
        .images img{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: 0.3s all;
          cursor:pointer;
          width: 100%;
        }
        .images img:hover{
          background: #fff2;
        }
      `;
      return style;
    }
    render_images_html(images) {
      const container = document.createElement("div");
      container.className = "images";
      let columns = "";
      if (images.length === 1) {
        columns = "1fr";
      } else if (images.length === 2) {
        columns = "1fr 1fr";
      } else if (images.length === 3) {
        columns = "1fr 1fr 1fr";
      } else {
        columns = "1fr 1fr 1fr 1fr";
      }
      container.style.cssText = `display:grid;grid-template-columns:${columns};grid-gap:4px;`;
      images.forEach((url2) => {
        const span = document.createElement("span");
        span.innerHTML = `<img src="${url2}" crossOrigin="anonymous">`;
        container.appendChild(span);
      });
      return container.outerHTML;
    }
    async imgToBlob(imgUrl) {
      const img = new Image;
      img.crossOrigin = "Anonymous";
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("\u56FE\u7247\u8F6C\u6362\u5931\u8D25");
            }
          }, "image/png");
        };
        img.onerror = function() {
          reject("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25");
        };
        img.src = imgUrl;
      });
    }
    async async_copy(text, html) {
      if (html) {
        const doc = new DOMParser().parseFromString(`<html><body>${text}</body></html>`, "text/html");
        const html2 = doc.documentElement.outerHTML;
        const plain = doc.body.innerText;
        const buff2 = new ClipboardItem({
          "text/plain": new Blob([plain], { type: "text/plain" }),
          "text/html": new Blob([html2], { type: "text/html" })
        });
        await navigator.clipboard.write([buff2]);
        return;
      }
      const buff = new ClipboardItem({
        "text/plain": new Blob([text], { type: "text/plain" })
      });
      await navigator.clipboard.write([buff]);
    }
    async load() {
      const text = await globalThis.GM.getValue("ARTICLE_CACHE", "");
      try {
        const data2 = JSON.parse(text);
        return Promise.resolve(data2);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    async render(data2) {
      const { title, content } = data2;
      const images = this.html_images(content);
      const image_html = this.render_images_html(images);
      const intro = this.html_content(content).substring(0, 10);
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;top:2em;right:2em;z-index:999;padding:0.5em 1em;border-radius:6px;background:#000;color:#fff";
      container.innerHTML = `<div class="item title"><span>\u6807\u9898\uFF1A${title}</span><span class="copy">\u590D\u5236</span></div><div class="item content"><span>\u6B63\u6587\uFF1A${intro}</span><span class="copy">\u590D\u5236</span></div>${image_html}`;
      container.className = "root";
      container.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("root")) {
          if (target.classList.contains("hidden")) {
            target.classList.remove("hidden");
          } else {
            target.classList.add("hidden");
          }
          return;
        }
        if (target.tagName === "IMG") {
          this.copy_image(target);
          return;
        }
        if (target.classList.contains("item")) {
          if (target.classList.contains("title")) {
            this.copy(title);
            this.insert(data2);
          } else if (target.classList.contains("content")) {
            this.copy(content, true);
          }
        }
      });
      container.appendChild(this.render_style());
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(container);
    }
    setNativeValue(element2, value) {
      const { set: valueSetter } = Object.getOwnPropertyDescriptor(element2, "value") || {};
      const prototype = Object.getPrototypeOf(element2);
      const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, "value") || {};
      if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element2, value);
      } else {
        if (valueSetter) {
          valueSetter.call(element2, value);
        } else {
          throw new Error("The given element does not have a value setter");
        }
      }
    }
    fireInputEvent(element2) {
      element2.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        cancelable: false,
        composed: true
      }));
    }
    fireChangeEvent(element2) {
      element2.dispatchEvent(new Event("change", {
        bubbles: true,
        cancelable: false
      }));
    }
    fireClickEvent(element2) {
      element2.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        button: 0,
        composed: true
      }));
    }
    connectedCallback() {
      this.load().then((data2) => {
        this.render(data2);
      });
    }
    disconnectedCallback() {
    }
  }
  const elements = document.querySelectorAll(".web-component-article,web-component-article");
  if (elements.length > 0) {
    elements.forEach((element2) => {
      element2.remove();
    });
  }
  const nodeName = `web-component-article-${Date.now()}`;
  customElements.define(nodeName, WebComponentExt);
  const element = document.createElement(nodeName);
  element.className = "web-component-article";
  if (window.top !== window) {
    setTimeout(() => {
        console.log("insert after 10s");
      document.body.appendChild(element);
    }, 1e4);
  } else {
    document.body.appendChild(element);
  }
};
window.addEventListener("load", () => {
  fetchArticle();
  entry("highlight");
});


    // Your code here...
})();