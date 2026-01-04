// ==UserScript==
// @name         Neopets: Send cards to neodeck
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sends collectable cards from your inventory to your NeoDeck.
// @author       Nyu (clraik)
// @match        *://*.neopets.com/inventory.phtml
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36439/Neopets%3A%20Send%20cards%20to%20neodeck.user.js
// @updateURL https://update.greasyfork.org/scripts/36439/Neopets%3A%20Send%20cards%20to%20neodeck.meta.js
// ==/UserScript==

var hidden=false;//true if you want to hide the frame, false if you want to see the frame.




if(document.URL.indexOf("inventory.phtml") != -1) {

	var items=$("[class='inventory']")[0].innerHTML;
	var htex=$("[class='sidebar']")[0];
	var a = document.createElement ('p');
	a.setAttribute('id', 'card_frame');
	htex.prepend(a);
	if (items.includes("tradingcardback.gif")){
		$('[id="invNav"]').append('<br><center><table><tr><td><input type="button" value="Send cards to neodeck" id="bnAutoCard"></input></td><td><input type="button" value="Stop sending cards" id="bnStopAutoCard"></input></td></tr></table></center>');
		$('[id="bnAutoCard"]').on('click',function(){
			sessionStorage.setItem('doCard','true');
			sendCards();
		});
		$('[id="bnStopAutoCard"]').on('click',function(){
			sessionStorage.setItem('doCard','false');
		});
		sendCards();
	}
}
function sendCards(){
	var shouldISendCards=sessionStorage.getItem('doCard');
	if(shouldISendCards=='true'){
		for (var i=0;i<100;i++){
			for (var j=0;j<6;j++){
				var item=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].outerHTML;//gets item HTML
				var itemimg=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("img")[0].outerHTML;//get item image url
				var itemid = item.substring(53, 63);//Gets obj_id
				if((itemimg.includes("tradingcardback.gif")))//if itemimg is a card
				{
					var ShowFrame=$("[id='card_frame']")[0];
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
						$('#iFrame').contents().find("select[name=action] option:contains(Put in your NeoDeck)").prop("selected","selected");
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