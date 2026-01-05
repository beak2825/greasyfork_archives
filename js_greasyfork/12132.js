// ==UserScript==
// @name         让TGFCER更美好
// @namespace    http://www.jun4rui.com/(其实并没有)
// @version      0.1
// @description  让讨厌的苍蝇走开！
// @author       jun4rui
// @match        http://wap.tgfcer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12132/%E8%AE%A9TGFCER%E6%9B%B4%E7%BE%8E%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/12132/%E8%AE%A9TGFCER%E6%9B%B4%E7%BE%8E%E5%A5%BD.meta.js
// ==/UserScript==

//先判断有没有localStorage保存的设置数据，没有则新建
if (typeof(localStorage.BanList)=='undefined'){
    localStorage.BanList	= '';
}

//测试用的屏蔽用户ID串，用英文的逗号分隔
var BanList = localStorage.BanList;
var BanListArray = BanList.split(',');
//添加全局CSS样式的方法
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//不让图片尺寸超过屏幕的最大宽度，有时候图片太大了看起来好累
addGlobalStyle('div.message>img {max-width:100%;}');
//让顶部导航栏浮动固定
addGlobalStyle('#scroller>.navbar {position:fixed;height:28px;line-height:28px;width:100%;top:0;left:0;box-shadow: 5px 1px 5px #888888;} body {padding-top:36px;}');

//列表页面
var PageList = 'http://wap.tgfcer.com/index.php?action=forum';
//帖子内文页面
var PageInfo = 'http://wap.tgfcer.com/index.php?action=thread';
//当前页面
var PageCurrent = window.location.href;


//在原生导航栏中加入设置模块
$('div.navbar').append('&nbsp;|&nbsp;<a href="#" class="nav_link" id="tgbs-btn" title="让TGFCER更美好的设置">TGGM</a>');
//点击模块的处理
$('#scroller').delegate('#tgbs-btn', 'click', function(){
    if ($('#tgbs').css('display')=='none'){
        $('#tgbs').css({'display':''});
        $('#tgbs').css('top',$('#tgbs-btn').position().top+20);
        $('#tgbs').css('left',$('#tgbs-btn').position().left-20);
        $('#tgbs textarea').focus();
        //添加"加入到ban"按钮
        $('#scroller .infobar').each(function(){
            $(this).find('a').eq(1).after('<button class="add-to-ban" value="'+$(this).find('a').eq(1).text()+'">+屏蔽</button>');
        });
    }else{
        //关闭设置菜单时，清除所有"加入到ban"按钮并关闭设置面板
        $('.add-to-ban').remove();
        $('#tgbs').css({'display':'none'});
        // 保存数据到localStorage
        localStorage.BanList = $('#banlist-textarea').val();
        BanList = localStorage.BanList;
        BanListArray = BanList.split(',');
    }
});
//处理点击'.add-to-ban'按钮
$('.infobar').delegate('.add-to-ban', 'click', function(){
    $('#banlist-textarea').val($('#banlist-textarea').val()+','+$(this).attr('value'));
});
//在原生导航栏下面加入设置表单
$('div.navbar').append('<div id="tgbs" style="color:#FFF; width:500px;padding:.5em;position:fixed; display:none; overflow:hidden;box-shadow: rgb(51, 51, 51) 1px 1px 19px;background-color: #436193;">屏蔽ID列表:<br/><textarea id=\"banlist-textarea\" style="width:100%;height:160px;">'+BanList+'</textarea></div>');













//点击屏蔽区将展开屏蔽内容
$('#scroller').delegate('.list-ban-section', 'click', function(){
    if ($(this).css('height')=='21px'){
        $(this).css({'height':'auto'});
    }else{
        $(this).css({'height':'21px'});
    }
    
});
//如果当前页面是列表页面的处理
//console.log(PageCurrent.indexOf(PageList));
if (PageCurrent.indexOf(PageList)==0){
    //console.log('当前在列表页面');
    $('.dTitle').each(function(){
        var author = $(this).find('span.author').text();
        for (i in BanListArray){
            //判断发帖人是否在屏蔽列表中
            if (author.indexOf(BanListArray[i])==1){
                //console.log(author.indexOf(BanListArray[i]),BanListArray[i]);
                $(this).addClass('list-ban-section');
                $(this).prepend('<div style="width:auto;text-align:center;border:1px dashed #DEDEDE;color:#DEDEDE; line-height:19px;"><strong>'+BanListArray[i]+'</strong>已被屏蔽</div>');
                $(this).css({'height':'21px','overflow':'hidden'});
            }
        }
    });
}


$('#scroller').delegate('.info-ban-section', 'click', function(){
    if ($(this).next().css('display')=='none'){
        $(this).next().css({'display':'inherit'});
        $(this).next().next().css({'display':'inherit'});
        $(this).next().next().next().css({'display':'inherit'});
        $(this).next().next().next().next().css({'display':'inherit'});
        $(this).next().next().next().next().next().css({'display':'inherit'});
    }else{
        $(this).next().css({'display':'none'});
        $(this).next().next().css({'display':'none'});
        $(this).next().next().next().css({'display':'none'});
        $(this).next().next().next().next().css({'display':'none'});
        $(this).next().next().next().next().next().css({'display':'none'});
    }

});
//如果当前页面是内容页的处理
if (PageCurrent.indexOf(PageInfo)==0){
    $('.infobar').each(function(){
        var author = $(this).find('a').eq(1).text();
        for (i in BanListArray){
            //判断发帖人是否在屏蔽列表中
            if (author==BanListArray[i]){
                console.log(author.indexOf(BanListArray[i]),BanListArray[i]);
                //$(this).addClass('ban-section');
                $(this).before('<div class="info-ban-section" style="cursor:pointer;width:auto;text-align:center;border:1px dashed #DEDEDE;color:#DEDEDE; line-height:19px;"><strong>'+BanListArray[i]+'</strong>已被屏蔽</div>');
                //依次连续隐藏5个（含自己）元素
                $(this).css({'display':'none'});
                $(this).next().css({'display':'none'});
                $(this).next().next().css({'display':'none'});
                $(this).next().next().next().css({'display':'none'});
                $(this).next().next().next().next().css({'display':'none'});
            }
        }
    });
}
