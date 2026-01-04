// ==UserScript==
// @name         Sort The Unsorted
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ICPC teams may love this script!
// @author       Parsa Alizadeh
// @match        https://codeforces.com/gym/*/standings*
// @icon         https://codeforces.org/s/0/favicon-32x32.png
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466697/Sort%20The%20Unsorted.user.js
// @updateURL https://update.greasyfork.org/scripts/466697/Sort%20The%20Unsorted.meta.js
// ==/UserScript==

function getAcceptCount() {
    let indicators = $('.standings td.bottom span.cell-accepted');
    let counts = [];
    indicators.each((i, e) => {
        if (i >= 1) counts.push(e);
    });
    return counts.map(e => parseInt(e.textContent));
}

function permute(array, perm) {
    let result = [];
    for (let i = 0; i < perm.length; i++) {
        result.push(array[perm[i]]);
    }
    return result;
}

function reversePerm(perm) {
    let rev = new Array(perm.length);
    for (let i = 0; i < perm.length; i++) {
        rev[perm[i]] = i;
    }
    return rev;
}

function idPerm(len) {
    return Array.from({length: len}, (v, i) => i);
}

function sortPerm(array) {
    return idPerm(array.length).sort((i, j) => array[i] - array[j]);
}

function collectChildren(node, fromIndex) {
    return node.find('> *').filter(i => i >= fromIndex).detach();
}

function permuteChildren(node, fromIndex, perm) {
    let children = collectChildren(node, fromIndex);
    $(permute(children, perm)).appendTo(node)
}

function permuteStanding(perm) {
    $('.standings tr').each((i, e) => {
        permuteChildren($(e), 4, perm);
    });
}

$(document).ready(function() {
    let acceptCounts = getAcceptCount();
    let sorted = sortPerm(acceptCounts).reverse();
    let unsorted = reversePerm(sorted);
    let doSort = () => {
        permuteStanding(sorted);
        $(".standings th a").css("display", "none");
    };
    let doUnsort = () => {
        permuteStanding(unsorted);
        $(".standings th a").css("display", "");
    };
    let button = $(`<div style="float: right; position: relative; bottom: 3em; font-size: 1.0rem; margin: 0 20px;">
        <form action="" method="post" class="toggle-show-unofficial" style="margin-top: 0.5em;">
            <input name="sort-the-unsort" id="sort-the-unsort" type="checkbox" checked="">
            <label for="sort-the-unsort" style="position: relative; bottom: 0.4em;">sort the unsorted</label>
        </form></div>`);
    button.insertAfter($('#pageContent div').get(1));
    let checked = true;
    $('#sort-the-unsort').change(() => {
        checked = !checked;
        if (checked) doSort();
        else doUnsort();
    });
    doSort();
});