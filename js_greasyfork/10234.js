// ==UserScript==
// @name         Kitten Extrapolation
// @namespace    https://greasyfork.org/en/scripts/10234-kitten-extrapolation
// @version      0.7.7
// @description  A script for outputting information about kitten survival (Other features may come later)
// @author       Lily
// @match        http://bloodrizer.ru/games/kittens/*
// @match        https://bloodrizer.ru/games/kittens/*
// @exclude      http://bloodrizer.ru/games/kittens/wiki*
// @exclude      https://bloodrizer.ru/games/kittens/wiki*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10234/Kitten%20Extrapolation.user.js
// @updateURL https://update.greasyfork.org/scripts/10234/Kitten%20Extrapolation.meta.js
// ==/UserScript==

var KE_seasons = {
    "Spring": 1.5,
    "Summer": 1,
    "Autumn": 1,
    "Winter": 0.25
};

var KE_weathers = {
    "Warm": 0.15,
    "Norm": 0.0,
    "Cold": -0.15
};

var KE_seasons_reverse_Lookup = {
    0 : "Spring",
    1 : "Summer",
    2 : "Autumn",
    3 : "Winter"
};

function KE_calcTitaniumChance()
{
    if(0.35*gamePage.resPool.get("ship").value+15>100){
        return 100;
    }else{
        return 0.35*gamePage.resPool.get("ship").value+15;
    }
}

var KE_seasonal_trading = {
    "Lizards" : {
        "wood" : {
            "Spring": "<font color=red>↓↓</font>",
            "Summer": "<font color=limegreen>↑↑</font>",
            "Autumn": "<font color=limegreen>↑</font>",
            "Winter": "<font color=red>↓</font>",
            "Best": "Summer",
            "Chance": 100
        }
    },
    "Sharks" : {
        "catnip" : {
            "Spring": "<font color=limegreen>↑</font>",
            "Summer": "<font color=red>↓↓</font>",
            "Autumn": "<font color=red>↓</font>",
            "Winter": "<font color=limegreen>↑↑</font>",
            "Best": "Winter",
            "Chance": 100
        }
    },
    "Griffins" : {
        "iron" : {
            "Spring": "<font color=red>↓↓</font>",
            "Summer": "<font color=limegreen>↑</font>",
            "Autumn": "<font color=limegreen>↑↑</font>",
            "Winter": "<font color=red>↓</font>",
            "Best": "Autumn",
            "Chance": 100
        }
    },
    "Nagas" : {
        "minerals" : {
            "Spring": "<font color=limegreen>↑↑</font>",
            "Summer": "<font color=limegreen>↑</font>",
            "Autumn": "<font color=red>↓↓</font>",
            "Winter": "<font color=red>↓</font>",
            "Best": "Spring",
            "Chance": 100
        }
    },
    "Zebras" : {
        "iron" : {
            "Spring": "<font color=limegreen>↑</font>",
            "Summer": "<font color=limegreen>↑↑</font>",
            "Autumn": "<font color=red>↓</font>",
            "Winter": "<font color=red>↓↓</font>",
            "Best": "Summer",
            "Chance": 100
        },
        "plate" : {
            "Spring": "<font color=yellow>=</font>",
            "Summer": "<font color=red>↓↓</font>",
            "Autumn": "<font color=yellow>=</font>",
            "Winter": "<font color=limegreen>↑↑</font>",
            "Best": "Winter",
            "Chance": 65
        },
        "titanium" : {
            "Chance": KE_calcTitaniumChance
        }
    },
    "Spiders" : {
        "coal" : {
            "Spring": "<font color=red>↓</font>",
            "Summer": "<font color=limegreen>↑</font>",
            "Autumn": "<font color=limegreen>↑↑</font>",
            "Winter": "<font color=red>↓↓</font>",
            "Best": "Autumn",
            "Chance": 100
        }
    },
    "Dragons" : {
        "uranium" : {
//            "Spring": "<font color=red>↓</font>",
//            "Summer": "<font color=limegreen>↑</font>",
//            "Autumn": "<font color=limegreen>↑↑</font>",
//            "Winter": "<font color=red>↓↓</font>",
//            "Best": "Autumn",
            "Chance": 95
        }
    },
    "Leviathans" : {
        "time crystal" : {
            "Chance": 98
        },
        "sorrow" : {
            "Chance": 15
        },
        "starchart" : {
            "Chance": 50
        },
        "relic" : {
            "Chance": 5
        }
    }
};

function KE_generate_food_table_cell(tag="", contents = "", colspan = 1){
    var cell = document.createElement("td");
    if(tag != ""){
        cell.setAttribute("id",tag);
    }
    cell.style.textAlign="text-align:center";
    cell.append(contents)
    if(colspan != 1){
        cell.setAttribute("colspan","4")
    }
    return cell;
}

function KE_generate_food_table_line(line_name, line_tag) {
    var line = document.createElement("tr");
    var cell = document.createElement("td");
    cell.style.textAlign="text-align:center";
    cell.append(line_name);
    line.append(cell);
    line.append(KE_generate_food_table_cell(line_tag+'Sp'));
    line.append(KE_generate_food_table_cell(line_tag+'Su'));
    line.append(KE_generate_food_table_cell(line_tag+'A'));
    line.append(KE_generate_food_table_cell(line_tag+'W'));
    return line;
}

function KE_generate_food_table() {
    //Creating the enclosing div for the table
    var enclosing_div = document.createElement("div");
    enclosing_div.setAttribute("width","340px");
    //Making the table itself
    var table = document.createElement("table");
    table.setAttribute("id","food_table_season");
    table.setAttribute("table-layout","fixed");
    //create/define the columns in the tables
    var column = document.createElement("col");
    column.setAttribute("width",60);
    table.append(column);
    for (var i = 0; i < 4; i++) {
        var column2 = document.createElement("col");
        column2.setAttribute("width",70);
        table.append(column2);
    }
    //create the top line of the table
    var topline = document.createElement("tr");
    topline.append(KE_generate_food_table_cell("cycle_warning"));
    topline.append(KE_generate_food_table_cell("","Food during seasons (/season)",4));
    table.append(topline);
    //Create second line of table
    var line2 = document.createElement("tr");
    line2.append(KE_generate_food_table_cell("","Weather"));
    line2.append(KE_generate_food_table_cell("KE_Spring","Spring"));
    line2.append(KE_generate_food_table_cell("KE_Summer","Summer"));
    line2.append(KE_generate_food_table_cell("KE_Autumn","Autumn"));
    line2.append(KE_generate_food_table_cell("KE_Winter","Winter"));
    table.append(line2);
    //Create the table's main cells/liens
    table.append(KE_generate_food_table_line('Warm', 'WS'));
    table.append(KE_generate_food_table_line('Norm', 'NS'));
    table.append(KE_generate_food_table_line('Cold', 'CS'));
    //append the table to the enclosing div
    enclosing_div.append(table);
    //Yearly food production calculation
    var yearly_food_produced = document.createElement("p");
    yearly_food_produced.setAttribute("id","yearly_food_produced");
    yearly_food_produced.style.marginBlockStart="2px";
    yearly_food_produced.style.marginBlockEnd="2px";
    enclosing_div.append(yearly_food_produced);
    return enclosing_div;
}

//Calculates the reasource production for a season other then the current one.
function KE_calcResourcePerTick_NCW(resName, season, weather)
{
    if(resName == "catnip"){
        //Get data for the current weather
        var realWeatherMod = gamePage.calendar.getWeatherMod();
        //invert it
        var realWeatherModInverse = 0-realWeatherMod;
        //get the effective season+weather
        var mockSeasonWeatherMod = KE_seasons[season]+KE_weathers[weather];
        //Apply the inveser of the real weather to it to counter that it is going to be applied in the function
        mockSeasonWeatherMod = mockSeasonWeatherMod + realWeatherModInverse;
        return (gamePage.calcResourcePerTick(resName,{"modifiers" : {"catnip" : mockSeasonWeatherMod}})+gamePage.getResourcePerTickConvertion(resName));
    } else{
        return gamePage.calcResourcePerTick(resName)+gamePage.getResourcePerTickConvertion(resName);
    }
}

function KE_update_food_table_cell(lable, season, weather)
{
    var element_to_update = document.getElementById(lable);
    //Clear labeled element
    element_to_update.innerHTML = ""
    var updated_text = document.createElement("font");
    //Bold the current season/weather combo
    if(season == KE_seasons_reverse_Lookup[gamePage.calendar.season] && ((weather=="Norm" && gamePage.calendar.weather == null) || weather.toLowerCase() == gamePage.calendar.weather)){
        updated_text.setAttribute("class","msg type_date");
        updated_text.style.fontWeight = "bold";
        updated_text.style.borderBottomWidth = "0px";
        updated_text.style.fontSize = "14px";
    }
    //Get updated value
    updated_text.append(gamePage.getDisplayValueExt(KE_calcResourcePerTick_NCW("catnip",season,weather)*1000,true));
    //Close out font
    element_to_update.append(updated_text);
    return true;
}

function KE_update_trade_screen()
{

    ///////////////////////////////////////////////////
    //Adding trade calculations, purely experimental //
    ///////////////////////////////////////////////////
    //Panel container is the class of all trade containers
    var trade_containers = document.getElementsByClassName("panelContainer")
    //Cycle through all trade containers
    for (var i = 0; i < trade_containers.length; i++) {
        //for every container
        if(typeof(trade_containers[i]) === 'object' && trade_containers[i].getElementsByClassName("title").length > 0)
        {
            try
            {
                var trade_partner = trade_containers[i].getElementsByClassName("title")[0].childNodes[0].nodeValue.trim()
                //////////////////////////////////////
                //Chance of success/bonus for trades//
                //////////////////////////////////////
                for (var j = 0; j<gamePage.diplomacy.races.length; j++){
                    if(gamePage.diplomacy.races[j]["title"] == trade_partner){
                        if(gamePage.diplomacy.races[j]["attitude"] != "neutral")
                        {
                            var standingRatio = gamePage.getEffect("standingRatio");
                            standingRatio = standingRatio ? standingRatio : 0;

                            if (gamePage.prestige.getPerk("diplomacy").researched){
                                standingRatio += 10;
                            }

                            if(gamePage.diplomacy.races[j]["attitude"] == "friendly")
                            {
                                standingRatio = standingRatio/2;
                            }

                            standingRatio += gamePage.diplomacy.races[j]["standing"]*100
                            if (standingRatio > 100){
                                standingRatio = 100;
                            }

                            var append_string = "";

                            if(gamePage.diplomacy.races[j]["attitude"] == "friendly")
                            {
                                append_string = "(+"+gamePage.getDisplayValueExt(standingRatio)+"%)";
                            }

                            if(gamePage.diplomacy.races[j]["attitude"] == "hostile")
                            {
                                append_string = "(-"+gamePage.getDisplayValueExt(100-standingRatio)+"%)";
                            }

                            //Add standing info to the trade window.
                            if(trade_containers[i].getElementsByClassName("title")[0].getElementsByClassName("attitude")[0].getElementsByClassName("trade-seasonal-appeal").length == 0){
                                //If the block does not exist yet
                                var appendnode = document.createElement("span");
                                appendnode.setAttribute("class", "trade-seasonal-appeal");
                                trade_containers[i].getElementsByClassName("title")[0].getElementsByClassName("attitude")[0].appendChild(appendnode);
                            }

                            trade_containers[i].getElementsByClassName("title")[0].getElementsByClassName("attitude")[0].getElementsByClassName("trade-seasonal-appeal")[0].innerHTML = append_string;
                        }

                        break;
                    }
                }

                //////////////////////////////////////////////
                //Colored arrows for race season prefrences.//
                //Should probobly be redone using the game's//
                //internal code                             //
                //////////////////////////////////////////////
                //Check if the trade partner is in seasonal_trading
                if(Object.keys(KE_seasonal_trading).indexOf(trade_partner) != -1){
                    //get the list of all reasources for trade
                    var reasource_containers = trade_containers[i].getElementsByClassName("trade-race")[0].getElementsByClassName("left")[0].children
                    //cycle through them
                    for (var j = 0; j < reasource_containers.length; j++) {
                        //if this is a 'sell' type container (as opposed to the 'buy' containers)
                        if(reasource_containers[j].getElementsByClassName("sells").length > 0)
                        {
                            //find out if this is a reasource that the race being looked at has a variable deal on based on seasons
                            var trade_reasource = reasource_containers[j].childNodes[1].nodeValue.trim();
                            if(Object.keys(KE_seasonal_trading[trade_partner]).indexOf(trade_reasource) != -1)
                            {
                                //Add the addjustment appearence to it.
                                if(reasource_containers[j].getElementsByClassName("trade-seasonal").length == 0){
                                    //If the block does not exist yet
                                    var appendnode = document.createElement("span");
                                    appendnode.setAttribute("class", "trade-seasonal");
                                    reasource_containers[j].appendChild(appendnode);
                                }
                                var append_string = "";
                                if(KE_seasonal_trading[trade_partner][trade_reasource]["Chance"]!=100){
                                    var string_add = document.createElement("span")
                                    if(typeof(KE_seasonal_trading[trade_partner][trade_reasource]["Chance"]) != 'function'){
                                        string_add.innerHTML = gamePage.getDisplayValueExt(KE_seasonal_trading[trade_partner][trade_reasource]["Chance"]) + "%";
                                    }else{
                                        string_add.innerHTML = gamePage.getDisplayValueExt(KE_seasonal_trading[trade_partner][trade_reasource]["Chance"]()) + "%";
                                    }
                                    string_add.setAttribute("class", "ammount");
                                    append_string += string_add.outerHTML;
                                }
                                if(KE_seasonal_trading[trade_partner][trade_reasource][KE_seasons_reverse_Lookup[gamePage.calendar.season]])
                                {
                                    append_string += KE_seasonal_trading[trade_partner][trade_reasource][KE_seasons_reverse_Lookup[gamePage.calendar.season]];
                                    if(KE_seasons_reverse_Lookup[gamePage.calendar.season] != KE_seasonal_trading[trade_partner][trade_reasource]["Best"]){
                                        append_string += " (+" + KE_seasonal_trading[trade_partner][trade_reasource]["Best"] + ")";
                                    }
                                }
                                reasource_containers[j].getElementsByClassName("trade-seasonal")[0].innerHTML = append_string;
                            }
                        }
                    }
                }
            }
            catch(err) {
                console.error("Error in adding trade container. ",err.message);
            }
        }else{
            console.log(typeof(trade_containers[i]), trade_containers[i]);
        }


    }
}

function KE_update(){
    //Update all the food cells
    KE_update_food_table_cell("WSSp", "Spring", "Warm");
    KE_update_food_table_cell("WSSu", "Summer", "Warm");
    KE_update_food_table_cell("WSA", "Autumn", "Warm");
    KE_update_food_table_cell("WSW", "Winter", "Warm");
    KE_update_food_table_cell("NSSp", "Spring", "Norm");
    KE_update_food_table_cell("NSSu", "Summer", "Norm");
    KE_update_food_table_cell("NSA", "Autumn", "Norm");
    KE_update_food_table_cell("NSW", "Winter", "Norm");
    KE_update_food_table_cell("CSSp", "Spring", "Cold");
    KE_update_food_table_cell("CSSu", "Summer", "Cold");
    KE_update_food_table_cell("CSA", "Autumn", "Cold");
    KE_update_food_table_cell("CSW", "Winter", "Cold");

    //Yearly production
    document.getElementById('yearly_food_produced').innerHTML = "Yearly food balance (avg): " + gamePage.getDisplayValueExt((KE_calcResourcePerTick_NCW("catnip", "Spring", "Norm")*1000) + (KE_calcResourcePerTick_NCW("catnip", "Summer", "Norm")*1000) + (KE_calcResourcePerTick_NCW("catnip", "Autumn", "Norm")*1000) + (KE_calcResourcePerTick_NCW("catnip", "Winter", "Norm")*1000), true);

    var cycle = gamePage.calendar.cycles[gamePage.calendar.cycle];
    var element_to_update;
    element_to_update = document.getElementById("cycle_warning");
    if(cycle["name"]=="piscine"){
        element_to_update.innerHTML = '<font color="red">↑Piscine</font>'
    }else{
        element_to_update.innerHTML = ""
    }

    //

    //Trading
    KE_update_trade_screen();

    //console.log(trade_reasource, Object.keys(seasonal_trading[trade_partner]).indexOf(trade_reasource));

    return true;
}

function KE_initiate_script() {
    var data_out = document.createElement('div');
    data_out.id = 'kitten_extrapolation_container';
    data_out.style.width = '100%';
    data_out.style.bottom = '0px';
    data_out.style.verticalAlign = 'bottom';
    data_out.innerHTML = "";
    data_out.append(KE_generate_food_table());
    var right_col = document.getElementById('rightColumn')
    right_col.style.width = '360px';
    var before_child = document.getElementsByClassName("right-tab-header")[0];
    right_col.insertBefore(data_out, before_child);
    setInterval(KE_update, 500);
    return true;
}

function KE_initiate() {
    if (typeof gamePage == "object") {
        if (!document.getElementById('kitten_extrapolation_container')) {
            KE_initiate_script();
        }
    } else if(typeof gamePage == "undefined") {
        setTimeout(function(){
            KE_initiate();
        }, 100);
    }else{
        window.alert("Error E1 occured in Kitten Extrapolation! \nThis is most likely to occure if the game's code has been radically changed and Kitten Extrapolation needs updating or if the script is run on something other then the Kittens game.");
    }
}

KE_initiate();

//Function for trimming strings.
//Credit: David Andres (https://stackoverflow.com/questions/1418050/string-strip-for-javascript)
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
