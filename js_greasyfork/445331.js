// ==UserScript==
// @name         Turkanime Arama Yardimcisi
// @namespace    https://deadlybro-baglantilar.blogspot.com
// @description  TürkAnime sitesinde istediğiniz bir seriyi aratabilirsiniz. ( Klavye kombinasyonu Shift + F )
// @author       DeadLyBro
// @copyright    2022, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @version      4.4
// @match        https://www.turkanime.tv/*
// @icon         https://i.hizliresim.com/cbr4snl.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445331/Turkanime%20Arama%20Yardimcisi.user.js
// @updateURL https://update.greasyfork.org/scripts/445331/Turkanime%20Arama%20Yardimcisi.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author DeadLyBro
// ==/OpenUserJS==

document.addEventListener('keypress', function (e) {
  if (e.shiftKey && e.which === 70) { // Eğer Shift ve F tuşuna basarsak
    if (seri = prompt("Aradığınız serinin adı nedir?", "")) { // bize neyi aramak istediğimizi sorsun.

      // Tek tek işlem yaparak aratma;
      // document.querySelector("#search > form > input").value = seri; // Girdiğimiz yazıyı inputa yazdırma işlemi.
      // document.querySelector("#search > form").submit(); // Son olarak gönderme işlemi.

      // Direkt url'den aratma;
      window.location.href = "https://www.turkanime.tv/arama?arama=" + seri; // girdiğimiz cevaba yölendirme.
    }
    else {
      var stil = document.createElement("style");
      stil.innerHTML = "@keyframes iptal {from {top: -50px;}to {top: 50px;}";
      document.body.append(stil); // Oluşturduğumuz Stil'i Body'e ekleme işlemi.

      var elem = document.createElement("div");
      elem.style.cssText = `
                           visibility: hidden;
                           z-index: 9999;
                           position: fixed;
                           padding: 10px;
                           width: auto;
                           height: auto;
                           top: 50px;
                           left: calc(100vw / 2 + 120px);
                           border-radius: 10px;
                           color: #ed3636;
                           background: #23252c;
                           animation-duration: 1s;
                           animation-timing-function: ease-in;
                           animation-name: iptal;
                           `; // Kullanıcı giriş yapmışsa elemente bu stilleri ekle.
      elem.innerHTML = "Arama iptal edildi.";
      document.body.append(elem); // Oluşturduğumuz Element'i Body'e ekleme işlemi.

      var y = document.querySelector("#bd > header > article > ul.nav.navbar-nav.navbar-right > li.dropdown.mesajlar.kul-menu"); // Kullanıcı giriş kontrolü.
      if (typeof y === 'undefined' || y === null) {
               elem.style.cssText = `
                                     visibility: hidden;
                                     z-index: 9999;
                                     position: fixed;
                                     padding: 10px;
                                     width: auto;
                                     height: auto;
                                     top: 50px;
                                     left: calc(100vw / 2 + 190px);
                                     border-radius: 10px;
                                     color: #ed3636;
                                     background: #23252c;
                                     animation-duration: 1s;
                                     animation-timing-function: ease-in;
                                     animation-name: iptal;
	                                `
      } // Kullanıcı giriş yapmamışsa elemente bu stilleri ekle.

      setTimeout(function(){
          elem.style.visibility = "visible";
      }, 500); // Yarım saniye sonra görünürlüğü aktifleştirir.

      setTimeout(function(){
          elem.remove();
          stil.remove();
      }, 3 * 1000); // 3 saniye sonra eklenenleri kaldırır.

      return;

    }
  }
});