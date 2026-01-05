// ==UserScript==
// @name       Smut Orc Fixer Deluxe (FF)
// @namespace  http://greasyfork.org/
// @version    0.3.5
// @description  Fixes the smut orcs, using Greasemonkey in Firefox.
// @include    *://*.kingdomofloathing.tld/*
// @include    *://*.coldfront.tld/*
// @include    http://127.0.0.1:60080/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4249/Smut%20Orc%20Fixer%20Deluxe%20%28FF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4249/Smut%20Orc%20Fixer%20Deluxe%20%28FF%29.meta.js
// ==/UserScript==

var replaceArry = [
    [/Smutorc_jacker.gif/gi, "Cray_orc.gif"],
    [/Smutorc_nailer.gif/gi, "Cray_orc.gif"],

    [/This orc is in charge of cutting down, or "jacking," the lumber used in smut orc construction. He's not a jacker-of-all-trades, just the lumberjack trade./gi, "This is an orc."],
    [/For lunch he enjoys flapjacks, apple jacks, and jackfruit./gi, ""],
    [/He splits a log with his axe. One part hits you in the /gi, "He attacks, hitting you in the "],
    [/, and one in the /gi, "and the "],
    [/He hits you in the nipple with his lumberjack axe. Those are the facts./gi, "He attacks."],
    [/He axes you in the /gi, "He attacks, hitting you in the "],
    [/You wish he would have axed you a question instead. /gi, ""],
    [/He cuts down a tree and it lands on your /gi, "He attacks, hitting you in the "],
    [/, jacking you up pretty seriously/gi, ""],
    [/He pounds a handful of stakes into you to use as footholds to climb up your body. The entire process is quite unpleasant./gi, "He attacks. Critical hit."],
    [/He tries to axe you in the /gi, "He attacks, attempting to hit you in the "],
    [/but he's too lax in his axing./gi,  "but misses."],
    [/He yells, "timberrrrrr!" which gives you plenty of time to get out of the way./gi, "He misses."],
    [/He tries to hit you with his lumberjack axe, but you axe him why he wants to do that./gi, "He misses."],
    [/He splits a log with his axe. At least he isn't splitting hairs./gi, "He misses."],
    [/You point out that with all the jacking he's doing, he's been neglecting his lumbering. He lumbers off to correct the issue./gi, "He fumbles."],
    [/This orc is in charge of affixing one piece of wood to another. He does so by driving sharpened bits of metal through both pieces, using a striking implement called a hammer.g/gi, "This is an orc."],
    [/As long as he's carrying this hammer around, every problem looks like a nail, including you./gi, ""],
    [/He nails your/gi, "He attacks, hitting you from your "],
    [/Inconvenient and painful!/gi, ""],
    [/He uses the nail-pulling claw on the back of his hammer to stab you in the /gi, "He attacks, hitting you in the "],
    [/He hammers in the morning, the evening, and on your/gi, "He attacks, hitting you in the"],
    [/He hits you with his ball-peen hammer. The attack is as painful as the tool name is funny./gi, "He attacks."],
    [/He pounds so many nails into your skull that you start looking for puzzle boxes to open./gi, "He attacks. Critical hit."],
    [/He tries to nail your/gi, "He attempts to attack and hit you from your "],
    [/but hits his thumb instead./gi, "but misses."],
    [/He tries to use the nail-pulling claw on his hammer to claw you, but you dodge./gi, "He misses."],
    [/He tries to hammer your /gi, "He attempts to attack and hit you in the "],
    [/but is too hammered to accomplish it./gi, "but misses."],
    [/You say "ball-peen hammer," and the smut orc starts giggling too much to hit you./gi, "He misses."],
    [/He hits his thumb with the hammer, then drops the hammer and it lands on his foot. He hops around swearing for a few minutes while you laugh./gi, "He fumbles."],
    [/This smut orc digs trenches and places a series of waterproofed wooden pipes in them, to make the orcish sewer and water system work. And, y''know, to make sure the sewer and fresh water systems are actually two different systems. That's the important part./gi, "This is an orc."],
//    [/two <i>different<\/i> systems/gi, "foobie bletch"],
    [/He digs a trench straight through your /gi, "He attacks, hitting you in the "],
    [/and carefully lays a length of pipe in there./gi, ""],
    [/He hits you with one calloused, work-roughened hand. You almost wish he'd have hit you with the pipe instead./gi, "He attacks."],
    [/He lays some pipe. Specifically, he lays it about three inches into the top of your skull. /gi, "He attacks."],
    [/He jams a length of pipe into your chest, making your respiratory system part of the orcish sewage system for a few disgusting minutes./gi, "He attacks. Critical hit."],
    [/He clobbers you with a length of wooden pipe. Turns out he's a clobberer cobbler as well as a pipelayer./gi, "He attacks."],
    [/He tries to dig a trench through your/gi, "He attempts to attack and hit you in the"],
    [/your trenchant protestations make him stop./gi, "misses"],
    [/He tries to just haul off and hit you in the face, but he's a pipe layer, not a fighter./gi, "He misses."],
    [/He tries to lay into you with a pipe, but you tell him to lay off./gi, "He misses."],
    [/He tries to clobber you with a pipe, but it's not clobberin' time, so he has some peach cobbler instead./gi, "He misses."],
    [/He punches a nearby time clock, takes out his lunch, and takes his time eating it. Dang union s/gi, "He fumbles"],
    [/He punches a nearby time clock, takes out his lunch, and takes his time eating it. Dang unions/gi, "He fumbles"],
    [/This orc affixes pieces of wood together with screws and a screwdriver, and a screwdriver to drink while he works/gi, "This is an orc"],
    [/He puts the screws to you, literally./gi, "He attacks."],
    [/He stabs you with the phillips tip of his screwdriver, leaving a cross-shaped wound. Well, at least now your head repels vampires./gi, "He attacks."],
    [/He drives a three-inch screw into your/gi, "He attacks, hitting you in the"],
    [/, and makes it hurt./gi, ""],
    [/He stabs you with the standard tip of his screwdriver, leaving a little rectangular hole in your/gi, "He attacks, hitting you in the"],
    [/He puts his screwdriver tip into your belly button and unscrews it until your butt falls off. It's hilarious to anyone watching, but pretty painful for you./gi, "He attacks. Critical hit."],
    [/He tries to put the screws to you, but is such a screwball that he screws it up./gi, "He misses."],
    [/He tries to stab you in the/gi, "He attempts to attack and hit you in the"],
    [/with his phillips tip, but you tell him your/gi, "but he misses your"],
    [/uses a 3.5mm Allen wrench or nothing/gi, ""],
    [/He tries to drive a three-inch screw into your/gi, "He attempts to attack and hit you in the"],
    [/you laugh at how short it is/gi, "misses"],
    [/He tries to stab you with the standard tip on his screwdriver, but you tell him your/gi, "He attempts to attack and hit you in the"],
    [/only takes phillips/gi, "but misses"],
    [/He forgets which way is tighty and which way is loosey, and tries to unscrew a screw into your/gi, "He attempts to attack and hit you in the"],
    [/with little success/gi, "but fumbles"],
    [/This orc has such a filthy mind that he's able -- though it's quite a stretch -- to make dirty jokes and innuendos about everything from the orc's jobs to their building materials. The other orcs take such offense at his jokes that he's forced to hide from them. He usually hides deep in a bush, or perhaps down and dirty in a trench./gi, "This is an orc."],
    [/He lays some pipe on you, giggling all the while./gi, "He attacks."],
    [/He screws a screw into you, winking and asking if you "get it."/gi, "He attacks."],
    [/He squirts his caulk in your mouth, laughing uproariously./gi, "He attacks."],
    [/He tells a joke about helping his Uncle Jack off a horse, sniggering so hard he can barely speak./gi, "He attacks."],
    [/He whips out his caulking gun and covers you in caulk, winking and nudging you so hard you get bruises./gi, "He attacks. Critical hit."],
    [/He tries to tell you a dirty joke, but your ears are dirty enough that you're unfazed./gi, "He misses."],
    [/He tries to screw a screw into you, but he's too screwy and screws it up./gi, "He misses."],
    [/He tries to squirt his caulk in your mouth, but you tell him not to be so caulky./gi, "He misses."],
    [/He runs out of caulk, and declines to make a joke about that particular situation. He just runs off to fill up the gun again./gi, "He fumbles."],
    [/You're fighting a smut orc/gi, "You're fighting an orc"],
    [/When you do as much jacking as a smut orc, it really takes a toll on your hands -- scrapes, callus, blisters, and so forth. The orcs use this hand lotion to keep their palms supple and rosy./gi, "This is an orcish item."],
    [/Hairy Palms/gi, "Orcish Regen Buff"],
    [/seems to have an odd side-effect on humans -- it causes hair to grow out of your palms./gi, "gave you this buff."],
    [/Oh well, it could have been worse, it could have made you go blind./gi, ""],
    [/bone, gnarled and twisted from years of repetitive motions. It retains some of its original owner's preference for privacy, and gets really unhappy when there are other orcs around/gi, ""],
    [/This is an exceptionally long wood screw, galvanized for extra rigidity. You wouldn't want the thing snapping off halfway through, would you?/gi, "This is a screw."],
    [/This is two pieces of wood placed against each other, or "butted" together, with wood glue somewhat carelessly thrown in to make them stick./gi, "This is a joint."],
    [/This is a piece of lumber that was jacked from a Sunrise tree. Sunrise trees absorb moisture from the air throughout the night, so by dawn every branch is dense and rigid./gi, "This is a plank."],
    [/This is a plank of lumber that was jacked from a Bully tree, so named because its sharp spiny leaves almost seem to go out of their way to attack passersby./gi, "This is a plank."],
	[/is five times more dense than baconstone; it's almost as dense as actual bullies./gi, ""],
    [/This is a tube of an industrial sealant\/waterproofing agent. It is used to fill small gaps in wood, smooth out imperfections, and provide a moisture barrier between surfaces. This particular caulk is exceptionally thick, and is black to better blend in with the orc's construction projects./gi, "This is caulk."],
    [/The 'L' is not silent, but it is snickering behind its back./gi, ""],
    [/This is a piece of lumber that was jacked from a Surprise tree, a hardy species that springs up from the ground, seemingly overnight, where no flora had grown before./gi, "This is a plank."],
    [/The smut orc nailers discovered that you could more easily keep the wood from cracking and splintering if you give your nails a thin coat of mineral-oil lubricant. After all, when you're nailing something, the last thing you want is a splinter in your caulk./gi, "This is an orcish item."],
	[/Well-Lubed/gi, "Orcish Weapon Damage Buff"],
    [/A thin coat of oil on your weapon will keep it from sticking on any tight chinks of your opponents' armor, or getting it stuck between a couple of ribs. There's nothing more awkward in battle than having to say, "so, if you could just turn your torso to the left a little, I could have my sword back, and then we can fight more."/gi, "This is an orcish buff."],
    [/The smut orc nailers use this device to locate hidden studs, so they don't accidentally miss while nailing them./gi, "This is an orcish item."],
    [/The smut orc pipelayers use these thin sheets of rubber to insulate and protect their pipes, preventing unwanted transmission of fluids./gi, "This is an orcish item."],
    [/Using Protection/gi, "Orcish MP Cost Buff"],
    [/A thin rubber sheath over your staff should help keep the magical energies from escaping./gi, "This is an orcish buff."],
    [/You wrap the rubber around your wand (or staff) to keep the magic from leaking out./gi, "You use the orcish item."],
    [/You liberally oil up your weapon with the orcish nailing lube./gi, "You use the orcish item."],
    [/You rub the orcish hand lotion into your palms. It feels nice, until hair starts growing out of them./gi, "You use the orcish item."],
    [/The smut orc pipelayers, besides constructing the sewer and water lines, are also in charge of periodically clearing contaminants out of the water supply, such as the wild oysters that occasionally collect there./gi, "This is an orcish item."],
    [/This is like a regular screwdriver, but made with high-test moonshine instead of vodka./gi, "This is an orcish drink."],
    [/You pour the backwoods screwdriver into your purty mouth, and the flavor makes you squeal like a pig!/gi, "You drink the orc drink."],
    [/A pooch is like a pouch, but smaller and for a specific purpose. The smut orc screwers use them to store screws and screwing-related necessities, such as lube and spare driver heads./gi, "This is an orcish item."],
    [/This is the smut orc's most precious possession, a box in which to store his construction keepsakes. It's a pretty big box, but there's a lot to put in it, so it ends up being a tight fit./gi, "This is an orcish keepsake box."],
    [/So the smut orc pervert wears these glasses, then goes around winking at people all the time. Nobody said he was the sharpest orc in the box./gi, "This is a pair of orc sunglasses."],
    [/Putting the Orc in Porcine/gi, "Orcish Disguise Buff"],
    [/You put on the smut orc glasses. Until you lose them (which inevitably happens with sunglasses), you're going to look like a smut orc pervert. Why you would want to is your own business./gi, "You use the orc sunglasses."],
    [/You look like that chauvinist-pig joke-teller, the Smut Orc Pervert. For the record, the Pervert just has a dirty mind. He's not, like, some kind of sex offender or something. He just enjoys a good innuendo. Y'all can relax./gi, "This is an orcish buff."],
    [/Behind one of the innumerable sheds and cabins of the Smut Orc logging camp, you find a stash of building materials lying on the ground next to a tree. There's a heart carved into the tree's trunk with the letters S and M in the middle./gi, "Something happens."],
    [/Before your brain gets a chance to start speculating, you grab the goods and beat feet./gi, "Something else happens. Then you leave."],
    [/smut/gi, ""],
    [/jacker/gi, ""],
    [/nailer/gi, ""],
    [/pipelayer/gi, ""],
    [/screwer/gi, ""],
    [/pervert/gi, ""],
    [/hand lotion/gi, "item"],
    [/wrist/gi, "item"],
    [/long hard/gi, ""],
    [/messy butt/gi, ""],
    [/morningwood/gi, ""],
    [/raging hardwood/gi, ""],
    [/thick caulk/gi, "caulk"],
    [/weirdwood/gi, ""],
    [/nailing lube/gi, "item"],
    [/stud-finder/gi, "item"],
    [/orcish rubber/gi, "orcish item"],
    [/freshwater pearl necklace/gi, "orcish item"],
    [/screwing pooch/gi, "orcish item"],
    [/backwoods screwdriver/gi, "orcish drink"],
    [/S&M/gi, "REDACTED"],
    [/jacking,/gi, ""],
    [/length of bent pipe/gi, "orcish bounty item"],
];
var numTerms    = replaceArry.length;
var txtWalker   = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {   acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() )
                return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode     = null;

while (txtNode  = txtWalker.nextNode () ) {
    var oldTxt  = txtNode.nodeValue;

    for (var J  = 0;  J < numTerms;  J++) {
        oldTxt  = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    txtNode.nodeValue = oldTxt;
}