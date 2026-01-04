// ==UserScript==
// @name ClanFilter
// @author Demin, LazyGreg
// @namespace clan
// @version 1.52.1
// @description Сортировка состава клана.
// homepage https://greasyfork.org/ru/scripts/8811

// @include *://*heroeswm.ru/clan_info.php*
// @include *://*lordswm.com/clan_info.php*

// @encoding utf-8
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461893/ClanFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/461893/ClanFilter.meta.js
// ==/UserScript==
(function() {
	if (typeof GM_getValue != 'function') {
		this.GM_getValue=function (key,def) {return localStorage[key] || def;};
		this.GM_setValue=function (key,value) {return localStorage[key]=value;};
		this.GM_deleteValue=function (key) {return delete localStorage[key];};
	}

	var temp = document.querySelectorAll("body > center");
	clan_table = temp[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1];

	var clanRowsNodes_arr = clan_table.childNodes[0].childNodes; //- 殢
//alert(clan_table.childNodes[0].childNodes[0].childElementCount);

	var ivent_column = false;
	if (clan_table.childNodes[0].childNodes[0].childElementCount == 6) ivent_column = true; //   㬠
	var tuman = false;
	if (clan_table.childNodes[0].childNodes[0].childElementCount == 4) tuman = true; // 㬠

	if (clan_table.childNodes[0].childNodes[0].childElementCount == 5) {//(  㬠 )  (    㬠)
		var pict_fr = clan_table.childNodes[0].childNodes[0].querySelectorAll("img[src*='i/f/r']"); //饬 ⨭e ࠪ権  1 ப
		if (pict_fr.length == 0) {
			ivent_column = true;
			tuman = true;
		}
	}
//alert('tuman: '+tuman+'  Ivent: '+ivent_column);

// tech: 1-bk,  3-name, 5 fract
// batl: 1-name, 3 fract
	var sortTable_div = clan_table.cloneNode(false);
	sortTable_div.innerHTML = "temp text, should not be seen";
	clan_table.parentNode.insertBefore(sortTable_div, clan_table);

// sorting flags
	var doSort1 = false;
	var doSort2 = false; // status
	var doSort_bk = false; // bk
	var doSort_fr = false; // fraction
	var doSort3 = false; // name
	var doSort4 = false; // level
	var doSort5 = false; // descr
	var doSort6 = false; // ivent

	var isBattleClan = ( clan_table.innerHTML.indexOf("clan_info.php")==-1 );

	addSortTable();
// bk name fract descr Lv
// \u0411\u041A \u0418\u043C\u044F \u0424\u0440\u0430\u043A\u0446\u0438\u044F \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u041B\u0432
	function addSortTable(){
		//var link_sort1 = '<a href="javascript:void(0);" id="clanTblSort1" style="background:'+(doSort1?"#6c6":"none")+';">[#]</a>';
		var link_sort1 = '#';
		var link_sort2 = '<a href="javascript:void(0);" id="clanTblSort2" style="background:'+(doSort2?"#6c6":"none")+';">C</a>';
		var link_sort_bk = '<a href="javascript:void(0);" id="clanTblSort_bk" style="background:'+(doSort_bk?"#6c6":"none")+';">[\u0411\u041A]</a>&nbsp;&nbsp;';
		link_sort_bk = isBattleClan? "" : link_sort_bk;
		var link_sort3 = '<a href="javascript:void(0);" id="clanTblSort3" style="background:'+(doSort3?"#6c6":"none")+';">[\u0418\u043C\u044F]</a>';
		var link_sort_fr = '&nbsp;&nbsp;<a href="javascript:void(0);" id="clanTblSort_fr" style="background:'+(doSort_fr?"#6c6":"none")+';">[\u0424\u0440\u0430\u043A\u0446]</a>';
		var link_sort4 = '<a href="javascript:void(0);" id="clanTblSort4" style="background:'+(doSort4?"#6c6":"none")+';">\u041B\u0432</a>';
		var link_sort5 = '<a href="javascript:void(0);" id="clanTblSort5" style="background:'+(doSort5?"#6c6":"none")+';">[\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435]</a>';
		var link_sort6 = '<a href="javascript:void(0);" id="clanTblSort6" style="background:'+(doSort6?"#6c6":"none")+';">Ивент</a>';

		var sortHeaders = '<tr>'+
			'<td class=wblight width=30><b>'+ link_sort1 +'</b></td>';
		if (!tuman) {
			sortHeaders += 	'<td class=wblight width=15><b>'+ link_sort2 +'</b></td>'+
				'<td class=wblight width=150><b>'+ link_sort_bk+ link_sort3 +link_sort_fr +'</b></td>'+
				'<td class=wblight width=10><b>'+ link_sort4 +'</b></td>'+
				'<td class=wblight><b>'+ link_sort5 +'</b></td>';
		} else {
			sortHeaders +=
				'<td class=wblight width=150><b>'+ link_sort_bk+ link_sort3 +'</b></td>'+
				'<td class=wblight width=10><b>'+ link_sort4 +'</b></td>'+
				'<td class=wblight><b>'+ link_sort5 +'</b></td>';
		};
		if (ivent_column) sortHeaders +='<td class=wblight width=45><b>'+ link_sort6 +'</b></td>';
		sortHeaders +='</tr>';

		var sortedRows = getSortedRows();

		sortTable_div.innerHTML = '<table class=wb width="80%" cellpadding=3 align=center>'+ sortHeaders +sortedRows+ '</table>';
		//sortTable_div.innerHTML += "<hr width='50%'>";
		// add listeners
		// document.getElementById('clanTblSort1').addEventListener( "click", clanTblSort1 , false );
		if(!tuman){
			document.getElementById('clanTblSort2').addEventListener( "click", clanTblSort2 , false );
			document.getElementById('clanTblSort_fr').addEventListener( "click", clanTblSort_fr , false );
		}
		if(!isBattleClan){
			document.getElementById('clanTblSort_bk').addEventListener( "click", clanTblSort_bk , false );
		}
		document.getElementById('clanTblSort3').addEventListener( "click", clanTblSort3 , false );
		document.getElementById('clanTblSort4').addEventListener( "click", clanTblSort4 , false );
		document.getElementById('clanTblSort5').addEventListener( "click", clanTblSort5 , false );
		if (ivent_column) document.getElementById('clanTblSort6').addEventListener( "click", clanTblSort6 , false );

		if (!doSort1 && !doSort2 && !doSort3 && !doSort_bk && !doSort_fr && !doSort4 && !doSort5 && !doSort6) {  // NO filters
			clan_table.style.display = "";
		}else{
			// hide default table
			clan_table.style.display = "none";
		}
	}

	function  getSortedRows(){
		//var rows_str = clanRows_arr[0].innerHTML ;
		var rows_str = "" ;
		if (!doSort1 && !doSort2 && !doSort3 && !doSort_bk && !doSort_fr && !doSort4 && !doSort5 && !doSort6) { return rows_str; } // NO filters
		var clanRowsStr_arr = [];
		for(var i=0; i<clanRowsNodes_arr.length; i++){
			clanRowsStr_arr.push( [i, clanRowsNodes_arr[i].innerHTML] );
		}

		//clanRowsStr_arr.reverse();
		clanRowsStr_arr.sort(mySort4Clan);
		for (i=0; i<clanRowsStr_arr.length; i++){
			rows_str += "<tr>" +clanRowsStr_arr[i][1] +"</tr>";
		}

		return rows_str;
	}

	function  mySort4Clan(a,b){
		var ax, bx;
		var tn,nn,n_str,tum;
		var res = 0;
		// sort according to priority... from less to max
		// 1st - sort by num...
		ax = Number(clanRowsNodes_arr[a[0]].childNodes[0].innerHTML);
		bx = Number(clanRowsNodes_arr[b[0]].childNodes[0].innerHTML);
		res = (ax<bx)? -1 :(ax>bx)? 1 : 0;

		if(doSort5){ //descr
			tum= tuman? 3: 4;
			ax = clanRowsNodes_arr[a[0]].childNodes[tum].innerHTML;
			bx = clanRowsNodes_arr[b[0]].childNodes[tum].innerHTML;
			if(ax=="&nbsp;&nbsp;" && bx!="&nbsp;&nbsp;"){
				res = 1;
			}else if(ax!="&nbsp;&nbsp;" && bx=="&nbsp;&nbsp;"){
				res = -1;
			}else{
				res = (ax<bx)? -1 :(ax>bx)? 1 : res;
			}
		}

		if(doSort_bk && !isBattleClan){ //BK
			ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[1].innerHTML;
			bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[1].innerHTML;
			res = (ax<bx)? -1 :(ax>bx)? 1 : res;
		}

		if(doSort_fr ){ // fract
			tn = isBattleClan? 3: 5;
			if(isBattleClan || clanRowsNodes_arr[a[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
				ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[tn].title;
			}else{
				ax = clanRowsNodes_arr[a[0]].childNodes[2].childNodes[3].title;
			}
			if(isBattleClan || clanRowsNodes_arr[b[0]].childNodes[2].innerHTML.indexOf("clan_info.php")!=-1){
				bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[tn].title;
			}else{
				bx = clanRowsNodes_arr[b[0]].childNodes[2].childNodes[3].title;
			}
			res = (ax<bx)? -1 :(ax>bx)? 1 : res;
		}

		if(doSort3 ){ //name
			tn = isBattleClan? 1: 3;
			tum= tuman? 1: 2; //᫨ 㬠,    1 ⮫,   2-.
			if(isBattleClan || clanRowsNodes_arr[a[0]].childNodes[tum].innerHTML.indexOf("clan_info.php")!=-1){
				ax = clanRowsNodes_arr[a[0]].childNodes[tum].childNodes[tn].innerHTML.toLowerCase();
			}else{
				ax = clanRowsNodes_arr[a[0]].childNodes[tum].childNodes[1].innerHTML.toLowerCase();
			}
			if(isBattleClan || clanRowsNodes_arr[b[0]].childNodes[tum].innerHTML.indexOf("clan_info.php")!=-1){
				bx = clanRowsNodes_arr[b[0]].childNodes[tum].childNodes[tn].innerHTML.toLowerCase();
			}else{
				bx = clanRowsNodes_arr[b[0]].childNodes[tum].childNodes[1].innerHTML.toLowerCase();
			}
			res = (ax<bx)? -1 :(ax>bx)? 1 : res;
		}
		//
		if(doSort4 ){ //level descending
			tum= tuman? 2: 3; //᫨ 㬠,  ஢  2 ⮫,   3-.
			ax = Number(clanRowsNodes_arr[a[0]].childNodes[tum].innerHTML);
			bx = Number(clanRowsNodes_arr[b[0]].childNodes[tum].innerHTML);
			res = (ax<bx)? 1 :(ax>bx)? -1 : res;
		}
		//
		if(doSort2 ){ //status
			ax = clanRowsNodes_arr[a[0]].childNodes[1].innerHTML;
			bx = clanRowsNodes_arr[b[0]].childNodes[1].innerHTML;
			if(ax.indexOf("i/clans/offline.gif")==-1 && bx.indexOf("i/clans/offline.gif")!=-1 ){
				res = -1;
			}else if(ax.indexOf("i/clans/offline.gif")!=-1 && bx.indexOf("i/clans/offline.gif")==-1 ){
				res = 1;
			}else { res = (ax<bx)? -1 :(ax>bx)? 1 : res; }
		}
		//
		if (doSort6 ){ //ivent

//			ax = clanRowsNodes_arr[a[0]].childNodes[2].children[0].innerHTML;
//			bx = clanRowsNodes_arr[b[0]].childNodes[2].children[0].innerHTML;
//console.warn(ax+':'+clanRowsNodes_arr[a[0]].childNodes[5].childElementCount+'   '+bx+':'+clanRowsNodes_arr[a[0]].childNodes[5].childElementCount+' - '+clanRowsNodes_arr[a[0]].childNodes[5].tagName);
			tum= tuman? 4: 5; //᫨ 㬠,  窨   4 ⮫,   5-.
			if (clanRowsNodes_arr[a[0]].childNodes[tum].childElementCount == 0) {
				ax = 0;
			} else {
				if (clanRowsNodes_arr[a[0]].childNodes[tum].children[0].childElementCount != 0) {
					nn = clanRowsNodes_arr[a[0]].childNodes[tum].children[0].children[0].innerHTML.split(',');
				} else {
					nn = clanRowsNodes_arr[a[0]].childNodes[tum].children[0].innerHTML.split(',');
				}
				n_str='';
				for (var ii = 0; ii<nn.length; ii++) n_str +=nn[ii];
				ax = +n_str;
			}
			if (clanRowsNodes_arr[b[0]].childNodes[tum].childElementCount == 0) {
				bx = 0;
			} else {
				if (clanRowsNodes_arr[b[0]].childNodes[tum].children[0].childElementCount != 0) {
					nn = clanRowsNodes_arr[b[0]].childNodes[tum].children[0].children[0].innerHTML.split(',');
				} else {
					nn = clanRowsNodes_arr[b[0]].childNodes[tum].children[0].innerHTML.split(',');
				}
//			nn = clanRowsNodes_arr[b[0]].childNodes[tum].children[0].innerHTML.split(',');
				n_str='';
				for (ii = 0; ii<nn.length; ii++) n_str +=nn[ii];
				bx = +n_str;
			}
//console.warn('ax:'+ax+'  bx:'+bx);
			res = (ax<bx)? 1 :(ax>bx)? -1 : res;
		}
		return res;
	}

// listeners
	function  clanTblSort1(){ doSort1 = !doSort1;	addSortTable();	}
	function  clanTblSort2(){ doSort2 = !doSort2;	addSortTable();	}
	function  clanTblSort_bk(){ doSort_bk = !doSort_bk;	addSortTable();	}
	function  clanTblSort_fr(){ doSort_fr = !doSort_fr;	addSortTable();	}
	function  clanTblSort3(){ doSort3 = !doSort3;	addSortTable();	}
	function  clanTblSort4(){ doSort4 = !doSort4;	addSortTable();	}
	function  clanTblSort5(){ doSort5 = !doSort5;	addSortTable();	}
	function  clanTblSort6(){ doSort6 = !doSort6;	addSortTable();	}

	function $(id) { return document.querySelector("#"+id); }

	function addEvent(elem, evType, fn) {
		if (elem.addEventListener) {
			elem.addEventListener(evType, fn, false);
		}
		else if (elem.attachEvent) {
			elem.attachEvent("on" + evType, fn);
		}
		else {
			elem["on" + evType] = fn;
		}
	}

})();