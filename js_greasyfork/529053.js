// ==UserScript==
// @name         快速复制版本信息
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  新增版本助手扩充工具
// @author       ai
// @match        https://www.books.com.tw/products/*
// @match        https://future-digi.com/index.php?route=product/*
// @match       https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.zhconvert.org
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/529053/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/529053/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        if (window.location.href.includes('https://www.books.com.tw/products/')) {
            handleBooksComTwPage();
        } else if (window.location.href.includes('https://future-digi.com/index.php?route=product/')) {
            handleFutureDigiPage();
        } else if (window.location.href.includes('https://book.douban.com/subject/')) {
            handleDoubanPage();
        }
    });

    function cleanString(str) {
        return str ? str.replace(/&nbsp;/g, '').trim() : "";
    }

function convertText(text, converter, callback) {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.zhconvert.org/convert",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            text: text,
            converter: converter
        }),
        onload: function(response) {
            try {
                const result = JSON.parse(response.responseText);
                callback(result.data.text);
            } catch (error) {
                console.error("解析繁化姬API返回失败: ", error);
                callback("繁化姬转换失败");
            }
        },
        onerror: function(error) {
            console.error("繁化姬API请求失败:", error);
            callback("繁化姬API请求失败");
        }
    });
}

    // 博客来
    function handleBooksComTwPage() {
        const prdContainer = document.querySelector('.mod.type02_p002.clearfix');
        if (prdContainer) {
            const infoText = document.createElement('span');
            infoText.style.cursor = 'pointer';
            infoText.style.color = '#0070c9';
            infoText.textContent = '📋';

            const h1Element = prdContainer.querySelector('h1');
            if (h1Element) {
                h1Element.appendChild(infoText);
            }

            infoText.addEventListener('click', function() {
                const metaDescription = document.querySelector('meta[name="description"]');
                const h2Element = prdContainer.querySelector('h2');

                if (metaDescription && h2Element) {
                    const content = metaDescription.getAttribute('content');
                    const bookInfo = extractBookInfo(content);

                    let messageDiv = h2Element.nextElementSibling;
                    if (!messageDiv || !messageDiv.classList.contains('copy-message')) {
                        messageDiv = document.createElement('div');
                        messageDiv.className = 'copy-message';
                        messageDiv.style.marginTop = '10px';
                        messageDiv.style.color = '#28a745';
                        h2Element.insertAdjacentElement('afterend', messageDiv);
                    }

                const targetDiv = document.querySelector('.type02_p003.clearfix');
                let Verbooks = '';
                if (targetDiv) {
                    const match = targetDiv.textContent.match(/本系列共(\d+)集/);
                    if (match && match[1]) {
                        Verbooks = match[1];
                    }
                }

                    if (bookInfo.publisher) {
                        convertText(bookInfo.title, "WikiSimplified", function(simplifiedTitle) {
                            convertText(bookInfo.publisher, "WikiSimplified", function(simplifiedPublisher) {
                                const textToCopy = `{Vertitle = '${bookInfo.title}'; Altertitle = '${simplifiedTitle}'; VerISBN = '${bookInfo.isbn}'; Verlabel = '${bookInfo.label}'; Verpages = '${bookInfo.pages}'; VerName = '${simplifiedPublisher}'; Verpublisher = '${bookInfo.publisher}'; Vertranslator = '${bookInfo.translator}'; Verdate = '${bookInfo.publishDate}'; Verpricing = '${bookInfo.price}'; Verbooks = '${Verbooks}'}`;
                                copyToClipboard(textToCopy);
                                messageDiv.textContent = '咪～版本信息已复制！';
                            });
                        });
                    } else {
                        messageDiv.textContent = '咪咕～未找到出版社，复制出错了！';
                    }
                } else {
                    alert('咪咕～未找到书籍信息，复制出错了！');
                }
            });
        }
    }

    function extractBookInfo(content) {
        const titleContent = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || "";
        const isbnMatch = content.match(/ISBN：(\d+)(?=，|｜|$)/);
        const labelElement = document.querySelector('.bd li a[href*="sys_puballb"]');
        const labelMatch = labelElement ? labelElement.textContent.trim() : '';
        const pagesMatch = content.match(/頁數：(\d+)(?=，|｜|$)/);
        const publisherMatch = content.match(/出版社：([^，]+)(?=，|｜|$)/);
        const translatorMatch = content.match(/譯者：([^，]+)(?=，|｜|$)/);
        const publishDateMatch = content.match(/出版日期：(.+?)(?=，|｜|$)/);
        const publishDate = publishDateMatch ? formatDate(publishDateMatch[1]) : "";
        const priceElement = document.querySelector('.prod_cont_b .price em, .prod_cont_b .price strong.price01 b');
        const price = priceElement ? priceElement.textContent : "";
        const cleanTitle = titleContent.replace(/ 全$| ?\((全)\)$| ?【限】$/, "").replace(/(\d+)$/, '($1)').replace(/\((0\d)\)/, (_, num) => `(${parseInt(num, 10)})`).replace(/(\S)\(/g, '$1 (');

        return {
            title: cleanTitle,
            isbn: cleanString(isbnMatch ? isbnMatch[1] : ""),
            label: labelMatch.replace(/\(限\)/, ''),
            pages: cleanString(pagesMatch ? pagesMatch[1] : ""),
            publisher: publisherMatch ? publisherMatch[1] : "",
            translator: cleanString(translatorMatch ? translatorMatch[1] : "").replace(/,/, "、"),
            publishDate: cleanString(publishDate),
            price: cleanString(price),
        };
    }

    // 未来数位
    function handleFutureDigiPage() {
        const titleElement = document.querySelector('title');
        const descriptionElement = document.querySelector('#tab-description');
        const buttonContainer = document.querySelector('.col-sm-4');

        if (titleElement && descriptionElement && buttonContainer) {
            const bookInfo = extractFutureDigiInfo(descriptionElement.innerHTML, titleElement.textContent);

            const infoText = document.createElement('span');
            infoText.style.cursor = 'pointer';
            infoText.style.color = '#0070c9';
            infoText.textContent = '📋';

            const h1Element = document.querySelector('.row .col-sm-4 h1');
            if (h1Element) {
                h1Element.appendChild(infoText);
            }

            infoText.addEventListener('click', function() {
                convertText(bookInfo.title, "WikiSimplified", function(simplifiedTitle) {
                    simplifiedTitle = simplifiedTitle.replace(/\(无修正\)/g, '').trim();
                    const textToCopy = `{Vertitle = '${bookInfo.title}'; Altertitle = '${simplifiedTitle}'; Verpages = '${bookInfo.pages}'; VerName = '${bookInfo.publisher}'; Verdate = '${bookInfo.publishDate}'; Verpricing = '${bookInfo.price}'}`;
                    copyToClipboard(textToCopy);

                    let messageDiv = h1Element.nextElementSibling;
                    if (!messageDiv || !messageDiv.classList.contains('copy-message')) {
                        messageDiv = document.createElement('div');
                        messageDiv.className = 'copy-message';
                        messageDiv.style.marginTop = '10px';
                        messageDiv.style.color = '#28a745';
                        h1Element.insertAdjacentElement('afterend', messageDiv);
                    }

                    messageDiv.textContent = '咪～版本信息已复制！';
                });
            });
        } else {
            console.error('咪咕～未找到书籍信息，复制出错了！');
        }
    }

    function extractFutureDigiInfo(descriptionHTML, titleText) {
        let publisher = "";
        const brandList = document.querySelector('div.col-sm-4 ul.list-unstyled');
        if (brandList) {
            const brandItem = Array.from(brandList.querySelectorAll('li'))
                .find(li => li.textContent.trim().startsWith("品  牌："));

            if (brandItem) {
                const brandLink = brandItem.querySelector('a');
                if (brandLink) {
                    publisher = brandLink.textContent.trim();
                }
            }
        }
        const publishDateRegex = /發售日：([\d年月日/-]+)<br>/;
        const priceRegex = /售　價：(\d+)[^<]*(<br|<\/)/;
        const pagesRegex = /頁數：([^<]*)(<br|<\/)/;

        const publishDateMatch = descriptionHTML.match(publishDateRegex);
        const publishDate = publishDateMatch ? formatDate(publishDateMatch[1].trim()) : '';

        const priceMatch = descriptionHTML.match(priceRegex);
        const price = priceMatch ? priceMatch[1].trim() : '';

        const pagesMatch = descriptionHTML.match(pagesRegex);
        const pages = pagesMatch ? pagesMatch[1].trim().replace(/\s+/g, '').replace('含', '').replace('（', '(').replace('）', ')').replace('頁(', '(').replace(/頁$/, '') : '';

        let processedTitle = titleText.trim();
        if (processedTitle.endsWith(" 無修正")) {
            processedTitle = processedTitle.replace(" 無修正", "(無修正)");
        }

        return {
            title: processedTitle,
            publisher: publisher,
            publishDate: cleanString(publishDate),
            price: cleanString(price),
            pages: cleanString(pages)
        };
    }

    // 豆瓣
function handleDoubanPage() {
    const wrapper = document.querySelector('#wrapper');
    if (!wrapper) return;

    const titleSpan = document.querySelector('h1 span');
    if (titleSpan) {
        const infoText = document.createElement('span');
        infoText.style.cursor = 'pointer';
        infoText.style.color = '#0070c9';
        infoText.style.marginLeft = '8px';
        infoText.textContent = '📋';
        titleSpan.appendChild(infoText);

        infoText.addEventListener('click', function () {
            const bookInfo = extractDoubanInfo();

            let messageDiv = document.querySelector('.copy-message');
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.className = 'copy-message';
                messageDiv.style.marginTop = '10px';
                messageDiv.style.color = '#28a745';
                messageDiv.style.fontSize = '12px';
                titleSpan.insertAdjacentElement('afterend', messageDiv);
            }

            if (bookInfo.publisher || bookInfo.publisher2) {
                convertText(bookInfo.title, "WikiTraditional", function (traditionalTitle) {
                            const textToCopy = `{Vertitle = '${bookInfo.title}'; Altertitle = '${traditionalTitle}'; VerName = '${bookInfo.publisher}'; Vercnpublisher = '${bookInfo.cnpublisher}'; VerISBN = '${bookInfo.isbn}'; Verdate = '${bookInfo.publishDate}'; Verlabel = '${bookInfo.label}'; Vertranslator = '${bookInfo.translator}'; Verpricing = '${bookInfo.price}'; Verpages = '${bookInfo.pages}';}`;
                            copyToClipboard(textToCopy);
                            messageDiv.textContent = '咪～版本信息已复制！';
                        });
            } else {
                messageDiv.textContent = '咪咕～未找到出品方或出版社，复制出错了！';
            }
        });
    }
}

function extractDoubanInfo() {
    const titleContent = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || "";
    const cleanTitle = titleContent.replace(/(\d+)$/, '($1)').replace(/\((0\d)\)/, (_, num) => `(${parseInt(num, 10)})`).replace(/(\S)\(/g, '$1 (');
    let publisher = "", cnpublisher = "", translator = "", price = "", pages = "",isbn = "",label = "",publishDate = "";

    const infoElement = document.querySelector('#info');
    if (infoElement) {
        const infoText = infoElement.innerText.split("\n");
        for (const line of infoText) {
            if (line.includes("出品方:")) {
                publisher = line.replace("出品方:", "").trim();
            }
            if (line.includes("出版社:")) {
                cnpublisher = line.replace("出版社:", "").trim();
            }
            if (cnpublisher === "中信出版集团") {
                cnpublisher = "中信出版社";
                }
            if (line.includes("译者:")) {
                translator = line.replace("译者:", "").trim();
            }
            if (line.includes("定价:") || line.includes("价格:")) {
                price = line.replace(/(定价:|价格:)/, "").replace(/\s|元/g, "");
                price = parseFloat(price).toFixed(2);
            }
            if (line.includes("页数:")) {
                pages = line.replace("页数:", "").trim();
            }
            if (line.includes("ISBN:")) {
                isbn = line.replace("ISBN:", "").trim();
            }
if (line.includes("丛书:")) {
    label = line.replace("丛书:", "").trim();
    if (label === publisher || cleanTitle.includes(label)) {
        label = "";
    }
}
if (line.includes("出版年:")) {
    publishDate = line.replace("出版年:", "").trim();

    if (publishDate.includes("-") && publishDate.split("-").length === 2) {
        publishDate += "-01";
    }
}
        }
    }

    return {
        title: cleanTitle,
        publisher: publisher || cnpublisher,
        cnpublisher: cnpublisher,
        translator: translator,
        price: price,
        pages: pages,
        isbn: isbn,
        label: label,
        publishDate: formatDate(publishDate),
    };
}

    // 格式化日期
function formatDate(dateString) {
    const chineseDateRegex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
    const slashDateRegex = /(\d{4})\/(\d{1,2})\/(\d{1,2})/;
    const dashDateRegex = /(\d{4})-(\d{1,2})-(\d{1,2})/;

    let match = dateString.match(chineseDateRegex) ||
                dateString.match(slashDateRegex) ||
                dateString.match(dashDateRegex);

    if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return dateString;
}

    // 输出到剪贴板
    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

})();