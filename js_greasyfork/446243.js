// ==UserScript==
// @name         MacType
// @namespace    MacType@JMRY
// @version      0.1.2
// @license      MIT
// @description  Render font like macOS
// @author       JMRY
// @match        *://**/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446243/MacType.user.js
// @updateURL https://update.greasyfork.org/scripts/446243/MacType.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //字体渲染强度，默认：0.25
    var macTypeWeight=0.25;
    var macTypeCss=[
        //字体渲染样式，可根据需求自行添加CSS
        'html, body, input, textarea, select, button, div, p, span, iframe, h1, h2, h3, h4, h5, h6, pre{-webkit-text-stroke:'+macTypeWeight+'px !important; text-stroke:'+macTypeWeight+'px}',
    ];
    var macTypeWhiteList=[
        //在这里添加不希望被渲染的网站域名
    ];


    var util = {
        addStyle:function(id, tag, css) {
            tag = tag || 'style';
            var doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            var styleElement = doc.createElement(tag);
            styleElement.rel = 'stylesheet';
            styleElement.id = id;
            tag === 'style' ? styleElement.innerHTML = css : styleElement.href = css;
            document.head.appendChild(styleElement);
        },

        removeElementById:function(eleId) {
            var ele = document.getElementById(eleId);
            ele && ele.parentNode.removeChild(ele);
        }
    };

    var main = {
        generateStyle:function() {
            return macTypeCss.join(' ');
        },

        changeStyle:function() {
            document.getElementById('mactype-style').innerHTML = this.generateStyle();
        },

        addPluginStyle:function() {
            var insertMacTypeStyle = this.generateStyle();

            if (document.head) {
                util.addStyle('mactype-style', 'style', insertMacTypeStyle);
            }
            var headObserver = new MutationObserver(function(){
                util.addStyle('mactype-style', 'style', insertMacTypeStyle);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        isTopWindow:function() {
            return window.self === window.top;
        },

        init:function() {
            this.isTopWindow();
            if (macTypeWhiteList.includes(location.host)) return;
            this.addPluginStyle();
        }
    };
    main.init();
})();