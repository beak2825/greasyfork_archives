// ==UserScript==
// @name         救活谷歌验证码
// @namespace    https://xiaoxinblog.xyz/posts/65d46cc7.html
// @version      0.1
// @description  谷歌验证码reCAPTCHA在国外地区十分流行，用来验证您是真人很有用。但是目前国内全面封禁Google，reCAPTCHA经常加载不出来，令人头疼。此脚本可以解决此问题（鸣谢@小新的博客wood1ng0t 源代码网址：https://xiaoxinblog.xyz/posts/65d46cc7.html 许可协议网址：https://creativecommons.org/licenses/by/4.0/deed.zh）
// @author       Uranium-235 Young、wood1ng0t
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458258/%E6%95%91%E6%B4%BB%E8%B0%B7%E6%AD%8C%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/458258/%E6%95%91%E6%B4%BB%E8%B0%B7%E6%AD%8C%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.querySelectorAll("script").forEach(function (e) {
    if (
      e.src.indexOf("googleapis.com") >= 0 ||
      e.src.indexOf("themes.googleusercontent.com") >= 0 ||
      e.src.indexOf("www.google.com/recaptcha/") >= 0
    ) {
      let c = e.src
        .replace("http://", "https://")
        .replace("googleapis.com", "proxy.ustclug.org")
        .replace(
          "themes.googleusercontent.com",
          "google-themes.lug.ustc.edu.cn"
        )
        .replace("www.google.com/recaptcha/", "www.recaptcha.net/recaptcha/");
      e.parentNode.replaceChild(
        (function (e) {
          let c = document.createElement("script");
          return (c.src = e), c;
        })(c),
        e
      );
    }
  });
})();