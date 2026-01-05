// ==UserScript==
// @name           Nexus Clash Add Drop Item Safety Check Box
// @namespace      http://userscripts.org/users/125692
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @description    Make it a tad harder to drop things
// @grant   none
// @version   1.1.2
// @downloadURL https://update.greasyfork.org/scripts/315/Nexus%20Clash%20Add%20Drop%20Item%20Safety%20Check%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/315/Nexus%20Clash%20Add%20Drop%20Item%20Safety%20Check%20Box.meta.js
// ==/UserScript==
//for nexus clash. this script adds a checkbox for each drop button and disables the button until the checkbox is checked.
(function() {

function addGlobalStyle(css,idname) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    if(!(typeof idname === "undefined")){style.id=idname;}
	style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('a.MageHide { display: none !important; }');
addGlobalStyle('td.Magedropcell {position:relative;white-space: nowrap !important;overflow-x:visible;}');
addGlobalStyle('td.MageNoWrap {white-space: nowrap !important;overflow-x:visible;}');
addGlobalStyle('span.magedropboxdiv{position:absolute;padding:0px;}');
addGlobalStyle('form.magedropcheckbox{position:relative;padding:0px 3px 0px 0px;top:-5px;vertical-align:middle;}');
addGlobalStyle('a.magesmallerdroptext{font-size:smaller;}');
var newbox;
var acell;
var loc=location+'';//lol cludgy

//1 - drop buttons
//if (loc.match(/buyskills/)){
//do the item drop first by assuming we are on the right page and just looking for things with the item_drop class
   var elementsDropButtons = document.getElementsByClassName('item_drop');
	if(elementsDropButtons.length>0){//skip if we have none
    var elementDropButton;
	var rchange=function(e) {
                var targetbutton=e.target.parentNode.previousElementSibling;
                if(e.target.checked){
                    targetbutton.style.visibility='visible';
                }
                else{
                    targetbutton.style.visibility='hidden';
                }
            }
    for (i=0;i<elementsDropButtons.length;i++){
        elementDropButton=elementsDropButtons[i];
        if (!elementDropButton.hasAttribute('mageconfirmflag')){//see if flag not set
            elementDropButton.setAttribute('mageconfirmflag',1);//set flag
            newbox=document.createElement('input');
			newboxdiv=document.createElement('span');//the containing div
			newboxdiv.className="magedropboxdiv";
            newbox.type='checkbox';
            newbox.checked=false;
			newbox.className='magedropcheckbox';
            newbox.addEventListener("click",rchange,false);
            acell=elementDropButton.parentNode;
            acell.className='Magedropcell';//set class for nowrap so doesn't fubar page
            //acell.align='left';
			newboxdiv.insertBefore(newbox,newboxdiv.firstChild);//appendChild(newbox);
            acell.insertBefore(newboxdiv,elementDropButton.nextElementSibling);
            elementDropButton.style.visibility='hidden';
        }
    }
	}
//2 - learn spell gem buttons 
//now we do the spellgem learn buttons
     elementsDropButtons = document.getElementsByClassName('item_use');
	if(elementsDropButtons.length>0){
  //  elementDropButton;
  var rchange=function(e) {
                var targetbutton=e.target.nextElementSibling;//button should be next element
                if(e.target.checked){
                    targetbutton.style.visibility='visible';
                }
                else{
                    targetbutton.style.visibility='hidden';
                }
            }
    for (i=0;i<elementsDropButtons.length;i++){
        elementDropButton=elementsDropButtons[i];
        if (!elementDropButton.innerHTML.match(/Learn/)){
        continue;
        }
        if (!elementDropButton.hasAttribute('mageconfirmflag')){//see if flag not set
            elementDropButton.setAttribute('mageconfirmflag',1);//set flag
            newbox=document.createElement('input');
            newbox.type='checkbox';
            newbox.checked=false;
            newbox.addEventListener("click",rchange,false);
            acell=elementDropButton.parentNode;
            //acell.className='MageNoWrap';//set class for nowrap so doesn't fubar page
            //acell.align='center';
            acell.insertBefore(newbox,elementDropButton);
            elementDropButton.style.visibility='hidden';
        }
    }
	}

//TWEAK 3- craft button safety
//and now we do craft button
    //elementsDropButtons = document.getElementsByClassName('item_use');
    var elementsCraftButtons = document.getElementsByTagName('input');//get all input   
    var elementCraftButton;
	            var rchange2=function(e) {
                var targetbutton=e.target.nextElementSibling;//button should be next element
                if(e.target.checked){
                    targetbutton.disabled=false;    
                }
                else{
                    targetbutton.disabled=true;
                }
            }
    for (i=0;i<elementsCraftButtons.length;i++){
        elementCraftButton=elementsCraftButtons[i];
        if (elementCraftButton.type!="submit"||elementCraftButton.value!="Craft"){//but sometimes isn't
            continue;//well we tried to find it but couldn't so abort it all.
        }
        if (!elementCraftButton.hasAttribute('mageconfirmflag')){//see if flag not set
            elementCraftButton.setAttribute('mageconfirmflag',1);//set flag
            var craftbox=document.createElement('input');
            craftbox.type='checkbox';
            craftbox.checked=false;
            craftbox.addEventListener("click",rchange2,false);
            acell=elementCraftButton.parentNode;
            //acell.className='MageNoWrap';//set class for nowrap so doesn't fubar page
            //acell.align='center';
            acell.insertBefore(craftbox,elementCraftButton);
            //elementCraftButton.style.display='None';
            //elementCraftButton.style.visibility='hidden';
            elementCraftButton.disabled=true;
        }
    }
//}

//4-learn skill buttons 
//if on buy skills page;
//var loc=location+'';//lol cludgy
//well in any event check if we are on the buyskills page and add saftey boxs to skill buttons
//if this works the above code really should have been avoided by having some kind of test i suppose.
//TWEAK 4-learn skill buttons safeties 
//if on buy skills page;
//var loc=location+'';//lol cludgy
//well in any event check if we are on the buyskills page and add saftey boxs to skill buttons
//if this works the above code really should have been avoided by having some kind of test i suppose.
if (loc.match(/buyskills/)||loc.match(/executepurchase/)){
var rskillchange=function(e) {
                var targetbutton=e.target.nextElementSibling;//button should be next element
                if(e.target.checked){
                    targetbutton.disabled=false;
                }
                else{
                    targetbutton.disabled=true;
                }
            }
    var elementsSkillButtons = document.getElementsByTagName('input')//get all input   
    var elementSkillButton;
    for (i=0;i<elementsSkillButtons.length;i++){
        elementSkillButton=elementsSkillButtons[i];
        if (elementSkillButton.type!="submit"){//but sometimes isn't
            continue;//well we tried to find it but couldn't so abort it all.
        }
        if (!elementSkillButton.hasAttribute('mageconfirmflag')){//see if flag not set
            elementSkillButton.setAttribute('mageconfirmflag',1);//set flag
            //now check if we have a confirm button and if so make it red 
            if (elementSkillButton.value.match(/Confirm/)){
                elementSkillButton.style.color='red'//make it red to hightlight it
            }//'Confirm (10 CP)'
            newbox=document.createElement('input');
            newbox.type='checkbox';
            newbox.checked=false;
            newbox.addEventListener("click",rskillchange,false);
            acell=elementSkillButton.parentNode;
            //acell.className='MageNoWrap';//set class for nowrap so doesn't fubar page
            //acell.align='left';
            acell.insertBefore(newbox,elementSkillButton);
            //elementDropButton.style.display='None';
            //elementDropButton.style.visibility='hidden';
            elementSkillButton.disabled=true;
        }
    }
}
//5-leave faction button
//or perhaps we are viewing the faction page
else if (loc.match(/faction&do=view/)){//viewing faction page
var elementsSkillButtons = document.getElementsByTagName('input')//get all input   
    var elementSkillButton;
	var rfactionchange=function(e) {
                    var targetbutton=e.target.nextElementSibling;//button should be next element
                    if(e.target.checked){
                        targetbutton.disabled=false;
                    }
                    else{
                        targetbutton.disabled=true;
                    }
                }
    for (i=0;i<elementsSkillButtons.length;i++){
        elementSkillButton=elementsSkillButtons[i];
        if (elementSkillButton.type!="submit"){//but sometimes isn't
            continue;//well we tried to find it but couldn't so abort it all.
        }
        if (!elementSkillButton.hasAttribute('mageconfirmflag')){//see if flag not set
            elementSkillButton.setAttribute('mageconfirmflag',1);//set flag
            if (elementSkillButton.value=="Leave Faction"){//just do the one button here. very ineffiecent code i think
                newbox=document.createElement('input');
                newbox.type='checkbox';
                newbox.checked=false;              
                newbox.addEventListener("click",rfactionchange,false);
                acell=elementSkillButton.parentNode;
                acell.insertBefore(newbox,elementSkillButton);
                elementSkillButton.disabled=true;
            }
        }
    }
}
//6- revoke faction button
//do the revoke faction button 
//TWEAK 6- revoke faction button
//do the revoke faction button 
var factionbuttons= document.evaluate("//form[@name='stronghold']", document, null,
	    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (factionbuttons.snapshotLength>0){//if we have a faction box
    var factionbutton=factionbuttons.snapshotItem(0).firstElementChild.nextElementSibling;
    if (factionbutton.type=="submit"){//but sometimes isn't
        if (!factionbutton.hasAttribute('mageconfirmflag')){//see if flag not set
            factionbutton.setAttribute('mageconfirmflag',1);//set flag
            if (factionbutton.value.slice(0,17)=="Revoke Stronghold"){//just do the one button here.
                //alert("doing it") 
                var anewbox=document.createElement('input');
                anewbox.type='checkbox';
                anewbox.checked=false;
                var rrevokechange=function(e) {
                    var targetbutton=e.target.nextElementSibling;//button should be next element
                    if(e.target.checked){
                        targetbutton.disabled=false;
                    }
                    else{
                        targetbutton.disabled=true;
                    }
                }
                anewbox.addEventListener("click",rrevokechange,false);
                acell=factionbutton.parentNode
                acell.insertBefore(anewbox,factionbutton);
                factionbutton.disabled=true;
            }
        }
    }
}



//EOF
})();