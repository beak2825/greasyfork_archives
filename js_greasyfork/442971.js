// ==UserScript==
// @name         绅士仓库帖子隐藏
// @namespace    Q
// @version      0.1
// @description  用于绅士仓库，自定义隐藏指定用户的发帖，净化ghs环境
// @author       Q
// @match        https://cangku.icu
// @match        https://cangku.icu/category/*
// @match        https://cangku.icu/?page=*
// @match        https://cangku.icu/rank
// @match        https://cangku.icu/author
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license Q


// @downloadURL https://update.greasyfork.org/scripts/442971/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E5%B8%96%E5%AD%90%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/442971/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E5%B8%96%E5%AD%90%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {

    //隐藏列表，需修改发帖人用户id
    var keywords = ['/user/用户id'];

    //Mutation Observer API 用来监视 DOM 变动
    var observer = new MutationObserver(
        function (){

            var topics = document.getElementsByClassName('post col-sm-12');
            var category = document.getElementsByClassName('post col-sm-8');
            var rank = document.getElementsByClassName('post col-sm-6 col-md-4');
            var authorWall = document.getElementsByClassName('author-item col-md-2');
            
            if(category.length >0){
                topics = category;
            }
            if(rank.length > 0){
                topics = rank;
            }
            if(authorWall.length > 0){
                topics = authorWall;
            }

            for (var i = 0; i < topics.length; i++) {
                var a = topics[i];
                var usertext = a.innerHTML;

                for (var j = 0; j < keywords.length; j++) {
                    var keyword = keywords[j];

                    if(usertext.indexOf(keyword) >= 0){
                        //console.log('Removed:  ※※※※※※' + j + '※※※※※※');
                        a.remove();
                    }
                }
            }
        }
    );

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();