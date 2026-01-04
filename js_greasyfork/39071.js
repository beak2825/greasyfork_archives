// ==UserScript==
// @name         mTabs
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @match        *mtab*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/39071/mTabs.user.js
// @updateURL https://update.greasyfork.org/scripts/39071/mTabs.meta.js
// ==/UserScript==

//Global Variables//
var tabList = [//List of all tabs to be displayed-Disable a tab by commenting out the line.
    "Dashboard",
    //"Qualifications",
    "Queue",
    "Scraper",
    "Log",
    "Catcher",
    "Discord",
    "Mods",
    "Settings"
];
var collapsableTabs      = false;//Enable this to close tabs when clicked (not recommended until properly implemented)
var qualificationsLoaded = false;//Waits to load qual page until clicked and then prevents it from reloading
var useAlternateScraper  = false;//Able to set your own scraper in place of the hand crafted one I made (probably breaks some features)
var isOnDiv              = false;
var alternateScraperUrl  = "https://worker.mturk.com/overcrazy";
var blockRID   = [];
var blockGID   = [];
var blockTitle = [];
var blockReq   = [];
var watchRID   = [];
var watchGID   = [];
var watchTitle = [];
var watchReq   = [];
//End Global Variables//

$(document).ready(function(){
    start();
    createTabs();
    initializeTabs();
    colorize();
});

function start(){//Things that only need to be executed at startup
    $('head').empty();
    $('body').empty();
    $('head').append(`<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"><link rel="stylesheet" href="/resources/demos/style.css">`);
    var icon = `<link rel="icon" type="image/png" href="http://www.iconarchive.com/download/i89972/icons8/windows-8/Animals-Dog-Bone.ico"></link>`;
    $('head').append(icon);
    loadBlockLists();
    loadWatchLists();
}

function createTabs(){
    var topHTML = `<div id="tabs" ><ul>`;
    var bottomHTML = ``;
    for(curTab = 0; curTab < tabList.length; curTab++){
        topHTML += `<li><a href="#tabs-${curTab+1}" update=${tabList[curTab]}>${tabList[curTab]}</a></li>`;
        bottomHTML += `<div id="tabs-${curTab+1}" tab=${tabList[curTab]} height="100%"><p>${tabList[curTab]}</p></div>`;
    }
    topHTML += `</ul>`;
    bottomHTML += `</div>`;
    $('body').append(topHTML+bottomHTML);
    $( function() {
        var tabs = $( "#tabs" ).tabs({collapsible:collapsableTabs});
        tabs.find( ".ui-tabs-nav" ).sortable({
            axis: "x",
            stop: function() {
                tabs.tabs( "refresh" );
            }
        });
    });
    $('#tabs').css('margin', "-0.5em");
    $('#tabs').css('height', $(window).height() * 0.97);
    $('#tabs').css('padding', '0px');
}

function colorize(){
    $('#tabs').css('background-color', '#b4b7bb');
    $('body').css('background-color', "#454545");
}

function initializeTabs(){
    for(curTab = 0; curTab < tabList.length; curTab++){
        switch(tabList[curTab]){
            case "Dashboard":{
                var dashboardTabs = ["Overview", "Today", "Earnings", "Qualifications"];
                var topHTML = `<div id="dash"><ul>`;
                var bottomHTML = ``;
                for(thisTab = 0; thisTab < dashboardTabs.length; thisTab++){
                    topHTML += `<li><a href="#dash-${thisTab+1}" toggle=${dashboardTabs[thisTab]}>${dashboardTabs[thisTab]}</a></li>`;
                    bottomHTML += `<div id="dash-${thisTab+1}" tab=${dashboardTabs[thisTab]}><p>${dashboardTabs[thisTab]}</p></div>`;
                }
                topHTML += `</ul>`;
                bottomHTML += `</div>`;
                $('div[tab="Dashboard"]').empty();
                $('div[tab="Dashboard"]').append(topHTML+bottomHTML);
                $( function() {
                    var tabs = $( "#dash" ).tabs({collapsible:collapsableTabs});
                    tabs.find( ".ui-tabs-nav" ).sortable({
                        axis: "x",
                        stop: function() {
                            tabs.tabs( "refresh" );
                        }
                    });
                });
                $('#dash').css('padding', '0px');
                $('#dash').css('margin', "-1em");
                $('#dash').css('height', $('#tabs').height()*0.95);
                $('#dash').css('width', $('.ui-tabs-nav').width());
                $('div[tab="Overview"]').empty();
                $('div[tab="Overview"]').append(`<iframe id="dashframe" src="https://worker.mturk.com/dashboard" height=100% width=100%></iframe>`);
                $('#dashframe').css('height', $('#dash').height()*0.90);
                $('#dashframe').css('padding', '0px');
                $('#dashframe').css('margin', "-0.5em");
                break;
            }
            case "Qualifications":{
                //Qualifications tab has been placed into the Dashboards tabs. Enable it in tabList to get it back in the main tab list.
                //The Qualification tab has always been in the Dashboards tabs, its just a good example of how to enable and disable things easily.
                break;
            }
            case "Scraper":{
                $('div[tab=Scraper]').css('height', $('#dash').height()*0.95);
                $('div[tab=Scraper]').css('overflow','auto');
                if(useAlternateScraper){
                    $('div[tab=Scraper]').empty();
                    $('div[tab=Scraper]').append(`<iframe id="scrapeframe" src="${alternateScraperUrl}" height=100% width=100%></iframe>`);
                    $('#scrapeframe').css('height', $('#dash').height()*0.99);
                }else{
                    $('div[tab=Scraper]').mouseenter(function(){
                        isOnDiv=true;
                        setTimeout(function(){
                            isOnDiv=false;
                        },5*1000);
                    });
                    $('div[tab=Scraper]').mouseleave(function(){isOnDiv=false;});
                    scrape();
                }
                break;
            }
            case "Log":{
                break;
            }
            case "Catcher":{
                $('div[tab=Catcher]').empty();
                $('div[tab=Catcher]').append(`<iframe id="pandaframe" src="https://worker.mturk.com/requesters/PandaCrazy/projects" height=100% width=100%></iframe>`);
                $('#pandaframe').css('height', $('#dash').height()*0.95);
                $('#dash').css('padding', '0px');
                $('#dash').css('margin', "-1em");
                break;
            }
            case "Discord":{
                break;
            }
            case "Mods":{//This ones for you, Eisen
                break;
            }
            case "Settings":{
                var settingsTabs = ["General"];
                for(tList=0; tList<tabList.length; tList++){
                    if(tabList[tList] != "Settings"){
                        settingsTabs[tList+1] = tabList[tList];
                    }
                }
                var topHTML2 = `<div id="sett"><ul>`;
                var bottomHTML2 = ``;
                for(thisTab = 0; thisTab < settingsTabs.length; thisTab++){
                    topHTML2 += `<li><a href="#sett-${thisTab+1}" toggle=${settingsTabs[thisTab]+"Settings"}>${settingsTabs[thisTab]}</a></li>`;
                    bottomHTML2 += `<div id="sett-${thisTab+1}" tab=${settingsTabs[thisTab]+"Settings"}><p>${settingsTabs[thisTab]}</p></div>`;
                }
                topHTML2 += `</ul>`;
                bottomHTML2 += `</div>`;
                $('div[tab="Settings"]').empty();
                $('div[tab="Settings"]').append(topHTML2+bottomHTML2);
                $( function() {
                    var tabs = $( "#sett" ).tabs({collapsible:collapsableTabs});
                    tabs.find( ".ui-tabs-nav" ).sortable({
                        axis: "x",
                        stop: function() {
                            tabs.tabs( "refresh" );
                        }
                    });
                });
                $('#sett').css('padding', '0px');
                $('#sett').css('margin', "-1em");
                $('#sett').css('height', $('#tabs').height()*0.95);
                $('#sett').css('width', $('.ui-tabs-nav').width());
                break;
            }
            default:{
                break;
            }
        }
    }
}

function failHandler(xhr) {
    if (true) { // if we want to handle errors at all else we just ignore them
        if (xhr.status === 0) {
            document.title = ("LOGGED OUT");
            GM_openInTab("https://worker.mturk.com/",true);
        } else if (xhr.status == 200) {
            console.log("There was an issue with the JSON object", xhr);
        } else if (xhr.status == 429) {
            //YAY PREs... so the way it works is we stop the script then set time out to start it again at [preBuffer] seconds
            console.log("Page request error detected", xhr.status);
        } else {
            //an error code i havent seen yet just gets the default what did you break message
            console.log("unknown error", xhr.status);
        }
    }
}

function hitBar(obj, identifier){
    var box = $(`<div style="background-color:black; padding:2px; overflow: hidden;">
<div id=reqAccordion-${identifier} style="float:left; width:15%;">
<h3 title=${obj.RID} url=${obj.ReqURL}>${obj.Requester}</h3>
<div>
<div style="margin:-0.5em; height:1.5em">
<button iden=identifier style="left:-1em; float:left; border-color:black; border-style:solid; border-width:1px; background-color:blue; color:white;">Add Watcher</button>
<button iden=identifier style="left:-1em; float:left; border-color:black; border-style:solid; border-width:1px; background-color:red; color:white;">Block</button>
</div>
</div>
</div>
<div id=titleAccordion-${identifier} style="overflow:auto;">
<h3 url=${obj.PandA}>${obj.Title}<button iden=identifier style="float:right;">$${obj.Pay}</button></h3>
<div style="overflow:visible; ">
<p style="margin:-0.5em;">${obj.Description}</p>
<p style="float:right; margin:-0.8em;">${obj.hitAmount}</p>
</div>
</div>`);
    return box;
}
function getScrapeURL(){
    var URL1 = `https://worker.mturk.com/?filters%5Bsearch_term%5D=&page_size=100&format=json&filters%5Bqualified%5D=`;
    var URL2 = "&filters%5Bmasters%5D=false&sort=updated_desc&format=json&filters%5Bmin_reward%5D=&page_number=1";
    var onlyShowQualled = false; //change this to true to only alert to HITs you qualify for
    var qual = onlyShowQualled ? "true" : "false";//Use the var above to set qualified on
    return URL1 + qual + URL2;
}

function scrape(){
    $.get(getScrapeURL(), (function(data, status, xhr) {
        //we send our get request and call a function with the data returned as the input
        resultPages = (Math.ceil((data.total_num_results) / 100)); // we set the amount of pages currently available (this is given 50 results per page which is OW default)
        var hitObject = {};
        if(!isOnDiv){
            $('div[tab=Scraper]').empty();
        }
        for (i = 0; i <data.results.length; i++) { //for every HIT we're going to do the following
            //console.log(data.results[i]);
            hitObject.RID = data.results[i].requester_id;
            hitObject.GID = data.results[i].hit_set_id;
            hitObject.Title = data.results[i].title;
            hitObject.Requester = data.results[i].requester_name;
            hitObject.Qualified = data.results[i].caller_meets_requirements;
            hitObject.Requirements = data.results[i].project_requirements;
            hitObject.Preview = "https://worker.mturk.com/projects/" + hitObject.GID + "/tasks?ref=w_pl_prvw";
            hitObject.PandA = "https://worker.mturk.com/projects/" + hitObject.GID + "/tasks/accept_random?ref=w_pl_prvw";
            hitObject.ReqURL = "https://worker.mturk.com/requesters/" + hitObject.RID + "/projects?ref=w_pl_prvw";
            hitObject.Description = data.results[i].description;
            hitObject.Duration = data.results[i].assignment_duration_in_seconds;
            hitObject.hitAmount = data.results[i].assignable_hits_count;
            hitObject.Pay = data.results[i].monetary_reward.amount_in_dollars.toFixed(2);
            if(block(hitObject)){
                console.log("Blocked HIT "+hitObject.Title);
            }else{
                logHit();
                checkWatch();
                if(filter(hitObject)){
                    console.log("Filtering from scrape feed "+hitObject.Title);
                }else{
                    drawHitBar(hitObject, i);
                }
            }
        }//end for loop
    })).fail(function(xhr) { //this handles all our possible request failures, the failHandler function should be directly below
        failHandler(xhr);
    });
    setTimeout(function(){scrape();},2000);
}

function drawHitBar(hitObject, i){
    if(isOnDiv) return;
    $('div[tab=Scraper]').append(hitBar(hitObject, i));
    $(`button[iden=${i}]`).button();
    $(`#titleAccordion-${i}`).accordion({collapsible: true, active:false });
    $(`#reqAccordion-${i}`).accordion({
        active: false,
        collapsible: true,
        heightStyle: "content",
        autoHeight: false,
        clearStyle: true,
    });
}

function block(hitObject){
    var block = false;
    for(w=0;w<1;w++){
        if(hitObject.RID == blockRID[w]){
            block = true;
        }
    }
    for(x=0;x<blockGID.length;x++){
        if(hitObject.GID == blockGID[x]){
            block = true;
        }
    }
    for(y=0;y<blockTitle.length;y++){
        if(hitObject.Title == blockTitle[y]){
            block = true;
        }
    }
    for(z=0;z<blockReq.length;z++){
        if(hitObject.Requester == blockReq[z]){
            block = true;
        }
    }
    return block;
}

function checkWatch(hitObject){
    return false;
}

function filter(hitObject){
    return false;
}

function logHit(hitObject){

}

function loadBlockLists(){
    if(localStorage.blockRID){
        var list1 = localStorage.blockRID;
        if(list1.indexOf(',') >= 0){
            blockRID = list1.split(',');
        }else{
            blockRID[0] = list1;
        }
    }else{
        localStorage.blockRID = "";
    }
    if(localStorage.blockGID){
        var list2 = localStorage.blockGID;
        if(list2.indexOf(',') >= 0){
            blockGID = list2.split(',');
        }else{
            blockGID[0] = list2;
        }
    }else{
        localStorage.blockGID = "";
    }
    if(localStorage.blockTitle){
        var list3 = localStorage.blockTitle;
        if(list3.indexOf(',') >= 0){
            blockTitle = list3.split(',');
        }else{
            blockTitle[0] = list3;
        }
    }else{
        localStorage.blockTitle = "";
    }
    if(localStorage.blockReq){
        var list4 = localStorage.blockReq;
        if(list4.indexOf(',') >= 0){
            blockReq = list4.split(',');
        }else{
            blockReq[0] = list4;
        }
    }else{
        localStorage.blockReq = "";
    }
}

function loadWatchLists(){
    if(localStorage.watchRID){
        var list1 = localStorage.watchRID;
        if(list1.indexOf(',') >= 0){
            watchRID = list1.split(',');
        }else{
            watchRID[0] = list1;
        }
    }
    if(localStorage.watchGID){
        var list2 = localStorage.watchGID;
        if(list2.indexOf(',') >= 0){
            watchGID = list2.split(',');
        }else{
            watchGID[0] = list2;
        }
    }
    if(localStorage.watchTitle){
        var list3 = localStorage.watchTitle;
        if(list3.indexOf(',') >= 0){
            watchTitle = list3.split(',');
        }else{
            watchtitle[0] = list3;
        }
    }
    if(localStorage.watchReq){
        var list4 = localStorage.watchReq;
        if(list4.indexOf(',') >= 0){
            watchReq = list4.split(',');
        }else{
            watchReq[0] = list4;
        }
    }
}

$(document).on("click", 'a[toggle=Qualifications]', function(){
    if (qualificationsLoaded) return;
    $('div[tab="Qualifications"]').empty();
    $('div[tab="Qualifications"]').append(`<iframe id="qualframe" src="https://worker.mturk.com/qualtable" height=100% width=100%></iframe>`);
    $('#qualframe').css('height', $('#dash').height()*0.90);
    $('#qualframe').css('padding', '0px');
    $('#qualframe').css('margin', "-0.5em");
    qualificationsLoaded = true;
});

$(document).on("contextmenu", "h3", function(e){
    GM_openInTab($(this).attr('url'), false);
    return false;
});

function pushbullet(){
    var API_KEY = gmGet('pbApiKey');
    var TARGET_EMAIL = ""; // add the email you wish to push to
    var newPush = {};
    newPush.email = TARGET_EMAIL;
    newPush.type = "link"; // change the type to push a note, file, list, or location
    newPush.title = hitObject.Requester;
    newPush.body = hitObject.Title;
    newPush.url = hitObject.PandA;
    $.ajax({
        type: "POST",
        headers: {"Authorization": "Bearer " + API_KEY},
        url: "https://api.pushbullet.com/v2/pushes",
        data: newPush
    });
}