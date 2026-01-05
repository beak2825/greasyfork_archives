// ==UserScript==
// @name         페이지 제목 접근성 향상 | worknet.go.kr
// @namespace    
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.work.go.kr/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12280/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%ED%96%A5%EC%83%81%20%7C%20worknetgokr.user.js
// @updateURL https://update.greasyfork.org/scripts/12280/%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%ED%96%A5%EC%83%81%20%7C%20worknetgokr.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelectorAll('.h3.log h3').length){
        document.title = document.querySelectorAll('.h3.log h3')[0].innerText+' | '+document.title;
    }
});