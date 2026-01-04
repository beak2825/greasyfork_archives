// ==UserScript==
// @name         Earn Pepe Bot (Need Captcha Solver Extension)
// @namespace    earn-pepe.com
// @version      20240508
// @description  bypass manual faucet and auto ptc iframe!
// @author       Script Bot Dev
// @match        https://earn-pepe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feyorra.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494268/Earn%20Pepe%20Bot%20%28Need%20Captcha%20Solver%20Extension%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494268/Earn%20Pepe%20Bot%20%28Need%20Captcha%20Solver%20Extension%29.meta.js
// ==/UserScript==

var BOT = setInterval(function() {
 //login
    if(document.querySelector('a[href="https://earn-pepe.com/login"]:not(:empty)')){
       window.location.href = "/login";
        clearInterval(BOT);
    }
if(window.location.href.includes("/login")){
    //mudar seu email e senha
    document.querySelector("#email").value = "seuemail@gmail.com";
    document.querySelector("#password").value = "suasenha";
    if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector("form").submit();
                clearInterval(BOT);
            }
}
    //// redirect faucet
    if(window.location.href.includes("/dashboard")){
        window.location.href = "/claim";
        clearInterval(BOT);
    }
}, 500);

if (window.location.href === "https://earn-pepe.com/claim") {
    if(document.body.outerText.includes("Complete the captcha to get started!") === true && document.body.outerText.includes("Step") === false){
        var CAPTCHA = setInterval(function() {
            if(document.querySelector(".cf-turnstile")){
            var cloudflare = document.querySelector(".cf-turnstile > input").value;
            if((cloudflare) && cloudflare > ""){
                document.querySelector("#fauform").submit();
                clearInterval(CAPTCHA);
            }
            }
if(document.querySelector(".iconcaptcha-modal__body-title")){
             console.log("iconcaptcha encontrado...");
            var iconcaptcha = document.querySelector(".iconcaptcha-modal__body-title").innerText;
            if((iconcaptcha) && iconcaptcha === "VERIFICATION COMPLETE."){
                document.querySelector("#fauform").submit();
                console.log("captcha Anti Bot resolvido!");
                clearInterval(CAPTCHA);
            }
            }
            if(document.querySelector("#recaptchav2 > div")){
            var recaptcha = document.querySelector("#g-recaptcha-response").value;
               if((recaptcha) && recaptcha > ""){
                document.querySelector("#fauform").submit();
                   clearInterval(CAPTCHA);
            }
            }


         }, 500);
    }else{
var BP = setInterval(function() {
    console.log("procurando captcha...");
var element = document.querySelector('.captcha-icon');
if (element) {
    console.log("captcha encontrado...");
    var classes = element.classList;
    var classesArray = Array.from(classes);

	var elementToClick = document.querySelector('#icon-options .'+classesArray[2]);
if (elementToClick) {
    elementToClick.click();
    console.log("captcha solucionado!");
	Clam();
	clearInterval(BP);
}
}
}, 500);

function Clam(){
	var Clamar = setInterval(function() {
	var sucesso = document.querySelector('#captcha-result .border-success');
	if(sucesso){
        console.log("claim!");
	  setTimeout(document.getElementById('fauform').submit(), 50);
	clearInterval(Clamar);
	}
	}, 500);
}
setTimeout(function() {window.location.reload();}, 20000);
}
}

if (window.location.href.includes("/ads/frame/")) {
    //Captcha
  var BP2 = setInterval(function() {
   var contador = document.querySelector("#ptcCountdown").textContent;
      if(contador === "Completed"){
var element = document.querySelector('.captcha-icon');
if (element) {
    var classes = element.classList;
    var classesArray = Array.from(classes);

	var elementToClick = document.querySelector('#icon-options .'+classesArray[2]);
if (elementToClick) {
    elementToClick.click();
	setTimeout(Clam(), 500);
	clearInterval(BP2);
}
}
}
}, 500);
    //Click claim
function Clam(){
	var Clamar = setInterval(function() {
	var sucesso = document.querySelector('#captcha-result .border-success');
	if(sucesso){
	  setTimeout(document.getElementById('ptcform').submit(), 500);
	clearInterval(Clamar);
	}
	}, 500);
}
}

if (window.location.href === "https://earn-pepe.com/ads") {

    var Abrir = setInterval(function() {
if(document.querySelector("#pills-iframe > div > div > div > div:nth-child(1)")){
    document.querySelector("div.row.flex-grow-1.align-items-center.justify-content-between > div.mt-32 > a").click();
      //setTimeout(window.location.reload(), 10000);
    clearInterval(Abrir);
    }
}, 500);
}
setTimeout(function(){window.location.reload();}, 60000);