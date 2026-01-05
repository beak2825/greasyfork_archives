// ==UserScript==
// @name          Trophy Room Enhancer
// @namespace     FaxCelestis
// @description   Highlights, rearranges, and adds context to Trophy Room stuff
// @include       *animecubed.com/billy/bvs/trophyroom.h*
// @include       *animecubedgaming.com/billy/bvs/trophyroom.h*
// @grant         GM_addStyle
// @author        FaxCelestis and Terrec and Channel28
// @version       1.9
// 0.1 - possibly does things
// 0.2 - does those things better
// 1.0 - compvare rewrite by Terrec
// 1.1 - minor edits, addition of Syntherum
// 1.2 - bugfix
// 1.3 - added new trophies (WotAdventure EX and Acedia) by Channel28
// 1.4 - forgot to add One Twenty One - by Channel28
// 1.5 - new trophy (In Kaiju It Means Love) by Channel28
// 1.6 - new trophy (Superbia) by Channel28
// 1.7 - New domain - animecubedgaming.com - Channel28
// 1.8 - new trophy (Spirit of Ninja-Mas) by Channel28
// 1.9 - new trophies (HelperCats One & Two) by Channel28

// @downloadURL https://update.greasyfork.org/scripts/24837/Trophy%20Room%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/24837/Trophy%20Room%20Enhancer.meta.js
// ==/UserScript==
// force strict mode for Chrome functionality
"use strict";

// get player and password hash from html, unnecessary for anything this script uses ATM but still good to have
var player = document.getElementsByName("player")[1].value;
var pass = document.getElementsByName("pwd")[1].value;

// ["Trophy Name", Points, "Trophy Description" [, Gallery Number]]
var trophyList = [
    ["A-gah-gah-gah", 1, "Recover from negative HP via Veggies", 4],
    ["Adelheid", 1, "Get a yakuman without cheating", 6],
    ["Alone at Last", 1, "Take 1 Ally into the Tunnel", 12],
    ["Big Fudge", 1, "Get the Max Score in a Tsukiball game", 3],
    ["Bluff Boss", 1, "Showdown with High Card and have the opponent fold", 28],
    ["Board Breaker", 1, "Get a Triple Bullseye with a regular Kunai", 34],
    ["Both Shoulders", 1, "Spin the wheel with both Billy and The Rack", 31],
    ["Buggin", 1, "Hang out with Bugman Lvl. 2 via MPB", 70],
    ["Call it a Comeback", 1, "Defeat a Titan with 10 or less HP remaining", 49],
    ["Checking It Twice", 1, "Visit the Trophy Room with both Maximum Naughtiness and Niceness awards at once", 21],
    ["Clipper", 1, "Use a Daily Fail coupon to buy 1 Kunai and get 1 free", 22],
    ["Completionist 11", 1, "Have 50+ 1-Point Trophies on the Trophy Page", 40],
    ["Completionist II", 1, "Have 20+ 1-Point Trophies on the Trophy Page", 53],
    ["Completionist III", 1, "Have 30+ 1-Point Trophies on the Trophy Page", 45],
    ["Consolation Prize", 1, "Win 500,000 Ryo in a game of SNAKEMAN or No SNAKEMAN", 46],
    ["Conssssolation", 1, "Take the deal with SNAKEMAN in your bucket", 20],
    ["Counting Carbs", 1, "Drink Diet Soda with 0 Greass", 24],
    ["Dark Victor", 1, "Win an Arena Fight during the Dark Hour", 33],
    ["Dead Man Walking", 1, "Defeat 100 Zombjas in one map without an equipped weapon", 42],
    ["Dressed to Kill", 1, "Start a con with 11 complete cosplay costumes", 64],
    ["Einhorn is Finkle", 1, "Get 11 Pets", 56],
    ["Enough Already", 1, "Loop to Season 111", 36],
    ["Everybody Out", 1, "Checkout 6+ customers at once", 48],
    ["Fired on Friday", 1, "Rage out with 1 Time remaining", 58],
    ["First?", 1, "Get 1st Place in First Loser", 29],
    ["Flushed", 1, "Discard an entire Royal Flush at once", 43],
    ["Forever Alone", 1, "Go in the Tunnel alone", 30],
    ["Four Day Weekend", 1, "Vacation Thursday, Friday, Saturday, and Sunday", 13],
    ["Four Seasons", 1, "Get 50 or more points in one Flower Wars hand", 47],
    ["Gallery II", 20, "Complete the second Snooty Gallery artwork"],
    ["Gone", 1, "Finish a Crazy Hard ride within 60 seconds", 55],
    ["Handoff", 1, "Have A A Ron check out your last customer", 68],
    ["Hard Worker", 1, "Do 11 S-Rank Missions in one day", 60],
    ["Hero's Reward", 1, "Turn in 1 S-Rank Emblem successfully", 67],
    ["High Summoner", 1, "Summon 11 summons in a day", 38],
    ["I Miss You Already", 1, "Change your Team to the same Team you just had", 25],
    ["In Phase", 1, "Defeat 2 Phases in one day", 69],
    ["Indecisive Reaper", 1, "Change to all four Reaper States in one day", 17],
    ["Independent Contractor", 1, "Sell a Village Contract", 27],
    ["Just a Piece", 1, "Share Delicious Cake", 35],
    ["Killed to Dress", 1,"Start a con with 111 complete cosplay costumes", 37],
    ["KTHXBAIman", 1, "Bust out a Mahjong opponent with a Baiman", 62],
    ["Legen..dary", 1, "111+ Successes on a Crank 11 S-Rank Mission", 63],
    ["Long Day Ahead", 1, "Consume something that brings you to 11,000+ Stamina", 66],
    ["Low Roller", 1, "Get 6+ Pachinko Comps in one turn-in", 2],
    ["Lucre Libre", 1, "Throw a Lucha Fight", 41],
    ["Many Hands", 1, "Fully load the truck with zero injury", 26],
    ["Meddling Kids", 1, "Beat an S-Rank Mission with Lvl 3. Billy, Pinky, and Stalkergirl", 16],
    ["Mercenary", 1, "Turn in 111+ contracts at once", 19],
    ["Movin' On Up", 1, "45+ Lvl. 2 or greater Allies on the Team Page", 14],
    ["One Man Army", 1,"Win 111 arena matches in one day", 54],
    ["Palate Cleanser", 1, "Drink 12 or more different Juice Types at once", 32],
    ["Popular", 1, "Visit your Team Page while hanging out with 11+ Allies", 5],
    ["Psychological Issues", 1, "Trapdoor your future self", 52],
    ["Rave Grandmaster", 1, "Get 11,000+ in the Rave", 59],
    ["Sacred Hang", 1, "Visit your special Field", 10],
    ["Self Five", 1, "Attempt to Walk Together with yourself", 39],
    ["Showoff", 1, "Visit the Party House with over 11,000,000 Ranking XP", 11],
    ["Stupid Devil Machines", 1, "Kick the Crane Machine with your last 2 Stamina", 7],
    ["Super Failure", 1, "SuperFail on Attempt 2", 18],
    ["Surefire Strategy", 1, "Have a bet on all possible spins in Roulette", 23],
    ["That Was Easy", 1, "Say 'Trophy' in Hidden Forbidden Holy Ground", 51],
    ["The Most Dangerous Strut", 1, "Escape the Squee during a four hour hunt", 50],
    ["The Pizza Is Not Enough", 1, "Successfully create an Ultimate Pizza", 65],
    ["Tsk-Ts.. Oh.", 1, "Have a clean store when a Tsk-Tsk Tsks", 61],
    ["Two Weeks Notice", 1, "Take a Vacation with 14+ days on the timer", 15],
    ["Universal Acclaim", 1, "Have 99+ Allies on the Team page", 44],
    ["Value Meal", 1, "Eat 4 different Greassy Items in a row", 9],
    ["Vwom", 1, "Attack with an 11Saber", 8],
    ["Work Angry", 1, "Clear all customers with 200+ Rage", 57],
    ["HelperCats One", 5, "Get the first row of HelperCats"],
    ["HelperCats Two", 5, "Get the second row of HelperCats"],
    ["S-1", 5, "Get the Season One Collection"],
    ["S-2", 5, "Get the Season Two Collection"],
    ["S-3", 5, "Get the Season Three Collection"],
    ["S-4", 5, "Get the Season Four Collection"],
    ["S-5", 5, "Get the Season Five Collection"],
    ["Acedia", 10, "Complete RG Day One"],
    ["Baton Pass", 10, "Get the Red Skull Pin"],
    ["Brothers in Arms", 10, "Beat Difficulty 11 in Infinite Retail"],
    ["EGOT", 10, "Win all roles in BillyTV at least once"],
    ["Employee of the Week", 10, "Bought in the Black Friday Shop"],
    ["Fruit Dealer", 10, "Eat Fresh Fruit with 50+ Cool"],
    ["Fully Cranked", 10, "Defeat a Mission at Maximum Crank"],
    ["Gallery I", 10, "Complete the first Snooty Gallery Artwork"],
    ["Gift Giver", 10, "Gave a Sho Nuff Elixir / Over 11000 for Hidden HoClaus"],
    ["Huzzah", 10, "Save Mimi"],
    ["In Kaiju It Means Love", 10, "Have 11 different tattoo touchup additions at once"],
    ["Land a Whale", 10, "Check out a Whale in Retail"],
    ["Quantum Loop", 10, "Get Bugman Lvl. 2"],
    ["Smile For The Camera", 10, "Got a Bromide on Candyween"],
    ["Spirit of Ninja-Mas", 10, "Complete the Twelve Days of Ninja-Mas 2"],
    ["Superbia", 10, "Complete RG Day Two"],
    ["The Unthinkable", 10, "I can't even bring myself to explain."],
    ["WotAdventure EX", 10, "Defeat a WotAdventure witth Difficulty 1 or greater"],
    ["In One Piece", 11, "Drink Syntherum"],
    ["If I Could Turn Back Time", 20, "Get the Pocketwatch working again"],
    ["Okkusenman", 20, "Achieve a Rank of S against a WorldKaiju"],
    ["One Twenty One", 20, "Level A Leven to Power 11"],
    ["Pierce The Heavens", 20, "Arrive in the AboveGround"],
    ["Rising Sun", 20, "Defeat Triple H in Mahjong"],
    ["Scrapbook Hero", 20, "Got all Six Bromides"],
    ["TACOCAT", 20, "Defeat the OCAT"],
    ["The Festival", 20, "Defeated the Eleven Tails at The Festival"],
    ["The Sky Will Strike", 20, "Achieve Protagonist Rank"],
    ["Tiny Three", 20, "Bank 3+ different Tiny Bee Weapons"],
    ["Choosing Sides", 60, "Gain the Fate or Destiny Bloodline"]
];

var trophydiv = document.getElementById('trophydiv');
var trophyTable = trophydiv.firstElementChild;

while(trophyTable.rows[trophyTable.rows.length-1].innerHTML.indexOf('0x.jpg') > -1){
    var tr = trophyTable.rows[trophyTable.rows.length-1];
    var td = tr.cells[1];
    var name = td.children[0].textContent;
    var points = td.children[1].firstElementChild.textContent;
    var desc = td.children[2].nextSibling.textContent.substr(1);
    trophyList.push([name,points,desc]);
    trophyTable.deleteRow(-1);
    trophyTable.deleteRow(-1);
}

//Make sure the array is sorted
trophyList.sort(function(a, b) {
    if(a[1] === b[1]){
        if(a[0].toLowerCase() > b[0].toLowerCase()){
            return 1;
        }
        if(a[0].toLowerCase() < b[0].toLowerCase()){
            return -1;
        }
        return 0;
    }
    return a[1] - b[1];
});

//Returns the number of 1 Point Trophies earned
var singlePointers = (trophydiv.innerHTML.match(/<font color="00A100">1<\/font>/gm) || []).length;

//Grabs current Awesome and calculates maxAwesome
var curAwesome = parseInt(/Awesome Awarded: (\d+)/.exec(document.body.textContent)[1],10);
var maxAwesome = curAwesome;
var TheEleven = /Bonus for \d+ The Eleven\: \+(\d+) Awesome!/.exec(document.body.textContent);
if(TheEleven) {
    maxAwesome -= parseInt(TheEleven[1],10);
}

var expand = trophydiv.previousElementSibling.cloneNode(true);
expand.innerHTML = expand.innerHTML.replace("Trophy List","Missing Trophies");
expand.innerHTML = expand.innerHTML.replace("trophydiv","missingdiv");
var missingdiv = trophydiv.cloneNode(false);
missingdiv.id = "missingdiv";
var table = missingdiv.appendChild(trophydiv.firstElementChild.cloneNode(false));

for(var i of trophyList){
    if(trophydiv.innerHTML.indexOf('<b>' + i[0] + '</b>') === -1){
        //Give Completionist I its gallery number
        if(i[0] === "Completionist I")
            i.push(1);
        
        var temp = "";
        temp += "<td width=80><img src=\"/billy/layout/trophies/0x.jpg\"></td><td style=\"color:000000\"><i><b>";
        temp += i[0];
        temp += "</b></i> : <b><font color=00A100>";
        temp += i[1];
        temp += "</font> Point";
        if(i[1] !== 1)
            temp += "s";
        temp += "</b><br>";
        temp += i[2];
        if(i[3]){
            if(!document.forms.namedItem("showart")){
                var span = document.evaluate("(//span[img[contains(@src,'artblock"+i[3]+"')]])", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if(span){
                    if(span.title){
                        span.title = span.title.replace("???",i[0]);
                        span.title = span.title.replace("???",i[2]);
                    }
                    if(span.boHDR){
                        span.boHDR = span.boHDR.replace("???",i[0]);
                    }
                    if(span.boBDY){
                        span.boBDY = span.boBDY.replace("???",i[2]);
                    }
                }
            }
            temp += " (Gallery #" + i[3] + ")";
        }
        temp += "</td>";
        table.insertRow(-1).innerHTML = temp;
        table.insertRow(-1).innerHTML = "<td colspan=2 align=center><img src=\"/billy/layout/missionbar/blackbar.gif\" width=460 height=1></td>"
        
        maxAwesome += i[1];
    }
}
table.deleteRow(-1);

//Insert the missing trophies table
var font = document.evaluate("(//font[contains(.,'Awesome Abilities')])[last()]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
font.parentNode.insertBefore(expand,font);
font.parentNode.insertBefore(missingdiv,font);
font.parentNode.insertBefore(document.createElement("hr"),font);