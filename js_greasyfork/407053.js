// ==UserScript==
// @name         cytube_chatline_buttons
// @namespace    https://cytube.xyz/
// @version      2.2
// @description  cytubeのチャット入力欄に送信ボタンとクリアボタンを追加
// @author       utubo
// @match        *://cytube.xyz/*
// @match        *://cytube.mm428.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407053/cytube_chatline_buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/407053/cytube_chatline_buttons.meta.js
// ==/UserScript==

(function() {
  var backup = '';
  var position = 0;
  var chatline = document.getElementById('chatline');
  var sheet = window.document.styleSheets[0];
  sheet.insertRule(".chatline-btn { position:absolute; bottom:8px; opacity:.5; transition: .2s}", sheet.cssRules.length);
  sheet.insertRule(".chatline-btn:hover { opacity:1; }", sheet.cssRules.length);
  var makeBtn = (id, glyphicon, onclick) => {
    position += 30;
    var btn = document.getElementById(id);
    if (btn) btn.remove();
    btn = document.createElement('DIV');
    btn.id = id;
    btn.className = 'chatline-btn';
    btn.style.right = position + 'px';
    var icon = document.createElement('SPAN');
    icon.className = 'glyphicon ' + glyphicon;
    btn.appendChild(icon);
    chatline.parentElement.insertBefore(btn, chatline.nextSibiling);
    btn.addEventListener('click', onclick);
  }
  makeBtn('chatlineClearBtn', 'glyphicon-remove', e => {
    backup = chatline.value || backup;
    chatline.value = chatline.value ? '' : backup;
    chatline.focus();
  });
  makeBtn('chatlineSendBtn', 'glyphicon-send', e => {(window.unsafeWindow || window).eval(`
    var evt = $.Event('keydown');
    evt.keyCode = 13;
    $('#chatline').trigger(evt);
  `);});
  chatline.style.paddingRight = position + 'px';
})();