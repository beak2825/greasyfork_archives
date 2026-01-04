// ==UserScript==
// @name         Determine X Image
// @namespace    atk-def
// @version      1.2.1
// @description  Retrieve the original image dimensions and download request in X (Twitter).
// @author       Ayane
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @license      MIT
// @icon         https://www.gstatic.com/android/keyboard/emojikitchen/20230127/u1f307/u1f307_u1f4f0.png?fbx
// @downloadURL https://update.greasyfork.org/scripts/476551/Determine%20X%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/476551/Determine%20X%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const toolbarStyles = {
  display: "none",
  position: "absolute",
  margin: "1rem",
  top: 0,
  left: 0,
  gap: "0.5rem",
  alignItems: "center",
};

const commonStyles = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  color: "white",
  backdropFilter: "blur(1rem)",
  borderRadius: "5rem",
};

const imageSizeLabelStyles = {
  textAlign: "center",
  fontSize: "0.75rem",
  fontWeight: "bold",
  padding: "0.5rem 0.75rem",
  pointerEvents: "none",
  ...commonStyles,
};

const iconBtnStyles = {
  width: "2rem",
  height: "2rem",
  border: 0,
  outline: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  ...commonStyles,
};

(() => {
  "use strict";

  const toolbar = document.createElement("div");
  const imageSizeLabel = document.createElement("span");
  const downloadBtn = document.createElement("button");
  const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11 4h2v8h2v2h-2v2h-2v-2H9v-2h2V4zm-2 8H7v-2h2v2zm6 0v-2h2v2h-2zM4 18h16v2H4v-2z"/></svg>`;
  downloadBtn.innerHTML = downloadIcon;

  toolbar.appendChild(imageSizeLabel);
  toolbar.appendChild(downloadBtn);

  const downloadImage = async (sourceURL) => {
    const image = await fetch(sourceURL);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);

    const url = new URL(sourceURL);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const fileName = parts.at(-1);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = fileName;
    link.click();
  };

  const makeImageSizeText = (width, height) => `${width} × ${height}`;
  const createStyleUpdater = (element) => (styles) =>
    Object.assign(element.style, styles);

  const updateToolbarStyles = createStyleUpdater(toolbar);
  const updateImageSizeLabelStyles = createStyleUpdater(imageSizeLabel);
  const updateDownloadBtnStyles = createStyleUpdater(downloadBtn);

  updateToolbarStyles(toolbarStyles);
  updateImageSizeLabelStyles(imageSizeLabelStyles);
  updateDownloadBtnStyles(iconBtnStyles);

  downloadBtn.addEventListener("mouseover", () => {
    updateDownloadBtnStyles({ filter: "brightness(0.9)" });
  });

  downloadBtn.addEventListener("mouseout", () => {
    updateDownloadBtnStyles({ filter: "unset" });
  });

  document.body.addEventListener("mouseover", async (event) => {
    if (event.target.tagName === "IMG") {
      const image = event.target;
      const imageURL = image.src;

      const lastSlashIndex = imageURL.lastIndexOf("/");
      const filename = imageURL.substring(lastSlashIndex + 1);
      const lastDotIndex = filename.lastIndexOf(".");
      const fileExtension = filename.substring(lastDotIndex + 1);

      if (fileExtension === "svg") {
        return;
      }

      image.parentNode.appendChild(toolbar);

      const queryName = "name";
      const newValue = "orig";
      const regex = new RegExp(`([?&])${queryName}=([^&]*)`, "i");
      const originImageURL = imageURL.replace(
        regex,
        `$1${queryName}=${newValue}`
      );
      const originImage = new Image();
      originImage.src = originImageURL;

      await new Promise((resolve) => {
        originImage.onload = () => {
          const originImageWidth = originImage.naturalWidth;
          const originImageHeight = originImage.naturalHeight;
          imageSizeLabel.textContent = makeImageSizeText(
            originImageWidth,
            originImageHeight
          );
          resolve();
        };
      });

      downloadBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(originImageURL);
      };

      updateToolbarStyles({ display: "flex" });
    }
  });

  document.body.addEventListener("mouseout", (event) => {
    if (
      event.target.tagName === "IMG" &&
      event.relatedTarget !== toolbar &&
      !toolbar.contains(event.relatedTarget)
    ) {
      updateToolbarStyles({ display: "none" });
    }
  });
})();
