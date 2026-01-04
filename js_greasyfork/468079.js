// ==UserScript==
// @name         (新商盟)手动改订购量模式
// @namespace    none
// @version      0.1
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468079/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E6%89%8B%E5%8A%A8%E6%94%B9%E8%AE%A2%E8%B4%AD%E9%87%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468079/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E6%89%8B%E5%8A%A8%E6%94%B9%E8%AE%A2%E8%B4%AD%E9%87%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

//所有新商盟目录订单隐藏单位列,购物车隐藏单位列和收藏列
var ids = ["umsale-btn"];
var classes = ["addFav", "umsale-span", "cgt-col-um-sale-name", "umsale-span"];

ids.forEach(function(id) {
    var element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
});

classes.forEach(function(className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
});

//调整商品名称这列的宽度(增加75像素)完美运行(速度快快快)
var elementsToAdjustWidth = document.querySelectorAll('.cgt-name-250, .cgt-col-img-name, .cgt-name, .cgt-name-narrow, .cgt-col-img-name.cgt-name-narrow.cgt-big-img-show');
var widths = [];
for (var i = 0; i < elementsToAdjustWidth.length; i++) {
    widths.push(parseInt(window.getComputedStyle(elementsToAdjustWidth[i]).width));
}
for (var j = 0; j < elementsToAdjustWidth.length; j++) {
    if (widths[j] < 240) {
        elementsToAdjustWidth[j].style.width = (widths[j] + 75) + 'px';
    }
}

//所有新商盟目录订单和购物车的"香烟列表区",设置为"微软雅黑26号加粗字体"
var elementsToSetStyle = document.querySelectorAll('.xsm-utable');
for (var k = 0; k < elementsToSetStyle.length; k++) {
    var childrenToSetStyle = elementsToSetStyle[k].querySelectorAll('*');
    for (var l = 0; l < childrenToSetStyle.length; l++) {
        childrenToSetStyle[l].style.fontFamily = '微软雅黑';
        childrenToSetStyle[l].style.fontSize = '26px';
        childrenToSetStyle[l].style.fontWeight = 'bold';
    }
}


//将删除按钮css增高25像素
var elementsToAdjustHeight = document.querySelectorAll('.operation');
for (var m = 0; m < elementsToAdjustHeight.length; m++) {
    var currentHeight = parseInt(window.getComputedStyle(elementsToAdjustHeight[m]).height);
    if (!isNaN(currentHeight)) {
        elementsToAdjustHeight[m].style.height = (currentHeight + 25) + 'px';
    }
}