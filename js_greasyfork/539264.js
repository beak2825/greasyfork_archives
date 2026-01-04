// ==UserScript==
// @name         Sukebei FC2-PPV Image Preview
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hover over a link on sukebei.nyaa.si to see a preview image from fc2ppvdb.com. Middle click on that link opens fc2ppvdv page to a new tab.
// @author       Nardcromance
// @match        https://sukebei.nyaa.si/*
// @grant        GM_xmlhttpRequest
// @connect      fc2ppvdb.com
// @connect      missav.ai
// @connect      www.javdatabase.com
// @downloadURL https://update.greasyfork.org/scripts/539264/Sukebei%20FC2-PPV%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/539264/Sukebei%20FC2-PPV%20Image%20Preview.meta.js
// ==/UserScript==
"use strict";
(() => {
  // sukebei.nyaa.si/preview/data-source/DataSource.ts
  var DataSource = class {
    constructor(sourceUrl, imgSelector, tagsSelector) {
      this.sourceUrl = sourceUrl;
      this.imgSelector = imgSelector;
      this.tagsSelector = tagsSelector;
    }
    divId = "sukeibei-video-preview";
    previewDiv = null;
    cache = {};
    VIDEO_ID_PLEACEHOLDER = "__VIDEO_ID__";
    currentRequest = null;
    currentViewingUrl = null;
    async loadRemoteData(url, videoId) {
      console.log(`Loading data for ${videoId} from ${url}`);
      const newCachedData = {
        doc: null,
        imgUrl: "",
        tags: [],
        url,
        id: videoId,
        request: null,
        response: null,
        fulfilled: false
      };
      if (!this.cache[videoId]) {
        this.cache[videoId] = newCachedData;
      }
      const currentCacheObject = this.cache[videoId];
      try {
        const response = await new Promise(
          (resolve, reject) => {
            if (!currentCacheObject.fulfilled) {
              console.log(`Sending request to retrieve data for ${videoId} from ${url}`);
              const request = GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: (res) => {
                  if (res.status === 200) {
                    resolve(res);
                  } else {
                    reject(
                      new Error(`Request failed with status: ${res.status}, request URL: ${url}`)
                    );
                  }
                },
                // For all failure cases, we reject the promise
                onerror: (err) => reject(err),
                ontimeout: () => reject(new Error("Request timed out")),
                onabort: () => reject(new Error("Request aborted"))
                // Handle intentional aborts
              });
              currentCacheObject.request = request;
              this.currentRequest = request;
            } else {
              console.log(`Using cached data for ${videoId}`);
              resolve(currentCacheObject.response);
            }
          }
        );
        if (response) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          currentCacheObject.doc = doc;
          currentCacheObject.fulfilled = true;
          currentCacheObject.response = response;
        }
        return currentCacheObject;
      } catch (error) {
        console.error(`Error fetching data for ${videoId}:`, error);
        this.cache[videoId].request = null;
        throw error;
      }
    }
    getDoc(videoId) {
      if (!this.cache[videoId] || !this.cache[videoId].doc) {
        throw new Error("Load data before getting the document.");
      }
      return this.cache[videoId].doc;
    }
    getLink(videoId) {
      if (!this.cache[videoId] || !this.cache[videoId].url) {
        throw new Error("Load data before getting the link.");
      }
      return this.cache[videoId].url;
    }
    getPreviewDiv() {
      if (this.previewDiv) {
        return this.previewDiv;
      } else {
        let previewDiv = document.getElementById(this.divId);
        if (previewDiv) {
          this.previewDiv = previewDiv;
        } else {
          previewDiv = document.createElement("div");
          previewDiv.id = this.divId;
          previewDiv.style.width = "300px";
          previewDiv.style.position = "fixed";
          previewDiv.style.display = "block";
          previewDiv.style.border = "1px solid #ccc";
          previewDiv.style.padding = "5px";
          previewDiv.style.backgroundColor = "white";
          previewDiv.style.zIndex = "9999";
          const errorP = document.createElement("p");
          errorP.id = "preview-error-message";
          errorP.innerText = "";
          errorP.style.display = "none";
          previewDiv.appendChild(errorP);
          const metadataDiv = document.createElement("div");
          metadataDiv.id = "preview-metadata";
          metadataDiv.style.margin = "0";
          metadataDiv.style.padding = "0";
          previewDiv.appendChild(metadataDiv);
          const previewImg = document.createElement("img");
          previewImg.id = "preview-image";
          previewImg.src = "";
          previewImg.style.maxWidth = "100%";
          previewImg.style.maxHeight = "300px";
          previewImg.style.display = "block";
          metadataDiv.appendChild(previewImg);
          const previewTags = document.createElement("div");
          previewTags.id = "preview-tags";
          previewTags.style.marginTop = "10px";
          previewTags.innerText = "";
          metadataDiv.appendChild(previewTags);
          document.body.appendChild(previewDiv);
          this.previewDiv = previewDiv;
        }
        return this.previewDiv;
      }
    }
    getImgElement(sourceUrl) {
      const previewImg = document.querySelector(`#${this.divId} img#preview-image`);
      previewImg.src = sourceUrl;
      return previewImg;
    }
    getTagsElement(tagsString) {
      const previewTags = document.querySelector(`#${this.divId} div#preview-tags`);
      previewTags.innerText = tagsString;
      return previewTags;
    }
    hidePopover() {
      if (this.previewDiv) {
        this.previewDiv.style.display = "none";
      }
      if (this.currentRequest) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
      this.currentViewingUrl = null;
    }
    async showPopover(videoIdId) {
      const previewDiv = this.getPreviewDiv();
      previewDiv.style.display = "block";
      const errorP = previewDiv.querySelector("#preview-error-message");
      const metadataDiv = previewDiv.querySelector("#preview-metadata");
      try {
        const imageSrc = await this.getImgSrc(videoIdId);
        const tagsString = await this.getTagsString(videoIdId);
        const imgElement = this.getImgElement(imageSrc);
        const tagsElement = this.getTagsElement(tagsString);
        this.currentViewingUrl = await this.getLink(videoIdId);
        errorP.style.display = "none";
        metadataDiv.style.display = "block";
      } catch (error) {
        errorP.innerHTML = `Video ID: ${videoIdId} not found`;
        errorP.style.display = "block";
        metadataDiv.style.display = "none";
        this.currentViewingUrl = null;
      }
    }
    setPopoverPosition(mousePosition) {
      if (!this.previewDiv) {
        return;
      }
      this.previewDiv.style.left = `${mousePosition.x}px`;
      this.previewDiv.style.top = `${mousePosition.y + 30}px`;
    }
  };

  // sukebei.nyaa.si/preview/data-source/FC2PPVDataSource.ts
  var FC2PPVDataSource = class extends DataSource {
    VIDEO_ID_PLEACEHOLDER = "__VIDEO_ID__";
    constructor() {
      super(
        "https://fc2ppvdb.com/articles/__VIDEO_ID__",
        'main section img[alt="__VIDEO_ID__"]',
        "main section a[href]"
      );
      this.cache = {};
    }
    /**
     * Extracts an FC2 ID from a string using a case-insensitive regex.
     *
     * @param {string} text The input string to search within.
     * @returns {string} The extracted numerical ID as a string, or null if no match is found.
     */
    extractFc2Id(text) {
      if (typeof text !== "string" || text.trim() === "") {
        return "";
      }
      if (/^[0-9]+$/.test(text)) {
        return text;
      }
      const regex = /(?:FC2-PPV-|FC2PPV)([0-9]+)/i;
      const match = regex.exec(text);
      return match ? match[1] : "";
    }
    async loadData(videoId) {
      const fc2Id = this.extractFc2Id(videoId);
      const url = this.sourceUrl.replace(this.VIDEO_ID_PLEACEHOLDER, fc2Id);
      return await this.loadRemoteData(url, videoId);
    }
    getImgSrc(videoId) {
      let imgSrc = this.cache[videoId]?.imgUrl;
      if (!imgSrc) {
        const fc2Id = this.extractFc2Id(videoId);
        if (!fc2Id) {
          return "ss";
        }
        const doc = this.getDoc(videoId);
        const imgSelector = this.imgSelector.replace(
          this.VIDEO_ID_PLEACEHOLDER,
          fc2Id
        );
        const img = doc.querySelector(imgSelector);
        imgSrc = img?.src;
        this.cache[videoId].imgUrl = imgSrc;
      }
      return imgSrc;
    }
    getTagsString(videoId) {
      let tags = this.cache[videoId]?.tags;
      if (!tags || tags.length === 0) {
        const fc2Id = this.extractFc2Id(videoId);
        const doc = this.getDoc(videoId);
        if (!doc || !fc2Id) {
          return "";
        }
        const tagsSelector = this.tagsSelector.replace(
          this.VIDEO_ID_PLEACEHOLDER,
          fc2Id
        );
        const links = [
          ...doc.querySelectorAll(tagsSelector)
        ];
        tags = links.filter((link) => {
          const href = link.getAttribute("href");
          return href?.startsWith("/tags/");
        }).map((tag) => {
          return tag.innerText;
        });
        this.cache[videoId].tags = tags;
      }
      return tags.join(", ");
    }
  };

  // sukebei.nyaa.si/preview/data-source/JAVDataBaseDataSource.ts
  var JAVDataBaseDataSource = class extends DataSource {
    constructor() {
      super(
        "https://www.javdatabase.com/movies/__VIDEO_ID__/",
        "#poster-container img",
        "a[href]"
      );
      this.cache = {};
    }
    getImgSrc(videoId) {
      let imgSrc = this.cache[videoId]?.imgUrl;
      if (!imgSrc) {
        const doc = this.getDoc(videoId);
        const imgSelector = this.imgSelector;
        const img = doc.querySelector(imgSelector);
        imgSrc = img.src ?? "";
        this.cache[videoId].imgUrl = imgSrc;
      }
      return imgSrc;
    }
    getTagsString(videoId) {
      let tags = this.cache[videoId]?.tags;
      if (!tags || tags.length === 0) {
        const doc = this.getDoc(videoId);
        const tagsSelector = this.tagsSelector;
        const links = [
          ...doc.querySelectorAll(tagsSelector)
        ];
        tags = links.filter((link) => {
          const href = link.getAttribute("href");
          if (!href) {
            return false;
          }
          return href.indexOf("/genres/") > -1;
        }).map((tag) => {
          return tag.innerText;
        });
        this.cache[videoId].tags = tags;
      }
      return tags.join(", ");
    }
    async loadData(videoId) {
      const url = this.sourceUrl.replace(this.VIDEO_ID_PLEACEHOLDER, videoId);
      return await this.loadRemoteData(url, videoId);
    }
  };

  // sukebei.nyaa.si/preview/script-ts.user.ts
  var currentDataSource = null;
  var currentVideoId = "";
  var currentMegnetLink = "";
  var patterns = [
    {
      name: "jav-database",
      pattern: /\s([A-Z]{2,}\-[0-9]{3,6})\s/,
      source: "https://www.javdatabase.com/movies/__VIDEO_ID__",
      dataSourceClass: JAVDataBaseDataSource,
      dataSourceInstance: null
    },
    // {
    //   name: "general",
    //   pattern: /\ ([A-Z]{3,4}\-[0-9]{3,4})\ /,
    //   source: "https://missav.ai/__VIDEO_ID__",
    //   dataSourceClass: MissAvDataSource,
    //   dataSourceInstance: null,
    // },
    {
      name: "fc2ppv",
      pattern: /\s(FC2-?PPV-?([0-9]{5,7}))\s/,
      source: "https://fc2ppvdb.com/articles/__VIDEO_ID__",
      dataSourceClass: FC2PPVDataSource,
      dataSourceInstance: null
    }
  ];
  document.addEventListener("mouseover", async function(e) {
    const target = e.target;
    if (target && target.tagName === "TD") {
      const trElement = target.closest("tr");
      if (!trElement) {
        return;
      }
      const linkElements = trElement.querySelectorAll("a");
      console.log(linkElements);
      const linkElement = [...linkElements].find((a) => a.href.indexOf("/view/") > -1);
      if (!linkElement) {
        return;
      }
      const linkText = linkElement.textContent;
      const dataSource = patterns.find((pattern) => {
        if (pattern.pattern.test(linkText)) {
          return pattern.dataSourceClass;
        }
      });
      const aElements = trElement?.querySelectorAll("a");
      const megnetLink = [...aElements].find(
        (a) => a.href.startsWith("magnet:")
      );
      currentMegnetLink = megnetLink?.href ?? "";
      if (dataSource) {
        const match = linkText.match(dataSource.pattern);
        const videoId = match[1];
        const dataSourceClass = dataSource.dataSourceClass;
        let dataSourceInstance = dataSource.dataSourceInstance;
        if (dataSourceInstance === null) {
          dataSourceInstance = new dataSourceClass();
          dataSource.dataSourceInstance = dataSourceInstance;
        }
        currentVideoId = videoId;
        try {
          await dataSourceInstance.loadData(videoId);
        } catch (error) {
          console.error(`Failed to load data for video ID ${videoId}:`, error);
        }
        const trRect = trElement.getBoundingClientRect();
        dataSourceInstance.showPopover(videoId);
        dataSourceInstance.setPopoverPosition({ x: trRect.left, y: trRect.top });
        currentDataSource = dataSourceInstance;
      } else {
        currentDataSource = null;
        currentVideoId = "";
      }
    }
  });
  document.addEventListener("auxclick", async function(e) {
    if (e.button === 1 && e.ctrlKey && currentMegnetLink) {
      e.preventDefault();
      window.location.href = currentMegnetLink;
    } else if (e.button === 1 && currentDataSource) {
      e.preventDefault();
      window.open(await currentDataSource.getLink(currentVideoId));
    }
  });
  document.addEventListener("mousemove", function(e) {
  });
  document.addEventListener("mouseout", function(e) {
    const target = e.target;
    if (target.tagName === "A" && currentDataSource) {
      currentDataSource.hidePopover();
    }
  });
})();
