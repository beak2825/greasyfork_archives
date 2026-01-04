// ==UserScript==
// @name         链家-地图找房打开所有房子1.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  链家-地图找房打开所有房子
// @author       You
// @match        https://lease-pz.link.lianjia.com/rent/house/map
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514818/%E9%93%BE%E5%AE%B6-%E5%9C%B0%E5%9B%BE%E6%89%BE%E6%88%BF%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E6%88%BF%E5%AD%9010.user.js
// @updateURL https://update.greasyfork.org/scripts/514818/%E9%93%BE%E5%AE%B6-%E5%9C%B0%E5%9B%BE%E6%89%BE%E6%88%BF%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E6%88%BF%E5%AD%9010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let i = 1; i < document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div > div.ditu-house_list > div:nth-child(3) > div.lj-track > div > div > ul").childElementCount+1; i++) {
    document.querySelector("#leaseroot > div > div > div.ant-layout-content > div > div > div.ditu-house_list > div:nth-child(3) > div.lj-track > div > div > ul > li:nth-child("+i+")").click()
}

    
    // Your code here...
})();