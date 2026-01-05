// ==UserScript==
// @name           mcmc5
// @namespace      MCMC5
// @version        1.0
// @description    むーちー５　簡易総得点計算スクリプト
// @include        http://2.pro.tok2.com/%7Ereflection/MCMC/*
// @include        http://2.pro.tok2.com/~reflection/MCMC/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10037/mcmc5.user.js
// @updateURL https://update.greasyfork.org/scripts/10037/mcmc5.meta.js
// ==/UserScript==

var mc_no = location.search.replace('?no=',''); //url取得
var mc = 'tona';

if(mc_no >= 267){
	$(function(){
		setTableid();
		getMCpoint();
	});
}

function setTableid(){
	var table = $("table");
	var top_cell;
	for(var i=0; i<table.length; i++){
		var cells = table.eq(i).find("td");
		if(i == 0) top_cell = cells.eq(0);
		if(cells.eq(1).text() == '順位'){
			top_cell.find("center").prepend('<a href="#set" style="color:#FFFF00;">[順位表]</a>　');
			if( top_cell.text().match("予選") ) mc_stage = 'yosen';
			table.eq(i).attr("id","set");
		}
	}
}

function getMCpoint(){
	//チーム別テキストカラー
	var mc_color = [];
	mc_color[0] = "#f33";
	mc_color[1] = "#33f";
	mc_color[2] = "#393";
	mc_color[3] = "#f60";
	mc_color[4] = "#60f";
	mc_color[5] = "#666";
	mc_color[6] = "#f33";
	mc_color[7] = "#33f";
	mc_color[8] = "#393";
	mc_color[9] = "#f60";
	mc_color[10] = "#60f";
	mc_color[11] = "#666";
	mc_color[12] = "#f33";
	mc_color[13] = "#33f";
	mc_color[14] = "#393";
	mc_color[15] = "#f60";
	
	//チーム別背景カラー
	var mc_bgcolor = [];
	mc_bgcolor[0] = "#fcc";
	mc_bgcolor[1] = "#ccf";
	mc_bgcolor[2] = "#cfc";
	mc_bgcolor[3] = "#ffc";
	mc_bgcolor[4] = "#fcf";
	mc_bgcolor[5] = "#ccc";
	mc_bgcolor[6] = "#fee";
	mc_bgcolor[7] = "#eef";
	mc_bgcolor[8] = "#efe";
	mc_bgcolor[9] = "#ffe";
	mc_bgcolor[10] = "#fef";
	mc_bgcolor[11] = "#eee";
	mc_bgcolor[12] = "#faa";
	mc_bgcolor[13] = "#aaf";
	mc_bgcolor[14] = "#afa";
	mc_bgcolor[15] = "#ffa";
	
	var mc_total = {};		//チーム名id -> 合計得票
	var team_id = {};		//チーム名id -> チームid
	var team_name = {};		//チーム名id -> チーム名
	var memb_id = {};		//メンバー名 -> チームid
	var memb_mc ={};		//メンバー名 -> 得票
    
    var team_cnt = 0;
    
	var tr = $("table#set tr");//全行を取得
	for( var i=2,l=tr.length;i<l;i++ ){
		var cells = tr.eq(i).children();//1行目から順にth、td問わず列を取得
		var team_name_tmp = cells.eq(6).text().replace(/\s/, "");
		var team_name_id = team_name_tmp.substring(0,2);
		team_name_id = team_name_id.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
			 return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});
		var memb_name = cells.eq(5).text().replace(/\s/, "");
		
		//チームデータ初期化
		if( typeof mc_total[team_name_id] == "undefined" ){
			mc_total[team_name_id] = 0;
			team_id[team_name_id] = team_cnt;
			team_name[team_name_id] = team_name_tmp;
			team_cnt++;
		}
		if( typeof memb_id[memb_name] == "undefined" ){
			memb_id[memb_name] = team_id[team_name_id];
			memb_mc[memb_name] = 0;
		}
		
		//チーム別カラーリング
		var colorid = team_id[team_name_id] % 16;
		tr.eq(i).css("background-color",mc_bgcolor[colorid]);
		
		//得点計算
		var mc_point = 0;
		mc_point = Number(cells.eq(1).text());
		memb_mc[memb_name] += mc_point;

		mc_total[team_name_id] += mc_point;
		
		//得票表示
		var mc_vote = Number(cells.eq(2).text()) + Number(cells.eq(3).text()) + Number(cells.eq(4).text());
		cells.eq(1).text(cells.eq(1).text() + '点')
		           .append(' <font size="-1">(' + mc_vote + '票)</font>');
	}
	//結果表示
	$("table#set").parents("tbody").append('<tr><td colspan="2"><table id="team" border="1" cellspacing="1" cellpadding="3" bordercolor="#636363" bgcolor="ffffff"></table></td></tr>');
    $("table#set").after('<br>');
	
	var mc_keys = [];
    var memb_keys = [];
    
    for (var key in mc_total) {
		mc_keys.push(key);
	}
    for (var key in memb_id) {
		memb_keys.push(key);
	}
	
	mc_keys.sort(function(a,b){
		return (mc_total[a] < mc_total[b]) ? 1 : -1 ;
	});
    memb_keys.sort(function(a,b){
        return (memb_mc[a] < memb_mc[b]) ? 1 : -1 ;
    });
    
	for (var xxx in mc_keys) {
		var i = mc_keys[xxx];
		var colorid = team_id[i] % 16;
		var memb_html = "";
        var memb_td="";

        for (var j in memb_keys) {
            var k = memb_keys[j];
			if(memb_id[k] == team_id[i]){
                memb_html = k + '<font color="' + mc_color[colorid] + '"> (+' + memb_mc[k] + ')</font>';
                memb_td += '<td><font size="-1">' + memb_html + '</font></td>'
			}
		}
        


		$("table#team").append('<tr bgcolor="' + mc_bgcolor[colorid] + '">'
		               + '<td><font size="-1">' + team_name[i] + '</font></td>'
		               + '<td align="center">' + mc_total[i] + '</td>'
                       + memb_td +
		               + '</tr>');
	}
	
    
    //team 列数取得
    var column_len=$("table#team")[0].rows[0].cells.length;
	$("table#team").prepend('<tr bgcolor="#f3ccc5"><TD><FONT size=-1>チーム名</FONT></TD><TD><FONT size=-1>総得点</FONT></TD><TD colspan=' + (column_len - 2) + '><FONT size=-1>メンバー</FONT></TD></tr>');
	//スクリプト説明
    
	$("table#team").after('<br><br><table id="info" border="1" cellspacing="1" cellpadding="1" bordercolor="#636363" bgcolor="#ffffff"></table>');
	$("table#info").append('<tr bgcolor="#f3ccc5"><TD><FONT size=-1>スクリプト説明 ver1.00(2015.05.24)</FONT></TD></tr>')
	               .append('<tr bgcolor="#fffff"><td><FONT size=-1>'
	               + '■むーちー５用総得票簡易計算スクリプトです。<br>'
	               + '■現在の情報のみで総得票を計算しています。<br>　実際は無効票等の可能性があるため、正式な結果とは異なる場合があります。<br>'
	               + '■このスクリプトはユンケルライフ氏のスクリプト（むーちー３）と<br>　べとん氏のスクリプト（むーちー４）を参考に作成しております。<br>'
	               + '■むーちー３、４のスクリプトが有効になっていると誤作動を起こすかもしれません。<br>'
	               + '■最新版は<a href="http://d.hatena.ne.jp/likeparadox/" target="_blank">こちら</a>を確認して下さい。<br>'
	               + '■(c)パラドクス的なね <a href="http://twitter.com/likeparadox" target="_blank">twitter(@likeparadox)</a>'
	               + '</font></td></tr>');
}


