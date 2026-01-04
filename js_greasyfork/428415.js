// ==UserScript==
// @name        "Deny" cookies and tracking - theverge.com
// @namespace   https://greasyfork.org/en/users/787028
// @match       https://www.theverge.com/*
// @grant       none
// @version     1.0
// @author      Roc3221337
// @license      MIT
// @description "Deny" cookies and tracking by simply deleting the modal that ask you to accept it.
// @homepageURL https://github.com/Roc3221337/the_verge_deny_cookies_and_tracking#readme
// @supportURL https://github.com/Roc3221337/the_verge_deny_cookies_and_tracking/issues

// @downloadURL https://update.greasyfork.org/scripts/428415/%22Deny%22%20cookies%20and%20tracking%20-%20thevergecom.user.js
// @updateURL https://update.greasyfork.org/scripts/428415/%22Deny%22%20cookies%20and%20tracking%20-%20thevergecom.meta.js
// ==/UserScript==


var privacyAgreement = document.querySelector('.m-privacy-consent')
privacyAgreement.remove()