// ==UserScript==
// @name         Jeep India User Script
// @namespace    https://www.jeep-india.com/
// @version      2024-02-23
// @description  Live2 Demo for Jeep India
// @author       Akash Dutta
// @match        https://www.jeep-india.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.jeep-india.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496715/Jeep%20India%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/496715/Jeep%20India%20User%20Script.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const baseCss = `
    .live2ai_story_overview_wrapper, .live2ai_strousel_overview_wrapper, .productList {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    .live2ai_story_overview_wrapper::-webkit-scrollbar, .live2ai_strousel_overview_wrapper::-webkit-scrollbar, .productList::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }
    .live2ai_title_subtitle_wrapper {
        margin-bottom: 30px;
    }
    .live2ai-title-web {
        font-family: 'Inter', sans-serif !important;
    }
    .live2ai-sub-title-web {
        --live2ai-font-size-sub-title-web: 16px;
        --live2ai-font-weight-sub-title-web: 400;
    }
    .story_item {
        width: calc(140px - 15px);
    }
    .story_title {
        font-size: 14px;
    }
    .strousel_item {
        width: calc(125px - 15px);
        aspect-ratio: 9 / 16;
    }
    .live2ai_carousel_item {
        width: 197px;
        aspect-ratio: 9 / 16;
    }
    .live2ai_story_item_container {
      background: linear-gradient(200deg, #FF005C 0%, #A57CFC 100%);
    }
    @media screen and (max-width: 767px) {
        .story_item {
            width: calc(85px - 15px);
        }
        .strousel_item {
            width: calc(92px - 15px);
        }
        .story_title {
            width: 85px;
            font-size: 12px;
            margin-top: 4px;
        }
        .live2ai_story_wrapper {
            margin-left: 10px;
        }
        .live2ai_carousel_item {
          width: 168px;
        }
    }
    @media (min-width: 320px) {
        .live2ai-container {
            margin-top: 40px;
            margin-bottom: 40px;
        }
        .live2ai_title_subtitle_wrapper {
            margin-bottom: 20px;
        }
        .live2ai-title-web {
            --live2ai-font-size-title-web: 24px;
        }
        .live2ai-sub-title-web {
            --live2ai-font-size-sub-title-web: 14px;
            --live2ai-font-weight-sub-title-web: 400;
        }
    }
`;
const globalCss = `
    .live2ai-floating-video-player {
      width: 197px !important;
      aspect-ratio: 9 / 16;
      height: auto !important;
    }
    @media screen and (max-width: 767px) {
      .live2ai-floating-video-player {
        width: 150px !important;
      }
    }
`;
function embedScript(src) {
  const live2script = document.createElement("script");
  live2script.setAttribute("src", src);
  document.head.appendChild(live2script);
}
function embedGoogleFont(src) {
  const live2Font = document.createElement("link");
  live2Font.setAttribute("href", src);
  live2Font.setAttribute("rel", "stylesheet");
  document.head.appendChild(live2Font);
}
function renderSection(
  fullXPath = null,
  embedId = null,
  teamId = null,
  customCss = null,
  hrefIncludes = null,
  layoutType = null,
  sectionTitle = null
) {
  if (!fullXPath || !embedId || !teamId) return;
  if (hrefIncludes && !window.location.href.includes(hrefIncludes)) return;
    const target = document.evaluate(
      fullXPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    // If the target element exists, disconnect the observer and run the existing code
    if (target) {
      console.log(
        `%cTarget element found for embed: ${embedId}`,
        "color: green"
      );
      const customCssEl = document.createElement("div");
      customCssEl.setAttribute("class", "live2-custom-css");
      customCssEl.setAttribute("style", "display: none !important;");
      customCssEl.innerHTML = baseCss + (customCss || "");
      const l2c = document.createElement("div");
      l2c.setAttribute("class", "live2-container");
      const newDiv = document.createElement("div");
      newDiv.setAttribute("data-live2-embed", "1");
      newDiv.setAttribute("data-live2-picked-up", "0");
      newDiv.setAttribute("data-live2-loaded", "0");
      newDiv.setAttribute("data-live2-embed-id", embedId);
      newDiv.setAttribute("data-live2-team-id", teamId);
      newDiv.setAttribute("data-live2-embed-screen", "TV");
      if (layoutType) {
        newDiv.setAttribute("data-live2-layout-type", layoutType);
      }
      if (sectionTitle) {
        newDiv.setAttribute("data-live2-embed-title", sectionTitle);
      }
      newDiv.append(l2c);
      newDiv.append(customCssEl);
      target.parentNode.insertBefore(newDiv, target);
      embedScript(
        "https://storage.googleapis.com/uploads-live2ai-dev/assets/sdk/landscape_carousel_stellantis/live2ai-embed-sdk.js"
      );
    } else {
      console.log(
        `%cTarget element not found for embed: ${embedId}`,
        "color: red"
      );
    }
}
embedGoogleFont(
  "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
);
const globalCssEl = document.createElement("style");
globalCssEl.innerHTML = globalCss;
document.head.appendChild(globalCssEl);
// Example of how to use the renderSection function:
// renderSection("/html/body/div[2]/main/section[2]", "dpiihkq7oi", TEAM_ID);
// Example of how to use the renderSection function in a specific url:
// renderSection("/html/body/div[2]/main/section[2]", "dpiihkq7oi", TEAM_ID, null, "https://www.example.com", "story");
const TEAM_ID = "6658210e91b3ed0270e0f5a5";
const css = "*{font-family: inherit !important}.live2ai-carousel-section-title-web,.live2ai-carousel-section-sub-title-web { color: white !important}";
renderSection("/html/body/div[1]/div[3]", "s3any51fgb", TEAM_ID, css);










})();