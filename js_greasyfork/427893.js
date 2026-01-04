// ==UserScript==
// @name         Hide Google Meet bottom bar
// @namespace    https://alessandro-antonelli.github.io/
// @version      1.0
// @description  Adds a button to Google Meet's user interface, which lets you hide the bottom bar
// @author       Alessandro Antonelli
// @match        https://meet.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427893/Hide%20Google%20Meet%20bottom%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/427893/Hide%20Google%20Meet%20bottom%20bar.meta.js
// ==/UserScript==

var BarraVisualizzata = true;

var barra = null;
const SelBarra = "#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.rG0ybd";
const SelPadreBarra = "#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb";

var StaPresentando = null;
const SelStaPresentando = "#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.pHsCke";
const SelPadreStaPresentando = "#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb";
const SelPresentazione = "#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.pHsCke > div.kjtROb > div.cIM7d > div";

const SimboloChiudi = '🔻';
const FraseChiudi = 'Hide bottom bar';
const SimboloApri = '🔺';
const FraseApri = 'Show bottom bar';

function Toggle()
{
    var bottone = document.getElementById('BottoneToggleBarraSotto');
    if(barra == null) { alert('[Hide Google Meet bottom bar] Cannot find bottom bar! :('); return; }
    if(StaPresentando == null) { alert('[Hide Google Meet bottom bar] Cannot find "now presenting" bar! :('); return; }
    if(bottone == null) { alert('[Hide Google Meet bottom bar] Cannot find button! :('); return; }

    if(BarraVisualizzata == true)
    {
        barra.remove();
        if(document.querySelector(SelPresentazione) != null) StaPresentando.remove();
        BarraVisualizzata = false;
        bottone.innerHTML = SimboloApri;
        bottone.title = FraseApri;
    }
    else if(BarraVisualizzata == false)
    {
        var PadreBarra = document.querySelector(SelPadreBarra);
        if(PadreBarra == null) alert('[Hide Google Meet bottom bar] Cannot find parent of bottom bar! :(');
        else
        {
            PadreBarra.appendChild(barra);
            BarraVisualizzata = true;
            bottone.innerHTML = SimboloChiudi;
            bottone.title = FraseChiudi;

            if(document.querySelector(SelStaPresentando) == null)
            {
                StaPresentando.querySelector('div.kjtROb > div.cIM7d > div:nth-child(1)').remove();
                var PadreStaPresentando = document.querySelector(SelPadreStaPresentando);
                if(PadreStaPresentando == null) alert('[Hide Google Meet bottom bar] Cannot find parent of "now presenting" bar! :(');
                else PadreStaPresentando.appendChild(StaPresentando);
            }
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function()
 {
    'use strict';

    while(true)
    {
        // Se non c'è il bottone, lo creo e lo inserisco
        if(document.getElementById('BottoneToggleBarraSotto') == null)
        {
            var NuovoBottone = document.createElement('button');
            NuovoBottone.id = 'BottoneToggleBarraSotto';
            NuovoBottone.addEventListener('click', Toggle);
            NuovoBottone.title = 'Show/Hide bottom bar';
            NuovoBottone.style.position = 'relative';
            NuovoBottone.style.top = '0px';
            NuovoBottone.style.left = '0px';
            NuovoBottone.style.zIndex = '10';
            NuovoBottone.style.backgroundColor = 'grey';
            document.body.appendChild(NuovoBottone);
        }

        var bottone = document.getElementById('BottoneToggleBarraSotto');

        // Se la barra non è stata identificata, la trovo e la salvo in una variabile
        if(barra == null)
        {
            barra = document.querySelector(SelBarra);
            if(bottone != null)
            {
                if(barra == null) bottone.style.display = 'none';
                else
                {
                    bottone.style.display = 'inline-block';
                    bottone.innerHTML = (BarraVisualizzata ? SimboloChiudi : SimboloApri);
                    bottone.title = (BarraVisualizzata ? FraseChiudi : FraseApri);
                }
            }
        }
        if(StaPresentando == null) StaPresentando = document.querySelector(SelStaPresentando);

        // Se ho inserito il bottone e identificato le barre, esco dal ciclo
        if(bottone != null && barra != null && StaPresentando != null) break;

        await sleep(5000);
    }
})();