// ==UserScript==
// @name         alt+点击下载图片
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  会被已有alt功能的浏览器覆盖；左键+alt 自动下载图片；左键+ctrl+alt 下载图片前进行命名；
// @author       yeshiqiu_337676937
// @match        *://*/*
// @icon         data:image/png;base64,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
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/461510/alt%2B%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/461510/alt%2B%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ctrl+alt+点击 下载图片

    var _alt = !1,_ctrl = !1;
    if($ != 'undefined'){
        console.log('jq模式');
        $(document).on('keydown._ctrl_alt_download',function(event){
            if(event.keyCode == 18){_alt = !0; }
            if(event.keyCode == 17){_ctrl = !0; }
        }).on('keyup._ctrl_alt_download',function(event){
            if(event.keyCode == 18){_alt = !1; }
            if(event.keyCode == 17){_ctrl = !1; }
        });
        $('img').off('mousedown._ctrl_alt_download').on('mousedown._ctrl_alt_download',function(event) {
            // console.log(_alt);
            // console.log(_ctrl);
            if(_alt){
                var $img = $(this);
                var src = $img.attr('src');
                var alt = $img.attr('alt');
                var name = (!!alt && alt != '' ? alt + '___' : '') + src.match(/[\w\-\_]+.jpg|[\w\-\_]+.png|[\w\-\_]+.jpeg/g,'');
                if(_ctrl){
                    name = prompt('请输入图片名称', name) || name;
                }
                downloadIamge(src,name);
            }
        });
    }else{
        console.log('js模式');
        document.onkeydown = function(event){
            console.log('event,',event);
            if(event.keyCode == 18){_alt = !0; }
            if(event.keyCode == 17){_ctrl = !0; }
        }
        document.onkeyup = function(event){
            console.log('event,',event);
            if(event.keyCode == 18){_alt = !1; }
            if(event.keyCode == 17){_ctrl = !1; }
        }
        var imgs = document.getElementsByTagName('img');
        for (var i in imgs){
            imgs[i].onclick = function(event){
                var oImg = this;
                if(_alt){
                    var src = oImg.src;
                    var alt = oImg.alt;
                    var name = (alt != '' ? alt + '___' : '') + src.match(/[\w\-\_]+.jpg|[\w\-\_]+.png|[\w\-\_]+.jpeg/g,'');
                    if(_ctrl){
                        name = prompt('请输入图片名称', name) || name;
                    }
                    downloadIamge(src,name);
                }
            }
        }
    }
    window.onfocus = function() {
        _alt = !1;_ctrl = !1;
    }
    window.onblur = function() {
        _alt = !1;_ctrl = !1;
    }
    window.onscroll = function(){
        _alt = !1;_ctrl = !1;
    }
    function downloadIamge(src,name) {
        // 创建一个img标签
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = src;
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d')
            context.drawImage(image, 0, 0, image.width, image.height);
            var url = canvas.toDataURL('image/png');
            // 生成一个a元素
            var a = document.createElement('a');
            // 创建一个单击事件
            var event = new MouseEvent('click');
            // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
            a.download = name; // one是默认的名称
            // 将生成的URL设置为a.href属性
            a.href = url;
            // 触发a的单击事件
            a.dispatchEvent(event);
        }
        _alt = !1,_ctrl = !1;
    };


})();