// ==UserScript==
// @name         wnacg image fits screen size
// @name:zh-TW   wnacg圖片符合螢幕尺寸
// @name:zh-CN   wnacg图片符合屏幕尺寸
// @name:ja      wnacg画像を画面サイズに合わせる
// @version      1.1.0
// @description  Adjust wnacg website images to fit screen size
// @description:zh-TW 調整 wnacg 網站圖片以符合螢幕尺寸
// @description:zh-CN 调整 wnacg 网站图片以符合屏幕尺寸
// @description:ja      wnacgサイトの画像を画面サイズに合わせる
// @author       AndyTLemon
// @match        http*://*.wnacg.com/photos-view-id-*.html
// @match        http*://*.wnacg.com/photos-slide-aid-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.com
// @grant        none
// @license      GPL-3.0-or-later
// @namespace    https://greasyfork.org/users/1193722
// @downloadURL https://update.greasyfork.org/scripts/523129/wnacg%20image%20fits%20screen%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/523129/wnacg%20image%20fits%20screen%20size.meta.js
// ==/UserScript==

function scrollToCenter(elementId) {
  const elements = document.getElementsByClassName("png bread");
  if (elements.length > 0) {
    const rect = elements[0].getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const centerPosition = rect.top;

    window.scrollTo({
      top: centerPosition,
    });
  }
}

function navigatePage(direction) {
  const prevLink = document.querySelector(
    '.newpage .btntuzao[href*="photos-view-id-"]'
  );
  const nextLink = document.querySelector(
    '.newpage .btntuzao[href*="photos-view-id-"]:last-of-type'
  );

  if (direction === "ArrowLeft" && prevLink) {
    window.location.href = prevLink.href;
  } else if (direction === "ArrowRight" && nextLink) {
    window.location.href = nextLink.href;
  }
}

(function () {
  // Inject styles immediately
  const style = document.createElement("style");
  style.innerHTML = `
        .photo_body {
            max-height: 90vh;
            max-width: 90vw;
            display: block;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        .photo_body #imgarea {
            display: flex;
            justify-content: center;
            align-items: center;
            max-height: 90vh;
            max-width: 90vw;
            overflow: visible;
        }
        .photo_body #imgarea img,
        .photo_body #imgarea a {
            max-height: 90vh;
            max-width: 90vw;
            object-fit: contain;
            padding: 0 !important;
        }
        .photo_body #tuzaoblock {
            display: none;
        }
        #img_list img {
            max-height: 90vh;
            max-width: 90vw;
            object-fit: contain;
            padding: 0 !important;
        }
        #img_list span {
            display: none;
        }
    `;
  document.head.appendChild(style);

  const viewportHeight = document.documentElement.clientHeight;

  if (window.location.href.includes("photos-view-id-")) {
    document.addEventListener("keydown", (event) => {
      navigatePage(event.key);
    });
    window.onload = () => scrollToCenter("picarea");
  } else if (window.location.href.includes("photos-slide-aid-")) {
    window.onload = () => {
      scrollToCenter("img_list");
    };
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        window.scrollBy({
          top: -viewportHeight * 0.9 - 12.5,
          behavior: "smooth",
        });
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        window.scrollBy({
          top: viewportHeight * 0.9 + 12.5,
          behavior: "smooth",
        });
      }
    });
  }
})();
