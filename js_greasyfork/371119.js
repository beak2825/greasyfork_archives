// ==UserScript==
// @name         DEFINE remover for AtCoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  remove DEFINE
// @author       Luma
// @match        https://beta.atcoder.jp/contests/*/tasks/*
// @match        https://beta.atcoder.jp/contests/*/submit*
// @match        https://*.contest.atcoder.jp/submit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371119/DEFINE%20remover%20for%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/371119/DEFINE%20remover%20for%20AtCoder.meta.js
// ==/UserScript==

(function() {
  'use strict'
  const toComment = [
    "#define[ \t]+DEBUG",
  ]
  window.addEventListener("paste", function(e){
    e.preventDefault()
    const data_transfer = e.clipboardData || window.clipboardData
    let code = data_transfer.getData("text")
    toComment.forEach(el => code = code.replace(
        new RegExp(`(^|\n)[ \t]*(${el})`, "g"),
        `$1// $2`
      )
    )
    setCode(code)
  })
  function setCode(code) {
    const cmel = $(".CodeMirror")[0]
    const cm = cmel && cmel.CodeMirror
    const $txt = $("[name=sourceCode],[name=source_code]")
    if(cm) cm.setValue(code)
    $txt.val(code)
  }
})();
