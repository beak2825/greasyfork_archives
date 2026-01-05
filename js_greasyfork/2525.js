// ==UserScript==
// @name 饭否-手机版自动翻页
// @version 1.0.1
// @author HackMyBrain
// @description 在 m.fanfou.com 首页, 允许免刷新加载下一页，和滚动条到达底部后自动翻页
// @include http://m.fanfou.com/home
// @include https://m.fanfou.com/home
// @include http://m.fanfou.com/home/*
// @include https://m.fanfou.com/home/*
// @include http://m.fanfou.com/home?v=*
// @include https://m.fanfou.com/home?v=*
// @include http://m.fanfou.com/home?max_id=*
// @include https://m.fanfou.com/home?max_id=*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2525/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/2525/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==


(function (){
    'strict mode'
    
    //设置项开始
    var config = { doAutoPage : true }; //是否启用自动翻页：true 为启用, false 为禁用. (必须使用半角字符)
    //设置项结束

    var status = { isLoading : false, timer : undefined }; 
    
    function getScrollTop() {
        return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    }

    function getClientHeight() {
        return document.documentElement.clientHeight;
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
    }

    function checkPageBottom() { 
        if ( ( getScrollTop() + getClientHeight() == getScrollHeight() ) ) {
            loadNextPage();
        }
    }
    
    function clickToLoad(e) { 
        e.preventDefault();
        e.stopPropagation();
        loadNextPage();
    }
    
    function replaceNextURL() { 
        var max_id = pagi.parentElement.previousElementSibling.querySelector('span.a > a[href*="/msg.favorite"]').href.match(/\/([^\/]+$)/)[1];
        pagi.href = 'home?max_id=' + max_id;
        pagi.innerHTML = '更多';
    }
    
    function loadNextPage() {
        if ( status.isLoading ) return;
        status.isLoading = true;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', pagi.href);
        xhr.timeout = 10000;
        xhr.ontimeout = function(){
            status.isLoading = false;
            pagi.innerHTML = '更多 (加载超时, 点击重试)';
        };
        xhr.onloadstart = function(){
            pagi.innerHTML = '更多 (正在载入)';
        };
        xhr.onload = function(){
            var nextpage_doc = document.implementation.createHTMLDocument('');
            nextpage_doc.body.innerHTML = xhr.responseText;
            xhr = null;
            var mes = nextpage_doc.evaluate(".//p/a[@class='p']/.." , nextpage_doc.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if ( mes.snapshotLength == 0 ) {
                pagi.innerHTML = '达到首页(/home)允许的时间回溯限制, 无法显示更早的消息';
                clearInterval(status.timer);
                return;
            }
            var newElement = document.createDocumentFragment();
            for (var i = 0; i < mes.snapshotLength; i++) {
                newElement.appendChild( mes.snapshotItem(i) );
            }
            mes = null;
            nextpage_doc = null;
            pagi.parentElement.parentElement.insertBefore(newElement, pagi.parentElement);
            replaceNextURL();
            status.isLoading = false;
        };
        xhr.send();
    }

    var pagi = document.querySelector('[accesskey="6"]');
    pagi.addEventListener('click', clickToLoad, false);
    
    replaceNextURL();
    
    if ( config.doAutoPage ) {
        status.timer = setInterval(checkPageBottom, 300);
    }
})();