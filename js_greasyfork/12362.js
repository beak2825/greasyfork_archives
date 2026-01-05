// ==UserScript==
// @name         Pixiv unread mark
// @namespace    https://www.topcl.net/
// @version      0.21
// @description  rt
// @author       VJ
// @match        http://www.pixiv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12362/Pixiv%20unread%20mark.user.js
// @updateURL https://update.greasyfork.org/scripts/12362/Pixiv%20unread%20mark.meta.js
// ==/UserScript==

var PNN_LOCAL_STORE_KEY="PNN_STORE";

function checkWatched(pid,stor){
    var isnew=false;

    var sjson=localStorage[PNN_LOCAL_STORE_KEY];
    if(sjson){
        var arr=JSON.parse(sjson);
        isnew = arr.indexOf(pid)==-1;
        if(isnew && stor){
            arr.push(pid);
            localStorage[PNN_LOCAL_STORE_KEY]=JSON.stringify(arr);
        }
    }else{
        isnew=true;
        if(stor) {
            localStorage[PNN_LOCAL_STORE_KEY]=JSON.stringify([pid]);
        }
    }

    return !isnew;
}

function showNews()
{
    $("#search-result div ul li").each(function(el){
        var agrid= $(this);
        var awurl="http://www.pixiv.net/member_illust.php?id=" + agrid.find("a").attr("href").match('\\d+');

        var abadg=$('<a class="count-badge" href="'+awurl+'" style="position:absolute;top:-5px;right:25px;margin-right:130px">...</a>');
        agrid.find(".usericon").append(abadg);

        $.get(awurl,function(r){

            var news=0;

            var pagepids=$.unique(
                $(r).find(".image-item a")            
                .map(function(){
                    return this.href.match('\\d+')[0];
                }) 
            );

            $(pagepids).each(function(idx,elm){
                if(!checkWatched(elm))news++;
            });

            abadg.html(news);

            if(news==0) abadg.hide();                

        },"html");
    });
}

function procPage()
{

    var unseens=0;
    var pidns=[];
    var badgens=[];
    $(".image-item").each(function(){

        var pid=$(this).find("a")      .attr('href').match('\\d+')[0];
        if(!checkWatched(pid))
        {
            var badg=$('<span style="position: absolute; left:0;top:0; border-radius: 100%; width: 7px; height: 7px; background-color: red;"></span>');
            $(this).append(badg);
            badgens.push(badg);
            pidns.push(pid);
            unseens++;
        }
    });

    if(unseens!=0)
    {       
        $("<button class='count-badge' style='margin-left:15px'>Clear unread</button>").insertAfter("span.count-badge").click(function(){
            $(pidns).each(function(){
                checkWatched(this,true);
            });
            $(badgens).each(function(){
                this.remove();
            });
            this.remove();
        });
    }
}

$(function(){
    if(window.location.href.indexOf("http://www.pixiv.net/bookmark.php")==0) showNews();
    if(window.location.href.indexOf("http://www.pixiv.net/member_illust.php")==0) procPage();
});




























