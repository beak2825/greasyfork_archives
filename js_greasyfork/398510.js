// ==UserScript==
// @name         AtCoderLabelChanger
// @version      1.2
// @description  提出結果をまとめるスクリプト．ついでに色も変えます．
// @author       y-oksaku
// @namespace    https://github.com/y-oksaku/AtCoderLabelChanger
// @match        https://atcoder.jp/contests/*/submissions/*
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/398510/AtCoderLabelChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/398510/AtCoderLabelChanger.meta.js
// ==/UserScript==

(function(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//code.jquery.com/jquery-3.3.1.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")(jQuery.noConflict(true));";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
})(function ($) {
    let ac = 0;
    let wa = 0;
    let tle = 0;
    let other = 0;

    $('table > tbody > tr > td:not(#judge-status, .waiting-judge) > span.label').each(function () {
        const result = $(this).text();

        switch (result) {
            case 'AC':
                $(this).removeClass('label-success');
                $(this).addClass('label-success');
                ac++;
                break;
            case 'WA':
                $(this).removeClass('label-warning');
                $(this).addClass('label-danger');
                wa++;
                break;
            case 'TLE':
                tle++;
                break;
            default:
                other++;
                break;
        }
    });

    let html = '';
    if(ac > 0) html += `<span class="label label-success">AC</span> ${ac}&emsp;`;
    if(wa > 0) html += `<span class="label label-danger">WA</span> ${wa}&emsp;`;
    if(tle > 0) html += `<span class="label label-warning">TLE</span> ${tle}&emsp;`;
    if(other > 0) html += `<span class="label label-warning">other</span> ${other}&emsp;`;

    if(html != '') $('#judge-status').html(html);
});
