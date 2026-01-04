// ==UserScript==
// @name         Fandom Wiki Tools Customizer
// @namespace    YOUR_NAMESPACE_HERE
// @version      1
// @license      Not sure
// @description  Customizes the Fandom Wiki Tools menu on *.fandom.com/*
// @author       ChatGPT, some Bing help, and U.ayaao.p. Original concept by TheSuper777
// @match        *://*.fandom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465717/Fandom%20Wiki%20Tools%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/465717/Fandom%20Wiki%20Tools%20Customizer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const isDesktop = window.innerWidth > 1366;
  const wikiTools = document.querySelectorAll('.wiki-tools');

  // Customize each wiki-tools container
  wikiTools.forEach(container => {
    // Only customize if viewport is desktop size or user has confirmed
    if (isDesktop || localStorage.getItem('confirmWikiToolsCustomization') === 'true') {
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        // Only customize links with titles
        if (link.title) {
          const titleText = document.createTextNode(link.title);
          const span = document.createElement('span');
          span.appendChild(titleText);
          link.appendChild(span);
        }
      });
    }

    // Add "Tools" label to dropdown toggle if viewport is desktop size
    if (isDesktop) {
      const dropdownToggle = container.querySelector('.wds-dropdown__toggle');
      const label = document.createTextNode('Tools');
      dropdownToggle.appendChild(label);
    }

    // Move theme switch to dropdown if viewport is not desktop size
    if (!isDesktop) {
      const themeSwitch = container.querySelector('.wiki-tools__theme-switch');
      if (themeSwitch) {
        const listItem = document.createElement('li');
        const link = themeSwitch.cloneNode(true);
        link.classList.remove('wds-button' ,'wds-is-secondary', 'wiki-tools__theme-switch');
        link.querySelector('svg').remove();
        listItem.appendChild(link);
        const dropdownContent = container.querySelector('.wds-dropdown__content ul');
        dropdownContent.appendChild(listItem);
        themeSwitch.remove();
      }
    }
  });

  // Store user confirmation if not already stored
  if (localStorage.getItem('confirmWikiToolsCustomization') === null) {
    const confirmCustomization = confirm('Do you want to customize the Fandom Wiki Tools menu?');
    localStorage.setItem('confirmWikiToolsCustomization', confirmCustomization);
  }
})();
