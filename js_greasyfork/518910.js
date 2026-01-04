// ==UserScript==
// @name         ganbu-sulen
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  哈哈哈哈 Try to take over the world!
// @author       sulen
// @match        https://www.gxela.gov.cn/*
// @icon         https://www.gxela.gov.cn/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.0.0.min.js
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/518910/ganbu-sulen.user.js
// @updateURL https://update.greasyfork.org/scripts/518910/ganbu-sulen.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';

    // Your code here...

    var contentElement = document.createElement('div');
    contentElement.innerHTML = "<div class='sulen'><div class='title'><span style='float:left'>干部学习助手</span><span style='float:right' id='button_item'></span></div><div id='sulen_item' style=''></div></div>";
    document.body.appendChild(contentElement);
    const login_div = document.createElement('div');

    const setting_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAw9JREFUWEfFl8urzVEUxz/fIVJS8ogiMwYGcokSeWXiUlyvS5kbkDtxDbgDpIjyB5A3d+AxkVduyjsDAwZKKfKY6JZQJstvaf9O++6zzzm/q9O9u06d3++31trfvdZ3f/faYhjDzCYAe4CNwNzE9StwFjgmabBqWFU1dDszWw9cb+GzQdKNqnGbAggT+qoHJH0ws4fF/2XAH+BJZhL/5rbLzWxmsB1sBigLwMzmAOeA+dEkv4v0jgnPHyTNigFE4Px1bOvPr4Cdkt6moOsAhMmvZWoc+z6VtLgJgFwF3gBdKYghADKT9wE/gOPAd+B2+D2T9D4BMBtYBKwNv4lADzC+oM/BYFsHIgXwHOgIxn2SDgXybQceOw+qkCvUf4mki8Hf45QgXkhaWMapATCzFcD9dPIqE1axMbMYxEpJD9wvBrAJ8Nr76JF0okrgqjZmti+U0l2cC/0pgOnAxyhgd5nCdBIzWxVIWu4SZ/kbSfdygMzMS3gh+jZD0qchAEKtfgJjA+E6UqIFm0vA1gYrvyxpWwawE/QF4MT8JWlcjQNmNqlA7+n3nwuJj4uSujOBrErKVbA34+sZ8Ez4GCgy6CXol5ntBk4nDnXpN7Ne4HBk1wU8Cs9LI/74qwOSjsQxM2Xwz3sdQCmvjqocu+ItZ2argTu1tGVWGMoTZ2hNIVZ3S5+wNc9Ec3i23zmA0umfhudSbGb7gXJFnZJuNbBbB9wM33olHW1gVy6aqgCuAJtDsGmSvjQIPBX4HL5dlbSlXQDOAyUpp0j61iDwZMD7Ah8Xil20o10AvAk5GYLVRCQNbmaxmO2VdKoKgPiM9/R5erclJHThqREqt80yJFwdC1MzElbdhqkAdQIvwwoXROTzV3WC1Gwbjq4QJWJRRYpTQYpD1AlQKE1jKY6EYjiHkQuTH0Tzgv9rb7ti4UkW1vowShg8Ksfx6DYkoVaj15IFAN6Oxx3xyDalDUDkxKzu4EruBTmf1m15tCNaXUxaAfj/i0myffwumLuaxb1D7NKeq1kuf6E8I3s5zZx2bb+e/wXE6c3KUDnSfgAAAABJRU5ErkJggg==";
    const logout_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAxVJREFUWEe9l02ITWEYx3//DVFIrMSEfJeFomjyVVN2NEnjI6F8DKWmfCwwociCiELGhlkgCVkYGxmmRBkLZaGU8bERSWRj8zjP9J7pzLnn3nvuPTPeOt17z30+/u/7Ph//R+RcZjYGaAJagFnARGAC8BfoSzxPJD3IaRZVEzSzucBeYD0wvpp8+P87cBPoktRVSaciADM7EZyPTRnxXX8Nz8jI2WxgRBlHpyUdLAeiLAAzewYsTSi+BvxoH0l6mTZoZg7CnznALmB6Qua5pMYsEJkAzOxbuGPX+RId/XnggiTfedVlZpOBdmBnUlhSib+SF2b2AZgaFHuAHZLeVfWaIWBm6wKQ+YBvapqkP4NAJX+Y2W3AlXwdjwAfq8dxyqYHrtvsldSbtjdwAiHgDgeBTklbijrPo98PIKTaC8Cj3e+8UdKnPAaKysQALkUptTsYOyDpTFHDsb6ZeTwdBZ5KulZyBWY2DvgI+Ken2pK80Z4HpJntAS4G2UOSTg0KQjPbHOVsZ3hZsWjkcZiWMbNVXjsS79skeVr3L5nZHWBt+L1SUnc9jirphHT0DItXq6QrMQA/9gXeVKLj8bI6LCsDxFZJ1/0EPNqnAJ8lNZTzbmYbQqktCtADMl4tDsAr02jglaRFWdajQD0HtBX1nKHflxdAK3B5GAB013IFTkImFQSxPNKPy7uTmGYH8L+C0B3H9/8LWOMZ5wBuBZrlm1uc1esL7tpLfdK5m2uWdD9Ow2bgbnAyJB0wCdjMkvb9r23Jkuwn4GTTS7G3zeEoxduBqwHUPklnkwD/RzNaAXh6v5d0L32d5dpxU70sqNZ4KUdIeiQtq9VYPfKDOGGKCQ9ZQJqZX8MPSW8yryAVtUlG7G26vV52ZGYLgf0hzX8CDZJ+lwRhGlWKGddDyz2j3LE/AwNLLloeg0kxZH/tKfoYeJjFGSL5eYCPcTMAJ7T+PV43JG3KipGhGM1GATMrjGYnJR0pF6C1DKcbA2/MG+wdUfPqyJoFqsZAlodAXld7EwlzXzyeW5h6PHjfOvsFuiV5t6u6/gFVZi5Ib4A1vwAAAABJRU5ErkJggg==";
    $("#button_item").html("<a style='margin-right:20px' href='#' id='setting' title='设置'><img style='width:16px' src='"+setting_img +"'></a><a href='#' id='logout' title='退出'><img style='width:16px' src='"+logout_img +"'></a>");

    let module = document.URL.split("/")[3].split(".")[0].split("?")[0];

    $('#sulen_item').html(`
        <div id='total_msg'><p>当前页面：${module}</p></div>
        <div id='action_msg'>消息……</div>
        <div class="operate"><span id="up">上一课</span><span id='action_msg2'></span><span id="down">下一课</span></div>
        <div id="data_item"></div>`);

    //干部网络学院网站配置，Authorization,Clientid参数是浏览器请求头部需要的
    var token = document.cookie.split("; ")[2].split("=")[1];//从cookie中获取token
    var Authorization = "Bearer "+token;
    var Clientid = "e5cd7e4891bf95d1d19206ce24a7b32e";
    var ClassId = '';//当前必修班级id，用于获取必修课程数据
    var data = [];//存必修课程数据
    var xuan_data = [];//存选修课程数据
    var b_fenshu_now = 0; //必修分数（当前）
    var x_fenshu_now = 0; //选修分数（当前）
    var act_time_id = 0; //学习时，轮巡定时器id
    var doing_xuanke = 0;//正在选课标识，避免循环进入选课程序，造成多选很多课

    var year = 2024;     //学习年份  —  根据当年修改
    var b_fenshu = 30;   //必修分数  —  根据当年修改
    var x_fenshu = 20;   //选修分数  —  根据当年修改


    //获取当前分数
    function get_fenshu(){
        $.ajax ({
            url: "https://www.gxela.gov.cn/gateway/auth/course/user/classhour/statistics?year="+year,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization":Authorization,"Clientid":Clientid},
            success: function(e,status){
                console.log(e);
                if(e.code==200){
                    b_fenshu_now = e.data.requiredClassHour;//当前必修分数，存到公共变量
                    x_fenshu_now = e.data.electiveClassHour;//当前选修分数，存到公共变量
                    $('#total_msg').html(`<p style="text-align:left">必修课：${b_fenshu_now} / ${b_fenshu}</p><p style="text-align:left">选修课：${x_fenshu_now} / ${x_fenshu}</p>`);

                    //console.log(status);
                }else{
                    $('#action_msg').append(e.msg);
                }
            },
            faild:(e)=>{
                console.log(e)
                $('#action_msg').append('网络错误');
            }
        });
    }


    //获取必修课程数据
    function get_must_learn(trainClassId){
        $.ajax ({
            url: "https://www.gxela.gov.cn/gateway/auth/trainclass/category/lessonpage",
            type: "POST",
            data: JSON.stringify({
                isMust:1,
                pageNum:1,
                pageSize:200,
                trainClassId: trainClassId
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization":Authorization,"Clientid":Clientid},
            success: function(e,status){
                //console.log(e);
                if(e.code==200){
                    for(var k=0; k<e.rows.length; k++){
                        if(e.rows[k].passed == 0 || e.rows[k].passed == 2){
                            data.push(e.rows[k]);//未开始和进行中的课程数据存到公共变量
                        }
                    }
                    console.log(data);
                    var status_text = ["进行中","已通过","未开始"];
                    for(var i=0;i<data.length;i++){
                        var l_msg = '';
                        switch( data[i].passed){
                            case 0:
                                l_msg = "<span style='color:#ff0'>【"+status_text[data[i].passed]+"】</span>";
                                break;
                            case 1:
                                l_msg = "<span style='color:#0f0'>【"+status_text[data[i].passed]+"】</span>";
                                break;
                            case 2:
                                l_msg = "<span style='color:#f00'>【"+status_text[data[i].passed]+"】</span>";
                                break;
                        }
                        $('#data_item').append(`<div class='item' ><span class='item_t1'>${i+1}.${l_msg}${data[i].name}</span>`);
                    }

                }else if(e.code==401){//用户受限
                    $('#action_msg').append(e.msg);
                }
            },
            faild:(e)=>{
                console.log(e)
                $('#action_msg').append('网络错误');
            }
        });
    }

    //获取我的已选 选修课 程数据
    function get_my_xuan_learn(){
        const p = new Promise((resolve, reject)=>{
            $.ajax ({
                url: "https://www.gxela.gov.cn/gateway/auth/course/lesson/page/my?pageNum=1&pageSize=200&queryLessonType=2&passStatus=2&year="+year,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                headers: { "Authorization":Authorization,"Clientid":Clientid},
                success: function(data,status){
                    if(data.code == 200){//“开始”操作成功
                        resolve(data);
                    }else{//“开始”操作失败
                        resolve(new Error('Operation failed'));
                    }
                    //console.log(data,status);
                },
                faild:(e)=>{
                    console.log(e)
                    $('#action_msg').append('网络错误');
                }
            });
        });
        p.then((r) => {
            console.log(r); // 操作成功的情况
            xuan_data = r.rows;//课程数据存到公共变量
            //console.log(status);
            for(var i=0;i<xuan_data.length;i++){
                $('#data_item').append(`<div class='item'><span class='item_t1'>${i+1}.【${xuan_data[i].classHour}学时】${xuan_data[i].name}</span>`);
            }

        }).catch((error) => {
            console.error('查询课程失败:', error); // 操作失败的情况
            $('#action_msg').append(error.msg);
        });

    }

    //选课
    function xuan_ke(){
        doing_xuanke = 1;
        //获取 系统所有选修课 程数据
        const p = new Promise((resolve, reject)=>{
            $.ajax ({
                url: "https://www.gxela.gov.cn/gateway/auth/course/lesson/page",
                type: "POST",
                data: JSON.stringify({
                    idList:[],
                    lessonName:"",
                    orderType:"",
                    pageNum:1,
                    pageSize:200,
                    queryLessonType:2,
                    sortType:"",
                    teacherPosition:"",
                    teacherUnit:"",
                    teachers:""
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                headers: { "Authorization":Authorization,"Clientid":Clientid},
                success: function(r,status){
                    if(r.code == 200){//操作成功
                        resolve(r);
                    }else{//操作失败
                        resolve(new Error('Operation failed'));
                    }
                },
                faild:(e)=>{
                    console.log(e)
                    $('#action_msg').append('网络错误');
                }
            });
        });
        p.then((e) => {
            //console.log(e);
            var rows = e.rows;//
            console.log(rows);
            var i=0;
            while(i<rows.length){//找到一节未选的课
                if(rows[i].isSelect == 0){
                    break;
                }else{
                    i++;
                }
            }

            if(i<rows.length){
                //选这节课
                const x = new Promise((resolve, reject)=>{
                    $.ajax ({
                        url: `https://www.gxela.gov.cn/gateway/auth/user/study/lesson/selection?lessonId=${rows[i].lessonId}&tcLessonId=0`,
                        type: "POST",
                        data: JSON.stringify({
                            lessonId:rows[i].lessonId,
                            tcLessonId:0
                        }),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        headers: { "Authorization":Authorization,"Clientid":Clientid},
                        success: function(r,status){
                            if(r.code == 200){//操作成功
                                resolve(rows[i].lessonId);
                            }else{//操作失败
                                resolve(new Error('Operation failed'));
                            }
                        },
                        faild:(e)=>{
                            console.log(e)
                            $('#action_msg').append('网络错误');
                        },
                        complete:()=>{
                            doing_xuanke = 0;
                        }
                    });
                });
                x.then((e) => {
                    console.log('选课成功', e)
                    learn_index = 0;//重置学习索引
                }).catch((error) => {
                    console.error('选课失败:', error); // 操作失败的情况
                    $('#action_msg').html(error.msg);
                });
            }else{
                $('#action_msg').html('本次获取的课程皆已选');
            }

        }).catch((error) => {
            console.error('查询课程失败:', error); // 操作失败的情况
            $('#action_msg').html(error.msg);
        });
    }

    //保存课程进度，弃用
    function save_my_learning(learnTime,lessonGkey,lessonId,lessonOrigin,progress,tcLessonId){
        $.ajax ({
            url: "https://www.gxela.gov.cn/gateway/auth/user/study/progress/save",
            type: "POST",
            data: JSON.stringify({
                learnTime:learnTime,
                lessonGkey:lessonGkey,
                lessonId:lessonId,
                lessonOrigin:lessonOrigin,//必修"trainclass"，选修"selflearn"
                progress:progress,
                tcLessonId:tcLessonId,
                thisTimeLearnSeconds:60
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization":Authorization,"Clientid":Clientid},
            success: function(data,status){
                console.log(data);
                console.log(status);
            }
        });
    }

    //必修课学习
    function mlearn(){
        if(data[learn_index]){
            //console.log(now_course)

            if(data[learn_index].passed == 2){//未开始

                //https://www.gxela.gov.cn/watch?lessonId=58225&tcLessonId=45490&lessonOrigin=trainclass
                //window.open(`https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=${data[learn_index].tcLessonId}&lessonOrigin=trainclass`);
                window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=${data[learn_index].tcLessonId}&lessonOrigin=trainclass`;
                data[learn_index].passed = 0;
                /*
                //开始学习某课程
                //var now_course = data[learn_index];
                const p = new Promise((resolve, reject)=>{
                    $.ajax ({
                        url: "https://www.gxela.gov.cn/gateway/auth/user/study/start",
                        type: "POST",
                        data: JSON.stringify({
                            lessonGkey:now_course.gkey,
                            lessonId:now_course.lessonId
                        }),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        headers: { "Authorization":Authorization,"Clientid":Clientid},
                        success: function(data,status){
                            if(data.code == 200){//“开始”操作成功
                                resolve(data);
                            }else{//“开始”操作失败
                                resolve(new Error('Operation failed'));
                            }
                            //console.log(data,status);
                        }
                    });
                });
                p.then((result) => {
                    console.log('课程已被标记“开始”:', result); // 处理操作成功的情况
                    save_my_learning(now_course.letime*60,now_course.gkey,now_course.lessonId,"trainclass",100,now_course.tcLessonId);
                }).catch((error) => {
                    console.error('标记“开始”失败:', error); // 处理操作失败的情况
                });
                */


            }else if(data[learn_index].passed == 0){//进行中

                console.log(module);
                if(module == 'study'){
                    //如果是study页面中检测到‘进行中’则跳转到播放学习
                    window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=${data[learn_index].tcLessonId}&lessonOrigin=trainclass`;

                }else if(module == 'watch'){
                    $('#action_msg').html(`正在学习《${learn_index+1}.${data[learn_index].name}》【${data[learn_index].classHour}学时】`);
                    //播放页面，则检测是否在播放，否则找到播放按钮xgplayer-start点击
                    var video_state = $('.xgplayer-start')[0].dataset['state'];
                    if(video_state == undefined || video_state == 'pause'){
                        $('.xgplayer-start').click();//点击播放
                    }else if(video_state == 'play'){
                        //
                        var jindu = $('.xgplayer-progress-btn')[0].style.cssText.split(":")[1].split(" ")[1].split(";")[0];
                        $('#action_msg2').html('播放进度：'+jindu);
                        if(jindu == '100%'){
                            data[learn_index].passed = 1;//标识本地数据为已通过
                            save_my_learning(data[learn_index].letime*60,data[learn_index].gkey,data[learn_index].lessonId,"trainclass",100,data[learn_index].tcLessonId);//标识服务端为已通过
                        }

                    }else{
                        $('#action_msg').html(`播放出错`);

                    }

                }


                //直接保存进度100%
                //save_my_learning(now_course.letime*60,now_course.gkey,now_course.lessonId,"trainclass",100,now_course.tcLessonId);
            }else{
                //已完成学习，获取分数情况，并指向学习下一课
                $('#action_msg').html(`《${learn_index+1}.${data[learn_index].name}》学习完毕，跳转下一课…`);
                get_fenshu();
                learn_index++;
            }
        }else{
            //没有课程数据
            $('#action_msg').html('没有课程数据');
        }
    }


    //选修课学习
    function xlearn(){
        //console.log(data[learn_index]);
        if(xuan_data){
            if(xuan_data[learn_index]){
                if(module == 'study'){
                    window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${xuan_data[learn_index].lessonId}&tcLessonId=0&lessonOrigin=selflearn`;

                    /*
                    //如果是study页面中,获取已学列表，检测是否已学，否则跳转到播放学习
                    const p = new Promise((resolve, reject)=>{
                        $.ajax ({
                            url: "https://www.gxela.gov.cn/gateway/auth/course/lesson/page/my?pageNum=1&pageSize=10&queryLessonType=2&passStatus=1&year="+year,
                            //url: "https://www.gxela.gov.cn/gateway/auth/course/lesson/page/my?pageNum=1&pageSize=10&queryLessonType=2&lessonId="+data[learn_index].lessonId,
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            headers: { "Authorization":Authorization,"Clientid":Clientid},
                            success: function(r,status){
                                if(r.code == 200){//操作成功
                                    resolve(r);
                                }else{//操作失败
                                    resolve(new Error('Operation failed'));
                                }
                                //console.log(data,status);
                            }
                        });
                    });
                    p.then((r) => {
                        console.log(r);
                        for(var i=0; i<r.rows.length; i++){
                            //
                            if(r.rows[i].lessonId == data[learn_index].lessonId){//如果学过
                                learn_index++;
                            }else{
                                window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=0&lessonOrigin=selflearn`;
                            }
                        }
                    }).catch((error) => {
                        console.error('查询课程失败:', error); // 操作失败的情况
                    });
                    */

                }else if(module == 'watch'){
                    $('#action_msg').html(`正在学习《${learn_index+1}.${xuan_data[learn_index].name}》【${xuan_data[learn_index].classHour}学时】`);
                    //播放页面，则检测是否在播放，否则找到播放按钮xgplayer-start点击
                    var video_state = $('.xgplayer-start')[0].dataset['state'];
                    if(video_state == undefined || video_state == 'pause'){
                        $('.xgplayer-start').click();//点击播放
                    }else if(video_state == 'play'){
                        //
                        var jindu = $('.xgplayer-progress-btn')[0].style.cssText.split(":")[1].split(" ")[1].split(";")[0];
                        $('#action_msg2').html('播放进度：'+jindu);
                        if(jindu == '100%'){
                            //已完成学习，获取分数情况，并指向学习下一课
                            $('#action_msg').html(`《${learn_index+1}.${xuan_data[learn_index].name}》学习完毕，跳转下一课…`);

                            
                            //服务端修改进度100%
                            //var video_time = $('.time-duration').text().split(":");//获取页面中视频的时间，还没考虑时分秒，所以暂不使用具体时间
                            $.ajax ({
                                url: "https://www.gxela.gov.cn/gateway/auth/user/study/progress/save",
                                type: "POST",
                                data: JSON.stringify({
                                    learnTime:60*xuan_data[learn_index].letime,
                                    lessonGkey:xuan_data[learn_index].lessonGkey,
                                    lessonId:xuan_data[learn_index].lessonId,
                                    lessonOrigin:"selflearn",
                                    progress:100,
                                    tcLessonId:"0",
                                    thisTimeLearnSeconds:60
                                }),
                                dataType: "json",
                                contentType: "application/json; charset=utf-8",
                                headers: { "Authorization":Authorization,"Clientid":Clientid},
                                success: function(data,status){
                                    console.log(data);
                                    console.log(status);
                                }
                            });
                            
                            get_fenshu();
                            learn_index++;
                            window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${xuan_data[learn_index].lessonId}&tcLessonId=0&lessonOrigin=selflearn`;
                        }

                    }else{
                        $('#action_msg').html(`播放出错`);

                    }

                }


                //console.log(now_course)

            }else{
                //没有课程数据
                $('#action_msg').html('没有课程数据，准备自动选课…');
                if(doing_xuanke == 0){//确保此定时器中，只同时调用一次
                    xuan_ke();
                }
            }
        }else{
            get_my_xuan_learn();
            learn_index = 0;
        }
    }


    //页面动作
    if(module == 'home'){//登录页面、首页
        //自动登录的情况

    }else if(module == 'index'){//登录页面、首页
        window.location.href = 'https://www.gxela.gov.cn/home';

    }else if(module == 'study' || module == 'lesson' || module == 'watch'){//xx页面
        //https://www.gxela.gov.cn/study/class/detail?id=31403
        //https://www.gxela.gov.cn/study/index?type=lesson
        //var detail_id = document.URL.split("/")[5]

        //获取当前的得分情况
        get_fenshu();

        //获取 ClassId 并保存到全局变量
        $.ajax ({
            url: "https://www.gxela.gov.cn/gateway/auth/trainclass/myTrainclasspage?pageNum=1&pageSize=10&trainQueryStatus=1",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization":Authorization,"Clientid":Clientid},
            success: function(e,status){
                //console.log(e);
                if(e.code==200){
                    ClassId = e.rows[0].trainClassId;//课程数据存到公共变量
                    //console.log(status);
                }else if(e.code==401){//否则从url获取
                    ClassId = document.URL.split("/")[5]
                    //
                }else{
                    $('#action_msg').append(e.msg);
                }

                if(ClassId){//根据分数，获取课程数据，显示在工具界面
                    if(b_fenshu_now < b_fenshu){
                        get_must_learn(ClassId);

                    }else if(x_fenshu_now < x_fenshu){
                        //
                        get_my_xuan_learn();
                    }else{
                        //已完成全部学习
                        $('#action_msg').html(`<p style="color:#f00">已完成全部学习</p>`);
                    }
                }else{
                    $('#total_msg').append(`<p style="color:#f00">未获取当前必修班级id</p>`);
                    window.location.href = 'https://www.gxela.gov.cn/home';
                }
            },
            faild:(e)=>{
                console.log(e)
                $('#action_msg').append('网络错误');
            }
        });

        //轮训学习，直到分数合格
        var learn_index = 0;
        act_time_id = setInterval(()=>{
            //
            if(data){
                //
                if(b_fenshu_now < b_fenshu){
                    //
                    mlearn();
                }else if(x_fenshu_now < x_fenshu){
                    xlearn();
                }else{
                    //已完成全部学习
                    $('#action_msg').html(`<p style="color:#f00">已完成全部学习</p>`);
                    // 清除定时器
                    clearInterval(act_time_id);
                    //window.location.href = `https://www.gxela.gov.cn/study/index?type=file`;
                }
            }else{
                $('#action_msg').html('正在加载课程数据…');
            }
        }, 1000);
    }

    //上一课学习
    $("#up").click(()=>{
        learn_index--;
        if(learn_index<0) learn_index=0;
        window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=${data[learn_index].tcLessonId}&lessonOrigin=trainclass`;
    });

    //下一课学习
    $("#down").click(()=>{
        learn_index++;
        if(learn_index>data.length-1) learn_index=data.length-1;
        window.location.href = `https://www.gxela.gov.cn/watch?lessonId=${data[learn_index].lessonId}&tcLessonId=${data[learn_index].tcLessonId}&lessonOrigin=trainclass`;
    });


    //附加页面样式
    var head = document.getElementsByTagName("head")[0];
    //<link href="https://code.jquery.com/jquery-3.0.0.min.js" rel="preload" as="script">
    var sulen_css = `
        <style type="text/css">
            .sulen{
                position: fixed;
                right:10px;
                bottom:10px;
                width:220px;
                background-color:#000;
                border-radius:10px;
                padding:10px;
                opacity:1;
                color:#fff;
                text-align:center;
                z-index: 999;
            }

            .sulen .title{
                height:28px;border-bottom:1px solid #333;padding-bottom: 5px;
            }
            .sulen .item{
                margin: 1px 0;
                border-bottom: 1px solid #555;
                padding: 10px;
            }
            .sulen .item:hover{
                color:#fff; background-color:#006;
            }
            .sulen .item .item_t1{
                color:#aaa; display:block;
            }
            .sulen .item .item_t2{
                color:#f00;font-size:13px;text-align: left;display: inline-block;width: 50px;
            }
            .sulen .item .item_t3{
                color:#555; font-size:12px;text-align: right;display: inline-block;width: calc(100% - 60px);
            }
            .sulen #total_msg{
                margin:10px 0;
            }
            .sulen #action_msg{
                margin:10px 0;
                font-size: 12px;
            }
            .sulen #data_item{
                overflow: auto; max-height:250px;text-align:left;background-color: #333; font-size: 12px;
            }
            .operate{
                margin:10px 0;
                font-size: 12px;
            }
            .operate #action_msg2{
                color:#f00;
            }

           /* 滚动条 */
            #data_item::-webkit-scrollbar {
                width: 1px; /* 滚动条的宽度 */
            }
            #data_item::-webkit-scrollbar-thumb {
                border-radius: 1px;
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
                background: #338fff; /* 滑块的颜色 */
            }
            #data_item::-webkit-scrollbar-track {
                border-radius: 3px;
                background: #aaa; /* 轨道的颜色 */
            }
        </style>`;
    var sulen_script = `
        <script type="text/javascript"></script>`;
    head.innerHTML += sulen_css;
    head.innerHTML += sulen_script;
})();