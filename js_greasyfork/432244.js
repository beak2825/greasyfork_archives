// ==UserScript==
// @name        FFN Paragraph Fixer
// @description Splits up paragraphs longer than the configured number of sentences into multiple paragraphs. YMMV
// @version     1.1.0
// @icon        https://www.fanfiction.net/static/images/favicon_2010_iphone.png
//
// @match       https://www.fanfiction.net/s/*
//
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
//
// @grant       GM.registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @namespace https://greasyfork.org/users/814363
// @downloadURL https://update.greasyfork.org/scripts/432244/FFN%20Paragraph%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/432244/FFN%20Paragraph%20Fixer.meta.js
// ==/UserScript==

GM_config.init({
  id: "ConfigBox",
  title: "FFN Paragraph Fixer Configuration",
  fields: {
    paraLength: {
      label: "Maximum Paragraph Length",
      type: "int",
      min: 1,
      default: 3
    }
  },
  css: "#ConfigBox { color: #fff; background-color: #222; }"
})

let doReplacement = () => [...document.getElementById("storytext").getElementsByTagName("p")]
	.forEach(p => p.innerHTML = p.innerHTML.replace(new RegExp(`(\\s*[<>/A-Za-z0-9,;'"\\s-]+[.?!]+"?){${GM_config.get("paraLength")}}`, "g"), "$&</p><p>"))

GM.registerMenuCommand("Open FFN Paragraph Fixer Config", () => GM_config.open())
document.addEventListener("keydown", e => { if (e.ctrlKey && e.altKey && e.key.toString() === "/") { GM_config.open() } })

GM.registerMenuCommand("Break Up Long Paragraphs", doReplacement);
document.addEventListener("keydown", e => { if (e.ctrlKey && !e.altKey && e.key.toString() === "/") { doReplacement() } })
