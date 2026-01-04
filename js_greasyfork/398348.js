// ==UserScript==
// @name         Notion.so RTL support for written text
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add support for writing RTL text blocks (including todo list, bullet list, headings, etc.) Text will change direction automatically depending on the language of the first letter in a text block. (Thus, English text will remain with the same behavior) Could be helpful if you want to write a text or todo list in your RTL language. Multiple languages with different directions can be written on the same page. This script is not supposed to change the direction of databases views nor its inner cells
// @author       OrenK
// @include      https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398348/Notionso%20RTL%20support%20for%20written%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/398348/Notionso%20RTL%20support%20for%20written%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var GM_addStyle =
        function(css) {
            var style = document.getElementById("GM_addStyleBy8626") || (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "GM_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            var sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };

    GM_addStyle(".notion-selectable * { text-align: start !important; }");
    GM_addStyle(".notion-selectable.notion-to_do-block > div > div:nth-of-type(2) { margin-right: 4px !important; }");

    var blackListClasses = ['notion-collection-item', 'notion-collection_view-block'];
    var containsClasses = function(element, classesNames){
        for (var index = 0; index < classesNames.length; index++) {
            if(element.classList.contains(classesNames[index])){
                return true;
            }
        }
        return false;
    };
    var notionPageCallback = function(mutations, observer) {
        for (var i = 0; i < mutations.length; i++) {
            for (var j = 0; j < mutations[i].addedNodes.length; j++) {

                var addedNode = mutations[i].addedNodes[j];
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if (addedNode.tagName === 'DIV' && addedNode.classList.contains('notion-selectable') && !containsClasses(addedNode, blackListClasses)) {
                        addedNode.setAttribute('dir', 'auto');
                    }
                    var divChildren = addedNode.getElementsByClassName('notion-selectable');
                    for (var y = 0; y < divChildren.length; y++) {
                        if(!containsClasses(divChildren[y], blackListClasses)){
                            divChildren[y].setAttribute('dir', 'auto');
                        }
                    }
                }
            }
        }
    };
    var notionPagesWeakMap = new WeakMap();
    var documentCallback = function(mutations, observer) {
        var notionPages = document.getElementsByClassName('notion-page-content');
        for (var notionPageIndex = 0; notionPageIndex < notionPages.length; notionPageIndex++) {
            if (!notionPagesWeakMap.has(notionPages[notionPageIndex])) {
                var divElements = notionPages[notionPageIndex].getElementsByClassName('notion-selectable');
                for (var notionSelectableIndex = 0; notionSelectableIndex < divElements.length; notionSelectableIndex++) {
                    if(!containsClasses(divElements[notionSelectableIndex], blackListClasses)){
                        divElements[notionSelectableIndex].setAttribute('dir', 'auto');
                    }
                }
                var pageObserver = new MutationObserver(notionPageCallback);
                pageObserver.observe(notionPages[notionPageIndex], { subtree: true, childList: true });
                notionPagesWeakMap.set(notionPages[notionPageIndex], pageObserver);
            }
        }
    };
    var documentObserver = new MutationObserver(documentCallback);

    documentObserver.observe(document, {
        subtree: true,
        childList: true
    });
})();