// ==UserScript==
// @name         city line 1.3
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在这里输入编写的代码以及对应的描述信息，描述信息中可以添加五张超过200KB的图片
// @author       You
// @match        https://msg.cityline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cityline.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/459227/city%20line%2013.user.js
// @updateURL https://update.greasyfork.org/scripts/459227/city%20line%2013.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(() =>{
     document.querySelector('#btn-retry-en-1').click();
    },500)
})();