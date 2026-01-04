// ==UserScript==
// @name         Neopets: Faerie Bottles Auto-Bless
// @namespace    http://clraik.com/forum/showthread.php?61793-Neopets-Faerie-Bottles-Auto-Bless
// @namespace    https://greasyfork.org/en/scripts/32837-neopets-faerie-bottles-auto-bless
// @version      0.5
// @description  Blesses a pet all the weak bottled faeries in inventory when button is clicked
// @author       Nyu (clraik)
// @match        http://www.neopets.com/inventory.phtml
// @downloadURL https://update.greasyfork.org/scripts/32837/Neopets%3A%20Faerie%20Bottles%20Auto-Bless.user.js
// @updateURL https://update.greasyfork.org/scripts/32837/Neopets%3A%20Faerie%20Bottles%20Auto-Bless.meta.js
// ==/UserScript==

var pet_to_bless = "PetName";//Change to the pet you want to bless' name
var hidden=false;//true if you want to hide the frame, false if you want to see the frame.

if(document.URL.indexOf("inventory.phtml") != -1) {

	var items=$("[class='inventory']")[0].innerHTML;
	var htex=$("[class='sidebar']")[0];
	var a = document.createElement ('p');
	a.setAttribute('id', 'bottle_frame');
	htex.prepend(a);
	if (items.includes("Weak Bottled")){
		$('[id="invNav"]').append('<br><center><table><tr><td><input type="button" value="Autobless" id="bnAutoBless"></input></td><td><input type="button" value="Stop Autobless" id="bnStopAutoBless"></input></td></tr></table></center>');
		$('[id="bnAutoBless"]').on('click',function(){
			sessionStorage.setItem('doBless','true');
			letsBless();
		});
		$('[id="bnStopAutoBless"]').on('click',function(){
			sessionStorage.setItem('doBless','false');
		});
		letsBless();
	}
}
function letsBless(){
	var shouldIBless=sessionStorage.getItem('doBless');
	if(shouldIBless=='true'){
		for (var i=0;i<100;i++){
			for (var j=0;j<6;j++){
				var item=document.getElementsByClassName("inventory")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].outerHTML.toString();//gets item HTML
				var itemimg=document.getElementsByClassName("inventory")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("img")[0].outerHTML.toString();//get item image url
				var itemid = item.substring(53, 63);//Gets obj_id
				if(itemimg.includes("http://images.neopets.com/items/bd_botfae1")&&!item.includes("(trading)")&&!item.includes("(auctioned)"))//if itemimg is a weak bottle faerie
				{
					var ShowFrame=$("[id='bottle_frame']")[0];//Thanks AyBeCee for the iframe idea & code!!
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
						$('#iFrame').contents().find("select[name=action] option:contains(Bless "+ pet_to_bless +")").prop("selected","selected");
						$('#iFrame').contents().find("[value='Submit']").click();
						if(!first){
							$('#iFrame').contents().find("form").hide();
							setTimeout(function(){ location.reload();},1000);
						}//Reload if second time iFrame loads (useobject.phtml)
						first=false;
					});
				}
			}
		}
	}
}