// ==UserScript==
// @name          WASD Scroll hotkeys for websites
// @namespace     wasd_scroll
// @author        Owyn
// @version       1.1
// @description   Use WASD keys to scroll, not just arrow buttons
// @supportURL    https://github.com/Owyn/WASD_Scroll/issues
// @homepage      https://github.com/Owyn/WASD_Scroll
// @run-at        document-end
// @grant         GM_registerMenuCommand
// @sandbox		  JavaScript
// @match         http://*/*
// @match         https://*/*
// @match         file:///*/*
// @downloadURL https://update.greasyfork.org/scripts/439678/WASD%20Scroll%20hotkeys%20for%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/439678/WASD%20Scroll%20hotkeys%20for%20websites.meta.js
// ==/UserScript==

"use strict";

var scroll_window_percentage = 0.20; // from 0.0 to 1.0 (meaning 0% to 100%) how much WASD scrolls of the screen
var space_scroll_by = 0.80; // how much space it scrolls of the screen - only for when "aggressive mode" is On
var scroll_speed = "smooth"; // "smooth" / "instant" / "auto"

window.addEventListener("keydown", onkeydown, true); // before all others - change to false to make it work after all other listeners

if (typeof GM_registerMenuCommand !== "undefined")
{
	GM_registerMenuCommand("WASD Scroll - Disable (this once)", disable, "w");
    GM_registerMenuCommand("WASD Scroll - toggle aggressive mode for this website", wasd_toggle, "a");
}

if (typeof KeyEvent === "undefined")
{
	var KeyEvent = {
		DOM_VK_A: 65,
		DOM_VK_D: 68,
		DOM_VK_S: 83,
		DOM_VK_W: 87,
        DOM_VK_SPACE: 32,
	};
}

var inputs = ['input', 'select', 'button', 'textarea'];

function onkeydown (b)
{
	let a = (window.event) ? b.keyCode : b.which;
    let by = window.innerHeight * scroll_window_percentage
	if (b.altKey || b.ctrlKey || b.metaKey)
	{
		return;
	}

	let activeElement = document.activeElement;
    //console.warn(activeElement);
    //console.warn(b.target);
	if (activeElement && (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 || activeElement.contentEditable === "true"))
	{
		return;
	}
    let whatWeScroll = window; //document.body; // or window ?
    let aggro = localStorage.getItem('WASD_AGGR') ? true : false;
    let everything = aggro ? document.querySelectorAll("*") : []; // lets scroll everything, we can't miss that way!
    for (let i = 0; i <= everything.length; i++)
    {
	switch (a)
	{
	case KeyEvent.DOM_VK_D:
		whatWeScroll.scrollBy({
			top: 0,
			left: by,
			behavior: scroll_speed
		});
            if(aggro) b.stopImmediatePropagation();
		break;
	case KeyEvent.DOM_VK_A:
		whatWeScroll.scrollBy({
			top: 0,
			left: by * -1,
			behavior: scroll_speed
		});
            if(aggro) b.stopImmediatePropagation();
		break;
	case KeyEvent.DOM_VK_W:
		whatWeScroll.scrollBy({
			top: by * -1,
			left: 0,
			behavior: scroll_speed
		});
            if(aggro) b.stopImmediatePropagation();
		break;
	case KeyEvent.DOM_VK_S:
		whatWeScroll.scrollBy({
			top: by,
			left: 0,
			behavior: scroll_speed
		});
            if(aggro) b.stopImmediatePropagation();
		break;
    case KeyEvent.DOM_VK_SPACE:
        if(!aggro) return;
		whatWeScroll.scrollBy({
			top: window.innerHeight * space_scroll_by * (b.shiftKey ? -1 : 1),
			left: 0,
			behavior: scroll_speed
		});
            b.preventDefault();
            b.stopImmediatePropagation();
		break;
    default:
        return;
	}
        whatWeScroll = everything[i];
    }
}

function disable()
{
	window.removeEventListener("keydown", onkeydown, false);
	console.warn("WASD Scroll disabled");
}

function wasd_toggle()
{
	console.warn("WASD aggressive mode toggled");
    if(localStorage.getItem('WASD_AGGR'))
    {
        localStorage.removeItem('WASD_AGGR');
        alert("OFF - now WASD scrolling is back to normal");
    }
    else
    {
        localStorage.setItem('WASD_AGGR', "1");
        alert("ON - now WASD scrolling will try to scroll EVERY element on the page and block origianl WASD-site hotkeys (if present), and own spacebar scroll will be added as well, this is remembered per-site (via cookies LocalStorage)");
    }
}
