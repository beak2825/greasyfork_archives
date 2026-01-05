// ==UserScript==
// @name        iChangeSignupToSigninOnZhihu
// @namespace   xinx1n
// @description 从知乎注册页切换到登录页
// @include     http://www.zhihu.com/*
// @include     https://www.zhihu.com/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29282/iChangeSignupToSigninOnZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/29282/iChangeSignupToSigninOnZhihu.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", function(e) { 
  var test = document.querySelector('div[data-za-module=SignUpForm]')
	if(test){
		window.location.hash='#signin'	
	}
});