// ==UserScript==
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @name         thoughts-ui优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  优化Thoughs样式
// @author       邱道长
// @include      *://thoughts.teambition.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397420/thoughts-ui%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397420/thoughts-ui%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
     window.setTimeout(function() {
        $(function() {
            
            $('h2 span[data-slate-content]').css('marginLeft','1em');
            $('h2').css('backgroundColor','#64ACE4').css('color','white')
            .css('marginLeft','0');
            // 普通段落设置
            $('span[data-slate-content]').css('fontSize','24px');
            $('p').css('textIndent','50px');
            // 有序列表数字符号字体大小和普通段落，字体大小保持一致，否则会不协调。
            $('.number__31Gh').css('fontSize','24px');
            $('h1 span').css('fontSize','36px');// 一级标题设置字体
            $('h1').css('textAlign','center');
            $('a').css('fontSize','18px');//修改链接字体

            // 给所有的标题添加编号，要求只能有一个一级标题，并且里面必须写上前缀比如 2.1 后面要跟上一个空格以方便截取
            // 二级标记则开始2.1
            // 获取一级标题内容
            var h1vs = $('h1 span[data-slate-content]').text().split(' ');
            var h2Prex = null;
            if(h1vs != null && h1vs != '') {
                h2Prex = h1vs[0];
            }
            // 获取所有的h2
            $('h2 span[data-slate-content]').each(function(index) {
                $(this).text(h2Prex + '.' + (index+1) + ' ' + $(this).text());
            });
        })
    },1500)// 延时执行防止渲染不出来
})();