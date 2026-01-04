// ==UserScript==
// @name         组卷网试卷提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从组卷网提取试卷内容并导出为Word，支持图片处理
// @icon         https://toolb.cn/favicon/zujuan.xkw.com
// @author       pansoul
// @license      MIT
// @match        https://zujuan.xkw.com/zujuan/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      staticzujuan.xkw.com
// @connect      cdn*.xkw.com
// @downloadURL https://update.greasyfork.org/scripts/542406/%E7%BB%84%E5%8D%B7%E7%BD%91%E8%AF%95%E5%8D%B7%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542406/%E7%BB%84%E5%8D%B7%E7%BD%91%E8%AF%95%E5%8D%B7%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
        .xkw-exporter {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: #4285f4;
            color: #fff;
            padding: 10px 18px 10px 42px; /* 预留左侧 icon 空间 */
            border-radius: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            font-family: Arial, sans-serif;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.25s;
        }
        .xkw-exporter::before {
            content: '';
            position: absolute;
            left: 12px;
            top: 50%;
            width: 18px;
            height: 18px;
            transform: translateY(-50%);
            background: url('https://toolb.cn/favicon/zujuan.xkw.com') no-repeat center/contain;
        }
        .xkw-exporter:hover {
            background: #3367d6;
        }
        .xkw-exporter-panel {
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 9998;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            padding: 20px 22px 18px;
            width: 330px;
            display: none;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
        }
        .xkw-exporter-panel h3 {
            margin: 0 0 12px 0;
            font-size: 18px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .xkw-exporter-panel button {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 10px 0;
            background: #4285f4;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 15px;
            cursor: pointer;
            transition: background 0.25s;
        }
        .xkw-exporter-panel button:hover {
            background: #3367d6;
        }
        .xkw-exporter-panel .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
        }
        .xkw-exporter-panel .options {
            margin: 10px 0;
        }
        .xkw-exporter-panel .options label {
            display: block;
            margin: 5px 0;
        }
        .xkw-exporter-progress {
            position: fixed;
            top: 200px;
            right: 20px;
            z-index: 9997;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
    `);


    window.addEventListener('load', function() {
        setTimeout(initExporter, 1000);
    });

    function initExporter() {

        const exporterBtn = document.createElement('div');
        exporterBtn.className = 'xkw-exporter';
        exporterBtn.textContent = '导出试卷';
        exporterBtn.addEventListener('click', toggleExporterPanel);
        document.body.appendChild(exporterBtn);


        const exporterPanel = document.createElement('div');
        exporterPanel.className = 'xkw-exporter-panel';
        exporterPanel.innerHTML = `
            <span class="close">&times;</span>
            <h3>试卷导出工具</h3>
            <div class="options">
                <label><input type="checkbox" id="download-images" checked> 下载图片(Word格式)</label>
                <label><input type="checkbox" id="format-equations" checked> 格式化公式</label>
            </div>
            <button id="export-word">导出为Word</button>
        `;
        document.body.appendChild(exporterPanel);


        const progressDiv = document.createElement('div');
        progressDiv.className = 'xkw-exporter-progress';
        progressDiv.innerHTML = '处理中...';
        document.body.appendChild(progressDiv);


        exporterPanel.querySelector('.close').addEventListener('click', function() {
            exporterPanel.style.display = 'none';
        });


        document.getElementById('export-word').addEventListener('click', function() {
            exportPaper('word');
        });
    }

    function toggleExporterPanel() {
        const panel = document.querySelector('.xkw-exporter-panel');
        panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
    }

    function showProgress(message) {
        const progress = document.querySelector('.xkw-exporter-progress');
        progress.textContent = message;
        progress.style.display = 'block';
    }

    function hideProgress() {
        const progress = document.querySelector('.xkw-exporter-progress');
        progress.style.display = 'none';
    }


    function extractPaperContent() {
        showProgress('正在提取试卷内容...');


        const downloadImages = document.getElementById('download-images').checked;
        const formatEquations = document.getElementById('format-equations').checked;


        const paperTitle = document.querySelector('.paper-title .main-title')?.textContent.trim() || '未命名试卷';


        const paperContent = {
            title: paperTitle,
            sections: [],
            options: {
                includeAnswers: false,
                includeExplanations: false,
                downloadImages,
                formatEquations
            }
        };


        let questionGlobalIndex = 1;


        const questionTypes = document.querySelectorAll('.ques-type');

        questionTypes.forEach((typeSection, typeIndex) => {
            const currentSection = {
                type: '',
                index: '',
                questions: []
            };

            const questions = typeSection.querySelectorAll('.ques-item');

            questions.forEach((question, qIndex) => {

                let qContent = question.querySelector('.exam-item__cnt')?.innerHTML.trim() || '';


                if (!qContent) {
                    return;
                }


                const qNumber = `${questionGlobalIndex}.`;
                questionGlobalIndex++;



                {
                    const temp = document.createElement('div');
                    temp.innerHTML = qContent;
                    const idx = temp.querySelector('.quesindex');
                    if (idx) idx.parentNode.removeChild(idx);
                    qContent = temp.innerHTML;
                }


                qContent = qContent.replace(/^\s*(?:<[^>]+>\s*)*\d+\s*[.．、]?\s*/, '');


                const options = [];
                const optionsTable = question.querySelector('table[name="optionsTable"]');
                if (optionsTable) {
                    const optionRows = optionsTable.querySelectorAll('tr');
                    optionRows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        cells.forEach(cell => {
                            options.push(cell.innerHTML);
                        });
                    });


                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = qContent;
                    const contentOptionsTable = tempDiv.querySelector('table[name="optionsTable"]');
                    if (contentOptionsTable) {
                        contentOptionsTable.parentNode.removeChild(contentOptionsTable);
                    }
                    qContent = tempDiv.innerHTML;
                }

                const images = [];
                if (downloadImages) {
                    const imgElements = question.querySelectorAll('img');
                    imgElements.forEach(img => {
                        if (img.src && !img.src.startsWith('data:')) {
                            images.push({
                                src: img.src,
                                alt: img.alt || '',
                                width: img.width || 0,
                                height: img.height || 0
                            });
                        }
                    });
                }

                // 不再获取答案和解析
                const answer = '';
                const explanation = '';

                currentSection.questions.push({
                    number: qNumber,
                    content: qContent,
                    options: options,
                    answer: answer,
                    explanation: explanation,
                    images: images
                });
            });

            if (currentSection.questions.length > 0) {
                const typeName = typeSection.querySelector('.questypename')?.textContent.trim() || `题型${typeIndex + 1}`;
                const rawTypeIndex = typeSection.querySelector('.questypeindex b')?.textContent.trim() || `${typeIndex + 1}、`;
                const typeIndex2 = rawTypeIndex.replace(/^\d+[、\.]\s*\d+[、\.]/, match => {
                    const firstNum = match.match(/^\d+/)[0];
                    return `${firstNum}、`;
                });

                currentSection.type = typeName;
                currentSection.index = typeIndex2;

                paperContent.sections.push(currentSection);
            }
        });

        hideProgress();
        return paperContent;
    }


    function paperToHTML(paperContent) {
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${paperContent.title}</title>
            <style>
                @page {
                    size: A4;
                    margin: 2cm;
                }
                body {
                    font-family: "SimSun", "Microsoft YaHei", Arial, sans-serif;
                    line-height: 1.6;
                    font-size: 12pt;
                    width: 21cm;
                    margin: 0 auto;
                }
                .paper-title {
                    text-align: center;
                    font-size: 18pt;
                    font-weight: bold;
                    margin: 20px 0 30px 0;
                }
                .section-title {
                    font-weight: bold;
                    margin: 20px 0 15px 0;
                    font-size: 14pt;
                }
                .question {
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }
                .question-content {
                    margin-bottom: 8px;
                }
                .options {
                    margin-left: 2em;
                }
                .option {
                    margin-bottom: 5px;
                }
                .answer {
                    color: #d81e06;
                    margin-top: 8px;
                    font-weight: bold;
                }
                .explanation {
                    color: #1e88e5;
                    margin-top: 8px;
                    border-left: 3px solid #1e88e5;
                    padding-left: 10px;
                }
                img {
                    max-width: 90%;
                    display: block;
                    margin: 10px auto;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                }
                @media print {
                    .page-break {
                        page-break-before: always;
                    }
                    body {
                        font-size: 12pt;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="paper-title">${paperContent.title}</div>
        `;


        const nonEmptySections = paperContent.sections.filter(section => section.questions && section.questions.length > 0);

        nonEmptySections.forEach((section, sectionIndex) => {
            html += `<div class="section-title">${section.index} ${section.type}</div>`;

            section.questions.forEach((question, qIndex) => {
                html += `<div class="question">`;
                html += `<div class="question-content">${question.number} ${cleanHTML(question.content)}</div>`;

                if (question.options.length > 0) {
                    html += `<div class="options">`;
                    const optionRows = [];
                    for (let i = 0; i < question.options.length; i += 2) {
                        const row = [question.options[i]];
                        if (i + 1 < question.options.length) {
                            row.push(question.options[i + 1]);
                        }
                        optionRows.push(row);
                    }

                    html += `<table border="0" cellpadding="5" cellspacing="0" style="border:none;">`;
                    optionRows.forEach(row => {
                        html += `<tr>`;
                        row.forEach(option => {
                            html += `<td style="border:none;">${cleanHTML(option)}</td>`;
                        });
                        if (row.length === 1) {
                            html += `<td style="border:none;"></td>`;
                        }
                        html += `</tr>`;
                    });
                    html += `</table>`;
                    html += `</div>`;
                }

                // 不再显示答案和解析

                html += `</div>`;

                if ((qIndex + 1) % 10 === 0 && qIndex < section.questions.length - 1) {
                    html += `<div class="page-break"></div>`;
                }
            });

            if (sectionIndex < nonEmptySections.length - 1) {
                html += `<div class="page-break"></div>`;
            }
        });

        html += `
        <script>

        function fixMathFormulas() {
            // 替换常见的数学符号
            const mathSymbols = {
                '\\\\frac{': '(', // 分数开始
                '}': ')', // 括号结束
                '\\\\sqrt{': '√(', // 平方根
                '\\\\le': '≤', // 小于等于
                '\\\\ge': '≥', // 大于等于
                '\\\\neq': '≠', // 不等于
                '\\\\alpha': 'α', // 希腊字母
                '\\\\beta': 'β',
                '\\\\gamma': 'γ',
                '\\\\delta': 'δ',
                '\\\\pi': 'π',
                '\\\\infty': '∞', // 无穷
                '\\\\times': '×', // 乘号
                '\\\\div': '÷', // 除号
                '\\\\pm': '±', // 正负号
                '\\\\cdot': '·', // 点乘
                '\\\\ldots': '...', // 省略号
                '\\\\equiv': '≡', // 恒等于
                '\\\\cong': '≅', // 全等于
                '\\\\approx': '≈', // 约等于
                '\\\\triangle': '△', // 三角形
                '\\\\angle': '∠', // 角
                '\\\\perp': '⊥', // 垂直
                '\\\\parallel': '∥', // 平行
                '\\\\sim': '∼', // 相似
                '\\\\partial': '∂', // 偏导数
                '\\\\int': '∫', // 积分
                '\\\\sum': '∑', // 求和
                '\\\\prod': '∏', // 求积
                '\\\\lim': 'lim', // 极限
                '\\\\rightarrow': '→', // 箭头
                '\\\\leftarrow': '←',
                '\\\\Rightarrow': '⇒',
                '\\\\Leftarrow': '⇐',
                '\\\\Leftrightarrow': '⇔',
                '\\\\leftrightarrow': '↔',
                '\\\\subset': '⊂', // 集合
                '\\\\supset': '⊃',
                '\\\\subseteq': '⊆',
                '\\\\supseteq': '⊇',
                '\\\\cup': '∪',
                '\\\\cap': '∩',
                '\\\\in': '∈',
                '\\\\notin': '∉',
                '\\\\emptyset': '∅',
                '\\\\mathbb{R}': 'ℝ', // 特殊集合
                '\\\\mathbb{Z}': 'ℤ',
                '\\\\mathbb{N}': 'ℕ',
                '\\\\mathbb{Q}': 'ℚ',
                '\\\\mathbb{C}': 'ℂ'
            };

            // 替换数学符号
            const elements = document.querySelectorAll('.question-content, .option, .answer, .explanation');
            elements.forEach(el => {
                let html = el.innerHTML;
                for (const [symbol, replacement] of Object.entries(mathSymbols)) {
                    const regex = new RegExp(symbol.replace(/\\/g, '\\\\'), 'g');
                    html = html.replace(regex, replacement);
                }
                el.innerHTML = html;
            });

            // 处理上下标
            const superscriptRegex = /<sup>(.*?)<\/sup>/g;
            const subscriptRegex = /<sub>(.*?)<\/sub>/g;
            elements.forEach(el => {
                let html = el.innerHTML;
                html = html.replace(superscriptRegex, '^($1)');
                html = html.replace(subscriptRegex, '_($1)');
                el.innerHTML = html;
            });

            // 移除知识点链接和提示
            const knowledgeLinks = document.querySelectorAll('.knowledge-point a, a[class*="knowledge"], [class*="知识点"]');
            knowledgeLinks.forEach(link => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });

            // 移除知识点提示
            const knowledgePoints = document.querySelectorAll('.knowledge-point, [class*="knowledge"], [class*="知识点"]');
            knowledgePoints.forEach(point => {
                if (point.parentNode) {
                    point.parentNode.removeChild(point);
                }
            });

            // 移除题型编号中的重复
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach(title => {
                title.textContent = title.textContent.replace(/^(\d+)[、\.]\s*\d+[、\.]/, '$1、');
            });

            // 移除题目编号中的重复
            const questionContents = document.querySelectorAll('.question-content');
            questionContents.forEach(content => {
                const firstPart = content.innerHTML.split(' ')[0];
                if (firstPart && firstPart.match(/^\d+\./)) {
                    content.innerHTML = content.innerHTML.replace(/^(\d+)\.\s*\d+\./, '$1.');
                }
            });
        }

        // 页面加载完成后执行
        window.addEventListener('load', fixMathFormulas);
        </script>
        </body>
        </html>
        `;

        return html;
    }


    function paperToText(paperContent) {
        let text = `${paperContent.title}\n\n`;


        const nonEmptySections = paperContent.sections.filter(section => section.questions && section.questions.length > 0);

        nonEmptySections.forEach(section => {

            let sectionTitle = section.index + ' ' + section.type;
            sectionTitle = sectionTitle.replace(/^(\d+)[、\.]\s*\d+[、\.]/, '$1、');

            text += `${sectionTitle}\n\n`;

            section.questions.forEach(question => {

                let questionNumber = question.number;
                questionNumber = questionNumber.replace(/^(\d+)[.．、]\s*\d+[.．、]/, '$1.');

                text += `${questionNumber} ${stripHTML(question.content)}\n`;

                if (question.options.length > 0) {
                    question.options.forEach((option, index) => {
                        text += `   ${stripHTML(option)}\n`;
                    });
                }

                // 不再显示答案和解析

                text += `\n`;
            });

            text += `\n`;
        });

        return text;
    }


    async function processImages(paperContent) {
        if (!paperContent.options.downloadImages) return paperContent;

        showProgress('正在处理图片...');

        const imagePromises = [];
        const imageMap = new Map();


        paperContent.sections.forEach(section => {
            section.questions.forEach(question => {
                question.images.forEach(img => {
                    if (!imageMap.has(img.src)) {
                        imageMap.set(img.src, null);
                        const promise = fetchImageAsBase64(img.src)
                            .then(base64 => {
                                imageMap.set(img.src, base64);
                            })
                            .catch(err => {
                                console.error(`Failed to fetch image: ${img.src}`, err);
                            });
                        imagePromises.push(promise);
                    }
                });
            });
        });


        await Promise.all(imagePromises);


        paperContent.sections.forEach(section => {
            section.questions.forEach(question => {

                const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
                question.content = question.content.replace(imgRegex, (match, src) => {
                    const base64 = imageMap.get(src);
                    if (base64) {
                        return match.replace(src, base64);
                    }
                    return match;
                });


                question.options = question.options.map(option => {
                    return option.replace(imgRegex, (match, src) => {
                        const base64 = imageMap.get(src);
                        if (base64) {
                            return match.replace(src, base64);
                        }
                        return match;
                    });
                });


                // 不再处理答案和解析中的图片
            });
        });

        hideProgress();
        return paperContent;
    }


    function fetchImageAsBase64(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: function(response) {
                    try {
                        let binary = '';
                        const bytes = new Uint8Array(response.response);
                        const len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }


                        let mimeType = 'image/jpeg';
                        if (url.endsWith('.png')) {
                            mimeType = 'image/png';
                        } else if (url.endsWith('.gif')) {
                            mimeType = 'image/gif';
                        } else if (url.endsWith('.svg')) {
                            mimeType = 'image/svg+xml';
                        }

                        const base64 = 'data:' + mimeType + ';base64,' + btoa(binary);
                        resolve(base64);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }


    async function exportPaper(format) {
        let paperContent = extractPaperContent();

        if (format === 'word' && paperContent.options.downloadImages) {
            paperContent = await processImages(paperContent);
        }

        const fileName = `${paperContent.title}_${new Date().toISOString().slice(0, 10)}`;

        showProgress(`正在导出为${format.toUpperCase()}格式...`);

        switch (format) {
            case 'word':
                const html = paperToHTML(paperContent);

                const blob = new Blob([html], {type: 'text/html'});
                const url = URL.createObjectURL(blob);


                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.doc`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);


                setTimeout(() => URL.revokeObjectURL(url), 100);
                break;

            case 'txt':
                const text = paperToText(paperContent);
                const txtBlob = new Blob([text], {type: 'text/plain'});
                const txtUrl = URL.createObjectURL(txtBlob);

                const txtLink = document.createElement('a');
                txtLink.href = txtUrl;
                txtLink.download = `${fileName}.txt`;
                document.body.appendChild(txtLink);
                txtLink.click();
                document.body.removeChild(txtLink);

                setTimeout(() => URL.revokeObjectURL(txtUrl), 100);
                break;

            case 'json':
                const json = JSON.stringify(paperContent, null, 2);
                const jsonBlob = new Blob([json], {type: 'application/json'});
                const jsonUrl = URL.createObjectURL(jsonBlob);

                const jsonLink = document.createElement('a');
                jsonLink.href = jsonUrl;
                jsonLink.download = `${fileName}.json`;
                document.body.appendChild(jsonLink);
                jsonLink.click();
                document.body.removeChild(jsonLink);

                setTimeout(() => URL.revokeObjectURL(jsonUrl), 100);
                break;
        }

        hideProgress();
        alert(`已成功导出为${format.toUpperCase()}格式！`);
    }


    function cleanHTML(html) {
        if (!html) return '';

        return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }


    function stripHTML(html) {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }


    function formatEquations(html) {
        if (!html) return '';

        return html;
    }
})();