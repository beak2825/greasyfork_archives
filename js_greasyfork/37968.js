// ==UserScript==
// @name         Baidu Mask
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide areas which made distraction in some baidu and other sites
// @description require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.jss
// @author       liyzh
// @match        *://www.baidu.com/*
// @match        *://baike.baidu.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://www.weather.com.cn/*
// @match        *://blog.sina.com.cn/*
// @match        *://blog.163.com/*
// @match        *://blog.csdn.net/*
// @grant        none
// @run-at document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/37968/Baidu%20Mask.user.js
// @updateURL https://update.greasyfork.org/scripts/37968/Baidu%20Mask.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    var $j;

    function GM_wait() {
        if (typeof jQuery === 'undefined') {
            window.setTimeout(GM_wait, 100);
        }
        else {
            $j = jQuery.noConflict();
            doJob();
        }
    }

    function loadJquery() {
        // Check if jQuery's loaded

        if (typeof jQuery === 'undefined') {
            // Add jQuery
            var GM_JQ = document.createElement('script');
            GM_JQ.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
            GM_JQ.type = 'text/javascript';
            GM_JQ.id = 'jquery-lyz';
            document.getElementsByTagName('head')[0].appendChild(GM_JQ);
            GM_wait();
        } else {
            doJob();
        }
    }

    loadJquery();


    function doJob() {
        if (typeof $j === 'undefined') {
            $j = $;
        }

        var url_arr = [
            {'name': "baidu", 'value': "www.baidu.com"},
            {'name': "baike", 'value': "baike.baidu.com"},
            {'name': "zhidao", 'value': "zhidao.baidu.com"},
            {'name': "weather", 'value': "www.weather.com.cn"},
            {'name': "blog_sina", 'value': "blog.sina.com.cn"},
            {'name': "blog_163", 'value': "blog.163.com"},
            {'name': "blog_csdn", 'value': "blog.csdn.net"},
        ];
        var url = location.href;
        var siteObj = {};
        $j(url_arr).each(function (i, item) {
            if (url.indexOf(item.value) > -1) {
                siteObj = item;
                return false;
            }
        });


        var selector = '';
        var remove_selector = '';
        var empty_selector = '';
        var timerLimit = 20;
        switch (siteObj.name) {
            case 'baidu':
                selector = '#content_right';
                $j('#kw').change(function (evt) {
                    doJob();
                });
                break;
            case 'baike':
                selector = '.topA, .lemmaWgt-promotion-slide, .union-content, .right-ad, ' +
                    '.lemmaWgt-promotion-vbaike, .nav-menu, #side_box_unionAd, .after-content';
                break;
            case 'zhidao':
                selector = '.widget-new-graphic, #union-asplu, .jump-top-box, .wgt-daily,' +
                    '.shop-entrance, .cms-slide, .nav-menu, iframe';
                remove_selector = '.wgt-daily';
                break;
            case 'weather':
                selector = '.right, .hdImgs, .tq_zx, #di_tan, #zu_dui, iframe';
                remove_selector = 'iframe';
                break;
            case 'blog_sina':
                selector = '.blogreco, .sinaad-toolkit-box, #module_903, #module_904, ' +
                    '#ramdomVisitDiv, .ntopbar_ad, .sinaads, #sinaadToolkitBox3';
                remove_selector = '.sinaad-toolkit-box, .sinaads, .ntopbar_ad';
                timerLimit = 30;
                break;
            case 'blog_163':
                selector = '.m-fixedPCAd, .nb-layer, .m-lofteriframe, .m-163news';
                remove_selector = '.m-fixedPCAd';
                empty_selector = '.m-lofteriframe iframe';
                break;
            case 'blog_csdn':
                selector = '.fixRight iframe, .flashrecommend';
                break;
        }

        var delay_arr = selector.split(',');
        var timerCount = 1;

        function hideTimer() {
            timerCount++;
            if (timerCount > timerLimit) {
                return;
            }
            delay_arr = $j.grep(delay_arr, function (_selector, i) {
                var $ele = $j(_selector);
                var visible = $ele.is(':visible');
                console.log($ele, visible);
                if (visible) {
                    //$ele.hide();
                    $ele.css('display', 'none');
                    // $ele.remove();
                    return false;
                }


                return true; // keep the element in the array
            });
            if (delay_arr.length > 0) {
                setTimeout(hideTimer, 500);
            }
            //console.log($j(watch_selector));
            console.log($j(empty_selector));
            $j(remove_selector).remove();
            $j(empty_selector).empty();
            $j(empty_selector).attr('src', '');
        }

        setTimeout(hideTimer, 1);
    }

})();