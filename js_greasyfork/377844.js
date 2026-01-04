// ==UserScript==
// @name         AtCoderBackGroundColorizer
// @namespace    https://greasyfork.org/ja/scripts/377844
// @version      1.1
// @description  Colorize background of AtCoder with your favorite color.
// @author       Mister
// @match        https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377844/AtCoderBackGroundColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/377844/AtCoderBackGroundColorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------->8---------------------------->8--------------

    // 色の指定
    var paintingColor = "#E0F8E0";

    // --------------8<----------------------------8<--------------

    // 色を変える
    var elm = document.getElementById('main-div');
    elm.style.background = paintingColor;
})();