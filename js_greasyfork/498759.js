// ==UserScript==
// @name         myhackernews
// @namespace    https://github.com/jeanlucaslima/myhackernews/
// @version      3.1.1
// @description  Apply a dark theme to Hacker News, modify navigation links, and add a custom menu with highlighted active links
// @license      MIT
// @copyright    jeanlucaslima
// @author       jeanlucaslima
// @homepageURL  https://github.com/jeanlucaslima/myhackernews/
// @supportURL   https://github.com/jeanlucaslima/myhackernews/issues
// @match        https://news.ycombinator.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498759/myhackernews.user.js
// @updateURL https://update.greasyfork.org/scripts/498759/myhackernews.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Theme definitions
  const themes = {
      darkNavy: {
          dark: true,
          '--background-color': '#1a202c',
          '--table-background-color': '#2d3848',
          '--text-color': '#dddddd',
          '--link-color': '#9facbe',
          '--pagetop-background-color': '#2d3848',
          '--pagetop-text-color': '#9facbe',
          '--hnname-color': '#bb86fc',
          '--title-link-color': '#ededed',
          '--title-link-visited-color': '#7fe0d4',
          '--subtext-link-color': '#c8d2dc',
          '--itemlist-even-bg-color': '#1c1c1c',
          '--itemlist-odd-bg-color': '#121212',
          '--c00-color': '#c8d2dc',
          '--active-link-color': '#ff4500'
      },
      blackTheme: {
          dark: true,
          '--background-color': '#1f1f1f',
          '--table-background-color': '#1f1f1f',
          '--text-color': '#e0e0e0',
          '--link-color': '#828282',
          '--pagetop-background-color': '#1f1f1f',
          '--pagetop-text-color': '#828282',
          '--hnname-color': '#bb86fc',
          '--title-link-color': '#ededed',
          '--title-link-visited-color': '#868686',
          '--subtext-link-color': '#03dac6',
          '--itemlist-even-bg-color': '#1c1c1c',
          '--itemlist-odd-bg-color': '#121212',
          '--c00-color': '#ededed',
          '--active-link-color': '#ff6600'
      }
  };

  // Function to generate CSS rules from theme object
  function generateCSS(theme) {
      return `
          :root {
              color-scheme: ${theme.dark ? 'dark' : 'light'};
          }
          body, tbody {
              background-color: ${theme['--background-color']};
              color: ${theme['--text-color']};
          }
          a {
              color: ${theme['--link-color']};
          }
          a:link {
              color: ${theme['--link-color']};
          }
          .pagetop {
              background-color: ${theme['--pagetop-background-color']};
              padding: 0;
              color: ${theme['--pagetop-text-color']};
          }
          .pagetop a {
              color: ${theme['--pagetop-text-color']};
          }
          .pagetop a:visited {
              color: ${theme['--pagetop-text-color']};
          }
          .hnname a {
              color: ${theme['--hnname-color']};
          }
          td {
              background-color: ${theme['--table-background-color']};
          }
          td.title a {
              color: ${theme['--title-link-color']};
          }
          td.title a:visited {
              color: ${theme['--title-link-visited-color']};
          }
          .subtext a {
              color: ${theme['--subtext-link-color']};
          }
          .itemlist tr:nth-child(even) td {
              background-color: ${theme['--itemlist-even-bg-color']};
          }
          .itemlist tr:nth-child(odd) td {
              background-color: ${theme['--itemlist-odd-bg-color']};
          }
          table {
              background-color: ${theme['--table-background-color']} !important;
          }
          .c00, .c00 a:link { color: ${theme['--c00-color']}; }
          .menu a.active {
              color: ${theme['--active-link-color']};
              font-weight: bold;
          }
      `;
  }

  // Function to apply the theme
  function applyTheme(themeName) {
      const theme = themes[themeName];
      const style = document.createElement('style');
      style.textContent = generateCSS(theme);
      document.head.appendChild(style);
  }

  // Function to create and append new link
  function createLink(container, text, href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;

      // we use link.pathname to not mix with the queries when adding active status
      if (link.pathname === window.location.pathname) {
          link.classList.add('active');
      }
      if (container.childNodes.length === 1) {
          container.appendChild(document.createTextNode(' '));
      }
      if (container.childNodes.length > 2) {
          container.appendChild(document.createTextNode(' | '));
      }
      container.appendChild(link);
  }

  // Function to build the menu
  function buildMenu(container, userId) {
      createLink(container, 'Hacker News', '/');
      createLink(container, 'active', '/active');
      createLink(container, 'best', '/best');
      createLink(container, 'threads', `/threads?id=${userId}`);
      createLink(container, 'ask', '/ask');
      createLink(container, 'show', '/show');
      createLink(container, 'past', '/front');
      createLink(container, 'submit', '/submit');
  }

  // Function to modify the navigation links
  function modifyNav() {
      const pagetop = document.querySelector('.pagetop');
      if (pagetop) {
          // Find the user id for the threads link before clearing pagetop
          const userLink = pagetop.querySelector('a[href^="threads?id="]');
          const userId = userLink ? userLink.getAttribute('href').split('=')[1] : '';

          pagetop.innerHTML = ''; // Clear existing links
          pagetop.classList.add('menu');
          buildMenu(pagetop, userId);
      }
  }

  // Function to add the theme switcher
  function addThemeSwitcher() {
      const switcherSpan = document.createElement('span');
      const bottomContainer = document.querySelector('.yclinks');

      switcherSpan.className = 'theme_switcher';
      switcherSpan.style.display = 'block';
      switcherSpan.style.marginTop = '10px';

      const select = document.createElement('select');
      select.innerHTML = `
          <option value="darkNavy">Deep Navy</option>
          <option value="blackTheme">Black</option>
      `;
      select.value = localStorage.getItem('hn-theme') || 'darkNavy';
      select.addEventListener('change', () => {
          const selectedTheme = select.value;
          localStorage.setItem('hn-theme', selectedTheme);
          applyTheme(selectedTheme);
      });

      switcherSpan.appendChild(document.createTextNode('Theme: '));
      switcherSpan.appendChild(select);

      bottomContainer.appendChild(switcherSpan);
  }

  // Apply the saved theme on load
  const savedTheme = localStorage.getItem('hn-theme') || 'darkNavy';
  console.log(savedTheme);
  applyTheme(savedTheme);

  // Modify navigation and add theme switcher
  modifyNav();
  addThemeSwitcher();
})();
