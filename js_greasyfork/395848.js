// ==UserScript==
// @icon         http://www.javlib.com/favicon.ico
// @name         Javlib净化
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  屏蔽广告/优化打开链接
// @author       Avral
// @match        *://*.com/*
// @match        *://javlib.com/*
// @match        *://zlibz.com/*
// @match        *://btsow.bar/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/395848/Javlib%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/395848/Javlib%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

var isInit = false;

(function () {
    if (window.$ == null)return;
    function enumdel(arrs){
        $.each(arrs, function(index, a){
            a.remove();
        });
    }
    function getInfo(code, a) {
        $.ajax({
            url:"http://127.0.0.1:8080/",
            type: "POST",
            data:{
                id: code
            },
            dataType: "json",
            success: function (result) {
                for (let idx in result) {
                    let info = result[idx];
                    let color = "red";
                    if (info.type.id >= 1 && info.type.id <= 3)
                        color = "green";
                    else if (info.type.id == 6)
                        color = "yellow";
                    a.innerHTML += "<br/>";
                    a.innerHTML += "<a id=\"open_local_path\" style=\"color:" + color + "\" code=\"" + a.firstChild.data + "\">[" + info.type.name + "][" + info.ext + "][" + (info.size / 1024 / 1024 / 1024).toFixed(2) + "GB]<a/>";
                }
                a.addEventListener("click", function(event) {
                    if (event.target.matches("#open_local_path")) {
                        event.stopPropagation();
                        event.preventDefault();
                        openFile(event.target.getAttribute("code"));
                    }
                }, false);
            },
            error: function() {
                a.style = "color:red;";
            }
        });
    }
    function openFile(path) {
        $.ajax({
            url:"http://127.0.0.1:8080/",
            type: "POST",
            data:{
                code: path
            },
        });
    }
    function init(){
        if (document.title.indexOf("JAVLibrary") != -1){
            console.log("JAVLIB Initing...");
            var $videoimages = null;
            document.onselect = function(){}
            document.onclick = function(){}
            document.onmousedown = function(){}
            document.onmouseup = function(){}
            window.open = function(){};
            document.write = function(){}
            document.writeln = function(){}
            $.each($("head").children("script"), function(index, a){
                a.remove();
            });

            enumdel($("[id^='topbanner'"));
            enumdel($("[id^='sidebanner'"));
            enumdel($("[id^='middlebanner'"));
            enumdel($("[id^='bottombanner'"));
            enumdel($("div.ebmhijOverlay"));
            $("div.socialmedia").remove();
            $("div#toplogo").remove();
            $("div#bottommenu").remove();
            $("div#bottomcopyright").remove();
            $("div#leftmenu").css("width", "auto");
            $("div#rightcolumn").css("margin-left", "100px");
            if (isInit)return;
            isInit = true;
            $("div.videos div.id").each(function(index, a){
                //a.innerHTML += "<button onclick='preview();'>预览</button>";
                getInfo(a.firstChild.data, a);
            });
            $("table.comment td strong a").each(function(index, a){
                console.log("test");
                //a.innerHTML += "<button onclick='preview();'>预览</button>";
                var id = a.firstChild.data;
                id = id.substr(0, id.indexOf(" "));
                getInfo(id, a);
            });
            $("div#video_id td.text").each(function(index, a){
                var bt_search = $("<iframe src='https://btsow.com/search/"+a.innerHTML+"' style='width:100%;height:250px;' security='restricted' sandbox=''></iframe>");
                $("div#video_favorite_edit").after(bt_search);
                var bt_search1 = $("<iframe src='https://0cili.org/search?q="+a.innerHTML+"' style='width:100%;height:250px;' security='restricted' sandbox=''></iframe>");
                $("div#video_favorite_edit").after(bt_search1);
                getInfo(a.firstChild.data, a);
            });
        }
        if (document.title.indexOf("bt - BTSOW") != -1){
            console.log("BTSOW Initing...");
            document.onselect = function(){}
            document.onclick = function(){}
            document.onmousedown = function(){}
            document.onmouseup = function(){}
            window.open = function(){};
            document.write = function(){}
            document.writeln = function(){}
            $.each($("head").children("script"), function(index, a){
                a.remove();
            });
            $.each($("body").children("[class!='container']"), function(index, a){
                a.remove();
            });
            /*$.each($(".container").children("[class!='data-list']"), function(index, a){
		a.remove();
	  });*/
        }
    }
    $(document).ready(function(){
        init();
    });
    init();
}) ();