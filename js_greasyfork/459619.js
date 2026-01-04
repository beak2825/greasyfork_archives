// ==UserScript==
// @name        Animetosho Mobile
// @namespace   http://animetosho.org/
// @description Makes Animetosho mobile-friendly
// @include     http://animetosho.org/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459619/Animetosho%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/459619/Animetosho%20Mobile.meta.js
// ==/UserScript==

(function() {
  var head = document.head;
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/gh/jh3y/detect-scrollbar-width/detect-scrollbar-width.css";
  head.appendChild(link);

  var style = document.createElement("style");
  style.innerHTML = `
    * {
      box-sizing: border-box;
    }

    body {
      padding: 0;
      margin: 0;
      width: 100vw;
    }

    #header {
      display: none;
    }

    #container {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
    }

    #content {
      width: 100%;
      padding: 10px 0;
    }

    #sidebar {
      display: none;
    }

    .post {
      width: 100%;
      margin: 0;
      padding: 10px;
      box-sizing: border-box;
    }

    .post h2 {
      font-size: 16px;
    }

    .post .details {
      font-size: 12px;
    }

    .post .thumbnail {
      width: 100%;
      height: auto;
    }
  `;
  document.body.appendChild(style);
})();
