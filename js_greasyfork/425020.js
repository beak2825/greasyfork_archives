// ==UserScript==
// @name         dobon.net close vb.net
// @namespace    https://twitter.com/kawaidainfinity
// @version      0.2
// @description  dobon.netのVB.NETのコードを隠すスクリプトです。
// @author       kawaida
// @match        https://dobon.net/vb/dotnet/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425020/dobonnet%20close%20vbnet.user.js
// @updateURL https://update.greasyfork.org/scripts/425020/dobonnet%20close%20vbnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

$(function() {
    $(".vb").hide();
});