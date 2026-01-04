// ==UserScript==
// @name Peace!
// @description WORLD PEACE!
// @version 0.0.6
// @namespace LOSSES_PEACE
// @match https://www.baidu.com/
// @match https://*.360.cn/
// @match http://www.baidu.com/
// @match http://*.360.cn/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377116/Peace%21.user.js
// @updateURL https://update.greasyfork.org/scripts/377116/Peace%21.meta.js
// ==/UserScript==

window.stop();

setTimeout(() => {
  document.body.innerHTML = 'It Works!';
  document.head.innerHTML = '';
  document.body.setAttribute('style', 'font-size: 15px; font-family: serif; text-align: center; margin-top: 2em !important');
  document.title = 'Hello; World!';

  // Copy and pasted from https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
  const deleteAllCookies = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
  
  deleteAllCookies();
}, 1);