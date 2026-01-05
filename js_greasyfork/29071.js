// ==UserScript==
// @name        Load List In Next Reddit Page In-Place
// @namespace   LoadListInNextRedditPageInPlace
// @description Load the list in the next Reddit page and append it into the current list without leaving the current page. Like YouTube does.
// @version     1.0.1
// @author      jcunews
// @include     https://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29071/Load%20List%20In%20Next%20Reddit%20Page%20In-Place.user.js
// @updateURL https://update.greasyfork.org/scripts/29071/Load%20List%20In%20Next%20Reddit%20Page%20In-Place.meta.js
// ==/UserScript==

(function() {
  var eleList = document.getElementById("siteTable"), eleNext, ele, ele2, xhr = new XMLHttpRequest();

  function loadError() {
    if ((xhr.readyState === 4) && (xhr.status === 0)) {
      alert("Failed to load more items.\nCheck network connection or adblocker.");
    } else alert("Failed to load more items.\nHTTP code " + xhr.status + ". " + xhr.statusText);
    eleNext.style.cssText = "";
  }

  function loadMore() {
    if (this.style.cssText) return false;
    if (!navigator.onLine) {
      alert("Can not load more items.\nWeb browser is offline.");
      return false;
    }
    this.style.cssText = "color:#aaa;cursor:wait";
    xhr.open("GET", this.href, true);
    xhr.responseType = "document";
    xhr.send();
    return false;
  }

  function processPage() {
    var list = xhr.response.getElementById("siteTable").children, i;
    eleList.removeChild(eleList.lastElementChild);
    for (i = 0; i < list.length; i++) {
      eleList.appendChild(list[i]);
    }
    setupLoadMoreButton();
  }

  function setupLoadMoreButton() {
    var ele, ele2;
    eleNext = document.querySelector("#siteTable>.nav-buttons .next-button>a");
    if (eleNext) {
      eleNext.textContent = "Load more...";
      eleNext.onclick = loadMore;
      eleNext.parentNode.className = "loadmore-button";
      eleNext.parentNode.style.cssText = "display:block;text-align:center";
      ele = eleNext.parentNode.previousSibling;
      while (ele) {
        ele2 = ele.previousSibling;
        ele.parentNode.removeChild(ele);
        ele = ele2;
      }
    } else {
      ele = document.querySelector("#siteTable>.nav-buttons");
      if (ele) ele.parentNode.removeChild(ele);
    }
  }

  if (!eleList) return;
  xhr.onerror = loadError;
  xhr.onload = processPage;
  setupLoadMoreButton();
})();
