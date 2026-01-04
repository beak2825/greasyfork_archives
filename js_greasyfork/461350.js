// ==UserScript==
// @name 调整网页字体和行间距倍数
// @author ChatGPT
// @version 7.1
// @description 脚本菜单可用于调整网页的字体和行间距倍数
// @match *://*/*
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/461350/%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E5%92%8C%E8%A1%8C%E9%97%B4%E8%B7%9D%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/461350/%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E5%92%8C%E8%A1%8C%E9%97%B4%E8%B7%9D%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

(function () {
 "use strict";

 var storageKey = window.location.hostname;
 var isEnabled = GM_getValue(storageKey + "_enabled", true);
 var fontMultiplier = GM_getValue(storageKey + "_font_multiplier", 1);
 var lineHeightMultiplier = GM_getValue(storageKey + "_line_height_multiplier", 1);
 var originalSizes = {};

 function storeOriginalSizes() {
   const elements = document.querySelectorAll("*");
   elements.forEach((element) => {
     originalSizes[element] = {
       fontSize: parseFloat(getComputedStyle(element).fontSize),
       lineHeight: parseFloat(getComputedStyle(element).lineHeight),
     };
   });
 }

 function enlargeFontSizeAndLineHeight() {
   const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
   const rootLineHeight = parseFloat(getComputedStyle(document.documentElement).lineHeight);

   const elementsToScale = document.querySelectorAll("*");
   elementsToScale.forEach((element) => {
     const originalSize = originalSizes[element];
     if (originalSize) {
       const fontSize = originalSize.fontSize;
       if (fontMultiplier !== 1) {
         element.style.fontSize = `${(fontSize / rootFontSize) * (rootFontSize * fontMultiplier)}px`;
       }
       
       const lineHeight = originalSize.lineHeight;
       if (lineHeightMultiplier !== 1) {
         element.style.lineHeight = `${(lineHeight / rootLineHeight) * (rootLineHeight * lineHeightMultiplier)}px`;
       }
     }
   });

   if (fontMultiplier !== 1) {
     document.documentElement.style.fontSize = `${rootFontSize * fontMultiplier}px`;
   }
   if (lineHeightMultiplier !== 1) {
     document.documentElement.style.lineHeight = `${rootLineHeight * lineHeightMultiplier}px`;
   }
 }

 function applyFontSizeAndLineHeightChanges() {
   const elementsToScale = document.querySelectorAll("*");
   elementsToScale.forEach((element) => {
     const originalSize = originalSizes[element];
     if (originalSize) {
       const fontSize = originalSize.fontSize;
       if (fontMultiplier !== 1) {
         element.style.fontSize = `${fontSize * fontMultiplier}px`;
       } else {
         element.style.fontSize = ""; // 重置为默认大小
       }

       const lineHeight = originalSize.lineHeight;
       if (lineHeightMultiplier !== 1) {
         element.style.lineHeight = `${lineHeight * lineHeightMultiplier}px`;
       } else {
         element.style.lineHeight = ""; // 重置为默认行间距
       }
     }
   });

   if (fontMultiplier !== 1) {
     document.documentElement.style.fontSize = `${parseFloat(getComputedStyle(document.documentElement).fontSize) * fontMultiplier}px`;
   } else {
     document.documentElement.style.fontSize = ""; // 重置根字体大小
   }

   if (lineHeightMultiplier !== 1) {
     document.documentElement.style.lineHeight = `${parseFloat(getComputedStyle(document.documentElement).lineHeight) * lineHeightMultiplier}px`;
   } else {
     document.documentElement.style.lineHeight = ""; // 重置根行间距
   }
 }

 function observeDOMChanges() {
   const observer = new MutationObserver(() => {
     if (fontMultiplier !== 1 || lineHeightMultiplier !== 1) {
       applyFontSizeAndLineHeightChanges();
     }
   });

   observer.observe(document.body, {
     childList: true,
     subtree: true
   });
 }

 if (isEnabled && (fontMultiplier !== 1 || lineHeightMultiplier !== 1)) {
   window.addEventListener("resize", applyFontSizeAndLineHeightChanges);
   storeOriginalSizes();
   applyFontSizeAndLineHeightChanges();
   observeDOMChanges();
 }

 GM_registerMenuCommand(isEnabled ? "禁用放大" : "启用放大", function () {
   isEnabled = !isEnabled;
   GM_setValue(storageKey + "_enabled", isEnabled);
   if (isEnabled && (fontMultiplier !== 1 || lineHeightMultiplier !== 1)) {
     window.addEventListener("resize", applyFontSizeAndLineHeightChanges);
     applyFontSizeAndLineHeightChanges();
     observeDOMChanges();
   } else {
     document.documentElement.style.fontSize = "";
     document.documentElement.style.lineHeight = "";
     const elementsToReset = document.querySelectorAll("*");
     elementsToReset.forEach((element) => {
       element.style.fontSize = "";
       element.style.lineHeight = "";
     });
     window.removeEventListener("resize", applyFontSizeAndLineHeightChanges);
   }
 });

 GM_registerMenuCommand("调整字体大小", function () {
   var newFontMultiplier = prompt(
     "请输入字体大小倍数",
     fontMultiplier.toString()
   );
   if (newFontMultiplier !== null) {
     fontMultiplier = parseFloat(newFontMultiplier);
     GM_setValue(storageKey + "_font_multiplier", fontMultiplier);
     // 刷新页面以应用新的字体设置
     location.reload();
   }
 });

 GM_registerMenuCommand("调整行间距", function () {
   var newLineHeightMultiplier = prompt(
     "请输入行间距倍数",
     lineHeightMultiplier.toString()
   );
   if (newLineHeightMultiplier !== null) {
     lineHeightMultiplier = parseFloat(newLineHeightMultiplier);
     GM_setValue(storageKey + "_line_height_multiplier", lineHeightMultiplier);
     // 刷新页面以应用新的行间距设置
     location.reload();
   }
 });

})();
