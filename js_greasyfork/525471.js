// ==UserScript==
// @name         Telegram Media Downloader (Improved)
// @name:zh-CN   Telegram图片视频下载器 (Improved)
// @version      1.4
// @namespace    Original: https://github.com/Neet-Nestor/Telegram-Media-Downloader
// @description  Download images, GIFs, videos, and voice messages on the Telegram webapp from private channels that disable downloading and restrict saving content
// @description:zh-cn 从禁止下载的Telegram频道中下载图片、视频及语音消息
// @author       Original: Nestor Qin, Update: Finomosec
// @license      GNU GPLv3
// @website      https://github.com/Neet-Nestor/Telegram-Media-Downloader
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @icon         https://img.icons8.com/color/452/telegram-app--v5.png
// @downloadURL https://update.greasyfork.org/scripts/525471/Telegram%20Media%20Downloader%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525471/Telegram%20Media%20Downloader%20%28Improved%29.meta.js
// ==/UserScript==

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    console.error("UNCAUGHT ERROR: " + errorMsg);
    return false;
};

(function () {
  const logger = {
    info: (message, fileName = null) => {
      // console.log(`[Tel Download] ${fileName ? `${fileName}: ` : ""}${message}`);
    },
    error: (message, fileName = null) => {
      console.error(
        `[Tel Download] ${fileName ? `${fileName}: ` : ""}${message}`
      );
    },
  };
  // Unicode values for icons (used in /k/ app)
  const DOWNLOAD_ICON = "\uE95A";
  const FORWARD_ICON = "\uE960";
  const contentRangeRegex = /^bytes (\d+)-(\d+)\/(\d+)$/;
  const REFRESH_DELAY = 500;
  const hashCode = (s) => {
    var h = 0,
      l = s.length,
      i = 0;
    if (l > 0) {
      while (i < l) {
        h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
      }
    }
    return h >>> 0;
  };

    const isDarkMode =
          document.querySelector("html").classList.contains("night") ||
          document.querySelector("html").classList.contains("theme-dark");

    const setQueued = (videoId, queued) => {
        const progressBar = document.getElementById("tel-downloader-progress-" + videoId);
        progressBar.classList.toggle("queued", queued);
        if (queued) {
            progressBar.querySelector(".progress div").style.backgroundColor = "lightgray";
            progressBar.querySelector(".progress div").style.width = "100%";
        } else {
            progressBar.querySelector(".progress div").style.width = "0%";
            progressBar.querySelector(".progress div").style.backgroundColor = "#6093B5";
        }
    };

    const createProgressBar = (videoId, fileName) => {
        const container = document.getElementById("tel-downloader-progress-bar-container");
        let innerContainer = document.getElementById("tel-downloader-progress-" + videoId)
        if (!innerContainer) {
            innerContainer = document.createElement("div");
            innerContainer.id = "tel-downloader-progress-" + videoId;
            innerContainer.classList.add("tel-downloader-progress");
            innerContainer.style.width = "20rem";
            innerContainer.style.marginTop = "0.4rem";
            innerContainer.style.padding = "0.6rem";
            innerContainer.style.backgroundColor = isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.6)";
            innerContainer.setAttribute("videoId", videoId);

            const flexContainer = document.createElement("div");
            flexContainer.style.display = "flex";
            flexContainer.style.justifyContent = "space-between";

            const title = document.createElement("p");
            title.className = "filename";
            title.style.margin = 0;
            title.style.color = "white";
            title.innerText = fileName;

            const closeButton = document.createElement("div");
            closeButton.style.cursor = "pointer";
            closeButton.style.fontSize = "1.2rem";
            closeButton.style.color = isDarkMode ? "#8a8a8a" : "white";
            closeButton.style.position = "absolute";
            closeButton.style.right = "4px";
            closeButton.innerHTML = "&times;";
            closeButton.onclick = function () {
                container.removeChild(innerContainer);
                checkResumeNextDownload();
            };

            const progressBar = document.createElement("div");
            progressBar.className = "progress";
            progressBar.style.backgroundColor = "#e2e2e2";
            progressBar.style.position = "relative";
            progressBar.style.width = "100%";
            progressBar.style.height = "1.6rem";
            progressBar.style.borderRadius = "2rem";
            progressBar.style.overflow = "hidden";

            const counter = document.createElement("p");
            counter.style.position = "absolute";
            counter.style.zIndex = 5;
            counter.style.left = "50%";
            counter.style.top = "50%";
            counter.style.transform = "translate(-50%, -50%)";
            counter.style.margin = 0;
            counter.style.color = "black";
            const progress = document.createElement("div");
            progress.style.position = "absolute";
            progress.style.height = "100%";
            progress.style.width = "0%";
            progress.style.backgroundColor = "#6093B5";

            progressBar.appendChild(counter);
            progressBar.appendChild(progress);
            flexContainer.appendChild(title);
            flexContainer.appendChild(closeButton);
            innerContainer.appendChild(flexContainer);
            innerContainer.appendChild(progressBar);
            container.appendChild(innerContainer);
        }

        const activeDownloads = Array.from(container.querySelectorAll(".tel-downloader-progress:not(.queued):not(.aborted)"));
        const queued = activeDownloads.length > 2;
        setQueued(videoId, queued);
        return innerContainer;
    };

    const checkResumeNextDownload = () => {
        const container = document.getElementById("tel-downloader-progress-bar-container");
        const activeDownloads = Array.from(container.querySelectorAll(".tel-downloader-progress:not(.queued):not(.aborted):not(.completed)"));
        if (activeDownloads.length < 2) {
            const nextDownload = container.querySelector(".tel-downloader-progress.queued");
            if (nextDownload) {
                const videoId = nextDownload.getAttribute("videoId");
                if (typeof nextDownload.resume === "function") {
                    setQueued(videoId, false);
                    nextDownload.resume();
                    delete nextDownload.resume;
                }
            }
        }
    };

  const updateProgress = (videoId, fileName, progress, url) => {
    const innerContainer = document.getElementById(
      "tel-downloader-progress-" + videoId
    );
    innerContainer.querySelector("p.filename").innerText = fileName;
    const progressBar = innerContainer.querySelector("div.progress");
    progressBar.querySelector("p").innerText = progress + "%";
    progressBar.querySelector("div").style.width = progress + "%";
    progressBar.setAttribute("tel-video-url", url);
  };

    const completeProgress = (videoId) => {
        const progressBar = document.getElementById("tel-downloader-progress-" + videoId);
        progressBar.classList.add("completed");
        progressBar.querySelector(".progress p").innerText = "Completed";
        progressBar.querySelector(".progress div").style.backgroundColor = "#B6C649";
        progressBar.querySelector(".progress div").style.width = "100%";
        window.setTimeout(() => {
            const innerContainer = document.getElementById("tel-downloader-progress-" + videoId);
            if (innerContainer) {
                innerContainer.parentElement.removeChild(innerContainer);
            }
        }, 10000);
        checkResumeNextDownload();
    };

    const retryDownload = (videoId) => {
        const progressBar = document
            .getElementById("tel-downloader-progress-" + videoId);
        if (!progressBar || !progressBar.classList.contains("aborted")) {
            return;
        }
        progressBar.classList.remove("aborted");
        progressBar.querySelector("div.progress div").style.backgroundColor = "#6093B5";
        const videoUrl = progressBar.getAttribute("tel-video-url");
        // console.log("Retrying download: " + videoUrl);
        tel_download_video(videoUrl, videoId);
    };

    const AbortProgress = (videoId) => {
        const progressBar = document
        .getElementById("tel-downloader-progress-" + videoId)
        .querySelector("div.progress");
        progressBar.classList.add("aborted");
        progressBar.querySelector("p").innerText = "Aborted";
        progressBar.querySelector("div").style.backgroundColor = "#D16666";
        progressBar.querySelector("div").style.width = "100%";
        const retryLink = document.createElement("a");
        retryLink.innerText = "retry";
        retryLink.style.marginLeft = "5px";
        retryLink.href = "javascript:void(0);";
        retryLink.onclick = () => { retryDownload(videoId); };
        progressBar.querySelector("p").appendChild(retryLink);
        window.setTimeout(() => retryDownload(videoId), 30000);
        checkResumeNextDownload();
    };

  const tel_download_video = (url, videoId) => {
    let _blobs = [];
    let _next_offset = 0;
    let _total_size = null;
    let _file_extension = "mp4";

    videoId = videoId || (Math.random() + 1).toString(36).substring(2, 10) + "_" + Date.now().toString();
    let fileName = hashCode(url).toString(36) + "." + _file_extension;

    // Some video src is in format:
    // 'stream/{"dcId":5,"location":{...},"size":...,"mimeType":"video/mp4","fileName":"xxxx.MP4"}'
    try {
      const metadata = JSON.parse(
        decodeURIComponent(url.split("/")[url.split("/").length - 1])
      );
      if (metadata.fileName) {
        fileName = metadata.fileName;
      }
    } catch (e) {
      // Invalid JSON string, pass extracting fileName
    }
    logger.info(`URL: ${url}`, fileName);

    const fetchNextPart = (_writable) => {
      fetch(url, {
        method: "GET",
        headers: {
          Range: `bytes=${_next_offset}-`,
        },
        "User-Agent":
          "User-Agent Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0",
      })
        .then((res) => {
          if (![200, 206].includes(res.status)) {
            throw new Error("Non 200/206 response was received: " + res.status);
          }
          const mime = res.headers.get("Content-Type").split(";")[0];
          if (!mime.startsWith("video/")) {
            throw new Error("Get non video response with MIME type " + mime);
          }
          _file_extension = mime.split("/")[1];
          fileName =
            fileName.substring(0, fileName.indexOf(".") + 1) + _file_extension;

          const match = res.headers
            .get("Content-Range")
            .match(contentRangeRegex);

          const startOffset = parseInt(match[1]);
          const endOffset = parseInt(match[2]);
          const totalSize = parseInt(match[3]);

          if (startOffset !== _next_offset) {
            logger.error("Gap detected between responses.", fileName);
            logger.info("Last offset: " + _next_offset, fileName);
            logger.info("New start offset " + match[1], fileName);
            throw "Gap detected between responses.";
          }
          if (_total_size && totalSize !== _total_size) {
            logger.error("Total size differs", fileName);
            throw "Total size differs";
          }

          _next_offset = endOffset + 1;
          _total_size = totalSize;

          logger.info(
            `Get response: ${res.headers.get(
              "Content-Length"
            )} bytes data from ${res.headers.get("Content-Range")}`,
            fileName
          );
          logger.info(
            `Progress: ${((_next_offset * 100) / _total_size).toFixed(0)}%`,
            fileName
          );
          updateProgress(
            videoId,
            fileName,
            ((_next_offset * 100) / _total_size).toFixed(0),
            url
          );
          return res.blob();
        })
        .then((resBlob) => {
          if (_writable !== null) {
            _writable.write(resBlob).then(() => {});
          } else {
            _blobs.push(resBlob);
          }
        })
        .then(() => {
          if (!_total_size) {
            throw new Error("_total_size is NULL");
          }

          if (_next_offset < _total_size) {
              const progressBar = document.getElementById("tel-downloader-progress-" + videoId)
              if (progressBar.classList.contains("queued")) {
                  progressBar.resume = () => fetchNextPart(_writable);
              } else {
                  fetchNextPart(_writable);
              }
          } else {
            if (_writable !== null) {
              _writable.close().then(() => {
                logger.info("Download finished", fileName);
              });
            } else {
              save();
            }
            completeProgress(videoId);
          }
        })
        .catch((reason) => {
          logger.error("Download failed: ", reason, fileName);
          AbortProgress(videoId);
        });
    };

    const save = () => {
      logger.info("Finish downloading blobs", fileName);
      logger.info("Concatenating blobs and downloading...", fileName);

      const blob = new Blob(_blobs, { type: "video/mp4" });
      const blobUrl = window.URL.createObjectURL(blob);

      logger.info("Final blob size: " + blob.size + " bytes", fileName);

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      logger.info("Download triggered", fileName);
    };

    const supportsFileSystemAccess =
      "showSaveFilePicker" in unsafeWindow &&
      (() => {
        try {
          return unsafeWindow.self === unsafeWindow.top;
        } catch {
          return false;
        }
      })();
        // console.log("supportsFileSystemAccess:", supportsFileSystemAccess);
    if (supportsFileSystemAccess) {
      unsafeWindow
        .showSaveFilePicker({
          suggestedName: fileName,
        })
        .then((handle) => {
          handle
            .createWritable()
            .then((writable) => {
              const progressBar = createProgressBar(videoId);
              // if (progressBar.getAttribute("queued") === "true") {
              //     progressBar.resume = () => fetchNextPart(writable);
              // } else {
                  fetchNextPart(writable);
              // }
            })
            .catch((err) => {
              console.error(err.name, err.message);
            });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err.name, err.message);
          }
        });
    } else {
      const progressBar = createProgressBar(videoId);
        // if (progressBar.getAttribute("queued") === "true") {
        //     progressBar.resume = () => fetchNextPart(null);
        // } else {
            fetchNextPart(null);
        // }
    }
  };

  const tel_download_audio = (url) => {
    let _blobs = [];
    let _next_offset = 0;
    let _total_size = null;
    const fileName = hashCode(url).toString(36) + ".ogg";

    const fetchNextPart = (_writable) => {
      fetch(url, {
        method: "GET",
        headers: {
          Range: `bytes=${_next_offset}-`,
        },
      })
        .then((res) => {
          if (res.status !== 206 && res.status !== 200) {
            logger.error(
              "Non 200/206 response was received: " + res.status,
              fileName
            );
            return;
          }

          const mime = res.headers.get("Content-Type").split(";")[0];
          if (!mime.startsWith("audio/")) {
            logger.error(
              "Get non audio response with MIME type " + mime,
              fileName
            );
            throw "Get non audio response with MIME type " + mime;
          }

          try {
            const match = res.headers
              .get("Content-Range")
              .match(contentRangeRegex);

            const startOffset = parseInt(match[1]);
            const endOffset = parseInt(match[2]);
            const totalSize = parseInt(match[3]);

            if (startOffset !== _next_offset) {
              logger.error("Gap detected between responses.");
              logger.info("Last offset: " + _next_offset);
              logger.info("New start offset " + match[1]);
              throw "Gap detected between responses.";
            }
            if (_total_size && totalSize !== _total_size) {
              logger.error("Total size differs");
              throw "Total size differs";
            }

            _next_offset = endOffset + 1;
            _total_size = totalSize;
          } finally {
            logger.info(
              `Get response: ${res.headers.get(
                "Content-Length"
              )} bytes data from ${res.headers.get("Content-Range")}`
            );
            return res.blob();
          }
        })
        .then((resBlob) => {
          if (_writable !== null) {
            _writable.write(resBlob).then(() => {});
          } else {
            _blobs.push(resBlob);
          }
        })
        .then(() => {
          if (_next_offset < _total_size) {
            fetchNextPart(_writable);
          } else {
            if (_writable !== null) {
              _writable.close().then(() => {
                logger.info("Download finished", fileName);
              });
            } else {
              save();
            }
          }
        })
        .catch((reason) => {
          logger.error(reason, fileName);
        });
    };

    const save = () => {
      logger.info(
        "Finish downloading blobs. Concatenating blobs and downloading...",
        fileName
      );

      let blob = new Blob(_blobs, { type: "audio/ogg" });
      const blobUrl = window.URL.createObjectURL(blob);

      logger.info("Final blob size in bytes: " + blob.size, fileName);

      blob = 0;

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      logger.info("Download triggered", fileName);
    };

    const supportsFileSystemAccess =
      "showSaveFilePicker" in unsafeWindow &&
      (() => {
        try {
          return unsafeWindow.self === unsafeWindow.top;
        } catch {
          return false;
        }
      })();
    if (supportsFileSystemAccess) {
      unsafeWindow
        .showSaveFilePicker({
          suggestedName: fileName,
        })
        .then((handle) => {
          handle
            .createWritable()
            .then((writable) => {
              fetchNextPart(writable);
            })
            .catch((err) => {
              console.error(err.name, err.message);
            });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err.name, err.message);
          }
        });
    } else {
      fetchNextPart(null);
    }
  };

  const tel_download_image = (imageUrl) => {
    const fileName =
      (Math.random() + 1).toString(36).substring(2, 10) + ".jpeg"; // assume jpeg

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = imageUrl;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);

    logger.info("Download triggered", fileName);
  };

  logger.info("Initialized");

  // For webz /a/ webapp
  setInterval(() => {
    // Stories
    const storiesContainer = document.getElementById("StoryViewer");
    if (storiesContainer) {
      console.log("storiesContainer");
      const createDownloadButton = () => {
        console.log("createDownloadButton");
        const downloadIcon = document.createElement("i");
        downloadIcon.className = "icon icon-download";
        const downloadButton = document.createElement("button");
        downloadButton.className =
          "Button TkphaPyQ tiny translucent-white round tel-download";
        downloadButton.appendChild(downloadIcon);
        downloadButton.setAttribute("type", "button");
        downloadButton.setAttribute("title", "Download");
        downloadButton.setAttribute("aria-label", "Download");
        downloadButton.onclick = () => {
          // 1. Story with video
          const video = storiesContainer.querySelector("video");
          const videoSrc =
            video?.src ||
            video?.currentSrc ||
            video?.querySelector("source")?.src;
          if (videoSrc) {
            tel_download_video(videoSrc);
          } else {
            // 2. Story with image
            const images = storiesContainer.querySelectorAll("img.PVZ8TOWS");
            if (images.length > 0) {
              const imageSrc = images[images.length - 1]?.src;
              if (imageSrc) tel_download_image(imageSrc);
            }
          }
        };
        return downloadButton;
      };

      const storyHeader =
        storiesContainer.querySelector(".GrsJNw3y") ||
        storiesContainer.querySelector(".DropdownMenu").parentNode;
      if (storyHeader && !storyHeader.querySelector(".tel-download")) {
        console.log("storyHeader");
        storyHeader.insertBefore(
          createDownloadButton(),
          storyHeader.querySelector("button")
        );
      }
    }

    // All media opened are located in .media-viewer-movers > .media-viewer-aspecter
    const mediaContainer = document.querySelector(
      "#MediaViewer .MediaViewerSlide--active"
    );
    const mediaViewerActions = document.querySelector(
      "#MediaViewer .MediaViewerActions"
    );
    if (!mediaContainer || !mediaViewerActions) return;

    // Videos in channels
    const videoPlayer = mediaContainer.querySelector(
      ".MediaViewerContent > .VideoPlayer"
    );
    const img = mediaContainer.querySelector(".MediaViewerContent > div > img");
    // 1. Video player detected - Video or GIF
    // container > .MediaViewerSlides > .MediaViewerSlide > .MediaViewerContent > .VideoPlayer > video[src]
    const downloadIcon = document.createElement("i");
    downloadIcon.className = "icon icon-download";
    const downloadButton = document.createElement("button");
    downloadButton.className =
      "Button smaller translucent-white round tel-download";
    downloadButton.setAttribute("type", "button");
    downloadButton.setAttribute("title", "Download");
    downloadButton.setAttribute("aria-label", "Download");
    if (videoPlayer) {
      const videoUrl = videoPlayer.querySelector("video").currentSrc;
      downloadButton.setAttribute("data-tel-download-url", videoUrl);
      downloadButton.appendChild(downloadIcon);
      downloadButton.onclick = () => {
        tel_download_video(videoPlayer.querySelector("video").currentSrc);
      };

      // Add download button to video controls
      const controls = videoPlayer.querySelector(".VideoPlayerControls");
      if (controls) {
        const buttons = controls.querySelector(".buttons");
        if (!buttons.querySelector("button.tel-download")) {
          const spacer = buttons.querySelector(".spacer");
          spacer.after(downloadButton);
        }
      }

      // Add/Update/Remove download button to topbar
      if (mediaViewerActions.querySelector("button.tel-download")) {
        const telDownloadButton = mediaViewerActions.querySelector(
          "button.tel-download"
        );
        if (
          mediaViewerActions.querySelectorAll('button[title="Download"]')
            .length > 1
        ) {
          // There's existing download button, remove ours
          mediaViewerActions.querySelector("button.tel-download").remove();
        } else if (
          telDownloadButton.getAttribute("data-tel-download-url") !== videoUrl
        ) {
          // Update existing button
          telDownloadButton.onclick = () => {
            tel_download_video(videoPlayer.querySelector("video").currentSrc);
          };
          telDownloadButton.setAttribute("data-tel-download-url", videoUrl);
        }
      } else if (
        !mediaViewerActions.querySelector('button[title="Download"]')
      ) {
        // Add the button if there's no download button at all
        mediaViewerActions.prepend(downloadButton);
      }
    } else if (img && img.src) {
      downloadButton.setAttribute("data-tel-download-url", img.src);
      downloadButton.appendChild(downloadIcon);
      downloadButton.onclick = () => {
        tel_download_image(img.src);
      };

      // Add/Update/Remove download button to topbar
      if (mediaViewerActions.querySelector("button.tel-download")) {
        const telDownloadButton = mediaViewerActions.querySelector(
          "button.tel-download"
        );
        if (
          mediaViewerActions.querySelectorAll('button[title="Download"]')
            .length > 1
        ) {
          // There's existing download button, remove ours
          mediaViewerActions.querySelector("button.tel-download").remove();
        } else if (
          telDownloadButton.getAttribute("data-tel-download-url") !== img.src
        ) {
          // Update existing button
          telDownloadButton.onclick = () => {
            tel_download_image(img.src);
          };
          telDownloadButton.setAttribute("data-tel-download-url", img.src);
        }
      } else if (
        !mediaViewerActions.querySelector('button[title="Download"]')
      ) {
        // Add the button if there's no download button at all
        mediaViewerActions.prepend(downloadButton);
      }
    }
  }, REFRESH_DELAY);

  // For webk /k/ webapp
  setInterval(() => {
    /* Voice Message */
    const pinnedAudio = document.body.querySelector(".pinned-audio");
    let dataMid;
    let downloadButtonPinnedAudio =
      document.body.querySelector("._tel_download_button_pinned_container") ||
      document.createElement("button");
    if (pinnedAudio) {
      dataMid = pinnedAudio.getAttribute("data-mid");
      downloadButtonPinnedAudio.className =
        "btn-icon tgico-download _tel_download_button_pinned_container";
      downloadButtonPinnedAudio.innerHTML = `<span class="tgico button-icon">${DOWNLOAD_ICON}</span>`;
    }
    const voiceMessages = document.body.querySelectorAll("audio-element");
    voiceMessages.forEach((voiceMessage) => {
      const bubble = voiceMessage.closest(".bubble");
      if (
        !bubble ||
        bubble.querySelector("._tel_download_button_pinned_container")
      ) {
        return; /* Skip if there's already a download button */
      }
      if (
        dataMid &&
        downloadButtonPinnedAudio.getAttribute("data-mid") !== dataMid &&
        voiceMessage.getAttribute("data-mid") === dataMid
      ) {
        downloadButtonPinnedAudio.onclick = (e) => {
          e.stopPropagation();
          tel_download_audio(link);
        };
        downloadButtonPinnedAudio.setAttribute("data-mid", dataMid);
        const link =
          voiceMessage.audio && voiceMessage.audio.getAttribute("src");
        if (link) {
          pinnedAudio
            .querySelector(".pinned-container-wrapper-utils")
            .appendChild(downloadButtonPinnedAudio);
        }
      }
    });

    // Stories
    const storiesContainer = document.getElementById("stories-viewer");
    if (storiesContainer) {
      const createDownloadButton = () => {
        const downloadButton = document.createElement("button");
        downloadButton.className = "btn-icon rp tel-download";
        downloadButton.innerHTML = `<span class="tgico">${DOWNLOAD_ICON}</span><div class="c-ripple"></div>`;
        downloadButton.setAttribute("type", "button");
        downloadButton.setAttribute("title", "Download");
        downloadButton.setAttribute("aria-label", "Download");
        downloadButton.onclick = () => {
          // 1. Story with video
          const video = storiesContainer.querySelector("video.media-video");
          const videoSrc =
            video?.src ||
            video?.currentSrc ||
            video?.querySelector("source")?.src;
          if (videoSrc) {
            tel_download_video(videoSrc);
          } else {
            // 2. Story with image
            const imageSrc =
              storiesContainer.querySelector("img.media-photo")?.src;
            if (imageSrc) tel_download_image(imageSrc);
          }
        };
        return downloadButton;
      };

      const storyHeader = storiesContainer.querySelector(
        "[class^='_ViewerStoryHeaderRight']"
      );
      if (storyHeader && !storyHeader.querySelector(".tel-download")) {
        storyHeader.prepend(createDownloadButton());
      }

      const storyFooter = storiesContainer.querySelector(
        "[class^='_ViewerStoryFooterRight']"
      );
      if (storyFooter && !storyFooter.querySelector(".tel-download")) {
        storyFooter.prepend(createDownloadButton());
      }
    }

    // All media opened are located in .media-viewer-movers > .media-viewer-aspecter
    const mediaContainer = document.querySelector(".media-viewer-whole");
    if (!mediaContainer) return;
    const mediaAspecter = mediaContainer.querySelector(
      ".media-viewer-movers .media-viewer-aspecter"
    );
    const mediaButtons = mediaContainer.querySelector(
      ".media-viewer-topbar .media-viewer-buttons"
    );
    if (!mediaAspecter || !mediaButtons) return;

    // Query hidden buttons and unhide them
    const hiddenButtons = mediaButtons.querySelectorAll("button.btn-icon.hide");
    let onDownload = null;
    for (const btn of hiddenButtons) {
      btn.classList.remove("hide");
      if (btn.textContent === FORWARD_ICON) {
        btn.classList.add("tgico-forward");
      }
      if (btn.textContent === DOWNLOAD_ICON) {
        btn.classList.add("tgico-download");
        // Use official download buttons
        onDownload = () => {
          btn.click();
        };
        logger.info("onDownload", onDownload);
      }
    }

    if (mediaAspecter.querySelector(".ckin__player")) {
      // 1. Video player detected - Video and it has finished initial loading
      // container > .ckin__player > video[src]

      // add download button to videos
      const controls = mediaAspecter.querySelector(
        ".default__controls.ckin__controls"
      );
      if (controls && !controls.querySelector(".tel-download")) {
        const brControls = controls.querySelector(
          ".bottom-controls .right-controls"
        );
        const downloadButton = document.createElement("button");
        downloadButton.className =
          "btn-icon default__button tgico-download tel-download";
        downloadButton.innerHTML = `<span class="tgico">${DOWNLOAD_ICON}</span>`;
        downloadButton.setAttribute("type", "button");
        downloadButton.setAttribute("title", "Download");
        downloadButton.setAttribute("aria-label", "Download");
        if (onDownload) {
          downloadButton.onclick = onDownload;
        } else {
          downloadButton.onclick = () => {
            tel_download_video(mediaAspecter.querySelector("video").src);
          };
        }
        brControls.prepend(downloadButton);
      }
    } else if (
      mediaAspecter.querySelector("video") &&
      mediaAspecter.querySelector("video") &&
      !mediaButtons.querySelector("button.btn-icon.tgico-download")
    ) {
      // 2. Video HTML element detected, could be either GIF or unloaded video
      // container > video[src]
      const downloadButton = document.createElement("button");
      downloadButton.className = "btn-icon tgico-download tel-download";
      downloadButton.innerHTML = `<span class="tgico button-icon">${DOWNLOAD_ICON}</span>`;
      downloadButton.setAttribute("type", "button");
      downloadButton.setAttribute("title", "Download");
      downloadButton.setAttribute("aria-label", "Download");
      if (onDownload) {
        downloadButton.onclick = onDownload;
      } else {
        downloadButton.onclick = () => {
          tel_download_video(mediaAspecter.querySelector("video").src);
        };
      }
      mediaButtons.prepend(downloadButton);
    } else if (!mediaButtons.querySelector("button.btn-icon.tgico-download")) {
      // 3. Image without download button detected
      // container > img.thumbnail
      if (
        !mediaAspecter.querySelector("img.thumbnail") ||
        !mediaAspecter.querySelector("img.thumbnail").src
      ) {
        return;
      }
      const downloadButton = document.createElement("button");
      downloadButton.className = "btn-icon tgico-download tel-download";
      downloadButton.innerHTML = `<span class="tgico button-icon">${DOWNLOAD_ICON}</span>`;
      downloadButton.setAttribute("type", "button");
      downloadButton.setAttribute("title", "Download");
      downloadButton.setAttribute("aria-label", "Download");
      if (onDownload) {
        downloadButton.onclick = onDownload;
      } else {
        downloadButton.onclick = () => {
          tel_download_image(mediaAspecter.querySelector("img.thumbnail").src);
        };
      }
      mediaButtons.prepend(downloadButton);
    }
  }, REFRESH_DELAY);

  // Progress bar container setup
  (function setupProgressBar() {
    const body = document.querySelector("body");
    const container = document.createElement("div");
    container.id = "tel-downloader-progress-bar-container";
    container.style.position = "fixed";
    container.style.bottom = "100px";
    container.style.top = "56px";
    container.style.overflow = "auto";
    container.style.right = 0;
    if (location.pathname.startsWith("/k/")) {
      container.style.zIndex = 4;
    } else {
      container.style.zIndex = 1600;
    }
    body.appendChild(container);
  })();

  logger.info("Completed script setup.");
})();
