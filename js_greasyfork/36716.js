// ==UserScript==
// @name         Neopets: Break toys!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plays with breakable toys until they break
// @author       Nyu (clraik)
// @match        *://*.neopets.com/inventory.phtml
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36716/Neopets%3A%20Break%20toys%21.user.js
// @updateURL https://update.greasyfork.org/scripts/36716/Neopets%3A%20Break%20toys%21.meta.js
// ==/UserScript==

var hidden=false;//true if you want to hide the frame, false if you want to see the frame.

var breakable_items=[
"Air Faerie Snowglobe",
"Angel Chia Plushie",
"Archery Set",
"Big n Bouncy Toy",
"Blue Chia Plushie",
"Blue Cup and Ball Toy",
"Blue Fuzzle",
"Blue Mynci Puppet",
"Blue Whistle",
"Bouncy Zafara Toy",
"Click Klacks",
"Clock",
"Dancing Jerdana Music Box",
"Earth Faerie Snowglobe",
"Fake Kass Charm",
"Fake Uni Hat",
"Fuzzie Bear",
"Green Chia Plushie",
"Green Mynci Puppet",
"Gulper Float Ring",
"Gumball Machine",
"Gyroscope Toy",
"Hissi In A Box",
"Kaylas Chemistry Set",
"Lady Blurg Bat Game",
"Light Faerie Snowglobe",
"Limited Edition Evil Chia Plushie",
"Meridell Toy Plane",
"Mootix Farm",
"Neo Hits Volume One",
"Pink Yoyo",
"Plastic Sword",
"Porcelain Snowflake",
"Pull Along Snowbunny",
"Purple Mynci Puppet",
"Red Chia Plushie",
"Red Mynci Puppet",
"Red Ruki Scooter",
"Red Toy Car",
"Roller Blades",
"Sculpty Dough",
"Sharky Skateboard",
"Shiny CD",
"Shoot Kreludor Game",
"Snicklebeast Balloon",
"Soup Faerie Snowglobe",
"Springy Green Slorg",
"Super Duper Scooter",
"Toy Seesaw",
"Uniocto Racquet",
"Warf Yoyo",
"Wind Up Nuranna",
"Wind Up Tonu",
"Wooden Stilts",
"Wooden Sword",
"Yellow Chia Plushie",
"Yellow Mynci Puppet",
"Basketball",
"Blue Bouncy Ball",
"Green Bori Ball",
"Blue Pencil with Eraser",
"Golden Bike",
"Blue Chia Plushie",
"Cheery Tomato Plushie",
"Donny Plushie",
"Jelly Chia Plushie",
"Mutant Chia Plushie",
"Orange Grundo Plushie",
"Pink Fuzzle",
"Deluxe Set of Colouring Pencils",
"Yoyo"
];

if(document.URL.indexOf("inventory.phtml") != -1) {

	var items=$("[class='inventory']")[0].innerHTML;
	var htex=$("[class='sidebar']")[0];
	var a = document.createElement ('p');
	a.setAttribute('id', 'toys_frame');
	htex.prepend(a);
	for (var i=0;i<breakable_items.length;i++){
		if (items.includes(breakable_items[i])){
			//alert(breakable_items[i]);
			$('[id="invNav"]').append('<br><center><table><tr><td><input type="button" value="Break toys!" id="bnBreakToys"></input></td><td><input type="button" value="Stop breaking toys" id="bnStopBreakingToys"></input></td></tr></table></center>');
			$('[id="bnBreakToys"]').on('click',function(){
				sessionStorage.setItem('breakIt','true');
				playWithToys();
			});
			$('[id="bnStopBreakingToys"]').on('click',function(){
				sessionStorage.setItem('breakIt','false');
			});
			playWithToys();
			//Play with it until it breaks
			break;
		}
	}
}
function playWithToys(){
	var breakToys=sessionStorage.getItem('breakIt');
	if(breakToys=='true'){
		for (var i=0;i<100;i++){
			for (var j=0;j<6;j++){
				var item=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].outerHTML;//gets item HTML
				var itemimg=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("img")[0].outerHTML;//get item image url
				var itemid = item.substring(53, 63);//Gets obj_id
				for (var ind=0;ind<breakable_items.length;ind++){
					if (item.includes(breakable_items[ind])&&(item.includes("Broken Neopoints")||!item.includes("Broken "))&&!item.includes("Ripped ")&&!item.includes("Dull ")&&!item.includes("Burst ")&&!item.includes("Flat Tyred ")&&!item.includes("Snapped ")){//Dull Burst Flat Tyred Snapped
						var ShowFrame=$("[id='toys_frame']")[0];
						if(hidden){
							ShowFrame.innerHTML = '<iframe src="http://www.neopets.com/iteminfo.phtml?obj_id=' + itemid + '" style="width: 0px;height: 0px; visibility:hidden;" id="iFrame"></iframe>';
						}else{
							ShowFrame.innerHTML = '<iframe src="http://www.neopets.com/iteminfo.phtml?obj_id=' + itemid + '" width="200" style="-webkit-transform:scale(0.8);" id="iFrame"></iframe>';
						}
						var first=true;
						$('#iFrame').load(function(){
							$('#iFrame').contents().find("select[name=action]").css({width:150});
							$('#iFrame').contents().find("table").hide();
							$('#iFrame').contents().find("img").hide();
							$('#iFrame').contents().find("span").hide();
							$('#iFrame').contents().find("select[name=action] option:contains(Play)").prop("selected","selected");
							$('#iFrame').contents().find("[value='Submit']").click();
							if(!first){
								$('#iFrame').contents().find("form").hide();
								setTimeout(function(){ location.reload();},1000);
							}//Reload if second time iFrame loads (useobject.phtml)
							first=false;
						});
						break;
					}
				}
			}
		}
	}
}