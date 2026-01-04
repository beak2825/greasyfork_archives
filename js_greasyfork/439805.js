// ==UserScript==
// @name        디시 여백 제거
// @namespace   betterdc
// @match       https://gall.dcinside.com/*
// @grant       none
// @version     1.1
// @author      80rokwoc4j
// @description 2022. 2. 10. 오전 1:02:50
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439805/%EB%94%94%EC%8B%9C%20%EC%97%AC%EB%B0%B1%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/439805/%EB%94%94%EC%8B%9C%20%EC%97%AC%EB%B0%B1%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==


document.getElementById("top").style.width='100%';
document.getElementById("top").style.minWidth='600px';
document.getElementsByClassName("wrap_inner")[0].style.width='100%';

// 메인
document.getElementById("container").style.marginLeft='0 auto';
document.getElementById("container").style.marginRight='0 auto';

// 파란색 메뉴바
document.getElementsByClassName("gnb_bar")[0].style.width='100%';
document.getElementsByClassName("gnb_bar")[0].style.paddingLeft='0%';
document.getElementsByClassName("gnb_bar")[0].style.paddingRight='0%';

// 타이틀
document.getElementsByTagName("header")[0].style.width='100%';
document.getElementsByTagName("header")[0].style.paddingLeft='0%';
document.getElementsByTagName("header")[0].style.paddingRight='0%';

// 하단
document.getElementsByTagName("footer")[0].style.width='100%';
document.getElementsByTagName("footer")[0].style.paddingLeft='0%';
document.getElementsByTagName("footer")[0].style.paddingRight='0%';