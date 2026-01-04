// ==UserScript==
// @name         Spotify Web Sidebar Toggler
// @description  Adds the ability to toggle the main sidebar on Spotify Web using a keyboard shortcut (ctrl + alt + B), original code from https://github.com/dumptyd/slack-sidebar-toggler
// @author       dearrrfish (http://github.com/dearrrfish)
// @version      1.2.0
// @namespace    http://github.com/dearrrfish
// @include      https://open.spotify.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402152/Spotify%20Web%20Sidebar%20Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/402152/Spotify%20Web%20Sidebar%20Toggler.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const combinator = {
    on(passedCombination, callback) {
      const combination = passedCombination.map(c => c.toLowerCase());
      let buffer = [];
      let skipNextKeyUp = false;

      const isCombinationMet = () => buffer.toString() === combination.toString();

      document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        buffer.push(key);

        if (isCombinationMet()) {
          buffer.pop();
          if (buffer.length) skipNextKeyUp = true;

          callback();
        }
      });

      document.addEventListener('keyup', e => {
        if (skipNextKeyUp) {
          skipNextKeyUp = false;
          return;
        }
        buffer = [];
      });
    }
  };

  const onLoad = callback => {
    const loadedStates = ['loaded', 'interactive', 'complete'];
    if (loadedStates.includes(document.readyState)) {
      callback();
    }
    else {
      window.addEventListener('load', () => {
        callback();
      });
    }
  };

  const style = {
    leftSidebarCollapsedClassName: 'SST-left-sidebar-collapsed',
    containerSelector: '.Root__top-container',
    navbarSelector: '.Root__nav-bar',
    mainviewSelector: '.Root__main-view',
    topbarSelector: '.Root__top-bar header',
    nowplayingbarSelector: '.Root__now-playing-bar footer .now-playing-bar',
  };
  GM_addStyle(`

.${style.leftSidebarCollapsedClassName} ${style.topbarSelector} {
  max-width: 100vw;
}

${style.containerSelector} {
  transition: .2s;
}

.${style.leftSidebarCollapsedClassName} ${style.navbarSelector} {
  width: 0;
  opacity: 0;
  transition: width .2s, opacity .2s;
}

${style.mainviewSelector} {
  transition: width .2s;
}

${style.mainviewSelector} > div.nav-bar-toggler {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 7px;
  height: 100%;
  display: block;
}
${style.mainviewSelector} > div.nav-bar-toggler:hover {
  cursor: e-resize;
  content: linear-gradient(#e66465, #9198e5);
}
  `);

  GM_addStyle(`
body {
  font-family: Microsoft Yahei;
}

@media screen and (max-width: 700px) {
  body {
    min-width: unset;
  }

  ${style.nowplayingbarSelector} {
    width: 100%;
    min-width: unset;
    max-width: 100vw;
    min-height: 70px;
    padding: 10px 20px;
    height: unset;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  ${style.nowplayingbarSelector} .now-playing-bar__left {
      width: auto;
      order: 1;
  }

  ${style.nowplayingbarSelector} .now-playing-bar__center {
      width: 100%;
      order: 3;
  }

  ${style.nowplayingbarSelector} .now-playing-bar__right {
      max-width: 25%;
      min-width: unset;
      order: 2;
  }

  ${style.nowplayingbarSelector} .now-playing-bar__right__inner {
      width: 100%;
  }
}
  `)


  function toggleSideBar() {
    document.body.classList.toggle(style.leftSidebarCollapsedClassName);
  }

  onLoad(() => {
    combinator.on(['Control', 'Alt', 'B'], () => {
      toggleSideBar();
    });

    const checkMainViewExist = setInterval(() => {
      const mainview = document.querySelector(style.mainviewSelector);
      if (mainview) {
        const toggler = document.createElement('div');
        toggler.classList.add('nav-bar-toggler')
        toggler.onmousedown = (evt) => {
          evt.preventDefault();
          toggleSideBar();
        }
        mainview.appendChild(toggler);
        clearInterval(checkMainViewExist);
      }
    }, 500)

  });
})();
