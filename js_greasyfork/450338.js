// ==UserScript==
// @name         百度文库助手极简版
// @version      1.2
// @description  破解百度文库VIP限制
// @author       ChaLing
// @match        https://wenku.baidu.com/view/*
// @icon         https://edu-wenku.bdimg.com/v1/pc/view/FileTypeIcon2022/word.svg
// @grant        none
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/951759
// @downloadURL https://update.greasyfork.org/scripts/450338/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8A%A9%E6%89%8B%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450338/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8A%A9%E6%89%8B%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    let data;
    Object.defineProperty(window,'pageData',{
        set(newObj){
            data = newObj;
        },
        get(){
            if ('vipInfo' in data) {
                data.vipInfo.isVip = true;
            }
            return data;
        }
    })

})();