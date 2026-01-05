// ==UserScript==
// @name         Trello - show my card
// @name:zh-CN   Trello - 显示我的
// @namespace    null
// @homepageurl  null
// @version      1.1.2
// @description  trello show my card
// @description:zh-CN trello显示我的
// @author       will
// @match        http*://*trello.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25813/Trello%20-%20show%20my%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/25813/Trello%20-%20show%20my%20card.meta.js
// ==/UserScript==

var addShowMyCardBtn = function(){
    //var flag = $('#showMyCard20161219').html();
    //if(!flag){
    var showMyCard = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text" id="showMyCard20161219">显示我的</span></a>');
    $('div.board-header').append(showMyCard); // 添加按钮
    showMyCard.click(function(){
        var name = $('span.js-member-name').html();
        $('div.list-card').each(function(){
            var img = $(this).find("img[alt^='"+name+"']");
            var alt = img.attr('alt');
            if(alt === undefined){
                //console.log(img.attr('alt'));
                $(this).hide();
            }
        });
    });
    //}
};
var addShowAllCardBtn = function(){
    //var flag = $('#showAllCard20161219').html();
    //if(!flag){
    var showAllCard = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text" id="showAllCard20161219">显示所有</span></a>');
    $('div.board-header').append(showAllCard); // 添加按钮
    showAllCard.click(function(){
        $('div.list-card').each(function(){
            $(this).show();
            $('span[name="tagshow20161226"]').css("text-decoration","none");
        });
    });
    //}
};
var addHideAllCardBtn = function(){
    //var flag = $('#showAllCard20161219').html();
    //if(!flag){
    var showAllCard = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text" id="showAllCard20161219">隐藏所有</span></a>');
    $('div.board-header').append(showAllCard); // 添加按钮
    showAllCard.click(function(){
        $('div.list-card').each(function(){
            $(this).hide();
            $('span[name="tagshow20161226"]').css("text-decoration","line-through");
        });
    });
    //}
};
var addTag = function(){
    $.getJSON(window.location.href+".json", function(data) {
        $.each(data.labelNames,function(key,val){
            if(val && val!==''){
                var show = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"></a>');
                var tag = $('<span class="board-header-btn-text" name="tagshow20161226">'+val+'</span>');
                show.append(tag);
                $('div.board-header').append(show);
                tag.click(function(){
                    var taghide = function(val){
                        $('div.list-card').each(function(){
                            var o = $(this).find('span.card-label[title="'+val+'"]');
                            if(o.text()){
                                $(this).hide();
                            }
                        });
                    };
                    var tagshow = function(val){
                        $('div.list-card').each(function(){
                            var o = $(this).find('span.card-label[title="'+val+'"]');
                            if(o.text()){
                                $(this).show();
                            }
                        });
                    };
                    var dec = $(this).css("text-decoration");
                    var val = $(this).text();
                    if(dec == 'none'){
                        $(this).css("text-decoration","line-through");
                        taghide(val);
                    }else{
                        $(this).css("text-decoration","none");
                        tagshow(val);
                    }
                });
            }
        });
    });
};

var init = function() {
    addTag();
    addShowMyCardBtn();
    addHideAllCardBtn();
    addShowAllCardBtn();
};

$(function(){
    init();
});