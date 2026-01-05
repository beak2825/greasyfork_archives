// ==UserScript==
// @name         CountLot
// @namespace    auction
// @version      2.5.1
// @description  Count clan's lot
// @author       Sweag
// @include      https://www.heroeswm.ru/auction.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25342/CountLot.user.js
// @updateURL https://update.greasyfork.org/scripts/25342/CountLot.meta.js
// ==/UserScript==

var ID_CLAN = 997;
var mas = [6], mas_heroes, mas_pp, mas_object_limit;
var mas_lim = [6], mas_title = [6];
var table;
var hrefs, index_href;
var index = 1, flag = 0;
var QUOT_WOOD = 10, QUOT_ORE = 10, QUOT_MERCURY = 5,  QUOT_SULPHURE = 12, QUOT_CRYSTAL = 10, QUOT_GEM = 20;

(function() {
    'use strict';

    hrefs = document.getElementsByTagName('td');
    var a = document.getElementsByTagName('a');
    var i, j, n;
    mas_init();
    for(i=0; i<a.length; i++){
        if(a[i].href.indexOf("?cat=res") > -1){
            if(a[i].innerHTML.indexOf("Ресурсы") > -1)table = a[i].parentNode.parentNode.childNodes;
        }
    }
    for(j=0; j<6; j++){mas[j]=0;}
    for(i=0; i<hrefs.length; i++){
        n = hrefs[i].innerHTML.indexOf('Ресурсы');
        if(n > -1){
            if(flag==0){flag = 1; continue;}
            var t=0, m;
            index_href = i;
            var s = hrefs[i].innerHTML;
            var s0 = s.slice(0, s.indexOf('<br>', n));
            m = s.indexOf('Самоцветы', n);
            var s1 = s.slice(s.indexOf('<br>', m));
            var ss = s0 + '<table><tr><td><div id="div_clan">Клан лоты:</div></td><td><input type=button value="Загрузить" id=startscan style="width:100"></td></tr></table><BR><div><table  id=table_res><tr>';
            ss += '<td>ресы</td>';
            for(j=0; j<6; j++){
                t=j+1;
                ss += '<td><a href="/auction.php?cat=res&amp;sort=0&amp;type=' + t + '">' + table[0].childNodes[j+2].innerHTML + '</a></td>';
            }
            ss += '</tr><tr>';
            ss += '<td>лимит</td>';
            for(j=0; j<6; j++){
                ss += '<td align=center></td>';
            }
            ss += '</tr><tr>';
            ss += '<td>лотов</td>';
            for(j=0; j<6; j++){
                ss += '<td align=center></td>';
            }
            ss += '</tr></table></div>' + s1;
            hrefs[i].innerHTML = ss;
            flag = 0;
        }
    }
    document.getElementById("startscan").disabled=true;
    init_select();
})();

function init_select()
{
    for(var i=0; i<hrefs.length; i++){
        if(hrefs[i].innerHTML.indexOf('Категории') > -1){
            if(flag==0){flag = 1; continue;}
            var pp = hrefs[i].innerHTML.split('Категории');
            var s0 = pp[0] + 'Категории <select id="select_clan" style="width:135"><option value="0">Выберите..</option>';
            s0 += '<option value="468">#468 Орден Равновесия</option>';
            s0 += '<option value="997">#997 Солдаты удачи</option>';
            s0 += '<option value="15">#15 Destiny</option>';
            s0 += '<option value="5604">#5604 Artefactum</option>';
            s0 += '</select>'+ pp[1];
            hrefs[i].innerHTML = s0;
            flag = 0;
            }
        }
      document.getElementById("select_clan").onchange = function(){select_change();};
}

function mas_init()
{
    mas_object_limit = [];
    mas_object_limit[0] = {id: "126", mest: "100", type: "древесина", dopq: "2"}; mas_object_limit[1] = {id: "233", mest: "80", type: "древесина", dopq: "2"}; mas_object_limit[2] = {id: "13", mest: "80", type: "древесина", dopq: "0"};
    mas_object_limit[3] = {id: "26", mest: "85", type: "древесина", dopq: "0"}; mas_object_limit[4] = {id: "73", mest: "95", type: "древесина", dopq: "0"}; mas_object_limit[5] = {id: "74", mest: "90", type: "древесина", dopq: "1"};
    mas_object_limit[6] = {id: "166", mest: "50", type: "древесина", dopq: "2"}; mas_object_limit[7] = {id: "176", mest: "25", type: "древесина", dopq: "2"}; mas_object_limit[8] = {id: "178", mest: "30", type: "древесина", dopq: "1"};
    mas_object_limit[9] = {id: "179", mest: "30", type: "древесина", dopq: "2"}; mas_object_limit[10] = {id: "227", mest: "70", type: "древесина", dopq: "1"}; mas_object_limit[11] = {id: "228", mest: "80", type: "древесина", dopq: "1"};
    mas_object_limit[12] = {id: "241", mest: "110", type: "древесина", dopq: "0"}; mas_object_limit[13] = {id: "252", mest: "100", type: "древесина", dopq: "2"}; mas_object_limit[14] = {id: "259", mest: "90", type: "древесина", dopq: "0"};
    mas_object_limit[15] = {id: "283", mest: "90", type: "древесина", dopq: "0"}; mas_object_limit[16] = {id: "286", mest: "70", type: "древесина", dopq: "1"}; mas_object_limit[17] = {id: "300", mest: "85", type: "древесина", dopq: "0"};
    mas_object_limit[18] = {id: "304", mest: "85", type: "древесина", dopq: "0"}; mas_object_limit[19] = {id: "305", mest: "45", type: "древесина", dopq: "1"}; mas_object_limit[20] = {id: "310", mest: "50", type: "древесина", dopq: "0"};
    mas_object_limit[21] = {id: "311", mest: "65", type: "древесина", dopq: "1"}; mas_object_limit[22] = {id: "312", mest: "95", type: "древесина", dopq: "1"}; mas_object_limit[23] = {id: "322", mest: "80", type: "древесина", dopq: "0"};
    mas_object_limit[24] = {id: "324", mest: "70", type: "древесина", dopq: "0"}; mas_object_limit[25] = {id: "330", mest: "20", type: "древесина", dopq: "0"}; mas_object_limit[26] = {id: "358", mest: "65", type: "древесина", dopq: "2"};
    mas_object_limit[27] = {id: "362", mest: "20", type: "древесина", dopq: "2"};
    
    mas_object_limit[28] = {id: "221", mest: "80", type: "руда", dopq: "2"}; mas_object_limit[29] = {id: "335", mest: "70", type: "руда", dopq: "2"}; mas_object_limit[30] = {id: "50", mest: "85", type: "руда", dopq: "0"};
    mas_object_limit[31] = {id: "56", mest: "85", type: "руда", dopq: "1"}; mas_object_limit[32] = {id: "75", mest: "110", type: "руда", dopq: "0"}; mas_object_limit[33] = {id: "95", mest: "85", type: "руда", dopq: "1"};
    mas_object_limit[34] = {id: "128", mest: "90", type: "руда", dopq: "2"}; mas_object_limit[35] = {id: "177", mest: "25", type: "руда", dopq: "2"}; mas_object_limit[36] = {id: "219", mest: "65", type: "руда", dopq: "0"};
    mas_object_limit[37] = {id: "223", mest: "20", type: "руда", dopq: "2"}; mas_object_limit[38] = {id: "224", mest: "115", type: "руда", dopq: "0"}; mas_object_limit[39] = {id: "235", mest: "105", type: "руда", dopq: "2"};
    mas_object_limit[40] = {id: "236", mest: "20", type: "руда", dopq: "2"}; mas_object_limit[41] = {id: "237", mest: "20", type: "руда", dopq: "2"}; mas_object_limit[42] = {id: "238", mest: "85", type: "руда", dopq: "0"};
    mas_object_limit[43] = {id: "239", mest: "85", type: "руда", dopq: "0"}; mas_object_limit[44] = {id: "243", mest: "80", type: "руда", dopq: "0"}; mas_object_limit[45] = {id: "250", mest: "100", type: "руда", dopq: "1"};
    mas_object_limit[46] = {id: "256", mest: "20", type: "руда", dopq: "2"}; mas_object_limit[47] = {id: "262", mest: "100", type: "руда", dopq: "0"}; mas_object_limit[48] = {id: "266", mest: "80", type: "руда", dopq: "1"};
    mas_object_limit[49] = {id: "270", mest: "75", type: "руда", dopq: "1"}; mas_object_limit[50] = {id: "274", mest: "100", type: "руда", dopq: "2"}; mas_object_limit[51] = {id: "279", mest: "85", type: "руда", dopq: "0"};
    mas_object_limit[52] = {id: "282", mest: "95", type: "руда", dopq: "0"}; mas_object_limit[53] = {id: "290", mest: "70", type: "руда", dopq: "1"}; mas_object_limit[54] = {id: "302", mest: "90", type: "руда", dopq: "0"};
    mas_object_limit[55] = {id: "307", mest: "70", type: "руда", dopq: "1"}; mas_object_limit[56] = {id: "313", mest: "60", type: "руда", dopq: "1"}; mas_object_limit[57] = {id: "319", mest: "20", type: "руда", dopq: "2"};
    mas_object_limit[58] = {id: "321", mest: "80", type: "руда", dopq: "0"}; mas_object_limit[59] = {id: "341", mest: "21", type: "руда", dopq: "2"}; mas_object_limit[60] = {id: "346", mest: "70", type: "руда", dopq: "0"};
    mas_object_limit[61] = {id: "359", mest: "20", type: "руда", dopq: "2"}; mas_object_limit[62] = {id: "20", mest: "80", type: "руда", dopq: ""};
    
    mas_object_limit[75] = {id: "251", mest: "60", type: "ртуть", dopq: "0"}; mas_object_limit[63] = {id: "43", mest: "75", type: "ртуть", dopq: "0"}; mas_object_limit[64] = {id: "184", mest: "30", type: "ртуть", dopq: "0"};
    mas_object_limit[65] = {id: "220", mest: "65", type: "ртуть", dopq: "0"}; mas_object_limit[66] = {id: "226", mest: "75", type: "ртуть", dopq: "0"}; mas_object_limit[67] = {id: "244", mest: "70", type: "ртуть", dopq: "0"};
    mas_object_limit[68] = {id: "247", mest: "65", type: "ртуть", dopq: "0"}; mas_object_limit[69] = {id: "249", mest: "75", type: "ртуть", dopq: "0"}; mas_object_limit[70] = {id: "265", mest: "70", type: "ртуть", dopq: "0"};
    mas_object_limit[71] = {id: "301", mest: "30", type: "ртуть", dopq: "0"}; mas_object_limit[72] = {id: "303", mest: "75", type: "ртуть", dopq: "0"}; mas_object_limit[73] = {id: "328", mest: "65", type: "ртуть", dopq: "0"};
    mas_object_limit[74] = {id: "258", mest: "75", type: "ртуть", dopq: "0"};
    
    mas_object_limit[82] = {id: "19", mest: "85", type: "сера", dopq: "0"}; mas_object_limit[83] = {id: "49", mest: "110", type: "сера", dopq: "0"}; mas_object_limit[76] = {id: "59", mest: "85", type: "сера", dopq: "0"};
    mas_object_limit[77] = {id: "94", mest: "85", type: "сера", dopq: "0"}; mas_object_limit[78] = {id: "104", mest: "75", type: "сера", dopq: "0"}; mas_object_limit[79] = {id: "122", mest: "65", type: "сера", dopq: "0"};
    mas_object_limit[80] = {id: "315", mest: "80", type: "сера", dopq: "0"}; mas_object_limit[81] = {id: "331", mest: "50", type: "сера", dopq: "0"};
    
    mas_object_limit[96] = {id: "16", mest: "65", type: "кристаллы", dopq: "0"}; mas_object_limit[97] = {id: "44", mest: "70", type: "кристаллы", dopq: "0"}; mas_object_limit[84] = {id: "92", mest: "80", type: "кристаллы", dopq: "0"};
    mas_object_limit[85] = {id: "124", mest: "100", type: "кристаллы", dopq: "0"}; mas_object_limit[86] = {id: "133", mest: "35", type: "кристаллы", dopq: "0"}; mas_object_limit[87] = {id: "245", mest: "80", type: "кристаллы", dopq: "0"};
    mas_object_limit[88] = {id: "257", mest: "20", type: "кристаллы", dopq: "0"}; mas_object_limit[89] = {id: "260", mest: "100", type: "кристаллы", dopq: "0"}; mas_object_limit[90] = {id: "269", mest: "75", type: "кристаллы", dopq: "0"};
    mas_object_limit[91] = {id: "273", mest: "90", type: "кристаллы", dopq: "0"}; mas_object_limit[92] = {id: "281", mest: "95", type: "кристаллы", dopq: "0"}; mas_object_limit[93] = {id: "318", mest: "20", type: "кристаллы", dopq: "0"};
    mas_object_limit[94] = {id: "334", mest: "60", type: "кристаллы", dopq: "0"}; mas_object_limit[95] = {id: "340", mest: "20", type: "кристаллы", dopq: "0"};
    
    mas_object_limit[108] = {id: "272", mest: "80", type: "самоцветы", dopq: "0"}; mas_object_limit[109] = {id: "15", mest: "70", type: "самоцветы", dopq: "0"}; mas_object_limit[98] = {id: "344", mest: "75", type: "самоцветы", dopq: "0"};
    mas_object_limit[99] = {id: "93", mest: "85", type: "самоцветы", dopq: "0"}; mas_object_limit[100] = {id: "125", mest: "65", type: "самоцветы", dopq: "0"}; mas_object_limit[101] = {id: "129", mest: "95", type: "самоцветы", dopq: "0"};
    mas_object_limit[102] = {id: "131", mest: "95", type: "самоцветы", dopq: "0"}; mas_object_limit[103] = {id: "186", mest: "40", type: "самоцветы", dopq: "0"}; mas_object_limit[104] = {id: "253", mest: "105", type: "самоцветы", dopq: "0"};
    mas_object_limit[105] = {id: "285", mest: "125", type: "самоцветы", dopq: "0"}; mas_object_limit[106] = {id: "289", mest: "60", type: "самоцветы", dopq: "0"}; mas_object_limit[107] = {id: "309", mest: "20", type: "самоцветы", dopq: "0"};
    mas_object_limit[110] = {id: "326", mest: "45", type: "самоцветы", dopq: "0"};
}

function select_change()
{
    hrefs = document.getElementsByTagName('td');
    var s1 = hrefs[index_href].innerHTML.split('Ресурсы');
    var s2 = s1[1].split(ID_CLAN);
    var selectedn = document.getElementById("select_clan");
    var title_clan = selectedn.options[selectedn.options.selectedIndex].text;
    ID_CLAN = document.getElementById("select_clan").options[document.getElementById("select_clan").selectedIndex].value;
    document.getElementById("div_clan").innerHTML = '<a href="clan_info.php?id=' + ID_CLAN + '"><img src="http://dcdn.heroeswm.ru/i_clans/l_' + ID_CLAN + '.gif?v=55" width="20" height="15" border="0" title="' + title_clan + '" align="absmiddle"></a>Клан лоты:';
    document.getElementById("startscan").disabled=false;
    document.getElementById("startscan").onclick = function(){scan();};
}
function paint()
{
    var i, j;
    var lim = document.getElementById('table_res').childNodes[0].childNodes[1].childNodes;
    var lot = document.getElementById('table_res').childNodes[0].childNodes[2].childNodes;
    for(j=0; j<6; j++) mas_lim[j]=0;
    if(mas_pp.length>1){
        for(i=1; i<mas_pp.length; i++){
            for(j=0; j<mas_object_limit.length; j++){
                if(parseInt(mas_pp[i])==parseInt(mas_object_limit[j].id)){
                    switch(mas_object_limit[j].type){
                        case "древесина":
                            mas_lim[0] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_WOOD) + parseInt(mas_object_limit[j].dopq);
                            break;
                        case "руда":
                            mas_lim[1] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_ORE) + parseInt(mas_object_limit[j].dopq);
                            break;
                        case "ртуть":
                            mas_lim[2] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_MERCURY) + parseInt(mas_object_limit[j].dopq);
                            break;
                        case "сера":
                            mas_lim[3] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_SULPHURE) + parseInt(mas_object_limit[j].dopq);
                            break;
                        case "кристаллы":
                            mas_lim[4] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_CRYSTAL) + parseInt(mas_object_limit[j].dopq);
                            break;
                        case "самоцветы":
                            mas_lim[5] += Math.round(parseInt(mas_object_limit[j].mest)/QUOT_GEM) + parseInt(mas_object_limit[j].dopq);
                            break;
                    }
                    break;
                }
            }
        }
    }
    for(i=1; i<7; i++){
        lim[i].innerHTML = mas_lim[i-1];
        lot[i].innerHTML = mas[i-1];
        lot[i].setAttribute("title", mas_title[i-1]);
        if(mas[i-1]>mas_lim[i-1])lot[i].setAttribute("style", "color:red;"); else lot[i].setAttribute("style", "color:blue;");
    }
}

function scan()
{
    var text, mas_text, i;
	var xhr = new XMLHttpRequest();
	var uri = "https://www.heroeswm.ru/clan_info.php?id="+ID_CLAN;
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			text = xhr.responseText;
            var heroes_text = text.slice(text.indexOf('http://dcdn.heroeswm.ru/i/clans/'));
			mas_text = heroes_text.split('pl_info.php?id=');
			text = text.split('Подсекторов под контролем')[1].split('</table>')[0];
            mas_pp = text.split('#');
            if(mas_pp.length>1){
                for(i=1; i<mas_pp.length-1; i++){
                    mas_pp[i] = mas_pp[i].split(' ')[0];
                }
            }
            mas_heroes = [];
			for(i=1; i<mas_text.length; i++){
				mas_heroes[i-1] = parseInt(mas_text[i].split("class=pi>")[0]);
			}
            scan_res();
		}
	};
}

function scan_res()
{
	if(index>6){
        document.getElementById("startscan").value = "Загрузить";
        index = 1;
		paint();
		return;
	}
	var ans = new XMLHttpRequest();
	var uri = "https://www.heroeswm.ru/auction.php?cat=res&sort=0&type=" + index;
	var text, mas_text, id;
	ans.open("GET", uri, true);
	ans.overrideMimeType('text/html; charset=windows-1251');
    ans.send();
	ans.onreadystatechange = function() {
		if (ans.readyState != 4) return;
		if (ans.status == 200) {
            document.getElementById("startscan").value = "Загружено:" + index;
			text = ans.responseText;
			text = text.split('<!-- big table -->')[1].split('Ставки')[1];
            mas_text = text.split('pl_info.php?id=');
			mas[index-1] = 0;
            mas_title[index-1] = "";
			for(var i=1; i<mas_text.length; i++){
				id = parseInt(mas_text[i].split('>')[0]);
				for(j=0; j<mas_heroes.length; j++){
					if(mas_heroes[j] == id){
						mas[index-1]++;
                        mas_title[index-1] += mas_text[i].split('<b>')[1].split('</b>')[0] + "\n";
						break;
					}
				}
			}
			index++;
			scan_res();
		}
	};
}