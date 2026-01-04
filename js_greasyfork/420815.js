// ==UserScript==
// @name         blcostomslip
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://seller.bukalapak.com/transactions/print-preview?blcostomslip*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420815/blcostomslip.user.js
// @updateURL https://update.greasyfork.org/scripts/420815/blcostomslip.meta.js
// ==/UserScript==

(function() {
    'use strict';

var style = document.createElement('style');
  style.innerHTML = `
    div.borderform {
        position: absolute;
        border-style: solid;
        border-width: 1px;
        width: 280px;
        height: 371px;
      }
    div.logo{
        <!-- border-style: solid; -->
        border-width: 1px;
        height: 26px;
        padding: 2px;
    }
    img.logosope{
        width: 132px;
    }
    img.logokurir{
        float: right;
    }
    div.bcresi{
        <!-- border-style: solid; -->
        border-width: 1px;
        padding: 5px;
        height: 68px;
    }
    img.bcres{
        width:250px;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: -4px;
        height: 70px;

    }
    div.to{

        border-width: 1px;
        height: 126px ;
        word-wrap: break-word;
        margin-bottom:2px !important;

    }
    .hider{
        font-weight: bold;
    }
    p{
        margin:2px;
        margin-bottom: 5px !important;
        font:caption;
        font-size: small;
    }
    h{
        margin:2px;
        margin-bottom:2px !important;
        font:caption;
        font-size: small;
    }
    div.from{
        <!-- border-style: solid; -->
        border-width: 0.5px;
        height: 34px;
        padding: 0px;
        height: 22px;
        padding-top: 3px;
        word-wrap: break-word;
    }
    div.notrans{
        <!-- border-style: solid; ->
        border-width: 1px;
        <!-- padding: 5px; -->
        height:119px;
        margin-top: 4px;

    }
    div.divserv{
        padding:2px;
        position: absolute;
        border-width: 1px;
        right: 11px;
        border-style: solid;
        width: 127px;
        height: 18px;
        top: 109px;
        text-align: center;

    }
    div.divds{
        padding:2px;
        position: absolute;
        border-width: 1px;
        right: 11px;
        border-style: solid;
        width: 60px;
        height: 18px;
        top: 133px;
        text-align: center;

    }

  `;
document.head.appendChild(style);


var cont = document.createElement('div')
cont.setAttribute("class", "borderform")
cont.style.cssFloat = "left"
document.body.appendChild(cont)

var divlogo = document.createElement('div')
divlogo.setAttribute("class", "logo")
cont.appendChild(divlogo)
    var imgsp = document.createElement('img')
    imgsp.setAttribute("class", "logosope")
    imgsp.src = 'https://lh3.googleusercontent.com/F3LA4GYNbUDn6sDoJQJdXTTkAE9Cno61mPob6Iudq5yfRMF2o4Zf-pEehoYplmRRsuEv3tGD0RiqXThupQlTvFDmGFhS-eU42urtvBiSllf9OAiTbi2PcLdgeg_CSnd_27VeEB8ah5mIjH9pBgSTluB6-yq-aI9dCTPkcRtNnfcJqmzLa5PokhjFT3XF7_O0mf0O6hFsgHjxoJffI-tFlqKl-AauDCiguA7mOFw-1tS3vhO35PSv3W2Fk6zLE6VvxM2PsH5Kh8QubqVTpk2B1pNNwpaERhJwTS25TKywRIck5mupQG1aBSepFAmPfjDACCP9jUidECKkHyF53oI0Nei6xySK3hGCBLOhTImj_qRaZfbUaPhVbC9hqDiJqWKGcaDQxvw64UV09v2duJUbsDRoxKVBWRUbBqa6cYFyAOTweRQq3sjjwXgDj6onls-xP-Aemfmi5NfmZmep1kJpjoCdHIG74naeNSFrwezCO__jk4pyIRxho9NyfPSzjnnGDsvAOLqNnUZg5aVtHxoB1MAXZSN5gZS_9aS6tzJMKG2GVNA_ByXl9-qw7-BPVNfuKAzyfkcmUvIdfest6xYFxfsrfxbHxM73_OMwd6u91YSlFbk0t4RVDzVPIIVKVEfsXKUsjKUl33IOzXPXcjtrrQio7U9PHghLZDVKuVadMcgIBpq1YXZRkX-2CgaH_A=w108-h20-no?authuser=0'
    divlogo.appendChild(imgsp)

    var imgkurir = document.createElement('img')
    imgkurir.setAttribute("class", "logokurir")
    divlogo.appendChild(imgkurir)


var divbcresi = document.createElement('div')
divbcresi.setAttribute("class", "bcresi")
cont.appendChild(divbcresi)
    var imgbcresi = document.createElement('img')
    imgbcresi.setAttribute("class", "bcres")
    divbcresi.appendChild(imgbcresi)

var divto = document.createElement('div')
divto.setAttribute("class", "to")
cont.appendChild(divto)
    var hider = document.createElement('p')
    hider.setAttribute("class", "hider")
    //hider.style.cssFloat = "left"
    hider.innerHTML = 'Penerima:   '
    divto.appendChild(hider)

    var nama = document.createElement('p')
    divto.appendChild(nama)

    var phone = document.createElement('p')
    divto.appendChild(phone)


    var alamat = document.createElement('p')
    divto.appendChild(alamat)

    var distrik = document.createElement('p')
    divto.appendChild(distrik)

var divserv = document.createElement('div')
divserv.setAttribute("class", "divserv")
cont.appendChild(divserv)

var divds = document.createElement('div')
divds.setAttribute("class", "divds")
cont.appendChild(divds)
    var dscheck = document.createElement("INPUT");
    dscheck.style.cssFloat = "left"
    //dscheck.disabled = true
    dscheck.setAttribute("type", "checkbox");
    divds.appendChild(dscheck)

    var DStect = document.createElement('p')
    DStect.setAttribute("class", "hider")
    DStect.innerHTML = 'DS'
    divds.appendChild(DStect)



var divfrom = document.createElement('div')
divfrom.setAttribute("class", "from")
cont.appendChild(divfrom)
    var fromtext = document.createElement('p')
    fromtext.setAttribute("class", "hider")
    fromtext.innerHTML = 'Pengirim:'
    fromtext.style.cssFloat = "left"
    divfrom.appendChild(fromtext)

    var from = document.createElement('p')
    from.innerHTML = 'Bakalapak 6285258260836'
    divfrom.appendChild(from)

var divnotrans = document.createElement('div')
divnotrans.setAttribute("class", "notrans")
cont.appendChild(divnotrans)
    var hiderno = document.createElement('p')
    hiderno.setAttribute("class", "hider")
    hiderno.style.cssFloat = "left"
    hiderno.innerHTML = 'No. Transaksi:   '
    divnotrans.appendChild(hiderno)

    var imgbcno = document.createElement('img')
    imgbcno.setAttribute("class", "bcres")
    divnotrans.appendChild(imgbcno)

    var hongkir = document.createElement('p')
    hongkir.setAttribute("class", "hider")
    hongkir.innerHTML = 'Ongkir: '
    hongkir.style.cssFloat = "left"
    divnotrans.appendChild(hongkir)

    var rp = document.createElement('p')
    rp.innerHTML = 'Rp. '
    rp.style.cssFloat = "left"
    divnotrans.appendChild(rp)

    var ongkir = document.createElement('p')
    ongkir.style.cssFloat = "left"
    divnotrans.appendChild(ongkir)

    var berattxt = document.createElement('p')
    berattxt.style.cssFloat = "left"
    berattxt.innerHTML= '      Berat: '
    divnotrans.appendChild(berattxt)

    var beratval = document.createElement('p')
    beratval.style.backgroundColor = "#9ACD32"
    beratval.style.cssFloat = "left"
    divnotrans.appendChild(beratval)

    var gramtxt = document.createElement('p')
    gramtxt.style.cssFloat = "left"
    gramtxt.innerHTML= ' gram'
    divnotrans.appendChild(gramtxt)


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
            
            nama.innerHTML = datatrans.data.delivery.consignee.name
            alamat.innerHTML = datatrans.data.delivery.consignee.address
            phone.innerHTML = datatrans.data.delivery.consignee.phone
            distrik.innerHTML = datatrans.data.delivery.consignee.district+', '+datatrans.data.delivery.consignee.city+', '+datatrans.data.delivery.consignee.province+', '+datatrans.data.delivery.consignee.postal_code
            ongkir.innerHTML = datatrans.data.amount.seller.details.delivery
            imgbcno.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans +'&code=Code128&dpi=96&dataseparator='
            
            divserv.innerHTML = datatrans.data.delivery.requested_carrier

            var itemlist = datatrans.data.items
            var i
            var berat = 0

            for (i = 0; i < itemlist.length; i++) {

                var weight = datatrans.data.items[i].stuff.product.weight
                var qty = datatrans.data.items[i].quantity
                berat = berat+(weight*qty)




                     }

beratval.innerHTML = berat

            if (kurir == 'jne') {
                imgkurir.style.width = '70px'
                imgkurir.src = 'https://i.pinimg.com/originals/aa/d3/f9/aad3f91a506118c625e0938dcfb3a0fa.png'
                var resi = datatrans.data.delivery.booking.booking_code
                imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='
            } else if (kurir == 'jnt') {
                imgkurir.style.width = '116px'
                imgkurir.src = 'https://2.bp.blogspot.com/-FHzZsGLtYaY/XG4jrn8ZoiI/AAAAAAAACBA/jGgbIPBU554eshrk2DZqmzqcYvwcdJQKgCLcBGAs/s320/jnt-logo.png'
                var resi = datatrans.data.delivery.booking.booking_code
                imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='
            }else{
                imgkurir.src = 'https://www.posindonesia.co.id/photos/1/Logo%20Pos%20Indonesia%20Kecil%20Warna%20Transparan.gif'
                imgkurir.style.width = '128px'
                imgbcresi.remove()
            }


        }
    }
    xhrtran.open("GET", urltran, true)
    xhrtran.send()

    }
}
xhrauth.open("GET", urlauth, true)
xhrauth.send()

})();
