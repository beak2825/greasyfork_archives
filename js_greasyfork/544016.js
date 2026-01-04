// ==UserScript==
// @name            Telegram +
// @name:en         Telegram +
// @namespace       by
// @version         1.31 // Увеличена версия из-за изменений
// @author          diorhc
// @description     Видео, истории и скачивание файлов и другие функции ↴
// @description:en  Telegram Downloader and others features ↴
// @match           https://web.telegram.org/*
// @match           https://webk.telegram.org/*
// @match           https://webz.telegram.org/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @license         MIT
// @grant           none
// @grant           unsafeWindow // Добавлено явно для использования unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/544016/Telegram%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/544016/Telegram%20%2B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // --- Logger Utility ---
  const logger = {
    info: (msg, file = "") =>
      console.log(`[TelPlus]${file ? ` ${file}:` : ""} ${msg}`),
    error: (msg, file = "") =>
      console.error(`[TelPlus]${file ? ` ${file}:` : ""} ${msg}`),
  };

  // --- Constants ---
  const DOWNLOAD_ICON = "\uE95A"; // Иконка загрузки
  const FORWARD_ICON = "\uE976"; // Иконка пересылки
  const contentRangeRegex = /^bytes (\d+)-(\d+)\/(\d+)$/; // Регулярное выражение для Content-Range
  const UI_REFRESH_DELAY = 500; // Задержка для обновления UI (в мс)
  const PROGRESS_BAR_REMOVE_DELAY = 3000; // Задержка перед удалением прогресс-бара после завершения/ошибки

  // --- Utility Functions ---
  const hashCode = (s) =>
    Array.from(s).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0) >>> 0;

  // Функция для получения расширения файла из MIME-типа
  const getExtensionFromMime = (mime) => {
      if (!mime) return 'bin'; // По умолчанию для бинарных данных
      const parts = mime.split('/');
      if (parts.length > 1) {
          const subType = parts[1];
          switch (subType) {
              case 'jpeg': return 'jpg';
              case 'ogg': return 'ogg';
              case 'mp4': return 'mp4';
              case 'webm': return 'webm';
              case 'gif': return 'gif';
              case 'png': return 'png';
              case 'webp': return 'webp';
              case 'mpeg': return 'mp3'; // Для audio/mpeg
              default: return subType;
          }
      }
      return 'bin';
  };

  // --- Progress Bar ---
  let progressBarContainer = null;

  function setupProgressBarContainer() {
    if (progressBarContainer) return; // Контейнер уже создан

    const body = document.body;
    progressBarContainer = document.createElement("div");
    progressBarContainer.id = "tel-downloader-progress-bar-container";
    Object.assign(progressBarContainer.style, {
      position: "fixed",
      bottom: "10px", // Отступ снизу
      right: "10px",  // Отступ справа
      zIndex: location.pathname.startsWith("/k/") ? 4 : 1600, // Z-index в зависимости от версии Telegram Web
      display: "flex",
      flexDirection: "column",
      gap: "8px", // Отступ между прогресс-барами
    });
    body.appendChild(progressBarContainer);
    logger.info("Progress bar container initialized.");
  }

  function createProgressBar(id, fileName) {
    setupProgressBarContainer(); // Убедимся, что контейнер существует

    // Удаляем старый прогресс-бар, если он есть для этого ID
    const existingBar = document.getElementById(`tel-downloader-progress-${id}`);
    if (existingBar) existingBar.remove();

    const isDark =
      document.documentElement.classList.contains("night") ||
      document.documentElement.classList.contains("theme-dark");
    const inner = document.createElement("div");
    inner.id = `tel-downloader-progress-${id}`;
    Object.assign(inner.style, {
      width: "20rem",
      marginTop: "0.4rem",
      padding: "0.6rem",
      backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.7)", // Чуть темнее фон
      borderRadius: "8px", // Скругление углов
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Тень
    });

    const flex = document.createElement("div");
    Object.assign(flex.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center", // Выравнивание по центру
      marginBottom: "5px", // Отступ под заголовком
    });

    const title = document.createElement("p");
    title.className = "filename";
    Object.assign(title.style, {
        margin: 0,
        color: "white",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flexGrow: 1, // Позволяет заголовку занимать доступное пространство
        marginRight: "10px" // Отступ от кнопки закрытия
    });
    title.innerText = fileName;

    const close = document.createElement("div");
    Object.assign(close.style, {
      cursor: "pointer",
      fontSize: "1.2rem",
      color: isDark ? "#A0A0A0" : "white", // Цвет иконки закрытия
      fontWeight: "bold",
    });
    close.innerHTML = "&times;";
    close.onclick = () => inner.remove(); // Используем .remove() для удаления

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    Object.assign(progressBar.style, {
      backgroundColor: "#e2e2e2",
      position: "relative",
      width: "100%",
      height: "1.6rem",
      borderRadius: "1.6rem", // Полное скругление
      overflow: "hidden",
    });

    const counter = document.createElement("p");
    Object.assign(counter.style, {
      position: "absolute",
      zIndex: 5,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      margin: 0,
      color: "black",
      fontWeight: "bold", // Жирный текст прогресса
    });

    const progressFill = document.createElement("div"); // Переименовано для ясности
    Object.assign(progressFill.style, {
      position: "absolute",
      height: "100%",
      width: "0%",
      backgroundColor: "#6093B5", // Цвет прогресса
      transition: "width 0.3s ease-out", // Плавный переход
    });

    progressBar.append(counter, progressFill);
    flex.append(title, close);
    inner.append(flex, progressBar);
    progressBarContainer.appendChild(inner);

    updateProgress(id, fileName, 0); // Инициализируем прогресс
  }

  function updateProgress(id, fileName, percent) {
    const inner = document.getElementById(`tel-downloader-progress-${id}`);
    if (!inner) return; // Проверка на существование

    inner.querySelector("p.filename").innerText = fileName;
    const progressBar = inner.querySelector(".progress-bar");
    if (!progressBar) return;

    progressBar.querySelector("p").innerText = `${percent}%`;
    progressBar.querySelector("div").style.width = `${percent}%`;
  }

  function completeProgress(id) {
    const inner = document.getElementById(`tel-downloader-progress-${id}`);
    if (!inner) return;

    const progressBar = inner.querySelector(".progress-bar");
    if (!progressBar) return;

    progressBar.querySelector("p").innerText = "Completed";
    progressBar.querySelector("div").style.backgroundColor = "#B6C649"; // Зеленый для завершения
    progressBar.querySelector("div").style.width = "100%";
    setTimeout(() => inner.remove(), PROGRESS_BAR_REMOVE_DELAY);
  }

  function abortProgress(id, errorMessage = "Aborted") { // Добавлена причина отмены
    const inner = document.getElementById(`tel-downloader-progress-${id}`);
    if (!inner) return;

    const progressBar = inner.querySelector(".progress-bar");
    if (!progressBar) return;

    progressBar.querySelector("p").innerText = errorMessage;
    progressBar.querySelector("div").style.backgroundColor = "#D16666"; // Красный для ошибки
    progressBar.querySelector("div").style.width = "100%";
    setTimeout(() => inner.remove(), PROGRESS_BAR_REMOVE_DELAY);
  }

  // --- Downloaders ---
  function tel_download_media_stream(url, type) {
    let blobs = [],
      nextOffset = 0,
      totalSize = null;
    const id = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    let fileName = `${hashCode(url).toString(36)}.${type === 'audio' ? 'ogg' : 'mp4'}`; // Дефолтное расширение

    // Попытка извлечь имя файла из URL, если оно встроено в JSON или является частью пути
    try {
        const urlObj = new URL(url);
        const lastPathSegment = urlObj.pathname.split('/').pop();
        if (lastPathSegment) {
            try {
                const decodedSegment = decodeURIComponent(lastPathSegment);
                const metadata = JSON.parse(decodedSegment);
                if (metadata.fileName) {
                    fileName = metadata.fileName;
                }
            } catch {
                // Not a JSON string, try to infer extension from path
                const parts = lastPathSegment.split('.');
                if (parts.length > 1 && parts.pop().length <= 5) { // Простая проверка на валидное расширение
                    fileName = lastPathSegment;
                }
            }
        }
    } catch (e) {
        logger.error(`Error processing URL for filename: ${e.message}`, fileName);
    }
    
    // Переопределим fileExt после попытки извлечения fileName
    let fileExt = fileName.split('.').pop() || (type === 'audio' ? 'ogg' : 'mp4');

    logger.info(`Starting download for ${type}: ${url}`, fileName);
    createProgressBar(id, fileName);

    const fetchNextPart = (writable) => {
      fetch(url, {
        method: "GET",
        headers: { Range: `bytes=${nextOffset}-` },
      })
        .then(async (res) => { // Добавим async здесь для await res.blob()
          if (![200, 206].includes(res.status))
            throw new Error(`Non 200/206 response was received: ${res.status}`);

          const mime = res.headers.get("Content-Type")?.split(";")[0]; // ?. для безопасности
          if (!mime || !mime.startsWith(type + "/"))
            throw new Error(`Non-${type} MIME: ${mime || 'N/A'}`);

          fileExt = getExtensionFromMime(mime);
          // Обновим имя файла с корректным расширением
          fileName = fileName.replace(/\.\w+$/, `.${fileExt}`);

          const contentRangeHeader = res.headers.get("Content-Range");
          if (res.status === 200 && !contentRangeHeader) {
              totalSize = parseInt(res.headers.get("Content-Length"));
              nextOffset = totalSize; // Завершено
              logger.info(`Full download detected (status 200, no Content-Range), total size: ${totalSize}`, fileName);
              updateProgress(id, fileName, 100); // 100% сразу
              return res.blob();
          }

          const match = contentRangeHeader?.match(contentRangeRegex);
          if (!match) throw new Error("Invalid Content-Range header format.");

          const start = +match[1],
            end = +match[2],
            size = +match[3];

          if (start !== nextOffset) {
            logger.error(`Gap detected. Last offset: ${nextOffset}, New start: ${start}`, fileName);
            throw new Error("Gap detected between responses.");
          }
          if (totalSize !== null && size !== totalSize) { // Убедимся, что totalSize уже не null
            logger.error(`Total size differs. Expected: ${totalSize}, Got: ${size}`, fileName);
            throw new Error("Total size differs");
          }
          nextOffset = end + 1;
          totalSize = size;

          const percent = ((nextOffset * 100) / totalSize).toFixed(0);
          updateProgress(id, fileName, percent);
          return res.blob();
        })
        .then((blob) => {
          if (writable) return writable.write(blob);
          blobs.push(blob);
          return Promise.resolve(); // Вернуть промис для правильной цепочки
        })
        .then(() => {
          if (totalSize === null) { // Если totalSize до сих пор null, значит была ошибка или некорректный ответ
              throw new Error("Total size not determined.");
          }
          if (nextOffset < totalSize) {
            fetchNextPart(writable);
          } else {
            if (writable) {
              writable.close().then(() => {
                logger.info(`Download finished (File System Access API): ${fileName}`);
                completeProgress(id);
              }).catch(err => {
                  logger.error(`Error closing writable: ${err.message}`, fileName);
                  abortProgress(id, "Write Error");
              });
            } else {
              saveBlob();
            }
          }
        })
        .catch((err) => {
          logger.error(`Download error for ${fileName}: ${err.message || err}`, fileName);
          abortProgress(id, "Download Failed");
        });
    };

    const saveBlob = () => {
      logger.info(`Concatenating blobs and downloading: ${fileName}`);
      const blobType = type === 'audio' ? `audio/${fileExt}` : `video/${fileExt}`;
      const blob = new Blob(blobs, { type: blobType });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      logger.info(`Download triggered: ${fileName}`);
      completeProgress(id);
    };

    const supportsFS =
      "showSaveFilePicker" in unsafeWindow &&
      (() => {
        try {
          return unsafeWindow.self === unsafeWindow.top;
        } catch {
          return false;
        }
      })();

    if (supportsFS) {
      unsafeWindow
        .showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: type === 'audio' ? 'Audio Files' : 'Video Files',
              accept: type === 'audio' ? { 'audio/*': ['.mp3', '.ogg', '.wav', '.flac'] } : { 'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.gif'] }
            }
          ]
        })
        .then((handle) =>
          handle.createWritable().then((writable) => fetchNextPart(writable))
        )
        .catch((err) => {
          if (err.name === "AbortError") {
            logger.info(`User aborted file save dialog for ${fileName}.`, fileName);
            abortProgress(id, "User Cancelled");
          } else {
            logger.error(`Error with File System Access API for ${fileName}: ${err.message}`, fileName);
            abortProgress(id, "FS API Error");
          }
        });
    } else {
      fetchNextPart(null);
    }
  }

  // Общие функции для скачивания (используют tel_download_media_stream)
  function tel_download_video(url) {
      tel_download_media_stream(url, 'video');
  }

  function tel_download_audio(url) {
      tel_download_media_stream(url, 'audio');
  }

  function tel_download_image(imageUrl) {
    const id = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    let fileName = `${hashCode(imageUrl).toString(36)}.jpeg`; // Дефолтное расширение

    // Попытка извлечь имя файла и расширение из URL
    try {
        const urlObj = new URL(imageUrl);
        const pathSegments = urlObj.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment && lastSegment.includes('.')) {
            const parts = lastSegment.split('.');
            const potentialExt = parts[parts.length - 1];
            if (potentialExt.length <= 5 && /^[a-zA-Z0-9]+$/.test(potentialExt)) {
                fileName = lastSegment; // Используем имя из URL, если оно похоже на валидное имя файла
            }
        }
    } catch (e) {
        logger.error(`Error parsing image URL for filename: ${e.message}`, imageUrl);
    }

    createProgressBar(id, fileName);
    logger.info(`Starting image download: ${imageUrl}`, fileName);

    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("Content-Type");
            // Обновляем расширение файла, если MIME-тип точнее
            if (contentType && !fileName.includes('.')) { // Если имя файла не содержит расширения
                const newExt = getExtensionFromMime(contentType);
                fileName = fileName.replace(/\.\w+$/, '') + `.${newExt}`; // Заменяем на новое
            } else if (contentType && fileName.includes('.')) { // Если имя уже есть, но mime-тип точнее
                const currentExt = fileName.split('.').pop().toLowerCase();
                const newExt = getExtensionFromMime(contentType);
                if (currentExt !== newExt && (newExt === 'jpg' && currentExt === 'jpeg' || newExt === 'jpeg' && currentExt === 'jpg')) {
                    // Разрешаем jpg/jpeg взаимозаменяемость
                } else if (currentExt !== newExt) {
                     fileName = fileName.replace(/\.\w+$/, '') + `.${newExt}`; // Обновляем
                }
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = fileName;
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            logger.info(`Image download triggered: ${fileName}`);
            completeProgress(id);
        })
        .catch(error => {
            logger.error(`Image download failed: ${error.message}`, fileName);
            abortProgress(id, "Download Failed");
        });
  }

  // --- UI Button Injection ---
  // Унифицированная функция для добавления кнопки загрузки
  const addDownloadButton = (container, mediaType, url, prepend = false, specificClass = '') => {
      // Проверяем, существует ли уже кнопка для данного URL в этом контейнере
      const existingButton = container.querySelector(`.telplus-download-btn[data-url="${url}"]`);
      if (existingButton) {
          // Если кнопка уже есть, но нужно обновить её класс, это можно сделать здесь.
          // Например, если она была добавлена с одним классом, а теперь нужна другая стилизация.
          if (specificClass && !existingButton.classList.contains(specificClass)) {
              existingButton.classList.add(specificClass);
          }
          return; // Не добавляем дубликат
      }

      const btn = document.createElement("button");
      btn.className = "telplus-download-btn"; // Общий класс для идентификации наших кнопок
      btn.setAttribute("type", "button");
      btn.setAttribute("title", "Download");
      btn.setAttribute("aria-label", "Download");
      btn.setAttribute("data-url", url); // Сохраняем URL для предотвращения дубликатов

      // Добавляем иконку
      const iconSpan = document.createElement("span");
      iconSpan.className = "tgico button-icon"; // Общий класс для иконок Telegram
      iconSpan.innerHTML = DOWNLOAD_ICON;
      btn.appendChild(iconSpan);

      // Добавляем специфичные классы для стилизации в зависимости от контекста
      if (container.closest('#MediaViewer') || container.closest('#StoryViewer')) { // webz стили
          btn.classList.add("Button", "smaller", "translucent-white", "round");
      } else { // webk стили
          btn.classList.add("btn-icon", "tgico-download");
          btn.innerHTML += `<div class="c-ripple"></div>`; // Эффект нажатия
      }
      if (specificClass) {
          btn.classList.add(specificClass);
      }

      btn.onclick = (e) => {
          e.stopPropagation(); // Предотвращаем всплытие
          if (mediaType === 'video') tel_download_video(url);
          else if (mediaType === 'audio') tel_download_audio(url);
          else if (mediaType === 'image') tel_download_image(url);
      };

      if (prepend) {
          container.prepend(btn);
      } else {
          container.appendChild(btn);
      }
  };

  // --- Main Loop for UI Injection ---
  logger.info("Starting UI injection loop.");
  setInterval(() => {
    // --- Webk App Specific (Telegram K) ---
    // Voice/Circle Audio Download Button
    document.querySelectorAll("audio-element").forEach((audioElement) => {
      const bubble = audioElement.closest(".bubble");
      const audioSrc = audioElement.audio?.src;
      if (bubble && audioSrc) {
        const container = bubble.querySelector(".message-body-wrapper .bubble-content") ||
                          bubble.querySelector(".message-bubble-row.voice"); // Возможные контейнеры
        if (container) {
          addDownloadButton(container, 'audio', audioSrc, false, '_tel_download_button_pinned_container');
        }
      }
    });

    // Stories Download Button (Webk)
    const storiesContainerWebk = document.getElementById("stories-viewer");
    if (storiesContainerWebk) {
        const storyHeader = storiesContainerWebk.querySelector("[class^='_ViewerStoryHeaderRight']");
        const storyFooter = storiesContainerWebk.querySelector("[class^='_ViewerStoryFooterRight']");
        const video = storiesContainerWebk.querySelector("video.media-video");
        const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
        const imageSrc = storiesContainerWebk.querySelector("img.media-photo")?.src;

        if (storyHeader) {
            if (videoSrc) addDownloadButton(storyHeader, 'video', videoSrc, true, 'rp');
            else if (imageSrc) addDownloadButton(storyHeader, 'image', imageSrc, true, 'rp');
        }
        if (storyFooter) {
            if (videoSrc) addDownloadButton(storyFooter, 'video', videoSrc, true, 'rp');
            else if (imageSrc) addDownloadButton(storyFooter, 'image', imageSrc, true, 'rp');
        }
    }

    // Media Viewer Download Buttons (Webk)
    const mediaContainerWebk = document.querySelector(".media-viewer-whole");
    if (mediaContainerWebk) {
        const mediaAspecter = mediaContainerWebk.querySelector(".media-viewer-movers .media-viewer-aspecter");
        const mediaButtons = mediaContainerWebk.querySelector(".media-viewer-topbar .media-viewer-buttons");

        if (mediaAspecter && mediaButtons) {
            // Unhide hidden buttons
            mediaButtons.querySelectorAll("button.btn-icon.hide").forEach(btn => {
                btn.classList.remove("hide");
                if (btn.textContent === FORWARD_ICON) btn.classList.add("tgico-forward");
                if (btn.textContent === DOWNLOAD_ICON) btn.classList.add("tgico-download");
            });

            const videoElement = mediaAspecter.querySelector("video");
            const imgElement = mediaAspecter.querySelector("img.thumbnail");

            if (videoElement && videoElement.src) {
                addDownloadButton(mediaButtons, 'video', videoElement.src, true); // Top bar button
                const controls = mediaAspecter.querySelector(".default__controls.ckin__controls");
                if (controls) { // In-player controls
                    const brControls = controls.querySelector(".bottom-controls .right-controls");
                    if (brControls) addDownloadButton(brControls, 'video', videoElement.src, true, 'default__button');
                }
            } else if (imgElement && imgElement.src) {
                addDownloadButton(mediaButtons, 'image', imgElement.src, true); // Top bar button
            }
        }
    }

    // --- Webz App Specific (Telegram A) ---
    // Stories Download Button (Webz)
    const storiesContainerWebz = document.getElementById("StoryViewer");
    if (storiesContainerWebz) {
      const storyHeader = storiesContainerWebz.querySelector(".GrsJNw3y") || storiesContainerWebz.querySelector(".DropdownMenu")?.parentNode;
      if (storyHeader) {
          const video = storiesContainerWebz.querySelector("video");
          const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
          const images = storiesContainerWebz.querySelectorAll("img.PVZ8TOWS");
          const imageSrc = images.length > 0 ? images[images.length - 1]?.src : null;

          if (videoSrc) addDownloadButton(storyHeader, 'video', videoSrc, true);
          else if (imageSrc) addDownloadButton(storyHeader, 'image', imageSrc, true);
      }
    }

    // Media Viewer Download Buttons (Webz)
    const mediaContainerWebz = document.querySelector("#MediaViewer .MediaViewerSlide--active");
    const mediaViewerActionsWebz = document.querySelector("#MediaViewer .MediaViewerActions");
    if (mediaContainerWebz && mediaViewerActionsWebz) {
      const videoPlayer = mediaContainerWebz.querySelector(".MediaViewerContent > .VideoPlayer");
      const img = mediaContainerWebz.querySelector(".MediaViewerContent > div > img");

      if (videoPlayer) {
        const videoUrl = videoPlayer.querySelector("video")?.currentSrc;
        if (videoUrl) {
          const controls = videoPlayer.querySelector(".VideoPlayerControls");
          if (controls) {
            const buttons = controls.querySelector(".buttons");
            if (buttons) addDownloadButton(buttons, 'video', videoUrl);
          }
          addDownloadButton(mediaViewerActionsWebz, 'video', videoUrl, true);
        }
      } else if (img && img.src) {
        addDownloadButton(mediaViewerActionsWebz, 'image', img.src, true);
      }
    }

  }, UI_REFRESH_DELAY);

  logger.info("Completed script setup.");

  // --- Remove Telegram Speed Limit ---
  // Этот патч может быть сложным и потенциально вызывать проблемы с памятью
  // для очень больших файлов, так как он загружает весь блоб в память.
  // Если Telegram меняет свою политику, этот патч может перестать работать
  // или вызвать другие проблемы.
  (function removeTelegramSpeedLimit() {
    if (typeof unsafeWindow === 'undefined' || !unsafeWindow.fetch) {
        logger.error("unsafeWindow.fetch is not available, cannot apply speed limit patch.");
        return;
    }

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (...args) {
      return originalFetch.apply(this, args).then(async (res) => {
        // Клонируем ответ до проверки Content-Type, чтобы можно было прочитать тело
        // без проблем, даже если Content-Type не соответствует нашим критериям.
        const resClone = res.clone();
        const contentType = res.headers.get("Content-Type") || "";

        // Применяем патч только для медиа и бинарных файлов
        if (
          /^video\//.test(contentType) ||
          /^audio\//.test(contentType) ||
          contentType === "application/octet-stream" ||
          /^image\//.test(contentType) // Добавлено для изображений
        ) {
          try {
            // Читаем полное тело жадно, чтобы избежать медленных потоков
            const blob = await resClone.blob(); // Используем клонированный ответ
            // Копируем заголовки в новый объект Headers, чтобы избежать проблем с неизменяемыми заголовками
            const headers = new Headers();
            res.headers.forEach((v, k) => headers.append(k, v));
            return new Response(blob, {
              status: res.status,
              statusText: res.statusText,
              headers,
            });
          } catch (e) {
            logger.error(`Failed to patch fetch for ${contentType}: ${e.message}`);
            return res; // В случае ошибки возвращаем оригинальный ответ
          }
        }
        return res; // Возвращаем оригинальный ответ для других типов
      });
    };
    logger.info("Telegram speed limit patch applied.");
  })();

  // --- Remove Telegram Ads ---
  (function removeTelegramAds() {
    const adSelectors = [
      '[class*="Sponsored"]',
      '[class*="sponsored"]',
      '[class*="AdBanner"]',
      '[class*="ad-banner"]',
      '[data-testid="sponsored-message"]',
      '[data-testid="ad-banner"]',
      // Дополнительные селекторы, если будут обнаружены
      '.ChannelChat > div[data-peer-id][data-message-id]:not([class*="message-"])' // Потенциально скрытые спонсорские сообщения, если они не имеют обычных классов сообщений
    ];

    function removeAds(root = document) {
      let removedCount = 0;
      adSelectors.forEach(selector => {
        root.querySelectorAll(selector).forEach(el => {
          if (el.parentNode) { // Убедимся, что у элемента есть родитель
            el.remove();
            removedCount++;
          }
        });
      });
      if (removedCount > 0) {
        logger.info(`Removed ${removedCount} ad elements.`);
      }
    }

    // Initial cleanup
    removeAds();

    // Observe DOM for dynamically inserted ads
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) { // Проверяем, что это элемент DOM
            removeAds(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    logger.info("Telegram ad removal started.");
  })();

  // --- Media Player Keyboard Controls ---
  // NOTE: Эта часть кода является самоисполняющейся функцией,
  // которая вызывается только один раз, но `document.addEventListener("keydown", ...)`
  // должна быть вне этой самоисполняющейся функции или явно вызвана.
  // Для ясности я перемещу listener наружу или сделаю его частью основной инициализации.
  logger.info("Setting up media player keyboard controls.");
  document.addEventListener("keydown", (e) => {
    // Проверяем, что не печатаем в полях ввода
    if (
      ["INPUT", "TEXTAREA"].includes(e.target.tagName) ||
      e.target.isContentEditable
    ) return;

    const mediaViewer = document.querySelector(".media-viewer-whole") || document.querySelector("#MediaViewer"); // Обе версии
    if (!mediaViewer) return;
    const video = mediaViewer.querySelector("video");
    if (!video) return;

    // Notification for keyboard controls
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
        backdropFilter: "blur(16px) saturate(180%)", // Glassmorphism
        webkitBackdropFilter: "blur(16px) saturate(180%)",
        background: "rgba(32, 38, 57, 0.55)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        letterSpacing: "0.01em",
        minWidth: "120px",
        maxWidth: "90vw",
        textAlign: "center",
        userSelect: "none",
      });
      document.body.appendChild(notification);

      // Add keyframe styles for notification pulse if not present
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
    }

    let fadeTimeout;
    const showNotification = (msg) => {
      notification.innerHTML = msg;
      notification.style.opacity = "1";
      notification.classList.add("notification-pulse");
      if (fadeTimeout) cancelAnimationFrame(fadeTimeout); // Отменяем предыдущий
      let start;
      function fade(ts) {
        if (!start) start = ts;
        if (ts - start > 1500) { // Держим 1.5 секунды
          notification.style.opacity = "0";
          notification.classList.remove("notification-pulse");
        } else {
          fadeTimeout = requestAnimationFrame(fade);
        }
      }
      fadeTimeout = requestAnimationFrame(fade);
    };

    // Keyboard Shortcuts
    let handledKey = true; // Флаг, указывающий, что клавиша обработана
    switch (e.code) {
      case "ArrowRight":
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        showNotification(`<span style="opacity:0.7;">${Math.floor(video.currentTime)}s</span>`);
        break;
      case "ArrowLeft":
        video.currentTime = Math.max(0, video.currentTime - 5);
        showNotification(`<span style="opacity:0.7;">${Math.floor(video.currentTime)}s</span>`);
        break;
      case "ArrowUp":
        video.volume = Math.min(1, video.volume + 0.1);
        showNotification(`<b>${Math.round(video.volume * 100)}%</b>`);
        break;
      case "ArrowDown":
        video.volume = Math.max(0, video.volume - 0.1);
        showNotification(`<b>${Math.round(video.volume * 100)}%</b>`);
        break;
      case "KeyM":
        video.muted = !video.muted;
        showNotification(video.muted ? "Muted" : "Unmuted");
        break;
      case "KeyP":
        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) { // Проверяем поддержку PiP
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture().then(() => showNotification("Exited PiP")).catch((err) => logger.error(`Error exiting PiP: ${err.message}`));
            } else {
                video.requestPictureInPicture().then(() => showNotification("Entered PiP")).catch((err) => logger.error(`Error entering PiP: ${err.message}`));
            }
        } else {
            showNotification("PiP not supported");
        }
        break;
      case "Home":
        video.currentTime = 0;
        showNotification(`<span style="opacity:0.7;">0s</span>`);
        break;
      default:
        handledKey = false; // Клавиша не обработана
    }

    if (handledKey) {
        e.preventDefault(); // Предотвращаем дефолтное поведение только если клавиша обработана
        e.stopPropagation(); // Останавливаем всплытие, чтобы не мешать другим скриптам
    }
  });

  // --- Video Progress Persistence ---
  (function () {
    const STORAGE_KEY = "tg_video_progress";
    const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const save = (obj) => localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    let currentIntervalId = null;

    const observeVideoAndSaveProgress = () => {
        // Ищем активный элемент медиа-просмотра в обеих версиях Telegram Web
        const mediaViewer = document.querySelector(".media-viewer-whole") || document.querySelector("#MediaViewer .MediaViewerSlide--active");
        if (!mediaViewer) {
            if (currentIntervalId) {
                clearInterval(currentIntervalId);
                currentIntervalId = null;
            }
            return;
        }

        const nameEl = mediaViewer.querySelector(".media-viewer-name .peer-title") || mediaViewer.querySelector(".media-viewer-filename") || mediaViewer.querySelector(".peer-title");
        const dateEl = mediaViewer.querySelector(".media-viewer-date") || mediaViewer.querySelector(".chat-details-link .time-item");
        const video = mediaViewer.querySelector("video");

        if (!nameEl || !dateEl || !video) {
            if (currentIntervalId) {
                clearInterval(currentIntervalId);
                currentIntervalId = null;
            }
            return;
        }

        const name = nameEl.textContent.trim();
        const date = dateEl.textContent.trim();
        const key = `${name} @ ${date}`;
        let store = load();

        // Восстанавливаем прогресс, если он есть
        if (store[key] && !video.dataset.restored) {
            video.currentTime = store[key];
            video.dataset.restored = "1";
            logger.info(`Restored video progress for "${key}" to ${Math.floor(store[key])}s`);
        }

        // Запускаем сохранение прогресса только если еще не запущено для этого видео
        if (!video.dataset.listened) {
            video.dataset.listened = "1"; // Помечаем, что этот видеоэлемент уже прослушивается

            if (currentIntervalId) { // Очищаем предыдущий интервал, если был активен
                clearInterval(currentIntervalId);
            }

            currentIntervalId = setInterval(() => {
                if (!video.paused && !video.ended) {
                    store[key] = video.currentTime;
                    save(store);
                }
            }, 2000); // Сохраняем каждые 2 секунды

            // Удаляем прогресс после завершения
            video.addEventListener("ended", () => {
                delete store[key];
                save(store);
                logger.info(`Removed video progress for "${key}" after completion.`);
                if (currentIntervalId) { // Очищаем интервал при завершении видео
                    clearInterval(currentIntervalId);
                    currentIntervalId = null;
                }
            }, { once: true });

            // Очищаем интервал при закрытии медиа-просмотра
            const closeButton = document.querySelector('.media-viewer-close') || document.querySelector('.icon-close');
            if (closeButton) {
                const clearOnClose = () => {
                    if (currentIntervalId) {
                        clearInterval(currentIntervalId);
                        currentIntervalId = null;
                    }
                    closeButton.removeEventListener('click', clearOnClose); // Удаляем слушатель
                };
                closeButton.addEventListener('click', clearOnClose, { once: true });
            }
        }
    };

    // Используем MutationObserver для отслеживания появления или исчезновения медиа-просмотрщика
    const observer = new MutationObserver(observeVideoAndSaveProgress);
    observer.observe(document.body, { childList: true, subtree: true });

    // Также вызываем при загрузке страницы, если медиа-просмотрщик уже активен
    observeVideoAndSaveProgress();
    logger.info("Video progress persistence enabled.");
  })();

})();