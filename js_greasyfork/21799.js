// ==UserScript==
// @name            Twitter.com Show More Tweets Auto-Loader
// @namespace       https://github.com/their
// @version         1.1
// @include         https://twitter.com/*
// @author          DS
// @description     When you are trying to load lots of Tweets on Twitter you may end up pressing the "HOME"+"END" key combination repeatedly. This script is a workaround for this behaviour. To begin auto-loader double-click anywhere on the page. To disable auto-loader double-click anywhere on the page.
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/21799/Twittercom%20Show%20More%20Tweets%20Auto-Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/21799/Twittercom%20Show%20More%20Tweets%20Auto-Loader.meta.js
// ==/UserScript==
// Globals
var t = {
	global_on_off: false,
	global_on_off_remover: false,
	which_scroll: 0,
	input_button_scroll: null,
	input_button_remover: null,
	input_remove_amount: null,
	div_scroll_extender: null,
}
add_elements();
function add_elements() {
	// Scroll extender div to scrollIntoView
	var d = document.createElement('div');
	d.setAttribute('style', 'position:absolute;top:99999999999999999999px');
	document.body.appendChild(d);
	t.div_scroll_extender = d;
	// container
	var d = document.createElement('div');
	d.setAttribute('style', 'position:fixed;top:0;left:0;background-color:#eee;border:2px solid blue;z-index:9999999;');
	document.body.appendChild(d);
	// Auto-scroller on/off button
	var b = document.createElement('button');
	b.setAttribute('style', '');
	document.body.appendChild(b);
	b.onclick = toggle_scroll;
	b.innerText = 'Auto-Load Tweets (off)';
	t.input_button_scroll = b;
	d.appendChild(b);
	// Br
	var b = document.createElement('br');
	d.appendChild(b);
	// Show-Min toggle
	var b = document.createElement('button');
	b.setAttribute('style', '');
	d.appendChild(b);
	b.onclick = toggle_remover;
	b.innerText = 'Remove Tweets Under Threshold (off)';
	t.input_button_remover = b;
	// Br
	var b = document.createElement('br');
	d.appendChild(b);
	// Text
	d.appendChild(document.createTextNode('Remover Amount: '));
	// Show-Min amount
	var b = document.createElement('input');
	b.setAttribute('style', 'width:auto !important;text-align:center;padding:0;margin:0;');
	b.type = 'input';
	b.size = 4;
	d.appendChild(b);
	b.value = (localStorage['Twitter_Show_Min_Amount']) ? localStorage['Twitter_Show_Min_Amount'] : 10;
	b.addEventListener('keypress', function(e) {console.log(e);console.log(this.value);}, false);
	t.input_remove_amount = b;
}
function toggle_remover(e) {
	if (!t.global_on_off_remover) {
		t.global_on_off_remover = true;
		this.style.backgroundColor = 'LightGreen';
		this.innerText = 'Remove Tweets Under Threshold (on)';
		z();
	} else {
		t.global_on_off_remover = false;
		this.style.backgroundColor = '';
		this.innerText = 'Remove Tweets Under Threshold (off)';
	}
}
function toggle_scroll(e) {
	if (!t.global_on_off) {
		t.global_on_off = true;
		this.style.backgroundColor = 'LightGreen';
		this.innerText = 'Auto-Load Tweets (on)';
		scroll();
	} else {
		t.global_on_off = false;
		this.style.backgroundColor = '';
		this.innerText = 'Auto-Load Tweets (off)';
	}
}
function z() {
	if (!t.global_on_off_remover) return; // Quit
        var show_min = t.input_remove_amount.value;
	var x=document.getElementsByClassName('js-stream-item');
	for (var i=0;i<x.length;i++) {
		var nums = x[i].getElementsByClassName('ProfileTweet-actionCountForPresentation');
		var found = false;
		for (var j=0; j<nums.length; j++) {
			var n = nums[j].innerText.trim();
	            	//console.log(n*1);
			//if (n != '') // not blank
			if (n.indexOf('K') != -1) {
				n = n.replace('K', '').trim();
				n = n*1000;
			}
			if (n*1 >= show_min)
				found = true;
		}
		if (!found) {
			x[i].parentNode.removeChild(x[i]);
			return z(); // Start over.....
		}
	}
	// SetTimeout Here
	setTimeout(z, 400);
}
//z();
// On dbl click
//window.onkeypress = function(e) {
//	console.log(e.keyCode);return;
window.ondblclick = function() {
	if (t.global_on_off) {
		t.global_on_off = false;
	}
}
// scroll
function scroll() {
	if (!t.global_on_off) {
		return; // Quits
	}
	if (t.which_scroll === 0) {
		document.body.firstChild.scrollIntoView();
	} else {
		if (t.div_scroll_extender) {
			t.div_scroll_extender.scrollIntoView();
		}
		//var x = document.getElementsByClassName('spinner')[0];
		//if (x)
		//	x.scrollIntoView(); // Not...Footer, -footer
	}
	t.which_scroll = (t.which_scroll === 0) ? 1 : 0;
	window.setTimeout(scroll, 600);
}