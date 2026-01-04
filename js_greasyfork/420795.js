// ==UserScript==
// @name         fetch V0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  to make yo feel easy
// @author       You
// @match        https://seller.bukalapak.com/products?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420795/fetch%20V01.user.js
// @updateURL https://update.greasyfork.org/scripts/420795/fetch%20V01.meta.js
// ==/UserScript==

(function() {
    'use strict';
var diva = document.createElement('div')
diva.style.zIndex = "1100"
diva.style.position = 'fixed'

diva.style.left = '-292px'
diva.style.top = '16px'
diva.style.backgroundColor = 'red'
diva.style.borderRadius = "3px"

document.getElementsByTagName('body')[0].appendChild(diva)

var imputsku = document.createElement('input')
imputsku.style.borderColor = '#4CAF50'
imputsku.style.borderColor = 'black'
imputsku.style.margin = '2px'
imputsku.style.borderRadius = "3px"

var imputqty = document.createElement('input')
imputqty.style.borderColor = '#4CAF50'
imputqty.style.borderColor = 'black'
imputqty.style.margin = '2px'
imputqty.style.width = '50px'
imputqty.style.borderRadius = "3px"

var fetc = document.createElement('button')
fetc.innerHTML = 'fetch sku'
fetc.style.fontWeight = '500'
fetc.style.borderRadius = "3px"

fetc.style.backgroundColor = '#FD4900'
fetc.style.margin = '2px'
fetc.style.color = 'white'
fetc.style.cursor = 'pointer'

var nav = document.createElement('button')
nav.innerHTML = "&#9776;"
nav.style.fontWeight = '500'
nav.style.borderRadius = "3px"

nav.style.backgroundColor = '#FD4900'
nav.style.margin = '2px'
nav.style.color = 'white'
nav.style.cursor = 'pointer'


diva.appendChild(imputsku)
diva.appendChild(imputqty)

diva.appendChild(fetc)
diva.appendChild(nav)

var clknav = 0

fetc.addEventListener('click', function(){
    fetc.style.backgroundColor = '#83937E'
    if ((imputsku.value == "" ) || ( imputqty.value == "")) {
      
    } else {
        var res = 0
        fetch("https://seller.bukalapak.com/api/authenticate", {
          "headers": {
            "accept": "*/*",
            "accept-language": "id,jw;q=0.9,en;q=0.8",
            "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          "referrer": "https://seller.bukalapak.com/products?offset=0&limit=30&product_type=all&sort=date",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        })
        .then(response => response.json())
        .then(response => {
            var token = response.token.access_token
            fetch("https://api.bukalapak.com/stores/me/products?keywords="+ imputsku.value +"&limit=30&offset=0&product_type=all&sort=date&access_token="+ token, {
              "headers": {
                "accept": "application/json",
                "accept-language": "id,jw;q=0.9,en;q=0.8",
                "content-type": "application/json;charset=utf-8",
                "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
              },
              "referrer": "https://seller.bukalapak.com/",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": null,
              "method": "GET",
              "mode": "cors",
              "credentials": "omit"
            })
            .then(response => response.json())
            .then(response => {//responsku keyword
                var idp = response
                for (let i = 0; i <= idp.data.length-1; i++) {
                    //alert(i+": "+idp.data[i].id+"--"+idp.data[i].sku_id)
                    fetch("https://api.bukalapak.com/products/"+idp.data[i].id+"/skus/"+idp.data[i].sku_id+"?access_token="+token, {
                      "headers": {
                        "accept": "application/json",
                        "accept-language": "id,jw;q=0.9,en;q=0.8",
                        "content-type": "application/json",
                        "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site"
                      },
                      "referrer": "https://seller.bukalapak.com/",
                      "referrerPolicy": "strict-origin-when-cross-origin",
                      "body": "{\"stock\":"+imputqty.value+"}",
                      "method": "PATCH",
                      "mode": "cors",
                      "credentials": "omit"
                    })
                    .then(response => response.json())
                    .then(response => {
                        res += 1
                        if(res == idp.data.length){
                            fetc.style.backgroundColor = '#FD4900'
                            imputqty.value=""
                            imputsku.value=""
                        }
                    })
                }//looping

            })//responsku keyword

        })//fetch keyword sku
    }
})//fetch auth



nav.addEventListener('click', function(){
    clknav += 1
    if (clknav%2==0) {
        //genap
        diva.style.left = '-292px'
    } else {
      //  ganjil
        diva.style.left = '5px'
    }

})

})();