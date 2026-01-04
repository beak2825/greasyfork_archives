// ==UserScript==
// @name         68k.news styling
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  try to take over the world!
// @include      http://68k.news/*
// @author       Jony&Thanael
// @match        http://68k.news/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425031/68knews%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/425031/68knews%20styling.meta.js
// ==/UserScript==

(function() {
    //0.01           Initial script
    //0.02           Adjusted title size on home page

    'use strict';
    addCss();

    function addCss(){
        var globalCSS = `body {
  width: 90vw;
  margin: 0 auto;
  margin-top: 3vh;
  color: #383838;
}

h1, h2 {
  font-family: Helvetica;
}

h1 {
  margin-top: 40px;
  text-transform: uppercase;
}

h2 {
  margin-top: 60px;

}

p {
  margin-top: 30px;
}

small{
  font-size: 0.8em !important;
  color: grey;
}

font {
  font-size: 1em;
  line-height: 1em;
}

a, a font{
  font-size: 1em !important;
  color: #000099;
}

@media only screen and (min-width: 768px) {
  body {
    width: 50vw;
  }
  font {
    font-size: 1.4em;
    line-height: 2em;
  }
  font i {
    font-size: 0.8em;
  }
}

`
        function addCssElement(url,rel) {
            var link = document.createElement("link");
            link.href = url;
            link.rel="stylesheet";
            link.type="text/css";
            return link;
        }
        // document.head.appendChild(addCssElement(GM_getResourceURL("bootstrapCSS"))); // add bootstrap
        document.head.appendChild(addCssElement(`data:text/css;base64,${btoa(globalCSS)}`)); // add our own CSS (shown above)
    }
})();