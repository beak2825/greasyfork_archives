// ==UserScript==
// @name     Sprawdzenie DHL-i
// @description     Sprawdzanie ilości paczek na puszkach
// @author   NOWARATN
// @version  1.3
// @grant    none
// @include  https://trans-logistics-eu.amazon.com/ssp/dock/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/206502
// @downloadURL https://update.greasyfork.org/scripts/371411/Sprawdzenie%20DHL-i.user.js
// @updateURL https://update.greasyfork.org/scripts/371411/Sprawdzenie%20DHL-i.meta.js
// ==/UserScript==

var paczki = 2800;
var ile1 = 1;
var i = 0;
var ok = true;
var otten_liczba_int = 0;
var snd = new Audio('http://soundbible.com/mp3/BOMB_SIREN-BOMB_SIREN-247265934.mp3');


// Okienko na ilości paczek
var zNode2 = document.createElement('div');
zNode2.innerHTML = '<textarea id="myTextarea" rows="3" cols="55" style="position:fixed;z-index:9999;left:63%;top:1%;width:330px;overflow:hidden;border:1px solid black;">'+Date()+'</textarea>';
document.getElementById("topPaneContent").appendChild(zNode2);

// Checkbox na pauze
var checkbox = document.createElement('div');
checkbox.innerHTML = '<input type="checkbox" name="vehicle" id="sprotten" value="Bike" title="Pauza informowania o przeładowaniu (awaryjne info przy >2930)" style="position:fixed;z-index:9999;left:80%;top:2%;"></input>';
document.getElementById("topPaneContent").appendChild(checkbox);
var tablica = [];

setInterval(function()
{
tablica = [];
var str = document.body.innerHTML;
var fragment = str.split("<div class=\"progressbar");

var d = new Date(); // for now

for (i = 0; i < fragment.length; i++)
{
    if((fragment[i].includes("DHLPAKET-") || fragment[i].includes("DPAT-") ) && fragment[i].includes("Loading In Progress"))
    {
        // </a></div></td><td><div id="loadedCCell_d6602e3d-5ea1-47ad-ae2b-335d4d8ac1da" class="loadedCCell"><a data-planid="d6602e3d-5ea1-47ad-ae2b-335d4d8ac1da" data-vrid="1141PV5KC"
        // data-loadgroupid="4715dac3-0137-4665-8de0-11bf78fffed8" data-sat="19-Jun-18 15:30" data-status="ARRIVED" data-location="OB151" data-trailerid="YTT113059833" href="javascript:void(0)" class="containerHierarchy trailerCount">
        var otten_liczba = fragment[i].substring(fragment[i].indexOf("containerHierarchy\">")+20,fragment[i].indexOf('</a></div></td><td>'));

        try {
            var test = fragment[i].match(/>\d{1,4}</);
            test[0] = test[0].replace("<","").replace(">","");
            otten_liczba_int = parseInt(test[0]);
        }
        catch(err) {
            otten_liczba_int = 0;
        }

        ile1 = otten_liczba_int;
        tablica[i] = otten_liczba_int;
        if(otten_liczba_int >= paczki)
        {
            if(document.getElementById('sprotten').checked == false)
            {
                snd.play();
                window.focus();
                var ans = confirm(otten_liczba_int+' paczek na kierunek DHL.');

                if (ans == true)
                {
                    snd.pause();
                }
                else
                {
                    return false;
                }
            }

            if(otten_liczba_int >= 2930)
            {
                snd.play();
                window.focus();
                var ans2 = confirm(otten_liczba_int+' paczek na kierunek DHL.');
                if (ans2 == true)
                {
                    snd.pause();
                }
                else
                {
                    return false;
                }
            }
        }
    }
}

tablica = tablica.filter(Boolean);
document.getElementById("myTextarea").value = d.getHours()+":"+addZero(d.getMinutes())+":"+addZero(d.getSeconds()) + "\n" + tablica.join(" | ");
}, 20000);

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
