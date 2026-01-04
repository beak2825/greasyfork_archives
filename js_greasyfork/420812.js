 // ==UserScript==
// @name         Nota Bukalapak
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  barcode Bukalapak
// @author       Ahmad Rif
// @match        https://seller.bukalapak.com/transactions/print-invoice?transaction_id=*
// @grant        Every Life
// @downloadURL https://update.greasyfork.org/scripts/420812/Nota%20Bukalapak.user.js
// @updateURL https://update.greasyfork.org/scripts/420812/Nota%20Bukalapak.meta.js
// ==/UserScript==

(function() {
    'use strict';
var xhrauth = new XMLHttpRequest()
var urlauth = 'https://seller.bukalapak.com/api/authenticate'
xhrauth.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
    var dataauth = JSON.parse(this.responseText).token.access_token

    var idtrans = window.location.href.slice(-10)

    var xhrtran = new XMLHttpRequest()
    var urltran = 'https://api.bukalapak.com/transactions/'+idtrans+'?access_token='+ dataauth
        xhrtran.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
            var datatrans = JSON.parse(this.responseText)
            var notrans = datatrans.data.transaction_id
            var kurir = datatrans.data.delivery.buyer_logistic_choice


            if (kurir == 'jnt') {
                kurir = 'J%26T'
            }
            var imgbar = document.createElement('img')
            imgbar.width = '600'
            
            //alert(kurir)

            imgbar.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans + '%5Cr%5CtBL%5Cr' + kurir + '%5Cr' +'&code=Code128&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0'
            var tempel = document.getElementsByTagName('body')[0]
            var dif = document.createElement('div')
            dif.style.position = 'absolute'
            dif.style.top = '30px'
            dif.setAttribute("class", "kotak");
            tempel.appendChild(dif)
            dif.appendChild(imgbar)

        }
    }
    xhrtran.open("GET", urltran, true)
    xhrtran.send()

    }
}
xhrauth.open("GET", urlauth, true)
xhrauth.send()



})();