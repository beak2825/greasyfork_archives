// ==UserScript==
// @name         飞书妙计自动复制转换后的文字到剪切板
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Extract title and subtitle from Feishu Meeting Minutes, format and copy to clipboard with centered non-blocking alerts and retry mechanism
// @author       You
// @match        https://*.feishu.cn/minutes/obcn*
// @grant        GM_setClipboard
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489136/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%A1%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%BD%AC%E6%8D%A2%E5%90%8E%E7%9A%84%E6%96%87%E5%AD%97%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/489136/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%A1%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%BD%AC%E6%8D%A2%E5%90%8E%E7%9A%84%E6%96%87%E5%AD%97%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function notify(message) {
        const notificationBoxId = 'tm-notification-box';
        let box = document.getElementById(notificationBoxId);
        if (!box) {
            box = document.createElement('div');
            box.id = notificationBoxId;
            Object.assign(box.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'lightgrey',
                padding: '20px',
                zIndex: 10000,
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                textAlign: 'center',
                maxWidth: '80%',
                wordWrap: 'break-word'
            });
            document.body.appendChild(box);
        }
        box.style.display = 'block';
        box.textContent = message;
        setTimeout(() => {
            box.style.display = 'none';
        }, 3000);
    }

    function copyToClipboard(text) {
        try {
            GM_setClipboard(text);
            notify('已复制到剪切板');
        } catch (e) {
            notify('复制失败，请手动复制');
        }
    }

    function processText(inputText) {
        // 替换中文全角标点的"，"和"。"为换行符
        inputText = inputText.replace(/，/g, "\n").replace(/。/g, "\n");

        // 在中文全角标点的"？"和"！"后加上换行符
        inputText = inputText.replace(/？/g, "？\n").replace(/！/g, "！\n");

        // 将所有的\r换行符替换成\n换行符
        inputText = inputText.replace(/\r/g, "\n");

        // 将连续的\n\n换行符替换成一个\n换行符
        while (inputText.includes("\n\n")) {
            inputText = inputText.replace(/\n\n/g, "\n");
        }

        return inputText;
    }

    function extractAndCopy(triesLeft = 3) {
        if (triesLeft === 0) {
            notify('查找失败，已放弃');
            return;
        }

        notify('正在查找信息...');
        const titleXpath = "//div[@class='larkw-web-header-caption-head-title-edit']//span";
        const textXpath = "//div[@class='subtitle-comp']/div[@id='subtitle-scroll-container']";
        const titleResults = document.evaluate(titleXpath, document, null, XPathResult.ANY_TYPE, null);
        const textResults = document.evaluate(textXpath, document, null, XPathResult.ANY_TYPE, null);
        const titleElement = titleResults.iterateNext();
        const textElement = textResults.iterateNext();

        if (titleElement && textElement) {
            const titleContent = titleElement.textContent || "";
            const textContent = textElement.textContent || "";
            if (titleContent && textContent) {
                notify('查找成功');
                const processedText = processText(textContent); // 调用处理文本函数
                copyToClipboard(`#### ${titleContent}\n${processedText}\n\n`);
            } else {
                notify('查找成功，但是没有找到完整的内容');
            }
        } else {
            notify(`查找失败，尝试剩余次数：${triesLeft - 1}`);
            setTimeout(() => extractAndCopy(triesLeft - 1), 1000);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(extractAndCopy, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", () => setTimeout(extractAndCopy, 1000));
    }
})();
// ==UserScript==
// @name         飞书妙计自动复制转换后的文字到剪切板
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Extract title and subtitle from Feishu Meeting Minutes, format and copy to clipboard with centered non-blocking alerts and retry mechanism
// @author       You
// @match        https://*.feishu.cn/minutes/obcn*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function notify(message) {
        const notificationBoxId = 'tm-notification-box';
        let box = document.getElementById(notificationBoxId);
        if (!box) {
            box = document.createElement('div');
            box.id = notificationBoxId;
            Object.assign(box.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'lightgrey',
                padding: '20px',
                zIndex: 10000,
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                textAlign: 'center',
                maxWidth: '80%',
                wordWrap: 'break-word'
            });
            document.body.appendChild(box);
        }
        box.style.display = 'block';
        box.textContent = message;
        setTimeout(() => {
            box.style.display = 'none';
        }, 3000);
    }

    function copyToClipboard(text) {
        try {
            GM_setClipboard(text);
            notify('已复制到剪切板');
        } catch (e) {
            notify('复制失败，请手动复制');
        }
    }

    function processText(inputText) {
        // 删除所有的“嗯”
        inputText = inputText.replace(/嗯/g, "");
        
        // 删除所有的“唉”
        inputText = inputText.replace(/唉/g, "");

        // 替换中文全角标点的"，"和"。"为换行符
        inputText = inputText.replace(/，/g, "\n").replace(/。/g, "\n");

        // 在中文全角标点的"？"和"！"后加上换行符
        inputText = inputText.replace(/？/g, "？\n").replace(/！/g, "！\n");

        // 将所有的\r换行符替换成\n换行符
        inputText = inputText.replace(/\r/g, "\n");

        // 将连续的\n\n换行符替换成一个\n换行符
        while (inputText.includes("\n\n")) {
            inputText = inputText.replace(/\n\n/g, "\n");
        }

        return inputText;
    }

    function extractAndCopy(triesLeft = 3) {
        if (triesLeft === 0) {
            notify('查找失败，已放弃');
            return;
        }

        notify('正在查找信息...');
        const titleXpath = "//div[@class='larkw-web-header-caption-head-title-edit']//span";
        const textXpath = "//div[@class='subtitle-comp']/div[@id='subtitle-scroll-container']";
        const titleResults = document.evaluate(titleXpath, document, null, XPathResult.ANY_TYPE, null);
        const textResults = document.evaluate(textXpath, document, null, XPathResult.ANY_TYPE, null);
        const titleElement = titleResults.iterateNext();
        const textElement = textResults.iterateNext();

        if (titleElement && textElement) {
            const titleContent = titleElement.textContent || "";
            const textContent = textElement.textContent || "";
            if (titleContent && textContent) {
                notify('查找成功');
                const processedText = processText(textContent); // 调用处理文本函数
                copyToClipboard(`#### ${titleContent}\n${processedText}\n\n`);
            } else {
                notify('查找成功，但是没有找到完整的内容');
            }
        } else {
            notify(`查找失败，尝试剩余次数：${triesLeft - 1}`);
            setTimeout(() => extractAndCopy(triesLeft - 1), 1000);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(extractAndCopy, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", () => setTimeout(extractAndCopy, 1000));
    }
})();
