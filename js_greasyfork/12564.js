// ==UserScript==
// @name         Uber Czarnolisto
// @namespace    http://www.wykop.pl/*
// @version      2.1.1
// @description  Lepsza i zawsze dostępna czarna lista. 
// @author       SiarkoWodór
// @include      http://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12564/Uber%20Czarnolisto.user.js
// @updateURL https://update.greasyfork.org/scripts/12564/Uber%20Czarnolisto.meta.js
// ==/UserScript==

//Mały dodatek, Otwieranie wszystkich treści z głównej w nowej karcie bez middleclicku
$("#itemsStream").find("a").attr('target',"_blank");

/*style*/
var height = $("#nav").height();
var background = "#2c2c2c";
var storage = localStorage;
var tags = JSON.parse( ((storage.getItem("tagList") !== null) ? storage.getItem("tagList") : "{}") );

var style = ""+
"#tagsMenu{"+
"position: fixed;"+
"top: 0px;"+
"left: 20px;"+
"width: 100px;"+
"height: "+height+"px;"+
"font-size: 15ps;"+
"line-height: "+height+"px;"+
"text-align: center;"+
"font-weight: bold;"+
"cursor: pointer;"+
"transition: background 0.3s;"+
"}"+
"#tagsMenu:hover{"+
"background: "+background+";"+
"}"+
"#tagsMenu.block{"+
"background: rgb(150, 150, 0);"+
"}"+
"#tagsMenu.block:hover{"+
"background: rgb(190, 190, 0);"+
"}"+
"#tagsMenuList{"+
"width: 100px;"+
"padding: 5px;"+
"position: fixed;"+
"top: "+height+"px;"+
"left: 20px;"+
"background: "+background+";"+
"display: none;"+
"overflow: hidden;"+
"}"+
".tagsListItem{"+
"cursor: pointer;"+
"color: lime;"+
"}"+
".tagsListItem:hover{"+
"font-weight: bold;"+
"}"+
".blocked{"+
"color: red;"+
"text-decoration: line-through;"+
"}"+
"#tagsInput{"+
"padding: 0;"+
"height: 20px;"+
"background: #414141 !important;"+
"}"+
"#blockedCount{"+
"padding: 1px 3px 1px 3px;"+
"background: #FF5917;"+
"font-size: 12px;"+
"position: absolute;"+
"top: 10px;"+
"height: 14px;"+
"line-height: 12px;"+
"color: white;"+
"border-radius: 10%;"+
"text-shadow: 0 1px #900;"+
"box-shadow: 0 1px #900;"+
"}"+
"#nocnaButton{"+
    "margin-left: auto;"+
    "margin-right: auto;"+
    "display: block;"+
    "margin-bottom: 5px;"+
"}"+
"";

/* dołączenie elementów */

$("head").append("<style>"+style+"</style>");
$("#nav")
.append("<div id='tagsMenu'>")
.append("<div id='tagsMenuList'>");
$("#tagsMenu").html("Menu tagów<b id='blockedCount'>0</b>");
var button = $("#tagsMenu");
var list = $("#tagsMenuList");
var counter = $("#blockedCount");
var count = 0;
var o = false;

//Załadowanie zdjęć przez lazyload
function loadLazyload(){
    $("img.lazy").each(function(){$(this).attr("src",$(this).data("original"));});
    console.log("LAZY LOADED");
}
/* animacje widoczność */

if(storage.getItem('tagBlock') == "true"){
    button.addClass('block');
}
//Wyłączenie blokowania
function unblockAll(){
    $("#itemsStream").find("li.iC").css("display", "block");
}
//rejstracja kliknięcia PPM
button.on('contextmenu', function(ev) {
    if(storage.getItem('tagBlock') == "true"){
        button.removeClass('block');
        storage.setItem('tagBlock', "false");
        reload();
    }else{
        button.addClass('block');
        storage.setItem('tagBlock', "true");
        unblockAll();
        counter.text("Pauza");
    }
    return false;
});

button.mouseover(function(){
    list.css({ display: 'block' });
});
button.mouseleave(function(){
    setTimeout(function(){
        if(!o){
            list.css({ display: 'none' });
        }
    },100);
});
list.mouseenter(function(){
    o = true;
});
list.mouseleave(function(){
    list.css({ display: 'none' });
    o = false;
});

//Nocna

function toggleNocna(){
    if(storage.getItem("nocnaBan") == "false"){
        storage.setItem("nocnaBan", "true");
        $("#nocnaButton").css("background", "red");
    }else{
        storage.setItem("nocnaBan", "false");
        $("#nocnaButton").css("background", "lime");
    }
    reload();
}
//Dodanie nie zapisanych tagów do storage
function reloadList(){
    list.html("");
    //Przycisk od blikowania nocnej
    list.append("<button id='nocnaButton'>Nocna</button>");
    $("#nocnaButton").click(function(){
        toggleNocna();
    });
    if(storage.getItem("nocnaBan") == "false"){
        $("#nocnaButton").css("background", "green");
    }else{
        $("#nocnaButton").css("background", "red");
    }
    $.each(tags, function(k,v){
        if(storage.getItem(v) === null){
            storage.setItem(v, "true");
        }
        clas = ((storage.getItem(v) == "true") ? "" : "blocked");
        list.append("<div id='"+v+"' class='tagsListItem "+clas+"'>#"+v+"</div>");
    });
    list.append("<input type='text' placeholder='Nowy tag...' id='tagsInput'>");
    $("#tagsInput").keydown(function(e){
        if(e.keyCode == 32){
            addTag($("#tagsInput").val());
            $("#tagsInput").val("");
            $("#tagsInput").focus();
        }
    });
    $(".tagsListItem").click(function(){
        id = $(this).attr("id");
        state = storage.getItem(id);
        if(state === "true"){
            storage.setItem(id, "false");
            $(this).addClass("blocked");
        }else{
            storage.setItem(id, "true");
            $(this).removeClass("blocked");
        }
        if(storage.getItem('tagBlock') != "true"){
            reload();
        }
    });
    $(".tagsListItem").on("contextmenu", function(e){
        removeTag($(this).attr("id"));
        return false;
    });
}
reloadList();
function getList(){
    li = JSON.parse( ((storage.getItem("tagList") !== null) ? storage.getItem("tagList") : "{}") );
    li = $.map(li, function(el) { return el; });
    return li;
}
function saveList(li){
    storage.setItem("tagList", JSON.stringify(li));
    tags = JSON.parse( ((storage.getItem("tagList") !== null) ? storage.getItem("tagList") : "{}") );
    reloadList();
}
//nowy tag
function addTag(tag){
    li = getList();
    li.push(tag.trim());
    li.sort();
    saveList(li);
}
//usuwanie tagu
function removeTag(tag){
    li = getList();
    li.splice(li.indexOf(tag), 1);
    li.sort();
    saveList(li);
}
//przeładowanie tagów
function reload(){
    count = 0;
    $("#itemsStream").find("li.iC").each(function(i,v){
        th = $(this);
        var hour = Date.parse(th.find($("time")).attr("title"));
        var date1 = new Date();
        var date2 = new Date();
        date1.setHours(6);date1.setMinutes(0);date1.setSeconds(0);
        date2.setDate(date2.getDate()-1);date2.setHours(23);date2.setMinutes(0);date2.setSeconds(0);
        var l;
        if( hour < date1 && hour > date2 ){
            if(storage.getItem("nocnaBan") == "true"){
                th.css("display", "none");
            }else{
                th.css("display", "block");
            }
        }
        $.each(tags, function(a,b){
            if(th.text().indexOf(b) != -1 && storage.getItem(b) === "false"){
                th.css("display", "none");
                count++;
                l = true;
            }else if(!l){
                th.css("display", "block");
            }
        });
    });
    counter.text(count);
    loadLazyload();
}
if(storage.getItem('tagBlock') != "true"){
    reload();
}