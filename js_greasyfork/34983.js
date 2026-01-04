// ==UserScript==
// @name         CollapseComment
// @namespace    https://github.com/mdczaplicki
// @version      0.3
// @description  Wykop comment collapser
// @author       You
// @match        https://www.wykop.pl/link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34983/CollapseComment.user.js
// @updateURL https://update.greasyfork.org/scripts/34983/CollapseComment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.hidden { display: none; } .visible { display: list-item; }';
    document.getElementsByTagName('head')[0].appendChild(style);

    var allThreads = $('ul .sub');

    for (var j = 0; j < allThreads.length; ++j) {
        var thread = allThreads[j];
        if (thread.childElementCount >= 3) {
            var array = Array.prototype.slice.call(thread.children).slice(2);
            for (var i = 0; i < array.length; ++i) {
                array[i].style.display = 'none';
            }
            var sElem = '<p class="more"><a href="javascript:void(0)">więcej komentarzy (' + array.length + ') <i class="fa fa-chevron-down"></i></a></p>';
            var elem = document.createElement('li');
            elem.innerHTML = sElem;
            elem.onclick = function() {
                var currentThread = this.parentElement;
                var currentArray = Array.prototype.slice.call(currentThread.children).slice(2);
                for (var i = 0; i < currentArray.length; ++i) {
                    currentArray[i].style.display = 'list-item';
                }
                currentThread.removeChild(this);
            };
            thread.appendChild(elem);
        }
    }
})();
