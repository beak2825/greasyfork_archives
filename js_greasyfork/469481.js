// ==UserScript==
// @name        kanshudo - copy words
// @namespace   conquerist2@gmail.com
// @include     /^https://www.kanshudo.com/searchw.*$/
// @description kanshudo - copy all words from results list to clipboard (word search)
// @grant       GM.setClipboard
// @license MIT
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/469481/kanshudo%20-%20copy%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/469481/kanshudo%20-%20copy%20words.meta.js
// ==/UserScript==
// 2023 06 26 v1.0 - initial version

// hide furigana
var furis = document.getElementsByClassName('furigana');
for (var i = 0; i < furis.length; i++) {
	furis[i].style.display = 'none';
}

my_text = "";
jukugos = document.querySelectorAll('.jukugo');
for (var i = 0; i < jukugos.length; i++) {
  jukugo_text = jukugos[i].innerText.replaceAll('\n','') + '\r\n';
  //console.log(jukugo_text);
  my_text += jukugo_text;
}

GM.setClipboard(my_text);

//re-enable furigana
for (var i = 0; i < furis.length; i++) {
	furis[i].style.removeProperty('display');
}