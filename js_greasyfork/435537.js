// ==UserScript==
// @name        LNK_clanSort
// @author      NemoMan
// @namespace   LNK
// @description Сортировка списка клана
// @include     *heroeswm.ru/clan_info.php*
// @version     1.5
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/435537/LNK_clanSort.user.js
// @updateURL https://update.greasyfork.org/scripts/435537/LNK_clanSort.meta.js
// ==/UserScript==

(function() {
	'use strict';

 	var table, sortedRows, elems, paramTbl;
	var i, n, w;
    var iventCount = false;
    var numCol = 0;
    var iventCol = -1;
    var fracCol = -1;
    var abcCol = -1;
    var levelCol = -1;

    function compareIvent(rowA, rowB) {
        var a = rowA.cells[iventCol].innerHTML.replace(/ *\([^)]*\) */g, "").replace(/[^.\d]/g, "");
        var b = rowB.cells[iventCol].innerHTML.replace(/ *\([^)]*\) */g, "").replace(/[^.\d]/g, "");
        //rowB.cells[0].innerHTML = b;
        return b-a ;
    }
    
    function compareOrder(rowA, rowB) {
        var a = rowA.cells[numCol].innerHTML.replace(/[\D]+/g,'');
        var b = rowB.cells[numCol].innerHTML.replace(/[\D]+/g,'');
        return a-b ;
    }
    
    function compareLevel(rowA, rowB) {
        var a = rowA.cells[levelCol].innerHTML.replace(/[\D]+/g,'');
        var b = rowB.cells[levelCol].innerHTML.replace(/[\D]+/g,'');
        return a-b ;
    }
    
    function compareFrac(rowA, rowB) {
        var s = rowA.cells[fracCol].innerHTML;
        var n1 = s.indexOf('dcdn.');
        var a = s.slice(n1,s.indexOf('?',n1)).replace(/[\D]+/g,'');
        s = rowB.cells[fracCol].innerHTML;
        n1 = s.indexOf('dcdn.');
        var b = s.slice(n1,s.indexOf('?',n1)).replace(/[\D]+/g,'');
        return a-b ;
    }
    
    function compareAbc(rowA, rowB) {
        var s = rowA.cells[abcCol].innerHTML;
        var a = s.slice(s.indexOf('class="pi">')+11,s.indexOf('</a>')).toLowerCase();
        s = rowB.cells[abcCol].innerHTML;
        var b = s.slice(s.indexOf('class="pi">')+11,s.indexOf('</a>')).toLowerCase();
        if (a < b) { return -1; }
        else { return 1; }
    }
    
    function sortIvent() {
        if (iventCol < 0) {alert('Места в ивенте не определяются. Видимо, нет кланового ивента...'); return 0;}
        sortedRows = Array.from(table.rows).sort(compareIvent);
        table.tBodies[0].append(...sortedRows);
        elems = table.rows;
        if (!iventCount) {
            for (i = 0; i < elems.length; i++) {
                elems[i].cells[iventCol].innerHTML = elems[i].cells[n-1].innerHTML + ' (' + (i+1) + ')';
                elems[i].cells[iventCol].width = '100px';
            }
            iventCount = true;
        }
    }

    function sortOrder() {
        sortedRows = Array.from(table.rows).sort(compareOrder);
        table.tBodies[0].append(...sortedRows);
    }

    function sortLevel() {
        if (levelCol < 0) {alert('Уровни не определяются. Да ХЗ почему...'); return 0;}
        sortedRows = Array.from(table.rows).sort(compareLevel);
        table.tBodies[0].append(...sortedRows);
    }

    function sortFrac() {
        if (fracCol < 0) {alert('Фракции не определяются. Видимо, клан воюет...'); return 0;}
        sortedRows = Array.from(table.rows).sort(compareFrac);
        table.tBodies[0].append(...sortedRows);
    }

    function sortAbc() {
        if (abcCol < 0) {alert('Не вижу колонки с именами. Херня какая-то...'); return 0;}
        sortedRows = Array.from(table.rows).sort(compareAbc);
        table.tBodies[0].append(...sortedRows);
    }

    function sortInitial() {
        if (iventCol < 0) {return 0;}
        sortIvent();
        sortOrder();
    }

    function sortClan() {
        switch (document.getElementById('selSort').value) {
            case 'num': sortOrder(); break;
            case 'ivent': sortIvent(); break;    
            case 'frac': sortFrac(); break;    
            case 'abc': sortAbc(); break;    
            case 'level': sortLevel(); break;    
        }
    }

    if (location.href.indexOf('clan_info.php') != -1) { // страница инфы клана со списком
		var elements = document.querySelectorAll("table");
        for ( i = 0; i < elements.length; i++) {
            if (elements[i].rows.length > 99) {
                //alert(elements[i].rows.length);
                table = elements[i]; 
                n = table.rows[1].cells.length;
                break;
            }
        }
        for (i = 0; i < n; i++) {
            w = table.rows[1].cells[i].width;
            if (w == 15) {fracCol = 2;}
            if (w == 150) {abcCol = i;}
            if (w == 10) {levelCol = i;}
            if (!w) {if (i < (n-1)) {iventCol = i+1;}}
        }
        paramTbl = document.createElement('table');
		paramTbl.innerHTML =
			'<tbody> '+
				'<tr> '+
					//'<td align="left"> <input type="button" id="butSortOrder" value="Сортировать по порядку" /></td>'+
					//'<td align="right"> <input type="button" id="butSortIvent" value="Сортировать по очкам в ивенте" /></td>'+
                    `<td>Сортировать список клана: <select id="selSort">
                            <option value="num" selected>По порядку номеров</option>
                            <option value="ivent">По очкам в ивенте</option>
                            <option value="level">По уровню героя</option>
                            <option value="abc">По нику (имени) героя</option>
                            <option value="frac">По фракции героя</option>
                     </select></td>`+
				'</tr> '+
			'</tbody>';
		paramTbl.id="paramTbl";
		paramTbl.align="left";
		paramTbl.width="100%";
		paramTbl.style.borderCollapse = 'collapse';
		paramTbl.setAttribute('border',2);
		paramTbl.setAttribute('cellpadding',4);
		//document.body.append(paramTbl);
        table.before(paramTbl);
		document.getElementById('selSort').onchange = sortClan;
        sortInitial();
        
	}

 })();
