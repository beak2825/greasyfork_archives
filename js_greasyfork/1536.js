// ==UserScript==
// @name           Virtonomica:Lab Filter
// @namespace      virtonomica
// @version        0.64
// @description    Выделение тех лаборатоий, в которых надо нажать кнопки, что бы продолжить исследования
// @description	   v0.6 - правки под новый дизайн списка юнитов
// @include        *virtonomic*.*/*/main/company/view/*/unit_list
// @include        *virtonomic*.*/*/main/company/view/*
// @exclude        *virtonomic*.*/*/main/company/view/*/unit_list/equipment
// @downloadURL https://update.greasyfork.org/scripts/1536/Virtonomica%3ALab%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1536/Virtonomica%3ALab%20Filter.meta.js
// ==/UserScript==

var run = function() {
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;

    // сортировка объекта как строки
    function sortObj(arr){
        // Setup Arrays
        var sortedKeys = [];
        var sortedObj = {};

        // Separate keys and sort them
        for (var i in arr){sortedKeys.push(i);}
        sortedKeys.sort();

        // Reconstruct sorted obj based on keys
        for (var j in sortedKeys){sortedObj[sortedKeys[j]] = arr[sortedKeys[j]];}
        return sortedObj;
    }

    function find_lab( mode ) {
        var n = 0;
        var find = input.val();
        $('td.spec').each(function() {
            var show = 0;
            var name = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($(this).text().trim().replace('"','').replace('"',''));
            var pr = name[1];
            var st = name[3];
            var lev = name[2];
            if (find == "4" ) $("div.st").show();
            else $("div.st").hide();

            $(this).removeClass("lab_round_1");
            switch( find ) {
                case "0": {
                    $(this.parentNode).show();
                    $("div.st").show();
                    show = 1;
                    $("div.st").show();
                    break;}

                case "1":
                case "4":{
                    // начальная стадия исследований
                    if ( ( pr == 0) && ( typeof st == 'undefined') ){
                        show = 1;
                        break;
                    }
                    // заверешена 1 стадия
                    if ( (st == 1) && (pr == 100) ){
                        show = 1;
                        //$(this.parentNode).show();
                        break;
                    }
                    // завершена 2 стадия
                    if ( (st == 3) && (pr == 0) ){
                        show = 1;
                        break;
                    }
                    break;}

                case "2": {
                    if ( ( pr > 90) && ( pr < 100) ) {
                        show = 1;
                    }
                    break;}

                case "3": {
                    if ( ( pr > 80) && ( pr < 90) ) {
                        show = 1;
                    }
                    break;}
                case "10": {
                    if ( ( pr > 0) && ( pr < 20) ) {
                        show = 1;
                    }
                    break;}

                case "5": {
                    if ( lev< 9) {
                        show = 1;
                    }
                    break;}
                case "17": {
                    if ( lev > 16) {
                        show = 1;
                    }
                    break;}
                case "38": {
                    if ( lev > 37) {
                        show = 1;
                    }
                    break;}
                case "6": {
                    if ( st == 1) {
                      show = 1;
                      if ( pr > 89 ) {
                      	$(this).addClass("lab_round_1");
                      }
                    }
                    break;}
                case "7": {
                    if ( st == 2) {
                        show = 1;
                    }
                    break;}
                case "8": {
                    if ( st == 3) {
                        show = 1;
                    }
                    break;}
            }
            var n = $(this.parentNode).next();
            if ( show == 0){
                $(this.parentNode).hide();
                if(/unit_comment/.test(n.attr('class'))) n.hide();
            } else {
                $(this.parentNode).show();
                if(/unit_comment/.test(n.attr('class'))) n.show();
                $("div.st").show();
            }

        });
    }
    var container = $("td.u-l").parent().parent();

    var panel = $("#extension_panel");
    if ( panel.length == 0 ) {
        // добавить панель, если её еще нет
        var ext_panel = "<div style='padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; float:left; white-space:nowrap; color:#0184D0; display:none;'  id=extension_panel></div>";
        container.append( "<tr><td>" +ext_panel );
    }
  
  	// Стили  
    var st = $("style");
	  if ( $(".lab_round_1", st).length == 0 ) {
		  st.append(".lab_round_1{background-color: moccasin;padding: 4px;border-radius: 8px;}");
		  //st.append(".lab_round_1:hover{opacity:1.0}");
	  }


    var input = $('<select>')
    .append('<option value=0>&nbsp;</option>')
    .append('<option value=5>техны ниже 9</option>')
    .append('<option value=17>техны выше  16</option>')
    .append('<option value=38>техны от 38</option>')
    .append('<option value=3>больше 80%</option>')
    .append('<option value=2>больше 90%</option>')
    .append('<option value=10>меньше 20%</option>')
    .append('<option value=6>стадия 1</option>')
    .append('<option value=7>стадия 2</option>')
    .append('<option value=8>стадия 3</option>')
    .append('<option value=1>найти</option>').change( function() {find_lab();})
    .append('<option value=4>найти (+заметки)</option>').change( function() {find_lab('' );});

    // Изучаемые технологии
    var list = {};
    $('td.spec').each(function() {
        var name = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($(this).text().trim().replace('"','').replace('"','') );
        if (list[name[4]] != null) {list[name[4]]++;}
        else if (typeof name[4] != 'undefined') {list[name[4]] = 1;}
    });

    list = sortObj(list);
    var filter = $(" <select>").append('<option value=0>&nbsp;</option>').change( function(){
        var search = $(this).val();
        $('td.spec').each(function() {
            var name = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($(this).text().trim().replace('"','').replace('"','') );
            if (name[4] == search ){
                $(this.parentNode).show();
                $("div.st").show();
            } else {
                $(this.parentNode).hide();
                // спрятать заметки
                $("div.st").hide();
            }
        });
    });

    $.each(list,function(o,i) {
        var str = '<option value="'+ o +'">'+ o;
        str+= (i > 1)?' (' + i + ')':'';
        str+= '</option>';
        filter.append(str);
    });

    // Число подразделений на странице
    var units = $("td.info");
    // число лаборатоий на странице
    var labs = $("td.i-lab");

    // если на странице только лаборатории
    if ( labs.length == units.length) {
        $("#extension_panel").append('<div id=science>Исследования: ');
        $("#science").append(input).append(filter);
        $("#extension_panel").show();
    }

};

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}