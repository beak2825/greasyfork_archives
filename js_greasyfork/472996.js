// ==UserScript==
// @name         下载CSDN、简书、掘金、博客园、微信公众号、知乎专栏、脚本之家、51CTO、程序员大本营、吾爱破解、B站、思否、轻识、腾讯云、阿里云、华为云等文章保存为Word/Markdown文件
// @namespace    https://waahah.xyz/
// @version      0.2.11
// @description  下载保存博客文章为markdown/word,已支持CSDN、简书、掘金、知乎专栏、博客园、微信公众号、脚本之家、51CTO、程序员大本营、吾爱破解、腾讯云、阿里云、华为云、B站专栏、思否、轻识、百家号、百度经验、360个人图书馆、码农教程等，脚本仅限学习，请大家尊重版权。
// @author       waahah
// @require      https://unpkg.com/html-docx-js/dist/html-docx.js
// @match        *://blog.csdn.net/*
// @match        *://*.blog.csdn.net/*
// @match        *://www.jianshu.com/p/*
// @match        *://juejin.cn/post/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.cnblogs.com/*/p/*
// @match        *://www.cnblogs.com/*/archive/*
// @match        *://www.jb51.net/article/*
// @match        *://blog.51cto.com/u_*
// @match        *://www.pianshen.com/article/*
// @match        *://www.360doc.com/content/*
// @match        *://baijiahao.baidu.com/s?id=*
// @match        *://jingyan.baidu.com/article/*
// @match        *://www.52pojie.cn/thread-*
// @match        *://cloud.tencent.com/developer/article/*
// @match        *://developer.aliyun.com/article/*
// @match        *://huaweicloud.csdn.net/*
// @match        *://www.bilibili.com/read/*
// @match        *://weibo.com/ttarticle/p/show*
// @match        *://www.weibo.com/ttarticle/p/show*
// @match        *://mp.weixin.qq.com/s*
// @match        *://segmentfault.com/*/*
// @match        *://www.qinglite.cn/doc/*
// @match        *://www.manongjc.com/detail*
// @license      Apache-2.0
// @icon         data:image/svg+xml,%3Csvg t='1691941995383' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1514' width='200' height='200'%3E%3Cpath d='M320 864 320 0l480 0 0 192 0 32L1024 224l0 640L320 864zM928 320l-512 0 0 32 512 0L928 320zM928 448l-512 0 0 32 512 0L928 448zM928 576l-512 0 0 32 512 0L928 576zM928 704l-512 0 0 32 512 0L928 704zM832 0l19.2 0L1024 160 1024 192l-192 0L832 0zM288 896l320 0L704 896l0 128L0 1024 0 160l288 0 0 320-192 0L96 512l192 0 0 96-192 0L96 640l192 0 0 96-192 0L96 768l192 0 0 96-192 0L96 896 288 896z' p-id='1515'%3E%3C/path%3E%3C/svg%3E
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/472996/%E4%B8%8B%E8%BD%BDCSDN%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E3%80%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E3%80%81%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E3%80%81%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E3%80%8151CTO%E3%80%81%E7%A8%8B%E5%BA%8F%E5%91%98%E5%A4%A7%E6%9C%AC%E8%90%A5%E3%80%81%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E3%80%81B%E7%AB%99%E3%80%81%E6%80%9D%E5%90%A6%E3%80%81%E8%BD%BB%E8%AF%86%E3%80%81%E8%85%BE%E8%AE%AF%E4%BA%91%E3%80%81%E9%98%BF%E9%87%8C%E4%BA%91%E3%80%81%E5%8D%8E%E4%B8%BA%E4%BA%91%E7%AD%89%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAWordMarkdown%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/472996/%E4%B8%8B%E8%BD%BDCSDN%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E3%80%81%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E3%80%81%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E3%80%81%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E3%80%8151CTO%E3%80%81%E7%A8%8B%E5%BA%8F%E5%91%98%E5%A4%A7%E6%9C%AC%E8%90%A5%E3%80%81%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E3%80%81B%E7%AB%99%E3%80%81%E6%80%9D%E5%90%A6%E3%80%81%E8%BD%BB%E8%AF%86%E3%80%81%E8%85%BE%E8%AE%AF%E4%BA%91%E3%80%81%E9%98%BF%E9%87%8C%E4%BA%91%E3%80%81%E5%8D%8E%E4%B8%BA%E4%BA%91%E7%AD%89%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAWordMarkdown%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==
 
//修复支持表格、代码高亮、删除线、任务列表、checkbox任务
var turndownPluginGfm = (function (exports) {
    'use strict';
 
    var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;
 
    function highlightedCodeBlock(turndownService) {
        turndownService.addRule('highlightedCodeBlock', {
            filter: function (node) {
                var firstChild = node.firstChild;
                return (
                    node.nodeName === 'DIV' &&
                    highlightRegExp.test(node.className) &&
                    firstChild &&
                    firstChild.nodeName === 'PRE'
                )
            },
            replacement: function (content, node, options) {
                var className = node.className || '';
                var language = (className.match(highlightRegExp) || [null, ''])[1];
 
                return (
                    '\n\n' + options.fence + language + '\n' +
                    node.firstChild.textContent +
                    '\n' + options.fence + '\n\n'
                )
            }
        });
    }
 
    function strikethrough(turndownService) {
        turndownService.addRule('strikethrough', {
            filter: ['del', 's', 'strike'],
            replacement: function (content) {
                return '~' + content + '~'
            }
        });
    }
 
    var indexOf = Array.prototype.indexOf;
    var every = Array.prototype.every;
    var rules = {};
 
    rules.tableCell = {
        filter: ['th', 'td'],
        replacement: function (content, node) {
            return cell(content, node)
        }
    };
 
    rules.tableRow = {
        filter: 'tr',
        replacement: function (content, node) {
            var borderCells = '';
            var alignMap = { left: ':--', right: '--:', center: ':-:' };
 
            if (isHeadingRow(node)) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var border = '---';
                    var align = (
                        node.childNodes[i].getAttribute('align') || ''
                    ).toLowerCase();
 
                    if (align) border = alignMap[align] || border;
 
                    borderCells += cell(border, node.childNodes[i]);
                }
            }
            return '\n' + content + (borderCells ? '\n' + borderCells : '')
        }
    };
 
    rules.table = {
        // Only convert tables with a heading row.
        // Tables with no heading row are kept using `keep` (see below).
        filter: function (node) {
            return node.nodeName === 'TABLE' && isHeadingRow(node.rows[0])
        },
 
        replacement: function (content) {
            // Ensure there are no blank lines
            content = content.replace('\n\n', '\n');
            return '\n\n' + content + '\n\n'
        }
    };
 
    rules.tableSection = {
        filter: ['thead', 'tbody', 'tfoot'],
        replacement: function (content) {
            return content
        }
    };
 
    // A tr is a heading row if:
    // - the parent is a THEAD
    // - or if its the first child of the TABLE or the first TBODY (possibly
    //   following a blank THEAD)
    // - and every cell is a TH
    function isHeadingRow(tr) {
        var parentNode = tr.parentNode;
        return (
            parentNode.nodeName === 'THEAD' ||
            (
                parentNode.firstChild === tr &&
                (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
                every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
            )
        )
    }
 
    function isFirstTbody(element) {
        var previousSibling = element.previousSibling;
        return (
            element.nodeName === 'TBODY' && (
                !previousSibling ||
                (
                    previousSibling.nodeName === 'THEAD' &&
                    /^\s*$/i.test(previousSibling.textContent)
                )
            )
        )
    }
 
    function cell(content, node) {
        var index = indexOf.call(node.parentNode.childNodes, node);
        var prefix = ' ';
        if (index === 0) prefix = '| ';
        return prefix + content + ' |'
    }
 
    function tables(turndownService) {
        turndownService.keep(function (node) {
            return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0])
        });
        for (var key in rules) turndownService.addRule(key, rules[key]);
    }
 
    function taskListItems(turndownService) {
        turndownService.addRule('taskListItems', {
            filter: function (node) {
                return node.type === 'checkbox' && node.parentNode.nodeName === 'LI'
            },
            replacement: function (content, node) {
                return (node.checked ? '[x]' : '[ ]') + ' '
            }
        });
    }
 
    function gfm(turndownService) {
        turndownService.use([
            highlightedCodeBlock,
            strikethrough,
            tables,
            taskListItems
        ]);
    }
 
    exports.gfm = gfm;
    exports.highlightedCodeBlock = highlightedCodeBlock;
    exports.strikethrough = strikethrough;
    exports.tables = tables;
    exports.taskListItems = taskListItems;
 
    return exports;
 
}({}));
 
 
var TurndownService = (function () {
    'use strict';
 
    function extend(destination) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (source.hasOwnProperty(key)) destination[key] = source[key];
            }
        }
        return destination
    }
 
    function repeat(character, count) {
        return Array(count + 1).join(character)
    }
 
    function trimLeadingNewlines(string) {
        return string.replace(/^\n*/, '')
    }
 
    function trimTrailingNewlines(string) {
        // avoid match-at-end regexp bottleneck, see #370
        var indexEnd = string.length;
        while (indexEnd > 0 && string[indexEnd - 1] === '\n') indexEnd--;
        return string.substring(0, indexEnd)
    }
 
    var blockElements = [
        'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
        'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
        'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
        'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
        'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
        'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
    ];
 
    function isBlock(node) {
        return is(node, blockElements)
    }
 
    var voidElements = [
        'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
        'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
    ];
 
    function isVoid(node) {
        return is(node, voidElements)
    }
 
    function hasVoid(node) {
        return has(node, voidElements)
    }
 
    var meaningfulWhenBlankElements = [
        'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
        'AUDIO', 'VIDEO'
    ];
 
    function isMeaningfulWhenBlank(node) {
        return is(node, meaningfulWhenBlankElements)
    }
 
    function hasMeaningfulWhenBlank(node) {
        return has(node, meaningfulWhenBlankElements)
    }
 
    function is(node, tagNames) {
        return tagNames.indexOf(node.nodeName) >= 0
    }
 
    function has(node, tagNames) {
        return (
            node.getElementsByTagName &&
            tagNames.some(function (tagName) {
                return node.getElementsByTagName(tagName).length
            })
        )
    }
 
    var rules = {};
 
    rules.paragraph = {
        filter: 'p',
 
        replacement: function (content) {
            return '\n\n' + content + '\n\n'
        }
    };
 
    rules.lineBreak = {
        filter: 'br',
 
        replacement: function (content, node, options) {
            return options.br + '\n'
        }
    };
 
    rules.heading = {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
 
        replacement: function (content, node, options) {
            var hLevel = Number(node.nodeName.charAt(1));
 
            if (options.headingStyle === 'setext' && hLevel < 3) {
                var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
                return (
                    '\n\n' + content + '\n' + underline + '\n\n'
                )
            } else {
                return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
            }
        }
    };
 
    rules.blockquote = {
        filter: 'blockquote',
 
        replacement: function (content) {
            content = content.replace(/^\n+|\n+$/g, '');
            content = content.replace(/^/gm, '> ');
            return '\n\n' + content + '\n\n'
        }
    };
 
    rules.list = {
        filter: ['ul', 'ol'],
 
        replacement: function (content, node) {
            var parent = node.parentNode;
            if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
                return '\n' + content
            } else {
                return '\n\n' + content + '\n\n'
            }
        }
    };
 
    rules.listItem = {
        filter: 'li',
 
        replacement: function (content, node, options) {
            content = content
                .replace(/^\n+/, '') // remove leading newlines
                .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
                .replace(/\n/gm, '\n    '); // indent
            var prefix = options.bulletListMarker + '   ';
            var parent = node.parentNode;
            if (parent.nodeName === 'OL') {
                var start = parent.getAttribute('start');
                var index = Array.prototype.indexOf.call(parent.children, node);
                prefix = (start ? Number(start) + index : index + 1) + '.  ';
            }
            return (
                prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
            )
        }
    };
 
    rules.indentedCodeBlock = {
        filter: function (node, options) {
            return (
                options.codeBlockStyle === 'indented' &&
                node.nodeName === 'PRE' &&
                node.firstChild &&
                node.firstChild.nodeName === 'CODE'
            )
        },
 
        replacement: function (content, node, options) {
            return (
                '\n\n    ' +
                node.firstChild.textContent.replace(/\n/g, '\n    ') +
                '\n\n'
            )
        }
    };
 
    rules.fencedCodeBlock = {
        filter: function (node, options) {
            return (
                options.codeBlockStyle === 'fenced' &&
                node.nodeName === 'PRE' &&
                node.firstChild &&
                node.firstChild.nodeName === 'CODE'
            )
        },
 
        replacement: function (content, node, options) {
            var className = node.firstChild.getAttribute('class') || '';
            var language = (className.match(/language-(\S+)/) || [null, ''])[1];
            var code = node.firstChild.textContent;
 
            var fenceChar = options.fence.charAt(0);
            var fenceSize = 3;
            var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');
 
            var match;
            while ((match = fenceInCodeRegex.exec(code))) {
                if (match[0].length >= fenceSize) {
                    fenceSize = match[0].length + 1;
                }
            }
 
            var fence = repeat(fenceChar, fenceSize);
 
            return (
                '\n\n' + fence + language + '\n' +
                code.replace(/\n$/, '') +
                '\n' + fence + '\n\n'
            )
        }
    };
 
    rules.horizontalRule = {
        filter: 'hr',
 
        replacement: function (content, node, options) {
            return '\n\n' + options.hr + '\n\n'
        }
    };
 
    rules.inlineLink = {
        filter: function (node, options) {
            return (
                options.linkStyle === 'inlined' &&
                node.nodeName === 'A' &&
                node.getAttribute('href')
            )
        },
 
        replacement: function (content, node) {
            var href = node.getAttribute('href');
            var title = cleanAttribute(node.getAttribute('title'));
            if (title) title = ' "' + title + '"';
            return '[' + content + '](' + href + title + ')'
        }
    };
 
    rules.referenceLink = {
        filter: function (node, options) {
            return (
                options.linkStyle === 'referenced' &&
                node.nodeName === 'A' &&
                node.getAttribute('href')
            )
        },
 
        replacement: function (content, node, options) {
            var href = node.getAttribute('href');
            var title = cleanAttribute(node.getAttribute('title'));
            if (title) title = ' "' + title + '"';
            var replacement;
            var reference;
 
            switch (options.linkReferenceStyle) {
                case 'collapsed':
                    replacement = '[' + content + '][]';
                    reference = '[' + content + ']: ' + href + title;
                    break
                case 'shortcut':
                    replacement = '[' + content + ']';
                    reference = '[' + content + ']: ' + href + title;
                    break
                default:
                    var id = this.references.length + 1;
                    replacement = '[' + content + '][' + id + ']';
                    reference = '[' + id + ']: ' + href + title;
            }
 
            this.references.push(reference);
            return replacement
        },
 
        references: [],
 
        append: function (options) {
            var references = '';
            if (this.references.length) {
                references = '\n\n' + this.references.join('\n') + '\n\n';
                this.references = []; // Reset references
            }
            return references
        }
    };
 
    rules.emphasis = {
        filter: ['em', 'i'],
 
        replacement: function (content, node, options) {
            if (!content.trim()) return ''
            return options.emDelimiter + content + options.emDelimiter
        }
    };
 
    rules.strong = {
        filter: ['strong', 'b'],
 
        replacement: function (content, node, options) {
            if (!content.trim()) return ''
            return options.strongDelimiter + content + options.strongDelimiter
        }
    };
 
    rules.code = {
        filter: function (node) {
            var hasSiblings = node.previousSibling || node.nextSibling;
            var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;
 
            return node.nodeName === 'CODE' && !isCodeBlock
        },
 
        replacement: function (content) {
            if (!content) return ''
            content = content.replace(/\r?\n|\r/g, ' ');
 
            var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? ' ' : '';
            var delimiter = '`';
            var matches = content.match(/`+/gm) || [];
            while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';
 
            return delimiter + extraSpace + content + extraSpace + delimiter
        }
    };
 
    rules.image = {
        filter: 'img',
 
        replacement: function (content, node) {
            var alt = cleanAttribute(node.getAttribute('alt'));
            var src = node.getAttribute('src') || '';
            var title = cleanAttribute(node.getAttribute('title'));
            var titlePart = title ? ' "' + title + '"' : '';
            return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
        }
    };
 
    function cleanAttribute(attribute) {
        return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
    }
 
    /**
     * Manages a collection of rules used to convert HTML to Markdown
     */
 
    function Rules(options) {
        this.options = options;
        this._keep = [];
        this._remove = [];
 
        this.blankRule = {
            replacement: options.blankReplacement
        };
 
        this.keepReplacement = options.keepReplacement;
 
        this.defaultRule = {
            replacement: options.defaultReplacement
        };
 
        this.array = [];
        for (var key in options.rules) this.array.push(options.rules[key]);
    }
 
    Rules.prototype = {
        add: function (key, rule) {
            this.array.unshift(rule);
        },
 
        keep: function (filter) {
            this._keep.unshift({
                filter: filter,
                replacement: this.keepReplacement
            });
        },
 
        remove: function (filter) {
            this._remove.unshift({
                filter: filter,
                replacement: function () {
                    return ''
                }
            });
        },
 
        forNode: function (node) {
            if (node.isBlank) return this.blankRule
            var rule;
 
            if ((rule = findRule(this.array, node, this.options))) return rule
            if ((rule = findRule(this._keep, node, this.options))) return rule
            if ((rule = findRule(this._remove, node, this.options))) return rule
 
            return this.defaultRule
        },
 
        forEach: function (fn) {
            for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
        }
    };
 
    function findRule(rules, node, options) {
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (filterValue(rule, node, options)) return rule
        }
        return void 0
    }
 
    function filterValue(rule, node, options) {
        var filter = rule.filter;
        if (typeof filter === 'string') {
            if (filter === node.nodeName.toLowerCase()) return true
        } else if (Array.isArray(filter)) {
            if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
        } else if (typeof filter === 'function') {
            if (filter.call(rule, node, options)) return true
        } else {
            throw new TypeError('`filter` needs to be a string, array, or function')
        }
    }
 
    /**
     * The collapseWhitespace function is adapted from collapse-whitespace
     * by Luc Thevenard.
     *
     * The MIT License (MIT)
     *
     * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
 
    /**
     * collapseWhitespace(options) removes extraneous whitespace from an the given element.
     *
     * @param {Object} options
     */
    function collapseWhitespace(options) {
        var element = options.element;
        var isBlock = options.isBlock;
        var isVoid = options.isVoid;
        var isPre = options.isPre || function (node) {
            return node.nodeName === 'PRE'
        };
 
        if (!element.firstChild || isPre(element)) return
 
        var prevText = null;
        var keepLeadingWs = false;
 
        var prev = null;
        var node = next(prev, element, isPre);
 
        while (node !== element) {
            if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
                var text = node.data.replace(/[ \r\n\t]+/g, ' ');
 
                if ((!prevText || / $/.test(prevText.data)) &&
                    !keepLeadingWs && text[0] === ' ') {
                    text = text.substr(1);
                }
 
                // `text` might be empty at this point.
                if (!text) {
                    node = remove(node);
                    continue
                }
 
                node.data = text;
 
                prevText = node;
            } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
                if (isBlock(node) || node.nodeName === 'BR') {
                    if (prevText) {
                        prevText.data = prevText.data.replace(/ $/, '');
                    }
 
                    prevText = null;
                    keepLeadingWs = false;
                } else if (isVoid(node) || isPre(node)) {
                    // Avoid trimming space around non-block, non-BR void elements and inline PRE.
                    prevText = null;
                    keepLeadingWs = true;
                } else if (prevText) {
                    // Drop protection if set previously.
                    keepLeadingWs = false;
                }
            } else {
                node = remove(node);
                continue
            }
 
            var nextNode = next(prev, node, isPre);
            prev = node;
            node = nextNode;
        }
 
        if (prevText) {
            prevText.data = prevText.data.replace(/ $/, '');
            if (!prevText.data) {
                remove(prevText);
            }
        }
    }
 
    /**
     * remove(node) removes the given node from the DOM and returns the
     * next node in the sequence.
     *
     * @param {Node} node
     * @return {Node} node
     */
    function remove(node) {
        var next = node.nextSibling || node.parentNode;
 
        node.parentNode.removeChild(node);
 
        return next
    }
 
    /**
     * next(prev, current, isPre) returns the next node in the sequence, given the
     * current and previous nodes.
     *
     * @param {Node} prev
     * @param {Node} current
     * @param {Function} isPre
     * @return {Node}
     */
    function next(prev, current, isPre) {
        if ((prev && prev.parentNode === current) || isPre(current)) {
            return current.nextSibling || current.parentNode
        }
 
        return current.firstChild || current.nextSibling || current.parentNode
    }
 
    /*
     * Set up window for Node.js
     */
 
    var root = (typeof window !== 'undefined' ? window : {});
 
    /*
     * Parsing HTML strings
     */
 
    function canParseHTMLNatively() {
        var Parser = root.DOMParser;
        var canParse = false;
 
        // Adapted from https://gist.github.com/1129031
        // Firefox/Opera/IE throw errors on unsupported types
        try {
            // WebKit returns null on unsupported types
            if (new Parser().parseFromString('', 'text/html')) {
                canParse = true;
            }
        } catch (e) { }
 
        return canParse
    }
 
    function createHTMLParser() {
        var Parser = function () { };
 
        {
            if (shouldUseActiveX()) {
                Parser.prototype.parseFromString = function (string) {
                    var doc = new window.ActiveXObject('htmlfile');
                    doc.designMode = 'on'; // disable on-page scripts
                    doc.open();
                    doc.write(string);
                    doc.close();
                    return doc
                };
            } else {
                Parser.prototype.parseFromString = function (string) {
                    var doc = document.implementation.createHTMLDocument('');
                    doc.open();
                    doc.write(string);
                    doc.close();
                    return doc
                };
            }
        }
        return Parser
    }
 
    function shouldUseActiveX() {
        var useActiveX = false;
        try {
            document.implementation.createHTMLDocument('').open();
        } catch (e) {
            if (window.ActiveXObject) useActiveX = true;
        }
        return useActiveX
    }
 
    var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
 
    function RootNode(input, options) {
        var root;
        if (typeof input === 'string') {
            var doc = htmlParser().parseFromString(
                // DOM parsers arrange elements in the <head> and <body>.
                // Wrapping in a custom element ensures elements are reliably arranged in
                // a single element.
                '<x-turndown id="turndown-root">' + input + '</x-turndown>',
                'text/html'
            );
            root = doc.getElementById('turndown-root');
        } else {
            root = input.cloneNode(true);
        }
        collapseWhitespace({
            element: root,
            isBlock: isBlock,
            isVoid: isVoid,
            isPre: options.preformattedCode ? isPreOrCode : null
        });
 
        return root
    }
 
    var _htmlParser;
    function htmlParser() {
        _htmlParser = _htmlParser || new HTMLParser();
        return _htmlParser
    }
 
    function isPreOrCode(node) {
        return node.nodeName === 'PRE' || node.nodeName === 'CODE'
    }
 
    function Node(node, options) {
        node.isBlock = isBlock(node);
        node.isCode = node.nodeName === 'CODE' || node.parentNode.isCode;
        node.isBlank = isBlank(node);
        node.flankingWhitespace = flankingWhitespace(node, options);
        return node
    }
 
    function isBlank(node) {
        return (
            !isVoid(node) &&
            !isMeaningfulWhenBlank(node) &&
            /^\s*$/i.test(node.textContent) &&
            !hasVoid(node) &&
            !hasMeaningfulWhenBlank(node)
        )
    }
 
    function flankingWhitespace(node, options) {
        if (node.isBlock || (options.preformattedCode && node.isCode)) {
            return { leading: '', trailing: '' }
        }
 
        var edges = edgeWhitespace(node.textContent);
 
        // abandon leading ASCII WS if left-flanked by ASCII WS
        if (edges.leadingAscii && isFlankedByWhitespace('left', node, options)) {
            edges.leading = edges.leadingNonAscii;
        }
 
        // abandon trailing ASCII WS if right-flanked by ASCII WS
        if (edges.trailingAscii && isFlankedByWhitespace('right', node, options)) {
            edges.trailing = edges.trailingNonAscii;
        }
 
        return { leading: edges.leading, trailing: edges.trailing }
    }
 
    function edgeWhitespace(string) {
        var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
        return {
            leading: m[1], // whole string for whitespace-only strings
            leadingAscii: m[2],
            leadingNonAscii: m[3],
            trailing: m[4], // empty for whitespace-only strings
            trailingNonAscii: m[5],
            trailingAscii: m[6]
        }
    }
 
    function isFlankedByWhitespace(side, node, options) {
        var sibling;
        var regExp;
        var isFlanked;
 
        if (side === 'left') {
            sibling = node.previousSibling;
            regExp = / $/;
        } else {
            sibling = node.nextSibling;
            regExp = /^ /;
        }
 
        if (sibling) {
            if (sibling.nodeType === 3) {
                isFlanked = regExp.test(sibling.nodeValue);
            } else if (options.preformattedCode && sibling.nodeName === 'CODE') {
                isFlanked = false;
            } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
                isFlanked = regExp.test(sibling.textContent);
            }
        }
        return isFlanked
    }
 
    var reduce = Array.prototype.reduce;
    var escapes = [
        [/\\/g, '\\\\'],
        [/\*/g, '\\*'],
        [/^-/g, '\\-'],
        [/^\+ /g, '\\+ '],
        [/^(=+)/g, '\\$1'],
        [/^(#{1,6}) /g, '\\$1 '],
        [/`/g, '\\`'],
        [/^~~~/g, '\\~~~'],
        [/\[/g, '\\['],
        [/\]/g, '\\]'],
        [/^>/g, '\\>'],
        [/_/g, '\\_'],
        [/^(\d+)\. /g, '$1\\. ']
    ];
 
    function TurndownService(options) {
        if (!(this instanceof TurndownService)) return new TurndownService(options)
 
        var defaults = {
            rules: rules,
            headingStyle: 'setext',
            hr: '* * *',
            bulletListMarker: '*',
            codeBlockStyle: 'fenced',
            fence: '```',
            emDelimiter: '_',
            strongDelimiter: '**',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full',
            br: '  ',
            preformattedCode: false,
            blankReplacement: function (content, node) {
                return node.isBlock ? '\n\n' : ''
            },
            keepReplacement: function (content, node) {
                return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
            },
            defaultReplacement: function (content, node) {
                return node.isBlock ? '\n\n' + content + '\n\n' : content
            }
        };
        this.options = extend({}, defaults, options);
        this.rules = new Rules(this.options);
    }
 
    TurndownService.prototype = {
        /**
         * The entry point for converting a string or DOM node to Markdown
         * @public
         * @param {String|HTMLElement} input The string or DOM node to convert
         * @returns A Markdown representation of the input
         * @type String
         */
 
        turndown: function (input) {
            if (!canConvert(input)) {
                throw new TypeError(
                    input + ' is not a string, or an element/document/fragment node.'
                )
            }
 
            if (input === '') return ''
 
            var output = process.call(this, new RootNode(input, this.options));
            return postProcess.call(this, output)
        },
 
        /**
         * Add one or more plugins
         * @public
         * @param {Function|Array} plugin The plugin or array of plugins to add
         * @returns The Turndown instance for chaining
         * @type Object
         */
 
        use: function (plugin) {
            if (Array.isArray(plugin)) {
                for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
            } else if (typeof plugin === 'function') {
                plugin(this);
            } else {
                throw new TypeError('plugin must be a Function or an Array of Functions')
            }
            return this
        },
 
        /**
         * Adds a rule
         * @public
         * @param {String} key The unique key of the rule
         * @param {Object} rule The rule
         * @returns The Turndown instance for chaining
         * @type Object
         */
 
        addRule: function (key, rule) {
            this.rules.add(key, rule);
            return this
        },
 
        /**
         * Keep a node (as HTML) that matches the filter
         * @public
         * @param {String|Array|Function} filter The unique key of the rule
         * @returns The Turndown instance for chaining
         * @type Object
         */
 
        keep: function (filter) {
            this.rules.keep(filter);
            return this
        },
 
        /**
         * Remove a node that matches the filter
         * @public
         * @param {String|Array|Function} filter The unique key of the rule
         * @returns The Turndown instance for chaining
         * @type Object
         */
 
        remove: function (filter) {
            this.rules.remove(filter);
            return this
        },
 
        /**
         * Escapes Markdown syntax
         * @public
         * @param {String} string The string to escape
         * @returns A string with Markdown syntax escaped
         * @type String
         */
 
        escape: function (string) {
            return escapes.reduce(function (accumulator, escape) {
                return accumulator.replace(escape[0], escape[1])
            }, string)
        }
    };
 
    /**
     * Reduces a DOM node down to its Markdown string equivalent
     * @private
     * @param {HTMLElement} parentNode The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */
 
    function process(parentNode) {
        var self = this;
        return reduce.call(parentNode.childNodes, function (output, node) {
            node = new Node(node, self.options);
 
            var replacement = '';
            if (node.nodeType === 3) {
                replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
            } else if (node.nodeType === 1) {
                replacement = replacementForNode.call(self, node);
            }
 
            return join(output, replacement)
        }, '')
    }
 
    /**
     * Appends strings as each rule requires and trims the output
     * @private
     * @param {String} output The conversion output
     * @returns A trimmed version of the ouput
     * @type String
     */
 
    function postProcess(output) {
        var self = this;
        this.rules.forEach(function (rule) {
            if (typeof rule.append === 'function') {
                output = join(output, rule.append(self.options));
            }
        });
 
        return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
    }
 
    /**
     * Converts an element node to its Markdown equivalent
     * @private
     * @param {HTMLElement} node The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */
 
    function replacementForNode(node) {
        var rule = this.rules.forNode(node);
        var content = process.call(this, node);
        var whitespace = node.flankingWhitespace;
        if (whitespace.leading || whitespace.trailing) content = content.trim();
        return (
            whitespace.leading +
            rule.replacement(content, node, this.options) +
            whitespace.trailing
        )
    }
 
    /**
     * Joins replacement to the current output with appropriate number of new lines
     * @private
     * @param {String} output The current conversion output
     * @param {String} replacement The string to append to the output
     * @returns Joined output
     * @type String
     */
 
    function join(output, replacement) {
        var s1 = trimTrailingNewlines(output);
        var s2 = trimLeadingNewlines(replacement);
        var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
        var separator = '\n\n'.substring(0, nls);
 
        return s1 + separator + s2
    }
 
    /**
     * Determines whether an input can be converted
     * @private
     * @param {String|HTMLElement} input Describe this parameter
     * @returns Describe what it returns
     * @type String|Object|Array|Boolean|Number
     */
 
    function canConvert(input) {
        return (
            input != null && (
                typeof input === 'string' ||
                (input.nodeType && (
                    input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
                ))
            )
        )
    }
 
    return TurndownService;
 
}());
 
 
(async function() {
    /**
    * 遵循开源协议,转载请注明出处谢谢
    */
 
    'use strict';
    const webUrl = window.location.href;
    const headline = document.title;
    const host = location.host;
 
    const InterfaceList = [
        { "host": "blog.csdn.net", "el": "article.baidu_pl", "cut_str": "_" },
        { "host": "www.jianshu.com", "el": "article._2rhmJa", "cut_str": " - " },
        { "host": "juejin.cn", "el": ".article-viewer.markdown-body.result", "cut_str": " - " },
        { "host": "zhuanlan.zhihu.com", "el": ".Post-RichTextContainer", "cut_str": " - " },
        { "host": "www.cnblogs.com", "el": "#cnblogs_post_body", "cut_str": " - " },
        { "host": "www.jb51.net", "el": "#content", "cut_str": "_" },
        { "host": "blog.51cto.com", "el": "#result", "cut_str": "_" },
        { "host": "www.pianshen.com", "el": ".blogpost-body", "cut_str": " - " },
        { "host": "www.360doc.com", "el": "#artContent", "cut_str": "" },
        { "host": "baijiahao.baidu.com", "el": "div[data-testid='article']", "cut_str": "" },
        { "host": "jingyan.baidu.com", "el": ".exp-content-outer", "cut_str": "-" },
        { "host": "www.52pojie.cn", "el": ".t_f", "cut_str": " - " },
        { "host": "cloud.tencent.com", "el": ".mod-content__markdown", "cut_str": "-" },
        { "host": "developer.aliyun.com", "el": ".content-wrapper", "cut_str": "-" },
        { "host": "huaweicloud.csdn.net", "el": ".main-content", "cut_str": "_" },
        { "host": "www.bilibili.com", "el": "#read-article-holder", "cut_str": " - " },
        { "host": "weibo.com", "el": ".main_editor", "cut_str": "" },
        { "host": "www.weibo.com", "el": ".main_editor", "cut_str": "" },
        { "host": "mp.weixin.qq.com", "el": "#js_content", "cut_str": "" },
        { "host": "segmentfault.com", "el": ".article.fmt.article-content", "cut_str": "- SegmentFault 思否" },
        { "host": "www.qinglite.cn", "el": ".markdown-body", "cut_str": "-" },
        { "host": "www.manongjc.com", "el": "#code_example", "cut_str": " - " }
        
    ]
 
    const utils = {
 
        async addMeta () {
            const meta = document.createElement('meta');
            meta.setAttribute('http-equiv', "Content-Security-Policy");
            meta.content = `default-src *; connect-src * ws://* wss://*; style-src * 'unsafe-inline' 'unsafe-eval'; media-src * ; img-src * data:; font-src * ; script-src * 'unsafe-inline' 'unsafe-eval';`;
            const dom = document.head || document.documentElement;
            dom.appendChild(meta);
        },
 
        async css (css) {
            const myStyle = document.createElement('style');
            myStyle.textContent = css;
            const doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        },
    
        async node (node) {
            const myDiv = document.createElement('div');
            myDiv.innerHTML = node;
            const doc = document.body || document.documentElement;
            doc.appendChild(myDiv);
        },
    
        async load_web_script (list) {
            try {
                for (const url of list) {
                    if(!document.querySelector(`script[src="${url}"]`)){
                        const script = document.createElement("script");
                        script.src = url;
                        script.async = false;
                        document.body.append(script);
                    }
                }
    
            } catch (e) {
                console.error(e);
            }
        },
 
        async toast (msg, duration) {
            duration = isNaN(duration) ? 3000 : duration;
            const toastDom = document.createElement('div');
            toastDom.innerHTML = msg;
            toastDom.style.cssText = 'padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'
            document.body.appendChild(toastDom);
            setTimeout(function () {
                const d = 3;
                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                toastDom.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(toastDom) }, d * 1000);
            }, duration);
        },

        async exportdoc(el, docName) {
            const elementContent = document.querySelector(el).innerHTML;
            /*const doc = new Docx();
            doc.fromHTML(elementContent);
            doc.createDocx(`${docName}.docx`);*/
            let wordContent = htmlDocx.asBlob(elementContent);
            const blobURL = URL.createObjectURL(wordContent);
            const link = document.createElement('a');
            link.href = blobURL;
            const docxFile = `${docName}.docx`;
            link.download = docxFile;
            link.click();
            URL.revokeObjectURL(blobURL);
            return docxFile;
        }
    }
 
 
    await utils.css(`
    #zuihuitao {
        position: fixed;
        top: 100px;
        left: 0;
        font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
        color: #222;
        user-select: none;
        z-index: 99999999;
    }
      
    #zuihuitao #m {
        display: inline-block;
        padding: 2em 1em;
        border-radius: 0 1em 1em 0;
        background: #fff;
        box-shadow: 0 0 3px 3px rgba(0, 0, 0, .05);
        cursor: pointer;
        writing-mode: vertical-rl;
        text-orientation: upright;
        white-space: nowrap;
        font-size: 14px;
        letter-spacing: .2em;
        transition: .3s;
    }
      
    #zuihuitao #m:hover {
        background: #fafafa;
    }
      
    #zuihuitao:hover .download-list {
        left: 5em;
    }
      
    #zuihuitao svg {
        width: 1.2em;
    }
      
    #zuihuitao .download-list {
        position: absolute;
        top: 50%;
        left: -400%;
        display: flex;
        flex-direction: column;
        list-style: none;
        background: #fff;
        padding: 0 1.6em;
        border-radius: 1em;
        transform: translateY(-50%);
        filter: drop-shadow(0 0 3px rgba(0, 0, 0, .05));
        transition: .6s;
    }
      
    #zuihuitao .download-list::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 1em solid transparent;
        border-right-color: #fff;
        top: 50%;
        left: -2em;
        transform: translateY(-50%);
    }
      
    #zuihuitao .download-list li {
        display: flex;
        flex-direction: column;
        gap: .4em;
        padding: 1.6em 0;
    }
      
    #zuihuitao .download-list li:first-of-type {
        border-bottom: 1px solid #eee;
    }
      
    #zuihuitao .download-list li .export-text {
        white-space: nowrap;
        font-size: 14px;
        color: #888;
    }
      
    #zuihuitao .download-list li .download-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .2em;
        white-space: nowrap;
        text-align: center;
        padding: .4em;
        border-radius: 100vh;
        background: #eee;
        cursor: pointer;
        transition: .3s;
    }
      
    #zuihuitao .download-list li .download-btn:hover {
        background: #333;
        color: #fff;
    }
      
    #zuihuitao .download-list li .download-btn:hover svg {
        stroke: #fff;
    }
 
    @media print {
        body {
                display: block !important;
        }
    }
  
    * {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }
    `);
 
 
    const html = `<div id='zuihuitao'>
    <div id="m">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M30 28L23.9933 34L18 28.0134" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 20V34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>文档下载
    </div>
    <ul class="download-list">
        <li>
            <span class="export-text">导出为Markdown</span>
            <span class="download-btn">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40.5178 34.3161C43.8044 32.005 45.2136 27.8302 44.0001 24C42.7866 20.1698 39.0705 18.0714 35.0527 18.0745H32.7317C31.2144 12.1613 26.2082 7.79572 20.1435 7.0972C14.0787 6.39868 8.21121 9.5118 5.38931 14.9253C2.56741 20.3388 3.37545 26.9317 7.42115 31.5035" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.0084 41L24 23" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.3638 34.6362L23.9998 41.0002L17.6358 34.6362" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>下载
            </span>
        </li>
        <li>
            <span class="export-text">导出为Word</span>
            <span class="download-btn">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40.5178 34.3161C43.8044 32.005 45.2136 27.8302 44.0001 24C42.7866 20.1698 39.0705 18.0714 35.0527 18.0745H32.7317C31.2144 12.1613 26.2082 7.79572 20.1435 7.0972C14.0787 6.39868 8.21121 9.5118 5.38931 14.9253C2.56741 20.3388 3.37545 26.9317 7.42115 31.5035" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.0084 41L24 23" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.3638 34.6362L23.9998 41.0002L17.6358 34.6362" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>下载
            </span>
        </li>
    </ul>
    </div>`;
 
    await utils.node(html);
    /*
    document.getElementsByClassName('item_text')[0].addEventListener('mouseover', () => {
        document.getElementsByClassName('die')[0].style.display = 'block';
    });
 
    document.getElementsByClassName('item_text')[0].addEventListener('mouseout', () => {
        document.getElementsByClassName('die')[0].style.display = 'none';
    })*/
 
    const cut_title = async (title, cut_str) => {
        try{
            const new_title = title.split(cut_str)[0];
            return new_title;
        }
        catch(e){
            console.log(e);
            return title;
        }
        
    }
 
    const save_md = async (el, title) => {
        const turndownService = new TurndownService();
        const gfm = turndownPluginGfm.gfm;
        turndownService.use(gfm);
        turndownService.remove('style');
        let ele = document.querySelector(el);
        let markdown = turndownService.turndown(ele);
        //console.log(markdown);
        let filename = `${title}.md`;
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', filename);
        let markdownContent = `${markdown}\n\n本文转自 <${webUrl}>，如有侵权，请联系删除。`;
        //downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdownContent);
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        let blobURL = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', blobURL);
        //document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(blob);
        return filename;
    }
    
    const getData = async () => {
        let new_headline;
        for (const even in InterfaceList) {
            if (host.endsWith(InterfaceList[even].host)) {
                let ele = InterfaceList[even].el;
                let cut = InterfaceList[even].cut_str;
                if(cut != ''){
                    new_headline = await cut_title(headline, cut);
                }else{
                    new_headline = document.title;
                }
 
                const data = {
                    title: new_headline,
                    el: ele
                }
 
                return data;
            }
        }
    }
 
    const exportMd = async () => {
 
        const data = await getData();
 
        return await save_md(data.el, data.title);
 
    }
 
    document.querySelectorAll('#zuihuitao .download-list li .download-btn')[0].addEventListener('click', async () => {
 
        await exportMd().then(
            async res => {
                //document.getElementsByClassName('die')[0].style.block = 'none';
                await utils.toast(`文件 ${res} 已开始下载~`, 1);
            }
        ).catch(
            async err => {
                await utils.toast(err, 1);
                console.log(err);
            }
        );
    });
 
    document.querySelectorAll('#zuihuitao .download-list li .download-btn')[1].addEventListener('click', async () => {
 
        const data = await getData();
        await utils.exportdoc(data.el, data.title).then(
            async res => {
                await utils.toast(`${res} 已开始下载~`, 1);
            },
            async err => {
                await utils.toast(err, 1);
                console.log(err);
            }
        );
 
    });
    
})();