// ==UserScript==
// @name 2chVladChekunovAntiCaptcha
// @description 2ch AntiCaptcha by Vlad Chekunov
// @include https://2ch.hk/*
// @include http://2ch.hk/*
// @version 1.2.0
// @grant none
// @namespace 2VCAC
// @downloadURL https://update.greasyfork.org/scripts/21872/2chVladChekunovAntiCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/21872/2chVladChekunovAntiCaptcha.meta.js
// ==/UserScript==
var key = "ff84d54467048dea15d6cd93af4a6b87";
var answer = "951549";
if (unsafeWindow.myVar == undefined) {
unsafeWindow.configureACVC = function(){
	var vcacSetup = document.createElement("div");
	vcacSetup.id="acvcSetup";
	vcacSetup.innerHTML='<h1>Сетап антикапчи</h1><p>Если после настройки, капча всё равно выдаёт ошибку, попробуйте обновить страницу и переконфигурять капчу.</p><p>Введи код с картинки:</p><img src="'+$("#captcha-widget-main img")[0].src+'"><br><input value="'+$("#captcha-widget-main img")[0].src.split("/image/")[1].slice(0,32)+'" type="hidden" id="userHashAnswer"><input id="userAnswer"><br><a onclick="configureit()" href="javascript://">Сконфигурять</a>';
	vcacSetup.style="text-align:center;top: 0px;left: 0px;z-index: 982;display:block;position:fixed;width:100%;height:100%;background:#eeeeee";
	document.body.appendChild(vcacSetup);
}
unsafeWindow.configureit = function(){
	localStorage.vcac=document.getElementById("userHashAnswer").value+"passkodoblyadysosnuly"+document.getElementById("userAnswer").value;
	key=document.getElementById("userHashAnswer").value;
	answer=document.getElementById("userAnswer").value;
	document.getElementById("acvcSetup").remove();
}
}
if(localStorage.vcac){
	key=localStorage.vcac.split("passkodoblyadysosnuly")[0];
	answer=localStorage.vcac.split("passkodoblyadysosnuly")[1];
}else{
	alert("Пожалуйста, откройте форму ответа и сконфигуряйте антикапчу.");
}
$(".captcha-box")[0].style.display="none";
$(".captcha-box")[1].style.display="none";
$('label[for="recaptcha-response-field"]')[0].innerHTML="<a onclick='configureACVC()' href='javascript://'>Сконфигурять<br>антикапчу</a>";
function setAnswer() {
  $(".captcha-key").val(key+$(".captcha-key").val().slice(32,64));//Запускаем нейронную сеть по методу Сосницкого
  document.getElementById("captcha-value").value = answer;
  document.getElementById("qr-captcha-value").value = answer;
}
function initChaptcha() {
  var container = document.getElementById("captcha-widget-main");
  if (!container) return;
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      Array.prototype.filter.call(mutation.addedNodes, function(node) {
        return node.tagName === "IMG";
      }).forEach(function(img) {
        setAnswer();
      });
    });
  });
  observer.observe(container, {childList: true});
}
initChaptcha();