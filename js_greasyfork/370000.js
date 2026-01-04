// ==UserScript==
// @name         Corp - Task Filter
// @namespace    https://greasyfork.org/ru/scripts/370000-corp-hide-done
// @version      2.0.3
// @description  Filterable task for corp.qsoft.ru
// @author       Alex Yashin
// @resource     https://code.jquery.com/jquery-3.3.1.min.js
// @match        http://www.corp.qsoft.ru/bitrix/admin/oper_day.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370000/Corp%20-%20Task%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/370000/Corp%20-%20Task%20Filter.meta.js
// ==/UserScript==

if (typeof Corp == 'undefined') var Corp = {};
Corp.Filter = {
    init: function() {
        if ( ! localStorage['corp-filter-checked'])
        {
            localStorage['corp-filter-checked'] = JSON.stringify([true, true, true, true, true]);
        }
        let checked = JSON.parse(localStorage['corp-filter-checked']);
        console.log(checked);

        $.each(checked, function(i, element) {
            let input = $('.filter-status input').get(i);
            $(input).attr('checked', element);
            $(input).bind('change', function(event) {
                let targ = event.currentTarget;
                let bChecked = $(targ).attr('checked');
                let nStatus = $(targ).attr('status');
                Corp.Filter.set(nStatus, bChecked);
            });
            Corp.Filter.setVisibility(i, element);
        });
    },

    set: function(status, visible) {
        let checked = JSON.parse(localStorage['corp-filter-checked']);
        checked[status] = visible;
        localStorage['corp-filter-checked'] = JSON.stringify(checked);
        this.setVisibility(status, visible);
    },

    setVisibility: function(status, visible) {
        let display = visible ? 'table-row' : 'none';

        let all = $('img.qsoft_tmpl_png_for_ie2.curDayTable_status');

        $.each(all, function(i, element) {

            if ($(element).attr('src') === '/bitrix/images/support/'+status+'.png')
            {
                console.log($(element).parents('tr'));
                $(element).parents('tr').attr('style', 'display:'+display);
            }
        });
    }
};

(function() {


    let targetTd = $('table.qsoft_cmp_base_mr').find('td').get(5);

    $(targetTd).html(''+
        '<style>.filter-status img{border-radius:50%;border:3px solid red;margin:5px;} .filter-status input:checked+img{border:3px solid green;}</style>'+
        '<div class="filter-status">'+
            '<label><input type="checkbox" style="display:none" status="0"><img src="/bitrix/images/support/0.png"></label>'+
            '<label><input type="checkbox" style="display:none" status="1"><img src="/bitrix/images/support/1.png"></label>'+
            '<label><input type="checkbox" style="display:none" status="2"><img src="/bitrix/images/support/2.png"></label>'+
            '<label><input type="checkbox" style="display:none" status="3"><img src="/bitrix/images/support/3.png"></label>'+
            '<label><input type="checkbox" style="display:none" status="4"><img src="/bitrix/images/support/4.png"></label>'+
    '</div>');

    Corp.Filter.init();
})();