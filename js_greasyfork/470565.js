// ==UserScript==
// @name         preços steam
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  calcula os preços da steam da Argentina e Turquia ja incluindo o IOF (valor do IOF pode ser facilmente editado.)
// @author       viniciuz
// @match        https://store.steampowered.com/app/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470565/pre%C3%A7os%20steam.user.js
// @updateURL https://update.greasyfork.org/scripts/470565/pre%C3%A7os%20steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.ajaxSetup({
        async: false
    });

    function get_price(cc, id){
        return $.getJSON(`https://store.steampowered.com/api/appdetails/?appids=${id}&cc=${cc}&filters=price_overview`).responseJSON[id].data.price_overview.final;
    }

    function parse( value, dp ){
        return +parseFloat(value).toFixed( dp );
    }

    function cambio(){
        return $.getJSON('https://economia.awesomeapi.com.br/json/last/ARS-BRL').responseJSON.ARSBRL.ask;
    }

    const appid = parseInt(window.location.href.match(/\/app\/(\d+)\//)[1])

    const cambio_ar = parseFloat(cambio());
    const iof = 5.38 / 100;

    var price_ar = (get_price('AR', appid) * cambio_ar) / 100;

    var final_ar = (iof * price_ar) + price_ar;


    var div = document.createElement('div');
    div.innerHTML = `<h1>preço com IOF<h1>
                     <img src='https://flagicons.lipis.dev/flags/4x3/ar.svg' width='20px'>: <span style="font-size: 1em">R$${parse(final_ar, 2)}</span>`;

    div.style.cssText = "background-color: #3e4e5b; position: fixed; bottom: 25px; right: 25px; padding: 15px; box-shadow: 2px 3px #000; border-radius: 5px;"

    document.body.appendChild(div);

})();