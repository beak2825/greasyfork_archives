// ==UserScript==
// @name         Clanheart Shoutbox Nuker
// @namespace    fortytwo
// @version      1.1
// @description  Removes the shoutbox. Go to http://www.clanheart.com/settings and look for the "Hide shoutbox option".
// @author       fortytwo
// @match        http://www.clanheart.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @homepageURL	 https://greasyfork.org/en/users/14247-fortytwo
// @supportURL	 http://games-fortytwo.tumblr.com/tagged/shoutbox%20nuker
// @noframes
// @compatible	 chrome
// @compatible	 firefox
// @downloadURL https://update.greasyfork.org/scripts/11695/Clanheart%20Shoutbox%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/11695/Clanheart%20Shoutbox%20Nuker.meta.js
// ==/UserScript==
/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR DAMAGE TO YOUR DEVICE.

	WHILE THE SCRIPT IS UNLIKELY TO CAUSE ANY HARM, AS WITH ALL TECHNICAL
	COMPONENTS, BUGS AND GLITCHES CAN HAPPEN.

	IF THE SCRIPT ISN'T WORKING FOR YOU, FEEL FREE TO SEND ME A MESSAGE: http://games-fortytwo.tumblr.com/
***/

(function(){
	//ensure we're not in an iframe if the @noframes fails
	//http://stackoverflow.com/a/326076
	function inIframe(){
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}

	if(inIframe()){
		return;
	}

	var page			= window.location.pathname,
		hideShoutbox	= GM_getValue('hideShoutbox', false),
		head			= $("head");

	if(hideShoutbox){
		//might make it quicker idk
		var style = $("<style>.widget < #shoutbox-panel { display: none; }</style>").appendTo(head);
		//remove the shoutbox WIDGET and also clear the ajax timer to stop the page from calling it
		$('#shoutbox-panel').parent().remove();
		$("<script>window.clearInterval(window.shoutboxTimer);</script>").appendTo(head).remove();
		style.remove();
	}

	//for settings page
	if(page == "/settings"){
		//need to use the form to make sure we get the right button
		var button = $("form[action='http://www.clanheart.com/settings/update']").children("input[type='submit']");

		var content = $(
		'<div class="form-group">'+
			'<label for="name-in" class="col-md-3 label-heading">Hide shoutbox</label>'+
			'<div class="col-md-12">'+
				 '<input type="checkbox" name="chss-enable" />'+
				 '<span class="help-block">(Shoutbox Nuker) If you want to hide the shoutbox, check this. The change will be reflected on the next page.</span>'+
			'</div>'+
		'</div>').insertBefore(button);
		
		$('input[name="chss-enable"]')
		.attr('checked', GM_getValue('hideShoutbox', false))
		.on('click', function(){
			GM_setValue('hideShoutbox', this.checked);
		});
	}
})();