// ==UserScript==
// @name         蜜柑动画新番快速定位
// @namespace    pks
// @version      0.121
// @icon        https://mikanani.me/favicon.ico
// @description  使用快捷键 F 或 S 打开快速定位搜索框，ESC关闭。
// @author       pks
// @include        /^https?://mikanani\.me/?$/
// @include        /^https?://mikanani\.me/Home/MyBangumi/?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34732/%E8%9C%9C%E6%9F%91%E5%8A%A8%E7%94%BB%E6%96%B0%E7%95%AA%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/34732/%E8%9C%9C%E6%9F%91%E5%8A%A8%E7%94%BB%E6%96%B0%E7%95%AA%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==
$(function () {
    (function(){
        var css = '.highlight{animation:bg 3s infinite} .highlight .an-text{color: red !important}@keyframes bg{0%{background-color:rgba(255,255,0,0.18);} 25%{background-color:rgba(255,255,0,0.5);} 50%{background-color:rgba(255,255,0,0.1);} 75%{background-color:rgba(255,255,0,0.3);} 100%{background-color:rgba(255,255,0,0.18);}} ',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    })();



    function scrollToElement(ele) {
        var eleTop = $(ele).offset().top;
        if (!!document.querySelector('#sk-data-nav')) {
            $(window).animate({scrollTop: !!document.querySelector('#sk-data-nav.stick')?eleTop - 80:eleTop - 141});
        } else {
            $(window).animate({scrollTop: eleTop - 10});
        }
        $('.highlight').removeClass('highlight');
        $(ele).addClass('highlight');
        setTimeout(function(){
            $(ele).removeClass('highlight');
        }, 6000);
    }

    function submitFilter() {
        var dropDownList = [];
        bangumis.forEach(function(item,index,arr){
            if (item.name.toLowerCase().trim().indexOf($('#filter').val().toLowerCase().trim()) !== -1 && dropDownList.length <= 5) {
                dropDownList.push(index);
            }
        });
        if (dropDownList.length > 0) {
            scrollToElement(bangumis[dropDownList[0]].element);
        }
        $('#filter').val('');
        $('#filter').css('display', 'none').blur();
    }

    $('.main-content').on('click','span.js-expand_bangumi',function(e){
        console.log(e.target, this);
        if ($(this).parent().is('.active')) {
            setTimeout(function(){
                scrollToElement(e.target);
            },1500);
        }
    });

    var bangumis = [];

    function getBangumis() {
        bangumis = [];
        $('.an-info').each(function(index,element){
            var obj = {};
            obj.name = $(element).find('a.an-text').attr('title') || $(element).find('.date-text').eq(1).text();
            obj.element = $(element).closest('li')[0];
            bangumis.push(obj);
        });
        console.log(bangumis);
    }
    getBangumis();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var target = document.querySelector('#sk-body');
    var observer = new MutationObserver(getBangumis);
    var config = {childList: true};
    observer.observe(target, config);

    $('<input id="filter" placeholder="新番快速查找 ( Enter键提交 )">')
        .css({
        'width': '350px',
        'height': '64px',
        'position': 'fixed',
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0,
        'margin': 'auto',
        'fontSize': '24px',
        'opacity': '0.9',
        'textAlign': 'center',
        'display':'none'
    }).appendTo('body');

    $('#filter').on('keydown', function (e) {
        if (e.keyCode === 27 && !!$(this).val()) {
            $(this).wrap('<form></form>');
            $(this).parent()[0].reset();
            $(this).unwrap();
            $(this).focus();
        } else if (/^(13|8|27)$/.test(e.keyCode) && $(this).val()==='') {
            $(this).css('display', 'none').blur();
        } else if (e.keyCode === 13 && !!$(this).val() ) {
            submitFilter();
        }
    });
    var callFilter = function (e) {
        if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA' && /^(70|83)$/.test(e.keyCode) && $(window).width() >=992) {
            $('#filter').css('display', 'block').focus();
        }
    };
    $(document).on('keyup.wideScreenOnly', callFilter);
    $(window).on('resize', function (e) {
        if ($(window).width() <= 991) {
            $('#filter').css('display', 'none').blur();
            $(document).off('.wideScreenOnly');
        } else {
            $(document).on('keyup.wideScreenOnly', callFilter);
        }
    });
    $(document).on('click', function (e) {
        if (e.target.id !== 'filter' && $('#filter').css('display') === 'block') {
            $('#filter').css('display', 'none').blur();
        }
    });
});

