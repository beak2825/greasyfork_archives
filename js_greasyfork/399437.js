// ==UserScript==
// @name                铭记英雄，缅怀同胞
// @version             0.0.1
// @description         深切悼念在抗击新冠肺炎斗争中的牺牲烈士和逝世同胞
// @namespace           https://www.github.com/gorkys
// @include      *
// @author              Gorkys
// @match               http://*/*
// @run-at              document-end
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/399437/%E9%93%AD%E8%AE%B0%E8%8B%B1%E9%9B%84%EF%BC%8C%E7%BC%85%E6%80%80%E5%90%8C%E8%83%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/399437/%E9%93%AD%E8%AE%B0%E8%8B%B1%E9%9B%84%EF%BC%8C%E7%BC%85%E6%80%80%E5%90%8C%E8%83%9E.meta.js
// ==/UserScript==

~function () {
    document.body.setAttribute('style', `-webkit-filter: grayscale(100%);
                                        -moz-filter: grayscale(100%);
                                        -ms-filter: grayscale(100%);
                                        -o-filter: grayscale(100%);
                                        filter: grayscale(100%);
                                        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);`)
}(window)