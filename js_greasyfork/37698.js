// ==UserScript==
// @name         Better Spring Document Catelog
// @namespace    https://github.com/kyyblabla/BetterSpringDocCatalog
// @version      0.1.5
// @description  Better Spring Document Catelog 1.Add left sidebar nav 2.images css:max-width:100%
// @author       kyyblabla
// @match        http*://*.spring.io/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37698/Better%20Spring%20Document%20Catelog.user.js
// @updateURL https://update.greasyfork.org/scripts/37698/Better%20Spring%20Document%20Catelog.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(function() {
        /**
         * 递归获取目录节点
         */
        function getNodeMap(parentNode, map, level) {
            parentNode.find(">dt").each(function(i, e) {
                var title = $(this).text();
                if (title && title.trim() !== "") {
                    var parent = {
                        'title': $(this).text(),
                        'id': $(this).find('a:first-child').attr('href'),
                        'level': level,
                        'childs': []
                    };
                    var child = $(this).next('dd').find('>dl');
                    if (child.length > 0) {
                        getNodeMap(child, parent.childs, level + 1);
                    }
                    map.push(parent);
                }
            });
        }
        /**
         * 递归渲染导航目录节点
         */
        function renderToc(parentNode, parentObj) {
            var ul = $("<ul class='level" + parentObj.level + "'><ul>");
            for (var v of parentObj.childs) {
                var li = $("<li>" + "<a title='" + v.title + "' href='" + v.id + "'>" + v.title + "</a></li>");
                renderToc(li, v);
                ul.append(li);
            }
            parentNode.append(ul);
        }
        /**
         * 绑定文档滚动事件，同步修改导航栏链接激活样式
         * TODO : 导航栏随文档内容滚动
         */
        function bindScrollEvent() {
            var titles = $('.book h1.title,.book h2.title,.book h3.title,.book h4.title');
            var links = $("#sd-toc ul a");
            $("body .book").scroll(function() {
                var lastScrollOverLink = null;
                var scrollTop = $(this).scrollTop();
                titles.each(function(i, e) {
                    if (e.offsetTop - 10 < scrollTop) {
                        lastScrollOverLink = $(this);
                    } else {
                        return false;
                    }
                });
                if (lastScrollOverLink) {
                    links.each(function() {
                        if ($(this).attr("href") === lastScrollOverLink.children("a").attr("href")) {
                            activeATag($(this), true);
                            return false;
                        }
                    });
                }
            });
        }
        /**
         * 激活链接，为链接增加激活样式
         */
        function activeATag(ele, scrollToIt) {
            $('#sd-toc ul a').removeClass("active");
            ele.addClass("active");
            //if(scrollToIt===true){
            //    $("#sd-toc").scrollTop(ele.offset().top);
            //}
        }
        let rootNode = $("dl.toc");
        let map = [];
        getNodeMap(rootNode, map, 0);
        if (map.length < 1) {
            return;
        }
        console.log(map);
        var toc = $('<div id=\'sd-toc\'></div>');
        renderToc(toc, {
            'level': 0,
            'childs': map
        });
        toc.insertBefore("body > .book");
        $('#sd-toc ul a').click(function() {
            activeATag($(this));
        });
        var style = "img{max-width:100% !important} " + ".book{position:absolute;left:320px;right:0;top:0;bottom:0;padding-right:20px;overflow-y:auto}" + "#sd-toc { position:absolute;left:0;top:0;bottom:0;width:280px;background-color:#fafafa;border-right:1px solid #ccc;overflow-y:auto;}" + "#sd-toc ul {list-style:none;padding-left:20px}" + "#sd-toc ul.level0{padding-left:0px}" + "#sd-toc ul a{display: block;padding: 10px 15px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;position: relative;color:#364149}" + "#sd-toc ul a:hover{text-decoration: underline}" + "#sd-toc ul a.active{color:#008cff}";
        GM_addStyle(style);
        bindScrollEvent();
    });
})();
