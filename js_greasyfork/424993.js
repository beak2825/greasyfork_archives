// ==UserScript==a
// @name         </> Kurt & Java Sağ Menü Ve Giriş Ekranı Değiştirici
// @namespace    http://tampermonkey.net/
// @version      17.9
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424993/%3C%3E%20Kurt%20%20Java%20Sa%C4%9F%20Men%C3%BC%20Ve%20Giri%C5%9F%20Ekran%C4%B1%20De%C4%9Fi%C5%9Ftirici.user.js
// @updateURL https://update.greasyfork.org/scripts/424993/%3C%3E%20Kurt%20%20Java%20Sa%C4%9F%20Men%C3%BC%20Ve%20Giri%C5%9F%20Ekran%C4%B1%20De%C4%9Fi%C5%9Ftirici.meta.js
// ==/UserScript==

var IntroGuide = '';
IntroGuide += "<center><h3>Yapımcım</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"Yes!();\">Kurt</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Sunucu Kısayolları</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230649';\">Asia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230611';\">US East 1</button>";
IntroGuide += "<br><br>"
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230560';\">US West 1</button>";
IntroGuide += "<br><br>"
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Özel Sunucu Açın</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>İsmin</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ƬƇ ๖ۣۜƘƲƦƬ✓';\">Kurt'un Nicki</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Semboller</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧]';\">[✧]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘';\">✘</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '⍻';\">⍻</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '๖ۣۜ';\">๖ۣۜ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '␥';\">␥</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✔';\">✔</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Yaratıcı İsimler</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Anatomy';\">İsim 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Ryan Wolf';\">İsim 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Salvator';\">İsim 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>İsmin Olmasını İstemiyorsan</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">İsimsiz</button>";
IntroGuide += "<br><br>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;
`
.btn-apply {
background-color: #5a6600;
}
.btn-apply:hover .btn-apply:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
`
//Arka Plan Değiştirici
var Introleft = '';
Introleft += "<h3>Giriş Ekranını Değiştir</h3>";
Introleft += "<input class='input' type='text'></input>";
Introleft += "&nbsp;";
Introleft += "<button class=\"btn btn-apply\" style=\"width: 50%;\">Uygula</button>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = Introleft;

let element = document.getElementsByClassName('btn btn-apply')[0];
  element.addEventListener("click", function(e) {
           let value = document.getElementsByClassName('input')[0].value;
           let css = '<style type="text/css">.hud-intro::after { background: url('+ value +'); background-size: cover; }</style>';
   console.log("Yeni Ekran Değiştirici")
           document.body.insertAdjacentHTML("beforeend", css);
});