// ==UserScript==
// @name           AO3 Story Highlighter
// @namespace      ao3highlighter
// @description    Highlights certain character names according to fandom.
// @version        1.0
// @include        https://archiveofourown.org/works/*
// @include        https://archiveofourown.org/chapters/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396077/AO3%20Story%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/396077/AO3%20Story%20Highlighter.meta.js
// ==/UserScript==

// main characters
var mcArray = new Array(
/*
A SONG OF ICE AND FIRE
*/
	// STARKS
	'Jon(?! (?:Arryn|Connington))(?: (?:Snow|Stark|Targaryen))?|Jae(?:haerys)?(?: Targaryen)?',
	'Arya(?: Stark)?|Arry',
	'Sansa(?: Stark)?',

	// LANNISTERS
	'Tyrion(?: Lannister)?|Imp',

	// MIXED
	'Gendry(?: Waters)?',
	'Sam(?:well)?(?: Tarly)?'
);

// secondary characters
var scArray = new Array(
/*
	A SONG OF ICE AND FIRE
*/
	// STARKS
	'Cat(?:elyn)?(?: (?:Tully|Stark))?',
	'(?:Ned|Eddard)(?: Stark)?',
	'Rickon(?: Stark)?',
	'Robb(?: Stark)?',
	'Lyanna(?: Stark)?',

	// LANNISTERS
	'Genna(?: (?:Lannister|Frey))?',
	'Jaime(?: Lannister)?|Kingslayer',
	'Tywin(?: Lannister)?',

	// MIXED
	'Hodor',
	'Osha',
	'Meera(?: Reed)?',
	'Brienne(?: of Tarth)?' 
);

//////////////////////////////////////////////////////////////////////
//			DO NOT EDIT BEYOND THIS LINE
//////////////////////////////////////////////////////////////////////

$('<style type="text/css"> .ao3storyhighlighter-mc { background-color: #cc0; color: #000; padding-left: 4px; padding-right: 4px; } .ao3storyhighlighter-sc { background-color: #aaa; color: #111; padding-left: 4px; padding-right: 4px; } </style>').appendTo('head');

var REGEX_prefix = '/([^a-z0-9]|^)(';
var REGEX_suffix = ')([^a-z0-9]|$)/g';

for(var i = 0; i < mcArray.length; i++)
{
	$('div#chapters').html(
		$('div#chapters').html().replace(
			eval(REGEX_prefix + mcArray[i] + REGEX_suffix),
			'$1<span class="ao3storyhighlighter-mc">$2</span>$3'
		)
	);
}

for(var i = 0; i < scArray.length; i++)
{
	$('div#chapters').html(
		$('div#chapters').html().replace(
			eval(REGEX_prefix + scArray[i] + REGEX_suffix),
			'$1<span class="ao3storyhighlighter-sc">$2</span>$3'
		)
	);
}

$("div#share").hide();
