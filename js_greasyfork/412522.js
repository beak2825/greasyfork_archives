// ==UserScript==
// @name        Tengwar Simple
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       none
// @version     1.0.4
// @author      -
// @description 3/22/2020, 10:04:32 AM
// @downloadurl https://gitlab.com/my-awesome-group383/my-first-project/-/raw/master/TengwarSimple.js
// @updateurl   https://gitlab.com/my-awesome-group383/my-first-project/-/raw/master/TengwarSimple.js
// @downloadURL https://update.greasyfork.org/scripts/412522/Tengwar%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/412522/Tengwar%20Simple.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(':not(#pre) { font-family: Tengwar Telcontar OTL !important; }');


const body = document.body;
const repl = { // Your replacements:
  // words
  // 8 letter words
  "([Tt])ogether" : "$1",
  "([Cc])lothing" : "$1",
  "([Ss])oothing" : "$1",

  // 7 letter words
  "([Ff])eather" : "$1",
  "([Ww])eather" : "$1",
  "([Bb])athing" : "$1",
  "([Bb])rother" : "$1",
  "([Ll])eather" : "$1",
  "([Bb])reathe" : "$1",

  // 6 letter words
  "([Ss])eethe" : "$1",
  "([Ss])cathe" : "$1",
  "([Tt])eethe" : "$1",
  "([Ll])oathe" : "$1",
  "([Ff])ather" : "$1",
  "([Mm])other" : "$1",
  "though" : "",
  "Though" : "",
  "([Ee])ither" : "$1",
  "([Gg])ather" : "$1",
  "([Ww])orthy" : "$1",
  "([Ss])mooth" : "$1",
  "([Tt])ether" : "$1",
  "([Rr])ather" : "$1",
  "([Bb])other" : "$1",
  "([Cc])hrist" : "",

  // 5 letter words
  "their" : "", "Their" : "",
  "these" : "", "These" : "",
  "those" : "", "Those" : "",
  "([Oo])ther" : "",
  "([Ll])athe" : "$1",
  "([Bb])athe" : "$1",

  // 4 letter words
  "\\bthat\\b" : "",   "\\bThat\\b" : "",
  "\\bthan\\b" : "",   "\\bThan\\b" : "",
  "\\bthey\\b" : "",   "\\bThey\\b" : "",
  "\\bthem\\b" : "",   "\\bThem\\b" : "",
  "\\bthey\\b" : "",   "\\bThey\\b" : "",
  "\\bthem\\b" : "",   "\\bThem\\b" : "",
  "\\bthis\\b" : "",   "\\bThis\\b" : "",
  "\\bthee\\b" : "",   "\\bThee\\b" : "$1",
  "\\bthou\\b" : "",   "\\bThou\\b" : "$1",
  "([Ll])och": "$1",

  // 3 letter words
  "\\b[Tt]he\\b" : "",
  "\\b([Hh])is\\b" : "$1",

  // 2 letter words
  "\\bas\\b" : "", "\\bAs\\b" : "",
  "\\bis\\b" : "", "\\bIs\\b" : "",
  "\\bof\\b" : "",

  // c corrections
  "ce" : "se",
  "cy" : "sy",
  "ci" : "si",

  // exception for silent e at end of word.
  "e(?![abcdefghijklmnopqrstuvwxyz])" : "",

  // exception for y at the beginning or end of a word
  "y(?=[abcdefghijklmnopqrstuvwxyz])" : "",
  "Y(?=[abcdefghijklmnopqrstuvwxyz])" : "",
  "y(?![abcdefghijklmnopqrstuvwxyz])" : "",

  // exception for qu
  "qu" : "", "Qu" : "",

  // consonant clusters
  "ch" : "", "Ch" : "",
  "sh" : "", "Sh" : "",
  "th" : "", "Th" : "",
  "ng" : "", "Ng" : "",
  "gh" : "", "Gh" : "",
  "rd" : "", "Rd" : "",
  "wh" : "", "Wh" : "",
  "ph" : "", "Ph" : "",

  // symbols
  "," : "",
  "\\." : "",
  ":" : "",
  ";" : "",
  "-" : "", "‐" : "", "‑" : "", "⁃" : "",
  "\\?" : "",
  "!" : "",
  "\\(" : "",
  "\\)" : "",

  // consonants
  "b" : "",     "B" : "",
  "c" : "",     "C" : "",
  "d" : "",     "D" : "",
  "f" : "",     "F" : "",
  "g" : "",     "G" : "",
  "h" : "",     "H" : "",
  "j" : "",     "J" : "",
  "k" : "",     "K" : "",
  "l" : "",     "L" : "",
  "m" : "",     "M" : "",
  "n" : "",     "N" : "",
  "p" : "",     "P" : "",
  "q" : "",     "Q" : "",
  "r(?=[aeiou])" : "",     "R(?=[aeiou])" : "", // r before a vowel
  "r" : "",     "R" : "",
  "s" : "",     "S" : "",
  "t" : "",     "T" : "",
  "v" : "",     "V" : "",
  "w" : "",     "W" : "",
  "x" : "",     "X" : "",
  "y" : "",
  "z" : "",     "Z" : "",

  // double consonants
  "(|||||||||||||)\\1" : "$1",
  "" : "",

  // vowels
  "a" : "", "A" : "",
  "e" : "", "E" : "",
  "i" : "", "I" : "",
  "o" : "", "O" : "",
  "u" : "", "U" : "",

  // dipthongs
  "" : "", "" : "", "" : "", "" : "",
  "" : "", "" : "", "" : "", "" : "",
  "" : "",

  // correct vowels next to consonants
  "(||||)(||||||||||||||||||||||||||)" : "$2$1",

  // change  to  for final s
  "(?!||||||||||||||||||||||||||||||||||||)" : "",

  // fix ugly -rds
  "(|||||||)" : "$1",

  // change  to  when it has a tehtar
  "(||||)" : "$1",

  // change  to  when it has a tehtar
  "(||||)" : "$1",

  // nasalized consonants
  "(||||)(|||)" : "$2$1",
  "(||||)(|||)" : "$2$1",

  // correct some nasalized consonants
  "(||||)" : "$1",
  "" : "",
  "" : "",

  // correct qu
  "(||||)" : "$1",

  // correct ending double e
  "" : "",

  //correct apostrophe s
  "'" : "'",

  // fix ugly -imat-
  "" : ""

};


const treeWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);

window.addEventListener('load', function() {
  setTimeout(() => {
    while (treeWalker.nextNode()) {
      if (treeWalker.currentNode.nodeValue.length < 1000) {
        const Node = treeWalker.currentNode;
        Object.keys(repl).forEach(key => {
          Node.nodeValue = Node.nodeValue.replace(new RegExp(key, "g"), repl[key]);
        });
      }
    }
  }, 2000);
}, false);
