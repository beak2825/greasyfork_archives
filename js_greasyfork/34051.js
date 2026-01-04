// ==UserScript==
// @name            hwm_view_remote_post
// @author          Kleshnerukij
// @description     Добавляет к постам ссылку на просмотр поста
// @version         1.2.2
// @include         http://www.heroeswm.ru/forum_messages.php?tid=*
// @include         http://qrator.heroeswm.ru/forum_messages.php?tid=*
// @include         http://178.248.235.15/forum_messages.php?tid=*
// @include         http://www.lordswm.com/forum_messages.php?tid=*
// @include         https://www.heroeswm.ru/forum_messages.php?tid=*
// @include         https://qrator.heroeswm.ru/forum_messages.php?tid=*
// @include         https://178.248.235.15/forum_messages.php?tid=*
// @include         https://www.lordswm.com/forum_messages.php?tid=*
// @encoding 	    utf-8
// @namespace       https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/34051/hwm_view_remote_post.user.js
// @updateURL https://update.greasyfork.org/scripts/34051/hwm_view_remote_post.meta.js
// ==/UserScript==

// (c) Клещнерукий - http://www.heroeswm.ru/pl_info.php?id=7076906

(function () {
	var page_content = document.getElementsByTagName('body')[0].innerHTML;
	var search_del_msg = /name="(\d+)" class="pi">\d+<\/a>&nbsp;<\/span>&nbsp;\d+\-\d+\-\d+ \d+:\d+:\d+<\/td><td style="border: 0px; background-image: none" align="right"><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><td style="color: #000000; padding: 5px;font-size: 0.8125em;"><font color="red"><font color="red"><i>\[Сообщение удалено/ig;
	var chek_section = /forum_thread\.php\?id=\d+\"><font class=\"forumt\">(Форум для внеигровых тем|Творчество)<\/font>/i;
	var msg_id;

	if (page_content.search(chek_section) != -1) { // Переделать
		while ((msg_id = search_del_msg.exec(page_content)) !== null) {
            document.getElementsByName(msg_id[1])[0].parentNode.parentNode.innerHTML += " <a style=\"text-decoration: none;\" href=\"http://hwmfamily.ru/services/view_remote.php?id_msg="+msg_id[1]+"\" target=\"_blank\"><img width=\"12px\" src=\"https://i.ibb.co/z6sYHyw/1200328.png\"></a>";
		}
	}
})();