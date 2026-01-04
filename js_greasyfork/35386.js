// ==UserScript==
// @name         网页版阿里旺旺
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  淘宝天猫详情页插入旺旺聊天窗口
// @author       You
// @match        https://item.taobao.com/item.htm?*
// @match        *://h5.m.taobao.com/awp/core/detail.htm?*
// @match        *://h5.m.taobao.com/ww/index.htm?*
// @match        https://detail.tmall.com/item.htm?*
// @match        https://detail.m.tmall.com/item.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35386/%E7%BD%91%E9%A1%B5%E7%89%88%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/35386/%E7%BD%91%E9%A1%B5%E7%89%88%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    if(url.indexOf('taobao') !== -1) { //淘宝页面
        window.onload = function() { // Dom渲染完才能开始，否则差找不到节点
            if(url.indexOf('h5.m.taobao') === -1){ //正常pc页面，非移动端
                iconInsert();


                var iconTb = document.getElementById('wangwang-icon');
                iconTb.onclick = function(){  //淘宝右下角插入的旺旺图标  点击事件
                    taobaoClick(url);
                };
                var contact = document.getElementsByClassName('ww-inline');

                contact[0].onclick= function(){   //淘宝网页原旺旺（联系我们） 点击事件
                    taobaoClick(url) ;
                };

            } else if (url.indexOf('awp/core/detail') !== -1){  //移动端详情页
                var wangwang = document.getElementsByClassName('icon');
                wangwang[0].click();
            } else if(url.indexOf('ww/index') !== -1){
                var back = document.getElementsByClassName('hisback');
                back[0].innerHTML= '关闭';
                back[0].onclick = function(event){
                    event.preventDefault();
                };
            }
        } ;

    }
    if( url.indexOf('tmall') !== -1){ //天猫页面
        window.onload=function(){
            if(url.indexOf('m.tmall') === -1){
                iconInsert();
                var iconTm = document.getElementById('wangwang-icon');
                iconTm.onclick = function (){ //天猫右下角插入的旺旺图标  点击事件
                    TmClick(url);
                };

                // var a = document.getElementsByClassName('name');
                //a[0].onclick= function(){   //天猫网页原旺旺（联系我们） 点击事件----------->异步加载，获取dom无效。
                //TmClick(url);
                //  };

            }else if (url.indexOf('detail.m.tmal') !== -1){  //移动端详情页

                var support = document.getElementsByClassName('support');
                var href = support[0].href;    //由于原链接为协议http:// 不安全无法打开。 对连接进行处理
                var hrefArr = href.split('');
                hrefArr.splice(4,0,'s');
                var hrefNew = hrefArr.join('');
                window.location.href= hrefNew;
            } else if(url.indexOf('ww/index') !== -1){
                var backTm = document.getElementsByClassName('hisback');
                backTm[0].innerHTML= '关闭';
                backTm[0].onclick = function(event){
                    event.preventDefault();
                };
            }
        };

    }
    //封装 插入旺旺icon
    function iconInsert(){
        var icon = document.createElement('div');  // 插入旺旺图标
        icon.id='wangwang-icon';
        icon.style.width = '100px';
        icon.style.height = '100px';
        icon.style.background = 'url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511083827779&di=88ced5d100067b9a9669009f8c780920&imgtype=0&src=http%3A%2F%2Fimg.25pp.com%2Fuploadfile%2Fsoft%2Fimages%2F2012%2F1128%2F20121128021904185.jpg")';
        icon.style.backgroundSize='cover';
        icon.style.position ='fixed';
        icon.style.bottom = '30px';
        icon.style.right = '50px';
        icon.style.zIndex = '2147483650';
        document.body.appendChild(icon);
    }
    //封装 淘宝点击 事件 (插入iframe--)
    function taobaoClick(url){
        var urlArr = url.split('');
        urlArr.splice(0,33,'https://h5.m.taobao.com/awp/core/detail.htm?');  //转换成移动端链接
        var urlNew = urlArr.join('');

        var insert = document.createElement('div');
        insert.id='iframeWrapper';
        insert.width='400px';
        insert.height='500px';
        insert.style.zIndex = '2147483650';
        insert.style.position = 'fixed';
        insert.style.right = '50px';
        insert.style.bottom = '10px';
        var button = document.createElement('div');  //插入 按钮 覆盖iframe的关闭
        button.style.position = 'absolute';
        button.style.height = '50px';
        button.style.width = '100px';
        button.style.zIndex = '1000';
        insert.appendChild(button);
        var iframe = document.createElement('iframe');  //插入iframe ==> 旺旺聊天窗口
        iframe.id = 'wangwang';
        iframe.width='400px';
        iframe.height='500px';
        iframe.style.zIndex = '10';

        iframe.src = urlNew;
        insert.appendChild(iframe);
        document.body.appendChild(insert);

        insert.onclick=function(){
            insert.style.display ='none';};
    }

    //封装天猫 点击事件
    function TmClick(url){
        var urlArr = url.split('');
        urlArr.splice(0,14,'https://detail.m');  //转换成移动端链接

        var urlNew = urlArr.join('');
        var insert = document.createElement('div');
        insert.id='iframeWrapper';
        insert.width='400px';
        insert.height='500px';
        insert.style.zIndex = '2147483650';
        insert.style.position = 'fixed';
        insert.style.right = '50px';
        insert.style.bottom = '10px';
        var button = document.createElement('div');  //插入 按钮 覆盖iframe的关闭
        button.style.position = 'absolute';
        button.style.height = '50px';
        button.style.width = '100px';
        button.style.zIndex = '1000';
        insert.appendChild(button);
        var iframe = document.createElement('iframe');  //插入iframe ==> 旺旺聊天窗口
        iframe.id = 'wangwang';
        iframe.width='400px';
        iframe.height='500px';
        iframe.style.zIndex = '10';

        iframe.src = urlNew;
        insert.appendChild(iframe);
        document.body.appendChild(insert);

        insert.onclick=function(){
            insert.style.display ='none';};
    }
    // Your code here...
})();