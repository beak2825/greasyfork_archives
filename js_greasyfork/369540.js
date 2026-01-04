// ==UserScript==
// @name         Clean zhuanlan.zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  制作知乎专栏方便打印的版本
// @author       You
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @require  https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @downloadURL https://update.greasyfork.org/scripts/369540/Clean%20zhuanlanzhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/369540/Clean%20zhuanlanzhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var staticClassNames = [
        'Sticky ColumnPageHeader',
        'Sticky RichContent-actions',
                 ];

    var AJAXClassNames = [
        'Sticky ColumnPageHeader',
        'CommentList',
        'Recommendations-List',
        'Recommendations-Main',
        'Comments-container',
    ];

    // jQuery remove/empty does not work.
    // from stackoverflow:
    // https://stackoverflow.com/questions/3387427/remove-element-by-id
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }

    // static
    staticClassNames.forEach(function(name) {
        var elems = document.getElementsByClassName(name);
        elems.remove();
        console.log(name);
    });

    // dynamic
    AJAXClassNames.forEach(function(name) {
        waitForKeyElements('.'+name, function(elem){ elem.empty();});
    });

})();