// ==UserScript==
// @name         Auto Cookie Clicker
// @namespace    https://waa.ai/spinpy
// @version      1.4
// @description  Automate Cookie Clicker and have it do the work for you!
// @author       Spinfal
// @match        http://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423795/Auto%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/423795/Auto%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    async function click() {
        setInterval(function() { document.getElementById('bigCookie').click() }, 0);
    }

    async function upgrades(delay) {
        if (isNaN(parseInt(delay))) {
            alert('that wasnt a number.');
            upgrades(parseInt(prompt('enter an interval to auto buy upgrades (in seconds)')));
        } else {
            console.log(`upgrade delay set to: ${delay}`);
            setInterval(function() { document.getElementById('upgrade0').click() }, parseInt(delay) * 1000);
            // products
            setInterval(function() { document.getElementById('product0').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product1').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product2').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product3').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product4').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product5').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product6').click() }, delay * 1000);
        }
    }

    async function products(delay) {
        if (isNaN(parseInt(delay))) {
            alert('that wasnt a number.');
            upgrades(parseInt(prompt('enter an interval to auto buy products (in seconds)')));
        } else {
            console.log(`product delay set to: ${delay}`);
            setInterval(function() { document.getElementById('product0').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product1').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product2').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product3').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product4').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product5').click() }, delay * 1000);
            setInterval(function() { document.getElementById('product6').click() }, delay * 1000);
        }
    }


    setTimeout(function() {
        if (confirm('start autoclicker?')) {
            click();
        }

        if (confirm('auto buy upgrades?')) {
            upgrades(parseInt(prompt('enter an interval to auto buy upgrades (in seconds)')));
        }

        if (confirm('auto buy products?')) {
            upgrades(parseInt(prompt('enter an interval to auto buy products (in seconds)')));
        }
    }, 3000);

    setInterval(function() { Game.toSave=true;PlaySound('snd/tick.mp3') }, 10000);
})();
