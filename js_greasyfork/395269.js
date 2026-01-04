// ==UserScript==
// @name         beautifyBaidu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  美化百度首页，去掉不需要的所有内容
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @author       ELYHG
// @include      https://www.baidu.com/s?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395269/beautifyBaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/395269/beautifyBaidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // # 调整背景色
    // ## wrapper为暗黑
    $("#wrapper_wrapper").css("background","#22272c")
    // ## footer为暗黑
    $("#foot").css("background","#22272c")
    // ## head为暗黑
    $("#s_tab").css("background","#22272c")
    // ## 带搜索框的头部为暗黑
    $(".head_wrapper").css("background","#22272c")
    // ## 搜索结果卡片（百度聚合）为深灰
    $(".result-op").css("background","#2e343b").css("border-radius","3px")
    // ## 搜索结果卡片（其他结果）为深灰
    $(".result").css("background","#2e343b").css("border-radius","3px")


    // # 居中搜索结果并更改宽度
    // ## container容器居中于页面主容器wrapper
    $("#container").css("margin","auto").css("width","800px")

    $("#form").css("margin","auto")

    // ## 去掉padding并更改宽度
    $("#content_left").css("padding",0).css("width","800px")

    // ## 搜索框文字颜色
    $(".s_ipt").css("color","#ffffff")

    $("#head").css("border",0)


    // # 删除不需要的内容
    // ## 右上方个人中心和热点
    $("#u").remove()
    $("#content_right").remove()
    // ## 头部搜索计数
    $(".head_nums_cont_outer OP_LOG").remove()
    $(".head_nums_cont_inner").remove()
    // ## tab栏文字（即搜索、贴吧tab）
    $(".s_tab_inner").remove()

    // ## 百度图片、聚合视频、百度贴吧、百度经验的详情显示内容
    $(".op-img-address-desktop-cont").remove()
    $(".op-short-video-pc").remove()
    $(".op-tieba-star-maintable").remove()
    $(".c-tabs").remove()
    $(".c-border").remove()
    // ## foot右下角帮助
    $("#help").remove()

    // ## 移除相关搜索和为你推荐
    $("#rs").remove()
    $("#rs_top_new").remove()
    $(".c-gap-top").remove()


    // 移除头部
    $("#head").remove()
    $("#s_tab").remove()

    // ## 移除结果的详情
    $(".c-row").remove()
    $(".c-abstract").remove()

    // ## 移除链接右侧的下拉箭头和图标和左侧的图标
    $(".c-tools").remove()
    $(".op_LAMP").remove()
    $(".nor-src-icon").remove()
    // ## 删除页码的百度logo
    $(".fk").remove()
    // ## 删除头部的百度logo
    $("#result_logo").remove()

    // ## 删除搜索框的话筒和相机logo
    $(".ipt_rec").css("display", "none")
    $(".soutu-btn").removeClass("position")



    // # 更改样式
    // ## 百度自己的聚合卡片，result-op类
    $(".result-op").css("width","770px").css("padding","15px")
    // ## 搜索内容卡片，result类
    $(".result").css("width","770px").css("padding","15px")
    // ## 更改结果卡片标题样式和颜色
    $("a").css("text-decoration", "none").css("color", "#ffffff")
    // ## 改变搜索结果关键词的样式
    $("em").css("text-decoration", "none").css("color", "#f9ad3b").css("margin", "0 2px")
    // ## 把标题与正文上下的间距都去掉
    $(".c-gap-top-small").css("margin-top",0)
    $(".c-gap-bottom-small").css("margin-bottom",0)
    // ## foot上边框
    $("#foot").css("border","0")
    // ## 每个页码和上下翻页符的border为0
    $(".pc").css("border",0)
    $(".n").css("border",0).css("background","#22272c")
    $("#page").css("margin-bottom", 0)
//     $("#s_tab").css("height", 0)
    $("#foot").css("margin", 0)


    // # 页码相关
    var page = document.getElementById("page")
    // ## 先使选中页码高度为正常高度
    page.getElementsByTagName("strong")[0].style.height = "34px"
    page.getElementsByTagName("strong")[0].style.background = "#22272c"
    page.getElementsByTagName("strong")[0].style.color = "#e2a171"

    // ## 再使未选中页码高度为正常高度
    for (var i = 0; i < 10; i++){
        page.getElementsByTagName("a")[i].style.height = "34px"
        page.getElementsByTagName("a")[i].style.background = "#22272c"
    }
})();