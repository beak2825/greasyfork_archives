// ==UserScript==
// @name        Patreon IFrame Embed Into Clipboard
// @license     MIT
// @namespace   rtonne
// @match       https://www.patreon.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @version     1.5
// @author      Rtonne
// @description Adds a button to turn Patreon IFrame embedded posts into custom text on your clipboard
// @run-at      document-end
// @grant       GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/496870/Patreon%20IFrame%20Embed%20Into%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/496870/Patreon%20IFrame%20Embed%20Into%20Clipboard.meta.js
// ==/UserScript==

function getClipboardContent(post_title_text, post_url, post_iframe_url) {
  // The content of this function is for my use case, and was put into this
  // function so you could change it for your use case easier, so go ahead!
  const post_iframe_search_url = post_iframe_url.substring(
    post_iframe_url.indexOf("?") + 1,
  );
  const post_iframe_search_params = new URLSearchParams(post_iframe_search_url);
  const post_streamable_url = post_iframe_search_params.get("src");

  return `
### ${post_title_text} [](${post_url})

- [ ] 👁

<iframe src="${post_streamable_url}" style="width: 100%; max-height: 70vh; aspect-ratio: 16 / 9;" allowfullscreen></iframe>
`;
}

const clipboard_svg = /*svg*/ `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" >
    <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
    <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
</svg>`;

const url_regex = /^https:\/\/www.patreon.com\/[^\/]+?\/posts.*$/;
const observer = new MutationObserver(async () => {
  if (!url_regex.test(window.location.href)) {
    return;
  }

  const elements = await waitForElements(
    document,
    "li div[data-tag='post-card']",
  );

  for (const element of elements) {
    if (element.querySelector(".rtonne-patreon-streamable-button")) {
      continue;
    }
    const post_video_figure = element.querySelector(
      "figure[title='video thumbnail']",
    );
    if (!post_video_figure) {
      continue;
    }
    const more_actions_button_container = element.querySelector(
      "div:has(> button[data-tag='more-actions-button'])",
    );
    const more_actions_button = more_actions_button_container.querySelector(
      "button[data-tag='more-actions-button']",
    );

    const clipboard_button = document.createElement("button");
    clipboard_button.className = more_actions_button.className;
    clipboard_button.classList.add("rtonne-patreon-streamable-button");
    more_actions_button_container.before(clipboard_button);
    const clipboard_button_svg_container = document.createElement("div");
    clipboard_button_svg_container.className =
      more_actions_button.children[0].className;
    clipboard_button_svg_container.innerHTML = clipboard_svg;
    clipboard_button.append(clipboard_button_svg_container);

    clipboard_button.onclick = async () => {
      post_video_figure
        .querySelector("div[data-tag='media-container']")
        .click();
      const [post_iframe] = await waitForElements(element, "iframe");
      const post_iframe_url = post_iframe.src;

      const post_title = element.querySelector(
        "span[data-tag='post-title'] > a",
      );
      const post_title_text = post_title.innerText.trim();
      const post_url = post_title.href;

      GM.setClipboard(
        getClipboardContent(post_title_text, post_url, post_iframe_url),
      );
    };
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

/**
 * Uses a MutationObserver to wait until the element we want exists.
 * This function is required because elements take a while to appear sometimes.
 * https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 * @param {HTMLElement} node The element we want to search in.
 * @param {string} selector A string for node.querySelector describing the elements we want.
 * @returns {Promise<HTMLElement[]>} The list of elements found.
 */
function waitForElements(node, selector) {
  return new Promise((resolve) => {
    if (node.querySelector(selector)) {
      return resolve(node.querySelectorAll(selector));
    }

    const observer = new MutationObserver(() => {
      if (node.querySelector(selector)) {
        observer.disconnect();
        resolve(node.querySelectorAll(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
