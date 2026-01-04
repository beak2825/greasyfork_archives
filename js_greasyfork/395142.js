// ==UserScript==
// @name         CNKI在线阅读优化
// @namespace    com.arcsinw
// @version      0.0.2
// @description  去除知网在线阅读页面无关元素，增加可阅读面积
// @author       arcsinw
// @match        *://*.cnki.net/Kreader/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/395142/CNKI%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/395142/CNKI%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

if (window.top != window.self) {
    return;
}
(function() {
    'use strict';

    function $(selector) {
        return document.querySelector(selector);
    }

    // set title
    var title_element = $('#head_name_cdmd a.titleClass')
    if (title_element != undefined) {
        document.title = title_element.getAttribute('title')
    }

    // hide useless element
    $('#HeaderDiv').style.display = 'none'
    $('#FooterDiv').style.display = 'none'
    $('#mainContent > div.head_cdmd').style.display = 'none'

    $('#mainContent').style.setProperty('margin-bottom', '0px', 'important')
    $('#mainContent').style.width = '100%'

    $('#mainContent').style.display = 'flex'
    $('#mainContent').style.removeProperty('position')

    $('#rightside').style.removeProperty('width')
    $('#rightside').style.removeProperty('float')
    $('#rightside').style.flexGrow = '2'

    $('#leftside').style.removeProperty('float')
    $('#leftside').style.width = 'auto'

    var hide_style = document.createElement('style')
    hide_style.type = 'text/css'
    hide_style.innerHTML = ".botlikelist {display: none;}"
    document.head.appendChild(hide_style)
})();