// ==UserScript==
// @name         什么值得买批量取消关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消当前页面的所有关注
// @author       skyyear
// @icon         https://www.smzdm.com/favicon.ico
// @match        https://zhiyou.smzdm.com/guanzhu/*
// @grant        none
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/397017/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/397017/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btnGuanzhu=$('.add-focus-btn');
    var button=$('<div style="font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;">取消全部关注</div>')
    button.attr('id','cancel_all_guanzhu').attr('onclick','').text('取消全部关注').insertAfter(btnGuanzhu).click(cancel_all_guanzhu);

    function reload_iframe(hash_str){
        window.location.hash = hash_str;
        window.location.reload(true);
    }

    function cancel_all_guanzhu(){
        //debugger
        var time = 0;
        var buttons = $('a:contains("已关注"),span:contains("已关注")');
        console.log('找到已关注按钮:  '+buttons.length);

        buttons.each(function(i,button){
            setTimeout(function(){button.click()}, time);
            time+=5000;
            //time+=500;
        });

        if (buttons.length == 0)
            reload_iframe('');
        else
            setTimeout(function(){reload_iframe('#cancel_all_guanzhu')}, time);
    }

    //根据URL中的HASH继续取消
    if (window.location.hash == '#cancel_all_guanzhu')
        cancel_all_guanzhu();

})();