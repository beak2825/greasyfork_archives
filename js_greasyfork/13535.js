// ==UserScript==
// @name         Match Result New
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://tampermonkey.net/index.php?version=3.9.131&ext=dhdg&updated=true
// @grant        none
// @include        *trophymanager.com/matches*
// @downloadURL https://update.greasyfork.org/scripts/13535/Match%20Result%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/13535/Match%20Result%20New.meta.js
// ==/UserScript==

//Match ID
var MatchId = document.URL.split(".com/")[1].split("/")[1].split("#")[0].split("?")[0];

$.ajax({ 
    type: 'GET', 
    url: 'http://trophymanager.com/ajax/match.ajax.php',
    data: { id: MatchId}, 
    dataType: 'json',
    success: function (data) { 
	//Table Report
	//
    var ObjectReport =data.report;
        var lastIndex = 0;
    if (ObjectReport==null){
    	$('.mv_top').prepend("<p align='left' style='font-family:arial;font-size:12px;'>------------------------------------------------------------------- </p> <p align='left' style='font-family:arial;font-size:12px;'>ÓßÑíÈÊ ÇáäÊÇÆÌ </p> <p align='left' style='font-family:arial;font-size:12px;'>ÈÑãÌÉ æÊÕãíã</p> <b> <p align='left' style='font-family:arial;font-size:17px;'>By Phoenix Slash™ & íÇÓãíä ÇáÔÇã </p> </b> <p align='left' style='font-family:arial;font-size:12px;'>------------------------------------------------------------------- <br></br> <b> <p align='center' style='font-family:arial;font-size:28px;color:yellow;'>™ áã ÊÈÏÃ ÇáãÈÇÑÇÉ ÈÚÏ .. ÇáÑÌÇÁ ÇáÇäÊÙÇÑ ÍÊì íÍíä æÞÊ ÇááÞÇÁ ™</p> </b>");
     }
    else{
		var size=Object.keys(ObjectReport).length;
		var keys=Object.keys(ObjectReport)[size-1];
		var lastString=data.report[keys][0].chance.text;
		//
    	var tableBefore= lastString.toString().split(' ');
        //alert(lastString);
     	for (var i = 0; i < tableBefore.length; i++) {	
    	var index = tableBefore[i].indexOf('-');
        if (index > -1) {
           lastIndex=i;
        	}      
		}  
    	$('.mv_top').prepend("<p align='left' style='font-family:arial;font-size:12px;'>------------------------------------------------------------------- </p> <p align='left' style='font-family:arial;font-size:12px;'>ÓßÑíÈÊ ÇáäÊÇÆÌ</p> <p align='left' style='font-family:arial;font-size:12px;'>ÈÑãÌÉ æÊÕãíã</p> <b> <p align='left' style='font-family:arial;font-size:17px;'>By Phoenix Slash™ & íÇÓãíä ÇáÔÇã</p> </b> <p align='left' style='font-family:arial;font-size:12px;'>------------------------------------------------------------------- <br></br> <b> <p align='center' style='font-family:arial;font-size:28px;color:yellow;'>™ äÊíÌÉ ÇáãÈÇÑÇÉ åí ™</p> </b> <p align='center' style='font-family:arial;font-size:33px;color:yellow;'<b><strong>"+tableBefore[lastIndex]+"</strong></b></p>");
    }
        
   }
});