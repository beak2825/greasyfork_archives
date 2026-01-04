// ==UserScript==
// @name         Chain timer alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  play sound when chain timer is less than some amount of seconds
// @author       belkka
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446047/Chain%20timer%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/446047/Chain%20timer%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sound = new Audio('http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg');
    let critical_time = 60; //  Sound plays when this amount of seconds is left before chain interruption
    let critical_chain_length = 99; // When chain is shorter than this value sound doesn't play

    const max_timer = 5 * 60; // 5 mins

    const bar_chain = $('#barChain');

    const setup_btn = $('<img src="https://cdn-icons-png.flaticon.com/512/481/481782.png">')
    .css("height", "1em")
    .css("margin-right", "1ex")
    .click(function() {dialog[0].showModal();});
    bar_chain.find('> div:first > :first').before(setup_btn);
    const dialog = $(`
    <dialog id="setup_chain_timer">
      <p>Critical amount of seconds: <input type="number" min="1" max="${max_timer - 5}" value="${critical_time}"/></p>
      <p>Minimal chain length: <input type="number" min="1" value="${critical_chain_length}" /></p>
    </dialog>`);
    dialog.append($(`<button>Enable alert</button>`).click(() => {
        const inputs = dialog.find('input');
        critical_time = Math.min(inputs[0].value, max_timer - 5);
        critical_chain_length = inputs[1].value;
        alert(
            `Sound alert will play ${critical_time} seconds before chain end,`
            + ` but only if chain length is at least ${critical_chain_length}`
        );
        clearTimeout(timer_id);
        checkTimer();
        setup_btn[0].src = 'https://cdn-icons-png.flaticon.com/512/481/481770.png';
        dialog[0].close();
    }));
    dialog.append($(`<button>Disable alert</button>`).click(() => {
        clearTimeout(timer_id);
        setup_btn[0].src = 'https://cdn-icons-png.flaticon.com/512/481/481782.png';
        dialog[0].close();
    }));
    $('body').append(dialog);

    let timer_id = null;
    let alert_played = false;

    function checkTimer() {
        const timer_element = bar_chain.find('> div:first > p:last');
        const [min, sec] = timer_element.text().split(':');
        const seconds_left = +sec + 60 * +min;

        const chain_length_element = bar_chain.find('> div:first > .bar-value___HKzIH');
        const chain_length = +(chain_length_element.text().split('/')[0]);

        const is_cooldown = bar_chain.find('> :nth-child(2)')[0].className.includes('cooldown');

        if(is_cooldown) {
            timer_id = setTimeout(checkTimer, (seconds_left + 1) * 1000);
            alert_played = false;
        } else if(seconds_left < critical_time + 0.5) {
            if(chain_length >= critical_chain_length && !alert_played) {
                sound.play();
                alert_played = true;
            }
            timer_id = setTimeout(checkTimer, (max_timer - critical_time - 1) * 1000);
        } else {
            timer_id = setTimeout(checkTimer, (seconds_left - critical_time) * 1000);
            alert_played = false;
        }
    }
})();