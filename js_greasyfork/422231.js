// ==UserScript==
// @run-at document-start
// @name        github1s
// @namespace   https://greasyfork.org/zh-CN/scripts/422231-github1s
// @description 1s open github code with vscode
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @include    *://github.com*
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422231/github1s.user.js
// @updateURL https://update.greasyfork.org/scripts/422231/github1s.meta.js
// ==/UserScript==

$(document).ready(function(){
   $("h1.d-flex.flex-wrap.flex-items-center.break-word.f3.text-normal").prepend('<a id="__edit_by_vscode" class="btn btn-primary btn-sm mr-2">编辑</a>')
  
  $("#__edit_by_vscode").on("click",function(){
    window.open(window.location.href.replace('github.com','github1s.com'))
  })
})


