// ==UserScript==
// @name     Pitt Omeka Contributors Email
// @version  1
// @grant    none
// @description  Adds approve/reject buttons to omeka contributors page
// @include  https://pittbgb.omeka.net/admin/contribution/contributors
// @namespace https://greasyfork.org/users/898237
// @downloadURL https://update.greasyfork.org/scripts/442826/Pitt%20Omeka%20Contributors%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/442826/Pitt%20Omeka%20Contributors%20Email.meta.js
// ==/UserScript==
 
var tbl=document.getElementsByTagName("table")[0]; //get the first TABLE
 
var trs=tbl.getElementsByTagName('tr'); //get all TR's in that table 
 
var replaceTD=function(TRindex,TDindex,value){
 trs[TRindex].getElementsByTagName('td')[TDindex].innerHTML=value; // replaced with innerText
};
 
 
 
 
 
for(var j=0; j < trs.length; j++) {
  var tds=trs[j].getElementsByTagName('td');
  for(var i=0; i < tds.length; i++) {	
	var td = tds[i].innerHTML;
	var pattern = /@/;
	if (pattern.test(td)) {
	  url= td + "<br><a href=mailto:" + td + "?subject=Your%20submission%20has%20been%20approved&body=Hello,%0D%0A%0D%0AThank%20you%20for%20your%20contribution%20to%20the%20Blue,%20Gold%20and%20Black%20Digital%20Archive.%0D%0A%0D%0AYour%20contribution%20has%20been%20added%20to%20the%20site%20and%20can%20now%20be%20viewed%20online,%20here:%20[provide%20URL%20to%20specific%20item%20if%20there%20is%20only%20one%20or%20the%20contributor%20page%20for%20that%20individual%20if%20they%20submitted%20multiple%20items]%0D%0A%0D%0AIf%20you%20have%20any%20questions%20about%20your%20submission%20or%20the%20BGB%20Digital%20Archive,%20please%20feel%20free%20to%20contact%20us%20at%20pittbgb@pitt.edu.%0D%0AThank%20you%20again%20for%20contributing%20to%20the%20archive.%0D%0A%0D%0A[Name%20of%20person%20sending%20email]%0D%0Aon%20behalf%20of%20the%20Blue,%20Gold%20and%20Black%20Digital%20Archive%20Project%20Team>Approve</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=mailto:" + td + "?subject=Your%20submission%20has%20been%20rejected&body=Hello,%0D%0A%0D%0AThank%20you%20for%20your%20contribution%20to%20the%20Blue,%20Gold%20and%20Black%20Digital%20Archive.%0D%0A%0D%0AUnfortunately,%20your%20submission%20did%20not%20meet%20the%20Terms%20and%20Conditions%20(https://pittbgb.omeka.net/contribution/terms)%20of%20the%20BGB%20Digital%20Archive%20and%20cannot%20be%20added%20to%20the%20site.%20The%20BGB%20Digital%20Archive%20Advisory%20Council%20determined%20that%20your%20submission%20could%20not%20be%20published%20to%20the%20site%20[state%20reason%20why%20item%20could%20not%20be%20published%20and%20suggestions%20for%20how%20the%20submission%20might%20be%20changed%20to%20make%20it%20compliant,%20if%20applicable].%0D%0A%0D%0AIf%20you%20have%20any%20questions%20about%20your%20submission%20or%20the%20BGB%20Digital%20Archive,%20please%20feel%20free%20to%20contact%20us%20at%20pittbgb@pitt.edu.%0D%0A%0D%0A[Name%20of%20person%20sending%20email]%0D%0Aon%20behalf%20of%20the%20Blue,%20Gold%20and%20Black%20Digital%20Archive%20Project%20Team>Reject</a>";
 
	  replaceTD(j,i,url);
	}
  }
}

