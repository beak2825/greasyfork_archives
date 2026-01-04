// ==UserScript==
// @name         电影天堂点击链接开启迅雷
// @namespace    https://github.com/yeomanye
// @version      0.2
// @description  电影天堂添加链接复制按钮，点击链接打开迅雷
// @author       Ming Ye
// @match        http://www.ygdy8.com/html/gndy/*/*/*
// @include      http://www.ygdy8.net/html/gndy/*/*/*
// @match        http://www.dytt8.net/html/gndy/*/*/*
// @include      http://www.dy2018.com/*/*
// @include      http://www.dygod.net/html/gndy/*/*/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=229638
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35065/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E5%BC%80%E5%90%AF%E8%BF%85%E9%9B%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/35065/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E5%BC%80%E5%90%AF%E8%BF%85%E9%9B%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var log = consoleFactory('复制链接:', 'log', null, false);
    //替换链接为迅雷链接
    var changeLinkToThunderLink = function () {
        var $thunderlink = $('a');
        for (var i = 0; i < $thunderlink.length; i++) {
            if ($thunderlink.eq(i).attr('thunderpid')) {
                var realthunderlink = '';
                var linkattributes = $thunderlink[i].attributes;
                for (var j = 0; j < linkattributes.length; j++) {
                    if (linkattributes[j].value.indexOf('thunder:/') == 0) {
                        realthunderlink = linkattributes[j].value;
                        break;
                   }
                }
                log('realthunderlink:' + realthunderlink);
                $thunderlink[i].href = realthunderlink;
            }
        }
    };
    changeLinkToThunderLink();
    
    var $zoom = $('#Zoom'),
        $container = $zoom.find('table td'), //button容器
        $a = $container.find('a'), //超链接元素
        $btnTemplate = $('<button>复制</button>'); //按钮模板
    $btnTemplate.attr("data-clipboard-action", "copy");
    for (var i = 0, len = $a.length; i < len; i++) {
        var $cloneBtn = $btnTemplate.clone().attr({
            'data-clipboard-text': $a.eq(i).text(),
            'class': 'btn'
        });
        $container.eq(i).append($cloneBtn);
        //点击超链接打开迅雷
        $a.eq(i).click(function(){
            window.location.href = this.href;
        });
    }
    new Clipboard('.btn');
})();