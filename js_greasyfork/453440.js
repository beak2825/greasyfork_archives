// ==UserScript==
// @name         Tools: Studio Moxxi
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      2.5
// @grant        GM_xmlhttpRequest
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/453440/Tools%3A%20Studio%20Moxxi.user.js
// @updateURL https://update.greasyfork.org/scripts/453440/Tools%3A%20Studio%20Moxxi.meta.js
// ==/UserScript==

var char1 = document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(1)").innerHTML

if (char1 != "synwtf19"){



function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var menu = document.querySelector("#forms");

let raffle = document.createElement('li');
raffle.innerHTML = "<a href=raffle><font color=#f441be>STUDIO MOXXI</a>"

insertAfter(raffle, menu.lastElementChild);

if (document.URL.indexOf("raffle") != -1 ) {

$("body").append ( `
    <div id="Xmoxxivision">
    <a href=home>EXIT</a>
    </div>
` );

var syndvision = document.querySelector("#content")

GM_addStyle ( `
#studiomoxxi > tbody > tr > td > img {width:30px !important; height: 30px !important;border:1px SOLID #454545 !important;}
#studiomoxxi > tbody > tr > th,#studiomoxxi > tbody > tr > td{padding:10px !important;border:1px #202020 solid !important;background:#080808 !important;}
#content{width:100% !important;max-width: 100% !important;margin-left:0px !important;}
#Xmoxxivision{position:fixed !important; left: 1px !important; bottom: 200px !important;padding:10px !important;box-shadow:2px 2px 5px #000000, -2px -2px 5px #000000 !important; background: #202020 !important; z-index:10000 !important;}
#sidebar ul.menu-categories li.menu:first-child>.dropdown-toggle{margin-top:8px !important;}
#accordionExample > a,#accordionExample > p:nth-child(13){display:none !important;}
#accordionExample > div.search,#accordionExample > form,#accordionExample > p:nth-child(15){display:none !important;}
#accordionExample{margin-top:10px !important;}
#content-header-row > table > tbody > tr{background: #1A1C2D !important;}
body{background: #202020 !important;}
#sidebar{display:none !important;}
.dropbtn {color: #fff;background: #000;font-size: 12px;padding: 2px 5px;margin-bottom: 0;}
.dropdown {position: relative;display: inline-block;}
.dropdown-content {display: none;position: absolute;background-color: #f1f1f1;min-width: 160px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);z-index: 1;}
.dropdown-content a {color: black;padding: 12px 16px;text-decoration: none;display: block;}
.dropdown-content a:hover {background-color: #ddd;}
.dropdown:hover .dropdown-content {display: block;}
.dropdown:hover .dropbtn {background-color: #3e8e41;}
#button,#studiomoxxi{display:none !important;}
#studiomoxxi > tbody > tr:nth-child(1) > th:nth-child(1),#studiomoxxi > tbody > tr > td:nth-child(1){display:none !important;}
.button{background:#0F0F0F !important;color:#ffffff !important;padding:10px !important;margin:10px !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#f441be !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
#container > div.sidebar-wrapper.sidebar-theme{display:none !important;}
`);


syndvision.innerHTML = `

<div id="loading">
<img src=https://studiomoxxi.com/moxximod/studio_moxxi_tool_loading.webp>
</div>

<div id="button">
<button id='button1' class='button'>HOME</button>
<button id='button2' class='button'>CORE</button>
<button id='button3' class='button'>HEAD</button>
<button id='button4' class='button'>NECK</button>
<button id='button5' class='button'>WEAPON</button>
<button id='button6' class='button'>BODY</button>
<button id='button7' class='button'>SHIELD</button>
<button id='button8' class='button'>BELT</button>
<button id='button9' class='button'>PANTS</button>
<button id='button10' class='button'>RING</button>
<button id='button11' class='button'>FOOT</button>
</div>

<table id="studiomoxxi">
<th class="id"><b>ID &#9662;</th>
<th class="char"><b>CHAR &#9662;</b></th>
<th class="account"><b>LVL &#9662;</b></th>
<th class="account"><b>EXP &#9662;</b></th>
<th class="account"><b>TO LEVEL &#9662;</b></th>
<th class="account"><b>POWER &#9662;</b></th>
<th class="account"><b>ELE &#9662;</b></th>
<th class="account"><b>ATK &#9662;</b></th>
<th class="account"><b>HP &#9662;</b></th>
<th class="account"><b>CHAOS &#9662;</b></th>
<th class="account"><b>EQUIPMENT</b></th>
<th class="account"><b>BADGE &#9662;</b></th>
<th class="account"><b>GEM &#9662;</b></th>
<th class="account"><b>ORBS &#9662;</b></th>
<th class="account"><b>RUNE &#9662;</b></th>
<th class="account"><b>WILDERNESS &#9662;</b></th>
<th class="account"><b>CREST &#9662;</b></th>
<th class="account"><b>OPEN AUGS &#9662;</b></th>

<th class="core"><b>ITEM</b></th>
<th class="core"><b>NAME &#9662;</b></th>
<th class="core"><b>ELE &#9662;</b></th>
<th class="core"><b>RES &#9662;</b></th>
<th class="core"><b>ATK &#9662;</b></th>
<th class="core"><b>CHAOS &#9662;</b></th>
<th class="core"><b>VILE &#9662;</b></th>
<th class="core"><b>HP &#9662;</b></th>
<th class="core"><b>RPT &#9662;</b></th>
<th class="core"><b>EPT &#9662;</b></th>
<th class="core"><b>RAMP &#9662;</b></th>
<th class="core"><b>CRIT &#9662;</b></th>
<th class="core"><b>BLOCK &#9662;</b></th>
<th class="core"><b>ELE BLOCK &#9662;</b></th>
<th class="core"><b>MR &#9662;</b></th>
<th class="core"><b>OPEN AUGS &#9662;</b></th>
<th class="core"><b>GEMS &#9662;</b></th>

<th class="head"><b>ITEM</b></th>
<th class="head"><b>NAME &#9662;</b></th>
<th class="head"><b>ELE &#9662;</b></th>
<th class="head"><b>RES &#9662;</b></th>
<th class="head"><b>ATK &#9662;</b></th>
<th class="head"><b>CHAOS &#9662;</b></th>
<th class="head"><b>VILE &#9662;</b></th>
<th class="head"><b>HP &#9662;</b></th>
<th class="head"><b>RPT &#9662;</b></th>
<th class="head"><b>EPT &#9662;</b></th>
<th class="head"><b>RAMP &#9662;</b></th>
<th class="head"><b>CRIT &#9662;</b></th>
<th class="head"><b>BLOCK &#9662;</b></th>
<th class="head"><b>ELE BLOCK &#9662;</b></th>
<th class="head"><b>MR &#9662;</b></th>
<th class="head"><b>OPEN AUGS &#9662;</b></th>
<th class="head"><b>GEMS &#9662;</b></th>

<th class="neck"><b>ITEM</b></th>
<th class="neck"><b>NAME &#9662;</b></th>
<th class="neck"><b>ELE &#9662;</b></th>
<th class="neck"><b>RES &#9662;</b></th>
<th class="neck"><b>ATK &#9662;</b></th>
<th class="neck"><b>CHAOS &#9662;</b></th>
<th class="neck"><b>VILE &#9662;</b></th>
<th class="neck"><b>HP &#9662;</b></th>
<th class="neck"><b>RPT &#9662;</b></th>
<th class="neck"><b>EPT &#9662;</b></th>
<th class="neck"><b>RAMP &#9662;</b></th>
<th class="neck"><b>CRIT &#9662;</b></th>
<th class="neck"><b>BLOCK &#9662;</b></th>
<th class="neck"><b>ELE BLOCK &#9662;</b></th>
<th class="neck"><b>MR &#9662;</b></th>
<th class="neck"><b>OPEN AUGS &#9662;</b></th>
<th class="neck"><b>GEMS &#9662;</b></th>

<th class="weapon"><b>ITEM</b></th>
<th class="weapon"><b>NAME &#9662;</b></th>
<th class="weapon"><b>ELE &#9662;</b></th>
<th class="weapon"><b>RES &#9662;</b></th>
<th class="weapon"><b>ATK &#9662;</b></th>
<th class="weapon"><b>CHAOS &#9662;</b></th>
<th class="weapon"><b>VILE &#9662;</b></th>
<th class="weapon"><b>HP &#9662;</b></th>
<th class="weapon"><b>RPT &#9662;</b></th>
<th class="weapon"><b>EPT &#9662;</b></th>
<th class="weapon"><b>RAMP &#9662;</b></th>
<th class="weapon"><b>CRIT &#9662;</b></th>
<th class="weapon"><b>BLOCK &#9662;</b></th>
<th class="weapon"><b>ELE BLOCK &#9662;</b></th>
<th class="weapon"><b>MR &#9662;</b></th>
<th class="weapon"><b>OPEN AUGS &#9662;</b></th>
<th class="weapon"><b>GEMS &#9662;</b></th>

<th class="body"><b>ITEM</b></th>
<th class="body"><b>NAME &#9662;</b></th>
<th class="body"><b>ELE &#9662;</b></th>
<th class="body"><b>RES &#9662;</b></th>
<th class="body"><b>ATK &#9662;</b></th>
<th class="body"><b>CHAOS &#9662;</b></th>
<th class="body"><b>VILE &#9662;</b></th>
<th class="body"><b>HP &#9662;</b></th>
<th class="body"><b>RPT &#9662;</b></th>
<th class="body"><b>EPT &#9662;</b></th>
<th class="body"><b>RAMP &#9662;</b></th>
<th class="body"><b>CRIT &#9662;</b></th>
<th class="body"><b>BLOCK &#9662;</b></th>
<th class="body"><b>ELE BLOCK &#9662;</b></th>
<th class="body"><b>MR &#9662;</b></th>
<th class="body"><b>OPEN AUGS &#9662;</b></th>
<th class="body"><b>GEMS &#9662;</b></th>

<th class="shield"><b>ITEM</b></th>
<th class="shield"><b>NAME &#9662;</b></th>
<th class="shield"><b>ELE &#9662;</b></th>
<th class="shield"><b>RES &#9662;</b></th>
<th class="shield"><b>ATK &#9662;</b></th>
<th class="shield"><b>CHAOS &#9662;</b></th>
<th class="shield"><b>VILE &#9662;</b></th>
<th class="shield"><b>HP &#9662;</b></th>
<th class="shield"><b>RPT &#9662;</b></th>
<th class="shield"><b>EPT &#9662;</b></th>
<th class="shield"><b>RAMP &#9662;</b></th>
<th class="shield"><b>CRIT &#9662;</b></th>
<th class="shield"><b>BLOCK &#9662;</b></th>
<th class="shield"><b>ELE BLOCK &#9662;</b></th>
<th class="shield"><b>MR &#9662;</b></th>
<th class="shield"><b>OPEN AUGS &#9662;</b></th>
<th class="shield"><b>GEMS &#9662;</b></th>

<th class="belt"><b>ITEM</b></th>
<th class="belt"><b>NAME &#9662;</b></th>
<th class="belt"><b>ELE &#9662;</b></th>
<th class="belt"><b>RES &#9662;</b></th>
<th class="belt"><b>ATK &#9662;</b></th>
<th class="belt"><b>CHAOS &#9662;</b></th>
<th class="belt"><b>VILE &#9662;</b></th>
<th class="belt"><b>HP &#9662;</b></th>
<th class="belt"><b>RPT &#9662;</b></th>
<th class="belt"><b>EPT &#9662;</b></th>
<th class="belt"><b>RAMP &#9662;</b></th>
<th class="belt"><b>CRIT &#9662;</b></th>
<th class="belt"><b>BLOCK &#9662;</b></th>
<th class="belt"><b>ELE BLOCK &#9662;</b></th>
<th class="belt"><b>MR &#9662;</b></th>
<th class="belt"><b>OPEN AUGS &#9662;</b></th>
<th class="belt"><b>GEMS &#9662;</b></th>

<th class="pants"><b>ITEM</b></th>
<th class="pants"><b>NAME &#9662;</b></th>
<th class="pants"><b>ELE &#9662;</b></th>
<th class="pants"><b>RES &#9662;</b></th>
<th class="pants"><b>ATK &#9662;</b></th>
<th class="pants"><b>CHAOS &#9662;</b></th>
<th class="pants"><b>VILE &#9662;</b></th>
<th class="pants"><b>HP &#9662;</b></th>
<th class="pants"><b>RPT &#9662;</b></th>
<th class="pants"><b>EPT &#9662;</b></th>
<th class="pants"><b>RAMP &#9662;</b></th>
<th class="pants"><b>CRIT &#9662;</b></th>
<th class="pants"><b>BLOCK &#9662;</b></th>
<th class="pants"><b>ELE BLOCK &#9662;</b></th>
<th class="pants"><b>MR &#9662;</b></th>
<th class="pants"><b>OPEN AUGS &#9662;</b></th>
<th class="pants"><b>GEMS &#9662;</b></th>

<th class="ring"><b>ITEM</b></th>
<th class="ring"><b>NAME &#9662;</b></th>
<th class="ring"><b>ELE &#9662;</b></th>
<th class="ring"><b>RES &#9662;</b></th>
<th class="ring"><b>ATK &#9662;</b></th>
<th class="ring"><b>CHAOS &#9662;</b></th>
<th class="ring"><b>VILE &#9662;</b></th>
<th class="ring"><b>HP &#9662;</b></th>
<th class="ring"><b>RPT &#9662;</b></th>
<th class="ring"><b>EPT &#9662;</b></th>
<th class="ring"><b>RAMP &#9662;</b></th>
<th class="ring"><b>CRIT &#9662;</b></th>
<th class="ring"><b>BLOCK &#9662;</b></th>
<th class="ring"><b>ELE BLOCK &#9662;</b></th>
<th class="ring"><b>MR &#9662;</b></th>
<th class="ring"><b>OPEN AUGS &#9662;</b></th>
<th class="ring"><b>GEMS &#9662;</b></th>

<th class="foot"><b>ITEM</b></th>
<th class="foot"><b>NAME &#9662;</b></th>
<th class="foot"><b>ELE &#9662;</b></th>
<th class="foot"><b>RES &#9662;</b></th>
<th class="foot"><b>ATK &#9662;</b></th>
<th class="foot"><b>CHAOS &#9662;</b></th>
<th class="foot"><b>VILE &#9662;</b></th>
<th class="foot"><b>HP &#9662;</b></th>
<th class="foot"><b>RPT &#9662;</b></th>
<th class="foot"><b>EPT &#9662;</b></th>
<th class="foot"><b>RAMP &#9662;</b></th>
<th class="foot"><b>CRIT &#9662;</b></th>
<th class="foot"><b>BLOCK &#9662;</b></th>
<th class="foot"><b>ELE BLOCK &#9662;</b></th>
<th class="foot"><b>MR &#9662;</b></th>
<th class="foot"><b>OPEN AUGS &#9662;</b></th>
<th class="foot"><b>GEMS &#9662;</b></th>

<tr><td>165989</td></tr>
<tr><td>165992</td></tr>
<tr><td>164102</td></tr>
<tr><td>164540</td></tr>
<tr><td>163610</td></tr>
<tr><td>166085</td></tr>
<tr><td>163827</td></tr>
<tr><td>165987</td></tr>
<tr><td>164001</td></tr>
<tr><td>163830</td></tr>
<tr><td>123726</td></tr>
<tr><td>116524</td></tr>
<tr><td>166679</td></tr>
<tr><td>166759</td></tr>
<tr><td>165988</td></tr>
<tr><td>166680</td></tr>
<tr><td>165126</td></tr>
<tr><td>166390</td></tr>
<tr><td>166684</td></tr>
<tr><td>258728</td></tr>
<tr><td>258729</td></tr>
<tr><td>258730</td></tr>
<tr><td>258731</td></tr>
<tr><td>258732</td></tr>
<tr><td>258733</td></tr>
<tr><td>258734</td></tr>
<tr><td>258735</td></tr>
<tr><td>258736</td></tr>
<tr><td>258737</td></tr>
<tr><td>258738</td></tr>
<tr><td>258739</td></tr>
<tr><td>258740</td></tr>
<tr><td>258742</td></tr>
<tr><td>258743</td></tr>
<tr><td>258744</td></tr>
<tr><td>258749</td></tr>
<tr><td>258750</td></tr>
<tr><td>258726</td></tr>
<tr><td>806829</td></tr>
<tr><td>165034</td></tr>
<tr><td>166342</td></tr>
<tr><td>166682</td></tr>
<tr><td>163843</td></tr>
<tr><td>258741</td></tr>
<tr><td>258745</td></tr>
<tr><td>258746</td></tr>
<tr><td>258747</td></tr>
<tr><td>258748</td></tr>
<tr><td>258727</td></tr>
<tr><td>117926</td></tr>
<tr><td>166683</td></tr>
<tr><td>117962</td></tr>
<tr><td>166681</td></tr>
<tr><td>166760</td></tr>
<tr><td>166769</td></tr>
<tr><td>118156</td></tr>
<tr><td>117963</td></tr>
<tr><td>118159</td></tr>
<tr><td>118849</td></tr>
<tr><td>123723</td></tr>
<tr><td>118852</td></tr>
<tr><td>81544</td></tr>
<tr><td>123724</td></tr>
<tr><td>123722</td></tr>
<tr><td>116525</td></tr>
<tr><td>118854</td></tr>
<tr><td>118160</td></tr>
<tr><td>118157</td></tr>
<tr><td>118851</td></tr>
<tr><td>118850</td></tr>
<tr><td>123727</td></tr>
<tr><td>118853</td></tr>
<tr><td>118158</td></tr>
<tr><td>123725</td></tr>
<tr><td>71538</td></tr>
<tr><td>71539</td></tr>
<tr><td>71540</td></tr>
<tr><td>71541</td></tr>
<tr><td>71542</td></tr>
<tr><td>71543</td></tr>
<tr><td>71544</td></tr>
<tr><td>71545</td></tr>
<tr><td>71546</td></tr>
<tr><td>71547</td></tr>
<tr><td>71548</td></tr>
<tr><td>71549</td></tr>
<tr><td>71550</td></tr>
<tr><td>71551</td></tr>
<tr><td>71552</td></tr>
<tr><td>71553</td></tr>
<tr><td>71554</td></tr>
<tr><td>71555</td></tr>
<tr><td>71556</td></tr>
<tr><td>71557</td></tr>
<tr><td>71558</td></tr>
<tr><td>70006</td></tr>
<tr><td>71537</td></tr>
<tr><td>71536</td></tr>
<tr><td>71535</td></tr>
<tr><td>66865</td></tr>
<tr><td>118155</td></tr>
<tr><td>123756</td></tr>
<tr><td>123744</td></tr>
<tr><td>123742</td></tr>
<tr><td>123757</td></tr>
<tr><td>124156</td></tr>
<tr><td>123747</td></tr>
<tr><td>123755</td></tr>
<tr><td>123753</td></tr>
<tr><td>124158</td></tr>
<tr><td>123739</td></tr>
<tr><td>123740</td></tr>
<tr><td>123774</td></tr>
<tr><td>123745</td></tr>
<tr><td>123776</td></tr>
<tr><td>123741</td></tr>
<tr><td>123773</td></tr>
<tr><td>123775</td></tr>
<tr><td>135976</td></tr>
<tr><td>124283</td></tr>
<tr><td>124282</td></tr>
<tr><td>124157</td></tr>
<tr><td>124162</td></tr>
<tr><td>124165</td></tr>
<tr><td>807452</td></tr>
<tr><td>807453</td></tr>
<tr><td>807454</td></tr>
<tr><td>807455</td></tr>
<tr><td>124289</td></tr>
<tr><td>807456</td></tr>
<tr><td>807457</td></tr>
<tr><td>807458</td></tr>
<tr><td>807459</td></tr>
<tr><td>807460</td></tr>
<tr><td>807461</td></tr>
<tr><td>807462</td></tr>
<tr><td>807463</td></tr>
<tr><td>807464</td></tr>
<tr><td>807465</td></tr>
<tr><td>124292</td></tr>
<tr><td>807466</td></tr>
<tr><td>807467</td></tr>
<tr><td>807468</td></tr>
<tr><td>807469</td></tr>
<tr><td>807470</td></tr>
<tr><td>807471</td></tr>
<tr><td>807472</td></tr>
<tr><td>807473</td></tr>
<tr><td>807474</td></tr>
<tr><td>807475</td></tr>
<tr><td>124296</td></tr>
<tr><td>807476</td></tr>
<tr><td>807477</td></tr>
<tr><td>807478</td></tr>
<tr><td>807479</td></tr>
<tr><td>807480</td></tr>
<tr><td>807481</td></tr>
<tr><td>807482</td></tr>
<tr><td>807483</td></tr>
<tr><td>807484</td></tr>
<tr><td>807485</td></tr>
<tr><td>124281</td></tr>
<tr><td>807486</td></tr>
<tr><td>807487</td></tr>
<tr><td>807488</td></tr>
<tr><td>807489</td></tr>
<tr><td>807490</td></tr>
<tr><td>807491</td></tr>
<tr><td>807492</td></tr>
<tr><td>807493</td></tr>
<tr><td>807494</td></tr>
<tr><td>807495</td></tr>
<tr><td>124284</td></tr>
<tr><td>807496</td></tr>
<tr><td>807497</td></tr>
<tr><td>807498</td></tr>
<tr><td>807499</td></tr>
<tr><td>124285</td></tr>
<tr><td>124288</td></tr>
<tr><td>123743</td></tr>
<tr><td>124291</td></tr>
<tr><td>124293</td></tr>
<tr><td>124295</td></tr>
<tr><td>124299</td></tr>
<tr><td>124286</td></tr>
<tr><td>124297</td></tr>
<tr><td>124163</td></tr>
<tr><td>123748</td></tr>
<tr><td>124160</td></tr>
<tr><td>123746</td></tr>
<tr><td>123772</td></tr>
<tr><td>123754</td></tr>
<tr><td>124159</td></tr>
<tr><td>124161</td></tr>
<tr><td>124290</td></tr>
<tr><td>124287</td></tr>
<tr><td>124298</td></tr>
<tr><td>124164</td></tr>
<tr><td>124294</td></tr>
</table>`

document.getElementById ("button1").addEventListener (
    "click", Button1, false
);
function Button1 (zEvent) {
GM_addStyle ( `
.account {display:revert !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#f441be !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button2").addEventListener (
    "click", Button2, false
);
function Button2 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:revert !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#f441be !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button3").addEventListener (
    "click", Button3, false
);
function Button3 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.core {display:none !important}
.head {display:revert !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#f441be !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button4").addEventListener (
    "click", Button4, false
);
function Button4 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:revert !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#f441be !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button5").addEventListener (
    "click", Button5, false
);
function Button5 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:revert !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#f441be !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button6").addEventListener (
    "click", Button6, false
);
function Button6 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:revert !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#f441be !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button7").addEventListener (
    "click", Button7, false
);
function Button7 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:revert !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#f441be !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button8").addEventListener (
    "click", Button8, false
);
function Button8 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:revert !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#f441be !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button9").addEventListener (
    "click", Button9, false
);
function Button9 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:revert !important}
.ring {display:none !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#f441be !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button10").addEventListener (
    "click", Button10, false
);
function Button10 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:revert !important}
.foot {display:none !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#f441be !important;}
#button11{color:#FFFFFF !important;}
`);}

document.getElementById ("button11").addEventListener (
    "click", Button11, false
);
function Button11 (zEvent) {
GM_addStyle ( `
.account {display:none !important;}
.head {display:none !important}
.core {display:none !important}
.neck {display:none !important}
.weapon {display:none !important}
.body {display:none !important}
.shield {display:none !important}
.belt {display:none !important}
.pants {display:none !important}
.ring {display:none !important}
.foot {display:revert !important}
#button1{color:#FFFFFF !important;}
#button2{color:#FFFFFF !important;}
#button3{color:#FFFFFF !important;}
#button4{color:#FFFFFF !important;}
#button5{color:#FFFFFF !important;}
#button6{color:#FFFFFF !important;}
#button7{color:#FFFFFF !important;}
#button8{color:#FFFFFF !important;}
#button9{color:#FFFFFF !important;}
#button10{color:#FFFFFF !important;}
#button11{color:#f441be !important;}
`);}

// SORT TABLE!

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

// END SORT

var charsTable = document.querySelector("#studiomoxxi > tbody");
var charsTableRows = charsTable.rows.length;

for (let rownum = 2; rownum < (charsTableRows+1); rownum++) {

var links = "profile.php?id="+document.querySelector("#studiomoxxi > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML

fetch(links)
   .then(response => response.text())
   .then((response) => {

var name = response.match(/<a href="\/send_ow_message\?name=(.*)">/i)
var power = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)
var eledmg = response.match(/ELEMENTAL ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
var attack = response.match(/ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
var hp = response.match(/HIT POINTS.*[\n\r].*<font size="2">(.*)<\/font>/i)
var chaos = response.match(/CHAOS DAMAGE.*[\n\r].*<font size="2">(.*)<\/font>/i)
var wilderness = response.match(/WILDERNESS LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)
var experience = response.match(/TOTAL EXPERIENCE.*[\n\r].*<font size="2">(.*)<\/font>/i)
var level = response.match(/CHARACTER CLASS.*[\n\r].*<font size="2">Level ([0-9]+).*<\/font>/i)
var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)
var id = response.match(/<a href="\.\.\/allies\.php\?uid=(.*)">\[View All]<\/a>/i)

var prescrest = '';
    if (response.match(/alt="(.*est) of Preservation">/i) == null)
        prescrest = 0
    if (response.match(/alt="(.*est) of Preservation">/i) != null)
        prescrest = response.match(/alt="(.*est) of Preservation">/i)

var crestlvl = '';
    if (prescrest == 0)
        crestlvl = 0
    if (prescrest[1] == "Crest")
        crestlvl = 1
    if (prescrest[1] == "Excelled Crest")
        crestlvl = 2
    if (prescrest[1] == "Violent Crest")
        crestlvl = 3

var items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*).*[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)[\n\r].*[\n\r](.*)/im)
var core = items[1]
var head = items[2]
var neck = items[3]
var weapon = items[4]
var body = items[5]
var shield = items[6]
var belt = items[8]
var pants = items[7]
var ring = items[9]
var foot = items[10]
var gem = items[11].toString().match(/alt="(.*)"/i)
var rune = items[12].toString().match(/alt="(.*)"/i)
var orbs = items[13].toString().match(/<img style="border:0px;" src=".*" onclick="window\.location='\/itemlink\?id=.*&owner=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt="(.*)"><img style="border:0px;" src=".*" onclick="window\.location='\/itemlink\?id=.*&owner=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt="(.*)"><img style="border:0px;" src=".*" onclick="window\.location='\/itemlink\?id=.*&owner=.*'" ONMOUSEOVER="itempopup\(event,'.*'\)" ONMOUSEOUT="kill\(\)" alt="(.*)"> <\/div>/i)
var orb1 = orbs[1]
var orb2 = orbs[2]
var orb3 = orbs[3]
var badge = items[14].toString().match(/alt="(.*)"/i)

document.querySelector("#studiomoxxi > tbody > tr:nth-child("+rownum+")").setAttribute("class",level[1])

var neededtolvl = '';
    if (level[1] == 90)
        neededtolvl = 0
    if (level[1] == 89)
        neededtolvl = 50000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 88)
        neededtolvl = 41000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 87)
        neededtolvl = 33000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 86)
        neededtolvl = 26000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 85)
        neededtolvl = 20000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 84)
        neededtolvl = 15000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 83)
        neededtolvl = 10000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 82)
        neededtolvl = 6750000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 81)
        neededtolvl = 4500000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 80)
        neededtolvl = 3000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 79)
        neededtolvl = 2000000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 78)
        neededtolvl = 1450920000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 77)
        neededtolvl = 995600000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 76)
        neededtolvl = 675000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 75)
        neededtolvl = 385000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 74)
        neededtolvl = 184900000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 73)
        neededtolvl = 152400000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 72)
        neededtolvl = 126400000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 71)
        neededtolvl = 106900000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 70)
        neededtolvl = 90650000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 69)
        neededtolvl = 77000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 68)
        neededtolvl = 68750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 67)
        neededtolvl = 61750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 66)
        neededtolvl = 55750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 65)
        neededtolvl = 49750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 64)
        neededtolvl = 44750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 63)
        neededtolvl = 39750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 62)
        neededtolvl = 35750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 61)
        neededtolvl = 31750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 60)
        neededtolvl = 28000000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 59)
        neededtolvl = 24750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 58)
        neededtolvl = 22250000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 57)
        neededtolvl = 19750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 56)
        neededtolvl = 17250000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 55)
        neededtolvl = 14750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 54)
        neededtolvl = 12750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 53)
        neededtolvl = 11050000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 52)
        neededtolvl = 9250000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 51)
        neededtolvl = 7750000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 50)
        neededtolvl = 6500000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 49)
        neededtolvl = 5250000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 48)
        neededtolvl = 4935000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 47)
        neededtolvl = 4620000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 46)
        neededtolvl = 4312500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 45)
        neededtolvl = 3990000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 44)
        neededtolvl = 3687500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 43)
        neededtolvl = 3380000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 42)
        neededtolvl = 3105000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 41)
        neededtolvl = 2800000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 40)
        neededtolvl = 2537500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 39)
        neededtolvl = 2325000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 38)
        neededtolvl = 2131250-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 37)
        neededtolvl = 1920000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 36)
        neededtolvl = 1732500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 35)
        neededtolvl = 1530000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 34)
        neededtolvl = 1378125-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 33)
        neededtolvl = 1224000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 32)
        neededtolvl = 1082250-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 31)
        neededtolvl = 950000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 30)
        neededtolvl = 838500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 29)
        neededtolvl = 735000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 28)
        neededtolvl = 625000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 27)
        neededtolvl = 525000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 26)
        neededtolvl = 445000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 25)
        neededtolvl = 370000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 24)
        neededtolvl = 310000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 23)
        neededtolvl = 260000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 22)
        neededtolvl = 215000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 21)
        neededtolvl = 165000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 20)
        neededtolvl = 130000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 19)
        neededtolvl = 100000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 18)
        neededtolvl = 75000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 17)
        neededtolvl = 55000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 16)
        neededtolvl = 40000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 15)
        neededtolvl = 28000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 14)
        neededtolvl = 18000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 13)
        neededtolvl = 12000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 12)
        neededtolvl = 8000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 11)
        neededtolvl = 5000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 10)
        neededtolvl = 3000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 9)
        neededtolvl = 1500-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 8)
        neededtolvl = 1000-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 7)
        neededtolvl = 700-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 6)
        neededtolvl = 450-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 5)
        neededtolvl = 250-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 4)
        neededtolvl = 150-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 3)
        neededtolvl = 50-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 2)
        neededtolvl = 25-parseInt((experience[1]).replaceAll(",",""))
    if (level[1] == 1)
        neededtolvl = 7-parseInt((experience[1]).replaceAll(",",""))

var orblvl = 0;
    if (orb1 == "Trial Crusader Orb")
        orblvl += 200
    if (orb1 == "Trial Conjurer Orb")
        orblvl += 300
    if (orb1 == "Irthys Assault Orb")
        orblvl += 400
    if (orb1 == "Irthys Vigor Orb")
        orblvl += 400
    if (orb1 == "Irthys Defense Orb")
        orblvl += 400
    if (orb1 == "Wrathful Orb")
        orblvl += 450
    if (orb1 == "Chaotic Defense Orb")
        orblvl += 500
    if (orb1 == "Chaotic Vigor Orb")
        orblvl += 500
    if (orb1 == "Chaotic Assault Orb")
        orblvl += 500
    if (orb1 == "Timid Orb of Insanity")
        orblvl += 600
    if (orb1 == "Timid Orb of Lunacy")
        orblvl += 600
    if (orb1 == "Timid Orb of Madness")
        orblvl += 600
    if (orb1 == "Enraged Orb of Insanity")
        orblvl += 900
    if (orb1 == "Enraged Orb of Lunacy")
        orblvl += 900
    if (orb1 == "Enraged Orb of Madness")
        orblvl += 900
    if (orb1 == "Furious Orb of Insanity")
        orblvl += 1200
    if (orb1 == "Furious Orb of Lunacy")
        orblvl += 1200
    if (orb1 == "Furious Orb of Madness")
        orblvl += 1200
    if (orb1 == "Demonic Orb of Insanity")
        orblvl += 1500
    if (orb1 == "Demonic Orb of Lunacy")
        orblvl += 1500
    if (orb1 == "Demonic Orb of Madness")
        orblvl += 1500
    if (orb2 == "Trial Crusader Orb")
        orblvl += 200
    if (orb2 == "Trial Conjurer Orb")
        orblvl += 300
    if (orb2 == "Irthys Assault Orb")
        orblvl += 400
    if (orb2 == "Irthys Vigor Orb")
        orblvl += 400
    if (orb2 == "Irthys Defense Orb")
        orblvl += 400
    if (orb2 == "Wrathful Orb")
        orblvl += 450
    if (orb2 == "Chaotic Defense Orb")
        orblvl += 500
    if (orb2 == "Chaotic Vigor Orb")
        orblvl += 500
    if (orb2 == "Chaotic Assault Orb")
        orblvl += 500
    if (orb2 == "Timid Orb of Insanity")
        orblvl += 600
    if (orb2 == "Timid Orb of Lunacy")
        orblvl += 600
    if (orb2 == "Timid Orb of Madness")
        orblvl += 600
    if (orb2 == "Enraged Orb of Insanity")
        orblvl += 900
    if (orb2 == "Enraged Orb of Lunacy")
        orblvl += 900
    if (orb2 == "Enraged Orb of Madness")
        orblvl += 900
    if (orb2 == "Furious Orb of Insanity")
        orblvl += 1200
    if (orb2 == "Furious Orb of Lunacy")
        orblvl += 1200
    if (orb2 == "Furious Orb of Madness")
        orblvl += 1200
    if (orb2 == "Demonic Orb of Insanity")
        orblvl += 1500
    if (orb2 == "Demonic Orb of Lunacy")
        orblvl += 1500
    if (orb2 == "Demonic Orb of Madness")
        orblvl += 1500
    if (orb3 == "Trial Crusader Orb")
        orblvl += 200
    if (orb3 == "Trial Conjurer Orb")
        orblvl += 300
    if (orb3 == "Irthys Assault Orb")
        orblvl += 400
    if (orb3 == "Irthys Vigor Orb")
        orblvl += 400
    if (orb3 == "Irthys Defense Orb")
        orblvl += 400
    if (orb3 == "Wrathful Orb")
        orblvl += 450
    if (orb3 == "Chaotic Defense Orb")
        orblvl += 500
    if (orb3 == "Chaotic Vigor Orb")
        orblvl += 500
    if (orb3 == "Chaotic Assault Orb")
        orblvl += 500
    if (orb3 == "Timid Orb of Insanity")
        orblvl += 600
    if (orb3 == "Timid Orb of Lunacy")
        orblvl += 600
    if (orb3 == "Timid Orb of Madness")
        orblvl += 600
    if (orb3 == "Enraged Orb of Insanity")
        orblvl += 900
    if (orb3 == "Enraged Orb of Lunacy")
        orblvl += 900
    if (orb3 == "Enraged Orb of Madness")
        orblvl += 900
    if (orb3 == "Furious Orb of Insanity")
        orblvl += 1200
    if (orb3 == "Furious Orb of Lunacy")
        orblvl += 1200
    if (orb3 == "Furious Orb of Madness")
        orblvl += 1200
    if (orb3 == "Demonic Orb of Insanity")
        orblvl += 1500
    if (orb3 == "Demonic Orb of Lunacy")
        orblvl += 1500
    if (orb3 == "Demonic Orb of Madness")
        orblvl += 1500

var runelvl = '';
    if (rune[1] == "Rune of Creation")
        runelvl = 37
    if (rune[1] == "Empyreal Rune Stage 5")
        runelvl = 36
    if (rune[1] == "Empyreal Rune Stage 4")
        runelvl = 35
    if (rune[1] == "Empyreal Rune Stage 3")
        runelvl = 34
    if (rune[1] == "Empyreal Rune Stage 2")
        runelvl = 33
    if (rune[1] == "Empyreal Rune Stage 1")
        runelvl = 32
    if (rune[1] == "Titanic Rune Stage 5")
        runelvl = 31
    if (rune[1] == "Titanic Rune Stage 4")
        runelvl = 30
    if (rune[1] == "Titanic Rune Stage 3")
        runelvl = 29
    if (rune[1] == "Titanic Rune Stage 2")
        runelvl = 28
    if (rune[1] == "Titanic Rune Stage 1")
        runelvl = 27
    if (rune[1] == "Cosmic Rune Stage 5")
        runelvl = 26
    if (rune[1] == "Cosmic Rune Stage 4")
        runelvl = 25
    if (rune[1] == "Cosmic Rune Stage 3")
        runelvl = 24
    if (rune[1] == "Cosmic Rune Stage 2")
        runelvl = 23
    if (rune[1] == "Cosmic Rune Stage 1")
        runelvl = 22
    if (rune[1] == "Stellar Rune Stage 5")
        runelvl = 21
    if (rune[1] == "Stellar Rune Stage 4")
        runelvl = 20
    if (rune[1] == "Stellar Rune Stage 3")
        runelvl = 19
    if (rune[1] == "Stellar Rune Stage 2")
        runelvl = 18
    if (rune[1] == "Stellar Rune Stage 1")
        runelvl = 17
    if (rune[1] == "Elevated Rune Stage 5")
        runelvl = 16
    if (rune[1] == "Elevated Rune Stage 4")
        runelvl = 15
    if (rune[1] == "Elevated Rune Stage 3")
        runelvl = 14
    if (rune[1] == "Elevated Rune Stage 2")
        runelvl = 13
    if (rune[1] == "Elevated Rune Stage 1")
        runelvl = 12
    if (rune[1] == "Astral Rune Stage 5")
        runelvl = 11
    if (rune[1] == "Astral Rune Stage 4")
        runelvl = 10
    if (rune[1] == "Astral Rune Stage 3")
        runelvl = 9
    if (rune[1] == "Astral Rune Stage 2")
        runelvl = 8
    if (rune[1] == "Astral Rune Stage 1")
        runelvl = 7
    if (rune[1] == "Mystic Elemental Rune")
        runelvl = 6
    if (rune[1] == "Resplendent Elemental Rune")
        runelvl = 5
    if (rune[1] == "Primal Elemental Rune")
        runelvl = 4
    if (rune[1] == "Amplified Kinetic Rune")
        runelvl = 3
    if (rune[1] == "Amplified Fire Rune")
        runelvl = 3
    if (rune[1] == "Amplified Shadow Rune")
        runelvl = 3
    if (rune[1] == "Amplified Arcane Rune")
        runelvl = 3
    if (rune[1] == "Amplified Holy Rune")
        runelvl = 3
    if (rune[1] == "Infused Kinetic Rune")
        runelvl = 2
    if (rune[1] == "Infused Fire Rune")
        runelvl = 2
    if (rune[1] == "Infused Shadow Rune")
        runelvl = 2
    if (rune[1] == "Infused Arcane Rune")
        runelvl = 2
    if (rune[1] == "Infused Holy Rune")
        runelvl = 2
    if (rune[1] == "Basic Elemental Rune")
        runelvl = 1

var badgelvl = '';
    if (badge[1] == "Badge of Absolution")
        badgelvl = 26
    if (badge[1] == "Badge Level 25")
        badgelvl = 25
    if (badge[1] == "Badge Level 24")
        badgelvl = 24
    if (badge[1] == "Badge Level 23")
        badgelvl = 23
    if (badge[1] == "Badge Level 22")
        badgelvl = 22
    if (badge[1] == "Badge Level 21")
        badgelvl = 21
    if (badge[1] == "Badge Level 20")
        badgelvl = 20
    if (badge[1] == "Badge Level 19")
        badgelvl = 19
    if (badge[1] == "Badge Level 18")
        badgelvl = 18
    if (badge[1] == "Badge Level 17")
        badgelvl = 17
    if (badge[1] == "Badge Level 16")
        badgelvl = 16
    if (badge[1] == "Badge Level 15")
        badgelvl = 15
    if (badge[1] == "Badge Level 14")
        badgelvl = 14
    if (badge[1] == "Badge Level 13")
        badgelvl = 13
    if (badge[1] == "Badge Level 12")
        badgelvl = 12
    if (badge[1] == "Badge Level 11")
        badgelvl = 11
    if (badge[1] == "Badge Level 10")
        badgelvl = 10
    if (badge[1] == "Badge Level 9")
        badgelvl = 9
    if (badge[1] == "Badge Level 8")
        badgelvl = 8
    if (badge[1] == "Badge Level 7")
        badgelvl = 7
    if (badge[1] == "Badge Level 6")
        badgelvl = 6
    if (badge[1] == "Badge Level 5")
        badgelvl = 5
    if (badge[1] == "Badge Level 4")
        badgelvl = 4
    if (badge[1] == "Badge Level 3")
        badgelvl = 3
    if (badge[1] == "Badge Level 1")
        badgelvl = 2
    if (badge[1] == "Badge Level 2")
        badgelvl = 1

var gemlvl = '';
    if (gem[1] == "Claw of Chaos")
    gemlvl = 42
    if (gem[1] == "Embedded Chaos Gem")
    gemlvl = 41
    if (gem[1] == "Flawless Chaos Gem 8")
    gemlvl = 40
    if (gem[1] == "Flawless Chaos Gem 7")
    gemlvl = 39
    if (gem[1] == "Flawless Chaos Gem 6")
    gemlvl = 38
    if (gem[1] == "Flawless Chaos Gem 5")
    gemlvl = 37
    if (gem[1] == "Flawless Chaos Gem 4")
    gemlvl = 36
    if (gem[1] == "Flawless Chaos Gem 3")
    gemlvl = 35
    if (gem[1] == "Flawless Chaos Gem 2")
    gemlvl = 34
    if (gem[1] == "Flawless Chaos Gem 1")
    gemlvl = 33
    if (gem[1] == "Lucid Chaos Gem 8")
    gemlvl = 32
    if (gem[1] == "Lucid Chaos Gem 7")
    gemlvl = 31
    if (gem[1] == "Lucid Chaos Gem 6")
    gemlvl = 30
    if (gem[1] == "Lucid Chaos Gem 5")
    gemlvl = 29
    if (gem[1] == "Lucid Chaos Gem 4")
    gemlvl = 28
    if (gem[1] == "Lucid Chaos Gem 3")
    gemlvl = 27
    if (gem[1] == "Lucid Chaos Gem 2")
    gemlvl = 26
    if (gem[1] == "Lucid Chaos Gem 1")
    gemlvl = 25
    if (gem[1] == "Smooth Chaos Gem 8")
    gemlvl = 24
    if (gem[1] == "Smooth Chaos Gem 7")
    gemlvl = 23
    if (gem[1] == "Smooth Chaos Gem 6")
    gemlvl = 22
    if (gem[1] == "Smooth Chaos Gem 5")
    gemlvl = 21
    if (gem[1] == "Smooth Chaos Gem 4")
    gemlvl = 20
    if (gem[1] == "Smooth Chaos Gem 3")
    gemlvl = 19
    if (gem[1] == "Smooth Chaos Gem 2")
    gemlvl = 18
    if (gem[1] == "Smooth Chaos Gem 1")
    gemlvl = 17
    if (gem[1] == "Meager Chaos Gem 8")
    gemlvl = 16
    if (gem[1] == "Meager Chaos Gem 7")
    gemlvl = 15
    if (gem[1] == "Meager Chaos Gem 6")
    gemlvl = 14
    if (gem[1] == "Meager Chaos Gem 5")
    gemlvl = 13
    if (gem[1] == "Meager Chaos Gem 4")
    gemlvl = 12
    if (gem[1] == "Meager Chaos Gem 3")
    gemlvl = 11
    if (gem[1] == "Meager Chaos Gem 2")
    gemlvl = 10
    if (gem[1] == "Meager Chaos Gem 1")
    gemlvl = 9
    if (gem[1] == "Paltry Chaos Gem 8")
    gemlvl = 8
    if (gem[1] == "Paltry Chaos Gem 7")
    gemlvl = 7
    if (gem[1] == "Paltry Chaos Gem 6")
    gemlvl = 6
    if (gem[1] == "Paltry Chaos Gem 5")
    gemlvl = 5
    if (gem[1] == "Paltry Chaos Gem 4")
    gemlvl = 4
    if (gem[1] == "Paltry Chaos Gem 3")
    gemlvl = 3
    if (gem[1] == "Paltry Chaos Gem 2")
    gemlvl = 2
    if (gem[1] == "Paltry Chaos Gem 1")
    gemlvl = 1

// item fetch: core

var coreLink = core.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+coreLink[1])
   .then(response => response.text())
   .then((response) => {

var coreName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var core1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var coreHoly = ''; if (core1 == null) coreHoly = 0; if (core1 != null) coreHoly = parseInt(core1[1].replace(",",""))
var core2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var coreArcane = ''; if (core2 == null) coreArcane = 0; if (core2 != null) coreArcane = parseInt(core2[1].replace(",",""))
var core3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var coreShadow = ''; if (core3 == null) coreShadow = 0; if (core3 != null) coreShadow = parseInt(core3[1].replace(",",""))
var core4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var coreFire = ''; if (core4 == null) coreFire = 0; if (core4 != null) coreFire = parseInt(core4[1].replace(",",""))
var core5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var coreKinetic = ''; if (core5 == null) coreKinetic = 0; if (core5 != null) coreKinetic = parseInt(core5[1].replace(",",""))
var core6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var coreChaos = ''; if (core6 == null) coreChaos = 0; if (core6 != null) coreChaos = parseInt(core6[1].replace(",",""))

var core7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        core7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        core7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        core7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        core7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreHP = parseInt(core7[0])
    if (core7[3] != undefined) coreHP += parseInt(core7[3])

var core8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        core8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        core8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        core8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        core8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreATK = parseInt(core8[0])
    if (core8[3] != undefined) coreATK += parseInt(core8[3])

var core9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var coreHolyR = ''; if (core9 == null) coreHolyR = 0; if (core9 != null) coreHolyR = parseInt(core9[1])
var core10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var coreArcaneR = ''; if (core10 == null) coreArcaneR = 0; if (core10 != null) coreArcaneR = parseInt(core10[1])
var core11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var coreShadowR = ''; if (core11 == null) coreShadowR = 0; if (core11 != null) coreShadowR = parseInt(core11[1])
var core12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var coreFireR = ''; if (core12 == null) coreFireR = 0; if (core12 != null) coreFireR = parseInt(core12[1])
var core13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var coreKineticR = ''; if (core13 == null) coreKineticR = 0; if (core13 != null) coreKineticR = parseInt(core13[1])

var core14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        core14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        core14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        core14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        core14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreMR = parseInt(core14[0])
    if (core14[3] != undefined) coreMR += parseInt(core14[3])

var coreGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        coreGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        coreGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        coreGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        coreGems += 1

var core15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        core15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        core15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var coreAugs = 0;
    if (core15[0] != undefined)
        coreAugs += 1
    if (core15[1] != undefined)
        coreAugs += 1
    if (core15[2] != undefined)
        coreAugs += 1
    if (core15[3] != undefined)
        coreAugs += 1
    if (core15[4] != undefined)
        coreAugs += 1

var core16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        core16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        core16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        core16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        core16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreRamp = parseInt(core16[0])
    if (core16[3] != undefined) coreRamp += parseInt(core16[3])

var core17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        core17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        core17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        core17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        core17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreCrit = parseInt(core17[0])
    if (core17[3] != undefined) coreCrit += parseInt(core17[3])

var core18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        core18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        core18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        core18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        core18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreBlock = parseInt(core8[0])
    if (core18[3] != undefined) coreBlock += parseInt(core18[3])

var core19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        core19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        core19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        core19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        core19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreEBlock = parseInt(core19[0])
    if (core19[3] != undefined) coreEBlock += parseInt(core19[3])

var core20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        core20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        core20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        core20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        core20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreRPT = parseInt(core20[0])
    if (core20[3] != undefined) coreRPT += parseInt(core20[3])

var core21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        core21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        core21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        core21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        core21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var coreEPT = parseInt(core21[0])
    if (core21[3] != undefined) coreEPT += parseInt(core21[3])

var core22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        core22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        core22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        core22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        core22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var coreVile = parseInt(core22[0])
    if (core22[3] != undefined) coreVile += parseInt(core22[3])

// item fetch: head

var headLink = head.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+headLink[1])
   .then(response => response.text())
   .then((response) => {

var headName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var head1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var headHoly = ''; if (head1 == null) headHoly = 0; if (head1 != null) headHoly = parseInt(head1[1].replace(",",""))
var head2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var headArcane = ''; if (head2 == null) headArcane = 0; if (head2 != null) headArcane = parseInt(head2[1].replace(",",""))
var head3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var headShadow = ''; if (head3 == null) headShadow = 0; if (head3 != null) headShadow = parseInt(head3[1].replace(",",""))
var head4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var headFire = ''; if (head4 == null) headFire = 0; if (head4 != null) headFire = parseInt(head4[1].replace(",",""))
var head5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var headKinetic = ''; if (head5 == null) headKinetic = 0; if (head5 != null) headKinetic = parseInt(head5[1].replace(",",""))
var head6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var headChaos = ''; if (head6 == null) headChaos = 0; if (head6 != null) headChaos = parseInt(head6[1].replace(",",""))

var head7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        head7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        head7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        head7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        head7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headHP = parseInt(head7[0])
    if (head7[3] != undefined) headHP += parseInt(head7[3])

var head8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        head8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        head8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        head8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        head8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headATK = parseInt(head8[0])
    if (head8[3] != undefined) headATK += parseInt(head8[3])

var head9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var headHolyR = ''; if (head9 == null) headHolyR = 0; if (head9 != null) headHolyR = parseInt(head9[1])
var head10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var headArcaneR = ''; if (head10 == null) headArcaneR = 0; if (head10 != null) headArcaneR = parseInt(head10[1])
var head11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var headShadowR = ''; if (head11 == null) headShadowR = 0; if (head11 != null) headShadowR = parseInt(head11[1])
var head12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var headFireR = ''; if (head12 == null) headFireR = 0; if (head12 != null) headFireR = parseInt(head12[1])
var head13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var headKineticR = ''; if (head13 == null) headKineticR = 0; if (head13 != null) headKineticR = parseInt(head13[1])

var head14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        head14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        head14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        head14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        head14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headMR = parseInt(head14[0])
    if (head14[3] != undefined) headMR += parseInt(head14[3])

var headGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        headGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        headGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        headGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        headGems += 1

var head15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        head15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        head15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var headAugs = 0;
    if (head15[0] != undefined)
        headAugs += 1
    if (head15[1] != undefined)
        headAugs += 1
    if (head15[2] != undefined)
        headAugs += 1
    if (head15[3] != undefined)
        headAugs += 1
    if (head15[4] != undefined)
        headAugs += 1

var head16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        head16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        head16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        head16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        head16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headRamp = parseInt(head16[0])
    if (head16[3] != undefined) headRamp += parseInt(head16[3])

var head17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        head17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        head17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        head17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        head17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headCrit = parseInt(head17[0])
    if (head17[3] != undefined) headCrit += parseInt(head17[3])

var head18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        head18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        head18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        head18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        head18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headBlock = parseInt(head8[0])
    if (head18[3] != undefined) headBlock += parseInt(head18[3])

var head19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        head19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        head19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        head19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        head19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headEBlock = parseInt(head19[0])
    if (head19[3] != undefined) headEBlock += parseInt(head19[3])

var head20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        head20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        head20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        head20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        head20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headRPT = parseInt(head20[0])
    if (head20[3] != undefined) headRPT += parseInt(head20[3])

var head21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        head21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        head21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        head21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        head21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var headEPT = parseInt(head21[0])
    if (head21[3] != undefined) headEPT += parseInt(head21[3])

var head22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        head22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        head22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        head22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        head22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var headVile = parseInt(head22[0])
    if (head22[3] != undefined) headVile += parseInt(head22[3])

// item fetch: neck

var neckLink = neck.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+neckLink[1])
   .then(response => response.text())
   .then((response) => {

var neckName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var neck1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var neckHoly = ''; if (neck1 == null) neckHoly = 0; if (neck1 != null) neckHoly = parseInt(neck1[1].replace(",",""))
var neck2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var neckArcane = ''; if (neck2 == null) neckArcane = 0; if (neck2 != null) neckArcane = parseInt(neck2[1].replace(",",""))
var neck3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var neckShadow = ''; if (neck3 == null) neckShadow = 0; if (neck3 != null) neckShadow = parseInt(neck3[1].replace(",",""))
var neck4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var neckFire = ''; if (neck4 == null) neckFire = 0; if (neck4 != null) neckFire = parseInt(neck4[1].replace(",",""))
var neck5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var neckKinetic = ''; if (neck5 == null) neckKinetic = 0; if (neck5 != null) neckKinetic = parseInt(neck5[1].replace(",",""))
var neck6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var neckChaos = ''; if (neck6 == null) neckChaos = 0; if (neck6 != null) neckChaos = parseInt(neck6[1].replace(",",""))

var neck7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        neck7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        neck7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        neck7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        neck7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckHP = parseInt(neck7[0])
    if (neck7[3] != undefined) neckHP += parseInt(neck7[3])

var neck8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        neck8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        neck8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        neck8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        neck8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckATK = parseInt(neck8[0])
    if (neck8[3] != undefined) neckATK += parseInt(neck8[3])

var neck9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var neckHolyR = ''; if (neck9 == null) neckHolyR = 0; if (neck9 != null) neckHolyR = parseInt(neck9[1])
var neck10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var neckArcaneR = ''; if (neck10 == null) neckArcaneR = 0; if (neck10 != null) neckArcaneR = parseInt(neck10[1])
var neck11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var neckShadowR = ''; if (neck11 == null) neckShadowR = 0; if (neck11 != null) neckShadowR = parseInt(neck11[1])
var neck12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var neckFireR = ''; if (neck12 == null) neckFireR = 0; if (neck12 != null) neckFireR = parseInt(neck12[1])
var neck13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var neckKineticR = ''; if (neck13 == null) neckKineticR = 0; if (neck13 != null) neckKineticR = parseInt(neck13[1])

var neck14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        neck14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        neck14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        neck14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        neck14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckMR = parseInt(neck14[0])
    if (neck14[3] != undefined) neckMR += parseInt(neck14[3])

var neckGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        neckGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        neckGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        neckGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        neckGems += 1

var neck15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        neck15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        neck15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var neckAugs = 0;
    if (neck15[0] != undefined)
        neckAugs += 1
    if (neck15[1] != undefined)
        neckAugs += 1
    if (neck15[2] != undefined)
        neckAugs += 1
    if (neck15[3] != undefined)
        neckAugs += 1
    if (neck15[4] != undefined)
        neckAugs += 1

var neck16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        neck16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        neck16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        neck16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        neck16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckRamp = parseInt(neck16[0])
    if (neck16[3] != undefined) neckRamp += parseInt(neck16[3])

var neck17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        neck17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        neck17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        neck17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        neck17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckCrit = parseInt(neck17[0])
    if (neck17[3] != undefined) neckCrit += parseInt(neck17[3])

var neck18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        neck18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        neck18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        neck18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        neck18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckBlock = parseInt(neck8[0])
    if (neck18[3] != undefined) neckBlock += parseInt(neck18[3])

var neck19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        neck19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        neck19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        neck19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        neck19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckEBlock = parseInt(neck19[0])
    if (neck19[3] != undefined) neckEBlock += parseInt(neck19[3])

var neck20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        neck20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        neck20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        neck20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        neck20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckRPT = parseInt(neck20[0])
    if (neck20[3] != undefined) neckRPT += parseInt(neck20[3])

var neck21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        neck21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        neck21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        neck21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        neck21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var neckEPT = parseInt(neck21[0])
    if (neck21[3] != undefined) neckEPT += parseInt(neck21[3])

var neck22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        neck22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        neck22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        neck22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        neck22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var neckVile = parseInt(neck22[0])
    if (neck22[3] != undefined) neckVile += parseInt(neck22[3])

// item fetch: weapon

var weaponLink = weapon.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+weaponLink[1])
   .then(response => response.text())
   .then((response) => {

var weaponName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var weapon1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var weaponHoly = ''; if (weapon1 == null) weaponHoly = 0; if (weapon1 != null) weaponHoly = parseInt(weapon1[1].replace(",",""))
var weapon2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var weaponArcane = ''; if (weapon2 == null) weaponArcane = 0; if (weapon2 != null) weaponArcane = parseInt(weapon2[1].replace(",",""))
var weapon3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var weaponShadow = ''; if (weapon3 == null) weaponShadow = 0; if (weapon3 != null) weaponShadow = parseInt(weapon3[1].replace(",",""))
var weapon4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var weaponFire = ''; if (weapon4 == null) weaponFire = 0; if (weapon4 != null) weaponFire = parseInt(weapon4[1].replace(",",""))
var weapon5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var weaponKinetic = ''; if (weapon5 == null) weaponKinetic = 0; if (weapon5 != null) weaponKinetic = parseInt(weapon5[1].replace(",",""))
var weapon6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var weaponChaos = ''; if (weapon6 == null) weaponChaos = 0; if (weapon6 != null) weaponChaos = parseInt(weapon6[1].replace(",",""))

var weapon7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        weapon7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        weapon7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        weapon7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        weapon7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponHP = parseInt(weapon7[0])
    if (weapon7[3] != undefined) weaponHP += parseInt(weapon7[3])

var weapon8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        weapon8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        weapon8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        weapon8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        weapon8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponATK = parseInt(weapon8[0])
    if (weapon8[3] != undefined) weaponATK += parseInt(weapon8[3])

var weapon9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var weaponHolyR = ''; if (weapon9 == null) weaponHolyR = 0; if (weapon9 != null) weaponHolyR = parseInt(weapon9[1])
var weapon10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var weaponArcaneR = ''; if (weapon10 == null) weaponArcaneR = 0; if (weapon10 != null) weaponArcaneR = parseInt(weapon10[1])
var weapon11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var weaponShadowR = ''; if (weapon11 == null) weaponShadowR = 0; if (weapon11 != null) weaponShadowR = parseInt(weapon11[1])
var weapon12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var weaponFireR = ''; if (weapon12 == null) weaponFireR = 0; if (weapon12 != null) weaponFireR = parseInt(weapon12[1])
var weapon13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var weaponKineticR = ''; if (weapon13 == null) weaponKineticR = 0; if (weapon13 != null) weaponKineticR = parseInt(weapon13[1])

var weapon14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        weapon14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        weapon14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        weapon14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        weapon14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponMR = parseInt(weapon14[0])
    if (weapon14[3] != undefined) weaponMR += parseInt(weapon14[3])

var weaponGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        weaponGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        weaponGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        weaponGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        weaponGems += 1

var weapon15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        weapon15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        weapon15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var weaponAugs = 0;
    if (weapon15[0] != undefined)
        weaponAugs += 1
    if (weapon15[1] != undefined)
        weaponAugs += 1
    if (weapon15[2] != undefined)
        weaponAugs += 1
    if (weapon15[3] != undefined)
        weaponAugs += 1
    if (weapon15[4] != undefined)
        weaponAugs += 1

var weapon16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        weapon16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        weapon16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        weapon16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        weapon16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponRamp = parseInt(weapon16[0])
    if (weapon16[3] != undefined) weaponRamp += parseInt(weapon16[3])

var weapon17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        weapon17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        weapon17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        weapon17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        weapon17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponCrit = parseInt(weapon17[0])
    if (weapon17[3] != undefined) weaponCrit += parseInt(weapon17[3])

var weapon18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        weapon18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        weapon18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        weapon18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        weapon18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponBlock = parseInt(weapon8[0])
    if (weapon18[3] != undefined) weaponBlock += parseInt(weapon18[3])

var weapon19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        weapon19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        weapon19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        weapon19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        weapon19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponEBlock = parseInt(weapon19[0])
    if (weapon19[3] != undefined) weaponEBlock += parseInt(weapon19[3])

var weapon20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        weapon20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        weapon20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        weapon20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        weapon20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponRPT = parseInt(weapon20[0])
    if (weapon20[3] != undefined) weaponRPT += parseInt(weapon20[3])

var weapon21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        weapon21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        weapon21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        weapon21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        weapon21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var weaponEPT = parseInt(weapon21[0])
    if (weapon21[3] != undefined) weaponEPT += parseInt(weapon21[3])

var weapon22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        weapon22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        weapon22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        weapon22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        weapon22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var weaponVile = parseInt(weapon22[0])
    if (weapon22[3] != undefined) weaponVile += parseInt(weapon22[3])

// item fetch: body

var bodyLink = body.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+bodyLink[1])
   .then(response => response.text())
   .then((response) => {

var bodyName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var body1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var bodyHoly = ''; if (body1 == null) bodyHoly = 0; if (body1 != null) bodyHoly = parseInt(body1[1].replace(",",""))
var body2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var bodyArcane = ''; if (body2 == null) bodyArcane = 0; if (body2 != null) bodyArcane = parseInt(body2[1].replace(",",""))
var body3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var bodyShadow = ''; if (body3 == null) bodyShadow = 0; if (body3 != null) bodyShadow = parseInt(body3[1].replace(",",""))
var body4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var bodyFire = ''; if (body4 == null) bodyFire = 0; if (body4 != null) bodyFire = parseInt(body4[1].replace(",",""))
var body5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var bodyKinetic = ''; if (body5 == null) bodyKinetic = 0; if (body5 != null) bodyKinetic = parseInt(body5[1].replace(",",""))
var body6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var bodyChaos = ''; if (body6 == null) bodyChaos = 0; if (body6 != null) bodyChaos = parseInt(body6[1].replace(",",""))

var body7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        body7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        body7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        body7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        body7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyHP = parseInt(body7[0])
    if (body7[3] != undefined) bodyHP += parseInt(body7[3])

var body8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        body8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        body8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        body8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        body8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyATK = parseInt(body8[0])
    if (body8[3] != undefined) bodyATK += parseInt(body8[3])

var body9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var bodyHolyR = ''; if (body9 == null) bodyHolyR = 0; if (body9 != null) bodyHolyR = parseInt(body9[1])
var body10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var bodyArcaneR = ''; if (body10 == null) bodyArcaneR = 0; if (body10 != null) bodyArcaneR = parseInt(body10[1])
var body11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var bodyShadowR = ''; if (body11 == null) bodyShadowR = 0; if (body11 != null) bodyShadowR = parseInt(body11[1])
var body12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var bodyFireR = ''; if (body12 == null) bodyFireR = 0; if (body12 != null) bodyFireR = parseInt(body12[1])
var body13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var bodyKineticR = ''; if (body13 == null) bodyKineticR = 0; if (body13 != null) bodyKineticR = parseInt(body13[1])

var body14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        body14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        body14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        body14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        body14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyMR = parseInt(body14[0])
    if (body14[3] != undefined) bodyMR += parseInt(body14[3])

var bodyGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        bodyGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        bodyGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        bodyGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        bodyGems += 1

var body15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        body15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        body15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var bodyAugs = 0;
    if (body15[0] != undefined)
        bodyAugs += 1
    if (body15[1] != undefined)
        bodyAugs += 1
    if (body15[2] != undefined)
        bodyAugs += 1
    if (body15[3] != undefined)
        bodyAugs += 1
    if (body15[4] != undefined)
        bodyAugs += 1

var body16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        body16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        body16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        body16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        body16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyRamp = parseInt(body16[0])
    if (body16[3] != undefined) bodyRamp += parseInt(body16[3])

var body17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        body17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        body17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        body17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        body17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyCrit = parseInt(body17[0])
    if (body17[3] != undefined) bodyCrit += parseInt(body17[3])

var body18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        body18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        body18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        body18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        body18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyBlock = parseInt(body8[0])
    if (body18[3] != undefined) bodyBlock += parseInt(body18[3])

var body19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        body19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        body19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        body19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        body19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyEBlock = parseInt(body19[0])
    if (body19[3] != undefined) bodyEBlock += parseInt(body19[3])

var body20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        body20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        body20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        body20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        body20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyRPT = parseInt(body20[0])
    if (body20[3] != undefined) bodyRPT += parseInt(body20[3])

var body21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        body21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        body21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        body21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        body21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var bodyEPT = parseInt(body21[0])
    if (body21[3] != undefined) bodyEPT += parseInt(body21[3])

var body22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        body22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        body22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        body22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        body22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var bodyVile = parseInt(body22[0])
    if (body22[3] != undefined) bodyVile += parseInt(body22[3])

// item fetch: shield

var shieldLink = shield.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+shieldLink[1])
   .then(response => response.text())
   .then((response) => {

var shieldName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var shield1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var shieldHoly = ''; if (shield1 == null) shieldHoly = 0; if (shield1 != null) shieldHoly = parseInt(shield1[1].replace(",",""))
var shield2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var shieldArcane = ''; if (shield2 == null) shieldArcane = 0; if (shield2 != null) shieldArcane = parseInt(shield2[1].replace(",",""))
var shield3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var shieldShadow = ''; if (shield3 == null) shieldShadow = 0; if (shield3 != null) shieldShadow = parseInt(shield3[1].replace(",",""))
var shield4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var shieldFire = ''; if (shield4 == null) shieldFire = 0; if (shield4 != null) shieldFire = parseInt(shield4[1].replace(",",""))
var shield5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var shieldKinetic = ''; if (shield5 == null) shieldKinetic = 0; if (shield5 != null) shieldKinetic = parseInt(shield5[1].replace(",",""))
var shield6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var shieldChaos = ''; if (shield6 == null) shieldChaos = 0; if (shield6 != null) shieldChaos = parseInt(shield6[1].replace(",",""))

var shield7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        shield7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        shield7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        shield7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        shield7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldHP = parseInt(shield7[0])
    if (shield7[3] != undefined) shieldHP += parseInt(shield7[3])

var shield8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        shield8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        shield8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        shield8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        shield8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldATK = parseInt(shield8[0])
    if (shield8[3] != undefined) shieldATK += parseInt(shield8[3])

var shield9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var shieldHolyR = ''; if (shield9 == null) shieldHolyR = 0; if (shield9 != null) shieldHolyR = parseInt(shield9[1])
var shield10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var shieldArcaneR = ''; if (shield10 == null) shieldArcaneR = 0; if (shield10 != null) shieldArcaneR = parseInt(shield10[1])
var shield11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var shieldShadowR = ''; if (shield11 == null) shieldShadowR = 0; if (shield11 != null) shieldShadowR = parseInt(shield11[1])
var shield12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var shieldFireR = ''; if (shield12 == null) shieldFireR = 0; if (shield12 != null) shieldFireR = parseInt(shield12[1])
var shield13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var shieldKineticR = ''; if (shield13 == null) shieldKineticR = 0; if (shield13 != null) shieldKineticR = parseInt(shield13[1])

var shield14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        shield14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        shield14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        shield14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        shield14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldMR = parseInt(shield14[0])
    if (shield14[3] != undefined) shieldMR += parseInt(shield14[3])

var shieldGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        shieldGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        shieldGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        shieldGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        shieldGems += 1

var shield15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        shield15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        shield15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var shieldAugs = 0;
    if (shield15[0] != undefined)
        shieldAugs += 1
    if (shield15[1] != undefined)
        shieldAugs += 1
    if (shield15[2] != undefined)
        shieldAugs += 1
    if (shield15[3] != undefined)
        shieldAugs += 1
    if (shield15[4] != undefined)
        shieldAugs += 1

var shield16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        shield16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        shield16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        shield16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        shield16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldRamp = parseInt(shield16[0])
    if (shield16[3] != undefined) shieldRamp += parseInt(shield16[3])

var shield17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        shield17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        shield17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        shield17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        shield17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldCrit = parseInt(shield17[0])
    if (shield17[3] != undefined) shieldCrit += parseInt(shield17[3])

var shield18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        shield18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        shield18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        shield18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        shield18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldBlock = parseInt(shield8[0])
    if (shield18[3] != undefined) shieldBlock += parseInt(shield18[3])

var shield19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        shield19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        shield19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        shield19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        shield19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldEBlock = parseInt(shield19[0])
    if (shield19[3] != undefined) shieldEBlock += parseInt(shield19[3])

var shield20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        shield20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        shield20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        shield20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        shield20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldRPT = parseInt(shield20[0])
    if (shield20[3] != undefined) shieldRPT += parseInt(shield20[3])

var shield21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        shield21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        shield21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        shield21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        shield21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var shieldEPT = parseInt(shield21[0])
    if (shield21[3] != undefined) shieldEPT += parseInt(shield21[3])

var shield22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        shield22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        shield22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        shield22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        shield22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var shieldVile = parseInt(shield22[0])
    if (shield22[3] != undefined) shieldVile += parseInt(shield22[3])

// item fetch: belt

var beltLink = belt.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+beltLink[1])
   .then(response => response.text())
   .then((response) => {

var beltName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var belt1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var beltHoly = ''; if (belt1 == null) beltHoly = 0; if (belt1 != null) beltHoly = parseInt(belt1[1].replace(",",""))
var belt2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var beltArcane = ''; if (belt2 == null) beltArcane = 0; if (belt2 != null) beltArcane = parseInt(belt2[1].replace(",",""))
var belt3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var beltShadow = ''; if (belt3 == null) beltShadow = 0; if (belt3 != null) beltShadow = parseInt(belt3[1].replace(",",""))
var belt4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var beltFire = ''; if (belt4 == null) beltFire = 0; if (belt4 != null) beltFire = parseInt(belt4[1].replace(",",""))
var belt5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var beltKinetic = ''; if (belt5 == null) beltKinetic = 0; if (belt5 != null) beltKinetic = parseInt(belt5[1].replace(",",""))
var belt6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var beltChaos = ''; if (belt6 == null) beltChaos = 0; if (belt6 != null) beltChaos = parseInt(belt6[1].replace(",",""))

var belt7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        belt7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        belt7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        belt7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        belt7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltHP = parseInt(belt7[0])
    if (belt7[3] != undefined) beltHP += parseInt(belt7[3])

var belt8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        belt8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        belt8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        belt8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        belt8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltATK = parseInt(belt8[0])
    if (belt8[3] != undefined) beltATK += parseInt(belt8[3])

var belt9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var beltHolyR = ''; if (belt9 == null) beltHolyR = 0; if (belt9 != null) beltHolyR = parseInt(belt9[1])
var belt10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var beltArcaneR = ''; if (belt10 == null) beltArcaneR = 0; if (belt10 != null) beltArcaneR = parseInt(belt10[1])
var belt11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var beltShadowR = ''; if (belt11 == null) beltShadowR = 0; if (belt11 != null) beltShadowR = parseInt(belt11[1])
var belt12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var beltFireR = ''; if (belt12 == null) beltFireR = 0; if (belt12 != null) beltFireR = parseInt(belt12[1])
var belt13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var beltKineticR = ''; if (belt13 == null) beltKineticR = 0; if (belt13 != null) beltKineticR = parseInt(belt13[1])

var belt14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        belt14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        belt14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        belt14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        belt14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltMR = parseInt(belt14[0])
    if (belt14[3] != undefined) beltMR += parseInt(belt14[3])

var beltGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        beltGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        beltGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        beltGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        beltGems += 1

var belt15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        belt15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        belt15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var beltAugs = 0;
    if (belt15[0] != undefined)
        beltAugs += 1
    if (belt15[1] != undefined)
        beltAugs += 1
    if (belt15[2] != undefined)
        beltAugs += 1
    if (belt15[3] != undefined)
        beltAugs += 1
    if (belt15[4] != undefined)
        beltAugs += 1

var belt16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        belt16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        belt16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        belt16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        belt16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltRamp = parseInt(belt16[0])
    if (belt16[3] != undefined) beltRamp += parseInt(belt16[3])

var belt17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        belt17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        belt17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        belt17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        belt17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltCrit = parseInt(belt17[0])
    if (belt17[3] != undefined) beltCrit += parseInt(belt17[3])

var belt18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        belt18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        belt18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        belt18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        belt18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltBlock = parseInt(belt8[0])
    if (belt18[3] != undefined) beltBlock += parseInt(belt18[3])

var belt19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        belt19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        belt19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        belt19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        belt19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltEBlock = parseInt(belt19[0])
    if (belt19[3] != undefined) beltEBlock += parseInt(belt19[3])

var belt20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        belt20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        belt20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        belt20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        belt20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltRPT = parseInt(belt20[0])
    if (belt20[3] != undefined) beltRPT += parseInt(belt20[3])

var belt21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        belt21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        belt21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        belt21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        belt21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var beltEPT = parseInt(belt21[0])
    if (belt21[3] != undefined) beltEPT += parseInt(belt21[3])

var belt22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        belt22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        belt22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        belt22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        belt22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var beltVile = parseInt(belt22[0])
    if (belt22[3] != undefined) beltVile += parseInt(belt22[3])

// item fetch: pants

var pantsLink = pants.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+pantsLink[1])
   .then(response => response.text())
   .then((response) => {

var pantsName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var pants1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var pantsHoly = ''; if (pants1 == null) pantsHoly = 0; if (pants1 != null) pantsHoly = parseInt(pants1[1].replace(",",""))
var pants2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var pantsArcane = ''; if (pants2 == null) pantsArcane = 0; if (pants2 != null) pantsArcane = parseInt(pants2[1].replace(",",""))
var pants3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var pantsShadow = ''; if (pants3 == null) pantsShadow = 0; if (pants3 != null) pantsShadow = parseInt(pants3[1].replace(",",""))
var pants4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var pantsFire = ''; if (pants4 == null) pantsFire = 0; if (pants4 != null) pantsFire = parseInt(pants4[1].replace(",",""))
var pants5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var pantsKinetic = ''; if (pants5 == null) pantsKinetic = 0; if (pants5 != null) pantsKinetic = parseInt(pants5[1].replace(",",""))
var pants6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var pantsChaos = ''; if (pants6 == null) pantsChaos = 0; if (pants6 != null) pantsChaos = parseInt(pants6[1].replace(",",""))

var pants7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        pants7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        pants7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        pants7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        pants7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsHP = parseInt(pants7[0])
    if (pants7[3] != undefined) pantsHP += parseInt(pants7[3])

var pants8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        pants8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        pants8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        pants8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        pants8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsATK = parseInt(pants8[0])
    if (pants8[3] != undefined) pantsATK += parseInt(pants8[3])

var pants9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var pantsHolyR = ''; if (pants9 == null) pantsHolyR = 0; if (pants9 != null) pantsHolyR = parseInt(pants9[1])
var pants10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var pantsArcaneR = ''; if (pants10 == null) pantsArcaneR = 0; if (pants10 != null) pantsArcaneR = parseInt(pants10[1])
var pants11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var pantsShadowR = ''; if (pants11 == null) pantsShadowR = 0; if (pants11 != null) pantsShadowR = parseInt(pants11[1])
var pants12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var pantsFireR = ''; if (pants12 == null) pantsFireR = 0; if (pants12 != null) pantsFireR = parseInt(pants12[1])
var pants13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var pantsKineticR = ''; if (pants13 == null) pantsKineticR = 0; if (pants13 != null) pantsKineticR = parseInt(pants13[1])

var pants14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        pants14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        pants14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        pants14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        pants14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsMR = parseInt(pants14[0])
    if (pants14[3] != undefined) pantsMR += parseInt(pants14[3])

var pantsGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        pantsGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        pantsGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        pantsGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        pantsGems += 1

var pants15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        pants15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        pants15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var pantsAugs = 0;
    if (pants15[0] != undefined)
        pantsAugs += 1
    if (pants15[1] != undefined)
        pantsAugs += 1
    if (pants15[2] != undefined)
        pantsAugs += 1
    if (pants15[3] != undefined)
        pantsAugs += 1
    if (pants15[4] != undefined)
        pantsAugs += 1

var pants16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        pants16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        pants16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        pants16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        pants16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsRamp = parseInt(pants16[0])
    if (pants16[3] != undefined) pantsRamp += parseInt(pants16[3])

var pants17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        pants17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        pants17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        pants17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        pants17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsCrit = parseInt(pants17[0])
    if (pants17[3] != undefined) pantsCrit += parseInt(pants17[3])

var pants18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        pants18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        pants18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        pants18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        pants18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsBlock = parseInt(pants8[0])
    if (pants18[3] != undefined) pantsBlock += parseInt(pants18[3])

var pants19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        pants19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        pants19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        pants19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        pants19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsEBlock = parseInt(pants19[0])
    if (pants19[3] != undefined) pantsEBlock += parseInt(pants19[3])

var pants20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        pants20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        pants20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        pants20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        pants20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsRPT = parseInt(pants20[0])
    if (pants20[3] != undefined) pantsRPT += parseInt(pants20[3])

var pants21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        pants21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        pants21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        pants21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        pants21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var pantsEPT = parseInt(pants21[0])
    if (pants21[3] != undefined) pantsEPT += parseInt(pants21[3])

var pants22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        pants22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        pants22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        pants22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        pants22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var pantsVile = parseInt(pants22[0])
    if (pants22[3] != undefined) pantsVile += parseInt(pants22[3])

// item fetch: ring

var ringLink = ring.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+ringLink[1])
   .then(response => response.text())
   .then((response) => {

var ringName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var ring1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var ringHoly = ''; if (ring1 == null) ringHoly = 0; if (ring1 != null) ringHoly = parseInt(ring1[1].replace(",",""))
var ring2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var ringArcane = ''; if (ring2 == null) ringArcane = 0; if (ring2 != null) ringArcane = parseInt(ring2[1].replace(",",""))
var ring3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var ringShadow = ''; if (ring3 == null) ringShadow = 0; if (ring3 != null) ringShadow = parseInt(ring3[1].replace(",",""))
var ring4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var ringFire = ''; if (ring4 == null) ringFire = 0; if (ring4 != null) ringFire = parseInt(ring4[1].replace(",",""))
var ring5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var ringKinetic = ''; if (ring5 == null) ringKinetic = 0; if (ring5 != null) ringKinetic = parseInt(ring5[1].replace(",",""))
var ring6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var ringChaos = ''; if (ring6 == null) ringChaos = 0; if (ring6 != null) ringChaos = parseInt(ring6[1].replace(",",""))

var ring7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        ring7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        ring7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        ring7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        ring7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringHP = parseInt(ring7[0])
    if (ring7[3] != undefined) ringHP += parseInt(ring7[3])

var ring8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        ring8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        ring8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        ring8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        ring8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringATK = parseInt(ring8[0])
    if (ring8[3] != undefined) ringATK += parseInt(ring8[3])

var ring9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var ringHolyR = ''; if (ring9 == null) ringHolyR = 0; if (ring9 != null) ringHolyR = parseInt(ring9[1])
var ring10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var ringArcaneR = ''; if (ring10 == null) ringArcaneR = 0; if (ring10 != null) ringArcaneR = parseInt(ring10[1])
var ring11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var ringShadowR = ''; if (ring11 == null) ringShadowR = 0; if (ring11 != null) ringShadowR = parseInt(ring11[1])
var ring12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var ringFireR = ''; if (ring12 == null) ringFireR = 0; if (ring12 != null) ringFireR = parseInt(ring12[1])
var ring13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var ringKineticR = ''; if (ring13 == null) ringKineticR = 0; if (ring13 != null) ringKineticR = parseInt(ring13[1])

var ring14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        ring14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        ring14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        ring14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        ring14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringMR = parseInt(ring14[0])
    if (ring14[3] != undefined) ringMR += parseInt(ring14[3])

var ringGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        ringGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        ringGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        ringGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        ringGems += 1

var ring15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        ring15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        ring15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var ringAugs = 0;
    if (ring15[0] != undefined)
        ringAugs += 1
    if (ring15[1] != undefined)
        ringAugs += 1
    if (ring15[2] != undefined)
        ringAugs += 1
    if (ring15[3] != undefined)
        ringAugs += 1
    if (ring15[4] != undefined)
        ringAugs += 1

var ring16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        ring16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        ring16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        ring16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        ring16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringRamp = parseInt(ring16[0])
    if (ring16[3] != undefined) ringRamp += parseInt(ring16[3])

var ring17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        ring17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        ring17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        ring17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        ring17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringCrit = parseInt(ring17[0])
    if (ring17[3] != undefined) ringCrit += parseInt(ring17[3])

var ring18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        ring18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        ring18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        ring18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        ring18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringBlock = parseInt(ring8[0])
    if (ring18[3] != undefined) ringBlock += parseInt(ring18[3])

var ring19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        ring19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        ring19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        ring19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        ring19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringEBlock = parseInt(ring19[0])
    if (ring19[3] != undefined) ringEBlock += parseInt(ring19[3])

var ring20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        ring20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        ring20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        ring20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        ring20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringRPT = parseInt(ring20[0])
    if (ring20[3] != undefined) ringRPT += parseInt(ring20[3])

var ring21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        ring21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        ring21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        ring21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        ring21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var ringEPT = parseInt(ring21[0])
    if (ring21[3] != undefined) ringEPT += parseInt(ring21[3])

var ring22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        ring22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        ring22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        ring22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        ring22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var ringVile = parseInt(ring22[0])
    if (ring22[3] != undefined) ringVile += parseInt(ring22[3])

// item fetch: foot

var footLink = foot.match(/event,'(.*)'\)"/i)

fetch("item_rollover.php?id="+footLink[1])
   .then(response => response.text())
   .then((response) => {

var footName = response.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#.*" align="left">(.*)<\/td>/i)

var foot1 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Holy<\/span>/i)
var footHoly = ''; if (foot1 == null) footHoly = 0; if (foot1 != null) footHoly = parseInt(foot1[1].replace(",",""))
var foot2 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Arcane<\/span>/i)
var footArcane = ''; if (foot2 == null) footArcane = 0; if (foot2 != null) footArcane = parseInt(foot2[1].replace(",",""))
var foot3 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Shadow<\/span>/i)
var footShadow = ''; if (foot3 == null) footShadow = 0; if (foot3 != null) footShadow = parseInt(foot3[1].replace(",",""))
var foot4 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Fire<\/span>/i)
var footFire = ''; if (foot4 == null) footFire = 0; if (foot4 != null) footFire = parseInt(foot4[1].replace(",",""))
var foot5 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Kinetic<\/span>/i)
var footKinetic = ''; if (foot5 == null) footKinetic = 0; if (foot5 != null) footKinetic = parseInt(foot5[1].replace(",",""))
var foot6 = response.match(/&nbsp; \+(.*) <span style="color:#.*">Chaos<\/span>/i)
var footChaos = ''; if (foot6 == null) footChaos = 0; if (foot6 != null) footChaos = parseInt(foot6[1].replace(",",""))

var foot7 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i) != null)
        foot7 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ HP<br>/i) != null)
        foot7 = Array.from(response.match(/<br>\+[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i) != null)
        foot7 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> HP/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i) != null)
        foot7 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ HP<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footHP = parseInt(foot7[0])
    if (foot7[3] != undefined) footHP += parseInt(foot7[3])

var foot8 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK<br>/i) != null)
        foot8 = Array.from(response.match(/<br>\+([0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ ATK<br>/i) != null)
        foot8 = Array.from(response.match(/<br>\+([0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> ATK/i) != null)
        foot8 = Array.from(response.match(/\+([0-9]+,[0-9]+)<span style="color:#00FF00"> \(\+([0-9]+)\)<\/span> ATK/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ ATK<br>/i) != null)
        foot8 = Array.from(response.match(/<br>\+([0-9]+,[0-9]+) ATK<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footATK = parseInt(foot8[0])
    if (foot8[3] != undefined) footATK += parseInt(foot8[3])

var foot9 = response.match(/<br> &nbsp; \+([0-9]+) Holy Resist<br>/i)
var footHolyR = ''; if (foot9 == null) footHolyR = 0; if (foot9 != null) footHolyR = parseInt(foot9[1])
var foot10 = response.match(/&nbsp; \+([0-9]+) Arcane Resist/i)
var footArcaneR = ''; if (foot10 == null) footArcaneR = 0; if (foot10 != null) footArcaneR = parseInt(foot10[1])
var foot11 = response.match(/&nbsp; \+([0-9]+) Shadow Resist/i)
var footShadowR = ''; if (foot11 == null) footShadowR = 0; if (foot11 != null) footShadowR = parseInt(foot11[1])
var foot12 = response.match(/&nbsp; \+([0-9]+) Fire Resist/i)
var footFireR = ''; if (foot12 == null) footFireR = 0; if (foot12 != null) footFireR = parseInt(foot12[1])
var foot13 = response.match(/&nbsp; \+([0-9]+) Kinetic Resist/i)
var footKineticR = ''; if (foot13 == null) footKineticR = 0; if (foot13 != null) footKineticR = parseInt(foot13[1])

var foot14 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i) != null)
        foot14 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ max rage<br>/i) != null)
        foot14 = Array.from(response.match(/<br>\+[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i) != null)
        foot14 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> max rage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i) != null)
        foot14 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ max rage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footMR = parseInt(foot14[0])
    if (foot14[3] != undefined) footMR += parseInt(foot14[3])

var footGems = 0;
    if (response.match(/<img src="\/images\/gem_white2\.jpg">/i) != null)
        footGems += 1
    if (response.match(/<img src="\/images\/gem_red2\.jpg">/i) != null)
        footGems += 1
    if (response.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null)
        footGems += 1
    if (response.match(/<img src="\/images\/gem_green1\.jpg">/i) != null)
        footGems += 1

var foot15 = '';
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) == null)
        foot15 = 0
    if (response.match(/<img src="\/images\/augslot\.jpg">/i) != null)
        foot15 = (response.match(/<img src="\/images\/augslot\.jpg">/g))
var footAugs = 0;
    if (foot15[0] != undefined)
        footAugs += 1
    if (foot15[1] != undefined)
        footAugs += 1
    if (foot15[2] != undefined)
        footAugs += 1
    if (foot15[3] != undefined)
        footAugs += 1
    if (foot15[4] != undefined)
        footAugs += 1

var foot16 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i) != null)
        foot16 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% rampage<br>/i) != null)
        foot16 = Array.from(response.match(/<br>\+[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i) != null)
        foot16 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% rampage/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i) != null)
        foot16 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% rampage<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footRamp = parseInt(foot16[0])
    if (foot16[3] != undefined) footRamp += parseInt(foot16[3])

var foot17 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i) != null)
        foot17 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% critical hit<br>/i) != null)
        foot17 = Array.from(response.match(/<br>\+[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i) != null)
        foot17 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% critical hit/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i) != null)
        foot17 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% critical hit<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footCrit = parseInt(foot17[0])
    if (foot17[3] != undefined) footCrit += parseInt(foot17[3])

var foot18 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i) != null)
        foot18 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+% block<br>/i) != null)
        foot18 = Array.from(response.match(/\+[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i) != null)
        foot18 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+% block<br>/i) != null)
        foot18 = Array.from(response.match(/\+[0-9]+,[0-9]+% block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footBlock = parseInt(foot8[0])
    if (foot18[3] != undefined) footBlock += parseInt(foot18[3])

var foot19 = [0,0,0,0,0,0];
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i) != null)
        foot19 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+% elemental block<br>/i) != null)
        foot19 = Array.from(response.match(/<br>\+[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i) != null)
        foot19 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>% elemental block/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i) != null)
        foot19 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+% elemental block<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footEBlock = parseInt(foot19[0])
    if (foot19[3] != undefined) footEBlock += parseInt(foot19[3])

var foot20 = [0,0,0,0,0,0];
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i) != null)
        foot20 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ rage per hr<br>/i) != null)
        foot20 = Array.from(response.match(/\+[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i) != null)
        foot20 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> rage per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i) != null)
        foot20 = Array.from(response.match(/\+[0-9]+,[0-9]+ rage per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footRPT = parseInt(foot20[0])
    if (foot20[3] != undefined) footRPT += parseInt(foot20[3])

var foot21 = '';
    if (response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i) != null)
        foot21 = Array.from(response.match(/<br>\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+ exp per hr<br>/i) != null)
        foot21 = Array.from(response.match(/<br>\+[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i) != null)
        foot21 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> exp per hr/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i) != null)
        foot21 = Array.from(response.match(/<br>\+[0-9]+,[0-9]+ exp per hr<br>/i).toString().replace(",","").match(/[0-9]+/g))
    var footEPT = parseInt(foot21[0])
    if (foot21[3] != undefined) footEPT += parseInt(foot21[3])

var foot22 = '';
    if (response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i) != null)
        foot22 = Array.from(response.match(/\+[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+ vile energy<br>/i) != null)
        foot22 = Array.from(response.match(/\+[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i) != null)
        foot22 = Array.from(response.match(/\+[0-9]+,[0-9]+<span style="color:#00FF00"> \(\+[0-9]+\)<\/span> vile energy/i).toString().replace(",","").match(/[0-9]+/g))
    if (response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i) != null)
        foot22 = Array.from(response.match(/\+[0-9]+,[0-9]+ vile energy<br>/i).toString().replace(",","").match(/[0-9]+/g))

    var footVile = parseInt(foot22[0])
    if (foot22[3] != undefined) footVile += parseInt(foot22[3])

// create table

var menu = document.querySelector("#studiomoxxi > tbody > tr:nth-child("+rownum+")");

let td12 = document.createElement('td');
td12.innerHTML = name[1];
td12.setAttribute("class","name")
insertAfter(td12, menu.lastElementChild);

let td11 = document.createElement('td');
td11.innerHTML = parseInt((level[1]).replaceAll(",",""));
td11.setAttribute("class","account")
insertAfter(td11, menu.lastElementChild);

let td10 = document.createElement('td');
td10.innerHTML = parseInt((experience[1]).replaceAll(",",""));
td10.setAttribute("class","account")
insertAfter(td10, menu.lastElementChild);

let td15 = document.createElement('td');
td15.innerHTML = neededtolvl;
td15.setAttribute("class","account")
insertAfter(td15, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = parseInt((power[1]).replaceAll(",",""));
td3.setAttribute("class","account")
insertAfter(td3, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = parseInt((eledmg[1]).replaceAll(",",""));
td4.setAttribute("class","account")
insertAfter(td4, menu.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = parseInt((attack[1]).replaceAll(",",""));
td13.setAttribute("class","account")
insertAfter(td13, menu.lastElementChild);

let td14 = document.createElement('td');
td14.innerHTML = parseInt((hp[1]).replaceAll(",",""));
td14.setAttribute("class","account")
insertAfter(td14, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = parseInt((chaos[1]).replaceAll(",",""));
td8.setAttribute("class","account")
insertAfter(td8, menu.lastElementChild);

let td1 = document.createElement('td');
td1.innerHTML = core+head+neck+weapon+body+shield+belt+pants+ring+foot;
td1.setAttribute("class","account")
insertAfter(td1, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = badgelvl;
td6.setAttribute("class","account")
insertAfter(td6, menu.lastElementChild);

let td7 = document.createElement('td');
td7.innerHTML = gemlvl;
td7.setAttribute("class","account")
insertAfter(td7, menu.lastElementChild);

let td5 = document.createElement('td');
td5.innerHTML = orblvl;
td5.setAttribute("class","account")
insertAfter(td5, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = runelvl;
td2.setAttribute("class","account")
insertAfter(td2, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = wilderness[1];
td9.setAttribute("class","account")
insertAfter(td9, menu.lastElementChild);

let td16 = document.createElement('td');
td16.innerHTML = crestlvl;
td16.setAttribute("class","account")
insertAfter(td16, menu.lastElementChild);

let td171 = document.createElement('td');
td171.innerHTML = coreAugs+headAugs+neckAugs+weaponAugs+bodyAugs+shieldAugs+beltAugs+pantsAugs+ringAugs+footAugs
td171.setAttribute("class","account")
insertAfter(td171, menu.lastElementChild);

// core

let td20 = document.createElement('td');
td20.innerHTML = core;
td20.setAttribute("class","core")
insertAfter(td20, menu.lastElementChild);

let td25 = document.createElement('td');
td25.innerHTML = coreName[1];
td25.setAttribute("class","core")
insertAfter(td25, menu.lastElementChild);

let td17 = document.createElement('td');
td17.innerHTML = coreHoly+coreArcane+coreShadow+coreFire+coreKinetic;
td17.setAttribute("class","core")
insertAfter(td17, menu.lastElementChild);

let td23 = document.createElement('td');
td23.innerHTML = coreHolyR+coreArcaneR+coreShadowR+coreFireR+coreKineticR;
td23.setAttribute("class","core")
insertAfter(td23, menu.lastElementChild);

let td22 = document.createElement('td');
td22.innerHTML = coreATK;
td22.setAttribute("class","core")
insertAfter(td22, menu.lastElementChild);

let td28 = document.createElement('td');
td28.innerHTML = coreChaos;
td28.setAttribute("class","core")
insertAfter(td28, menu.lastElementChild);

let td35 = document.createElement('td');
td35.innerHTML = coreVile;
td35.setAttribute("class","core")
insertAfter(td35, menu.lastElementChild);

let td19 = document.createElement('td');
td19.innerHTML = coreHP;
td19.setAttribute("class","core")
insertAfter(td19, menu.lastElementChild);

let td33 = document.createElement('td');
td33.innerHTML = coreRPT;
td33.setAttribute("class","core")
insertAfter(td33, menu.lastElementChild);

let td34 = document.createElement('td');
td34.innerHTML = coreEPT;
td34.setAttribute("class","core")
insertAfter(td34, menu.lastElementChild);

let td29 = document.createElement('td');
td29.innerHTML = coreRamp;
td29.setAttribute("class","core")
insertAfter(td29, menu.lastElementChild);

let td30 = document.createElement('td');
td30.innerHTML = coreCrit;
td30.setAttribute("class","core")
insertAfter(td30, menu.lastElementChild);

let td31 = document.createElement('td');
td31.innerHTML = coreBlock;
td31.setAttribute("class","core")
insertAfter(td31, menu.lastElementChild);

let td32 = document.createElement('td');
td32.innerHTML = coreEBlock;
td32.setAttribute("class","core")
insertAfter(td32, menu.lastElementChild);

let td24 = document.createElement('td');
td24.innerHTML = coreMR;
td24.setAttribute("class","core")
insertAfter(td24, menu.lastElementChild);

let td27 = document.createElement('td');
td27.innerHTML = coreAugs;
td27.setAttribute("class","core")
insertAfter(td27, menu.lastElementChild);

let td26 = document.createElement('td');
td26.innerHTML = coreGems;
td26.setAttribute("class","core")
insertAfter(td26, menu.lastElementChild);

// head

let td21 = document.createElement('td');
td21.innerHTML = head;
td21.setAttribute("class","head")
insertAfter(td21, menu.lastElementChild);

let td18 = document.createElement('td');
td18.innerHTML = headName[1];
td18.setAttribute("class","head")
insertAfter(td18, menu.lastElementChild);

let td36 = document.createElement('td');
td36.innerHTML = headHoly+headArcane+headShadow+headFire+headKinetic;
td36.setAttribute("class","head")
insertAfter(td36, menu.lastElementChild);

let td37 = document.createElement('td');
td37.innerHTML = headHolyR+headArcaneR+headShadowR+headFireR+headKineticR;
td37.setAttribute("class","head")
insertAfter(td37, menu.lastElementChild);

let td38 = document.createElement('td');
td38.innerHTML = headATK;
td38.setAttribute("class","head")
insertAfter(td38, menu.lastElementChild);

let td39 = document.createElement('td');
td39.innerHTML = headChaos;
td39.setAttribute("class","head")
insertAfter(td39, menu.lastElementChild);

let td40 = document.createElement('td');
td40.innerHTML = headVile;
td40.setAttribute("class","head")
insertAfter(td40, menu.lastElementChild);

let td41 = document.createElement('td');
td41.innerHTML = headHP;
td41.setAttribute("class","head")
insertAfter(td41, menu.lastElementChild);

let td42 = document.createElement('td');
td42.innerHTML = headRPT;
td42.setAttribute("class","head")
insertAfter(td42, menu.lastElementChild);

let td43 = document.createElement('td');
td43.innerHTML = headEPT;
td43.setAttribute("class","head")
insertAfter(td43, menu.lastElementChild);

let td44 = document.createElement('td');
td44.innerHTML = headRamp;
td44.setAttribute("class","head")
insertAfter(td44, menu.lastElementChild);

let td45 = document.createElement('td');
td45.innerHTML = headCrit;
td45.setAttribute("class","head")
insertAfter(td45, menu.lastElementChild);

let td46 = document.createElement('td');
td46.innerHTML = headBlock;
td46.setAttribute("class","head")
insertAfter(td46, menu.lastElementChild);

let td47 = document.createElement('td');
td47.innerHTML = headEBlock;
td47.setAttribute("class","head")
insertAfter(td47, menu.lastElementChild);

let td48 = document.createElement('td');
td48.innerHTML = headMR;
td48.setAttribute("class","head")
insertAfter(td48, menu.lastElementChild);

let td49 = document.createElement('td');
td49.innerHTML = headAugs;
td49.setAttribute("class","head")
insertAfter(td49, menu.lastElementChild);

let td50 = document.createElement('td');
td50.innerHTML = headGems;
td50.setAttribute("class","head")
insertAfter(td50, menu.lastElementChild);

// neck

let td51 = document.createElement('td');
td51.innerHTML = neck;
td51.setAttribute("class","neck")
insertAfter(td51, menu.lastElementChild);

let td52 = document.createElement('td');
td52.innerHTML = neckName[1];
td52.setAttribute("class","neck")
insertAfter(td52, menu.lastElementChild);

let td53 = document.createElement('td');
td53.innerHTML = neckHoly+neckArcane+neckShadow+neckFire+neckKinetic;
td53.setAttribute("class","neck")
insertAfter(td53, menu.lastElementChild);

let td54 = document.createElement('td');
td54.innerHTML = neckHolyR+neckArcaneR+neckShadowR+neckFireR+neckKineticR;
td54.setAttribute("class","neck")
insertAfter(td54, menu.lastElementChild);

let td55 = document.createElement('td');
td55.innerHTML = neckATK;
td55.setAttribute("class","neck")
insertAfter(td55, menu.lastElementChild);

let td56 = document.createElement('td');
td56.innerHTML = neckChaos;
td56.setAttribute("class","neck")
insertAfter(td56, menu.lastElementChild);

let td57 = document.createElement('td');
td57.innerHTML = neckVile;
td57.setAttribute("class","neck")
insertAfter(td57, menu.lastElementChild);

let td58 = document.createElement('td');
td58.innerHTML = neckHP;
td58.setAttribute("class","neck")
insertAfter(td58, menu.lastElementChild);

let td59 = document.createElement('td');
td59.innerHTML = neckRPT;
td59.setAttribute("class","neck")
insertAfter(td59, menu.lastElementChild);

let td60 = document.createElement('td');
td60.innerHTML = neckEPT;
td60.setAttribute("class","neck")
insertAfter(td60, menu.lastElementChild);

let td61 = document.createElement('td');
td61.innerHTML = neckRamp;
td61.setAttribute("class","neck")
insertAfter(td61, menu.lastElementChild);

let td62 = document.createElement('td');
td62.innerHTML = neckCrit;
td62.setAttribute("class","neck")
insertAfter(td62, menu.lastElementChild);

let td63 = document.createElement('td');
td63.innerHTML = neckBlock;
td63.setAttribute("class","neck")
insertAfter(td63, menu.lastElementChild);

let td64 = document.createElement('td');
td64.innerHTML = neckEBlock;
td64.setAttribute("class","neck")
insertAfter(td64, menu.lastElementChild);

let td65 = document.createElement('td');
td65.innerHTML = neckMR;
td65.setAttribute("class","neck")
insertAfter(td65, menu.lastElementChild);

let td66 = document.createElement('td');
td66.innerHTML = neckAugs;
td66.setAttribute("class","neck")
insertAfter(td66, menu.lastElementChild);

let td67 = document.createElement('td');
td67.innerHTML = neckGems;
td67.setAttribute("class","neck")
insertAfter(td67, menu.lastElementChild);

// weapon

let td84 = document.createElement('td');
td84.innerHTML = weapon;
td84.setAttribute("class","weapon")
insertAfter(td84, menu.lastElementChild);

let td83 = document.createElement('td');
td83.innerHTML = weaponName[1];
td83.setAttribute("class","weapon")
insertAfter(td83, menu.lastElementChild);

let td82 = document.createElement('td');
td82.innerHTML = weaponHoly+weaponArcane+weaponShadow+weaponFire+weaponKinetic;
td82.setAttribute("class","weapon")
insertAfter(td82, menu.lastElementChild);

let td81 = document.createElement('td');
td81.innerHTML = weaponHolyR+weaponArcaneR+weaponShadowR+weaponFireR+weaponKineticR;
td81.setAttribute("class","weapon")
insertAfter(td81, menu.lastElementChild);

let td80 = document.createElement('td');
td80.innerHTML = weaponATK;
td80.setAttribute("class","weapon")
insertAfter(td80, menu.lastElementChild);

let td79 = document.createElement('td');
td79.innerHTML = weaponChaos;
td79.setAttribute("class","weapon")
insertAfter(td79, menu.lastElementChild);

let td78 = document.createElement('td');
td78.innerHTML = weaponVile;
td78.setAttribute("class","weapon")
insertAfter(td78, menu.lastElementChild);

let td77 = document.createElement('td');
td77.innerHTML = weaponHP;
td77.setAttribute("class","weapon")
insertAfter(td77, menu.lastElementChild);

let td76 = document.createElement('td');
td76.innerHTML = weaponRPT;
td76.setAttribute("class","weapon")
insertAfter(td76, menu.lastElementChild);

let td75 = document.createElement('td');
td75.innerHTML = weaponEPT;
td75.setAttribute("class","weapon")
insertAfter(td75, menu.lastElementChild);

let td74 = document.createElement('td');
td74.innerHTML = weaponRamp;
td74.setAttribute("class","weapon")
insertAfter(td74, menu.lastElementChild);

let td73 = document.createElement('td');
td73.innerHTML = weaponCrit;
td73.setAttribute("class","weapon")
insertAfter(td73, menu.lastElementChild);

let td72 = document.createElement('td');
td72.innerHTML = weaponBlock;
td72.setAttribute("class","weapon")
insertAfter(td72, menu.lastElementChild);

let td71 = document.createElement('td');
td71.innerHTML = weaponEBlock;
td71.setAttribute("class","weapon")
insertAfter(td71, menu.lastElementChild);

let td70 = document.createElement('td');
td70.innerHTML = weaponMR;
td70.setAttribute("class","weapon")
insertAfter(td70, menu.lastElementChild);

let td69 = document.createElement('td');
td69.innerHTML = weaponAugs;
td69.setAttribute("class","weapon")
insertAfter(td69, menu.lastElementChild);

let td68 = document.createElement('td');
td68.innerHTML = weaponGems;
td68.setAttribute("class","weapon")
insertAfter(td68, menu.lastElementChild);

// body

let td85 = document.createElement('td');
td85.innerHTML = body;
td85.setAttribute("class","body")
insertAfter(td85, menu.lastElementChild);

let td86 = document.createElement('td');
td86.innerHTML = bodyName[1];
td86.setAttribute("class","body")
insertAfter(td86, menu.lastElementChild);

let td87 = document.createElement('td');
td87.innerHTML = bodyHoly+bodyArcane+bodyShadow+bodyFire+bodyKinetic;
td87.setAttribute("class","body")
insertAfter(td87, menu.lastElementChild);

let td88 = document.createElement('td');
td88.innerHTML = bodyHolyR+bodyArcaneR+bodyShadowR+bodyFireR+bodyKineticR;
td88.setAttribute("class","body")
insertAfter(td88, menu.lastElementChild);

let td89 = document.createElement('td');
td89.innerHTML = bodyATK;
td89.setAttribute("class","body")
insertAfter(td89, menu.lastElementChild);

let td90 = document.createElement('td');
td90.innerHTML = bodyChaos;
td90.setAttribute("class","body")
insertAfter(td90, menu.lastElementChild);

let td91 = document.createElement('td');
td91.innerHTML = bodyVile;
td91.setAttribute("class","body")
insertAfter(td91, menu.lastElementChild);

let td92 = document.createElement('td');
td92.innerHTML = bodyHP;
td92.setAttribute("class","body")
insertAfter(td92, menu.lastElementChild);

let td93 = document.createElement('td');
td93.innerHTML = bodyRPT;
td93.setAttribute("class","body")
insertAfter(td93, menu.lastElementChild);

let td94 = document.createElement('td');
td94.innerHTML = bodyEPT;
td94.setAttribute("class","body")
insertAfter(td94, menu.lastElementChild);

let td95 = document.createElement('td');
td95.innerHTML = bodyRamp;
td95.setAttribute("class","body")
insertAfter(td95, menu.lastElementChild);

let td96 = document.createElement('td');
td96.innerHTML = bodyCrit;
td96.setAttribute("class","body")
insertAfter(td96, menu.lastElementChild);

let td97 = document.createElement('td');
td97.innerHTML = bodyBlock;
td97.setAttribute("class","body")
insertAfter(td97, menu.lastElementChild);

let td98 = document.createElement('td');
td98.innerHTML = bodyEBlock;
td98.setAttribute("class","body")
insertAfter(td98, menu.lastElementChild);

let td99 = document.createElement('td');
td99.innerHTML = bodyMR;
td99.setAttribute("class","body")
insertAfter(td99, menu.lastElementChild);

let td100 = document.createElement('td');
td100.innerHTML = bodyAugs;
td100.setAttribute("class","body")
insertAfter(td100, menu.lastElementChild);

let td101 = document.createElement('td');
td101.innerHTML = bodyGems;
td101.setAttribute("class","body")
insertAfter(td101, menu.lastElementChild);

// shield

let td118 = document.createElement('td');
td118.innerHTML = shield;
td118.setAttribute("class","shield")
insertAfter(td118, menu.lastElementChild);

let td117 = document.createElement('td');
td117.innerHTML = shieldName[1];
td117.setAttribute("class","shield")
insertAfter(td117, menu.lastElementChild);

let td116 = document.createElement('td');
td116.innerHTML = shieldHoly+shieldArcane+shieldShadow+shieldFire+shieldKinetic;
td116.setAttribute("class","shield")
insertAfter(td116, menu.lastElementChild);

let td115 = document.createElement('td');
td115.innerHTML = shieldHolyR+shieldArcaneR+shieldShadowR+shieldFireR+shieldKineticR;
td115.setAttribute("class","shield")
insertAfter(td115, menu.lastElementChild);

let td114 = document.createElement('td');
td114.innerHTML = shieldATK;
td114.setAttribute("class","shield")
insertAfter(td114, menu.lastElementChild);

let td113 = document.createElement('td');
td113.innerHTML = shieldChaos;
td113.setAttribute("class","shield")
insertAfter(td113, menu.lastElementChild);

let td112 = document.createElement('td');
td112.innerHTML = shieldVile;
td112.setAttribute("class","shield")
insertAfter(td112, menu.lastElementChild);

let td111 = document.createElement('td');
td111.innerHTML = shieldHP;
td111.setAttribute("class","shield")
insertAfter(td111, menu.lastElementChild);

let td110 = document.createElement('td');
td110.innerHTML = shieldRPT;
td110.setAttribute("class","shield")
insertAfter(td110, menu.lastElementChild);

let td109 = document.createElement('td');
td109.innerHTML = shieldEPT;
td109.setAttribute("class","shield")
insertAfter(td109, menu.lastElementChild);

let td108 = document.createElement('td');
td108.innerHTML = shieldRamp;
td108.setAttribute("class","shield")
insertAfter(td108, menu.lastElementChild);

let td107 = document.createElement('td');
td107.innerHTML = shieldCrit;
td107.setAttribute("class","shield")
insertAfter(td107, menu.lastElementChild);

let td106 = document.createElement('td');
td106.innerHTML = shieldBlock;
td106.setAttribute("class","shield")
insertAfter(td106, menu.lastElementChild);

let td105 = document.createElement('td');
td105.innerHTML = shieldEBlock;
td105.setAttribute("class","shield")
insertAfter(td105, menu.lastElementChild);

let td104 = document.createElement('td');
td104.innerHTML = shieldMR;
td104.setAttribute("class","shield")
insertAfter(td104, menu.lastElementChild);

let td103 = document.createElement('td');
td103.innerHTML = shieldAugs;
td103.setAttribute("class","shield")
insertAfter(td103, menu.lastElementChild);

let td102 = document.createElement('td');
td102.innerHTML = shieldGems;
td102.setAttribute("class","shield")
insertAfter(td102, menu.lastElementChild);

// belt

let td119 = document.createElement('td');
td119.innerHTML = belt;
td119.setAttribute("class","belt")
insertAfter(td119, menu.lastElementChild);

let td120 = document.createElement('td');
td120.innerHTML = beltName[1];
td120.setAttribute("class","belt")
insertAfter(td120, menu.lastElementChild);

let td121 = document.createElement('td');
td121.innerHTML = beltHoly+beltArcane+beltShadow+beltFire+beltKinetic;
td121.setAttribute("class","belt")
insertAfter(td121, menu.lastElementChild);

let td122 = document.createElement('td');
td122.innerHTML = beltHolyR+beltArcaneR+beltShadowR+beltFireR+beltKineticR;
td122.setAttribute("class","belt")
insertAfter(td122, menu.lastElementChild);

let td123 = document.createElement('td');
td123.innerHTML = beltATK;
td123.setAttribute("class","belt")
insertAfter(td123, menu.lastElementChild);

let td124 = document.createElement('td');
td124.innerHTML = beltChaos;
td124.setAttribute("class","belt")
insertAfter(td124, menu.lastElementChild);

let td125 = document.createElement('td');
td125.innerHTML = beltVile;
td125.setAttribute("class","belt")
insertAfter(td125, menu.lastElementChild);

let td126 = document.createElement('td');
td126.innerHTML = beltHP;
td126.setAttribute("class","belt")
insertAfter(td126, menu.lastElementChild);

let td127 = document.createElement('td');
td127.innerHTML = beltRPT;
td127.setAttribute("class","belt")
insertAfter(td127, menu.lastElementChild);

let td128 = document.createElement('td');
td128.innerHTML = beltEPT;
td128.setAttribute("class","belt")
insertAfter(td128, menu.lastElementChild);

let td129 = document.createElement('td');
td129.innerHTML = beltRamp;
td129.setAttribute("class","belt")
insertAfter(td129, menu.lastElementChild);

let td130 = document.createElement('td');
td130.innerHTML = beltCrit;
td130.setAttribute("class","belt")
insertAfter(td130, menu.lastElementChild);

let td131 = document.createElement('td');
td131.innerHTML = beltBlock;
td131.setAttribute("class","belt")
insertAfter(td131, menu.lastElementChild);

let td132 = document.createElement('td');
td132.innerHTML = beltEBlock;
td132.setAttribute("class","belt")
insertAfter(td132, menu.lastElementChild);

let td133 = document.createElement('td');
td133.innerHTML = beltMR;
td133.setAttribute("class","belt")
insertAfter(td133, menu.lastElementChild);

let td134 = document.createElement('td');
td134.innerHTML = beltAugs;
td134.setAttribute("class","belt")
insertAfter(td134, menu.lastElementChild);

let td135 = document.createElement('td');
td135.innerHTML = beltGems;
td135.setAttribute("class","belt")
insertAfter(td135, menu.lastElementChild);

// pants

let td152 = document.createElement('td');
td152.innerHTML = pants;
td152.setAttribute("class","pants")
insertAfter(td152, menu.lastElementChild);

let td151 = document.createElement('td');
td151.innerHTML = pantsName[1];
td151.setAttribute("class","pants")
insertAfter(td151, menu.lastElementChild);

let td150 = document.createElement('td');
td150.innerHTML = pantsHoly+pantsArcane+pantsShadow+pantsFire+pantsKinetic;
td150.setAttribute("class","pants")
insertAfter(td150, menu.lastElementChild);

let td149 = document.createElement('td');
td149.innerHTML = pantsHolyR+pantsArcaneR+pantsShadowR+pantsFireR+pantsKineticR;
td149.setAttribute("class","pants")
insertAfter(td149, menu.lastElementChild);

let td148 = document.createElement('td');
td148.innerHTML = pantsATK;
td148.setAttribute("class","pants")
insertAfter(td148, menu.lastElementChild);

let td147 = document.createElement('td');
td147.innerHTML = pantsChaos;
td147.setAttribute("class","pants")
insertAfter(td147, menu.lastElementChild);

let td146 = document.createElement('td');
td146.innerHTML = pantsVile;
td146.setAttribute("class","pants")
insertAfter(td146, menu.lastElementChild);

let td145 = document.createElement('td');
td145.innerHTML = pantsHP;
td145.setAttribute("class","pants")
insertAfter(td145, menu.lastElementChild);

let td144 = document.createElement('td');
td144.innerHTML = pantsRPT;
td144.setAttribute("class","pants")
insertAfter(td144, menu.lastElementChild);

let td143 = document.createElement('td');
td143.innerHTML = pantsEPT;
td143.setAttribute("class","pants")
insertAfter(td143, menu.lastElementChild);

let td142 = document.createElement('td');
td142.innerHTML = pantsRamp;
td142.setAttribute("class","pants")
insertAfter(td142, menu.lastElementChild);

let td141 = document.createElement('td');
td141.innerHTML = pantsCrit;
td141.setAttribute("class","pants")
insertAfter(td141, menu.lastElementChild);

let td140 = document.createElement('td');
td140.innerHTML = pantsBlock;
td140.setAttribute("class","pants")
insertAfter(td140, menu.lastElementChild);

let td139 = document.createElement('td');
td139.innerHTML = pantsEBlock;
td139.setAttribute("class","pants")
insertAfter(td139, menu.lastElementChild);

let td138 = document.createElement('td');
td138.innerHTML = pantsMR;
td138.setAttribute("class","pants")
insertAfter(td138, menu.lastElementChild);

let td137 = document.createElement('td');
td137.innerHTML = pantsAugs;
td137.setAttribute("class","pants")
insertAfter(td137, menu.lastElementChild);

let td136 = document.createElement('td');
td136.innerHTML = pantsGems;
td136.setAttribute("class","pants")
insertAfter(td136, menu.lastElementChild);

// ring

let td153 = document.createElement('td');
td153.innerHTML = ring;
td153.setAttribute("class","ring")
insertAfter(td153, menu.lastElementChild);

let td154 = document.createElement('td');
td154.innerHTML = ringName[1];
td154.setAttribute("class","ring")
insertAfter(td154, menu.lastElementChild);

let td155 = document.createElement('td');
td155.innerHTML = ringHoly+ringArcane+ringShadow+ringFire+ringKinetic;
td155.setAttribute("class","ring")
insertAfter(td155, menu.lastElementChild);

let td156 = document.createElement('td');
td156.innerHTML = ringHolyR+ringArcaneR+ringShadowR+ringFireR+ringKineticR;
td156.setAttribute("class","ring")
insertAfter(td156, menu.lastElementChild);

let td157 = document.createElement('td');
td157.innerHTML = ringATK;
td157.setAttribute("class","ring")
insertAfter(td157, menu.lastElementChild);

let td158 = document.createElement('td');
td158.innerHTML = ringChaos;
td158.setAttribute("class","ring")
insertAfter(td158, menu.lastElementChild);

let td159 = document.createElement('td');
td159.innerHTML = ringVile;
td159.setAttribute("class","ring")
insertAfter(td159, menu.lastElementChild);

let td160 = document.createElement('td');
td160.innerHTML = ringHP;
td160.setAttribute("class","ring")
insertAfter(td160, menu.lastElementChild);

let td161 = document.createElement('td');
td161.innerHTML = ringRPT;
td161.setAttribute("class","ring")
insertAfter(td161, menu.lastElementChild);

let td162 = document.createElement('td');
td162.innerHTML = ringEPT;
td162.setAttribute("class","ring")
insertAfter(td162, menu.lastElementChild);

let td163 = document.createElement('td');
td163.innerHTML = ringRamp;
td163.setAttribute("class","ring")
insertAfter(td163, menu.lastElementChild);

let td164 = document.createElement('td');
td164.innerHTML = ringCrit;
td164.setAttribute("class","ring")
insertAfter(td164, menu.lastElementChild);

let td165 = document.createElement('td');
td165.innerHTML = ringBlock;
td165.setAttribute("class","ring")
insertAfter(td165, menu.lastElementChild);

let td166 = document.createElement('td');
td166.innerHTML = ringEBlock;
td166.setAttribute("class","ring")
insertAfter(td166, menu.lastElementChild);

let td167 = document.createElement('td');
td167.innerHTML = ringMR;
td167.setAttribute("class","ring")
insertAfter(td167, menu.lastElementChild);

let td168 = document.createElement('td');
td168.innerHTML = ringAugs;
td168.setAttribute("class","ring")
insertAfter(td168, menu.lastElementChild);

let td169 = document.createElement('td');
td169.innerHTML = ringGems;
td169.setAttribute("class","ring")
insertAfter(td169, menu.lastElementChild);

// foot

let td186 = document.createElement('td');
td186.innerHTML = foot;
td186.setAttribute("class","foot")
insertAfter(td186, menu.lastElementChild);

let td185 = document.createElement('td');
td185.innerHTML = footName[1];
td185.setAttribute("class","foot")
insertAfter(td185, menu.lastElementChild);

let td184 = document.createElement('td');
td184.innerHTML = footHoly+footArcane+footShadow+footFire+footKinetic;
td184.setAttribute("class","foot")
insertAfter(td184, menu.lastElementChild);

let td183 = document.createElement('td');
td183.innerHTML = footHolyR+footArcaneR+footShadowR+footFireR+footKineticR;
td183.setAttribute("class","foot")
insertAfter(td183, menu.lastElementChild);

let td182 = document.createElement('td');
td182.innerHTML = footATK;
td182.setAttribute("class","foot")
insertAfter(td182, menu.lastElementChild);

let td181 = document.createElement('td');
td181.innerHTML = footChaos;
td181.setAttribute("class","foot")
insertAfter(td181, menu.lastElementChild);

let td180 = document.createElement('td');
td180.innerHTML = footVile;
td180.setAttribute("class","foot")
insertAfter(td180, menu.lastElementChild);

let td179 = document.createElement('td');
td179.innerHTML = footHP;
td179.setAttribute("class","foot")
insertAfter(td179, menu.lastElementChild);

let td178 = document.createElement('td');
td178.innerHTML = footRPT;
td178.setAttribute("class","foot")
insertAfter(td178, menu.lastElementChild);

let td177 = document.createElement('td');
td177.innerHTML = footEPT;
td177.setAttribute("class","foot")
insertAfter(td177, menu.lastElementChild);

let td176 = document.createElement('td');
td176.innerHTML = footRamp;
td176.setAttribute("class","foot")
insertAfter(td176, menu.lastElementChild);

let td175 = document.createElement('td');
td175.innerHTML = footCrit;
td175.setAttribute("class","foot")
insertAfter(td175, menu.lastElementChild);

let td174 = document.createElement('td');
td174.innerHTML = footBlock;
td174.setAttribute("class","foot")
insertAfter(td174, menu.lastElementChild);

let td173 = document.createElement('td');
td173.innerHTML = footEBlock;
td173.setAttribute("class","foot")
insertAfter(td173, menu.lastElementChild);

let td172 = document.createElement('td');
td172.innerHTML = footMR;
td172.setAttribute("class","foot")
insertAfter(td172, menu.lastElementChild);

let td187 = document.createElement('td');
td187.innerHTML = footAugs;
td187.setAttribute("class","foot")
insertAfter(td187, menu.lastElementChild);

let td170 = document.createElement('td');
td170.innerHTML = footGems;
td170.setAttribute("class","foot")
insertAfter(td170, menu.lastElementChild);

setTimeout(function() {

GM_addStyle ( `
#button,#studiomoxxi{display:revert !important;}
#loading{display:none !important;}
`);

}, 6000);

})})})})})})})})})})})}}}