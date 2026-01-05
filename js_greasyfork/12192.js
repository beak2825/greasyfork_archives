// ==UserScript==
// @name         페이지 제목 접근성 향상 | x86osx.com
// @namespace    
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://x86osx.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12192/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%ED%96%A5%EC%83%81%20%7C%20x86osxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/12192/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%ED%96%A5%EC%83%81%20%7C%20x86osxcom.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelectorAll('.view_title2').length){
        document.title = document.querySelectorAll('.view_title2')[0].innerText+' | '+document.title;
    }
});