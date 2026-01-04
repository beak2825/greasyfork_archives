// ==UserScript==
// @name         网易新闻视频地址解析
// @namespace    http://fulicat.com
// @version      1.0.4
// @url           https://greasyfork.org/zh-CN/scripts/382595
// @description  网易新闻内容 视频地址 解析
// @author       Jack.Chan
// @match        *://c.m.163.com/news/*
// @match        *://3g.163.com/news/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382595/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/382595/%E7%BD%91%E6%98%93%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        var $player = document.querySelector('#player');
        if ($player && $player.src) {
            var url = $player.src, title = document.title;
            var style = [];
            style.push('<style type="text/css">');
            style.push('.parser{position:fixed;right:0;bottom:0;left:0px;z-index:99999;background-color:rgba(255,255,255,0.75);box-shadow: 0 -3px 10px 2px #ccc;}');
            style.push('.parser-list{max-width:750px;margin:0 auto;padding-bottom:10px;background-color:rgba(255,255,255,0.95);line-height:2em;overflow:hidden;}');
            style.push('.parser-list>dt{background-color:#eee;font-size:18px;padding:10px;}');
            style.push('.parser-list>dd{border-top:1px #ccc solid;padding:10px 10px;}');
            style.push('.parser-list .js-btn{display:inline-block;background:#ee1a1a;color:#fff;border-radius:5px;font-size:16px;padding:8px 15px;margin-right:15px;}');
            style.push('.parser-list a{color:#3d93ef;}');
            style.push('.parser-list a:hover{text-decoration:underline;}');
            style.push('.g-body-wrap{margin-top:0;}');
            style.push('.m-video-player{position:static;top:0;margin-left:0;}');
            style.push('</style>');

            var html = [];
            html.push('<dl class="parser-list">');
            html.push('<dt>');
            html.push('<button type="button" class="js-btn js-btn-action" data-action="all" data-text="复制">复制</button>');
            html.push('<button type="button" class="js-btn js-btn-action" data-action="title" data-text="复制标题">复制标题</button>');
            html.push('<button type="button" class="js-btn js-btn-action" data-action="url" data-text="复制链接">复制链接</button>');
            html.push('<p id="js-copy-title">'+ title +'</p>');
            html.push('</dt>');
            html.push('<dd><a target="_blank" href="'+ url +'">'+ title +'</a>&nbsp;&nbsp;&nbsp;<a target="_blank" href="'+ url +'" download="'+ title +'">下载</a></dd>');
            html.push('</dl>');

            var $parser = document.createElement('div');
            $parser.id = 'parser';
            $parser.className = 'parser';
            $parser.innerHTML = style.join('') + html.join('');
            document.body.appendChild($parser);

            var $btnActions = document.querySelectorAll('.js-btn-action');
            $btnActions.forEach(function(item, itemIndex){
                (function($el, index) {
                    console.log($el, index);
                    $el.addEventListener('click', function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        var action = this.dataset.action;
                        var data = '';
                        switch(action) {
                            case 'all':
                                data = title +'\n\r'+ url;
                                break;
                            case 'title':
                                data = title;
                                break;
                            case 'url':
                                data = url;
                                break;
                        }
                        if (data) {
                            copy(data, function() {
                                $el.innerText = '复制成功';
                                setTimeout(function() {
                                    $el.innerText = $el.dataset.text;
                                }, 2500);
                            })
                        }
                    })
                })(item);
            });

            var $items = document.querySelectorAll('li.js-open-newsapp');
            $items && $items.forEach(function(item) {
                (function(li){
                    var nli = li.cloneNode(true);
                    nli.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var param = this.dataset.param;
                        if (param) {
                            location.href = '//c.m.163.com/news/v/'+ param +'.html';
                        }
                        return false;
                    }
                    li.parentNode.replaceChild(nli, li);
                })(item);
            });

        }

        fixes();
    }

    function copy(text, callback) {
        if (text !== undefined) {
            var $textarea = document.createElement('textarea');
            $textarea.setAttribute('readonly', 'readonly');
            $textarea.style.cssText = 'position:absolute;left:-999px;top:-999px;width:1px;height:1px;';
            $textarea.value = text;
            document.body.appendChild($textarea);
            $textarea.select();
            setTimeout(function() {
                document.execCommand('copy');
                if (typeof callback === 'function') {
                    callback(text);
                    document.body.removeChild($textarea);
                }
            }, 300);
        }

    }

    function fixes() {
        try{
            document.querySelector('article[id^=article-]').style.cssText = '';
            //document.querySelector('article[id^=article-]').id = ''
            document.querySelector('.js-show-article').click(); //自动展开文章
            document.querySelector('.g-top-slider').remove();
            document.querySelector('.js-slider').remove();
            document.querySelector('.doc-footer-wrapper').remove();
            document.querySelector('.m-slider-footer').remove();
        }catch(ex){}
    }

    if (location.href.startsWith('https://c.m.163.com/news/') || location.href.startsWith('https://3g.163.com/news/')) {
        fixes();

        setTimeout(function(){
            init();
        }, 1000);
    }

})();