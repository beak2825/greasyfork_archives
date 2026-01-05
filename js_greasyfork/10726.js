// ==UserScript==
// @name         Quick nav
// @version      2.2
// @description  Adding quick-navigation links
// @author       nicael
// @include        *://*.stackexchange.com/questions/*
// @include        *://*stackoverflow.com/questions/*
// @include        *://*serverfault.com/questions/*
// @include        *://*superuser.com/questions/*
// @include        *://*askubuntu.com/questions/*
// @include        *://*stackapps.com/questions/*
// @include        *://*mathoverflow.net/questions/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/10726/Quick%20nav.user.js
// @updateURL https://update.greasyfork.org/scripts/10726/Quick%20nav.meta.js
// ==/UserScript==

$("body").append('<div style="text-align:right; position:fixed;top:20%;left:1px;"><div class="quick-nav" style="margin: 0 auto;width:80%;overflow:scroll;padding:5px;text-align:left;background-color:rgba(200,200,200,0.4)"><b>Quick navigation </b><span class="lsep">|</span> <a href="#" id="sts">settings<hr><a href="#">Back to question</a><hr></div></div>');

if(!localStorage.quickNavRealtime){
    localStorage.quickNavRealtime="enable";
}

if(localStorage.quickNavRealtime=="enable"){
    var realtime = " checked";
}
if(localStorage.quickNavRealtime=="disable"){
    var realtime = "";
}
if(!localStorage.quickNavRealtimeFreq){
    localStorage.quickNavRealtimeFreq="5";
}

$("#sts").toggle(function(){
    $(this).after('<div id="panel-sts"><input type="checkbox" id="enable-realtime"'+realtime+'> real-time updates<hr></div>');


},function(){
    $(this).next().remove();
})

$("body").on("change","#enable-realtime",function(){
    if($(this).attr("checked")==undefined){
        localStorage.quickNavRealtime="disable";
    } else {
        localStorage.quickNavRealtime="enable";
    }
    location.reload();
})





if($(document).width()<1350){$(".quick-nav").hide();}else{$(".quick-nav").show();}

navControl();


$(window).resize(function(){
    if($(document).width()<1350){$(".quick-nav").fadeOut();}else{$(".quick-nav").fadeIn();}
    navControl();
})

function navControl(){
    var width = ($(document).width()-$("#question-header").css("width").replace("px",""))/2-30;
    $(".quick-nav").parent().css({"width":width+"px"});
}

quickNavFill();

function quickNavFill(){
    console.log("update");
    var answers = [];
    var votes = [];
    var owners = [];
    var reps = [];
    $(".answer").each(function(){
        answers.push($(this).data("answerid"));
        votes.push($(this).find(".vote-count-post").text());
        owners.push($(this).find(".post-signature:last a[href^='/users']").text());
        var rep = $(this).find(".post-signature:last .reputation-score").text();
        if($(this).find(".post-signature:last .community-wiki").length==0){
            if(rep!=""){
                reps.push(rep);
            } else {
                reps.push("del");
            }
        } else {
            reps.push("cw");
        }

    });
    $(".quick-link").each(function(){
        $(this).next().remove();
        $(this).remove();
    })
    for(var i=0;i<answers.length;i++){
        if(reps[i]=="cw"){
            $(".quick-nav").append('<a class="quick-link" href="#'+answers[i]+'">'+(i+1)+'. ('+votes[i]+') Community Wiki Answer</a><br>');

        } else if(reps[i]=="del"){
            $(".quick-nav").append('<a class="quick-link" href="#'+answers[i]+'">'+(i+1)+'. ('+votes[i]+') Answer by deleted user</a><br>');
        } else {
            $(".quick-nav").append('<a class="quick-link" href="#'+answers[i]+'">'+(i+1)+'. ('+votes[i]+') Answer  by '+owners[i]+' ('+reps[i]+')</a><br>');

        }
    }
    if(answers.length>18){
        $(".quick-nav").css({"height":"400px"})
    }



}

if(localStorage.quickNavRealtime=="enable"){
    setInterval(function(){quickNavFill()},250);
}
