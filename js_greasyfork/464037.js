// ==UserScript==
// @name         海角社区脚本
// @namespace    haijiao-script
// @version      0.0.9
// @author       memopac
// @description  海角社区视频解析
// @license      MIT
// @icon         https://pomf2.lain.la/f/erejxtfo.ico
// @match        https://haijiao.com/*
// @match        https://hj*.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.27.1
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.3.5
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464037/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464037/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" .crack_container{position:fixed;top:80px;right:20px}.crack_title{font-size:20px;font-weight:700;text-align:center;border:1px solid #000;cursor:pointer;display:block}.crack_player{position:fixed;top:0;bottom:0;left:0;right:0}.crack_player .iframeBox{width:70vw;margin:auto} ");
 
(function (DPlayer, hls_js, $) {
  'use strict';
 
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function isValidHttpUrl(str) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
      // fragment locator
      "i"
    );
    return pattern.test(str);
  }
  function main() {
    try {
      let init = function() {
        crackBtn = $('<div class="crack_title" id="crack_anal">解析</div>');
        jumpLink1 = $(
          '<a class="crack_title" target="_blank" id="crack_jump">跳转播放1</a>'
        ).hide();
        jumpLink2 = $(
          '<a class="crack_title" target="_blank" id="crack_jump">跳转播放2</a>'
        ).hide();
        copyBtn = $(
          '<div class="crack_title" id="crack_copy">本页可观看</div>'
        ).hide();
        container = $(`<div class="crack_container"></div>`).append(crackBtn).append(jumpLink1).append(jumpLink2).append(copyBtn);
        crackBtn.one("click", crack);
        $("body").append(container);
      }, crack = function() {
        crackBtn.html("解析中");
        const url = `http://hj.viphk.91tunnel.com/api/hjjx?id=${window.location.href}`;
        _GM_xmlhttpRequest({
          method: "GET",
          url,
          onload: function({ response }) {
            try {
              const formatStr = String(response).match(/({.*})/);
              if (!formatStr) {
                return;
              }
              const formatObj = JSON.parse(formatStr[1]);
              if (formatObj == null ? void 0 : formatObj.data) {
                const validUrl = isValidHttpUrl(formatObj == null ? void 0 : formatObj.data);
                if (validUrl) {
                  crackBtn.hide();
                  const url2 = formatObj == null ? void 0 : formatObj.data;
                  const encodeUrl2 = `https://m3u8play.com/?play=${encodeURIComponent(
                  url2
                )}`;
                  const encodeUrl1 = `https://m.auok.run/player/#${url2}`;
                  const sellContainer = document.querySelector("span.sell-btn");
                  jumpLink1.attr("href", encodeUrl1);
                  jumpLink2.attr("href", encodeUrl2);
                  if (sellContainer) {
                    sellContainer.innerHTML = "";
                    new DPlayer({
                      container: sellContainer,
                      autoplay: false,
                      theme: "#FADFA3",
                      loop: true,
                      lang: "zh",
                      screenshot: true,
                      hotkey: true,
                      preload: "auto",
                      video: {
                        url: url2,
                        type: "hls"
                      }
                    });
                  }
                  copyBtn.on("click", () => {
                    _GM_setClipboard(url2, "text/plain");
                  });
                  jumpLink1.show();
                  jumpLink2.show();
                  copyBtn.show();
                  return;
                }
              }
              container.hide();
            } catch (error) {
              container.css("width", "60px").html(response);
            }
          },
          onerror: function() {
            container.hide();
          }
        });
      };
      const isHaiJiaoPid = window.location.href.includes("?pid=");
      if (!isHaiJiaoPid)
        return;
      let crackBtn;
      let jumpLink1;
      let jumpLink2;
      let copyBtn;
      let container;
      const mutationObserver = new MutationObserver(() => {
        const sellContainer = document.querySelector("span.sell-btn");
        if (sellContainer) {
          init();
          crack();
          mutationObserver.disconnect();
        }
      });
      setTimeout(() => {
        mutationObserver.disconnect();
      }, 120 * 1e3);
      mutationObserver.observe(document.body, {
        attributes: true,
        childList: true
      });
    } catch (error) {
    }
  }
  (() => {
    main();
  })();
 
})(DPlayer, Hls, jQuery);