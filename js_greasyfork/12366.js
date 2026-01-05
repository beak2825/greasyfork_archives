// ==UserScript==
// @name         Fileproject/Aliancaproject/Punchsub.zlx.com.br
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.3
// @description  Renove o tempo de espera no site Fileproject.com.br
// @author       HimawariChan - Felippe
// @include      http*://*.fileproject.com.br/*
// @include      *zlx.com.br*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/12366/FileprojectAliancaprojectPunchsubzlxcombr.user.js
// @updateURL https://update.greasyfork.org/scripts/12366/FileprojectAliancaprojectPunchsubzlxcombr.meta.js
// ==/UserScript==
 
unsafeWindow.tempo = 0;
countdown(1);
