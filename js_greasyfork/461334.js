// ==UserScript==
// @name         Show scroll progress on scrollbar hover
// @namespace    PageScrollProgressIndicator
// @version      0.4
// @description  Will display a tooltip when you move your mouse to the scrollbar and show you how much have you scrolled so far on the current page.
// @author       Samu
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/461334/Show%20scroll%20progress%20on%20scrollbar%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/461334/Show%20scroll%20progress%20on%20scrollbar%20hover.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var container = createPosElement();

  window.addEventListener("scroll", updateLabel);

  window.addEventListener("mouseover", (e) => {
    if (e.target.tagName !== "HTML") return;

    var updated = updateLabel();

    if (!updated) return;

    displayPosElement(e.clientY);

    window.addEventListener("mouseout", handleMouseOut);

  });

  function updateLabel() {
    var { pos, sections, perc } = getCurrentPosition();

    if (sections <= pos) return false;

    var display = pos.toFixed(1) + "/" + sections.toFixed(1);
    container.textContent = display;

    return true;
  }

  function handleMouseOut() {
    container.style.display = "none";
    window.removeEventListener("mouseout", handleMouseOut);
  }

  function getCurrentPosition() {
    var documentSize = document.documentElement.scrollHeight;
    var sectionSize = document.documentElement.clientHeight;
    var scrollPos = document.documentElement.scrollTop;
    var sections = (documentSize / sectionSize);
    var pos = (scrollPos / sectionSize) + 1;
    var perc = (scrollPos) / documentSize;

    return { pos, sections, perc };
  }

  function createPosElement() {
    var container = document.createElement("div");
    container.setAttribute("style", "position: fixed; background-color: #000; padding: 10px; color: #fff; display: none;z-index: 10000000000000; font-size: 16px;");
    document.body.appendChild(container);
    return container;
  }

  function displayPosElement(y) {
    container.style.right = "10px";
    container.style.top = y + "px";
    container.style.display = "block";
  }

})();