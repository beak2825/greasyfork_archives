// ==UserScript==
// @name         airtel bill payment1
// @version      1
// @description  a script to populate my phne number in airtel
/////////////////

/////////////////
// @grant        none
// @namespace    whizdm.com
// @run-at       document-start
// @include      *://greasyfork.org/forum/discussion/*
// @downloadURL https://update.greasyfork.org/scripts/18041/airtel%20bill%20payment1.user.js
// @updateURL https://update.greasyfork.org/scripts/18041/airtel%20bill%20payment1.meta.js
// ==/UserScript==
document.payBillFormBean.serviceInstance.value = "99003430343";
document.payBillFormBean.payAmount.value ="500";
document.payBillFormBean.submit();