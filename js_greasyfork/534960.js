// ==UserScript==
// @name        Manga DW holoearth.com
// @namespace   Manga_DW_holoearth_com_Nyako
// @match       https://holoearth.com/en/alt/holonometria/manga/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      https://t.me/Nyako_TW
// @description 05.05.2025, 00:43:33
// @license     Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/534960/Manga%20DW%20holoearthcom.user.js
// @updateURL https://update.greasyfork.org/scripts/534960/Manga%20DW%20holoearthcom.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

src1 = document.createElement("script");
src1.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
src2 = document.createElement("script");
src2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js");
document.getElementsByTagName("head")[0].appendChild(src1);
document.getElementsByTagName("head")[0].appendChild(src2);

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

function get_all_images() {
  all_images = document.getElementsByClassName("manga-detail__swiper-slide");
  urls_dw = [];
  for (const one_image of all_images) {
    if (one_image.getElementsByTagName("img").length>0){
        url_dw = one_image.getElementsByTagName("img")[0].src;
        urls_dw.push(url_dw);
    }
  }
  name_file = document.title + ".zip";
  downloadFilesAsZip(urls_dw, name_file);
}

GM_registerMenuCommand('DW', async () => get_all_images());