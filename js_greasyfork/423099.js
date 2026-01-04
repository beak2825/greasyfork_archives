// ==UserScript==
// @name         ProcessPathStatusChecker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       nowaratn
// @match        https://picking-console.eu.picking.aft.a2z.com/fc/KTW1/process-paths*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423099/ProcessPathStatusChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/423099/ProcessPathStatusChecker.meta.js
// ==/UserScript==

var jakie_sciezki = ["PPMultiMedium","PPSingleMedium","PPMultiXLarge","PPSingleNoSLAM","PPMultiWrap"];
var snd = new Audio('http://soundbible.com/mp3/Police-TheCristi95-214716303.mp3');

setTimeout(function() {

    var status_div = document.createElement ('div');
    status_div.innerHTML = '<div id="tabela_status"></div>';
    status_div.setAttribute ('id', 'status_div');
    status_div.setAttribute ('style', 'display:block;z-style:99999;');
    document.getElementsByClassName("col-12")[0].appendChild(status_div);

    var alert_div = document.createElement ('div');
    alert_div.setAttribute('id', 'alert_div');
    alert_div.innerHTML = '<center><font size="40" color="black"><div id="alert_tresc"></div></font><br><input type="button" id="alert_ok" value="OK" style="font-size:40px;">';
    alert_div.setAttribute('style', 'display:none;position:absolute;z-index:9999;');
    document.getElementsByClassName("col-12")[0].appendChild(alert_div);

    document.getElementById("alert_ok").addEventListener (
        "click", ButtonClick_alert_ok, false
    );

    function ButtonClick_alert_ok (zEvent)
    {
        document.getElementById("alert_div").style = "display:none;"
        snd.pause();
    }

    var ile_sciezek = document.getElementsByTagName("tr").length;
    var i,j,k;
    var sciezka;
    var status;
    var status_col;
    var alarm = false;
    var kolumny;

    kolumny = document.getElementsByTagName("tr")[0];
    for(k=0;k<5;k++)
    {
        if(kolumny.children[k].innerText == "Status")
        {
            status_col = k;
            console.log(status_col);
            break
        }
    }
    if(status_col == undefined || status_col == null)
    {
         alert("Za pomocą ustawień strony włącz wyświetlanie statusu ścieżek, aby skrypt działał prawidłowo, i odśwież stronę.");
    }

    for(j=0;j<jakie_sciezki.length;j++)
    {
        for(i=1;i<ile_sciezek;i++)
        {
            sciezka = document.getElementsByTagName("tr")[i];

            if(sciezka != undefined && sciezka.children[0] != undefined)
            {
                if(sciezka.children[0].innerText == jakie_sciezki[j])
                {
                    status = sciezka.children[status_col].innerText;
                }
            }
        }

        if(status != undefined)
        {
            if(status == "Active")
                status = '<font color = "green"><b> ACTIVE</b></font><br>';
            else
            {
                status = '<font color = "red"><b> PAUSED</b></font><br>';
                alarm = true;
            }

            document.getElementById("tabela_status").innerHTML += jakie_sciezki[j] + status;

            if(alarm == true)
            {
                document.getElementById("alert_tresc").innerText = 'Jedna z ważnych ścieżek jest wstrzymana!';
                document.getElementById("alert_div").setAttribute('style', 'background-color:red;display:block;position:absolute;z-index:9999;top:40%;left:20%;padding:50px;')
                snd.play();
            }
        }
    }

},8000);