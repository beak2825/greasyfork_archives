// ==UserScript==
// @name            Telegram +
// @name:en         Telegram +
// @namespace       by
// @version         1.4
// @author          diorhc
// @description     Видео, истории и скачивание файлов и другие функции ↴
// @description:en  Telegram Downloader and others features ↴
// @match           https://web.telegram.org/*
// @match           https://webk.telegram.org/*
// @match           https://webz.telegram.org/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/537433/Telegram%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/537433/Telegram%20%2B.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // --- Window reference handling ---
  const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  // --- Logger Utility ---
  const logger = {
    info: (msg, file = "") =>
      console.log(`[Tel Download]${file ? ` ${file}:` : ""} ${msg}`),
    error: (msg, file = "") =>
      console.error(`[Tel Download]${file ? ` ${file}:` : ""} ${msg}`),
    warn: (msg, file = "") =>
      console.warn(`[Tel Download]${file ? ` ${file}:` : ""} ${msg}`),
  };

  // --- Notification System ---
  const MAX_NOTIFICATIONS = 5; // Limit simultaneous notifications

  /**
   * Show user-visible notification toast
   * @param {string} message - Message to display
   * @param {string} type - Type: 'info', 'error', 'success', 'warning'
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  function showNotification(message, type = "info", duration = 3000) {
    try {
      const container = document.getElementById("tel-notification-container");
      if (!container) {
        const newContainer = document.createElement("div");
        newContainer.id = "tel-notification-container";
        Object.assign(newContainer.style, {
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: "10001",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        });
        document.body.appendChild(newContainer);
        return showNotification(message, type, duration);
      }

      // Remove oldest notifications if limit exceeded
      const existingNotifications = container.children;
      if (existingNotifications.length >= MAX_NOTIFICATIONS) {
        const oldest = existingNotifications[0];
        if (oldest) oldest.remove();
      }

      const notification = document.createElement("div");
      const colors = {
        info: { bg: "rgba(33, 150, 243, 0.95)", border: "#2196F3" },
        error: { bg: "rgba(244, 67, 54, 0.95)", border: "#f44336" },
        success: { bg: "rgba(76, 175, 80, 0.95)", border: "#4CAF50" },
        warning: { bg: "rgba(255, 152, 0, 0.95)", border: "#FF9800" },
      };
      const color = colors[type] || colors.info;

      // Glassmorphism style: translucent blurred background with colored accent
      const isDarkTheme = getTheme();

      Object.assign(notification.style, {
        backgroundColor: isDarkTheme
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.7)",
        color: isDarkTheme ? "#eaeaea" : "#111",
        padding: "12px 16px",
        borderRadius: "12px",
        border: isDarkTheme
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(255,255,255,0.6)",
        boxShadow: isDarkTheme
          ? "0 6px 24px rgba(0,0,0,0.6)"
          : "0 6px 24px rgba(16,24,40,0.12)",
        fontSize: "14px",
        fontWeight: "600",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        animation: "tel-slideIn 360ms cubic-bezier(.2,.9,.2,1)",
        cursor: "pointer",
        wordWrap: "break-word",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        overflow: "hidden",
        position: "relative",
      });

      // Add a colored left accent to indicate type
      const accent = document.createElement("span");
      Object.assign(accent.style, {
        width: "6px",
        height: "100%",
        borderRadius: "4px",
        flex: "0 0 6px",
        background: color.border,
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.08)",
      });
      notification.prepend(accent);

      // Add message text
      const messageText = document.createElement("span");
      messageText.textContent = message;
      notification.appendChild(messageText);

      // Add accessibility
      notification.setAttribute("role", type === "error" ? "alert" : "status");
      notification.setAttribute(
        "aria-live",
        type === "error" ? "assertive" : "polite"
      );
      notification.setAttribute("aria-atomic", "true");
      notification.tabIndex = 0;

      notification.onclick = () => notification.remove();
      notification.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          e.preventDefault();
          notification.remove();
        }
      };

      // Add animation styles if not present
      if (!document.getElementById("tel-notification-styles")) {
        const style = document.createElement("style");
        style.id = "tel-notification-styles";
        style.textContent = `
          @keyframes tel-slideIn {
            from { transform: translateX(16px) scale(.98); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes tel-slideOut {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(10px) scale(.98); opacity: 0; }
          }
          #tel-notification-container div {
            will-change: transform, opacity;
          }
        `;
        document.head.appendChild(style);
      }

      container.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => notification.remove(), 300);
      }, duration);
    } catch (error) {
      logger.error(`Failed to show notification: ${error.message}`);
    }
  }

  // --- Constants ---
  const DOWNLOAD_ICON = "\uE95A";
  const FORWARD_ICON = "\u2191";
  const contentRangeRegex = /^bytes (\d+)-(\d+)\/(\d+)$/;
  const REFRESH_DELAY = 500;

  // --- Theme Detection Cache ---
  let cachedIsDark =
    document.documentElement.classList.contains("night") ||
    document.documentElement.classList.contains("theme-dark");

  const getTheme = () => cachedIsDark;

  // Update theme cache when theme changes
  const themeObserver = new MutationObserver(() => {
    const newIsDark =
      document.documentElement.classList.contains("night") ||
      document.documentElement.classList.contains("theme-dark");
    if (newIsDark !== cachedIsDark) {
      cachedIsDark = newIsDark;
      logger.info(`Theme changed to: ${cachedIsDark ? "dark" : "light"}`);
    }
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // --- MIME Type Configuration ---
  const SUPPORTED_MIMES = {
    video: {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/ogg": "ogv",
      "video/quicktime": "mov",
      "video/x-matroska": "mkv",
      "video/mpeg": "mpeg",
      "video/x-msvideo": "avi",
    },
    audio: {
      "audio/ogg": "ogg",
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/x-m4a": "m4a",
      "audio/wav": "wav",
      "audio/webm": "weba",
      "audio/aac": "aac",
      "audio/flac": "flac",
    },
    image: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
    },
  };

  /**
   * Get file extension from MIME type
   * @param {string} mimeType - MIME type string
   * @param {string} defaultExt - Default extension if MIME not found
   * @returns {string} File extension
   */
  const getExtensionFromMime = (mimeType, defaultExt = "bin") => {
    const mime = mimeType.split(";")[0].trim().toLowerCase();
    for (const category of Object.values(SUPPORTED_MIMES)) {
      if (category[mime]) return category[mime];
    }
    // Try to extract from MIME type if not in our list
    const parts = mime.split("/");
    if (parts.length === 2 && parts[1]) {
      return parts[1].replace(/^x-/, "");
    }
    return defaultExt;
  };

  /**
   * Validate if MIME type is of expected category
   * @param {string} mimeType - MIME type to validate
   * @param {string} category - Expected category ('video', 'audio', 'image')
   * @returns {boolean} True if valid
   */
  const isValidMimeType = (mimeType, category) => {
    const mime = mimeType.split(";")[0].trim().toLowerCase();
    if (SUPPORTED_MIMES[category] && SUPPORTED_MIMES[category][mime]) {
      return true;
    }
    // Fallback: check if starts with category
    return mime.startsWith(`${category}/`);
  };

  // --- Download Manager ---
  const activeDownloads = new Map(); // Stores AbortController for each download

  /**
   * Safely set button icon content without using innerHTML (Trusted Types friendly).
   * @param {HTMLElement} button - Target button element.
   * @param {string} iconChar - Icon character to display.
   * @param {string} className - Space separated class list for the icon span.
   * @param {HTMLElement[]} extras - Extra nodes appended after the icon span.
   */
  const setButtonIconContent = (
    button,
    iconChar,
    className = "tgico",
    extras = []
  ) => {
    try {
      button.replaceChildren();
      const iconSpan = document.createElement("span");
      iconSpan.className = className;
      iconSpan.textContent = iconChar;
      button.appendChild(iconSpan);
      extras.forEach((node) => {
        if (node instanceof HTMLElement) button.appendChild(node);
      });
      return iconSpan;
    } catch (error) {
      logger.error(`Failed to set button icon: ${error.message}`);
      return null;
    }
  };

  // --- Utility Functions ---
  /**
   * Generate a hash code from a string
   * @param {string} s - Input string to hash
   * @returns {number} Hash code
   */
  const hashCode = (s) =>
    Array.from(s).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0) >>>
    0;

  /**
   * Debounce function to limit execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /**
   * Extract a better filename from URL or metadata
   * @param {string} url - The URL to extract filename from
   * @param {string} defaultExt - Default file extension
   * @returns {string} Extracted filename
   */
  const extractFileName = (url, defaultExt = "mp4") => {
    try {
      // Try to extract from metadata in URL
      const meta = JSON.parse(decodeURIComponent(url.split("/").pop()));
      if (meta.fileName) return meta.fileName;
    } catch {}

    // Try to extract from URL path
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart.includes(".")) {
        return lastPart;
      }
    } catch {}

    // Fallback to hash-based name
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    return `telegram_${timestamp}_${hashCode(url).toString(36)}.${defaultExt}`;
  };

  // --- Progress Bar ---
  /**
   * Create a progress bar for download tracking
   * @param {string} videoId - Unique identifier for the video
   * @param {string} fileName - Name of the file being downloaded
   */
  function createProgressBar(videoId, fileName) {
    try {
      const isDark = getTheme();
      const container = document.getElementById(
        "tel-downloader-progress-bar-container"
      );
      if (!container) {
        logger.warn("Progress bar container not found");
        return;
      }

      const inner = document.createElement("div");
      inner.id = `tel-downloader-progress-${videoId}`;
      // Glassmorphism container
      Object.assign(inner.style, {
        width: "20rem",
        marginTop: "0.4rem",
        padding: "0.6rem",
        borderRadius: "12px",
        backgroundColor: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(255,255,255,0.6)",
        boxShadow: isDark
          ? "0 8px 30px rgba(0,0,0,0.6)"
          : "0 8px 30px rgba(16,24,40,0.08)",
      });

      const flex = document.createElement("div");
      Object.assign(flex.style, {
        display: "flex",
        justifyContent: "space-between",
      });

      const title = document.createElement("p");
      title.className = "filename";
      title.style.margin = 0;
      title.style.color = isDark ? "#eaeaea" : "#111";
      title.style.fontWeight = "600";
      title.textContent = fileName;

      const panel = document.createElement("div");
      // Use cached theme to adapt panel appearance
      const isDarkPanel = getTheme();
      Object.assign(panel.style, {
        // Glassmorphism panel
        backgroundColor: isDarkPanel
          ? "rgba(18,20,24,0.75)" /* slightly darker in dark theme */
          : "rgba(255,255,255,0.75)",
        color: isDarkPanel ? "#eaeaea" : "var(--primary-text-color, #000)",
        padding: "24px",
        borderRadius: "12px",
        maxWidth: "500px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        backdropFilter: "blur(12px) saturate(130%)",
        WebkitBackdropFilter: "blur(12px) saturate(130%)",
        border: isDarkPanel
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(255,255,255,0.6)",
        boxShadow: isDarkPanel
          ? "0 12px 48px rgba(0,0,0,0.6)"
          : "0 12px 48px rgba(16,24,40,0.12)",
      });
      close.tabIndex = 0;

      const cancelDownload = () => {
        // Cancel the download if it's still active
        if (activeDownloads.has(videoId)) {
          try {
            activeDownloads.get(videoId).abort();
          } catch (e) {}
          activeDownloads.delete(videoId);
          logger.info(`Download cancelled by user: ${fileName}`);
          showNotificationIfEnabled(
            `Download cancelled: ${fileName}`,
            "warning"
          );
        }
        if (container.contains(inner)) container.removeChild(inner);
      };

      close.onclick = cancelDownload;
      close.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cancelDownload();
        }
      };

      const progressBar = document.createElement("div");
      progressBar.className = "progress";
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-label", `Downloading ${fileName}`);
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", "100");
      progressBar.setAttribute("aria-valuenow", "0");
      Object.assign(progressBar.style, {
        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)",
        position: "relative",
        width: "100%",
        height: "1.6rem",
        borderRadius: "1.2rem",
        overflow: "hidden",
        border: isDark
          ? "1px solid rgba(255,255,255,0.02)"
          : "1px solid rgba(0,0,0,0.04)",
      });

      const counter = document.createElement("p");
      Object.assign(counter.style, {
        position: "absolute",
        zIndex: 5,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        margin: 0,
        color: isDark ? "#fff" : "#111",
        fontWeight: 700,
        fontSize: "0.9rem",
      });

      const progress = document.createElement("div");
      Object.assign(progress.style, {
        position: "absolute",
        height: "100%",
        width: "0%",
        background:
          "linear-gradient(90deg, rgba(96,147,181,1) 0%, rgba(102,201,173,1) 100%)",
        boxShadow: "0 4px 18px rgba(96,147,181,0.18)",
      });

      progressBar.append(counter, progress);
      flex.append(title, close);
      inner.append(flex, progressBar);
      container.appendChild(inner);
    } catch (error) {
      logger.error(`Failed to create progress bar: ${error.message}`);
    }
  }

  /**
   * Update progress bar percentage
   * @param {string} videoId - Unique identifier for the video
   * @param {string} fileName - Name of the file being downloaded
   * @param {number} percent - Progress percentage
   * @param {string} speedText - Optional speed indicator text
   */
  function updateProgress(videoId, fileName, percent, speedText = "") {
    try {
      const inner = document.getElementById(
        `tel-downloader-progress-${videoId}`
      );
      if (!inner) return;

      const filenameEl = inner.querySelector("p.filename");
      if (filenameEl) filenameEl.textContent = fileName;

      const progressBar = inner.querySelector("div.progress");
      if (!progressBar) return;

      const counterEl = progressBar.querySelector("p");
      const progressEl = progressBar.querySelector("div");

      if (counterEl) counterEl.textContent = percent + "%" + speedText;
      if (progressEl) progressEl.style.width = percent + "%";

      // Update ARIA attributes
      progressBar.setAttribute("aria-valuenow", percent);
      if (speedText) {
        progressBar.setAttribute("aria-valuetext", `${percent}% ${speedText}`);
      }
    } catch (error) {
      logger.error(`Failed to update progress: ${error.message}`);
    }
  }
  /**
   * Mark progress bar as completed
   * @param {string} videoId - Unique identifier for the video
   */
  function completeProgress(videoId) {
    try {
      const inner = document.getElementById(
        `tel-downloader-progress-${videoId}`
      );
      if (!inner) return;

      const progressBar = inner.querySelector("div.progress");
      if (!progressBar) return;

      const counterEl = progressBar.querySelector("p");
      const progressEl = progressBar.querySelector("div");

      if (counterEl) counterEl.textContent = "Completed";
      if (progressEl) {
        progressEl.style.backgroundColor = "#B6C649";
        progressEl.style.width = "100%";
      }
    } catch (error) {
      logger.error(`Failed to complete progress: ${error.message}`);
    }
  }

  /**
   * Mark progress bar as aborted
   * @param {string} videoId - Unique identifier for the video
   */
  function abortProgress(videoId) {
    try {
      const inner = document.getElementById(
        `tel-downloader-progress-${videoId}`
      );
      if (!inner) return;

      const progressBar = inner.querySelector("div.progress");
      if (!progressBar) return;

      const counterEl = progressBar.querySelector("p");
      const progressEl = progressBar.querySelector("div");

      if (counterEl) counterEl.textContent = "Aborted";
      if (progressEl) {
        progressEl.style.backgroundColor = "#D16666";
        progressEl.style.width = "100%";
      }
    } catch (error) {
      logger.error(`Failed to abort progress: ${error.message}`);
    }
  }

  // --- Downloaders ---
  /**
   * Download video with retry logic and progress tracking
   * @param {string} url - Video URL
   */
  function tel_download_video(url) {
    let blobs = [],
      nextOffset = 0,
      totalSize = null,
      fileExt = "mp4",
      retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY_BASE = 1000;
    const videoId = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    let fileName = extractFileName(url, "mp4");
    const abortController = new AbortController();
    activeDownloads.set(videoId, abortController);

    // Download speed tracking
    let lastUpdateTime = Date.now();
    let lastBytes = 0;
    let downloadSpeed = 0;

    logger.info(`URL: ${url}`, fileName);

    function fetchNextPart(writable) {
      fetch(url, {
        method: "GET",
        headers: { Range: `bytes=${nextOffset}-` },
        signal: abortController.signal,
      })
        .then((res) => {
          if (!res) throw new Error("Empty response received");
          if (![200, 206].includes(res.status))
            throw new Error("Non 200/206 response: " + res.status);

          const contentType = res.headers.get("Content-Type");
          if (!contentType) throw new Error("Missing Content-Type header");

          if (!isValidMimeType(contentType, "video")) {
            throw new Error(
              `Non-video MIME type: ${contentType.split(";")[0]}`
            );
          }
          fileExt = getExtensionFromMime(contentType, "mp4");
          fileName = fileName.replace(/\.\w+$/, "." + fileExt);

          const contentRange = res.headers.get("Content-Range");
          if (!contentRange) throw new Error("Missing Content-Range header");

          const match = contentRange.match(contentRangeRegex);
          if (!match) throw new Error("Invalid Content-Range format");

          const start = +match[1],
            end = +match[2],
            size = +match[3];
          if (start !== nextOffset)
            throw new Error("Gap detected between responses.");
          if (totalSize && size !== totalSize)
            throw new Error("Total size differs");
          nextOffset = end + 1;
          totalSize = size;

          // Calculate download speed
          const now = Date.now();
          const timeDiff = (now - lastUpdateTime) / 1000; // seconds
          if (timeDiff > 0) {
            const bytesDiff = nextOffset - lastBytes;
            downloadSpeed = bytesDiff / timeDiff; // bytes per second
            lastUpdateTime = now;
            lastBytes = nextOffset;
          }

          const percent = ((nextOffset * 100) / totalSize).toFixed(0);
          const speedMB = (downloadSpeed / (1024 * 1024)).toFixed(2);
          const speedText = downloadSpeed > 0 ? ` (${speedMB} MB/s)` : "";

          updateProgress(videoId, fileName, percent, speedText);

          retryCount = 0; // Reset retry count on success
          return res.blob();
        })
        .then((blob) => {
          if (writable) return writable.write(blob);
          blobs.push(blob);
        })
        .then(() => {
          if (!totalSize) throw new Error("_total_size is NULL");
          if (nextOffset < totalSize) fetchNextPart(writable);
          else {
            if (writable)
              writable
                .close()
                .then(() => logger.info("Download finished", fileName));
            else save();
            completeProgress(videoId);
            activeDownloads.delete(videoId);
            showNotificationIfEnabled(
              `Download completed: ${fileName}`,
              "success"
            );
          }
        })
        .catch((err) => {
          // Handle user cancellation
          if (err.name === "AbortError") {
            logger.info("Download aborted by user", fileName);
            showNotificationIfEnabled(
              `Download cancelled: ${fileName}`,
              "warning"
            );
            abortProgress(videoId);
            activeDownloads.delete(videoId);
            return;
          }

          logger.error(err.message, fileName);

          // Implement exponential backoff retry for network errors
          const isNetworkError =
            err.message.includes("fetch") ||
            err.message.includes("network") ||
            err.name === "NetworkError" ||
            err.name === "TypeError";

          if (retryCount < MAX_RETRIES && isNetworkError) {
            retryCount++;
            const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount - 1);
            logger.warn(
              `Network error - Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`,
              fileName
            );
            showNotificationIfEnabled(
              `Retrying download (${retryCount}/${MAX_RETRIES})...`,
              "warning",
              2000
            );
            setTimeout(() => fetchNextPart(writable), delay);
          } else {
            if (retryCount >= MAX_RETRIES) {
              logger.error(`Max retries (${MAX_RETRIES}) exceeded`, fileName);
              showNotificationIfEnabled(
                `Download failed: ${fileName} - Max retries exceeded`,
                "error"
              );
            } else {
              showNotificationIfEnabled(
                `Download error: ${err.message}`,
                "error"
              );
            }
            abortProgress(videoId);
            activeDownloads.delete(videoId);
          }
        });
    }

    function save() {
      logger.info("Finish downloading blobs", fileName);
      const blob = new Blob(blobs, { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      logger.info("Download triggered", fileName);
    }

    const supportsFS =
      "showSaveFilePicker" in w &&
      (() => {
        try {
          return w.self === w.top;
        } catch {
          return false;
        }
      })();

    if (supportsFS) {
      w.showSaveFilePicker({ suggestedName: fileName })
        .then((handle) =>
          handle.createWritable().then((writable) => {
            fetchNextPart(writable);
            createProgressBar(videoId, fileName);
          })
        )
        .catch((err) => {
          if (err.name !== "AbortError") logger.error(err.message, fileName);
        });
    } else {
      fetchNextPart(null);
      createProgressBar(videoId, fileName);
    }
  }

  /**
   * Download audio file
   * @param {string} url - Audio URL
   */
  function tel_download_audio(url) {
    let blobs = [],
      nextOffset = 0,
      totalSize = null,
      retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY_BASE = 1000;
    const audioId = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    const fileName = extractFileName(url, "ogg");
    const abortController = new AbortController();
    activeDownloads.set(audioId, abortController);

    // Download speed tracking
    let lastUpdateTime = Date.now();
    let lastBytes = 0;
    let downloadSpeed = 0;

    logger.info(`URL: ${url}`, fileName);

    function fetchNextPart(writable) {
      fetch(url, {
        method: "GET",
        headers: { Range: `bytes=${nextOffset}-` },
        signal: abortController.signal,
      })
        .then((res) => {
          if (!res) throw new Error("Empty response received");
          if (![200, 206].includes(res.status))
            throw new Error("Non 200/206 response: " + res.status);

          const contentType = res.headers.get("Content-Type");
          if (!contentType) throw new Error("Missing Content-Type header");

          if (!isValidMimeType(contentType, "audio")) {
            throw new Error(
              `Non-audio MIME type: ${contentType.split(";")[0]}`
            );
          }
          const audioExt = getExtensionFromMime(contentType, "ogg");
          fileName = fileName.replace(/\.\w+$/, "." + audioExt);

          const contentRange = res.headers.get("Content-Range");
          if (!contentRange) throw new Error("Missing Content-Range header");

          const match = contentRange.match(contentRangeRegex);
          if (!match) throw new Error("Invalid Content-Range format");

          const start = +match[1],
            end = +match[2],
            size = +match[3];
          if (start !== nextOffset)
            throw new Error("Gap detected between responses.");
          if (totalSize && size !== totalSize)
            throw new Error("Total size differs");
          nextOffset = end + 1;
          totalSize = size;

          // Calculate download speed
          const now = Date.now();
          const timeDiff = (now - lastUpdateTime) / 1000; // seconds
          if (timeDiff > 0) {
            const bytesDiff = nextOffset - lastBytes;
            downloadSpeed = bytesDiff / timeDiff; // bytes per second
            lastUpdateTime = now;
            lastBytes = nextOffset;
          }

          const percent = ((nextOffset * 100) / totalSize).toFixed(0);
          const speedMB = (downloadSpeed / (1024 * 1024)).toFixed(2);
          const speedText = downloadSpeed > 0 ? ` (${speedMB} MB/s)` : "";

          updateProgress(audioId, fileName, percent, speedText);

          retryCount = 0; // Reset retry count on success
          return res.blob();
        })
        .then((blob) => {
          if (writable) return writable.write(blob);
          blobs.push(blob);
        })
        .then(() => {
          if (!totalSize) throw new Error("_total_size is NULL");
          if (nextOffset < totalSize) fetchNextPart(writable);
          else {
            if (writable)
              writable
                .close()
                .then(() => logger.info("Download finished", fileName));
            else save();
            completeProgress(audioId);
            activeDownloads.delete(audioId);
            showNotificationIfEnabled(
              `Download completed: ${fileName}`,
              "success"
            );
          }
        })
        .catch((err) => {
          // Handle user cancellation
          if (err.name === "AbortError") {
            logger.info("Download aborted by user", fileName);
            showNotificationIfEnabled(
              `Download cancelled: ${fileName}`,
              "warning"
            );
            abortProgress(audioId);
            activeDownloads.delete(audioId);
            return;
          }

          logger.error(err.message, fileName);

          // Implement exponential backoff retry for network errors
          const isNetworkError =
            err.message.includes("fetch") ||
            err.message.includes("network") ||
            err.name === "NetworkError" ||
            err.name === "TypeError";

          if (retryCount < MAX_RETRIES && isNetworkError) {
            retryCount++;
            const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount - 1);
            logger.warn(
              `Network error - Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`,
              fileName
            );
            showNotificationIfEnabled(
              `Retrying download (${retryCount}/${MAX_RETRIES})...`,
              "warning",
              2000
            );
            setTimeout(() => fetchNextPart(writable), delay);
          } else {
            if (retryCount >= MAX_RETRIES) {
              logger.error(`Max retries (${MAX_RETRIES}) exceeded`, fileName);
              showNotificationIfEnabled(
                `Download failed: ${fileName} - Max retries exceeded`,
                "error"
              );
            } else {
              showNotificationIfEnabled(
                `Download error: ${err.message}`,
                "error"
              );
            }
            abortProgress(audioId);
            activeDownloads.delete(audioId);
          }
        });
    }

    function save() {
      logger.info("Finish downloading blobs", fileName);
      const blob = new Blob(blobs, { type: "audio/ogg" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      logger.info("Download triggered", fileName);
    }

    const supportsFS =
      "showSaveFilePicker" in w &&
      (() => {
        try {
          return w.self === w.top;
        } catch {
          return false;
        }
      })();

    if (supportsFS) {
      w.showSaveFilePicker({ suggestedName: fileName })
        .then((handle) =>
          handle.createWritable().then((writable) => {
            fetchNextPart(writable);
            createProgressBar(audioId, fileName);
          })
        )
        .catch((err) => {
          if (err.name !== "AbortError") logger.error(err.message, fileName);
        });
    } else {
      fetchNextPart(null);
      createProgressBar(audioId, fileName);
    }
  }

  /**
   * Download image file
   * @param {string} imageUrl - Image URL
   */
  function tel_download_image(imageUrl) {
    const fileName = extractFileName(imageUrl, "jpeg");
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = imageUrl;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
    logger.info("Download triggered", fileName);
  }

  // --- Progress Bar Container Setup ---
  (() => {
    const body = document.body;
    const container = document.createElement("div");
    container.id = "tel-downloader-progress-bar-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: location.pathname.startsWith("/k/") ? 4 : 1600,
    });
    body.appendChild(container);
  })();

  logger.info("Initialized");

  // --- Main UI Button Injection with debouncing and RAF optimization ---
  let rafId = null;
  let lastRun = 0;
  let isInjecting = false; // Prevent overlapping executions

  const injectButtons = debounce(() => {
    if (isInjecting) return; // Skip if already running
    isInjecting = true;
    try {
      // Voice/Circle Audio Download Button
      const pinnedAudio = document.body.querySelector(".pinned-audio");
      let dataMid;
      let downloadBtn =
        document.body.querySelector("._tel_download_button_pinned_container") ||
        document.createElement("button");
      if (pinnedAudio) {
        dataMid = pinnedAudio.getAttribute("data-mid");
        downloadBtn.className =
          "btn-icon tgico-download _tel_download_button_pinned_container";
        setButtonIconContent(downloadBtn, DOWNLOAD_ICON, "tgico button-icon");
      }
      const audioElements = document.body.querySelectorAll("audio-element");
      audioElements.forEach((audioElement) => {
        const bubble = audioElement.closest(".bubble");
        if (
          !bubble ||
          bubble.querySelector("._tel_download_button_pinned_container")
        )
          return;
        if (
          dataMid &&
          downloadBtn.getAttribute("data-mid") !== dataMid &&
          audioElement.getAttribute("data-mid") === dataMid
        ) {
          const link =
            audioElement.audio && audioElement.audio.getAttribute("src");
          const isAudio =
            audioElement.audio &&
            audioElement.audio instanceof HTMLAudioElement;
          downloadBtn.onclick = (e) => {
            e.stopPropagation();
            if (isAudio) tel_download_audio(link);
            else tel_download_video(link);
          };
          downloadBtn.setAttribute("data-mid", dataMid);
          if (link) {
            const utils = pinnedAudio.querySelector(
              ".pinned-container-wrapper-utils"
            );
            if (utils) utils.appendChild(downloadBtn);
          }
        }
      });

      // Stories Download Button
      const storiesContainer = document.getElementById("stories-viewer");
      if (storiesContainer) {
        const createDownloadButton = () => {
          const btn = document.createElement("button");
          btn.className = "btn-icon rp tel-download";
          const ripple = document.createElement("div");
          ripple.className = "c-ripple";
          setButtonIconContent(btn, DOWNLOAD_ICON, "tgico", [ripple]);
          btn.type = "button";
          btn.title = "Download";
          btn.onclick = () => {
            const video = storiesContainer.querySelector("video.media-video");
            const videoSrc =
              video?.src ||
              video?.currentSrc ||
              video?.querySelector("source")?.src;
            if (videoSrc) tel_download_video(videoSrc);
            else {
              const imageSrc =
                storiesContainer.querySelector("img.media-photo")?.src;
              if (imageSrc) tel_download_image(imageSrc);
            }
          };
          return btn;
        };
        const storyHeader = storiesContainer.querySelector(
          "[class^='_ViewerStoryHeaderRight']"
        );
        if (storyHeader && !storyHeader.querySelector(".tel-download")) {
          storyHeader.prepend(createDownloadButton());
        }
      }

      // Media Viewer Download Buttons
      const mediaContainer = document.querySelector(".media-viewer-whole");
      if (!mediaContainer) return;
      const mediaAspecter = mediaContainer.querySelector(
        ".media-viewer-movers .media-viewer-aspecter"
      );
      const mediaButtons = mediaContainer.querySelector(
        ".media-viewer-topbar .media-viewer-buttons"
      );
      if (!mediaAspecter || !mediaButtons) return;

      // Unhide hidden buttons and use official download if present
      const hiddenButtons = mediaButtons.querySelectorAll(
        "button.btn-icon.hide"
      );
      let onDownload = null;
      for (const btn of hiddenButtons) {
        btn.classList.remove("hide");
        if (btn.textContent === FORWARD_ICON)
          btn.classList.add("tgico-forward");
        if (btn.textContent === DOWNLOAD_ICON) {
          btn.classList.add("tgico-download");
          onDownload = () => btn.click();
        }
      }

      // Video player
      if (mediaAspecter.querySelector(".ckin__player")) {
        const controls = mediaAspecter.querySelector(
          ".default__controls.ckin__controls"
        );
        if (controls && !controls.querySelector(".tel-download")) {
          const brControls = controls.querySelector(
            ".bottom-controls .right-controls"
          );
          if (brControls) {
            const btn = document.createElement("button");
            btn.className =
              "btn-icon default__button tgico-download tel-download";
            setButtonIconContent(btn, DOWNLOAD_ICON, "tgico");
            btn.type = "button";
            btn.title = "Download";
            btn.ariaLabel = "Download";
            btn.onclick = onDownload
              ? onDownload
              : () => {
                  const video = mediaAspecter.querySelector("video");
                  if (video) tel_download_video(video.src);
                };
            brControls.prepend(btn);
          }
        }
      } else if (
        mediaAspecter.querySelector("video") &&
        !mediaButtons.querySelector("button.btn-icon.tgico-download")
      ) {
        // Video HTML element
        const btn = document.createElement("button");
        btn.className = "btn-icon tgico-download tel-download";
        setButtonIconContent(btn, DOWNLOAD_ICON, "tgico button-icon");
        btn.type = "button";
        btn.ariaLabel = "Download";
        btn.onclick = onDownload
          ? onDownload
          : () => {
              const video = mediaAspecter.querySelector("video");
              if (video) tel_download_video(video.src);
            };
        mediaButtons.prepend(btn);
      } else if (
        !mediaButtons.querySelector("button.btn-icon.tgico-download")
      ) {
        // Image
        const img = mediaAspecter.querySelector("img.thumbnail");
        if (!img || !img.src) return;
        const btn = document.createElement("button");
        btn.className = "btn-icon tgico-download tel-download";
        setButtonIconContent(btn, DOWNLOAD_ICON, "tgico button-icon");
        btn.type = "button";
        btn.title = "Download";
        btn.ariaLabel = "Download";
        btn.onclick = onDownload
          ? onDownload
          : () => tel_download_image(img.src);
        mediaButtons.prepend(btn);
      }
    } catch (error) {
      logger.error(`Error injecting buttons: ${error.message}`);
    } finally {
      isInjecting = false;
    }
  }, 200);

  // Start the RAF loop with throttling and visibility optimization
  let isPaused = false;
  const rafLoop = () => {
    const now = Date.now();
    if (!isPaused && now - lastRun >= REFRESH_DELAY) {
      injectButtons();
      lastRun = now;
    }
    rafId = requestAnimationFrame(rafLoop);
  };
  rafLoop();

  // Pause RAF when tab is not visible to save resources
  document.addEventListener("visibilitychange", () => {
    isPaused = document.hidden;
    if (!isPaused) {
      logger.info("Tab visible - resuming button injection");
      lastRun = 0; // Force immediate update on resume
    } else {
      logger.info("Tab hidden - pausing button injection");
    }
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      logger.info("Cleanup: Cleared button injection RAF");
    }
  });

  // --- Settings Management ---
  const DEFAULT_SETTINGS = {
    enableNotifications: true,
    enableKeyboardShortcuts: true,
    enableAdBlocking: true,
    autoDownloadQuality: "original",
    downloadLocation: "default",
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("tel_downloader_settings");
      return stored
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        : DEFAULT_SETTINGS;
    } catch (error) {
      logger.error(`Failed to load settings: ${error.message}`);
      return DEFAULT_SETTINGS;
    }
  };

  const saveSettings = (settings) => {
    try {
      localStorage.setItem("tel_downloader_settings", JSON.stringify(settings));
      logger.info("Settings saved");
    } catch (error) {
      logger.error(`Failed to save settings: ${error.message}`);
    }
  };

  let currentSettings = loadSettings();

  /**
   * Show notification with settings check
   * @param {string} message - Message to display
   * @param {string} type - Type: 'info', 'error', 'success', 'warning'
   * @param {number} duration - Duration in milliseconds
   */
  const showNotificationIfEnabled = (
    message,
    type = "info",
    duration = 3000
  ) => {
    // Always show errors, check settings for others
    if (type === "error" || currentSettings.enableNotifications) {
      showNotification(message, type, duration);
    }
  };

  // Add settings button to Telegram UI
  const createSettingsPanel = () => {
    const overlay = document.createElement("div");
    overlay.id = "tel-settings-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(10, 12, 16, 0.55)",
      zIndex: "10002",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(6px)",
    });

    const panel = document.createElement("div");
    // Glassmorphism panel
    Object.assign(panel.style, {
      backgroundColor: "rgba(255,255,255,0.75)",
      color: "var(--primary-text-color, #000)",
      padding: "24px",
      borderRadius: "12px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      backdropFilter: "blur(12px) saturate(130%)",
      WebkitBackdropFilter: "blur(12px) saturate(130%)",
      border: "1px solid rgba(255,255,255,0.6)",
      boxShadow: "0 12px 48px rgba(16,24,40,0.12)",
    });

    panel.innerHTML = `
      <h2 style="margin: 0 0 20px 0; font-size: 24px;">Telegram+ Settings</h2>
      <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="tel-setting-notifications" style="margin-right: 10px;" ${
            currentSettings.enableNotifications ? "checked" : ""
          }>
          <span>Enable download notifications</span>
        </label>
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="tel-setting-keyboard" style="margin-right: 10px;" ${
            currentSettings.enableKeyboardShortcuts ? "checked" : ""
          }>
          <span>Enable keyboard shortcuts</span>
        </label>
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="tel-setting-adblock" style="margin-right: 10px;" ${
            currentSettings.enableAdBlocking ? "checked" : ""
          }>
          <span>Enable ad blocking</span>
        </label>
      </div>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(128, 128, 128, 0.3);">
        <p style="margin: 0 0 10px 0; font-size: 12px; opacity: 0.7;">
          Keyboard Shortcuts:<br>
          • Arrow Keys: Seek/Volume<br>
          • M: Mute/Unmute<br>
          • P: Picture-in-Picture<br>
          • Home: Restart video
        </p>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button id="tel-settings-save" style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: #4CAF50; color: white; cursor: pointer; font-size: 14px; font-weight: 600;">
          Save
        </button>
        <button id="tel-settings-close" style="flex: 1; padding: 10px; border: none; border-radius: 6px; background: rgba(128, 128, 128, 0.2); color: var(--primary-text-color, #000); cursor: pointer; font-size: 14px; font-weight: 600;">
          Cancel
        </button>
      </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const saveBtn = panel.querySelector("#tel-settings-save");
    const closeBtn = panel.querySelector("#tel-settings-close");

    saveBtn.onclick = () => {
      currentSettings.enableNotifications = panel.querySelector(
        "#tel-setting-notifications"
      ).checked;
      currentSettings.enableKeyboardShortcuts = panel.querySelector(
        "#tel-setting-keyboard"
      ).checked;
      currentSettings.enableAdBlocking = panel.querySelector(
        "#tel-setting-adblock"
      ).checked;
      saveSettings(currentSettings);
      if (currentSettings.enableNotifications) {
        showNotification("Settings saved successfully!", "success");
      }
      overlay.style.display = "none";
    };

    closeBtn.onclick = () => {
      overlay.style.display = "none";
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    };

    return overlay;
  };

  // Create and add settings button
  const settingsPanel = createSettingsPanel();
  const showSettings = () => {
    settingsPanel.style.display = "flex";
  };

  // Add settings hotkey (Shift+/ -> '?')
  document.addEventListener("keydown", (e) => {
    // Trigger on Shift + / (which produces '?' as the key) or on the Slash code with Shift
    if (e.shiftKey && (e.key === "?" || e.code === "Slash")) {
      e.preventDefault();
      showSettings();
    }
  });

  logger.info(
    "Completed script setup. Press Shift+/ (question mark) to open settings."
  );

  // --- Media Player Keyboard Controls ---
  document.addEventListener("keydown", (e) => {
    // Check if keyboard shortcuts are enabled
    if (!currentSettings.enableKeyboardShortcuts) return;

    const mediaViewer = document.querySelector(".media-viewer-whole");
    if (!mediaViewer) return;
    const video = mediaViewer.querySelector("video");
    if (!video) return;
    if (
      ["INPUT", "TEXTAREA"].includes(e.target.tagName) ||
      e.target.isContentEditable
    )
      return;

    // Notification
    let notification = document.querySelector(".video-control-notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.className = "video-control-notification";
      Object.assign(notification.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "18px",
        opacity: "0",
        transition: "opacity 0.3s ease",
        zIndex: "10000",
        pointerEvents: "none",
      });
      document.body.appendChild(notification);
    }

    let fadeTimeout;
    const showNotification = (msg) => {
      notification.textContent = msg;
      notification.style.opacity = "1";
      notification.classList.add("notification-pulse");
      if (fadeTimeout) cancelAnimationFrame(fadeTimeout);
      let start;
      function fade(ts) {
        if (!start) start = ts;
        if (ts - start > 1500) {
          notification.style.opacity = "0";
          notification.classList.remove("notification-pulse");
        } else {
          fadeTimeout = requestAnimationFrame(fade);
        }
      }
      fadeTimeout = requestAnimationFrame(fade);
    };

    // Add styles if not present
    if (!document.getElementById("video-control-animations")) {
      const style = document.createElement("style");
      style.id = "video-control-animations";
      style.textContent = `
        @keyframes notification-pulse {
          0% { transform: translate(-50%, -50%) scale(0.95); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .notification-pulse {
          animation: notification-pulse 0.3s ease-in-out;
        }
        .video-control-notification {
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
      `;
      document.head.appendChild(style);
    }
    if (!document.getElementById("video-control-glassmorphism")) {
      const style = document.createElement("style");
      style.id = "video-control-glassmorphism";
      style.textContent = `
        .video-control-notification {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background: rgba(32, 38, 57, 0.55);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          color: #fff;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          font-size: 1.1em;
          letter-spacing: 0.01em;
          transition: opacity 0.3s, background 0.3s;
          padding: 18px 32px;
          min-width: 120px;
          max-width: 90vw;
          text-align: center;
          user-select: none;
        }
      `;
      document.head.appendChild(style);
    }

    // Keyboard Shortcuts
    switch (e.code) {
      case "ArrowRight":
        e.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        showNotification(`(${Math.floor(video.currentTime)}s)`);
        break;
      case "ArrowLeft":
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        showNotification(`(${Math.floor(video.currentTime)}s)`);
        break;
      case "ArrowUp":
        e.preventDefault();
        video.volume = Math.min(1, video.volume + 0.1);
        showNotification(`${Math.round(video.volume * 100)}%`);
        break;
      case "ArrowDown":
        e.preventDefault();
        video.volume = Math.max(0, video.volume - 0.1);
        showNotification(`${Math.round(video.volume * 100)}%`);
        break;
      case "KeyM":
        e.preventDefault();
        video.muted = !video.muted;
        showNotification(video.muted ? "Muted" : "Unmuted");
        break;
      case "KeyP":
        e.preventDefault();
        if (document.pictureInPictureElement) {
          document
            .exitPictureInPicture()
            .catch((err) => logger.error(err.message));
          showNotification("Exited PiP");
        } else {
          video
            .requestPictureInPicture()
            .catch((err) => logger.error(err.message));
          showNotification("Entered PiP");
        }
        break;
      case "Home":
        e.preventDefault();
        video.currentTime = 0;
        showNotification("(0s)");
        break;
      default:
        return;
    }

    e.stopPropagation();
  });

  // --- Video Progress Persistence ---
  (function setupVideoProgressPersistence() {
    const STORAGE_KEY = "tg_video_progress";
    const activeVideoIntervals = new Map();

    const load = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch (error) {
        logger.error(`Failed to load progress: ${error.message}`);
        return {};
      }
    };
    const save = (obj) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } catch (error) {
        logger.error(`Failed to save progress: ${error.message}`);
      }
    };

    const observer = new MutationObserver(
      debounce(() => {
        try {
          const nameEl = document.querySelector(
            ".media-viewer-name .peer-title"
          );
          const dateEl = document.querySelector(".media-viewer-date");
          const video = document.querySelector("video");
          if (!nameEl || !dateEl || !video) return;
          const name = nameEl.textContent.trim();
          const date = dateEl.textContent.trim();
          const key = `${name} @ ${date}`;
          const store = load();
          if (store[key] && !video.dataset.restored) {
            video.currentTime = store[key];
            video.dataset.restored = "1";
          }
          if (!video.dataset.listened) {
            video.dataset.listened = "1";

            // Clear any existing interval for this video
            if (activeVideoIntervals.has(key)) {
              clearInterval(activeVideoIntervals.get(key));
            }

            const intervalId = setInterval(() => {
              if (!video.paused && !video.ended) {
                store[key] = video.currentTime;
                save(store);
              }
            }, 2000);
            activeVideoIntervals.set(key, intervalId);

            video.addEventListener(
              "ended",
              () => {
                if (activeVideoIntervals.has(key)) {
                  clearInterval(activeVideoIntervals.get(key));
                  activeVideoIntervals.delete(key);
                }
                delete store[key];
                save(store);
              },
              { once: true }
            );
          }
        } catch (error) {
          logger.error(`Error in progress persistence: ${error.message}`);
        }
      }, 100)
    );
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => {
      observer.disconnect();
      activeVideoIntervals.forEach((intervalId) => clearInterval(intervalId));
      activeVideoIntervals.clear();
    });
  })();

  (function removeTelegramSpeedLimit() {
    // Patch fetch to bypass artificial speed limits on media downloads
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args).then(async (res) => {
        const contentType = res.headers.get("Content-Type") || "";
        // Only patch for media and binary files
        if (
          /^video\//.test(contentType) ||
          /^audio\//.test(contentType) ||
          contentType === "application/octet-stream"
        ) {
          // Read the full body eagerly to avoid slow streams
          const blob = await res.clone().blob();
          // Copy headers to a new Headers object to avoid issues with immutable headers
          const headers = new Headers();
          res.headers.forEach((v, k) => headers.append(k, v));
          return new Response(blob, {
            status: res.status,
            statusText: res.statusText,
            headers,
          });
        }
        return res;
      });
    };
  })();

  /**
   * Remove Telegram ads and sponsored content
   */
  (function removeTelegramAds() {
    // Remove sponsored messages and ad banners
    const adSelectors = [
      '[class*="Sponsored"]',
      '[class*="sponsored"]',
      '[class*="AdBanner"]',
      '[class*="ad-banner"]',
      '[data-testid="sponsored-message"]',
      '[data-testid="ad-banner"]',
    ];

    function removeAds(root = document) {
      // Check if ad blocking is enabled
      if (!currentSettings.enableAdBlocking) return;

      try {
        adSelectors.forEach((selector) => {
          root.querySelectorAll(selector).forEach((el) => {
            logger.info(`Removing ad element: ${selector}`);
            el.remove();
          });
        });
      } catch (error) {
        logger.error(`Error removing ads: ${error.message}`);
      }
    }

    // Initial cleanup
    removeAds();

    // Observe DOM for dynamically inserted ads with throttling
    const observer = new MutationObserver(
      debounce((mutations) => {
        if (!currentSettings.enableAdBlocking) return;
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              removeAds(node);
            }
          });
        }
      }, 100)
    );
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  })();
})();
