// ==UserScript==
// @name         腾讯微云-笔记字数统计脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       bimostyle@qq.com
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @include      *://*.weiyun.com/disk/note*
// @include      *://weiyun.com/disk/note*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/386188/%E8%85%BE%E8%AE%AF%E5%BE%AE%E4%BA%91-%E7%AC%94%E8%AE%B0%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/386188/%E8%85%BE%E8%AE%AF%E5%BE%AE%E4%BA%91-%E7%AC%94%E8%AE%B0%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.fn.wait = function (func, times, interval) {
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = this,
            _selector = this.selector, //选择器
            _iIntervalID; //定时器id
        if( this.length ){ //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --
                _self = $(_selector); //再次选择
                if( _self.length ) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }
    // Your code here...
    window.onload = function(){

        $('.layout-body-inner').css({paddingLeft:0})
        $('.layout-aside').css({display:'none'}) ;
        $('.mod-note-group').css({marginLeft:'10px'});
        $('.mod-note-group .note-group-list-inner').wait(function(){
            $('.mod-note-group .note-group-list-inner').css({padding:'10px'});
        })
        $('.mod-note-group .note-group-list-inner .note-group-list-bd').wait(function(){
            $('.mod-note-group .note-group-list-inner .note-group-list-bd:nth-of-type(2)').css({display:'none'});
        });
        setTimeout(function(){
            $('.mod-action-wrap-menu .action-item').wait(function(){
                var editor = $('#editor')[0];
                var texts = editor.textContent.replace(/\s/gi,'');
                $('.mod-action-wrap-menu')[0].innerHTML += '<div class="action-item" id="chensuiyi-text-total"><div class="action-item-con">总字数：<span class="act-txt">'+texts.replace(' ','').length+'</span></div></div>';
                var totalText = $('#chensuiyi-text-total .act-txt');
                editor.__quill.on('text-change', function(delta, oldDelta, source) {
                    totalText.text(editor.textContent.replace(/\s/gi,'').length);
                });
            });
        },1000)
    }
})();