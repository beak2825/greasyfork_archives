// ==UserScript==
// @name         sspnote java copy button
// @namespace    http://tampermonkey.net/
// @version      2024年8月15日15点43分
// @description  add java copy button
// @author       onionycs
// @match        https://www.sspnote.com/detail/*
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sspnote.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503625/sspnote%20java%20copy%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/503625/sspnote%20java%20copy%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    /* globals jQuery, $, waitForKeyElements */
    $('.ssp-main-box')[0].style.width='1200px';
    var docs= $('.note-content');
    $('<button class="increase-width" style="margin-right: 100px">增加200px</button>').insertBefore(docs);
    $('<button class="decrease-width">减少200px</button>').insertBefore(docs);
    $('.increase-width').click(function() {
        var width = parseInt($('.ssp-main-box').first().css('width'), 10) || 0; // 获取当前宽度，如果无法获取则默认为0
        $('.ssp-main-box').first().css('width', width + 200 + 'px'); // 增加200px
    });

    // 为减少宽度的按钮添加点击事件
    $('.decrease-width').click(function() {
        var width = parseInt($('.ssp-main-box').first().css('width'), 10) || 0; // 获取当前宽度，如果无法获取则默认为0
        $('.ssp-main-box').first().css('width', Math.max(0, width - 200) + 'px'); // 减少200px，并确保宽度不会小于0
    });

    $('strong').toArray().forEach(s => {
        s.style.color = '#65a3f8';
        s.style.backgroundColor = 'black';
    });


    $(document).ready(function() {
        // 找到所有包含具有language-Java类的<code>标签的<pre>标签
        $('pre:has(code.language-Java)').each(function() {
            // 在每个找到的<pre>标签之前插入一个按钮
            $('<button>复制Java代码</button>').insertBefore(this).click(function() {
                // 找到与这个按钮相关联的<pre>标签内的<code>标签
                var $code = $(this).next('pre').find('code.language-Java');

                // 获取<code>标签的文本
                var javaCodeText = $code.text();

                // 复制到剪贴板
                navigator.clipboard.writeText(javaCodeText).then(function() {
                    console.log('代码已复制到剪贴板');
                    // 可以在这里添加一些UI反馈，比如改变按钮的文本或颜色
                    $(this).text('已复制!');
                    setTimeout(function() {
                        $(this).text('复制Java代码'); // 恢复按钮文本
                    }.bind(this), 2000); // 2秒后恢复
                }, function(err) {
                    console.error('复制失败: ', err);
                });

                // 注意：上面的$(this)在navigator.clipboard.writeText的回调中不指向按钮，
                // 所以我们需要使用.bind(this)或者将按钮保存在一个外部变量中
                // 这里我使用了一个匿名函数来捕获正确的this上下文
                (function(button) {
                    navigator.clipboard.writeText(javaCodeText).then(function() {
                        console.log('代码已复制到剪贴板');
                        button.text('已复制!');
                        setTimeout(function() {
                            button.text('复制Java代码');
                        }, 2000);
                    }, function(err) {
                        console.error('复制失败: ', err);
                    });
                })($(this)); // 将$(this)（即按钮）作为参数传递给匿名函数
            });
        });

        // 找到所有包含具有language-Java类的<code>标签的<pre>标签
        $('pre:has(code.language-java)').each(function() {
            // 在每个找到的<pre>标签之前插入一个按钮
            $('<button>复制Java代码</button>').insertBefore(this).click(function() {
                // 找到与这个按钮相关联的<pre>标签内的<code>标签
                var $code = $(this).next('pre').find('code.language-java');

                // 获取<code>标签的文本
                var javaCodeText = $code.text();

                // 复制到剪贴板
                navigator.clipboard.writeText(javaCodeText).then(function() {
                    console.log('代码已复制到剪贴板');
                    // 可以在这里添加一些UI反馈，比如改变按钮的文本或颜色
                    $(this).text('已复制!');
                    setTimeout(function() {
                        $(this).text('复制Java代码'); // 恢复按钮文本
                    }.bind(this), 2000); // 2秒后恢复
                }, function(err) {
                    console.error('复制失败: ', err);
                });

                // 注意：上面的$(this)在navigator.clipboard.writeText的回调中不指向按钮，
                // 所以我们需要使用.bind(this)或者将按钮保存在一个外部变量中
                // 这里我使用了一个匿名函数来捕获正确的this上下文
                (function(button) {
                    navigator.clipboard.writeText(javaCodeText).then(function() {
                        console.log('代码已复制到剪贴板');
                        button.text('已复制!');
                        setTimeout(function() {
                            button.text('复制Java代码');
                        }, 2000);
                    }, function(err) {
                        console.error('复制失败: ', err);
                    });
                })($(this)); // 将$(this)（即按钮）作为参数传递给匿名函数
            });
        });
    });

})();