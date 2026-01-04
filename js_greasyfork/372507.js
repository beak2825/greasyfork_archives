// ==UserScript==
// @name         AtCoder Twitter Avatar
// @namespace    https://ciffelia.com/
// @version      2.0.0
// @description  Display Twitter avatar on AtCoder user page
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @license      MIT
// @homepage     https://github.com/ciffelia/atcoder-twitter-avatar#readme
// @supportURL   https://github.com/ciffelia/atcoder-twitter-avatar/issues
// @match        https://atcoder.jp/users/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372507/AtCoder%20Twitter%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/372507/AtCoder%20Twitter%20Avatar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const twLinkElm = document.querySelector('a[href*="//twitter.com/"]');

  if (twLinkElm !== null) {
    const screenName = twLinkElm.innerText;
    const avatarUrl = `https://avatars.io/twitter/${screenName}/small`;

    const avatarElm = document.createElement('img');
    avatarElm.src = avatarUrl;
    avatarElm.referrerPolicy = 'no-referrer';
    Object.assign(avatarElm.style, {
      width: '20px',
      height: '20px',
      marginRight: '5px',
      borderRadius: '50%'
    });

    twLinkElm.insertAdjacentElement('afterbegin', avatarElm);
  }

}());
