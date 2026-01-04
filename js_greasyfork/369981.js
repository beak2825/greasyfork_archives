// ==UserScript==
// @name         Neopets: Neomail Quick View
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You can view neomails without loading a new page.
// @author       Nyu (clraik)
// @match        *://*.neopets.com/neomessages.phtml*
// @exclude      *://*.neopets.com/neomessages.phtml?type=read_message*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369981/Neopets%3A%20Neomail%20Quick%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/369981/Neopets%3A%20Neomail%20Quick%20View.meta.js
// ==/UserScript==



/* It is not necessary to edit anything for this to work */


//Thanks to @AyBeCee for this part!
var newTD = document.createElement("td");
$("[name='messages'] tr:first-child").append(newTD);
newTD.setAttribute('class', 'contentModuleHeaderAlt');
newTD.style["text-align"] = "center";
newTD.innerHTML = 'Quick View';
var i=0;
$("[name='messages'] tr").not(':first').not(':last').each(function(){
	var username = $(this).find('td:nth-child(3) a').contents().filter(function() {//Not used anymore
		return this.nodeType == 2;
	}).text();
	var msgID = $(this).find('td:nth-child(4)')[0].innerHTML;
	var rrr=msgID.split("id=");
	var rdr=rrr[1].split('" style');
	var replyLink="neomessages.phtml?type=read_message&folder=Inbox&id="+rdr[0];
	var Quickview = document.createElement("td");
	$(this).append(Quickview);
	Quickview.innerHTML = '<center><a id="conf'+i+'" href="javascript:;">View</a></center>';
	$('[id="conf'+i+'"]').on('click', function() {
		$('#neoFrame').remove();
		$('#neomailPopUp').remove();
		popup(replyLink);
		hideStuff();
	});
	i++;
});









function popup(idLink){
	var popupHTML='<div id="neomailPopUp" style="width: 600px; height: 250px;" >'+
		'<a href="javascript:;" id="closeQuickView"><img src="http://images.neopets.com/altador/altadorcup/2010/ncchallenge/popups/buttons/close.png" style="margin-top:-20px;" height="43px" width="151px"></img></a>'+
		'<iframe id="neoFrame" src="'+ idLink + '" style="width: 1017px; height: 350px;-webkit-transform:scale(0.6);margin-top:-70px; margin-left:-210px;">'+
		'</iframe>'+
		'<div id="cover">&nbsp;</div>';
	popupHTML+='</div>';
	$("body").append (popupHTML);


	$('#neoFrame').load(function(){
		hideStuff();
		$('#closeQuickView').click ( function () {
			$('#neomailPopUp').remove();
		});
	});

	GM_addStyle ( ""+
				 "#neomailPopUp {"+
				 "position:               fixed;"+
				 "top:                    30%;"+
				 "left:                   20%;"+
				 "padding:                10px;"+
				 "background:             #8F7F7F;"+
				 "border:                 5px outset;"+
				 "border-radius:          10px;"+
				 "z-index:                100;"+
				 "}"+
				 "#neomailPopUp button{"+
				 "cursor:                 pointer;"+
				 "margin:                 10px 10px 0;"+
				 "border:                 none;"+
				 " }"+
				 "#conf:hover{"+
				 "cursor:                 pointer;"+
				 "}"+
				 "#cover {"+
				 "z-index:101;"+
				 "position:absolute;"+
				 "top:50px;"+
				 "left:0;"+
				 "width:100%;"+
				 "height:100%;"+
				 "}"
				);
}
function hideStuff(){
	$('#neoFrame').contents().find("#header").hide();
	$('#neoFrame').contents().find("#footer").hide();
	$('#neoFrame').contents().find("#ban").hide();
	$('#neoFrame').contents().find("#navigation").hide();
	$('#neoFrame').contents().find(".sidebar").hide();
	$('#neoFrame').contents().find("div [align='center']").hide();
	$('#neoFrame').contents().find("a:contains('this')").hide();
	$('#neoFrame').contents().find("a:contains('rules')").hide();
	$('#closeQuickView').click ( function () {
		$('#neomailPopUp').hide();
	});
}
