// ==UserScript==
// @name         ALook 浏览器 脚本直装助手
// @namespace    http://tampermonkey.net/
// @version      1.4.6
// @description  还原ALook原生安装协议识别并安装user.js后缀的脚本。
// @author       Grok && Gemini
// @match        http*://*/*.user.js
// @match        http*://*/*.userscript.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526347/ALook%20%E6%B5%8F%E8%A7%88%E5%99%A8%20%E8%84%9A%E6%9C%AC%E7%9B%B4%E8%A3%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526347/ALook%20%E6%B5%8F%E8%A7%88%E5%99%A8%20%E8%84%9A%E6%9C%AC%E7%9B%B4%E8%A3%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const zhBase64 = {
        encode: function(input) {
            const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let output = "",
                chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
            input = this.utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) enc3 = enc4 = 64;
                else if (isNaN(chr3)) enc4 = 64;
                output += _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        },
        utf8_encode: function(_string) {
            return unescape(encodeURIComponent(
                Array.from(_string).map(char => {
                    const codePoint = char.codePointAt(0);
                    if (codePoint > 0x7F) {
                        if (codePoint <= 0xFFFF) {
                            return '\\u' + codePoint.toString(16).padStart(4, '0');
                        } else {
                            return '\\u' + (0xD800 + ((codePoint - 0x10000) >> 10)).toString(16) + '\\u' + (0xDC00 + ((codePoint - 0x10000) & 0x3FF)).toString(16);
                        }
                    }
                    return char;
                }).join('')
            ));
        }
    };

    const extractPureScript = (text) => {
        if (!text) return null;
        const startRegex = /\/\/\s*==UserScript==/i;
        const startMatch = text.match(startRegex);
        if (!startMatch) return null;

        let lines = text.split('\n');
        let lastValidLineIdx = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() !== "") {
                lastValidLineIdx = i;
                break;
            }
        }

        if (lastValidLineIdx === -1) return null;

        const lastLineContent = lines[lastValidLineIdx].trim();
        const isEndValid = lastLineContent === ");" || lastLineContent.endsWith("})();") || lastLineContent === "})();";

        if (isEndValid) {
            const cutText = lines.slice(0, lastValidLineIdx + 1).join('\n');
            return cutText.substring(startMatch.index);
        }
        return null;
    };

    const installScript = async () => {
        if (!window.via?.addon) return;

        try {
            let content = extractPureScript(document.body.innerText);
            if (!content) {
                const res = await fetch(location.href, {
                    cache: 'no-cache'
                });
                const remoteText = await res.text();
                content = extractPureScript(remoteText) || remoteText;
            }

            const metaMatch = content.match(/\/\/\s*==UserScript==([\s\S]*?)\/\/\s*==\/UserScript==/i);
            const metaRaw = metaMatch ? metaMatch[1] : '';
            const sensitiveKeywords = ['resource', 'require', 'connect'];
            let foundKeywords = [];
            sensitiveKeywords.forEach(kw => {
                const reg = new RegExp(`\\/\\/\\s*@${kw}\\s+`, 'i');
                if (reg.test(metaRaw)) foundKeywords.push(`@${kw}`);
            });

            if (foundKeywords.length > 0) {
                if (!confirm(`该脚本包含 ALook 可能不支持的指令：\n[ ${foundKeywords.join(', ')} ]\n\n建议检查兼容性。是否继续安装？`)) return;
            }

            const meta = {};
            metaRaw.split('\n').forEach(line => {
                const match = line.match(/\/\/\s*@(\w+)\s+(.*)/);
                if (match) {
                    const key = match[1].toLowerCase();
                    meta[key] = (meta[key] || []).concat(match[2].trim());
                }
            });

            const runAtMatch = metaRaw.match(/\/\/\s*@run-at\s+(.+)/i);
            const runatValue = (!runAtMatch || runAtMatch[1].trim() === 'document-start') ? 1 : 0;

            const config = {
                id: `userscript-${Date.now()}`,
                name: (meta.name || ['未命名脚本'])[0],
                author: (meta.author || ['未知作者'])[0],
                version: (meta.version || ['1.0'])[0],
                runat: runatValue,
                url: (meta.match || meta.include || ['*']).map(rule =>
                    rule.replace(/^https?:\/\//, 'http*://*').replace(/\*/g, '.*')
                ).join('@@'),
                code: btoa(unescape(encodeURIComponent(`(function(){\n\n${content}\n\n})();`)))
            };

            window.via.addon(zhBase64.encode(JSON.stringify(config)));
        } catch (e) {
            console.error(e);
        }
    };

    if (/\.(user|userscript)\.js(\?|$)/i.test(location.href)) {
        if (document.readyState === 'complete') installScript();
        else window.addEventListener('load', installScript, {
            once: true
        });
    }
})();