// ==UserScript==
// @namespace   Planetsuzy
// @name        Planetsuzy Threads - Login Last Visit bug workaround
// @description Login Last Visit bug workaround
// @version     1.2
// @license     MIT
// @icon        http://ps.fscache.com/styles/style1/images/statusicon/forum_old.gif
// @include     /^https?:\/\/(www\.)?planetsuzy\.org\//
// @require     https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404001/Planetsuzy%20Threads%20-%20Login%20Last%20Visit%20bug%20workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/404001/Planetsuzy%20Threads%20-%20Login%20Last%20Visit%20bug%20workaround.meta.js
// ==/UserScript==

(() => {
  const locale = {
    welcome: 'Welcome',
    thankYouForLoggingIn: 'Thank you for logging in',
    youLastVisited: 'You last visited:',
    today: 'Today',
    at: 'at'
  };

  // Check for login page.
  const redirectPanel = document.querySelector('.panelsurround');
  if (redirectPanel !== null && redirectPanel.innerText.indexOf(locale.thankYouForLoggingIn) >= 0) {
    GM_setValue('loginFlag', true);
    GM_setValue('disabled', false);

    return;
  }

  // Parse currently displayed last login time.
  const welcomePanel = (() => {
    const lastLoginTimeElement = document.querySelector('table td[nowrap=nowrap] > div > span.time');

    if (lastLoginTimeElement !== null) {
      const welcomePanel = lastLoginTimeElement.closest('div');
      if (welcomePanel.innerText.indexOf(locale.welcome) >= 0 && welcomePanel.innerText.indexOf(locale.youLastVisited) >= 0) {
        return welcomePanel;
      }
    }

    return null;
  })();

  const replaceWords = [locale.at, locale.today].join('|');
  const displayedLastLoginTimeString = welcomePanel !== null ?
    welcomePanel.innerText.split(locale.youLastVisited, 2)[1].split('\n')[0].replace(new RegExp(`\\b(${replaceWords})\\b`, 'g'), ' ').replace(/\s+/, ' ').trim() :
    null;

  // Check for next page right after login.
  if (GM_getValue('loginFlag',  false) === true && displayedLastLoginTimeString !== null) {
    GM_setValue('lastLoginTime', Date.parse(displayedLastLoginTimeString).toString('s'));
    GM_setValue('loginFlag', false);
  }

  const rememberedLastLoginTimeString = GM_getValue('lastLoginTime', null);
  const effectiveLastLoginTime = Date.parse(rememberedLastLoginTimeString || displayedLastLoginTimeString);
  const isEnabled = !GM_getValue('disabled', false);

  // Replace displayed last login time with the correct one.
  if (welcomePanel !== null && rememberedLastLoginTimeString !== null) {
    const formattedDate = ((date) => {
      if (date.is().today()) {
        return 'Today';
      } else if (date.clone().add(1).day().is().today()) {
        return 'Yesterday';
      } else if (Date.today().toString('yyyy') === date.toString('yyyy')) {
        return date.toString('dS MMM');
      } else {
        return date.toString('dS MMM yyyy');
      }
    })(effectiveLastLoginTime);
    const formattedTime = effectiveLastLoginTime.toString('HH:mm');

    for (let node of welcomePanel.childNodes) {
      if (node.nodeType === 3 && node.nodeValue.indexOf(locale.youLastVisited) >= 0) {
        node.nodeValue = node.nodeValue.substring(0, node.nodeValue.indexOf(locale.youLastVisited) + locale.youLastVisited.length) +
          ` ${formattedDate} ` +
          node.nodeValue.substring(node.nodeValue.lastIndexOf(locale.at));
      } else if (node.nodeType === 1 && node.nodeName === 'SPAN' && node.classList.contains('time')) {
        node.innerText = formattedTime;
      }
    }
  }

  // Visibly mark old posts.
  if (isEnabled) {
    document.querySelectorAll('div[id^=edit]')
      .forEach((postElement) => {
        const postId = postElement.getAttribute('id').split('edit', 2)[1];
        const anchor = postElement.querySelector(`a[name^=post${postId}]`);
        const postTime = Date.parse(anchor.parentElement.innerText.trim());

        if (postTime < effectiveLastLoginTime) {
          postElement.classList.add('thread-tools-old-post');
        }
      });
  }

  // Buttons to disable functionality until next login.
  const threadToolsMenu = document.querySelector('#threadtools_menu tbody');
  if (threadToolsMenu !== null) {
    function createThreadToolsMenuElement(enabled, icon, caption, disabledCaption, callback) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const link = document.createElement('a');
      link.innerHTML = caption;
      const span = document.createElement('span');
      span.innerHTML = icon;
      span.style.padding = '0 .7em';
      function onMouseOver() {
        td.setAttribute('class', 'vbmenu_hilite vbmenu_hilite_alink');
        td.style.cursor = 'pointer';
      };
      function onMouseOut() {
        td.setAttribute('class', 'vbmenu_option vbmenu_option_alink');
        td.style.cursor = 'default';
      };
      function onClick() {
        td.removeEventListener('mouseover', onMouseOver);
        td.removeEventListener('mouseout', onMouseOut);
        link.removeEventListener('click', onClick);
        link.innerHTML += ' (' + disabledCaption + ')';
        link.style.opacity = '0.7';
        onMouseOut();
        callback();
      }
      onMouseOut();

      if (enabled) {
        td.addEventListener('mouseover', onMouseOver);
        td.addEventListener('mouseout', onMouseOut);
        link.addEventListener('click', onClick);
      } else {
        link.innerHTML += ' (' + disabledCaption + ')';
        link.style.opacity = '0.7';
      }
      link.prepend(span);
      td.appendChild(link);
      tr.appendChild(td);
      return tr;
    }

    const oldPostElements = document.querySelectorAll('div[id^=edit].thread-tools-old-post');

    threadToolsMenu.appendChild(
      createThreadToolsMenuElement(
        oldPostElements.length > 0,
        '👀',
        'Disable old posts marking until next login',
        isEnabled && oldPostElements.length === 0 ? 'no old posts on page' : 'disabled',
        () => {
          document.querySelectorAll('div[id^=edit].thread-tools-old-post')
            .forEach((element) => element.classList.remove('thread-tools-old-post'));
          GM_setValue('disabled', true);
        }
      )
    );

    const threadToolsButton = document.querySelector('#threadtools');
    if (threadToolsButton !== null) {
      threadToolsButton.classList.add('thread-tools-old-post-have-additions');
    }
  }
})();

GM_addStyle(`
  .thread-tools-old-post-have-additions {
    background: #2c539e;
    transition: background 300ms linear;
  }
  .thread-tools-old-post {
    opacity: .5;
    transition: opacity .2s;
  }
  .thread-tools-old-post:hover {
    opacity: 1;
  }
`);
