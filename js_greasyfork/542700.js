// ==UserScript==
// @license      MIT
// @name         TAPD评论插件
// @namespace    https://greasyfork.org/zh-CN/users/1495370-youngledo
// @version      1.0.0
// @description  便于快速生成评论模板。
// @author       佚名
// @match        https://www.tapd.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542700/TAPD%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542700/TAPD%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commentType = [
        {
           label: '需求备注',
           template: '<h4>需求场景</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>解决方案</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>交互设计（高保真、低保真）</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>验收场景</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><p><br></p>'
        }, {
           label: '问题排查',
           template: '<h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>问题现象</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>平台版本</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>问题原因</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>影响版本</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>问题结论</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>重现步骤（地址）</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>修复建议</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>客户期望解决时间</h4><blockquote><p><br></p></blockquote>'
        }, {
           label: '开发提测',
           template: '<h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>修复分支<span data-mce-bogus="1" data-mce-type="format-caret"><span style="background-color: rgb(255, 204, 0);" data-mce-style="background-color: #ffcc00;"></span></span>&nbsp;</h4><blockquote><br></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>变更集</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>问题引入过程</h4><div style="color: gray;font-size:12px;">重点阐述问题是怎么发生的，如:X月开发某新特性调整XX内容，调整了什么内容引发了改问题</div><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>问题根因</h4><div style="color: gray;font-size:12px;">从需求-设计-实现-分支合并-测试-发包-交付-运维环节，先找到核心原因，再定位到阶段再描述该阶段出现什么问题</div><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>修复方案</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>修复版本</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>单元测试</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>影响场景|测试用例</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote>'
        }, {
           label: '代码审查',
           template: '<h4>代码审查结果：</h4><ul class="tox-checklist"><li class="">在指定的分支提交代码</li><li class="">代码实现符合预先实现方案</li><li class="">代码风格、代码规范符合要求</li><li class="">性能评估、兼容性评估</li><li class="">Framework版本、Core版本</li><li class="">已评估完影响范围</li></ul>'
        },{
           label: '产品验收',
           template: '<h4>产品验收结果：</h4><ul class="tox-checklist"><li class="">功能验收完成（功能、实现）</li><li class="">非功能验收完成（文档、用例）</li></ul><h4>验收建议：</h4><blockquote><p><br></p></blockquote>'
        },{
           label: '设计验收',
           template: '<h4>设计验收结果：</h4><ul class="tox-checklist"><li class="">UI验收完成（视觉还原、交互设计）</li><li class="">功能验收完成（功能、逻辑）</li></ul><h4>验收建议：</h4><blockquote><p><br></p></blockquote>'
        },{
           label: '测试验收',
           template: '<h4>测试验收结果：</h4><ul class="tox-checklist"><li class="">功能验收完成（性能、兼容）</li><li class="">非功能验收完成（单测、文档）<br></li><li class="">环境验收（Core版本验收）<br></li><li class="">PO验收完成、UI验收完成<br></li></ul><h4>平台更新版本：</h4><blockquote><p><br></p></blockquote>'
        }, {
            label: '代码迁移',
            template: '<h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>迁移分支<span data-mce-bogus="1" data-mce-type="format-caret"><span style="background-color: rgb(255, 204, 0);" data-mce-style="background-color: #ffcc00;"></span></span>&nbsp;</h4><blockquote><br></blockquote><h4><span style="color: rgb(255, 59, 48);" data-mce-style="color: #ff3b30;">*</span>变更集</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote><h4>修复版本</h4><blockquote><p><br data-mce-bogus="1"></p></blockquote>'
        }
    ];

    var setCommentContent = function (template) {
        var commentEditor = document.querySelector('.detail-comment-editor .comment-editor.tapd-editor');
        if(commentEditor && commentEditor.__vue__) {
            return commentEditor.__vue__.setValue(template);
        }
        var tdialog = document.getElementById('tdialog');
        if (!tdialog) return;
        var iframes = tdialog.getElementsByTagName('iframe');
        if (iframes.length === 0) return;
        var tdialogIframe = iframes[0];
        var contentIframes = tdialogIframe.contentWindow.document.body.getElementsByTagName('iframe');
        if (contentIframes.length > 0) {
            var contentIframe = contentIframes[0];
            contentIframe.contentWindow.document.body.setAttribute('data-mce-placeholder', '');
            contentIframe.contentWindow.document.body.setAttribute('aria-placeholder', '');
            contentIframe.contentWindow.document.body.innerHTML = template;
        } else {
            setTimeout(function(){
                setCommentContent(template);
            }, 500);
        }
    };

    var timer = setInterval(() => {
        var wrapper = document.querySelector('.entity-detail-comments .entity-detail-comments-top-wrapper');
        if (wrapper) {
           clearInterval(timer)
           init(wrapper)
        }
    }, 500)
    var init = function(wrapper) {
      commentType.forEach(function(type, index) {
            var button = document.createElement('button');
                button.className = 'agi-button agi-button--plain agi-button--level-primary agi-button--size-mini ';
                button.style.padding = '6px 10px';
                button.style.marginRight = '12px';
                if(index === 0) { button.style.marginLeft = '30px' }
                button.textContent = type.label;
                button.addEventListener('click', function() {
                    var addComment = wrapper.querySelector('.add-comments > i');
                    if (addComment) {
                        addComment.click();
                    }
                    if (type.template) {
                        setTimeout(function(){
                            setCommentContent(type.template);
                        }, 500);
                    }
                });
                wrapper.parentNode.insertBefore(button, wrapper);
        });
    }
})();