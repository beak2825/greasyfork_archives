// ==UserScript==
// @name         我的个性脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Just for me.
// @author       TimeCen
// @include      *www.bilibili.com*
// @include      *zhihu.com*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433761/%E6%88%91%E7%9A%84%E4%B8%AA%E6%80%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433761/%E6%88%91%E7%9A%84%E4%B8%AA%E6%80%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var URL = window.location.href;//获取当前页面网址
    var color1 = "rgb(204, 232, 207)";

    if(/.*www.bilibili.com.*/.test(URL))url_bilibili();
    else if(/.*zhihu.com.*/.test(URL))url_zhihu();

    /*
    //护眼背景色
    function url_im(){
        window.onload = function(){//网页加载完运行
            document.getElementsByTagName("body")[0].style.backgroundColor = color1;
            document.getElementById("site-main").style.backgroundColor = color1;
            document.getElementsByClassName("works")[0].style.backgroundColor = color1;
        };
    }
    */

    //护眼背景色
    function url_bilibili(){
        window.onload = function(){
            document.getElementsByTagName("body")[0].style.backgroundColor = color1;
            if(/.*www.bilibili.com\/video.*/.test(URL)){
                setTimeout(function(){
                document.getElementsByClassName("mini-header m-header mini-type")[0].style.backgroundColor = color1;
                document.getElementsByClassName("bb-comment")[0].style.backgroundColor = color1;
                    },3000
                );
            }
            //没有此标签时会卡住
            document.getElementsByClassName("international-footer")[0].style.backgroundColor = color1;
        };
    }

    //护眼背景色，去掉登录弹窗，去掉一些右侧栏
    function url_zhihu(){
        window.onload = function(){
            if(/.*www.zhihu.com\/question.*/.test(URL)){
                if(/\/answer\//.test(URL)){
                    //关闭知乎登陆弹窗
                    document.getElementsByClassName("Button Modal-closeButton Button--plain")[0].click();
                    //主背景色
                    document.getElementsByTagName("body")[0].style.backgroundColor = color1;
                    //最上面的“知乎”菜单栏，背景色
                    document.getElementsByClassName("Sticky AppHeader css-1x8hcdw")[0].style.backgroundColor = color1;
                    //标题和简介，最上面的“知乎”菜单栏的下面，背景色
                    document.getElementsByClassName("QuestionHeader")[0].style.backgroundColor = color1;
                    //关注、回答等按钮栏，标题和简介下面，背景色
                    document.getElementsByClassName("QuestionHeader-footer")[0].style.backgroundColor = color1;
                    //登录栏，关注、回答等按钮栏下面，去掉
                    document.getElementsByClassName("Question-mainColumnLogin")[0].remove();
                    //展开所有回答栏，登录栏下面，背景色
                    document.getElementsByClassName("Card ViewAll")[0].style.backgroundColor = color1;
                    document.getElementsByClassName("Card ViewAll")[1].style.backgroundColor = color1;
                    //回答1，背景色
                    document.getElementsByClassName("Card AnswerCard")[0].style.backgroundColor = color1;
                    //回答2，背景色
                    document.getElementsByClassName("Card MoreAnswers")[0].style.backgroundColor = color1;
                    //右侧“下载客户端栏目”，去掉
                    document.getElementsByClassName("Card AppBanner")[0].remove();
                    //右侧“关于作者”栏目，“下载客户端栏目”下面，背景色
                    document.getElementsByClassName("Card AnswerAuthor")[0].style.backgroundColor = color1;
                    //右侧“收被藏次数”栏目，“关于作者”栏目下面，去掉
                    document.querySelector("div[role='complementary'][class='Card']").remove();
                    //右侧“相关问题”栏目，“收被藏次数”栏目下面，背景色
                    document.getElementsByClassName("Card css-oyqdpg")[0].style.backgroundColor = color1;
                    //右侧“相关推荐”栏目，“相关问题”栏目下面，去掉
                    document.querySelector("div[data-za-detail-view-path-module][class='Card']").remove();
                }
                else{
                    //关闭知乎登陆弹窗
                    document.getElementsByClassName("Button Modal-closeButton Button--plain")[0].click();
                    //主背景色
                    document.getElementsByTagName("body")[0].style.backgroundColor = color1;
                    //最上面的“知乎”菜单栏，背景色
                    document.getElementsByClassName("Sticky AppHeader css-1x8hcdw")[0].style.backgroundColor = color1;
                    //标题和简介，最上面的“知乎”菜单栏的下面，背景色
                    document.getElementsByClassName("QuestionHeader")[0].style.backgroundColor = color1;
                    //关注、回答等按钮栏，标题和简介下面，背景色
                    document.getElementsByClassName("QuestionHeader-footer")[0].style.backgroundColor = color1;
                    //右侧“下载客户端栏目”，去掉
                    document.getElementsByClassName("Card AppBanner")[0].remove();
                    //右侧“相关问题”栏目，“下载客户端栏目”下面，背景色
                    document.getElementsByClassName("Card css-oyqdpg")[0].style.backgroundColor = color1;
                    //右侧“相关推荐”栏目，“相关问题”栏目下面，去掉
                    document.querySelector("div[data-za-detail-view-path-module][class='Card']").remove();
                    //所有回答，背景色
                    document.getElementsByClassName("List")[0].style.backgroundColor = color1;
                }
            }
            else if(/.*zhuanlan.zhihu.com.*/.test(URL)){
                //关闭知乎登陆弹窗
                document.getElementsByClassName("Button Modal-closeButton Button--plain")[0].click();
                //主背景色
                document.getElementsByClassName("Post-content")[0].style.backgroundColor = color1;
                //最上面的“知乎”空白横边栏，背景色
                document.getElementsByClassName("Sticky ColumnPageHeader")[0].style.backgroundColor = color1;
                //页面下面的点赞、收藏栏，背景色
                document.getElementsByClassName("ContentItem-actions")[0].style.backgroundColor = color1;
                //“推荐阅读”栏，点赞、收藏栏下面，背景色
                document.getElementsByClassName("Recommendations-Main")[0].style.backgroundColor = color1;
                //页面最下面的白色横边条，评论框下面，背景色
                document.getElementsByClassName("App-main")[0].style.backgroundColor = color1;
                setTimeout(function(){
                    //“推荐阅读”栏细节，背景色
                    var PostItem = document.getElementsByClassName("PostItem");
                    for(var i=0;i<PostItem.length;i++){
                        PostItem[i].style.backgroundColor = color1;
                    }
                    //评论区，“推荐阅读”栏下面，背景色
                    document.getElementsByClassName("CommentsV2 CommentsV2--withEditor CommentsV2-withPagination")[0].style.backgroundColor = color1;
                    //评论区细节
                    document.getElementsByClassName("Topbar CommentTopbar")[0].style.backgroundColor = color1;
                    document.getElementsByClassName("CommentsV2-footer CommentEditorV2--normal")[0].style.backgroundColor = color1;
                },3000);
            }
        };
    }
})();