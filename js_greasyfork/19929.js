// ==UserScript==
// @name         Google-Maps-Language-Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Greasemonkey/Tampermonkey script which let you switch the interface language of Google Maps quickly.
// @author       Observer
// @include      /^https?\:\/\/www\.google\..+\/maps/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19929/Google-Maps-Language-Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/19929/Google-Maps-Language-Switcher.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
function setGetParameter(paramName, paramValue)
{
    var url = window.location.href;
    var hash = location.hash;
    url = url.replace(hash, '');
    if (url.indexOf(paramName + "=") >= 0)
    {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else
    {
    if (url.indexOf("?") < 0)
        url += "?" + paramName + "=" + paramValue;
    else
        url += "&" + paramName + "=" + paramValue;
    }
    window.location.href = url + hash;
}
  if (!window.location.href.match(/hl=ja/)) {
    setGetParameter("hl", "ja")
  }
})();