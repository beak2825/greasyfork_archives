// ==UserScript==
// @name             崩坏3视觉小说辅助
// @namespace        honkai_impact_3_visual_novel_helper
// @version          0.0.4
// @description      目前适合《逆熵》、《幽兰黛尔》；辅助模式：喜欢自己看剧情但担心忘记点成就点的模式，可以在百科按钮出现的第一时间自动帮你打开，不会干涉对话的点击；自动模式：只要挂机就好，对话和百科都会被快速的点击跳过，适合漏掉成就或者完全不想看剧情的人使用。
// @author           null
// @match            *://event.bh3.com/avgAntiEntropy/*
// @charset          UTF-8
// @grant            none
// @require          https://cdn.bootcss.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/399410/%E5%B4%A9%E5%9D%8F3%E8%A7%86%E8%A7%89%E5%B0%8F%E8%AF%B4%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/399410/%E5%B4%A9%E5%9D%8F3%E8%A7%86%E8%A7%89%E5%B0%8F%E8%AF%B4%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
//


(function () {
    $('body').append('<style> .btn {background-image: linear-gradient(#8eb349, #5f7c22); text-shadow: 0 1px 1px black;font-size: 24px;width:120px;height=50px} .ns * {color:#000;}</style>');
    $('body').append('<button class="btn" id="mode" style="position:fixed;top:10px;left:10px;z-index:9999">辅助模式</button>');
    $('body').append('<button class="btn" id="excute" style="position:fixed;top:50px;left:10px;z-index:9999">执行</button>');
    var mode = 0;
    var timer_fun = null;
    const time = 100;
    const autoTime = 100;
    var isPlay = 0;
    var auto_fun = function () {
        var next_fun = function () {
            timer_fun = setTimeout(auto_fun, autoTime);
        }
        if($('.main .cg').css('display') == 'block') {
            setTimeout(function () {
                $('.main .cg').click();
                next_fun();
            }, autoTime)
        }else if($('.main .cg').css('display') == 'none'){
            if ($('.dialog').css('display') == 'block'){
                if($('.remark_btn').css('opacity') == '1'){
                     setTimeout(function () {
                        $('.remark_btn').click();
                         setTimeout(function () {
                             $('.home_btn_remark').click();
                             setTimeout(function () {
                                 $('.dialog').click()
                                 next_fun();
                             }, autoTime);
                         }, autoTime);
                     }, autoTime)
                }else{
                    $('.dialog').click();
                    next_fun();
                }
            }else{
                 next_fun();
            }

        }
    }

    var autoRemark_fn = function () {
        if ($('.remark_btn').css('opacity') == '1' && $('.remark').css('display') == 'none') {
            $('.remark_btn').click();
            timer_fun = setTimeout(remarkClose_fn, time);
        } else {
            timer_fun = setTimeout(autoRemark_fn, time);
        }
    }

    var remarkClose_fn = function () {
        if ($('.remark_btn').css('opacity') == '0' && $('.remark').css('display') == 'none') {
            timer_fun = setTimeout(autoRemark_fn, time);
        } else {
            timer_fun = setTimeout(remarkClose_fn, time);
        }
    }

    $('#mode').click(function () {
        clearTimeout(timer_fun);
        $('#excute').html('执行');
        if ($(this).html() == '辅助模式') {
            mode = 1;
            $(this).html('自动模式');
        } else {
            mode = 0;
            $(this).html('辅助模式');
        }
    });

    $('#excute').click(function () {
        if (isPlay == 1) {
            clearTimeout(timer_fun);
            isPlay = 0;
            $('#excute').html('执行');
        } else {
            if (mode == 0) {
                timer_fun = setTimeout(autoRemark_fn, time);
                $('#excute').html('执行中');
            } else if (mode == 1) {
                timer_fun = setTimeout(auto_fun, time);
                $('#excute').html('执行中');
            }
            isPlay = 1;
        }//end else
    });//end function
})()
