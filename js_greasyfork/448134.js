// ==UserScript==
// @name         relist all
// @namespace    https://nookazon.com/profile/*
// @version      0.1
// @description  relist all :)
// @author       You
// @match        https://nookazon.com/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nookazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448134/relist%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/448134/relist%20all.meta.js
// ==/UserScript==

window.onload = function(){
    setTimeout(function() {
        //grab  menu bar
        const topBar = document.querySelector('div.profile-tabs');
        const menu = topBar.nextElementSibling.firstChild.firstChild;
        menu.id = 'menu';

        //create button el
        const btn = document.createElement('a');
        btn.innerHTML = 'Relist All';
        btn.classList.add('kBQGpb');
        btn.style.marginLeft = '10px';
        btn.id = 'relistAll';
        menu.appendChild(btn);
        btn.addEventListener('click', relistAll);

        //label relist btns
        let listingActionBar = document.querySelectorAll('.listing-action-bar');
        listingActionBar.forEach((element) => {
        let greenBtnContainer = element.children[3];
        let greenBtn = greenBtnContainer.childNodes[0];
        greenBtn.className += (' relist-btn');
        });
    },1000);
};

function relistAll() {
    let btn = document.querySelectorAll('.relist-btn');
    let eligible;
    btn.forEach((btn) => {
        btn.click();
        let btnColor = window.getComputedStyle(btn).color;
        console.log(btnColor);
        if (btnColor == 'rgb(234, 104, 94)') {
            eligible = false;
        } else {
            eligible = true;
        }
    });

    eligible ? alert('Relisted!') : alert("Can't relist yet!");
}
