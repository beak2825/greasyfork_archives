// ==UserScript==
// @name         Always Start With 100000 Resources
// @author       EmersonxD
// @description  Start with 100000 resources in moomoo.io
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @run-at       document-start
// @version      0.0.1
// @namespace    https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481095/Always%20Start%20With%20100000%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/481095/Always%20Start%20With%20100000%20Resources.meta.js
// ==/UserScript==

localStorage.setItem("res", 100000);
