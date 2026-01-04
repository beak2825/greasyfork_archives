// ==UserScript==
// @name         福建中医药大学教务系统修复
// @version      1.3
// @namespace    sglzp
// @description  将被chromium、firefox弃用的showModalDialog替换为open实现非IE浏览器查看学生项目成绩、教评操作等操作
// @author       sglzp
// @match        http://210.34.74.244/fjzyyjsxsd/*
// @match        https://125.77.120.77:4433/web/*/http/*/210.34.74.244/fjzyyjsxsd/*
// @match        https://125.77.120.67:4433/http/77726476706e69737468656265737421a2a611d2746426072a46dbf8cc/fjzyyjsxsd/*
// @match        https://jwxt.webvpn.fjtcm.edu.cn:4433/fjzyyjsxsd/*
// @run-at       document_start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438296/%E7%A6%8F%E5%BB%BA%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/438296/%E7%A6%8F%E5%BB%BA%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {

function JsMod(htmlurl,tmpWidth,tmpHeight){
    htmlurl=unsafeWindow.getRandomUrl(htmlurl);
    var newwin;

    if(window.location.host.indexOf("125.77.120.77")==0) {
	    newwin = unsafeWindow.SF_FUNC_CALLFUNC(window,0,this,htmlurl,window,"width="+tmpWidth+",status=no,height="+tmpHeight);// 通过webvpn访问

	    if(newwin == "refresh" || newwin == "ok"){
		    if(unsafeWindow.getOs() == "chrome"){
			    unsafeWindow.SF_FUNC_GETATT(window,4).reload();
		    }else{
			    unsafeWindow.SF_FUNC_SETATT(unsafeWindow.SF_FUNC_GETATT(window,4),7, unsafeWindow.SF_FUNC_GETATT(unsafeWindow.SF_FUNC_GETATT(window,4),+7));
		    }
	    }
    } else {
        if(window.location.host.indexOf("125.77.120.67")==0){
            htmlurl = "/http/77726476706e69737468656265737421a2a611d2746426072a46dbf8cc" + htmlurl;
        }
        newwin = window.open(htmlurl,window,"width=" + tmpWidth + ",status=no,width=" + tmpWidth);
        if(newwin == "refresh" || newwin == "ok"){
            if(unsafeWindow.getOs() == "chrome"){
                window.location.reload();// 谷歌浏览器要用此方法刷新
            }else{
                window.location.href = window.location.href;
            }
        }
    }
}

function JsModAll(htmlurl,tmpWidth,tmpHeight,formName){
	htmlurl=unsafeWindow.getRandomUrl(htmlurl);
	var newwin;

    if(window.location.host.indexOf("125.77.120.77")==0) {
        newwin = unsafeWindow.SF_FUNC_CALLFUNC(window,0,this,htmlurl,window,"width="+tmpWidth+",status=no,height="+tmpHeight);
        if(formName == null　|| formName == undefined　|| formName == ""){
            unsafeWindow.SF_FUNC_CALLFUNC(document,68,this,"Form1").submit();
        }else{
            unsafeWindow.SF_FUNC_CALLFUNC(document,68,this,formName).submit();
        }
    } else {
        if(window.location.host.indexOf("125.77.120.67")==0){
            htmlurl = "/http/77726476706e69737468656265737421a2a611d2746426072a46dbf8cc" + htmlurl;
        }
        newwin = window.open(htmlurl,window,"width=" + tmpWidth + ",status=no,width=" + tmpWidth);
        if(formName == null　|| formName == undefined　|| formName == ""){
            document.getElementById("Form1").submit();
        }else{
            document.getElementById(formName).submit();
        }
    }
}

function JsModForm(htmlurl,tmpWidth,tmpHeight,formName){
	htmlurl=unsafeWindow.getRandomUrl(htmlurl);
	var newwin;

    if(window.location.host.indexOf("125.77.120.77")==0) {
        newwin = unsafeWindow.SF_FUNC_CALLFUNC(window,0,this,htmlurl,window,"width="+tmpWidth+",status=no,height="+tmpHeight);
	    if(newwin == "refresh" || newwin == "ok"){
		    if(formName == null　|| formName == undefined　|| formName == ""){
                unsafeWindow.SF_FUNC_CALLFUNC(document,68,this,"Form1").submit();
		    }else{
                unsafeWindow.SF_FUNC_CALLFUNC(document,68,this,formName).submit();
		    }
        }
	} else {
        if(window.location.host.indexOf("125.77.120.67")==0){
            htmlurl = "/http/77726476706e69737468656265737421a2a611d2746426072a46dbf8cc" + htmlurl;
        }
        newwin = window.open(htmlurl,window,"width=" + tmpWidth + ",status=no,width=" + tmpWidth);
	    if(newwin == "refresh" || newwin == "ok"){
            if(formName == null　|| formName == undefined　|| formName == ""){
                document.getElementById("Form1").submit();
            }else{
                document.getElementById(formName).submit();
            }
        }
    }
}

    unsafeWindow.JsMod = JsMod
    unsafeWindow.JsModAll = JsModAll
    unsafeWindow.JsModForm = JsModForm

})();