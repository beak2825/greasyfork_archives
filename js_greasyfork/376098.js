// ==UserScript==
// @name         js41637 overwatch item tracker - hide owned items
// @namespace    http://porath.org/
// @version      1.0
// @description  add a checkbox to hide items you own on the overwatch item tracker
// @author       arc
// @match        https://js41637.github.io/Overwatch-Item-Tracker/
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376098/js41637%20overwatch%20item%20tracker%20-%20hide%20owned%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/376098/js41637%20overwatch%20item%20tracker%20-%20hide%20owned%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkedItemVisibilityCheckbox = $('<input />').attr('type', 'checkbox').attr('name', 'checked-item-visibility').attr('id', 'checked-item-visibility').css('height', '24px').css('min-width', '24px').css('margin-left', '8px').css('position', 'relative').css('top', '2px');
    var checkedItemVisibilityH2 = $('<h2 />').css('margin-right', '0.5em').css('position', 'absolute').css('top', '5px').css('right', '150px').css('font-size', '28px').text('Hide owned items: ').append(checkedItemVisibilityCheckbox);

    $('#header').append(checkedItemVisibilityH2);

    $('#checked-item-visibility').on('click', function () {

        if ($(this).prop('checked')) {
            $('.ng-not-empty').parent().hide().addClass('arc-hidden');
        }
        else {
            $('.arc-hidden').show().removeClass('arc-hidden');
        }
    });
})();