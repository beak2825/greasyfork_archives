// ==UserScript==
// @name            YouTube - Thumbnail Anywhere
// @name:ja         YouTube - サムネイルといっしょ
// @description     A user script to add a little functionality related to YouTube thumbnails.
// @description:ja  YouTubeのサムネイルに関するちょっとした機能を追加するユーザースクリプトです。
// @version         1.0.1
// @icon            https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com
// @match           https://www.youtube.com/*
// @namespace       https://github.com/sqrtox/yt-thumbnail-anywhere
// @author          sqrtox
// @license         MIT
// @grant           none
// @runAt           document-end
// @downloadURL https://update.greasyfork.org/scripts/523576/YouTube%20-%20Thumbnail%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/523576/YouTube%20-%20Thumbnail%20Anywhere.meta.js
// ==/UserScript==

// NOTE: This file was built by esbuild

(async () => {
  "use strict";

  // src/css.ts
  var CSS_CLASS_PREFIX = "userscript-";
  var createCssClasses = (...classes) => {
    const result = {};
    for (const class_ of classes) {
      result[class_] =
        `${CSS_CLASS_PREFIX}${Math.random().toString(36).slice(2)}`;
    }
    return result;
  };
  var injectCss = (css) => {
    const style = document.createElement("style");
    style.setHTMLUnsafe(css);
    document.head.append(style);
  };

  // src/image.ts
  var loadImage = (src) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    const events = new AbortController();
    const image = document.createElement("img");
    image.addEventListener(
      "load",
      () => {
        events.abort();
        resolve(image);
      },
      {
        signal: events.signal,
      },
    );
    image.addEventListener(
      "error",
      () => {
        events.abort();
        reject();
      },
      {
        signal: events.signal,
      },
    );
    image.src = src;
    return promise;
  };

  // src/thumbnail.ts
  var applySmallThumbnail = async (watchId, largeThumbnail2) => {
    const classes = createCssClasses("title", "smallThumbnail");
    injectCss(`
  .${classes.title} {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }


  .${classes.smallThumbnail} {
      height: 64px;
  }

  .${classes.smallThumbnail}:hover {
    position: relative;
  }

  .${classes.smallThumbnail}:hover::after {
    position: absolute;
    cursor: zoom-in;
    top: 0;
    left: 0;
    content: "";
    backdrop-filter: brightness(0.75);
    width: 100%;
    height: 100%;
  }

  .${classes.smallThumbnail} img {
    height: 100%;
    width: auto;
  }
`);
    const title = document.querySelector("#title:has(> h1)");
    if (!title) {
      return;
    }
    title.classList.add(classes.title);
    const events = new AbortController();
    const smallThumbnail = document.createElement("div");
    smallThumbnail.classList.add(classes.smallThumbnail);
    smallThumbnail.addEventListener(
      "click",
      async () => {
        await largeThumbnail2.expand(watchId);
      },
      {
        signal: events.signal,
      },
    );
    title.insertBefore(smallThumbnail, title.firstChild);
    const image = await loadImage(
      `https://i.ytimg.com/vi/${encodeURIComponent(watchId)}/default.jpg`,
    );
    smallThumbnail.append(image);
    const dispose = () => {
      events.abort();
      smallThumbnail.remove();
      title.classList.remove(classes.title);
    };
    document.addEventListener(
      "yt-navigate-finish",
      () => {
        dispose();
      },
      {
        signal: events.signal,
      },
    );
  };
  var createLargeThumbnail = () => {
    const classes = createCssClasses("hidden", "largeThumbnail");
    injectCss(`
    .${classes.largeThumbnail} {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      width: 100svw;
      height: 100svh;
      top: 0;
      left: 0;
      cursor: zoom-out;
      backdrop-filter: brightness(0.5);
      z-index: 9999999;
    }

    .${classes.largeThumbnail} img {
      max-width: 50%;
      max-height: 50%;
      width: auto;
      height: auto;
      vertical-align: middle;
    }

    .${classes.hidden} {
      display: none;
    }
  `);
    const largeThumbnail2 = document.createElement("div");
    largeThumbnail2.classList.add(classes.hidden, classes.largeThumbnail);
    const handleClick = () => {
      controller.shrink();
    };
    const controller = {
      expand: async (watchId) => {
        const image = await loadImage(
          `https://i.ytimg.com/vi/${encodeURIComponent(watchId)}/maxresdefault.jpg`,
        );
        document.addEventListener("click", handleClick);
        largeThumbnail2.replaceChildren(image);
        largeThumbnail2.classList.remove(classes.hidden);
      },
      shrink: () => {
        document.removeEventListener("click", handleClick);
        largeThumbnail2.classList.add(classes.hidden);
      },
    };
    document.addEventListener("yt-navigate-start", () => {
      controller.shrink();
    });
    document.body.append(largeThumbnail2);
    return controller;
  };

  // src/index.ts
  var largeThumbnail = createLargeThumbnail();
  var apply = async () => {
    let watchId;
    if (location.pathname.startsWith("/live/")) {
      watchId = location.pathname.split("/").pop();
    } else {
      const searchParams = new URLSearchParams(location.search);
      watchId = searchParams.get("v") ?? void 0;
    }
    if (!watchId) {
      return;
    }
    await applySmallThumbnail(watchId, largeThumbnail);
  };
  document.addEventListener("yt-page-data-updated", async (event) => {
    if (event.detail.pageType !== "watch") {
      return;
    }
    await apply();
  });
  await apply();
})();
