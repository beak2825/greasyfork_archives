// ==UserScript==
// @name         Harem(Hentai)Heroes Automatic
// @namespace    JDscripts
// @version      1.7
// @description  Open the menu in HaremHeroes(topright) to toggle AutoControlls. Supports AutoSalary, AutoQuest and AutoBattle. Messages are printed in local console.
// @author       JD
// @match        http*://nutaku.haremheroes.com/*
// @match        https://www.hentaiheroes.com/*
// @require      https://cdn.jsdelivr.net/js-cookie/2.2.0/js.cookie.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33878/Harem%28Hentai%29Heroes%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/33878/Harem%28Hentai%29Heroes%20Automatic.meta.js
// ==/UserScript==

GM_addStyle('/* The switch - the box around the slider */ .switch { position: relative; display: inline-block; width: 60px; height: 34px; } /* Hide default HTML checkbox */ .switch input {display:none;} /* The slider */ .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked + .slider { background-color: #2196F3; } input:focus + .slider { box-shadow: 0 0 1px #2196F3; } input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } /* Rounded sliders */ .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; }');

var proceedQuest = function () {
    //console.log("Starting auto quest.");
    var currentQuestMunuOption = $("nav div[rel='content'] a:has(.continue_quest)");
    if (currentQuestMunuOption === undefined || currentQuestMunuOption.attr("href") === undefined) {
        console.log("Could not find current quest menu button for verification. Probably it hasn't yet loaded.");
        return;
    }
    // Check if at correct page.
    if (currentQuestMunuOption.attr("href") !== window.location.pathname) {
        // Click on current quest to naviagte to it.
        console.log("Navigating to current quest.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + currentQuestMunuOption.attr("href");
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
        var energyCurrent = Number($("span[hero='energy_quest']").text());
        var moneyCurrent = Number($("div[hero='soft_currency'] span").text().trim().replace(',', ''));
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

var getSalary = function () {
    try {
        if ($("#breadcrumbs span").last().text() === "Harem") {
            console.log("Detected Harem Screen. Fetching Salary");
            $("#harem_whole #harem_left .salary:not('.loads') button").each(function (index) {
                $(this).click();
            });
            document.cookie = "nextSalaryTime=;";
        }
        else {
            // Not at Harem screen then goto the Harem screen.
            console.log("Navigating to Harem window.");
            sessionStorage.autoLoop = "false";
            window.location = window.location.origin + $("nav div[rel='content'] a:has(.harem)").attr("href");
            return;
        }
    }
    catch (ex) {
        console.log("Could not collect salary... " + ex);
    }
};

var doBossBattle = function()
{
    var currentPower = Number($("span[hero='energy_fight']").text());
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
    else if(window.location.pathname.startsWith("/quest"))
    {
        // On some quest screen.
        // Goto this area's screen.
        console.log("Navigating to latest Troll.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + $("#breadcrumbs a[class='back']").last().attr("href");
        return;
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
    else{
        console.log("Navigating to latest Troll.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + $("nav div[rel='content'] a:has(.continue_quest)").attr("href");
        return;
    }
};

var doBattle = function () {
    //console.log("Performing auto battle.");
    var currentPower = Number($("span[hero='energy_fight']").text());
    if(currentPower < 1)
    {
        //console.log("No power for battle.");
        return;
    }
    // Confirm if on correct screen.
    if ($("#breadcrumbs span").last().text() === "Battle") {
        // On battle page.
        //console.log("On Battle Page.");
        if ($("#arena[class='canvas']").length === 1) {
            // Oponent choose screen
            console.log("On opponent choose screen.");
            // Fight the first opponent in list.
            $(".opponents_arena .sub_block .grey_text_button:contains('Select')")[0].click();
            sessionStorage.autoLoop = "false";
        }
        else if ($("#battle[class='canvas']").length === 1) {
            // Battle screen
            //console.log("On battle screen.");
            var battleButton = $("#battle_middle button[rel='launch']");
            if(battleButton === undefined)return;
            if(battleButton.attr("price") === undefined){console.log("Could not detect battle button price. Maybe its not loaded yet.");return;}
            if(currentPower >= battleButton.attr("price"))
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
                console.log("Battle requires "+battleButton.attr("price")+" power.");
                sessionStorage.battlePowerRequired = battleButton.attr("price");
                if(sessionStorage.questRequirement === "battle")sessionStorage.questRequirement = "P"+battleButton.attr("price");
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
        window.location = window.location.origin + $("nav div[rel='content'] a:has(.battle)").attr("href");
        sessionStorage.autoLoop = "false";
        return;
    }
};

var updateData = function () {
    //console.log("updating UI");
    sessionStorage.autoSalary = document.getElementById("autoSalaryCheckbox").checked;
    sessionStorage.autoQuest = document.getElementById("autoQuestCheckbox").checked;
    sessionStorage.autoBattle = document.getElementById("autoBattleCheckbox").checked;
};

var autoLoop = function () {
    updateData();
    var busy = false;
    var page = window.location.href;
    var currentPower = Number($("span[hero='energy_fight']").text());
    //console.log("sal="+sessionStorage.autoSalary);
    if (sessionStorage.autoSalary === "true" && busy === false) {
        if (Cookies.get("nextSalaryTime") === undefined) {
            console.log("Time to fetch salary.");
            getSalary();
            busy = true;
        }
        else if (Cookies.get("nextSalaryTime") === "") {
            console.log("Salary fetched. Getting next fetch time");
            if ($("nav div[rel='content'] a:has(.home)").attr("href") !== window.location.pathname) {
                console.log("Moving to home.");
                sessionStorage.autoLoop = "false";
                // Goto Home page.
                window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href");
                busy=true;
                return;
            }
            var closestTime = $("#collect_all_bar .in monospace m").first();
            closestTime = (Number(closestTime.text() + closestTime.next().text()) * 60 + Number(closestTime.next().next().text() + closestTime.next().next().next().text()));
            document.cookie = "nextSalaryTime=present;max-age=" + (closestTime < 0 ? 0 : closestTime);
            console.log("New fetch time stored in nextSalaryTime cookie.(+" + closestTime + " sec.)");
            busy = false;
        }
    }
    if (sessionStorage.autoQuest === "true" && busy === false) {
        if (sessionStorage.questRequirement === "battle") {
            //console.log("Quest requires battle.");
            doBossBattle();
            busy = true;
        }
        else if (sessionStorage.questRequirement[0] === '$') {
            if (Number(sessionStorage.questRequirement.substr(1)) < Number($("div[hero='soft_currency'] span").text().trim().replace(',', ''))) {
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
            var energyCurrent = Number($("span[hero='energy_quest']").text());
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
    }else if(sessionStorage.autoQuest === "false"){sessionStorage.questRequirement = "none";}

    if(sessionStorage.autoBattle === "true")
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
                    sessionStorage.autoBattle = "false";
                    busy = false;
                }
                else
                    doBossBattle();
            }
            else
                doBossBattle();
        }
    }
    else{sessionStorage.battlePowerRequired = "0";}

    if(busy === true && sessionStorage.userLink==="none")
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
    sessionStorage.autoLoop = "true";
    sessionStorage.userLink = "none";
    sessionStorage.autoLoopTimeMili = "200";
    sessionStorage.autoQuest = "false";
    sessionStorage.autoBattle = "false";
    sessionStorage.battlePowerRequired = "0";
    sessionStorage.questRequirement = "none";
    sessionStorage.freshStart = "no";
};

var start = function () {
    //console.log("script started");
    // Add UI buttons.
    var UIcontainer = $("#contains_all nav div[rel='content']");
    UIcontainer.html('<div style="position: absolute;right: -9.675%; padding: 10px;width: inherit;text-align: center;display:flex;flex-direction:column;"><span>AutoSal.</span><div><label class=\"switch\"><input id=\"autoSalaryCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div><span>AutoQuest</span><div><label class=\"switch\"><input id=\"autoQuestCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div><span>AutoBattle</span><div><label class=\"switch\"><input id=\"autoBattleCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div></div>'+UIcontainer.html());
    document.getElementById("autoSalaryCheckbox").checked = sessionStorage.autoSalary === "true";
    document.getElementById("autoQuestCheckbox").checked = sessionStorage.autoQuest === "true";
    document.getElementById("autoBattleCheckbox").checked = sessionStorage.autoBattle === "true";
    sessionStorage.autoLoop = "true";
    if (typeof sessionStorage.freshStart == "undefined" || isNaN(Number(sessionStorage.autoLoopTimeMili))) {
        setDefaults();
    }
    autoLoop();
};
$("document").ready(start);
