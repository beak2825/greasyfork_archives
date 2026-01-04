// ==UserScript==
// @name         USACO Enhancements
// @namespace    https://connorcode.com
// @version      0.3
// @description  Adds some enhancements to USACO problems.
// @author       Connor Slade
// @match        http://www.usaco.org/index.php?page=viewproblem*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485469/USACO%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/485469/USACO%20Enhancements.meta.js
// ==/UserScript==

(async () => {
    // == Problem year and date in page title ==
    let problemDate = document.querySelector('.panel h2').innerText;
    let problemName = document.querySelector('.panel h2:nth-child(2)').innerText.split('. ')[1];

    let date = problemDate.match(/USACO (\d{4}) (.*) Contest/);
    document.title = `USACO - ${problemName} (${date[2].substring(0, 3)} ${date[1]})`;

    // == Persistent language selector ==
    let selector = document.querySelector("select[name='language']");

    let lastLang = await GM.getValue('lastLang');
    if (lastLang != undefined) selector.value = lastLang;

    selector.addEventListener('change', async () => {
        console.log(selector.value);
        await GM.setValue("lastLang", selector.value);
    });

    // == Copy codeblocks to clipboard ==
    document.querySelectorAll('pre').forEach(block => {
        block.style.position = 'relative';

        let copy = document.createElement("button");
        copy.style.position = 'absolute';
        copy.style.top = 0;
        copy.style.right = 0;
        copy.innerText = 'Copy';
        block.appendChild(copy);
        copy.addEventListener('click', () => {
            let text = block.innerText;
            GM.setClipboard(text.substring(0, text.length - 4));
        });
    });
})();