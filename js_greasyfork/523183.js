// ==UserScript==
// @name         Hulu.jp Subtitle Downloader
// @namespace    https://hulu.jp
// @version      2.0.0
// @description  Download subtitle guides from Hulu.jp in VTT format
// @author       Ronny
// @match        https://*.hulu.jp/watch/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523183/Hulujp%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523183/Hulujp%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  // Functions
  const createButton = (text, marginInlineStart = "0") => {
    const btn = document.createElement("button");
    btn.innerHTML = text;
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.backgroundColor = "#889188";
    btn.style.color = "#fefffe";
    btn.style.padding = "1em 1.5em";
    btn.style.lineHeight = "1";
    btn.style.fontSize = "0.8em";
    btn.style.marginInlineStart = marginInlineStart;
    btn.addEventListener("mouseover", () => (btn.style.opacity = "0.8"));
    btn.addEventListener("mouseout", () => (btn.style.opacity = "1"));
    return btn;
  };

  const appendButton = (button, parent) => {
    if (!parent.contains(button)) {
      parent.appendChild(button);
    }
  };

  const button = createButton("字幕ガイドをダウンロード");
  const batchButton = createButton(
    "最終話までの字幕ガイドをダウンロード",
    "1em"
  );

  let subSrc = "";

  const downloadSubtitle = (subSrc, fileName) => {
    if (!subSrc) {
      console.error("No subtitle track found.");
      return;
    }

    fetch(subSrc)
      .then((response) => response.text())
      .then((data) => {
        const blob = new Blob([data], { type: "text/vtt" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Failed to download subtitle:", error);
      });
  };
  button.onclick = () => {
    const pageTitle = document.title;
    const fileName = pageTitle.split(" | ")[0].trim() + ".vtt";
    downloadSubtitle(subSrc, fileName);
  };

  const startBatchDownload = () => {
    if (
      window.confirm(
        `下载过程中请在播放器上滑动鼠标以激活下一集按钮。
      While downloading, please hover over the player to activate the next episode button.
      ダウンロード中は、プレーヤーにマウスを重ねて次のエピソードボタンをアクティブにしてください。`
      )
    ) {
      const subSrcList = [];
      // For the current episode
      pushSubtitleSrc(subSrcList, subSrc);
      // Fetch next episode
      fetchNextEpisode(subSrcList);
    }
  };
  batchButton.onclick = startBatchDownload;

  const fetchNextEpisode = (subSrcList) => {
    const nextButton = document.querySelector('[aria-label="次の動画"]');
    if (nextButton && !nextButton.classList.contains("disabled")) {
      setTimeout(() => {
        pushSubtitleSrc(subSrcList, subSrc);
        fetchNextEpisode(subSrcList);
      }, 5000);
      nextButton.click();
    } else {
      setTimeout(() => {
        downloadAllSubtitles(subSrcList);
      }, 5000);
    }
  };

  const pushSubtitleSrc = (subSrcList, subSrc) => {
    if (subSrc) {
      const pageTitle = document.title;
      const fileName = pageTitle.split(" | ")[0].trim() + ".vtt";
      subSrcList.push({ src: subSrc, name: fileName });
      console.log("Added subtitle track for", fileName);
    }
  };

  const downloadAllSubtitles = (subSrcList) => {
    if (subSrcList.length === 0) {
      console.error("No subtitle tracks found.");
      return;
    }

    const zip = new JSZip();
    let count = 0;

    subSrcList.forEach(({ src, name }) => {
      fetch(src)
        .then((response) => response.text())
        .then((data) => {
          zip.file(`${name}`, data);
          count++;
          if (count === subSrcList.length) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              const pageTitle = document.title;
              const batchName = pageTitle.split("第")[0].trim();
              const url = URL.createObjectURL(content);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${batchName}.zip`;
              a.click();
              URL.revokeObjectURL(url);
            });
          }
        })
        .catch((error) => {
          console.error("Failed to download subtitle:", error);
        });
    });
  };

  // Override XMLHttpRequest open method
  const handleXhrLoad = (response) => {
    try {
      const targetTrack = response.tracks.find(
        (track) => track.label === "字幕ガイド"
      );

      if (targetTrack) {
        const src = targetTrack.src;
        console.log("Found subtitle track, src:", src);
        subSrc = src;
        // Create buttons
        const titlePanel =
          document.getElementsByClassName("watch-info-title")[0];
        appendButton(button, titlePanel);
        appendButton(batchButton, titlePanel);
      } else {
        console.log("No subtitle track found.");
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
    }
  };
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener("load", function () {
      if (url.startsWith("https://playback.prod.hjholdings.tv/session/open")) {
        handleXhrLoad(this.response);
      }
    });
    originalXhrOpen.apply(this, [method, url, ...rest]);
  };
})();
