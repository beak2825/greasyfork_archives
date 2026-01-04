// ==UserScript==
// @name         V2ex-helper
// @description  1.去除v2ex广告 2.添加百度和bing搜索
// @copyright    2018, lhr(https://www.lhrsite.com/)
// @version      1.2.0
// @author       lhr
// @license      MIT
// @homepageURL  https://github.com/zzlhr/tampermonkey-script/blob/master/v2ex/
// @grant        none
// @run-at       document-end
// @include      https://*.v2ex.com/*
// @namespace https://greasyfork.org/users/194548
// @downloadURL https://update.greasyfork.org/scripts/370038/V2ex-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370038/V2ex-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('插件已加载');
    var sidebar_units = $('.sidebar_units');
    for(var i=0;i<sidebar_units.length;i++){
        $(sidebar_units[i]).attr('hidden','');
    }

    var sidebar_compliances = $('.sidebar_compliance');
    for(i=0;i<sidebar_compliances.length;i++){
        $(sidebar_compliances[i]).attr('hidden','');
    }

    var googles = $('.adsbygoogle');
    console.log(googles)
    for(i=0;i<googles.length;i++){
        $(googles[i]).parent().parent().attr('hidden','')
    }

    $('#Search').children('form').html($('#Search').children('form').html() +
    '<a id="baidu" style="padding-right:5px;" href="https://www.baidu.com/s?wd=site: www.lhrsite.com">百度</a><a id="google" href="https://www.google.com/search?q=site: www.lhrsite.com" style="padding-right:5px;">google</a><a href="https://cn.bing.com/search?q=site: www.lhrsite.com" style="padding-right:5px;" id="bing">bing</a>')
    //修改查询
    var base=['https://www.baidu.com/s?wd=site: v2ex.com ', 'https://www.google.com/search?q=site: v2ex.com/t ', 'https://cn.bing.com/search?q=site: v2ex.com/t ']


    $('#qbar').children('input').change(function(){
        var value = $('#qbar').children('input').val()
        $('#baidu').attr('href', base[0]+value);
        $('#google').attr('href', base[1]+value);
        $('#bing').attr('href', base[2]+value);
    });



    //======2018-07-18 09:17:49=====
    //==========修改广告规则==========
    var inners = $('.inner');
    console.log(inners)
    for (i=0;i<inners.length;i++){
        var item = inners[i]
        item = $(item)
        if(item.attr('align') === 'center'){
             console.log(item)
             item.hide()
        }

    }
    // Your code here...
})();