// ==UserScript==
// @name         Robux changer 2
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  This robux changer only works on roblox.com/transactions. Anywhere else is unstable. Combine Robux changer 2 with Robux changer 1
// @author       MiniMinusMan
// @match        https://www.roblox.com/transactions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.setValue
// @grant GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471715/Robux%20changer%202.user.js
// @updateURL https://update.greasyfork.org/scripts/471715/Robux%20changer%202.meta.js
// ==/UserScript==

function Test() {
var replaceArry = [
    [/5,889/gi, '1,370,556'], //Change 5,889 to your total + your fake robux
    [/806/gi, '1,372,661'], //Change 806 to your robux
    [/88/gi, '1,364,063'], //Change 88 to a unique sales of goods donation number (not common e.g 10, 2, 0, more like 88, 163, 393, 49, etc.)
    [/611/gi, '1,364,678'], //Change 611 to your Sales of Goods total (if you dont have sales of goods, delete this and the one above ^ )
    // etc.
];
var numTerms = replaceArry.length;
var txtWalker= document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() ) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode = null;

while (txtNode = txtWalker.nextNode () ) {
    var oldTxt = txtNode.nodeValue;

    for (var J = 0; J < numTerms; J++) {
        oldTxt = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]); //This replaces the old text with the new text, so 533 is replaced with any string, e.g a number
    }
    txtNode.nodeValue = oldTxt;
}
}
setInterval(Test,1)