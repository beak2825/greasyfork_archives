// ==UserScript==
// @name        Dahllors to OwOs
// @namespace   Violentmonkey Scripts
// @match       *://*.kapish.fun/*
// @version     1.0
// @author      Facbook (Modified from ema)
// @description Replaces Dahllors texture to Finobe's old OwO's texture and replaces the word "Dahllors" with "OwOs".
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459821/Dahllors%20to%20OwOs.user.js
// @updateURL https://update.greasyfork.org/scripts/459821/Dahllors%20to%20OwOs.meta.js
// ==/UserScript==

GM_addStyle(`
img[src*="dahllor_white"]{ content: url("https://cdn.calones.xyz/9aec061c350ac12c.png");
    width: 16px;
    height: 16px;
    filter: opacity(100%) !important;
}

img[src*="currency"]{ content: url("https://cdn.calones.xyz/9aec061c350ac12c.png");
    width: 16px;
    height: 16px;
}

b[style*="color: #34c51c"]{
   color: #A06716 !important;
}

button[class*="btn btn-lg btn-success shadow-sm"]{
   background-color: #A06716 !important;
   border-color: #79442F !important;
}

button[class*="btn btn-success shadow-sm"]{
   background-color: #A06716 !important;
   border-color: #A06716 !important;
}
`);

var replaceArry = [
    ['Dahllors', 'OwOs'],
    ['dahllors', 'OwOs'],
];
var numTerms = replaceArry.length;
var txtWalker = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim())
                return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode = null;

while (txtNode = txtWalker.nextNode () ) {
    var oldTxt = txtNode.nodeValue;

    for (var J = 0; J < numTerms; J++) {
        oldTxt = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    txtNode.nodeValue = oldTxt;
}