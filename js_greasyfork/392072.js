// ==UserScript==
// @name         Dabble remove sidebars
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  remove both/left sidebar from Dabble; right still needs more work... no longer with a hideous button! 
// @include      https://app.dabblewriter.com/*
// @include      https://app.dabblewriter.com/#/*
// @author       Me
// @match        https://www.tampermonkey.net/index.php?ext=dhdg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392072/Dabble%20remove%20sidebars.user.js
// @updateURL https://update.greasyfork.org/scripts/392072/Dabble%20remove%20sidebars.meta.js
// ==/UserScript==

//my first js, ok? i'll fix it up when i have time.

let header;
let btnHide;
let btnHideRight;
let btnHideLeft;

let hidden = false;
let hiddenR = false;
let hiddenL = false;

(function() {
    'use strict';

    header = document.querySelector('.app-header-left');

    btnHide = document.createElement('button');
    //btnHideRight = document.createElement('button');
    btnHideLeft = document.createElement('button');
    //btnSpan = document.createElement('span');

    btnHide.textContent = 'Hide All';
    btnHide.style.color = 'grey';
    btnHide.style.border = 'none';
    btnHide.style.background = 'transparent'
    //btnHideRight.textContent = 'right';
    btnHideLeft.textContent = 'Hide Left';
    btnHideLeft.style.color = 'grey';
    btnHideLeft.style.border = 'none';
    btnHideLeft.style.background = 'transparent'

    btnHide.className = 'hide-bars-toggle';

    header.insertBefore(btnHide, document.querySelector('.app-header-nav'));
    header.insertBefore(btnHideLeft, document.querySelector('.app-header-nav'));
    //header.insertBefore(btnHideRight, document.querySelector('.app-header-nav'));

    btnHide.addEventListener('click', hideSides);
    //btnHideRight.addEventListener('click', hideRight);
    btnHideLeft.addEventListener('click', hideLeft);

})();

function hideSides() {
    let sideBar = document.querySelectorAll('.side-nav');
    let i;

    if (!hidden)
    {
        for (i = 0; i < sideBar.length; i++)
        {
            sideBar[i].style.display = 'none';
        }
        btnHide.textContent = 'Show All';
    }
    else
    {
       for (i = 0; i < sideBar.length; i++)
        {
            sideBar[i].style.display = 'flex';
        }
        btnHide.textContent = 'Hide All';
    }

    hidden = !hidden;
}

function hideLeft() {
    let leftBar = document.getElementsByClassName('left');
    if (!hiddenL)
    {
        leftBar[0].style.display = 'none';
        btnHideLeft.textContent = 'Show Left';
    }
    else
    {
        leftBar[0].style.display = 'flex';
        btnHideLeft.textContent = 'Hide Left';
    }

    hiddenL = !hiddenL;
}

//for whatever reasons this doesn't work. i'd fix but i have a train to catch.
function hideRight() {
    let rightBar = document.getElementsByClassName('right');

    if (!hiddenR)
    {
        rightBar[0].style.display = 'none';
    }
    else
    {
        rightBar[0].style.display = 'flex';
    }

    hiddenR = !hiddenR;
}
