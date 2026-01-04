// ==UserScript==
// @name         一键编辑网站内容
// @version      0.3
// @description  所有网站通用，右下角有个编辑，点击就可以全局编辑了(再点一次还原)
// @author       sunzehui
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/398077/%E4%B8%80%E9%94%AE%E7%BC%96%E8%BE%91%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/398077/%E4%B8%80%E9%94%AE%E7%BC%96%E8%BE%91%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
(function () {
    var $j = jQuery.noConflict();        //自定义一个比较短快捷方式
    $j(function(){    
        var $jeditBtn = $j('<span id="edit-html-Btn" title="一键编辑">编辑</span>')
    var btnClass = {
        'display': 'inline',
        'position': 'fixed',
        'right': '100px',
        'bottom': '20px',
        'z-index': '300',
        'width': '45px',
        'height': '45px',
        'border-radius': '10px',
        '-moz-border-radius': '10px',
        'background': '#2D6DCC',
        'color': '#FFF',
        'opacity': .8,
        'text-align': 'center',
        'line-height': '45px',
        'cursor': 'pointer',
    }
    $jeditBtn.css(btnClass)
    $j('body').append($jeditBtn)
    var btn = document.getElementById("edit-html-Btn");

    var flag = 0;

    $j("#edit-html-Btn").click(function () {
        var body = document.querySelector("body");
        if (flag == 1) {
            body.setAttribute('contenteditable', "false");
            flag = 0
            showTips('还原成功!', 200, 2);
        } else if (flag == 0) {
            body.setAttribute('contenteditable', "true");
            flag = 1
            showTips('修改成功!', 200, 2);
        }
        console.log("success")

    });


    function showTips(content, height, time) {
        //窗口的宽度
        var windowWidth = $j(window).width();
        var tipsDiv = '<div class="tipsClass">' + content + '</div>';
        $j('body').append(tipsDiv);
        $j('div.tipsClass').css({
            'top': height + 'px',
            'left': (windowWidth / 2) - 350 / 2 + 'px',
            'position': 'absolute',
            'padding': '3px 5px',
            'background': '#8FBC8F',
            'font-size': 12 + 'px',
            'margin': '0 auto',
            'text-align': 'center',
            'width': '350px',
            'height': 'auto',
            'color': '#fff',
            'opacity': '0.8'
        }).show();
        setTimeout(function () { $j('div.tipsClass').fadeOut(); }, (time * 1000));

        console.log("编辑脚本加载完毕")
    }
    });
    
})()