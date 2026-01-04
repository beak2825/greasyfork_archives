// ==UserScript==
// @name         PalletTrackerSuperDuperCheckerShmecker
// @namespace    http://tampermonkey.net/
// @version      3
// @description  blah blah blah
// @author       NOWARATN
// @match        https://pallettracker.aka.amazon.com/ob*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390249/PalletTrackerSuperDuperCheckerShmecker.user.js
// @updateURL https://update.greasyfork.org/scripts/390249/PalletTrackerSuperDuperCheckerShmecker.meta.js
// ==/UserScript==

var tablica = [];

tablica = [
["KTW1->LH-FRAX","light"],
["KTW1->EFN-NUE9","light"],
["KTW1->AIR-KTWA-EDDK","euro"],
["KTW1->AIR-LEJA-EMSA","light"],
["KTW1->AIR-LEJA-MADB","light"],
["KTW1->AIR-LEJA-MXPA","light"],
["KTW1->AIR-LEJA-PARA","light"],
["KTW1->AMZL-DVI1","light"],
["KTW1->AMZL_DBE1","light"],
["KTW1->AMZL_DBE2","light"],
["KTW1->ATPOST-Allhaming-Direct","light"],
["KTW1->ATPOST-Kalsdorf-Direct","light"],
["KTW1->ATPOST-Wien-South","light"],
["KTW1->ATPOST-Wien-South-Direct","light"],
["KTW1->DEPOST-CHEMNITZ","light"],
["KTW1->DHL-Dresden-SameDay","light"],
["KTW1->DHLPAKET-BOERNICK-DI","light"],
["KTW1->DHLPAKET-NEUMARK-DI","light"],
["KTW1->DHLPAKET-NEUSTREL-DI","light"],
["KTW1->DHLPAKET-NOHRA-DI","light"],
["KTW1->DHLPAKET-OSTERWED-DI","light"],
["KTW1->DHLPAKET-OTTENDOR-ALL","light"],
["KTW1->DHLPAKET-OTTENDOR-DI","light"],
["KTW1->DHLPAKET-RADEFELD-DI","light"],
["KTW1->DHLPAKET-RUEDERSD-DI","light"],
["KTW1->DHL_INTL_EXPRESS_KTW_PL","light"],
["KTW1->DHL_PL","light"],
["KTW1->EFN-HAJ8","light"],
["KTW1->HermesPaket-Ketzin","light"],
["KTW1->PL-POST-ZABRZE","light"],
["KTW1->UPS-INT","light"],
["KTW1->XNLA","euro"],
["KTW1->PRG2","euro"],
["KTW1->WRO2","euro"],
["KTW1->POZ1","euro"],
["KTW1->FRA3","euro"]
]

var linijka;

var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        var pallet_div = document.createElement ('div');
        pallet_div.innerHTML = '<input type="button" id="pallet_button" value="Uzupelnij">';
        pallet_div.setAttribute('id', 'pallet_button_div');
        pallet_div.setAttribute('style', 'display:inline;');
        document.getElementsByClassName("dt-buttons")[0].appendChild(pallet_div);

        document.getElementById("pallet_button").addEventListener (
            "click", ButtonClick_pallet, false
        );
    }}, 10);



function ButtonClick_pallet (zEvent)
{
    linijka = document.getElementsByTagName("tr");
    console.log(linijka[10]);

    var i = 10;
    var refreshIntervalId = setInterval(function()
                                        {
        if(i == linijka.length)
        {
            clearInterval(refreshIntervalId);
        }

        var temp = SprawdzKierunek(linijka[i].children[2].innerText);

        if(linijka[i].attributes.style == null && linijka[i].children[4].innerText == "COMPLETED" || linijka[i].children[4].innerText == "FINISHED_LOADING")
        {
            if(temp == "euro")
            {
                linijka[i].children[5].children[2].children[0].click();
            }
            else if(temp == "light")
            {
                linijka[i].children[5].children[2].children[4].click();
            }
        }
        i++;
    },1000);
}

function SprawdzKierunek(trasa)
{
    for(var x = 0;x<tablica.length;x++)
    {
        console.log(trasa);
        var temp2 = tablica[x][0];
        var temp3 = tablica[x][1];
        if(trasa == temp2)
        {
         return temp3;
        }
    }
}

