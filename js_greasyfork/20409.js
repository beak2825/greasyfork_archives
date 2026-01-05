// ==UserScript==
// @name         E-Hentai 中文功能集
// @name:en      E-Hentai Chinese Functions
// @namespace    https://greasyfork.org/zh-TW/scripts/20409-e-hentai-%E4%B8%AD%E6%96%87%E5%8A%9F%E8%83%BD%E9%9B%86
// @version      0.92
// @description  E紳士功能中文總集
// @description:en  E-Hentai Chinese Functions collection
// @author       Tast
// @include      *://exhentai.org/*
// @include      *://ul.exhentai.org/*
// @include      *://*e-hentai.org/*
// @include      /\w*:\/\/\d{1,3}(\.\d{1,3}){3}\/archive\/\d*\/\w*/
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_deleteValue
// @grant		 GM_getResourceURL
// @grant		 GM_xmlhttpRequest 
// @grant		 GM_getResourceText
// @grant		 GM_registerMenuCommand
// @run-at		 document-start
// @icon         http://g.e-hentai.org/favicon.ico
// @connect		 g.e-hentai.org
// @connect		 e-hentai.org
// @connect		 forums.e-hentai.org
// @connect		 exhentai.org
// @connect		 ehwiki.org
// @connect		 hentaiverse.org
// @connect		 upload.e-hentai.org
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @require https://code.jquery.com/ui/1.12.0-rc.2/jquery-ui.min.js
// @require https://greasyfork.org/scripts/20645-dd-icon-menu/code/DD%20Icon%20Menu.js?version=134420
// @require https://greasyfork.org/scripts/20286-chinesetr/code/ChineseTR.js
// @require https://greasyfork.org/scripts/20781-thunder-flashget/code/Thunder_FlashGet.js?version=132742
// @require https://greasyfork.org/scripts/20992-sorttable-make-all-your-tables-sortable/code/sorttable:%20Make%20all%20your%20tables%20sortable.js?version=133970
// @require https://greasyfork.org/scripts/21144-perfect-scrollbar-v0-6-10/code/perfect-scrollbar%20v0610.js?version=134924
// @resource 	 JQUI		https://code.jquery.com/ui/1.12.0-rc.2/themes/smoothness/jquery-ui.css
// @resource 	 iconFN 	https://greasyfork.org/system/screenshots/screenshots/000/004/495/original/function_%283%29.png?1466097291
// @resource 	 iconFB 	https://greasyfork.org/system/screenshots/screenshots/000/004/630/thumb/1467335308_like.png?1467317320
// @resource 	 DLicon		https://greasyfork.org/system/screenshots/screenshots/000/005/022/original/download.png?1471368073
// @resource 	 iconmenu 	http://www.dynamicdrive.com/dynamicindex1/iconmenu.css
// @resource 	 EbannerT 	http://tast.banner.tw/Javascript/EHentai/Banner/
// @resource 	 botm_bg  	http://ehgt.org/c/graphics/botm_bg.jpg
// @resource 	 botm1 		http://ehgt.org/c/botm.jpg
// @resource 	 botm2 		http://ehgt.org/c/botm1.jpg
// @resource 	 botm3 		http://ehgt.org/c/botm2.jpg
// @resource 	 botm4 		http://ehgt.org/c/botm3.jpg
// @resource 	 botm5 		http://ehgt.org/c/botm4.jpg
// @resource 	 botm6 		http://ehgt.org/c/botm5.jpg
// @resource 	 botm7 		http://ehgt.org/c/botm6.jpg
// @resource 	 botm8 		http://ehgt.org/c/botm7.jpg
// @resource 	 mCustomScrollbar https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.10/css/perfect-scrollbar.css
// @downloadURL https://update.greasyfork.org/scripts/20409/E-Hentai%20%E4%B8%AD%E6%96%87%E5%8A%9F%E8%83%BD%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/20409/E-Hentai%20%E4%B8%AD%E6%96%87%E5%8A%9F%E8%83%BD%E9%9B%86.meta.js
// ==/UserScript==
//==============================================變數聲明==============================================
// @resource 	 Ebanner http://imgur.com/a/ymWbA
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include      *://95.211.212.238/archive/*
// @grant		 unsafeWindow
//1 USD = BTC/USD.
//JSON.stringify
//RGB色碼表
//http://www.ifreesite.com/color/
//http://g.e-hentai.org/bounty.php?u=43883
//http://g.e-hentai.org/uploader/Luna_Flina
//https://developer.chrome.com/devtools/docs/console-api
//https://github.com/ccloli/E-Hentai-Downloader/wiki/E%E2%88%92Hentai-Image-Viewing-Limits
//====================================================================================================
document.cookie="nw=1; path=/"; //表站內容物不警告
var url	 = window.location.href;
var EHFN = {};
//====================================================================================================
function listCookies() {
	return document.cookie.split(';');
	//aString += i + ' ' + decodeURIComponent(theCookies[i-1]) + "\n";
	/*
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1 ; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n";
    }
    return aString;
	*/
}
//GM_registerMenuCommand("ccc",MenuTest)
function MenuTest(){
	alert("cccc")
	alert("cccc")
	
}
/*
console.error(url)
if(url.match("archiver.php")){
	console.error($("head").html())
	console.error($("body").html())
}
*/
//====================================================================================================
if(getQueryString("SetCookie",url)){
	var cookie = getQueryString("SetCookie",url)
	document.cookie = decodeURIComponent(cookie)
}
//http://.e-hentai.org/?SetCookie=uconfig%3Dccc
//http://e-hentai.org/?SetCookie=uconfig2%3Dccc
//alert(encodeURIComponent("uconfig=ccc"))

$(document).ready(function() { //console.log( "document loaded" );
	UnSafeFunction();
	MainMenu();
	CheckData();
	
	TagFlagBKColor();
	ThumbLarger();
	GalleryClickedTranslucent();
	TooltipGallery();
	LinkToHentai();
	TagSubscribe();
	
	FavoritesRate();
	WindowPopUp();
	
	if(url.match('uconfig.php')) 				uconfig();
	if(url.match("hentai.org\/g\/")) 			GalleryAutoRate();
	if(GM_getValue("rating_hide","1") == "1") 	GalleryRateAutoTranslucent()
	if(GM_getValue("HrefBlank","0") == "1") 	HrefBlank();
	if(url.match("home.php")) 					OverView_Money();
	//if(url.match("exchange.php\\?t=hath")) 		Exchange_Hath();
	if(url.match("gallerytorrents.php")) 		GalleryTorrents();
	if(url.match("g.e-hentai.org\/g\/")) 		GalleryNotAvailable();
	if(url.match("\/archive\/")) 				ArchiveWithLink();
	if(url.match("archiver.php")) 				ArchiveWithLink2();
	if(url.match("hentai.org\/g\/")) 			GalleryFastFav();
	if(url.match("hentai.org\/g\/")) 			FastNormalView();
	if(url.match("hentai.org\/g\/")) 			GalleryTorrentsInPage();
	if(url.match("hentai.org\/g\/")) 			GalleryThumbFast();
	if(url.match("hentai.org\/g\/")) 			GalleryComments();
	if(url.match("hentai.org\/mpv\/")) 			GalleryMPV();
	if(url.match("hentai.org\/s\/")) 			GallerySview();
	if(url.match("hentai.org\/s\/")) 			GallerySmenu();
	
	if(url.match("forums.e-hentai.org/index.php\\?showtopic\\=")) BannerDownload();
	
	MakeStyle();
	ButtomCredit();
});

function CheckData(){
	if(unsafeWindow.apiuid) createCookie("apiuid",unsafeWindow.apiuid,60) //ipb_member_id
	if(unsafeWindow.apikey) createCookie("apikey",unsafeWindow.apikey,60)
	if(unsafeWindow.mpvkey) createCookie("mpvkey",unsafeWindow.mpvkey,60)
}

//====================================================================================================
//MainMenu for all
//http://www.flaticon.com/search?word=option
function MainMenu(){
	$('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("JQUI") 		+ '" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("iconmenu") 	+ '" type="text/css" />');
	var iconFN = GM_getResourceURL("iconFN");
	var iconFB = GM_getResourceURL("iconFB");

	$("body").append(''
	+'<ul id="myiconmenu" class="iconmenu">'
		+'<li><a class="icon-list-ul" href="javascript:void()" rel="csslibrary">'
			+'<img src="' + iconFN + '" width="16" height="16"></a></li>'
		+'<li><a class="icon-list-ul" href="https://www.facebook.com/TastStudio">'
			+'<img src="' + iconFB + '" width="16" height="16"></a></li>'
		//+'<li><a class="icon-search" href="#" rel="ddcontentarea"></a></li>'
		//+'<li><a class="icon-gears" href="#" rel="webtools" title="Web Tools"></a></li>'
		//+'<li><a class="icon-rss" href="#" rel="[title]" title="RSS"></a></li>'
		//+'<li><a class="icon-twitter" href="#" rel="[title]" title="Twitter"></a></li>'
	+'</ul>'
	+'<div id="csslibrary" class="iconsubmenu dropdownmenu">'
	+'<ul class="ulmenu">'
		+'<li><a href="javascript:void()" rel="About">腳本資訊</a></li>'
		+'<li><a href="javascript:void()" rel="MyPage">我的首頁</a></li>'
		+'<li><a href="javascript:void()" rel="CurFN">本頁功能</a></li>'
	+'</ul>'
	+'</div>'
	
	+'<div id="About" class="iconsubmenu dropdownmenu">'
	+'<ul class="ulmenu" id="Abouts">'
		+'<li><a href="https://goo.gl/4L9grY"				>腳本首頁</a></li>'
		+'<li><a href="http://imgur.com/a/cuRxI"			>功能預覽</a></li>'
		/*
		+'<li>'
			+'<a>站圖來源：</a>'
			+'<a href="http://g.e-hentai.org/g/511812/22683948b8/">01</a>、'
			+'<a href="https://forums.e-hentai.org/index.php?showforum=50">02</a>'
		+'</li>'
		*/
	+'</ul>'
	+'</div>'
	
	+'<div id="MyPage" class="iconsubmenu dropdownmenu">'
	+'<ul class="ulmenu" id="MyPages">'
		+'<li><a href="http://g.e-hentai.org/home.php"				>概觀狀態</a></li>'
		+'<li><a href="http://g.e-hentai.org/stats.php"				>資訊統計</a></li>'
		+'<li><a href="http://g.e-hentai.org/uconfig.php"			>個人設定</a></li>'
		+'<li><a href="http://g.e-hentai.org/hentaiathome.php"		>紳士之家</a></li>'
		+'<li><a href="http://g.e-hentai.org/bitcoin.php"			>贊助捐款</a></li>'
		+'<li><a href="http://g.e-hentai.org/hathperks.php"			>特殊功能</a></li>'
		+'<li><a href="http://g.e-hentai.org/exchange.php?t=hath"	>駭斯市集</a></li>'
		+'<li><a href="http://g.e-hentai.org/exchange.php?t=gp"		>圖幣市場</a></li>'
		+'<li><a href="http://g.e-hentai.org/logs.php?t=credits"	>交易記錄</a></li>'
	+'</ul>'
	+'</div>'
	+'<div id="CurFN" class="iconsubmenu dropdownmenu">'
	+'<ul class="ulmenu" id="CurFNs">'
		//+'<li><a id="SortOF" href="javascript:void()" style="display:none;">原始排序</a></li>'
		//+'<li><a id="SortED" href="javascript:void()" style="display:none;">自訂排序</a></li>'
	+'</ul>'
	+'</div>'
	);
	
	DoMenu();
	$(".ulmenu a").css("color","darkred");
	//$("#myiconmenu").css("left","-12px");
	$("#myiconmenu").hover(	function(){ $(this).css("left","2px"); 		},
							function(){ $(this).css("left","-12px"); 	}).css("left","-12px")
							
	//$("div.iconsubmenu").css("width","200px") //width:300px
	//$("div.subwrapper > div").css("overflow","")
	//hidden)
}

function DoMenu(){
	ddiconmenu.docinit({ // initialize an Icon Menu
		menuid:'myiconmenu', //main menu ID
		easing:"easeInOutCirc",
		dur:500 //<--no comma after last setting
	})
}
//====================================================================================================
//MakeStyle Globe
function MakeStyle(){
	//橫福圖
	if($("#searchbox").length){
		MakeBanner();
		$("#advdiv , #searchbox").css("height","auto");
	}
	//畫冊內容
	if(url.match("hentai.org\/g\/")){
		$("#gright , #gmid").css("height","auto")
		$("#gd2")			.css("max-height","130px")
		//galleryThumbsTop();
		//$("#gdt div.gdtl").height("auto")
	}
	//畫冊看圖：多圖閱覽模式
	if(url.match("exhentai.org\/mpv\/")) $(".mi0").css("background-color","#4f535b")
	//種子列表 改高度適應非英文字串及換行
	if(url.match("torrents.php")) $("table.itg td.itd > div").css("height","auto")
}

//https://www.google.com.tw/search?q=javascript+check+element+change+line&ie=utf-8&oe=utf-8&channel=rcs&gws_rd=cr,ssl&ei=rvZ6V_epC4uo0AT-pLvoDw
//http://stackoverflow.com/a/15776336/4817500
//http://g.e-hentai.org/g/951777/0a6ecd0048/
//http://g.e-hentai.org/g/952150/1b76999987/
function galleryThumbsTop(){ if(!$("#gdt div.gdtl").length) return;
	var counter = 1;
	var PrevTop = 0;
	//http://stackoverflow.com/a/4760833
	$("#gdt div.gdtl").each(function(i){
		if(i == 0){ PrevTop = $(this).offset().top;	return; }
		var top = $(this).offset().top;
		if(PrevTop == top){
			counter++
			return;
		}
		
		
		console.error(i+"-"+counter+"="+(i-counter)+" | " + top)
		$(this).css("opacity","0.5")
		
		var PrevHeightCheck = true;
		var HigherHeight = 0;
		for(var j = 0 ; j <= counter;j++){ //console.error(i-1-counter+j);
			var tar 	= $("#gdt div.gdtl").eq(i-1-counter+j).find("img").attr("src")
			var Width 	= parseInt(/:\/\/.+-(.+)-(.+)-/.exec(tar)[1]);
			var Height 	= parseInt(/:\/\/.+-(.+)-(.+)-/.exec(tar)[2]);
			
			var HeightWidth = Height / Width
			var WidthHeight = Width  / Height
			var MaxWidth 	= 239;
			var MaxHeight	= 300;
			
			if(Width  > MaxWidth)  { Width  = MaxWidth;  Height = MaxWidth  * HeightWidth; }
			if(Height > MaxHeight) { Height = MaxHeight; Width  = MaxHeight * WidthHeight; }
			
			if(Height > HigherHeight){
				HigherHeight = (Height + 20).toFixed(0);
				//HigherHeight = Height.toFixed(0);
				if(j > 0) PrevHeightCheck = false;
			}
			//console.error(HigherHeight + ":" + Height + "+" + PrevHeightCheck);
		}
		
		for(var j = 0 ; j <= counter;j++){
			var tar = $("#gdt div.gdtl").eq(i-1-counter+j)
			//(tar).height(HigherHeight + "px");
			
			if(PrevHeightCheck) 
					$(tar).height("auto");
			else 	$(tar).height(HigherHeight + "px");
			
		}
		
		counter = 0;
		PrevTop = top;
	})
}

function MakeBanner(){
	/*	Source:
		http://g.e-hentai.org/g/511812/22683948b8/
		https://forums.e-hentai.org/index.php?showforum=50
	*/
	/*
	var EbannerHTML = GM_getResourceText("Ebanner");
	var EbannerObjHTML = /image\W*\:\W*\{(.*)\}\,/.exec(EbannerHTML)[1];
	var EbannerObj = JSON.parse("{" + EbannerObjHTML + "}");
	var EbannerObjImgs = EbannerObj.album_images.images;
	
	var rand = getRandomInt(0,EbannerObjImgs.length - 1)
	var ImageURL = EbannerObjImgs[rand].hash + EbannerObjImgs[rand].ext
	*/
	/*
	var BannerListImgur = []
	for(var i = 0 ; i < EbannerObjImgs.length ; i++){
		var imgobj = EbannerObjImgs[i];
		BannerListImgur.push(imgobj.hash + imgobj.ext)
	}
	//alert(BannerListImgur);
	*/
	
	var BannerImage = GetGannerRand(1);
					//= "http://tast.banner.tw/Javascript/EHentai/Banner/" 
					//+ $(EbannerS).eq(getRandomInt(0,EbannerL)).html().substr(1)
					//= "http://i.imgur.com/" + ImageURL
					//= "http://i.imgur.com/" + BannerListImgur[getRandomInt(0,BannerListImgur.length - 1)]
					//= "http://tast.banner.tw/Javascript/EHentai/Banner/" 
					//+ BannerList[getRandomInt(0,BannerList.length - 1)]
	var BannerStyle = "width:100%;height:136px;background:#E3E0D1 "
					+ "url(" + GM_getResourceURL("botm_bg") + ") repeat-x 0px center;"
					+ "position:relative;z-index:2;margin:auto;text-align:center;"
					+ "border-radius:10px;"
					//+ "display:none;"
					//+ "opacity:0.0"
	var BannerDIV 	= "<div id='banner' style='"  + BannerStyle + "'>"
					+ "<img id='BannerIMG' src='" + BannerImage + "'></div>"
	$(BannerDIV).insertBefore("#searchbox")
	$("#banner").attr("title",	"點一下顯示搜尋框<br>"+
								"點兩下更換橫幅圖")
	//$("#BannerIMG").css({ "opacity":"0.6" , "filter":"alpha(opacity=60)" })
	$("#banner").click(function(){
		$(this).tooltip( "option", "disabled", true );
		//$("#banner").hide("1000")
		//$("#searchbox").stop().toggle("1000")
		var searchbox = $("#searchbox");
		if($(searchbox).is(":hidden")) $("#searchbox").stop().show("1000")
		else {
			$("#searchbox , #fsdiv").stop().hide("1000",function(){
				$("#advdiv").stop().hide();
				$("#searchbox a[onclick*='toggle_advsearch_pane']:contains('Hide Advanced Options')").click();
				$("#searchbox a[onclick*='toggle_filesearch_pane']:contains('Hide File Search')").click();
			})
		}
	}).tooltip({
		track: true,
		content: function(){ return $(this).attr("title"); }
	}).dblclick(function(){
		$("#BannerIMG").css("opacity","0.6"); 
		LoadNewBanner();
	})
	$("#toppane > h1.ih").hide();
	if(!$("#searchbox input[name='f_search']").val()) $("#searchbox").hide();
	//$("#banner").show("slow")
	LoadNewBanner();
	/*
	$("#searchbox").animate({"opacity":"0.0" },{ duration: 1000,
		complete: function() { 
			$(this).hide().css("opacity","1.0"); 
			$("#banner").show().animate({"opacity":"1.0" },{ duration: "fast",
				complete: function() { LoadNewBanner(); }
			})
		}
	})
	*/
}

function LoadNewBanner(){
	var newBannerURL = GetGannerRand();
	testImage(newBannerURL,function(url,e){ 
		if(e != "success") return;
		$("#BannerIMG").animate({"opacity":"0.0" },{ duration: "fast",
			complete: function() {
				$("#BannerIMG")	.attr("src",newBannerURL)
								.animate({"opacity":"1.0" },{ duration: "fast" })
			}
		})
	})
}

//====================================================================================================
//Setting Box
var TagFlagColor = {
	 "0px -1px" :"#E2748B"
	,"0px -18px":"#DF9C73"
	,"0px -35px":"#B2B038"
	,"0px -52px":"#53B73F"
	,"0px -69px":"#3872B1"
	,"0px -86px":"#CB79E5"
	//最愛
	,"0px -2px"	:"#646464"
	,"0px -21px":"#FF6868"
	,"0px -40px":"#FFA561"
	,"0px -59px":"#FFF56B"
	,"0px -78px":"#68FF8B"
	,"0px -97px":"#CDFF84"
	,"0px -116px":"#8AFEFF"
	,"0px -135px":"#7268FF"
	,"0px -154px":"#AC57FE"
	,"0px -173px":"#FE50C8"
}

function uconfig(){ if(!url.match('uconfig.php')) return;
	$(	 "<div id='uConfig' style='border-radius:25px;border: 2px solid blue;padding: 20px; '>"
		+"<div id='uConfigFN'></div>"
		+"<br><div align='center'>"
			+"<input type='button' class='stdbtn' id='uConfigApply' value=' -儲存本框設定- '></div></div><br><br>"
	).insertAfter("#outer h1:eq(0)");
	
	$("#uConfigApply").click(function(){
		alert("已儲存設定");
		//===============================================================
		//TagFlagColor
		var TagFlagColorSet = []
		$("#sortable li").each(function(){
			var BK_Pos = $(this).attr("TagFlagColor");
			TagFlagColorSet.push(BK_Pos)
		})
		GM_setValue("TagFlagColor"	,TagFlagColorSet)
		GM_setValue("TagFlagFly"	,$("option.BKC:selected").val())
		//alert(GM_getValue("TagFlagColor"));
		//alert(GM_getValue("TagFlagFly"));
		//===============================================================
		//GalleryAutoRate
		var AutoRateNum = parseInt($("#rating_box").val());
		GM_setValue("AutoRateNum",AutoRateNum);
		//alert(GM_getValue("AutoRateNum"));
		//===============================================================
		//GallertRateAutoTranslucent
		if($("#rating_hide").prop("checked")) 
				GM_setValue("rating_hide","1");
		else 	GM_setValue("rating_hide","0");
		//===============================================================
		//HrefBlank
		if($("#HrefBlank").prop("checked")) 
				GM_setValue("HrefBlank","1");
		else 	GM_setValue("HrefBlank","0");
		//===============================================================
		//ThumbLarger
		if($("#ThumbLarger").prop("checked")) 
				GM_setValue("ThumbLarger","1");
		else 	GM_setValue("ThumbLarger","0");
		//===============================================================
		//FramePopups
		if($("#FramePopups").prop("checked")) 
				GM_setValue("FramePopups","1");
		else 	GM_setValue("FramePopups","0");
		
	})
	
	uConfigTagFlagBKColor();
	uConfigAutoRate();
	uConfigRateAutoTranslucent();
	uConfigHrefBlank();
	uConfigThumb();
	uConfigFramePopups();
	
	//===============================================================
	//Get window width & height
	var btnWidth 	= $("<input type='button' id='rxWidth'  class='stdinput' value='目前寬度'/>")
	var btnHeight 	= $("<input type='button' id='ryHeight' class='stdinput' value='目前高度'/>")
	$("input.stdinput[type='text'][name='rx']").parent().after("&nbsp;").after($(btnWidth))
	$("input.stdinput[type='text'][name='ry']").parent().after("&nbsp;").after($(btnHeight))
	$("#rxWidth") .click(function(){ $("input.stdinput[type='text'][name='rx']").val(window.innerWidth);  })
	$("#ryHeight").click(function(){ $("input.stdinput[type='text'][name='ry']").val(window.innerHeight); })
	
	//===============================================================
	//SyncSet
	$("#apply").clone().appendTo($("#outer")).attr("id","apply2").css("text-align","center")
	$("#apply").hide();
	$("#apply2").prepend('<input type="submit" id="applyUpload" value="上傳當前設定" class="stdbtn">')
	$("#apply2").append('<input type="submit" id="applyDownload" value="下載覆蓋設定" class="stdbtn">')
	$("#apply2").append('<div id="apply2Status" style="text-align:center;"></div>')
	$("#apply2 > input[name='apply']")
		.attr("id","apply2submit")
		.click(function(){ $("#apply > input[name='apply']").click();	})
	
	$("#applyUpload").click(function(){
		var InputData = []
		$("input").each(function(i){ if(!$(this).attr("name")) return;
			InputData.push({
				 "name"	:$(this).attr("name") 
				,"type"	:$(this).attr("type") 
				,"chk"	:$(this).prop("checked")
				,"val"	:$(this).attr("value")
				,"txt"	:$(this).val()
			});	
		})
		
		$("#apply2Status").html("")
		SetGsync("MainSet","EH_uconfig",InputData,function(){
			alert("設定上傳完畢");
		},function(statusID,statusStr){ 
			//console.error(statusID + " - " + statusStr)
			$("#apply2Status").append(statusID + " - " + statusStr + "<br>")
		})
	})
	
	$("#applyDownload").click(function(){
		$("#apply2Status").html("")
		GetGsync("MainSet",
			function(syncData,Error,gid){ 
				if(syncData == "Error"){
					$("#apply2Status").append("資料錯誤");
					return;
				}
				
				$(syncData.EH_uconfig).each(function(key, obj){
					//console.error(key + " | " + JSON.stringify(obj))
					if(obj.type == "checkbox"){
						var elem = $("input[type='" + obj.type + "'][name='" + obj.name + "']")
						$(elem).prop("checked",obj.chk).trigger('change');
					}
					else if(obj.type == "radio"){
						var elem = $("input[type='" + obj.type + "'][value='" + obj.val + "'][name='" + obj.name + "']")
						$(elem).prop("checked",obj.chk).trigger('change');
					}
					else {
						$("input[name='" + obj.name + "']").val(obj.txt)
					}
				})
				alert("設定覆蓋完畢");
			},
			function(statusID,statusStr){
				//console.error(statusID + " - " + statusStr);
				$("#apply2Status").append(statusID + " - " + statusStr + "<br>")
		});
	})
}

function uConfigTagFlagBKColor(){
	$(	"<style type='text/css'>"
			+"#sortable { list-style-type: none; margin: 0; padding: 0; width: 100%; }"
			+"#sortable li { margin: 0 5px 5px 5px; padding: 5px; font-size: 1.2em; height: 1.5em; }"
			+"html>body #sortable li { height: 2.2em; line-height: 1.2em; }"
			+".ui-state-highlight { height: 2.2em; line-height: 1.2em; }"
	+"</style>").appendTo("head");
		
	$("#uConfigFN").append("<br>"
		+"<h2>畫冊列表背景顏色 ( 透過畫冊旗幟 )</h2>"
		+"<p>設定畫冊列表顯示標籤旗幟時設定優先的背景色 ( 拖曳改變順序 )<p>"
		+"額外排列方式："
		+"<select id='BKC'>"//selected="selected"
			+'<option class="BKC" value="0" style="color:darkred  ;font-weight:bold;">不使用排列</option>'
			+'<option class="BKC" value="1" style="color:darkgreen;font-weight:bold;">排列到上方</option>'
			+'<option class="BKC" value="2" style="color:darkblue ;font-weight:bold;">排列到下方</option>'
		+"</select>"
		+'<ul id="sortable"></ul><br>'
		+"<button id='uCTFBKCbutton'>重新預設排列</button>");
	
	var BKCval = GM_getValue("TagFlagFly","1");
	$("#BKC")[0].selectedIndex = parseInt(BKCval);
	//$("option.BKC[value='" + BKCval + "']").prop("selected",true);
	
	$("div[style*='fav.png']").each(function(i){
		var Tags	= $("input[maxlength='20'][name*='favorite_']:eq(" + i + ")").val();
		var BK_Pos 	= $(this).css("background-position");
		var BK_Cor 	= TagFlagColor[BK_Pos];
		if(BK_Cor 	== undefined) BK_Cor = "black";
		
		$("#sortable").append('<li class="ui-state-default"></li>');
		$(this).clone().appendTo("#sortable li:last");
		$("#sortable li:last")
			.css("width","60%")
			.css("background-color",BK_Cor)
			.css("color","black")
			.attr("TagFlagColor",BK_Pos)
			.attr("name","fav-" + i)
			.append('&nbsp;#' + (i+1) + "：" + Tags)
			//.append('&nbsp;畫冊標籤旗幟 - ' + (i + 1));
	})
	
	$("div[style*='tf.png']").each(function(i){
		var Tags	= $("input[style='width:540px'][type='text']:eq(" + i + ")").val();
		var BK_Pos 	= $(this).css("background-position");
		var BK_Cor 	= TagFlagColor[BK_Pos];
		if(BK_Cor 	== undefined) BK_Cor = "black";
		
		$("#sortable").append('<li class="ui-state-default"></li>');
		$(this).clone().appendTo("#sortable li:last");
		$("#sortable li:last")
			.css("color","white")
			.css("background-color",BK_Cor)
			.attr("name","tf-" + i)
			.attr("TagFlagColor",BK_Pos)
			.append('&nbsp;#' + (i+1) + "：" + Tags)
	})
	
	var TagFlagColorI = GM_getValue("TagFlagColor",[]);
	for(var i = 0 ; i < TagFlagColorI.length ; i++){
		$("#sortable li[TagFlagColor='" + TagFlagColorI[i] + "']").appendTo("#sortable");
	}
	
	$( "#sortable" ).sortable({ placeholder: "ui-state-highlight" });
    $( "#sortable" ).disableSelection();
	
	$("#uCTFBKCbutton").click(function(){
		//http://stackoverflow.com/a/13490529
		$("#sortable li[name*='fav']").sort(function(a,b) {
			return $(a).attr("name") > $(b).attr("name")
		}).appendTo('#sortable');
		
		$("#sortable li[name*='tf']").sort(function(a,b) {
			return $(a).attr("name") > $(b).attr("name")
		}).appendTo('#sortable');
	})
}

function uConfigAutoRate(){
	$(	"<style type='text/css'>"
			+'div.ir{width:80px;height:16px;background-repeat:no-repeat;background-image:url(http://ehgt.org/g/rt.png)}'
			+'div.irr{background-image:url(http://ehgt.org/g/rtr.png)}'
			+'div.irb{background-image:url(http://ehgt.org/g/rtb.png)}'
			+'div.irg{background-image:url(http://ehgt.org/g/rtg.png)}'
			+'div.ir img{width:80px;height:16px}'
	+"</style>").appendTo("head");
	
	$("#uConfigFN").append("<br><br>"
		+"<h2>畫冊自動評星 ( 可用當作已讀 )</h2>"
		+"<p>瀏覽畫冊時自動評星，已評星則忽略<p>評星數開關："
		+'<input type="checkbox" id="rating_box" style="position:relative; top:2px"> - '
		+'<a id="rating_show" style="display:inline;"></a>'
		+'<div id="rating_image" class="ir" style="background-position: 0px -21px;">'
			+'<img src="http://ehgt.org/g/blank.gif" usemap="#rating" alt="">'
		+'</div><div id="rating_map"><map name="rating">'
			+'<area shape="rect" coords="0,0,7,16"   rating="1">'
			+'<area shape="rect" coords="8,0,15,16"  rating="2">'
			+'<area shape="rect" coords="16,0,23,16" rating="3">'
			+'<area shape="rect" coords="24,0,31,16" rating="4">'
			+'<area shape="rect" coords="32,0,39,16" rating="5">'
			+'<area shape="rect" coords="40,0,47,16" rating="6">'
			+'<area shape="rect" coords="48,0,55,16" rating="7">'
			+'<area shape="rect" coords="56,0,63,16" rating="8">'
			+'<area shape="rect" coords="64,0,71,16" rating="9">'
			+'<area shape="rect" coords="72,0,79,16" rating="10">'
		+'</map></div>'
	);
	
	var AutoRateNum = GM_getValue("AutoRateNum",0);
	if(AutoRateNum){
		update_rating_image(AutoRateNum);
		$("#rating_box").prop("checked",true).val(AutoRateNum);
		$("#rating_image").attr("class","ir irb");
		$("#rating_show").html(AutoRateNum);
		
	}
	else update_rating_image(10);
	
	$("#rating_map area").hover(function() {
		$("#rating_image").attr("class","ir irg");
		var b = $(this).attr("rating");
		update_rating_image(b);
		//console.error("update_rating_image" + b);
	},function(){
		var Elclass = $("#rating_image").attr("class");
		if(Elclass == "ir irb") return;
		$("#rating_image").attr("class","ir");
	}).click(function(){
		var b = $(this).attr("rating");
		$("#rating_image").attr("class","ir irb");
		$("#rating_box").prop("checked",true).val(b)
		$("#rating_show").html(b);
	})
	
	$("#rating_box").click(function(){
		if($("#rating_box").prop("checked")) return;
		$("#rating_box").val(0)
		$("#rating_show").html(0);
	})
}

function update_rating_image(b,target) {
	b = Math.round(b);
	var a = -80 + Math.ceil(b / 2) * 16;
	var c = b % 2 == 1 ? -21 : -1;
	if(target) 
			$(target).css("background-position",a + "px " + c + "px");
	else 	document.getElementById("rating_image").style.backgroundPosition = a + "px " + c + "px";
}

function uConfigRateAutoTranslucent(){
	$("#uConfigFN").append("<br><br>"
		+"<h2>已評星畫冊圖片透明化</h2>"
		+"<p>搜尋項目畫冊如已被自己評等過，縮圖即透明化："
		+'<input type="checkbox" id="rating_hide" style="position:relative; top:2px"></p>'
	);
	if(GM_getValue("rating_hide","1") == "1") $("#rating_hide").prop("checked",true)
}

function uConfigHrefBlank(){
	$("#uConfigFN").append("<br><br>"
		+"<h2>新開連結</h2>"
		+"<p>改變所有靜態連結變成開新分頁："
		+'<input type="checkbox" id="HrefBlank" style="position:relative; top:2px"></p>'
	);
	if(GM_getValue("HrefBlank","0") == "1") $("#HrefBlank").prop("checked",true)
}

function uConfigThumb(){
	$("#uConfigFN").append("<br><br>"
		+"<h2>預覽畫質</h2>"
		+"<p>改變搜尋項目畫冊預覽圖的畫質(增大一點)"
		+'<input type="checkbox" id="ThumbLarger" style="position:relative; top:2px"></p>'
	);
	if(GM_getValue("ThumbLarger","1") == "1") $("#ThumbLarger").prop("checked",true)
}

function uConfigFramePopups(){
	$("#uConfigFN").append("<br><br>"
		+"<h2>嵌入網頁</h2>"
		+"<p>將彈出來的小視窗嵌入到頁面。"
		+'<input type="checkbox" id="FramePopups" style="position:relative; top:2px"></p>'
	);
	if(GM_getValue("FramePopups","1") == "1") $("#FramePopups").prop("checked",true)
}

//====================================================================================================
function TagFlagBKColor(){ //if(url.match("favorites.php")) return;
	if(getQueryString("fly",url) == "0") return;
	//設定順序=========================================================
	$("div.itg:eq(0) > div.id1 , table.itg:eq(0) > tbody > tr")
		.each(function(i){ $(this).attr("SortOF",i); }) //預覽模式 + 列表模式
	$("#pp > div.id1")
		.each(function(i){ $(this).attr("SortOF",i); }) //熱門板塊
	//=========================================================
	var TagFlagFly 		= GM_getValue("TagFlagFly","0");
	var TagFlagColorI 	= GM_getValue("TagFlagColor",[]);
	//var IsListMode	 	= $("#dmi a[href*='?inline_set=dm_t']").length;
	//var IsThumMode 		= $("#dmi a[href*='?inline_set=dm_l']").length;
	//主要區塊
	for(var i = 0 ; i < TagFlagColorI.length ; i++){
		//console.error(i);
		//縮圖模式=========================================================
		//標籤
		$("div.itg div.tft[style*='" + TagFlagColorI[i] + "']").each(function(){
			var Target = $(this).parent().parent().parent();
			DoFlaged(Target,i);
		})
		//最愛
		//$("div.itg:eq(0) div.i[id*='favicon_'][style*='" + TagFlagColorI[i] + "']").each(function(){
		$("div.itg:eq(0) div.i[id*='favicon_'][style*='" + TagFlagColorI[i] + "']").each(function(){
			var Target = $(this).parent().parent().parent().parent();
			DoFlaged(Target,i);
			DoFaved(Target);
		})
		//列表模式=========================================================
		//標籤
		$("table.itg div.tfl[style*='" + TagFlagColorI[i] + "']").each(function(){
			var Target = $(this).parent().parent().parent().parent().parent()
			DoFlaged(Target,i)
		})
	}
	
	//熱門版面
	for(var i = 0 ; i < TagFlagColorI.length ; i++){
		//標籤
		$("#pp div.tft[style*='" + TagFlagColorI[i] + "']").each(function(){
			var Target = $(this).parent().parent().parent();
			DoFlaged(Target,i,1);
		})
		//最愛
		$("#pp div.i[id*='favicon_'][style*='" + TagFlagColorI[i] + "']").each(function(){
			var Target = $(this).parent().parent().parent().parent();
			DoFlaged(Target,i,1);
			DoFaved(Target);
		})
	}
	
	var Child = -1;
	function DoFlaged(Target,i,type){
		//$(Target).prependTo("div.itg:eq(0)");
		if($(Target).attr("Flaged") == "1") return;
		$(Target).css("background-color",TagFlagColor[TagFlagColorI[i]]);
		$(Target).attr("Flaged","1");
		
		if(TagFlagFly !== "0"){
			if(!type){
				$(Target).appendTo("div.itg:eq(0)");
				if($(Target).attr("class").match("gtr"))
					$(Target).appendTo("table.itg:eq(0) > tbody:eq(0)");
			}
			else $(Target).appendTo("#pp");
		}
	}
	
	function DoFaved(Target){
		$(Target).find("div.id3 img")
			.css("opacity","0.6")
			.css("filter","alpha(opacity=60)")
			.css("border-width","2px")
			.css("border-color","#00E3E3")
			.css("border-style","solid")
				
		$(Target).find("div.id2 a")
			.css("color","#00E3E3")
			//.css("color","white")
			
		$(Target)
			.css("border-width","1px")
			.css("border-color","#00E3E3")
			.css("border-style","solid")
			//.css("border-style","dashed")
				
		$(Target).hover(function(){
			$(this).find("div.id3 img")
				.css("opacity","1.0")
				.css("filter","alpha(opacity=100)")
			$(Target).find("div.id2 a")
				.css("color","white")
			//列表模式
			$(Target).find("div.it5 a")
				.css("color","white")
		},function(){
			$(this).find("div.id3 img")
				.css("opacity","0.6")
				.css("filter","alpha(opacity=60)")
			$(Target).find("div.id2 a")
				.css("color","#00E3E3")
			//列表模式
			$(Target).find("div.it5 a")
				.css("color","")
		})
	}
	
	if(TagFlagFly == "1"){
		//標籤
		$("div.itg:eq(0) > div.id1[Flaged!='1']").each(function(){
			$(this).appendTo("div.itg:eq(0)");
		})
		//最愛
		$("table.itg:eq(0) > tbody:eq(0) > tr[class*='gtr'][Flaged!='1']").each(function(){
			$(this).appendTo("table.itg:eq(0) > tbody:eq(0)");
		})
		//熱門版面
		$("#pp > div.id1[Flaged!='1']").each(function(){
			$(this).appendTo("#pp");
		})
	}
	
	if(TagFlagFly !== "0"){
		$("div.itg:eq(0) div.c").appendTo("div.itg:eq(0)")
		$("#pp div.c").appendTo("#pp")
		$("div.id1").css("height","345px")
		$("div.id3").css("height","280px")
		
		//設定順序=========================================================
		$("div.itg:eq(0) > div.id1 , table.itg:eq(0) > tbody > tr")
			.each(function(i){ $(this).attr("SortED",i); }) //預覽模式 + 列表模式
		$("#pp > div.id1")
			.each(function(i){ $(this).attr("SortED",i); }) //熱門板塊
			
		$("#CurFNs").append('<li class="SortOF"><a>取消排序</a></li>');
		$("#CurFNs").append('<li class="SortED"><a>重新排序</a></li>');
		DoMenu();
		
		$("li.SortOF").click(function(){
			$(getSorted('div.itg:eq(0) > div.id1'	, 'SortOF')).appendTo('div.itg:eq(0)');
			$(getSorted('#pp > div.id1'				, 'SortOF')).appendTo('#pp');
			$("div.itg:eq(0) div.c").appendTo("div.itg:eq(0)")
			$("#pp div.c").appendTo("#pp")
		})
		
		$("li.SortED").click(function(){
			$(getSorted('div.itg:eq(0) > div.id1'	, 'SortED')).appendTo('div.itg:eq(0)');
			$(getSorted('#pp > div.id1'				, 'SortED')).appendTo('#pp');
			$("div.itg:eq(0) div.c").appendTo("div.itg:eq(0)")
			$("#pp div.c").appendTo("#pp")
		});
	}
}

//http://blog.troygrosfield.com/2014/04/25/jquery-sorting/
function getSorted(selector, attrName) {
    return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        return aVal - bVal;
    }));
}
//====================================================================================================
function GalleryAutoRate(){ if(!url.match("hentai.org\/g\/")) return;
	var RateIMG = $("#rating_image[class='ir']").length;	if(!RateIMG) 		return;
	var AutoRateNum = GM_getValue("AutoRateNum",0);			if(!AutoRateNum)	return;
	//$("#gdr area:eq(" + (AutoRateNum-1) + ")").click();
	
	var APItarget 	= $("script:contains('var apikey'):eq(0)");
	var APIinfo		= $(APItarget).html();
	//var base_url 	= new RegExp("var base_url = (.+);"	,'i')	.exec(APIinfo)[1];
	
	var dataIN = 
	{
		 "method"	:"rategallery"
		,"rating"	: AutoRateNum
		,"apiuid"	: new RegExp("var apiuid = (.+);"	,'i')	.exec(APIinfo)[1]
		,"apikey"	: new RegExp('var apikey = "(.+)";'	,'i')	.exec(APIinfo)[1]
		,"gid"		: new RegExp("var gid = (.+);"		,'i')	.exec(APIinfo)[1]
		,"token"	: new RegExp('var token = "(.+)";'	,'i')	.exec(APIinfo)[1]
	}
	
	//https://sleazyfork.org/zh-TW/scripts/12053-e-hentai-exhentai-japanese-title/code
	$.ajax({
		url: "/api.php",
		type: "POST",
		data: JSON.stringify(dataIN),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){ //console.error(JSON.stringify(data))
			//alert( "Data Loaded: " + JSON.stringify(data));
			if(data["rating_avg"] == undefined) return;
			$("#rating_image").attr("class",data["rating_cls"]);
			$("#rating_count").html(data["rating_cnt"]);
			$("#rating_label").html("平均：" + data["rating_avg"]);
			update_rating_image(AutoRateNum);
		}
	});
}

//====================================================================================================
function TargetHover(Target){
	$(Target).unbind('mouseenter mouseleave');
	
	$(Target).find("div.id3 img")
		.css("opacity","0.3")
		.css("filter","alpha(opacity=30)")
	$(Target).hover(function(){
		$(this).find("div.id3 img")
			.css("opacity","1.0")
			.css("filter","alpha(opacity=100)")
	},function(){
		$(this).find("div.id3 img")
			.css("opacity","0.3")
			.css("filter","alpha(opacity=30)")
	})
}

function GalleryRateAutoTranslucent(){ if(GM_getValue("rating_hide","1") == "0") return;
	$("div.id43[class!='id43 ir']").each(function(){
		var Target = $(this).parent().parent();
		if($(Target).attr("Flaged") == "1") $(Target).unbind('mouseenter mouseleave');
		$(Target).attr("Rated","1");
		TargetHover(Target);
	})
}

function GalleryClickedTranslucent(){
	//$("div.id1[]").unbind('mouseenter mouseleave');
	//http://stackoverflow.com/questions/9012537/how-to-get-the-element-clicked-for-the-whole-document
	
	$("div.id1").click(function(event) {
		//alert(event.target.innerHTML);
		//var Target = this;
		TargetHover(this);
	});
}

//====================================================================================================
function HrefBlank(){
	if(GM_getValue("HrefBlank","0") == "0") return;
	//$("a").each(function(){ $(this).attr("target","_blank"); })
	$("a:not([blank='none'])").attr("target","_blank");
	$("td[onclick='document.location=this.firstChild.href']")
		.attr("onclick","javascript:window.open(this.firstChild.href);");
}

//====================================================================================================
function ThumbLarger(){ if(GM_getValue("ThumbLarger","1") == "0") return;
	//縮圖模式
	$("div.id3 img").each(function(){
		var naturalWidth 	= $(this).prop("naturalWidth")
		var naturalHeight 	= $(this).prop("naturalHeight")
		if(naturalWidth && naturalHeight){
			//console.error(naturalWidth + " | " + naturalHeight)
			CheckSetThumbWH(this);
		}
		else $(this).load(function(){ CheckSetThumbWH(this); })
	})
	
	//列表模式
	$("table.itg div.it2 > img").each(function(){
		var b = $(this).parent();
		var width 	= $(b).css("width");
		var height 	= $(b).css("height");
		$(this)	.attr("src"		,$(this).attr("src").replace("_l.","_250."))
				.attr("chk","1")
				.css("width"	,width)
				.css("height"	,height)
	})
	
	InsertFunctionCode(function(){/*
	load_pane_image = function(b){ 
		if (b == undefined) return;
		SetEventOut({eventName:"load_pane_image",detail:{"b":b}});
	};
	*/})
	
	GetEvent(function(e){
		var b = e.detail.detail.b;
		if (b == undefined) return;
		var a = b.innerHTML.split("~", 4);
		var width 	= $(b).css("width");
		var height 	= $(b).css("height");
		
		if (a.length == 4 && a[0] == "init"){
			var HTML 	= '<img src="http://' + a[1] + "/" + a[2] + '" alt="' + a[3] + '" style="margin:0;';
			HTML		+= 'width:' + width + ';height:' + height + ';" chk="1"/>';
			b.innerHTML = HTML.replace("_l.","_250.");
		}
		else {
			var img = $(b).find("img:not([chk])");
			if(!img.length) return;
			$(img)	.attr("src"		,$(img).attr("src").replace("_l.","_250."))
					.attr("chk","1")
					.css("width"	,width)
					.css("height"	,height);
		};
	},"load_pane_image")
}

function CheckSetThumbWH(Target){
	$(Target).unbind('onload load');
	var naturalWidth 	= $(Target).prop("naturalWidth")
	var naturalHeight 	= $(Target).prop("naturalHeight")
	$(Target)	.css("width"	,naturalWidth)
				.css("height"	,naturalHeight)
	
	var src = $(Target).attr("src");
	src = src.replace("_l.","_250.");
	$(Target).attr("src",src);
	
	var DivHeight = parseInt($(Target).parents("div.id3").css("height").replace("px",""));
	$(Target).css("marginTop", (DivHeight - naturalHeight) / 2 + "px")
}

//====================================================================================================
function TooltipGallery(){
	//預覽圖模式
	$( "div.id1" ).tooltip({
		items: "div.id2,div.id3",
		content: function () { 
			var elem = $(this).parents("div.id1"); 
			var TipText = 	  "<div style='text-align: left;'>"
							+ $(elem).find("div.id41")[0].outerHTML 	+ "&nbsp;&nbsp;&nbsp;"
							+ $(elem).find("div.id2 > a").html() 		+ "<br>"
			
			$(elem).find("div.tft").each(function(index, element){
				var color = $(this).css("background-position");
				var tftText = "<p><font color='" + TagFlagColor[color] + "'>" +
					$(element).attr("title")
						.replace(new RegExp(", ","gmi"),"<br>")
						.replace(new RegExp("\n","gmi"),"<br>")
				TipText += tftText + "</font></p>"
			})
			
			$(elem).find("div.id44 > div > div[id*='favicon_']").each(function(index, element){
				var color = $(this).css("background-position");
				var Style = $(this).attr("style");
				var favText = 	 "<p><div class='i' style='" + Style + " display:inline;'></div>"
								+"<font color='" + TagFlagColor[color] + "'>"
								+$(this).attr("title")
				TipText += favText + "</font></p>"
				//console.error(favText)
			})
			
			//console.error(TipText)
			return TipText + "</div>";
		}
		
    });
	//列表模式
	$( "table.itg" ).tooltip({
		items: "div.it5",
		content: function () {
			var elemLen = 0;
			var TipText = "<div style='text-align: left;'>";
			$(this).parent().find("div.tfl").each(function(){ elemLen += 1;
				var color = $(this).css("background-position");
				var tftText = "<p><font color='" + TagFlagColor[color] + "'>" +
					$(this).attr("title")
						.replace(new RegExp(", ","gmi"),"<br>")
						.replace(new RegExp("\n","gmi"),"<br>")
				TipText += tftText + "</font></p>"
			})
			
			$(this).parent().find("div[id*='favicon_']").each(function(){ elemLen += 1;
				var color = $(this).css("background-position");
				var Style = $(this).attr("style");
				var favText = 	 "<p><div class='i' style='" + Style + " display:inline;'></div>"
								+"<font color='" + TagFlagColor[color] + "'>"
								+$(this).attr("title")
				TipText += favText + "</font></p>"
				//console.error(favText)
			})
			if(!elemLen) 
					return "";
			else 	return TipText + "</div>";
		}
	})
}

//====================================================================================================
//E[-X]Hentai Helper
//https://greasyfork.org/zh-TW/scripts/12869-e-x-hentai-helper/feedback
//http://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
//https://blog.longwin.com.tw/2014/06/javascript-set-cookie-php-read-2014/
//alert(document.cookie);
/*
SadPandaGO();
function SadPandaGO(){ if(getQueryString("success",url) !== "1") return;
	
	
}
*/
/*
SadPanda();
function SadPanda(){ if($("img:eq(0)").attr("src") !== window.location.href) return;
	//alert(document.cookie);
	clearListCookies();
	GM_setValue("LoginCookie","");
	GM_setValue("Login","false");
	
	$("body").html('<iframe id="if_login" src="http://e-hentai.org/?login=1"></iframe><div id="if_div"></div>');
	
	setInterval(function(){
		//console.error('setInterval = ' + GM_getValue("Login","false"))
		if(GM_getValue("Login","false") == "true"){
			document.cookie = "yay" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			clearListCookies();
			
			//var cookie = GM_getValue("LoginCookie","");
			alert(document.cookie);
			//document.cookie = cookie;
			//alert(document.cookie);
			//window.location.href = "http://exhentai.org/?success=1"
			window.location = ""; // TO REFRESH THE PAGE
		}
	}, 1000);
}

function clearListCookies(){   
    var cookies = document.cookie.split(";");
	for(var i=0; i < cookies.length; i++) {
		var equals = cookies[i].indexOf("=");
		var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
	
	clearCookie("yay")
	clearCookie("yay","exhentai.org","/")
	clearCookie("yay",".exhentai.org","/")
}

function clearCookie(name, domain, path){
    var domain = domain || document.domain;
    var path = path || "/";
    document.cookie = name + "=; expires=" + +new Date + "; domain=" + domain + "; path=" + path;
};

SadPandaLogin();
function SadPandaLogin(){ if(getQueryString("login",url) !== "1") return;
	
	var LoginForm = $("form[name='ipb_login_form']:eq(0)").clone();
	$(LoginForm).attr("action",$(LoginForm).attr("action") + "&logined=1");
	$("body").html("").append(LoginForm);
	
}

SadPandaLogined();
function SadPandaLogined(){ if(getQueryString("logined",url) !== "1") return;
	var Checker = $("#redirectwrap p:contains('You are now logged in as:')").length;
	//alert(Checker);
	if(Checker == 1){
		window.stop();
		window.location.href = "http://e-hentai.org/?catchCat=1";
	}
}

SadPandaCatchCat();
function SadPandaCatchCat(){ if(getQueryString("catchCat",url) !== "1") return;
	GM_setValue("LoginCookie",document.cookie);
	GM_setValue("Login","true");
	location.hash = "Logined";
}
*/
//====================================================================================================
function LinkToHentai(){
	//alert(document.body.innerHTML);
	var GoText = "Error";
	var GoHref = "Error";
	/*
	var GoFilter = [
		 "home.php"
		,"stats.php"
		,"hentaiathome.php"
		,"bitcoin.php"
	]
	*/
	if(url.match("g.e-hentai.org")){
		GoText = " 裡站"
		GoHref = url.replace("g.e-hentai.org","exhentai.org")
		//GoHref = "http://exhentai.org";
	}
	else {
		GoText = " 表站"
		GoHref = url.replace("exhentai.org","g.e-hentai.org")
	}
	
	$( "#nb img:eq(0)" ).clone().attr("blank","none").insertAfter( "#nb a:eq(0)");
	$( "#nb a:eq(0)" )	.clone().attr("blank","none").html(GoText).attr("href",GoHref).insertAfter( "#nb img:eq(1)");
	
	if(document.title == "" && url.match("exhentai.org")){
		//$.get( window.location.href, function( data ) { if(data == "") ExCheckEmptyPage(); });
		ExEmptyPage();
	}
}

function ExEmptyPage(){
		document.title = "無目標網頁";
		var style 	= "width:100%;height:136px;background:#E3E0D1 "
					+ "url(http://ehgt.org/c/graphics/botm_bg.jpg) repeat-x 0px center;"
					+ "position:relative;z-index:2;margin:auto;text-align:center;"
		
		//$("head").append('<link rel="stylesheet" type="text/css" href="http://g.e-hentai.org/z/0319/g.css" />')
		$("body")
		.css("background-color","#34353b")
		.attr("text","white")
		.prepend(''
			+"<div id='LinkToHentai' style='text-align:center;'>"
				+"<div style='" + style + "'>"
					+"<img src='" + GetGannerRand() + "'>"
				+"</div>"
				+"<br><br>"
				+"<a href='http://g.e-hentai.org/' blank='none'>進入表站首頁</a>"
				+"<a> ｜ </a>"
				+"<a href='#' onclick='history.back()'  blank='none'>回到上一頁</a>"
				+"<a> ｜ </a>"
				+"<a href='http://exhentai.org/'  blank='none'>進入裡站首頁</a>"
			+"</div>")
		$("#LinkToHentai a").css("color","white");
}

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
//====================================================================================================
//E-Hentai Gallery Overview - How Rich Am I?
//https://greasyfork.org/zh-TW/scripts/6565-e-hentai-gallery-overview-how-rich-am-i
function OverView_Money(){ if(!url.match("home.php")) return;
	var exchange = "http://g.e-hentai.org/exchange.php";
	$(	 "<h2><font color='Sienna'>財產金庫</font></h2>"
		+"<div class='homebox'>"
		+"<table style='margin:10px auto'><tbody>"
			+"<tr>"
				+"<td><font color='Teal'>紳士幣</font>：</td>"
				+"<td><p id='FN_OVM_Credits' class='FC_OVM_p'></p></td>"
				+"<td><p class='FC_OVM_te'>Credits</a></td>"
			+"</tr><tr>"
				+"<td><font color='DarkOrchid'>駭斯幣</font>：</td>"
				+"<td><p id='FN_OVM_Hath' class='FC_OVM_p'></p></td>"
				+"<td><p class='FC_OVM_te'>Hath<p></td>"
				+"<td><p class='FC_OVM_te'>平均單價 (<b id='FN_OVM_CH_Rate'></b>)</p></td>"
				+"<td><p class='FC_OVM_te'><font color='Teal'>紳士幣</font></p></td>"
			+"</tr><tr>"
				+"<td><font color='RoyalBlue'>千圖幣</font>：</td>"
				+"<td><p id='FN_OVM_KGP' class='FC_OVM_p'></p></td>"
				+"<td><p class='FC_OVM_te'>kGP<p></td>"
				+"<td><p class='FC_OVM_te'>平均單價 (<b id='FN_OVM_CK_Rate'></b>)</p></td>"
				+"<td><p class='FC_OVM_te'><font color='Teal'>紳士幣</font></p></td>"
			+"</tr>"
		+"</tbody></table></div>"
	).insertAfter("div.homebox:eq(0)");
	$(".FC_OVM_p")	.css("float","right");
	$(".FC_OVM_te")	.css("float","left");
	
	$.get( exchange + "?t=hath", function( data ) {
		var Credits = new RegExp("Available:\\s*([,0-9]*)\\s*Credits"			,'i')	.exec(data)[1];
		var Hath 	= new RegExp("Available:\\s*([,0-9]*)\\s*Hath"				,'i')	.exec(data)[1];
		var CH_AVG	= new RegExp("<strong>Avg</strong>:\\s*([,0-9]*)\\s*Credits",'i')	.exec(data)[1];
		$("#FN_OVM_Credits").html(Credits);
		$("#FN_OVM_Hath")	.html(Hath);
		$("#FN_OVM_CH_Rate").html(CH_AVG);
	});
	$.get( exchange + "?t=gp", function( data ) {
		var kGP 	= new RegExp("Available:\\s*([,0-9]*)\\s*kGP"				,'i')	.exec(data)[1];
		var CK_AVG	= new RegExp("<strong>Avg</strong>:\\s*([,0-9]*)\\s*Credits",'i')	.exec(data)[1];
		$("#FN_OVM_KGP")	.html(kGP);
		$("#FN_OVM_CK_Rate").html(CK_AVG);
	});
}

//====================================================================================================
//Exchange_Hath();
function Exchange_Hath(){ if(!url.match("exchange.php\\?t=hath")) return;
	$("input").css("text-align","center");
	var AvaCredits	= $("div:contains('Available: '):contains(' Credits'):eq(0)")	.html();
	var AvaHath		= $("div:contains('Available: '):contains(' Hath'):eq(0)")		.html();
	var Credits		= new RegExp("Available:\\s*([,0-9]*)\\s*Credits",'i')	.exec(AvaCredits)[1].replace(new RegExp(",","gmi"),"");
	var Hath		= new RegExp("Available:\\s*([,0-9]*)\\s*Hath",'i')		.exec(AvaHath)	 [1].replace(new RegExp(",","gmi"),"");
	Credits 		= parseInt(Credits);
	Hath 			= parseInt(Hath);
	//購買駭斯幣 BuyCredits	
	var BuyHath 	= $("#bid_count");
	var BuyCredits 	= $("#bid_price");
	
	if($(BuyHath).val() 	== "0") $(BuyHath).val("");
	if($(BuyCredits).val() 	== "0") $(BuyCredits).val("");
	
	$(BuyHath).keyup(function(){ //alert("ccc");
		//$(BuyCredits).val($(BuyHath).val());
	})
	
	$(BuyCredits).keyup(function(){
		var BuyHathVal = parseInt($(BuyCredits).val());
		$(BuyHath).val( Math.floor(Credits / BuyHathVal) );
		
	})
	
	//賣出駭斯幣
	/*
	var SellHath 	= $("#ask_count");
	var SellCredits = $("#ask_price");
	
	if($(SellHath).val() 	== "0") $(SellHath).val("")
	if($(SellCredits).val() == "0") $(SellCredits).val("")
		
	$(SellHath).keyup(function(){ //alert("ccc");
		//$(SellCredits).val($(SellHath).val());
	})
	$(SellCredits).keyup(function(){
		var SellHathVal = parseInt($(SellCredits).val());
		$(SellHath).val( Math.floor(Credits / SellHathVal) );
		
	})
	*/
}

//====================================================================================================
//e-hentai magnet link
//https://greasyfork.org/zh-TW/scripts/13311-e-hentai-magnet-link/code
function GalleryTorrents(){ if(!url.match("gallerytorrents.php")) return;
	$("form a[href*='.torrent']").each(function(i){
		var magnet 	= "magnet:?xt=urn:btih:" + this.href.match(/\/(\w+)\.torrent/i)[1];
		var torrent	= this.href.split("?p=")[0];
		var HTML	= "<br><br><a style='color:blue' href='" + torrent + "'>[下載公眾用種子]</a>"
					+ "、<a style='color:green'      href='" + magnet  + "'>[下載公眾用磁鏈]</a>";
		$(this).after(HTML);
	});
	
	$("#ett ~ table a[href$='.torrent']").each(function(){
		var magnet 	= "magnet:?xt=urn:btih:" + this.href.match(/\/(\w+)\.torrent/i)[1];
		var HTML	= "<tr><td><a href='" + magnet + "'><font color='green'>公開用磁鏈</font></a></td>"
					+ "<td>( 可公開使用分享 - 發表或給予他人 )</td></tr>"
		$(this).parents("tbody:eq(0)").append(HTML);
	})
}

//====================================================================================================
//http://www.primebox.co.uk/projects/jquery-cookiebar/
function FavoritesRate(){
	//if(!url.match("favorites.php")) return;
	/*
	{
		"method": "rategallery",
		"apiuid": ,
		"apikey": "",
		"rating": 4,
		"gid":944604,
		"token":"908c058d7e"
	}
	*/
	/*
	var elem_Sel = $("select.stdinput[name='ddact']:eq(0)");
	var optionAttr = 'selected="selected" style="height:17px; padding-left:10px; padding-top:4px"';
	$(elem_Sel).parent().parent().css("width","350px");
	$(elem_Sel).prepend('<optgroup id="SelGroup" label="其他功能：" style="padding:3px 5px 5px 5px">')
	$('<input type="button" id="FN_apply" value="執行" class="stdbtn">').insertAfter(elem_Sel);
	$(elem_Sel).find("option[value='delete']").appendTo("#SelGroup")
	$("#SelGroup").append('<option value="favIT" ' + optionAttr + '>批次評星</option>')
	
	
	
	$("#FN_apply").click(function(){
		//if()
	})
	*/
	
	var id43 = $("div.id43");
	if(!id43.length) return;
	
	var curStar;
	$(id43).css("cursor","pointer").click(function(){
		curStar = this;
		$(curStar).html("").css("z-index","");
		$(this)
			.css("z-index","5")
			.html('<img src="http://ehgt.org/g/blank.gif" usemap="#rating" alt="">')
			.mouseout(function(){ update_rating_image($(this).attr("rate"),curStar); })
	})
	
	
	$("body").append(
		'<map name="rating" id="ratingStar">'
			+'<area shape="rect" coords="0,0,7,16"   alt="1">'
			+'<area shape="rect" coords="8,0,15,16"  alt="2">'
			+'<area shape="rect" coords="16,0,23,16" alt="3">'
			+'<area shape="rect" coords="24,0,31,16" alt="4">'
			+'<area shape="rect" coords="32,0,39,16" alt="5">'
			+'<area shape="rect" coords="40,0,47,16" alt="6">'
			+'<area shape="rect" coords="48,0,55,16" alt="7">'
			+'<area shape="rect" coords="56,0,63,16" alt="8">'
			+'<area shape="rect" coords="64,0,71,16" alt="9">'
			+'<area shape="rect" coords="72,0,79,16" alt="10">'
		+'</map>')
	
	$("#ratingStar area")
		.click(function(){ GetSetAPIRate($(this).attr("alt"),curStar);			})
		.hover(function(){ update_rating_image($(this).attr("alt"),curStar); 	})
}

function GetSetAPIRate(rate,curStar){
	$(curStar).css("opacity","0.6").attr("rate",rate)
	var tarURL = $(curStar).parents("div.id1").find("a").attr("href");
	var APIdata = 
	{
		"method": "rategallery",
		"apiuid": readCookie("ipb_member_id"),
		"apikey": readCookie("apikey"),
		"rating": rate,
		"gid"	: /\W*:\/\/.+\/([0-9]+)\/(.+)\//.exec(tarURL)[1],
		"token"	: /\W*:\/\/.+\/([0-9]+)\/(.+)\//.exec(tarURL)[2]
	}
		
	if(APIdata.apiuid && APIdata.apikey && APIdata.gid && APIdata.token) 
			SetRate();
	else 	$.get(TarURL,SetRate)
	
	function SetRate(getData){
		//console.error(APIdata)
		if(getData){
			APIdata.apiuid 	= new RegExp("var apiuid = (.+);"	,'i').exec(getData)[1]
			APIdata.apikey 	= new RegExp('var apikey = "(.+)";'	,'i').exec(getData)[1]
			APIdata.gid 	= new RegExp("var gid = (.+);"		,'i').exec(getData)[1]
			APIdata.token 	= new RegExp('var token = "(.+)";'	,'i').exec(getData)[1]
			createCookie("apiuid",APIdata.apiuid,60) //ipb_member_id
			createCookie("apikey",APIdata.apikey,60)
		}
		
		$.ajax({
			url: "/api.php",
			type: "POST",
			data: JSON.stringify(APIdata),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){ //console.error(JSON.stringify(data))
				//alert( "Data Loaded: " + JSON.stringify(data));
				if(data["rating_avg"] == undefined) return;
				update_rating_image($(curStar).attr("rate"),curStar);
				$(curStar).html("").css("z-index","").css("opacity","1.0")
					.attr("class","id43 " + data["rating_cls"])
					.unbind("mouseout mousein")
					.effect("highlight",1700)
					.parent().parent().effect("highlight",1700)
			}
		});
	}
}

//====================================================================================================
//EH to ExH
//https://greasyfork.org/zh-TW/scripts/19810-eh-to-exh
function GalleryNotAvailable(){ if(!url.match("g.e-hentai.org\/g\/")) 	return;
	if(document.title !== "Gallery Not Available - E-Hentai Galleries") return;
	//$(window).on('beforeunload', function (){ return false; });
	$("#continue").parent().html("正轉移到裡站...");
	window.location.href = window.location.href.replace("g.e-hentai.org","exhentai.org");
}

//====================================================================================================
//ArchiveWithLink
//http://tool.chinaz.com/tools/thunder_flashget.aspx
function ArchiveWithLink(){ if(!url.match("\/archive\/")) return;
	var href 		= $("#db a[href*='archive']").attr("href");
	href 			= url.split('\/archive')[0] + href;
	var Thunder 	= EncryptionThunder(href);
	var FlashGet 	= EncryptionFlashGet(href);
	var XuanFeng 	= EncryptionXuanFeng(href);
	$("#db").append("<br><a href='" + Thunder + "'><font color='blue'><b>【迅雷網址】</b></font></a>")
	$("#db").append(" ｜ <a href='" + FlashGet+ "'><font color='green'><b>【快車網址】</b></font></a>")
	$("#db").append(" ｜ <a href='" + XuanFeng+ "'><font color='darkred'><b>【旋風網址】</b></font></a><br><br>")
	$("#db").css("background-color","#E3E0D1").css("color","black")
	$("#db a").css("color","purple")
	
	//http://stackoverflow.com/a/3919002
	$("link[rel='shortcu‌​t icon'] , link[rel='icon']").remove();
	$("head").append('<link rel="icon" type="image/png" href="' + GM_getResourceURL("DLicon") + '">')
}
function ArchiveWithLink2(){
	if(!$("#continue").length) return;
	$("#continue").remove();
	
	var TargetURL = $("script:contains('function gotonext')").html()
	TargetURL = /document\.location\W*=\W*"(.+)";/.exec(TargetURL)[1]
	window.location.href = TargetURL;
}

function EncryptionThunder(href) { //迅雷
	return "thunder://" + encode64(strUnicode2Ansi("AA" + href + "ZZ")); }
function EncryptionFlashGet(href) { //快车
	return "flashget://" + encode64(strUnicode2Ansi("[FLASHGET]" + href + "[FLASHGET]")) + "&abc"; }
function EncryptionXuanFeng(href) { //旋风
	return "qqdl://" + encode64(strUnicode2Ansi(href)); }
//====================================================================================================
//http://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element
function GalleryFastFav(){ if(!url.match("hentai.org\/g\/")) return;
	var style = "background-image:url(http://ehgt.org/g/fav.png); color:white; text-align:center; display:inline;"
	
	$("#gdd tbody:eq(0)").append(""
		+'<tr id="FastFavTR">'
			+'<td style="white-space:nowrap;" class="gdt1" id="FFtd1">快速收藏:</td>'
			+'<td id="FastFavDIV" style="display:inline;">'
				+'<div id="FFd1" style="display:inline-block;"></div>'
				+'<div id="FFd2" style="display:inline-block;"></div>'
			+'</td>'
			//+'<td><img src="http://ehgt.org/g/e.png"></td>'
		+'</tr>')
	
	var ColorBK = Object.keys(TagFlagColor);
	for(var i = 6 ; i < ColorBK.length ; i++){ //console.error(i); 
		var id = i - 6;
		if(id <= 4) 
				var FavDivID = "#FFd1";
		else 	var FavDivID = "#FFd2";
		
		$(FavDivID).append(''
			+'<a class="FastFavA" n="' + id + '" id="FFa_' + id + '" style="float:left; cursor:pointer" >'
				+'<div class="i" id="FFd_' 	+ id + '" style="' + style + 'background-position:' + ColorBK[i] + ';">'
				+id
				+'</div>'
			+'</a>'
		)
	}
	
	$("#gd3")
		.on('click'		, 'a.FastFavA', function() { addfav($(this).attr("n"));	})
		.on('mouseout'	, 'a.FastFavA', function() { $("#FFtd1").css("background-color",""); })
		.on('mouseover'	, 'a.FastFavA', function() { 
			var color = TagFlagColor[$("#FFd_" + $(this).attr("n")).css("background-position")]
			$("#FFtd1").css("background-color",color)
		})
		
}

function addfav(id){
	var gid 	= unsafeWindow.gid;
	var token 	= unsafeWindow.token;
	var TarURL	= "/gallerypopups.php?act=addfav&gid=" + gid + "&t=" + token;
	var IMGsrc	= "http://www.erhlin.cch.org.tw/opd/img/loading.gif"
	//"http://ehgt.org/g/roller.gif"
	//$("#favoritelink").append("<br>&nbsp;<img src='" + IMGsrc + "'>")
	$("#favoritelink").css("color",GetObjectByNum(TagFlagColor,parseInt(id) + 6))
	//console.error(gid + ","  + token)
	$.ajax({ 
		url: TarURL, type: "POST",
		data: { favcat:id, update:"1" },
		success: function(data){ //console.error(JSON.stringify(data))
			GetFavPopupSet(data);
		}
	});
	
}

function GetFavPopupSet(data){
	if(data.match("fi.style.display='none';")){
		$("#fav").attr("style","float:left; cursor:pointer").html("")
		$("#favoritelink").html('<img src="http://ehgt.org/g/mr.gif"> 加入收藏')
		return;
	}
	
	var background_position = new RegExp("fi\\.style\\.backgroundPosition='(.+x)';"	,'mi').exec(data)[1];
	var divTitle			= new RegExp("fi\\.title='(.+)'\\;"	,'mi').exec(data)[1];
	$("#favoritelink").html(divTitle).css("color","")
	//console.error(divTitle + " - " + background_position);
	if(!$("#fav").find("div.i").length)
		$("#fav").append('<div class="i" style="background-image:url(http://ehgt.org/g/fav.png); margin-left:16px"></div>')
			
	$("#fav").find("div.i")
		.css("background-position",background_position)
		.attr("title",divTitle)
}

//====================================================================================================
//GalleryMPV
//https://www.sitepoint.com/javascript-custom-events/

function GalleryMPV(){ if(!url.match("hentai.org\/mpv\/")) return;
	//unsafeWindow.always_scale
	//Buttons background color With ShowHide effects
	var speed = 300;
	$("#bar3").hover(function(){
			$(this).stop().animate({
				 "opacity"			: "1.0"
				,"height"			: $(this).get(0).scrollHeight
				,"background-color"	: $(".mi0:eq(0)").css("background-color")
			},speed,function(){ $(this).css("height","auto"); })
			$(this).find("img:eq(0)").stop().animateRotate(135);
		},
		function(){ 
			$(this).stop().animate({
				 "opacity"			: "0.6"
				,"height"			: "30px"
				,"background-color"	: "transparent"
			},speed)
			$(this).find("img:eq(0)").stop().animateRotate(-90);
		}
	).css({	 
		 "z-index"		:"5"
		,"opacity"		:"0.6"
		,"height"		:"30px"
		,"text-align"	:"center"
		,"overflow"		:"hidden"
	})
	
	$( "#bar3" ).tooltip({
		items: "img",
		content: function () { return $(this).attr("title"); },
		position: {
			my: "left+10 center",
			at: "right center",
		}
	})
	
	$("#bar3 > img").hover(
		function(){ $(this).css("background-color","lightgreen"); 	},
		function(){ $(this).css("background-color",""); 			})
	
	//Auto Reload Failed Image
	document.addEventListener("load_image", newMessageHandler, false);
	function newMessageHandler(e) { //console.error(JSON.stringify(e.detail.b))
		var b = e.detail.b
		var ImageElem = $("#imgsrc_" + b)
		$(ImageElem).error(function() {
			console.error("Image fail(" + b + "):" + $(this).attr("src"))
			setTimeout(function(){ unsafeWindow.action_reload(b); }, 1000);
		});
	}
	Insertload_image2();
	
	//Ajust From HashTag
	var hash = location.hash;
	if(hash.length >= 2) document.location = hash
	
	//Ajust From HashTag with actions
	InsertFunctionCode(function(){/*
	action_set = function(a) {
		document.location = mpv_url + "?inline_set=" + a + location.hash;
	}
	*/})
	
	//https://developer.mozilla.org/zh-TW/docs/Web/Guide/API/DOM/Manipulating_the_browser_history/Manipulating_the_browser_history
	//http://stackoverflow.com/a/14690177
	//http://stackoverflow.com/questions/12832317/history-replacestate-example
	//Auto Set Page Number from scrolling..
	InsertFunctionCode(function(){/*
	sync_thumbpane = function(){
		if (currentpage != currentthumb) {
			var b = document.getElementById("thumb_" + Math.min(pagecount, currentpage + 1));
			var a = Math.max(0, Math.round(b.offsetTop - (pane_thumbs.offsetHeight - b.offsetHeight) / 2));
			SetEventOut({eventName:"sync_thumbpane",detail:{"page":currentpage , "thumb":currentthumb}});
			scroll_absolute("pane_thumbs", a);
			currentthumb = currentpage;
		};
	}	
	*/})
	
	//Set Current&Next&NNext border right color
	GetEvent(function(e){ //console.error(JSON.stringify(e.detail.detail));
		var page 		= e.detail.detail.page;
		var thumb 		= parseInt(e.detail.detail.thumb);
		//console.error(page + " | " + thumb);
		$("#thumb_" + (thumb)).css("border-right","");
		$("#thumb_" + (thumb + 1)).css("border-right","");
		$("#thumb_" + (thumb + 2)).css("border-right","");
		$("#thumb_" + (thumb + 3)).css("border-right","");
		
		$("#thumb_" + (page-1)).css("border-right","");
		$("#thumb_" + page).css("border-right","3px solid green");
		$("#thumb_" + (page + 1)).css("border-right","3px solid red");
		$("#thumb_" + (page + 2)).css("border-right","3px solid blue");
		
		window.history.replaceState( {} , '', "#page" + page );
		//if(history.pushState) history.pushState(null, null, "#page" + page);
	},"sync_thumbpane")
	
	//https://github.com/noraesae/perfect-scrollbar
	//ScrollBar
	$('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("mCustomScrollbar") + '" type="text/css" />');
	$('#pane_thumbs , #pane_images').perfectScrollbar();
}

function Insertload_image2(){
InsertFunctionCode(function(){/*
load_image = function(b) {
    if (imagelist[b - 1].i != undefined) {
        var c = '<a href="#page' + (b + 1) + '"><img id="imgsrc_' + b + '" src="' + imagelist[b - 1].i + '" title="' + imagelist[b - 1].n + '" style="margin:0; width:' + imagelist[b - 1].xres + "px; height:" + imagelist[b - 1].yres + 'px" /></a> <div class="mi1"> 	<div class="mi2"> 		' + (imagelist[b - 1].o == "org" ? '<img style="cursor:default" title="Original Image" src="' + img_url + 'mpvd_d.png" />': '<img title="' + imagelist[b - 1].o + '" onclick="action_fullimg(' + b + ')" src="' + img_url + 'mpvd.png" />') + ' 		<img title="Reload broken image" onclick="action_reload(' + b + ')" src="' + img_url + 'mpvr.png" /> 	</div> 	<div class="mi3"> 		<a href="' + base_url + imagelist[b - 1].lo + '" target="_ehshow_' + gid + "_" + b + '"><img title="Open image in normal viewer" onclick="action_open(' + b + ')" src="' + img_url + 'mpvn.png" /></a> 		<img title="Show galleries with this image" onclick="action_search(' + b + ')" src="' + img_url + 'mpvs.png" /> 		<img title="Get forum link to image" onclick="action_link(' + b + ')" src="' + img_url + 'mpvl.png" /> 	</div> 	<div class="mi4">' + imagelist[b - 1].d + " :: " + imagelist[b - 1].n + '</div> 	<div style="clear:both"></div> </div>';
        document.getElementById("image_" + b).innerHTML = c;
        rescale_image(b, document.getElementById("imgsrc_" + b));
		var event = new CustomEvent( "load_image", { bubbles: true, cancelable: true,
			detail: { "b":b }}
		);
		document.dispatchEvent(event);
    } else {
        if (imagelist[b - 1].xhr != undefined) {
            return;
        }
        imagelist[b - 1].xhr = new XMLHttpRequest();
        var a = {
            method: "imagedispatch",
            gid: gid,
            page: b,
            imgkey: imagelist[b - 1].k,
            mpvkey: mpvkey
        };
        api_call(imagelist[b - 1].xhr, a,
        function() {
            load_image_dispatch(b);
        })
    }
}
*/});
}
//====================================================================================================
//GallerySview
function GallerySview(){ if(!url.match("hentai.org\/s\/")) return;
	//滑動至圖片
	SetGoto();
	InsertFunctionCode(function(){/*
		load_image = function load_image(a, b) {
			SetEventOut({detail:{page:a , token:b}});
			return false;
		}
	*/})
	
	GetEvent(function(e){ 
		//alert(JSON.stringify(e.detail.detail))
		var page 		= e.detail.detail.page
		var token 		= e.detail.detail.token
		var gid 		= unsafeWindow.gid
		var base_url 	= unsafeWindow.base_url
		var TargetURL 	= base_url + "s/" + token + "/" + gid + "-" + page;
		//alert(TargetURL)
		document.location = TargetURL
	})
	
	function SetGoto(){
		var GoToIng = setInterval(function(){
			if($("#img").length){
				$("#img").goTo(); 
				clearInterval(GoToIng); 
			}
		}, 700);
	}
	//圖片載入失敗重載
	CheckReloadImage();
	function CheckReloadImage(){
		$("#i2").css("color","")
		setTimeout(function(){ 
			testImage($("#img"),function(url, status){
				if(status != "success"){
					$("#loadfail").click();
					$("#i2").css("color","red")
				}
			})
		}
		, 500);
	}
	/*
	function GetImageLink(){
		var dataIN = {
			 "method"	:"showpage"
			,"gid"		: unsafeWindow.gid
			,"page"		: unsafeWindow.startpage
			,"imgkey"	: unsafeWindow.startkey
			,"showkey"	: unsafeWindow.showkey }
		$.ajax({
			url: "/api.php",
			type: "POST",
			data: JSON.stringify(dataIN),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){ console.error(JSON.stringify(data.i3))
				//var src = /<img id=\"img\" src=\"(.+)\" style/i.exec(data.i3)[1];
				var src = $(data.i3).find("#img").attr("src");
				$("#img").attr("src",src);
			}
		});
	}
	*/
}

//====================================================================================================
//Switch FastMultiView or NormalView
function FastNormalView(){ if(!url.match("hentai.org\/g\/")) return;
	setTimeout(FastNormalView2, 1500); 
}
function FastNormalView2(){ if(!url.match("hentai.org\/g\/")) return;
	var MultiPageViewer = $("#gd5 a[href*='hentai.org/mpv/']:eq(0)");
	var NormalView 		= $("#gdt a[href*='hentai.org/s/']:eq(0)");
	if(!$(MultiPageViewer).length || !$(NormalView).length)  return;
	
	$("#gdt a[href*='hentai.org/s/']").each(function(){
		$(this)	.attr("s",$(this).attr("href"))
				.attr("bc",$(this).find("img").css("border-color"));
	})
	
	$(MultiPageViewer).parent()
		.append("<input id='cbox_MPV' type='checkbox' title='是否自動更改圖片連結至多圖或單圖閱覽模式'>")
		.css("border","1px solid red")
		
	var gid 	= new RegExp("var gid = (.+);"		 ,'i').exec($("body").html())[1]
	var token 	= new RegExp('var token = "(.+)";'	 ,'i').exec($("body").html())[1]
	var base_url= new RegExp('var base_url = "(.+)";','i').exec($("body").html())[1]
	
	$("#cbox_MPV").click(function(){
		if($("#cbox_MPV").prop("checked")){
			$("#gdt a[href*='hentai.org/s/']").each(function(){
				var num = parseInt($(this).find("img:eq(0)").attr("alt"))
				$(this).attr("href",base_url + "mpv/" + gid + "/" + token + "#page" + num)
				$(this).find("img").css("border-color","lightgreen")
			})
		}
		else {
			$("#gdt a[href*='hentai.org/mpv/']").each(function(){
				$(this).attr("href",$(this).attr("s"))
				$(this).find("img").css("border-color",$(this).attr("bc"))
			})
		}
		GM_setValue("GalleryViewMPV",$("#cbox_MPV").prop("checked"))
	}).tooltip()
	
	if(GM_getValue("GalleryViewMPV",false) == true) $("#cbox_MPV").click();
}

//====================================================================================================
//Ex-Hentai: Frame Popups Improved by Tast
//https://greasyfork.org/zh-TW/scripts/10268-ex-hentai-frame-popups
function WindowPopUp(){ if(GM_getValue("FramePopups","1") == "0") return;
	if(unsafeWindow.popUp == undefined) return;
	
	window.history.replaceState({Ori_State:"Original"}, null, null);
	window.onpopstate = function(event) {
		//alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
		if(event.state.Ori_State == "Original") hideOberlay()
	};
	
	InsertCSSbyText(
		 "#lb-oberlay { top: 0;left: 0;width: 100%;height: 100%;position: fixed;"
		+"z-index: 100000;overflow: hidden;background: rgba(35,35,35,.7);}"
		+"#lb-frame {box-shadow: 5px 5px 10px black;position: fixed;left: 50%;top: 50%;z-index: 100001;border: 0;}")
	
	$("body").append(
		 "<div id='lb-oberlay' style='display:none;'></div>"
		+"<iframe id='lb-frame' style='display:none;' seamless='true' />")
	
	$("#lb-oberlay").click(hideOberlay)
	
	InsertFunctionCode(function(){/*
		popUp = function(url, w, h){
			SetEventOut({eventName:"popUp",detail:{"url":url , "w":w , "h":h}});
			return false;
		}
	*/})
	
	GetEvent(function(e){
		var newH = 80
		var newW = 20
		var TarURL = e.detail.detail.url
		var w = e.detail.detail.w
		var h = e.detail.detail.h
		var wH= $(window).height()
		var wW= $(window).width()
		
		if(TarURL.match("https:\/\/exhentai.org\/archiver.php")) return popUpOLD(TarURL,w + 50,h + 50)
		
		if(h + newH < wH) 	h += newH			//合計不超過視窗大小就增高
		else if(h > wH) 	h -= ( h - wH + 30) //超過視窗大小就多內縮高30
		
		if(w + newW < wH) 	w += newW			//合計不超過視窗大小就增寬
		else if(w > wW) 	w -= ( w - wW + 30) //超過視窗大小就多內縮寬30
		
		$("#lb-oberlay").css("display","block")
		$("#lb-frame")[0].src = TarURL
		$("#lb-frame").css({
			"display"		: "block"
			,"width"		:  w 	+ "px"
			,"height"		:  h 	+ "px"
			,"margin-left"	: -w / 2+ 'px'
			,"margin-top"	: -h / 2+ 'px'
		})
		$(window)	.bind("keyup",function(e){ if(e.which == 27) hideOberlay(); }) //type ESC
		disable_scroll();
	},"popUp")
	
	$("#lb-frame").load(function(){
		//console.error($($("#lb-frame")[0].contents).html())
		history.pushState({Ori_State:"New"}, null, $("#lb-frame")[0].contentWindow.location.href);
		//window.history.replaceState( {} , '', $("#lb-frame")[0].contentWindow.location.href );
		//history.pushState(null, null, $("#lb-frame").attr("src"));
		//console.error(JSON.stringify($("#lb-frame").contents()))
		//console.error($("#lb-frame").width() + ":" + $("#lb-frame").height())
		$("#lb-frame").contents().find("[onclick*='window.close\(\)']").click(hideOberlay)
		$("#lb-frame")[0].contentWindow.close = hideOberlay;
		var script = $("#lb-frame").contents()
					.find("script:contains('window.opener.document.getElementById(\"favoritelink\")')");
		if(!$(script).length) return;
		GetFavPopupSet($(script).html())
		if($(script).html().match("fn.innerHTML = ' ';fn.style.display = 'none';")) hideOberlay();
	})
	
	function hideOberlay() { 
		//window.history.replaceState( {} , '', url );
		history.pushState(null, null, url);
		$(window).unbind("keyup")
		$("#lb-oberlay , #lb-frame").hide(); 
		enable_scroll();
	}
	
	$("a[onclick*='return popUp('][href='#']").each(function(){
		var href = $(this).attr("onclick").split("('")[1].split("',")[0];
		$(this).attr("href",href);
	})
}

function popUpOLD(URL,w,h) {
	window.open(URL
		,"_pu"+(Math.random()+"").replace(/0\./,"")
		,"toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width="+w+",height="+h+",left="+((screen.width-w)/2)+",top="+((screen.height-h)/2)
	);
	return false;
}

//====================================================================================================
//GalleryTorrentsInPage
function GalleryTorrentsInPage(){ if(!url.match("hentai.org\/g\/")) return;
	setTimeout(GalleryTorrentsInPage2, 1500); 
}
function GalleryTorrentsInPage2(){
	var aTorrents = $("#gd5 a[onclick*='gallerytorrents.php']:eq(0)");
	var nTorrents = parseInt($(aTorrents).html().split("(")[1].split(")")[0].replace(new RegExp(" ","gmi"),""));
	var uTorrents = $(aTorrents).attr("onclick").split("popUp('")[1].split("',")[0];
	if(!nTorrents) return;
	
	$(aTorrents).parent()	.append("<input id='cbox_Torrents' type='checkbox' title='是否自動在畫冊內容插入種子頁面'>")
							.css("border","1px solid blue")
							
	$("#cbox_Torrents").click(function(){
		if($("#cbox_Torrents").prop("checked")) 
				SetTorrentsPage(uTorrents)
		else 	$("#Panel_Torrents").hide("fast",function(){ $(this).remove(); });
		GM_setValue("GalleryTorrents",$("#cbox_Torrents").prop("checked"))
	}).tooltip();
	
	if(GM_getValue("GalleryTorrents",false) == true) $("#cbox_Torrents").click();
}
//https://greasyfork.org/zh-TW/scripts/10968-sadpanda-torrent-inline
//Sadpanda torrent inline
function SetTorrentsPage(TarURL){ //console.error(TarURL)
	var style =  "border:1px solid #000000;text-align:left;width:99%;min-width:720px;"
				+"max-width:1200px;margin:0 auto;clear:both;padding:5px;"
				//960px
				//1200px
	var Panel_Torrents = "<div id='Panel_Torrents'>"
		+"<div id='Panel_Torrents2' style='" + style + "'>"
			+'<div align="center" id="PanelTorLoad">載入....<img src="http://ehgt.org/g/roller.gif"></div>'
		+"</div><br></div>"
	
	$(Panel_Torrents).insertAfter($("div.gm:eq(0)"))
	$("#Panel_Torrents2").css({
		 "background-color"	:$("#gdt").css("background-color")
		,"border-radius"	:$("#gdt").css("border-radius")
	})
	$("#Panel_Torrents").hide().show("fast")
	
	$.get(TarURL,ExecuteTorrentsData)
}
//http://g.e-hentai.org/g/952287/15de16ad01/
//http://g.e-hentai.org/g/962638/ecd371757f/
function ExecuteTorrentsData(data){ $("#PanelTorLoad").hide("fast");
	InsertCSSbyText(".TorInPageSpan { font-weight:bold; }")
	
	var Posted 		= RegM(data,/>Posted:<\/span>(.+)<\/td>/gmi)
	var Size 		= RegM(data,/>Size:<\/span>(.+)<\/td>/gmi)
	var Seeds 		= RegM(data,/>Seeds:<\/span>(.+)<\/td>/gmi)
	var Peers 		= RegM(data,/>Peers:<\/span>(.+)<\/td>/gmi)
	var Downloads 	= RegM(data,/>Downloads:<\/span>(.+)<\/td>/gmi)
	var Uploader 	= RegM(data,/>Uploader:<\/span>(.+)<\/td>/gmi)
	var TorrentsURL = $(data).find("a[href*='ehtracker\.org\/t\/'][href*='.torrent?p=']")
	//http://www.kryogenix.org/code/browser/sorttable/
	InsertCSSbyText("table.sortable thead { background-color:#eee;color:#666666;font-weight: bold;cursor: default;}")
	//InsertCSSbyText("#TorTableSort tbody tr:first-child { background-color:gray }")
	$("#Panel_Torrents2").append(
		 '<div style="margin:10px 5px; padding:3px; border:1px solid #C7B5A3;">'
		+'<table style="width:99%;" border="0" class="sortable" id="TorTableSort">'
		+'<thead>'
		+'<tr id="TorTrSort">'
			+'<th>發表時間</th>'
			+'<th>大小</th>'
			+'<th>種子數</th>'
			+'<th>人數</th>'
			+'<th>下載數</th>'
			+'<th>上傳者</th>'
			+'<th>種子下載</th>'
			+'<th>公眾種子</th>'
			+'<th>公眾磁鍊</th>'
		+'</tr>'
		+'</thead>'
		+'<tbody id="Panel_tbody">'
		+'</tbody></table></div>')
	for(var i = 0 ; i < TorrentsURL.length ; i++){
		var TorURL 	= $(TorrentsURL).eq(i).attr("href")
		var TorName	= $(TorrentsURL).eq(i).html()
		var TorHTML	= "<a href='" + TorURL + "'>下載</a>"
		var TorPublic="<a href='" + GetTorrentPublic(TorURL) + "'>下載</a>"
		var TorMagnet="<a href='" + GetTorrentMagnet(TorURL) + "'>下載</a>"
		$("#Panel_tbody").append('<tr>'
		+'<td>'+ Posted[i] 		+ '</td>'
		+'<td>'+ Size[i] 		+ '</td>'
		+'<td>'+ Seeds[i] 		+ '</td>'
		+'<td>'+ Peers[i] 		+ '</td>'
		+'<td>'+ Downloads[i] 	+ '</td>'
		+'<td>'+ Uploader[i] 	+ '</td>'
		+'<td>'+ TorHTML 		+ '</td>'
		+'<td>'+ TorPublic 		+ '</td>'
		+'<td>'+ TorMagnet 		+ '</td>'
		+'</tr>'
	)}
	sorttable.makeSortable($("#TorTableSort")[0]);
	$("#TorTrSort").click(function(){
		var StdRev = $("#TorTableSort th.sorttable_sorted_reverse")
		var StdAbl = $("#TorTableSort th.sorttable_sorted")
		if(StdRev.length) GM_setValue("TorTableSort",[$(StdRev).html().split("<")[0],"sorttable_sorted_reverse"])
		if(StdAbl.length) GM_setValue("TorTableSort",[$(StdAbl).html().split("<")[0],"sorttable_sorted"])
		//alert(StdRev.length + " | " + StdAbl.length)
	})
	
	var TorTableSort = GM_getValue("TorTableSort",false);
	if(TorTableSort.length){
		if(TorTableSort[1] == "sorttable_sorted") 
				$("#TorTrSort th:contains('" + TorTableSort[0] + "')").click();
		else 	$("#TorTrSort th:contains('" + TorTableSort[0] + "')").click().click();
		//alert(TorTableSort)
	}
	

	//====================================================
	for(var i = 0 ; i < TorrentsURL.length ; i++){
		var TorURL 	= $(TorrentsURL).eq(i).attr("href")
		var TorName	= $(TorrentsURL).eq(i).html()
		var TorHTML	= "<a color='#FF0000' href='" + TorURL + "'>" + TorName + "</a>"
		$("#Panel_Torrents2").append(
			'<div style="margin:10px 5px; padding:3px; border:1px solid #C7B5A3;">'
			+'<table style="width:99%" border="0">'
			+'<tr>'
			+'<td style="width:180px"><span class="TorInPageSpan">發表時間:</span>'	+ Posted[i] 	+ '</td>'
			+'<td style="width:150px"><span class="TorInPageSpan">大小:</span>' 	+ Size[i] 		+ '</td>'
			+'<td></td>'
			+'<td style="width:80px"><span class="TorInPageSpan">種子數:</span>' 	+ Seeds[i] 		+ '</td>'
			+'<td style="width:80px"><span class="TorInPageSpan">人數:</span>' 		+ Peers[i] 		+ '</td>'
			+'<td style="width:100px"><span class="TorInPageSpan">下載數:</span>' 	+ Downloads[i] 	+ '</td>'
			+'<td><span class="TorInPageSpan">上傳者:</span>' 						+ Uploader[i] 	+ '</td>'
			+'</tr>'
			+'<tr>'
			+'<td colspan="7">'
				+TorHTML
			+'</td>'
			+'</tr><tr>'
			+'<td colspan="2" style="background:#EDEBDF;">'
				+"<a style='color:blue'  href='" + GetTorrentPublic(TorURL)  + "'>[下載公眾用種子]</a>、"
				+"<a style='color:green' href='" + GetTorrentMagnet(TorURL)  + "'>[下載公眾用磁鏈]</a>"
			+'</tr>'
			+'</table></div>'
	)}
}

function GetTorrentPublic(TarURL){ return 							TarURL.split("?p=")[0];					}
function GetTorrentMagnet(TarURL){ return "magnet:?xt=urn:btih:" + 	TarURL.match(/\/(\w+)\.torrent/i)[1];	}

//====================================================================================================
//GalleryThumbFast
function GalleryThumbFast(){ return;
	var ThumbSrc = $("#gdt img:eq(0)").attr("src");
	var IP = /\w*:\/\/(\d{1,3}(\.\d{1,3}){3})\//.exec(ThumbSrc);
	if(!IP || IP.length < 2) return;
	//=======================================================
	IP = IP[1];
	//console.error(IP);
	var IsExisted = 0;
	var SourceIP = GM_getValue("SourceIP",["ul.ehgt.org"]);
	for(var i = 0;i < SourceIP.length;i++){
		if(SourceIP[i] == IP){
			IsExisted = 1;
			//console.error("IsExisted:" + IP);
			break;
		}
	}
	if(!IsExisted){
		SourceIP.push(IP)
		GM_setValue("SourceIP",SourceIP)
		//console.error("newIP:" + IP);
		//console.error(SourceIP);
		//alert("newIP:" + IP);
	}
	//console.error(SourceIP);
	if(SourceIP.length <= 1) return;
	//=======================================================
	var gdtl = $("#gdt > div.gdtl img");	
	var gdtlAver = (gdtl.length / SourceIP.length).toFixed(0);
	//console.error(gdtl.length + " - " + gdtlAver);
	var cnt = 0;
	var curSource = 0;
	$(gdtl).each(function(i){ cnt++;
		if(cnt > gdtlAver){
			cnt = 0;
			curSource++;
			if(curSource >= SourceIP.length) return false;
			console.error(curSource + "(" + i + "):" + SourceIP[curSource]);
			//alert(curSource + ":" + SourceIP[curSource]);
			//$(this).goTo().css("opacity","0.5");
		}
		var newSrc = /:\/\/(.+)[\/](.+[\/].+[\/].+)/.exec($(this).attr("src"));
		var src = "http://" + SourceIP[curSource] + "/" + newSrc[2];
		$(this).attr("src",src)
	})
	
	
}

//====================================================================================================
//GalleryComments
//http://g.e-hentai.org/g/949800/b787b79b67/?hc=1#comments
function GalleryComments(){ if(!url.match("hentai.org\/g\/")) return;
	var BodyBackgroundColor = $("body").css("background-color");
	var color = EXsub("green","lightgreen");
	$("div[class='c5 nosel'] span[id*='comment_score']").each(function(){
		var type = $(this).html().slice(0,1)
		if(type == "-"){
			$(this) .css("color","DarkOrange")
			$(this)	.parent().parent().parent()
					.css("background-color",BodyBackgroundColor)
					.css("opacity","0.8")
		}
		else if(type == "+"){
			$(this) .css("color",color)
			
		}
	})
	
	$("div.c7[id*='cvotes_'] span").each(function(){
		var type = $(this).html();
		if(type.match("-")) 	$(this).css("color","DarkOrange")
		if(type.match("\\+")) 	$(this).css("color",color)
	})
	/*
	//AJAX Get Hidden Comments
	var Comments = $("#chd a[href*='?hc=1#comments']");
	$(Comments)//.attr("tar",$(Comments).attr("href")).attr("href","javascript:void()")
	.click(function(){
		console.error("Comments Start");
		$.get($(this).attr("href"), function( data ) { 
			//var HTML = $.parseHTML( data );
			//$("#cdiv").html($(data).find("#cdiv").html());
			console.error($(data).find("div#cdiv"));
		});
		return false;
	})
	*/
	/*
	//$.get($(this).attr("href"), function( data ) { 
	$.get("g.e-hentai.org/g/949800/b787b79b67/?hc=1", function( data ) { 
		var tempDom = $('<div></div>').append($.parseHTML(data));
		//console.error($(tempDom).find("#cdiv").html());
		$("#cdiv").html($(tempDom).find("#cdiv").html());
	});
	*/
}

function EXsub(g,ex){
	if(url.match("exhentai.org")) return ex;
	return g;
}

//====================================================================================================
//BannerDownload
function BannerDownload(){
	//var img = "td.post1[id*='post-main-'] img[src*='uploads'][alt='Attached Image'] , "
			//+ "td.post2[id*='post-main-'] img[src*='uploads'][alt='Attached Image']"
	var img = "td[id*='post-main-'] img"
	
	GM_registerMenuCommand("Banner DL",function(){
		var Lists = ""
		$(img).each(function(i){
			var h = $(this).prop("naturalHeight")
			var w = $(this).prop("naturalWidth")
			//console.error(w + "-" + h)
			if(h != 136 || w != 770) return true;
			
			$(this).css("border","3px solid blue")
			//downloadByHref($(this).attr("src"));
			Lists += "\n" + $(this).attr("src");
		})
		downloadByCode(getQueryString("showtopic",url) + ".txt",Lists)
		
	})
}

//====================================================================================================
//
function GallerySmenu(){ if(!url.match("hentai.org\/s\/")) return;
	var MenuStyle 	= "position: fixed; top:0px; right:0px;float: right;z-index: 5; opacity: 0.6; " //+ "width: 35px; "
					+ "height: 30px; text-align: center; overflow: hidden; text-align: right;"
	
	$("body").prepend(
		 '<div id="bar3" style="' + MenuStyle + '">'
		+'<img id="barMPVc" src="http://ehgt.org/g/mpvc.png" title="回到畫冊頁面">'
			+'<br>'
		+'<img id="barMPVd" src="http://ehgt.org/g/mpvd.png" title="下載原始圖片">'
		+'<img id="barMPVr" src="http://ehgt.org/g/mpvr.png" title="刷新失連圖片">'
			+'<br>'
		+'<img id="barMPVs" src="http://ehgt.org/g/mpvs.png" title="顯示此圖片相關畫冊(以圖找圖)">'
		+'<img id="barMPVl" src="http://ehgt.org/g/mpvl.png" title="產生論壇用靜態貼圖連結">'
			+'<br>'
		+'<img id="barP" src="http://ehgt.org/g/p.png" title="上一頁">'
		+'<img id="barN" src="http://ehgt.org/g/n.png" title="下一頁">'
			+'<br>'
		+'<img id="barF" src="http://ehgt.org/g/f.png" title="第一頁">'
		+'<img id="barL" src="http://ehgt.org/g/l.png" title="最後頁">'
			+'<br>'
		+'</div>'
	)
	
	if(IsHathPerkAlive("q")){
		$("#bar3").append("<br>"+
			'<img id="barMPVtn" src="http://ehgt.org/g/mpvtn.png" style="margin-top:20px" title="切換多圖快速閱覽模式">'
		)
	}
	
	$( "#bar3" ).tooltip({
		items	: "img",
		content	: function () { return $(this).attr("title"); },
		position: { my: "left+30 center", at: "right center",}
	})
	
	if(!$("#i6 > a[onclick*='forumtoken']").length) $("#barMPVl").css("opacity","0.5")
	
	$("#barMPVc")	.click(function(){ window.location.href = $("div.sb > a:eq(0)")			.attr("href"); 	})
	$("#barMPVr")	.click(function(){ 	$("#loadfail").click(); 											})
	$("#barMPVs")	.click(function(){ window.location.href = $("#i6 > a:eq(0)") 			.attr("href"); 	})
	$("#barMPVl")	.click(function(){ 	$("#i6 > a[onclick*='forumtoken']").click(); 						})
	$("#barP")		.click(function(){ window.location.href = $("#prev")					.attr("href"); 	})
	$("#barN")		.click(function(){ window.location.href = $("#next")					.attr("href"); 	})
	$("#barF")		.click(function(){ window.location.href = $("#i2 > div.sn > a:eq(0)")	.attr("href"); 	})
	$("#barL")		.click(function(){ window.location.href = $("#i2 > div.sn > a:eq(3)")	.attr("href");	})
	
	$("#barMPVd")	.click(function(){ 
		var fullimg 			= $("#i7 > a[href*='fullimg.php']").attr("href");
		if(!fullimg) fullimg 	= $("#img").attr("src");
		downloadByHref(fullimg);
	})
	
	$("#barMPVtn")	.click(function(){ 
		window.location.href = 
			$("div.sb > a:eq(0)").attr("href").replace("\/g\/","\/mpv\/") + "#page" + unsafeWindow.startpage
	})
	
	
	var speed = 300;
	$("#bar3").hover(function(){
			var SCheight = $(this).get(0).scrollHeight + 5;
			$(this).stop().animate({
				 "opacity"			: "1.0"
				,"height"			: SCheight
				,"background-color"	: "#EDEBDF"
				//$("#i1").css("background-color")
			},speed,function(){ $(this).css("height", SCheight); })
			$(this).find("img:eq(0)").stop().animateRotate(135);
		},
		function(){ 
			$(this).stop().animate({
				 "opacity"			: "0.6"
				,"height"			: "30px"
				,"background-color"	: "transparent"
			},speed)
			$(this).find("img:eq(0)").stop().animateRotate(-90);
		}
	).css({	 
		 "z-index"		:"5"
		,"opacity"		:"0.6"
		,"height"		:"30px"
		,"text-align"	:"center"
		,"overflow"		:"hidden"
	})
	
	$("#bar3 > img").hover(
		function(){ $(this).css("background-color","lightgreen"); 	},
		function(){ $(this).css("background-color",""); 			})
}

//====================================================================================================
//TagSubscribe
function TagSubscribe(){ if(!$("#searchbox").length) return;
	var elemA = "<a id='TagSub' style='color:blue;text-decoration:underline;' href='#'>顯示標籤訂閱</a>"
	$("#searchbox a[onclick*='toggle_filesearch_pane']").after("&nbsp;&nbsp;&nbsp;" + elemA)
	
	$("#TagSub").click(function(){
		TagSubInit()
		return false;
	})
}

function TagSubInit(){
	$("#fsdiv").after("<div id='TagSubDiv' class='idi'></div>")
	$("#TagSubDiv").append(
		'<p style="font-weight:bold">這邊可以檢查訂閱的標籤更新</p>'
		
	)
}

//====================================================================================================
//Last
function ButtomCredit(){
	var iconFN = GM_getResourceURL("iconFN");
	$("body").append(
	 "<div id='CreditText' align='center' style='display:none;'><br><br>"
	+"<a href='https://goo.gl/4L9grY'>E-Hentai 中文功能集 By Tast</a><br><br>"
	+'<div>Icons made by <a href="http://www.flaticon.com/authors/vaadin" title="Vaadin">Vaadin</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div><br>'
	+'<div>Icons made by <a href="http://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div><br>'
	+'<div>Icons made by <a href="https://www.iconfinder.com/PixelBuddha" title="PixelBuddha">PixelBuddha</a> from <a href="https://www.iconfinder.com/" title="iconfinder">www.iconfinder.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div><br>'
	+"banner Source：<a href='http://g.e-hentai.org/g/511812/22683948b8/'>01</a>、<a href='https://forums.e-hentai.org/index.php?showforum=50'>02</a>"
	+"</div><br>"
	+"<div align='center'><div id='Credit' style='display:inline;'>"
		+"<img src='" + iconFN + "' width='32' height='32'><br><br>"
	+"</div></div>");
	
	$("#Credit").click(function(){ $( "#CreditText" ).toggle( "blind", 500 ); })
	
	if(url.match("exhentai.org")) $("#CreditText a").css("color","white")
}




//取得網址標記
function getQueryString( paramName,paramURL){
	if(paramURL == undefined) paramURL = window.location.href;
	
	paramName = paramName .replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]").toLowerCase();
	var reg = "[\\?&]"+paramName +"=([^&#]*)";
	var regex = new RegExp( reg );
	var regResults = regex.exec( paramURL.toLowerCase());
	if( regResults == null ) {
		   //alert(regResults);
		   return "";
	} else {
		   //alert(regResults[1]);
		   return regResults [1];
	}
}

//滑動到該物件
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);

//unsafeWindow專用自訂事件觸發
function UnSafeFunction(){
	InsertFunctionCode(function(){/*
		function ObjUndefined(obj,key,tar){
			if(obj 		== undefined)	return tar; 
			var objKey = Object.keys(obj);
			for(var i = 0 ; i < objKey.length ; i++){ if(objKey[i] == key) return obj[key]; };
			return tar; 
		};
	*/})
	
	InsertFunctionCode(function(){/*
		function SetEventOut(obj){
			var elem 		= ObjUndefined(obj,"elem"		,document);
			var eventName 	= ObjUndefined(obj,"eventName"	,"default");
			var detail 		= ObjUndefined(obj,"detail"		,{"none":""});
			var event = new CustomEvent( eventName, { bubbles: true, cancelable: true,
				"detail": { detail }}
			);
			elem.dispatchEvent(event);
			return event;
		};
	*/})
}
/*
function DocStarter(){
	if(unsafeWindow.$ == undefined){
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = "https://code.jquery.com/jquery-2.2.4.min.js";
		document.getElementsByTagName("head")[0].appendChild(newScript);
		$(newScript).load(function(){
			//alert(unsafeWindow.$)
		})
	}
}
*/
//unsafeWindow專用自訂事件接收
function GetEvent(newMessageHandler,eventName,elem){
	if(eventName 	== undefined || eventName == "") eventName = "default";
	if(elem 		== undefined )  elem = document
	elem.addEventListener(eventName, newMessageHandler, false);
}

//檢測Undefined
function ObjUndefined(obj,key,tar){
	if(obj 		== undefined)	return tar; 
	var objKey = Object.keys(obj)
	for(var i = 0 ; i < objKey.length ; i++){ if(objKey[i] == key) return obj[key]; }
	return tar; 
}

//http://imagesloaded.desandro.com/
//http://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
//http://stackoverflow.com/questions/9714525/javascript-image-url-verify/9714891#9714891
//檢測圖片狀態
function testImage(url, callback, timeout) {
	if(typeof(url) == "object") url = $(url).attr("src");
    timeout = timeout || ( 1000 * 7 );
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "error");
        }
    };
    img.onload = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "success");
        }
    };
    img.src = url;
    timer = setTimeout(function() {
        timedOut = true;
		if(!$(img).prop("naturalWidth") && !$(img).prop("naturalHeight")) callback(url, "timeout");
    }, timeout); 
}

function downloadByCode(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function downloadByHref(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', filename);
  element.setAttribute('download', '');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//隨機Banner
function GetGannerRand(start){
	if(start) return GM_getResourceURL("botm" + getRandomInt(1,8));
	
	var EbannerHTML = GM_getResourceText("EbannerT");
	var EbannerS	= $(EbannerHTML).find("a[href*='.jpg'],a[href*='.png']")
	var EbannerL 	= $(EbannerS).length - 1
	var BannerImage = "http://tast.banner.tw/Javascript/EHentai/Banner/" 
					+ $(EbannerS).eq(getRandomInt(0,EbannerL)).html().substr(1)
	
	return BannerImage;
}

//插入CSS
function InsertCSSbyText(Code)	{ $("<style type='text/css'>" + Code + "</style>").appendTo("head"); }
function InsertCSSbyURL(TarURL)	{ $('head').append('<link rel="stylesheet" href="' + TarURL + '" type="text/css" />'); }

//http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
//禁止畫面捲動
var Xoffset,Yoffset
function disable_scroll() {
	Xoffset = window.pageXOffset;
	Yoffset = window.pageYOffset;
	$(window).bind("scroll",function(){ window.scrollTo(Xoffset, Yoffset);	})
}
//可用畫面捲動
function enable_scroll() {
	$(window).unbind("scroll");
	window.scrollTo(Xoffset, Yoffset);
}

//取得物件的第幾項內容
function GetObjectByNum(obj,num){
	var keys = Object.keys(obj);
	return obj[keys[num]];
}

//取得多樣判別式內容
//http://stackoverflow.com/a/7954044
//multiple match [duplicate]
function RegM(data,reg){
	var qualityRegex = reg,matches,qualities = [];
	while (matches = qualityRegex.exec(data)) {
		if(matches.length > 1) qualities.push(decodeURIComponent(matches[1]));   
	}
	return qualities;
}

//以非夾住號的形式回傳字串
function GetFunctionCode(code){	return code.toString().slice(14,-3); }

function InsertFunctionText(code){
	$('<script type="text/javascript">' + code + '</script>').appendTo("body");
}

//以非夾住號的形式插入Function加上替代內容
function InsertFunctionCode(code,data){
	code = code.toString().slice(14,-3);
	if(data != undefined){
		var Dat = LoadFormatText(code,data);
		code = Dat.out;
	}
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.innerHTML = code;
	document.getElementsByTagName("body")[0].appendChild(newScript);
	return newScript;
}
/*
LoadFormatText("textfor%1 to %2 + ?=%3",{
	"%1":"ccc",
	"%2":"ccc2",
	"%3":"ccc3",
	"file":"local/readme.js"
},function(data){
	console.error(JSON.stringify(data))
})

var sun = LoadFormatText("%posg + %1 + 5421",{
	"%1":"ccc",
	"%2":"ccc2",
	"%3":"ccc3",
	"%posg":"fuckyou"
})
console.error(JSON.stringify(sun.out))
*/
function LoadFormatText(Source,data,callback){
	if(data.file && !data.queried){
		LoadFile(data.file,function(fText){ 				//取得檔案內容
			data.queried = true								//設定已取得檔案內容
			LoadFormatText(fText,data,function(fTextNew){ 	//執行一次字串格式化
				callback.apply(this, [fTextNew]);			//異步回傳資料
			})
		})
	}
	else {
		data.src	= Source								//備份原始字串
		var object 	= Object.keys(data)						//取得每個元素標題
		for(var i = 0;i < object.length;i++){
			var RepTXT = data[object[i]]					//當前元素內容
			if(!object[i].match("%")) continue;				//跳過非替代內容
			else if(RepTXT == undefined) RepTXT = "undefined"//無此元素
			else if(typeof(RepTXT) == "number" && isNaN(RepTXT)) RepTXT = "NaN"//錯誤數值
			Source = Source.replace(new RegExp(object[i],"gm"),RepTXT)//開始替代
			//console.error(object[i] + " : " + data[object[i]])
		}
		//console.error(Source)
		data.out = Source;									//替代後資料
		if(callback) callback.apply(this, [data]);			//異步回傳
		return data;										//回傳資料
	}
}

function LoadFile(file,callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
			callback.apply(this, [xhr.responseText]);
			//console.error(xhr.responseText)
		}
	};
	xhr.send();
}
//http://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function createCookie(name,value,days,path) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
	
	if(path){}
	else path = ""
    document.cookie = name+"="+value+expires+"; path=/" + path;
}

//http://stackoverflow.com/a/15191130/4817500
$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};

/*
 * q 	= Multi-Page Viewer
 * tf 	= Tag Flagging
*/
 //$(document).ready(function() { alert(IsHathPerkAlive("q")); })
function IsHathPerkAlive(fn){
	var HP = readCookie("hath_perks");
	if(HP == null) return false;
	HP = HP.split("-")[0].split(".")
	for(var i = 0 ; i < HP.length;i++) if(HP[i] == fn) return true;
	return false;
}

var FavData = {
	defSet:["9","e56264c60c"] //http://g.e-hentai.org/gallerypopups.php?gid=9&t=e56264c60c&act=addfav
}

//GetFavData("defSet",1,function(data){ alert(data); })
function GetFavData(type,defValue,callback){
	var baseURL = url.match("exhentai") ? "https://ex":"http://g.e-"
	var gid 	= FavData[type][0];
	var token 	= FavData[type][1];
	var TarURL 	= baseURL + "hentai.org/gallerypopups.php?act=addfav&gid=" + gid + "&t=" + token
	//console.error(TarURL)
	$.get(TarURL,function(data){ //console.error(data[1]);
		data = /<textarea.+?>(.+)<\/textarea><br \/>/i.exec(data);
		if(!data.length) data[1] = defValue;
		callback.apply(this, [data[1]]);
		return data[1];
	}).fail(function(){
		callback.apply(this, [defValue]);
		return defValue;
	})
}

function ReqAPI(baseURL,dataIN,callback){
	console.info("ReqAPI:" + baseURL);
	console.info(dataIN);
	GM_xmlhttpRequest({ //Cross Domain
		method	: "POST",
		url		: baseURL + "/api.php",
		data	: JSON.stringify(dataIN),
		headers	: { "Content-Type":"application/json; charset=utf-8" },
		onload	: function(response) { //console.error(JSON.stringify(response))
			callback.apply(this, [JSON.parse(response.responseText)]);
		},
		onerror	: function(response){ console.error("ReqAPI: " + JSON.stringify(response)); }
	});
}

//======================================================================================================================
//SyncGet
//GetGsync("MainSet",function(syncData,Error,gid){ alert(syncData + " - " + Error); });
/*
GetGsync("test5",
	function(syncData,Error,gid){ 
		console.error(JSON.stringify(syncData) + " - " + Error); },
	function(statusID,statusStr){	
		console.error(statusID + " - " + statusStr);
});
*/
function GetGsync(type,callback,callbackStatus){
	callbackStatus.apply(this, [0,"開始取得雲端資料"]);
	
	console.info("GetGsync:" + type);
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://upload.e-hentai.org/manage.php",
		onload: function(response) { var data = response.responseText;
			//console.error(data);
			var GmainID = $(data).find("select.stdinput[name='gfldr'] > option:contains('E-HentaiFunction')").val();
			var APIinfo = $(data).find("script:contains('var apikey'):eq(0)").html();
			if(GmainID){
				callbackStatus.apply(this, [0.1,"已取得雲端資料夾號碼"]);
				GetSyncGalleryLists([GmainID,APIinfo]);
				createCookie("gSyncFid",GmainID,365) //ipb_member_id
			}
			else {
				callback.apply(this, ["Error","GmainID"]);
				callbackStatus.apply(this, [-0.1,"取得雲端資料夾號碼失敗"]);
			}
		},
		onerror	: function(response){ callbackStatus.apply(this, [-0.2,"取得雲端資料夾號碼失敗"]); }
	});
	
	function GetSyncGalleryLists(data){
		callbackStatus.apply(this, [1,"取得資料表"]);
		var dataIN = 
		{
			 "method"	:"managefolders"
			,"apiuid"	: new RegExp("var apiuid = (.+);"	,'i').exec(data[1])[1]
			,"apikey"	: new RegExp('var apikey = "(.+)";'	,'i').exec(data[1])[1]
			,"state"	: "1" //未發佈畫冊
			,"fid"		: data[0]
			,"ss"		: "n"
			,"sd"		: "a" //降冪排列
		}
		
		ReqAPI("https://upload.e-hentai.org",dataIN,function(APIdata){ //console.error(JSON.stringify(APIdata))
			var GsyncID , AR_Glist = APIdata.rows;
			for(var i = 0 ; i < AR_Glist.length; i++){
				if(!$("<div></div>").append(AR_Glist[i].c1).find("a:contains('" + type + "')").length) continue;
				GsyncID = AR_Glist[i].gid;
				break;
			}
			
			if(!GsyncID){
				callbackStatus.apply(this, [-1.1,"無法取得資料表"]);
				callback.apply(this, ["Error","GsyncID"]);
			}
			else {
				callbackStatus.apply(this, [1.1,"成功取得資料表"]);
				createCookie("gSyncGid-" + type,GsyncID,365)
				GetSyncGalleryData(GsyncID,function(gData,Error){ callback.apply(this, [gData,Error,GsyncID]); },callbackStatus);
			}
		})
	}
}

function GetSyncGalleryData(gid,callback,callbackStatus){
	callbackStatus.apply(this, [2,"正在查詢資料內容"]);
	console.info("GetSyncGalleryData:" + gid);
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://upload.e-hentai.org/manage.php?act=modify&gid=" + gid,
		onload: function(response) { //console.error(response.responseText);
			var textarea = $(response.responseText).find("td:contains('Gallery Description') ~ td > textarea");
			if(!$(textarea).length){
				callbackStatus.apply(this, [-2.1,"資料查詢失敗"]);
				callback.apply(this, ["Error","GetSyncGalleryData"]);
			}
			else {
				callbackStatus.apply(this, [2.1,"資料查詢成功"]);
				callback.apply(this, [JSON.parse($(textarea).html()),""]);
			}
		},
		onerror: function(response){ callbackStatus.apply(this, [-2.2,"資料查詢失敗"]); }
	})
}

//======================================================================================================================
//SyncSet
/*
SetGsync("test5","test","testdata5",function(){ },function(statusID,statusStr){
	console.error(statusID + " - " + statusStr)
})
*/
function SetGsync(type,subName,data,callback,callbackStatus){
	callbackStatus.apply(this, [0,"開始雲端作業"]);
	
	GetGsync(type,function(syncData,Error,gid){ //alert(syncData + " - " + Error); 
		callbackStatus.apply(this, [1,"檢查雲端資料"]);
		if(syncData == "Error") 
				PostGallery();
		else 	ModifyGallery(syncData,gid);
	},function(statusID,statusStr){ if(statusID < 0) console.error(statusID + " - " + statusStr); });
	
	var formData = new FormData();
	formData.append("gname"			, type);
	formData.append("gname_jpn"		, "腳本儲存資料：" + type);
	formData.append("gfldrnew"		, "E-HentaiFunction");
	formData.append("tos"			, "true");
	formData.append("public"		, "true");
	formData.append("publiccat"		, "1");
	
	function PostGallery(){ 
		callbackStatus.apply(this, [2,"正在上傳資料"]);
		var jsonData = {}
		jsonData[subName] = data;
		formData.append("creategallery"	, "submit");
		formData.append("comment"		, JSON.stringify(jsonData));
		
		GM_xmlhttpRequest({
			method	: "POST",
			url		: "https://upload.e-hentai.org/manage.php?act=new",
			data	: formData,
			//headers	: { "Content-Type":"application/json; charset=utf-8" },
			onload	: function(response) { //console.error(response.responseText);
				if(response.responseText.match("The gallery was successfully added.")){
					callbackStatus.apply(this, [2.1,"儲存成功"]);
					var gid = /manage\.php\?act=add&gid=(.+[0-9])/i.exec(response.responseText)
					console.info("Posted Gallery:" + gid);
					createCookie("gSyncGid-" + type,gid,365)
				}
				else callbackStatus.apply(this, [-2.1,"儲存失敗"]);
			},
			onerror	: function(response){ callbackStatus.apply(this, [-2.2,"修改失敗"]); }
		});
	}
	
	function ModifyGallery(syncData,gid){
		callbackStatus.apply(this, [3,"正在修改資料"]);
		syncData[subName] = data;
		formData.append("modifygallery"	, "submit");
		formData.append("comment"		, JSON.stringify(syncData));
		
		GM_xmlhttpRequest({
			method	: "POST",
			url		: "https://upload.e-hentai.org/manage.php?act=modify&gid=" + gid,
			data	: formData,
			onload	: function(response) { //console.error(response.responseText);
				if(response.responseText.match("The gallery data was successfully modified.")){
					callbackStatus.apply(this, [3,"修改成功"]);
					callback.apply(this, [syncData,gid]);
					console.info("Modify Gallery:" + gid);
				}
				else {
					callbackStatus.apply(this, [-3.1,"修改失敗"]);
					console.error(JSON.stringify(response))
					$("body").append(response.responseText)
				}
			},
			onerror	: function(response){
				callbackStatus.apply(this, [-3.2,"修改失敗"]); 
				console.error(JSON.stringify(response))
			}
		});
	}
	
	function PrintError(){
		
	}
}














