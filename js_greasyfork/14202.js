// ==UserScript==
// @name        AQW Staff Help Menu
// @namespace   AQW White Hats
// @description Adds a helpful nested menu for copying helpful AQW links
// @include     http://www.aq.com/play-now/*
// @version     1.1
// @grant       none
// @require https://cdn.jsdelivr.net/clipboard.js/1.5.5/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/14202/AQW%20Staff%20Help%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/14202/AQW%20Staff%20Help%20Menu.meta.js
// ==/UserScript==

var namecolor = "http://www.aq.com/gamedesignnotes/colorednameguide-5206";

var beamod = "http://www.artix.com/designNotes/post/26757/SO-YOU-WANT-TO-BE-A-MOD";
var soramodguide = "http://www.aq.com/gamedesignnotes/modFAQ-4425";

var whitehatdn = "http://www.aq.com/gamedesignnotes/whitehatdns-4692";

var modlist = "http://www.artix.com/Pages/AQWMods";
var qalist = "http://www.artix.com/Pages/AQWQA";
var devlist = "http://www.artix.com/pages/aqwstaff";


var terms = "http://www.aq.com/aw-terms.asp";
var howtoreport = "http://www.aq.com/gamedesignnotes/how-to-report-a-player-in-adventurequest-worlds-3300";
var usagepolicy = "http://www.aq.com/lore/guides/assetusageguidelines";


var contact = "http://www.aq.com/aw-contact.asp";
var support = "http://www.aq.com/help";


var howtobelorekeeper = "http://aqwwiki.wikidot.com/forum/t-710688/so-you-want-to-be-a-lorekeeper";
var wikistaff = "http://aqwwiki.wikidot.com/forum/t-1041818/wiki-mods-and-admins";

var cyseroac = "http://prntscr.com/5uebor";
var money = "http://www.artix.com/designNotes/post/26360/MONEY";
var notrade = "http://www.artix.com/designNotes/post/29313/NO-TRADE-IN-AQW";



var suggestions = "http://forums2.battleon.com/f/tt.asp?forumid=259";


var button = '<li id="helplinks" class="top"><a>Helpful Links</a></li>';
var dropdown = '<nav id="helpnav">'
+'	<ul>'





+'		<li><a>About Staff</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+namecolor+'">Name Colors</a></li>'

+'				<li><a>Become Staff</a>'
+'					<ul>'
+'						<li><a class="clip" data-clipboard-text="'+beamod+'">SO YOU WANT TO BE A MOD?</a></li>'
+'						<li><a class="clip" data-clipboard-text="'+soramodguide+'">Sora Mod Q&A</a></li>'
+'					</ul>'
+'				</li>'

+'				<li><a>Staff Lists</a>'
+'					<ul>'
+'						<li><a class="clip" data-clipboard-text="'+devlist+'">Devs</a></li>'
+'						<li><a class="clip" data-clipboard-text="'+modlist+'">Mods</a></li>'
+'						<li><a class="clip" data-clipboard-text="'+qalist+'">QA</a></li>'
+'					</ul>'
+'				</li>'


+'				<li><a class="clip" data-clipboard-text="'+whitehatdn+'">WhiteHats</a></li>'

+'			</ul>'
+'		</li>'







+'		<li><a>Rules</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+terms+'">Terms and Conditions</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+howtoreport+'">How to Report a Player</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+usagepolicy+'">Usage Policy</a></li>'

+'			</ul>'
+'		</li>'





+'		<li><a>Help</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+support+'">Support</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+contact+'">Contact</a></li>'

+'			</ul>'
+'		</li>'





+'		<li><a>Wiki</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+howtobelorekeeper+'">Become a LoreKeeper</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+wikistaff+'">Wiki Staff</a></li>'

+'			</ul>'
+'		</li>'






+'		<li><a>I Can Haz</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+cyseroac+'">ACs</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+money+'">MONEY</a></li>'

+'				<li><a class="clip" data-clipboard-text="'+notrade+'">Trading</a></li>'

+'			</ul>'
+'		</li>'



+'		<li><a>Other</a>'
+'			<ul>'

+'				<li><a class="clip" data-clipboard-text="'+suggestions+'">Suggestion Forum</a></li>'

+'			</ul>'
+'		</li>'




+'	</ul>'
+'</nav>';

document.getElementsByTagName('head')[0].innerHTML+='<link href="http://synesthesialabs.net/bar.css" rel="stylesheet">';

document.getElementById('battlenav').innerHTML+=button;

document.getElementById('main').innerHTML=dropdown+document.getElementById('main').innerHTML;

new Clipboard('.clip');

$('#helpnav').toggle();

$( "#helplinks" ).click(function() {
  $('#helpnav').toggle();
});






