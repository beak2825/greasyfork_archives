// ==UserScript==
// @name         FindDownloadLink
// @namespace    https://lilopusic.github.io/
// @version      0.1
// @description  侦测页面中的磁力链接&&下载地址并生成到按钮中
// @author       hnayan
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @include      http://*
// @include      https://*
// @downloadURL https://update.greasyfork.org/scripts/368282/FindDownloadLink.user.js
// @updateURL https://update.greasyfork.org/scripts/368282/FindDownloadLink.meta.js
// ==/UserScript==

(function () {
    addStyle();
    new ClipboardJS('.getAll');
    class RenderButton {
        constructor($, $dom, $a) {
            this.$dom = $dom;
            this.$a = $a;
            this.$ = $;
            this.map = new Map();
        }
        push(name, href) {
            if (!this.map.has(name)) {
                this.map.set(name, []);
            }
            this.map.get(name).push(href);
        }
        render() {
            for (let name of this.map.keys()) {
                this.appendButton(name, this.map.get(name));
            }
        }
        appendButton(name, list) {
            if (list.length !== 0) {
                this.$dom.append(`<button data-clipboard-text="${list.join('\n')}"  title="Total: ${list.length}" class="getAll" id="get${name}">Get All ${name}.</button>`);
            }
        }
        init() {
            let $ = this.$;
            $('body').append($container);
            for (let i = 0; i < this.$a.length; i++) {
                let href = $($a[i]).attr('href');
                if (href.startsWith('ed2k')) {
                    this.push('Ed2k', $($a[i]).attr('href'));
                }
                if (href.startsWith('magnet')) {
                    this.push('Magnet', $($a[i]).attr('href'));
                }
                if (href.startsWith('thunder')) {
                    this.push('Thunder', $($a[i]).attr('href'));
                }
                if (href.endsWith('exe')) {
                    this.push('Exe', $($a[i]).attr('href'));
                }
                if (href.endsWith('zip') || href.endsWith('rar')) {
                    this.push('Zip', $($a[i]).attr('href'));
                }
            }
        }
    }
    const $a = $('a[href]');
    const $container = $('<div id="getAllPanel" style="position: fixed;right: -50px;top: 100px;z-index: 9999"></div>');
    const renderButton = new RenderButton($, $container, $a);
    renderButton.init();
    renderButton.render();

    function addStyle(){
        GM_addStyle('.getAll {right:0px;transition: right .5s;position:relative;min-width:100%;margin:5px 0;background-color:white;display: block;padding:10px 15px;border: 1px solid #eee;border-bottom-color: #ddd;-webkit-border-radius: 3px;-webkit-box-shadow: 0 1px 3px #eee;-moz-border-radius: 3px;-moz-box-shadow: 0 1px 3px #eee;border-radius: 100px 0 0 100px;outline: none;cursor: pointer;}');
        GM_addStyle('.getAll:hover {right: 50px;}');
    }
})();