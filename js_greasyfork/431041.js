// ==UserScript==
// @name         百度搜索去广告
// @namespace    http://tampermonkey.net/
// @version      0.35
// @description  去除百度搜索以及其它百度产品页面广告
// @author       大笨峰
// @match       *://www.baidu.com/*
// @match        https://*.baidu.com/*
// @icon         https://static.7ait.com/2021/06/18/0bfcf6fbd3dfd.jpg

// @grant        none
//@run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/431041/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/431041/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if(typeof jQuery != 'undefined'){

        $(document).ajaxSuccess( ()=> {
            search_main()

        }
                               )}
    //全局定义按钮
    let btn_color;
    //按钮颜色切换
    let btn_hover=(original,hover)=>{
        btn_color.css('background', original)
        btn_color.hover(()=>{
            btn_color.css('background',hover)
        },()=>{
            btn_color.css('background', original)
        }
                       )
    }
    //切换按钮
    let btn_toogle=()=>{
        if($('#change').length==0){
            btn_color=$("<button>切换主题</button>")
            let document1=$('#wrapper_wrapper')
            document1.append(btn_color);
            btn_color.css('position',"fixed")
            btn_color.css("right","0px")
            btn_color.css("float","right")
            btn_color.css("top","10%")
            btn_color.css('borderRadius', '10px')
            btn_color.css('padding', '10px')
            btn_color.css('cursor', 'pointer')
            btn_color.css('border', '0')
            btn_hover("gold","grey")
            btn_color.attr('id', 'change')
            btn_color.click(()=>{
                click_change()

            })
        }
    }
    //切换颜色实现
    let click_change=()=>{
        if((localStorage.getItem("color")==0)){
            localStorage.setItem("color", "1");
            btn_hover('pink','gery')
            change_color("GhostWhite",'Lavender','Pink','HotPink','	HotPink','DeepPink','	Pink','MediumVioletRed')
        }else{
            localStorage.setItem("color", "0");
            btn_hover("gold","grey")
            change_color("rgb(255,248,220, 0.4)",'OldLace','PeachPuff','Coral','LightSalmon','SandyBrown','Orange','red')

        }
    }
    //根据localstorage判断颜色
    let judge_color=()=>{
        if((localStorage.getItem("color")==1)){
              btn_hover('pink','gery')
            change_color("GhostWhite",'Lavender','Pink','HotPink','	HotPink','DeepPink','	Pink','MediumVioletRed')
        }else{
            btn_hover("gold","grey")
            change_color("rgb(255,248,220, 0.4)",'OldLace','PeachPuff','Coral','LightSalmon','SandyBrown','Orange','red')

        }
    }
    //改变颜色
    let change_color=(main_page,page_top,input_border,search_button,search_text,result_title,page_no,high_light)=>{
        //整页
        $("#wrapper_wrapper").css('backgroundColor',main_page)//rgb(255,248,220, 0.4)
        //页面底部分页
        $("#page").css('backgroundColor',main_page)
        //页面底部
        $("#foot").css('backgroundColor',main_page)
        //搜索结果分类
        $(".s_tab").css('backgroundColor',main_page)
        //搜索结果分类选项内容
        $(".s_tab_inner").css('margin-top','5px')
        //页面顶部
        $(".s_form").css('backgroundColor',page_top)//OldLace
        //搜索文本框border颜色
        $(".s_ipt_wr").css('border-color',input_border)//PeachPuff
        //搜索按钮颜色
        $("#su").css('backgroundColor',search_button)//Coral
        //搜索文字颜色
        $("#kw").css('color',search_text)//LightSalmon
        //搜索结果标题文字颜色
        $("a").css('color',result_title)//SandyBrown
        //被选中的页码背景色
        $("strong").css('backgroundColor',page_no)//Orange
        //搜索关键字高亮
        $('em').css("color",high_light)//red
    }
    //去除底部相关推荐
    let bottom_info = () => $("#rs").remove();
    //去除右侧推荐
    let remove_right=()=>  $("#content_right").remove();
    //主页面
    let search_main = () => {
        btn_toogle()

        //当前处于搜索网页而不是咨询或视频
        //不能把 || 放到前面，必须放到后面或用括号包起来，不然会直接返回不会判定后面的条件
        if (window.location.href.includes('www.baidu.com') &&document.querySelector(".cur-tab").innerText==="网页"&& (window.location.href.includes('wd')||window.location.href.includes('word'))) {
          judge_color()
            bottom_info()
            remove_right()
            //获取搜索结果列表dom
            let search_content = $("#content_left");
            //循环搜索结果
            search_content.children().each(function () {
                //因为广告条目的最上级div没有class，所以判空class来去除
                if ($(this).attr('class') == null) {
                    //用remove会导致显示异常，烦
                    $(this).hide()
                }

                //修改内边距
                $(this).css('padding', '10px')
                //修改结果背景
                $(this).css('background', 'rgb( 	245,255,250,0.5)')
                //修改边框圆角
                $(this).css('borderRadius', '10px')
                //鼠标移入添加边框阴影
                $(this).mouseover(() => $(this).css('box-shadow', "0px 0px 10px 10px rgb( 119,136,153, 0.2)"))
                //鼠标移出去除边框阴影
                $(this).mouseout(() => $(this).css('box-shadow', ""))

            })

            setInterval(function () {
                // 搜索结果延迟条目广告
                $("a").each(function () {
                    if ($(this)[0].innerHTML === '广告') {
                        $(this).parents(".result").remove();
                    }
                })
            }, 1000);

        }

    }

    //资讯页面
    let information_page = () =>{
        bottom_info()
        remove_right()

    }

    function no_jq_remove_ad(class_name){
        let ads=document.querySelectorAll(`.${class_name}`)
        ads.forEach(function(e){
            e.parentNode.style.display="none"})
    }

    //知道页面
    let known_page = () =>{
        if (window.location.href.includes('zhidao.baidu.com') ) {
            //搜索列表广告
            no_jq_remove_ad("bannerdown")
            //$(".bannerdown").remove()
            //底部信息
            // $(".c-container").remove()
            no_jq_remove_ad("c-container")

            //去除右边栏
            //$(".aside-inner").remove()
            no_jq_remove_ad("side-inner")

        }}
    //文库页面
    let wenku_page = () =>{
        if (window.location.href.includes('wenku.baidu.com') ) {
            //搜索列表广告
            setTimeout(function () {
                //底部信息
                $(".search-relative-wrapper").remove()
                $(".adlist-wrap").remove()
                //搜索结果最上边的广告
                $(".fc-first-result-wrap").remove()
                ///百度推广
                $(".channel-dsp-search-wrap").remove()
            }, 1000);

        }}
    //贴吧页面
    let tieba_page = () =>{
        if (window.location.href.includes('tieba.baidu.com') ) {
            setTimeout(function () {
                //右侧广告
                $(".fengchao-wrap").remove()
                //帖子列表广告
                $(".fengchao-wrap-feed").remove()
            }, 1000);
        }}
    //百度百科
    let baike_page = () =>{
        if (window.location.href.includes('baike.baidu.com') ) {
            setTimeout(function () {
                //右侧广告，特别烦
                $(".union-content").remove()
                //右下角广告
                $(".right-ad").remove()
                //最下广告
                $(".after-content").remove()
            }, 1000);

        }
    }
    //百度经验
    let jingyan_page = () =>{
        if (window.location.href.includes('jingyan.baidu.com') ) {
            //右侧广告
            $(".wgt-cms-banner").remove();
            $(".task-panel-entrance").remove();
            //右侧fixed广告
            $(".right-fixed-related-wrap").remove()

            //底部广告
            $("#bottom-ads-container").remove();
            $(".bottom-pic-ads").remove()
        }
    }
    //百度翻译
    let fanyi_page = () =>{
        if (window.location.href.includes('fanyi.baidu.com') ) {
            $("#sideBannerContainer").remove();
        }
    }
    let image_page= () =>{
        if (window.location.href.includes('image.baidu.com') ) {
            let b=document.querySelectorAll(".newfcImgli")
            b.forEach(function(e){
                e.parentNode.style.display="none"})
        }
    }

    image_page()
    fanyi_page()
    jingyan_page()
    baike_page()
    known_page()
    search_main()
    information_page()
    wenku_page()
    tieba_page()


})();