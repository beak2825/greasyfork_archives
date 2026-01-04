// ==UserScript==
// @name         云班课视频秒刷助手
// @namespace    https://github.com/52beijixing/ybk
// @version      1.0.0
// @description  助力云班课视频学习，让你更快完成学习与学业！
// @author       52beijixing
// @match        https://www.mosoteach.cn/web/index.php?c=res&m=index&clazz_course_id=*
// @icon         https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445382/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%A7%86%E9%A2%91%E7%A7%92%E5%88%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445382/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%A7%86%E9%A2%91%E7%A7%92%E5%88%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL获取对应参数函数
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
    // 获取url中的课程id
    var clazz_course_id = getQueryVariable("clazz_course_id");

    // 获取视频定位及个数
    var video = $('div[data-mime=video]');
    var length = video.length;

    // 定位
    var body = document.getElementById("cc-main");
    // 新建设置内容和样式
    var set_up = document.createElement("div");
    body.appendChild(set_up);
    set_up.id = "set_up";
    set_up.title = "设置";
    set_up.style = 'position:fixed;left:0px;bottom:100px;';
    set_up.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" height="32" width="32" viewBox="0 0 1024 1024" style="width: 32px; height: 32px;"><path d="M642.2272 922.17856h-0.01024c-15.80032 0-31.16032-6.53312-41.07776-17.47968-13.52192-14.8224-56.35072-53.36064-91.40736-53.36064-34.816 0-78.30528 38.7584-90.79296 52.34176-9.90208 10.76224-25.14944 17.18272-40.80128 17.18272-7.45472 0-14.4896-1.42848-20.9152-4.25472l-1.12128-0.49152-106.56256-59.59168-1.05984-0.7424c-19.39968-13.57824-26.7776-40.1408-17.17248-61.77792 0.0768-0.16896 9.8304-22.67648 9.8304-43.20256 0-62.27968-50.66752-112.95232-112.95744-112.95232h-3.77344l-0.6912 0.01024c-17.83808 0-32.36352-15.85152-37.00736-40.38144-0.36864-1.96096-9.09312-48.4864-9.09312-85.14048s8.71936-83.17952 9.088-85.1456c4.70016-24.84224 19.54304-40.79616 37.69856-40.36608h3.77344c62.2848 0 112.95744-50.67264 112.95744-112.95744 0-20.52096-9.74848-43.01824-9.85088-43.24352-9.6-21.62688-2.17088-48.1792 17.31072-61.7216l1.10592-0.76288 112.4608-61.76768 1.17248-0.49664c6.32832-2.69824 13.26592-4.0704 20.61312-4.0704 15.61088 0 30.89408 6.28736 40.8832 16.80896 13.312 13.93664 55.38304 50.18112 89.44128 50.18112 33.73056 0 75.54048-35.52256 88.81152-49.21856 9.92768-10.31168 25.10336-16.4864 40.57088-16.4864 7.49568 0 14.56128 1.41312 20.992 4.21376l1.14176 0.49664 108.6208 60.34432 1.07008 0.74752c19.4304 13.56288 26.8288 40.12544 17.21344 61.78304-0.0768 0.16384-9.82528 22.67136-9.82528 43.19744 0 62.27968 50.66752 112.95744 112.95232 112.95744h3.77856c18.12992-0.40448 32.98816 15.52384 37.68832 40.36608 0.36864 1.96096 9.09312 48.4864 9.09312 85.1456 0 36.64896-8.72448 83.17952-9.09312 85.14048-4.70016 24.84224-19.5584 40.73984-37.69344 40.3712h-3.77344c-62.27968 0-112.95232 50.66752-112.95232 112.95232 0 20.52096 9.74848 43.01824 9.84576 43.24352 9.59488 21.6064 2.18624 48.16384-17.26464 61.7216l-1.09056 0.75264-110.44864 61.05088-1.152 0.49664c-6.31808 2.72896-13.23008 4.10624-20.52608 4.10624z m-3.36384-52.03456c0.49664 0.32256 1.88928 0.87552 3.3536 0.87552l0.16384-0.00512 103.1936-57.0368c-2.48832-5.79072-13.88544-33.8688-13.88544-63.16544 0-87.6032 69.00736-159.40608 155.51488-163.89632 1.24416-6.87616 8.00256-45.54752 8.00256-74.56768 0-29.01504-6.7584-67.67616-8.00256-74.56256-86.50752-4.49536-155.51488-76.288-155.51488-163.90144 0-29.33248 11.42784-57.45664 13.9008-63.19616l-101.51936-56.40704c-0.11264-0.00512-0.26112-0.01536-0.41984-0.01536-1.73056 0-3.34848 0.62976-3.88608 0.99328-1.70496 1.75104-16.41984 16.67072-37.5552 31.5392-31.28832 22.016-60.88192 33.17248-87.94112 33.17248-27.33568 0-57.15968-11.38176-88.64768-33.82784-21.26336-15.1552-36.04992-30.36672-37.75488-32.14336-0.5376-0.36864-2.176-1.01888-3.92192-1.01888l-0.36352 0.01024-105.14944 57.7536c2.51904 5.8624 13.87008 33.8944 13.87008 63.13472 0 87.6032-69.00736 159.40096-155.51488 163.89632-1.24416 6.88128-8.00256 45.54752-8.00256 74.56768 0 29.00992 6.7584 67.67104 8.00768 74.56768 86.50752 4.49024 155.50976 76.28288 155.50976 163.8912 0 29.39392-11.4688 57.56928-13.91104 63.23712l99.52256 55.64928 0.22016 0.00512c1.45408 0 2.83136-0.53248 3.31776-0.84992 1.85856-2.00192 16.73216-17.73056 38.13376-33.41824 31.91296-23.38816 62.24384-35.2512 90.1376-35.2512 28.16512 0 58.7264 12.0832 90.82368 35.92192 21.53984 15.99488 36.46464 32.0256 38.31808 34.048z" fill="#4E8CEE"></path><path d="M505.28768 338.5344c-98.46784 0-178.5856 80.11264-178.5856 178.5856s80.11264 178.5856 178.5856 178.5856S683.8784 615.58784 683.8784 517.12s-80.11776-178.5856-178.59072-178.5856z m0 300.06272c-64.9728 0-121.49248-56.4992-121.49248-121.47712s56.51456-121.49248 121.49248-121.49248c64.97792 0 121.48224 56.51456 121.48224 121.49248s-56.4992 121.47712-121.48224 121.47712z" fill="#4E8CEE"></path><path d="M505.28768 394.41408c-64.9728 0-122.71104 57.73312-122.71104 122.70592s57.73312 122.68544 122.71104 122.68544c64.97792 0 122.69056-57.70752 122.69056-122.68544s-57.70752-122.70592-122.69056-122.70592z" fill="#BAD4FF"></path></svg>';
    // 新建刷课内容和样式
    var div = document.createElement("div");
    body.appendChild(div);
    div.className = "miaoshuazhushou";
    div.style = "display:none;position:fixed;padding:40px 0;background-color:white;font-size:14px;border-radius: 5px;background: #e0e0e0;box-shadow:  20px 20px 60px #bebebe,-20px -20px 60px #ffffff;width:100%;height:100%;margin:0 auto;top:100px;overflow:auto;";
    // 新建提示内容和样式
    var alert = document.createElement("div");
    body.appendChild(alert);
    alert.style = 'position:fixed;right:40px;bottom:20px;';


    //判断是否有视频
    if(length == 0){
        //没有视频，就提示无视频
        div.innerHTML = '<h1 style="text-align:center;margin:40px 0;">云班课视频秒刷助手</h1><p>未获取到视频！</p><div id="ybk_no" style="position: absolute;top:20px;right:50px;" title="关闭"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 1024 1024" style="width: 32px; height: 32px;"><path d="M913.15 260.51a480.53 480.53 0 0 0-203.8-174 40 40 0 0 0-32.92 72.91C819.53 224.06 912 367.23 912 524.19c0 220.56-179.44 400-400 400s-400-179.44-400-400c0-157 92.47-300.14 235.57-364.75a40 40 0 0 0-32.92-72.91 480 480 0 1 0 598.5 174z" fill="#FF8429"></path><path d="M172.06 524.19a15 15 0 1 0-30 0 369.94 369.94 0 1 0 739.88 0 369 369 0 0 0-120.59-273.27 15 15 0 1 0-20.23 22.16 340.79 340.79 0 0 1 110.82 251.11c0 187.44-152.5 339.94-339.94 339.94S172.06 711.64 172.06 524.19z" fill="#FF8429"></path><path d="M692.89 218.75m-15 0a15 15 0 1 0 30 0 15 15 0 1 0-30 0Z" fill="#FF8429"></path><path d="M512 595.26a40 40 0 0 0 40-40V59.81a40 40 0 0 0-80 0v495.45a40 40 0 0 0 40 40z" fill="#00CEDD"></path></svg></div>';
    }else{
        div.innerHTML = '<h1 style="text-align:center;margin:40px 0;">云班课视频秒刷助手</h1><div id="ybk_no" style="position: fixed;top:20px;right:50px;" title="关闭"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 1024 1024" style="width: 32px; height: 32px;"><path d="M913.15 260.51a480.53 480.53 0 0 0-203.8-174 40 40 0 0 0-32.92 72.91C819.53 224.06 912 367.23 912 524.19c0 220.56-179.44 400-400 400s-400-179.44-400-400c0-157 92.47-300.14 235.57-364.75a40 40 0 0 0-32.92-72.91 480 480 0 1 0 598.5 174z" fill="#FF8429"></path><path d="M172.06 524.19a15 15 0 1 0-30 0 369.94 369.94 0 1 0 739.88 0 369 369 0 0 0-120.59-273.27 15 15 0 1 0-20.23 22.16 340.79 340.79 0 0 1 110.82 251.11c0 187.44-152.5 339.94-339.94 339.94S172.06 711.64 172.06 524.19z" fill="#FF8429"></path><path d="M692.89 218.75m-15 0a15 15 0 1 0 30 0 15 15 0 1 0-30 0Z" fill="#FF8429"></path><path d="M512 595.26a40 40 0 0 0 40-40V59.81a40 40 0 0 0-80 0v495.45a40 40 0 0 0 40 40z" fill="#00CEDD"></path></svg></div>';
        //有视频，就将内容显示出来，由用户点击执行对应视频秒刷任务
        for(let i = 0; i < length; i++){
            //获取课件id
            var dumtId = video[i].getAttribute("data-value");
            //获取课件名称
            var dumtName = video[i].childNodes[11].childNodes[1].childNodes[1].textContent;
            //获取时间
            var time = video[i].childNodes[11].childNodes[3].childNodes[9].textContent;
            //添加内容
            var videoDiv = document.createElement("div");
            div.appendChild(videoDiv);
            videoDiv.class = dumtId;

            //背景颜色
            if(i % 2 == 0){
                videoDiv.style = "width:60%;min-width:1000px;margin:20px auto;padding:10px 20px;height:40px;background:#bdd7ee;"
            }else{
                videoDiv.style = "width:60%;min-width:1000px;margin:20px auto;padding:10px 20px;height:40px;background:#ddebf7;"
            }
            videoDiv.innerHTML = '<div id="name'+dumtId+'" style="width:50%;float:left;line-height:40px;text-overflow: ellipsis;">'+dumtName+'</div><div id="dumt'+dumtId+'" style="width:50%;float:right"><span id= "time'+dumtId+'" style="line-height:40px;width:30%;text-align:right;font-size:8px;color:blue;background:#f6f7f8;padding:10px 20px;border-radius:10px;">视频长度：'+time+'</span><button type="button" id="'+dumtId+'" style="margin:0 10px;width:30%;max-width:80px;min-width:80px;height:40px;border:2px solid white;background-color: #1CCF50;color: white;border-radius:10px;margin-left:40px;">一键刷课</button><button type="button" id="state'+dumtId+'" style="margin:0 10px;width:30%;max-width:80px;min-width:80px;height:40px;border:2px solid white;background-color: #1CFF50;color: black;border-radius:10px;">状态查询</button><span id="tt'+dumtId+'" style="width:10%;"></span></div>';


            //点击【一键刷课】按钮事件
            var aDiv=document.getElementById(dumtId);
            aDiv.addEventListener('click', function(){
                //获取点击按钮对应的课件id
                let id = window.event.target.id;
                // 视频观看进度保存的接口URL
                var currentOpenUrl = 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to'
                //获取视频时间和长度
                let video_time = document.getElementById("time"+id).innerText.replace(/[^0-9]/ig,"");
                let video_time_length = video_time.length;
                if(video_time_length == 5){
                    video_time = "0"+video_time;
                }
                let hour = parseInt(video_time.slice(0,2));
                let min = parseInt(video_time.slice(2,4));
                let sec = parseInt(video_time.slice(4));
                let sum = sec + min * 60 + hour * 3600 + 1;
                //发送请求
                let a = $.ajax({
                    url: currentOpenUrl,//json文件位置，文件名
                    data: {
                        "clazz_course_id": clazz_course_id,
                        "res_id": id,
                        "watch_to": sum,
                        "duration": sum,
                        "current_watch_to": sum
                    },
                    type: "POST",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    async: false,
                    success: function(data) {//请求成功完成后要执行的方法
                    }
                });

                // 获取课程状态数据
                let data = a.responseJSON;
                // 一键刷课成功，提示
                if(data == "success"){
                    //获取课程名称
                    let name = document.getElementById("name"+id).innerText;
                    var tt = document.createElement("div");
                    alert.appendChild(tt);
                    tt.style = 'position: fixed;left: 0;top: 20px;right: 0;display: flex;width:400px;margin:0 auto;';
                    tt.innerHTML = '<div style="background: #4550e5;width:400px;margin: 20px 0;padding: 0 10px;height: 40px;box-shadow: 0 0 10px 0 #eee;font-size: 14px;border-radius: 3px;display: flex;align-items: center;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;color:yellow;font-weight:bold;"><b style="color:white;">【刷课成功】</b>'+name+'</div>';
                    setTimeout(function(){
                        tt.innerHTML = '';
                    },10000);
                    setTimeout(function(){
                        tt.parentNode.removeChild(tt);
                    },10000);
                }
            })


            //点击【状态查询】按钮事件
            var state=document.getElementById("state"+dumtId);
            state.addEventListener('click', function(){
                //获取点击按钮对应的课件id
                let id = window.event.target.id;
                id = id.slice(5);
                //获取视频时间和长度
                let video_time = document.getElementById("time"+id).innerText.replace(/[^0-9]/ig,"");
                let video_time_length = video_time.length;
                if(video_time_length == 5){
                    video_time = "0"+video_time;
                }
                // 视频观看进度保存的接口URL
                var currentOpenUrl = 'https://www.mosoteach.cn/web/index.php?c=res&m=get_video_record'

                //发送请求
                let a = $.ajax({
                    url: currentOpenUrl,//json文件位置，文件名
                    data: {
                        "res_id": id
                    },
                    type: "POST",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    async: false,
                    success: function(data) {//请求成功完成后要执行的方法
                    }
                });

                // 获取课程状态数据
                let data = a.responseJSON.data;
                //获取课程名称
                let name = document.getElementById("name"+id).innerText;
                var tt = document.createElement("div");
                alert.appendChild(tt);
                if(data.last_watch_to == null){
                    tt.style = 'position: fixed;left: 0;top: 20px;right: 0;display: flex;width:400px;margin:0 auto;';
                    tt.innerHTML = '<div style="background: #fff;width:400px;margin: 20px 0;padding: 0 10px;height: 40px;box-shadow: 0 0 10px 0 #eee;font-size: 14px;border-radius: 3px;display: flex;align-items: center;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;color:blue;font-weight:bold;"><b style="color:red;">【从未观看】</b>'+name+'</div>';
                    $('#tt'+id)[0].innerHTML = "从未观看";
                    $('#tt'+id)[0].style = 'padding:5px 10px;margin:0 20px;background:white;border-radius:5px;color:red;';
                }else{
                    //输出已观看的时长
                    let last_watch_to = parseInt(data.last_watch_to);
                    let hour = parseInt(last_watch_to / 3600);
                    if(hour < 10){
                        hour = "0"+hour;
                    }
                    let min = parseInt(last_watch_to % 3600 / 60);
                    if(min < 10){
                         min = "0"+min;
                    }
                    let second = parseInt(last_watch_to % 60);
                    if(second < 10){
                        second = "0"+second;
                    }
                    let tt_time = ""+hour+min+second;
                    tt.style = 'position: fixed;left: 0;top: 20px;right: 0;display: flex;width:400px;margin:0 auto;';
                    if(video_time > tt_time){
                        tt.innerHTML = '<div style="background: #fff;width:400px;margin: 20px 0;padding: 0 10px;height: 40px;box-shadow: 0 0 10px 0 #eee;font-size: 14px;border-radius: 3px;display: flex;align-items: center;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;color:blue;font-weight:bold;"><b style="color:red;">【尚未完成】</b>'+name+'</div>';
                        $('#tt'+id)[0].innerHTML = "尚未完成";
                        $('#tt'+id)[0].style = 'padding:5px 10px;margin:0 20px;background:white;border-radius:5px;color:red;';
                    }else{
                        tt.innerHTML = '<div style="background: black;width:400px;margin: 20px 0;padding: 0 10px;height: 40px;box-shadow: 0 0 10px 0 #eee;font-size: 14px;border-radius: 3px;display: flex;align-items: center;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;color:yellow;font-weight:bold;"><b style="color:white;">【已看完】</b>'+name+'</div>';
                        $('#tt'+id)[0].innerHTML = "已经完成";
                        $('#tt'+id)[0].style = 'padding:5px 10px;margin:0 20px;background:black;border-radius:5px;color:white;';
                    }
                }
                setTimeout(function(){
                    tt.innerHTML = '';
                },5000);
                setTimeout(function(){
                    tt.parentNode.removeChild(tt);
                },5000);


            })


        }
    }

    // 关闭，点击隐藏刷课样式
    var ybk_no=document.getElementById("ybk_no");
    ybk_no.addEventListener('click', function(){
        div.style = "display:none;";
        document.documentElement.style.overflow = 'auto';
        $('.back-top-button').fadeIn();
    })

    // 设置，点击显示刷课样式
    set_up.addEventListener('click',function(){
        div.style = "display:block;position:fixed;top:0px;left:0px;font-size:14px;border-radius: 5px;background:rgba(224, 224, 224, 0.9);box-shadow:  20px 20px 60px #bebebe,-20px -20px 60px #ffffff;width:100%;height:100%;overflow:auto;";
        document.documentElement.style.overflow = 'hidden';
        $('.back-top-button').fadeOut();
    })



    // Your code here...
})();