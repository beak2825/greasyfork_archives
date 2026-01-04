// ==UserScript==
// @name         廖雪峰教程阅读模式
// @namespace    https://github.com/Young-Spark/
// @version      0.2
// @description  去除廖雪峰的教程中无用的部分，让你沉浸阅读。修改字体和段落的样式，优化阅读体验
// @author       Young
// @match        https://www.liaoxuefeng.com/wiki/*
// @match        https://www.liaoxuefeng.com/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392952/%E5%BB%96%E9%9B%AA%E5%B3%B0%E6%95%99%E7%A8%8B%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/392952/%E5%BB%96%E9%9B%AA%E5%B3%B0%E6%95%99%E7%A8%8B%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //默认去除广告
    $("[id^='sponsor']").detach();

    //默认调整行间距，字体样式优化阅读
    $("body").css({
        "background": "#fff",
        "color": "#555",
        "font-family": "'Lato', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        "font-size": "16px",
        "line-height": "2",
    });
    $("#x-content p").css({
        "margin-bottom":"20px",
    });
    $("#x-content h1, #x-content h2, #x-content h3, #x-content h4, #x-content h5, #x-content h6").css({
        "margin-bottom":"20px",
    });

    //默认复制章节导航到头部
    var cloneEl = $(".x-wiki-prev-next,.uk-clearfix").clone();
    cloneEl.css("padding","0");
    $("#x-content").prepend(cloneEl);


    //启用代码文本框的tab功能
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i=0;i<count;i++){
        textareas[i].onkeydown = function(e){
            if(e.keyCode==9 || e.which==9){
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s+1;
            }
        }
    }

    //修改滚动触发事件，优化“回到顶部”按钮显示的时机
    var $window = $(window);
    var $gotoTop = $('div.x-goto-top');
    var lazyImgs = _.map($('img[data-src]').get(), function (i) {
        return $(i);
    });
    var onScroll = function () {
        var wtop = $window.scrollTop();
        if (wtop > window.innerHeight) {
            $gotoTop.show();
        }
        else {
            $gotoTop.hide();
        }
        if (lazyImgs.length > 0) {
            var wheight = $window.height();
            var loadedIndex = [];
            _.each(lazyImgs, function ($i, index) {
                if ($i.offset().top - wtop < wheight) {
                    $i.attr('src', $i.attr('data-src'));
                    loadedIndex.unshift(index);
                }
            });
            _.each(loadedIndex, function (index) {
                lazyImgs.splice(index, 1);
            });
        }
    };
    $window.scroll(onScroll);
    onScroll();

    //添加阅读模式按钮
    var sideToggler = $("<button id='sideToggler'>📖</button>");
    sideToggler.css({
        "position":"fixed",
        "bottom":"60px",
        "right":"5%",
        "width":"39.8",
        "height":"38",
        "border":"1px solid #0593d3",
        "border-radius":"3px",
        "background-color":"#f5f5f5",
        "opacity":"0.9",
        "z-index":"9999",
        "cursor":"pointer",
        "outline":"none"
    });
    sideToggler.hover(function() {
        $(this).css({
            "background-color":"#fafafa",
            "border-color":"#0482ba"
        });
    },function() {
        $(this).css({
            "background-color":"#f5f5f5",
            "border-color":"#0593d3"
        });
    });

    //添加阅读模式按钮点击事件
    var isHided = JSON.parse(window.sessionStorage.getItem('isHided'))||false;
    var toggleSide = function () {

        $("#x-content").parents().siblings().not(".x-goto-top,#x-offcanvas-left,.x-placeholder,#sideToggler").toggle();
        $("#x-content-bottom").toggle();
        $("#x-content").children().filter(".x-wiki-content,.x-main-content").nextUntil("hr").toggle();
        $("iframe").toggle();

        isHided = !isHided;
        if (isHided) {
            $(".x-container").css("padding","0 10vw");
        } else {
            $(".x-container").css("padding","0 25px");
        }

        window.sessionStorage.setItem('isHided', isHided)
    };
    var hideSide = function () {

        $("#x-content").parents().siblings().not(".x-goto-top,#x-offcanvas-left,.x-placeholder,#sideToggler").hide();
        $("#x-content-bottom").hide();
        $("#x-content").children().filter(".x-wiki-content,.x-main-content").nextUntil("hr").hide();
        $("iframe").hide();
        $(".x-container").css("padding","0 10vw");

    };
    //转换章节时自动检测是否隐藏
    if(JSON.parse(window.sessionStorage.getItem('isHided'))) {
        hideSide();
    }
    sideToggler.click(toggleSide);

    //添加阅读模式按钮到DOM
    $(document.body).append(sideToggler);

    //默认隐藏评论，增加显示评论按钮
    $("#x-content-comment").hide();
    $("#x-content-comment").before($('<button id="loadComment" type="button" class="uk-button uk-button-primary"><i class="uk-icon-comment"></i> 加载评论</button><br /><br />'));
    $("#loadComment").click(function (){
        if($("#x-comment-list").children().length==0) {
            ajaxLoadComments('x-comment-list', comment_ref_id);
        }
        $("#x-content-comment").toggle();
        //$(this).hide();
    });
})();