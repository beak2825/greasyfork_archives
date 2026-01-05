// ==UserScript==
// @namespace   dex.gos
// @name        Gates of Survival - Combat Assist
// @description A collection combat things. Highlights and enlarges your post-modified health at the end of each round (and only the last of the health totals) in order to make it very easy to see at a glance. Will play a sound effect if your health is "red". Also tracks many combat stats (thanks to dangnabbit for greatly increasing the number of things it tracks) and provides an export button to export that data to a CSV.
// @include     https://www.gatesofsurvival.com/game/index.php?page=main
// @grant       none
// @version     4.4
// @downloadURL https://update.greasyfork.org/scripts/22569/Gates%20of%20Survival%20-%20Combat%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/22569/Gates%20of%20Survival%20-%20Combat%20Assist.meta.js
// ==/UserScript==

// The game does everything by AJAX requests, so the standard way to make the script only run on certain pages doesn't apply. Use this to hook into each AJAX call and make the
// script run each time the correct "page" loads.
function callbackIfPageMatched(matchUrlRegEx, callback) {
    $(document).ajaxSuccess(
        function(event, xhr, settings) {
            var result = matchUrlRegEx.exec(settings.url);
            if(result != null) {
                // Wait 250 milliseconds before calling the function so that the page has hopefully had time to update.
                window.setTimeout(callback, 250);
            }
        }
    );
}



var logging = false;
//var logging = true;
var collectStats = false;
// Buffers automatically when created.
//var snd = new Audio("http://soundbible.com/mp3/Air Horn-SoundBible.com-964603082.mp3");  // This one is a little loud.
//snd.volume = 0.5;  //?
//var snd = new Audio("http://soundbible.com/mp3/Bike Horn-SoundBible.com-602544869.mp3");
//snd.volume = 0.75;  //?
var snd = new Audio("http://soundbible.com/mp3/Horn Honk-SoundBible.com-1634776698.mp3");
//var snd = new Audio("http://soundbible.com/mp3/Police Siren 2-SoundBible.com-2063505282.mp3");
//var snd = new Audio("http://soundbible.com/mp3/Industrial Alarm-SoundBible.com-1012301296.mp3");

if (typeof(Storage) !== "undefined") {
    // Local storage is allowed. Set the flag to collect stats.
    collectStats = true;
    console.log("dex.combat_assist    Local storage available; combat stats will be collected.");
} else {
    console.log("dex.combat_assist    Local storage not available; combat stats will *not* be collected.");
}



function dtrmnHlthStl(curHlth, maxHlth) {
    if (logging) {
        console.log("dex.combat_assist    curHlth: " + curHlth + "; maxHlth: " + maxHlth);
    }
    // Default style, if health is critically low or if the max health could not be found.
    var hlthStyle = "'color: red; font-size: 300%;'";
    
    if (maxHlth > 0) {
        var prcntg = curHlth / maxHlth;
        if (logging) {
            console.log("dex.combat_assist    prcntg: " + prcntg);
        }
        
        if (prcntg <= 0.15) {
            // Health is critical. Play the warning sound effect.
            snd.play();
        }
        // If health is dangerously low, set the slightly smaller, orange style (for now, this may be overridden in a bit if the health percentage is high enough)
        if (prcntg > 0.15) {
            hlthStyle = "'color: orange; font-size: 250%;'";
        }
        // If health is in bad shape, set the still smaller, yellow style (for now, this may be overridden in a bit if the health percentage is high enough)
        // This provides the upper bounds for the previous style. Doing it this way is a little less efficient, but much easier to modify the percentage scale for the styles (or add a new style).
        if (prcntg > 0.25) {
            hlthStyle = "'color: yellow; font-size: 200%;'";
        }
        // If health is good, set the slightly enlarged, green style.
        // This provides the upper bounds for the previous style. Doing it this way is a little less efficient, but much easier to modify the percentage scale for the styles (or add a new style).
        if (prcntg > 0.50) {
            hlthStyle = "'color: green; font-size: 150%;'";
        }
    }
    
    return hlthStyle;
}

function highlightHlth() {
    var healthFnd = false;
    var rgxHlthRplc = /./;
    var newHlthStr = "";
    var maxHealth = 0;
    
    // Get the html of the appropriate section of the page as a string.
    var page = $("#end_result");
    var pageContent = page.html();
    
    // Look for the first health report (how much you had left after the fight).
    var rgxHealth = /still have <b>([\d,]+)<\/b> \/ <b>([\d,]+)<\/b> health/i;
    var result = rgxHealth.exec(pageContent);
    if (result != null) {
        var temp = parseInt(result[2].replace(/,/g, ""), 10);
        if (temp > 0) {
            maxHealth = temp;
        }
        
        healthFnd = true;
        rgxHlthRplc = rgxHealth;
        
        var curHealth = parseInt(result[1].replace(/,/g, ""), 10);
        var hlthStyle = dtrmnHlthStl(curHealth, maxHealth);
        
        newHlthStr = "still have <span style=" + hlthStyle + ">$1</span> \/ <b>$2<\/b> health";
    }
    
    // Look for the second health report (how much you had left after eating).
    rgxHealth = /now have <b>(\d+) HP<\/b>/i;
    result = rgxHealth.exec(pageContent);
    if (result != null) {
        healthFnd = true;
        rgxHlthRplc = rgxHealth;
        
        curHealth = parseInt(result[1], 10);
        hlthStyle = dtrmnHlthStl(curHealth, maxHealth);
        
        newHlthStr = "now have <span style=" + hlthStyle + ">$1</span> <b>HP<\/b>";
    }
    
    /*    This is no longer in the game.
    // Look for the third health report (how much you had left after spontaneous regeneration).
    var rgxHealth = /now have <b>(\d+) HP<\/b>!/i;
    result = rgxHealth.exec(pageContent);
    if (result != null) {
        healthFnd = true;
        rgxHlthRplc = rgxHealth;
        
        curHealth = parseInt(result[1], 10);
        var hlthStyle = dtrmnHlthStl(curHealth, maxHealth);
        
        newHlthStr = "now have <span style=" + hlthStyle + ">$1</span> <b>HP<\/b>!";
    }
    */
    
    if (healthFnd) {
        pageContent = pageContent.replace(rgxHlthRplc, newHlthStr);
        page.html(pageContent);
    }
}


function addMnstrCoinStats(monsterStats) {
    // Look for the coin loot from the fight.
    var rgxCoin = /and <b>([\d,]+) coin<\/b> from killing the <b>([^<]+)<\/b>!/i;
    var result = rgxCoin.exec($("#end_result").html());
    
    if (result != null) {
        // Found the monster and coin data. Default the boost to false now, it will be changed later if the boost is on.
        monsterStats.midasBoost = false;
        
        // Pull the data out.
        var coins = result[1].replace(/,/g, "");
        var monster = result[2];
        if (logging) {
            console.log("dex.combat_assist    Coins earned: " + coins + "; Monster fought: " + monster);
        }
        monsterStats.name = monster;
        monsterStats.coins = coins;
        
        // Determine if the Midas boost is on. If it is, it skews the data, so it needs to be flagged.
        var boostsString = $("div.alert-pet_box.boost_show").html();
        var rgxMidas = /Hand of Midas \(x2 Coin\)/i;
        result = rgxMidas.exec(boostsString);
        if (result != null) {
            // The boost is on.
            if (logging) {
                console.log("dex.combat_assist    The Midas boost is on.");
            }
            monsterStats.midasBoost = true;
        }
    }
}

function addMnstrCombatStats(monsterStats) {
    // Look for the rounds and damage done from the fight.
    var pageContent = $("#page2 div.csstable").eq(1).html();
    var rgxRnds = /Monster Rounds.*?<b>([^<]*)<\/b>/i;
    var rgxDmgTkn = /Monster Damage Dealt.*?<b>([^<]*)<\/b>/i;
    
    var result = rgxRnds.exec(pageContent);
    if (result != null) {
        // Found the monster rounds data. Pull the data out.
        var rnds = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Monster rounds: " + rnds);
        }
        monsterStats.rounds = rnds;
    }
    
    result = rgxDmgTkn.exec(pageContent);
    if (result != null) {
        // Found the total monster damage data. Pull the data out.
        var dmgTkn = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Damage taken: " + dmgTkn);
        }
        monsterStats.ttlDmg = dmgTkn;
    }
}


function addPlyrStats(playerStats) {
    // Grab the section housing all of the player stats.
    var pageContent = $("#page2 div.csstable").eq(1).html();
    
    // Look for the rounds and damage done from the fight.
    var rgxRnds = /Player Rounds.*?<b>([^<]*)<\/b>/i;
    var rgxDmgDlt = /Total Damage Dealt.*?<font[^>]*?color.*?>([^<]*)<\/font>/i;

    var result = rgxRnds.exec(pageContent);
    if (result != null) {
        // Found the Player rounds data. Pull the data out.
        var rounds = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Player rounds: " + rounds);
        }
        playerStats.rounds = rounds;
    }

    result = rgxDmgDlt.exec(pageContent);
    if (result != null) {
        // Found the Damage dealt data. Pull the data out.
        var ttlDmg = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Player damage dealt: " + ttlDmg);
        }
        playerStats.ttlDmg = ttlDmg;
    }
    
    // Call the method containing all the regexes for the player attack numbers.
    addPlyrAtkStats(playerStats, pageContent);
    // Call the method containing all the regexes for the player attack damages.
    addPlyrDmgStats(playerStats, pageContent);
    // Call the method containing all the regexes for the player attack experiences.
    addPlyrExpStats(playerStats, pageContent);
    // Call the method containing all the regexes for the player clan experiences.
    addPlyrClnExpStats(playerStats, pageContent);
    // Call the method containing all the regexes for the primary pet experience.
    addPlyrPrimaryPetStats(playerStats, pageContent);
    // Call the method containing all the regexes for the secondary pet experience.
    addPlyrSecPetStats(playerStats, pageContent);
}

function addPlyrAtkStats(playerStats, pageContent) {
    // Look for the number of attacks done with each skill from the fight.
    var rgxAtkNml = /Normal Attacks.*?<b>([^<]*)<\/b>/i;
    var rgxAtkDef = /Defense Attacks.*?<b>([^<]*)<\/b>/i;
    var rgxAtkStr = /Strength Attacks.*?<b>([^<]*)<\/b>/i;
    var rgxAtkCrt = /Criticals Attacks.*?<b>([^<]*)<\/b>/i;
    var rgxAtkAcn = /Arcane Attacks.*?<b>([^<]*)<\/b>/i;
    var rgxAtkAch = /Archery Attacks.*?<b>([^<]*)<\/b>/i;

    var result = rgxAtkNml.exec(pageContent);
    if (result != null) {
        // Found the number of normal attacks data. Pull the data out.
        var atkNml = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Normal Attacks: " + atkNml);
        }
        playerStats.atkNml = atkNml;
    }

    result = rgxAtkDef.exec(pageContent);
    if (result != null) {
        // Found the number of defense attacks data. Pull the data out.
        var atkDef = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Defense Attacks: " + atkDef);
        }
        playerStats.atkDef = atkDef;
    }

    result = rgxAtkStr.exec(pageContent);
    if (result != null) {
        // Found the number of strength attacks data. Pull the data out.
        var atkStr = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Strength Attacks: " + atkStr);
        }
        playerStats.atkStr = atkStr;
    }

    result = rgxAtkCrt.exec(pageContent);
    if (result != null) {
        // Found the number of critical attacks data. Pull the data out.
        var atkCrt = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Critical Attacks: " + atkCrt);
        }
        playerStats.atkCrt = atkCrt;
    }

    result = rgxAtkAcn.exec(pageContent);
    if (result != null) {
        // Found the number of critical attacks data. Pull the data out.
        var atkAcn = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Arcane Attacks: " + atkAcn);
        }
        playerStats.atkAcn = atkAcn;
    }

    result = rgxAtkAch.exec(pageContent);
    if (result != null) {
        // Found the number of critical attacks data. Pull the data out.
        var atkAch = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Archery Attacks: " + atkAch);
        }
        playerStats.atkAch = atkAch;
    }
}

function addPlyrDmgStats(playerStats, pageContent) {
    // Look for the amount of damage done with each skill from the fight.
    var rgxDmgNml = /Attacks Damage.*?<b>([^<]*)<\/b>/i;
    var rgxDmgDef = /Defended Damage.*?<b>([^<]*)<\/b>/i;
    var rgxDmgStr = /Strength Damage.*?<b>([^<]*)<\/b>/i;
    var rgxDmgCrt = /Critical Damage.*?<b>([^<]*)<\/b>/i;
    var rgxDmgAcn = /Arcane Damage.*?<b>([^<]*)<\/b>/i;
    var rgxDmgAch = /Archery Damage.*?<b>([^<]*)<\/b>/i;

    var result = rgxDmgNml.exec(pageContent);
    if (result != null) {
        // Found the Attack damage data. Pull the data out.
        var dmgNml = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Attack Damage: " + dmgNml);
        }
        playerStats.dmgNml = dmgNml;
    }

    result = rgxDmgDef.exec(pageContent);
    if (result != null) {
        // Found the Defense damage data. Pull the data out.
        var dmgDef = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Defense Damage: " + dmgDef);
        }
        playerStats.dmgDef = dmgDef;
    }

    result = rgxDmgStr.exec(pageContent);
    if (result != null) {
        // Found the Strength damage data. Pull the data out.
        var dmgStr = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Strength Damage: " + dmgStr);
        }
        playerStats.dmgStr = dmgStr;
    }

    result = rgxDmgCrt.exec(pageContent);
    if (result != null) {
        // Found the Critical damage data. Pull the data out.
        var dmgCrt = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Critical Damage: " + dmgCrt);
        }
        playerStats.dmgCrt = dmgCrt;
    }

    result = rgxDmgAcn.exec(pageContent);
    if (result != null) {
        // Found the Arcane damage data. Pull the data out.
        var dmgAcn = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Arcane Damage: " + dmgAcn);
        }
        playerStats.dmgAcn = dmgAcn;
    }

    result = rgxDmgAch.exec(pageContent);
    if (result != null) {
        // Found the Archery damage data. Pull the data out.
        var dmgAch = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Archery Damage: " + dmgAch);
        }
        playerStats.dmgAch = dmgAch;
    }
}

function addPlyrExpStats(playerStats, pageContent) {
    // Look for the experience gained from the fight.
    var rgxExpAtk = /Attack Experience.*?<b>([^<]*)<\/b>/i;
    var rgxExpDef = /Defense Experience.*?<b>([^<]*)<\/b>/i;
    var rgxExpStr = /Strength Experience.*?<b>([^<]*)<\/b>/i;
    var rgxExpCrt = /Critical Experience \(Att., Def., HP, Str.\).*?<b>([^<]*)<\/b>/i;
    var rgxExpAcn = /Arcane Experience.*?<b>([^<]*)<\/b>/i;
    var rgxExpAch = /Archery Experience.*?<b>([^<]*)<\/b>/i;
    var rgxExpHlt = /You've also earned .*?<b>([^<]*)<\/b>.*health experience from this fight!/i;

    var result = rgxExpAtk.exec(pageContent);
    if (result != null) {
        // Found the Attack experience data. Pull the data out.
        var expAtk = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Attack Experience: " + expAtk);
        }
        playerStats.expAtk = expAtk;
    }

    result = rgxExpDef.exec(pageContent);
    if (result != null) {
        // Found the Defense experience data. Pull the data out.
        var expDef = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Defense Experience: " + expDef);
        }
        playerStats.expDef = expDef;
    }

    result = rgxExpStr.exec(pageContent);
    if (result != null) {
        // Found the Strength experience data. Pull the data out.
        var expStr = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Strength Experience: " + expStr);
        }
        playerStats.expStr = expStr;
    }

    result = rgxExpCrt.exec(pageContent);
    if (result != null) {
        // Found the Critical experience data. Pull the data out.
        var expCrt = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Critical Experience: " + expCrt);
        }
        playerStats.expCrt = expCrt;
    }

    result = rgxExpAcn.exec(pageContent);
    if (result != null) {
        // Found the Arcane experience data. Pull the data out.
        var expAcn = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Arcane Experience: " + expAcn);
        }
        playerStats.expAcn = expAcn;
    }

    result = rgxExpAch.exec(pageContent);
    if (result != null) {
        // Found the Archery experience data. Pull the data out.
        var expAch = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Archery Experience: " + expAch);
        }
        playerStats.expAch = expAch;
    }

    result = rgxExpHlt.exec(pageContent);
    if (result != null) {
        // Found the Health experience data. Pull the data out.
        var expHlt = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Health Experience: " + expHlt);
        }
        playerStats.expHlt = expHlt;
    }
}

function addPlyrClnExpStats(playerStats, pageContent) {
    // Look for the clan experience gained from the fight.
    var rgxClnAtk = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*attack XP/;
    var rgxClnAch = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*archery XP/;
    var rgxClnAcn = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*arcane XP/;
    var rgxClnDef = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*defense XP/;
    var rgxClnHlt = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*health XP/;
    var rgxClnStr = /<b>Clans Stats \(Experience Gained\)<\/b>.*<b>([\d,]+)<\/b>\s*strength XP/;

    var result = rgxClnAtk.exec(pageContent);
    if (result != null) {
        // Found the clan attack experience data. Pull the data out.
        var clnAtk = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan attack XP: " + clnAtk);
        }
        playerStats.clnAtk = clnAtk;
    }

    result = rgxClnAch.exec(pageContent);
    if (result != null) {
        // Found the clan archery experience data. Pull the data out.
        var clnAch = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan archery XP: " + clnAch);
        }
        playerStats.clnAch = clnAch;
    }

    result = rgxClnAcn.exec(pageContent);
    if (result != null) {
        // Found the clan arcane experience data. Pull the data out.
        var clnAcn = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan arcane XP: " + clnAcn);
        }
        playerStats.clnAcn = clnAcn;
    }

    result = rgxClnDef.exec(pageContent);
    if (result != null) {
        // Found the clan defense experience data. Pull the data out.
        var clnDef = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan defense XP: " + clnDef);
        }
        playerStats.clnDef = clnDef;
    }

    result = rgxClnHlt.exec(pageContent);
    if (result != null) {
        // Found the clan health experience data. Pull the data out.
        var clnHlt = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan health XP: " + clnHlt);
        }
        playerStats.clnHlt = clnHlt;
    }

    result = rgxClnStr.exec(pageContent);
    if (result != null) {
        // Found the clan strength experience data. Pull the data out.
        var clnStr = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Clan strength XP: " + clnStr);
        }
        playerStats.clnStr = clnStr;
    }
}

function addPlyrPrimaryPetStats(playerStats, pageContent){
    // TODO: Expand this to support more than just the dragon.
    // Look for the primary pet stats.
    var rgxPrimaryPet = /gained your clan an extra <b>([\d,]+) XP<\/b> for every pool shown!/
    var result = rgxPrimaryPet.exec(pageContent);
    if (result != null) {
        // Found the dragon's extra experience given to the player's clan pool.
        var primaryPetType = "Dragon";
        if (logging) {
            console.log("dex.combat_assist    Primary pet type: " + primaryPetType);
        }
        playerStats.primaryPetType = primaryPetType;

        var primaryPetPlyrExp = result[1].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Player Exp from primary pet: " + primaryPetPlyrExp);
        }
        playerStats.primaryPetPlyrExp = primaryPetPlyrExp;

        // The dragon's experience gained for itself is on a different line. Grab that.
        rgxPrimaryPet = /has gained itself <b>([\d,]+) XP<\/b> as well!/
        result = rgxPrimaryPet.exec(pageContent);
        if (result != null) {
            // Found the dragon's extra experience given to the player's clan pool.
            var primaryPetExp = result[1].replace(/,/g, "");
            if (logging) {
                console.log("dex.combat_assist    Primary pet exp for itself: " + primaryPetExp);
            }
            playerStats.primaryPetExp = primaryPetExp;
        }
    } else {
        if (logging) {
            console.log("dex.combat_assist    No primary pet information found.");
        }
    }
}

function addPlyrSecPetStats(playerStats, pageContent){
    // Look for the secondary pet stats.
    // TODO: Confirm this still works for the snowman or phoenix. (It likely doesn't, now that pet names are displayed instead of the pet type, at the least.)
    var rgxSecPet = /Your <b>(.*)<\/b> has gained you <b>([\d,]+)<\/b> experience from this action, and <b>([\d,]+) XP<\/b> for itself!/
    var result = rgxSecPet.exec(pageContent);
    if (result != null) {
        // Found the secondary pet data. Pull the data out.
        var secPetType = result[1];
        if (logging) {
            console.log("dex.combat_assist    Secondary pet type: " + secPetType);
        }
        playerStats.secPetType = secPetType;

        var secPetPlyrExp = result[2].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Player Exp from secondary pet: " + secPetPlyrExp);
        }
        playerStats.secPetPlyrExp = secPetPlyrExp;

        var secPetExp = result[3].replace(/,/g, "");
        if (logging) {
            console.log("dex.combat_assist    Secondary pet exp for itself: " + secPetExp);
        }
        playerStats.secPetExp = secPetExp;
    } else {
        // Find the Naga's data.
        rgxSecPet = /healed you over <b>([\d,]+) times<\/b> for <b>([\d,]+) health<\/b>! <b>[^<]*<\/b> gained <b>([\d,]+) XP<\/b>!/
        result = rgxSecPet.exec(pageContent);
        if (result != null) {
            // Found the naga pet data. Pull the data out.
            var secPetType = "Naga";
            if (logging) {
                console.log("dex.combat_assist    Secondary pet type: " + secPetType);
            }
            playerStats.secPetType = secPetType;

            var secPetHealTimes = result[1];
            if (logging) {
                console.log("dex.combat_assist    Number of times naga healed: " + secPetHealTimes);
            }
            playerStats.secPetHealTimes = secPetHealTimes;

            var secPetHealAmnt = result[2];
            if (logging) {
                console.log("dex.combat_assist    Amount naga healed for: " + secPetHealAmnt);
            }
            playerStats.secPetHealAmnt = secPetHealAmnt;

            var secPetExp = result[3].replace(/,/g, "");
            if (logging) {
                console.log("dex.combat_assist    Secondary pet exp for itself: " + secPetExp);
            }
            playerStats.secPetExp = secPetExp;
        }
    }
}


function collectCmbtStats() {
    /*
    combatStats = [
        {
            "datetime" = <time of combat in server time (EST)>
            "monsterStats" = {
                "name" = <The name of the monster fought this combat.>
                "coins" = <number of coins dropped this combat>
                "midasBoost" = <true or false for if the Midas boost was active this combat>
                "rounds" = <number of rounds for the monster this combat>
                "ttlDmg" = <total amount of damage the monster dealt this combat>
            }
            "playerStats" = {
                "rounds" = <number of rounds for the player this combat>
                "ttlDmg" = <total amount of damage the player dealt this combat>
                "atkNml" = <number of normal attacks done by the player this combat>
                "atkDef" = <number of defense attacks done by the player this combat>
                "atkStr" = <number of strength attacks done by the player this combat>
                "atkCrt" = <number of critical attacks done by the player this combat>
                "atkAcn" = <number of arcane attacks done by the player this combat>
                "atkAch" = <number of archery attacks done by the player this combat>
                "dmgNml" = <amount of damage dealt by normal attacks done by the player this combat>
                "dmgDef" = <amount of damage defended by the player this combat>
                "dmgStr" = <amount of damage dealt by strength attacks done by the player this combat>
                "dmgCrt" = <amount of damage dealt by critical attacks done by the player this combat>
                "dmgAcn" = <amount of damage dealt by arcane attacks done by the player this combat>
                "dmgAch" = <amount of damage dealt by archery attacks done by the player this combat>
                "expAtk" = <amount of Attack Experience gained by the player this combat>
                "expDef" = <amount of Defense Experience gained by the player this combat>
                "expStr" = <amount of Strength Experience gained by the player this combat>
                "expCrt" = <amount of Critical Experience gained by the player this combat>
                "expAcn" = <amount of Arcane Experience gained by the player this combat>
                "expAch" = <amount of Archery Experience gained by the player this combat>
                "expHlt" = <amount of Health Experience gained by the player this combat>
                "clnAtk" = <amount of clan Attack Experience gained this combat>
                "clnAch" = <amount of clan Archery Experience gained this combat>
                "clnAcn" = <amount of clan Arcane Experience gained this combat>
                "clnDef" = <amount of clan Defense Experience gained this combat>
                "clnHlt" = <amount of clan Health Experience gained this combat>
                "clnStr" = <amount of clan Strength Experience gained this combat>
                "primaryPetType" = <type of primary pet active this combat>
                "primaryPetPlyrExp" = <amount of experience gained from primary pet this combat>
                "primaryPetExp" = <amount of experience gained by primary pet for itself this combat>
                "secPetType" = <type of secondary pet active this combat>
                "secPetPlyrExp" = <amount of experience gained from secondary pet this combat>
                "secPetHealTimes" = <number of times the naga healed the player over the course of the combat>
                "secPetHealAmnt" = <amount the naga healed the player for over the course of the combat>
                "secPetExp" = <amount of experience gained by secondary pet for itself this combat>
            }
        },
        ...
    ]
    */
    var combatStatsString = localStorage.getItem("combatStats");
    if (logging) {
        console.log("dex.combat_assist    Stringified combatStats from storage: " + combatStatsString);
    }
    
    var combatStats = [];
    if (combatStatsString == null) {
        // This is the first time running this or the stats have been cleared. (Re)create the monster stats object.
        console.log("dex.combat_assist    Created combatStats object.");
    } else {
        combatStats = JSON.parse(combatStatsString);
    }
    
    // Create the object to hold the data for this particular combat.
    var combatObj = {};
    // Get the current time in UTC (the previous ESR of Firefox doesn't support other timezone values).
    combatObj.datetime = new Date().toLocaleString('en-US', {timeZone: 'UTC'}).replace(',', '');
    // Add it to the stats array.
    combatStats.push(combatObj);
    if (logging) {
        console.log("dex.combat_assist    Started combat stats entry for datetime: " + combatObj.datetime);
    }
    
    // Create the object to hold the monster side of the stats.
    var monsterStats = {};
    combatObj.monsterStats = monsterStats;
    // Collect the monster stats. Start with the coin drop stat (this is also the most reliable way to get the monster name.
    addMnstrCoinStats(monsterStats);
    // Now add the monster rounds and total damage stats.
    addMnstrCombatStats(monsterStats);
    if (logging) {
        console.log("dex.combat_assist    Added monster stats to combat stats entry for datetime: " + combatObj.datetime);
    }
    
    // Create the object to hold the player side of the stats.
    var playerStats = {};
    combatObj.playerStats = playerStats;
    // Collect the player stats.
    addPlyrStats(playerStats);
    if (logging) {
        console.log("dex.combat_assist    Added player stats to combat stats entry for datetime: " + combatObj.datetime);
    }
    
    combatStatsString = JSON.stringify(combatStats);
    if (logging) {
        console.log("dex.combat_assist    Stringified combatStats: " + combatStatsString);
    }
    
    // When collecting and saving this much data, the storage is likely to fill up. Check for that.
    try {
        localStorage.combatStats = combatStatsString;
    } catch(e) {
        if (isQuotaExceeded(e)) {
            // Storage is full. At the least, don't error so the export and clean up buttons can still be displayed.
            console.log("dex.combat_assist    localStorage is full. No new stats are being saved.");
            
            // Add an error div at the top of the combat page, letting the user know they need to export and clear their data.
            $("#page2").prepend('<div id="dex_gos_storage_warning" class="alert-box warning"><span>WARNING:</span><br/>Local storage is full. No new stats can be collected. Please use the buttons at the bottom to export and clear the stats.</div>');
        }
    }
}


function CSVExport() {
    console.log("dex.combat_assist    Gathering data for export.");
    var combatStatsString = localStorage.getItem("combatStats");
    if (combatStatsString == null) {
        // No monster stats collected. Abort.
        alert("There are no monster stats to export.");
        return;
    } else {
        var combatStats = JSON.parse(combatStatsString);
        
        // Most of the time, people will be analyzing the stats on a per monster basis. As the CSV export is created, store the results grouped by monster.
        var monsterList = {};
        
        // Loop through the combat data, flattening it for the CSV export.
        for (var index in combatStats) {
            var combatObj = combatStats[index];
            
            var normalCoin = "";
            var boostCoin = "";
            if (combatObj.monsterStats.midasBoost) {
                boostCoin = combatObj.monsterStats.coins;
            } else {
                normalCoin = combatObj.monsterStats.coins;
            }
            
            // See if a grouping for the monster fought in this combat exists (and create the array for it if it doesn't).
            if (monsterList[combatObj.monsterStats.name] == null) {
                monsterList[combatObj.monsterStats.name] = [];
            }
            
            monsterList[combatObj.monsterStats.name].push([
                    combatObj.monsterStats.name, combatObj.datetime, normalCoin, boostCoin, combatObj.monsterStats.rounds, combatObj.monsterStats.ttlDmg,
                    combatObj.playerStats.rounds, combatObj.playerStats.ttlDmg,
                    combatObj.playerStats.atkNml, combatObj.playerStats.atkDef, combatObj.playerStats.atkStr, combatObj.playerStats.atkCrt, combatObj.playerStats.atkAcn, combatObj.playerStats.atkAch,
                    combatObj.playerStats.dmgNml, combatObj.playerStats.dmgDef, combatObj.playerStats.dmgStr, combatObj.playerStats.dmgCrt, combatObj.playerStats.dmgAcn, combatObj.playerStats.dmgAch,
                    combatObj.playerStats.expAtk, combatObj.playerStats.expDef, combatObj.playerStats.expStr, combatObj.playerStats.expCrt, combatObj.playerStats.expAcn, combatObj.playerStats.expAch, combatObj.playerStats.expHlt,
                    combatObj.playerStats.clnAtk, combatObj.playerStats.clnAch, combatObj.playerStats.clnAcn, combatObj.playerStats.clnDef, combatObj.playerStats.clnHlt, combatObj.playerStats.clnStr,
                    combatObj.playerStats.primaryPetType, combatObj.playerStats.primaryPetPlyrExp, combatObj.playerStats.primaryPetExp,
                    combatObj.playerStats.secPetType, combatObj.playerStats.secPetPlyrExp, combatObj.playerStats.secPetHealTimes, combatObj.playerStats.secPetHealAmnt, combatObj.playerStats.secPetExp
                ]);
        }
        
        var csvArray = [["Monster Name", "Combat Time (UTC)", "Normal Coin Drops", "Midas Coin Drops", "Monster Rounds", "Monster Damage Dealt (Total)",
                "Player rounds", "Player Damage Dealt (Total)",
                "Normal Attacks", "Defense Attacks", "Strength Attacks", "Critical Attacks", "Arcane Attacks", "Archery Attacks",
                "Attacks Damage", "Defended Damage", "Strength Damage", "Critical Damage", "Arcane Damage", "Archery Damage",
                "Attack Experience", "Defense Experience", "Strength Experience", "Critical Experience (Att., Def., HP, Str.)", "Arcane Experience", "Archery Experience", "Health Experience",
                "Clan Attack Experience", "Clan Archery Experience", "Clan Arcane Experience", "Clan Defense Experience", "Clan Health Experience", "Clan Strength Experience",
                "Primary Pet Type", "Experience from Primary Pet", "Experience Gained by Primary Pet",
                "Secondary Pet Type", "Experience from Secondary Pet", "Number of Times Healed by Secondary Pet", "Amount Healed by Secondary Pet", "Experience Gained by Secondary Pet"
            ]];
        
        // Combine the various list of combats per monster into one large list for the export.
        for (var monsterName in monsterList) {
            csvArray = csvArray.concat(monsterList[monsterName]);
        }
        console.log("dex.combat_assist    Data gathered.");
        
        var csvGenerator = new CsvGenerator(csvArray, 'Combat_Stats.csv', '', true);
        csvGenerator.download(true);
        console.log("dex.combat_assist    Exported.");
    }
}

// Courtesy of http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
function isQuotaExceeded(e) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}



function combatLogic() {
    highlightHlth();
    
    if (collectStats) {
        collectCmbtStats();
        
        $("#page2").append('<div id="dex_gos_combat_buttons" style="text-align:center"><span id="dex_gos_export_combat_stats" class="btn1" style="display: inline-block; width: 40%">Export Combat Stats</span><span id="dex_gos_spacer" style="display: inline-block; width: 15%"/><span id="dex_gos_clear_combat_stats" class="btn2">Clear Combat Stats</span></div>');
        $("#dex_gos_export_combat_stats").click(CSVExport);
        
        $("#dex_gos_clear_combat_stats").click(function() {
            console.log("dex.combat_assist    Clearing all combat stats.");
            localStorage.removeItem("combatStats");
            alert("Stats cleared.");
        });
    }
}

callbackIfPageMatched(/^fight.php/i, combatLogic);





// This CSV creation library came from https://github.com/AlexLibs/client-side-csv-generator
// It is inlined here because GreasyFork wouldn't let me upload my script with the reference to this site/library.
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || ',';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }

    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var rowData = row.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        var type = 'data:text/csv;charset=utf-8';
        var data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    };

    this.getLinkElement = function (linkText) {
        var downloadLink = this.getDownloadLink();
        var fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            var a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    };

    // call with removeAfterDownload = true if you want the link to be removed after downloading
    this.download = function (removeAfterDownload) {
        var linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    };
}
