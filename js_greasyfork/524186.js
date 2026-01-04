// ==UserScript==
// @name        scat.gold fixes
// @description fix the dead dood url + remove the useless players
// @match       https://scat.gold/*
// @version     0.1
// @namespace   https://greasyfork.org/users/1424882
// @downloadURL https://update.greasyfork.org/scripts/524186/scatgold%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/524186/scatgold%20fixes.meta.js
// ==/UserScript==

setTimeout(() => {
    document.querySelector('#content').style.position = 'relative';
    document.querySelector('#content').style.top = '-460px';
    document.querySelector('#content').style.zIndex = '1';
    document.querySelector('.ihc-locker-wrap').style.display = 'none';
    document.querySelector('.responsive-tabs__list').style.display = 'none';
    document.querySelector('#tablist1-panel1').style.display = 'none';
    document.querySelector('#tablist1-panel2').style.display = '';
    document.querySelector('iframe').src = (document.querySelector('iframe').src).replace('.work/','.la/');
}, 1000); // add more time if connection slow

