

// ==UserScript==
// @name         Your Script Name
// @namespace    https://www.tryloctite.in/
// @version      0.1
// @description  A brief description of your script
// @author       Akash Dutta
// @match        https://www.tryloctite.in/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488105/Your%20Script%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/488105/Your%20Script%20Name.meta.js
// ==/UserScript==
const baseCss = ".live2ai_story_overview_wrapper,.live2ai_strousel_overview_wrapper,.productList{-ms-overflow-style:none;scrollbar-width:none}.live2ai_story_overview_wrapper::-webkit-scrollbar,.live2ai_strousel_overview_wrapper::-webkit-scrollbar,.productList::-webkit-scrollbar{display:none}.live2ai_title_subtitle_wrapper{margin-bottom:30px}.live2ai-title-web{font-family:Inter,sans-serif!important}.live2ai-sub-title-web{--live2ai-font-size-sub-title-web:16px;--live2ai-font-weight-sub-title-web:400}.story_item{width:calc(140px - 15px);height:unset}.story_title{font-size:14px}.strousel_item{width:calc(125px - 15px);aspect-ratio:9/16}.live2ai_carousel_item{width:197px;aspect-ratio:9/16}.live2ai_story_item_container{background:linear-gradient(200deg,#ff005c 0,#a57cfc 100%)}@media screen and (max-width:767px){.story_item{width:calc(85px - 15px)}.strousel_item{width:calc(92px - 15px)}.story_title{width:85px;font-size:12px;margin-top:4px}.live2ai_story_wrapper{margin-left:10px}.live2ai_carousel_item{width:168px}}@media (min-width:320px){.live2ai-container{margin-top:40px;margin-bottom:40px}.live2ai_title_subtitle_wrapper{margin-bottom:20px}.live2ai-title-web{--live2ai-font-size-title-web:24px}.live2ai-sub-title-web{--live2ai-font-size-sub-title-web:14px;--live2ai-font-weight-sub-title-web:400}}";

const globalCss = ".live2ai-floating-video-player{width:197px!important;aspect-ratio:9/16;height:auto!important}@media screen and (max-width:767px){.live2ai-floating-video-player{width:150px!important}}";


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
  sectionTitle = null,
  screenType = null,
  removeChildElements = false
) {
  if (!fullXPath || !embedId || !teamId) return;
  if (hrefIncludes && !window.location.href.includes(hrefIncludes)) return;

  //const observer = new MutationObserver((mutationsList, observer) => {
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
      //observer.disconnect();

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

      if (screenType) {
        newDiv.setAttribute("data-live2-embed-screen", screenType);
      }

      if (layoutType) {
        newDiv.setAttribute("data-live2-layout-type", layoutType);
      }
      if (sectionTitle) {
        newDiv.setAttribute("data-live2-embed-title", sectionTitle);
      }

      newDiv.append(l2c);
      newDiv.append(customCssEl);

      target.parentNode.insertBefore(newDiv, target);

      if (removeChildElements) {
        target.innerHTML = "";
      }

      embedScript(
        "https://storage.googleapis.com/uploads-live2ai-dev/assets/sdk/dev/live2ai-embed-sdk.js?v=3"
      );
    } else {
      console.log(
        `%cTarget element not found for embed: ${embedId}`,
        "color: red"
      );
    }
  //});

  // Start observing the document with the observer
  //observer.observe(document, { childList: true, subtree: true });
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

const storyCustomCss = `.live2ai-app *{font-family:Industry-Medium!important}.live2ai-title-web{font:500 30px/1.35 Oswald,Helvetica Neue,Verdana,Arial,sans-serif!important;text-transform:uppercase!important;color:#282828!important}.live2ai-sub-title-web{font-size:20px!important;line-height:39px!important}.live2ai-layout-wrapper{margin-top:0!important;margin-bottom:25px!important}.top_video_title_mobile{visibility:hidden}.live2ai_title_subtitle_wrapper{margin-top:30px!important}.live2-story-wrapper[data-has-custom-fg="1"]{margin:4px;overflow:unset}@media screen and (max-width:767px){.live2ai-title-web{font-size:18px!important;font-weight:600!important}.live2-story-wrapper[data-has-custom-fg="1"]>.story_item{border-width:0;width:82px}.live2ai_title_subtitle_wrapper{margin-bottom:15px!important;margin-top:12px!important;}}@media (min-width:320px){.live2ai-container{margin-top:0;margin-bottom:10px}}`;

const carouselCustomCss = `.live2ai-app *{font-family:Industry-Medium!important}.live2ai-title-web{font:500 30px/1.35 Oswald,Helvetica Neue,Verdana,Arial,sans-serif!important;text-transform:uppercase!important;color:#282828!important;position:relative}.live2ai-title-web::before{position:absolute;background:#e1000f;width:130px;height:4px;left:calc((100% - 130px)/ 2);bottom:-10px;content:""}.live2ai-title-web::after{display:inline-block;font-style:normal;font-weight:400;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:"\\e60a";font-size:22px;font-family:Pe-icon-7-stroke;speak:none;padding:0 10px;background:#f8f8f8;position:absolute;left:calc((100% - 36px)/ 2);color:#e1000f;bottom:-20px}.live2aiLeftArrow{border-radius:0 4px 4px 0}.live2ai-sub-title-web{font-size:20px!important;line-height:39px!important;display:none!important}.live2ai-layout-wrapper{margin-top:0!important;margin-bottom:25px!important}.top_video_title_mobile{visibility:hidden}@media (min-width:320px){.live2ai-container{margin-top:0!important}.live2ai_title_subtitle_wrapper{margin-bottom:40px!important}}@media screen and (max-width:767px){.live2ai-title-web{font-size:18px!important;font-weight:600!important}.live2ai_carousel_item{width:150px!important}}`;

const carouselProdCustomCss = ".live2ai-app *{font-family:Industry-Medium!important}.live2ai-title-web{font:500 30px/1.35 Oswald,Helvetica Neue,Verdana,Arial,sans-serif!important;text-transform:uppercase!important;color:#282828!important}.live2aiLeftArrow{border-radius:0 4px 4px 0}.live2ai-sub-title-web{font-size:20px!important;line-height:39px!important}.live2ai-layout-wrapper{margin-top:0!important;margin-bottom:25px!important}.live2ai_title_subtitle_wrapper{margin-top:0!important}.top_video_title_mobile{visibility:hidden}@media (min-width:320px){.live2ai-container{margin-top:0!important}}.live2ai_carousel_item{width:156px!important}@media (max-width:767px){.live2ai-container{margin-top:40px!important;margin-bottom:45px!important}.live2ai-sub-title-web{font-size:16px!important;}.live2ai_carousel_item{width:150px!important;}}";

const windowStoryCustomCss = ".live2ai-app *{font-family:Industry-Medium!important}.live2ai-title-web{text-align:left;text-transform:uppercase!important;color:#282828!important}.live2ai-sub-title-web{font-size:20px!important;line-height:39px!important}.live2ai-layout-wrapper{margin-top:0!important;margin-bottom:25px!important}.top_video_title_mobile{visibility:hidden}@media (min-width:320px){.live2ai-container{margin-top:26px!important;margin-bottom:0!important}}div:has(.live2ai-container){width:390px!important}@media (max-width:767px){.live2ai-.live2ai_title_subtitle_wrapper{margin-bottom:10px!important}div:has(.live2ai-container){width:360px!important}.live2ai-layout-wrapper{margin-top:0!important;margin-bottom:30px!important}.live2ai_title_subtitle_wrapper{margin-bottom: 15px;}.live2ai_strousel_overview_wrapper{padding:0}}";

const floatingCustomCss = ".live2ai-app *{font-family:Industry-Medium!important}.top_video_title_mobile{visibility:hidden}";

const horizontalVideosCss = ".top_video_title_mobile{visibility:hidden}.live2ai-layout-wrapper{width:100%!important}.live2ai_carousel_item{width:425px!important;aspect-ratio:16/9!important}.custom-video{aspect-ratio:16/9}@media (min-width:320px){.live2ai-container{margin-top:0!important}}@media (max-width:767px){.live2ai_carousel_item{width:310px!important;aspect-ratio:16/9!important}}";

const TEAM_ID = "65b8e3a8885468de58b7c862";

renderSection("/html/body/div[2]/main/div[3]/div[2]", "7vyuayfm0c", TEAM_ID, storyCustomCss);
renderSection("/html/body/div[2]/main/div[4]/div[1]/div[7]/div/section[2]", "mmplqfapl9", TEAM_ID, carouselCustomCss);
renderSection("/html/body/div[2]/main/div[4]/div[1]/div[9]/div/section", "ix20lvamir", TEAM_ID, floatingCustomCss);
// renderSection("/html/body/div[2]/main/div/div[1]/div[1]", "5wcr0hujyv", TEAM_ID, carouselProdCustomCss, "https://www.tryloctite.in/products/thread-sealants.html");
renderSection("/html/body/div[2]/main/div", "5wcr0hujyv", TEAM_ID, carouselProdCustomCss, "https://www.tryloctite.in/products/thread-sealants.html");
renderSection("/html/body/div[3]/main/div[2]/div/div[1]/div[2]/div[4]/form/div[1]", "u3ipquhob6", TEAM_ID, windowStoryCustomCss, "https://www.tryloctite.in/loctite-263.html");
renderSection("/html/body/div[3]/div[3]/div/div/div/div/div/section", "xtebn7f5ol", TEAM_ID, horizontalVideosCss, "https://www.tryloctite.in/loctite-263.html", null, null, "TV", true);


var iframe = document.createElement('iframe');
iframe.setAttribute('style', 'border: 1px solid rgba(0, 0, 0, 0.1);');
iframe.setAttribute('src', 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F0omHtYX6na2365InJ6pRvr%2FLive2---Graphic%3Fpage-id%3D7%253A4229%26type%3Ddesign%26node-id%3D698-211%26viewport%3D-2793%252C2222%252C0.09%26t%3Dr2nGNw465R4E4Ecb-1%26scaling%3Dscale-down%26starting-point-node-id%3D698%253A211%26mode%3Ddesign%26hide-ui%3D1');
iframe.setAttribute('allowfullscreen', '');
iframe.setAttribute('style', 'background: #f2f2f2;aspect-ratio: 1308/800');
iframe.setAttribute('class', 'live2ai-branching-iframe');
var container = document.getElementById('tech-big-chalngelt');
const outerDiv = document.createElement('div');
const secHdDiv = document.createElement('div');
secHdDiv.classList.add('sec-hd');
secHdDiv.setAttribute('style', 'background:#f2f2f2');
const spanElement = document.createElement('span');
spanElement.textContent = 'Identify Your Loctite Needs';
secHdDiv.appendChild(spanElement);
const pElement = document.createElement('p');
outerDiv.setAttribute('style', 'margin-top: 30px;padding-top:30px;background:#f2f2f2;position:relative;z-index:3;');
pElement.setAttribute('style', 'text-align: center;');
pElement.classList.add('txt1');
pElement.textContent = 'Interact with this series of videos to identify your specific needs';
const frameWrapper = document.createElement('div');
frameWrapper.setAttribute('style', 'background: #f2f2f2; display: flex; justify-content: center; align-items: center;');
frameWrapper.appendChild(iframe);
outerDiv.appendChild(secHdDiv);
outerDiv.appendChild(pElement);
container.appendChild(outerDiv);
container.appendChild(frameWrapper);
document.getElementById('feat-insdlt').setAttribute('style', 'background: #ffffff;');
const style = document.createElement('style');
style.innerHTML = `
.live2ai-branching-iframe {
  margin-top: -40px;
  width: 75%;
}
@media (max-width: 767px) {
  .live2ai-branching-iframe {
    margin-top: 0;
    width: 95%;
  }
}
`;
document.head.appendChild(style);
Collapse








