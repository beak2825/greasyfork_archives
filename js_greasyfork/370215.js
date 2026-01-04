// ==UserScript==
// @name         知乎答案复制为markdown格式
// @namespace    https://github.com/nameldk/user-script
// @version      0.1
// @description  把知乎的答案复制为markdown格式
// @icon         https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @author       nameldk
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370215/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E5%A4%8D%E5%88%B6%E4%B8%BAmarkdown%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/370215/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E5%A4%8D%E5%88%B6%E4%B8%BAmarkdown%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let turndownService = new TurndownService();
    turndownService.addRule('formula', {
        filter: function (node, options) {
            // console.log(node)
            return (
                options.linkStyle === 'inlined' &&
                node.nodeName === 'IMG' &&
                node.outerHTML.search("data-formula") != -1
            )
        },
        replacement: function (content, node) {
            return '$' + node.outerHTML.replace(/^.*?data-formula="(.*?) *?".*?$/,"$1") + '$'
        }
    })
    turndownService.addRule('figure', {
        filter: 'figure',
        replacement: function (content, node) {
            var description = "";
            if(node.innerHTML.search("<figcaption>") != -1){
                description = node.innerHTML.replace(/^.*?<figcaption>(.*?)<\/figcaption>.*?$/,"$1")
            }
            return '![]('
                + node.innerHTML.replace(/^.*?src="(.*?)".*?$/,"$1") + ')  \n'
                + description
        }
    })
    let isAnswerPage = window.location.href.match(/www.zhihu.com\/question\/\d+\/answer\/\d+/);
    let isZhuanlan = window.location.href.match(/zhuanlan.zhihu.com\/p\/\d+/);

    function bind() {
        $('.List-item, .AnswerCard, .Post-content').each(function () {
            let $thisItem = $(this);
            let $btn = $('<button type="button" class="btn-html2md Button Button--blue" style=" position: absolute; right: 20px; top: 10px;">copy2md</button>');
            let $author = $thisItem.find(".AuthorInfo");
            if (isAnswerPage) {
                $btn.css({
                    "position": "relative",
                    "float": "right"
                });
            }
            if (isZhuanlan) {
                $btn[0].style.top = "60px";
            }
            $thisItem.prepend($btn);
            $btn.on("click", function () {
                let $rich = $thisItem.find(".RichContent-inner");
                if(!$rich.length) {$rich = $thisItem.find(".Post-RichTextContainer");}
                if ($rich.length) {
                    let markdown = "";
                    let title = $(".Post-Title");
                    if(title.length){
                        markdown += "# " + title[0].innerText + "\n\n";
                    }
                    markdown += turndownService.turndown($rich.get(0));
                    markdown = markdown.replace(/<img.+?>/g, "");
                    markdown += "\n> 作者：" + $author.children('meta[itemprop="name"]').attr("content") || '';
                    markdown += '\n> 链接：' + $thisItem.find('meta[itemprop="url"][content*="/answer/"]').attr('content') || '';
                    // console.log(markdown);
                    if (copyToClipboard(markdown)) {
                        let $t = $('<div style="position: absolute;width: 80px;padding-top: 2px;height: 24px;right: 40%;background: #68af02;color: #fff;text-align: center;border-radius: 5px;margin-left: 300px;">复制成功</div>');
                        if (isAnswerPage) {
                            $t.css({
                                "margin-top": "10px",
                                "right": "auto"
                            });
                        }
                        if (isZhuanlan) {
                            $t[0].style.right = "20px";
                            $t[0].style.top = "100px";
                        }
                        $thisItem.prepend($t);
                        setTimeout(function () {
                            $t.remove();
                        }, 1500);
                    } else {
                        console.error("操作失败");
                    }
                }
            });
        });
    }

    function copyToClipboard(text) {
        const input = document.createElement('textarea');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        input.select();
        let res = document.execCommand('Copy');
        document.body.removeChild(input);
        return res;
    }

    setTimeout(function () {
        bind();
    }, 1000);
})();
