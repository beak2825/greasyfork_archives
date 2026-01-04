// ==UserScript==
// @name        bro3_all_acrap
// @namespace   bro3_all_acrap
// @description ブラウザ三国志 複数削除
// @include     http://*.3gokushi.jp/village.php*
// @include     https://*.3gokushi.jp/village.php*
// @version     2019.10.18
// @author      ALMIC
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369992/bro3_all_acrap.user.js
// @updateURL https://update.greasyfork.org/scripts/369992/bro3_all_acrap.meta.js
// ==/UserScript==

var j$ = jQuery.noConflict();

var maxlv = {
	"畑" 		: 15,
	"倉庫" 		: 20,
	"伐採所"	: 15,
	"石切り場"	: 15,
	"製鉄所"	: 15,
	"練兵所"	: 10,
	"銅雀台"	: 10,
	"研究所"	: 10,
	"宿舎"		: 15,
	"鍛冶場"	: 10,
	"防具工場"	: 10,
	"兵舎"		: 15,
	"弓兵舎"	: 15,
	"厩舎"		: 15,
	"市場"		: 10,
	"訓練所"	: 10,
	"見張り台"	: 20,
	"兵器工房"	: 15,
	"大宿舎"	: 20,
	"遠征訓練所"	: 20,
	"水車"		: 10,
	"工場"		: 10,
	"砦"		: 15,
	"村"		: 15,
	"城"		: 20
};

var count = 1;
var title = [];
var href = [];
var lv = [];
var ssid;

var protocol = location.protocol;
var host = location.hostname;
var path = location.pathname;


j$(function(){
console.log("####   auto build up   ####");


		village();

});

function select_facility(){	
	
	j$(".lvupFacility").each(function(i){
	var append_string = '<button type="button" id="auto_buildup'+i+'" style="color:red;">作成</button>';
			j$(this).append(append_string);
			j$(this).append('<div id="buildup_m'+i+'"></div>');
			});
	j$(".lvupFacility").append('<div id="buildup_m1"></div>');

	for(i = 0;i < j$(".lvupFacility").length;i++){
		var target = "#auto_buildup"+i;
		j$(target).on('click',function(){
			var id = j$(this).attr('id');
			var index = id.match(/auto_buildup(\d+)/)[1] - 0;
			build(index+1);

			
		});
	}
}

function build(i){
	var target = "form[name='facilityCreateForm"+i+"']";
	var form = j$(target);
	var params = form.serialize();
	

	j$.ajax({
		method: "POST",
		url: protocol+"//"+host+"/facility/build.php",
		headers:{
		"Content-Type": "application/x-www-form-urlencoded"
		},
		data: params,
		timeout:10000,
		success: function(data){
			j$("#buildup_m"+i).text("完了");
			location.href = "../village.php";
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(data.textStatus);
		}

	});


}

function facility(){	
	var target = j$(".mainTtl").text();
	current_lv = parseInt(target.match(/レベル([0-9]+)/)[1]);
	var kind = j$("#gray02Wrapper h2:first").text();

	if(maxlv[kind] == current_lv)return;

	var append_string = '<button type="button" id="auto_buildup" style="color:red;">LVUP</button>' +
					'<select id="auto_lv">';

	for(var i=current_lv+1;i<=maxlv[kind];i++){
		append_string += '<option value="'+i+'">'+i+'</option>';
		}
	append_string += '</select>';
	
	j$(".lvupFacility").append(append_string);
	j$(".lvupFacility").append('<div id="buildup_m1"></div>');



	j$("#auto_buildup").on('click',function(){
		buildup(document,j$("#auto_lv").val() - current_lv,"",0);
		
	});
}


function village(){

	var append_string = 	'<div class="sideBox"><div class="sideBoxHead"><h3><strong>削除</strong></h3></div><div class="sideBoxInner"><ul>';

	append_string +=	
				'<li><button type="button" id="auto_capacity_scrap" style="width:100px;">倉庫削除</button></li>' +
				'<li><button type="button" id="auto_field_scrap" style="width:100px;">畑削除</button></li>' +
				'<li><button type="button" id="auto_billet_scrap" style="width:100px;">宿舎削除</button></li>' +
				'<li><button type="button" id="auto_great_billet_scrap" style="width:100px;">大宿舎削除</button></li>' +
				'<li><button type="button" id="auto_all_scrap" style="width:100px;">全部削除</button></li>';
	append_string += '<li id="scrap_m2"></li>';
	append_string += '<li id="scrap_m1"></li></ul></div></div>';


	j$(".sideBox:last").after(append_string);	

	var areas = j$("area");
	for(var ii=0;ii<areas.length;ii++){
		title[ii] = areas.eq(ii).attr("title").match(/(\S+)/)[1];
		href[ii] = areas.eq(ii).attr("href");
		var temp = areas.eq(ii).attr("title").match(/([0-9]+)/);
		if(temp)lv[ii] = temp[1];
	}
	var html = j$("head").html();
	ssid = html.match(/ CHAT_TOKEN = '(.*?)'/)[1];
	j$("#auto_capacity_scrap").on('click',function(){
		autobuildup("倉庫");
		
	});
	j$("#auto_field_scrap").on('click',function(){
		autobuildup("畑");
		
	});
	j$("#auto_billet_scrap").on('click',function(){
		autobuildup("宿舎");
		
	});
	j$("#auto_great_billet_scrap").on('click',function(){
		autobuildup("大宿舎");
		
	});
	j$("#auto_all_scrap").on('click',function(){
		autobuildup("*");
		
	});


}

function autobuildup(t_target){
console.log("all scrap["+t_target+"]");
	for(var i=0;i<49;i++){
		var elm = title[i];
		var target = t_target == "*" ? elm : t_target;
		if(elm !== target ){
			continue;
		}

		var x,y;
		x = href[i].match(/x=([0-9])/)[1];
		y = href[i].match(/y=([0-9])/)[1];
		var url = "facility/facility.php";

console.log(url);
console.log(ssid);
console.log(x);
console.log(y);


		j$.ajax({
			method: "post",
			url: url,
			data : {
				"ssid" 	: ssid,
				"x"	: x,
				"y"	: y,
				"remove": "建物を壊す"

			},
			success: function(data){
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				console.log(data.textStatus);
			}

		});
	}
}


