// ==UserScript==
// @name Crisp image zoom at 150% DPI scale factor displays (Firefox 74+)
// @namespace myfonj
// @version 2.2.0
// @description Prevents blurry anti-aliased borders between picture sampling areas ("pixels") by stretching them so they precisely match (multiples of) physical display points. Adds variable background for transparent images.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^[^?#]+\.(png|gif|ico)(\?[^#]*)?(#.*)?$|^[^#]+#crisp$)$/
// @downloadURL https://update.greasyfork.org/scripts/405595/Crisp%20image%20zoom%20at%20150%25%20DPI%20scale%20factor%20displays%20%28Firefox%2074%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405595/Crisp%20image%20zoom%20at%20150%25%20DPI%20scale%20factor%20displays%20%28Firefox%2074%2B%29.meta.js
// ==/UserScript==

(function() {
let css = `
/*
https://greasyfork.org/en/scripts/405595
*/
html>body>img:only-child:not([width]):not([height]) {
	image-rendering: var(--r, -moz-crisp-edges);
	transform-origin: left top;
	top: 0;
	bottom: auto;
	left: 0;
	right: auto;
	margin: 0;
	--io: var(--i, calc(1 / var(--o)));
	--sc: calc(var(--io) / var(--d));
	transform: scale(var(--sc));
	background-size: calc(10px / var(--io));
	background-image: none;
	background-color: #333;
}
html:hover>body>img:only-child:not([width]):not([height]) {
	background-image: none;
	background-color: #ccc;
}
html:active>body>img:only-child:not([width]):not([height]) {
	background-image: url("data:image/gif;base64,R0lGODlhCgAKAIAAAAAAAP///yH5BAEAAAAALAAAAAAKAAoAAAIRhB2ZhxoM3GMSykqd1VltzxQAOw==");
	background-color: #999;
}
/*
	scale = ("Scale up factor" if defined, otherwise (1 / "Scale down factor")) / "Device Pixel Ratio"
	[resolution]: Effective dppx for given zoom level(s), reported by \`window.devicePixelRatio\`.
	[--d]: Value matching [resolution] as numeric cutom property (without 'dppx').
	[--o]: Scale down factor, intended fraction of physical point size.
	[--i]: Scale up factor, intended multiplier of physical point size.
	       [--o] and [--i] are mutually exclusive.
	[--r]: image rendering override (default is "crisp") for scaled-down zoom levels
	[letter]: mnemonic for ten multiples changes, values of [--o] [--i]
	[--z]: Zoom level(s): percent value reported by browser;
	       Ctrl + Mouse wheel adds/substracts 10%,
				 Ctrl + Plus/Minus has hardcoded values including 33% and 127%, so this list contains
				 every possible zoom levels reachable with mouse and keyboard combination.
	Maximum "true native / reported" shrink value is 30%; for this level we go for 1.5625% (1 / 64 × original).
	Maximum "true native / reported" zoom value is 300%; for  this level we go for 3000% (30 × original).
	
	      [resolution]                              [--d]             [--i / --o]  [--r]    [letter][--z]
*/
@media(resolution:0.45112781954887216dppx){:root{--d:0.45112781954887216;--o:64;--r:auto;}}/*·F← --z:'←30'; */
@media(resolution:0.49586776859504134dppx){:root{--d:0.49586776859504134;--o:64;--r:auto;}}/*·F· --z:'33'; */
@media(resolution:0.55555555555555560dppx){:root{--d:0.55555555555555560;--o:64;--r:auto;}}/*·F· --z:'37'; */
@media(resolution:0.60000000000000000dppx){:root{--d:0.60000000000000000;--o:32;--r:auto;}}/*·E← --z:'←40'; */
@media(resolution:0.64516129032258060dppx){:root{--d:0.64516129032258060;--o:32;--r:auto;}}/*·E· --z:'43'; */
@media(resolution:0.70588235294117650dppx){:root{--d:0.70588235294117650;--o:32;--r:auto;}}/*·E· --z:'47'; */
@media(resolution:0.75000000000000000dppx){:root{--d:0.75000000000000000;--o:16;--r:auto;}}/*·D← --z:'←50'; */
@media(resolution:0.80000000000000000dppx){:root{--d:0.80000000000000000;--o:16;--r:auto;}}/*·D· --z:'53'; */
@media(resolution:0.85714285714285710dppx){:root{--d:0.85714285714285710;--o:16;--r:auto;}}/*·D· --z:'57'; */
@media(resolution:0.89552238805970150dppx){:root{--d:0.89552238805970150;--o:8;--r:auto;}} /*·C← --z:'←60'; */
@media(resolution:0.95238095238095230dppx){:root{--d:0.95238095238095230;--o:8;--r:auto;}} /*·C· --z:'63'; */
@media(resolution:1.00000000000000000dppx){:root{--d:1.00000000000000000;--o:8;--r:auto;}} /*·C· --z:'67'; */
@media(resolution:1.05263157894736800dppx){:root{--d:1.05263157894736800;--o:4;--r:auto;}} /*·B← --z:'←70'; */
@media(resolution:1.09090909090909080dppx){:root{--d:1.09090909090909080;--o:4;--r:auto;}} /*·B· --z:'73'; */
@media(resolution:1.15384615384615370dppx){:root{--d:1.15384615384615370;--o:4;--r:auto;}} /*·B· --z:'77'; */
@media(resolution:1.20000000000000000dppx){:root{--d:1.20000000000000000;--o:2;--r:auto;}} /*·A← --z:'←80'; */
@media(resolution:1.25000000000000000dppx){:root{--d:1.25000000000000000;--o:2;--r:auto;}} /*·A· --z:'83'; */
@media(resolution:1.30434782608695650dppx){:root{--d:1.30434782608695650;--o:2;--r:auto;}} /*·A· --z:'87'; */
@media(resolution:1.36363636363636350dppx){:root{--d:1.36363636363636350;--i:1;}} /*···a← --z:'←90'; */
@media(resolution:1.39534883720930240dppx){:root{--d:1.39534883720930240;--i:1;}} /*···a· --z:'93'; */
@media(resolution:1.46341463414634140dppx){:root{--d:1.46341463414634140;--i:1;}} /*···a· --z:'97'; */
@media(resolution:1.50000000000000000dppx){:root{--d:1.50000000000000000;--i:2;}} /*···b← --z:'←100'; */
@media(resolution:1.53846153846153850dppx){:root{--d:1.53846153846153850;--i:2;}} /*···b· --z:'103'; */
@media(resolution:1.62162162162162170dppx){:root{--d:1.62162162162162170;--i:2;}} /*···b· --z:'107'; */
@media(resolution:1.66666666666666670dppx){:root{--d:1.66666666666666670;--i:3;}} /*···c← --z:'←110'; */
@media(resolution:1.71428571428571420dppx){:root{--d:1.71428571428571420;--i:3;}} /*···c· --z:'113'; */
@media(resolution:1.76470588235294110dppx){:root{--d:1.76470588235294110;--i:3;}} /*···c· --z:'117'; */
@media(resolution:1.81818181818181810dppx){:root{--d:1.81818181818181810;--i:4;}} /*···d← --z:'←120|123'; */
@media(resolution:1.93548387096774200dppx){:root{--d:1.93548387096774200;--i:5;}} /*···e← --z:'127|←130'; */
@media(resolution:2.00000000000000000dppx){:root{--d:2.00000000000000000;--i:5;}} /*···e· --z:'133'; */
@media(resolution:2.06896551724137940dppx){:root{--d:2.06896551724137940;--i:6;}} /*···f← --z:'137|←140'; */
@media(resolution:2.14285714285714300dppx){:root{--d:2.14285714285714300;--i:6;}} /*···f· --z:'143'; */
@media(resolution:2.22222222222222230dppx){:root{--d:2.22222222222222230;--i:8;}} /*···g← --z:'147|←150'; */
@media(resolution:2.30769230769230750dppx){:root{--d:2.30769230769230750;--i:8;}} /*···g· --z:'153'; */
@media(resolution:2.40000000000000000dppx){:root{--d:2.40000000000000000;--i:8;}} /*···h← --z:'157|←160|163'; */
@media(resolution:2.50000000000000000dppx){:root{--d:2.50000000000000000;--i:10;}}/*···i← --z:'167|←170'; */
@media(resolution:2.60869565217391300dppx){:root{--d:2.60869565217391300;--i:10;}}/*···i· --z:'173|177'; */
@media(resolution:2.72727272727272700dppx){:root{--d:2.72727272727272700;--i:12;}}/*···j← --z:'←180|183'; */
@media(resolution:2.85714285714285700dppx){:root{--d:2.85714285714285700;--i:14;}}/*···k← --z:'187|←190|193'; */
@media(resolution:3.00000000000000000dppx){:root{--d:3.00000000000000000;--i:16;}}/*···l← --z:'197|←200|203'; */
@media(resolution:3.15789473684210530dppx){:root{--d:3.15789473684210530;--i:18;}}/*···m← --z:'207|←210|213'; */
@media(resolution:3.33333333333333350dppx){:root{--d:3.33333333333333350;--i:20;}}/*···n← --z:'217|←220|223|227'; */
@media(resolution:3.52941176470588220dppx){:root{--d:3.52941176470588220;--i:22;}}/*·o|p← --z:'←230|233|237|240'; */
@media(resolution:3.75000000000000000dppx){:root{--d:3.75000000000000000;--i:24;}}/*···q← --z:'243|247|←250|253|257'; */
@media(resolution:4.00000000000000000dppx){:root{--d:4.00000000000000000;--i:26;}}/*·r|s← --z:'←260|263|267|←270|273'; */
@media(resolution:4.28571428571428600dppx){:root{--d:4.28571428571428600;--i:28;}}/*·t|u← --z:'277|←280|283|287|←290|293'; */
@media(resolution:4.61538461538461500dppx){:root{--d:4.61538461538461500;--i:30;}}/*···v← --z:'297|←300'; */
/* FIXME zoom levels beyond 300 */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
