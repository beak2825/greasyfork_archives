// ==UserScript==
// @name         Checkbox&Filter ProAlpha
// @namespace    https://proships.ru/stat
// @version      0.1.2
// @description  Добавляет фильтр и чекбоксы колонок к серверной статистике Proships.
// @copyright    2019, kusanagitsurugi (https://openuserjs.org/users/kusanagitsurugi)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://raw.githubusercontent.com/kusanagitsurugi/PS_userscript/master/icon.png
// @author       kusanagitsurugi
// @match        https://proships.ru/stat/ru/ship/all/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.widgets.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/widgets/widget-columnSelector.min.js
// @downloadURL https://update.greasyfork.org/scripts/392962/CheckboxFilter%20ProAlpha.user.js
// @updateURL https://update.greasyfork.org/scripts/392962/CheckboxFilter%20ProAlpha.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`

.cnt-sel{
display: flex;
flex-wrap: wrap;
height: 48px;
}

.cnt-sel{
margin: 0 0 0.5em 0;
}
.cnt-sel label {
display: block;
margin: 0.0625em;
padding: 0.5em 0.25em;
width: 5em;
height: 1em;
text-align: center;
border-radius: 0.25em;
/*border: 1px solid #00000055;*/
cursor: pointer;
user-select: none;
}

.cnt-sel label {
color: #777;
border: 1px solid rgba(0, 0, 0, 0.05);
}
.cnt-sel input.checked + label{
color: #000;
border: 1px solid rgba(0, 0, 0, 0.4);
}
.cnt-sel label:hover{
color: #000;
}
.cnt-sel input.checked + label:hover{
color: #000;
}

.cnt-sel input {
display: none;
}

.cnt-sel .disabled {
color: #ddd;
}

.tablesorter-filter {
width: 100%;
padding: 0.25em;
}

.filtered {
display: none;
}
`);
    $('.ships').prepend('<div class="cnt-sel"></div>');
    $('.ships > script').remove();


    $(function () {
        $("#MyShips").tablesorter({
            theme: 'green',
            widgets: ['zebra', 'columnSelector', 'stickyHeaders', 'filter'],
            widgetOptions: {
                columnSelector_container: $('.cnt-sel'),
                columnSelector_columns: {
                    0: 'disable',
                    1: 'disable'
                },
                columnSelector_saveColumns: true,
                columnSelector_layout: '<div class="btn_"><input type="checkbox" class="user_ships_checkbox" id="{name}"><label for="{name}">{name}</label><div>',
                columnSelector_layoutCustomizer: null,
                columnSelector_name: 'data-selector-name',
                columnSelector_mediaquery: false,
                columnSelector_maxVisible: null,
                columnSelector_minVisible: null,
                columnSelector_priority: 'data-priority',
                columnSelector_cssChecked: 'checked',
                columnSelector_classHasSpan: 'hasSpan',
                columnSelector_updated: 'columnUpdate',
                filter_placeholder : { search : '', select : '' },
            }
        });
    });
    $('td[data-column="1"]>input').prop('placeholder', "<5, >6, 7=");
    $('td[data-column="2"]>input').prop('placeholder', "!OLD");
    $('td[data-column="3"]>input').prop('placeholder', "uk");
    $('td[data-column="4"]>input').prop('placeholder', "100 - 500");
})();
