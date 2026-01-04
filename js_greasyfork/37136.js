// ==UserScript==
// @name         cs大大給的工作-0001
// @namespace    http://tampermonkey.net/
// @version      1.00.0000
// @description  ♪
// @author       sup初音姐姐
// @match        https://acgn-stock.com/accountInfo/*
// @match        https://museum.acgn-stock.com/accountInfo/*
// @match        https://test.acgn-stock.com/accountInfo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37136/cs%E5%A4%A7%E5%A4%A7%E7%B5%A6%E7%9A%84%E5%B7%A5%E4%BD%9C-0001.user.js
// @updateURL https://update.greasyfork.org/scripts/37136/cs%E5%A4%A7%E5%A4%A7%E7%B5%A6%E7%9A%84%E5%B7%A5%E4%BD%9C-0001.meta.js
// ==/UserScript==

const htmls =
[
  `<button id="bt_miku_savelog"class="btn btn-primary" onclick="
var thisbt = document.getElementById('bt_miku_savelog');
thisbt.disabled = true;

var loginlog='';
//var logs_All = [];
var logs_temp = [];
var find ='登入了系統！';
var Donotfind1 ='【舉報違規】';
var Donotfind2 ='【違規處理】';
var Donotfind3 ='【通報金管】';
var time = new Date();
function observeLoadingOverlay() {
	var loading = document.getElementById('loading').getElementsByClassName('loadingOverlay d-none').length;//載入狀態
	if(loading=='1'){
		console.log('非載入狀態');
		setTimeout(savelog, 1000);
		return;
	}else{
		console.log('載入狀態');
		setTimeout(observeLoadingOverlay, 1000);
		return;
	}
}

function savelog(){
	var thispage = document.getElementsByClassName('page-item active')[document.getElementsByClassName('page-item active').length-1].getElementsByClassName('page-link')[0].innerText;	//當前頁碼
	//var lastpage = document.getElementsByClassName('page-item')[document.getElementsByClassName('page-item').length-1].getElementsByClassName('page-link')[0].href.replace(/\\D/g,'');	//最末頁(使用正規表示法取代連結中非數字字元取得)
	var lastpage = document.getElementsByClassName('page-link')[document.getElementsByClassName('page-link').length-1].href.replace(/\\D/g,'');	//最末頁(使用正規表示法取代連結中非數字字元取得)
	if(thispage!=lastpage){//當前頁非最尾頁時
		var logs_length = document.getElementsByClassName('logData').length;	//log數量
		var logs_temp = [];
		if(logs_length!='30'){
		console.log('log數量未載入完畢，2秒後重試');
		setTimeout(observeLoadingOverlay, 2000);
		return;
		}else{
			for(var i=0;i<logs_length;i++){
				logs_temp[logs_temp.length]=document.getElementsByClassName('logData')[i].outerText.trim();	//log放進暫存
				if( /* logs_All.indexOf(logs_temp[i])!='-1'|| */ logs_temp[i]===undefined||logs_temp[i]==null||logs_temp[i]==''){//檢查是否因為LAG還在讀取公司
				//	if(logs_All.indexOf(logs_temp[i])!='-1'){
				//		console.log('已存在【'+logs_temp[i]+'】的log，2秒後重試！');
				//	}else{
						console.log('發現存在空白的log，2秒後重試！');
				//	}
				setTimeout(observeLoadingOverlay, 2000);
				return;
				}
			}
			for(var i=0;i<logs_length;i++){
				var check = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(find);	//log檢查
				var check1 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind1);	//log檢查
				var check2 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind2);	//log檢查
				var check3 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind3);	//log檢查
				if(check!='-1'&&check1=='-1'&&check2=='-1'&&check3=='-1'){
					loginlog = loginlog + document.getElementsByClassName('logData')[i].outerText.trim() + '\\r\\n';
				}
			}
			console.log('第' + thispage + '頁的log已檢查完，翻頁後延遲3.1秒再次執行！');
			document.getElementsByClassName('page-link')[document.getElementsByClassName('page-link').length-2].click(); //點下一頁
			setTimeout(observeLoadingOverlay, 3100);
		}
	}else{//當最尾頁時
		var logs_length = document.getElementsByClassName('logData').length;	//log數量
		var logs_temp = [];
			for(var i=0;i<logs_length;i++){
				logs_temp[logs_temp.length]=document.getElementsByClassName('logData')[i].outerText.trim();	//log放進暫存
				if( /* logs_All.indexOf(logs_temp[i])!='-1'|| */ logs_temp[i]===undefined||logs_temp[i]==null||logs_temp[i]==''){//檢查是否因為LAG還在讀取公司
				//	if(logs_All.indexOf(logs_temp[i])!='-1'){
				//		console.log('已存在【'+logs_temp[i]+'】的log，2秒後重試！');
				//	}else{
						console.log('發現存在空白的log，2秒後重試！');
				//	}
				setTimeout(observeLoadingOverlay, 2000);
				return;
				}
			}
			for(var i=0;i<logs_length;i++){
				var check = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(find);	//log檢查
				var check1 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind1);	//log檢查
				var check2 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind2);	//log檢查
				var check3 = document.getElementsByClassName('logData')[i].outerText.trim().indexOf(Donotfind3);	//log檢查
				if(check!='-1'&&check1=='-1'&&check2=='-1'&&check3=='-1'){
					loginlog = loginlog + document.getElementsByClassName('logData')[i].outerText.trim()+ '\\r\\n';
				}
			}
			console.log('顯示結果：\\r\\n' + loginlog);//顯示結果
			var text = window.location.href+'\\r\\n' +loginlog;
			var filename = document.getElementsByClassName('card-title')[0].innerText.replace('使用者「','').replace('」帳號資訊','')+'('+time.getFullYear() + '-' + ( ( time.getMonth() + 1 ) < 10 ? '0'+ ( time.getMonth() + 1 ) : ( time.getMonth() + 1 ) ) + '-' + ( time.getDate() < 10 ? '0'+ time.getDate() : time.getDate() ) + ' ' + ( time.getHours() < 10 ? '0'+ time.getHours() : time.getHours() ) + '-' + ( time.getMinutes() < 10 ? '0'+ time.getMinutes() : time.getMinutes() )+')';
			var textFileAsBlob = new Blob([text],{type:'text/plain'});
			var downloadLink = document.createElement('a');
			downloadLink.download = filename;
			downloadLink.innerHTML = 'Download File';
			if (window.webkitURL != null) {
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
			} else {
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = 'none';
				document.body.appendChild(downloadLink);
			}
			downloadLink.click();
			console.log('已另存檔案為' + filename + '.txt');
			thisbt.disabled = false;
	}
}
observeLoadingOverlay();
  ">savelog()</button>`
];
var delay = 495;
var mikuinit = function(step)
{
   /*
     0: open log
     1: show all log
     2: create button
  */
  console.log(`step ${step}`);
  switch(step)
  {
    case 0:
      var vs = document.getElementsByClassName('d-block h4');
      if(vs!==undefined && vs[3]!==undefined)
      {
        vs[3].click();
        step++;
      }
      break;
    case 1:
      var vs = document.getElementsByClassName('btn btn-outline-info btn-sm mt-1');
      if(vs!==undefined && vs[0]!==undefined)
      {
        vs[0].click();
        step++;
      }
      break;
    default:
      setTimeout(function()
      {
        //add button
        var vs = document.getElementsByClassName('nav-item');
        var v = vs[vs.length-4];
        var s = '';
        for(var i in htmls)
          s += htmls[i];
        v.innerHTML = s;
      }, 495);
      return;
  }
  setTimeout(function(){mikuinit(step);}, delay);
};

function mikuloading()
{
  if(document.getElementsByClassName('card-block').length<2) //loading
  {
    console.log('still loading');
    setTimeout(mikuloading, 1000);
  }
  else
  {
    console.log('ready');
    mikuinit(0);
  }
}

(function() {
    'use strict';

    // Your code here...
    mikuloading();
})();