// ==UserScript==
// @name         Gamersky comments photo save
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Gamersky comments photo save!
// @author       Andiest ziu
// @match        *.gamersky.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410853/Gamersky%20comments%20photo%20save.user.js
// @updateURL https://update.greasyfork.org/scripts/410853/Gamersky%20comments%20photo%20save.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href == 'https://www.gamersky.com/ent/qw/'){
        setInterval(function(){
            let now_time = (new Date()).valueOf();
            let url = 'https://db2.gamersky.com/LabelJsonpAjax.aspx?jsondata={"type":"updatenodelabel","isCache":false,"nodeId":"20113","isNodeId":"true","page":1}&_=' + now_time;
            fetch(encodeURI(url)).then(function(response) {
                return response.text();
            }).then(function(myJson) {
                var load_data = eval(myJson);
                document.getElementsByClassName("contentpaging")[0].innerHTML = load_data.body;
            });
        },2000);
    }
    function insertAfter(newElement,targetElement){
        var parent = targetElement.parentNode;
        // 如果最后的节点是目标元素，则直接添加
        if(parent.lastChild == targetElement){
            parent.appendChild(newElement)
        }else{
            //如果不是，则插入在目标元素的下一个兄弟节点 的前面
            parent.insertBefore(newElement,targetElement.nextSibling)
        }
    }
    var start_btn = document.createElement("a");
    start_btn.setAttribute("id","btn_start_haha");
    start_btn.setAttribute("href","javascript:;");
    start_btn.innerHTML = '开始';


    var hahadiv = document.createElement("div");
    hahadiv.setAttribute("id","hahadiv");
    var commentsCount = 0;
    var result = location.pathname.match(/\/(\d*)\./);
    var article_num = result[1];
    var handle_result = function(photo_list){
        let html = '';
        for(var haha in photo_list){
            if( String(photo_list[haha].img_url).indexOf("http") != -1 ) html += '<div><img src="' + photo_list[haha].img_url + '" title="' + photo_list[haha].title + '" width="100%"/></div>';
        }
        if( have_load == 0 ){
            document.getElementById("hahadiv").innerHTML = html + document.getElementById("hahadiv").innerHTML;
        }else{
            hahadiv.innerHTML += html;
            insertAfter(hahadiv, document.getElementById("SOHUCS"));
        }
    };
    var commit_list = localStorage.getItem('commit_list' + article_num);
    var init_count = 0;
    var total_photo_list = [];
    var photo_list = [];
    var pageIndex = 1;
    var max_comment_id = 0;
    var have_load = 1;

    var settime_ajax = function(){
        setTimeout(function(){
            have_load = 0
            var now_time = (new Date()).valueOf();
            var request = {
                "articleId":article_num,
                "minPraisesCount":0,
                "repliesMaxCount":10,
                "pageIndex":1,
                "pageSize":10,
                "order":
                "createTimeDESC"
            };
            var url = encodeURI('https://cm.gamersky.com/appapi/GetArticleCommentWithClubStyle?request=' + JSON.stringify(request) + '&_=' + now_time);
            load_data(url);
        },1000);
    }
    if(commit_list != null ){
        commit_list = JSON.parse(commit_list);
        console.log(commit_list);
        init_count = commit_list.commentsCount;
        total_photo_list = commit_list.photo_list;
        max_comment_id = commit_list.max_comment_id;
        pageIndex = Math.ceil(init_count / 10);
        insertAfter(start_btn,document.getElementById("SOHUCS"));
        start_btn.onclick = function(){
            this.remove();
            handle_result(total_photo_list);
            settime_ajax();
        }
    }else{
        commit_list = {};
        insertAfter(start_btn,document.getElementById("SOHUCS"));
        let now_time = (new Date()).valueOf();
        let num = '18308087865817357132';
        let callback = 'jQuery' + num + '_' + now_time++;

        var request = {
            "articleId":article_num,
            "minPraisesCount":0,
            "repliesMaxCount":10,
            "pageIndex":1,
            "pageSize":10,
            "order":
            "createTimeDESC"
        };
        let url = encodeURI('https://cm.gamersky.com/appapi/GetArticleCommentWithClubStyle?request=' + JSON.stringify(request) + '&_=' + now_time);
        start_btn.onclick = function(){
            this.remove();
            load_data(url);
        }
    }

    var load_data = function(url){
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            photo_list = [];
            let list = myJson.result.comments;
            for(var l_i in list){
                if( typeof list[l_i].comment_id == 'undefined' ) continue;
                if( have_load == 0 && max_comment_id >= Number(list[l_i].comment_id)) continue;
                if( Number(list[l_i].comment_id) > max_comment_id) max_comment_id = Number(list[l_i].comment_id);
                let img_list = list[l_i].imageInfes;
                if(typeof img_list == 'undefined'){
                    continue;
                }
                if(img_list.length == 0){
                    continue;
                }
                for(var i in img_list){
                    if(typeof img_list[i].origin != 'undefined'){
                        var tmp = {
                            "title":list[l_i].content,
                            "img_url":img_list[i].origin
                        };
                        photo_list.push(tmp);
                        total_photo_list.unshift(tmp);
                    }
                }
            }
            //console.log(photo_list);
            // 加载下一页
            commentsCount = Number(myJson.result.commentsCount);
            if(photo_list.length > 0) {
                handle_result(photo_list);
                //保存数据
                commit_list.commentsCount = commentsCount;
                commit_list.photo_list = total_photo_list;
                commit_list.max_comment_id = max_comment_id;
                localStorage.setItem('commit_list' + article_num, JSON.stringify(commit_list));
            }
            //开始下一轮
            if( have_load == 1){
                let page_num = Math.ceil(commentsCount / 10);

                //console.log(commentsCount,page_num,pageIndex);
                if(pageIndex <= page_num){
                    pageIndex++;
                }else{
                    pageIndex = 1;
                    have_load = 0;
                }
                var now_time = (new Date()).valueOf();
                var request = {
                    "articleId":article_num,
                    "minPraisesCount":0,
                    "repliesMaxCount":10,
                    "pageIndex":pageIndex,
                    "pageSize":10,
                    "order":
                    "createTimeDESC"
                };
                var url = encodeURI('https://cm.gamersky.com/appapi/GetArticleCommentWithClubStyle?request=' + JSON.stringify(request) + '&_=' + now_time);
                load_data(url);
            }else{
                settime_ajax();
            }
        });
    };


})();