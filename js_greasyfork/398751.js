// ==UserScript==
// @icon            https://twitter.com/favicon.ico
// @name            twitter自定义翻译
// @namespace       [url=mailto:thisisaspider@qq.com]thisisaspider@qq.com[/url]
// @author          thisisaspider
// @description     通过审核元素替换推特内容。替换Translate按钮为Replace。点击推特内容可以直接编辑文本。点击回复者头像可以删除回复
// @include         *://twitter.com/*
// @include         *://mobile.twitter.com/*
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// @grant           GM_addStyle
// @version         0.1.0
// @downloadURL https://update.greasyfork.org/scripts/398751/twitter%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/398751/twitter%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    var textarea_css = '.form__field { font-family: inherit; width: 100%;border: 0;border-bottom: 2px solid $gray;outline: 0;font-size: inherit;color: $white;padding: 0;background: transparent;transition: border-color 0.2s;}'
    GM_addStyle(textarea_css)

    // selector and html
    var textarea_html = '<input type="input" placeholder="Replace Text" class="form__field" required />'
    var first_span_selector = 'div > div > div:nth-child(3) > div:nth-child(1) > div > span'
    var second_span_selector = 'div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > span'
    var third_span_selector = 'div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > span'
    var fourth_span_selector = 'div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > span'
    var article_selector = '#react-root main section article';
    var button_selector = "#react-root main section article > div > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2)";
    var button_selector_2 = "#react-root main section article > div > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(2)"
    var hide_button_selector = 'div > div > div:nth-child(2) > div > div > div'

    // func
    function change_article(){
        var old_articles = document.querySelectorAll(article_selector);
        for (var i = 0, li = old_articles.length; i < li; i++){
            var old_article = old_articles[i];
            var new_article = replaceEventListener(old_article, () => {console.log('OK')});
            change_spans(new_article, first_span_selector);
            change_spans(new_article, second_span_selector);
            change_spans(new_article, third_span_selector);
            change_spans(new_article, fourth_span_selector);
            change_button(new_article, hide_button_selector);
        }
    }

    function change_button(article, selector){
        var old_button = article.querySelector(selector);
        var new_button = replaceEventListener(old_button, () => {console.log('button activate');$(article).hide()});
        var a_link = new_button.querySelector('a');
        $(a_link).removeAttr("href");
    }

    function change_spans(article, selector){
        var old_spans = article.querySelectorAll(selector);
        for (var i = 0, li = old_spans.length; i < li ; i++) {
            var old_span = old_spans[i];
            if (old_span.children.length == 0){
                old_span.addEventListener('click', change_span);
            }
        }
    }

    function change_span(){
        var span = arguments[0].srcElement;
        span.innerText = '';
        var input = $(textarea_html).get(0);
        input.addEventListener('blur', complete_text);
        span.appendChild(input);
        span.removeEventListener('click', change_span);
        $(input).focus();
    }

    function complete_text(){
        var inputarea = arguments[0].srcElement;
        var text = inputarea.value;
        var span = inputarea.parentNode;
        span.addEventListener('click', change_span);
        span.innerText = text;
    }

    function replaceEventListener(old_element, new_event){
        if (old_element && old_element.parentNode){
            console.log('repalce ok!')
            var new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
            new_element.addEventListener('click', new_event);
            return new_element;
        } else {
            return false;
        }
    }

    function hide_ul(){
        var old_button = document.querySelector(button_selector);
        old_button = old_button ? old_button : document.querySelector(button_selector_2)
        if (old_button && old_button.children[0].innerText == 'Translate Tweet'){
            var new_button = replaceEventListener(old_button, change_article)
            if (!new_button){
            } else {
                new_button.children[0].innerText = 'Replace Text'
            }
        } else {
            console.log('no found')
        }
        setTimeout(hide_ul,1000);
    }

    // start
    $(function () {
        console.log('Injusting OK')
        hide_ul();
    });

})();