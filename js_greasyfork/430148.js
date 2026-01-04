// ==UserScript==
// @name         Bilibili - 不再白嫖
// @namespace    top.qwq123.scripts.BilibiliAutoLike
// @version      0.4.1
// @description  视频、专栏、番剧、评论、动态自动点赞
// @author       XcantloadX
// @run-at       document-end
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        *://www.bilibili.com/video/*
// @match        *://t.bilibili.com/*
// @match        *://space.bilibili.com/*/favlist/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/read/*
// @match        *://www.bilibili.com/medialist/play/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/430148/Bilibili%20-%20%E4%B8%8D%E5%86%8D%E7%99%BD%E5%AB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430148/Bilibili%20-%20%E4%B8%8D%E5%86%8D%E7%99%BD%E5%AB%96.meta.js
// ==/UserScript==

(function() {
    window.AutoLike = {
        //true=启用，false=禁用
        //评论点赞还未修复！

        //评论区改版了，但又没有完全改：视频页用新版，动态页用旧版
        //视频播放器改版了，但又没有完全改：普通视频页用新版，收藏夹/播放列表用旧版
        //厉害了，我的B站
        settings: {
            //视频
            video: {
                enabled: true, //是否启用视频点赞
                comment: { //评论
                    enabled: true, //是否启用评论点赞
                    subComment: false, //是否给楼中楼点赞
                    minLikeCount: 20 //评论点赞数量小于等于这个数就不会点赞
                }
            },
            //专栏
            passage: {
                enabled: true, //是否启用专栏点赞
                comment: { //评论
                    enabled: false, //是否启用评论点赞
                    subComment: false, //是否给楼中楼点赞
                    minLikeCount: 20 //评论点赞数量小于等于这个数就不会点赞
                }
            },
            //动态
            following: {
                enabled: true, //是否启用动态自动点赞
                comment: { //评论
                    enabled: false, //是否启用评论点赞
                    subComment: false, //是否给楼中楼点赞
                    minLikeCount: 20 //评论点赞数量小于等于这个数就不会点赞
                },
                disableSuccessMsg: true //（开发中）屏蔽点赞成功消息
            },

            //番剧
            bangumi: {
                enabled: true, //是否启用番剧点赞
                comment: { //评论
                    enabled: false, //是否启用评论点赞
                    subComment: false, //是否给楼中楼点赞
                    minLikeCount: 20 //评论点赞数量小于等于这个数就不会点赞
                }
            }
        },
        //TODO:
        //UI 设置界面
        //更好的监测是否已点赞的方法（API）

        init: function(){
            let url = window.location.toString();
            if(url.search("t.bilibili.com") > -1){ //动态
                if(this.settings.following.enabled)
                    this.initFollowing();
                if(this.settings.following.comment.enabled)
                    this.initComments(this.settings.following.comment);
                if(AutoLike.settings.following.disableSuccessMsg){
                    
                    let style = document.createElement("style");
                    style.innerText = ".bili-message.success {visibility: none}";
                    document.body.append(style);
                }
                    
            }
            if(url.search("www.bilibili.com/video/.+") > -1){ //视频
                if(this.settings.video.enabled)
                    $(this.initVideo);
                if(this.settings.video.comment.enabled)
                    this.initComments(this.settings.video.comment);
            }
            if(url.search("www.bilibili.com/medialist/play/.+") > -1){ //视频（旧）
                if(this.settings.video.enabled)
                    $(this.initVideoOld);
                if(this.settings.video.comment.enabled)
                    this.initComments(this.settings.video.comment);
            }
            if(url.search("www.bilibili.com/read/.+") > -1){ //专栏
                if(this.settings.passage.enabled)
                    $(this.initPassage);
                if(this.settings.passage.comment.enabled)
                    this.initComments(this.settings.passage.comment);
            }
            if(url.search("www.bilibili.com/bangumi/play/.+") > -1){ //番剧
                if(this.settings.bangumi.enabled)
                    $(this.initBangumi);
                if(this.settings.bangumi.comment.enabled)
                    this.initComments(this.settings.bangumi.comment);
            }
        },

        //动态页面
        initFollowing: function(){
            let likes = []; //待点赞按钮
            let toLike = []; //带点赞列队

            //监听 DOM 变化并找出所有点赞按钮
            let observer = new MutationObserver(function(changes){
                changes.forEach(function(change){
                    
                    if(change.type == "childList"){
                        //动态卡片
                        if($(change.target).hasClass("bili-dyn-list__items")){
                            let likeBtn = $(change.addedNodes[0]).find("div[data-type=like]");
                            if(typeof(likeBtn) == "undefined" || $(likeBtn).hasClass("active")) //未找到按钮或已赞
                                return;
                            if(!likes.includes(likeBtn)) //避免重复添加
                                likes.push(likeBtn);
                        }
                        //成功消息
                        /*else if(AutoLike.settings.following.disableSuccessMsg && $(change.target).hasClass("bili-message success")){
                            change.addedNodes[0].style.visibility = "hidden";
                        }*/
                    }

                });

            });
            observer.observe(document.body, {attributes: true, childList: true, subtree: true});

            //监听滚动事件并点赞
            $(window).on('DOMContentLoaded load resize scroll', function(){
                if(likes.length > 0){
                    likes.forEach(function(like){
                        if(isElementInViewport(like))
                            toLike.push(likes.shift());
                    });
                }
            });

            window.setInterval(function(){
                if(toLike.length > 0){
                    $(toLike.shift()).click();
                }
            }, 2000); //为了避免太快，采用队列的方式逐个点赞*/
        },

        //视频页面
        initVideo: function(){
            console.log("AutoLike 已加载（视频）");
            let liked = false;
            let oldSessionID = "";
    
            //跳转检测（主要是从旁边推荐点进去）
            window.setInterval(function(){
                if(unsafeWindow.player.getSession() != oldSessionID){
                    oldSessionID = unsafeWindow.player.getSession();
                    window.setTimeout(doLike, 5000);
                }
            });
    
            function doLike(){
                let like;
                if($(".toolbar-left .like").length > 0)
                    like = $(".toolbar-left .like");
                else
                    return;
    
                if(!$(like).hasClass("on")){
                    $(like).click();
                    $(like).addClass("on"); //防止太卡
                    liked = true;
                }
            }
        },

        //旧版播放页
        initVideoOld: function(){
            console.log("AutoLike 已加载（视频）");
            let liked = false;
            let oldSessionID = "";
    
            //跳转检测（主要是从旁边推荐点进去）
            window.setInterval(function(){
                if(unsafeWindow.player.getSession() != oldSessionID){
                    oldSessionID = unsafeWindow.player.getSession();
                    window.setTimeout(doLike, 5000);
                }
            });
    
            function doLike(){
                let like;
                if($(".ops .like").length > 0)
                    like = $(".ops .like");
                else
                    return;
    
                if(!$(like).hasClass("on")){
                    $(like).click();
                    $(like).addClass("on"); //防止太卡
                    liked = true;
                }
            }

        },

        //专栏
        initPassage: function(){
            console.log("AutoLike 已加载（专栏）");
            window.setTimeout(function(){
                $(".icon-like").click();
            }, 5000);
        },

        //番剧
        //视频页和番剧页点赞的 class 居然不一样
        initBangumi: function(){
            console.log("AutoLike 已加载（番剧）");
            let liked = false;
            let oldPath = "";
    
            //跳转检测（主要是从旁边推荐点进去 + 换P）
            window.setInterval(function(){
                if(location.pathname != oldPath){
                    oldPath = location.pathname;
                    window.setTimeout(doLike, 5000);
                }
            });
    
            function doLike(){
                if($(".icon-like").length <= 0)
                    return;
    
                if($(".like-info.active").length <= 0){ //若没有点赞
                    $(".icon-like").click();
                    liked = true;
                }
            }
        },

        //评论区
        initComments: function(commentSettings){
            console.log("AutoLike 已加载（评论）");
            let commentList;
            let likes = []; //待点赞按钮

            let observer = new MutationObserver(function(changes){
                changes.forEach(function(change){
                    if(change.type != "childList")
                        return;
                    //.root-reply .reply-info .reply-like .like
                    if($(change.target).hasClass("reply-list")){ //评论区
                        commentList = change.target;
                        likes = $(commentList).find(".reply-item .content-warp").toArray();
                    }
                });

            });

            observer.observe(document.body, {attributes: true, childList: true, subtree: true});

            window.setInterval(function(){
                if(likes.length <= 0)
                    return;
                let like = likes.shift();
                let isSubComment = $(like).parents(".reply-box").length > 0; //是否是楼中楼
                let likeCount; //点赞数
                if($(like).children("span").text() === "")
                    likeCount = 0;
                else
                    likeCount = parseInt($(like).children("span").text());


                if($(like).hasClass("liked")) //跳过已赞
                    return;
                if(!commentSettings.subComment && isSubComment)
                    return;
                if(likeCount <= commentSettings.minLikeCount)
                    return;

                $(like).click();
                console.log("已赞");
                
            }, 300); //为了避免太快，采用队列的方式逐个点赞
        }
    };

    function isElementInViewport (el) {
        // Special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
    
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    }

    AutoLike.init();
    window.AL = {};
    //取消所有点赞
    window.AL.cancelAll = function(){
        $(".liked").click();
    };
})();