// ==UserScript==
// @name         medium-helper
// @namespace    https://github.com/taseikyo
// @version      0.1.1
// @icon         https://cdn-static-1.medium.com/_/fp/icons/favicon-rebrand-medium.3Y6xpZ-0FSdWDnPM3hSBIA.ico
// @description  a simple Medium helper to improve reading experience.
// @author       Lewis Tian (https://github.com/taseikyo)
// @match        https://*.medium.com/*
// @match        https://blog.sourcerer.io/*
// @match        https://articles.microservices.com/*
// @match        https://towardsdatascience.com/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/388676/medium-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/388676/medium-helper.meta.js
// ==/UserScript==

"use strict";
/**
 *
 * Copyright (c) 2019 Lewis Tian. Licensed under the MIT license.
 * @authors   Lewis Tian (taseikyo@gmail.com)
 * @date      2019-07-30 10:39:19
 * @link      https://github.com/taseikyo
 * @desc      a simple Medium helper to improve reading experience:
 *             1. expand the reading area (728 -> 960)
 *             2. add a table of contents (hide/show according to scroll bar height)
 *             3. customize your own settings
 *
 */
var CONFIG = {
    maxWidth: 960,
    likeBoxLeftFloat: 5,
    tocTop: 20,
    tocRight: 0,
    scrollTopShow: 300,
    scrollBottomHide: 1600,
    highlightedStart: 150,
    delay: 500
};
var main = function () {
    var root = document.querySelector('#root');
    if (root == null) {
        return;
    }
    var article = root.children[0].querySelector('article');
    if (article == null) {
        return;
    }
    // hand or bookmark
    var likeBox = article.nextSibling;
    // maybe there is a picture on the top of text, so we select the last node
    var section = article.querySelector('div').querySelector('section');
    var textBody = section.children[section.children.length - 1].children[0];
    likeBox.setAttribute('style', "left: -" + CONFIG.likeBoxLeftFloat + "% ");
    textBody.setAttribute('style', "max-width: " + CONFIG.maxWidth + "px !important");
    for (var _i = 0, _a = textBody.children; _i < _a.length; _i++) {
        var i = _a[_i];
        if (i.nodeName === 'h1' || i.nodeName === 'H1') {
            toc(textBody);
            break;
        }
    }
    setTimeout(delayHighlight, CONFIG.delay);
};
/**
 * add toc of the article
 *
 * @node: the arcile text div
 */
var toc = function (node) {
    var anchorRoot = document.createElement('div');
    anchorRoot.className = 'BlogAnchor';
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = '#';
    a.innerText = 'Table of contents';
    p.appendChild(a);
    anchorRoot.appendChild(p);
    var anchorBody = document.createElement('div');
    anchorBody.className = 'AnchorContent';
    anchorBody.id = 'AnchorContent';
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var i = _a[_i];
        if (i.nodeName === 'h1' || i.nodeName === 'H1') {
            var li = document.createElement('li');
            var a_1 = document.createElement('a');
            a_1.href = "#" + i.id;
            a_1.innerText = i.innerText;
            li.appendChild(a_1);
            li.setAttribute('style', 'list-style-type: none; padding-right: 10px;');
            anchorBody.appendChild(li);
        }
    }
    var line = document.createElement('hr');
    anchorRoot.appendChild(line);
    anchorRoot.appendChild(anchorBody);
    // set style
    p.setAttribute('style', 'font-weight: bold; font-size: 1.2em;');
    anchorRoot.setAttribute('style', "position: fixed; right: " + CONFIG.tocRight + "%; top: " + CONFIG.tocTop + "%; background: #f4f7f9; padding: 10px; line-height: 180%;");
    document.getElementsByTagName('body')[0].appendChild(anchorRoot);
    anchorRoot.style.visibility = 'hidden';
    window.addEventListener('scroll', function (evt) {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (scrollTop >= document.body.clientHeight - CONFIG.scrollBottomHide) {
            anchorRoot.style.visibility = 'hidden';
        }
        else if (scrollTop >= CONFIG.scrollTopShow) {
            anchorRoot.style.visibility = 'visible';
        }
        else {
            anchorRoot.style.visibility = 'hidden';
        }
    });
};
/**
 * set highlight text style
 * add margin according CONFIG
 */
var delayHighlight = function () {
    var root = document.querySelector('#root');
    var article = root.children[0].querySelector('article');
    if (article == null) {
        return;
    }
    var highlightedBox = article.querySelector('aside');
    if (highlightedBox) {
        for (var _i = 0, _a = highlightedBox.children; _i < _a.length; _i++) {
            var x = _a[_i];
            x.querySelector('h4').setAttribute('style', "margin-inline-start: " + CONFIG.highlightedStart + "px; !important;");
        }
    }
};
// https://greasyfork.org/zh-CN/scripts/12877-字体样式美化/
var pretty = function () {
    var css = document.createElement('style');
    var text = document.createTextNode('a:hover{color: #39F !important; text-shadow:-5px 3px 18px #39F !important; -webkit-transition: all 0.3s ease-out;}; a{-webkit-transition: all 0.3s ease-out;};*{text-decoration:none!important;font-weight:500!important;}*:not(i):not([class*="hermit"]):not([class*="btn"]):not([class*="button"]):not([class*="ico"]):not(i){font-family: "Microsoft Yahei", "Microsoft Yahei" !important; }*{text-shadow:0.005em 0.005em 0.025em #999999 !important;}');
    css.appendChild(text);
    document.getElementsByTagName('head')[0].appendChild(css);
};
pretty();
main();
