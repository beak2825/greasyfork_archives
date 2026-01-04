// ==UserScript==
// @name        Unity Docs Syntax Hightligher
// @namespace   Violentmonkey Scripts
// @version     1.0
// @author      Hekky
// @license     MIT
// @description Adds syntax highlighting to the Unity Documentation
//
// @match       https://docs.unity3d.com/Manual/*
// @match       https://docs.unity3d.com/ScriptReference/*
// @match       https://docs.unity3d.com/*/Manual/*
// @match       https://docs.unity3d.com/*/ScriptReference/*
//
// @grant       GM_getResourceText
// @grant       GM_addStyle
//
// @require     https://unpkg.com/prismjs@1.29.0/prism.js
//
// @require     https://unpkg.com/prismjs@1.29.0/components/prism-c.min.js
// @require     https://unpkg.com/prismjs@1.29.0/components/prism-clike.min.js
// @require     https://unpkg.com/prismjs@1.29.0/components/prism-csharp.min.js
// @require     https://unpkg.com/prismjs@1.29.0/components/prism-hlsl.min.js
//
// @require     https://unpkg.com/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js
// @require     https://unpkg.com/prismjs@1.29.0/plugins/show-language/prism-show-language.min.js
//
// @resource    PRISM_THEME https://unpkg.com/prismjs@1.29.0/themes/prism-tomorrow.min.css
//
// @resource    LINE_NUMS_THEME https://unpkg.com/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css
// @downloadURL https://update.greasyfork.org/scripts/467752/Unity%20Docs%20Syntax%20Hightligher.user.js
// @updateURL https://update.greasyfork.org/scripts/467752/Unity%20Docs%20Syntax%20Hightligher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("PRISM_THEME"));
    GM_addStyle(GM_getResourceText("LINE_NUMS_THEME"));
}());

const CSHARP = 0;
const HLSL = 1;

var waitForGlobal = function(key, callback) {
  if (window[key]) {
    callback();
  } else {
    setTimeout(function() {
      waitForGlobal(key, callback);
    }, 100);
  }
};
function waitForLangLoad(lang, callback) {
  if (Prism.util.getLanguage(lang) != null) {
    callback();
  } else {
    setTimeout(function() {
      waitForLangLoad(lang, callback);
    }, 100);
  }
}

function detectCodeLanguage(elem) {
  if (elem.classList.contains('codeExampleCS')) {
    return CSHARP;
  }

  if (elem.innerHTML.match(/CGPROGRAM|ENDCG|CGINCLUDE|#pragma|SubShader \"/g) != null) {
    return HLSL;
  }

  return CSHARP;
}

waitForGlobal("Prism", () => {
  waitForLangLoad("csharp", () => {
    waitForLangLoad("hlsl", () => {
      document.querySelectorAll('.content-wrap pre').forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/\<br\>/g, '\n');
        el.classList.add("line-numbers");
        if (detectCodeLanguage(el) == CSHARP) {
            el.classList.add("language-csharp");
        } else {
            el.classList.add("language-hlsl");
        }
        if (el.firstChild.nodeName != 'CODE') {
          el.innerHTML = `<code>${el.innerHTML}</code>`;
        }
      });
    });
  });
});