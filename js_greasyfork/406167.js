// ==UserScript==
// @name         cytube_popup_emote
// @namespace    https://cytube.xyz/
// @version      1.6
// @description  チャット入力欄でTabキーでエモートを補完したときにポップアップで表示
// @author       utubo
// @match        *://cytube.xyz/*
// @match        *://cytube.mm428.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406167/cytube_popup_emote.user.js
// @updateURL https://update.greasyfork.org/scripts/406167/cytube_popup_emote.meta.js
// ==/UserScript==
(window.unsafeWindow || window).eval(` // ← チャンネルのJSにセットするときはこの行(と最後の行)を削除
(function() {
var chatline = document.getElementById('chatline');
if (window.POPUPEMOTE_HANDLER) {
  chatline.removeEventListener('keyup', window.POPUPEMOTE_HANDLER);
}
var popup = document.getElementById('popup_emote');
if (popup) {
  popup.remove();
}
popup = document.createElement('IMG');
popup.id = 'popup_emote';
popup.style.cssText =
  'background: #999;' +
  'border-radius: 8px;' +
  'border: 1px solid;' +
  'bottom: 44px;' +
  'display: none;' +
  'left: 24px;' +
  'max-height: 60px;' +
  'max-width: 60px;' +
  'padding: 4px;' +
  'position: absolute;' +
  'opacity: 0;' +
  'transition: .2s opacity;';
var fadeIn = () => { popup.style.opacity = 1; };
window.POPUPEMOTE_HANDLER = ev => {
  if (ev.code !== 'Tab') {
    popup.style.display = 'none';
    popup.style.opacity = '0';
    return;
  }
  var words = chatline.value.substring(0, chatline.selectionStart).trim().split(' ');
  var text = words[words.length - 1];
  var emote = CHANNEL.emoteMap[text];
  if (!emote) return;
  popup.src = emote.image;
  popup.style.backgroundColor = getComputedStyle(chatline, null).getPropertyValue('background-color');
  popup.style.display = 'block';
  setTimeout(fadeIn, 10);
};
chatline.parentNode.appendChild(popup);
chatline.addEventListener('keyup', window.POPUPEMOTE_HANDLER);
})();
`); // ← チャンネルのJSにセットするときはこの行も削除
