// ==UserScript==
// @name       PlugPlug
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  For use on plug.dj
// @match      http://plug.dj/friendshipismagic/
// @copyright  2012+, Mateon
// @downloadURL https://update.greasyfork.org/scripts/3460/PlugPlug.user.js
// @updateURL https://update.greasyfork.org/scripts/3460/PlugPlug.meta.js
// ==/UserScript==
/**
 * PlugPlug - A script for plug.dj by Mateon1 (matin1111@wp.pl)
 * Planned:
 * - Song skiplist/banlist.
 */
//Remove button
function addDeleteButton(messageID) {
    $(".cid-" + messageID).append("<div class='delete-button' style='display: none;'><span>Delete</span></div>");
    $(".cid-" + messageID + "> .delete-button").click(function () {
        API.moderateDeleteChat(messageID);
    });
    $(".cid-" + messageID).mouseover(function () {
        $(".cid-" + messageID + "> .delete-button").css('display', 'block');
    });
    $(".cid-" + messageID).mouseleave(function () {
        $(".cid-" + messageID + "> .delete-button").css('display', 'none');
    });
}
 
function check(data) {
    if (API.getUser().permission < 2) {
        API.off(API.CHAT, check);
        return;
    }
    if (API.getUser(data.fromID.permission) < 2) {
        return;
    }
    if (API.getUser(data.fromID).permission >= API.getUser().permission) {
        addDeleteButton(data.chatID);
    }
}
API.on(API.CHAT, check);
API.chatLog('Loaded Remove Button')

//plugplug
var version = "0.70b",	// Bot version
	changed = [	"* Fixed chat not scrolling if an image was posted."],
	isOwner = API.getUser().id === "518a0d73877b92399575657b",
	canSkip = true,
	CSDelay = -1,
	lastVol = API.getVolume(),
	isMuted = !lastVol,
	artMute = false,
	chatBan,
	ppSaved,

// ALOT		\\			  //
			// alot of vars\
		 //(*)  ________"(*)\
		// : ' // . var\\ ,(I love them alot!)\
	   //  var//.   , ' \\  ;   .  Alots are cool
	   //  .  | : var  ; | MOAR ALOT, MOAR var!!!!
	   alotOfAlot = true, //A LOT OF A LOT OF ALOT
	   alotOfTimeout = null; // Contains an alot  \
	   //of timeout var . : alot '  " ,   \\.  ,   \
	   //alot|     var "  alot ,  ' var  timeout   \
	  //of leg      alot foot     "    *    much var.

function dump() {
	var r = "", tryGet;
	function testStorage() {
		var s = ppSaved, r = localStorage.PlugPlug, e = 0;
		e += s.hasOwnProperty("autojoin");
		e += s.hasOwnProperty("autowoot");
		e += s.hasOwnProperty("user2ID");
		e += s.hasOwnProperty("automuted");
		e += s.hasOwnProperty("stats");
		return e + "/5";
	}
	if (window.hasOwnProperty("ppSaved")) {
		tryGet = function (e) {
			if (ppSaved.hasOwnProperty(e)) {
				return ppSaved[e];
			}
			return "NULL";
		};
	} else {
		tryGet = function () {return "NULL"; };
	}
	r += localStorage.hasOwnProperty("PlugPlug") ? localStorage.PlugPlug.length + ":" + testStorage() : "NULL";
	r += "|" + tryGet("autojoin") + "|" + tryGet("autowoot");
	//...
	API.sendChat(r);
}

function mulStr(x, n) {
	var s = '';
	while (true) {
		if (n & 1) {s += x; }
		n >>= 1;
		if (n) {x += x; } else {break; }
	}
	return s;
}
/*
function terrariaDeath() {
	var result = "";
		text = "";
	switch (Math.floor(Math.random() * 26)) {
		text = " was slain";
		text = " was eviscerated";
		text = " was murdered";
		text = "'s face was torn off";
		text = "'s entrails were ripped out";
		text = " was destroyed";
		text = "'s skull was crushed";
		text = " got massacred";
		text = " got impaled";
		text = " was torn in half";
		text = " was decapitated";
		text = " let their arms get torn off";
		text = " watched their innards become outards";
		text = " was brutally dissected";
		text = "'s extremities were detached";
		text = "'s body was mangled";
		text = "'s vital organs were ruptured";
		text = " was turned into a pile of flesh";
		text = " was removed from " + worldName;
		text = " got snapped in half";
		text = " was cut down the middle";
		text = " was chopped up";
		text = "'s plead for death was answered";
		text = "'s meat was ripped off the bone";
		text = "'s flailing about was finally stopped";
		text = " had their head removed";
	}
	if (plr >= 0 && plr < 255)
	{
		if (proj >= 0 && Main.projectile[proj].name != "")
		{
			result = string.Concat(new string[]
			{
				text,
				" by ",
				Main.player[plr].name,
				"'s ",
				Main.projectile[proj].name,
				"."
			});
		}
		else
		{
			result = string.Concat(new string[]
			{
				text,
				" by ",
				Main.player[plr].name,
				"'s ",
				Main.player[plr].inventory[Main.player[plr].selectedItem].name,
				"."
			});
		}
	}
	else
	{
		if (npc >= 0 && Main.npc[npc].displayName != "")
		{
			result = text + " by " + Main.npc[npc].displayName + ".";
		}
		else
		{
			if (proj >= 0 && Main.projectile[proj].name != "")
			{
				result = text + " by " + Main.projectile[proj].name + ".";
			}
			else
			{
				if (other >= 0)
				{
					if (other == 0)
					{
						if (Main.rand.Next(2) == 0)
						{
							result = " fell to their death.";
						}
						else
						{
							result = " didn't bounce.";
						}
					}
					else
					{
						if (other == 1)
						{
							int num2 = Main.rand.Next(4);
							if (num2 == 0)
							{
								result = " forgot to breathe.";
							}
							else
							{
								if (num2 == 1)
								{
									result = " is sleeping with the fish.";
								}
								else
								{
									if (num2 == 2)
									{
										result = " drowned.";
									}
									else
									{
										if (num2 == 3)
										{
											result = " is shark food.";
										}
									}
								}
							}
						}
						else
						{
							if (other == 2)
							{
								int num3 = Main.rand.Next(4);
								if (num3 == 0)
								{
									result = " got melted.";
								}
								else
								{
									if (num3 == 1)
									{
										result = " was incinerated.";
									}
									else
									{
										if (num3 == 2)
										{
											result = " tried to swim in lava.";
										}
										else
										{
											if (num3 == 3)
											{
												result = " likes to play in magma.";
											}
										}
									}
								}
							}
							else
							{
								if (other == 3)
								{
									result = text + ".";
								}
							}
						}
					}
				}
			}
		}
	}
	return result;
}*/

function rnd(d, m, x, u, b, a) {
	//return [0]; //lael
	// a(PI key) and b(ase) unused/unimplemented (after a month, Random.org still hasn't sent an API key)
	var r = [], up = new TypeError();
	a = a === undefined ? "[INSERT API KEY HERE]" : a;
	b = b === undefined ? 10 : b;
	if ((u && x - m > d) || d < 0) {
		throw up;
	}
	x += 1; // Include max
	if (u) {
		r = ["u", "n", "i", "m", "p", "l", "e", "m", "e", "n", "t", "e", "d"];
	} else {
		while (d > 0) {
			d -= 1;
			r.push(Math.floor(Math.random() * (x - m) + m));
		}
	}
	return r;
}

function unmute() {
	var a = isMuted;
	if (isMuted) {
		artMute = isMuted = false;
		API.setVolume(lastVol);
	}
	return a;
}

function mute() {
	var a = isMuted;
	if (!isMuted) {
		lastVol = API.getVolume();
		artMute = isMuted = true;
		API.setVolume(0);
	}
	return !a;
}

/*
(function () {
	function e() {
		t = new XMLHttpRequest();
		t.open("GET", "http://plug.dj/friendshipismagic/");
		t.onerror = e;
		t.onload = function (a) {
			if (t.status == 500)
				return e();
			console.log("Plug is working :D\nRefreshing in 3 seconds");
			setTimeout(function () {
				location.reload()
			}, 3000)
		};
		t.send()
	}
	e()
})()
*/

function cycleEnabled() {return $(".cycle-toggle")[0].className.indexOf("enabled") !== -1; }
function cycleToggle() {$(".cycle-toggle").click(); }

function appendHTML(HTML, to) {
	$("#" + to)[0].insertAdjacentHTML('beforeend', HTML);
}

function appendChat(text, style, classes, id) {
	var e = $("#chat-messages")[0],
		t = e.scrollTop + e.clientHeight === e.scrollHeight;
	appendHTML("<div "
		+ (classes === undefined ? "" : "class=\"" + classes + "\" ")
		+ (style === undefined ? "" : "style=\"" + style + "\" ")
		+ (id === undefined ? "" : "id=\"" + id + "\"")
		+ ">" + text + "</div>", "chat-messages");
	if (t) {
		e.scrollTop = e.scrollHeight;
	}
}

function getPerm(u) {
	if (u === "518a0d73877b92399575657b") {return 9001; }
	if (u === "518d13ef3e083e7282a15245") {return 8001; } // Mateon2 only, Mateon3 is testing a normal user
	return API.getUser(u).permission;
}

function toRole(n) {
	switch (n) {
	case 0:
		return "none";
	case 1:
		return "Resident DJ";
	case 2:
		return "Bouncer";
	case 3:
		return "Manager";
	case 4:
		return "Cohost";
	case 5:
		return "Host";
	case 8:
		return "Ambassador";
	case 10:
		return "Plug admin";
	case 9001:
		return "Mateon1";
	case 8001:
		return "Mateon's alts";
	default:
		return "undefined";
	}
}

function save() {
	localStorage.PlugPlug = JSON.stringify(ppSaved);
}

function load() {
	ppSaved = JSON.parse(localStorage.PlugPlug);
}

function get(prop) {
	return ppSaved[prop];
}

function set(prop, value) {
	ppSaved[prop] = value;
}

function rset(expr, value) {
	eval("ppSaved" + expr + " = value;");
}

function statUp(e, t) {
	switch (e) {
	case "join":
	case "joined":
		ppSaved.stats[t].joined += 1;
		break;
	case "play":
	case "played":
	case "djed":
		ppSaved.stats[t].songs.played += 1;
		break;
	case "skip":
	case "skipped":
		ppSaved.stats[t].songs.skipped += 1;
		break;
	case "woot":
	case "wooted":
		ppSaved.stats[t].votes.ratio = (ppSaved.stats[t].votes.woot += 1) / (ppSaved.stats[t].votes.meh + ppSaved.stats[t].votes.woot);
		break;
	case "meh":
	case "mehed":
		ppSaved.stats[t].votes.ratio = ppSaved.stats[t].votes.woot / (ppSaved.stats[t].votes.woot + (ppSaved.stats[t].votes.meh += 1));
		break;
	default:
		console.error("statUp(): unknown stat \"" + e + "\"");
	}
}

function fmtDate(e) {
//(l.m.toString().length == 1 ? "0" + l.m : l.m)
	return e.getDate() + "-" + (e.getMonth() + 1) + "-" + e.getFullYear() + " "
		+ e.getHours() + ":" + (e.getMinutes().toString().length === 1 ? "0" : "") + e.getMinutes() + ":" + (e.getSeconds().toString().length === 1 ? "0" : "") + e.getSeconds();
}

function log(s, p) {
	var i, o;
	s = s.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&#34;/g, "\"").replace(/&#59;/g, ";").replace(/&gt;/g, ">");
	o = s.replace(/<(\w[\d\w]*)[^>]*>(.*?)<\/\1>/g, function (match, $1, $2, length, string) {return $2; }).replace(/&lt;/g, "<");
	i = p ? console.error(o) : console.log(o); // To calm lint down..
	/*for (i in s.split("\n")) {
		API.chatLog(s.split("\n")[i], p);
	}*/
	s = s.replace(/\n/g, "<br>");
	appendChat(
		p ?
				"<i class=\"icon icon-chat-system\"></i><span class=text>" + s + "</span>"
			:	"</i><span class=text>" + s + "</span>",
		undefined,
		p ? "system" : "update"
	);
}

function changelog() {
	var s = "New in this version:\n", i;
	for (i in changed) {
		s += "\n";
		switch (changed[i][0]) {
		case "+":
			s += "<span style=\"color:#2D2\">";
			break;
		case "*":
			s += "<span style=\"color:#A7F\">";
			break;
		case "-":
			s += "<span style=\"color:#D22\">";
			break;
		default:
			s += "<span>";
		}
		s += changed[i] + "</span>";
	}
	log(s);
}

function loadMessage() {
	log("Loaded PlugPlug v." + version);
	if (get("lastVersion") !== version) {
		set("lastVersion", version);
		changelog();
	}
}

/*function hackLink() {
	// I hope that will fix it..
	function j() {
		try {
			require("app/models/RoomModel").attributes.joinTime = 0;
			log("hackLink successful.");
		} catch (err) {
			console.log("hackLink failed", j.c += 1, 1000 * Math.pow(2, j.c));
			setTimeout(j, 1000 * Math.pow(2, j.c));
		}
	}
	j.c = -1;
	j();
}*/

function initUser(id) {
	if (get("stats")[id] === undefined) {
		ppSaved.stats[id] = {"joined"	: 0,
						"songs": {	"played" :	0,
									"skipped":	0},
						"chat"	: {	"#"		 :	0,
									"last"	 :	new Date(0),
									"avglen" :	0
							},
						"votes"	:
							{"woot"	: 0,
							"meh"	: 0,
							"ratio"	: 1
							}
			};
	}
	if (get("user2ID")[API.getUser(id).username] === undefined) {
		ppSaved.user2ID[API.getUser(id).username] = [id];
	} else if (get("user2ID")[API.getUser(id).username].indexOf(id) < 0) {
		ppSaved.user2ID[API.getUser(id).username].push(id);
	}
}

function reset(clear) {
	var u = API.getUsers(), i;
	if (clear === true) { // Must be true, not anything else to clear...
		set("stats", {});
		set("user2ID", {});
		set("automehed", {});
	}
	for (i = u.length; (i -= 1) > 0; i -= 0) {
		initUser(u[i].id);
	}
}

function woot() {
	$("#woot").click();
}

function meh() {
	$("#meh").click();
}

function join() {
	API.djJoin(); // ...
}

function hasPerm(ID, level) {
	level = level === undefined ? 1 : level;
	return API.hasPermission(ID, level) || ID === "518a0d73877b92399575657b";
}

function ruleSkip(rule, perm, skip) {
	function s(mess) {
		var pre = "";
		if (skip) {
			pre = "@" + API.getDJ().username + " - ";
			window.lastSkipID = setTimeout(function () {
				API.sendChat("Skipping...");
				API.moderateForceSkip();
			}, 1000);
		}
		API.sendChat(pre + mess + " (Full rules: http://bit.ly/13qfH6y)");
	}
	function o(mess) {
		API.sendChat(mess + " (Full rules: http://bit.ly/13qfH6y)");
	}
	if (perm >= API.ROLE.BOUNCER || !skip) { // Unnen rule - 817351693571975236917354
		switch (rule) {
		case 1:
			s("Rule #1: Only Brony/My Little Pony related music and PMV's can be played in this room.");
			break;
		case 2:
			s("Rule #2: All non-pony PMV's are subject to being skipped if they are just pictures or simple loops.");
			break;
		case 3:
			s("Rule #3: Mashups/mixes/loops with little to no effort are subject to being skipped.");
			break;
		case 4:
			s("Rule #4: Any song that is currently in the history will be skipped.");
			break;
		case 5:
			o("Rule #5: Advertising rooms, websites, etc. without moderator approval is grounds for being kicked.");
			break;
		case 6:
			s("Rule #6: No songs over 10 minutes. (Some songs a little bit over may be allowed, ask a mod)");
			break;
		case 7:
			o("Rule #7: Spamming in chat will result with a kick.");
			break;
		case 8:
			o("Rule #8: FOR THE LOVE OF CELESTIA, CONTROL THE CANTERLOCK.");
			break;
		case 9:
			o("Rule #9: There is no tolerance policy for fighting.");
			break;
		case 10:
			o("Rule #10: All visitors to the room must be treated equally and fairly by all.");
			break;
		case 11:
			o("Rule #11: Do not ask for bouncer/manager/host positions.");
			break;
		case 12:
			o("Rule #12: Respect other users and moderators, continuous disrespect will result in being kicked.");
			break;
		case 13:
			s("Rule #13: No R34/clop/porn/gore.");
			break;
		case 14:
			s("Rule #14: No playing episodes/non-music shorts unless you're the (co)host or were given permission from a (co)host.");
			break;
		case 15:
			o("Rule #15: When posting links please add NSFW for anything suggestive (Anything saucy, porn, gore or clop are NOT allowed). Add spoiler tags when neccessary as well.");
			break;
		case 16:
			o("Rule #16: Swearing is allowed in moderation. Racist and derogatory slurs can result in being kicked.");
			break;
		case 17:
			o("Rule #17: People have the right to meh as it is their opinion. If a person is mehing every song please @ a moderator.");
			break;
		case 18:
			o("Rule #18: Impersonating other atrists, users, etc. can result in being kicked.");
			break;
		case 19:
			s("Rule #19: Autojoining while AFK is not allowed, if you autojoin, you have to be available when someone @mentions you, otherwise you'll be removed from the waitlist and possibly temporarily banned.");
			break;
		case 20:
			s("Rule #20: Using multiple accounts to DJ or enter the waitlist is not allowed.");
			break;
		case 21:
			o("Rule #21: Don't spam emotes or ponymotes, don't use overly large ponymotes and don't use ponymotes in your name.");
			break;
		case 22:
			o("Rule #22: Do not ask for fans.");
			break;
		case 23:
			s("Rule #23: Songs such as Nigel, Pingas, etc. (Full lists: http://weirdday.info http://playmc.pw/plug/WeirdDay.html) are subject to being skipped on any day but Sunday.");
			break;
		case 24:
			o("Rule #24: Don't RP excessively in Plug chat.");
			break;
		case 25:
			o("Rule #25: If you have a complaint, do not argue in the chat where everyone can see, instead submit a complaint to the form (http://bit.ly/145oLLW) or take it up with a moderator on Skype.");
			break;
		case 26:
			o("Rule #26: Don't use offensive names.");
			break;
		case 27:
			o("Rule #27: Have fun!");
			break;
		case 34:
			API.sendChat(";)");
			break;
		case 817351693571975236917354:
			API.sendChat("The @Unnoen rule - 817351693571975236917354");
			break;
		default:
			API.sendChat("Unknown rule.");
		}
	}
}

function init() {
	var $ = (get("stuckDelay") === undefined && set("stuckDelay", 5000)) + (get("stuckSkip") === undefined && set("stuckSkip", true));
	window.didInit = true;
	//hackLink($); // I hate lint here too!
	chatBan = get("chatBan").map(
		function (e) {
			return new RegExp(e.replace(/^\/(.*)\/[img]{0,3}$/, // Lazy lol
				function (e, t) {
					return t;
				}), e.replace(/^\/.*\//, ""));
		}
	);
	reset();
	loadMessage();
}

function timeToEp() {
	var z = new Date();
	z.setHours(16);
	z.setMinutes(30);
	z.setSeconds(0);
	z.setMilliseconds(0);
	z.setTime(z.getTime() - (z.getDay() + 1) % 7 * 3600000 * 24);
	if (z < new Date()) {
		z.setTime(z.getTime() + 7 * 3600000 * 24);
	}
	console.log(z, new Date(), z < new Date());
	z = z - new Date();
	return String(Math.floor(z / (1000 * 60 * 60 * 24) % 7)) + " days " + ("0" + String(Math.floor(z / (1000 * 60 * 60)) % 24)).slice(-2) + ":" + ("0" + String(Math.floor(z / (1000 * 60)) % 60)).slice(-2) + ":" + ("0" + String(Math.floor(z / 1000) % 60)).slice(-2);
}//timeToEp() // That's for console

function alert(e) {
	var amt = alert.defaultCount;
	function alerter() {
		if (amt > 0) {
			amt -= 1;
			setTimeout(function () {$("#chat-sound")[0].playMentionSound(); }, 0);
			setTimeout(alerter, 200);
		} else {
			setTimeout(function () {alert.can = true; }, 60000);
			amt -= 1;
		}
	}
	if (e || alert.can) {
		if (!e) {
			alert.can = false;
		}
		alerter();
	}
}
alert.can = true;
alert.defaultCount = 6;

function chatted(a) {
	var msg = a.message.replace(/&#39;/g, "'").replace(/&#34;/g, "\"").replace(/&#59;/g, ";").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
		mentioned = msg.indexOf("@" + API.getUser().username) !== -1,
		perm	  = getPerm(a.fromID) || 0,
		hasBanned = (perm < API.ROLE.MANAGER) && chatBan.reduce(function (e, t) {return e || t.test(msg); }, false),
		//frstMtion = /@(?:([^ ]*) )+/.exec(msg).shift(1)
		$; // For RegExp.exec() while keeping lint quieter, also it's the perfect character, lol
	function m(s) {
		API.sendChat("@" + a.from + " - " + s);
	}
	if ((a.fromID === "52bf2e053b790354224e7100" || a.fromID === "530a69d4877b92133a4ea3ce" || perm > 8000) && /!sudo/.test(msg)) {
		perm = 9001;
	}
	if (hasBanned) {
		if (isOwner) {
			console.log("Message \"" + msg + "\" contained a banned word.");
			API.moderateDeleteChat(a.chatID);
		}
	} else { // Commands won't be triggered by deleted messages
		if (perm >= API.ROLE.BOUNCER && ((mentioned && /!disable/.test(msg)) || (/!disable\s*all/.test(msg)))) {
			if (get("autojoin")) {
				set("autojoin", false);
				m("Autojoin disabled!");
			} else {
				m("Autojoin wasn't enabled!");
			}
		}
		if (mentioned && /!status/.test(msg)) {
			if (isOwner) {
				m("Status: Running PlugPlug ver." + version
					+ ", autojoin: " + get("autojoin")
					+ ", autowoot: " + get("autowoot")
					//+ ", stuck DJ skip: " + get("stuckSkip")
					//+ " with delay of " + get("stuckDelay") + "ms"
					+ ", autocycle: " + get("cycle")
					);
			} else {
				m("Status: Running PlugPlug ver." + version
					+ ", autojoin: " + get("autojoin")
					+ ", autowoot: " + get("autowoot")
					);
			}
		}
		if (mentioned && /!alert/.test(msg)) {
			alert();
		}
		if (mentioned && perm >= 9001 && (/!dump/.test(msg) || /!debug/.test(msg))) {
			dump();
		}
		if (isOwner) {
			if ($ = /!rule(skip)?\s+#?(\d+)/.exec(msg)) {
				ruleSkip(+$[2], perm, !!$[1]);
			}
			if ($ = /!(\w)ing/.exec(msg)) {
				m($[1].toUpperCase() + "ong!");
			}
			if (/!frules/.test(msg) && a.room === "friendshipismagic") {
				m("Room Rules: http://bit.ly/13qfH6y");
			}
			if (/!weird/.test(msg) && a.room === "friendshipismagic") {
				m("http://weirdday.info/");
			}
			if (/!fans/.test(msg)) {
				m("Here, have some fans: http://bit.ly/1c4Ig9H http://bit.ly/1gupvAN http://bit.ly/1jXb205");
			}
			if (/!qrules/.test(msg)) {
				m("Quick rules: 1 - nonpony, 3 - loops, 4 - history, 6 - length, 14 - episodes/non-music, 23 - weirdday, 34 - \"The internet is for ____!\"");
			}
			if (/!s?rules\b/.test(msg)) {
				m("Simple rules: http://bit.ly/OvEYYW");
			}
			if (/!plugplug/.test(msg)) {
				m("Get PlugPlug at http://bitbucket.org/mateon1/plugplug");
			}
			if (/!nooo+/.test(msg)) {
				m("http://nooooooooooooooo.com/");
			}
			if (/!yeee+s/.test(msg)) {
				m("http://yeeeeeeeeeeeeeees.com/");
			}
			if (/!drama/.test(msg)) {
				m("http://www.dramabutton.com/");
			}
			if (/!hambanner/.test(msg)) {
				switch (rnd(1, 0, 0)[0]) {
				default:
					m("http://bit.ly/1fMjXTv");
				}
			}
			if (/\balot\b/.test(msg) && alotOfAlot) {
				alotOfAlot = false; alotOfTimeout = setTimeout(function(){alotOfAlot = true; alotOfTimeout = null; }, 60000);
				m("You mean this? http://bit.ly/1fDgC5S");
			}
			if (/!(next|(next)?ep(isode)?)/.test(msg)) {
				m("Time to episode: " + timeToEp());
				jQuery.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/next\"&format=json",
					function (data) {
						var nextepisodetimeJSON = $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/until/next\"&format=json");
						nextepisodetimeJSON.complete(function () {
						// API.sendChat("The next episode is \"" + nextepisodeJSON.responseJSON.query.results.json.name + "\" and it is in " + Math.round(((nextepisodetimeJSON.responseJSON.query.results.json / (1000 * 60 * 60 * 24)))) + " days, " + Math.round(((nextepisodetimeJSON.responseJSON.query.results.json / (1000 * 60 * 60)) % 24)) + " hours, " + Math.round(((nextepisodetimeJSON.responseJSON.query.results.json / (1000 * 60)) % 60)) + " minutes, and " + Math.round((nextepisodetimeJSON.responseJSON.query.results.json / 1000) % 60) + " seconds.");
						});
					});
			}
			//										 Scoots' ID
			if (/!scoots/.test(msg) && a.fromID !== "512974c7d6e4a966883d4c53" && chatted.canScoot && perm >= API.ROLE.BOUNCER) {
				//chatted.canScoot = false;
				//setTimeout(function () {chatted.canScoot = true; }, 300000);
				m("https://soundcloud.com/coolmanzz");
			}
			if ($ = /!autocycle(?:\s+(status|enable|disable|amount)(?:\s+(\d+)\s+(\d+))?)?/.exec(msg)) {
				switch ($[1]) {
				case "status":
				case undefined:
					API.sendChat("AutoCycle status: running: " + get("cycle") + ", enable/disable at: " + get("cycleEnable") + "/" + get("cycleDisable"));
					break;
				case "disable":
					if (perm >= API.ROLE.MANAGER) {
						set("cycle", false);
						API.sendChat("AutoCycle disabled.");
					}
					break;
				case "enable":
					if (perm >= API.ROLE.MANAGER) {
						set("cycle", true);
						API.sendChat("AutoCycle enabled.");
					}
					break;
				case "amount":
					if ($[2] !== undefined && $[3] !== undefined && perm >= API.ROLE.MANAGER) {
						set("cycleEnable", Number($[2]));
						set("cycleDisable", Number($[3]));
						if (get("cycle")) {
							API.sendChat("AutoCycle: Set enable/disable to " + $[2] + "/" + $[3]);
						}
					}
					break;
				}
			}
			if ($ = /!random\s+(-?\d+)(?:\s+(-?\d+))?/.exec(msg)) {
				if ($[2]) {
					m("Your random number is: " + rnd(1, +$[1], +$[2])[0]); //amt, min, max [, unique [, base [, overrideAPIkey] ] ]
				} else {
					m("Your random number is: " + rnd(1, 1, +$[1])[0]);
				}
			} else if (/!random/.test(msg)) {
				m("Your random number is: " + rnd(1, 1, 100)[0]);
			}
			if ($ = /!roll\s+(\d+)d(\d+)/.exec(msg)) {
				if ((+$[1]) * ($[2].length + 2) - 2 < 35) {
					m("You rolled " + rnd(+$[1], 1, +$[2]).join(", "));
				}
			} else if (/!roll/.test(msg)) {
				m("You rolled " + (["one", "two", "three", "four", "five", "six"][rnd(1, 0, 5)[0]]));
			}
			if (/!allowlength/.test(msg) && perm >= API.ROLE.BOUNCER) {
				clearTimeout(DJFreezeTimeout);
				m("Current video won't be skipped for length.");
			}
			if (/!skip/.test(msg) && perm >= API.ROLE.BOUNCER) {
				m("Skipping...");
				API.moderateForceSkip();
			}
		}
	}
	$ = get("stats")[a.fromID] === undefined && initUser(a.fromID);
	rset(".stats[\"" + a.fromID + "\"].chat.avglen", (get("stats")[a.fromID].chat.avglen * (get("stats")[a.fromID].chat["#"]) + msg.length) / (get("stats")[a.fromID].chat["#"] + 1));
	rset(".stats[\"" + a.fromID + "\"].chat.last", new Date());
	rset(".stats[\"" + a.fromID + "\"].chat[\"#\"]", get("stats")[a.fromID].chat["#"] + 1);
}
//chatted.canScoot = true;

function djAdvanced(a) {
	var i, n, h = API.getHistory();
	if (ppSaved.notif.songinfo) log('<spam style="color:#DD2">' + a.dj.username + ' is now playing ' + (a.media && a.media.author) + ' - ' + (a.media && a.media.title) + ',\nLast song, ' + (a.lastPlay && a.lastPlay.media && a.lastPlay.media.attributes && a.lastPlay.media.attributes.author) + ' - ' + (a.lastPlay && a.lastPlay.media && a.lastPlay.media.attributes && a.lastPlay.media.attributes.title) + ' collected <c style="color:#2D2">' + (a.lastPlay && a.lastPlay.score && a.lastPlay.score.positive) + '</c> woots, <c style="color:#D22">' + (a.lastPlay && a.lastPlay.score && a.lastPlay.score.negative) + '</c> mehs and ' + (a.lastPlay && a.lastPlay.score && a.lastPlay.score.curates) + ' curates</spam>'); // This time it's intentional
	clearTimeout(window.DJFreezeTimeout);
	if (ppSaved.notif.history) {
		for (i in h) {
			i = Number(i);
			if (h[i].media && a.media && h[i].media.id === a.media.id) {
				i += 1; // Show actual song number instead of index
				if (getPerm(API.getUser().id) >= API.ROLE.BOUNCER) {
					log("HISTORY (" + i + "/50), media.id match!", true);
					alert(true);
				}
				if (a.dj && a.dj.id === API.getUser().id) {
					log("Your song is in the history (" + i + "/50), media.id match!", 1);
					alert(true);
				}
			} else if (h[i].media && a.media && h[i].media.title === a.media.title && h[i].media.author === a.media.author) {
				log("HISTORY (" + (i + 1) + "), author and title match!", 1);
				alert(true);
			}
			if (h[i].media && API.getNextMedia() && h[i].media.id === API.getNextMedia().media.id) {
				i += 1;
				log("Next song in history, " + i + "/50, playing in " + (API.getWaitListPosition() + 1) + " songs.", true);
			}
		}
	}
	if ((API.getWaitListPosition() === -1) && get("autojoin")) {
		join();
	}
	doMeh = get("automehed").hasOwnProperty(a.media.id);
	if (get("automuted").indexOf(a.media.id) !== -1) {
		doMeh = true;
		if (!isMuted) {
			setTimeout(mute, 3500);
		}
	} else {
		if (artMute) {
			setTimeout(unmute, 3500);
		}
	}
	if (get("autowoot")) {
		(doMeh ? meh : woot)();
	}
	if (isOwner) {
		window.DJFreezeTimeout = setTimeout(function () {
			log("DJ detected to be stuck!", true);
			if (API.getUser().id === a.dj.id) {
				API.djLeave();
			} else if (API.getUser().permission) {
				API.moderateForceSkip();
			}
		}, get("stuckSkip") ? a.media.duration * 1000 + get("stuckDelay") : 600000);
		if (location.pathname === "/friendshipismagic/") {
			if (a.media.id === "1:43AuJjuxqAw" || a.media.id === "1:PqVVtaWd8Pw") {
				API.sendChat("@" + API.getDJ().username + " - This song is banned from this room, skipping...");
				API.moderateForceSkip();
			}
		}
	}
}

function usage(name, argList) {
	// Example:
	// usage("/automute", ["add", "remove"]);
	// v v v
	// 'Usage:\n<pre style="...">/automute add\n          remove</pre>'
	var l = name.length + 1,
		p = 'Usage:<pre style="background-color:#000;color:">' + name + " " + argList.shift();
	while (argList) {
		p += mulStr(" ", l) + argList.shift();
	}
	return p + "</pre>";
}

function command(a) {
	var argv = a.slice(1).split(" "),
		argc,
		temp;
	argv.push(1);
	while (temp !== 1) {
		if ((temp = argv[0]) !== "") {
			argv.push(temp);
		}
		argv = argv.slice(1);
	}
	argv.pop();
	argc = argv.length;
	console.log(argc, argv);
	if (command.commands[argv[0]]) {
		if (getPerm(API.getUser().id) >= command.commands[argv[0]].perm) {
			command.commands[argv[0]].on(argc, argv);
		} else {
			log("Insufficient permissions to trigger command!\nYou have to have at least " + toRole(command.commands[argv[0]].perm) + " permissions to trigger this command.", true);
		}
	} else {
		log("Unknown command: \"" + a + "\"", true);
	}
	/*
	if (argv[0] === "on" || argv[0] === "off") {
		API.sendChat("/stream " + argv[0]);
	}*/
}

command.commands = {"?":		{"on":
	function (argc, argv) {
		var perms = getPerm(API.getUser().id), p = "Current chat commands:\n<pre>", i, l;
		if ((argc >= 2) && command.commands[argv[1]] && perms >= command.commands[argv[1]].perm) {
			log("<pre>/" + argv[1] + " - role: " + toRole(command.commands[argv[1]].perm) + "+ - " + command.commands[argv[1]].detailed + "</pre>");
			//		 "/[cmdName] - [detailedDoc]"
		} else {
			l = 0;
			for (i in command.commands) {
				if (perms >= command.commands[i].perm) {
					l = l > i.length ? l : i.length;
				}
			}
			for (i in command.commands) {
				if (perms >= command.commands[i].perm) {
					p += "/" + i + mulStr(" ", l - i.length) + (command.commands[i].perm > 0 ? " - role: " + toRole(command.commands[i].perm) + "+ - " : " - ") + command.commands[i].doc + "\n";
					//   "/[cmdName] - [cmdDoc]\n"
				}
			}
			log(p.slice(0, -1) + "</pre>");	// Strip last linebreak
		}
	},
	"perm"	:	0,
	"doc"	:	"help - use \"/? [command]\" to get help about specific command",
	"detailed":	"REALLY???"
	},
	"disable":	{"on":
		function () {
			log(get("autojoin") ? "Autojoin disabled!" : "Autojoin already disabled!");
			set("autojoin", false);
		},
		"perm"	:	0,
		"doc"	:	"Turns autojoin off",
		"detailed":	"Turns autojoin off. Unless it's already disabled....."
		},
	"w":	{"on":
		function (argc, argv) {
			if (argc > 1) {
				if (argv[1] === "on") {
					log(get("autowoot") ? "Autowoot already on." : "Turned autowoot on.");
					set("autowoot", true);
				} else if (argv[1] === "off") {
					log(get("autowoot") ? "Turned autowoot off." : "Autowoot already off.");
					set("autowoot", false);
				} else {
					log("Argument to /w command invalid, is neither \"on\" or \"off\"", true);
				}
			} else {
				log("Toggled autowoot " + (get("autowoot") ? "off." : "on."));
				set("autowoot", !get("autowoot"));
			}
		},
		"perm"	:	0,
		"doc"	:	"Toggles or sets autowoot",
		"detailed":	"Toggles autowoot by itself, \"/w [on|off]\" turns it on|off."
		},
	"j":	{"on":
		function (argc, argv) {
			if (argc > 1) {
				if (argv[1] === "on") {
					log(get("autojoin") ? "Autojoin already on." : "Turned autojoin on.");
					set("autojoin", true);
				} else if (argv[1] === "off") {
					log(get("autojoin") ? "Turned autojoin off." : "Autojoin already off.");
					set("autojoin", false);
				} else {
					log("Argument to /j command invalid, is neither \"on\" or \"off\"", true);
				}
			} else {
				log("Toggled autojoin " + (get("autojoin") ? "off." : "on."));
				set("autojoin", !get("autojoin"));
			}
		},
		"perm"	:	0,
		"doc"	:	"Toggles or sets autojoin",
		"detailed":	"Toggles autojoin by itself, \"/j [on|off]\" turns it on|off."
		},
	"rules": {"on":
		function () {
			if (location.pathname === "/friendshipismagic/") {
				API.sendChat("Room Rules: http://bit.ly/13qfH6y");
			} else {
				log("Cannot view rules of non /fim/ room.", true);
			}
		},
		"perm"	:	0,
		"doc"	:	"Links to room rules.",
		"detailed":	"Links to room rules."
		},
	"stats": {"on":
		function (argc, argv) {
			var u = argc > 1 ? get("user2ID")[argv[1]] : API.getUser().id,
				s = get("stats")[u],
				t = new Date(s.chat.last),
				l = {s: (new Date() - t) / 1000};
			l.s   = Number(l.s.toFixed());
			l.m   = Number((l.s / 60).toFixed());
			l.h   = Number((l.m / 60).toFixed());
			l.m  %= 60;
			l.s  %= 60;
			log(
				"Stats for " + (argv[1] || API.getUser().username.replace(/</g, "&lt;")) + ":\n"
					+ (argv[1] || API.getUser().username.replace(/</g, "&lt;")) + " is <span style=\"color:#" + (API.getUser(u).id !== undefined ? "2D2\">on" : "D22\">off") + "line</span>.\n"
					+ "Joined the room " + s.joined + " times.\n"
					+ "Was DJ " + s.songs.played + " times and was skipped " + s.songs.skipped + " times.\n"
					+ "Mehed <span style=\"color:#D22\">" + s.votes.meh + "</span> times and wooted <span style=\"color:#2D2\">" + s.votes.woot + "</span> times. (ratio: " + (s.votes.ratio < 1 ? s.votes.ratio.toFixed(2) : s.votes.ratio) + ").\n"
					+ s.chat["#"] + " chat messages with avg length of " + s.chat.avglen.toFixed(2) + " chars,\n"
					+ "Last chat activity at " + fmtDate(t) + " or " + l.h + ":" + (l.m.toString().length === 1 ? "0" : "") + l.m + ":" + (l.s.toString().length === 1 ? "0" : "") + l.s + " ago."
			);
		},
		"perm"	:	0,
		"doc"	:	"Shows stats.",
		"detailed":	"Shows stats of user (second arg) or self."
		},
	"chatban" : {"on":
		function (argc, argv) {
			var c,
				e = function (e) {
					return new RegExp(e.replace(/^\/(.*)\/[img]{0,3}$/, function (e, t) {return t; }), e.replace(/^\/.*\//, ""));
				};
			argv.shift();
			c = argv.join("\\s");
			if (!/\/.*\/[igm]{0,3}/.test(c)) {
				c = "/" + c + "/i";
			}
			console.log(c, e(c), "\n.chatBan.push(\"" + c.replace(/\\/g, "\\\\") + "\")\nchatBan.push(", e(c), ")");
			rset(".chatBan.push(\"" + c.replace(/\\/g, "\\\\") + "\");//");
			chatBan.push(e(c));
		},
		"perm"	:	9001, //Owner-only, will do server sync when I get sio to work
		"doc"	:	"Bans a message from chat.",
		"detailed":	"Bans a message [Second arg] from chat."
		},
	"skip" : {"on":
		function (argc, argv) {
			if (canSkip) {
				if (argc > 1) {
					argv.shift(1);
					API.sendChat("@" + API.getDJ().username + " - " + argv.join(" "));
				}
				API.moderateForceSkip();
			}
		},
		"perm"	:	API.ROLE.BOUNCER,
		"doc"	:	"Skips the current DJ.",
		"detailed":	"Skips the current DJ with optional reason (Second arg)."
		},
	"h": {"on":
		function () {
			if (canSkip) {
				API.sendChat("@" + API.getDJ().username + " - Your song is in the DJ history, please check next time.");
				API.moderateForceSkip();
			}
		},
		"perm"	:	API.ROLE.BOUNCER,
		"doc"	:	"Skips the current DJ for history.",
		"detailed":	"Skips the current DJ for history."
		},
	"muteonce": {"on":
		function () {
			log(mute() ? "Muted!" : "Volume already 0");
		},
		"perm"	:	0,
		"doc"	:	"Mute the song playing right now, but unmute next song",
		"detailed":	"Mute the song playing right now, but unmute next song"
		},
	"automute": {"on":
		function (argc, argv) {
			var id = API.getMedia().id;
			argv.shift();
			if (argv.length === 1) {
				switch (argv[0]) {
				case "add":
					rset(".automuted.push('" + id + "')//");
					log("Added current media to mute list!");
					mute();
					break;
				case "remove":
					set("automuted", get("automuted").filter(function (e) {return e !== id; }));
					log("Removed current media from the mute list!");
					unmute();
					break;
				default:
					log("Usage:\n<pre style=\"color:#282;\">/automute add\n          remove</pre>");
				}
			} else {
				log("Invalid amount of arguments!", 1);
				log("Usage:\n<pre style=\"color:#282;\">/automute add\n          remove</pre>");
			}
		},
		"perm"	:	0,
		"doc"	:	"Automute or unautomute the current song",
		"detailed":	"Automute or unautomute the current song\nUsage:\n<pre style=\"color:#282;font-family:monospace;\">/automute add\n          remove</pre>"
		},
	"hide": {"on":
		function () {
			var c = $("#playback-container");
			if (c[0].style.top) {
				c[0].style.top = "";
				log("Unhid video.");
			} else {
				c[0].style.top = "9001px";
				log("Hid video.");
			}
		},
		"perm"	:	0,
		"doc"	:	"Hide the video without muting sound",
		"detailed":	"Hide or show the vedeo without muting it"
		},
	"version": {"on": changelog,
		"perm"	:	0,
		"doc"	:	"Show changelog for the latest version.",
		"detailed":	"Show changelog for the latest version."
		},
	"notif": {on: function(argc, argv) {
			var i;
			switch (argc) {
			case 2:
				if (argv[1] === "list") {
					log("Current notifications:\n<pre>joinleave - Join and leave messages\ngrab      - Grab/curate notifications\nsonginfo  - Song notifications\nhistory   - History warnings</pre>");
				} else {
					log("Invalid command syntax", 1);
					log("Usage:\n<pre>/notif [notif name] [on|off]\n       all          [on|off]\n       list</pre>");
				}
				break;
			case 3:
				if (argv[1] !== "grab" && argv[1] !== "joinleave" && argv[1] !== "songinfo" && argv[1] !== "history" && argv[1] !== "all") {
					log("Notification \"" + argv[1] + "\" does not exist, use <pre>/notif&nbsp;list</pre> for a list of all current notifications.", 1);
				} else if (argv[2] !== "on" && argv[2] !== "off") {
					log("Cannot set notification to \"" + argv[2] + "\". Use either \"on\" or \"off\".", 1);
				} else {
					if (argv[1] === "all") {
						for (i in ppSaved.notif) {
							ppSaved.notif[i] = argv[2] === "on";
						}
					} else {
						ppSaved.notif[argv[1]] = argv[2] === "on";
					}
					log("Turned " + argv[1] + " notifications " + argv[2]);
				}
				break;
			default:
				log("Invalid amount of arguments.\nUsage:\n<pre>/notif [notif name] [on|off]\n       all          [on|off]\n       list</pre>", 1);
				break;
			}
		},
		"perm"	:	0,
		"doc"	:	"Enable or disable notifications.",
		"detailed":	"Enable or disable notifications.\nUsage:\n<pre>/notif [notif name] [on|off]\n       all          [on|off]\n       list</pre>"
		},
	"inline" : {on : function () {ppSaved.inline = !ppSaved.inline; log("Turned inline images o" + (ppSaved.inline ? "n" : "ff")); },
		"perm"	:	0,
		"doc"	:	"Toggle inline images.",
		"detailed":	"Toggle inline images."
		},
	};
if (window.didInit) {
	log("Detected an instance of the script running already. Recommended to refresh.", 1);
	init(); // Doesn't hurt
	throw new ReferenceError("Already running an instance of the script, recommended to refresh.");
}
API.on(API.CHAT, function (a) {
	console.log("[" + a.room + ":" + a.chatID + "] " + a.from + " " + a.message.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&#34;/g, "\"").replace(/&#59;/g, ";").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
	chatted(a);
});
API.on(API.CHAT_COMMAND, function (a) {
	console.log("CHAT_COMMAND: ", a);
	command(a);
});
API.on(API.CURATE_UPDATE, function (a) {
	var e = API.getMedia();
	if (ppSaved.notif.grab) log("<span style=\"color:#DD2\">" + a.user.username.replace(/</g, "&lt;") + " added " + e.author.replace(/</g, "&lt;") + " - " + e.title.replace(/</g, "&lt;") + "</span>");
});
API.on(API.DJ_ADVANCE, function (a) {
	console.log("DJ_ADVANCE", a);
	canSkip = false;
	CSDelay = setTimeout(function () { canSkip = true; }, 2000);
	statUp("play", a.dj.id);
	djAdvanced(a);
});
API.on(API.DJ_UPDATE, function (a) {
	//console.log("DJ_UPDATE", a);
});
API.on(API.FAN_JOIN, function (a) {});
API.on(API.FRIEND_JOIN, function (a) {});
API.on(API.HISTORY_UPDATE, function (a) {
	//console.log("HISTORY_UPDATE", a);
});
API.on(API.MOD_SKIP, function (a) {
	console.log(a.replace(/</g, "&lt;") + " skipped the current DJ.");
});
API.on(API.ROOM_SCORE_UPDATE, function (a) {
	//console.log("ROOM_SCORE_UPDATE", a);
});
API.on(API.USER_FAN, function (a) {
	console.log(a.username.replace(/</g, "&lt;") + " is now your fan.");
});
_$context.on("user:join", function (a) {
	//userJoined(a);
	var r = a.attributes.relationship;
	a = a.attributes;
	if (ppSaved.notif.joinleave) log("<span style=\"color:#2D2;\">" + (r === 0 ? "" : r === 1 ? "Your fan, " : "Your friend, ") + a.username.replace(/</g, "&lt;") + " joined the room.</span>");
	initUser(a.id);
	statUp("join", a.id);
});
API.on(API.USER_LEAVE, function (a) {
	//userLeft(a);
	if (ppSaved.notif.joinleave) log("<spam style=\"color:#D22;\">" + a.username.replace(/</g, "&lt;") + " left the room.</spam>");
});
API.on(API.USER_SKIP, function (a) {
	console.log(a.replace(/</g, "&lt;") + " decided to skip.");
});
API.on(API.VOTE_SKIP, function (a) {
	console.log("VOTE_SKIP", a);
});
API.on(API.VOTE_UPDATE, function (a) {
	switch (a.vote) {
	case -1:
		if (a.user.id !== API.getUser().id) {
			//log((a.user.id === API.getUser().id ? "You" : a.user.username) + " mehed!", 1);
			log(a.user.username + " mehed!", 1);
		}
		statUp("meh", a.user.id);
		break;
	case 1:
		statUp("woot", a.user.id);
		break;
	}
});
API.on(API.WAIT_LIST_UPDATE, function (a) {
	//console.log("WAIT_LIST_UPDATE", a);
	if (get("cycle")) {
		if (cycleEnabled()) {
			if (a.length >= get("cycleDisable")) { cycleToggle(); }
		} else {
			if (a.length <= get("cycleEnable")) { cycleToggle(); }
		}
	}
});

if (!localStorage.hasOwnProperty("PlugPlug")) {
	ppSaved	= {
		"autowoot"		: true,
		"autojoin"		: false,
		"automehed"		: {},// media.id: reason
		"automuted"		: [],// [media.id, ...]
		"lastVersion"	: version,
		"stats"			: {},
		"user2ID"		: {},// username: [ID1, ID2]
		"chatBan"		: [],// [/text1/, ...] (toString()ed cause cannot store regExps directly)
		"notif"			: {
			"joinleave"	: true,
			"history"	: true,
			"songinfo"	: true,
			"grab"		: true
		},
		"inline"		: true
	};
	save();
} else {
	load();
	if (get("autowoot") === undefined) {set("autowoot", true); }
	if (get("autojoin") === undefined) {set("autojoin", false); }
	if (get("automehed") === undefined) {set("automehed", {}); }
	if (get("automuted") === undefined) {set("automuted", []); }
	if (get("stats") === undefined) {set("stats", {}); }
	if (get("user2ID") === undefined) {set("user2ID", {}); }
	if (get("chatBan") === undefined) {set("chatBan", []); }
	if (get("notif") === undefined) {
		set("notif", {
			"joinleave"	: true,
			"history"	: true,
			"songinfo"	: true,
			"grab"		: true
		});
	}
	if (get("inline") === undefined) {set("inline", true)}
	save();
}

/*API.on(API.CHAT, function (e) {
	/!(countdown|event)/.test(e.message) && API.sendChat("@" + e.from + " - The event start" +
		(function (e) {
			if (e < 0) {
				return "s in: " + ~~(-e / 3600000) + ":" + ("0" + ~~(-e / 60000) % 60).slice(-2) + ":" + ("0" + ~~(-e / 1000) % 60).slice(-2);
			} else {
				return "ed " + (e > 3600000 ? ~~(e / 3600000) + ":" : "") + ("0" + ~~(e / 60000) % 60).slice(-2) + ":" + ("0" + ~~(e / 1000) % 60).slice(-2) + " ago";
			}
		}(Date.now() - new Date("2014-03-22T19:00:00.000Z"))));
});*/

(function (a) {
	var b = a.callback;
	a.callback = function (a) {
		var c = (function (a) {return a.scrollTop + a.clientHeight === a.scrollHeight; }($("#chat-messages")[0])) ? ' onload="$(\'#chat-messages\')[0].scrollTop = 1e9;"' : "";
		if (ppSaved.inline) {
			a.text = a.text.replace(/((?:#|0x)((?:[\da-f]{3}){1,2})\b)/ig, '<span style="color:#$2;">$1</span>')
						   .replace(/(rgb\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)|rgba\(\s*(?:\d{1,3}\s*,\s*){3}\d{1,3}\s*\))/, '<span style="color:$1">$1</span>')
						   .replace(/<a href="((?:https?:\/\/)?prntscr.com\/.+?)(?:\/direct\/?)?" target="_blank">\1<\/a>/g, '<a href="$1" target="_blank"><img src="$1/direct" style="max-width:95%"' + c + '/></a>')
						   .replace(/<a href="(https?:\/\/.*?(:?\.png|\.gif|\.jpe?g)(\?.*)?(#.*)?)" target="(?:_blank|_self)">\1<\/a>/g, '<a href="$1" target="_blank"><img src="$1" style="max-width:95%"' + c + '/></a>');
		}
		b.apply(this, [a]);
	}
}(_$context._events["chat:receive"][0]));

setInterval(function () {
	isMuted = !API.getVolume();
	if (!isMuted) {
		artMute = isMuted = false;
	}
	if (!artMute) {
		lastVol = API.getVolume();
	}
}, 5000);
setInterval(save, 60000); // Autosave every minute
setInterval(reset, 2000);

init();