// ==UserScript==
// @namespace   dex.gos
// @name        Gates of Survival - Gathering Data Scraper
// @description Auto-scrapes data about gathering values as you visit the skill pages and actually start gathering items.
// @include     https://www.gatesofsurvival.com/game/index.php?page=main
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/39920/Gates%20of%20Survival%20-%20Gathering%20Data%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/39920/Gates%20of%20Survival%20-%20Gathering%20Data%20Scraper.meta.js
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



//var logging = false;
var logging = true;
var loggerName = "dex.gathering_scraper    ";

if (typeof(Storage) !== "undefined") {
    // Local storage is allowed.
    console.log(loggerName + "Local storage available; gathering stats will be collected.");
} else {
    console.log(loggerName + "Local storage not available; gathering stats can not be collected so the script is exiting.");
    return;
}








function skillScrape(skillName) {
    addButtons();

    /*
    gatheringStats = {
        <skillName> = {
            <itmName> = {
                "itmLvl" = <The level required of the skill to be able to train and gather the item.>
                "gthrLvl" = <Player's gathering level.>
                "lvlScale" = <The ratio of the player's level to the item's level.>
                "baseGthrTime" = <The base amount of time required to gather one of the item if you were level 1 in gathering.>
                "actlGthrTime" = <The amount of time it actually requires to gather one of the item at the player's current gathering level.>
                "timePrct" = <The fraction of time it actually takes to gather the item, as compared to the base gather time.>
                "itmsPerHour" = <The amount of items the game says you will gather per hour. This does appear to be rounded, which makes the data a little less accurate.>
                "xpPerItm" = <The amount of experience a player gets for gathering one of this item.>
                "xpPerHour" = <The amount of experience a player will get in an hour, based on the itmsPerHour and xpPerItm.>
            }
            ...
        }
        ...
    }
    */
    var gatheringStats = loadStatsObject();
    var skill = getOrCreateSkill(gatheringStats, skillName);
    
    var updated = false;
    // Look for the information blocks. (It's the table row that has a child table data cell (the second one at that) that in turn has a div with an id of form2.)
    $("tr:has(td > div#form2)").each(function(index) {
        var itmUpdated = false;
        // Get the two table cells.
        var cells = $(this).children("td");
        
        // The first cell contains the item name.
        var nameCellString = cells.eq(0).html();
        var itmName = findItemName(skillName, nameCellString);
        if (itmName === "") {
            // Guess the item name wasn't found, skip this loop.
            console.log(loggerName + "Could not find the item name for one of the form2 rows. nameCellString: " + nameCellString);
            return;
        }
        
        var item = getOrCreateItem(skill, itmName);
        
        // The second cell contains the gathering information.
        var dataCellString = cells.eq(1).html();
        var rgxLvl = /<b>Level Required<\/b>:([^<]+)</i;
        var result = rgxLvl.exec(dataCellString);
        if (result != null) {
            // Found the item level.
            var tempLvl = parseInt(trim(result[1].replace(/,/g, "")), 10);
            // Only update the stats if something has changed and the new data looks good.
            if (tempLvl > 0 && tempLvl != item.itmLvl) {
                item.itmLvl = tempLvl;
                updated = true;
                itmUpdated = true;
            }
        }
        
        var rgxTime = /<b>Base Gathering Time<\/b>: ([^\s]+) seconds/i;
        result = rgxTime.exec(dataCellString);
        if (result != null) {
            // Found the base gather time.
            var tempTime = parseInt(result[1].replace(/,/g, ""), 10);
            // Only update the stats if something has changed and the new data looks good.
            if (tempTime > 0 && tempTime != item.baseGthrTime) {
                item.baseGthrTime = tempTime;
                updated = true;
                itmUpdated = true;
            }
        }
        
        // If the gathering page was visited first, the other data that is needed to do the calculations already exists. Do that now, but only if some new data
        // was found for this item.
        if (itmUpdated) {
            calculateStats(item);
        }
    });
    
    if (updated) {
        storeStatsObject(gatheringStats);
    }
}

function findItemName(skillName, nameCellString) {
    var itmName = "";
    
    // Try the many regular expressions that could turn up a name for this skill.
    if (skillName == "baking" || skillName == "botany") {
        var rgxName = /value="(Create|[MB]ake) ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            // Found the item name.
            itmName = result[2];
        } else {
            // If the player can't craft the item, it is in a strikethrough tag instead of the value of a button. Look for that too.
            rgxName = /<s>(Create|[MB]ake) ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                // Found the item name.
                itmName = result[2];
            } else {
                // No other known string identifiers for the name. The name could not be found.
                return "";
            }
        }
    } else if (skillName == "cooking") {
        var rgxName = /value="Cook ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Cook ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "crafting") {
        var rgxName = /value="Craft ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Craft ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "firemaking") {
        var rgxName = /value="Burn ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Burn ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "fishing") {
        var rgxName = /value="Catch ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Catch ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "fletching") {
        var rgxName = /value="(Carve|Fletch|Create) ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[2];
        } else {
            rgxName = /<s>(Carve|Fletch|Create) ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[2];
            } else {
                return "";
            }
        }
    } else if (skillName == "forestry") {
        var rgxName = /value="Chop ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Chop ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "jewelcrafting") {
        var rgxName = /value="Chisel ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Chisel ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "mining") {
        var rgxName = /value="Mine ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Mine ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "runebinding") {
        var rgxName = /value="Bind ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Bind ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "smelting") {
        var rgxName = /value="Smelt ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Smelt ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "spellcraft") {
        var rgxName = /value="Create ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Create ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    } else if (skillName == "woodworking") {
        var rgxName = /value="Whittle ([^"]+)"/i;
        var result = rgxName.exec(nameCellString);
        
        if (result != null) {
            itmName = result[1];
        } else {
            rgxName = /<s>Whittle ([^<]+)<\/s>/i;
            result = rgxName.exec(nameCellString);
            
            if (result != null) {
                itmName = result[1];
            } else {
                return "";
            }
        }
    }
    
    // Before returning the name, normalize it. Many item names on the skill screen do not match the actual item name you will get because
    // of verb usage. Translate the items to their actual item name so they match up with those from gathering.
    return normalizeItemName(skillName, itmName);
}

function normalizeItemName(skillName, itmName) {
    if (skillName == "baking") {
        // Can't just add "Baked" to the front of everything because "Bacon" doesn't follow this pattern (and becuase of the non-meat items).
        if (itmName == "Beef") {
            return "Baked Beef";
        } else if (itmName == "Chicken") {
            return "Baked Chicken";
        } else if (itmName == "Pork") {
            return "Baked Pork";
        }
    } else if (skillName == "cooking") {
        return "Cooked " + itmName;
    } else if (skillName == "crafting") {
        if (itmName == "Bucket") {
            return "Clay Bucket";
        }
    } else if (skillName == "firemaking") {
        itmName = itmName.replace(/Log/, "Ashes");
    } else if (skillName == "forestry") {
        itmName = itmName.replace(/Tree/, "Logs");
    } else if (skillName == "mining") {
        if (itmName == "Coal Lumps") {
            return "Coal";
        } else {
            itmName = itmName.replace(/ Ore/, "");
        }
    } else if (skillName == "woodworking") {
        itmName = itmName + "s";
    }
    
    return itmName;
}

function gatheringScrape() {
    addButtons();
    
    /*
    gatheringStats = {
        <skillName> = {
            <itmName> = {
                "itmLvl" = <The level required of the skill to be able to train and gather the item.>
                "gthrLvl" = <Player's gathering level.>
                "lvlScale" = <The ratio of the player's level to the item's level.>
                "baseGthrTime" = <The base amount of time required to gather one of the item if you were level 1 in gathering.>
                "actlGthrTime" = <The amount of time it actually requires to gather one of the item at the player's current gathering level.>
                "timePrct" = <The fraction of time it actually takes to gather the item, as compared to the base gather time.>
                "itmsPerHour" = <The amount of items the game says you will gather per hour. This does appear to be rounded, which makes the data a little less accurate.>
                "xpPerItm" = <The amount of experience a player gets for gathering one of this item.>
                "xpPerHour" = <The amount of experience a player will get in an hour, based on the itmsPerHour and xpPerItm.>
            }
            ...
        }
        ...
    }
    */
    var gatheringStats = loadStatsObject();
    
    // Get the html that contains the gathering level (it contains the other information too, but that will be grabbed later when a more specific html element is fetched).
    var startElmnt = $("div#page>center").eq(0);
    var infoString = startElmnt.html();
    var rgxLvl = /<b>Gathering Level<\/b>: ([\d,]+)/i;
    var result = rgxLvl.exec(infoString);
    
    var gthrLvl = 0;
    if (result != null) {
        // Found the gathering level.
        gthrLvl = parseInt(result[1].replace(/,/g, ""), 10);
    }
    
    // Get the "center" element's html that contains all of the information text.
    infoString = startElmnt.children("center").eq(1).html();
    var updated = false;
    var itmName = "";
    var xpPerItm = 0;
    var skillName = "";
    var actlGthrTime = 0;
    var itmsPerHour = 0;
    
    // There are two possible displays on the same gathering page. If this is visited because the job was just started, then the data is displayed one way (with an explicit
    // value for experience per item). If this is visited because the player is checking up on their existing gathering job, then the same data is dislayed differently (though
    // without an explicit value of experience per item; that will have to be calculated based on the amount of items gathered and the total experience earned, which will not
    // work until at least one item has been gathered, which can be a problem for some items).
    
    // First look for the descriptive text when a gathering job was started.
    var rgxData = /You will now gather <b>([^<]+)<\/b> and earn <b>([\d,]+) ([^\s]+) &amp; gathering experience<\/b> every <b>([\d,]+) seconds<\/b> \(<b>([\d,]+) [^<]+? per hour<\/b>/i;
    result = rgxData.exec(infoString);
    if (result != null) {
        // Results found. This page must have been loaded because a gathering job was just started.
        itmName = result[1];
        xpPerItm = parseInt(result[2].replace(/,/g, ""), 10);
        skillName = result[3];
        actlGthrTime = parseInt(result[4].replace(/,/g, ""), 10);
        itmsPerHour = parseInt(result[5].replace(/,/g, ""), 10);
    } else {
        // This page may have been loaded because an existing job is being checked on. Try that set of regular expressions instead.
        rgxData = /You have currently collected <b>[\d,]+ ([^<]+)<\/b> and <b>[\d,]+ ([^\s]+) &amp; gathering experience/i;
        result = rgxData.exec(infoString);
        
        if (result != null) {
            // Found the item name and skill name.
            itmName = result[1];
            skillName = result[2];
        }
        
        rgxData = /<br> You will continue to collect <b>[^<]+<\/b> every <b>([\d,]+) seconds<\/b> \(<b>([\d,]+) [^<]+? per hour/i;
        result = rgxData.exec(infoString);
        if (result != null) {
            // Found the actual gather time and the items per hour.
            actlGthrTime = parseInt(result[1].replace(/,/g, ""), 10);
            itmsPerHour = parseInt(result[2].replace(/,/g, ""), 10);
        }
        
        // The experience per item isn't readily available on this screen (yet?). There is a way to calculate it, but suffers from the problems noted in the big comment above.
        // Instead, that logic will be left out for now in the hopes that the developer adds it in soon-ish.
    }

    if (skillName === "" || itmName === "") {
        // Maybe this is the page displayed after collecting a job. If that's the case, try to find the skill name and add a "return" button.
        rgxData = /You have successfully collected <b>[^<]+<\/b> and <b>[\d,]+ ([^\s]+) &amp; gathering experience<\/b>/i;
        result = rgxData.exec(infoString);
        
        if (result != null) {
            // Found the skill name still.
            skillName = result[1];
            
            // Add a "Return to <skill>" button for convenience.
            var section = startElmnt.children("center").eq(1);
            section.append('<div id="dex_gos_skill_return_button_section" style="text-align:center"><span id="dex_gos_skill_return_button" class="btn3" style="display: inline-block; width: 40%">Return to ' + skillName + ' skill</span></div><br />');
            $("#dex_gos_skill_return_button").click(function() { gotoSkill(skillName); });
            
            if (logging) {
                console.log(loggerName + "Found the skill name on the collection page. Added return button.");
            }
        } else {
            // Guess the skill name or the item name wasn't found, stop trying to gather stats.
            console.log(loggerName + "Could not find the skill name or item name for the gathering collection. infoString: " + infoString);
        }
        
        return;
    }
    
    var skill = getOrCreateSkill(gatheringStats, skillName);
    var item = getOrCreateItem(skill, itmName);
    
    // Now that we have the item object, set the data that was stored earlier.
    if (gthrLvl > 0 && gthrLvl != item.gthrLvl) {
        item.gthrLvl = gthrLvl;
        updated = true;
    }
    if (xpPerItm > 0 && xpPerItm != item.xpPerItm) {
        item.xpPerItm = xpPerItm;
        updated = true;
    }
    if (actlGthrTime > 0 && actlGthrTime != item.actlGthrTime) {
        item.actlGthrTime = actlGthrTime;
        updated = true;
    }
    if (itmsPerHour > 0 && itmsPerHour != item.itmsPerHour) {
        item.itmsPerHour = itmsPerHour;
        updated = true;
    }
    
    // If the skill page was visited first, the other data that is needed to do the calculations already exists. Do that now, but only if some new data
    // was found for this item.
    if (updated) {
        calculateStats(item);
        storeStatsObject(gatheringStats);
    }
}

function addButtons() {
    $("#page").append('<div id="dex_gos_gathering_buttons" style="text-align:center"><span id="dex_gos_export_gathering_stats" class="btn1" style="display: inline-block; width: 40%">Export Gathering Stats</span><span id="dex_gos_spacer_2" style="display: inline-block; width: 15%"/><span id="dex_gos_clear_gathering_stats" class="btn2">Clear Gathering Stats</span></div>');
    $("#dex_gos_export_gathering_stats").click(CSVExport);
    
    $("#dex_gos_clear_gathering_stats").click(function() {
        console.log(loggerName + "Clearing all gathering stats.");
        localStorage.removeItem("gatheringStats");
        alert("Stats cleared.");
    });
}

function loadStatsObject() {
    var gatheringStatsString = localStorage.getItem("gatheringStats");
    if (logging) {
        console.log(loggerName + "Stringified gatheringStats from storage: " + gatheringStatsString);
    }
    
    var gatheringStats = {};
    if (gatheringStatsString == null) {
        // This is the first time running this or the stats have been cleared. (Re)create the gathering stats object.
        console.log(loggerName + "Created gatheringStats object.");
    } else {
        gatheringStats = JSON.parse(gatheringStatsString);
    }
    
    return gatheringStats;
}

function getOrCreateSkill(gatheringStats, skillName) {
    var skill = gatheringStats[skillName];
    if (skill == null) {
        // This is the first time gathering stats for this skill. Create the skill object.
        skill = {};
        gatheringStats[skillName] = skill;
        console.log(loggerName + "Created skill object for skill: " + skillName);
    }
    
    return skill;
}

function getOrCreateItem(skill, itmName) {
    var item = skill[itmName];
    if (item == null) {
        // This is the first time gathering stats for this item. Create the item object.
        item = {};
        skill[itmName] = item;
        console.log(loggerName + "Created item object for item: " + itmName);
    }
    
    return item;
}

function calculateStats(item) {
    if (item.itmLvl > 0 && item.gthrLvl > 0) {
        item.lvlScale = item.gthrLvl / item.itmLvl;
    }
    
    if (item.baseGthrTime > 0 && item.actlGthrTime > 0) {
        item.timePrct = item.actlGthrTime / item.baseGthrTime;
    }
    
    if (item.itmsPerHour > 0 && item.xpPerItm > 0) {
        item.xpPerHour = item.itmsPerHour * item.xpPerItm;
    }
}

function storeStatsObject(gatheringStats) {
    var gatheringStatsString = JSON.stringify(gatheringStats);
    if (logging) {
        console.log(loggerName + "Stringified gatheringStats: " + gatheringStatsString);
    }
    
    // When collecting and saving this much data, the storage is likely to fill up. Check for that.
    try {
        localStorage.gatheringStats = gatheringStatsString;
    } catch(e) {
        if (isQuotaExceeded(e)) {
            // Storage is full. At the least, don't error so the export and clean up buttons can still be displayed.
            console.log(loggerName + "localStorage is full. No new stats are being saved.");
            
            // Add an error div at the top of the skill page, letting the user know they need to export and clear their data.
            $("#page").prepend('<div id="dex_gos_storage_warning" class="alert-box warning"><span>WARNING:</span><br/>Local storage is full. No new stats can be collected. Please use the buttons at the bottom to export and clear the stats.</div>');
        }
    }
}

function CSVExport() {
    console.log(loggerName + "Gathering data for export.");
    var gatheringStatsString = localStorage.getItem("gatheringStats");
    if (gatheringStatsString == null) {
        // No gathering stats collected. Abort.
        alert("There are no gathering stats to export.");
        return;
    } else {
        var gatheringStats = JSON.parse(gatheringStatsString);
        
        var csvArray = [["Skill", "Item", "Item Level", "Player Gathering Level", "Level Scale", "Base Gather Time", "Actual Gather Time", "Time Percent",
                "Items Per Hour", "Experience Per Item", "Experience Per Hour"]];
        
        for (var skillName in gatheringStats) {
            var items = gatheringStats[skillName];
            for (var itemName in items) {
                var item = items[itemName];
                csvArray.push([skillName, itemName, item.itmLvl, item.gthrLvl, item.lvlScale, item.baseGthrTime, item.actlGthrTime, item.timePrct,
                        item.itmsPerHour, item.xpPerItm, item.xpPerHour]);
            }
        }
        console.log(loggerName + "Data gathered.");
        
        var csvGenerator = new CsvGenerator(csvArray, 'Gathering_Stats.csv', '', true);
        csvGenerator.download(true);
        console.log(loggerName + "Exported.");
    }
}

function gotoSkill(skillName) {
    if (skillName === "firemaking") {
        document.navigate("forest2");
    } else if (skillName === "forestry") {
        document.navigate("forest");
    } else if (skillName === "smelting") {
        document.navigate("anvil2");
    } else {
        document.navigate(skillName);
    }
}



callbackIfPageMatched(/^gathering.php/i, gatheringScrape);
callbackIfPageMatched(/^skills.php\?skill=baking/i, function() { skillScrape("baking"); });
callbackIfPageMatched(/^skills.php\?skill=botany/i, function() { skillScrape("botany"); });
callbackIfPageMatched(/^skills.php\?skill=cooking/i, function() { skillScrape("cooking"); });
callbackIfPageMatched(/^skills.php\?skill=crafting/i, function() { skillScrape("crafting"); });
callbackIfPageMatched(/^skills.php\?skill=firemaking/i, function() { skillScrape("firemaking"); });
callbackIfPageMatched(/^skills.php\?skill=fishing/i, function() { skillScrape("fishing"); });
callbackIfPageMatched(/^skills.php\?skill=fletching/i, function() { skillScrape("fletching"); });
callbackIfPageMatched(/^skills.php\?skill=forestry/i, function() { skillScrape("forestry"); });
callbackIfPageMatched(/^skills.php\?skill=jewelcrafting/i, function() { skillScrape("jewelcrafting"); });
callbackIfPageMatched(/^skills.php\?skill=mining/i, function() { skillScrape("mining"); });
callbackIfPageMatched(/^skills.php\?skill=runebinding/i, function() { skillScrape("runebinding"); });
callbackIfPageMatched(/^skills.php\?skill=smelting/i, function() { skillScrape("smelting"); });
callbackIfPageMatched(/^skills.php\?skill=spellcraft/i, function() { skillScrape("spellcraft"); });
callbackIfPageMatched(/^skills.php\?skill=woodworking/i, function() { skillScrape("woodworking"); });





//Thanks to: http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(str) {
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
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
