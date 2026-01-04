// ==UserScript==
// @name        Tengwar Transcriber
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @match       *C:/Users/Balthazar/Desktop/tooltips/demo.html
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       none
// @version     1.0.5
// @author      -
// @description 3/22/2020, 10:04:32 AM
// @downloadURL https://update.greasyfork.org/scripts/398903/Tengwar%20Transcriber.user.js
// @updateURL https://update.greasyfork.org/scripts/398903/Tengwar%20Transcriber.meta.js
// ==/UserScript==

wordWrap(document.body);

function wordWrap( element ){
  var nodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, null);
  var node;
  while (node = nodes.nextNode()) {
    var p = node.parentNode;
    var text = node.nodeValue;
    var m;
    while(m = text.match(/^(\s*)(\S+)/)) {
      text = text.slice(m[0].length);
      p.insertBefore(document.createTextNode(m[1]), node);
      var word = p.insertBefore(document.createElement('span'), node);
      word.appendChild(document.createTextNode(m[2]));
      word.className = 'word';
      word.title = m[2];
    }
    node.nodeValue = text;
  }
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// addGlobalStyle('@font-face { font-family: Tengwar \n src: url("https://www.tecendil.com/fonts/tengtelcOTL.woff2") format("woff2") }');
addGlobalStyle(':not(#pre) { font-family: Tengwar Telcontar OTL !important; }');
addGlobalStyle('span { position: relative;}');
addGlobalStyle('span:hover { visibility: hidden; position: relative;}');
addGlobalStyle('span:hover:after { font-family: Helvetica; color: white; padding-right: 5px; padding-left: 5px; border: 1px solid black; border-radius: 5px; background: gray; visibility: visible; position: absolute; z-index: 100; top: -5px; left: 0; content: attr(title) }');

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
  "^that$" : "",   "^That$" : "",
  "^than$" : "",   "^Than$" : "",
  "^they$" : "",   "^They$" : "",
  "^them$" : "",   "^Them$" : "",
  "^they$" : "",   "^They$" : "",
  "^them$" : "",   "^Them$" : "",
  "^this$" : "",   "^This$" : "",
  "^thee$" : "",   "^Thee$" : "$1",
  "^thou$" : "",   "^Thou$" : "$1",
  "([Ll])och": "$1",

  // 3 letter words
  "^(\\\(?|\\\"?)[Tt]he$" : "$1",
  "^([Hh])is$" : "$1",

  // 2 letter words
  "^as$" : "",
  "^is$" : "",
  "^of$" : "",

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
  "r(?=[aeiou])" : "",     "R(?=[aeiou])" : "", // r before a vowel
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

};

const treeWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);

window.addEventListener('load', function() {

  while (treeWalker.nextNode()) {
    const Node = treeWalker.currentNode; // PS: Node.nodeType is always 3
    Object.keys(repl).forEach(key => {
      Node.nodeValue = Node.nodeValue.replace(new RegExp(key, "g"), repl[key]);
    });
  }
}, false);
