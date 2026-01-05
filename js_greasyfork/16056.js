// ==UserScript==
// @name         GT Bot Functions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Croned
// @match        https://epicmafia.com/report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16056/GT%20Bot%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/16056/GT%20Bot%20Functions.meta.js
// ==/UserScript==

/*
*
* DATA COLLECTION
*
*/
savedData = {"{\"cop\":1,\"gunsmith\":1,\"hooker\":1,\"mafia\":1,\"villager\":3}":{"yes":[{"role":"villager","claim":{"role":"cop","amt":5},"allRoles":{"GrimReap":"mafia","LeonKennedy":"villager","GayAndProud":"villager","twitter01":"gunsmith","Lunker":"hooker","SilverCop":"cop","FeeIsGoodMan":"villager"},"actions":[{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"SilverCop","state":2,"isMeteor":false,"targetRole":"cop"},{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"Lunker","state":2,"isMeteor":false,"targetRole":"hooker"},{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"GrimReap","state":4,"isMeteor":false,"targetRole":"mafia"}],"win":false}],"no":[{"role":"villager","claim":{"role":"none","amt":1},"allRoles":{"lolidesu":"hooker","Messere":"villager","qeSuited":"villager","Tonyrave":"villager","Azheartbreaker":"gunsmith","Chuchu0":"cop","Diezal":"mafia"},"actions":[{"user":"Tonyrave","meet":"village","unpoint":false,"target":"lolidesu","state":2,"isMeteor":false,"targetRole":"hooker"},{"user":"Tonyrave","meet":"village","unpoint":false,"target":"Messere","state":4,"isMeteor":false,"targetRole":"villager"}],"win":false}]}};

role_data = {"villager":"village","mafia":"mafia","doctor":"village","nurse":"village","surgeon":"village","bodyguard":"village","cop":"village","insane":"village","confused":"village","paranoid":"village","naive":"village","lazy":"village","watcher":"village","tracker":"village","detective":"village","snoop":"village","journalist":"village","mortician":"village","pathologist":"village","vigil":"village","sheriff":"village","deputy":"village","drunk":"village","sleepwalker":"village","civilian":"village","miller":"village","suspect":"village","leader":"village","bulletproof":"village","bleeder":"village","bomb":"village","granny":"village","hunter":"village","crier":"village","invisible":"village","governor":"village","telepath":"village","agent":"village","celebrity":"village","loudmouth":"village","mason":"village","templar":"village","shrink":"village","samurai":"village","jailer":"village","chef":"village","turncoat":"village","enchantress":"village","priest":"village","trapper":"village","baker":"village","ghoul":"village","party":"village","penguin":"village","judge":"village","gallis":"village","treestump":"village","secretary":"village","virgin":"village","blacksmith":"village","oracle":"village","psychic":"village","dreamer":"village","angel":"third","lightkeeper":"village","keymaker":"village","gunsmith":"village","tinkerer":"village","mimic":"village","santa":"village","caroler":"village","siren":"third","monk":"third","cultist":"third","cthulhu":"third","zombie":"third","fool":"third","lover":"third","cupid":"third","lyncher":"third","killer":"third","clockmaker":"third","survivor":"third","warlock":"third","mistletoe":"third","prophet":"third","alien":"third","werewolf":"third","amnesiac":"third","anarchist":"third","creepygirl":"third","traitor":"third","admirer":"third","maid":"third","autocrat":"third","politician":"third","silencer":"mafia","blinder":"mafia","sniper":"mafia","illusionist":"mafia","saboteur":"mafia","yakuza":"mafia","consigliere":"mafia","godfather":"mafia","framer":"mafia","hooker":"mafia","disguiser":"mafia","actress":"mafia","tailor":"mafia","informant":"mafia","strongman":"mafia","janitor":"mafia","don":"mafia","interrogator":"mafia","whisperer":"mafia","spy":"mafia","lawyer":"mafia","forger":"mafia","stalker":"mafia","enforcer":"mafia","quack":"mafia","poisoner":"mafia","driver":"mafia","toreador":"mafia","gramps":"mafia","interceptor":"mafia","fiddler":"mafia","witch":"mafia","ventriloquist":"mafia","voodoo":"mafia","thief":"mafia","paralyzer":"mafia","paparazzi":"mafia","scout":"mafia","associate":"mafia","fabricator":"mafia","lookout":"mafia","ninja":"mafia","hitman":"mafia","arsonist":"mafia","terrorist":"mafia","mastermind":"third"};

roleData = null;
gameData = null;
allRoles = null;
actionList = null;
isGT = "yes";

isRanked = function(data) {
	for (var x in data) {
		if (data[x][0] == "msg" && data[x][1].msg == "This game was ranked") {
			return true;
		}
	}
	return false;
};

noSpeech = function(data) {
	var newD = [];
	var tempD = [];
	
	for (var obj in data) {
		if (data.hasOwnProperty(obj)) {
			tempD.push(data[obj]);
		}
	}
	
	for (var i in tempD) {
		if (tempD[i][0] == "<") {
			delete tempD[i];
		}
	}
	
	for (var j in tempD) {
		newD.push(tempD[j]);
	}
	
	return newD;
};

getRoles = function(data, user) {
	var users = {};
	var roles = {};
	var userRole;
	var allUserRoles = {};
	
	for (var k in data) {
		if (data[k][0] == "reveal" && !users[data[k][1].user]) {
			if (roles[data[k][1].data]) {
				roles[data[k][1].data] ++;
			}
			else {
				roles[data[k][1].data] = 1;
			}
			
			allUserRoles[data[k][1].user] = data[k][1].data;
			
			if (user == data[k][1].user) {
				userRole = data[k][1].data;
			}
			
			users[data[k][1].user] = true;
		}
	}
	
	var rolesCopy = {};
	var keys = Object.keys(roles).sort();
	
	for (var x in keys) {
		rolesCopy[keys[x]] = roles[keys[x]];
	}
	
	return {
		roles: rolesCopy,
		user: userRole,
		all: allUserRoles
	};
};

getClaims = function(user, data) {
	var info = {};
	var claims = [];
	//ADD MORE ROLES LATER
	var strings = ["cop", "pr", "doc", "doctor", "lightkeeper", "lk", "gs", "gunsmith", "orc", "oracle", "blue", "villager"];
	var lText;
	for (var x in data) {
		if (data[x][1].user == user && data[x][0] == "<") {
			info = {};
			info.text = data[x][1].msg;
			lText = info.text.toLowerCase();
			
			if (info.text.indexOf("?") >= 0) {
				info.isQ = true;
			}
			
			info.tSplit = info.text.split(" ");
			
			if ( strings.indexOf(info.tSplit[0]) >= 0 && info.tSplit.length == 1 && !info.isQ)  {
				claims.push(info.text);
				//console.log("1:" + info.text);
			}
			else if ( (lText.indexOf("guilty") >= 0 || lText.indexOf("town")) >= 0 && !info.isQ && lText.indexOf("im") < 0 && lText.indexOf("i'm") < 0 && lText.indexOf("read") < 0) {
				claims.push("cop");
				//console.log("2:" + info.text);
			}
			else if (info.tSplit.length <= 3) {
				for (var st in strings) {
					if ( ( (lText.indexOf(strings[st]) >= 0 && info.tSplit.length == 2 && (lText.indexOf("im") >= 0 || lText.indexOf("i'm") >= 0) ) || (info.tSplit.length == 3 && lText.indexOf(strings[st]) >= 0 && lText.indexOf("i am") >= 0) ) && !info.isQ ) {
						claims.push(strings[st]);
						//console.log("3:" + info.text);
					}
				}
				
				if ( (lText.indexOf("is gunned") >= 0 || lText.indexOf("i gunned") >= 0) && !info.isQ) {
					claims.push("gunsmith");
					//console.log("4:" + info.text);
				}
				else if (lText.indexOf("i saved") >= 0 &&!info.isQ) {
					claims.push("doctor");
					//console.log("5:" + info.text);
				}
			}
		}
	}
	
	if (claims.length == 0) {
		claims.push("none");
	}
	return claims;
};

evalClaims = function(claims) {
	for (var x in claims) {
		switch (claims[x]) {
			case "cop":
				break;
			
			case "pr":
				break;
			
			case "doc":
			
			case "doctor":
				claims[x] = "doctor";
				break;
			
			case "lk":
			
			case "lightkeeper":
				claims[x] = "lightkeeper";
				break;
			
			case "gs":
			
			case "gunsmith":
				claims[x] = "gunsmith";
				break;
			
			case "orc":
			
			case "oracle":
				claims[x] = "oracle";
				break;
			
			case "blue":
			
			case "villager":
				claims[x] = "villager";
				break;
			default:
				claims[x] = "none";
		}
	}
	
	var count = {};
	
	for (var x in claims) {
		if (count[claims[x]]) {
			count[claims[x]] ++;
		}
		else {
			count[claims[x]] = 1;
		}
	}
	
	var max = {};
	
	for (var role in count) {
		if (max.role) {
			if (count[role] >= max.amt) {
				max.role = role;
				max.amt = count[role];
			}
		}
		else {
			max.role = role;
			max.amt = count[role];
		}
	};
	
	return max;
};

actions = function(data, user, roles) {
	var actionData = [];
	
	for (var x in data) {
		if (data[x][1].user == user && data[x][0] == "point") {
			for (var i = x, on = true; on; i--) {
				if (data[i][0] == "round") {
					on = false;
					data[x][1].state = data[i][1].state;
				}
				else if (i <= 0) {
					on = false;
					data[x][1].state = null;
				}
			}
			
			if (data[x][1].meet == "gun") {
				var numSpeech = 0;
				for (var i = x, on = true; on; i--) {
					if (data[i][0] == "<") {
						numSpeech++;
					}
					else if (data[i][0] == "round") {
						if (data[i][1].state <= 2) {
							on = false
						}
					}
					else if (i <= 0) {
						on = false;
					}
				}
				data[x][1].numSpeech = numSpeech;
			}
			
			for (var i = x, on = true; on; i--) {
				if (data[i][0] == "msg" && data[i][1].msg.toLowerCase().indexOf("meteor") >= 0 ) {
					data[x][1].isMeteor = true;
					on = false;
				}
				else if (i <= 0) {
					on = false;
					data[x][1].isMeteor = false;
				}
			}
			
			data[x][1].targetRole = roles[data[x][1].target];
			actionData.push(data[x][1]);
		}
	}
	
	return actionData;
};

findWin = function(data, role) {
	var isWin = false;
	role = role.toLowerCase();
	for (var x in data) {
		if (data[x][0] == "msg" && data[x][1] == "Mafia wins!") {
			if (role_data[role] == "mafia") {
				isWin = true;
			}
			else {
				isWin = false;
			}
		}
		else if (data[x][0] == "msg" && data[x][1] == "Village wins!") {
			if (role_data[role] == "village" || role == "fool" || role == "lyncher") {
				isWin = true;
			}
			else {
				isWin = false;
			}
		}
		else if (data[x][0] == "msg" && data[x][1].msg.indexOf(" wins!") >= 0) {
			if (data[x][1].msg.toLowerCase().indexOf(role) >= 0) {
				isWin = true;
			}
			else if (!isWin) {
				isWin = false;
			}
		}
	}
	
	return isWin;
}

compileData = function(setup, gt, role, claim, allRoles, actions, win) {
    if (!savedData[setup]) {
        savedData[setup] = {
            yes: [],
            no: []
        };
    }
    
	savedData[setup][gt].push({
		role: role,
		claim: claim,
		allRoles: allRoles,
		actions: actions,
		win: win
	});
	
	console.log(savedData);
};

/*
*
* COMPARISON
*
*/

input = {"{\"cop\":1,\"gunsmith\":1,\"hooker\":1,\"mafia\":1,\"villager\":3}":{"role":"villager","claim":{"role":"cop","amt":5},"allRoles":{"GrimReap":"mafia","LeonKennedy":"villager","GayAndProud":"villager","twitter01":"gunsmith","Lunker":"hooker","SilverCop":"cop","FeeIsGoodMan":"villager"},"actions":[{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"SilverCop","state":2,"isMeteor":false,"targetRole":"cop"},{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"Lunker","state":2,"isMeteor":false,"targetRole":"hooker"},{"user":"FeeIsGoodMan","meet":"village","unpoint":false,"target":"GrimReap","state":4,"isMeteor":false,"targetRole":"mafia"}],"win":false}};
setup = Object.keys(input)[0];
input = input["{\"cop\":1,\"gunsmith\":1,\"hooker\":1,\"mafia\":1,\"villager\":3}"];

findMatches = function(setup, role) {
	var possibles = savedData[setup];
	var matches = {
		"yes": [],
		"no": []
	};
	
	for (var i in possibles) {
		if (possibles.hasOwnProperty(i)) {
			for (var x in possibles[i]) {
				if (possibles[i][x].role == role) {
					matches[i].push(possibles[i][x]);
				}
			}
		}
	}
	
	return matches;
}

calcSimilars = function(matches, input) {
	var similars = [];
	var game;
	for (var g in matches) {
		game = matches[g];
		console.log(game);
		var aSim = [];
		var cSim = 0;
		var high;
		var sim;
		
		//Actions
		//POSSIBLE FOR FUTURE:
		//Remove unovtes and their associated votes
		for (var ia in input.actions) {
			high = 0;
			for (var a in game.actions) {
				sim = 0;
				if (input.actions[ia].meet == game.actions[a].meet) {
					sim += 50;
					
					if (input.actions[ia].isMeteor == game.actions[a].isMeteor) {
						sim += 20;
					}
					else {
						sim -= 20;
					}
					
					if (input.actions[ia].targetRole == game.actions[a].targetRole) {
						sim += 15;
					}
					else {
						sim -= 15;
					}
					
					if (role_data[input.actions[ia].targetRole] == role_data[game.actions[a].targetRole]) {
						sim += 15;
					}
					else {
						sim -= 15;
					}
					
					if (input.actions[ia].state == game.actions[a].state) {
						sim += 10;
					}
				}
				
				if (sim > high) {
					high = sim;
				}
			}
			
			aSim.push(high);
		}
		
		var simTotal = 0;
		for (var s in aSim) {
			simTotal += aSim[s];
		}
		
		aSim = simTotal / aSim.length;
		
		//Claim/role
		
		//cop claims villager, cop claims villager
		//cop claims cop, cop claims cop
		if (game.claim.role == input.claim.role) {
			cSim = 100;
		}
		//cop claims mafia-sided, cop claims mafia-sided
		else if (role_data[game.claim.role] == role_data[input.claim.role]) {
			cSim = 80;
		}
		//cop claims villager, cop claims hooker
		else if (game.claim.role != game.role && input.claim.role != input.role) {
			cSim = 70;
		}
		//cop claims cop, cop claims hooker
		else {
			cSim = 50;
		}
		
		sim = (aSim + cSim) / 2;
		similars.push(sim);
		
	}
	
	var simTotal = 0;
	for (var s in similars) {
		simTotal += similars[s];
	}
	similars = simTotal / similars.length;
	return similars;
}