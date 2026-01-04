// ==UserScript==
// @name               Syosetu Download with original format
// @name:zh-TW         Syosetu 下載相同排版的文本
// @name:ja            Syosetu 文章を元のままにダウンロードする
// @description        As Title
// @description:zh-TW  如題
// @description:ja     ご覧の通り
// @version            0.52
// @namespace          Lalala
// @author             Lalala
// @match              *://*.syosetu.com/*/
// @match              *://*.syosetu.com/*/*/
// @icon               https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/455495/Syosetu%20Download%20with%20original%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/455495/Syosetu%20Download%20with%20original%20format.meta.js
// ==/UserScript==

const EXTENSION = 'md';
const BATCH_COUNT = 1;
const DELAY = 200;
const SEPARATION_LINE = `\n${'—'.repeat(30)}\n`;

var isPhone = /Mobile|Android|iPhone/i.test(navigator.userAgent);

const style = `.download_button, .download_progress {
    width: auto;
    height: 30px;
    font-size: 17px;
    font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei New', 'STHeiti Light', sans-serif;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}`;

const button_style = `.download_button {
    margin-top: 5px;
    margin-bottom: 5px;
}`;

(function() {
    'use strict';
    console.log('排版一致下載 Loaded');

    GM_addStyle(style);
    GM_addStyle(button_style);

    const url = window.location.href;
    const novelMenuRegExp = /^https?:\/\/\w+\.syosetu\.com\/\w+\/?$/;
    const chapterRegExp = /^https?:\/\/\w+\.syosetu\.com\/\w+\/\d+\/?$/;

    if(novelMenuRegExp.test(url)) {
        const novel_honbun = document.querySelector("#novel_honbun");

        /* 短篇或列表 */
        if(novel_honbun) {
            addDownloadButton('chapter');
        }else {
            addAllChaptersDownloadProgress();
            addDownloadButton('all');
            addDownloadButton('all as one file');
        }

    }
    if(chapterRegExp.test(url)) {
        addDownloadButton('chapter');
    }
})();

/* Initialize */

function addAllChaptersDownloadProgress() {
    const novelTitle = document.querySelector('.novel_title') || document.querySelector('.novel_subtitle');
    const p = document.createElement('p');
    p.classList.add('download_progress');
    novelTitle.insertAdjacentElement('afterend', p);
}

function addDownloadButton(mode) {
    const novelTitle = document.querySelector('.novel_title') || document.querySelector('.novel_subtitle');
    const button = document.createElement('button');
    button.classList.add('download_button');
    novelTitle.insertAdjacentElement('afterend', button);

    switch (mode) {
        case 'chapter':
            button.innerText = 'Download';
            button.addEventListener("click", function() {
                downloadChapter();
            })
            break;
        case 'all':
            button.innerText = 'Download All Chapters (each file separately)';
            button.addEventListener("click", async function() {
                await downloadAllChapters();
            })
            break;
        case 'all as one file':
            button.innerText = 'Download All Chapters as one file';
            button.addEventListener("click", async function() {
                await downloadAllChaptersAsOneFile();
            })
            break;
    }
}

/* Content */

function downloadAsBlob(filename, contents) {
    const blob = new Blob(contents, { type: 'data:text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}

function getChapterContent(d) {
    const doc = d || document;

    /*
        novel_p: 前補充
        novel_honbun: 小說本體
        novel_a: 後補充
    */
    const novel_p = doc.querySelector("div#novel_p");
    const novel_honbun = doc.querySelectorAll("div#novel_honbun > p");
    const novel_a = doc.querySelector("div#novel_a");

    const content = [
        ...(novel_p? [...novel_p.children, SEPARATION_LINE] : []),
        ...Array.from(novel_honbun),
        ...(novel_a? [SEPARATION_LINE, ...novel_a.children] : []),
    ];

    /*
        - 消除p和br標籤，保留ruby
        - 獲取特殊字符，並替換
    */
    const processed_text = [];
    for (let i of content) {
        if (typeof i != 'string'){
            i = i.outerHTML;
        }
        processed_text.push(
            i.replace(/<p.*?>|<\/p>|<br>/g, "")
                .replace(/&[^&;]+;/g, (match) => {
                    const element = document.createElement("div");
                    element.innerHTML = match;
                    return element.innerText;
                })
        );
    }
    
    const number = doc.querySelector('div#novel_no');
    const title = doc.querySelector(".novel_title");
    return {
        chapter_number: number? /^(\d+)\//.exec(number.outerText)[1] : null,
        chapter_name: title? title.outerText.trim() : doc.querySelector(".novel_subtitle").outerText.trim(),
        text: processed_text.join('\n'),
    };
}

var downloading = 0;
var total = 0;

async function getChaptersHTML() {
    const requests = [];
    const chapter_list = isPhone ? document.querySelectorAll(".novel_sublist > ul > li > a") : document.querySelectorAll(".subtitle > a");

    total = chapter_list.length;

    for (let i = 0; i < chapter_list.length; i++) {
        const chapter = chapter_list[i];

        console.log(chapter);
    
        const request = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "get",
                url: chapter,
                onload: function(res) {
                    let parser = new DOMParser();
                    let parsedHtml = parser.parseFromString(res.responseText, 'text/html');
                    resolve(parsedHtml);
                },
                onerror: function(err) {
                    console.error(err);
                    reject(err);
                }
            });
        });

        requests.push(request);

        downloading += 1;
        updateProgress();

        if ((i + 1) % BATCH_COUNT === 0) {
            await new Promise(resolve => setTimeout(resolve, DELAY));
        }
    }

    downloading = total = 0;
    updateProgress();

    const results = await Promise.all(requests);
    return results;
}

/* Download */ 

function downloadChapter() {
    const {chapter_number, chapter_name, text} = getChapterContent();
    const filename = (chapter_number? `${chapter_number}. ` : '') + `${chapter_name}.${EXTENSION}`;
    downloadAsBlob(filename, [text]);
}

async function downloadAllChapters() {
    if (downloading || total) return;
    const html_list = await getChaptersHTML();
    for (const key of Object.keys(html_list)) {
        const html = html_list[key];
        const {chapter_number, chapter_name, text} = getChapterContent(html);
        downloadAsBlob(`${chapter_number}. ${chapter_name}.${EXTENSION}`, [text]);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

async function downloadAllChaptersAsOneFile() {
    if (downloading || total) return;
    const title = document.querySelector('.novel_title').innerText;
    const html_list = await getChaptersHTML();

    const chapterPromises = Object.values(html_list).map(async function(html) {
    const { _, chapter_name, text } = getChapterContent(html);
        return `# ${chapter_name}\n\n${text}\n\n`;
    });
    const contents = await Promise.all(chapterPromises);
    downloadAsBlob(`${title}.${EXTENSION}`, contents);
}

function updateProgress() {
    const p = document.querySelector('p.download_progress');
    const content = total > 0 ? `${downloading}/${total}`: '';
    p.textContent = content;
}