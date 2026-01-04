// ==UserScript==
// @name         CHUNITHM get JSON file
// @version      1.0
// @description  Get JSON file that can be used in https://reiwa.f5.si
// @author       Alanimdeo
// @match        https://chunithm-net-eng.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1384234
// @downloadURL https://update.greasyfork.org/scripts/513444/CHUNITHM%20get%20JSON%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/513444/CHUNITHM%20get%20JSON%20file.meta.js
// ==/UserScript==

const css = `.jsonButton {
  background-color: #17a2b8;
  border-radius: 5px;
  border: 1px solid #17a2b8;
  display: block;
  width: fit-content;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.5rem;
  padding: 0.7rem 1.4rem;
  text-decoration: none;
  margin: 1rem auto;
}
.green {
  background-color: #28a745;
  border: 1px solid #28a745;
}
.green:hover {
  background-color: #218838;
}
.green:active {
  background-color: #117828;
}`;

const d = document;

(function () {
  "use strict";
  const downloadJsonBtn = d.createElement("button");
  downloadJsonBtn.className = "jsonButton green";
  downloadJsonBtn.innerText = "Download JSON";
  downloadJsonBtn.addEventListener("click", () => {
    var e = d.createElement("script");
    e.src =
      "https://reiwa.f5.si/chuni_scoredata/main.js?" +
      String(Math.floor(new Date().getTime() / 1e3));
    d.body.appendChild(e);
  });
  const style = d.createElement("style");
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(d.createTextNode(css));
  }
  d.getElementsByTagName("head")[0].appendChild(style);
  const cf = d.querySelector(".clearfix");
  cf?.insertAdjacentElement("afterend", downloadJsonBtn);
})();
