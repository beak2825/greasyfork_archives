// ==UserScript==
// @name           Facebook Simple Adblock for feed
// @namespace      http://tampermonkey.net/
// @version        0.0.4 - 16/05/2025
// @description    Hides ads / Oculta os anúncios
// @author         0Hz
// @compatible     brave
// @compatible     chrome
// @compatible     firefox
// @icon           https://static.xx.fbcdn.net/rsrc.php/y1/r/ay1hV6OlegS.ico
// @include        https://www.facebook.com/*
// @include        https://facebook.com/*
// @include        http://www.facebook.com/*
// @include        http://facebook.com/*
// @match          *://example.org/*
// @grant          none
// @license        Unlicense license
// @downloadURL https://update.greasyfork.org/scripts/534667/Facebook%20Simple%20Adblock%20for%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/534667/Facebook%20Simple%20Adblock%20for%20feed.meta.js
// ==/UserScript==

let blockadcontact = true;
let blockadpost = true;
let blockadinpost = true;
let interval = 1000;//milliseconds
let adword = "";
const list = ["Patrocinado", "Patrocinada","Patrocinat","Paeroniet","Publicidad","Pravkar","Peye","Рэклама","Plaćeni oglas","Реклама","Sponsored","Sponsorizzata","Sponsorjat","Sponsorizzato","Sponsitud","Sponsorizat","Sponsorisé","Spunsurizatu","Sponsorizuar", "Sponset","Sponsorowane","Szponzorált","Sponsorlu","Sponzorirano","Sponsoreret","Sponsorkirî","Stuðlað","Szpōnzorowane","Disponsori","Yoɓanaama","Babestua","Reklamo","Reklama","Remiama","Anzeige","Geborg","Gesponsord","Misy Mpiantoka","Apmaksāta reklāma","Akiliijjujjaujuq","Gesponsert","Kuxhasiwe","Oñepatrosinapyre","Imedhaminiwa","Daukar Nauyi","La maalgeliyey","광고","広告","赞助","贊助","スポンサー付き","赞助内容","Zvabhadharirwa","ⵉⴷⵍ","후원","የተከፈለበት ማስታወቂያ","បានឧបត្ថម្ភ","مُموَّل","ໄດ້ຮັບການສະໜັບສະໜູນ","დაფინანსებული","အခပေးကြော်ငြာ","પ્રાયોજિત","برعاية", "ממומן","प्रायोजित","Հովանավորվում է","ߘߡߍ߬ߟߋ߲","Спонсор","Спонсорирано","Жарнама","Được tài trợ","Χορηγούμενη","Aningaasaliiffigineqartoq"];
const urls = ["https://www.facebook.com/","http://www.facebook.com/","https://www.facebook.com","http://www.facebook.com/"];

if (urls.includes(document.location.href)) {
  getElementByInnerText(list);
}

function getElementByInnerText(list) {
  try {
    // ADS Contacts
    if (blockadcontact==true) {
      const allElements = document.getElementsByTagName('h3');//'span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84
      for (const element of allElements) {
        if (list.includes(element.innerText))  {
          adword = element.innerText;
          element.innerText = ' ';
          element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style="height: 0px; opacity: 0; visibility: hidden;";
          element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
          break;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  try {
    //ADS Posts
    if (blockadinpost==true) {
      let allElementsX;

      if (adword=="Sponsored") {
        return
      } else {
        allElementsX = document.querySelectorAll('div > span > div > span > span > a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f');
        for (const elementX of allElementsX) {
          if (elementX.href.search("/?__cft__") != -1) {//if (elementX.href.search("/ads/about/") != -1) NEED MOUSE OVER TRIGGED TO SHOW/FOUND /ads/about/
            elementX.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style="height: 0px; opacity: 0; visibility: hidden;";
            elementX.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  try {
    //ADS inside normal Posts
    if (blockadinpost==true) {
      const allElementsZ = document.querySelectorAll('div > a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1n2onr6.x87ps6o.x1lku1pv.x1a2a7pz.x1lliihq');
      for (const elementZ of allElementsZ) {
        elementZ.style = "height: 0px; opacity: 0; visibility: hidden;";
        elementZ.style.display = "none";
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function exec() {
  try {
    if (urls.includes(document.location.href)) {
      getElementByInnerText(list);
    }
  } catch (error) {
    console.error(error);
  }
}

intervalID = setInterval(exec,interval);