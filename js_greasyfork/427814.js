// ==UserScript==
// @name     Superfail parser
// @description Parses Superfail data into a digestible form for a separate utility and copies it to the clipboard.
// @version  1.01
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.setClipboard
// @include        http*://*animecubedgaming.com/billy/bvs/partyhouse-superfail.html
// @namespace https://greasyfork.org/users/34394
// @downloadURL https://update.greasyfork.org/scripts/427814/Superfail%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/427814/Superfail%20parser.meta.js
// ==/UserScript==

(async () => {
const text = document.querySelector('a[name=dice]').innerText;
var in_game = true;
if (!/Attempt #/.test(text)) {
  in_game = false;
  const targetscore = /with (\d+) for/.exec(text);
  if (targetscore) {
    GM.setValue('target', 1 + targetscore[1]/50);
  }
}

if (in_game) {
  
var stuff = [];

if (/FAAAAAIIIILLLL/.test(text)) {
  console.log("failed");
} else {
  const banked = /Total Banked Points: (\d+)/.exec(text);
  const current = /Current Score: (\d+)/.exec(text);
  var targetscore = await GM.getValue('target', 220);
  if (targetscore < 220) targetscore = 220;
  if (targetscore < 10 + banked[1]/50) targetscore = 10 + banked[1]/50;
  if (targetscore > 499) targetscore = 499;
  stuff.push(targetscore-banked[1]/50);
  stuff.push(current[1]/50);
}

//console.log(text);

const dice = Array.prototype.slice.call(document.querySelector('a[name=dice]').querySelectorAll('img'));
const dicenames = dice.map(x => x.src.split('/')[5]);
const dicecounts = [dicenames.filter(x => x=="dice1.gif").length,
                    dicenames.filter(x => x=="dice2.gif").length,
                    dicenames.filter(x => x=="dice3.gif").length,
                    dicenames.filter(x => x=="dice4.gif").length,
                    dicenames.filter(x => x=="dice5.gif").length,
                    dicenames.filter(x => x=="dice6.gif").length
                   ];
stuff.push(dicenames.filter(x => !/x/.test(x)).length);
  
const attempt = /Attempt #(\d+)/.exec(text);
stuff.push(12-attempt[1]);
const failedlast = /Failed Last/.test(text);
stuff.push(+failedlast);

GM.setClipboard(stuff.join(' ') + ' ' + dicecounts.join(' '));
}
})();