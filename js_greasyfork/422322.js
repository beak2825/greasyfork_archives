// ==UserScript==
// @name         NUS e-journals download redirect
// @version      0.1.3
// @description  e-journals download redirect for NUS students V0.1.3
// @namespace    https://greasyfork.org/users/741351
// @include      *://www.nature.com/*
// @include      *://aip.scitation.org/*
// @include      *://journals.aps.org/*
// @include      *://onlinelibrary.wiley.com/*
// @include      *://pubs.acs.org/*
// @include      *://link.springer.com/*
// @include      *://www.sciencedirect.com/*
// @include      *://www.osapublishing.org/*
// @include      *://ieeexplore.ieee.org/*
// @include      *://pubs.rsc.org/*
// @include      *://iopscience.iop.org/*
// @include      *://science.sciencemag.org/*
// @include      *://www.spiedigitallibrary.org/*
// @include      *://www.cambridge.org/*

// @author       SAPEREAUDE
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/422322/NUS%20e-journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/422322/NUS%20e-journals%20download%20redirect.meta.js
// ==/UserScript==

document.location.href = document.location.href.replace('www.nature.com', 'www-nature-com.libproxy1.nus.edu.sg').replace('aip.scitation.org','aip-scitation-org.libproxy1.nus.edu.sg').replace('journals.aps.org','journals-aps-org.libproxy1.nus.edu.sg').replace('onlinelibrary.wiley.com','onlinelibrary-wiley-com.libproxy1.nus.edu.sg').replace('pubs.acs.org','pubs-acs-org.libproxy1.nus.edu.sg').replace('link.springer.com','link-springer-com.libproxy1.nus.edu.sg').replace('www.sciencedirect.com','www-sciencedirect-com.libproxy1.nus.edu.sg').replace('www.osapublishing.org','www-osapublishing-org.libproxy1.nus.edu.sg').replace('ieeexplore.ieee.org','ieeexplore-ieee-org.libproxy1.nus.edu.sg').replace('pubs.rsc.org','pubs-rsc-org.libproxy1.nus.edu.sg').replace('iopscience.iop.org','iopscience-iop-org.libproxy1.nus.edu.sg').replace('science.sciencemag.org','science-sciencemag-org.libproxy1.nus.edu.sg').replace('www.spiedigitallibrary.org','www-spiedigitallibrary-org.libproxy1.nus.edu.sg').replace('www.cambridge.org','www-cambridge-org.libproxy1.nus.edu.sg');