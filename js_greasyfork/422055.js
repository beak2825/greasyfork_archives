// ==UserScript==
// @name         Disable DRM
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      AGPLv3
// @author       jcunews
// @description  Disable DRM.
// @match        *://site-with-fake-drm.nowhere/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/422055/Disable%20DRM.user.js
// @updateURL https://update.greasyfork.org/scripts/422055/Disable%20DRM.meta.js
// ==/UserScript==

/*
This script is intended for Firefox web browser, but can also be used in Chrome.
When DRM is disabled in Firefox web browser settings, the browser still prompts user to enable DRM when the site requested the DRM's media key.
Some sites don't actually need the media key. i.e. where their video/audio medias are not actually DRM protected.
So, these kind of sites request the media key only for the sake of tracking video views.
This script automatically rejects the media key request so that Firefox don't display the Enable-DRM prompt (which if enabled,
will send a network request to retrieve the media key from the server).
This script must be manually configured for such sites, otherwise it won't do anything.
*/

(window => {
  var rmksa = navigator.requestMediaKeySystemAccess;
  window.navigator.requestMediaKeySystemAccess = function() {
    var rf, pr = new Promise(function(resolve, reject) {
      setTimeout(() => reject(), 20)
    }), pc = pr.catch;
    p.catch = function(fn) {
      rf = fn;
      return pc.apply(this, arguments)
    };
    return pr
  };
})(unsafeWindow)
