// ==UserScript==
// @name				CustomGinnamaWatch
// @include				http://live.nicovideo.jp/watch/*
// @version				2.0.5
// @namespace		http://d.hatena.ne.jp/wfwjfow/
// @description		ニコニコ生放送:GINZAの生放送プレイヤーのUIをお手軽カスタマイズ。
// @grant				GM_getValue
// @grant				GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/4398/CustomGinnamaWatch.user.js
// @updateURL https://update.greasyfork.org/scripts/4398/CustomGinnamaWatch.meta.js
// ==/UserScript==
/*
参考スクリプト
NicoRankingKidokuDelete　→　http://userscripts.org/scripts/show/45927
参考サイト
http://userscripts.org/topics/43597
http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
http://www.webopixel.net/javascript/160.html
*/


(function() {

if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {

GM_getValue = function(name, defaultValue) {
var value = localStorage.getItem(name);
if (!value)
return defaultValue;
var type = value[0];
value = value.substring(1);
switch (type) {
case 'b':
return value == 'true';
case 'n':
return Number(value);
default:
return value;
}
}
GM_setValue = function(name, value) {
value = (typeof value)[0] + value;
localStorage.setItem(name, value);
}
if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; } 
}

	//ウォール消去
	function walloff(){
		if( GM_getValue("walloff")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#wall_canvas{display:none!important;}#wall_chip_area{display:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);
		}
	}
	//広告消去
	function senCut2(){
		if( GM_getValue("senden2")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#ad_bnr,#footer_ads,#jsFollowingAdContent{display:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);
		}
	}
	//宣伝ボタン消去
	function senCut3(){
		if( GM_getValue("senden3")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#watch_title_box .niconikoukoku{display:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);
		}
	}
	//フッター消去
	function footcut(){
		if( GM_getValue("footer_off")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#page_footer,#body_footer_wrap{display:none!important;}#watch_tab_box{border-bottom:0!important;box-shadow:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);

			
			if(window.parent.location.href.slice(0,35)=="http://live.nicovideo.jp/watch/nsen"){
				var pstyle = document.createElement('style');
				pstyle.setAttribute('type','text/css');
				var css2 = '#utility_link,#page_footer,#body_footer_wrap{display:none!important;}';
				pstyle.innerHTML = css2;
				document.getElementsByTagName('head')[0].appendChild(pstyle);
			}
		}
	}
	//ヘッダー開閉式に
	function headcut(){
		if( GM_getValue("head_off")=="on"){

			var headbar = document.createElement("div");
			headbar.id = "headbar";
			document.body.appendChild(headbar);

			var hedda = document.getElementById("siteHeader");

			if(GM_getValue("heddadisplay","")=="none"){
				hedda.style.display="none";
			};
			
			headbar.addEventListener("click",function(e){
				hedda.style.display = 
					(hedda.style.display　== "") ? "none" : "";
					GM_setValue("heddadisplay",hedda.style.display);
			},false);

			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = 'body{padding-top:0!important;}body #content{padding-top:5px!important;}body.nofix #siteHeader{position:relative!important;z-index:99999999!important;}#headbar{background-color:#222222;position:fixed;top:0;font-size:0px;display:block;width:100%;height:5px;z-index:999999999;cursor:pointer;margin-left:0!important;}#content{background-color:#000000!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);
		}
	}
	//市場消去
	function ichibaCut(){
		if( GM_getValue("ichiba_off")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#advertisement_box{display:none!important;}div#watch_tab_box{background:transparent!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);
		}
	}
	//ザッピングを消去
	function zappingCut(){
		if( GM_getValue("zapping_off")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#watch_zapping_box{display:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);

			if(window.parent.location.href.slice(0,35)=="http://live.nicovideo.jp/watch/nsen"){
				var pstyle = document.createElement('style');
				pstyle.setAttribute('type','text/css');
				var css2 = '{display:none!important;}';
				pstyle.innerHTML = css2;
				document.getElementsByTagName('head')[0].appendChild(pstyle);
			}
		}
	}
	//使い方・共有等を消去
	function helpCut(){
		if( GM_getValue("help_off")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#watch_player_bottom_box{display:none!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);

			if(window.parent.location.href.slice(0,35)=="http://live.nicovideo.jp/watch/nsen"){
				var pstyle = document.createElement('style');
				pstyle.setAttribute('type','text/css');
				var css2 = '#player_btm{display:none!important;}div#reqBoxRule{display:none!important;}#mylistArea{margin:0!important;padding:0!important;}';
				pstyle.innerHTML = css2;
				document.getElementsByTagName('head')[0].appendChild(pstyle);
			}
		}
	}
	//ロゴ・検索ボックス消去
	function logoCut(){
		if( GM_getValue("logo_off")=="on"){
			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#page_header{display:none!important;}#page_cover{margin-top:0px!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);

			if(window.parent.location.href.slice(0,35)=="http://live.nicovideo.jp/watch/nsen"){
				var pstyle = document.createElement('style');
				pstyle.setAttribute('type','text/css');
				var css2 = 'div.headerInner{display:none!important;}div#header{margin-top:20px!important;}';
				pstyle.innerHTML = css2;
				document.getElementsByTagName('head')[0].appendChild(pstyle);
			}
		}
	}
	//ページ左右余白リンク消去
	function dellink(){
		if( GM_getValue("link_off")=="on"){
			if(window.parent.location.href.slice(0,35)!="http://live.nicovideo.jp/watch/nsen"){
			
			var divleft=document.createElement("div");
			var divright=document.createElement("div");
			divleft.id="divleft";
			divright.id="divright";
			document.body.appendChild(divleft);
			document.body.appendChild(divright);

			var divwidth=parseInt( (document.body.clientWidth-960)/2 +1 );
			divleft.style.width=divwidth+"px";
			divright.style.width=divwidth+"px";
			
			var pagewidth=parseInt( (document.body.clientWidth-960)/2 +1 );
			document.getElementById("prefDiv").style.right=pagewidth+"px";

			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#divleft{position:absolute;top:0;left:0;height:100%;background-color:#F4F4F4;z-index:9999999;}#divright{position:absolute;top:0;right:0;height:100%;background-color:#F4F4F4;z-index:99999;}#siteHeader #siteHeaderInner{width:984px!important;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);


			window.onresize = function() {
				var divwidth=parseInt( (document.body.clientWidth-960)/2 +1 );
				divleft.style.width=divwidth+"px";
				divright.style.width=divwidth+"px";
				
				var pagewidth=parseInt( (document.body.clientWidth-960)/2 +1 );
				document.getElementById("prefDiv").style.right=pagewidth+"px";
			}

			
			}
		}
	}
	//上のニュース消去
	function delnews(){
		if( GM_getValue("delnews")=="on"){

			var divdelnews=document.createElement("div");
			divdelnews.id="divdelnews";
			document.body.appendChild(divdelnews);
			document.getElementById("slider_container").appendChild(divdelnews);

			var oStyle = document.createElement('style');
			oStyle.setAttribute('type','text/css');
			var css = '#divdelnews{background-color:#F4F4F4;z-index:9999999;width:100%;height:60px;position:absolute;top:7px;}.JS_PLAYER_FULL #divdelnews{z-index:-100;background-color:#222222;}';
			oStyle.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(oStyle);

		}
	}


	function labelElement(str,che){
		var k = document.createElement("label");
		k.innerHTML = str;
		k.style.cursor = "hand";
		k.setAttribute("for",che);
		k.style.fontSize = "12px";
		return k;
	}

	function interface_kidoku(){
		var prefDiv = document.createElement("div");
			prefDiv.style.width = "300px";
			prefDiv.style.height = "240px";
			prefDiv.style.overflowY = "scroll";
			prefDiv.innerHTML = "GinnamaWatchカスタマイズ設定" + "<br>";
			prefDiv.style.backgroundColor = "#ccccff";
			prefDiv.style.color = "black";
			prefDiv.style.border = "1px solid #888";
			prefDiv.style.position = "fixed";
			prefDiv.style.bottom = "0px";
			prefDiv.style.right = "0px";
			prefDiv.style.textAlign = 'left';
			prefDiv.style.margin = "0 0 0 0";
			prefDiv.style.zIndex = 999;
			prefDiv.style.display = 
				(GM_getValue("prefDisplay") == "none") ? "none" : "";
			prefDiv.id = "prefDiv";
			document.body.appendChild(prefDiv);

		var tojiru=document.createElement("div");
		tojiru.innerHTML = "閉じる";
		tojiru.style.position = "absolute";
		tojiru.style.top = "0px";
		tojiru.style.right = "5px";
		tojiru.style.color="#00BFFF";
		tojiru.style.cursor = "pointer";
		tojiru.id="tojiru";


		var linkwalloff = document.createElement("input");
			linkwalloff.name = "walloff";
			linkwalloff.caption = "ウォール消去";
		var linkSen2 = document.createElement("input");
			linkSen2.name = "senden2";
			linkSen2.caption = "Flash上以外の広告を消去";
		var linkichiba = document.createElement("input");
			linkichiba.name = "ichiba_off";
			linkichiba.caption = "市場消去";
		var linksencut = document.createElement("input");
			linksencut.name = "senden3";
			linksencut.caption = "宣伝ボタン消去";
		var linklist = document.createElement("input");
			linklist.name = "zapping_off";
			linklist.caption = "ザッピングを消去";
		var linkfootcut = document.createElement("input");
			linkfootcut.name = "footer_off";
			linkfootcut.caption = "フッター消去";
		var linkhelp = document.createElement("input");
			linkhelp.name = "help_off";
			linkhelp.caption = "使い方・共有等を消去";
		var linklogocut = document.createElement("input");
			linklogocut.name = "logo_off";
			linklogocut.caption = "ロゴ・検索ボックス消去";
		var linkdellink = document.createElement("input");
			linkdellink.name = "link_off";
			linkdellink.caption = "ページ左右余白リンクを消去";
		var linkheadcut = document.createElement("input");
			linkheadcut.name = "head_off";
			linkheadcut.caption = "ヘッダーを開閉式に";
		var linkdelnews = document.createElement("input");
			linkdelnews.name = "delnews";
			linkdelnews.caption = "上のニュース消去";

		var form = document.createElement("form");

		var links = 
			[linkSen2,linkichiba,linkfootcut,linklist,linkhelp,linkdellink,linklogocut,linkheadcut,linkwalloff,linksencut,linkdelnews];

		for (var i=0;i<links.length;i++){
				links[i].type = "checkbox";
				links[i].defaultValue = "off";
		}

		for (var i=0;i<links.length;i++){
			if (!GM_getValue(links[i].name)) {
				GM_setValue(links[i].name, links[i].defaultValue);
			}
				links[i].id = links[i].name;
				links[i].checked = (GM_getValue(links[i].name) != "on") ? false : true;
				links[i].addEventListener("click", function(e){
					GM_setValue(this.name, (GM_getValue(this.name) != "on") ? "on" : "off");
				}, true);
		}

		//登録
		form.appendChild(tojiru);
		form.appendChild(document.createElement("br"));
		form.appendChild(linkSen2);
		form.appendChild(labelElement(linkSen2.caption, linkSen2.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linksencut);
		form.appendChild(labelElement(linksencut.caption, linksencut.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkwalloff);
		form.appendChild(labelElement(linkwalloff.caption, linkwalloff.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkheadcut);
		form.appendChild(labelElement(linkheadcut.caption, linkheadcut.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkfootcut);
		form.appendChild(labelElement(linkfootcut.caption, linkfootcut.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linklist);
		form.appendChild(labelElement(linklist.caption, linklist.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkhelp);
		form.appendChild(labelElement(linkhelp.caption, linkhelp.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkichiba);
		form.appendChild(labelElement(linkichiba.caption, linkichiba.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linklogocut);
		form.appendChild(labelElement(linklogocut.caption, linklogocut.id));
		form.appendChild(document.createElement("hr"));
		form.appendChild(linkdellink);
		form.appendChild(labelElement(linkdellink.caption, linkdellink.id));
		form.appendChild(document.createElement("br"));
		form.appendChild(linkdelnews);
		form.appendChild(labelElement(linkdelnews.caption, linkdelnews.id));


		prefDiv.appendChild(form);

		var prefSw = document.createElement("span");
		prefSw.innerHTML = "カスタマイズ設定";
		prefSw.id = "qnama";
		prefSw.addEventListener("click",function(e){
			prefDiv.style.display = 
				(prefDiv.style.display　== "") ? "none" : "";
			GM_setValue("prefDisplay",prefDiv.style.display);
		},false);
		document.getElementById("siteHeaderRightMenuContainer").appendChild(prefSw);

		tojiru.addEventListener("click",function(e){
			prefDiv.style.display = 
				(prefDiv.style.display　== "") ? "none" : "";
			GM_setValue("prefDisplay",prefDiv.style.display);
		},false);


		var oStyle = document.createElement('style');
		oStyle.setAttribute('type','text/css');
		var css = '#siteHeader #siteHeaderInner{width:85%!important;}#qnama{margin-left:17px;color:#000000!important;cursor:pointer;}#prefDiv hr{margin:5px 0;border-color:#333333;}#utility_link{display:none!important;}.JS_PLAYER_MIDDLE .slider_container,.JS_PLAYER_NORMAL .slider_container{padding: 7px 0!important;}';
		oStyle.innerHTML = css;
		document.getElementsByTagName('head')[0].appendChild(oStyle);
		

	}

interface_kidoku();
senCut2();
senCut3();
zappingCut();
footcut();
ichibaCut();
helpCut();
logoCut();
headcut();
dellink();
walloff();
delnews();

})();