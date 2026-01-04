// ==UserScript==
// @name         Gorivo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Uf što je skupo gorivo...
// @author       Phlex
// @match        https://www.google.com/maps*
// @run-at       document-ready
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447641/Gorivo.user.js
// @updateURL https://update.greasyfork.org/scripts/447641/Gorivo.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var price = await get_new()
    var rdy = false
    var elements = false


    console.log('Working')

    function createEl (){
        console.log(price)

        let div = document.getElementsByClassName('JuLCid')[0]


        let input = document.createElement("input");
        input.className = "Cgoriva";
        input.placeholder = "Price input"
        input.style.cssText = "border: 1px solid black;border-radius: 5px"



        let selectorDiv = document.createElement("div")
        selectorDiv.className = "gorivoTip mainGorivo fontTitleSmall"
        selectorDiv.style = "display: flex;margin-top:12px"

        console.log(price)

        let gorivo1Div = document.createElement("div")
        gorivo1Div.className = "fontTitleSmall"
        gorivo1Div.style = "margin-left: auto;margin-right: auto;"



        let potrosnjaDiv = document.createElement("div")
        potrosnjaDiv.className = "fontTitleSmall "
        potrosnjaDiv.style = "display: flex;margin-top:12px;    align-items: center;   place-content: center;"


        let potrosnja = document.createElement("input")
        potrosnja.id = "potrosnja"
        potrosnja.name = "potrosnja"
        potrosnja.style = "padding:-2px; border: 1px solid gray"
        potrosnja.className = "fontTitleSmall"
        potrosnja.placeholder = "km/L"

        let potrosnjaLabel = document.createElement("label")
        potrosnjaLabel.for = "potrosnja"
        potrosnjaLabel.innerHTML = "Potrošnja: "
        potrosnjaLabel.className = "fontTitleSmall"
        potrosnjaLabel.style = "margin-right:6px"



        let gorivoOptions = document.createElement("select")
        gorivoOptions.id = "GorivoTip"
        gorivoOptions.name = "gorivo-tip"
        gorivoOptions.className = "fontTitleSmall"

        let gorivoOptionsLabel = document.createElement("label")
        gorivoOptionsLabel.for = "gorivo-tip"
        gorivoOptionsLabel.innerHTML = 'Tip goriva: '
        gorivoOptionsLabel.className = "fontTitleSmall"


        /*
        EUROSUPER 95 , ID:12
        EUROSUPER 95 CLASS PLUS, ID: 777
        EURODIZEL , ID: 15
        EURODIZEL CLASS PLUS, ID: 778
        AUTOPLIN , ID: 16
        */


        let option1 = document.createElement('option')
        option1.value = get_price(12)
        option1.innerHTML = "EUROSUPER 95 - "+ get_price(12) + "kn/l"

        let option2 = document.createElement('option')
        option2.value = get_price(777)
        option2.innerHTML = "EUROSUPER 95 CLASS PLUS - " +get_price(777) + "kn/l"

        let option3 = document.createElement('option')
        option3.value = get_price(15)
        option3.innerHTML = "EURODIZEL - "+get_price(15) + "kn/l"

        let option4 = document.createElement('option')
        option4.value = get_price(778)
        option4.innerHTML = "EURODIZEL CLASS PLUS - " +get_price(778) + "kn/l"

        let option5 = document.createElement('option')
        option5.value = get_price(16)
        option5.innerHTML = "AUTOPLIN - " +get_price(16) + "kn/l"



        div.appendChild(selectorDiv)
        div.appendChild(potrosnjaDiv)
        selectorDiv.appendChild(gorivo1Div)
        potrosnjaDiv.appendChild(potrosnjaLabel)
        potrosnjaDiv.appendChild(potrosnja)
        gorivo1Div.appendChild(gorivoOptionsLabel)
        gorivo1Div.appendChild(gorivoOptions)
        gorivoOptions.appendChild(option1)
        gorivoOptions.appendChild(option2)
        gorivoOptions.appendChild(option3)
        gorivoOptions.appendChild(option4)
        gorivoOptions.appendChild(option5)

        elements = true





        console.log(div)

        //div.appendChild(input)

        // your code here
    }



    async function get_new(){

        var ab = await fetch("https://webservis.mzoe-gor.hr/api/cjenici-postaja/171")
        console.log("called again")
        console.log(ab)

        var gg = await ab.json()

        return gg

    }

    async function get(){
        let gelp = await get_new()
        console.log("TEST",gelp)


        let id= [12,777,15,778,16]
        id.forEach(d => {
            let idPrice = 0
            gelp.forEach(e => {
                if (e.gorivo_id == d) {idPrice = e.cijena}

            })
            console.log(idPrice)
        })

        return gelp

    }

    function get_price(id){
        let idPrice = 0
        price.forEach(e => {
            if (e.gorivo_id == id) {idPrice = e.cijena}

        })
        console.log(idPrice)

        return idPrice
    }

    function selected_price(){
        var select = document.getElementById('GorivoTip');
        var value = select.options[select.selectedIndex].value;

        return value
    }


    function calculate(){
        let km = document.querySelectorAll('.XdKEzd')
        km.forEach((e,i) => {
            let cleanKM = e.querySelector('.ivN21e.tUEI8e div').innerText.replace(" km","")
            let pricediv = document.createElement('div')
            pricediv.className = 'priceG'
            let potrosnja = (100 / parseFloat(document.getElementById('potrosnja').value.replace(/\,/g, '.'))).toFixed(2)

            console.log(selected_price(), (cleanKM / potrosnja), (cleanKM / potrosnja)*selected_price())
            let final = ((cleanKM / potrosnja)*selected_price()).toFixed(2) + " kn"
            pricediv.innerHTML = final

            let check = e.querySelector('.priceG')
            if (check){
                check.innerHTML = final
            }else{
            km[i].appendChild(pricediv)
            }
        })

    }

    setInterval(function () {
        //console.log(document.readyState, price.length,rdy,price.lenght < 0,document.readyState === 'complete')
        if (document.readyState === 'complete' && price.length >= 0){
            rdy = true

            let find = document.getElementsByClassName('mainGorivo')
            console.log(find)
            if (!elements || find.length <= 0){
                createEl()
            }
            if(document.getElementById('potrosnja').value && document.getElementsByClassName('XdKEzd').length >= 1){
                calculate()
            }

        }
    },1000)



})();