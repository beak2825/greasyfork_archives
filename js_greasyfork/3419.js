// ==UserScript==
// @name        Holy War
// @namespace   https://greasyfork.org/users/3633-michael-frake
// @description Skips (clicks "New Opponent") those with characteristics lower/higher than a set amount of haul, attack, victory/loss ratio, defense, level, etc. - works great for those without premium who still want to find players with desirable attributes. Also automatically plunders, works, and attacks (optional) to get gold while you sleep. Simply change the min/max values to your desired specifications and let it roll!
// @include     *holy-war.net/busy*
// @include     *holy-war.net/auth*
// @include	*holy-war.net/assault*
// @include 	*holy-war.net/town/farm*
// @include  	*holy-war.net/char*
// @include 	*holy-war.net/town/alchemist*
// @include 	*holy-war.net/welcome*
// @include     *holy-war.de/busy*
// @include     *holy-war.de/auth*
// @include	*holy-war.de/assault*
// @include 	*holy-war.de/town/farm*
// @include  	*holy-war.de/char*
// @include 	*holy-war.de/town/alchemist*
// @include 	*holy-war.de/welcome*
// @version     2.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3419/Holy%20War.user.js
// @updateURL https://update.greasyfork.org/scripts/3419/Holy%20War.meta.js
// ==/UserScript==

//------------- customization options
var de = false; 		//set this to true if you use the .de version of the website
var world = "1EN";  		//YOU MUST CHANGE THIS TO YOUR WORLD.
var auto_plunder = true; 	//plunder automatically for 60 minutes.
var auto_attack = true;  	//automatically attacks if opponent fits stat standards [CAUTION: USES GOLD].
var use_totals = true;  	//if this is in effect, attacking only considers the opponent's summed stats versus your summed basic stats, not including horse, equipment, or house.
var auto_work = true;  		//work only after plunder time = 0. good at night.
var auto_train = true;  	//trains only the character's lowest stats and buys potions with the remaining gold automatically after plundering [NOT THE HORSE - CAUTION: USES GOLD].
var auto_login = true; 		//only works if you have username and password defined below.

var my_stats = [ 		//if you are using auto_attack, YOU MUST CHANGE THESE TO YOUR STATS in order to fight effectively.
				//Alternatively, set these to the maximum values you accept for an opponent's stats.
strength_max = 69,
attack_max = 69,
agility_max = 69,
stamina_max = 69,
defence_max = 69
];

var attack_thresholds = [ 	//if you are not using use_totals, update these thresholds to your preferences.
level_min = 28,
haul_min = 150,  		//do they ever play? if not, probably no gold.
ratio_min = 0.2  		//if they lose constantly, they probably have no gold.
];

var username = "";		//obviously update with your own info, then never share the code directly!
var password = "";

/*
NOTE: Beware of contradictions. If you have auto attack on, the script is designed to ignore
auto work and vice versa (you can't attack/work at the same time).
*/

var stat_names = [
level_str = 'Level',
haul_str = 'Gold haul',
strength_str = 'Strength',
attack_str = 'Attack',
agility_str = 'Agility',
stamina_str = 'Stamina',
defence_str = 'Defence',
ratio_str = 'Victories/defeats'
];
//-------------


//------------- initialization/functions
var i;
var j;
var my_total; //stat total
var time_left = document.getElementsByName("ravageTime")[0];

for (j = 0; j<my_stats.length; j++) { //initializes my_total
	my_total += my_stats[j];
}

function redir(url) { //always pass the .net version into these redirect functions, it will fix it if the "de" var is true
    if (de == false) {
        window.location.href = url + world;
    }
    else {
        window.location.href = url.replace("net", "de") + world;
    }
}

function delRedir(url, time) { //delays a redirect by the time in milliseconds
    if (de == false) {
        window.setTimeout('window.location.href="' + url + '"' + world + ';', time);
    }
    else {
        window.setTimeout('window.location.href="' + url.replace("net", "de") + '"' + world + ';', time);
    }
}

var additive = '</td><td style = "width:40%; text-align:left;">'; //comes after each stat
function getStat(string) {
    string += additive;
    var opp_stat = document.body.innerHTML.substring(document.body.innerHTML.indexOf(string)+string.length-2, document.body.innerHTML.indexOf(string)+string.length+8);
	opp_stat = Number(opp_stat.replace(/[^0-9.]/g, ""))
    if (opp_stat != null) {
        return opp_stat;
    }
    else {
        window.alert("error in finding stat " + stat_names[i]);
        return false;
    }
}

function check(string, type, limit) { //returns true if you can't defeat the opponent or the opponent is too weak.
	var opp_stat = getStat(string);
	if (opp_stat != false) { //do not rephrase logic here - it's only false or a stat, never true
		if (limit == "max") {
			if (opp_stat > type) {
				return true;
			}
		}
		else {
			if (opp_stat < type) {
				return true;
			}
			else {
                                return false;
			}
		}
	}
	return true;
}
//-------------


//------------- logic
if (document.body.innerHTML.indexOf("Gold plundered: ") != -1 || document.body.innerHTML.indexOf("Summarised fight report") != -1) {
	redir("http://holy-war.net/assault/1on1/"); //reset and plunder again if finished
}

if (time_left && auto_plunder == true && document.getElementsByName("PLUNDER_ACTION")[0] && time_left.options[0].value == "10") {
	document.getElementsByName("PLUNDER_ACTION")[0].click(); //click plunder if time is greater than 0
}

if (time_left && auto_plunder == false && auto_work == false && auto_attack == true) {
	document.getElementsByName("Search")[0].click(); //attacks if auto_attack = true
}

if (time_left != null && time_left.options[0].value != "10" && auto_work == true && auto_attack == false) {
	redir("http://holy-war.net/char/attributes/");
}

if (window.location.href.indexOf("town/farm") != -1 && document.body.getElementsByTagName("select")[0] && auto_work == true) {
	document.body.getElementsByTagName("select")[0].value = "8" //8 hours for auto work after plunder
	document.body.getElementsByTagName("button")[0].click();
}

if (window.location.href.indexOf("char/") != -1 && auto_train == true) {
	var widths = [];
	var stat_names_stats = [
		'Strength',
		'Attack',
        'Defence',
		'Agility',
		'Stamina'
	];
    var string;
	for (i = 0; i < stat_names_stats.length; i++) {
		string = stat_names_stats[i];
		var my_stat = document.body.innerHTML.substring(document.body.innerHTML.indexOf(string, 9000)+446, document.body.innerHTML.indexOf(string, 9000)+452);
		my_stat = Number(my_stat.replace(/[^0-9.]/g, ""));
		widths[i] = my_stat;
	}
	var min_stat = Math.min.apply(Math, widths);
	var stat_num;
        for (var k = 0; k<widths.length; k++) {
		    if (widths[k] == min_stat) {
			  stat_num = k;
              k = widths.length;
              break;
		    }
		}
	var buttons = document.getElementsByTagName("button");
	var clickables = [];
	for (j = 0; j<buttons.length; j++) {
		if (buttons[j].name == "Train") {
			clickables[j]= buttons[j];
		}
	}
	if (clickables.length == 8) {
		clickables[stat_num].click();
	}
	else if (clickables[0] && clickables.length > 3) {
		clickables[0].click();
	}
	if (auto_work == true) {
		delRedir("http://holy-war.net/town/alchemist/?w = ", 2000);
	}
}

if (window.location.href.indexOf("alchemist/") != -1 && auto_train == true) {
	var potions = document.getElementsByName("No alternative text available");
	var buyables = [];
		for (i = 0; i<potions.length; i++) {
			if (potions[i].innerHTML.indexOf("btn_kaufen") != -1) { //buy button image
				buyables[i] = potions[i];
			}
		}
	if (buyables[buyables.length-1]) {
		buyables[buyables.length-1].click();
	}
	else {
		if (auto_work == true) {
			delRedir("http://holy-war.net/town/farm/?w = ", 2000);
		}
	}
}

if (window.location.href.indexOf("welcome") != -1 && auto_plunder == true) { //redirect if at home screen to auto-plunder
    redir("http://holy-war.net/assault/1on1/?w=");
}

if (window.location.href.indexOf("auth") != -1 && auto_login == true) { //auto login if on the login page
    document.getElementsByName("username")[0].value = username;
    document.getElementsByName("password")[0].value = password;
    document.getElementsByName("world")[0].value = world;
    document.getElementsByClassName("submit_image")[0].click();
}

var opp_total = 0; //opponent's summed stats
if (window.location.href.indexOf("assault/1on1/search") != -1) { //total opponent's stats and decide to attack if an opponent was searched
    for (i = 2; i <= 6; i++) { //2-6 of stat_names are the only stats we care about for this calculation
        if (getStat(stat_names[i]) != false) {
            opp_total += getStat(stat_names[i]);
        }
        else {
            use_totals = false; //only doing this because of the error
        }
    }
	//should we attack?
    if (auto_attack == true) {
        var defeatable = true;
        j = 0; //separate counter for my_stats
        for (i = 0; i < stat_names.length; i++) { //0, 1, 7 are all the mins (level, ratio, haul)
            //if check returns true, then you can't defeat the opponent or the opponent is too weak.
            if (use_totals == false) {
                if (i == 0 || i == 1 || i == 7) { //attack_thresholds
                    window.alert(stat_names[i] + " comparing to " + attack_thresholds[j]);
                    if (check(stat_names[i], attack_thresholds[j], "min") == true) {
                        defeatable = false;
                    }
                    j++; //correct counter to compare to attack_thresholds appropriately
                }
                else {
                    if (check(stat_names[i], my_stats[i - 2], "max") == true) { //must compare to my_stats - 2 because of the combined nature of stat_names
                        defeatable = false;
                    }
                }
            }
            else { //using totals instead
                if (opp_total > my_total) {
                    window.alert("Opponent's total is " + opp_total + ", which is greater than my total of " + my_total);
                    defeatable = false;
                }
            }
        }
        if (defeatable == true && document.getElementsByName("Attack")[0]) {
		document.getElementsByName("Attack")[0].click(); //attack if defeatable
	}
	if (defeatable != true && document.getElementsByName("Attack")[0]) {
                document.getElementsByTagName("button")[0].click(); //new opponent
        }
    }

}
//-------------