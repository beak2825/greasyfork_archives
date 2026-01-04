// ==UserScript==
// @name         Bilingual Typing Fixer
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @version      2.3
// @description  One-click fixer for mistyped Arabic↔English text in input fields and contentEditable elements.
// @icon         https://i.ibb.co/Zpv1gJTj/logo.png
// @author       TLBSTATION
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @homepage     https://bilingualtypingfixer.netlify.app
// @homepageURL  https://bilingualtypingfixer.netlify.app
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/543588/Bilingual%20Typing%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/543588/Bilingual%20Typing%20Fixer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const arToEnMap = {
        ض: "q", ص: "w", ث: "e", ق: "r", ف: "t", غ: "y", ع: "u", ه: "i", خ: "o", ح: "p",
        ج: "[", د: "]", ش: "a", س: "s", ي: "d", ب: "f", ل: "g", ا: "h", ت: "j", ن: "k",
        م: "l", ك: ";", ط: "'", ئ: "z", ء: "x", ؤ: "c", ر: "v", لا: "b", ى: "n", ة: "m",
        و: ",", ز: ".", ظ: "/", ذ: "`"
    };

    const enToArMap = Object.fromEntries(
        Object.entries(arToEnMap).flatMap(([ar, en]) => [[en, ar]])
    );

    function detectLanguage(text) {
        const arabicChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const englishChars = /[a-zA-Z]/;

        let ar = 0, en = 0;
        for (let ch of text) {
            if (arabicChars.test(ch)) ar++;
            else if (englishChars.test(ch)) en++;
        }
        return ar >= en ? "arToEn" : "enToAr";
    }

    function translate(text) {
        const dir = detectLanguage(text);
        let result = "";

        if (dir === "arToEn") {
            text = text.replace(/لا/g, "b");
            for (let ch of text) result += arToEnMap[ch] || ch;
        } else {
            for (let ch of text.toLowerCase()) result += enToArMap[ch] || ch;
        }

        return result;
    }

    let currentButton = null;
    let lastTarget = null;

    function createButton(target) {
        if (currentButton) currentButton.remove();

        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;">
        <path fill="currentColor"
              d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2L8.6 4.5L10 7zm12 9.8L22 14l-1.4 2.5L22 19l-2.5-1.4L17 19l1.4-2.5L17 14zM22 2l-1.4 2.5L22 7l-2.5-1.4L17 7l1.4-2.5L17 2l2.5 1.4zm-8.66 10.78l2.44-2.44l-2.12-2.12l-2.44 2.44zm1.03-5.49l2.34 2.34c.39.37.39 1.02 0 1.41L5.04 22.71c-.39.39-1.04.39-1.41 0l-2.34-2.34c-.39-.37-.39-1.02 0-1.41L12.96 7.29c.39-.39 1.04-.39 1.41 0" />
      </svg> Fix Text
    `;
      btn.style.position = "absolute";
      btn.style.fontSize = "12px";
      btn.style.background = "#222";
      btn.style.color = "white";
      btn.style.border = "1px solid #555";
      btn.style.borderRadius = "5px";
      btn.style.padding = "3px 6px";
      btn.style.cursor = "pointer";
      btn.style.zIndex = "9999";
      btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.5)";
      btn.style.display = "flex";
      btn.style.gap = "5px";
      btn.style.alignItems = "center";

      const rect = target.getBoundingClientRect();
      btn.style.top = `${Math.max(0, window.scrollY + rect.top - 30)}px`;
      btn.style.left = `${Math.min(window.innerWidth - 120, window.scrollX + rect.left + rect.width - 100)}px`;

      btn.addEventListener("mousedown", e => e.preventDefault());
      btn.addEventListener("click", e => {
          e.preventDefault();

          let text = "";
          let lexicalSpans = [];

          if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
              text = target.value;
          } else if (target.isContentEditable) {
              lexicalSpans = target.querySelectorAll('[data-lexical-text]');
              text = lexicalSpans.length
                  ? Array.from(lexicalSpans).map(s => s.textContent).join('')
              : target.innerText || target.textContent || '';
          } else {
              text = target.innerText || target.textContent || "";
          }

          const translated = translate(text);

          if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
              target.value = translated;
              target.focus();
              target.selectionStart = target.selectionEnd = translated.length;
          } else if (target.isContentEditable) {
              if (lexicalSpans.length && translated.length >= lexicalSpans.length) {
                  lexicalSpans.forEach((span, i) => {
                      span.textContent = translated[i] || "";
                  });
                  target.focus();
              } else {
                  target.innerText = translated;
                  const range = document.createRange();
                  range.selectNodeContents(target);
                  range.collapse(false);
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(range);
                  target.focus();
              }
          } else {
              target.innerText = translated;
              target.focus();
          }
      });

      document.body.appendChild(btn);
      currentButton = btn;
  }

    document.addEventListener("focusin", e => {
        const el = e.target;
        if (
            (el.tagName === "INPUT" && el.type === "text") ||
            el.tagName === "TEXTAREA" ||
            el.isContentEditable
        ) {
            lastTarget = el;
            createButton(el);
        } else {
            if (currentButton) {
                currentButton.remove();
                currentButton = null;
            }
        }
    });

    window.addEventListener("scroll", () => {
        if (lastTarget && currentButton) {
            createButton(lastTarget);
        }
    });

    const observer = new MutationObserver(() => {
        const active = document.activeElement;
        if (
            (active && active.tagName === "INPUT" && active.type === "text") ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
        ) {
            if (active !== lastTarget) {
                lastTarget = active;
                createButton(active);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        const active = document.activeElement;
        if (
            (active && (active.tagName === "INPUT" && active.type === "text")) ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
        ) {
            if (active !== lastTarget) {
                lastTarget = active;
                createButton(lastTarget);
            }
        }
    }, 1000);
})();
