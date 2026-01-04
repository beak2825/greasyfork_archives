// ==UserScript==
// @name       background
// @namespace  https://blog.csdn.net/huang007guo
// @version    0.93
// @description  enter something useful
// @match      http://*/*
// @include http://*/*
// @include https://*/*
// @author       Hank
// @copyright  2018+, Hank
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374993/background.user.js
// @updateURL https://update.greasyfork.org/scripts/374993/background.meta.js
// ==/UserScript==
(function (){
	var body = document.getElementsByTagName('body').item(0);
    //var backCss = {"background-color":'rgb(204, 232, 207)'};
    var backCss = {"background-color":'rgb(206, 234, 186)!important'};
    var backPreCss = {"background-color":'rgb(103, 103, 103)!important'};

   	body.style.background = 'rgb(206, 234, 186)';
    $("body").css(backCss);
    //body.style.opacity = "0.4";
    //百度百科
    if(location.hostname.indexOf("baike.baidu") === 0){
        $('.content').css(backCss);
    }
    //腾讯新闻
    if(location.hostname.indexOf(".qq.com") >= 0){
       $('.wrapper .main').css(backCss);
    }
    //github
    $('.Box').css(backCss);
    //cnblogs
    $('.post').css(backCss);
    //$('.post pre').css(backPreCss);
    //csdn
    $('.blog-content-box').css(backCss);
    //$('.blog-content-box pre,.blog-content-box pre code').css(backPreCss);
    //知乎
    $('.Post-content').css(backCss);
    $('.App-main .Card').css(backCss);
    //网贷之家
    $('.page-box .page-left').css(backCss);

    //兜底 body style标签
    $("body").prepend("<style>.book .book-body,.book .book-body .page-wrapper .page-inner section,.section.container.white,.Post-Main,body,article.devsite-article,.App-main .Card,.page-box .page-left,.blog-content-box,.rich_media_area_primary,.inner-content,.page-article,._3kbg6I,.ouvJEz,.body-wrapper .content-wrapper .content{background-color:"+backCss['background-color']+"}</style>");
    console.log('%c 这里是背景绿豆色js', 'background: rgb(206, 234, 186); color: #000', $);
})();