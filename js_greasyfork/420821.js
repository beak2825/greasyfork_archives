// ==UserScript==
// @name         Sope api offline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://seller.shopee.co.id/api/v2/orders?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420821/Sope%20api%20offline.user.js
// @updateURL https://update.greasyfork.org/scripts/420821/Sope%20api%20offline.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementsByTagName('pre')[0].remove()
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
        <!-- border-style: solid; -->
        border-width: 1px;
        height: 126px ;
        word-wrap: break-word;

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
        width: 170px;
        height: 18px;
        top: 102px;
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
    imgsp.src = 'https://lh3.googleusercontent.com/HXfLm6hEIIpqJtIG4Enb5Td-VwdusG-5aQNCkyFquUkhQMg9KMo2whGPK39Ejy4DXxcVNt5qhJ6lmyoLlnthdECp_woUrpgkt1vgWgJGuoiO6tL9IVL5MzzVutmg1aC0LK4toe3Dd4_BMC5qEyf4UAEYDHKxusjXQ2159Sd0ATKbZYIyJqSRNOq8apcSnRhgbdfFV07l3kvqD7fSiGBdPPYBp1qmsADj1Dnn2tgDkoyRUN5Qe9Eyxj_veftrPNJkIj5ppauSPv7WnexqlRJvK-QCLdDADSaY-FfjWM4Byew5a2Gn1GQlZf_wq_9vntAFI5XjahF9joCYGHdzvH9Zym8NjRcNsAkTvfcY33vxOrI2Yy75iTdqB_iBQDSwgN-UC8pPXe1itS9P8Avio3zuziuO5HwO6vwthP3W-nX2YD3-03OZLE76Cme5PXYWvf-HU6Ds37tZuFcMADgq-2jeJf40gY2o3JRSKHHZGgHkBZL1Cyk0kkRN1qU9IPsd8SV3JzSoAQJ1pFnmShHiw6jF7dCT45-8vxpTZQpRPGzi8VxmQlTrq0VTVl023_yS_zra73HWBHd4vd4YmT7VWOTIZxzlVpDAP64Re3ljPa56Z20xCktIFnMvgLSlaEJMXViJQjhZeHbCp6D0vd4YtZQcv0Zlpsb9HQr2saj9jadHxotBGHPiHcgyTuh8LMbblw=w1366-h289-no?authuser=0'
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
    from.innerHTML = 'Bakashope 6285258260836'
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


    var idtrcut = window.location.href.slice(-14)
    var xhr = new XMLHttpRequest();
    var url = "https://seller.shopee.co.id/api/v3/order/get_one_order?SPC_CDS=973ab6c9-0c15-4178-9271-e7087d370085&SPC_CDS_VER=2&order_id="+ idtrcut
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.responseText);
            nama.innerHTML = data.data.buyer_address_name
            alamat.innerHTML = data.data.shipping_address
            phone.innerHTML = data.data.buyer_address_phone
            var notrans = data.data.order_sn
            ongkir.innerHTML = parseInt(data.data.origin_shipping_fee)
            var dsval = data.data.dropshipping_info.enabled

            if( dsval == '1'){
               dscheck.checked = true
               from.innerHTML = data.data.dropshipping_info.name + ' ' + data.data.dropshipping_info.phone_number
            }
            dscheck.value = data.data.dropshipping_info.enabled
            //alert(dscheck.value)
            //imgbcno.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans +'&code=Code128&dpi=96&dataseparator='
            imgbcno.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ notrans +'&code=PDF417&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0&eclevel=L'
            hiderno.innerHTML = 'No. Transaksi: '+ notrans

            var itemlist = data.data.order_items
            var i
            var berat = 0
            var xhritem = itemlist
            var res = 0


                for (i = 0; i < itemlist.length; i++) {
                    (function(i){
                         var itemid = data.data.order_items[i].item_id
                         var qty = data.data.order_items[i].amount
                         xhritem[i] = new XMLHttpRequest();
                         var urlitem = "https://seller.shopee.co.id/api/v3/product/get_product_detail/?SPC_CDS=c2d07823-d6d0-4c25-85ab-621133c64745&SPC_CDS_VER=2&product_id="+ itemid +"&version=3.1.0"
                         xhritem[i].onreadystatechange = function(){
                             if (xhritem[i].readyState === 4 && xhritem[i].status === 200){
                                 var dataitem = JSON.parse(this.responseText)
                                 var weight = parseInt(dataitem.data.weight)*parseInt(qty)
                                 
                                 berat = berat + weight
                                 res += 1
                                 if(res == itemlist.length){
                                     beratval.innerHTML = berat

                                 }
                                 

                             }
                         }

                         xhritem[i].open("GET", urlitem, true);
                         xhritem[i].send();
                    })(i)
                }



            var kurir = data.data.actual_carrier.slice(0,3)
            if (kurir == "J&T") {
                imgkurir.src = 'https://2.bp.blogspot.com/-FHzZsGLtYaY/XG4jrn8ZoiI/AAAAAAAACBA/jGgbIPBU554eshrk2DZqmzqcYvwcdJQKgCLcBGAs/s320/jnt-logo.png'
                imgkurir.style.width = '116px'
                divserv.innerHTML = data.data.actual_carrier
                var xhrk = new XMLHttpRequest();
                var urlk = "https://seller.shopee.co.id/api/v3/order/get_forder_logistics/?order_id="+ idtrcut+"&SPC_CDS=c0d2d401-f659-49f2-90fc-09377db3770b&SPC_CDS_VER=2"
                xhrk.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                        var datak = JSON.parse(this.responseText);
                        var resi = datak.data.list[0].thirdparty_tracking_number
                        imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='

                    }
                };
                xhrk.open("GET", urlk, true);
                xhrk.send();

            } else {
                imgkurir.src = 'https://i.pinimg.com/originals/aa/d3/f9/aad3f91a506118c625e0938dcfb3a0fa.png'
                imgkurir.style.width = '70px'
                divserv.innerHTML = data.data.actual_carrier
                var xhrjne = new XMLHttpRequest();
                var urljne = "https://seller.shopee.co.id/api/v3/order/get_forder_logistics/?order_id="+ idtrcut +"&SPC_CDS=9c875812-ccca-4a20-b2aa-7ddffa6e5711&SPC_CDS_VER=2"
                xhrjne.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                        var datajne = JSON.parse(this.responseText);
                        var resi = datajne.data.list[0].thirdparty_tracking_number
                        imgbcresi.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ resi +'&code=Code128&dpi=96&dataseparator='

                    }
                };
                xhrjne.open("GET", urljne, true);
                xhrjne.send();
              
            }


        }
    };
    xhr.open("GET", url, true);
    xhr.send();

})();