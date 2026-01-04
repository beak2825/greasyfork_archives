// ==UserScript==
// @name         bilibili download
// @name:zh      bilibili 视频下载
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  bilibili视频下载 可以切换是否合并音视频 可以打开F12 开发者工具 查看下载进度
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460537/bilibili%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/460537/bilibili%20download.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  const CONFIG = "tampermonkey_config";
  const changeDownloadMode = (userConfig = { merge: false }) => {
    let config = getStorageItem(CONFIG) || {};
    localStorage.setItem(
      CONFIG,
      JSON.stringify({
        ...config,
        ...userConfig,
      })
    );
  };

  const getStorageItem = (key) => {
    let item = localStorage.getItem(key);
    if (item) {
      try {
        item = JSON.parse(item);
      } catch (error) {
        item = null;
        console.log(error);
      }
    }
    return item;
  };

  const getPlayInfo = async () => {
    const res = await fetch(window.location.href);
    const str = await res.text();
    return JSON.parse(str.match(/window.__playinfo__=([\d\D]+?)<\/script>/)[1]);
  };

  const initFFmpeg = () => {
    const { createFFmpeg } = FFmpeg;
    let ffmpeg = null;
    if (ffmpeg === null) {
      ffmpeg = createFFmpeg({ log: false });
    }
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
    return ffmpeg;
  };

  const getProgressElement = () => {
    if (document.querySelector(".downloadProgress")) {
      return document.querySelector(".downloadProgress");
    } else {
      const progress = document.createElement("progress");
      const style = `
      width: 100vw;
      height: 5px;
      position: fixed;
      top: 0;
      z-index: 99999999;
      `;
      progress.className = "downloadProgress";
      progress.style = style;
      document.body.append(progress);
      return progress;
    }
  };

  const fetchFile = async (url) => {
    const res = await fetch(url);
    const reader = res.body.getReader();
    const contentLength = +res.headers.get("Content-Length");
    if (!contentLength) {
      const data = await res.arrayBuffer();
      return new Uint8Array(data);
    }

    const progress = getProgressElement();
    progress.max = contentLength;

    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      console.log(
        `fileSize: ${contentLength} %c downloaded ${receivedLength}`,
        "background: #222; color: #bada55"
      );
      progress.value = receivedLength;
    }

    const config = getStorageItem(CONFIG);

    if (config?.merge === false) {
      return new Blob(chunks);
    }

    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    return chunksAll;
  };

  const transcode = async (video, audio) => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS("writeFile", "video.mp4", video);
    ffmpeg.FS("writeFile", "audio.mp3", audio);
    // ffmpeg -i video.mp4 -i audio.mp3 -c copy -map 0:v:0 -map 1:a:0 output.mp4
    await ffmpeg.run(
      ...`-i video.mp4 -i audio.mp3 -c copy -map 0:v:0 -map 1:a:0 output.mp4`.split(
        " "
      )
    );
    const data = ffmpeg.FS("readFile", "output.mp4");
    return new Blob([data.buffer], { type: "video/mp4" });
  };

  const download = async (data, fileName = "download.mp4") => {
    const link = window.URL.createObjectURL(data);
    const div = document.createElement("div");
    div.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    const a = document.createElement("a");
    a.href = link;
    a.download = fileName;
    div.appendChild(a);
    document.body.appendChild(div);
    a.click();
    document.body.removeChild(div);
    window.URL.revokeObjectURL(link);

    const progress = getProgressElement();
    document.body.removeChild(progress);
  };

  const startDownload = async (videoUrl, audioUrl, fileName) => {
    const config = getStorageItem(CONFIG);
    const audio = await fetchFile(audioUrl);
    const video = await fetchFile(videoUrl);
    if (config?.merge === false) {
      download(audio, `audio_${fileName}`);
      download(video, `video_${fileName}`);
      console.log(
        `%c if you want to merge audio and video, please use { changeDownloadMode({merge: true}) } to change`,
        "background: #222; color: #bada55"
      );
    } else {
      console.log(
        `%c merge audio and video, if you do not want to merge, just need download single audio and video, please use { changeDownloadMode({merge: false}) } to change`,
        "background: #222; color: #bada55"
      );
      const data = await transcode(video, audio);
      download(data, fileName);
    }
  };

  const addDownloadBtn = (e) => {
    if (
      e.target !==
      document.querySelector(
        "#bilibili-player .bpx-player-primary-area .bpx-player-video-area .bpx-player-control-wrap .bpx-player-control-entity .bpx-player-control-bottom .bpx-player-ctrl-quality-result"
      )
    ) {
      return;
    }
    document
      .querySelectorAll(
        ".bpx-player-ctrl-quality-menu .bpx-player-ctrl-quality-menu-item"
      )
      ?.forEach((ele) => {
        if (ele.children?.length === 1) {
          const div = document.createElement("div");
          div.textContent = "下载";
          div.className =
            "bpx-player-ctrl-quality-badge bpx-player-ctrl-quality-badge-bigvip";
          div.addEventListener("click", async (e) => {
            e.stopPropagation();
            const fileName =
              document.querySelector("#viewbox_report > h1")?.textContent;
            const playinfo = await getPlayInfo();
            const dash = playinfo.data.dash;
            const quality = ele.textContent;
            const video =
              dash.video.find((i) => quality.includes(i.height)) ||
              dash.video.sort((a, b) => b.height - a.height)[0];
            const audio = dash.audio[0];
            startDownload(
              video.baseUrl,
              audio.baseUrl,
              `${fileName}_${Date.now()}.mp4`
            );
          });
          ele.appendChild(div);
        }
      });
  };

  window.changeDownloadMode = changeDownloadMode;
  const ffmpeg = initFFmpeg();
  document.addEventListener("mouseover", addDownloadBtn);
})();
