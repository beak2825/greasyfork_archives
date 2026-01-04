// ==UserScript==
// @name         DEFINE remover for Codeforces
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  remove DEFINE
// @author       Luma
// @match        http*://codeforces.com/contest/*/problem/*
// @match        http*://codeforces.com/contest/*/submit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371118/DEFINE%20remover%20for%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/371118/DEFINE%20remover%20for%20Codeforces.meta.js
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
    const $el = $("#sourceCodeTextarea")
    $el.val(code)
    $el.trigger("change")
  }
})();
