// ==UserScript==
// @name         xiuzhan-sulen
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  哈哈哈哈 Try to take over the world!
// @author       sulen
// @match        https://www.xiuzhan365.com/*
// @icon         https://www.xiuzhan365.com/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.0.0.min.js
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/514443/xiuzhan-sulen.user.js
// @updateURL https://update.greasyfork.org/scripts/514443/xiuzhan-sulen.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';

    // Your code here...
    var contentElement = document.createElement('div');
    contentElement.innerHTML = "<div class='sulen'><p class='title'><span style='float:left'>秀展助手</span><span style='float:right' id='button_item'></span></p><div id='sulen_item' style=''></div></div>";
    document.body.appendChild(contentElement);
    const login_div = document.createElement('div');

    const setting_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAw9JREFUWEfFl8urzVEUxz/fIVJS8ogiMwYGcokSeWXiUlyvS5kbkDtxDbgDpIjyB5A3d+AxkVduyjsDAwZKKfKY6JZQJstvaf9O++6zzzm/q9O9u06d3++31trfvdZ3f/faYhjDzCYAe4CNwNzE9StwFjgmabBqWFU1dDszWw9cb+GzQdKNqnGbAggT+qoHJH0ws4fF/2XAH+BJZhL/5rbLzWxmsB1sBigLwMzmAOeA+dEkv4v0jgnPHyTNigFE4Px1bOvPr4Cdkt6moOsAhMmvZWoc+z6VtLgJgFwF3gBdKYghADKT9wE/gOPAd+B2+D2T9D4BMBtYBKwNv4lADzC+oM/BYFsHIgXwHOgIxn2SDgXybQceOw+qkCvUf4mki8Hf45QgXkhaWMapATCzFcD9dPIqE1axMbMYxEpJD9wvBrAJ8Nr76JF0okrgqjZmti+U0l2cC/0pgOnAxyhgd5nCdBIzWxVIWu4SZ/kbSfdygMzMS3gh+jZD0qchAEKtfgJjA+E6UqIFm0vA1gYrvyxpWwawE/QF4MT8JWlcjQNmNqlA7+n3nwuJj4uSujOBrErKVbA34+sZ8Ez4GCgy6CXol5ntBk4nDnXpN7Ne4HBk1wU8Cs9LI/74qwOSjsQxM2Xwz3sdQCmvjqocu+ItZ2argTu1tGVWGMoTZ2hNIVZ3S5+wNc9Ec3i23zmA0umfhudSbGb7gXJFnZJuNbBbB9wM33olHW1gVy6aqgCuAJtDsGmSvjQIPBX4HL5dlbSlXQDOAyUpp0j61iDwZMD7Ah8Xil20o10AvAk5GYLVRCQNbmaxmO2VdKoKgPiM9/R5erclJHThqREqt80yJFwdC1MzElbdhqkAdQIvwwoXROTzV3WC1Gwbjq4QJWJRRYpTQYpD1AlQKE1jKY6EYjiHkQuTH0Tzgv9rb7ti4UkW1vowShg8Ksfx6DYkoVaj15IFAN6Oxx3xyDalDUDkxKzu4EruBTmf1m15tCNaXUxaAfj/i0myffwumLuaxb1D7NKeq1kuf6E8I3s5zZx2bb+e/wXE6c3KUDnSfgAAAABJRU5ErkJggg==";
    const logout_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAxVJREFUWEe9l02ITWEYx3//DVFIrMSEfJeFomjyVVN2NEnjI6F8DKWmfCwwociCiELGhlkgCVkYGxmmRBkLZaGU8bERSWRj8zjP9J7pzLnn3nvuPTPeOt17z30+/u/7Ph//R+RcZjYGaAJagFnARGAC8BfoSzxPJD3IaRZVEzSzucBeYD0wvpp8+P87cBPoktRVSaciADM7EZyPTRnxXX8Nz8jI2WxgRBlHpyUdLAeiLAAzewYsTSi+BvxoH0l6mTZoZg7CnznALmB6Qua5pMYsEJkAzOxbuGPX+RId/XnggiTfedVlZpOBdmBnUlhSib+SF2b2AZgaFHuAHZLeVfWaIWBm6wKQ+YBvapqkP4NAJX+Y2W3AlXwdjwAfq8dxyqYHrtvsldSbtjdwAiHgDgeBTklbijrPo98PIKTaC8Cj3e+8UdKnPAaKysQALkUptTsYOyDpTFHDsb6ZeTwdBZ5KulZyBWY2DvgI+Ken2pK80Z4HpJntAS4G2UOSTg0KQjPbHOVsZ3hZsWjkcZiWMbNVXjsS79skeVr3L5nZHWBt+L1SUnc9jirphHT0DItXq6QrMQA/9gXeVKLj8bI6LCsDxFZJ1/0EPNqnAJ8lNZTzbmYbQqktCtADMl4tDsAr02jglaRFWdajQD0HtBX1nKHflxdAK3B5GAB013IFTkImFQSxPNKPy7uTmGYH8L+C0B3H9/8LWOMZ5wBuBZrlm1uc1esL7tpLfdK5m2uWdD9Ow2bgbnAyJB0wCdjMkvb9r23Jkuwn4GTTS7G3zeEoxduBqwHUPklnkwD/RzNaAXh6v5d0L32d5dpxU70sqNZ4KUdIeiQtq9VYPfKDOGGKCQ9ZQJqZX8MPSW8yryAVtUlG7G26vV52ZGYLgf0hzX8CDZJ+lwRhGlWKGddDyz2j3LE/AwNLLloeg0kxZH/tKfoYeJjFGSL5eYCPcTMAJ7T+PV43JG3KipGhGM1GATMrjGYnJR0pF6C1DKcbA2/MG+wdUfPqyJoFqsZAlodAXld7EwlzXzyeW5h6PHjfOvsFuiV5t6u6/gFVZi5Ib4A1vwAAAABJRU5ErkJggg==";
    $("#button_item").html("<a style='margin-right:20px' href='#' id='setting' title='设置'><img style='width:16px' src='"+setting_img +"'></a><a href='#' id='logout' title='退出'><img style='width:16px' src='"+logout_img +"'></a>");
    const div = document.createElement('div');
    let module = document.URL.split("/")[3].split(".")[0];
    div.innerHTML = `<div id="setting_item"style=""></div>
        <div>
            <p style="margin:15px 0;">当前页面：${module}</p>
            <p id='action_msg' style='overflow: auto; max-height:600px;text-align:left'></p>
        </div>`;

    $('#sulen_item').html(div);

    //页面动作
    if(module == 'login'){//登录页面
        setTimeout(function() {
            console.log($(".to-otherlogin")[0].firstChild.click())
        },1000);

    }else if(module == 'readDraft'){//如果是播放页面
        var methord = 1;//1.删除(水印div、播放控件div)。2.隐藏(水印div、播放控件div，移动鼠标会失效)
        //
        var check_play_ready_timer = setInterval(function(){//检测预览时的框架页面，并跳转
            var playbt = document.getElementsByClassName('playButton');
            if(playbt.length>0){
                console.log('可以播放了',playbt);
                if(methord==1){
                    var element = document.getElementById("moveMask");
                    element.parentNode.removeChild(element);

                    element = document.getElementsByClassName("Player")[0];
                    element.parentNode.removeChild(element);

                    element = document.getElementsByClassName("UserMask")[0];
                    element.parentNode.removeChild(element);



                }else if(methord==2){
                    document.getElementsByClassName('zoom')[0].click();//全屏失效，因为全屏只能被用户点击生效
                    document.getElementsByClassName("playButton")[0].style.display='none';//隐藏中间的播放按钮
                    document.getElementsByClassName("move-mask")[0].children[0].style.display='none'//隐藏随机水印logo
                    document.getElementsByClassName("controlPanel")[0].style.display='none';//隐藏播放控制面板
                    document.getElementsByClassName("playerBgShadow")[0].style.display='none';//隐藏播放控制条阴影
                    document.getElementsByClassName("PreviewMask")[0].style.display='none';//隐藏旗舰素材水印
                }else{
                    console.log('乖乖，你没指定清屏方法呀');
                }
                window.clearInterval(check_play_ready_timer);
            }
        },1000);

        const span = document.createElement('span');
        span.innerHTML = `<button id="sulen" onclick="toggleFullScreen2()">全屏</button>`;
        $('#action_msg').html(span);
        $('#sulen').click(function (){
            document.getElementsByClassName("sulen")[0].style.zIndex = 0;//隐藏中间的播放按钮
                var t = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
                  , e = document.documentElement;
                t ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : e.requestFullscreen ? e.requestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen && e.webkitRequestFullScreen();

        });


    }


    //读取草稿，显示在工具界面
    setTimeout(function() {
        var elms = $(".info-panel");//document.getElementsByClassName("item-panel");
        //console.log(elms);//$(".item-panel").children('title-panel').text());
        var times = $(".frontCover-panel");
        var bts = $(".preview");

        for(var i=0; i<elms.length;i++){
            //console.log(elms[i].firstChild.outerText);
            //console.log(elms[i].lastChild.outerText);
            $('#action_msg').append(`<div class='item' onclick='showq(${i})'>
                <span class='item_t1'>${elms[i].firstChild.outerText}</span>
                <span class='item_t2'>${times[i].children[1].outerText}</span>
                <span class='item_t3'>${elms[i].lastChild.outerText}</span>`);
        }
        $('#action_msg').append(`
        <script>
        function showq(i){
            var bts = document.getElementsByClassName("preview");
            bts[i].click();

            setInterval(function(){//检测预览时的框架页面，并跳转
                var iframe = document.getElementsByTagName('iframe')[0];
                if(iframe){
                    window.location.href = iframe.contentWindow.location.href;
                    for (var i = 1; i < 99999; i++) window.clearInterval(i);
                }
            },1000);
        }</script>`);

    }, 1000);//稍晚一点


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
                border-bottom: 1px solid #333;
                padding: 10px;
                border-radius: 5px;
            }
            .sulen .item:hover{
                color:#fff; background-color:#006;
            }
            .sulen .item .item_t1{
                color:#fff;display:block;padding-bottom: 5px;
            }
            .sulen .item .item_t2{
                color:#f00;font-size:13px;text-align: left;display: inline-block;width: 50px;
            }
            .sulen .item .item_t3{
                color:#555; font-size:12px;text-align: right;display: inline-block;width: calc(100% - 60px);
            }

           /* 滚动条 */
            #action_msg::-webkit-scrollbar {
                width: 1px; /* 滚动条的宽度 */
            }
            #action_msg::-webkit-scrollbar-thumb {
                border-radius: 1px;
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
                background: #338fff; /* 滑块的颜色 */
            }
            #action_msg::-webkit-scrollbar-track {
                border-radius: 3px;
                background: #fff; /* 轨道的颜色 */
            }
        </style>`;
    var sulen_script = `
        <script type="text/javascript"></script>`;
    head.innerHTML += sulen_css;
    head.innerHTML += sulen_script;
})();