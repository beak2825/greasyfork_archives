// ==UserScript==
// @name         ☄️动漫之家增强☄️
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  动漫之家去广告🚫，对日漫版漫画页进行增强：并排布局📖、图片高度自适应↕️、辅助翻页↔️、页码显示⏱、侧边目录栏📑、暗夜模式🌙，请设置即时注入模式以避免页面闪烁⚠️
// @author       Byaidu
// @match        *://*.dmzj.com/*
// @match        *://*.dmzj1.com/*
// @license      GNU General Public License v3.0 or later
// @resource     animate_css https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css
// @resource     element_css https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.js
// @require      https://cdn.jsdelivr.net/npm/jquery_lazyload@1.9.3/jquery.lazyload.min.js
// @require      https://unpkg.com/element-ui@2.15.0/lib/index.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421045/%E2%98%84%EF%B8%8F%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E5%A2%9E%E5%BC%BA%E2%98%84%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/421045/%E2%98%84%EF%B8%8F%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E5%A2%9E%E5%BC%BA%E2%98%84%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //去广告
    GM_addStyle('*[style*="2147"]{display:none !important;}')
    GM_addStyle('*[style*="hidden;border"]{display:none !important;}')
    GM_addStyle('*[style*="width:960px;height:180px"]{display:none !important;}')
    GM_addStyle('.ad_bottom_code{display:none !important;}')
    GM_addStyle('.ad{display:none !important;}')
    GM_addStyle('#app_manhua{display:none !important;}')
    //去二维码
    GM_addStyle('.footer{display:none !important;}')
    GM_addStyle('.foot{display:none !important;}')
    GM_addStyle('.float_code{display:none !important;}')
    //漫画页检测
    if(location.href.search(/\/\d+\.shtml/)>=0){
        //切换到上下滚动阅读
        if($.cookie('display_mode')==0){
            $.cookie('display_mode',1,{expires:999999,path:'/'});
            location.reload();
        }
        //修改滚动条样式
        GM_addStyle('::-webkit-scrollbar {width: 4px;height: 0px;}')
        GM_addStyle('::-webkit-scrollbar-thumb {background-color: rgb(48,48,48);border-radius: 2px;}')
        //修改element-ui样式
        GM_addStyle('.el-menu{border-right:0px !important;}')
        GM_addStyle('.el-drawer__wrapper{width:20%;}')
        GM_addStyle('.el-drawer{background:transparent !important;}')
        GM_addStyle('.el-drawer__body{background:rgba(0,0,0,.8) !important;overflow-y: auto}')
        //去除图片边框
        GM_addStyle('#center_box img{border:0px !important;padding:0px !important;}')
        //漫画双页排布
        GM_addStyle('.page_double #center_box{justify-content:center;flex-direction: row-reverse;display: flex;flex-wrap: wrap;}')
        GM_addStyle('.page_double #center_box img{height:100vh !important;}')
        //漫画上下间隔缩小
        GM_addStyle('.inner_img{margin-top:0px !important;user-select: none;}')
        GM_addStyle('.curr_page{padding:15px;height:unset !important;line-height:unset !important;}')
        //修改配色方案
        GM_addStyle('.r1{color:#4d4d4d !important;}')
        GM_addStyle('.hotrm_about{color:#4d4d4d !important;}')
        GM_addStyle('*[style*="display:inline;float:left"]{color:#4d4d4d !important;}')
        GM_addStyle('*[style*="display:inline;float:right"]{display:none !important;}')
        //去除图片点击样式
        GM_addStyle('.inner_img a{cursor:auto !important;}')
        //引入css
        const animate_css = GM_getResourceText("animate_css");
        const element_css = GM_getResourceText("element_css");
        GM_addStyle(animate_css);
        GM_addStyle(element_css);
        GM_addStyle(':root{--animate-duration:500ms;}')
        //隐藏顶栏
        GM_addStyle(".header-box,.funcdiv{display:none !important;}")
        //更改跨页
        GM_addStyle('.skip{display:none !important;}')
        //日间模式
        GM_addStyle(".mainNav,.header-box,.display_graybg,body{background:#edecea !important;}")
        //夜间模式
        GM_addStyle(".dark_mode .mainNav,.dark_mode .header-box,.dark_mode .display_graybg,.dark_mode body{background:#212121 !important;}")
        //读取cookie
        if ($.cookie('dark_mode') === undefined) { $.cookie('dark_mode',true,{expires:999999,path:'/'}); }
        if ($.cookie('page_double') === undefined) { $.cookie('page_double',true,{expires:999999,path:'/'}); }
        var dark_mode = $.cookie('dark_mode')=='true';
        var page_double = $.cookie('page_double')=='true';
        //暗夜模式
        if (dark_mode){
            $('html').addClass('dark_mode');
        }else{
            $('html').removeClass('dark_mode');
        }
        //双页显示
        if (page_double){
            $('html').addClass('page_double');
        }else{
            $('html').removeClass('page_double');
        }
        let img_id=0;
        let id_lock=0;
        let middle=0;
        let ch_id=0;
        let items=[];
        //延迟加载
        $(function delay(){
            //计算页数
            if (typeof(g_max_pic_count)=='undefined'){
                let parse=JSON.parse;
                JSON.parse=function(res){
                    let ret=parse(res);
                    if (ret.chapters!==undefined){
                        ret.chapters[0].data.reverse();
                        ret.chapters[0].data.forEach(function(item,index){
                            if (location.href.indexOf('https://manhua.dmzj.com/'+ret.comic_py+'/'+item.chapter_id+'.shtml?cid='+ret.id)>=0){
                                ch_id=index;
                            }
                            items.push({
                                title:item.chapter_title,
                                href:'https://manhua.dmzj.com/'+ret.comic_py+'/'+item.chapter_id+'.shtml?cid='+ret.id,
                            })
                        })
                    }
                    return ret
                };
                setTimeout(function(){
                    window.g_max_pic_count=$('.inner_img').length;
                    delay();
                    GM_addStyle('.el-menu>li:nth-child('+(ch_id+1)+'){background:rgba(255,165,0,.5) !important}')
                },1000)
                return;
            }
            //添加右下角菜单
            let info = `
<div id="info" @mouseover="show=1" @mouseleave="show=0">
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_page" class="info_item" @click="switch_page" style="cursor:pointer;">{{message_page}}</div></template></transition>
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_skip" class="info_item" @click="switch_skip" style="cursor:pointer;">{{message_skip}}</div></template></transition>
<transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
<template v-if="show"><div id="info_switch" class="info_item" @click="switch_night" style="cursor:pointer;">{{message_switch}}</div></template></transition>
<template><div id="info_count" class="info_item">{{message_count}}</div></template>
</div>`;
            let $info = $(info);
            $("body").append($info);
            let info_style = `
#info {
bottom: 2%;
right: 2%;
padding: 5px 5px;
background: rgba(48,48,48,.7) !important;
position: fixed;
color: rgba(255,255,255,.7);
border-radius: 3px;
}
.info_item{
padding:5px 0px;
width:120px;
}`;
            GM_addStyle(info_style);
            //vue绑定右下角菜单
            var info_app = new Vue({
                el: '#info',
                data: {
                    dark:dark_mode,
                    page:page_double,
                    show:0,
                    img_id:0,
                    skip:0,
                },
                computed: {
                    message_switch:  function () {
                        return this.dark?'☀️日间模式':'🌙夜间模式'
                    },
                    message_page:  function () {
                        return this.page?'1️⃣单页排布':'2️⃣双页排布'
                    },
                    message_skip:  function () {
                        return '📖更改跨页'
                    },
                    message_count:  function () {
                        return this.img_id+'/'+g_max_pic_count
                    }
                },
                methods:{
                    switch_night: function(){
                        this.dark=!this.dark
                        $.cookie('dark_mode',this.dark,{expires:999999,path:'/'});
                        if (this.dark){
                            $('html').addClass('dark_mode');
                        }else{
                            $('html').removeClass('dark_mode');
                        }
                    },
                    switch_skip: function(){
                        this.skip=!this.skip
                        if (this.skip){
                            $("#center_box>div:first-child").addClass('skip');
                        }else{
                            $("#center_box>div:first-child").removeClass('skip');
                        }
                    },
                    switch_page: function(){
                        this.page=!this.page
                        $.cookie('page_double',this.page,{expires:999999,path:'/'});
                        if (this.page){
                            $('html').addClass('page_double');
                        }else{
                            $('html').removeClass('page_double');
                        }
                        $("html").animate({scrollTop: $("#img_"+img_id).offset().top}, 0);
                    },
                }
            })
            //添加侧边目录栏
            let sidebar=`
<div id="sidebar" @mouseleave="drawer=false">
<div id="toggle" @mouseover="drawer=true" style="top:0px;left:0px;height:100vh;width:20vw;position: fixed;"></div>
<el-drawer
title="我是标题"
:size="size"
:modal="modal"
:visible="drawer"
:with-header="false"
:direction="direction"
@open="handleOpen">
<el-menu background-color="transparent"
text-color="#fff"
active-text-color="#ffd04b"
@select="handleSelect">
<template v-for="(item, index) in items">
<el-menu-item v-bind:index="index">{{item.title}}</el-menu-item>
</template>
</el-menu>
</el-drawer>
</div>`
            let $sidebar = $(sidebar);
            $("body").append($sidebar);
            //vue绑定侧边目录栏
            var sidebar_app = new Vue({
                el: '#sidebar',
                data: {
                    drawer: false,
                    size:'100%',
                    modal:false,
                    direction: 'ltr',
                    items: items,
                },
                methods:{
                    handleSelect(key) {
                        location.href=this.items[key].href;
                    },
                    handleOpen() {
                        setTimeout(function(){
                            $('.el-drawer__body').animate({scrollTop:0}, 0);
                            $('.el-drawer__body').animate({scrollTop:$('.el-menu>li:nth-child('+(ch_id-1)+')').offset().top-$('.el-drawer__body').offset().top}, 0);
                        },0)
                    },
                }
            })
            //加载目录
            GM_xmlhttpRequest({
                method: "GET",
                headers: {"User-Agent": navigator.userAgent},
                url: $('.btn2').attr('href'),
                onload: (res) => {
                    let response = res.response
                    var el = $( '<div></div>' );
                    el.html(response);
                    let $border=$('.cartoon_online_border a', el);
                    $.each($border,function(index){
                        if (location.href.indexOf(this.href)>=0){
                            ch_id=index;
                            GM_addStyle('.el-menu>li:nth-child('+(ch_id+1)+'){background:rgba(255,165,0,.5) !important}')
                        }
                        sidebar_app.items.push({
                            title:this.text,
                            href:this.href,
                        })
                    })
                }
            })
            //预加载图片
            $('img').lazyload();
            //去除原来的jquery事件
            jQuery = unsafeWindow['jQuery'];
            if (jQuery!==undefined){
                jQuery("body").off("keydown");
                jQuery(".inner_img a").off("click");
            }
            //上下方向键滚动页面，左右方向键切换章节
            function scrollUp(){
              if (info_app.img_id==0) return;
              var id=g_max_pic_count+1;
              for (var i=1;i<=Math.min(info_app.img_id,g_max_pic_count);i++){
                var $img=$(".inner_img:eq("+(i-1)+")");
                if (((id_lock&&info_app.img_id>=1&&info_app.img_id<=g_max_pic_count)?$(".inner_img:eq("+(info_app.img_id-1)+")").offset().top:pageYOffset)<$img.offset().top+$img.height()+5){
                  id=i;
                  break;
                }
              }
              var $img=$(".inner_img:eq("+0+")");
              if (((id_lock&&info_app.img_id>=1&&info_app.img_id<=g_max_pic_count)?$(".inner_img:eq("+(info_app.img_id-1)+")").offset().top:pageYOffset)<$img.offset().top+5){
                console.log($img.offset().top+5);
                id=0;
              }
              var $img=$(".inner_img:eq("+(g_max_pic_count-1)+")");
              id_lock++;
              info_app.img_id=id;
              var $img=$(".inner_img:eq("+(id-1)+")");
              $("html").stop();
              if (id==0){
                $("html").animate({scrollTop: 0}, 500);
              }else{
                var $img=$(".inner_img:eq("+(id-1)+")");
                $("html").animate({scrollTop: $img.offset().top}, 500);
              }
              setTimeout(function(){id_lock--;},500);
            }
            function scrollDown(){
              if (info_app.img_id==g_max_pic_count+1) return;
              var id=g_max_pic_count+1;
              for (var i=Math.max(info_app.img_id,1);i<=g_max_pic_count;i++){
                var $img=$(".inner_img:eq("+(i-1)+")");
                if (((id_lock&&info_app.img_id>=1&&info_app.img_id<=g_max_pic_count)?$(".inner_img:eq("+(info_app.img_id-1)+")").offset().top:pageYOffset)<$img.offset().top-5){
                  id=i;
                  break;
                }
              }
              id_lock++;
              info_app.img_id=id;
              var $img=$(".inner_img:eq("+(id-1)+")");
              $("html").stop();
              if (id==g_max_pic_count+1){
                var $img=$(".inner_img:eq("+(g_max_pic_count-1)+")");
                $("html").animate({scrollTop: $img.offset().top+$img.height()}, 500);
              }else{
                var $img=$(".inner_img:eq("+(id-1)+")");
                $("html").animate({scrollTop: $img.offset().top}, 500);
              }
              setTimeout(function(){id_lock--;},500);
            }
            $("#center_box").click(function(event){
                if (event.clientY>$(window).height()/2){
                    scrollDown();
                }else{
                    scrollUp();
                }
            })
            $("body").keydown(function(event) {
                if (event.keyCode == 38) {
                    scrollUp();
                } else if (event.keyCode == 40) {
                    scrollDown();
                } else if (event.keyCode == 37) {
                    let location_new = $("#prev_chapter").attr("href");
                    if(location_new.indexOf("shtml")>=0)
                        location.href = location_new;
                } else if (event.keyCode == 39) {
                    let location_new = $("#next_chapter").attr("href");
                    if(location_new.indexOf("shtml")>=0)
                        location.href = location_new;
                }
            })
            //resize事件触发图片和浏览器对齐
            $(window).resize(function() {
                $("html").animate({scrollTop: $(".inner_img:eq("+(info_app.img_id)+")").offset().top}, 0);
            })
            function getID(){
              var id=0;
              for (var i=1;i<=g_max_pic_count;i++){
                var $img=$(".inner_img:eq("+(i-1)+")");
                if (pageYOffset>$img.offset().top-5&&pageYOffset<$img.offset().top+$img.height()-5){
                  id=i;
                  break;
                }
              }
              var $img=$(".inner_img:eq("+(g_max_pic_count-1)+")");
              if (pageYOffset>$img.offset().top+$img.height()-5){
                id=g_max_pic_count+1;
              }
              if (id_lock==0) info_app.img_id=id;
            }
            setInterval(getID,100);
            window.addEventListener('mousewheel', getID);
            })
    }
})();