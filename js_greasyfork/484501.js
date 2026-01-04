// ==UserScript==
// @name         AWC METAR Page Enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Unlocks more features for the standard METAR page on the AWC website.
// @author       Kenneth Anderson
// @match        https://aviationweather.gov/data/metar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aviationweather.gov
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484501/AWC%20METAR%20Page%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/484501/AWC%20METAR%20Page%20Enhancement.meta.js
// ==/UserScript==
//©2024 Kenneth William Anderson IV. All Rights Reserved.
//No part of this script may be modified, redistributed, or sold without explicit permission.
var ScriptStatus = false;
var TextFilter = "";


function StartUp()
{
    let ParentButtonDiv = document.getElementsByClassName("col-auto align-self-center")[3];
    let StartScriptButton = document.createElement("button");
    StartScriptButton.classList.add("btn", "btn-primary");
    StartScriptButton.setAttribute("id", "StartStopToggleButton");
    StartScriptButton.setAttribute("title", "Begin/End Script");
    StartScriptButton.style.margin = "3px";
    StartScriptButton.innerHTML = `Start Script`;
    ParentButtonDiv.appendChild(StartScriptButton);
    document.getElementById("StartStopToggleButton").addEventListener("click", ToggleScript);

    var NoteNode = document.createElement("p");
    NoteNode.id = "NoteP";
    NoteNode.innerHTML = "click me";
    document.querySelector("#main-display").prepend(NoteNode);
    document.getElementById("NoteP").addEventListener("click", ToggleNote);
}


function ToggleNote()
{
    if(document.getElementById("NoteP").innerHTML == "click me"){ document.getElementById("NoteP").innerHTML = `Hello Reader,
    <br>I have begun developing a script for this page. This script, while currently unstable and glitchy, will add numerous helpful features.
    <br>Currently, the script offers filtering reports by text and a customized hours selection.
    <br>While I was only able to get around 30 minutes of coding done at work, tomorrow(thursday) I will get to work on improving the script for this page and updating the script for the main script.
    <br>The update for the main script, among other things, will feature improved error detection that includes winter weather error detection.
    <br>The script can be toggled with the Start/Stop Script button.
    <br>Thanks,
    <br>Kenneth Anderson
    <br>click this again to close the note.`; }
    else if(document.getElementById("NoteP").innerHTML == `Hello Reader,
    <br>I have begun developing a script for this page. This script, while currently unstable and glitchy, will add numerous helpful features.
    <br>Currently, the script offers filtering reports by text and a customized hours selection.
    <br>While I was only able to get around 30 minutes of coding done at work, tomorrow(thursday) I will get to work on improving the script for this page and updating the script for the main script.
    <br>The update for the main script, among other things, will feature improved error detection that includes winter weather error detection.
    <br>The script can be toggled with the Start/Stop Script button.
    <br>Thanks,
    <br>Kenneth Anderson
    <br>click this again to close the note.`){
        document.getElementById("NoteP").remove();
    }
}


function ToggleScript()
{
    if(ScriptStatus == false)
    {
        ScriptStatus = !ScriptStatus;
        ActivateScript();
    }
    else
    {
        location.reload();
    }
}


function ActivateScript()
{
    let SelectOption6 = document.querySelector("#hours > option:nth-child(5)");
    SelectOption6.value = 8;
    SelectOption6.innerHTML = "past 8 hours";

    let SelectParent = document.getElementById("hours");
    let Node120 = document.createElement("option");
    Node120.value = 120;
    Node120.innerHTML = "past 120 hours";
    SelectParent.appendChild(Node120);

    let Node240 = document.createElement("option");
    Node240.value = 240;
    Node240.innerHTML = "past 240 hours";
    SelectParent.appendChild(Node240);

    let Node360 = document.createElement("option");
    Node360.value = 360;
    Node360.innerHTML = "past 360 hours";
    SelectParent.appendChild(Node360);

    let NodeReportSearch = document.createElement("div");
    NodeReportSearch.classList.add("col-auto", "align-self-center");
    NodeReportSearch.innerHTML = `<br>Text Filter: <input class="input-group-text" size="16" style="display: inline-block;" id="SearchInReports" autocorrect="off" autocapitalize="off" spellcheck="false" title="Filter reports by text.">`;
    document.querySelector("#main-display > div.row.user-select-none.d-print-none.my-4").appendChild(NodeReportSearch);

    document.getElementById("StartStopToggleButton").innerHTML = "Stop Script";
    document.getElementById("SearchInReports").addEventListener("change", EditTextFilter);

    document.querySelector("#hours > option:nth-child(1)").selected = true;

    document.querySelector("#hours").addEventListener("change", SearchReports);
    document.querySelector("#id").addEventListener("change", SearchReports);
}


function EditTextFilter()
{
    TextFilter = document.getElementById("SearchInReports").value.toUpperCase();
    document.getElementById("SearchInReports").value = TextFilter;
    SearchReports();
}


function SearchReports()
{
    console.log("Searching reports.");
    console.log(TextFilter);
    let SearchQuery = document.querySelector("#id").value;
    console.log(SearchQuery);
    console.log("Hours: " + document.querySelector("#hours").value);
    var ComposedGET = `https://aviationweather.gov/cgi-bin/data/metar.php?ids=${SearchQuery}&hours=${document.querySelector("#hours").value}&format=raw`;
    GetData(ComposedGET);
}


function GetData(get)
{
    GM_xmlhttpRequest({
        method: "GET",
        url: get,
        headers:
        {
            "Content-Type": "application/json"
        },
        onload: function(response)
        {
                if(!response.responseText)
                {
                    document.querySelector("#data-container").innerHTML = `There are no reports available.`;
                }
                else
                {
                    console.log(response.responseText);
                    var rpts = response.responseText.split("\n");
                    let Data = rpts;
                    console.log(Data);
                    let GoodData = SiftData(Data);
                    console.log(GoodData);
                    if(!GoodData)
                    {
                        document.querySelector("#data-container").innerHTML = `No reports adhere to the filters set.`;
                    }
                    else
                    {
                        document.querySelector("#data-container").innerHTML = GoodData.toString();
                    }
                }
        }
    });
}


function SiftData(dat)
{
    let GoodData = [];
    for(var i = 0; i < dat.length; i++)
    {
        if(!dat[i] || !dat[i].includes(TextFilter))
        {
            //blank entry or one that does not include text filter.
        }
        else
        {
            if(TextFilter != ""){ GoodData.push(dat[i].replaceAll(TextFilter, `<span style="color: yellow; font-weight: bold; background: rgba(255,255,0, 0.2)">${TextFilter}</span>`)); }
            else{ GoodData.push(dat[i]); }
        }
    }
    //Organize Data Into Stations
    let SiftedData = "";
    let stations = document.querySelector("#id").value;
    stations = stations.split(",");
    console.log(stations);
    for(var k = 0; k < stations.length; k++)
    {
        console.log(stations[k]);
        for(var l = 0; l < GoodData.length; l++)
        {
            console.log(GoodData[l]);
            if(GoodData[l].substr(0,4) == stations[k])
            {
                SiftedData += GoodData[l] + "\n";
            }
        }
        SiftedData += `\n`;
    }
    console.log(SiftedData);
    return SiftedData;
}


StartUp();