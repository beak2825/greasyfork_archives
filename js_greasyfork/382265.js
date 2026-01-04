// ==UserScript==
// @name         新浪微博相册采集
// @namespace    http://qqoq.net/
// @version      0.2.1
// @description  自动获取用户的微博相册，只能在用户主页使用有效
// @author       老萨
// @require      https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @require      https://cdn.bootcss.com/viewerjs/1.3.3/viewer.min.js
// @include        http://weibo.com/*
// @include        https://weibo.com/*
// @include        http://www.weibo.com/*
// @include        https://www.weibo.com/*
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382265/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/382265/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log($CONFIG)
    var uid = $CONFIG['oid']; // 用户ID
    var album_id = ''; // 相册ID
    var page = 1; // 当前页码
    var count = 30; // 每页显示数量（这里有点迷糊，有的微博设置100也有效，有的93、60等等，所以为了确保稳定还是按照官方设置为30）
    var total_page = null; // 总页数
    var type = 3; // 获取微博配图相册
    var viewer = null; // 图片预览
    var post_data = []; // 数据集
    var post_url = 'http://test.com/api/albums'; // 提交url
    var source = 'weibo'; // 提交来源类型
    // 插入预览图插件样式
    $("head").prepend('<link href=//cdn.bootcss.com/viewerjs/1.3.3/viewer.min.css rel=stylesheet>');
    // 插入样式
    $("body").prepend('<div id="laosa"><div class="ls_open">点我</div><div class="ls_main"><div class="ls_node_main"></div><div class="ls_page"><span class="ls_total_page"></span> <span class="ls_total"></span> <span class="ls_current_page"></span> <div class="ls_prev_page W_btn_c btn_34px ls_disable">上一页</div> <div class="ls_next_page W_btn_c btn_34px">下一页</div></div></div></div>');
    GM_addStyle('#laosa{width: 1000px;background: #fff;position: fixed;right: -1000px;bottom: 0;top: 0;z-index: 99999;}'+
                '.ls_open{position: absolute;left: -40px;width: 40px;height: 40px;background: #ff8140;color:#fff;top: 100px;line-height: 40px;text-align: center;font-size: 14px;border-radius: 5px 0 0 5px;}'+
               '.ls_main{overflow-y: auto;height: 100%;}'+
               '.ls_node_main{padding:20px;}'+
               '.ls_node{overflow: hidden;margin-bottom: 20px;}'+
               '.ls_h1{font-weight: bold;font-size: 14px;}'+
               '.ls_li{float: left;width: 150px;padding: 5px;height: 150px;overflow: hidden;}'+
               '.ls_li img{width: 100%;height: auto;}'+
               '.ls_page{padding:20px;}'+
               '.ls_disable,.ls_disable:hover{background:#ddd;}'+
               '.viewer-backdrop{background-color: rgba(0,0,0,.8);}')
    // 打开预览
    $(".ls_node_main").on("click",".ls_li",function(){
        var index = $(this).index();
        viewer = new Viewer($(this).parents('.ls_ul').get(0),{
            initialViewIndex: index,
            interval: 2000,
            loop: false,
            zIndex: 9999999,
            url: 'data-original'
        });
        viewer.show();
    })
    // 监听图片预览事件
    $(".ls_node_main").on('hidden', viewer,function () {
        // 销毁上一次打开对象
        viewer.destroy();
    });
    // 展开面板
    $(".ls_open").click(function(){
        if($("#laosa").css("right") == '0px'){
            $("body").css("overflow","visible");
            $("#laosa").animate({right:-1000});
        }else{
            $("body").css("overflow","hidden");
            $("#laosa").animate({right:0});
        }
    })
    get_weibo_album(uid);
    // 获取微博配图的相册ID（type=3）
    function get_weibo_album(uid){
        var all_album_url = 'http://photo.weibo.com/albums/get_all?uid='+uid+'&page=1&count=100'; // 根据用户id获取所有相册
        GM_xmlhttpRequest({
            method: 'GET',
            url: all_album_url,
            onload: response => {
                if (response.status == 200) {
                    var data = JSON.parse(response.responseText);
                    for (var i=0;i<data.data.album_list.length;i++){
                        // type=3为微博配图相册
                        if(data.data.album_list[i].type == 3){
                            album_id = data.data.album_list[i].album_id;
                        }
                        // console.log(data.data.album_list[i])
                    }
                    get_album();
                }
            }
        });
    }
    // 获取相册图片
    function get_album(page=1){
        $(".ls_next_page").text('加载中...').addClass("ls_disable");
        var album_url = 'http://photo.weibo.com/photos/get_all?uid='+uid+'&album_id='+album_id+'&count='+count+'&page='+page+'&type='+type; // 根据相册ID获取相册图片
        if(uid && album_id){
            GM_xmlhttpRequest({
                method: 'GET',
                url: album_url,
                onload: response => {
                    if (response.status == 200) {
                        $(".ls_next_page").text('下一页').removeClass("ls_disable");
                        var data = JSON.parse(response.responseText);
                        // 分页
                        insert_page(data.data.total);
                        //console.log(data.data.photo_list)
                        sort_data(data.data.photo_list,function(data){
                            //console.log(data)
                            insert_dom(data)
                        });
                    }
                }
            });
        }
    }
    // 插入分页数据
    function insert_page(total){
        // 计算总页数
        total_page = Math.ceil(total/count);
        $(".ls_total").html('图片总数:'+total);
        $(".ls_total_page").html('总页数:'+total_page);
        $(".ls_current_page").html('当前页数:'+page);
    }
    // 下一页
    $(".ls_page").on("click",".ls_next_page",function(){
        if($(this).hasClass("ls_disable"))
            return !1;
        if(page >= total_page){
            $(this).addClass("ls_disable")
            return !1;
        }
        page+=1;
        if(page > 1){
            $(".ls_prev_page").removeClass("ls_disable")
        }
        get_album(page);
    })
    // 上一页
    $(".ls_page").on("click",".ls_prev_page",function(){
        if(page <= 1)
            return !1;
        page-=1;
        get_album(page);
        if(page <= 1){
            $(this).addClass("ls_disable")
        }
    })
    // 数据重新组装
    function sort_data(data,callback){
        //console.log(data)
        var new_data = [];
        var dest = {};
        var k = 0;
        var len = data.length;
        for(var i = 0; i < len; i++){
            var ai = data[i];
            if(!dest[ai.feed_id]){
                new_data.push({
                    title: ai.caption_render,
                    feed_id: ai.feed_id,
                    data: [ai.pic_host+'/large/'+ai.pic_name]
                });
                dest[ai.feed_id] = ai;
            }else{
                for(var j = 0; j < new_data.length; j++){
                    var dj = new_data[j];
                    if(dj.feed_id == ai.feed_id){
                        dj.data.push(ai.pic_host+'/large/'+ai.pic_name);
                        break;
                    }
                }
            }
        }
        //console.log(new_data)
        post_data = new_data;
        callback(new_data);
    }
    // 插入面板
    function insert_dom(data){
        //console.log(data)
        var html = '';
        for (var i=0;i<data.length;i++){
            html += '<div class="ls_node">';
            html += '<div class="ls_h1">'+data[i].title+' <a href="javascript:;" class="fly" data-index='+i+'>「采集」</a></div>';
            html += '<div class="ls_ul">';
            for (var j=0;j<data[i].data.length;j++){
                // 去除http:
                var url = data[i].data[j].split("http:").join("");
                // 使用小图预览
                var nurl = url.split("/large/").join("/thumb150/");// mw690
                html += '<div class="ls_li"><img alt="'+data[i].title+'" data-original="'+url+'" src="'+nurl+'"></div>';
            }
            html += '</div>';
            html += '</div>';
        }
        $(".ls_node_main").html(html);
        $(".ls_main").animate({
            scrollTop: 0
        })
    }
    // 提交当前采集数据
    $(document).on("click",".fly",function(){
        var index = $(this).attr('data-index');
        var data = post_data[index];
        var avatar = $(".photo_wrap img").attr('src'); // 用户头像
        data.avatar = 'http:'+avatar;
        data.name = $CONFIG['onick']; // 用户名
        data.uid = uid;
        data.source = source;
        data.source_url = 'https://weibo.com/u/'+uid; // 来源url
        data.album_id = album_id;
        console.log(data);
        if(post_url){
            GM_xmlhttpRequest({
                method: 'POST',
                url: post_url,
                dataType: "json",
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                onload: response => {
                    // 服务器返回信息处理
                    console.log(response.response);
                    if (response.status == 200) {
                        // TODO
                    }
                }
            });
        }
    })
})();