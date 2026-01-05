// ==UserScript== 
// @name           Linky
// @version        0.6
// @description    Turn selected areas inside a Mturk hit into a google link.
// @author         Cristo
// @include        *
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @copyright      2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5408/Linky.user.js
// @updateURL https://update.greasyfork.org/scripts/5408/Linky.meta.js
// ==/UserScript==

//Turn selected areas inside a hit into a google link.
//Highlight words you would like to add to a google search and press + on the number pad, repeat as needed.
//For best results highlight as little as needed
//Press - on the number pad to delete saved data.
var build = [];
var savedData = [];
if(GM_getValue('taginfo')){
    for(var p = 0; p < GM_getValue('taginfo').length; p++){
        savedData.push(JSON.parse(GM_getValue('taginfo')[p]));
    }
}
if (window.location != window.parent.location === true) {
    console.log('Yes Frame');
    linkMaker();
} else if (!document.getElementsByTagName('iframe') [0] && document.getElementsByName('hitForm') [1]) {
    console.log('No Frame');
    linkMaker();
} else {
    console.log('No Run');
}

function finder() {
    var ti;
    var lightText = window.getSelection();
    var stringText = lightText.toString();
    var textElement = lightText.anchorNode.parentNode;
    var elementString = textElement.textContent;
    var stringStart = elementString.indexOf(stringText);
    var stringEnd = stringText.length;
    var textTagType = textElement.tagName;
    if (lightText.anchorNode != lightText.focusNode) {
        alert('Multiple nodes selected, please break up selection');
    } else {
        var simTags = document.getElementsByTagName(textTagType);
        for (var t = 0; t < simTags.length; t++) {
            if (simTags[t] == textElement) {
                ti = t;
            }
        }
    }
    var data = new Object();
    data.Tag = textTagType;
    data.Tagindex = ti;
    data.First = stringStart;
    data.Last = elementString.length - (stringStart + stringText.length);
    build.push(JSON.stringify(data));
    GM_setValue('taginfo', build);
}
function linkMaker() {
    if (GM_getValue('taginfo') && document.getElementsByTagName(savedData[0].Tag) [savedData[0].Tagindex]) {
        var currentWords = [];
        var aLinkAnc = document.getElementsByTagName(savedData[0].Tag) [savedData[0].Tagindex];
        for (var s = 0; s < savedData.length; s++) {
            if (document.getElementsByTagName(savedData[s].Tag) [savedData[s].Tagindex]) {
                var sTags = document.getElementsByTagName(savedData[s].Tag) [savedData[s].Tagindex];
                var sTIn = sTags.textContent;
                var cutText = sTIn;
                var owb = savedData[s].First;
                var owe = savedData[s].Last;
                if (owb > 0) {
                    var frontCut = sTIn.substring(0, owb - 1);
                    cutText = cutText.replace(frontCut, '');
                }
                if (owe > 0) {
                    var backCut = sTIn.substring(sTIn.length - (owe - 1), sTIn.length);
                    cutText = cutText.replace(backCut, '');
                }
                currentWords.push(cutText);
            }
        }
        var wordString = currentWords.toString().replace(/,/g, ' ');
        var cleanWords = wordString.replace(/[^a-zA-Z0-9\s]/g, ' ');
        var searchWords = cleanWords.replace(/\s/g, '%20');
        var link = document.createElement('a');
        link.target = '_blank';
        link.href = 'http://www.google.com/search?q=' + searchWords;
        link.innerHTML = cleanWords;
        aLinkAnc.parentNode.insertBefore(link, aLinkAnc.nextSibling);
    }
}
document.addEventListener('keydown', function (i) {
    if (i.keyCode == 107) { //+ Adds terms
        finder();
    }
    if (i.keyCode == 109) { //- Delete terms
        GM_deleteValue('taginfo');
    }
}, false);