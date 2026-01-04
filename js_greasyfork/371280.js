// ==UserScript==
// @name         SA Forum Emoticons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto-insert SA emoticons very clumsily.
// @author       Ben Hayes
// @include      *forums.somethingawful.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371280/SA%20Forum%20Emoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/371280/SA%20Forum%20Emoticons.meta.js
// ==/UserScript==

(function() {
    'use strict';

var EMO_ARRAY_1 = [
    /:3:/gi,
    /:aaa:/gi,
    /:aaaaa:/gi,
    /:airquote:/gi,
    /:allears:/gi,
    /:angel:/gi,
    /:argh:/gi,
    /:arghfist:/gi,
    /:bang:/gi,
    /:banjo:/gi,
    /:black101:/gi,
    /:blush:/gi,
    /:bravo2:/gi,
    /:butt:/gi,
    /:catholic:/gi,
    /:cawg:/gi,
    /:cb:/gi,
    /:cheeky:/gi,
    /:cheers:/gi,
    /:chef:/gi,
    /:choco:/gi,
    /:clint:/gi,
    /:coffee:/gi,
    /:colbert:/gi,
    /:comeback:/gi,
    /:commissar:/gi,
    /:confused:/gi,
    /:cool:/gi,
    /:cop:/gi,
    /:crossarms:/gi,
    /:cry:/gi,
    /:cthulhu:/gi,
    /:D:/gi,
    /:dance:/gi,
    /:devil:/gi,
    /:dings:/gi,
    /:doh:/gi,
    /:downs:/gi,
    /:downsgun:/gi,
    /:downswords:/gi,
    /:drac:/gi,
    /:eek:/gi,
    /:emo:/gi,
    /:eng101:/gi,
    /:eng99:/gi,
    /:engleft:/gi,
    /:eyepop:/gi,
    /:f5:/gi,
    /:f5h:/gi,
    /:fap:/gi,
    /:fh:/gi,
    /:flame:/gi,
    /:gay:/gi,
    /:geno:/gi,
    /:ghost:/gi,
    /:gibs:/gi,
    /:glomp:/gi,
    /:golfclap:/gi,
    /:gonk:/gi,
    /:greatgift:/gi,
    /:haw:/gi,
    /:hawaaaafap:/gi,
    /:hehe:/gi,
    /:heysexy:/gi,
    /:hf:/gi,
    /:hfive:/gi,
    /:hist101:/gi,
    /:holy:/gi,
    /:huh:/gi,
    /:hydrogen:/gi,
    /:j:/gi,
    /:jerkbag:/gi,
    /:jewish:/gi,
    /:jihad:/gi,
    /:keke:/gi,
    /:kimchi:/gi,
    /:mad:/gi,
    /:mmmhmm:/gi,
    /:monocle:/gi,
    /:sweatdrop:/gi,
    /:psyduck:/gi,
    /:psylon:/gi,
    /:iiam:/gi,
    /:siren:/gi,
    /:pedo:/gi,
    /:iceburn:/gi,
    /:masterstroke:/gi
    ];
var EMO_ARRAY_2 = [];
for( var N = 0; N < EMO_ARRAY_1.length; N++)
{
var emot = EMO_ARRAY_1[N].source;
emot = emot.slice(1)
emot = emot.slice(0,-1)
EMO_ARRAY_2[N] = emot;
}

var EMOTerms = EMO_ARRAY_1.length;
for (var K = 0; K < EMOTerms; K++) {
    document.body.innerHTML = document.body.innerHTML.replace(EMO_ARRAY_1[K], '<img src="https://i.somethingawful.com/forumsystem/emoticons/emot-'+EMO_ARRAY_2[K]+'.gif" alt="" title="'+EMO_ARRAY_1[K]+'">');
    }

var txtWalker   = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {   acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() ){
                return NodeFilter.FILTER_ACCEPT;}

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode     = null;

while (txtNode  = txtWalker.nextNode () ) {
    var oldTxt  = txtNode.nodeValue;
    oldTxt  = oldTxt.replace ('">', '');
    txtNode.nodeValue = oldTxt;
}

})();