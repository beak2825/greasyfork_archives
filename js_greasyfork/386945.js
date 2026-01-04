// ==UserScript==
// @name               better markdown for Simplenote
// @namespace          stdcin
// @version            1.0.4
// @description        todo
// @author             stdcin
// @include            http*://app.simplenote.com/*
// @grant              none
// @run-at             document-body
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 测试通过
// @compatible         opera 未测试
// @compatible         safari 未测试
// @downloadURL https://update.greasyfork.org/scripts/386945/better%20markdown%20for%20Simplenote.user.js
// @updateURL https://update.greasyfork.org/scripts/386945/better%20markdown%20for%20Simplenote.meta.js
// ==/UserScript==

(function() {
    var link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js";
    document.body.appendChild(s);

  document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre').forEach((block) => {
    // hljs.highlightBlock(block);
  });

  document.getElementById("static_content").className="markdown-body";
});

    console.log("1.0.4");
})();
