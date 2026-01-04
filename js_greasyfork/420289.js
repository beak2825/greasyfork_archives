// ==UserScript==
// @name         Google Drive Preview Link button
// @name:ko      구글드라이브 미리보기 링크 버튼
// @version      0.3.2
// @description  Create a button to go to the preview link in the Google Drive File link.
// @description:ko   구글드라이브 파일링크에서 미리보기 링크로 이동하는 버튼을 만듭니다.
// @author       Meda
// @match        https://drive.google.com/u*
// @match        https://docs.google.com/u*
// @grant        none
// @namespace https://greasyfork.org/users/319515
// @downloadURL https://update.greasyfork.org/scripts/420289/Google%20Drive%20Preview%20Link%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/420289/Google%20Drive%20Preview%20Link%20button.meta.js
// ==/UserScript==

function getLang() {
  var userLang = navigator.language || navigator.userLanguage;
  return userLang;
}

(function() {
    var array = window.location.href.split("id=");
    var elem = document.getElementById('download-form');
    var newLink = document.createElement("a");
    newLink.setAttribute('style', 'margin-left:7px');
    newLink.setAttribute('href', 'https://drive.google.com/file/d/'+array[1].substr(0, 33)+'/edit');

    if(getLang()=="ko-KR"){
        newLink.innerHTML = '<button type="button" id="uc-download-preview">미리보기</button>';
    }else{
        newLink.innerHTML = '<button type="button" id="uc-download-preview">Preview</button>';
    }
    elem.append(newLink);
})();