// ==UserScript==
// @name         Via Css 检验
// @namespace    https://viayoo.com/
// @version      3.3
// @license      MIT
// @description  用于检验Via的Adblock规则中的Css隐藏规则是否有错误，支持自动运行、菜单操作、WebView版本检测、规则数量统计及W3C CSS校验
// @author       Copilot & Grok & nobody
// @run-at       document-end
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @connect      jigsaw.w3.org
// @require      https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify-css.js
// @require      https://cdn.jsdelivr.net/npm/css-tree@2.3.1/dist/csstree.min.js
// @downloadURL https://update.greasyfork.org/scripts/529260/Via%20Css%20%E6%A3%80%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/529260/Via%20Css%20%E6%A3%80%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adblockPseudoClasses = [
        ':contains',
        ':has-text',
        ':matches-css',
        ':matches-css-after',
        ':matches-css-before',
        ':matches-path',
        ':matches-property',
        ':min-text-length',
        ':nth-ancestor',
        ':remove',
        ':style',
        ':upward',
        ':watch-attr',
        ':xpath',
        ':-abp-contains',
        ':-abp-properties',
        ':if',
        ':if-not'
    ];

    function getCssFileUrl() {
        const currentHost = window.location.hostname;
        return `http://${currentHost}/via_inject_blocker.css`;
    }

    function formatCssWithJsBeautify(rawCss) {
        try {
            const formatted = css_beautify(rawCss, {
                indent_size: 2,
                selector_separator_newline: true
            });
            console.log('格式化后的CSS:', formatted);
            return formatted;
        } catch (error) {
            console.error(`CSS格式化失败：${error.message}`);
            return null;
        }
    }

    function getWebViewVersion() {
        const ua = navigator.userAgent;
        console.log('User-Agent:', ua);
        const patterns = [
            /Chrome\/([\d.]+)/i,
            /wv\).*?Version\/([\d.]+)/i,
            /Android.*?Version\/([\d.]+)/i
        ];

        for (let pattern of patterns) {
            const match = ua.match(pattern);
            if (match) {
                console.log('匹配到的版本:', match[1]);
                return match[1];
            }
        }
        return null;
    }

    function checkPseudoClassSupport(cssContent) {
        const pseudoClasses = [
            { name: ':hover', minVersion: 37 },
            { name: ':focus', minVersion: 37 },
            { name: ':active', minVersion: 37 },
            { name: ':nth-child', minVersion: 37 },
            { name: ':not', minVersion: 37 },
            { name: ':where', minVersion: 88 },
            { name: ':is', minVersion: 88 },
            { name: ':has', minVersion: 105 }
        ];
        const webviewVersion = getWebViewVersion();
        let unsupportedPseudo = [];

        if (!webviewVersion) {
            return "无法检测到WebView或浏览器内核版本";
        }

        const versionNum = parseFloat(webviewVersion);
        console.log('检测到的WebView版本:', versionNum);

        pseudoClasses.forEach(pseudo => {
            if (cssContent.includes(pseudo.name) && versionNum < pseudo.minVersion) {
                unsupportedPseudo.push(`${pseudo.name} (需要版本 ${pseudo.minVersion}+)`);
            }
        });

        return unsupportedPseudo.length > 0 ?
            `当前版本(${webviewVersion})不支持以下伪类：${unsupportedPseudo.join(', ')}` :
            `当前版本(${webviewVersion})支持所有标准伪类`;
    }

    function splitCssAndAdblockRules(formattedCss) {
        const lines = formattedCss.split('\n');
        const standardCss = [];
        const adblockRules = [];

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            if (line.startsWith('##') || adblockPseudoClasses.some(pseudo => line.includes(pseudo))) {
                adblockRules.push(line);
            } else {
                standardCss.push(line);
            }
        });

        return {
            standardCss: standardCss.join('\n'),
            adblockRules
        };
    }

    function countCssRules(formattedCss) {
        if (!formattedCss) return 0;

        try {
            const ast = csstree.parse(formattedCss);
            let count = 0;

            csstree.walk(ast, (node) => {
                if (node.type === 'Rule' && node.prelude && node.prelude.type === 'SelectorList') {
                    const selectors = node.prelude.children.size;
                    count += selectors;
                }
            });
            console.log('计算得到的标准CSS规则总数:', count);
            return count;
        } catch (e) {
            console.error('标准CSS规则计数失败:', e);
            return 0;
        }
    }

    function getCssPerformance(totalCssRules) {
        if (totalCssRules <= 5000) {
            return '✅CSS规则数量正常，可以流畅运行';
        } else if (totalCssRules <= 7000) {
            return '❓CSS规则数量较多，可能会导致设备运行缓慢';
        } else if (totalCssRules < 9999) {
            return '⚠️CSS规则数量接近上限，可能明显影响设备性能';
        } else {
            return '🆘CSS规则数量过多，建议调整订阅规则';
        }
    }

    function truncateErrorLine(errorLine, maxLength = 150) {
        return errorLine.length > maxLength ? errorLine.substring(0, maxLength) + "..." : errorLine;
    }

    async function fetchAndFormatCss() {
        const url = getCssFileUrl();
        console.log('尝试获取CSS文件:', url);
        try {
            const response = await fetch(url, {
                cache: 'no-store'
            });
            if (!response.ok) throw new Error(`HTTP状态: ${response.status}`);
            const text = await response.text();
            console.log('原始CSS内容:', text);
            return text;
        } catch (error) {
            console.error(`获取CSS失败：${error.message}`);
            return null;
        }
    }

    function translateErrorMessage(englishMessage) {
        const translations = {
            "Identifier is expected": "需要标识符",
            "Unexpected end of input": "输入意外结束",
            "Selector is expected": "需要选择器",
            "Invalid character": "无效字符",
            "Unexpected token": "意外的标记",
            '"]" is expected': '需要 "]"',
            '"{" is expected': '需要 "{"',
            'Unclosed block': '未闭合的块',
            'Unclosed string': '未闭合的字符串',
            'Property is expected': "需要属性名",
            'Value is expected': "需要属性值",
            "Percent sign is expected": "需要百分号 (%)",
            'Attribute selector (=, ~=, ^=, $=, *=, |=) is expected': '需要属性选择器运算符（=、~=、^=、$=、*=、|=）',
            'Semicolon is expected': '需要分号 ";"',
            'Number is expected': '需要数字',
            'Colon is expected': '需要冒号 ":"'
        };
        return translations[englishMessage] || englishMessage;
    }

    async function validateCss(rawCss, formattedCss, isAutoRun = false) {
        if (!formattedCss) return;

        const {
            standardCss,
            adblockRules
        } = splitCssAndAdblockRules(formattedCss);
        console.log('标准CSS:', standardCss);
        console.log('Adguard/Ublock规则:', adblockRules);

        let hasError = false;
        const errors = [];
        const allLines = formattedCss.split('\n');
        const totalStandardCssRules = countCssRules(standardCss);
        const cssPerformance = getCssPerformance(totalStandardCssRules);
        const pseudoSupport = checkPseudoClassSupport(standardCss);

        if (standardCss) {
            try {
                csstree.parse(standardCss, {
                    onParseError(error) {
                        hasError = true;
                        const standardCssLines = standardCss.split('\n');
                        const errorLine = standardCssLines[error.line - 1] || "无法提取错误行";
                        const originalLineIndex = allLines.indexOf(errorLine);
                        const truncatedErrorLine = truncateErrorLine(errorLine);
                        const translatedMessage = translateErrorMessage(error.message);

                        errors.push(`
CSS解析错误：
- 位置：第 ${originalLineIndex + 1} 行
- 错误信息：${translatedMessage}
- 错误片段：${truncatedErrorLine}
                        `.trim());
                    }
                });
            } catch (error) {
                hasError = true;
                const translatedMessage = translateErrorMessage(error.message);
                errors.push(`标准CSS解析失败：${translatedMessage}`);
            }
        }

        adblockRules.forEach((rule, index) => {
            const originalLineIndex = allLines.indexOf(rule);
            let errorMessage = null;

            const matchedPseudo = adblockPseudoClasses.find(pseudo => rule.includes(pseudo));
            if (matchedPseudo) {
                errorMessage = `非标准伪类 ${matchedPseudo}（AdGuard/uBlock 扩展语法，不支持）`;
            } else if (rule.startsWith('##') && !rule.match(/^##[\w\s\[\]\.,:()]+$/)) {
                errorMessage = '无效的 Adblock 元素隐藏规则';
            }

            if (errorMessage) {
                hasError = true;
                const truncatedRule = truncateErrorLine(rule);
                errors.push(`
CSS解析错误：
- 位置：第 ${originalLineIndex + 1} 行
- 错误信息：${errorMessage}
- 错误片段：${truncatedRule}
                `.trim());
            }
        });

        const resultMessage = `
CSS验证结果：
- 规则总数：${totalStandardCssRules} (标准CSS) + ${adblockRules.length} (Adguard/Ublock拓展规则)
- 性能评价：${cssPerformance}
- 伪类支持：${pseudoSupport}
${errors.length > 0 ? '\n发现错误：\n' + errors.join('\n\n') : '\n未发现语法错误'}
        `.trim();

        if (isAutoRun && errors.length > 0) {
            alert(resultMessage);
        } else if (!isAutoRun) {
            alert(resultMessage);
        }
    }

    async function validateCssWithW3C(cssText) {
        const validatorUrl = "https://jigsaw.w3.org/css-validator/validator";
        try {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: validatorUrl,
                    data: `text=${encodeURIComponent(cssText)}&profile=css3&output=json`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    },
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log("W3C Validator返回的JSON:", result);
                            if (result && result.cssvalidation) {
                                const errors = result.cssvalidation.errors || [];
                                const warnings = result.cssvalidation.warnings || [];
                                if (errors.length > 0) {
                                    const errorDetails = errors.map(err => {
                                        const line = err.line || "未知行号";
                                        const message = err.message || "未知错误";
                                        const context = err.context || "无上下文";
                                        return `行 ${line}: ${message} (上下文: ${context})`;
                                    }).join("\n\n");
                                    alert(`W3C校验发现 ${errors.length} 个CSS错误：\n\n${errorDetails}`);
                                } else if (warnings.length > 0) {
                                    const warningDetails = warnings.map(warn => {
                                        const line = warn.line || "未知行号";
                                        const message = warn.message || "未知警告";
                                        return `行 ${line}: ${message}`;
                                    }).join("\n\n");
                                    alert(`W3C校验未发现错误，但有 ${warnings.length} 个警告：\n\n${warningDetails}`);
                                } else {
                                    alert("W3C CSS校验通过，未发现错误或警告！");
                                }
                            } else {
                                alert("W3C校验服务返回无效结果，请查看控制台！");
                            }
                            resolve();
                        } catch (e) {
                            console.error("W3C校验解析失败：", e);
                            alert("W3C校验解析失败，请检查控制台日志！");
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        console.error("W3C校验请求失败：", error);
                        alert(`W3C校验请求失败：${error.statusText || '未知错误'} (状态码: ${error.status || '未知'})`);
                        reject(error);
                    }
                });
            });
        } catch (e) {
            console.error("W3C校验请求失败：", e);
            alert(`W3C校验请求失败：${e.message}，请检查控制台日志！`);
        }
    }

    async function autoRunCssValidation() {
        const rawCss = await fetchAndFormatCss();
        if (rawCss) {
            const formattedCss = formatCssWithJsBeautify(rawCss);
            if (formattedCss) {
                validateCss(rawCss, formattedCss, true);
            }
        }
    }

    async function checkCssFileWithW3C() {
        const cssFileUrl = getCssFileUrl();
        try {
            const response = await fetch(cssFileUrl, {
                method: 'GET',
                cache: 'no-store'
            });
            if (!response.ok) {
                alert(`无法加载CSS文件: ${cssFileUrl} (状态码: ${response.status})`);
                return;
            }

            const cssText = await response.text();
            if (!cssText.trim()) {
                alert("CSS文件为空！");
                return;
            }

            console.log("要校验的CSS内容：", cssText);
            await validateCssWithW3C(cssText);
        } catch (err) {
            console.error("获取CSS文件失败：", err);
            alert(`获取CSS文件失败：${err.message}，请检查控制台日志！`);
        }
    }

    function initializeScript() {
        const isAutoRunEnabled = GM_getValue("autoRun", true);

        GM_registerMenuCommand(isAutoRunEnabled ? "关闭自动运行" : "开启自动运行", () => {
            GM_setValue("autoRun", !isAutoRunEnabled);
            alert(`自动运行已${isAutoRunEnabled ? "关闭" : "开启"}！`);
        });

        GM_registerMenuCommand("验证CSS文件（本地）", async () => {
            const rawCss = await fetchAndFormatCss();
            if (rawCss) {
                const formattedCss = formatCssWithJsBeautify(rawCss);
                if (formattedCss) {
                    validateCss(rawCss, formattedCss, false);
                }
            }
        });

        GM_registerMenuCommand("验证CSS文件（W3C）", () => {
            checkCssFileWithW3C();
        });

        if (isAutoRunEnabled) {
            autoRunCssValidation();
        }
    }

    initializeScript();
})();