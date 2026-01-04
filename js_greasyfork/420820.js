// ==UserScript==
// @name         Box Menu SP
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @match        https://seller.shopee.co.id/portal/sale*
// @grant        none
// @require      https://apis.google.com/js/client.js
// @downloadURL https://update.greasyfork.org/scripts/420820/Box%20Menu%20SP.user.js
// @updateURL https://update.greasyfork.org/scripts/420820/Box%20Menu%20SP.meta.js
// ==/UserScript==

(function() {
    'use strict';
var diva = document.createElement('div')
diva.style.position = 'fixed'
diva.style.top = '0px'
diva.style.zIndex = "7000"
diva.style.right = '420px'
document.getElementsByTagName("body")[0].appendChild(diva)

var imput = document.createElement('input')
imput.style.borderColor = '#ee4d2d'
imput.style.margin = '2px'
imput.style.padding = '15px'
imput.style.fontSize = '16px'


var nota = document.createElement('button')
nota.innerHTML = 'Buat Nota'
nota.style.backgroundColor = '#ee4d2d'
nota.style.margin = '2px'
nota.style.color = 'white'
nota.style.cursor = 'pointer'
nota.style.padding = '15px'
nota.style.fontSize = '16px'

var addrc = document.createElement('button')
addrc.innerHTML = 'Alamat Costom'
addrc.style.backgroundColor = '#ee4d2d'
addrc.style.margin = '2px'
addrc.style.padding = '15px'
addrc.style.fontSize = '16px'
addrc.style.color = 'white'

var addra = document.createElement('button')
addra.innerHTML = 'Alamat Asli'
addra.style.backgroundColor = '#ee4d2d'
addra.style.margin = '2px'
addra.style.padding = '15px'
addra.style.fontSize = '16px'
addra.style.color = 'white'

var tblprint = document.createElement('button')
tblprint.innerHTML = 'Print'
tblprint.style.backgroundColor = '#ee4d2d'
tblprint.style.margin = '2px'
tblprint.style.padding = '15px'
tblprint.style.fontSize = '16px'
tblprint.style.color = 'white'

var tblrfr = document.createElement('button')
tblrfr.innerHTML = 'Refresh'
tblrfr.style.backgroundColor = '#ee4d2d'
tblrfr.style.margin = '2px'
tblrfr.style.padding = '15px'
tblrfr.style.fontSize = '16px'
tblrfr.style.color = 'white'

diva.appendChild(imput)
diva.appendChild(nota)
diva.appendChild(addrc)
diva.appendChild(addra)
diva.appendChild(tblprint)
diva.appendChild(tblrfr)

//cari transaksi berdasarkan id transaksi
imput.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        var idtrans = imput.value
        window.location.href = 'https://seller.shopee.co.id/portal/sale/'+idtrans;
    }})

//buat desain nota
nota.addEventListener("click", function(){
    nota.disabled = 'true'
    var idtr = window.location.href;
    var idtrcut = idtr.slice(-14);

    document.getElementsByClassName('header-bar shopee-header-bar')[0].remove()
    document.getElementsByClassName('card-style shopee-card')[0].remove()
    document.getElementsByClassName('card-style shopee-card')[1].remove()
    document.getElementsByClassName('col-4 od-history')[0].remove()
    document.getElementsByClassName('section')[1].remove()
    document.getElementsByClassName('section')[1].remove()
    document.getElementsByClassName('income-container')[0].remove()
    document.getElementsByClassName('card-style buyer-payment shopee-card')[0].remove()
    document.getElementById('shopee-mini-chat-embedded').remove()
    document.getElementById('shopee-cs-chat-sc').remove()
    document.getElementsByClassName('app-container')[0].style.marginTop = '0px'
    document.getElementsByClassName('app-container')[0].style.backgroundColor = '#ffffff'
    document.getElementsByClassName('page-container')[0].style.backgroundColor = '#ffffff'
    document.getElementsByClassName('floating-box')[0].style.backgroundColor = '#ffffff'
    document.getElementsByClassName('route-index route-portal-sale route-portal-sale-order')[0].style.backgroundColor = '#ffffff'


    var xhr = new XMLHttpRequest();    
    var url = 'https://seller.shopee.co.id/api/v3/order/get_one_order?SPC_CDS=71f80b77-9e38-4512-b491-1f0fbe3835b5&SPC_CDS_VER=2&order_id='+idtrcut
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.responseText);
            var cdr = data.data.order_sn
            var divntr = document.createElement('div')
            divntr.innerHTML = cdr
            let item = data.data.order_items

            divntr.style.position = 'fixed'
            divntr.style.fontSize = 'x-large'
            divntr.style.writingMode = 'tb-rl'
            divntr.style.borderWidth = "thick"
            divntr.style.borderColor = '#ee4d2d'
            divntr.style.top = '400px'
            divntr.style.zIndex = "7003"
            divntr.style.left = '10px'
            document.getElementsByTagName("body")[0].appendChild(divntr)

           //ar kuriru = data.order.actual_carrier.slice(0,3)
          //var kuriru = data.data.actual_carrier.slice(0,3)
          var kuriru = data.data.fulfillment_carrier_name.slice(0,3)
            if (kuriru == 'J&T') {
                kuriru = 'J%26T'
            }
            var kuriri = kuriru

            var img = document.createElement("img");
            img.style.marginLeft = "50px"
            var par =document.getElementsByClassName('card-style shopee-card')[0]

            img.src = 'https://barcode.tec-it.com/barcode.ashx?data=' +cdr + '%5Cr%5CtSP%5Cr' + kuriri + '%5Cr' +'&code=Code128&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0'
            par.appendChild(img);
            img.width = "650"

    //  sku patch --------------------------------------------------------------------------------------------------
    document.getElementsByClassName('price')[0].innerHTML = 'Rak'
    document.getElementsByClassName('price')[0].style.fontSize = 'x-large'
    document.getElementsByClassName('qty')[0].innerHTML = 'Barcode'
    document.getElementsByClassName('qty')[0].style.fontSize = 'x-large'
    document.getElementsByClassName('subtotal')[0].innerHTML = 'JML'
    document.getElementsByClassName('subtotal')[0].style.fontSize = 'x-large'
    document.getElementsByClassName('no')[0].style.fontSize = 'x-large'
    document.getElementsByClassName('product')[0].style.fontSize = 'x-large'

    let f = (function(){
        let xhr = [], i;
        let url
        for(i = 0; i < item.length; i++){ //for loop
            (function(i){
                xhr[i] = new XMLHttpRequest();
                var sku = document.getElementsByClassName('product-meta')[i].innerHTML.slice(55, -19)
                
                url = "https://api.npoint.io/8c80228588ba9f00fdeb/"+sku
                xhr[i].open("GET", url, true);
                xhr[i].onreadystatechange = function(){
                    if (xhr[i].readyState === 4 && xhr[i].status === 200){
                       var data = JSON.parse(this.responseText);                        
                        
                        document.getElementsByClassName('product-name')[i].innerHTML= data[1]+"  --  "+sku
                        document.getElementsByClassName('product-name')[i].style.fontSize = "x-large"
                        document.getElementsByClassName('product-meta')[i].innerHTML= data[2]+"  -  " + data[3]
                        document.getElementsByClassName('price')[i+1].innerHTML= ""
                        document.getElementsByClassName('price')[i+1].style.fontSize = 'x-large'
                        var jml = document.getElementsByClassName('qty')[i+1].innerHTML
                        document.getElementsByClassName('qty')[i+1].innerHTML = data[0]
                        document.getElementsByClassName('qty')[i+1].style.fontSize = 'x-large'
                        document.getElementsByClassName('subtotal')[i+1].innerHTML =jml
                        document.getElementsByClassName('subtotal')[i+1].style.fontSize = 'x-large'
                        document.getElementsByClassName('product-meta')[i].style.fontSize = 'x-large'
                        document.getElementsByClassName('product-meta')[i].style.color = 'black'
                    }
                };
                xhr[i].send();
            })(i);
        }

    })();

    //  sku patch --------------------------------------------------------------------------------------------------


        }
    };
    xhr.open("GET", url, true);
    xhr.send();


    var namapar = document.getElementsByClassName('product-name')
    for(var j=0; j< namapar.length; j++){
        namapar[j].style.fontSize = '13pt'
    }

   var posbc2 = document.getElementsByClassName('payment-info-details')[0]
   var bc2 =document.createElement('img')
   bc2.style.paddingLeft = "30px"
   bc2.src = 'https://barcode.tec-it.com/barcode.ashx?data='+ idtrcut +'&code=Code128&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0'
   posbc2.appendChild(bc2)
   posbc2.getElementsByClassName('toggle')[0].remove()






})

//buat desain alamat costom
addrc.addEventListener('click', function(){// addrccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

    document.getElementsByClassName('price')[0].innerHTML = 'Rak'
    document.getElementsByClassName('qty')[0].innerHTML = 'Barcode'
    document.getElementsByClassName('subtotal')[0].innerHTML = 'JML'

    var f = (function(){
        //alert(document.getElementsByClassName('product-list-item').length)
        var xhr = [], i;

        var url
        for(i = 0; i < document.getElementsByClassName('product-list-item').length-1; i++){ //for loop
            (function(i){
                xhr[i] = new XMLHttpRequest();
                var sku = document.getElementsByClassName('product-meta')[i].innerHTML.slice(46, -12)
                url = "https://api.npoint.io/8c80228588ba9f00fdeb/"+sku
                xhr[i].open("GET", url, true);
                xhr[i].onreadystatechange = function(){
                    if (xhr[i].readyState === 4 && xhr[i].status === 200){
                       var data = JSON.parse(this.responseText);
                       //alert(data)
                        document.getElementsByClassName('product-name')[i].innerHTML= data[1]
                        document.getElementsByClassName('product-name')[i].style.fontSize = "x-large"
                        document.getElementsByClassName('product-meta')[i].innerHTML= data[2]+"  -  " + data[3]
                        document.getElementsByClassName('price')[i+1].innerHTML= data[4]
                        var jml = document.getElementsByClassName('qty')[i+1].innerHTML
                        document.getElementsByClassName('qty')[i+1].innerHTML = data[0]
                        document.getElementsByClassName('subtotal')[i+1].innerHTML =jml
                    }
                };
                xhr[i].send();
            })(i);
        }
        document.getElementsByClassName('income-container')[0].remove()
        document.getElementsByClassName('id row grid first-row')[0].remove()
        document.getElementsByClassName('card-style od-card col-16 user-view-item linkable ')[0].remove()
    })();


})


addra.addEventListener('click', function(){
    var idt = window.location.href.slice(-14)
    window.location.href = "https://seller.shopee.co.id/api/v2/orders" + "?" + idt

})

tblprint.addEventListener('click', function(){
    imput.value = 'Sudah Dicetak'
    document.getElementById('shopee-chat-embedded').style.visibility = 'hidden'
    diva.style.visibility = 'hidden'
    print()
    document.getElementById('shopee-chat-embedded').style.visibility = 'visible'
    diva.style.visibility = 'visible'
})

tblrfr.addEventListener('click', function(){
    location.reload()
})
})();