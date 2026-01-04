
// ==UserScript==
// @name         蜜柑计划(Mikan Project)复制全部磁链
// @namespace    
// @version      0.1.5
// @description  复制某部番的某个字幕组的全部磁链
// @author       cookedfish
// @match        http*://mikanime.tv/*
// @match        http*://mikanani.me/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482954/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E5%A4%8D%E5%88%B6%E5%85%A8%E9%83%A8%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482954/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E5%A4%8D%E5%88%B6%E5%85%A8%E9%83%A8%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==
function print_messageBar(max){
    var messageBar = document.createElement('div');
    messageBar.textContent = max;
    messageBar.style.position = 'fixed';
    messageBar.style.top = '0';
    messageBar.style.left = '0';
    messageBar.style.width = '100%';
    messageBar.style.backgroundColor = 'green';
    messageBar.style.color = 'white';
    messageBar.style.textAlign = 'center';
    messageBar.style.padding = '10px 0';
    document.body.appendChild(messageBar);
    setTimeout(function() {
        messageBar.parentNode.removeChild(messageBar);
    }, 1000);
}
function serch(text,Value){
    var startIndex = 0;
    while (startIndex < text.length) {
        var index = text.indexOf(Value, startIndex);
        if (index !== -1) {
        console.log('%c' + 'true','color: green',text,Value);
        return true;
      } else {
        break;
    }
}
    console.log('%c' + 'false', 'color: red', text, Value);
    return false;
}
function multiple_match(texts, Value) {
    var searchTerms = Value.split(' ');
    for (var i = 0; i < searchTerms.length; i++) {
        console.log(searchTerms[i]);
        if (!serch(texts, searchTerms[i])) {return false;}
    }
    return true;
}
function get_xunlei() {
    var num = parseInt($(this).closest('div').attr('id'));
    console.log(num);
    var urls = [];
    var abc = undefined;
    $('.table').find('a').each(function () {
        if($(this).attr('class')!=="js-magnet magnet-link") return true;
        if (parseInt($(this).closest('table').prev('div').attr('id')) !== num && $(this).closest('table').prev('div').attr('id')!==abc) return true;
        if($(this).closest('table').prev('div').find('input').val()&&multiple_match($(this).prev('a').text(),$(this).closest('table').prev('div').find('input').val())===false) return true;
        urls.push($(this).attr('data-clipboard-text'));
    });
    GM_setClipboard(urls.join('\n'));
    print_messageBar('复制了'+urls.length+'个链接');
}
function click(){
    document.querySelectorAll('a.js-expand-episode').forEach(function(element) {
    element.click();
    });
}
$(function () {
    $(document).on('click', 'a[ref="thunder"]', get_xunlei);
    $('.subgroup-text i').closest('a').each(function () {
        var $input = $('<input type="text" id="magnet-input" placeholder="输入关键字词(区分大小写)">');
        $(this).after($input);
        var $thunder_magnet = $('<a class="js-magnet magnet-link" ref="thunder" style="background-color:white" >  [复制全部]  </a>');
        $(this).after($thunder_magnet);
        });
    click();
});