// ==UserScript==
// @name         Syosetu Chapter Copy
// @namespace    ultrabenosaurus.Syosetu
// @version      0.10
// @description  Copy the chapter content from a Syosetu chapter page.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://ncode.syosetu.com/*/*/
// @icon         https://www.google.com/s2/favicons?domain=ncode.syosetu.com
// @grant        GM.setClipboard
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/411100/Syosetu%20Chapter%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/411100/Syosetu%20Chapter%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    *
    * maxChars:  The maximum number of characters to copy at once. If the whole
    *            chapter is less than maxChars there will only be one button which
    *            will copy the whole chapter. If it is longer then there will be 2
    *            buttons, with the second copying "blocks" of maxChars characters.
    *
    * safetyNet: How many characters to overlap from the previous block. This is
    *            so that there is some context for your translation tool to work
    *            with in the case that a sentence would otherwise be cut in half.
    *
    * e.g. the first block will be 5000 - 100 = 4900 characters, subsequent blocks
    * will be 5000 chars including the last 100 chars from the previous block and
    * the 4900 of the current block.
    *
    * Both are also set at the start of the UBsyosetuChapterCopyPart() function.
    *
    */
    var maxChars = 5000;
    var safetyNet = 100;

    var mobile = 0;

    let txtBox = document.createElement("textarea");
    txtBox.id = "UBsyosetuChapterContent";
    txtBox.name = "UBsyosetuChapterContent";
    txtBox.style = "width: 0; height: 0; border: none;";
    document.body.appendChild(txtBox);

    var subTitle = document.querySelectorAll('div#novel_color p.novel_subtitle');
    if(subTitle.length == 0) {
        mobile = 1;
        subTitle = document.querySelectorAll('div#novel_color div.novel_subtitle');
    }

    txtBox.value = (mobile ? subTitle[0].innerText.split("\n")[1] : subTitle[0].textContent) + "\n\n" + document.querySelectorAll('div#novel_honbun')[0].textContent;
    var charCount = txtBox.value.length;

    var btnElem = "<br /><input type='button' id='UBsyosetuChapterCopyWhole' value='Copy Whole Chapter' />";
    if( charCount > maxChars ) {
        btnElem += "&nbsp;<input type='button' id='UBsyosetuChapterCopyPart' value='Copy Chapter Block: 1 of " + Math.ceil( charCount / ( maxChars - safetyNet ) ) + "' />";
    }

    subTitle[0].insertAdjacentHTML("beforeend", btnElem);

    var sccwBtn = document.getElementById('UBsyosetuChapterCopyWhole');
    if(sccwBtn){
        sccwBtn.addEventListener("click", UBsyosetuChapterCopyWhole, false);
    }

    var sccpBtn = document.getElementById('UBsyosetuChapterCopyPart');
    if(sccpBtn){
        sccpBtn.addEventListener("click", UBsyosetuChapterCopyPart, false);
    }

    maxChars = safetyNet = mobile = sccwBtn = sccpBtn = btnElem = txtBox = subTitle = charCount = null;
})();

function UBsyosetuChapterCopyWhole() {
    let txtBox = document.getElementById('UBsyosetuChapterContent');
    txtBox.select();
    txtBox.setSelectionRange(0, 999999);
    document.execCommand("copy");
    txtBox = null;
}

function UBsyosetuChapterCopyPart() {
    var maxChars = 5000;
    var safetyNet = 100;

    var copyBtn = document.getElementById('UBsyosetuChapterCopyPart');
    var chpPart = parseInt( copyBtn.value.split(": ")[1].split(" of ")[0] );
    var lastPart = parseInt( copyBtn.value.split(": ")[1].split(" of ")[1] );
    let txtBox = document.getElementById('UBsyosetuChapterContent');
    var maxBlocks = Math.ceil( txtBox.value.length / ( maxChars - safetyNet ) );

    if( maxBlocks >= chpPart ) {
        var selRngStart = ( chpPart - 1 ) * ( maxChars - safetyNet );
        selRngStart = chpPart > 1 ? selRngStart - safetyNet : selRngStart;
        var selRngEnd = chpPart * ( maxChars - safetyNet );

        txtBox.select();
        txtBox.setSelectionRange( selRngStart, selRngEnd );
        document.execCommand("copy");

        copyBtn.value = copyBtn.value.split(": ")[0] + ": " + ( chpPart + 1 ) + " of " + lastPart;
    } else {
        copyBtn.value = copyBtn.value.split(": ")[0] + ": 1 of " + lastPart;
        alert("You have already finished this chapter. Click again to start copying from the first block.");
    }

    maxChars = safetyNet = maxBlocks = copyBtn = chpPart = lastPart = selRngStart = selRngEnd = txtBox = null;
}




//