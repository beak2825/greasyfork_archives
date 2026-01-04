// ==UserScript==
// @name			모바일 심플형 스킨 자동 활성화 I
// @author			리드(http://www.suyongso.com)
// @namespace		http://www.ilbe.com/
// @version			1.0R
// @description		I 메인 페이지 접속 시 자동으로 심플형 스킨 활성화
// @include			*://www.ilbe.com/
// @include			*://ilbe.com/
// @grant			none
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/375120/%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%8B%AC%ED%94%8C%ED%98%95%20%EC%8A%A4%ED%82%A8%20%EC%9E%90%EB%8F%99%20%ED%99%9C%EC%84%B1%ED%99%94%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/375120/%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%8B%AC%ED%94%8C%ED%98%95%20%EC%8A%A4%ED%82%A8%20%EC%9E%90%EB%8F%99%20%ED%99%9C%EC%84%B1%ED%99%94%20I.meta.js
// ==/UserScript==

var mcskCookie = getCookie("mcsk");
if (mcskCookie == "") 
{
  // mcsk가 없을 경우 할 행동
  goNewSkin();
	storageArray.config.color='gray';
  top.location.reload();
} else {
  // 이미 존재할 경우 할 행동
  return;
}





function goNewSkin() {
	var skinExpire = new Date();
    skinExpire.setTime(skinExpire.getTime() + (365 * 24 * 3600000));
	document.cookie = "mcsk=" + escape('smart') +  "; expires=" + skinExpire.toGMTString() + "; path=/";
	setTimeout(function(){location.replace('/?m=3');}, 1000);
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 
