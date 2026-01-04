// ==UserScript==
// @name        YouTube App Style Bottom Tab Bar
// @namespace   Violentmonkey Scripts
// @icon        https://www.youtube.com/s/desktop/fa273944/img/favicon_144x144.png
// @match       *://www.youtube.com/*
// @exclude     *://www.youtube.com/live_chat*
// @run-at      document-body
// @noframes    
// @grant       none
// @version     0.9.1
// @author      y-saeki
// @supportURL  https://github.com/y-saeki/UserScript
// @description Add YouTube smartphone app styled Bottom Tab Bar
// @downloadURL https://update.greasyfork.org/scripts/452872/YouTube%20App%20Style%20Bottom%20Tab%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/452872/YouTube%20App%20Style%20Bottom%20Tab%20Bar.meta.js
// ==/UserScript==

init();
check();

// Observe Screen Transition
const observeTarget = document.querySelector('head');
const observer = new MutationObserver(check);
observer.observe(observeTarget, { childList: true });

// Runs everytime when mutated
function check() {
  let path
  location.pathname.startsWith('/shorts') ? path = '/shorts' : path = location.pathname;

  // Hide BottomTabBar when watching video
  const bottomTabBar = document.getElementById('app-style-bottom-tab-bar');
  if (path === '/watch') {
    bottomTabBar.style.opacity = '0';
    bottomTabBar.style.bottom = '-10vh';
  } else {
    bottomTabBar.style.opacity = '1';
    bottomTabBar.style.bottom = '0';
  }

  // BottomTabBar icon current state
  const bottomTabBarItem = document.querySelectorAll('#app-style-bottom-tab-bar > a');
  for (i = 0; i < Object.keys(bottomTabBarItem).length; i++) {
    if (path === bottomTabBarItem[i].pathname) {
      bottomTabBarItem[i].setAttribute('current', '');
    } else {
      bottomTabBarItem[i].removeAttribute('current');
    }
  }
}

// Add Bottom Tab Bar
function init() {
  const html = `

  <div id="app-style-bottom-tab-bar">
    <a name="home" href="/">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <path class="unfilled" d="M12,4.33l7,6.12V20H15V14H9v6H5V10.45l7-6.12M12,3,4,10V21h6V15h4v6h6V10L12,3Z"></path>
        <path class="filled" d="M4,10V21h6V15h4v6h6V10L12,3Z"></path>
      </svg>
      <div class="label">Home</div>
    </a>
    <a name="shorts" href="/shorts">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path class="unfilled" d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z"></path>
          <path class="filled" d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z"></path>
        </g>
      </svg>
      <div class="label">Shorts</div>
    </a>
    <a name="subscriptions" href="/feed/subscriptions">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path class="unfilled" d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z"></path>
          <path class="filled" d="M20,7H4V6h16V7z M22,9v12H2V9H22z M15,15l-5-3v6L15,15z M17,3H7v1h10V3z"></path>
        </g>
      </svg>
      <div class="label">Subscriptions</div>
    </a>
    <a name="library" href="/feed/library">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g>
          <path class="unfilled" d="M11,7l6,3.5L11,14V7L11,7z M18,20H4V6H3v15h15V20z M21,18H6V3h15V18z M7,17h13V4H7V17z"></path>
          <path class="filled" d="M4,20h14v1H3V6h1V20z M21,3v15H6V3H21z M17,10.5L11,7v7L17,10.5z"></path>
        </g>
      </svg>
      <div class="label">Library</div>
    </a>
  </div>

  <style>
    html #app-style-bottom-tab-bar {
      position: fixed;
      bottom: 0;
      width: 100vw;
      z-index: 9999;

      border-top: 1px solid;
      text-align: center;

      display: grid;
      justify-content: center;
      grid-template-columns: repeat(4, 80px);
      grid-template-rows: 1fr;
      gap: 0px 32px;
      padding: 8px 0;

      transition: all .25s ease-in-out;
      opacity: 0;
    }

    html #app-style-bottom-tab-bar,
    html #app-style-bottom-tab-bar * {
      background-color: var(--light-theme-background-color);
      border-color:     var(--light-theme-divider-color);
      color:            var(--light-theme-text-color);
      fill:             var(--light-theme-text-color);
    }
    html[dark] #app-style-bottom-tab-bar,
    html[dark] #app-style-bottom-tab-bar * {
      background-color: var(--dark-theme-background-color);
      border-color:     var(--dark-theme-divider-color);
      color:            var(--dark-theme-text-color);
      fill:             var(--dark-theme-text-color);
    }

    html #app-style-bottom-tab-bar a {
      text-decoration: none;
    }

    html #app-style-bottom-tab-bar a svg {
      width: 28px;
    }

    html #app-style-bottom-tab-bar a svg .filled {
      opacity: 0;
    }

    html #app-style-bottom-tab-bar a[current] svg .filled {
      opacity: 1;
    }
    html #app-style-bottom-tab-bar a[current] svg .unfilled {
      opacity: 0;
    }


    /*   Delete mini sidebar   */
    #content ytd-mini-guide-renderer {
      display: none;
    }
    ytd-app[mini-guide-visible] ytd-page-manager.ytd-app {
      margin-left: 0;
    }

  </style>

  `
  const element = document.body;
  element.insertAdjacentHTML('beforeend', html);

  // i18n for Japanese Users
  if (navigator.language === "ja") {
    const labelHome = document.querySelector('#app-style-bottom-tab-bar a[name="home"] .label');
    labelHome.textContent = 'ホーム';
    const labelShort = document.querySelector('#app-style-bottom-tab-bar a[name="shorts"] .label');
    labelShort.textContent = 'ショート';
    const labelSubscriptions = document.querySelector('#app-style-bottom-tab-bar a[name="subscriptions"] .label');
    labelSubscriptions.textContent = '登録チャンネル';
    const labelLibrary = document.querySelector('#app-style-bottom-tab-bar a[name="library"] .label');
    labelLibrary.textContent = 'ライブラリ';
  }
}
