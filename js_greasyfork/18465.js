// ==UserScript==
// @name labStartProjectFilterAddon1
// @description Аддон для скрипта https://greasyfork.org/ru/scripts/5385-labstartprojectfilter . Фильтр для выпадающего списка запуска исследований технологии: добавляет чекбоксы "скрыть уже изучаемые" и "скрыть ресурсы".
// @author cobra3125
// @namespace      virtonomica
// @license MIT
// @version 1.3
// @include http*://*virtonomica.*/*/window/unit/view/*/project_create
// @downloadURL https://update.greasyfork.org/scripts/18465/labStartProjectFilterAddon1.user.js
// @updateURL https://update.greasyfork.org/scripts/18465/labStartProjectFilterAddon1.meta.js
// ==/UserScript==

// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)
(function (window, undefined) {

    // [2] нормализуем window
    var w;

    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }

    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js");
        script.addEventListener('load', function () {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }


    // the guts of this userscript
    function main() {
		//для добавления в выпадающий список отметок о текущих исследованиях
        if (/\w*virtonomica\.\w+\/\w+\/window\/unit\/view\/\d+\/project_create$/.test(window.location)) {
			var svToggleHideInProgress = '<label><input id="toggleHideInProgress" type="checkbox">Скрыть уже изучаемые</label>';
			var svToggleHideMinableAndGrown = '<label><input id="toggleHideMinableAndGrown" type="checkbox">Скрыть ресурсы</label>';
			/////////////////
			var row = $('tr:has(td):has(select[name="unit_type"])');
			row.after('<tr><td></td><td>'+svToggleHideInProgress+svToggleHideMinableAndGrown+'</td></tr>');
			///////////////// 
			$('#toggleHideInProgress').change( function(){
				var bvChecked = $(this).is(':checked');
				if (bvChecked) {
					$('select[name=unit_type] > option:contains(+)').hide();	
				} else {
					$('select[name=unit_type] > option:contains(+)').show();	
				}
				$("select[name=unit_type]").trigger("chosen:updated");
			});
			$('#toggleHideMinableAndGrown').change( function(){
				var bvChecked = $(this).is(':checked');
				if (bvChecked) {
					$('select[name=unit_type] > option:contains(рудник)').hide();
					$('select[name=unit_type] > option:contains(карьер)').hide();
					$('select[name=unit_type] > option:contains(шахта)').hide();
					$('select[name=unit_type] > option:contains(Шахта)').hide();
					$('select[name=unit_type] > option:contains(Плантация)').hide();
					$('select[name=unit_type] > option:contains(Лесопилка)').hide();
					$('select[name=unit_type] > option:contains(Земледельческая ферма)').hide();
					$('select[name=unit_type] > option:contains(Золотодобывающее предприятие)').hide();	
				} else {
					$('select[name=unit_type] > option:contains(рудник)').show();
					$('select[name=unit_type] > option:contains(карьер)').show();
					$('select[name=unit_type] > option:contains(шахта)').show();
					$('select[name=unit_type] > option:contains(Шахта)').show();
					$('select[name=unit_type] > option:contains(Плантация)').show();
					$('select[name=unit_type] > option:contains(Лесопилка)').show();	
					$('select[name=unit_type] > option:contains(Земледельческая ферма)').show();
					$('select[name=unit_type] > option:contains(Золотодобывающее предприятие)').show();	
				}
				$("select[name=unit_type]").trigger("chosen:updated");
			});
		}
    }

    // load jQuery and execute the main function
    addJQuery(main);
})(window);