// ==UserScript==
// @name            Scribd unblur
// @description		Unblur scribd.com documents
// @namespace		http://userscripts.org/users/404262
// @author          KrisWebDev
// @version         1.2
// @include         http://*.scribd.com/doc/*
// @include         https://*.scribd.com/doc/*
// @include			http://*.scribd.com/document/*
// @include			https://*.scribd.com/document/*
// @grant           GM_addStyle
// @updateUrl	https://greasyfork.org/scripts/3867-scribd-unblur/code/Scribd%20unblur.user.js
// @downloadURL https://update.greasyfork.org/scripts/3867/Scribd%20unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/3867/Scribd%20unblur.meta.js
// ==/UserScript==

GM_addStyle(".text_layer {	color: inherit !important; text-shadow: none !important; }"); 
GM_addStyle(".page-blur-promo {	display: none !important; }"); 
GM_addStyle(".page-blur-promo-overlay:parent {	display: none !important; }"); 
GM_addStyle(".absimg { opacity: 1.0 !important; }"); 
GM_addStyle(".page_missing_explanation { display: none !important; }"); 

// Credits: Steven Smith
GM_addStyle(".autogen_class_views_pdfs_page_blur_promo { display: none !important; }");
GM_addStyle(".a { color: black !important; }"); 