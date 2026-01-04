// ==UserScript==
// @name         Bitrix24 Better <code>
// @namespace    https://crm.globaldrive.ru/
// @version      2024-02-22-2
// @description  Native Bitrix24 CODE tag is broken and doesnt have hightlighting at all, so it is very hard to share sources in tasks. This script is fixing this issue.
// @author       Dzorogh
// @match        https://crm.globaldrive.ru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491551/Bitrix24%20Better%20%3Ccode%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/491551/Bitrix24%20Better%20%3Ccode%3E.meta.js
// ==/UserScript==

(function() {
    const addScript = (src) => {
        const e = document.createElement('script');
        e.src = src;
        document.head.appendChild(e);
        return e;
    }

    const addStyle = (src) => {
        const e = document.createElement('link');
        e.rel = "stylesheet";
        e.href = src;
        document.head.appendChild(e);
        return e;
    }

    const css = `
          .forum-code {
            border-radius: 0;
          }
          .forum-code td {
             padding: 0;
           }
        `;

    const languages = [
        'html',
        '1c',
        'apache',
        'bash',
        'css',
        'diff',
        'ini',
        'java',
        'javascript',
        'json',
        'less',
        'markdown',
        'nginx',
        'php',
        'scss',
        'sql',
        'typescript',
        'xml',
        'yaml',
    ];


    (function Init() {
        const selectors = document.querySelectorAll('.forum-code pre');
        for (let selector of selectors) {
            // wrap code in real <code> tag to make work highlightAll
            selector.innerHTML = `<code>${selector.innerHTML}</code>`;
        }

        const mainStyle = addStyle('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css');
        const mainScript = addScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');

        mainScript.onload = () => {
            languages.forEach((language) => {
                addScript(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/${language}.min.js`);
            })

            hljs.highlightAll();

            GM_addStyle(css);
        }
    })()


})();
