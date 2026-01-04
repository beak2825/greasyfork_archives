// ==UserScript==
// @name         放牧的风免费SSR获取所有链接
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  在放牧的风免费账号获取所有链接
// @author       oneisall8955
// @require      https://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js
// @match        https://www.youneed.win/free-ssr/*
// @match        https://www.youneed.win/free-ssr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385723/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E%E5%85%8D%E8%B4%B9SSR%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/385723/%E6%94%BE%E7%89%A7%E7%9A%84%E9%A3%8E%E5%85%8D%E8%B4%B9SSR%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
var ssrArray=[]
$("#post-box tbody tr a").each(function(){
    var $this=$(this)
    ssrArray.push($this.attr('href'))
})
//console.log(ssrArray)
$.each(ssrArray,function(index,item){
    //console.log(item)
})
var linkTotal=ssrArray.join('\n')
console.log(linkTotal)
var $copySSRBtn=$('<span id="copy-ssr-btn" title="复制链接">COPY</span>')
var btnClass={
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
    'cursor':'pointer',
}
$copySSRBtn.css(btnClass)
$copySSRBtn.attr('data-clipboard-text', linkTotal);
var clipboard = new Clipboard('#copy-ssr-btn');
clipboard.on('success', function(e) {
    showTips('已成功复制SSR!',200,2);
});
$('body').append($copySSRBtn)
function showTips( content, height, time ){
    //窗口的宽度
    var windowWidth = $(window).width();
    var tipsDiv = '<div class="tipsClass">' + content + '</div>';
    $( 'body' ).append( tipsDiv );
    $( 'div.tipsClass' ).css({
        'top'       : height + 'px',
        'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
        'position'  : 'absolute',
        'padding'   : '3px 5px',
        'background': '#8FBC8F',
        'font-size' : 12 + 'px',
        'margin'    : '0 auto',
        'text-align': 'center',
        'width'     : '350px',
        'height'    : 'auto',
        'color'     : '#fff',
        'opacity'   : '0.8'
    }).show();
    setTimeout( function(){$( 'div.tipsClass' ).fadeOut();}, ( time * 1000 ) );
}
})();