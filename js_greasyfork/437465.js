// ==UserScript==
// @name         i18n-baidu-naotu
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  百度脑图导出国际化 key
// @author       yiming.lilym
// @include     *://naotu.baidu.com/file/*
// @license      GPL License
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437465/i18n-baidu-naotu.user.js
// @updateURL https://update.greasyfork.org/scripts/437465/i18n-baidu-naotu.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const BAIDU_NAOTU_URL = "https://naotu.baidu.com/file/";

  const $ = window.$;

  function jsonToI18ns(obj, prefix = "") {
    const { data: { text }, children } = obj;
    if (children.length) {
      const i18n = prefix ? `${prefix}_${text}` : text;
      const i18ns = children.map((obj) => jsonToI18ns(obj, i18n));
      return i18ns.flat(Infinity);
    } else {
      return `"${prefix}": "${text}"`;
    }
  }

  function handleCopyI18n(e) {
    if (window.minder && window.minder.exportJson) {
      const json = window.minder.exportJson();
      const i18ns = jsonToI18ns(json.root);
      const i18n = i18ns.join(",\n");
      $("body").append('<div id="copyI18n"></div>');
      $("#copyI18n").attr("data-clipboard-text", i18n);
      const clipboard = new ClipboardJS("#copyI18n");
      $("#copyI18n").click().remove();
      clipboard.destroy();
    }
  }

  function addCopyButton() {
    $("body").append('<div id="copyI18nBtn">复制 key</div>');
    $("#copyI18nBtn")
      .css({
        position: "absolute",
        right: 50,
        bottom: 50,
        height: 40,
        lineHeight: "40px",
        padding: "0 20px",
        borderRadius: 2,
        fontSize: 20,
        textAlign: "center",
        backgroundColor: "#ee4d2d",
        boxShadow: "0 2px 0 rgb(0 0 0 / 5%)",
        color: "#fff",
        cursor: "pointer",
        zIndex: 100,
      })
      .on("click", handleCopyI18n);
  }

  $(document).ready(function () {
    if (window.location.href.startsWith(BAIDU_NAOTU_URL)) {
      addCopyButton();
    }
  });
})();
