// ==UserScript==
// @name        Unity Docs Syntax Highlighter
// @namespace   https://github.com/Maoyeedy
// @version     1.3.1
// @author      Yidi Mao, hyblocker
// @license     MIT
// @description Adds syntax highlighting to the Unity Documentation. Forked from hyblocker.
// @icon        https://unity.com/favicon.ico
//
// @match       https://docs.unity3d.com/Manual/*
// @match       https://docs.unity3d.com/ScriptReference/*
// @match       https://docs.unity3d.com/*/Manual/*
// @match       https://docs.unity3d.com/*/ScriptReference/*
//
// @grant       GM_getResourceText
// @grant       GM_addStyle
//
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-c.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-clike.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-csharp.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-hlsl.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/plugins/keep-markup/prism-keep-markup.min.js
//
//
// @resource    PRISM_THEME_LIGHT  https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-one-light.min.css
// @resource    PRISM_THEME_DARK   https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-one-dark.min.css
//
// Recommended Light Themes
// https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css
//
// Recommended Dark Themes
// https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-xonokai.min.css
// https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-duotone-dark.min.css
//
// Extra Themes
// https://github.com/PrismJS/prism-themes

//
// @downloadURL https://update.greasyfork.org/scripts/476925/Unity%20Docs%20Syntax%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/476925/Unity%20Docs%20Syntax%20Highlighter.meta.js
// ==/UserScript==

(function () {
    "use strict"
    GM_addStyle(`#ot-sdk-btn-floating { display: none !important; }`)
    /* Create Button */
    const switchButton = document.createElement("button")
    switchButton.style.cursor = "pointer"
    switchButton.style.position = "fixed"
    switchButton.style.bottom = "15px"
    switchButton.style.right = "15px"
    switchButton.style.width = "32px"
    switchButton.style.height = "32px"
    switchButton.style.borderRadius = "16px"
    switchButton.style.border = "1px solid"
    switchButton.style.fontSize = "16px"
    switchButton.style.paddingBottom = "2px"

    /*  Switch between dark and light themes */
    function SetLightTheme () {
        GM_addStyle(GM_getResourceText("PRISM_THEME_LIGHT"))
        switchButton.style.backgroundColor = "#f9f9f9"
        switchButton.style.borderColor = "#272b33"
        switchButton.textContent = "🌞"
    }

    function SetDarkTheme () {
        GM_addStyle(GM_getResourceText("PRISM_THEME_DARK"))
        switchButton.style.backgroundColor = "#272b33"
        switchButton.style.borderColor = "#fae3a2"
        switchButton.textContent = "🌙"
    }

    function SetTheme () {
        isLightTheme ? SetLightTheme() : SetDarkTheme()
    }

    let isLightTheme = true
    SetTheme()

    document.body.appendChild(switchButton)
    switchButton.addEventListener("click", () => {
        isLightTheme = !isLightTheme
        SetTheme()
    })

    /* InjectCustomCSS */
    const customCSS = `
    code[class*="language-"],
    pre[class*="language-"] {
      border-radius: .5em;
      font-family: 'Jetbrains Mono', monospace !important;
      font-size: 0.875em !important;
      line-height: 1.5 !important;
      text-shadow: none !important;
    }
    .token.keyword,
    .token.bold {
      font-weight: normal !important;
    }
    .token.comment {
      font-style: italic !important;
    }
    .token.operator,
    .token.entity,
    .token.url,
    .style .token.string {
      background: transparent !important;
    }
  `
    GM_addStyle(customCSS)
})()

const CSHARP = 0
const HLSL = 1

var waitForGlobal = function (key, callback) {
    if (window[key]) {
        callback()
    } else {
        setTimeout(function () {
            waitForGlobal(key, callback)
        }, 100)
    }
}
function waitForLangLoad (lang, callback) {
    if (Prism.util.getLanguage(lang) != null) {
        callback()
    } else {
        setTimeout(function () {
            waitForLangLoad(lang, callback)
        }, 100)
    }
}

function detectCodeLanguage (elem) {
    if (elem.classList.contains("codeExampleCS")) {
        return CSHARP
    }

    if (
        elem.innerHTML.match(/CGPROGRAM|ENDCG|CGINCLUDE|#pragma|SubShader \"/g) !=
        null
    ) {
        return HLSL
    }

    return CSHARP
}

waitForGlobal("Prism", () => {
    waitForLangLoad("csharp", () => {
        waitForLangLoad("hlsl", () => {
            document.querySelectorAll(".content-wrap pre").forEach((el) => {
                // Replace <br> tags with newlines
                el.innerHTML = el.innerHTML.replace(/\<br\>/g, "\n")

                // Add language class
                el.classList.add(
                    detectCodeLanguage(el) === CSHARP
                        ? "language-csharp"
                        : "language-hlsl"
                )

                // Wrap in <code> if needed
                if (el.firstChild.nodeName != "CODE") {
                    el.innerHTML = `<code data-keep-markup="true">${el.innerHTML}</code>`
                } else {
                    el.firstChild.setAttribute("data-keep-markup", "true")
                }
            })

            // Apply syntax highlighting after DOM modifications
            Prism.highlightAllUnder(document.body)
        })
    })
})
