// ==UserScript==
// @name     네이버사전 일본어 필기입력기 크기 확대
// @description 네이버 사전 일본어 필기입력기 칸의 크기를 2배 이상 늘립니다.
// @version  1.0R
// @require http://code.jquery.com/jquery-latest.min.js
// @include     *://dict.naver.com
// @include     *://dict.naver.com/*
// @include     *://ja.dict.naver.com
// @include     *://ja.dict.naver.com/*
// @author  		리드(https://www.suyongso.com)
// @namespace   리드s
// @grant    GM_addStyle
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/387747/%EB%84%A4%EC%9D%B4%EB%B2%84%EC%82%AC%EC%A0%84%20%EC%9D%BC%EB%B3%B8%EC%96%B4%20%ED%95%84%EA%B8%B0%EC%9E%85%EB%A0%A5%EA%B8%B0%20%ED%81%AC%EA%B8%B0%20%ED%99%95%EB%8C%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387747/%EB%84%A4%EC%9D%B4%EB%B2%84%EC%82%AC%EC%A0%84%20%EC%9D%BC%EB%B3%B8%EC%96%B4%20%ED%95%84%EA%B8%B0%EC%9E%85%EB%A0%A5%EA%B8%B0%20%ED%81%AC%EA%B8%B0%20%ED%99%95%EB%8C%80.meta.js
// ==/UserScript==

$("._btn_handwriting").click(function(){
  console.log("clicked the handwriting button");
	$("#cavs").children().attr("width","350px");
	$("#cavs").children().attr("height","350px");
});
 


function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}


GM_addStyle ( `
  .ime.ime_write {
    width: 450px;
    height: 450px;
		opacity: 0.9;
		top: 225px;
  }
  .hand_wrt div.cavs canvas {
    position: inherit !important;
  }

	.hand_wrt {
    overflow: unset;
    width: 280px !important;
	}

	.sns-wrap {
    display:none;
	}
	#showHandWriteText{
		display:none;
	}
	.write_device {
    opacity: 0.8;
	}



` );