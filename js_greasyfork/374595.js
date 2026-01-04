// ==UserScript==
// @name     Twitter Auto Follow
// @version  2
// @locale en
// @description adds a button to twitter for automatic following of every user displayed
// @include https://twitter.com/*/following
// @author      Wepwawet
// @run-at document-start
// @grant    none
// @namespace https://greasyfork.org/users/227248
// @downloadURL https://update.greasyfork.org/scripts/374595/Twitter%20Auto%20Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/374595/Twitter%20Auto%20Follow.meta.js
// ==/UserScript==
(function() {
    'use strict'

    window.addEventListener('load', () => {
        addButton('Autofollow', selectReadFn, 'button.autofollow')
    })

    var timer_id = 0;
    var secondary_timer_id = 0;
    var followercount = -1;

    function secondaryTimer() {
        var curlen = jQuery('.Grid-cell').length;

        if (curlen == followercount) {

            window.clearInterval(timer_id);
            window.clearInterval(secondary_timer_id);
            document.getElementById('button.autofollow').innerHTML = 'Preparing to follow... ' + curlen;
            Secondary();
            return;
        }

        followercount = curlen;
    }

    function myTimer() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    var buttons = 0;

    function addButton(text, onclick, buttonName, cssObj) {
        buttons++;
        cssObj = cssObj || {
            display: 'flex',
            'flex-direction': 'column',
            'justify-content': 'space-around',
            'align-items': 'flex-start',
            position: 'fixed',
            bottom: 1 + (buttons * 5) + '%',
            left: '1%',
            'z-index': 3,
            background: '#000000',
            background: '-webkit-linear-gradient(#000000, #000000)',
            background: 'linear-gradient(#000000, #000000)',
            border: '1px solid #556699',
            'border-radius': '5px',
            padding: '8px 20px',
            color: '#ffffff',
            font: 'normal 700 24px/1 "Ubuntu", sans-serif',
            'text-align': 'center',
            'text-shadow': 'none',
        }
        let button = document.createElement('button'),
            btnStyle = button.style
        document.body.appendChild(button)
        button.id = buttonName;
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    var running = false;
    var running2 = false;

    function selectReadFn() {
        if (running) return;
        running = true;
        timer_id = setInterval(myTimer, 50);
        secondary_timer_id = setInterval(secondaryTimer, 1000);
    }

    function Secondary() {
        if (running2) return;
        running2 = true;
        var FOLLOW_PAUSE = 1250;
        var FOLLOW_RAND = 5050;
        var PAGE_WAIT = 2000;
        var __cnt__ = 0;

        var eles;
        var __lcnt__ = 0;
        eles = jQuery('.Grid-cell .not-following .follow-text').each(function(i, ele) {
            ele = jQuery(ele);
            if (ele.css('display') != 'block') {
                return;
            }
            setTimeout(function() {
                ele.click();
                if ((eles.length - 1) == i) {
                    return;
                }
            }, __lcnt__++ * FOLLOW_PAUSE + Math.random() * (FOLLOW_RAND) - FOLLOW_RAND / 2);
            __cnt__++;

        });
        //[...document.getElementsByClassName('MN')].filter(isRead).forEach(element => element.click())
    }

    function isRead(element) {
        childs = element.parentElement.parentElement.parentElement.getElementsByClassName('G3')
        return ![...childs].some(e => e.innerText.search(/unread/i) !== -1)
    }

}())