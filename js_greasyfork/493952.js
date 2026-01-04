// ==UserScript==
// @name         V2EX隐藏右侧栏
// @namespace    https://github.com/androidcn/userscripts/
// @version      2024-05-03
// @description  V2EX隐藏右侧栏，可设置记忆
// @author       @androidcn
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/493952/V2EX%E9%9A%90%E8%97%8F%E5%8F%B3%E4%BE%A7%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493952/V2EX%E9%9A%90%E8%97%8F%E5%8F%B3%E4%BE%A7%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getHide(){
        return GM_getValue("V2EXSideBar_isHide");
    }
    if (getHide()){
        V2EXhide("显示");
        HideItNow();
    }else{
        V2EXhide("隐藏");
        ShowItNow();
    }

    function ToggleitNow(){
        if (getHide()){
            ShowItNow();
        }else{
            HideItNow();
        }
    }
    function HideItNow(){
        $("#Rightbar").hide();
        GM_setValue("V2EXSideBar_isHide",true);
        $("#hideSideBar").text("显示");
    }
    function ShowItNow(){
        $("#Rightbar").show();
        GM_setValue("V2EXSideBar_isHide",false);
        $("#hideSideBar").text("隐藏");
    }

    function V2EXhide(displayText){
        var hideSideBar = document.createElement("a");
    hideSideBar.href = "#;";
        hideSideBar.id = "hideSideBar";
        hideSideBar.classList.add("top");
        hideSideBar.classList.add("v2p-hover-btn");
           hideSideBar.text = displayText;
           $(".tools").prepend(hideSideBar);
        $("#hideSideBar").click(()=>ToggleitNow());
    }
})();
