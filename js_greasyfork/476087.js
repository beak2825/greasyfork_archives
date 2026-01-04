// ==UserScript==
// @name         LZT Small Hides
// @namespace    lzt-small-hides
// @version      1.0
// @description  removes a bunch of nicknames from hide
// @author       Toil
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/toil/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476087/LZT%20Small%20Hides.user.js
// @updateURL https://update.greasyfork.org/scripts/476087/LZT%20Small%20Hides.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // * STYLES
  GM_addStyle(`
    .LSHLink {
      color: rgb(148, 148, 148);
      cursor: pointer;
    }
    .LSHLink:hover {
      text-decoration: underline;
    }
  `)

  // * CONSTANTS
  const XF_LANG = XenForo?.visitor?.language_id === 1 ? 'en' : 'ru';
  const timestamp = Math.floor(Date.now() / 1000);
  const myLink = document.querySelector('#AccountMenu > .blockLinksList > li > a')?.href?.replace(window.location.origin + '/', ''); // get link to your profile

  // * I18N
  const i18n = {
    ru: {
      you: ' Вам',
      forYou: ' Вас',
      andMore: ' и еще ',
      users: 'пользователям',
      forUsers: 'пользователей',
      hiddenContent: 'Скрытый контент',
      hiddenContentFor: 'Скрытый контент для'
    },
    en: {
      you: ' You',
      forYou: ' You',
      andMore: ' and more ',
      users: 'users',
      forUsers: 'users',
      hiddenContent: 'Hidden content',
      hiddenContentFor: 'Hidden content for'
    },
    get(phrase) {
      return this[XF_LANG]?.[phrase] ?? phrase;
    },
  }

  // * SCRIPT
  await XenForo.scriptLoader.loadCssAsync(['avatar_user_badge', 'member_card'], `css.php?css=__sentinel__&style=9&dir=LTR&d=${timestamp}`); // force load member card css

  function formatHides(elements) {
    for (let hide of elements) {
      if (hide.children.length >= 2) {
        hide = hide.querySelector('.attribution.type');
      } else {
        hide = hide.querySelector('.hideContainer > .quote')
      }

      const content = hide.innerHTML;
      const contentSplitted = content.split(' <a href=');
      const hideUsersLength = contentSplitted.length - 1;

      let text = contentSplitted[0];
      // fix for named hides
      if (text === 'Hidden content for next users:' || text === 'Скрытый контент для пользователей') {
        text = i18n.get('hiddenContentFor');
      }

      const usersPhrase = text === i18n.get('hiddenContentFor') ? i18n.get('forUsers') : i18n.get('users');
      const youPhrase = text === i18n.get('hiddenContentFor') ? i18n.get('forYou') : i18n.get('you');

      if (hideUsersLength > 3) {
        const YouFilterString = `"${myLink}" class="username"`
        const formattedTextEl = document.createElement('span');
        const otherUsersEl = document.createElement('span');
        otherUsersEl.classList.add('LSHLink');
        otherUsersEl.onclick = async () => openUserListModal(contentSplitted.filter(a => !a.startsWith(YouFilterString)));

        const youInHide = contentSplitted.find(a => a.startsWith(YouFilterString));
        if (youInHide) {
          const formattedYouEl = document.createElement('span');
          formattedYouEl.classList.add('LSHLink');
          formattedYouEl.innerText = youPhrase;
          formattedYouEl.onclick = async () => await openUserModal(myLink);

          otherUsersEl.innerText = `${hideUsersLength - 1} ${usersPhrase}`;

          formattedTextEl.append(formattedYouEl, i18n.get('andMore'));
        } else {
          otherUsersEl.innerText = ` ${hideUsersLength} ${usersPhrase}`;
        }

        formattedTextEl.append(otherUsersEl)
        hide.innerHTML = '';
        hide.append(text, formattedTextEl, '.');
      }
    }
  }

  async function openUserModal(userLink) {
    const userContent = await XenForo.ajax(`/${userLink}?card=1`)
    return XenForo.createOverlay(null, userContent.templateHtml).load();
  }

  async function openUserListModal(users, title = i18n.get('hiddenContent')) {
    const container = document.createElement('div');
    const formattedUsers = users.map(a => a.startsWith('"') ? ' <a href=' + a : a);
    for (const formattedUser of formattedUsers) {
      container.innerHTML += formattedUser;
    }
    return XenForo.alert(container.innerHTML, title)
  }


  function init() {
    const hides = document.querySelectorAll(".bbCodeHide > aside");
    formatHides(hides);
  }

  init();

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newHides = node.querySelectorAll('.bbCodeHide > aside');
            if (newHides) {
              formatHides(newHides);
            }
          }
        });
      }
    }
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

})();