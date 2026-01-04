// ==UserScript==
// @name         Google Drive Link Fix
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Replaces google drive links without the view?usp=sharing to get rid of blocked page
// @author       Butter
// @match        *://privatebin.rinuploads.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448848/Google%20Drive%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/448848/Google%20Drive%20Link%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  var Text = "cs.rin.ru";
  var fixedList = [];
  document.getElementById("passworddecrypt").value = Text;

  setTimeout(function () {
    document.querySelector('button[type="submit"]').click();
    document.querySelector('button[type="submit"]').click();
  }, 300);

  setTimeout(function () {
    var htmlList = document
      .getElementById("prettyprint")
      .getElementsByTagName("a");

    // When there is a "click"
    // it shows an alert in the browser
    for (let i = 0; i < htmlList.length; i++) {
      var a = document.createElement("a");
      var desiredLink = ("" + htmlList[i] + "").replace("view?usp=sharing", "");
      a.setAttribute("href", desiredLink);
      a.innerHTML = "<h1>" + desiredLink + "</h1>";
      document.getElementById("prettyprint").getElementsByTagName("a")[
        i
      ].innerHTML = a;
    }
  }, 1000);
})();
