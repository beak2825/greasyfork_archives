/*

Following code belongs to Avatars Plus! and More for Google+.
Copyright (C) 2016 Jackson Tan
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

*/

// ==UserScript==
// @id             GPlusColumnAdj
// @name           Google+ Column Adjustments
// @version        0.1.13
// @namespace      gplus.columnadj
// @author         Jackson Tan
// @description    Google+ Column Adjustment Tool
// @include        https://plus.google.com/*
// @exclude        /https://plus\.google\.com(/u/\d+)?/?stream/circles/.+/i
// @exclude	       /https://plus\.google\.com(/u/\d+)?/?b/.+/i
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14001/Google%2B%20Column%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/14001/Google%2B%20Column%20Adjustments.meta.js
// ==/UserScript==

GM_addStyle = function (css) {
    var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
    if (!head) { return }
    style.type = 'text/css';
    try { style.innerHTML = css } catch (x) { style.innerText = css }
    head.appendChild(style);
}

function keyPress(el, keyCode) {
    var eventObj = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if (eventObj.initEvent) {
        eventObj.initEvent("keydown", true, true);
    }

    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;

    el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);
}

function minIndexThreeNum(a, b, c) {
    var result = Math.min(Math.min(a, b), c);
    if (result == a)
        return 0;
    else if (result == b)
        return 1;
    return 2;
}

function appendHtmlToNode(html, node) {
    node.innerHTML += html;
}

function buildElem(tagName, className, attr1, val1, attr2, val2) {
    var elem = document.createElement(tagName);
    elem.className = className;
    elem.setAttribute(attr1, val1);
    elem.setAttribute(attr2, val2);
    return elem;
}

function buildArr(length, colA, colB, modulo) {
    var newColumn = new Array();
    var a = 0, b = 0, flag = false, count = 0;
    for (var i = 0; i < length; i++) {
        flag = !flag;
        if (i != 0 && (i + 1) % modulo == 0) {
            if (flag)
                newColumn[newColumn.length] = colA[a + 1];
            else
                newColumn[newColumn.length] = colB[b];
        }
        if (flag) {
            a++;
        }
        else {
            b++;
        }
    }
    return newColumn;
}

function buildColumn(colArr, className, jsName, insertTarget) {
    var colDiv = buildElem("div", className, "jsName", jsName, "role", "list");
    for (var i = 0; i < colArr.length; i++) {
        appendHtmlToNode(colArr[i].outerHTML, colDiv);
        colArr[i].outerHTML = "";
    }
    insertTarget.appendChild(colDiv);
}

function hideSidebar(toggleBtnClass, sidebarPanelClass, contentPanelClass) {
    document.getElementsByClassName(toggleBtnClass)[0].setAttribute("aria-expanded", "false");
    document.getElementsByClassName(sidebarPanelClass)[0].parentNode.removeChild(document.getElementsByClassName(sidebarPanelClass)[0]);
    //document.getElementsByClassName(contentPanelClass)[0].className = contentPanelClass;
}

function hideSidebarKeyPress(elem, key) {
    keyPress(elem, key);
}

function fixSandwichAlign(sandClass, newAlign) {
    document.getElementsByClassName(sandClass)[0].childNodes[0].style.top = newAlign + "px";
}

//var listenerPostInsertion = function (e) {
//    if (e.target.nodeType != 3 && e.target.tagName == postTagName) {
//        e.target.parentNode.removeEventListener('DOMNodeInserted', listenerPostInsertion, false);
//        console.log(minIndexThreeNum(col0.length - 1, col1.length, colParent.childNodes[2].childNodes.length));
//        console.log(e.target.outerHTML);
//        insertTargetNode.childNodes[minIndexThreeNum(col0.length - 1, col1.length, colParent.childNodes[2].childNodes.length)].innerHTML += e.target.outerHTML;
//        e.target.outerHTML = none;
//        setTimeout(function () { e.target.parentNode.addEventListener('DOMNodeInserted', listenerPostInsertion, false); }, 500);
//    }
//};

function replaceImg(target) {
    if (target && target.src) {
        target.src = target.src.replace(/(-no)+\/.+/g, "");
        target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode.nextSibling);
        return target.src;
    }
}

function batchReplace(targets) {
    if (targets && targets.length)
        for (var i = 0; i < targets.length ; i++) {
            if (targets[i].src.match("(-no)+\/.+"))
                replaceImg(targets[i]);
        }
}

function onLoad() {
    //var listenerPostInsertion = function (e) {
    //    if (e.target.nodeType != 3 && e.target.tagName == postTagName) {
    //        var elem = document.createElement("DIV");
    //        elem.innerHTML = e.target.outerHTML;
    //        e.target.outerHTML = "";
    //        console.log(elem.innerHTML);
    //        insertTargetNode.childNodes[minIndexThreeNum(col0.length - 1, col1.length, colParent.childNodes[2].childNodes.length)].appendChild(elem.childNodes[0]);
    //    }
    //};

    var gifImageInsertionListener = function (e) {
        if (e.target.nodeType != 3 && e.target.tagName == postTagName) {
            batchReplace(e.target.getElementsByClassName('JZUAbb')); // Gif images in posts
        }
    }

    var streamColClass = "H68wj jxKp7";
    var streamColJsName = "dJDgTb";

    var sidebarToogleBtnClass = "mUbCce p9Nwte";
    var sidebarPanelClass = "OFyC1e";
    var contentPanelClass = "gLYlfd Jvazdb nWGHWc G6GRIc";

    var colParent = document.getElementsByClassName(streamColClass)[0].parentNode;
    var col0 = document.getElementsByClassName(streamColClass)[0].childNodes;
    var col1 = document.getElementsByClassName(streamColClass)[1].childNodes;

    var len_col0 = col0.length - 1;
    var len_col1 = col1.length;
    var total_col = 3;
    var newColArr = buildArr(len_col0 + len_col1, col0, col1, total_col);
    //buildColumn(newColArr, streamColClass, streamColJsName, colParent);

    var postTagName = "C-FPDNBB";
    var insertTargetNode = colParent;

    var sandwichNavClass = "xjKiLb";

    //hideSidebar(sidebarToogleBtnClass, sidebarPanelClass, contentPanelClass);
    hideSidebarKeyPress(document.body, 37);
    fixSandwichAlign(sandwichNavClass, -18);

    //document.getElementsByClassName(streamColClass)[0].addEventListener('DOMNodeInserted', listenerPostInsertion, false);
    //document.getElementsByClassName(streamColClass)[1].addEventListener('DOMNodeInserted', listenerPostInsertion, false);

    batchReplace(document.body.getElementsByClassName('JZUAbb')); // Gif images in posts

    document.getElementsByClassName(streamColClass)[0].addEventListener('DOMNodeInserted', gifImageInsertionListener, false);
    document.getElementsByClassName(streamColClass)[1].addEventListener('DOMNodeInserted', gifImageInsertionListener, false);
    document.getElementsByClassName(streamColClass)[2].addEventListener('DOMNodeInserted', gifImageInsertionListener, false);
}

document.addEventListener("DOMContentLoaded", onLoad, false);