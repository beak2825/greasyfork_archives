// ==UserScript==
// @name 滚动条微软雅黑字体
// @description 滚动条,字体样式调整
// @author Dawn
// @version 0.2.0
// @match *://*/*
// @run-at document-start
// @namespace https://greasyfork.org/users/714473
// @downloadURL https://update.greasyfork.org/scripts/418337/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/418337/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
  let css = "";
  css += `

  ::-webkit-scrollbar {width: 6px; height: 6px; }
  ::-webkit-scrollbar-track {width: 6px; background: rgba(123,123,123, 0.1); -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
  ::-webkit-scrollbar-thumb {background-color: rgba(123,123,123, 0.5); background-clip: padding-box; min-height: 28px; -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }
  ::-webkit-scrollbar-thumb:hover {background-color: rgba(123,123,123, 1); }
  
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  body {
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
      "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  button,
  input,
  keygen,
  optgroup,
  select,
  textarea {
    font-family: inherit;
  }
  
  code,
  kbd,
  pre,
  samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
      "方正兰亭黑_GBK", system-ui, -apple-system, monospace, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  html:lang(zh) body,
  html:lang(zh-CN) body,
  html:lang(zh-SG) body,
  html:lang(cmn-Hans) body,
  html:lang(zh-cmn-Hans) body,
  html:lang(zh-Hans) body {
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
      "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
    quotes: "“" "”";
  }
  
  html:lang(zh) code,
  html:lang(zh) kbd,
  html:lang(zh) pre,
  html:lang(zh) samp,
  html:lang(zh-CN) code,
  html:lang(zh-CN) kbd,
  html:lang(zh-CN) pre,
  html:lang(zh-CN) samp,
  html:lang(zh-SG) code,
  html:lang(zh-SG) kbd,
  html:lang(zh-SG) pre,
  html:lang(zh-SG) samp,
  html:lang(cmn-Hans) code,
  html:lang(cmn-Hans) kbd,
  html:lang(cmn-Hans) pre,
  html:lang(cmn-Hans) samp,
  html:lang(zh-cmn-Hans) code,
  html:lang(zh-cmn-Hans) kbd,
  html:lang(zh-cmn-Hans) pre,
  html:lang(zh-cmn-Hans) samp,
  html:lang(zh-Hans) code,
  html:lang(zh-Hans) kbd,
  html:lang(zh-Hans) pre,
  html:lang(zh-Hans) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
      "方正兰亭黑_GBK", system-ui, -apple-system, monospace, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  html:lang(zh-TW) body,
  html:lang(cmn-Hant) body,
  html:lang(zh-cmn-Hant) body,
  html:lang(zh-Hant) body {
    font-family: "Microsoft JhengHei UI", "Microsoft JhengHei", system-ui,
      -apple-system, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji", emoji;
    quotes: "「" "」";
  }
  
  html:lang(zh-TW) code,
  html:lang(zh-TW) kbd,
  html:lang(zh-TW) pre,
  html:lang(zh-TW) samp,
  html:lang(cmn-Hant) code,
  html:lang(cmn-Hant) kbd,
  html:lang(cmn-Hant) pre,
  html:lang(cmn-Hant) samp,
  html:lang(zh-cmn-Hant) code,
  html:lang(zh-cmn-Hant) kbd,
  html:lang(zh-cmn-Hant) pre,
  html:lang(zh-cmn-Hant) samp,
  html:lang(zh-Hant) code,
  html:lang(zh-Hant) kbd,
  html:lang(zh-Hant) pre,
  html:lang(zh-Hant) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Microsoft JhengHei UI", "Microsoft JhengHei", system-ui, -apple-system,
      monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji", emoji;
  }
  
  html:lang(zh-HK) body,
  html:lang(zh-MO) body,
  html:lang(yue-Hant) body,
  html:lang(zh-yue-Hant) body {
    font-family: "Microsoft JhengHei UI", "Microsoft JhengHei", system-ui,
      -apple-system, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji", emoji;
    quotes: "「" "」";
  }
  
  html:lang(zh-HK) code,
  html:lang(zh-HK) kbd,
  html:lang(zh-HK) pre,
  html:lang(zh-HK) samp,
  html:lang(zh-MO) code,
  html:lang(zh-MO) kbd,
  html:lang(zh-MO) pre,
  html:lang(zh-MO) samp,
  html:lang(yue-Hant) code,
  html:lang(yue-Hant) kbd,
  html:lang(yue-Hant) pre,
  html:lang(yue-Hant) samp,
  html:lang(zh-yue-Hant) code,
  html:lang(zh-yue-Hant) kbd,
  html:lang(zh-yue-Hant) pre,
  html:lang(zh-yue-Hant) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Microsoft JhengHei UI", "Microsoft JhengHei", system-ui, -apple-system,
      monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji", emoji;
  }
  
  html:lang(ja) body {
    font-family: "Yu Gothic UI", "Yu Gothic", system-ui, -apple-system, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
      emoji;
    quotes: "「" "」";
  }
  
  html:lang(ja) code,
  html:lang(ja) kbd,
  html:lang(ja) pre,
  html:lang(ja) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Yu Gothic UI", "Yu Gothic", system-ui, -apple-system, monospace,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
      emoji;
  }
  
  html:lang(ko) body {
    font-family: "Malgun Gothic", system-ui, -apple-system, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
      emoji;
  }
  
  html:lang(ko) code,
  html:lang(ko) kbd,
  html:lang(ko) pre,
  html:lang(ko) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      "Malgun Gothic", system-ui, -apple-system, monospace, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  html:lang(en) body,
  html:lang(de) body,
  html:lang(nl) body,
  html:lang(sv) body,
  html:lang(nb) body,
  html:lang(no) body,
  html:lang(da) body,
  html:lang(is) body,
  html:lang(fr) body,
  html:lang(it) body,
  html:lang(es) body,
  html:lang(pt) body,
  html:lang(ro) body,
  html:lang(lt) body,
  html:lang(lv) body,
  html:lang(ru) body,
  html:lang(uk) body,
  html:lang(pl) body,
  html:lang(cs) body,
  html:lang(sk) body,
  html:lang(bg) body,
  html:lang(sl) body,
  html:lang(sr) body,
  html:lang(hr) body,
  html:lang(bs) body,
  html:lang(el) body,
  html:lang(fi) body,
  html:lang(et) body,
  html:lang(hu) body,
  html:lang(tr) body,
  html:lang(id) body {
    font-family: "Segoe UI", "Noto Sans", "Roboto", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
      emoji;
  }
  
  html:lang(en) code,
  html:lang(en) kbd,
  html:lang(en) pre,
  html:lang(en) samp,
  html:lang(de) code,
  html:lang(de) kbd,
  html:lang(de) pre,
  html:lang(de) samp,
  html:lang(nl) code,
  html:lang(nl) kbd,
  html:lang(nl) pre,
  html:lang(nl) samp,
  html:lang(sv) code,
  html:lang(sv) kbd,
  html:lang(sv) pre,
  html:lang(sv) samp,
  html:lang(nb) code,
  html:lang(nb) kbd,
  html:lang(nb) pre,
  html:lang(nb) samp,
  html:lang(no) code,
  html:lang(no) kbd,
  html:lang(no) pre,
  html:lang(no) samp,
  html:lang(da) code,
  html:lang(da) kbd,
  html:lang(da) pre,
  html:lang(da) samp,
  html:lang(is) code,
  html:lang(is) kbd,
  html:lang(is) pre,
  html:lang(is) samp,
  html:lang(fr) code,
  html:lang(fr) kbd,
  html:lang(fr) pre,
  html:lang(fr) samp,
  html:lang(it) code,
  html:lang(it) kbd,
  html:lang(it) pre,
  html:lang(it) samp,
  html:lang(es) code,
  html:lang(es) kbd,
  html:lang(es) pre,
  html:lang(es) samp,
  html:lang(pt) code,
  html:lang(pt) kbd,
  html:lang(pt) pre,
  html:lang(pt) samp,
  html:lang(ro) code,
  html:lang(ro) kbd,
  html:lang(ro) pre,
  html:lang(ro) samp,
  html:lang(lt) code,
  html:lang(lt) kbd,
  html:lang(lt) pre,
  html:lang(lt) samp,
  html:lang(lv) code,
  html:lang(lv) kbd,
  html:lang(lv) pre,
  html:lang(lv) samp,
  html:lang(ru) code,
  html:lang(ru) kbd,
  html:lang(ru) pre,
  html:lang(ru) samp,
  html:lang(uk) code,
  html:lang(uk) kbd,
  html:lang(uk) pre,
  html:lang(uk) samp,
  html:lang(pl) code,
  html:lang(pl) kbd,
  html:lang(pl) pre,
  html:lang(pl) samp,
  html:lang(cs) code,
  html:lang(cs) kbd,
  html:lang(cs) pre,
  html:lang(cs) samp,
  html:lang(sk) code,
  html:lang(sk) kbd,
  html:lang(sk) pre,
  html:lang(sk) samp,
  html:lang(bg) code,
  html:lang(bg) kbd,
  html:lang(bg) pre,
  html:lang(bg) samp,
  html:lang(sl) code,
  html:lang(sl) kbd,
  html:lang(sl) pre,
  html:lang(sl) samp,
  html:lang(sr) code,
  html:lang(sr) kbd,
  html:lang(sr) pre,
  html:lang(sr) samp,
  html:lang(hr) code,
  html:lang(hr) kbd,
  html:lang(hr) pre,
  html:lang(hr) samp,
  html:lang(bs) code,
  html:lang(bs) kbd,
  html:lang(bs) pre,
  html:lang(bs) samp,
  html:lang(el) code,
  html:lang(el) kbd,
  html:lang(el) pre,
  html:lang(el) samp,
  html:lang(fi) code,
  html:lang(fi) kbd,
  html:lang(fi) pre,
  html:lang(fi) samp,
  html:lang(et) code,
  html:lang(et) kbd,
  html:lang(et) pre,
  html:lang(et) samp,
  html:lang(hu) code,
  html:lang(hu) kbd,
  html:lang(hu) pre,
  html:lang(hu) samp,
  html:lang(tr) code,
  html:lang(tr) kbd,
  html:lang(tr) pre,
  html:lang(tr) samp,
  html:lang(id) code,
  html:lang(id) kbd,
  html:lang(id) pre,
  html:lang(id) samp {
    font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
      monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji", emoji;
  }
  
  html:lang(de) body {
    quotes: "„" "“";
  }
  
  html:lang(es) body,
  html:lang(nb) body,
  html:lang(no) body {
    quotes: "«" "»";
  }
  
  html:lang(fr) body {
    quotes: "« " " »";
  }
  
  html:lang(ar) body,
  html:lang(he) body,
  html:lang(th) body,
  html:lang(vi) body {
    font-family: system-ui, -apple-system, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  html:lang(ar) code,
  html:lang(ar) kbd,
  html:lang(ar) pre,
  html:lang(ar) samp,
  html:lang(he) code,
  html:lang(he) kbd,
  html:lang(he) pre,
  html:lang(he) samp,
  html:lang(th) code,
  html:lang(th) kbd,
  html:lang(th) pre,
  html:lang(th) samp,
  html:lang(vi) code,
  html:lang(vi) kbd,
  html:lang(vi) pre,
  html:lang(vi) samp {
    font-family: monospace, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji", emoji;
  }
  
  @font-face {
    font-family: "Georgia";
    src: local("Georgia");
  }
  
  @font-face {
    font-family: "Times";
    src: local("Georgia");
  }
  
  @font-face {
    font-family: "Time New Roman";
    src: local("Georgia");
  }
  
  @font-face {
    font-family: "Arial";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Helvetica";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Helvetica Neue";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Open Sans";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Segoe UI";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Tahoma";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Trebuchet";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Trebuchet MS";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Ubuntu";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Verdana";
    src: local("Segoe UI");
  }
  
  @font-face {
    font-family: "Consolas";
    src: local("Cascadia Code");
  }
  
  @font-face {
    font-family: "Courier";
    src: local("Cascadia Code");
  }
  
  @font-face {
    font-family: "Courier New";
    src: local("Cascadia Code");
  }
  
  @font-face {
    font-family: "Lucida Console";
    src: local("Cascadia Code");
  }
  
  @font-face {
    font-family: "Ubuntu Mono";
    src: local("Cascadia Code");
  }
  
  @font-face {
    font-family: "SimSun";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "SimSun-ExtB";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "宋体";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "NSimSun";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "新宋体";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "SimHei";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "黑体";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "Microsoft YaHei UI";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "Microsoft YaHei";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "微软雅黑";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "STHeiti SC";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "PingFang SC";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "苹方-简";
    src: local("Microsoft YaHei UI");
  }
  
  @font-face {
    font-family: "MingLiU";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "MingLiU-ExtB";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "PMingLiU";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "PMingLiU-ExtB";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "Microsoft JhengHei UI";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "Microsoft JhengHei";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "微軟正黑體";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "STHeiti TC";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "PingFang TC";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "蘋方-繁";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "MingLiU_HKSCS";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "MingLiU_HKSCS-ExtB";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "PingFang HK";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "蘋方-港";
    src: local("Microsoft JhengHei UI");
  }
  
  @font-face {
    font-family: "MS Gothic";
    src: local("Yu Gothic UI");
  }
  
  @font-face {
    font-family: "MS PGothic";
    src: local("Yu Gothic UI");
  }
  
  @font-face {
    font-family: "MS UI Gothic";
    src: local("Yu Gothic UI");
  }
  
  @font-face {
    font-family: "Yu Gothic";
    src: local("Yu Gothic UI");
  }
  
  @font-face {
    font-family: "Yu Gothic UI";
    src: local("Yu Gothic UI");
  }
  
  @font-face {
    font-family: "Malgun Gothic";
    src: local("Malgun Gothic");
  }
  
  `;
  if (
    location.hostname === "baidu.com" ||
    location.hostname.endsWith(".baidu.com")
  ) {
    css += `
      * {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji;
      }
    `;
  }
  if (
    new RegExp("https:\\/\\/www.baidu.com\\/#?").test(location.href) ||
    location.href.startsWith("https://www.baidu.com/?tn=")
  ) {
    css += `
      .s_ipt,
      .new-pmd .c-font-medium {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji;
      }
    `;
  }
  if (
    location.hostname === "greasyfork.org" ||
    location.hostname.endsWith(".greasyfork.org")
  ) {
    css += `
      #script_version_code,
      .ace_editor {
        font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
          "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, monospace, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji !important;
      }
    `;
  }
  if (
    location.hostname === "github.com" ||
    location.hostname.endsWith(".github.com")
  ) {
    css += `
      .text-mono {
        font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
          "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, monospace, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji !important;
      }
      .blob-num,
      .blob-code-inner {
        font-family: "Cascadia Code", "Noto Mono", "Roboto Mono", "Consolas",
          "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, monospace, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", emoji;
      }
    `;
  }
  if (
    location.hostname === "ithome.com" ||
    location.hostname.endsWith(".ithome.com")
  ) {
    css += `
      .post_comment {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji;
      }
    `;
  }
  if (
    location.hostname === "jiemian.com" ||
    location.hostname.endsWith(".jiemian.com")
  ) {
    css += `
      .article-content {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji !important;
      }
      #ad_header_top,
      .cnzz-ads,
      .jm-app {
        display: none !important;
      }
    `;
  }
  if (location.hostname === "so.com" || location.hostname.endsWith(".so.com")) {
    css += `
      * {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji;
      }
      #footer a[href="http://mse.360.cn"],
      #footer a[href="http://mse.360.cn"] + span
      {
        display: none !important;
      }
    `;
  }
  if (
    location.hostname === "sogou.com" ||
    location.hostname.endsWith(".sogou.com")
  ) {
    css += `
      * {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji;
      }
      .erwm-box {
        display: none !important;
      }
    `;
  }
  if (
    location.hostname === "sspai.com" ||
    location.hostname.endsWith(".sspai.com")
  ) {
    css += `
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      .title,
      .content,
      p,
      a {
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "方正兰亭黑_GB18030",
          "方正兰亭黑_GBK", system-ui, -apple-system, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
          "Noto Color Emoji", emoji !important;
      }
    `;
  }
  if (
    location.hostname === "userstyles.org" ||
    location.hostname.endsWith(".userstyles.org")
  ) {
    css += `
      .ad,
      #top_android_button,
      .android_button_button,
      .android_button_banner,
      .walking {
        display: none !important;
      }
    `;
  }
  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
  } else {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(
      styleNode
    );
  }
})();