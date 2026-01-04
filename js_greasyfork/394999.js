// ==UserScript==
// @name           AtCoder Print Task Copy
// @name:en        AtCoder Print Task Copy
// @namespace      https://github.com/kichi2004/atcoder-print-task-copy/tree/master
// @version        1.0
// @description    AtCoder の印刷用問題文に Copy ボタンを追加します。
// @description:en Add copy buttons to tasks_print page.
// @author         kichi2004
// @include        https://atcoder.jp/contests/*/tasks_print*
// @grant          none
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/394999/AtCoder%20Print%20Task%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/394999/AtCoder%20Print%20Task%20Copy.meta.js
// ==/UserScript==

'use strict';

(function () {
  if (document.queryCommandSupported('copy')) {
    $('#task-statement h3+pre').each(function (i) {
      const id = 'pre-sample' + i
      $(this).attr('id', id)
      const h3 = $(this).prev('h3')
      h3.append(' <span class="btn btn-default btn-sm btn-copy" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="Copied!" data-target="' + id + '">Copy</span>')
      $(this).before('<div class="div-btn-copy"><span class="btn-copy btn-pre" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="Copied!" data-target="' + id + '">Copy</span></div>')
    })
    let cnt = 0
    $('pre.prettyprint').each(function () {
      const pre_id = 'for_copy' + cnt
      const btn_html = '<div class="div-btn-copy"><span class="btn-copy btn-pre" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="Copied!" data-target="' + pre_id + '">Copy</span></div>'
      $(this).before(btn_html)
      $(this).addClass('source-code')
      const for_copy_html = '<pre id="' + pre_id + '" class="source-code-for-copy"></pre>'
      $(this).after($(for_copy_html).text($(this).text()))
      cnt++
    })
  }
  $('.btn-copy').click(function () {
    window.getSelection().removeAllRanges()
    try {
      const range = document.createRange()
      range.selectNode($('#' + $(this).data('target')).get(0))
      window.getSelection().addRange(range)
      document.execCommand('copy')
    } catch (err) {
      console.log(err)
    }
    window.getSelection().removeAllRanges()
  })


})()

// randint
function rand() {
  const range = [0, 100000]
  return Math.floor(Math.random() * (range[1] - range[0])) + range[0]
}
