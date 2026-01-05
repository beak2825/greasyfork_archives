// ==UserScript==
// @name         ScumReader
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.1
// @description  Scum reads players based on their past games
// @author       Croned
// @match        https://epicmafia.com/game/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13803/ScumReader.user.js
// @updateURL https://update.greasyfork.org/scripts/13803/ScumReader.meta.js
// ==/UserScript==

var scope = $("body").scope();
var stats = {
	mafia: {
		words: {},
		qs: 0,
		wordsTotal: 0,
		sentTotal: 0,
		avgTime: 0,
		quotes: 0
	},
	village: {
		words: {},
		qs: 0,
		wordsTotal: 0,
		sentTotal: 0,
		avgTime: 0,
		quotes: 0
	},
	game: {
		words: {},
		qs: 0,
		wordsTotal: 0,
		sentTotal: 0,
		avgTime: 0,
		quotes: 0
	}
};
var calcs = {};
var amt;
var steps;
var role_data = {"villager":"village","mafia":"mafia","doctor":"village","nurse":"village","surgeon":"village","bodyguard":"village","cop":"village","insane":"village","confused":"village","paranoid":"village","naive":"village","lazy":"village","watcher":"village","tracker":"village","detective":"village","snoop":"village","journalist":"village","mortician":"village","pathologist":"village","vigil":"village","sheriff":"village","deputy":"village","drunk":"village","sleepwalker":"village","civilian":"village","miller":"village","suspect":"village","leader":"village","bulletproof":"village","bleeder":"village","bomb":"village","granny":"village","hunter":"village","crier":"village","invisible":"village","governor":"village","telepath":"village","agent":"village","celebrity":"village","loudmouth":"village","mason":"village","templar":"village","shrink":"village","samurai":"village","jailer":"village","chef":"village","turncoat":"village","enchantress":"village","priest":"village","trapper":"village","baker":"village","ghoul":"village","party":"village","penguin":"village","judge":"village","gallis":"village","treestump":"village","secretary":"village","virgin":"village","blacksmith":"village","oracle":"village","psychic":"village","dreamer":"village","angel":"third","lightkeeper":"village","keymaker":"village","gunsmith":"village","tinkerer":"village","mimic":"village","santa":"village","caroler":"village","siren":"third","monk":"third","cultist":"third","cthulhu":"third","zombie":"third","fool":"third","lover":"third","cupid":"third","lyncher":"third","killer":"third","clockmaker":"third","survivor":"third","warlock":"third","mistletoe":"third","prophet":"third","alien":"third","werewolf":"third","amnesiac":"third","anarchist":"third","creepygirl":"third","traitor":"third","admirer":"third","maid":"third","autocrat":"third","politician":"third","silencer":"mafia","blinder":"mafia","sniper":"mafia","illusionist":"mafia","saboteur":"mafia","yakuza":"mafia","consigliere":"mafia","godfather":"mafia","framer":"mafia","hooker":"mafia","disguiser":"mafia","actress":"mafia","tailor":"mafia","informant":"mafia","strongman":"mafia","janitor":"mafia","don":"mafia","interrogator":"mafia","whisperer":"mafia","spy":"mafia","lawyer":"mafia","forger":"mafia","stalker":"mafia","enforcer":"mafia","quack":"mafia","poisoner":"mafia","driver":"mafia","toreador":"mafia","gramps":"mafia","interceptor":"mafia","fiddler":"mafia","witch":"mafia","ventriloquist":"mafia","voodoo":"mafia","thief":"mafia","paralyzer":"mafia","paparazzi":"mafia","scout":"mafia","associate":"mafia","fabricator":"mafia","lookout":"mafia","ninja":"mafia","hitman":"mafia","arsonist":"mafia","terrorist":"mafia","mastermind":"third"};
unsafeWindow.read = read;
unsafeWindow.recordGame = recordGame;
unsafeWindow.stats = stats;
unsafeWindow.calcs = calcs;

var hover = false;
setTimeout(function(){
	$(".username").hover(function() {
		hover = $(this).text();
	}, function() {
		hover = false;
	});
}, 1500);

$("body").bind("keypress", function(e) {
	if (e.which == 114 && hover) {
		console.log(hover);
		read(hover);
	}
});

$(".scrlink").click(function() {
	$(".username").hover(function() {
		hover = $(this).text();
	}, function() {
		hover = false;
	});
});

function g(url, cb) {
	GM_xmlhttpRequest({
		url: url,
		method: "GET",
		onload: function(res) {
			cb(res.response, res.status);
		}
	});
}

function read(name) {
	stats = { mafia: { words: {}, qs: 0, wordsTotal: 0, sentTotal: 0, avgTime: 0, quotes: 0 }, village: { words: {}, qs: 0, wordsTotal: 0, sentTotal: 0, avgTime: 0, quotes: 0 }, game: { words: {}, qs: 0, wordsTotal: 0, sentTotal: 0, avgTime: 0, quotes: 0 } };
	recordGame(name);
	var userId = scope.users[name].id;
	g("/user/" + userId, function(res) {
		var div = $("<div></div>");
		div.html(res);
		amt = div.find(".pretty:contains(Game 4)").length;
		steps = 0;
		div.find(".pretty:contains(Game 4)").each(function(index) {
			var align = $(this).parent().parent().find(".roleimg").attr("class").split(" ")[1].split("-")[1];
			align = role_data[align];
			if (scope.game_id != $(this).attr("href").split("/")[2] && align != "third") {
				var isLast = false;
				if (amt == index + 1) {
					isLast = true;
				}
				console.log("isLast: " + isLast + " amt: " + amt + " index: " + index);
				(function(t, l) {
					g("https://s3.amazonaws.com/em-gamerecords/" + t.attr("href").split("/")[2], function(res2, status) {
						steps ++;
						if (status == 200) {
							var json = JSON.parse(res2);
							record(json, name, align);
						}
						console.log("steps: " + steps + " amt: " + amt);
						if (steps == amt) {
							finish(name);
						}
					});
				})($(this), isLast);
			}
			else {
				steps ++;
			}
		});
	});
}

function record(json, user, align) {
	var lowercase;
	var punctuationless;
	var finalString;
	var stufflist;
	var lastTime = 0;
	for (var i in json) {
		if (json[i][0] == "<") {
			if (json[i][1].user == user && !json[i][1].quote) {
				stats[align].sentTotal ++;
				
				//Count question marks
				for (var l in json[i][1].msg) {
					if (json[i][1].msg[l] == "?") {
						stats[align].qs ++;
					}
				}
				
				//Count words
				lowercase = json[i][1].msg.toLowerCase();
				punctuationless = lowercase.replace(/[^a-zA-Z\d\s]/g, ""); //Filters out punctuation
				finalString = punctuationless.replace(/\s{2,}/g," "); //Removes extra spaces
				stufflist = finalString.split(" "); //creates a list of the things the user entered
				stats[align].wordsTotal += stufflist.length;
				for (var w in stufflist) {
					if (stats[align].words[stufflist[w]]) {
						stats[align].words[stufflist[w]] ++;
					}
					else {
						stats[align].words[stufflist[w]] = 1;
					}
				}
				
				//Record timing
				if (lastTime > 0) {
					if (json[i][1].t - lastTime < 60) {
						stats[align].avgTime += (json[i][1].t - lastTime);
					}
					lastTime = json[i][1].t;
				}
				else {
					lastTime = json[i][1].t;
				}
			}
			else if (json[i][1].user == user) {
				//Record amount of quotes
				stats[align].quotes ++;
			}
		}
	}
}

function finish(user) {
	stats.game.avgTime = stats.game.avgTime / stats.game.sentTotal;
	if (stats.mafia.sentTotal > 0) {
		stats.mafia.avgTime = stats.mafia.avgTime / stats.mafia.sentTotal;
	}
	if (stats.village.sentTotal > 0) {
		stats.village.avgTime = stats.village.avgTime / stats.village.sentTotal;
	}
	console.log(stats);
	calc(user);
}

//Get chat in current games
function recordGame(name) {
	var tempJSON = [];
	while(!$("#linkleft").hasClass("ng-hide")) {
		$("#linkleft a").click();
	}
	tempJSON = compile(tempJSON);
	while(!$("#linkright").hasClass("ng-hide")) {
		$("#linkright a").click();
		tempJSON = compile(tempJSON);
	}
	record(tempJSON, name, "game");
}

function compile(tjson) {
	var tArray;
	var mData;
	$(".talk").each(function() {
		mData = {};
		mData.t = parseInt($(this).find(".timestamp").text().trim().replace(":", ""));
		mData.t = Math.round(Math.trunc(mData.t/100)*60 + (((Math.trunc(mData.t/100) - (mData.t/100)) * -1) * 100));
		mData.user = $(this).find(".talk_username").val();
		mData.msg = $(this).find(".msg").text();
		if ($(this).has(".quote").length > 0) {
			mData.quote = true;
		}
		else {
			mData.quote = false;
		}
		tArray = ["<", {"user": mData.user, "msg": mData.msg, "t": mData.t, "quote": mData.quote}];
		tjson.push(tArray);
	});
	return tjson;
}

//Calculate whether mafia or town
function calc(name) {
	//Word density
	var gameWords = stats.game.words;
	var mafWords = stats.mafia.words;
	var villageWords = stats.village.words;
	var times = 0;
	var determ = 0;
	var percentG, percentV, percentM, diffMafia, diffVillage, diffTotal, weight;
	for (var word in gameWords) {
		percentG = gameWords[word] / stats.game.wordsTotal;
		
		if (mafWords[word]) {
			percentM = mafWords[word] / stats.mafia.wordsTotal;
		}
		else {
			percentM = 0;
		}
		
		if (villageWords[word]) {
			percentV = villageWords[word] / stats.village.wordsTotal;
		}
		else {
			percentV = 0;
		}
		
		if (percentM > 0 || percentV > 0) {
			diffMafia = 1 - Math.abs(percentG - percentM);
			diffVillage = 1 - Math.abs(percentG - percentV);
			determ += diffVillage - diffMafia;
			times ++;
		}
	}
	determ = determ / times;
	calcs.wordDens = determ;
	
	//Question frequency
	percentG = stats.game.qs / stats.game.sentTotal;
	percentV = stats.village.qs / stats.village.sentTotal;
	percentM = stats.mafia.qs / stats.mafia.sentTotal;
	
	diffMafia = 1 - Math.abs(percentG - percentM);
	diffVillage = 1 - Math.abs(percentG - percentV);
	
	determ = diffVillage - diffMafia;
	calcs.qsFreq = determ;
	
	//Quote frequency
	percentG = stats.game.quotes / stats.game.sentTotal;
	percentV = stats.village.quotes / stats.village.sentTotal;
	percentM = stats.mafia.quotes / stats.mafia.sentTotal;
	
	diffMafia = 1 - Math.abs(percentG - percentM);
	diffVillage = 1 - Math.abs(percentG - percentV);
	
	determ = diffVillage - diffMafia;
	calcs.quoteFreq = determ;
	
	//Timing
	weight = (Math.abs(calcs.wordDens) + Math.abs(calcs.qsFreq) + Math.abs(calcs.quoteFreq)) / 3;
	
	diffMafia = Math.abs(stats.game.avgTime - stats.mafia.avgTime);
	diffVillage = Math.abs(stats.game.avgTime - stats.village.avgTime);
	diffTotal = diffMafia + diffVillage;
	
	diffMafia = 1 - (diffMafia / diffTotal);
	diffVillage = 1 - (diffVillage / diffTotal);
	
	determ = (diffVillage - diffMafia) * weight;
	calcs.timing = determ;
	
	//All together
	calcs.total = (calcs.wordDens + calcs.qsFreq + calcs.quoteFreq + calcs.timing) / 4;
	
	var percentConf = Math.round(Math.abs(calcs.total * 100) * 1000) / 1000;
	if (calcs.total > 0 && stats.village.sentTotal > 0 && stats.mafia.sentTotal > 0) {
		alert(name + " is likely village, with a confidence of " + percentConf + "%");
	}
	else if (stats.village.sentTotal > 0 && stats.mafia.sentTotal > 0) {
		alert(name + " is likely mafia, with a confidence of " + percentConf + "%");
	}
	else {
		alert("Not enough data to determine the alignment of " + name);
	}
}