// ==UserScript==
// @name             『AVGLEから余分な空白を取り除きます』 Remove extra whitespace from AVGLE
// @namespace   tuktuk3103@gmail.com
// @description   Unpins Navigation Bar + Dark Mode + Removes Ads + Removes Whitespace + Removes Alerts + Big Player + Scrolls Down
// @include          https://avgle.com/*
// @version          1.02
// @grant              none
// @icon                https://avgle.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/407413/%E3%80%8EAVGLE%E3%81%8B%E3%82%89%E4%BD%99%E5%88%86%E3%81%AA%E7%A9%BA%E7%99%BD%E3%82%92%E5%8F%96%E3%82%8A%E9%99%A4%E3%81%8D%E3%81%BE%E3%81%99%E3%80%8F%20Remove%20extra%20whitespace%20from%20AVGLE.user.js
// @updateURL https://update.greasyfork.org/scripts/407413/%E3%80%8EAVGLE%E3%81%8B%E3%82%89%E4%BD%99%E5%88%86%E3%81%AA%E7%A9%BA%E7%99%BD%E3%82%92%E5%8F%96%E3%82%8A%E9%99%A4%E3%81%8D%E3%81%BE%E3%81%99%E3%80%8F%20Remove%20extra%20whitespace%20from%20AVGLE.meta.js
// ==/UserScript==

//Unpins Navigation Bar
document.querySelector('.top-nav').style.position = "absolute";
document.querySelector('.navbar-fixed-top').style.position = "absolute";
//Dark Mode
document.body.style.backgroundColor = "#2f2f2f";
//Removes Ads + Whitespace
var var1   = document.getElementsByTagName('iframe');
for(var i = var1.length; i--;) {
  var1[i].remove();}
document.getElementById("exo-native").remove();
document.querySelector('.footer-banner').remove();
document.querySelector('.col-sm-5.col-md-4').remove();
function pageLoaded () {
for(var i = var1.length; i--;) {
  var1[i].remove();}
if(location.pathname.indexOf('') != -1){
document.querySelector('.col-sm-7.col-md-8').setAttribute('style', 'min-width:100%;');}
if(location.pathname.indexOf('/video/') != -1){
document.getElementById("nft").remove();
document.getElementById("container-c784c7e5f7516b03192a2aedaa0bd981").remove();
document.getElementById("aoverlay").remove();
document.querySelector('.hide-me-please2').remove();
document.querySelector('.video-banner').remove();
//Removes Alerts
document.querySelector('div.alert-danger.alert-dismissable.alert').remove();
document.querySelector('div.alert-danger.alert-dismissable.alert').remove();
//Big Player
document.querySelector('.col-sm-7.col-md-8.col-lg-8').setAttribute('style', 'min-width:100%;');
//Scrolls Down
document.getElementById("flash").scrollIntoView({behavior: "smooth", block: "center", inline: "center"});}};
//Makes Some Text Visible
document.getElementsByTagName('h1')[0].style.backgroundColor = "#111111";
document.getElementsByTagName('h1')[0].style.color = "#d3d3d3";
document.querySelector('.overflow-hidden.m-t-10').style.backgroundColor = "#080808";
document.querySelector('.overflow-hidden.m-t-10').style.color = "#d3d3d3";
var var2   = document.getElementsByClassName('tag');
for(var i = var2.length; i--;) {
var2[i].style.color = "#2a9fd6";}
window.addEventListener ("load", pageLoaded);