// ==UserScript==
// @name              B 站番剧播放页面显示封面
// @version           0.1.0
// @description       在 bilibili 番剧播放页集数选择下面显示封面，并添加全屏与弹幕开关快捷键
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             https://www.bilibili.com/bangumi/play/*
// @require           https://lib.baomitu.com/arrive/2.4.1/arrive.min.js
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/448859/B%20%E7%AB%99%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448859/B%20%E7%AB%99%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  "use strict";
  ;
  function waitArrive(sel, cb) {
    document.arrive(sel, { existing: true }, (element) => {
      cb(element);
    });
  }
  function onKeypress(ev) {
    ev.code == "Digit1" && $(".bui-switch-input").trigger("click");
    ev.code == "Backquote" && $(".squirtle-video-fullscreen").trigger("click");
  }
  function run() {
    addEventListener("keypress", onKeypress);
    waitArrive("#eplist_module", () => {
      $("#eplist_module").after(`<img id="_ep_info_cover_" src="${__INITIAL_STATE__.epInfo.cover}" style="width:320px;margin-bottom:20px">`);
      $("#eplist_module ul").on("click", "li", function() {
        $("#_ep_info_cover_").attr("src", this.__vue__.epInfo.cover);
      });
    });
  }
  addEventListener("load", run);
})();
