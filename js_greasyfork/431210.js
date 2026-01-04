// ==UserScript==
// @name         CSDN自由复制
// @version      1.0
// @description  解除无法选择复制代码块
// @author       LikeJson
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoElEQVRYR+2UT2hcVRTGf99LTEGki/x5nRmrjTNDpqaUQoKO4kYQQcRFCzaLWIWKhYLYRRctdNNk1xYRSopYFFxokVriJhaLiN2kQgJuQiN2nBknEH3JpCmUYrWYeV950xRsKd1JN++uDufce853fvfcKx7x0iOuTyogJZASSAmkBO4hcHlwsOvGzTgXmKy9dr2ri5WhanXl//yu2wJ+ym/d3hGzFxgFb/pvwXLjioqZzKDxfsslwQ7gcSACmrInLJ1dP7NkWMBcaK3FpxeuXo2K3d0bvaHzPGIjpgfoNsxJPlP7c2VCM/mtbyj2aUMO+F5mzvIlSU9gb36+UTlWyIaXgW2Gc5hf2slgs3Af1reID23GEUXBc8AAMC8HI2tws0Px78A/hsnAumW5fDefZraUvkbsBn9VblRGH4Q7nw1XdUf5uQCmgo7Wj5XF1T+SvYVs30nQAcOeetQ8k/jymXBM4ijWKan1uQl+Fvq1Gi0/m8SLmd6XreBiYmumv+TEiPH4i43K2AMFZPpel7QT2AX0AteNPq5Hy0cK2fCbxN+K9UJjeXnmvgIXbE9IOg/8UIuar94X/1uzz5SmbV7CfFFeuPLOwwaumMn0Qbzb4l1gWPaIpcOJfaujq2dxcfHaHSphgrwf+YAddAp/JJisRs031+NJI4nwec1uKb1l8WUbB9SM5rCrEqWWg/E9/65+QEw3YskmksgDb7eF2nuRjgNhewbwkNAwIpdcVz1qjuRz4SmZ98Gf1aKVfW0C2U3vGX9qe6r9CmafHnjFgZIXUAblDdcEC491tnaO/HXjoB33Iw0BTyF+w8zbVOpLzbFCNpwGnmx3DA1ww+hsPWp+st7td8BrmBO1pWZCi0IuPIQ5Dj6Z/oQpgZRASiAlkBK4DZtvGMy5535NAAAAAElFTkSuQmCC
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        GM_addStyle
// @license      GPL License
// @namespace https://greasyfork.org/users/807555
// @downloadURL https://update.greasyfork.org/scripts/431210/CSDN%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/431210/CSDN%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("code").each((idx)=>$("code")[idx].style.userSelect='text')
})();