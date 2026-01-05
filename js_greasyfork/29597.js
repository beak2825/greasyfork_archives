// ==UserScript==
// @name         Focus Search Field
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Allows you to focus the search field on any website by using a keyboard shortcut (Ctrl + ;)
// @author       You
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/29597/Focus%20Search%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/29597/Focus%20Search%20Field.meta.js
// ==/UserScript==


(function ($, undefined) {
  $(function () {

    'use strict';
    var inputTypes = [
        '[type=search]',
        '[type=text]',
        '[type!=hidden][type!=submit]',
    ];

    var inputSelectors = [
        'input[name=q]',
        'input[name=query]',
        'input[name=search]',
        'input[name*=search]',
        'input#q',
        'input#query',
        'input#search',
        'input.search',
        'input.query',
        'input[id*=search]',
        'input[class*=search]',
        'input[placeholder*=search]',
        'input[placeholder*=Search]',
        'div.search input',
        'div[class*=search] input',
        'textarea[name=q]',
    ];

    var searchFields = [];

    var searchIndex = null;

    var findSearchField = function() {
        if (searchFields.length) {
            console.info(searchFields.length + ' search fields reading from cache');
            return searchFields;
        }
        inputTypes.forEach(function(type) {
            inputSelectors.forEach(function(selector) {
                var result = $(selector+type+':visible');
                searchFields = searchFields.concat(result.toArray());
            });
        });
        if (!searchFields.length) {
            console.info('search field not found');
        } else {
            // remove duplicates
            searchFields = [...new Set(searchFields)];
            console.info(searchFields.length + ' search fields found');
        }
        return searchFields;
    };

    var moveSearchIndex = function(n) {
        if (searchIndex === null) {
            searchIndex = 0;
        } else {
            searchIndex += n;
        }
        if (searchIndex >= searchFields.length) {
            searchIndex = 0;
        }
        if (searchIndex < 0) {
            searchIndex = searchFields.length - 1;
        }
        return searchIndex;
    };

    var focusNextSearchField = function(n) {
        var searchFields = findSearchField();
        if (searchFields.length) {
            var i = moveSearchIndex(n);
            console.info('trying to focus search field with index: ' + i);
            $(searchFields[i]).focus().select();
        }
    };

    $('body').keydown(function(event){
        if (event.keyCode == 186 && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
            focusNextSearchField(1);
            event.preventDefault();
        }
        if (event.keyCode == 186 && (event.ctrlKey || event.metaKey) && event.shiftKey) {
            focusNextSearchField(-1);
            event.preventDefault();
        }
    });
  });
})(window.jQuery.noConflict(true));