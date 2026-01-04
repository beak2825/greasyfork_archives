// ==UserScript==
// @name         Boomberg Quint Paywall Bypass
// @version      0.1
// @description  Bypasses the Bloomberg Quint/India paywall
// @author       Jujhar Singh
// @match        https://www.bloombergquint.com/*
// @grant        none
// @namespace https://greasyfork.org/users/303738
// @downloadURL https://update.greasyfork.org/scripts/383398/Boomberg%20Quint%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/383398/Boomberg%20Quint%20Paywall%20Bypass.meta.js
// ==/UserScript==

(() => {
    let old = window.fetch;
    window.fetch = () => {
        Promise.resolve().then(() => window.fetch = old)
    }
})()