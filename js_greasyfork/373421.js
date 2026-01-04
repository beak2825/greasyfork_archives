// ==UserScript==
// @name         微信网页版实用工具
// @version      0.9.1
// @author       Hejmjp
// @description  微信网页版更换背景图片、去除下载客户端的按钮、可以随意显示或隐藏对话窗口
// @grant        none
// @match        https://wx.qq.com/*
// @requier      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @namespace https://greasyfork.org/users/220353
// @downloadURL https://update.greasyfork.org/scripts/373421/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/373421/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==



// 微信网页版
    if( location.href.match("wx.qq.com") ){



        // 微信网页版，去除下载客户端的按钮
        $('.download_entry').remove();
        $('.panel.give_me .nav_view').css('top', '155px')



        // 网页加载成功后，立即关闭 <右侧的对话区域>
        $('#chatArea').hide();




        // 利用 NickName 关闭/打开 <右侧的对话区域>
        let ON = true;
        $('.header .nickname span').click(function(){

            if( ON ){
                $('#chatArea').fadeOut();
                ON = false;
            }else{
                $('#chatArea').fadeIn();
                ON = true;
            }
        })

        // 单击左侧好友列表，展开 <右侧的对话区域>
        $("#J_NavChatScrollBody>div").click(function(){
            $('#chatArea').show();
            ON = true;
        })


    


        // 更换背景图片,所有图片共28张 来源于 https://web2.qq.com/img/bg/“+“ i ”+”.jpg

        // 页面刷新后，首先随机显示一张背景图
        let i = Math.ceil(Math.random() * 10) ; // 取一个随机数
        $('body').css("background-image", "url(https://web2.qq.com/img/bg/" + i + ".jpg)");


        // 增加手动更换背景图片的按钮
        let html = "<div id=" + "background_nav" + "><span class=" + "priv" + "> </span><span class="+ "num" +"></span><span class=" + "next" + "></span></div>"
        $('.copyright').html(html);
        $('.copyright').css({'float':'right'});
        $('#background_nav .num').text(i + "/28");
        $('.copyright').css({'font-size':'14px', 'line-height': '18px'})
        $('#background_nav').css({ 'float':'right', 'margin-right': '220px' });

        $('#background_nav .priv').css({'display':'block','float':'left','width': '19px', 'height': '19px', 'background-image': 'url(https://web2.qq.com/css/image/arrow.png)', 'background-position': '-2px -2px'});
        $('#background_nav .next').css({'display':'block','float':'left','width': '19px', 'height': '19px', 'background-image': 'url(https://web2.qq.com/css/image/arrow.png)', 'background-position': '-24px -2px'});
        $('#background_nav .num').css({'display':'block','float':'left', 'height': '19px', 'color': 'white'});





        let end = 28; // 设置背景图片总数

        // 点击 <- 执行的动作，切换到上一张图片
        $("#background_nav .priv").click(function(){
            if(i==1){
                i = end;
            }else{
                i --;
            }
            $('body').css("background-image", "url(https://web2.qq.com/img/bg/" + i + ".jpg)");
            $('#background_nav .num').text(i + "/28");
            console.log( i );

            // 切换背景时，隐藏<右侧的对话区域>
            $('#chatArea').fadeOut();
            ON = false;
        });

        // 点击 -> 执行的动作，切换到下一张图片
        $("#background_nav .next").click(function(){
            if( i==end ){
                i = 1;
            }else{
                i ++;
            }

            $('body').css("background-image", "url(https://web2.qq.com/img/bg/" + i + ".jpg)");
            $('#background_nav .num').text(i + "/28");

            console.log( i );

            // 切换背景时，隐藏<右侧的对话区域>
            $('#chatArea').fadeOut();
            ON = false;


        });

        // 给切换背景图片的按钮，增加一点触感反馈
        $('#background_nav .priv').hover(function(){
            $(this).css({'background-position': '-2px -42px'});
        }, function(){
            $(this).css({'background-position': '-2px -2px'});
        })

        $('#background_nav .next').hover(function(){
            $(this).css({'background-position': '-25px -42px'});
        }, function(){
            $(this).css({'background-position': '-25px -2px'});
        })




        // 每隔5分钟，背景图片更换一次，所有图片共28张 来源于 https://web2.qq.com/img/bg/“+“ i ”+”.jpg
        setInterval(function(){

            if( i < end ){
                i++
            }else{
                i = 1;
            }
            $('body').css("background-image", "url(https://web2.qq.com/img/bg/" + i + ".jpg)");
            $('#background_nav .num').text(i + "/28");

            console.log( i );
        }, 1000 * 60 * 5);



        // 点击.num，让对话框及左侧导航隐藏或者显示

        ON = false;
        $('#background_nav .num').click(function(){

            console.log( ON );


            if( ON ){
                $('.main_inner').show();
                $('#chatArea').hide();
                $('.panel').fadeIn();


                ON = false;

                console.log("hello");
            }else{

                $('.main_inner').fadeOut();

                ON = true;
            }

            console.log( ON );


        })


        // 单击 F 全屏
        let Full_ON = true;
        $('body').keypress(function(ev){
            // console.log( ev.keyCode );
            if( ev.keyCode === 102 ){
                if( Full_ON ){
                    var docElm = document.documentElement;
                    if (docElm.requestFullscreen) {
                        docElm.requestFullscreen();
                    }
                    else if (docElm.msRequestFullscreen) {
                        docElm.msRequestFullscreen();
                    }
                    else if (docElm.mozRequestFullScreen) {
                        docElm.mozRequestFullScreen();
                    }
                    else if (docElm.webkitRequestFullScreen) {
                        docElm.webkitRequestFullScreen();
                    }
                    Full_ON = false;
                }else{
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                    else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    Full_ON = true;
                }
            }
        }) // 单击 F 全屏






    } // if 微信网页版 结束
