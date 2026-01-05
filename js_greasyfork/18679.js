// ==UserScript==
// @name        FIMFiction - organized emoticon panel
// @namespace   MrMetric
// @description organizes the emoticon panel
// @include     /https?://(?:www\.)?fimfiction\.net/*/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18679/FIMFiction%20-%20organized%20emoticon%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/18679/FIMFiction%20-%20organized%20emoticon%20panel.meta.js
// ==/UserScript==
'use strict';

let emoticon_names = [
	':ajbemused:',
	':ajsleepy:',
	':ajsmug:',
	':applejackconfused:',
	':applejackunsure:',
	':eeyup:',
	':trollestia:',
	':moustache:',

	':raritycry:',
	':raritydespair:',
	':raritystarry:',
	':raritywink:',
	':duck:',
	':derpyderp1:',
	':derpyderp2:',
	':derpytongue2:',

	':fluttercry:',
	':flutterrage:',
	':fluttershbad:',
	':fluttershyouch:',
	':fluttershysad:',
	':yay:',
	':coolphoto:',
	':heart:',

	':pinkiecrazy:',
	':pinkiegasp:',
	':pinkiehappy:',
	':pinkiesad2:',
	':pinkiesick:',
	':pinkiesmile:',
	':unsuresweetie:',
	':applecry:',

	':rainbowderp:',
	':rainbowdetermined2:',
	':rainbowhuh:',
	':rainbowkiss:',
	':rainbowlaugh:',
	':rainbowwild:',
	':scootangel:',
	':twistnerd:',

	':twilightangry2:',
	':twilightblush:',
	':twilightoops:',
	':twilightsheepish:',
	':twilightsmile:',
	':facehoof:',
	':trixieshiftleft:',
	':trixieshiftright:',
];

function modify_panel(panel)
{
	panel.parentNode.style.width = '310px';

	let nodes = panel.children;
	let emoticons = {};
	for(let i = 0; i < nodes.length; ++i)
	{
		let li = nodes[i];
		emoticons[li.children[0].dataset.emoticon] = li;
	}

	while(nodes.length !== 0)
	{
		panel.removeChild(nodes[0]);
	}
	for(let i = 0; i < emoticon_names.length; ++i)
	{
		let name = emoticon_names[i];
		panel.appendChild(emoticons[name]);
	}
}

let observer = new MutationObserver(function(records, observer)
{
	if(records.length === 48) // assumes there are 48 emoticons
	{
		if(records[0].addedNodes.length === 1) // ignore the panel.removeChild stuff in modify_panel
		{
			modify_panel(records[0].addedNodes[0].parentNode);
		}
	}
});

let elements = document.getElementsByClassName('button-group');
for(let i = 0; i < elements.length; ++i)
{
	let e = elements[i];
	if(e.children.length !== 1)
	{
		continue;
	}

	let button = e.children[0];
	if(button.tagName !== 'BUTTON'
	|| button.dataset.function !== 'emoticons-picker'
	)
	{
		continue;
	}

	observer.observe(e, {
		childList: true,
		subtree: true,
	});
}