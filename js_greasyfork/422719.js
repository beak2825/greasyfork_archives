// ==UserScript==
// @name         传智自动刷视频
// @namespace    shuidas
// @version      0.9.1
// @description  只能刷视频，可改默认播放速度，习题可选择是否跳过（跳过的话需要手动点回来做，不跳过就是题库查，不准确的结果会显示在控制台，也有可能查询不到）中间可能有些bug，我这边样本不够没法改，建议先跳过习题刷完视频再刷习题
// @author       shuidas@qq.com 有什么更改建议或使用中碰到的问题可以发我邮箱，如果我会解决的话会尽量解决的
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @match        *://*.ityxb.com/preview/*
// @grant        GM_xmlhttpRequest
// @connect      cx.icodef.com
// @downloadURL https://update.greasyfork.org/scripts/422719/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/422719/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {

    'use strict';


                 //↙
    var speed = 1.0; //←想改默认速度在这里改
                 //↖
    var skip = true;   //true false 是否选择跳过习题
    var SilentPlay = true;  //选择是否静默播放
    var current = 10; //默认按“→”快进10s
    var warn = true; //默认弹窗显示信息,不想影响视频进度的可以将这一项改为false ，信息将会在控制台显示



    /*******快捷键******
    f:   全屏/退出全屏
    →:  快进10s; current参数是默认快进时间
    d:   显示剩余时长
    ********************/


//*********下面的不用管，改上面的参数就行***************//
    var num = 0; //初始视频位数 第一个序号是0
    var max = 0; //获取网页视频总数默认为0
    var remain=0;
    var speedtime = speed;

    //$('video')[0].playbackRate=? 自己控制台手动改倍速

    setTimeout(function() {
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.parentElement.setAttribute('class','chapter-item-box');//关掉第一个列表
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.style.display = 'none';

        max = $('.point-item-box').length - 1;

        while($('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"){
            if(!skip
               && $('.point-item-box>div:last-child')[num].className.includes("topic")
               && $('.point-item-box>div:last-child')[num].children[1].innerHTML != "100%"){
                break;
            }

            num++;
            if(num > max)
                return;
        }

        if($('.point-item-box>div:first-child')[num].children[1].innerHTML != "100%"){
            doplay();
        }else if(!skip
                 && $('.point-item-box>div:last-child')[num].children[1].innerHTML != "100%"){
            //习题未做
            dowork()
        }else{
            num++;
            doplay();
        }

    },1000);

    function keyboard(eve) { //检测键盘抬起
        var code = eve.keyCode || eve.which;
        if($('video')[0]!= null)
            if(code==39){
                $('video')[0].currentTime += current; //快进默认10s
            }else if(code==70){ //f
                if($('video+div+div')[0].children[8].style.display == "block" || $('video+div+div')[0].children[8].style.display == "")
                    $('video+div+div')[0].children[8].click();
                else if($('video+div+div')[0].children[9].style.display == "block")
                    $('video+div+div')[0].children[9].click();
            }else if(code==68){ //d
                c();
            }
    }

    document.onkeyup = keyboard;//增加快进功能

    setTimeout(function() { //增加视频监听事件
        $("video")[0].addEventListener("ended", function() { //播放结束换下一个视频
            if(!skip
               && $('.point-item-box>div:first-child')[num].children[1].innerHTML=='100%'
               && $('.point-item-box>div:last-child')[num].children[1].innerHTML!='100%'){
                dowork();
                return;
            }
            num++;
            if(num > max)
                return;
            doplay();
        });
    },1000);

    setInterval(function(){//持续检查是否是习题界面，选择跳过
        if($('.point-item-box>div:first-child')[num] == null)
            return;
        /*if(skip
           && $('.question-title-text')[0] == null
           && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"){

            if(($('video')[0].duration - $('video')[0].currentTime) > 1)
                return;

            num++;
            doplay();
            }*/
        if(skip && $('.question-title-text')[0] != null){//视频结束时间未触发
            num++;
            doplay();
            return;
        }
         if(($('video')[0].duration - $('video')[0].currentTime) < 0.1){
             num++;
            doplay();
            return;
         }

        if(num >= max){
            return;
        }
        //我是兜底的，不知道为啥老是在第二个包含习题里停下来
        },3000);

    function doplay(){

        while(!skip
              && $('.point-item-box>div:last-child')[num].className.includes("topic")
              && $('.point-item-box>div:last-child')[num].children[1].innerHTML == "100%"
              && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"){
            num++;
            //console.log(num);
        }

        while(skip
              && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"){
            num++;
            //console.log(num);
        }

        if(!skip
           && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"
          && $('.point-item-box>div:last-child')[num].children[1].innerHTML != "100%"){
            dowork();
            return;
        }
        $('.point-item-box')[num].click();
        console.log('当前播放标题：'+$('.point-item-box>div:first-child')[num].children[0].children[1].title);

        setTimeout(function() {
            $('video')[0].muted = true;

            $('video')[0].playbackRate=speed;
            $('video+div+div')[0].children[13].innerHTML=speed+"倍速"; //显示倍速
            $('video')[0].parentNode.children[8].lastChild.innerText=speed+"倍速";
            $('video')[0].parentNode.children[8].children[4].style.color='white'; //标白

            var str=6; //标蓝
            switch (speed){
                case 1.5:
                    str=2;break;
                case 2:
                    str=1;break;
                case 2.5:
                    str=0;break;
                case 1.25:
                    str=3;break;
                case 1:
                    str=4;break;
                case 0.5:
                    str=5;break;
            }
            $('video')[0].parentNode.children[8].children[str].style.color='rgb(7, 130, 245)';

            $('video')[0].play();
            if(SilentPlay) // 选择是否静默播放
                $('video+div+div')[0].children[16].click()
            $('video')[0].muted = false;},500);//播放视频
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.parentElement.setAttribute('class','chapter-item-box expand');//展开列表
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.style.display = null;
    }

    function dowork(){
        //做习题
        let n = $('.point-item-box>div:last-child')[num];
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.parentElement.setAttribute('class','chapter-item-box expand');//展开列表
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.style.display = null;
        //            console.log('检测到习题未做'+num);
        n.click();
        //            console.log($('pre')[0]);

        var question_text_temp = '试试';

        var interval = setInterval(function(){
//            $('pre')[0].innerHTML;
//          $('.question-title-text')[0].children[0].innerText;
            if($('.question-title-text')[0] == null
               && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"
               && ($('.point-item-box>div:last-child')[num].children[1].innerHTML == "100%" || skip)){
                num++;
                doplay();
                window.clearInterval(interval);
            }else{
                if($('.question-title-text')[0]!=null){
                    let question_text = $('.question-title-text')[0].children[0].innerText;
                    if(question_text != question_text_temp){
                        answer(question_text);
                        question_text_temp=question_text;
                    }
                }else{
                    let question_text = '';
                    if(question_text != question_text_temp){
                        if(warn)
                            alert('对不起，未能正确获取到题目');
                        else
                            console.log('对不起，未能正确获取到题目');
                        question_text_temp=question_text;
                    }

                }

            }

        },1000);

        $('.point-item-box>div:first-child')[num].parentElement.parentElement.parentElement.setAttribute('class','chapter-item-box expand');//展开列表
        $('.point-item-box>div:first-child')[num].parentElement.parentElement.style.display = null;
    }

    function answer(question_text){

        GM_xmlhttpRequest({
            method: 'post',
            url: 'http://cx.icodef.com/wyn-nb',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': '',
            },
            data: 'question=' + encodeURIComponent(question_text),
            onload: function (response) {
                if (response.status == 200) {
                    let obj = $.parseJSON(response.responseText) || {};
                    //console.log("题目:" + question_text + "的答案为:" + obj.data);
                    let data = obj.data;

                    for(var n = $('.question-option-item').length;n>0;n--){
                        if($('.question-option-item>label>span>div')[n-1].innerHTML.includes(data)){
                            $('.question-option-item>label>span>div')[n-1].click();
                            $('.questions-btn-box>button')[0].click()

                            sleep(500);
                            if($('.questions-btn-box>button>span')[0].innerHTML.includes("完成") || $('.questions-btn-box>button>span')[0].innerHTML.includes("下一题"))
                                $('.questions-btn-box>button')[0].click()
                            break;
                        }
                    }
                    if(n <= 0){
                        let msg = "对不起，未找到答案，问题 “"+question_text+"”的答案可能是："+data;
                        //console.log(msg);
                        //alert(msg);
                        if(warn)
                            alert(msg);
                        else
                            console.log(msg);
                    }
                }
            }
        });
    }

    function sleep(delay) {
        var start = (new Date()).getTime();
        while((new Date()).getTime() - start < delay) {
            continue;
        }
    }

    function c(){
        let num = 0;
        let a = 0;
        let max = $('.point-item-box').length;

        while(num<max && $('.point-item-box>div:first-child')[num].children[1].innerHTML == "100%"){
            num++;
        }

        while(num<max){
            let line = $('.point-item-box>div:first-child>span:first-child>span:last-child')[num].innerHTML;

            let reg = /（(\d{2})\:(\d{2})）/;

            let matches = reg.exec(line);
            if(matches){
                let m = parseFloat(matches[1]);

                let s = parseFloat(matches[2]);

                 a += m*60+s;
            }
            num++;
        }
        if($('video')[0]!==null)
            a-=parseInt($('video')[0].currentTime);
        if(a!=remain){
            let msg = "还有"+parseInt(a/3600)+":"+parseInt((a%3600)/60)+":"+(a%60)+"未看";

            if(warn)
                alert(msg);
            else
                console.log(msg);
            remain = a;
        }

    }

    window.onload=function(){


        var btn_only_video = document.createElement("li");
        btn_only_video.id='Only_Video_li';
        btn_only_video.className ='Only_Video_li_class';

        //倍速播放标签
        var quick_ddiv = "<div > <font face='微软雅黑' color='#238E23' size=4>全局倍速选择： </font>"
        +"<select class='select_class_name'>"
        +"<option value="+speed+" >"+speed+"</option>"
        +"<option value=1.25 id ='select_option_1id' class='select_option_125'>1.25（慢推荐）</option>"
        +"<option value=1.3 id ='select_option_1id' class='select_option_1'>1.3</option>"
        +"<option value=1.5 id ='select_option_1id' class='select_option_1'>1.5</option>"
        +"<option value=2 class='select_option_2'>2</option>"
        +"</select></div>";

        //增加倍速播放按键vjs-control-bar
        $('.preview_play-header').append(quick_ddiv);
        $(".select_class_name").change(function() {


            var str=0; //标白
            switch (speed){
                case 1.5:
                    str=2;break;
                case 2:
                    str=1;break;
                case 2.5:
                    str=0;break;
                case 1.25:
                    str=3;break;
                case 1:
                    str=4;break;
                case 0.5:
                    str=5;break;
            }
            $('video')[0].parentNode.children[8].children[str].style.color='white';

            speed = $(this).val();

            doplay();

        });
    }

})();