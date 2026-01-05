// ==UserScript==
// @name         The Mofooapootinator
// @namespace    https://www.awesomenauts.com/forum/viewforum.php?f=6
// @version      0.3.1
// @description  Fuck you Google
// @author       Kida
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12064/The%20Mofooapootinator.user.js
// @updateURL https://update.greasyfork.org/scripts/12064/The%20Mofooapootinator.meta.js
// ==/UserScript==

walk(document.body);

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	var myArray = ['mofoapoo AKA "TL;DR my opinion is more correct than yours"', 
				'mofoapoo AKA "pre-rework ayla was OP"',
				'mofoapoo AKA "penny doesn\'t have burst"',
				'mofoapoo AKA "RBAY is fine"',
				'mofoapoo AKA "Pills are not required for anyone besides tanks"',
				'mofoapoo AKA "raelynn shuts down leon completely"',
				'mofoapoo AKA "I hate when people use math to argue balance"',
				'mofoapoo AKA "rift is broken/too strong/too easy to use"',
				'mofoapoo AKA "froggy is just as diverse as most of the cast"',
				'mofoapoo AKA "rae, clunk, skree, vinnie, and genji, are just as diverse as froggy"',
				'mofoapoo AKA "rocco, rae, swiggins, vinnie, and lonestar are far more broken and OP than froggy is"',
				'mofoapoo AKA "Once a lonestar gets up there and starts exploiting, you really can\'t defend the drill at all"',
				'mofoapoo AKA "Froggy, on hte otherhand, doesn\'t have the CC of rae\'s timerift, the follow up damage of swiggins, the burst and self heals of vinnie, the AA damage and juking ability of lonestar, and the endless rain of easy to land damage rocco has."',
				'mofoapoo AKA "Snipe is an amazing skill. With a bit of practice, rae can be incredibly good with snipe and AA alone. How are you even saying snipe is mediocre? It\'s the backbone of the character. Rae was extremely since her release, before timerift was made into what it is and came into the current beta. Rae has always been in the upper tiers. Snipe is very very good."',
				'mofoapoo AKA "Blind is really, really good"',
				'mofoapoo AKA "Pills are not required for anyone besides tanks"',
				'mofoapoo AKA "fast nauts don\'t need pills"',
				'mofoapoo AKA "Which is why you say remove RBAY because you can\'t figure out how to easily counter one of the easies moves to counter in this game that takes the place of an actual useful upgrade in that row"',
				'mofoapoo AKA "lonestar has been made way too OP by the last patch"',
				'mofoapoo AKA "BKM should affect timerift. Oh no...one naut has to give up something more useful on a utility row and now won\'t instantly lose when you use a very easy to land skill that still defends towers better than anything else in addition to clearing lanes and pushing against enemy towers."',
				'mofoapoo AKA "enemies can now actually catch rae after she over extends because the best get-out-of-jail-free card that will be up again 4 seconds after it disappears isn\'t so godly"',
				'mofoapoo AKA "even without timerift, rae is extremely viable, and still very powerful"',
				'mofoapoo AKA "yuri being UP comes from a host of other issues (lack of a jump, melee interrupting laser and flying) If those issues were fixed, yuri can afford to have bubble affected by BKM"',
				'mofoapoo AKA "Yuri is the only character who\'s "skill floor" feels more like a glitch than actual gameplay"',
				'mofoapoo AKA "BKM is fine as it is, except for the fact that it doesn\'t affect time slow"',
				'mofoapoo AKA "BKM reducing timerift\'s effect doesn\'t go far enough against such an overpowered skill"',
				'mofoapoo AKA "The only reason people hate RBAY is because everyone wants to kill froggy"',
				'mofoapoo AKA "RBAY isn\'t actually a good move. It replaces way better skills"',
				'mofoapoo AKA "snipe is the #2 most powerful ability in the game"',
				'mofoapoo AKA "you think the only way froggy should be balanced is that he should be easier to kill"',
				'mofoapoo AKA "You think because froggy is hard to kill, he\'s OP, which isn\'t true, because froggy is horrible at everything except team fights"',
				'mofoapoo AKA "RBAY gives froggy a chance to not be instantly mutilated by the same characters who RBAY counters"',
				'mofoapoo AKA "you have ayla as your avatar, which means you mained ayla recently, which means you basically mained the most OP character you could, and are now switching to Rocco"',
				'mofoapoo AKA "RBAY is fine"',
				'mofoapoo AKA "Lonestar wasn\'t UP to begin with before 2.11"',
				'mofoapoo AKA "because you guys can\'t comprehend "don\'t shoot from for 3 seconds" you blame RBAY?"',
				'mofoapoo AKA "Scoops hammer is more of a support skill"',
				'mofoapoo AKA "Frog has mediocre burst"',
				'mofoapoo AKA "the only reason you think Froggy is a major problem is because of the fact that you can\'t figure out how to predict his only style of play"',
				'mofoapoo AKA "Denying the effectiveness of blind to justify Vinnie being OP isn\'t a legitimate argument"',
				'mofoapoo AKA "Blind is great"',
				'mofoapoo AKA "snipe is the easiest to land burst in the game"',
				'mofoapoo AKA "blind is really good"',
				'mofoapoo AKA "Frog isn\'t that powerful"',
				'mofoapoo AKA "broken characters like rae"',
				'mofoapoo AKA "vinnie and rae can do almost DOUBLE frog\'s burst"',
				'mofoapoo AKA "RBAY can be HARD countered by...literally walking away for 2 seconds"',
				'mofoapoo AKA "Blind is a great defensive effect"',
				'mofoapoo AKA "skoldir is barely useful until he\'s dealing damage"',
				'mofoapoo AKA "pre 2.11 Lonestar\'s only problem was that early game, he was extremely weak"',
				'mofoapoo AKA "Why did leon get his push ability nerfed"',
				'mofoapoo AKA "BKM is only hurting yuri, while only slightly bothering rae"',
				'mofoapoo AKA "timerift is still overly broken"',
				'mofoapoo AKA "scoop isn\'t that strong"',
				'mofoapoo AKA "Base timerift alone makes skolldir useless basically the entire game"',
				'mofoapoo AKA "Even with BKM, snare traps outlast any other snare in the game without BKM"',
				'mofoapoo AKA "rae\'s rift is the biggest problem in the game"',
				'mofoapoo AKA "aylas going 2/20 literally destroying towers in 3 seconds the second any of her enemies are dead"',
				'mofoapoo AKA "we couldn\'t even clear droids fast enough for ayla to just torpedo in and clear lanes before dying"',
				'mofoapoo AKA "I literally watched her solo a tower that had half HP, and it was me and 2 droids attacking her, and she wasn\'t dying"',
				'mofoapoo AKA "timerift shouldn\'t be throwable"',
				'mofoapoo AKA "I just played a game where a rae didn\'t even get snipe until 4 towers were down on our side"',
				'mofoapoo AKA "I never play rae (because honestly it takes little skill to play her and it\'s boring)"',
				'mofoapoo AKA "I think there needs to be more of a delay for after rae snipes, to actually punish her"',
				'mofoapoo AKA "genji slide was bad and a crutch"',
				'mofoapoo AKA "coco needs to be reworked"',
				'mofoapoo AKA "carpet mines can be amazing"',
				'mofoapoo AKA "The only thing you need to do to make vinnie balanced it to reduce his AA damage against droids and turrets"',
				'mofoapoo AKA "base weedlings do too much damage"',
				'mofoapoo AKA "Give genji tower damage too, and he\'d be unstoppable"',
				'mofoapoo AKA "using booming bullets to damage the core through the roof of the drill is an exploit and using it makes you a shit player. worse than people who play vinnie or coco"',
				'mofoapoo AKA "why stay in game when up against a coco"',
				'mofoapoo AKA "stop playing Coco until they nerf her this patch"',
				'mofoapoo AKA "genji has broken pushing potential"',
				'mofoapoo AKA "can you all stop playing coco"',
				'mofoapoo AKA "One time, I tried leaving all games with coco in them"',
				'mofoapoo AKA "coco can tank well"',
				'mofoapoo AKA "no character comes close to Coco since 2.8"',
				'mofoapoo AKA "Coco is ezmode instant win for all the mediocre players so everyone picks her and wins the game by hitting blaze and moving around like an idiot"',
				'mofoapoo AKA "it taught us that whoever has the most cocos always wins"',
				'mofoapoo AKA "Coco is obviously the top most broken naut"',
				'mofoapoo AKA "coco had a lot of nerfs and is still broken"',
				'mofoapoo AKA "Coco is broken. Her only broken competitor is vinnie"',
				'mofoapoo AKA "people who lag a lot migrate to coco thinking they are just really good"',
				'mofoapoo AKA "I don\'t think banana is a problem"',
				'mofoapoo AKA "I keep getting people from all over with 300+ ping speaking some sort of language"',
				'mofoapoo AKA "carpet is great"',
				'mofoapoo AKA "Skree is all sorts of weird kinds of broken"',
				'mofoapoo AKA "the fact that you say stuff like scrub and noob makes it very hard to take you seriously"',
				'mofoapoo AKA "burst really isn\'t the issue in this game"',
				'mofoapoo AKA "coco killing everything just by being in the area"',
				'mofoapoo AKA "RBAY can easily be dealt with by simply not shooting at froggy"',
				'mofoapoo AKA "saying RBAY should be taken out is silly"',
				'mofoapoo AKA "RBAY gives frog variety and it\'s very useful against cheap tactics that would otherwise make frog completely useless"',
				'mofoapoo AKA "I don\'t even really think silver coating is the problem"',
				'mofoapoo AKA "all you need to do is make blaze deal less damage to fix her"',
				'mofoapoo AKA "penny doesn\'t have burst"',
				'mofoapoo AKA "When I saw that coco got out of a 3 man burst mostly unphased, I left the game"',
				'mofoapoo AKA "lets focus on how coco is now more gamebreaking than leon ever was"',
				'mofoapoo AKA "coco got double hit by skree\'s blade twice, 700 dmg vinnie dash, and evil eye from ayla, while she was AAing all 3 of them in a team battle and 3 droids and she came out almost at full life"',
				'mofoapoo AKA "coco can\'t be killed"',
				'mofoapoo AKA "froggy is balanced"',
				'mofoapoo AKA "yuri is op and up"',
				'mofoapoo AKA "coco\'s dot is broken"',
				'mofoapoo AKA "TL;DR my opinion is more correct than yours"',
				'mofoapoo AKA "pre-rework ayla was OP"',
				'mofoapoo AKA "Swiggins is only OP against bad players/teams that don\'t use teamwork"',
				'mofoapoo AKA "Pulse can have some good burst, but it\'s hard to land at a good time"',
				'mofoapoo AKA "if you are touching skree to his right, and the blade comes in from the left, you get hit by it. That\'s some stupid shenanigans right there"',
				'mofoapoo AKA "I don\'t wanna proof read this"',
				'mofoapoo AKA "Hammer is easy to dodge"',
				'mofoapoo AKA "fans don\'t know how to make things better"',
				'mofoapoo AKA "No one posting on this forum knows how to balance this game better"',
				'mofoapoo AKA "scoop\'s AA seems to do a lot of damage"',
				'mofoapoo AKA "you are so wrong that I want to believe you are just a troll"',
				'mofoapoo AKA "you are just mad that your OP character of choice isn\'t going to dominate every corner of this game"',
				'mofoapoo AKA "vinnie doesn\'t have a solar producing skill anymore"',
				'mofoapoo AKA "penny can only catch up to slow characters, half the nauts can outrun her"',
				'mofoapoo AKA "ted isn\'t a brawler. He\'s a nuker"',
				'mofoapoo AKA "How is it people consider penny an assassin?"',
				'mofoapoo AKA "If penny is an assassin, then so is lonestar, froggy, and ayla"',
				'mofoapoo AKA "all you need with voltar is knockback on healbot and you absolutely dominant unless your teammates are really shit"',
				'mofoapoo AKA "Obviously ted was meant to be a nuker. as his brawler aspects were nerfed the first patch after he was released"',
				'mofoapoo AKA "penny is also absolutely useless end game unless you have range upgrade to her AA, so that she can kinda be good at pushing"',
				'mofoapoo AKA "penny\'s not an assassin. She doesn\'t move fast enough, and doesn\'t have enough burst, even when speccing for burst"',
				'mofoapoo AKA "let\'s talk about the actual good and bad of the patch, instead of how much you don\'t like certain numbers"',
				'mofoapoo AKA "Sometimes, I\'m right next to an enemy rae and I don\'t hear her snipe warning at all because the ywere aiming down"',
				'mofoapoo AKA "healbot knockback is literally the most broken thing outside of everything about leon and vinnie"',
				'mofoapoo AKA "leon is super edgy and cool and popular, so they have to keep him OP"',
				'mofoapoo AKA "all they\'d need to do is punish people who lag, instead of let them get the advantage"',
				'mofoapoo AKA "You are probably a rae player. that\'s the only reason you\'d actually believe rae is balanced in anyway"',
				'mofoapoo AKA "ranged AA cocos are ridiculous"',
				'mofoapoo AKA "gnaw wasn\'t nerfed. He\'s still just as broken as ever"',
				'mofoapoo AKA "gnaw doesn\'t have enough hp unless you take pills"',
				'mofoapoo AKA "once a reconnecting player stops reconnecting, they don\'t go back to being normal players. They stay with a delay on all their attacks."',
				'mofoapoo AKA "Make taunting cooldown longer"',
				'mofoapoo AKA "I leave 90% of games because I\'m up against a 600 ping vinnie from yemen doing 100 damage tome while not even on my screen"',
				'mofoapoo AKA "Now there is debate if gnaw is actually over powered. He is."',
				'mofoapoo AKA "I have a simple solution that will fix gnaw completely. Make his weedlings not target neutral creeps."',
				'mofoapoo AKA "all you gotta do it turn on some downloads, and bam, easy snipes, ball lightnings, and dashes"',
				'mofoapoo AKA "I\'m going to play a game right now as leon with lifesteal, dmg, and attack speed, pills, solar tree, and piggy bank. Nothing else. and I\'m gonna win."',
				'mofoapoo AKA "raelynn has been op forever"',
				'mofoapoo AKA "I\'m glad all teh characters are out so they can focus on fixing the actual game"',
				'mofoapoo AKA "I really don\'t know how to fix this, but it\'s something that needs to be fixed"',
				'mofoapoo AKA "Double hitting with sawblade is broken, but I don\'t know how to fix this"',
				'mofoapoo AKA "skree is OP mostly because of his double blade hit"',
				'mofoapoo AKA "You have a Penny as your icon. So you are just mad that someone can actually stop Penny\'s unstoppable reign of terror."',
				'mofoapoo AKA "The reason you don\'t like skree is because he\'s a good counter to the OP characters penny, ted, and sentry"',
				'mofoapoo AKA "people more often lag as coco, vinnie, and rae"',
				'mofoapoo AKA "I want to go down in leagues just so i stop facing endless leon armies"',
				'mofoapoo AKA "Shotty is too strong"',
				'mofoapoo AKA "His shotgun should have only 2 shots. one of the upgrades should allow him to get to 5. that\'s how you fix Ted"',
				'mofoapoo AKA "leon can just stand in front of a turret, taking dmg, holding AA, and his life doesn\'t go down"',
				'mofoapoo AKA "I\'m a great genji main, and got to league 2"',
				'mofoapoo AKA "I\'m as skill with genji as these players are with their mains, but I literally go 0/6 on average in league 2"',
				'mofoapoo AKA "No character should be body blocked into a corner unable to move"',
				'mofoapoo AKA "penny is a better froggy g"',
				'mofoapoo AKA "RBAY is fun"',
				'mofoapoo AKA "Sentry\'s a worse offender than froggy"',
				'mofeapoo AKA "Bull and timerift cheese turrets WAY more cheesefully than RBAY ever could."',
				'mofoapoo AKA "they can\'t think of the simple counters that beginners learn early on in this game, while ignoring actual problems like timerift"',
				'mofoapoo AKA "gnaw weeding jungle isn\'t even an issue just because penny"']; 
	var rand = myArray[Math.floor(Math.random() * myArray.length)];
	var v = textNode.nodeValue;

	v = v.replace(/\bmofoapoo\b/g, rand);
	v = v.replace(/\bThe 's\b/gi, rand + "'s");
			
	textNode.nodeValue = v;
}