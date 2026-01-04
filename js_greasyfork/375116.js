// ==UserScript==
// @name			모바일 숨,흑 ON S
// @author			리드(http://www.suyongso.com)
// @namespace		http://www.suyongso.com/
// @version			1.0
// @description		S 모바일 메인페이지 접속 시 숨,흑백모드 자동으로 설정
// @include			*://www.suyongso.com/
// @include			*://suyongso.com/
// @grant			none
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/375116/%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%88%A8%2C%ED%9D%91%20ON%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/375116/%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%88%A8%2C%ED%9D%91%20ON%20S.meta.js
// ==/UserScript==

var hideCookie = getCookie("hide");
var battCookie = getCookie("battery");

if (hideCookie == "" || battCookie == "") 
{
  // hide, battery가 없을 경우 할 행동
     setCookie('hide','Y',300);
     setCookie('battery','Y',300);
     top.location.reload();
} else {
  // 이미 존재할 경우 할 행동
  return;
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
