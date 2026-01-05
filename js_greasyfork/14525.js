// ==UserScript==
// @name           MC4EP Comment Number Fix
// @description    Фикс номеров комментариев
// @include        http*://minecraft.everypony.ru/*
// @grant          none
// @run-at         document-end
// @version 0.0.1.20151204205618
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/14525/MC4EP%20Comment%20Number%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/14525/MC4EP%20Comment%20Number%20Fix.meta.js
// ==/UserScript==

function getNumEnding(iNumber, aEndings) { // функция обрезания при-числительных
  var sEnding, i;
  iNumber = iNumber % 100;
  if (iNumber>=11 && iNumber<=19) {
    sEnding=aEndings[2];
  } else {
    i = iNumber % 10;
    switch (i)
    {
      case (1): sEnding = aEndings[0]; break;
      case (2):
      case (3):
      case (4): sEnding = aEndings[1]; break;
      default: sEnding = aEndings[2];
    }
  }
  return sEnding;
}

var smeta = document.getElementsByClassName("meta-comments"), // поиск нужных классов
    shead = document.getElementsByClassName("h2comments"),
    mch = /(\d+) .*(комментариев)/, // что ищем
    line = ['комментарий','комментария','комментариев']; // строка замен
for (var i = 0; i < smeta.length; i++) { // в каждом классе
 var num = smeta[i].innerHTML.match(mch), // поиск строки, разбиение на части
     nword = getNumEnding(num[1],line); // подготовка нужной замены
 smeta[i].innerHTML = smeta[i].innerHTML.replace(num[2],nword); // вставка замены
}
for (var i = 0; i < shead.length; i++) { // в каждом классе
 var num = shead[i].innerHTML.match(mch), // поиск строки, разбиение на части
     nword = getNumEnding(num[1],line); // подготовка нужной замены
 shead[i].innerHTML = shead[i].innerHTML.replace(num[2],nword); // вставка замены
}