// RetroFrog Lair Item Spoiler (updated by stufff)
// 
// ==UserScript==
// @name           Lair Item Spoiler
// @include        *kingdomofloathing.com/campground.php*
// @include        *127.0.0.1:600*/campground.php*
// @include        *kingdomofloathing.com/lair1.php*
// @include        *127.0.0.1:600*/lair1.php*
// @include        *localhost:600*/campground.php*
// @include        *localhost:600*/lair1.php*
// @grant	   GM_post
// @grant	   GM_setValue
// @grant	   GM_xmlhttpRequest
// @description    This script for Kingdom of Loathing ( KoL ) shows needed tower items when using the telescope or 3 doors before the tower, checks to see if you have them, and provides links to the zones where you can get them.
// @version	   0.4.3
// @namespace https://greasyfork.org/users/5083-stufff
// @downloadURL https://update.greasyfork.org/scripts/4888/Lair%20Item%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/4888/Lair%20Item%20Spoiler.meta.js
// ==/UserScript==

/********************************** Recent Changes **********************************************
Recent Updates:
	0.1	New Script!
	0.2	Minor bug fix (didn't match baseball bat)
	0.3	Minor bug fix (leftovers of indeterminate origin)
	0.4 	Updated by stufff to support KoLMafia using localhost instead of 127.0.0.1, added grant lines required by Greasemonkey versions 2.0 and higher, update item locations after KoL revamps made several old locations invalid
	0.4.1 	Updated script location
	0.4.3	Updated version and namespace information to work with greasyfork
	
********************************************************************************************/
GM_setValue("scriptVer","0.4.3");
GM_setValue("scriptName","LairItemSpoiler");
GM_setValue("scriptURL","https://greasyfork.org/scripts/4888-lair-item-spoiler/code/Lair%20Item%20Spoiler.user.js");

var imagebase = "http://images.kingdomofloathing.com/itemimages/";
var imgLoading="data:image/gif,GIF89a%0A%00%0A%00%91%03%00%CC%CC%CC%FFff%FF%00%00%FF%FF%FF!%FF%0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%00%00%03%00%2C%00%00%00%00%0A%00%0A%00%00%02%17%9C'r%06%80%1A%02s'%AE%3Bqk%9A%E2%C3%81%14Gz%D9Q%00%00!%F9%04%05%00%00%03%00%2C%01%00%00%00%08%00%03%00%00%02%0A%9C%136%22%83%03%00S%10%14%00!%F9%04%05%00%00%03%00%2C%00%00%00%00%06%00%06%00%00%02%0C%9C%070%11%A8%7C%A2%11%22%D2X%00%00!%F9%04%05%00%00%03%00%2C%00%00%01%00%03%00%08%00%00%02%0A%1C%608%13%C1%BE%96%10c%16%00!%F9%04%05%00%00%03%00%2C%00%00%04%00%06%00%06%00%00%02%0A%04%86c%C9%1C%E1%A0%10l%16%00!%F9%04%05%00%00%03%00%2C%01%00%07%00%08%00%03%00%00%02%0A%04%86%23b%13%A1Dz%A9%00%00!%F9%04%05%00%00%03%00%2C%04%00%04%00%06%00%06%00%00%02%0C%9C'r%A8%BB%11%06%00%03Jz%0A%00!%F9%04%09%00%00%03%00%2C%07%00%01%00%03%00%08%00%00%02%0A%94f%A3%1A1%BD%00%18r%14%00%3B";
var imgCMark="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0C%00%00%00%0C%08%03%00%00%00a%AB%AC%D5%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%00%15PLTE%97%B7S%C2%E1g%A7%C0%7C%EE%F7%D4%B8%B7%ADt%98%3B%FF%FF%FF%A3%A4~%C4%00%00%00%07tRNS%FF%FF%FF%FF%FF%FF%00%1AK%03F%00%00%00DIDATx%DAl%CDA%0E%001%08%02%40j%C5%FF%3F%B9%60M%B3%87%E5%60%06%0F%8A%FA%04%FF%85%24%1E%23%08-%9A%3B%98%A0%A6h%97J%C7V%C1R%60%17%D2%EDZ%A7%D5%C6%FE%93%1C%F7%D3%1C%D7%11%60%00%D9%B6%02%AF%99w%BE%B8%00%00%00%00IEND%AEB%60%82";
var imgXMark="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0C%00%00%00%0C%08%03%00%00%00a%AB%AC%D5%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%00%15PLTE%C4DD%FF%A5%A5%C4%24%24%FFXX%B8%B7%AD%9B%00%00%FF%FF%FFP%FD%8A%D2%00%00%00%07tRNS%FF%FF%FF%FF%FF%FF%00%1AK%03F%00%00%00JIDATx%DAL%8E%B1%11%C00%0C%02%B1%02%DA%7F%E4%00N%11%8A7_%883%F6%17%ECJ)!V%80%DF2r%A0%C2B%17%07bn%A8%88%7Bd%F58%FA%D6%262wm%5C%8A%CA%88%0C%BB%96%DB2k%CC%0F%C2W%80%01%00%BF%0A%02q%B8%F18%3C%00%00%00%00IEND%AEB%60%82";

function Item() {
	var name = "";
	var id = 0;
	var use = "";
	var location = "";
	var img = null;
	var desc = null;
	var regex = /you cant match me im the gingerbread can/;	
}

var items = new Array();
var foods = new Array();

var temp;
// gate 1
temp = new Item();items.push(temp);temp.name="Pygmy pygment";temp.use="Gate of Spirit";temp.id=2242;temp.desc=598693688;temp.img='pigment.gif';temp.location='<a href=adventure.php?snarfblat=349>The Hidden Park</a> (pygmy assault squad)';temp.regex=/Gate of Spirit|wooden gate with an elaborate carving of an armchair/;
temp = new Item();items.push(temp);temp.name="Wussiness potion";temp.use="Gate of Humility";temp.id=469;temp.desc=319727419;temp.img='potion5.gif';temp.location='<a href=adventure.php?snarfblat=248>Pandamonium Slums</a> (W Imp)';temp.regex=/Gate of Humility|wooden gate with an elaborate carving of a cowardly-looking man/;
temp = new Item();items.push(temp);temp.name="Gremlin juice";temp.use="Gate of Hilarity";temp.id=2631;temp.desc=417958778;temp.img='potion6.gif';temp.location='<a href=adventure.php?snarfblat=154>Junkyard</a> (all)';temp.regex=/Gate of Hilarity|wooden gate with an elaborate carving of a banana peel/;
temp = new Item();items.push(temp);temp.name="Adder bladder";temp.use="Gate of the Viper";temp.id=2056;temp.img='bladder.gif';temp.desc=462033983;temp.location='<a href=adventure.php?snarfblat=111>Black Forest</a> (black adder)';temp.regex=/Gate of the Viper|wooden gate with an elaborate carving of a coiled viper/;
temp = new Item();items.push(temp);temp.name="Angry Farmer Candy";temp.use="Gate of The Suc Rose";temp.id=617;temp.img='rcandy.gif';temp.desc=893169457;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> or the <a href=adventure.php?snarfblat=324>Castle Top Floor</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();items.push(temp);temp.name="marzipan skull";temp.use="Gate of The Suc Rose";temp.id=1163;temp.img='candyskull.gif';temp.desc=445404749;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();items.push(temp);temp.name="Tasty Fun Good rice candy";temp.use="Gate of The Suc Rose";temp.id=540;temp.desc=122301916;temp.img='candy.gif';temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a>, or the <a href=adventure.php?snarfblat=80>The Valley Beyond The Orc Chasm</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();foods.push(temp);temp.name="black forest cake";temp.use="Gate of The Suc Rose";temp.id=2342;temp.img='blackcake.gif';temp.desc=233137570;temp.location='<a href=adventure.php?snarfblat=111>Black Forest</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();items.push(temp);temp.name="Yummy Tummy bean";temp.use="Gate of The Suc Rose";temp.id=905;temp.img='jellybean.gif';temp.desc=905318938;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();foods.push(temp);temp.name="brown sugar cane";temp.use="Gate of The Suc Rose";temp.id=2734;temp.img='sugarcane.gif';temp.desc=790278119;temp.location='<a href=adventure.php?snarfblat=122>Oasis</a>';temp.regex=/Gate of The Suc Rose|wooden gate with an elaborate carving of a rose/;
temp = new Item();items.push(temp);temp.name="Thin black candle";temp.use="Gate of Morbose Morbidity and Moping";temp.id=620;temp.img='bcandle.gif';temp.desc=409210711;temp.location='<a href=adventure.php?snarfblat=324>Castle Top Floor</a>';temp.regex=/Gate of Morbose Morbidity and Moping|wooden gate with an elaborate carving of a glum teenager/;
temp = new Item();items.push(temp);temp.name="Super-spikey hair gel";temp.use="Gate of the Porcupine";temp.id=587;temp.img='balm.gif';temp.desc=629447779;temp.location='<a href=adventure.php?snarfblat=81>Penultimate Airship</a> (protagonist)';temp.regex=/Gate of the Porcupine|wooden gate with an elaborate carving of a hedgehog/;
temp = new Item();items.push(temp);temp.name="Black No. 2";temp.use="Locked Gate";temp.id=2059;temp.img='blackdye.gif';temp.desc=858056059;temp.location='<a href=adventure.php?snarfblat=111>Black Forest</a>';temp.regex=/Locked Gate|wooden gate with an elaborate carving of a raven/;
temp = new Item();items.push(temp);temp.name="Mick's IcyVapoHotness Rub";temp.use="Gate of Slack";temp.id=618;temp.img='balm.gif';temp.desc=341807797;temp.location='<a href=adventure.php?snarfblat=324>Castle Top Floor</a> (raver giant)';temp.regex=/Gate of Slack|wooden gate with an elaborate carving of a smiling man/;

// gate 2
temp = new Item();items.push(temp);temp.name="Jaba&ntilde;ero-flavored Chewing Gum";temp.use="Gate of Flame";temp.img='chicle.gif';temp.desc=653201781;temp.id=300;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (noncombat)';temp.regex=/Gate of Flame/;
temp = new Item();items.push(temp);temp.name="Handsomeness potion";temp.use="Gate of Intrigue";temp.id=1162;temp.img='potion1.gif';temp.desc=448002422;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (handsome mariachi)';temp.regex=/Gate of Intrigue/;
temp = new Item();items.push(temp);temp.name="Meleegra&trade; pills";temp.use="Gate of Machismo";temp.id=1158;temp.img='goofballs.gif';temp.desc=208619711;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (noncombat)';temp.regex=/Gate of Machismo/;
temp = new Item();items.push(temp);temp.name="Pickle-flavored Chewing Gum";temp.use="Gate of Mystery";temp.img='chicle.gif';temp.desc=238820559;temp.id=299;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (noncombat)';temp.regex=/Gate of Mystery/;
temp = new Item();items.push(temp);temp.name="Marzipan skull";temp.use="Gate of the Dead";temp.id=1163;temp.img='candyskull.gif';temp.desc=445404749;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (mariachi calavera, angry pinata)';temp.regex=/Gate of the Dead/;
temp = new Item();items.push(temp);temp.name="Tamarind-flavored chewing gum";temp.use="Gate of Torment";temp.id=297;temp.desc=955502325;temp.img='chicle.gif';temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (noncombat)';temp.regex=/Gate of Torment/;
temp = new Item();items.push(temp);temp.name="Lime-and-chile-flavored chewing gum";temp.use="Gate of Zest";temp.id=298;temp.desc=278245380;temp.img='chicle.gif';temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (noncombat)';temp.regex=/Gate of Zest/;

// gate 3
temp = new Item();items.push(temp);temp.name="Izchak's blessing";temp.use="Gate of Light";temp.id=0;temp.img='exclam.gif';temp.location='<a href=adventure.php?snarfblat=39>Dungeons of Doom</a>';temp.regex=/Gate of Light/;
temp = new Item();items.push(temp);temp.name="Object detection";temp.use="Gate of The Which is Hidden";temp.img='exclam.gif';temp.id=0;temp.location='<a href=adventure.php?snarfblat=39>Dungeons of Doom</a>';temp.regex=/Gate Of That Which is Hidden/;
temp = new Item();items.push(temp);temp.name="Strange mental acuity";temp.use="Gate of the Mind";temp.id=0;temp.img='exclam.gif';temp.location='<a href=adventure.php?snarfblat=39>Dungeons of Doom</a>';temp.regex=/Gate of the Mind/;
temp = new Item();items.push(temp);temp.name="Strength of 10 ettins";temp.use="Gate of the Ogre";temp.id=0;temp.img='exclam.gif';temp.location='<a href=adventure.php?snarfblat=39>Dungeons of Doom</a>';temp.regex=/Gate of the Ogre/;
temp = new Item();items.push(temp);temp.name="Teleportitis";temp.use="Gate that is Not a Gate";temp.id=0;temp.img='exclam.gif';temp.location='<a href=adventure.php?snarfblat=39>Dungeons of Doom</a>';temp.regex=/Gate that is Not a Gate/;

// tower monsters
temp = new Item();items.push(temp);temp.name="Frigid ninja stars";temp.use="Flaming Samurai";temp.id=353;temp.img='ninjastars.gif';temp.desc=767479170;temp.location='<a href=adventure.php?snarfblat=272>Lair of the Ninja Snowmen</a> (all)';temp.regex=/Flaming Samurai|catch a glimpse of a flaming katana/;
temp = new Item();items.push(temp);temp.name="Spider web";temp.use="Pretty Fly";temp.id=27;temp.img='web.gif';temp.desc=968009158;temp.location='<a href=adventure.php?snarfblat=112>Sleazy Back Alley</a> (spider)';temp.regex=/Pretty Fly|catch a glimpse of a translucent wing/;
temp = new Item();items.push(temp);temp.name="Sonar-in-a-biscuit";temp.use="Bowling Cricket";temp.id=563;temp.img='biscuit.gif';temp.desc=415379536;temp.location='<a href=adventure.php?snarfblat=31>Guano Junction</a> (all, clover)';temp.regex=/Bowling Cricket|see a fancy-looking tophat/;
temp = new Item();items.push(temp);temp.name="Black pepper";temp.use="Giant Fried Egg";temp.id=2341;temp.img='blpepper.gif';temp.desc=386692175;temp.location='<a href=adventure.php?snarfblat=111>Black Forest</a> (picnic basket from black widow)';temp.regex=/Giant Fried Egg|see a flash of albumen/;
temp = new Item();items.push(temp);temp.name="Pygmy blowgun";temp.use="endangered inflatable white tiger";temp.id=2237;temp.desc=680058972;temp.img="tinyblowgun.gif";temp.location='<a href=adventure.php?snarfblat=349>The Hidden Park</a> (pygmy blowgunner)';temp.regex=/endangered inflatable white tiger|see a giant white ear/;
temp = new Item();items.push(temp);temp.name="Meat vortex";temp.use="Big Meat Golem";temp.id=546;temp.img='vortex.gif';temp.desc=623462590;temp.location='<a href=adventure.php?snarfblat=80>The Valley Beyond The Orc Chasm</a> (me4t begZ0r)';temp.regex=/Big Meat Golem|see a huge face made of Meat/;
temp = new Item();items.push(temp);temp.name="Chaos butterfly";temp.use="Tyrannosaurus Tex";temp.id=615;temp.img='butterfly.gif';temp.desc=796698319;temp.location='<a href=adventure.php?snarfblat=232>Castle Ground Floor</a> (possibility giant)';temp.regex=/Tyrannosaurus Tex|see a large cowboy hat/;
temp = new Item();items.push(temp);temp.name="Photoprotoneutron torpedo";temp.use="Electron Submarine";temp.id=630;temp.desc=807305354;temp.img='torpedo.gif';temp.location='<a href=adventure.php?snarfblat=81>Penultimate Airship</a> (MagiMechTech MechaMech)';temp.regex=/Electron Submarine|see a periscope/;
temp = new Item();items.push(temp);temp.name="Fancy bath salts";temp.use="fancy bath slug";temp.id=2091;temp.img='potion4.gif';temp.desc=990835255;temp.location='<a href=adventure.php?snarfblat=392>Haunted Bathroom</a> (claw-foot bathtub)';temp.regex=/fancy bath slug|see a slimy eyestalk/;
temp = new Item();items.push(temp);temp.name="Inkwell";temp.use="Darkness";temp.id=1958;temp.img='inkwell.gif';temp.desc=965828249;temp.location='<a href=adventure.php?snarfblat=390>Haunted Library</a> (writing desk)';temp.regex=/The Darkness|see a strange shadow/;
temp = new Item();items.push(temp);temp.name="Can of hair spray";temp.use="Ice Cube";temp.id=744;temp.img='spraycan.gif';temp.desc=206943648;temp.location="<a href='store.php?whichstore=m'>General Store</a>";temp.regex=/Ice Cube|see moonlight reflecting off of what appears to be ice/;
temp = new Item();items.push(temp);temp.name="Disease";temp.use="Vicious Easel";temp.id=452;temp.img='disease.gif';temp.desc=482996145;temp.location='<a href=adventure.php?snarfblat=20>Fun House</a>, <a href=adventure.php?snarfblat=42>Harem</a>';temp.regex=/Vicious Easel|see part of a tall wooden frame/;
temp = new Item();items.push(temp);temp.name="Bronzed Locust";temp.use="malevolent crop circle";temp.id=2575;temp.img='locust1.gif';temp.desc=991245163;temp.location='<a href=adventure.php?snarfblat=364>The Arid, Extra-Dry Desert</a> (plaque of locusts)';temp.regex=/malevolent crop circle|see some amber waves of grain/;
temp = new Item();items.push(temp);temp.name="Knob Goblin Firecracker";temp.use="concert pianist";temp.id=747;temp.img='firecrack.gif';temp.desc=832516586;temp.location='<a href=adventure.php?snarfblat=114>Outskirt of Cobbs Knob</a>';temp.regex=/concert pianist|see some long coattails/;
temp = new Item();items.push(temp);temp.name="Powdered organs";temp.use="possessed pipe-organ";temp.id=2538;temp.desc=724169350;temp.img='scpowder.gif';temp.location='<a href=adventure.php?snarfblat=406>Upper</a> and <a href=adventure.php?snarfblat=407>Middle</a> Chamber (Canopic Jar dropped by tomb servant)';temp.regex=/possessed pipe-organ|see some pipes with steam shooting out of them/;
temp = new Item();items.push(temp);temp.name="Leftovers of indeterminate origin";temp.use="Bronze Chef";temp.id=1777;temp.desc=778949739;temp.img='leftovers.gif';temp.location='<a href=adventure.php?snarfblat=388>Haunted Kitchen</a> (demonic icebox, clover)';temp.regex=/Bronze Chef|see some sort of bronze figure holding a spatula/;
temp = new Item();items.push(temp);temp.name="Mariachi G-string";temp.use="El Diablo";temp.id=1159;temp.img='string.gif';temp.desc=414783196;temp.location='<a href=adventure.php?snarfblat=45>South of the Border</a> (irate mariachi)';temp.regex=/El Diablo|see the neck of a huge bass guitar/;
temp = new Item();items.push(temp);temp.name="NG";temp.use="Giant Desktop Globe";temp.id=624;temp.img='ng.gif';temp.desc=522263123;temp.location='<a href=adventure.php?snarfblat=80>The Valley Beyond The Orc Chasm</a> (N), <a href=adventure.php?snarfblat=322>Castle Basement</a> (G)';temp.regex=/Giant Desktop Globe|see what appears to be the North Pole/;
temp = new Item();items.push(temp);temp.name="Plot hole";temp.use="best-selling novelist";temp.id=613;temp.img='hole.gif';temp.desc=228721882;temp.location='<a href=adventure.php?snarfblat=232>Castle Ground Floor</a> (possibility giant)';temp.regex=/best-selling novelist|see what looks like a writing desk/;
temp = new Item();items.push(temp);temp.name="Baseball";temp.use="Beer Batter";temp.id=181;temp.img='baseball.gif';temp.desc=874161307;temp.location='<a href=adventure.php?snarfblat=31>Guano Junction</a> (baseball bat, clover w/ biscuits)';temp.regex=/Beer Batter|see the tip of a baseball bat/;
temp = new Item();items.push(temp);temp.name="Razor-sharp can lid";temp.use="Fickle Finger of F8";temp.id=559;temp.img='canlid.gif';temp.desc=234555940;temp.location='<a href=adventure.php?snarfblat=113>Haunted Pantry</a> (cans)';temp.regex=/Fickle Finger of F8|see what seems to be a giant cuticle/;
temp = new Item();items.push(temp);temp.name="Tropical orchid";temp.use="giant bee";temp.id=2492;temp.img='troporchid.gif';temp.desc=810106897;temp.location='<a href=adventure.php?snarfblat=355>The Shore, Inc. Travel Agency</a> (tropical island souvenir crate)';temp.regex=/giant bee|see a formidable stinger/;
temp = new Item();items.push(temp);temp.name="Stick of dynamite";temp.use="Collapsed mineshaft golem";temp.id=2493;temp.img='dynamite.gif';temp.desc=333120731;temp.location='<a href=adventure.php?snarfblat=355>The Shore, Inc. Travel Agency</a> (dude ranch souvenir crate)';temp.regex=/Collapsed mineshaft golem|see a wooden beam/;
temp = new Item();items.push(temp);temp.name="Barbed-wire fence";temp.use="Enranged Cow";temp.id=145;temp.img='fence.gif';temp.desc=858596394;temp.location='<a href=adventure.php?snarfblat=355>The Shore, Inc. Travel Agency</a> (ski resort souvenir crate)';temp.regex=/Enraged Cow|see a pair of horns/;

if (document.body) {
	var parseType = 'p';
	var entries = document.getElementsByTagName(parseType);
	var invCheck = false;
	var foodCheck = false;
	for (var entry = entries.length-1; entry >= 0; entry--) {
		if (process(entries[entry], items)) {
			invCheck = true;
		} else if (process(entries[entry], foods)) {
			foodCheck = true;
		}
	}
	if (invCheck) miscSearch();
	if (foodCheck) foodSearch();
}

function process(targetNode, list) {
	var source = targetNode.innerHTML;
	var invCheck = false;
	for (var item = 0; item < list.length; item++) {
//list[item].regex=/wooden gate with an elaborate carving/;
		if (source.search(list[item].regex) >= 0) {
			//alert('found ' + source);
			var node = document.createElement("span");
			var imgId = 'itemstatus' + list[item].id;
			var html = "<br><b><span title='Needed for the " + list[item].use + "'>" + list[item].name + "</span></b> from the " + list[item].location;
			if (list[item].img != null) {
				var img = "<img style='vertical-align:middle'" + (list[item].desc == null?"":" class='hand' onclick='descitem(" + list[item].desc + ")'") + " src='" + imagebase + list[item].img + "'/>";
				html += "&nbsp;&nbsp;" + img; // style='height:15px;width:15px'

			}
			if (list[item].id != 0) {
				html += "&nbsp;&nbsp;<img title='Checking your inventory...' style='vertical-align:middle;height:12px;width:12px' name='" + imgId + "'/>"; // class='hand' 
			}
			node.innerHTML = html;
			//targetNode.insertBefore(node, entryNode.childNodes[0]);
			targetNode.appendChild(node);

			if (list[item].id != 0) {
				var imgs = document.getElementsByName(imgId);
				for (var i = 0; i < imgs.length; i++) {
					imgs[i].setAttribute("src", imgLoading);
				}
				invCheck = true;
			}
		} 
	}
	return invCheck;
}

function miscSearch()
{
	GM_post('/inventory.php','which=3', parseMisc);

	function parseMisc(data)
	{
		var RE, match, workimage;
		for(var i = 0; i < items.length; i++)
		{	
			workImages = document.getElementsByName("itemstatus"+items[i].id);
			for (var j = 0; j < workImages.length; j++) {
				workImages[j].style.paddingRight = "";

				//RE = new RegExp("item=" + items[i].id + "|" + items[i].img, "i");
				RE = new RegExp(items[i].desc, "i");
				match = RE.exec(data);
				
				workImages[j].setAttribute("src",(match != null)?imgCMark:imgXMark);
				workImages[j].setAttribute("title",(match!=null)?("At least one "+items[i].name+" is in your inventory"):("You do not have a "+items[i].name));
			}
		}
	}
}

function foodSearch() 
{
	GM_post('/inventory.php','which=1', parseFoods);

	function parseFoods(data)
	{
		var RE, match, workimage;
		for(var i = 0; i < foods.length; i++)
		{	
			workImages = document.getElementsByName("itemstatus"+ foods[i].id);
			for (var j = 0; j < workImages.length; j++) {
				workImages[j].style.paddingRight = "";

				//RE = new RegExp("item=" + foods[i].id + "|" + foods[i].img, "i");
				RE = new RegExp(foods[i].desc, "i");
				match = RE.exec(data);
				
				workImages[j].setAttribute("src",(match != null)?imgCMark:imgXMark);
				workImages[j].setAttribute("title",(match!=null)?("At least one " + foods[i].name+" is in your inventory"):("You do not have a " + foods[i].name));
			}
		}
	}
}

// Who doesn't steal onetontomatoes stuff :P (actually, me... I stole it from Fishy;-)
function GM_post( dest, vars, callback, external) {
	var theHost = (external)?"":document.location.host;
	 GM_xmlhttpRequest({
	    method: 'POST',
	    url: 'http://'+theHost + dest,
	    headers: {'Content-type': 'application/x-www-form-urlencoded'},
			data: vars,
			onload:function(details) {
				if( typeof callback=='function' ){
					callback( details.responseText);
				}
			}
	});
}
