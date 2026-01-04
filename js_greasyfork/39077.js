// ==UserScript==
// @name         Pixel Art Zoom
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Add-on that allows the user to scroll images so they can view pixel art in browser
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39077/Pixel%20Art%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/39077/Pixel%20Art%20Zoom.meta.js
// ==/UserScript==

(function () {
  "use strict";
  main();
  function main() {
    var CSSPixelated = "pixelated-21321322";
    var mouseDown = false;
    var target = undefined;
    var imgContainer = undefined;
    var originalWidth = 0;
    var originalHeight = 0;
    var originalX = 0;
    var originalY = 0;
    var zoom = 1;
    addCSSClasses(CSSPixelated);
    document.addEventListener("mousedown", function (e) {
      var targetElem = e.target.tagName;
      if ((e.ctrlKey && e.shiftKey) && targetElem === "IMG") {
        mouseDown = true;
        e.preventDefault();
        e.stopPropagation();
        createImgContainer(e);
        zoom += 1;
        resizeImg();
      }
    });
    document.addEventListener("mouseup", function (e) {
      if (mouseDown) {
        e.preventDefault();
        e.stopPropagation();
        mouseDown = false;
      }
    });
    document.addEventListener("wheel", function (e) {
      if (e.ctrlKey && imgContainer && e.target.hasAttribute("data-open")) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY > 0) {
          zoom = Math.max(1, zoom - 1);
        }
        else if (e.deltaY < 0) {
          zoom = Math.min(10, zoom + 1);
        }
        resizeImg();
      }
    });
    function resizeImg() {
      if (target === undefined || imgContainer === undefined)
        throw new Error("target or imageContainer were undefined");
      var targetWidth = zoom * originalWidth;
      var targetHeight = zoom * originalHeight;
      target.style.width = targetWidth + "px";
      target.style.height = targetHeight + "px";
      if (originalX + targetWidth > window.scrollX + window.innerWidth) {
        imgContainer.style.left = window.scrollX + Math.max(0, Math.floor((window.innerWidth - targetWidth) / 2)) + "px";
      }
      else {
        imgContainer.style.left = Math.max(window.scrollX, originalX - (targetWidth - originalWidth) / 2) + "px";
      }
      if (originalY + targetHeight > window.scrollY + window.innerHeight) {
        imgContainer.style.top = window.scrollY + Math.max(0, Math.floor((window.innerHeight - targetHeight) / 2)) + "px";
      }
      else {
        imgContainer.style.top = Math.max(window.scrollY, originalY - (targetHeight - originalHeight) / 2) + "px";
      }
    }
    function createImgContainer(e) {
      if (imgContainer !== undefined)
        return;
      target = e.target;
      imgContainer = document.createElement("div");
      var offset = cumulativeOffset(target);
      imgContainer.style.top = offset.top + "px";
      imgContainer.style.left = offset.left + "px";
      imgContainer.className = CSSPixelated;
      target = target.cloneNode(true);
      target.removeAttribute("style");
      target.removeAttribute("class");
      target.removeAttribute("height");
      target.removeAttribute("width");
      target.setAttribute("data-open", "active");
      originalWidth = target.width;
      originalHeight = target.height;
      originalX = offset.left;
      originalY = offset.top;
      imgContainer.appendChild(target);
      document.body.insertBefore(imgContainer, document.body.firstElementChild);
      target.setAttribute("tabindex", "0");
      target.addEventListener("blur", function () {
        destroyImgContainer();
      }, true);
      target.focus();
      function cumulativeOffset(elem) {
        var bbox = elem.getBoundingClientRect();
        var style = window.getComputedStyle(elem);
        var marginLeft = parseInt((style.marginLeft || "0").replace(" px", ""), 10);
        var marginTop = parseInt((style.marginTop || "0").replace(" px", ""), 10);
        return {
          left: bbox.left + window.scrollX - marginLeft,
          top: bbox.top + window.scrollY - marginTop,
        };
      }
    }
    function destroyImgContainer() {
      if (imgContainer === undefined)
        return;
      document.body.removeChild(imgContainer);
      target = undefined;
      imgContainer = undefined;
      zoom = 1;
    }
  }
  function addCSSClasses(className) {
    var head = document.head;
    var newCss = document.createElement("style");
    newCss.type = "text/css";
    newCss.innerHTML = "\n." + className + "{\n  image-rendering: -webkit-optimize-contrast; \n  image-rendering: -webkit-crisp-edges; \n  image-rendering: -moz-crisp-edges; \n  image-rendering: -o-crisp-edges; \n  image-rendering: pixelated; \n  -ms-interpolation-mode: nearest-neighbor; \n  position:absolute;\n  z-index: 1000000;\n  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.6), 0 15px 12px rgba(0, 0, 0, 0.46);\n  background: #BBBC94;\n}\n";
    head.appendChild(newCss);
  }
})();