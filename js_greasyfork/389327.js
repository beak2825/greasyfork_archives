// ==UserScript==
// @name         HaremHeroes Automatic Reloaded
// @namespace    haremheroes.com
// @version      4.8.0
// @description  This script will allow the user to automate almost every aspect in the game. Simply choose what part of the game you want to automate by opening the top-right menu (hamburger button)
// @author       Spychopat
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @require      https://cdn.jsdelivr.net/js-cookie/2.2.0/js.cookie.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389327/HaremHeroes%20Automatic%20Reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/389327/HaremHeroes%20Automatic%20Reloaded.meta.js
// ==/UserScript==


// if set to 1, the script will stay on harem page after salary gathering if it was on home page previously
// if you was on another page than "home", then you will be back to it after salary gathering
// considering the salary is the most common action of the script, staying on harem page will reduce traffic
var stayOnHaremPage = 1;

// The following variables are avalaible to the user for cusomization
// Each variable set if each option should be enabled by default (ie. opening a new tab of the game)
// 0 = disabled by default
// 1 = enabled by default
var defaultAutoSalary = 0;
var defaultDailyQuests = 0;
var defaultAutoQuest = 0;
var defaultAutoArena = 0;
var defaultAutoLeague = 0;
var defaultAutoTroll = 0;
var defaultAutoChampion = 0;
var defaultBooster = 0;
var defaultAutoMarketXp = 0;
var defaultAutoMarketGift = 0;

// if set to 1, the menu will re-open automatically if the page is changed while it's already opened
var persistentMenu = 0;

// time between loops
var autoLoopTimeMili = 250;

// set how many loops will be skipped before starting to work again
var loopPause = 0;

// necessary to bypass the anti-cheat protection
is_cheat_click = function(e) {return false;};

// Trolls' database
var Trolls = ['Dark Lord', 'Ninja Spy', 'Gruntt', 'Edwarda', 'Donatien', 'Silvanus', 'Bremen', 'Finalmecia', 'Roko Senseï', 'Karole', 'Jackson\'s Crew', 'Boss 12', 'Boss 13', 'Boss 14', 'Boss 15'];


// custom css
GM_addStyle('.autoSliderIcon{margin-left: 10px;margin-right: 10px;margin-bottom: 3px;width: 30px;height: 30px;} /* The switch - the box around the slider */ .switch { position: relative; display: inline-block; width: 60px; height: 34px; } /* Hide default HTML checkbox */ .switch input {display:none;} /* The slider */ .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider.round:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked + .slider { background-color: #2196F3; } input:focus + .slider { box-shadow: 0 0 1px #2196F3; } input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } /* Rounded sliders */ .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; }');

function selectLowestLevelGirlCss(){
    sheet.insertRule('select_low_girl{'
                     +'display:block;'
                     +'cursor: pointer;'
                     +'color:#fff;'
                     +'border-radius:7px;'
                     +'text-align:center;'
                     +'background:#057;'
                     +'background:-webkit-linear-gradient(-90deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'background:-moz-linear-gradient(180deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'border: 1px solid #000!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6), inset 0 3px 0 #6df0ff;');
    sheet.insertRule('select_low_girl[disabled]{'
                     +'background-image:linear-gradient(to top,#9f9296 0,#847c85 100%)!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;');
}

function buyMaxStatCss(){
    sheet.insertRule('plus_buy_all{'
                     +'display:block;'
                     +'position:static;'
                     +'top:0;right:0;'
                     +'color:#fff;'
                     +'height:95%;'
                     +'text-decoration:none;'
                     +'padding-left: 5px;'
                     +'padding-right: 5px;'
                     +'-webkit-border-radius:10%;'
                     +'-moz-border-radius:10%;'
                     +'border-radius:10%;'
                     +'cursor:pointer;'
                     +'text-align:center;'
                     +'background:#057;'
                     +'background:-webkit-linear-gradient(-90deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'background:-moz-linear-gradient(180deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'border: 1px solid #000!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6), inset 0 3px 0 #6df0ff;');
    sheet.insertRule('plus_buy_all[disabled]{'
                     +'background-image:linear-gradient(to top,#9f9296 0,#847c85 100%)!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;');

   sheet.insertRule('#shops #equiped div.sub_block .hero_stats>div>[cur]{'
                    +'display: none;');


    sheet.insertRule('.BuyMax:hover + div {' +
                     'opacity: 1;' +
                     'visibility: visible; }');

    sheet.insertRule('.BuyMaxTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 11;'
                     + 'min-width: 85;'
                     + 'border: 1px solid rgb(255, 255, 255,.73);'
                     + 'border-radius: 7px;'
                     + 'background: #ccd7dd;'
                     + 'padding: 4px 8px 6px;'
                     + 'font-size: 13px;'
                     + 'color: #057;'
                     + 'text-align: left;'
                     + 'pointer-events: none;'
                     + 'visibility: hidden;');

    sheet.insertRule('.BuyMaxIcon{'
                     + 'margin-left: 5px;'
                     + 'width: 20px;'
                     + 'height: 20px;}');

}



var sheet = (function() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

function getHero() {
    return unsafeWindow.Hero;
}

function getGirlsMap() {
    return unsafeWindow.GirlSalaryManager.girlsMap;
}

function getPage() {
    try{
        var ob = document.getElementById("hh_nutaku");
        if(ob===undefined || ob === null)
        {
            ob = document.getElementById("hh_hentai");
        }
        return ob.className.match(/.*page-(.*) .*/i)[1];
    }
    catch(err)
    {
        return ""
    }
}

function timerToString(timer) {
    var totalSeconds = Number(timer);
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);
    var res = "";
    if(hours > 0)
        res += hours+"h";
    if(minutes > 0)
        res += minutes+"m";
    res += seconds+"s";
    return res;
}

// Retruns true if on correct page.
function gotoPage(page) {
    if(getPage() === page || (getPage() === 'missions' && page === 'activities'))
    {
        return true;
    }
    else
    {
        //console.log("Navigating to page: "+page);
        var togoto = undefined;
        // get page path
        switch(page)
        {
            case "missions":
                togoto = "/activities.html?tab=missions";
                break;
            case "activities":
                togoto = "/activities.html?tab=contests";
                break;
            case "harem":
                togoto = $("nav div[rel='content'] a:has(.harem)").attr("href");
                break;
            case "map":
                togoto = $("nav div[rel='content'] a:has(.map)").attr("href");
                break;
            case "arena":
                togoto = $("nav div[rel='content'] a:has(.battle)").attr("href");
                break;
            case "pachinko":
                togoto = $("nav div[rel='content'] a:has(.pachinko)").attr("href");
                break;
            case "quest":
                togoto = getHero().infos.questing.current_url;
                //console.log("Current quest page: "+togoto);
                break;
            default:
                //console.log("Unknown goto page request. No page \'"+page+"\' defined.");
        }
        if(togoto != undefined)
        {
            sessionStorage.autoLoop = "false";
            window.location = window.location.origin + togoto;
        }
        else //console.log("Couldn't find page path. Page was undefined...");
        return false;
    }
}

var proceedQuest = function () {
    //console.log("Starting auto quest.");
    // Check if at correct page.
    if (!gotoPage("quest")) {
        // Click on current quest to naviagte to it.
        //console.log("Navigating to current quest.");
        return;
    }

    // Get the proceed button type
    var proceedButtonMatch = $("#controls button:not([style='display: none;'])");
    var proceedCostEnergy = Number($("#controls .cost span[cur='*']").text());
    var proceedCostMoney = Number($("#controls .cost span[cur='$']").text().trim().replace(',', ''));
    var proceedType = proceedButtonMatch.attr("act");

    if (proceedButtonMatch.length === 0)
        console.log("Could not find resume button.");
    else if (proceedType === "free") {
        //console.log("Proceeding for free.");
        proceedButtonMatch.click();
    }
    else if (proceedType === "pay") {
        var energyCurrent = getHero().infos.energy_quest;
        var moneyCurrent = getHero().infos.soft_currency;
        if(proceedCostEnergy > energyCurrent)
        {
            //console.log("Quest requires "+proceedCostEnergy+" Energy to proceed.");
            sessionStorage.questRequirement = "*"+proceedCostEnergy;
            return;
        }
        if(proceedCostMoney > moneyCurrent)
        {
            //console.log("Spending "+proceedCostEnergy+" Money to proceed.");
            sessionStorage.questRequirement = "$"+proceedCostMoney;
            return;
        }
        proceedButtonMatch.click();
        sessionStorage.autoLoop = "false";
        location.reload();
    }
    else if (proceedType === "use_item") {
        //console.log("Proceeding by using X" + Number($("#controls .item span").text()) + " of the required item.");
        proceedButtonMatch.click();
    }
    else if (proceedType === "battle") {
        //console.log("Proceeding to battle troll...");
        sessionStorage.questRequirement = "battle";
        // Proceed to battle troll.
        proceedButtonMatch.click();
        sessionStorage.autoLoop = "false";
        location.reload();
    }
    else if (proceedType === "end_archive") {
        //console.log("Reached end of current archive. Proceeding to next archive.");
        sessionStorage.autoLoop = "false";
        proceedButtonMatch.click();
    }
    else if (proceedType === "end_play") {
        //console.log("Reached end of current play. Proceeding to next play.");
        sessionStorage.autoLoop = "false";
        proceedButtonMatch.click();
    }
    else {
        //console.log("Could not identify given resume button.");
        sessionStorage.questRequirement = "unknownQuestButton";
    }
};

/**
* Recieves a list of mission objects and returns the mission object to use.
* A mission object looks similar to this :-
* Eg 1:   {"id_member_mission":"256160093","id_mission":"23","duration":"53","cost":"1","remaining_time":"-83057","rewards":[{"classList":{"0":"slot","1":"slot_xp"},"type":"xp","data":28},{"classList":{"0":"slot","1":"slot_SC"},"type":"money","data":277}]}
* Eg 2:   {"id_member_mission":"256160095","id_mission":"10","duration":"53","cost":"1","remaining_time":"-81330","rewards":[{"classList":{"0":"slot","1":"slot_xp"},"type":"xp","data":28},{"classList":{"0":"slot","1":"rare"},"type":"item","data":{"id_item":"23","type":"gift","subtype":"0","identifier":"K3","rarity":"rare","value":"80","carac1":0,"carac2":0,"carac3":0,"endurance":0,"chance":0,"ego":0,"damage":0,"duration":0,"level_mini":"1","name":"Bracelet","Name":"Bracelet","ico":"https://content.haremheroes.com/pictures/items/K3.png","price_sell":5561,"count":1,"id_m_i":[]}}]}
* Eg 3:   {"id_member_mission":"256822795","id_mission":"337","duration":"17172","cost":"144","remaining_time":null,"remaining_cost":"144","rewards":[{"classList":{"0":"slot","1":"slot_HC"},"type":"koban","data":11}]}
* Eg 1 has mission rewards of xp and money.
* Eg 2 has mission rewards of xp and item.
* Eg 3 has mission rewards of koban/hard_currency.
* cost is the koban price for instant complete.
*/
function getSuitableMission(missionsList) {
    var msn = missionsList[0];
    for(var m in missionsList)
    {
        if(Number(msn.duration) > Number(missionsList[m].duration))
        {
            msn = missionsList[m];
        }
    }
    return msn;
}

// returns boolean to set busy
function doMissionStuff() {
    if(!gotoPage("missions"))
    {
        //console.log("Navigating to activities page.");
        // return busy
        return true;
    }
    else
    {
        //console.log("On activities page.");
        //console.log("Collecting finished mission's reward.");
        $(".mission_button button:visible[rel='claim']").click();
        // TODO: select new missions and parse reward data from HTML, it's there in data attributes of tags
        var missions = [];
        var allGood = true;
        // parse missions
        $(".mission_object").each(function(idx,missionObject){
            var data = $.data(missionObject).d;
            // Do not list completed missions
            if(data.remaining_time !== null){
                // This is not a fresh mission
                if(data.remaining_time > 0)
                {
                    //console.log("Unfinished mission detected...("+data.remaining_time+"sec. remaining)");
                    Cookies.set('nextMissionTime',timerToString(data).remaining_time,{expires:new Date(new Date().getTime() + data.remaining_time * 1000)});
                }
                else{
                    //console.log("Unclaimed mission detected...");
                }
                allGood = false;
                return;
            }
            data.missionObject = missionObject;
            var rewards = [];
            // set rewards
            {
                // get Reward slots
                var slots = missionObject.querySelectorAll(".slot");
                // traverse slots
                $.each(slots,function(idx,slotDiv){
                    var reward = {};
                    // get slot class list
                    reward.classList = slotDiv.classList;
                    // set reward type
                    if(reward.classList.contains("slot_xp"))reward.type = "xp";
                    else if(reward.classList.contains("slot_SC"))reward.type = "money";
                    else if(reward.classList.contains("slot_HC"))reward.type = "koban";
                    else reward.type = "item";
                    // set value if xp
                    if(reward.type === "xp" || reward.type === "money" || reward.type === "koban")
                    {
                        // remove all non numbers and HTML tags
                        try{
                            reward.data = Number(slotDiv.innerHTML.replace(/<.*?>/g,'').replace(/\D/g,''));
                        }
                        catch(e){
                            //console.log("Couldn't parse xp/money data.");
                            //console.log(slotDiv);
                        }
                    }
                    // set item details if item
                    else if(reward.type === "item")
                    {
                        try{
                            reward.data = $.data(slotDiv).d;
                        }
                        catch(e){
                            //console.log("Couldn't parse item reward slot details.");
                            //console.log(slotDiv);
                            reward.type = "unknown";
                        }
                    }
                    rewards.push(reward);
                });
            }
            data.rewards = rewards;
            missions.push(data);
        });
        if(!allGood){
            //console.log("Something went wrong, need to retry later...");
            // busy
            return true;
        }
        //console.log("Missions parsed, mission list is:-");
        //console.log(missions);
        if(missions.length > 0)
        {
            //console.log("Selecting mission from list.");
            var mission = getSuitableMission(missions);
            //console.log("Selected mission:-");
            //console.log(mission);
            //console.log("Selected mission duration: "+mission.duration+"sec.");
            var missionButton = $(mission.missionObject).find("button:visible").first();
            //console.log("Mission button of type: "+missionButton.attr("rel"));
            //console.log("Clicking mission button.");
            missionButton.click();
            Cookies.set('nextMissionTime',timerToString(mission).duration,{expires:new Date(new Date().getTime() + mission.duration * 1000)});
        }
        else{
            //console.log("No missions detected...!");
            // get gift
            var ck = Cookies.get('nextMissionTime');
            var isAfterGift = document.querySelector("#missions .after_gift").style.display === 'block';
            if(!isAfterGift){
                if(ck === undefined || ck === 'giftleft')
                {
                    //console.log("Collecting gift.");
                    // click button
                    document.querySelector(".end_gift button").click();
                }
                else{
                    //console.log("Refreshing to collect gift...");
                    Cookies.set('nextMissionTime','giftleft');
                    window.reload();
                    // is busy
                    return true;
                }
            }
            var time = 0;
            for(var e in unsafeWindow.HHTimers.timers){
                try{if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes("#missions_counter"))
                    time=unsafeWindow.HHTimers.timers[e];
                   }
                catch(e){}
            }
            time = time.remainingTime;
            if(time === undefined)
            {
                //try again with different selector
                for(e in unsafeWindow.HHTimers.timers){
                    try{if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".after_gift"))
                        time=unsafeWindow.HHTimers.timers[e];
                       }
                    catch(e){}
                }
                time = time.remainingTime;
            }
            if(time === undefined){
                //console.log("New mission time was undefined... Setting it manually to 10min.");
                time = 10*60;
            }
            //console.log("New missions in: "+time+"sec.");
            Cookies.set('nextMissionTime',timerToString(time),{expires:new Date(new Date().getTime() + time * 1000)});
        }
        // not busy
        return false;
    }
}

// returns boolean to set busy
function doContestStuff() {
    if(!gotoPage("activities"))
    {
        //console.log("Navigating to activities page.");
        // return busy
        return true;
    }
    else
    {
        //console.log("On activities page.");
        //console.log("Collecting finished contests's reward.");
        $(".contest .ended button[rel='claim']").click();
        // need to get next contest timer data
        var time = 0;
        for(var e in unsafeWindow.HHTimers.timers){
            try{if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".contest_timer"))
                time=unsafeWindow.HHTimers.timers[e];
               }
            catch(e){}
        }
        time = time.remainingTime;
        try{if(time === undefined)
        {
            //try again with different selector
            time = undefined;
            for(e in unsafeWindow.HHTimers.timers){
                if(unsafeWindow.HHTimers.timers[e].$elm[0].className.includes("contest_timer"))
                    // get closest time
                    if(!(unsafeWindow.HHTimers.timers[e].remainingTime>time))
                        time=unsafeWindow.HHTimers.timers[e].remainingTime;
            }
        }}catch(e){}
        if(time === undefined){
            //console.log("New contest time was undefined... Setting it manually to 10min.");
            time = 10*60;
        }
        Cookies.set('nextContestTime',timerToString(time),{expires:new Date(new Date().getTime() + time * 1000)});
        //console.log("Next contest time stored in nextContestTime cookie.(+" + time + " sec.)");
        // Not busy
        return false;
    }
}

var getSalary = function () {
    try {
        if(!gotoPage("harem"))
        {
            // Not at Harem screen then goto the Harem screen.
            //console.log("Navigating to Harem window.");
            // return busy
            return true;
        }
        else {
            //console.log("Detected Harem Screen. Fetching Salary");
            /*
            $("#harem_whole #harem_left .salary:not('.loads') button").each(function (index) {
                $(this).click();
            });
            */
            // my personal anti-anti-cheat, we are not clicking anymore, but directly calling the salary fetching function
            var my_girls = GirlSalaryManager.girlsMap;
            var i;
            for (i in my_girls) {
                if (my_girls[i].readyForCollect) {
                    my_girls[i].onSalaryBtnClicked(this);
                    return; // adding this line in hope it will help with the persistent lag issue
                }
            }

            //console.log("Salary fetched. Getting next fetch time");
            // In seconds
            var gMap = getGirlsMap();
            var closestTime = undefined;
            if(gMap === undefined)
            {
                // error
                //console.log("Girls Map was undefined...! Error, manually setting salary time to 2 min.");
                closestTime = 120;
            }
            else
            {
                try{
                    // Calc. closest time
                    for(var key in gMap)
                    {
                        // undefined comparision is always false so first iteration is false, hence the not(!)
                        if(!(closestTime<gMap[key].gData.pay_in))
                        {
                            closestTime = gMap[key].gData.pay_in;
                            //closestTime += 5; // adding some extra time
                        }
                    }
                }
                catch(exp){
                    // error
                    //console.log("Girls Map had undefined property...! Error, manually setting salary time to 2 min.");
                    closestTime = 120;
                }
            }
            if(closestTime === undefined)
            {
                //console.log("closestTime was undefined...! Error, manually setting salary time to 2 min.");
                closestTime = 120;
            }
            Cookies.set('nextSalaryTime',timerToString(closestTime),{expires:new Date(new Date().getTime() + closestTime * 1000)});
            // stays on harem page if we was on "home" page just before, can be disabled with one of the variable in the very begining of the script
            if(stayOnHaremPage === 1 && sessionStorage.userLink.endsWith("home.html"))
                sessionStorage.userLink = "none";
            // return not busy
            return false;
        }
    }
    catch (ex) {
        //console.log("Could not collect salary... " + ex);
        // return not busy
        return false;
    }
};

var checkIfBossStillHasGirlRewards = function() {
    // si le boss n'a aucune fille a droper, on change de troll et on essaye le precedent
    if(document.getElementsByClassName("girls_reward girl_ico").length == 0) {
        if(localStorage.getItem("auto_girl") >= (getHero().infos.questing.id_world - 1)) {
            // aucune fille dispo, mais c'est le dernier boss, donc on le combat quand même
            // a la place, on peut aussi desactiver l'auto troll automatiquemnt si ca arrive, il suffit supprimer "return true;" et de décommenter les 4 prochaines lignes (c'est l'ancienne méthode)
            // le defaut avec ce "return true" c'est que si il y a un event sur le dernier boss, alors le script pensera qu'on a deja debloquer toutes les filles avant :/
            return true;
            /*// si on est remonter jusqu'au dernier boss, alors on remet le troll sur dark lord et on desactive auto troll battle
            localStorage.setItem("auto_girl",1);
            document.getElementById("autoBattleCheckbox").checked = false;
            sessionStorage.autoTrollBattle = "false";
            return false;*/
        }
        localStorage.setItem("auto_girl",parseInt(localStorage.getItem("auto_girl")) + 1)
        window.location = window.location.origin + "/battle.html?id_troll=" + localStorage.getItem("auto_girl");
        return false;
    }
    return true;
}

var doBossBattle = function() {
    if(window.location.pathname.startsWith("/battle.html") && !$("#battle_middle button[rel='launch']:not(.autofight)")[0].disabled)
    {
        // si la selection du troll est sur "auto" alors on vérifie que le troll a encore des filles a droper
        if(sessionStorage.autoTrollSelectedIndex === "0")
            if(!checkIfBossStillHasGirlRewards()){
                window.location = window.location.origin + "/home.html"; // on vas sur la page d'accueil pour verifier si il n'y a pas une autre fille d'event
                return;
            }
        var battleButton = $("#battle_middle button[rel='launch']:not(.autofight)");
        battleButton.click();
        setTimeout(function(){$("#battle_middle button[rel='skip']").click();},1000);
    }
    else
    {
        var trollID = sessionStorage.autoTrollSelectedIndex;

        // on s'assure d'être sur la page d'accueil avant le combat pour que le troll auto soit bien à jour
        if(!window.location.pathname.startsWith("/home.html") && trollID === "0" && Cookies.get("nextCheckEventGirl") === undefined){
            var nextCheckEventGirlTime = 1500;
            Cookies.set('nextCheckEventGirl',timerToString(nextCheckEventGirlTime),{expires:new Date(new Date().getTime() + nextCheckEventGirlTime * 1000)});
            window.location = window.location.origin + "/home.html";
            return;
        }

        if(trollID === "0") {
            // uniquement en cas de probleme technique, cette verification permet d'eviter de combattre un boss inexistant
            if(localStorage.getItem("auto_girl") > (getHero().infos.questing.id_world - 1)) {
                localStorage.setItem("auto_girl",1);
            }

            trollID = localStorage.getItem("auto_girl");
            //trollID = getHero().infos.questing.id_world - 1
        }
        //console.log("Going to meet " + sessionStorage.trollToFight + " id:" + trollID);
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + "/battle.html?id_troll=" + trollID;
        return;
    }
};


var doLeague = function() {
    if(window.location.pathname.startsWith("/battle.html")  && !$("#battle_middle button[rel='launch']:not(.autofight)")[0].disabled)
    {
        var battleButton = $("#battle_middle button[rel='launch']:not(.autofight)");
        battleButton.click();
        setTimeout(function(){$("#battle_middle button[rel='skip']").click();},1000);
    }
    else if(window.location.pathname.startsWith("/tower-of-fame"))
    {
        var claimRewardButton = $("button[class='purple_button_L']");
        if(claimRewardButton.length>0)
            claimRewardButton[0].click();
        if(typeof leagues_list === 'undefined') {
            // cannot retrieve player list, retrying in 2 minutes
            var retryLeagueTime = 120;
            Cookies.set('nextLeagueTime',timerToString(retryLeagueTime),{expires:new Date(new Date().getTime() + retryLeagueTime * 1000)});
            //document.getElementById("autoLeagueCheckbox").checked = false;
            return;
        }
        var i;
        for (i in leagues_list) {
            if (leagues_list[i].nb_challenges_played != "3" && getHero().infos.id.toString() != leagues_list[i].id_player) {
                //console.log("Fighting the first opponent avalaible on the list (id="+leagues_list[i].id_player+")");
                window.location = window.location.origin + "/battle.html?league_battle=1&id_member=" + leagues_list[i].id_player;
                return;
            }
        }
        // if this code is reached, that means we already did all the avalaible fights for this week, so we need to set a timer
        var leagueTime = 0;
        for(var e in unsafeWindow.HHTimers.timers){
            if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".league_end_in [rel=\"timer\"]")) // on veut le timer de fin de league
                leagueTime = unsafeWindow.HHTimers.timers[e].remainingTime;
        }
        if(leagueTime>0) {
            leagueTime = leagueTime + 5; // c'est pas vraiment necessaire, mais j'aime bien rajouter 5 secondes sur le timer histoire d'etre large
            Cookies.set('nextLeagueTime',timerToString(leagueTime),{expires:new Date(new Date().getTime() + leagueTime * 1000)});
        }
    }
    else
    {
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + "/tower-of-fame.html";
        return;
    }
}

var mouseOverEvent = new MouseEvent('mouseover', {
  'view': unsafeWindow,
  'bubbles': true,
  'cancelable': true
});

var doBooster = function() {
    if(window.location.pathname.startsWith("/shop.html"))
    {
        var buyableGear = $("div.sub_block.ui-droppable div.armor div.slot.ui-draggable");
        var inventoryBoosters = $("div.sub_block[id=inventory] div.booster div.slot.ui-draggable");
        var emptyBoosterSlots = $("div.armor.booster div.slot.empty");

        //equipping boosters
        if(emptyBoosterSlots.length > 0 && inventoryBoosters.length > 0) {
            $("[id=type_item] [type=booster]").click();
            //console.log("Equipping booster");
            inventoryBoosters[(inventoryBoosters.length-1)].click();
            $("[rel=use]")[0].click();
            return;
        }

        // if every booster is equipped, setting a new timer cookie
        // WARNING : we are checking if a gear (armor & weapon) is present in slot 0 to check if the market is correctly loaded
        // if the user buy all the gear, then the script will never leave the page (but it's very unlikely xD)
        if(buyableGear[0] != undefined && // checking if market is correctly loaded
           (emptyBoosterSlots.length === 0 || inventoryBoosters.length === 0)){ // checking if boosters have been used

            var equippedBoosters = $("div.armor.booster div.sub_block div.slot");
            var boostersTimer = 86400; // 24hours default
            for(var i=0; i<equippedBoosters.length; i++){
                // putting the "mouse" over the booster, to make the timer appears in timers list
                equippedBoosters[i].dispatchEvent(mouseOverEvent);
                for(var e in unsafeWindow.HHTimers.timers){
                    if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".item-duration-time") && unsafeWindow.HHTimers.timers[e].remainingTime < boostersTimer) // item duration timer
                        boostersTimer = unsafeWindow.HHTimers.timers[e].remainingTime;
                }
            }
            //console.log("remaining booster time: "+boostersTimer);
            // if time is 86400 (default value), it means there was an error gathering timer, we set the time to 30min then
            // if there is still booster slot empty, we check back again in 30 min if there's new booster to equip
            if(boostersTimer == 86400 || emptyBoosterSlots.length > 0){
                boostersTimer = 1798;
            }
            boostersTimer = Number(boostersTimer)+2; // adding 2 sec to be sure to not be too early
            Cookies.set('nextBoosterTime',timerToString(boostersTimer),{expires:new Date(new Date().getTime() + boostersTimer * 1000)});
        }

    } else {
        window.location = window.location.origin + "/shop.html";
    }
}

var doMarket = function() {
    if(window.location.pathname.startsWith("/shop.html"))
    {
        var buyableExpBooks = $("div.sub_block.ui-droppable div.potion div.slot.ui-draggable");
        var buyableGifts = $("div.sub_block.ui-droppable div.gift div.slot.ui-draggable");
        var buyableGear = $("div.sub_block.ui-droppable div.armor div.slot.ui-draggable");

        // buying XP books
        if(sessionStorage.autoMarketXp === "true" && buyableExpBooks.length > 0) {
            $("[id=type_item] [type=potion]").click();
            //console.log("Buying an EXP book");
            buyableExpBooks[0].click();
            $("[rel=buy]")[0].click();
        }

        // buying gifts
        else if(sessionStorage.autoMarketGift === "true" && buyableGifts.length > 0) {
            $("[id=type_item] [type=gift]").click();
            //console.log("Buying a gift");
            buyableGifts[0].click();
            $("[rel=buy]")[0].click();
        }

        // if everything is bought, setting a new timer cookie
        // WARNING : we are checking if a gear (armor & weapon) is present in slot 0 to check if the market is correctly loaded
        // if the user buy all the gear, then the script will never leave the page (but it's very unlikely xD)
        if((buyableExpBooks[0] === undefined || sessionStorage.autoMarketXp != "true") && // checking if all XP is bought or if auto buy is not activated
           (buyableGifts[0] === undefined || sessionStorage.autoMarketGift != "true") && // checking if al gifts are bought or if auto buy is not activated
           buyableGear[0] != undefined) { // checking if market is correctly loaded
            var marketTime = 0;
            for(var e in unsafeWindow.HHTimers.timers){
                if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".shop_count")) // on veut le timer du marché
                    marketTime = unsafeWindow.HHTimers.timers[e].remainingTime;
            }
            marketTime = Number(marketTime)+2; // adding 2 sec to be sure to not be too early
            Cookies.set('nextMarketTime',timerToString(marketTime),{expires:new Date(new Date().getTime() + marketTime * 1000)});
        } else if ($(".popup_message0").length!=0){ // in the case the user don't have enough money, we're using the pop up message to detect it, we set the timer to 30 minutes
            var marketTimeBis = 1800;
            Cookies.set('nextMarketTime',timerToString(marketTimeBis),{expires:new Date(new Date().getTime() + marketTimeBis * 1000)});
        }
    } else {
        window.location = window.location.origin + "/shop.html";
    }
}

var doChampion = function() {
    if(window.location.pathname.startsWith("/home.html"))
    {
        if(sessionStorage.autoChampionSelectedIndex === '0'){ // le cas ou on a l'option sur "all champion", alors on recupere le timer general
            var championTime = 0;
            // on chope le timer
            for(var e in unsafeWindow.HHTimers.timers){
                if(unsafeWindow.HHTimers.timers[e].$elm.selector.includes(".champion-timer")) // on veut le timer du champion
                    championTime = unsafeWindow.HHTimers.timers[e].remainingTime;
            }
            // si il reste du temps avant le prochain champion, alors on l'enregistre puis on return, sinon on continue
            if(championTime > 0){
                championTime = championTime + 5; // +5 secondes
                Cookies.set('nextChampionTime',timerToString(championTime),{expires:new Date(new Date().getTime() + championTime * 1000)});
                return;
            } else {
                window.location = window.location.origin + "/champions-map.html";
            }
        } else { // le cas ou on a l'option sur un champion specifique, alors on y vas directement
            window.location = window.location.origin + "/champions/" + sessionStorage.autoChampionSelectedIndex;
        }
    } else if(window.location.pathname.startsWith("/champions/")) // on est sur une page de champion, donc on le combat (tant pis si c'est pas le bon, c'est la faute de l'utilisateur si ca plante xD)
    {
        //dans le cas ou on combat un champion specifique, il faut d'abord verifier son timer
        if(sessionStorage.autoChampionSelectedIndex != '0') {
            var specificChampionTime = 0;
            // on chope le timer
            for(var x in unsafeWindow.HHTimers.timers){
                if(unsafeWindow.HHTimers.timers[x].$elm.context.getAttribute('property') === "championRest" || // timer dans le cas ou c'est le champion qui doit se reposer
                   unsafeWindow.HHTimers.timers[x].$elm.context.getAttribute('property') === "teamRest") // timer dans le cas ou c'est la team qui doit se reposer
                    specificChampionTime = unsafeWindow.HHTimers.timers[x].remainingTime;
            }
            if(specificChampionTime > 0){
                specificChampionTime = specificChampionTime + 5; // +5 secondes
                Cookies.set('nextChampionTime',timerToString(specificChampionTime),{expires:new Date(new Date().getTime() + specificChampionTime * 1000)});
                return;
            }
        }
        if(unsafeWindow.championData.champion.currentTickets == undefined || unsafeWindow.championData.champion.currentTickets <= 0){
            // no more ticket, disabling auto champion feature
            //document.getElementById("autoChampionCheckbox").checked = false;
            // finally, instead of disabling auto-champion, we put a timer so we try again later
            var retryTimer = 1800;
            Cookies.set('nextChampionTime',timerToString(retryTimer),{expires:new Date(new Date().getTime() + retryTimer * 1000)});
            return;
        }
        var battleButton = $("button[currency-type='ticket']")[0];
        if(battleButton != undefined)
            battleButton.click();
        var skipButton = $("button[class='blue_button_L skip-button']")[0]
        if(skipButton != undefined)
            window.location = window.location.origin + "/home.html";
    } else if (window.location.pathname.startsWith("/champions-map.html")) // la map des champions
    {
        if(sessionStorage.autoChampionSelectedIndex === '0'){ // le cas ou on a l'option sur "all champions", alors on vas cliquer sur chaque champion qui n'a pas de timer et qui est debloque
            var listChampions = document.getElementsByClassName("champion-lair-name map-label-link");
            if(listChampions == undefined || listChampions.length == 0)
                return;
            for (var i = 1; i < listChampions.length; i++){ // var i commence a 1 et pas 0, c'est pour eviter de clicker sur la bouton "reception"
                if(listChampions[i].getElementsByTagName("div").length == 0 && listChampions[i].getElementsByTagName("span").length != 0){ // pas de div veut dire qu'il n'y a pas de timer, mais pas de span veut dire que le champion n'est pas débloqué
                    //console.log("clicking on champion "+listChampions[i]);
                    listChampions[i].click();
                    return;
                }
            }
            // on a trouvé aucun champion a cliqué, ce qui signifie certainement qu'aucun timer n'es pret, on vas chercher le timer sur la page d'accueil
            window.location = window.location.origin + "/home.html";
            return;
        } else {
            // on sait deja quel champion on veut combattre, alors on y vas directement, on verifira le timer une fois la bas
            window.location = window.location.origin + "/champions/" + sessionStorage.autoChampionSelectedIndex;
        }
    } else {
        if(sessionStorage.autoChampionSelectedIndex === '0')
            window.location = window.location.origin + "/champions-map.html";
        else
            window.location = window.location.origin + "/champions/" + sessionStorage.autoChampionSelectedIndex;
    }
}


var doBattle = function () {
    //console.log("Performing auto battle.");
    // Confirm if on correct screen.
    var page = getPage();
    if(page === "arena")
    {
        if ($("#arena[class='canvas']").length === 1) {
            // Oponent choose screen
            //console.log("On opponent choose screen.");
            if(document.getElementById("popups").style.display === "block")
            {
                //console.log("Popup detetcted. Refresh page.");
                unsafeWindow.reload();
                return;
            }
            else{
                //console.log("No popups.");
            }
            // Fight the first opponent in list.
            var selbutton = $(".opponents_arena .sub_block.one_opponent button");
            if(selbutton.length<1)
            {
                //console.log("No arena opponents found, storing nextArenaTime...")
                var arenatime = 0;
                for(var e in unsafeWindow.HHTimers.timers){
                    try{
                        if(unsafeWindow.HHTimers.timers[e].$elm.selector.startsWith(".arena_refresh_counter"))
                        arenatime=unsafeWindow.HHTimers.timers[e];
                       }
                    catch(e){}
                }
                arenatime = arenatime.remainingTime;
                Cookies.set('nextArenaTime',timerToString(arenatime),{expires:new Date(new Date().getTime() + arenatime * 1000)});
                //console.log("New arena time stored in nextArenaTime cookie.(+" + arenatime + " sec.)");
                return;
            }
            selbutton[0].click();
            // j'ai désactivé cette ligne car je pense que c'est elle qui bloque le script quand on reçoit une récompense journalière d'arène
            // Le script pense que la voie est libre alors que la récompense n'est pas encore apparue
            // à voir si cette modification (dégueulasse parce que je suis feignant) n'apportera pas d'autre problèmes avec le fonctionnement du script (il faudra travailler propre sinon :/
            //sessionStorage.autoLoop = "false";
        }
    }
    else if (window.location.pathname.startsWith("/battle.html")  && !$("#battle_middle button[rel='launch']:not(.autofight)")[0].disabled) {
        // On battle page.
        var battleButton = $("#battle_middle button[rel='launch']:not(.autofight)");
        battleButton.click();
        setTimeout(function(){$("#battle_middle button[rel='skip']").click();},1000);

    }
    else
    {
        // Switch to the correct screen
        //console.log("Switching to battle screen.");
        gotoPage("arena");
        return;
    }
};
// verify if a slider has been modified and store its new value
// return true if value is changed
var checkSlider = function(storageData, documentSlider) {
    if(sessionStorage.getItem(storageData) != documentSlider+""){
        sessionStorage.setItem(storageData,documentSlider);
        // every time an option is modified, we set a 3 seconds pause on the script, so the user have time to enable more options before the page is changed
        loopPause = 3 * (1000 / autoLoopTimeMili);
        return true;
    }
    return false;
}

var updateData = function () {
    //console.log("updating UI");
    var trollOptions = document.getElementById("autoTrollSelector");
    var championOptions = document.getElementById("autoChampionSelector");
    sessionStorage.autoTrollSelectedIndex = trollOptions.selectedIndex;
    sessionStorage.trollToFight = trollOptions.value;
    if(sessionStorage.autoChampionSelectedIndex != championOptions.selectedIndex){
        sessionStorage.autoChampionSelectedIndex = championOptions.selectedIndex;
        Cookies.remove('nextChampionTime');
    }

    checkSlider("autoSalary", document.getElementById("autoSalaryCheckbox").checked);
    checkSlider("autoMission", document.getElementById("autoMissionCheckbox").checked);
    checkSlider("autoQuest", document.getElementById("autoQuestCheckbox").checked);
    checkSlider("autoTrollBattle", document.getElementById("autoBattleCheckbox").checked);
    checkSlider("autoArenaBattle", document.getElementById("autoArenaCheckbox").checked);
    checkSlider("autoLeagueBattle", document.getElementById("autoLeagueCheckbox").checked);
    checkSlider("autoChampionBattle", document.getElementById("autoChampionCheckbox").checked);
    checkSlider("autoBooster", document.getElementById("autoBoosterCheckbox").checked);

    // in the case that one of the market slider is modified and we end up with both market slider enabled
    // we are removing the market cookie in case the newly enabled sliders need to work
    var oneOfMarketSliderChanged = false;
    if(checkSlider("autoMarketXp", document.getElementById("autoMarketXpCheckbox").checked))
        oneOfMarketSliderChanged = true;
    if(checkSlider("autoMarketGift", document.getElementById("autoMarketGiftCheckbox").checked))
        oneOfMarketSliderChanged = true;
    if(oneOfMarketSliderChanged && sessionStorage.autoMarketXp === "true" && sessionStorage.autoMarketGift === "true")
        Cookies.remove('nextMarketTime');


    if(persistentMenu === 1){
        sessionStorage.isMenuOpened = ($("nav.opened")[0] != undefined);
    }

    // in case of level up, we want to remove the market timer, because the shop has been refreshed
    if(sessionStorage.storedHeroLevel === undefined){
        sessionStorage.storedHeroLevel = getHero().infos.level;
    } else if(getHero().infos.level > Number(sessionStorage.storedHeroLevel)){
        sessionStorage.storedHeroLevel = getHero().infos.level;
        Cookies.remove('nextMarketTime');
    }

    //sessionStorage.autoFreePachinko = document.getElementById("autoFreePachinko").checked;
};

var getPachinko = function(){
    if(!gotoPage("pachinko"))
    {
        // Not at Pachinko screen then goto the Pachinko screen.
        //console.log("Navigating to Pachinko window.");
        return;
    }
    else {
        //console.log("Detected Pachinko Screen. Fetching Pachinko");
        var freePachinkoButton = $("button[free=1]")[0];
        if(freePachinkoButton != undefined) {
            freePachinkoButton.click();
        }
        var npach = 0;
        for(var e in unsafeWindow.HHTimers.timersListMin){
            if(unsafeWindow.HHTimers.timersListMin[e].$elm.selector.startsWith(".pachinko_change"))
                npach=unsafeWindow.HHTimers.timersListMin[e].remainingTime;
        }
        if(npach != 0)
            Cookies.set('nextPachinkoTime',timerToString(npach),{expires:new Date(new Date().getTime() + npach * 1000)});
        else // typiquement, apres avoir recolte le pachinko gratuit, on vas galerer a choper le timer instantanement, grace a cette ligne on vas refresh la page en retournant a "home"
            window.location = window.location.origin + "/home.html";
    }
};

var autoLoop = function () {
    updateData();
    if(loopPause > 0){// in case we need to do a pause
        loopPause--;
        setTimeout(autoLoop, autoLoopTimeMili);
        return;
    }
    var busy = false;
    var page = window.location.href;
    var currentPower = getHero().infos.energy_fight;
    var currentLeaguePower = getHero().infos.energy_challenge;


    if((sessionStorage.autoMarketXp === "true" || sessionStorage.autoMarketGift === "true") && busy === false && Cookies.get("nextMarketTime") === undefined)
    {
        //console.log("time to buy market shit");
        busy = true;
        doMarket();
    }

    if(sessionStorage.autoBooster === "true" && busy === false && Cookies.get("nextBoosterTime") === undefined)
    {
        //console.log("time to buy market shit");
        busy = true;
        doBooster();
    }

    // we do auto pachinko if automission is enabled
    //if(sessionStorage.autoFreePachinko === "true" && busy === false){
    if(sessionStorage.autoMission === "true" && busy === false){
        // Navigate to pachinko
        if (Cookies.get("nextPachinkoTime") === undefined) {
            //console.log("Time to fetch Pachinko.");
            getPachinko();
            busy = true;
        }
    }
    // i've hiden the "autocontest" checkbox, i'm doing it if "automission" is enabled instead
    //if(sessionStorage.autoContest === "true" && busy === false){
    if(sessionStorage.autoMission === "true" && busy === false){
        if (Cookies.get("nextContestTime") === undefined){
            //console.log("Time to get contest rewards.");
            busy = doContestStuff();
        }
    }
    if(sessionStorage.autoMission === "true" && busy === false){
        if (Cookies.get("nextMissionTime") === undefined){
            //console.log("Time to do missions.");
            busy = doMissionStuff();
        }
    }
    if (sessionStorage.autoQuest === "true" && busy === false) {
        if (sessionStorage.questRequirement === "battle") {
            //console.log("Quest requires battle.");
            doBossBattle();
            busy = true;
        }
        else if (sessionStorage.questRequirement[0] === '$') {
            if (Number(sessionStorage.questRequirement.substr(1)) < getHero().infos.soft_currency) {
                // We have enough money... requirement fulfilled.
                //console.log("Continuing quest, required money obtained.");
                sessionStorage.questRequirement = "none";
                proceedQuest();
                busy = true;
            }
            else {
                if(isNaN(sessionStorage.questRequirement.substr(1)))
                {
                    sessionStorage.questRequirement = "none";
                    //console.log("Invalid money in session storage quest requirement !");
                }
                else{
                    // Else we need more money.
                    //console.log("Need money for quest, cannot continue. Turning ON AutoSalary.");
                    sessionStorage.autoQuest = "true";
                }
                busy = false;
            }
        }
        else if (sessionStorage.questRequirement[0] === '*') {
            var energyNeeded = Number(sessionStorage.questRequirement.substr(1));
            var energyCurrent = getHero().infos.energy_quest;
            if (energyNeeded <= energyCurrent) {
                // We have enough energy... requirement fulfilled.
                //console.log("Continuing quest, required energy obtained.");
                sessionStorage.questRequirement = "none";
                proceedQuest();
                busy = true;
            }
            // Else we need energy, just wait.
            else {
                busy = false;
                //console.log("Replenishing energy for quest.(" + energyNeeded + " needed)");
            }
        }
        else if (sessionStorage.questRequirement[0] === 'P')
        {
            // Battle power required.
            var neededPower = Number(sessionStorage.questRequirement.substr(1));
            if(currentPower < neededPower)
            {
                //console.log("Quest requires "+neededPower+" Battle Power for advancement. Waiting...");
                busy = false;
            }
            else
            {
                //console.log("Battle Power obtained, resuming quest...");
                sessionStorage.questRequirement = "none";
                proceedQuest();
                busy = true;
            }
        }
        else if (sessionStorage.questRequirement === "unknownQuestButton") {
            //console.log("AutoQuest disabled.AutoQuest cannot be performed due to unknown quest button. Please manually proceed the current quest screen.");
            document.getElementById("autoQuestCheckbox").checked = false;
            sessionStorage.autoQuest = "false";
            sessionStorage.questRequirement = "none";
            busy = false;
        }
        else if (sessionStorage.questRequirement === "errorInAutoBattle") {
            //console.log("AutoQuest disabled.AutoQuest cannot be performed due errors in AutoBattle. Please manually proceed the current quest screen.");
            document.getElementById("autoQuestCheckbox").checked = false;
            sessionStorage.autoQuest = "false";
            sessionStorage.questRequirement = "none";
            busy = false;
        }
        else if(sessionStorage.questRequirement === "none")
        {
            //console.log("NONE req.");
            busy = true;
            proceedQuest();
        }
        else
        {
            //console.log("Invalid quest requirement : "+sessionStorage.questRequirement);
            busy=false;
        }
    }
    else if(sessionStorage.autoQuest === "false"){sessionStorage.questRequirement = "none";}

    if(sessionStorage.autoArenaBattle === "true" && busy === false)
    {
        if(Cookies.get("nextArenaTime") === undefined)
        {
            //console.log("Time to fight in arena.");
            doBattle();
            busy = true;
        }
    }

    if(sessionStorage.autoLeagueBattle === "true" && busy === false && currentLeaguePower > 0)
    {
        if(Cookies.get("nextLeagueTime") === undefined) // le cookie nextLeagueTime n'existe que dans le cas ou on a deja fait tous nos combats sur la semaine, donc on attends le nouvelle semaine pour avoir de nouveau combats
        {
            //console.log("Time to fight in league.");
            busy = true;
            doLeague();
        }
    }

    if(sessionStorage.autoChampionBattle === "true" && busy === false && Cookies.get("nextChampionTime") === undefined)
    {
        //console.log("time to fight champion");
        busy = true;
        doChampion();
    }

    if(sessionStorage.autoTrollBattle === "true")
    {
        if(busy === false && currentPower >= Number(sessionStorage.battlePowerRequired) && currentPower > 0)
        {
            busy = true;
            if(sessionStorage.autoQuest === "true")
            {
                if(sessionStorage.questRequirement[0] === 'P')
                {
                    //console.log("AutoBattle disabled for power collection for AutoQuest.");
                    document.getElementById("autoBattleCheckbox").checked = false;
                    sessionStorage.autoTrollBattle = "false";
                    busy = false;
                }
                else
                {
                    doBossBattle();
                }
            }
            else
            {
                doBossBattle();
            }
        }
    }
    else{sessionStorage.battlePowerRequired = "0";}
    if (sessionStorage.autoSalary === "true" && busy === false) {
        if (Cookies.get("nextSalaryTime") === undefined) {
            //console.log("Time to fetch salary.");
            busy = getSalary();
        }
    }

    if(busy === true && (sessionStorage.userLink === "none" || sessionStorage.userLink === undefined))//&& !window.location.pathname.startsWith("/quest"))
    {
        //console.log("storing link "+page);
        sessionStorage.userLink = page;
    }
    else if(sessionStorage.userLink !="none" && sessionStorage.userLink != undefined && busy === false)
    {
        //console.log("Restoring page "+sessionStorage.userLink);
        window.location = sessionStorage.userLink;
        sessionStorage.userLink = "none";
    }

    if (sessionStorage.autoLoop === "true") {
        setTimeout(autoLoop, autoLoopTimeMili);
    }
};


function marketAddSelectLowestLevelGirlButton() {
    if(!window.location.pathname.startsWith("/shop.html"))
        return;
    selectLowestLevelGirlCss();
    var element = $("[id=inventory] div.potion label");
    if(element.length > 0){
        element.html('<select_low_girl class="LowGirl"><span>Select Lowest Level Girl</span></select_low_girl>');
        element.click(function() {
            var data_girls = $("div.girl-ico");
            var data_levels = $("div.girl-ico [chars]");
            var currentLowLevel = "1000";
            var currentLowGirl = "-1";
            var i;
            for(i=0; i < data_girls.length; i++){
                /* // this method is great, but sadly the data will not be updated until page refresh, so we're going to read the html directly
                var parsedData = JSON.parse(data_girls[i].getAttribute("data-g"));
                if(parsedData.level < currentLowLevel){
                    currentLowLevel = parsedData.level;
                    currentLowGirl = data_girls[i].getAttribute("id_girl");
                }*/
                if(Number(data_levels[i].textContent) < Number(currentLowLevel)){
                    currentLowLevel = data_levels[i].textContent;
                    currentLowGirl = data_girls[i].getAttribute("id_girl");
                }
            }
            if(currentLowGirl != "-1"){
                window.location = window.location.origin + "/shop.html?type=potion&girl=" + currentLowGirl;
            }
        });
    }
}

function calculateStatPrice(points){
    var cost = 0;
    if(points < 2001){
        cost = 3 + points * 2;
    }else if(points < 4001){
        cost = 4005+(points-2001)*4;
    }else if(points < 6001){
        cost = 12005+(points-4001)*6;
    }else if(points < 8001){
        cost = 24005+(points-6001)*8;
    }else if(points < 10001){
        cost = 40005+(points-8001)*10;
    }else if(points < 12001){
        cost = 60005+(points-10001)*12;
    }else if(points < 14001){
        cost = 84005+(points-12001)*14;
    }else if(points < 16001){
        cost = 112005+(points-14001)*16;
    }
    return cost;
}

function calculateTotalPrice(points){
    var last_price = calculateStatPrice(points);
    var price = 0;
    if(points < 2001) {
        price = (5+last_price)/2*(points);
    } else if(points < 4001){
        price = 4012005+(4009+last_price)/2*(points-2001);
    }else if(points < 6001){
        price = 20026005+(12011+last_price)/2*(points-4001);
    }else if(points < 8001){
        price = 56042005+(24013+last_price)/2*(points-6001);
    }else if(points < 10001){
        price = 120060005+(40015+last_price)/2*(points-8001);
    }else if(points < 12001){
        price = 220080005+(60017+last_price)/2*(points-10001);
    }else if(points < 14001){
        price = 364102005+(84019+last_price)/2*(points-12001);
    }else if(points < 16001){
        price = 560126005+(112021+last_price)/2*(points-14001);
    }
    return price;
}

function addBuyMaxStatButtonsInMarket() {
    if(!window.location.pathname.startsWith("/shop.html"))
        return;
    buyMaxStatCss();
    var last_cost = 0,
        levelPoints = 0,
        levelMoney = 0,
        level = Hero.infos.level;
    levelPoints = level * 30;
    levelMoney = calculateTotalPrice(levelPoints);

    var loc2 = $('.hero_stats').children();
    loc2.each(function() {
        var stat = $(this).attr("hero");
        if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
            var disabled = 'disabled="disabled"';
            if(stat == "carac1" && !$("#equiped plus")[0].getAttribute("disabled"))
                disabled = "";
            if(stat == "carac2" && !$("#equiped plus")[1].getAttribute("disabled"))
                disabled = "";
            if(stat == "carac3" && !$("#equiped plus")[2].getAttribute("disabled"))
                disabled = "";


            var statNumber;
            if(stat == "carac1")
                statNumber = 1;
            if(stat == "carac2")
                statNumber = 2;
            if(stat == "carac3")
                statNumber = 3;

            var currentStatPoints = Hero.infos[stat],
                remainingPoints = levelPoints - currentStatPoints,
                currentMoney = calculateTotalPrice(currentStatPoints),
                remainingMoney = levelMoney - currentMoney;

            $(this).append('<plus_buy_all class="BuyMax" for_carac="'+stat+'" '+disabled+'><span>Buy max</span></plus_all>');
            $(this).append('<div id="BuyMax' + stat +'" class="BuyMaxTooltip">'
                           + 'Buy '+remainingPoints.toLocaleString()
                           + '<img class="BuyMaxIcon" src="https://hh.hh-content.com/pictures/misc/items_icons/'+statNumber+'.png"><br>'
                           + 'For '+remainingMoney.toLocaleString()
                           + '<img class="BuyMaxIcon" src="https://hh.hh-content.com/design/ic_menu-SC.png"><br>'
                           +'</div>');
        }
    });
    clickBuyMaxStatFunction();
}


function clickBuyMaxStatFunction(){
    $("#equiped plus_buy_all").click(function() {
        var carac_num;
        var $me = $(this);
        if ($me.attr("disabled")) return;
        var carac = $me.attr("for_carac");
        if(carac == "carac1")
            carac_num = 0;
        if(carac == "carac2")
            carac_num = 1;
        if(carac == "carac3")
            carac_num = 2;

        var button_plus_stat = $("#equiped plus")[carac_num];

        var auto_click = setInterval(function() {
            //console.log("achat stat");
            //console.log($("#equiped plus").next()[carac_num].getAttribute("value"));
            if(!button_plus_stat ){//|| !$("#equiped plus").next()[carac_num].getAttribute("value") || $("#equiped plus").next()[carac_num].getAttribute("value") == 'MAXED') {
                //console.log("time to stop");
                //$me[0].setAttribute("disabled","disabled");
                clearInterval(auto_click);
                return;
            }
            button_plus_stat.click();
        }, 100);
        $me[0].setAttribute("disabled","disabled");
    });
}

var showOwnedGirlsOnlyInHarem = function () {
    if(!window.location.pathname.startsWith("/harem"))
        return;
    var ownedGirlsOnlyButton = $("button.check-btn.shards-state.owned");
    var progressedGirlsOnlyButton = $("button.check-btn.shards-state.inprogress");
    if(ownedGirlsOnlyButton)
        ownedGirlsOnlyButton.click();
    if(progressedGirlsOnlyButton)
        progressedGirlsOnlyButton.click();
}

var autoTrollNameGenerator = function () {
    if(localStorage.getItem("auto_girl") === '1'){
        return 'Auto boss';
    }
    return 'Auto (' + Trolls[localStorage.getItem("auto_girl")-1] + ')';
}

var start = function () {

    // adding market buttons
    marketAddSelectLowestLevelGirlButton();
    addBuyMaxStatButtonsInMarket();

    showOwnedGirlsOnlyInHarem();

    $("span.hudEnergy_mix_icn").click(function() {
        window.location = window.location.origin + getHero().infos.questing.current_url;
    });

    // opening the menu automatically if it was opened when quitting last page
    if(persistentMenu === 1 && sessionStorage.isMenuOpened === "true"){
        $("span.hudMenu_mix_icn")[0].click();
    }

    // determining if any event girl for auto setting
    if (typeof event_object_data !== 'undefined') {
        //var all_event_girls_owned = 1;
        event_object_data.girls.forEach(function(girl) {
            if(girl.hasOwnProperty('troll'))
            {
                if(!girl.hasOwnProperty('owned_girl') && (girl.troll.id_troll <= (getHero().infos.questing.id_world - 1))){
                    localStorage.setItem("auto_girl", girl.troll.id_troll);
                    //all_event_girls_owned = 0;
                    //auto_girl = girl.troll.id_troll;
                }
            }
        });
        // pour eviter qu'on continu de farmer la fille d'event une fois qu'on les a toutes
        // EDIT : finalement ce n'est plus necessaire puisqu'on check si le boss a encore des filles avant chaque combat
        //if(all_event_girls_owned == 1) {
        //    localStorage.setItem("auto_girl", getHero().infos.questing.id_world-1);
        //}
    }
    // dans le cas où il n'y a pas d'event ou qu'on est pas sur l'accueil, et qu'aucune valeur n'est sauvegardée
    if(localStorage.getItem("auto_girl") == null) {
       localStorage.setItem("auto_girl", 1);
       //localStorage.setItem("auto_girl", getHero().infos.questing.id_world-1);
    }

    //console.log("script started");
    // Add UI buttons.
    //customCss();
    var UIcontainer = $("#contains_all nav div[rel='content']");
    UIcontainer.html('<div style="position: absolute;right: 21%; padding: 10px 20px 10px 20px;width: inherit;/*text-align: center*/;display:flex;flex-direction:column;z-index: 1100;">'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoSalaryCheckbox\" type=\"checkbox\"><span class=\"slider round sliderMoneyIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/design/ic_menu-SC.png"><span style="vertical-align:super;">Auto Salary</span></div>'
                   //+'<span>AutoContest</span><div><label class=\"switch\"><input id=\"autoContestCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoMissionCheckbox\" type=\"checkbox\"><span class=\"slider round sliderDailyIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/design_v2/leaderboard/weekly.svg"><span style="vertical-align:super;">Auto Daily Missions</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoQuestCheckbox\" type=\"checkbox\"><span class=\"slider round sliderQuestIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/design/menu/forward.svg"><span style="vertical-align:super;">Auto Quest</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoArenaCheckbox\" type=\"checkbox\"><span class=\"slider round sliderArenaIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/design_v2/leaderboard/pvp_wins.png"><span style="vertical-align:super;">Auto Arena Battle</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoLeagueCheckbox\" type=\"checkbox\"><span class=\"slider round sliderLeagueIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/league_points.png"><span style="vertical-align:super;">Auto League Battle</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoBoosterCheckbox\" type=\"checkbox\"><span class=\"slider round sliderBoosterIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/pictures/items/B3.png"><span style="vertical-align:super;">Auto Use Boosters</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoMarketXpCheckbox\" type=\"checkbox\"><span class=\"slider round sliderMarketXpIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/pictures/items/XP3.png"><span style="vertical-align:super;">Auto Buy XP</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoMarketGiftCheckbox\" type=\"checkbox\"><span class=\"slider round sliderMarketGiftIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/pictures/items/K2.png"><span style="vertical-align:super;">Auto Buy Gifts</span></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoBattleCheckbox\" type=\"checkbox\"><span class=\"slider round sliderTrollIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/design/ic_menu-Fist.png">'
                     +'<select id=\"autoTrollSelector\" style="vertical-align:super;"><option value=\"latest\">' + autoTrollNameGenerator() + '</option></select></div>'
                     +'<div style="padding:3px"><label class=\"switch\"><input id=\"autoChampionCheckbox\" type=\"checkbox\"><span class=\"slider round sliderChampionIcon\"></span></label><img class="autoSliderIcon" src="https://hh.hh-content.com/pictures/design/champion_ticket.png">'
                     +'<select id=\"autoChampionSelector\" style="vertical-align:super;"><option value=\"all\">All champions</option><option>1 - Dameda</option><option>2 - Lissa</option><option>3 - Albane</option><option>4 - Murane</option><option>5 - Any</option><option>6 - Shtupra</option></select></div>'
                   //+'<span>AutoPachinko(Free)</span><div><label class=\"switch\"><input id=\"autoFreePachinko\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'</div>'+UIcontainer.html());

    var championOptions = document.getElementById("autoChampionSelector");
    // Add auto troll options
    var trollOptions = document.getElementById("autoTrollSelector");

    if(getHero() != undefined){
        // get current world of player
        var CurrentWorld = getHero().infos.questing.id_world - 1;
        // generate troll list
        for (var i = 0; i < CurrentWorld; i++) {
            var option = document.createElement("option");
            option.text = (i+1) + " - " + Trolls[i];
            trollOptions.add(option);
        }
    }

    trollOptions.selectedIndex = sessionStorage.autoTrollSelectedIndex;
    championOptions.selectedIndex = sessionStorage.autoChampionSelectedIndex;
    document.getElementById("autoSalaryCheckbox").checked = ((sessionStorage.autoSalary === "true")||(defaultAutoSalary === 1 && sessionStorage.autoSalary === undefined));
  //document.getElementById("autoContestCheckbox").checked = sessionStorage.autoContest === "true";
    document.getElementById("autoMissionCheckbox").checked = ((sessionStorage.autoMission === "true")||(defaultDailyQuests === 1 && sessionStorage.autoMission === undefined));
    document.getElementById("autoQuestCheckbox").checked = ((sessionStorage.autoQuest === "true")||(defaultAutoQuest === 1 && sessionStorage.autoQuest === undefined));
    document.getElementById("autoBattleCheckbox").checked = ((sessionStorage.autoTrollBattle === "true")||(defaultAutoTroll === 1 && sessionStorage.autoTrollBattle === undefined));
    document.getElementById("autoArenaCheckbox").checked = ((sessionStorage.autoArenaBattle === "true")||(defaultAutoArena === 1 && sessionStorage.autoArenaBattle === undefined));
    document.getElementById("autoLeagueCheckbox").checked = ((sessionStorage.autoLeagueBattle === "true")||(defaultAutoLeague === 1 && sessionStorage.autoLeagueBattle === undefined));
    document.getElementById("autoChampionCheckbox").checked = ((sessionStorage.autoChampionBattle === "true")||(defaultAutoChampion === 1 && sessionStorage.autoChampionBattle === undefined));
    document.getElementById("autoBoosterCheckbox").checked = ((sessionStorage.autoBooster === "true")||(defaultBooster === 1 && sessionStorage.autoBooster === undefined));
    document.getElementById("autoMarketXpCheckbox").checked = ((sessionStorage.autoMarketXp === "true")||(defaultAutoMarketXp === 1 && sessionStorage.autoMarketXp === undefined));
    document.getElementById("autoMarketGiftCheckbox").checked = ((sessionStorage.autoMarketGift === "true")||(defaultAutoMarketGift === 1 && sessionStorage.autoMarketGift === undefined));
  //document.getElementById("autoFreePachinko").checked = sessionStorage.autoFreePachinko === "true";
    sessionStorage.autoLoop = "true";
    autoLoop();
};
$("document").ready(start);