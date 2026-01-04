// ==UserScript==
// @name         对绘图网页使用快捷键
// @namespace    https://www.zhihu.com/people/x-tesla
// @version      1.0
// @description  像CAD/PS一样使用快捷键快速触发网页中需要频繁点击的Button按钮
// @author       XTesla
// @match        https://www.geogebra.org/geometry
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434970/%E5%AF%B9%E7%BB%98%E5%9B%BE%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/434970/%E5%AF%B9%E7%BB%98%E5%9B%BE%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // JS监听键盘快捷键并自动点击按钮
    document.addEventListener('keydown', function (event)
    {
        if (event.keyCode == 86) {//Move——V
            document.getElementById('mode0').click();
        };

        if (event.keyCode == 80) {//Point——P
            document.getElementById('mode1').click();
        };

        if (event.keyCode == 83) {//Segment——S
            document.getElementById('mode15').click();
        };

        if (event.keyCode == 76) {//Line——L
            document.getElementById('mode2').click();
        };

        if (event.keyCode == 85) {//Polygon——U
            document.getElementById('mode16').click();
        };


        if (event.keyCode == 67) {//Circle——C
            document.getElementById('mode10').click();
        };

        if (event.keyCode == 81) {//Select Objects——Q
            document.getElementById('mode77').click();
        };

        if (event.keyCode == 72) {//Show/Hide——H
            document.getElementById('mode28').click();
        };

        if (event.keyCode == 65) {//Angle——A
            document.getElementById('mode36').click();
        };

        if (event.keyCode == 68) {//Distance of Length——D
            document.getElementById('mode38').click();
        };

        if (event.keyCode == 82) {//Ray——R
            document.getElementById('mode18').click();
        };

        if (event.keyCode == 89) {//Vector——Y
            document.getElementById('mode7').click();
        };

        if (event.keyCode == 74) {//Semicircle——J
            document.getElementById('mode24').click();
        };

        if (event.keyCode == 75) {//Circular Sector——K
            document.getElementById('mode21').click();
        };

        if (event.keyCode == 73) {//Image——I
            document.getElementById('mode26').click();
        };

        if (event.keyCode == 84) {//Text——T
            document.getElementById('mode17').click();
        };
    });

})();