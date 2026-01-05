// ==UserScript==
// @name        Hack-Free QuickAnalyst
// @namespace   Hack-Free
// @description Outils pour les Analystes d'Hack-Free.
// @include     http://hack-free.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     2.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10669/Hack-Free%20QuickAnalyst.user.js
// @updateURL https://update.greasyfork.org/scripts/10669/Hack-Free%20QuickAnalyst.meta.js
// ==/UserScript==
var customText = [
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/cleanHF.png[/img][/align]',
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/encoursHF.png[/img][/align]',
  '[align=center][img]http://u.cubeupload.com/XenocodeRCE/virusHF.png[/img][/align]',
  '[align=center][size=medium][b][color=#1E90FF]MD5 :[/color][/b] [color=#FFFFFF]01234567891011121314151617181920[/color][/size][/align]',
  '[align=center][size=medium][b][color=#1E90FF]Scan :[/color][/b] [url]http://razorscanner.com/result.php?id=12345[/url][/size][/align]'
];
var customTextTitle = [
  'Clean',
  'Analyse en cours',
  'Virus',
  'MD5',
  'Scan'
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
  if (customTextTitle[3] !== '') {
    buttonsHTML += '<a title=\'MD5\' onClick=\'insertText(3)\' class=\'button\'>' + customTextTitle[3] + '</a> ';
  }
  if (customTextTitle[4] !== '') {
    buttonsHTML += '<a title=\'Scan\' onClick=\'insertText(4)\' class=\'button\'>' + customTextTitle[4] + '</a> ';
  }
  buttonsHTML += '</div>';
  $('input.button:nth-child(2)').after(buttonsHTML);
}