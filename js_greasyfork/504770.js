// ==UserScript==
// @name            Niconico - Better Nicoru
// @name:ja         ニコニコ - ニコる表示の改善
// @description     Improve issues such as Niconico's Nicoru only showing up to 9+.
// @description:ja  ニコニコのニコるが9+までしか表示されないなどの問題を改善します。
// @version         1.0.1
// @match           https://www.nicovideo.jp/watch/sm*
// @namespace       https://github.com/sqrtox/userscript-niconico-better-nicoru
// @author          sqrtox
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/504770/Niconico%20-%20Better%20Nicoru.user.js
// @updateURL https://update.greasyfork.org/scripts/504770/Niconico%20-%20Better%20Nicoru.meta.js
// ==/UserScript==

// NOTE:
//   This file was built from https://github.com/sqrtox/userscript-niconico-better-nicoru
//
//   このスクリプトはこれらのスクリプトにインスパイアされました。先駆者の方々に感謝と敬意を表します。
//   This script was inspired by the following scripts. I express my gratitude and respect to the pioneers.
//
//      - https://github.com/takusan23/NicoruCountFix
//      - https://greasyfork.org/ja/scripts/482598

(async () => {
  "use strict";

  // src/color.ts
  var gradient = (r1, g1, b1, r2, g2, b2, d) => [
    (r2 - r1) * d + r1,
    (g2 - g1) * d + g1,
    (b2 - b1) * d + b1,
  ];

  // src/nicoru.ts
  var NICORU_BUTTON_ARIA_LABEL = "ニコるボタン";
  var LOWEST_NICORU_COLOR = [84, 73, 28];
  var NICORU_COLOR_DEFINES = [
    // mythology
    {
      start: 100,
      end: 200,
      color: [51, 153, 255],
    },
    // legendary
    {
      start: 50,
      end: 100,
      color: [136, 72, 152],
    },
    // top
    {
      start: 10,
      end: 50,
      color: [255, 0, 0],
    },
    // limit
    {
      start: 0,
      end: 10,
      color: [252, 216, 66],
    },
  ].sort((a, b) => b.start - a.start);
  var getDistance = (n, start, end) =>
    Math.min(Math.max(0, (n - start) / (end - start)), 1);
  var getNicoruColor = (n) => {
    for (const [i, { start, end, color }] of NICORU_COLOR_DEFINES.entries()) {
      const previousLevelColor =
        NICORU_COLOR_DEFINES[i + 1]?.color ?? LOWEST_NICORU_COLOR;
      if (n > start) {
        const distance = getDistance(n, start, end);
        return gradient(...previousLevelColor, ...color, distance);
      }
    }
  };

  // src/observer.ts
  var observeAddedHtmlElements = (target, callback) => {
    let observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== "childList") {
          continue;
        }
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }
          callback(node);
        }
      }
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
    });
    return () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
  };

  // src/react.ts
  var getReactProps = (o) => {
    const reactPropsKey = Object.keys(o).filter((key) =>
      key.startsWith("__reactProps$"),
    )[0];
    if (!reactPropsKey) {
      return;
    }
    return o[reactPropsKey];
  };

  // src/comment.ts
  var COMMENT_LIST_ELEMENT_MARKER = "コメントリスト";
  var awaitCommentList = () => {
    const { promise, resolve } = Promise.withResolvers();
    const disconnect = observeAddedHtmlElements(document, (element) => {
      const commentHeader = [...element.getElementsByTagName("header")].filter(
        (element2) =>
          element2.textContent?.includes(COMMENT_LIST_ELEMENT_MARKER),
      )[0];
      if (
        !commentHeader ||
        !(commentHeader.nextElementSibling instanceof HTMLElement)
      ) {
        return;
      }
      resolve(commentHeader.nextElementSibling);
      disconnect();
    });
    return promise;
  };
  var fixNicoruCount = (commentElement, nicoruCount) => {
    const countElement = commentElement.querySelector(
      `button[aria-label="${NICORU_BUTTON_ARIA_LABEL}"] > p`,
    );
    if (!countElement) {
      return;
    }
    countElement.textContent = nicoruCount.toString();
  };
  var fixCommentContentStyle = (commentElement) => {
    const contentElement = commentElement.querySelector(
      `button[aria-label="${NICORU_BUTTON_ARIA_LABEL}"] + p`,
    );
    if (contentElement instanceof HTMLElement) {
      contentElement.style.flex = "1";
    }
  };
  var fixCommentBackgroundColor = (commentElement, nicoruCount) => {
    const color = getNicoruColor(nicoruCount);
    if (!color) {
      return;
    }
    const commentInnerElement = commentElement.children[0];
    if (!(commentInnerElement instanceof HTMLElement)) {
      return;
    }
    commentInnerElement.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.66)`;
  };
  var processComment = (commentElement) => {
    fixCommentContentStyle(commentElement);
    const count = commentElement.querySelector("button p");
    if (!count) {
      return;
    }
    const props = getReactProps(commentElement);
    if (!props) {
      return;
    }
    const comment = props.children.props.comment;
    const nicoruCount = comment.nicoruCount;
    fixNicoruCount(commentElement, nicoruCount);
    fixCommentBackgroundColor(commentElement, nicoruCount);
  };
  var processCommentPopper = (popperElement) => {
    const commentElement = popperElement.querySelector(
      `div:has(> div > button[aria-label="${NICORU_BUTTON_ARIA_LABEL}"])`,
    );
    if (!(commentElement instanceof HTMLElement)) {
      return;
    }
    fixCommentContentStyle(commentElement);
    const props = getReactProps(popperElement);
    if (!props) {
      return;
    }
    const comment = props.children.props.comment;
    fixNicoruCount(commentElement, comment.nicoruCount);
  };

  // src/index.ts
  var main = async () => {
    const commentList = await awaitCommentList();
    observeAddedHtmlElements(commentList, (element) => {
      if ("index" in element.dataset) {
        processComment(element);
      } else if (element.classList.contains("z_forward")) {
        processCommentPopper(element);
      }
    });
  };
  main();
})();
