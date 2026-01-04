// ==UserScript==
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @name         ccLoginScript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个小小的cc登录脚本
// @author       我这么帅为什么不刮胡子
// @match        http://cc.scu.edu.cn/G2S/Showsystem/Index.aspx


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395310/ccLoginScript.user.js
// @updateURL https://update.greasyfork.org/scripts/395310/ccLoginScript.meta.js
// ==/UserScript==
(function () {
    'use strict';
    document.getElementsByClassName('menubg') [0].removeAttribute('style');
    $('head').append("<link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.css'> <link rel='stylesheet' type='text/css' href='http://121.43.102.217/cssfornavigation/styles'>")
    // Your code here...
    //console.log($('script')[10])
    //$('script')[11].html("function tab(node, fn) { var childs, cs; if (node.className.indexOf('cur') != -1) return; childs = $(node).parent().children(); for (var i = 0; i < childs.length; i++) { if (childs[i].className.indexOf('cur') != -1) { cs = childs[i].className; childs[i].className = node.className; node.className = cs; if (fn) fn(node, childs[i]); return; } } }; function share2(node) { var pt = node.parentNode, link = atr(pt, '_link'), title = encodeURIComponent(atr(pt, '_title')), source = encodeURIComponent(atr(pt, '_source')), site = encodeURIComponent(atr(pt, '_site')); link = encodeURIComponent(uri.format(link)); window.open(atr(node, '_href') .replace('(link)', link) .replace('(link)', link) .replace('(title)', title) .replace('(source)', source) .replace('(site)', site)); return false; }; function mail2(node) { var pt = node.parentNode, link = atr(pt, '_link'), title = encodeURIComponent(atr(pt, '_title')), source = encodeURIComponent(atr(pt, '_source')), site = encodeURIComponent(atr(pt, '_site')); link = encodeURIComponent(uri.format(link)); window.location = 'mailto:?Subject= &amp;Body=' + link; }; window.onload = function () { if (window.ff2html) { ff2html('SchoolBrief'); } } $(function () { $('#loopedSlider').loopedSlider({ autoStart: 5000, restart: 10000 }); $('.top_publiczy').removeClass('top_publiczy').addClass('top_public'); var isLogin = document.getElementById('ctl00_ContentPlaceHolder1_IsLogin').value; if (isLogin == '1') { var isIE = navigator.userAgent.toLowerCase().search(/(msie\\s|trident.*rv:)([\\w.]+)/) != -1; if (!isIE) { } } });")
    $('body').append("<div class='htmleaf-container'> <main class='main_menu'> <div class='burger_menu'> <div class='top_line'></div> <div class='middle_line'></div> <div class='bottom_line'></div> </div> <div class='location'> <i class='fa fa-power-off map-marker-ico'></i> </div> <div class='home'> <i class='fa fa-sign-in home-ico'></i> </div> </main> <div class='circ_wrap'> <div class='circle_background'></div> </div> </div>")
    var location=$("[style$='cursor:pointer;text-decoration:underline;color:#d69200']").attr("href")
    var $multiple_menus = '.home, .location, .image, .mail';
    var $all_menus = '.burger_menu, .home, .location, .mail, .image';





    function logout() {
        $.ajax({
            url: "Logout.ashx?action=OutUserLoginInfo",
            data: (new Date).toString(),
            success: function () {
                window.location.reload(true);
            },
            error: function () {
                window.location.reload(true);
            }
        });
    };

    $('.burger_menu').click(function () {

        console.log("点击")
        $(this).toggleClass('toggle_burger');
        setTimeout(function () {
            $('.home').toggleClass('toggle_home');
        }, 100);
        setTimeout(function () {
            $('.location').toggleClass('toggle_location');

        }, 200);
        setTimeout(function () {
            $('.image').toggleClass('toggle_image');
        }, 300);
        setTimeout(function () {
            $('.mail').toggleClass('toggle_mail');
        }, 400);
    });
    $($all_menus).click(function () {
        $(this).siblings().css({
            'z-index': '5'
        });
        $(this).css({
            'z-index': '10'
        });
    });
    $('main i.fa').click(function () {
        $(this).parent().toggleClass('freeze');
        setTimeout(function () {
            $('.circle_background').addClass('scale');
        }, 500);
        if ($(this).parent().hasClass('freeze')) {
            $($multiple_menus).addClass('hide');
        }
    });
    $('i.icon_close').click(function () {
        $('.burger_menu').addClass('toggle_burger');
        $(this).parent().fadeOut('slow');
        setTimeout(function () {
            $('.circle_background').removeClass('scale');
            $('i.home-ico, i.map-marker-ico, i.image-ico, i.envelope-ico').fadeIn('slow');
        }, 400);
        setTimeout(function () {
            $($multiple_menus).css({
                'z-index': '4'
            }).removeClass('hide freeze');
        }, 700);
        $('.circle_background').css({
            'z-index': '2'
        });
    });
    $('i.home-ico').click(function () {

        setTimeout(function () {
            $('i.home-ico').fadeOut('fast');
        }, 500);
        setTimeout(function () {
            $('.home_content').fadeIn('slow');
            if(location!=undefined)
                window.location.href = location
            else{
                location = "http://ids.scu.edu.cn/amserver/UI/Login?goto=http://cc.scu.edu.cn/G2S/Showsystem/docheckca.aspx"
                window.location.href = location
            }
        }, 1000);
    });
    $('i.map-marker-ico').click(function () {
        setTimeout(function () {
            $('i.map-marker-ico').fadeOut('fast');
        }, 500);
        setTimeout(function () {
            $('.location_content').fadeIn('slow');
           logout()
        }, 1000);
    });

})();