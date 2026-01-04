// ==UserScript==
// @name         spoiled competitive programming
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Parse AtCoder problem statement into sections and create Anki CSV
// @author       Harui (totally helped by GPT-4o)
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496760/spoiled%20competitive%20programming.user.js
// @updateURL https://update.greasyfork.org/scripts/496760/spoiled%20competitive%20programming.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create buttons for Japanese
    const openMarkdownButtonJa = document.createElement('button');
    openMarkdownButtonJa.textContent = '新しいタブで日本語のMarkdownを開く';
    openMarkdownButtonJa.style.position = 'fixed';
    openMarkdownButtonJa.style.left = '10px';
    openMarkdownButtonJa.style.bottom = '145px';
    openMarkdownButtonJa.style.zIndex = '1000';
    openMarkdownButtonJa.style.padding = '10px';
    openMarkdownButtonJa.style.backgroundColor = '#4CAF50';
    openMarkdownButtonJa.style.color = 'white';
    openMarkdownButtonJa.style.border = 'none';
    openMarkdownButtonJa.style.borderRadius = '5px';
    openMarkdownButtonJa.style.cursor = 'pointer';

    const openHtmlButtonJa = document.createElement('button');
    openHtmlButtonJa.textContent = '新しいタブで日本語のHTMLを開く';
    openHtmlButtonJa.style.position = 'fixed';
    openHtmlButtonJa.style.left = '10px';
    openHtmlButtonJa.style.bottom = '100px';
    openHtmlButtonJa.style.zIndex = '1000';
    openHtmlButtonJa.style.padding = '10px';
    openHtmlButtonJa.style.backgroundColor = '#4CAF50';
    openHtmlButtonJa.style.color = 'white';
    openHtmlButtonJa.style.border = 'none';
    openHtmlButtonJa.style.borderRadius = '5px';
    openHtmlButtonJa.style.cursor = 'pointer';

    // Append the buttons to the body
    document.body.appendChild(openMarkdownButtonJa);
    document.body.appendChild(openHtmlButtonJa);

    // Event listener for open Markdown button (Japanese)
    openMarkdownButtonJa.addEventListener('click', () => {
        const markdownContent = htmlToMarkdown(extractHtml('ja'));

        // Open the Markdown content in a new tab
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write('<pre>' + markdownContent + '</pre>');
        newTab.document.close();
    });

    // Event listener for open HTML button (Japanese)
    openHtmlButtonJa.addEventListener('click', () => {
        const htmlContent = htmlToAnkiHtml(extractHtml('ja'));

        // Open the HTML content in a new tab
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(htmlContent);
        newTab.document.close();
    });

    // Create buttons and style them
    const openMarkdownButtonEn = document.createElement('button');
    openMarkdownButtonEn.textContent = 'Open English Markdown in New Tab';
    openMarkdownButtonEn.style.position = 'fixed';
    openMarkdownButtonEn.style.left = '10px';
    openMarkdownButtonEn.style.bottom = '55px';
    openMarkdownButtonEn.style.zIndex = '1000';
    openMarkdownButtonEn.style.padding = '10px';
    openMarkdownButtonEn.style.backgroundColor = '#4CAF50';
    openMarkdownButtonEn.style.color = 'white';
    openMarkdownButtonEn.style.border = 'none';
    openMarkdownButtonEn.style.borderRadius = '5px';
    openMarkdownButtonEn.style.cursor = 'pointer';

    const openHtmlButtonEn = document.createElement('button');
    openHtmlButtonEn.textContent = 'Open English HTML in New Tab';
    openHtmlButtonEn.style.position = 'fixed';
    openHtmlButtonEn.style.left = '10px';
    openHtmlButtonEn.style.bottom = '10px';
    openHtmlButtonEn.style.zIndex = '1000';
    openHtmlButtonEn.style.padding = '10px';
    openHtmlButtonEn.style.backgroundColor = '#4CAF50';
    openHtmlButtonEn.style.color = 'white';
    openHtmlButtonEn.style.border = 'none';
    openHtmlButtonEn.style.borderRadius = '5px';
    openHtmlButtonEn.style.cursor = 'pointer';

    // Append the buttons to the body
    document.body.appendChild(openMarkdownButtonEn);
    document.body.appendChild(openHtmlButtonEn);

    // Create button for Anki CSV download
    const downloadCsvButton = document.createElement('button');
    downloadCsvButton.textContent = 'Anki用CSVをダウンロード';
    downloadCsvButton.style.position = 'fixed';
    downloadCsvButton.style.left = '10px';
    downloadCsvButton.style.bottom = '190px';
    downloadCsvButton.style.zIndex = '1000';
    downloadCsvButton.style.padding = '10px';
    downloadCsvButton.style.backgroundColor = '#4CAF50';
    downloadCsvButton.style.color = 'white';
    downloadCsvButton.style.border = 'none';
    downloadCsvButton.style.borderRadius = '5px';
    downloadCsvButton.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(downloadCsvButton);

    // Event listener for download CSV button
    downloadCsvButton.addEventListener('click', () => {
        const htmlContent = htmlToAnkiHtml(extractHtml('ja'));
        const csvContent = generateAnkiCsv(htmlContent);

        // Create a blob from the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anki.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Function to extract parts and remove Katex, returning HTML
    function extractHtml(lang) {
        const parts = document.querySelectorAll(`span.lang-${lang}`);
        const problemTitle = document.title;

        let htmlContent = `<h1>${problemTitle}</h1>\n\n`;

        parts.forEach(part => {
            // Clone the part to avoid modifying the original document
            const clone = part.cloneNode(true);

            // Remove "Copy" buttons
            const copyButtons = clone.querySelectorAll('.btn-copy, .btn-pre, .div-btn-copy');
            copyButtons.forEach(button => button.remove());

            // Remove Katex elements
            const katexElements = clone.querySelectorAll('.katex');
            katexElements.forEach(katex => {
                const tex = katex.querySelector('.katex-mathml annotation');
                if (tex) {
                    const textNode = document.createTextNode(tex.textContent);
                    katex.parentNode.replaceChild(textNode, katex);
                }
            });

            // Append HTML content
            htmlContent += clone.outerHTML + '\n\n';
        });

        return htmlContent;
    }

    // Function to generate Anki CSV
    function generateAnkiCsv(htmlContent) {
        const problemId = window.location.pathname.split('/')[2];
        const problemAlpha = window.location.pathname.split('/')[4].split('_')[1];
        const problemTitle = document.querySelector('title').textContent.trim();
        const problemName = `${problemId.toUpperCase()}_${problemAlpha.toUpperCase()} ${problemTitle}`;
        const problemUrl = window.location.href;

        // Replace double quotes with double double quotes
        const escapedHtmlContent = htmlContent.replace(/"/g, '""');

        const csvContent = `#separator:tab\n#html:true\n"${problemName}"\t"<a href=""${problemUrl}"">${problemUrl}</a>"\t"${escapedHtmlContent}"`;
        return csvContent;
    }


    // Event listener for open Markdown button (English)
    openMarkdownButtonEn.addEventListener('click', () => {
        const markdownContent = htmlToMarkdown(extractHtml('en'));

        // Open the Markdown content in a new tab
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write('<pre>' + markdownContent + '</pre>');
        newTab.document.close();
    });

    // Event listener for open HTML button (English)
    openHtmlButtonEn.addEventListener('click', () => {
        const htmlContent = extractHtml('en');

        // Open the HTML content in a new tab
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(htmlContent);
        newTab.document.close();
    });

    // Function to convert HTML to Markdown
    function htmlToMarkdown(html) {
        // Simple conversion rules
        const rules = [
            { regex: /<h3>(.*?)<\/h3>/g, replacement: '\n### $1\n' },
            { regex: /<h2>(.*?)<\/h2>/g, replacement: '\n## $1\n' },
            { regex: /<h1>(.*?)<\/h1>/g, replacement: '\n# $1\n' },
            { regex: /<p>(.*?)<\/p>/g, replacement: '$1\n' },
            { regex: /<ul>(.*?)<\/ul>/gs, replacement: '$1' },
            { regex: /<li>(.*?)<\/li>/g, replacement: '- $1' },
            { regex: /<pre.*?>(.*?)<\/pre>/gs, replacement: '\n\n``` \n$1\n```' },
            { regex: /<var>(.*?)<\/var>/g, replacement: '`$1`' },
            { regex: /<div.*?>(.*?)<\/div>/gs, replacement: '$1' },
            { regex: /<span.*?>(.*?)<\/span>/g, replacement: '$1' },
            { regex: /<section.*?>(.*?)<\/section>/gs, replacement: '$1' },
            { regex: /<hr>/g, replacement: '---' },
            { regex: /<br>/g, replacement: '\n' }
        ];

        // Apply rules
        let markdown = html;
        rules.forEach(rule => {
            markdown = markdown.replace(rule.regex, rule.replacement);
        });

        // Remove any remaining HTML tags
        markdown = markdown.replace(/<\/?[^>]+(>|$)/g, "");

        return markdown.trim();
    }

    // Function to convert HTML to Anki HTML
    function htmlToAnkiHtml(html) {
        // Simple conversion rules
        const rules = [
            { regex: /<h3>(.*?)<\/h3>/g, replacement: '\n<h3>$1</h3>\n' },
            { regex: /<h2>(.*?)<\/h2>/g, replacement: '\n<h2>$1</h2>\n' },
            { regex: /<h1>(.*?)<\/h1>/g, replacement: '\n<h1>$1</h1>\n' },
            { regex: /<p>(.*?)<\/p>/g, replacement: '<p>$1</p>\n' },
            { regex: /<ul>(.*?)<\/ul>/gs, replacement: '$1' },
            { regex: /<li>(.*?)<\/li>/g, replacement: '<li>$1</li>' },
            { regex: /<pre.*?>(.*?)<\/pre>/gs, replacement: '\n\n<pre>\n$1\n</pre>' },
            { regex: /<var>(.*?)<\/var>/g, replacement: '<var>$1</var>' },
            { regex: /<div.*?>(.*?)<\/div>/gs, replacement: '<div>$1</div>' },
            { regex: /<span.*?>(.*?)<\/span>/g, replacement: '<span><anki-mathjax>$1</anki-mathjax></span>' },
            { regex: /<section.*?>(.*?)<\/section>/gs, replacement: '<section>$1</section>' },
            { regex: /<hr>/g, replacement: '<hr>' },
            { regex: /<br>/g, replacement: '<br>' },
            { regex: /\$(.*?)\$/g, replacement: '$1' } // Convert TeX to Anki TeX
        ];

        // Apply rules
        let ankiHtml = html;
        rules.forEach(rule => {
            ankiHtml = ankiHtml.replace(rule.regex, rule.replacement);
        });

        return ankiHtml.trim();
    }
})();