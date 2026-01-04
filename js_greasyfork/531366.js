// ==UserScript==
// @name        zmiana_rozdzielczosci
// @namespace   r-a-y/browser/screen
// @description Alters attempts at fingerprinting your screen resolution.
// @include     *
// @version     1.3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/531366/zmiana_rozdzielczosci.user.js
// @updateURL https://update.greasyfork.org/scripts/531366/zmiana_rozdzielczosci.meta.js
// ==/UserScript==

let adresy = [
    "screenresolutiontest.com",
    "sklep.kaufland.pl",
    "leaflets.kaufland.com",
    "fleetsolutions.bp.pl",
    "www.bp.com",
    "bp.com",
    "velo.com",
    "google.pl",
    "google.com"
];

let url = "" + window.location;
let containsUrl = adresy.some(adres => url.includes(adres));

if (!containsUrl) {

    const resolutions = [
        { width: 1920, height: 1080, chance: 23 },
        { width: 1650, height: 1080, chance: 14 },
        { width: 1920, height: 1200, chance: 10 },
        { width: 2560, height: 1440, chance: 6 },
        { width: 2560, height: 1600, chance: 4 },
        { width: 3840, height: 2160, chance: 3 },
        { width: 1600, height: 1200, chance: 5 },
        { width: 1600, height: 900, chance: 5 },
        { width: 1440, height: 900, chance: 5 },
        { width: 1400, height: 1050, chance: 5 },
        { width: 1366, height: 768, chance: 10 },
        { width: 1280, height: 768, chance: 4 },
        { width: 1024, height: 600, chance: 2 },
        { width: 1280, height: 800, chance: 3 },
        { width: 800, height: 600, chance: 1 }
    ];

    function weightedRandom(options) {
        const total = options.reduce((sum, opt) => sum + opt.chance, 0);
        let rand = Math.random() * total;
        for (let opt of options) {
            if (rand < opt.chance) return opt;
            rand -= opt.chance;
        }
        return options[0]; // fallback
    }

    if (getCookie('resolution') === '') {
        const selectedResolution = weightedRandom(resolutions);
        document.cookie = "resolution=" + JSON.stringify(selectedResolution);
    }

    updateSessionResolution(JSON.parse(getCookie('resolution')));

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length);
            }
        }
        return "";
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

}