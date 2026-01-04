// ==UserScript==
// @name         Beatsaver scroll to id
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Dartv
// @match        https://beatsaver.com/browse/latest
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402135/Beatsaver%20scroll%20to%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/402135/Beatsaver%20scroll%20to%20id.meta.js
// ==/UserScript==

(function() {
    const createSearchInput = () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <label for="beatmapid">Beatmap id</label>
        <input name="beatmapid" placeholder="Enter beatmap id" />
      `;
      container.style = 'position: absolute; top: 100px; right: 100px;';
      document.body.appendChild(container);
      return document.getElementsByName('beatmapid')[0];
    };

    const observeLoader = (target, callback) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ type, removedNodes }) => {
          if (type === 'childList') {
            if (Array.from(removedNodes).some(node => node.classList && node.classList.contains('loader-container'))) {
              callback();
            }
          }
        });
      });
      const options = {
        subtree: true,
        childList: true,
      };

      observer.observe(target, options);

      return observer;
    };

    const init = () => {
      let observer;
      const input = createSearchInput();
      const target = document.getElementsByClassName('container')[1];
      input.addEventListener('blur', (e) => {
        const id = e.target.value;

        if (observer) observer.disconnect();

        if (id.length === 4) {
          const scrollToBeatmap = () => {
            const elem = document.getElementById(id);

            if (elem) {
              observer.disconnect();
              elem.scrollIntoViewIfNeeded();
              elem.style.border = '5px solid green';
              return;
            }

            target.scrollIntoView(false);
          };

          observer = observeLoader(target, scrollToBeatmap);

          scrollToBeatmap();
        }
      });
    };

    window.addEventListener('load', init);
})();