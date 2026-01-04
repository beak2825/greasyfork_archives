// ==UserScript==
// @name        Redirect OLD reactor
// @description Redirect to old.reactor
// @author      donotblink
// @namespace https://greasyfork.org/users/675552
// @include     *://*joyreactor.cc/*
// @include     *://reactor.cc/*
// @include     *://*.reactor.cc/*
// @include     *://*jr-proxy.com/*
// @include     *://*jrproxy.com/*
// @include     *://*cookreactor.com/*
// @include     *://*thatpervert.com/*
// @include     *://*safereactor.cc/*
// @exclude     *://old.reactor.cc/*
// @exclude     *://img*.reactor.cc/*
// @version 0.0.1.20230307110139
// @downloadURL https://update.greasyfork.org/scripts/428845/Redirect%20OLD%20reactor.user.js
// @updateURL https://update.greasyfork.org/scripts/428845/Redirect%20OLD%20reactor.meta.js
// ==/UserScript==
const url = new URL(document.location.href);
window.open('http://old.reactor.cc' + url.pathname + url.hash,"_self");