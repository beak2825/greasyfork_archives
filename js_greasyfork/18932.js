// ==UserScript==
// @name Twitter Araçları
// @namespace http://www.erdemozveren.com/
// @description Zorlu işlemleri kolaylaştırır.
// @version 2.08
// @include *twitter.com/*/followers
// @include *twitter.com/*/following
// @include *twitter.com/following
// @require      https://code.jquery.com/jquery-1.8.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/18932/Twitter%20Ara%C3%A7lar%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/18932/Twitter%20Ara%C3%A7lar%C4%B1.meta.js
// ==/UserScript==
var url = window.location.href;
var urlparam = url.split("/");

function hesapkontrol(profil){
if(typeof profil=='undefined'){return false;}
var bio=/([0-9a-zA-ZğüşıöçĞÜŞİÖÇ]+)/.test(profil.querySelector(".ProfileCard-bio").textContent);
var kadi=/([0-9a-zA-ZğüşıöçĞÜŞİÖÇ]+)/.test(profil.querySelector(".ProfileNameTruncated-link").textContent);/*
var kontrol=/([\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc])/.test(profil.querySelector(".ProfileCard-bio").textContent);
var kontrol2=/(Allahsızlar|lanet|anasını|anan|amk|egoist|mal|piç|oç|sikeyim|belanı versin|orospu|yavşak|ego|göt|meme|aq|acil|sevişmek|seviştik|mk|amına|amina|amina koyayim|amına koyayım|koyim|amına koyim|am|sikiş|eskort|escort|sex|yarrak|penis)/i.test(profil.querySelector(".ProfileCard-bio").textContent);
*/var yumurta=/default_profile_images/i.test(profil.querySelector(".ProfileCard-avatarImage").src);
return bio&&kadi&&!yumurta;
}

function dahilet() {
var sheet = document.createElement('style');
sheet.innerHTML = "#sabitpanel {position:fixed;left:50px;bottom:50px;width:150px;padding:10px;height:150px;background-color:#555;color:#fff;text-align:center;} #sabitpanel * {color:#fff;} #twitteraraci,.tapanelcss {padding:10px;border-radius:10px;background-color: rgba(0,0,0,.8);color:#fff;margin-top:10px;margin-bottom:10px;} #twitteraraci input[type=text],.tapanelcss input[type=text] {color:#222;} #twitteraraci h3 {font-size:18px;border-bottom:1px dashed #ddd;padding:5px;margin-bottom:5px;text-align:center;} #twitteraraci button {font-size:13px;} .markblue {background-color:aquamarine!important;}";
document.body.appendChild(sheet);
document.querySelector(".ProfileHeaderCard").innerHTML+="<div id='twitteraraci'><h3>Twitter Araç Paneli</h3></div>";
takipet();
unftounf();
}
var sayfaindir=null;
function takipet(){

var htmltext = 'Etkilenecek Kişi Sayısı : <input type="text" style="width:60px;padding:3px;font-size:16px;" id="t_sayi" value="50" ></input>&nbsp;<button class="btn primary-btn" id="t_takipet">Takip Et</button>';
document.querySelector("#twitteraraci").innerHTML+=htmltext;

document.querySelector("#t_takipet").addEventListener("click",function(){
var takipet_toplam=parseInt(document.querySelector("#t_sayi").value);
var takipet_sayac=0;
var takipet_liste = document.querySelectorAll(".ProfileCard-content .not-following .user-actions-follow-button");
if(takipet_toplam!==0){
$("body").append("<div id='sabitpanel' class='tapanelcss'><h1>İstatistikler</h1><br/><br/><h2 id='kisisay'>0</h2><p>İşlem Yapıldı</p><br/><button class='btn primary-btn' id='t_iptal'>Durdur</button></div>");
sayfaindir=setInterval(function(){$("html, body").animate({ scrollTop: $(document).height() }, 500);},700);
var takipzaman = setInterval(function() {
if(takipet_sayac<takipet_toplam){
takipet_liste = document.querySelectorAll(".ProfileCard-content .not-following .user-actions-follow-button");
if(hesapkontrol(takipet_liste[takipet_sayac])){
takipet_liste[takipet_sayac].click();
takipet_sayac++;
$("#kisisay").text(takipet_sayac);
}
}else {clearInterval(takipzaman);clearInterval(sayfaindir);alert(takipet_sayac+" Kişi takip edildi.");takipet_sayac=0;window.scrollTo(0,1);
}
},200);
}
});
}
function unftounf(){
// Takip etmeyeni Takip Etmeyi Bırak
if(urlparam[3]=="following"){
var takipbirak = '<button class="btn primary-btn" id="t_nonfollowback">Unf. Takibi Bırak</button>';
document.querySelector("#twitteraraci").innerHTML+=takipbirak;

document.querySelector("#t_nonfollowback").addEventListener("click",function(){
var birak_toplam=parseInt(document.querySelector("#t_sayi").value);
var birak_sayac=0;
var kisisay=0;
var profil = document.querySelectorAll(".ProfileCard-content");
if(birak_toplam!==0){
$("body").append("<div id='sabitpanel' class='tapanelcss'><h1>İstatistikler</h1><br/><br/><h2 id='kisisay'>0</h2><p>İşlem Yapıldı</p><br/><button class='btn primary-btn' id='t_iptal'>Durdur</button></div>");
sayfaindir=setInterval(function(){$("html, body").animate({ scrollTop: $(document).height() }, 500);},700);
var takipbirak_zaman = setInterval(function() {
if(birak_sayac<birak_toplam){
profil = document.querySelectorAll(".ProfileCard-content");
var durum=profil[kisisay].querySelector(".FollowStatus");
if(durum===null||!hesapkontrol(profil[kisisay])){
var takipbuton=profil[kisisay].querySelector(".user-actions-follow-button");
profil[kisisay].classList.add("markblue");
takipbuton.click();birak_sayac++;
$("#kisisay").text(birak_sayac);
}
kisisay++;
}else {clearInterval(takipbirak_zaman);clearInterval(sayfaindir);alert("Sizi Takip Etmeyen "+birak_sayac+" kişi Takibi Bırakıldı.");birak_sayac=0;window.scrollTo(0,1);
}
},200);
}
});

}
}
$(document).ready(function() {
dahilet();
$(document).on("dblclick","#sabitpanel",function(e){$(this).remove();});
$(document).on("click","#t_iptal",function(e){
alert("Sayfa Yeniden Yükleniyor.");
location.reload();
});
});