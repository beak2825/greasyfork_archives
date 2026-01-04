// ==UserScript==
// @name         勤思课程下载(自用)
// @namespace    http://tampermonkey.net/
// @version      2023-12-29
// @description  test
// @author       You
// @match        https://ke.qsiedu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483494/%E5%8B%A4%E6%80%9D%E8%AF%BE%E7%A8%8B%E4%B8%8B%E8%BD%BD%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483494/%E5%8B%A4%E6%80%9D%E8%AF%BE%E7%A8%8B%E4%B8%8B%E8%BD%BD%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.clear = function () {};
  let videoEl;
  const sourceBuffers = [];
  window.sourceBuffers = sourceBuffers;

  const _addSourceBuffer = MediaSource.prototype.addSourceBuffer;
  MediaSource.prototype.addSourceBuffer = function (mime) {
    const buffers = [];
    const sourceBuffer = _addSourceBuffer.call(this, mime);

    videoEl = document.querySelector("video.pv-video");
    if (sourceBuffers.length >= 2) {
      sourceBuffers.length = 0;
    }

    const _append = sourceBuffer.appendBuffer;
    sourceBuffer.appendBuffer = function (buffer) {
      if (buffers.length === 0) {
        videoEl.playbackRate = 10;
      }
      buffers.push(buffer);
      _append.call(this, buffer);
    };

    sourceBuffers.push({
      mime,
      buffers,
      msInstance: this,
    });

    return sourceBuffer;
  };
  MediaSource.prototype.addSourceBuffer.toString = function () {
    return "function addSourceBuffer() { [native code] }";
  };

  const _endOfStream = MediaSource.prototype.endOfStream;
  MediaSource.prototype.endOfStream = function () {
    setTimeout(() => {
      for (const sb of this.sourceBuffers) {
        const buf = sb.buffered;
        if (buf.length === 1) {
          if (videoEl.duration - buf.end(0) <= 0.05) {
            download();
            console.log("🚀 ~ 视频加载完成:", getName());
            break;
          }
        } else {
          console.warn(`🚀 ~ buffered 长度为${buf.length}:`, getName());
        }
      }
    });
    _endOfStream.call(this);
  };

  const _getItem = localStorage.getItem;
  localStorage.getItem = function (key) {
    if (key === "polyvPlayerStorage") {
      const storage = _getItem.call(this, "polyvPlayerStorage");
      try {
        const json = JSON.parse(storage) || {};
        for (const key in json) {
          if (key.indexOf("startTime-") === 0) {
            json[key] = 0;
          }
        }
        return JSON.stringify(json);
      } catch (e) {}
    }
    return _getItem.call(this, key);
  };

  function getName() {
    let name = "";
    try {
      // 课程名称
      const courseName = document.title.split("-")[1];
      // 章节名称
      let chapterName = "";
      // 小节名称
      let sectionName = "";
      const chapterDomList = document.querySelectorAll(".ant-collapse-item");
      for (let i = 0; i < chapterDomList.length; i++) {
        const item = chapterDomList[i];
        const curCourseDom = item.querySelector(
          ".kc-list.active .zj-content h5"
        );
        if (curCourseDom) {
          sectionName = curCourseDom.innerText;
          chapterName =
            `第${i + 1}章` +
            item.querySelector(".ant-collapse-header").innerText;
          break;
        }
      }
      if (courseName && chapterName && sectionName) {
        name = `${courseName}_${chapterName}_${sectionName}`;
      } else {
        name = document.title;
      }
    } catch (e) {
      console.warn("🚀 ~ getName ~ e:", e);
      name = document.title;
    }
    return name;
  }

  function download() {
    for (const target of sourceBuffers) {
      const mime = target.mime.split(";")[0];
      const type = mime.split("/");
      const fileBlob = new Blob(target.buffers, { type: mime });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(fileBlob);
      a.download = `${getName()}_${type[0]}.${type[1]}`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }
})();
