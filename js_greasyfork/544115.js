// ==UserScript==
// @name          Greasyfork in Simplified Chinese
// @description   Localize every greasyfork page to the Simplified Chinese. Forked from https://greasyfork.org/zh-CN/scripts/6245
// @version       0.0.2
// @match         https://greasyfork.org/*
// @exclude       https://greasyfork.org/system/*
// @exclude       https://greasyfork.org/*.user.css*
// @exclude       https://greasyfork.org/zh-CN/*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @license MIT


// @namespace https://greasyfork.org/users/170891
// @downloadURL https://update.greasyfork.org/scripts/544115/Greasyfork%20in%20Simplified%20Chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/544115/Greasyfork%20in%20Simplified%20Chinese.meta.js
// ==/UserScript==

var language = GM_setValue('language', 'zh-CN');

maybeRedirect(location);



window.addEventListener('mousedown', function(e) {
  var a = e.target.closest('a');
  if (a &&
      a.origin === 'https://greasyfork.org' &&
      a.pathname.lastIndexOf('/system/', 0) < 0 &&
      !a.pathname.match(/\/code\/.*?\.user\.(js|css)/))
    maybeRedirect(a);
}, true);

function makeRedirectedUrl(url) {
  var m = url.href.split('/');
  if (!/^\w\w(?:-\w\w)?$/.test(m[3]))
    m.splice(3, 0, '');
  if (m[3] === language)
    return url.href;
  m[3] = language;
  var newUrl = m.join('/').replace(/&?locale_override[^&]*/, '').replace(/\?$/, '');
  var noOvr = m[4] === 'forum' || m[4] === 'scripts' && /^\D|^$/.test(m[5]);
  return noOvr ? newUrl : newUrl + (newUrl.indexOf('?') > 0 ? '&' : '?') + 'locale_override=1';
}

function maybeRedirect(url) {
  var newUrl = makeRedirectedUrl(url);
  if (newUrl === url.href ||
     document.referrer && makeRedirectedUrl({href: document.referrer}) === newUrl)
    return;
  url.href = newUrl;
}
