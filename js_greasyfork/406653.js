// ==UserScript==
// @name         知到智慧树刷课
// @namespace    http://rainss.cn
// @version      1.3.4
// @description  智慧树刷课脚本 自动静音 自动1.25倍播放 自动答题（智慧树视频弹出的题目随便选择没事）
// @author       rainerosion
// @match        *://studyh5.zhihuishu.com/videoStudy.html*
// @grant        unsafeWindow
// @license      GPL3.0
// @supportURL   https://github.com/rainerosion/zhihuishu.git
// @downloadURL https://update.greasyfork.org/scripts/406653/%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/406653/%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function($) {
    //监听点击事件
    $("html").on("click","#rains", function () {
        StartOrStop();
    });

    $.noConflict(true);
    //定时器
    var timer;
    //++++++++ 以下为可设置的参数 ++++++++++
    //初始状态 0 开启 1关闭
    var startstatus = 0;
    //次数
    var number = 0;
    //视频播放到91%时候切换下一个
    var percent = 91;
    //速率
    var speed = "1.25";
    //静音
    var vol = true;
    //答题？不答题将会移除答题框
    var answer = true;
    //++++++++ 可设置的参数结束 ++++++++++
    //查找节点
    var tips = $("body");
    console.log(tips[0])
    //创建新节点
    var option = $("<div>");
    //添加样式
    var args = {
        "color":"DarkOrange",
        "text-align":"center",
        "line-height":"90px",
        "font-size":"30px",
        "background-image": "url(data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAMgAyAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/Oa21/ydTQW/2o26FjOsjkEoJDywAJT5duRluec84HT3mp2vm7Jsxyl5PNLyPLLGu9lUDeE9UPGTwTkZK1u+O/gNe/C7+z9aub+OdYmSIqtuuYmCMB8u0LIc7eSRyDnOcjzW7u5ftulguIVaJXfzpQQxMhRmAAXb0A29lUc4FezUp1sO3GpofOUKuFzCHtMM7r7vzOut5xa3CzQGW5lMdw2InDSohRQxKuCCwTncAThywwU41/h34gGh6ilzGguFtkWS4a6twEjTKZYYyT7ZByAeOa4nw3qkWuRm2eFo4IGE7bcOhOzacg4JPBOc4AJwBWz4RtG8R6lJpqRm1ifEUcn2cvI+WcZAZuBneDtHGz1ya0oqenLK9ya0FFSU1a2p+p3gb41/s++L/hnY291eaNpl5a2CedbahYo8oIR/MVXdHZiGV2DRZJLRnkAivB/hB8GLH4meI/FGpeHHEGkQXs/2Le5RYYWlPlLhstvKd29K7D4L/sQ6dpnhO6uPEDyXOrQsscgVZQ1vny8EIF7eapJG4AgnPBx5R8WdS8Rfsp+PpbbwXqMdlaaqiRO0hjkTIZQhYShgQgDYORt3nkDiuug/Yym6UtfyOCveuoRqxsvuuewyeEdV0t2s5LKQSW5MLbbmTGV4OP3w449KK+bZv2tvE9zNJLcaJDdTyMWkncOTIxOSxKkKSTz8oA9ABRXZ7SXkef7J/wAr/A89+MHxzX4heHrHTLNbueGJZCBcxqq7TvRGOCTuAI5J6g9q8FuLS9RhcWxeN0AUmAlWIXDBjz64P1ArsNQv7GztWS3gARSdss2BuBA2kADqQP8APNfT/wCw38evBnwk0XxHD4u0uSO+vZB5V3bQrO8seMGFlJG0ZGfQ5OegrypUpYqSind+R7qrPBQc4U9Lnz98CvAg8XalqNnPdfY4nCsxEgO3nPDH8B+fNe233wm8JeHPAmo6hca7u1qPz5DJBc7ZYpVDsIUBJxubDd+XO3GRX2R4c/Zv+AP/AArqbxlrGnRaNrGt3M17It9fPp0tojliIUjSRVQKCvY8889K/OTS/h0ut/FTUbC31oR2V3qkltaXN02B5fnEK57H5QR26110KtGmlRcNU7NlYbJswzuvKph6totKVr2SS3u/69D6v/Z1/bi1ya11Twt8QL7SLc2kdtbWd7fAQu4TcCssqsoLLlWXpklupBI8b+Kd7N8dPHmoJZalBcafbSt9iuHO7zwCFyrd0LK+MA8AZz29++Kn7Kfw61fw7odnotwunX1+IEkvJmJnIX55d65ID7eORweOxFVtO/ZT8NfDPyEtNVvpdQvIw/73y0Yn5SYztB4OOT1+Vj71NOpRpSdtU/KzCvhK0oKT0fTqvM+NtV0TV59TvJYHMcDzO0aG9XKqWOB94dvYfSivuG3/AGUtLFvFuVWbaMk3CHJx6k80VHtKQvYS7n5iXF8U1C2mhdZDGyuRgAADAOT+hOTkYyeKf4V8VXOg6xod5bGMz2F4l3GkgDIxRwwD54I+UcdOvrXs37O/wf8ADfjfxXBH4nkmgt5QriNgRvVhkEk4yCOcjrX0L+0h+wn4f8P+BR4i8DaZcwXMIaRowfNWVFJU/IzdecjHBwK4Pq9aK54ys2dDzPDwq+ylFtLd9P8Ahjzz4u/G2++MvhzT7SDTW0iG3driQNchpXcqwyx2LgAMeOpz61j/AAc+AniXWPEdvFe6dqFlZlkkS4GYflBzuUNjcTkAMOgXvmvGPC/i+++H3i/T7q+sY77T9KuI55rK5GFmRZR8n9Bz2z7V92fG7/gpN4W1HQtGbwP4evn1ZWFzjVIlSGGMRuziOQOWcgMqc8AIAuM7a8+GKq06sVUjd9z9AxtTL6uCjRy6HIrK+tnfdu99U+nb7j6W0f4X/Z/CEU2qaVNdPEnlpc3V6ZZgpOC2SxIPPJz718UfHqXTvDfxAs9X0/VpDqUtwkKD7ezKxZWA3bmDBRvU5yqnBB9Rka1/wUg+KmraGNLitdE0a3kuPs32h7SUzRoMg7yXK5yvIOPxySvh+oapqfxH8RaFqmrzxtc3SNdOw5LkSFhGvG1eI/lTJ+YPk84HqRq8zblqfFNVKceVOyPsOz/bBvpLOBhZSSho1Ik2Xa7uOuAMDPoOKK/PS71CV7qZkl1IoXYqWlYkjPHO3milzw7G2vl9x9I/sR20Vx480dZYklU3aZDqCOor9jPG9jbXfwsvbee3img/s+P91IgZfvN2PHYflRRV1fhpHza/i4j0X6n4aftUWdvb+LT5UEceQc7EAz85H8gK8e1F2l1YwuxeFb5iI2OVBZzu498DPrgUUVw4v+JI+kwf+7w9Dfl/0bw3HPD+6njSNUlThlHnS8AjkdB+VbOlEp4q8KKp2rNobrIBwHHkynDevIB59KKKUdkby3LdhZwTWNtJJBG7tGrMzICSSBkk0UUV6p4z3P/Z)",
        "background-repeat": "no-repeat",
        "background-size": "100%",
        "width": "90px",
        "height": "90px",
        "border-radius": "45px",
        "position":"fixed",
        "left":"60px",
        "top":"200px",
        "z-index":"999"
    };
    option.css(args);
    option.attr("id","rains");
    option.text("Rains");
    //插入节点到页面
    tips[0].parentNode.insertBefore(option[0],tips[0]);
    //函数
    function start(){
        if(number % 20 == 0){
            console.clear();
        }
        number += 1;

        //获取视频速率
        var speedSpan = $(".speedBox>span").text().replace("X ","");
        if(speedSpan != speed){
            switch(speed){
                case "1.0":
                    $("div[rate='1.0']").click();
                    break;
                case "1.25":
                    $("div[rate='1.25']").click();
                    break;
                case "1.5":
                    $("div[rate='1.5']").click();
                    break;
            }
        }
        //判断音量
        var volume = parseInt($(".volumeBox .passVolume")[0].style.height);
        if(volume > 0 && vol == true){
            $(".volumeIcon").click();
        }
        //获取进度条
        var pass = $(".passTime");
        //获取答题框状态
        var dialog = $(".el-dialog__wrapper.dialog-test")[0];
        if(dialog != undefined){
            if(answer == false){
                //移除答题框
                $(".v-modal").remove();
                $(".el-dialog__wrapper.dialog-test")[0].remove();
                $("body").removeClass("el-popup-parent--hidden");
            }else{
                //如果是单选题或者判断题选择一个答案否则移除答题框
                if($(".title-tit").text() == "【单选题】" || $(".title-tit").text() == "【判断题】"){
                    //选择选项的第一个用于获取正确答案
                    let list = $(".topic-list .topic-option-item");
                    list[0].click();
                    //取消已经选择的
                    list.each(function(){
                        if($(this).hasClass("active")){
                            $(this).click();
                        }
                    })
                    //选择答案
                    let answer = $(".answer span").text();
                    let option = answer.charCodeAt() - 65;
                    $(".topic-list .topic-option-item")[option].click();
                    //延时关闭弹窗
                    sleep(2000);
                    $(".el-dialog__wrapper.dialog-test .el-dialog__footer .dialog-footer .btn")[0].click();
                }else if($(".title-tit").text() == "【多选题】"){
                    //多选题选择用于获取正确答案
                    let list = $(".topic-list .topic-option-item");
                    //选择所有的选项
                    list.each(function(){
                        if(!$(this).hasClass("active")){
                            $(this).click();
                        }
                    })

                    //获取答案
                    let answer = $(".answer span").text().split(",");
                    sleep(1000);
                    //取消已经选择的
                    list.each(function(){
                        if($(this).hasClass("active")){
                            $(this).click();
                        }
                    })
                    //勾选正确答案
                    for(let i in answer){
                        let option = answer[i].charCodeAt() - 65;
                        $(".topic-list .topic-option-item")[option].click();
                    }
                    //延时关闭弹窗
                    sleep(2000);
                    $(".el-dialog__wrapper.dialog-test .el-dialog__footer .dialog-footer .btn")[0].click();
                }else{
                    //如果不是这3个选项移除答题框以后弹框将不会出现
                    $(".v-modal").remove();
                    $(".el-dialog__wrapper.dialog-test")[0].remove();
                    $("body").removeClass("el-popup-parent--hidden");
                }
            }
            let play  = $(".bigPlayButton.pointer")[0];
            //如果暂停继续播放
            if(play.style.display == "block"){
                play.click();
            }
        }else{
            let play  = $(".bigPlayButton.pointer")[0];
            //如果暂停继续播放
            if(play.style.display == "block"){
                play.click();
            }
        }
        //判断播放进度是否大于83%
        if(parseInt(pass[0].style.width) > percent){
            //切换下一个视频
            $("#nextBtn").click();
        }
        console.log("执行第"+ number + "次");
    }
    function StartOrStop(){
        var rains = $("#rains");
        //获取播放状态
        var play  = $(".bigPlayButton.pointer")[0];
        if (startstatus == 0){
            //开始脚本
            timer = setInterval(start, 3000);
            //已经暂停 点击开始按钮 block时视频播放暂停
            startstatus = 1;
            rains.text("已开");
            rains.css("color","blue");
            console.log("刷课开始执行");
            if(play.style.display == "block"){
                play.click();
            }
        }else if (startstatus == 1) {
            //停止脚本
            clearInterval(timer);
            //已经播放 暂停播放
            startstatus = 0;
            rains.text("已关");
            rains.css("color","red");
            console.log("刷课已停止");
            if(play.style.display == "none"){
                play.click();
            }
        }
    }
    //延时等待
    function sleep(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
    };
    //执行监听方法 默认填入代码后开启脚本
    StartOrStop();
})(jQuery);