// ==UserScript==
// @name        NHK Easy copy
// @namespace   conquerist2@gmail.com
// @include     https://www3.nhk.or.jp/news/easy/*
// @grant       GM.setClipboard
// @description NHK Easy News - Copy Article text
// @require  		http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     2.2
// @downloadURL https://update.greasyfork.org/scripts/445791/NHK%20Easy%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/445791/NHK%20Easy%20copy.meta.js
// ==/UserScript==
// 2022 05 31 v1.0 -- initial version
// 2022 06 30 v2.0 -- run on every document focus
// 2024 04 30 v2.1 -- update to reflect changes in site
// 2024 04 30 v2.2 -- changed to work on both old-style and new-style html

$(document).focus(copy_nhk);

function copy_nhk() {
  // hide furigana
  var furis = document.getElementsByTagName('rt');
  for (var i = 0; i < furis.length; i++) {
    furis[i].style.display = 'none';
  }

  my_text = '';
  if( document.querySelector('.article-title') ) {
  	my_text += document.querySelector('.article-title').innerText.trim() + '\r\n\r\n';
  } else {
    my_text += document.querySelector('.article-main__title').innerText.trim() + '\r\n\r\n';
  }
  my_text += document.querySelector('#js-article-date').innerText.trim() + '\r\n\r\n';

  paras = document.querySelectorAll('#js-article-body p');
  for (var i = 0; i < paras.length; i++) {
    if(paras[i].innerText.length > 0)
    my_text += paras[i].innerText + '\r\n\r\n';
  }

  my_text += '---\r\n\r\n';

  GM.setClipboard(my_text);


  //re-enable furigana
  for (var i = 0; i < furis.length; i++) {
    furis[i].style.removeProperty('display');
  }
}