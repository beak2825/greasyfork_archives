// ==UserScript==
// @name        New YouTube Obnoxious Bar Fix
// @description Works as of August 2024, prevents the search bar from following as you scroll down the page
// @match        https://www.youtube.com/*
// @grant       none
// @version 0.0.16
// @namespace https://greasyfork.org/users/8233
// @downloadURL https://update.greasyfork.org/scripts/33218/New%20YouTube%20Obnoxious%20Bar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/33218/New%20YouTube%20Obnoxious%20Bar%20Fix.meta.js
// ==/UserScript==
function adjustBar(events, observer) {
    if (document.getElementById('frex-downbut') !== null) {
        observer.disconnect();
        return;
    }

    document.getElementById('masthead-container').style.position = 'absolute';
    // if above is 'absolute' and not 'static' this must be commented out or the header will overlap the vid
    // document.getElementById('page-manager').style['margin-top'] = 0;

    var downbut = document.createElement('button');
    downbut.id = 'frex-downbut';
    downbut.innerText = '\u25BC';

    downbut.style.background = 'none';
    downbut.style.color = 'red';
    downbut.style.border = 'none';

    var buttons = document.getElementById('masthead-container').querySelector('#buttons')
    buttons.parentElement.insertBefore(downbut, buttons);

    downbut.onclick = function () {
        var cont = document.getElementById('end').parentElement;
        window.scrollTo(0, Math.max(0, cont.offsetHeight - 10));
    };

    // downbut.click();
}

var observer = new MutationObserver(adjustBar);
observer.observe(document.body, { childList: true, subtree: true });
