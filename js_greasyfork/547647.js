// ==UserScript==
// @name         Save Audio from HTML5 Video (WebM/OGG) — own/allowed content only
// @namespace    https://greasyfork.org/users/your-name
// @license MIT
// @version      1.0
// @description  Добавляет кнопку рядом с <video> для записи и сохранения аудио как WebM/OGG. Только для вашего или разрешённого контента без DRM.
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547647/Save%20Audio%20from%20HTML5%20Video%20%28WebMOGG%29%20%E2%80%94%20ownallowed%20content%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/547647/Save%20Audio%20from%20HTML5%20Video%20%28WebMOGG%29%20%E2%80%94%20ownallowed%20content%20only.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_CLASS = "gf-save-audio-btn";

  const getSupportedMime = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/ogg;codecs=opus",
      "audio/webm",
      "audio/ogg"
    ];
    return types.find(t => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) || null;
  };

  const sanitize = (s) => s.replace(/[\\/:*?"<>|]+/g, "_").trim();

  const makeButton = (video) => {
    if (video.dataset.gfsabInit === "1") return;
    video.dataset.gfsabInit = "1";

    // Контейнер под кнопки
    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.gap = "8px";
    bar.style.alignItems = "center";
    bar.style.margin = "6px 0";
    bar.style.font = "14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial";

    const btn = document.createElement("button");
    btn.textContent = "Сохранить аудио";
    btn.className = BTN_CLASS;
    Object.assign(btn.style, {
      padding: "6px 10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: "#f7f7f7",
      cursor: "pointer"
    });

    const hint = document.createElement("span");
    hint.textContent = "Запись идёт в реальном времени; видео должно проигрываться.";
    hint.style.opacity = "0.8";

    bar.appendChild(btn);
    bar.appendChild(hint);

    // Вставляем панель сразу после видео
    if (video.parentElement) {
      video.parentElement.insertBefore(bar, video.nextSibling);
    } else {
      video.insertAdjacentElement("afterend", bar);
    }

    let recorder = null;
    let chunks = [];
    let stopping = false;

    const stopAndSave = () => {
      if (recorder && recorder.state !== "inactive" && !stopping) {
        stopping = true;
        recorder.stop();
      }
    };

    btn.addEventListener("click", async () => {
      // Если уже пишем — останавливаем
      if (recorder && recorder.state === "recording") {
        stopAndSave();
        return;
      }

      const mime = getSupportedMime();
      if (!mime) {
        alert("MediaRecorder не поддерживает аудио-форматы (WebM/OGG) в этом браузере.");
        return;
      }

      const capture = video.captureStream || video.mozCaptureStream;
      if (!capture) {
        alert("Этот браузер/страница не поддерживает captureStream для видео.");
        return;
      }

      const stream = capture.call(video);
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks || audioTracks.length === 0) {
        alert("У видео не обнаружена аудио-дорожка или она недоступна (возможны ограничения CORS/DRM).");
        return;
      }

      const audioStream = new MediaStream([audioTracks[0]]);
      chunks = [];
      stopping = false;

      try {
        recorder = new MediaRecorder(audioStream, { mimeType: mime });
      } catch (e) {
        console.error(e);
        alert("Не удалось запустить MediaRecorder.");
        return;
      }

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: mime });
          const url = URL.createObjectURL(blob);
          const title = sanitize(document.title || "audio");
          const ext = mime.includes("ogg") ? "ogg" : "webm";
          const ts = new Date().toISOString().replace(/[:.]/g, "-");
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title}-${ts}.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } finally {
          btn.textContent = "Сохранить аудио";
        }
      };

      // Авто-стоп в конце
      const onEnded = () => stopAndSave();
      video.addEventListener("ended", onEnded, { once: true });

      recorder.start();
      btn.textContent = "Стоп и сохранить аудио";

      // Если видео на паузе — пробуем запустить воспроизведение
      try {
        if (video.paused) await video.play();
      } catch {
        // Браузер может требовать пользовательского взаимодействия
      }
    });
  };

  const scan = () => document.querySelectorAll("video").forEach(makeButton);
  scan();

  // Отслеживаем динамически добавленные видео
  const mo = new MutationObserver(() => scan());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();