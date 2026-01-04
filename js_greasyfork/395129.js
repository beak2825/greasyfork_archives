// ==UserScript==
// @name                自动生成简书文章目录
// @namespace           create-catalog
// @version             1.3
// @author              2024
// @description         给简书增加目录功能（通过识别h1-h6标题，自动生成目录放于页面的左侧）
// @match               http://www.jianshu.com/p/*
// @match               https://www.jianshu.com/p/*
// @grant               none
// @require             https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require             https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/395129/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/395129/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

var version = 1;

// 获取简书阅读模式
function getReadMode(){
    return $.cookie('read_mode') || 'day'
}

// 获取样式风格
function getStyle(){
    if(getReadMode() === 'day'){
        return {
            background: 'white',
            color: 'black'
        }
    } else {
        return {
            background:'#3d3d3d',
            color:'#b3b3b3'
        }
    }
}

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
    let paddingLeft = tagName.substring(1) * 10; //添加标题缩进
    let style = getStyle();
    $('#menu_nav_ol').append(`<li class="${id}" style="padding-left: ${paddingLeft}px;line-height:40px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 200px"><a href=javascript:; title="${toTxt(trim(content,"g"))}" style="color:${style.color}">${content}</a></li>`);
}

(function() {
    // 获取标题元素
    let titles = $('body article').find('h1,h2,h3,h4,h5,h6');
    let style = getStyle();

    if(titles.length === 0) {
        return;
    }
    // 将文章内容右移
    // 在 body 标签内部添加 aside 侧边栏,用于显示文档目录
    let asideContent = `<aside id="sideMenu" style="font-size:15px;color:${style.color};position: fixed;padding: 20px 15px 20px 0;top: 66px;left: 10px;margin-bottom:20px;background-color: ${style.background};z-index: 810;overflow-y: auto;height:calc(100% - 124px);border-radius:4px"></aside>`;
    $('body').prepend(asideContent);
    $('#sideMenu').append('<ol id="menu_nav_ol" style="list-style:none;margin:0px;padding:0 0 0 10px">');// 不显示 li 项前面默认的点标志, 也不使用默认缩进
    $('div[role="main"]').css('paddingLeft','160px');

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
        var _top=$("#"+targetId).offset().top-75
        $('html,body').animate({
            scrollTop:_top
        }, 300);
    });
    //滚动页面增加左侧菜单高亮
    var active=function(){
        var scrollTop=$(window).scrollTop();
        $('.main-title').each(function(i){
            if(i<$('.main-title').length-1){
                if(scrollTop+76>=$(this).offset().top&&scrollTop+76<$('.main-title').eq(i+1).offset().top){
                    $('#sideMenu li a').css({color: style.color});
                    $('#sideMenu li').eq(i).find('a').css({color:'#61aeee'});
                    $('#sideMenu li').css({borderLeft:'0'})
                    $('#sideMenu li').eq(i).css({borderLeft:'5px solid #61aeee'});
                }
            }else{
                if(scrollTop+76>=$(this).offset().top){
                    $('#sideMenu li a').css({color: style.color});
                    $('#sideMenu li').eq(i).find('a').css({color:'#61aeee'});
                    $('#sideMenu li').css({borderLeft:'0'})
                    $('#sideMenu li').eq(i).css({borderLeft:'5px solid #61aeee'});
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