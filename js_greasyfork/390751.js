// ==UserScript==
// @name         Bootstrap Docs - Redirect to specified version of docs
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Allow redirecting to specified version of docs. Change in script.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/getbootstrap\.com\/docs\/.*?\/.*?$/
// @updated      2019-10-03
// @version      1.0.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390751/Bootstrap%20Docs%20-%20Redirect%20to%20specified%20version%20of%20docs.user.js
// @updateURL https://update.greasyfork.org/scripts/390751/Bootstrap%20Docs%20-%20Redirect%20to%20specified%20version%20of%20docs.meta.js
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

const BOOTSTRAP_VERSION = '4.3'; // Change this wanted versions...

let urlArr = location.href.split('/');

if(urlArr[4] !== BOOTSTRAP_VERSION) {
	urlArr[4] = BOOTSTRAP_VERSION;

	location.href = urlArr.join('/');
}