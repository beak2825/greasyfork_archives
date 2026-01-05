// ==UserScript==
// @name        NexusClashPetListonMouseover
// @namespace   http://userscripts.org/users/125692
// @description Character Name title text shows a count of a characters pets that are present
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5265/NexusClashPetListonMouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/5265/NexusClashPetListonMouseover.meta.js
// ==/UserScript==
//1.2 fix so doesn't have to have third party greasemeonkey script run first
(function() {
	
var characters= document.evaluate("//span[@class='char']", document, null,
	    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//alert(characters.snapshotLength);
if (characters.snapshotLength>=1){//We have one or more candidates
	var ehighlightpet=function(e) {
	        var charname=e.target.textContent;
			//either .trim or .slice(0, -1) to remove last character from string.
			var searchstring="Master: "+charname.trim();
			searchstring="//a[@title='"+searchstring+"']"
			var theirpets= document.evaluate(searchstring, document, null,
			  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var eachpet=0;
			//alert(theirpets.snapshotLength);
			if (theirpets.snapshotLength>=1){//We have one or more candidates
				e.target.title=(theirpets.snapshotLength + " pets present");
				var eachpet=0;
				for (var i=0;eachpet=theirpets.snapshotItem(i);i++){
					eachpet.style.color='blue';
				}
            }
        }
var eunhighlightpet=function(e) {
            var charname=e.target.textContent;
			var searchstring="Master: "+charname.trim();
			searchstring="//a[@title='"+searchstring+"']"
			var theirpets= document.evaluate(searchstring, document, null,
			  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var eachpet=0;
			if (theirpets.snapshotLength>=1){//We have one or more candidates
				var eachpet=0;
				for (var i=0;eachpet=theirpets.snapshotItem(i);i++){
					//eachpet.style.fontStyle='normal';
					eachpet.style.color="";
				}
            }
        }	
	
	var eachchar=0;
	for (var i=0;eachchar=characters.snapshotItem(i);i++){
		eachchar=eachchar.firstElementChild;
		eachchar.addEventListener("mouseover", ehighlightpet);
		eachchar.addEventListener("mouseout", eunhighlightpet);
	}		
	}	
else {//we might still have people but we aren't using the character sort script
//so find everyone bu liing for a with href starting with 	href="javascript:SelectItem('target_id',
	characters = document.evaluate( 
		"//a[starts-with(@href,'javascript:SelectItem(')]",
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null );
	if (characters.snapshotLength>=1){//We have one or more candidates
		var ehighlightpet=function(e) {
	        var charname=e.target.textContent;		//either .trim or .slice(0, -1) to remove last character from string.
			var searchstring="Master: "+charname.trim();
			searchstring="//a[@title='"+searchstring+"']";
			var theirpets= document.evaluate(searchstring, document, null,
			  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var eachpet=0;
			if (theirpets.snapshotLength>=1){//We have one or more candidates
				e.target.title=(theirpets.snapshotLength + " pets present");
				var eachpet=0;
				for (var i=0;eachpet=theirpets.snapshotItem(i);i++){
					eachpet.style.color='blue';
				}
			}
		}
	var eunhighlightpet=function(e) {
            var charname=e.target.textContent;
			var searchstring="Master: "+charname.trim();
			searchstring="//a[@title='"+searchstring+"']";
			var theirpets= document.evaluate(searchstring, document, null,
			  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var eachpet=0;
			if (theirpets.snapshotLength>=1){//We have one or more candidates
				var eachpet=0;
				for (var i=0;eachpet=theirpets.snapshotItem(i);i++){
					//eachpet.style.fontStyle='normal';
					eachpet.style.color="";
				}
            }
        }
		var eachchar=0;
		for (var i=0;eachchar=characters.snapshotItem(i);i++){
			//eachchar=eachchar.firstElementChild;
			eachchar.addEventListener("mouseover", ehighlightpet);
			eachchar.addEventListener("mouseout", eunhighlightpet);
		}		
	
	}

} 	
	
	
	
//EOF
})();