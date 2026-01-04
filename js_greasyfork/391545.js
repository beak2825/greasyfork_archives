// ==UserScript==
// @name         貓咪大戰超絕功能擴充
// @namespace	 https://home.gamer.com.tw/homeindex.php?owner=k96879687
// @version      0.31
// @description  battlecats plug-in
// @author       k96879687(竊盜拿到OK繃)
// @match        https://battlecats-db.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/391545/%E8%B2%93%E5%92%AA%E5%A4%A7%E6%88%B0%E8%B6%85%E7%B5%95%E5%8A%9F%E8%83%BD%E6%93%B4%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/391545/%E8%B2%93%E5%92%AA%E5%A4%A7%E6%88%B0%E8%B6%85%E7%B5%95%E5%8A%9F%E8%83%BD%E6%93%B4%E5%85%85.meta.js
// ==/UserScript==

/*
目前功能：
1.關卡上下關連結，可反應星數	
2.角色等級30、40、50變化
3.外星敵人水晶倍率100%、200%、300%變化
4.外星(星)水晶倍率100%、200%、300%變化
5.變化後顏色提示

*/

(function() {
    'use strict';
	
	let default_crystal = 299;//預設未來篇水晶%數
	let default_crystal_stat = 299;//預設宇宙篇水晶%數
	let animationOFF = 0;//動畫關閉
	let animationBGColor = "009040";//動畫顏色
	let animationTime = 2500;//動畫長度 單位ms
	
	
	
	
	
	
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	var declarations = document.createTextNode(
		'#k96_plug{width:auto; height:auto; position:fixed; right:50px; bottom:60px; background:#883800; text-align:center; line-height:50px; padding:5px;}'+
		'#k96_plug_block_0{ width:100px; height:50px; background:#883800; border-bottom-style:solid;border-color:#b06000;}'+
		'#k96_plug_block_0:hover{background:#b06000; transition:background 1s;}'+
		'#k96_plug_block_1{ width:100px; height:50px; background:#883800; border-bottom-style:solid;border-color:#b06000;}'+
		'#k96_plug_block_1:hover{background:#b06000; transition:background 1s;}'+
		'#k96_plug_block_2{ width:100px; height:50px; background:#883800;}'+
		'#k96_plug_block_2:hover{background:#b06000; transition:background 1s;}'+
		'@keyframes fade { 0%{ background:#'+animationBGColor+';} 100%{}}'+
		'.fade{ animation: fade '+animationTime+'ms forwards;}'
	);
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = declarations.nodeValue;
	}
	else{
		style.appendChild(declarations);
	}
	head.appendChild(style);
	

	var 連結陣列 = location.href.split('//');	//[https:],[battlecats-db.com/stage/s00000-01.html]
	連結陣列 = 連結陣列[1].split('/');	//[battlecats-db.com],[stage],[s00000-01.html]
	var i = 0;
	//---------------------------創造右下區塊---------------------------
	var parent = document.getElementById("main");
	var div = document.createElement("div");
	div.setAttribute("id", "k96_plug");
	parent.appendChild(div);

	
	for(let n =0;n<3;n++){
		let div = document.createElement("div");
		div.setAttribute("id", "k96_plug_block_"+n);
		document.getElementById("k96_plug").appendChild(div);
		div = document.createElement("div");
	}
	
	var legendstory = [
		8,8,8,8,6,8,8,8,8,6,//s00048共49
		8,8,8,6,6,8,8,6,6,8,
		6,6,6,6,8,8,8,6,5,6,
		6,6,6,6,6,6,6,6,6,6,
		6,6,6,6,6,6,6,8,1
	];	
	var true_legendstory = [
		1,6,6,6,6,6,6,6,6,6,//s13018共19
		6,6,6,6,6,6,6,6,6
	];
	function numtostr(num){
		var parts = num.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	}
	
	function addObserverIfDesiredNodeAvailable(flag,set_mode){
		if(!animationOFF){
			let composeBox=[];
			if(set_mode == "enemy"){
				composeBox = [document.getElementsByClassName("c06")[flag],document.getElementsByClassName("c10")[flag],document.getElementsByClassName("c11")[flag]];
			}
			else if(set_mode == "unit"){
				composeBox = [document.getElementsByClassName("R")[14*flag],document.getElementsByClassName("R")[14*flag+4],document.getElementsByClassName("R")[14*flag+8]];
			}
			if(!composeBox[0] && !composeBox[1] && !composeBox[2]) {
				window.setTimeout(addObserverIfDesiredNodeAvailable,500);
				return;
			}
			for(let i=0;i<3;i++){
				mutationObserver.observe(composeBox[i], {
					characterData: true,
					childList: true,
					subtree: true
				});
			}
		}

	}
	var mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			mutation.target.classList.remove('fade');
			void mutation.target.offsetWidth; // restart css animation
			mutation.target.classList.add('fade');
		});
	});
	
	
	
	function unitLV(getLv){
		$('#allLv').trigger('click');
		$('#allLv').children().val(getLv);
		$('#allLv').children().trigger('blur');
		$('#allLv').children().trigger('blur');
	}
	
	function setCrystal(getnumber,mode,list){
		addObserverIfDesiredNodeAvailable(list-1,"enemy");
		let crystal_type = [
			["takaraB","takaraR"],
			["takaraG","takaraY","takaraO","takaraL","takaraP"]
			];
		for(i = 0;i<crystal_type[mode].length;i++){
			$('#'+crystal_type[mode][i]).trigger('click');
			$('#'+crystal_type[mode][i]).children().val(getnumber);
			$('#'+crystal_type[mode][i]).children().trigger('blur');
			$('#'+crystal_type[mode][i]).children().trigger('blur');
		}
	}
	
	function isAlien(flag){
		let isAlien = 0;
		let 敵人屬性 = document.getElementsByClassName("c01")[flag].getElementsByTagName("a");
		for(i =0;i<敵人屬性.length;i++){
			if(敵人屬性[i].innerText == "エイリアン"){
				isAlien = 1;
				if(isAlien && (i+1)!=敵人屬性.length){
					if(敵人屬性[i+1].innerText == "スター"){
						isAlien = 2;
					}
				}
				break;
			}
		}
		return isAlien;
	}
	
	function change_Enemies(){
		let numberOfEnemy = document.getElementsByClassName("c06").length;
		for(let flag=0;flag<numberOfEnemy;flag++){
			if(isAlien(flag) == 1){
				if(default_crystal != 300){
					setCrystal(default_crystal,0,flag+1);
				}
			}
			else if(isAlien(flag) == 2){
				if(default_crystal_stat != 300){
					setCrystal(default_crystal_stat,1,flag+1);
				}
			}
		}
	}
	
	if(連結陣列[1]=="stage" && 連結陣列[2] !== ""){
		let stage_string = /[a-z0-9]+/.exec(連結陣列[2]);
		let now_stage_str = 連結陣列[2].substring(1+stage_string[0].length,3+stage_string[0].length);
		let now_stage = parseInt(now_stage_str,10);
		let previous_stage = now_stage<=10 ? "0"+(now_stage-1) : now_stage-1;
		let next_stage = now_stage<=8 ? "0"+(now_stage+1) : now_stage+1;
		let link_head = "<a href=\"https://battlecats-db.com/stage/"+stage_string[0];
		let link_end = 連結陣列[2].split('.');
		let stop = 0;
		let stage_count = 0;
		let stage_number_plus = [
			//イベントステージ
			"s01069",2,"s01111",2,"s01112",2,"s01114",2,"s01120",2,
			"s01127",3,"s01161",4,"s01190",2,"s01208",2,"s01210",3,
			"s01211",3,"s01212",3,"s01213",3,"s07000",40,
			//シーズンイベントステージ
			"s01154",3,"s01060",3,"s01160",5,"s01072",6,"s01164",5,
			"s01081",5,"s01174",6,"s01115",6,"s01125",5,"s01129",6,
			"s01140",5,"s01149",5,
			//月間イベントステージ
			"s01011",8,"s01083",2,"s01184",5,"s01012",8,"s01084",2,
			"s01186",5,"s01013",8,"s01085",2,"s01192",5,"s01026",8,
			"s01086",2,"s01194",5,"s01029",8,"s01087",2,"s01197",5,
			"s01030",8,"s01088",2,"s01165",5,"s01031",8,"s01089",2,
			"s01166",5,"s01032",8,"s01090",2,"s01167",5,"s01036",8,
			"s01091",2,"s01168",5,"s01038",8,"s01092",2,"s01170",5,
			"s01009",6,"s01093",2,"s01171",5,"s01010",8,"s01094",2,
			"s01175",5
		];
		//如果是日本、未來、宇宙
		if(連結陣列[2].substring(0,5) == 's0300'){
			stage_count=48;
		}//如果是傳說
		else if(連結陣列[2].substring(0,4) == 's000'){
			stage_count = legendstory[parseInt(連結陣列[2].substring(4,6),10)];
		}//如果是真傳說
		else if(連結陣列[2].substring(0,4) == 's130'){
			stage_count = true_legendstory[parseInt(連結陣列[2].substring(4,6),10)];
		}
		else{
			for(i=0;i<stage_number_plus.length;i+=2){
				if(stage_string == stage_number_plus[i]){
					stage_count = stage_number_plus[i+1];
				}
			}
		}
		
		if(link_end[0] == stage_string+"-"+now_stage_str){
			link_end = "."+link_end[1]+"\">";
		}
		else if(link_end[0] == stage_string+"-"+now_stage_str+"_enemy"){
			link_end = link_end[0].substring(stage_string[0].length+3,link_end[0].length)+"."+link_end[1]+"\">";
			change_Enemies();
			if(!stage_count){
				stop = 1;
			}
		}
		
		if(!isNaN(now_stage)){
			//---------------------------上一頁按鈕---------------------------
			if(now_stage == 1){
				document.getElementById("k96_plug_block_0").innerText = "無";
			}
			else{
				document.getElementById("k96_plug_block_0").innerHTML = link_head+"-"+previous_stage+link_end+"前一關 "+previous_stage+"</a>";
			}
			//---------------------------下面為下一頁按鈕---------------------------
			if(now_stage == stage_count || (document.getElementsByClassName("chars").item(1).src == "https://battlecats-db.imgs-server.com/i105.png") || stop){
				document.getElementById("k96_plug_block_2").innerText = stop?"不支援":"無";
			}
			else{
				document.getElementById("k96_plug_block_2").innerHTML = link_head+"-"+next_stage+link_end+"下一關 "+next_stage+"</a>";				
			}
			document.getElementById("k96_plug_block_1").innerText = now_stage+" / "+(stage_count===0?"unknown":stage_count);
		}
	}
	else if(連結陣列[1]=="unit"){
		if(Number(連結陣列[2].substring(0,3))){
			for(let i=0;i<document.getElementsByClassName("c08").length;i++){
				addObserverIfDesiredNodeAvailable(i,"unit");
			}
			var k96_plug_block_0 = document.querySelector ("#k96_plug_block_0");
			var k96_plug_block_1 = document.querySelector ("#k96_plug_block_1");
			var k96_plug_block_2 = document.querySelector ("#k96_plug_block_2");
			
			if (k96_plug_block_0 && k96_plug_block_1 && k96_plug_block_2) {
				document.getElementById("k96_plug_block_0").innerText = "30";
				document.getElementById("k96_plug_block_1").innerText = "40";
				document.getElementById("k96_plug_block_2").innerText = "50";
				k96_plug_block_0.addEventListener ("click", function(){ unitLV(30);} , false);
				k96_plug_block_1.addEventListener ("click", function(){ unitLV(40);} , false);
				k96_plug_block_2.addEventListener ("click", function(){ unitLV(50);} , false);
			}
		}
	}
	else if(連結陣列[1]=="enemy"){
		if(Number(連結陣列[2].substring(0,3))){
			if(isAlien(0) == 1){
				if(default_crystal != 300){
					setCrystal(default_crystal,0,1);
				}				
				let k96_plug_block_0 = document.querySelector("#k96_plug_block_0");
				let k96_plug_block_1 = document.querySelector("#k96_plug_block_1");
				let k96_plug_block_2 = document.querySelector("#k96_plug_block_2");
				if (k96_plug_block_0 && k96_plug_block_1 && k96_plug_block_2) {
					document.getElementById("k96_plug_block_0").innerText = "100%水晶";
					document.getElementById("k96_plug_block_1").innerText = "200%水晶";
					document.getElementById("k96_plug_block_2").innerText = "300%水晶";
					k96_plug_block_0.addEventListener("click", function(){ setCrystal(100,0,1);});
					k96_plug_block_1.addEventListener("click", function(){ setCrystal(200,0,1);});
					k96_plug_block_2.addEventListener("click", function(){ setCrystal(300,0,1);});
				}
			}
			else if(isAlien(0) == 2){
				if(default_crystal_stat != 300){
					setCrystal(default_crystal_stat,1,1);
				}
				let k96_plug_block_0 = document.querySelector("#k96_plug_block_0");
				let k96_plug_block_1 = document.querySelector("#k96_plug_block_1");
				let k96_plug_block_2 = document.querySelector("#k96_plug_block_2");
				if (k96_plug_block_0 && k96_plug_block_1 && k96_plug_block_2) {
					document.getElementById("k96_plug_block_0").innerText = "100%水晶";
					document.getElementById("k96_plug_block_1").innerText = "200%水晶";
					document.getElementById("k96_plug_block_2").innerText = "300%水晶";
					k96_plug_block_0.addEventListener("click", function(){ setCrystal(100,1,1);});
					k96_plug_block_1.addEventListener("click", function(){ setCrystal(200,1,1);});
					k96_plug_block_2.addEventListener("click", function(){ setCrystal(300,1,1);});
				}
			}
		}
	}
	

	
})();