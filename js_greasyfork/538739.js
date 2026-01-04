// ==UserScript==
// @name         导出 B 站视频笔记
// @namespace    bilibili-video-note-export
// @version      0.1.0
// @author       showlotus
// @description  export bilibili video note
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @match        https://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/modern-screenshot@4.6.0/dist/index.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538739/%E5%AF%BC%E5%87%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/538739/%E5%AF%BC%E5%87%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(' *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }#bilibili-video-note-export .ml-\\[10px\\]{margin-left:10px}#bilibili-video-note-export .box-border{box-sizing:border-box}#bilibili-video-note-export .block{display:block}#bilibili-video-note-export .flex{display:flex}#bilibili-video-note-export .h-\\[85px\\]{height:85px}#bilibili-video-note-export .cursor-pointer{cursor:pointer}#bilibili-video-note-export .flex-col{flex-direction:column}#bilibili-video-note-export .items-center{align-items:center}#bilibili-video-note-export .justify-between{justify-content:space-between}#bilibili-video-note-export .gap-1{gap:.25rem}#bilibili-video-note-export .gap-2{gap:.5rem}#bilibili-video-note-export .rounded-md{border-radius:.375rem}#bilibili-video-note-export .border{border-width:1px}#bilibili-video-note-export .border-b{border-bottom-width:1px}#bilibili-video-note-export .border-l-0{border-left-width:0px}#bilibili-video-note-export .border-r-0{border-right-width:0px}#bilibili-video-note-export .border-t{border-top-width:1px}#bilibili-video-note-export .border-solid{border-style:solid}#bilibili-video-note-export .border-\\[\\#00aeec\\]{--tw-border-opacity: 1;border-color:rgb(0 174 236 / var(--tw-border-opacity, 1))}#bilibili-video-note-export .border-\\[\\#e3e5e7\\]{--tw-border-opacity: 1;border-color:rgb(227 229 231 / var(--tw-border-opacity, 1))}#bilibili-video-note-export .bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}#bilibili-video-note-export .px-3{padding-left:.75rem;padding-right:.75rem}#bilibili-video-note-export .px-5{padding-left:1.25rem;padding-right:1.25rem}#bilibili-video-note-export .py-1{padding-top:.25rem;padding-bottom:.25rem}#bilibili-video-note-export .py-3{padding-top:.75rem;padding-bottom:.75rem}#bilibili-video-note-export .text-sm{font-size:.875rem;line-height:1.25rem}#bilibili-video-note-export .text-\\[\\#00aeec\\]{--tw-text-opacity: 1;color:rgb(0 174 236 / var(--tw-text-opacity, 1))}.note-pc .note-container .note-header{min-height:62px}.note-pc .note-container .note-content.bilibili-video-note-export__after-note-export{height:calc(100% - 147px)}.note-pc .note-container .note-up.note-detail-up{margin-bottom:0!important}.note-pc .note-container .editor-innter{margin-top:16px!important}.note-pc.is-exporting,.note-pc.is-copying{height:auto!important}.note-pc.is-exporting #bilibili-video-note-export__export-image,.note-pc.is-copying #bilibili-video-note-export__copy-image{cursor:not-allowed;pointer-events:none;background-color:#00b5f6!important;color:#fff!important}.note-pc.is-exporting #bilibili-video-note-export__export-image:after{content:"\u5BFC\u51FA\u4E2D..."}.note-pc.is-copying #bilibili-video-note-export__copy-image:after{content:"\u590D\u5236\u4E2D..."}.note-pc.is-exporting .note-operation,.note-pc.is-copying .note-operation{display:none!important}.note-pc.is-exporting #bilibili-video-note-export>div,.note-pc.is-copying #bilibili-video-note-export>div{position:relative}.note-pc.is-exporting #bilibili-video-note-export>div:after,.note-pc.is-copying #bilibili-video-note-export>div:after{content:"";position:absolute;bottom:-1px;left:0;width:30%;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.2) 20%,#00aeec 50%,rgba(255,255,255,.2) 80%,transparent 100%);animation:loading 1.75s ease-in-out infinite alternate}@keyframes loading{0%{transform:translate(-50%)}50%{transform:translate(calc(85 / 30 * 100%))}to{transform:translate(-50%)}}#bilibili-video-note-export .after\\:content-\\[attr\\(data-text\\)\\]:after{--tw-content: attr(data-text);content:var(--tw-content)}#bilibili-video-note-export .hover\\:border-transparent:hover{border-color:transparent}#bilibili-video-note-export .hover\\:bg-\\[\\#00b5f6\\]:hover{--tw-bg-opacity: 1;background-color:rgb(0 181 246 / var(--tw-bg-opacity, 1))}#bilibili-video-note-export .hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))} ');

(function (modernScreenshot) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const $ = (selector) => {
    return document.querySelector(selector);
  };
  const $$ = (selector) => {
    return document.querySelectorAll(selector);
  };
  const logger = {
    debug: (...args) => {
      return;
    },
    info: (...args) => {
      console.info("%c[bilibili-video-note-export]", "color: #2196F3", ...args);
    },
    warn: (...args) => {
      console.warn("%c[bilibili-video-note-export]", "color: #FF9800", ...args);
    },
    error: (...args) => {
      console.error("%c[bilibili-video-note-export]", "color: #F44336", ...args);
    }
  };
  const watchElementVisibility = (selector, callback, options = { immediate: true }) => {
    const getEl = () => {
      return typeof selector === "string" ? document.querySelector(selector) : selector;
    };
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          callback(true);
        } else {
          callback(false);
        }
      },
      {
        // 当元素进入视口时触发
        threshold: 0.01
      }
    );
    const mutationObserver = new MutationObserver(() => {
      const el2 = getEl();
      if (el2) {
        intersectionObserver.unobserve(el2);
        intersectionObserver.observe(el2);
      }
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    const el = getEl();
    if (el && options.immediate) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      if (isVisible) {
        callback(true);
      }
    }
    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  };
  const convertImagesToBase64 = async (el) => {
    const images = Array.from(el.querySelectorAll("img"));
    for (const img of images) {
      const src = img.src;
      img.removeAttribute("loading");
      if (src.startsWith("data:")) continue;
      try {
        const response = await fetch(src, { mode: "cors" });
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        if (img.parentElement && img.parentElement.tagName.toLowerCase() === "picture") {
          const sources = img.parentElement.querySelectorAll("source");
          sources.forEach((source) => source.setAttribute("srcset", base64));
        }
        img.src = base64;
      } catch (err) {
        logger.warn(`无法转换图片为 base64：${src}`, err);
      }
    }
  };
  const copyScreenshotToClipboard = async (el) => {
    await convertImagesToBase64(el);
    const blob = await modernScreenshot.domToBlob(el, { type: "image/png" });
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
    logger.info("图片已复制到剪贴板");
  };
  const exportScreenshotToImage = async (el) => {
    await convertImagesToBase64(el);
    return modernScreenshot.domToImage(el, {
      debug: true,
      progress: (current, total) => {
      }
    }).then((img) => {
      const link = document.createElement("a");
      link.download = document.title + "-笔记截图.png";
      link.href = img.src;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const mount = () => {
    const APP_ID = "bilibili-video-note-export";
    const root = document.createElement("div");
    root.setAttribute("id", APP_ID);
    let unwatchNoteDetail;
    const unwatchNotePc = watchElementVisibility("div.note-pc", (isNotePcShow) => {
      if (!isNotePcShow) {
        return;
      }
      if (unwatchNoteDetail) return;
      unwatchNoteDetail = watchElementVisibility("div.note-detail", (noteDetailShow) => {
        var _a, _b, _c, _d, _e, _f;
        if (noteDetailShow) {
          const el = $(`div#${APP_ID}`);
          if (el) {
            el.style.display = "block";
            (_a = $("div.note-container div.note-content")) == null ? void 0 : _a.classList.add(
              "bilibili-video-note-export__after-note-export"
            );
            (_b = $("div.note-container div.ql-editor")) == null ? void 0 : _b.setAttribute(
              "id",
              "bilibili-video-note-export__ql-editor"
            );
            const exportStyle = _GM_getValue("export-style", "default");
            if (exportStyle === "simple") {
              (_c = $("div#bilibili-video-note-export__ql-editor")) == null ? void 0 : _c.classList.remove("ql-editor");
            } else {
              (_d = $("div#bilibili-video-note-export__ql-editor")) == null ? void 0 : _d.classList.add("ql-editor");
            }
            const includeAuthorInfo = _GM_getValue("include-author-info", true);
            if (includeAuthorInfo) {
              $("div.note-container div.note-up.note-detail-up").style.display = "flex";
            } else {
              $("div.note-container div.note-up.note-detail-up").style.display = "none";
            }
            return;
          }
          root.innerHTML = /* html */
          `
          <div class="h-[85px] py-3 px-5 flex flex-col justify-between gap-1 box-border bg-white border-t border-b border-solid border-l-0 border-r-0 border-[#e3e5e7] text-sm">
            <div class="flex gap-2">
              <span>样式：</span>
              <div class="flex gap-2 items-center">
                <input type="radio" id="bilibili-video-note-export__default-style" name="export-style" value="default" checked />
                <label for="bilibili-video-note-export__default-style">默认样式</label>
              </div>
              <div class="flex gap-2 items-center">
                <input type="radio" id="bilibili-video-note-export__simple-style" name="export-style" value="simple" />
                <label for="bilibili-video-note-export__simple-style">简洁样式</label>
              </div>
              <div class="flex gap-2 items-center ml-[10px]">
                <input type="checkbox" id="bilibili-video-note-export__include-author-info" name="include-author-info" checked />
                <label for="bilibili-video-note-export__include-author-info">包含发布者</label>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span>操作：</span>
              <div id="bilibili-video-note-export__copy-image" class="py-1 px-3 border-[#00aeec] border-solid border rounded-md text-[#00aeec] cursor-pointer hover:bg-[#00b5f6] hover:border-transparent hover:text-white after:content-[attr(data-text)]" data-text="复制为图片"></div>
              <div id="bilibili-video-note-export__export-image" class="py-1 px-3 border-[#00aeec] border-solid border rounded-md text-[#00aeec] cursor-pointer hover:bg-[#00b5f6] hover:border-transparent hover:text-white after:content-[attr(data-text)]" data-text="导出为图片"></div>
            </div>
          </div>
        `;
          (_e = $("div.note-container")) == null ? void 0 : _e.insertBefore(root, $("div.note-container div.note-content"));
          $$('input[name="export-style"]').forEach((radio) => {
            radio.addEventListener("change", (e) => {
              const target = e.target;
              if (target.value === "simple") {
                $("div#bilibili-video-note-export__ql-editor").classList.remove("ql-editor");
              } else {
                $("div#bilibili-video-note-export__ql-editor").classList.add("ql-editor");
              }
              _GM_setValue("export-style", target.value);
            });
          });
          $('input[name="include-author-info"]').addEventListener("change", (e) => {
            const target = e.target;
            if (target.checked) {
              $("div.note-container div.note-up.note-detail-up").style.display = "flex";
            } else {
              $("div.note-container div.note-up.note-detail-up").style.display = "none";
            }
            _GM_setValue("include-author-info", target.checked);
          });
          $("div#bilibili-video-note-export__copy-image").addEventListener("click", async () => {
            $("div.note-pc").classList.add("is-copying");
            await copyScreenshotToClipboard($("div.note-container div.note-content"));
            $("div.note-pc").classList.remove("is-copying");
          });
          $("div#bilibili-video-note-export__export-image").addEventListener("click", async () => {
            logger.debug("导出为图片", {
              exportStyle: _GM_getValue("export-style", "default"),
              includeAuthorInfo: _GM_getValue("include-author-info", true)
            });
            $("div.note-pc").classList.add("is-exporting");
            await exportScreenshotToImage($("div.note-container div.note-content"));
            $("div.note-pc").classList.remove("is-exporting");
          });
        } else {
          (_f = $("div.note-container div.note-content")) == null ? void 0 : _f.classList.remove(
            "bilibili-video-note-export__after-note-export"
          );
          const el = $(`div#${APP_ID}`);
          if (el) {
            el.style.display = "none";
          }
        }
      });
    });
    logger.info("插件运行中...");
    return () => {
      var _a, _b;
      (_a = $("div.note-container div.note-content")) == null ? void 0 : _a.classList.remove(
        "bilibili-video-note-export__after-note-export"
      );
      $("div.note-pc").classList.remove("is-copying", "is-exporting");
      (_b = $(`div#${APP_ID}`)) == null ? void 0 : _b.remove();
      unwatchNotePc();
      unwatchNoteDetail == null ? void 0 : unwatchNoteDetail();
    };
  };
  mount();

})(modernScreenshot);