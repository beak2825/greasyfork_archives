// ==UserScript==
// @name         煎蛋助手
// @version      1.0
// @description  按照OO数自动排序(无聊图和妹子图),增加翻页快捷键,隐藏评论数量超过设定的用户的留言（不看吵架）
// @author       cloudwalkerfree@gmail.com
// @match        https://jandan.net/*
// @match        http://jandan.net/*
// @namespace    http://jandan.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15663/%E7%85%8E%E8%9B%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/15663/%E7%85%8E%E8%9B%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//主页是否排序：false为不排序，true为排序
var isMainPaageRank = false;

var curserStyle = "style=\"cursor: pointer; display: inline;background-color: #DEDEDE; border-radius: 20px; bottom: 50%; color: #ffffff; display: block; float: left; font-size: 26px; margin-left: -10%; padding-bottom: 5px; position: fixed; text-align: center; width: 40px; z-index: 13;\"";

//OO和XX高亮
(function(){
    $('.comment-like').attr('style','color:red');
    $('.comment-unlike').attr('style','color:blue');
})();

//按照OO从高到低排序图片/评论
(function(){
    var sorting = new Array();
    var num = $('li[id*="comment"]').size();
    for(var i = 0; i< num; i++){
        sorting[i] = new Array();
        sorting[i][0] = $('.tucao-like-container').find('span:first').eq(i).text();
        sorting[i][1] = $('li[id*="comment"]').eq(i).attr('id');
    }

    sorting.sort(function(a,b){
        return b[0] - a[0]; 
    });

    for(var i = 0; i< num; i++){
        $('.commentlist').append($('li[id='+sorting[i][1]+']'));
    }
    
}
)();

//按照zan从高到低排序文章
(function(){
    if(isMainPaageRank){
        var sorting = new Array();
        var num = $('.list-post').size();
        for(var i = 0; i< num; i++){
            sorting[i] = new Array();
            sorting[i][0] = $('.list-post').eq(i).find('.zan-icon').text().replace(/[^0-9]/g,'');
            sorting[i][1] = $('.list-post').eq(i).find('.thumbs_b').find('a').attr('href');
        }

        var sorting = sorting.sort(function(a,b){
            return b[0] - a[0]; 
        });

        for(var i = 0; i< num; i++){
            $('#content').append($('.list-post').filter(function(){if($(this).find('.thumbs_b').find('a').attr('href') == sorting[i][1]){return true}}));
        }

        $('#content').append($('.wp-pagenavi'));
    }
}
)();

//增加翻页快捷键，以及左右方向键翻页
(function(){ 
    $(document).keydown(function(e){
        if(['author', 'email', 'comment'].indexOf($(':focus').attr('id')) ==  -1 && ['tucao-content', 'tucao-nickname', 'tucao-email'].indexOf($(':focus').attr('class')) ==  -1){
            if(e.which == 37){
                $('.next-comment-page').get(0).click();
            }else if(e.which == 39){
                $('.previous-comment-page').get(0).click();
            }            
        }
    });
   
})();

//防止排序后图片不加载
(function(){
    window.scrollBy(0,10);
    window.scrollBy(0,-10);
})();
