// ==UserScript==
// @name         2-min GTDR Verifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sprawdzanie danego okresu czasu pod względem klikania GTDR zgodnie z procesem
// @author       @nowaratn
// @match        https://www.amazonlogistics.eu/gtdr/dashboard/history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazonlogistics.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492805/2-min%20GTDR%20Verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/492805/2-min%20GTDR%20Verifier.meta.js
// ==/UserScript==

var tablica_bramy = ["DD101","DD102","DD103","DD104","DD105","DD108","DD109","DD110","DD111","DD112","DD116","DD117","DD118","DD119","DD120","DD121","DD122","DD123","DD124","DD125","DD126","DD127","DD128","DD129","DD135","DD136","DD137","DD132","DD133","DD134","DD138","DD139","DD140","DD141","DD143","DD144","DD145","DD146","DD147","DD148","DD149","DD150","DD151","DD152","DD153","DD154","DD155","DD156","DD157","DD158","DD159","DD160","DD161","DD162","DD163","DD164"];
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

    var marshall_tracker_2min = document.createElement ('div');
    marshall_tracker_2min.innerHTML = '<input type="button" id="2min_tracker_button" value="2-min Tracker" style=""/>';
    marshall_tracker_2min.setAttribute ('id', '2min_marshall_tracker_set');
    marshall_tracker_2min.setAttribute ('class', '');
    marshall_tracker_2min.setAttribute ('style', 'display:flex;');
    document.getElementsByClassName("css-1tjbqgb")[0].appendChild(marshall_tracker_2min);

    document.getElementById ("2min_tracker_button").addEventListener (
        "click", tracker_set_2min, false
    );

    marshall_tracker_2min = null;

})();

function tracker_set_2min()
{
    document.getElementsByClassName("css-fddilk")[1].style.display = "none";
    document.getElementById("2min_tracker_button").style.backgroundColor = "chartreuse";

    var marshall_tracker_2min = document.createElement ('div');
    marshall_tracker_2min.innerHTML = '<div id="2min_tracker_menu" style="border:solid;border-color:black;margin:20px;padding:20px;">' +
        '<div id="2min_tracker_data_div_left" style="float:left;margin-right:20px;">Data od: <br>' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_od_dd" minlength="2" maxlength="2" size="2" placeholder="dd"  value=""  >/' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_od_mm" minlength="2" maxlength="2" size="2" placeholder="mm"  value=""  >/' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_od_yy" minlength="4" maxlength="4" size="4" placeholder="yyyy"  value=""  >' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_od_hh" minlength="2" maxlength="2" size="2" placeholder="hh" style="display:flex"   value=""  >' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_od_min" minlength="2" maxlength="2" size="2" placeholder="min"   value=""  >' +
        '</div>' +

        '<div id="2min_tracker_data_div_right">Data do: <br>' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_do_dd" minlength="2" maxlength="2" size="2" placeholder="dd"   value=""  >/' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_do_mm" minlength="2" maxlength="2" size="2" placeholder="mm"   value=""  >/' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_do_yy" minlength="4" maxlength="4" size="4" placeholder="yyyy"   value=""  >' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_do_hh" minlength="2" maxlength="2" size="2" placeholder="hh" style="display:flex"   value=""  >' +
        '<input type="text" class="2min_tracker_date" id="2min_tracker_data_do_min" minlength="2" maxlength="2" size="2" placeholder="min"   value=""  >' +
        '</div><br>' +

        '<div><input type="button" value="Sprawdź" id="2min_tracker_run" /><img id="2min_loading_gif" style="height:16px;"/></div>' +

        '</div>' +
        '<table cellpadding="5"  border="1" id="2min_tracker_table" style="margin:20px;"><tbody>' +
        '<tr style="position:sticky;top:0px;background-color:azure;" >' +
        '<td style="padding-inline:5px;" >Marshall</td>' +
        '<td style="padding-inline:5px;" >Start</td>' +
        '<td style="padding-inline:5px;" >End</td>' +
        '<td style="padding-inline:5px;" >Czas trwania (sek)</td>' +
        '<td style="padding-inline:5px;" >Brama</td>' +
        '</tr>' +
        '</tbody></table>' +
        '</div>';
    marshall_tracker_2min.setAttribute ('id', '2min_tracker_div');
    marshall_tracker_2min.setAttribute ('class', '');
    marshall_tracker_2min.setAttribute ('style', '');
    document.getElementById ("app-layout-content-1").appendChild(marshall_tracker_2min);

    marshall_tracker_2min = null;

    document.getElementById ("2min_tracker_run").addEventListener (
        "click", sprawdz_brame_2min, false
    );

    var elements = document.getElementsByClassName("2min_tracker_date");
    for (var i=0; i<elements.length; i++) {
        elements[i].addEventListener("input", function(el){
            if(el.target.value.length == el.target.maxLength)
            {
                if(el.target.nextElementSibling != undefined)
                {
                    el.target.nextElementSibling.focus();
                }

                if(el.target.id == "2min_tracker_data_od_min")
                {
                    document.getElementById("2min_tracker_data_do_dd").focus();
                }

                if(el.target.id == "2min_tracker_data_do_min")
                {
                    sprawdz_brame_2min();
                }
            }
        });
    }

    elements = null;
}

function findAllEvents(obj) {
    const results = [];

    function searchForEvents(o) {
        if (o !== null && typeof o === 'object') {
            // Jeśli klucz 'events' istnieje na tym poziomie, dodaj do wyników
            if (o.hasOwnProperty('events')) {
                results.push(o.events);
            }
            // Rekurencyjne przeszukanie każdej właściwości obiektu
            for (const key of Object.keys(o)) {
                searchForEvents(o[key]);
            }
        }
    }

    searchForEvents(obj);
    return results;
}


function convertUnixTimestampToDateTime(timestampStr) {
    // Konwersja stringa na liczbę (integer)
    const timestamp = parseInt(timestampStr, 10);

    // Utworzenie obiektu daty na podstawie timestampu
    const date = new Date(timestamp);

    // Pobranie poszczególnych składowych daty
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Dodajemy 1, ponieważ getMonth zwraca miesiące od 0 do 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Złożenie składowych w ostateczny format "DD/MM/RRRR HH:MM:SS"
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}


function Czy_prawidlowe(timestamp1str, timestamp2str) {
    // Konwersja stringa na liczbę (integer)
    const timestamp1 = parseInt(timestamp1str, 10);
    const timestamp2 = parseInt(timestamp2str, 10);

    // Obliczanie różnicy czasu w milisekundach
    const difference = Math.abs(timestamp1 - timestamp2);

    // Konwersja różnicy na sekundy
    const differenceInSeconds = difference / 1000;

    // Sprawdzenie, czy różnica wynosi więcej niż 119 sekund (1 minuta i 59 sekund)
    return differenceInSeconds > 119;
}


function czas_trwania(timestamp1str, timestamp2str) {
    // Konwersja stringa na liczbę (integer)
    const timestamp1 = parseInt(timestamp1str, 10);
    const timestamp2 = parseInt(timestamp2str, 10);

    // Obliczanie różnicy czasu w milisekundach
    const difference = Math.abs(timestamp1 - timestamp2);

    // Konwersja różnicy na sekundy
    const differenceInSeconds = difference / 1000;

    // Sprawdzenie, czy różnica wynosi więcej niż 119 sekund (1 minuta i 59 sekund)
    return Math.round(differenceInSeconds);
}

async function sprawdz_brame_2min()
{
    document.getElementById("2min_loading_gif").src = "https://drive.corp.amazon.com/view/nowaratn@/loading.gif";
    document.getElementById ("2min_tracker_run").disabled = true;
    var data_od = new Date(document.getElementById("2min_tracker_data_od_mm").value + "/" + document.getElementById("2min_tracker_data_od_dd").value + "/" + document.getElementById("2min_tracker_data_od_yy").value + " " + document.getElementById("2min_tracker_data_od_hh").value + ":" + document.getElementById("2min_tracker_data_od_min").value + ":00").getTime();
    var data_do = new Date(document.getElementById("2min_tracker_data_do_mm").value + "/" + document.getElementById("2min_tracker_data_do_dd").value + "/" + document.getElementById("2min_tracker_data_do_yy").value + " " + document.getElementById("2min_tracker_data_do_hh").value + ":" + document.getElementById("2min_tracker_data_do_min").value + ":00").getTime();

    // console.log(document.getElementById("tracker_data_od_dd").value + "/" + document.getElementById("tracker_data_od_mm").value + "/" + document.getElementById("tracker_data_od_yy").value + " " + document.getElementById("tracker_data_od_hh") + ":" + document.getElementById("tracker_data_od_min") + ":00");
    //  console.log(data_od);
    //  console.log(data_do);


    // console.log(events);
    var OM_in;
    var OM_in_start;
    var OM_in_end;

    var IM_in;
    var IM_in_start;
    var IM_in_end;

    var IM_out;
    var IM_out_start;
    var IM_out_end;

    var OM_out;
    var OM_out_start;
    var OM_out_end;

    var DD;

    for(var i=0;i<=tablica_bramy.length;i++)
    {
        await sleep(345);
        var response = await fetch("https://www.amazonlogistics.eu/gtdr/graphql", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "content-type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "referrer": "https://www.amazonlogistics.eu/gtdr/dashboard/history",
            "body": "{\"operationName\":\"dockingLocation\",\"variables\":{\"nodeId\":\"KTW1\",\"dockingLocationId\":\"" + tablica_bramy[i] + "\",\"paginationInput\":{},\"filter\":{\"lastEventTimeGte\":" + data_od + ",\"lastEventTimeLt\":" + data_do + "}},\"query\":\"query dockingLocation($nodeId: String!, $dockingLocationId: String!, $paginationInput: PaginationInput, $filter: TDRResultsConnectionFilterInput) {\\n  dockingLocation(nodeId: $nodeId, dockingLocationId: $dockingLocationId) {\\n    label\\n    tdrHistory {\\n      tdrResultsConnection(paginationInput: $paginationInput, filter: $filter) {\\n        pageInfo {\\n          hasPreviousPage\\n          hasNextPage\\n          startCursor\\n          endCursor\\n          __typename\\n        }\\n        edges {\\n          cursor\\n          node {\\n            lastEventTime\\n            lastEventType\\n            originatingWorkflowDefinitionId\\n            originatingWorkflowDefinitionVersionId\\n            workflowId\\n            events\\n            environmentVariables\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
            "method": "POST",
            "mode": "cors"
        });

        while(!response.ok)
        {
            await sleep(1000);
        }

        // Konwersja odpowiedzi na JSON
        const data = await response.json();
        const events = findAllEvents(data);


        if(events.length > 0)
        {
            for(var j=0;j<=events.length;j++)
            {
                if(events[j])
                {
                    var akcje = events[j].split("type");

                    DD = tablica_bramy[i];

                    // Jeżeli nie anulowane
                    if(!events[j].includes("CancelDocking"))
                    {
                        //console.log(events[j]);

                        if(!events[j].includes("CancelReleasing"))
                        {
                            console.log(events[j]);
                            console.log(akcje.length);
                            // StartDocking - OM zaczyna przyjmować
                            // PauseWorkflow - OM kończy przyjmować

                            // ResumeWorkflow - IM zaczyna otwierać
                            // CompleteDocking - IM kończy otwierać

                            // StartReleasing - IM zaczyna zamykać
                            // PauseWorkflow - IM kończy zamykać

                            // ResumeWorkflow - OM zaczyna odprawiać
                            // CompleteReleasing - OM kończy odprawiać


                            if(akcje.length > 4)
                            {
                                console.log(DD);
                                for(var z=1;z<=akcje.length;z++)
                                {
                                    if(akcje[z])
                                    {
                                        // jeżeli OM zaczyna przyjmować
                                        if(akcje[z].indexOf("StartDocking") > -1)
                                        {
                                            console.log(" OM zaczyna przyjmować ");
                                            OM_in = getFromBetween.get(akcje[z],'loginId":"','","timestamp');
                                            OM_in_start = getFromBetween.get(akcje[z],'timestamp":','}');
                                            OM_in_end = getFromBetween.get(akcje[z+1],'timestamp":',',');

                                        }

                                        // jeżeli IM zaczyna przyjmować
                                        if(akcje[z].indexOf("ResumeWorkflow") > -1)
                                        {

                                            // jeżeli IM nie przyjął, to jest IM, w innym przypadku to już OM Out
                                            if(!IM_in)
                                            {
                                                console.log(" IM zaczyna przyjmować ");
                                                IM_in = getFromBetween.get(akcje[z],'loginId":"','","timestamp');
                                                IM_in_start = getFromBetween.get(akcje[z],'timestamp":','}');
                                                IM_in_end = getFromBetween.get(akcje[z+1],'timestamp":',',');
                                            }
                                            else
                                            {
                                                console.log(" OM zaczyna odprawiać ");
                                                OM_out = getFromBetween.get(akcje[z],'loginId":"','","timestamp');
                                                OM_out_start = getFromBetween.get(akcje[z],'timestamp":','}');
                                                OM_out_end = getFromBetween.get(akcje[z+1],'timestamp":',',');
                                            }
                                        }

                                        // jeżeli IM zaczyna odprawiać
                                        if(akcje[z].indexOf("StartReleasing") > -1)
                                        {
                                            console.log(" IM zaczyna odprawiać");
                                            IM_out = getFromBetween.get(akcje[z],'loginId":"','","timestamp');
                                            IM_out_start = getFromBetween.get(akcje[z],'timestamp":','}');
                                            IM_out_end = getFromBetween.get(akcje[z+1],'timestamp":',',');
                                        }
                                    }
                                }
                            }


                            // '<td style="padding-inline:5px;" >Marshall</td>' +
                            //     '<td style="padding-inline:5px;" >Start</td>' +
                            //     '<td style="padding-inline:5px;" >End</td>' +
                            //     '<td style="padding-inline:5px;" >Brama</td>' +

                            // console.log(OM_in_start);

                            //                         console.log(convertUnixTimestampToDateTime(OM_in_start[0]) + " vs " + convertUnixTimestampToDateTime(OM_in_end[0]))
                            //                         console.log(convertUnixTimestampToDateTime(IM_in_start[0]) + " vs " + convertUnixTimestampToDateTime(IM_in_end[0]))
                            //                         console.log(convertUnixTimestampToDateTime(IM_out_start[0]) + " vs " + convertUnixTimestampToDateTime(IM_out_end[0]))
                            //                         console.log(convertUnixTimestampToDateTime(OM_out_start[0]) + " vs " + convertUnixTimestampToDateTime(OM_out_end[0]))
                            //                         console.log(DD);

                            // Sprawdz jak długo robione , TRUE = poniżej 1 min 59 sec
                            if(!Czy_prawidlowe(OM_in_start[0], OM_in_end[0]))
                            {
                                document.getElementById("2min_tracker_table").innerHTML = document.getElementById("2min_tracker_table").innerHTML +
                                    '<td>' + OM_in[0] + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(OM_in_start[0]) + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(OM_in_end[0]) + '</td>' +
                                    '<td>' + czas_trwania(OM_in_start[0],OM_in_end[0]) + '</td>' +
                                    '<td>' + DD + '</td>';
                            }

                            if(!Czy_prawidlowe(IM_in_start[0], IM_in_end[0]))
                            {
                                document.getElementById("2min_tracker_table").innerHTML = document.getElementById("2min_tracker_table").innerHTML +
                                    '<td>' + IM_in[0] + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(IM_in_start[0]) + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(IM_in_end[0]) + '</td>' +
                                    '<td>' + czas_trwania(IM_in_start[0],IM_in_end[0]) + '</td>' +
                                    '<td>' + DD + '</td>';
                            }

                            if(!Czy_prawidlowe(IM_out_start[0], IM_out_end[0]))
                            {
                                document.getElementById("2min_tracker_table").innerHTML = document.getElementById("2min_tracker_table").innerHTML +
                                    '<td>' + IM_out[0] + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(IM_out_start[0]) + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(IM_out_end[0]) + '</td>' +
                                    '<td>' + czas_trwania(IM_out_start[0],IM_out_end[0]) + '</td>' +
                                    '<td>' + DD + '</td>';
                            }

                            if(!Czy_prawidlowe(OM_out_start[0], OM_out_end[0]))
                            {
                                document.getElementById("2min_tracker_table").innerHTML = document.getElementById("2min_tracker_table").innerHTML +
                                    '<td>' + OM_out[0] + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(OM_out_start[0]) + '</td>' +
                                    '<td>' + convertUnixTimestampToDateTime(OM_out_end[0]) + '</td>' +
                                    '<td>' + czas_trwania(OM_out_start[0],OM_out_end[0]) + '</td>' +
                                    '<td>' + DD + '</td>';
                            }
                        }}
                }

             //   await sleep(400);
            }



            // actions = null;
            // data_od = null;
            // data_do = null;
        }

       // await sleep(400);
    }
    document.getElementById("2min_loading_gif").src = "";
    document.getElementById("2min_tracker_run").disabled = false;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}