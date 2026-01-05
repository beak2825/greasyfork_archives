// ==UserScript==
// @name         HSPTV! Forum Script
// @version      1.1.2
// @description  HSPTV!掲示板用のUserScriptです。
// @author       prince
// @homepage     http://prince0203.github.io/
// @copyright    (c)prince 2016
// @namespace    io.github.prince0203
// @icon         http://hsp.tv/favicon.ico
// @match        http://hsp.tv/play/pforum.php?mode=*
// @run-at       document-end
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/languages/hsp.min.js
// @downloadURL https://update.greasyfork.org/scripts/15038/HSPTV%21%20Forum%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/15038/HSPTV%21%20Forum%20Script.meta.js
// ==/UserScript==

// 設定
var option = {
  // 長いソースがあるときでも表示が崩れないようにする(デフォルト: true)
  "fixDisplay": true,

  // 投稿にHPがない場合「HP」画像を削除する(デフォルト: true)
  "noHpImage": true,

  // 投稿者のIPアドレスを表示する(デフォルト: true)
  "ip": true,

  // ソースコードをhighlight.jsを使用して色分けする(デフォルト: true)
  "highlight": true,

  // highlight.jsのテーマ https://highlightjs.org/static/demo/ を参照(デフォルト: Dark)
  "highlightTheme": "Dark"
};

// 長いソースがあるときでも表示が崩れないようにする
if (option.fixDisplay) {
  $('table[background^="../images/bbs/back"]').css('table-layout', 'fixed');
  $('pre > br').remove();
  if(!option.highlight) {
    $('pre').css({
      'border-radius': '5px',
      'box-shadow': '0px 0px 3px 2px rgba(0, 0, 0, 0.15)',
      'margin': '10px',
      'padding': '10px',
      'color': '#5A5A5A',
      'background-color': '#F8F8F8',
      'overflow': 'auto'
    });
  }
}

// HPがない場合画像を削除
if (option.noHpImage) {
  $('div#info')
    .append('<br>')
    .children('img[src="../images/bbs/icon_hp_g_no.gif"], img[src="../images/bbs/icon_hp_no.gif"]')
    .remove();
}

// IPアドレスを表示
if (option.ip) {
  var comments = document.body.innerHTML.match(/<!--.*-->/g);
  $(comments).each(function(index) {
    comments[index] = this.substr(4);
    comments[index] = comments[index].substr(0, (comments[index].length - 3));
  });

  $('div#info').each(function(index) {
    $(this).append(comments[index]);
  });
}

// highlight.js
if (option.highlight) {
  $('pre')
    .css('margin', '0px')
    .wrapInner('<code/>')
    .children('code')
    .css({
    'margin': '10px',
    'padding': '10px',
    'border-radius': '8px',
    'box-shadow': '0px 0px 3px 2px rgba(0, 0, 0, 0.15)',
    'font-size': '1.2em'
  })
    .each(function() {
      $(this).text($(this).text().substr(1));
    });
  $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.10.0/styles/' + option.highlightTheme.toLowerCase().replace(/ /g, '-') + '.min.css">');

  hljs.initHighlightingOnLoad();
}
