// ==UserScript==
// @name         米游社cookie
// @namespace    mys-cookie
// @version      0.2
// @description  获取米游社cookie信息
// @author       erinilis
// @license      GPL-3.0
// @include      *://bbs.mihoyo.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435553/%E7%B1%B3%E6%B8%B8%E7%A4%BEcookie.user.js
// @updateURL https://update.greasyfork.org/scripts/435553/%E7%B1%B3%E6%B8%B8%E7%A4%BEcookie.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let run = () => {

    let info_card = $(`
        <span id="get-mys-cookie" class="mhy-button__button" style="text-align: center;background-color: #7fffd4;">点击获取cookie信息</span>
        `);
    info_card.click(function () {
      _ = (n) => {
        let cookies = document.cookie.split(";");
        for (let i in cookies) {
          let arr = cookies[i].split("=");
          if (arr[0].trim() == n) return arr[1];
        }
      };
      let c = _("cookie_token") || _("ltoken") || alert("获取失败, 请重新登录");
      let m = (_("account_id") || _("ltuid")) + "," + c;
      if (c && confirm("获取成功 点击确定复制到剪切板\n" + m)) {
        var clipboard = new ClipboardJS('#get-mys-cookie', {
          text: function () {
            return m;
          },
        });
        clipboard.on("success", function (e) {
          console.log(e);
        });
        clipboard.on("error", function (e) {
          alert('复制失败')
        });
      }
    });
    $(".root-page-container").prepend(info_card);
  };

  let MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver,
    observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        let $node = $(mutation.addedNodes);
        if ($node.attr("id") === "__nuxt") {
          observer.disconnect();
          run();
        }
      }
    });
  observer.observe(document.getElementsByTagName("body")[0], {
    childList: true,
  });
})();
