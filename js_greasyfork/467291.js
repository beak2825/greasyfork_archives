// ==UserScript==
// @name         智慧校园BUG_0_01
// @namespace    刷新
// @version      0.2.5
// @description  1：刷易班网薪免费每天30==>提示更人性化  2: 查看德智体美劳分别成绩是多少  3: 刷3.0思政课  4:智慧3.0教师自动评价  以上都是免费🤞
// @author       You
// @match        https://my.gdip.*
// @match        https://s.yiban.cn/*
// @match        https://study.gdip.edu.cn/*
// @match        https://my.gdip.edu.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467291/%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%ADBUG_0_01.user.js
// @updateURL https://update.greasyfork.org/scripts/467291/%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%ADBUG_0_01.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fenshu() {//计算3.0一共多少分
        window.setTimeout(function () {//当前函数延迟执行调试用
            $('[src]').attr('src', 'https://tb2.bdstatic.com/tb/img/single_member_100_8a10f9f.png');
            let DYtexts = [];
            let ZYtexts = [];
            let TYtexts = [];
            let MYtexts = [];
            let LYtexts = [];
            let DYcps = 0;//定义德育测评
            let ZYcps = 0;//定义德育测评
            let TYcps = 0;//定义德育测评
            let MYcps = 0;//定义德育测评
            let LYcps = 0;//定义德育测评

            for (let i = 0; i <= 99; i++) {
                let text = $(`[class="el-table_1_column_2   el-table__cell"]:eq(${i})`).text();
                let MYcpint = $(`[class="el-table_1_column_6   el-table__cell"]:eq(${i})`).text();
                if (text.search('德育') != -1) {
                    DYtexts.push(text + '-' + MYcpint + '\r');
                    $(`[class="el-table_1_column_2   el-table__cell"]:eq(${i})`).css('background-color', 'brown')
                    // alert(i + text + '--' + MYcpint)
                    DYcps += parseFloat(MYcpint)
                }
                if (text.search('智') != -1) {

                    ZYtexts.push(text + '-' + MYcpint + '\r');
                    ZYcps += parseFloat(MYcpint)
                }
                if (text.search('体育') != -1) {
                    TYtexts.push(text + '-' + MYcpint + '\r');
                    TYcps += parseFloat(MYcpint)
                }
                if (text.search('美育') != -1) {
                    MYtexts.push(text + '-' + MYcpint + '\r');
                    MYcps += parseFloat(MYcpint)
                }
                if (text.search('劳育') != -1) {
                    LYtexts.push(text + '-' + MYcpint + '\r');
                    LYcps += parseFloat(MYcpint)
                }

            }
            alert(
                '德育总分' + DYcps +
                '智育总分' + ZYcps +
                '体育总分' + TYcps +
                '美育总分' + MYcps +
                '劳育总分' + LYcps
            );
        }, 100);
    }

    window.setTimeout(function () {
        $('[class="common_title"]').append('<a class="cc">每页显示设置最大再点击此按钮---如果超过一百条活动两页相加即为总分</a>');
        $('[class="cc"]').click(function () {
            fenshu();//计算3.0德智体美劳分数
        });
    }, 100);

    window.setTimeout(function () {
        $('[class="common_title"]').append('<a class="cc">每页显示设置最大再点击此按钮---如果超过一百条活动两页相加即为总分</a>');
        $('[class="cc"]').click(function () {
            fenshu();//计算3.0德智体美劳分数
        });
    }, 100);

    /////////////////////////////////////////////////////以上是计算德智体美劳
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////以下是刷史政课堂

    window.setTimeout(function () {
        $('[class="course-title"]:eq(0)').append('<a class="cc">默认(启动逐个视频观看)三分钟自动点击第一个未刷视频当你看到此行字的时候已经开始刷了《《点击此行文字启动快速刷视频模式！！！！出了任何后果与作者无关免责声明！！！！》》</a>');
        setInterval(function () {
            // alert('12')
            $('[class="chapter-status unfinished"]:eq(0)').click();



        }, 180000);//默认美3分钟刷新一下

        $('[class="cc"]').click(function () {
            setInterval(function () {
                $('[class="chapter-status unfinished"]:eq(0)').click();
                function skip() {
                    let video = document.getElementsByTagName('video')
                    for (let i = 0; i < video.length; i++) {
                        video[i].currentTime = video[i].duration
                    }
                }
                setInterval(skip, 200)
            }, 3000);//快速模式一秒一个视频

        });

    }, 100);

    ///////////////////////////3.0自动评论教师
    ////////////////////////想改其它分数改成  把中括号内前10位把0改成1/2都可以
    let input=[0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,5,5,5,5,5];
    let zz = 0;
    window.setTimeout(function () {//3.0自动评论
        $('[class="el-form-item__content"]').each((_, el) => {
            const radios = $(el).find('input');
            zz=zz+1
            radios[input[zz]].click();
        })
    }, 3000);
    ///////////////////



    /////////////////////////////////////////////////////以上是刷史政课堂
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////以下是刷易班网薪


    function unlock_android_phone() {//易班网新30
        let texts = $('[class="actions"]').find('[class="like"]').text();
        let arr = [];
        while (arr.length < texts.length) {
            let num = Math.floor(Math.random() * texts.length);
            if (!arr.includes(num)) {
                arr.push(num);
            }
        }
        arr.sort((a, b) => a - b);
        if (texts.length == 0) {
            alert('关闭此对话框！！！请点击蓝色文字！！！在最上面')
            $('[class="category"]').append('<a class="cc">出现此行说明脚本正常==》弹窗未出现60请点击此行文字方可</a>');
            $('[class="cc"]').click(function () {
                $(document).scrollTop(25000);

                window.setTimeout(function () {//易班网新30
                    unlock_android_phone();//易班网新30
                }, 3000);
            });
        } else {
            alert("当前贴可刷赞数量是-->>" + texts.length / 3 + "<<--如果现实此行文字就不要点击蓝色文字了")
            $(document).scrollTop(85000);
        }

        for (let j = 0; j < arr.length; j++) {
            (function (j) {
                setTimeout(() => {
                    // alert(arr[j])
                    $('[class="btn"]:even')[j].click()
                }, j * 5000);
            })(j)
        }
    }
    window.setTimeout(function () {//易班网新30


        unlock_android_phone();//易班网新30
    }, 5000);

    /////////////////////////////////////////////////////以上是刷史政课堂
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

})();