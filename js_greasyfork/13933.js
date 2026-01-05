// ==UserScript==
// @name        Nexus Clash Display Known Classes
// @namespace   http://userscripts.org/users/125692
// @description Stores some known character classes and adds then to Game interface.
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version     1.5
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13933/Nexus%20Clash%20Display%20Known%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/13933/Nexus%20Clash%20Display%20Known%20Classes.meta.js
// ==/UserScript==
var characterlinks;  
var characterlink;
var charid;
var charclass;
var charpagemaxtier;
var currentsetting;
var attacksetting;
if(window.location.href.match(/name=Game&op=faction&do=roster$/)){
  characterlinks = document.evaluate(
	  "//a[starts-with(@href,'modules.php?name=Game&op=character&id=')]",
	  document, 
	  null,
	  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	  null
  );
  //alert("running");
  if (characterlinks.snapshotLength>0){
    //alert(characterlinks.snapshotLength);
    for(i=0;characterlink=characterlinks.snapshotItem(i);i++){
      charid=characterlink.href.match(/\d+$/);
      //charid='#'+charid+"#";//non fixed length number needs to be made unique.
      charclass=characterlink.parentNode.nextElementSibling.nextElementSibling.textContent;
      //alert(charid+":"+charclass);
      GM_setValue(''+charid,charclass);
    }
  }
}
else if(window.location.href.match(/name=Game&op=character&id=/)){
//we are at a character page. Might as well take the id and the highest class.
//as the class line has the undelimited class plus previous classes we instead look for the class headings and take from there        
//<a href="wiki/index.php/Eternal Soldier">
//<b>Eternal Soldier</b>
//</a>
    characterlinks = document.evaluate(
	  "//a[starts-with(@href,'wiki/index.php/')]",
	  document, 
	  null,
	  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	  null
  );
  if (characterlinks.snapshotLength>0){
        charid=window.location.href.match(/\d+$/);
    if (!isNaN(charid)){
      //class we want is the last in the list
      charpagemaxtier=characterlinks.snapshotLength-1;//2 here equals t3
      while(characterlinks.snapshotItem(charpagemaxtier).href.match(/wiki\/index.php\/$/)&&charpagemaxtier>0){
        charpagemaxtier-=1;
      }
      charclass=characterlinks.snapshotItem(charpagemaxtier).firstElementChild.textContent;// text of the <b> child node
      if (charclass!=""){
       GM_setValue(''+charid,charclass);
      }
    } 
  }
  
  //while we are on the character page we ought to set a button and store away the settings.
  //either we have character class as text inline or we set as title text.
	var anewdiv=document.createElement('div');
  var anewp=document.createElement('p');
  var anewform=document.createElement('form');
	var radbut1=document.createElement('input');
  var radbut1text=document.createTextNode("As inline text");
	var radbut2=document.createElement('input');
  var radbut2text=document.createTextNode("As mouse over text");
	var brtag=document.createElement('br');
  var checkbox1=document.createElement('input');
  var checkbox1text=document.createTextNode("List known classes in attack dropdown");
	anewp.textContent="Set the display type for Nexus Clash Display Known Classes";
	
  radbut1.name="classlistsetting"; 
	radbut1.value="inline";
  radbut1.type='radio';

  radbut2.name="classlistsetting"; 
	radbut2.value="titletext";
  radbut2.type='radio';
  
  checkbox1.name="attackdropdownsetting";
	checkbox1.value='showclass4attack';
  checkbox1.type='checkbox';
  
  anewdiv.style="background-color:lightgrey";
  //anewdiv.style="display:inline-block"; 
  anewform.insertBefore(checkbox1,anewform.lastElementChild);//this ends up last
	anewform.insertBefore(radbut2,anewform.lastElementChild);//then this before
	anewform.insertBefore(radbut1,anewform.lastElementChild);//then this ends up on top.
	anewform.insertBefore(brtag,anewform.lastElementChild);
 
  anewform.insertBefore(radbut1text,radbut1.nextElementSibling);
  anewform.insertBefore(radbut2text,radbut2.nextElementSibling);
  anewform.insertBefore(checkbox1text,checkbox1.nextElementSibling);
  
  anewdiv.insertBefore(anewform,anewdiv.firstElementChild);
  anewdiv.insertBefore(anewp,anewdiv.firstElementChild);
//  anewdiv.appendChild(checkbox1);//,anewdiv.lastElementChild);

  //get setting for whether to show class info in attack dropdown.
  attacksetting=GM_getValue('attacksetting',false);
  if (attacksetting){
		checkbox1.checked=true;
	}
	else {
		checkbox1.checked=false;
	}
  
  //get the current description pane setting (or set it up if not already set)
	currentsetting=GM_getValue('textsetting','');
	if (currentsetting=='titletext'){
		radbut2.checked=true;
	}
	else if (currentsetting==""){
		GM_setValue('textsetting','inline');
		currentsetting='inline';
		radbut1.checked=true;
	}
	else {
		radbut1.checked=true;
	}
  //this event for the sett whether show class in attack dropdown
  var setattack=function(e) {
		var ebutton=e.target;
		GM_setValue('attacksetting',ebutton.checked);
	}
  //this the event for toggling the display type in description pane
	var setevent=function(e) {
		var ebutton=e.target;
		GM_setValue('textsetting',ebutton.value);
	}
	//value="Visit User Profile"
	
	characterlinks = document.evaluate(
    //"//input[starts-with(@value,'Visit User Profile')]",
   "//body",
    document, 
	  null,
	  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	  null
    );
    if (characterlinks.snapshotLength>0){
		characterlinks.snapshotItem(0).insertBefore(anewdiv,characterlinks.snapshotItem(0).lastElementChild);
		radbut1.addEventListener("click",setevent,true);
		radbut2.addEventListener("click",setevent,true);
    checkbox1.addEventListener("change",setattack,false);  
	}
  
}
else{//if not on roster page storing the class value maybe we are on the game page and we ought to add the class names.
  //we want this link type and we want to grab the id number. gm_getvalue the class and then add it and a comma after the name.
  //<a href="javascript:SelectItem('target_id','996')" class="faction">a playful otter </a>
  characterlinks = document.evaluate(
	  "//a[starts-with(@href,'javascript:SelectItem')]",
	  document, 
	  null,
	  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	  null
  );
  //alert("running");
  if (characterlinks.snapshotLength>0){
  //get setting  
 	currentsetting=GM_getValue('textsetting','');
	if (currentsetting==""){
		GM_setValue('textsetting','inline');
		currentsetting='inline';
	}
    //alert(characterlinks.snapshotLength);
    for(i=0;characterlink=characterlinks.snapshotItem(i);i++){
      charid=characterlink.href.match(/\d+/);
      //charid='#'+charid+"#";//non fixed length number needs to be made unique.
      charclass = GM_getValue(""+charid,"");
      if(charclass!=""){
        if(currentsetting=='inline'){
          GM_addStyle("A.classlevel{color:#666666; font-size:.8em;font-style: italic; }");
          //charclass=charclass[0].match(/[AEIOU]/)?", an "+charclass:", a "+charclass; // and a or an
          characterlink.nextElementSibling.textContent=charclass+"-"+characterlink.nextElementSibling.textContent; 
          characterlink.nextElementSibling.className='classlevel';
        }
        else{
          characterlink.nextElementSibling.title=charclass;
        }
      }  
    }
  }
  //now look to see if we have set to show in the attack dropdown and if so the list known classes there.
  attacksetting=GM_getValue('attacksetting',false);
  if(attacksetting){
    
//<select id="combat_target_id" name="target_id">
//<option value="996">a playful otter</option>
//</select>
    
     characterlinks = document.evaluate(
	  "//select[@id='combat_target_id']/option",
	  document, 
	  null,
	  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	  null
  );
      if (characterlinks.snapshotLength>0){
        for(i=0;characterlink=characterlinks.snapshotItem(i);i++){
          charid=characterlink.value;
          charclass = GM_getValue(""+charid,"");
          if(charclass!=""){
            characterlink.textContent+=" - "+charclass;
          }
        }
      }   
  }
  
}