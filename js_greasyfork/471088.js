// ==UserScript==
// @name         OnlyFans Right-Click Enabler
// @namespace    http://greasyfork.org/
// @version      1.2
// @description  free the right-click menu! You can right-click to open images in a new window
// @license      MIT
// @author       guywmustang
// @match        https://onlyfans.com/*
// @match        https://patreon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfans.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471088/OnlyFans%20Right-Click%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/471088/OnlyFans%20Right-Click%20Enabler.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function enableContextMenu(aggressive = false) {
    console.log("enable context menu");

    void (document.ondragstart = null);
    void (document.onselectstart = null);
    void (document.onclick = null);
    void (document.onmousedown = null);
    void (document.onmouseup = null);
    void (document.body.oncontextmenu = null);
    enableRightClickLight(document);
    if (aggressive) {
      enableRightClick(document);
      removeContextMenuOnAll("body");
      removeContextMenuOnAll("img");
      removeContextMenuOnAll("td");
    }

    console.log("adding jquery click handler");
    $("document").on('click', 'div', function (e) {
        console.log("clicked: " + this.id);
    });
  }

  function removeContextMenuOnAll(tagName) {
    var elements = document.getElementsByTagName(tagName);
    for (var i = 0; i < elements.length; i++) {
      enableRightClick(elements[i]);
    }
  }

  function enableRightClickLight(el) {
    el || (el = document);
    el.addEventListener("contextmenu", bringBackDefault, true);
  }

  function enableRightClick(el) {
    el || (el = document);
    el.addEventListener("contextmenu", bringBackDefault, true);
    el.addEventListener("dragstart", bringBackDefault, true);
    el.addEventListener("selectstart", bringBackDefault, true);
    el.addEventListener("click", bringBackDefault, true);
    el.addEventListener("mousedown", bringBackDefault, true);
    el.addEventListener("mouseup", bringBackDefault, true);
  }

  function restoreRightClick(el) {
    el || (el = document);
    el.removeEventListener("contextmenu", bringBackDefault, true);
    el.removeEventListener("dragstart", bringBackDefault, true);
    el.removeEventListener("selectstart", bringBackDefault, true);
    el.removeEventListener("click", bringBackDefault, true);
    el.removeEventListener("mousedown", bringBackDefault, true);
    el.removeEventListener("mouseup", bringBackDefault, true);
  }
  function bringBackDefault(event) {
    event.returnValue = true;
    typeof event.stopPropagation === "function" && event.stopPropagation();
    typeof event.cancelBubble === "function" && event.cancelBubble();
  }

  setTimeout(enableContextMenu(), 100);

    var waitForEl = function(selector, callback) {
        var $elem = $(selector);
        if ($elem.length && $elem[0].style && !$elem[0].style.opacity) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    // Add a title to the popup div when the post is clicked
    $(document).on('mouseup', 'div.post_img_block', function() {
        // Make sure the title is on the container div
        waitForEl('.pswp__img', function() {
            // work the magic
            $('.pswp__img')[0].title = "Right-Click to open image in a new window";
        });
    });

    var RIGHT_MOUSE_BUTTON = 3;

    // Handle the large image right-click targeting the proper inner image
    $(document).on('mouseup', 'div.pswp__img', function (e) {
        // alert("clicked: " + this.id);
        if (e.which == RIGHT_MOUSE_BUTTON) {

            // target the context menu on the image itself
            var img = $(e.currentTarget.children)[0];

            window.open(img.src);
        }
    });
})();