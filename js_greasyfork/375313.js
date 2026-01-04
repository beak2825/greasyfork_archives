// ==UserScript==
// @name         Copy Bandcamp Release Info
// @namespace    https://greasyfork.org/en/scripts/375313-copy-bandcamp-release-info
// @version      1.0
// @description  Copies the Bandcamp release info to the clipboard, formatted for PE.
// @author       newstarshipsmell
// @include      /https?://[^\/]+/(track|album)/.+/
// @include      /https?://[^\/]+\.bandcamp\.com/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375313/Copy%20Bandcamp%20Release%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/375313/Copy%20Bandcamp%20Release%20Info.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var logging = false;
	var nzAhead = 19;//difference in hours between local time and NZT
	var isBC = document.querySelectorAll('meta[name="generator"][content="Bandcamp"]').length == 1 ? true : false;
	if (logging) console.log("isBC: " + isBC);
	if (!isBC) return;

	var cover = document.querySelector('div.middleColumn > div#tralbumArt > a.popupImage');
	cover.href = cover.href.replace(/_10\.jpg$/, '_0.jpg');
	cover.target = '_blank';
	cover.classList.remove('popupImage');
	cover.addEventListener('click', function(e) {
		e.preventDefault();
		GM_setClipboard(this.href);
	});

	var pTitle = document.querySelector('title').textContent;
	var mTitle = document.querySelector('meta[name="title"]').content;
	if (pTitle.replace(/^Music | /) == mTitle) {
		if (logging) console.log("The page is a general artist page without a specific release loaded.");
		return;
	}

	var bcUrl;
	if (/\/(album|track)\//.test(location.href)) {
		bcUrl = location.href.split('?')[0];
	} else {
		document.querySelector('span.share-embed-label > button').click();
		bcUrl = document.querySelector('div.email-im-link > dl > dd > input[type="text"]').value;
		location.assign(bcUrl);
		//document.querySelector('span.share-embed-label > button').click();
	}
	if (logging) console.log("bcUrl: " + bcUrl);

	var bcArt, bcAlb;
	if (mTitle.match(/, by /).length == 1) {
		bcAlb = mTitle.split(', by ')[0];
		bcArt = mTitle.split(', by ')[1];
	} else {
		if (pTitle.match(/ \| /).length == 1) {
			bcAlb = pTitle.split(' | ')[0];
			bcArt = pTitle.split(' | ')[1];
		} else {
			if (logging) console.log("WARNING: Cannot parse artist/album names from <title> and <meta name=\"title\"> tags!");
		}
	}
	if (logging) console.log("BC Artist: " + bcArt);
	if (logging) console.log("BC Album: " + bcAlb);

	var bcDate = document.querySelector('meta[itemprop="datePublished"]').content;
	var bcYear = bcDate.substr(0, 4);
	bcDate = bcDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')

	var bcLbl = document.querySelector('p#band-name-location > span.title').textContent;
	var bcBlb = document.querySelector('span.back-link-text');
	try {
		bcLbl = bcBlb.lastChild.textContent;
	} catch(e) {}

	if (bcLbl == bcArt) bcLbl = 'Self-Released';

	var dToday = new Date();
	dToday.setHours(0);
	dToday.setMinutes(0);
	dToday.setSeconds(0);
	dToday = dToday.getTime();

	var bcStr;
	var bcFree = false;
	if (Date.parse(bcDate) - (nzAhead * 3600000) > dToday) {//future release
		bcStr = bcArt + ' [' + bcYear + '] ' + bcAlb + ' [' + bcLbl + ', WEB] [FLAC]\t\t\t\tnone\tnone\t' + bcUrl + '\t' +
			(/\/track\//.test(location.href) ? 's' : '') + '\tx\t' + bcDate;
	} else {
		if (document.querySelector('h4.main-button > button.download-link').innerHTML == 'Free Download') {
			bcFree = true;
		} else if (document.querySelector('h4.main-button span.buyItemExtra').innerHTML == 'name your price') bcFree = true;

		if (bcFree) {
			bcStr = bcArt + ' [' + bcYear + '] ' + bcAlb + ' [' + bcLbl + ', WEB] [FLAC]\t\t' + bcUrl + '\t$\tnone\tnone\t\t' +
				(/\/track\//.test(location.href) ? 's' : '');
		} else {
			bcStr = bcArt + ' [' + bcYear + '] ' + bcAlb + ' [' + bcLbl + ', WEB] [FLAC]\tNA\t\t\tnone\tnone\t' + bcUrl + '\t' +
				(/\/track\//.test(location.href) ? 's' : '');
		}
	}

	if (logging) console.log("String: " + bcStr)
	var copyBtn = document.createElement('input');
	copyBtn.type = 'button';
	copyBtn.value = 'Copy release';
	document.querySelector('div#name-section > h3').appendChild(copyBtn);
	copyBtn.onclick = function() {
		GM_setClipboard(bcStr);
	};
	/*
BP	bedroom.pop
DR	dream.rock
DF	dream.folk
DK	dream.punk
DW	dreamwave
E-	electro
G-	garage
GP	garage.pop
GK	garage.punk
GR	progressive.rock
GO	progressive.pop
JP	jangle.pop
JR	jangle.rock
N-	noise
NR	noise.rock
S-	synth
SR	synth.rock
SK	synth.punk
SW	synthwave
TP	tropical.pop
TR	tropical.rock
T-	tropicalia
UP	surf.pop
UR	surf.rock
YP	psychedelic.pop
YR	psychedelic.rock
6F	chamber.folk
6P	chamber.pop
6R	chamber.rock
8B	8bit
8P	baroque.pop
8R	baroque.rock
^G	avant.garde
^P	art.pop
^R	art.rock
_P	space.pop
_R	space.rock
_W	chillwave
<P	retro.pop
>P	future.pop
<R	classic.rock
<W	retrowave
{P	krautpop
{R	krautrock
&P	orchestral.pop
&R	orchestral.rock
)P	dark.pop
)W	darkwave
)4	dark.ambient
)E	dark.electro
+P	math.pop
0P	minimal.pop
0S	minimal.synth
0W	coldwave
A	alternative
B	bossa.nova
C	post.rock
D	dream.pop
E	electronic
F	folk
G	garage.rock
H	trip.hop
I	indie
J	jazz
K	punk
L	lo.fi
M	downtempo
N	noise.pop
O	post.punk
P	pop
Q	female.vocalist
R	rock
S	synthpop
T	twee
U	surf
V	new.wave
W	power.pop
X	experimental
Y	psychedelic
Z	shoegaze
1	rhythm.and.blues
2	jangle.pop
3	ethereal
4	ambient
5	soul
7	lounge
9	gothic
0	minimal
+	math.rock

*/
})();