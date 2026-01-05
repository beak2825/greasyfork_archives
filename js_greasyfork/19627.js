// ==UserScript==
// @name         BaCoreMut
// @namespace    forum.gamer.com.tw
// @version      1.0.10
// @description  巴哈姆特扒文小工具
// @author       Tast
// @domain		 forum.gamer.com.tw
// @domain		 m.gamer.com.tw
// @domain		 web.archive.org
// @connect		 forum.gamer.com.tw
// @connect		 m.gamer.com.tw
// @connect		 web.archive.org
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_xmlhttpRequest
// @match        *://*.gamer.com.tw/*
// @match        *://gamer.com.tw/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js
// @require      https://greasyfork.org/scripts/28799-baha-egg/code/BAHA_EGG.js?version=186855
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @run-at 		 document-start
// @downloadURL https://update.greasyfork.org/scripts/19627/BaCoreMut.user.js
// @updateURL https://update.greasyfork.org/scripts/19627/BaCoreMut.meta.js
// ==/UserScript==
// @match        *://forum.gamer.com.tw/B.php*
// @match        *://forum.gamer.com.tw/C.php*
// @match        *://forum.gamer.com.tw/Co.php*
//http://stackoverflow.com/questions/9846028/how-to-call-gm-xmlhttprequest-within-a-webpage

var url		= window.location.href;
var bsn		= getQueryString("bsn",url) //版面ID
var ready	= 0
var WorkP	= 0
//-----------------------------------

//-----------------------------------
$(document).ready(function(){ ready = 1
	StyleCSS()			//插入自訂CSS風格
	CustomEventInject()	//網頁非沙盒自訂事件觸發
	PostListProcess() 	//文章列表批次取得標題
	PostTitleProcess()	//取得文章標題
	PostAutoComment()	//展開留言、帳號自動化
	PostCommentProcess()//取得文章留言
	AllCommentsButton()	//展開全部留言按鈕
	AllCommentsNameID()	//顯示全部留言帳號ID按鈕
	PostInformations()	//右側顯示文章相關資訊
	PostTimeIP()		//發文日期、IP高亮，更新檢查
	PostFoldInfo()		//已折疊文章資訊
	
	$(document).trigger("AutoOpenAllComments"); //展開留言自動化
	
})
$(window).load(function(){
	/*
	var config = 
	{
		title: '訂閱看板',
		buttons: egg.msgbox.OK,
		onOk: function(event){
			egg.lightbox.close();
			egg.msgbox.close();
	}}
	egg.lightbox("test");
	egg.msgbox("test", config)
	*/
})
//https://forum.gamer.com.tw/Co.php?bsn=04212&sn=2727719
//======================================================================================================
//文章列表批次取得標題
//https://forum.gamer.com.tw/C.php?bsn=60076&snA=42473214
//https://forum.gamer.com.tw/post1.php?bsn=60076&type=3&snA=3849699&sn=42472455
function PostListProcess(){
	var FirstDeleteDom = $(	"td.FM-blist3 > a[data-gtm='B頁文章列表']:contains('首篇已刪')" + "," +
							"td.FM-blist3 > cite.FM-blist3A:contains('本討論串已無文章')"	)
							
	$(FirstDeleteDom).each(function(){
		var TitleText = $(this).html()
		
		if(TitleText == "首篇已刪"){
			$(this).html("")
			$(	 "<font size='6' color='black' style='vertical-align:middle;'>◐</font>&nbsp;&nbsp;"
				+"<font color='#CCCCCC'><b>[ 首刪 ] </b></font>")
				.insertBefore($(this))
		}
		else if(TitleText == "本討論串已無文章"){
			$(this).html("<font size='6' style='vertical-align:middle;'>◑</font>&nbsp;&nbsp;<b>[ 無串 ] </b>")
		}
		else return true
		
		var snA = $(this).parent().attr("id") //主題ID
		$.get( "https://forum.gamer.com.tw/C.php?bsn=" + bsn + "&snA=" + snA, GetPostTitle)
		
		//return false //break
	})
}

function GetPostTitle(data){ //console.info(data)
	var Title 	= new RegExp("article_title=(.+)\', searchParam",'gmi').exec(data)[1]
	var snA		= new RegExp("<>snA=(.+)<>sn",'gmi').exec(data)[1]
	
	Title = decodeURIComponent(Title);
	//console.info(snA + " - " + Title)
	$("#" + snA).find("a[data-gtm='B頁文章列表']:eq(0)").html($("#" + snA).find("a").html() + Title)
	$("#" + snA).find("cite.FM-blist3A:eq(0)").html(
		$("#" + snA).find("cite").html()
		+ "<a href='https://forum.gamer.com.tw/C.php?bsn=" + bsn
		+ "&snA=" + snA + "'>" + Title + "</a>")
}

//======================================================================================================
//主題內頁
//取得文章標題
function PostTitleProcess(){
	if(!$("div.FM-cboxfold").length) return;
	var Title = new RegExp("article_title=(.+)\', searchParam",'gmi').exec($("body").html())
		Title = decodeURIComponent(Title ? Title[1]:null)
	if(	Title ==null ) return;
	//console.info(Title)
	$("title").html(Title + $("title").html())
	$(""+ "<div class='FM-cbox2'><div class='FM-cbox3'>"
			+ "<span>發表：" + GetPostDate() + "</span>"
			+ "<h2><a href='" + "#" + "'>#1</a>" + Title + "</h2></div>"
		+ "</div>"
	 ).insertBefore("div.FM-cboxfold:eq(0)")
}

//留言帳號自動化
function PostAutoComment(){
	//http://stackoverflow.com/questions/18585159/how-to-convert-password-into-md5-in-jquery
	var allCommendHash = CryptoJS.MD5(unsafeWindow.allCommend.toString()).toString()
	if(allCommendHash != "499c40fd7844f77cf6ffb3f79e73bdb9"){
		console.info ("PostAutoComment : unsafeWindow.allCommend 變更錯誤")
		console.error("PostAutoComment : unsafeWindow.allCommend 變更錯誤")
	}
	//console.info("PostAutoComment")
	
	InsertFunctionCode(function(){/*
	function allCommend(e, t, o) {
		egg("#" + o).css("display", "none"),
		egg("#close" + o).get()[0].style.display = "",
		egg("#Commendlist5_" + t).html(egg("#Commendlist_" + t).html()),
		jQuery.ajax({
			url: "/ajax/moreCommend.php",
			data: {
				bsn: e,
				snB: t
			},
			method: "GET",
			dataType: "json"
		}).done(function (e) {
			rdata_allCommend(e, "ALL")
			SubmitCustomEvent("rdata_allCommend",e)
			
		})
	}
	*/})
	
	$(document).on( "rdata_allCommend",function( e ) {
		if(GM_getValue("AutoOpenAllCommentsID", false)) AllCommentsNameID2()
			ConInfo("rdata_allCommend " + e.detail)
	});

	$(document).on( "AutoOpenAllComments",function( e ) {
		if(GM_getValue("AutoOpenAllComments", false)) OpenAllSubmited()
		
		$(document).trigger("rdata_allCommend"); //展開留言自動化
		ConInfo( "AutoOpenAllComments " + e.detail );
	});
}

//取得文章留言
//https://m.gamer.com.tw/ajax/MB_forum_commend_all.php?bsn=01473&snB=123973
function PostCommentProcess(){
	$("div.FM-cboxfold a.GPword").each(function(){
		if($(this).parent().parent().find("span:contains('【已折疊的文章】')").length) return true
		
		var snB 		= $(this).attr("id").substring(5) //文章ID
		var cboxfold 	= $(this).parent().parent().attr("id","FM-cboxfold_" + snB)
		//console.info(snB)
		//console.info("https://m.gamer.com.tw/ajax/MB_forum_commend_all.php?bsn=" + bsn + "&snB=" + snB)
		
		GM_xmlhttpRequest({
			method	: "GET",
			url		: "https://m.gamer.com.tw/ajax/MB_forum_commend_all.php?bsn=" + bsn + "&snB=" + snB,
			onload	: function(response) {
				response.bsn = bsn
				response.snB = snB
				GetPostComment(response)
			}
		});
	})
}

function GetPostComment(data){
	/*
	console.info(data.bsn)
	console.info(data.snB)
	console.info(data.responseText)
	*/
	
	var cboxfold 	= $("#FM-cboxfold_" + data.snB)
	var comment 	= $("<div class='FM-cbox1' id='FM-cbox1_" + data.snB + "'><div class='FM-cbox10' id='FM-cbox10_" + data.snB + "'></div></div>" )
	$(comment).insertAfter(cboxfold)
	
	$("#FM-cbox10_" + data.snB).append("<div id='Commendlist_" + data.snB + "' class='FM-msgbg'></div>")
	$("<div>" + data.responseText + "</div>").find("div.cbox_msg2_list").each(function(i){
		var nameID 	= getQueryString("owner",$(this).find("a").attr("href"))
		
		$(this)	.find("a").attr("target","_blank")
				.attr("href","https://home.gamer.com.tw/homeindex.php?owner=" + nameID)
				.attr("title",nameID)
		
		var nameA	= subStringReverse($(this).find("a")[0].outerHTML,5) + "</a>："
		
		$("#Commendlist_" + data.snB).append(""
			+ "<p class='FM-cbox10A' id='" + $(this).attr("id") + "'>"
				+ nameA
				//+ $(this).find("span").css("float","right")[0].outerHTML + " "
				+ $(this).find("span")[0].outerHTML + " "
				+ $(this).find("p").html()
			+ "</p>"
		)
	})
	
	$(document).trigger("rdata_allCommend");
}

//開啟全部留言
function AllCommentsButton(){
	if($("p.FM-cbox4").length == 0) return;
	
	$("p.FM-cbox10D > a").click(function(){
		var Status = $(this).parent().hasClass("open") 
			? $(this).parent().removeClass("open")
			: $(this).parent().addClass("open")
	})
	
	//$("<a class='OpenAllComments' title='快速點兩下切換自動模式' href='javascript:void(0)'>開啟留言</a>").insertAfter( $("p.FM-cbox4 > span:eq(0)") )
	
	$("p.FM-cbox4").append("<br><a class='OpenAllComments' title='快速點兩下切換自動模式' href='javascript:void(0)'>開啟留言</a>")
	
	egg(".OpenAllComments").tooltip('', {trigger:'hover', position:'after top', offset:[5,-25]})
	
	var AutoOpenAllComments = GM_getValue("AutoOpenAllComments", false)
	if(AutoOpenAllComments) $(".OpenAllComments").css("color","red")
	
	$("a.OpenAllComments").click(OpenAllSubmited).dblclick(function(){
		var enableStatus = !AutoOpenAllComments
		GM_setValue("AutoOpenAllComments",enableStatus );
		$(".OpenAllComments").css("color",enableStatus ? "red":"black")
		AutoOpenAllComments = GM_getValue("AutoOpenAllComments", false)
		//var enableMSG = enableStatus ? "啟用":"關閉"
		//alert("自動顯示全部留言：" + enableMSG)
	})
}
function OpenAllSubmited(){
	$("p.FM-cbox10D > a[id*='showoldCommend_']").each(function(){
		if($(this).parent().hasClass("open")) return true;
		var ShowChref = $(this).attr("href");
		$(this).attr("onclick",ShowChref).click();
	})
}

//顯示全部留言帳號ID
function AllCommentsNameID(){
	if($("p.FM-cbox4").length == 0) return;
	
	$("p.FM-cbox4").append("<a class='OpenAllCommentsID' title='快速點兩下切換自動模式'  href='javascript:void(0)'>留言帳號</a>")
	egg(".OpenAllCommentsID").tooltip('', {trigger:'hover', position:'after top', offset:[5,-25]})
	
	var AutoOpenAllCommentsID = GM_getValue("AutoOpenAllCommentsID", false)
	if(AutoOpenAllCommentsID) $(".OpenAllCommentsID").css("color","red")
	
	$("a.OpenAllCommentsID").click(AllCommentsNameID2).dblclick(function(){
		var enableStatus = !AutoOpenAllCommentsID
		GM_setValue("AutoOpenAllCommentsID",enableStatus );
		$(".OpenAllCommentsID").css("color",enableStatus ? "red":"black")
		AutoOpenAllCommentsID = GM_getValue("AutoOpenAllCommentsID", false)
		//var enableMSG = enableStatus ? "啟用":"關閉"
		//alert("自動顯示留言帳號ID：" + enableMSG)
	})
}

function AllCommentsNameID2(){
	$("p.FM-cbox10A[ForceID!='true']").each(function(){
		$(this).attr("ForceID","true")
		var msgbg = $(this).find("a");
		var uid = "<a target='_blank' href='http://user.gamer.com.tw/help/abuse.php?uid=" + $(msgbg).attr("title") + "'><font color=green>" + $(msgbg).attr("title") + "</font></a>&nbsp;";
		
		var account = $(msgbg).attr("title").toLowerCase()
		var imgRand	= Math.random();
		var imgSrcS	= "https://avatar2.bahamut.com.tw/avataruserpic/" + account.substr(0, 1) + "/" + account.substr(1, 1) + "/" + account + "/" + account + "_s.png"
		var imgSrc	= "https://avatar2.bahamut.com.tw/avataruserpic/" + account.substr(0, 1) + "/" + account.substr(1, 1) + "/" + account + "/" + account + ".png"
		//var imgInfo	= '<a style="background-color: #ebf6f8;"><img src="' + imgSrc + '"></a>'
		var imgInfo	= '<img src="' + imgSrc + '">'
		var img		= 	 "<img name='boardUserInfo_" + imgRand + "' src='" + imgSrcS + "' "
						+"title='" + imgInfo + "' "
						//+"id='imgInfo_" + $(this).attr("id") + "' "
						//+"class=''"
						+"height='18' width='18' />"
						
		$(msgbg).attr("target","_blank")
			//.html("<font color='black'> ( </font><a color='green'>" + $(msgbg).html() + "</a><font color='black'> ) </font>")
			.html("<a color='green'>" + $(msgbg).html() + "</a>")
			.before( img )
			.before( uid )
		
		
		egg("img[name='boardUserInfo_" + imgRand + "']")
			.tooltip('', {trigger:'hover', position:'after top', offset:[5,-25]})
	});
}

//右側顯示文章相關資訊
function PostInformations(){
	//var domP = $("#BH-slave > div.BH-rbox FM-rbox14 > p")
	var domP = $("#BH-slave > div.BH-rbox > p")
	
	var PostDate = GetPostDate ()== "" ? "":"<br>本頁首篇發表日期：" + GetPostDate()
	var ReplyDate= GetReplyDate()== "" ? "":"<br>主題尾篇發表日期：" + GetReplyDate()
	
	$("<p>" + PostDate + ReplyDate + "</p>").insertAfter(domP)
}

//發文日期、IP高亮，更新時間檢查
function PostTimeIP(){
	var cbox8 = $("div.FM-cbox8")
	if(!$(cbox8).length) return;
	
	$(cbox8).each(function(i){
		//console.info(i)
		var html 		= $(this).html()
		var PostTime	= $(this).parent().find("p.FM-cbox4 > span:eq(0)").html().substring(3)
		var TimeDate 	= RegexExec('最後編輯:([?\\d]+-[?\\d]+-[?\\d]+ [?\\d]+:[?\\d]+:[?\\d]+)',html)
		var IP	 		= RegexExec('Origin: &lt;(.+)&gt;',html)
		var DateColor	= TimeDate 	== PostTime ? "green":"red"
		var IPColor		= $(this).find("img[title='手機發文']").length ? "red":"green"
			IPColor		= IP.match("BAHAMUT") 	? "blue" :IPColor
		//console.info([TimeDate,IP,PostTime])
		
		$(this).html(	html.replace(TimeDate				,"<a class='FM-cbox8-TimeDate'>" 	+ TimeDate 	 + "</a>")
							.replace("&lt;" + IP + "&gt;"	,"<a class='FM-cbox8-IP'>&lt;" 		+ IP + "&gt;"+ "</a>"))
							
		var Time_titleHelp 	=	"-<a style='color:green;'>綠色</a>：文章沒有編輯過- <br>" +
								"-<a style='color:red;'  >紅色</a>：文章已有編輯過- <br>"
		var IP_titleHelp	= 	"-<a style='color:green;'>綠色</a>：使用電腦發文IP- <br>" +
								"-<a style='color:red;'  >紅色</a>：使用手機發文IP- <br>" +
								"-<a style='color:blue;' >藍色</a>：站方內部發文IP- <br>"
		
		$(this).find("a.FM-cbox8-TimeDate")	.css("color",DateColor) .attr("title",Time_titleHelp)
		$(this).find("a.FM-cbox8-IP")		.css("color",IPColor)	.attr("title",IP_titleHelp)
	})
	
	egg("a.FM-cbox8-TimeDate")	.tooltip('', {trigger:'hover', position:'after top', offset:[5,-25]})
	egg("a.FM-cbox8-IP")		.tooltip('', {trigger:'hover', position:'after top', offset:[5,-25]})
}

//已折疊文章資訊
function PostFoldInfo(){
	$("div.FM-cboxfold").each(function(){ 
		var span0 	= $(this).find("span:eq(0)")
		var UserID 	= $(span0).html()
		var UserIDa	= "<a style='color:blue;' target='_blank' href='https://home.gamer.com.tw/" + UserID + "'>" + UserID + "</a>"
		var Info	= $(span0).parent().find("span:eq(1)").html()
			Info 	= Info.replace("(" + UserID + ")","( " + UserIDa + " )")
		var Reason	= new RegExp('#?.+【?\\W+】(.+)：.+','gmi').exec(Info)
		if(Reason && Reason.length > 0)
			Info	= Info.replace(Reason[1],"<a style='color:red;' target='_blank' href='https://home.gamer.com.tw/" + Reason[1] + "'>" + Reason[1] + "</a>")
		
		$(span0).html(UserIDa)
		$(span0).parent().find("span:eq(1)").html(Info)
	})
}

//======================================================================================================
//自動使用外部服務備份主題內容
//https://web.archive.org/save/https://forum.gamer.com.tw/C.php?bsn=01473&snA=28110
//https://forum.gamer.com.tw/C.php?bsn=01473&snA=28110&tnum=1
var Surl= "https://web.archive.org/save/"
var Wurl= "https://web.archive.org/web/"
WebArchive() 	//自動使用外部服務備份主題內容
function WebArchive(){
	if(url.match("forum.gamer.com.tw\/C.php")){
		var bsn = getQueryString("bsn",url)
		var snA	= getQueryString("snA",url)
		var Page= getQueryString("page",url) == "" ? 1:getQueryString("page",url)
		var Burl= "https://forum.gamer.com.tw/C.php?bsn=" + bsn + "&snA=" + snA
		var Turl= Burl + "&page=" + Page
		var Gurl= Burl + "&page=" + Page
		/*
		console.info(Turl)
		console.info(Burl)
		console.info(Gurl)
		*/
		ReadyLaunch(function(){
			var color = $( "div.FM-cbox3:eq(0)" ).css("color")
			$( "div.FM-cbox3:eq(0) > h2" ).contents()
			.filter(function(){ return this.nodeType !== 1; })
			.wrap( "<a id='tArchive' title='顯示本頁存檔' target='_blank' style='color:" + color + ";' href='" + Wurl + Gurl + "'></a>" );
		},50)
		
		WebArchiveREQ(Turl,function(response){ //console.info(response.responseText)
			ReadyLaunch(function(){ 
				$("#tArchive").html( $("#tArchive").html() + 
					"<font size='6' style='vertical-align:middle;'>◈</font>"
				)
			},100)
		})
	}
	else WebArchiveREQ(url)
}

function WebArchiveREQ(Turl,onloadCallback){
	GM_xmlhttpRequest({
		method	: "GET",
		url		: Surl + Turl,
		onload	: function(response){
			console.info("%cBaCoreMut%c WebArchiveREQ : " + Wurl + Turl,"background-color: #bada55","background-color:")
			if(response.statusText != "OK") console.info(response)
			if(onloadCallback) 				onloadCallback(response)
		}
	});
}

//======================================================================================================
//插入自訂CSS風格
function StyleCSS(){
	if(!$("head").length){ $(document).ready(StyleCSS); return; };
	$('head').append(""
		+"<style type='text/css'>"
			//+"p.FM-cbox10A:hover { background-image:url('');background-color:#b6cad4; }"
			+"p.FM-cbox10A:hover { background-image:url('');background-color:#E4F1F5; }"
			+"p.FM-cbox10A:hover > span { color:darkgreen; }"
			+"p.FM-cbox10A span { float:right }"
		+"</style>")
}
//取得網址標記
function getQueryString( paramName,paramURL){
	if(	paramURL == undefined) paramURL = window.location.href;
		paramName = paramName .replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]").toLowerCase();
	var reg = "[\\?&]"+paramName +"=([^&#]*)";
	var regex = new RegExp( reg );
	var regResults = regex.exec( paramURL.toLowerCase());
	if( regResults == null ) 
			return "";
	else 	return regResults [1];
}
//取得Meta資訊
function getMetaContentByName(name,content){
   var content = (content==null)?'content':content;
   return document.querySelector("meta[name='"+name+"']").getAttribute(content);
}
//取得本頁發表日期
function GetPostDate(){
	var regexData	= new RegExp('<Attribute name="ctime" value="(.+)" \/>','gmi').exec($("head").html())
	var timestamp  	= parseInt(regexData ? regexData[1]:0)
	return timestamp == 0 ? "":GetDate(timestamp)
}
//取得最後回覆日期
function GetReplyDate(){
	//<Attribute name="mtime" value="1456245250" />
	var regexData	= new RegExp('<Attribute name="rtime" value="(.+)" \/>','gmi').exec($("head").html())
	var timestamp  	= parseInt(regexData ? regexData[1]:0)
	return timestamp == 0 ? "":GetDate(timestamp)
}
//日期格式化
function GetDate(timestamp){
	var date 	= new Date(timestamp * 1000)
	var hours 	= date.getHours()
	var minutes = "0" + date.getMinutes()
	var seconds = "0" + date.getSeconds()
	var year 	= date.getFullYear()
	var month 	= date.getMonth() + 1
	var date2 	= date.getDate()

	// Will display time in 10:30:23 format
	var formattedTime = year + "-" + month + "-" + date2 + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	//console.info(formattedTime)
	return formattedTime
}
//ready強制執行 + 延遲
function ReadyLaunch(callback,TimeOutCNT){
	if(!TimeOutCNT) TimeOutCNT = 0
	if(ready) 		setTimeout(callback,TimeOutCNT)
	else			$(document).ready(function(){ setTimeout(callback,TimeOutCNT); })
}
//去掉字串最後指定範圍
function subStringReverse(str,num){ return str.substring(0, str.length - num); }
//以非夾住號的形式插入Function加上替代內容
function InsertFunctionCode(code){
	code = code.toString().slice(14,-3);
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.innerHTML = code;
	document.getElementsByTagName("body")[0].appendChild(newScript);
	return newScript;
}
//https://www.sitepoint.com/javascript-custom-events/
//網頁非沙盒自訂事件觸發
function CustomEventInject(){
	InsertFunctionCode(function(){/*
	function SubmitCustomEvent(eventName,eventData){
		var event = new CustomEvent(eventName, {
			detail: { eventData }
		});
		document.dispatchEvent(event);
	}
	*/})
}
//正則表達式多重判斷項
function RegexExec(path,inData,inVar){
	inVar		= inVar		|| { }
	inVar.num 	= inVar.num ||  1
	inVar.flag	= inVar.flag|| "g"
	var data 	= new RegExp(path,inVar.flag).exec(inData)
	var output	= null
	if(inVar.call && data) inVar.call(data[num])
	if(!data) 	return inVar.def
	else		return data[inVar.num]
}
//資訊輸出控制台
//http://stackoverflow.com/questions/7505623/colors-in-javascript-console
function ConInfo(data){ if(!WorkP) return; console.info(data); }

//https://im.gamer.com.tw/bmw/jsIson.php?u=bhunji2

//======================================================================================================
/*****
v1.0.3	2017.04.07
	主題列表排版、主題頁視窗標題更改
	自動線上備份主題內容
v1.0.4	2017.04.07
	留言帳號額外顯示方形頭像(滑鼠覆蓋顯示完整勇造)
	留言閱讀底色、時間右對齊
	文章右側顯示首篇尾篇發文日期
	展開全部留言按鈕、顯示全部留言帳號ID按鈕
v1.0.6 	2017.04.08
	修正第一項留言無底色
	修正有些頭像無法顯示原勇造
	新增自動展開所有留言、帳號ID頭像功能
v1.0.7 	2017.04.09
	修正有時候留言ID頭像不會自動顯示
	文章發文日期、IP高亮(條件性)
	檢查文章是否有編輯過
v1.0.8 2017.04.10
	已折疊(刪除)文章標題作者與版主高亮連結
	修正主題列表標題重複問題
	修正顯示單文章時運作不正常問題
v1.0.9 2017.04.11
	線上備份基本上支援全站
	
v1.0.10 2017.04.25
	發表日期只有可顯示時才顯示
	
	
*****/




