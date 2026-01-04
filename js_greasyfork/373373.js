// ==UserScript==
// @name         Adobe XD Sidenav Manager
// @namespace    https://xd.adobe.com/
// @version      0.1
// @description  support toggling the sidnav
// @author       Lawrence Lau
// @match        https://xd.adobe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373373/Adobe%20XD%20Sidenav%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/373373/Adobe%20XD%20Sidenav%20Manager.meta.js
// ==/UserScript==

(() => {
  const manageSidNav = () => {
    const container = document.querySelector('[data-auto="sideNavBarTopContainer"]');
    if (!container) {
      return false;
    }
    container.addEventListener('click', (e) => {
      let current = e.target;
      let button;
      while (current && current !== container) {
        if (current.className.split(/\s+/).some(name => (name.indexOf('buttonContainer') === 0))) {
          button = current;
          break;
        }
        current = current.parentNode;
      }
      if (!button) {
        return;
      }
      const hiding = button.className.split(/\s+/).some((name) => {
        if (name.indexOf('buttonContainerSelected') === 0) {
          button.className = button.className.replace(name, `_${name}`);
          return true;
        }
        if (name.indexOf('_buttonContainerSelected') === 0) {
          button.className = button.className.replace(name, name.substr(1));
        }
      });
      const sidenav = document.querySelector('[data-auto="mySidenav"]');
      if (sidenav) {
        sidenav.style.display = hiding ? 'none' : null;
      }
    });
    return true;
  };
  const manageInterval = setInterval(() => {
    if (manageSidNav()) {
      clearInterval(manageInterval);
    }
  }, 1000);
  setTimeout(() => {
    clearInterval(manageInterval);
  }, 10000);
})()