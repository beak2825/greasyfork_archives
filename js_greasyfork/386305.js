// ==UserScript==
// @name     에브리타임 익명 자동 체크(PC용)
// @version  1.0R
// @description 에브리타임에 글/댓글을 올릴 때 기본값으로 '익명' 체크되도록 합니다.
// @grant    none
// @include https://everytime.kr/*
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/386305/%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84%20%EC%9D%B5%EB%AA%85%20%EC%9E%90%EB%8F%99%20%EC%B2%B4%ED%81%AC%28PC%EC%9A%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386305/%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84%20%EC%9D%B5%EB%AA%85%20%EC%9E%90%EB%8F%99%20%EC%B2%B4%ED%81%AC%28PC%EC%9A%A9%29.meta.js
// ==/UserScript==


// 글목록 실시간 observe
// 대상 node 선택
var asdasElement = document.getElementsByClassName('wrap articles')[0];

//now create our observer and get our target element
var gamshiElements = new MutationObserver(fnHandlerDocs),
        elTarget = asdasElement,
        objConfig = {
            childList: true,
            subtree : true,
            attributes: false, 
            characterData : false
        };

//then actually do some observing
gamshiElements.observe(elTarget, objConfig);

function fnHandlerDocs () {
  var asdasUnji = document.getElementsByClassName('anonym')[0];
  asdasUnji.className = "anonym active";
  console.log("mutation 감지!");
  
}
// 글목록 실시간 observe 끝!
