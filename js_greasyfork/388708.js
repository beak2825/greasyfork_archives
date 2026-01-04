// ==UserScript==
// @name                markdown自动生成简书目录
// @namespace           create-jianshuList
// @version             2.2
// @author              YIN
// @description         给简书增加目录功能（注：通过h1-h6标题来识别，所以文章中必须有相应的标题才行）
// @match               http://www.jianshu.com/p/*
// @match               https://www.jianshu.com/p/*
// @grant               none
// @require             https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require             https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/388708/markdown%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388708/markdown%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AE%80%E4%B9%A6%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

var version=Number($.cookie('if_shakespeare'))  // 1为新版本    0为旧版本


//去除字符串所有空格
function trim (str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global&&is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

//转义尖括号
function toTxt(str) {
    var RexStr = /\<|\>/g
    str = str.replace(RexStr, function(MatchStr) {
        switch (MatchStr) {
            case "<":
                return "&lt;";
                break;
            case ">":
                return "&gt;";
                break;
            default:
                break;
        }
    })
    return str;
}
var menuIndex = 0; //初始化标题索引

// 在侧边栏中添加目录项
function appendMenuItem(tagName,id,content) {
    let paddingLeft = tagName.substring(1) * 20; //添加标题缩进
    $('#menu_nav_ol').append('<li class=' + id + ' style="padding-left: '+ paddingLeft +'px;line-height:40px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><a href=javascript:; title='+toTxt(trim(content,"g"))+' style="color:#e1e3e4">' + content + '</a></li>');
}

(function() {
    // 获取标题元素
    let titles;

    if(version){
        titles=$('body article').find('h1,h2,h3,h4,h5,h6');
    }else{

        titles=$('.show-content').find('h1,h2,h3,h4,h5,h6');
    }
    if(titles.length === 0) {
        return;
    }
    // 将文章内容右移
    $('.post').css({padding:'0 150px 0 400px',width:'100%'});
    // 在 body 标签内部添加 aside 侧边栏,用于显示文档目录
    let asideContent;
    if(version){
        asideContent = '<aside id="sideMenu" style="font-size:15px;color:#fff;position: fixed;padding: 20px 15px 20px 0;top: 66px;left: 0;margin-bottom:20px;background-color: #282c34;z-index: 810;overflow: auto;height:calc(100% - 124px);width:320px;"></aside>';
    }else{
        asideContent = '<aside id="sideMenu" style="font-size:15px;color:#fff;position: fixed;padding: 70px 15px 20px 0;top: 0;left: 0;margin-bottom:20px;background-color: #282c34;z-index: 810;overflow: auto;height:100%;width:320px;"></aside>';
    }
    $('body').prepend(asideContent);
    $('#sideMenu').append('<ol id="menu_nav_ol" style="list-style:none;margin:0px;padding:0px;">');// 不显示 li 项前面默认的点标志, 也不使用默认缩进
    if(version){
        $('div[role="main"]').css('paddingLeft','160px')
    }

    // 遍历文章中的所有标题行, 按需添加id值, 并增加记录到目录列表中
    titles.each(function() {
        let tagName = $(this)[0].tagName.toLocaleLowerCase();
        let content = $(this).text();
        // 若标题的id不存在,则使用新id
        let newTagId =$(this).attr('id');

        if(content){
            if(!$(this).attr('id')) {
                newTagId = 'id_'+menuIndex;
                $(this).attr('id',newTagId);
                $(this).addClass('main-title')
                menuIndex++;
            }
            appendMenuItem(tagName,newTagId,content);

        }

    });

    $('#sideMenu').append('</ol>');

    if(!$('#menu_nav_ol li').length){
        $('#sideMenu').remove()
    }
    // 绑定目录li点击事件,点击时跳转到对应的位置
    $('#menu_nav_ol li').on('click',function() {
        let targetId = $(this).attr('class');
        var _top=$("#"+targetId).offset().top-55
        $('html,body').animate({
            scrollTop:_top
        }, 300);
    });
    //滚动页面增加左侧菜单高亮
    var active=function(){
        var scrollTop=$(window).scrollTop();
        $('.main-title').each(function(i){
            if(i<$('.main-title').length-1){
                if(scrollTop+56>=$(this).offset().top&&scrollTop+56<$('.main-title').eq(i+1).offset().top){
                    $('#sideMenu li a').css({color:'#e1e3e4'})
                    $('#sideMenu li').eq(i).find('a').css({color:'#61aeee'})
                }
            }else{
                if(scrollTop+56>=$(this).offset().top){
                    $('#sideMenu li a').css({color:'#e1e3e4'})
                    $('#sideMenu li').eq(i).find('a').css({color:'#61aeee'})
                }
            }

        })

    }
    active()
    var timer=null;
    $(window).scroll(function(){
        clearTimeout(timer)
        timer=setTimeout(function(){
            active()
        },10)

    })
})();