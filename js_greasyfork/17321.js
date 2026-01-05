// ==UserScript==
// @name             ScrollTo_Y | Vivre
// @description    Autoscroll to set Y-position on specific Hosts
// @version          0.2 - 27.02.16
// @author           Vivre
// @namespace	   https://greasyfork.org/en/users/31346-vivre
// @include         *
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/17321/ScrollTo_Y%20%7C%20Vivre.user.js
// @updateURL https://update.greasyfork.org/scripts/17321/ScrollTo_Y%20%7C%20Vivre.meta.js
// ==/UserScript==


// ***********************************************************************
// NOTE
// Original ScrollToY was published on userscripts.org by "@namespace http://henrik.nyh.se"
// It stopped runing and the author was unavailable.
// 
// This now is an updated and altered version of the original.
// It offers a Greasemonkey menu entry to set and save the desired scrollTo-position for the current host.
// HowTo:
// Scroll to a certain position on a given page that you'd like to become the default scroll-position 
// whenever you visit that side. Than choose "ScrollTo_setY" from the GreasemonkeyMenu to save 
// this specific setting. A simple alert will popup to varify the setting took place. [*see below]
// A setting can be changed anytime by repeating the above described procedure.
// A setting-value of '0' will remove the given host-entry from the setting on the whole.
// 
// enjoy ~ Vivre
// ***********************************************************************
// 
// version  0.2 - 27.02.16: new: checkZero() to remove obsolete values
// version  0.1 - 22.02.16: initial release
// 
// ***********************************************************************



// * Setting:
var showAlert = 1    // assign 0/1 to en-/disable the verifying popup


// ***** Scrolling to stored y ***** 

var ys = eval(GM_getValue('ys', '({})'));
var host = location.hostname.replace( /^www\./i, '');
var y = ys[host];

function scrollToY() {
	window.scrollTo(window.pageXOffset, y);
	}

if (y) {
	scrollToY();
// if (y && window.pageYOffset != y) // Wait for images to load and extend page
// window.addEventListener("load", scrollToY, false);
	}



// ***** Storing host and y-scroll value ***** 

function GM_setY(){
	ys[host] = window.pageYOffset; 
// Wrapped in setTimeout for http://wiki.greasespot.net/0.7.20080121.0_compatibility
	if (!showAlert) {
		setTimeout(function() {GM_setValue('ys', ys.toSource()); checkZero();}, 500);
		} else  {
		setTimeout(function() {GM_setValue('ys', ys.toSource()); 
	
		if (ys[host] == 0){
			alert(host +": set value - " +ys[host]  +"\n\n*"+ host + "* will be removed from the setting"); 
			checkZero();
			} else {alert(host +": set value - " +ys[host]); }
		}, 500);
		};

	// ***** Remove obsolete values

	function checkZero() {
		if (ys[host] == 0){
			var settings = GM_getValue('ys');
			settings = settings.replace('({', '').replace('})', '');
			newset = new Array();
			
			if (settings){
				set = settings.split(',')
				for(var i=0; i<set.length; i++){
					if (!set[i].match(':0')){
						newset.push(set[i]);
					}
				}
				newset = '({' +newset+ '})'; 
				GM_setValue('ys', newset);
			}
		}
	};
};


GM_registerMenuCommand("ScrollTo_setY", GM_setY);


// alert('end of script'); 