// ==UserScript==
// @name         배그데이 - 에어팟 바로클릭
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       메다
// @match        http://pubg.game.daum.net/pubg/event/pubgDay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387742/%EB%B0%B0%EA%B7%B8%EB%8D%B0%EC%9D%B4%20-%20%EC%97%90%EC%96%B4%ED%8C%9F%20%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/387742/%EB%B0%B0%EA%B7%B8%EB%8D%B0%EC%9D%B4%20-%20%EC%97%90%EC%96%B4%ED%8C%9F%20%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==


function goEvent(){
   var pb = document.getElementsByClassName('product__button');
   var timeBtn = pb[0].getElementsByClassName('skip');
   timeBtn[0].click();
}

function goResult(){
   var rs = document.getElementsByClassName('prize__list-link');
   //rs[0].click();
   var resultBtn = rs[0].getElementsByClassName('skip');
   resultBtn[0].click();
}


goEvent();
//goResult();