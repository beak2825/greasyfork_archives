// ==UserScript==
// @name         MRM Downloader
// @namespace    https://nyt92.eu.org
// @version      2024-11-21
// @description  Download video and bulk images from myreadingmanga manga/doujin page.
// @author       nyt92
// @match        https://myreadingmanga.info/*
// @exclude      https://myreadingmanga.info/about/
// @exclude      https://myreadingmanga.info/cats/*
// @exclude      https://myreadingmanga.info/pairing/*
// @exclude      https://myreadingmanga.info/group/*
// @exclude      https://myreadingmanga.info/privacy-policy/
// @exclude      https://myreadingmanga.info/dmca-notice/
// @exclude      https://myreadingmanga.info/contact/
// @exclude      https://myreadingmanga.info/terms-service/
// @exclude      https://myreadingmanga.info/sitemap/
// @exclude      https://myreadingmanga.info/my-bookmark/
// @exclude      https://myreadingmanga.info/tag/*
// @exclude      https://myreadingmanga.info/genre/*
// @exclude      https://myreadingmanga.info/status/*
// @exclude      https://myreadingmanga.info/lang/*
// @exclude      https://myreadingmanga.info/yaoi-manga/*
// @exclude      https://myreadingmanga.info/manhwa/*
// @supportURL   https://github.com/NYT92/mrm-downloader
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myreadingmanga.info
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/507784/MRM%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/507784/MRM%20Downloader.meta.js
// ==/UserScript==

// THIS USERSCRIPT IS LICENSE UNDER THE GPLv3 License

(function () {
  "use strict";
  const title =
    document
      .querySelector(".entry-header h1.entry-title")
      ?.textContent.trim() || "Untitled";

  const imageDlBtn = document.createElement("button");
  imageDlBtn.id = "downloadImagesBtn";
  imageDlBtn.textContent = "Download Images (.zip)";
  imageDlBtn.style.cssText =
    "position: fixed; top: 10px; right: 10px; z-index: 9999;";

  const videoDlBtn = document.createElement("button");
  videoDlBtn.id = "downloadVideoBtn";
  videoDlBtn.textContent = "Download Video";
  videoDlBtn.style.cssText =
    "position: fixed; top: 10px; right: 10px; z-index: 9999;";

  const progressBar = document.createElement("div");
  progressBar.id = "downloadProgress";
  progressBar.style.cssText =
    "position: fixed; top:80px; right: 10px; width: 235px; right: 10px; height: 20px; background-color: #f0f0f0; display: none; z-index: 9999;";

  const progressInner = document.createElement("div");
  progressInner.style.cssText =
    "width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.5s;";
  progressBar.appendChild(progressInner);

  const progressText = document.createElement("div");
  progressText.style.cssText =
    "position: fixed; top: 105px; right: 10px; z-index: 9999; display: none;";
  progressText.textContent = "Preparing download...";

  const checkIfVid = document.querySelector(".entry-categories a");

  if (!checkIfVid) {
    console.log("no media found!");
  } else if (checkIfVid.textContent.includes("Video")) {
    document.body.appendChild(videoDlBtn);
  } else {
    document.body.appendChild(imageDlBtn);
  }
  document.body.appendChild(progressBar);
  document.body.appendChild(progressText);

  imageDlBtn.addEventListener("click", function () {
    imageDlBtn.disabled = true;
    imageDlBtn.textContent = "Downloading...";

    const images = document.querySelectorAll(".img-myreadingmanga");

    let imageSources = [];

    imageSources = Array.from(images)
      .map((img) => img.dataset.src)
      .filter(Boolean);

    if (imageSources.length === 0) {
      imageSources = Array.from(images)
        .map((img) => img.src)
        .filter(Boolean);
    }

    if (imageSources.length === 0) {
      const nestedImages = document.querySelectorAll(".img-myreadingmanga img");
      imageSources = Array.from(nestedImages)
        .map((img) => img.src || img.dataset.src)
        .filter(Boolean);
    }

    if (imageSources.length === 0) {
      alert(
        "No images found on this page. Check the console for debugging information."
      );
      imageDlBtn.disabled = false;
      imageDlBtn.textContent = "Download Images (.zip)";
      return;
    }

    const pageElement = document.querySelector(".post-page-numbers.current");
    const page = pageElement ? pageElement.textContent.trim() : "1";

    const zip = new JSZip();

    progressBar.style.display = "block";
    progressText.style.display = "block";
    progressInner.style.width = "0%";

    function getExtensionFromMimeType(mimeType) {
      const mimeToExt = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      return mimeToExt[mimeType] || "jpg";
    }

    function addImageToZip(src, index) {
      return new Promise((resolve, reject) => {
        progressText.textContent = `Downloading image ${index + 1} of ${
          imageSources.length
        }...`;
        GM_xmlhttpRequest({
          method: "GET",
          url: src,
          responseType: "arraybuffer",
          onload: function (response) {
            try {
              const arrayBuffer = response.response;
              const byteArray = new Uint8Array(arrayBuffer);
              const blob = new Blob([byteArray], {
                type: response.responseHeaders.match(/Content-Type: (.*)/i)[1],
              });
              const ext = getExtensionFromMimeType(blob.type);
              const fileName = `image_${index + 1}.${ext}`;
              zip.file(fileName, blob, { binary: true });
              console.log(
                `Added ${fileName} to ZIP (${blob.size} bytes, type: ${blob.type})`
              );
              const progress = ((index + 1) / imageSources.length) * 100;
              progressInner.style.width = `${progress}%`;
              resolve();
            } catch (error) {
              console.error(`Error processing ${src}:`, error);
              reject(error);
            }
          },
          onerror: function (error) {
            console.error(`Error fetching ${src}:`, error);
            reject(error);
          },
        });
      });
    }

    Promise.all(imageSources.map(addImageToZip))
      .then(() => {
        progressText.textContent = "Creating ZIP file...";
        return zip.generateAsync({ type: "blob" });
      })
      .then(function (content) {
        const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const fileName = `${safeTitle}_ch${page}.zip`;
        saveAs(content, fileName);
        console.log("ZIP file saved successfully");
        progressBar.style.display = "none";
        progressText.style.display = "none";
        imageDlBtn.disabled = false;
        imageDlBtn.textContent = "Download Images (.zip)";
      })
      .catch((error) => {
        console.error("Error creating ZIP file:", error);
        alert(
          "An error occurred while creating the ZIP file. Please check the console for details."
        );
        progressBar.style.display = "none";
        progressText.style.display = "none";
        imageDlBtn.disabled = false;
        imageDlBtn.textContent = "Download Images (.zip)";
      });
  });
  videoDlBtn.addEventListener("click", function () {
    videoDlBtn.disabled = true;
    videoDlBtn.textContent = "Downloading...";

    const videoElement = document.querySelector("#MRM_video > video > source");
    if (!videoElement) {
      alert("No video found on this page.");
      videoDlBtn.disabled = false;
      videoDlBtn.textContent = "Download Video";
      return;
    }

    const videoSrc = videoElement.src;
    if (!videoSrc) {
      alert("Unable to find video source.");
      videoDlBtn.disabled = false;
      videoDlBtn.textContent = "Download Video";
      return;
    }

    progressBar.style.display = "block";
    progressText.style.display = "block";
    progressText.textContent = "Starting video download...";
    progressInner.style.width = "0%";

    GM_xmlhttpRequest({
      method: "GET",
      url: videoSrc,
      responseType: "arraybuffer",
      onprogress: function (progress) {
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100;
          progressInner.style.width = percentComplete + "%";
          const downloadedMB = (progress.loaded / (1024 * 1024)).toFixed(2);
          const totalMB = (progress.total / (1024 * 1024)).toFixed(2);
          progressText.textContent = `Downloaded: ${downloadedMB}MB / ${totalMB}MB`;
        }
      },
      onload: function (response) {
        const blob = new Blob([response.response], { type: "video/mp4" });
        const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const fileName = `${safeTitle}.mp4`;
        saveAs(blob, fileName);
        console.log("Video downloaded successfully");
        progressBar.style.display = "none";
        progressText.style.display = "none";
        videoDlBtn.disabled = false;
        videoDlBtn.textContent = "Download Video";
      },
      onerror: function (error) {
        console.error("Error downloading video:", error);
        alert(
          "An error occurred while downloading the video. Please check the console for details."
        );
        progressBar.style.display = "none";
        progressText.style.display = "none";
        videoDlBtn.disabled = false;
        videoDlBtn.textContent = "Download Video";
      },
    });
  });
})();
