// ==UserScript==
// @name         AO3 Random Nice Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Want to leave more kudos? Leave a random nice comment with the click of a button
// @match        *://*.archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450063/AO3%20Random%20Nice%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/450063/AO3%20Random%20Nice%20Comments.meta.js
// ==/UserScript==

let anonName = 'Anon';
let anonEmail = 'askd.noreply@noreply.com';

function niceComment() {
    let niceComments = [
        'Kudos! ♥',
        'I loved this!',
        'This was great ♥',
        '♥ ♥ ♥',
        '<3 <3 <3',
        'This is great ♥',
        'Loved this <3',
        'Thank you for sharing this ♥',
        'Kudos ♥'
        ]

    let n = Math.floor(Math.random() * niceComments.length)
    return niceComments[n]
}

function getInputsByValue(value) {
    // kudos button has a universal id but the comment button id is unique to the work
    var allInputs = document.getElementsByTagName("input");
    var results = [];
    for(var x=0;x<allInputs.length;x++) {
        if(allInputs[x].value == value) {
            results.push(allInputs[x]);
        }
    }
    return results;
}

(function() {
    'use strict';

    if (!getInputsByValue('Comment').length || !getInputsByValue('Kudos ♥').length) {
        return null;
    }

    var submitButton = getInputsByValue('Comment')[0]
    var kudosButton = getInputsByValue('Kudos ♥')[0]
    var workID = submitButton.id.split('_')[3]

    const extraKudosButton = document.createElement("button")
    extraKudosButton.textContent = 'Comment Kudos ♥'
    extraKudosButton.onclick = function() {
        if (document.querySelectorAll('#comment_name_for_' + workID).length) {
            document.querySelector('#comment_name_for_' + workID).value = anonName;
            document.querySelector('#comment_email_for_' + workID).value = anonEmail;
        }

        document.querySelector('#comment_content_for_' + workID).value = niceComment();
        submitButton.click();
        extraKudosButton.remove(); // prevent extra clicks
    }

    kudosButton.parentNode.parentNode.insertBefore(extraKudosButton,kudosButton.parentNode)

})();