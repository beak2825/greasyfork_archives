// ==UserScript==
// @name         bukaivip去广告
// @namespace    https://bukaivip.com/
// @version      0.1
// @description  bukaivip去广告脚本
// @author       Nite07
// @match        *://bukaivip.com/*
// @icon         https://www.google.com/s2/favicons?domain=bukaivip.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430972/bukaivip%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430972/bukaivip%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const f = () => {
    var headerEat = document.getElementById('header_eat');
    var HMRichBox = document.getElementById('HMRichBox');
    var HMcoupletDivleft = document.getElementById('HMcoupletDivleft');
    var HMcoupletDivright = document.getElementById('HMcoupletDivright');
    headerEat.style.display = 'none';
    HMRichBox.style.display = 'none';
    HMcoupletDivleft.style.display = 'none';
    HMcoupletDivright.style.display = 'none';
    }
    window.onload = f
})();