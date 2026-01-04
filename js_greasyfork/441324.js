// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.7
// @description  GitHub File History 快速跳转到 https://github.githistory.xyz/
// @author       tmr
// @match        https://github.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441324/GitHub%20File%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/441324/GitHub%20File%20History.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  let count = 0;
  function run() {
    if (document.readyState == "complete" && count > 5) {
      return;
    }
    count++;
    let n = document.querySelector("svg.octicon-history").parentElement
      .parentElement.parentElement.parentElement;
    if (n == null) {
      setTimeout(run, 500);
      return;
    }

    let cn = n.cloneNode(true);
    cn.firstChild.textContent = "Git History";
    cn.querySelector("a").href = cn
      .querySelector("a")
      .href.replace("github.com", "github.githistory.xyz");
    n.parentElement.append(cn);
  }
  run();
})();
