// ==UserScript==
// @name        Overvolt Referraler
// @description Referraler per Overvolt ;)
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     https://www.amazon.it/*/dp/*
// @include     https://www.amazon.it/dp/*
// @include     https://www.amazon.it/gp/product/*
// @include     https://www.banggood.com/*
// @version     1.0.3
// @icon        https://greasyfork.org/system/screenshots/screenshots/000/008/599/original/photo_2017-09-28_00-48-18.jpg?1506552632
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/33569/Overvolt%20Referraler.user.js
// @updateURL https://update.greasyfork.org/scripts/33569/Overvolt%20Referraler.meta.js
// ==/UserScript==
function updateURLParameter(url, param, paramVal) {
  var newAdditionalURL = '';
  var tempArray = url.split('?');
  var baseURL = tempArray[0];
  var additionalURL = tempArray[1];
  var temp = '';
  if (additionalURL) {
    tempArray = additionalURL.split('&');
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split('=') [0] != param) {
        newAdditionalURL += temp + tempArray[i];
        temp = '&';
      }
    }
  }
  var rows_txt = temp + '' + param + '=' + paramVal;
  return baseURL + '?' + newAdditionalURL + rows_txt;
}
if (window.location.host == 'www.banggood.com') {
  if (window.location.pathname.substr( - 5) == '.html') {
    if (window.location.href != updateURLParameter(window.location.href, 'p', '63091629786202015112')) {
      window.location.href = updateURLParameter(window.location.href, 'p', '63091629786202015112');
    }
  }
} else {
  if (window.location.href != updateURLParameter(window.location.href, 'tag', 'overVolt-21')) {
    window.location.href = updateURLParameter(window.location.href, 'tag', 'overVolt-21');
  }
}
