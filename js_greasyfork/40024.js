// ==UserScript==
// @author			Rainbow-Spike
// @version			1.0
// @name			Wikia Cutter
// @description		Поправка слова "страницы"
// @include			http*://ru.*.wikia.com/*
// @grant			none
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/40024/Wikia%20Cutter.user.js
// @updateURL https://update.greasyfork.org/scripts/40024/Wikia%20Cutter.meta.js
// ==/UserScript==

function getNumEnding(iNumber, aEndings) {
 var sEnding, i;
 iNumber = iNumber % 100;
 if (iNumber >= 11 && iNumber <= 19) {
  sEnding=aEndings[2];
 } else {
  i = iNumber % 10;
  switch (i) {
   case (1): sEnding = aEndings[0]; break;
   case (2):
   case (3):
   case (4): sEnding = aEndings[1]; break;
   default: sEnding = aEndings[2];
  }
 }
 return sEnding;
}

var value = document.getElementsByClassName("wds-community-header__counter-value")[0].innerHTML * 1,
    label = document.getElementsByClassName("wds-community-header__counter-label")[0],lin = label.innerHTML,
    line = ['Cтраница','Cтраницы','Cтраниц'],
    nword = getNumEnding(value,line);
label.innerHTML = lin.replace(lin,nword);