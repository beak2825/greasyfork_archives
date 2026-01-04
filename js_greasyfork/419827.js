// ==UserScript==
// @name         MathPapa No-Pro Calculator
// @namespace    https://spin.rip
// @version      1.7
// @description  Allows you to use MathPapa's calculator and show the steps for work without needing to buy the Pro version
// @author       Spinfal
// @match        https://*.mathpapa.com/algebra-calculator.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419827/MathPapa%20No-Pro%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/419827/MathPapa%20No-Pro%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => {
        document.getElementsByTagName('a')[4].innerText = 'Spin\'s Site';
        document.getElementsByTagName('a')[4].setAttribute('href', 'https://spin.tk');
        document.getElementById("parse_btn").innerText = 'Go! (No-Pro)';
        document.getElementById("myaid").style = 'display: none;'; // hides the ad, cuz why not
        document.getElementsByClassName('share_2')[0].remove();
        document.getElementsByClassName('footer')[0].remove();
        document.getElementById("parse_btn").addEventListener("click", noPro);
        document.getElementById("soloutbuttondiv").addEventListener("click", noPro);
        document.getElementById("solstepshowlink").addEventListener("click", noPro);
        document.getElementById("solpickdiv").addEventListener("click", noPro);
    }

    function noPro() {
        var today = new Date();
        var month = today.getMonth();
        month = month + 1;
        var day = today.getDate();
        var year = today.getFullYear();
        var date = month + '/' + day + '/' + year;
        console.log(date);
        localStorage.removeItem('count.t-steps.total');
        localStorage.removeItem('count.e-steps.etotal');
        localStorage.removeItem('count.p-steps.' + date);
    }
})();