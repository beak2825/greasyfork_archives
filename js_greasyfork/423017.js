// ==UserScript==
// @name            hwm_forum_t_filter
// @author          Kleshnerukij
// @description     Фильтр по совпадению текста на форуме
// @version         0.4.0
// @include         https://www.heroeswm.ru/forum_messages.php?tid=*
// @include         https://qrator.heroeswm.ru/forum_messages.php?tid=*
// @include         https://178.248.235.15/forum_messages.php?tid=*
// @include         https://www.lordswm.com/forum_messages.php?tid=*
// @encoding 	    utf-8
// @namespace       https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/423017/hwm_forum_t_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/423017/hwm_forum_t_filter.meta.js
// ==/UserScript==

// (c) Клещнерукий - http://www.heroeswm.ru/pl_info.php?id=7076906

(function() {
    'use strict';

    // При необходимости, можно задать ещё условия для фильтра
    var x46_filter_phrase = [
        '(.*?|)саш.*?зеб.*?',
        'https://webhamster.ru/mytetrashare/index/mtb0/1033'
    ];

	var x46_page_content = document.getElementsByTagName('body')[0].innerHTML;
	var x46_search_zeb_msg = /name="(\d+)" class="pi">\d+<\/a>&nbsp;<\/span>&nbsp;\d+\-\d+\-\d+ \d+:\d+:\d+<\/td><td style="border: 0px; background-image: none" align="right"><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><td style="color: #000000; padding: 5px;font-size: 0.8125em;">(.*?)<\/td>/isg;
	var x46_search_zeb_err = /(.*?|)саш.*?зеб.*?/isg;
	var x46_chek_section = /forum_thread\.php\?id=\d+\"><font class=\"forumt\">(Форум для внеигровых тем|Творчество)<\/font>/i;
	var x46_msg_id;

    while ((x46_msg_id = x46_search_zeb_msg.exec(x46_page_content)) !== null) {
        x46_filter_phrase.forEach(function(x46_reg, i) {
            var x46_temp_reg = new RegExp(x46_reg, "igs");
            if (x46_msg_id[2].search(x46_temp_reg) != -1) {
                document.getElementsByName(x46_msg_id[1])[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.getElementsByTagName('td')[0].innerHTML = '<font color="red">Сообщение удалено спам-фильтром</font>';
            }
        });
    }
})();