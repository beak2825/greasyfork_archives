// ==UserScript==
// @name         google搜索v2
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  google搜索页面修改，增加便条
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match        https://www.google.com/search?q=*
// @match        https://www.google.com.hk/search?q=*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/458221/google%E6%90%9C%E7%B4%A2v2.user.js
// @updateURL https://update.greasyfork.org/scripts/458221/google%E6%90%9C%E7%B4%A2v2.meta.js
// ==/UserScript==


const dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    'use strict';

    const detection_cycle = 500;
    const cycle_callbacks = [];
    const {hostname, pathname} = location;

    function no_display(item) {
        const no_display_css = item + " {display: none;}";
        GM_addStyle(no_display_css);
    }

    function add_search_note(){
        var key=$("[name=q]").val();
        var div = document.getElementById('happy');
        if (div) div.remove();

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.funnyai.com/note/mini_fulltext.php?key="+encodeURIComponent(key),
            data: "",
            headers: {
                "Content-Typev": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                var body=response.responseText;
                var strSplit=body.split("count_record=");
                var count=parseInt(strSplit[1]);
                if (count>0){
                    var height=count*200;
                    if (height>320) height=320;
                    if ($("#happy").length==0){
                        var src="<div id='happy' style='margin:10px;width:95%;height:"+height+"px;border:1px dotted blue;overflow:auto;background-color:black'></div>" ;
                        $( src).insertBefore( $( "#appbar" ) );
                        $("#happy").append("<button id='sidebar-btn'>隐藏</button>");
                        $("#happy").append("<div id='content'></div>");

                        GM_setValue("show_google_note", true);
                        document.querySelector("#sidebar-btn").addEventListener("click", function () {
                            change_sidebar_status("show_google_note");
                        }, true);
                        $("#content").html(body);
                    }
                }
            }
        });
    }

    function change_sidebar_status(key_value) {
        var show_sidebar = GM_getValue(key_value, false);
        if (show_sidebar) {
            GM_setValue(key_value, false);
            $("#sidebar-btn").html("显示");

            $("#content").css("display", "none");
            $("#happy").height(30);
        } else {
            GM_setValue(key_value, true);
            $("#sidebar-btn").html("隐藏");

            $("#content").css("display", "block");
            $("#happy").height(320);
        }
    }

    switch (hostname.split(".")[0]) {  // 搜索
        case "www":
            setTimeout(()=>{
                add_search_note();
            },500);
            break;
    }

    if (!cycle_callbacks.length) {
        return;
    }

    cycle_callbacks.forEach(f => f());
    setInterval(() => cycle_callbacks.forEach(f => f()), detection_cycle);
});