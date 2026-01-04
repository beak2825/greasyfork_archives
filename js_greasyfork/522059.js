// ==UserScript==
// @name         GC HT Highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  Highlights guild members
// @author       You
// @match        https://www.grundos.cafe/winter/snowball_fight/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522059/GC%20HT%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/522059/GC%20HT%20Highlighter.meta.js
// ==/UserScript==

const guildMembers = [
"kat",
"bagel",
"Leo",
"wine",
"ayesha",
"stephanie",
"maple",
"Mew",
"Hunter",
"Cher",
"Honor",
"Jake",
"pirate",
"Bub",
"Chantel",
"possum",
"Aura",
"Zero",
"Kyle",
"Sports",
"melody",
"Allison",
"Penny",
"riddles",
"wibreth",
"Crow",
"Cash",
"sharpiepwns",
"Kate",
"Sankta",
"Shel",
"kiwi",
"Hawaii",
"moonie",
"Linkyasha",
"maxodrama",
"Tamra",
"Brillows",
"Alatreon",
"rust",
"Umbreon",
"legend",
"Emilie",
"Snoopy",
"Bef",
"undertaker",
"bubble",
"bennie",
"Alejandra",
"Mature",
"georgie",
"charming_thievery",
"anaideia",
"Pro",
"LaHype",
"Verynzii",
"CrystalFlame",
"RebelPrincess",
"Sophie",
"potato",
"Abigail",
"mads",
"Viv",
"13ee"
];

// straight up copy-pasta from https://stackoverflow.com/questions/32535881/greasemonkey-highlight-many-words-in-a-html-file
// it looks like it highlights it with case sentivity, but that should be ok for these purposes
function highlightWord(word) {
    var xpath = "//text()[contains(., '" + word + "')]";
    var texts = document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var n = 0; n < texts.snapshotLength; n++) {
        var textNode = texts.snapshotItem(n);
        var p = textNode.parentNode;
        var a = [];
        var frag = document.createDocumentFragment();
        textNode.nodeValue.split(word).forEach(function(text, i) {
            var node;
            if (i) {
                node = document.createElement('span');
                node.style.backgroundColor = '#ecc74e';
                node.appendChild(document.createTextNode(word));
                frag.appendChild(node);
            }
            if (text.length) {
                frag.appendChild(document.createTextNode(text));
            }
            return a;
        });
        p.replaceChild(frag, textNode);
    }
}

for (const user of guildMembers) {
    highlightWord(user);
}