// ==UserScript==
// @name         Add italki.com Teacher List Filter
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @description  Add buttons to filter teacher list. Currently, it only applies when the web browser is pointing to https://www.italki.com/partners.
// @author       jcunews
// @match        https://www.italki.com/partners
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38051/Add%20italkicom%20Teacher%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/38051/Add%20italkicom%20Teacher%20List%20Filter.meta.js
// ==/UserScript==

(function(t, list, prevEleCount, filteredUids, items) {

  function filterUser(item) {
    filteredUids.push(parseInt(this.getAttribute("uid")));
    localStorage.filteredUids = JSON.stringify(filteredUids);
    item = this.parentNode.parentNode.parentNode.parentNode;
    item.parentNode.removeChild(item);
    prevEleCount--;
  }

  function filterList(i, link, uid, btn) {
    clearTimeout(t);
    if ((prevEleCount < 0) || (items.length !== prevEleCount)) {
      if (prevEleCount < 0) prevEleCount = 0;
      for (i = items.length-1; i >= 0; i--) {
        if (!items[i].querySelector(".filter")) {
          link = items[i].querySelector("A");
          uid = parseInt(link.pathname.match(/\d+/)[0]);
          if (filteredUids.indexOf(uid) >= 0) {
            list.removeChild(items[i]);
          } else if (btn = items[i].querySelector(".btn")) {
            link = btn.cloneNode(true);
            link.textContent = "X";
            link.title = "Filter this teacher";
            link.classList.add("filter");
            link.style.cssText = "font-weight: bold; color: red";
            link.setAttribute("uid", uid);
            link.removeAttribute("href");
            link.removeAttribute("ui-sref");
            link.onclick = filterUser;
            btn.parentNode.insertBefore(link, btn);
          }
        }
      }
    }
    prevEleCount = items.length;
    t = setTimeout(filterList, 200);
  }

  prevEleCount = -1;
  filteredUids = localStorage.filteredUids || "[]";
  try {
    filteredUids = JSON.parse(filteredUids);
  } catch(t) {
    filteredUids = [];
  }
  items = document.getElementsByClassName("teacher-item");
  t = 0;

  (function init(filter, btn) {
    if (list = document.querySelector(".teacher-list")) {
      filterList();
      if (filter = document.querySelector(".panel-body > .filter > form > div:nth-child(2)")) {
        btn = document.createElement("BUTTON");
        btn.textContent = "Reset Teacher Filter";
        btn.className = "btn";
        btn.style.cssText = "margin-left: 2ex; padding: 0";
        btn.onclick = function() {
          filteredUids = [];
          localStorage.filteredUids = "[]";
        };
        filter.insertBefore(btn, filter.lastElementChild);
      }
    } else setTimeout(init, 100);
  })();

})();
