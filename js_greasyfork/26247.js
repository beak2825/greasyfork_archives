// ==UserScript==
// @name         PC微博首页时间线正确排布
// @description  让微博时间线正确排布
// @namespace    https://www.kindjeff.com/
// @version      2017.10.21
// @author       kindJeff
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26247/PC%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E6%97%B6%E9%97%B4%E7%BA%BF%E6%AD%A3%E7%A1%AE%E6%8E%92%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/26247/PC%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E6%97%B6%E9%97%B4%E7%BA%BF%E6%AD%A3%E7%A1%AE%E6%8E%92%E5%B8%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main(){
        var is_home = window.location.pathname.split('/')[2]=='home';
        var is_sorted = window.location.search.indexOf('is_search')!=-1;

        var right_search = 'is_ori=1&is_forward=1&is_text=1&is_pic=1&is_video=1&is_music=1&is_article=1&is_search=1';
        var sorted_url = '/home?' + right_search;


        if(is_home && !is_sorted){
            window.location = sorted_url;
        }else{
            document.addEventListener('click', function(e){
                var is_target_a = e.target.href!==undefined;

                var the_target = e.target;
                if(!is_target_a)
                    the_target = e.target.parentNode;

                if(the_target.href!==undefined){
                    if(the_target.href.slice(-12)==='is_search=1#'){
                        return;
                    }
                    var slash_path = 2;
                    if(the_target.href.indexOf('://') != -1){
                        slash_path = 4;
                    }
                    if(the_target.href.split('/')[slash_path].indexOf('home') === 0){
                        e.preventDefault();

                        if(the_target.href.indexOf('page=') != -1){
                            e.preventDefault();
                            var new_href = the_target.href.replace(/pids=Pl_Content_HomeFeed/, '');
                            window.location = new_href;
                        }else
                            window.location = sorted_url;
                    }
                }
            },true);
        }

    }

    main();

})();
