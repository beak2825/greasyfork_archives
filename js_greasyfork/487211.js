// ==UserScript==
// @name         微软商店加速下载
// @namespace    https://flutas.cqoj.xyz
// @homepageURL  https://greasyfork.org/zh-CN/scripts/487211-%E5%BE%AE%E8%BD%AF%E5%95%86%E5%BA%97%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD
// @version      11.3.13
// @description  获取微软应用包原始链接,加速下载!
// @author       Xbodw
// @match        https://apps.microsoft.com/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-end
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/487211/%E5%BE%AE%E8%BD%AF%E5%95%86%E5%BA%97%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487211/%E5%BE%AE%E8%BD%AF%E5%95%86%E5%BA%97%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
    Aluk Query Library
    (c)2023 Flutas,All rights,Reserved.
    (Powered by Xbodw)

    Linense MIT
*/

window.aluk = function (select) {
    return new querylist(select);
};

var querylist = function (selector) {
    var ce;
    if (selector == '' || selector == undefined) {
        ce = '';
        return;
    }
    if (typeof (selector) == 'string' && aluk.checkHtml(selector) === false) {
        ce = document.querySelectorAll(selector);
    } else {
        if (typeof (selector) == 'number') {
            ce = '';
        } else {
            if (typeof (selector) == 'object') {
                ce = new Array(selector);
            } else {
                if (aluk.checkHtml(selector) === true) {
                    ce = new Array(aluk.htmlToElement(selector));
                }
            }
        }
    }
    if (ce.length > 1) {
        ce.forEach(element => {
            this.push(element);
        });
    } else {
        if (ce.length > 0) {
            this.push(ce[0]);
        }
    }
    var fn = this;
    this.NormalResult = document;
}

querylist.prototype = new Array();

aluk.objectToCss = function (obj) {
    return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value};`)
    //.join('\n');
}

querylist.prototype.AppendorMoveto = function (index, index2, appender) {
    var append;
    if (appender instanceof querylist) {
        if (index > appender.length - 1) {
            throw new Error('Index超出了预期范围');
        } else if (index == undefined || index == null) {
            throw new Error('Index为空或不存在: 如果使用aluk querylist对象代替Element,那么请指定Index');
        }
        append = appender[index];
    } else {
        if (!aluk.isHtmlElement(appender)) {
            throw new Error('请指定html元素或者aluk querylist对象');
        }
        append = appender;
    }
    if (index2 > this.length - 1) {
        throw new Error('Index2超出了预期范围');
    } else if (index2 == undefined || index2 == null) {
        throw new Error('Index2为空或不存在: 选择第几项来插入到appender的' + index2 + '项', '那么请指定Index2');
    }
    append.appendChild(this[index]);
}

querylist.prototype.RemoveX = function () {
    let count = 0;
    this.forEach(s => {
        s.remove();
        count++;
    })
    return count;
}

querylist.prototype.continue = function (select) {
    if (select == undefined || select == '') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Your Selector was empty or undefined,please.');
        } else {
            throw new Error('您的选择器为空或未定义');
        }
    }
    var newElements = [];

    // 在当前 elements 数组中查找符合选择器的元素，并添加到 newElements 数组中
    for (var i = 0; i < this.length; i++) {
        var matches = this[i].querySelectorAll(select);
        newElements.push(matches);
    }
    var newQueryList = new querylist('<null>');
    newQueryList.shift()
    newElements.forEach(y => {
        y.forEach(z => {
            newQueryList.push(z)
        })
    })
    newQueryList.NormalResult = newQueryList[0];
    return newQueryList;
}

aluk.isHtmlElement = function (variable) {
    return variable instanceof Element || variable instanceof HTMLElement;
}

aluk.createElementX = function (options) {
    if (typeof (options) != 'object') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element Options Type Must as the Object');
        } else {
            throw new Error('Element选项必须是Object');
        }
    }
    if (options.ElementType == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }


    }
    if (options.ElementType == '') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }
    }
    var result = document.createElement(options.ElementType);
    if (options.Class == undefined) {

    } else {
        result.classList.value += options.Class;
    }
    if (options.id == undefined) {

    } else {
        result.id = options.id;
    }
    if (options.innerHTML == undefined) {

    } else {
        result.innerHTML = options.innerHTML;
    }
    return aluk(result);
}

aluk.appendHTMLX = function (appender, element, options) {
    if (appender == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('AppendElement name not specified or empty')
        } else {
            throw new Error('追加者Element类型不能为空');
        }
    }
    if (element == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('Append HTML not specified or empty')
        } else {
            throw new Error('追加的HTML不能为空');
        }
    }
    if (typeof (options) != 'boolean') {
        if (options != undefined) {
            if (aluk.language != 'zh-cn') {
                throw new Error('Options not specified or empty')
            } else {
                throw new Error('选项为空或不存在');
            }
        }
    }
    let fixr = element.innerHTML;
    let fixed = fixr;
    if (options) {
        fixed = aluk.htmlEscape(fixr);
    }
    appender.innerHTML += fixed;
    return Promise.resolve(appender.innerHTML);
}

aluk.checkHtml = function (htmlStr) {

    var reg = /<[a-z][\s\S]*>/i;

    return reg.test(htmlStr);

}

function Alarm(construct, title) {
    this.onalarmisdiscard = null; // 初始化 onalarmisdiscard 事件为 null
    this.obj = construct;
    this.title = '提示';
    if (title != undefined) {
        this.title = title;
    }
}

// 定义 show 函数
Alarm.prototype.show = function () {
    // 创建提示框元素
    var alarmBox = document.createElement('div');
    alarmBox.className = 'alarm-box';
    alarmBox.innerHTML = '<h4 id="alarm-title">' + this.title + '</h4><span id="alarm-text">' + this.obj + '</span>';
    // 创建关闭按钮元素
    var closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerText = '×';
    alarmBox.appendChild(closeButton);
    var styleElement = document.createElement('style');
    styleElement.classList.add('alarmbox-style');
    var cssCode = `
    .alarm-box {
        position: fixed;
        top: 20px;
        left: 0px;
        right: 0px;
        width: 300px;
        margin: auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 9999;
      }

      .alarm-box .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        color: #888;
      }

      .alarm-box>* {
        font-family: "Microsoft YaHei Ui Light",ui-sans-serif,system-ui,Segoe UI;
        font-size: 95%;
        max-width: fix-content;
      }

      .alarm-box .close-button:hover {
        color: #000;
      }
`;
    styleElement.appendChild(document.createTextNode(cssCode));
    document.head.appendChild(styleElement);
    document.body.appendChild(alarmBox);
    closeButton.onclick = 'this.parentNode.removeChild(this)';
    closeButton.addEventListener('click', async function () {
        await aluk('.alarmbox-style').RemoveX();
        await closeButton.parentElement.remove();
        if (this.onalarmisdiscard) {
            this.onalarmisdiscard();
        }
    }.bind(this));
};


var button;
var sar;
var buyButton;
var StoreAPI = {
    GetFileListfunction: function() {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://store.rg-adguard.net/api/GetFiles',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: 'type=ProductId&url=' + window.location.pathname.split("detail/")[1] + '&ring=RP&lang=zh-CN',
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    var html = response.responseText;
                    buyButton.querySelector('span').textContent = '下载';
                    var links = extractLinks(html);
                    var names = extractAText(html);
                    var htmla = ``;
                    if(links.length > 0) {
                        links.forEach(linkstr => {
                            let i = links.indexOf(linkstr);
                            let named = simplifyPackageName(names[i]);
                            htmla += `<a href="` + linkstr + `">` + named + `</a><br><br>`;
                        });
                    }
                    var alarm = new Alarm(htmla,'资源地址');
                    alarm.show();
                } else {
                    // 处理错误情况
                    console.error("请求失败，状态码：" + response.status);
                    buyButton.querySelector('span').textContent = '下载';
                }
            },
            onerror: function (response) {
                // 处理网络错误或其他问题导致的请求失败
                console.error("请求出错");
            }
        });
    }
};

async function waitForElement(selector, root = document) {
    while ((root.querySelector(selector)) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return root.querySelector(selector);
}

function extractLinks(htmlText) {
    // 定义一个正则表达式来匹配所有的<a>标签中的href属性
    const linkRegex = /href="([^"]*)"/g;
    let links = [];
    let match;

    // 使用正则表达式循环匹配HTML文本
    while ((match = linkRegex.exec(htmlText)) !== null) {
        // 将每次匹配到的链接添加到links数组中
        links.push(match[1]);
    }

    return links;
}

function extractAText(htmlText) {
    // 创建一个新的DOMParser实例
    const parser = new DOMParser();
    // 将HTML字符串解析为DOM对象
    const doc = parser.parseFromString(htmlText, "text/html");
    // 选择所有的<a>标签
    const aTags = doc.querySelectorAll('a');
    let texts = [];

    // 遍历所有的<a>标签
    aTags.forEach(a => {
        // 获取并添加<a>标签的文本内容到texts数组中
        texts.push(a.innerText); // 或者使用textContent根据需求
    });

    return texts;
}

function simplifyPackageName(packageName) {
  const parts = packageName.split('_');
  const versionAndArchitecture = parts[1];
  const simplifiedName = parts[0].split('.').pop();
  const arch = parts[2].split('.').pop();
  const extension = packageName.split('.').pop();

  return `${simplifiedName}_${versionAndArchitecture}-${arch}.${extension}`;
}

async function loader() {
    sar = await waitForElement('app-index');
    let productDetailsPage = await waitForElement('product-details-page',sar.shadowRoot);
    console.log(productDetailsPage);

    // 确保productDetailsPage非null后再继续
    let buyBoxContainer = await waitForElement('.buy-box-container', productDetailsPage.shadowRoot);
    let buyBox = await waitForElement('buy-box', buyBoxContainer);
    let buyBoxInner = await waitForElement('.buy-box', buyBox.shadowRoot);
    buyButton = await waitForElement('.buy-btn', buyBoxInner);
    let buttonShadowRoot = buyButton.shadowRoot;
    button = await waitForElement('a[part="base"]', buttonShadowRoot);
    button.removeAttribute('href');
    button.addEventListener('click',() => {
        buyButton.querySelector('span').textContent = '正在获取链接';
        StoreAPI.GetFileListfunction();
    });
    buyButton.querySelector('span').textContent = '下载';
    buyButton.querySelector('img.logo').src = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Ni41NzkxNyIgaGVpZ2h0PSI2MS40MzA2NCIgdmlld0JveD0iMCwwLDY2LjU3OTE3LDYxLjQzMDY0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2LjkzMzgzLC0xNDkuMjkxMDMpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIwNy45MzM4MywyMDkuMzc5MTNsNjMuMTUyMjcsMC4zMjk4NWwtNTkuNDE3OTUsLTU5LjQxNzk1Ii8+PHBhdGggZD0iTTI3Mi4wNjYxNywxNTMuMTM3Mjd2NTYuNDczMDQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozMy4wNjYxNjg1MTM5NzczNzQ6MzAuNzA4OTc0NzE3NTQyOTMtLT4=`;
}

function checkElementExistence() {
    if(sar == undefined || sar == null) {
        loader();
    }
}

(function () {
    'use strict';
    loader();
})();
