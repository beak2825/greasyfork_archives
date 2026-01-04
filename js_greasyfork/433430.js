// ==UserScript==
// @name         集溪教育学习助手
// @icon         https://ftp.bmp.ovh/imgs/2021/04/827c720b3f24eaf6.jpg
// @namespace    saltfish
// @version      1.0
// @description  集溪教育全自动刷课刷题；视频进度条、习题答案显示
// @author       一条咸鱼
// @match        https://rq.qhdjxjy.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/433430/%E9%9B%86%E6%BA%AA%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433430/%E9%9B%86%E6%BA%AA%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // Your code here...
    //初始化
    //初始化参数
    var list = GM_getValue('list');//课程列表
    var shuake = GM_getValue('shuake');//是否开启刷课
    var shuati = GM_getValue('shuati');//是否开启刷题
    var nowspeed = GM_getValue('nowspeed');//刷课进度
    var tnowspeed = GM_getValue('tnowspeed');//刷题进度
    var pathname = window.location.pathname;//当前路径
    var search = window.location.search;//携带参数
    //判断为空则初始化
    if(shuake == undefined || shuake == null){
         GM_setValue('shuake', false);
         shuake = false;
    }
    if(shuati == undefined|| shuati == null){
         GM_setValue('shuati', false);
         shuati = false;
    }
    if(nowspeed == undefined || shuake == null){
         GM_setValue('nowspeed', 0);
         nowspeed = 0;
    }
    if(tnowspeed == undefined|| shuati == null){
         GM_setValue('tnowspeed', 0);
         tnowspeed = 0;
    }
    if(list == undefined|| list == null){
         GM_setValue('list', []);
         list = [];
    }
    //判断刷课/刷题是否完成
    if(tnowspeed >= list.length && list.length > 0){
        GM_setValue('shuati', false);
        GM_setValue('tnowspeed',0);
        GM_setValue('list',undefined);
        alert("刷题完成，将自动清除缓存，返回首页");
        window.location.href='https://rq.qhdjxjy.com/index.php/grade/default/index.html';
    }
    if(nowspeed >= list.length && list.length > 0){
        GM_setValue('shuake', false);
        GM_setValue('nowspeed',0);
        GM_setValue('list',undefined);
        alert("刷课完成，将自动清除缓存，返回首页");
        window.location.href='https://rq.qhdjxjy.com/index.php/grade/default/index.html';
    }

    //页面
    //课程总页面
    if(pathname=="/index.php/grade/default/courseware-detail.html"){
        //获取课件列表
        $.ajax({url:"https://rq.qhdjxjy.com/index.php/grade/default/ajax-courseware-list.html"+search+"&page=1&limit=500",success:function(result){
            result = new Function("return" + result)();
            if(result.code == 0){
                GM_setValue('list', result.data);
            }
        }});
        //获取是否刷课
        if(nowspeed < list.length && shuake){
            setTimeout (function(){
                window.location.href="https://rq.qhdjxjy.com/index.php/grade/default/checkface.html"+window.location.search+"&courseware_id="+list[nowspeed].id;
            },3000);
        }
        //获取是否刷题
        if(tnowspeed < list.length && shuati){
            setTimeout (function(){
                window.location.href="https://rq.qhdjxjy.com/index.php/course/default/checkface.html"+window.location.search+"&courseware_id="+list[tnowspeed].id;
            },3000);
        }
        //刷课刷题按钮
        var stat = "";var statt = "";
        if(shuake){stat = '停止';}else{stat = '开始';}
        if(shuati){statt = '停止';}else{statt = '开始';}
        var htmlText = '<input type="button" id="shuake" class="layui-btn layui-btn-lg" value="'+stat+'刷课">';
        $('#main-content').append(htmlText);
        htmlText = '<input type="button" id="shuati" class="layui-btn layui-btn-lg layui-btn-normal" value="'+statt+'刷题">';
        $('#main-content').append(htmlText);
        htmlText = '<input type="button" id="huancun" class="layui-btn layui-btn-lg layui-btn-warm" value="清除缓存">';
        $('#main-content').append(htmlText);
        //按钮点击事件
        $('#shuake').click(function(){
            if(!shuake == true){
                var input=prompt("请输入开始节数",nowspeed+1);
                if (input!=null && input!="")
                {
                    GM_setValue('nowspeed',input-1);
                    GM_setValue('shuake', !shuake);
                }
            }else{
                GM_setValue('shuake', !shuake);
            }
            alert("收到");
            location.reload();
        });
        $('#shuati').click(function(){
            if(!shuati == true){
                var input=prompt("请输入开始节数",tnowspeed+1);
                if (input!=null && input!="")
                {
                    GM_setValue('tnowspeed',input-1);
                    GM_setValue('shuati', !shuati);
                }
            }else{
                GM_setValue('shuati', !shuati);
            }
            alert("收到");
            location.reload();
        });
        $('#huancun').click(function(){
            GM_setValue('shuake', false);
            GM_setValue('shuati', false);
            GM_setValue('nowspeed',0);
            GM_setValue('tnowspeed',0);
            GM_setValue('list',undefined);
            alert("成功");
        });
    };
    //视频人脸验证
    if(pathname=="/index.php/grade/default/checkface.html"){
        //添加跳过认证按钮
        var texta = '<a id="skip" href="/index.php/grade/default/video.html'+search+'" class="btn btn-warning m-b-10 m-l-5">跳过认证</a>';
        $('#snap').after(texta);
        //判断是否开启刷课，自动验证人脸并隐藏按钮防止出错
        if(shuake){
            $('#snap').hide();
            setInterval (function(){
                snap();
            },3000);
        }
    }
    //视频课程页面
    if(pathname=="/index.php/grade/default/video.html"){
        //初始化
        var video = document.getElementById('video');
        var speed = 0.3;
        var time = 0;
        //开启进度条
        video.controls = true;
        //判断是否开启刷课
        if(shuake){
            //定时执行人脸验证
            setInterval (function(){
                if(speed < 0.95){
                    snap();
                }
            },3000);
            //监听视频加载
            video.addEventListener('loadedmetadata',function(){ //加载完成执行的函数
                time = video.duration;//获取视频时长
                //自动调整视频进度
                if(time > 0){
                    var jump = parseInt(time * speed);
                    video.startTime = jump;
                    video.currentTime = jump;
                }
                setTimeout(function () {
                    layer.close(layer.index);
                }, 1000);
            });
            video.addEventListener('play', function () { //播放开始执行的函数
                //重载以触发进度调整
                video.load();
                //判断进度，
                if(time > 0){
                    //跳转到下个记录点
                    if(speed < 0.8){
                        speed = speed + 0.3;
                    }else if(speed < 0.95){
                        speed = 1;
                        video.play();
                    }else{
                        //完成则退出
                        video.pause();
                        GM_setValue('nowspeed', nowspeed+1);
                        setTimeout(function () {//延时以等待进度发送完毕
                            history.go(-2);
                        }, 2000);
                    }
                }

            });
            //video.addEventListener('pause', function () { //播放暂停执行的函数
            //});
        }
    }
    //习题人脸验证
    if(pathname=="/index.php/course/default/checkface.html"){
        //添加跳过认证按钮
        var textb = '<a id="skip" href="/index.php/course/default/exercise-list.html'+search+'" class="btn btn-warning m-b-10 m-l-5">跳过认证</a>';
        $('#snap').after(textb);
        //判断是否开启刷题，自动验证人脸并隐藏按钮防止出错
        if(shuati){
            $('#snap').hide();
            setInterval (function(){
                snap();
            },3000);
        }
    }
    //习题页面
    if(pathname=="/index.php/course/default/exercise-list.html"){
        //显示答案及判断结果
        $(".answer_hidden").each(function(){
            $(this).show();
        });
        //判断是否开启刷题
        if(shuati){
            //所有大体结果改为正确
            $(".answer_right").each(function(){
                $(this).val("正确");
            });
            //延时触发提交，防止出错
            setTimeout(function () {
                $('#button').trigger("click");
            }, 3000);
            //延时触发后退，防止出错
            setTimeout(function () {
                GM_setValue('tnowspeed', tnowspeed+1);
                history.go(-2);
            }, 6000);
        }else{
            //初始化，获取全局变量
            var qlist = GM_getValue('list');
            var indexes = 0;
            var data = search.split('=');
            //获取当前题目索引（若刷题过程中更新，将不准确）
            for(var j=0; j<qlist.length;j++){
                if(qlist[j].id == data[3])indexes = j;
            }
            //添加上一节，下一节按钮
            var div = '<div id="last-next" style="width:210px;margin-left:-50px;padding-bottom:10px"></div>';
            $('#button').after(div);
            var last = "";
            if(indexes > 0){
                last = '<a id="last" href="/index.php/course/default/checkface.html'+data[0]+'='+data[1]+'='+data[2]+'='+qlist[indexes-1].id+'" class="layui-btn layui-btn-lg layui-btn-normal">上一节</a>';
            }else{
                last = '<a id="last" href="/" class="layui-btn layui-btn-lg  layui-btn-disabled" style="background-color:#7bc3f9!important">上一节</a>';
            }
            var next = "";
            if(indexes < qlist.length){
                next = '<a id="next" href="/index.php/course/default/checkface.html'+data[0]+'='+data[1]+'='+data[2]+'='+qlist[indexes+1].id+'" class="layui-btn layui-btn-lg layui-btn-normal">下一节</a>';
            }else{
                next = '<a id="next" href="/" class="layui-btn layui-btn-lg layui-btn-disabled" style="background-color:#7bc3f9!important">下一节</a>';
            }
            $('#last-next').append(last);
            $('#last-next').append(next);
        }

    }
})();