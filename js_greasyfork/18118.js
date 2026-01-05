// ==UserScript==
// @name        emoticones
// @namespace   test
// @description lol
// @include     http://www.3djuegos.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18118/emoticones.user.js
// @updateURL https://update.greasyfork.org/scripts/18118/emoticones.meta.js
// ==/UserScript==
function emoticones(emos, indice) {
  var temporale = emos;
  for (xd = 0; xd < 10; xd++)
  {
    emos = temporale;
    emos = emos + xd;
    var si = document.getElementsByClassName(emos);
    for (s = 0; s < si.length; s++)
    {
      si[s].style.backgroundImage = 'url(http://s.3djuegos.com/img3/foros/emoticons/emoticon_' +indice +''+ xd +'.gif)';
      si[s].style.backgroundRepeat = 'no-repeat';
    }
  }
}
emoticones('smile bbcode_emot', 0);
emoticones('smile bbcode_emot1', 1);