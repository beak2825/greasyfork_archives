// ==UserScript==
// @name         删除A站首页横幅
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除A站/Acfun的首页横幅。1.5脚猫功夫，不会维护。
// @author       Elcon
// @match        https://www.acfun.cn/
// @icon         https://i.postimg.cc/ZR98CfNp/20210825205913.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431355/%E5%88%A0%E9%99%A4A%E7%AB%99%E9%A6%96%E9%A1%B5%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/431355/%E5%88%A0%E9%99%A4A%E7%AB%99%E9%A6%96%E9%A1%B5%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==


	var objectpb = document.getElementById('pagelet_banner');
    if (objectpb != null){
        objectpb.parentNode.removeChild(objectpb);
    }
