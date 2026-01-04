// ==UserScript==
// @name         ndp shut up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  only show name in ndp panel
// @author       Leifeng
// @include      /https?\:\/\/ndp\.netease\.com/index-new*/
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390053/ndp%20shut%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/390053/ndp%20shut%20up.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!/overview/.test(location.hash) )  {
        return;
    };

    $(document).ready(function(){
        $('.u-linear-layout_FaugwXHe.index_module_r1smFo39').hide();
        $('[class^="index_title_"]').hide();
        $('.u-collect_noData_2l86Hu9q').hide();
        $('.u-key-value_title_2cAXsihI').hide()
        $('.u-key-value_colon_2cAXsihI').hide()
        $('.u-collect_message_2l86Hu9q').map((idx, it) => {
            $($(it).find('.u-key-value_2cAXsihI')[0]).hide();
        })
        $('table tr th').removeAttr('width')
        $('table').map((idx, table) => {
            $(table).find('tr').map((idx, trEle) => {
                $(trEle).find('td:eq(1)').hide();
                $(trEle).find('th:eq(1)').hide();

                $(trEle).find('td:eq(2)').hide();
                $(trEle).find('th:eq(2)').hide();

                $(trEle).find('td:eq(3)').hide();
                $(trEle).find('th:eq(3)').hide();

                $(trEle).find('td:eq(5)').hide();
                $(trEle).find('th:eq(5)').hide();
            })
        })
        // $('#app').hide();
        // var items = [];
        // $('[class^="u-collect_"]').map((index, collect) => {
        //     var link = $(collect).find('[class^="u-link__"]')[1];
        //     if(link) {
        //         var name = link.innerHTML;
        //         var href = link.hash;
        //         items.push(`<p><a href=${href} target="_blank" class="u-link__4y3hmbp">${name}</a></p>`);
        //     }
        // });
        // $('body').append(items)
    });
})();