// ==UserScript==
// @name         格式化nexus中pypi私有仓库的展示
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  美化nexus pypi私有仓库
// @author       Chris.tang
// @match        *://*/
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/13.0.3/marked.min.js
// @icon         https://filecdn.hgj.com/yunlsp/ico/yunlsp.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502203/%E6%A0%BC%E5%BC%8F%E5%8C%96nexus%E4%B8%ADpypi%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E7%9A%84%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502203/%E6%A0%BC%E5%BC%8F%E5%8C%96nexus%E4%B8%ADpypi%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E7%9A%84%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function modifyXMLHttpRequest() {
        const originalXhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener('load', () => {
                if (this.responseURL.includes('extdirect') && this.responseText.includes("description")) {
                    GM_setValue("pypiDetail", JSON.parse(this.responseText));
                }
            });
            return originalXhrSend.apply(this, arguments);
        };
    };

    async function customizePage() {
        var hashPattern = /^#browse\/search\/pypi:([a-f0-9]{32}):([a-f0-9]{32})$/;
        var match = window.location.hash.match(hashPattern);

        if (match) {
            const data = GM_getValue("pypiDetail");
            const pypi = data.result.data[0].attributes.pypi;
            let { description, summary } = pypi;
            for (let index = 0; index < 20; index++) {
                await ((delay) => new Promise((resolve) => setTimeout(resolve, delay)))(100);
                let snapshotLength = document.evaluate("//span[text()='Usage']/ancestor::a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (snapshotLength > 0) {
                    break
                }
            }
            document.evaluate("//span[text()='Usage']/ancestor::a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
            fixPage(summary);
            const descrptionBox = document.evaluate("//pre[@class='snippet-text']/ancestor::div[contains(@class, 'x-panel-nx-inset')]/parent::div", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            description = replaceStr(description);
            let div_element = insertDescrption(parseMD2HTML(description));
            descrptionBox.snapshotItem(0).appendChild(div_element);
            randerPage();
        }
    };


    /**
     * @function 将多余html元素删除修改
     */
    function fixPage(summary) {
        // 将摘要进行更改
        document.evaluate("//div[text()='Usage']/ancestor::div[contains(@class, 'x-panel-header-nx-inset')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).style.backgroundColor = "#f4f4f4";
        document.evaluate("//span[text()='Usage']/ancestor::a/ancestor::div[@role='tablist']", document, null, XPathResult.ANY_TYPE, null).iterateNext().style.display = "none";
        const summeryBox = document.evaluate("//div[text()='Usage']", document, null, XPathResult.ANY_TYPE, null);
        summeryBox.iterateNext().innerHTML = `<h2 style="color:#464646">${summary}</h2>`
    };


    /**
     * @function 将描述文档插入到的页面中
     * @param {string} description 说明文档
     * @returns {object} div标签
     */
    function insertDescrption(description) {
        // 生成一个div标签
        const div = document.createElement("div");
        div.setAttribute("id", "pypiDescription");
        div.setAttribute("class", "x-panel x-panel-nx-inset");
        div.setAttribute("role", "presentation");
        div.innerHTML = description
        return div
    }


    /**
     * @function 渲染页面
     */
    function randerPage() {
        $("#pypiDescription pre").css({
            "background-color": "#f9f9f9",
            "border": "1px solid #d3d3d3",
            "color": "#6c6c6c",
            "font-family": "Source Code Pro, monospace",
            "font-size": ".85rem",
            "padding": "15px"
        });
        $("#pypiDescription blockquote").css({
            "border-left": "3px solid #bbb",
            "color": "#797979",
            "font-style": "italic",
            "margin": "15px 0 0 15px",
            "padding-left": "15px"
        });
    }

    /**
     * @function 将markdown文档转为html
     * @param {string} content description描述信息
     * @returns {string} 转化后的html
     */
    function parseMD2HTML(content) {
        const html = marked.parse(content);
        return html;
    }

    /**
     * @function 格式化description文本，方便更清晰的输出出来
     */
    function replaceStr(content) {
        // 将开头的=字符去除
        content = content.replace(/^=+/, "");
        // 替换rst文件的格式，转换成md可以解析的样式
        let regexList = [[/`([\w ]+)<(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|])>`_/g, (match, p1, p2) => `[${p1}](${p2})`], [/`([^`]+)`_/g, (match, p1) => `[${p1}][]`], [/\.\. _([^:]+):/g, (match, p1) => `[${p1}]:`], [/\.\. image::\s+(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|])\s+:target:\s+(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|])/g, (match, p1, p2) => `![${p2}](${p1})`]]
        for (let one of regexList) {
            content = content.replace(one[0], one[1]);
        };
        let content_list = content.split("\n");
        let startLetterList = [/^\[\w/]

        let flag = false;
        for (let index = 0; index < content_list.length; index++) {
            const element = content_list[index];
            if (element.includes(".. code-block:: ")) {
                content_list[index] = flag ? "```\n" + element.replace(".. code-block:: ", "```") : element.replace(".. code-block:: ", "```")
                flag = true
            } else if (element.includes(".. code:: ")) {
                content_list[index] = flag ? "```\n" + element.replace(".. code:: ", "```") : element.replace(".. code:: ", "```")
                flag = true
            } else if (flag && (startLetterList.some((value) => { if (value.test(element)) { return true } }) || index == content_list.length - 1)) {
                startLetterList.some((index, value) => { if (value == element.slice(0, value.length)) { return true } })
                content_list[index] = "```\n" + content_list[index]
                flag = false;
            } else if (flag && element.slice(0, "-----".length) == "-----") {
                content_list[index - 1] = "```\n" + content_list[index - 1]
                flag = false;
            }
        }
        return content_list.join("\n");
    }

    function init() {
        if (!window.readyLoaded) {
            modifyXMLHttpRequest();
            window.readyLoaded = true;
            console.log("load")
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('hashchange', customizePage);
    customizePage();
})();