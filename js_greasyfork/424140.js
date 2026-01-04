// ==UserScript==
// @name         </> Kurt & Java Yıldırım
// @namespace    http://tampermonkey.net/
// @version      18.1
// @description  !başlat , !dur
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424140/%3C%3E%20Kurt%20%20Java%20Y%C4%B1ld%C4%B1r%C4%B1m.user.js
// @updateURL https://update.greasyfork.org/scripts/424140/%3C%3E%20Kurt%20%20Java%20Y%C4%B1ld%C4%B1r%C4%B1m.meta.js
// ==/UserScript==

//Giriş Yazı 1
var IntroFooter = '';
IntroFooter += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;
//Giriş Yazı 2
var IntroSocial = '';
IntroSocial += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-social')[0].innerHTML = IntroSocial;
//Giriş Yazı 3
var IntroGuide = '';
IntroGuide += "<hr />"
IntroGuide += "<center><h3>TC Sunucumuz</h3>";
IntroGuide += "<hr />"
IntroGuide += "<center><h3>↓</h3>";
IntroGuide += `
<input type=button onClick="parent.open('https://discord.gg/6ZheGct3bj')" value='Tıkla' >
`
document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;
//Giriş Sıralama
var IntroCornerTopLeft = '';
IntroCornerTopLeft += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornerTopLeft;

//Giriş Butonu
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-red hud-intro-play");
//AD Sökücü
document.querySelectorAll('.ad-unit').forEach(function(a) {
    a.remove();
  });

//Yıldırım
setInterval(() => {
    game.network.sendRpc
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 1",
    name: "SendChatMessage",
    message: "TC Team Geldi Yatın Aşşa Orospu Çocukları",
    channel: "Local",
    speed: "888555", })
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 2",
    message: "Ananızı Tagınızı Yerle Bir Ederim",
    channel: "Local",
    speed: "558885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 3",
    message: "TC Team Tarafından Sikilme İşlemleri",
    channel: "Local",
    speed: "588855", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 4",
    message: "KimseciklerBaşxd #TC",
    channel: "Local",
    speed: "588885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 5",
    message: "TC Team Her Daim Siker",
    channel: "Local",
    speed: "5588885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 6",
    message: "Kurta Biat Edeceksiniz",
    channel: "Local",
    speed: "888555", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 7",
    message: "TC Team Geldi Yatın Aşşa Orospu Çocukları",
    channel: "Local",
    speed: "558885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 8",
    message: "Ananızı Tagınızı Yerle Bir Ederim",
    channel: "Local",
    speed: "588855", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 9",
    message: "TC Team Sikti Boşaldı Lo",
    channel: "Local",
    speed: "588885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 10",
    message: "TC Team Geldi Orospu Evlatları",
    channel: "Local",
    speed: "5588885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 11",
    message: "Ananızı Tagınızı Siker Atarım",
    channel: "Local",
    speed: "5588885", });
});
setInterval(() => {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
    displayName: "Kurt & Java 12",
    message: "TC Team Siker İzi Kalır",
    channel: "Local",
    speed: "5588885", });
});
