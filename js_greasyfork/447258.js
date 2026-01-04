// ==UserScript==
// @name         CSDN免登录复制 & 去除广告
// @namespace    http://bbs.91wc.net/
// @version      0.1.4
// @description  CSDN免登录复制，专门解决你的复制之痛（保持文本原有格式）
// @author       Wilson & quan & huang
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoElEQVRYR+2UT2hcVRTGf99LTEGki/x5nRmrjTNDpqaUQoKO4kYQQcRFCzaLWIWKhYLYRRctdNNk1xYRSopYFFxokVriJhaLiN2kQgJuQiN2nBknEH3JpCmUYrWYeV950xRsKd1JN++uDufce853fvfcKx7x0iOuTyogJZASSAmkBO4hcHlwsOvGzTgXmKy9dr2ri5WhanXl//yu2wJ+ym/d3hGzFxgFb/pvwXLjioqZzKDxfsslwQ7gcSACmrInLJ1dP7NkWMBcaK3FpxeuXo2K3d0bvaHzPGIjpgfoNsxJPlP7c2VCM/mtbyj2aUMO+F5mzvIlSU9gb36+UTlWyIaXgW2Gc5hf2slgs3Af1reID23GEUXBc8AAMC8HI2tws0Px78A/hsnAumW5fDefZraUvkbsBn9VblRGH4Q7nw1XdUf5uQCmgo7Wj5XF1T+SvYVs30nQAcOeetQ8k/jymXBM4ijWKan1uQl+Fvq1Gi0/m8SLmd6XreBiYmumv+TEiPH4i43K2AMFZPpel7QT2AX0AteNPq5Hy0cK2fCbxN+K9UJjeXnmvgIXbE9IOg/8UIuar94X/1uzz5SmbV7CfFFeuPLOwwaumMn0Qbzb4l1gWPaIpcOJfaujq2dxcfHaHSphgrwf+YAddAp/JJisRs031+NJI4nwec1uKb1l8WUbB9SM5rCrEqWWg/E9/65+QEw3YskmksgDb7eF2nuRjgNhewbwkNAwIpdcVz1qjuRz4SmZ98Gf1aKVfW0C2U3vGX9qe6r9CmafHnjFgZIXUAblDdcEC491tnaO/HXjoB33Iw0BTyF+w8zbVOpLzbFCNpwGnmx3DA1ww+hsPWp+st7td8BrmBO1pWZCi0IuPIQ5Dj6Z/oQpgZRASiAlkBK4DZtvGMy5535NAAAAAElFTkSuQmCC
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/447258/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/447258/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //去除登录框
    GM_addStyle(".login-mark,.passport-login-container{display:none!important;}");

    //免登录复制
    $(".hljs-button").attr("data-title", "免登录复制");
    $(".hljs-button").click(function(){
        GM_setClipboard(this.parentNode.innerText);
        $(".hljs-button").attr("data-title", "复制成功");
        setTimeout(function(){
            $(".hljs-button").attr("data-title", "免登录复制");
        }, 1000);
    });
    
    // 去除广告
    document.getElementsByClassName('blog_container_aside')[0].innerHTML = ''
    document.getElementsByClassName('csdn-side-toolbar')[0].innerHTML = ''
    document.getElementsByClassName('recommend-right_aside')[0].innerHTML = ''

})();