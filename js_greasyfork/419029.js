// ==UserScript==
// @name         DAM★とも精密採点データ取得
// @version      3.0
// @description  精密採点Ai HeartとAiとDX-Gの採点結果の詳細数値データをテキストファイルで取得
// @author       kamken
// @match        https://www.clubdam.com/app/damtomo/MyPage.do
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419029/DAM%E2%98%85%E3%81%A8%E3%82%82%E7%B2%BE%E5%AF%86%E6%8E%A1%E7%82%B9%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/419029/DAM%E2%98%85%E3%81%A8%E3%82%82%E7%B2%BE%E5%AF%86%E6%8E%A1%E7%82%B9%E3%83%87%E3%83%BC%E3%82%BF%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==
'use strict';
function enc(str){
	str=str.replaceAll('%','%25');
	str=str.replaceAll(' ','%20');
	str=str.replaceAll('!','%21');
	str=str.replaceAll('#','%23');
	str=str.replaceAll('$','%24');
	str=str.replaceAll('&','%26');
	str=str.replaceAll("'",'%27');
	str=str.replaceAll('(','%28');
	str=str.replaceAll(')','%29');
	str=str.replaceAll('*','%2A');
	str=str.replaceAll('+','%2B');
	str=str.replaceAll(',','%2C');
	str=str.replaceAll('/','%2F');
	str=str.replaceAll(':','%3A');
	str=str.replaceAll(';','%3B');
	str=str.replaceAll('=','%3D');
	str=str.replaceAll('?','%3F');
	str=str.replaceAll('@','%40');
	str=str.replaceAll('[','%5B');
	str=str.replaceAll(']','%5D');
	return str;
};
(function(){
	var tgt=document.getElementById('DamHistory');
    tgt.insertAdjacentHTML('beforebegin','現在表示されている履歴の詳細データを保存します。<br>');
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_HeartsDetailSave>Heartりれきデータ取得　</button>　　');
	document.getElementById('btn_HeartsDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingHeartsListResult');
		var len=hv.getElementsByClassName('btn_HeartsDetail').length;
		if(len>0){savehearts(hv);};
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_HeartsSaveDetailSave>Heart保存リストデータ取得</button>　<br>');
	document.getElementById('btn_HeartsSaveDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingHeartsSaveListResult');
		var len=hv.getElementsByClassName('btn_HeartsDetail').length;
		if(len>0){savehearts(hv);};
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_AiDetailSave>Aiりれきデータ取得　　　</button>　　');
	document.getElementById('btn_AiDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingAiListResult');
		var len=hv.getElementsByClassName('btn_AiDetail').length;
		if(len>0){saveai(hv);};
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_AiSaveDetailSave>Ai保存リストデータ取得　　　</button><br>');
	document.getElementById('btn_AiSaveDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingAiSaveListResult');
		var len=hv.getElementsByClassName('btn_AiDetail').length;
		if(len>0){saveai(hv);};
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_DxGDetailSave>DX-Gりれきデータ取得　</button>　　');
	document.getElementById('btn_DxGDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingDxGListResult');
		var len=hv.getElementsByClassName('btn_DxGDetail').length;
		if(len>0){savedxg(hv);};
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_DxGSaveDetailSave>DX-G保存リストデータ取得　</button><br>');
	document.getElementById('btn_DxGSaveDetailSave').addEventListener('click',function(){
		var hv=document.getElementById('DamHistoryMarkingDxGSaveListResult');
		var len=hv.getElementsByClassName('btn_DxGDetail').length;
		if(len>0){savedxg(hv);};
	});
    tgt.insertAdjacentHTML('beforebegin','コメントの一覧を取得します。<br>');
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_HeartsComment>Heartコメント一覧取得</button>　　　');
	document.getElementById('btn_HeartsComment').addEventListener('click',function(){
		jQuery.ajax({
			type:'GET',
			url:'/damtomo/shared/xml/analysisReportCommentHeart.xml',
			dataType:'html',
			success:function(data,textStatus){
				var a=document.createElement('a');
				a.href='data:text,'+enc(data);
				a.download="analysisReportCommentHeart.txt";
				a.click();
			}
		});
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_AiComment>Aiコメント一覧取得</button>　　　');
	document.getElementById('btn_AiComment').addEventListener('click',function(){
		jQuery.ajax({
			type:'GET',
			url:'/damtomo/shared/xml/analysisReportCommentAi.xml',
			dataType:'html',
			success:function(data,textStatus){
				var a=document.createElement('a');
				a.href='data:text,'+enc(data);
				a.download="analysisReportCommentAi.txt";
				a.click();
			}
		});
	});
	tgt.insertAdjacentHTML('beforebegin','<button id=btn_DxGComment>DX-Gコメント一覧取得</button><br>');
	document.getElementById('btn_DxGComment').addEventListener('click',function(){
		jQuery.ajax({
			type:'GET',
			url:'/damtomo/shared/xml/analysisReportComment.xml',
			dataType:'html',
			success:function(data,textStatus){
				var a=document.createElement('a');
				a.href='data:text,'+enc(data);
				a.download="analysisReportComment.txt";
				a.click();
			}
		});
	});
	function savehearts(hv){
		var i=-1;
		var si=setInterval(function(){
			i++;
			var obj=hv.getElementsByClassName('btn_HeartsDetail')[i];
			jQuery.ajax({
				type:'POST',
				url:'/app/damtomo/scoring/GetScoringHeartsListXML.do',
				data:'scoringHistoryId='+obj.getAttribute('data-scoringhistoryid')+'&cdmCardNo='+jQuery('#cdmCardNo').val()+'&cdmToken='+jQuery('#cdmToken').val()+'&detailFlg=1&enc='+encname,
				dataType:'html',
				success:function(xml){
					var a=document.createElement('a');
					a.href='data:text,'+enc(xml);
					a.download='hearts_'+obj.getAttribute('data-scoringhistoryid')+'.txt';
					a.click();
				}
			});
			if(i>=hv.getElementsByClassName('btn_HeartsDetail').length-1){
				clearInterval(si);
			};
		},10);
	};
	function saveai(hv){
		var i=-1;
		var si=setInterval(function(){
			i++;
			var obj=hv.getElementsByClassName('btn_AiDetail')[i];
			jQuery.ajax({
				type:'POST',
				url:'/app/damtomo/scoring/GetScoringAiListXML.do',
				data:'scoringAiId='+obj.href.substr(36)+'&cdmCardNo='+jQuery('#cdmCardNo').val()+'&cdmToken='+jQuery('#cdmToken').val()+'&detailFlg=1&enc='+encname,
				dataType:'html',
				success:function(xml){
					var a=document.createElement('a');
					a.href='data:text,'+enc(xml);
					a.download='ai_'+obj.href.substr(36)+'.txt';
					a.click();
				}
			});
			if(i>=hv.getElementsByClassName('btn_AiDetail').length-1){
				clearInterval(si);
			};
		},10);
	};
	function savedxg(hv){
		var i=-1;
		var si=setInterval(function(){
			i++;
			var obj=hv.getElementsByClassName('btn_DxGDetail')[i];
			jQuery.ajax({
				type:'POST',
				url:'/app/damtomo/scoring/GetScoringDxgListXML.do',
				data:'scoringDxgId='+obj.href.substr(36)+'&cdmCardNo='+jQuery('#cdmCardNo').val()+'&cdmToken='+jQuery('#cdmToken').val()+'&detailFlg=1&enc='+encname,
				dataType:'html',
				success:function(xml){
					var a=document.createElement('a');
					a.href='data:text,'+enc(xml);
					a.download='dxg_'+obj.href.substr(36)+'.txt';
					a.click();
				}
			});
			if(i>=hv.getElementsByClassName('btn_DxGDetail').length-1){
				clearInterval(si);
			};
		},10);
	};
})();
