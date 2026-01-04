// ==UserScript==
// @name            RPGEN - Sprites to Discord Emoji
// @name:ja         RPGEN - スプライトをDiscordの絵文字に変換
// @description     User script to convert RPGEN sprites for Discord emojis.
// @description:ja  RPGENのスプライトをDiscordの絵文字用に変換するユーザースクリプトです。
// @version         1.0.1
// @icon            data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAADzbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3///////NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3///////NtTf/zbU3/821N//NtTf/zbU3/821N///////zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N///////zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N///////zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3///////NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N///////zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3///////NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N///////zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf//////821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/821N//NtTf/zbU3/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match           https://rpgen.site/dq/sprites/*
// @match           https://rpgen.site/dq/sAnims/*
// @connect         rpgen.pw
// @namespace       https://github.com/sqrtox/userscript-rpgen-discord-emoji
// @author          sqrtox
// @license         MIT
// @grant           unsafeWindow
// @grant           GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468091/RPGEN%20-%20Sprites%20to%20Discord%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/468091/RPGEN%20-%20Sprites%20to%20Discord%20Emoji.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/utils/getOutermostPixels.ts
  var getOutermostPixels = ({
    data,
    width,
    height
  }) => {
    const pixels = [];
    const idx = ([x, y]) => width * 4 * y + x * 4;
    const isIgnorePx = ({ color }) => color[3] === 0;
    const getPx = (pos) => {
      const i = idx(pos);
      if (typeof data[i] === "undefined") {
        return;
      }
      return {
        color: [data[i], data[i + 1], data[i + 2], data[i + 3]],
        pos
      };
    };
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const prev = getPx([x - 1, y]);
        const px = getPx([x, y]);
        const next = getPx([x + 1, y]);
        if (px && !isIgnorePx(px) && (!prev || isIgnorePx(prev) || !next || isIgnorePx(next))) {
          pixels.push(px);
        }
      }
    }
    return {
      top: pixels.reduce((a, b) => a.pos[1] < b.pos[1] ? a : b),
      right: pixels.reduce((a, b) => a.pos[0] > b.pos[0] ? a : b),
      bottom: pixels.reduce((a, b) => a.pos[1] > b.pos[1] ? a : b),
      left: pixels.reduce((a, b) => a.pos[0] < b.pos[0] ? a : b)
    };
  };

  // src/utils/loadImage.ts
  var loadImage = (src, crossOrigin = false) => new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const controller = new AbortController();
    const cleanUp = () => controller.abort();
    img.addEventListener("error", (ev) => {
      cleanUp();
      reject(ev);
    }, {
      once: true,
      signal: controller.signal
    });
    img.addEventListener("load", () => {
      cleanUp();
      resolve(img);
    }, {
      once: true,
      signal: controller.signal
    });
    if (crossOrigin) {
      GM.xmlHttpRequest({
        url: src,
        method: "GET",
        responseType: "blob",
        onload: (res) => {
          img.src = URL.createObjectURL(res.response);
        },
        onerror: (res) => reject(res)
      });
    } else {
      img.src = src;
    }
  });

  // src/index.ts
  var [, spriteType, spriteId] = location.pathname.match(/^\/dq\/(sprites|sAnims)\/(\d+)\/$/) ?? [];
  if (location.hostname !== "rpgen.site" || !spriteType || !spriteId) {
    throw new Error();
  }
  var EMOJI_SIZE = 128;
  var SPRITE_SIZE = 16;
  var ZOOM_RATIO = EMOJI_SIZE / SPRITE_SIZE;
  var rpgenButtonWrapper = document.getElementById("idCopyIndex")?.parentNode;
  if (!rpgenButtonWrapper) {
    throw new Error();
  }
  var buttonWrapper = document.createElement("div");
  buttonWrapper.style.marginTop = "25px";
  rpgenButtonWrapper.parentNode?.insertBefore(buttonWrapper, rpgenButtonWrapper.nextSibling);
  var downloadButton = document.createElement("button");
  downloadButton.textContent = "絵文字としてダウンロード";
  downloadButton.style.padding = "9px 15px";
  downloadButton.classList.add("button");
  buttonWrapper.append(downloadButton);
  downloadButton.addEventListener("click", async () => {
    try {
      const cv = new OffscreenCanvas(SPRITE_SIZE, SPRITE_SIZE);
      const ctx = cv.getContext("2d");
      if (!ctx) {
        throw new Error();
      }
      const spriteUrl = spriteType === "sAnims" ? `https://rpgen.pw/dq/sAnims/res/${spriteId}s.png` : `https://rpgen.site/dq/sprites/${spriteId}/sprite.png`;
      const img = await loadImage(spriteUrl, true);
      ctx.drawImage(img, 0, 0);
      const { top, left, bottom, right } = getOutermostPixels(ctx.getImageData(0, 0, SPRITE_SIZE, SPRITE_SIZE));
      const afterWidth = Math.abs(left.pos[0] - right.pos[0]) + 1;
      const afterHeight = Math.abs(top.pos[1] - bottom.pos[1]) + 1;
      const afterImgData = ctx.getImageData(
        left.pos[0],
        top.pos[1],
        afterWidth,
        afterHeight
      );
      const dist = new OffscreenCanvas(afterWidth, afterHeight);
      const distCtx = dist.getContext("2d");
      if (!distCtx) {
        throw new Error();
      }
      distCtx.putImageData(afterImgData, 0, 0);
      const distImg = await loadImage(URL.createObjectURL(await dist.convertToBlob()));
      dist.width = afterWidth * ZOOM_RATIO;
      dist.height = afterHeight * ZOOM_RATIO;
      distCtx.imageSmoothingEnabled = false;
      distCtx.drawImage(distImg, 0, 0, distImg.naturalWidth, distImg.naturalHeight, 0, 0, dist.width, dist.height);
      const a = document.createElement("a");
      a.download = `${spriteId}.png`;
      a.href = URL.createObjectURL(await dist.convertToBlob({
        type: "image/png"
      }));
      a.click();
    } catch (err) {
      alert("エラーが発生しました");
      console.error(err);
    }
  });
})();
