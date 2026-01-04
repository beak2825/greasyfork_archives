// ==UserScript==
// @name         OFT Risk Alert
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       NOWARATN
// @match        https://outboundflow-dub.amazon.com/KTW1/fcriskevaluator*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/389518/OFT%20Risk%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/389518/OFT%20Risk%20Alert.meta.js
// ==/UserScript==

// Zmienne
GM_config.init(
{
    'id': 'OFT_Risk',
    'title': 'OFT Risk Alert',
    'fields':
    {
        'CZAS':
        {
            'type': 'text',
        },
        'Godzina_alertu':
        {
            'type': 'text',
        },
        'Pauza':
        {
            'type': 'text',
        }
    }
});

var procenty;
var risk;
var floatRisk;
var odswiez;
var i;
var gm_czas;
var snd = new Audio('http://soundbible.com/mp3/BOMB_SIREN-BOMB_SIREN-247265934.mp3');
var ile_ryzyka = 0;
////////////


// Uruchamiamy po całkowitym wczytaniu się strony
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        // Zbieramy dane procentowe do jednej zmiennej
        procenty = document.getElementsByClassName("risk-data-row row-cumulative-risk-new-drops")[0];

        // Sprawdzamy po kolei każde CPT
        for (i=3;i<procenty.children.length;i++)
        {
            // Jeżeli nie jest szare (przed picking SLA)
            if(procenty.children[i].style.opacity == "")
            {
                risk = procenty.children[i].innerText;
                risk = risk.substring(0, risk.length - 2); // Usuwamy znak procenta aby uzyskać jedynie wartość liczbową

                // Wartość tekstową zamieniamy na liczbową
                floatRisk = parseFloat(risk);

                // Jeżeli ryzyko na któreś CPT jest większe niż...
                if(floatRisk > 85)
                {
                    ile_ryzyka++;
                    var godzina_alertu = GM_config.get('Godzina_alertu');
                    var pauza = GM_config.get('Pauza');
                    var godzina_alertu_nowa;
                    var teraz;

                    godzina_alertu = parseFloat(godzina_alertu);
                    pauza = parseFloat(pauza);
                    godzina_alertu_nowa = godzina_alertu + pauza;
                    teraz = Math.floor(Date.now() / 1000);
                    teraz = parseFloat(teraz);

                    console.log(godzina_alertu_nowa);
                    console.log(pauza);
                    console.log(teraz);

                    if((godzina_alertu_nowa < teraz) || GM_config.get('Godzina_alertu') == "")
                    {
                        var Godzina_CPT =  procenty.children[4].offsetParent.children[0].children[0].children[i].innerText;
                        window.focus();
                        snd.play();
                        var ans = confirm("RYZYKO NA CPT \n" + Godzina_CPT + " \n\n" + floatRisk + "%");

                        if (ans == true)
                        {
                            snd.pause();
                            GM_config.set('Godzina_alertu', Math.floor(Date.now() / 1000));
                            GM_config.set('Pauza', '300');
                            GM_config.save();
                        }
                        else
                        {
                            snd.pause();
                            GM_config.set('Godzina_alertu', Math.floor(Date.now() / 1000));
                            GM_config.set('Pauza', '900');
                            GM_config.save();
                        }
                    }
                }
            }
        }

        if(ile_ryzyka == 0)
        {
            GM_config.set('Godzina_alertu', '');
            GM_config.set('Pauza', '');
            GM_config.save();
        }

        /////////////////////////////////////
        // Dodanie pola tekstowego na czas, co ile ma odświeżać się strona
        var pole_tekstowe = document.createElement ('div');
        pole_tekstowe.innerHTML = '<input type="text" id="odswiezanie" value="60" style="width:2em;height:1em;" title="Odświeżaj co X sekund."> s.</input>'; /////// tekst w guziku
        pole_tekstowe.style = "display:inline;";
        document.getElementById("choose_language").appendChild(pole_tekstowe);
        pole_tekstowe.addEventListener("keyup", function(event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        var temp = document.getElementById("odswiezanie").value;
                        GM_config.set('CZAS', temp);
                        GM_config.save();}
                    });

        ///////////////////////////////////////////
        // Czyszczenie wszelkich zmiennych skryptu
        var czyszczenie = document.createElement ('div');
        czyszczenie.innerHTML = '<input type="button" id="czyszczenie" title="Wyczyść wszelkie dane skryptu, gdyby nie działał prawidłowo." value="reset" style="float:right;"></input>'; /////// tekst w guziku
        document.getElementById("choose_language").appendChild(czyszczenie);
        czyszczenie.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                GM_config.set('Godzina_alertu', '');
                GM_config.set('Pauza', '');
                GM_config.set('CZAS', '');
                GM_config.save();}
        });


        // Ustawienie odswiezania co wybrany czas
        gm_czas = GM_config.get('CZAS');

//         GM_config.set('Godzina_alertu', '');
//         GM_config.set('Pauza', '');
//         GM_config.save();

        console.log("Godzina alertu: " + GM_config.get('Godzina_alertu'));
        console.log("CZAS: " + GM_config.get('Pauza'));
        console.log("Teraz: " + teraz);

        // Jeżeli nie mamy zapisanego wcześniej czasu odświeżania, użyjemy domyślnego (60 s.)
        if(gm_czas == "" || gm_czas == null)
        {
            odswiez = document.getElementById("odswiezanie").value;
            odswiez = odswiez * 1000;
        }
        else
        {
            odswiez = gm_czas * 1000;
            document.getElementById("odswiezanie").value = gm_czas;
        }

        setTimeout(function(){
            var temp = document.getElementById("odswiezanie").value;
            GM_config.set('CZAS', temp);
            GM_config.save();

            document.getElementsByClassName("btn btn-primary btn-large")[0].click();
        }, odswiez);
    }
}, 10);