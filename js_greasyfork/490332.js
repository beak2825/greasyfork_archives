// ==UserScript==
// @name         Check Vote
// @namespace    http://yu.net/
// @version      2024-03-20
// @description  Cek Vote WSIS
// @author       You
// @match        https://www.itu.int/net4/wsis/stocktaking/Prizes/2024/MyVotes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itu.int
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490332/Check%20Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/490332/Check%20Vote.meta.js
// ==/UserScript==

function cekLestariIlmu(element) {
  const title = element.querySelector("h6")
  if(title.innerText.trim() === "School online assessment") {
      return true
  } else {
      return false
  }
}

function createElement(isTrue) {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.width = "100%";
  wrapper.style.padding = "8px 10px";
  wrapper.style.top = 0;
  wrapper.style.left = 0;
  wrapper.style.backgroundColor = (isTrue) ? "green" : "red"

  const text = document.createElement("p")
  text.innerText = (isTrue) ? "Valid" : "Tidak Valid"
  text.style.textAlign = "center"
  text.style.color = "white"
  text.style.fontSize = 24
  text.style.fontWeight = 600
  text.style.marginBottom = 0

  wrapper.appendChild(text);
  document.body.appendChild(wrapper);
}

(function() {
  'use strict';

  const totalVoted = document.querySelectorAll("form#setWsisStatusForm > div");
  if(totalVoted.length === 18 && cekLestariIlmu(totalVoted[8])) {
      createElement(true)
  } else {
      createElement(false)
  }
})();