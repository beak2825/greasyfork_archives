// ==UserScript==
// @name        ZMIENNE_NOWE
// @namespace   r-a-y/browser/screen
// @description Alters attempts at fingerprinting your screen resolution.
// @include     *
// @version     1.1.22
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/527540/ZMIENNE_NOWE.user.js
// @updateURL https://update.greasyfork.org/scripts/527540/ZMIENNE_NOWE.meta.js
// ==/UserScript==

let adresy = [
//     'https://screenresolutiontest.com/screenresolution/',
    "screenresolutiontest.com",
    "sklep.kaufland.pl",
    "leaflets.kaufland.com",
    "velo.com",
    "google.pl",
    "google.com",
    "samsung.com"
    ];

let url = "" + window.location;
let containsUrl = adresy.some(adres => url.includes(adres));

if(containsUrl){
    // jezeli lista adresow zawiera link aktualnej strony to nie zmieniaj rozdzielczosci
} else {

    const resolutions = [];

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 1920 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1050, 'width': 1680 });

    resolutions.push({ 'height': 1200, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 2048 });

    resolutions.push({ 'height': 1600, 'width': 2560 });

    resolutions.push({ 'height': 1200, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 2048 });

    resolutions.push({ 'height': 1600, 'width': 2560 });

    resolutions.push({ 'height': 1200, 'width': 1920 });

    resolutions.push({ 'height': 1080, 'width': 2048 });

    resolutions.push({ 'height': 1600, 'width': 2560 });

    resolutions.push({ 'height': 2048, 'width': 2560 });

    resolutions.push({ 'height': 1536, 'width': 2048 });

    resolutions.push({ 'height': 1200, 'width': 1600 });

    resolutions.push({ 'height': 1050, 'width': 1400 });

    resolutions.push({ 'height': 800, 'width': 1280 });

    resolutions.push({ 'height': 768, 'width': 1366 });

    resolutions.push({ 'height': 768, 'width': 1280 });

    resolutions.push({ 'height': 768, 'width': 1280 });

    resolutions.push({ 'height': 600, 'width': 800 });

    resolutions.push({ 'height': 600, 'width': 1024 });

    resolutions.push({ 'height': 1024, 'width': 1280 });

    //$.removeCookie("resolution");

    if (getCookie('resolution') === '') {
        let selectedResolution = resolutions[Math.floor(Math.random() * resolutions.length)];
        document.cookie = "resolution=" + JSON.stringify(selectedResolution);
    } else {
        console.log(getCookie('resolution'));
    }


    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    updateSessionResolution(JSON.parse(getCookie('resolution')));
}




function updateSessionResolution(randomResolution) {
  Object.defineProperty(window.screen, "availWidth", {
    get: function () {
      return randomResolution.width;
    }
  });
  Object.defineProperty(window.screen, "width", {
    get: function () {
      return randomResolution.width;
    }
  });

  Object.defineProperty(window.screen, "availHeight", {
    get: function () {
      return randomResolution.height;
    }
  });
  Object.defineProperty(window.screen, "height", {
    get: function () {
      return randomResolution.height;
    }
  });

  Object.defineProperty(window, "innerWidth", {
    get: function () {
      return randomResolution.width;
    }
  });
  Object.defineProperty(window, "innerHeight", {
    get: function () {
      return randomResolution.height;
    }
  });

  Object.defineProperty(window, "outerWidth", {
    get: function () {
      return randomResolution.width;
    }
  });
  Object.defineProperty(window, "outerHeight", {
    get: function () {
      return randomResolution.height;
    }
  });

  Object.defineProperty(window, "devicePixelRatio", {
    get: function () {
      return 1;
    }
  });
}