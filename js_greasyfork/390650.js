// ==UserScript==
// @name         xospital bot
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  bot for xospital.mobi
// @include      https://xospital.mobi/*
// @include      https://odkl.xospital.mobi/*
// @author       axmed2004
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390650/xospital%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/390650/xospital%20bot.meta.js
// ==/UserScript==

// интервал в ЧП при найденном пациенте (сек.)
var questsShortTimeout = 3;
// интервал в ЧП при отсутствии пациента (мин.)
var questsLongTimeout = 1;

// интервал для перехода по страницам мин/макс (сек.)
var rimin = +localStorage.getItem("pagesRunIntervalMin")||4;
var rimax = +localStorage.getItem("pagesRunIntervalMax")||6;
if (rimin > rimax || rimin < 1) rimin = 1;
if (rimax < rimin || rimax < 1) rimax = 1;

// интервал до нового цикла мин/макс (мин.)
var rtmin = +localStorage.getItem("restartTimeMin")||3;
var rtmax = +localStorage.getItem("restartTimeMax")||4;

if (rtmin > rtmax || rtmin < 1) rtmin = 1;
if (rtmax < rtmin || rtmax < 1) rtmax = 1;

//при наличии Карманного компьютера
var rsm = localStorage.getItem("roomsSelectMethod") || "random";
var rsp = localStorage.getItem("roomsSelectParam") || "time";
var rsv = localStorage.getItem("roomsSelectValue") || "min";

var asm = localStorage.getItem("autoparkSelectMethod") || "random";
var asp = localStorage.getItem("autoparkSelectParam") || "time";
var asv = localStorage.getItem("autoparkSelectValue") || "min";

var patientsTimeoutTime = Math.round((Math.random() * (rtmax - rtmin) + rtmin) * 60);
var chestsTimeoutTime = Math.round((Math.random() + 7) * 60);
var pagesRunIntervalTime = (Math.random() * (rimax - rimin) + rimin) * 1000;
var restartInterval = null;
var pagesTimeout = null;
var restartTimeoutRunned = false;

var rooms = /^https:\/\/(odkl\.)?xospital\.mobi\/Rooms/.test(location.href);
var reception = /^https:\/\/(odkl\.)?xospital\.mobi\/Reception/.test(location.href);
var pharmacy = /^https:\/\/(odkl\.)?xospital\.mobi\/Pharmacy/.test(location.href);
var autopark = /^https:\/\/(odkl\.)?xospital\.mobi\/AutoPark\?/.test(location.href);
var autoParkDestination = /^https:\/\/(odkl\.)?xospital\.mobi\/AutoParkDestination\?/.test(location.href);
var vetclinic = /^https:\/\/(odkl\.)?xospital\.mobi\/VetClinic/.test(location.href);
var quests = /^https:\/\/(odkl\.)?xospital\.mobi\/Quests/.test(location.href);
var chests = /^https:\/\/(odkl\.)?xospital\.mobi\/Underwater\/Chests/.test(location.href);

var mainPages = rooms || reception || pharmacy || autopark || autoParkDestination;

var splash = `<div id='splashoverlay' style='position:absolute;left:0px;top:0px;width:100%;height:100%;background-color:#000;opacity:0.4'></div>
	<div id='splashinfo' style='position:absolute;margin:0 auto;border:3px solid #ccc;background-color:white;width:50%;height:80%;left: 25%;top: 10%;'>
	Бот состоит из 4 частей: <br><br>
	1. Бот для палат, лабораторий и автопарка, циклически передвигается по ним.<br>
	2. Бот для ЧП.<br>
	3. Бот для ветеринарной клиники.<br>
	4. Бот для покупки ключей в Подводной охоте.<br><br>
	Для параллельной работы откройте в браузере отдельные вкладки для каждого бота.<br>
	Нажмите на значок настроек в заголовке страницы и выберите нужные параметры.<br>
	<span style='color:red;padding-left:10px;'>*</span><i>Интервалы сделаны для симуляции поведения человека, при слишком коротких интервалах возможен бан аккаунта.</i><br><br>
	Для избежания бана рекомендую каждые несколько часов выключать бота. Не оставляйте его включенным на ночь.<br>
	Установите временные интервалы соответсвенно уровню вашего оборудования (Рентгеносканер, Громкоговоритель, GPS) (+/- 1-2 мин от текущего значения)<br><br>
	<button style='display:block;margin:0 auto;font-size:16px;' onclick='(function(){localStorage.setItem("firstrun", "false");location.reload();})()'>Перезагрузить страницу для запуска скрипта</button>
	</div>`;
var setsOpened = false;

Node.prototype.get=function(s){
	return this.querySelector(s);
}

Node.prototype.getAll=function(s){
	return this.querySelectorAll(s);
}

function get(s){
	return document.querySelector(s);
}

function getAll(s){
	return document.querySelectorAll(s);
}

function openSets() {
	setsOpened = true;
	if (get("#splashoverlay") != null && get("#setsWindow")!=null) {
		get("#splashoverlay").style.display = "block";
		get("#setsWindow").style.top = get("#botsets").offsetTop + get("#botsets").height;
		get("#setsWindow").style.right = get("#botsets").offsetTop + get("#botsets").width;
	}
	get("#setsWindow").style.display = "block";
	clearInterval(restartInterval);
	clearTimeout(pagesTimeout);
}

function closeSets() {
	setsOpened = false;
	get("#splashoverlay").style.display = "none";
	get("#setsWindow").style.display = "none";
	if (mainPages) {
		if(restartTimeoutRunned) restartTimeout()
	}
	else pagesTimeout=setTimeout(patientsRun, pagesRunIntervalTime);
}

function drawSets() {
	if (mainPages) {
		get("div.caption h1").insertAdjacentHTML("beforeend", "<img id='botsets' width=30 height=30 style='float:right;vertical-align:top;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACSVBMVEUAAAApKSk0NDQ1NTU2NjY5OTk7Ozs+Pj5BQUFGRkZHR0dLS0tMTExSUlI3Nzc4ODg5OTk2NjY3Nzc4ODg1NTU0NDQ1NTU0NDQ1NTU2NjY0NDQ1NTU0NDQ0NDQ1NTU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9BQUFCQkJDQ0NERERFRUVGRkZKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJUVFRVVVVXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJkZGRlZWVmZmZnZ2doaGhqampra2tsbGxtbW1vb29wcHBycnJzc3N2dnZ3d3d4eHh5eXl6enp8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaJiYmMjIyOjo6Pj4+QkJCRkZGTk5OUlJSVlZWXl5eYmJiZmZkJAAaTAAAAb3RSTlMAAAAAAAAAAAAAAAAAAAICAgQEBAYKCgwMDA4OEBYWGBocICImKCosMDI2OD5ARkpQVFZYWlxeYmRmaGpucHR2eHp8gZObnZ+jpamrr7Gztbm7vb/Bw8XHycvN0dPV19nb3d/h4+nt7/Hz9ff5+/2biH1OAAADe0lEQVRIx5VW+UMMURwflCv3WURkU5GjKEeO3MdGbbmiyFZrd2tmPkpsFyVSbCSyJVcipUM3ErX7l3lvjp3Zw7a+v8y89z6fN+99vp/3vsMwnrHyZKaB4wxXji9j/IuTkOKon4RMlDY2Nz+34Lx/+JlGNDpIWJEzwxduQ1yU+KIBPlBCK7BW7NkUt94Tv+0G2MRA+nYI/DAl9AKJtB1wkENejBt83h6W7lK7jmGijLhnp4TJUuRFMEx4Ck9GCna4EhKBorcW0p+mI8yvDiE6eOSnppN2WetNcDvV+FgOxQOOsce8oOZ7hxSvRXXrxx09RWC3KvhIM24NUkR/Q1Vlw7BdJtgHnlZWNQ7R175C3NjgJOwB2hxTBNEszkmI4VA27hv/0wI2SllTEo9634RaYK9q0wEp4Ad94Xt4nJqtlimcFe3wr7DCvMY1EemoUoYnOm1Wq61rwtlhL0eyW6p1qJRHJz/cEfW3tMkC28ugdcVHs2iQBn/XUCdkZxeQR+0fqfMJzBoFvUhz2AgMS/M/BK7HhwQFhSToCUP6Rh9gSNIspOhQbZZJ8IM09A5IDRYnWpWmJPQ1dY0xSxvKpFA0f69bXlAxrq6QP71aD4u88867wr7OMnqUv2gbcdrnM7BdWWwC0OVUaritsRx6xoQmteANMC5WCCEFsKlHm2BiOLSou2qQoRIvKBtW9WgLuP8nmH0tKZh1X5KZyUFFc/uoP5seabdVIId4gsp694si67VgGb9KJWtHhSCrjgnT5bIkKXyrZ+JWpwMfJfwrimFzdWGkf9bSyCQDMODNGnXSNN088g5sXDLXudiIfDyVF/WIfJkVzVcnm68OxnBXu6Z6s/dHp71LcdrtPJzDfdUB6vI8QGdc8VMd0Xq3IxqYPPUlcGK6irAPrhbwDHIM4xX8ZhYlv3wTftxGfqSTsFtJ0D/jDRCrXAEFKB6hvUNN1dWvviuo0ZfVD2yC0fqLYNK4mOz2oGPMKlz3hZ9k+d/fFPLxbNzRdwvcdnUB2k8LSgnJ8KUMDuiVjjEP7uJl0i57Uwhul1sJ4uhcyeEB82PM0iVIsmWInj8tIlUoWfFei6Ig9RHwwoa+Aftpe0ESKYpbvJTdWOn+j+DF24joEuaj7Cqx0IQXoh1y5/j3K5CF8qaWlpcluODnv4ZW/jk55ich9KzexHGm69rlXgb/AhdictoAuPAVAAAAAElFTkSuQmCC'>");
		let setsWindow = `<div id='setsWindow' style='display:none;z-index:20;position:absolute;top:10%;right:10%;background-color:white;border:3px solid #ccc;'>
		<table>
		<tr><td>Интервал перехода между страницами<br>
		от <input type='number' min='1' id='pagesRunIntervalMin' value='` + rimin + `' style='width:50px;'>до <input type='number' min='1' id='pagesRunIntervalMax' value='` + rimax + `' style='width:50px;'>сек 
		</td></tr>
		<tr><td>Интервал до нового цикла в минутах<br>
		от <input type='number' min='1' id='restartTimeMin' value='` + rtmin + `' style='width:50px;'>до <input type='number' min='1' id='restartTimeMax' value='` + rtmax + `' style='width:50px;'>мин
		</td></tr>
		<tr><td>Выбор пациентов в палаты<br>
		<select id='roomsSelectMethod'>
		<option value='random'>Случайно</option>
		<option value='event'>По событию</option>
		<option value='value'>По значению</option>
		</select>
		<select id='roomsSelectParam'` + (rsm != `value` ? ` disabled` : ``) + `>
		<option value='time'>Время</option>
		<option value='price'>Стоимость</option>
		<option value='exp'>Опыт</option>
		</select>
		<select id='roomsSelectValue'` + (rsm != `value` ? ` disabled` : ``) + `>
		<option value='min'>Мин.</option>
		<option value='max'>Макс.</option>
		<option value='random'>Любое</option>
		</select>
		</td></tr>
		<tr><td>Выбор пациентов в автопарк<br>
		<select id='autoparkSelectMethod'>
		<option value='random'>Случайно</option>
		<option value='event'>По событию</option>
		<option value='value'>По значению</option>
		</select>
		<select id='autoparkSelectParam' ` + (asm != `value` ? ` disabled` : ``) + `>
		<option value='time'>Время</option>
		<option value='price'>Стоимость</option>
		<option value='exp'>Опыт</option>
		</select>
		<select id='autoparkSelectValue'` + (asm != `value` ? ` disabled` : ``) + `>
		<option value='min'>Мин.</option>
		<option value='max'>Макс.</option>
		<option value='random'>Любое</option>
		</select>
		</td></tr>
		</table>
		<div>
		<button id='savesets' style='margin-top:20px;display:inline-block;'>Сохранить</button>
		<button id='closesets' style='margin-top:20px;display:inline-block;float:right;'>Закрыть</button>
		</div></div>`;
	
		document.body.insertAdjacentHTML("afterBegin", setsWindow);
	
		get("#roomsSelectMethod").value = rsm;
		get("#roomsSelectParam").value = rsp;
		get("#roomsSelectValue").value = rsv;
	
		get("#autoparkSelectMethod").value = asm;
		get("#autoparkSelectParam").value = asp;
		get("#autoparkSelectValue").value = asv;
	
		document.body.insertAdjacentHTML("afterBegin", "<div id='splashoverlay' style='position:absolute;display:none;width:100%;height:100%;left:0px;top:0px;background-color:#000;opacity:0.4;'></div>");
		get("#roomsSelectMethod").addEventListener("change", (e) => {
			get("#roomsSelectParam").disabled = e.target.value != "value";
			get("#roomsSelectValue").disabled = e.target.value != "value";
		})
		get("#autoparkSelectMethod").addEventListener("change", (e) => {
			get("#autoparkSelectParam").disabled = e.target.value != "value";
			get("#autoparkSelectValue").disabled = e.target.value != "value";
		})
	
		get("#botsets").addEventListener("click", () => {
			openSets();
		})
	
		get("#savesets").addEventListener("click", () => {
			let runIntervalMin_tb = get("#pagesRunIntervalMin").value;
			let runIntervalMax_tb = get("#pagesRunIntervalMax").value;
			let restartTimeMin_tb = get("#restartTimeMin").value;
			let restartTimeMax_tb = get("#restartTimeMax").value;
	
			let roomsSelectMethod_select = get("#roomsSelectMethod").value;
			let roomsSelectParam_select = get("#roomsSelectParam").value;
			let roomsSelectValue_select = get("#roomsSelectValue").value;
	
			let autoparkSelectMethod_select = get("#autoparkSelectMethod").value;
			let autoparkSelectParam_select = get("#autoparkSelectParam").value;
			let autoParkSelectValue_select = get("#autoparkSelectValue").value;
			
			if (runIntervalMin_tb != "" && +runIntervalMin_tb > 0
				&& runIntervalMax_tb != "" && +runIntervalMax_tb > 0
				&& +runIntervalMax_tb > +runIntervalMin_tb) {
				localStorage.setItem("pagesRunIntervalMin", runIntervalMin_tb);
				localStorage.setItem("pagesRunIntervalMax", runIntervalMax_tb);
			}
			if (restartTimeMin_tb != "" && +restartTimeMin_tb > 0
				&& restartTimeMax_tb != "" && +restartTimeMax_tb > 0
				&& +restartTimeMax_tb> +restartTimeMin_tb) {
				localStorage.setItem("restartTimeMin", restartTimeMin_tb);
				localStorage.setItem("restartTimeMax", restartTimeMax_tb);
			}
	
			localStorage.setItem("roomsSelectMethod", roomsSelectMethod_select);
			if (roomsSelectMethod_select == "value") {
				localStorage.setItem("roomsSelectParam", roomsSelectParam_select);
				localStorage.setItem("roomsSelectValue", roomsSelectValue_select);
			}
	
			localStorage.setItem("autoparkSelectMethod", autoparkSelectMethod_select);
			if (autoparkSelectMethod_select == "value") {
				localStorage.setItem("autoparkSelectParam", autoparkSelectParam_select);
				localStorage.setItem("autoparkSelectValue", autoParkSelectValue_select);
			}
		})
	
		get("#closesets").addEventListener("click", () => {
			closeSets();
		})
	}
}

function restartTimeout() {
	if (!setsOpened) {
		restartTimeoutRunned = true;
		if (get("span#timeleft") == null) {
			var span = document.createElement("span");
			span.setAttribute("id","timeleft");
			get("div.caption h1").appendChild(span);
		}
		
		restartInterval= setInterval(() => {
			patientsTimeoutTime--;
			if(patientsTimeoutTime>=0){
				mins=Math.floor(patientsTimeoutTime/60);
				secs=Math.floor((patientsTimeoutTime-mins*60));
				if(secs<10) secs="0"+secs;
				document.title=mins+":"+secs;
				get("span#timeleft").innerHTML=document.title;
			}
			else{
				clearInterval(restartInterval)
				get("ul.action_list a[href^='/Rooms']").click();
			}
		}, 1000);
	}
	
}

function patientsRun() {
	if(rooms)
	{
		// палаты

		let l = get("a[href^='/Rooms/Examine']") ||
			get("a[href^='/Rooms/FirstExamine']") ||
			get("a[href^='/Rooms/GetVitamin']") ||
			get("a[href^='/Rooms/GetPotion']") ||
			get("a[href^='/Rooms/Discharge']") ||
			get("a[href^='/Rooms/ClearAll']") ||
			get("a[href^='/Rooms/RoomClear']");
		let fl = get("ul.action_list a[href^='/Pharmacy']");
		if (l) l.click();
		
		else if(rsm=="random" && get("a[href^='/Reception/TreatAll?treatType=Any']")!=null)
			get("a[href^='/Reception/TreatAll?treatType=Any']").click();
		else if(rsm=="random" && get("a[href^='/Reception/TreatAllConfirm?']")!=null)
			get("a[href^='/Reception/TreatAllConfirm?']").click();
		else if(rsm=="event" && get("a[href^='/Reception/TreatAll?treatType=Epidemic']")!=null)
			get("a[href^='/Reception/TreatAll?treatType=Epidemic']").click();
		else if (rsm == "value") {
			let l = get("ul.padtop_s a[href^='/Reception?roomIndex']")
			if (l) l.click();
			else if(get("a[href^='/Rooms?page=']")!=null){
				let url = new URL(location.href);
				let urlp = 1;
				if (url.searchParams.has("page"))
					urlp = +url.searchParams.get("page");
				if(get("a[href^='/Rooms?page="+(urlp+1)+"']")!=null)
					get("a[href^='/Rooms?page=" + (urlp + 1) + "']").click();
				else
					fl.click();
			}
		}
		else fl.click();
			//переход в лаборатории
	}
	else if(reception){
		// приемная
		var $list = getAll('ul.delim-list.padtop_s li.padtop_s');
		let l = get('.epidemic');
		if(rsm=="event" && l)
			l.get('a').click();
		else{
			var elem=0;
			arr = [];
			arr2 = [];
			if(rsv=="random")
				elem = ~~(Math.random() * $list.length);
			else{
				if(rsp=="price"){
					$list.forEach(el=>{
						arr.push(+el.getAll("span.money")[1].innerHTML);
					})
				}
				else if(rsp=="time"){
					$list.forEach(el=>{
						let t = el.get(".smallfont.minor span.ylwtitle").innerHTML;
						let m = "";
						if(/(\d+) д./.test(t)){
							m = t.match(/(\d+) д./);
							arr.push(+m[1] * 24 * 60);
						}
						else if(/(\d+) д. (\d+) ч./.test(t)){
							m = t.match(/(\d+) д. (\d+) ч./);
							arr.push(+m[1] * 24 * 60 + (+m[2]) * 60);
						}
						else if(/(\d+) ч./.test(t)){
							m = t.match(/(\d+) ч./);
							arr.push(+m[1] * 60);
						}
						else if(/(\d+) мин./.test(t)){
							m = t.match(/(\d+) мин./);
							arr.push(+m[1]);
						}
						else if(/(\d+) ч. (\d+) мин./.test(t)){
							m = t.match(/(\d+) ч. (\d+) мин./);
							arr.push(+m[1] * 60 + parseInt(m[2]));
						}
					})
				}
				else if(rsp=="exp"){
					$list.forEach(el=>{
						arr.push(+el.getAll("span.money")[0].innerHTML);
					})
				}
				arr2 = [...arr];
				arr.sort((a, b) => a - b);
				elem = arr2.indexOf(arr[rsv == "min" ? 0 : arr.length - 1]);
			}
			$list[elem].get("a").click();
		}
	}
	else if(pharmacy){
		// лаборатории
		let l = get("a[href^='/Pharmacy/CheerupAll']") ||
			get("a[href^='/Pharmacy/Mix']") ||
			get("a[href^='/Pharmacy/FoodAll']") ||
			get("a[href^='/Pharmacy/GetAccelerator']") ||
			get("a[href^='/Warehouse/Add']") ||
			get("a[href*='/Pharmacy/Prepare']") ||
			get("a[href^='/Pharmacy/ProduceAll']") ||
			get("a[href*='/Pharmacy/CreateDrug']");
		
		if (l) l.click();
		
		else
			get("ul.action_list a[href^='/AutoPark']").click();
	}
	else if(autopark) {
		// автопарк
		let l = get("a[href^='/AutoPark/TipWay']") ||
			get("a[href^='/AutoPark/TipWay']") ||
			get("a[href^='/AutoFuel/Refill']") ||
			get("a[href^='/AutoPark/Threat']") ||
			get("a[href^='/AutoPark/Examine']");
			
		if (l) l.click();
			
		else if (asm == "random" && get("a[href^='/AutoParkDestination/SendAll?onEvent=False']") != null)
			get("a[href^='/AutoParkDestination/SendAll?onEvent=False']").click();
		else if (asm == "random" && get("a[href^='/AutoParkDestination/SendAllConfirm?']") != null)
			get("a[href^='/AutoParkDestination/SendAllConfirm?']").click();
		else if (asm == "event" && get("a[href^='/AutoParkDestination/SendAll?onEvent=true']") != null)
			get("a[href^='/AutoParkDestination/SendAll?onEvent=true']").click();
		else if (asm == "value") {
			if (get("a[href^='/AutoParkDestination?garageIndex']") != null)
				get("a[href^='/AutoParkDestination?garageIndex']").click();
	
			else if (get("a[href^='/AutoPark?page=']") != null) {
				let url = new URL(location.href);
				let urlp = 1;
				if (url.searchParams.has("page"))
					urlp = parseInt(url.searchParams.get("page"));
				if (get("a[href^='/AutoPark?page=" + (urlp + 1) + "']") != null)
					get("a[href^='/AutoPark?page=" + (urlp + 1) + "']").click();
				else restartTimeout();
			}
		}
		else
			restartTimeout();
	}
	else if(autoParkDestination){
		var $list=getAll("ul.delim-list.padtop_s li.padtop_s");
		if(asm=="event" && get(".epidemic")!=null)
			get(".epidemic a").click();
		else{
			var elem = 0;
			arr = [];
			arr2 = [];
			if(asv=="random")
				elem = ~~(Math.random() * $list.length);
			else{
				if(asp=="price"){
					$list.forEach(el=>{
						arr.push(parseInt(el.getAll("span.ylwtextb")[2].innerHTML.split(" ")[0]));
					})
				}
				else if(asp=="time"){
					$list.forEach(el=>{
						let t = el.getAll("span.ylwtextb")[0].innerHTML;
						if(/(\d+) д./.test(t)){
							let m = t.match(/(\d+) д./);
							arr.push(parseInt(m[1]) * 24 * 60);
						}
						else if(/(\d+) д. (\d+) ч./.test(t)){
							let m = t.match(/(\d+) д. (\d+) ч./);
							arr.push(parseInt(m[1]) * 24 * 60 + parseInt(m[2]) * 60);
						}
						else if(/(\d+) ч./.test(t)){
							let m = t.match(/(\d+) ч./);
							arr.push(parseInt(m[1]) * 60);
						}
						else if(/(\d+) мин./.test(t)){
							let m = t.match(/(\d+) мин./);
							arr.push(parseInt(m[1]));
						}
						else if(/(\d+) ч. (\d+) мин./.test(t)){
							let m = t.match(/(\d+) ч. (\d+) мин./);
							arr.push(parseInt(m[1]) * 60 + parseInt(m[2]));
						}
					})
				}
				else if(asp=="exp"){
					$list.forEach(el=>{
						arr.push(parseInt(el.getAll("span.ylwtextb")[1].innerHTML));
					})
				}
				arr2 = [...arr];
				arr.sort((a, b) => a - b);
				elem = arr2.indexOf(arr[asv == "min" ? 0 : arr.length - 1]);
			}
			$list[elem].get("a").click();
		}
	}
}

function questsRun(){
	let l = get("a[href^='/Quests/Begin?']") ||
		get("a[href^='/Quests/ChestsContinue?']") ||
		get("a[href^='/Quests/SaveInjured?']") ||
		get("a[href^='/Quests/StudyComplete?']") ||
		get("a[href^='/Quests/StudyEnd?']") ||
		get("a[href^='/Quests/Study?']") ||
		get("a[href^='/Quests/End?']");
	
	if (l) 
		setTimeout(() => l.click(), questsShortTimeout * 1000);
	else if (get("a[href^='/Quests?']"))
		setTimeout(() => get("a[href^='/Quests?']").click(), questsLongTimeout * 60000);
}

function vetClinicRun() {
	setTimeout(() => {
		let l = get("a[href^='/VetClinic/GetPet?'") ||
			get("a[href^='/VetClinic/Diagnose?'") ||
			get("a[href^='/VetClinic/Done?'") ||
			get("a[href^='/VetClinic/Treat?'");
	
		if (l) l.click();
		else {
			setTimeout(() => {
				get("ul.action_list a[href^='/VetClinic']").click();
			}, questsLongTimeout * 60000 * 2)
		}
	}, questsShortTimeout * 1000);
}

function chestsRun() {
	let c = +get("b.underwater-treasuresScore-value").innerText;
	if (c > 200) {
		get("a.btn[href^='/Underwater/CollectKeys']").click();
	}
	else location.reload();
}

drawSets()

if (localStorage.getItem("firstrun") == null) {
	localStorage.setItem("firstrun", "false");
	document.body.insertAdjacentHTML("afterBegin", splash);
	pagesTimeout = setTimeout(patientsRun, pagesRunIntervalTime);
}
if (mainPages) {
	if (localStorage.getItem("firstrun") != null && localStorage.getItem("firstrun") == "false")
		pagesTimeout = setTimeout(patientsRun, pagesRunIntervalTime);
}
else if (quests) questsRun();

else if (vetclinic) vetClinicRun();

else if (chests) chestsRun();