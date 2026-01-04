// ==UserScript==
// @name         colab 保持活跃 / make colab keep alive
// @name:zh      colab 保持活跃
// @name:en      colab keep alive
// @name:zh-CN   使 colab 保持活跃
// @name:ja      colab アクティブに保存
// @namespace    https://colab.research.google.com
// @version      1.1
// @description:zh  让colab 保存活跃
// @description:en  make colab keep alive
// @description:zh-CN   让 colab 保存活跃
// @description:ja   Google colab アクティブに保存
// @author       WangZha
// @match        *://colab.research.google.com/*
// @grant        none
// @description make colab keep alive
// @downloadURL https://update.greasyfork.org/scripts/412404/colab%20%E4%BF%9D%E6%8C%81%E6%B4%BB%E8%B7%83%20%20make%20colab%20keep%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/412404/colab%20%E4%BF%9D%E6%8C%81%E6%B4%BB%E8%B7%83%20%20make%20colab%20keep%20alive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var max = 80490
    var min = 60010
    var randomTime = parseInt(Math.random()*(max-min+1)+min,10)
    console.log(randomTime)

    function ClickConnect(){
        colab.config
        console.log("Connnect Clicked - Start");
        document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect").click();
        console.log("Connnect Clicked - End");
    };
    setInterval(ClickConnect, randomTime)
})();