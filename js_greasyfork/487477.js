// ==UserScript==
// @name         blasploop
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ESC for settings menu, ALT for homepage menu!
// @author       blaspious
// @match        https://sploop.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487477/blasploop.user.js
// @updateURL https://update.greasyfork.org/scripts/487477/blasploop.meta.js
// ==/UserScript==
(function(){
    //in-game settings
    let popUI = document.querySelector('#pop-ui');
    let settings = document.querySelector('#pop-settings');
    //style changes
    document.getElementById('ranking-middle-main').style.height = '380px';
    document.getElementById('ranking-ranks-container').style.height = '295px';

    document.getElementById('ranking2-middle-main').style.height = '380px';
    document.getElementById('ranking-rank-container').style.height = '295px';

    document.getElementById('profile-left-main').style.width = '650px';
    document.getElementById('change-username').style.width = '200px';

    document.getElementById('pop-ui').style.opacity = '0.6';
    document.getElementById('homepage').style.opacity = '0.5';

    document.getElementById('hat-menu').style.opacity = '0.5';
    document.getElementById('clan-menu').style.opacity = '0.5';
    //adjustment fixes
    document.querySelector('#game-content').style.justifyContent = 'center';
    document.querySelector('#main-content').style.width = 'auto';
    //ad remove
    var styleItem1 = document.createElement('style');
    styleItem1.type = 'text/css';
    styleItem1.appendChild(document.createTextNode(`#cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content { display: none !important;
}
    create_clan *, #pop-ui {
    background-color: transparent;
}
    #pop-settings {
    background: rgba(0,0,0,0.5);
    opacity: 0.5;
}`));
    document.head.appendChild(styleItem1);
    //auto settings
    const grid = document.querySelector('#grid-toggle');
    const ping = document.querySelector('#display-ping-toggle');
    grid.click();
    ping.click();
    //in-game settings
    document.addEventListener('keydown', e =>{
    if(e.keyCode == 27) {
    if(document.querySelector('#hat-menu').style.display !== 'flex' && document.querySelector('#clan-menu').style.display !== 'flex' && document.querySelector('#homepage').style.display !== 'flex' && document.querySelector('#chat-wrapper').style.display !== 'block') {
    if(!popUI.classList.contains('fade-in')) {
    popUI.classList.add('fade-in');
    popUI.style.display = 'flex';
    settings.style.display = 'flex';
    return;
}
    popUI.classList.remove('fade-in');
    popUI.style.display = 'none';
    settings.style.display = 'none';
    //in-game homepage
    const popHomepage = document.getElementById('homepage')
    function handleControlKeyPress(event) {
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
    if (popHomepage.style.display === 'flex') {
    popHomepage.style.display = 'none';
} else {
    popHomepage.style.display = 'flex';
}
    event.preventDefault();
    event.stopPropagation();
}}
    document.addEventListener('keydown', handleControlKeyPress);
}}});})();