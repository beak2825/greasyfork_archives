// ==UserScript==
// @name         Live Botghost Translator
// @namespace    https://thelostmoon.net
// @license      MIT
// @version      3.9.9
// @description  Translates English text to the selected language on Botghost (Overlay)
// @match        http://https://dashboard.botghost.com/*
// @match        https://dashboard.botghost.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464654/Live%20Botghost%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/464654/Live%20Botghost%20Translator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Google Translate API URL
  const API_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=";
  const LANGUAGE_STORAGE_KEY = "botghost_translation_language";

  // Create overlay and center the dropdown
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  // Language selection dropdown
  const dropdown = document.createElement("select");
  dropdown.style.width = "200px";

  // Add language options to the dropdown
  const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "ar", name: "Arabic" },
    { code: "bn", name: "Bengali" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "es", name: "Spanish" },
    { code: "th", name: "Thai" },
  ];

  // Retrieve the stored language from localStorage, defaulting to English
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

  for (let i = 0; i < languages.length; i++) {
    const option = document.createElement("option");
    option.value = languages[i].code;
    option.text = languages[i].name;
    option.selected = languages[i].code === storedLanguage;
    dropdown.appendChild(option);
  }

  // OK button
  const okButton = document.createElement("button");
  okButton.innerHTML = "OK";
  okButton.style.padding = "5px 10px";
  okButton.style.borderRadius = "4px";
  okButton.style.backgroundColor = "#4CAF50";
  okButton.style.border = "none";
  okButton.style.color = "#fff";
  okButton.addEventListener("click", function() {
    const selectedLanguage = dropdown.value;
    overlay.style.display = "none";
    translateSubtree(document.body, selectedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    observeChanges(selectedLanguage);
  });

  overlay.appendChild(dropdown);
  overlay.appendChild(okButton);
  document.body.appendChild(overlay);

  // Translate function
  function translate(text, language, callback) {
    const url = API_URL + language + "&dt=t&q=" + encodeURIComponent(text);

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        const translation = JSON.parse(response.responseText)[0][0][0];
        callback(translation);
      }
    });
  }

  // Translate all text nodes in the given DOM node
  function translateNode(node, language) {
    if (node.nodeType === Node.TEXT_NODE && node.parentNode !== overlay) {
      const text = node.textContent.trim();
      if (text) {
        translate(text, language, function(translation) {
          node.textContent = translation;
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node !== overlay) {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        translateNode(children[i], language);
      }
    }
  }

  // Translate all text nodes in the given subtree
  function translateSubtree(subtree, language) {
    const nodes = subtree.querySelectorAll('*');
    for (let i = 0; i < nodes.length; i++) {
      translateNode(nodes[i], language);
    }
  }

  // Observe the DOM for changes and translate any new content that gets added
  function observeChanges(language) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          addedNodes.forEach(function(node) {
            translateSubtree(node, language);
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Initial translation
  const selectedLanguage = dropdown.value;
  overlay.style.display = "none";
  translateSubtree(document.body, selectedLanguage);
  observeChanges(selectedLanguage);

})();
