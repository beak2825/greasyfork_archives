// ==UserScript==
// @name        Nexus Clash Enchanting Aid
// @namespace   http://userscripts.org/users/125692
// @description Helps track an items enchantment history.
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     0.91
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12653/Nexus%20Clash%20Enchanting%20Aid.user.js
// @updateURL https://update.greasyfork.org/scripts/12653/Nexus%20Clash%20Enchanting%20Aid.meta.js
// ==/UserScript==

//What we want to do.
//catch all enchant attempts. get object id and store the id and the enchant type.
//must also catch failures to enchant and - the attempt.
//then on load we add to inventory item the count and type of the last 10 enchants on that item.

//this copied off the web
//http://stackoverflow.com/questions/9447950/script-to-save-settings
// for chrome as no GM_getValue and GMsetValue available.
//altered thanks to AuxAuv	
try{	
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
  }
} catch (err) { console.log('Test if GM_getValue supported error:\n' + err.message); }

function decodeenchant(enchantstring){
		//var a=split(enchantstring);
		var output='| ';
		var testchar;
		for(var j=0;testchar=enchantstring[j];j++){
			//alert(enchantstring+":"+j+":"+testchar);
			switch(testchar){
				case'a':output+='accuracy/defense';break;
				case'b':output+='acid';break;
				case'c':output+='arcane';break;
				case'd':output+='cold';break;
				case'e':output+='death';break;
				case'f':output+='durability';break;
				case'g':output+='electric';break;
				case'h':output+='fire';break;
				case'i':output+='holy';break;
				case'j':output+='lighten';break;
				case'k':output+='poison';break;
				case'l':output+='unholy';break;
				case'?':
				default:output+='-';break;
			}
			output+=" | ";
		}
		return output+"<-Latest enchantment";
	}
//for this part as a cludge till i rewrite all of the above. get all enchanted items and grab the encahnt count and update values.

var enchantitems = document.evaluate( 
	"//form[@name='enchanting']/select[@name='item']/option[contains(text(),'(enchanted')]",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
if (enchantitems.snapshotLength>0){	
	var encitem;
	for(i=0;encitem=enchantitems.snapshotItem(i);i++){
		var itemenchantcount=encitem.textContent.match(/(\d+) enchantments/);
  	itemenchantcount= itemenchantcount?itemenchantcount[1]:0;//we reuse variable
		if(GM_getValue(''+encitem.value+"count",'x')!=itemenchantcount){
			GM_setValue(''+encitem.value+"count",''+itemenchantcount);}//set the count as separate number.
	}
}

// do the same for magical items. they sare the same but different words. (magical - ## seals).
enchantitems = document.evaluate( 
	"//form[@name='enchanting']/select[@name='item']/option[contains(text(),'(magical')]",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
if (enchantitems.snapshotLength>0){	
	var encitem;
	for(i=0;encitem=enchantitems.snapshotItem(i);i++){
		var itemenchantcount=encitem.textContent.match(/(\d+) seals/);
  	itemenchantcount= itemenchantcount?itemenchantcount[1]:0;//we reuse variable
		if(GM_getValue(''+encitem.value+"count",'x')!=itemenchantcount){
			GM_setValue(''+encitem.value+"count",''+itemenchantcount);}//set the count as separate number.
	}
}
//name='enchanting'
var enchantforms = document.evaluate(
	"//form[@name='enchanting'] ", 
	document, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null
);
//alert("running");
if (enchantforms.snapshotLength>0){
//we have one form assume its the one form so then add event listenr to it to capture the object id of the enchanted item.
//set up the event to place on the enchant button
	var enchantevent=function(e) {
		var ebutton=e.target;
		//alert("running"+ebutton.value);
		//var enchantform=ebutton.parentNode;
    //alert("running"+enchantform.innerHTML);
		var enchantformitem=ebutton.nextElementSibling;
		//alert("running"+enchantformitem.innerHTML);
		var enchantformenchantment=enchantformitem.nextElementSibling;
		//alert("running"+enchantformenchantment.innerHTML);
		var itemid =enchantformitem[enchantformitem.selectedIndex].value;
		
		
		//we try to store enchant count in another gmvariable as thats easier.
		//we first look to see if item is already enchanted and get count
		/*we don't need to do this here as all enchanted items get done on page load when enchanting possible.
		var itemenchantcount=enchantformitem[enchantformitem.selectedIndex].textContent.match(/(\d+) enchantments/);
		itemenchantcount= itemenchantcount?itemenchantcount[1]:0;//we reuse variable
		itemenchantcount+=1;//we are echanting one more level.
		GM_setValue(itemid+"count",itemenchantcount);//set the count as separate number.
		*/
		//alert("running"+itemid);
		var enchanttype =enchantformenchantment[enchantformenchantment.selectedIndex].value; 
        var enchanthistory=GM_getValue(''+itemid,"??????????");//get the history of this item or make new blank
		switch(enchanttype){
			case'accuracy':
			case'defense':
			case'accuracy/defense':itemcode='a';break;
			case'acid':itemcode='b';break;
			case'arcane':itemcode='c';break;
			case'cold':itemcode='d';break;
			case'death':itemcode='e';break;
			case'durability':itemcode='f';break;
			case'electric':itemcode='g';break;
			case'fire':itemcode='h';break;
			case'holy':itemcode='i';break;
			case'lighten':itemcode='j';break;
			case'poison':itemcode='k';break;
			case'unholy':itemcode='l';break;
			default:itemcode='?';break;
		}
		enchanthistory=enchanthistory.substr(1)+itemcode;//we only want a 10 long history. Drop first letter & append new letter
		GM_setValue(''+itemid,enchanthistory);
	}
	//append the listener to the enchant button.  Note at the moment no care is taken to ensure we have succeeded. So it's a bit shit at the moment.
  enchantforms.snapshotItem(0).firstElementChild.addEventListener("click",enchantevent,true);
	var itemselect=enchantforms.snapshotItem(0).firstElementChild.nextElementSibling;
	var itemcount=itemselect.length;
	var test; 

	var decodetext="";
	for(var i=0;i<itemcount;i++){
			test=GM_getValue(itemselect[i].value,"");
			if(test!=""){
				decodetext=decodeenchant(test);	
				itemselect[i].title=decodetext;	
				//and we ought to add it as title text to the inventory.
				var inventoryheaders = document.evaluate(
					"//th[starts-with(.,'Item')]", 
					document, 
					null,
					XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
					null
					);
				if(inventoryheaders.snapshotLength>0){
					var inventoryheader=inventoryheaders.snapshotItem(0);
					  //as we are getting items in ventory using the drop item for id and magic items can't be dropped we ignore them.
						var nonmagicitems=document.evaluate(
						".//tr[td/a[contains(@href,'item="+itemselect[i].value+"')]]",
						inventoryheader.parentNode.parentNode, 
						null,
						XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
						null
						);
						if (nonmagicitems.snapshotLength>0){nonmagicitems.snapshotItem(0).title=decodetext;}
				}
		  }
	}
}

var attackenchanted = document.evaluate( 
	"//select[@name='attacking_with_item_id']/option[contains(text(),'(enchanted)')]",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
if (attackenchanted.snapshotLength>0){	
//	alert(""+attackenchanted.snapshotLength);
	var weapon;
	for(i=0;weapon=attackenchanted.snapshotItem(i);i++){
	//alert("here");
		var weaponenchantlist=GM_getValue(weapon.value,"");
		//weaponenchantlist='abcdefghijk';
		if(weaponenchantlist!=""){
			var damstring="";
			var lastdamage=weaponenchantlist.match(/([bcdeghil])([^bcdeghil]*)$/);
			if (lastdamage){
				lastdamage=lastdamage[1];
				switch(lastdamage){
					//case'a':damstring+='accuracy/defense';break;
					case'b':damstring+='Acid?';break;
					case'c':damstring+='Arcane?';break;
					case'd':damstring+='Cold?';break;
					case'e':damstring+='Death?';break;
					//case'f':damstring='durability';break;
					case'g':damstring+='Electric?';break;
					case'h':damstring+='Fire?';break;
					case'i':damstring+='Holy?';break;
					//case'j':damstring='lighten';break;
					//case'k':damstring='poison';break;
					case'l':damstring+='Unholy?';break;
				}
				//alert(damstring);
				//<option value="6737004">Hatchet (pristine) (enchanted) - 12 dmg , 20% to hit</option>		
				
			}
			var poison=weaponenchantlist.match(/k/);
			if (poison){
				damstring+=" Poisoned?"
			}	
			if(damstring!=""){weapon.textContent=weapon.textContent.replace(/enchanted/,'enchanted - '+damstring);}		
		}
	}
}


//give selects also
//name="give_item_id"
var giveitemsel = document.evaluate( 
	"//select[@name='give_item_id']/option[contains(text(),'(enchanted)')]",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
if (giveitemsel.snapshotLength>0){	
	var encitem;
	for(i=0;encitem=giveitemsel.snapshotItem(i);i++){
	//alert("here");
		var weaponenchantlist=GM_getValue(encitem.value,"");
		var enchantcount=GM_getValue(encitem.value+"count",'0');
		//weaponenchantlist='abcdefghijk';
		if(weaponenchantlist!=""){
			var damstring="";
			var lastdamage=weaponenchantlist.match(/([bcdeghil])([^bcdeghil]*)$/);
			if (lastdamage){
				lastdamage=lastdamage[1];
				switch(lastdamage){
					//case'a':damstring+='accuracy/defense';break;
					case'b':damstring+='Acid?';break;
					case'c':damstring+='Arcane?';break;
					case'd':damstring+='Cold?';break;
					case'e':damstring+='Death?';break;
					//case'f':damstring='durability';break;
					case'g':damstring+='Electric?';break;
					case'h':damstring+='Fire?';break;
					case'i':damstring+='Holy?';break;
					//case'j':damstring='lighten';break;
					//case'k':damstring='poison';break;
					case'l':damstring+='Unholy?';break;
				}
				//alert(damstring);
				//<option value="6737004">Hatchet (pristine) (enchanted) - 12 dmg , 20% to hit</option>		
				
			}
			var poison=weaponenchantlist.match(/k/);
			if (poison){
				damstring+=" Poisoned?"
			}
			if(damstring!=""){
				encitem.textContent=encitem.textContent.replace(/enchanted/,enchantcount+' enchants - '+damstring);
			}	
			else {
				encitem.textContent=encitem.textContent.replace(/enchanted/,enchantcount+' enchants');
			}
			encitem.title=""+decodeenchant(weaponenchantlist);
		}
		else if (enchantcount>0){//we don't have the enchant type but we might have a count so at least put that in if known.
				encitem.textContent=encitem.textContent.replace(/enchanted/,enchantcount+' enchants');		
		}
	}
}


