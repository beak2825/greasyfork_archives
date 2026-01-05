// ==UserScript==
// @name        Nexus Clash Remove Spellgem Colour from Inventory
// @namespace   http://userscripts.org/users/125692
// @description Remove Spellgem Colour from Inventory
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10821/Nexus%20Clash%20Remove%20Spellgem%20Colour%20from%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/10821/Nexus%20Clash%20Remove%20Spellgem%20Colour%20from%20Inventory.meta.js
// ==/UserScript==
//removes the spellgem colour from gems in the inventory and sorts them and puts them at the bottom of inventory
//adds title text (mouse over) with the colour
(function() {

var inventoryheaders = document.evaluate(
	"//th[starts-with(.,'Item')]", 
	document, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
	);
if(inventoryheaders.snapshotLength>0){
var inventoryheader=inventoryheaders.snapshotItem(0);//pick the first one
  
  
  //right now whle we at inventory hide spellgem colours.   
    var inventorygems = document.evaluate(
	"//tr[contains(td/text(),'Spellgem')]", 
	inventoryheader.parentNode, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
	);
    if (inventorygems.snapshotLength>0){//we have spellgems
        //set title text to color. Remove colour and move them to bottom of inventory
       var inventorygemrow=0;
		   for (i=0;inventorygemrow=inventorygems.snapshotItem(i);i++){
         inventorygemrow.firstElementChild.title=inventorygemrow.firstElementChild.textContent;
			    inventorygemrow.firstElementChild.textContent=inventorygemrow.firstElementChild.textContent.replace(/.*(Spellgem.*)/,'$1');
		   }  
    }
var wornrow=  document.evaluate(//row above which we insert spellgems
	"//tr[th/text()='Worn']", 
	inventoryheader.parentNode, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
	);
   
if (wornrow.snapshotLength>0){
  wornrow=wornrow.snapshotItem(0);
  var inventorygemrowparent=inventoryheader.parentNode.parentNode;
  //sort an array of the gem rows

  var sellength=inventorygems.snapshotLength;
  if(sellength>1){//ie we need to sort
  	var tmpAry = new Array();
    for (var i=0;i<sellength ;i++) {
		tmpAry[i] = new Array();
		tmpAry[i][0] = inventorygems.snapshotItem(i);
		}
		tmpAry.sort(function (a,b){//this needed to ignore case and leading numbers
                var a=a[0].firstElementChild.textContent.match(/([A-Za-z-,0-9 ]+)/)[1].toLowerCase();
                var b=b[0].firstElementChild.textContent.match(/([A-Za-z-,0-9 ]+)/)[1].toLowerCase();//([A-Za-z-,0-9 ]+)
                return a<b?-1:b<a?1:0;
            });
		for (var i=0;i<tmpAry.length;i++) {
            inventorygemrowparent.insertBefore(tmpAry[i][0],wornrow);
		}
  }
  else if(sellength==1) {//we only have one gem
   inventorygemrowparent.insertBefore(inventorygems.snapshotItem(0),wornrow);
  }
  } 
}
  
//EOF
})();  