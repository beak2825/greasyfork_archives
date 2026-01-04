// ==UserScript==
// @name         掘金小册导出
// @namespace    https://github.com/TheKonka
// @version      0.0.1
// @description  掘金小册一键导出
// @author       konka
// @match        https://juejin.cn/book/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480022/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480022/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

var svgDownloadBtn = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="24" width="24"
viewBox="0 0 477.867 477.867" style="fill:%color;" xml:space="preserve">
<g>
	 <path d="M443.733,307.2c-9.426,0-17.067,7.641-17.067,17.067v102.4c0,9.426-7.641,17.067-17.067,17.067H68.267
			 c-9.426,0-17.067-7.641-17.067-17.067v-102.4c0-9.426-7.641-17.067-17.067-17.067s-17.067,7.641-17.067,17.067v102.4
			 c0,28.277,22.923,51.2,51.2,51.2H409.6c28.277,0,51.2-22.923,51.2-51.2v-102.4C460.8,314.841,453.159,307.2,443.733,307.2z"/>
</g>
<g>
	 <path d="M335.947,295.134c-6.614-6.387-17.099-6.387-23.712,0L256,351.334V17.067C256,7.641,248.359,0,238.933,0
			 s-17.067,7.641-17.067,17.067v334.268l-56.201-56.201c-6.78-6.548-17.584-6.36-24.132,0.419c-6.388,6.614-6.388,17.099,0,23.713
			 l85.333,85.333c6.657,6.673,17.463,6.687,24.136,0.031c0.01-0.01,0.02-0.02,0.031-0.031l85.333-85.333
			 C342.915,312.486,342.727,301.682,335.947,295.134z"/>
</g>
</svg>`;

const getSectionList = async (bookID = $nuxt.context.params.id) => {
   const response = await fetch('https://api.juejin.cn/booklet_api/v1/booklet/get', {
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({ booklet_id: bookID }),
      method: 'POST',
   });
   const { data } = await response.json();
   return data.sections;
};

const getMarkdownContent = async (sectionID) => {
   const response = await fetch('https://api.juejin.cn/booklet_api/v1/section/get', {
      headers: {
         'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ section_id: sectionID }),
      method: 'POST',
   });
   const { data } = await response.json();
   return data.section;
};

async function saveFile(index, name, content) {
   var blob = new Blob([content], { type: 'text/plain' });

   var a = document.createElement('a');
   a.href = window.URL.createObjectURL(blob);
   a.download = index + '、' + name + '.md';

   document.body.appendChild(a);
   a.click();

   document.body.removeChild(a);
}
var btnId = 'download-juejin-book-monkey';
function createCustomBtn() {
   const newBtn = document.createElement('a');
   newBtn.innerHTML = svgDownloadBtn.replace('%color', 'black');
   newBtn.className = 'custom-btn ';
   newBtn.id = btnId;
   newBtn.setAttribute('target', '_blank');
   newBtn.setAttribute('style', 'cursor: pointer;padding:8px;z-index: 999;');
   newBtn.onmouseenter = (e) => {
      newBtn.style.setProperty('filter', 'drop-shadow(0px 0px 10px deepskyblue)');
   };
   newBtn.onmouseleave = (e) => {
      newBtn.style.removeProperty('filter');
   };

   newBtn.setAttribute('title', 'Download');

   newBtn.addEventListener('click', async () => {
      const sections = await getSectionList();

      for (let i = 0; i < sections.length; i++) {
         const { title, markdown_show } = await getMarkdownContent(sections[i].section_id);

         await saveFile(i + 1, title, markdown_show);
      }
   });
   return newBtn;
}

setInterval(() => {
   if (window.location.href.startsWith('https://juejin.cn/book/')) {
      const title = document.querySelector('.book-content__header>div.title');
      if (title && !document.querySelector(`#${btnId}`)) {
         const btn = createCustomBtn();
         title.appendChild(btn);
      }
   }
}, 1000);
