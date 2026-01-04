// ==UserScript==
// @name         Custom scrolling distance of space key
// @version      0.1.0
// @description  Custom scrolling distance
// @author       pana
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/477596/Custom%20scrolling%20distance%20of%20space%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/477596/Custom%20scrolling%20distance%20of%20space%20key.meta.js
// ==/UserScript==

(function () {
  const store = {
    distancePercentage: GM_getValue('distancePercentage', 100)
  };
  function configPanel() {
    const panel = document.createElement('div');
    panel.setAttribute('style', 'position: fixed; top: 0; right: 0; bottom: 0; left: 0; display: flex; background-color: rgba(0, 0, 0, 0.5); align-items: center; justify-content: center; z-index: 100000;');
    panel.innerHTML = `
      <div style="position: relative; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 1px 10px rgba(0, 0, 0, 0.8); background-color: rgb(21, 32, 43); border: 1px solid #000; color: #fff;">
        <div style="margin: 20px 15px; text-align: center; font-size: 1.2em; font-weight: bold;">Settings</div>
        <div style="margin: 0px 10px;">
          <label>Scrolling distance:</label>
          <input id="custom-space-scroll-input" type="number" min="1" max="100" value="${store.distancePercentage}" style="width: 50px" /> %
        </div>
        <div style="display: inline-block; margin: 15px 15px; text-align: right;">
          <button id="custom-space-scroll-cancel-btn" style="cursor: pointer;">Cancel</button>
          <button id="custom-space-scroll-ok-btn" style="cursor: pointer; margin-left: 10px;">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.addEventListener('click', evt => {
      if (evt.target === panel) {
        panel.remove();
      }
    });
    const okBtn = document.getElementById('custom-space-scroll-ok-btn');
    const cancelBtn = document.getElementById('custom-space-scroll-cancel-btn');
    cancelBtn?.addEventListener('click', e => {
      e.stopPropagation();
      panel.remove();
    });
    okBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const input = document.querySelector('#custom-space-scroll-input');
      if (input) {
        const value = input.value;
        let res = parseInt(value) || 100;
        if (res < 1 && res > 100) {
          res = 100;
        }
        store.distancePercentage = res;
        GM_setValue('distancePercentage', res);
      }
      panel.remove();
    });
  }
  function main() {
    GM_registerMenuCommand('Configuration', configPanel);
    window.addEventListener('keydown', evt => {
      if (evt.code === 'Space' && evt.target === document.body) {
        evt.preventDefault();
        const shiftState = evt.shiftKey;
        const curTop = document.documentElement.scrollTop || document.body.scrollTop;
        const curHeight = window.innerHeight;
        const base = Math.round(curHeight * store.distancePercentage / 100);
        const to = shiftState ? curTop - base : curTop + base;
        document.documentElement.scrollTo({
          top: to,
          behavior: 'smooth'
        });
      }
    });
  }
  main();
})();
