// ==UserScript==
// @name         我只要详情-圆通
// @namespace    https://space.bilibili.com/6727237
// @version      0.1
// @description  i just want details.
// @author       尺子上的彩虹
// @match        http://www.yto.net.cn/tracesimple.html/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408531/%E6%88%91%E5%8F%AA%E8%A6%81%E8%AF%A6%E6%83%85-%E5%9C%86%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/408531/%E6%88%91%E5%8F%AA%E8%A6%81%E8%AF%A6%E6%83%85-%E5%9C%86%E9%80%9A.meta.js
// ==/UserScript==

setTimeout(
            function (){
                document.getElementsByClassName('search-btn')[0].addEventListener(
                    'click',
                    function() {
                        setTimeout(
                            function (){
                                document.getElementsByClassName('title')[document.getElementsByClassName('title').length-1].removeChild(document.getElementsByClassName('title')[document.getElementsByClassName('title').length-1].childNodes[1])
                            },
                            1000);
                    }
                );
            },
            1000);