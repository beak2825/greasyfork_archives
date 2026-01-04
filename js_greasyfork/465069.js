// ==UserScript==
// @name         半自动屏蔽网页内容，例如悬浮窗
// @namespace    http://tampermonkey.net/
// @version      1.26
// @description  根据F12查找到的element(div)的name或者id，对其进行自动屏蔽的通用脚本，***请注意第15~17行***，自行修改需要屏蔽的网站和内容（现在的blockeName和blockedPageUrls是用来屏蔽嘶哩嘶哩的悬浮窗广告的）
// @author       shepherdZheng
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465069/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%EF%BC%8C%E4%BE%8B%E5%A6%82%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/465069/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%EF%BC%8C%E4%BE%8B%E5%A6%82%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //在下面两行中输入需要屏蔽的name或者id，以及网页列表,数量/长度不限。
    var blockeName = ['coupletright','coupletleft','HMRichBox','HMrichA'];
    var blockedPageUrls = ['https://www.silisilifun.com/', 'https://www.silisili.tv'];

    //确认是否是需要河蟹的网页
    function isBlockedPageUrl() {
        for (var a = 0; a < blockedPageUrls.length; a++) {
            if (window.location.href.indexOf(blockedPageUrls[a]) !== -1) {
                return true;
            }
        }
        return false;
    }
    //查找网页内容，进行河蟹
    function getElementandRemove(i,blockeName) {
        if (i < 10) { //网速比较慢的情况下，请调高i<的值，例如，网页需要10秒加载完的话，这里应该大于10*2，大于20。
            setTimeout(function() {
                var delete_count=0;
                console.log(i); //调试用
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAA');//调试用,和k与j的输出相区分
                var elements = document.getElementsByTagName('*');
                //var divzElements = document.querySelectorAll('[style*="bottom:0px"][style*="right:0px"]');//这个方法对于一般的div是有效的，但没办法选中那个奇妙的divz。。。？采用下面那行的特征可以选中
                var divzElements = document.querySelectorAll('[style*="display: block;"]');//silisili改变了右下角悬浮窗的写法，现在它会随机生成自身的id，有趣有趣。
                for(var b=0; b<divzElements.length; b++) {
                    //console.log(divzElements[b]);//调试用
                    divzElements[b].style.display = 'none';
                }
                for (var j = 0; j < blockeName.length; j++) {//js的for循环是在循环完毕到下一轮判断开始之间进行计数的，所以循环体内j最大是 (blockName.length - 1)
                    //console.log(j); //调试用
                    //console.log('JJJJJJJJJ');//同上
                    var name = blockeName[j];
                    for(var k=0; k<elements.length; k++) {
                        //console.log(k); //调试用
                        if(elements[k].getAttribute('id') === name || elements[k].getAttribute('name') === name) {
                            elements[k].style.display = 'none';
                            //无法屏蔽掉网页内容时请依次取消下面三行的注释（手段逐渐过激，但其实大多数时候的问题是没能准确的捕获到element而不是杀不掉它）
                            //elements[k].style.display = "none !important";
                            //elements[k].style.visibility = "hidden !important";
                            //elements[k].parentNode.removeChild(element);
                            delete_count += 1;
                            if(delete_count > 0) {//第一次删除就算数，因为意味着网页加载好了，别的也会被删。。。？
                                i += 233;//在内层循环改外层循环的i值是有效的（真奇怪，为什么我会担心这个，真奇怪呢。。。屮）
                            }
                        }
                    }
                }
                getElementandRemove(i + 1,blockeName);//1.25又忘记补全输入参数了。。。淦。。。
            }, 500);//最不稳定的一种异步方式（递归），但相对而言。。。额。。爷乐意
        }
    }
    // 主函数，js要实现异步编程还挺麻烦的——只会python的初学者的感想。
    if (isBlockedPageUrl()) {
        getElementandRemove(0,blockeName);
    }
})();
