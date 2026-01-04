// ==UserScript==
// @name 일간베스트저장소 댓글 버그 핫픽스(모바일)
// @description 댓글 태그갑 문제 해결. 모바일 버전입니다.
// @include  *://m.ilbe.com/*
// @include  *://www.ilbe.com/*
// @grant none
// @version 0.1T
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/383334/%EC%9D%BC%EA%B0%84%EB%B2%A0%EC%8A%A4%ED%8A%B8%EC%A0%80%EC%9E%A5%EC%86%8C%20%EB%8C%93%EA%B8%80%20%EB%B2%84%EA%B7%B8%20%ED%95%AB%ED%94%BD%EC%8A%A4%28%EB%AA%A8%EB%B0%94%EC%9D%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/383334/%EC%9D%BC%EA%B0%84%EB%B2%A0%EC%8A%A4%ED%8A%B8%EC%A0%80%EC%9E%A5%EC%86%8C%20%EB%8C%93%EA%B8%80%20%EB%B2%84%EA%B7%B8%20%ED%95%AB%ED%94%BD%EC%8A%A4%28%EB%AA%A8%EB%B0%94%EC%9D%BC%29.meta.js
// ==/UserScript==

// 글목록 실시간 observe
// 대상 node 선택
var asdasDocs = document.getElementsByClassName('post-comment')[0];

//now create our observer and get our target element
var gamshiDocs = new MutationObserver(fnHandlerDocs),
        elTarget = asdasDocs,
        objConfig = {
            childList: true,
            subtree : true,
            attributes: false, 
            characterData : false
        };

//then actually do some observing
gamshiDocs.observe(elTarget, objConfig);

function fnHandlerDocs () {
  $(".btn-report").remove();
  console.log("test");
  
  $(".comment-txt").css( "max-height", "700px" );
  $(".comment-txt").css( "overflow", "hidden" );
}
// 글목록 실시간 observe 끝!


