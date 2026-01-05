// ==UserScript==
// @author 		DJMiMi
// @name        Envato Forum Oldy
// @namespace   envato_forum
// @description Styles new envato forum to resamble more to old one
// @include     https://forums.envato.com/*
// @version     1.2
// @grant 		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12009/Envato%20Forum%20Oldy.user.js
// @updateURL https://update.greasyfork.org/scripts/12009/Envato%20Forum%20Oldy.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
	method:"GET",
	url:'https://greasyfork.org/en/scripts/12009-envato-forum-oldy',
	dataType:"html",
	onload:function(e){
		var newVersion = parseInt( e.responseText.split('<dd class="script-show-version"><span>')[1].split('</span>')[0].replace('.', ''), 10 );
		var currentVersion = parseInt( GM_info.script.version.replace('.', '') );
		if( newVersion > currentVersion ){
			var update = document.createElement('a');
			update.setAttribute( 'href', 'https://greasyfork.org/scripts/12009-envato-forum-oldy/code/Envato%20Forum%20Oldy.user.js' );
			update.className = 'ef_update';
			update.innerHTML = 'Update Envato Forum Oldy';
			document.querySelector('header .wrap').appendChild( update );
		}
	}
});

document.querySelectorAll('body')[0].innerHTML +='<style>.organized-posters{ position: relative; display: inline-block; vertical-align: middle; } \
	.organized-posters a:first-child, .organized-posters a.latest:first-child{ display: block; position: relative; bottom: auto; right: auto; } \
	.organized-posters a:first-child, .organized-posters a:first-child img{ height: 75px; width: 75px } \
	.main-link { position: relative } \
	.topic-post-badges{ position: absolute; display: block; top: 10px; left: 10px; } \
	.main-link .title{width: calc(100% - 120px); vertical-align: middle; display: inline-block; margin-left: 10px; padding: 0px;  font-size: 20px;} \
	.topic-list .topic-list-item .discourse-tags{ margin-top: 15px } \
	.new-topic {display: none} \
	.ef_update { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); -ms-transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); } \
	img.avatar{ border-radius: 0px; } \
	.organized-posters a:last-child{ position: absolute; bottom: -5px; right: -5px }</style>';

function organize_tr( $this ){
	$this.classList.add('organized');
	var tds = $this.querySelectorAll('td');
	for ( var i = 0; i < tds.length; ++i) {
		tds[i].style.padding = '30px 15px';
	}
	
	var $first = $this.querySelectorAll('.posters a')[0].cloneNode(true);
	var $last = $this.querySelectorAll('.posters a.latest')[0].cloneNode(true);
	
	var parent = $this.querySelectorAll('td')[0];
	var child = document.createElement("div");
	child.className = 'organized-posters';
	parent.insertBefore(child, parent.firstChild);
	
	var organizedPosters = $this.querySelector('.organized-posters');
	organizedPosters.appendChild( $first );
	organizedPosters.appendChild( $last );
	
	var image = $this.querySelectorAll('.organized-posters a')[0].querySelector('img');
	image.setAttribute('src', image.getAttribute('src').replace('25','75') );	
}

waitForKeyElements (".ember-view.topic-list tbody tr", organize_tr);

function waitForKeyElements (
	selectorTxt,    /* Required: The jQuery selector string that
						specifies the desired element(s).
					*/
	actionFunction, /* Required: The code to run when elements are
						found. It is passed a jNode to the matched
						element.
					*/
	bWaitOnce,      /* Optional: If false, will continue to scan for
						new elements even after the first match is
						found.
					*/
	iframeSelector  /* Optional: If set, identifies the iframe to
						search.
					*/
) {
	var targetNodes, btargetsFound;

	if (typeof iframeSelector == "undefined"){
		targetNodes     = document.querySelectorAll(selectorTxt);
	}
	else{
		targetNodes     = $(iframeSelector).contents ()
										   .find (selectorTxt);
	}
	if (targetNodes  &&  targetNodes.length > 0) {
		btargetsFound   = true;
		/*--- Found target node(s).  Go through each and act if they
			are new.
		*/
		for ( var i = 0; i < targetNodes.length; ++i) {
			var jThis = targetNodes[i];
			var alreadyFound = jThis.dataset.alreadyFound  ||  false;

			if (!alreadyFound) {
				//--- Call the payload function.
				var cancelFound     = actionFunction (jThis);
				if (cancelFound){
					btargetsFound   = false;
				}
				else{
					jThis.dataset.alreadyFound = true;
				}
			}				
		}
	}
	else {
		btargetsFound   = false;
	}

	//--- Get the timer-control variable for this selector.
	var controlObj      = waitForKeyElements.controlObj  ||  {};
	var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
	var timeControl     = controlObj [controlKey];

	//--- Now set or clear the timer as appropriate.
	if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
		//--- The only condition where we need to clear the timer.
		clearInterval (timeControl);
		delete controlObj [controlKey]
	}
	else {
		//--- Set a timer, if needed.
		if ( ! timeControl) {
			timeControl = setInterval ( function () {
					waitForKeyElements (    selectorTxt,
											actionFunction,
											bWaitOnce,
											iframeSelector
										);
				},
				300
			);
			controlObj [controlKey] = timeControl;
		}
	}
	waitForKeyElements.controlObj   = controlObj;
}