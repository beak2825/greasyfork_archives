// ==UserScript==
// @name        TJournal.ru Comments Rating Hightlight
// @namespace   none
// @description Comments Rating Hightlighter
// @include     https://tjournal.ru/*
// @include     http://tjournal.ru/*
// @version     1.31
// @grant       none
// @author      None
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/10816/TJournalru%20Comments%20Rating%20Hightlight.user.js
// @updateURL https://update.greasyfork.org/scripts/10816/TJournalru%20Comments%20Rating%20Hightlight.meta.js
// ==/UserScript==
var UsetToHide = [//По имени фильтруем,
        //'Фёдор Хан'
    ];

    var UserIDToHide = [ // По ID фильтруем, чтоб наверняка
        //'66666'
    ];

    var ratingToMegaHide = -5; // после какого рейтинга делаем подсветку и минимальную прозрачность
    var ratingToHide = 0; // после какого рейтинга делаем комментарий полу-прозрачным
    var ratinSuperPost = 10; // после какого рейтинга делаем комментарий зеленым

    $("div.comment").each(function( index ) {
        var comment = $( this );
        var username = comment.find("a.b-comment__user").find("span").text();
        var user_id = comment.find("a.b-comment__user").attr("href");
        comment.find("div.rating").each(function( index ) {
            count = parseInt($( this ).find("div.rating-count").text().trim().replace("–","-"));
            if(count < ratingToMegaHide){
                $(comment).css("opacity","0.1").css('color','#c12216').css("background-color",'#ffd9d9').mouseover(function(){
                    $(this).css("opacity","1");
                }).mouseout(function(){
                    $(this).css("opacity","0.1");
                });
            }else if(count < ratingToHide){
                $(comment).css("opacity","0.3").mouseover(function(){
                    $(this).css("opacity","1");
                }).mouseout( function(){
                    $(this).css("opacity","0.3");
                } );
            }else if(count > ratinSuperPost){
                $(comment)
                    .css("opacity","1")
                    .css("color",'#2a7815')
                    .css('background-color','#c9f4b4');
            }
        });
        for(var i=0;i<UserIDToHide.length;i++){
            var patt = new RegExp('/'+UserIDToHide[i],"i");
            if(patt.test(user_id)){
                $(comment).css("opacity","0.1").css('color','#c12216').css("background-color",'#c9f4b4').mouseover( function(){
                    $(this).css("opacity","1");
                }).mouseout( function(){
                    $(this).css("opacity","0.1");
                } );
            }
        }
        for(i=0;i<UsetToHide.length;i++){
            patt = new RegExp(UsetToHide[i],"i");
            if(patt.test(username)){
                $(comment).css("opacity","0.1").css('color','#c12216').css("background-color",'#c9f4b4').mouseover( function(){
                    $(this).css("opacity","1");
                }).mouseout( function(){
                    $(this).css("opacity","0.1");
                } );
            }
        }
    });