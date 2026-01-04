// ==UserScript==
// @name         NU Start or Continue Reading Button
// @namespace    ultrabenosaurus.NovelUpdates
// @version      0.4
// @description  Adds a start or continue reading button. The Start Reading button will add the series to your default list and open the very first chapter link. Continue Reading will open the chapter immediately above your last ticked chapter.
// @author       Ultrabenosuarus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.novelupdates.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=novelupdates.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395684/NU%20Start%20or%20Continue%20Reading%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/395684/NU%20Start%20or%20Continue%20Reading%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.querySelectorAll('span.nu_editnotes.removed').length==0){
        UBaddContinueButton();
    }else{
        UBaddStartButton();
    }
})();

function UBaddStartButton(){
    var srCSS = "<style>.button.sr-arrow.icon::before {background-position: 0 -36px;}</style>";
    document.querySelectorAll('div.w-blog-content div.sticon div.chosen-container')[0].insertAdjacentHTML("afterend", srCSS);
    var srElem = "<a class='button icon sr-arrow' href='#' type='submit' style='margin-left:5px; top: 1px;' id='UBstartReading'>Start Reading</a>";
    document.querySelectorAll('div.w-blog-content div.sticon div.chosen-container')[0].insertAdjacentHTML("afterend", srElem);

    var srBtn = document.getElementById('UBstartReading');
    if(srBtn){
        srBtn.addEventListener("click", UBstartReading, false);
    }
}
function UBaddContinueButton(){
    var crCSS = "<style>.button.cr-arrow.icon::before {background-position: 0 -36px;}</style>";
    document.querySelectorAll('div.w-blog-content div.sticon a.button.icon.trash')[0].insertAdjacentHTML("afterend", crCSS);
    var crElem = "<a class='button icon cr-arrow' href='#' type='submit' style='margin-left:5px; top: 1px;' id='UBcontinueReading'>Continue Reading</a>";
    document.querySelectorAll('div.w-blog-content div.sticon a.button.icon.trash')[0].insertAdjacentHTML("afterend", crElem);

    var crBtn = document.getElementById('UBcontinueReading');
    if(crBtn){
        setTimeout(function(){
            if(document.querySelectorAll('table#myTable tbody tr.readcolor a.chp-release').length!=0){
                var chaps = document.querySelectorAll('table#myTable tbody tr:not(.readcolor) a.chp-release');
                crBtn.href=chaps[chaps.length-1].href;
                crBtn.target="_blank";
            }else{
                crBtn.addEventListener("click", UBcontinueReading, false);
            }
        }, 1000);
    }
}

function UBstartReading(event){
    if (typeof event != 'undefined') { event.preventDefault() };
    UBmoveSeries(document.getElementById('mypostid').value,0,'move');
    setTimeout(UBaddContinueButton, 1000);
}
function UBcontinueReading(event){
    if (typeof event != 'undefined') { event.preventDefault() };
    if(document.querySelectorAll('table#myTable tbody tr.readcolor a.chp-release').length==0){
        UBfindLastRead(UBopenNextChapter);
    }else{
        UBopenNextChapter();
    }
}
function UBopenNextChapter(){
    var chaps = document.querySelectorAll('table#myTable tbody tr:not(.readcolor) a.chp-release');
    chaps[chaps.length-1].target="_blank";
    chaps[chaps.length-1].click();
}
function UBopenFirstChapter(){
    var chaps = document.querySelectorAll('table#myTable tbody tr.readcolor a.chp-release');
    chaps[chaps.length-1].target="_blank";
    chaps[chaps.length-1].click();
}
function UBfindLastRead(callback){
    var t=$("#mypostid").val();

    $(".fa.fa-reply.fa-rotate-180.fa-flip-horizontal.list").css("opacity","0.65");
    $(".fa.fa-reply.fa-rotate-180.fa-flip-horizontal.list").css("cursor","not-allowed");
    $("#myTable tbody").css("filter","blur(1px)");
    $("#my_popup_b").remove();
    $("#my_popup_a").remove();
    $.ajax({
        type:"POST",
        url:"https://www.novelupdates.com/wp-admin/admin-ajax.php",
        data:{
            action:"nu_gotobk",
            strSID:t
        },
        success:function(t){
            t=t.slice(0,-1);
            var a=jQuery.parseJSON(t),
                e=a.data,
                o=a.script,
                i=a.pagination;
            a.extras;
            $("#myTable tbody").html(e+o);
            $(".digg_pagination").replaceWith(i);
            $(".fa.fa-reply.fa-rotate-180.fa-flip-horizontal.list").css("opacity","1");
            $(".fa.fa-reply.fa-rotate-180.fa-flip-horizontal.list").css("cursor","");
            $("#myTable tbody").css("filter","");
            $("#my_popup_b").popup({
                type:"tooltip",
                vertical:"bottom",
                transition:"0.3s all 0.1s",
                tooltipanchor:$(".my_popup_b_open")
            });
            $("#my_popup_a").popup({
                type:"tooltip",
                vertical:"bottom",
                transition:"0.3s all 0.1s",
                tooltipanchor:$(".my_popup_a_open")
            });
            if (typeof callback != 'undefined') { callback() };
        }
    })
}
function UBmoveSeries(e,n,t){
    "move"==t&&$(".stmove").attr("disabled",!0).trigger("chosen:updated"),$(".stremove").addClass("disabled");
    var c=!0;
    if(1==c){
        var a;
        a=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");
        a.onreadystatechange=function(){
            4==a.readyState&&200==a.status&&("move"==t&&$(".stmove").attr("disabled",!1).trigger("chosen:updated"),$(".sticon").empty(),$(".sticon").append(a.responseText))&&(document.querySelectorAll('table#myTable tbody tr.readcolor a.chp-release').length==0)?UBfindLastRead(UBopenFirstChapter):UBopenFirstChapter()
        };
        var s="//www.novelupdates.com/updatelist.php?sid="+e+"&lid="+n+"&act="+t;a.open("GET",s,!0),a.send()}var c=!1}