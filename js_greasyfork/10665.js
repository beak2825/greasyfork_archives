// ==UserScript==
// @name        Hack-Free QuickAnalyst
// @namespace   Hack-Free
// @description Insere rapidement l'image associee au contexte du sujet (clean, analyse en cours, virus)
// @include     http://hack-free.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10665/Hack-Free%20QuickAnalyst.user.js
// @updateURL https://update.greasyfork.org/scripts/10665/Hack-Free%20QuickAnalyst.meta.js
// ==/UserScript==
var customText = [
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/cleanHF.png[/img][/align]',
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/encoursHF.png[/img][/align]',
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/virusHF.png[/img][/align]'
];
var customTextTitle = [
  'Clean',
  'Analyse en cours',
  'Virus'
];
var sendFor = [
];
function insertText(i) {
  var prevMessage = document.getElementById('message').value;
  document.getElementById('message').value = prevMessage + customText[i];
  if (sendFor[i]) {
    document.getElementById('quick_reply_submit').click()
  }
}
exportFunction(insertText, unsafeWindow, {
  defineAs: 'insertText'
});
if (document.URL.indexOf('Thread-') >= 0) {
  var buttonsHTML = '<div style=\'padding-top: 10px;\'>';
  if (customTextTitle[0] !== '') {
    buttonsHTML += '<a title=\'ImageClean\' onClick=\'insertText(0)\' class=\'button\'>' + customTextTitle[0] + '</a> ';
  }
  if (customTextTitle[1] !== '') {
    buttonsHTML += '<a title=\'ImageAnalyseEnCours\' onClick=\'insertText(1)\' class=\'button\'>' + customTextTitle[1] + '</a> ';
  }
  if (customTextTitle[2] !== '') {
    buttonsHTML += '<a title=\'ImageVirus\' onClick=\'insertText(2)\' class=\'button\'>' + customTextTitle[2] + '</a> ';
  }
  buttonsHTML += '</div>';
  $('input.button:nth-child(2)').after(buttonsHTML);
}
