// ==UserScript==
// @name         金山文档增加查看原图按钮
// @namespace    http://tampermonkey.net/
// @version      2025.8.13
// @description  在思维导图预览图片时增加查看原图按钮
// @author       AN drew
// @match        https://wps.processon.com/diagrams/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492771/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E5%A2%9E%E5%8A%A0%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492771/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E5%A2%9E%E5%8A%A0%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
.CodeMirror-wrap{
    font-size:18px;
}
.CodeMirror-wrap .highlight{
    background:#ffe50087;
}
.CodeMirror-wrap .highlight2{
    background:#3eff0b63;
}
    `);

    if(window.location.href.indexOf('wps.processon.com') > -1)
    {
        let t1=setInterval(function(){
            if($('#img-preview .bottom-tool').length>0)
            {
                if($('#img-preview .tool-item.orgin').length==0)
                {
                    let url=$('#img-preview .current-image').attr('src');
                    $('#img-preview .bottom-tool').append('<div class="tool-item orgin" tit="origin" title-pos="top" original-title="原图"><a href="'+url+'" target="_blank"><span style="color:white">查看原图</span></a></div>')
                }
                else
                {
                    if($('#img-preview .current-image').attr('src')!=$('#img-preview .tool-item.orgin a').attr('href'))
                    {
                        $('#img-preview .tool-item.orgin a').attr('href', $('#img-preview .current-image').attr('src'))
                    }
                }
            }
        },1000);

        /*
        let t2=setInterval(function(){
            $('.CodeMirror-line').each(function(){
                let codespan=$(this).find('span[role="presentation"]');
                let len=codespan.length;
                let text=codespan.text();
                let html=codespan.html();

                if(text.includes('j*j<=i') && !html.includes('<span class="cm-variable highlight">j</span>'))
                {
                    html=html.replace('<span class="cm-variable">j</span><span class="cm-operator">*</span><span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">i</span>',
                                      '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">j</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">i</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('j<=i') && !html.includes('<span class="cm-variable highlight2">j</span>'))
                {
                    html=html.replace('<span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">i</span>',
                                      '<span class="cm-variable highlight2">j</span><span class="cm-operator highlight2">&lt;=</span><span class="cm-variable highlight2">i</span>'
                                     )
                    codespan.html(html);
                }


                if(text.includes('k*k<=j') && !html.includes('<span class="cm-variable highlight">k</span>'))
                {
                    html=html.replace('<span class="cm-variable">k</span><span class="cm-operator">*</span><span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">j</span>',
                                      '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">k</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">j</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('k<=j') && !html.includes('<span class="cm-variable highlight2">k</span>'))
                {
                    html=html.replace('<span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">j</span>',
                                      '<span class="cm-variable highlight2">k</span><span class="cm-operator highlight2">&lt;=</span><span class="cm-variable highlight2">j</span>'
                                     )
                    codespan.html(html);
                }


                if(text.includes('i*i<=n') && !html.includes('<span class="cm-variable highlight">i</span>'))
                {
                    html=html.replace('<span class="cm-variable">i</span><span class="cm-operator">*</span><span class="cm-variable">i</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                                      '<span class="cm-variable highlight">i</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">i</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('j*j<=n') && !html.includes('<span class="cm-variable highlight">j</span>'))
                {
                    html=html.replace('<span class="cm-variable">j</span><span class="cm-operator">*</span><span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                                      '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">j</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('k*k<=n') && !html.includes('<span class="cm-variable highlight">k</span>'))
                {
                    html=html.replace('<span class="cm-variable">k</span><span class="cm-operator">*</span><span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                                      '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">k</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                                     )
                    codespan.html(html);
                }


                if(text.includes('i*=2') && !html.includes('<span class="cm-variable highlight">i</span>'))
                {
                    html=html.replace('<span class="cm-variable">i</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                                      '<span class="cm-variable highlight">i</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('j*=2') && !html.includes('<span class="cm-variable highlight">j</span>'))
                {
                    html=html.replace('<span class="cm-variable">j</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                                      '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                                     )
                    codespan.html(html);
                }
                else if(text.includes('k*=2') && !html.includes('<span class="cm-variable highlight">k</span>'))
                {
                    html=html.replace('<span class="cm-variable">k</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                                      '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                                     )
                    codespan.html(html);
                }

            })
        },1000);
*/



        const ruleGroups = [
            // 第一个分支：处理j和i的关系
            [
                {
                    test: 'j*j<=i',
                    original: '<span class="cm-variable">j</span><span class="cm-operator">*</span><span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">i</span>',
                    replace: '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">j</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">i</span>'
                },
                {
                    test: 'j<=i',
                    original: '<span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">i</span>',
                    replace: '<span class="cm-variable highlight2">j</span><span class="cm-operator highlight2">&lt;=</span><span class="cm-variable highlight2">i</span>'
                }
            ],
            // 第二个分支：处理k和j的关系
            [
                {
                    test: 'k*k<=j',
                    original: '<span class="cm-variable">k</span><span class="cm-operator">*</span><span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">j</span>',
                    replace: '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">k</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">j</span>'
                },
                {
                    test: 'k<=j',
                    original: '<span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">j</span>',
                    replace: '<span class="cm-variable highlight2">k</span><span class="cm-operator highlight2">&lt;=</span><span class="cm-variable highlight2">j</span>'
                }
            ],
            // 第三个分支：处理平方和n的关系
            [
                {
                    test: 'i*i<=n',
                    original: '<span class="cm-variable">i</span><span class="cm-operator">*</span><span class="cm-variable">i</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                    replace: '<span class="cm-variable highlight">i</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">i</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                },
                {
                    test: 'j*j<=n',
                    original: '<span class="cm-variable">j</span><span class="cm-operator">*</span><span class="cm-variable">j</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                    replace: '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">j</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                },
                {
                    test: 'k*k<=n',
                    original: '<span class="cm-variable">k</span><span class="cm-operator">*</span><span class="cm-variable">k</span><span class="cm-operator">&lt;=</span><span class="cm-variable">n</span>',
                    replace: '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*</span><span class="cm-variable highlight">k</span><span class="cm-operator highlight">&lt;=</span><span class="cm-variable highlight">n</span>'
                }
            ],
            // 第四个分支：处理乘等操作
            [
                {
                    test: 'i*=2',
                    original: '<span class="cm-variable">i</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                    replace: '<span class="cm-variable highlight">i</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                },
                {
                    test: 'j*=2',
                    original: '<span class="cm-variable">j</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                    replace: '<span class="cm-variable highlight">j</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                },
                {
                    test: 'k*=2',
                    original: '<span class="cm-variable">k</span><span class="cm-operator">*=</span><span class="cm-number">2</span>',
                    replace: '<span class="cm-variable highlight">k</span><span class="cm-operator highlight">*=</span><span class="cm-number highlight">2</span>'
                }
            ]
        ];

        // 兼容旧浏览器的 requestAnimationFrame
        (function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                    window[vendors[x] + 'CancelAnimationFrame'] ||
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        }());

        // 辅助函数：转义正则特殊字符
        function escapeRegExp(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // 预处理规则：编译正则表达式
        var compiledRules = [];
        for (var g = 0; g < ruleGroups.length; g++) {
            var group = ruleGroups[g];
            var compiledGroup = [];
            for (var r = 0; r < group.length; r++) {
                var rule = group[r];
                compiledGroup.push({
                    test: rule.test,
                    original: rule.original,
                    replace: rule.replace,
                    regex: new RegExp(escapeRegExp(rule.test)),
                    htmlRegex: new RegExp(escapeRegExp(rule.original))
                });
            }
            compiledRules.push(compiledGroup);
        }

        var highlightTimeout;
        function highlightCode() {
            cancelAnimationFrame(highlightTimeout);
            highlightTimeout = requestAnimationFrame(function() {
                var lines = document.querySelectorAll('.CodeMirror-line');
                for (var i = 0; i < lines.length; i++) {
                    processLine(lines[i]);
                }
            });
        }

        function processLine(lineElement) {
            var codespan = lineElement.querySelector('span[role="presentation"]');
            if (!codespan) return;

            var text = codespan.textContent || codespan.innerText;
            if (!text) return; // 跳过空行

            var html = codespan.innerHTML;
            var changed = false;
            var lastHtml = html; // 用于跟踪每次替换后的HTML

            // 遍历所有规则组，不再在组匹配后跳出循环
            for (var g = 0; g < compiledRules.length; g++) {
                var group = compiledRules[g];
                var groupMatched = false;

                // 检查当前组是否有规则匹配
                for (var r = 0; r < group.length; r++) {
                    var rule = group[r];
                    if (rule.regex.test(text)) {
                        groupMatched = true;
                        break; // 组内匹配一个规则即可
                    }
                }

                // 如果组匹配，应用组内所有规则
                if (groupMatched) {
                    for (let r = 0; r < group.length; r++) {
                        let rule = group[r];
                        let newHtml = lastHtml.replace(rule.htmlRegex, rule.replace);
                        if (newHtml !== lastHtml) {
                            lastHtml = newHtml;
                            changed = true;
                        }
                    }
                }
            }

            if (changed) {
                codespan.innerHTML = lastHtml;
            }
        }

        // 主初始化函数
        function initHighlighting() {
            // 清理原定时器
            if (window.t2) {
                clearInterval(t2);
                delete window.t2;
            }

            // 查找 CodeMirror 容器
            var codeMirrorContainer = document.querySelector('.CodeMirror');

            if (!codeMirrorContainer) {
                // 尝试其他常见选择器
                codeMirrorContainer = document.querySelector('.CodeMirror-scroll') ||
                    document.querySelector('.CodeMirror-sizer') ||
                    document.querySelector('.cm-editor');

                // 如果还是没找到，打印警告并回退
                if (!codeMirrorContainer) {
                    console.warn('CodeMirror container not found, using document.body as fallback');
                    codeMirrorContainer = document.body;
                }
            }

            // 初始执行一次
            highlightCode();

            // 设置监听
            if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function() {
                    highlightCode();
                });

                try {
                    observer.observe(codeMirrorContainer, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    console.log('MutationObserver initialized');
                } catch (e) {
                    console.error('MutationObserver failed:', e);
                    // 回退到定时器
                    setInterval(highlightCode, 30000);
                }
            } else {
                // 如果不支持MutationObserver，回退到定时器
                console.error('MutationObserver unsupportable');
                setInterval(highlightCode, 30000);
            }
        }

        // 确保在DOM完全加载后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHighlighting);
        } else {
            // 如果文档已经加载完成，直接初始化
            initHighlighting();
        }


        /*
        let t2 = setInterval(function() {
            $('.CodeMirror-line').each(function() {
                let codespan = $(this).find('span[role="presentation"]');
                let text = codespan.text();
                let html = codespan.html();
                let newhtml=html;
                // 遍历每个规则组
                for (let group of ruleGroups) {
                    let matched = false;
                    for (let rule of group) {
                        if (text.includes(rule.test)) {
                            // 进行替换
                            newhtml = newhtml.replace(rule.original, rule.replace);
                            matched = true;
                            break; // 跳出当前组内的循环，继续下一个组
                        }
                    }
                    // 如果这个组匹配了一个规则，继续下一个组（即使没有匹配也会继续）
                    // 注意：每个组都要检查，所以这里不需要因为匹配而跳出整个组循环
                }
                if(newhtml != html)
                {
                    codespan.html(newhtml);
                }
            });
        }, 30000);
*/

    }
})();