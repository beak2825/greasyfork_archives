// ==UserScript==
// @name         新氧自动评论
// @namespace    http://yoki.me/
// @version      0.1
// @description  新氧首页推荐文章自动评论
// @author       yoki
// @require     https://code.jquery.com/jquery-1.9.0.min.js
// @include      http://www.soyoung.com/
// @match        *://www.soyoung.com/?cityId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371263/%E6%96%B0%E6%B0%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371263/%E6%96%B0%E6%B0%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

function addStyle(css) { //添加CSS的代码--copy的
    var pi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
}

window.setTimeout(function(){
    'use strict';
     //评论间隔时间
    var tTime=5000;
    // 预定义的评论内容,可按照格式自行添加,注意最后一行后面没有逗号
    var contentPL=new Array(
        "真的很美，好喜欢",
        "效果好棒啊，恢复的越来越自然",
        "赞一个，医生技术不错，做出了效果",
        "做的真不错啊，羡慕"
    );
    var cityId = $('#searchedCity').data('city') //获取选择的城市id
    var dataUrl = [
        'http://www.soyoung.com/site/TabGroupDatas?index=0&range=20&tabtype=0&cityId='+cityId,
        'http://www.soyoung.com/site/TabGroupDatas?index=1&range=20&tabtype=0&cityId='+cityId,
        'http://www.soyoung.com/site/TabGroupDatas?index=2&range=20&tabtype=0&cityId='+cityId,
        'http://www.soyoung.com/site/TabGroupDatas?index=3&range=20&tabtype=0&cityId='+cityId,
        // 'http://www.soyoung.com/site/TabGroupDatas?index=4&range=20&tabtype=0&cityId='+cityId
    ]
    var queueList = [];  //首页推荐文章列表
    var nb = 0;
    var comp = false;
    // css
    var  csdnHelperCss=document.createElement('style');
    csdnHelperCss.type='text/css';
    $(csdnHelperCss).html('.popWindow{position:fixed;z-index:10000;top:10px;left:10px; background-color:#000;color:#fff;padding:5px;text-align:center;}.popWindow>span{display:block;color:cyan;background-color:#555;margin:5px 0 0 0;padding: 3px;} #xyPinglun{display:block;background-color:darkblue; padding:5px; margin: 10px 5px; border-radius:5px; color:#fff;}#xyPinglun:hover{background-color:blue}#xyNb{color: red;padding:0 5px}');
    $('body').prepend('<div class="popWindow"><h2>新氧自动评论</h2><a id="xyPinglun" href="javascript:void(0)" style="display:none">开始评论</a><span id="wating">正在抓取数据，请稍等</span></div>');
    $('body').prepend(csdnHelperCss);

    //start 循环获取4组数据
    $.each(dataUrl,function(i,v){
        var url = v;
        var sum = i;
        setTimeout(function(){
            list(url,sum);
        },i*3000);
        if(i == dataUrl.length - 1) {
            return false;
        }
    });

    $('#xyPinglun').click(function(){
        $(this).hide();
        pinglun()
    });

    function pinglun(){
        $.each(queueList,function(i,v){
            var id = v
            setTimeout(function(){
                post(id);
            },i*tTime);
        });
    }

    // 显示消息
    function popWindow(str,delayTime){
        var obj = $('.popWindow').append('<span>'+str+'</span>').children().last();
        if(delayTime>0)
            obj.delay(delayTime).hide(1500,function(){$(this).remove();});
    }

    //获取评论页面列表
    function list(url,sum){
        $.ajax({
            type:'GET',
            url:url,
            dataType:'JSON',
            success:function(data){
                var dataObj = data.feed;
                $.each(dataObj, function(index, item){
                    if (item['diary'] != undefined) {
                        var src = item['diary'].post_id
                        queueList.push(src)
                    }
                 });
                if (sum == dataUrl.length - 1) {
                    $('#wating').hide();
                    $('#xyPinglun').show();
                    popWindow('待评论文章<i id="xyNb">'+ queueList.length + '</i>条',0)
                    console.log(queueList)

                }
            }
        })
    }

    // 发送评论
    function post(id){
        $.ajax({
            type:"post",
            url:"http://www.soyoung.com/post/pub_reply?act=pub",
            data:{
                "post_id":id,
                "reply_content":contentPL[Math.round(Math.random()*(contentPL.length-1))],
            },
            success:function(res){
                nb++
                $('#xyNb').text(queueList.length - nb)
                console.log(id + '已完成')
                popWindow(id + '已完成',3000)
            }
        });
    }
}, 3000);