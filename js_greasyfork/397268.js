// ==UserScript==
// @name         Google Modificant
// @namespace    wsquarepams.github.io
// @version      0.5
// @description  Modifies the google logo so that it looks wierd, A.K.A. The oldest google logo.
// @author       Willy
// @match        https://www.google.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397268/Google%20Modificant.user.js
// @updateURL https://update.greasyfork.org/scripts/397268/Google%20Modificant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logo = document.getElementById("hplogo")
    var waitLength = 5000
    var label = document.getElementById("SIvCob")

    label.innerHTML = "Click on image to find link."

    logo.addEventListener('click', function() { label.innerHTML ='<a>' + logo.src + '</a>'})
    label.addEventListener('click', function() {label.innerHTML = "Sike!"})

    setTimeout(function() {
        logo.src = "https://icdn3.digitaltrends.com/image/google_1998-316x95.jpg"
        logo.srcset = "https://icdn3.digitaltrends.com/image/google_1998-316x95.jpg"
        label.innerHTML = "Ooh! An old Google logo!!"
        setTimeout(function() {
            logo.src = "https://icdn2.digitaltrends.com/image/digitaltrends/google_1997-543x74.jpg"
            logo.srcset = "https://icdn2.digitaltrends.com/image/digitaltrends/google_1997-543x74.jpg"
            label.innerHTML = "Uhhh.. It's even older... like when it first came out..."
            setTimeout(function() {
                logo.src = "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWe65Z?ver=2d4e&q=90&m=6&h=195&w=348&b=%23FFFFFFFF&l=f&o=t&aim=true"
                logo.srcset = "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWe65Z?ver=2d4e&q=90&m=6&h=195&w=348&b=%23FFFFFFFF&l=f&o=t&aim=true"
                document.getElementsByClassName("gNO89b") [0].value = "Bing Search"
                label.innerHTML = "Bing. Bing... Bing? Bing!? BING?!?!???! WAIT WHAT?"
            }, waitLength/2)
        }, waitLength/2)
    }, waitLength)
})();