// ==UserScript==
// @name         Drukowanie etykiet Skaner KTW4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nowaratn
// @match        http://sortcenter-menu-eu.amazon.com/containerization/closeContainer
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/print-js/1.5.0/print.js
// @downloadURL https://update.greasyfork.org/scripts/416412/Drukowanie%20etykiet%20Skaner%20KTW4.user.js
// @updateURL https://update.greasyfork.org/scripts/416412/Drukowanie%20etykiet%20Skaner%20KTW4.meta.js
// ==/UserScript==

setInterval(function() {

    if(document.getElementById("piv_0") != null && document.getElementById("barcode_div") == null)
    {
        if(document.getElementById("infodisplay").innerText.includes("Container successfully closed"))
        {
            var data = document.getElementById("piv_0").innerText;

            setTimeout(function() {
                 printJS({printable: 'http://kreseczki.pl/ind2.php?j=128&ska=2&rot=0&kod=' + data + '&typ=png&klk=0e0e0&kres=1&napr=1', type: 'image', documentTitle: '', style: 'width:200px;height:200px'});
                document.getElementById("switchcontainerlink").click();
            }, 500);
        }
    }
}, 1000);