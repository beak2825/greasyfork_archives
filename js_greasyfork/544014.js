// ==UserScript==
// @name         Telegram Media Downloader
// @name:en      Telegram Media Downloader
// @name:zh-CN   Telegram 受限图片视频下载器
// @name:zh-TW   Telegram 受限圖片影片下載器
// @name:ru      Telegram: загрузчик медиафайлов
// @version      1.208 // Увеличена версия из-за изменений
// @namespace    https://github.com/Neet-Nestor/Telegram-Media-Downloader
// @description  Download images, GIFs, videos, and voice messages on the Telegram webapp from private channels that disable downloading and restrict saving content
// @description:en  Download images, GIFs, videos, and voice messages on the Telegram webapp from private channels that disable downloading and restrict saving content
// @description:ru Загружайте изображения, GIF-файлы, видео и голосовые сообщения в веб-приложении Telegram из частных каналов, которые отключили загрузку и ограничили сохранение контента
// @description:zh-CN 从禁止下载的Telegram频道中下载图片、视频及语音消息
// @description:zh-TW 從禁止下載的 Telegram 頻道中下載圖片、影片及語音訊息
// @author       Nestor Qin
// @license      GNU GPLv3
// @website      https://github.com/Neet-Nestor/Telegram-Media-Downloader
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @icon         https://img.icons8.com/color/452/telegram-app--v5.png
// @grant        unsafeWindow // Добавлено явно для использования unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/544014/Telegram%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/544014/Telegram%20Media%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict'; // Всегда полезно для чистого кода

  const logger = {
    info: (message, fileName = '') => { // fileName по умолчанию пустая строка
      console.log(
        `[Tel Download] ${fileName ? `${fileName}: ` : ""}${message}`
      );
    },
    error: (message, fileName = '') => { // fileName по умолчанию пустая строка
      console.error(
        `[Tel Download] ${fileName ? `${fileName}: ` : ""}${message}`
      );
    },
  };

  // Unicode values for icons (used in /k/ app)
  // https://github.com/morethanwords/tweb/blob/master/src/icons.ts
  const DOWNLOAD_ICON = "\uE95B";
  const FORWARD_ICON = "\uE976";
  const contentRangeRegex = /^bytes (\d+)-(\d+)\/(\d+)$/;
  const REFRESH_DELAY = 500; // Интервал для setInterval

  const hashCode = (s) => {
    let h = 0,
      l = s.length,
      i = 0;
    if (l > 0) {
      while (i < l) {
        h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
      }
    }
    return h >>> 0;
  };

  // --- Функции для управления прогресс-баром ---
  const createProgressBar = (videoId, fileName) => {
    const isDarkMode =
      document.documentElement.classList.contains("night") ||
      document.documentElement.classList.contains("theme-dark");
    let container = document.getElementById("tel-downloader-progress-bar-container");
    if (!container) { // Создаем контейнер, если его нет
        setupProgressBar();
        container = document.getElementById("tel-downloader-progress-bar-container");
    }

    const innerContainer = document.createElement("div");
    innerContainer.id = "tel-downloader-progress-" + videoId;
    innerContainer.style.width = "20rem";
    innerContainer.style.marginTop = "0.4rem";
    innerContainer.style.padding = "0.6rem";
    innerContainer.style.backgroundColor = isDarkMode
      ? "rgba(0,0,0,0.3)"
      : "rgba(0,0,0,0.6)";
    innerContainer.style.borderRadius = "0.5rem"; // Добавим немного скругления

    const flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.justifyContent = "space-between";
    flexContainer.style.alignItems = "center"; // Выравнивание по центру

    const title = document.createElement("p");
    title.className = "filename";
    title.style.margin = "0 0 0.5rem 0"; // Отступ снизу
    title.style.color = "white";
    title.style.whiteSpace = "nowrap"; // Предотвратить перенос
    title.style.overflow = "hidden"; // Скрыть переполнение
    title.style.textOverflow = "ellipsis"; // Добавить многоточие
    title.innerText = fileName;

    const closeButton = document.createElement("div");
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "1.2rem";
    closeButton.style.color = isDarkMode ? "#8a8a8a" : "white";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = function () {
      innerContainer.remove(); // Используем .remove() вместо parent.removeChild
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
    counter.style.fontWeight = "bold"; // Сделать текст прогресса жирным

    const progress = document.createElement("div");
    progress.style.position = "absolute";
    progress.style.height = "100%";
    progress.style.width = "0%";
    progress.style.backgroundColor = "#6093B5";
    progress.style.transition = "width 0.2s ease-out"; // Плавное изменение прогресса

    progressBar.appendChild(counter);
    progressBar.appendChild(progress);
    flexContainer.appendChild(title);
    flexContainer.appendChild(closeButton);
    innerContainer.appendChild(flexContainer);
    innerContainer.appendChild(progressBar);
    container.appendChild(innerContainer);

    updateProgress(videoId, fileName, 0); // Инициализируем прогресс на 0%
  };

  const updateProgress = (videoId, fileName, progress) => {
    const innerContainer = document.getElementById(
      "tel-downloader-progress-" + videoId
    );
    if (!innerContainer) return; // Проверка на существование элемента

    innerContainer.querySelector("p.filename").innerText = fileName;
    const progressBar = innerContainer.querySelector("div.progress");
    if (!progressBar) return; // Проверка на существование элемента

    progressBar.querySelector("p").innerText = `${progress}%`;
    progressBar.querySelector("div").style.width = `${progress}%`;
  };

  const completeProgress = (videoId) => {
    const innerContainer = document.getElementById("tel-downloader-progress-" + videoId);
    if (!innerContainer) return;

    const progressBar = innerContainer.querySelector("div.progress");
    if (!progressBar) return;

    progressBar.querySelector("p").innerText = "Completed";
    progressBar.querySelector("div").style.backgroundColor = "#B6C649";
    progressBar.querySelector("div").style.width = "100%";
    setTimeout(() => {
        innerContainer.remove(); // Удалить после завершения через 3 секунды
    }, 3000);
  };

  const abortProgress = (videoId) => { // Переименована для соответствия стилю
    const innerContainer = document.getElementById("tel-downloader-progress-" + videoId);
    if (!innerContainer) return;

    const progressBar = innerContainer.querySelector("div.progress");
    if (!progressBar) return;

    progressBar.querySelector("p").innerText = "Aborted";
    progressBar.querySelector("div").style.backgroundColor = "#D16666";
    progressBar.querySelector("div").style.width = "100%";
    setTimeout(() => {
        innerContainer.remove(); // Удалить после ошибки через 3 секунды
    }, 3000);
  };
  // --- Конец функций для управления прогресс-баром ---

  // --- Функции загрузки ---
  const tel_download_video = (url) => {
    let _blobs = [];
    let _next_offset = 0;
    let _total_size = null;
    let _file_extension = "mp4";

    const videoId =
      (Math.random() + 1).toString(36).substring(2, 10) +
      "_" +
      Date.now().toString();
    let fileName = `${hashCode(url).toString(36)}.${_file_extension}`;

    // Improved filename extraction
    try {
      const urlObj = new URL(url);
      const lastSegment = urlObj.pathname.split('/').pop();
      if (lastSegment) {
          try {
              const decodedLastSegment = decodeURIComponent(lastSegment);
              const metadata = JSON.parse(decodedLastSegment);
              if (metadata.fileName) {
                  fileName = metadata.fileName;
                  _file_extension = fileName.split('.').pop() || _file_extension;
              }
          } catch (e) {
              // Not a JSON string, try to extract extension from last segment
              const parts = lastSegment.split('.');
              if (parts.length > 1) {
                  const potentialExt = parts.pop();
                  if (potentialExt.length <= 4 && /^[a-zA-Z0-9]+$/.test(potentialExt)) { // Basic check for valid extension
                      _file_extension = potentialExt;
                      fileName = `${hashCode(url).toString(36)}.${_file_extension}`; // Re-form filename with new extension
                  }
              }
          }
      }
    } catch (e) {
      logger.error(`Error parsing URL or metadata: ${e.message}`, url);
    }
    logger.info(`URL: ${url}`, fileName);

    createProgressBar(videoId, fileName); // Создаем прогресс-бар здесь

    const fetchNextPart = (writable) => { // writable вместо _writable
      fetch(url, {
        method: "GET",
        headers: {
          Range: `bytes=${_next_offset}-`,
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0",
        },
      })
        .then((res) => {
          if (![200, 206].includes(res.status)) {
            throw new Error(`Non 200/206 response was received: ${res.status}`);
          }
          const mime = res.headers.get("Content-Type")?.split(";")?.[0]; // Optional chaining
          if (!mime || !mime.startsWith("video/")) {
            throw new Error(`Received non-video response with MIME type ${mime || 'N/A'}`);
          }
          _file_extension = mime.split("/")[1];
          // Обновляем расширение файла в имени, если оно изменилось
          if (!fileName.endsWith(`.${_file_extension}`)) {
            const nameWithoutExt = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
            fileName = `${nameWithoutExt}.${_file_extension}`;
          }

          const contentRangeHeader = res.headers.get("Content-Range");
          if (!contentRangeHeader) {
              // If Content-Range is missing, assume it's a full download (status 200)
              if (res.status === 200) {
                  _total_size = parseInt(res.headers.get("Content-Length"));
                  _next_offset = _total_size; // Mark as complete
                  logger.info(`Full download detected, total size: ${_total_size}`, fileName);
                  return res.blob();
              } else {
                  throw new Error("Content-Range header missing for partial content.");
              }
          }

          const match = contentRangeHeader.match(contentRangeRegex);
          if (!match) {
              throw new Error("Invalid Content-Range header format.");
          }

          const startOffset = parseInt(match[1]);
          const endOffset = parseInt(match[2]);
          const totalSize = parseInt(match[3]);

          if (startOffset !== _next_offset) {
            logger.error(`Gap detected between responses. Last offset: ${_next_offset}, New start offset: ${startOffset}`, fileName);
            throw new Error("Gap detected between responses.");
          }
          if (_total_size && totalSize !== _total_size) { // self-comparison is always false for non-NaN
            logger.error("Total size differs", fileName); // Probably meant totalSize !== _total_size
            throw new Error("Total size differs");
          }

          _next_offset = endOffset + 1;
          _total_size = totalSize;

          logger.info(
            `Get response: ${res.headers.get("Content-Length")} bytes data from ${res.headers.get("Content-Range")}`,
            fileName
          );
          const progress = ((_next_offset * 100) / _total_size).toFixed(0);
          logger.info(`Progress: ${progress}%`, fileName);
          updateProgress(videoId, fileName, progress);
          return res.blob();
        })
        .then((resBlob) => {
          if (writable) { // Проверка на null
            return writable.write(resBlob);
          } else {
            _blobs.push(resBlob);
            return Promise.resolve(); // Возвращаем Promise для цепочки
          }
        })
        .then(() => {
          if (_total_size === null) {
              throw new Error("_total_size is NULL after first fetch (should not happen for valid content-range)");
          }

          if (_next_offset < _total_size) {
            fetchNextPart(writable);
          } else {
            if (writable) {
              writable.close().then(() => {
                logger.info("Download finished (FileSystemAccess API)", fileName);
                completeProgress(videoId);
              }).catch(err => {
                  logger.error(`Error closing writable: ${err.message}`, fileName);
                  abortProgress(videoId);
              });
            } else {
              saveVideoBlob(); // Переименована функция сохранения
            }
          }
        })
        .catch((reason) => {
          logger.error(`Download failed: ${reason.message || reason}`, fileName);
          abortProgress(videoId);
        });
    };

    const saveVideoBlob = () => { // Переименована для ясности
      logger.info("Finish downloading blobs. Concatenating blobs and downloading...", fileName);

      const blob = new Blob(_blobs, { type: `video/${_file_extension}` }); // Использование определенного расширения
      const blobUrl = window.URL.createObjectURL(blob);

      logger.info(`Final blob size: ${blob.size} bytes`, fileName);

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      logger.info("Download triggered (Blob URL)", fileName);
      completeProgress(videoId); // Завершаем прогресс-бар
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
          types: [{
            description: 'Video Files',
            accept: {
              'video/*': ['.mp4', '.webm', '.ogg', '.mov']
            }
          }]
        })
        .then((handle) => {
          handle
            .createWritable()
            .then((writable) => {
              fetchNextPart(writable);
            })
            .catch((err) => {
              logger.error(`Error creating writable: ${err.name} - ${err.message}`, fileName);
              abortProgress(videoId);
            });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            logger.error(`Error showing save file picker: ${err.name} - ${err.message}`, fileName);
            abortProgress(videoId);
          } else {
            logger.info("File save dialog aborted by user.", fileName);
            abortProgress(videoId); // Отмечаем как отмененное
          }
        });
    } else {
      fetchNextPart(null);
    }
  };

  const tel_download_audio = (url) => {
    let _blobs = [];
    let _next_offset = 0;
    let _total_size = null;
    let _file_extension = "ogg"; // Предполагаемое расширение
    const audioId =
      (Math.random() + 1).toString(36).substring(2, 10) +
      "_" +
      Date.now().toString();
    let fileName = `${hashCode(url).toString(36)}.${_file_extension}`;

    // Можно добавить логику для извлечения имени файла из URL, если оно есть
    try {
        const urlObj = new URL(url);
        const lastSegment = urlObj.pathname.split('/').pop();
        if (lastSegment) {
            const parts = lastSegment.split('.');
            if (parts.length > 1) {
                const potentialExt = parts.pop();
                if (potentialExt.length <= 4 && /^[a-zA-Z0-9]+$/.test(potentialExt)) {
                    _file_extension = potentialExt;
                    fileName = `${hashCode(url).toString(36)}.${_file_extension}`;
                }
            }
        }
    } catch (e) {
        logger.error(`Error parsing audio URL: ${e.message}`, url);
    }

    createProgressBar(audioId, fileName); // Создаем прогресс-бар для аудио

    const fetchNextPart = (writable) => {
      fetch(url, {
        method: "GET",
        headers: {
          Range: `bytes=${_next_offset}-`,
        },
      })
        .then((res) => {
          if (![200, 206].includes(res.status)) {
            throw new Error(`Non 200/206 response was received: ${res.status}`);
          }

          const mime = res.headers.get("Content-Type")?.split(";")?.[0];
          if (!mime || !mime.startsWith("audio/")) {
            throw new Error(`Received non-audio response with MIME type ${mime || 'N/A'}`);
          }
          _file_extension = mime.split("/")[1];
          if (!fileName.endsWith(`.${_file_extension}`)) {
            const nameWithoutExt = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
            fileName = `${nameWithoutExt}.${_file_extension}`;
          }

          const contentRangeHeader = res.headers.get("Content-Range");
          if (!contentRangeHeader) {
              if (res.status === 200) {
                  _total_size = parseInt(res.headers.get("Content-Length"));
                  _next_offset = _total_size;
                  logger.info(`Full download detected for audio, total size: ${_total_size}`, fileName);
                  return res.blob();
              } else {
                  throw new Error("Content-Range header missing for partial audio content.");
              }
          }

          const match = contentRangeHeader.match(contentRangeRegex);
          if (!match) {
              throw new Error("Invalid Content-Range header format for audio.");
          }

          const startOffset = parseInt(match[1]);
          const endOffset = parseInt(match[2]);
          const totalSize = parseInt(match[3]);

          if (startOffset !== _next_offset) {
            logger.error(`Gap detected between audio responses. Last offset: ${_next_offset}, New start offset: ${startOffset}`);
            throw new Error("Gap detected between audio responses.");
          }
          if (_total_size && totalSize !== _total_size) {
            logger.error("Total audio size differs");
            throw new Error("Total audio size differs");
          }

          _next_offset = endOffset + 1;
          _total_size = totalSize;

          logger.info(
            `Get audio response: ${res.headers.get("Content-Length")} bytes data from ${res.headers.get("Content-Range")}`,
            fileName
          );
          const progress = ((_next_offset * 100) / _total_size).toFixed(0);
          updateProgress(audioId, fileName, progress);
          return res.blob();
        })
        .then((resBlob) => {
          if (writable) {
            return writable.write(resBlob);
          } else {
            _blobs.push(resBlob);
            return Promise.resolve();
          }
        })
        .then(() => {
          if (_total_size === null) {
            throw new Error("_total_size is NULL for audio after first fetch");
          }

          if (_next_offset < _total_size) {
            fetchNextPart(writable);
          } else {
            if (writable) {
              writable.close().then(() => {
                logger.info("Audio download finished (FileSystemAccess API)", fileName);
                completeProgress(audioId);
              }).catch(err => {
                  logger.error(`Error closing audio writable: ${err.message}`, fileName);
                  abortProgress(audioId);
              });
            } else {
              saveAudioBlob();
            }
          }
        })
        .catch((reason) => {
          logger.error(`Audio download failed: ${reason.message || reason}`, fileName);
          abortProgress(audioId);
        });
    };

    const saveAudioBlob = () => {
      logger.info(
        "Finish downloading audio blobs. Concatenating blobs and downloading...",
        fileName
      );

      const blob = new Blob(_blobs, { type: `audio/${_file_extension}` }); // Использование определенного расширения
      const blobUrl = window.URL.createObjectURL(blob);

      logger.info(`Final audio blob size in bytes: ${blob.size}`, fileName);

      // Нет необходимости в blob = 0; GC позаботится об этом
      // blob = 0;

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      logger.info("Audio download triggered", fileName);
      completeProgress(audioId);
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
          types: [{
            description: 'Audio Files',
            accept: {
              'audio/*': ['.ogg', '.mp3', '.wav', '.flac']
            }
          }]
        })
        .then((handle) => {
          handle
            .createWritable()
            .then((writable) => {
              fetchNextPart(writable);
            })
            .catch((err) => {
              logger.error(`Error creating audio writable: ${err.name} - ${err.message}`, fileName);
              abortProgress(audioId);
            });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            logger.error(`Error showing audio save file picker: ${err.name} - ${err.message}`, fileName);
            abortProgress(audioId);
          } else {
            logger.info("Audio file save dialog aborted by user.", fileName);
            abortProgress(audioId);
          }
        });
    } else {
      fetchNextPart(null);
    }
  };

  const tel_download_image = (imageUrl) => {
    // Попытаемся определить расширение из URL, если нет - по умолчанию 'jpeg'
    let fileName = (Math.random() + 1).toString(36).substring(2, 10);
    try {
        const urlObj = new URL(imageUrl);
        const pathSegments = urlObj.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment && lastSegment.includes('.')) {
            const parts = lastSegment.split('.');
            const potentialExt = parts[parts.length - 1];
            if (potentialExt.length <= 5 && /^[a-zA-Z0-9]+$/.test(potentialExt)) { // Простая проверка на валидность
                fileName += `.${potentialExt}`;
            } else {
                fileName += ".jpeg"; // Fallback
            }
        } else {
            fileName += ".jpeg"; // Fallback
        }
    } catch (e) {
        logger.error(`Error processing image URL for filename: ${e.message}`, imageUrl);
        fileName += ".jpeg"; // Fallback в случае ошибки URL
    }

    const imageId = (Math.random() + 1).toString(36).substring(2, 10) + "_" + Date.now().toString();
    createProgressBar(imageId, fileName); // Создаем прогресс-бар для изображений

    fetch(imageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("Content-Type");
            if (contentType && !fileName.includes('.')) { // Если расширение не определено из URL
                const mimeTypeParts = contentType.split('/');
                if (mimeTypeParts.length > 1) {
                    const ext = mimeTypeParts[1];
                    if (ext === "jpeg") fileName += ".jpg"; // Общепринятое расширение
                    else fileName += `.${ext}`;
                }
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = fileName;
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            logger.info("Image download triggered", fileName);
            completeProgress(imageId);
        })
        .catch(error => {
            logger.error(`Image download failed: ${error.message}`, fileName);
            abortProgress(imageId);
        });
  };
  // --- Конец функций загрузки ---


  logger.info("Initialized script.");

  // --- Функции для добавления кнопок ---
  const addDownloadButton = (container, type, url, prepend = false) => {
    // Проверяем, существует ли уже кнопка с этим URL, чтобы избежать дубликатов
    if (container.querySelector(`.tel-download[data-tel-download-url="${url}"]`)) {
      return;
    }

    const downloadIcon = document.createElement("i");
    // Используем класс icon, если он есть, иначе просто span
    if (container.closest('#MediaViewer') || container.closest('#StoryViewer')) { // Для webz
        downloadIcon.className = "icon icon-download";
    } else { // Для webk
        downloadIcon.className = "tgico button-icon";
        downloadIcon.innerHTML = DOWNLOAD_ICON;
    }

    const downloadButton = document.createElement("button");
    downloadButton.className = "tel-download"; // Общий класс для наших кнопок
    downloadButton.setAttribute("type", "button");
    downloadButton.setAttribute("title", "Download");
    downloadButton.setAttribute("aria-label", "Download");
    downloadButton.setAttribute("data-tel-download-url", url); // Для отслеживания дубликатов
    downloadButton.appendChild(downloadIcon);

    // Добавляем специфичные классы для стилизации в webz/webk
    if (container.closest('#MediaViewer') || container.closest('#StoryViewer')) { // webz
        downloadButton.classList.add("Button", "smaller", "translucent-white", "round");
    } else { // webk
        downloadButton.classList.add("btn-icon");
        if (type === 'audio') { // Для аудио кнопок в webk, используем другой стиль
            downloadButton.classList.add("_tel_download_button_pinned_container");
        } else {
            downloadButton.classList.add("tgico-download");
        }
        downloadButton.innerHTML += '<div class="c-ripple"></div>'; // Для эффекта нажатия в webk
    }

    downloadButton.onclick = (e) => {
      e.stopPropagation(); // Предотвращаем всплытие события, которое может закрыть медиапросмотр
      if (type === 'video') {
        tel_download_video(url);
      } else if (type === 'audio') {
        tel_download_audio(url);
      } else if (type === 'image') {
        tel_download_image(url);
      }
    };

    if (prepend) {
      container.prepend(downloadButton);
    } else {
      container.appendChild(downloadButton);
    }
    return downloadButton;
  };

  // Использование MutationObserver для более эффективного добавления кнопок
  // и предотвращения дублирования setInterval
  const setupObservers = () => {

    // Observer для webz /a/ app
    const webzObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Истории (webz)
          const storiesContainer = document.getElementById("StoryViewer");
          if (storiesContainer) {
            const storyHeader = storiesContainer.querySelector(".GrsJNw3y") || storiesContainer.querySelector(".DropdownMenu")?.parentNode;
            if (storyHeader) {
                const video = storiesContainer.querySelector("video");
                const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
                const images = storiesContainer.querySelectorAll("img.PVZ8TOWS");
                const imageSrc = images.length > 0 ? images[images.length - 1]?.src : null;

                if (videoSrc) {
                    addDownloadButton(storyHeader, 'video', videoSrc, true);
                } else if (imageSrc) {
                    addDownloadButton(storyHeader, 'image', imageSrc, true);
                }
            }
          }

          // Медиапросмотр (webz)
          const mediaContainer = document.querySelector("#MediaViewer .MediaViewerSlide--active");
          const mediaViewerActions = document.querySelector("#MediaViewer .MediaViewerActions");
          if (mediaContainer && mediaViewerActions) {
            const videoPlayer = mediaContainer.querySelector(".MediaViewerContent > .VideoPlayer");
            const img = mediaContainer.querySelector(".MediaViewerContent > div > img");

            if (videoPlayer) {
              const videoUrl = videoPlayer.querySelector("video")?.currentSrc;
              if (videoUrl) {
                // Кнопка в контролах видео
                const controls = videoPlayer.querySelector(".VideoPlayerControls");
                if (controls) {
                  const buttons = controls.querySelector(".buttons");
                  if (buttons) {
                    addDownloadButton(buttons, 'video', videoUrl);
                  }
                }
                // Кнопка в верхней панели MediaViewerActions
                addDownloadButton(mediaViewerActions, 'video', videoUrl, true);
              }
            } else if (img && img.src) {
              addDownloadButton(mediaViewerActions, 'image', img.src, true);
            }
          }
        }
      });
    });

    webzObserver.observe(document.body, { childList: true, subtree: true, attributes: true });


    // Observer для webk /k/ app
    const webkObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            // Аудиосообщения и кружочки (webk)
            document.querySelectorAll("audio-element").forEach((audioElement) => {
                const bubble = audioElement.closest(".bubble");
                const link = audioElement.audio?.src;
                if (bubble && link) { // Проверяем bubble и link
                    const isAudio = audioElement.audio instanceof HTMLAudioElement;
                    const container = bubble.querySelector(".message-body-wrapper .bubble-content"); // Или другой подходящий контейнер
                    if (container) {
                        // Для голосовых сообщений и кружочков, добавляем кнопку рядом
                        // Проверяем, что кнопка еще не добавлена в этот конкретный пузырь
                        if (!container.querySelector('.tel-download[data-tel-download-url]')) {
                            addDownloadButton(container, isAudio ? 'audio' : 'video', link);
                        }
                    }
                }
            });

            // Истории (webk)
            const storiesContainer = document.getElementById("stories-viewer");
            if (storiesContainer) {
                const storyHeader = storiesContainer.querySelector("[class^='_ViewerStoryHeaderRight']");
                const storyFooter = storiesContainer.querySelector("[class^='_ViewerStoryFooterRight']");

                const video = storiesContainer.querySelector("video.media-video");
                const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
                const imageSrc = storiesContainer.querySelector("img.media-photo")?.src;

                if (storyHeader) {
                    if (videoSrc) addDownloadButton(storyHeader, 'video', videoSrc, true);
                    else if (imageSrc) addDownloadButton(storyHeader, 'image', imageSrc, true);
                }
                if (storyFooter) {
                    if (videoSrc) addDownloadButton(storyFooter, 'video', videoSrc, true);
                    else if (imageSrc) addDownloadButton(storyFooter, 'image', imageSrc, true);
                }
            }

            // Медиапросмотр (webk)
            const mediaContainer = document.querySelector(".media-viewer-whole");
            if (mediaContainer) {
                const mediaAspecter = mediaContainer.querySelector(".media-viewer-movers .media-viewer-aspecter");
                const mediaButtons = mediaContainer.querySelector(".media-viewer-topbar .media-viewer-buttons");

                if (mediaAspecter && mediaButtons) {
                    // Раскрываем скрытые официальные кнопки
                    const hiddenButtons = mediaButtons.querySelectorAll("button.btn-icon.hide");
                    for (const btn of hiddenButtons) {
                        btn.classList.remove("hide");
                        if (btn.textContent === FORWARD_ICON) {
                            btn.classList.add("tgico-forward");
                        }
                        if (btn.textContent === DOWNLOAD_ICON) {
                            btn.classList.add("tgico-download");
                        }
                    }

                    const videoElement = mediaAspecter.querySelector("video");
                    const imgElement = mediaAspecter.querySelector("img.thumbnail");

                    if (videoElement && videoElement.src) {
                        addDownloadButton(mediaButtons, 'video', videoElement.src, true);
                        // Дополнительная кнопка в контролах видеоплеера
                        const controls = mediaAspecter.querySelector(".default__controls.ckin__controls");
                        if (controls) {
                            const brControls = controls.querySelector(".bottom-controls .right-controls");
                            if (brControls) {
                                addDownloadButton(brControls, 'video', videoElement.src, true);
                            }
                        }
                    } else if (imgElement && imgElement.src) {
                        addDownloadButton(mediaButtons, 'image', imgElement.src, true);
                    }
                }
            }
        }
      });
    });

    webkObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

  }; // End of setupObservers

  // Прогресс-бар контейнер
  function setupProgressBar() {
    const body = document.querySelector("body");
    let container = document.getElementById("tel-downloader-progress-bar-container");
    if (container) return; // Уже существует

    container = document.createElement("div");
    container.id = "tel-downloader-progress-bar-container";
    container.style.position = "fixed";
    container.style.bottom = "1rem"; // Отступ от низа
    container.style.right = "1rem"; // Отступ от права
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "0.5rem"; // Расстояние между прогресс-барами

    if (location.pathname.startsWith("/k/")) {
      container.style.zIndex = 4;
    } else {
      container.style.zIndex = 1600;
    }
    body.appendChild(container);
    logger.info("Progress bar container created.");
  }


  // Запускаем наблюдателей после инициализации скрипта
  // Вместо setInterval для добавления кнопок, используем MutationObserver
  // Однако, так как Telegram динамически загружает контент,
  // мы можем оставить setInterval для периодической проверки,
  // или использовать observer более специфично.
  // Для простоты, пока оставим setInterval, но с учетом, что addDownloadButton
  // предотвратит дубликаты. В более сложной реализации MutationObserver будет лучше.

  // Используем setInterval для периодического вызова функции,
  // которая будет запускать логику добавления кнопок.
  // Это менее эффективно, чем MutationObserver, но проще в реализации для динамически
  // появляющихся элементов в Telegram Web. Функция addDownloadButton предотвратит дублирование.

  // NOTE: Original script used setInterval, I will keep that pattern,
  // but wrap the logic into a single function to avoid redundancy.
  setInterval(() => {
    // webz /a/ app
    const storiesContainerWebz = document.getElementById("StoryViewer");
    if (storiesContainerWebz) {
        const storyHeader = storiesContainerWebz.querySelector(".GrsJNw3y") || storiesContainerWebz.querySelector(".DropdownMenu")?.parentNode;
        if (storyHeader) {
            const video = storiesContainerWebz.querySelector("video");
            const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
            const images = storiesContainerWebz.querySelectorAll("img.PVZ8TOWS");
            const imageSrc = images.length > 0 ? images[images.length - 1]?.src : null;

            if (videoSrc) {
                addDownloadButton(storyHeader, 'video', videoSrc, true);
            } else if (imageSrc) {
                addDownloadButton(storyHeader, 'image', imageSrc, true);
            }
        }
    }

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

    // webk /k/ app
    document.querySelectorAll("audio-element").forEach((audioElement) => {
        const bubble = audioElement.closest(".bubble");
        const link = audioElement.audio?.src;
        if (bubble && link) {
            const isAudio = audioElement.audio instanceof HTMLAudioElement;
            const container = bubble.querySelector(".message-body-wrapper .bubble-content");
            if (container) {
                // Это добавит кнопку для каждого аудиоэлемента, который еще не имеет кнопки
                addDownloadButton(container, isAudio ? 'audio' : 'video', link);
            }
        }
    });

    const storiesContainerWebk = document.getElementById("stories-viewer");
    if (storiesContainerWebk) {
        const storyHeader = storiesContainerWebk.querySelector("[class^='_ViewerStoryHeaderRight']");
        const storyFooter = storiesContainerWebk.querySelector("[class^='_ViewerStoryFooterRight']");

        const video = storiesContainerWebk.querySelector("video.media-video");
        const videoSrc = video?.src || video?.currentSrc || video?.querySelector("source")?.src;
        const imageSrc = storiesContainerWebk.querySelector("img.media-photo")?.src;

        if (storyHeader) {
            if (videoSrc) addDownloadButton(storyHeader, 'video', videoSrc, true);
            else if (imageSrc) addDownloadButton(storyHeader, 'image', imageSrc, true);
        }
        if (storyFooter) {
            if (videoSrc) addDownloadButton(storyFooter, 'video', videoSrc, true);
            else if (imageSrc) addDownloadButton(storyFooter, 'image', imageSrc, true);
        }
    }

    const mediaContainerWebk = document.querySelector(".media-viewer-whole");
    if (mediaContainerWebk) {
        const mediaAspecter = mediaContainerWebk.querySelector(".media-viewer-movers .media-viewer-aspecter");
        const mediaButtons = mediaContainerWebk.querySelector(".media-viewer-topbar .media-viewer-buttons");

        if (mediaAspecter && mediaButtons) {
            // Раскрываем скрытые официальные кнопки
            const hiddenButtons = mediaButtons.querySelectorAll("button.btn-icon.hide");
            for (const btn of hiddenButtons) {
                btn.classList.remove("hide");
                if (btn.textContent === FORWARD_ICON) {
                    btn.classList.add("tgico-forward");
                }
                if (btn.textContent === DOWNLOAD_ICON) {
                    btn.classList.add("tgico-download");
                    // Если есть официальная кнопка, мы можем просто нажать ее
                    // Но для единообразия и прогресс-бара, все равно используем наш метод
                    // btn.onclick = () => btn.click(); // Или можно оставить это
                }
            }

            const videoElement = mediaAspecter.querySelector("video");
            const imgElement = mediaAspecter.querySelector("img.thumbnail");

            if (videoElement && videoElement.src) {
                addDownloadButton(mediaButtons, 'video', videoElement.src, true);
                const controls = mediaAspecter.querySelector(".default__controls.ckin__controls");
                if (controls) {
                    const brControls = controls.querySelector(".bottom-controls .right-controls");
                    if (brControls) addDownloadButton(brControls, 'video', videoElement.src, true);
                }
            } else if (imgElement && imgElement.src) {
                addDownloadButton(mediaButtons, 'image', imgElement.src, true);
            }
        }
    }
  }, REFRESH_DELAY);


  setupProgressBar(); // Убедимся, что контейнер прогресс-бара создан при запуске

  logger.info("Completed script setup and started monitoring.");
})();