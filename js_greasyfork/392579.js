// ==UserScript==
// @name 学堂在线助手
// @namespace http://tampermonkey.net/
// @version 0.5
// @description 学堂在线助手。支持视频自动顺序播放、后台播放。
// @author wang0.618@qq.com
// @match https://*.xuetangx.com/lms*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392579/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392579/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hashs = window.location.hash.split('/');
    if(hashs[1]!='video') return;

    var $ = jQuery;

    // 去除后台检测
    window.onblur = function(){};
    $('#video').click();
    setTimeout(function(){ window.onblur = function(){};}, 1000);

    // 视频自动播放
    $('#video').attr('autoplay', 'autoplay');
    setInterval(function(){ $('#video')[0].play(); }, 1000);

    // 周期性检查视频卡住
    setInterval(check_stuck, 60000);

    var items = []; // parent_id, item_id
    var next ;

    do_ajax(5);

    // 检测视频卡住
    var last_timestr = '';
    var stuck_cnt = 0;
    function check_stuck(){
        if($('.xt_video_player_current_time_display').text()!=last_timestr){
            stuck_cnt++;
            last_timestr = $('.xt_video_player_current_time_display').text();
        }else{
            stuck_cnt = 0;
        }
        if (stuck_cnt>=3)
            window.location.reload();
    }

    function do_ajax(retry_cnt){
        $.ajax({
            url: "/lms/api/v1/course/"+hashs[2]+"/courseware/",
            data: JSON.stringify({class_id:hashs[3]}),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'post',
            error:function(){
                console.log('error in ajax');
                if(retry_cnt>0)
                    setTimeout(function(){ do_ajax(retry_cnt-1); }, 3000);
                else
                    setTimeout(window.location.reload, 3000);
            },
            success: ajax_success_callback
        });
    }

    function ajax_success_callback(data){
        console.log(data);
        data = data.data;
        for(var i=0;i<data.length;i++){
            if (!data[i].children)
                continue
            for(var j=0;j<data[i].children.length;j++){
                var curr = data[i].children[j];
                // console.log(curr);
                for(var idx=0;curr.items && idx<curr.items.length;idx++){
                    items.push([curr.parent_id, curr.items[idx].item_id]);
                }
            }
        }
        // console.log(items);
        for(var i=0;i<items.length-1;i++){
            if(items[i][1]==hashs[5]){
                next=items[i+1];
                break;
            }
        }

        hashs[5] = next[1];
        hashs[4] = next[0];
        var next_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${hashs.join('/')}`;
        console.log('next', next, next_url);


        $("#video").on("ended", function(){
            console.log('current video ended');
            if(!next)
                alert("列表播放完毕");
            else
                setTimeout(function(){
                    window.location.href = next_url;
                    console.log(window.location.href);
                    window.location.reload();
                }, 10000);
        });
    }
})();