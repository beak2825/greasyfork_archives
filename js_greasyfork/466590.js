// ==UserScript==
// @name                FUCK CSDN
// @version             1.0.1
// @description         CSDN 增强工具
// @author              unknown
// @namespace           https://github.com/ultrazg/FUCK-CSDN
// @match               *://*.csdn.net/*
// @match               *://blog.csdn.net/*
// @icon                https://ossweb-img.qq.com/images/lol/img/spell/SummonerBoost.png
// @require             https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require             https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license             WTFPL
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/466590/FUCK%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/466590/FUCK%20CSDN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '1.0.1';
    const classNameArray = ['box-shadow', 'programmer1Box', 'programmer2Box', 'programmer3Box', 'programmer4Box', 'template-box', 'template-box', 'toolbar-advert', 'recommend-box', 'blog-footer-bottom', 'sidetool-writeguide-box', 'btn-side-chatdoc-contentbox'];
    const idArray = ['recommendAdBox', 'asideNewNps', 'recommendNps', 'asideSearchArticle', 'asideHotArticle', 'asideArchive', 'footerRightAds', 'asideWriteGuide'];
    const toolBarBoxDom = `
        <li style="color: forestgreen;user-select: none">正在优化 CSDN 的浏览体验。</li><li><a style="color: cornflowerblue" href="https://github.com/ultrazg/FUCK-CSDN/issues" target="_blank">[反馈]</a></li>
        `;

    function loopRemoveByClassName(classNameArray) {
        for (const classNameArrayElement of classNameArray) {
            $('.' + classNameArrayElement).remove();
        }
    }

    function loopRemoveById(idArray) {
        for (const idArrayElement of idArray) {
            $('#' + idArrayElement).remove();
        }
    }

    function printInfo() {
        console.clear()
        console.log(`%cFUCK YOU CSDN ${VERSION}`, "color:darkorange;background:#57606f;padding:5px;border-radius:8px;font-family:SimSun;font-size:8px");
    }

    loopRemoveByClassName(classNameArray);
    loopRemoveById(idArray);

    $("iframe").remove();

    setInterval(() => {
        $('.passport-login-container').remove();
    }, 500);

    $.cookie('unlogin_scroll_step', 0, {
        domain: '.csdn.net',
        path: '/'
    });

    $("code").css("user-select", "auto");
    $("#content_views").css("user-select", "auto");
    $("pre").css("user-select", "auto");

    $(".hljs-button").removeClass("signin");
    $(".hljs-button").addClass("{2}");
    $(".hljs-button").attr("data-title", "已解除复制限制-点击复制");
    $(".hljs-button").attr("onclick", "hljs.copyCode(event)");
    $("code").attr("onclick", "mdcp.copyCode(event)");

    $('.data-info,.aside-box-footer,.profile-intro-name-boxOpration,.item-rank').wrapAll('<div id="data-info-box" style="display: none"></div>');
    $('#asideProfile').append('<div id="data-info-mask" style="height: 40px;text-align: center;line-height: 47px;cursor: pointer;color:tomato" onclick="showInfo()">点击此处查看作者信息</div>');

    $('#data-info-mask').click(function () {
        $('#data-info-box').css('display', 'block');
        $('#data-info-mask').css('display', 'none');
    });

    if ($('.hide-article-box').length > 0) {
        $('.hide-article-box').remove();
        $('article #article_content').css('height', '');
    }

    $('.hide-preCode-bt').click();

    $('.toolbar-container-right').remove();
    $('.toolbar-container-middle').remove();
    $('.toolbar-container-left .toolbar-menus').html(toolBarBoxDom);
    $('.toolbar-menus li').css('margin-right', '10px');
    $('.toolbar-menus li').hover(function () {
        $(this).css('background', '#fff');
    });
    $('#toolBarBox .left-toolbox').remove();

    document
        .querySelectorAll("article")
        ?.forEach((item) => (item.innerHTML = item.innerHTML));
    document.addEventListener(
        "copy",
        (e) =>
            e.preventDefault() ||
            e.clipboardData.setData("text/plain", window.getSelection().toString())
    );

    printInfo();

})();
