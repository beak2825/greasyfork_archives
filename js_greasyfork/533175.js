// ==UserScript==
// @name         tokiDownloader
// @namespace    https://github.com/crossSiteKikyo/tokiDownloader
// @version      0.0.1
// @description  북토끼, 뉴토끼, 마나토끼 다운로더
// @author       hehaho
// @match        https://*.com/webtoon/*
// @match        https://*.com/novel/*
// @match        https://*.net/comic/*
// @icon         https://i.namu.wiki/i/VLM5tYIVQKb8_ULcWJYsKvbV7swtlZE93vkQQiZei0LiwrbyDQHvSEup8Hnr2tTXAUtBjS0srw1OnSjU540TpAapRswupu3nE_JE_A9d3o1YXX5sqRL-qRyzkjBY6X3ss-gzOVryhlC4YmnhpFLhyQ.webp
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533175/tokiDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/533175/tokiDownloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let site = '뉴토끼'; // 예시
    let protocolDomain = 'https://newtoki350.com'; // 예시

    const currentURL = document.URL;
    if (currentURL.match(/^https:\/\/booktoki[0-9]+.com\/novel\/[0-9]+/)) {
        site = "북토끼"; protocolDomain = currentURL.match(/^https:\/\/booktoki[0-9]+.com/)[0];
    }
    else if (currentURL.match(/^https:\/\/newtoki[0-9]+.com\/webtoon\/[0-9]+/)) {
        site = "뉴토끼"; protocolDomain = currentURL.match(/^https:\/\/newtoki[0-9]+.com/)[0];
    }
    else if (currentURL.match(/^https:\/\/manatoki[0-9]+.net\/comic\/[0-9]+/)) {
        site = "마나토끼"; protocolDomain = currentURL.match(/^https:\/\/manatoki[0-9]+.net/)[0];
    }
    else {
        return;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomSleep(min = 2000, max = 4000) {
        const randomMs = Math.floor(Math.random() * (max - min + 1)) + min;
        return sleep(randomMs);
    }

    async function tokiDownload(startIndex, lastIndex) {
        try {
            const zip = new JSZip();
            let list = Array.from(document.querySelector('.list-body').querySelectorAll('li')).reverse();

            if (startIndex) {
                while (true) {
                    let num = parseInt(list[0].querySelector('.wr-num').innerText);
                    if (num < startIndex) list.shift();
                    else break;
                }
            }
            if (lastIndex) {
                while (true) {
                    let num = parseInt(list.at(-1).querySelector('.wr-num').innerText);
                    if (lastIndex < num) list.pop();
                    else break;
                }
            }

            const firstName = list[0].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
            const lastName = list.at(-1).querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
            const rootFolder = `${site}  ${firstName} ~ ${lastName}`;

            const iframe = document.createElement('iframe');
            iframe.width = 600;
            iframe.height = 600;
            document.querySelector('.content').prepend(iframe);

            const waitIframeLoad = (url) => {
                return new Promise((resolve) => {
                    iframe.addEventListener('load', () => resolve());
                    iframe.src = url;
                });
            };

            if (site == "북토끼") {
                for (let i = 0; i < list.length; i++) {
                    console.clear();
                    console.log(`${i + 1}/${list.length} 진행중`);

                    const num = list[i].querySelector('.wr-num').innerText.padStart(4, '0');
                    const fileName = list[i].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
                    const src = list[i].querySelector('a').href;

                    await waitIframeLoad(src);
                    await randomSleep();

                    const iframeDocument = iframe.contentWindow.document;
                    const fileContent = iframeDocument.querySelector('#novel_content').innerText;

                    zip.file(`${num} ${fileName}.txt`, fileContent);
                }
            }
            else if (site == "뉴토끼" || site == "마나토끼") {
                const fetchAndAddToZip = (src, num, folderName, j, extension, listLen) => {
                    return new Promise((resolve) => {
                        fetch(src).then(response => {
                            response.blob().then(blob => {
                                zip.folder(`${num} ${folderName}`).file(`${folderName} image${j.toString().padStart(4, '0')}${extension}`, blob);
                                console.log(`${j + 1}/${listLen}진행완료`);
                                resolve();
                            })
                        })
                    });
                };
                for (let i = 0; i < list.length; i++) {
                    const num = list[i].querySelector('.wr-num').innerText.padStart(4, '0');
                    const folderName = list[i].querySelector('a').innerHTML.replace(/<span[\s\S]*?\/span>/g, '').trim();
                    const src = list[i].querySelector('a').href;
                    console.clear();
                    console.log(`${i + 1}/${list.length} ${folderName} 진행중`);

                    await waitIframeLoad(src);
                    await randomSleep();

                    const iframeDocument = iframe.contentWindow.document;
                    let imgLists = Array.from(iframeDocument.querySelectorAll('.view-padding div img'));

                    for (let j = 0; j < imgLists.length;) {
                        if (imgLists[j].checkVisibility() === false)
                            imgLists.splice(j, 1);
                        else
                            j++;
                    }

                    console.log(`이미지 ${imgLists.length}개 감지`);
                    let promiseList = [];
                    for (let j = 0; j < imgLists.length; j++) {
                        let src = imgLists[j].outerHTML;
                        src = `${protocolDomain}${src.match(/\/data[^"]+/)[0]}`;
                        const extension = src.match(/\.[a-zA-Z]+$/)[0];
                        promiseList.push(fetchAndAddToZip(src, num, folderName, j, extension, imgLists.length));
                    }
                    await Promise.all(promiseList);
                    console.log(`${i + 1}/${list.length} ${folderName} 완료`);
                }
            }

            iframe.remove();

            console.log(`다운로드중입니다... 잠시 기다려주세요`);
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = rootFolder;
            link.click();
            URL.revokeObjectURL(link.href);
            link.remove();
            console.log(`다운완료`);
        } catch (error) {
            alert(`tokiDownload 오류발생: ${site}\n${currentURL}\n` + error);
            console.error(error);
        }
    }

    GM_registerMenuCommand('전체 다운로드', () => tokiDownload());
    GM_registerMenuCommand('N번째 회차부터', () => {
        const startPageInput = prompt('몇번째 회차부터 저장할까요?', 1);
        tokiDownload(startPageInput);
    });
    GM_registerMenuCommand('N번째 회차부터 N번째 까지', () => {
        const startPageInput = prompt('몇번째 회차부터 저장할까요?', 1);
        const endPageInput = prompt('몇번째 회차까지 저장할까요?', 2);
        tokiDownload(startPageInput, endPageInput);
    });
})();
