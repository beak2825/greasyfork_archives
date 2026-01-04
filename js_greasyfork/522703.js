// ==UserScript==
// @name         Markdown Grabber
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  markdown grabber
// @author       5ec1cff
// @match        *://*/*
// @license      AGPL
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/522703/Markdown%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/522703/Markdown%20Grabber.meta.js
// ==/UserScript==

// 2021.12.24 Fri: 修正
// 2022.03.15 Tue: 增加下载图片支持（默认启用）
// 2023.03.01 Wed: 支持 xz.aliyun.cn ；下载图片附带 Referer
// 2025.06.30 Mon: 兼容 bbs.kanxue.com ，支持代码，支持解密链接

(function () {
    'use strict';

    if (window.top !== window) return; // 阻止在 iframe 启用

    const downloadPics = true;

    const picMap = new Map();

    const console = unsafeWindow.console.context();

    function decodeKanxueUrl(s) {
        let str = s;
        try {
            // 检查是否已经是解密后的URL格式
            if (str.includes('http://') || str.includes('https://') || str.includes('www.')) {
                return str;
            }
            // 1. 移除salt
            const encrypted = str.slice(3);
            // 2. 定义替换规则的反向映射
            const replacePairs = {
                'K9': 'a', 'L8': 'b', 'M7': 'c',
                'N6': 'd', 'P5': 'e', 'Q4': 'f',
                'R3': 'g', 'S2': 'h', 'T1': 'i',
                'U0': 'j', 'V1': 'k', 'W2': 'l',
                'X3': 'm', 'Y4': 'n', 'Z5': 'o',
                'A6': 'p', 'B7': 'q', 'C8': 'r',
                'D9': 's', 'E0': 't', 'F1': 'u',
                'G2': 'v', 'H3': 'w', 'I4': 'x',
                'J5': 'y', 'K6': 'z',
                'l9': 'A', 'm8': 'B', 'n7': 'C',
                'o6': 'D', 'p5': 'E', 'q4': 'F',
                'r3': 'G', 's2': 'H', 't1': 'I',
                'u0': 'J', 'v1': 'K', 'w2': 'L',
                'x3': 'M', 'y4': 'N', 'z5': 'O',
                'a6': 'P', 'b7': 'Q', 'c8': 'R',
                'd9': 'S', 'e0': 'T', 'f1': 'U',
                'g2': 'V', 'h3': 'W', 'i4': 'X',
                'j5': 'Y', 'k6': 'Z',
                '@1': '0', '#2': '1', '$3': '2',
                '%4': '3', '^5': '4', '&6': '5',
                '*7': '6', '(8': '7', ')9': '8',
                '!0': '9', '-_': '+', '|~': '/',
                '`.': '='
            };

            // 3. 按长度排序替换规则
            const sortedPairs = Object.entries(replacePairs)
                .sort((a, b) => b[0].length - a[0].length);

            // 4. 执行替换
            let base64 = encrypted;
            for (const [pattern, replacement] of sortedPairs) {
                base64 = base64.split(pattern).join(replacement);
            }

            // 5. 补全base64字符串的等号
            while (base64.length % 4) {
                base64 += '=';
            }

            // 6. 清理非法字符
            base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');

            // 7. base64解码
            const decoded = atob(base64);

            s = decoded;
        } catch (e) {
            console.log('decodeKanxueUrl', e);
            return str; // 如果解密失败，返回原始字符串
        }
	      s = s.replace(/_/g, "%");
	      s = decodeURIComponent(s);
	      return s;
    }

    function getPictureKey(url) {
        return url;
    }

    function getPicture(url) {
        const key = getPictureKey(url);
        if (picMap.get(url) == null) {
            picMap.set(url,
                new Promise((rs, rj) => {
                    if (!downloadPics || !url?.startsWith("http")) {
                        rs([key, url]);
                        return;
                    }
                    GM_xmlhttpRequest({
                        url: url,
                        headers: { Referer: location.href },
                        responseType: "blob",
                        onload(r) {
                            const fr = new FileReader();
                            fr.onloadend = () => {
                                console.log('load done:', url);
                                rs([key, fr.result]);
                            }
                            fr.onerror = (e) => {
                                rj(e);
                            }
                            fr.readAsDataURL(r.response);
                        },
                        onerror(e) {
                            rj(e);
                        },
                        onabort(e) {
                            rj(e);
                        }
                    })
                })
            );
        }
        return key;
    }

    function parseSimpleStyle(e) {
        let r = '';
        switch (e.tagName.toLowerCase()) {
            case 'b':
            case 'strong':
                r += `**${parseSingleLine(e)}**`;
                break;
            case 'i':
            case 'em':
                r += `*${parseSingleLine(e)}*`;
                break;
            case 's':
            case 'strike':
                r += `~~${parseSingleLine(e)}~~`;
                break;
            case 'a': {
                if (e.href) {
                    let href = e.getAttribute('href');
                    if (href.indexOf('elink@') !== -1) {
                        href = decodeKanxueUrl(href.substr(6));
                    }
                    r += `[${parseSingleLine(e)}](${href})`;
                }
                break;
            }
            case 'code':
                r += `\`${e.innerText}\``;
                break;
            case 'img':
                r += `\n![][${getPicture(e.src)}]\n`;
                break;
            default:
                r += parseSingleLine(e);
        }
        return r;
    }

    function parseSingleLine(element) {
        if (element instanceof Text) return element.data.trim();
        let r = '';
        if (element instanceof HTMLElement) {
            for (let e of element.childNodes) {
                if (e instanceof Text) r += e.data;
                if (!(e instanceof HTMLElement)) continue;
                r += parseSimpleStyle(e);
            }
        }
        return r.trim();
    }

    function isSingleLine(node) {
        return !node.querySelector('p,ul,ol,br');
    }

    function parseNode(element) {
        let lines = [], singleLine = null;
        if (element instanceof HTMLElement) {
            for (let e of element.childNodes) {
                if (!(e instanceof HTMLElement) && !(e instanceof Text)) continue;
                let tagName;
                if (e instanceof Text) {
                    tagName = 'TEXT';
                } else {
                    tagName = e.tagName.toLowerCase();
                }
                switch (tagName) {
                    case 'TEXT':
                    case 'a':
                    case 'b':
                    case 'strong':
                    case 'i':
                    case 'em':
                    case 's':
                    case 'strike':
                    case 'a':
                    case 'code': {
                        if (singleLine == null) singleLine = '';
                        if (tagName == 'TEXT') {
                            singleLine += e.data.trim();
                        }
                        else {
                            singleLine += parseSimpleStyle(e);
                        }
                        continue;
                    }
                    default:
                        if (singleLine != null) {
                            lines.push(singleLine);
                            singleLine = null;
                        }
                }

                switch (tagName) {
                    // ignores
                    case 'button':
                    case 'style':
                    case 'header':
                    case 'script':
                        continue;
                    case 'p':
                        lines.push(parseSingleLine(e) + '\n');
                        break;
                    case 'br':
                        lines.push('\n');
                        break;
                    case 'ul':
                    case 'ol': {
                        lines.push('');
                        let is_order = tagName == 'ol',
                            j = 1;
                        for (let item of e.childNodes) {
                            let pref = is_order ? `${j}. ` : `- `;
                            if (item instanceof HTMLLIElement) {
                                if (!isSingleLine(item)) {
                                    let item_lines = parseNode(item);
                                    for (let i = 0; i < item_lines.length; i++) {
                                        const l = item_lines[i].trim()
                                        if (l) {
                                            lines.push(`${i==0?pref:'    '}${item_lines[i]}`);
                                        }
                                    }
                                } else {
                                    lines.push(`${pref}${parseSingleLine(item)}`);
                                }
                                j++;
                            }
                        }
                        lines.push('');
                        break;
                    }
                    case 'pre': {
                        // debugger
                        lines.push('```');
                        lines.push(...(e.querySelector('code') || e).innerText.trim().split('\n'));
                        lines.push('```');
                        break;
                    }
                    case 'blockquote': {
                        lines.push('');
                        let item_lines = parseNode(e);
                        for (let i = 0; i < item_lines.length; i++) {
                            lines.push(`> ${item_lines[i]}`);
                        }
                        lines.push('');
                        break;
                    }
                    case 'table': {
                        if (e.classList.contains('syntaxhighlighter')) {
                            let content = e.querySelector('.code');
                            if (content) {
                                let lang = Array.from(e.classList).filter(x=>x!='syntaxhighlighter')[0] || '';
                                lines.push('```' + lang);
                                lines.push(...content.innerText.trim().split('\n'));
                                lines.push('```');
                                break;
                            }
                        }
                        lines.push('');
                        let head = e.querySelector('thead');
                        if (!head) {
                            console.warn('unknown table!');
                            // resolve body as normal tag
                            let body;
                            if (body = e.querySelector('tbody')) {
                                lines.push(...parseNode(body));
                            }
                            continue;
                        }
                        let head_line = '|',
                            sep_line = '|';
                        for (let h of head.querySelectorAll('th')) {
                            head_line += `${parseSingleLine(h)}|`;
                            sep_line += `--|`
                        }
                        lines.push(head_line);
                        lines.push(sep_line);
                        let body = e.querySelector('tbody');
                        for (let b of body.querySelectorAll('tr')) {
                            let line = '|';
                            for (let d of b.querySelectorAll('td')) {
                                line += `${parseSingleLine(d)}|`;
                            }
                            lines.push(line);
                        }
                        lines.push('');
                        break;
                    }
                    case 'hr':
                        lines.push('\n---\n');
                        break;
                    case 'img':
                        lines.push(`\n![][${getPicture(e.src)}]\n`);
                        break;
                    case 'figure': {
                        if (e.classList.contains('highlight')) {
                            let lang = e.classList[1] || '';
                            let code = e.querySelector('td.code pre');
                            if (code != null) {
                                lines.push('```' + lang);
                                lines.push(...code.innerText.trim().split('\n'));
                                lines.push('```');
                                break;
                            }
                        }
                        // fallthrough
                    }
                    case 'td': {
                        if (e.classList.contains('gutter')) continue;
                        // fallthrough
                    }
                    default: {
                        let r;
                        if (r = tagName.match(/h(\d+)/)) {
                            lines.push(`\n${'#'.repeat(Number(r[1]))} ${parseSingleLine(e)} \n`);
                        } else {
                            lines.splice(lines.length, 0, ...parseNode(e));
                        }
                    }
                }
            }
            if (singleLine != null) lines.push(singleLine);
        }
        return lines;
    }

    function findArticle() {
        let article = document.body.querySelector('article');
        if (article) return article;
        article = document.body.querySelector('div.markdown-body,div.mod-content');
        if (article) return article;
        article = document.body.querySelector('div.message_md_type'); // kanxue
        if (article) return article;
        let maxChild = 0, node = null;
        for (let n of document.querySelectorAll('h1')) {
            if (n.parentNode && n.parentNode.childElementCount >= maxChild) {
                node = n.parentNode;
            }
        }
        return node;
    }

    async function html2MD() {
        let article = findArticle();
        let title = document.querySelector('h1');
        let r = '';
        if (title) {
            r += `# ${parseSingleLine(title)}`;
        } else {
            r += `# ${document.title}`;
        }
        r += `\n${location.href}\n\n`;
        r += await nodeToMD(article);
        return r;
    }

    async function nodeToMD(node) {
        picMap.clear();
        let r = '';
        let lines = parseNode(node);
        for (let l of lines) {
            r += `${l}\n`;
        }

        let pics = await Promise.race([
            Promise.all(picMap.values()),
            new Promise((_, rj) => {
                console.log("waiting 10s for downloading pictures...", picMap.size);
                setTimeout(() => { rj('time out!'); }, 10000)
            })
        ]);
        r += '\n';
        for (let [key, url] of pics) {
            r += `[${key}]:${url}\n`;
        }
        return r;
    }

    unsafeWindow.md = nodeToMD;
    // unsafeWindow.__xhr = GM_xmlhttpRequest;
    // unsafeWindow._getpic = getPicture

    async function onClick() {
        let url = URL.createObjectURL(new Blob([await html2MD()], { type: 'text/plain' }));
        let a = document.createElement('a');
        a.download = `${document.title}.md`;
        a.href = url;
        document.body.append(a);
        a.click();
        a.remove();
    }

    GM_registerMenuCommand('下载 Markdown', () => {
        onClick();
    })

})();