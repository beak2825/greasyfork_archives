// ==UserScript==
// @name           Gartic Custom Theme
// @description    Custom Theme for Gartic
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @downloadURL https://update.greasyfork.org/scripts/510277/Gartic%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/510277/Gartic%20Custom%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let xColor = 'red';

    const setCSS = () => {
        GM_addStyle(`
               div {// background-color: #000000;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;}.btBlueBig.ic-rooms {background-color: ${xColor};border-top-color: ${xColor};border-bottom-color: ${xColor};}.a {color: ${xColor};}.loginTwitter.ic-TwHome {background-color: ${xColor};}.loginGoogle.ic-GoHome {background-color: ${xColor};}.loginVK.ic-VKHome {background-color: ${xColor};}.loginDiscord.ic-DCHome {background-color: ${xColor};}.loginReddit.ic-RDHome {background-color: ${xColor};}h5 {color: ${xColor};}input {background-color: transparent;}.login h3 {color: ${xColor};}.official {background-color: ${xColor};}.infosRoom {padding: 10px;border-radius: 10px;}.actions, .actRooms {border-radius: 10px;}.officialbgEmptyRoom {background-color: #000000;}.iconOfficial {background-color: transparent;}.official h5, .bgEmptyRoom h5 {color: #000000;}.nextCenter {background-color: #000; /* or background-color: black; */}.logo {background-color: #000; /* or background-color: black; */// background-image: url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png);background-size: contain; /* optional, to ensure the image is fully visible */background-repeat: no-repeat; /* optional, to prevent the image from repeating */}header:not(.game) .logo figure {background-color: #000; /* or background-color: black; */background-image: url(https://see.fontimg.com/api/rf5/GO76G/ZTgwODFkODEyNTFiNGEwZmEzZGJjMTk2NjM2NWQ4NGYub3Rm/SDM/mitchel.png?r=fs&h=65&w=1000&fg=FF0000&bg=FFFFFF&tb=1&s=65);background-size: contain; /* optional, to ensure the image is fully visible */background-repeat: no-repeat; /* optional, to prevent the image from repeating */background-position: center;z-index: 999999;}.form h3 {color: ${xColor}; /* or color: red; */}.btYellowBig.ic-playHome {background-color: ${xColor};border-top-color: ${xColor};border-bottom-color: ${xColor};}.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom {background-color: #000000; /* or background-color: black; */border-color: #000; /* or border-color: black; */}.infosRoom {background-color: transparent; /* or background-color: none; */}.rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div::before {color: ${xColor}; /* or color: red; */}.emptyRoom::before {/* add your styles here, e.g. */.rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div {color: #FFFFFF; /* or color: white; */}.users span {color: #FFFFFF; /* or color: white; */}.rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div span:not(.tooltip) {color: #FFFFFF; /* or color: white; */}.title.mobileHide {background-color: #000000; /* or background-color: black; */}.content.home {/* add your styles here, e.g. */background-color: #FFFFFF; /* or background-color: white; */color: #000000; /* or color: black; */}@media screen and (max-height: 809px), screen and (min-width: 641px) and (max-width: 1279px) {#screens > div {padding: 0;}}.selectAvatar {background-color: ${xColor}; /* or background-color: red; */}.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom:hover {border-color: rgba(255, 0, 0, 0.7);}.avt0 {background-image: url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png);}#screenRoom .ctt #interaction #chat h5 {background-color: ${xColor}; /* or background-color: red; */}
        `);
    };

    let html = `
        <div style="position: fixed; bottom: 20px; left: 20px; width: 200px; height: 70px; background-color: #000000; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: #FFFFFF; font-size: 16px; z-index: 9999999999;">
            <button id="redcolor" style="background-color: red; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="bluecolor" style="background-color: blue; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="greencolor" style="background-color: green; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="yellowcolor" style="background-color: yellow; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="purplecolor" style="background-color: purple; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="orangecolor" style="background-color: orange; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="cyancolor" style="background-color: cyan; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="pinkcolor" style="background-color: #ff3de8; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="browncolor" style="background-color: brown; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
            <button id="greenxcolor" style="background-color: #36ea2c; width: 35px; height: 35px; margin: 3px; border-radius: 10px;"></button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const colors = {
        red: () => { xColor = 'red'; setCSS(); },
        blue: () => { xColor = 'blue'; setCSS(); },
        green: () => { xColor = 'green'; setCSS(); },
        yellow: () => { xColor = 'yellow'; setCSS(); },
        purple: () => { xColor = 'purple'; setCSS(); },
        orange: () => { xColor = 'orange'; setCSS(); },
        cyan: () => { xColor = 'cyan'; setCSS(); },
        pink: () => { xColor = '#ff3de8'; setCSS(); },
        brown: () => { xColor = 'brown'; setCSS(); },
        greenx: () => { xColor = '#36ea2c'; setCSS(); }
    };

    document.getElementById('redcolor').addEventListener('click', colors.red);
    document.getElementById('bluecolor').addEventListener('click', colors.blue);
    document.getElementById('greencolor').addEventListener('click', colors.green);
    document.getElementById('yellowcolor').addEventListener('click', colors.yellow);
    document.getElementById('purplecolor').addEventListener('click', colors.purple);
    document.getElementById('orangecolor').addEventListener('click', colors.orange);
    document.getElementById('cyancolor').addEventListener('click', colors.cyan);
    document.getElementById('pinkcolor').addEventListener('click', colors.pink);
    document.getElementById('browncolor').addEventListener('click', colors.brown);
    document.getElementById('greenxcolor').addEventListener('click', colors.greenx);

    setCSS(); // Initial call to apply default styles
})();