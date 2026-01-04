// ==UserScript==
// @name         IconScout Premium SVG Free
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove Iconscout watermark and download premium SVG's without watermark for free!
// @author       kkMihai
// @match        https://iconscout.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478627/IconScout%20Premium%20SVG%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/478627/IconScout%20Premium%20SVG%20Free.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function removeWatermarkDivs() {
    var previewContainers = document.querySelectorAll(
      'div[class^="previewContainer_"]'
    );
    previewContainers.forEach(function (container) {
      var watermarkDivs = container.querySelectorAll(
        'div[class^="watermark_"]'
      );
      watermarkDivs.forEach(function (div) {
        Array.from(div.childNodes).forEach(function (child) {
          container.insertBefore(child.cloneNode(true), div);
        });
        div.remove();
      });
    });
  }

  function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    if (!navigator.clipboard) {
      document.execCommand("copy");
    } else {
      navigator.clipboard.writeText(text);
    }
    document.body.removeChild(textArea);
  }

  function downloadSVG(content) {
    var blob = new Blob([content], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "icon.svg";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  function handleButtons() {
    var pdpColorEditorDivs = document.querySelectorAll(
      'div[id^="pdpColorEditor-"]'
    );

    pdpColorEditorDivs.forEach(function (pdpDiv) {
      var svgContent = pdpDiv.querySelector("svg");

      var copyToClipboardDivs = document.querySelectorAll(
        'div[class^="copyToClipboardBtn_"]'
      );
      copyToClipboardDivs.forEach(function (copyDiv) {
        if (copyDiv.querySelector(".copyButton")) {
          return;
        }

        while (copyDiv.firstChild) {
          copyDiv.removeChild(copyDiv.firstChild);
        }

        var attributes = copyDiv.attributes;
        for (var i = 0; i < attributes.length; i++) {
          if (attributes[i].name.startsWith("data-balloon")) {
            copyDiv.removeAttribute(attributes[i].name);
          }
        }

        var copyButton = document.createElement("button");
        copyButton.textContent = "Copy SVG ( No Watermark )";
        copyButton.classList.add(
          "btn",
          "btn-default",
          "mx-3",
          "goofy",
          "copyButton"
        );
        copyButton.addEventListener("click", function () {
          copyToClipboard(svgContent.outerHTML);
          alert("SVG copied to clipboard!");
        });

        var downloadButton = document.createElement("button");
        downloadButton.textContent = "Download SVG ( No Watermark )";
        downloadButton.classList.add(
          "btn",
          "btn-default",
          "mx-1",
          "goofy",
          "downloadButton"
        );
        downloadButton.addEventListener("click", function () {
          downloadSVG(svgContent.outerHTML);
          alert("SVG downloaded!");
        });

        copyDiv.appendChild(copyButton);
        copyDiv.appendChild(downloadButton);
      });
    });
  }

  function addText() {
    var brandColorDivs = document.querySelectorAll('div[class^="brandColor_"]');
    brandColorDivs.forEach(function (brandDiv) {
      if (brandDiv.querySelector(".wrap")) {
        return;
      }

      var wrap = document.createElement("div");
      wrap.classList.add("wrap");

      var text = document.createElement("h1");
      text.textContent = "IconScout Premium SVG Free";
      text.style.fontSize = "30px";
      text.style.fontWeight = "bold";
      text.classList.add("text");

      var text2 = document.createElement("h2");
      text2.textContent = "Made by kkMihai with ❤️ ";
      text2.style.fontSize = "20px";
      text2.style.fontWeight = "bold";
      text2.classList.add("text");

      wrap.appendChild(text);
      wrap.appendChild(text2);
      brandDiv.appendChild(wrap);
    });
  }

  setInterval(removeWatermarkDivs, 500);
  setInterval(handleButtons, 500);
  setInterval(addText, 500);

  document.addEventListener("DOMContentLoaded", function () {
    handleButtons();
    addText();
    removeWatermarkDivs();

    var observer = new MutationObserver(function () {
      handleButtons();
      addText();
      removeWatermarkDivs();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
