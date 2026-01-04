// ==UserScript==
// @name         HaremHeroes Automation
// @namespace    JDscripts
// @version      2.1.27
// @description  Open the menu in HaremHeroes(topright) to toggle AutoControlls. Supports AutoSalary, Autodailies, Autoarena and AutoBattle. Messages are printed in local console.
// @author       JD, Modded by Zynoth
// @match        http*://nutaku.haremheroes.com/*
// @require      https://cdn.jsdelivr.net/js-cookie/2.2.0/js.cookie.js
// @require      https://greasyfork.org/scripts/369869-winrate-library/code/WinRate%20Library.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/368751/HaremHeroes%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/368751/HaremHeroes%20Automation.meta.js
// ==/UserScript==
// Have all shits ON by default
var OnByDefault = true;

// You can change the troll you want to fight here.
// 1. Dark Lord | 2. Ninja Spy | 3. Gruntt | 4. Edwarda | 5. Donatien
// 6. Silvanus | 7. Bremen | 8. Finalmecia | 9. Roko Senseï
var Trollnum = 9;

// This enables risktaking for arena (true to enable, false to disable), and with how much mojo you will risk.
var Risktaker = true;
var MinMojotoRiskat50 = 20;
var MinMojotoRiskat64 = 16;

// This specifies how much difference in ego you will let enemy be to enter a fight (the script becomes less reliable with too much ego difference)
var MaxEgoTolerance = 3500;

// This will add a higher WinRate value against enemies that have 4% less ego than you (so that it doesn't overvalue the enemies power in some cases). Set to false if you are losing battles with low EGO enemies.
var WRCorrection = true;

// Enable speed-mode for autoarena, autobattle, and autodailies (AutoBattle and AutoArena causes errors on Firefox).
var SpeedBattle = false;
var SpeedDailies = false;
var SpeedArena = false;

// You can change the name of the trolls that appear on the menu here
var Trollname = "";
if (Trollnum == 1) {Trollname = "Dark Lordo"}
if (Trollnum == 2) {Trollname = "Ninja Spy"}
if (Trollnum == 3) {Trollname = "Gruntt"}
if (Trollnum == 4) {Trollname = "Edwarda"}
if (Trollnum == 5) {Trollname = "Donatien"}
if (Trollnum == 6) {Trollname = "Silvanus"}
if (Trollnum == 7) {Trollname = "Bremen"}
if (Trollnum == 8) {Trollname = "Finalmecia"}
if (Trollnum == 9) {Trollname = "Roko Senseï"}

// -- END OF EDITABLE AREA --

GM_addStyle('/* The switch - the box around the slider */ .switch { position: relative; display: inline-block; width: 60px; height: 34px; } /* Hide default HTML checkbox */ .switch input {display:none;} /* The slider */ .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked + .slider { background-color: #2196F3; } input:focus + .slider { box-shadow: 0 0 1px #2196F3; } input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } /* Rounded sliders */ .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; }');

var getSalary = function () {
    try {
        if ($("#harem_whole")[0]) {
            if(document.readyState !== 'complete') {console.log("Detected Harem Screen. Waiting for page to load.")}
            var buttons = $("#harem_whole #harem_left .salary:not('.loads')");
                 if (buttons.length > 0 &&  document.readyState == 'complete' ) {
                   for(var i = 0; i <= buttons.length; i++) {
                       buttons[i].click();}
                };
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
        console.log("Collecting salary... ");
    }
};

// Dailies buttons
var Claimbuttons = $("#missions button[rel='claim']:not([style='display:none']):not(disabled)");
var Claimbuttons2 = $("#contests button[rel='claim']:not([style='display:none']):not(disabled)");
var Commonbuttons = $("#missions .mission_object.sub_block.common button[rel='mission_start']:not([style='display:none']):not(disabled)");
var Rarebuttons = $("#missions .mission_object.sub_block.rare button[rel='mission_start']:not([style='display:none']):not(disabled)");
var Epicbuttons = $("#missions .mission_object.sub_block.epic button[rel='mission_start']:not([style='display:none']):not(disabled)");
var Legendbuttons = $("#missions .mission_object.sub_block.legendary  button[rel='mission_start']:not([style='display:none']):not(disabled)");
var Giftbutton = $("#missions .end_gift:not([style='display:none']) button");

var doDaily = function () {
    try {
        if(window.location.pathname.startsWith("/activities.html")) {
            console.log("Detected Activities Screen. Completing dailies");
                     if(Commonbuttons.length > 0){
                         setTimeout(function(){Commonbuttons[0].click();},100)}
                     if(Rarebuttons.length > 0){
                         setTimeout(function(){Rarebuttons[0].click();},100)}
                     if(Epicbuttons.length > 0){
                         setTimeout(function(){Epicbuttons[0].click();},100)}
                     if(Legendbuttons.length > 0){
                         setTimeout(function(){Legendbuttons[0].click();},100)}
                     if(SpeedDailies == true) {
                         if(Giftbutton.length > 0){
                            setTimeout(function(){Giftbutton[0].click();},150);
                            setTimeout(function(){$("#missions_rewards .blue_text_button").click();},2500);}}
                     if(Claimbuttons.length > 0){
                         setTimeout(function(){Claimbuttons[0].click();},500);
                         setTimeout(function(){$("#missions_rewards .blue_text_button").click();},3000);}
                     if(Claimbuttons2.length > 0){
                         setTimeout(function(){Claimbuttons2[0].click();},1000);
                         setTimeout(function(){$("#missions_rewards .blue_text_button").click();},4000);
                     }
                        document.cookie = "nextDailyTime=;";
                     if (SpeedDailies == false) {
                         if(Giftbutton.length > 0){
                            setTimeout(function(){Giftbutton[0].click();},3500);
                            setTimeout(function(){$("#missions_rewards .blue_text_button").click();},6500);}
                     if(Claimbuttons.length > 0){
                         setTimeout(function(){Claimbuttons[0].click();},500);
                         setTimeout(function(){$("#missions_rewards .blue_text_button").click();},3000);}
                     if(Claimbuttons2.length > 0){
                         setTimeout(function(){Claimbuttons2[0].click();},1000);
                         setTimeout(function(){$("#missions_rewards .blue_text_button").click();},4000);}}
        }
        else {
            // Not at Activities screen then goto the Harem screen.
            console.log("Navigating to Activities window.");
            sessionStorage.autoLoop = "false";
            window.location = window.location.origin + $("nav div[rel='content'] a:has(.activities)").attr("href");
            return;
        }
    }
    catch (ex) {
        console.log("Could not complete mission... " + ex);
    }
};

var doBossBattle = function() {
    var currentPower = Number($(".energy_counter[type='energy_fight'] .over span[energy]").text());
    if(currentPower < 1)
    {
        //console.log("No power for battle.");
        return;
    }
    // Battles the latest boss.
    // Navigate to latest boss.
    if(window.location.href.indexOf("id_troll") > -1){
        // On the battle screen.
        doBattle();
    }
    else if(window.location.pathname.startsWith("/quest"))
    {
        // On some quest screen.
        // Goto this area's screen.
        console.log("Exiting to set Troll.");
        sessionStorage.autoLoop = "false";
        window.location = "https://nutaku.haremheroes.com/battle.html?id_troll=" + Trollnum;
        return;
    }
    else if(window.location.pathname.startsWith("/world"))
    {
        // On some world screen.
        // Click on the local Boss's battle button.
        console.log("Entering battle with set troll.");
        sessionStorage.autoLoop = "false";
        window.location = "https://nutaku.haremheroes.com/battle.html?id_troll=" + Trollnum;
        return;
    }
    else{
        console.log("Navigating to set Troll.");
        sessionStorage.autoLoop = "false";
        window.location = "https://nutaku.haremheroes.com/battle.html?id_troll=" + Trollnum; // window.location.origin + $("nav div[rel='content'] a:has(.continue_quest)").attr("href");
        return;
    }
};

var doBattle = function () {
    //console.log("Performing auto battle.");
    var currentPower = Number($(".energy_counter[type='energy_fight'] .over span[energy]").text());
    var battleButton = $("#battle_middle button[rel='launch']:not(disabled)");
    if (window.location.href.indexOf("id_arena") > -1) {battleButton = $("#battle_middle button.blue_text_button.short[rel='launch']:not(disabled)");}
    if ($("#battle[class='canvas']").length === 1) {
        if(battleButton === undefined)return;
        if(battleButton.attr("price_fe") === undefined){console.log("Could not detect battle button price. Maybe its not loaded yet.");return;}
        if(currentPower >= battleButton.attr("price_fe")){
            sessionStorage.autoLoop = "false"
            // We have the power.
            battleButton[0].click();
            // Skip
            setTimeout(function(){$("#battle_middle button[rel='skip']").click();},3500);
            setTimeout(function(){$("#battle_end .blue_text_button").click();},4000);
            if (sessionStorage.questRequirement === "battle") {
                // Battle Done.
                sessionStorage.questRequirement = "BattleDone";
            }
            if (SpeedBattle == true && sessionStorage.questRequirement === "BattleDone") {window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")}
            return;
        }
        else {
            // We need more power.
            console.log("Battle requires "+battleButton.attr("price_fe")+" power.");
            sessionStorage.battlePowerRequired = battleButton.attr("price_fe");
        }
    }
}

var getPVPstats = function() {
sessionStorage.autoLoop = "false";

// Mojo to win
var MojoToWin = Number($(".rewards_list .slot_mojo h3").text());

// WR correction for distant ego battles
if (WRCorrection == true) {
   if (HeroNormalRounds - HeroWorstRounds > 1) {WinRate += 0.110}
   if (HeroBestRounds - HeroNormalRounds > 1) {WinRate += 0.110}
}

// Fix to prevent glitches
var RoundsVariance = HeroNormalRounds;
var ERoundsVariance = EnemyNormalRounds;
if (EnemyNormalRounds == 0 || EnemyNormalRounds == undefined) {ERoundsVariance = 0; WinRate = 0}
if (HeroNormalRounds == 0 || HeroNormalRounds == undefined) {RoundsVariance = 0; WinRate = 0}

console.log("Flagging enemy as visited.");
if (window.location == window.location.origin + "/battle.html?id_arena=0") {sessionStorage.Battler1 = 1}
if (window.location == window.location.origin + "/battle.html?id_arena=1") {sessionStorage.Battler2 = 1}
if (window.location == window.location.origin + "/battle.html?id_arena=2") {sessionStorage.Battler3 = 1}

if (HeroEgo + MaxEgoTolerance >= EnemyEgo) {
  if (ERoundsVariance == 0 || ERoundsVariance == undefined || RoundsVariance == 0 || RoundsVariance == undefined) {
    console.log("Enemy bugged, restarting flag.");
    if (window.location == window.location.origin + "/battle.html?id_arena=0") {sessionStorage.Battler1 = 0}
    if (window.location == window.location.origin + "/battle.html?id_arena=1") {sessionStorage.Battler2 = 0}
    if (window.location == window.location.origin + "/battle.html?id_arena=2") {sessionStorage.Battler3 = 0}
    window.location = window.location.origin + "/arena.html"}

  else if (WinRate >= 0.54 && EnemyNormalRounds != 0 && EnemyNormalRounds != "NaN") {
    if (WinRate < 0.60 && Risktaker == true && MojoToWin >= MinMojotoRiskat50){
        console.log("Taking risk.");
        doBattle();
        if (SpeedArena == true) {window.location = window.location.origin + "/arena.html"}}
    else if (WinRate < 0.74 && WinRate > 0.60 && HeroEgo - EnemyEgo > 0.01 * HeroEgo && MojoToWin >= MinMojotoRiskat64/2 && Risktaker == true) {
        console.log("Taking risk.");
        doBattle();
        if (SpeedArena == true) {window.location = window.location.origin + "/arena.html"}}
    else if (WinRate < 0.74 && WinRate > 0.60 && Risktaker == true && MojoToWin >= MinMojotoRiskat64){
        console.log("Taking risk.");
        doBattle();
        if (SpeedArena == true) {window.location = window.location.origin + "/arena.html"}}
    else if (WinRate >= 0.74 && EnemyNormalRounds != 0) {
        console.log("Fighting battler.");
        doBattle();
        if (SpeedArena == true) {window.location = window.location.origin + "/arena.html"}}
    else {
        console.log("Mojo to win not worth the risk, going back to arena.");
        if (window.location == window.location.origin + "/battle.html?id_arena=0") {sessionStorage.LostBattler1 = 1}
        if (window.location == window.location.origin + "/battle.html?id_arena=1") {sessionStorage.LostBattler2 = 1}
        if (window.location == window.location.origin + "/battle.html?id_arena=2") {sessionStorage.LostBattler3 = 1}
        window.location = window.location.origin + "/arena.html"}
  }

  else{
    console.log("Enemy too strong, going back to arena.");
    window.location = window.location.origin + "/arena.html"}}

else{
    console.log("Enemy ego too high, going back to arena.");
    window.location = window.location.origin + "/arena.html"}
}
var doArena = function() {
var battler1 = $('div[href="/battle.html?id_arena=0"]:not(.disabled)');
var battler2 = $('div[href="/battle.html?id_arena=1"]:not(.disabled)');
var battler3 = $('div[href="/battle.html?id_arena=2"]:not(.disabled)');
var ArenaReward = $('#missions_rewards .blue_text_button:not([style="display: none"])');
if(sessionStorage.Battler1 == 1 && sessionStorage.Battler2 == 1 && sessionStorage.Battler3 == 1 && window.location.pathname.startsWith("/arena.html")) {
    console.log("Arena battles finished. Getting next arena time.");
    var closestArena = $(".arena_refresh_counter span[rel='count']");
       if ((closestArena.text()).charAt(closestArena.text().length-1) == "m") {closestArena = parseInt(closestArena.text()) * 60}
       else if ((closestArena.text()).charAt(closestArena.text().length-1) == "s") {closestArena = parseInt(closestArena.text())}
            document.cookie = "nextArenaTime=present;max-age=" + (closestArena < 0 ? 0 : closestArena);
            console.log("New fetch time stored in nextArenaTime cookie.(+" + closestArena + " sec.)");
    sessionStorage.Battlers = 1;
    return;
}

else if(window.location.href.indexOf("id_arena") > -1){
        // On the battle screen.
        getPVPstats();
}
else if (window.location.pathname.startsWith("/arena.html")) {
    if (battler1[0] && sessionStorage.Battler1 == 0) {
      console.log("Navigating to First battler.");
      sessionStorage.autoLoop = "false";
      window.location = window.location.origin + "/battle.html?id_arena=0";
      return;
    }
    else {sessionStorage.Battler1 = 1};

    if (battler2[0] && sessionStorage.Battler2 == 0) {
      console.log("Navigating to second battler.");
      sessionStorage.autoLoop = "false";
      window.location = window.location.origin + "/battle.html?id_arena=1";
      return;
    }
    else {sessionStorage.Battler2 = 1};

    if (battler3[0] && sessionStorage.Battler3 == 0) {
      console.log("Navigating to third battler.");
      sessionStorage.autoLoop = "false";
      window.location = window.location.origin + "/battle.html?id_arena=2";
      return;
    }
    else {sessionStorage.Battler3 = 1};

    if ($('.sub_block .frontbar .bluebar[style="width: 25%"]') || $('.sub_block .frontbar .bluebar[style="width: 50%"]' || $('.sub_block .frontbar .bluebar[style="width: 100%"]'))) {
        setTimeout(function(){ArenaReward[0].click();},2500);
        if (battler1.length == 1 && sessionStorage.LostBattler1 == 0) {sessionStorage.Battler1 = 0}
        if (battler2.length == 1 && sessionStorage.LostBattler2 == 0) {sessionStorage.Battler2 = 0}
        if (battler3.length == 1 && sessionStorage.LostBattler3 == 0) {sessionStorage.Battler3 = 0}
        return}

}
else {
    // Navigate to Arena.
        console.log("Navigating to Arena.");
        sessionStorage.autoLoop = "false";
        window.location = window.location.origin + "/arena.html";
        return;}
};
var updateData = function () {
    //console.log("updating UI");
    sessionStorage.autoSalary = document.getElementById("autoSalaryCheckbox").checked;
    sessionStorage.autoDaily = document.getElementById("autoDailyCheckbox").checked;
    sessionStorage.autoBattle = document.getElementById("autoBattleCheckbox").checked;
    sessionStorage.autoArena = document.getElementById("autoArenaCheckbox").checked;
    sessionStorage.autoFreePachinko = document.getElementById("autoFreePachinko").checked;
};

var getPachinko = function(){
    try {
        if ($("#breadcrumbs span").last().text() === "Pachinko") {
            console.log("Detected Pachinko Screen. Fetching Pachinko");
            $("#pachinko button[free=1]")[0].click();
            document.cookie = "nextPachinkoTime=24hrs;max-age="+24*60*60;
        }
        else {
            // Not at Pachinko screen then goto the Pachinko screen.
            console.log("Navigating to Pachinko window.");
            sessionStorage.autoLoop = "false";
            window.location = window.location.origin + $("nav div[rel='content'] a:has(.pachinko)").attr("href");
            return;
        }
    }
    catch (ex) {
        console.log("Could not collect pachinko... " + ex);
    }
};

if (window.location.pathname.startsWith("/shop.html") || window.location.href.indexOf("/quest/") > -1) {}
else {
var autoLoop = function () {
    updateData();
    var busy = false;
    var page = window.location.href;
    var currentPower = Number($(".energy_counter[type='energy_fight'] .over span[energy]").text());
    //console.log("sal="+sessionStorage.autoSalary);

    if(sessionStorage.autoFreePachinko === "true" && busy === false)
    {
        // Navigate to pachinko
        if (Cookies.get("nextPachinkoTime") === undefined) {
            console.log("Time to fetch Pachinko.");
            getPachinko();
            busy = true;
        }
    }
    if(sessionStorage.autoBattle === "true")
    {
        if(busy === false && currentPower >= Number(sessionStorage.battlePowerRequired) && currentPower > 0){
            console.log("Time to battle a Troll.");
            sessionStorage.questRequirement = "battle";
            doBossBattle();
            busy=true}

        else if (sessionStorage.questRequirement == "BattleDone") {
            sessionStorage.questRequirement = "none";
            sessionStorage.autoLoop = "false";
            // Goto Home page.
            window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href");
            return;}
    }
    else{sessionStorage.battlePowerRequired = "0";}

    if (sessionStorage.autoArena === "true" && busy === false) {
        if (Cookies.get("nextArenaTime") === undefined || Cookies.get("nextArenaTime") === "") {
            console.log("Time to battle at the arena.");
            doArena();
            busy=true;
        }
        else if (sessionStorage.Battlers == 1) {
                console.log("Restarting battler flags.");
                sessionStorage.Battlers = 0;
                sessionStorage.Battler1 = 0;
                sessionStorage.Battler2 = 0;
                sessionStorage.Battler3 = 0;
                sessionStorage.LostBattler1 = 0;
                sessionStorage.LostBattler2 = 0;
                sessionStorage.LostBattler3 = 0;
            if ($("nav div[rel='content'] a:has(.home)").attr("href") !== window.location.pathname) {
                console.log("Moving to home.");
                sessionStorage.autoLoop = "false";
                // Goto Home page.
                window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href");
                busy = false;
                return;}}
    }
      if (sessionStorage.autoDaily === "true" && busy === false) {
        if (Cookies.get("nextDailyTime") === undefined || Cookies.get("nextDailyTime") === 0) {
            console.log("Time to do missions.");
            doDaily();
            busy = true;
        }
        else if (Cookies.get("nextDailyTime") === "") {
            console.log("Mission started. Getting next mission time");
            if ($("nav div[rel='content'] a:has(.home)").attr("href") !== window.location.pathname) {
                console.log("Moving to home.");
                sessionStorage.autoLoop = "false";
                if (SpeedDailies == true) {
                    // Goto Home page.
                    window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")}
                else if (Commonbuttons.length == 0 && Rarebuttons.length == 0 && Epicbuttons.length == 0 && Legendbuttons.length == 0) {
                    setTimeout(function(){window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")}, 7000)}
                else {
                    setTimeout(function(){window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")}, 4000)};
                busy=true;
                return;
            }
            var closestMission = $("#home_missions_bar1:not([style='display: none']) .text span");
            if (closestMission.text() != "") {
                if ((closestMission.text()).charAt(1) == "h") {
                    closestMission = parseInt((closestMission.text()).charAt(0)) * 3600 + parseInt((closestMission.text()).substr(2, (closestMission.text()).length)) * 60;}
                else if ((closestMission.text()).charAt(2) == "h") {
                    closestMission = parseInt((closestMission.text()).substr(0, 2)) * 3600 + parseInt((closestMission.text()).substr(3, (closestMission.text()).length)) * 60;}
                else if ((closestMission.text()).charAt(1) == "m") {
                    closestMission = parseInt((closestMission.text()).charAt(0)) * 60;}
                else if ((closestMission.text()).charAt(2) == "m") {
                    closestMission = parseInt((closestMission.text()).substr(0, 2)) * 60;}
                else if ((closestMission.text()).charAt(2) == "s") {
                    closestMission = parseInt((closestMission.text()).substr(0, 2));}}
            if (closestMission > 0) {
                document.cookie = "nextDailyTime=present;max-age=" + (closestMission < 0 ? 0 : closestMission);
                console.log("Next Mission time stored in nextDailyTime cookie.(+" + closestMission + " sec.)");
                busy = false;}
            var closestMission2 = $("#home_missions_bar2:not([style='display: none']) .text span");
            if (closestMission2.text() != "") {
                if ((closestMission2.text()).charAt(1) == "h") {
                    closestMission2 = parseInt((closestMission2.text()).charAt(0)) * 3600 + parseInt((closestMission2.text()).substr(2, (closestMission2.text()).length)) * 60;}
                else if ((closestMission2.text()).charAt(2) == "h") {
                    closestMission2 = parseInt((closestMission2.text()).substr(0, 2)) * 3600 + parseInt((closestMission2.text()).substr(3, (closestMission2.text()).length)) * 60;}
                else if ((closestMission2.text()).charAt(1) == "m") {
                    closestMission2 = parseInt((closestMission2.text()).charAt(0)) * 60;}
                else if ((closestMission2.text()).charAt(2) == "m") {
                    closestMission2 = parseInt((closestMission2.text()).substr(0, 2)) * 60;}
                else if ((closestMission2.text()).charAt(2) == "s") {
                    closestMission2 = parseInt((closestMission2.text()).substr(0, 2));}}
            if (closestMission2 > 0) {
                document.cookie = "nextDailyTime=present;max-age=" + (closestMission2 < 0 ? 0 : closestMission2);
                console.log("Next Mission time stored in nextDailyTime cookie.(+" + closestMission2 + " sec.)");
                busy = false;}
        }
    }
     if (sessionStorage.autoSalary === "true" && busy === false) {
        var SalaryButton = $("button#collect_all[style='display: inline-block;']");
        if ($("#homepage")[0]) {
            if (SalaryButton.length > 0) {
                busy = true;
                console.log("Time to fetch salary.");
                getSalary();
        }
            else if (SalaryButton.length == 0 && Cookies.get("nextSalaryTime") === undefined || SalaryButton.length == 0 && Cookies.get("nextSalaryTime") == "") {
                var closestTime = $("#collect_all_bar .in span");
                if ((closestTime.text()).charAt(1) == "m") {
                    closestTime = parseInt((closestTime.text()).charAt(0)) * 60;}
                else if ((closestTime.text()).charAt(2) == "m") {
                    closestTime = parseInt((closestTime.text()).substr(0, 2)) * 60;}
                else if ((closestTime.text()).charAt(2) == "s") {
                    closestTime = parseInt((closestTime.text()).substr(0, 2));}
                else {closestTime = ""}
                document.cookie = "nextSalaryTime=present;max-age=" + (closestTime < 0 ? 0 : closestTime);
                console.log("New fetch time stored in nextSalaryTime cookie.(+" + closestTime + " sec.)");
                busy = false}
        }
        else if ($("#harem_whole")[0]) {
            if (SalaryButton.length > 0) {
                busy = true;
                document.cookie = 'nextSalaryTime=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                getSalary();}
            else if (Cookies.get("nextSalaryTime") == "" && SalaryButton.length == 0 || Cookies.get("nextSalaryTime") === undefined && SalaryButton.length == 0) {
            console.log("Salary fetched. Getting next fetch time");
                console.log("Moving to home.");
                sessionStorage.autoLoop = "false";
                // Goto Home page.
                window.location = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href");
                return;
        }
    }
        else if ($("#harem_whole").length == 0 && Cookies.get("nextSalaryTime") === undefined || $("#harem_whole").length == 0 && Cookies.get("nextSalaryTime") == "") {
              busy = true;
              console.log("Time to fetch salary.");
              getSalary()}
     }
    if(busy === true && sessionStorage.userLink==="none")
    {
        if (window.location.href.indexOf("log_in.php") > -1) {
        sessionStorage.userLink = window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")}
        else {sessionStorage.userLink = page}
    }
    else if(sessionStorage.userLink !=="none" && busy === false)
    {
        if (sessionStorage.userLink != window.location.origin + $("nav div[rel='content'] a:has(.home)").attr("href")) {
        console.log("Restoring page "+sessionStorage.userLink);
        window.location = sessionStorage.userLink;}
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
};}

var setDefaults = function () {
    console.log("Setting Defaults.");
    sessionStorage.autoSalary = "false";
    sessionStorage.autoFreePachinko = "false";
    sessionStorage.autoLoop = "true";
    sessionStorage.userLink = "none";
    sessionStorage.autoLoopTimeMili = "200";
    sessionStorage.autoDaily = "false";
    sessionStorage.autoArena = "false";
    sessionStorage.Battler1 = 0;
    sessionStorage.Battler2 = 0;
    sessionStorage.Battler3 = 0;
    sessionStorage.LostBattler1 = 0;
    sessionStorage.LostBattler2 = 0;
    sessionStorage.LostBattler3 = 0;
    sessionStorage.Battlers = 0;
    sessionStorage.autoBattle = "false";
    sessionStorage.battlePowerRequired = "0";
    sessionStorage.questRequirement = "none";
    sessionStorage.freshStart = "no";
};

var start = function () {
    //console.log("script started");
    // Add UI buttons.
    var UIcontainer = $("#contains_all nav div[rel='content']");
    UIcontainer.html('<div style="position: absolute;right: -12%; padding: 10px;width: inherit;text-align: center;display:flex;flex-direction:column;">'
                     +'<span>AutoSal.</span><div><label class=\"switch\"><input id=\"autoSalaryCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoBattle</span><span id="trollna" style="font-size: 0.75em">No troll defined</span><div><label class=\"switch\"><input id=\"autoBattleCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoDaily</span><div><label class=\"switch\"><input id=\"autoDailyCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span>AutoArena</span><div><label class=\"switch\"><input id=\"autoArenaCheckbox\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'<span style="display:none !important">AutoPachinko</span><div style="display:none !important"><label class=\"switch\"><input id=\"autoFreePachinko\" type=\"checkbox\"><span class=\"slider round\"></span></label></div>'
                     +'</div>'+UIcontainer.html());
    document.getElementById("autoSalaryCheckbox").checked = sessionStorage.autoSalary === "true";
    document.getElementById("autoDailyCheckbox").checked = sessionStorage.autoDaily === "true";
    document.getElementById("autoBattleCheckbox").checked = sessionStorage.autoBattle === "true";
    document.getElementById("autoArenaCheckbox").checked = sessionStorage.autoArena === "true";
    document.getElementById("autoFreePachinko").checked = sessionStorage.autoFreePachinko === "true";
    document.getElementById("trollna").innerHTML = "(" + Trollname + ")";
    sessionStorage.autoLoop = "true";
    if (typeof sessionStorage.freshStart == "undefined" || isNaN(Number(sessionStorage.autoLoopTimeMili))) {
        setDefaults();
    }
    autoLoop();

    if (OnByDefault == true) {
        document.getElementById("autoSalaryCheckbox").checked = true;
        document.getElementById("autoDailyCheckbox").checked = true;
        document.getElementById("autoBattleCheckbox").checked = true;
        document.getElementById("autoArenaCheckbox").checked = true;
    }
};
$("document").ready(start);
