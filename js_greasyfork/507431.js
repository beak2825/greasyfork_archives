// ==UserScript==
// @name         Story Downloader - Facebook and Instagram
// @namespace    https://github.com/oscar370
// @version      2.0.6
// @description  Download stories (videos and images) from Facebook and Instagram.
// @author       oscar370
// @match        *.facebook.com/*
// @match        *.instagram.com/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/507431/Story%20Downloader%20-%20Facebook%20and%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/507431/Story%20Downloader%20-%20Facebook%20and%20Instagram.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/main.ts
  (function() {
    "use strict";
    const MAX_ATTEMPTS = 10;
    const isDev = false;
    class StoryDownloader {
      constructor() {
        this.mediaUrl = null;
        this.detectedVideo = null;
        this.init();
      }
      init() {
        this.log("Initializing observer...");
        this.setupMutationObserver();
      }
      setupMutationObserver() {
        const observer = new MutationObserver(() => {
          this.checkPageStructure();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
      get isFacebookPage() {
        return /(facebook)/.test(window.location.href);
      }
      checkPageStructure() {
        const btn = document.getElementById("downloadBtn");
        if (/(\/stories\/)/.test(window.location.href)) {
          this.injectGlobalStyles();
          this.createButtonWithPolling();
        } else if (btn) {
          btn.remove();
        }
      }
      injectGlobalStyles() {
        if (document.getElementById("downloadBtnStyles")) return;
        const style = document.createElement("style");
        style.id = "#downloadBtnStyles";
        style.textContent = `
        #downloadBtn {
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          z-index: 9999;
        }
      `;
        document.head.appendChild(style);
      }
      createButtonWithPolling() {
        let attempts = 0;
        const interval = setInterval(() => {
          const existingBtn = document.getElementById("downloadBtn");
          if (existingBtn) {
            clearInterval(interval);
            this.log("Button already present", existingBtn);
            return;
          }
          const createdBtn = this.createButton();
          if (createdBtn) {
            clearInterval(interval);
            this.log("Button successfully created", createdBtn);
            return;
          }
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(interval);
            this.log("Button creation failed after max attempts");
          }
        }, 500);
      }
      createButton() {
        if (document.getElementById("downloadBtn")) return null;
        const topBars = this.isFacebookPage ? Array.from(document.querySelectorAll("div.xtotuo0")) : Array.from(document.querySelectorAll("div.x1xmf6yo"));
        const topBar = topBars.find(
          (bar) => bar instanceof HTMLElement && bar.offsetHeight > 0
        );
        if (!topBar) {
          this.log("No suitable top bar found");
          return null;
        }
        const btn = document.createElement("button");
        btn.id = "downloadBtn";
        btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
         class="bi bi-file-arrow-down-fill" viewBox="0 0 16 16">
      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2
               M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 
               .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 
               .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
    </svg>
  `;
        btn.addEventListener("click", () => this.handleDownload());
        topBar.appendChild(btn);
        this.log("Download button added", btn);
        return btn;
      }
      async handleDownload() {
        try {
          await this.detectMedia();
          if (!this.mediaUrl) throw new Error("No multimedia content was found");
          const filename = this.generateFileName();
          await this.downloadMedia(this.mediaUrl, filename);
        } catch (error) {
          this.log("Download failed:", error);
        }
      }
      async detectMedia() {
        const video = this.findVideo();
        const image = this.findImage();
        if (video) {
          this.mediaUrl = video;
          this.detectedVideo = true;
        } else if (image) {
          this.mediaUrl = image.src;
          this.detectedVideo = false;
        }
        this.log("Media URL detected:", this.mediaUrl);
      }
      findVideo() {
        const videos = Array.from(document.querySelectorAll("video")).filter(
          (v) => v.offsetHeight > 0
        );
        for (const video of videos) {
          const url = this.searchVideoSource(video);
          if (url) {
            return url;
          }
        }
        return null;
      }
      searchVideoSource(video) {
        const reactFiberKey = Object.keys(video).find(
          (key) => key.startsWith("__reactFiber")
        );
        if (!reactFiberKey) return null;
        const reactKey = reactFiberKey.replace("__reactFiber", "");
        const parent = video.parentElement?.parentElement?.parentElement?.parentElement;
        const reactProps = parent?.[`__reactProps${reactKey}`];
        const implementations = reactProps?.children?.[0]?.props?.children?.props?.implementations ?? reactProps?.children?.props?.children?.props?.implementations;
        if (implementations) {
          for (const index of [1, 0, 2]) {
            const source = implementations[index]?.data;
            const url = source?.hdSrc || source?.sdSrc || source?.hd_src || source?.sd_src;
            if (url) return url;
          }
        }
        const videoData = video[reactFiberKey]?.return?.stateNode?.props?.videoData?.$1;
        return videoData?.hd_src || videoData?.sd_src || null;
      }
      findImage() {
        const images = Array.from(document.querySelectorAll("img")).filter(
          (img) => img.offsetHeight > 0 && img.src.includes("cdn")
        );
        return images.find((img) => img.height > 400) || null;
      }
      generateFileName() {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        let userName = "unknown";
        if (this.isFacebookPage) {
          const user = Array.from(
            document.querySelectorAll("span.xuxw1ft.xlyipyv")
          ).find(
            (e) => e instanceof HTMLElement && e.offsetWidth > 0
          );
          userName = user?.innerText || userName;
        } else {
          const user = Array.from(document.querySelectorAll(".x1i10hfl")).find(
            (u) => u instanceof HTMLAnchorElement && u.offsetHeight > 0 && u.offsetHeight < 35
          );
          userName = user?.pathname.replace(/\//g, "") || userName;
        }
        const extension = this.detectedVideo ? "mp4" : "jpg";
        return `${userName}-${timestamp}.${extension}`;
      }
      async downloadMedia(url, filename) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error("Download error:", error);
        }
      }
      log(...args) {
        if (isDev) console.log("[StoryDownloader]", ...args);
      }
    }
    new StoryDownloader();
  })();
})();
