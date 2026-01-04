// ==UserScript==
// @name         Neopets: Auto-album stamps
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Puts stamps from your inventory to album.
// @author       Nyu (clraik)
// @match        *://*.neopets.com/inventory.phtml
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35670/Neopets%3A%20Auto-album%20stamps.user.js
// @updateURL https://update.greasyfork.org/scripts/35670/Neopets%3A%20Auto-album%20stamps.meta.js
// ==/UserScript==

var hidden=false;//true if you want to hide the frame, false if you want to see the frame.




if(document.URL.indexOf("inventory.phtml") != -1) {

	var items=$("[class='inventory']")[0].innerHTML;
	var htex=$("[class='sidebar']")[0];
	var a = document.createElement ('p');
	a.setAttribute('id', 'stamp_frame');
	htex.prepend(a);
	if ((items.includes(" Stamp")&&!items.includes("Stamp "))||items.includes("Collectable Scarab")||(items.includes(" Coin")&&!items.includes("Dubloon Coin"))||(items.includes(" Coconut")&&!items.includes("Coconut "))||items.includes("Collectable Charm")){//
		$('[id="invNav"]').append('<br><center><table><tr><td><input type="button" value="Auto-album" id="bnAutoAlbum"></input></td><td><input type="button" value="Stop Auto-albumer" id="bnStopAutoAlbum"></input></td></tr></table></center>');
		$('[id="bnAutoAlbum"]').on('click',function(){
			sessionStorage.setItem('doAlbum','true');
			letsAlbum();
		});
		$('[id="bnStopAutoAlbum"]').on('click',function(){
			sessionStorage.setItem('doAlbum','false');
		});
		letsAlbum();
	}
}
function letsAlbum(){
	var shouldIAlbum=sessionStorage.getItem('doAlbum');
	if(shouldIAlbum=='true'){
		for (var i=0;i<100;i++){
			for (var j=0;j<6;j++){
				var item=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].outerHTML;//gets item HTML
				var itemimg=document.getElementsByClassName("inventory")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("img")[0].outerHTML;//get item image url
				var itemid = item.substring(53, 63);//Gets obj_id
				if ((item.includes(" Stamp")&&!item.includes("Stamp "))||item.includes("Collectable Scarab")||(item.includes(" Coin")&&!item.includes("Dubloon Coin"))||(item.includes(" Coconut")&&!item.includes("Coconut "))||item.includes("Collectable Charm")){//
					var ShowFrame=$("[id='stamp_frame']")[0];//Thanks AyBeCee for the iframe idea & code!!
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
						$('#iFrame').contents().find("select[name=action] option:contains(Album)").prop("selected","selected");
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