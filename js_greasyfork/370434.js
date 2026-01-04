// ==UserScript==
// @name            hwm_tj_single_parser
// @author          ntgltema
// @description     Добавляет найденых существ в общую базу
// @version         0.0.1
// @include         http://www.heroeswm.ru/object-info.php?id=*
// @include         http://qrator.heroeswm.ru/object-info.php?id=*
// @include         http://178.248.235.15/object-info.php?id=*
// @include         http://www.lordswm.com/object-info.php?id=*
// @encoding 	    utf-8
// @namespace https://greasyfork.org/users/197166
// @downloadURL https://update.greasyfork.org/scripts/370434/hwm_tj_single_parser.user.js
// @updateURL https://update.greasyfork.org/scripts/370434/hwm_tj_single_parser.meta.js
// ==/UserScript==

window.onload = function() {
	var page_content = document.getElementsByTagName('body')[0].innerHTML;
    var user_id = page_content.match(/pl_hunter_stat\.php\?id\=(.*?)\"/)[1]; //тут айди пользователя
    var data = page_content.match(/Найдены \<b\>(.*?)\<\/b\>\! Цена для набора в портале времени: (.*?) шт. за (.*?) крист./); //существа и их цена в индексах 1-3
    var type = page_content.match(/Тип\: (.*?)\<br\>/)[1]; //тип объекта
    var map = page_content.match(/Район\:(.*?)\>(.*?)\</)[2]; //район
    var object_id = document.location.search.match(/\d{1,}/g); //айди объекта
	if (page_content.search("Поиск существ на этом объекте займет") == -1) {
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

        var xhr = new XHR();
        xhr.open('GET', 'http://hwm.ntgltema.tk/tj_single/parser.php?user_id='+user_id+'&object_id='+object_id+'&type='+type+'&map='+map+'&name='+data[1] +'&count='+data[2] +'&cost='+data[3] , true);
        xhr.send();
		}
};