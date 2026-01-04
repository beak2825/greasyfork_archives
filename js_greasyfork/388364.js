// ==UserScript==
// @require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @name         扇贝加词组
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取有道里的词组搭配放在扇贝背单词里
// @author       iAoe
// @match        https://web.shanbay.com/wordsweb/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388364/%E6%89%87%E8%B4%9D%E5%8A%A0%E8%AF%8D%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/388364/%E6%89%87%E8%B4%9D%E5%8A%A0%E8%AF%8D%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 单词位置
    var wordSelector = '#root > div > div > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div.span9 > div > div.VocabPronounce_vcoabPronounce__2D0UH > div';
    // 需要添加的位置
    var phrasesArea = '#root > div > div > div > div > div:nth-child(1) > div > div > div';
    var api = 'https://dict.iaoe.xyz';
    // 等待某元素出现，出现就调用该函数后再次等待
    jQuery.fn.wait = function (func, times, interval) {
        var _interval = interval || 200, //20毫秒选择一次
            _self = this,
            _selector = this.selector, //选择器
            content, //获取到的元素的内容
            _iIntervalID; //定时器id

        _iIntervalID = setInterval(function() {
            _self = $(_selector); //再次选择单词
            if( _self.length ) { //判断是否取到单词
                if(_self.text()==content){
                }else{//如果单词内容和之前不一样，那么返回函数
                    func && func.call(_self);
                }
                content = _self.text();
            }
        }, _interval);
    }
    // 渲染词组到html
    function setPhrases(phrases){
        var html1 = "<div class=\"row\" style=\"margin-top:30px\"><div class=\"span1\"><h6>额外内容</h6></div><div class=\"span9\">\
<div class=\"index_tabs__1CVfU\"><div class=\"index_switch__3XPdt\"><div class=\"index_tabNavs__3tWev\"><p class=\"index_tab__37Cha index_active__1bHoy\">词组短语</p></div></div></div>\
<div><div class><div style=\"padding:20px 0 0\">"
        var html2 = "<\div></div></div></div></div>";
        var appendHtml = "";
        phrases.map(function(item, index){
            appendHtml += '<div style="padding-bottom:20px"><a style="text-decoration: none;color:#28bea0" href="'
            + item.href
            + '">'
            + item.phrase
            + '</a>'
            + '&nbsp;&nbsp;&nbsp;'
            + item.ch
            + '</div>';
        })
        $(phrasesArea).append(html1 + appendHtml+ html2);
    }
    // 获取词组
    function getPhrases(word){
        $.ajax({
            url: api,
            type:'POST',
            dataType:'json',
            contentType:'application/json;charset=UTF-8',
            data:JSON.stringify(word),
            success:function(data, status){
                setPhrases(data);
            }
        });
    }
    // 等待单词出现
    $(wordSelector).wait(function(){
        var word = this.text();
        getPhrases(word);
    });
})();