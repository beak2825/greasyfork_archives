// ==UserScript==
// @name         TRAnimeİzle Yorum Gizleyici
// @namespace    http://myanimelist.net/profile/kyoyatempest
// @version      1.0
// @description  TRAnimeİzle sitesinde anime izlerken yorumları açmanızı/kapatmanıza olanak sağlar.
// @author       kyoyacchi
// @match        https://www.tranimeizle.co/*
// @grant        none
// @run-at       document-end
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.tranimeizle.co&size=64
// @license GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/457754/TRAnime%C4%B0zle%20Yorum%20Gizleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/457754/TRAnime%C4%B0zle%20Yorum%20Gizleyici.meta.js
// ==/UserScript==
if (window.location.href.split("/")[3] == "profil"){
  return
}

 let sayi = document.querySelectorAll(".headerSized")[1].textContent.split("(")[1].replace(")","")
let ar = []
ar.push(sayi)
function Bas () {
  document.querySelector(".comments-list").style.display = "none"
}
//window.onload = function () {
Bas()
//}
let x = document.querySelectorAll(".headerSized")[1]

let yazı = `${ar[0]||0} Yorumu Aç/Kapat`

x.childNodes[0].textContent = yazı
x.addEventListener("click",(e) => {

let yorumlar = document.querySelector(".comments-list").style.display
if (yorumlar == "none") {
document.querySelector(".comments-list").style.display = "block"
  x.childNodes[0].textContent = `${ar[0]} Yorumu Kapat`
} else {
document.querySelector(".comments-list").style.display = "none"
  x.childNodes[0].textContent = `${ar[0]} Yorumu Aç`
}
});
