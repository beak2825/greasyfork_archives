// ==UserScript==
// @name         去掉掘金的热门评论，沉浸阅读，左侧只留下收藏功能，右侧只留下目录功能,把掘金插件的广告隐藏
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  正常的技术文章，热门评论完成没必要，反而是哪些讲学习方向呀，吹捧的哪些可能热门评论还有点用。我看技术的文章，所以避免我下滑再次刷到浪费时间，所以我们把它关掉
// @author       xiaolajikiki
// @match        https://juejin.cn/post/*
// @match        https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443750/%E5%8E%BB%E6%8E%89%E6%8E%98%E9%87%91%E7%9A%84%E7%83%AD%E9%97%A8%E8%AF%84%E8%AE%BA%EF%BC%8C%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%EF%BC%8C%E5%B7%A6%E4%BE%A7%E5%8F%AA%E7%95%99%E4%B8%8B%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD%EF%BC%8C%E5%8F%B3%E4%BE%A7%E5%8F%AA%E7%95%99%E4%B8%8B%E7%9B%AE%E5%BD%95%E5%8A%9F%E8%83%BD%2C%E6%8A%8A%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6%E7%9A%84%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/443750/%E5%8E%BB%E6%8E%89%E6%8E%98%E9%87%91%E7%9A%84%E7%83%AD%E9%97%A8%E8%AF%84%E8%AE%BA%EF%BC%8C%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%EF%BC%8C%E5%B7%A6%E4%BE%A7%E5%8F%AA%E7%95%99%E4%B8%8B%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD%EF%BC%8C%E5%8F%B3%E4%BE%A7%E5%8F%AA%E7%95%99%E4%B8%8B%E7%9B%AE%E5%BD%95%E5%8A%9F%E8%83%BD%2C%E6%8A%8A%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6%E7%9A%84%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取url地址
    function getUrl(){
        let url = window.location.href;
        return url;
    }

    setTimeout(() => {
        if(true){
            document.querySelector('.extension').style.display="none"
        }
        // 如果掘金文章开头有图片自动隐藏，如果想看图片的把下面这个if判断注释掉就好了
        if(document.getElementsByClassName('lazy article-hero').length > 0){
            document.getElementsByClassName('lazy article-hero')[0].style.display='none'
        }

        if(getUrl().indexOf('post') > -1){
            let sleepFun = function(fun, time) {
                setTimeout(function() {
                    fun();
                }, time);
            }
            // 这里我直接拿的热门评论的标签，其实这样是不好的。假如有的文章没有热门评论这里就会报错。但是我们用的话其实不影响的。反正我的目的是达到了。
            // 大家觉得红色的控制台不舒服可以优化一下。 这里必须设置一下setTimeout，要不然会拿不到标签。可能是网页渲染的慢的问题。
            let fun = () => {
                // 加了try...catch防止控制台报错
                try{
                    let hotCommentList = document.querySelector(".container .hot-list");
                    hotCommentList.style.display="none";
                }catch(err){
                    console.log("该文章没有热门评论")
                }
                // 左侧我只留下一个收藏，我觉得有用。收藏是i为3的时候，所以我这里判断了一下。右侧同样的逻辑。
                let leftContent = document.getElementsByClassName("article-suspended-panel")[0].children;
                for(let i=0;i<leftContent.length;i++){
                    if(i !==3){
                        leftContent[i].style.display="none";
                    }
                };
                let rightContent = document.getElementsByClassName("sidebar")[0].children;
                for(let i=0;i<rightContent.length;i++){
                    if(i !==4){
                        rightContent[i].style.display="none";
                    }
                };

            };
            sleepFun (fun, 5000);
        }

    },3000)
})();