// ==UserScript==
// @name         Izrasoldiers
// @namespace    http://izra.co.il/
// @version      1.27
// @description  Izrasoldiers: Free hacks for the popular Israeli browser game 'Izrasoldiers'.
// @author       Anonymous
// @match        http://s1.izra.co.il/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29273/Izrasoldiers.user.js
// @updateURL https://update.greasyfork.org/scripts/29273/Izrasoldiers.meta.js
// ==/UserScript==

var DB_loggedin = "loggedin";
var DB_usrid = "userid";
var DB_clanid = "clanid";
var DB_clan_leader = false;
//var DB_loggedin = "loggedin";

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			if(document.getElementById("HACK_izra_process_string")){
				var processElement = document.getElementById("HACK_izra_process_string");
				processElement.innerHTML = processElement.innerHTML;
			}
			break;
		}
	}
}

function clan_update_process(process){
	document.body.removeChild(document.body.firstChild);
	var HACK_clan_process_div = document.createElement("div");
	HACK_clan_process_div.setAttribute("style", "position: fixed;height: 100%;width: 100%;z-index: 1000;background: rgba(0, 0, 0, 0.78);font-size: 100px;");
	var HACK_clan_process_div_a = document.createElement("a");
	HACK_clan_process_div_a.innerHTML = "WAIT";
	HACK_clan_process_div_a.id = "HACK_izra_process_string";
	HACK_clan_process_div_a.setAttribute("style", "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);");
	HACK_clan_process_div.appendChild(HACK_clan_process_div_a);
	document.body.insertBefore(HACK_clan_process_div, document.body.firstChild);


	var processElement = document.getElementById("HACK_izra_process_string");
	if(process == "clan_1"){
		processElement.innerHTML = "מבצע תהליך 1 מתוך 2...";
	}else if(process == "clan_2"){
		processElement.innerHTML = "מבצע תהליך 2 מתוך 2...";
	}else if(process == "clan_finish"){
		document.body.removeChild(document.body.firstChild);
	}
}


function checklogin(){
	if(!GM_getValue(DB_loggedin, false)) alert("נא להיכנס לבסיס ולאחר מכן לרענן את העמוד!");
}

function resetData(){
	GM_deleteValue(DB_loggedin);
	GM_deleteValue(DB_usrid);
	GM_deleteValue(DB_clanid);
	GM_deleteValue(DB_clan_leader);
}





$( document ).ready(function() {
	//alert("LOGGEDIN = " + GM_getValue(DB_loggedin, false) + " | USRID = " + GM_getValue(DB_usrid, 0));

	var HACK_settings = document.getElementById("top_menu2").childNodes[1];
	HACK_settings.childNodes[9].setAttribute("class", "");
	var HACK_settings_li = document.createElement("li");
	var HACK_settings_li_span = document.createElement("span");
	var HACK_settings_li_span_a = document.createElement("a");
	HACK_settings_li_span_a.title = "הגדרות של הפריצה";
	HACK_settings_li_span_a.innerHTML = "הגדרות נוספות";
	HACK_settings_li_span.appendChild(HACK_settings_li_span_a);
	HACK_settings_li.appendChild(HACK_settings_li_span);
	HACK_settings_li.setAttribute("class", "last dropdown");
	HACK_settings.appendChild(HACK_settings_li);
	console.log(HACK_settings);

	var baseurl = window.location.href;
	var baseurl_check = baseurl.split("/");
	var baseurl_con = baseurl_check[baseurl_check.length-1];

	console.log(baseurl_con);

	if(baseurl_con == "base" ||  baseurl_con == "base#"){
		var element_bf = document.getElementById("bf");
		var element_bf_table = element_bf.childNodes[1];
		var element_bf_table_url = element_bf_table.rows[1].cells[0].childNodes[1].value;
		var usrid = element_bf_table_url.split("=")[element_bf_table_url.split("=").length-1];
		GM_setValue(DB_loggedin, true);
		GM_setValue(DB_usrid, usrid);
	}else if(baseurl_con == "clanslist" ||  baseurl_con == "clanslist#"){
		checklogin();
		document.querySelector("table.stable").id = "clanranksTable";

		var table1 = document.getElementById("clanranksTable");
		var table_len1 = table1.rows.length;

		for(x=1; x < table_len1; x=x+1){
			//console.log(table.rows[x].innerHTML);
			row1 = table1.rows[x];
			if(row1.cells[4].childNodes[1].childNodes[1]) {


				var url1 = row1.cells[1].childNodes[0].href;
				var array1 = url1.split('=');
				var id1 = array1[array1.length-1];

				var element1 = document.createElement("a");
				element1.id = "hackEnterClan";
				element1.setAttribute("cid", id1);
				element1.setAttribute("style", "cursor:pointer;");
				element1.innerHTML = " הכנס לשבט";
				row1.cells[1].appendChild(element1);
			}
		}
	}else if(baseurl_con == "logout"){
		resetData();
	}else if(baseurl_con == "clan" ||  baseurl_con == "clan#"){
		var element_clan = document.getElementById("clan").childNodes[3];
		var element_clan_new = document.createElement("a");
		if(!GM_getValue(DB_clan_leader)){
			element_clan_new.innerHTML = "הפוך לסגן";
			element_clan_new.href = "#";
			element_clan_new.style = "background:white;color:red;border-radius:15px;padding:5px;";
			element_clan_new.id = "HACK_izra_become_a_leader";
			element_clan.appendChild(element_clan_new);
		}else{
			element_clan_new.innerHTML = "הפוך למשתמש רגיל";
			element_clan_new.href = "#";
			element_clan_new.style = "background:white;color:red;border-radius:15px;padding:5px;";
			element_clan_new.id = "HACK_izra_become_a_leader_stop";
			element_clan.appendChild(element_clan_new);
		}

		var element_clan_info = document.getElementById("all_tabs").childNodes[14];
		var element_clan_info_new_br = document.createElement("br");
		var element_clan_info_new_div = document.createElement("div");
		var element_clan_info_new_div_a = document.createElement("h2");
		var element_clan_info_new_div_input = document.createElement("input");
		var element_clan_info_new_div_input_submit = document.createElement("input");
		element_clan_info_new_div_input_submit.class = "btn_gray";
		element_clan_info_new_div_input_submit.type = "submit";
		element_clan_info_new_div_input_submit.id = "HACK_izra_get_money_submit";
		element_clan_info_new_div_input_submit.value = "המשך";
		element_clan_info_new_div_input.id = "HACK_izra_get_money";
		element_clan_info_new_div_input.placeholder = "הכנס כמות כסף שברצונך לקבל";
		element_clan_info_new_div_a.class = "special";
		element_clan_info_new_div_a.innerHTML = "קבלת כסף מהפריצה:";
		element_clan_info_new_div.appendChild(element_clan_info_new_br);
		element_clan_info_new_div.appendChild(element_clan_info_new_div_a);
		element_clan_info_new_div.appendChild(element_clan_info_new_div_input);
		element_clan_info_new_div.appendChild(element_clan_info_new_div_input_submit);
		element_clan_info.appendChild(element_clan_info_new_div);
		console.log(element_clan_info);
	}else if(baseurl_con.split("=")[0] == "?clan_id"){

		checklogin();
		document.querySelector("table.stable").id = "clanranksTable";

		var table = document.getElementById("clanranksTable");
		var table_len = table.rows.length;
		var clan_users_array = [];

		for(x=1; x < table_len; x=x+1){
			//console.log(table.rows[x].innerHTML);
			row = table.rows[x];

			var url = row.cells[1].childNodes[0].href;
			var array = url.split('=');
			var id = array[array.length-1];

			var element = document.createElement("a");
			element.href="/clan/outofclan/?uid="+id;
			clan_users_array.push("/clan/outofclan/?uid="+id);
			element.innerHTML = " הוצא מהשבט";
			row.cells[1].appendChild(element);
		}

		var clan_close = document.getElementById("main_game_window");
		var clan_close_before = clan_close.childNodes[1].childNodes[13];
		var clan_close_a = document.createElement("a");
		clan_close_a.innerHTML = "הוצא את כולם מהשבט";
		//clan_close_a.setAttribute("onclick","HACK_everyone_out()");
		clan_close_a.href = "#";
		clan_close_a.style = "background: red;color: white;padding: 7px 15px;display: inline-block;border-radius: 25px;margin: 10px 0;font-size: 20px;text-align: center;";
		clan_close_a.id = "HACK_izra_clan_everyone_out";
		console.log(clan_close_a);
		console.log(clan_users_array);
		clan_close.childNodes[1].insertBefore(clan_close_a, clan_close_before);
	}


	$('a[id="hackEnterClan"]').click(function () {
		var clanid = $(this).attr("cid");

		$.get("/clanslist/enterclan/", { join_clanid: clanid },
			  function(data){
			if(data.msg == "ok"){
				GM_setValue(DB_clanid, clanid);
				window.location.href = '/clan';
			} else {
				alert(data.msg);
			}
		}, "json");

	});

	$('a[id="HACK_izra_become_a_leader"]').click(function () {
		GM_setValue(DB_clan_leader, true);
		window.location.href = '/clan/setclanpos/?pos=1&uid='+GM_getValue(DB_usrid, 0);

	});

	$('a[id="HACK_izra_become_a_leader_stop"]').click(function () {
		GM_setValue(DB_clan_leader, false);
		window.location.href = '/clan/setclanpos/?pos=0&uid='+GM_getValue(DB_usrid, 0);

	});

	$('a[id="HACK_izra_clan_everyone_out"]').click(function () {
		var table = document.getElementById("clanranksTable");
		var table_len = table.rows.length;
		var clan_users_array = [];

		for(x=1; x < table_len; x=x+1){
			//console.log(table.rows[x].innerHTML);
			row = table.rows[x];

			var url = row.cells[1].childNodes[0].href;
			var array = url.split('=');
			var id = array[array.length-1];
			clan_users_array.push("/clan/outofclan/?uid="+id);
		}

		var HACK_clan_process_div = document.createElement("div");
		HACK_clan_process_div.setAttribute("style", "position: fixed;height: 100%;width: 100%;z-index: 1000;background: rgba(0, 0, 0, 0.78);font-size: 60px;");
		var HACK_clan_process_div_a = document.createElement("a");
		HACK_clan_process_div_a.innerHTML = "מוציא את כל חברי השבט נא לא לסגור את החלון הזה!";
		HACK_clan_process_div_a.id = "HACK_izra_process_string";
		HACK_clan_process_div_a.setAttribute("style", "position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);");
		HACK_clan_process_div.appendChild(HACK_clan_process_div_a);
		document.body.insertBefore(HACK_clan_process_div, document.body.firstChild);
		console.log(clan_users_array);
		alert("START");
		for (var i = 0; i < clan_users_array.length; i++) {
			$.get(clan_users_array[i],
				  function(data){

			}, "json");
			sleep(500);
		}

		alert("DONE");


		document.body.removeChild(document.body.firstChild);


	});


	$('input[id="HACK_izra_get_money_submit"]').click(function () {
		var element_clan_info_getmoney_amount = document.getElementById("HACK_izra_get_money").value;
		console.log(element_clan_info_getmoney_amount);
		if(isNaN(element_clan_info_getmoney_amount)){
			alert("כמות הכסף חייבת להיות במספרים!");
		}else if(Math.round(element_clan_info_getmoney_amount)<=0){
			alert("נא להקליד מספר חיובי גדול מאפס!");
		}else{
			clan_update_process("clan_1");
			element_clan_info_getmoney_amount = Math.round(element_clan_info_getmoney_amount);
			element_clan_info_getmoney_amount = element_clan_info_getmoney_amount * -1;
			alert("התהליך מסוגל לקחת כ30 שניות. נא לא להפריע לתהליך ולחכות לסיומו. בסיום התהליך הודעה נוספת תוצג שהכסף נכנס לחשבונך בהצלחה.");
			var win_make_a_leader = window.open('/clan/setclanpos/?pos=1&uid='+GM_getValue(DB_usrid, 0),"TITLE",'scrollbars=0,menubar=0,resizable=0,width=50,height=50');
			//win.document.body.innerHTML = "HTML";
			clan_update_process("clan_2");
			setTimeout(function(){
				var misim_old = win_make_a_leader.document.getElementById("mas_form").childNodes[3].childNodes[1].value;
				win_make_a_leader.close();
				setTimeout(function(){

					$.post("/clan/updateleadertaxes/", { mas : element_clan_info_getmoney_amount },
						   function(data){
						//alert(data.msg);
					}, "json");
					sleep(3000);

					$.get('/clan/setclanpos/?pos=0&uid='+GM_getValue(DB_usrid, 0),
						  function(data){
						alert(data.msg);
					}, "json");
					sleep(3000);

					$.post("/clan/paytaxes/",
						   function(data){
						//alert(data.msg);
					}, "json");
					sleep(3000);

					$.get('/clan/setclanpos/?pos=1&uid='+GM_getValue(DB_usrid, 0),
						  function(data){
						alert(data.msg);
					}, "json");
					sleep(3000);

					$.post("/clan/updateleadertaxes/", { mas : misim_old },
						   function(data){
						//alert(data.msg);
					}, "json");
					sleep(3000);

					$.get('/clan/setclanpos/?pos=0&uid='+GM_getValue(DB_usrid, 0),
						  function(data){
						alert(data.msg);
					}, "json");
					sleep(3000);

					alert("התהליך הסתיים! קיבלת את כמות הכסף שביקשת בהצלחה!");

					clan_update_process("clan_finish");
				}, 5000);

			}, 9000);


		}

	});
});