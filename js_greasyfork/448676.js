// ==UserScript==
// @name        TS-Mod + Backroud
// @version     1.1.90
// @description	Evades.io TS script.
// @author      Script by: DepressionOwU (🎀Depression🎀#5556), Most (begining) ideas: Piger (Piger#2917).
// @match       https://evades.io/*
// @match       https://evades.online/*
// @match       https://eu.evades.io/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/941435
// @downloadURL https://update.greasyfork.org/scripts/448676/TS-Mod%20%2B%20Backroud.user.js
// @updateURL https://update.greasyfork.org/scripts/448676/TS-Mod%20%2B%20Backroud.meta.js
// ==/UserScript==


globalThis.temp1 = undefined;
globalThis.temp2 = undefined;
globalThis.temp3 = undefined;
globalThis.CANR = true;

console.log("%c IMPORTANT! \nIF THERE IS NO 'Script loaded.' TEXT, YOU PROBABLY HAVE MORE THAT 1 SCRIPT ENABLED THAT CONFLICTS. PLEASE TURN OF THE SCRIPTS YOU DONT NEED.","color: red; font-size: 20px; background: black;border-radius:10px;");
console.log("%cScript loading... ","color: green; font-size: 20px");
console.groupCollapsed("what happened between loading")
console.log("...")
window.customTags = [
	{
		names: [],
		color: "#FFA390",
		text: "[TW]",
		rainbow: false,
		prior:0,
		lock:false,
	},
	{
		names: ["DepressionOwU"],
		color: "#767676",
		text: "[",
		rainbow: false,
		join: true,
		prior:1,
		lock:false,
	},
	{
		names: ["DepressionOwU"],
		color: "#ff0000",
		text: "S",
		rainbow: false,
		join: true,
		prior:2,
		lock:false,
	},
	{
		names: ["DepressionOwU"],
		color: "#00ff14",
		text: "C",
		rainbow: false,
		join: true,
		prior:3,
		lock:false,
	},
	{
		names: ["DepressionOwU"],
		color: "#0095ff",
		text: "R",
		rainbow: false,
		join: true,
		prior:4,
		lock:false,
	},
	{
		names: ["DepressionOwU"],
		color: "#767676",
		text: "]",
		rainbow: false,
		prior:5,
		lock:false,
	},
	{
		names: ["Gianni"],
		color: "#009b77",
		text: "[evader]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["Invi"],
		color: "#51dddd",
		text: "[Invi]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["LightY"],
		color: "#f19dba",
		text: "[litijo]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["Jayyyyyyyyyyyyyy", "GuеstZunolo"/*thats me, not jay lol*/],
		color: "#f00",
		text: "[Dep's BFF]",
		rainbow: true,
		prior:1,
		lock:false,
	},
	{
		names: ["R0YqL"],
		color: "#009b77",
		text: "[Roy]",
		rainbow: true,
		rglow:true,
		prior:1,
		lock:false,
	},
	{
		names: ["Pasemrus"],
		color: "#51dddd",
		text: "[Air]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["thiccsucc"],
		color: "#9D2005",
		text: "[THICC]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["L0YqL"],
		color: "#009b77",
		text: "[Loy]",
		rainbow: true,
		rglow:true,
		prior:1,
		lock:false,
	},
	{
		names: ["AWEN"],
		color: "#12e612",
		text: "[buster]",
		rainbow: true,
		rglow:true,
		prior:1,
		lock:false,
	},
	{
		names: ["NoAwen"],
		color: "#12e612",
		text: "[REALLY]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["Vikenti"],
		color: "#B026FF",
		text: "[wap cat]",
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["haha0201"],
		color: "#c01fed",
		text: "[h",
		join: true,
		rainbow: false,
		prior:1,
		lock:false,
	},
	{
		names: ["haha0201"],
		color: "#25e8be",
		text: "u]",
		rainbow: false,
		prior:2,
		lock:false,
	},
	{
		names: ["nosok"],
		color: "#25e8be",
		text: "🤡",
		rainbow: false,
		prior:1,
		lock:false,
	},
]

window.vers = {
	v: "1.1.88",
	cl:{
		ts:`#ad86d8`,
		to:`#6f8fd5`,
		jrm:`#f1c40f`,
		mod:`#e67e22`,
		sm:`#ff6b5b`,
		hm:`#f03333`,
		example: `#f99261`,
		cmd: `#aaa`,
		scriptmsg: `#ffceb7`,
		scripter: `#ff00bc`,
	},

	toVers:function(v){
		return `<b style="text-decoration: underline;" onclick="document.querySelector(\`[logid='${v}']\`).scrollIntoView()">${v}</b>`;
	},

	filllogp:function(){

		window.vers.changeLog = [
			{
				version:`1.1.88`,
				news:[
					`Fixed new heroes and maps displaying in the user card and logs`,
					[`New promotions for ${`[TO]`.fontcolor(this.cl.to)}:`,
						`${`[Mod]`.fontcolor(this.cl.mod)} Amasterclasher`,
						`${`[TS]`.fontcolor(this.cl.ts)} trevr`,
						`${`[TS]`.fontcolor(this.cl.ts)} Raqzv`,
					],

					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`Dreamz`,
						`4chan.org`,
						`Dinonuggy`,
						`BJG`
					],
					[
						`Twelfth custom tag:`,
						`${`[Mod]`.fontcolor(this.cl.mod)} 🤡 nosok`
					],
				],
			},
			{
				version:`1.1.87`,
				news:[
					`${`Glob`.fontcolor(`#14a300`)}, ${`Magon`.fontcolor(`#ff005d`)}, ${`Ignis`.fontcolor(`#cd501f`)} and`+
					` ${`Burning Bunker Hard`.fontcolor(`#e01b1b`)}, ${`Magnetic Monopole Hard`.fontcolor(`#bf00ff`)}, ${`Toxic Territory Hard`.fontcolor(`#5c5c5c`)}, ${`Restless Ridge Hard`.fontcolor(`#a88b64`)},`+
					` are now displayed properly in the user card and logs.`,

					[`New promotions for ${`[Mod]`.fontcolor(this.cl.mod)}:`,
						`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} Nickchm`,
						`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} nosok`,
						`Vikenti`
					],

					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`${`[Mod]`.fontcolor(this.cl.mod)} nosok`,
						`Jester`,
						`546000`
					]
				],
			},
			{
				version:`1.1.86`,
				news:[
					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`trevr`,
						'Ventinari',
						`Ashton94949`,
					]
				],
			},
			{
				version:`1.1.85`,
				news:[
					`Fixed the chat that was breaking the game.`,
					`Added a badge to Evades Olympics winners.`
				],
			},
			{
				version:`1.1.84`,
				news:[
					[`New promotion for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`CZheng`,
					],
					[`New command ${`#arealb`.fontcolor(this.cl.cmd)}.<br>`+
					`By using the command you will see a leaderboard in the chat in this format:<br>`+
					`Name ;; Level ;; XP ;; Hero<br>`+
					`You can sort it by typing ${`#arealb arg`.fontcolor(this.cl.cmd)} where arg is:`,
					`area`,
					`xp`,
					`hero`,
					`name`],
				],
			},
			{
				version:`1.1.83`,
				news:[
					[`New promotion for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`Lann`,
					],
					`Bug fixes.`,
				],
			},
			{
				version:`1.1.82`,
				news:[
					[
						`Eleventh custom tag:`,
						`${`[h`.fontcolor("#c01fed")}${`u]`.fontcolor("#25e8be")} haha0201`
					],
					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`Raqzv`,
					],
					[
						`Recolored custom tag:`,
						`<font class="rainbowText">[buster]</font> AWEN<br>`
					],
					`Bug fixes.`,
				],
			},
			{
				version:`1.1.81`,
				news:[
					`Removed ${`[TS]`.fontcolor(this.cl.ts)} from ThatHodgeGuy.`,
					[
						`Tenth custom tag:`,
						`${`[Capri-Sun]`.fontcolor("#B026FF")} Vikenti`
					],
					[
						`Recolored custom tags:`,
						`<font class="rainbowText">[Loy]</font> L0YqL<br>`
					],
					`Bug fixes.`,
				],
			},
			{
				version:`1.1.80`,
				news:[
					`In the profile page you can now see the users hats too!`,
					`3rd tab in the changelog - links. It contains some faq links and videoes.`,
					`Bug fixes.`,
				],
			},
			{
				version:`1.1.79`,
				news:[
					[`New promotions for ${`[TO]`.fontcolor(this.cl.to)}:`,
						`${`[TS]`.fontcolor(this.cl.ts)} nexxyst`,
					],
					`In the profile page you can now see the VP graph!<br>`+
					`${`<i>Actually something new?</i>`.fontcolor(this.cl.cmd)}`,

				],
			},
			{
				version:`1.1.78`,
				news:[
					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`๖ۣۜCorrupt 🆉`,
					],
				],
			},
			{
				version:`1.1.77`,
				news:[
					[`New promotion for ${`[Jr. Mod]`.fontcolor(this.cl.jrm)}:`,
						`${`[YouTuber]`.fontcolor("#2accac")} R0YqL`
					],
					[`New promotion for ${`[Mod]`.fontcolor(this.cl.mod)}:`,
						`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} LightY`
					],
					`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} Exscord got demoted.`,
				],
			},
			{
				version:`1.1.76`,
				news:[
					[`New promotions for ${`[Jr. Mod]`.fontcolor(this.cl.jrm)}:`,
						`nosok`,
						`${`[TO]`.fontcolor(this.cl.to)} DepressionOwU`,
						`${`[TO]`.fontcolor(this.cl.to)} Nickchm`,
						`${`[TS]`.fontcolor(this.cl.ts)} Zade`
					],
					`Congratulations to <br>${`[Sr. Mod]`.fontcolor(this.cl.sm)} Jackal with his promotion to ${`[H. Mod]`.fontcolor(this.cl.hm)}!`,
				],
			},
			{
				version:`1.1.75`,
				news:[
					[`New promotions for ${`[TS]`.fontcolor(this.cl.ts)}:`,
						`nexxyst`,
					],
					`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} Exscord is back.`,
				],
			},
			{
				version:`1.1.74`,
				news:[
					`fAtKiD got his ${`[TO]`.fontcolor(this.cl.to)} tag.`,
					`Removed ${`[TS]`.fontcolor(this.cl.ts)} from Ventinari.`
				],
			},
			{
				version:`1.1.73`,
				news:[
					[`New promotions for ${`[TO]`.fontcolor(this.cl.to)}:`,
						`${`[TS]`.fontcolor(this.cl.ts)} Nickchm`,
						`[BREAK POINT]`,
						`<i>fAtKiD became a ${`[TO]`.fontcolor(this.cl.to)} too but no tag for him.. yet..</i>`
					],
					`New command ${`#autodc`.fontcolor(this.cl.cmd)}, also added in to the R -> Commands.<br>`+
					`The command allows you to automatically disconnect on F5 / Ctrl + R instead of being supposed to type /dc in to the chat.`
				],
			},
			{
				version:`1.1.72`,
				news:[
					`Fixed leaderboard being thin when showing heroes is enabled.`,
					[`New promotion and demotions.`,
						`${`[Mod]`.fontcolor("#e67e22")} Pasemrus`,
						`${`<strike>[Jr. Mod]</strike>`.fontcolor(this.cl.jrm)} piger`,
						`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} AWEN`,
					],
				],
			},
			{
				version:`1.1.71`,
				news:[
					`Main menu now has a shortcut button to the leaderboard.`,
				],
			},
			{
				version:`1.1.70`,
				news:[
					`Removed ${`TO`.fontcolor(this.cl.to)} from CrEoP.`,
					[
						`New VP colors in the usercard:`,
						`${`### / Not found`.fontcolor(`#aaa`)}`,
						`${`0-74`.fontcolor(`#ff0000`)}`,
						`${`75-499`.fontcolor(`#00ff00`)}`,
						`${`500-19'999`.fontcolor(`#0095ff`)}`,
						`<font class="rainbowText">20'000 and more</font>`,
					],
				],
			},
			{
				version:`1.1.69`,
				news:[
					`A bugfix :/`
				],
			},
			{
				version:`1.1.68`,
				news:[
					`FPS and ping??<br>`+
					`${`<i>Note: fps is updating every second, Ping is updating when YOU send a message.</i>`.fontcolor(this.cl.cmd)}`,
					[
						`1 new command (# for help)`,
						`${`#togglefps`.fontcolor(this.cl.cmd)}`,
						`[BREAK POINT]`,
						`This command toggles ping and fps. It was also added to the ${`R -> Commands.`.fontcolor(this.cl.cmd)}`
					],
					`${`[TW]`.fontcolor(`#FFA390`)} tag is now remade to the new way too. It will now be possible to see someone like:<br>`+
					`${`[TO]`.fontcolor(this.cl.to)} ${`[TW]`.fontcolor(`#FFA390`)} ${`[Hu]`.fontcolor(`#2FA390`)} Cool Guy.`
				],
			},
			{
				version:`1.1.67`,
				news:[
					[
						`Tags are now done in a different way. Now there is an ability to have multiple tags.<br>`+
						`Some tags now:`,
						`${`[TS]`.fontcolor(this.cl.ts)} <font class="rainbowText">[Roy]</font> R0YqL`,
						`${`[TO]`.fontcolor(this.cl.to)} ${`[SCR]`.fontcolor(this.cl.scripter)} DepressionOwU`,
						`${`[TO]`.fontcolor(this.cl.to)} <font class="rainbowText">[Dep's BFF]</font> Jayyyyyyyyyyyyyy`,
						`[BREAK POINT]`,
						`${`<i>For people with custom tag scripts: The old tags are still supported.</i>`.fontcolor(this.cl.cmd)}`,
					],
					`The change logs are now a one-piece thing, editing the css wont make other stuff go off if you do it correctly.`
				],
			},
			{
				version:`1.1.66`,
				news:[
					[
						`New promotions for ${`[TO]`.fontcolor(this.cl.to)}:`,
						`${`[Jr. Mod]`.fontcolor(this.cl.jrm)} piger`,
						`${`[TS]`.fontcolor(this.cl.ts)} DepressionOwU`
					],
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `Lumaz`]
				],
			},
			{
				version:`1.1.65`,
				news:[
					`Removed ${`TS`.fontcolor(this.cl.ts)} from Creazy.`,
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `TimiT`, `Ventinari`]
				],
			},
			{
				version:`1.1.64`,
				news:[
					`Added a new permanent badge for the people who won in the olympics:`+
					`<br><br><image src="https://cdn.discordapp.com/attachments/617049086452957189/869889869827178516/olympics.png"></image>`,
					`The ${window.vers.toVers("1.1.63")} update now works with the ban commands too.`
				],
			},
			{
				version:`1.1.63`,
				news:[
					`For mods:<br>The mute command has more abilities now. The example of usage:<br><b>/mute <name> 1d 1s</b> - mutes for 1 day and 1 second<br>`+
					`available duration letters: <b>s, m, h, d, w,</b> (russian keys<b>, с, м, ч, д, н</b>).<br>`+
					`Note: you can use multiple same arguments e.g. <b>1s 1s 1h</b> will be the same as <b>2s 1h</b>.<br>`+
					`${`<i>It works only if the player is currently in the server.</i>`.fontcolor(this.cl.cmd)}`,
				],
			},
			{
				version:`1.1.62`,
				news:[
					[
						`Ninth custom tag:`,
						`${`[10$]`.fontcolor("#12e612")} AWEN`,
						`${`[REALLY]`.fontcolor("#12e612")} NoAwen`,
					]
				],
			},
			{
				version:`1.1.61`,
				news:[
					`In the Export/Import logs window when you click on the name a user card will appear instead of simpe logs.`,
					[
						`Eighth custom tags:`,
						`${`[Capri-Sun]`.fontcolor("#ff8700")} L0YqL`,
					],
					[
						`Recolored custom tags:`,
						`<font class="rainbowText">[Roy]</font> R0YqL<br>`,
						`${`[SCR]`.fontcolor(this.cl.scripter)} DepressionOwU`
					]
				],
			},
			{
				version:`1.1.60`,
				news:[
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `ElFeyer`],
				]
			},
			{
				version:`1.1.59`,
				news:[
					`Some bug fixes.`,
				]
			},
			{
				version:`1.1.58`,
				news:[
					`Some bug fixes.`,
					`${`[TW]`.fontcolor(`#FFA390`)} no longer shows in the leaderboard. ${`<i>Yes, that wasnt a feature.</i>`.fontcolor(this.cl.cmd)}`,
					[
						`new buttons in the R key window:`,
						`Team logger`,
						`Friends & Notes`
					],
					[`new ${`[TS]`.fontcolor(this.cl.ts)} and ${`[TO]`.fontcolor(this.cl.to)}:`,
					`${`[YouTuber]`.fontcolor("#2accac")} Strat`]
				]
			},
			{
				version:`1.1.57`,
				news:[
					`${`Burning Bunker`.fontcolor(`#e01b1b`)} is now displayed properly in logs.`,
					`In the usercard you can left-click on the users name and a window will appear.<br>`+
					`In the window you can mark the user as a friend (${`[F]`.fontcolor(`#0f0`)}) or put a warning (${`[!]`.fontcolor(`#f00`)}) that will appear in the leaderboard to the left of the users name.<br>`+
					`You can also leave a note on the user.`,
					`The R key now works in a different way. Too much to explain, just try it out.`,
					`Some fixes with the list of players with a role e.g. TS, TO, etc.`,
				]
			},
			{
				version:`1.1.56`,
				news:[
					`Bug fixes.`,
					`The ${window.vers.toVers("1.1.41")} update 1st part:<br>`+
					`The place where you need to sellect the team players now has a button <b>[A]</b><br>`+
					`The button toggles between 2 list. The 1st list is with the players who were in the area at the time the window got opened.<br>`+
					`The 2nd list shows all players that have been detected.`,
					`In the leaderboard you can now see ${`[M]`.fontcolor(`#e67e22`)} and ${`[D]`.fontcolor(`#3498db`)} tags. ${`[M]`.fontcolor(`#e67e22`)} is for moderators, ${`[D]`.fontcolor(`#3498db`)} is for developers`,
					[
						`1 new command (# for help)`,
						`${`#togglelbtags`.fontcolor(this.cl.cmd)}`,
						`[BREAK POINT]`,
						`This command toggles the tags in the leaderboard. The ${window.vers.toVers("1.1.52")} update is changed again.`
					],
					`The log of death in SS now shows the level instead of area.`,
					`More stuff for the custom commands.`,
				]
			},
			{
				version:`1.1.55`,
				news:[
					`Bug fixes.`,
					`Custom commands? Well.. You need to know how stuff works to make them...`,
					`The ${window.vers.toVers("1.1.52")} update is now changed a bit.<br>Check the <a style="color:${this.cl.cmd}" target="_blank" href="https://github.com/Neondertalec/tsmod#update-1152">[README.md]</a> and update it to the new way.`,
					`New tag ${`[TW]`.fontcolor(`#FFA390`)} is added. It will not require you to update the script when a tourney is over.`
				]
			},
			{
				version:`1.1.54`,
				news:[
					`Bug fixes.`
				]
			},
			{
				version:`1.1.53`,
				news:[
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `prepackagedsushi`],
				]
			},
			{
				version:`1.1.52`,
				news:[
					`Bug fixes.`,
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `Rxpct`, `Antony666`],
					[
						`Seventh custom tag:`,
						`${`[THICC]`.fontcolor("#9D2005")} thiccsucc`
					],
					`Local tag (chat) and prefix (ingame over the name #toggletag) support.<br><a style="color:${this.cl.cmd}" target="_blank" href="https://github.com/Neondertalec/tsmod#update-1152">[see this for details]</a>.`
				]
			},
			{
				version:`1.1.51`,
				news:[
					[
						`New promotions for ${`[Jr. Mod]`.fontcolor(this.cl.jrm)}:`,
						`${`[TS]`.fontcolor(this.cl.ts)} Exscord`,
					],
					[
						`Fourth, fifth and sixth custom tags:`,
						`${`[Roy]`.fontcolor("#009b77")} R0YqL`,
						`${`[Air]`.fontcolor("#51dddd")} Pasemrus`
					],
					`<font class="rainbowText">[Dep's BFF]</font> Jayyyyyyyyyyyyyy<br>`+
					`${`WaIt... It ChAnGeS CoLoRs?!`.fontcolor(this.cl.cmd)}`
				]
			},
			{
				version:`1.1.50`,
				news:[
					`Some css fixes.`,
					[
						`Second and Third custom tags:`,
						`${`[Invi]`.fontcolor("#51dddd")} Invi`,
						`${`[litijo]`.fontcolor(`#f19dba`)} LightY`
					],
				]
			},
			{
				version:`1.1.49`,
				news:[
					[`1 new command (# for help)`, `${`#toggletimer`.fontcolor(this.cl.cmd)}`],
					[
						`New promotions for ${`[Jr. Mod]`.fontcolor(this.cl.jrm)}:`,
						`${`[TS]`.fontcolor(this.cl.ts)} piger`,
						`${`[TS]`.fontcolor(this.cl.ts)} LightY`,
						`${`[TO]`.fontcolor(this.cl.to)} asdfasdfasdf1234`,
						`${`[TO]`.fontcolor(this.cl.to)} Pasemrus`,
						`${`[TO]`.fontcolor(this.cl.to)} thiccsucc`
					],
					[`First ever custom tag:`,`${`[evader]`.fontcolor(`#009b77`)} Gianni`],
				]
			},
			{
				version:`1.1.48`,
				news:[
					`GRB go woosh...`,
					`Removed ${`TS`.fontcolor(this.cl.ts)} from DEFA <i>${`(temporally)`.fontcolor(this.cl.cmd)}<i>.`,
				]
			},
			{
				version:`1.1.47`,
				news:[
					`Bug fixes`,
					[
						`the following keys now can accept a splitter argument:`,
						`${`{name}`.fontcolor(this.cl.cmd)}`,
						`${`{hero}`.fontcolor(this.cl.cmd)}`,
						`${`{hero num}`.fontcolor(this.cl.cmd)}`,
						`[BREAK POINT]`,
						`For example if you type ${`{name}`.fontcolor(this.cl.cmd)}, the splitter will be "+".<br>But if you type ${`{name &}`.fontcolor(this.cl.cmd)}, the splitter will be "&".`,
					]
				]
			},
			{
				version:`1.1.46`,
				news:[
					[
						`GRB Bug fixes:`,
						`The command doesn't lock upgrade buttons anymore.`,
						`When you turn GRB off you automatically stop.`,
					],
				]
			},
			{
				version:`1.1.45`,
				news:[
					`Bug fixes.`,
					`The hero displayed in the user card is now depending on the last log time you sellect analogically to the ${window.vers.toVers("1.1.44")} update.`,
					`Team result generation window in the format part now has buttons.<br>By clicking on a button the text of it will be added to the end of the format input.`
				]
			},
			{
				version:`1.1.44`,
				news:[
					`The hero in the result generator now depends on the last log time you sellect.<br>`+
					`That means: if a user rejoins the game with another hero and your last log for the generation is before the refresh log, `+
					`the log generator will give the hero, the player was before reconnecting.<br><b title="`+
					`log 1: join as Magmax\n`+
					`log 23: join as Necro\n`+
					`log 52: join as Shade\n`+
					`if last log sellected is 1-22 - Magmax\n`+
					`if last log sellected is 23-51 - Necro\n`+
					`if last log sellected is 52+ - Shade\n`+
					`" style="text-decoration: underline;">${`[Hoverable example]`.fontcolor(this.cl.example)}</b>`,
					`New log key for the team log generator: ${`{hero num}`.fontcolor(this.cl.cmd)}<br>Example: 1 Necro + 4 Chrono.`,
					[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `PotatoNuke`],
					//`Removed ${`TS`.fontcolor(`#ad86d8`)} from Creazy.`,
					`Some bug fixes.`,
					]
			},
			{
				version:`1.1.43`,
				news:[
					`Now you need to see a player just one time to know its vp instead of being suppost to be in the same area as the player.`,
					`Current result format is now clickable too.`,
					`"Show heroes" in settings now saves.`,
					`Leaderboard now shows "EU" or "NA" too.`,
					`When you open user log window it will be automatically scrolled down.<br>`+
					`If the window is fully scrolled down and a new log adds, it will automatically get scrolled.`,
				]
			},
			{
				version:`1.1.42`,
				news:[`Some bug fixes.`,
				[`1 new command (# for help)`, `${`#toggleusercard`.fontcolor(this.cl.cmd)}`],
				`Every <b>bold</b> text from the ${`[SCRIPT]`.fontcolor(this.cl.scriptmsg)} message is now acting as a button. Some buttons replace the text in the chat input and others add the text.`]
			},
			{
				version:`1.1.41`,
				news:[[`When you leftclick on the area on the leaderboard a window will show.<br>In the window you need to:`,
						`Sellect the players that were on that area when the popup was opened`,
						`Sellect log id's that you need. (a R button is there to update the list)`,
						`Set the format of the result (It saves), hover for the hint.`],
					`Areas in the leaderboard now have a number to the left of them that show the amount of players that are in it right now`,
					[`1 new command (# for help)`, `${`#toggleusers`.fontcolor(this.cl.cmd)}`]]
			},
			{
				version:`1.1.40`,
				news:[`Removed ${`TS`.fontcolor(this.cl.ts)} from prod1gy.`]
			},
			{
				version:`1.1.39`,
				news:[`${`Boldrock`.fontcolor(`#a18446`)} and ${`Assorted Alcove`.fontcolor(`#805b12`)} are now displayed properly in the user card and logs.`]
			},
			{
				version:`1.1.38`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `R0YqL`, `Nickchm`]]
			},
			{
				version:`1.1.37`,
				news:[
					`New Log type of ${`purple color`.fontcolor("#7b478e")} that shows when the user leaves or joins the server.`,
					`Some CSS fixes.`,
					`Bug fixes.`
				]
			},
			{
				version:`1.1.36`,
				news:[`Leaderboard now has a number to the right of it that shows the server you are in right now.`,
					[`2 new commands (# for help)`, `${`#format`.fontcolor(this.cl.cmd)}`, `${`#setformat`.fontcolor(this.cl.cmd)}`],
					`New button G in the user card.<br>By clicking on it you get the run of the user coppied in to your clipboard by the format setd by the commands above.`,
					`Some CSS fixes.`
				]
			},
			{
				version:`1.1.35`,
				news:[`Fixed a bug where you needed to change area to be able to rightclick on a player in the leaderboard.`]
			},
			{
				version:`1.1.34`,
				news:[[`Added piger's alt to ${`TS`.fontcolor(this.cl.ts)}:`, `1333333`]]
			},
			{
				version:`1.1.33`,
				news:[`Changelog!`, `Fixed a bug when you could get a gray screen at a random moment.`]
			},
			{
				version:`1.1.32`,
				news:[`Display current and new version if an update is available.`]
			},
			{
				version:`1.1.29`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `DEFA`]]
			},
			{
				version:`1.1.28`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `,DSG,`,`piger`]]
			},
			{
				version:`1.1.27`,
				news:[`GRB (Go Right Bot)<br>Added new command: ${`#grb`.fontcolor(this.cl.cmd)}.`]
			},
			{
				version:`1.1.26`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `prod1gy`, `Zade`]]
			},
			{
				version:`1.1.23`,
				news:[`Allowed heroes.<br>On hero click a popup will appear.<br>In the popup you can sellect heroes you want to see crossed in the user card.`]
			},
			{
				version:`1.1.22`,
				news:[`Removed ${`TS`.fontcolor(this.cl.ts)} from Priox.`]
			},
			{
				version:`1.1.21`,
				news:[`Made user cards and user logs dragable.`]
			},
			{
				version:`1.1.19`,
				news:[`Added 'BANNED' to user who are banned from tournaments.`]
			},
			{
				version:`1.1.15`,
				news:[`Removed ${`TS`.fontcolor(this.cl.ts)} from drippyk.`]
			},
			{
				version:`1.1.13`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `LightY`]]
			},
			{
				version:`1.1.12`,
				news:[`From now on the script will work all the time.`]
			},
			{
				version:`1.1.10`,
				news:[[`Added new ${`TS`.fontcolor(this.cl.ts)}:`, `Stryker123`], `Became a TS and made my tag ${`[TS&Scripter]`.fontcolor(this.cl.scripter)} instead of ${`[Scripter]`.fontcolor(this.cl.scripter)}.`]
			},
			{
				version:`1.1.2`,
				news:[`Updated user card.`, `Export/Import logs.`]
			},
		];

		window.vers.links = [
			{
				version: ["1", `<a href="https://github.com/Neondertalec/tsmod">Info</a>`],
				news:[
					`<a href="https://www.youtube.com/watch?v=XRXmW23zyWw&feature=youtu.be&ab_channel=itsme">How to install (18s video).</a>`,
					`<a href="https://www.youtube.com/watch?v=MA9A8OmK0Xo&ab_channel=PigerthePig">1.0.0 version video (by piger).</a>`,
					`Found a bug or someone is missing a tag? lmk:<br><i><b>${`🎀Depression🎀#5556`.fontcolor("#ff00ff")}</b></i>`,
				],
			},
			{
				version: ["1", `<a href="https://github.com/Neondertalec/tsmod/blob/main/faq.md">FAQ</a>`],
				news:[
					`<a href="https://github.com/Neondertalec/tsmod/blob/main/faq.md#how-to-install">How to install.</a>`,
					`<a href="https://github.com/Neondertalec/tsmod/blob/main/faq.md#how-to-update">How to update.</a>`,
					`<a href="https://github.com/Neondertalec/tsmod/blob/main/faq.md#script-doesnt-work">Something is wrong/not working?</a>`,
				],
			}
		];
	},
	getm: function(){
		var xm=new XMLHttpRequest();
		xm.open("GET","https://raw.githubusercontent.com/Neondertalec/tsmod/main/meta.json",false);
		xm.send();
		return JSON.parse(xm.response);
	},

	checkVer: function(v1, v2){
		[v1, v2] = [v1.split(".").map((v)=>parseInt(v)), v2.split(".").map((v)=>parseInt(v))]
		for(var i = 0; i < v1.length; i++){
			if(v1[i] < v2[i]){
				return true;
			}
		}
		return false;
	},

	check: function(){
		const d = this.getm();
		if(d.tw){
			let names = d.tw;

			globalThis.tags.tags["[TW]"] = names;
			globalThis.customTags[0].names = names;
		}

		if(this.checkVer(this.v,d.v)){
			const ver = document.createElement("div");
			ver.id = "version-warning";

			ver.innerHTML = `<div class="v-title">TS mod</div><br><div class="v-cv">Current version: </div><div>${this.v}</div><br><div class="v-nv">Latest version: </div><div>${d.v}</div>`;

			document.body.appendChild(ver);
		}
	},


	genLog: function(version, news){
		let id = version, ver = version;
		if(typeof version == "object"){
			id = version[0]; ver = version[1];
		}
		let newData =
		`<div class="changelog-section" logid="${id}">`+
			`<div class="changelog-section-header">`+
				`<span style="vertical-align: middle;">${ver}</span>`+
			`</div>`+
			`<ul class="changelog-change-list">`;

		for(let i = 0; i < news.length; i++){
			if(typeof news[i] == "string"){
				newData += `<li>${news[i]}</li>`
			}else{
				newData += `<li>${news[i][0]}`
				newData += `<ul>`;
				let brkd = -1;
				for(let j = 1; j < news[i].length; j++){
					if(news[i][j] === "[BREAK POINT]"){
						brkd = j+1;
						break;
					}
					newData += `<li>${news[i][j]}</li>`
				}
				if(brkd != -1){
					newData += `</ul>`
					for(let j = brkd; j < news[i].length; j++){
						newData += news[i][j];
					}
					newData += `</li>`
				}else{
					newData += `</ul></li>`
				}
			}
		}
		newData +=
			`</ul>`+
		`</div>`;

		return newData;
	},

	chlog:[null,null],
	swi: function(who){
		this.chlog[0] = document.querySelector(".changelog");
		this.chlog[1] = document.querySelector(".ts-changelog");
		this.chlog[2] = document.querySelector(".ts-links");

		if(this.chlog[1].innerHTML == ""){
			this.chlog[1].innerHTML = `<div class="changelog-header">TS Mod Changelog</div>`;
			const arr = window.vers.changeLog;
			for(let i = 0; i < arr.length; i++){
				this.chlog[1].innerHTML += window.vers.genLog(arr[i].version, arr[i].news);
			}
		}
		if(this.chlog[2].innerHTML == ""){
			this.chlog[2].innerHTML = `<div class="changelog-header">Links</div>`;
			const arr = window.vers.links;
			for(let i = 0; i < arr.length; i++){
				this.chlog[2].innerHTML += window.vers.genLog(arr[i].version, arr[i].news);
			}
		}

		if(!this.chlog[0])return void (console.warn(".changelog not found"));
		if(!this.chlog[1])return void (console.warn(".ts-changelog not found"));
		if(!this.chlog[2])return void (console.warn(".ts-links not found"));

		let l = ["ev", "ts", "li"]
		this.chlog.forEach((e,i)=>{
			if(who != l[i]){
				e.classList.contains("hidden")||
				e.classList.add("hidden")
			}else{
				e.classList.contains("hidden")&&
				e.classList.remove("hidden")
			}
		});
	}
	/*color: function(text, color){
		return `<aa style="${color}">${text}</aa>`;
	}*/
}
document.createElementP = function(name, args = null, fnc=null){
	const element = document.createElement(name)
	if(["input", "textarea"].includes(name))element.setAttribute("c-lock", "")
	if(args != null)Object.assign(element,args);
	if(fnc) fnc(element);
	return element;
}

window.vers.filllogp();

globalThis.CacheTs = class CacheTs{
	_data = {};

	setVal(key, val){
		return this._data[key] = val;
	}

	getVal(key, def = undefined){
		return this._data[key] ?? def;
	}

	delVal(key){
		if(key in this._data) delete this._data[key];
	}

	hasVal(key){
		return key in this._data;
	}
}

new MutationObserver(function (m){
	if(document.querySelector(".leaderboard-line.Central-Core-Dull")){
		window.updateLeaderboard();
		this.disconnect();
	}
}).observe(document, {childList: true, subtree: true});

window.blaclist = ["GuestRex", "TournamentPlox", "Wayward", "xxloki", "Zeratuone1", "papumpirulitoPD", "Creazy", "creæzy", "【𝟔𝟗】ᴄʀᴇᴀᴢʏ", "wre4th", "CrEaZy‏‏‎ ‎", "Strat", "Zwaze"];


try{
	var xm=new XMLHttpRequest();
	xm.open("GET","https://docs.google.com/document/d/1kk2PaGMxSIO7fnvF2PHL2rOiI7ApUMrI34evAaGdN8E/edit",false);
	xm.send();
	if(xm.response.length > 1000){
		let newArr = [];
		xm.response.slice(xm.response.indexOf("anned Players\\n\\n\\u0010\\u0012\\u001cPlayer"), xm.response.indexOf("\\n\\u0011")).replace(/\\u0012\\u001c/gm, "\n").replace(/\\n\\u001c/gm, "/n").split("\n").forEach((e,i)=>{if(i>1){newArr._d = 1;newArr.push(e.split("/n")[0])}})
		if(newArr._d){
			delete newArr._d
			window.blaclist = newArr;
		}
	}
}catch{}

globalThis.tagsEX = globalThis.tagsEX ?? {};
globalThis.tagDataEX = globalThis.tagsEX ?? {};

globalThis.tagsEX = {...globalThis.tagsEX,...{'[SCR]':['DepressionOwU'],}}
globalThis.tagDataEX = {...globalThis.tagDataEX,...{'[SCR]': {presudo:"[TO&Scripter]", color:"#ff00bc"},}};

globalThis.tags = {
	chatTags: new globalThis.CacheTs(),
	tags:{
		'[oly1]':['Pentagonis', 'R0YqL', 'Fauderix', 'AWEN', 'снегири', 'piger', 'Damasus', '⚝Simba⚝', 'Lumaz', 'Invi'],
		'[oly2]':['Ventinari', 'Nickchm', 'Strat', 'fAtKiD', 'koraiii', 'eagle45', 'PotatoNuke', 'Harmony556', 'Amasterclasher', 'Zade'],
		'[oly3]':['Vikenti', '546000', 'Defa', 'AWEN', 'DD1', '4chаn.org', 'tтеуmlI', 'R0YqL', 'Zxynn', 'nosok'],
		//'[oly4]':[],
		'[custom]': ['DepressionOwU', ...window.customTags.reduce(function(vv,ii){vv.push(...ii.names);return vv},[])],
		'[YT]':['R0YqL', 'Strat', 'mRDDanik', 'DD1'],
		'[ST]':['Zaxoosh'],
		'[SCR]':['DepressionOwU'],
		'[TS]': ['yIzaac😎👌',
			//'Creazy',
			'Aries', /*'goldy',*/ /*'drippyk',*/ /*'SANDWICH',*/ /*'Damasus'*/, '☺♣○•♣♥☻♦♠◘', 'Stryker123', /*'prod1gy',*/ 'Zade',
			'1Phoenix1',
			'DepressionOwU',
			/*'Exscord'*/,
			/*'piger',*/
			//'DEFA', 'ZaLo', 'notdefa',
			'R0YqL',
			'Nickchm',
			'Rxpct',
			'Antony666',
			'prepackagedsushi',
			'AWEN',
			'LightY',
			'PotatoNuke',
			'thiccsucc',
			'⚝Simba⚝',
			'Amasterclasher',
			'asdfasdfasdf1234',
			'Pasemrus',
			'Jayyyyyyyyyyyyyy',
			'Gazebr',
			'Zero〩',
			'Frenzy',
			'Mel',
			'Strat',
			'ElFeyer',
			//'TimiT',
			'Lumaz',
			'fAtKiD',
			'nexxyst',
			`Koraiii`,
			//`ThatHodgeGuy`,
			`๖ۣۜCorrupt 🆉`,
			`Asylum`,
			`Raqzv`,
			`ʕっ•ᴥ•ʔっ`,
			`Lann`,
			`CZheng`,
			`trevr`,
			'Ventinari',
			`Ashton94949`,
			`Jester`,
			`nosok`,
			`546000`,
			`Dreamz`,
			`4chan.org`,
			`Dinonuggy`,
			`BJG`,
		],
		'[TO]': ['Jayyyyyyyyyyyyyy', 'AWEN', 'Stov'/*awenalt*/, 'Invi', /*'asdfasdfasdf1234',*/ /*'Pasemrus',*/ /*'thiccsucc',*/ /*'Zero〩',*/ 'Gianni', /*'Darklight',*/ /*'Frenzy',*/ /*'Strat',*/ /*'piger',*/ 'DepressionOwU', /*'Nickchm',*/ /*'fAtKiD',*/ 'nexxyst', 'Raqzv', 'trevr', 'Amasterclasher'],
		'[Jr. Mod]': [/*'AWEN'*/, 'Gazebr', 'CrEoP', 'Ram', /*'piger',*/ /*'LightY'*/, 'asdfasdfasdf1234', /*'Exscord'*/, 'DepressionOwU','Zade', 'R0YqL'],
		'[Mod]': ['Invi','Amasterclasher', 'Mel', 'Gianni', 'Zero〩', '1Phoenix1', /*'Rc',*/ /*'Pasemrus',*/ /*'Frenzy',*/ /*'NxMarko',*/ 'Darklight','⚝Simba⚝', 'LightY', /*'thiccsucc',*/ 'Vikenti', 'nosok', /*'Nickchm'*/],
		'[Sr. Mod]': [],
		'[H. Mod]': ['Exoriz', 'extirpater', 'Jackal'],
		'[Dev]': ['Stovoy', 'MiceLee', 'DDBus']
	},
	alts:{
		"Creazy": ['Wre4th','CrEaZy','creæzy','【𝟔𝟗】ᴄʀᴇᴀᴢʏ'],
		"Exscord": [',DSG,', 'Дракончик)))'],
		"piger": ['noPiger'],
		"DEFA": ['ZaLo', 'notdefa'],
		"Zero〩": ['akane🦋'],
		"1Phoenix1": ['«Ƥħǿēƞɨx»'],
		"DDBus": ['TTTruck'],
		"ElFeyer": ['Teasah', '[ᴀᴄᴇ] Teasah'],
		"Ventinari":[/*'maxdebekker',*/ 'Crystal✓','Cjayy','Walkers'],
		"ThatHodgeGuy":['TurtlesRock'],
		"trevr":['away'],
		"Dreamz":['Quilt']
	},
	tagsData:{
		'[custom]':{
			priority:100,
			noOlnTag: true,
			badge:{
				bg:"#000",
				border:"#000",
				textcolor:"#000",
				text:"[Custom]",
				rainbow:true,
			},
		},
		'[TW]':{
			priority:50,
			noOlnTag: true,
			badge:{
				bg:"#ffa390",
				border:"#bd7869",
				textcolor:"#7d493f",
				text:"[TW]",
				rainbow:false,
			},
		},
		'[oly1]':{
			priority:60,
			noOlnTag: true,
			badge:{
				bg:"#cedf48",
				border:"#8e9a31",
				textcolor:"#484e1f",
				text:"[Olympic]",
				subText:"[1st season]",
				rainbow:false,
			},
		},
		'[oly2]':{
			priority:61,
			noOlnTag: true,
			badge:{
				bg:"#cedf48",
				border:"#8e9a31",
				textcolor:"#484e1f",
				text:"[Olympic]",
				subText:"[2nd season]",
				rainbow:false,
			},
		},
		'[oly3]':{
			priority:62,
			noOlnTag: true,
			badge:{
				bg:"#cedf48",
				border:"#8e9a31",
				textcolor:"#484e1f",
				text:"[Olympic]",
				subText:"[3rd season]",
				rainbow:false,
			},
		},
		'[oly4]':{
			priority:63,
			noOlnTag: true,
			badge:{
				bg:"#cedf48",
				border:"#8e9a31",
				textcolor:"#484e1f",
				text:"[Olympic]",
				subText:"[4th season]",
				rainbow:false,
			},
		},
		'[YT]': {
			priority:0,
			prefix:{
				color:"#2accac",
				text:"[YouTuber]",
			},
			badge:{
				bg:"#1abc9c",
				border:"#0a8a70",
				textcolor:"#044437",
				text:"[YouTube]",
				rainbow:false,
			},
		},
		'[ST]': {
			priority:11,
			prefix:{
				color:"#a258ea",
				text:"[Streamer]",
			},
			badge:{
				bg:"#9248da",
				border:"#6220a2",
				textcolor:"#2e0854",
				text:"[Stream]",
				rainbow:false,
			},
		},
		'[TS]': {
			priority:2,
			chat:{
				color:"#ad86d8",
				text:"[TS]",
				rainbow:false,
			},
			prefix:{
				color:"#ad86d8",
				text:"[TS]",
			},
			badge:{
				bg:"#ad86d8",
				border:"#7650a0",
				textcolor:"#470054",
				text:"[TS]",
				rainbow:false,
			},
		},
		'[TO]': {
			priority:3,
			chat:{
				color:"#6f8fd5",
				text:"[TO]",
				rainbow:false,
			},
			prefix:{
				color:"#6f8fd5",
				text:"[TO]",
			},
			badge:{
				bg:"#6f8fd5",
				border:"#2f5098",
				textcolor:"#203154",
				text:"[TO]",
				rainbow:false,
			},
		},
		'[Jr. Mod]': {
			priority:4,
			lb:{
				color:"#f1c40f",
				text:"[M]",
				rainbow:false,
			},
			prefix:{
				color:"#f1c40f",
				text:"[Junior Mod]",
			},
			badge:{
				bg:"#f1c40f",
				border:"#a28200",
				textcolor:"#655100",
				text:"[Jr. Mod]",
				rainbow:false,
			},
		},
		'[Mod]': {
			priority:5,
			lb:{
				color:"#e67e22",
				text:"[M]",
				rainbow:false,
			},
			prefix:{
				color:"#e67e22",
				text:"[Moderator]",
			},
			badge:{
				bg:"#e67e22",
				border:"#a75105",
				textcolor:"#6b3200",
				text:"[Mod]",
				rainbow:false,
			},
		},
		'[Sr. Mod]': {
			priority:6,
			lb:{
				color:"#ff6b5b",
				text:"[M]",
				rainbow:false,
			},
			prefix:{
				color:"#e74c3c",
				text:"[Senior Mod]",
			},
			badge:{
				bg:"#e05b49",
				border:"#a23e30",
				textcolor:"#611e17",
				text:"[Sr. Mod]",
				rainbow:false,
			},
		},
		'[H. Mod]': {
			priority:7,
			lb:{
				color:"#f03333",
				text:"[M]",
				rainbow:false,
			},
			prefix:{
				color:"#f03333",
				text:"[Head Mod]",
			},
			badge:{
				bg:"#f03333",
				border:"#961b1b",
				textcolor:"#6d0909",
				text:"[H. Mod]",
				rainbow:false,
			},
		},
		'[Dev]': {
			priority:8,
			lb:{
				color:"#3498db",
				text:"[D]",
				rainbow:false,
			},
			prefix:{
				color:"#3498db",
				text:"[Developer]",
			},
			badge:{
				bg:"#3498db",
				border:"#1a6394",
				textcolor:"#0e334c",
				text:"[Dev]",
				rainbow:false,
			},
		},
		'[SCR]': {
			priority:9,
			noOlnTag: true,
			cantH: true,
			badge:{
				bg:"#ff00bc",
				border:"#ab007e",
				textcolor:"#52003d",
				text:"[SCR]",
				rainbow:false,
			},
		},
		'[guest]': {
			priority:-1,
			noOlnTag: true,
			cantH: true,
			chat:{
				color:"#91b800",
				text:"[guest]",
				rainbow:false,
			},
		},
	},
	getUsersTags:function(name){
		let res = [];

		for(let rname in this.alts){
			if(this.alts[rname].includes(name)){
				name = rname;
				break;
			}
		}

		for(let key in this.tags){
			if(this.tags[key].includes(name))res.push(key);
		}
		res.sort((e1,e2)=>this.tagsData[e1].priority - this.tagsData[e2].priority);
		return res;
	},

	getUserHighestTagByType: function(utags, type){
		for(let t of utags.reverse()){
			if(!tags.tagsData[t].cantH && tags.tagsData[t][type]) return t;
		}
		return null
	},

	oldTags:{},
	calcOldTags:function(){
		console.log("started");
		this.oldTags = {};
		let allNames = []
		for(let key in this.tags){
			if(this.tagsData[key].noOlnTag)continue;
			allNames = [...allNames, ...this.tags[key]]
		}

		allNames = new Set(allNames);

		for(let name of allNames){
			let userHa = this.getUsersTags(name);
			userHa = this.getUserHighestTagByType(userHa, "prefix");
			if(!this.oldTags[userHa]) this.oldTags[userHa] = [];
			this.oldTags[userHa].push(name)
			if(this.alts[name]){
				this.oldTags[userHa] = [...this.oldTags[userHa], ...this.alts[name]]
			}
		}
		console.log("finished");
	},

	init:function(){
		this.calcOldTags();
	},

	getChatTag:function(c,e,l,i, name){
		if(this.chatTags.hasVal(name)){
			return this.chatTags.getVal(name);
		}else{
			let code = `e.default.createElement("span",null`;
			if(name.startsWith("Guest")){
				let tagData = window.tags.tagsData["[guest]"];
				code += `,e.default.createElement("span",{className:"${tagData.chat.rainbow?"rainbowText":""}", style:{color: "${tagData.chat.color}"}},"${tagData.chat.text}"," ")`
			}else{
				if(l) code += `,e.default.createElement("span",{className:i},l," ")`;

				let customs = [],lock = false;

				for(let tagdata of window.customTags){
					for(let tname of tagdata.names){
						if(tname == name){
							customs.push([tagdata, `,e.default.createElement("span",{className:"${tagdata.rainbow?("rainbowText" + (tagdata.rglow ? " rainbowTextGlow" : "")):""}", style:{color: "${tagdata.color}"}},"${tagdata.text}",${tagdata.join?`""` : `" "`})`]);
							if(tagdata.lock) lock = true;
							break;
						}
					}
				}
				customs = customs.sort((v1,v2)=>v1[0].prior - v2[0].prior)

				if(!lock) tagSearch: for(let tag in window.tags.tagsData){
					let tagData = window.tags.tagsData[tag];
					{//chat
						if(tagData.chat){
							for(let i in window.tags.oldTags[tag]){
								if(window.tags.oldTags[tag][i] == name){
									code += `,e.default.createElement("span",{className:"${tagData.chat.rainbow?"rainbowText":""}", style:{color: "${tagData.chat.color}"}},"${tagData.chat.text}"," ")`
									break tagSearch;
								}
							}
						}
					}
				}
				for(let str of customs)code += str[1];
			}
			code += `,c)`;
			return this.chatTags.setVal(name, code);
		}
	}
}
window.tags.init();

globalThis.profiler = {
	profilestats:null,
	lib: null,
	libl: false,
	hats: {
		"area-50": "/area-50.b6dc004f.png",
		"gold-crown": "/gold-crown.131786e0.png",
		"bronze-crown": "/bronze-crown.c9530af4.png",
		"silver-crown": "/silver-crown.ffa388d3.png",
		"halo": "/halo.cb0eb721.png",
		"santa-hat": "/santa-hat.8ff7f164.png",
		"gold-wreath": "/gold-wreath.92569ed3.png",
		"summer-wreath": "/summer-wreath.778ebaa8.png",
		"autumn-wreath": "/autumn-wreath.59c95666.png",
		"winter-wreath": "/winter-wreath.07f00139.png",
		"spring-wreath": "/spring-wreath.490fbc9e.png",
		"olympics-wreath": "/olympics-wreath.a8b838b7.png",

		"blue-flames": "/blue-flames.3beec8e5.png",
		"blue-santa-hat": "/blue-santa-hat.9e42565d.png",
		"flames": "/flames.b3703c82.png",
		"orbit-ring": "/orbit-ring.53e4adb3.png",
		"stars": "/stars.1958914c.png",
		"sticky-coat": "/sticky-coat.1412b8a0.png",
		"toxic-coat": "/toxic-coat.a27cd6c9.png",
	},
	graph: {
		el: null,
		graph:null,
	},
	setState:function(state){
		this.profilestats = state;
		setTimeout(()=>{
			this.loadHats();
		}, 100)
	},
	showGraph: function(){
		if(this.lib == null){
			this.lib = document.createElement("script");
			this.lib.src = "https://canvasjs.com/assets/script/canvasjs.min.js";
			document.head.appendChild(this.lib);
			console.log("lib added");
			this.lib.onload = ()=>{this.libl = true;this.displayGraph();console.log("l")}
		}
		if(!this.libl)return;
		this.displayGraph();
		console.log(this.profilestats);
	},
	displayGraph: function(){
		if(!this.libl)return;
		if(!this.graph.el){
			this.graph.el = document.createElementP("div", {className: "graphw"}, (e)=>{
				e.onclick = ()=>{
					this.hideGrapth();
				}
				e.innerHTML = `<div id="chartContainer" style="height: 370px; width: 80%;"></div>`;
				e.children[0].onclick = (e)=>{e.stopPropagation()};
				document.body.appendChild(e);
			});
		}

		if(this.graph.graph == null) this.createGraph();
		console.log("LOOK!")
		this.graph.graph.render();
	},
	hideGrapth: function(){
		if(this.graph.graph){
			this.graph.graph.destroy();
			this.graph.graph = null;
		}
		if(this.graph.el){
			this.graph.el.remove();
			this.graph.el = null;
		}
	},
	createGraph: function(){
		let loadedData = this.profilestats;

		let points = [];
        let cw = parseInt(document.querySelector(".profile-week-name").innerHTML.slice(5));
        let player = this.profilestats.username + ` (${this.profilestats.stats.highest_area_achieved_counter})`;
        let fd = [];
        for(let i in loadedData.stats.week_record){
            let cd = loadedData.stats.week_record[i];
            if(loadedData.stats.week_record[i]){
                let ii = parseInt(i);
                let nd = {
                    x:ii,
                    y: cd.wins,
                }

                if(!loadedData.stats.week_record[ii-1] && !fd.includes(ii-1)){

                    points.push({
                        x:ii-1,
                        y: 0,
                    })
                }

                if(cd.finish != null){
                    nd.markerType = "cross";
                    //nd.indexLabel = cd.finish;
                    nd.markerColor = cd.finish == "gold"? "gold" : cd.finish == "silver"? "gray" : "brown";
                }
                points.push(nd)

                if(!loadedData.stats.week_record[ii+1] && !fd.includes(ii+1) && ii < cw){
                    points.push({
                        x:ii+1,
                        y: 0,
                    })
                }
            }
        }

		this.graph.graph = new CanvasJS.Chart("chartContainer", {
            theme: "dark2",
            zoomEnabled: true,
            exportEnabled: true,
            backgroundColor: "#222",
            title:{
                text: "VP of " + player,
            },
            axisY:{
                tickColor: '#444',
                gridColor: "#444",
            },
            data: [{
                type: "line",
                color: "orange",
                indexLabelFontSize: 16,
                dataPoints: points
            }]
        });
	},
	loadHats: function(){
		let el = document.querySelector(".profile-hats-container");
		console.log(el);
		let hat = this.profilestats.accessories.hat_selection;
		let hats = this.profilestats.accessories.hat_collection;

		for(let i in hats){
			if(hats[i]){
				/*el.appendChild(document.createElementP("div", {className:`hat-accessory ${i==hat?"hat-accessory-selected":""}`},
					(e)=>{
						e.appendChild(document.createElementP("img", {src:this.hats[i]}))
					})
				);*/
				el.appendChild(
					document.createElementP("img", {src:this.hats[i], className : `profile-hat-accessory ${i==hat?"profile-hat-accessory-selected":""}`})
				);
			}
		}
	}
}

globalThis.getLocal = (key, def)=>{
	let res = localStorage.getItem(key)
	return res !== null? res : def;
}

window.secondsFormat = (time, m=true, t=0) =>{

	return	t === 1 ? `${m?(time/60>>0)+":":""}`+ `${time%60 < 10 ? "0" + (time%60) : time%60}` :
			`${m?(time/60>>0)+"m ":""}`+ `${time%60}s`
};

window.timeZero = 0;
window.getTime = ()=>{
	if(window.timeZero == 0){
		window.timeZero = Date.now();
		const vc = document.getElementById("version-warning");

		if(vc) vc.remove();

		let styles = document.createElement('style');
		styles.innerHTML = `body{overflow:hidden;}`;
		document.head.appendChild(styles);
	}

	return Math.floor((Date.now() - window.timeZero)/1000);//client.state.self.entity.survivalTime;
};

globalThis.client = {
	events:{
		events:{
			chatMessage:0,
			playerCountChange:1,
		},
		listners:{},
		/**
		 * @param {number} key
		 * @param {function()} fnc
		 */
		addEventListener:function(key, fnc){
			if(!this.listners[key]){
				this.listners[key] = [];
			}
			this.listners[key].push(fnc);
		},
		/**
		 * @param {number} key
		 * @param {function()} fnc
		 */
		removeEventListener:function(key, fnc){
			if(this.listners[key]){
				let index = this.listners[key].indexOf(fnc);
				if(index != -1) this.listners[key].splice(this.listners[key].indexOf(fnc),1);
			}
		},

		/**
		 * @param {number} key
		 * @param {object} data
		 */
		emit: function(key, data){
			if(this.listners[key]){
				this.listners[key].forEach((f)=>{f(data)});
			}
		},
	},

	state: undefined,
	main: undefined,

    elem:{
		level:null,
		speed:null,
		xp:null,
		hero:null,
		logsstor:null,
	},

	pingNfps:{
		ping:0,
		fps:0,
		sendTime:0,
		lastFpsTime:0,
		frames:0,

		frame: function(){
			this.frames++;
			let d, now = Date.now();
			if((d = now - this.lastFpsTime) > 1000){
				this.fps = Math.round(this.frames * (1000-(d % 1000)) * 0.001);
                this.frames = 0;
				this.lastFpsTime = now
			}
		}
	},

	areaData:{
		data:{},
		check: ()=>{
			if (!client.state)return;
			window.client.areaData.data = {};
			for (let i in client.state.globalEntities) {
				const user = client.state.globalEntities[i];
				window.client.areaData.addUser(user);
			}
			window.client.areaData.updateLb();
		},
		addUser: (user)=>{
			const data = window.client.areaData.data;
			if(user.regionName in data){
				data[user.regionName].users[user.name] = user;
				data[user.regionName].len ++;
			}else{
				data[user.regionName] = {users:{}, len:0};
				window.client.areaData.addUser(user);
			}
		},
		updateLb:()=>{
			for (let areas of [...document.getElementsByClassName('leaderboard-world-title')]) {
				let aname = areas.getAttribute("areaName");
				if(!aname){
					areas.setAttribute("areaName", aname = areas.innerText);
					areas.addEventListener("click", ()=>{
						window.client.areaData.openAreaPopup(false, aname);
					});
				}
				if(window.client.textCommandConsts.showUIACnt)areas.innerText = `${window.client.areaData.data[aname]?.len} ${aname}`;
				else areas.innerText = aname
			}
		},
		openAreaPopup:(closeOnly = false, areaName = "")=>{
			if(closeOnly){
				let bp = document.getElementById("areaData");
				if(bp) bp.remove();
				return true;
			}
			let area = window.client.areaData.data[areaName];
			if(!area) area = {users:{}, len:0};

			const backpan = document.createElement("div");
			backpan.style.position = "absolute";
			backpan.id = "areaData";
			backpan.style.width = "100%";
			backpan.style.height = "100%";
			backpan.style.top = "0";
			backpan.style.zIndex = "1002";

			backpan.addEventListener("click", ()=>{
				window.client.areaData.openAreaPopup(true);
			});

			document.body.appendChild(backpan);

			const popup = document.createElement("div");
			popup.className = "areaPopup";

			popup.addEventListener("click", (e)=>{
				e.stopPropagation();
			});

			let allObjs = [];
			let names = [];
			let all = 0;

			//{//sellect logs
				const popup_logs = document.createElement("div")
				popup_logs.className = "log_part";

				popup_logs.innerHTML = `<div class="theader">logs</div>`;

				const refreshButton = document.createElement("button");
				refreshButton.className = "refresh";
				refreshButton.innerHTML = "Refresh";
				refreshButton.style.width = "70px";
				popup_logs.children[0].appendChild(refreshButton);

				const popup_logs_scroll = document.createElement("div");
				popup_logs_scroll.className = "scoll_elem";

				const setLogs = ()=>{
					popup_logs_scroll.innerHTML = "";
					for(let i of allObjs){
						popup_logs_scroll.appendChild(window.client.createLogLine(i));
					}
				}
				popup_logs.appendChild(popup_logs_scroll);

				const startInput = document.createElement("input");
				const endInput = document.createElement("input");

				startInput.type = endInput.type = "number";

				popup_logs.appendChild(startInput);
				popup_logs.appendChild(endInput);
				startInput.setAttribute("c-lock","");
				endInput.setAttribute("c-lock","");
				//c-lock

			//}

			//{//result
				const popup_result = document.createElement("div")
				popup_result.className = "result_part";

				popup_result.innerHTML = `<div class="theader">Result</div>`;

				const popup_result_text = document.createElement("textarea");
				popup_result_text.className = "result_elem";
				popup_result_text.setAttribute("c-lock", "")
				popup_result_text.readOnly = true;

				const genResult = (p, regetArr = true)=>{

					if(regetArr){
						allObjs = [];
						names = [];
						p.querySelectorAll(".scoll_user.sellected").forEach((e)=>{
							let n = e.innerHTML.substring(1, e.innerHTML.length -1);
							let u = all == 2 ? window.client.userlog2[n] : window.client.userlog[n];
							if(u){
								names.push(n);
								allObjs = [...allObjs, ...u.deaths, ...u.travel];
							}
						})
						let index = 0;
						allObjs = allObjs.filter((a)=>a[2] == areaName).sort((a,b)=>a[0] - b[0]).map((l)=>(l[5] = ++index, l));
					}

					setLogs();
					if(allObjs.length == 0)return;


					const name = names.join(" + "),
					time = window.client.getTimeDiff("", parseInt(startInput.value), parseInt(endInput.value), null, allObjs),
					lastMapData = allObjs[time[4]],
					map = window.getShortName(lastMapData[2]),
					area = window.normalizeArea(lastMapData[3]),
					time1 = time[1],
					time2 = time[2];

					let hero = [];
					let heroes = [];
					let heroNum = [];

					let difherocnt = 0;
					for(let i = 0; i < names.length; i++){
						let nh = window.id2name(window.client.getUserHero(names[i], time[6]));
						if(!hero.includes(nh)) difherocnt++;
						hero.push(nh)
						let hnu = heroNum.find((v)=>v[0] == nh);
						if(hnu){
							hnu[1] ++;
						}else{
							heroNum.push([nh, 1])
						}
					}
					heroes = difherocnt == 1 ? hero[0] : hero;
					hero = difherocnt == 1 ? hero[0] : hero.join(" + ");

					const splres = window.client.splitArgKeys(window.client.teamFormat);
					let res = "```\n" + window.client.teamFormat;
					splres.forEach((r)=>{
						if(r.startsWith("name") && r.length > 4 && r[4] == " "){
							let arg = r.substring(5, r.length);
							res = res.replaceAll(`{${r}}`, names.join(` ${arg} `));
						}else
						if(r.startsWith("hero num") && r.length > 8 && r[8] == " "){
							let arg = r.substring(9, r.length);
							res = res.replaceAll(`{${r}}`, heroNum.reduce((v,v2)=>{v.push(v2[1] +" "+ v2[0]); return v}, []).join(` ${arg} `));
						}else
						if(r.startsWith("hero") && r != "hero num" && r.length > 4 && r[4] == " "){
							let arg = r.substring(5, r.length);
							res = res.replaceAll(`{${r}}`, heroes.join(` ${arg} `));
						}else{
							switch(r){
								case "name":
									res = res.replaceAll("{name}", name);
									break;
								case "map":
									res = res.replaceAll("{map}", map);
									break;
								case "area":
									res = res.replaceAll("{area}", area);
									break;
								case "time":
									res = res.replaceAll("{time}", time[0]);
									break;
								case "start time":
									res = res.replaceAll("{start time}", time1);
									break;
								case "end time":
									res = res.replaceAll("{end time}", time2);
									break;
								case "hero":
									res = res.replaceAll("{hero}", hero);
									break;
								case "hero num":
									res = res.replaceAll("{hero num}", heroNum.reduce((v,v2)=>{v.push(v2[1] +" "+ v2[0]); return v}, []).join(" + "));
									break;
							}
						}
					});
					res += "\n```";

					popup_result_text.innerHTML = res;

				}

				popup_result.appendChild(popup_result_text);
			//}

			//{//sellect users team
				const popup_users = document.createElement("div")
				popup_users.className = "users_part";

				popup_users.innerHTML = `<div class="theader">Users</div>`;


				const popup_users_scroll = document.createElement("div");
				popup_users_scroll.className = "scoll_elem";



				let fillusers=()=>{
					for(let i = popup_users_scroll.childNodes.length-1; i >= 0; i--){
						popup_users_scroll.childNodes[i].remove();
					}
					for(let user in all == 0 ? area.users: all == 1 ? window.client.userlog : window.client.userlog2){
				//for(let user in area.users){
					const userelem = document.createElement("div");
					userelem.className = "scoll_user";
					userelem.innerText = " "+user+" ";

					userelem.addEventListener("click", ()=>{
						if(userelem.classList.contains("sellected")){
							userelem.classList.remove("sellected");
						}else{
							userelem.classList.add("sellected");
						}
						genResult(popup_users_scroll);
					});


					popup_users_scroll.appendChild(userelem);
				}genResult(popup_users_scroll);}
				fillusers();

				const resetUsersButton = document.createElement("button");
				resetUsersButton.className = "refresh";
				resetUsersButton.innerHTML = "current";
				resetUsersButton.style.width = "70px";
				popup_users.childNodes[0].appendChild(resetUsersButton);
				resetUsersButton.addEventListener("click", ()=>{
					all = ++all%3;
					resetUsersButton.innerHTML = ["current", "all", "imported"][all];
					fillusers();
				});

				popup_users.appendChild(popup_users_scroll);
				startInput.addEventListener("input", ()=>{
					genResult(popup_users_scroll, false);
				});
				endInput.addEventListener("input", ()=>{
					genResult(popup_users_scroll, false);
				});
				refreshButton.addEventListener("click", ()=>{
					genResult(popup_users_scroll);
				})
			//}

			//{//set result format
				const popup_format = document.createElement("div")
				popup_format.className = "format_part";

				popup_format.innerHTML = `<div class="theader">Result format</div>`;

				const popup_format_input = document.createElement("input");
				popup_format_input.setAttribute("c-lock","");
				popup_format_input.id = "gresf-input";
				popup_format_input.className = "format_elem";
				popup_format_input.value = window.client.teamFormat;

				const oic = ()=>{
					localStorage.setItem("ts-resTFormat", window.client.teamFormat = popup_format_input.value);
					genResult(popup_users_scroll, false);
				}
				popup_format_input.addEventListener("input", oic)

				//sellect
				const popup_format_hint_input = document.createElement("div");
				popup_format_hint_input.className = "cmds_elem";

				const cmdf = (te)=>window.client.editChatInput(true, te, ` {${te}}`, "gresf-input", false)
				const si = ` class="cmd" title="`;

				popup_format_hint_input.innerHTML =
				`${cmdf("name").replace(" ", si+`Team players names e.g. player1 + player2 + player3."`)}`
				+`${cmdf("hero").replace(" ", si+`Team heroes e.g. magmax + magmax + shade. If all team is magmax, it will say magmax only 1 time."`)}`
				+`${cmdf("hero num").replace(" ", si+`Team heroes e.g. 2 magmax + 1 shade."`)}`
				+`${cmdf("map").replace(" ", si+`The name of the map."`)}`
				+`${cmdf("area").replace(" ", si+`The last log area."`)}`
				+`${cmdf("time").replace(" ", si+`The time from 1st to last log."`)}`
				+`${cmdf("start time").replace(" ", si+`The first log time."`)}`
				+`${cmdf("end time").replace(" ", si+`The last log time."`)}`;

				for(let i of popup_format_hint_input.children){
					let conc = i.onclick;
					i.onclick = ()=>{
						conc();
						oic();
					}
				}

				popup_format.appendChild(popup_format_hint_input);
				popup_format.appendChild(popup_format_input);
			//}

			popup.appendChild(popup_users);
			popup.appendChild(popup_logs);
			popup.appendChild(popup_format);
			popup.appendChild(popup_result);
			backpan.appendChild(popup);
		}
	},

	logTypesToShow:[0,1,2,3,4,5,6],

	freeze_time: +new Date(),
    opos:[null,null],
	userlog:{},
	userlog2:{},
	chat:null,
	teamFormat: getLocal("ts-resTFormat", "{name} ;; {map} {area} ;; {time} ;; (0/2)"),
	format: getLocal("ts-resFormat", "No format yet. Do #format for help"),
	allowedHeroes: JSON.parse(getLocal("ts-allowedHeroes", "[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]")),
	textCommandConstsE:[],
	textCommandConsts:{
		prefix: getLocal("ts-prefix", "#"),
		showTag: getLocal("ts-showTag", "false") == "true",
		bannedType: +getLocal("ts-bannedType", "0"),
		showUIACnt: getLocal("ts-showUIACnt", "false") == "true",
		showUcard: getLocal("ts-showUcard", "true") == "true",
		timerReal: (temp1 = getLocal("ts-timerReal", "1"), temp1 == "true" ? 1 : temp1 == "false"? 2 : +temp1),
		lbTags: getLocal("ts-lbTags", "true") == "true",
		togglefps: getLocal("ts-togglefps", "true") == "true",
		autodc: getLocal("ts-autodc", "false") == "true",
		//ssxp: getLocal("ts-ssxp", "false") == "true",

	},
	grb:{
		on: false,
		grbKey: 3,
		toggle: function(){
			const lt = window.getTag(window.client.main.name);
			if(lt=="")return 2;
			if(!(window.client.grb.on = !window.client.grb.on)){
				setTimeout(()=>{
					window.client.state.keys.keyUp(window.client.grb.grbKey);
				}, 75)
			}
		}
	},
	userMetas: JSON.parse(getLocal("ts-userMetas", "{}")),

	splitArgKeys:function(text, isTeam){
		const r = text.match(/\{(name|map|area|time|start time|end time|hero|hero num).*?\}/gm);
		if(r) return r.map((e)=>e.substring(1, e.length -1));
		return [];
	},

	genResult:function(name){
		let format = window.client.format;//"{name} ;; {map} {area} ;; {time} ;; (0/2)";
		let res, u = window.client.elem.logsstor[name];
		if(u){
			const list = [...u.travel, ...u.deaths].sort((a1,a2)=>{return a1[0]-a2[0]}),
			time = window.client.getTimeDiff(name, u.logids[0], u.logids[1]),
			hero = window.id2name(window.client.getUserHero(name, time[6])),//window.client.elem.hero.innerText,
			lastMapData = list[time[4]],
			map = window.getShortName(lastMapData[2]),
			area = window.normalizeArea(lastMapData[3]),
			time1 = time[1],
			time2 = time[2];

			const splres = window.client.splitArgKeys(format);
			res = "```\n" + format;
			splres.forEach((r)=>{
				switch(r){
					case "name":
						res = res.replaceAll("{name}", name);
						break;
					case "map":
						res = res.replaceAll("{map}", map);
						break;
					case "area":
						res = res.replaceAll("{area}", area);
						break;
					case "time":
						res = res.replaceAll("{time}", time[0]);
						break;
					case "start time":
						res = res.replaceAll("{start time}", time1);
						break;
					case "end time":
						res = res.replaceAll("{end time}", time2);
						break;
					case "hero":
						res = res.replaceAll("{hero}", hero);
						break;
				}
			});
			res += "\n```";
		}
		let sellector;
		if(!(sellector = document.getElementById("copy-sellector2"))){

			const cs = document.createElement("div");
			cs.innerHTML = `<input id="copy-sellector2" value="nop" style="position:absolute; left:-100%; width:10px; border:none;">`;
			document.body.appendChild(cs);
			sellector = cs.childNodes[0];
		}
		sellector.value = res;
		sellector.select();
		document.execCommand('copy');
	},

	toggleAllowedHeroe: function(nr){

		let f = (t)=>{
			if(window.client.elem.hero != null){
				if(window.client.elem.hero.innerText == window.id2name(nr)){
					if(t) window.client.elem.hero.className = "";
					else window.client.elem.hero.className = "blacklisted";
				}
			}
		}

		if(window.client.allowedHeroes.includes(nr)){
			window.client.allowedHeroes.splice(window.client.allowedHeroes.indexOf(nr), 1);
			f(false);
		}else{
			window.client.allowedHeroes.push(nr);
			f(true);
		}

		localStorage.setItem("ts-allowedHeroes", JSON.stringify(window.client.allowedHeroes));
	},

	toggleHeroList: function(hideOnly = false){
		const THELEM = document.querySelector(".herolist");
		if(THELEM){
			THELEM.parentNode.remove();
		}
		if(hideOnly){
			return;
		}
		const backpan = document.createElement("div");
		backpan.style.position = "absolute";
		backpan.style.width = "100%";
		backpan.style.height = "100%";
		backpan.style.top = "0";

		backpan.addEventListener("click", ()=>{
			window.client.toggleHeroList(true);
		});

		document.body.appendChild(backpan);

		const popup = document.createElement("div");
		popup.className = "herolist";

		popup.addEventListener("click", (e)=>{
			e.stopPropagation();
		});

		for(let i = 0; i < 24; i++){
			let hero = window.id2name(i);
			let color = window.getHeroRealColor(hero);
			const block = document.createElement("div");
			block.className = `block asnr${i}`;

			block.innerHTML +=
			`<div class="hero" style="background-color: ${color}"></div>`+
			`<div class="text" style="color: ${color}">${hero}</div>`
			;

			if(window.client.allowedHeroes.includes(i)) block.style.backgroundColor = "#000";
			else block.style.backgroundColor = "#330000";
			block.addEventListener("click", ()=>{
				window.client.toggleAllowedHeroe(i);
				if(window.client.allowedHeroes.includes(i)) block.style.backgroundColor = "#000";
				else block.style.backgroundColor = "#330000";
			});
			popup.appendChild(block);
		}

		backpan.appendChild(popup);
	},

	ucardCssElem: null,
	toggleUcard: function(on){
		if(on){
			if(!window.client.ucardCssElem){
				window.client.ucardCssElem = document.createElement("style");
				document.head.appendChild(window.client.ucardCssElem);
			}
			window.client.ucardCssElem.innerHTML =
			`#leaderboard +
			.player-contextmenu{
				display:none!important;
			}`
		}else{
			if(!window.client.ucardCssElem){
				window.client.ucardCssElem = document.createElement("style");
				document.head.appendChild(window.client.ucardCssElem);
			}
			window.client.ucardCssElem.innerHTML =
			`.chat-message-contextmenu.fake{
				display:none!important;
			}
			`
		}
	},

	openUcard: function(namee, pos, logs){
		if(window.client.textCommandConsts.showUcard){
			let HeroT, Hero, Level, Name, targetName;
			window.z = targetName = namee;
			if (client.state) {
				for (let i in client.state.globalEntities) {
					const element = client.state.globalEntities[i];

					//targetName = getAttrInParents(event.target,"ariaLabel");

					if (element.name == targetName) {
						//window.z = element.name;
						HeroT = element.heroType;
						Hero = window.id2name(HeroT);
						Level = element.level;
						Name = element.name;
						break;
					}
				}
			} else {
				Hero = "undefined"
				Name = "undefined"
			}

			client.count = 1;

			const name = targetName;

			let o = null;
			if(client.state)for(var i in client.state.entities){
				let obj = client.state.entities[i]
				if(obj.name == window.z){
					o = obj;//experience
					break;
				}
			}
			window.client.elem.logsstor = logs;
			window.client.hideLogs();
			window.removeFakes();
			const elem = document.createElement("div");
			elem.className = "chat-message-contextmenu fake";
			elem.style = `top: ${pos[1]}px; right: ${pos[0]+"px"}; ${(window.client.textCommandConsts.bannedType == 1 && window.blaclist.includes(name)) ? "height:326px!important;" : ""}`;
			elem.id = "elem-"+name
			elem.setAttribute("realname", name);
			const vpcolor = window.getVpColor(o?.winCount ? o.winCount : logs[name].vp);
			elem.innerHTML =
			`<aa class="banned-text${window.client.textCommandConsts.bannedType}" style="${!window.blaclist.includes(name) ? 'display: none!important;' : ''}">BANNED</aa>`+
			`<button id="log"class="bbtn"onClick="window.client.showLog('${name}', ${pos[1]}, window.client.openLogger(false))"title="Open logs popup.">L</button>`+
			`<button id="add"class="bbtn"onClick="window.client.customLog('${name}')"title="Add a custom (special) log.">+</button>`+
			`<button id="gen"class="bbtn"onClick="window.client.genResult('${name}')"title="Generate the runs data.">G</button>`+
			`<button id="reset"class="bbtn"onClick="window.client.resetAreaLog('${name}')"title="Reset the log that shows when the user entered the game area.">R</button>`+
			`<button id="close"class="bbtn"onClick="window.client.hideLogs();this.parentNode.remove()"title="Close the popup.">X</button>`+
			`<div id="name"class="chat-message-contextmenu-header" style="text-align:center;margin-top: 30px;">${name}</div>`+
			`<ul style="display: table-cell;">`+
				`<li style="display: table-cell;">`+
					`<a href="/profile/${name}" target="_blank">Profile</a>`+
					`<p>Hero: <b id="c4" class="${window.client.allowedHeroes.includes(HeroT)? '' : 'blacklisted'}" style="color:${window.getHeroColor(Hero)};text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 0 #000;font-size: larger; margin-bottom:0;">${Hero}</b></p>`+
					`<p id="c0">VP: <b ${vpcolor == "rainbow" ? `class="rainbowText" style="` : `style="color:${vpcolor};`}text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 0 #000;font-size: larger; margin-top:0;">${o != null ? o.winCount: (logs[name].vp !== undefined ? logs[name].vp : "###") }</b></p>`+
					`<p id="c1">Level: ${Level || -1}</p>`+
					`<p id="c2">Speed: ${-1}</p>`+
					`<p id="c3">XP: ${o != null ? o.experience: "not in same area" }</p>`+
					`<div id="timecounter">`+
					`<input c-lock id="tc-from" type="number" value="${window.client.getUserLogIds(name)[0]}" title="Users log id to start time counting from.">`+
					`<input c-lock id="tc-to" type="number" value="${window.client.getUserLogIds(name)[1]}"title="End time users log id.">`+
					`<p id="tc-result"></p>`+
					`</div>`+
				`</li>`+
			`</ul>`;
			if(document.getElementById('chat'))document.getElementById('chat').parentNode.parentNode.append(elem);
			else document.body.append(elem)
			window.client.elem.level = elem.querySelector("ul>li>p#c1");
			window.client.elem.speed = elem.querySelector("ul>li>p#c2");
			window.client.elem.xp = elem.querySelector("ul>li>p#c3");
			window.client.elem.hero = elem.querySelector("ul>li>p>b#c4");
			//window.client.refreshHeroOnUcard(name, ct2[0]);
			window.r = elem;
			elem.onClick = function(e) {
				return e.stopPropagation()
			}
			window.makeDragable(elem, [elem]);

			window.client.elem.hero.addEventListener("click", ()=>{
				window.client.toggleHeroList();
			});

			const removcl = (el)=>{
				el.addEventListener("click", (e)=>{
					e.stopPropagation();
				});
				el.addEventListener("mousedown", (e)=>{
					e.stopPropagation();
				});
			}

			removcl(window.client.elem.hero);
			let btns = elem.querySelectorAll("button");
			btns.forEach((btn)=>{
				removcl(btn);
			});

			const nameEmem = elem.querySelector("#name")
			nameEmem.addEventListener("mousedown", (e)=>{e.stopPropagation();});

			nameEmem.addEventListener("click", (e)=>{
				window.client.openUserMetas(getAttrInParents(e.target, "realname"));
				e.stopPropagation();
			});


			const el1 = elem.querySelector("ul>li>#timecounter>#tc-from");
			const el2 = elem.querySelector("ul>li>#timecounter>#tc-to");
			const el3 = elem.querySelector("ul>li>#timecounter>#tc-result");

			const f = ()=>{

				if(el3){
					window.client.getTimeDiff(name, el1.value, el2.value, el3);
				}
			}

			el1.addEventListener("input", f);
			el2.addEventListener("input", f);
			f();

			return false;
		}
	},

	toggleLbTagscsscode:"",
	toggleLbTagscsscodeElem: null,
	toggleLbTags:function(on){
		if(!window.client.toggleLbTagscsscodeElem){
			window.client.toggleLbTagscsscodeElem = document.createElement("style");
			document.head.appendChild(window.client.toggleLbTagscsscodeElem);
		}
		if(on) window.client.toggleLbTagscsscodeElem.innerHTML = window.client.toggleLbTagscsscode;
		else window.client.toggleLbTagscsscodeElem.innerHTML = "";
	},
	metascsscodeElem: null,
	recalcUserMetas: function(){
		if(!window.client.metascsscodeElem){
			window.client.metascsscodeElem = document.createElement("style");
			document.head.appendChild(window.client.metascsscodeElem);
		}
		let newiHtml = ``;

		let arr1=[],arr2=[];
		for(let i in window.client.userMetas){
			let data = window.client.userMetas[i];
			if(data.lbtag == "Friend")arr1.push('#leaderboard span[arialabel="'+i+'"]::before')
			else if(data.lbtag == "Warning")arr2.push('#leaderboard span[arialabel="'+i+'"]::before')
		}
		if(arr1.length > 0){
			newiHtml+=`
			${arr1.join(",")}{
				content: "[F]";
				margin-right: 4px;
				color: #00ff00;
				text-shadow: -1px -1px 5px #0000006e, 1px -1px 5px #0000006e, -1px 1px 20px #0000006e, 1px 1px 5px #0000006e;
			}
			`;
		}
		if(arr2.length > 0){
			newiHtml+=`
			${arr2.join(",")}{
				content: "[!]";
				margin-right: 4px;
				color: #ff0000;
				text-shadow: -1px -1px 5px #0000006e, 1px -1px 5px #0000006e, -1px 1px 20px #0000006e, 1px 1px 5px #0000006e;
			}
			`;
		}
		window.client.metascsscodeElem.innerHTML = newiHtml;
	},

	editChatInput: function(add, disptext, edittext, inputId = "chat-input", doStyle = true){
		let etext = edittext ? edittext : disptext;
		let newText =
		`<font ${doStyle? `style="font-weight:bold;"` : ""} onclick="let e = document.getElementById('${inputId}');e.focus();${add?`e.value+='${etext}'`:`e.value='${etext}'`};e">${disptext}</font>`;
		newText = newText.replaceAll("{prefix}", window.client.textCommandConsts.prefix);
		return newText;
	},

	/*toggleExtendLb: function(){
		globalThis.client.extendLb = globalThis.client.textCommandConsts.ssxp;// || smth
	},*/

	checkMsg: function(value){
		if(!value) return;
		let p = window.client.textCommandConsts.prefix;
		if(value.startsWith("#") || value.startsWith(p)){
			const messageS = value.split(" ");

			if(["#", p, p+"help"].includes(messageS[0])){
				let f = (t)=> `<font style="font-weight:bold;" onclick="let e = document.getElementById('chat-input');e.focus();e.value='${t}';e">${t}</font>`

				let sysText = `${p} is the prefix.<br>`+
				`${window.client.editChatInput(false, `{prefix}prefix`)} - set prefix.<br>`+
				`${window.client.editChatInput(false, `{prefix}toggletag`)} - switches ON/OFF.<br>`+
				`${window.client.editChatInput(false, `{prefix}togglelbtags`)} - changes the format of the generated run results.<br>`+
				`${window.client.editChatInput(false, `{prefix}toggleusers`)} - toggles users count on the leaderboard.<br>`+
				`${window.client.editChatInput(false, `{prefix}toggleusercard`)} - toggles users card on the leaderboard.<br>`+
				`${window.client.editChatInput(false, `{prefix}toggletimer`)} - changes the timer (if on - timer shows real time. if off - timer shows the time that will be shown on the death screen.).<br>`+
				`${window.client.editChatInput(false, `{prefix}togglefps`)} - toggles fps and ping.<br>`+
				`${window.client.editChatInput(false, `{prefix}banned`)} - change the way users banned from tournaments are shown.<br>`+
				`${window.getTag(window.client.main.name)!=""? `${window.client.editChatInput(false, `{prefix}grb`)} - toggle grb mode (if on - only D and arrow right works. type again to stop)${"<br>^Do not abuse this command.^".fontcolor("#d00")}<br>`:""}`+
				`${window.client.editChatInput(false, `{prefix}format`)} - shows the details of ${p}setformat.<br>`+
				`${window.client.editChatInput(false, `{prefix}setformat`)} - changes the format of the generated run results.<br>`+
				`${window.client.editChatInput(false, `{prefix}autodc`)} - toggle automatic disconnection on F5/CTRL+R.<br>`+
				`${window.client.editChatInput(false, `{prefix}arealb`)} - send a message (for you only) with a simple leaderboard<br>`;
				//`${window.client.editChatInput(false, `{prefix}ssxp`)} - toggle SS leaderboard between XP and Level.<br>`;

				if(window.client.textCommandConstsE.length > 0){
					sysText += `<br>CUSTOM COMMANDS<br><br>`;
					for(let cmd of window.client.textCommandConstsE){
						sysText += `${window.client.editChatInput(false, `{prefix}${cmd[1]}`)} - ${cmd[2]}<br>`;
					}
				}

				window.client.sendSystemMessage(sysText);
			}else
			if([p+"prefix"].includes(messageS[0])){//nd
				if(messageS[1]?.length > 0 && messageS[1] != "/"){
					localStorage.setItem("ts-prefix", window.client.textCommandConsts.prefix = messageS[1]);
					window.client.sendSystemMessage(`The prefix is changed from ${p} is to ${messageS[1]}`);
				}else{
					window.client.sendSystemMessage(`Prefix should contain atleast 1 character and cannot be a /`);
				}
			}else
			if([p+"toggletag"].includes(messageS[0])){
				localStorage.setItem("ts-showTag", window.client.textCommandConsts.showTag = !window.client.textCommandConsts.showTag);
				window.client.sendSystemMessage(`User tags are now turned ${["off","on"][+window.client.textCommandConsts.showTag]}`);
			}else
			if([p+"autodc"].includes(messageS[0])){
				localStorage.setItem("ts-autodc", window.client.textCommandConsts.autodc = !window.client.textCommandConsts.autodc);
				window.client.sendSystemMessage(`autodc is now turned ${["off","on"][+window.client.textCommandConsts.autodc]}`);
			}else
			/*if([p+"ssxp"].includes(messageS[0])){
				localStorage.setItem("ts-ssxp", window.client.textCommandConsts.ssxp = !window.client.textCommandConsts.ssxp);
				window.client.sendSystemMessage(`ssxp is now turned ${["off","on"][+window.client.textCommandConsts.ssxp]}`);
				window.client.toggleExtendLb();
			}else*/
			if([p+"togglelbtags"].includes(messageS[0])){
				localStorage.setItem("ts-lbTags", window.client.textCommandConsts.lbTags = !window.client.textCommandConsts.lbTags);
				window.client.toggleLbTags(window.client.textCommandConsts.lbTags);
				window.client.sendSystemMessage(`Leaderboard tags are now turned ${["off","on"][+window.client.textCommandConsts.lbTags]}`);
			}else
			/*if([p+"toggletimer"].includes(messageS[0])){//nd
				localStorage.setItem("ts-timerReal", window.client.textCommandConsts.timerReal = !window.client.textCommandConsts.timerReal);
				window.client.sendSystemMessage(`timer now shows ${["end screen time","real time"][+window.client.textCommandConsts.timerReal]}`);
			}else*/
			if([p+"toggleusers"].includes(messageS[0])){
				localStorage.setItem("ts-showUIACnt", window.client.textCommandConsts.showUIACnt = !window.client.textCommandConsts.showUIACnt);
				window.client.areaData.updateLb();
				window.client.sendSystemMessage(`User count is now turned ${["off","on"][+window.client.textCommandConsts.showUIACnt]}`);
			}else
			if([p+"toggleusercard"].includes(messageS[0])){
				localStorage.setItem("ts-showUcard", window.client.textCommandConsts.showUcard = !window.client.textCommandConsts.showUcard);
				window.client.toggleUcard(window.client.textCommandConsts.showUcard);
				window.client.sendSystemMessage(`User card is now turned ${["off","on"][+window.client.textCommandConsts.showUcard]}`);
			}else
			if([p+"togglefps"].includes(messageS[0])){
				localStorage.setItem("ts-togglefps", window.client.textCommandConsts.togglefps = !window.client.textCommandConsts.togglefps);
				window.client.sendSystemMessage(`User card is now turned ${["off","on"][+window.client.textCommandConsts.togglefps]}`);
			}else
			if([p+"banned"].includes(messageS[0])){
				if(messageS.length > 1){
					if(!isNaN(parseInt(messageS[1]))){
						localStorage.setItem("ts-bannedType", ""+(window.client.textCommandConsts.bannedType = +messageS[1]));
						window.client.sendSystemMessage(`Banned user show type is now ${window.client.textCommandConsts.bannedType}`);
						return false;
					}
				}
				window.client.sendSystemMessage(`Invalid input. Use a number from 0 to 1`);
			}else
			if([p+"grb"].includes(messageS[0])){
				let r = window.client.grb.toggle();
				window.client.sendSystemMessage(r != 2 ? `GRB is now turned ${["off","on"][window.client.grb.on ? 1 : 0]}` : `GRB is currently unavailable!`);
			}else
			if([p+"format"].includes(messageS[0])){
				let sf = window.client.editChatInput;
				let f = (t)=>sf(true,t,` {${t}}`);
				window.client.sendSystemMessage(
					`Keywords: ${f("name")}, ${f("map")}, ${f("area")}, ${f("time")}, ${f("start time")}, ${f("end time")}, ${f("hero")}.`+
					`<br>Working example:<br>${sf(false, `{prefix}setformat {name} ;; {map} {area} ;; {time}`)}<br>`+
					`current: ${sf(false,window.client.format, `{prefix}setformat ${window.client.format}`)}`
				);
			}else
			if([p+"setformat"].includes(messageS[0])){
				let newFromat = [...messageS];
				newFromat.splice(0, 1);
				newFromat = newFromat.join(" ");
				localStorage.setItem("ts-resFormat", window.client.format = newFromat);
				window.client.sendSystemMessage(`Newformat is setd to "${newFromat}"`);
			}else
			if([p+"arealb"].includes(messageS[0])){
				let sort = (e1, e2)=> 0;
				if(messageS[1] == "xp") sort = (e1, e2)=>e2.experience - e1.experience;
				if(messageS[1] == "area") sort = (e1, e2)=>e2.areaNumber - e1.areaNumber;
				if(messageS[1] == "name") sort = (e1, e2)=>e1.name > e2.name ? 1 : -1;
				if(messageS[1] == "hero") sort = (e1, e2)=>e1.heroType - e2.heroType;

				client.sendSystemMessage(`${globalThis.client.main.regionName} ${globalThis.client.main.areaName}<br>`+
				Object.values(globalThis.client.state.entities).filter(e=>e.entityType == 0)
				.sort(sort)
				.map(e=>`${e.name} ;; ${e.level} LVL ;; ${e.experience} XP ;; ${id2name(e.heroType)}`).join("<br>"))
			}
			else{

				if(window.client.textCommandConstsE.length > 0){
					for(let cmd of window.client.textCommandConstsE){
						if(p+cmd[1] == messageS[0]){
							cmd[3](cmd, value);
						}
					}
				}

			}
			return false;
		}
		return true;
	},

	checkMsgSend: function(value){
		if(!value) return value;

		let valueS = value.split(" ");
		if(["/mute", "/ipmute", "/ban", "/ipban"].includes(valueS[0])){
			let pref = valueS.splice(0, 1);
			let tempval = valueS.join(" ");
			let similarNames = [], theName = "";
			for(let i in client.state.globalEntities){
				if(tempval.startsWith(client.state.globalEntities[i].name + " ")){
					similarNames.push(client.state.globalEntities[i].name);
				}
			}
			if(similarNames.length == 0) return value;
			if(similarNames.length == 1){
				theName = similarNames[0];
			}else{
				theName = similarNames.sort((a,b)=>b.length - a.length)[0];
			}

			let times = tempval.substring(theName.length).split(" ");

			let resTime = 0;
			let passed = false;
			for(let timeD of times){
				let data = [+(timeD.substring(0,timeD.length-1)), timeD[timeD.length-1]];

				if(isNaN(data[0]))continue;
				switch(data[1]){
					case "с":
					case "s":
						resTime += data[0];
						passed = true;
						break;
					case "м":
					case "m":
						resTime += data[0] * 60;
						passed = true;
						break;
					case "ч":
					case "h":
						resTime += data[0] * 60 * 60;
						passed = true;
						break;
					case "д":
					case "d":
						resTime += data[0] * 60 * 60 * 24;
						passed = true;
						break;
					case "н":
					case "w":
						resTime += data[0] * 60 * 60 * 24 * 7;
						passed = true;
						break;
				}
			}
			if(!passed) return value;
			let end = "s";
			resTime = Math.round(resTime);
			if((resTime % 60) == 0 && resTime/60 != 0){
				resTime /= 60;
				end = "m";
			}
			if((resTime % 60) == 0 && resTime/60 != 0){
				resTime /= 60;
				end = "h";
			}
			if((resTime % 24) == 0 && resTime/24 != 0){
				resTime /= 24;
				end = "d";
			}
			return `${pref} ${theName} ${resTime}${end}`
		}
		window.client.pingNfps.sendTime = window.client.pingNfps.sendTime == 0 ? Date.now() : window.client.pingNfps.sendTime;
		return value;
	},

	sendSystemMessage: function(message = ""){
		let chat = window.client.chat?.parentNode ? window.client.chat : (window.client.chat = document.getElementById("chat-window"));
		if(chat){
			if(message != ""){
				chat.innerHTML = chat.innerHTML+
				`<div class="chat-message">`+
					`<span class="server-warning">`+
						`<span class="chat-message-sender" arialabel="[SCRIPT]">`+
							`[SCRIPT]`+
						`</span>`+
						`: ${message}`+
					`</span>`+
				`</div>`
			}
			chat.scrollTop = chat.scrollHeight;
		}
	},

	editLogType:function(input){
		if(input){
			const cname = input.className.split(" ").splice(1,1).join(" ");
			const nr = window.nrByStyle(cname);
			const key = window.client.logTypesToShow.findIndex((k) => {return k == nr})

			const f = (act)=>{
				document.querySelector(".log-popup").childNodes.forEach((el)=>{

					if(el.className == "ele " + cname){
						el.style.display = act ? "" : "none";
					}
				});
			}

			if(input.checked && key == -1){
				window.client.logTypesToShow.push(nr);
				f(true);
			}else
			if(!input.checked && key != -1){
				window.client.logTypesToShow.splice(key, 1);
				f(false);
			}

		}
	},

	resetAreaLog:function(name = ""){
		const u = window.client.userlog[name];
		if(u){
			u.exited = false;
		}
	},

	showLog:function(name = "", y = 0, deleted = false, dragable=true){
		let u = null;
		if(Object.keys(window.client.userlog2)?.length > 0){
			u = window.client.userlog2[name] ?? window.client.userlog[name];
		}else{
			u = window.client.userlog[name];
		}
		if(u){
			if(!document.getElementById("log-" + name) && !deleted){
				const elpos = document.querySelector(".chat-message-contextmenu.fake");
				let elposy = parseInt(elpos?.style?.top?.substring(0, elpos?.style?.top?.length-2));
				let elposx = parseInt(elpos?.style?.right?.substring(0, elpos?.style?.right?.length-2));
				elposy = isNaN(elposy) ? 0 : elposy;
				elposx = isNaN(elposx) ? 0 : elposx;
				const elem = document.createElement("div");
				elem.id = "log-" + name;
				elem.style.top = `${elposy}px`;
				elem.style.right = `${elposx + 230}px`;
				elem.className = "log-popup";
				//ele


				let list = [...u.travel, ...u.deaths].sort((a1,a2)=>{return a1[0]-a2[0]});

				for(var i = 0; i < list.length; i++){
					const line = document.createElement("div");
					line.style.display = window.client.logTypesToShow.includes(list[i][4]) ? "": "none";
					line.className = `ele ${window.styleByNr(list[i][4])}`;

					line.innerHTML = `<div id="logid">${list[i][5]}|</div><div id="time">${list[i][1]}</div><div id="map">${window.getShortName(list[i][2])}</div><div id="area">${window.normalizeArea(list[i][3])}</div>`

					elem.appendChild(line);
				}

				document.body.appendChild(elem);
				elem.scrollTop = elem.scrollHeight;

				const elem2 = document.createElement("div");
				elem2.id = "log-h-" + name;
				elem2.style.top = `${elposy}px`;
				elem2.style.right = `${elposx + 490}px`;
				elem2.className = "log-popup-extra";

				for(let i = 0; i < 7; i++){
					elem2.innerHTML += `<input type="checkbox" onclick="window.client.editLogType(this)" ${window.client.logTypesToShow.includes(i) ? "checked": ""} class="custombox ${window.styleByNr(i)}"></input>`;
				}

				document.body.appendChild(elem2);
				if(dragable) window.makeDragable(elem, [elem, elem2])
				return [elem, elem2];
			}else
			if(!deleted){
				document.getElementById("log-" + name).remove();
				document.getElementById("log-h-" + name).remove();
			}
		}
	},

	openUserMetas: function(name, closeonly = false, cb = null){
		const THELEM = document.querySelector(".usermetas");
		if(THELEM){
			globalThis.CANR = true;
			if(cb)cb();
			THELEM.parentNode.remove();
			return;
		}else
		if(!closeonly){
			globalThis.CANR = false;
			const res = window.client.userMetas[name]?{...window.client.userMetas[name]}:{
				lbtag:"",
				note:"",
			};
			const backpan = document.createElement("div");
			backpan.style.position = "absolute";
			backpan.style.width = "100%";
			backpan.style.height = "100%";
			backpan.style.top = "0";

			document.body.appendChild(backpan);

			const popup = document.createElement("div");
			popup.className = "usermetas";
			backpan.appendChild(popup);
			popup.addEventListener("click", (e)=>{
				e.stopPropagation();
			});

			const header = document.createElementP("div", {className:"header",innerText:name});
			popup.appendChild(header);

			const buttonsLay = document.createElement("div");
			buttonsLay.className = "buttonslay";
			popup.appendChild(buttonsLay);

			const currentState = document.createElementP("div",{className:"currentState",innerText:res.lbtag}),
			buttonFriend = document.createElementP("button",{className:"friend",innerText:"Friend"},(e)=>{
				e.addEventListener("click",()=>{
					currentState.className = "currentState " + (currentState.innerText = res.lbtag = res.lbtag == e.innerText? "" : e.innerText);
				})
			}),

			buttonWarning = document.createElementP("button",{className:"warning",innerText:"Warning"},(e)=>{
				e.addEventListener("click",()=>{
					currentState.className = "currentState " + (currentState.innerText = res.lbtag = res.lbtag == e.innerText? "" : e.innerText);				})
			});
			buttonsLay.appendChild(buttonFriend);
			buttonsLay.appendChild(currentState);
			buttonsLay.appendChild(buttonWarning);


			const noteLay = document.createElement("div");
			noteLay.className = "notelay";
			popup.appendChild(noteLay);

			const noteInput = document.createElementP("textarea",null,(e)=>{
				e.setAttribute("c-lock", "");
				e.value = res.note;
			});
			noteLay.appendChild(noteInput);

			const badgesLay = document.createElementP("div",{className:"badgeslay"},(e)=>{
				const rolesArr = window.tags.getUsersTags(name);
				for(let i of rolesArr){
					let tagData = window.tags.tagsData[i];
					if(tagData.badge){
						const badge = document.createElementP("div",{className:"badge",innerText:tagData.badge.text},(e)=>{
							e.setAttribute("badge", i);
						})
						e.appendChild(badge);
					}
				}
				if(e.childElementCount > 6){
					e.className = "badgeslay small";
				}
			});
			popup.appendChild(badgesLay);


			const buttonSave = document.createElementP("button",{id: "save", innerText:"Save"}, (e)=>{
				e.addEventListener("click", ()=>{
					res.note = noteInput.value;
					if(res.note == "" && res.lbtag == ""){
						if(name in window.client.userMetas)
						delete window.client.userMetas[name];
					}
					else
					window.client.userMetas[name] = res;
					localStorage.setItem("ts-userMetas", JSON.stringify(window.client.userMetas));
					window.client.recalcUserMetas();
					window.client.openUserMetas(name, true, cb);
				})
			});

			const buttonCancel = document.createElementP("button",{id: "cancel", innerText:"Cancel"}, (e)=>{
				e.addEventListener("click", ()=>{
					window.client.openUserMetas(name, true, cb);
				});
			});

			popup.appendChild(buttonSave);
			popup.appendChild(buttonCancel);
		}
	},

	timeDiffRes:[0, null],

	getTimeDiff:function(name = "", t1 = 0, t2 = 0, res = null, customData = null){
		const u = customData ? null : window.client.elem.logsstor[name];
		if(u || customData){
			if(!customData) u.logids = [t1,t2];
			let list = customData ? customData : [...u.travel, ...u.deaths];
			let ct1 = list.find((e)=>{return e[5] == t1});
			let ct2 = 0;

			if(t2 == 0){
				list = list.sort((a,b)=>{return a[0]-b[0]})
				ct2 = list[list.length-1];
			}else{
				ct2 = list.find((e)=>{return e[5] == t2})
				if(!ct2){
					list = list.sort((a,b)=>{return a[0]-b[0]})
					ct2 = list[list.length-1];
				}
			}

			if(ct1){
				window.client.timeDiffRes[0] = ct1[0];
			}else{
				window.client.timeDiffRes[0] = 0;
			}

			if(t2){
				window.client.timeDiffRes[1] = null;
			}else{
				if(res) window.client.timeDiffRes[1] = res;
			}

			if(ct1 && t2){
				const timed = Math.abs(ct1[0] - ct2[0])
				if(res) res.innerHTML = window.secondsFormat(timed);
				window.client.refreshHeroOnUcard(name, ct2[0]);
				return [window.secondsFormat(timed, true, 1), window.secondsFormat(ct1[0], true, 1), window.secondsFormat(ct2[0], true, 1), ct1[5]-1, ct2[5]-1, ct1[0], ct2[0]];
			}else
			{
				if(!ct1) ct1 = list[0];
				const timed = Math.abs(Math.floor(ct1[0] - ct2[0]));
				if(res) res.innerHTML = window.secondsFormat(timed);
				window.client.refreshHeroOnUcard(name, ct2[0]);
				return [window.secondsFormat(timed, true, 1), window.secondsFormat(ct1[0], true, 1), window.secondsFormat(ct2[0], true, 1), ct1[5]-1, ct2[5]-1, ct1[0], ct2[0]];
			}
		}
		const timed = window.secondsFormat(0, true, 1);
		if(res) res.innerHTML = window.secondsFormat(0);
		return [timed, timed, timed, 0, 0, 0, 0];
	},

	refreshHeroOnUcard: function(name, lasttime){
		if(name && window.client.elem.hero){
			let h = window.client.elem.hero
			let HeroT = window.client.getUserHero(name, lasttime),
			Hero = window.id2name(HeroT),
			Color = window.getHeroColor(Hero);
			h.style.color = Color;
			h.className = window.client.allowedHeroes.includes(HeroT)? '' : 'blacklisted';
			h.innerText = Hero;

		}
	},

	onNewLog: function(name = "", log = null){
		if(name == window.z && log && window.client.timeDiffRes[1]){
			window.client.refreshHeroOnUcard(name, log[0]);
			window.client.timeDiffRes[1].innerHTML = window.secondsFormat(Math.abs(Math.floor(log[0] - window.client.timeDiffRes[0])));
		}
	},

	hideLogs:function(){
		document.querySelectorAll(".log-popup").forEach((e)=>{e.remove()});
		document.querySelectorAll(".log-popup-extra").forEach((e)=>{e.remove()});

	},

	getDeaths: function(name = ""){
		const u = window.client.elem.logsstor[name];
		if(u){
			return u.totalDeaths;
		}else{
			return "-"
		}
	},

	getHasExited: function(name = ""){
		const u = window.client.userlog[name];
		if(u){
			return u.exited;
		}else{
			return true;
		}
	},

	globalEntitiesFind: (f)=>{
		for(let i in window.client.state.globalEntities){
			let e = window.client.state.globalEntities[i];
			if(f(e)){
				return e;
			}
		}
		return null;
	},

	customLog: function(name, type = 3, arrname = "travel", onlyElem = false){
		if(window.client.userlog[name]){
			const time = window.getTime();
			const ctime = secondsFormat(Math.floor(time));

			let uo = window.client.userlog[name];
			if(uo && uo[arrname]){
				let len = uo[arrname].length;

				if(!onlyElem){
					let o;
					uo[arrname].push([
						time, ctime, uo[arrname][len-1][2], uo[arrname][len-1][2] != "Stellar Square" ? uo[arrname][len-1][3] :
						(o = window.client.globalEntitiesFind((ee)=>ee.name == name),o?o.level+"":uo[arrname][len-1][3]),
						 type, uo.logid++
					]);
				}else{
					len --;
				}

				let logElem = document.getElementById("log-" + name)
				if(logElem && Object.keys(window.client.userlog2).length == 0 ){
					let sctb = false;
					if(logElem.scrollTop + logElem.clientHeight == logElem.scrollHeight)sctb = true;
					logElem.appendChild(window.client.createLogLine(uo[arrname][len]));
					if(sctb)logElem.scrollTop = logElem.scrollHeight;
				}

				window.client.onNewLog(name, uo[arrname][len]);
			}
		}
	},

	createLogLine: function(dataArray){
		const line = document.createElement("div");
		line.style.display = window.client.logTypesToShow.includes(dataArray[4]) ? "": "none";
		line.className = `ele ${window.styleByNr(dataArray[4])}`;
		line.title = dataArray[5];

		line.innerHTML = `<div id="logid">${dataArray[5]}|</div><div id="time">${dataArray[1]}</div><div id="map">${window.getShortName(dataArray[2])}</div><div id="area">${window.normalizeArea(dataArray[3])}</div>`
		return line
	},

	logUserAreas: function(usr){
		const time = window.getTime();
		const ctime = secondsFormat(Math.floor(time));

		if(window.client.userlog[usr.name]){
			let uo = window.client.userlog[usr.name];
			let len = uo.travel.length;
			if(uo.q)return;
			if(uo.travel[len-1][3] != usr.areaName
			|| uo.travel[len-1][2] != usr.regionName){
				uo.travel.push([
					time, ctime, usr.regionName, usr.areaName, usr.victoryArea ? 5 : 0, uo.logid++
				]);

				window.client.customLog(usr.name, usr.victoryArea ? 5 : 0, "travel", true);
			}

			if(usr.deathTimer != -1){
				if(!uo.dead){
					uo.dead = true;
					uo.deaths.push([time, ctime, usr.regionName, usr.regionName != "Stellar Square" ? usr.areaName :(usr.level+""), 1, uo.logid++]);

					window.client.customLog(usr.name, 1, "deaths", true);

					uo.totalDeaths ++;
				}
			}else
			if(uo.dead){
				uo.dead = false;
				uo.deaths.push([time, ctime, usr.regionName, usr.areaName, 2, uo.logid++]);

				window.client.customLog(usr.name, 2, "deaths", true);
			}
			return false;
		}else{
			window.client.userlog[usr.name] = {
				dead:false,exited:false,q:false,totalDeaths:0,logid:2,logids:["",""],
				deaths:[/*[time, ctime, usr.regionName, usr.areaName, 2, 2]*/],
				travel:[[time, ctime, usr.regionName, usr.areaName, 6, 1]/*[time, ctime, usr.regionName, usr.areaName, usr.victoryArea ? 5 : 0, 1]*/],
				heroes:[[usr.heroType, time]],
				vp: undefined,
			};

			window.updateLeaderboard();
				return true;
		}
	},

	getUserLogIds:function(name){
		const u = window.client.elem.logsstor[name];
		if(u){
			return u.logids;
		}
		return ["",""];
	},

	getUserHero:function(name, time){
		const u = window.client.elem.logsstor[name];
		if(u){
			for(let i = u.heroes.length-1; i >= 0; i--){
				let hd = u.heroes[i];
				if(hd[1] <= time){
					return hd[0];
				}
			}
		}
		return -1;
	},

    drBefore: function(e, t) {
		window.client.pingNfps.frame();
		let namesA = [];
		let namesB = [];

		let uc = 0;
		for(let i in window.client.userlog){
			if(!window.client.userlog[i].q)namesA.push(i);
		}

		let newpt = [];
		for(let i in client.state.globalEntities){
			uc++;
			namesB.push(client.state.globalEntities[i].name);
			let isnew = window.client.logUserAreas(client.state.globalEntities[i]);
			let uo = window.client.userlog[client.state.globalEntities[i].name];
			if(uo && uo.heroes[uo.heroes.length-1][0] != client.state.globalEntities[i].heroType)uo.heroes.push([client.state.globalEntities[i].heroType, window.getTime()]);
			if(client.state.globalEntities[i].name == window.z){
				window.client.opos[0] = client.state.globalEntities[i];
			}
			if(isnew){
				newpt.push({
					name:client.state.globalEntities[i].name,
					logs:uo
				});
			}
		}

		if(newpt.length > 0){
			globalThis.client.events.emit(globalThis.client.events.events.playerCountChange, {
				players:newpt,
				count:uc,
				action:"joined",
			});
		}

		for(let i = namesA.length; i >= 0; i--){
			if(namesB.includes(namesA[i])){
				namesB.splice(namesB.indexOf(namesA[i]), 1);
				namesA.splice(i, 1);
			}
		}
		if(namesA.length > 0 ||namesB.length > 0){
			setTimeout(window.updateLeaderboard,50);
		}

		newpt = [];
		for(i of namesA){
			if(!window.client.userlog[i].q){
				let uo = window.client.userlog[i];
				newpt.push({
					name:i,
					logs:uo
				});
				uo.q = true;
				uo.dead = false;
				uo.exited = false;
				//"leave?"
				window.client.customLog(i, 6, "travel", false);
			}
		}

		if(newpt.length > 0){
			globalThis.client.events.emit(globalThis.client.events.events.playerCountChange, {
				players:newpt,
				count:uc,
				action:"left",
			});
		}

		newpt = [];
		for(i of namesB){
			if(window.client.userlog[i].q){
				//"join?"
				let uo = window.client.userlog[i];
				const time = window.getTime();
				const ctime = secondsFormat(Math.floor(time));

				uo.q = false;

				for(let j in client.state.globalEntities){
					if(client.state.globalEntities[j].name == i){
						let usr = client.state.globalEntities[j];
						uo.travel.push([time, ctime, usr.regionName, usr.areaName, 6, uo.logid++]);
						uo.heroes.push([usr.heroType, time]);
						window.client.customLog(i, 6, "travel", true);
						return;
					}
				}

				newpt.push({
					name:i,
					logs:uo
				});
			}
		}
		if(newpt.length > 0){

			globalThis.client.events.emit(globalThis.client.events.events.playerCountChange, {
				players:newpt,
				count:uc,
				action:"joined",
			});
		}

		let o = null;
		let m = null;
		{
			for(var i in client.state.entities){
				let obj = client.state.entities[i]
				if(obj.name == window.z){
					o = obj;//experience
				}
				if(obj.name){
					window.client.userlog[obj.name].vp = obj.winCount;
					if(!window.client.getHasExited(obj.name)){
						if(!m){
							for(var j in client.state.map.area.zones.zones){
								let zone = client.state.map.area.zones.zones[j]
								if(zone.type == 0){
									m = zone;
									break;
								}
							}
						}
						if(m){
							if(obj.x + obj.radius - m.x > 0
							&& obj.x - obj.radius - m.x - m.width < 0
							&& obj.y + obj.radius - m.y > 0
							&& obj.y - obj.radius - m.y - m.height < 0
							){
								window.client.userlog[obj.name].exited = true;
								window.client.customLog(obj.name, 4);
							}
						}
					}
				}
			}
		}
		if(window.client.elem.xp != null){
			try{
				window.client.elem.xp.innerText = `XP: ${o != null ? o.experience: "not in same area"}`;
			}catch{
				window.client.elem.xp = null;
			}
		}

		if(window.client.elem.level != null){
			try{
				window.client.elem.level.innerText = `Level: ${window.client.opos[0].level || -1} | Deaths: ${window.client.getDeaths(window.z)}`;
			}catch{
				window.client.elem.level = null;
			}
		}

		if(window.client.elem.speed != null){
			try{

				if(!window.client.opos[1]){
					window.client.opos[1] = {...window.client.opos[0]};
				}

				var dx = (window.client.opos[0].x || 0) - (window.client.opos[1].x || 0);
				var dy = (window.client.opos[0].y || 0) - (window.client.opos[1].y || 0);
				let diff1 = Math.abs(dx);
				let diff2 = Math.abs(dy);

				window.client.elem.speed.innerText = `Speed X: ${diff1.toFixed(2)}\nSpeed Y: ${diff2.toFixed(2)}`;
				window.client.opos[1] = {...window.client.opos[0]};
			}catch{
				window.client.elem.speed = null;
			}
		}
		//}
    },

	getShownLogs: function(){
		let json = {};

		for(var i of window.client.loggerShown){
			let u = window.client.userlog[i]
			if(u){
				json[i] = u;
			}
		}
		return JSON.stringify(json);
	},

	/*logger popup -g*/
	loggerShown:[],
	loggerShownOnly:false,
	logger:null,
	openLogger: function(notOnlyLogs = true, olyClose = false){
		const p = document.querySelector(".log-popup");
		if(!window.client.logger && notOnlyLogs && !olyClose){
			const popup = document.createElement("div");
			popup.id = "LOGGER-S";
			popup.className = "logger-users";


			{
				const extras = document.createElement("div");
				extras.id = "extras";

				extras.innerHTML =
				`<input type="checkbox" ${window.client.loggerShownOnly ? " checked" : ""} class="custombox lp">`+
				`<button onclick="document.getElementById('copy-sellector').value = window.client.getShownLogs();document.getElementById('copy-sellector').select();document.execCommand('copy');">Export</button>`+
				`<input id="copy-sellector" value="suck" style="position:absolute; left:-100%; width:10px; border:none;">`+
				`<input id="pastesel" placeholder="import">`;

				let cb = extras.querySelector(".custombox.lp");
				cb.addEventListener("click", ()=>{
					window.client.loggerShownOnly = cb.checked;
					if(window.client.logger) window.client.logger.remove();
					window.client.logger = null;
					window.client.openLogger();
				});

				let el = extras.querySelector("#pastesel");
				el.addEventListener("blur", ()=>{
					let json = "";
					try{
						json = JSON.parse(el.value);
					}catch{}

					let f = ()=>{
						if(window.client.logger) window.client.logger.remove();
						window.client.logger = null;
						window.client.openLogger();
					}

					if(typeof json == "object"){
						window.client.userlog2 = json;
						f();
					}else{
						let kl = Object.keys(window.client.userlog2)?.length;
						window.client.userlog2 = {};
						if(kl > 0) f();
					}
				})

				popup.appendChild(extras);
			}

			{
				const holder = document.createElement("div");
				holder.id = "holder";
				popup.appendChild(holder);
				let who = 0;
				const keys = Object.keys(Object.keys(window.client.userlog2)?.length > 0 ? (who = 2, window.client.userlog2) : (who = 1, window.client.userlog));
				for(let i = 0; i < keys.length; i++){
					const elem = document.createElement("div");

					elem.innerHTML =``;
					let includes = window.client.loggerShown.includes(keys[i]);

					elem.style.display = !includes && window.client.loggerShownOnly ? "none":"";

					if(who == 1) elem.innerHTML += `<input type="checkbox" ${includes ? " checked" : ""} class="custombox lp">`;
								 elem.innerHTML += `<p>${keys[i]}</p>`
					;

					elem.querySelector("input")?.addEventListener("click", (e)=>{
						e.stopPropagation();
						let el = elem.querySelector("input")
						if(!el) return;

						if(el.checked){
							window.client.loggerShown.push(keys[i]);
							if(window.client.loggerShownOnly){
								elem.style.display = "";
							}
						}else{
							let index = window.client.loggerShown.findIndex((a)=>{return a == keys[i]})
							if(index != -1) window.client.loggerShown.splice(index, 1);
							if(window.client.loggerShownOnly){
								elem.style.display = "none";
							}
						}
					});

					//elem.querySelector("p").innerText = keys[i];

					elem.addEventListener("click", ()=>{
						let popup = document.querySelector(".log-popup");
						if(popup) popup.remove();
						const p2 = document.querySelector(".log-popup-extra");
						if(p2){
							p2.remove();
						}

						const o = window.client.openUcard(keys[i], [window.innerWidth/2 -100,window.innerHeight/2 -150], who == 1 ? window.client.userlog : window.client.userlog2)//window.client.showLog(keys[i], 100, false, false);
						if(o && o[0]){
							o[0].style.top = "50%";
							o[0].style.right = "50%";
							o[0].style.transform = "translate(50%, -50%)";

							if(o[1]){
								o[1].style.left = "50%";
								o[1].style.top = "50%";
								o[1].style.transform = "translate(-150px,-50%)";
							}
						}
					});

					holder.appendChild(elem);
				}
			}

			window.client.logger = popup;
			document.body.appendChild(popup);
		}else
		if(p){
			p.remove();
			const p2 = document.querySelector(".log-popup-extra");
			if(p2){
				p2.remove();
			}
			return true;
		}
		else
		if(notOnlyLogs){
			if(window.client.logger){
				window.client.logger.remove();
				window.client.logger = null;
			}
		}
		return false;
	},

	openCustomSettings:function(removeOnly = false){
		window.client.openCustomCommands(true);
		window.client.openAllUserMetas(true);
		window.client.areaData.openAreaPopup(true);
		if(window.client.openLogger(true, true))return;
		const element = document.querySelector(".customSettings");
		if(element){
			element.parentNode.remove();
			return;
		}else
		if(!removeOnly){
			document.createElementP("div",null,(backpan)=>{
				backpan.style.position = "absolute";
				backpan.style.width = "100%";
				backpan.style.height = "100%";
				backpan.style.top = "0";
				backpan.style.left = "0";
				backpan.style.top = "0";

				document.body.appendChild(backpan);

				backpan.addEventListener("click", (e)=>{
					window.client.openCustomSettings(true);
				});

				let genButton = (popup, btnn, btnt, click)=>{
					popup.appendChild(document.createElementP("div",{className:"lay"},(lay)=>{
						lay.appendChild(document.createElementP("button",{className:btnn,innerHTML:btnt},(el)=>{
							el.addEventListener("click", click);
						}));
					}));
				}

				backpan.appendChild(document.createElementP("div",{className:"customSettings"},(popup)=>{
					popup.addEventListener("click", (e)=>{
						e.stopPropagation();
					});

					genButton(popup, "Logger", "Logger", (e)=>{
						window.client.openCustomSettings(true);
						window.client.openLogger();
						e.stopPropagation();
					})

					genButton(popup, "Commands", "Commands", (e)=>{
						window.client.openCustomSettings(true);
						window.client.openCustomCommands();
						e.stopPropagation();
					})

					genButton(popup, "FriendsNNotes", "Friends & Notes", (e)=>{
						window.client.openCustomSettings(true);
						window.client.openAllUserMetas();
						e.stopPropagation();
					})

					for(let btnn of (globalThis.RBtns || [])){
						genButton(popup, btnn[0], btnn[1], btnn[2])
					}

					popup.appendChild(document.createElementP("div",{className:"lay"},(lay)=>{
						let mapToOpen = "Central Core";
						lay.appendChild(document.createElementP("button",{className:"TeamLogger",innerHTML:"Team logger"},(el)=>{
							el.addEventListener("click", (e)=>{
								window.client.openCustomSettings(true);
								window.client.areaData.openAreaPopup(false, mapToOpen);
								e.stopPropagation();
							});
						}));
						lay.appendChild(document.createElementP("select",null,(el)=>{
							for(let d in maps){
								el.innerHTML += `<option value="${d}">${maps[d]}</option>`
							}
							el.value = mapToOpen;
							el.addEventListener("input", ()=>{
								mapToOpen = el.value;
							})
						}));
					}));

				}));
			});
		}
	},

	openAllUserMetas:function(removeOnly = false){
		const element = document.querySelector(".allmetas");
		if(element){
			element.parentNode.remove();
			return true;
		}else
		if(!removeOnly){
			document.createElementP("div",null,(backpan)=>{
				backpan.style.position = "absolute";
				backpan.style.width = "100%";
				backpan.style.height = "100%";
				backpan.style.top = "0";
				backpan.style.left = "0";
				document.body.appendChild(backpan);

				backpan.addEventListener("click", (e)=>{
					window.client.openAllUserMetas(true);
				});

				backpan.appendChild(document.createElementP("div",{className:"allmetas"},(popup)=>{
					popup.addEventListener("click", (e)=>{
						e.stopPropagation();
					});

					popup.appendChild(document.createElementP("div", {className:"lay header"}, (lay)=>{
						lay.innerHTML += `<label>Friends & Notes</label>`;
						lay.appendChild(document.createElementP("button", {innerHTML:"X"}, (btn)=>{
							btn.addEventListener("click", ()=>{
								window.client.openAllUserMetas(true);
							});
						}));
					}));


					let input, itemsContainer,
					prior = (t)=>t==""?0:t=="Warning"?1:2,
					allNames = Object.keys(window.client.userMetas).sort().sort((a,b)=>prior(window.client.userMetas[b].lbtag) - prior(window.client.userMetas[a].lbtag)),
					displaynames = [...allNames],
					fill = ()=>{};

					let research = ()=>{
						displaynames = [...allNames].filter((n)=>n.toLocaleLowerCase().startsWith(input.value.toLocaleLowerCase()));
						fill();
					}


					popup.appendChild(document.createElementP("div", {className:"lay"}, (lay)=>{
						input = lay.appendChild(document.createElementP("input", {className:"search"}, (el)=>{
							el.addEventListener("input", ()=>{
								console.log("changes to", input.value)
								research();
							});
						}));
						lay.appendChild(document.createElementP("button", {innerHTML:"search"}, (btn)=>{
							btn.addEventListener("click", ()=>{
								window.client.openAllUserMetas(true);
								globalThis.CANR = false;
								window.client.openUserMetas(input.value, false, ()=>{
									window.client.openAllUserMetas();
									globalThis.CANR = true;
								});
							});
						}));
					}));

					popup.appendChild(itemsContainer = document.createElementP("div", {className:"container"}, (lay)=>{
						(fill=()=>{
							lay.innerHTML = "";
							for(let i = 0, l = displaynames.length; i < l; i++){
								let bgcolor = prior(window.client.userMetas[displaynames[i]].lbtag);
								bgcolor = bgcolor == 0 ? "transparent" : bgcolor == 1 ? "red" : "green";
								lay.appendChild(document.createElementP("div", {innerHTML:
									`<div class="trangleshape" style="border-left-color:${bgcolor}"></div>`+displaynames[i]
								}, (el)=>{
									el.setAttribute("uname", displaynames[i]);
									el.addEventListener("click", ()=>{
										window.client.openAllUserMetas(true);
										globalThis.CANR = false;
										window.client.openUserMetas(el.getAttribute("uname"), false, ()=>{
											window.client.openAllUserMetas();
											globalThis.CANR = true;
										});
									});
								}));
							}
						})();
					}));

				}));
			});
		}
		return false
	},

	openCustomCommands:function(removeOnly = false){
		const element = document.querySelector(".customCommands");
		if(element){
			element.parentNode.remove();
			return true;
		}else
		if(!removeOnly){
			document.createElementP("div",null,(backpan)=>{
				backpan.style.position = "absolute";
				backpan.style.width = "100%";
				backpan.style.height = "100%";
				backpan.style.top = "0";
				backpan.style.left = "0";
				document.body.appendChild(backpan);

				backpan.addEventListener("click", (e)=>{
					window.client.openCustomCommands(true);
				});

				backpan.appendChild(document.createElementP("div",{className:"customCommands"},(popup)=>{
					popup.addEventListener("click", (e)=>{
						e.stopPropagation();
					});

					const cmdStruct=[
						["bool", "User tags", "showTag", "ts-showTag", ()=>{}],
						["bool", "User LB tags", "lbTags", "ts-lbTags", (r)=>{window.client.toggleLbTags(r);}],
						["bool", "LB users count", "showUIACnt", "ts-showUIACnt", ()=>{window.client.areaData.updateLb();}],
						["bool", "User card", "showUcard", "ts-showUcard", (r)=>{window.client.toggleUcard(r);}],
						["bool", "Show fps and ping", "togglefps", "ts-togglefps", ()=>{}],
						["option", "Timer:",[
							["Real time", "1"],
							["Ingame time", "2"],
							["None", "3"]
						],"timerReal", "ts-timerReal", ()=>{}],
						["bool", "Automatic disconnect", "autodc", "ts-autodc", ()=>{}],
						//["bool", "SS leaderboard shows xp", "ssxp", "ts-ssxp", ()=>{window.client.toggleExtendLb()}],
					]
					let i = 0;
					popup.appendChild(document.createElementP("div", {className:"lay header"}, (lay)=>{
						lay.innerHTML += `<label>Custom Settings</label>`;
						lay.appendChild(document.createElementP("button", {innerHTML:"X"}, (btn)=>{
							btn.addEventListener("click", ()=>{
								window.client.openCustomCommands(true);
							});
						}));
					}));
					for(let cmd of cmdStruct){
						popup.appendChild(document.createElementP("div", {className:"lay"}, (lay)=>{
							if(i == cmdStruct.length-1) lay.style.marginBottom = "10px";
							if(cmd[0] == "bool"){
								lay.innerHTML += `<label>${cmd[1]}</label>`;
								//lay.appendChild(document.createElementP("div",{innerHTML:cmd[1]},(el)=>{
								let checkbox; lay.appendChild(checkbox = document.createElementP("input", {type: "checkbox"}))
								let r=()=>{checkbox.checked = window.client.textCommandConsts[cmd[2]]};
								r()
								checkbox.addEventListener("click", (e)=>{
									let res;
									localStorage.setItem(cmd[3], res= window.client.textCommandConsts[cmd[2]] = !window.client.textCommandConsts[cmd[2]]);
									//r()
									if(cmd[4])cmd[4](res);
									e.stopPropagation();
								});
								//}));
							}else
							if(cmd[0] == "option"){
								lay.innerHTML += `<label>${cmd[1]}</label>`;
								//lay.appendChild(document.createElementP("div",{className:"droplist",innerHTML:`<label>${cmd[1]}</label>`},(el)=>{
								lay.appendChild(document.createElementP("select",null,(el)=>{
									for(let d of cmd[2]){
										el.innerHTML += `<option value="${d[1]}">${d[0]}</option>`
									}
									el.value = window.client.textCommandConsts[cmd[3]];
									el.addEventListener("input", ()=>{
										localStorage.setItem(cmd[4], window.client.textCommandConsts[cmd[3]] = el.value);
									})
								}));
								//}));
							}
						}));
						i++;
					}
				}));
			});
		}
		return false
	},

	init: function(){
		globalThis.client.events.addEventListener(globalThis.client.events.events.playerCountChange, (e)=>{
			if(e.action == "left"){
				for(let player of e.players){
					globalThis.tags.chatTags.delVal(player.name);
				}
			}
		})

		globalThis.client.events.addEventListener(globalThis.client.events.events.chatMessage, (e)=>{
			if(e.name == window.client.main.name){
				if(window.client.pingNfps.sendTime != 0){
					window.client.pingNfps.ping = Date.now() - window.client.pingNfps.sendTime;
					window.client.pingNfps.sendTime = 0;
				};
			}
		})

		window.client.elem.logsstor = window.client.userlog;
		//window.client.toggleExtendLb();
	},

	showClasses: getLocal("ts-showClasses", "false") == "true",

	autoMode: false,
	script: false,
	count: 0,
	load: false,
};

globalThis.client.init();

HTMLElement.prototype.removeChild2 = HTMLElement.prototype.removeChild;
HTMLElement.prototype.removeChild = function(e, e2){
    try{this.removeChild2(e, e2)}catch(e){};
}

setInterval(()=>{
	if(!client.chat)client.chat = document.getElementById("chat-window");
	if(client.chat){
		while(client.chat.childElementCount > 100){
			client.chat.childNodes[0].remove();
		}
	}
}, 10000)


window.replaces = {
	id2: function (e,t,l) {
		if(window.client.textCommandConsts.timerReal != 3){
			t.font = 'bold ' + e.default.font(30);
			let secs = secondsFormat(window.client.textCommandConsts.timerReal == 1 ? window.getTime() : window.client.main.survivalTime);
			t.strokeText(secs, l, 80);
			t.fillText(secs, l, 80);

		}
		let olw = t.lineWidth, fis = t.strokeStyle, strs =t.fillStyle;

		if(window.client.textCommandConsts.togglefps && client.state){
            t.textAlign="right"
            t.lineWidth = 3;
			t.font = 'bold ' + e.default.font(13);
            t.strokeStyle = window.client.pingNfps.fps >= 28 ? "#060" : window.client.pingNfps.fps >= 20 ? "#770" : "#700";
            t.fillStyle = window.client.pingNfps.fps >= 28 ? "#0f0" : window.client.pingNfps.fps >= 20 ? "#ff0" : "#f00";
			t.strokeText("fps: " + window.client.pingNfps.fps, 1260, 640);
			t.fillText("fps: " + window.client.pingNfps.fps, 1260, 640);

			t.strokeStyle = window.client.pingNfps.ping <= 115 ? "#060" : window.client.pingNfps.ping <= 210 ? "#770" : "#700";
            t.fillStyle = window.client.pingNfps.ping <= 115 ? "#0f0" : window.client.pingNfps.ping <= 210 ? "#ff0" : "#f00";

            t.strokeText("ping: " + window.client.pingNfps.ping, 1260, 670);
			t.fillText("ping: " + window.client.pingNfps.ping, 1260, 670);
		}
		t.lineWidth = olw;
		t.textAlign="center";
        t.strokeStyle = fis;
        t.fillStyle = strs;
		t.font = 'bold ' + e.default.font(35);
	},
	id4: function () {
		return this.default.createElement(
			"label",
			{htmlFor: "showClasses"},
			this.default.createElement(
				"div",
				{className: "settings-setting"},
				"Show Heroes",
				this.default.createElement(
					"input",
					{
						type: "checkbox",
						className: "settings-checkbox",
						id: "showClasses",
						checked: client.showClasses,
						onChange: function (e) {
							localStorage.setItem("ts-showClasses", client.showClasses = !client.showClasses);
							if(client.showClasses){
								document.getElementById("leaderboard").ariaLabel = "fat"
							}else{
								document.getElementById("leaderboard").ariaLabel = ""
							}
							setTimeout(window.createNewLeaderboard, 1);
						}
					}
				)
			)
		);
	}
}

window.nrByStyle = (style)=>{
	return ["","dead", "alive", "custom", "arexit", "victory", "qoj"].findIndex((v)=>{return v == style})
}
window.styleByNr = (nr)=>{
	return ["","dead", "alive", "custom", "arexit", "victory", "qoj"][nr];
}

globalThis.id2name = (id)=>{
	return [
	'Magmax',
	'Rime',
	'Morfe',
	'Aurora',
	'Necro',
	'Nexus',
	'Brute',
	'Shade',
	'Euclid',
	'Chrono',
	'Reaper',
	'Rameses',
	'Jolt',
	'Ghoul',
	'Cent',
	'Jotunn',
	'Candy',
	'Mirage',
	'Boldrock',
	'Glob',
	'Magno',
	'Ignis',
	'Stella',
	'Viola',
	'new 1',
	'new 2',
	'new 3',
	'new 4',
	][id];
}

const maps = {
	"Central Core": 		  "CC",
	"Vicious Valley": 		  "VV",
	"Elite Expanse": 		  "EE",
	"Wacky Wonderland": 	  "WW",
	"Glacial Gorge": 		  "GG",
	"Dangerous District": 	  "DD",
	"Peculiar Pyramid": 	  "PP",
	"Monumental Migration":   "MM",
	"Humongous Hollow": 	  "HuHo",
	"Haunted Halls": 		  "HaHa",
	"Quiet Quarry": 		  "QQ",
	"Frozen Fjord": 		  "FF",
	"Ominous Occult": 		  "OO",
	"Restless Ridge": 		  "RR",
	"Toxic Territory": 		  "TT",
	"Magnetic Monopole": 	  "MM2",
	"Stellar Square": 		  "SS",
	"Assorted Alcove": 		  "AA",
	"Burning Bunker": 		  "BB",
	"Grand Garden": 		  "GG2",

	"Central Core Hard": 	  "CCH",
	"Vicious Valley Hard": 	  "VVH",
	"Elite Expanse Hard": 	  "EEH",
	"Wacky Wonderland Hard":  "WWH",
	"Glacial Gorge Hard": 	  "GGH",
	"Dangerous District Hard":"DDH",
	"Peculiar Pyramid Hard":  "PPH",
	"Humongous Hollow Hard":  "HuHoH",
	"Haunted Halls Hard":     "HaHaH",
	"Quiet Quarry Hard": 	  "QQH",
	"Frozen Fjord Hard": 	  "FFH",
	"Ominous Occult Hard":    "OOH",
	"Restless Ridge Hard": 	  "RRH",
	"Toxic Territory Hard":   "TTH",
	"Magnetic Monopole Hard": "MM2H",
	"Assorted Alcove Hard":   "AAH",
	"Burning Bunker Hard": 	  "BBH",
	"Grand Garden Hard":	  "GGH2",
}

window.getShortName = (map)=>{

	return maps[map] ? maps[map] : map
}

window.normalizeArea = (area)=>{
	return area
	.replace("Tunnel", 			"Tun.")
	.replace("Perimeter", 		"Per.")
	.replace("Outer", 			"Out.")
	.replace("Inner", 			"Inn.")
	.replace("Chamber",			"Cha.")
	.replace("Level",			"L")
	.replace("Locked Ladder",	"L. L.")
	.replace("Boss",			"B.")
	.replace("Evades",			"Ev.")
}

window.getVpColor = (vp)=>{
	if(typeof vp == "number")
	return vp < 75 ? "#ff0000" :
			vp < 500 ? "#00ff00" :
			vp < 20000 ? "#0095ff" :
			"rainbow"
	else return "#aaa";
}

window.getHeroRealColor = function(Hero){
	switch(Hero){
		case "Rime":
			return "#3333ff";//"#3333ff";
		case "Reaper":
			return "#424a59";//"#424a59";
	}
	return window.getHeroColor(Hero);
}

window.getHeroColor = function(Hero){
	switch(Hero){
		case "Magmax":
			return "#ff0000";
		case "Rime":
			return "#3377ff";//"#3333ff";
		case "Morfe":
			return "#00dd00";
		case "Aurora":
			return "#ff7f18";
		case "Necro":
			return "#ff00ff";
		case "Nexus":
			return "#29ffc6";
		case "Brute":
			return "#9b5800";
		case "Shade":
			return "#826565";
		case "Euclid":
			return "#5e4d66";
		case "Chrono":
			return "#00b270";
		case "Reaper":
			return "#787b81";//"#424a59";
		case "Rameses":
			return "#989b4a";
		case "Jolt":
			return "#e1e100";
		case "Ghoul":
			return "#bad7d8";
		case "Cent":
			return "#727272";
		case "Jotunn":
			return "#5cacff";
		case "Candy":
			return "#ff80bd";
		case "Mirage":
			return "#020fa2";
		case "Boldrock":
			return "#a18446";
		case "Glob":
			return "#14a300";
		case "Magno":
			return "#ff005d";
		case "Ignis":
			return "#cd501f";
		case "Stella":
			return "#fefa8b";
		case "Viola":
			return "#d9b130";
	}
	return "white";
}

window.addEventListener('DOMContentLoaded', e=>{
	window.vers.check();
	document.body.oncontextmenu = e => false;

	let styles = document.createElement('style');
	let newihtml = `
	body{overflow-x:hidden;}
	.hidden{display:none;}

	#version-warning{
		position: absolute;
		top: 0;
		left: 0;
	}
	#version-warning > div{
		float:left;
		margin-left: 10px;
	}

	#version-warning > .v-title{
		text-align: center;
    	width: 100%;
		color: darksalmon;
	}

	#version-warning > .v-cv, #version-warning > .v-cv + div{
		color: goldenrod;
	}

	#version-warning > .v-nv{
		margin-right: 12px;
		color: forestgreen;
	}

	#version-warning > .v-nv + div{
		color: forestgreen;
	}

	/*otherrrrrrr*/
	.settings {
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translateX(-50%);
		width: 250px;
		height: 380px;
		background-color: #000E;
		border-radius: 5px;
		color: #fff;
		padding: 10px;
	}
	.leaderboard-title{
		font-size: 18px;
	}

	.leaderboard-title-break > .leaderboard-world-title{
		font-size: 15px;
	}

	.chat-message-contextmenu.fake{
		width:200px;
		height: 306px;
		position: absolute;
		right: 20px;
		padding:10px;
		background-color: #000000aa;
		border: solid 2px #222;
		border-radius: 10px;
		color:white;
		z-index: 10;
	}

	.chat-message-contextmenu.fake > aa.banned-text0{
		position: absolute;
		color: #ff000045;
		top: 120px;
		left: -10px;
		font-size: 3.6em;
		z-index: -1;
		transform: rotate(316deg);
	}

	.chat-message-contextmenu.fake > aa.banned-text1{
		position: absolute;
		color: #ff0000;
		bottom: 0;
		right: 2px;
		font-size: 1.6em;
		z-index: -1;
	}

	.chat-message-contextmenu.fake button.bbtn{
		position:absolute;
		border-radius: 4px;
		width: 30px;
		height: 20px;
		border: none;
		font-weight: bold;
	}

	.chat-message-contextmenu.fake button.bbtn{
		color: #2a2a2a;
    	background-color: #9b9b9b;
	}

	.chat-message-contextmenu.fake button#close.bbtn{
		right: 10px;
	}

	.chat-message-contextmenu.fake button#log.bbtn{
		left: 10px;
	}

	.chat-message-contextmenu.fake button#add.bbtn{
		left: 53px;
	}

	.chat-message-contextmenu.fake button#reset.bbtn{
		left: 95px;
	}
	.chat-message-contextmenu.fake button#gen.bbtn{
		right: 53px;
	}

	.chat-message-contextmenu.fake > ul{
		display: inline-block;
		width:200px;
		padding-inline-start: 0;
	}

	.chat-message-contextmenu.fake > ul > li{
		text-align:center;
		width:200px;
	}

	.chat-message-contextmenu.fake > ul > li > #timecounter > input{
		width: 40px;
		float: left;
	}

	.chat-message-contextmenu.fake > ul > li > #timecounter > #tc-result{
		width: 100px;
		float: right;
		text-align: right;
		margin: 0;
	}

	.blacklisted{
		position:relative;
	}

	.blacklisted::after{
		content: " ";
		background-color: red;
		width: 110%;
		height: 2px;
		position: absolute;
		left: -5%;
		top: 50%;
		border-radius: 50%;
		border: solid 1px #2f0000;
		transform: translateY(-10%);
	}
	/*------------*/
	.log-popup{
		width:250px;
		min-height: 0;
    	max-height: 270px;
		/*height:270px;*/
		background-color:#c8c8c8;
		z-index:1001;
		position:absolute;
		border: solid 2px #222;
		border-radius: 10px;
		overflow-y: auto;
	}

	.areaPopup > .log_part > .scoll_elem > .ele,
	.log-popup > .ele{
		color:white;
		width:100%;
		height:25px;
		background-color:#000;
		margin-bottom:2px;
		font-size: 8pt;
		line-height: 22px;
		text-align: center;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.dead,
	.log-popup > .ele.dead{
		background-color:#7c5d5a;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.alive,
	.log-popup > .ele.alive{
		background-color:#576a4d;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.custom,
	.log-popup > .ele.custom{
		background-color: #807f45/*#949494*/;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.arexit,
	.log-popup > .ele.arexit{
		background-color: #949494;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.victory,
	.log-popup > .ele.victory{
		background-color: #aa6600;
	}

	.areaPopup > .log_part > .scoll_elem > .ele.qoj,
	.log-popup > .ele.qoj{
		background-color: #7b478e;
	}

	.areaPopup > .log_part > .scoll_elem > .ele > div,
	.log-popup > .ele > div{
		float:left;
	}

	.areaPopup > .log_part > .scoll_elem > .ele > div#logid,
	.log-popup > .ele > div#logid{
		width:16%;
	}

	.areaPopup > .log_part > .scoll_elem > .ele > div#time,
	.log-popup > .ele > div#time{
		width:25%;
	}

	.areaPopup > .log_part > .scoll_elem > .ele > div#map,
	.log-popup > .ele > div#map{
		width:35%;
	}

	.areaPopup > .log_part > .scoll_elem > .ele > div#area,
	.log-popup > .ele > div#area{
		width:24%;
	}

	.log-popup > .ele > div#map,
	.log-popup > .ele > div#area{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.logger-users::-webkit-scrollbar-track-piece,
	.log-popup::-webkit-scrollbar-track-piece{ /*scrollbar back*/
		/*background: #000000 !important;*/
		background: rgba(0, 0, 0, 0)!important;
		border: solid 5px rgba(0, 0, 0, 0)!important;
	}

	.logger-users::-webkit-scrollbar-thumb,
	.log-popup::-webkit-scrollbar-thumb{ /*scrollbar thingie*/
		/*background: #000000 !important;*/
		background: rgb(82, 82, 82)!important;
		border: solid 5px rgba(0, 0, 0, 0)!important;
		border-radius: 5px!important;
	}

	.logger-users::-webkit-scrollbar,
	.log-popup::-webkit-scrollbar{
		width: 7px!important;
	}

	.log-popup-extra{
		position: absolute;
		background-color: #808080;
		right: 520px;
		width: 20px;
		border-radius: 10px;
	}

	.log-popup-extra > input{
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 4px;
		margin-right: 4px;
	}

	/*chechbox ------------------------------------*/
	.custombox[type="checkbox"]:before {
		position: relative;
		display: block;
		width: 11px;
		height: 11px;
		border: 1px solid #000;
		content: "";
	}

	.custombox[type="checkbox"]:after {
		position: relative;
		display: block;
		left: 2px;
		top: -11px;
		width: 7px;
		height: 7px;
		border-width: 1px;
		border-style: solid;
		border-color: transparent;
		content: "";
		background-color: darkder;
		background-repeat: no-repeat;
		background-position: center;
	}

	.custombox[type="checkbox"]:checked:after,
	.custombox[type="checkbox"]:not(:disabled):checked:hover:after{
		filter: brightness(100);
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAQAAABuW59YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAB2SURBVHjaAGkAlv8A3QDyAP0A/QD+Dam3W+kCAAD8APYAAgTVZaZCGwwA5wr0AvcA+Dh+7UX/x24AqK3Wg/8nt6w4/5q71wAAVP9g/7rTXf9n/+9N+AAAtpJa/zf/S//DhP8H/wAA4gzWj2P4lsf0JP0A/wADAHB0Ngka6UmKAAAAAElFTkSuQmCC);
	}

	.custombox[type="checkbox"]:disabled:after {
		-webkit-filter: opacity(0.4);
	}

	.custombox[type="checkbox"]:not(:disabled):hover:before {
		border-color: white;
	}

	/*normal----------------------------------------------------------------*/
	.custombox[type="checkbox"]:before{
		background: #000;
	}

	/*dead----------------------------------------------------------------*/
	.custombox.dead[type="checkbox"]:before{
		background: #7c5d5a;
	}

	/*alive--------------------------------------------------------------*/
	.custombox.alive[type="checkbox"]:before{
		background: #576a4d;
	}

	/*custom-------------------------------------------------------------*/

	.custombox.custom[type="checkbox"]:before{
		background: #807f45;
	}
	/*arexit-------------------------------------------------------------*/

	.custombox.arexit[type="checkbox"]:before{
		background: #949494;
	}

	/*victory-------------------------------------------------------------*/

	.custombox.victory[type="checkbox"]:before{
		background: #aa6600;
	}

	/*quit or join--------------------------------------------------------*/

	.custombox.qoj[type="checkbox"]:before{
		background: #7b478e;
	}


	/*toggle show users-------------------------------------------------------------*/

	.custombox.lp[type="checkbox"]:before{
		background: #890000;
	}









	/*leaderboard*/
	#leaderboard{
		transform-origin: 100% 0%!important;
		left: unset!important;
		right: 10px!important;
	}
	#leaderboard[aria-label="fat"]{
		width:230px;
	}



	/*herolist and base areaPopup*/

	.areaPopup *::-webkit-scrollbar-track-piece,
	.areaPopup::-webkit-scrollbar-track-piece,
	.herolist::-webkit-scrollbar-track-piece{ /*scrollbar back*/
		/*background: #000000 !important;*/
		background: #ffffff40!important;
		border: solid 5px rgba(0, 0, 0, 0)!important;
	}

	.areaPopup *::-webkit-scrollbar-thumb,
	.areaPopup::-webkit-scrollbar-thumb,
	.herolist::-webkit-scrollbar-thumb{ /*scrollbar thingie*/
		/*background: #000000 !important;*/
		background: #c1c1c1!important;
		border: solid 5px rgba(0, 0, 0, 0)!important;
		border-radius: 5px!important;
	}
	.areaPopup *::-webkit-scrollbar,
	.areaPopup::-webkit-scrollbar,
	.herolist::-webkit-scrollbar{
		width: 7px!important;
		height: 7px!important;
	}

	.areaPopup,
	.herolist{
		width: 500px;
		height: 400px;
		max-height: 50%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #000000aa;
		z-index: 10;
		overflow-y: scroll;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		flex-wrap: wrap;
		justify-content: center;
	}

	.herolist > .block{
		width: 100px;
		height: 100px;
		background-color: #000;
		margin: 11px 11px 11px 12px;
		float:left;
	}

	.herolist > .block > .hero{
		width: 50%;
		height: 50%;
		background-color: red;
		margin-left: 25%;
		margin-top: 10px;
		border-radius: 100%;
	}

	.herolist > .block > .text{
		color: red;
		text-align: center;
		width: 100%;
		margin-top: 10px;
	}

	/*areaPopup*/
	.areaPopup{
		background-color: #000000a1;
	}

	.areaPopup > .users_part{
		height: 88px;
		width: 100%;
	}
	.areaPopup > .log_part{
		max-height: 330px;
		width: 100%;
	}
	.areaPopup > .result_part{
		min-height: 100px;
	}
	.areaPopup > .format_part{
		height: 120px;
		width: 100%;
	}

	.areaPopup > .format_part > .cmds_elem{

	}

	.areaPopup > .format_part > .format_elem{
		height: 26px;
		font-size: 11pt;
		width: 485px;
		background-color: darkgray;
		border: solid 2px grey;
	}

	.areaPopup > .result_part > .result_elem{
		background-color: #4c4c4c;
		color: beige;
		text-align: center;
		padding: 5px;
		width:480px;
		height:60px;
		resize: none;
	}

	.areaPopup > .log_part > .scoll_elem{
		max-height: 250px;
    	overflow-y: auto;
		margin-top: 5px;
	}

	.areaPopup > .log_part > input{
		text-align: center;
		background-color: darkgray;
		width: 236px;
		border: solid 2px grey;
		margin-right: 1px;
		margin-left: 1px;
}

	.areaPopup > div > .theader,
	.areaPopup > div > .theader{
		width: 100%;
		font-size: 30pt;
		height: fit-content;
		text-align: center;
		line-height: unset;
		color: #8e8e8e;
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 2px 0 #000;
	}

	.areaPopup > div > .theader > button{
		background-color: burlywood;
		border: solid 2px #967b59;
		float: right;
		width: 40px;
		height: 40px;
		position: absolute;
		right: 4px;
		transform: translateY(4px);
	}

	.areaPopup > .format_part > .cmds_elem,
	.areaPopup > .users_part > .scoll_elem{
		text-align: center;
		width: 100%;
		height: 34px;
		overflow-x: auto;
		overflow-y: hidden;
		padding-top: 5px;

	}
	.areaPopup > .format_part > .cmds_elem > .cmd,
	.areaPopup > .users_part > .scoll_elem > .scoll_user{
		display: unset;
		color: beige;
		background: #222222;
		height: 20px;
		padding: 5px;
		border: solid 1px #444444;
		min-width: fit-content;
		margin-left: 2px;
		margin-right: 2px;
		white-space: nowrap;

		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-khtml-user-select: none;
	    -ms-user-select: none;

	}
	.areaPopup > .users_part > .scoll_elem > .scoll_user.sellected{
		background: #0b2700;
		border: solid 1px #0a3502;

	}

	/*logger-users*/

	.logger-users{
		position:absolute;
		width:300px;
		max-height:40%;
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
		background-color: #000000aa;
		color: white;
		overflow-y: auto;
		border-radius: 10px;
	}

	.logger-users > #extras > button, .logger-users > #extras > input#pastesel{
		background-color: #1e1e1e;
		border: solid 2px #272727;
		margin-left: 10px;
		margin-top: 5px;
		margin-bottom: 5px;
		width: 110px;
		font-size: 12pt;
	}

	.logger-users > #extras > button{
		color: #b04300;
    	font-weight: bold;
	}

	.logger-users > #extras > input#pastesel{
		width: 120px;
		color: #a3b000;
    	font-weight: bold;
	}

	.logger-users > #extras > input#pastesel::placeholder{
		color: #b04300;
    	font-weight: bold;
		font-size: 12pt;
	}

	.logger-users > #extras > input.custombox.lp{
		margin-left: 8px;
	}

	.logger-users > #holder > div{
		text-align: center;
		height: 30px;
		line-height: 30px;
		background-color: transparent;
		border-bottom: solid 1px white;
	}

	.logger-users > #holder > div > input{
		float: left;
		margin-top: 8px;
		margin-left: 8px;
	}
	.logger-users > #holder > div > p{
		margin: 0;
		margin-right: 25px;
	}

	.logger-users > #holder::-webkit-scrollbar-thumb{
		background: rgb(183 183 183)!important;
	}

	.rainbowText{
		animation-name: rainbowTextkf;
		animation-duration: 20s;
		animation-iteration-count: infinite;
	}
	`

	if(window.tags){
		for(let tag in window.tags.tagsData){
			let tagData = window.tags.tagsData[tag];
			{//lb
				if(tagData.lb){
					let newarr = [];
					for(let i in window.tags.oldTags[tag]){
						newarr.push('#leaderboard span[arialabel="'+ window.tags.oldTags[tag][i] +'"]::before')
					}
					window.client.toggleLbTagscsscode += newarr.join(",");
					window.client.toggleLbTagscsscode += `{
						content: "${tagData.lb.text}";
						margin-right: 4px;
						color: ${tagData.lb.color};
						text-shadow: -1px -1px 5px #0000006e, 1px -1px 5px #0000006e, -1px 1px 20px #0000006e, 1px 1px 5px #0000006e;
						${tagData.lb.rainbow?
							`animation-name: rainbowTextkf;
							animation-duration: 20s;
							animation-iteration-count: infinite;`:
							``
						}
					}`
				}
				window.client.toggleLbTags(window.client.textCommandConsts.lbTags);
			}
			{//badge
				if(tagData.badge){
					newihtml += `.usermetas > .badgeslay > .badge[badge="${tag}"]{
						background-color: ${tagData.badge.bg};
						border-color: ${tagData.badge.border};
						color: ${tagData.badge.textcolor};
						${tagData.badge.rainbow?`
						animation-name: rainbowBadgekf;
						animation-duration: 10s;
						animation-iteration-count: infinite;
						animation-timing-function: linear;`:``
						}
					}`
					if(tagData.badge.subText){
						newihtml += `.usermetas > .badgeslay > .badge[badge="${tag}"]::after{
							content:"${tagData.badge.subText}";
							color: ${tagData.badge.textcolor};
							${tagData.badge.rainbow?`
							animation-name: rainbowBadgeSubTextkf;
							animation-duration: 10s;
							animation-iteration-count: infinite;
							animation-timing-function: linear;`:``
							}
						}`
					}
				}
			}
		}
	}
	newihtml +=`
	.usermetas > .badgeslay > .badge::after{
		position: absolute;
		top: 13px;
		font-size: 8px;
		text-align: center;
		width: 100%;
		left: 0px;
	}

	@keyframes rainbowTextkf {
		0%   {color: hsl(0, 100%, 50%);}
		25%   {color: hsl(90, 100%, 50%);}
		50%   {color: hsl(180, 100%, 50%);}
		75%   {color: hsl(270, 100%, 50%);}
		100% {color: hsl(360, 100%, 50%);}
	}

	@keyframes rainbowTextkfGlow {
		0%   {color: hsl(0, 100%, 50%); text-shadow: 0 0 4px hsl(0, 100%, 50%);}
		25%   {color: hsl(90, 100%, 50%); text-shadow: 0 0 4px hsl(90, 100%, 50%);}
		50%   {color: hsl(180, 100%, 50%); text-shadow: 0 0 4px hsl(180, 100%, 50%);}
		75%   {color: hsl(270, 100%, 50%); text-shadow: 0 0 4px hsl(270, 100%, 50%);}
		100% {color: hsl(360, 100%, 50%); text-shadow: 0 0 4px hsl(360, 100%, 50%);}
	}

	@keyframes rainbowBadgekf {
		0%    {color: hsl(0, 100%, 13%); border-color: hsl(0, 100%, 33%); background-color: hsl(0, 100%, 50%);}
		25%   {color: hsl(90, 100%, 13%); border-color: hsl(90, 100%, 33%); background-color: hsl(90, 100%, 50%);}
		50%   {color: hsl(180, 100%, 13%); border-color: hsl(180, 100%, 33%); background-color: hsl(180, 100%, 50%);}
		75%   {color: hsl(270, 100%, 13%); border-color: hsl(270, 100%, 33%); background-color: hsl(270, 100%, 50%);}
		100%  {color: hsl(360, 100%, 13%); border-color: hsl(360, 100%, 33%); background-color: hsl(360, 100%, 50%);}
	}
	@keyframes rainbowBadgeSubTextkf {
		0%    {color: hsl(0, 100%, 13%);}
		25%   {color: hsl(90, 100%, 13%);}
		50%   {color: hsl(180, 100%, 13%);}
		75%   {color: hsl(270, 100%, 13%);}
		100%  {color: hsl(360, 100%, 13%);}
	}

	.rainbowText {
		color: red;
		animation-name: rainbowTextkf;
		animation-duration: 20s;
		animation-iteration-count: infinite;
	}

	.rainbowTextGlow {
		animation-name: rainbowTextkfGlow!important;
	}
	/*THE USERMETAS---------------------------------------*/

	.usermetas{
		position: absolute;
		width: 300px;
		height: 400px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #000000aa;
		overflow: hidden;
		border-radius: 10px;
		border: solid 1px #000;
		z-index:11;
	}

	.usermetas > .header{
		width: 100%;
		height: 40px;
		line-height: 42px;
		font-size: 18pt;
	}

	.usermetas > .buttonslay{
		margin-top:10px;
		width: 100%;
		height: 40px;
	}

	.usermetas > .buttonslay > button{
		width: 100px;
		height: 40px;
		float: left;
		font-size: 13pt;
	}
	.usermetas > .buttonslay > button.friend{
		background-color: #00a200;
		border: solid 2px green;
		border-top-left-radius: 10px;
	}

	.usermetas > .buttonslay > button.warning{
		background-color: #ca0000;
    	border: solid 2px #6f0000;
		border-top-right-radius: 10px;
	}

	.usermetas > .buttonslay > .currentState{
		width: 96px;
		height: 36px;
		float: left;
		background-color: burlywood;
		border: solid 2px #a06500;
		text-align: center;
		font-size: 13pt;
		line-height: 33px;
	}

	.usermetas > .notelay{
		width: 100%;
		height: 112px;
		margin-top: 10px;
	}

	.usermetas > .notelay > textarea{
		width: 290px;
		height: 100px;
		resize: none;
		margin: 0;
		padding: 5px;
		border: none;
		border-top: solid 1px #00000052;
		border-bottom: solid 1px #00000052;
    	background: #0000002e;
		color: antiquewhite;
	}

	.usermetas > button#cancel,
	.usermetas > button#save{
		width: 100px;
		height: 40px;
		position: absolute;
		bottom: 5px;
		right: 5px;
		background-color: #00a200;
		border: solid 2px green;
	}
	.usermetas > button#cancel{
		background-color: #ca7500!important;
		border: solid 2px #733e00!important;
		left: 5px!important;
	}

	.usermetas > .badgeslay{
		width: auto;
		height: 135px;
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-content: flex-start;
	}

	.usermetas > .badgeslay > .badge{
		position: relative;
		font-size: 13px;
		font-weight: bold;
		width: 80px;
   		margin-top: 6px;
		margin-bottom: 6px;
		height: 37px;
		line-height: 34px;
		background: lemonchiffon;
		text-align: center;
		border: solid 4px #000;
		border-radius: 12px;
	}

	.usermetas > .badgeslay.small > .badge{
		margin-bottom: 0;
		margin-right: 0;
	}

	.allmetas *::-webkit-scrollbar-thumb, /*scrollbar thingie*/
	.usermetas *::-webkit-scrollbar-thumb{ /*scrollbar thingie*/
		background: #8e8e8e!important;
		border-radius: 5px!important;
	}

	.allmetas *::-webkit-scrollbar,
	.usermetas *::-webkit-scrollbar{
		width: 7px!important;
		height: 7px!important;
	}

	/*custom settingssssssss*/

	.allmetas,
	.customCommands,
	.customSettings{
		position: absolute;
		width: 300px;
		max-height: 400px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #000E;
		overflow: hidden;
		border-radius: 10px;
		border: aliceblue;
		display: inline-grid;
		justify-items: center;
		z-index: 1000;
	}

	.customSettings > .lay{
		width: 100%;
		height: 30px;
		display: inline-block;
		margin-top: 10px;
		margin-bottom: 10px;
		border-radius: 10px;
	}

	.customSettings > .lay > button{
		width: 150px;
		height: 30px;
		display: inline-block;
		border-radius: 10px;
		background: #bbb;
		border: solid 2px #3e3e3e;
		color: #000;
		font-weight: bold;
		margin-left: 75px;
	}

	.customSettings > .lay > select{
		float: right;
		width: 60px;
		margin-right: 10px;
		height: 29px;
	}
	.allmetas > .lay.header,
	.customCommands > .lay{
		font-size: 16px;
		margin-top: 10px;
		background-color: #404040;
		border-radius: 5px;
		padding: 5px;
		width: 272px;
		text-align: left;
		color: white;
		height: 19px;
		display: inline-block;
	}

	.allmetas > .lay.header,
	.customCommands > .lay.header{
		background: none;
		font-size: 20px;
	}

	.allmetas > .lay.header > button,
	.customCommands > .lay.header > button{
		height: 20px;
		width: 25px;
	}

	.customCommands > .lay > label{
		float: left;
	}

	.customCommands > .lay > *{
		float: right;
	}

	/*.customCommands > button{
		width: 150px;
		height: 30px;
		display: inline-block;
		margin-top: 10px;
		margin-bottom: 10px;
		border-radius: 10px;
		background: #bbb;
		border: solid 2px #3e3e3e;
		color: #000;
		font-weight: bold;
	}*/

	/*.customCommands > button.red{
		background: #c10000;
    	border-color: #6f0000;
	}

	.customCommands > button.green{
		background: #20a000;
   		border-color: #066700;
	}*/

	.customCommands > .droplist{
		width: 100%;
		height: 30px;
		margin-top: 10px;
		margin-bottom: 10px;
		background: #bbb;
		border: solid 2px #3e3e3e;
		border-radius: 10px;
		line-height: 27px;
		text-align: center;
	}

	.customCommands > .lay > select{
		background-color: #777;
		color: #000;
		font-weight: bold;
	}
	.customCommands > .lay > select > option{
		font-weight: bold;
	}

	.allmetas{
		border: solid 1px #000;
	}

	.allmetas > .lay{
		display: inline-grid;
		justify-items: center;
		width: 100%;
		grid-auto-flow: column;
		margin-top: 10px;
	}

	.allmetas > .lay.header > button{
		float: right;
	}

	.allmetas > .container{
		width: 100%;
		margin-top: 10px;
		max-height: 320px;
		overflow-y: auto;
	}

	.allmetas > .container > div{
		width: 100%;
		height: 30px;
		color: white;
		text-align: center;
		line-height: 27px;
		background-color:#111;
		position: relative;
	}
	.allmetas > .container > div:nth-child(2n){
		background-color:#222;
	}

	.trangleshape{
		position: absolute;
		background-color: transparent;
		width: 0;
		border-top: 11px inset transparent;
		border-left: 15px solid #0f0;
		border-bottom: 11px solid transparent;
		border-radius: 100px;
		left: 5px;
    	top: 4px;
	}

	/*CHANGELOGS*/
	#changelogs {
		float: left;
		width: 300px;
		height: 275px;
		position: relative;
		left: 50%;
		transform: translate(-500px);
		border: 1px solid #585858;
		border-radius: 5px;
		color: #fff;
	}

	#chlbuttons{
		width: 100%;
   		height: 24px;
	}

	#chlbuttons > button{
		width: 33.333%;
   		height: 24px;
		background: antiquewhite;
		border: solid 2px #000;
		border-radius: 6px;
	}

	.ts-changelog,
	.ts-links,
	.changelog {
		float: left;
		width: 300px;
		height: 250px;
		position: relative;
		left: 0;
		transform: translate(0, 0);
		overflow: auto;
		border: 1px solid #585858;
		border-radius: 5px;
		color: #fff;
	}


	.quick-play-button{
		color: #db1512;
	}


	.graphw{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		background: #00000088;
	}

	.graphw > #chartContainer{
		height: 370px;
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.subtitle-profile>div>b>button{
		margin-left: 20px;
		position: relative;
		top: -7px;
		font-size: 20px;
		font-family: Verdana,Arial,Times,serif;
		background-color: #222;
		border: solid 2px #5a3c00;
		color: #ffa900;
	}
	.subtitle-profile>div>b>button:hover{
		background-color: #333;
		border: solid 2px #885b00;
		color: #ffc249;
	}

	.profile-hat-accessory{
		border: 1px solid #b9b9b9;
		width: 50px;
		height: 50px;
		margin: 10px 10px 0 10px;
	}

	.profile-hat-accessory-selected{
		border-color: #89ff85;
	}

	`;
	window.client.recalcUserMetas();
	styles.innerHTML = newihtml;

	document.head.appendChild(styles);

	document.addEventListener("keydown", (e)=>{
		if(client.textCommandConsts.autodc && (e.code == "F5" || (e.code == "KeyR" && e.ctrlKey)) && client.load){
            if(client.state && client.state.chatMessages)client.state.chatMessages.push("/dc");
            e.preventDefault();
			if(socket) socket.onclose = ()=>{document.location.reload();};
            else document.location.reload();
			return;
        }
		if(document.activeElement.hasAttribute("c-lock")||document.activeElement.localName === "input"){
			if(document.activeElement?.getAttribute("type") != "checkbox") return;
		}
		if(e.code == "KeyR"){
			globalThis.CANR&&window.client.openCustomSettings();
			//window.client.openLogger();
		}else
		if(e.code == "Escape"){
			window.client.toggleHeroList(true);
		}
	});
});

window.checkGlobalError = ()=>{
	if(globalThis._babelPolyfill){
		return false;
	}else{
		return true;
	}
}

window.fireB = () => {
	let event = document.createEvent("Event");
	event.initEvent("keydown", true, true);
	event.keyCode = 66;
	document.dispatchEvent(event);
	setTimeout(window.updateLeaderboard, 50);
};

window.createNewLeaderboard = () => {
	fireB();
	setTimeout(fireB, 50);
};

window.removeFakes = ()=>{
	[...document.getElementsByClassName('fake')].forEach(el => el.remove());
}

window.z = "";
globalThis.getAttrInParents=(e,a)=>{
	let at;
	if(at = e.getAttribute(a)){
		return at;
	}else return window.getAttrInParents(e.parentNode, a);
}
window.updateLeaderboard = () => {
	//window.client.areaData.check();
	document.body.onclick = () => {
		client.count = 0; //window.removeFakes();
	};
	let llb = document.querySelector(".leaderboard-title");
    if(llb && llb?.innerText == "Leaderboard")(llb.innerText = window.lbText)||(llb.innerText = window.lbText = "Leaderboard " + (socket.url.startsWith("wss://eu") ? "EU " : "NA ") + (1+ +socket.url.split("?")[1].split("&")[0].split("=")[1]));

	for (let names of [...document.getElementsByClassName('leaderboard-name')]) {
		names.oncontextmenu = event => {
			window.client.openUcard(getAttrInParents(event.target,"ariaLabel"), [20,event.y], window.client.userlog);
		};
		names.style.cursor = "pointer";
	}
}

window.makeDragable = (elem, elems2drag)=>{
	elem.addEventListener("mousedown", (e)=>{
		if(window.firstPos == null || window.firstPos[2] == null){
			window.firstPos = [e.screenX,e.screenY, elems2drag];
		}
	});
}
document.addEventListener("mousemove", (e)=>{
	if(window.firstPos != null && [e.screenX, e.screenY].join("") != "00"){
		if(window.firstPos[2] != null){
			if(e.stopPropagation) e.stopPropagation();
    		if(e.preventDefault) e.preventDefault();
			for(var i = 0; i < window.firstPos[2].length; i++){
				let el = window.firstPos[2][i];
				el.style.top = (parseInt(el.style.top.substring(0, el.style.top.length-2)) + e.screenY - window.firstPos[1]) + "px";
				el.style.right = (parseInt(el.style.right.substring(0, el.style.right.length-2)) + (window.firstPos[0] - e.screenX) ) + "px";
				//e.screenX,e.screenY
			}
			window.firstPos = [e.screenX,e.screenY, window.firstPos[2]];
		}
	}
});
document.addEventListener("mouseup", (e)=>{
	window.firstPos = null;
});
let settings = document.createElement('label');
settings.innerHTML = "showClasses";

window.updateName = (id, name) => {
	with (client) {
		if (!(showClasses && state)) return name;

		for (let i in state.globalEntities) {
			const element = state.globalEntities[i];
			if (element.id !== id) continue;

			let Hero = window.id2name(element.heroType);
			let DeathTime = window.secondsFormat(Math.floor(element.deathTimer/1000), false);
			return typeof name == 'string' ? `${element.deathTimer != -1 ? (DeathTime + " • ") : ""}${name} (${Hero})` : name;
		}
	}
}

window.loadGame = () => {
	window.createNewLeaderboard();
	client.load = true;
	window.client.toggleUcard(window.client.textCommandConsts.showUcard);
	let e;
	document.head.appendChild((e = document.createElement("style"),e.innerHTML = `html,body{overflow: hidden!important;}`,e))
	if(globalThis.client.showClasses){
		document.getElementById("leaderboard").ariaLabel = "fat"
	}
}

window.getTag = (name)=>{
	for(var tagKey in window.tags.oldTags){
		let tag = window.tags.oldTags[tagKey];
		if(tag.includes(name)){
			return tagKey;
		}
	}
	return "";
}

window.genPrefix = (name)=>{
	if(window.client.textCommandConsts.showTag){
		for(let tagKey in window.tagsEX){
			let tag = window.tagsEX[tagKey];
			if(tag.includes(name)){
				window.lastPrefix.name = window.tagDataEX[tagKey].presudo;
				window.lastPrefix.color = window.tagDataEX[tagKey].color;
				return;
			}
		}
		for(let tagKey in window.tags.oldTags){
			let tag = window.tags.oldTags[tagKey];
			if(tag.includes(name)){
				let tagData = window.tags.tagsData[tagKey];
				if(tagData.prefix){
					window.lastPrefix.name = tagData.prefix.text;
					window.lastPrefix.color = tagData.prefix.color;
				}else break;
				return;
			}
		}
	}
	window.lastPrefix.name="";
}
window.lastPrefix = {
	color:"red",
	name:""
}

new MutationObserver(function(mutations) {
	if (document.getElementsByTagName('script')[0]) {
		var elem = Array.from(document.querySelectorAll('script')).find(a=>a.src.match(/app\.[0-9a-f]{8}\.js/));
		if (elem) {
			let src = elem.src;
			elem.remove();
			elem = document.createElement('script');
			let newInnerHTML=`
			var akek=new XMLHttpRequest();
			akek.open("GET","${src}",false);
			akek.send();
			tmp=akek.response;`;

            for(let i = 0; i < globalThis.extraReplaces?.length; i++){
                let d = globalThis.extraReplaces[i];
                let ns;
				newInnerHTML += ns=`tmp = tmp.${d[2]===true?"replaceAll":"replace"}('${d[0].replaceAll("\'","\\'")}','${d[1].replaceAll("\'","\\'")}');\n`
            }
			newInnerHTML+=`

				// Декодер от protobuf
				tmp = tmp.replace(
					'n.Payloads.FramePayload.decode(l),',
					'n.Payloads.FramePayload.decode(l);window.protobuf||(window.protobuf=n.Payloads);'
				);

				//id: 1
				tmp = tmp.replace(
					'this.chat.style.visibility="visible",',
					'this.chat.style.visibility="visible",client.state=t,client.main=t.self.entity,'
				);

				// Собирание инфы со всех игроков
				//id: 2
				tmp = tmp.replace(
					'nter",t.lineWidth=6,t.strokeStyle=this.titleStrokeColor,t.fillStyle=this.titleColor,',
					'nter",t.lineWidth=6,t.strokeStyle=this.titleStrokeColor,t.fillStyle=this.titleColor,replaces.id2.call(this,e,t,l),'
				);
				//id: 3
				tmp = tmp.replace(
					'e.default.createElement("span",{className:"leaderboard-name"},this.props.name),',
					'e.default.createElement("span",{className:"leaderboard-name"},window.updateName(this.props.player.id,this.props.name)),window.updateLeaderboard(e),(!client.load)?window.loadGame():null,'
				);
				//id: 4
				tmp = tmp.replace(
					'ck:this.cancel.bind(this)}),',
					'ck:this.cancel.bind(this)}),replaces.id4.call(e),'
				);

				//Таймеры
				tmp = tmp.replace(
					'(e,i){if(this.ready){',
					'(e,i){this==client.main&&client.drBefore.call(this,e,i);if(this.ready){'
				);

				// Фикс панели
				//id: 8

				tmp = tmp.replace('null!==this.gameState&&null!==this.updateChat&&(!this.gameState.initial&&!(i.ctrlKey||i.altKey||i.metaKey))', 'null!==this.gameState&& !(document.activeElement.getAttributeNames().includes("c-lock"))&&null!==this.updateChat&&(!this.gameState.initial&&!(i.ctrlKey||i.altKey||i.metaKey))');


				tmp = tmp.replace('className:"chat-message-sender"', 'className:"chat-message-sender", ariaLabel:('+
				'globalThis.client.events.emit(globalThis.client.events.events.chatMessage, {'+
					'name:r,'+
					'content:a,'+
					'privs:l,'+
				'}),s)')
				tmp = tmp.replace('className:"chat-message"', 'className:"chat-message", ariaLabel:s')


				tmp = tmp.replace('"leaderboard-name"','"leaderboard-name",ariaLabel:this.props.player.name');

				tmp = tmp.replace('e.textAlign="center",e.fillStyle="black",e.fillText(this.name,a,r-this.radius-11)),',
				'e.font2=e.font,e.font=(window.ssss2??14)+"px Tahoma, Verdana, Segoe, sans-serif",'+
				'window.genPrefix(this.name),e.lineWidth2=e.lineWidth,e.lineWidth=(window.ssss??2.5),e.strokeStyle ="black",e.strokeText(window.lastPrefix.name,a,r-this.radius-11 - (window.consts?.tagY??14)),e.textAlign="center",e.fillStyle=window.lastPrefix.color,e.fillText(window.lastPrefix.name,a,r-this.radius-11 - (window.consts?.tagY??14)),'+
				'e.font=e.font2,e.lineWidth=e.lineWidth2,'+
				'e.textAlign="center",e.fillStyle="black",e.fillText(this.name,a,r-this.radius-11)),');

				/*//left
				tmp = tmp.replace('e.textAlign="center",e.fillStyle="black",e.fillText(this.name,a,r-this.radius-11)),',
				'window.genPrefix(this.name),e.textAlign="left",e.fillStyle=window.lastPrefix.color,e.fillText(window.lastPrefix.name,a - e.measureText(window.lastPrefix.name+this.name).width/1.8,r-this.radius-11),'+
				'e.textAlign="center",e.fillStyle="black",e.fillText(this.name,a + e.measureText(window.lastPrefix.name).width/3,r-this.radius-11)),');
				*/

				tmp = tmp.replace('(this.enteredButtons.add(u),u.mouseOver=!0,u.interactive&&(this.down&&!u.mouseDown?(e.keys.keyDown(u.key),u.onClick()):!this.down&&u.mouseDown&&e.keys.keyUp(u.key),u.mouseDown=this.down,s=!0),o=!0)',
				'((this.gameState.heroInfoCard.hidden && ((u.width == 48 && u.height == 48) || (u.width == 14 && u.height == 14) || (u.width == 82 && u.height == 40)))?false:(this.enteredButtons.add(u),u.mouseOver=!0,u.interactive&&(this.down&&!u.mouseDown?(e.keys.keyDown(u.key),u.onClick()):!this.down&&u.mouseDown&&e.keys.keyUp(u.key),u.mouseDown=this.down,s=!0),o=!0))')

				tmp = tmp.replace('message:t,', 'message: window.client.checkMsg(t) ? (window.client.checkMsgSend(t)) : void 0,');
				//tmp = tmp.replace('this.gameState.chatMessages.push(o.value)', 'window.client.checkMsg(o.value)&&this.gameState.chatMessages.push(o.value)');

				tmp = tmp.replace('null!==e&&(this.isKeyUp(e)||this.downKeys.splice(this.downKeys.indexOf(e),1))',
				'if((e>3||e<0)||!window.client.grb.on || (window.client.grb.on && e !== window.client.grb.grbKey)){null!==e&&(this.isKeyUp(e)||this.downKeys.splice(this.downKeys.indexOf(e),1))}')

				tmp = tmp.replace('null!==e&&(this.isKeyDown(e)||this.downKeys.push(e))',
				'if((e>3||e<0)||!window.client.grb.on || (window.client.grb.on && e === window.client.grb.grbKey)){null!==e&&(this.isKeyDown(e)||this.downKeys.push(e))}')

				tmp = tmp.replace('this.downKeys=[]',
				'if(!window.client.grb.on)this.downKeys=[]')

				tmp = tmp.replace('require("babel-polyfill")', 'window.checkGlobalError()&&require("babel-polyfill")');

				tmp = tmp.replace('null!==r&&(this.leaderboardRef.current.scrollTop=r)', 'null!==r&&(this.leaderboardRef.current.scrollTop=r, window.client.areaData.check())');

				tmp = tmp.replace('null!==l&&(c=e.default.createElement("span",null,e.default.createElement("span",{className:i},l," "),c)',
				'(c=eval(globalThis.tags.getChatTag(c,e,l,i,r))')

				tmp = tmp.replace(
					'return e.default.createElement("div",{className:"changelog"',
					'return e.default.createElement("div",{id:"changelogs"},'+
					'e.default.createElement("div",{id:"chlbuttons"},'+
					'e.default.createElement("button",{onClick:()=>{window.vers.swi("ev")}}, "Evades.io"),'+
					'e.default.createElement("button",{onClick:()=>{window.vers.swi("ts")}}, "TS Mod"),'+
					'e.default.createElement("button",{onClick:()=>{window.vers.swi("li")}}, "Links")'+
					'),'+
					'e.default.createElement("div",{className:"ts-changelog hidden"}),'+
					'e.default.createElement("div",{className:"ts-links hidden"}),'+
					'e.default.createElement("div",{className:"changelog"'
				)
				tmp = tmp.replace('d."))))','d.")))) )')

				tmp = tmp.replace('"48"}))),','"48"})),'+
				'e.default.createElement("a", {'+
					'href: "https://docs.google.com/spreadsheets/d/1iNQsgPGu0xtSNyKEBDt8jr9EQfjD4Djn4e-qL7ljrRc"'+
				'},e.default.createElement("img", {'+
					'alt: "Highscores",'+
					'src: "https://cdn.discordapp.com/attachments/783087872605028372/877227883016388708/unknown.png",'+
					'width: "48",'+
					'height: "48"'+
				'}))'+
				'),')

				tmp = tmp.replace('}))))','})),'+
				'e.default.createElement("a", {'+
					'href: "https://docs.google.com/spreadsheets/d/1iNQsgPGu0xtSNyKEBDt8jr9EQfjD4Djn4e-qL7ljrRc"'+
				'},e.default.createElement("img", {'+
					'alt: "Highscores",'+
					'src: "https://cdn.discordapp.com/attachments/783087872605028372/877227883016388708/unknown.png",'+
					'width: "48",'+
					'height: "48"'+
				'}))'+
				'))')


				tmp = tmp.replace('"Mute"),','"Mute"),'
				+'  a && e.default.createElement("li", {'
				+'	className: "chat-message-contextitem-selectable chat-message-moderate",'
				+'	onClick: function() {'
				+'	let chat = document.getElementById("chat-input"); chat.value = "/mute "+ t.props.message.sender + " ";'
				+'	t.hide(); chat.focus(); chat.selectionStart = chat.selectionEnd = 10000;'
				+'		return undefined;'
				+'	}'
				+'}, "Mute Copy"),'
				)


				//tmp = tmp.replace('var s=Object.values(e);','var s=Object.values(e);if(globalThis.client.extendLb)Object.values(globalThis.client.state?.entities || []).forEach((v)=>{let ii;if(v.entityType == 0 && (ii=s.findIndex(vv=>vv.name == v.name))){console.log(ii.name,ii);s[ii]={...s[ii],...v}} });')

				//tmp = tmp.replace('var n,a;','var n,a,kk=(globalThis.client.textCommandConsts.ssxp && e.xp)?"experience":"level";');
				//tmp = tmp.replace('n=e.level,a=t.level','n=e[kk],a=t[kk]');
				//tmp = tmp.replace('||i.victoryArea!==u.victoryArea','|| i.victoryArea !== u.victoryArea|| (i.experience!==undefined && i.experience !== u.experience)');
				//tmp = tmp.replace('n?u.level','n?u[(globalThis.client.textCommandConsts.ssxp && u.experience !== undefined)?"experience":"level"]');
				//tmp = tmp.replace('victoryArea:i.victoryArea','victoryArea:i.victoryArea,experience:(i.experience)');

				//tmp = tmp.replace('','')

				//ppp
				tmp = tmp.replace('this.state.stats;', 'this.state.stats;globalThis.profiler.setState(this.state);')
				tmp = tmp.replace(/(,e\\.default\\.createElement\\("b",null,this\\.state\\.username\\)\\),)/gm,
				',e.default.createElement("div",null,e.default.createElement("b",null,this.state.username, e.default.createElement("button",{onClick:()=>{globalThis.profiler.showGraph()}},"Graph")))),')

				tmp = tmp.replace('"Career VP: ",m.highest_area_achieved_counter||0)',
				'"Career VP: ",m.highest_area_achieved_counter||0),e.default.createElement("div", {className:"profile-hats-container"})')

				//tmp = tmp.replace('module.exports="/area-50','globalThis.profiler.hats["area-50"] = module.exports="/area-50')

				eval(tmp);
				console.groupEnd()
				console.log("%cScript loaded.","color: green; font-size: 20px");

			`;
			elem.innerHTML = newInnerHTML;
			document.body.appendChild(elem);
			this.disconnect();
		}
	}
}).observe(document, {childList: true, subtree: true});
// ==UserScript==
// @name        !!!Background
// @version     1.0
// @author      Chocor
// @description thanks to Gisher for making the logo
// @match       https://evades.io/
// @run-at      document-start
// @grant       none
// ==/UserScript==

const TPS = 60;

new MutationObserver(function() {
    if (document.querySelector(".button")) {

        const css = `
        body {
            margin: 0;
            overflow: hidden;
        }
        .game-servers-list {
            position: absolute;
            top: 46%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .share-links, .iogames-button{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%);
        }
        .top-buttons-container, .home-login {
            position: absolute;
        }
        .button, .game-server, .changelog, .hall-of-fame, .server-browser-box, .home-login-or, .changelog-section-header {
            background-Color: #0000;
            border: 1px solid rgba(156,217,249, 0.6);
            color: rgba(156,217,249, 0.6);
        }
        .hall-of-fame-header, .changelog-header {
            border-bottom: 1px solid rgba(156,217,249, 0.6);
            color: rgba(156,217,249, 0.6);
        }
        .hall-of-fame-player+.hall-of-fame-player {
            border-top: 1px solid rgba(156,217,249, 0.6);
        }
        .button:hover, .game-server:hover {
            background-Color: #0000;
            color: rgba(156, 255, 255, 0.9);
            box-shadow: 0 0 10px rgba(156, 255, 255, 0.9);
        }
        .profile-button>.button {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translate(-120px, 150px);
        }
        .account-button>.button {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translate(0px, 150px);
        }
        .logout-button>.button {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translate(120px, 150px);
        }
        .quick-play-button {
            width: 300px;
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
        }
        .how-to-play-button {
            width: 130px;
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translate(83px, 95px);
        }
        .server-list-button {
            width: 130px;
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translate(-87px, 95px);
        }
        .title-image {
            background-image: url("https://cdn.discordapp.com/attachments/730467414260580382/1000500841150689340/Sans_titre_12_20220723223248.png");
        }
        .changelog {
            position: absolute !important;
            left: ${document.querySelector("#changelogs") ? 176 : 35}% !important;
            top: ${document.querySelector("#changelogs") ? 5 : 20}% !important;
            transform: translateX(-175%) !important;
            width: 300px !important;
            height: 500px !important;
        }
        #changelogs {
            border: 0px solid #0000;
            position: absolute !important;
            left: 35% !important;
            top: 20% !important;
            transform: translateX(-175%) !important;
            width: 300px !important;
            height: 500px !important;
        }
        .hall-of-fame {
            position: absolute;
            left: 65%;
            top: 20%;
            margin: 0px;
            transform: translateX(90%);
            width: 250px;
            height: 500px;
            padding: 0px;
        }
        .hall-of-fame-players {
            max-height: 416px;
        }
        .hall-of-fame-footer {
            position: absolute;
            transform: translateX(-100%);
        }
        .home-login {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        `


        const a = document.createElement("canvas");
        a.id = "chocor";
        document.body.insertBefore(a, document.body.firstChild);
        document.querySelector("#chocor").outerHTML = `<style>${css}</style><canvas id="chocor" width="1280" height="720" style="z-index: -99; position: absolute;"></canvas>`;

        const canvas = document.querySelector("#chocor");
        const ctx = canvas.getContext("2d");
        let nodes = [];
        for (let i = 0; i < 200; i++) {
            nodes.push({"x": Math.random() * window.innerWidth, "y": Math.random() * window.innerHeight, "a": Math.random() * 2 * Math.PI, "r": Math.random() * 2 + 2})
        }

        document.onmousemove = function(e) {
            nodes[0].x = e.clientX;
            nodes[0].y = e.clientY;
        };

        window.onresize = function() {
            nodes = [];
            for (let i = 0; i < 200; i++) {
                nodes.push({"x": Math.random() * window.innerWidth, "y": Math.random() * window.innerHeight, "a": Math.random() * 2 * Math.PI, "r": Math.random() * 2 + 2})
            }
        };

        function distance(a, b) {
            return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
        }

        const clock = setInterval(function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = "#113";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            for (let i = 0; i < nodes.length; i++) {
                if (i !== 0) {
                    nodes[i].x += Math.cos(nodes[i].a) * 60 / TPS;
                    nodes[i].y += Math.sin(nodes[i].a) * 60 / TPS;
                }
                (nodes[i].x < nodes[i].r) && (nodes[i].x = nodes[i].r, nodes[i].a = Math.PI - nodes[i].a);
                (nodes[i].x > window.innerWidth - nodes[i].r) && (nodes[i].x = window.innerWidth - nodes[i].r, nodes[i].a = Math.PI - nodes[i].a);
                (nodes[i].y < nodes[i].r) && (nodes[i].y = nodes[i].r, nodes[i].a = -nodes[i].a);
                (nodes[i].y > window.innerHeight - nodes[i].r) && (nodes[i].y = window.innerHeight - nodes[i].r, nodes[i].a = -nodes[i].a);

                if (i !== 0) {
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(156,217,249, 0.6)";
                    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                }
                for (let j = 0; j < nodes.length; j++) {
                    const d = distance(nodes[i], nodes[j]);
                    if (d < 22500) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(156, 217, 249, ${(1 - d / 22500) / 4})`;
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
            if (window.socket) {
                clearInterval(clock);
                document.querySelector("#chocor").remove();
                document.onmousemove = null;
                window.onresize = null;
            }
        }, 1000 / TPS);

        this.disconnect();
    }
}).observe(document, {childList: true, subtree: true});