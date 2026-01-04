// ==UserScript==
// @name        Get data url
// @namespace   https://blog.bgme.me
// @match       *://*/*
// @run-at      document-idle
// @version     1.0
// @author      bgme
// @description input resource url and get data url
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @icon        -
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/406075/Get%20data%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/406075/Get%20data%20url.meta.js
// ==/UserScript==

"use strict";

unsafeWindow.toDataURL = toDataURL;
unsafeWindow.getDataURL = getDataURL;

// https://stackoverflow.com/questions/934012/get-image-data-url-in-javascript/42916772#42916772
function toDataURL(url, callback) {
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    responseType: "blob",
    onload(response) {
      var fr = new FileReader();

      fr.onload = function () {
        callback(this.result);
      };

      fr.readAsDataURL(response.response);
    },
  });
}

function getDataURL(url) {
  toDataURL(url, function (dataurl) {
    console.log(dataurl);
  });
}
