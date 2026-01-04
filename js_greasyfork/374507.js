// ==UserScript==
// @name						자동 로그인 EXH
// @author					리드(http://www.suyongso.com/)
// @version					1.1R
// @description			쿠키값을 이용하여 익헨에 자동으로 간편하게 로그인합니다.
// @include					*://exhentai.org/
// @grant						none
// @run-at					document-start
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/374507/%EC%9E%90%EB%8F%99%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20EXH.user.js
// @updateURL https://update.greasyfork.org/scripts/374507/%EC%9E%90%EB%8F%99%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20EXH.meta.js
// ==/UserScript==


/* ↓이곳에 ID 번호 및 암호 해시값을 넣어주세요!!↓ */
/* ↓이곳에 ID 번호 및 암호 해시값을 넣어주세요!!↓ */
var yourExhID = '1400000';
var yourExhPassHash = '3a000000000000000000000000000000';
/* ↑이곳에 ID 번호 및 암호 해시값을 넣어주세요!!↑ */
/* ↑이곳에 ID 번호 및 암호 해시값을 넣어주세요!!↑ */



// 이 밑으로는 건드리지 않으셔도 됩니다. 

var exhId = getCookie("ipb_member_id");
var exhPwHash = getCookie("ipb_pass_hash");

if (exhId	 == "") 
{
  // 아이디 쿠키가 없을 경우 할 행동
  setExhAccount();
  top.location.reload();
} else {
  // 아이디 쿠키가 이미 존재할 경우 할 행동
  return;
}
if (exhPwHash	 == "") 
{
  // 패스워드의 해시 쿠키가 없을 경우 할 행동
  setExhAccount();
  top.location.reload();
} else {
  // 패스워드의 해시 쿠키가 이미 존재할 경우 할 행동
  return;
}


// 이하는 setExhAccount: ID, 패스워드 쿠키를 넣는 함수 정의.
function setExhAccount(){
	setCookie('ipb_member_id',yourExhID,30);
	setCookie('ipb_pass_hash',yourExhPassHash,30);
	setCookie('yay',"",-1);	
	deleteCookie('yay');	
  //alert("setExhAccount 실행했음.");
}


// 이하는 setCookie, getCookie: 쿠키 get set 함수 정의.
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

// 이하는 deleteCookie: 쿠키 파기일자를 통해 지우는 함수 정의.
function deleteCookie( name ) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}