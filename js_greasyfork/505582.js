// ==UserScript==
// @name        returnAvatarLike
// @namespace   Violentmonkey Scripts
// @match       https://dtf.ru/*
// @grant       none
// @version     1.0.1
// @author      apchi
// @description 28.08.2024, 12:12
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505582/returnAvatarLike.user.js
// @updateURL https://update.greasyfork.org/scripts/505582/returnAvatarLike.meta.js
// ==/UserScript==
let gF;

Object.defineProperty(window, 'gF', {
  get() {
    return this._gF;
  },
  set(value) {
    this._gF = value;
    if (value) {
    updateNotifications('.notification-item--compact')
   updateNotifications('.notification-item--default')

    }
  }
});

const originalFetch = window.fetch;
window.fetch = async (input, options) => {
  if (input.includes("https://api.dtf.ru/v2.1/subsite/me/updates")) {
    const res = await originalFetch(input, options);
    window.gF = await res.clone().json();
    console.log(window.gF);
    return res;
  }
  return originalFetch(input, options);
};

async function updateNotifications(selector) {
  const reg = new RegExp(['ответил','оценил','прокоммент','опубликовал'].join("|"))
  const listEl = await waitForElm(selector);
  listEl.forEach((el, i) => {
    const imageContainer = el.querySelector(".notification-item__image");
    const textContainer = el.querySelector(".notification-item__text");
    const textHtml = textContainer.innerHTML
    if (imageContainer && textContainer) {
      const user = window.gF.result[i]?.users[0];

      if (!reg.test(textHtml)) {
        textContainer.innerHTML = ` <b>${user?.name}</b> оценил ❤️ ${textHtml}`;
      }

      imageContainer.querySelector("svg")?.remove();

      if (!imageContainer.querySelector("img") && user?.avatar_url) {
        const src = user.avatar_url;
        imageContainer.insertAdjacentHTML("beforeend", `
          <div data-loaded="true"
               class="andropov-media andropov-media--rounded andropov-media--bordered andropov-media--has-preview andropov-image"
               style="aspect-ratio: 1 / 1; width: 36px; height: 36px; max-width: none; --background-color: #dddddd;">
            <picture>
              <source srcset="${src}-/scale_crop/72x72/-/format/webp, ${src}-/scale_crop/72x72/-/format/webp 2x" type="image/webp" />
              <img src="${src}-/scale_crop/72x72/" srcset="${src}-/scale_crop/72x72/, ${src}-/scale_crop/72x72/ 2x" alt="" loading="lazy" />
            </picture>
          </div>
        `);
      }
    }
  });
}

window.onload = () => {
  document.querySelector(".bell__button").addEventListener("click", () => {
    updateNotifications('.notification-item--compact');
  });
  updateNotifications('.notification-item--default');
};

function waitForElm(selector) {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length) {
      resolve(elements);
    } else {
      const observer = new MutationObserver(() => {
        const updatedElements = document.querySelectorAll(selector);
        if (updatedElements.length) {
          observer.disconnect();
          resolve(updatedElements);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}