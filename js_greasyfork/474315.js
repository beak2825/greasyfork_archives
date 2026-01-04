// ==UserScript==
// @name         LinkedinScraper
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @namespace    https://github.com/zhangyongjian258/greasy-fork-scripts
// @version      1.1
// @match        www.linkedin.com/search/results*
// @description  获取领英用户名脚本
// @author       一笑倾城
// @grant       GM_addStyle
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @license Creative Commons
// @downloadURL https://update.greasyfork.org/scripts/474315/LinkedinScraper.user.js
// @updateURL https://update.greasyfork.org/scripts/474315/LinkedinScraper.meta.js
// ==/UserScript==
(() => {
    // @run-at      document-start
    let $jq = $;
    unsafeWindow.$jq = $;
    unsafeWindow.layer = layer;

    let names = [];  // to store scraped names

    function scrapeSearchResults() {
        let nameElements = document.querySelectorAll(".entity-result__title-text");
        if (nameElements.length) {
            nameElements.forEach((el) => {
                let possibleNameElement = el.querySelector('span');
                if (possibleNameElement) {
                    let name = possibleNameElement.outerText.split('\n')[0];
                    names.push(name);
                }
            });

            // Check if there's a next page
            let parentDiv = $(".ember-view");
            let buttonTextElements = parentDiv.find("button");

            for (let i = 0; i < buttonTextElements.length; i++) {
                let buttonText = buttonTextElements[i].textContent;
                if (buttonText.trim() === '下页') {
                    if (buttonTextElements[i].disabled) {
                        alert('结束！')
                        break;
                    }
                    buttonTextElements[i].click();
                    setTimeout(() =>{
                        $(window).scrollTop($(document).height() - $(window).height());
                    }, 2000)
                    // 找到按钮，模拟点击操作
                    layer.alert('五秒后切换到下一页！', {
                        time: 5 * 1000,
                        success: function (layero, index) {
                            var timeNum = this.time / 1000, setText = function (start) {
                                layer.title('<span class="layui-font-red">' + (start ? timeNum : --timeNum) + '</span> 秒后自动关闭', index);
                            };
                            setText(!0);
                            this.timer = setInterval(setText, 1000);
                            if (timeNum <= 0) {
                                clearInterval(this.timer);
                            }
                        },
                        end: function () {
                            clearInterval(this.timer);
                            // 执行脚本
                            scrapeSearchResults();
                        }
                    });
                    break;
                }
            }
            // if no next page, copy names to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(names.join('\n'))
            }
        }
    }

    layer.alert('五秒后开始执行脚本！', {
        time: 5 * 1000,
        success: function (layero, index) {
            var timeNum = this.time / 1000, setText = function (start) {
                layer.title('<span class="layui-font-red">' + (start ? timeNum : --timeNum) + '</span> 秒后自动关闭', index);
            };
            setText(!0);
            this.timer = setInterval(setText, 1000);
            if (timeNum <= 0) {
                clearInterval(this.timer);
            }
        },
        end: function () {
            clearInterval(this.timer);
            // 执行脚本
            scrapeSearchResults();
        }
    });
})();
