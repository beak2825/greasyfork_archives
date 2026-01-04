// ==UserScript==
// @name         BiliPlus
// @namespace    https://www.biliplus.com/
// @version      1.13
// @description  哔哩哔哩错误视频自动跳转
// @author       SettingDust

// @include      http*://*.bilibili.com/*

// @require      https://code.jquery.com/jquery-latest.js

// @run_at       document_idle
// @downloadURL https://update.greasyfork.org/scripts/37705/BiliPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/37705/BiliPlus.meta.js
// ==/UserScript==
//视频跳转
$(window).load(function () {
    let body = $('body');

    if ($('.error-container').length > 0)
        location.replace(location.href.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.biliplus.com/video'));
    if ($('.video-list-status-text').length > 0)
        location.replace(location.href.replace(/\:\/\/bangumi\.bilibili\.com\/anime/, '://www.biliplus.com/bangumi/i'));
    if ($('.player-limit-wrap').length > 0)
        location.replace(location.href.replace(/\:\/\/www\.bilibili\.com/, '://www.biliplus.com'));

    //添加订阅链接
    $('ul.fr li').each(function () {
        let html = $(this).prop("outerHTML");
        if (html.indexOf('favlist') !== -1) {
            html = html.replace('favlist', 'bangumi');
            html = html.replace('收藏夹', '订阅');
            $('ul.fr').append(html);
        }
    });
    //收藏夹跳转
    body.mouseover(function () {
        $('.small-item.disabled').each(function () {
            $(this).removeClass('disabled');
            $(this).find('a').attr('href', 'https://www.biliplus.com/video/av' + $(this).attr('data-aid'));
            $(this).find('a').attr('target', '_blank');
        });
        $('.disabled-cover').remove();
    });
    //直播间历史聊天可到最顶部
    if ($('#rank-list-vm').length > 0) {
        $('#rank-list-vm').css('height', '152px');
        $('.chat-history-panel').css('height', 'calc(100% - 128px - 152px)');
    }
    /* -------------首页------------- */
    //首页推广删除
    $('#home_popularize>.l-con').remove();
    $('.gg-floor-module').remove();
    //首页顶部推荐
    $('#chief_recommend').remove();
    //直播
    $('#bili_live').hide();
    $('.nav-list>.item[sortindex="0"]').hide();
    //特别推荐
    $('#special_recommend').remove();
    //广告
    $('#bili_ad').hide();
    $('.nav-list>.item[sortindex="11"]').hide();
    //时尚
    $('#bili_fashion').hide();
    $('#bili_ent').hide();
    $('.nav-list>.item[sortindex="10"]').hide();
    $('.nav-list>.item[sortindex="12"]').hide();
    //主菜单修改
    addCss(`
    #home_popularize {
      height: 48px;
      display: flex;
      align-items: center;
      margin-right: 0;
      margin-left: 14px;
    }
    @media screen and (min-width: 1400px) {
      #home_popularize {
        margin-left: 32px;
      }
    }`, 'Popularize');

    let orginPopularize = $('#home_popularize');
    if (orginPopularize.length > 0) {
        $('#primary_menu>.nav-menu>.side-nav').remove();
        let popularize = $('<li\>');
        popularize.append(orginPopularize.children());
        popularize.get(0).classList = orginPopularize.get(0).classList;
        orginPopularize.remove();
        popularize.attr('id', 'home_popularize');
        $('#primary_menu>.nav-menu').append(popularize);
        $('.gif-menu.nav-gif').remove();
    }
    $('.nav-item.mobile').remove();
    $('.nav-item.nav-worldcup').remove();

    //顶部修改
    addCss(`
    .bili-wrapper {
      margin: 16px auto;
    }
    .nav-item.live .i-frame,
    .nav-item {
      display: none !important;
      pointer-events: none !important;
    }
    .nav-item.home,
    .nav-item.hbili,
    .nav-item.mbili,
    .nav-item.live,
    .nav-con.fr .nav-item {
      display: list-item !important;
      pointer-events: all !important;
    }
    .nav-con.fr .nav-item[report-id="playpage_VIP"] {
      display: none !important;
      pointer-events: none !important;
    }`, 'Top');

    /*视频页面*/
    addCss(`
    .app-download,
    #playpage_mobileshow,
    #arc_toolbar_report .tb-line,
    #live_recommand_report{
      display: none !important;
      pointer-events: none !important;
    }`,'Video');
    $('#playpage_mobileshow').remove();

    /**
     * 添加style到head
     * @param css css内容
     * @param name style标识
     */
    function addCss(css, name) {
        let style = body.find("style[data-meta='" + name + "']:first");
        if (style.length === 0) {
            style = $("<style\>");
        }
        style.text(style.text() + css);
        style.attr("data-meta", name);
        body.append(style);
    }
});