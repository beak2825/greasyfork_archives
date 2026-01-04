// ==UserScript==
// @name         获取网页链接地址
// @namespace    https://github.com/zhchjiang95
// @version      1.2.1
// @description  获取网页中的所有超链接地址，自动生成 json 格式。无开启关闭按钮，网页加载自动获取链接。支持拖动，双击关闭。
// @author       zhchjiang95 <zhchjiang99@outlook.com>
// @include      http://*
// @include	     https://*
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @match        http://*
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381889/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/381889/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function(){
    var temp = [], aEle = $('a');
    for(var i = 0; i < aEle.length; i ++){
        var ele = {
            title: aEle.eq(i).text(),
            url: aEle.eq(i).attr('href')
        }
        if(!!ele.url && ele.url.indexOf('http') == -1){
            ele.url = location.origin + ele.url
        }
        temp.push(ele)
    }
    var txt = `<textarea id="s-txt" draggable="true" style="position: fixed;top: 50%;left: 50%;z-index:99999;transform: translate(-50%,-50%);background: green;color:#f1f0f6;border-radius: 6px;box-shadow: 0 0 40px green;font-size: 13px;line-height: 20px;" cols="80" rows="20">fiume.cn 提示：\n该页面的链接已获取完毕，请复制(Ctrl + A 全选；Ctrl + 鼠标左键空白处拖动；双击关闭）：\n${JSON.stringify(temp)}</textarea>`
    $('body').append(txt);
    $('#s-txt').dblclick(() => {
        confirm('是否关闭？') ? $('#s-txt').remove() : '';
    })
    $(document).keydown(() => {
        $('#s-txt')[0].ondrag = function(e){
            $('#s-txt').css({
                top: e.clientY,
                left: e.clientX
            })
        }
    }).keyup(() => {
        $('#s-txt')[0].ondrag = null;
    })
}());