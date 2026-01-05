// ==UserScript==
// @name         Facebook Chat Restored
// @namespace    https://theimperium.org/
// @namespace    https://github.com/imperious1
// @version      1.0.1.0
// @description  Miss being able to turn off/on your chat for a select few? Miss it no more, as with this script, it's returned!
// @author       Imperious1
// @match        *://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29797/Facebook%20Chat%20Restored.user.js
// @updateURL https://update.greasyfork.org/scripts/29797/Facebook%20Chat%20Restored.meta.js
// ==/UserScript==

/**
 * Listens for Focus out events (i.e when the advanced
 * settings pop up comes up) and then runs this code
 *
 * Changes the class names to their defaults except
 * it removes "hidden_elem", which makes the options
 * visible again.
 */
var runNecessary = true;
//var firstRun = true;

/*
function setListeners() {
    document.getElementsByClassName('_42fu')[0].onclick = function () {
        runNecessary = true;
    };
    document.getElementsByClassName('_42fu')[1].onclick = function () {
        runNecessary = true;
    };
}*/

document.addEventListener('focusout', function () {
    var whitelist = document.getElementsByClassName('whitelistSection');
    var blacklist = document.getElementsByClassName('blacklistSection');

    if (whitelist.length > 0 && runNecessary) {
        whitelist[0].className = 'pbm whitelistSection unselected';
        document.getElementsByClassName('tokenizerArea')[0].className = 'tokenizerArea';

        whitelist[0].onclick = function () {
            blacklist[0].className = 'pbm blacklistSection unselected';
            whitelist[0].className = 'pbm whitelistSection selected';
        };
        blacklist[0].onclick = function () {
            whitelist[0].className = 'pbm whitelistSection unselected';
            blacklist[0].className = 'pbm blacklistSection selected';
        };
        runNecessary = false;
        /*if (firstRun)
            setListeners();

        firstRun = false;*/
    }
});