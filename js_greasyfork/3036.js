// ==UserScript==
// @name        Pipermail archives wrap pre
// @namespace   armeagle.nl
// @include     http://lists.*/pipermail/*
// @version     1
// @grant       none
// @description Fix something in Pipermail
// @downloadURL https://update.greasyfork.org/scripts/3036/Pipermail%20archives%20wrap%20pre.user.js
// @updateURL https://update.greasyfork.org/scripts/3036/Pipermail%20archives%20wrap%20pre.meta.js
// ==/UserScript==

var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'data:text/css,' +
            // Selectors start here
            'body > pre { white-space: pre-wrap; }';
document.getElementsByTagName("HEAD")[0].appendChild(link);