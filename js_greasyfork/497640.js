// ==UserScript==
// @name         DeepL Document Translator
// @namespace    deeplx.net/gm-deepl
// @version      1.0.1
// @author       deeplx.net
// @description  You can use it to translate DeepL documents。
// @license      MIT
// @copyright    https://t.me/chatwithares_bot
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADPElEQVRYhb2XX0hTcRTHv+eaoaa5EFwsGGoIRkYLeigpsMIlKDihhxgJ7bG9aJBg9DD3EBQEuR6qp/yXvvSgPQzmFcwHM8iHljoxcjYGjqY93GXG5sjTgyHu3rt5r5t933Z+Z7/v53d+557dAVnIYLEZsvk+ANB+jbc2f7eTgA4wJGb0/VwQ3f8FwFDbWM+81QugQrYUIrBbCoz3HQiAwdJYwUnuBbg+Ux6D+oR8ckt+XygnALJya75zZnQLh4s8kn9UypSXl9H8lNXGnBwhgg1AgVZzACBCPbaSNwvLq2LxtWV/2jxVY0uDhZPC073KrUN+yhda1a5FkAeO1lpdnKRPauZdzjbMigMYeuaC+YRRD4CFk1vfDKeud8gXDskDBNjUdrDbGtDlvAUAMJuMKC0pRrOjUw8EWOB2AD27Y4oKpGs0syn1xDorkFZKgDSamplVAM2KA7DbGrICUDwFBeUnOwBlFcKRKLwT00gkNtH7xov7j1/CbrPC3mKF2XQcc1+CiK1v7OUnJdaCnt0BxVNQetr6Dcopl1bbvdEGs8mIF69HcOn8WQAM78QHPHo+KE8PxQJiZU4BgO1+sLdsg+zW5RtOzC0GMwJo7oFMCq9E8WJwVBVsL+UEoPToEcTWf6U0ajgSlZ9eVYo5oFddzjbcaWtFs6MTzY5O2G0NKC0phndiGuGVaG4Bmq5dRNOVOsx9WcbcYhDPH96D2WTE8KiIcOQ7AGB4dFzXATQDNF2tw5DHlRKbmpmF88ETxYw4EIAzNVUpn8ORqO5RrKZ9T8Kpj5+zNgdUJmGhsaoSoAvyeDgSRTgS/ddg7+H2vEIikdRlRkz98bWgLyWmlmg43XibwS6AK3Q5pHWGRExuKTDWI19SfSOKry35C8uq35LAxwBYsvJm8tBGUav01TupzraHDDWNFZzH7/RWg4gmAXJL8z5VY80AOyA6roUYbmlB7Nayb8aX0t3auZY8jgGoT2sOmpQWRIfWfTUDAED8x5IUXw1OFpZV96frDxLy7sZXlxa17rmvHyNp0ReSAuJtguAAKJSyyJzxf0BOAHZAAr6+WGCskghuALqMcwKwAzIvdtMf4RwB/bnY77/qL0WZNmzvXT5nAAAAAElFTkSuQmCC
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEwPK0cPK0YPK0YPK0YPK0YPK0YPK0YPK0YPK0f///8AIT8ADjU4TGJndIPW2t7r7vCUnqi8w8msDOqtAAAACnRSTlMAO/T/q95SyX8W0MSMfAAAAexJREFUWIW1l9uWgyAMRUexXgj3///YCVgpKhALq+ehqw+T3RBOQubv79fauqKHhbHX0B4/Ma9xaoveVha1NhzEZ//RMn8bPrGLpq9KsY7XeCzF+jh8zoQHzY9KsS2FcF8KmrDdDn8pBYFYX/V49FWtFDMZHhClK02dw0AIgAJhzJ9jPv2RddqqEgGtScQLzb0qhLut0uqD5Zwg3BssuX2Q+g2wRcBSB5g3wIkmAIsAI0op1AHg+CHL8ggCICOAa5XNog5AgjNGWxkycSpTCQLAAKSUAML6+zAWUEKkqVAAz/AfQlhfUKOk1doltngAeEvs57ha8zkA2yr6ivOGDMJhVLxVaAGg4qWKNgAcANcIEEcVZMMRcDABqL07XMMtgNLcQ5w2OrEkDYAwEkE4/G3nv0nJvnAi3pxS+BlGk9n9c+opAiAwb26cCrWzMtOORDtH42D6sqGdIXoXs28YKJ+ZqBtHWvdQZZ1jnR3dZ3L1LwHSl5UJS8RnHsft9LSDslZV4l+59/m0WQEUX/fy6jnUh0rUUt74hgcrSn13Pm0pWZFbb31No5a0oPKqVVyvrsove9UF78E5HmWfIK5XevcupfPal1vsSJ2s2QI4/dvRBMBzLJ2AjzVbAahp7ATsLdYDCO7uA6A1OwE/1D8U3Cg7PPY0qQAAAABJRU5ErkJggg==
// @homepage     https://t.me/chatwithares_bot
// @homepageURL  https://t.me/chatwithares_bot
// @website      https://t.me/chatwithares_bot
// @supportURL   https://t.me/chatwithares_bot
// @match        https://www.deepl.com/**
// @match        https://www5.deepl.com/**
// @require      https://registry.npmmirror.com/tampermonkey-jquery/1.0.0/files/dist/jquery-3.7.1.min.js
// @require      https://registry.npmmirror.com/ajax-hook/3.0.3/files/dist/ajaxhook.min.js
// @require      https://registry.npmmirror.com/i18n-js/4.4.3/files/dist/browser/index.js
// @connect      doc.deeplx.net
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497640/DeepL%20Document%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/497640/DeepL%20Document%20Translator.meta.js
// ==/UserScript==

(function (ajaxHook, i18nJs, $) {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const originalFetch = _unsafeWindow.fetch;
  _unsafeWindow.fetch = async (...args) => {
    const [resource, config] = args;
    const response = await originalFetch(resource, config);
    if (response.status === 200 && resource.includes("method=getClientState")) {
      const json = await response.json();
      json.result.featureSet.translator.service = "pro";
      json.result.featureSet.translator.formality = true;
      json.result.featureSet.documentTranslation.sizeLimits.doc = 20;
      json.result.featureSet.documentTranslation.sizeLimits.docx = 20;
      json.result.featureSet.documentTranslation.sizeLimits.pdf = 20;
      json.result.featureSet.documentTranslation.sizeLimits.pptx = 20;
      json.result.featureSet.documentTranslation.sizeLimits.xlsx = 20;
      json.result.featureSet.documentTranslation.sizeLimits.txt = 1;
      json.result.featureSet.documentTranslation.sizeLimits.html = 5;
      json.result.featureSet.documentTranslation.sizeLimits.xlf = 10;
      json.result.featureSet.documentTranslation.sizeLimits.xliff = 10;
      return new Response(JSON.stringify(json), { status: response.status });
    }
    return response;
  };
  const key = "last-DocumentIdAndKey";
  const rootURL = "https://doc.deeplx.net";
  const baseURL = `${rootURL}/api`;
  const donateURL = `https://taobao.starxg.com/open/go?id=ad514f848fe040548e61a51f06d167e4`;
  const lkxResourceId = "2";
  const getLastDocumentIdAndKey = () => {
    const item = sessionStorage.getItem(key);
    try {
      if (item) {
        return JSON.parse(item);
      }
    } catch {
    }
    return null;
  };
  const setLastDocumentIdAndKey = (e) => {
    sessionStorage.setItem(key, JSON.stringify(e));
  };
  const i18n = new i18nJs.I18n({
    en: {
      NotWork: `The plugin doesn't seem to be working, click “OK” to refresh the page.`,
      WeChat: "WeChat",
      HelpText: "Do you need help?",
      WeChatVerify: "WeChatVerify",
      CancelDownload: `Cancel, I'm not downloading.`,
      ScanTip: 'Scan the QR code with WeChat and click "获取资源". (Free)',
      AutoDownloadTip: "The page will download automatically after getting the resource",
      CantScan: `I don't have WeChat or can't verify.`,
      DownloadAfter: 'The download is about to start, remember to click "Leave" or "Confirm" in the pop-up window.',
      ManuallyClose: "This window will close automatically after a few seconds, or manually click Cancel.",
      DownloadComplete: `Click "Cancel" when the download is complete.`,
      DocLimit: "File limit 20MB/1,000,000 characters",
      NewVersionAvailable: "Please refresh the page to update to the latest version",
      TranslateError: "Translation failed, please refresh the page to retranslate",
      TelegramNotice: `DeepL may be updated in the near future, please join the <a href="https://t.me/+mO_DMkb-go44YmJh" target="_blank">Telegram</a> channel.`
    },
    zh: {
      NotWork: "插件似乎没有生效，点击 “确定” 刷新页面。",
      WeChat: "微信",
      HelpText: "有任何问题请联系我",
      WeChatVerify: "微信验证",
      CancelDownload: `取消，我不下载。`,
      ScanTip: "微信扫码，然后点击“获取资源”。（完全免费）",
      AutoDownloadTip: "获取资源后页面会自动下载",
      CantScan: `我没有微信或不能完成验证`,
      DownloadAfter: "下载即将开始，弹窗记得点击“离开”或“确认”。",
      ManuallyClose: "此窗口将在几秒后自动关闭，或手动点击取消。",
      DownloadComplete: `下载完成后可以点击“取消”`,
      TranslateError: `翻译失败，请刷新页面重新翻译`,
      DocLimit: "文件限制20MB/100万字符",
      NewVersionAvailable: "请刷新页面更新到最新版",
      TelegramNotice: `DeepL 可能会在近期更新，请加入 <a href="https://t.me/+mO_DMkb-go44YmJh" target="_blank">Telegram</a> 频道。`
    }
  });
  i18n.enableFallback = true;
  const getI18nextLng = () => {
    return _unsafeWindow.localStorage.getItem("i18nextLng") === "zh" ? "zh" : "en";
  };
  const t = (scope, options) => {
    i18n.locale = getI18nextLng();
    return i18n.t(scope, options);
  };
  ajaxHook.proxy({
    onRequest: (config, handler) => {
      if (config.url.startsWith("https://document-translation-pro.www.deepl.com/documentTranslation/upload")) {
        config.url = `${baseURL}/documentTranslation/upload` + config.url.substring(config.url.indexOf("?"));
        if (config.body instanceof FormData) {
          const e = config.body.get("file");
          if (e) {
            const k = getLastDocumentIdAndKey() || {};
            k.fileName = e.name;
            setLastDocumentIdAndKey(k);
          }
        }
      } else if (config.url.startsWith("https://document-translation-pro.www.deepl.com/documentTranslation")) {
        config.url = `${baseURL}/documentTranslation` + config.url.substring(config.url.indexOf("?"));
        try {
          const e = JSON.parse(config.body).params.documentIdAndKey;
          if (e) {
            setLastDocumentIdAndKey(Object.assign(getLastDocumentIdAndKey() || {}, e));
          }
        } catch {
        }
      } else if (config.url.startsWith("https://api.deepl.com/jsonrpc")) {
        config.url = config.url.replace("https://api.deepl.com/jsonrpc", "https://www2.deepl.com/jsonrpc");
      }
      if (config.url.startsWith("https://document-translation-free.www.deepl.com/documentTranslation/upload")) {
        if (confirm(t("NotWork"))) {
          location.reload();
          return;
        }
      }
      handler.next(config);
    },
    onError: (err, handler) => {
      handler.next(err);
    },
    onResponse: (response, handler) => {
      handler.next(response);
    }
  }, _unsafeWindow);
  $(_unsafeWindow).on("load", () => {
    const timer = setInterval(() => {
      const e = $(".contents[role=tablist]");
      if (e.length < 1) {
        return;
      }
      clearInterval(timer);
      e.append($(`<button type="button" class="rounded-lg" 
        aria-labelledby="document-tab-heading document-tab-subheading" id="headlessui-tabs-tab-7" role="tab"
        aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-13">
    <div class="cardButton--vvujR ">
        <div class="innerUpper--bBQsJ px-4">
            <div style="margin-right: 1rem" class="mr-1 flex min-[560px]:hidden min-[660px]:flex justify-center items-center [&amp;>svg]:w-6 [&amp;>svg]:h-6 mx-1 min-[420px]:mx-6 min-[560px]:mx-12 min-[660px]:mx-0 text-blue-chill">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_659_75852)">
                <path d="M7.49998 0.523674C8.50002 5.49999 10.5 7.49999 15.554 8.5C10.5 9.49999 8.5 11.5 7.50005 16.4763C6.50002 11.5 4.50002 9.49999 -0.553986 8.49998C4.5 7.49999 6.5 5.49999 7.49998 0.523674Z" fill="url(#paint0_linear_659_75852)"/>
                <path d="M12.9933 4.90705C14.0451 4.90705 14.8979 4.05433 14.8979 3.00245C14.8979 1.95056 14.0451 1.09784 12.9933 1.09784C11.9414 1.09784 11.0886 1.95056 11.0886 3.00245C11.0886 4.05433 11.9414 4.90705 12.9933 4.90705Z" fill="url(#paint1_linear_659_75852)"/>
                </g>
                <defs>
                <linearGradient id="paint0_linear_659_75852" x1="7.50002" y1="0.523674" x2="7.50002" y2="16.4763" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3573F0"/>
                <stop offset="1" stop-color="#EA33EC"/>
                </linearGradient>
                <linearGradient id="paint1_linear_659_75852" x1="7.50002" y1="0.523674" x2="7.50002" y2="16.4763" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3573F0"/>
                <stop offset="1" stop-color="#EA33EC"/>
                </linearGradient>
                <clipPath id="clip0_659_75852">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>
            </div>
            <div class="hidden flex-col items-start justify-center min-[560px]:flex min-[660px]:ml-4">
                <div class="textUpper--qwA4g"><span>DeepL YES!</span></div>
                <div class="textLower--qKcBG"><span>${t("DocLimit")}</span></div>
            </div>
        </div>
        <div class="innerLower--WMElC"></div>
    </div>
</button>`).on("click", () => {
        location.href = "https://www5.deepl.com/translator/files";
      }));
      if (getI18nextLng() === "zh") {
        e.append($(`<a href="${rootURL}/deepl-translator/wx.png?r=${Math.random()}" target="_blank" class="rounded-lg" 
                    aria-labelledby="document-tab-heading document-tab-subheading" id="headlessui-tabs-tab-7" role="tab"
                    aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-13">
                <div class="cardButton--vvujR ">
                    <div class="innerUpper--bBQsJ px-4">
                        <div style="margin-right: 1rem" class="mr-1 flex min-[560px]:hidden min-[660px]:flex justify-center items-center [&amp;>img]:w-6 [&amp;>img]:h-6 mx-1 min-[420px]:mx-6 min-[560px]:mx-12 min-[660px]:mx-0 text-blue-chill">
                            <img class="w-6 h-6" src="https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon64_appwx_logo.png" alt=""/>
                        </div>
                        <div class="hidden flex-col items-start justify-center min-[560px]:flex min-[660px]:ml-4">
                            <div class="textUpper--qwA4g"><span>${t("WeChat")}</span></div>
                            <div class="textLower--qKcBG"><span>${t("HelpText")}</span></div>
                        </div>
                    </div>
                    <div class="innerLower--WMElC"></div>
                </div>
            </a>`));
        e.append($(`<a href="${rootURL}/deepl-translator/wx.png?r=${Math.random()}" target="_blank" class="rounded-lg" 
                aria-labelledby="document-tab-heading document-tab-subheading" id="headlessui-tabs-tab-7" role="tab"
                aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-13">
            <div class="cardButton--vvujR ">
                <div class="innerUpper--bBQsJ px-4">
                    <div style="margin-right: 1rem" class="mr-1 flex min-[560px]:hidden min-[660px]:flex justify-center items-center [&amp;>svg]:w-6 [&amp;>svg]:h-6 mx-1 min-[420px]:mx-6 min-[560px]:mx-12 min-[660px]:mx-0 text-blue-chill">
                        <img src="https://immersivetranslate.com/img/logo.png" class="w-6 h-6" alt=""/>
                    </div>
                    <div class="hidden flex-col items-start justify-center min-[560px]:flex min-[660px]:ml-4">
                        <div class="textUpper--qwA4g"><span>沉浸式翻译</span></div>
                        <div class="textLower--qKcBG"><span>需要沉浸式翻译会员或DeepL API？</span></div>
                    </div>
                </div>
                <div class="innerLower--WMElC"></div>
            </div>
        </a>`));
      } else {
        e.append($(`<a href="${donateURL}" target="_blank" class="rounded-lg" 
                aria-labelledby="document-tab-heading document-tab-subheading" id="headlessui-tabs-tab-7" role="tab"
                aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-13">
            <div class="cardButton--vvujR ">
                <div class="innerUpper--bBQsJ px-4">
                    <div style="margin-right: 1rem" class="mr-1 flex min-[560px]:hidden min-[660px]:flex justify-center items-center [&amp;>svg]:w-6 [&amp;>svg]:h-6 mx-1 min-[420px]:mx-6 min-[560px]:mx-12 min-[660px]:mx-0 text-blue-chill">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#40B6E0" fill-rule="evenodd" d="M6.32596339,3.9575998 C6.3377101,4.02808005 6.30246998,4.0868136 6.18500289,4.14554714 C6.03229567,4.06332018 5.70338781,4.01633335 5.43321351,4.03982676 C5.13954578,4.06332018 4.89286489,4.15729385 4.92810502,4.35698791 C4.97509185,4.55668196 5.25701287,4.67414905 5.76212136,4.62716222 C6.99552581,4.52144183 6.9837791,3.68742549 8.7927723,3.52297156 C10.2023774,3.39375776 10.9894069,3.828386 11.0951273,4.35698791 C11.1773542,4.76812273 10.8366997,5.16751083 9.81473599,5.2497378 C8.91023939,5.33196476 8.38163748,5.08528387 8.33465065,4.83860298 C8.31115723,4.70938918 8.38163748,4.52144183 8.81626572,4.474455 C8.86325255,4.67414905 9.10993344,4.88558982 9.6972689,4.82685627 C10.1201504,4.79161614 10.4725517,4.63890893 10.4255649,4.40397474 C10.378578,4.15729385 9.93220308,4.01633335 9.22740053,4.07506689 C7.79430203,4.20428069 7.44190076,4.9913102 6.22024301,5.09703058 C5.35098654,5.17925754 4.646184,4.8620964 4.55221033,4.39222804 C4.5169702,4.2160274 4.5169702,3.80489258 5.43321351,3.72266562 C5.90308187,3.68742549 6.27897656,3.76965245 6.32596339,3.9575998 Z M8.04098292,6.1542344 C6.52565745,6.1542344 5.17478591,6.00152718 4.19980905,5.79008641 C3.15435195,5.53165881 2.60225662,5.2497378 2.60225662,4.88558982 C2.60225662,4.7328826 2.67273687,4.6036688 2.88417764,4.45096158 C2.22636193,4.70938918 1.87396066,4.92082994 1.87396066,5.2497378 C1.90920079,5.61388578 2.49653624,5.97803376 3.69470056,6.25995478 C4.82238463,6.54187579 6.26722985,6.69458301 8.00574279,6.69458301 C9.77949586,6.69458301 11.1891009,6.54187579 12.316785,6.25995478 C13.5149493,5.97803376 14.0905381,5.60213907 14.0905381,5.2497378 C14.0905381,4.9913102 13.8321105,4.74462931 13.3622421,4.55668196 C13.4679625,4.62716222 13.5501895,4.74462931 13.5501895,4.87384311 C13.5501895,5.23799109 13.0098409,5.53165881 11.9173969,5.77833971 C10.9071799,6.00152718 9.61504193,6.1542344 8.04098292,6.1542344 Z M2.62434459,8.71109321 C2.55443531,8.77618602 2.48842845,8.84791463 2.42605598,8.92645774 C2.14413497,9.33759255 2.03841459,9.80746092 2.14413497,10.3125694 C2.21461522,10.852918 2.50828295,11.299293 2.94291118,11.6164541 C3.34229929,11.9336153 3.7416874,12.0863225 4.21155576,12.0863225 C3.98836829,12.1568027 3.7416874,12.2742698 3.51849993,12.3095099 C2.94291118,12.4152303 2.43780269,12.3095099 1.96793433,11.945362 C1.52155939,11.581214 1.23963837,11.1113456 1.20439824,10.5357569 C1.16915811,9.96016813 1.34535875,9.37283268 1.74474686,8.86772419 C1.95687392,8.59944585 2.1888834,8.39081479 2.44429536,8.23655092 C2.22904804,7.62665813 2.06535351,6.98801449 1.96793433,6.33043503 C2.15588168,6.62410276 2.69623029,6.90602378 3.70644727,7.16445137 C4.83413134,7.41113227 6.27897656,7.59907961 8.05272963,7.59907961 C9.79124257,7.59907961 11.2360878,7.42287897 12.3637719,7.16445137 C13.3387487,6.9412639 13.8790973,6.65934289 14.1140315,6.33043503 C13.890844,7.61082632 13.4914559,8.80899064 12.9158672,9.85444775 C12.4812389,10.5122635 12.0466107,11.0878522 11.6119825,11.7104278 C11.4357818,12.0745758 11.3183147,12.4387237 11.2478345,12.8028717 L11.2125944,12.8028717 C10.9189266,13.2022598 10.5195385,13.4489407 10.0496702,13.6016479 C9.41534788,13.8130887 8.72229204,13.9188091 8.06447634,13.883569 L7.99399608,13.883569 C7.33618037,13.9188091 6.69011138,13.8248354 6.0675358,13.6016479 C5.56242731,13.4606874 5.15129249,13.2022598 4.86937147,12.8028717 C4.78714451,12.4387237 4.65793071,12.0745758 4.46998336,11.7104278 C4.03535513,11.0878522 3.60072689,10.5122635 3.16609866,9.85444775 C2.9672344,9.48918688 2.78519636,9.1070998 2.62434459,8.71109321 Z"/></svg>
                    </div>
                    <div class="hidden flex-col items-start justify-center min-[560px]:flex min-[660px]:ml-4">
                        <div class="textUpper--qwA4g"><span>Donate</span></div>
                        <div class="textLower--qKcBG"><span>Buy me a coffee</span></div>
                    </div>
                </div>
                <div class="innerLower--WMElC"></div>
            </div>
        </a>`));
        e.append($(`<a href="https://taobao.starxg.com/open/go?id=6c2963e3da1343159433620dd42e88a1" target="_blank" class="rounded-lg" 
                aria-labelledby="document-tab-heading document-tab-subheading" id="headlessui-tabs-tab-7" role="tab"
                aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="headlessui-tabs-panel-13">
            <div class="cardButton--vvujR ">
                <div class="innerUpper--bBQsJ px-4">
                    <div style="margin-right: 1rem" class="mr-1 flex min-[560px]:hidden min-[660px]:flex justify-center items-center [&amp;>svg]:w-6 [&amp;>svg]:h-6 mx-1 min-[420px]:mx-6 min-[560px]:mx-12 min-[660px]:mx-0 text-blue-chill">
                        <img src="https://static.deepl.com/img/favicon/favicon_96.png" alt="" class="w-6 h-6"/>
                    </div>
                    <div class="hidden flex-col items-start justify-center min-[560px]:flex min-[660px]:ml-4">
                        <div class="textUpper--qwA4g"><span>DeepL API</span></div>
                        <div class="textLower--qKcBG"><span>We sell DeepL API(Cheap).</span></div>
                    </div>
                </div>
                <div class="innerLower--WMElC"></div>
            </div>
        </a>`));
      }
    }, 1e3);
  });
  _GM_addStyle(`
    button[data-testid=doctrans-translation-with-edits-button]{
        display:none;
    }
    
    .textUpper--qwA4g {
        color: #006494;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
    
    .textLower--qKcBG {
        color: #6e6e6e;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
    }
`);
  const downloadFile = (e, ticket, token) => {
    const $form = $("<form></form>").attr("action", `${baseURL}/documentTranslation/download?lkx-ticket=${ticket}&lkx-token=${token}&lkx-resourceId=${lkxResourceId}`).attr("method", "post").hide();
    $form.append($("<input>").attr("type", "hidden").attr("name", "documentId").val(e.documentId));
    $form.append($("<input>").attr("type", "hidden").attr("name", "documentKey").val(e.documentKey));
    $form.append($("<input>").attr("type", "hidden").attr("name", "fileName").val(e.fileName));
    $form.append($("<input>").attr("type", "hidden").attr("name", "expectsPro").val("true"));
    $(document.body).append($form);
    $form.trigger("submit");
  };
  const openTicketDialog = (k) => {
    let isDone = false;
    let isCancel = false;
    const $ele = $(`
    <div class="scan-qr fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center" style="background: rgba(0,0,0,.85);z-index: 9999999">
      <div class="mt-2 text-white font-bold" style="margin-top: 10rem">
        ${t("WeChatVerify")}
      </div>
      <div class="mt-2" style="position: relative">
        <img class="w-52 h-52 qrcode"  src="https://i.gifer.com/ZKZg.gif" alt=""/>
        <div class="w-52 h-52 qrcode-success" style="position: absolute;top: 0;background: rgba(255,255,255,0.7)">
            <img class="w-52 h-52" src="data:image/svg+xml;base64,PCEtLSBDb3B5cmlnaHQgMjAwMC0yMDIxIEpldEJyYWlucyBzLnIuby4gYW5kIGNvbnRyaWJ1dG9ycy4gVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIEFwYWNoZSAyLjAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlLiAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cG9seWdvbiBmaWxsPSIjNTlBODY5IiBwb2ludHM9IjEzLjc4OSAyLjA5IDE1LjUzNSAzLjgzNyA2LjI5MiAxMy4wOCAxLjk1IDguNzM4IDMuNjk4IDYuOTkgNi4yOTMgOS41ODUiLz4KPC9zdmc+Cg==" alt=""/>
        </div>
      </div>
      <div class="mt-2 text-white font-bold text-center">
          <span class="qr-tip">
              ${t("ScanTip")}
              <br/>
              ${t("AutoDownloadTip")}
          </span>
          <br/>
          <span class="tip">
            ${t("DownloadAfter")}
            <br/>
            ${t("ManuallyClose")}
            <br/>
          </span>
          <a class="hover:text-white cantverify" >
              ${t("CantScan")}
          </a>
      </div>
      <div class="mt-2">
        <button class="close-scan-qr inline-flex relative items-center whitespace-nowrap border-1 font-semibold ui-focus-visible:outline ui-focus-visible:outline-3 ui-focus-visible:outline-offset-2 ui-focus-visible:outline-blue-next-600 ui-focus-visible:border-opacity-0 disabled:text-neutral-next-400 disabled:bg-neutral-next-100 disabled:border-neutral-next-100 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 aria-disabled:text-neutral-next-400 aria-disabled:bg-neutral-next-100 aria-disabled:border-neutral-next-100 aria-disabled:pointer-events-none aria-disabled:cursor-default dark:disabled:text-neutral-next-400 dark:disabled:bg-neutral-next-600 dark:disabled:border-neutral-next-600 dark:disabled:opacity-50 dark:aria-disabled:text-neutral-next-400 dark:aria-disabled:bg-neutral-next-600 dark:aria-disabled:border-neutral-next-600 dark:ui-focus-visible:outline-blue-next-400 cursor-pointer align-text-bottom text-white bg-blue-next-500 border-blue-next-500 hover:text-white hover:bg-blue-next-700 hover:border-blue-next-700 active:bg-blue-next-800 active:border-blue-next-800 dark:text-white dark:bg-blue-next-500 dark:border-blue-next-500 dark:hover:text-white dark:hover:bg-blue-next-700 dark:hover:border-blue-next-700 dark:active:bg-blue-next-800 dark:active:border-blue-next-800 text-base leading-5 px-6 pt-[10px] pb-3 rounded-md">${t("CancelDownload")}</button>
      </div>
    </div>
    `);
    $ele.find(".tip").hide();
    $ele.find(".qrcode-success").hide();
    $(document.body).append($ele).css("overflow", "hidden");
    $ele.on("click", ".close-scan-qr", function() {
      document.querySelectorAll(".scan-qr").forEach((e) => {
        var _a;
        (_a = e.parentNode) == null ? void 0 : _a.removeChild(e);
      });
      document.body.style.overflow = "auto";
      isCancel = true;
    });
    $ele.on("click", ".cantverify", function() {
      if (getI18nextLng() === "zh") {
        window.open(`${rootURL}/deepl-translator/wx.png?r=${Math.random()}`, "_blank");
      } else {
        $ele.find(".cantverify").hide();
        skipVerify();
      }
      return false;
    });
    function skipVerify(ticket = "skip", token = "skip") {
      isDone = true;
      $ele.find(".tip").show();
      $ele.find(".qrcode-success").show();
      $ele.find(".qr-tip").hide();
      setTimeout(function() {
        $ele.remove();
      }, 1e3 * 10);
      downloadFile(k, ticket, token);
    }
    function loop(ticket) {
      if (isCancel || isDone) {
        return;
      }
      $.ajax({
        url: `https://api.likexiang.com/openapi/experimental/resource/ticket/status?ticket=${ticket}`,
        dataType: "json",
        success: function(res) {
          isDone = res.status === "fetched";
          if (isDone) {
            skipVerify(ticket, res.token);
          }
        },
        complete: function() {
          setTimeout(function() {
            loop(ticket);
          }, 1e3);
        }
      });
    }
    $.ajax({
      url: `https://api.likexiang.com/openapi/experimental/resource/ticket/create`,
      dataType: "jsonp",
      data: {
        resourceId: lkxResourceId
      },
      success: function(res) {
        $ele.find(".qrcode").prop("src", res.qrcode);
        loop(res.ticket);
      }
    });
  };
  $(_unsafeWindow).on("load", () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(function(mutation) {
        const ele = $(mutation.target).find("button[data-testid=doctrans-upload-result-download]");
        if (ele.length > 0) {
          const e = ele.clone();
          e.attr("data-testid", "");
          e.on("click", () => {
            const k = getLastDocumentIdAndKey();
            if (k) {
              e.text(t("DownloadComplete"));
              if (getI18nextLng() === "zh") {
                openTicketDialog(k);
              } else {
                downloadFile(k, "skip", "skip");
              }
            } else {
              alert(t("TranslateError"));
            }
          });
          ele.parent().append(e);
          ele.remove();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  $(_unsafeWindow).on("load", () => {
    if (getI18nextLng() !== "zh") {
      $.ajax({
        url: "https://api.ip.sb/geoip",
        dataType: "jsonp",
        success: function(res) {
          if (["TW", "HK", "CN"].includes(res.country_code)) {
            _unsafeWindow.location.href = location.origin + "/zh/translator";
          }
        }
      });
    }
  });

})(ah, I18n, jQuery);