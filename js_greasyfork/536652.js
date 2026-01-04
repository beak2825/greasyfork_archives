// ==UserScript==
// @name        Internet Roadtrip - Current Coords
// @description Show the current coordinates in the page.
// @namespace   crschmidt.net/userscripts/irt-coords
// @version     1.1
// @author      crschmidt
// @license     MIT
// @match       https://neal.fun/internet-roadtrip/*
// @downloadURL https://update.greasyfork.org/scripts/536652/Internet%20Roadtrip%20-%20Current%20Coords.user.js
// @updateURL https://update.greasyfork.org/scripts/536652/Internet%20Roadtrip%20-%20Current%20Coords.meta.js
// ==/UserScript==

(() => {

    const containerEl = document.querySelector('.container');

    const state = {
        dom: {}
    };
    function setupDom() {
        injectStylesheet();
        state.dom.coordsEl = document.createElement('div');
        state.dom.coordsEl.className = 'coords';
        state.dom.coordsTextEl = document.createElement('span');
        state.dom.coordsEl.appendChild(state.dom.coordsTextEl);
  const target = state.dom.coordsTextEl;

  // Create the copy button
  const button = document.createElement('button');
  button.textContent = '📋';
  button.style.marginLeft = '8px';
  button.style.fontSize = '0.8em';

  // Copy logic
  button.addEventListener('click', () => {
    const text = target.innerText || target.textContent;
    navigator.clipboard.writeText(text).then(() => {
      button.textContent = '✅ Copied!';
      setTimeout(() => button.textContent = '📋', 1500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });

  // Insert the button after the target
  target.insertAdjacentElement('afterend', button);
        containerEl.appendChild(state.dom.coordsEl);
    }
    function injectStylesheet() {
        const styleEl = document.createElement('style');

        styleEl.textContent = `
    .coords {
      position: absolute;
      left: 10px;
      top: 125px;
      margin: 0;
      padding: 2px;
      color: white;
      list-style: none;
      font-family: "Roboto", sans-serif;
      font-size: 0.8rem;
      background-color: #fff8;
      `;
     document.head.appendChild(styleEl);

 }

    function start(vue) {
        state.vue = vue;

        setupDom();
        patch(vue);

    }


    function patch(vue) {
        const ogChangeStop = vue.changeStop;
        vue.changeStop = function (_, currentChosen) {
            if (!this.isChangingStop) {
                try {
                    var coords = `${this.currentCoords.lat.toFixed(5)},${this.currentCoords.lng.toFixed(5)}`;
                    const formatted = `<a target="_blank" href="http://maps.google.com/?q=${coords}">${this.currentCoords.lat.toFixed(5)}, ${this.currentCoords.lng.toFixed(5)}</a>`;
                    state.dom.coordsTextEl.innerHTML = formatted;
                } catch (error) {
                    console.error('Could not do a thing:', this, error);
                }
            }

            return ogChangeStop.apply(this, arguments);
        }
    }


    {
        const waitForVueInterval = setInterval(() => {
            const vue = containerEl.__vue__;
            if (!vue?.changeStop) {
                return;
            }

            clearInterval(waitForVueInterval);
            start(vue);
        }, 100);
    }
})();