// ==UserScript==
// @name         遵义师范学院继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  遵义师范学院继续教育，自动播放下一个，弹窗屏蔽
// @author       xiajie
// @match        https://zynczj.webtrn.cn/*
// @match        https://zysfxy-kfkc.webtrn.cn/*
// @icon         http://webtrn.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/470577/%E9%81%B5%E4%B9%89%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/470577/%E9%81%B5%E4%B9%89%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //班级详情
    if(window.location.pathname == '/cms/classDetailNew.htm'){
        setTimeout(function(){
            addhtml()
        },1500)
        setInterval(function(){
            if(localStorage.getItem('isLearn') == 'true'){
                //点击刷新列表
                $('#courseStatusAll')[0].click();
                //检测学习进度
                setTimeout(function(){
                    checkProgress();
                },3000);
                var len = courseList.length;
                var endNum = 0;
                for(var i=0;i<len;i++){
                    var progress = parseFloat(courseList[i].totalScore);
                    if(progress == 100){
                        endNum++;
                    }
                }
                var link = window.location.href;
                var classId = getParam(link, 'classId');
                if(localStorage.getItem('learnAll') == 'true' && localStorage.getItem(classId) == 'true'){
                    window.close();
                }
                if(len>0 && len == endNum){
                    localStorage.setItem(classId,true);
                    window.location.reload();
                }else{
                    localStorage.setItem(classId,false);
                }
            }
        },1000*60*3)

        function addhtml(){
            var text = '立即学习';
            if(localStorage.getItem('isLearn') == 'true'){
                text = '学习中';
            }
            var css = "'background:red;cursor: pointer;padding: 5px 10px;color:#fff;display:inline-block;margin-left:20px;height: 30px;line-height: 30px;'";
            var html = "<a id='learnText' style="+css+" onclick='showLearn()'>"+text+"</a>";
            $('#examScore').parent().append(html);
            var css2 = "'background:blue;cursor: pointer;padding: 5px 10px;color:#fff;display:inline-block;margin-left:20px;height: 30px;line-height: 30px;'";
            var html2 = "<a style="+css2+" onclick='cleanLearn()'>暂停学习</a>";
            $('#examScore').parent().append(html2);
        }
        window.showLearn = function(){
            if(window.confirm('是否开始学习课程')){
                console.log('学习进行中');
                localStorage.removeItem('isLearn');
                learnMore();
            }
        }

        window.cleanLearn = function(){
            $('#learnText').text('立即学习');
            localStorage.setItem('isLearn',false);
        }

        window.learnMore = function(){
            console.log('课程学习');
            //是否学习中
            $('#learnText').text('学习中');
            localStorage.setItem('isLearn',true);

            var len = $('#classCourseList li').length;
            for(var i=0;i<len;i++){
                var item = $('#classCourseList li').eq(i);

                var title = item.find('h2 a').attr('title');
                var progress = parseFloat(item.find('.color-theme').text());
                if(progress == 100){
                    continue;
                }else{
                    localStorage.setItem('learnNow',title);
                    item.find('a').last()[0].click();
                    break;
                }
            }
            console.log(i);
            if(i == len){
                goNext();
            }
        }
        window.goNext = function(){
            console.log('下一页');
            var len = $('#commonPage a').length;
            for(var i=0;i<len;i++){
                var text = $('#commonPage a').eq(i).text();
                if(text == '下一页'){
                    $('#commonPage a').eq(i)[0].click();
                    setTimeout(function(){
                        learnMore();
                    },3000);
                    break;
                }
            }
        }
        window.courseList = [];
        window.checkProgress = function(){
            var link = window.location.href;
            var classId = getParam(link, 'classId');
            var courseUrl = 'https://zynczj.webtrn.cn/u/recommendClass/queryClassCourse.json';
            var param = {
                "page.searchItem.curPage" : 1,
                "page.searchItem.pageSize" : 50,
                "page.searchItem.totalCount":50,
                "page.searchItem.classId":classId,
                "page.searchItem.courseStatus":'',
                "page.searchItem.courseStatusScore":'',
                "page.searchItem.rateOrderVal":'',
                "page.searchItem.typeOrderVal":'',
                "page.searchItem.orderBy":1,
                "page.searchItem.descriptionType":1

            };
            $.ajax({
                url: courseUrl,
                dataType: 'json',
                data: param,
                type: 'post',
                success: function(res) {
                    //console.log("请求成功");
                    courseList = res.classList;
                    var len = courseList.length;
                    var learnNow = localStorage.getItem('learnNow');
                    for(var i=0;i<len;i++){
                        if(courseList[i].name == learnNow){
                            var courseName = courseList[i].name;
                            var progress = parseFloat(courseList[i].totalScore);
                            console.log(courseName+'：'+progress);
                            if(progress == 100){
                                learnMore();
                            }
                        }
                    }
                }
            });
        }
    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/index.action'){
        console.log('进入课程详情');

        //弹窗点击
        setInterval(function(){
            if($('.layui-layer-btn0').length>0){
                $('.layui-layer-btn0').click();
            }
        },1000);

        //是否播放页面
        setInterval(function(){
            var text = $('.learn-menu-cur .learn-menu-text').text();
            if(text != '课件'){
                $('#courseware_main_menu').click();
            }
        },5000);

    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/courseware_index.action'){
        console.log('进入视频播放');

        window.isEnd = false;
        //播放完成，点击下一节
        setInterval(function(){
            console.log(isEnd);
            if(isEnd == true){
                isEnd = false;
                var len = $('.s_point').length;
                for(var i=0;i<len;i++){
                    if($('.s_point').eq(i).hasClass('s_pointerct') == false && $('.s_point').eq(i).attr('completestate') == 0){
                        $('.s_point').eq(i).parent().show();
                        $('.s_point').eq(i).click();
                        break;
                    }
                }
            }
        },3000);
    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/content_video.action'){
        console.log('播放内容页');

        //视频暂停点击
        setInterval(function(){
            if($('#player_pause').css('display') != 'none'){
                $('#player_pause').click();
            }
        },1000);

        //播放完成检测
        setInterval(function(){
            var now = time_to_sec($('#screen_player_time_1').text());
            var total = time_to_sec($('#screen_player_time_2').text());
            if(now >0 && total > 0 && (now / total)>0.99){
                window.parent.isEnd = true;
            }
        },3000);

    }

    //获取链接中指定参数
    function getParam(url, name) {
        try {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.split('?')[1].match(reg);
            if(r != null) {
                return r[2];
            }
            return "";//如果此处只写return;则返回的是undefined
        } catch(e) {
            return "";//如果此处只写return;则返回的是undefined
        }
    };

    function time_to_sec(time) {
        var s = '';
        var hour = 0;
        var min = 0;
        var sec= 0;
        if(time.split(':').length == 1){
            sec = time.split(':')[0];
        }
        if(time.split(':').length == 2){
            min = time.split(':')[0];
            sec = time.split(':')[1];
        }
        if(time.split(':').length == 3){
            hour = time.split(':')[0];
            min = time.split(':')[1];
            sec = time.split(':')[2];
        }

        s = Number(hour*3600) + Number(min*60) + Number(sec);

        return s;
    };
})();