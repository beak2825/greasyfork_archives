// ==UserScript==
// @name         Vermillion 'Bad Rep' button.
// @namespace    http://v3rmillion.net
// @version      1
// @description  To Simultaneously warn for and delete reputation with a button on each rep, for moderation.
// @author       Animus
// @match       https://v3rmillion.net/reputation.php?uid=*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/376667/Vermillion%20%27Bad%20Rep%27%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/376667/Vermillion%20%27Bad%20Rep%27%20button.meta.js
// ==/UserScript==

var repquote;
var newMesg;

unsafeWindow.makeFrame = function(initialItem, timestamp, sauce, cuntent, eleback, rLink){

	initialItem.textContent = "Warning user...";
	try { document.getElementById('BADREPFRAME').outerHTML = ""; }catch (e) {}
	var iframe = document.createElement('iframe');
	iframe.id = "BADREPFRAME";
	iframe.src = "https://v3rmillion.net/warnings.php?action=warn&uid=" + sauce;
	iframe.style.height = '400px';
	iframe.style.width = '1200px';
	rLink = rLink.split('#')[0];
	document.body.appendChild(iframe);
	iframe.onload = function() {
		if(iframe.contentWindow.location.href.indexOf('action=warn&uid') > 0){
			iframe.contentWindow.autofillz('Rule-Breaking Reputation');

			newMesg = "Dear User,\n\nYou've just been issued a warning for a reputation you gave to [url="+rLink+"]this user[/url]. The reputation was given on [b]"+timestamp+"[/b] and has now been deleted. We believe that your reputation violated our rules in some way. The reputation you gave is quoted below.\n\nIf you have any questions regarding your warning, or wish to have it explained to you, feel free to respond to this PM in a respectful manner with your inquiry. Remember, if you get 5 warnings within 3 months, you'll be subject to an automatic 1-week ban! All warnings expire after 3 months.\n\nRegards,\nVermillion Staff Team\n2016\n\n[quote]"+decodeURIComponent(cuntent)+"[/quote]";
			iframe.contentWindow.document.getElementById('message').parentNode.outerHTML = "<td><textarea rows='20' cols='70' name='pm_message' id='message' >" + newMesg + "</textarea></td>";

			iframe.contentWindow.document.getElementById('subm').click();

            //var win = window.open("modcp.php", "Report Searching Bot");
            //setTimeout(function(){
			//	win.makeReportSearch(decodeURIComponent(cuntent));
			// }, 10000);

			setTimeout(function(){
				document.getElementById(eleback).click();
			}, 3000);
			initialItem.textContent = "Done.";
		}else{
			iframe.outerHTML = "";
		}
	};
};

var btnRanges = document.getElementsByClassName("float_right postbit_buttons");
var uid;
var innerAs;
var datetime;
for (var i = 0; i < btnRanges.length; ++i) {
	if(i%2>0){
		innerAs = btnRanges[i].parentNode.getElementsByTagName('a');
		var innerDivs = btnRanges[i].parentNode.getElementsByTagName('div');
		datetime = btnRanges[i].parentNode.getElementsByClassName('smalltext')[0].textContent;
		datetime = datetime.split('updated ')[1];
		var deleteButton = innerAs[1];
		deleteButton.id = deleteButton.href;
		uid = innerAs[2].href.replace('https://v3rmillion.net/member.php?action=profile&uid=','');
		var cleanQuote = innerDivs[2].textContent.replace(/['"]+/g, '');
		cleanQuote = encodeURIComponent(cleanQuote);
		var reppedLink = window.location.href;
		btnRanges[i].innerHTML = "<a href='#"+deleteButton.id+"' onclick=\"makeFrame(this,'" + datetime + "','" + uid + '\',\'' + cleanQuote + "','" + deleteButton.href + "','" + reppedLink + "')\" class='button'><span>Bad Rep.</span></a>" + btnRanges[i].innerHTML;
	}
}