// ==UserScript==
// @name         Fuck CSDN Code
// @namespace    http://fuck-csdn.com/
// @version      0.1.4
// @description  解除 CSDN 未登录禁止选中 (复制) 代码 (框) 限制
// @author       Fuck CSDN
// @match        https://blog.csdn.net/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoElEQVRYR+2UT2hcVRTGf99LTEGki/x5nRmrjTNDpqaUQoKO4kYQQcRFCzaLWIWKhYLYRRctdNNk1xYRSopYFFxokVriJhaLiN2kQgJuQiN2nBknEH3JpCmUYrWYeV950xRsKd1JN++uDufce853fvfcKx7x0iOuTyogJZASSAmkBO4hcHlwsOvGzTgXmKy9dr2ri5WhanXl//yu2wJ+ym/d3hGzFxgFb/pvwXLjioqZzKDxfsslwQ7gcSACmrInLJ1dP7NkWMBcaK3FpxeuXo2K3d0bvaHzPGIjpgfoNsxJPlP7c2VCM/mtbyj2aUMO+F5mzvIlSU9gb36+UTlWyIaXgW2Gc5hf2slgs3Af1reID23GEUXBc8AAMC8HI2tws0Px78A/hsnAumW5fDefZraUvkbsBn9VblRGH4Q7nw1XdUf5uQCmgo7Wj5XF1T+SvYVs30nQAcOeetQ8k/jymXBM4ijWKan1uQl+Fvq1Gi0/m8SLmd6XreBiYmumv+TEiPH4i43K2AMFZPpel7QT2AX0AteNPq5Hy0cK2fCbxN+K9UJjeXnmvgIXbE9IOg/8UIuar94X/1uzz5SmbV7CfFFeuPLOwwaumMn0Qbzb4l1gWPaIpcOJfaujq2dxcfHaHSphgrwf+YAddAp/JJisRs031+NJI4nwec1uKb1l8WUbB9SM5rCrEqWWg/E9/65+QEw3YskmksgDb7eF2nuRjgNhewbwkNAwIpdcVz1qjuRz4SmZ98Gf1aKVfW0C2U3vGX9qe6r9CmafHnjFgZIXUAblDdcEC491tnaO/HXjoB33Iw0BTyF+w8zbVOpLzbFCNpwGnmx3DA1ww+hsPWp+st7td8BrmBO1pWZCi0IuPIQ5Dj6Z/oQpgZRASiAlkBK4DZtvGMy5535NAAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/431391/Fuck%20CSDN%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/431391/Fuck%20CSDN%20Code.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 隐藏 CSDN 弹出的登录框
    GM_addStyle(".login-mark,#passportbox{display:none!important;}");
 
    // 取消对 pre 标签的禁止选中
    document.querySelectorAll("#content_views pre").forEach(function(item, key) {
      item.style.userSelect = "unset";
    });
 
    // 取消对 code 表情的禁止选中
    // CSDN 可真有你的，连给两个标签都加上禁止选中 :)
    document.querySelectorAll("#content_views pre code").forEach(function(item, key) {
      item.style.userSelect = "unset";
    });
 
    // 隐藏代码框内的「登录后复制」按钮
    document.querySelectorAll(".hljs-button").forEach(function(item, key) {
      item.style.display = "none"
    });
})();
