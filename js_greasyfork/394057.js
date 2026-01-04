// ==UserScript==
// @name         Gota.io Enhancer
// @namespace    https://gota.io/web/*
// @version      1.5
// @description  Upgrade how the game looks with customizable features that you can control.
// @author       alex.
// @match        https://gota.io/web/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394057/Gotaio%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/394057/Gotaio%20Enhancer.meta.js
// ==/UserScript==

// Functions to actually make my code look nice and optimised
function assignClass(classname, arg) {
    document.getElementsByClassName(classname)[0].id = arg;
}

function updStyle(id, arg) {
    document.getElementById(id).style = arg;
}

function updHTML(id, arg, addon) {
    if (addon == false) {
        document.getElementById(id).innerHTML = arg;
    } else {
        document.getElementById(id).innerHTML += arg;
    }
}

(function() {
    'use strict';

    // Declare variables
    let version = `1.5`;
    let defaultURL = `https://i.imgur.com/vbfeWF4.gif`;

    // Assign IDs to classes
    assignClass(`options-container`, `options`);
    assignClass(`error-banner`, `banner`);
    assignClass(`main-bottom-links`, `gotaadv`);
    assignClass(`main-rb-title`, `proftxt`);
    assignClass(`main-version`, `version`);
    assignClass(`policyLinks interface-color`, `policies`);
    assignClass(`divider title-divider`, `divider`);
    assignClass(`main-bottom-left`, `buttons`);
    assignClass(`popup-profile-filler`, `filler`);
    assignClass(`gota-btn stealth-link`, `locked-update`);

    // Update styles
    updStyle(`main-rb`, `margin-top: 475px;`);
    updStyle(`main-account`, `margin-top: -740px; background-color: transparent`);
    updStyle(`gotaadv`, `display: none`);
    updStyle(`proftxt`, `font-size: 21.3px`);
    updStyle(`servers-body-eu`, `background-color: transparent`);
    updStyle(`servers-body-na`, `background-color: transparent`);
    updStyle(`servers-body-ap`, `background-color: transparent`);
    updStyle(`policies`, `background-color: transparent`);
    updStyle(`divider`, `display: none`);
    updStyle(`filler`, `display: none`);
    updStyle(`profile-username`, `font-size: 40px`);
    updStyle(`btn-servers`, ``);
    updStyle(`btn-options`, ``);
    updStyle(`btn-reddit`, ``);
    updStyle(`btn-discord`, ``);
    updStyle(`btn-cellpanel`, ``);
    updStyle(`btn-themes`, ``);
    updStyle(`btn-play`, ``);
    updStyle(`btn-spec`, ``);
    updStyle(`account-social`, ``);
    updStyle(`account-profile`, ``);
    updStyle(`account-shop`, ``);
    updStyle(`account-logout`, ``);
    updStyle(`btn-updateSP`, ``);
    updStyle(`locked-update`, `text-decoration: none`);
    updStyle(`btn-add-friend`, ``);
    updStyle(`redeem-spend`, `height: 30px; width: 90px; text-align: center`);
    updStyle(`token-amount`, `font-size: 14px`);
    GM_addStyle(`#main { background-image: url(${localStorage.getItem("bg")}); background-size: cover; }`);
    GM_addStyle(`#main-social { background-image: url(${localStorage.getItem("bg")}); background-size: cover; }`);
    GM_addStyle(`#score-panel { display: inline-flex; flex-direction: row; max-width: initial; }`);

    // Update content
    updHTML(`banner`, `An error has occured. If you can still play, just click this red box. Try these solutions to fix your error: disable the extension, clear your cache, try a different browser etc. If none of these work, please contact someone in the <a href = 'discord.gg/gota'>Gota Discord</a>.`, false);
    updHTML(`version`, ` | Extension version: ${version}`, true);
    updHTML(`proftxt`, `Gota Account`, false);
    updHTML(`proftxt`, `<br><br><br><br><br><br><br><br>Main menu image`, true);
    updHTML(`proftxt`, `<input type = 'text' class = 'gota-input' style = 'height: 25px; width: 300px;' id = 'custombg'>`, true);
    updHTML(`proftxt`, `<br><br><font size = '4px' style = "background-color: purple">For changes to take effect, you need to refresh your page.`, true);
    document.getElementById(`custombg`).value = localStorage.getItem(`bg`);

    if (document.getElementById(`custombg`).value.length < 1) {
        localStorage.setItem(`bg`, defaultURL);
        updHTML(`proftxt`, `<br><br><font size = '4px' style = "background-color: blue">Hey, it seems you aren't using a custom background! Either refresh to use the default image, or set one yourself!`, true);
    } else {
            setInterval(function() {
                localStorage.setItem(`bg`, `${document.getElementById("custombg").value}`);
            }, 150);
    }
})();

