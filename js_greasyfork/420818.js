// ==UserScript==
// @name         Topet Addr Costom V0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Alamat Tokopedia full costom
// @author       You
// @match        https://www.tokopedia.com/logistic/v2/print-address?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420818/Topet%20Addr%20Costom%20V01.user.js
// @updateURL https://update.greasyfork.org/scripts/420818/Topet%20Addr%20Costom%20V01.meta.js
// ==/UserScript==

(function() {

var style = document.createElement('style');
  style.innerHTML = `
    div.borderform {
        position: absolute;
        border-style: solid;
        border-width: 1px;
        width: 334px;
        height: 443px;
      }
    div.logo{
        <!-- border-style: solid; -->
        border-width: 1px;
        height: 26px;
        padding: 2px;
        margin-top: 10px;
    }
    img.logosope{
        width: 132px;
        margin-left:10px;
    }
    img.logokurir{
        float: right;
        margin-right:10px;
    }
    div.bcresi{
        <!-- border-style: solid; -->
        border-width: 1px;
        padding: 5px;
        height: 68px;
    }
    img.bcres{
        width:313px;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: -4px;
        height: 70px;

    }
    div.to{        
        border-width: 1px;
        height: 126px ;
        word-wrap: break-word;
        margin-left: 10px;
        font-size:9pt;

    }
    .hider{
        font-weight: bold;
    }
    p{
        margin:2px;
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
        margin-top:53px;

    }
    div.notrans{
        <!-- border-style: solid; ->
        border-width: 1px;
        <!-- padding: 5px; -->
        height:119px;
        margin-top: 4px;

    }
    div.divserv{
        position: absolute;
        border-width: 1px;
        right: 11px;
        border-style: solid;
        width: 98px;
        height: 18px;
        top: 115px;
        text-align: center;
        padding: 1px;
    }
    div.divds{
        position: absolute;
        border-width: 1px;
        right: 11px;
        border-style: solid;
        width: 44px;
        height: 18px;
        top: 133px;
        text-align: center;
        padding: 1px;
    }
    img.bcno{
        height:90px;
        width:215px;
    }

  `;
document.head.appendChild(style);


var cont = document.createElement('div')
cont.setAttribute("class", "borderform")
cont.style.cssFloat = "left"


var divlogo = document.createElement('div')
divlogo.setAttribute("class", "logo")
cont.appendChild(divlogo)
    var imgsp = document.createElement('img')
    imgsp.setAttribute("class", "logosope")
    imgsp.src = 'https://lh3.googleusercontent.com/lBSp9EVunoaf7OWcMo1tI_CqHGszguDVs9X4FF8hLbOvWuWkgRyyEca60eyJ6RSebIxQW6-53d5i__748HhX-VKKD6lSPzKLIaaEf3HLggGGbaJvDaIvTp2JrPKnSTRszLHH9P-8L5HIx5rOkuvKwobud9qLyHWrP9CA4OtRMz69BcadL9AAzJ7khjcLNnhId3rv-lvxW4ERQ2oQ2yokGuYuesRATyas7D9YPQRWd8NBpBcHO6d9OFPUM9xkcCIZrXBH_60-Kd9s2v5nhOwmsvXJ-2SCL312sbdHdcx77TwVar1fgMQMFnn8d844vmEjw2zTPvywMqLIOL7Dl9fiaJt320kT58TN9p3kng9lkMlTWvMTqEMIYHH3DDG-CXJH-R-E_6GeV_YyWr0ggw_pd2uRz7Jw-g8Ox1r2JJIqFdE_zIwx4kh4BUmKGGA7yMZ0Xftnym-VoiAdbzJ85i2L3K8g04AXsWx_1qQvJImYXpFTPgW6xOVMOzM2OXEvipJpHT5_7XaNillHQPi3Y1OQ_qGmHhlKUN3tz6PYIxC7hNvb8je3LrT_fXV6wh_IxfzGIkCZmRGAiY9kDBLZLrR5XRz-sBmBgXdBDO7pb7MGAjJXPk6ClcHyUklCeQS6JhM7V5qRHKcT4mcUOIBWj6poNnVtGSKkBiulvbjbl8cIh9VCI69bPUisjWNLVVW5jA=w583-h120-no?authuser=0'
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

var divserv = document.createElement('div')
divserv.setAttribute("class", "divserv")
cont.appendChild(divserv)

var divds = document.createElement('div')
divds.setAttribute("class", "divds")
//cont.appendChild(divds)
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
    from.innerHTML = 'Bakapedia 6285258260836'
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
    imgbcno.setAttribute("class", "bcno")
    divnotrans.appendChild(imgbcno)

    var hongkir = document.createElement('p')
    hongkir.setAttribute("class", "hider")
    hongkir.innerHTML = 'Ongkir: '
    hongkir.style.cssFloat = "left"
    divnotrans.appendChild(hongkir)

//     var rp = document.createElement('p')
//     rp.innerHTML = 'Rp. '
//     rp.style.cssFloat = "left"
//     divnotrans.appendChild(rp)

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

//     var gramtxt = document.createElement('p')
//     gramtxt.style.cssFloat = "left"
//     gramtxt.innerHTML= ' gram'
//     divnotrans.appendChild(gramtxt)


'use strict';
var kurir = document.getElementsByClassName('meta')[0].getElementsByTagName('td')[3].innerHTML.slice(45,48)
var service
var resi
var notrans
var penerima
var berat
var ongkos

if(kurir =='JNE'){
    imgkurir.src = 'https://i.pinimg.com/originals/aa/d3/f9/aad3f91a506118c625e0938dcfb3a0fa.png'
    imgkurir.style.width = '63px'
    service = document.getElementsByClassName('meta')[0].getElementsByTagName('td')[3].getElementsByTagName('b')[0].innerHTML
    resi = document.getElementById('barcode-printout-1').getAttribute('alt')
    notrans = document.getElementsByClassName('invoice')[0].innerHTML.slice(-9)
    penerima = document.getElementsByClassName('shipment-address')[0].getElementsByTagName('td')[0].innerHTML
    berat = document.getElementsByClassName('meta')[1].getElementsByTagName('tr')[2].getElementsByTagName('b')[0].innerHTML
    ongkos = document.getElementsByClassName('meta')[1].getElementsByTagName('tr')[2].getElementsByTagName('b')[1].innerHTML

    //document.getElementsByClassName('address_container_left')[0].remove()
    //document.body.appendChild(cont)
    document.getElementById('address_container_right_1').appendChild(cont)
    divto.innerHTML = penerima
    divserv.innerHTML = kurir+' '+service
    beratval.innerHTML = berat
    ongkir.innerHTML = ongkos
    imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='
    imgbcno.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans +'&code=Code128&dpi=96&dataseparator='
    document.getElementById('address_container_left_1').remove()


}else if(kurir == 'J&a'){
    imgkurir.src = 'https://cdn.tokopedia.net/img/kurir/logo_jnt.png'
    imgkurir.style.width = '83px'
    service = document.getElementsByClassName('meta')[0].getElementsByTagName('td')[3].getElementsByTagName('b')[0].innerHTML
    resi = document.getElementById('barcode-printout-1').getAttribute('alt')
    notrans = document.getElementsByClassName('invoice')[0].innerHTML.slice(-9)
    penerima = document.getElementsByClassName('shipment-address')[0].getElementsByTagName('td')[0].innerHTML
    berat = document.getElementsByClassName('meta')[1].getElementsByTagName('tr')[2].getElementsByTagName('b')[0].innerHTML
    ongkos = document.getElementsByClassName('meta')[1].getElementsByTagName('tr')[2].getElementsByTagName('b')[1].innerHTML

    //document.getElementsByClassName('address_container_left')[0].remove()
    //document.body.appendChild(cont)
    document.getElementById('address_container_right_1').appendChild(cont)
    divto.innerHTML = penerima
    divserv.innerHTML = 'J&T '+service
    beratval.innerHTML = berat
    ongkir.innerHTML = ongkos
    imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='
    imgbcno.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans +'&code=Code128&dpi=96&dataseparator='

    
}else{
    alert('kurir pos')
}
document.getElementsByClassName('address')[1].remove()
})();