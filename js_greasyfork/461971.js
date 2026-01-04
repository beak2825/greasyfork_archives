// ==UserScript==
// @name         Alkohol Per Krona (Systembolaget.se)
// @version      0.3
// @description  Alkohol Per Krona på systembolaget.se, klicka vart som helst om det inte dyker upp.
// @author       Leonard (using code from Drol's script)
// @match        https://www.systembolaget.se/*
// @icon         https://www.google.com/s2/favicons?domain=systembolaget.se
// @grant        none
// @namespace https://greasyfork.org/users/1043281
// @downloadURL https://update.greasyfork.org/scripts/461971/Alkohol%20Per%20Krona%20%28Systembolagetse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461971/Alkohol%20Per%20Krona%20%28Systembolagetse%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //här defineras några klasser. Dessa ändras på hemsidan ibland, då får man uppdatera dem här också.
  const articleNumberHomeScreenClass = "css-1f7tpcs e3wog7r0"; //klass på artikelnummer på "hem"sidan
  const infoHomeScreenClass = "css-1v58a65 enp2lf70"; //klass på både "[Land]", "[Volym]" och "[Alk%]" på "hem"sidan
  const priceHomeScreenClass = "css-1kvpmze enp2lf70"; //klass för pris på "hem"skärmen
  const articleNumberProductPageClass = "css-1f2m4s6 enp2lf70"; //artikelnummer på produktsida
  const infoProductPageClass = "css-12l74ml er6ap680"; //burk, volym & alk.% på produktsidan
  const pricePerLiterClass ="css-19dv3ny enp2lf70"; //pris per liter & pant klass (produktsida)

  function init() {
    if (document.getElementById('apk1') || (document.getElementById('apkDIV'))) return; //kollar om apk redan står, i så fall avslutas scriptet
    if(document.getElementsByClassName(articleNumberHomeScreenClass)) { //kollar om man är inne på hemskärmen på systembolaget.se ...
      let content = createContent()
      let nrTag = document.getElementsByClassName(articleNumberHomeScreenClass); 
      for (let i = 0; i < nrTag.length; i++) {
        let nuvarandeNrTag = nrTag.item(i);
        if (nuvarandeNrTag.lastChild.id !== `apk${i}`) {
          let msg = document.createElement("div");
          msg.id = `apk${i}`;
          let apk = getApkHome(content.alc[i], content.volume[i], content.price[i]);
          msg.innerText = `APK ${apk} ml/kr`;
          nuvarandeNrTag.appendChild(msg)};
      }};

    if (document.getElementsByClassName(articleNumberProductPageClass)) { //... eller om man är inne på en produktsida
      let temp = document.getElementsByClassName(articleNumberProductPageClass).item(0); //klassen är artnr.
      if (temp.lastChild.id !== `apkDIV`) {
      let msg = document.createElement("div");
      msg.id = `apkDIV`;
      msg.innerText = `APK ${getApkProduct()} ml/kr`;
      temp.appendChild(msg);
    };
    document.getElementById('apkDIV').innerText = `APK ${getApkProduct()} ml/kr`;
  };
};


  const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

  function createContent() {
    let temp = Array.from(document.getElementsByClassName(infoHomeScreenClass));
    const content = {
      alc: every_nth(temp, 3),
      price: document.getElementsByClassName(priceHomeScreenClass) //klass på pris på hemsidan
    };
    temp.unshift('another value') //lägger till ett extra värde för att välja volym istället
    content.volume = every_nth(temp, 3)
    return content;
  };

  function getApkHome(alc, volume, price) {
      let alcoholVolume = getAlcoholVolume(alc);
      let formattedVolume = getVolume(volume);
      let formattedPrice = getPrice(price);

      let mlPerKr = (alcoholVolume * formattedVolume / formattedPrice) * 0.01;
      return Number(mlPerKr).toFixed(3).replace(".", ",");
  }

  function getAlcoholVolume(alc) {
      let formattedVolume = alc.innerHTML.replace(",", ".").split(" ")[0]; //tar bort allt efter mellanslag och ändrar komma till punkt
      return parseFloat(formattedVolume);
  }

  function getVolume(volume) {
    let formattedVolume; //skapar en variabel för framtida bruk
    if (volume.innerHTML.includes('fl')) { //här kollar den om det är flaskor, i så fall extraherar den numren
      const numbers = volume.innerHTML.match(/\d+/g); // Extract all numbers from the text'
      formattedVolume = numbers[0] * numbers[1];
    }
    else formattedVolume = volume.innerHTML.replace(' ',''); //annars tar den bara bort eventuella mellanslag (typ vid 1 500ml)
    return parseFloat(formattedVolume);
  }

  function getPrice(price) {
      let formattedPrice = price.innerHTML.replace('*', '').replace(':', '.').replace(' ', '').split(" ")[0];
      return parseFloat(formattedPrice);
  }

  function getApkProduct() {
    let alcoholVolume = getAlcoholVolumeProduct();
    let pricePerLiter = getPricePerLiterProduct();

    let mlPerKr = ((alcoholVolume * 0.01) * 1000) / pricePerLiter;

    return Number(mlPerKr).toFixed(3).replace(".", ",");
}

function getAlcoholVolumeProduct() {
    let element = document.getElementsByClassName(infoProductPageClass)[2]; //burk, volym & alk.%
    if(!element) {
      element = document.getElementsByClassName(infoProductPageClass)[0];
      let volume = element.innerHTML.split(" ")[0].replace(",", ".");
      return parseFloat(volume);
    }
    let volume = element.innerHTML.split(" ")[0].replace(",", ".");
    return parseFloat(volume);
}

function getPricePerLiterProduct() {
    let element = document.getElementsByClassName(pricePerLiterClass)[0]; //pris/L & pant
    if (element.innerHTML.includes('pant')) { //kollar om det är en pantburk, pant kommer före pris/L i DOM
      element = document.getElementsByClassName(pricePerLiterClass)[1]}; //byter från pant till pris/L
    let pricePerLiter = element.innerHTML.split(" ")[0].replace(":", ".");
    return parseFloat(pricePerLiter);
}

  window.addEventListener('load', function () {
    setTimeout(function(){
        init();
    }, 1000);
  })

  window.addEventListener('click', function () {
      init();
  })

  window.addEventListener('touchmove', function () {
    init();
})
})();