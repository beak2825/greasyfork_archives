// ==UserScript==
// @name         KTW4_Tracker
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Skrypt do śledzenia rozładunków towaru z KTW4.
// @author       nowaratn
// @match        https://trans-logistics-eu.amazon.com/ssp/dock/*
// @match        https://fclm-portal.amazon.com/*
// @icon         https://cdn.icon-icons.com/icons2/325/PNG/256/Number-4-icon_34779.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425138/KTW4_Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/425138/KTW4_Tracker.meta.js
// ==/UserScript==

// KTW4_DROP1 : 3eb2442a-460d-4cd3-97ca-8a7bd54a4c2e

// Jakie paczki na Stage:
// https://trans-logistics-eu.amazon.com/sortcenter/tt/contains?containerId=3eb2442a-460d-4cd3-97ca-8a7bd54a4c2e&nodeId=KTW1&startIndex=0&forward=true&pageSize=25
// {"result":{"contains":[{"cptInMillis":1618599600000,"containerType":"Package ","cpt":"16-Apr-2021 09:00:00 PM CEST","stackingFilter":"AIR-LEJA-MADB-Small","associationReason":"-","isEmpty":"-","resourceLabel":"28-DNgK12lK5_001","associatedUser":"nowaratn","cleanupAllowed":false,"isClosed":"-","containerId":"1b87462e-3821-461f-9b20-b81fd9731ac0","isForcedMove":"No","dwellTime":"0 : 0"}],"endToken":null,"startToken":"0"},"ok":true,"message":""}

// Jak długo konkretna paczka:
// https://trans-logistics-eu.amazon.com/sortcenter/tt/eventtrail?containerId=1b87462e-3821-461f-9b20-b81fd9731ac0&nodeId=KTW1&isDebugEnabled=false
// {"result":{"combinedAudit":{"containerId":"1b87462e-3821-461f-9b20-b81fd9731ac0","items":[{"lastActionTime_local":null,"identifier":"CONTAINER_MOVEMENT","level":"NONE","byModule":null,"description":" Moved in Gaylord ","toModule":"CHS","byUser":"borowikt","properties":{"parentContainerId":"434a15be-4974-4d00-aecf-fa0fc82dc48a","childContainerId":"1b87462e-3821-461f-9b20-b81fd9731ac0","parentContainerLabel":"GAYLORD_rQeVRF_Z","childContainerLabel":"28-DNgK12lK5_001"},"lastUpdateTime_local":"16-Apr-2021 01:26:52 AM CEST","lastUpdateTime":1618529212410},{"lastActionTime_local":null,"identifier":"CONTAINER_MOVEMENT","level":"NONE","byModule":null,"description":" Moved in General Area ","toModule":"CHS","byUser":"nowaratn","properties":{"parentContainerId":"3eb2442a-460d-4cd3-97ca-8a7bd54a4c2e","childContainerId":"1b87462e-3821-461f-9b20-b81fd9731ac0","parentContainerLabel":"KTW4_DROP1","childContainerLabel":"28-DNgK12lK5_001"},"lastUpdateTime_local":"16-Apr-2021 02:14:41 AM CEST","lastUpdateTime":1618532081843}],"nodeId":"KTW1"}},"ok":true,"message":""}

var stage_response;
var stage_paczki;
var paczka_response;
var container;
var container_response;
var container_response_paczki;
var i,j,k;
var czas = new Date();
var dwell = "";
var interval;
var interval2;

setTimeout(function() {

    localStorage.setItem("ktw4_interval", 300000);
    interval = 300000;
    var node = document.createElement ('div');
    node.innerHTML = '<div id="div_info_id" style="padding-top:1%;padding-bottom:3%;font-size:20px;"></div><hr><input type="button" id="button_1" value="Sprawdź za 15 minut" style="background-color:white;"><input type="button"  id="button_2" value="NIE" style="float:right;background-color:white;" disabled >';
    node.setAttribute ('id', 'node_div_id');
    node.setAttribute ('style', 'position:fixed;left:5%;top:15%;border:black;border-style:dashed;border-width:5px;width:360px;z-index:999;background-color:pink;visibility:hidden;');
    document.getElementsByTagName("body")[0].appendChild(node);

    document.getElementById("button_1").addEventListener (
        "click", ButtonClick_button_1, false
    );

    document.getElementById("button_2").addEventListener (
        "click", ButtonClick_button_2, false
    );

    function ButtonClick_button_1 (zEvent)
    {
        clearInterval(setint);
        document.getElementById("node_div_id").style.visibility = "hidden";
        localStorage.setItem("ktw4_interval", 900000);

        setTimeout(function() {
            var setint = setInterval(inter , 900000 );
        },2000);
    };

    function ButtonClick_button_2 (zEvent)
    {
        document.getElementById("div_info_id").innerHTML = "<img src='https://s2.reutersmedia.net/resources/r/?m=02&d=20210203&t=2&i=1550183755&w=&fh=545px&fw=&ll=&pl=&sq=&r=LYNXMPEH1214I' /><br><center>Dlaczego nie?!</center>";
    };

    var setint = setInterval(inter , interval );

    if(document.getElementById("ssp_iframe_div") == undefined)
    {
        var frejm = document.createElement ('div');
        frejm.innerHTML = '<iframe id="ssp_iframe" >';
        frejm.setAttribute ('id', 'ssp_iframe_div');
        frejm.setAttribute ('style', 'position:fixed;right:5%;top:15%;border:black;border-style:dashed;border-width:5px;width:360px;z-index:1;background-color:pink;visibility:hidden;');
        document.getElementsByTagName("body")[0].appendChild(frejm);
    }


},8000);

function inter (){
        if(document.getElementById("node_div_id").style.visibility == "hidden")
        {
            document.getElementById("ssp_iframe").src = "https://trans-logistics-eu.amazon.com/sortcenter/tt/contains?containerId=3eb2442a-460d-4cd3-97ca-8a7bd54a4c2e&nodeId=KTW1&startIndex=0&forward=true&pageSize=25";


            //stage_response = httpGet("https://trans-logistics-eu.amazon.com/sortcenter/tt/contains?containerId=3eb2442a-460d-4cd3-97ca-8a7bd54a4c2e&nodeId=KTW1&startIndex=0&forward=true&pageSize=25");
            // więcej niż jedna paczka na Stage
            setTimeout(function() {
            var iframe = document.getElementById('ssp_iframe');
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            stage_response = innerDoc.body.innerHTML;
            if(innerDoc.body.innerHTML.includes("},{"))
            {
                stage_paczki = stage_response.split("},{");

                for(i=0;i<=stage_paczki.length;i++)
                {
                    console.log("error69?");
                    console.log(stage_paczki[i]);
                    dwell = getFromBetween.get(stage_paczki[i],'dwellTime":"','"');

                    console.log(dwell[0]);
                    // Jeżeli dwell już ponad godzine
                    if(dwell[0].substr(-1) >= 1)
                    {

                        interval = 300000;
                        localStorage.setItem("ktw4_interval", 300000);
                        document.getElementById("node_div_id").style.visibility = "visible";
                        document.getElementById("div_info_id").innerText = "Sprawdź proszę dlaczego KTW4 nie zostało wrzucone na Sorter.";
                        return;
                    }
                    // Trzeba sprawdzić u źródła, ile dwelluje
                    else
                    {
                        console.log("error1?");
                        container = getFromBetween.get(stage_paczki[i],'containerId":"','","isForcedMove');

                        document.getElementById("ssp_iframe").src = 'https://trans-logistics-eu.amazon.com/sortcenter/tt/eventtrail?containerId=' + container + '&nodeId=KTW1&isDebugEnabled=false';
                        iframe = document.getElementById('ssp_iframe');
                        innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                        container_response = innerDoc.body.innerHTML;

                       // container_response = httpGet('https://trans-logistics-eu.amazon.com/sortcenter/tt/eventtrail?containerId=' + container + '&nodeId=KTW1&isDebugEnabled=false');
                        setTimeout(function() {
                            container_response_paczki = container_response.split("},{");
                            console.log("error2?");
                            czas = getFromBetween.get(container_response_paczki[1], 'lastUpdateTime":','}],"nodeId');

                            console.log("czas: " + czas);
                            console.log("cczas + 30 * 60000: " + czas + 30 * 60000);
                            console.log("Date.now(): " + Date.now());
                            if(Date.now() >= czas + (30 * 60000))
                            {
                                interval = 30000;
                                localStorage.setItem("ktw4_interval", 300000);
                                document.getElementById("node_div_id").style.visibility = "visible"
                                document.getElementById("div_info_id").innerHTML = "Sprawdź proszę dlaczego KTW4 nie zostało wrzucone na Sorter.";
                                return;
                            }
                        },3000);
                    }
                }
            }


            else if(stage_response == '{"result":{"contains":[],"endToken":null,"startToken":null},"ok":true,"message":""}')
            {
                // Pusto
            }

            // tylko JEDNA paczka na Stage
            else
            {
                console.log("error420?");
                console.log(stage_response);
                dwell = getFromBetween.get(stage_response,'dwellTime":"','"}]');
                console.log(dwell[0]);
                // Jeżeli dwell już ponad godzine
                if(dwell[0].substr(-1) >= 1)
                {
                    interval = 300000;
                    localStorage.setItem("ktw4_interval", 300000);
                    document.getElementById("node_div_id").style.visibility = "visible"
                    document.getElementById("div_info_id").innerHTML = "Sprawdź proszę dlaczego KTW4 nie zostało wrzucone na Sorter.";
                    return;
                }
                else
                {
                    console.log("error4?");
                    container = getFromBetween.get(stage_response,'containerId":"','","isForcedMove');

                    document.getElementById("ssp_iframe").src = 'https://trans-logistics-eu.amazon.com/sortcenter/tt/eventtrail?containerId=' + container + '&nodeId=KTW1&isDebugEnabled=false';



                    //container_response = httpGet('https://trans-logistics-eu.amazon.com/sortcenter/tt/eventtrail?containerId=' + container + '&nodeId=KTW1&isDebugEnabled=false');

                    setTimeout(function() {
                    iframe = document.getElementById('ssp_iframe');
                    innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                    container_response = innerDoc.body.innerHTML;
                        console.log("error5?");
                        console.log(container_response);
                    container_response_paczki = container_response.split("},{");
                        console.log(container);
                    czas = getFromBetween.get(container_response_paczki[1], 'lastUpdateTime":','}],"nodeId');

                    console.log("czas: " + czas);
                    console.log("czas + 30 * 60000: " + (parseInt(czas) + (30 * 60000)));
                    console.log("Date.now(): " + Date.now());
                    if(Date.now() >= (parseInt(czas) + (30 * 60000)))
                    {
                        document.getElementById("node_div_id").style.visibility = "visible"
                        document.getElementById("div_info_id").innerHTML = "Sprawdź proszę dlaczego KTW4 nie zostało wrzucone na Sorter.";
                        interval = 300000;
                        localStorage.setItem("ktw4_interval", 300000);
                        return;
                    }

                    // for(i=0;i<=container_response_paczki.length;i++)
                    // {
                    // }

                    },4000);
                }
            }
            },5000);

        }
    }

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function diff_minutes(dt2, dt1)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));

 }

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