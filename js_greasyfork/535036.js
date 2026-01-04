// ==UserScript==
// @name         LinuxDo Is Very Tall
// @namespace    http://tampermonkey.net/
// @version      2025-06-02
// @description  Customize the LinuxDo experience!
// @author       Terrasse
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addElement
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535036/LinuxDo%20Is%20Very%20Tall.user.js
// @updateURL https://update.greasyfork.org/scripts/535036/LinuxDo%20Is%20Very%20Tall.meta.js
// ==/UserScript==

(() => {
  const initial_height = window.innerHeight;
  function updateHeightAndStatus() {
    if (window.location.pathname.indexOf('topic') > 0) {
      window.innerHeight = initial_height*2 + document.scrollingElement.scrollTop*3;
    } else {
      window.innerHeight = initial_height;
    }
    $("#status_tag").text(`${(window.innerHeight / initial_height).toFixed(2)}`);
  }
  window.addEventListener('scroll', updateHeightAndStatus);

  // Display & Refresh Button
  function htmlToNode(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
  }
  function addStatusTag() { // return true if freshly added
    if (document.getElementById("status_tag")) return false;
    var anchor = document.getElementsByClassName("categories-wrapper");
    if (anchor.length == 0) return false;
    var anchor = anchor[0];
    var target = anchor.getElementsByClassName("badge-category__name");
    if (target.length == 0) return false;
    var target = target[0];

    // var displayBar = htmlToNode('<li class="sidebar-section-link-wrapper"><a class="ember-view sidebar-section-link sidebar-row"><span class="sidebar-section-link-content-text" id="status_tag">话题</span></a></li>');
    var status = htmlToNode('<sup id="status_tag"></sup>');
    target.appendChild(status);
    console.log('Status tag added successfully.');
    return true;
  }

  setInterval(addStatusTag, 200);
})();
