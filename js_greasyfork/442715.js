// ==UserScript==
// @name         Blacklist Avenoel (color-variation)
// @namespace    https://avenoel.org/forum
// @version      0.1.1
// @description  Allow you to put in bad-color blacklisted people from avenoel.org
// @author       SomeoneElse101
// @match        https://avenoel.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442715/Blacklist%20Avenoel%20%28color-variation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442715/Blacklist%20Avenoel%20%28color-variation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let blacklist;
    if (localStorage.getItem('blacklist') === null) {
        blacklist = {};
        console.log('blacklist vide');
    } else {
        blacklist = JSON.parse(localStorage.getItem('blacklist'));
        console.log('---AVN_BLACKLISTED_PEOPLE---');
        console.log(blacklist);
        console.log('---END_LIST---');
        console.log('TO UNBAN, REPLACE true WITH false IN THIS LINE :');
        console.log('localStorage.setItem(\'blacklist\', '+JSON.stringify(localStorage.getItem('blacklist'))+');');
        console.log('AND CHECK RESULT WITH : JSON.parse(localStorage.getItem(\'blacklist\'));');
    }

    let clearBL = document.createElement('li');
    let a = document.createElement('a');

    a.href = '#';
    a.innerText = 'Clear BL';
    clearBL.addEventListener('click', event => {
        localStorage.setItem('blacklist', JSON.stringify({}));
        document.location.reload();
    });
    clearBL.appendChild(a);

    document.getElementsByClassName('aside')[0].getElementsByTagName('ul')[0].appendChild(clearBL);

    Array.from(document.getElementsByClassName('message-actions')).map(x => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let img = document.createElement('img');

        img.src = 'https://avenoel.org/images/topic/ban.png';
        a.href = '#';
        a.appendChild(img);
        a.addEventListener('click', event => {
            let blacklist;
            if (localStorage.getItem('blacklist') === null) {
                blacklist = {};
            } else {
                blacklist = JSON.parse(localStorage.getItem('blacklist'));
            }

            blacklist[event.target.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('message-username')[0].innerText.toLowerCase()] = true;
            localStorage.blacklist = JSON.stringify(blacklist);
            console.log(event.target.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('message-username')[0].innerText.toLowerCase()+" blacklisté");
            document.location.reload();
        });
        li.appendChild(a);
        x.appendChild(li);
    });

    //console.log('ok');
    Array.from(document.getElementsByClassName('topics-author')).slice(1).filter(x => blacklist[x.getElementsByTagName('a')[0].innerText.toLowerCase()] === true).map(x => x.parentNode.style.backgroundColor='#422100');
    Array.from(document.getElementsByClassName('message-username')).filter(x => blacklist[x.getElementsByTagName('a')[0].innerText.toLowerCase()] === true).map(x => x.parentNode.parentNode.parentNode.style.backgroundColor='#422100');

})();