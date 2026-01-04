// ==UserScript==
// @name         ObjectPrice
// @namespace    Sweag
// @version      0.2
// @description  money from object
// @author       Sweag
// @match        http://www.heroeswm.ru/object-info.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40296/ObjectPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/40296/ObjectPrice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var str, ifrom, ito, start_index=0, arr_index;
    var COUNT_DAYS = 0, COUNT_CHEK = 0, SUM_ALL = 0, SPM_ALL = 0, UPDATE_TABLE = false, SHOW_DAY = false, SHOW_WEEK = false, SHOW_MONTH = false;
    var arr, arr_job;
    //Площадь: 13
    var  spm = document.getElementsByTagName('td');
    for(var j = 0; j < spm.length; j++)
    {
        if(spm[j].innerHTML.indexOf('Список рабочих (') > -1)
        {
            SPM_ALL = parseInt(spm[j].innerHTML.split('Список рабочих (')[1].split(')')[0]) + parseInt(spm[j].innerHTML.split('Свободных мест: ')[1].split('>')[1].split('</')[0]);
            j = spm.length;
        }
    }
    var  hrefs = document.getElementsByTagName('div');
    for(var i = 0; i < hrefs.length; i++)
    {
        if(hrefs[i].innerHTML.indexOf('Протокол') > -1)
        {
            var myform = document.createElement('div');
            myform.id = 'sform';
            str = "<br><table><tr><td><table><tr><td bgcolor='#6b6c6a' align='center' colspan='2'><font color='#ffd875'><b>Сумма прибыли с предприятия за период:</b></font></td></tr><tr><td><select name='period' id='selOption' style='width:220'><option value='0'>День</option><option value='1'>Неделя</option><option value='2'>Месяц</option></select></td>";
            //str += "<tr><td>По: </td><td><input type=text id=datto value='"+getCurrentDate()+"'></td></tr>";
            str += "<td colspan=2><center><input type=button value='Загрузить' id=startscan></center></td></tr>";
            str += "</table></td><td><input id='agree' type='checkbox'>Обновлять таблицу при выводе</td></tr></table></div>";
            myform.innerHTML = str;
            hrefs[i].parentNode.appendChild(myform);
            i = hrefs.length;
            document.getElementById('startscan').onclick = function(){prescaning();};
            document.getElementById('selOption').onchange = function(){change_option();};
            document.getElementById('agree').onclick = function(){change_check();};
        }
    }
    function change_check()
    {
        UPDATE_TABLE = !UPDATE_TABLE;
        if(UPDATE_TABLE){
            SHOW_DAY = false;
            SHOW_WEEK = false;
            SHOW_MONTH = false;
        }
    }
    function change_option()
    {
        document.getElementById('startscan').value = "Загрузить";
        document.getElementById('startscan').disabled=false;
    }
    function getCurTimestamp(str)
    {
        var t = str.split('&nbsp;&nbsp;')[1].split(' ')[0].split('-');
        var tm = str.split('&nbsp;&nbsp;')[1].split(' ')[1].split(':');
        var d = new Date("20" + t[2] + "-" + t[1] + "-" + t[0]);
        d.setHours(tm[0], tm[1]);
        return d;
    }
    function getCurrentDate()
    {
        var dt=new Date(); 	var month = dt.getMonth()+1; 	if (month<10) month='0'+month;	var day = dt.getDate(); 	if (day<10)  day='0'+day;	var year = dt.getFullYear();
        return day + "-" + month + "-" + (year + '')[2] + (year + '')[3];
    }
    function prescaning()
    {
        ito = new Date();
        ito.setDate(ito.getDate()-1);
        ito.setHours(23, 59);
        var dt=new Date(ito);
        COUNT_CHEK = 0;
        SUM_ALL = 0;
        start_index = 0;
        switch(document.getElementsByTagName('select')[0].value){
            case '0': //День
                dt.setDate(dt.getDate()-1);
                COUNT_DAYS = 1;
                if(SHOW_DAY){if(!UPDATE_TABLE)return;}
                SHOW_DAY = true;
                ifrom = dt;
                break;
            case '1': //Неделя
                dt.setDate(dt.getDate()-7);
                COUNT_DAYS = 7;
                if(SHOW_WEEK){if(!UPDATE_TABLE)return;}
                SHOW_WEEK = true;
                ifrom = dt;
                break;
            case '2': //Месяц
                dt.setMonth(dt.getMonth()-1);
                COUNT_DAYS = 30;
                if(SHOW_MONTH){if(!UPDATE_TABLE)return;}
                SHOW_MONTH = true;
                ifrom = dt;
        }
        scaning();
    }
    function listen()
    {
        if(arr_index > arr.length-2){
            document.getElementById('startscan').value = "Загружено: " + start_index;
            setTimeout(scaning,1000);
            return;
        }
        var cur = getCurTimestamp(arr[arr_index]);
        if(cur >= ifrom && cur <= ito){
            var s = arr[arr_index].split('// ');
            if(s[1]!==undefined){
                var ss = s[1].split(' - ');
                SUM_ALL += parseFloat(ss[0]) * parseFloat(ss[1]);
                if(!arr_index){
                    COUNT_CHEK += parseInt(s[0].split('(')[1].split(')')[0]);
                }else {
                    COUNT_CHEK += parseInt(s[0].split('(')[2].split(')')[0]);
                }
                arr_index++;
                listen();
			}else{
                arr_index++;
                listen();
            }
        }
	else if(cur < ifrom){
		document.getElementById('startscan').value = "Готово";
        document.getElementById('startscan').disabled=true;
        draw();
	}else{
        arr_index++;
        listen();
    }
}

    function scaning()
    {
        var st=document.location.href;
        var xhr = new XMLHttpRequest();
        var uri = st.replace('object-info', 'objectworkers')+"&page="+start_index;
        start_index++;
        arr_index = 0;
        xhr.open("GET", uri, true);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                var text = xhr.responseText;
                text = text.split('<!-- big table -->')[1];
                text = text.split('&gt;</a></center><nobr>')[1];
                text = text.split('<!--</td></tr></table>-->')[0];
                arr = text.split('<!--');
                listen();
            }
        };
    }
    function draw()
    {
        var S = document.getElementById('sform');
        var tt;
        if(UPDATE_TABLE){
            for(var k=0; k<3; k++){
                tt = document.getElementById('WorkTable');
                if(tt!==null){S.removeChild(tt);}
            }
        }
        var t = document.createElement('table');
        t.id = 'WorkTable';
        t.setAttribute("class", "wb");
        t.setAttribute("width", "100%");
        t.setAttribute("align", "center");
        t.setAttribute("cellpadding", "4");
        switch (COUNT_DAYS){
            case 1:
                if(UPDATE_TABLE){
                    SHOW_WEEK = false;
                    SHOW_MONTH = false;
                }
                t.innerHTML = '<tr><td class="wbwhite" align="center" colspan="4">Статистика предприятия за предыдущие сутки</td></tr>';
                t.innerHTML += '<tr><td class="wblight">Баланс</td><td class="wblight">Загрузка, %</td><td class="wblight">Прибыль клана</td><td class="wblight">Прибыль клана (квартал)</td></tr>';
                t.innerHTML += '<tr><td class="wblight" align="center">' + parseInt(SUM_ALL) + '</td><td class="wblight" align="center">' + parseInt(100*COUNT_CHEK/(COUNT_DAYS*24*SPM_ALL)) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.03) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.05) + '</td></tr>';
                break;
            case 7:
                if(UPDATE_TABLE){
                    SHOW_DAY = false;
                    SHOW_MONTH = false;
                }
                t.innerHTML = '<tr><td class="wbwhite" align="center" colspan="5">Статистика предприятия за предыдущую неделю</td></tr>';
                t.innerHTML += '<tr><td class="wblight">Баланс</td><td class="wblight">Загрузка, %</td><td class="wblight">В среднем за день</td><td class="wblight">Прибыль клана</td><td class="wblight">Прибыль клана (квартал)</td></tr>';
                t.innerHTML += '<tr><td class="wblight" align="center">' + parseInt(SUM_ALL) + '</td><td class="wblight" align="center">' + parseInt(100*COUNT_CHEK/(COUNT_DAYS*24*SPM_ALL)) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL/COUNT_DAYS) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.03) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.05) + '</td></tr>';
                break;
            case 30:
                if(UPDATE_TABLE){
                    SHOW_WEEK = false;
                    SHOW_DAY = false;
                }
                t.innerHTML = '<tr><td class="wbwhite" align="center" colspan="6">Статистика предприятия за предыдущий месяц</td></tr>';
                t.innerHTML += '<tr><td class="wblight">Баланс</td><td class="wblight">Загрузка, %</td><td class="wblight">В среднем за неделю</td><td class="wblight">В среднем за день</td><td class="wblight">Прибыль клана</td><td class="wblight">Прибыль клана (квартал)</td></tr>';
                t.innerHTML += '<tr><td class="wblight" align="center">' + parseInt(SUM_ALL) + '</td><td class="wblight" align="center">' + parseInt(100*COUNT_CHEK/(COUNT_DAYS*24*SPM_ALL)) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL/4) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL/COUNT_DAYS) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.03) + '</td><td class="wblight" align="center">' + parseInt(SUM_ALL*0.05) + '</td></tr>';
        }
        S.appendChild(t);
    }
})();