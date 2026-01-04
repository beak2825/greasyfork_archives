// ==UserScript==
// @name        maps.gov.gr
// @description Hide overlay elements in maps.gov.gr
// @version     1
// @grant       GM_addStyle
// @match       http*://maps.gov.gr/*
// @license     MIT
// @namespace https://greasyfork.org/users/674500
// @downloadURL https://update.greasyfork.org/scripts/489502/mapsgovgr.user.js
// @updateURL https://update.greasyfork.org/scripts/489502/mapsgovgr.meta.js
// ==/UserScript==

/* Header */
GM_addStyle("header { display:none !important; }");
GM_addStyle("#Canvas { min-height:calc(100vh - 39px) !important; }");

/* Toolbar */
GM_addStyle("[id='KT.KTWebMap.0.ToolBar'] { display:none !important; }");
GM_addStyle("#monuments { display:none !important; }");
GM_addStyle("[href='#loadFile'] { display:none !important; }");
GM_addStyle("[href='javascript:createApospasma();'] { display:none !important; }");
GM_addStyle("[href='javascript:save();'] { display:none !important; }");

/* Coords */
GM_addStyle(".KT__InfoDiv { display:none !important; }");

/* Terget */
GM_addStyle("[id='KT.KTWebMap.0.CenterImage'] { display:none !important; }");

/* Dates */
GM_addStyle("#mapTypeLeft { display:none !important; }");
GM_addStyle("#mapTypeRight { display:none !important; }");

/* Logo */
GM_addStyle("[id='KT.KTWebMap.0.KtimMapLogo'] { display:none !important; }");

/* Map labels */
GM_addStyle("[id='KT.KTWebMap.0.InfoDrawingCanvas'] { display:none !important; }");