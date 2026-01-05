// ==UserScript==
// @name       Hack Forums Crypto Currency Address Saver
// @namespace  https://greasyfork.org/users/2155
// @version    0.3
// @description  This userscript makes posting your crypto currency address a lot easier. It simply replaces :omc:/:btc:/:ltc: with your OMC/BTC/LTC address.
// @include    *hackforums.net*
// @downloadURL https://update.greasyfork.org/scripts/2224/Hack%20Forums%20Crypto%20Currency%20Address%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/2224/Hack%20Forums%20Crypto%20Currency%20Address%20Saver.meta.js
// ==/UserScript==

var omcAddress = ""; //Enter your OMC address here
var btcAddress = ""; //Write your BTC address here
var ltcAddress = ""; //Write your LTC address here

var includeOmc = false; //Set this to true if you want :omc: to be replace with your OMC address
var includeBtc = false; //Set this to true if you want :btc: to be replace with your BTC address
var includeLtc = false; //Set this to true if you want :ltc: to be replace with your LTC address

document.getElementsByName('submit')[0].onclick = function() {
    if (includeOmc == true) {
    document.getElementById('message_new').value = document.getElementById('message_new').value.replace(/:omc:/g, omcAddress);
    };
    if (includeBtc == true) {
    document.getElementById('message_new').value = document.getElementById('message_new').value.replace(/:btc:/g, btcAddress);
    };
    if (includeLtc == true) {
    document.getElementById('message_new').value = document.getElementById('message_new').value.replace(/:ltc:/g, ltcAddress);
    };
};