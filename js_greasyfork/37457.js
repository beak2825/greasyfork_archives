// ==UserScript==
// @name         Tower Title Copy
// @name:zh-CN  复制Tower标题
// @namespace    https://tower.im/
// @version      0.3
// @description  Copy tower task title to clipboard!
// @description:zh-cn  复制 Tower 任务卡片上的标题到剪贴板
// @author       Ruter
// @match        https://tower.im/projects/*
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37457/Tower%20Title%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/37457/Tower%20Title%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toast style
    $("style").last().append("#toast{display:none;position:fixed;top:10%;left:50%;margin-top:-20px;margin-left:-75px;width:150px;height:40px;border-radius:10px;background:#353535;text-align:center;font-size:11px;line-height:40px;color:#fff;}");
    // Toast node
    $('<div/>', {id: 'toast', text: ''}).appendTo($("body"));
    // Add copy btn to each card
    $("div.todo-actions.actions > .inr").append($('<a/>', {
        'class': 'copy',
        title: '复制',
        text: '复制',
        css: {'background-position': '6px -115px'}
    }));
    // Add clipboard.js event handler
    var clipboard = new Clipboard('a.copy', {
        text: function(trigger) {
            var node = trigger.parentNode.parentNode.nextElementSibling.getElementsByClassName("todo-rest")[0];
            return node.innerText.trim();
        }
    });
    clipboard.on('success', function(e){
        $("#toast").text("已复制到剪贴板");
        $("#toast").fadeIn().delay(1000).fadeOut();
    });
    clipboard.on('error', function(e){
        $("#toast").text("复制失败");
        $("#toast").fadeIn().delay(1000).fadeOut();
    });
    // Listen the DOM Node
    $("ul.todos.todos-uncompleted").bind('DOMNodeInserted', function(e) {
        var $todos = $(e.currentTarget).children("li.todo");
        $todos.each(function(){
            var $todo = $(this);
            var $inr = $todo.find("div.inr");
            var $a = $inr.children("a.copy");
            if (!$a.length) {
                $inr.append($('<a/>', {
                    'class': 'copy',
                    title: '复制',
                    text: '复制',
                    css: {'background-position': '6px -115px'}
                }));
            }
        });
    });
})();