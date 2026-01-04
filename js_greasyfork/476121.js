// ==UserScript==
// @name          52破解排序自动选择发帖时间
// @description   打开52破解任意专区，自动选择排序为发帖时间
// @version       1.0.1
// @namespace     52破解排序自动选择发帖时间
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//*52pojie.cn/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @require       https://cdn.bootcdn.net/ajax/libs/js-cookie/3.0.5/js.cookie.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476121/52%E7%A0%B4%E8%A7%A3%E6%8E%92%E5%BA%8F%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/476121/52%E7%A0%B4%E8%A7%A3%E6%8E%92%E5%BA%8F%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

//判断某个类是否存在
function hasClass(element, value) {
    var cls = value || '';
    //\s 匹配任何空白字符，包括空格、制表符、换页符等等
    if (cls.replace(/\s/g, '').length == 0) {
        return false;   //当没有参数返回时，返回false
    }
    return new RegExp(' ' + cls + ' ').test(' ' + element.className + ' ');
}

function removeClass(element, value) {
    if (hasClass(element, value)) {
        //\t 匹配一个制表符；\r 匹配一个回车符；\n 匹配一个换行符
        var newClass = ' ' + element.className.replace(/\t\r\n/g, '') + ' ';
        while (newClass.indexOf(' '+ value + ' ') > -1) {
            newClass = newClass.replace(' ' + value + ' ', ' ');
        }
        element.className = newClass.replace(/^\s+|\s+$/g,'');
    }
}

//该方法可独立存在
function addClass(element, value) {
    //类名为空时，直接添加该类
    if (!element.className || element.className == "") {
        element.className = value;
        return;
    }
    //类名不为空时，先判断该类名是否已经存在，若不存在，则添加该类名
    var cls = ' ' + value + ' ';
    if (cls.indexOf(' ' + element.className + ' ') <= -1) {
        var newClass = element.className;
        newClass += ' ';
        newClass += value;
        element.className = newClass;
    }
}

//该方法在hasClass()函数已存在的基础上，添加类
function addClass2(element, value) {
    if (!hasClass(element, value)) {
        element.className = element.className == '' ? value : element.className + ' ' + value;
    }
}

function init() {
    const linkElement = document.querySelector('.pop_moremenu li:first-child a');
    if(linkElement && !hasClass(linkElement, 'xw1')) {
        linkElement.click();
    }
}