// ==UserScript==
// @name         Capacity_TSO_WTM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  capacity_tso
// @author       NOWARATN
// @match        https://cip.corp.amazon.com/wasted-trucks-monitoring
// @match        https://hooks.chime.aws
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/449386/Capacity_TSO_WTM.user.js
// @updateURL https://update.greasyfork.org/scripts/449386/Capacity_TSO_WTM.meta.js
// ==/UserScript==

GM_config.init(
    {
        'id': 'WTM',
        'title': 'WTM',
        'fields':
        {
            'Czy_alert':
            {
                'label': 'czy alert',
                'type': 'checkbox',
                'title': '',
                'default': false
            },
            'Wiadomosc':
            {
                'label': 'jaka wiadomosc',
                'type': 'text',
                'title': '',
                'default': ''
            },
             'chime_webhook':
            {
                'label': 'jaki webhook',
                'type': 'text',
                'title': '',
                'default': ''
            },
            'stare_dane':
            {
                'label': 'stare dane',
                'type': 'text',
                'title': '',
                'default': ''
            }
        }
    });

// Taskmaster 2 wiki test webhook
// https://hooks.chime.aws/incomingwebhooks/2a90138f-1bec-497a-b38c-307dd910fbde?token=bWRORmNJaWd8MXw3eWoxNDRFWktFbVlrX1VCNm1VMjRwOExBR1ZYRGQ4dXFZbW9PQURFMEhz

setTimeout(function() {

    if(window.location.href.indexOf("https://cip.corp.amazon.com/wasted-trucks-monitoring") > -1)
    {
        // INFOBOX
        var infobox = document.createElement ('div');
        infobox.innerHTML = '<div id="infobox_divheader" style="border-style:solid !important;cursor:move;background-color:greenyellow;">' +
            '<iframe style="" id="infobox_chime" src="https://hooks.chime.aws" ></iframe>' +
           // '<iframe style="width:500px;" id="infobox_RODEO" src="https://tiny.amazon.com/1blmfn3uw/rodeamazKTW1ExSD" ></iframe>' +
          //  '<iframe style="width:500px;" id="infobox_RODEO" src="https://trans-logistics-eu.amazon.com/fmc/excel/execution/2jdAt?view=vrs" ></iframe>' +
            '</div>';
        infobox.setAttribute ('id', 'infobox_div');
        infobox.setAttribute ('style', 'position:fixed;');
        document.getElementsByTagName("body")[0].appendChild(infobox);


        var wiadomosc = "";
        console.log("loaded1");

        if(document.getElementsByTagName("tr")[3].children[14] == undefined)
        {
            setTimeout(function() {
                 if(document.getElementsByTagName("tr")[3].children[14] == undefined)
                 {
                     console.log("still error");
                 }
            },10000);
        }
        else
        {
            var data = new Date();
            var godzina = data.getHours();
            var minuta = data.getMinutes();

            var wiadomosc_q1 = false;
            var wiadomosc_q2 = false;
            var wiadomosc_q3 = false;
            var wiadomosc_q4 = false;

            var aktualizacja;

            var ile_linijek;
            ile_linijek = document.getElementsByTagName("tr").length;

            var i;
            var min;

            var stare_dane = "";

            aktualizacja = document.getElementsByClassName("jss41 jss43 jss42")[0].children[2].innerText;


            if(sessionStorage.getItem("First_run") != "true")
            {
                wiadomosc = "/md\r\n|Start of Shift Summary Report|\r\n|---|\r\n|*Updated: " + aktualizacja + "*|\r\n";
                wiadomosc += "|**Route**|**CPT**|**MIN Detail**|**MIN Changes**|**Details**|**Status**|**Trucks**|\r\n";

                for (i=3;i<ile_linijek;i++)
                {
                   //  min = document.getElementsByTagName("tr")[i].children[14].innerText + " -> " + document.getElementsByTagName("tr")[i].children[13].innerText + " / " + document.getElementsByTagName("tr")[i].children[12].innerText;

                    if(document.getElementsByTagName("tr")[i].children[2] != undefined)
                    {
                        wiadomosc += "|" + document.getElementsByTagName("tr")[i].children[2].innerText + "|" + document.getElementsByTagName("tr")[i].children[0].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[14].innerText + "|" + document.getElementsByTagName("tr")[i].children[13].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[12].innerText + "|" + document.getElementsByTagName("tr")[i].children[11].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[8].innerText + "|\r\n";

                        stare_dane += document.getElementsByTagName("tr")[i].children[2].innerText + "|" + document.getElementsByTagName("tr")[i].children[0].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[14].innerText + "|" + document.getElementsByTagName("tr")[i].children[13].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[8].innerText + ";";
                    }
                }

                GM_config.set('stare_dane', stare_dane);
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("First_run","true");
            }
            else
            {
                wiadomosc = "/md\r\n|*Updated: " + aktualizacja + "*|\r\n";
                wiadomosc += "|---|\r\n";
                wiadomosc += "|**Route**|**CPT**|**MIN Detail**|**MIN Changes**|**Details**|**Status**|**Trucks**|\r\n";

                for (i=3;i<ile_linijek;i++)
                {
                   // min = document.getElementsByTagName("tr")[i].children[14].innerText + " -> " + document.getElementsByTagName("tr")[i].children[13].innerText + " / " + document.getElementsByTagName("tr")[i].children[12].innerText;

                    if(document.getElementsByTagName("tr")[i].children[2] != undefined)
                    {
                        wiadomosc += "|" + document.getElementsByTagName("tr")[i].children[2].innerText + "|" + document.getElementsByTagName("tr")[i].children[0].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[14].innerText + "|" + document.getElementsByTagName("tr")[i].children[13].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[12].innerText + "|" + document.getElementsByTagName("tr")[i].children[11].innerText + "|" +
                            document.getElementsByTagName("tr")[i].children[8].innerText + "|\r\n";
                    }
                }
            }



            console.log(wiadomosc);



            // nocne flow
            if(sessionStorage.getItem("wiadomosc_q1") != "true" && godzina == 20 && minuta >= 15)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q1","true");
            }

            if(sessionStorage.getItem("wiadomosc_q2") != "true" && godzina == 23 && minuta >= 15)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q2","true");
            }

            if(sessionStorage.getItem("wiadomosc_q3") != "true" && godzina == 2 && minuta >= 15)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q3","true");
            }

            if(sessionStorage.getItem("wiadomosc_q4") != "true" && godzina == 4 && minuta >= 25)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q4","true");
            }

            // dzienne flow
            if(sessionStorage.getItem("wiadomosc_q1") != "true" && godzina == 8 && minuta >= 45)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q1","true");
            }

            if(sessionStorage.getItem("wiadomosc_q2") != "true" && godzina == 11 && minuta >= 15)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q2","true");
            }

            if(sessionStorage.getItem("wiadomosc_q3") != "true" && godzina == 14 && minuta >= 15)
            {
                GM_config.set('Czy_alert', true);
                GM_config.set('Wiadomosc', wiadomosc);
                GM_config.save();
                sessionStorage.setItem("wiadomosc_q3","true");
            }


            sessionStorage.setItem("First_run","true");
        }
    }



    // dla iFrame na Chime
    if(window.location.href.indexOf("https://hooks.chime.aws") > -1)
    {
        var webhook = GM_config.get('chime_webhook');
        if(webhook != "" && webhook != undefined)
        {
            // Iframe JS
            var guzior = document.createElement ('div');
            guzior.innerHTML = '<input type="button" id="guzior_id" value="guzik"></input>';

            document.getElementsByTagName("body")[0].appendChild(guzior);

            document.getElementById ("guzior_id").addEventListener (
                "click", guzior_event, false
            );

            function guzior_event (zEvent)
            {
                var xhr = new XMLHttpRequest();
                var url = "https://hooks.chime.aws/incomingwebhooks/1e3cc09d-0bd6-4578-8ec2-8a89ee8ffe13?token=YkNjMkZLSUt8MXxGazFzcExkQmgwemhDOTdqNi1CY0o4YXNDZzVLMlY4Zk44cW01QVhWWkhZ";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/JSON");
                var data = JSON.stringify({"Content": wiadomosc});
                xhr.send(data);
            }

            var interval_chime = setInterval(function(){
                if(GM_config.get('Czy_alert') == true)
                {
                    wiadomosc = GM_config.get('Wiadomosc');

                    GM_config.set('Czy_alert', false);
                    GM_config.set('Wiadomosc', "");
                    GM_config.save();

                    document.getElementById ("guzior_id").click();
                    clearInterval(interval_chime);
                }
            },10000);
        }
    }


    var interval_site = setInterval(function(){
      //  document.getElementsByClassName("jss87 jss81")[0].click();
        window.location.reload();
    },180000); //3 min

    wiadomosc = "";
},10000);
