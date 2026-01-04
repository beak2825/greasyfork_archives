// ==UserScript==
// @name         unLimitedCo
// @version      0.0.1
// @homepageURL  https://github.com/x000001x/unLimitedCo
// @description  bypass 2048 MB file size limit on dosya.co
// @license      MIT
// @match        https://dosya.co/*
// @namespace    https://github.com/x000001x/unLimitedCo
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464330/unLimitedCo.user.js
// @updateURL https://update.greasyfork.org/scripts/464330/unLimitedCo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // dosya.co bypass limit
    window.checkSize = function(obj) {return true};
    window.getFileSize = function(obj) {return 1024}

})();
