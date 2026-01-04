// ==UserScript==
// @name         Tools: Omod
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      2.0
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/452467/Tools%3A%20Omod.user.js
// @updateURL https://update.greasyfork.org/scripts/452467/Tools%3A%20Omod.meta.js
// ==/UserScript==

// GLOBAL STYLING

GM_addStyle ( `
#accordionExample > li:nth-child(8) > a:hover{background:#1A1C2D !important;}
`);

// MOXXIVISION 2.0

if (document.URL.indexOf("earnfreepoints") != -1 ) {

$("body").append ( `
<div id="Xmoxxivision">
LOADING GREATNESS: <span id="loading">0</span>%<p>
</div>
` );

$("body").append ( `
<div id="vision">
<span id="loading_chars"></span><p>
</div>
` );

$("body").append ( `
<div id="mv2">
MOXXI
</div>
` );

GM_addStyle ( `
#mv2 {position:fixed !important; left: 0px !important; top: 10px !important;font-size: 15vw !important;width: 100% !important;height: 100% !important;z-index:-100 !important;color:#0F0F0F !important;writing-mode: vertical-rl;}
#moxxivision {display:none !important;}
#button {display:none !important;}
#sidebar{display:none;}
#recentraid{display:none;}
#rightbar{display:none;}
#charid{display:none !important;}
#moxxivision > tbody > tr > th{padding-top:3px;padding-bottom:3px;padding-left:5px;padding-right:10px;background:#1A1C2D;border:1px SOLID #202020;font-size:12px}
#moxxivision > tbody > tr > td{padding-top:3px;padding-bottom:3px;padding-left:5px;padding-right:10px;background:#0F0F0F;border:1px SOLID #202020;font-size:12px}
#container > div.sidebar-wrapper.sidebar-theme{display:none;}
body > center > div.sub-header-container{display:none;}
.column > img{height:25px !important;width:25px !important; background:#060606 !important;}
.column {display:none !important;}
.home {display:revert !important;}
.spans > p{color:#666666 !important;font-size:10px !important;margin-bottom:-5px !important;}
#content{position: relative;width: 100%;flex-grow: 8;margin-top: 0px;margin-bottom: 0;margin-left: 0px;max-width: 100%;transition: .6s;}
#container {position: relative !important;margin-top: 70px !important;}
.button{background:#0F0F0F !important;color:#ffffff !important;padding:5px !important;margin-bottom:10px !important;margin-top:10px !important;margin-left:2px !important;margin-right:2px !important;}
.column_button{background:#0F0F0F !important;color:#ffffff !important;padding:1px !important;font-size:9px !important;padding-right:3px !important;padding-left:3px !important;}
.button:hover{background:#1A1C2D !important;}
.column_button:hover{background:#f441be !important;}
#button1 {color:#f441be !important;}
#Xmoxxivision {position:fixed !important; left: 0px !important; top: 0px !important;padding:100px !important;background:#0F0F0F !important;font-size: 28px !important;width: 100% !important;height: 100% !important;}
#vision {position:fixed !important; left: 20px !important; top: 200px !important;font-size: 10vw !important;width: 100% !important;z-index:100 !important;}
.mv2dd {position: relative;display: inline-block;}
.vision-content {display: none;position: absolute;background-color: #404040;min-width: 200px;box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);z-index: 1;font-size: 12px;margin-top: -9px;}
.vision-content a {color: black;text-decoration: none;display: block;}
.vision-content a:hover {background-color: #f1f1f1}
.mv2dd:hover .vision-content {display: block;}
.upgrade{background:#1B2E4B !important;}
#loading_chars{color:#202020}
body{overflow-y: hidden;}
`);

fetch("myaccount")
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const chars = doc.querySelector("#zero-config").innerHTML.matchAll(/suid=([0-9]+)&amp;serverid=[0-9]+"><strong>PLAY!/g)

var charids = '';
for (const match of chars) {charids += `<tr><td id="charid">`+match[1]+`</td></tr>`}

var content = document.querySelector("#content")

content.innerHTML = `

<div id="button">
<button id='button1' class='button'>HOME</button>
<button id='button2' class='button'>STATS</button>
<button id='button3' class='button'>SKILLS</button>
<button id='button4' class='button'>EQUIPMENT</button>
<div class="mv2dd">
<button class="button">SLOTS</button>
<div class="vision-content">
<button id='button5' class='button'>CORE</button>
<button id='button6' class='button'>HEAD</button>
<button id='button7' class='button'>NECK</button>
<button id='button8' class='button'>WEAPON</button>
<button id='button9' class='button'>BODY</button>
<button id='button10' class='button'>SHIELD</button>
<button id='button11' class='button'>PANTS</button>
<button id='button12' class='button'>BELT</button>
<button id='button13' class='button'>RING</button>
<button id='button14' class='button'>FOOT</button>
</div></div>
<button id='button15' class='button'>GEM</button>
<button id='button16' class='button'>RUNE</button>
<button id='button17' class='button'>ORB</button>
<button id='button18' class='button'>BADGE</button>
<button id='button19' class='button'>BOOSTER</button>
<button id='button20' class='button'>CREST</button>
<button id='button21' class='button'>BACKPACK</button>
<button id='button22' class='button'>POTIONS</button>

<button id='button23' class='button'>COLLECTIONS</button>
<button id='button24' class='button'><a href='home'>EXIT</a></button>
</div>
<table id="moxxivision"><tr>
<th id="charid">CHAR ID</th>
<th class="freeze">CHAR NAME&#9662;</th>
<th class="freeze">LVL&#9662;<span id="math_lvl" class="spans"></span></th>
<th class="home column">SKILLS&#9662;</th>
<th class="home column">CLASS&#9662;</th>
<th class="home column">CREW&#9662;</th>
<th class="home column">EQ&#9662;</th>
<th class="home column">RAGE&#9662;</th>
<th class="home column">TO MAX&#9662;</th>
<th class="home column">GROWTH TODAY&#9662;<span id="math_today" class="spans"></span></th>
<th class="home column">YESTERDAY&#9662;<span id="math_yesterday" class="spans"></span></th>
<th class="home column">STRENGTH&#9662;</th>
<th class="home column">SUPPLIES&#9662;<br><button id='buttonx' class='column_button'>MAX ALL</button></th>
<th class="stats column">EXPERIENCE&#9662;</th>
<th class="stats column">TO LEVEL&#9662;</th>
<th class="stats column">MAX RAGE&#9662;<span id="math_mr" class="spans"></span></th>
<th class="stats column">POWER&#9662;<span id="math_power" class="spans"></span></th>
<th class="stats column">ELE DMG&#9662;<span id="math_ele" class="spans"></span></th>
<th class="stats column">ATTACK&#9662;<span id="math_atk" class="spans"></span></th>
<th class="stats column">HIT POINTS&#9662;<span id="math_hp" class="spans"></span></th>
<th class="stats column">CHAOS&#9662;<span id="math_chaos" class="spans"></span></th>
<th class="stats column"><font color=#00FFFF>RES&#9662;</th>
<th class="stats column"><font color=#FFFF00>RES&#9662;</th>
<th class="stats column"><font color=#7e01bc>RES&#9662;</th>
<th class="stats column"><font color=#FF0000>RES&#9662;</th>
<th class="stats column"><font color=#00FF00>RES&#9662;</th>
<th class="stats column">WILDERNESS&#9662;<span id="math_wilderness" class="spans"></span></th>
<th class="stats column">SLAYER&#9662;<span id="math_slayer" class="spans"></span></th>
<th class="skills column">TOME&#9662;</th>
<th class="skills column">ACTIVE SKILLS&#9662;</th>
<th class="eq column">CORE</th>
<th class="eq column">HEAD</th>
<th class="eq column">NECK</th>
<th class="eq column">WEP</th>
<th class="eq column">BODY</th>
<th class="eq column">SHIELD</th>
<th class="eq column">PANTS</th>
<th class="eq column">BELT</th>
<th class="eq column">RING</th>
<th class="eq column">FOOT</th>
<th class="eq column">GEM</th>
<th class="eq column">RUNE</th>
<th class="eq column">ORB</th>
<th class="eq column">ORB</th>
<th class="eq column">ORB</th>
<th class="eq column">BADGE</th>
<th class="eq column">BOOST</th>
<th class="eq column">CLONED&#9662;</th>
<th class="eq column">OPEN AUG&#9662;<span id="math_openaugs" class="spans"></span></th>
<th class="core column">ITEM</th>
<th class="core column">NAME&#9662;</th>
<th class="core column">MR&#9662;</th>
<th class="core column">ATK&#9662;</th>
<th class="core column">ELE&#9662;</th>
<th class="core column">CHAOS&#9662;</th>
<th class="core column">VILE&#9662;</th>
<th class="core column">HP&#9662;</th>
<th class="core column">RES&#9662;</th>
<th class="core column">BLOCK&#9662;</th>
<th class="core column">eBLOCK&#9662;</th>
<th class="core column">RPT&#9662;</th>
<th class="core column">EPT&#9662;</th>
<th class="core column">RAMP&#9662;</th>
<th class="core column">CRIT&#9662;</th>
<th class="core column">GEMS&#9662;</th>
<th class="core column">OPEN AUG&#9662;</th>
<th class="core column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="head column">ITEM</th>
<th class="head column">NAME&#9662;</th>
<th class="head column">MR&#9662;</th>
<th class="head column">ATK&#9662;</th>
<th class="head column">ELE&#9662;</th>
<th class="head column">CHAOS&#9662;</th>
<th class="head column">VILE&#9662;</th>
<th class="head column">HP&#9662;</th>
<th class="head column">RES&#9662;</th>
<th class="head column">BLOCK&#9662;</th>
<th class="head column">eBLOCK&#9662;</th>
<th class="head column">RPT&#9662;</th>
<th class="head column">EPT&#9662;</th>
<th class="head column">RAMP&#9662;</th>
<th class="head column">CRIT&#9662;</th>
<th class="head column">GEMS&#9662;</th>
<th class="head column">OPEN AUG&#9662;</th>
<th class="head column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="neck column">ITEM</th>
<th class="neck column">NAME&#9662;</th>
<th class="neck column">MR&#9662;</th>
<th class="neck column">ATK&#9662;</th>
<th class="neck column">ELE&#9662;</th>
<th class="neck column">CHAOS&#9662;</th>
<th class="neck column">VILE&#9662;</th>
<th class="neck column">HP&#9662;</th>
<th class="neck column">RES&#9662;</th>
<th class="neck column">BLOCK&#9662;</th>
<th class="neck column">eBLOCK&#9662;</th>
<th class="neck column">RPT&#9662;</th>
<th class="neck column">EPT&#9662;</th>
<th class="neck column">RAMP&#9662;</th>
<th class="neck column">CRIT&#9662;</th>
<th class="neck column">GEMS&#9662;</th>
<th class="neck column">OPEN AUG&#9662;</th>
<th class="neck column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="weapon column">ITEM</th>
<th class="weapon column">NAME&#9662;</th>
<th class="weapon column">MR&#9662;</th>
<th class="weapon column">ATK&#9662;</th>
<th class="weapon column">ELE&#9662;</th>
<th class="weapon column">CHAOS&#9662;</th>
<th class="weapon column">VILE&#9662;</th>
<th class="weapon column">HP&#9662;</th>
<th class="weapon column">RES&#9662;</th>
<th class="weapon column">BLOCK&#9662;</th>
<th class="weapon column">eBLOCK&#9662;</th>
<th class="weapon column">RPT&#9662;</th>
<th class="weapon column">EPT&#9662;</th>
<th class="weapon column">RAMP&#9662;</th>
<th class="weapon column">CRIT&#9662;</th>
<th class="weapon column">GEMS&#9662;</th>
<th class="weapon column">OPEN AUG&#9662;</th>
<th class="weapon column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="body column">ITEM</th>
<th class="body column">NAME&#9662;</th>
<th class="body column">MR&#9662;</th>
<th class="body column">ATK&#9662;</th>
<th class="body column">ELE&#9662;</th>
<th class="body column">CHAOS&#9662;</th>
<th class="body column">VILE&#9662;</th>
<th class="body column">HP&#9662;</th>
<th class="body column">RES&#9662;</th>
<th class="body column">BLOCK&#9662;</th>
<th class="body column">eBLOCK&#9662;</th>
<th class="body column">RPT&#9662;</th>
<th class="body column">EPT&#9662;</th>
<th class="body column">RAMP&#9662;</th>
<th class="body column">CRIT&#9662;</th>
<th class="body column">GEMS&#9662;</th>
<th class="body column">OPEN AUG&#9662;</th>
<th class="body column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="shield column">ITEM</th>
<th class="shield column">NAME&#9662;</th>
<th class="shield column">MR&#9662;</th>
<th class="shield column">ATK&#9662;</th>
<th class="shield column">ELE&#9662;</th>
<th class="shield column">CHAOS&#9662;</th>
<th class="shield column">VILE&#9662;</th>
<th class="shield column">HP&#9662;</th>
<th class="shield column">RES&#9662;</th>
<th class="shield column">BLOCK&#9662;</th>
<th class="shield column">eBLOCK&#9662;</th>
<th class="shield column">RPT&#9662;</th>
<th class="shield column">EPT&#9662;</th>
<th class="shield column">RAMP&#9662;</th>
<th class="shield column">CRIT&#9662;</th>
<th class="shield column">GEMS&#9662;</th>
<th class="shield column">OPEN AUG&#9662;</th>
<th class="shield column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="pants column">ITEM</th>
<th class="pants column">NAME&#9662;</th>
<th class="pants column">MR&#9662;</th>
<th class="pants column">ATK&#9662;</th>
<th class="pants column">ELE&#9662;</th>
<th class="pants column">CHAOS&#9662;</th>
<th class="pants column">VILE&#9662;</th>
<th class="pants column">HP&#9662;</th>
<th class="pants column">RES&#9662;</th>
<th class="pants column">BLOCK&#9662;</th>
<th class="pants column">eBLOCK&#9662;</th>
<th class="pants column">RPT&#9662;</th>
<th class="pants column">EPT&#9662;</th>
<th class="pants column">RAMP&#9662;</th>
<th class="pants column">CRIT&#9662;</th>
<th class="pants column">GEMS&#9662;</th>
<th class="pants column">OPEN AUG&#9662;</th>
<th class="pants column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="belt column">ITEM</th>
<th class="belt column">NAME&#9662;</th>
<th class="belt column">MR&#9662;</th>
<th class="belt column">ATK&#9662;</th>
<th class="belt column">ELE&#9662;</th>
<th class="belt column">CHAOS&#9662;</th>
<th class="belt column">VILE&#9662;</th>
<th class="belt column">HP&#9662;</th>
<th class="belt column">RES&#9662;</th>
<th class="belt column">BLOCK&#9662;</th>
<th class="belt column">eBLOCK&#9662;</th>
<th class="belt column">RPT&#9662;</th>
<th class="belt column">EPT&#9662;</th>
<th class="belt column">RAMP&#9662;</th>
<th class="belt column">CRIT&#9662;</th>
<th class="belt column">GEMS&#9662;</th>
<th class="belt column">OPEN AUG&#9662;</th>
<th class="belt column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="ring column">ITEM</th>
<th class="ring column">NAME&#9662;</th>
<th class="ring column">MR&#9662;</th>
<th class="ring column">ATK&#9662;</th>
<th class="ring column">ELE&#9662;</th>
<th class="ring column">CHAOS&#9662;</th>
<th class="ring column">VILE&#9662;</th>
<th class="ring column">HP&#9662;</th>
<th class="ring column">RES&#9662;</th>
<th class="ring column">BLOCK&#9662;</th>
<th class="ring column">eBLOCK&#9662;</th>
<th class="ring column">RPT&#9662;</th>
<th class="ring column">EPT&#9662;</th>
<th class="ring column">RAMP&#9662;</th>
<th class="ring column">CRIT&#9662;</th>
<th class="ring column">GEMS&#9662;</th>
<th class="ring column">OPEN AUG&#9662;</th>
<th class="ring column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="foot column">ITEM</th>
<th class="foot column">NAME&#9662;</th>
<th class="foot column">MR&#9662;</th>
<th class="foot column">ATK&#9662;</th>
<th class="foot column">ELE&#9662;</th>
<th class="foot column">CHAOS&#9662;</th>
<th class="foot column">VILE&#9662;</th>
<th class="foot column">HP&#9662;</th>
<th class="foot column">RES&#9662;</th>
<th class="foot column">BLOCK&#9662;</th>
<th class="foot column">eBLOCK&#9662;</th>
<th class="foot column">RPT&#9662;</th>
<th class="foot column">EPT&#9662;</th>
<th class="foot column">RAMP&#9662;</th>
<th class="foot column">CRIT&#9662;</th>
<th class="foot column">GEMS&#9662;</th>
<th class="foot column">OPEN AUG&#9662;</th>
<th class="foot column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="gem column">ITEM</th>
<th class="gem column">NAME&#9662;</th>
<th class="gem column">GEM LVL&#9662;<span id="math_gemlvl" class="spans"></span></th>
<th class="gem column">CHAOS&#9662;</th>
<th class="gem column">RAMP&#9662;</th>
<th class="gem column">MR&#9662;</th>
<th class="gem column">CRIT&#9662;</th>
<th class="gem column">ORE&#9662;</th>
<th class="gem column">DELUGED&#9662;</th>
<th class="gem column">SEEPING&#9662;</th>
<th class="gem column">VOLATILE&#9662;</th>
<th class="rune column">ITEM&#9662;</th>
<th class="rune column">NAME&#9662;</th>
<th class="rune column">RUNE LVL&#9662;<span id="math_runelvl" class="spans"></span></th>
<th class="rune column">ELE DMG&#9662;</th>
<th class="rune column">FUSERS&#9662;</th>
<th class="rune column">ESSENCE&#9662;</th>
<th class="rune column">ORBSTONE&#9662;</th>
<th class="rune column">HEART&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ELE DMG&#9662;</th>
<th class="orbs column">CHAOS&#9662;</th>
<th class="orbs column">ATK&#9662;</th>
<th class="orbs column">HP&#9662;</th>
<th class="orbs column">MAX RAGE&#9662;</th>
<th class="orbs column">RPT&#9662;</th>
<th class="orbs column">EPT&#9662;</th>
<th class="bdge column">ITEM&#9662;</th>
<th class="bdge column">NAME&#9662;</th>
<th class="bdge column">BADGE LVL&#9662;<span id="math_badgelvl" class="spans"></span></th>
<th class="bdge column">ATK&#9662;</th>
<th class="bdge column">ELE DMG&#9662;</th>
<th class="bdge column">HP&#9662;</th>
<th class="bdge column">BADGE REPS&#9662;</th>
<th class="bdge column">CORVOK&#9662;</th>
<th class="booster column">ITEM&#9662;</th>
<th class="booster column">NAME&#9662;</th>
<th class="booster column">EFFECT&#9662;</th>
<th class="booster column">TIME REMAINING&#9662;</th>
<th class="crests column"><font color=#A283EE>CLASS</th>
<th class="crests column"><font color=#A283EE>CREST LVL&#9662;</th>
<th class="crests column"><font color=#DD5431>FRCTY</th>
<th class="crests column"><font color=#DD5431>CREST LVL&#9662;</th>
<th class="crests column"><font color=#369B97>PRESR</th>
<th class="crests column"><font color=#369B97>CREST LVL&#9662;</th>
<th class="crests column"><font color=#E3CB02>AFLCT</th>
<th class="crests column"><font color=#E3CB02>CREST LVL&#9662;</th>
<th class="crests column">FRAGMENTS&#9662;</th>
<th class="crests column">SKULLS&#9662;</th>
<th class="crests column">HOVOK&#9662;</th>
<th class="bp column"><img src=images/items/chaosore1.jpg onmouseover="popup(event,'Chaos Ore')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/itema22.jpg onmouseover="popup(event,'Archfiend Fragment')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/itema56.jpg onmouseover="popup(event,'Skull of Demonology')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/elementalfuser.jpg onmouseover="popup(event,'Elemental Fuser')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/badgeexp.jpg onmouseover="popup(event,'Badge Reputation')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/achievementamulet.jpg onmouseover="popup(event,'Amulet of Achievement')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/rechargetotem.jpg onmouseover="popup(event,'Recharge Totem')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/skillitem.jpg onmouseover="popup(event,'Standard Neuralyzer')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/skillitem.jpg onmouseover="popup(event,'Advanced Neuralyzer')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/addaugs.jpg onmouseover="popup(event,'Add Augment')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/AugmentRemover.gif onmouseover="popup(event,'Remove Augment')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/questshard.jpg onmouseover="popup(event,'Quest Shard')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/warshard.jpg onmouseover="popup(event,'Summoning Shard')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_NatasVile.jpg onmouseover="popup(event,'Natas Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_WhiteVile.jpg onmouseover="popup(event,'White Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_KineticVile.jpg onmouseover="popup(event,'Kinetic Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_ArcaneVile.jpg onmouseover="popup(event,'Arcane Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_ShadowVile.jpg onmouseover="popup(event,'Shadow Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/Pot_FireVile.jpg onmouseover="popup(event,'Fire Vile')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/PotionofEA.jpg onmouseover="popup(event,'Potion of Enraged Alsayic')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/pot5.jpg onmouseover="popup(event,'Sammy Sosa's Special Sauce')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/halloween/PumpkinJuice.gif onmouseover="popup(event,'Pumpkin Juice')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_1.gif onmouseover="popup(event,'Zombie Potion 1')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_2.gif onmouseover="popup(event,'Zombie Potion 2')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_3.gif onmouseover="popup(event,'Zombie Potion 3')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_4.gif onmouseover="popup(event,'Zombie Potion 4')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_5.gif onmouseover="popup(event,'Zombie Potion 5')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/potion_6.gif onmouseover="popup(event,'Zombie Potion 6')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/sugardaddy.png onmouseover="popup(event,'Sugar Daddy')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/itemz28.jpg onmouseover="popup(event,'Flask of Endurance')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/goldpotionzor.gif onmouseover="popup(event,'Remnant Solice Lev 7')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/goldpotionzorleetz.jpg onmouseover="popup(event,'Remnant Solice Lev 8')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/85remnant.jpg onmouseover="popup(event,'Remnant Solice Lev 9')" onmouseout="kill()">&#9662;</th>
<th class="pots column"><img src=images/items/90remnant.png onmouseover="popup(event,'Remnant Solice Lev 10')" onmouseout="kill()">&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Mass mob kills')" onmouseout="kill()">ANJOU&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Mass item collections')" onmouseout="kill()">REIKAR&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Rare drop collections')" onmouseout="kill()">LORREN&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Power mob kills')" onmouseout="kill()">LUCILE&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Crew DC raids')" onmouseout="kill()">WEIMA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Crew god raids')" onmouseout="kill()">SOUMA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Treasury purchase items')" onmouseout="kill()">VANISHA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Token purchase items')" onmouseout="kill()">DROLBA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Experience wards')" onmouseout="kill()">QUIBEL&#9662;</th>
<th class="collections column">TOTAL&#9662;</th>

</tr>`+charids+`</table>`

document.getElementById ("button1").addEventListener("click", Button1, false);
function Button1 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.home{display:revert!important}
#button1{color:#f441be!important}
#button25,#button23,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
`);}

document.getElementById ("button2").addEventListener("click", Button2, false);
function Button2 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.stats{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button2{color:#f441be!important}
`);}

document.getElementById ("button3").addEventListener("click", Button3, false);
function Button3 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.skills{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button3{color:#f441be!important}
`);}

document.getElementById ("button4").addEventListener("click", Button4, false);
function Button4 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.eq{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button4{color:#f441be!important}
`);}

document.getElementById ("button5").addEventListener("click", Button5, false);
function Button5 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.core{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button6,#button7,#button8,#button9{color:#fff!important}
#button5{color:#f441be!important}
`);}

document.getElementById ("button6").addEventListener("click", Button6, false);
function Button6 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.head{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button7,#button8,#button9{color:#fff!important}
#button6{color:#f441be!important}
`);}

document.getElementById ("button7").addEventListener("click", Button7, false);
function Button7 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.neck{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button8,#button9{color:#fff!important}
#button7{color:#f441be!important}
`);}
document.getElementById ("button8").addEventListener("click", Button8, false);
function Button8 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.weapon{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button9{color:#fff!important}
#button8{color:#f441be!important}
`);}

document.getElementById ("button9").addEventListener("click", Button9, false);
function Button9 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.body{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8{color:#fff!important}
#button9{color:#f441be!important}
`);}

document.getElementById ("button10").addEventListener("click", Button10, false);
function Button10 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.shield{display:revert!important}
#button25,#button23,#button1,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button10{color:#f441be!important}
`);}

document.getElementById ("button11").addEventListener("click", Button11, false);
function Button11 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.pants{display:revert!important}
#button25,#button23,#button1,#button10,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button11{color:#f441be!important}
`);}

document.getElementById ("button12").addEventListener("click", Button12, false);
function Button12 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.belt{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button12{color:#f441be!important}
`);}

document.getElementById ("button13").addEventListener("click", Button13, false);
function Button13 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.ring{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button13{color:#f441be!important}
`);}

document.getElementById ("button14").addEventListener("click", Button14, false);
function Button14 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.foot{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button14{color:#f441be!important}
`);}

document.getElementById ("button15").addEventListener("click", Button15, false);
function Button15 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.gem{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button15{color:#f441be!important}
`);}

document.getElementById ("button16").addEventListener("click", Button16, false);
function Button16 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.rune{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button17,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button16{color:#f441be!important}
`);}

document.getElementById ("button17").addEventListener("click", Button17, false);
function Button17 (zEvent) {GM_addStyle ( `
.column{display:none!important}.orbs{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button18,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button17{color:#f441be!important}
`);}

document.getElementById ("button18").addEventListener("click", Button18, false);
function Button18 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.bdge{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button19,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button18{color:#f441be!important}
`);}

document.getElementById ("button19").addEventListener("click", Button19, false);
function Button19 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.booster{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button2,#button20,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button19{color:#f441be!important}
`);}

document.getElementById ("button20").addEventListener("click", Button20, false);
function Button20 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.crests{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button21,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button20{color:#f441be!important}
`);}

document.getElementById ("button21").addEventListener("click", Button21, false);
function Button21 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.bp{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button22,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button21{color:#f441be!important}
`);}

document.getElementById ("button22").addEventListener("click", Button22, false);
function Button22 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.pots{display:revert!important}
#button25,#button23,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button22{color:#f441be!important}
`);}

document.getElementById ("button23").addEventListener("click", Button23, false);
function Button23 (zEvent) {GM_addStyle ( `
.column{display:none!important}
.collections{display:revert!important}
#button25,#button22,#button1,#button10,#button11,#button12,#button13,#button14,#button15,#button16,#button17,#button18,#button19,#button2,#button20,#button21,#button3,#button4,#button5,#button6,#button7,#button8,#button9{color:#fff!important}
#button23{color:#f441be!important}
`);}


$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

var selectedID = document.querySelector("body").outerHTML.match(/value="(.*)" selected/)
var charsTable = document.querySelector("#moxxivision > tbody");
var charsTableRows = charsTable.rows.length;

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var tot_lvl=0;
var tot_mrage=0;
var tot_power=0;
var tot_ele=0;
var tot_atk=0;
var tot_hp=0;
var tot_chaos=0;
var tot_wilderness=0;
var tot_slayer=0;
var tot_today=0;
var tot_yesterday=0;
var tot_gemlvl=0;
var tot_runelvl=0;
var tot_badgelvl=0;
var tot_openaugs=0;
var primalready = '';
var respready = '';
var mysticready = '';
var delready = '';
var seepready = '';
var volready = '';
var hovokready = '';
var corvready = '';
var fragready = '';
var oreready = '';
var badgeready = '';
var count=0;
for (let rownum = 2; rownum < (charsTableRows+1); rownum++) {

var profilelinks = "profile.php?id="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(profilelinks)
   .then(response => response.text())
   .then((response) => {
    var name = response.match(/<a href="\/send_ow_message\?name=(.*)">/i)
    var power = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)
    var eledmg = response.match(/ELEMENTAL ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var attack = response.match(/ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var hp = response.match(/HIT POINTS.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var chaos = response.match(/CHAOS DAMAGE.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var slayer = response.match(/GOD SLAYER LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var wilderness = response.match(/WILDERNESS LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var experience = response.match(/TOTAL EXPERIENCE.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var level = response.match(/CHARACTER CLASS.*[\n\r].*<font size="2">Level ([0-9]+)(.*)<\/font>/i)
    var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)
    if (crew == null) crew = "none"
    var id = response.match(/<a href="\.\.\/allies\.php\?uid=(.*)">\[View All]<\/a>/i)
    var strength = response.match(/\(event,'Strength: ([0-9]+)'\)/i)
    var yesterday = response.match(/GROWTH YESTERDAY.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im).toString().match(/img/g) || []
    var core = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (core != "none"){core = core[1]}
    let coreid = 'none'; if (core != "none") coreid = core.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var head = response.match(/<div style="position:absolute; left:118px; top:7px; width:62px; height:46px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (head != "none"){head = head[1]}
    let headid = 'none'; if (head != "none") headid = head.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var neck = response.match(/<div style="position:absolute; left:197px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (neck != "none"){neck = neck[1]}
    let neckid = 'none'; if (neck != "none") neckid = neck.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var weapon = response.match(/<div style="position:absolute; left:45px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (weapon != "none"){weapon = weapon[1]}
    let weaponid = 'none'; if (weapon != "none") weaponid = weapon.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var body = response.match(/<div style="position:absolute; left:121px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (body != "none"){body = body[1]}
    let bodyid = 'none'; if (body != "none") bodyid = body.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var shield = response.match(/<div style="position:absolute; left:198px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (shield != "none"){shield = shield[1]}
    let shieldid = 'none'; if (shield != "none") shieldid = shield.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var pants = response.match(/<div style="position:absolute; left:118px; top:175px; width:62px; height:75px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (pants != "none"){pants = pants[1]}
    let pantsid = 'none'; if (pants != "none") pantsid = pants.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var belt = response.match(/<div style="position:absolute; left:61px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (belt != "none"){belt = belt[1]}
    let beltid = 'none'; if (belt != "none") beltid = belt.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var ring = response.match(/<div style="position:absolute; left:197px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (ring != "none"){ring = ring[1]}
    let ringid = 'none'; if (ring != "none") ringid = ring.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var foot = response.match(/<div style="position:absolute; left:118px; top:262px; width:62px; height:66px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (foot != "none"){foot = foot[1]}
    let footid = 'none'; if (foot != "none") footid = foot.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var gem = response.match(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (gem != "none"){gem = gem[1]}
    let gemid = 'none'; if (gem != "none") gemid = gem.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var rune = response.match(/<div style="position:absolute; left:54px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (rune != "none"){rune = rune[1]}
    let runeid = 'none'; if (rune != "none") runeid = rune.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var badge = response.match(/<div style="position:absolute; left:214px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (badge != "none"){badge = badge[1]}
    let badgeid = 'none'; if (badge != "none") badgeid = badge.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var booster = response.match(/<div style="position:absolute; left:258px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (booster != "none"){booster = booster[1]}
    let boosterid = 'none'; if (booster != "none") boosterid = booster.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var crest1 = response.match(/<div style="position:absolute; left:9px; top:9px; width:60px; height:60px;text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest1 != "none"){crest1 = crest1[1]}
    var crest2 = response.match(/<div style="position:absolute; left:83px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest2 != "none"){crest2 = crest2[1]}
    var crest3 = response.match(/<div style="position:absolute; left:157px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest3 != "none"){crest3 = crest3[1]}
    var crest4 = response.match(/<div style="position:absolute; left:231px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest4 != "none"){crest4 = crest4[1]}
    var crest1lvl = 0; if(crest1.match(/Quantum/i) != null) crest1lvl += 2; if(crest1.match(/Excelled/) != null) crest1lvl += 1; if(crest1 != "none") crest1lvl += 1;
    var crest2lvl = 0; if(crest2.match(/Explosive/i) != null) crest2lvl += 2; if(crest2.match(/Excelled/) != null) crest2lvl += 1; if(crest2 != "none") crest2lvl += 1;
    var crest3lvl = 0; if(crest3.match(/Violent/i) != null) crest3lvl += 2; if(crest3.match(/Excelled/) != null) crest3lvl += 1; if(crest3 != "none") crest3lvl += 1;
    var crest4lvl = 0; if(crest4.match(/Onslaught/i) != null) crest4lvl += 2; if(crest4.match(/Excelled/) != null) crest4lvl += 1; if(crest4 != "none") crest4lvl += 1;
    var orbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)(<img .*)(<img .*)<\/div>/i)
    var orb1 = ''; if (orbs == null) orb1 = "none"; if (orbs != null) orb1 = orbs[1]
    var orb2 = ''; if (orbs == null) orb2 = "none"; if (orbs != null) orb2 = orbs[2]
    var orb3 = ''; if (orbs == null) orb3 = "none"; if (orbs != null) orb3 = orbs[3]
    var orb1name = ''; if (orb1 == "none") orb1name = ["none","none"]; if (orb1 != "none") orb1name = orb1.match(/alt="(.*)">/i)
    var orb2name = ''; if (orb2 == "none") orb2name = ["none","none"]; if (orb2 != "none") orb2name = orb2.match(/alt="(.*)">/i)
    var orb3name = ''; if (orb3 == "none") orb3name = ["none","none"]; if (orb3 != "none") orb3name = orb3.match(/alt="(.*)">/i)
    let orb1id = 'none'; if (orb1 != "none") orb1id = orb1.match(/itempopup\(event,'([0-9]+)'\)"/i)
    let orb2id = 'none'; if (orb2 != "none") orb2id = orb2.match(/itempopup\(event,'([0-9]+)'\)"/i)
    let orb3id = 'none'; if (orb3 != "none") orb3id = orb3.match(/itempopup\(event,'([0-9]+)'\)"/i)

var core_name = "none";var core_cloned = "none";var core_hp=0;var core_atk=0;var core_arcane=0;var core_arcaner=0;var core_block=0;var core_chaos=0;var core_crit=0;var core_eblock=0;var core_ept=0;var core_fire=0;var core_firer=0;var core_holy=0;var core_holyr=0;var core_kinetic=0;var core_kineticr=0;var core_mr=0;var core_ramp=0;var core_rpt=0;var core_shadow=0;var core_shadowr=0;var core_vile=0;var core_openaugs=0;var core_gems=0;var core_rarity="none";var core_upgrade="";
if (core != "none"){
var corelink = `item_rollover.php?id=`+coreid[1]
fetch(corelink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    core_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) core_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    core_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    core_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    core_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    core_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    core_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    core_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    core_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    core_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    core_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    core_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    core_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    core_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    core_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    core_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    core_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    core_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    core_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    core_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    core_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    core_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    core_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) core_openaugs += 1;if (openaugs[1] != undefined) core_openaugs += 1;if (openaugs[2] != undefined) core_openaugs += 1;if (openaugs[3] != undefined) core_openaugs += 1;if (openaugs[4] != undefined) core_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    core_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    core_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (core_mr*0.15);
    core_upgrade = (core_mr*0.15/upgrade_cost).toFixed(2)
})}

var head_name = "none";var head_cloned = "none";var head_hp=0;var head_atk=0;var head_arcane=0;var head_arcaner=0;var head_block=0;var head_chaos=0;var head_crit=0;var head_eblock=0;var head_ept=0;var head_fire=0;var head_firer=0;var head_holy=0;var head_holyr=0;var head_kinetic=0;var head_kineticr=0;var head_mr=0;var head_ramp=0;var head_rpt=0;var head_shadow=0;var head_shadowr=0;var head_vile=0;var head_openaugs=0;var head_gems=0;var head_rarity="none";var head_upgrade="";
if (head != "none"){
var headlink = `item_rollover.php?id=`+headid[1]
fetch(headlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    head_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) head_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    head_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    head_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    head_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    head_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    head_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    head_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    head_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    head_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    head_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    head_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    head_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    head_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    head_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    head_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    head_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    head_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    head_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    head_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    head_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    head_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    head_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) head_openaugs += 1;if (openaugs[1] != undefined) head_openaugs += 1;if (openaugs[2] != undefined) head_openaugs += 1;if (openaugs[3] != undefined) head_openaugs += 1;if (openaugs[4] != undefined) head_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    head_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    head_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (head_mr*0.15);
    head_upgrade = (head_mr*0.15/upgrade_cost).toFixed(2)
})}

var neck_name = "none";var neck_cloned = "none";var neck_hp=0;var neck_atk=0;var neck_arcane=0;var neck_arcaner=0;var neck_block=0;var neck_chaos=0;var neck_crit=0;var neck_eblock=0;var neck_ept=0;var neck_fire=0;var neck_firer=0;var neck_holy=0;var neck_holyr=0;var neck_kinetic=0;var neck_kineticr=0;var neck_mr=0;var neck_ramp=0;var neck_rpt=0;var neck_shadow=0;var neck_shadowr=0;var neck_vile=0;var neck_openaugs=0;var neck_gems=0;var neck_rarity="none";var neck_upgrade="";
if (neck != "none"){
var necklink = `item_rollover.php?id=`+neckid[1]
fetch(necklink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    neck_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) neck_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    neck_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    neck_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    neck_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    neck_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    neck_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    neck_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    neck_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    neck_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    neck_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    neck_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    neck_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    neck_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    neck_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    neck_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    neck_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    neck_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    neck_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    neck_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    neck_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    neck_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    neck_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) neck_openaugs += 1;if (openaugs[1] != undefined) neck_openaugs += 1;if (openaugs[2] != undefined) neck_openaugs += 1;if (openaugs[3] != undefined) neck_openaugs += 1;if (openaugs[4] != undefined) neck_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    neck_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    neck_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (neck_mr*0.15);
    neck_upgrade = (neck_mr*0.15/upgrade_cost).toFixed(2)
})}

var weapon_name = "none";var weapon_cloned = "none";var weapon_hp=0;var weapon_atk=0;var weapon_arcane=0;var weapon_arcaner=0;var weapon_block=0;var weapon_chaos=0;var weapon_crit=0;var weapon_eblock=0;var weapon_ept=0;var weapon_fire=0;var weapon_firer=0;var weapon_holy=0;var weapon_holyr=0;var weapon_kinetic=0;var weapon_kineticr=0;var weapon_mr=0;var weapon_ramp=0;var weapon_rpt=0;var weapon_shadow=0;var weapon_shadowr=0;var weapon_vile=0;var weapon_openaugs=0;var weapon_gems=0;var weapon_rarity="none";var weapon_upgrade="";
if (weapon != "none"){
var weaponlink = `item_rollover.php?id=`+weaponid[1]
fetch(weaponlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    weapon_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) weapon_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    weapon_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    weapon_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    weapon_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    weapon_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    weapon_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    weapon_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    weapon_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    weapon_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    weapon_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    weapon_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    weapon_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    weapon_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    weapon_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    weapon_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    weapon_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    weapon_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    weapon_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    weapon_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    weapon_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    weapon_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    weapon_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) weapon_openaugs += 1;if (openaugs[1] != undefined) weapon_openaugs += 1;if (openaugs[2] != undefined) weapon_openaugs += 1;if (openaugs[3] != undefined) weapon_openaugs += 1;if (openaugs[4] != undefined) weapon_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    weapon_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    weapon_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (weapon_mr*0.15);
    weapon_upgrade = (weapon_mr*0.15/upgrade_cost).toFixed(2)
})}

var body_name = "none";var body_cloned = "none";var body_hp=0;var body_atk=0;var body_arcane=0;var body_arcaner=0;var body_block=0;var body_chaos=0;var body_crit=0;var body_eblock=0;var body_ept=0;var body_fire=0;var body_firer=0;var body_holy=0;var body_holyr=0;var body_kinetic=0;var body_kineticr=0;var body_mr=0;var body_ramp=0;var body_rpt=0;var body_shadow=0;var body_shadowr=0;var body_vile=0;var body_openaugs=0;var body_gems=0;var body_rarity="none";var body_upgrade="";
if (body != "none"){
var bodylink = `item_rollover.php?id=`+bodyid[1]
fetch(bodylink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    body_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) body_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    body_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    body_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    body_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    body_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    body_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    body_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    body_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    body_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    body_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    body_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    body_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    body_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    body_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    body_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    body_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    body_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    body_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    body_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    body_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    body_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    body_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) body_openaugs += 1;if (openaugs[1] != undefined) body_openaugs += 1;if (openaugs[2] != undefined) body_openaugs += 1;if (openaugs[3] != undefined) body_openaugs += 1;if (openaugs[4] != undefined) body_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    body_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    body_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (body_mr*0.15);
    body_upgrade = (body_mr*0.15/upgrade_cost).toFixed(2)
})}

var shield_name = "none";var shield_cloned = "none";var shield_hp=0;var shield_atk=0;var shield_arcane=0;var shield_arcaner=0;var shield_block=0;var shield_chaos=0;var shield_crit=0;var shield_eblock=0;var shield_ept=0;var shield_fire=0;var shield_firer=0;var shield_holy=0;var shield_holyr=0;var shield_kinetic=0;var shield_kineticr=0;var shield_mr=0;var shield_ramp=0;var shield_rpt=0;var shield_shadow=0;var shield_shadowr=0;var shield_vile=0;var shield_openaugs=0;var shield_gems=0;var shield_rarity="none";var shield_upgrade="";
if (shield != "none"){
var shieldlink = `item_rollover.php?id=`+shieldid[1]
fetch(shieldlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    shield_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) shield_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    shield_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    shield_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    shield_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    shield_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    shield_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    shield_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    shield_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    shield_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    shield_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    shield_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    shield_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    shield_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    shield_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    shield_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    shield_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    shield_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    shield_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    shield_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    shield_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    shield_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    shield_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) shield_openaugs += 1;if (openaugs[1] != undefined) shield_openaugs += 1;if (openaugs[2] != undefined) shield_openaugs += 1;if (openaugs[3] != undefined) shield_openaugs += 1;if (openaugs[4] != undefined) shield_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    shield_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    shield_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (shield_mr*0.15);
    shield_upgrade = (shield_mr*0.15/upgrade_cost).toFixed(2)
})}

var pants_name = "none";var pants_cloned = "none";var pants_hp=0;var pants_atk=0;var pants_arcane=0;var pants_arcaner=0;var pants_block=0;var pants_chaos=0;var pants_crit=0;var pants_eblock=0;var pants_ept=0;var pants_fire=0;var pants_firer=0;var pants_holy=0;var pants_holyr=0;var pants_kinetic=0;var pants_kineticr=0;var pants_mr=0;var pants_ramp=0;var pants_rpt=0;var pants_shadow=0;var pants_shadowr=0;var pants_vile=0;var pants_openaugs=0;var pants_gems=0;var pants_rarity="none";var pants_upgrade="";
if (pants != "none"){
var pantslink = `item_rollover.php?id=`+pantsid[1]
fetch(pantslink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    pants_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) pants_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    pants_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    pants_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    pants_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    pants_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    pants_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    pants_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    pants_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    pants_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    pants_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    pants_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    pants_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    pants_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    pants_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    pants_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    pants_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    pants_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    pants_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    pants_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    pants_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    pants_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    pants_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) pants_openaugs += 1;if (openaugs[1] != undefined) pants_openaugs += 1;if (openaugs[2] != undefined) pants_openaugs += 1;if (openaugs[3] != undefined) pants_openaugs += 1;if (openaugs[4] != undefined) pants_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    pants_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    pants_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (pants_mr*0.15);
    pants_upgrade = (pants_mr*0.15/upgrade_cost).toFixed(2)
})}

var belt_name = "none";var belt_cloned = "none";var belt_hp=0;var belt_atk=0;var belt_arcane=0;var belt_arcaner=0;var belt_block=0;var belt_chaos=0;var belt_crit=0;var belt_eblock=0;var belt_ept=0;var belt_fire=0;var belt_firer=0;var belt_holy=0;var belt_holyr=0;var belt_kinetic=0;var belt_kineticr=0;var belt_mr=0;var belt_ramp=0;var belt_rpt=0;var belt_shadow=0;var belt_shadowr=0;var belt_vile=0;var belt_openaugs=0;var belt_gems=0;var belt_rarity="none";var belt_upgrade="";
if (belt != "none"){
var beltlink = `item_rollover.php?id=`+beltid[1]
fetch(beltlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    belt_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) belt_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    belt_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    belt_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    belt_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    belt_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    belt_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    belt_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    belt_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    belt_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    belt_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    belt_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    belt_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    belt_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    belt_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    belt_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    belt_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    belt_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    belt_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    belt_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    belt_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    belt_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    belt_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) belt_openaugs += 1;if (openaugs[1] != undefined) belt_openaugs += 1;if (openaugs[2] != undefined) belt_openaugs += 1;if (openaugs[3] != undefined) belt_openaugs += 1;if (openaugs[4] != undefined) belt_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    belt_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    belt_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (belt_mr*0.15);
    belt_upgrade = (belt_mr*0.15/upgrade_cost).toFixed(2)
})}

var ring_name = "none";var ring_cloned = "none";var ring_hp=0;var ring_atk=0;var ring_arcane=0;var ring_arcaner=0;var ring_block=0;var ring_chaos=0;var ring_crit=0;var ring_eblock=0;var ring_ept=0;var ring_fire=0;var ring_firer=0;var ring_holy=0;var ring_holyr=0;var ring_kinetic=0;var ring_kineticr=0;var ring_mr=0;var ring_ramp=0;var ring_rpt=0;var ring_shadow=0;var ring_shadowr=0;var ring_vile=0;var ring_openaugs=0;var ring_gems=0;var ring_rarity="none";var ring_upgrade="";
if (ring != "none"){
var ringlink = `item_rollover.php?id=`+ringid[1]
fetch(ringlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    ring_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) ring_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    ring_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    ring_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    ring_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    ring_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    ring_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    ring_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    ring_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    ring_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    ring_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    ring_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    ring_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    ring_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    ring_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    ring_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    ring_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    ring_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    ring_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    ring_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    ring_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    ring_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    ring_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) ring_openaugs += 1;if (openaugs[1] != undefined) ring_openaugs += 1;if (openaugs[2] != undefined) ring_openaugs += 1;if (openaugs[3] != undefined) ring_openaugs += 1;if (openaugs[4] != undefined) ring_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    ring_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    ring_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (ring_mr*0.15);
    ring_upgrade = (ring_mr*0.15/upgrade_cost).toFixed(2)
})}

var foot_name = "none";var foot_cloned = "none";var foot_hp=0;var foot_atk=0;var foot_arcane=0;var foot_arcaner=0;var foot_block=0;var foot_chaos=0;var foot_crit=0;var foot_eblock=0;var foot_ept=0;var foot_fire=0;var foot_firer=0;var foot_holy=0;var foot_holyr=0;var foot_kinetic=0;var foot_kineticr=0;var foot_mr=0;var foot_ramp=0;var foot_rpt=0;var foot_shadow=0;var foot_shadowr=0;var foot_vile=0;var foot_openaugs=0;var foot_gems=0;var foot_rarity="none";var foot_upgrade="";
if (foot != "none"){
var footlink = `item_rollover.php?id=`+footid[1]
fetch(footlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    foot_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) foot_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    foot_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    foot_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    foot_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    foot_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    foot_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    foot_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    foot_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    foot_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    foot_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    foot_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    foot_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    foot_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    foot_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    foot_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    foot_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    foot_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    foot_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    foot_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    foot_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    foot_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    foot_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) foot_openaugs += 1;if (openaugs[1] != undefined) foot_openaugs += 1;if (openaugs[2] != undefined) foot_openaugs += 1;if (openaugs[3] != undefined) foot_openaugs += 1;if (openaugs[4] != undefined) foot_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    foot_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    foot_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (foot_mr*0.15);
    foot_upgrade = (foot_mr*0.15/upgrade_cost).toFixed(2)
})}

var booster_name = "none";var booster_exp = 0;var booster_effect = "none";
if (booster != "none"){
var boosterlinks = `item_rollover.php?id=`+boosterid[1]
fetch(boosterlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    booster_name = name[1]
    const expires = itemtable.match(/<br>Expires<br>[\n\r]([0-9]+) minutes/i)
    booster_exp += parseInt(expires[1])
    const effect = itemtable.match(/<div style="font-family:verdana;font-size:7pt;font-style:italic;color:#FFCC00">(.*).<\/div>/i)
    booster_effect = effect[1]
})}

var badge_name = "none";var badge_level = 0;var badge_hp = 0;var badge_atk = 0;var badge_ele = 0;var badge_lvl = "none";
if (badge != "none"){
var badgelinks = `item_rollover.php?id=`+badgeid[1]
fetch(badgelinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    badge_name = name[1]
    const atk = itemtable.match(/\+([0-9]+) ATK/i) || [0,0]
    badge_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP/i) || [0,0]
    badge_hp += parseInt(hp[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    badge_ele += parseInt(ele[1])*5
    badge_level += parseInt(badge_name.replace("Badge of Absolution","26").replace("Badge Level ",""))
})}

var orb1_ele = 0;var orb1_chaos = 0;var orb1_atk = 0;var orb1_hp = 0;var orb1_mr = 0;var orb1_rpt = 0;var orb1_ept = 0;
if (orb1name[1] != "none"){
var orb1links = `item_rollover.php?id=`+orb1id[1]
fetch(orb1links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb1_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb1_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb1_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb1_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb1_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb1_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb1_ept += parseInt(ept[1])
})}

var orb2_ele = 0;var orb2_chaos = 0;var orb2_atk = 0;var orb2_hp = 0;var orb2_mr = 0;var orb2_rpt = 0;var orb2_ept = 0;
if (orb2name[1] != "none"){
var orb2links = `item_rollover.php?id=`+orb2id[1]
fetch(orb2links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb2_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb2_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb2_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb2_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb2_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb2_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb2_ept += parseInt(ept[1])
})}

var orb3_ele = 0;var orb3_chaos = 0;var orb3_atk = 0;var orb3_hp = 0;var orb3_mr = 0;var orb3_rpt = 0;var orb3_ept = 0;
if (orb3name[1] != "none"){
var orb3links = `item_rollover.php?id=`+orb3id[1]
fetch(orb3links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb3_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb3_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb3_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb3_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb3_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb3_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb3_ept += parseInt(ept[1])

})}

var gem_name = "none";var gem_level = 0;var gem_chaos = 0;var gem_ramp = 0;var gem_mr = 0;var gem_crit = 0;var gem_lvl = "none";
if (gem != "none"){
var gemlinks = `item_rollover.php?id=`+gemid[1]
fetch(gemlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    gem_name = name[1]
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    gem_chaos += parseInt(chaos[1])
    const rampage = itemtable.match(/\+([0-9]+)% rampage/i) || [0,0] || [0,0]
    gem_ramp += parseInt(rampage[1])
    const maxrage = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    gem_mr += parseInt(maxrage[1])
    const critical = itemtable.match(/\+([0-9]+)% critical hit/i) || [0,0]
    gem_crit += parseInt(critical[1])
    "Claw of Chaos"==gem_name&&(gem_lvl=42),"Embedded Chaos Gem"==gem_name&&(gem_lvl=41),"Flawless Chaos Gem 8"==gem_name&&(gem_lvl=40),"Flawless Chaos Gem 7"==gem_name&&(gem_lvl=39),"Flawless Chaos Gem 6"==gem_name&&(gem_lvl=38),"Flawless Chaos Gem 5"==gem_name&&(gem_lvl=37),"Flawless Chaos Gem 4"==gem_name&&(gem_lvl=36),"Flawless Chaos Gem 3"==gem_name&&(gem_lvl=35),"Flawless Chaos Gem 2"==gem_name&&(gem_lvl=34),"Flawless Chaos Gem 1"==gem_name&&(gem_lvl=33),"Lucid Chaos Gem 8"==gem_name&&(gem_lvl=32),"Lucid Chaos Gem 7"==gem_name&&(gem_lvl=31),"Lucid Chaos Gem 6"==gem_name&&(gem_lvl=30),"Lucid Chaos Gem 5"==gem_name&&(gem_lvl=29),"Lucid Chaos Gem 4"==gem_name&&(gem_lvl=28),"Lucid Chaos Gem 3"==gem_name&&(gem_lvl=27),"Lucid Chaos Gem 2"==gem_name&&(gem_lvl=26),"Lucid Chaos Gem 1"==gem_name&&(gem_lvl=25),"Smooth Chaos Gem 8"==gem_name&&(gem_lvl=24),"Smooth Chaos Gem 7"==gem_name&&(gem_lvl=23),"Smooth Chaos Gem 6"==gem_name&&(gem_lvl=22),"Smooth Chaos Gem 5"==gem_name&&(gem_lvl=21),"Smooth Chaos Gem 4"==gem_name&&(gem_lvl=20),"Smooth Chaos Gem 3"==gem_name&&(gem_lvl=19),"Smooth Chaos Gem 2"==gem_name&&(gem_lvl=18),"Smooth Chaos Gem 1"==gem_name&&(gem_lvl=17),"Meager Chaos Gem 8"==gem_name&&(gem_lvl=16),"Meager Chaos Gem 7"==gem_name&&(gem_lvl=15),"Meager Chaos Gem 6"==gem_name&&(gem_lvl=14),"Meager Chaos Gem 5"==gem_name&&(gem_lvl=13),"Meager Chaos Gem 4"==gem_name&&(gem_lvl=12),"Meager Chaos Gem 3"==gem_name&&(gem_lvl=11),"Meager Chaos Gem 2"==gem_name&&(gem_lvl=10),"Meager Chaos Gem 1"==gem_name&&(gem_lvl=9),"Paltry Chaos Gem 8"==gem_name&&(gem_lvl=8),"Paltry Chaos Gem 7"==gem_name&&(gem_lvl=7),"Paltry Chaos Gem 6"==gem_name&&(gem_lvl=6),"Paltry Chaos Gem 5"==gem_name&&(gem_lvl=5),"Paltry Chaos Gem 4"==gem_name&&(gem_lvl=4),"Paltry Chaos Gem 3"==gem_name&&(gem_lvl=3),"Paltry Chaos Gem 2"==gem_name&&(gem_lvl=2),"Paltry Chaos Gem 1"==gem_name&&(gem_lvl=1);
})}

var rune_name = "none";var rune_level = 0;var rune_ele = 0;var rune_lvl = "none";
if (rune != "none"){
var runelinks = `item_rollover.php?id=`+runeid[1]
fetch(runelinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    rune_name = name[1]
    const holy = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF">/i)
    const arcane = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">/i)
    const shadow = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc">/i)
    const fire = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000">/i)
    const kinetic = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00">/i)
    rune_ele += parseInt(holy[1])+parseInt(arcane[1])+parseInt(shadow[1])+parseInt(fire[1])+parseInt(kinetic[1])
    "Rune of Creation"==rune_name&&(rune_lvl=37),"Empyreal Rune Stage 5"==rune_name&&(rune_lvl=36),"Empyreal Rune Stage 4"==rune_name&&(rune_lvl=35),"Empyreal Rune Stage 3"==rune_name&&(rune_lvl=34),"Empyreal Rune Stage 2"==rune_name&&(rune_lvl=33),"Empyreal Rune Stage 1"==rune_name&&(rune_lvl=32),"Titanic Rune Stage 5"==rune_name&&(rune_lvl=31),"Titanic Rune Stage 4"==rune_name&&(rune_lvl=30),"Titanic Rune Stage 3"==rune_name&&(rune_lvl=29),"Titanic Rune Stage 2"==rune_name&&(rune_lvl=28),"Titanic Rune Stage 1"==rune_name&&(rune_lvl=27),"Cosmic Rune Stage 5"==rune_name&&(rune_lvl=26),"Cosmic Rune Stage 4"==rune_name&&(rune_lvl=25),"Cosmic Rune Stage 3"==rune_name&&(rune_lvl=24),"Cosmic Rune Stage 2"==rune_name&&(rune_lvl=23),"Cosmic Rune Stage 1"==rune_name&&(rune_lvl=22),"Stellar Rune Stage 5"==rune_name&&(rune_lvl=21),"Stellar Rune Stage 4"==rune_name&&(rune_lvl=20),"Stellar Rune Stage 3"==rune_name&&(rune_lvl=19),"Stellar Rune Stage 2"==rune_name&&(rune_lvl=18),"Stellar Rune Stage 1"==rune_name&&(rune_lvl=17),"Elevated Rune Stage 5"==rune_name&&(rune_lvl=16),"Elevated Rune Stage 4"==rune_name&&(rune_lvl=15),"Elevated Rune Stage 3"==rune_name&&(rune_lvl=14),"Elevated Rune Stage 2"==rune_name&&(rune_lvl=13),"Elevated Rune Stage 1"==rune_name&&(rune_lvl=12),"Astral Rune Stage 5"==rune_name&&(rune_lvl=11),"Astral Rune Stage 4"==rune_name&&(rune_lvl=10),"Astral Rune Stage 3"==rune_name&&(rune_lvl=9),"Astral Rune Stage 2"==rune_name&&(rune_lvl=8),"Astral Rune Stage 1"==rune_name&&(rune_lvl=7),"Mystic Elemental Rune"==rune_name&&(rune_lvl=6),"Resplendent Elemental Rune"==rune_name&&(rune_lvl=5),"Primal Elemental Rune"==rune_name&&(rune_lvl=4),"Amplified Kinetic Rune"==rune_name&&(rune_lvl=3),"Amplified Fire Rune"==rune_name&&(rune_lvl=3),"Amplified Shadow Rune"==rune_name&&(rune_lvl=3),"Amplified Arcane Rune"==rune_name&&(rune_lvl=3),"Amplified Holy Rune"==rune_name&&(rune_lvl=3),"Infused Kinetic Rune"==rune_name&&(rune_lvl=2),"Infused Fire Rune"==rune_name&&(rune_lvl=2),"Infused Shadow Rune"==rune_name&&(rune_lvl=2),"Infused Arcane Rune"==rune_name&&(rune_lvl=2),"Infused Holy Rune"==rune_name&&(rune_lvl=2),"Basic Elemental Rune"==rune_name&&(rune_lvl=1);
})}

var supplieslinks = "supplies?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(supplieslinks)
   .then(response => response.text())
   .then((response) => {
    var supplies = response.match(/<img border="0" src="images\/suppliestriangle\.gif" width="11" height="11">[\n\r](.*)%<\/td>/i)

var homelinks = "home?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(homelinks)
   .then(response => response.text())
   .then((response) => {
    var today = response.match(/<tr><td><b>Growth Today:<\/b><\/td><td>(.*)<\/td><\/tr><tr><td><b>Per Turn/i)
    var fireRes = response.match(/onmouseout="kill\(\)">Fire Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var arcaneRes = response.match(/onmouseout="kill\(\)">Arcane Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var shadowRes = response.match(/onmouseout="kill\(\)">Shadow Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var holyRes = response.match(/onmouseout="kill\(\)">Holy Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var kineticRes = response.match(/onmouseout="kill\(\)">Kinetic Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var skillclass = response.match(/<span class="t-uppercontent">Level [0-9]+ (.*) .*<\/span>/i)
    var rage = response.match(/<span class="toolbar_rage">(.*)<\/span>/i)
    var mrage = response.match(/<b>Maximum:<\/b><\/td><td>(.*)<\/td>/i)
    var rpt = response.match(/<p class="top-rage" onmouseover="statspopup\(event,'<tr><td><b>Per Turn:<\/b><\/td><td>(.*)<\/td>/i)
    var tomax = Math.ceil((parseInt(mrage[1].replaceAll(",",""))-parseInt(rage[1].replaceAll(",","")))/parseInt(rpt[1].replaceAll(",","")))

var skillslinks = "cast_skills?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(skillslinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const castskills = doc.querySelector("#basic > div.widget-content.widget-content-area > div:nth-child(1) > div:nth-child(1) > div > div").innerHTML

var tomelinks = "skills_info.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&id=46"
fetch(tomelinks)
   .then(response => response.text())
   .then((response) => {
    var tomeShield = response.match(/<b>You have not learned this skill yet<\/b>/i)
    var tome = '';
    if (tomeShield == null){tome = "YES"}
    if (tomeShield != null){tome = "NO"}

var bp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=regular"
fetch(bp)
   .then(response => response.text())
   .then((response) => {
    var totem = 0; if (response.match(/alt="Recharge Totem"/g) != null) totem += response.match(/alt="Recharge Totem"/g).length
    var standard = 0; if (response.match(/alt="Standard Issue Neuralyzer"/g) != null) standard += response.match(/alt="Standard Issue Neuralyzer"/g).length
    var advanced = 0; if (response.match(/alt="Advanced Neuralyzer"/g) != null) advanced += response.match(/alt="Advanced Neuralyzer"/g).length
    var add = 0; if (response.match(/alt="Add Augment Slot"/g) != null) add += response.match(/alt="Add Augment Slot"/g).length
    var remove = 0; if (response.match(/alt="Remove Augment"/g) != null) remove += response.match(/alt="Remove Augment"/g).length

var questbp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=quest"
fetch(questbp)
   .then(response => response.text())
   .then((response) => {
    var archfrag = response.match(/data-name="Archfiend Soul Fragment" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var demonskull = response.match(/data-name="Skull of Demonology" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var chaosore = response.match(/data-name="Chaos Ore" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var elefuser = response.match(/data-name="Elemental Fuser" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var badgerep = response.match(/data-name="Badge Reputation" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var ammy = response.match(/data-name="Amulet of Achievement" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var questshard = response.match(/data-name="Quest Shard" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var essence = response.match(/data-name="Rune Essence" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var orbstone = response.match(/data-name="Astral Orbstone" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var heart = response.match(/data-name="Heart of Death" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var summoning = response.match(/data-name="Summoning Shard" data-itemqty="(.*)" data-itemid/i) || [0,0]

var potbp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=potion"
fetch(potbp)
   .then(response => response.text())
   .then((response) => {
    var vile1 = response.match(/img data-itemidqty="([0-9]+)" data-name="Natas Vile"/i) || [0,0]
    var vile2 = response.match(/img data-itemidqty="([0-9]+)" data-name="White Vile"/i) || [0,0]
    var vile3 = response.match(/img data-itemidqty="([0-9]+)" data-name="Kinetic Vile"/i) || [0,0]
    var vile4 = response.match(/img data-itemidqty="([0-9]+)" data-name="Arcane Vile"/i) || [0,0]
    var vile5 = response.match(/img data-itemidqty="([0-9]+)" data-name="Shadow Vile"/i) || [0,0]
    var vile6 = response.match(/img data-itemidqty="([0-9]+)" data-name="Fire Vile"/i) || [0,0]
    var alsayic = response.match(/img data-itemidqty="([0-9]+)" data-name="Potion of Enraged Alsayic"/i) || [0,0]
    var sosa = response.match(/img data-itemidqty="([0-9]+)" data-name="Sammy Sosa's Special Sauce"/i) || [0,0]
    var pumpkin = response.match(/img data-itemidqty="([0-9]+)" data-name="Pumpkin Juice"/i) || [0,0]
    var zombie1 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 1"/i) || [0,0]
    var zombie2 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 2"/i) || [0,0]
    var zombie3 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 3"/i) || [0,0]
    var zombie4 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 4"/i) || [0,0]
    var zombie5 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 5"/i) || [0,0]
    var zombie6 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 6"/i) || [0,0]
    var daddy = response.match(/img data-itemidqty="([0-9]+)" data-name="Sugar Daddy"/i) || [0,0]
    var endurance = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Endurance"/i) || [0,0]
    var rem75 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 7"/i) || [0,0]
    var rem80 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 8"/i) || [0,0]
    var rem85 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 9"/i) || [0,0]
    var rem90 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 10"/i) || [0,0]

var collectionlinks = "collections?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(collectionlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const anjoutable = doc.querySelector("#divCollections > div.row > div:nth-child(1) > div > div > div.user-info.w-100.pr-3 > ul")
    const reikartable = doc.querySelector("#divCollections > div.row > div:nth-child(2) > div > div > div.user-info.w-100.pr-3 > ul")
    const lorrentable = doc.querySelector("#divCollections > div.row > div:nth-child(3) > div > div > div.user-info.w-100.pr-3 > ul")
    const luciletable = doc.querySelector("#divCollections > div.row > div:nth-child(4) > div > div > div.user-info.w-100.pr-3 > ul")
    const weimatable = doc.querySelector("#divCollections > div.row > div:nth-child(5) > div > div > div.user-info.w-100.pr-3 > ul")
    const soumatable = doc.querySelector("#divCollections > div.row > div:nth-child(6) > div > div > div.user-info.w-100.pr-3 > ul")
    const vanishatable = doc.querySelector("#divCollections > div.row > div:nth-child(7) > div > div > div.user-info.w-100.pr-3 > ul")
    const drolbatable = doc.querySelector("#divCollections > div.row > div:nth-child(8) > div > div > div.user-info.w-100.pr-3 > ul")
    const quibeltable = doc.querySelector("#divCollections > div.row > div:nth-child(9) > div > div > div.user-info.w-100.pr-3 > ul")
    var anjou = Math.ceil(((anjoutable.innerHTML.match(/img/g) || []).length)/3*100)
    var reikar = Math.ceil(((reikartable.innerHTML.match(/img/g) || []).length)/3*100)
    var lorren = Math.ceil(((lorrentable.innerHTML.match(/img/g) || []).length)/3*100)
    var lucile = Math.ceil(((luciletable.innerHTML.match(/img/g) || []).length)/3*100)
    var weima = Math.ceil(((weimatable.innerHTML.match(/img/g) || []).length)/3*100)
    var souma = Math.ceil(((soumatable.innerHTML.match(/img/g) || []).length)/3*100)
    var vanisha = Math.ceil(((vanishatable.innerHTML.match(/img/g) || []).length)/3*100)
    var drolba = Math.ceil(((drolbatable.innerHTML.match(/img/g) || []).length)/3*100)
    var quibel = Math.ceil(((quibeltable.innerHTML.match(/img/g) || []).length)/3*100)
    var collections_total = Math.ceil((anjou+reikar+lorren+lucile+weima+souma+vanisha+drolba+quibel)/9)

var archlinks = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4046"
fetch(archlinks)
    .then (response => response.text())
    .then((response) => {
    var hovok = ''; if (response.match(/Error, could not find mob from here./i) != null){hovok = ""}if (response.match(/Quest help activated!/i) != null){hovok = "alive"}if (response.match(/Quest help activated!/i) == null){hovok = "dead"}

var seeplink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4379"
fetch(seeplink)
    .then (response => response.text())
    .then((response) => {
    var seeping = ''; if (response.match(/Error, could not find mob from here./i) != null){seeping = ""}if (response.match(/Quest help activated!/i) != null){seeping = "alive"}if (response.match(/Quest help activated!/i) == null){seeping = "dead"}

var deluglink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4380"
fetch(deluglink)
    .then (response => response.text())
    .then((response) => {
    var deluged = ''; if (response.match(/Error, could not find mob from here./i) != null){deluged = ""}if (response.match(/Quest help activated!/i) != null){deluged = "alive"}if (response.match(/Quest help activated!/i) == null){deluged = "dead"}

var vollink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4381"
fetch(vollink)
    .then (response => response.text())
    .then((response) => {
    var volatile = ''; if (response.match(/Error, could not find mob from here./i) != null){volatile = ""}if (response.match(/Quest help activated!/i) != null){volatile = "alive"}if (response.match(/Quest help activated!/i) == null){volatile = "dead"}

var corlink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4050"
fetch(corlink)
    .then (response => response.text())
    .then((response) => {
    var corvok = ''; if (response.match(/Error, could not find mob from here./i) != null){corvok = ""}if (response.match(/Quest help activated!/i) != null){corvok = "alive"}if (response.match(/Quest help activated!/i) == null){corvok = "dead"}

if (corvok == "alive") corvready += name[1]+","
if (parseInt(elefuser[1]) >= 10 && parseInt(rune_lvl) == 3) primalready += name[1]+",";
if (parseInt(elefuser[1]) >= 20 && parseInt(rune_lvl) == 4) respready += name[1]+",";
if (parseInt(elefuser[1]) >= 70 && parseInt(rune_lvl) == 5) mysticready += name[1]+",";
if (deluged == "alive") delready += name[1]+",";
if (seeping == "alive") seepready += name[1]+",";
if (volatile == "alive") volready += name[1]+",";
if (hovok == "alive") hovokready += name[1]+",";
if (parseInt(archfrag[1]) >= 10) fragready += name[1]+","
if (chaosore[1] >= 1 && gem_lvl <= 31) oreready += name[1]+","
if (chaosore[1] >= 2 && gem_lvl >= 32 && gem_lvl <= 40) oreready += name[1]+","
if (chaosore[1] >= 3 && gem_lvl == 40) oreready += name[1]+","
if (chaosore[1] >= 4 && gem_lvl == 41) oreready += name[1]+","
if (badgerep[1] >= 15) badgeready += name[1]+","

var cloned = ''; if (core_cloned+head_cloned+neck_cloned+weapon_cloned+body_cloned+shield_cloned+pants_cloned+belt_cloned+ring_cloned+foot_cloned == 10) cloned = "YES";if (core_cloned+head_cloned+neck_cloned+weapon_cloned+body_cloned+shield_cloned+pants_cloned+belt_cloned+ring_cloned+foot_cloned != 10) cloned = "NO";

var neededtolvl = '';
90==level[1]&&(neededtolvl=0),89==level[1]&&(neededtolvl=5e10-parseInt(experience[1].replaceAll(",",""))),88==level[1]&&(neededtolvl=41e9-parseInt(experience[1].replaceAll(",",""))),87==level[1]&&(neededtolvl=33e9-parseInt(experience[1].replaceAll(",",""))),86==level[1]&&(neededtolvl=26e9-parseInt(experience[1].replaceAll(",",""))),85==level[1]&&(neededtolvl=2e10-parseInt(experience[1].replaceAll(",",""))),84==level[1]&&(neededtolvl=15e9-parseInt(experience[1].replaceAll(",",""))),83==level[1]&&(neededtolvl=1e10-parseInt(experience[1].replaceAll(",",""))),82==level[1]&&(neededtolvl=675e7-parseInt(experience[1].replaceAll(",",""))),81==level[1]&&(neededtolvl=45e8-parseInt(experience[1].replaceAll(",",""))),80==level[1]&&(neededtolvl=3e9-parseInt(experience[1].replaceAll(",",""))),79==level[1]&&(neededtolvl=2e9-parseInt(experience[1].replaceAll(",",""))),78==level[1]&&(neededtolvl=145092e4-parseInt(experience[1].replaceAll(",",""))),77==level[1]&&(neededtolvl=9956e5-parseInt(experience[1].replaceAll(",",""))),76==level[1]&&(neededtolvl=675e6-parseInt(experience[1].replaceAll(",",""))),75==level[1]&&(neededtolvl=385e6-parseInt(experience[1].replaceAll(",",""))),74==level[1]&&(neededtolvl=1849e5-parseInt(experience[1].replaceAll(",",""))),73==level[1]&&(neededtolvl=1524e5-parseInt(experience[1].replaceAll(",",""))),72==level[1]&&(neededtolvl=1264e5-parseInt(experience[1].replaceAll(",",""))),71==level[1]&&(neededtolvl=1069e5-parseInt(experience[1].replaceAll(",",""))),70==level[1]&&(neededtolvl=9065e4-parseInt(experience[1].replaceAll(",",""))),69==level[1]&&(neededtolvl=77e6-parseInt(experience[1].replaceAll(",",""))),68==level[1]&&(neededtolvl=6875e4-parseInt(experience[1].replaceAll(",",""))),67==level[1]&&(neededtolvl=6175e4-parseInt(experience[1].replaceAll(",",""))),66==level[1]&&(neededtolvl=5575e4-parseInt(experience[1].replaceAll(",",""))),65==level[1]&&(neededtolvl=4975e4-parseInt(experience[1].replaceAll(",",""))),64==level[1]&&(neededtolvl=4475e4-parseInt(experience[1].replaceAll(",",""))),63==level[1]&&(neededtolvl=3975e4-parseInt(experience[1].replaceAll(",",""))),62==level[1]&&(neededtolvl=3575e4-parseInt(experience[1].replaceAll(",",""))),61==level[1]&&(neededtolvl=3175e4-parseInt(experience[1].replaceAll(",",""))),60==level[1]&&(neededtolvl=28e6-parseInt(experience[1].replaceAll(",",""))),59==level[1]&&(neededtolvl=2475e4-parseInt(experience[1].replaceAll(",",""))),58==level[1]&&(neededtolvl=2225e4-parseInt(experience[1].replaceAll(",",""))),57==level[1]&&(neededtolvl=1975e4-parseInt(experience[1].replaceAll(",",""))),56==level[1]&&(neededtolvl=1725e4-parseInt(experience[1].replaceAll(",",""))),55==level[1]&&(neededtolvl=1475e4-parseInt(experience[1].replaceAll(",",""))),54==level[1]&&(neededtolvl=1275e4-parseInt(experience[1].replaceAll(",",""))),53==level[1]&&(neededtolvl=1105e4-parseInt(experience[1].replaceAll(",",""))),52==level[1]&&(neededtolvl=925e4-parseInt(experience[1].replaceAll(",",""))),51==level[1]&&(neededtolvl=775e4-parseInt(experience[1].replaceAll(",",""))),50==level[1]&&(neededtolvl=65e5-parseInt(experience[1].replaceAll(",",""))),49==level[1]&&(neededtolvl=525e4-parseInt(experience[1].replaceAll(",",""))),48==level[1]&&(neededtolvl=4935e3-parseInt(experience[1].replaceAll(",",""))),47==level[1]&&(neededtolvl=462e4-parseInt(experience[1].replaceAll(",",""))),46==level[1]&&(neededtolvl=4312500-parseInt(experience[1].replaceAll(",",""))),45==level[1]&&(neededtolvl=399e4-parseInt(experience[1].replaceAll(",",""))),44==level[1]&&(neededtolvl=3687500-parseInt(experience[1].replaceAll(",",""))),43==level[1]&&(neededtolvl=338e4-parseInt(experience[1].replaceAll(",",""))),42==level[1]&&(neededtolvl=3105e3-parseInt(experience[1].replaceAll(",",""))),41==level[1]&&(neededtolvl=28e5-parseInt(experience[1].replaceAll(",",""))),40==level[1]&&(neededtolvl=2537500-parseInt(experience[1].replaceAll(",",""))),39==level[1]&&(neededtolvl=2325e3-parseInt(experience[1].replaceAll(",",""))),38==level[1]&&(neededtolvl=2131250-parseInt(experience[1].replaceAll(",",""))),37==level[1]&&(neededtolvl=192e4-parseInt(experience[1].replaceAll(",",""))),36==level[1]&&(neededtolvl=1732500-parseInt(experience[1].replaceAll(",",""))),35==level[1]&&(neededtolvl=153e4-parseInt(experience[1].replaceAll(",",""))),34==level[1]&&(neededtolvl=1378125-parseInt(experience[1].replaceAll(",",""))),33==level[1]&&(neededtolvl=1224e3-parseInt(experience[1].replaceAll(",",""))),32==level[1]&&(neededtolvl=1082250-parseInt(experience[1].replaceAll(",",""))),31==level[1]&&(neededtolvl=95e4-parseInt(experience[1].replaceAll(",",""))),30==level[1]&&(neededtolvl=838500-parseInt(experience[1].replaceAll(",",""))),29==level[1]&&(neededtolvl=735e3-parseInt(experience[1].replaceAll(",",""))),28==level[1]&&(neededtolvl=625e3-parseInt(experience[1].replaceAll(",",""))),27==level[1]&&(neededtolvl=525e3-parseInt(experience[1].replaceAll(",",""))),26==level[1]&&(neededtolvl=445e3-parseInt(experience[1].replaceAll(",",""))),25==level[1]&&(neededtolvl=37e4-parseInt(experience[1].replaceAll(",",""))),24==level[1]&&(neededtolvl=31e4-parseInt(experience[1].replaceAll(",",""))),23==level[1]&&(neededtolvl=26e4-parseInt(experience[1].replaceAll(",",""))),22==level[1]&&(neededtolvl=215e3-parseInt(experience[1].replaceAll(",",""))),21==level[1]&&(neededtolvl=165e3-parseInt(experience[1].replaceAll(",",""))),20==level[1]&&(neededtolvl=13e4-parseInt(experience[1].replaceAll(",",""))),19==level[1]&&(neededtolvl=1e5-parseInt(experience[1].replaceAll(",",""))),18==level[1]&&(neededtolvl=75e3-parseInt(experience[1].replaceAll(",",""))),17==level[1]&&(neededtolvl=55e3-parseInt(experience[1].replaceAll(",",""))),16==level[1]&&(neededtolvl=4e4-parseInt(experience[1].replaceAll(",",""))),15==level[1]&&(neededtolvl=28e3-parseInt(experience[1].replaceAll(",",""))),14==level[1]&&(neededtolvl=18e3-parseInt(experience[1].replaceAll(",",""))),13==level[1]&&(neededtolvl=12e3-parseInt(experience[1].replaceAll(",",""))),12==level[1]&&(neededtolvl=8e3-parseInt(experience[1].replaceAll(",",""))),11==level[1]&&(neededtolvl=5e3-parseInt(experience[1].replaceAll(",",""))),10==level[1]&&(neededtolvl=3e3-parseInt(experience[1].replaceAll(",",""))),9==level[1]&&(neededtolvl=1500-parseInt(experience[1].replaceAll(",",""))),8==level[1]&&(neededtolvl=1e3-parseInt(experience[1].replaceAll(",",""))),7==level[1]&&(neededtolvl=700-parseInt(experience[1].replaceAll(",",""))),6==level[1]&&(neededtolvl=450-parseInt(experience[1].replaceAll(",",""))),5==level[1]&&(neededtolvl=250-parseInt(experience[1].replaceAll(",",""))),4==level[1]&&(neededtolvl=150-parseInt(experience[1].replaceAll(",",""))),3==level[1]&&(neededtolvl=50-parseInt(experience[1].replaceAll(",",""))),2==level[1]&&(neededtolvl=25-parseInt(experience[1].replaceAll(",",""))),1==level[1]&&(neededtolvl=7-parseInt(experience[1].replaceAll(",","")));

count += 1

tot_openaugs += core_openaugs+head_openaugs+neck_openaugs+weapon_openaugs+body_openaugs+shield_openaugs+pants_openaugs+belt_openaugs+ring_openaugs+foot_openaugs
document.querySelector("#math_openaugs").innerHTML = `<p>TOT: `+Math.ceil(tot_openaugs).toLocaleString("en-US")
tot_lvl += parseInt((level[1]).replaceAll(",",""))
document.querySelector("#math_lvl").innerHTML = `<p>AVG: `+Math.ceil(tot_lvl/count).toLocaleString("en-US")
tot_today += parseInt((today[1]).replaceAll(",",""))
document.querySelector("#math_today").innerHTML = `<p>AVG: `+Math.ceil(tot_today/count).toLocaleString("en-US")
tot_yesterday += parseInt((yesterday[1]).replaceAll(",",""))
document.querySelector("#math_yesterday").innerHTML = `<p>AVG: `+Math.ceil(tot_yesterday/count).toLocaleString("en-US")
tot_gemlvl += gem_lvl
document.querySelector("#math_gemlvl").innerHTML = `<p>AVG: `+Math.ceil(tot_gemlvl/count).toLocaleString("en-US")
tot_runelvl += rune_lvl
document.querySelector("#math_runelvl").innerHTML = `<p>AVG: `+Math.ceil(tot_runelvl/count).toLocaleString("en-US")
tot_badgelvl += badge_level
document.querySelector("#math_badgelvl").innerHTML = `<p>AVG: `+Math.ceil(tot_badgelvl/count).toLocaleString("en-US")
tot_mrage += parseInt(mrage[1].replaceAll(",",""))
document.querySelector("#math_mr").innerHTML = `<p>AVG: `+Math.ceil(tot_mrage/count).toLocaleString("en-US")+`<p>TOT: `+tot_mrage.toLocaleString("en-US")
tot_power += parseInt(power[1].replaceAll(",",""))
document.querySelector("#math_power").innerHTML = `<p>AVG: `+Math.ceil(tot_power/count).toLocaleString("en-US")+`<p>TOT: `+tot_power.toLocaleString("en-US")
tot_ele += parseInt(eledmg[1].replaceAll(",",""))
document.querySelector("#math_ele").innerHTML = `<p>AVG: `+Math.ceil(tot_ele/count).toLocaleString("en-US")+`<p>TOT: `+tot_ele.toLocaleString("en-US")
tot_atk += parseInt(attack[1].replaceAll(",",""))
document.querySelector("#math_atk").innerHTML = `<p>AVG: `+Math.ceil(tot_atk/count).toLocaleString("en-US")+`<p>TOT: `+tot_atk.toLocaleString("en-US")
tot_hp += parseInt(hp[1].replaceAll(",",""))
document.querySelector("#math_hp").innerHTML = `<p>AVG: `+Math.ceil(tot_hp/count).toLocaleString("en-US")+`<p>TOT: `+tot_hp.toLocaleString("en-US")
tot_chaos += parseInt(chaos[1].replaceAll(",",""))
document.querySelector("#math_chaos").innerHTML = `<p>AVG: `+Math.ceil(tot_chaos/count).toLocaleString("en-US")+`<p>TOT: `+tot_chaos.toLocaleString("en-US")
tot_wilderness += parseInt(wilderness[1].replaceAll(",",""))
document.querySelector("#math_wilderness").innerHTML = `<p>AVG: `+Math.ceil(tot_wilderness/count).toLocaleString("en-US")+`<p>TOT: `+tot_wilderness.toLocaleString("en-US")
tot_slayer += parseInt(slayer[1].replaceAll(",",""))
document.querySelector("#math_slayer").innerHTML = `<p>AVG: `+Math.ceil(tot_slayer/count).toLocaleString("en-US")+`<p>TOT: `+tot_slayer.toLocaleString("en-US")

var loading = Math.ceil(count/(charsTableRows-1)*100)

document.querySelector("#loading").innerHTML = loading;

document.querySelector("#loading_chars").innerHTML = name[1];

if (loading == 100){
GM_addStyle ( `
#moxxivision {display:revert !important;}
#button {display:revert !important;}
#Xmoxxivision {display:none !important;}
#vision {display:none !important;}
body{overflow-y: auto;}
`);}

var menu = document.querySelector("#content > table > tbody > tr:nth-child("+rownum+")");

let td1 = document.createElement('td');
td1.innerHTML = `<a href="/world?suid=`+id[1]+`">`+name[1]+`</a>`
td1.setAttribute("class","freeze")
insertAfter(td1, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = parseInt((level[1]).replaceAll(",",""));
td2.setAttribute("class","freeze")
insertAfter(td2, menu.lastElementChild);

let td45 = document.createElement('td');
td45.innerHTML = skillclass[1];
td45.setAttribute("class","home column")
insertAfter(td45, menu.lastElementChild);
if (skillclass[1] == "Ferocity") {
var circlinks = "skills_info.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&id=3008"
fetch(circlinks)
.then (response => response.text())
.then((response) => {
if (response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null)
{td45.style = "color:#CE8C00";td45.innerHTML = "Ferocity: Circ Ready"};})}

let td44 = document.createElement('td');
td44.innerHTML = level[2];
td44.setAttribute("class","home column")
insertAfter(td44, menu.lastElementChild);

let td11 = document.createElement('td');
td11.innerHTML = crew[2];
td11.setAttribute("class","home column")
insertAfter(td11, menu.lastElementChild);

let td39 = document.createElement('td');
td39.innerHTML = items.length;
td39.setAttribute("class","home column");
insertAfter(td39, menu.lastElementChild);
if (items.length <= 9) {td39.style = "color:#FF0000";}

let td41 = document.createElement('td');
td41.innerHTML = parseInt(rage[1].replaceAll(",",""));
td41.setAttribute("class","home column");
insertAfter(td41, menu.lastElementChild);

let td42 = document.createElement('td');
td42.innerHTML = tomax+` turns`;
td42.setAttribute("class","home column");
insertAfter(td42, menu.lastElementChild);
if (tomax == 0) {td42.style = "color:#00FF00";}

let td38 = document.createElement('td');
td38.innerHTML = parseInt((today[1]).replaceAll(",",""));
td38.setAttribute("class","home column");
insertAfter(td38, menu.lastElementChild);
if (parseInt((today[1]).replaceAll(",","")) <= 0) {td38.style = "color:#FF0000";}

let td37 = document.createElement('td');
td37.innerHTML = parseInt((yesterday[1]).replaceAll(",",""));
td37.setAttribute("class","home column");
insertAfter(td37, menu.lastElementChild);
if (parseInt((yesterday[1]).replaceAll(",","")) <= 0) {td37.style = "color:#FF0000";}

let td36 = document.createElement('td');
td36.innerHTML = parseInt(strength[1]);
td36.setAttribute("class","home column");
insertAfter(td36, menu.lastElementChild);
if (parseInt((strength[1]).replaceAll(",","")) <= 99) {td36.style = "color:#FF0000";}

let td43 = document.createElement('td');
td43.innerHTML = parseInt(supplies[1]);
td43.setAttribute("class","home column");
insertAfter(td43, menu.lastElementChild);
if (parseInt((supplies[1]).replaceAll(",","")) <= 99) {td43.style = "color:#FF0000";}

document.getElementById ("buttonx").addEventListener("click", ButtonX, false);
function ButtonX (zEvent) {

fetch('supplies?suid='+id[1], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({

      'buymax': 'Buy Max',

})
}).then(res => res.text())
  .then(res => {
var supplieslinks = "supplies?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(supplieslinks)
   .then(response => response.text())
   .then((response) => {
    var supplies = response.match(/<img border="0" src="images\/suppliestriangle\.gif" width="11" height="11">[\n\r](.*)%<\/td>/i)
    td43.innerHTML = parseInt(supplies[1]);
    if (parseInt((supplies[1]).replaceAll(",","")) == 100) {td43.style = "color:#FFFFFF";}
    })
  });}

let td10 = document.createElement('td');
td10.innerHTML = parseInt(experience[1].replaceAll(",",""));
td10.setAttribute("class","stats column")
insertAfter(td10, menu.lastElementChild);

let td5 = document.createElement('td');
td5.innerHTML = neededtolvl;
if (neededtolvl == 0) td5.innerHTML = "--"
td5.setAttribute("class","stats column")
insertAfter(td5, menu.lastElementChild);

let td40 = document.createElement('td');
td40.innerHTML = parseInt(mrage[1].replaceAll(",",""));
td40.setAttribute("class","stats column")
insertAfter(td40, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = parseInt(power[1].replaceAll(",",""));
td3.setAttribute("class","stats column")
insertAfter(td3, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = parseInt(eledmg[1].replaceAll(",",""));
td4.setAttribute("class","stats column")
insertAfter(td4, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = parseInt(attack[1].replaceAll(",",""));
td6.setAttribute("class","stats column")
insertAfter(td6, menu.lastElementChild);

let td7 = document.createElement('td');
td7.innerHTML = parseInt(hp[1].replaceAll(",",""));
td7.setAttribute("class","stats column")
insertAfter(td7, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = parseInt(chaos[1].replaceAll(",",""));
td8.setAttribute("class","stats column")
insertAfter(td8, menu.lastElementChild);

let td31 = document.createElement('td');
td31.innerHTML = holyRes[1];
td31.setAttribute("class","stats column");
insertAfter(td31, menu.lastElementChild);

let td32 = document.createElement('td');
td32.innerHTML = arcaneRes[1];
td32.setAttribute("class","stats column");
insertAfter(td32, menu.lastElementChild);

let td33 = document.createElement('td');
td33.innerHTML = shadowRes[1];
td33.setAttribute("class","stats column");
insertAfter(td33, menu.lastElementChild);

let td34 = document.createElement('td');
td34.innerHTML = fireRes[1];
td34.setAttribute("class","stats column");
insertAfter(td34, menu.lastElementChild);

let td35 = document.createElement('td');
td35.innerHTML = kineticRes[1];
td35.setAttribute("class","stats column");
insertAfter(td35, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = parseInt(wilderness[1].replaceAll(",",""));
td9.setAttribute("class","stats column")
insertAfter(td9, menu.lastElementChild);

let td27 = document.createElement('td');
td27.innerHTML = parseInt(slayer[1].replaceAll(",",""));
td27.setAttribute("class","stats column")
insertAfter(td27, menu.lastElementChild);

let td47 = document.createElement('td');
td47.innerHTML = tome;
td47.setAttribute("class","skills column")
insertAfter(td47, menu.lastElementChild);

let td46 = document.createElement('td');
td46.innerHTML = castskills;
td46.setAttribute("class","skills column")
insertAfter(td46, menu.lastElementChild);

let td12 = document.createElement("td");
td12.innerHTML = core;
td12.setAttribute("class","eq column");
insertAfter(td12,menu.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = head;
td13.setAttribute("class","eq column")
insertAfter(td13, menu.lastElementChild);

let td14 = document.createElement('td');
td14.innerHTML = neck;
td14.setAttribute("class","eq column")
insertAfter(td14, menu.lastElementChild);

let td15 = document.createElement('td');
td15.innerHTML = weapon;
td15.setAttribute("class","eq column")
insertAfter(td15, menu.lastElementChild);

let td16 = document.createElement('td');
td16.innerHTML = body;
td16.setAttribute("class","eq column")
insertAfter(td16, menu.lastElementChild);

let td17 = document.createElement('td');
td17.innerHTML = shield;
td17.setAttribute("class","eq column")
insertAfter(td17, menu.lastElementChild);

let td18 = document.createElement('td');
td18.innerHTML = pants;
td18.setAttribute("class","eq column")
insertAfter(td18, menu.lastElementChild);

let td19 = document.createElement('td');
td19.innerHTML = belt;
td19.setAttribute("class","eq column")
insertAfter(td19, menu.lastElementChild);

let td20 = document.createElement('td');
td20.innerHTML = ring;
td20.setAttribute("class","eq column")
insertAfter(td20, menu.lastElementChild);

let td21 = document.createElement('td');
td21.innerHTML = foot;
td21.setAttribute("class","eq column")
insertAfter(td21, menu.lastElementChild);

let td22 = document.createElement('td');
td22.innerHTML = gem;
td22.setAttribute("class","eq column")
insertAfter(td22, menu.lastElementChild);

let td23 = document.createElement('td');
td23.innerHTML = rune;
td23.setAttribute("class","eq column")
insertAfter(td23, menu.lastElementChild);

let td24 = document.createElement('td');
td24.innerHTML = orb1;
td24.setAttribute("class","eq column")
insertAfter(td24, menu.lastElementChild);

let td30 = document.createElement('td');
td30.innerHTML = orb2;
td30.setAttribute("class","eq column")
insertAfter(td30, menu.lastElementChild);

let td28 = document.createElement('td');
td28.innerHTML = orb3;
td28.setAttribute("class","eq column")
insertAfter(td28, menu.lastElementChild);

let td25 = document.createElement('td');
td25.innerHTML = badge;
td25.setAttribute("class","eq column")
insertAfter(td25, menu.lastElementChild);

let td26 = document.createElement('td');
td26.innerHTML = booster;
td26.setAttribute("class","eq column")
insertAfter(td26, menu.lastElementChild);

let td122 = document.createElement('td');
td122.innerHTML = cloned;
td122.setAttribute("class","eq column")
insertAfter(td122, menu.lastElementChild);

let td169 = document.createElement('td');
td169.innerHTML = core_openaugs+head_openaugs+neck_openaugs+weapon_openaugs+body_openaugs+shield_openaugs+pants_openaugs+belt_openaugs+ring_openaugs+foot_openaugs
td169.setAttribute("class","eq column")
insertAfter(td169, menu.lastElementChild);

let td_core = document.createElement('td');
td_core.innerHTML = core;
td_core.setAttribute("class","core column")
insertAfter(td_core, menu.lastElementChild);

let td_core_name = document.createElement('td');
td_core_name.innerHTML = core_name;
td_core_name.setAttribute("class","core column")
td_core_name.setAttribute("style","color:#"+core_rarity)
insertAfter(td_core_name, menu.lastElementChild);

let td_core_mr = document.createElement('td');
td_core_mr.innerHTML = core_mr;
td_core_mr.setAttribute("class","core column")
insertAfter(td_core_mr, menu.lastElementChild);

let td_core_atk = document.createElement('td');
td_core_atk.innerHTML = core_atk;
td_core_atk.setAttribute("class","core column")
insertAfter(td_core_atk, menu.lastElementChild);

let td_core_ele = document.createElement('td');
td_core_ele.innerHTML = core_holy+core_arcane+core_kinetic+core_shadow+core_fire;
td_core_ele.setAttribute("class","core column")
insertAfter(td_core_ele, menu.lastElementChild);

let td_core_chaos = document.createElement('td');
td_core_chaos.innerHTML = core_chaos;
td_core_chaos.setAttribute("class","core column")
insertAfter(td_core_chaos, menu.lastElementChild);

let td_core_vile = document.createElement('td');
td_core_vile.innerHTML = core_vile;
td_core_vile.setAttribute("class","core column")
insertAfter(td_core_vile, menu.lastElementChild);

let td_core_hp = document.createElement('td');
td_core_hp.innerHTML = core_hp;
td_core_hp.setAttribute("class","core column")
insertAfter(td_core_hp, menu.lastElementChild);

let td_core_resist = document.createElement('td');
td_core_resist.innerHTML = core_holyr+core_arcaner+core_shadowr+core_firer+core_kineticr;
td_core_resist.setAttribute("class","core column")
insertAfter(td_core_resist, menu.lastElementChild);

let td_core_block = document.createElement('td');
td_core_block.innerHTML = core_block;
td_core_block.setAttribute("class","core column")
insertAfter(td_core_block, menu.lastElementChild);

let td_core_eblock = document.createElement('td');
td_core_eblock.innerHTML = core_eblock;
td_core_eblock.setAttribute("class","core column")
insertAfter(td_core_eblock, menu.lastElementChild);

let td_core_rpt = document.createElement('td');
td_core_rpt.innerHTML = core_rpt;
td_core_rpt.setAttribute("class","core column")
insertAfter(td_core_rpt, menu.lastElementChild);

let td_core_ept = document.createElement('td');
td_core_ept.innerHTML = core_ept;
td_core_ept.setAttribute("class","core column")
insertAfter(td_core_ept, menu.lastElementChild);

let td_core_ramp = document.createElement('td');
td_core_ramp.innerHTML = core_ramp;
td_core_ramp.setAttribute("class","core column")
insertAfter(td_core_ramp, menu.lastElementChild);

let td_core_crit = document.createElement('td');
td_core_crit.innerHTML = core_crit;
td_core_crit.setAttribute("class","core column")
insertAfter(td_core_crit, menu.lastElementChild);

let td_core_gems = document.createElement('td');
td_core_gems.innerHTML = core_gems;
td_core_gems.setAttribute("class","core column")
insertAfter(td_core_gems, menu.lastElementChild);

let td_core_augs = document.createElement('td');
td_core_augs.innerHTML = core_openaugs;
td_core_augs.setAttribute("class","core column")
insertAfter(td_core_augs, menu.lastElementChild);

let td_core_upgrade = document.createElement('td');
td_core_upgrade.innerHTML = core_upgrade;
if (core_upgrade == 1.00) td_core_upgrade.innerHTML = '--';
td_core_upgrade.setAttribute("class","core column")
insertAfter(td_core_upgrade, menu.lastElementChild);

let td_head = document.createElement('td');
td_head.innerHTML = head;
td_head.setAttribute("class","head column")
insertAfter(td_head, menu.lastElementChild);

let td_head_name = document.createElement('td');
td_head_name.innerHTML = head_name;
td_head_name.setAttribute("class","head column")
td_head_name.setAttribute("style","color:#"+head_rarity)
insertAfter(td_head_name, menu.lastElementChild);

let td_head_mr = document.createElement('td');
td_head_mr.innerHTML = head_mr;
td_head_mr.setAttribute("class","head column")
insertAfter(td_head_mr, menu.lastElementChild);

let td_head_atk = document.createElement('td');
td_head_atk.innerHTML = head_atk;
td_head_atk.setAttribute("class","head column")
insertAfter(td_head_atk, menu.lastElementChild);

let td_head_ele = document.createElement('td');
td_head_ele.innerHTML = head_holy+head_arcane+head_kinetic+head_shadow+head_fire;
td_head_ele.setAttribute("class","head column")
insertAfter(td_head_ele, menu.lastElementChild);

let td_head_chaos = document.createElement('td');
td_head_chaos.innerHTML = head_chaos;
td_head_chaos.setAttribute("class","head column")
insertAfter(td_head_chaos, menu.lastElementChild);

let td_head_vile = document.createElement('td');
td_head_vile.innerHTML = head_vile;
td_head_vile.setAttribute("class","head column")
insertAfter(td_head_vile, menu.lastElementChild);

let td_head_hp = document.createElement('td');
td_head_hp.innerHTML = head_hp;
td_head_hp.setAttribute("class","head column")
insertAfter(td_head_hp, menu.lastElementChild);

let td_head_resist = document.createElement('td');
td_head_resist.innerHTML = head_holyr+head_arcaner+head_shadowr+head_firer+head_kineticr;
td_head_resist.setAttribute("class","head column")
insertAfter(td_head_resist, menu.lastElementChild);

let td_head_block = document.createElement('td');
td_head_block.innerHTML = head_block;
td_head_block.setAttribute("class","head column")
insertAfter(td_head_block, menu.lastElementChild);

let td_head_eblock = document.createElement('td');
td_head_eblock.innerHTML = head_eblock;
td_head_eblock.setAttribute("class","head column")
insertAfter(td_head_eblock, menu.lastElementChild);

let td_head_rpt = document.createElement('td');
td_head_rpt.innerHTML = head_rpt;
td_head_rpt.setAttribute("class","head column")
insertAfter(td_head_rpt, menu.lastElementChild);

let td_head_ept = document.createElement('td');
td_head_ept.innerHTML = head_ept;
td_head_ept.setAttribute("class","head column")
insertAfter(td_head_ept, menu.lastElementChild);

let td_head_ramp = document.createElement('td');
td_head_ramp.innerHTML = head_ramp;
td_head_ramp.setAttribute("class","head column")
insertAfter(td_head_ramp, menu.lastElementChild);

let td_head_crit = document.createElement('td');
td_head_crit.innerHTML = head_crit;
td_head_crit.setAttribute("class","head column")
insertAfter(td_head_crit, menu.lastElementChild);

let td_head_gems = document.createElement('td');
td_head_gems.innerHTML = head_gems;
td_head_gems.setAttribute("class","head column")
insertAfter(td_head_gems, menu.lastElementChild);

let td_head_augs = document.createElement('td');
td_head_augs.innerHTML = head_openaugs;
td_head_augs.setAttribute("class","head column")
insertAfter(td_head_augs, menu.lastElementChild);

let td_head_upgrade = document.createElement('td');
td_head_upgrade.innerHTML = head_upgrade;
if (head_upgrade == 1.00) td_head_upgrade.innerHTML = '--';
td_head_upgrade.setAttribute("class","head column")
insertAfter(td_head_upgrade, menu.lastElementChild);

let td_neck = document.createElement('td');
td_neck.innerHTML = neck;
td_neck.setAttribute("class","neck column")
insertAfter(td_neck, menu.lastElementChild);

let td_neck_name = document.createElement('td');
td_neck_name.innerHTML = neck_name;
td_neck_name.setAttribute("class","neck column")
td_neck_name.setAttribute("style","color:#"+neck_rarity)
insertAfter(td_neck_name, menu.lastElementChild);

let td_neck_mr = document.createElement('td');
td_neck_mr.innerHTML = neck_mr;
td_neck_mr.setAttribute("class","neck column")
insertAfter(td_neck_mr, menu.lastElementChild);

let td_neck_atk = document.createElement('td');
td_neck_atk.innerHTML = neck_atk;
td_neck_atk.setAttribute("class","neck column")
insertAfter(td_neck_atk, menu.lastElementChild);

let td_neck_ele = document.createElement('td');
td_neck_ele.innerHTML = neck_holy+neck_arcane+neck_kinetic+neck_shadow+neck_fire;
td_neck_ele.setAttribute("class","neck column")
insertAfter(td_neck_ele, menu.lastElementChild);

let td_neck_chaos = document.createElement('td');
td_neck_chaos.innerHTML = neck_chaos;
td_neck_chaos.setAttribute("class","neck column")
insertAfter(td_neck_chaos, menu.lastElementChild);

let td_neck_vile = document.createElement('td');
td_neck_vile.innerHTML = neck_vile;
td_neck_vile.setAttribute("class","neck column")
insertAfter(td_neck_vile, menu.lastElementChild);

let td_neck_hp = document.createElement('td');
td_neck_hp.innerHTML = neck_hp;
td_neck_hp.setAttribute("class","neck column")
insertAfter(td_neck_hp, menu.lastElementChild);

let td_neck_resist = document.createElement('td');
td_neck_resist.innerHTML = neck_holyr+neck_arcaner+neck_shadowr+neck_firer+neck_kineticr;
td_neck_resist.setAttribute("class","neck column")
insertAfter(td_neck_resist, menu.lastElementChild);

let td_neck_block = document.createElement('td');
td_neck_block.innerHTML = neck_block;
td_neck_block.setAttribute("class","neck column")
insertAfter(td_neck_block, menu.lastElementChild);

let td_neck_eblock = document.createElement('td');
td_neck_eblock.innerHTML = neck_eblock;
td_neck_eblock.setAttribute("class","neck column")
insertAfter(td_neck_eblock, menu.lastElementChild);

let td_neck_rpt = document.createElement('td');
td_neck_rpt.innerHTML = neck_rpt;
td_neck_rpt.setAttribute("class","neck column")
insertAfter(td_neck_rpt, menu.lastElementChild);

let td_neck_ept = document.createElement('td');
td_neck_ept.innerHTML = neck_ept;
td_neck_ept.setAttribute("class","neck column")
insertAfter(td_neck_ept, menu.lastElementChild);

let td_neck_ramp = document.createElement('td');
td_neck_ramp.innerHTML = neck_ramp;
td_neck_ramp.setAttribute("class","neck column")
insertAfter(td_neck_ramp, menu.lastElementChild);

let td_neck_crit = document.createElement('td');
td_neck_crit.innerHTML = neck_crit;
td_neck_crit.setAttribute("class","neck column")
insertAfter(td_neck_crit, menu.lastElementChild);

let td_neck_gems = document.createElement('td');
td_neck_gems.innerHTML = neck_gems;
td_neck_gems.setAttribute("class","neck column")
insertAfter(td_neck_gems, menu.lastElementChild);

let td_neck_augs = document.createElement('td');
td_neck_augs.innerHTML = neck_openaugs;
td_neck_augs.setAttribute("class","neck column")
insertAfter(td_neck_augs, menu.lastElementChild);

let td_neck_upgrade = document.createElement('td');
td_neck_upgrade.innerHTML = neck_upgrade;
if (neck_upgrade == 1.00) td_neck_upgrade.innerHTML = '--';
td_neck_upgrade.setAttribute("class","neck column")
insertAfter(td_neck_upgrade, menu.lastElementChild);

let td_weapon = document.createElement('td');
td_weapon.innerHTML = weapon;
td_weapon.setAttribute("class","weapon column")
insertAfter(td_weapon, menu.lastElementChild);

let td_weapon_name = document.createElement('td');
td_weapon_name.innerHTML = weapon_name;
td_weapon_name.setAttribute("class","weapon column")
td_weapon_name.setAttribute("style","color:#"+weapon_rarity)
insertAfter(td_weapon_name, menu.lastElementChild);

let td_weapon_mr = document.createElement('td');
td_weapon_mr.innerHTML = weapon_mr;
td_weapon_mr.setAttribute("class","weapon column")
insertAfter(td_weapon_mr, menu.lastElementChild);

let td_weapon_atk = document.createElement('td');
td_weapon_atk.innerHTML = weapon_atk;
td_weapon_atk.setAttribute("class","weapon column")
insertAfter(td_weapon_atk, menu.lastElementChild);

let td_weapon_ele = document.createElement('td');
td_weapon_ele.innerHTML = weapon_holy+weapon_arcane+weapon_kinetic+weapon_shadow+weapon_fire;
td_weapon_ele.setAttribute("class","weapon column")
insertAfter(td_weapon_ele, menu.lastElementChild);

let td_weapon_chaos = document.createElement('td');
td_weapon_chaos.innerHTML = weapon_chaos;
td_weapon_chaos.setAttribute("class","weapon column")
insertAfter(td_weapon_chaos, menu.lastElementChild);

let td_weapon_vile = document.createElement('td');
td_weapon_vile.innerHTML = weapon_vile;
td_weapon_vile.setAttribute("class","weapon column")
insertAfter(td_weapon_vile, menu.lastElementChild);

let td_weapon_hp = document.createElement('td');
td_weapon_hp.innerHTML = weapon_hp;
td_weapon_hp.setAttribute("class","weapon column")
insertAfter(td_weapon_hp, menu.lastElementChild);

let td_weapon_resist = document.createElement('td');
td_weapon_resist.innerHTML = weapon_holyr+weapon_arcaner+weapon_shadowr+weapon_firer+weapon_kineticr;
td_weapon_resist.setAttribute("class","weapon column")
insertAfter(td_weapon_resist, menu.lastElementChild);

let td_weapon_block = document.createElement('td');
td_weapon_block.innerHTML = weapon_block;
td_weapon_block.setAttribute("class","weapon column")
insertAfter(td_weapon_block, menu.lastElementChild);

let td_weapon_eblock = document.createElement('td');
td_weapon_eblock.innerHTML = weapon_eblock;
td_weapon_eblock.setAttribute("class","weapon column")
insertAfter(td_weapon_eblock, menu.lastElementChild);

let td_weapon_rpt = document.createElement('td');
td_weapon_rpt.innerHTML = weapon_rpt;
td_weapon_rpt.setAttribute("class","weapon column")
insertAfter(td_weapon_rpt, menu.lastElementChild);

let td_weapon_ept = document.createElement('td');
td_weapon_ept.innerHTML = weapon_ept;
td_weapon_ept.setAttribute("class","weapon column")
insertAfter(td_weapon_ept, menu.lastElementChild);

let td_weapon_ramp = document.createElement('td');
td_weapon_ramp.innerHTML = weapon_ramp;
td_weapon_ramp.setAttribute("class","weapon column")
insertAfter(td_weapon_ramp, menu.lastElementChild);

let td_weapon_crit = document.createElement('td');
td_weapon_crit.innerHTML = weapon_crit;
td_weapon_crit.setAttribute("class","weapon column")
insertAfter(td_weapon_crit, menu.lastElementChild);

let td_weapon_gems = document.createElement('td');
td_weapon_gems.innerHTML = weapon_gems;
td_weapon_gems.setAttribute("class","weapon column")
insertAfter(td_weapon_gems, menu.lastElementChild);

let td_weapon_augs = document.createElement('td');
td_weapon_augs.innerHTML = weapon_openaugs;
td_weapon_augs.setAttribute("class","weapon column")
insertAfter(td_weapon_augs, menu.lastElementChild);

let td_weapon_upgrade = document.createElement('td');
td_weapon_upgrade.innerHTML = weapon_upgrade;
if (weapon_upgrade == 1.00) td_weapon_upgrade.innerHTML = '--';
td_weapon_upgrade.setAttribute("class","weapon column")
insertAfter(td_weapon_upgrade, menu.lastElementChild);

let td_body = document.createElement('td');
td_body.innerHTML = body;
td_body.setAttribute("class","body column")
insertAfter(td_body, menu.lastElementChild);

let td_body_name = document.createElement('td');
td_body_name.innerHTML = body_name;
td_body_name.setAttribute("class","body column")
td_body_name.setAttribute("style","color:#"+body_rarity)
insertAfter(td_body_name, menu.lastElementChild);

let td_body_mr = document.createElement('td');
td_body_mr.innerHTML = body_mr;
td_body_mr.setAttribute("class","body column")
insertAfter(td_body_mr, menu.lastElementChild);

let td_body_atk = document.createElement('td');
td_body_atk.innerHTML = body_atk;
td_body_atk.setAttribute("class","body column")
insertAfter(td_body_atk, menu.lastElementChild);

let td_body_ele = document.createElement('td');
td_body_ele.innerHTML = body_holy+body_arcane+body_kinetic+body_shadow+body_fire;
td_body_ele.setAttribute("class","body column")
insertAfter(td_body_ele, menu.lastElementChild);

let td_body_chaos = document.createElement('td');
td_body_chaos.innerHTML = body_chaos;
td_body_chaos.setAttribute("class","body column")
insertAfter(td_body_chaos, menu.lastElementChild);

let td_body_vile = document.createElement('td');
td_body_vile.innerHTML = body_vile;
td_body_vile.setAttribute("class","body column")
insertAfter(td_body_vile, menu.lastElementChild);

let td_body_hp = document.createElement('td');
td_body_hp.innerHTML = body_hp;
td_body_hp.setAttribute("class","body column")
insertAfter(td_body_hp, menu.lastElementChild);

let td_body_resist = document.createElement('td');
td_body_resist.innerHTML = body_holyr+body_arcaner+body_shadowr+body_firer+body_kineticr;
td_body_resist.setAttribute("class","body column")
insertAfter(td_body_resist, menu.lastElementChild);

let td_body_block = document.createElement('td');
td_body_block.innerHTML = body_block;
td_body_block.setAttribute("class","body column")
insertAfter(td_body_block, menu.lastElementChild);

let td_body_eblock = document.createElement('td');
td_body_eblock.innerHTML = body_eblock;
td_body_eblock.setAttribute("class","body column")
insertAfter(td_body_eblock, menu.lastElementChild);

let td_body_rpt = document.createElement('td');
td_body_rpt.innerHTML = body_rpt;
td_body_rpt.setAttribute("class","body column")
insertAfter(td_body_rpt, menu.lastElementChild);

let td_body_ept = document.createElement('td');
td_body_ept.innerHTML = body_ept;
td_body_ept.setAttribute("class","body column")
insertAfter(td_body_ept, menu.lastElementChild);

let td_body_ramp = document.createElement('td');
td_body_ramp.innerHTML = body_ramp;
td_body_ramp.setAttribute("class","body column")
insertAfter(td_body_ramp, menu.lastElementChild);

let td_body_crit = document.createElement('td');
td_body_crit.innerHTML = body_crit;
td_body_crit.setAttribute("class","body column")
insertAfter(td_body_crit, menu.lastElementChild);

let td_body_gems = document.createElement('td');
td_body_gems.innerHTML = body_gems;
td_body_gems.setAttribute("class","body column")
insertAfter(td_body_gems, menu.lastElementChild);

let td_body_augs = document.createElement('td');
td_body_augs.innerHTML = body_openaugs;
td_body_augs.setAttribute("class","body column")
insertAfter(td_body_augs, menu.lastElementChild);

let td_body_upgrade = document.createElement('td');
td_body_upgrade.innerHTML = body_upgrade;
if (body_upgrade == 1.00) td_body_upgrade.innerHTML = '--';
td_body_upgrade.setAttribute("class","body column")
insertAfter(td_body_upgrade, menu.lastElementChild);

let td_shield = document.createElement('td');
td_shield.innerHTML = shield;
td_shield.setAttribute("class","shield column")
insertAfter(td_shield, menu.lastElementChild);

let td_shield_name = document.createElement('td');
td_shield_name.innerHTML = shield_name;
td_shield_name.setAttribute("class","shield column")
td_shield_name.setAttribute("style","color:#"+shield_rarity)
insertAfter(td_shield_name, menu.lastElementChild);

let td_shield_mr = document.createElement('td');
td_shield_mr.innerHTML = shield_mr;
td_shield_mr.setAttribute("class","shield column")
insertAfter(td_shield_mr, menu.lastElementChild);

let td_shield_atk = document.createElement('td');
td_shield_atk.innerHTML = shield_atk;
td_shield_atk.setAttribute("class","shield column")
insertAfter(td_shield_atk, menu.lastElementChild);

let td_shield_ele = document.createElement('td');
td_shield_ele.innerHTML = shield_holy+shield_arcane+shield_kinetic+shield_shadow+shield_fire;
td_shield_ele.setAttribute("class","shield column")
insertAfter(td_shield_ele, menu.lastElementChild);

let td_shield_chaos = document.createElement('td');
td_shield_chaos.innerHTML = shield_chaos;
td_shield_chaos.setAttribute("class","shield column")
insertAfter(td_shield_chaos, menu.lastElementChild);

let td_shield_vile = document.createElement('td');
td_shield_vile.innerHTML = shield_vile;
td_shield_vile.setAttribute("class","shield column")
insertAfter(td_shield_vile, menu.lastElementChild);

let td_shield_hp = document.createElement('td');
td_shield_hp.innerHTML = shield_hp;
td_shield_hp.setAttribute("class","shield column")
insertAfter(td_shield_hp, menu.lastElementChild);

let td_shield_resist = document.createElement('td');
td_shield_resist.innerHTML = shield_holyr+shield_arcaner+shield_shadowr+shield_firer+shield_kineticr;
td_shield_resist.setAttribute("class","shield column")
insertAfter(td_shield_resist, menu.lastElementChild);

let td_shield_block = document.createElement('td');
td_shield_block.innerHTML = shield_block;
td_shield_block.setAttribute("class","shield column")
insertAfter(td_shield_block, menu.lastElementChild);

let td_shield_eblock = document.createElement('td');
td_shield_eblock.innerHTML = shield_eblock;
td_shield_eblock.setAttribute("class","shield column")
insertAfter(td_shield_eblock, menu.lastElementChild);

let td_shield_rpt = document.createElement('td');
td_shield_rpt.innerHTML = shield_rpt;
td_shield_rpt.setAttribute("class","shield column")
insertAfter(td_shield_rpt, menu.lastElementChild);

let td_shield_ept = document.createElement('td');
td_shield_ept.innerHTML = shield_ept;
td_shield_ept.setAttribute("class","shield column")
insertAfter(td_shield_ept, menu.lastElementChild);

let td_shield_ramp = document.createElement('td');
td_shield_ramp.innerHTML = shield_ramp;
td_shield_ramp.setAttribute("class","shield column")
insertAfter(td_shield_ramp, menu.lastElementChild);

let td_shield_crit = document.createElement('td');
td_shield_crit.innerHTML = shield_crit;
td_shield_crit.setAttribute("class","shield column")
insertAfter(td_shield_crit, menu.lastElementChild);

let td_shield_gems = document.createElement('td');
td_shield_gems.innerHTML = shield_gems;
td_shield_gems.setAttribute("class","shield column")
insertAfter(td_shield_gems, menu.lastElementChild);

let td_shield_augs = document.createElement('td');
td_shield_augs.innerHTML = shield_openaugs;
td_shield_augs.setAttribute("class","shield column")
insertAfter(td_shield_augs, menu.lastElementChild);

let td_shield_upgrade = document.createElement('td');
td_shield_upgrade.innerHTML = shield_upgrade;
if (shield_upgrade == 1.00) td_shield_upgrade.innerHTML = '--';
td_shield_upgrade.setAttribute("class","shield column")
insertAfter(td_shield_upgrade, menu.lastElementChild);

let td_pants = document.createElement('td');
td_pants.innerHTML = pants;
td_pants.setAttribute("class","pants column")
insertAfter(td_pants, menu.lastElementChild);

let td_pants_name = document.createElement('td');
td_pants_name.innerHTML = pants_name;
td_pants_name.setAttribute("class","pants column")
td_pants_name.setAttribute("style","color:#"+pants_rarity)
insertAfter(td_pants_name, menu.lastElementChild);

let td_pants_mr = document.createElement('td');
td_pants_mr.innerHTML = pants_mr;
td_pants_mr.setAttribute("class","pants column")
insertAfter(td_pants_mr, menu.lastElementChild);

let td_pants_atk = document.createElement('td');
td_pants_atk.innerHTML = pants_atk;
td_pants_atk.setAttribute("class","pants column")
insertAfter(td_pants_atk, menu.lastElementChild);

let td_pants_ele = document.createElement('td');
td_pants_ele.innerHTML = pants_holy+pants_arcane+pants_kinetic+pants_shadow+pants_fire;
td_pants_ele.setAttribute("class","pants column")
insertAfter(td_pants_ele, menu.lastElementChild);

let td_pants_chaos = document.createElement('td');
td_pants_chaos.innerHTML = pants_chaos;
td_pants_chaos.setAttribute("class","pants column")
insertAfter(td_pants_chaos, menu.lastElementChild);

let td_pants_vile = document.createElement('td');
td_pants_vile.innerHTML = pants_vile;
td_pants_vile.setAttribute("class","pants column")
insertAfter(td_pants_vile, menu.lastElementChild);

let td_pants_hp = document.createElement('td');
td_pants_hp.innerHTML = pants_hp;
td_pants_hp.setAttribute("class","pants column")
insertAfter(td_pants_hp, menu.lastElementChild);

let td_pants_resist = document.createElement('td');
td_pants_resist.innerHTML = pants_holyr+pants_arcaner+pants_shadowr+pants_firer+pants_kineticr;
td_pants_resist.setAttribute("class","pants column")
insertAfter(td_pants_resist, menu.lastElementChild);

let td_pants_block = document.createElement('td');
td_pants_block.innerHTML = pants_block;
td_pants_block.setAttribute("class","pants column")
insertAfter(td_pants_block, menu.lastElementChild);

let td_pants_eblock = document.createElement('td');
td_pants_eblock.innerHTML = pants_eblock;
td_pants_eblock.setAttribute("class","pants column")
insertAfter(td_pants_eblock, menu.lastElementChild);

let td_pants_rpt = document.createElement('td');
td_pants_rpt.innerHTML = pants_rpt;
td_pants_rpt.setAttribute("class","pants column")
insertAfter(td_pants_rpt, menu.lastElementChild);

let td_pants_ept = document.createElement('td');
td_pants_ept.innerHTML = pants_ept;
td_pants_ept.setAttribute("class","pants column")
insertAfter(td_pants_ept, menu.lastElementChild);

let td_pants_ramp = document.createElement('td');
td_pants_ramp.innerHTML = pants_ramp;
td_pants_ramp.setAttribute("class","pants column")
insertAfter(td_pants_ramp, menu.lastElementChild);

let td_pants_crit = document.createElement('td');
td_pants_crit.innerHTML = pants_crit;
td_pants_crit.setAttribute("class","pants column")
insertAfter(td_pants_crit, menu.lastElementChild);

let td_pants_gems = document.createElement('td');
td_pants_gems.innerHTML = pants_gems;
td_pants_gems.setAttribute("class","pants column")
insertAfter(td_pants_gems, menu.lastElementChild);

let td_pants_augs = document.createElement('td');
td_pants_augs.innerHTML = pants_openaugs;
td_pants_augs.setAttribute("class","pants column")
insertAfter(td_pants_augs, menu.lastElementChild);

let td_pants_upgrade = document.createElement('td');
td_pants_upgrade.innerHTML = pants_upgrade;
if (pants_upgrade == 1.00) td_pants_upgrade.innerHTML = '--';
td_pants_upgrade.setAttribute("class","pants column")
insertAfter(td_pants_upgrade, menu.lastElementChild);

let td_belt = document.createElement('td');
td_belt.innerHTML = belt;
td_belt.setAttribute("class","belt column")
insertAfter(td_belt, menu.lastElementChild);

let td_belt_name = document.createElement('td');
td_belt_name.innerHTML = belt_name;
td_belt_name.setAttribute("class","belt column")
td_belt_name.setAttribute("style","color:#"+belt_rarity)
insertAfter(td_belt_name, menu.lastElementChild);

let td_belt_mr = document.createElement('td');
td_belt_mr.innerHTML = belt_mr;
td_belt_mr.setAttribute("class","belt column")
insertAfter(td_belt_mr, menu.lastElementChild);

let td_belt_atk = document.createElement('td');
td_belt_atk.innerHTML = belt_atk;
td_belt_atk.setAttribute("class","belt column")
insertAfter(td_belt_atk, menu.lastElementChild);

let td_belt_ele = document.createElement('td');
td_belt_ele.innerHTML = belt_holy+belt_arcane+belt_kinetic+belt_shadow+belt_fire;
td_belt_ele.setAttribute("class","belt column")
insertAfter(td_belt_ele, menu.lastElementChild);

let td_belt_chaos = document.createElement('td');
td_belt_chaos.innerHTML = belt_chaos;
td_belt_chaos.setAttribute("class","belt column")
insertAfter(td_belt_chaos, menu.lastElementChild);

let td_belt_vile = document.createElement('td');
td_belt_vile.innerHTML = belt_vile;
td_belt_vile.setAttribute("class","belt column")
insertAfter(td_belt_vile, menu.lastElementChild);

let td_belt_hp = document.createElement('td');
td_belt_hp.innerHTML = belt_hp;
td_belt_hp.setAttribute("class","belt column")
insertAfter(td_belt_hp, menu.lastElementChild);

let td_belt_resist = document.createElement('td');
td_belt_resist.innerHTML = belt_holyr+belt_arcaner+belt_shadowr+belt_firer+belt_kineticr;
td_belt_resist.setAttribute("class","belt column")
insertAfter(td_belt_resist, menu.lastElementChild);

let td_belt_block = document.createElement('td');
td_belt_block.innerHTML = belt_block;
td_belt_block.setAttribute("class","belt column")
insertAfter(td_belt_block, menu.lastElementChild);

let td_belt_eblock = document.createElement('td');
td_belt_eblock.innerHTML = belt_eblock;
td_belt_eblock.setAttribute("class","belt column")
insertAfter(td_belt_eblock, menu.lastElementChild);

let td_belt_rpt = document.createElement('td');
td_belt_rpt.innerHTML = belt_rpt;
td_belt_rpt.setAttribute("class","belt column")
insertAfter(td_belt_rpt, menu.lastElementChild);

let td_belt_ept = document.createElement('td');
td_belt_ept.innerHTML = belt_ept;
td_belt_ept.setAttribute("class","belt column")
insertAfter(td_belt_ept, menu.lastElementChild);

let td_belt_ramp = document.createElement('td');
td_belt_ramp.innerHTML = belt_ramp;
td_belt_ramp.setAttribute("class","belt column")
insertAfter(td_belt_ramp, menu.lastElementChild);

let td_belt_crit = document.createElement('td');
td_belt_crit.innerHTML = belt_crit;
td_belt_crit.setAttribute("class","belt column")
insertAfter(td_belt_crit, menu.lastElementChild);

let td_belt_gems = document.createElement('td');
td_belt_gems.innerHTML = belt_gems;
td_belt_gems.setAttribute("class","belt column")
insertAfter(td_belt_gems, menu.lastElementChild);

let td_belt_augs = document.createElement('td');
td_belt_augs.innerHTML = belt_openaugs;
td_belt_augs.setAttribute("class","belt column")
insertAfter(td_belt_augs, menu.lastElementChild);

let td_belt_upgrade = document.createElement('td');
td_belt_upgrade.innerHTML = belt_upgrade;
if (belt_upgrade == 1.00) td_belt_upgrade.innerHTML = '--';
td_belt_upgrade.setAttribute("class","belt column")
insertAfter(td_belt_upgrade, menu.lastElementChild);

let td_ring = document.createElement('td');
td_ring.innerHTML = ring;
td_ring.setAttribute("class","ring column")
insertAfter(td_ring, menu.lastElementChild);

let td_ring_name = document.createElement('td');
td_ring_name.innerHTML = ring_name;
td_ring_name.setAttribute("class","ring column")
td_ring_name.setAttribute("style","color:#"+ring_rarity)
insertAfter(td_ring_name, menu.lastElementChild);

let td_ring_mr = document.createElement('td');
td_ring_mr.innerHTML = ring_mr;
td_ring_mr.setAttribute("class","ring column")
insertAfter(td_ring_mr, menu.lastElementChild);

let td_ring_atk = document.createElement('td');
td_ring_atk.innerHTML = ring_atk;
td_ring_atk.setAttribute("class","ring column")
insertAfter(td_ring_atk, menu.lastElementChild);

let td_ring_ele = document.createElement('td');
td_ring_ele.innerHTML = ring_holy+ring_arcane+ring_kinetic+ring_shadow+ring_fire;
td_ring_ele.setAttribute("class","ring column")
insertAfter(td_ring_ele, menu.lastElementChild);

let td_ring_chaos = document.createElement('td');
td_ring_chaos.innerHTML = ring_chaos;
td_ring_chaos.setAttribute("class","ring column")
insertAfter(td_ring_chaos, menu.lastElementChild);

let td_ring_vile = document.createElement('td');
td_ring_vile.innerHTML = ring_vile;
td_ring_vile.setAttribute("class","ring column")
insertAfter(td_ring_vile, menu.lastElementChild);

let td_ring_hp = document.createElement('td');
td_ring_hp.innerHTML = ring_hp;
td_ring_hp.setAttribute("class","ring column")
insertAfter(td_ring_hp, menu.lastElementChild);

let td_ring_resist = document.createElement('td');
td_ring_resist.innerHTML = ring_holyr+ring_arcaner+ring_shadowr+ring_firer+ring_kineticr;
td_ring_resist.setAttribute("class","ring column")
insertAfter(td_ring_resist, menu.lastElementChild);

let td_ring_block = document.createElement('td');
td_ring_block.innerHTML = ring_block;
td_ring_block.setAttribute("class","ring column")
insertAfter(td_ring_block, menu.lastElementChild);

let td_ring_eblock = document.createElement('td');
td_ring_eblock.innerHTML = ring_eblock;
td_ring_eblock.setAttribute("class","ring column")
insertAfter(td_ring_eblock, menu.lastElementChild);

let td_ring_rpt = document.createElement('td');
td_ring_rpt.innerHTML = ring_rpt;
td_ring_rpt.setAttribute("class","ring column")
insertAfter(td_ring_rpt, menu.lastElementChild);

let td_ring_ept = document.createElement('td');
td_ring_ept.innerHTML = ring_ept;
td_ring_ept.setAttribute("class","ring column")
insertAfter(td_ring_ept, menu.lastElementChild);

let td_ring_ramp = document.createElement('td');
td_ring_ramp.innerHTML = ring_ramp;
td_ring_ramp.setAttribute("class","ring column")
insertAfter(td_ring_ramp, menu.lastElementChild);

let td_ring_crit = document.createElement('td');
td_ring_crit.innerHTML = ring_crit;
td_ring_crit.setAttribute("class","ring column")
insertAfter(td_ring_crit, menu.lastElementChild);

let td_ring_gems = document.createElement('td');
td_ring_gems.innerHTML = ring_gems;
td_ring_gems.setAttribute("class","ring column")
insertAfter(td_ring_gems, menu.lastElementChild);

let td_ring_augs = document.createElement('td');
td_ring_augs.innerHTML = ring_openaugs;
td_ring_augs.setAttribute("class","ring column")
insertAfter(td_ring_augs, menu.lastElementChild);

let td_ring_upgrade = document.createElement('td');
td_ring_upgrade.innerHTML = ring_upgrade;
if (ring_upgrade == 1.00) td_ring_upgrade.innerHTML = '--';
td_ring_upgrade.setAttribute("class","ring column")
insertAfter(td_ring_upgrade, menu.lastElementChild);

let td_foot = document.createElement('td');
td_foot.innerHTML = foot;
td_foot.setAttribute("class","foot column")
insertAfter(td_foot, menu.lastElementChild);

let td_foot_name = document.createElement('td');
td_foot_name.innerHTML = foot_name;
td_foot_name.setAttribute("class","foot column")
td_foot_name.setAttribute("style","color:#"+foot_rarity)
insertAfter(td_foot_name, menu.lastElementChild);

let td_foot_mr = document.createElement('td');
td_foot_mr.innerHTML = foot_mr;
td_foot_mr.setAttribute("class","foot column")
insertAfter(td_foot_mr, menu.lastElementChild);

let td_foot_atk = document.createElement('td');
td_foot_atk.innerHTML = foot_atk;
td_foot_atk.setAttribute("class","foot column")
insertAfter(td_foot_atk, menu.lastElementChild);

let td_foot_ele = document.createElement('td');
td_foot_ele.innerHTML = foot_holy+foot_arcane+foot_kinetic+foot_shadow+foot_fire;
td_foot_ele.setAttribute("class","foot column")
insertAfter(td_foot_ele, menu.lastElementChild);

let td_foot_chaos = document.createElement('td');
td_foot_chaos.innerHTML = foot_chaos;
td_foot_chaos.setAttribute("class","foot column")
insertAfter(td_foot_chaos, menu.lastElementChild);

let td_foot_vile = document.createElement('td');
td_foot_vile.innerHTML = foot_vile;
td_foot_vile.setAttribute("class","foot column")
insertAfter(td_foot_vile, menu.lastElementChild);

let td_foot_hp = document.createElement('td');
td_foot_hp.innerHTML = foot_hp;
td_foot_hp.setAttribute("class","foot column")
insertAfter(td_foot_hp, menu.lastElementChild);

let td_foot_resist = document.createElement('td');
td_foot_resist.innerHTML = foot_holyr+foot_arcaner+foot_shadowr+foot_firer+foot_kineticr;
td_foot_resist.setAttribute("class","foot column")
insertAfter(td_foot_resist, menu.lastElementChild);

let td_foot_block = document.createElement('td');
td_foot_block.innerHTML = foot_block;
td_foot_block.setAttribute("class","foot column")
insertAfter(td_foot_block, menu.lastElementChild);

let td_foot_eblock = document.createElement('td');
td_foot_eblock.innerHTML = foot_eblock;
td_foot_eblock.setAttribute("class","foot column")
insertAfter(td_foot_eblock, menu.lastElementChild);

let td_foot_rpt = document.createElement('td');
td_foot_rpt.innerHTML = foot_rpt;
td_foot_rpt.setAttribute("class","foot column")
insertAfter(td_foot_rpt, menu.lastElementChild);

let td_foot_ept = document.createElement('td');
td_foot_ept.innerHTML = foot_ept;
td_foot_ept.setAttribute("class","foot column")
insertAfter(td_foot_ept, menu.lastElementChild);

let td_foot_ramp = document.createElement('td');
td_foot_ramp.innerHTML = foot_ramp;
td_foot_ramp.setAttribute("class","foot column")
insertAfter(td_foot_ramp, menu.lastElementChild);

let td_foot_crit = document.createElement('td');
td_foot_crit.innerHTML = foot_crit;
td_foot_crit.setAttribute("class","foot column")
insertAfter(td_foot_crit, menu.lastElementChild);

let td_foot_gems = document.createElement('td');
td_foot_gems.innerHTML = foot_gems;
td_foot_gems.setAttribute("class","foot column")
insertAfter(td_foot_gems, menu.lastElementChild);

let td_foot_augs = document.createElement('td');
td_foot_augs.innerHTML = foot_openaugs;
td_foot_augs.setAttribute("class","foot column")
insertAfter(td_foot_augs, menu.lastElementChild);

let td_foot_upgrade = document.createElement('td');
td_foot_upgrade.innerHTML = foot_upgrade;
if (foot_upgrade == 1.00) td_foot_upgrade.innerHTML = '--';
td_foot_upgrade.setAttribute("class","foot column")
insertAfter(td_foot_upgrade, menu.lastElementChild);

let td90 = document.createElement('td');
td90.innerHTML = gem;
td90.setAttribute("class","gem column")
insertAfter(td90, menu.lastElementChild);

let td96 = document.createElement('td');
td96.innerHTML = gem_name;
td96.setAttribute("class","gem column")
insertAfter(td96, menu.lastElementChild);

let td91 = document.createElement('td');
td91.innerHTML = gem_lvl;
td91.setAttribute("class","gem column")
insertAfter(td91, menu.lastElementChild);

let td92 = document.createElement('td');
td92.innerHTML = gem_chaos;
td92.setAttribute("class","gem column")
insertAfter(td92, menu.lastElementChild);

let td93 = document.createElement('td');
td93.innerHTML = gem_ramp;
td93.setAttribute("class","gem column")
insertAfter(td93, menu.lastElementChild);

let td94 = document.createElement('td');
td94.innerHTML = gem_mr;
td94.setAttribute("class","gem column")
insertAfter(td94, menu.lastElementChild);

let td95 = document.createElement('td');
td95.innerHTML = gem_crit;
td95.setAttribute("class","gem column")
insertAfter(td95, menu.lastElementChild);

let td97 = document.createElement('td');
td97.innerHTML = chaosore[1];
td97.setAttribute("class","gem column")
insertAfter(td97, menu.lastElementChild);

let td98 = document.createElement('td');
td98.innerHTML = seeping;
td98.setAttribute("class","gem column")
insertAfter(td98, menu.lastElementChild);
if (seeping == "alive") {td98.style = "color:#f441be";}

let td99 = document.createElement('td');
td99.innerHTML = deluged;
td99.setAttribute("class","gem column")
insertAfter(td99, menu.lastElementChild);
if (deluged == "alive") {td99.style = "color:#f441be";}

let td100 = document.createElement('td');
td100.innerHTML = volatile;
td100.setAttribute("class","gem column")
insertAfter(td100, menu.lastElementChild);
if (volatile == "alive") {td100.style = "color:#f441be";}

if (chaosore[1] >= 1 && gem_lvl <= 32) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 2 && gem_lvl >= 33 && gem_lvl <= 40) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 3 && gem_lvl == 41) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 4 && gem_lvl == 42) {td97.setAttribute("class","gem upgrade column")}

let td101 = document.createElement('td');
td101.innerHTML = rune;
td101.setAttribute("class","rune column")
insertAfter(td101, menu.lastElementChild);

let td102 = document.createElement('td');
td102.innerHTML = rune_name;
td102.setAttribute("class","rune column")
insertAfter(td102, menu.lastElementChild);

let td103 = document.createElement('td');
td103.innerHTML = rune_lvl;
td103.setAttribute("class","rune column")
insertAfter(td103, menu.lastElementChild);

let td104 = document.createElement('td');
td104.innerHTML = rune_ele;
td104.setAttribute("class","rune column")
insertAfter(td104, menu.lastElementChild);

let td105 = document.createElement('td');
td105.innerHTML = elefuser[1]
td105.setAttribute("class","rune column")
insertAfter(td105, menu.lastElementChild);

if (elefuser[1] >= 10 && rune_lvl == 3){td105.setAttribute("class","rune upgrade column")}
if (elefuser[1] >= 20 && rune_lvl == 4){td105.setAttribute("class","rune upgrade column")}
if (elefuser[1] >= 70 && rune_lvl == 5){td105.setAttribute("class","rune upgrade column")}

let td106 = document.createElement('td');
td106.innerHTML = essence[1]
td106.setAttribute("class","rune column")
insertAfter(td106, menu.lastElementChild);

let td107 = document.createElement('td');
td107.innerHTML = orbstone[1]
td107.setAttribute("class","rune column")
insertAfter(td107, menu.lastElementChild);

let td108 = document.createElement('td');
td108.innerHTML = heart[1]
td108.setAttribute("class","rune column")
insertAfter(td108, menu.lastElementChild);

let td109 = document.createElement('td');
td109.innerHTML = orb1;
td109.setAttribute("class","orbs column")
insertAfter(td109, menu.lastElementChild);

let td110 = document.createElement('td');
td110.innerHTML = orb1name[1];
td110.setAttribute("class","orbs column")
insertAfter(td110, menu.lastElementChild);

let td111 = document.createElement('td');
td111.innerHTML = orb2;
td111.setAttribute("class","orbs column")
insertAfter(td111, menu.lastElementChild);

let td112 = document.createElement('td');
td112.innerHTML = orb2name[1];
td112.setAttribute("class","orbs column")
insertAfter(td112, menu.lastElementChild);

let td113 = document.createElement('td');
td113.innerHTML = orb3;
td113.setAttribute("class","orbs column")
insertAfter(td113, menu.lastElementChild);

let td114 = document.createElement('td');
td114.innerHTML = orb3name[1];
td114.setAttribute("class","orbs column")
insertAfter(td114, menu.lastElementChild);

let td115 = document.createElement('td');
td115.innerHTML = orb1_ele+orb2_ele+orb3_ele;
td115.setAttribute("class","orbs column")
insertAfter(td115, menu.lastElementChild);

let td116 = document.createElement('td');
td116.innerHTML = orb1_chaos+orb2_chaos+orb3_chaos;
td116.setAttribute("class","orbs column")
insertAfter(td116, menu.lastElementChild);

let td117 = document.createElement('td');
td117.innerHTML = orb1_atk+orb2_atk+orb3_atk;
td117.setAttribute("class","orbs column")
insertAfter(td117, menu.lastElementChild);

let td118 = document.createElement('td');
td118.innerHTML = orb1_hp+orb2_hp+orb3_hp;
td118.setAttribute("class","orbs column")
insertAfter(td118, menu.lastElementChild);

let td119 = document.createElement('td');
td119.innerHTML = orb1_mr+orb2_mr+orb3_mr;
td119.setAttribute("class","orbs column")
insertAfter(td119, menu.lastElementChild);

let td120 = document.createElement('td');
td120.innerHTML = orb1_rpt+orb2_rpt+orb3_rpt;
td120.setAttribute("class","orbs column")
insertAfter(td120, menu.lastElementChild);

let td121 = document.createElement('td');
td121.innerHTML = orb1_ept+orb2_ept+orb3_ept;
td121.setAttribute("class","orbs column")
insertAfter(td121, menu.lastElementChild);

let td123 = document.createElement('td');
td123.innerHTML = badge;
td123.setAttribute("class","bdge column")
insertAfter(td123, menu.lastElementChild);

let td124 = document.createElement('td');
td124.innerHTML = badge_name;
td124.setAttribute("class","bdge column")
insertAfter(td124, menu.lastElementChild);

let td125 = document.createElement('td');
td125.innerHTML = badge_level;
td125.setAttribute("class","bdge column")
insertAfter(td125, menu.lastElementChild);

let td126 = document.createElement('td');
td126.innerHTML = badge_atk;
td126.setAttribute("class","bdge column")
insertAfter(td126, menu.lastElementChild);

let td127 = document.createElement('td');
td127.innerHTML = badge_ele;
td127.setAttribute("class","bdge column")
insertAfter(td127, menu.lastElementChild);

let td128 = document.createElement('td');
td128.innerHTML = badge_hp;
td128.setAttribute("class","bdge column")
insertAfter(td128, menu.lastElementChild);

let td129 = document.createElement('td');
td129.innerHTML = badgerep[1];
td129.setAttribute("class","bdge column")
insertAfter(td129, menu.lastElementChild);
if (badgerep[1] >= 15){td129.setAttribute("class","bdge upgrade column")}

let td_corvok = document.createElement('td');
td_corvok.innerHTML = corvok;
td_corvok.setAttribute("class","bdge column")
insertAfter(td_corvok, menu.lastElementChild);
if (corvok == "alive") {td_corvok.style = "color:#4d85db";}

let td131 = document.createElement('td');
td131.innerHTML = booster;
td131.setAttribute("class","booster column")
insertAfter(td131, menu.lastElementChild);

let td132 = document.createElement('td');
td132.innerHTML = booster_name;
td132.setAttribute("class","booster column")
insertAfter(td132, menu.lastElementChild);

let td133 = document.createElement('td');
td133.innerHTML = booster_effect;
td133.setAttribute("class","booster column")
insertAfter(td133, menu.lastElementChild);

let td134 = document.createElement('td');
td134.innerHTML = booster_exp;
td134.setAttribute("class","booster column")
insertAfter(td134, menu.lastElementChild);

let td48 = document.createElement('td');
td48.innerHTML = crest1;
td48.setAttribute("class","crests column")
insertAfter(td48, menu.lastElementChild);

let td52 = document.createElement('td');
td52.innerHTML = crest1lvl;
td52.setAttribute("class","crests column")
insertAfter(td52, menu.lastElementChild);

let td49 = document.createElement('td');
td49.innerHTML = crest2;
td49.setAttribute("class","crests column")
insertAfter(td49, menu.lastElementChild);

let td53 = document.createElement('td');
td53.innerHTML = crest2lvl;
td53.setAttribute("class","crests column")
insertAfter(td53, menu.lastElementChild);

let td50 = document.createElement('td');
td50.innerHTML = crest3;
td50.setAttribute("class","crests column")
insertAfter(td50, menu.lastElementChild);

let td54 = document.createElement('td');
td54.innerHTML = crest3lvl;
td54.setAttribute("class","crests column")
insertAfter(td54, menu.lastElementChild);

let td51 = document.createElement('td');
td51.innerHTML = crest4;
td51.setAttribute("class","crests column")
insertAfter(td51, menu.lastElementChild);

let td55 = document.createElement('td');
td55.innerHTML = crest4lvl;
td55.setAttribute("class","crests column")
insertAfter(td55, menu.lastElementChild);

let td56 = document.createElement('td');
td56.innerHTML = parseInt(archfrag[1]);
td56.setAttribute("class","crests column")
insertAfter(td56, menu.lastElementChild);

let td130 = document.createElement('td');
td130.innerHTML = parseInt(demonskull[1]);
td130.setAttribute("class","crests column")
insertAfter(td130, menu.lastElementChild);

let td57 = document.createElement('td');
td57.innerHTML = hovok;
td57.setAttribute("class","crests column")
insertAfter(td57, menu.lastElementChild);
if (hovok == "alive") {td57.style = "color:#CE8C00";}

if (parseInt(archfrag[1]) >= 10){td56.setAttribute("class","crests upgrade column")}

let td58 = document.createElement('td');
td58.innerHTML = chaosore[1];
td58.setAttribute("class","bp column")
insertAfter(td58, menu.lastElementChild);

let td59 = document.createElement('td');
td59.innerHTML = archfrag[1];
td59.setAttribute("class","bp column")
insertAfter(td59, menu.lastElementChild);

let td136 = document.createElement('td');
td136.innerHTML = parseInt(demonskull[1]);
td136.setAttribute("class","bp column")
insertAfter(td136, menu.lastElementChild);

let td60 = document.createElement('td');
td60.innerHTML = elefuser[1];
td60.setAttribute("class","bp column")
insertAfter(td60, menu.lastElementChild);

let td61 = document.createElement('td');
td61.innerHTML = badgerep[1];
td61.setAttribute("class","bp column")
insertAfter(td61, menu.lastElementChild);

let td62 = document.createElement('td');
td62.innerHTML = ammy[1];
td62.setAttribute("class","bp column")
insertAfter(td62, menu.lastElementChild);

let td63 = document.createElement('td');
td63.innerHTML = totem;
td63.setAttribute("class","bp column")
insertAfter(td63, menu.lastElementChild);

let td64 = document.createElement('td');
td64.innerHTML = standard;
td64.setAttribute("class","bp column")
insertAfter(td64, menu.lastElementChild);

let td65 = document.createElement('td');
td65.innerHTML = advanced;
td65.setAttribute("class","bp column")
insertAfter(td65, menu.lastElementChild);

let td66 = document.createElement('td');
td66.innerHTML = add;
td66.setAttribute("class","bp column")
insertAfter(td66, menu.lastElementChild);

let td67 = document.createElement('td');
td67.innerHTML = remove;
td67.setAttribute("class","bp column")
insertAfter(td67, menu.lastElementChild);

let td68 = document.createElement('td');
td68.innerHTML = questshard[1];
td68.setAttribute("class","bp column")
insertAfter(td68, menu.lastElementChild);

let td_summoning = document.createElement('td');
td_summoning.innerHTML = summoning[1];
td_summoning.setAttribute("class","bp column")
insertAfter(td_summoning, menu.lastElementChild);

let td69 = document.createElement('td');
td69.innerHTML = vile1[1];
td69.setAttribute("class","pots column")
insertAfter(td69, menu.lastElementChild);

let td70 = document.createElement('td');
td70.innerHTML = vile2[1];
td70.setAttribute("class","pots column")
insertAfter(td70, menu.lastElementChild);

let td71 = document.createElement('td');
td71.innerHTML = vile3[1];
td71.setAttribute("class","pots column")
insertAfter(td71, menu.lastElementChild);

let td72 = document.createElement('td');
td72.innerHTML = vile4[1];
td72.setAttribute("class","pots column")
insertAfter(td72, menu.lastElementChild);

let td73 = document.createElement('td');
td73.innerHTML = vile5[1];
td73.setAttribute("class","pots column")
insertAfter(td73, menu.lastElementChild);

let td74 = document.createElement('td');
td74.innerHTML = vile6[1];
td74.setAttribute("class","pots column")
insertAfter(td74, menu.lastElementChild);

let td75 = document.createElement('td');
td75.innerHTML = alsayic[1];
td75.setAttribute("class","pots column")
insertAfter(td75, menu.lastElementChild);

let td76 = document.createElement('td');
td76.innerHTML = sosa[1];
td76.setAttribute("class","pots column")
insertAfter(td76, menu.lastElementChild);

let td77 = document.createElement('td');
td77.innerHTML = pumpkin[1];
td77.setAttribute("class","pots column")
insertAfter(td77, menu.lastElementChild);

let td78 = document.createElement('td');
td78.innerHTML = zombie1[1];
td78.setAttribute("class","pots column")
insertAfter(td78, menu.lastElementChild);

let td79 = document.createElement('td');
td79.innerHTML = zombie2[1];
td79.setAttribute("class","pots column")
insertAfter(td79, menu.lastElementChild);

let td80 = document.createElement('td');
td80.innerHTML = zombie3[1];
td80.setAttribute("class","pots column")
insertAfter(td80, menu.lastElementChild);

let td81 = document.createElement('td');
td81.innerHTML = zombie4[1];
td81.setAttribute("class","pots column")
insertAfter(td81, menu.lastElementChild);

let td82 = document.createElement('td');
td82.innerHTML = zombie5[1];
td82.setAttribute("class","pots column")
insertAfter(td82, menu.lastElementChild);

let td83 = document.createElement('td');
td83.innerHTML = zombie6[1];
td83.setAttribute("class","pots column")
insertAfter(td83, menu.lastElementChild);

let td84 = document.createElement('td');
td84.innerHTML = daddy[1];
td84.setAttribute("class","pots column")
insertAfter(td84, menu.lastElementChild);

let td85 = document.createElement('td');
td85.innerHTML = endurance[1];
td85.setAttribute("class","pots column")
insertAfter(td85, menu.lastElementChild);

let td86 = document.createElement('td');
td86.innerHTML = rem75[1];
td86.setAttribute("class","pots column")
insertAfter(td86, menu.lastElementChild);

let td87 = document.createElement('td');
td87.innerHTML = rem80[1];
td87.setAttribute("class","pots column")
insertAfter(td87, menu.lastElementChild);

let td88 = document.createElement('td');
td88.innerHTML = rem85[1];
td88.setAttribute("class","pots column")
insertAfter(td88, menu.lastElementChild);

let td89 = document.createElement('td');
td89.innerHTML = rem90[1];
td89.setAttribute("class","pots column");
insertAfter(td89, menu.lastElementChild);

let td_collection1 = document.createElement('td');
td_collection1.innerHTML = anjou+"%";
td_collection1.setAttribute("class","collections column");
insertAfter(td_collection1, menu.lastElementChild);

let td_collection2 = document.createElement('td');
td_collection2.innerHTML = reikar+"%";
td_collection2.setAttribute("class","collections column");
insertAfter(td_collection2, menu.lastElementChild);

let td_collection3 = document.createElement('td');
td_collection3.innerHTML = lorren+"%";
td_collection3.setAttribute("class","collections column");
insertAfter(td_collection3, menu.lastElementChild);

let td_collection4 = document.createElement('td');
td_collection4.innerHTML = lucile+"%";
td_collection4.setAttribute("class","collections column");
insertAfter(td_collection4, menu.lastElementChild);

let td_collection5 = document.createElement('td');
td_collection5.innerHTML = weima+"%";
td_collection5.setAttribute("class","collections column");
insertAfter(td_collection5, menu.lastElementChild);

let td_collection6 = document.createElement('td');
td_collection6.innerHTML = souma+"%";
td_collection6.setAttribute("class","collections column");
insertAfter(td_collection6, menu.lastElementChild);

let td_collection7 = document.createElement('td');
td_collection7.innerHTML = vanisha+"%";
td_collection7.setAttribute("class","collections column");
insertAfter(td_collection7, menu.lastElementChild);

let td_collection8 = document.createElement('td');
td_collection8.innerHTML = drolba+"%";
td_collection8.setAttribute("class","collections column");
insertAfter(td_collection8, menu.lastElementChild);

let td_collection9 = document.createElement('td');
td_collection9.innerHTML = quibel+"%";
td_collection9.setAttribute("class","collections column");
insertAfter(td_collection9, menu.lastElementChild);

let td_collection10 = document.createElement('td');
td_collection10.innerHTML = collections_total+"%";
td_collection10.setAttribute("class","collections column");
insertAfter(td_collection10, menu.lastElementChild);

fetch("profile?suid="+selectedID[1]).then(e=>e.text()).then(e=>{})

GM_addStyle ( `
#charlists{background:#0F0F0F;position:fixed !important; left: 1px !important; bottom: 100px !important;padding:10px !important; z-index:10000 !important;}
.textbox{background:#1A1C2D !important; color:#FFFFFF !important;border:0px solid !important;font-size:14px !important;resize: none;overflow:hidden;}
`);

$("body").append ( `
<div id="charlists" class="rune column lists">
<b>Easy copy/paste to OWH...</b><br>
PRIMAL READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+primalready+`</textarea><br>
RESPLENDENT READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+respready+`</textarea><br>
MYSTIC READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+mysticready+`</textarea>
</div>
` );

$("body").append ( `
<div id="charlists" class="gem column lists">
<b>Easy copy/paste to OWH...</b><br>
GEM UPGRADE READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+oreready+`</textarea><br>
DELUGED ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+delready+`</textarea><br>
SEEPING ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+seepready+`</textarea><br>
VOLATILE ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+volready+`</textarea>
</div>
` );

$("body").append ( `
<div id="charlists" class="crests column lists">
<b>Easy copy/paste to OWH...</b><br>
HOVOK ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+hovokready+`</textarea><br>
10+ FRAGMENTS<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+fragready+`</textarea><br>
</div>
` );

$("body").append ( `
<div id="charlists" class="bdge column lists">
<b>Easy copy/paste to OWH...</b><br>
CORVOK ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+corvready+`</textarea><br>
15+ BADGE REPS<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+badgeready+`</textarea><br>
</div>
` );

})})})})})})})})})})})})})})}})}

// PVP BRAWL

if (document.URL.indexOf("closedpvp") != -1 ) {

GM_addStyle ( `
#content-header-row > div:nth-child(4){display:none !important;}
.col-lg-6 {-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;}
#content-header-row > div > div > h4{margin-bottom:20px !important;}
#content-header-row > h2{display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > thead > tr{background:#020202 !important;}
#content-header-row > div > div > div > table > tbody > tr,#content-header-row > div > div > table > tbody > tr{background:#0F0F0F !important;border-bottom: #020202 solid 1px !important;}
#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > thead > tr > th:nth-child(6) > a {color: #d4d4d4 !important;}
#content-header-row > div:nth-child(2) > div:nth-child(4){display:none !important;}
`)

var brawlclosed = '';
if (document.querySelector("#content-header-row > div:nth-child(2) > div:nth-child(1) > h5") != null)
brawlclosed = document.querySelector("#content-header-row > div:nth-child(2) > div:nth-child(1) > h5").innerHTML
if (document.querySelector("#content-header-row > div:nth-child(2) > div:nth-child(1) > h5") == null)
brawlclosed = null

var brawlchars = '';
    if (brawlclosed == "Brawl starts in")
        brawlchars = document.querySelector("#content-header-row > div:nth-child(3) > div").innerHTML
    if (brawlclosed != "Brawl starts in")
        brawlchars = document.querySelector("#content-header-row > div:nth-child(4) > div").innerHTML
    if (brawlclosed == null)
        brawlchars = document.querySelector("#content-header-row > div:nth-child(4) > div").innerHTML

if (brawlclosed == "Brawl starts in"){
GM_addStyle( `
#content-header-row > div:nth-child(3) > div.widget-content.widget-content-area{display:none !important;}
`)}

var brawlcharsnew = `
<div class="widget-content widget-content-area">`+brawlchars+`
</div>
`

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

let brawltable = document.querySelector("#content-header-row > div:nth-child(3)");

let brawlsection = document.createElement('div');
brawlsection.innerHTML = brawlcharsnew;
insertAfter(brawlsection, brawltable.children[0]);

let brawlcharheader = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > thead > tr")
let headerTD1 = document.createElement('th');
headerTD1.innerHTML = `<a  onmouseover="popup(event,'<font color=#00FF00><b>Player has less power than you<br><font color=#FF0000><b>Player has more power than you');" onmouseout="kill();">POWER`;
insertAfter(headerTD1, brawlcharheader.lastElementChild);
let headerTD2 = document.createElement('th');
headerTD2.innerHTML = "STATUS";
insertAfter(headerTD2, brawlcharheader.lastElementChild);

var rank01 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(1)")
var rank02 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td:nth-child(1)")
var rank03 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(3) > td:nth-child(1)")
var rank04 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(4) > td:nth-child(1)")
var rank05 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(5) > td:nth-child(1)")
var rank06 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(6) > td:nth-child(1)")
var rank07 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(7) > td:nth-child(1)")
var rank08 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(8) > td:nth-child(1)")
var rank09 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(9) > td:nth-child(1)")
var rank10 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(10) > td:nth-child(1)")
var rank11 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(11) > td:nth-child(1)")
var rank12 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(12) > td:nth-child(1)")
var rank13 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(13) > td:nth-child(1)")
var rank14 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(14) > td:nth-child(1)")
var rank15 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(15) > td:nth-child(1)")
var rank16 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(16) > td:nth-child(1)")
var rank17 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(17) > td:nth-child(1)")
var rank18 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(18) > td:nth-child(1)")
var rank19 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(19) > td:nth-child(1)")
var rank20 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(20) > td:nth-child(1)")
var rank21 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(21) > td:nth-child(1)")
var rank22 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(22) > td:nth-child(1)")
var rank23 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(23) > td:nth-child(1)")
var rank24 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(24) > td:nth-child(1)")
var rank25 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(25) > td:nth-child(1)")
var rank26 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(26) > td:nth-child(1)")
var rank27 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(27) > td:nth-child(1)")
var rank28 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(28) > td:nth-child(1)")
var rank29 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(29) > td:nth-child(1)")
var rank30 = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(30) > td:nth-child(1)")

if (rank01 != null){rank01.innerHTML = "1 (20 coins)"}
if (rank02 != null){rank02.innerHTML = "2 (17 coins)"}
if (rank03 != null){rank03.innerHTML = "3 (15 coins)"}
if (rank04 != null){rank04.innerHTML = "4 (14 coins)"}
if (rank05 != null){rank05.innerHTML = "5 (11 coins)"}
if (rank06 != null){rank06.innerHTML = "6 (10 coins)"}
if (rank07 != null){rank07.innerHTML = "7 (10 coins)"}
if (rank08 != null){rank08.innerHTML = "8 (10 coins)"}
if (rank09 != null){rank09.innerHTML = "9 (9 coins)"}
if (rank10 != null){rank10.innerHTML = "10 (9 coins)"}
if (rank11 != null){rank11.innerHTML = "11 (9 coins)"}
if (rank12 != null){rank12.innerHTML = "12 (8 coins)"}
if (rank13 != null){rank13.innerHTML = "13 (8 coins)"}
if (rank14 != null){rank14.innerHTML = "14 (8 coins)"}
if (rank15 != null){rank15.innerHTML = "15 (7 coins)"}
if (rank16 != null){rank16.innerHTML = "16 (7 coins)"}
if (rank17 != null){rank17.innerHTML = "17 (7 coins)"}
if (rank18 != null){rank18.innerHTML = "18 (6 coins)"}
if (rank19 != null){rank19.innerHTML = "19 (6 coins)"}
if (rank20 != null){rank20.innerHTML = "20 (6 coins)"}
if (rank21 != null){rank21.innerHTML = "21 (5 coins)"}
if (rank22 != null){rank22.innerHTML = "22 (5 coins)"}
if (rank23 != null){rank23.innerHTML = "23 (5 coins)"}
if (rank24 != null){rank24.innerHTML = "24 (5 coins)"}
if (rank25 != null){rank25.innerHTML = "25 (5 coins)"}
if (rank26 != null){rank26.innerHTML = "26 (4 coins)"}
if (rank27 != null){rank27.innerHTML = "27 (4 coins)"}
if (rank28 != null){rank28.innerHTML = "28 (4 coins)"}
if (rank29 != null){rank29.innerHTML = "29 (4 coins)"}
if (rank30 != null){rank30.innerHTML = "30 (4 coins)"}

var totalMembers = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table").rows.length;

fetch("profile")
   .then (response => response.text())
   .then((response) => {

var mypower = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)
var mytotalpower = parseInt(mypower[1].replace(",",""))

for (let rownum = 1; rownum < parseInt(totalMembers); rownum++) {

var charList = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replace(/<a href="/i,"").replace(/">.*<\/a>/,"")

fetch(charList)
   .then (response => response.text())
   .then((response) => {

var circleofprotection = '';
    if (response.match(/circleofprotection/i) != null)
        circleofprotection = `<img src="images/skills/circleofprotection.png" onmouseover="popup(event,'Circle of Protection is Active');" onmouseout="kill();" width=35px height=35px>`

var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im)
var itemsX = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im)
var items2 = (items.toString().match(/img/g) || []).length
var items3 = '';
if (items2 < 10)
items3 = `<img src=https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/atk.png onmouseover="popup(event,'Player has items unequipped');" onmouseout="kill();" width=35 height=35 style='filter: grayscale(0)'>`
if (items2 == 10)
items3 = `<img src=https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/atk.png onmouseover="popup(event,'Player doesnt have items unequipped');" onmouseout="kill();" width=35 height=35 style='filter: grayscale(1)'>`

var power = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)
var totalpower = parseInt(power[1].replace(",",""))
var powercheck = '';
    if (totalpower > mytotalpower)
        powercheck = "<font color=#FF0000>"+totalpower.toLocaleString("en-US")+"</font>"
    if (totalpower < mytotalpower)
        powercheck = "<font color=#00FF00>"+totalpower.toLocaleString("en-US")+"</font>"
    if (totalpower == mytotalpower)
        powercheck = "-"

let menu = document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child("+rownum+")")

let powerTD = document.createElement('td');
powerTD.innerHTML = powercheck;
insertAfter(powerTD, menu.lastElementChild);

let brawlTD = document.createElement('td');
brawlTD.innerHTML = items3+" "+circleofprotection;
insertAfter(brawlTD, menu.lastElementChild);

})}})}


// MOXXIVISION

if (document.URL.indexOf("earnfreepoints") != -1 ) {
if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

GM_addStyle ( `
#content-header-row > div.outer{display:none !important;}
#content-header-row > div.outer2{display:none !important;}
`)};

if (document.URL.indexOf("earnfreepoints") != -1 ) {

if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);}

var selectedID = document.querySelector("body").outerHTML.match(/value="(.*)" selected/)

fetch("/myaccount")
.then(res => res.text())
.then((responseText) => {
const doc = new DOMParser().parseFromString(responseText, 'text/html');
const chars = doc.querySelector("#cal");
var content = chars.innerHTML
var content2 = chars.innerHTML.replace(`<table id="zero-config"`,`<table id="content2"`)

GM_addStyle ( `
#zero-config > tbody > tr > td:nth-child(1){display: none !important;}
#zero-config > tbody > tr > td:nth-child(3){display: none !important;}
#zero-config > tbody > tr > td:nth-child(4){display: none !important;}
#zero-config > tbody > tr > td:nth-child(5){display: none !important;}
#zero-config > tbody > tr > td:nth-child(6){display: none !important;}
#zero-config > tbody > tr > td:nth-child(7){display: none !important;}
#zero-config > tbody > tr > td:nth-child(8){display: none !important;}
#zero-config > tbody > tr > td:nth-child(9){display: none !important;}
#zero-config > tbody > tr > td:nth-child(10){display: none !important;}
#zero-config > tbody > tr > td:nth-child(11){display: none !important;}
#zero-config > thead > tr > th:nth-child(11){display: none !important;}
#zero-config > thead{background: #0F0F0F}
#zero-config > tbody > tr{border-bottom:1px SOLID !important;}
#zero-config img[src*="Message.png"] {display: none !important;}
#zero-config img[src*="Attacked.png"] {display: none !important;}
#zero-config img[src*="Trade.png"] {display: none !important;}
#zero-config > tbody{width:100% !important;}
#zero-config > thead{width:100% !important;}
.outer {width:60%;height:700px;overflow-x:scroll;overflow-y:scroll;background:#0F0F0F;margin-right:5px !important;border:1px #454545 SOLID !important;}
.outer2 {width:35%;height:700px;overflow-x:none;overflow-y:scroll;background:#0F0F0F;border:1px #454545 SOLID !important;}
.rgahealth > tbody > tr > td {padding-top: 2px !important;padding-bottom: 1px !important;padding-right: 15px !important;padding-left: 5px !important;white-space: pre !important;}
#zero-config > tbody > tr {border: 1px SOLID #202020 !important;}
#zero-config > thead > tr > td > a > font,#zero-config > thead > tr > td > font{font-weight: bold;font-size:13px}
#zero-config > thead > tr > td{font-weight: bold;font-size:13px}
#zero-config > thead > tr > th,#zero-config > thead > tr > td{padding-right:15px !important; white-space: pre !important;}
#content2 > thead{display:none !important;}
#content2 > tbody > tr > td:nth-child(1){display: none !important;}
#content2 > tbody > tr > td:nth-child(2){display: none !important;}
#content2 > tbody > tr > td:nth-child(3){display: none !important;}
#content2 > tbody > tr > td:nth-child(4){display: none !important;}
#content2 > tbody > tr > td:nth-child(5){display: none !important;}
#content2 > tbody > tr > td:nth-child(6){display: none !important;}
#content2 > tbody > tr > td:nth-child(7){display: none !important;}
#content2 > tbody > tr > td:nth-child(8){display: none !important;}
#content2 > tbody > tr > td:nth-child(9){display: none !important;}
#content2 > tbody > tr > td:nth-child(10){display: none !important;}
#content2 > tbody > tr > td:nth-child(11){display: none !important;}
#content2 > thead > tr > th:nth-child(11){display: none !important;}
#content2 img[src*="Message.png"] {display: none !important;}
#content2 img[src*="Attacked.png"] {display: none !important;}
#content2 img[src*="Trade.png"] {display: none !important;}
#content2 > tbody > tr > td {text-align: center;}
#content2 > tbody > tr > td{background:#060707 !important;}
body > center > div.sub-header-container{display:none !important;}
#rightbar{display:none !important;}
#recentraid{display:none !important;}
#content-header-row{margin-top:-40px !important;}
body > center {background-image: url('https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/mm_patern.png') !important;}
#zero-config > tbody > tr > td:nth-child(2){position: sticky;left: 0;background: #0F0F0F;z-index: 2000;border: 3px #0F0F0F SOLID !important;}
`);

setTimeout(function() {
$('#zero-config > thead > tr > th:nth-child(1)').html('CHARACTER');
$('#zero-config > thead > tr > th:nth-child(2)').html(`<a onmouseover="statspopup(event,'char level')" onmouseout="kill\(\)"><font color=#D4D4D4>LVL</a>`);
$('#zero-config > thead > tr > th:nth-child(3)').html(`<a onmouseover="statspopup(event,'number of turns until rage caps<br>mouseover to see circ status')" onmouseout="kill\(\)"><font color=#D4D4D4>RAGE FILLED</a>`);
$('#zero-config > thead > tr > th:nth-child(4)').html(`<a onmouseover="statspopup(event,'maximum rage')" onmouseout="kill\(\)"><font color=#D4D4D4>MAX RAGE</a>`);
$('#zero-config > thead > tr > th:nth-child(5)').html(`<a onmouseover="statspopup(event,'growth today')" onmouseout="kill\(\)"><font color=#D4D4D4>TODAY</a>`);
$('#zero-config > thead > tr > th:nth-child(6)').html(`<a onmouseover="statspopup(event,'growth yesterday')" onmouseout="kill\(\)"><font color=#D4D4D4>YESTERDAY</a>`);
$('#zero-config > thead > tr > th:nth-child(7)').html(`<a onmouseover="statspopup(event,'experience to level')" onmouseout="kill\(\)"><font color=#D4D4D4>EXP TO LEVEL</a>`);
$('#zero-config > thead > tr > th:nth-child(8)').html(`<a onmouseover="statspopup(event,'strength')" onmouseout="kill\(\)"><font color=#D4D4D4>STR</a>`);
$('#zero-config > thead > tr > th:nth-child(9)').html(`<a onmouseover="statspopup(event,'number of items equipped<br>will turn red if fewer than 10')" onmouseout="kill\(\)"><font color=#D4D4D4>ITEMS</a>`);
$('#zero-config > thead > tr > th:nth-child(10)').html(`<a onmouseover="statspopup(event,'equipped class crest')" onmouseout="kill\(\)"><font color=#604999>CREST</a>`);

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

let header = document.querySelector("#zero-config > thead > tr");

let hdTD21 = document.createElement('td');
hdTD21.innerHTML = `<a onmouseover="statspopup(event,'equipped ferocity crest')" onmouseout="kill\(\)"><font color=#B44313>CREST</a>`;
insertAfter(hdTD21, header.lastElementChild);
let hdTD22 = document.createElement('td');
hdTD22.innerHTML = `<a onmouseover="statspopup(event,'equipped preservation crest')" onmouseout="kill\(\)"><font color=#537BB9>CREST</a>`;
insertAfter(hdTD22, header.lastElementChild);
let hdTD23 = document.createElement('td');
hdTD23.innerHTML = `<a onmouseover="statspopup(event,'equipped affliction crest')" onmouseout="kill\(\)"><font color=#EAD500>CREST</a>`;
insertAfter(hdTD23, header.lastElementChild);
let hdTD24 = document.createElement('td');
hdTD24.innerHTML = `<a onmouseover="statspopup(event,'archfiend soul fragments')" onmouseout="kill\(\)"><font color=#D4D4D4>ARCH</a>`;
insertAfter(hdTD24, header.lastElementChild);
let hdTD20 = document.createElement('td');
hdTD20.innerHTML = `<a onmouseover="statspopup(event,'equipped chaos gem')" onmouseout="kill\(\)"><font color=#D4D4D4>GEM</a>`;
insertAfter(hdTD20, header.lastElementChild);
let hdTD16 = document.createElement('td');
hdTD16.innerHTML = `<a onmouseover="statspopup(event,'chaos ore')" onmouseout="kill\(\)"><font color=#D4D4D4>ORE</a>`;
insertAfter(hdTD16, header.lastElementChild);
let hdTD12 = document.createElement('td');
hdTD12.innerHTML = `<a onmouseover="statspopup(event,'equipped rune')" onmouseout="kill\(\)"><font color=#D4D4D4>RUNE</a>`;
insertAfter(hdTD12, header.lastElementChild);
let hdTD14 = document.createElement('td');
hdTD14.innerHTML = `<a onmouseover="statspopup(event,'elemental fuser')" onmouseout="kill\(\)"><font color=#D4D4D4>FUSR</a>`;
insertAfter(hdTD14, header.lastElementChild);
let hdTD4 = document.createElement('td');
hdTD4.innerHTML = `<a onmouseover="statspopup(event,'equipped badge')" onmouseout="kill\(\)"><font color=#D4D4D4>BADGE</a>`;
insertAfter(hdTD4, header.lastElementChild);
let hdTD15 = document.createElement('td');
hdTD15.innerHTML = `<a onmouseover="statspopup(event,'badge reputation')" onmouseout="kill\(\)"><font color=#D4D4D4>REPS</a>`;
insertAfter(hdTD15, header.lastElementChild);
let hdTD1 = document.createElement('td');
hdTD1.innerHTML = `<a onmouseover="statspopup(event,'hover booster to see time remaining')" onmouseout="kill\(\)"><font color=#D4D4D4>BOOSTER</a>`;
insertAfter(hdTD1, header.lastElementChild);
let hdTD3 = document.createElement('td');
hdTD3.innerHTML = `<a onmouseover="statspopup(event,'char power')" onmouseout="kill\(\)"><font color=#D4D4D4>POWER</a>`;
insertAfter(hdTD3, header.lastElementChild);
let hdTD2 = document.createElement('td');
hdTD2.innerHTML = `<a onmouseover="statspopup(event,'elemental damage')" onmouseout="kill\(\)"><font color=#D4D4D4>ELE</a>`;
insertAfter(hdTD2, header.lastElementChild);
let hdTD6 = document.createElement('td');
hdTD6.innerHTML = `<a onmouseover="statspopup(event,'chaos damage')" onmouseout="kill\(\)"><font color=#D4D4D4>CHAOS</a>`;
insertAfter(hdTD6, header.lastElementChild);
let hdTD7 = document.createElement('td');
hdTD7.innerHTML = `<a onmouseover="statspopup(event,'fire resist')" onmouseout="kill\(\)"><font color=#FF0000>RESIST</font>`;
insertAfter(hdTD7, header.lastElementChild);
let hdTD8 = document.createElement('td');
hdTD8.innerHTML = `<a onmouseover="statspopup(event,'arcane resist')" onmouseout="kill\(\)"><font color=FFFF00>RESIST</font>`;
insertAfter(hdTD8, header.lastElementChild);
let hdTD9 = document.createElement('td');
hdTD9.innerHTML = `<a onmouseover="statspopup(event,'shadow resist')" onmouseout="kill\(\)"><font color=7e01bc>RESIST</font>`;
insertAfter(hdTD9, header.lastElementChild);
let hdTD10 = document.createElement('td');
hdTD10.innerHTML = `<a onmouseover="statspopup(event,'holy resist')" onmouseout="kill\(\)"><font color=00FFFF>RESIST</font>`;
insertAfter(hdTD10, header.lastElementChild);
let hdTD11 = document.createElement('td');
hdTD11.innerHTML = `<a onmouseover="statspopup(event,'kinetic resist')" onmouseout="kill\(\)"><font color=00FF00>RESIST</font>`;
insertAfter(hdTD11, header.lastElementChild);
let hdTD5 = document.createElement('td');
hdTD5.innerHTML = `<a onmouseover="statspopup(event,'wilderness level')" onmouseout="kill\(\)"><font color=#D4D4D4>WLDR</a>`;
insertAfter(hdTD5, header.lastElementChild);
let hdTD13 = document.createElement('td');
hdTD13.innerHTML = `<a onmouseover="statspopup(event,'amulet of achievement')" onmouseout="kill\(\)"><font color=#D4D4D4>AMLT</a>`;
insertAfter(hdTD13, header.lastElementChild);
let hdTD17 = document.createElement('td');
hdTD17.innerHTML = `<a onmouseover="statspopup(event,'quest shard')" onmouseout="kill\(\)"><font color=#D4D4D4>SHRD</a>`;
insertAfter(hdTD17, header.lastElementChild);
let hdTD0 = document.createElement('td');
hdTD0.innerHTML = `<a onmouseover="statspopup(event,'active skills')" onmouseout="kill\(\)"><font color=#D4D4D4>SKILLS</a>`;
insertAfter(hdTD0, header.lastElementChild);
let hdTD18 = document.createElement('td');
hdTD18.innerHTML = `BACKPACK`;
insertAfter(hdTD18, header.lastElementChild);
let hdTD19 = document.createElement('td');
hdTD19.innerHTML = `<a onmouseover="statspopup(event,'will display skill resets, totems, add aug and remove aug if in backpack')" onmouseout="kill\(\)"><font color=#D4D4D4>UTILITY</a>`;
insertAfter(hdTD19, header.lastElementChild);

var charsTable = document.querySelector("#zero-config");
var charsTableRows = charsTable.rows.length;

for (let rownum = 1; rownum < charsTableRows; rownum++) {

var charid = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replaceAll(/<a target="_top" href="https:\/\/.*\.outwar\.com\/world\?suid=/g,"").replace(/&amp;serverid=.*<\/a>/g,"")

fetch("skills_info.php?suid="+charid+"&id=3008")
   .then(response => response.text())
   .then((response) => {

var circReady = response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i)
var circCharging = response.match(/<b>This skill is recharging\. (.*) minutes remaining\.<\/b>/i)
var circUntrained = response.match(/<b>You have not learned this skill yet<\/b>/i)

var charid = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replaceAll(/<a target="_top" href="https:\/\/.*\.outwar\.com\/world\?suid=/g,"").replace(/&amp;serverid=.*<\/a>/g,"")

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=regular")
   .then(response => response.text())
   .then((response) => {

var backpack = response.match(/<span id="backpackmaxval" data-maxval="(.*)" data-isover=".*" data-curitemct="(.*)"><\/span>/i)
var bpItems = parseInt(backpack[2])
var bpCap = parseInt(backpack[1])

var bpMax = '';
if (bpItems > bpCap)
bpMax = "<font color=#FF0000>"
if (bpCap > bpItems)
bpMax = "<font color=#FFFFFF>"
if (bpCap == bpItems)
bpMax = "<font color=#FF0000>"

var addaug = response.match(/addaugs\.jpg/i)
var totem = response.match(/rechargetotem\.jpg/i)
var skillitem = response.match(/skillitem\.jpg/i)
var removeaug = response.match(/AugmentRemover\.gif/i)

var utility = '';
if (addaug != null)
utility += "<img src=images/addaugs.jpg height=25px width=25px> ";
if (totem != null)
utility += "<img src=images/rechargetotem.jpg height=25px width=25px> ";
if (skillitem != null)
utility += "<img src=images/skillitem.jpg height=25px width=25px> ";
if (removeaug != null)
utility += "<img src=images/items/AugmentRemover.gif height=25px width=25px> ";
if (utility == "")
utility = "none"

var charid = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replaceAll(/<a target="_top" href="https:\/\/.*\.outwar\.com\/world\?suid=/g,"").replace(/&amp;serverid=.*<\/a>/g,"")

fetch("ajax/backpackcontents.php?suid="+charid+"&tab=quest")
   .then(response => response.text())
   .then((response) => {

var amuletCnt = response.match(/data-name="Amulet of Achievement" data-itemqty="(.*)" data-itemid/i) || 0
var repCnt = response.match(/data-name="Badge Reputation" data-itemqty="(.*)" data-itemid/i) || 0
var oreCnt = response.match(/data-name="Chaos Ore" data-itemqty="(.*)" data-itemid/i) || 0
var shardCnt = response.match(/data-name="Quest Shard" data-itemqty="(.*)" data-itemid/i) || 0
var fuserCnt = response.match(/data-name="Elemental Fuser" data-itemqty="(.*)" data-itemid/i) || 0
var archCnt = response.match(/data-name="Archfiend Soul Fragment" data-itemqty="(.*)" data-itemid/i) || 0

var archCnt2 = '';
if (archCnt[1] >= 10)
archCnt2 = "<font color=00CC00>"+parseInt(archCnt[1])+"</font>"
if (archCnt[1] <= 9)
archCnt2 = parseInt(archCnt[1])
if (archCnt[1] == undefined)
archCnt2 = 0

var repCnt2 = '';
if (repCnt[1] >= 15)
repCnt2 = "<font color=00CC00>"+parseInt(repCnt[1])+"</font>"
if (repCnt[1] <= 14)
repCnt2 = parseInt(repCnt[1])
if (repCnt[1] == undefined)
repCnt2 = 0

var oreCnt2 = '';
if (oreCnt[1] >= 0)
oreCnt2 = "<font color=f441be>"+parseInt(oreCnt[1])+"</font>"
if (oreCnt[1] == 0)
oreCnt2 = parseInt(oreCnt[1])
if (oreCnt[1] == undefined)
oreCnt2 = 0

var charid = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replaceAll(/<a target="_top" href="https:\/\/.*\.outwar\.com\/world\?suid=/g,"").replace(/&amp;serverid=.*<\/a>/g,"")

fetch("home?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var fireRes = response.match(/onmouseout="kill\(\)">Fire Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
var arcaneRes = response.match(/onmouseout="kill\(\)">Arcane Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
var shadowRes = response.match(/onmouseout="kill\(\)">Shadow Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
var holyRes = response.match(/onmouseout="kill\(\)">Holy Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
var kineticRes = response.match(/onmouseout="kill\(\)">Kinetic Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);

var charid = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replaceAll(/<a target="_top" href="https:\/\/.*\.outwar\.com\/world\?suid=/g,"").replace(/&amp;serverid=.*<\/a>/g,"")

fetch("profile?suid="+charid)
   .then(response => response.text())
   .then((response) => {

var charlvl = response.match(/<font size="2">Level ([0-9]+) (.*)<\/font>/i)

var charpower = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font>/i)
var charpower2 = parseInt(charpower[1].replaceAll(",",""))

var charele = response.match(/ELEMENTAL ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
var charchaos = response.match(/CHAOS DAMAGE.*[\n\r].*<font size="2">(.*)<\/font>/i)
var wilderness = response.match(/WILDERNESS LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)

var growthyesterday = response.match(/GROWTH YESTERDAY.*[\n\r].*<font size="2">(.*)<\/font>/i)
var growthyesterday2 = parseInt(growthyesterday[1].replaceAll(",",""))
var growthyesterday3 = '';
if (growthyesterday2 < 0)
growthyesterday3 = "<font color=#FF0000>"+growthyesterday2.toLocaleString("en-US")+"</font>"
if (growthyesterday2 > -1)
growthyesterday3 = growthyesterday2.toLocaleString("en-US")

var growthtoday = response.match(/<tr><td><b>Growth Today:<\/b><\/td><td>(.*)<\/td><\/tr>/i)
var growthtoday2 = parseInt(growthtoday[1].replaceAll(",",""))
var growthtoday3 = '';
if (growthtoday2 < 0)
growthtoday3 = "<font color=#FF0000>"+growthtoday2.toLocaleString("en-US")+"</font>"
if (growthtoday2 > -1)
growthtoday3 = growthtoday2.toLocaleString("en-US")

var tolevel = response.match(/to Level:<\/b><\/td><td>(.*)<\/td>/i)
var tolevel2 = parseInt(tolevel[1].replaceAll(",",""))

var strength = response.match(/statspopup\(event,'Strength: (.*)'\)" onmouseout/i)
var strength2 = parseInt(strength[1])

var strength3 = '';
if (strength2 <= 100)
strength3 = "<font color=#FF0000>"+strength2+"</font>"
if (strength2 == 100)
strength3 = strength2

var gem = response.match(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r].*<img style="border:0px;" src="(.*)" onclick.* Chaos.*"/i)
var gem2 = '';
if (gem == null)
gem2 = "none"
if (gem != null)
gem2 = "<img src="+gem[1]+" height=25px width=25px>"
var gem3 = response.match(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r].*(onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Chaos.*">)/i)
var gem4 = '';
if (gem3 == null)
gem4 = "><font color=#D4D4D4>"
if (gem3 != null)
gem4 = gem3[1]

var rune = response.match(/<img style="border:0px;" src="(.*)" onclick.*Rune.*"/i)
var rune2 = '';
if (rune == null)
rune2 = "none"
if (rune != null)
rune2 = "<img src="+rune[1]+" height=25px width=25px>"
var rune3 = response.match(/onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Rune.*">/i)
var rune4 = '';
if (rune3 == null)
rune4 = "><font color=#D4D4D4>"
if (rune3 != null)
rune4 = rune3

var booster = response.match(/<img style="border:0px;" src="(.*)" onclick.* Booster.*"/i)
var booster2 = '';
if (booster == null)
booster2 = "none"
if (booster != null)
booster2 = "<img src="+booster[1]+" height=25px width=25px>"
var booster3 = response.match(/onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Booster.*">/i)
var booster4 = '';
if (booster3 == null)
booster4 = "><font color=#D4D4D4>"
if (booster3 != null)
booster4 = booster3

var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im)
var itemsX = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im)
var items2 = (items.toString().match(/img/g) || []).length
var items3 = '';
if (items2 < 10)
items3 = "<font color=#FF0000>"+items2
if (items2 == 10)
items3 = "<font color=#D4D4D4>"+items2

var crest1 = response.match(/alt="(.*Class.*)"/i)
var crest1lvl = '';
if (crest1 == null)
crest1lvl = "<font color=#FF0000>none"
if (crest1 != null){
if (crest1[1] == "Crest of Class")
crest1lvl = "Base"
if (crest1[1] == "Excelled Crest of Class")
crest1lvl = "Excelled"
if (crest1[1] == "Quantum Crest of Class")
crest1lvl = "Quantum"
}

var crest2 = response.match(/alt="(.*Ferocity.*)"/i)
var crest2lvl = '';
if (crest2 == null)
crest2lvl = "<font color=#FF0000>none"
if (crest2 != null){
if (crest2[1] == "Crest of Ferocity")
crest2lvl = "Base"
if (crest2[1] == "Excelled Crest of Ferocity")
crest2lvl = "Excelled"
if (crest2[1] == "Explosive Crest of Ferocity")
crest2lvl = "Explosive"
}

var crest3 = response.match(/alt="(.*Preservation.*)"/i)
var crest3lvl = '';
if (crest3 == null)
crest3lvl = "<font color=#FF0000>none"
if (crest3 != null){
if (crest3[1] == "Crest of Preservation")
crest3lvl = "Base"
if (crest3[1] == "Excelled Crest of Preservation")
crest3lvl = "Excelled"
if (crest3[1] == "Violent Crest of Preservation")
crest3lvl = "Violent"
}

var crest4 = response.match(/alt="(.*Affliction.*)"/i)
var crest4lvl = '';
if (crest4 == null)
crest4lvl = "<font color=#FF0000>none"
if (crest4 != null){
if (crest4[1] == "Crest of Affliction")
crest4lvl = "Base"
if (crest4[1] == "Excelled Crest of Affliction")
crest4lvl = "Excelled"
if (crest4[1] == "Onslaught Crest of Affliction")
crest4lvl = "Onslaught"
}

var badge = response.match(/src="(.*)" onclick="window\.location='.*'\)" onmouseout="kill\(\)" alt=".*Badge.*">/i)
var badge2 = '';
if (badge == null)
badge2 = "none"
if (badge != null)
badge2 = "<img src="+badge[1]+" height=25px width=25px>"
var badge3 = response.match(/onmouseover="itempopup\(event,'.*'\)" onmouseout="kill\(\)" alt=".*Badge.*">/i)
var badge4 = '';
if (badge3 == null)
badge4 = "><font color=#D4D4D4>"
if (badge3 != null)
badge4 = badge3

var circCast = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/circumspect\.png".*/i);

        const skill0 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/skill_2952\.gif".*/i);
        const skill1 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/circumspect\.png".*/i);
        const skill2 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/markdown\.png".*/i);
        const skill3 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/hitman\.png".*/i);
        const skill4 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/haste\.png".*/i);
        const skill5 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/streetsmarts\.png".*/i);
        const skill6 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/onguard\.png".*/i);
        const skill7 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/\.\.\/items\/itemz80\.gif".*/i);
        const skill8 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/killingspree\.png".*/i);
        const skill9 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/masterferoskill\.png".*/i);
        const skill10 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/masterpresskill\.png".*/i);
        const skill11 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/masteraffskill\.png".*/i);
        const skill12 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/\.\.\/items\/itemz82\.jpg".*/i);
        const skill13 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/\.\.\/items\/itemz91\.jpg".*/i);
        const skill14 = response.match(/<img align="absmiddle" border="0" src="\/images\/items\/itemz28\.jpg".*/i);
        const skill15 = response.match(/<img align="absmiddle" border="0" src="\/images\/skills\/blessingfromabove\.png".*/i);

var circ = '';
if (circCast != null)
circ += "circumspect is cast";
if (circReady != null)
circ += "circumspect is ready!";
if (circCharging != null && circCast == null)
circ += "circumspect is charged in <font color=F8DA00><b>"+(parseInt(circCharging[1])/60).toFixed(2)+"</font></b> hours";
if (circUntrained != null)
circ += "circumspect is not trained";

var rage = response.match(/<span class="toolbar_rage">(.*)<\/span>/i)
var rage2 = parseInt(rage[1].replaceAll(",",""))
var mrage = response.match(/<b>Maximum:<\/b><\/td><td>(.*)<\/td>/i)
var mrage2 = parseInt(mrage[1].replaceAll(",",""))
var rpt = response.match(/<p class="top-rage" onmouseover="statspopup\(event,'<tr><td><b>Per Turn:<\/b><\/td><td>(.*)<\/td>/i)
var rpt2 = parseInt(rpt[1].replaceAll(",",""))
var tomax = Math.ceil((mrage2-rage2)/rpt2)

var tomax2 = '';
if (tomax > 0)
tomax2 = "in "+tomax+" turns"
if (tomax == 0 && circReady != null)
tomax2 = "<font color=F8DA00>in "+tomax+" turns</font>"
if (tomax == 0 && circReady == null)
tomax2 = "<font color=00CC00>in "+tomax+" turns</font>"

        var skills = '';
        if (skill0 != null)
        skills += skill0+' ';
        if (skill1 != null)
        skills += skill1+' ';
        if (skill2 != null)
        skills += skill2+' ';
        if (skill3 != null)
        skills += skill3+' ';
        if (skill4 != null)
        skills += skill4+' ';
        if (skill5 != null)
        skills += skill5+' ';
        if (skill6 != null)
        skills += skill6+' ';
        if (skill7 != null)
        skills += skill7+' ';
        if (skill8 != null)
        skills += skill8+' ';
        if (skill9 != null)
        skills += skill9+' ';
        if (skill10 != null)
        skills += skill10+' ';
        if (skill11 != null)
        skills += skill11+' ';
        if (skill12 != null)
        skills += skill12+' ';
        if (skill13 != null)
        skills += skill13+' ';
        if (skill14 != null)
        skills += skill14+' ';
        if (skill15 != null)
        skills += skill15+' ';
        if (skills == "")
        skills += "none"

let charnamesformenu2 = document.querySelector("#content2 > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a:nth-child(1)").innerHTML;
let menu2 = document.querySelector("#content2 > tbody > tr:nth-child("+rownum+")");

let mv2 = document.createElement('td');
mv2.innerHTML = charnamesformenu2+`<p><div ID=EQhome style="position:relative; width:300px; height:385px; background-image:url(https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/thedude_dark.png)">`+itemsX.toString()+`</div>`;
insertAfter(mv2, menu2.lastElementChild);

let menu = document.querySelector("#zero-config > tbody > tr:nth-child("+rownum+")");

let lvlTD = document.createElement('td');
lvlTD.innerHTML = charlvl[1];
insertAfter(lvlTD, menu.lastElementChild);

let rageTD = document.createElement('td');
rageTD.innerHTML = `<a onmouseover="statspopup(event,'`+circ+`')" onmouseout="kill\(\)"><font color=#D4D4D4>`+tomax2
insertAfter(rageTD, menu.lastElementChild);

let mrTD = document.createElement('td');
mrTD.innerHTML = `<a onmouseover="statspopup(event,'max rage')" onmouseout="kill\(\)"><font color=#D4D4D4>`+mrage2.toLocaleString("en-US")
insertAfter(mrTD, menu.lastElementChild);

let todayTD = document.createElement('td');
todayTD.innerHTML = `<a onmouseover="statspopup(event,'growth today')" onmouseout="kill\(\)"><font color=#D4D4D4>`+growthtoday3;
insertAfter(todayTD, menu.lastElementChild);

let yesterdayTD = document.createElement('td');
yesterdayTD.innerHTML = `<a onmouseover="statspopup(event,'growth yesterday')" onmouseout="kill\(\)"><font color=#D4D4D4>`+growthyesterday3;
insertAfter(yesterdayTD, menu.lastElementChild);

let tolvlTD = document.createElement('td');
tolvlTD.innerHTML = `<a onmouseover="statspopup(event,'exp needed to level')" onmouseout="kill\(\)"><font color=#D4D4D4>`+tolevel2.toLocaleString("en-US")
insertAfter(tolvlTD, menu.lastElementChild);

let strengthTD = document.createElement('td');
strengthTD.innerHTML = `<a onmouseover="statspopup(event,'strength')" onmouseout="kill\(\)"><font color=#D4D4D4>`+strength3;
insertAfter(strengthTD, menu.lastElementChild);

let boosterTD = document.createElement('td');
boosterTD.innerHTML = items3+"/10</font>";
insertAfter(boosterTD, menu.lastElementChild);

let crest1TD = document.createElement('td');
crest1TD.innerHTML = crest1lvl;
insertAfter(crest1TD, menu.lastElementChild);

let crest2TD = document.createElement('td');
crest2TD.innerHTML = crest2lvl;
insertAfter(crest2TD, menu.lastElementChild);

let crest3TD = document.createElement('td');
crest3TD.innerHTML = crest3lvl;
insertAfter(crest3TD, menu.lastElementChild);

let crest4TD = document.createElement('td');
crest4TD.innerHTML = crest4lvl;
insertAfter(crest4TD, menu.lastElementChild);

let archTD = document.createElement('td');
archTD.innerHTML = `<a onmouseover="statspopup(event,'archfiend soul fragments')" onmouseout="kill\(\)"><font color=#D4D4D4>`+archCnt2
insertAfter(archTD, menu.lastElementChild);

let suppliesTD = document.createElement('td');
suppliesTD.innerHTML = "<a "+gem4+gem2+"</a>";
insertAfter(suppliesTD, menu.lastElementChild);

let oreCnt = document.createElement('td');
oreCnt.innerHTML = `<a onmouseover="statspopup(event,'chaos ore')" onmouseout="kill\(\)"><font color=#D4D4D4>`+oreCnt2
insertAfter(oreCnt, menu.lastElementChild);

let runeTD = document.createElement('td');
runeTD.innerHTML = "<a "+rune4+rune2+"</a>";
insertAfter(runeTD, menu.lastElementChild);

let fuserTD = document.createElement('td');
fuserTD.innerHTML = fuserCnt[1] ?? "0"
insertAfter(fuserTD, menu.lastElementChild);

let itemsTD = document.createElement('td');
itemsTD.innerHTML = `<a `+badge4+badge2+`</a>`;
insertAfter(itemsTD, menu.lastElementChild);

let repTD = document.createElement('td');
repTD.innerHTML = `<a onmouseover="statspopup(event,'badge reputations')" onmouseout="kill\(\)">`+repCnt2
insertAfter(repTD, menu.lastElementChild);

let gemTD = document.createElement('td');
gemTD.innerHTML = "<a "+booster4+booster2+"</a>";
insertAfter(gemTD, menu.lastElementChild);

let powerTD = document.createElement('td');
powerTD.innerHTML = `<a onmouseover="statspopup(event,'total power')" onmouseout="kill\(\)"><font color=#D4D4D4>`+charpower2.toLocaleString("en-US");
insertAfter(powerTD, menu.lastElementChild);

let eleTD = document.createElement('td');
eleTD.innerHTML = `<a onmouseover="statspopup(event,'total elemental attack')" onmouseout="kill\(\)"><font color=#D4D4D4>`+charele[1];
insertAfter(eleTD, menu.lastElementChild);

let chaosTD = document.createElement('td');
chaosTD.innerHTML = `<a onmouseover="statspopup(event,'chaos attack')" onmouseout="kill\(\)"><font color=#D4D4D4>`+charchaos[1];
insertAfter(chaosTD, menu.lastElementChild);

let fireResTD = document.createElement('td');
fireResTD.innerHTML = `<a onmouseover="statspopup(event,'fire resistance')" onmouseout="kill\(\)"><font color=#D4D4D4>`+parseInt(fireRes[1]);
insertAfter(fireResTD, menu.lastElementChild);

let arcaneResTD = document.createElement('td');
arcaneResTD.innerHTML = `<a onmouseover="statspopup(event,'arcane resistance')" onmouseout="kill\(\)"><font color=#D4D4D4>`+parseInt(arcaneRes[1]);
insertAfter(arcaneResTD, menu.lastElementChild);

let shadowResTD = document.createElement('td');
shadowResTD.innerHTML = `<a onmouseover="statspopup(event,'shadow resistance')" onmouseout="kill\(\)"><font color=#D4D4D4>`+parseInt(shadowRes[1]);
insertAfter(shadowResTD, menu.lastElementChild);

let holyResTD = document.createElement('td');
holyResTD.innerHTML = `<a onmouseover="statspopup(event,'holy resistance')" onmouseout="kill\(\)"><font color=#D4D4D4>`+parseInt(holyRes[1]);
insertAfter(holyResTD, menu.lastElementChild);

let kineticResTD = document.createElement('td');
kineticResTD.innerHTML = `<a onmouseover="statspopup(event,'kinetic resistance')" onmouseout="kill\(\)"><font color=#D4D4D4>`+parseInt(kineticRes[1]);
insertAfter(kineticResTD, menu.lastElementChild);

let wildTD = document.createElement('td');
wildTD.innerHTML = `<a onmouseover="statspopup(event,'wilderness level')" onmouseout="kill\(\)"><font color=#D4D4D4>`+wilderness[1];
insertAfter(wildTD, menu.lastElementChild);

let ammyTD = document.createElement('td');
ammyTD.innerHTML = amuletCnt[1] ?? "0"
insertAfter(ammyTD, menu.lastElementChild);

let shardTD = document.createElement('td');
shardTD.innerHTML = shardCnt[1] ?? "0"
insertAfter(shardTD, menu.lastElementChild);

let skillsTD = document.createElement('td');
skillsTD.innerHTML = skills;
insertAfter(skillsTD, menu.lastElementChild);

let bpTD = document.createElement('td');
bpTD.innerHTML = bpMax+bpItems+" / "+bpCap
insertAfter(bpTD, menu.lastElementChild);

let utilityTD = document.createElement('td');
utilityTD.innerHTML = utility;
insertAfter(utilityTD, menu.lastElementChild);

fetch("profile?suid="+selectedID[1])
.then(res => res.text())
.then((responseText) => {})

document.querySelector("#zero-config").setAttribute('class', 'rgahealth')

})})})})})}}, 1000);

var pageContent =
    `<div id=mvhead><img src=https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/mv.gif width=80% height=80%></div><p>`+
    `<div class="outer">`+content+`</div><p>`+
    `<div class="outer2">`+content2+`</div><p>`+
    `<div id=beta>Welcome to MOXXIVISION. Please be patient while greatness loads.</div>`

$(document).ready(function(){
  $('#content-header-row > div.outer').doubleScroll();
});

var earnfreepoints = document.querySelector("#content-header-row")

earnfreepoints.innerHTML = pageContent

})}

setTimeout(function() {
if (document.URL.indexOf("earnfreepoints") != -1 ) {
GM_addStyle ( `
#content-header-row > div.outer{display:inline !important;}
#content-header-row > div.outer2{display:inline !important;}
#mvhead{display:none !important;}
`)}

}, 30000);

// moxximod raid results menu and styling

if (document.URL.indexOf("crew_raidresults") != -1 ) {
document.querySelector("#content-header-row > table > tbody > tr > td > form > p > input:nth-child(3)").setAttribute("value", "MoxxiMod raid results");
};

if (document.URL.indexOf("most_recent=MoxxiMod") != -1 ) {
GM_addStyle ( `#content-header-row > table > tbody > tr > td > div > center > div > table{background:#0B0B0B !important;}
td:nth-of-type(3){display: none;}
td:nth-of-type(4){display: none;}
td:nth-of-type(5){display: none;}
`);

var changeHeader0 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table")
changeHeader0.rows[0].cells[0].innerHTML = `<a onmouseover="popup\(event,'Raid time'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>TIME`

var changeHeader1 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table")
changeHeader1.rows[0].cells[1].innerHTML = `<a onmouseover="popup\(event,'Raid god, mob or boss'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>RAID`

// moxximod raid results header row

function insertAfter2(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

let rrHead11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead11 = document.createElement('td');
tdHead11.innerHTML = `<a onmouseover="popup\(event,'Total chars in the raid<br>(number of chars who died)'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>CHARS`;
insertAfter2(tdHead11, rrHead11.lastElementChild);

let rrHead1 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead1 = document.createElement('td');
tdHead1.innerHTML = `<a onmouseover="popup\(event,'Total amount of attack damage<br>Mouseover to see details'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>DMG`;
insertAfter2(tdHead1, rrHead1.lastElementChild);

let rrHead2 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead2 = document.createElement('td');
tdHead2.innerHTML = `<a onmouseover="popup\(event,'Average amount of attack damage per char'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>AVG`;
insertAfter2(tdHead2, rrHead2.lastElementChild);

let rrHead6 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead6 = document.createElement('td');
tdHead6.innerHTML = `<a onmouseover="popup\(event,'Average block rate of all chars'\)" onmouseout="kill\(\)"><font color="ff9e00"><b>BLOCK`;
insertAfter2(tdHead6, rrHead6.lastElementChild);

let rrHead7 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead7 = document.createElement('td');
tdHead7.innerHTML = `<a onmouseover="popup\(event,'Average ele block rate of all chars'\)" onmouseout="kill\(\)"><font color="00ff0b"><b>BLOCK`;
insertAfter2(tdHead7, rrHead7.lastElementChild);

let rrHead13 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead13 = document.createElement('td');
tdHead13.innerHTML = `<a onmouseover="popup\(event,'Average ele shield rate of all chars'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>SHIELD`;
insertAfter2(tdHead13, rrHead13.lastElementChild);

let rrHead14 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead14 = document.createElement('td');
tdHead14.innerHTML = `<a onmouseover="popup\(event,'Total number of individual attacks executed'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>ATKS`;
insertAfter2(tdHead14, rrHead14.lastElementChild);

let rrHead10 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead10 = document.createElement('td');
tdHead10.innerHTML = `<a onmouseover="popup\(event,'Total number of rounds'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>RNDS`;
insertAfter2(tdHead10, rrHead10.lastElementChild);

let rrHead12 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead12 = document.createElement('td');
tdHead12.innerHTML = `<a onmouseover="popup\(event,'Was SIN applied during the raid?'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>SIN`;
insertAfter2(tdHead12, rrHead12.lastElementChild);

let rrHead5 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead5 = document.createElement('td');
tdHead5.innerHTML = `<a onmouseover="popup\(event,'Remaining health of the mob'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>HEALTH`;
insertAfter2(tdHead5, rrHead5.lastElementChild);

let rrHead4 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead4 = document.createElement('td');
tdHead4.innerHTML = `<a onmouseover="popup\(event,'Items dropped from raid'\)" onmouseout="kill\(\)"><font color=#c2c2c2><b>LOOT`;
insertAfter2(tdHead4, rrHead4.lastElementChild);

// moxximod raid results data scrape

var rrTable = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table");
var rrRowCount = 1+rrTable.rows.length;

for (let rownum = 2; rownum < rrRowCount; rownum++) {

let raidLink11 = '';
if (document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5) > a") != null)
raidLink11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5) > a");

let row11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+")")
let chars11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(3)").innerHTML;

let raidNameCell = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)");
let raidName = '';
if (raidNameCell != null)
raidNameCell.innerHTML = '<a href='+raidLink11+'>'+raidNameCell.innerHTML.replaceAll(/,.*/g,"").replaceAll(/of.*/g,"").replaceAll("The","").replaceAll(/the.*/g,"").replaceAll(/the.*/g,"")+'</a>';

let timeStampCell = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1)");
let timeStampName = '';
if (timeStampCell != null)
timeStampCell.innerHTML = timeStampCell.innerHTML.replaceAll(/[0-9]+-[0-9]+-[0-9]+/g,"");

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        raidLink11,
    onload:     function (responseDetails) {

var raidDmg11 = /Damage: ([0-9,]*)/;
var printDmg11 = raidDmg11.exec(responseDetails.responseText);

var raidDrops11 = /popup\(event,'<b>(.*)<\/b>'\)" onmouseout="kill\(\)">[0-9]+ items<\/a>/i;
var printDrops11 = raidDrops11.exec(responseDetails.responseText);

var drops11 = '';
if (printDrops11 == null)
drops11 = `<b>No items found`
if (printDrops11 != null)
drops11 = printDrops11[1]

var raidHealth11 = /([0-9]+)%<\/span><\/div>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]<span id=/i;
var printHealth11 = raidHealth11.exec(responseDetails.responseText);

var health11 = '';
if (printHealth11[1] < 1)
health11 = `<font color=#02B602><b>`+printHealth11[1]+`%</font>`
if (printHealth11[1] > 0)
health11 = `<font color=#FF0000><b>`+printHealth11[1]+`%</font>`

fetch(raidLink11)
   .then(response => response.text())
   .then((response) => {

var attacks11 = response.match(/Base: [0-9]+/g).length;
var blocks11 = response.match(/images\/block\.jpg/g);
var eleblocks11 = response.match(/images\/block2\.jpg/g);
var shields11 = response.match(/_ele_shield\.jpg/g);
var dead11 = response.match(/images\/dead\.jpg/g);
var rounds11 = response.match(/\/img\/skin\/Bar_separator_little\.png/g).length;
var sincheck11 = response.match(/color:#CC0000;"><b>(.*)<\/b>/i);

const reducer = (accumulator, curr) => accumulator + curr

var BaseDmgArray = [];
var BaseMatch = response.matchAll(/onmouseover="popup\(event,.*Base: (.*)<div/g);
for (const BaseMatchLoop of BaseMatch) {
let BaseObj = [parseInt(BaseMatchLoop[1].replace(",",""))];
for (const BaseDmg of BaseObj) {
BaseDmgArray.push(BaseDmg);}}
var BaseNumbers = BaseDmgArray.map(Number)
var BaseDmgCheck = '';
if (BaseNumbers != "")
BaseDmgCheck = BaseNumbers
if (BaseNumbers == "")
BaseDmgCheck = [0]
var SumOfBase = BaseDmgCheck.reduce(reducer).toLocaleString("en-US");
var printBase = "<font color=#FFFFFF><b>+"+SumOfBase+" base<br>"

var FireDmgArray = [];
var FireMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) fire/g);
for (const FireMatchLoop of FireMatch) {
let FireObj = [parseInt(FireMatchLoop[1].replace(",",""))];
for (const FireDmg of FireObj) {
FireDmgArray.push(FireDmg);}}
var FireNumbers = FireDmgArray.map(Number)
var FireDmgCheck = '';
if (FireNumbers != "")
FireDmgCheck = FireNumbers
if (FireNumbers == "")
FireDmgCheck = [0]
var SumOfFire = FireDmgCheck.reduce(reducer).toLocaleString("en-US");
var printFire = "<font color=#ff0000><b>+"+SumOfFire+" fire<br>"

var ShadowDmgArray = [];
var ShadowMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) shadow/g);
for (const ShadowMatchLoop of ShadowMatch) {
let ShadowObj = [parseInt(ShadowMatchLoop[1].replace(",",""))];
for (const ShadowDmg of ShadowObj) {
ShadowDmgArray.push(ShadowDmg);}}
var ShadowNumbers = ShadowDmgArray.map(Number)
var ShadowDmgCheck = '';
if (ShadowNumbers != "")
ShadowDmgCheck = ShadowNumbers
if (ShadowNumbers == "")
ShadowDmgCheck = [0]
var SumOfShadow = ShadowDmgCheck.reduce(reducer).toLocaleString("en-US");
var printShadow = "<font color=#9f02d3><b>+"+SumOfShadow+" shadow<br>"

var HolyDmgArray = [];
var HolyMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) holy/g);
for (const HolyMatchLoop of HolyMatch) {
let HolyObj = [parseInt(HolyMatchLoop[1].replace(",",""))];
for (const HolyDmg of HolyObj) {
HolyDmgArray.push(HolyDmg);}}
var HolyNumbers = HolyDmgArray.map(Number)
var HolyDmgCheck = '';
if (HolyNumbers != "")
HolyDmgCheck = HolyNumbers
if (HolyNumbers == "")
HolyDmgCheck = [0]
var SumOfHoly = HolyDmgCheck.reduce(reducer).toLocaleString("en-US");
var printHoly = "<font color=#00FFFF><b>+"+SumOfHoly+" holy<br>"

var ArcaneDmgArray = [];
var ArcaneMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) arcane/g);
for (const ArcaneMatchLoop of ArcaneMatch) {
let ArcaneObj = [parseInt(ArcaneMatchLoop[1].replace(",",""))];
for (const ArcaneDmg of ArcaneObj) {
ArcaneDmgArray.push(ArcaneDmg);}}
var ArcaneNumbers = ArcaneDmgArray.map(Number)
var ArcaneDmgCheck = '';
if (ArcaneNumbers != "")
ArcaneDmgCheck = ArcaneNumbers
if (ArcaneNumbers == "")
ArcaneDmgCheck = [0]
var SumOfArcane = ArcaneDmgCheck.reduce(reducer).toLocaleString("en-US");
var printArcane = "<font color=#FFFF00><b>+"+SumOfArcane+" arcane<br>"

var KineticDmgArray = [];
var KineticMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) kinetic/g);
for (const KineticMatchLoop of KineticMatch) {
let KineticObj = [parseInt(KineticMatchLoop[1].replace(",",""))];
for (const KineticDmg of KineticObj) {
KineticDmgArray.push(KineticDmg);}}
var KineticNumbers = KineticDmgArray.map(Number)
var KineticDmgCheck = '';
if (KineticNumbers != "")
KineticDmgCheck = KineticNumbers
if (KineticNumbers == "")
KineticDmgCheck = [0]
var SumOfKinetic = KineticDmgCheck.reduce(reducer).toLocaleString("en-US");
var printKinetic = "<font color=#00FF00><b>+"+SumOfKinetic+" kinetic<br>"

var VileDmgArray = [];
var VileMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) vile/g);
for (const VileMatchLoop of VileMatch) {
let VileObj = [parseInt(VileMatchLoop[1].replace(",",""))];
for (const VileDmg of VileObj) {
VileDmgArray.push(VileDmg);}}
var VileNumbers = VileDmgArray.map(Number)
var VileDmgCheck = '';
if (VileNumbers != "")
VileDmgCheck = VileNumbers
if (VileNumbers == "")
VileDmgCheck = [0]
var SumOfVile = VileDmgCheck.reduce(reducer).toLocaleString("en-US");
var printVile = "<font color=#cccccc><b>+"+SumOfVile+" vile energy<br>"

var ChaosDmgArray = [];
var ChaosMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) chaos/g);
for (const ChaosMatchLoop of ChaosMatch) {
let ChaosObj = [parseInt(ChaosMatchLoop[1].replace(",",""))];
for (const ChaosDmg of ChaosObj) {
ChaosDmgArray.push(ChaosDmg);}}
var ChaosNumbers = ChaosDmgArray.map(Number)
var ChaosDmgCheck = '';
if (ChaosNumbers != "")
ChaosDmgCheck = ChaosNumbers
if (ChaosNumbers == "")
ChaosDmgCheck = [0]
var SumOfChaos = ChaosDmgCheck.reduce(reducer).toLocaleString("en-US");
var printChaos = "<font color=#f441be><b>+"+SumOfChaos+" chaos"

var totdead11 = '';
if (dead11 != null)
totdead11 = (dead11.length).toFixed(0)
if (dead11 == null)
totdead11 += "0"

var shieldrate11 = '';
if (shields11 != null)
shieldrate11 = (shields11.length/attacks11*100).toFixed(1)
if (shields11 == null)
shieldrate11 += "0.0"

var sin11 = '';
if (sincheck11[1] != "0")
sin11 += "No"
if (sincheck11[1] == "0")
sin11 += "Yes"

var blockrate11 = '';
if (blocks11 != null)
blockrate11 += (blocks11.length/attacks11*100).toFixed(1)
if (blocks11 == null)
blockrate11 += "0.0"

var eleblockrate11 = '';
if (eleblocks11 != null)
eleblockrate11 = (eleblocks11.length/attacks11*100).toFixed(1)
if (eleblocks11 == null)
eleblockrate11 += "0.0"

let td112 = document.createElement('td');
td112.innerHTML = chars11+" (<span>&#128369;</span>"+totdead11+")";
insertAfter2(td112, row11.lastElementChild);

var damage11 = printDmg11[1];

let td11 = document.createElement('td');
td11.innerHTML = `<span class="dmgbox-text" onmouseover="popup(event,'</center>`+printBase+printFire+printShadow+printHoly+printArcane+printKinetic+printVile+printChaos+`');" onmouseout="kill();">`+damage11;
insertAfter2(td11, row11.lastElementChild);

var cells11 = row11.getElementsByTagName("td");

let td12 = document.createElement('td');
var td12comma = Math.floor(printDmg11[1].replace(/,/g, '')/cells11[2].innerText);
td12.textContent = td12comma.toLocaleString("en-US");
insertAfter2(td12, row11.lastElementChild);

let td61 = document.createElement('td');
td61.innerHTML = blockrate11+"%";
insertAfter2(td61, row11.lastElementChild);

let td71 = document.createElement('td');
td71.innerHTML = eleblockrate11+"%";
insertAfter2(td71, row11.lastElementChild);

let td111 = document.createElement('td');
td111.innerHTML = shieldrate11+"%";
insertAfter2(td111, row11.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = attacks11;
insertAfter2(td13, row11.lastElementChild);

let td91 = document.createElement('td');
td91.innerHTML = rounds11;
insertAfter2(td91, row11.lastElementChild);

let td101 = document.createElement('td');
td101.innerHTML = sin11;
insertAfter2(td101, row11.lastElementChild);

let td51 = document.createElement('td');
td51.innerHTML = health11;
insertAfter2(td51, row11.lastElementChild);

let td41 = document.createElement('td');
td41.innerHTML = drops11.replaceAll(/Amulet Chest \(.*\),/g,"").replaceAll(/,/g,"<br>");
insertAfter2(td41, row11.lastElementChild);

});}})}}

// sess id

var byptlink = document.querySelector("#accordionExample > a");
var sessid = byptlink.href.replace(/https:\/\/rampidgaming.outwar.com\/stripe_buy\?game=ow&outwar=0&wsrv=\$subDomain&lvl=\$user\[level]&rg_sess_id=/, ' ');
var bypplink = document.querySelector("#components > li:nth-child(12) > a")

// server switch link

var server = window.location.href;

var server2 = server.replace(/\.outwar\.com.*/, '');
var server3 = server2.replace(/http.*:\/\//, '');

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/myaccount.php?ac_serverid=2',
    onload:     function (responseDetails) {
const toraxGet = /https:\/\/torax\.outwar\.com\/world\?suid=[0-9]+&serverid=2/i;
const toraxGetPrint = toraxGet.exec(responseDetails.responseText);

var trade1 = /<a href="trade.*<img border="0" height="13" src="http:\/\/torax\.outwar\.com\/images\/toolbar\/Trade\.png" alt="Trade"><\/a>/i;
var trade2 = trade1.exec(responseDetails.responseText);

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/myaccount.php?ac_serverid=1',
    onload:     function (responseDetails) {
const sigilGet = /https:\/\/sigil\.outwar\.com\/world\?suid=[0-9]+&serverid=1/i;
const sigilGetPrint = sigilGet.exec(responseDetails.responseText);

var trade3 = /<a href="trade.*<img border="0" height="13" src="http:\/\/torax\.outwar\.com\/images\/toolbar\/Trade\.png" alt="Trade"><\/a>/i;
var trade4 = trade1.exec(responseDetails.responseText);

var torax = "torax";
var sigil = "sigil";

var servSwitch = '';
if (server3 != torax)
servSwitch += toraxGetPrint+"#";
if (server3 != sigil)
servSwitch += sigilGetPrint+"#";

let serverGo1 = servSwitch.replace("null", "");
let serverGo2 = serverGo1.replace("world", "home");

var otherServ = '';
if (server3 != torax)
otherServ = torax;
if (server3 != sigil)
otherServ = sigil;

// all toolbar

var strengthbar = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.progress-top").innerHTML

document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.progress-top").innerHTML =

'<table><tr>'+
'<td><div id=toolbar1>toolbar1</div></td>'+

'</tr></table>'

document.querySelector("#toolbar1").innerHTML =

'<table><tr><td>' +
`<div class="dropdown">` +
`<a href=`+serverGo2+` onmouseover="popup(event,'click to switch to `+otherServ+`')" onmouseout="kill()">`+
`<button class="dropbtn"><font size=1>SERVER</button></a>`+
`<div class="dropdown-content">` +
    `<a href="/myaccount.php?ac_serverid=2">TORAX CHARS</a>`+
    `<a href="/myaccount.php?ac_serverid=1">SIGIL CHARS</a>`+
    `</div>` +
`</div>`+


`</td>`+
`<td>`+
`<div class="dropdown"><a href=earnfreepoints><button class="dropbtn"><font size=1>MOXXIVISION</button></a></div></td>`+

'<td>'+
'<div class="dropdown">' +
'<button class="dropbtn"><font size=1>QUICK LINKS</button></a>' +
'<div class="dropdown-content">' +
    '<a href="/dungeons">DUNGEONS</a>'+
    '<a href="/news">OUTWAR NEWS</a>'+
    '<a href="/event?eventid=top">TRIAL OF POWER</a>'+
    '<a href="/event?eventid=woz">WAR OF ZHUL</a>'+
    '<a href="/wilderness">WILDERNESS</a>' +
    '</div>' +
    '</div>' +
'</td><td>' +
'<div class="dropdown">' +
'<button class="dropbtn"><font size=1>FAST TRAVEL</button></a>' +
'<div class="dropdown-content">' +
    '<a href="/world.php?room=26137">ASTRAL RIFT</a>' +
    '<a href="/world.php?room=25989">CHALLENGES</a>' +
    '<a href="/world.php?room=24284">DEATHBAT GRAVEYARD</a>' +
    '<a href="/world.php?room=4249">EOB SANDS</a>' +
    '<a href="/world.php?room=42550">MADNESS VAULT</a>' +
    '<a href="/world.php?room=23311">MOUNTAIN CAVE</a>' +
    '<a href="/world.php?room=23471">PRISTINE DEPTHS</a>' +
    '<a href="/world.php?room=11">ROOM 11</a>' +
    '<a href="/world.php?room=6640">SCIENTIFIC DISTRICT</a>' +
    '<a href="/world.php?room=17321">UNDERGROUND Q SEC BASE</a>' +
    '<a href="/world.php?room=10697">VALLEY OF DEATH</a>' +
    '<a href="/world.php?room=25994">WARDENS SANCTUARY</a>' +
    '</div>' +
    '</div>' +

'</td></tr></table>'


;

// custom side menu

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var menu = document.querySelector("#accordionExample");

let raffle = document.createElement('li');
raffle.innerHTML = `<div id="menusearch"></div>`
insertAfter(raffle, menu.lastElementChild);

var theImage = document.querySelector("#menusearch");
theImage.innerHTML =

'<div class=search>' +
'<form method="post" action="playersearch.php" target="_parent">' +
'<div class="col-12 px-2">' +
'<input id="t-text" type="text" name="search" placeholder="player search" class="form-control" required="">' +
'</div>' +
'</form>' +
'</div>' +
'<div class="row mt-4">' +
'</div>'+
'<form method="post" action="crewsearch.php" target="_parent">' +
'<div class="col-12 px-2">' +
'<input id="t-text" type="text" name="search" placeholder="crew search" class="form-control" required="">' +
'</div>' +
'</form>' +
'<p><br><a href=/crew_apply>OMod v1.2</a>' +
'<p>'+strengthbar
'</div>' +
'<div class="row mt-4">' +
'</div></div>' +
'</p></div>'

var servername = window.location.hostname.split(".")[0];
setTimeout(function() {
$("span:contains('SERVER')").text(servername);
}, 10);

// homepage rankings

if ( document.URL.indexOf("outwar.com/home") != -1 ) {

function insertBefore(newNode, existingNode) {
let sp2 = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div > div:nth-child(1)");
existingNode.parentNode.insertBefore(newNode, sp2);
}

fetch('/crew_profile')
   .then(response => response.text())
   .then((response) => {var crewName = response.match(/<h4><img src="\/img\/CrewPoints\.png" onmouseover="popup\(event,'.*Crew Points'\);" onmouseout="kill\(\);"> .*<\/h4>/).toString().replace(/<h4><img src="\/img\/CrewPoints\.png" onmouseover="popup\(event,'.* Crew Points'\);" onmouseout="kill\(\);"> /,"").replace(/<\/h4>/,"")

let menu = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div")

var homepageEQ =

'<div id="char_rankings"><table><tr>' +
'<td>CHAR: POWER<div id="rankings_home"></div></td>' +
'<td>CHAR: ELE DMG<div id="rankings_charele"></div></td>' +
'<td>CHAR: CHAOS DMG<div id="rankings_charchaos"></div></td>'+
'</tr></table></div>' +
'<p><div id="crew_rankings"><table><tr>' +
'<td>CREW: POWER<div id="rankings_crewpow"></div></td>' +
'<td>CREW: ELE DMG<div id="rankings_crewele"></div></td>' +
'<td>CREW: CHAOS DMG<div id="rankings_crewchaos"></div></td>' +
'</tr></table></div>'

var myName = document.querySelector("#select2-charselectdropdown-container").innerHTML

let div = document.createElement('div');
div.innerHTML += homepageEQ;
insertBefore(div, menu.children[0]);

if ( document.URL.indexOf("outwar.com/home") != -1 ) {
GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=crew_power',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=' + category, function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {

                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {

                        var profileUrl = 'characters/' + value.id;
                    }

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_home")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(myName,"<div id=myRank>"+myName+"</div>")

                    $('#rankings_home').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });


GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=char_elepower',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=char_elepower', function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {
                        var imgurl = data.baseimageurl + "/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {
                        var imgurl = data.baseimageurl + "/uploaded/" + value.pic;
                        var profileUrl = 'characters/' + value.id;
                    }

                    if(value.pic == ''  || value.pic == null)
                        imgurl = '/images/gangster1.jpg';

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_charele")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(myName,"<div id=myRank>"+myName+"</div>")

                    $('#rankings_charele').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=crew_power',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=crew_power', function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {
                        var imgurl = data.baseimageurl + "/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {
                        var imgurl = data.baseimageurl + "/uploaded/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }

                    if(value.pic == ''  || value.pic == null)
                        imgurl = '/images/gangster1.jpg';

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_crewpow")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(crewName,"<div id=myRank>"+crewName+"</div>")

                    $('#rankings_crewpow').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=crew_elepower',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=crew_elepower', function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {
                        var imgurl = data.baseimageurl + "/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {
                        var imgurl = data.baseimageurl + "/uploaded/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }

                    if(value.pic == ''  || value.pic == null)
                        imgurl = '/images/gangster1.jpg';

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_crewele")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(crewName,"<div id=myRank>"+crewName+"</div>")

                    $('#rankings_crewele').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=char_chaos',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=char_chaos', function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {
                        var imgurl = data.baseimageurl + "/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {
                        var imgurl = data.baseimageurl + "/uploaded/" + value.pic;
                        var profileUrl = 'characters/' + value.id;
                    }

                    if(value.pic == ''  || value.pic == null)
                        imgurl = '/images/gangster1.jpg';

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_charchaos")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(myName,"<div id=myRank>"+myName+"</div>")

                    $('#rankings_charchaos').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings?type=crew_chaos',
    onload:     function (responseDetails) {
const EQ = /\{.*/i;
const EQprint = EQ.exec(responseDetails.responseText);

        var isLoading = false;

        function selectCategory(category, title, isCrew) {
            if(isLoading)
                return;

            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
            isLoading = true;

           $.getJSON('/ajax/rankings.php?type=crew_chaos', function(data) {

                var isOdd = true;
                $.each(data.results, function(key, value) {

                    if(isCrew) {
                        var imgurl = data.baseimageurl + "/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }
                    else {
                        var imgurl = data.baseimageurl + "/uploaded/" + value.pic;
                        var profileUrl = 'crew_profile?id=' + value.id;
                    }

                    if(value.pic == ''  || value.pic == null)
                        imgurl = '/images/gangster1.jpg';

                    var rowClass = isOdd ? 'rank-row-odd' : 'rank-row-even';

                    var stat = '0';

                    if(value.stat ) {
                        stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }

                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'

var rankSearch1 = document.querySelector("#rankings_crewchaos")
rankSearch1.innerHTML = rankSearch1.innerHTML.replace(crewName,"<div id=myRank>"+crewName+"</div>")

                    $('#rankings_crewchaos').append(html);

                    isOdd = !isOdd;

                });

                isLoading = false;
                $('#last-updated').html('<br>Last updated: ' + data.timestamp);
                $('#ranks').show();
            }, "json");
        }

        $( document ).ready(function() {

            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {

                if($( this ).val() == '')
                    return;

                var isCrew = $( this ).attr('iscrew') == '1';
                selectCategory($( this ).val(), $(this).find("option:selected").text(), isCrew);

            });
        });


    }})}})}})}})}})}})}})};

// equipment injection

if ( document.URL.indexOf("outwar.com/home") != -1 ) {
GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/profile',
    onload:     function (responseDetails) {
const EQ = /<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im;
const EQprint = EQ.exec(responseDetails.responseText);

function insertBefore(newNode, existingNode) {
let sp2 = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(1) > div > div:nth-child(1)");
existingNode.parentNode.insertBefore(newNode, sp2);
}

let menu = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(1) > div")

var specs = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget.widget-chart-one.mb-3 > div.widget-heading.border-bottom-dashed > span").innerHTML

var homepageEQ =
`<div id="spec" class="d-flex b-skills">`+
specs+`</div><p style="margin-bottom:80px">`+
'<div ID=EQhome style="position:relative; width:300px; height:385px; background-image:url(https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/thedude_dark.png)">' +
EQprint +
'</div>'

let div = document.createElement('div');
div.innerHTML += homepageEQ;
insertBefore(div, menu.children[0]);



}})};

if ( document.URL.indexOf("world") != -1 ) {
GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/profile',
    onload:     function (responseDetails) {
const EQ = /<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im;
const EQprint = EQ.exec(responseDetails.responseText);

var EQworld = document.querySelector("#content-header-row > div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-heading");
EQworld.innerHTML =

'<div id=EQworld style="position:relative; width:300px; height:385px; background-image:url(https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/thedude_dark.png)">' +
EQprint +
'</div>'

}})};

if ( document.URL.indexOf("treasury") != -1 ) {
GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/profile',
    onload:     function (responseDetails) {
const EQ = /<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im;
const EQprint = EQ.exec(responseDetails.responseText);

var EQtreas = document.querySelector("#content-header-row > div.col-8.col-lg-3.pl-3.pl-xl-0.pr-1 > div > div.widget-heading");
EQtreas.innerHTML =

'<div id=EQtreas style="position:relative; width:300px; height:385px; background-image:url(https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/thedude_dark.png)">' +
EQprint +
'</div>'

    }})}

// crew raid menus

var crewID1 = '';
if (document.documentElement.innerHTML.match(/href="\/crew_raidresults\.php\?crewid=(.*)">Raid Results<\/a>/i) != null)
crewID1 = document.documentElement.innerHTML.match(/href="\/crew_raidresults\.php\?crewid=(.*)">Raid Results<\/a>/i);


var crewID2 = document.documentElement.innerHTML.match(/tradeWith=(.*)"><svg/i);

if ( document.URL.indexOf("crew_profile") != -1 ) {
$('a[href="crew_raidresults.php?crewid='+crewID2[1]+'&most_recent=1"]').prop('href', 'https://torax.outwar.com/crew_raidresults.php?most_recent=MoxxiMod+raid+results&crewid='+crewID2[1]);

$('a[href="crew_raidresults.php?crewid='+crewID2[1]+'&most_recent=1"]').text("Bed 2");}

var crewmenu =

'<div class="btn-group" role="group">' +
'<button id="btnGroupDefault" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
'Moxxi Mod Raids <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
'</button>' +
'<div class="dropdown-menu" aria-labelledby="btnGroupDefault" style="will-change: transform;">' +
'<a class="dropdown-item" href="/crew_raidresults.php?most_recent=MoxxiMod+raid+results&crewid='+crewID1[1]+'">Moxxi Mod Raid Results</a>' +
'<a class="dropdown-item" href="/crew_raidresults.php?all_results=Display+all+raid+results&crewid='+crewID1[1]+'">All Raid Results</a>' +
'<a class="dropdown-item" href="/crew_raidresults.php?wins=Display+only+victorious+raids&crewid='+crewID1[1]+'">Only Victorious Raids</a>' +
'</div>' +
'</div>'

if ( document.URL.indexOf("crew_") != -1 ) {
function insertAfter9(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

var rrHead = document.querySelector("#content-header-row > div > div > div.btn-group.mb-3.mr-2");
let tdHead = document.createElement('div');
tdHead.innerHTML = crewmenu;

if (rrHead != null)
insertAfter9(tdHead, rrHead.children[2]);}

    }})}})