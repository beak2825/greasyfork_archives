// ==UserScript==
// @name     SF轻小说章节自动下载
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description 打开SF轻小说章节页面时自动保存文章到本地, 支持付费章节。
// @grant    none
// @include	 http://book.sfacg.com/Novel/*/*/*/
// @include	 http://book.sfacg.com/vip/c/*/
// @include	 https://book.sfacg.com/Novel/*/*/*/
// @include	 https://book.sfacg.com/vip/c/*/
// @run-at   document-idle
// @version   2023.12.05+8005e7f4
// @downloadURL https://update.greasyfork.org/scripts/416201/SF%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%AB%A0%E8%8A%82%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/416201/SF%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%AB%A0%E8%8A%82%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/utils/urlLastPart.ts
  function urlLastPart(url) {
    return url.split("/").filter((i) => i).slice(-1)[0];
  }

  // src/utils/downloadFile.ts
  function downloadFile(file, filename = `${urlLastPart(location.pathname)} ${document.title}.md`) {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(file);
    anchor.download = filename;
    anchor.style["display"] = "none";
    document.body.append(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(anchor.href);
    }, 0);
  }

  // src/utils/elementRootText.ts
  function elementRootText(element) {
    let ret = "";
    for (const i of element.childNodes) {
      if (i.nodeType === i.TEXT_NODE) {
        ret += i.nodeValue;
      }
    }
    return ret.trim();
  }

  // src/utils/canvasToMarkdown.ts
  function canvasToMarkdown(canvas, alt = "", title = "") {
    return `![${alt}](${canvas.toDataURL()} "${title}")`;
  }

  // src/utils/isCanvasTainted.ts
  function isCanvasTainted(canvas) {
    try {
      canvas.getContext("2d").getImageData(0, 0, 1, 1);
      return false;
    } catch (err) {
      return err instanceof DOMException && err.name === "SecurityError";
    }
  }

  // src/utils/imageToCanvas.ts
  function imageToCanvas(_0) {
    return __async(this, arguments, function* (img, {
      background
    } = {}) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      if (img.src && img.crossOrigin !== "anonymous" && isCanvasTainted(canvas)) {
        const corsImage = new Image();
        corsImage.crossOrigin = "anonymous";
        corsImage.src = img.src;
        yield corsImage.decode();
        return imageToCanvas(corsImage, { background });
      }
      return canvas;
    });
  }

  // src/utils/imageToMarkdown.ts
  function imageToMarkdown(_0) {
    return __async(this, arguments, function* (img, {
      background
    } = {}) {
      return canvasToMarkdown(
        yield imageToCanvas(img, { background }),
        img.alt,
        img.title
      );
    });
  }

  // src/sfacg.com/book-download.user.ts
  var __name__ = "SF轻小说章节自动下载";
  (function() {
    return __async(this, null, function* () {
      const chapter = document.querySelector("#article .article-title").textContent;
      let lines = [
        `# ${chapter}`,
        `[原始页面](${location.href})`,
        ...document.querySelector("#article .article-desc").textContent.split(/\n */).filter((i) => i),
        `---`
      ];
      const keywords = document.querySelector("meta[name='keywords']").content.split(",").filter((i) => !["小说下载", "TXT"].includes(i)).filter((i, index, keywords2) => index === 0 || !i.startsWith(keywords2[0]));
      for (const i of document.querySelectorAll("img#vipImage")) {
        console.log(`${__name__}: 等待图片加载`);
        yield i.decode();
        console.log(`${__name__}: 图片加载完毕`);
        const line = yield imageToMarkdown(i, { background: "white" });
        lines.push(line);
      }
      for (const i of document.querySelectorAll("#ChapterBody p")) {
        const line = elementRootText(i);
        lines.push(line);
        for (const img of i.querySelectorAll("img")) {
          lines.push(yield imageToMarkdown(img));
        }
      }
      lines = lines.filter((i) => i.length > 0);
      console.log(`${__name__}: 获取到 ${lines.length} 行`);
      const file = new Blob([lines.join("\n\n"), "\n"], {
        type: "text/markdown"
      });
      downloadFile(file, `${keywords.join(" ")}.md`);
    });
  })();
})();
