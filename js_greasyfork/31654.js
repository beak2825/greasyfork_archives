// ==UserScript==
// @name        扇贝单词书发音
// @namespace   undefined
// @include     https://www.shanbay.com/wordlist/*
// @version     1
// @grant       none
// @description en
// @downloadURL https://update.greasyfork.org/scripts/31654/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E4%B9%A6%E5%8F%91%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/31654/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E4%B9%A6%E5%8F%91%E9%9F%B3.meta.js
// ==/UserScript==
function addSound(data)
{
  var strAudio = '<audio src=\'' + data + '\' hidden=\'true\'>';
  $('body').append(strAudio);
}

for (var i = 0; i < $('strong').length; i++) {
  word = $('strong').eq(i).text();
  url = 'https://media.shanbay.com/audio/us/' + word + '.mp3';
  addSound(url);
  $('strong').eq(i).attr("onclick", "$('audio')["+i+"].play();");
}
