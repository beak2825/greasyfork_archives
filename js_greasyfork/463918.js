// ==UserScript==
// @name         Bisexual weather
// @version      0.2
// @description  Allow to make temperature values bisexual.
// @author       Andrei Onea
// @match        https://weather.com/*
// @grant        none
// @license Apache-2.0
// @namespace https://greasyfork.org/users/1001907
// @downloadURL https://update.greasyfork.org/scripts/463918/Bisexual%20weather.user.js
// @updateURL https://update.greasyfork.org/scripts/463918/Bisexual%20weather.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement('div')
    btn.style = 'width:9.5em; height:1.5em; position: fixed; top:5em; left: 0.7em;z-index:1000;font-size:1em;user-select:none; border-radius:0.4em; background-color:white;';
    btn.textContent = 'Make temps bisexual';
    let state = 'straight';
    document.body.appendChild(btn)
    btn.addEventListener('click', () => {
        if (state === 'bisexual') {
            document.querySelectorAll('span[bisexualised=true]').forEach(node => {
                 const orig = node.getAttribute('original-temp');
                 node.removeAttribute('bisexualised');
                 node.removeAttribute('original-temp');
                 node.textContent = orig;
            });
            btn.textContent = 'Make temps bisexual';
            state = 'straight';
            return;
        }
        let tempStyle = '';
        try {
            let val = document.querySelector('div[data-testid="languageSelectorSection"]').querySelector('span + span').textContent;
            if (val === '°C') {
                tempStyle = 'celsius';
            } else if (val === '°F') {
                tempStyle = 'fahrenheit';
            } else {
                alert('I have no idea what temperature unit this is, soz :(');
                return;
            }
        } catch(e) {
            alert('Please wait for page to fully load first');
        }
        let isTemp = (content) => content.endsWith('°')
        let tempVal = (content) => parseInt(content.split('°')[0].match(/[0-9]+/)[0])
        let convFunc = (node) => {
          let content = node.textContent;
          let c = tempVal(content);
          let f = Math.floor(1.8000 * c + 32);
          node.setAttribute('bisexualised', true);
          node.setAttribute('original-temp', content);
          node.textContent = `${f}°F / ${c}°C`;
        }
        if (tempStyle === 'fahrenheit') {
            convFunc = (node) => {
                let content = node.textContent;
                let f = tempVal(content);
                let c = Math.floor((f - 32) / 1.8);
                node.setAttribute('bisexualised', true);
                node.setAttribute('original-temp', content);
                node.textContent = `${f}°F / ${c}°C`;
            }
        }
        document.querySelectorAll('span').forEach(node => {
           if (isTemp(node.textContent)) {
               convFunc(node);
           }
        })
        btn.textContent = 'Make temps straight';
        state = 'bisexual';
    })
})();