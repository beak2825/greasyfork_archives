// ==UserScript==
// @name labStartProjectFilter
// @description Отмечает в выпадающем списке запуска исследований технологии, которые уже исследуются вами
// @description fix for new design 2014
// @author cobra3125
// @license MIT
// @version 1.53private3
// @include https://virtonomica.*/*/main/company/view/*/unit_list
// @include https://virtonomica.*/*/window/unit/view/*/project_create
// @include https://virtonomica.*/*/main/management_action/*/investigations/technologies
// @include https://virtonomica.*/*/main/unit/view/*/investigation
// @namespace https://greasyfork.org/users/2055
// @downloadURL https://update.greasyfork.org/scripts/378979/labStartProjectFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/378979/labStartProjectFilter.meta.js
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
        // [4] дополнительная проверка наряду с @include
        //begin[0] нужно для локального хранилища
        (function($) {
            // Private data
            var isLS=typeof window.localStorage!=='undefined';
            // Private functions
            function wls(n,v){var c;if(typeof n==="string"&&typeof v==="string"){localStorage[n]=v;return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n){if(n.hasOwnProperty(c)){localStorage[c]=n[c];}}return true;}return false;}
            function wc(n,v){var dt,e,c;dt=new Date();dt.setTime(dt.getTime()+31536000000);e="; expires="+dt.toGMTString();if(typeof n==="string"&&typeof v==="string"){document.cookie=n+"="+v+e+"; path=/";return true;}else if(typeof n==="object"&&typeof v==="undefined"){for(c in n) {if(n.hasOwnProperty(c)){document.cookie=c+"="+n[c]+e+"; path=/";}}return true;}return false;}
            function rls(n){return localStorage[n];}
            function rc(n){var nn, ca, i, c;nn=n+"=";ca=document.cookie.split(';');for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)===' '){c=c.substring(1,c.length);}if(c.indexOf(nn)===0){return c.substring(nn.length,c.length);}}return null;}
            function dls(n){return delete localStorage[n];}
            function dc(n){return wc(n,"",-1);}

            /**
             * Public API
             * $.Storage - Represents the user's data store, whether it's cookies or local storage.
             * $.Storage.set("name", "value") - Stores a named value in the data store.
             * $.Storage.set({"name1":"value1", "name2":"value2", etc}) - Stores multiple name/value pairs in the data store.
             * $.Storage.get("name") - Retrieves the value of the given name from the data store.
             * $.Storage.remove("name") - Permanently deletes the name/value pair from the data store.
             */
            $.extend({
                Storage: {
                    set: isLS ? wls : wc,
                    get: isLS ? rls : rc,
                    remove: isLS ? dls :dc
                }
            });
        })(jQuery);
        //end[0]
        function MultDimArrToStr(anArray){
            var str = '';
            var len = anArray.length;
            for (var i = 0; i < len; ++i) {
                if(str != ''){
                    str += '|';
                }
                str += anArray[i]['id'] + ';' + anArray[i]['name'] + ';' + anArray[i]['tech'];
            }
            //str == "4224597;Тракторный завод|4224597;Тракторный завод|4224597;Тракторный завод";
            return str;
        }

        function StrToMultDimArr(str){
            //alert(str);
            //var str = "4224597;Тракторный завод|4224597;Тракторный завод|4224597;Тракторный завод";
            var tempArray = str.split('|');
            var finalArray = new Array();
            var len = tempArray.length;
            for (var i = 0; i < len; ++i) {
                var tmp = tempArray[i].split(';');
                finalArray.push({
                    id: tmp[0],
                    name: tmp[1],
                    tech: tmp[2]
                });
            }
            return finalArray;
        }

        function inMultDimArray(value, anArray, attr){
            var theIndex = -1;
            var len = anArray.length;
            for (var i = 0; i < len; ++i) {
                if (anArray[i][attr].toUpperCase() == value.toUpperCase()) {
                    theIndex = i;
                    break;
                }
            }
            return theIndex;
        }

        function delByVal(anArray, attr, value){
            var result = new Array();
            var len = anArray.length;
            for (var i = 0; i < len; ++i) {
                if (anArray[i][attr] != value) result.push(anArray[i]);
            }
            return result;
        }

        function countInDimArray(value, anArray){
            var cnt = 0;
            var len = anArray.length;
            for (var i = 0; i < len; ++i) {
                if (anArray[i]['name'] == value) {
                    ++cnt;
                }
            }
            return cnt;
        }

        function distinct(anArray) {
            var result = new Array();
            var len = anArray.length;
            for (var i = 0; i < len; ++i) {
                if (inMultDimArray(anArray[i]['id'], result, 'id') == -1) result.push(anArray[i]);
            }
            return result;
        }

        function sort(anArray){
            return anArray.sort(function(a, b) {
                var compA = a['name'].toUpperCase();
                var compB = b['name'].toUpperCase();
                var compTA = parseFloat(a['tech'].trim());
                var compTB = parseFloat(b['tech'].trim());

                return (compA < compB) ? -1 : (compA > compB) ? 1 : (compTA > compTB) ? -1 : (compTA < compTB) ? 1 : 0;
            });
        }

// @include http://virtonomica.*/*/main/unit/view/*/investigation
        //для определения изучаемой в открытой лабе технологии
        if (/https:\/\/virtonomica\.\w+\/\w+\/main\/unit\/view\/\w+\/investigation/.test(window.location)) {
            var arr = StrToMultDimArr( $.Storage.get('labStartFilterArray') );
            if (!$.isArray(arr)){
                arr = new Array();
            }
            var id = (window.location + '').trim().split('/');
            id = id[id.length-2];
            $('td[class="title"]').each(function() {
                if (jQuery(this).text() == 'Текущее исследование'){
                    var texhName = jQuery(this).parent().children('td').eq(1).children('a').eq(1).text();
                    var texhLvl = jQuery(this).parent().parent().children('tr').eq(1).children('td').eq(1).children('span').text();

                    arr = delByVal(arr, 'id', id);
                    arr.push({
                        id: id,
                        name: texhName,
                        tech: texhLvl
                    });
                    arr = sort(arr);
                    arr = distinct(arr);
                    $.Storage.set('labStartFilterArray', MultDimArrToStr(arr));
                }
            });
        }

        //для сбора списка уже изученных технологий
        if (/https:\/\/virtonomica\.\w+\/\w+\/main\/management_action\/\d+\/investigations\/technologies[#]{0,1}/.test(window.location)) {
            var arr = new Array();
            $('div[class="tech_d"], div[class="tech_s"]').children('a').each(function() {
                var id = jQuery(this).attr('href').trim().split('/');
                id = id[id.length-1];
                arr.push({
                    id: id,
                    name: jQuery(this).parent().parent().parent().children('div[class="tech_title_cell"]').children('b').text().trim(),
                    tech: jQuery(this).text().trim()
                });
            });
            arr = sort(arr);
            //alert(MultDimArrToStr(arr));
            arr = distinct(arr);
            //alert(MultDimArrToStr(arr));
            $.Storage.set('labSFTechDoneArray', MultDimArrToStr(arr));
            //console.log(arr);
        }

        //для добавления в выпадающий список отметок о текущих исследованиях
            if (/https:\/\/virtonomica\.\w+\/\w+\/window\/unit\/view\/\d+\/project_create$/.test(window.location)) {
            //console.info("&&&---&&&");
            // Стили
            var st = $("style");
            if ( $(".minfo", st).length == 0 ) {
                st.append(".minfo{color: black; border:solid 1px black; background-color: lightgray;}");
            }
            $("#headerWithSeparator").after("<div class=minfo id=info>обращаемся на сервер...</div>").after("<div class=minfo id=form_s>показывать только <input type=number id=s_level value=0/>уровень</div>");
            $("#info").css('color', 'black');
            $("#s_level").change(function(){

                var level = $("#s_level").val();
                //console.log("**** change **** = " + level);

                var arr = StrToMultDimArr( $.Storage.get('labStartFilterArray') );
                var techArr = StrToMultDimArr( $.Storage.get('labSFTechDoneArray') );

                $('select[name="unit_type"]').children().each(function() {
                    str = jQuery(this).attr("s_name");

                    cnt = countInDimArray(str, arr);
                    idx = inMultDimArray(str, techArr, 'name');

                    //console.log( str );
                    if ( level == 0 ) {
                        jQuery(this).show();
                    } else {
                        jQuery(this).hide();
                    }

                    if ( idx != -1 && level > 0 && level == techArr[idx]['tech'] ) {
                        //jQuery(this).css("color","green");
                        jQuery(this).show();
                    }

                });
            });

            var url_sience = 'https://test.pbliga.com/virta/sience.php';
            $.get(url_sience, function(sience){
                //console.info(sience);
                $("#info").text("получены данные о приоритетных технологиях");

                var arr = StrToMultDimArr( $.Storage.get('labStartFilterArray') );
                var techArr = StrToMultDimArr( $.Storage.get('labSFTechDoneArray') );
                var str;
                var cnt;
                if (arr){
                    //select name = unit_type
                    $('select[name="unit_type"]').children().each(function() {
                        str = jQuery(this).text().trim();
                        cnt = countInDimArray(str, arr);
                        idx = inMultDimArray(str, techArr, 'name');
                        //var color_techn = {1:'lightgreen', 2: '#a7cb17', 3: '#5c607e'};

                        jQuery(this).attr("s_name", str);


                        // раставляем приоритеты
                        if ( sience[str] == null ) {
                            str = "   " + str;
                        }else {
                            str = "[" + sience[str] + "] " + str;
                        }

                        if(idx != -1){
                            str = str + ' (' + techArr[idx]['tech'] + ')';
                        }
                        if(cnt > 0){
                            str = str + ' +' + cnt;
                            jQuery(this).css("padding-left","20px");
                        }
                        if(cnt > 1){
                            jQuery(this).css("color","orangered");
                        }
                        if(cnt > 0 || idx != -1){
                            jQuery(this).text(str);
                        }
                    });
                }

            });

        }

        //для сбора списка текущих исследований из списка подразделений
        if (/https:\/\/virtonomica\.\w+\/\w+\/main\/company\/view\/\d+\/unit_list$/.test(window.location)) {
            //Ниже идёт непосредственно код скрипта

            //console.log("---collect list---");

            //$.Storage.set('test','val');
            //alert($.Storage.get('test'));

            //alert($.Storage.get('labStartFilterArray'));
            var arr;
            //alert(arr);
            var currDate = (new Date()).getDate() + '';
            var lastSaveDate = $.Storage.get('labStartFilterDate');

            if (currDate == lastSaveDate){
                //	arr = StrToMultDimArr( $.Storage.get('labStartFilterArray') );
            }else{
                $.Storage.set('labStartFilterDate', currDate);
                //alert('set date = ' + currDate);
            }
            if (!$.isArray(arr)){
                arr = new Array();
                //alert('reset');
            }
            //alert(arr.toString());
            var executed = 0;
//            $('td[class="u-c i-lab"]').parent().find('td[class="u-e"]').each(function () {
            $('td[class="info i-lab"]').parent().find('td[class="spec"]').each(function () {
                var str = jQuery(this).children().text();
                var tech = jQuery(this).children().children('b').eq(1).text();

                //var url = jQuery(this).parent().children('td[class="u-c i-lab"]').children('a').attr('href');
                var url = jQuery(this).parent().children('td[class="info i-lab"]').children('a').attr('href');
                var id = url.split('/');
                id = id[id.length-1];
                //alert(id);
                var substr = str.split(' ');
                substr[0] = '';
                substr[1] = '';
                str = substr.join(' ');
                str = str.replace('"','').replace('"','');
                //console.log(tech + " =>" + str);
                //alert(tech);
                arr.push({
                    id: id,
                    name: str.trim().replace("\"","").replace("\"",""),
                    tech: tech.trim()
                });
                executed = 1;
                /*var object2 = {
                 id: id,
                 name: str.trim()
                 };*/
                /* merge object2 into arr, recursively */
                //$.extend(true, arr, object2);
            });
            if(1 == executed){
                arr = sort(arr);
                arr = distinct(arr);
                $.Storage.set('labStartFilterArray', MultDimArrToStr(arr));
                //console.info( arr );
                //alert(MultDimArrToStr(arr));
                //alert('saved');
                //console.log(arr);
            }
        }
    }

    // load jQuery and execute the main function
    addJQuery(main);
})(window);