// ==UserScript==
// @name         CrowdinHelper
// @namespace    https://github.com/EuropaYou/CrowdinHelper
// @copyright    https://github.com/EuropaYou/CrowdinHelper
// @version      0.2
// @description  Adds tools that helps translating
// @license MIT
// @author       EuropaYou
// @match        https://crowdin.com/translate/*/**
// @match        https://deepl.com/*
// @match https://www.deepl.com/translator
// @match https://www.deepl.com/translator#*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crowdin.com
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/472449/CrowdinHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/472449/CrowdinHelper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if(document.URL.includes("www.deepl.com")){
    if(GM_getValue("crowdin_helper_deepl_translate") == true){
      GM_setValue("crowdin_helper_text", document.getElementsByClassName("lmt__inner_textarea_container")[1].innerText)
      console.log(document.getElementsByClassName("lmt__inner_textarea_container")[1].innerText)
      console.log("Group!");
    }
  }
  function buttonStyles(button, innerText, className) {
    button.className = className;
    button.innerText = innerText;
    button.style.background = "#4d5765";
    button.style.border = "2px solid #252a31";
    button.style.color = "#8d98a9";
    button.style.marginLeft = "2px";
  }

  let interval = setInterval(() => {
    let sourceString = document.getElementsByClassName("selectable editor-source-container source-string-container");
    if(sourceString.length > 0) {
      if(sourceString[0].textContent != "") {
        let langs = document.URL.replace(/\?.*/, "").replace(/https?:\/\/crowdin\.com\/translate\/[a-zA-Z0-9-_]+\/[0-9]+\//, "").split("-")
        const copySourceTextButton = document.createElement("button");
        buttonStyles(copySourceTextButton, "Copy Src Text", "crowdin-helper-copySourceText");
        copySourceTextButton.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(sourceString[0].textContent);
        };

        const openSourceTextInGoogleButton = document.createElement("button");
        buttonStyles(openSourceTextInGoogleButton, "Open Src Text in Google Translate", "crowdin-helper-copySourceText");
        openSourceTextInGoogleButton.onclick = (e) => {
          e.stopPropagation();
          let url = "https://translate.google.com/?sl=" + langs[0] + "&tl=" + langs[1] + "&text=" + sourceString[0].textContent
          window.open(encodeURI(url))
        };

        const openSourceTextInDeepLButton = document.createElement("button");
        buttonStyles(openSourceTextInDeepLButton, "Open Src Text in DeepL", "crowdin-helper-copySourceText");
        openSourceTextInDeepLButton.onclick = (e) => {
          e.stopPropagation();
          GM_setValue("crowdin_helper_deepl_translate", true)
          let url = "https://www.deepl.com/translator#" + langs[0] + "/" + langs[1] + "/" + sourceString[0].textContent.replaceAll("/", "\\/").replaceAll("#", "%23")
          window.open(encodeURI(url))
        };

        const copyTranslationTextButton = document.createElement("button");
        buttonStyles(copyTranslationTextButton, "Copy Translation", "crowdin-helper-copyTranslationText");
        copyTranslationTextButton.onclick = (e) => {
          navigator.clipboard.writeText(document.getElementsByClassName("input-block-level ui-autocomplete-input")[0].value);
        };

        const pasteTranslationTextButton = document.createElement("button");
        buttonStyles(pasteTranslationTextButton, "Paste Translation", "crowdin-helper-pasteTranslationText");
        pasteTranslationTextButton.onclick = (e) => {
          let text = prompt("Enter Text.")
          document.getElementsByClassName("input-block-level ui-autocomplete-input")[0].value = text
        };

        let buttonContainer = document.getElementsByClassName("btn-toolbar no-margin pull-right")[0]
        buttonContainer.appendChild(openSourceTextInGoogleButton);
        buttonContainer.appendChild(openSourceTextInDeepLButton);
        buttonContainer.appendChild(copySourceTextButton);
        buttonContainer.appendChild(copyTranslationTextButton);
        buttonContainer.appendChild(pasteTranslationTextButton);
        clearInterval(interval)
      }
    }
  })
  })();