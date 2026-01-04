// ==UserScript==
// @name         NUS e-journals download redirect
// @version      0.1
// @description  e-journals download redirect for NUS students
// @include      *://www.nature.com/*
// @include      *://aip.scitation.org/*
// @include      *://journals.aps.org/*
// @include      *://onlinelibrary.wiley.com/*
// @include      *://pubs.acs.org/*
// @author       SAPEREAUDE
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/741351
// @downloadURL https://update.greasyfork.org/scripts/422320/NUS%20e-journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/422320/NUS%20e-journals%20download%20redirect.meta.js
// ==/UserScript==

document.location.href = document.location.href.replace('www.nature.com', 'www-nature-com.libproxy1.nus.edu.sg').replace('aip.scitation.org','aip-scitation-org.libproxy1.nus.edu.sg').replace('journals.aps.org','journals-aps-org.libproxy1.nus.edu.sg').replace('onlinelibrary.wiley.com','onlinelibrary-wiley-com.libproxy1.nus.edu.sg').replace('pubs.acs.org','pubs-acs-org.libproxy1.nus.edu.sg');
