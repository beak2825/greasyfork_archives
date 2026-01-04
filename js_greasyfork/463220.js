// ==UserScript==
// @name        Formato ZC Duel Links
// @version     1.1.2
// @description Añade un contador de precios para duelinks meta
// @author      @aaontanedac
// @copyright   2023
// @license     MIT
// @namespace   zc
// @homepageURL https://gist.github.com/aaontanedac
// @match       https://www.duellinksmeta.com/*
// @grant       none
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/463220/Formato%20ZC%20Duel%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/463220/Formato%20ZC%20Duel%20Links.meta.js
// ==/UserScript==
(function () {
    "usestric";


    const deck = document.getElementsByClassName('deck-container svelte-z2tetq')[0]
    const info = document.getElementsByClassName('info-container svelte-z2tetq')[0]
    const tooltip = document.getElementById("tooltip-root");
    const zcoins = document.createElement("span");
    var isVisibleZC = false;
    var price_list = {};
    const fixed_prices_url = 'https://raw.githubusercontent.com/aaontanedac/dl-pre/main/fixed_prices.json'

    fetch(fixed_prices_url)
        .then(res => res.json())
        .then(out =>
            price_list = out)
        .catch(err => { throw err });
    //Esta funcion recupera la lista de precios cambiados 

    function addZCtext() {
        let ZCtext = ` <div class="is-flex is-justify-content-flex-start is-align-items-flex-end ">
                        <img src="https://raw.githubusercontent.com/aaontanedac/dl-pre/18f9df71d513018d8639f4d84b3f23921996e354/pngwing.com.png" alt="zefracoins" width=17 height=18 class="mr-2">
                        <span class="is-flex is-justify-content-flex-start is-align-items-flex-end mr-2" id="ZCtext"> 0 </span> 
                    </div>`
        info.insertAdjacentHTML('afterbegin', ZCtext)
    }
    //End of funcion, añade texto de las ZC

    deck.addEventListener("DOMNodeInserted", (e) => {

        if ((e.target.parentNode.outerHTML.includes("card-container") || e.target.parentNode.outerHTML.includes("spinner-border")) &&
            e.target.nodeType == 1) {

            if (!isVisibleZC) {
                isVisibleZC = true;
                addZCtext();
            }

            setTimeout(calcular_valor, 200);
        }
    });
    //End of event, insercion de nodos en el deck

    tooltip.addEventListener("DOMNodeInserted", (e) => {
        if (e.target.parentNode.outerHTML.includes("tooltip-root") && e.target.nodeType == 1) {
            setTimeout(addZCtoTooltip, 200);
        }
    });
    //End of event, insercion de nodos en el tooltip

    function addZCtoTooltip() {
        let ZCtooltip = document.getElementById("ZCtextTooltip");
        if (ZCtooltip == null) {
            try {
                let carta = getProperties(tooltip);
                let valorTooltip = getValorCarta(carta);
                let ZCtext = ` <div class="is-flex is-justify-content-flex-start is-align-items-flex-end ">
                            <img src="https://raw.githubusercontent.com/aaontanedac/dl-pre/18f9df71d513018d8639f4d84b3f23921996e354/pngwing.com.png" alt="zefracoins" width=17 height=18 class="mr-2">
                            <span class="is-flex is-justify-content-flex-start is-align-items-flex-end mr-2" id="ZCtextTooltip"> ${valorTooltip} </span> 
                          </div>`
                let cardspecs = tooltip.getElementsByClassName("how-container")[0];
                cardspecs.insertAdjacentHTML('afterend', ZCtext);
            }
            catch (e) {
                console.log("Probablemente no se ha cargado bien el tooltip todavia")
             }
        }
    }
    //End of function, añade ZCtext al tooltip

    function calcular_valor() {

        let cartas = deck.getElementsByClassName('card svelte-1h71uu4');
        let carta_desc = [];
        let valor = 0;

        for (var carta of cartas) {
            try {
                let carta_info = getProperties(carta);
                carta_desc.push(carta_info)

            } catch (error) { }
        }

        for (var carta of carta_desc) {

            valor += getValorCarta(carta)

        }

        document.getElementById("ZCtext").innerHTML = valor;

    }
    //Enf of function, calcula el valor del deck
    function getValorCarta(carta) {
        let islisted = false;
        for (var carta_fixed of price_list.cartas) {
            if (carta_fixed.codigo == carta.codigo) {
                islisted = true;
                break;
            }
        }

        if (islisted) {
            return carta_fixed.valor;
        } else {
            switch (carta.rareza) {
                case 'N Rarity':
                    return 25;
                case 'R Rarity':
                    return 50;
                case 'SR Rarity':
                    return 100;
                case 'UR Rarity':
                    return 200;
                default:
                    return 0;
            }
        }
    }
    //End of function, obtiene el valor de una carta segun codigo o rareza

    function getProperties(card_element) {

        try {
            let carta_info = {
                'rareza':
                    card_element
                        .getElementsByClassName('rarity-image')[0]
                        .getElementsByTagName('img')[0]
                        .getAttribute('alt'),
                'codigo':
                    card_element
                        .getElementsByClassName('card-img')[0]
                        .getAttribute('alt')
            }

            return carta_info;
        }
        catch (e) {
            return { rareza: "ERROR", codigo: "404" }
        }

    }
    // End of function "calcular_valor"                                                    

})();