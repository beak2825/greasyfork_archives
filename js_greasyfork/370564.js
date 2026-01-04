// ==UserScript==
// @name	   ncux auto hidden & automatic login
// @description  自動隱藏登入信箱 & 自動輸入密碼
// @version	1.0
// @include	https://ncux.tw/login
// @include	https://ncux.tw/login*
// @namespace https://greasyfork.org/users/198138
// @downloadURL https://update.greasyfork.org/scripts/370564/ncux%20auto%20hidden%20%20automatic%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/370564/ncux%20auto%20hidden%20%20automatic%20login.meta.js
// ==/UserScript==
var maillabel = document.querySelector('label[for="login-email"]');
var email = document.querySelector('input[id="login-email"]');

var passlabel = document.querySelector('label[for="login-password"]'); //密碼的label
var password = document.querySelector('input[id="login-password"]'); //密碼框

var hide = false;

var facelist = ["Σ(ﾟДﾟ；≡；ﾟдﾟ)", "(((ﾟдﾟ)))", "ε=ε=ヾ(;ﾟдﾟ)/", "Σ(;ﾟдﾟ)", "( ºΔº )", "Σ( ° △ °)", "(☉д⊙)"];//表情符號

window.onload = function(){
  hideEmailInput();
	maillabel.onclick = hideEmailInput;
	passlabel.onclick = automaticGenerated;
  document.querySelector('button[type="submit"]').onclick = function(){
    if(email.value.indexOf("@")==-1&&!/[a-zA-Z]/g.test(email.value))
      email.value+="@cc.ncu.edu.tw";
  	if(password.value==='')automaticGenerated();
    setTimeout(function(){
      var msg = document.querySelector('[class="js-form-errors status submission-error"]').innerText;
      if(msg.indexOf("電子郵件信箱或密碼錯誤")>-1)
	      password.value = '';
    },1000);
  }
}

function hideEmailInput(){
  hide = !hide;
  var content = ("電子信箱 - "+(hide?"(,,・ω・,,)":facelist[~~(Math.random()*facelist.length)]));
  maillabel.innerText = content;
  email.type = hide?"password":"email";
}

function automaticGenerated(){
  password.value = email.value.split("@")[0];
}