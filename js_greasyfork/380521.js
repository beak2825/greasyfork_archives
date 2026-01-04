// ==UserScript==
// @name:en        HWM_use_kb
// @name           HWM_use_kb
// @author         kaifonaft, original by LazyGreg
// @namespace      https://greasyfork.org
// @description    HWM добавляет горячие клавиши для навигации
// @description:en HWM add hotkeys for navigation
// @version        0.42
//
// @include       https://www.heroeswm.ru/*

// @exclude       https://www.heroeswm.ru/auction_lot_protocol.php*
// @exclude       https://www.heroeswm.ru/war.php*
// @exclude       https://www.heroeswm.ru/warlog.php*
// @exclude       https://www.heroeswm.ru/sms.php*
// @exclude       https://www.heroeswm.ru/auction.php*
//
// @downloadURL https://update.greasyfork.org/scripts/380521/HWM_use_kb.user.js
// @updateURL https://update.greasyfork.org/scripts/380521/HWM_use_kb.meta.js
// ==/UserScript==

// ========================================================
//
// ==================== User's Hotkeys ====================================
// numeric buttons above letter keys... and also with NumLock on.
// array, 0-number on key, 1-url

var my_hotkeys = [];
my_hotkeys.push([0,'https://www.heroeswm.ru/home.php']);  // "0" key
my_hotkeys.push([1,'https://www.heroeswm.ru/inventory.php?all_on=1']);  // "1" key
my_hotkeys.push([2,'https://www.heroeswm.ru/inventory.php?all_on=2']);  // "2" key
my_hotkeys.push([3,'https://www.heroeswm.ru/inventory.php?all_on=3']);  // "3" key
my_hotkeys.push([4,'https://www.heroeswm.ru/inventory.php?all_on=4']);  // "4" key
my_hotkeys.push([5,'https://www.heroeswm.ru/inventory.php?all_on=5']);  // "5" key
my_hotkeys.push([6,'https://www.heroeswm.ru/home.php']);  // "6" key
my_hotkeys.push([7,'https://www.heroeswm.ru/home.php']);  // "7" key
my_hotkeys.push([8,'https://www.heroeswm.ru/home.php']);  // "8" key
my_hotkeys.push([9,'https://www.heroeswm.ru/home.php']);  // "9" key

// ========================================================================
//
//
// ============
var player_id = getPlayerId();

function getPlayerId(){
	return get_cookie('pl_id');
}
function get_cookie ( cookie_name ){
	var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

	if ( results )
		return ( unescape ( results[2] ) );
	else
		return null;
}

// ========================== Standard Addresses ==============================
// array, 0-eng, 1-rus, 2-url
var std_hotkeys = [];
std_hotkeys.push([72,72,'https://www.heroeswm.ru/home.php']);  // "H" for home
std_hotkeys.push([71,71,'https://www.heroeswm.ru/mercenary_guild.php']); // "G" for GN
std_hotkeys.push([69,69,'https://www.heroeswm.ru/sms.php']); // "E" for Mail
std_hotkeys.push([65,65,'https://www.heroeswm.ru/auction.php']); // "A" for Market/Auction 
std_hotkeys.push([77,77,'https://www.heroeswm.ru/map.php']); // "M" for Map
std_hotkeys.push([112,112,'https://www.heroeswm.ru/pl_info.php?id='+player_id]); // "P" or F1 for Profile
std_hotkeys.push([80,80,'https://www.heroeswm.ru/pl_info.php?id='+player_id]); // "P" or F1 for Profile
std_hotkeys.push([66,66,'https://www.heroeswm.ru/group_wars.php']); // "B" for Battles (group)
std_hotkeys.push([86,86,'https://www.heroeswm.ru/group_wars.php?filter=hunt']); // "V" for Hunt 

std_hotkeys.push([70,70,'https://www.heroeswm.ru/forum.php']); // "F" for Forum 
std_hotkeys.push([84,84,'https://www.heroeswm.ru/transfer.php']); // "T" for Transfer 
std_hotkeys.push([67,67,'https://www.heroeswm.ru/castle.php']); // "C" for Castle 
std_hotkeys.push([73,73,'https://www.heroeswm.ru/inventory.php']); // "I" for Inventory 
std_hotkeys.push([83,83,'https://www.heroeswm.ru/shop.php']); // "S" for Shop 

std_hotkeys.push([75,75,'https://www.heroeswm.ru/skillwheel.php']); // "K" for SkillWheel 
std_hotkeys.push([87,87,'https://www.heroeswm.ru/mod_workbench.php']); // "W" for WorkShop
std_hotkeys.push([76,76,'https://www.heroeswm.ru/pl_warlog.php?id='+player_id]); // "L" for Your Battle Log
std_hotkeys.push([79,79,'https://www.heroeswm.ru/pl_transfers.php?id='+player_id]); // "O" for Your Transfers Log
std_hotkeys.push([82,82,'https://www.heroeswm.ru/army.php']); // "R" for Recruiting (army)

std_hotkeys.push([68,68,'https://www.heroeswm.ru/inventory.php?all_on=1']); // "D" for Dress (arts on)
std_hotkeys.push([85,85,'https://www.heroeswm.ru/inventory.php?all_off=1']); // "U" for Un-Dress (arts off)


// ============================================================================
//
//
//
var url_cur = location.href ;

document.addEventListener( "keydown", handleKeyDown , false );
document.addEventListener( "keyup", handleKeyUp , false );

var isCtrl = false;
function handleKeyDown(e){
	if(e.which == 17) isCtrl=true;
}

function handleKeyUp(e){
    var evt = (e) ? e : window.event;   
	var c = (evt.charCode) ? evt.charCode : evt.keyCode;
	if(e.which == 17) isCtrl=false;
  
	var nodeName = e.target.nodeName;
	var inputs = ["INPUT", "TEXTAREA", "SELECT"]
	if(inputs.indexOf(nodeName) != -1)
		return;

    var evt = (e) ? e : window.event;       //IE reports window.event not arg
	var c = (evt.charCode) ? evt.charCode : evt.keyCode;
	
 	handleChar(c);
}

function handleChar(c) {
	if (c <= 46 || isCtrl) { return; }		 // special keys  (shift is 16 btw)
	//
	// check standard keys
	for(var i=0; i<std_hotkeys.length; i++){
		if(c==std_hotkeys[i][0] || c==std_hotkeys[i][1]){
			window.location = std_hotkeys[i][2];
		}
	}

    // check user's keys
	for(i=0; i<my_hotkeys.length; i++){
		if(c==my_hotkeys[i][0]+48 ){
			window.location = my_hotkeys[i][1];
		}
	}
}

// === show note :-)
var helpDiv = document.createElement('div');
helpDiv.className = 'js-kb-help';
helpDiv.setAttribute('style', '\
  position: relative; left:36px; top: -13px; z-index: 1;\
  display: none; width: 200px; background: #eee9cd;\
  box-shadow: 1px 1px 4px #222222; padding: 2px;\
');
var strs = [
	' "H" for home',
	' "G" for GN',
	' "E" for Mail',
	' "A" for Market/Auction ',
	' "M" for Map',
	' "P", F1 for Profile',
	' "B" for Battles (group)',
	' "V" for Hunt ',
	' "F" for Forum ',
	' "T" for Transfer ',
	' "C" for Castle ',
	' "I" for Inventory ',
	' "S" for Shop ',
	' "K" for SkillWheel ',
	' "W" for WorkShop',
	' "L" for Your Battle Log',
	' "O" for Your Transfers Log',
	' "R" for Recruiting (army)',
	' "1"-"5" for Dress arts set',
	' "U" for Un-Dress (arts off)',
];
for(i in strs){
	var div = document.createElement('div');
	div.textContent = strs[i];
	helpDiv.appendChild(div);	
}
var d = document.createElement( 'div' );
d.onclick = function(e){
	var kbHelp = document.querySelector('.js-kb-help');
	if(kbHelp.style.display == 'block'){
		kbHelp.style.display = 'none';
	}else{
		kbHelp.style.display = 'block';
	}
};
d.style = 'border:1px solid #999; background-color:#6c6; width:30; height:12; '+
	'position:absolute; top:5px; left:5px; font-size:10px; cursor: pointer;';
d.innerHTML = '<b>_KB</b>';
d.appendChild(helpDiv);
document.body.appendChild( d ) ;


// ========================================================