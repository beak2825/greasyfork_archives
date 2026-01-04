// ==UserScript==
// @name         ZhihuCE
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Ce editor for zhihu
// @author       YaliKiWi
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387346/ZhihuCE.user.js
// @updateURL https://update.greasyfork.org/scripts/387346/ZhihuCE.meta.js
// ==/UserScript==

//Headline_Editor
(function () {
    'use strict';
    var self = document.getElementById('Sticky is-fixed');
	var parent = self.parentElment;
	var removed = parent.removeChild(self);
})();