// ==UserScript==
// @name         化学树单标签模式bug修复
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  bug修复插件
// @author       yuyanMC
// @match        https://beautyfallencat.github.io/The-Chemistry-Tree/
// @match        https://the-chemistry-tree.g8hh.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/467273/%E5%8C%96%E5%AD%A6%E6%A0%91%E5%8D%95%E6%A0%87%E7%AD%BE%E6%A8%A1%E5%BC%8Fbug%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467273/%E5%8C%96%E5%AD%A6%E6%A0%91%E5%8D%95%E6%A0%87%E7%AD%BE%E6%A8%A1%E5%BC%8Fbug%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.document.tgebid=unsafeWindow.document.getElementById.bind(unsafeWindow.document);
    unsafeWindow.document.getElementById=function(id){
        if((id=="points"||id=="overlayThing")&&(unsafeWindow.document.tgebid(id)==null)){
            return unsafeWindow.document.createElement("h2");
        }else{
            return unsafeWindow.document.tgebid(id);
        }
    }
})();