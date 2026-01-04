// ==UserScript==
// @name         DROP_OFF Tracker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Cyklicznie sprawdza DROP_OFF GA SLAMy w poszukiwaniu paczek na najbliższe CPT
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&dropoff
// @match        https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&dropoff
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449383/DROP_OFF%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/449383/DROP_OFF%20Tracker.meta.js
// ==/UserScript==

var tablica = [['a0bcce61-32f8-bf5c-01be-f33089a980e9','DROP_OFF GA SLAM 1'],
               ['3abcce61-4340-f18a-4b1d-a7550e3d1a6d','DROP_OFF GA SLAM 2'],
               ['c2bcce61-4d07-ce8c-8f29-44019a54f3bd','DROP_OFF GA SLAM 3'],
               ['f8bcce61-5775-12a8-908b-7f90e4053a5f','DROP_OFF GA SLAM 4'],
               ['eabcce61-5f7e-1c42-6187-30286a454d86','DROP_OFF GA SLAM 5'],
               ['8cbcce61-6ad1-da70-34a7-b0679ac0cbbb','DROP_OFF GA SLAM 6'],
               ['cebcce61-7371-d540-b7e7-c9b315c9413c','DROP_OFF GA SLAM 7'],
               ['32bcce61-a17b-3fb6-6898-a5f67a492756','DROP_OFF GA SLAM 8'],
               ['26bcce61-ab11-edde-bedd-1b67e666f9d6','DROP_OFF GA SLAM 9'],
               ['dcbcce61-b457-03fb-d6e8-0d6580d5747a','DROP_OFF GA SLAM 10']];

var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

(function() {
    if(document.getElementById("troubleShootTool") != undefined)
    {
        document.getElementById("troubleShootTool").remove();
    }
    else
    {
        document.getElementsByClassName("css-1yjqctv")[0].remove();
    }

    if(document.getElementById("alert-1") != undefined)
    {
        document.getElementById("alert-1").remove();
    }

    var slam_checker = document.createElement ('div');
    slam_checker.innerHTML = '<center><table cellpadding="5"  border="1" id="slam_checker_tabela" style="max-width:100%;white-space:nowrap;"><tbody>' +
        '<tr style="position:sticky;top:0px;background-color:azure;" >' +
        '<td style="padding-inline:5px;" >DROP_OFF</td>' +
        '<td style="padding-inline:5px;" >Paczka</td>' +
        '<td style="padding-inline:5px;" >CPT</td>' +
        '<td style="padding-inline:5px;" >Czas do CPT (min:sec)</td>' +
        '</tr>' +
        '</tbody></table></center>';
    slam_checker.setAttribute ('id', 'slam_checker_div');
    slam_checker.setAttribute ('class', '');
    slam_checker.setAttribute ('style', '');

    if(document.getElementById("pageContent") != undefined)
    {
        document.getElementById("pageContent").appendChild(slam_checker);
    }
    else
    {
        document.getElementsByClassName("css-10omwz")[0].appendChild(slam_checker);
    }

    uzupelnij_tabele();
    sprawdz_dropoff();

    setTimeout(function(){
        location.reload();
    },60000);

})();

function sprawdz_dropoff()
{
    for(var i = 0;i<tablica.length;i++)
    {
        var dropoff_tt = httpGet("https://trans-logistics-eu.amazon.com/sortcenter/tt/contains?containerId=" + (tablica[i][0]) + "&nodeId=KTW1&startIndex=0&forward=true&pageSize=100");

        // jeżeli zawiera paczkę
        if(dropoff_tt.indexOf("Package ") > -1)
        {
            var paczki = dropoff_tt.split("},{");

            // Sortuj paczki po wartości czasu do CPT
            paczki.sort(function(a, b) {
                var cpt_a = getFromBetween.get(a,'cpt":"',' CE');
                var cpt_b = getFromBetween.get(b,'cpt":"',' CE');
                cpt_a = cpt_a[0].replaceAll("-"," ");
                cpt_b = cpt_b[0].replaceAll("-"," ");
                return new Date(cpt_a) - new Date(cpt_b);
            });

            for(var j =0;j<=paczki.length;j++)
            {
                if(paczki[j] != undefined)
                {
                    var package = getFromBetween.get(paczki[j],'resourceLabel":"','","associatedUser');

                    var cpt = getFromBetween.get(paczki[j],'cpt":"',' CE');
                    cpt = cpt[0].replaceAll("-"," ");

                    // Tworzymy nowy obiekt daty na podstawie wartości z zmiennej cpt
                    var date = new Date(cpt);

                    // Pobieramy poszczególne składowe daty i godziny
                    var year = date.getFullYear();
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    var day = ("0" + date.getDate()).slice(-2);
                    var hours = ("0" + date.getHours()).slice(-2);
                    var minutes = ("0" + date.getMinutes()).slice(-2);
                    var seconds = ("0" + date.getSeconds()).slice(-2);

                    // Tworzymy sformatowaną datę i godzinę w formacie 24H
                    var formattedCpt = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

                    var time_to_cpt = new Date(cpt) - Date.now();

                    document.getElementById('paczki_' + (tablica[i][1])).innerHTML += '<a href="https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&setContainerId=' + package[0] + '" >' + package[0] + '</a><br>';
                    document.getElementById('CPT_' + (tablica[i][1])).innerText += formattedCpt + "\r\n";
                    document.getElementById('Czas_do_cpt_' + (tablica[i][1])).innerText += millisToMinutesAndSeconds(time_to_cpt) + "\r\n";
                }
            }
        }
        else
        {

        }
    }
}

function uzupelnij_tabele()
{
    var ile = tablica.length;
    var i = 0;
    var linijka;

    for (i;i<ile;i++) // zmienione i<=ile na i<ile
    {
        if(tablica[i] != undefined)
        {
            linijka = '<td id="' + (tablica[i][1]) + '_id"><a href="https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1&setContainerId=' + (tablica[i][1]) + '" style="padding-right:2em;">' + (tablica[i][1]) + '</a></td>' +
                '<td id="paczki_' + (tablica[i][1]) + '" style="padding-right:2em;"></td>' +
                '<td id="CPT_' + (tablica[i][1]) + '" style="padding-right:2em;"></td>' +
                '<td id="Czas_do_cpt_' + (tablica[i][1]) + '" style="padding-right:2em;"></td>';
            document.getElementById("slam_checker_tabela").children[0].innerHTML = document.getElementById("slam_checker_tabela").children[0].innerHTML + linijka;
        }
    }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

