// ==UserScript==
// @name         HaremHeroes Automatic
// @namespace    JDscripts
// @version      3.24
// @description  Open the menu in HaremHeroes(topright) to toggle AutoControlls. Supports AutoSalary, AutoContest, AutoMission, AutoQuest, AutoTrollBattle, AutoArenaBattle and AutoPachinko(Free). Messages are printed in local console.
// @author       JD
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @require      https://cdn.jsdelivr.net/js-cookie/2.2.0/js.cookie.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/31313/HaremHeroes%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/31313/HaremHeroes%20Automatic.meta.js
// ==/UserScript==

GM_addStyle('/* The switch - the box around the slider */ .switch { position: relative; display: inline-block; width: 60px; height: 34px; } /* Hide default HTML checkbox */ .switch input {display:none;} /* The slider */ .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked + .slider { background-color: #2196F3; } input:focus + .slider { box-shadow: 0 0 1px #2196F3; } input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } /* Rounded sliders */ .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; }');

var globalWorldMap;

function getHero()
{
    if(unsafeWindow.Hero === undefined)
    {
        setTimeout(autoLoop, Number(sessionStorage.autoLoopTimeMili))
        //console.log(window.wrappedJSObject)
    }
    return unsafeWindow.Hero;
}

function getGirlsMap()
{
    return unsafeWindow.GirlSalaryManager.girlsMap;
}

function getPage()
{
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

// Retruns true if on correct page.
function gotoPage(page)
{
    if(getPage() === page)
    {
        return true;
    }
    else
    {
        console.log("Navigating to page: "+page);
        var togoto = undefined;
        // get page path
        switch(page)
        {
            case "missions":
            case "activities":
                togoto = $("nav div[rel='content'] a:has(.activities)").attr("href");
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
                console.log("Current quest page: "+togoto);
                break;
            default:
                console.log("Unknown goto page request. No page \'"+page+"\' defined.");
        }
        if(togoto != undefined)
        {
            sessionStorage.autoLoop = "false";
            window.location = window.location.origin + togoto;
        }
        else console.log("Couldn't find page path. Page was undefined...");
        return false;
    }
}

var proceedQuest = function () {
    //console.log("Starting auto quest.");
    // Check if at correct page.
    if (!gotoPage("quest")) {
        // Click on current quest to naviagte to it.
        console.log("Navigating to current quest.");
        return;
    }

    // Get the proceed button type
    var proceedButtonMatch = $("#controls button:not([style='display: none;'])");
    var proceedCostEnergy = Number($("#controls .cost span[cur='*']").text());
    var proceedCostMoney = Number($("#controls .cost span[cur='$']").text().trim().replace(',', ''));
    var proceedType = proceedButtonMatch.attr("act");

    if (proceedButtonMatch.length === 0) console.log("Could not find resume button.");
    else if (proceedType === "free") {
        console.log("Proceeding for free.");
        proceedButtonMatch.click();
    }
    else if (proceedType === "pay") {
        var energyCurrent = getHero().infos.energy_quest;
        var moneyCurrent = getHero().infos.soft_currency;
        if(proceedCostEnergy <= energyCurrent)
        {
            // We have energy.
            console.log("Spending "+proceedCostEnergy+" Energy to proceed.");
        }
        else
        {
            console.log("Quest requires "+proceedCostEnergy+" Energy to proceed.");
            sessionStorage.questRequirement = "*"+proceedCostEnergy;
            return;
        }
        if(proceedCostMoney <= moneyCurrent)
        {
            // We have money.
            console.log("Spending "+proceedCostMoney+" Money to proceed.");
        }
        else
        {
            console.log("Spending "+proceedCostEnergy+" Money to proceed.");
            sessionStorage.questRequirement = "$"+proceedCostMoney;
            return;
        }
        proceedButtonMatch.click();
        sessionStorage.autoLoop = "false";
        location.reload();
    }
    else if (proceedType === "use_item") {
        console.log("Proceeding by using X" + Number($("#controls .item span").text()) + " of the required item.");
        proceedButtonMatch.click();
    }
    else if (proceedType === "battle") {
        console.log("Proceeding to battle troll...");
        sessionStorage.questRequirement = "battle";
        // Proceed to battle troll.
        proceedButtonMatch.click();
        sessionStorage.autoLoop = "false";
        location.reload();
    }
    else if (proceedType === "end_archive") {
        console.log("Reached end of current archive. Proceeding to next archive.");
        sessionStorage.autoLoop = "false";
        proceedButtonMatch.click();
    }
    else if (proceedType === "end_play") {
        console.log("Reached end of current play. Proceeding to next play.");
        sessionStorage.autoLoop = "false";
        proceedButtonMatch.click();
    }
    else {
        console.log("Could not identify given resume button.");
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
function getSuitableMission(missionsList)
{
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

// retruns a map of WorldName->fullLink/href
// else returns false if navigating there
function getUnlockedWorlds()
{
    if(gotoPage("map"))
    {
        var map = new Map();
        // fill the map
        document.querySelectorAll("a.link-world").forEach(
            function(elem)
            {
                var name = elem.nextElementSibling.textContent.trim();
                map.set(name, elem.href);
            }
        );
        // set global latest map
        sessionStorage.globalWorldMap = JSON.stringify([...map]);
        globalWorldMap = map;
        //return not busy
        return map;
    }
    else
    {
        console.log("Navigating to worldmap.");
        // not done
        return false;
    }
}

// returns boolean to set busy
function doMissionStuff()
{
    if(!gotoPage("missions"))
    {
        console.log("Navigating to activities page.");
        // return busy
        return true;
    }
    else
    {
        console.log("On activities page.");
        console.log("Collecting finished mission's reward.");
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
                    console.log("Unfinished mission detected...("+data.remaining_time+"sec. remaining)");
                    Cookies.set('nextMissionTime',data.remaining_time,{expires:new Date(new Date().getTime() + data.remaining_time * 1000)});
                }
                else{
                    console.log("Unclaimed mission detected...");
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
                            console.log("Couldn't parse xp/money data.");
                            console.log(slotDiv);
                        }
                    }
                    // set item details if item
                    else if(reward.type === "item")
                    {
                        try{
                            reward.data = $.data(slotDiv).d;
                        }
                        catch(e){
                            console.log("Couldn't parse item reward slot details.");
                            console.log(slotDiv);
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
            console.log("Something went wrong, need to retry later...");
            // busy
            return true;
        }
        console.log("Missions parsed, mission list is:-");
        console.log(missions);
        if(missions.length > 0)
        {
            console.log("Selecting mission from list.");
            var mission = getSuitableMission(missions);
            console.log("Selected mission:-");
            console.log(mission);
            console.log("Selected mission duration: "+mission.duration+"sec.");
            var missionButton = $(mission.missionObject).find("button:visible").first();
            console.log("Mission button of type: "+missionButton.attr("rel"));
            console.log("Clicking mission button.");
            missionButton.click();
            Cookies.set('nextMissionTime',mission.duration,{expires:new Date(new Date().getTime() + mission.duration * 1000)});
        }
        else{
            console.log("No missions detected...!");
            // get gift
            var ck = Cookies.get('nextMissionTime');
            var isAfterGift = document.querySelector("#missions .after_gift").style.display === 'block';
            if(!isAfterGift){
                if(ck === undefined || ck === 'giftleft')
                {
                    console.log("Collecting gift.");
                    // click button
                    document.querySelector(".end_gift button").click();
                }
                else{
                    console.log("Refreshing to collect gift...");
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
                console.log("New mission time was undefined... Setting it manually to 10min.");
                time = 10*60;
            }
            console.log("New missions in: "+time+"sec.");
            Cookies.set('nextMissionTime',time,{expires:new Date(new Date().getTime() + time * 1000)});
        }
        // not busy
        return false;
    }
}

// returns boolean to set busy
function doContestStuff()
{
    if(!gotoPage("missions"))
    {
        console.log("Navigating to activities page.");
        // return busy
        return true;
    }
    else
    {
        console.log("On activities page.");
        console.log("Collecting finished contests's reward.");
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
            console.log("New contest time was undefined... Setting it manually to 10min.");
            time = 10*60;
        }
        Cookies.set('nextContestTime',time,{expires:new Date(new Date().getTime() + time * 1000)});
        console.log("Next contest time stored in nextContestTime cookie.(+" + time + " sec.)");
        // Not busy
        return false;
    }
}

var getSalary = function () {
    try {
        if(!gotoPage("harem"))
        {
            // Not at Harem screen then goto the Harem screen.
            console.log("Navigating to Harem window.");
            // return busy
            return true;
        }
        else {
            console.log("Detected Harem Screen. Fetching Salary");
            $("#harem_whole #harem_left .salary:not('.loads') button").each(function (index) {
                $(this).click();
            });
            console.log("Salary fetched. Getting next fetch time");
            // In seconds
            var closestTime = undefined;
            var gMap = getGirlsMap();
            if(gMap === undefined)
            {
                // error
                console.log("Girls Map was undefined...! Error, manually setting salary time to 2 min.");
                closestTime = 2*60;
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
                        }
                    }
                }
                catch(exp){
                    // error
                    console.log("Girls Map had undefined property...! Error, manually setting salary time to 2 min.");
                    closestTime = 2*60;
                }
            }
            if(closestTime === undefined)
            {
                console.log("closestTime was undefined...! Error, manually setting salary time to 2 min.");
                closestTime = 2*60;
            }
            if(closestTime <= 2)
            {
                console.log("closestTime is less than/equal to 2 sec. Staying on this page.");
                // return busy
                return true;
            }
            Cookies.set('nextSalaryTime',closestTime,{expires:new Date(new Date().getTime() + closestTime * 1000)});
            console.log("New fetch time stored in nextSalaryTime cookie.(+" + closestTime + " sec.)");
            // return not busy
            return false;
        }
    }
    catch (ex) {
        console.log("Could not collect salary... " + ex);
        // return not busy
        return false;
    }
};

var doBossBattle = function()
{
    var currentPower = getHero().infos.energy_fight;
    if(currentPower < 1)
    {
        //console.log("No power for battle.");
        return;
    }
    // Battles the latest boss.
    // Navigate to latest boss.
    if(window.location.pathname.startsWith("/battle.html"))
    {
        // On the battle screen.
        doBattle();
    }
    else if(window.location.pathname.startsWith("/world"))
    {
        // On some world screen.
        // Click on the local Boss's battle button.
        console.log("Entering battle with this troll.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + $("#worldmap a[class='troll_world']").attr("href");
        return;
    }
    else if(sessionStorage.trollToFight !== undefined && sessionStorage.trollToFight !== "latest")
    {
        console.log("Custom troll fight.");
        console.log("Fighting troll at: "+sessionStorage.trollToFight);
        var worldMap = getUnlockedWorlds();
        if(worldMap === false)
        {
            console.log("Finding unlocked worlds...");
            return;
        }
        var worldPage = worldMap.get(sessionStorage.trollToFight);
        if(worldPage == undefined)
        {
            console.log("ERROR! worldPage undefined for troll at: "+sessionStorage.trollToFight);
            return;
        }
        console.log("Troll world at: "+worldPage);
        window.location = worldPage;
        sessionStorage.autoLoop = "false";
    }
    else if(window.location.pathname.startsWith("/quest"))
    {
        // On some quest screen.
        // Goto this area's screen.
        console.log("Navigating to latest Troll.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + $("#breadcrumbs a[class='back']").last().attr("href");
        return;
    }
    else{
        console.log("Navigating to latest Troll.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + $("nav div[rel='content'] a:has(.continue_quest)").attr("href");
        return;
    }
};

var doBattle = function () {
    //console.log("Performing auto battle.");
    // Confirm if on correct screen.
    var page = getPage();
    if(page === "arena")
    {
        if ($("#arena[class='canvas']").length === 1) {
            // Oponent choose screen
            console.log("On opponent choose screen.");
            if(document.getElementById("popups").style.display === "block")
            {
                console.log("Popup detetcted. Refresh page.");
                unsafeWindow.reload();
                return;
            }
            else{
                console.log("No popups.");
            }
            // Fight the first opponent in list.
            var selbutton = $(".opponents_arena .sub_block button:contains('Select')");
            if(selbutton.length<1)
            {
                console.log("No arena opponents found, storing nextArenaTime...")
                var arenatime = 0;
                for(var e in unsafeWindow.HHTimers.timers){
                    try{
                        if(unsafeWindow.HHTimers.timers[e].$elm.selector.startsWith(".arena_refresh_counter"))
                        arenatime=unsafeWindow.HHTimers.timers[e];
                       }
                    catch(e){}
                }
                arenatime = arenatime.remainingTime;
                Cookies.set('nextArenaTime',arenatime,{expires:new Date(new Date().getTime() + arenatime * 1000)});
                console.log("New arena time stored in nextArenaTime cookie.(+" + arenatime + " sec.)");
                return;
            }
            selbutton[0].click();
            sessionStorage.autoLoop = "false";
        }
    }
    else if (page === "battle") {
        // On battle page.
        //console.log("On Battle Page.");
        if ($("#battle[class='canvas']").length === 1) {
            // Battle screen
            console.log("On battle screen.");
            // get button with no autofight, i.e. no koban
            var battleButton = $("#battle_middle button[rel='launch']:not(.autofight)");
            var currentPower = getHero().infos.energy_fight;
            if(battleButton === undefined){
                console.log("Battle Button was undefined. Disabling all auto-battle.");
                document.getElementById("autoBattleCheckbox").checked = false;
                document.getElementById("autoArenaCheckbox").checked = false;
                if (sessionStorage.questRequirement === "battle")
                {
                    document.getElementById("autoQuestCheckbox").checked = false;
                    console.log("Auto-quest disabled since it requires battle and auto-battle has errors.");
                }
                return;
            }
            var battle_price = battleButton.attr("price_fe");
            if(battle_price === undefined){
                console.log("Could not detect battle button price. Error.");
                console.log("Disabling all auto-battle.");
                document.getElementById("autoBattleCheckbox").checked = false;
                document.getElementById("autoArenaCheckbox").checked = false;
                if (sessionStorage.questRequirement === "battle")
                {
                    document.getElementById("autoQuestCheckbox").checked = false;
                    console.log("Auto-quest disabled since it requires battle and auto-battle has errors.");
                }
                return;
            }
            console.log("battle price: "+battle_price+"P")
            if(currentPower >= battle_price)
            {
                // We have the power.
                battleButton.click();
                // Skip
                setTimeout(function(){$("#battle_middle button[rel='skip']").click();},1000);
                setTimeout(function(){$("#battle_end div[style*='display: block;'] .blue_text_button").click();},2500);

                if (sessionStorage.questRequirement === "battle") {
                    // Battle Done.
                    sessionStorage.questRequirement = "none";
                }
            }
            else
            {
                // We need more power.
                console.log("Battle requires "+battle_price+" power.");
                sessionStorage.battlePowerRequired = battle_price;
                if(sessionStorage.questRequirement === "battle")sessionStorage.questRequirement = "P"+battle_price;
            }
        }
        else {
            console.log("Could not identify battle screen.");
            if (sessionStorage.questRequirement === "battle") sessionStorage.questRequirement = "errorInAutoBattle";
            return;
        }
    }
    else
    {
        // Switch to the correct screen
        console.log("Switching to battle screen.");
        gotoPage("arena");
        return;
    }
};

var updateData = function () {
    //console.log("updating UI");
    var trollOptions = document.getElementById("autoTrollSelector");
    sessionStorage.autoTrollSelectedIndex = trollOptions.selectedIndex;
    sessionStorage.trollToFight = trollOptions.value;
    sessionStorage.autoSalary = document.getElementById("autoSalaryCheckbox").checked;
    sessionStorage.autoContest = document.getElementById("autoContestCheckbox").checked;
    sessionStorage.autoMission = document.getElementById("autoMissionCheckbox").checked;
    sessionStorage.autoQuest = document.getElementById("autoQuestCheckbox").checked;
    sessionStorage.autoTrollBattle = document.getElementById("autoBattleCheckbox").checked;
    sessionStorage.autoArenaBattle = document.getElementById("autoArenaCheckbox").checked;
    sessionStorage.autoFreePachinko = document.getElementById("autoFreePachinko").checked;
};

var getPachinko = function(){
    try {
        if(!gotoPage("pachinko"))
        {
            // Not at Pachinko screen then goto the Pachinko screen.
            console.log("Navigating to Pachinko window.");
            return;
        }
        else {
            console.log("Detected Pachinko Screen. Fetching Pachinko");
            $("#pachinko button[free=1]")[0].click();
            var npach;
            for(var e in unsafeWindow.HHTimers.timersListMin){
                if(unsafeWindow.HHTimers.timersListMin[e].$elm.selector.startsWith(".pachinko_change"))
                    npach=unsafeWindow.HHTimers.timersListMin[e].remainingTime;
            }
            if(npach !== undefined || npach !== 0)
            {
                Cookies.set('nextPachinkoTime',npach,{expires:new Date(new Date().getTime() + npach * 1000)});
            }
            else
            {
                Cookies.remove('nextPachinkoTime');
            }
        }
    }
    catch (ex) {
        console.log("Could not collect pachinko... " + ex);
    }
};

var autoLoop = function () {
    updateData();
    var busy = false;
    var page = window.location.href;
    var currentPower = getHero().infos.energy_fight;
    //console.log("sal="+sessionStorage.autoSalary);
    if(sessionStorage.autoFreePachinko === "true" && busy === false){
        // Navigate to pachinko
        if (Cookies.get("nextPachinkoTime") === undefined) {
            console.log("Time to fetch Pachinko.");
            getPachinko();
            busy = true;
        }
    }
    if(sessionStorage.autoContest === "true" && busy === false){
        if (Cookies.get("nextContestTime") === undefined){
            console.log("Time to get contest rewards.");
            busy = doContestStuff();
        }
    }
    if(sessionStorage.autoMission === "true" && busy === false){
        if (Cookies.get("nextMissionTime") === undefined){
            console.log("Time to do missions.");
            busy = doMissionStuff();
        }
    }
    if (sessionStorage.autoSalary === "true" && busy === false) {
        if (Cookies.get("nextSalaryTime") === undefined) {
            console.log("Time to fetch salary.");
            busy = getSalary();
        }
    }
    if (sessionStorage.autoQuest === "true" && busy === false) {
        if (sessionStorage.questRequirement === "battle") {
            console.log("Quest requires battle.");
            doBossBattle();
            busy = true;
        }
        else if (sessionStorage.questRequirement[0] === '$') {
            if (Number(sessionStorage.questRequirement.substr(1)) < getHero().infos.soft_currency) {
                // We have enough money... requirement fulfilled.
                console.log("Continuing quest, required money obtained.");
                sessionStorage.questRequirement = "none";
                proceedQuest();
                busy = true;
            }
            else {
                if(isNaN(sessionStorage.questRequirement.substr(1)))
                {
                    sessionStorage.questRequirement = "none";
                    console.log("Invalid money in session storage quest requirement !");
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
                console.log("Continuing quest, required energy obtained.");
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
                console.log("Quest requires "+neededPower+" Battle Power for advancement. Waiting...");
                busy = false;
            }
            else
            {
                console.log("Battle Power obtained, resuming quest...");
                sessionStorage.questRequirement = "none";
                proceedQuest();
                busy = true;
            }
        }
        else if (sessionStorage.questRequirement === "unknownQuestButton") {
            console.log("AutoQuest disabled.AutoQuest cannot be performed due to unknown quest button. Please manually proceed the current quest screen.");
            document.getElementById("autoQuestCheckbox").checked = false;
            sessionStorage.autoQuest = "false";
            sessionStorage.questRequirement = "none";
            busy = false;
        }
        else if (sessionStorage.questRequirement === "errorInAutoBattle") {
            console.log("AutoQuest disabled.AutoQuest cannot be performed due errors in AutoBattle. Please manually proceed the current quest screen.");
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
            console.log("Invalid quest requirement : "+sessionStorage.questRequirement);
            busy=false;
        }
    }
    else if(sessionStorage.autoQuest === "false"){sessionStorage.questRequirement = "none";}

    if(sessionStorage.autoArenaBattle === "true" && busy === false)
    {
        if(Cookies.get("nextArenaTime") === undefined)
        {
            console.log("Time to fight in arena.");
            doBattle();
            busy = true;
        }
    }

    if(sessionStorage.autoTrollBattle === "true")
    {
        if(busy === false && currentPower >= Number(sessionStorage.battlePowerRequired) && currentPower > 0)
        {
            sessionStorage.battlePowerRequired = "0";
            busy = true;
            if(sessionStorage.autoQuest === "true")
            {
                if(sessionStorage.questRequirement[0] === 'P')
                {
                    console.log("AutoBattle disabled for power collection for AutoQuest.");
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

    if(busy === true && sessionStorage.userLink==="none" && !window.location.pathname.startsWith("/quest"))
    {
        sessionStorage.userLink = page;
    }
    else if(sessionStorage.userLink !=="none" && busy === false)
    {
        console.log("Restoring page "+sessionStorage.userLink);
        window.location = sessionStorage.userLink;
        sessionStorage.userLink = "none";
    }

    if(isNaN(sessionStorage.autoLoopTimeMili)){
        console.log("AutoLoopTimeMili is not a number.");
        setDefaults();
    }
    else{
        if (sessionStorage.autoLoop === "true") setTimeout(autoLoop, Number(sessionStorage.autoLoopTimeMili));
        else console.log("autoLoop Disabled");
    }
};

var setDefaults = function () {
    console.log("Setting Defaults.");
    sessionStorage.autoSalary = "false";
    sessionStorage.autoContest = "false";
    sessionStorage.autoMission = "false";
    sessionStorage.autoFreePachinko = "false";
    sessionStorage.autoLoop = "true";
    sessionStorage.userLink = "none";
    sessionStorage.autoLoopTimeMili = "200";
    sessionStorage.autoQuest = "false";
    sessionStorage.autoTrollBattle = "false";
    sessionStorage.autoArenaBattle = "false";
    sessionStorage.battlePowerRequired = "0";
    sessionStorage.questRequirement = "none";
    sessionStorage.freshStart = "no";
};

var start = function () {
    //console.log("script started");
    // get world map
    try{
        globalWorldMap = new Map(JSON.parse(sessionStorage.globalWorldMap));
        if(!(globalWorldMap instanceof Map) || globalWorldMap.size<1)throw false;
    }
    catch(e)
    {
        console.log("Need world map NOW...");
        if(!getUnlockedWorlds())
        {
            sessionStorage.userLink = window.location.href;
            return;
        }
    }
    // Add UI buttons.
    var UIcontainer = $("#contains_all nav div[rel='content']");
    UIcontainer.html('<div style="position: absolute;right: 18.66%; padding: 10px;width: inherit;text-align: center;display:flex;flex-direction:column;">'
                     + '<span>AutoSal.</span><div><label class=\"switch\"><input id=\"autoSalaryCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     + '<span>AutoContest</span><div><label class=\"switch\"><input id=\"autoContestCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     + '<span>AutoMission</span><div><label class=\"switch\"><input id=\"autoMissionCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoQuest</span><div><label class=\"switch\"><input id=\"autoQuestCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoTrollBattle</span><div>\
                     <label class=\"switch\"><input id=\"autoBattleCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label>\
                     <select id=\"autoTrollSelector\"><option value=\"latest\">Latest</option></select>\
                     </div>'
                     +'<span>AutoArenaBattle</span><div><label class=\"switch\"><input id=\"autoArenaCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoPachinko(Free)</span><div><label class=\"switch\"><input id=\"autoFreePachinko\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'</div>'+UIcontainer.html());
    // Add auto troll options
    var trollOptions = document.getElementById("autoTrollSelector");
    globalWorldMap.forEach(function(val,key){
        var option = document.createElement("option");
        option.text = key;
        trollOptions.add(option);
    });
    trollOptions.selectedIndex = sessionStorage.autoTrollSelectedIndex;
    document.getElementById("autoSalaryCheckbox").checked = sessionStorage.autoSalary === "true";
    document.getElementById("autoContestCheckbox").checked = sessionStorage.autoContest === "true";
    document.getElementById("autoMissionCheckbox").checked = sessionStorage.autoMission === "true";
    document.getElementById("autoQuestCheckbox").checked = sessionStorage.autoQuest === "true";
    document.getElementById("autoBattleCheckbox").checked = sessionStorage.autoTrollBattle === "true";
    document.getElementById("autoArenaCheckbox").checked = sessionStorage.autoArenaBattle === "true";
    document.getElementById("autoFreePachinko").checked = sessionStorage.autoFreePachinko === "true";
    sessionStorage.autoLoop = "true";
    if (typeof sessionStorage.freshStart == "undefined" || isNaN(Number(sessionStorage.autoLoopTimeMili))) {
        setDefaults();
    }
    autoLoop();
};
$("document").ready(start);