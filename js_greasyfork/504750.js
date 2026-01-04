// ==UserScript==
// @name         外来语翻译显示
// @namespace    http://tampermonkey.net/
// @license     MIT
// @version      1.0
// @description  在网页中的外来语上方显示中文翻译
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504750/%E5%A4%96%E6%9D%A5%E8%AF%AD%E7%BF%BB%E8%AF%91%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/504750/%E5%A4%96%E6%9D%A5%E8%AF%AD%E7%BF%BB%E8%AF%91%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

var _ = document;
var queue = {};  // {"外来语": [rtNodeA, rtNodeB]}
var cachedTranslations = {};  // {"Terminator": "终结者"}
var newNodes = [_.body];

// 递归遍历给定节点及其子节点（深度优先搜索）
function scanTextNodes(node) {
    if (!node.parentNode || !_.body.contains(node)) {
        return;
    }
    var excludeTags = {ruby: true, script: true, select: true, textarea: true};
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) {
                return;
            }
            return node.childNodes.forEach(scanTextNodes);
        case Node.TEXT_NODE:
            while ((node = addRuby(node)));
    }
}

// 递归为文本节点添加 ruby 标签
function addRuby(node) {
    var foreignWordPattern = /\b([A-Za-z]+)\b/g; // 匹配英文单词
    var match;
    if (!node.nodeValue || !(match = foreignWordPattern.exec(node.nodeValue))) {
        return false;
    }
    var ruby = _.createElement('ruby');
    ruby.appendChild(_.createTextNode(match[0]));
    var rt = _.createElement('rt');
    rt.classList.add('foreign-word-rt');
    ruby.appendChild(rt);

    // 将待翻译的外来语加入队列
    queue[match[0]] = queue[match[0]] || [];
    queue[match[0]].push(rt);

    var after = node.splitText(match.index);
    node.parentNode.insertBefore(ruby, after);
    after.nodeValue = after.nodeValue.substring(match[0].length);
    return after;
}

// 翻译文本节点
function translateTextNodes() {
    var apiRequestCount = 0;
    var phraseCount = 0;
    var chunkSize = 200;
    var chunk = [];
    for (var phrase in queue) {
        phraseCount++;
        if (phrase in cachedTranslations) {
            updateRubyByCachedTranslations(phrase);
            continue;
        }
        chunk.push(phrase);
        if (chunk.length >= chunkSize) {
            apiRequestCount++;
            googleTranslate('en', 'zh-CN', chunk);
            chunk = [];
        }
    }
    if (chunk.length) {
        apiRequestCount++;
        googleTranslate('en', 'zh-CN', chunk);
    }
    if (phraseCount) {
        console.debug('外来语翻译:', phraseCount, '个短语在', apiRequestCount, '个请求中翻译，页面', window.location.href);
    }
}

// 构建查询字符串
function buildQueryString(params) {
    return '?' + Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
}

// Google翻译API
function googleTranslate(srcLang, destLang, phrases) {
    phrases.forEach(function(phrase) {
        cachedTranslations[phrase] = null;
    });
    var joinedText = phrases.join('\n').replace(/\s+$/, ''),
        api = 'https://translate.googleapis.com/translate_a/single',
        params = {
            client: 'gtx',
            dt: 't',
            sl: srcLang,
            tl: destLang,
            q: joinedText,
        };
    GM_xmlhttpRequest({
        method: "GET",
        url: api + buildQueryString(params),
        onload: function(dom) {
            try {
                var resp = JSON.parse(dom.responseText.replace("'", '\u2019'));
            } catch (err) {
                console.error('外来语翻译: 无效的响应', dom.responseText);
                return;
            }
            resp[0].forEach(function(item) {
                var translated = item[0].replace(/\s+$/, ''),
                    original   = item[1].replace(/\s+$/, '');
                cachedTranslations[original] = translated;
                updateRubyByCachedTranslations(original);
            });
        },
        onerror: function(dom) {
            console.error('外来语翻译: 请求错误', dom.statusText);
        },
    });
}

// 更新ruby标签
function updateRubyByCachedTranslations(phrase) {
    if (!cachedTranslations[phrase]) {
        return;
    }
    (queue[phrase] || []).forEach(function(node) {
        node.dataset.rt = cachedTranslations[phrase];
    });
    delete queue[phrase];
}

// 监视新添加的DOM节点
function mutationHandler(mutationList) {
    mutationList.forEach(function(mutationRecord) {
        mutationRecord.addedNodes.forEach(function(node) {
            newNodes.push(node);
        });
    });
}

function main() {
    GM_addStyle("rt.foreign-word-rt::before { content: attr(data-rt); }");
    var observer = new MutationObserver(mutationHandler);
    observer.observe(_.body, {childList: true, subtree: true});

    function rescanTextNodes() {
        mutationHandler(observer.takeRecords());
        if (!newNodes.length) {
            return;
        }
        console.debug('外来语翻译:', newNodes.length, '个新节点被添加，页面', window.location.href);
        newNodes.forEach(scanTextNodes);
        newNodes.length = 0;
        translateTextNodes();
    }

    rescanTextNodes();
    setInterval(rescanTextNodes, 500);
}

if (typeof GM_xmlhttpRequest === 'undefined' &&
    typeof GM === 'object' && typeof GM.xmlHttpRequest === 'function') {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}
if (typeof GM_addStyle === 'undefined') {
    GM_addStyle = function(css) {
        var head = _.getElementsByTagName('head')[0];
        if (!head) {
            return null;
        }
        var style = _.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    };
}
if (typeof NodeList.prototype.forEach === 'undefined') {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
main();