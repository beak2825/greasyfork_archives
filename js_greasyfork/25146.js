// ==UserScript==
// @name         Aigis Orb Table
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @author       MoonDropX
// @match        http://assets.millennium-war.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25146/Aigis%20Orb%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/25146/Aigis%20Orb%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var toggleKey = 121;   //F10

    var aigisClass = [
        ["兵", "盾", "骑兵", "盗贼"],
        ["山贼", "武士", "忍者", "天马"],
        ["暗骑", "拳师", "前军", "魔剑"],
        ["天使", "机甲", "水兵", "奶盾"],
        ["魔盾", "龙骑", "弓骑", "弓"],
        ["火球", "奶", "冰", "海贼"],
        ["弩", "巫女", "司祭", "后军"],
        ["风水", "炮", "舞娘", "炼金"],
        ["游侠", "作死贼", "咒术"]
    ];


    // Construct the orb table
    var table = '<div class="orb-table-wrapper" id="tableWrapper"><table class="orb-table" cellspacing="0">';
    for(var tr in aigisClass){
        table += "<tr>";
        for(var td in aigisClass[tr]){
            table += '<td><div class="orb-cell"><div class="class-text">'+aigisClass[tr][td]+'</div></div></td>';
        }
        table += "</tr>";
    }
    table += "</table></div>";
    $(".emscripten_border").append(table);


    // Construct the toggle button
    var button = '<button id="toggleTable">切换表</button>';
    $(".emscripten_border").append(button);

    $("#toggleTable").click(function(){
        $("#tableWrapper").toggle();
    });


    // Drag
    var downY, scrollY;
    $("#tableWrapper").mousedown(function(e){
        downY =  e.pageY;
        scrollY = $("#tableWrapper").scrollTop();
        $(document).bind('mousemove',preDrag);
        e.preventDefault();
        //e.stopPropagation();
    });

    function preDrag(e){
        if(Math.abs(downY - e.pageY)>10){
            $(document).unbind('mousemove');
            downY = e.pageY;
            $(document).bind('mousemove',drag);
        }
    }

    function drag(e){
        $("#tableWrapper").scrollTop(scrollY + downY - e.pageY);

    }

    $(document).mouseup(function(){
        $(document).unbind('mousemove');
    });


    // Mouse whell
    $("#tableWrapper").on("mousewheel", function (e) {
        if(e.originalEvent.wheelDelta == 0) return;
        var delta = e.originalEvent.wheelDelta > 0 ? true : false;
        if(delta){
            $("#tableWrapper").scrollTop($("#tableWrapper").scrollTop() - 72);
        } else {
            $("#tableWrapper").scrollTop($("#tableWrapper").scrollTop() + 72);
        }
    });


    //Keypress
    $(document).keydown(function(e){
        if(e.keyCode == toggleKey)
            $("#toggleTable").click();
    });


    GM_addStyle(`
        .orb-table-wrapper {
            -moz-user-select:none;
            -webkit-user-select:none;
            user-select:none;
            cursor: default;
            height: 504px;
            overflow-y: scroll;
            position: absolute;
            top: 110px;
            left:135px;

            display: none;
        }
        .orb-table {

        }
        .orb-cell {
            height: 59px;
            width: 188px;
            margin-bottom: 11px;
            margin-right: 2px;
            background: rgba(255,255,255,0.5);
            text-align: right;
            color: white;
            text-shadow: 0 0 1px black;
        }
        .class-text {
            background: rgba(0,0,0,0.5);
            font-size: 1.1em;
            padding-right: 10px;
        }
        #toggleTable {
            border: none;
            border-radius: 5px;
            background: #66ccff;
            margin-top: 5px;
            font-size: 1.5em;
        }
        `);
})();