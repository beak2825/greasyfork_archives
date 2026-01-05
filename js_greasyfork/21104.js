// ==UserScript==
// @name 我的JS函数库
// @description  一些常用的JS函数库
// @namespace http://www.jycggyh.cn/
// @author 艮古永恒
// @version 1.0.0
// @include *
// @match *://*
// @grant none
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/21104/%E6%88%91%E7%9A%84JS%E5%87%BD%E6%95%B0%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/21104/%E6%88%91%E7%9A%84JS%E5%87%BD%E6%95%B0%E5%BA%93.meta.js
// ==/UserScript==

function _eleArr2Ele(arrElement) {
    if(arrElement.length == 0)
        return false;
    else if(arrElement.length == 1)
        return arrElement[0];
    return arrElement;
}

function arrContains(arr, obj) {
    // 判断参数
    if(arguments.length != 2)
        return false;
    var i = 0;
    for(i = 0; i < arr.length; i++)
        if(arr[i] == obj)
            return true;
    return false;
}

function queryByTName(tagName, eleParent) {
    // 判断参数是否为空
    if(arguments.length == 0)
        return false;
    // 获取结点
    var arrElement;
    if(arguments.length >= 2)
        arrElement = eleParent.getElementsByTagName(tagName);
    else
        arrElement = document.getElementsByTagName(tagName);
    // 判断结点数量
    return _eleArr2Ele(arrElement);
}

function queryByCName(className, eleParent) {
    // 判断参数是否为空
    if(arguments.length == 0)
        return false;
    // 获取结点
    var arrElement;
    if(arguments.length >= 2)
        arrElement = eleParent.getElementsByClassName(className);
    else {
        arrElement = document.getElementsByClassName(className);
    }
    // 判断结点数量
    return _eleArr2Ele(arrElement);
}

function queryArrByTName(tagName, arrElement) {
    // 判断参数
    if(arguments.length != 2)
        return false;
    // 循环检索
    var arrEle = new Array();
    var i;
    var s = 0;
    for(i = 0; i < arrElement.length; i ++) {
        if(arrElement[i].tagName == tagName.toUpperCase()) {
            arrEle[s] = arrElement[i];
            s++;
        }
    }
    return _eleArr2Ele(arrEle);
}

function queryArrByCName(className, arrElement) {
    // 判断参数
    if(arguments.length != 2)
        return false;
    // 循环检索
    var arrEle = new Array();
    var s = 0;
    var i = 0;
    for(i = 0; i < arrElement.length; i ++) {
        var sClassName = arrElement[i].className;
        var arrClassName = sClassName.split(' ');
        if(arrContains(arrClassName, className)) {
            arrEle[s] = arrElement[i];
            s++;
        }    
    }
    return _eleArr2Ele(arrEle);
}