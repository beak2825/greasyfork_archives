// ==UserScript==
// @name         南航评教自动填充分数（南京航空航天大学）NUAA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  南京航空航天大学评教自动填充分数
// @author       五院小辣鸡
// @match        http://nwp.nuaa.edu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=nuaa.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437075/%E5%8D%97%E8%88%AA%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%88%86%E6%95%B0%EF%BC%88%E5%8D%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%89NUAA.user.js
// @updateURL https://update.greasyfork.org/scripts/437075/%E5%8D%97%E8%88%AA%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%88%86%E6%95%B0%EF%BC%88%E5%8D%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%89NUAA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.querySelector("#SI0").value=10
    document.querySelector("#SI1").value=10
    document.querySelector("#SI2").value=8
    document.querySelector("#SI3").value=10
    document.querySelector("#SI4").value=10
    document.querySelector("#SI5").value=10
    document.querySelector("#SI6").value=10
    document.querySelector("#SI7").value=10
    document.querySelector("#SI8").value=5
    document.querySelector("#SI9").value=10
    document.querySelector("#SI10").value=5
})();