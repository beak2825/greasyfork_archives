// ==UserScript==
// @name     네이버 카페 모바일 첨부파일 다운로드 기능 정상화
// @version  1.0R
// @description 네이버 카페 모바일의 첨부파일 다운로드 기능이 파이어폭스 안드로이드에서도 제대로 동작하도록 만듭니다.
// @include		*://m.cafe.naver.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant    none
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/374528/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%B2%A8%EB%B6%80%ED%8C%8C%EC%9D%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EA%B8%B0%EB%8A%A5%20%EC%A0%95%EC%83%81%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/374528/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%B2%A8%EB%B6%80%ED%8C%8C%EC%9D%BC%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EA%B8%B0%EB%8A%A5%20%EC%A0%95%EC%83%81%ED%99%94.meta.js
// ==/UserScript==


// 씨발 flies 뭐야? 파리도 아니고
// 네이버 카페 망해야됨.
$(".flies_area").click(function(){
  
  var className =  $(".flies_area").children().children().children().attr('class');
  var nom = className.split("|");
  //alert(nom[2]);
  window.open(nom[2]);
  
});