// ==UserScript==
// @name         Outdoor Marshall Stats
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zliczanie przyjęć i odpraw aut za dany okres czasu
// @author       @nowaratn
// @match        https://www.amazonlogistics.eu/gtdr/dashboard/history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazonlogistics.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449841/Outdoor%20Marshall%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/449841/Outdoor%20Marshall%20Stats.meta.js
// ==/UserScript==

var tablica_bramy = ["DD101","DD102","DD103","DD104","DD105","DD108","DD109","DD110","DD111","DD112","IB116","IB117","IB118","IB118","IB119","IB120","IB121","IB122","IB123","IB124","IB125","IB126","IB127","IB128","IB129","IB129","IB135","IB136","IB137","OB132","OB133","OB134","OB138","OB139","OB140","OB141","OB143","OB144","OB145","OB146","OB147","OB147","OB148","OB149","OB150","OB151","OB152","OB153","OB154","OB155","OB156","OB157","OB158","OB158","OB159","OB160","OB160","OB161","OB162","OB163","OB164"];
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

    var marshall_tracker = document.createElement ('div');
    marshall_tracker.innerHTML = '<input type="button" id="tracker_button" value="Marshall Tracker" style=""/>';
    marshall_tracker.setAttribute ('id', 'marshall_tracker_set');
    marshall_tracker.setAttribute ('class', '');
    marshall_tracker.setAttribute ('style', 'display:flex;');
    document.getElementsByClassName("css-1tjbqgb")[0].appendChild(marshall_tracker);

    document.getElementById ("tracker_button").addEventListener (
        "click", tracker_set, false
    );

    marshall_tracker = null;

})();

function tracker_set()
{
    document.getElementsByClassName("css-fddilk")[1].style.display = "none";
    document.getElementById("tracker_button").style.backgroundColor = "chartreuse";

    var marshall_tracker = document.createElement ('div');
    marshall_tracker.innerHTML = '<div id="tracker_menu" style="border:solid;border-color:black;margin:20px;padding:20px;">' +
        '<div id="tracker_data_div_left" style="float:left;margin-right:20px;">Data od: <br>' +
        '<input type="text" class="tracker_date" id="tracker_data_od_dd" minlength="2" maxlength="2" size="2" placeholder="dd"  value=""  >/' +
        '<input type="text" class="tracker_date" id="tracker_data_od_mm" minlength="2" maxlength="2" size="2" placeholder="mm"  value=""  >/' +
        '<input type="text" class="tracker_date" id="tracker_data_od_yy" minlength="4" maxlength="4" size="4" placeholder="yyyy"  value=""  >' +
        '<input type="text" class="tracker_date" id="tracker_data_od_hh" minlength="2" maxlength="2" size="2" placeholder="hh" style="display:flex"   value=""  >' +
        '<input type="text" class="tracker_date" id="tracker_data_od_min" minlength="2" maxlength="2" size="2" placeholder="min"   value=""  >' +
        '</div>' +

        '<div id="tracker_data_div_right">Data do: <br>' +
        '<input type="text" class="tracker_date" id="tracker_data_do_dd" minlength="2" maxlength="2" size="2" placeholder="dd"   value=""  >/' +
        '<input type="text" class="tracker_date" id="tracker_data_do_mm" minlength="2" maxlength="2" size="2" placeholder="mm"   value=""  >/' +
        '<input type="text" class="tracker_date" id="tracker_data_do_yy" minlength="4" maxlength="4" size="4" placeholder="yyyy"   value=""  >' +
        '<input type="text" class="tracker_date" id="tracker_data_do_hh" minlength="2" maxlength="2" size="2" placeholder="hh" style="display:flex"   value=""  >' +
        '<input type="text" class="tracker_date" id="tracker_data_do_min" minlength="2" maxlength="2" size="2" placeholder="min"   value=""  >' +
        '</div><br>' +

        '<div><input type="button" value="Sprawdź" id="tracker_run" /><img id="loading_gif" style="height:16px;"/></div>' +

        '</div>' +
        '<table cellpadding="5"  border="1" id="marshall_tracker_table" style="margin:20px;"><tbody>' +
        '<tr style="position:sticky;top:0px;background-color:azure;" >' +
        '<td style="padding-inline:5px;" >Marshall</td>' +
        '<td style="padding-inline:5px;" >Przyjęte</td>' +
        '<td style="padding-inline:5px;" >Odprawione</td>' +
        '<td style="padding-inline:5px;" >Łącznie</td>' +
        '</tr>' +
        '</tbody></table>' +
        '</div>';
    marshall_tracker.setAttribute ('id', 'marshall_tracker_div');
    marshall_tracker.setAttribute ('class', '');
    marshall_tracker.setAttribute ('style', '');
    document.getElementById ("app-layout-content-1").appendChild(marshall_tracker);

    marshall_tracker = null;

    document.getElementById ("tracker_run").addEventListener (
        "click", sprawdz_brame, false
    );

    var elements = document.getElementsByClassName("tracker_date");
    for (var i=0; i<elements.length; i++) {
        elements[i].addEventListener("input", function(el){
                if(el.target.value.length == el.target.maxLength)
                {
                    if(el.target.nextElementSibling != undefined)
                    {
                        el.target.nextElementSibling.focus();
                    }

                    if(el.target.id == "tracker_data_od_min")
                    {
                        document.getElementById("tracker_data_do_dd").focus();
                    }

                    if(el.target.id == "tracker_data_do_min")
                    {
                        sprawdz_brame();
                    }
                }
        });
    }

    elements = null;
}

async function sprawdz_brame()
{
    document.getElementById("loading_gif").src = "https://drive.corp.amazon.com/view/nowaratn@/loading.gif";
    document.getElementById ("tracker_run").disabled = true;
    var data_od = new Date(document.getElementById("tracker_data_od_mm").value + "/" + document.getElementById("tracker_data_od_dd").value + "/" + document.getElementById("tracker_data_od_yy").value + " " + document.getElementById("tracker_data_od_hh").value + ":" + document.getElementById("tracker_data_od_min").value + ":00").getTime();
    var data_do = new Date(document.getElementById("tracker_data_do_mm").value + "/" + document.getElementById("tracker_data_do_dd").value + "/" + document.getElementById("tracker_data_do_yy").value + " " + document.getElementById("tracker_data_do_hh").value + ":" + document.getElementById("tracker_data_do_min").value + ":00").getTime();

    // console.log(document.getElementById("tracker_data_od_dd").value + "/" + document.getElementById("tracker_data_od_mm").value + "/" + document.getElementById("tracker_data_od_yy").value + " " + document.getElementById("tracker_data_od_hh") + ":" + document.getElementById("tracker_data_od_min") + ":00");
  //  console.log(data_od);
  //  console.log(data_do);

    for(var i=0;i<=tablica_bramy.length;i++)
    {
        await sleep(1000);
        var str = await fetch("https://www.amazonlogistics.eu/gtdr/graphql", {
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

        while(!str.ok)
        {
            await sleep(1000);
        }

        var responseText = await str.text();
        str = null;

        //await sleep(2000);

        var actions = responseText.split('cursor":"');
        responseText = null;
        for(var j=1;j<=actions.length;j++)
        {
            if(actions[j] != undefined)
            {
                // bez anulowanych
                if(!actions[j].indexOf("CancelReleasing") > -1 )
                {
                  //  console.log(actions[j].toString());
                    // odprawione = CompleteReleasing
                    // przyjęte > PauseWorkflow\",\"loginId
                    var login_przyjete = getFromBetween.get(actions[j],'PauseWorkflow\\",\\"loginId\\":\\"','@amazon.com\\",\\"timestamp\\"');
                    var login_odprawione = getFromBetween.get(actions[j],'CompleteReleasing\\",\\"loginId\\":\\"','@amazon.com\\",\\"timestamp\\"');

                    var czas_przyjete = getFromBetween.get(actions[j],'PauseWorkflow\\",\\"loginId\\":\\"' + login_przyjete[0] + '@amazon.com\\",\\"timestamp\\":',',\\"context\\":');
                    var czas_odprawione = getFromBetween.get(actions[j],'CompleteReleasing\\",\"loginId\\":\\"' + login_odprawione[0] + '@amazon.com\\",\\"timestamp\\":',',\\"context\\":');

                    console.log(login_przyjete[0]);
                    console.log(czas_przyjete[0]);

                    if(login_przyjete[0] != undefined && login_odprawione[0] != undefined)
                    {
                        if(czas_przyjete[0] >= data_od)
                        {
                            if(document.getElementById(login_przyjete[0]) == undefined)
                            {
                                document.getElementById("marshall_tracker_table").innerHTML = document.getElementById("marshall_tracker_table").innerHTML +
                                    '<td id="' + login_przyjete[0] + '">' + login_przyjete[0] + '</td>' +
                                    '<td>1</td>' +
                                    '<td>0</td>' +
                                    '<td>1</td>';
                            }
                            else
                            {
                                document.getElementById(login_przyjete[0]).nextElementSibling.innerText = parseInt(document.getElementById(login_przyjete[0]).nextElementSibling.innerText) + 1;
                                document.getElementById(login_przyjete[0]).nextElementSibling.nextElementSibling.nextElementSibling.innerText = parseInt(document.getElementById(login_przyjete[0]).nextElementSibling.innerText) + parseInt(document.getElementById(login_przyjete[0]).nextElementSibling.nextElementSibling.innerText);
                            }

                            if(document.getElementById(login_odprawione[0]) == undefined)
                            {
                                document.getElementById("marshall_tracker_table").innerHTML = document.getElementById("marshall_tracker_table").innerHTML +
                                    '<td id="' + login_odprawione[0] + '">' + login_odprawione[0] + '</td>' +
                                    '<td>0</td>' +
                                    '<td>1</td>' +
                                    '<td>1</td>';
                            }
                            else
                            {
                                document.getElementById(login_odprawione[0]).nextElementSibling.nextElementSibling.innerText = parseInt(document.getElementById(login_odprawione[0]).nextElementSibling.nextElementSibling.innerText) + 1;
                                document.getElementById(login_odprawione[0]).nextElementSibling.nextElementSibling.nextElementSibling.innerText = parseInt(document.getElementById(login_odprawione[0]).nextElementSibling.innerText) + parseInt(document.getElementById(login_odprawione[0]).nextElementSibling.nextElementSibling.innerText);
                            }
                        }
                    }
                    login_przyjete = null;
                    login_odprawione = null;
                    czas_przyjete = null;
                    czas_odprawione = null;
                }
            }
        }
    }
    actions = null;
    data_od = null;
    data_do = null;
    document.getElementById("loading_gif").src = "";
    document.getElementById("tracker_run").disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


