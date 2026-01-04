// ==UserScript==
// @name              GitHub CodeBlock Icon Enhance PowerBy NerdFont
// @name:zh-CN        GitHub 代码块图标增强（基于 NerdFont）
// @description       Display more icons by setting NerdFont for GitHub's code block.
// @description:zh-CN 通过为 GitHub 代码块设置 NerdFont 字体以显示更多图标。
// @icon              https://github.githubassets.com/favicons/favicon.png
// @author            cuiko
// @namespace         https://github.com/cuiko/codeblock-icon-enhance
// @homepage          https://github.com/cuiko/codeblock-icon-enhance
// @supportURL        https://github.com/cuiko/codeblock-icon-enhance/issues
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource          Swal https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @version           0.1.1
// @license           GPL-3.0
// @match             *://github.com/*
// @match             *://gitlab.com/*
// @match             *://gitee.com/*
// @match             *://stackoverflow.com/*
// @match             *://stackexchange.com/*
// @match             *://reddit.com/*
// @match             *://juejin.cn/*
// @match             *://segmentfault.com/*
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/488022/GitHub%20%E4%BB%A3%E7%A0%81%E5%9D%97%E5%9B%BE%E6%A0%87%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%9F%BA%E4%BA%8E%20NerdFont%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488022/GitHub%20%E4%BB%A3%E7%A0%81%E5%9D%97%E5%9B%BE%E6%A0%87%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%9F%BA%E4%BA%8E%20NerdFont%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  class Fonts {
    constructor(...fonts) {
      if (fonts.length === 1 && Array.isArray(fonts[0])) {
        this.fonts = fonts.split(",")
      } else {
        this.fonts = fonts
      }
    }

    add(...fonts) {
      this.fonts.push(...fonts)
    }

    remove(font) {
      let index = this.fonts.indexOf(font)
      if (index !== -1) {
        this.fonts.splice(index, 1)
      }
    }

    toString(separator = ",") {
      return this.fonts.join(separator)
    }
  }

  let default_settings = {
    presetFonts: new Fonts(
      "ui-monospace",
      "SFMono-Regular",
      "SF Mono",
      "Menlo",
      "Consolas",
      "Liberation Mono",
      "monospace"
    ),
    customFonts: new Fonts("CaskaydiaCove Nerd Font Propo"),
  }

  const Symbol = {
    PLUGIN_NAME: "codeblock-icon-enhance",
  }

  let kit = {
    /**
     * prompt
     * @param {Object} options
     * @param {string} options.title
     * @param {string} options.default_value
     * @param {Function} options.callback
     */
    prompt: function (options) {
      let { title, default_value, callback } = options

      if (Swal) {
        Swal.fire({
          title,
          input: "text",
          inputValue: default_value,
        }).then(({ value }) => callback(value))
      } else {
        const value = window.prompt(title, default_value)
        callback(value)
      }
    },
  }

  /**
   * add style
   * @param {string} id
   * @param {string} tag
   * @param {string} css
   */
  function addStyle(id, tag, css) {
    tag = tag || "style"
    let doc = document,
      styleDom = doc.getElementById(id)
    if (styleDom) styleDom.remove()
    let style = doc.createElement(tag)
    style.rel = "stylesheet"
    style.id = id
    tag === "style" ? (style.innerHTML = css) : (style.href = css)
    doc.getElementsByTagName("body")[0].appendChild(style)
  }

  /**
   * apply fonts setting
   * @param fonts string
   * @returns {Fonts}
   */
  function applyFonts(fonts) {
    let codeblockFonts = fonts ? new Fonts(fonts) : default_settings.customFonts

    GM_setValue(Symbol.PLUGIN_NAME, codeblockFonts.toString())
    addStyle(
      Symbol.PLUGIN_NAME,
      "style",
      ` :root :is(pre,pre *,code,code *,.cm-editor [class*='cm-'] *,.code,.code *,.blob-num,.blob-num *,.blob-code,.blob-code *,textarea,.react-line-numbers *,.react-code-lines *):not([class*='expand' i],[class*='collapse' i]) { font-family: ${default_settings.presetFonts.toString()},${codeblockFonts} !important; } `
    )

    return codeblockFonts
  }

  function main() {
    // init default settings
    addStyle("swal-pub-style", "style", GM_getResourceText("Swal"))
    let fonts = GM_getValue(Symbol.PLUGIN_NAME)
    let appliedFonts = applyFonts(fonts)

    // init menu
    GM_registerMenuCommand("Font Settings", () => {
      kit.prompt({
        title: "Enter the font(s) you want to use for the code block",
        default_value: appliedFonts.toString(),
        callback: (value) => {
          appliedFonts = applyFonts(value)
        },
      })
    })
  }
  main()
})()
