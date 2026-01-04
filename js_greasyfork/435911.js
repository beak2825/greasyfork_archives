// ==UserScript==
// @name         Cookie Clicker Cheat
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A cookie clicker cheat that doesn't give you the cheater achievement!
// @author       vxi
// @license      GPLv3
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://orteil.dashnet.org/cookieclicker/*
// @match        http://orteil.dashnet.org/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/*
// @icon         https://www.google.com/s2/favicons?domain=dashnet.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435911/Cookie%20Clicker%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/435911/Cookie%20Clicker%20Cheat.meta.js
// ==/UserScript==

let unsafeWindow = window.wrappedJSObject;
let Game = unsafeWindow["Game"]

let injectionCheck = setInterval(() => {
    if (Object.keys(Game).length > 200) {
        InjectMods()
        clearInterval(injectionCheck)
    }
}, 1500);

function mlog(text, sv) {
    if(!sv) {
        let css = "border: 2px solid green;background-color:green;padding: 0px 3px;border-radius: 6px;";
        console.log("%cvcm", css, text);
    } else {
        let css = "border: 2px solid darkred;background-color:darkred;padding: 0px 3px;border-radius: 6px;";
        console.log("%cvcm", css, text);
    }
}

Game.vcm = {}

Game.vcm.protection = {
    run: function() {
        Game.Win= function(what)
		{
            if (what == "Cheated cookies taste awful") return;
			if (typeof what==='string')
			{
				if (Game.Achievements[what])
				{
					if (Game.Achievements[what].won==0)
					{
						var name=Game.Achievements[what].shortName?Game.Achievements[what].shortName:Game.Achievements[what].name;
						Game.Achievements[what].won=1;
						if (Game.prefs.popups) Game.Popup('Achievement unlocked :<br>'+name);
						else Game.Notify('Achievement unlocked','<div class="title" style="font-size:18px;margin-top:-2px;">'+name+'</div>',Game.Achievements[what].icon);
						if (Game.CountsAsAchievementOwned(Game.Achievements[what].pool)) Game.AchievementsOwned++;
						Game.recalculateGains=1;
					}
				}
			}
			else {for (var i in what) {Game.Win(what[i]);}}
		}
            
        if (Game.Achievements["Cheated cookies taste awful"].won = 1) {
            Game.Achievements["Cheated cookies taste awful"].won = 0;
        }
        let protectionInterval = setInterval(() => {
            if (Game.cookiesEarned < Game.cookies) {
                Game.cookiesEarned = Game.cookies;
            }
        }, 5000);

        mlog("cheat detection bypassed (1/3)");
    }   
}

Game.vcm.mods = {
    EditCookies: function(amount) {
        if (amount < 0) return;
        if (typeof amount === "number") {
            Game.cookiesEarned = amount;
            Game.cookies = amount;
            Game.Notify(`Edited cookie amount!`, "", false, true)
        }
    },
    EditCookiesPrompt: function() {
        let amount = prompt("What would you like your new cookie amount to be?")
        if (amount == null) return;
        if (isNaN(Number(amount))) return;
        Game.vcm.mods.EditCookies(Number(amount));
    },
    AddCookies: function(amount) {
        Game.cookiesEarned += amount;
        Game.cookies += amount;
        Game.Notify(`Cookies added!`, "", false, true)
    },
    AddCookiesPrompt: function() {
        let amount = prompt("How many cookies would you like to add to your current total?")
        if (amount == null) return;
        if(isNaN(Number(amount))) return;
        Game.vcm.mods.AddCookies(Number(amount))
    },
    Achievements: function(what) {
        if (what == "give") {
            Object.keys(Game.Achievements).forEach(achievement=>{
                if (Game.Achievements[achievement].name == "Cheated cookies taste awful") return;
                Game.Achievements[achievement].won = 1;
            });
            Game.WriteSave()
            Game.Notify(`All achievements unlocked!`,"",false, true)
        } else if (what == "take") {
            Object.keys(Game.Achievements).forEach(achievement=>{
                if (Game.Achievements[achievement].name == "Cheated cookies taste awful") return;
                Game.Achievements[achievement].won = 0;
            });
            Game.Notify(`All achievements removed!`,"",false, true)
            Game.WriteSave()
        } else {
            return;
        }
    },
    Season: function(season) {
        if (season == "christmas") {
            Game.baseSeason = "christmas"
            Game.season = "christmas"
        } else if (season == "valentines") {
            Game.baseSeason = "valentines"
            Game.season = "valentines"
        } else if (season == "fools") {
            Game.baseSeason = "fools"
            Game.season = "fools"
        } else if (season == "halloween") {
            Game.baseSeason = "halloween"
            Game.season = "halloween"
        } else if (season == "easter") {
            Game.baseSeason = "easter"
            Game.season = "easter"
        } else if (season == "none") {
            Game.baseSeason = ""
            Game.season = ""
            Game.Notify(`Season changed to normal`, "", false, true)
            return;
        } else {
            return;
        }
        Game.Notify(`Season changed to ${season}`,"",false, true)
    },
    Wrinklers: function() {
        // Add more options to this soon.
        Game.LoadWrinklers(1, 10, 10, 10);
    },
    Lumps: function(total) {
        // Also add more options to this
        if (Game.lumpsTotal==-1){Game.lumpsTotal=0;Game.lumps=0;}
        Game.lumps+=total;
        Game.lumpsTotal+=total;
    },
    run: function() {
        mlog(`cheat functions created (2/3)`)
    }
}

Game.vcm.visual = {
    inject: function() {
        const lockLogo = document.getElementById("httpsSwitch");

        let toggleMenu = document.createElement("a");
        toggleMenu.setAttribute("id", "menuToggle");

        toggleMenu.innerText = "Open Menu";
        toggleMenu.style.fontSize = "10px";
        toggleMenu.style.paddingLeft = "5px";

        lockLogo.after(toggleMenu);


        Game.vcm.visual.injectCSS(`
        #cheatAnchor {
            position:absolute;
            left:50%;
            top:125px;
            z-index:1000000000;
            display:none;
            width:0px;
            height:0px;
        }
        #cheatMenu {
            position: absolute;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 300px;
            height: 450px;
            background-color: black;
        }
        #seasonWarning {
            font-size: 14px !important;
        }
        `)
        // old menu height was 500.

        const promptAnchor = document.getElementById("promptAnchor");

        let cheatAnchor = document.createElement("div");
        cheatAnchor.setAttribute("id", "cheatAnchor");

        promptAnchor.after(cheatAnchor);

        // now inject cheatMenu into cheatAnchor

        let cheatMenu = document.createElement("div");
        cheatMenu.setAttribute("id", "cheatMenu");
        cheatMenu.setAttribute("class", "framed");
        document.getElementById("cheatAnchor").appendChild(cheatMenu);

        // Now to add to the menu itself now

        let cheatTitle = document.createElement("div");
        cheatTitle.setAttribute("class", "section");
        cheatTitle.innerText = "vxi's cookie mod";
        document.getElementById("cheatMenu").appendChild(cheatTitle)

        let subsectionOne = document.createElement("div");
        subsectionOne.setAttribute("class", "subsection");
        subsectionOne.setAttribute("id", "sub1");
        document.getElementById("cheatMenu").appendChild(subsectionOne);

        let mainOptionsTitle = document.createElement("div");
        mainOptionsTitle.setAttribute("class", "title");
        mainOptionsTitle.innerText = "Main Options";
        document.getElementById("sub1").appendChild(mainOptionsTitle);

        // to add to main options we should append to sub1

        // Edit cookies option
        let EditCookiesOption = document.createElement("a");
        EditCookiesOption.innerText = "Edit Cookies";
        EditCookiesOption.setAttribute("class", "option");
        EditCookiesOption.setAttribute("onclick", "Game.vcm.mods.EditCookiesPrompt()");
        document.getElementById("sub1").appendChild(EditCookiesOption);

        // Add cookies option
        let AddCookiesOption = document.createElement("a");
        AddCookiesOption.innerText = "Add Cookies";
        AddCookiesOption.setAttribute("class", "option");
        AddCookiesOption.setAttribute("onclick", "Game.vcm.mods.AddCookiesPrompt()");
        document.getElementById("sub1").appendChild(AddCookiesOption);

        // Give all cheevos
        let AddCheevos = document.createElement("a");
        AddCheevos.innerText = "Give all achievements";
        AddCheevos.setAttribute("class", "option");
        AddCheevos.setAttribute("onclick", "Game.vcm.mods.Achievements('give')");
        document.getElementById("sub1").appendChild(AddCheevos);

        // Remove all cheevos
        let TakeCheevos = document.createElement("a");
        TakeCheevos.innerText = "Remove all achievements";
        TakeCheevos.setAttribute("class", "option");
        TakeCheevos.setAttribute("onclick", "Game.vcm.mods.Achievements('take')");
        document.getElementById("sub1").appendChild(TakeCheevos);

        // Add shiny wrinklers
        let AddWrinklers = document.createElement("a");
        AddWrinklers.innerText = "Add 10 shiny wrinklers";
        AddWrinklers.setAttribute("class", "option");
        AddWrinklers.setAttribute("onclick", "Game.vcm.mods.Wrinklers()");
        document.getElementById("sub1").appendChild(AddWrinklers);

        // Add 100 lumps
        let AddLumps = document.createElement("a");
        AddLumps.innerText = "Add 100 lumps";
        AddLumps.setAttribute("class", "option");
        AddLumps.setAttribute("onclick", "Game.vcm.mods.Lumps(100)");
        document.getElementById("sub1").appendChild(AddLumps);


        // SEASON SECTION

        let subsectionTwo = document.createElement("div");
        subsectionTwo.setAttribute("class", "subsection");
        subsectionTwo.setAttribute("id", "sub2");
        document.getElementById("cheatMenu").appendChild(subsectionTwo);

        let SeasonOptionsTitle = document.createElement("div");
        SeasonOptionsTitle.setAttribute("class", "title");
        SeasonOptionsTitle.innerText = "Season Options";
        document.getElementById("sub2").appendChild(SeasonOptionsTitle);
        

        // append to sub2 for season options
        let NoneOption = document.createElement("a");
        NoneOption.innerText = "None";
        NoneOption.setAttribute("class", "option");
        NoneOption.setAttribute("onclick", "Game.vcm.mods.Season('none')");
        document.getElementById("sub2").appendChild(NoneOption);

        let ChristmasOption = document.createElement("a");
        ChristmasOption.innerText = "Christmas";
        ChristmasOption.setAttribute("class", "option");
        ChristmasOption.setAttribute("onclick", "Game.vcm.mods.Season('christmas')");
        document.getElementById("sub2").appendChild(ChristmasOption);

        let ValentinesOption = document.createElement("a");
        ValentinesOption.innerText = "Valentines";
        ValentinesOption.setAttribute("class", "option");
        ValentinesOption.setAttribute("onclick", "Game.vcm.mods.Season('valentines')");
        document.getElementById("sub2").appendChild(ValentinesOption);

        let FoolsOption = document.createElement("a");
        FoolsOption.innerText = "Business Day";
        FoolsOption.setAttribute("class", "option");
        FoolsOption.setAttribute("onclick", "Game.vcm.mods.Season('fools')");
        document.getElementById("sub2").appendChild(FoolsOption);

        let HalloweenOption = document.createElement("a");
        HalloweenOption.innerText = "Halloween";
        HalloweenOption.setAttribute("class", "option");
        HalloweenOption.setAttribute("onclick", "Game.vcm.mods.Season('halloween')");
        document.getElementById("sub2").appendChild(HalloweenOption);
        
        let EasterOption = document.createElement("a");
        EasterOption.innerText = "Easter";
        EasterOption.setAttribute("class", "option");
        EasterOption.setAttribute("onclick", "Game.vcm.mods.Season('easter')");
        document.getElementById("sub2").appendChild(HalloweenOption);

        // bug warning for seasons
        let SeasonWarning = document.createElement("p");
        SeasonWarning.setAttribute("class", "label");
        SeasonWarning.setAttribute("id", "seasonWarning");
        SeasonWarning.innerText = "Warning: changing seasons may come with game bugs!"
        document.getElementById("sub2").appendChild(SeasonWarning);

        // END SUB2 AND SEASON SECTION

        // INFO SUB UNTIL MORE OPTIONS COME

        let InfoSub = document.createElement("div");
        InfoSub.setAttribute("class", "subsection");
        InfoSub.setAttribute("id", "infosub");
        document.getElementById("cheatMenu").appendChild(InfoSub);

        let InfoTitle = document.createElement("div");
        InfoTitle.setAttribute("class", "title");
        InfoTitle.innerText = "Info";
        document.getElementById("infosub").appendChild(InfoTitle);

        let InfoText = document.createElement("p");
        InfoText.setAttribute("class", "label");
        InfoText.innerText = "New menu options will be available soon. If you want to help me understand the game or suggest new options contact me on Discord: vxi#1337"
        document.getElementById("infosub").appendChild(InfoText)
        // END INFO SUB


        document.getElementById("menuToggle").addEventListener("click", Game.vcm.visual.clicked);

        document.getElementById("darken").addEventListener("click", Game.vcm.visual.undarken);

        mlog(`visuals injected (3/3)`);
    },
    clicked: function () {
        Game.ClosePrompt();
        if (document.getElementById("menuToggle").innerText == "Open Menu") {
            document.getElementById("menuToggle").innerText = "Close Menu";
            document.getElementById("cheatAnchor").style.display = "block";
            document.getElementById("cheatAnchor").style.top = "50%";
            document.getElementById("darken").style.display = "block";
        } else if (document.getElementById("menuToggle").innerText = "Close Menu") {
            document.getElementById("menuToggle").innerText = "Open Menu";
            document.getElementById("cheatAnchor").style.display = "none";
            document.getElementById("cheatAnchor").style.top = "0%";
            document.getElementById("darken").style.display = "none";
        }
    },
    injectCSS: function (code) {
        let style = document.createElement('style');
        
        if (style.styleSheet) {
            style.styleSheet.cssText = code;
        } else {
            style.innerHTML = code;
        }
        
        document.getElementsByTagName("head")[0].appendChild(style);
    },
    undarken: function () {
        document.getElementById("menuToggle").innerText = "Open Menu";
        document.getElementById("cheatAnchor").style.display = "none"
        document.getElementById("cheatAnchor").style.top = "0%"
    }
}

function InjectMods() {
    Game.vcm.protection.run();
    Game.vcm.mods.run();
    Game.vcm.visual.inject();
    Game.Notify("vxi's cookie mod", "cheat successfully loaded, you can open it using the \"Open Menu\" button near the version number.", Game.Achievements["Follow the white rabbit"].icon, false, true);
}