// ==UserScript==
// @name         Split fbclid
// @author       DungGramer
// @version      1.2
// @description  Split fbclid when open link from facebook
// @homepage     https://greasyfork.org/en/scripts/415274-split-fbclid
// @namespace    https://www.facebook.com/dung.dev.gramer/
// @icon         https://www.flaticon.com/svg/static/icons/svg/889/889578.svg
// @include      /((&fbclid=\w+)|(fbclid=\w+))(-\w+|)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415274/Split%20fbclid.user.js
// @updateURL https://update.greasyfork.org/scripts/415274/Split%20fbclid.meta.js
// ==/UserScript==

(function() {
    let newURL = window.location.href.split(/((&fbclid=\w+)|(fbclid=\w+))(-\w+|)/);
    let newHref = newURL[0].match(/\?\w+/) != null ? newURL[0] : newURL[0].split(/\?/)[0];
    if(newURL[newURL.length - 1].match(/-\w+/) != null) {
        history.replaceState(null, '', newHref);
    } else {
         history.replaceState(null, '', newHref + newURL[newURL.length - 1]);
    }
})();