// ==UserScript==
// @name        VK.com avatar adder
// @namespace   vk_com_avatar_adder
// @description Adds an avatar for Gosha and replaces Lato with Bulban.
// @include     https://vk.com/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36331/VKcom%20avatar%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/36331/VKcom%20avatar%20adder.meta.js
// ==/UserScript==

console.log('Lato and Gosha avatar adder script');

const latoId = 371739638;
const goshaId = 3721556;

window.history.replaceState = decorate(window.history.replaceState, {after: run});
window.history.pushState = decorate(window.history.pushState, {after: run});

run();

function run() {
  addAvatars();
}

async function addAvatars() {
  if (!window.newAvatars) {
    const [latoAlias, goshaAlias] = await Promise.all([fetchAliasById(latoId), fetchAliasById(goshaId)]);
    window.newAvatars = document.createElement('style');
    window.newAvatars.textContent = `
      ${latoAlias && `a.im_grid[href="/${latoAlias}"],` || ''}
      ${goshaAlias && `a.im_grid[href="/${goshaAlias}"],` || ''}
			a.im_grid[href="/id${latoId}"],
      a.im_grid[href="/id${goshaId}"] {
        position: relative;
      }
      ${latoAlias && `a.im_grid[href="/${latoAlias}"]::after,` || ''}
      ${goshaAlias && `a.im_grid[href="/${goshaAlias}"]::after,` || ''}
			a.im_grid[href="/id${latoId}"]::after,
      a.im_grid[href="/id${goshaId}"]::after {
        content: '' !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 1px;
        background-size: cover !important;
      }
			${goshaAlias && `a.im_grid[href="/${goshaAlias}"]::after,
      .pv_author_img[href="/${goshaAlias}"] .ow_ava,` || ''}
			a.im_grid[href="/id${goshaId}"]::after,
      .pv_author_img[href="/id${goshaId}"] .ow_ava {
        background-image: url(https://pp.userapi.com/c841233/v841233924/470e0/nnW9YSJz1Fo.jpg) !important;
      }
			${latoAlias && `a.im_grid[href="/${latoAlias}"]::after,
			.pv_author_img[href="/${latoAlias}"] .ow_ava,` || ''}
			a.im_grid[href="/id${latoId}"]::after,
      .pv_author_img[href="/id${latoId}"] .ow_ava {
        background-image: url(https://pp.userapi.com/c837230/v837230851/1a27f/YziKgXTtCF4.jpg) !important;
      }
      ${latoAlias && `a.im-mess-stack--lnk[href="/${latoAlias}"],` || ''}
			a.im-mess-stack--lnk[href="/id${latoId}"] {
        font-size: 0;
      }
      ${latoAlias && `a.im-mess-stack--lnk[href="/${latoAlias}"]::after,` || ''}
			a.im-mess-stack--lnk[href="/id${latoId}"]::after {
        content: 'Bulban Marxevich';
        font-size: 12.5px;
          }
      ${latoAlias && `.im-mess-stack_fwd a.im-mess-stack--lnk[href="/${latoAlias}"]::after,` || ''}
			.im-mess-stack_fwd a.im-mess-stack--lnk[href="/id${latoId}"]::after {
        content: 'Bulban';
      }
    `;
    document.head.insertBefore(window.newAvatars, null);
  }
}

async function fetchAliasById(id) {
  return await fetch(`${location.protocol}//${location.hostname}/id${id}`)
    .then((response) => response.text())
    .then((text) => { return (text.match(/<link rel="alternate" href="android-app:\/\/com.vkontakte.android\/vkontakte\/m.vk.com\/([^"]+?)" \/>/) || [])[1] ;});
}


function decorate(func, { before, after }) {
  if (typeof func !== 'function' && (before || after) && (before && typeof before !== 'function' || after && typeof after !== 'function')) {
    throw Error('Both arguments should be functions.');
  }
  return function() {
    before && before();
    var returnValue = func.apply(this, arguments);
    after && after();
    return returnValue;
  }
}
