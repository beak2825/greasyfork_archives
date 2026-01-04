// ==UserScript==
// @name         SEEK Job Cleaner
// @namespace    llouislu.seek
// @version      0.1
// @description  remove jobs from blacklisted companies or keywords
// @author       github/llouislu
// @match        http*://www.seek.co.nz/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/397140/SEEK%20Job%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/397140/SEEK%20Job%20Cleaner.meta.js
// ==/UserScript==

let blackList = ["Sunstone Talent", "Absolute IT Limited"]
let blackkeywordList = ["consult", "recruitment"]

function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function bringMeSanity () {
    let companyNames = getElementsByXPath("//article/span/span/a");
    // console.log(companyNames);
    for (let companyName of companyNames) {
       //console.log(companyName)
       //console.log(companyName.innerHTML)
        let keywordMatched = false
        for (let keyword of blackkeywordList) {
            if (companyName.innerHTML.toLowerCase().includes(keyword)) {
            keywordMatched = true}
        }
        if (keywordMatched || blackList.includes(companyName.innerHTML)) {
            console.log(companyName.innerHTML)
        //console.log(companyName.closest("article"))
            let block = companyName.closest("article").parentNode
            console.log(block)
            block.parentNode.removeChild(block)
        }
    }
}

$( document ).ready(function () {
    bringMeSanity()
})

$("body").on('DOMSubtreeModified', "section", function() {
    bringMeSanity()
})