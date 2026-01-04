// ==UserScript==
// @name         阿里巴巴矢量图标下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无需登录，批量下载阿里巴巴矢量图标
// @author       GodFinal
// @match        *://www.iconfont.cn/*
// @grant        unsafeWindow
// @icon         http://gtms04.alicdn.com/tps/i4/TB1_oz6GVXXXXaFXpXXJDFnIXXX-64-64.ico
// @require      https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @require      https://cdn.bootcss.com/jszip-utils/0.0.2/jszip-utils.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdn.bootcss.com/jquery/3.3.0/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/367847/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/367847/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zip = new JSZip();

    function processHtml(){

        var $btnSelectOrClear = $('<li class="nav-item"><a class="nav-item-link" href="javascript:void(0);"><span>全选/清空</span></ a></li>');
        var $btnDownload = $('<li class="nav-item"><a class="nav-item-link" href="javascript:void(0);"><span>下载(0)</span></ a></li>');
        var $text = $btnDownload.find('span');
        var total = 0;
        var drag = false;
        $('.site-nav nav > ul').append($btnSelectOrClear).append($btnDownload);
        $('header .site-nav nav li.nav-item').css({'padding':'0 6px'});
        $('.icon-cover').remove();

        var $list = $('#inmain .block-icon-list').css('user-select','none');
        var $items = $('#inmain .block-icon-list li');
        var array = [];
        var arrayItem = [];
        var x = -1;
        var y = -1;
        var num = Math.round($list.width() / ($items.eq(0).width() + 30));

        $items.each(function(i,item){
            if(i % num === 0){
                if(arrayItem.length){
                    array.push(arrayItem);
                }
                x = -1;
                y++;
                arrayItem = [];
            }
            x++;
            arrayItem.push($(item).data('y',y).data('x',x));
        });
        array.push(arrayItem);

        $btnSelectOrClear.on('click',function(){
            if(total){
                $list.find('.selected').removeClass('selected');
                total = 0;
            }else{
                $items.addClass('selected');
                total = $items.length;
            }
            $text.text('下载(' + total + ')');
        });
        $btnDownload.on('click',function(){
            $list.find('.selected').each(function(i,item){
                var $item = $(item);
                var svg = $item.find('.icon').clone(true).removeAttr('class style p-id data-spm-anchor-id');
                svg.find('path').removeAttr('p-id fill data-spm-anchor-id');
                zip.file($item.find('.icon-name').text()+".svg",svg[0].outerHTML);
            });
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                saveAs(content, "iconfont.zip");
            });
        });

        var posX = 0;
        var posY = 0;
        var tarX = 0;
        var tarY = 0;
        $items.css('cursor','pointer').on('click',function(){
            $(this).toggleClass('selected').hasClass('selected') ? total++ : total--;
            $text.text('下载(' + total + ')');

        }).on('mousedown',function(){
            var $this = $(this);
            drag = true;
            posX = $this.data('x');
            posY = $this.data('y');
        }).on('mouseover',function(){
            if(drag){
                var $this = $(this);
                tarX = $this.data('x');
                tarY = $this.data('y');
                var startY = Math.min(posY,tarY);
                var startX = Math.min(posX,tarX);
                var endY = Math.max(posY,tarY);
                var endX = Math.max(posX,tarX);
                for(var i = startY; i <= endY; i++){
                    for(var j = startX; j <= endX; j++){
                        array[i][j].addClass('selected');
                    }
                }
                total = $list.find('.selected').length;
                $text.text('下载(' + total + ')');
            }
        });
        $(document).on('mouseup',function(){
            drag = false;
            posX = 0;
            posY = 0;
            tarX = 0;
            tarY = 0;
        });
    }

    var timer = setInterval(function(){
        if($('.block-icon-list li').length){
            clearInterval(timer);
            processHtml();
        }
        console.log('Listening');
    },500);


})();