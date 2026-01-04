// ==UserScript==
// @name      Kamery spolu
// @name:en   Cameras together
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Kukaj viac kamier naraz na /o-nas stránke webu kukaj.sk
// @description:en Watch multiple cameras at once
// @author       PrdiChlp
// @match        https://www.kukaj.sk/o-nas
// @match        https://www.kukaj.sk/projekt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425141/Kamery%20spolu.user.js
// @updateURL https://update.greasyfork.org/scripts/425141/Kamery%20spolu.meta.js
// ==/UserScript==

(function() {
    'use strict';

var txtStreammy = `
https://www.kukaj.sk/projekt/224-bociany-bolesov
https://www.kukaj.sk/projekt/269-bociany-bolesov
https://www.kukaj.sk/projekt/271-bociany-bolesov
https://www.kukaj.sk/projekt/202-bociany-bolesov
https://www.kukaj.sk/projekt/203-bociany-bolesov
https://www.kukaj.sk/projekt/204-bociany-bolesov
https://www.kukaj.sk/projekt/205-bociany-bolesov
https://www.kukaj.sk/projekt/206-bociany-bolesov
https://www.kukaj.sk/projekt/207-bociany-bolesov
`.replace(' ',''), streamy = cleanArray(txtStreammy.split('\n'));

    function cleanArray(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }

if(window.location.href=='https://www.kukaj.sk/o-nas'){
    var iframes = '';
    for(var i=0;i<streamy.length;i++) iframes += '<iframe src="' + streamy[i] + '"></iframe>';
    $(document.body).append(`<div id="streamy">` + iframes + `</div>`);
}

    $(document.body).append(`
<style>
header, footer, .text, .partneri, .text-center {
    display: none !important;
}
body {
    overflow: hidden !important;
    background-color: black !important;
}
iframe {
    width: 32vw;
    height: 32vh;
    overflow: hidden;
    border: none;
    /* margin: 0 .5vw; */
}
#streamy {
    text-align: center;
    line-height: 0;
    align-content: center;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
}
.kamera > div {
    max-height: 100vh;
}
</style>
`);
})();