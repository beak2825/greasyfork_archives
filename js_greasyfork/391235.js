// ==UserScript==
// @name         看小说
// @namespace    https://www.v587.com/
// @version      0.22
// @description  修改小说网站的背景文字
// @author       penrcz
// @match        http://www.booksky.cc/*
// @match        https://www.sanyewu.com/*
// @match        https://www.gulongbbs.com/*
// @match        https://www.yanqingshu.com/book/*
// @match        https://www.52bqg.com/book_*
// @match        https://www.52bqg.net/book_*
// @match        https://www.xxbqg.com/book_*
// @match        http://www.xuesoo.com/bqg/*
// @match        https://*.ibiquge.la/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391235/%E7%9C%8B%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/391235/%E7%9C%8B%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var domain = window.location.host;
    switch(domain){
        case 'www.yanqingshu.com':
            //增加顶端上下页
            $('.chapter_control').clone().prependTo(".content_block");
            break;
        case 'www.sanyewu.com':
            //三叶屋 https://www.sanyewu.com/*
            //去限右键
            $('body').removeAttr('onselectstart');
            //增加顶端上下页
            $('.readpage').clone().prependTo("#nr");
            break;
        case 'www.booksky.cc':
            // 快眼看书 http://www.booksky.cc/
            //去窗口弹出
            $('.btn-danger').removeAttr('target');
            //修改文字大小
            $('#chaptercontent').css({ fontSize: "32px",lineHeight:"50px" });
            break;
        case 'www.gulongbbs.com':
            //古龙小说网 https://www.gulongbbs.com/
            //修改背景去广告
            $('#new').css("background","cadetblue");
            $('.center_tdbgall').css("width","auto");
            $('#ad').css('display','none');
            break;
        case 'www.yanqingshu.com':
            //笔趣阁小说网
            //去限右键
            $(document).unbind('contextmenu');
            $(document).unbind('selectstart');
            break;
        case 'www.52bqg.com':
        case 'www.xxbqg.com':
        case 'www.52bqg.net':
            //修改背景
            $('#box_con,.content_read').css({"background":"rgb(68, 68, 68)","width":" 100%"});
            $('#content').css({ fontSize: "48px",lineHeight:"72px", "color":"rgb(0, 0, 0)","width":" 100%"});
            $('.bookname').css({"color":"rgb(153, 153, 153)"});
            break;
        case 'www.xuesoo.com':
            //修改背景
            $('.container').css({"background":"rgb(68, 68, 68)","width":" 100%"});
            $('.content').css({ fontSize: "48px",lineHeight:"96px", "color":"rgb(153, 153, 153)","width":" 100%"});
            $('.section-opt a,.title').css({"color":"rgb(153, 153, 153)"});
            break;
        case 'www.ibiquge.la':

            break;
        default:
    }


})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}

function showpop_addmark(bid, cid) {
    $.ajax({
        cache:false,
        url:'https://www.ibiquge.la/addbookcase/'+bid+'/'+cid+'.php',
        success:function(data){
            if('-1'==data){
                showpop_base('先登录再收藏！');
            }else if('-2'==data){
                showpop_base('已收藏好多书了！');
            }else{
                showpop_base('加入书签成功！');
            }
        },
        error:function(){
            showpop_base('加入书签失败！');
        }
    });
}