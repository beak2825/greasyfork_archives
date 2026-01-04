// ==UserScript==
// @name         Virtual Justine
// @namespace    http://cryosis.co/
// @version      0.1
// @description  NO GAMBLING!
// @author       Cryosis, with inspiration from Justine
// @match        *.torn.com/casino.php*
// @downloadURL https://update.greasyfork.org/scripts/383085/Virtual%20Justine.user.js
// @updateURL https://update.greasyfork.org/scripts/383085/Virtual%20Justine.meta.js
// ==/UserScript==

$(window).load(function() {
    $('.games-list').replaceWith(`
    <div class='m-top10'>
        <div class='title-black top-round' aria-level='5'>NO GAMBLING</div>
        <div class="bottom-round cont-gray p10">
            <p>You are <span style='color: red; font-weight:bold'>NOT</span> allowed to gamble!
            <br/><br/>
            JUSTINE SAYS NO GAMBLING!</p>
        </div>
        <hr class="page-head-delimiter m-top10">
    </div>
    `)
    $('.doctorn-widgets').remove();
});