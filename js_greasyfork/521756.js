// ==UserScript==
// @name         3dRipper-assistant
// @namespace    3dRipper
// @version      0.0.178-BETA
// @author       3dRipper
// @description  A userscript to assist with using 3dRipper
// @license      MIT
// @icon         https://3dripper.dev/assets/favicons/favicon-32x32.png
// @match        https://3dripper.dev/*
// @match        https://sketchfab.com/3d-models/*
// @match        https://sketchfab.com/models/*
// @match        https://www.artstation.com/embed/*
// @match        https://www.artstation.com/artwork/*
// @match        https://www.cgtrader.com/*
// @match        https://www.fab.com/dope/*
// @match        https://www.fab.com/listings/*
// @grant        GM_info
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521756/3dRipper-assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/521756/3dRipper-assistant.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function() {
    const isUserScript = typeof GM_info !== "undefined";
    const URL_HOST = "https://3dripper.dev";
    const Marmoset_Embed_Url = `https://www.artstation.com/embed/`;
    const Artstation_View_Url = `https://www.artstation.com/artwork/`;
    const CGTrader_View_Url = `https://www.cgtrader.com/`;
    const SF_View_URL = `https://sketchfab.com/3d-models/`;
    const SF_Viewer_URL = `https://sketchfab.com/models/`;
    const Dope_Viewer_URL = `https://www.fab.com/dope/`;
    const Dope_List_URL = `https://www.fab.com/listings/`;
    const tag = "shuziwenwu";
    const inject_tag = "_3DRIPPER_";
    const { href } = window.location;
    if (href.includes(URL_HOST)) {
      localStorage.setItem("_3DRIPPER_", "_3DRIPPER_");
      return;
    }
    if (typeof window.assistant_tag !== "undefined") {
      return;
    } else {
      window.assistant_tag = inject_tag;
    }
    function addASIframeButtons() {
      const iframes = document.querySelectorAll("iframe");
      let count = 0, container = document.querySelector(".modal-layout");
      for (let i = 0; i < iframes.length; i++) {
        let iframe = iframes[i];
        let { contentWindow, src } = iframe;
        if (!(src.includes("artstation") || src.includes("marmoset")) || src.includes("cgtrader")) {
          continue;
        }
        let { currentViewer } = contentWindow;
        const button = document.createElement("button");
        button.textContent = "download model";
        if (count == 0 && container) {
          scrollToElementInContainer(container, iframe);
        }
        count++;
        button.addEventListener("click", async () => {
          let author = document.querySelector("div.project-author-name > h3 > a:nth-child(1)").innerHTML;
          let { sceneURL: mview, ui } = currentViewer;
          let { title } = contentWindow.document;
          let { loadingImageURL: thumb } = ui;
          let data = JSON.stringify({ thumb, mview, title, author });
          let compressed = await compress(data, "gzip");
          compressed = arrayBufferToBase64(compressed);
          window.open(`${URL_HOST}/MMRipper#${compressed}?auto=1`);
        });
        iframe.parentNode.insertBefore(button, iframe);
      }
      if (count == 0) {
        alert("This page does not seem to have any models available for online preview!");
      } else {
        alert("Discover online models that can be downloaded");
      }
    }
    function addASEmbedButtons() {
      const button = document.createElement("button");
      button.textContent = "download model";
      button.style.position = "fixed";
      button.style.top = "0";
      button.style.left = "0";
      button.addEventListener("click", async () => {
        var _a;
        let { currentViewer, document: document2 } = window;
        let { sceneURL: mview, ui } = currentViewer;
        let { title } = document2;
        let { loadingImageURL: thumb } = ui;
        const regex = new RegExp("(?<=medium\\/)([^-]+-[^-]+)(?=-mview-image)");
        const match = thumb.match(regex);
        let author = ((_a = match[0]) == null ? void 0 : _a.replace(/\-/, " ")) || "unknown";
        let data = JSON.stringify({ thumb, mview, title, author });
        let compressed = await compress(data, "gzip");
        compressed = arrayBufferToBase64(compressed);
        window.open(`${URL_HOST}/MMRipper#${compressed}?auto=1`);
      });
      document.body.appendChild(button);
      alert("Discover online models that can be downloaded");
    }
    function addDPMmbedButtons() {
      const button = document.createElement("button");
      button.textContent = "download model";
      button.style.position = "fixed";
      button.style.zIndex = "9999";
      button.style.bottom = "0";
      button.style.left = "0";
      button.style.color = "#fff";
      button.style.backgroundColor = "#409eff";
      button.addEventListener("click", async () => {
        let { href: href2 } = window.location;
        fetch(href2).then((res) => res.text()).then(async (html) => {
          var _a;
          let regex = /[a-zA-z]+:\/\/[^\s]*\.mview/g;
          let mview = (_a = html.match(regex)) == null ? void 0 : _a[0];
          if (!mview) {
            alert("This page does not seem to have any models available for online preview!");
            return;
          }
          let { document: document2 } = window;
          let { title } = document2;
          let author = "unknown";
          let data = JSON.stringify({ mview, title, author });
          let compressed = await compress(data, "gzip");
          compressed = arrayBufferToBase64(compressed);
          window.open(`${URL_HOST}/MMRipper#${compressed}?auto=1`);
        });
      });
      document.body.appendChild(button);
      alert("Discover online models that can be downloaded");
    }
    function addCGViewer() {
      const views = document.querySelectorAll('img[data-type="marmoset"]');
      let count = 0;
      for (let i = 0; i < views.length; i++) {
        let view = views[i];
        let mview = view.getAttribute("data-src");
        const button = document.createElement("button");
        button.textContent = i == 0 ? "download model" : `download model ${i + 1}`;
        if (count == 0 && view) {
          scrollToElementInContainer(document.body, view);
        }
        count++;
        button.addEventListener("click", async () => {
          let author = document.querySelector(".author-info .username").innerHTML;
          let title = document.querySelector(".product-header__title").innerHTML;
          let thumb;
          let data = JSON.stringify({ thumb, mview, title, author });
          let compressed = await compress(data, "gzip");
          compressed = arrayBufferToBase64(compressed);
          window.open(`${URL_HOST}/MMRipper#${compressed}?auto=1`);
        });
        let container = document.querySelector("#product-main");
        container.parentNode.insertBefore(button, container);
      }
      if (count == 0) {
        alert("This page does not seem to have any models available for online preview!");
      } else {
        alert("Discover online models that can be downloaded");
      }
    }
    function addSFIframeButtons() {
      const sfLinks = document.querySelectorAll('iframe[src*="sketchfab.com/models/"]');
      for (let i = 0; i < sfLinks.length; i++) {
        let iframe = sfLinks[i];
        let url = iframe.src;
        let id = url.split("/")[4];
        let button = document.createElement("button");
        button.textContent = "Download Via 3dRipper";
        button.addEventListener("click", () => {
          window.open(`${URL_HOST}/SFRipper#${id}?auto=1`);
        });
        button.style.position = "absolute";
        button.style.left = "0";
        button.style.top = "0";
        button.style.zIndex = "9999";
        iframe.parentNode.insertBefore(button, iframe);
      }
      if (sfLinks.length == 0) {
        alert("This page does not seem to have any models available for online preview!");
      } else {
        alert("Discover online models that can be downloaded");
      }
    }
    function addSFViewerButtons() {
      let url = location.href;
      let id = url.split("/")[4];
      let button = document.createElement("button");
      button.style.position = "fixed";
      button.style.top = "0";
      button.style.left = "0";
      button.textContent = "Download Via 3dRipper";
      button.addEventListener("click", () => {
        window.open(`${URL_HOST}/SFRipper#${id}?auto=1`);
      });
      button.style.position = "absolute";
      button.style.left = "0";
      button.style.top = "0";
      button.style.zIndex = "9999";
      document.body.appendChild(button);
      alert("Discover online models that can be downloaded");
    }
    function arrayBufferToBase64(buffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
    function compress(string, encoding) {
      const byteArray = new TextEncoder().encode(string);
      const cs = new CompressionStream(encoding);
      const writer = cs.writable.getWriter();
      writer.write(byteArray);
      writer.close();
      return new Response(cs.readable).arrayBuffer();
    }
    function scrollToElementInContainer(container, target, scrollDuration = 300) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetPosition = {
        top: targetRect.top - containerRect.top,
        left: targetRect.left - containerRect.left
      };
      const startPosition = {
        top: container.scrollTop,
        left: container.scrollLeft
      };
      const distance = {
        top: targetPosition.top - startPosition.top,
        left: targetPosition.left - startPosition.left
      };
      let start = null;
      function scrollAnimation(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const ease = easeInOutQuad(progress, 0, 1, scrollDuration);
        container.scrollTop = startPosition.top + distance.top * ease;
        container.scrollLeft = startPosition.left + distance.left * ease;
        if (progress < scrollDuration) {
          requestAnimationFrame(scrollAnimation);
        }
      }
      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -1 / 2 * (t * (t - 2) - 1) + b;
      }
      requestAnimationFrame(scrollAnimation);
    }
    const excute = async () => {
      if (href.includes(Artstation_View_Url)) {
        addASIframeButtons();
      }
      if (href.includes(CGTrader_View_Url)) {
        addCGViewer();
      }
      if (href.includes(Marmoset_Embed_Url)) {
        addASEmbedButtons();
      }
      if (href.includes(SF_View_URL)) {
        addSFIframeButtons();
      }
      if (href.includes(SF_Viewer_URL)) {
        addSFViewerButtons();
      }
      if (href.includes(tag)) {
        addDPMmbedButtons();
      }
      if (href.includes(Dope_List_URL)) {
        await dopeListInject();
      }
      console.log("3dRipper assistant injected!");
    };
    const createFloatBtn = () => {
      if (href.includes(URL_HOST) && document.referrer.includes(URL_HOST) || href.includes(Marmoset_Embed_Url) && document.referrer.includes(Artstation_View_Url)) {
        return;
      }
      let btn = document.createElement("button");
      let img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = "https://3dripper.dev/assets/favicons/favicon-32x32.png";
      btn.style.cursor = "pointer";
      img.draggable = false;
      btn.appendChild(img);
      btn.style.width = "50px";
      btn.style.height = "50px";
      btn.style.position = "fixed";
      btn.style.bottom = "60%";
      btn.style.right = "0px";
      btn.style.zIndex = "9999";
      btn.style.padding = "10px";
      btn.style.borderRadius = "25px";
      btn.style.background = "#59caef";
      btn.style.color = "#fff";
      btn.style.border = "none";
      let offsetX, offsetY, isDragging = false;
      btn.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - btn.getBoundingClientRect().left;
        offsetY = e.clientY - btn.getBoundingClientRect().top;
      });
      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          btn.style.left = `${e.clientX - offsetX}px`;
          btn.style.top = `${e.clientY - offsetY}px`;
        }
      });
      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
      btn.onclick = () => {
        if (isDragging) return;
        excute();
      };
      document.body.appendChild(btn);
    };
    const dopeInject = () => {
      let step = -1;
      let _log = (...msg) => {
      };
      const data = {
        buffers: [],
        textures: [],
        animations: {}
      };
      _log(data);
      let bufferDataCount = 0, transferrCommand = false;
      const uid = location.href.split("/").pop();
      let _bufferSubData = WebGL2RenderingContext.prototype.bufferSubData;
      WebGL2RenderingContext.prototype.bufferSubData = function(...args) {
        if (step == 1) {
          _log("bufferSubData:", args);
          _log(args);
          if (bufferDataCount > 0) {
            data.buffers.push(args[2]);
            bufferDataCount--;
          }
        }
        _bufferSubData.apply(this, args);
      };
      let _bufferData = WebGL2RenderingContext.prototype.bufferData;
      WebGL2RenderingContext.prototype.bufferData = function(...args) {
        if (step == 1) {
          _log("bufferData:", args);
          bufferDataCount++;
          _log(args);
        }
        _bufferData.apply(this, args);
      };
      let _getAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders;
      XMLHttpRequest.prototype.getAllResponseHeaders = function() {
        const { responseURL, responseText } = this;
        _log(responseURL);
        if (responseURL.includes("options")) {
          let options = JSON.parse(responseText);
          data.options = options;
        } else if (responseURL.includes("/textures")) {
          let json = JSON.parse(responseText);
          data.textures = json.results;
          if (data.textures.length == 0) {
            if (!transferrCommand && document.referrer.includes(URL_HOST)) {
              transferrCommand = true;
              top.postMessage({ data, type: "data" }, URL_HOST);
            }
          }
        } else if (responseURL.split("/").pop() == uid) {
          let json = JSON.parse(responseText);
          data.model = json;
        }
        return _getAllResponseHeaders.call(this);
      };
      const hook = (__dope) => {
        const _release = __dope.releaseXHRDopeProgress;
        __dope.releaseXHRDopeProgress = (d) => {
          _log(`releaseXHRDopeProgress:${d}`);
          if (d.indexOf("/file.binz") !== -1) {
            step = 0;
            const model = [111, 114, 34, 58, 32, 34, 79, 112, 101, 110, 83, 99, 101, 110, 101, 71, 114, 97, 112, 104];
            let modelBuffer = searchAddr(model);
            data.modelBuffer = modelBuffer;
          } else if (d.indexOf("/model_file.binz") !== -1) {
            step = 1;
          } else if (d.indexOf("animations") !== -1) {
            step = 2;
          } else if (d.indexOf("textures") !== -1) {
            step = 3;
            if (!transferrCommand && document.referrer.includes(URL_HOST)) {
              transferrCommand = true;
              top.postMessage({ data, type: "data" }, URL_HOST);
            }
          }
          return _release.call(this, d);
        };
        const _dopeInterceptXHR = __dope.dopeInterceptXHR;
        __dope.dopeInterceptXHR = (url, response) => {
          if (url.indexOf("/model_file.binz") !== -1) {
            data.buffer = response;
          } else if (url.indexOf("/file.binz") !== -1) {
            data.file = response;
          }
          _dopeInterceptXHR && _dopeInterceptXHR.apply(this, [url, response]);
        };
        const searchAddr = (data2) => {
          const m = __dope["HEAPU8"];
          const match = (j) => {
            return data2.every((b, i) => m[i + j] === b);
          };
          let max = Math.max(0, m.byteLength || m.length);
          let addr = 0;
          for (addr = 0; addr < max; addr++) {
            if (match(addr)) {
              break;
            }
          }
          const len = max - addr;
          for (let i = addr; i < len; i++) {
            if (m[i] === 0) {
              max = i;
              break;
            }
          }
          return m.slice(addr, max);
        };
      };
      Object.defineProperty(window, "__dope", {
        get() {
          _log("获取 __dope");
          return this._dope;
        },
        set(value) {
          hook(value);
          this._dope = value;
        }
      });
    };
    const dopeListInject = async () => {
      const listId = location.href.split("/").pop().split("#").shift() || "";
      const content = await request(`https://www.fab.com/i/listings/${listId}`);
      const { medias } = content;
      let flag = true;
      if (medias.length == 1) {
        const item = medias[0];
        if (item.type == "model") {
          const container = document.querySelector("div.fabkit-Thumbnail-root");
          const { previewUid } = item;
          const a = document.createElement("a");
          a.href = `${URL_HOST}/FabRipper#${previewUid}?auto=1`;
          a.textContent = "download";
          a.style.position = "absolute";
          a.style.top = 0;
          a.style.left = 0;
          a.style.color = "#f00";
          a.target = "_blank";
          container.appendChild(a);
          flag = false;
        }
      } else {
        const container = document.querySelector("div.fabkit-Stack-root > ol");
        const thumbs = container.querySelectorAll(".fabkit-Thumbnail-root");
        for (let i = 0; i < medias.length; i++) {
          const item = medias[i];
          if (item.type !== "model") {
            continue;
          }
          const { mediaUrl, previewUid } = item;
          const li = thumbs[i];
          const a = document.createElement("a");
          a.href = `${URL_HOST}/FabRipper#${previewUid}?auto=1`;
          a.textContent = "download";
          a.style.position = "absolute";
          a.style.color = "#f00";
          a.target = "_blank";
          li.appendChild(a);
          flag = false;
        }
      }
      if (flag) {
        alert("This page does not seem to have any models available for online preview!");
      }
    };
    const request = (url) => {
      return new Promise((resolve) => {
        fetch(url).then((res) => res.json()).then((data) => resolve(data));
      });
    };
    const inject = () => {
      if (href.includes(Dope_Viewer_URL)) {
        if (!document.referrer.includes(Dope_List_URL)) {
          dopeInject();
        }
      } else if (href.includes(URL_HOST)) {
        console.log(inject_tag);
      } else {
        createFloatBtn();
      }
    };
    if (!isUserScript) {
      excute();
    } else {
      inject();
    }
  })();

})();