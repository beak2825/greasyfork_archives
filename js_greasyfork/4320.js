// ==UserScript==
// @name		BvS Zombja Hotkeys
// @namespace	taltamir
// @description	Hotkeys for BvS Zombjas
// @version     3
// @history		3 Removed searching from contextual action button. Tweaked hospital strategy (heal infection, then fight, then heal HP). Added special key for searching specifically (L). version by taltamir.
// @history		2 Optimized strategy. added heal infection, heal HP, and search. Instead of keys surrounding G, use numpad and keys surrounding S (left and right handed options). switched include to match. rewrote almost all code. fixed bug where key detected press rather than relese despite notes saying otherwise. version by taltamir
// @history		1.0 Initial version by Authority2
// @match		http://www.animecubed.com/billy/bvs/zombjas.html
// @match		http://animecubed.com/billy/bvs/zombjas.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18808/BvS%20Zombja%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/18808/BvS%20Zombja%20Hotkeys.meta.js
// ==/UserScript==

/*
Key notes:
numpad 1 = 97
numpad 2 = 98
numpad 3 = 99
numpad 4 = 100
numpad 5 = 101
numpad 6 = 102
numpad 7 = 103
numpad 8 = 104
numpad 9 = 105

q = 81
w = 87
e = 69
a = 65
s = 83
d = 68
z = 90
x = 88
c = 67
*/

function submit_form(form_name)
{
	if (document.forms.namedItem(form_name))
	{
		remove_listener();											//Remove keypress listener before page refresh
		location.assign('javascript:' + form_name + '.submit()');
	}
}

function key_press(event)
{
	if (document.forms.namedItem("theworldends"))					//If player pin is available, take it no matter what was pressed
	{
	   	submit_form("theworldends");
	}
	else if (event.keyCode==81 || event.keyCode==103)				//keypress N7 or q = upleft.
	{
   		submit_form("moveul");										//move
	}
	else if (event.keyCode==87 || event.keyCode==104)				//keypress N8 or w = up.
	{
   		submit_form("moveu");										//move
	}
	else if (event.keyCode==69 || event.keyCode==105)				//keypress N9 or e = upright.
	{
   		submit_form("moveur");										//move
	}
	else if (event.keyCode==65 || event.keyCode==100)				//keypress N4 or a = left.
	{
   		submit_form("movel");										//move
	}
	else if (event.keyCode==68 || event.keyCode==102)				//keypress N6 or d = right.
	{
   		submit_form("mover");										//move
	}
	else if (event.keyCode==90 || event.keyCode==97)				//keypress N1 or z = downleft.
	{
   		submit_form("movedl");										//move
	}
	else if (event.keyCode==88 || event.keyCode==98)				//keypress N2 or x = down.
	{
   		submit_form("moved");										//move
	}
	else if (event.keyCode==67 || event.keyCode==99)				//keypress N3 or c = downright.
	{
   		submit_form("movedr");										//move
	}
	else if (event.keyCode==83 || event.keyCode==101)				//keypress N5 or s = middle aka actions.
	{
   		action();													//action
	}
	else if (event.keyCode==76)										//keypress L
	{
		submit_form("zsearch");										//Search
	}
}

function action()
{
	if (document.forms.namedItem("zheal"))				//Check if there is a Heal Infection button
	{
		submit_form("zheal");							//Heal Infection (self)
	}
	else if (document.forms.namedItem("thrillers"))		//Check if there is an fight Thrillers button
	{
		submit_form("thrillers");						//Fight
	}
	else if (document.forms.namedItem("barglers"))		//Check if there is an fight Barglers button
	{
		submit_form("barglers");						//Fight
	}
	else if (document.forms.namedItem("thumpers"))		//Check if there is an fight Thumpers button
	{
		submit_form("thumpers");						//Fight
	}
	else if (document.forms.namedItem("noms"))			//Check if there is an fight Noms button
	{
		submit_form("noms");							//Fight
	}
	else if (document.forms.namedItem("zfight"))		//Check if there is an fight Zombjas button
	{
		submit_form("zfight");							//Fight
	}
	else if (document.forms.namedItem("zhpheal"))		//Check if there is a Heal HP button
	{
		submit_form("zhpheal");							//Heal HP (self)
	}
}

var div=document.createElement("div");
	div.innerHTML="<font color=#FFFFFF face=Verdana><b>Zombjas Hotkeys</b> <br/> Use numpad or keys around S to move. <br/> Press numpad 5 or S key for actions in order: <br/> Heal Infection > Thriller > Bargler > Thumper > Nom > Zombja > Heal HP <br/> Press L to search </font>";
	document.evaluate("//table[@width=910]/tbody/tr/td/table/tbody/tr/td",
	document, null, XPathResult.ANY_TYPE, null ).iterateNext().appendChild(div);

function remove_listener()
{
	window.removeEventListener("keyup", key_press, false); 			// Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
}

window.addEventListener("keyup", key_press, false);					//When a key is released, run function key_press and provide it with keyID.
