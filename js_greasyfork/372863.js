// ==UserScript==
// @name        WG Gesucht WERBUNG STOP ALPHA
// @namespace   github.com/SINE
// @author       SINE
// @version     0.2.2
//@updateURL   https://raw.githubusercontent.com/SINE/WGGesucht/master/WerbeSTOP/WerbeSTOP.meta.js
// @require			https://code.jquery.com/jquery-2.2.0.min.js
// @include     https://www.wg-gesucht.de/*
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @run-at			document-end
// @noframe
// @description Diese Repository ist als Open-Source Userscript-Sammlung für die Webseite WG-Gesucht angedacht. Die Userscripte sind rein clientseitig per Browser-Addon Tampermonkey bzw. Greasemonkey installierbar.
// @downloadURL https://update.greasyfork.org/scripts/372863/WG%20Gesucht%20WERBUNG%20STOP%20ALPHA.user.js
// @updateURL https://update.greasyfork.org/scripts/372863/WG%20Gesucht%20WERBUNG%20STOP%20ALPHA.meta.js
// ==/UserScript==


var devlogON = 0;


var outerEntryWrapper = document.querySelector("#master_wrapper #main_content");
if( outerEntryWrapper ) {
	handle_entry(outerEntryWrapper);
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(parseMutations);
  observer.observe(outerEntryWrapper, {childList: true, subtree: false});
}

function parseMutations(mutations) {
	mutations.forEach(function (mutation) {
		devlog(	"---mutation---: \nadded nodes: "+mutation.addedNodes+"\nremoved nodes: "+mutation.removedNodes+"\ntype:"+mutation.type+"\n---mutation info end---");
		if (!mutation.addedNodes || mutation.addedNodes.length === 0) {	devlog("mutation exception, length null or no added nodes! returning!");	return;	}
		else devlog("added nodes length: "+mutation.addedNodes.length);

		if( mutation.addedNodes.length > 1 ){
			makeArray(mutation.addedNodes).forEach(function (node) {
				if (node.id.toLowerCase() === 'main_column') {
            devlog("YES: mutation added node id:"+node.id.toLowerCase());
						handle_entry(node);
				} else {
          devlog("NO: mutation added node doesn't match main_column");
        }
			});
		} /*else {
			//devlog(	"addedNode[0]: "+mutation.addedNodes[0]	);
		}*/
	});
}

function handle_entry(node) {
		var entryList = node.querySelectorAll("[id^='listAdPos'], [class$='_ad'], #ads_placeholder");
		devlog("entryList length: "+entryList.length);
		if( entryList ) {
			entryList = makeArray( entryList );
			entryList.forEach(function(postDiv){
			//	devlog("post found!");
				postDiv.remove();
			});
		}
}

///
///     EXTRA
///     GLOBALE FUNKTIONEN
///

function devlog(output) {
  if(devlogON===1) console.log("SINE-WGGESUCHT-WERBUNGSTOP: "+output);
  else return;
}

function nomultirun() {
	if( document.body.getAttribute("data-wggesucht-werbestop-fired") === null ) {
		devlog("firstrun, attaching data");
		document.body.setAttribute( "data-wggesucht-werbestop-fired",(new Date().getTime().toString()) );
		return true;
	}
	else {
		devlog("multirun blocked, parameter already set: "+document.body.getAttribute("data-wggesucht-werbestop-fired"));
		return false;
	}
}

function makeArray(o) {
		// Turn array-like objects into Arrays
		// cwestblog.com/2015/02/11/javascript-quirk-array-slicing-with-node-lists/
		try {
			return Array.prototype.slice.call(o);
		} catch (e) {}
		for (var i = 0, l = o.length, a = new Array(i); i < l; i+=1) {
			if (i in o) {
				a[i] = o[i];
			}
		}
		return a;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
