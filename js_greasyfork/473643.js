// ==UserScript==
// @name         gptAnswer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  answer for exam use gpt
// @author       GRF
// @match        https://*/*
// @exclude      https://*.gorun.fun*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473643/gptAnswer.user.js
// @updateURL https://update.greasyfork.org/scripts/473643/gptAnswer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div = `
    <iframe id="gptAnswer" style="
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 2rem;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    overflow: auto;
   " src="SERVER/poe?key=KEY_STR&msg=">
    </iframe>`;
    var js = `
    var qBaseUrl;
    document.onkeydown = function(e) {
      if(e.key != "Q") {
        return
      }
      var text = window.getSelection().toString();
      text = text.replace(/\\n+/g, " ");
      var mFrame = document.getElementById("gptAnswer");
      mFrame.src=qBaseUrl + "/poe?key=KEY_STR&msg=" + encodeURIComponent(text);
    };
    qBaseUrl = 'SERVER';
    `;
    // 替换地址和key
    div = div.replace("SERVER", "https://home.gorun.fun:8443").replace("KEY_STR", "12345678");
    js = js.replace("SERVER", "https://home.gorun.fun:8443").replace("KEY_STR", "12345678");

    var d = document.createElement('div');
    d.innerHTML=div;
    document.body.appendChild(d);
    var j = document.createElement('script');
    j.innerHTML=js;
    document.body.appendChild(j);
})();