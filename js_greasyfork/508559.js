// ==UserScript==
// @name         北科入口網站 - 跳過驗證碼
// @namespace    http://tampermonkey.net/
// @version      2024-12-24 v1
// @description  登入時免驗證碼登入
// @author       umeow
// @match        https://nportal.ntut.edu.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @connect      istream.ntut.edu.tw
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508559/%E5%8C%97%E7%A7%91%E5%85%A5%E5%8F%A3%E7%B6%B2%E7%AB%99%20-%20%E8%B7%B3%E9%81%8E%E9%A9%97%E8%AD%89%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/508559/%E5%8C%97%E7%A7%91%E5%85%A5%E5%8F%A3%E7%B6%B2%E7%AB%99%20-%20%E8%B7%B3%E9%81%8E%E9%A9%97%E8%AD%89%E7%A2%BC.meta.js
// ==/UserScript==

const login = (muid, mpassword) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://nportal.ntut.edu.tw/login.do",
            data: new URLSearchParams({ muid, mpassword }),
            headers: {
                "Referer": "https://nportal.ntut.edu.tw/index.do",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Direk android App",
            },
            onload: async (response) => {
                const responseJson = JSON.parse(response.responseText);

                if(responseJson.errorMsg.includes("密碼錯誤")) return alert("帳號或密碼輸入錯誤，請重新登入！");

                if(responseJson.errorMsg.includes("已被鎖住")) return alert("帳號已被鎖住！");

                if(responseJson.resetPwd && responseJson.errorMsg.includes("密碼已過期")) return alert("密碼已過期，請停用腳本後使用網頁端重新登入！");

                if(!responseJson.success && responseJson.errorMsg.includes("驗證手機")) return alert("手機須驗證，請停用腳本後使用網頁端重新登入！");

                if(!responseJson.success) return alert("登入失敗，未知錯誤！");

                if(responseJson.passwordExpiredRemind?.trim()) alert("請注意，帳戶密碼即將過期！");

                document.cookie = `muid=${muid.toLowerCase()};`
                window.unsafeWindow.location.href = 'https://nportal.ntut.edu.tw/myPortal.do';
            }
        });
    });
}

const isLogined = async () => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://nportal.ntut.edu.tw/myPortal.do",
            onload: function(response) {
                try {
                    JSON.parse(response.responseText)
                    resolve(true);
                } catch(_err) {
                    resolve(false);
                }
            }
        });
    });
}

const deleteAuthcode = () => {
    if(document.querySelector(".authcode")) {
        document.querySelector(".authcode").nextElementSibling.remove();
        document.querySelector(".authcode").remove()

        window.unsafeWindow.login1 = async () => {
            const muid = document.querySelector("#muid").value;
            const mpassword = document.querySelector("#mpassword").value;

            login(muid, mpassword);
        }

        window.unsafeWindow.changeAuthImage = () => {
            console.log("阻擋驗證碼獲取");
        }
    } else {
        setTimeout(deleteAuthcode, 100);
    }
}

const isAPI = (text) => {
    try {
        JSON.parse(text);
        return true;
    } catch(_err) {
        return false;
    }
}

if(window.unsafeWindow.location.pathname === "/index.do") {
    isLogined().then(result => {
        if(result) {
            window.unsafeWindow.location.href = 'https://nportal.ntut.edu.tw/myPortal.do';
            return;
        }

        deleteAuthcode();
    })
}

const announceBoxFilesToHTML = (arr) => {
    let result = "";
    for(const file of arr) {
        result += `<a href="javascript:eipFileDownload('${file.realName}','${file.fileName}','${file.realPath}')">${file.fileName}</a>`;
    }
    return result;
}

if(window.unsafeWindow.location.pathname === "/myPortal.do") {
    if(!isAPI(document.body.innerHTML)) return;

    document.body.innerHTML = "";
    document.body.style = "margin: 0;";

    const { muid } = JSON.parse(`{"${document.cookie.replace(/=/g,'":"').replace(/; /g,'","')}"}`);

    const html = `<html lang="zh-TW" xmlns="http://www.w3.org/1999/xhtml" style="height:100%;">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8,IE=10,IE=11,Chrome=1">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta name="viewport" content="width=device-width, initial-scale=0.72, maximum-scale=1.0, minimum-scale=0.72"><!-- 2013/03/22 mobile device width 1024 -->
	<title>臺北科大校園入口網站</title>
	<link rel="bookmark" href="#">
	<link rel="shortcut icon" href="#">
	<link rel="stylesheet" type="text/css" href="images/reset.css">
	<!--[if IE]>
	<link rel="StyleSheet" type="text/css" href="dojo-1.7.2/dojo/resources/dojo.css">
	<link rel="StyleSheet" type="text/css" href="dojo-1.7.2/dijit/themes/tundra/tundra.css">
	<![endif]-->
	<!--[if !IE]>-->
	<link rel="StyleSheet" type="text/css" href="dojo-1.17.3/dojo/resources/dojo.css">
	<link rel="StyleSheet" type="text/css" href="dojo-1.17.3/dijit/themes/tundra/tundra.css">
	<!--<![endif]-->
	<link rel="stylesheet" type="text/css" href="images/eip.css">
	<link rel="stylesheet" type="text/css" href="images/eip3.css">
	<link rel="stylesheet" type="text/css" href="images/cal/cal.css">

	<link rel="stylesheet" type="text/css" href="images/header/header.css">

		<link rel="stylesheet" type="text/css" href="template/ntut/appView/layout.css">

	<link rel="stylesheet" type="text/css" href="template/ntut/eip3.css">
    <script type="text/javascript" src="eip2-js/ajax.js"></script>
    <script type="text/javascript" src="eip2-js/box_activity.js"></script>
    <script type="text/javascript" src="eip2-js/box_announce.js"></script>
    <script type="text/javascript" src="eip2-js/box_aptree.js"></script>
    <script type="text/javascript" src="eip2-js/box_asset.js"></script>
    <script type="text/javascript" src="eip2-js/box_bookmark.js"></script>
	<script type="text/javascript" src="eip2-js/box_cal.js"></script>
	<script type="text/javascript" src="eip2-js/box_calendar.js"></script>
	<script type="text/javascript" src="eip2-js/box_efolder.js"></script>
	<script type="text/javascript" src="eip2-js/box_forum.js"></script>
	<script type="text/javascript" src="eip2-js/box_ldapbox.js"></script>
	<script type="text/javascript" src="eip2-js/box_log.js"></script>
	<script type="text/javascript" src="eip2-js/box_message.js"></script>
	<script type="text/javascript" src="eip2-js/box_orgtree.js"></script>
	<script type="text/javascript" src="eip2-js/box_password.js"></script>
	<script type="text/javascript" src="eip2-js/box_profile.js"></script>
	<script type="text/javascript" src="eip2-js/box_questionary.js"></script>
	<script type="text/javascript" src="eip2-js/box_session.js"></script>
	<script type="text/javascript" src="eip2-js/box_survey.js"></script>
	<script type="text/javascript" src="eip2-js/box_task.js"></script>
	<script type="text/javascript" src="eip2-js/eip.js"></script>
	<script type="text/javascript" src="eip2-js/eip-ftp.js"></script>
	<script type="text/javascript" src="eip2-js/eip2-ajax.js"></script>
	<script type="text/javascript" src="eip2-js/eip2-popup.js"></script>
	<!--[if IE]><script type="text/javascript" src="eip2-js/eip-transfer4ie8.js"></script><![endif]-->
	<!--[if !IE]>--><script type="text/javascript" src="eip2-js/eip-transfer.js"></script><!--<![endif]-->
	<script type="text/javascript" src="eip2-js/eip3-dom-event.js"></script>
	<script type="text/javascript" src="eip2-js/stationery.js"></script>
	<!--
	<script type="text/javascript" src="eip2-js/eip-images.js"></script>
	<script type="text/javascript" src="eip2-js/box_banner.js"></script>
	<script type="text/javascript" src="eip2-js/box_repair.js"></script>
	<script type="text/javascript" src="eip2-js/box_eportfolio.js"></script>
	<script type="text/javascript" src="eip2-js/box_marquee.js"></script>
	<script type="text/javascript" src="eip2-js/eip2-graphics.js"></script>
	 -->
	<script type="text/javascript" src="eip2-js/jquery-3.6.0.min.js"></script>
	<script type="text/javascript" src="eip2-js/notify.min.js"></script>
	<script type="text/javascript" src="template/ntut/eip2.js"></script>
	<script type="text/javascript" src="htmlEdit/wysiwyg.js"></script>
	<!--[if IE]><script type="text/javascript" src="dojo-1.7.2/dojo/dojo.js" djConfig="parseOnLoad:true"></script><![endif]-->
	<!--[if !IE]>--><script type="text/javascript" src="dojo-1.17.3/dojo/dojo.js" djConfig="parseOnLoad:true"></script><!--<![endif]-->
	<script>
	//===2012/11/07 不提供滑鼠右鍵選單===
	document.oncontextmenu=new Function("return false");
	dojo.require("dojo.back");
	dojo.require("dojo.parser");
	dojo.require("dojo.io.iframe");
	dojo.require("dojox.layout.ContentPane");
	dojo.require("dijit.Dialog");
	dojo.require("dijit.form.Button");
	dojo.require("dijit.form.ComboBox");
	dojo.require("dijit.form.DateTextBox");
	dojo.require("dijit.form.TimeTextBox");
	dojo.require("dijit.layout.BorderContainer");
	dojo.require("dijit.Menu");
	dojo.require("dijit.layout.TabContainer");
    dojo.require("dojox.form.MultiComboBox");
	dojo.require("dojox.encoding.crypto.Blowfish");
    dojo.back.init();
	dojo.addOnLoad(function(){
		dojo.back.setInitialState({
			back: function(){
				location.reload(true);
				return null;
			}
		});
	});
	</script>
</head>
<style type="text/css">
<!--
div.boxOuter.boxDragSortActive {
	color: transparent;
	border: 1px solid #F77;
}
#Column1 {width:32%; padding:15px .5% 15px 1%;}
#Column2 {width:32%; padding:15px .5%;}
#Column3 {width:32%; padding:15px .5%;}
@media screen and (max-width: 1024px){
	#Column1 {width:48%; height:auto;}
	#Column2 {width:48%; height:auto;}
	#Column3 {width:48%; height:auto;}
}
@media screen and (max-width: 768px){
	#Column1 {width:96%; height:auto;}
	#Column2 {width:96%; height:auto;}
	#Column3 {width:96%; height:auto;}
}
.words{
	font-size:12pt;
	font-family:微軟正黑體;
	background:#FAFAFA;
}
-->



	#header{
		background-image:url('template/ntut/header_back_std.jpg');
		height:105px;
		width: 100%;
		position:relative;
	}
	.nav ul::before {
		content:'';
		position:absolute;
		top:0;
		right:0;
		bottom:0;
		left:0;
		z-index:-1;
		background:url('images/header/nav_bg.png') rgba(240, 240, 240, 0.7);
		box-shadow:inset 1px 1px 5px rgba(51, 204, 204, 0.5);
		transform: perspective(100px) rotateX(5deg);
		transform-origin:right;
	}
</style>
<body class="tundra" style="height:100%;">
<div id="mainContainer" dojoType="dijit.layout.BorderContainer" data-dojo-props="design:'headline', gutters:false" style="width:100%; height:100%;">
	<div id="header" dojoType="dojox.layout.ContentPane" data-dojo-props="region:'top'" href="myPortalHeader.do"></div>
	<div id="floatingBoxParentContainer" dojoType="dojox.layout.ContentPane" data-dojo-props="region:'center'" style="width:100%; overflow:auto;">
		<!-- 主內容開始 -->


			<div id="Column1" class="boxDragSortEnable" data-role="drag-drop-container" draggable="false"></div>
			<div id="Column2" class="boxDragSortEnable" data-role="drag-drop-container" draggable="false"></div>
			<div id="Column3" class="boxDragSortEnable" data-role="drag-drop-container" draggable="false"></div>
			<!-- 判斷圖示大小 開始-->




			<!-- 判斷圖示大小 結束-->

		<!-- 主內容 結束 -->
	</div>
</div>
<div id="remind" dojoType="dojox.layout.ContentPane" href="calRemind.do"></div>



		<!-- 功能框 開始 -->
		<div id="box_1540290758779" class="boxOuter" draggable="true">
			<div class="boxHeader" style="display:table-row; height:32px;">
				<div class="eipBoxTitle" style="display:table-cell; padding-top:5px; padding-left:55px; position:relative;">



					<div style="position:absolute; top:-10px; left:5px;"><a href="javascript:boxReload('1540290758779')"><img src="images/icon/html.png" width="50" height="45" alt="校園行動APP入口平台"></a></div>
					校園行動APP入口平台
					<div style="width:70px; position:absolute; top:7px; right:5px;">



					</div>
				</div>
			</div>
			<div class="boxContentOuter">



					<iframe id="frameHtml1540290758779" frameborder="0" src="https://nportal.ntut.edu.tw/ntut/app.html" style="width:100%; height:200px;" title="校園行動APP入口平台"></iframe>


			</div>
			<div class="boxCover"></div>
		</div>
		<!-- 功能框 結束 -->



		<!-- 功能框 開始 -->
		<div id="box_calendar" class="boxOuter" draggable="true">
			<div class="boxHeader" style="display:table-row; height:32px;">
				<div class="eipBoxTitle" style="display:table-cell; padding-top:5px; padding-left:55px; position:relative;">



					<div style="position:absolute; top:-10px; left:5px;"><a href="javascript:boxReload('calendar')"><img src="images/icon/calendar.png" width="50" height="45" alt="我的行程"></a></div>
					我的行程
					<div style="width:70px; position:absolute; top:7px; right:5px;">



							<div onClick="boxPersonalDel('3','calendar')" style="width:20px; height:20px; background:url('images/close3.gif') no-repeat 50% 50%; float:right; cursor:pointer;"></div>

					</div>
				</div>
			</div>
			<div class="boxContentOuter">

					<div id="div_calendarContent" dojoType="dojox.layout.ContentPane" class="boxContent" href="calBox.do" style="overflow-x:visible; overflow-y:auto;" refreshOnShow="true"></div>




			</div>
			<div class="boxCover"></div>
		</div>
		<!-- 功能框 結束 -->



		<!-- 功能框 開始 -->
		<div id="box_task" class="boxOuter" draggable="true">
			<div class="boxHeader" style="display:table-row; height:32px;">
				<div class="eipBoxTitle" style="display:table-cell; padding-top:5px; padding-left:55px; position:relative;">



					<div style="position:absolute; top:-10px; left:5px;"><a href="javascript:boxReload('task')"><img src="images/icon/task.png" width="50" height="45" alt="待辦事項"></a></div>
					待辦事項
					<div style="width:70px; position:absolute; top:7px; right:5px;">



							<div onClick="boxPersonalDel('3','task')" style="width:20px; height:20px; background:url('images/close3.gif') no-repeat 50% 50%; float:right; cursor:pointer;"></div>

					</div>
				</div>
			</div>
			<div class="boxContentOuter">

					<div id="div_taskContent" dojoType="dojox.layout.ContentPane" class="boxContent" href="taskBox.do" style="overflow-x:visible; overflow-y:auto;" refreshOnShow="true"></div>




			</div>
			<div class="boxCover"></div>
		</div>
		<!-- 功能框 結束 -->



		<!-- 功能框 開始 -->
		<div id="box_aptree" class="boxOuter" draggable="true">
			<div class="boxHeader" style="display:table-row; height:32px;">
				<div class="eipBoxTitle" style="display:table-cell; padding-top:5px; padding-left:55px; position:relative;">



					<div style="position:absolute; top:-10px; left:5px;"><a href="javascript:boxReload('aptree')"><img src="images/icon/aptree.png" width="50" height="45" alt="資訊系統"></a></div>
					資訊系統
					<div style="width:70px; position:absolute; top:7px; right:5px;">



					</div>
				</div>
			</div>
			<div class="boxContentOuter">

					<div id="div_aptreeContent" dojoType="dojox.layout.ContentPane" class="boxContent" href="aptreeBox.do" style="overflow-x:visible; overflow-y:auto;" refreshOnShow="true"></div>




			</div>
			<div class="boxCover"></div>
		</div>
		<!-- 功能框 結束 -->



		<!-- 功能框 開始 -->
		<div id="box_announce" class="boxOuter" draggable="true">
			<div class="boxHeader" style="display:table-row; height:32px;">
				<div class="eipBoxTitle" style="display:table-cell; padding-top:5px; padding-left:55px; position:relative;">



					<div style="position:absolute; top:-10px; left:5px;"><a href="javascript:boxReload('announce')"><img src="images/icon/announce.png" width="50" height="45" alt="公告"></a></div>
					公告
					<div style="width:70px; position:absolute; top:7px; right:5px;">



					</div>
				</div>
			</div>
			<div class="boxContentOuter">

					<div id="div_announceContent" dojoType="dojox.layout.ContentPane" class="boxContent" style="overflow-x:visible; overflow-y:auto;" refreshOnShow="true"><div class="eipBox grid">

	<ul>


		<li>
		    <div class="mainTitle">

            	<a href="javascript:eipDialogPopup('announceItemShow.do?serialNo=46', '公告內容');">本校行事曆</a>
			</div>
			<div class="subDescription">
				計算機與網路中心系統組/黃慧娟 - 2017/03/17 15:21:59
				<!--


				 -->


			</div>
		</li>



		<li>
		    <div class="mainTitle">

            	<a href="javascript:announceItemShow('27')">請利用個人設定填寫備用信箱，當忘記密碼時即可進行線上重設申請</a>
			</div>
			<div class="subDescription">
				計算機與網路中心系統組/黃慧娟 - 2014/01/09 09:20:53
				<!--


				 -->


			</div>
		</li>



		<li>
		    <div class="mainTitle">

            	<a href="javascript:announceItemShow('12')">校園入口網站操作手冊</a>
			</div>
			<div class="subDescription">
				計算機與網路中心系統組/黃慧娟 - 2013/01/22 10:18:09
				<!--


				 -->


			</div>
		</li>


	</ul>
</div>
</div>




			</div>
			<div class="boxCover"></div>
		</div>
		<!-- 功能框 結束 -->




<!-- downloadForm for 檔案下載 -->
<form name='downloadForm' action='' target='_blank' method='post'>
	<input type='hidden' name='realname' value=''>
	<input type='hidden' name='downloadName' value=''>
	<input type='hidden' name='downloadPath' value=''>
</form>
<!-- for POP視窗 -->
<div dojoType="dijit.Dialog" id="eipDialog" onHide="this.destroyDescendants()"></div>
<div dojoType="dijit.Dialog" id="nbgDialog" onHide="this.destroyDescendants()"></div>
<div dojoType="dijit.Dialog" id="exeDialog" onHide="this.destroyDescendants()"></div>
<div id="divPopup" dojoType="dojox.layout.ContentPane"></div>
<div id="popupCont" dojoType="dojox.layout.ContentPane"></div>
<input type="hidden" id="popTop">
<input type="hidden" id="popLeft">
<input type="hidden" id="muid" value="${muid}">
<input type="hidden" id="pageStatus" value="1">
<input type="hidden" id="winOpenFlag" value="0">
<input type="hidden" id="locale" value="zh_TW">
<input type="hidden" id="ssoIdChk" value="">
<input type="hidden" id="fileUploadFilter" value="*.exe">


</body>
<script type="text/javascript">


	document.getElementById("Column3").appendChild(document.getElementById("box_1540290758779"));

	document.getElementById("Column3").appendChild(document.getElementById("box_calendar"));

	document.getElementById("Column3").appendChild(document.getElementById("box_task"));

	document.getElementById("Column2").appendChild(document.getElementById("box_aptree"));

	document.getElementById("Column1").appendChild(document.getElementById("box_announce"));

var anchor = document.createElement("div");
anchor.setAttribute("id", "boxInsertAnchor");
function dragStart(e) {
	const dragSources = document.querySelectorAll(".boxCover");
	Array.prototype.slice.call(dragSources).forEach(function(dragSource){
	    dragSource.className = "boxCoverActive";
	});
	document.getElementById(e.target.id).classList.add('boxDragSortActive');
	e.dataTransfer.setData("text", e.target.id);
	anchor.style.display = "block";
	anchor.style.border = "1px dashed #F77";
}
function dropped(e) {
	cancelDefault(e);
	const id = e.dataTransfer.getData("text");
	const dragNode = document.getElementById(id);
	try{
		if(e.target.className == "boxDragSortEnable"){
			e.target.replaceChild(dragNode, anchor);
		}else{
			let targetNode = e.target.parentNode;
			while(targetNode.className != "boxOuter"){
				targetNode = targetNode.parentNode;
			}
			targetNode.parentNode.replaceChild(dragNode, anchor);
		}
		chkAllBox();
	}catch(err){
		anchor.parentNode.removeChild(anchor);
	}finally{
		const dragSources = document.querySelectorAll(".boxCoverActive");
		Array.prototype.slice.call(dragSources).forEach(function(dragSource){
		    dragSource.className = "boxCover";
		});
		dragNode.classList.remove('boxDragSortActive');
		e.dataTransfer.clearData();
	}
}
function dragEnter(e) {
	cancelDefault(e);
	try{
		if(e.target.className == "boxDragSortEnable"){
			e.target.appendChild(anchor);
		}else{
			let targetNode = e.target.parentNode;
			while(targetNode.className != "boxOuter"){
				targetNode = targetNode.parentNode;
			}
			targetNode.parentNode.insertBefore(anchor, targetNode);
		}
	}catch(err){
		return false;
	}
}
function cancelDefault(e) {
	e.preventDefault();
	e.stopPropagation();
	return false;
}
var dragSources = document.querySelectorAll("[draggable='true']");
Array.prototype.slice.call(dragSources).forEach(function(dragSource){
    dragSource.addEventListener("dragstart", dragStart);
});
var dropTargets = document.querySelectorAll("[data-role='drag-drop-container']");
Array.prototype.slice.call(dropTargets).forEach(function(dropTarget){
	dropTarget.addEventListener("drop", dropped);
	dropTarget.addEventListener("dragenter", dragEnter);
	dropTarget.addEventListener("dragover", cancelDefault);
});

	var timerID = null ;
	var InitTime = 30*60;	//====time out 期限，單位：分鐘=========
	if("umeow"=="direk")
		InitTime = 4*60;
	var LogoutTime = InitTime;
	var timeoutAlertSec = 60 * 3;	//===倒數前幾秒=======
	// 20210311 判斷閒置時間改版
	var sessionActDate = new Date();
	var sessionActTime = sessionActDate.getTime();
	var sessionNowDate = new Date();
	var sessionNowTime = sessionNowDate.getTime();
	var sessionIdleSec = (sessionNowTime-sessionActTime)/1000;
	var sessionOutSec = InitTime - sessionIdleSec;

    setInterval("resetTime()", 1000);

	document.onmousedown=resetTime;
	document.onkeydown=resetTime;

	updateTime();


//var v = dojo.version;
//document.write("version..."+v);
/*
//===檢查按下鍵盤===
function eipKeydown(){
	//alert(event.keyCode);
	if(event.keyCode == 116){
		//alert(1);
		//toIndex();
		thetime = (new Date()).getTime();
		top.location.href = "myPortal.do?toIndex=TRUE&thetime=" + thetime;
		return false;
	}else{
		resetTime();
	}
}
document.onkeydown = eipKeydown;
*/
/* $(window).blur(function(){

});
$(window).focus(function(){

}); */
</script>
</html>`;
    const iframe = document.createElement("iframe");

    iframe.style = "border: 0;height: 100%;width: 100%;"

    document.body.appendChild(iframe)

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    const xhr = iframe.contentWindow.XMLHttpRequest;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    xhr.prototype.open = function(method, url, async, user, password) {
        this._url = url; // 保存请求 URL
        return originalOpen.apply(this, arguments);
    };

    xhr.prototype.send = function(body) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.status === 200) {
                if (this._url.includes('announceItemShow.do')) {

                    const data = JSON.parse(this.responseText);
                    const modifyResponse = `<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="images/cal/cal.css"></head><body>
    <table class="calTable" style="width:680px;">
        <tr>
            <td class="calField" style="width:79px">標　　題</td>
            <td class="calDataLeft">${data.atitle}</td>
        </tr>
        <tr>
            <td class="calField">內　　容</td>
            <td class="calDataGridPure">
                <div id="announceContent" style="height:320px;">
					${data.acontent}
                </div>
            </td>
        </tr>

        <tr>
            <td class='calField'>附　　件</td>
            <td class="calDataLeft">
            <div style="width:100%; max-height:80px; _height:expression(this.scrollHeight > 80 ? '80px' : 'auto'); overflow:auto;">
${announceBoxFilesToHTML(data.attachList || [])}
            </div>
            </td>
        </tr>

        <tr>
            <td class="calField">發布時間</td>
            <td class="calDataLeft">${new Date(data.publishDate)}</td>
        </tr>
        <tr>
            <td class="calField">期　　限</td>
            <td class="calDataLeft">${new Date(data.historyDate)}</td>
        </tr>
        <tr>
            <td class="calField">發布單位</td>
            <td class="calDataLeft">${data.adept}</td>
        </tr>


    </table>

    	<div style="text-align:center;"><input type="button" onClick="announceItemPrintWin('46')" value="列印" class="calButton"></div>

</body></html>`;

                    Object.defineProperty(this, 'responseText', { value: modifyResponse });
                } else if(this._url.startsWith("calShow.do")) {
                    const data = JSON.parse(this.responseText);
                    const modifyResponse = `<center>
<table class="calTable" style="width:450px;">
	<caption class="calTitle">學校行事曆&nbsp;的行程</caption>
	<tr>
		<td class="calField"><!-- 事　項 -->事　項</td>
		<td class="calDataLeft"><div style="max-height:68px; _height:expression(this.scrollHeight > 68 ? '68px' : 'auto'); overflow:auto">${data.cal.calTitle}</div></td>
	</tr>
	<tr>
		<td class="calField" style="width:68px"><!-- 時　間 -->時　間</td>
		<td class="calDataLeft">

				${new Date(data.cal.calStart)}
				至
				${new Date(data.cal.calEnd)}


		</td>
	</tr>
	<tr>
		<td class="calField"><!-- 地　點 -->地　點</td>
		<td class="calDataLeft"><div style="max-height:68px; _height:expression(this.scrollHeight > 68 ? '68px' : 'auto'); overflow:auto">${data.cal.calPlace}</div></td>
	</tr>
	<tr>
		<td class="calField"><!-- 說　明 -->說　明</td>

		<td class="calDataLeft">
			<div style="max-height:68px; _height:expression(this.scrollHeight > 68 ? '68px' : 'auto'); overflow:auto">



							${data.cal.calContent}<br>


			</div>
		</td>
	</tr>
	<tr>
		<td class="calField"><!-- 附　件 -->附　件</td>
		<td class="calDataLeft" style="position:relative;">
			<ol class="forumRule">

			</ol>
		</td>
	</tr>


	<tr>
		<td class="calField"><!-- 建立者 -->建立者</td>
		<td class="calDataLeft">${data.cal.creatorName}</td>
	</tr>
	<tr style="display:none">
		<td class="calField"><!-- 修改者 -->修改者</td>
		<td class="calDataLeft"></td>
	</tr>
	<tr>
		<td class="calField"><!-- 上次更<br>新時間 -->上次更<br>新時間</td>
		<td class="calDataLeft">${new Date(data.cal.modifyDate)}</td>
	</tr>


</table>

<input type="hidden" id="circleNo" value="">
</center>`;

                    Object.defineProperty(this, 'responseText', { value: modifyResponse });
                } else if(this._url.startsWith("profileMain.do")) {
                    const data = JSON.parse(this.responseText);
                    const modifyResponse = `<center>
<div class="eipInfoMainWithBorder" style="max-width:1241px; min-width:350px; font-size:12pt;">
	<!-- 功能框標題 開始 -->
	<div style="height:46px">
		<div onClick="profileMain()" style="height:36px; background:url('images/icon/profile.png') no-repeat 0 0/36px 36px; font-size:13.5pt; font-weight:bold; padding:5px 0px 5px 46px; float:left; cursor:pointer">密碼變更/個人設定</div>
		<div style="height:36px; font-size:13pt; padding:5px; float:right">

		</div>
	</div>
	<!-- 功能框標題 結束 -->
	<div style="display:table; width:100%; position:relative;">
		<div id="profileLeft">
		    <div class="eipBoxShadowRightBottom" style="padding:7px;">
		        <div style="padding:3px; color:#333; border-bottom:1px solid #666; margin:0 3px; font-weight:bold; text-align:left;">個人照片</div>
	            <ul style="padding:0 7px; margin:5px 0;">
	                <li style="border:1px solid #ccc; width:250px; margin:10px auto; background:#fff; position:relative;" ondragover="dragoverHandler(event)" ondrop="dropHandler(event,'photoUpload','2','')">

							<img src="images/person-man.jpg" style="width:145px"><br>
							<span class="eipAlert">插件不支援檢視此照片</span>


						<div id="dropUploadProgressBar" style="position:absolute; bottom:0; left:0;"></div>
	                </li>
	                <li>
	                    <input type="button" value="上傳" onClick="photoUploadForm('2','')" class="profileButton" disabled>
	                    <input type="button" value="移除" onClick="photoDelete('')" class="profileButtonDisable" disabled>
	                </li>
	            </ul>
		    </div>
		    <div id="divSecurityInfo" dojoType="dojox.layout.ContentPane" href="securityInfoShow.do" class="eipBoxShadowRightBottom" style="padding:7px; margin:10px 0;"></div>
		    <iframe width="0" height="0" frameborder="0" name="iframePasswordMdy"></iframe>
		</div>
		<div id="profileRight">
		    <div class="eipBoxShadowRightBottom" style="padding:7px;">
		        <div style="padding:3px; color:#333; border-bottom:1px solid #666; margin:0 3px; font-weight:bold; text-align:left;">個人資料</div>

				<form id="profileForm" name="profileForm">
		        <ul style="padding:0 7px; margin:5px 0;">


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">姓名</label>
		                <div style="text-align:left; padding-left:10px;">




                        		${data[0].ldapValue}

						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">電子郵件</label>
		                <div style="text-align:left; padding-left:10px;">




                        		${data[1].ldapValue}

						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">備用信箱</label>
		                <div style="text-align:left; padding-left:10px;">





									<input type="text" id="svmail2" name="svmail2" value="${data[2].ldapValue}" style="width:97.9%; padding:1%; border:1px solid #ccc; font-size:12pt;" maxlength="100">









						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">部門名稱</label>
		                <div style="text-align:left; padding-left:10px;">




                        		${data[3].ldapValue}

						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">職稱</label>
		                <div style="text-align:left; padding-left:10px;">




                        		${data[4].ldapValue}

						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">主管職務</label>
		                <div style="text-align:left; padding-left:10px;">



${data[5].ldapValue}


						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">校內分機</label>
		                <div style="text-align:left; padding-left:10px;">






									<input type="text" id="ext" name="ext" value="${data[6].ldapValue}" style="width:97.9%; padding:1%; border:1px solid #ccc; font-size:12pt;" maxlength="20">








						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">手機</label>
		                <div style="text-align:left; padding-left:10px;">




									<input type="text" id="mobile" name="mobile" value="${data[7].ldapValue}" style="width:97.9%; padding:1%; border:1px solid #ccc; font-size:12pt;" maxlength="20">










						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->


		        	         <!-- 學生用要顯示手機 -->
		            <li style="list-style:none; display:table; width:100%; margin:10px 0;">
		                <label style="display:table-cell; width:35%; text-align:left;">手機驗證到期日</label>
		                <div style="text-align:left; padding-left:10px;">




                        		${data[8].ldapValue}

						</div>
		            </li>

		            <!-- and attr.realName!='mobile' and attr.realName!='direkMobileValidDate' -->





		            	<li style="list-style:none; display:table; width:100%; margin:10px 0;">
							<label style="display:table-cell; width:36%; text-align:left;"></label>
		                	<div style="text-align:left;"><a style="color:red;">手機驗證有效時間為一年，</a>修改資料登入後需重新驗證。</div>
		            	</li>




		            <li>
		            	<input type="button" value="儲存" onClick="profileModify2()" class="profileButton">
		            </li>
		        </ul>
		        </form>
		    </div>


				<div class="eipBoxShadowRightBottom" style="padding:7px; margin:10px 0;">
					<div style="padding:3px; color:#333; border-bottom:1px solid #666; margin:0 3px; font-weight:bold; text-align:left;">主題設定</div>
					<ul style="padding:0 7px; margin:5px 0;">
						<li>

							<input type="radio" id="styleou=00,ou=eipstyle,o=ldapConfig" name="myEipId" value="" onClick="myEipIdMdy()">
							<label for="styleou=00,ou=eipstyle,o=ldapConfig">青空</label>

							<input type="radio" id="styleou=01,ou=eipstyle,o=ldapConfig" name="myEipId" value="/01" onClick="myEipIdMdy()">
							<label for="styleou=01,ou=eipstyle,o=ldapConfig">銀灰</label>

							<input type="radio" id="styleou=02,ou=eipstyle,o=ldapConfig" name="myEipId" value="/02" onClick="myEipIdMdy()">
							<label for="styleou=02,ou=eipstyle,o=ldapConfig">湛藍</label>

						</li>
					</ul>
				</div>




				<div class="eipBoxShadowRightBottom" style="padding:7px; margin:10px 0;">
					<div style="padding:3px; color:#333; border-bottom:1px solid #666; margin:0 3px; font-weight:bold; text-align:left;">語系設定</div>
					<ul style="padding:0 7px; margin:5px 0;">
						<li>

							<input type="radio" id="languagezh_TW" name="localeId" value="zh_TW" onClick="localeModify('')" checked>
							<label for="languagezh_TW">繁體中文</label>

							<input type="radio" id="languageen" name="localeId" value="en" onClick="localeModify('')">
							<label for="languageen">English</label>

						</li>
					</ul>
				</div>





		</div>
	</div>

	<div id="divLdapBox" dojoType="dojox.layout.ContentPane" style="width:100%; margin-top:10px; overflow:visible;" href="boxPersonalIndex.do"></div>


		<div id="divMultiIndex" dojoType="dojox.layout.ContentPane" style="width:100%; margin-top:10px; overflow:visible" href="multiIndex.do"></div>


</div>
</center>`;
                    Object.defineProperty(this, 'responseText', { value: modifyResponse });
                } else if (this._url.includes('securityInfoShow.do')) {
                    const resText = this.responseText;
                    const resBtnDisabled = resText.replace(`onClick="dijit.byId('securityUserDialog').show();" class="profileButton"`, `onClick="dijit.byId('securityUserDialog').show();" class="profileButton" disabled /`)
                    let btnIndex = resBtnDisabled.indexOf(`onClick="dijit.byId('securityUserDialog').show();"`);
                    let btnText = '';
                    while(true) {
                        if(resBtnDisabled[btnIndex] === '"') break;
                        btnIndex -= 1;
                    }
                    btnIndex -= 1;
                    while(true) {
                        if(resBtnDisabled[btnIndex] === '"') break;
                        btnText = resBtnDisabled[btnIndex] + btnText;
                        btnIndex -= 1;
                    }
                    const modifyResponse = resBtnDisabled.replace(btnText, "請關閉插件後重新登入再修改密碼。");
                    Object.defineProperty(this, 'responseText', { value: modifyResponse });
                }
            }
        });

        return originalSend.apply(this, arguments);
    };

    iframe.contentWindow.addEventListener("DOMContentLoaded", (_event) => {
        iframe.contentWindow.taskMain = () => { alert("目前 跳過驗證碼插件 不支援此功能！！"); };
        iframe.contentWindow.efolderMain = () => { alert("目前 跳過驗證碼插件 不支援此功能！！"); };
    });
}