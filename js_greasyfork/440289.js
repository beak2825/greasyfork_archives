// ==UserScript==
// @name         CSDN优化助手
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @author       myaijarvis
// @description  CSDN优化助手：移除CSDN博客详情页推荐列表中的下载和推荐课程，去除其他多余的广告 | 更改博客详情页和编辑页代码注释的颜色 | 破除粉丝可见
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://editor.csdn.net/md/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440289/CSDN%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440289/CSDN%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 使用CSDN自带的jQuery更快
//debugger;
const url = window.location.href;

(function () {
    "use strict";
    //debugger;
    let color_code='#00ff2b'; // 代码注释的颜色
    // csdn文章详情页
    if (url.match('blog.csdn.net\/.*?article\/details')){ // 特殊情况https://ugirc.blog.csdn.net/article/details/103895629
        setTimeout(removeDownloadAndCourse, 3000);
        setTimeout(() => {
            $(".toolbar-advert").remove(); // csdn 顶部横幅广告
            $(".csdn-common-logo-advert").remove();
            $('.sidetool-writeguide-box').remove();// 右侧小人物
            $(".leftPop").remove();
            // 破除粉丝可见 （关注博主即可阅读全文） | 除外: VIP文章vip-mask  专栏column-mask
            if(!($(".hide-article-box > div").hasClass("vip-mask")||$(".hide-article-box > div").hasClass("column-mask"))){
                $(".hide-article-box").remove();
                $('#article_content').css({'height':'max-content'})
            }
        }, 2000);

        /*
          设置代码注释的颜色
        */
        let color=$('.hljs-comment').eq(0).css('color');
        let color2=$('.token.comment').eq(0).css('color');
        // 背景为灰色时
        if(color =='rgb(160, 161, 167)' || color2=='rgb(112, 128, 144)'){
            return;
        }

        // 背景为黑色时
        setTimeout(()=>{
            // 需要等内容加载 如果还不好用就监听鼠标滚动
            $('.token.comment').css({'color':color_code});
            $('.hljs-comment').css({'color':color_code});
        },1000);
        return;
    }

    //debugger;
    // csdn文章编辑页
    if (url.includes('editor.csdn.net/md')){
        // 需要等内容加载
        setTimeout(()=>{
            //console.info("setColor");
            let $comment=$('.preview .token.comment'); // 预览界面
            $comment.css({'color':color_code});
            $("pre.markdown-highlighting").on("DOMNodeInserted", function (e) {
                //console.log("md change"); // 监听文章内容改变
                //debugger;
                $comment.css({'color':color_code});
                setTimeout(()=>{
                    //console.log($comment);
                    $('.preview .token.comment').css({'color':color_code}); // 这里必须要使用选择器，不能使用$comment，why？？？
                },500); // 0.5s最合适
            });
        },3000);

        // 点击目录 csdn编辑页面的文章目录有bug
        setTimeout(() => {
            $(".side-title__button_close").click();
        }, 500);
        setTimeout(() => {
            $("button[data-title='目录']").click();
        }, 1000);
        return;

    }
})();

/** 去除csdn下载项、推荐课程
 * type_blog : 文章
 * type_download : 下载项
 * type_course : 推荐课程
 */
function removeDownloadAndCourse() {
    // 1.文章底部，评论前面
    $(".first-recommend-box > div").hasClass("type_blog")
        ? ""
    : $(".first-recommend-box > div").remove();
    $(".second-recommend-box > div").hasClass("type_blog")
        ? ""
    : $(".second-recommend-box > div").remove();

    // 2.相关推荐  csdn这里是动态渲染的，所以需要延迟执行
    $(".insert-baidu-box .recommend-item-box").each((index, domEle) => {
        $(domEle).hasClass("type_blog") ? "" : $(domEle).remove();
        $(domEle).attr('data-type')=="download" ? $(domEle).remove() : '';
    });
    //$("#blogColumnPayAdvert").remove(); // 有时候专栏也显示在这里
}

