// ==UserScript==
// @name         Rozbudowa w nocy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       pts
// @match        https://*.plemiona.pl/game.php?*screen=main*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395608/Rozbudowa%20w%20nocy.user.js
// @updateURL https://update.greasyfork.org/scripts/395608/Rozbudowa%20w%20nocy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#content_value').prepend(`
        <div>Button id: <input type="text" id="button_id"></div>
        <div>Minutes: <input type="number" step="1" id="seconds"></div>
        <div id='counter'>&nbsp;</div>
        <div><button id="trigger">TRIGGER</button></div>

`)

    let button_name
    let seconds

    if (sessionStorage.getItem('CHECK_AUTO_BUILD') != 'NOK' && sessionStorage.getItem('CHECK_AUTO_BUILD') != '' && sessionStorage.getItem('CHECK_AUTO_BUILD') != null) {
        let building = sessionStorage.getItem('CHECK_AUTO_BUILD')
        sessionStorage.setItem('CHECK_AUTO_BUILD','NOK')
        setTimeout(function() {$("#"+building).trigger('click')},5000)

    }

    $(document.body).on('click','#trigger',function() {
        let seconds_num = parseInt($('#seconds').val())
        let counter = seconds_num * 60 - 1
        sessionStorage.setItem('CHECK_AUTO_BUILD',$("#button_id").val())
        setTimeout(function() {location.reload();},seconds_num*1000*60)
        setInterval(function() {$('#counter').html(counter--)},1000)
    })
})();