// ==UserScript==
// @name         微博超级话题签到
// @namespace    https://www.kindjeff.com/
// @version      2017.1.20
// @description  在网页端自己的微博主页，把自己关注的超级话题一键全部签到。注意：只能在自己的个人主页签到。
// @author       kindJeff
// @match        http://weibo.com/*
// @match        http://www.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26293/%E5%BE%AE%E5%8D%9A%E8%B6%85%E7%BA%A7%E8%AF%9D%E9%A2%98%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/26293/%E5%BE%AE%E5%8D%9A%E8%B6%85%E7%BA%A7%E8%AF%9D%E9%A2%98%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function get_topic_hash(response_text, page, user_id){
        // 从响应文本中解析出话题名称和 hash
        /* 参数: 
            response_text: 待解析的文本
            page: 当前页号，用来得到下一页的链接
            user_id: 用户ID
        */
        var result = {};
        var hash_start_index, name_start_index, name_end_index, name, hash;

        var name_index = response_text.indexOf('screen_name=');
        while(name_index != -1){
            // 循环得到 response_text 的话题名和 hash
            name_start_index = name_index + 12;
            name_end_index = response_text.indexOf('&', name_index);
            name = response_text.slice(name_start_index, name_end_index);
            hash = response_text.slice(name_index-56,name_index-56+38);
            result[name] = hash;
            name_index = response_text.indexOf('screen_name=', name_index + 100);
        }
        var next_index = response_text.indexOf('page next', name_end_index);
        if(next_index!==-1 && response_text.indexOf("Pl_Official_RelationInterested__95_page", next_index)!==-1){
            // 如果下一页链接可点，递归解析下一页的内容，并拼接到 result 里
            page += 1;
            var url = 'http://weibo.com/p/'+user_id+'/myfollow?pids=Pl_Official_RelationInterested__95&cfs=600&relate=interested&Pl_Official_RelationInterested__95_page='+page+'&ajaxpagelet=1&ajaxpagelet_v6=1&__ref=%2Fp%2F'+user_id+'%2Fmyfollow%3Frelate%3Dinterested%23place';
            var xhr_temp = new XMLHttpRequest();
            xhr_temp.open("GET", url, false);
            xhr_temp.send();
            var result_next_page = get_topic_hash(xhr_temp.responseText, page, user_id);
            Object.assign(result, result_next_page);
        }
        return result;
    }

    function sign(one_hash, name, retry_time){
        // 签到
        /* 参数:
            one_hash: 话题的 hash ，用来签到
            name: 话题的名称，用来交给 log_result 函数来显示
            retry_time: 重试的次数，用来决定是否终止
        */
        var xmlhttp_sign = new XMLHttpRequest();
        var s1 = "http://weibo.com/p/aj/general/button";
        var s2 = "?ajwvr=6&api=http://i.huati.weibo.com/aj/supercheckin&texta=%E7%AD%BE%E5%88%B0&textb=%E5%B7%B2%E7%AD%BE%E5%88%B0&status=0&id=";
        var url = s1 + s2 + one_hash + "&location=page_100808_super_index";
        xmlhttp_sign.open("GET", url, true);

        var re_sign = function(info){
            // 重新签到函数
            /* 参数:
                info: 出错信息，用来交给 log_error 函数输出
            */
            if(retry_time===undefined)
                retry_time = 0;
            retry_time += 1;

            if(retry_time<=5){
                log_error(name, '正在第 '+retry_time+' 次重试', info);
                setTimeout(sign, retry_time*retry_time*500, one_hash, name, retry_time);
            }else{
                log_error(name, '重试超过次数限制', info);
            }
        };

        // 弃用的部分，超时的处理
        // xmlhttp_sign.timeout = 7500;
        // xmlhttp_sign.ontimeout = function(){
        //     re_sign('签到超时');
        // };

        xmlhttp_sign.onreadystatechange = function(){
            if(xmlhttp_sign.readyState==4 && xmlhttp_sign.status==200){
                // 成功响应的时候
                var sign_result_str = xmlhttp_sign.responseText;
                var sign_result_obj = JSON.parse(sign_result_str);    // 把响应文本解析成 JSON
                var info = sign_result_obj['data']['alert_title'];    // 签到成功时，sign_result_obj.data.alert_title 是“今日签到 第X名”
                if(sign_result_obj['code']=='100000'){
                    // sign_result_obj.code 为 100000 时表示签到成功
                    log_result(name, info);
                }else{
                    re_sign(sign_result_obj['msg']);
                }
            }
        };

        xmlhttp_sign.onerror = function(){
            re_sign('签到出错');
        };

        xmlhttp_sign.send();
    }

    function log_error(name, error_result, error_info){
        console.log('出错: ', name, error_result, '出错信息: ', error_info, (new Date()));
    }

    function log_result(name, result){
        console.log(name, result);
    }

    function get_and_sign(retry_time){
        // 获得所有话题并且签到
        /* 参数:
            retry_time: xmlhttp_get_list 请求的重试次数
        */
        var user_id = document.getElementsByClassName('tab_link')[0].href.split('/')[4];    // 从“我的主页”按钮的链接获得用户 ID
        var xmlhttp_get_list = new XMLHttpRequest();

        xmlhttp_get_list.open('GET', 'http://weibo.com/p/'+user_id+'/myfollow?relate=interested&pids=plc_main&ajaxpagelet=1&ajaxpagelet_v6=1&__ref=%2Fp%2F'+user_id+'%2Fmyfollow%3Frelate%3Dinterested%23place', true);

        xmlhttp_get_list.onreadystatechange = function(){
            if(xmlhttp_get_list.readyState==4 && xmlhttp_get_list.status==200){
                // 成功响应的时候
                var topic_hash = get_topic_hash(xmlhttp_get_list.responseText, 1, user_id);    // 获得所有话题
                for(var name in topic_hash){
                    sign(topic_hash[name], name);
                }
                var s_b = document.getElementById("super_sign");
                s_b.innerText = "按F12看结果";
            }
        };

        xmlhttp_get_list.onerror = function(){
            // 出错重试
            if(retry_time===undefined)
                retry_time = 0;
            retry_time += 1;

            if(retry_time<=5){
                setTimeout(get_and_sign, retry_time*retry_time*500, retry_time);
            }else{
                console.log('爬取话题出错', (new Date()));
            }
        };

        xmlhttp_get_list.send();
    }


    function main(){
        // 插入“超级话题签到”按钮函数
        var sign_block = document.createElement('li');
        sign_block.setAttribute('id', 'super_sign');
        sign_block.innerText="超级话题签到";
        sign_block.onmouseover = function(){sign_block.style.color='red';};
        sign_block.onmouseout = function(){sign_block.style.color='black';};

        sign_block.onclick = function(){
            if(document.getElementsByClassName('tab_link').length!==0 && document.getElementsByClassName('tab_link')[0].innerText=="我的主页"){
                sign_block.innerText="正在签到...";
                get_and_sign();
                sign_block.onclick='';
                sign_block.onmouseover='';
                sign_block.onmouseout='';
            }else{
                window.location = '/profile';
            }
        };
        var the_con = document.getElementsByClassName('gn_nav_list')[0];
        var game = document.getElementsByClassName('gn_nav_list')[0].children[3];
        the_con.removeChild(game);
        the_con.appendChild(sign_block);
    }

    var init_func = function(){
        setTimeout(main, 3000);
    };

    if (document.readyState != 'loading'){
        init_func();
    }else{
        document.addEventListener('DOMContentLoaded', init_func);
    }
})();