// ==UserScript==
// @name        Redirect to Youtube Russia
// @match       *://*.youtube.com/*
// @match       *://*.youtu.be/*
// @grant       none
// @version     1.0
// @run-at      document-start
// @description Add url params for redirect to YT RU
// @license     MIT
// @namespace https://greasyfork.org/users/895893
// @downloadURL https://update.greasyfork.org/scripts/503531/Redirect%20to%20Youtube%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/503531/Redirect%20to%20Youtube%20Russia.meta.js
// ==/UserScript==

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('gl')) {
  function addOrUpdateUrlParam(name, value)
  {
    var href = window.location.href;
    var regex = new RegExp("[&\\?]" + name + "=");
    if(regex.test(href))
    {
      regex = new RegExp("([&\\?])" + name + "=\\d+");
      window.location.href = href.replace(regex, "$1" + name + "=" + value);
    }
    else
    {
      if(href.indexOf("?") > -1)
        window.location.href = href + "&" + name + "=" + value;
      else
        window.location.href = href + "?" + name + "=" + value;
    }
  }
  addOrUpdateUrlParam('gl', 'RU');
}