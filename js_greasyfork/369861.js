// ==UserScript==
// @name         百度文库文字复制
// @namespace    BlueFire
// @version      0.72
// @description  添加一个按钮，复制百度文库中的文字
// @author       BlueFire
// @match        *://wenku.baidu.com/view/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369861/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/369861/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!$){
        var s = document.createElement ("script");
        s.src = "http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js";
        s.async = false;
        document.documentElement.appendChild (s);
    }

    let timeoutId = -1;
    let downloadBtn = '<div id="reader-copy-div" style="float:left;padding:10px 20px;background:green;z-index:999;position:relative;top:60px;left:0px;"><a id="reader-copy-text" href="###" style="color:white;font-size:15px;"><b class="ui-btn-btc">复制此页</b></a></div>';
    let toastDiv = '<div id="page-toast-div" style="margin: 0px auto;background: black;opacity: 0.8;padding: 15px 30px;position: fixed;z-index: 10001;display: block;top: 85%;left: 44%;"><span id="page-toast-span" style="color:white;font-size:15px;"></span></div>';
    let opacity = '0.95';
    let ua = navigator.userAgent;
    if(ua.indexOf("Edge") >= 0){
        opacity = '0.6';
    }
    else if(ua.indexOf("Chrome")){
        opacity = '0.95';
    }
    let textBlockDiv = '<div id="page-textblock-div" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;"><div id="page-textblock-cancel-layer" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div><pre id="page-textblock" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre></div>"';
    function Copy(str){
        let result = false;
        let save = function(e){
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', save);
        result = document.execCommand('copy');
        document.removeEventListener('copy',save);
        return result;
    }

    function ShowToast(str){
        if(timeoutId >= 0){
            clearTimeout(timeoutId);
        }
        $('#page-toast-div').remove();
        $('body').append(toastDiv);
        $('#page-toast-span').text(str);
        timeoutId=setTimeout("$('#page-toast-div').remove();",1500);
    }

    function ShowTextBlock(str){
        $('#page-textblock-div').remove();
        $('body').append(textBlockDiv);
        $('#page-textblock').text(str);
        $('#page-textblock-cancel-layer').click(function(){
            $('#page-textblock-div').remove();
        });
    }

    function PrependButtonTo(ele){
        ele.prepend(downloadBtn);
        ele.find('#reader-copy-text').click(function(){
            let str = "";
            let parent = $(this).parent().parent();
            parent.find('.reader-word-layer').each(function(){
                str += this.innerText.replace(/\u2002/g,' ');
            });
            str = str.replace(/。\s/g,'。\r\n');
            let result= (str.length > 0);
            if(result){
                ShowToast("解析成功");
                ShowTextBlock(str);
            }else{
                ShowToast("解析失败，请等待网页加载");
            }
        });
    }

    $(document).ready(function(){
        $('.mod.reader-page.complex').each(function(){
            PrependButtonTo($(this));
        });
    });
})();
