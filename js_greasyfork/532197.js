// ==UserScript==
// @name     Загрузчик изображений с shikimori.one
// @name:en     Shikimori.one images downloader
// @namespace   shikimori_one_dwimg_Nyako
// @match       https://shikimori.one/clubs/*/images
// @grant       none
// @version     0.1b
// @author      https://t.me/Nyako_TW
// @license     Apache License 2.0
// @description 08.04.2025, 12:36:52
// @description:en 08.04.2025, 12:36:52
// @downloadURL https://update.greasyfork.org/scripts/532197/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%81%20shikimorione.user.js
// @updateURL https://update.greasyfork.org/scripts/532197/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%81%20shikimorione.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

button = document.createElement("button");
button.innerHTML = "Скачать всё";
button.setAttribute("onclick", "dw_all_club_images()");
document.getElementsByClassName("b-breadcrumbs")[0].appendChild(button);

src1 = document.createElement("script");
src1.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
src2 = document.createElement("script");
src2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js");
document.getElementsByTagName("head")[0].appendChild(src1);
document.getElementsByTagName("head")[0].appendChild(src2);

const fileUrls = [
    'https://example.com/file1.txt',
    'https://example.com/file2.jpg',
    'https://example.com/file3.pdf'
];

async function fetchFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.blob();
}

async function downloadFilesAsZip(urls, name_file) {
    const zip = new JSZip();
    try {
        const filePromises = urls.map(async (url, index) => {
            const blob = await fetchFile(url);
            const fileName = url.split('/').pop().split("?")[0];
            zip.file(fileName, blob);
        });
        await Promise.all(filePromises);
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, name_file);
        console.log('ZIP-архив успешно создан и сохранен.');
    } catch (error) {
        console.error('Ошибка при создании ZIP-архива:', error);
    }
}

function dw_all_club_images () {
  all_images = document.getElementsByClassName("b-image");
  urls_dw = [];
  for (const one_image of all_images) {
        url_dw = one_image.href;
        urls_dw.push(url_dw);
  }
  name_file = window.location.pathname.split("/")[2] + ".zip";
  downloadFilesAsZip(urls_dw, name_file);
}

unsafeWindow.dw_all_club_images = dw_all_club_images;